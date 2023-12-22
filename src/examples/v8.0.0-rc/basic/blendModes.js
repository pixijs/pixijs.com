import { Application, Assets, Sprite, Ticker, Rectangle } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    const bgTexture = await Assets.load('https://pixijs.com/assets/bg_rotate.jpg');
    const alienTexture = await Assets.load('https://pixijs.com/assets/flowerTop.png');

    // Create a new background sprite
    const background = new Sprite(bgTexture);

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // Create an array to store references to the dudes
    const dudeArray = [];

    const totaldudes = 20;

    for (let i = 0; i < totaldudes; i++)
    {
        // Create a new alien Sprite
        const dude = new Sprite(alienTexture);

        dude.anchor.set(0.5);

        // Set a random scale for the dude
        dude.scale.set(0.8 + Math.random() * 0.3);

        // Finally let's set the dude to be at a random position...
        dude.x = Math.floor(Math.random() * app.screen.width);
        dude.y = Math.floor(Math.random() * app.screen.height);

        // The important bit of this example, this is how you change the default blend mode of the sprite
        dude.blendMode = 'add';

        // Create some extra properties that will control movement
        dude.direction = Math.random() * Math.PI * 2;

        // This number will be used to modify the direction of the dude over time
        dude.turningSpeed = Math.random() - 0.8;

        // Create a random speed for the dude between 0 - 2
        dude.speed = 2 + Math.random() * 2;

        // Finally we push the dude into the dudeArray so it it can be easily accessed later
        dudeArray.push(dude);

        app.stage.addChild(dude);
    }

    // Create a bounding box for the little dudes
    const dudeBoundsPadding = 100;

    const dudeBounds = new Rectangle(
        -dudeBoundsPadding,
        -dudeBoundsPadding,
        app.screen.width + dudeBoundsPadding * 2,
        app.screen.height + dudeBoundsPadding * 2,
    );

    Ticker.shared.add(() =>
    {
        // Iterate through the dudes and update the positions
        for (let i = 0; i < dudeArray.length; i++)
        {
            const dude = dudeArray[i];

            dude.direction += dude.turningSpeed * 0.01;
            dude.x += Math.sin(dude.direction) * dude.speed;
            dude.y += Math.cos(dude.direction) * dude.speed;
            dude.rotation = -dude.direction - Math.PI / 2;

            // Constrain the dudes' position by testing their bounds...
            if (dude.x < dudeBounds.x)
            {
                dude.x += dudeBounds.width;
            }
            else if (dude.x > dudeBounds.x + dudeBounds.width)
            {
                dude.x -= dudeBounds.width;
            }

            if (dude.y < dudeBounds.y)
            {
                dude.y += dudeBounds.height;
            }
            else if (dude.y > dudeBounds.y + dudeBounds.height)
            {
                dude.y -= dudeBounds.height;
            }
        }
    });
})();
