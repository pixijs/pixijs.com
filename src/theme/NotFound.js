import React, { useEffect, useState } from 'react';
import NotFound from '@theme-original/NotFound';
import { useHistory, useLocation } from '@docusaurus/router';

export default function NotFoundWrapper(props)
{
    const location = useLocation();
    const history = useHistory();

    const [isRedirecting, setIsRedirecting] = useState(
        location.pathname.startsWith('/tutorials')
            || location.pathname.startsWith('/examples')
            || location.pathname.startsWith('/guides')
            || location.pathname.startsWith('/playground'),
    );

    useEffect(() =>
    {
        if (isRedirecting)
        {
            history.replace(`/8.x${location.pathname}`);
        }
    }, [location, history, isRedirecting]);

    return isRedirecting ? (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    fontSize: '2rem',
                    letterSpacing: '0.05rem',
                }}
            >
                <div
                    style={{
                        border: '16px solid #f3f3f3',
                        borderRadius: '50%',
                        borderTop: '16px solid var(--ifm-color-primary)',
                        width: '120px',
                        height: '120px',
                        animation: 'spin 0.85s linear infinite',
                        marginBottom: '1rem',
                    }}
                ></div>
                Redirecting...
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    ) : (
        <NotFound {...props} />
    );
}
