---
sidebar_position: 3
---

# Tiling Sprite

A `TilingSprite` is a high-performance way to render a repeating texture across a rectangular area. Instead of stretching the texture, it repeats (tiles) it to fill the given space, making it ideal for backgrounds, parallax effects, terrain, and UI panels.

```ts
import { TilingSprite, Texture } from 'pixi.js';

const tilingSprite = new TilingSprite({
    texture: Texture.from('assets/tile.png'),
    width: 400,
    height: 300,
});

app.stage.addChild(tilingSprite);
```

## What is a TilingSprite?

- It draws a texture repeatedly across a defined area.
- The texture is not scaled by default unless you adjust `tileScale`.
- The sprite's overall `width` and `height` determine how much area the tiles fill, independent of the texture's native size.
- The pattern's offset, scale, and rotation can be controlled independently of the object's transform.

## Key Properties

| Property               | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `texture`              | The texture being repeated                                             |
| `tilePosition`         | `ObservablePoint` controlling offset of the tiling pattern             |
| `tileScale`            | `ObservablePoint` controlling scaling of each tile                     |
| `tileRotation`         | Number controlling the rotation of the tile pattern                    |
| `width` / `height`     | The size of the area to be filled by tiles                             |
| `anchor`               | Adjusts origin point of the TilingSprite                               |
| `applyAnchorToTexture` | If `true`, the anchor affects the starting point of the tiling pattern |
| `clampMargin`          | Margin adjustment to avoid edge artifacts (default: `0.5`)             |

### Width & Height vs Scale

Unlike `Sprite`, setting `width` and `height` in a `TilingSprite` directly changes the visible tiling area. It **does not affect the scale** of the tiles.

```ts
// Makes the tiling area bigger
tilingSprite.width = 800;
tilingSprite.height = 600;

// Keeps tiles the same size, just tiles more of them
```

To scale the tile pattern itself, use `tileScale`:

```ts
// Makes each tile appear larger
tilingSprite.tileScale.set(2, 2);
```

### Anchor and applyAnchorToTexture

- `anchor` sets the pivot/origin point for positioning the TilingSprite.
- If `applyAnchorToTexture` is `true`, the anchor also affects where the tile pattern begins.
- By default, the tile pattern starts at (0, 0) in local space regardless of anchor.

---

## API Reference

- [TilingSprite](https://pixijs.download/release/docs/scene.TilingSprite.html)
- [Texture](https://pixijs.download/release/docs/rendering.Texture.html)
