---
sidebar_position: 1
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

## API Reference

All renderers provide these common features:

### Core Methods

| Method                               | Description                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `init(options)`                      | Asynchronously initializes the renderer and its systems.                            |
| `render(container)`                  | Renders a container to screen or texture.                                           |
| `resize(width, height, resolution?)` | Resizes canvas and updates resolution.                                              |
| `clear(options?)`                    | Clears the screen or target texture with a color.                                   |
| `destroy(options?)`                  | Cleans up all GPU and system resources.                                             |
| `resetState()`                       | Resets render state (useful after mixing PixiJS with other Libraries like ThreeJS). |
| `generateTexture(options)`           | Generates a texture from a container.                                               |

### Properties

| Property             | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `canvas`             | The canvas element used for rendering.                                                        |
| `screen`             | The screen bounds (0,0,width,height).                                                         |
| `resolution`         | The resolution of the renderer.                                                               |
| `width`, `height`    | Current canvas size in physical pixels.                                                       |
| `renderingToScreen`  | Flag if we are rendering to the screen vs renderTexture                                       |
| `roundPixels`        | `true` if pixel rounding is enabled.                                                          |
| `lastObjectRendered` | The last object rendered by the renderer. Useful for other plugins like interaction managers. |

## Lifecycle Hooks

Each renderer emits a set of **lifecycle events**, called "runners", to manage and coordinate internal systems:

| Hook               | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `init`             | Called when the renderer is initialized.                      |
| `destroy`          | Called before destroying the renderer.                        |
| `contextChange`    | Fired when the rendering context changes (e.g. context loss). |
| `resolutionChange` | Fired when resolution is updated.                             |
| `resetState`       | Invoked to reset the WebGL/WebGPU state.                      |
| `renderStart`      | Before any rendering starts.                                  |
| `prerender`        | Before the main render logic begins.                          |
| `render`           | The main render call.                                         |
| `renderEnd`        | After rendering finishes.                                     |
| `postrender`       | Cleanup or finalization after rendering.                      |

These hooks allow renderer systems (e.g. shader managers, geometry uploaders) to synchronize automatically around key rendering moments.
