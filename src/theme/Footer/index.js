import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

function Footer()
{
    const context = useDocusaurusContext();
    const { footer } = useThemeConfig();
    const { pathname } = useLocation();

    // List the paths where you don't want to show the footer
    const noFooterPaths = ['tutorials', 'playground'];

    if (!footer || noFooterPaths.some((path) => pathname.includes(path)))
    {
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
