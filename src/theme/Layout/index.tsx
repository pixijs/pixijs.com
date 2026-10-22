import ErrorBoundary from '@docusaurus/ErrorBoundary';
import { PageMetadata, SkipToContentFallbackId, ThemeClassNames } from '@docusaurus/theme-common';
import ErrorPageContent from '@theme/ErrorPageContent';
import LayoutProvider from '@theme/Layout/Provider';
import SkipToContent from '@theme/SkipToContent';
import clsx from 'clsx';
import { usePackage } from '@site/src/shell/package';
import Rail from '@site/src/shell/Rail/Rail';
import SearchModal from '@site/src/shell/SearchModal';
import ShellProvider from '@site/src/shell/ShellProvider';
import TopNav from '@site/src/shell/TopNav/TopNav';
import Footer from '@site/src/theme/Footer';
import styles from './styles.module.scss';

import type { Props } from '@theme/Layout';
import type { ReactNode } from 'react';

/**
 * The shell's root (`display: contents`). `data-package` scopes the package accent; `data-app-page` marks an app route
 * (docs app pages mark their article), found in CSS with `html:has([data-app-page])`. Neither is a class on `<html>`:
 * react-helmet-async rewrites those while hydration yields, which repainted pages in the wrong layout.
 */
function ShellRoot({ app, children }: { app?: boolean; children: ReactNode }) {
  const { pkg } = usePackage();

  return (
    <div className={styles.shell} data-package={pkg ?? undefined} data-app-page={app ? '' : undefined}>
      {children}
    </div>
  );
}

/**
 * The app shell around every page: top nav, rail, main, footer and the search dialog. Ejected from theme-classic
 * 3.10.2 (unsafe swizzle): re-diff against `@docusaurus/theme-classic/lib/theme/Layout` on every Docusaurus minor.
 */
export default function Layout({
  children,
  title,
  description,
  noFooter,
  wrapperClassName,
  rail = 'default',
  railSection,
  app,
}: Props) {
  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />
      <SkipToContent />
      <ShellProvider railOwner={rail === 'docs' ? 'docs' : 'layout'}>
        <ShellRoot app={app}>
          <TopNav hideOnScroll={rail === 'docs'} />
          {rail === 'default' && <Rail section={railSection} />}
          <div
            id={SkipToContentFallbackId}
            className={clsx(
              ThemeClassNames.layout.main.container,
              ThemeClassNames.wrapper.main,
              styles.main,
              wrapperClassName,
            )}
          >
            <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>{children}</ErrorBoundary>
          </div>
          {!noFooter && <Footer variant={rail === 'docs' ? 'slim' : 'full'} />}
          <SearchModal />
        </ShellRoot>
      </ShellProvider>
    </LayoutProvider>
  );
}
