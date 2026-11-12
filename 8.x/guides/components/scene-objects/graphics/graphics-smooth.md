# Smooth Graphics

[`SmoothGraphics`](https://pixijs.download/v8.23.0/docs/scene.SmoothGraphics.html) is a [`Graphics`](https://pixijs.download/v8.23.0/docs/scene.Graphics.html) that anti-aliases its edges in the shader. Every edge of a fill or stroke gets about one pixel of coverage, computed from the geometry in render target pixels, so shapes stay smooth without MSAA, at any scale and resolution.

It has the same drawing API as `Graphics`, so you can switch a `Graphics` to a `SmoothGraphics` without changing the drawing code.

---

```js
import {
  Application,
  Graphics,
  GraphicsContext,
  SmoothGraphics,
  Text,
} from 'pixi.js';

const DESIGN_W = 1280;
const DESIGN_H = 720;

/** Creates a monospace label centered on (x, y) in the 1280x720 design space */
function createLabel(text, x, y, color, size = 15, fontWeight = 'normal') {
  const label = new Text({
    text,
    anchor: 0.5,
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: size,
      fontWeight,
      fill: color,
      dropShadow: { color: 0x000000, alpha: 0.45, blur: 4, distance: 2 },
    },
  });

  label.position.set(x, y);

  return label;
}

/**
 * Draws a dial of thin lines, curves and a star: the edges where aliasing shows most
 * @returns A new context, for one kind of graphics: a Graphics and a SmoothGraphics can't share it
 */
function createDial() {
  const context = new GraphicsContext();

  for (let i = 0; i < 60; i++) {
    const cos = Math.cos((i / 60) * Math.PI * 2);
    const sin = Math.sin((i / 60) * Math.PI * 2);
    const inner = i % 5 === 0 ? 150 : 162;

    context.moveTo(cos * inner, sin * inner).lineTo(cos * 172, sin * 172);
  }
  context.stroke({ width: 1, color: 0xb1e8ff, alpha: 0.8 });
  context.circle(0, 0, 182).stroke({ width: 2, color: 0xb1e8ff });

  // rotate() changes the transform of everything drawn after it, so save and restore around the orbits
  context.save();
  for (let i = 0; i < 3; i++) {
    context
      .rotate(Math.PI / 3)
      .ellipse(0, 0, 138, 46)
      .stroke({ width: 1, color: 0xffd166, alpha: 0.9 });
  }
  context.restore();

  context
    .star(0, 0, 5, 96, 44)
    .fill(0xff5ea8)
    .stroke({ width: 3, color: 0xffffff });
  context.circle(0, 0, 18).fill(0xffd166);

  return context;
}

(async () => {
  const app = new Application();

  // No MSAA on this canvas: Graphics edges step, SmoothGraphics edges are anti-aliased in the shader
  await app.init({ antialias: false, backgroundAlpha: 0, resizeTo: window });
  document.body.appendChild(app.canvas);
  document.body.style.background =
    'radial-gradient(ellipse at center, #2a3a50 0%, #131a26 55%, #060a10 100%)';

  // The card is a SmoothGraphics too, so its rounded corners stay smooth
  const card = new SmoothGraphics()
    .roundRect(60, 60, DESIGN_W - 120, DESIGN_H - 120, 24)
    .fill({ color: 0x09111a, alpha: 0.82 })
    .stroke({ width: 2, color: 0x4fe6ff, alpha: 0.2 })
    .moveTo(640, 150)
    .lineTo(640, 560)
    .stroke({ width: 2, color: 0x334455, alpha: 0.6 })
    .roundRect(552, 590, 176, 32, 16)
    .fill({ color: 0x141d2b })
    .stroke({ width: 1.5, color: 0xffd166, alpha: 0.45 });

  // The same dial, with a context each
  const dials = [new Graphics(createDial()), new SmoothGraphics(createDial())];

  dials[0].position.set(350, 360);
  dials[1].position.set(930, 360);

  app.stage.addChild(
    card,
    ...dials,
    createLabel('new Graphics()', 350, 112, 0xffb9c8, 22, 'bold'),
    createLabel('new SmoothGraphics()', 930, 112, 0xb1e8ff, 22, 'bold'),
    createLabel('stair-stepped edges without MSAA', 350, 606, 0xffcbd4),
    createLabel('edges anti-aliased in the shader', 930, 606, 0xc2f0ff),
    createLabel('antialias: false', 640, 606, 0xffd166),
  );

  function layout() {
    const scale = Math.min(
      app.screen.width / DESIGN_W,
      app.screen.height / DESIGN_H,
    );

    app.stage.scale.set(scale);
    app.stage.position.set(
      (app.screen.width - DESIGN_W * scale) / 2,
      (app.screen.height - DESIGN_H * scale) / 2,
    );
  }

  layout();
  app.renderer.on('resize', layout);

  // Slow turn and zoom: the steps crawl along the Graphics edges, the smooth edges hold
  let elapsed = 0;

  app.ticker.add((time) => {
    elapsed += time.deltaMS / 1000;

    for (const dial of dials) {
      dial.rotation = elapsed * 0.15;
      dial.scale.set(1 + Math.sin(elapsed * 0.8) * 0.12);
    }
  });
})();
```

## Basic usage

```ts
import { SmoothGraphics } from 'pixi.js';

const graphics = new SmoothGraphics()
  .circle(100, 100, 50)
  .fill(0xde3249)
  .stroke({ width: 2, color: 0xffffff });

app.stage.addChild(graphics);
```

Everything `Graphics` draws works the same way: shapes, paths, holes with `cut()`, texture fills and strokes, [`FillGradient`](https://pixijs.download/v8.23.0/docs/scene.FillGradient.html), [`FillPattern`](https://pixijs.download/v8.23.0/docs/scene.FillPattern.html), `graphics.texture()`, stroke caps, joins and alignment, tint, alpha and blend modes.

## When to use it

Use `SmoothGraphics` when the edges of vector shapes have to look smooth and MSAA can't do it:

- The renderer is created with `antialias: false`, for performance or because MSAA is not available.
- The shapes are drawn into a [`RenderTexture`](https://pixijs.download/v8.23.0/docs/rendering.RenderTexture.html), through a filter, or with `cacheAsTexture()`: these don't use MSAA by default.
- The scene has thin lines, or is zoomed in and out, and MSAA's few samples per pixel leave visible steps.

`Graphics` is cheaper to build and to move, so keep it for shapes that don't need smooth edges, or when MSAA (`antialias: true`) already looks good enough.

## Line width independent from the scale

As with `Graphics`, a stroke scales with the transform of the object. Set `pixelLine: true` to keep the width in screen pixels. Unlike `Graphics`, which always draws pixel lines 1 pixel wide, `SmoothGraphics` keeps the `width` of the stroke:

```ts
const graphics = new SmoothGraphics().circle(0, 0, 10).stroke({ width: 2, color: 0xffffff, pixelLine: true });

graphics.scale.set(5); // the circle grows, its stroke stays 2 pixels wide
```

## Dashed lines

Set a [`DashLineShader`](https://pixijs.download/v8.23.0/docs/scene.DashLineShader.html) as the custom shader of the context to dash its strokes:

```ts
import { DashLineShader, SmoothGraphics } from 'pixi.js';

const dashes = new DashLineShader({ dash: 10, gap: 5 });
const graphics = new SmoothGraphics();

graphics.context.customShader = dashes;
graphics.moveTo(0, 0).lineTo(200, 100).stroke({ width: 3, color: 0xffffff });

// dash and gap can be changed at any time
dashes.gap = 10;
```

- The shader applies to every stroke of the context, and dashes restart at the start of each shape.
- Fills aren't drawn with a `DashLineShader`: draw them with another `SmoothGraphics`.
- Dash and gap lengths scale with the object, like the line width.
- Keep the default `'butt'` cap: a `'round'` cap at the start of a path can show a sliver of dash.
- A context with a custom shader is never batched, so each one costs a draw call.

## A context can't be shared with Graphics

`Graphics` and `SmoothGraphics` build different geometry and store it on the [`GraphicsContext`](https://pixijs.download/v8.23.0/docs/scene.GraphicsContext.html), so one context can't be drawn by both: one of them can render blank. No error is thrown. To draw the same shapes with both, give one a copy:

```ts
const context = new GraphicsContext().star(0, 0, 5, 50).fill(0xffcc00);

const aliased = new Graphics(context);
const smooth = new SmoothGraphics(context.clone());
```

Several `SmoothGraphics` can share a context with each other, the same way several `Graphics` can.

## Renderers

`SmoothGraphics` works with the WebGL and WebGPU renderers. The canvas renderer draws it like a regular `Graphics`, with the anti-aliasing of the 2D canvas.

## Performance

Small contexts are batched together like with `Graphics`, and bigger ones (or ones with a custom shader) are drawn with their own draw call.

The anti-aliasing needs more vertices than `Graphics`, and bigger ones. Static scenes render about as fast as with `Graphics`, but every batched `SmoothGraphics` that moves has its vertices transformed and uploaded again, which costs more than with `Graphics`. When many of them move:

- Put a container that is moved, rotated or zoomed as a whole in a render group (`container.isRenderGroup = true`): moving the group doesn't update the vertices of its children.
- For medium sized objects that each move on their own, set `graphics.context.batchMode = 'no-batch'`: their vertices are uploaded once, and each one costs a draw call.

As with `Graphics`, don't clear and redraw a context every frame if you can swap prebuilt contexts instead.

## Caveats

- Pixels just outside very sharp corners of fills can get a little too much coverage.
- Overlapping shapes are blended one after the other, so the anti-aliased edges of two shapes that touch can show a faint seam.

---

## API reference

- [`SmoothGraphics`](https://pixijs.download/v8.23.0/docs/scene.SmoothGraphics.html)
- [`DashLineShader`](https://pixijs.download/v8.23.0/docs/scene.DashLineShader.html)
- [`DashLineShaderOptions`](https://pixijs.download/v8.23.0/docs/scene.DashLineShaderOptions.html)
- [`Graphics`](https://pixijs.download/v8.23.0/docs/scene.Graphics.html)
- [`GraphicsContext`](https://pixijs.download/v8.23.0/docs/scene.GraphicsContext.html)
