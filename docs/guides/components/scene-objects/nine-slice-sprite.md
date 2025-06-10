---
sidebar_position: 2
description: Learn how to use the NineSliceSprite class in PixiJS for creating scalable UI elements with preserved corners and edges.
---

# NineSlice Sprite

`NineSliceSprite` is a specialized type of `Sprite` that allows textures to be resized while preserving the corners and edges. It is particularly useful for building scalable UI elements like buttons, panels, or windows with rounded or decorated borders.

```ts
import { NineSliceSprite, Texture } from 'pixi.js';

const nineSlice = new NineSliceSprite({
  texture: Texture.from('button.png'),
  leftWidth: 15,
  topHeight: 15,
  rightWidth: 15,
  bottomHeight: 15,
  width: 200,
  height: 80,
});

app.stage.addChild(nineSlice);
```

You can also pass just a texture, and the slice values will fall back to defaults or be inferred from the texture’s `defaultBorders`.

## **How NineSlice Works**

Here’s how a nine-slice texture is divided:

```js
    A                          B
  +---+----------------------+---+
C | 1 |          2           | 3 |
  +---+----------------------+---+
  |   |                      |   |
  | 4 |          5           | 6 |
  |   |                      |   |
  +---+----------------------+---+
D | 7 |          8           | 9 |
  +---+----------------------+---+

Areas:
  - 1, 3, 7, 9: Corners (remain unscaled)
  - 2, 8: Top/Bottom center (stretched horizontally)
  - 4, 6: Left/Right center (stretched vertically)
  - 5: Center (stretched in both directions)
```

This ensures that decorative corners are preserved and the center content can scale as needed.

## **Width and Height Behavior**

Setting `.width` and `.height` on a `NineSliceSprite` updates the **geometry vertices**, not the texture UVs. This allows the texture to repeat or stretch correctly based on the slice regions. This also means that the `width` and `height` properties are not the same as the `scale` properties.

```ts
// The texture will stretch to fit the new dimensions
nineSlice.width = 300;
nineSlice.height = 100;

// The nine-slice will increase in size uniformly
nineSlice.scale.set(2); // Doubles the size
```

### **Original Width and Height**

If you need to know the original size of the nine-slice, you can access it through the `originalWidth` and `originalHeight` properties. These values are set when the `NineSliceSprite` is created and represent the dimensions of the texture before any scaling or resizing is applied.

```ts
console.log(nineSlice.originalWidth);
console.log(nineSlice.originalHeight);
```

## **Dynamic Updates**

You can change slice dimensions or size at runtime:

```ts
nineSlice.leftWidth = 20;
nineSlice.topHeight = 25;
```

Each setter triggers a geometry update to reflect the changes.

---

## **API Reference**

- [NineSliceSprite](https://pixijs.download/release/docs/scene.NineSliceSprite.html)
