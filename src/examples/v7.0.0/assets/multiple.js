import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

// Add the assets to load
PIXI.Assets.add('flowerTop', 'https://pixijs.com/assets/flowerTop.png');
PIXI.Assets.add('eggHead', 'https://pixijs.com/assets/eggHead.png');

// Load the assets and get a resolved promise once both are loaded
const texturesPromise = PIXI.Assets.load(['flowerTop', 'eggHead']); // => Promise<{flowerTop: Texture, eggHead: Texture}>

// When the promise resolves, we have the texture!
texturesPromise.then((textures) =>
{
    // create a new Sprite from the resolved loaded Textures

    const flower = PIXI.Sprite.from(textures.flowerTop);

    flower.anchor.set(0.5);
    flower.x = app.screen.width * 0.25;
    flower.y = app.screen.height / 2;
    app.stage.addChild(flower);

    const egg = PIXI.Sprite.from(textures.eggHead);

    egg.anchor.set(0.5);
    egg.x = app.screen.width * 0.75;
    egg.y = app.screen.height / 2;
    app.stage.addChild(egg);
});
