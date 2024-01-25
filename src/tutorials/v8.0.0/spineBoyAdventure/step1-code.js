import '@pixi/spine-pixi';

import { Application, Assets } from 'pixi.js';
import { SpineBoy } from './SpineBoy';
import { Controller } from './Controller';
import { Scene } from './Scene';

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
        {
            alias: 'sky',
            src: 'http://localhost:3000/assets/tutorials/spineboy-adventure/sky.png',
        },
        {
            alias: 'background',
            src: 'http://localhost:3000/assets/tutorials/spineboy-adventure/background.png',
        },
        {
            alias: 'midground',
            src: 'http://localhost:3000/assets/tutorials/spineboy-adventure/midground.png',
        },
        {
            alias: 'platform',
            src: 'http://localhost:3000/assets/tutorials/spineboy-adventure/platform.png',
        },
    ]);

    const controller = new Controller();
    const scene = new Scene(app.screen.width, app.screen.height);
    const spineBoy = new SpineBoy();

    scene.view.y = app.screen.height;
    spineBoy.view.x = app.screen.width / 2;
    spineBoy.view.y = app.screen.height - scene.floorHeight;

    app.stage.addChild(scene.view, spineBoy.view);

    spineBoy.spawn();

    app.ticker.add((time) =>
    {
        if (spineBoy.isSpawning()) return;

        spineBoy.state.walk = controller.keys.left.pressed || controller.keys.right.pressed;
        if (spineBoy.state.run && spineBoy.state.walk) spineBoy.state.run = true;
        else spineBoy.state.run = controller.keys.left.doubleTap || controller.keys.right.doubleTap;
        spineBoy.state.hover = controller.keys.down.pressed;
        if (controller.keys.left.pressed) spineBoy.direction = -1;
        else if (controller.keys.right.pressed) spineBoy.direction = 1;

        spineBoy.state.jump = controller.keys.space.pressed;
        spineBoy.update(time);

        let speed = 1;

        if (spineBoy.state.hover) speed = 6;
        else if (spineBoy.state.run) speed = 3;

        if (controller.keys.right.pressed) scene.positionX -= speed;
        else if (controller.keys.left.pressed) scene.positionX += speed;
    });
})();
