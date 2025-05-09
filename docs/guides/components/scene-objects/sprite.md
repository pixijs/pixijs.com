# Sprite

Sprites are the foundational visual elements in PixiJS. They represent a single image to be displayed on the screen. Each [Sprite](https://pixijs.download/release/docs/scene.Sprite.html) contains a [Texture](https://pixijs.download/release/docs/rendering.Texture.html) to be drawn, along with all the transformation and display state required to function in the scene graph.

```ts
import { Assets, Sprite } from 'pixi.js';

const texture = await Assets.load('path/to/image.png');
const sprite = new Sprite(texture);

sprite.anchor.set(0.5);
sprite.position.set(100, 100);
sprite.scale.set(2);
sprite.rotation = Math.PI / 4; // Rotate 45 degrees
```

## Updating the Texture

If you change the texture of a sprite, it will automatically:

- Rebind listeners for texture updates
- Recalculate width/height if set so that the visual size remains the same
- Trigger a visual update

```ts
const texture = Assets.get('path/to/image.png');
sprite.texture = texture;
```

## **Scale vs Width/Height**

Sprites inherit `scale` from `Container`, allowing for percentage-based resizing:

```ts
sprite.scale.set(2); // Double the size
```

Sprites also have `width` and `height` properties that act as _convenience setters_ for `scale`, based on the texture’s dimensions:

```ts
sprite.width = 100; // Automatically updates scale.x
// sets: sprite.scale.x = 100 / sprite.texture.orig.width;
```

## API Reference

| Property / Method    | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| **Sprite.from(...)** | Static method to create a sprite from a texture, URL, or HTML source. |
| **texture**          | The current `Texture` displayed by the sprite.                        |
| **anchor**           | Normalized origin point (0.0–1.0). Affects position and rotation.     |
| **visualBounds**     | Texture bounds including trimming and anchor.                         |
| **roundPixels**      | Rounds the sprite's position to the nearest whole pixel.              |
| **position**         | Local position (`.x`, `.y`)                                           |
| **width**            | Width in pixels                                                       |
| **height**           | Height in pixels                                                      |
| **rotation**         | Rotation in radians                                                   |
| **angle**            | Rotation in degrees (alias for `rotation`)                            |
| **scale**            | `.x` and `.y` scale factors                                           |
| **pivot**            | Transform origin for scaling/rotation                                 |
| **skew**             | Skew values in radians                                                |
| **alpha**            | Opacity (0 to 1)                                                      |
| **visible**          | Whether the container and its subtree is rendered                     |
| **tint**             | Tint color                                                            |
| **renderable**       | Whether the container itself is renderable (still updates children)   |
