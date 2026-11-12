# SVGs

PixiJS supports SVG rendering, letting you integrate scalable vector graphics into your projects. This guide covers different ways to use SVGs, including real-time rendering, performance trade-offs, and known limitations.

---

### Why use SVGs?

SVGs have several advantages over raster images like PNGs:

- **Smaller file sizes** - SVGs can be much smaller than PNGs, especially for large but simple shapes. A high-resolution PNG may be several megabytes while an equivalent SVG could be a few kilobytes.
- **Scalability** - SVGs scale without losing quality, making them ideal for responsive applications and UI elements.
- **Editable after rendering** - Unlike textures, SVGs rendered via Graphics can be modified dynamically (e.g., changing stroke colors, modifying shapes).
- **Efficient for simple graphics** - If the graphic consists of basic shapes and paths, SVGs can be rendered efficiently as vector graphics.

However, SVGs can also be computationally expensive to parse, particularly for intricate illustrations with many paths or effects.

---

### Ways to render SVGs in PixiJS

PixiJS offers two primary ways to render SVGs:

1. **As a texture** - Converts the SVG into a texture for rendering as a sprite.
2. **As a Graphics object** - Parses the SVG and renders it as vector geometry.

Each method has its own trade-offs, covered below.

---

## 1. Rendering SVGs as textures

SVGs can be loaded as textures and used within Sprites. This method is efficient but does not retain the scalability of vector graphics.

### Example

```ts
const svgTexture = await Assets.load('tiger.svg');
const mySprite = new Sprite(svgTexture);
```

```js
import { Application, Assets, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const tigerTexture = await Assets.load({
    src: 'https://pixijs.com/assets/tiger.svg',
  });

  const sprite = new Sprite(tigerTexture);

  // line it up as this svg is not centered
  const bounds = sprite.getLocalBounds();

  sprite.pivot.set(
    (bounds.x + bounds.width) / 2,
    (bounds.y + bounds.height) / 2,
  );

  sprite.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(sprite);

  app.ticker.add(() => {
    sprite.rotation += 0.01;
    sprite.scale.set(2 + Math.sin(sprite.rotation));
  });
})();
```

### Scaling textures

You can specify a resolution when loading an SVG as a texture to control its size. This increases memory usage but produces higher fidelity.

```ts
const svgTexture = await Assets.load({
  src: 'path/to.svg',
  data: {
    resolution: 4,
  }
});
const mySprite = new Sprite(svgTexture);
```

```js
import { Application, Assets, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const tigerTexture = await Assets.load({
    src: 'https://pixijs.com/assets/tiger.svg',
    data: {
      resolution: 4,
    },
  });

  const sprite = new Sprite(tigerTexture);

  // line it up as this svg is not centered
  const bounds = sprite.getLocalBounds();

  sprite.pivot.set(
    (bounds.x + bounds.width) / 2,
    (bounds.y + bounds.height) / 2,
  );

  sprite.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(sprite);

  app.ticker.add(() => {
    sprite.rotation += 0.01;
    sprite.scale.set(2 + Math.sin(sprite.rotation));
  });
})();
```

### Pros and cons

**Pros:**
- Fast to render (drawn as a single quad, not geometry)
- Good for static images and complex SVGs with fixed dimensions
- Supports resolution scaling for higher fidelity

