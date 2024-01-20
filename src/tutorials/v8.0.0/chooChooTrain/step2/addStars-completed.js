import { Graphics } from 'pixi.js';

export function addStars(app)
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
