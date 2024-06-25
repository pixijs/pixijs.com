# Adding Water Overlay

At the point, the fishes look like they are floating on the rocks and pebbles. We will overlay what we have so far with a tiling sprite of a tiled water texture. Tiling sprite is essentially a sprite with the capabilities of transforming and rending an infinitely repeating grid of a single texture, preferably a tiled one where the edges seamlessly connect with each other when put together. We will use this to give an illusion of a forever moving water surface.

## Create and Setup Tiling Sprite

Here we create a tiling sprite, supplying a texture and dimensions as an option object, and add it to the stage.

```javascript
const texture = Texture.from('overlay');

const overlay = new TilingSprite({
    texture,
    width: app.screen.width,
    height: app.screen.height,
});

app.stage.addChild(overlay);

return overlay;
```

## Animate Overlay

Similar to the previous step, we will now animate the water overlay using the application's ticker. The code has been modified to call both animation functions for the fish and overlay, so now we only need to add the animation logic inside the `animateWaterOverlay` function.

```javascript
const delta = time.deltaTime;

overlay.tilePosition.x -= delta;
overlay.tilePosition.y -= delta;
```

Congratulations, we have now completed a beautiful pond! But we can take it a step further. Let's proceed to the final touch!