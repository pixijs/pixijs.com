# Text

Text is essential in games and applications, and PixiJS provides three different systems to cover different needs:

- **`Text`**: High-quality, styled raster text
- **`BitmapText`**: Ultra-fast, GPU-optimized bitmap fonts
- **`HTMLText`**: Richly formatted HTML inside the Pixi scene

Each approach has tradeoffs in fidelity, speed, and flexibility. Let’s look at when and how to use each one.

## `Text`: Rich Dynamic Text with Styles

The `Text` class renders using the browser's native text engine, and then converts the result into a texture. This allows for:

- Full CSS-like font control
- Drop shadows, gradients, and alignment
- Support for dynamic content and layout

**Use it when**:

- You need detailed font control
- Text changes occasionally
- Fidelity is more important than speed

**Avoid when**:

- You're changing text every frame
- You need to render hundreds of instances

---

## `BitmapText`: High-Performance Glyph Rendering

`BitmapText` uses a pre-baked bitmap font image for glyphs, bypassing font rasterization entirely. This gives:

- High rendering speed
- Ideal for thousands of changing labels
- Low memory usage

**Use it when**:

- You need to render lots of dynamic text
- You prioritize performance over styling
- You predefine the characters and styles

**Avoid when**:

- You need fine-grained style control
- You change fonts or font sizes frequently

To use `BitmapText`, you must first register a bitmap font via:

- `BitmapFont.from(...)` to create on the fly, or
- `Assets.load(...)` if using a 3rd-party BMFont or AngelCode export

---

## `HTMLText`: Styled HTML Inside the Scene

`HTMLText` lets you render actual HTML markup in your PixiJS scene. This allows:

- `<b>`, `<i>`, `<span>` style formatting
- Fine layout and text flow
- Emoji, RTL, links, and more

**Use it when**:

- You want complex HTML-style markup
- Static or semi-dynamic content
- Your users expect "document-like" layout

**Avoid when**:

- You need pixel-perfect performance
- You're rendering hundreds of text blocks
- You need GPU text effects

## Next Steps

Each text type has a corresponding guide that covers setup, font loading, style options, and limitations in more detail:

- [Text Guide →](./canvas.md)
- [BitmapText Guide →](./bitmap.md)
- [HTMLText Guide →](./html.md)
