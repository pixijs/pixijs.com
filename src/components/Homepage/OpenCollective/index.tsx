import { useEffect } from 'react';
import styles from './index.module.scss';

export default function ClosingSection(): JSX.Element
{
    useEffect(() =>
    {
        const body = document.getElementById('openCollectiveWidget');

        const script = document.createElement('script');

        script.setAttribute('id', 'iframeWidget');
        script.setAttribute('src', `https://opencollective.com/pixijs/banner.js?style={"h2":{"color":"gray"}}`);

        body?.appendChild(script);

        return () =>
        {
            script?.remove();
        };
    });

    return <div id="openCollectiveWidget" className={`${styles.wrapper}`}></div>;
}
