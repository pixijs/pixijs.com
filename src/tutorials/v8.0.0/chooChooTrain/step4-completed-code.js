import { Application, Container, Graphics } from 'pixi.js';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () =>
{
    // Intialize the application.
    await app.init({ background: '#021f4b', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    addStars();
    addMoon();
    addMountains();
})();

function addStars()
{
    const starCount = 20;

    // Create a graphics object to hold all the stars.
    const graphics = new Graphics();

    for (let index = 0; index < starCount; index++)
    {
        // Randomize the position, radius, and rotation of each star.
        const x = (index * 0.78695 * app.screen.width) % app.screen.width;
        const y = (index * 0.9382 * app.screen.height) % app.screen.height;
        const radius = 2 + Math.random() * 3;
        const rotation = Math.random() * Math.PI * 2;

        // Draw the star onto the graphics object.
        graphics.star(x, y, 5, radius, 0, rotation).fill({ color: 0xffdf00, alpha: radius / 5 });
    }

    // Add the stars to the stage.
    app.stage.addChild(graphics);
}

function addMoon()
{
    // Parsed Moon SVG.
    const svg = `
        <svg width="111" height="126" viewBox="0 0 111 126" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.99794 104.751C44.7207 104.751 72.869 76.6028 72.869 41.8801C72.869 25.9516 66.9455
                11.4065 57.1812 0.327637C87.3034 4.98731 110.363 31.0291 110.363 62.4566C110.363 97.1793
                82.2144 125.328 47.4917 125.328C28.6975 125.328 11.8294 117.081 0.308472 104.009C3.46679
                104.498 6.70276 104.751 9.99794 104.751Z" fill="#FFDF00"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M57.4922 0.682129C75.7709 10.9731 88 29.7256 88 51.1529C88 83.6533 59.8656 110 25.16
                110C16.9934 110 9.19067 108.541 2.03273 105.887C1.44552 105.272 0.870627 104.646 0.308472
                104.008C3.46679 104.497 6.70276 104.75 9.99794 104.75C44.7207 104.75 72.869 76.6018 72.869
                41.8791C72.869 26.1203 67.0711 11.7158 57.4922 0.682129Z" fill="#DEC61A"/>
        </svg>
    `;

    // Create a moon graphics object from an SVG code.
    const graphics = new Graphics().svg(svg);

    // Position the moon.
    graphics.x = app.screen.width / 2 + 100;
    graphics.y = app.screen.height / 8;

    // Add the moon to the stage.
    app.stage.addChild(graphics);
}

function addMountains()
{
    // Create two mountain groups where one will be on the screen and the other will be off screen.
    // When the first group moves off screen, it will be moved to the right of the second group.
    const group1 = createMountainGroup();
    const group2 = createMountainGroup();

    // Position the 2nd group off the screen to the right.
    group2.x = app.screen.width;

    // Add the mountain groups to the stage.
    app.stage.addChild(group1, group2);

    // Animate the mountain groups
    app.ticker.add((time) =>
    {
        // Calculate the amount of distance to move the mountain groups per tick.
        const dx = time.deltaTime * 0.5;

        // Move the mountain groups leftwards.
        group1.x -= dx;
        group2.x -= dx;

        // Reposition the mountain groups when they move off screen.
        if (group1.x <= -app.screen.width)
        {
            group1.x = app.screen.width;
        }
        if (group2.x <= -app.screen.width)
        {
            group2.x = app.screen.width;
        }
    });
}

function createMountainGroup()
{
    // Create a graphics object to hold all the mountains in a group.
    const graphics = new Graphics();

    // Width of all the mountains.
    const width = app.screen.width / 2;

    // Starting point on the y-axis of all the mountains.
    // This is the bottom of the screen.
    const startY = app.screen.height;

    // Start point on the x-axis of the individual mountain.
    const startXLeft = 0;
    const startXMiddle = Number(app.screen.width) / 4;
    const startXRight = app.screen.width / 2;

    // Height of the individual mountain.
    const heightLeft = app.screen.height / 2;
    const heightMiddle = (app.screen.height * 4) / 5;
    const heightRight = (app.screen.height * 2) / 3;

    // Color of the individual mountain.
    const colorLeft = 0xc1c0c2;
    const colorMiddle = 0x7e818f;
    const colorRight = 0x8c919f;

    graphics
        // Draw the middle mountain
        .moveTo(startXMiddle, startY)
        .bezierCurveTo(
            startXMiddle + width / 2,
            startY - heightMiddle,
            startXMiddle + width / 2,
            startY - heightMiddle,
            startXMiddle + width,
            startY,
        )
        .fill({ color: colorMiddle })

        // Draw the left mountain
        .moveTo(startXLeft, startY)
        .bezierCurveTo(
            startXLeft + width / 2,
            startY - heightLeft,
            startXLeft + width / 2,
            startY - heightLeft,
            startXLeft + width,
            startY,
        )
        .fill({ color: colorLeft })

        // Draw the right mountain
        .moveTo(startXRight, startY)
        .bezierCurveTo(
            startXRight + width / 2,
            startY - heightRight,
            startXRight + width / 2,
            startY - heightRight,
            startXRight + width,
            startY,
        )
        .fill({ color: colorRight });

    // Add the mountains to the stage.
    return graphics;
}
