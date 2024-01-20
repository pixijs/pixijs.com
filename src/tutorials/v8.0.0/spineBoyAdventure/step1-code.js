import '@pixi/spine-pixi';

import { Application, Assets } from 'pixi.js';
import { Spine } from '@pixi/spine-pixi';

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    await Assets.load([
        {
            alias: 'spineSkeleton',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
        },
        {
            alias: 'spineAtlas',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
        },
    ]);

    const spine = Spine.from({
        skeleton: 'spineSkeleton',
        atlas: 'spineAtlas',
    });

    app.stage.addChild(spine);

    spine.scale.set(0.4);
    spine.x = app.screen.width / 2;
    spine.y = app.screen.height - 60;

    spine.state.setAnimation(0, 'walk', true);
})();
