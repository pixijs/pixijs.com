---
sidebar_position: -1
---

# Architecture

Here's a list of the major components that make up PixiJS. Note that this list isn't exhaustive. Additionally, don't worry too much about how each component works. The goal here is to give you a feel for what's under the hood as we start exploring the engine.

### Major Components

| Component         | Description                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Renderer**      | The core of the PixiJS system is the renderer, which displays the scene graph and draws it to the screen. PixiJS will automatically determine whether to provide you the WebGPU or WebGL renderer under the hood. |
| **Container**     | Main scene object which creates a scene graph: the tree of renderable objects to be displayed, such as sprites, graphics and text. See [Scene Graph](scene-graph) for more details.                               |
| **Assets**        | The Asset system provides tools for asynchronously loading resources such as images and audio files.                                                                                                              |
| **Ticker**        | Tickers provide periodic callbacks based on a clock. Your game update logic will generally be run in response to a tick once per frame. You can have multiple tickers in use at one time.                         |
| **Application**   | The Application is a simple helper that wraps a Loader, Ticker and Renderer into a single, convenient easy-to-use object. Great for getting started quickly, prototyping and building simple projects.            |
| **Events**        | PixiJS supports pointer-based interaction - making objects clickable, firing hover events, etc.                                                                                                                   |
| **Accessibility** | Woven through our display system is a rich set of tools for enabling keyboard and screen-reader accessibility.                                                                                                    |
| **Filters**       | PixiJS supports a variety of filters, including custom shaders, to apply effects to your renderable objects.                                                                                                      |

## Extensions

PixiJS v8 is built entirely around the concept of extensions. Every system in PixiJS is implemented as a modular extension. This allows PixiJS to remain lightweight, flexible, and easy to extend.

:::info
In most cases, you won’t need to interact with the extension system directly unless you are developing a third-party library or contributing to the PixiJS ecosystem itself.
:::

## Extension Types

PixiJS supports a wide range of extension types, each serving a unique role in the architecture:

### Assets

- `ExtensionType.Asset`: Groups together loaders, resolvers, cache and detection extensions into one convenient object instead of having to register each one separately.
- `ExtensionType.LoadParser`: Loads resources like images, JSON, videos.
- `ExtensionType.ResolveParser`: Converts asset URLs into a format that can be used by the loader.
- `ExtensionType.CacheParser`: Determines caching behavior for a particular asset.
- `ExtensionType.DetectionParser`: Identifies asset format support on the current platform.

### Renderer (WebGL, WebGPU, Canvas)

- `ExtensionType.WebGLSystem`, `ExtensionType.WebGPUSystem`, `ExtensionType.CanvasSystem`: Add systems to their respective renderers. These systems can vary widely in functionality, from managing textures to accessibility features.
- `ExtensionType.WebGLPipes`, `ExtensionType.WebGPUPipes`, `ExtensionType.CanvasPipes`: Add a new rendering pipe. RenderPipes are specifically used to render Renderables like a Mesh
- `ExtensionType.WebGLPipesAdaptor`, `ExtensionType.WebGPUPipesAdaptor`, `ExtensionType.CanvasPipesAdaptor`: Adapt rendering pipes for the respective renderers.

### Application

- `ExtensionType.Application`: Used for plugins that extend the `Application` lifecycle.
  For example the `TickerPlugin` and `ResizePlugin` are both application extensions.

### Environment

- `ExtensionType.Environment`: Used to detect and configure platform-specific behavior. This can be useful for configuring PixiJS to work in environments like Node.js, Web Workers, or the browser.

### Other (Primarily Internal Use)

These extension types are mainly used internally and are typically not required in most user-facing applications:

- `ExtensionType.MaskEffect`: Used by MaskEffectManager for custom masking behaviors.
- `ExtensionType.BlendMode`: A type of extension for creating a new advanced blend mode.
- `ExtensionType.TextureSource`: A type of extension that will be used to auto detect a resource type E.g `VideoSource`
- `ExtensionType.ShapeBuilder`: A type of extension for building and triangulating custom shapes used in graphics.
- `ExtensionType.Batcher`: A type of extension for creating custom batchers used in rendering.

## Creating Extensions

The `extensions` object in PixiJS is a global registry for managing extensions. Extensions must declare an `extension` field with metadata, and are registered via `extensions.add(...)`.

```ts
import { extensions, ExtensionType } from 'pixi.js';

const myLoader = {
    extension: {
        type: ExtensionType.LoadParser,
        name: 'my-loader',
    },
    test(url) {
        /* logic */
    },
    load(url) {
        /* logic */
    },
};

extensions.add(myLoader);
```
