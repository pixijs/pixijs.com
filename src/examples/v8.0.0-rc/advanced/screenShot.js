import { Application, Assets, Container, Sprite, Text, TextStyle, Ticker } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#111', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // Create and add a container for the bunnies
    const bunnyContainer = new Container();

    // Take the screenshot and download it
    async function takeScreenshot()
    {
        app.stop();
        const url = await app.renderer.extract.base64(bunnyContainer);
        const a = document.createElement('a');

        document.body.append(a);
        a.download = 'screenshot';
        a.href = url;
        a.click();
        a.remove();
        app.start();
    }

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerdown', takeScreenshot);

    for (let i = 0; i < 25; i++)
    {
        const bunny = new Sprite(texture);

        bunny.anchor.set(0.5);
        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        bunnyContainer.addChild(bunny);
    }

    bunnyContainer.x = 400;
    bunnyContainer.y = 300;
    bunnyContainer.pivot.x = bunnyContainer.width / 2;
    bunnyContainer.pivot.y = bunnyContainer.height / 2;

    // Animate the bunnies container
    Ticker.shared.add((time) =>
    {
        bunnyContainer.rotation += 0.01 * time.deltaTime;
    });

    const style = new TextStyle({
        fontFamily: 'Roboto',
        fill: '#999',
    });

    const screenshotText = new Text({ text: 'Click To Take Screenshot', style });

    screenshotText.x = Math.round((app.screen.width - screenshotText.width) / 2);
    screenshotText.y = Math.round(screenshotText.height / 2);

    app.stage.addChild(screenshotText, bunnyContainer);
})();
