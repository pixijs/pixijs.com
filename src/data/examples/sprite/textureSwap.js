const app = new PIXI.Application() < HTMLCanvasElement > ({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

let isFlower = true;

const texture = PIXI.Texture.from('https://beta.pixijs.com/assets/flowerTop.png');
const secondTexture = PIXI.Texture.from('https://beta.pixijs.com/assets/eggHead.png');

// create a new Sprite using the texture
const character = new PIXI.Sprite(texture);

// center the sprites anchor point
character.anchor.set(0.5);

// move the sprite to the center of the screen
character.x = app.screen.width / 2;
character.y = app.screen.height / 2;

app.stage.addChild(character);

// make the sprite interactive
character.interactive = true;
character.cursor = 'pointer';

character.on('pointertap', () =>
{
    isFlower = !isFlower;
    // Dynamically swap the texture
    character.texture = isFlower ? texture : secondTexture;
});

app.ticker.add(() =>
{
    character.rotation += 0.02;
});
