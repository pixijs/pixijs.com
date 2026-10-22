import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import DocTreeSection from '@site/src/shell/Rail/DocTreeSection';
import Rail from '@site/src/shell/Rail/Rail';

import type { Props } from '@theme/DocRoot/Layout';

/**
 * Ejected (theme-classic 3.10.2): the rail replaces Docusaurus's sidebar column and drills into the doc tree. It is
 * fixed, so rendering it here rather than in `Layout` changes nothing on screen and puts the tree in the SSR HTML.
 */
export default function DocRootLayout({ children }: Props) {
  const sidebar = useDocsSidebar();

  return (
    <>
      <BackToTopButton />
      <Rail section={sidebar ? <DocTreeSection sidebar={sidebar} /> : undefined} />
      <DocRootLayoutMain hiddenSidebarContainer={false}>{children}</DocRootLayoutMain>
    </>
  );
}
