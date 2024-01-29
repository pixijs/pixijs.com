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

    // Trigger character's spawn animation.
    spineBoy.spawn();

    // Animate the character based on the controller's input.
    app.ticker.add(() =>
    {
        // Ignore the update loops while the character is doing the spawn animation.
        if (spineBoy.isSpawning()) return;

        // Update character's state based on the controller's input.
        spineBoy.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
        if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
        else spineBoy.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
        spineBoy.state.hover = controller.keys.down.pressed;
        if (controller.keys.left.pressed) spineBoy.direction = -1;
        else if (controller.keys.right.pressed) spineBoy.direction = 1;
        spineBoy.state.jump = controller.keys.space.pressed;

        // Update character's animation based on the latest state.
        spineBoy.update();
    });
})();
