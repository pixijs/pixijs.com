# Bitmap Text

`BitmapText` is a high-performance text rendering solution in PixiJS. Unlike the `Text` class, which rasterizes each string into a new texture, `BitmapText` draws characters from a pre-generated texture atlas. This design allows you to render tens of thousands of text objects with minimal overhead.

```ts
import { Assets, BitmapText } from 'pixi.js';

await Assets.load('fonts/MyFont.fnt');

const text = new BitmapText({
  text: 'Loaded font!',
  style: {
    fontFamily: 'MyFont',
    fontSize: 32,
    fill: '#ffcc00',
  },
});
```

## **Why Use `BitmapText`?**

- ✅ **Fast rendering**: Perfect for HUDs, score counters, timers, etc.
- ✅ **No per-frame rasterization**: Text changes are cheap.
- ✅ **Efficient memory usage**: Shares glyph textures across all instances.
- ✅ **Supports MSDF/SDF fonts**: Crisp scaling without blurring.

**Ideal use cases**:

- Frequently updating text
- Large numbers of text instances
- High-performance or mobile projects

## **How to Load and Use Bitmap Fonts**

### Font Loading

PixiJS supports AngelCode BMFont format and MSDF-compatible `.fnt` and `.xml` files. You can load these files using the `Assets` API.

Once loaded, you can create a `BitmapText` instance with the loaded font using the `fontFamily` property.

```ts
import { Assets, BitmapText } from 'pixi.js';

await Assets.load('fonts/MyFont.fnt');

const text = new BitmapText({
  text: 'Loaded font!',
  style: {
    fontFamily: 'MyFont',
    fontSize: 32,
    fill: '#ffcc00',
  },
});
```

### MSDF and SDF Fonts

PixiJS supports **MSDF** (multi-channel signed distance field) and **SDF** formats for crisp, resolution-independent text. These fonts remain sharp at any size and scale.

You can generate MSDF/SDF fonts using tools like [AssetPack](https://pixijs.io/assetpack/) which can take a `.ttf` or `.otf` font and generate a bitmap font atlas with MSDF/SDF support.

Using MSDF/SDF fonts is similar to using regular bitmap fonts and just requires you to load the appropriate font file:

```ts
import { Assets, BitmapText } from 'pixi.js';

await Assets.load('fonts/MyMSDFFont.fnt');

const text = new BitmapText({
  text: 'Loaded MSDF font!',
  style: {
    fontFamily: 'MyMSDFFont',
  },
});
```

# **Limitations and Caveats**

### ❌ Cannot Update Resolution

`BitmapText.resolution` is not mutable. It must be handled by the `BitmapFont`

```ts
text.resolution = 2;
// ⚠️ [BitmapText] dynamically updating the resolution is not supported.
```

### ⚠️ Large Character Sets Not Practical

Bitmap fonts are limited by texture size. CJK or emoji-rich sets may require too much memory. Use `Text` or `HTMLText` for dynamic internationalization or emoji support.

---

## **API Reference**

- [BitmapText](https://pixijs.download/release/docs/scene.BitmapText.html)
- [BitmapFont](https://pixijs.download/release/docs/text.BitmapFont.html)
- [Assets](https://pixijs.download/release/docs/assets.Assets.html)
- [TextStyle](https://pixijs.download/release/docs/text.TextStyle.html)
- [FillStyle](https://pixijs.download/release/docs/scene.FillStyle.html)
- [StrokeStyle](https://pixijs.download/release/docs/scene.StrokeStyle.html)
