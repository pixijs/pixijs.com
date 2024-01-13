import { Application, Assets, Sprite } from 'pixi.js';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();

    addBackground();
})();

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
        { alias: 'background', src: 'https://pixijs.com/assets/tutorials/pond_background.jpg' },
        { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish1.png' },
        { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish2.png' },
        { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish3.png' },
        { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish4.png' },
        { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish5.png' },
        { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/wave_overlay.png' },
        { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/displacemnet_map.png' },
    ];

    // Load the assets defined above.
    await Assets.load(assets);
}

function addBackground()
{
    /** -- INSERT CODE HERE -- */
}
