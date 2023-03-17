import { useEffect } from 'react';

export default function useWidget()
{
    useEffect(() =>
    {
        const body = document.getElementById('openCollectiveWidget');
        const script = document.createElement('script');

        script.setAttribute('src', 'https://opencollective.com/pixijs/banner.js');
        body?.appendChild(script);
    });
}
