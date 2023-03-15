import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import PixiPlayground from '../components/PixiPlayground';
import styles from './playground.module.css';

const defaultCode = `const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);

// create a new Sprite from an image path
const bunny = PIXI.Sprite.from('https://beta.pixijs.com/assets/bunny.png');

// center the sprite's anchor point
bunny.anchor.set(0.5);

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((delta) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    bunny.rotation += 0.1 * delta;
});`;

interface Payload {
    code: string;
}

function writePayload(payload: Payload): void
{
    const json = JSON.stringify(payload);

    history.replaceState(null, '', `#${btoa(json)}`);
}

function clearPayload(): void
{
    history.replaceState(null, '', location.pathname + location.search);
}

// eslint-disable-next-line consistent-return
function readPayload(): Payload | undefined
{
    if (location.hash !== '')
    {
        try
        {
            return JSON.parse(atob(location.hash.substring(1)));
        }
        catch
        {
            // Ignore
        }
    }
}

export default function PlaygroundPage()
{
    return (
        <Layout title={'Playground'} noFooter wrapperClassName={styles.wrapper}>
            <BrowserOnly>
                {() =>
                {
                    const payload = readPayload();
                    const code = payload?.code ?? defaultCode;

                    function onCodeChanged(code?: string): void
                    {
                        if (code !== undefined)
                        {
                            writePayload({ code });
                        }
                        else
                        {
                            clearPayload();
                        }
                    }

                    return <PixiPlayground mode="fullscreen" code={code} onCodeChanged={onCodeChanged} />;
                }}
            </BrowserOnly>
        </Layout>
    );
}
