const app = new PIXI.Application() < HTMLCanvasElement > ({ backgroundAlpha: 0, resizeTo: window });

document.body.appendChild(app.view);

// create a new Sprite from an image path.
const bunny = PIXI.Sprite.from('https://beta.pixijs.com/assets/bunny.png');

// center the sprite's anchor point
bunny.anchor.set(0.5);

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

app.ticker.add(() =>
{
    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1;
});
