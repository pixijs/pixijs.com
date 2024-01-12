import { Application, Assets, Sprite, Container } from 'pixi.js';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () =>
{
    await setup();
    await preload();
    this.addBackground();
    this.addFishes();

    // Add the fish animation callback to the application's ticker.
    app.ticker.add(this.animateFishes);
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
    // Create a background sprite.
    const background = Sprite.from('background');

    // Center background sprite anchor.
    background.anchor.set(0.5);

    /**
     * If the preview is landscape, fill the width of the screen
     * and apply horizontal scale to the vertical scale for a uniform fit.
     */
    if (app.screen.width > app.screen.height)
    {
        background.width = app.screen.width;
        background.scale.y = background.scale.x;
    }
    else
    {
    /**
     * If the preview is square or portrait, then fill the height of the screen instead
     * and apply the scaling to the horizontal scale accordingly.
     */
        background.height = app.screen.height;
        background.scale.x = background.scale.y;
    }

    // Position the background sprite in the center of the stage.
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;

    // Add the background to the stage.
    app.stage.addChild(background);
}

function addFishes()
{
    /** -- INSERT CODE HERE -- */
}

function animateFishes(time)
{
    /** -- INSERT CODE HERE -- */
}
