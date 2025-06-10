import { useLocation } from '@docusaurus/router';
import { useThemeConfig } from '@docusaurus/theme-common';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import React from 'react';

function Footer() {
  const { footer } = useThemeConfig();
  const { pathname } = useLocation();

  // List the paths where you don't want to show the footer
  const noFooterPaths = ['examples', 'tutorials', 'playground'];

  if (!footer || noFooterPaths.some((path) => pathname.includes(path))) {
    return null;
  }

  const { copyright, links, logo, style } = footer;

  return (
    <FooterLayout
      style={style}
      links={links && links.length > 0 && <FooterLinks links={links} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={copyright && <FooterCopyright copyright={copyright} />}
    />
  );
}
export default React.memo(Footer);
