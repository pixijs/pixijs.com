import '@pixi/spine-pixi';

import { Application, Assets } from 'pixi.js';
import { SpineBoy } from './SpineBoy';
import { Controller } from './Controller';

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Load the assets.
    await Assets.load([
        {
            alias: 'spineSkeleton',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/spineboy.skel',
        },
        {
            alias: 'spineAtlas',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/spineboy.atlas',
        },
        {
            alias: 'sky',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png',
        },
        {
            alias: 'background',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/background.png',
        },
        {
            alias: 'midground',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png',
        },
        {
            alias: 'platform',
            src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/platform.png',
        },
    ]);

    // Create our character
    const spineBoy = new SpineBoy();

    // Adjust views' transformation.
    spineBoy.view.x = app.screen.width / 2;
    spineBoy.view.y = app.screen.height - 80;
    spineBoy.spine.scale.set(0.5);

    // Add character to the stage.
    app.stage.addChild(spineBoy.view);

    /** -- INSERT CODE HERE -- */
})();
