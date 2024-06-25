import { Texture, TilingSprite } from 'pixi.js';

export function addWaterOverlay(app)
{
    // Create a water texture object.
    const texture = Texture.from('overlay');

    // Create a tiling sprite with the water texture and specify the dimensions.
    const overlay = new TilingSprite({
        texture,
        width: app.screen.width,
        height: app.screen.height,
    });

    // Add the overlay to the stage.
    app.stage.addChild(overlay);

    // Return the water overlay.
    return overlay;
}

export function animateWaterOverlay(overlay, time)
{
    // Extract the delta time from the Ticker object.
    const delta = time.deltaTime;

    // Animate the overlay.
    overlay.tilePosition.x -= delta;
    overlay.tilePosition.y -= delta;
}
