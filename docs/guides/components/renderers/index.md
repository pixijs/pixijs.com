---
sidebar_position: 1
description: Learn how to use PixiJS renderers for high-performance GPU-accelerated rendering in your applications.
---

# Renderers

PixiJS renderers are responsible for drawing your scene to a canvas using either **WebGL/WebGL2** or **WebGPU**. These renderers are high-performance GPU-accelerated engines and are composed of modular systems that manage everything from texture uploads to rendering pipelines.

All PixiJS renderers inherit from a common base, which provides consistent methods such as `.render()`, `.resize()`, and `.clear()` as well as shared systems for managing the canvas, texture GC, events, and more.

## Renderer Types

| Renderer         | Description                                                        | Status          |
| ---------------- | ------------------------------------------------------------------ | --------------- |
| `WebGLRenderer`  | Default renderer using WebGL/WebGL2. Well supported and stable.    | ✅ Recommended  |
| `WebGPURenderer` | Modern GPU renderer using WebGPU. More performant, still maturing. | 🚧 Experimental |
| `CanvasRenderer` | Fallback renderer using 2D canvas.                                 | ❌ Coming-soon  |

:::info
The WebGPU renderer is feature complete, however, inconsistencies in browser implementations may lead to unexpected behavior. It is recommended to use the WebGL renderer for production applications.
:::

## Creating a Renderer

You can use `autoDetectRenderer()` to create the best renderer for the environment:

```ts
import { autoDetectRenderer } from 'pixi.js';

const renderer = await autoDetectRenderer({
  preference: 'webgpu', // or 'webgl'
});
```

Or construct one explicitly:

```ts
import { WebGLRenderer, WebGPURenderer } from 'pixi.js';

const renderer = new WebGLRenderer();
await renderer.init(options);
```

## Rendering a Scene

To render a scene, you can use the `render()` method. This will draw the specified container to the screen or a texture:

```ts
import { Container } from 'pixi.js';

const container = new Container();
renderer.render(container);

// or provide a complete set of options
renderer.render({
  target: container,
  clear: true, // clear the screen before rendering
  transform: new Matrix(), // optional transform to apply to the container
});
```

## Resizing the Renderer

To resize the renderer, use the `resize()` method. This will adjust the canvas size and update the resolution:

```ts
renderer.resize(window.innerWidth, window.innerHeight);
```

## Generating Textures

You can generate textures from containers using the `generateTexture()` method. This is useful for creating textures from dynamic content:

```ts
import { Sprite } from 'pixi.js';

const sprite = new Sprite();
const texture = renderer.generateTexture(sprite);
```

## Resetting State

To reset the renderer's state, use the `resetState()` method. This is useful when mixing PixiJS with other libraries like Three.js:

```ts
function render() {
  // Render the Three.js scene
  threeRenderer.resetState();
  threeRenderer.render(scene, camera);

  // Render the PixiJS stage
  pixiRenderer.resetState();
  pixiRenderer.render({ container: stage });

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
```

See our full guide on [mixing PixiJS with Three.js](../../third-party/mixing-three-and-pixi.mdx) for more details.

---

## API Reference

- [Overview](https://pixijs.download/release/docs/rendering.html)
- [AbstractRenderer](https://pixijs.download/release/docs/rendering.AbstractRenderer.html)
- [WebGLRenderer](https://pixijs.download/release/docs/rendering.WebGLRenderer.html)
- [WebGPURenderer](https://pixijs.download/release/docs/rendering.WebGPURenderer.html)
- [AutoDetectRenderer](https://pixijs.download/release/docs/rendering.html#autoDetectRenderer)
