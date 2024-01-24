import { Application, Assets } from 'pixi.js';
import { addBackground } from './addBackground';
import { addFishes, animateFishes } from './addFishes';
import { addWaterOverlay, animateWaterOverlay } from './addWaterOverlay';
import { addDisplacementEffect } from './addDisplacementEffect';

// Create a PixiJS application.
const app = new Application();

// Store an array of fish sprites for animation.
const fishes = [];

async function setup()
{
    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
}

async function preload()
{
    // Create an array of asset data to load.
    const assets = [
        { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
        { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
        { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
        { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
        { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
        { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
        { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
        { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
    ];

    // Load the assets defined above.
    await Assets.load(assets);
}

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();

    addBackground(app);
    addFishes(app, fishes);
    addWaterOverlay(app);
    addDisplacementEffect(app);

    // Add the animation callbacks to the application's ticker.
    app.ticker.add((time) =>
    {
        animateFishes(app, fishes, time);
        animateWaterOverlay(app, time);
    });
})();