**Cons:**
- Scaling causes pixelation (it's a rasterized image)
- Cannot modify shapes dynamically after rasterization
- Texture size limit of 4096x4096 pixels; for larger SVGs, use the Graphics method

### When to use

- Background images
- Decorative elements
- Performance-critical applications where scaling isn't needed
- Complex SVGs with fixed dimensions

---

## 2. Rendering SVGs as Graphics

PixiJS can render SVGs as scalable vector graphics using the `Graphics` class.

### Example

```ts
const graphics = new Graphics().svg('<svg width="100" height="100"><rect width="100" height="100" fill="red"/></svg>');
```

```js
import { Application, Graphics } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    antialias: true,
    backgroundColor: 'white',
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const graphics = new Graphics().svg(`
            <svg height="400" width="450" xmlns="http://www.w3.org/2000/svg">
                <!-- Draw the paths -->
                <path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="4"/>
                <path id="lineBC" d="M 250 50 l 150 300" stroke="red" stroke-width="4"/>
                <path id="lineMID" d="M 175 200 l 150 0" stroke="green" stroke-width="4"/>
                <path id="lineAC" d="M 100 350 q 150 -300 300 0" stroke="blue" fill="none" stroke-width="4"/>

                <!-- Mark relevant points -->
                <g stroke="black" stroke-width="3" fill="black">
                    <circle id="pointA" cx="100" cy="350" r="4" />
                    <circle id="pointB" cx="250" cy="50" r="4" />
                    <circle id="pointC" cx="400" cy="350" r="4" />
                </g>
            </svg>
        `);

  app.stage.addChild(graphics);
})();
```

If you want to use the same SVG multiple times, use `GraphicsContext` to share the parsed SVG data across multiple graphics objects. This parses it once and reuses the result.

```ts
const context = new GraphicsContext().svg(
  '<svg width="100" height="100"><rect width="100" height="100" fill="red"/></svg>',
);

const graphics1 = new Graphics(context);
const graphics2 = new Graphics(context);
```

### Loading SVGs as Graphics

Instead of passing an SVG string directly, load an SVG file using `Assets.load`. This returns a `GraphicsContext` object for creating multiple `Graphics` instances efficiently.

```ts
const svgContext = await Assets.load('path/to.svg', {
  parseAsGraphicsContext: true, // If false, returns a texture instead
});
const myGraphics = new Graphics(svgContext);
```

Since it's loaded via `Assets.load`, the result is cached and reused, similar to a texture.

```js
import { Application, Assets, Graphics } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  const tigerSvg = await Assets.load({
    src: 'https://pixijs.com/assets/tiger.svg',
    data: {
      parseAsGraphicsContext: true,
    },
  });

  const graphics = new Graphics(tigerSvg);

  // line it up as this svg is not centered
  const bounds = graphics.getLocalBounds();

  graphics.pivot.set(
    (bounds.x + bounds.width) / 2,
    (bounds.y + bounds.height) / 2,
  );

  graphics.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(graphics);

  app.ticker.add(() => {
    graphics.rotation += 0.01;
    graphics.scale.set(2 + Math.sin(graphics.rotation));
  });
})();
```

### Pros and cons

**Pros:**
- Retains vector scalability (no pixelation when zooming)
- Modifiable after rendering (change colors, strokes, etc.)
- Efficient for simple shapes; fast if SVG structure doesn't change

**Cons:**
- Expensive to parse initially (complex SVGs with many paths can be slow)
- Higher per-frame cost than a texture for complex geometry

### When to use

- Icons and UI elements that need resizing
- A game world that needs to remain crisp as a player zooms in
- Interactive graphics where modifying the SVG dynamically is necessary

---

## SVG rendering considerations

### Supported features

Texture mode uses the browser's own SVG renderer, so anything the browser can draw works. Graphics mode parses the markup itself and supports:

| Feature                                                                          | Supported |
| -------------------------------------------------------------------------------- | --------- |
| Basic shapes (`rect`, `circle`, `ellipse`, `line`, `polygon`, `polyline`)        | Yes       |
| `path` data, including `fill-rule="evenodd"` holes                               | Yes       |
| `g` grouping with inherited fill and stroke                                      | Yes       |
| `fill`, `stroke`, `stroke-width`, `fill-opacity`, `stroke-opacity`, `opacity`    | Yes       |
| Inline `style="..."` declarations                                                | Yes       |
| Linear gradients (`gradientUnits`, percentage coordinates)                       | Yes       |
| Radial gradients (`cx`/`cy`/`r` outer circle, `fx`/`fy`/`fr` focal circle)       | Yes       |
| `gradientTransform`, `spreadMethod`, `stop-opacity`, gradient `href` inheritance | No        |
| `transform` attributes                                                           | No        |
| `stroke-linecap`, `stroke-linejoin`, `stroke-dasharray`                          | No        |
| `<style>` blocks and CSS classes                                                 | No        |
| Text elements                                                                    | No        |
| Filters (blur, drop shadow, etc.)                                                | No        |
| Clipping paths and masks                                                         | No        |
| Patterns and `<image>`                                                           | No        |

### Performance considerations

- **Complex SVGs:** Large or intricate SVGs can slow down rendering startup due to high parsing costs. Use `GraphicsContext` to cache and reuse parsed data.
- **Vector vs. texture:** If performance is a concern, use SVGs as textures instead of rendering them as geometry. Textures take more memory but render faster.
- **Real-time rendering:** Avoid rendering complex SVGs dynamically. Preload and reuse them wherever possible.

---

## Gotchas

- Large SVGs can be slow to parse. Optimize SVGs before using them in PixiJS.
- Texture-based SVGs do not scale cleanly. Use higher resolution if necessary.
- Not all SVG features are supported. Complex filters and text elements may not work as expected.
