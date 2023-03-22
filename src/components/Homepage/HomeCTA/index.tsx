import Link from '@docusaurus/Link';
import styles from './index.module.scss';
import type React from 'react';

export interface HomeCTAOptions {
    label: string;
    link: string;
    white?: boolean;
    outline?: boolean;
    style?: React.CSSProperties;
}

export default function HomeCTA(opts: HomeCTAOptions): JSX.Element
{
    let classNames = styles.button;

    if (opts.white)
    {
        classNames += ` ${styles.white}`;
    }

    if (opts.outline ?? false)
    {
        classNames += ` ${styles.outline}`;
    }

    return (
        <Link className={classNames} to={opts.link} style={opts?.style || {}}>
            <div className={styles.buttonShadow}>
                <div></div>
            </div>
            <span>{opts.label}</span>
            <svg
                className="next"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 23 14"
                xmlSpace="preserve"
            >
                <line x1="22" y1="7" x2="16" y2="1"></line>
                <line x1="22" y1="7" x2="16" y2="13"></line>
                <line x1="0" y1="7" x2="23" y2="7"></line>
            </svg>
        </Link>
    );
}
