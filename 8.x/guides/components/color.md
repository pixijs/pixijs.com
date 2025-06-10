# Color

The `Color` class in PixiJS is a flexible utility for representing colors. It is used throughout the rendering pipeline for things like tints, fills, strokes, gradients, and more.

```ts
import { Color, Sprite, Texture, Graphics } from 'pixi.js';

const red = new Color('red'); // Named color
const green = new Color(0x00ff00); // Hex
const blue = new Color('#0000ff'); // Hex string
const rgba = new Color({ r: 255, g: 0, b: 0, a: 0.5 }); // RGBA object

console.log(red.toArray()); // [1, 0, 0, 1]
console.log(green.toHex()); // "#00ff00"

const sprite = new Sprite(Texture.WHITE);
sprite.tint = red; // Works directly with a Color instance
```

## Using `Color` and `ColorSource`

PixiJS supports many color formats through the `ColorSource` type:

- Color names: `'red'`, `'white'`, `'blue'`, etc.
- Hex integers: `0xffcc00`
- Hex strings: `'ffcc00'`, `'#f00'`, `'0xffcc00ff'`
- RGB(A) objects: `{ r: 255, g: 0, b: 0 }`, `{ r: 255, g: 0, b: 0, a: 0.5 }`
- RGB(A) strings: `'rgb(255,0,0)'`, `'rgba(255,0,0,0.5)'`
- RGB(A) arrays: `[1, 0, 0]`, `[1, 0, 0, 0.5]`
- Typed arrays: `Uint8Array`, `Float32Array`
- HSL/HSV objects and strings
- `Color` instances

Whenever you see a color-related property (e.g., `fill`, `tint`, `stroke`), you can use any of these formats. The library will automatically convert them to the appropriate format internally.

```ts
import { Graphics, Sprite, Texture } from 'pixi.js';

const sprite = new Sprite(Texture.WHITE);
sprite.tint = 'red'; // converted internally

const graphics = new Graphics();
graphics.fill({ color: '#00ff00' }); // Also converted internally
```

---

## API Reference

- [Color](https://pixijs.download/release/docs/color.Color.html)
