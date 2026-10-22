import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import DocSidebarItems from '@theme/DocSidebarItems';
import Icon from '@site/src/components/ui/Icon';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import { usePackage } from '../package';
import styles from './Rail.module.scss';

import type { PropSidebar } from '@docusaurus/plugin-content-docs';
import type { SegmentOption } from '@site/src/components/ui/SegmentedControl';

type Tab = 'guides' | 'tutorials' | 'examples';

/** Section tabs follow the sidebar's name; every 2D and 3D docs sidebar is one of these two */
const TAB_OF_SIDEBAR: Record<string, Tab> = { guidesSidebar: 'guides', examplesSidebar: 'examples' };

interface DocTreeSectionProps {
  sidebar: { name: string; items: PropSidebar };
}

/** The rail's drill-down on docs pages: package and its API link, section tabs, then the doc tree */
export default function DocTreeSection({ sidebar }: DocTreeSectionProps) {
  const { pathname } = useLocation();
  const { def, version, versionName } = usePackage();
  const tabs: SegmentOption<Tab>[] = [
    { value: 'guides', label: 'Guides', to: version.guides },
    { value: 'tutorials', label: 'Tutorials', to: version.tutorials },
    { value: 'examples', label: 'Examples', to: version.examples },
  ];

  return (
    <div data-verify="rail-section" data-package={def.id}>
      <div className={styles.sectionHead}>
        <span className={styles.glyph}>
          <span className={styles.dot} />
        </span>
        <span>{def.label}</span>
        {versionName !== 'current' && <small>{version.label}</small>}
        {version.api ? (
          <Link to={version.api} className={styles.api} target="_blank" rel="noopener noreferrer">
            API
            <Icon name="external" size={12} strokeWidth={2} />
            <span className={styles.srOnly}>(opens in a new tab)</span>
          </Link>
        ) : (
          <span className={styles.api} aria-disabled="true">
            API · soon
          </span>
        )}
      </div>
      <SegmentedControl
        as="links"
        size="xs"
        fill
        className={styles.tabs}
        label={`${def.name} sections`}
        options={tabs}
        value={TAB_OF_SIDEBAR[sidebar.name] ?? 'guides'}
      />
      <nav aria-label="Docs" className={`${styles.tree} ${styles.sectionBody}`}>
        <ul className="menu__list">
          <DocSidebarItems items={sidebar.items} activePath={pathname} level={1} />
        </ul>
      </nav>
    </div>
  );
}
