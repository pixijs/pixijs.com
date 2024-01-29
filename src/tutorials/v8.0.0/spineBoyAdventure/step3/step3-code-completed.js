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
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
        },
        {
            alias: 'spineAtlas',
            src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
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

    // Create a controller that handles keyboard inputs.
    const controller = new Controller();

    // Create our character
    const spineBoy = new SpineBoy();

    // Adjust views' transformation.
    spineBoy.view.x = app.screen.width / 2;
    spineBoy.view.y = app.screen.height - 80;
    spineBoy.spine.scale.set(0.5);

    // Add character to the stage.
    app.stage.addChild(spineBoy.view);

    let currentAnimation;

    // Animate the character - just testing the controller at this point
    app.ticker.add((time) =>
    {
        const rightPressed = controller.keys.right.pressed;
        const animationName = rightPressed ? 'walk' : 'idle';
        const loop = true;

        // Apply the animation if it's different from the active one.
        if (currentAnimation !== animationName)
        {
            // Store the current animation name.
            currentAnimation = animationName;

            // Animate the character spine based on the right key state,
            spineBoy.spine.state.setAnimation(0, animationName, loop);
        }
    });
})();
