import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Icon from '@site/src/components/ui/Icon';
import { usePackage } from '../package';
import VersionPill from '../Rail/VersionPill';
import { useShell } from '../ShellProvider';
import styles from './TopNav.module.scss';

/** The 56 px bar below 768 px: menu, logo, package chip, search, GitHub */
export default function MobileBar() {
  const { pkg, def } = usePackage();
  const { drawerOpen, setDrawerOpen, setSearchOpen } = useShell();
  const logo = useBaseUrl('/images/logo.svg');

  return (
    <div className={styles.mobile}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Open menu"
        aria-expanded={drawerOpen}
        aria-controls="pixi-rail"
        onClick={() => setDrawerOpen(true)}
      >
        <Icon name="menu" size={22} />
      </button>
      <Link to="/" className={styles.logo} aria-label="PixiJS home">
        <img src={logo} alt="" width={61} height={24} />
      </Link>
      {pkg && <VersionPill variant="chip" className={styles.chip} />}
      <button type="button" className={`${styles.iconButton} ${styles.push}`} onClick={() => setSearchOpen(true)}>
        <Icon name="search" size={20} label="Search" />
      </button>
      <a
        href={def.github}
        className={`${styles.iconButton} ${styles.githubIcon}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="github" size={18} label="GitHub" />
      </a>
    </div>
  );
}
