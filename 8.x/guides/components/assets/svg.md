# SVG's

### Overview

PixiJS provides powerful support for rendering SVGs, allowing developers to integrate scalable vector graphics seamlessly into their projects. This guide explores different ways to use SVGs in PixiJS, covering real-time rendering, performance optimizations, and potential pitfalls.

---

### Why Use SVGs?

SVGs have several advantages over raster images like PNGs:

- ✅ **Smaller File Sizes** – SVGs can be significantly smaller than PNGs, especially for large but simple shapes. A high-resolution PNG may be several megabytes, while an equivalent SVG could be just a few kilobytes.
- ✅ **Scalability** – SVGs scale without losing quality, making them perfect for responsive applications and UI elements.
- ✅ **Editable After Rendering** – Unlike textures, SVGs rendered via Graphics can be modified dynamically (e.g., changing stroke colors, modifying shapes).
- ✅ **Efficient for Simple Graphics** – If the graphic consists of basic shapes and paths, SVGs can be rendered efficiently as vector graphics.

However, SVGs can also be computationally expensive to parse, particularly for intricate illustrations with many paths or effects.

---

### Ways to Render SVGs in PixiJS

PixiJS offers two primary ways to render SVGs:

1. **As a Texture** – Converts the SVG into a texture for rendering as a sprite.
2. **As a Graphics Object** – Parses the SVG and renders it as vector geometry.

Each method has its advantages and use cases, which we will explore below.

---

## 1. Rendering SVGs as Textures

### Overview

SVGs can be loaded as textures and used within Sprites. This method is efficient but does not retain the scalability of vector graphics.

### Example

```ts
const svgTexture = await Assets.load('tiger.svg');
const mySprite = new Sprite(svgTexture);
```

```ts
// description: This example demonstrates loading and displaying SVG graphics using the Graphics class
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

```ts
// description: This example demonstrates how to create and display SVG graphics using the Graphics class
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

```ts
// description: This example demonstrates loading a large SVG texture and displaying it as a sprite
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

```ts
// description: This example demonstrates loading a large SVG texture and displaying it as a sprite
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

### Scaling Textures

You can specify a resolution when loading an SVG as a texture to control its size:
This does increase memory usage, but it be of a higher fidelity.

```ts
const svgTexture = await Assets.load('path/to.svg', {
  resolution: 4, // will be 4 times as big!
});
const mySprite = new Sprite(svgTexture);
```

This ensures the texture appears at the correct size and resolution.

### Pros & Cons

- ✅ **Fast to render** (rendered as a quad, not geometry)
- ✅ **Good for static images**
- ✅ **Supports resolution scaling for precise sizing**
- ✅ **Ideal for complex SVGs that do not need crisp vector scaling** (e.g., UI components with fixed dimensions)
- ❌ **Does not scale cleanly** (scaling may result in pixelation)
- ❌ **Less flexibility** (cannot modify the shape dynamically)
- ❌ **Texture Size Limit** A texture can only be up to 4096x4096 pixels, so if you need to render a larger SVG, you will need to use the Graphics method.

### Best Use Cases

- Background images
- Decorative elements
- Performance-critical applications where scaling isn’t needed
- Complex SVGs that do not require crisp vector scaling (e.g., fixed-size UI components)

---

## 2. Rendering SVGs as Graphics

### Overview

PixiJS can render SVGs as real scalable vector graphics using the `Graphics` class.

### Example

```ts
const graphics = new Graphics().svg('');
```

If you want to use the same SVG multiple times, you can use `GraphicsContext` to share the parsed SVG data across multiple graphics objects, improving performance by parsing it once and reusing it.

```ts
const context = new GraphicsContext().svg('');

const graphics1 = new Graphics(context);
const graphics2 = new Graphics(context);
```

### Loading SVGs as Graphics

Instead of passing an SVG string directly, you can load an SVG file using PixiJS’s `Assets.load` method. This will return a `GraphicsContext` object, which can be used to create multiple `Graphics` objects efficiently.

```ts
const svgContext = await Assets.load('path/to.svg', {
  parseAsGraphicsContext: true, // If false, it returns a texture instead.
});
const myGraphics = new Graphics(svgContext);
```

Since it's loaded via `Assets.load`, it will be cached and reused, much like a texture.

### Pros & Cons

- ✅ **Retains vector scalability** (no pixelation when zooming)
- ✅ **Modifiable after rendering** (change colors, strokes, etc.)
- ✅ **Efficient for simple graphics**
- ✅ **fast rendering if SVG structure does not change** (no need to reparse)
- ❌ **More expensive to parse** (complex SVGs can be slow to render)
- ❌ **Not ideal for static images**

### Best Use Cases

- Icons and UI elements that need resizing
- A game world that needs to remain crisp as a player zooms in
- Interactive graphics where modifying the SVG dynamically is necessary

---

## SVG Rendering Considerations

### Supported Features

PixiJS supports most SVG features that can be rendered in a Canvas 2D context. Below is a list of common SVG features and their compatibility:

| Feature                                 | Supported |
| --------------------------------------- | --------- |
| Basic Shapes (rect, circle, path, etc.) | ✅        |
| Gradients                               | ✅        |
| Stroke & Fill Styles                    | ✅        |
| Text Elements                           | ❌        |
| Filters (Blur, Drop Shadow, etc.)       | ❌        |
| Clipping Paths                          | ✅        |
| Patterns                                | ❌        |
| Complex Paths & Curves                  | ✅        |

### Performance Considerations

- **Complex SVGs:** Large or intricate SVGs can slow down rendering start up due to high parsing costs. Use `GraphicsContext` to cache and reuse parsed data.
- **Vector vs. Texture:** If performance is a concern, consider using SVGs as textures instead of rendering them as geometry. However, keep in mind that textures take up more memory.
- **Real-Time Rendering:** Avoid rendering complex SVGs dynamically. Preload and reuse them wherever possible.

---

## Best Practices & Gotchas

### Best Practices

- ✅ **Use Graphics for scalable and dynamic SVGs**
- ✅ **Use Textures for performance-sensitive applications**
- ✅ **Use `GraphicsContext` to avoid redundant parsing**
- ✅ **Consider `resolution` when using textures to balance quality and memory**

### Gotchas

- ⚠ **Large SVGs can be slow to parse** – Optimize SVGs before using them in PixiJS.
- ⚠ **Texture-based SVGs do not scale cleanly** – Use higher resolution if necessary.
- ⚠ **Not all SVG features are supported** – Complex filters and text elements may not work as expected.

---

By understanding how PixiJS processes SVGs, developers can make informed decisions on when to use `Graphics.svg()`, `GraphicsContext`, or SVG textures, balancing quality and performance for their specific use case.
