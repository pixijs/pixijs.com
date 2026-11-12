import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { memo } from 'react';
import Icon from '@site/src/components/ui/Icon';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import { FOOTER_COLUMNS, hrefOf, SOCIAL } from '@site/src/data/navigation';
import { usePackages } from '@site/src/shell/package';
import styles from './styles.module.scss';

import type { NavLink } from '@site/src/data/navigation';

/** The build's year, from the configured copyright, so server and client always print the same one */
function useYear(): string {
  const { copyright = '' } = useThemeConfig().footer ?? {};

  return /\d{4}/.exec(copyright)?.[0] ?? '';
}

function Social() {
  return (
    <ul className={styles.social}>
      {SOCIAL.map((link) => (
        <li key={link.label}>
          <a href={link.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            {link.icon && <Icon name={link.icon} size={16} label={link.label} />}
          </a>
        </li>
      ))}
    </ul>
  );
}

function FooterLink({ link, to }: { link: NavLink; to: string }) {
  return link.href ? (
    <a href={link.href} className={styles.link} target="_blank" rel="noopener noreferrer">
      {link.label}
      <Icon name="external" size={11} strokeWidth={2} className={styles.external} />
    </a>
  ) : (
    <Link to={to} className={styles.link}>
      {link.label}
    </Link>
  );
}

interface FooterProps {
  /** `slim` is the one-row docs footer; app routes hide the footer in CSS */
  variant?: 'full' | 'slim';
}

/** Site footer: the site map on marketing and reading pages, one row on docs */
function Footer({ variant = 'full' }: FooterProps) {
  const year = useYear();
  const logo = useBaseUrl('/images/logo.svg');
  const latest = usePackages()['2d'].versions.current;
  const labour = (
    <>
      A labour of love built by the <Link to="/team">PixiJS team</Link>.
    </>
  );

  if (variant === 'slim') {
    return (
      <footer className={`${styles.footer} ${styles.slim}`} data-verify="footer">
        <p className={styles.copyright}>
          © {year} PixiJS. {labour}
        </p>
        <Social />
      </footer>
    );
  }

  return (
    <footer className={styles.footer} data-verify="footer">
      <WaveDivider from="bg" to="ground" variant="drift" className={styles.wave} />
      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="PixiJS home">
              <img src={logo} alt="" width={71} height={28} />
            </Link>
            <p>{labour}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} className={styles.column} aria-label={column.title}>
              <h2 className={styles.heading}>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} to={hrefOf(link, latest)} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© {year} PixiJS</p>
          <Social />
          <p className={styles.built}>Built with PixiJS</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
