# Adding Water Overlay

At the point, the fishes look like they are floating on the rocks and pebbles. We will overlay what we have so far with a tiling sprite of a tiled water texture. Tiling sprite is essentially a sprite with the capabilities of transforming and rending an infinitely repeating grid of a single texture, preferably a tiled one where the edges seamlessly connect with each other when put together. We will use this to give an illusion of a forever moving water surface.

## Create and Setup Tiling Sprite

Here we create a tiling sprite, supplying a texture and dimensions as an option object, and add it to the stage.

```javascript
// Create a water texture object.
const texture = Texture.from('overlay');

// Create a tiling sprite with the water texture and specify the dimensions.
overlay = new TilingSprite({
  texture,
  width: app.screen.width,
  height: app.screen.height,
});

// Add the overlay to the stage.
app.stage.addChild(overlay);
```

## Animate Overlay

Similar to the previous step, we will now animate the water overlay using the application's ticker. The code has been modified to call both animation functions for the fish and this overlay so we only need to add the animation logic inside the `animateWaterOverlay` function:

```javascript
// Extract the delta time from the Ticker object.
const delta = time.deltaTime;

// Animate the overlay.
overlay.tilePosition.x -= delta;
overlay.tilePosition.y -= delta;
```

Congratulations, we have now completed a beautiful pond! But we can take it a step further. Let's proceed to the final touch!
