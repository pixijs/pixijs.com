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

---

## API Reference

- [Sprite](https://pixijs.download/release/docs/scene.Sprite.html)
- [Texture](https://pixijs.download/release/docs/rendering.Texture.html)
- [Assets](https://pixijs.download/release/docs/assets.Assets.html)
