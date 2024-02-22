import 'pixi.js/advanced-blend-modes';

import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
        antialias: true,
        backgroundColor: 'white',
        resizeTo: window,
        // NEEDS TO BE TRUE FOR WEBGL!
        useBackBuffer: true,
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const pandaTexture = await Assets.load(`https://pixijs.com/assets/panda.png`);
    const rainbowGradient = await Assets.load(`https://pixijs.com/assets/rainbow-gradient.png`);

    const allBlendModes = [
        'normal',
        'add',
        'screen',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'linear-burn',
        'linear-dodge',
        'linear-light',
        'hard-light',
        'soft-light',
        'pin-light',
        'difference',
        'exclusion',
        'overlay',
        'saturation',
        'color',
        'luminosity',
        'add-npm',
        'subtract',
        'divide',
        'vivid-light',
        'hard-mix',
        'negation',
    ];

    const size = 800 / 5;

    const pandas = [];

    for (let i = 0; i < allBlendModes.length; i++)
    {
        const container = new Container();

        const sprite = new Sprite({
            texture: pandaTexture,
            width: 100,
            height: 100,
            anchor: 0.5,
            position: { x: size / 2, y: size / 2 },
        });

        pandas.push(sprite);

        const sprite2 = new Sprite({
            texture: rainbowGradient,
            width: size,
            height: size,
            blendMode: allBlendModes[i],
        });

        container.addChild(sprite, sprite2);

        app.stage.addChild(container);

        container.x = (i % 5) * size;
        container.y = Math.floor(i / 5) * size;
    }

    app.ticker.add(() =>
    {
        pandas.forEach((panda, i) =>
        {
            panda.rotation += 0.01 * (i % 2 ? 1 : -1);
        });
    });
})();
