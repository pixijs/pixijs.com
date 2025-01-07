import { Application, Assets, Container, Graphics, Point, Sprite } from 'pixi.js';
import { generateSpinner1 } from './spinner1';
import { generateSpinner2 } from './spinner2';
import { generateSpinner3 } from './spinner3';
import { generateSpinner4 } from './spinner4';
import { generateSpinner5 } from './spinner5';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ antialias: true, background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    await Assets.load([
        'https://pixijs.com/assets/bg_scene_rotate.jpg',
        'https://pixijs.com/assets/bg_rotate.jpg',
        'https://pixijs.com/assets/circle.png',
    ]);

    const onTick = [
        generateSpinner1(app, new Point(50, 50)),
        generateSpinner2(app, new Point(160, 50)),
        generateSpinner3(app, new Point(270, 50)),
        generateSpinner4(app, new Point(380, 50)),
        generateSpinner5(app, new Point(490, 50)),
    ];

    // Listen for animate update
    app.ticker.add((time) =>
    {
        // Call tick handling for each spinner.
        onTick.forEach((cb) =>
        {
            cb(time.deltaTime);
        });
    });
})();
