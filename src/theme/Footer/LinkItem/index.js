/* eslint-disable react/prop-types */
import React from 'react';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';

export default function FooterLinkItem({ item })
{
    const { to, href, label, prependBaseUrlToHref, ...props } = item;
    const toUrl = useBaseUrl(to);
    const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

    return (
        <Link
            className="footer__link-item"
            {...(href
                ? {
                    href: prependBaseUrlToHref ? normalizedHref : href,
                }
                : {
                    to: toUrl,
                })}
            {...props}
        >
            {label}
            {href && !isInternalUrl(href) && <IconExternalLink />}
        </Link>
    );
}
