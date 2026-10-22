import { useDoc } from '@docusaurus/plugin-content-docs/client';
import ContentVisibility from '@theme/ContentVisibility';
import DocItemContent from '@theme/DocItem/Content';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocVersionBanner from '@theme/DocVersionBanner';
import clsx from 'clsx';
import DocActions from './DocActions';
import TocColumn from './TocColumn';
import TocMenu from './TocMenu';
import Eyebrow from '@site/src/shell/Eyebrow';
import styles from './styles.module.scss';

import type { Props } from '@theme/DocItem/Layout';

/**
 * Ejected (theme-classic 3.10.2). Front matter `app: true` (examples, playground, tutorials) gives a bare full-bleed
 * page marked `data-app-page`. Other docs get the eyebrow and both TOCs; CSS shows the right column from 1280 px and the
 * menu below it, so nothing depends on the window size during render.
 */
export default function DocItemLayout({ children }: Props) {
  const { frontMatter, toc, metadata } = useDoc();
  const hasToc = !frontMatter.hide_table_of_contents && toc.length > 0;

  if ((frontMatter as { app?: boolean }).app) {
    return (
      <>
        <ContentVisibility metadata={metadata} />
        <article className={styles.app} data-app-page="">
          <DocItemContent>{children}</DocItemContent>
        </article>
      </>
    );
  }

  return (
    <div className={clsx(styles.layout, hasToc && styles.withToc)}>
      <div className={styles.content}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <article>
          <div className={styles.head}>
            <Eyebrow />
            {hasToc && <TocMenu />}
          </div>
          <DocItemContent>{children}</DocItemContent>
          <DocItemFooter />
        </article>
        <DocItemPaginator />
      </div>
      {hasToc && (
        <TocColumn footer={<DocActions />}>
          <DocItemTOCDesktop />
        </TocColumn>
      )}
    </div>
  );
}
