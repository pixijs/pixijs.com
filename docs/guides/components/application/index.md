---
sidebar_position: 0
---

# Application

The `Application` class provides a modern, extensible entry point to set up rendering in PixiJS. It abstracts common tasks like renderer setup and ticker updates, and is designed to support both WebGL and WebGPU via async initialization.

## Creating an Application

Creating an application requires two steps: constructing an instance, then initializing it asynchronously using `.init()`:

```ts
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
});

document.body.appendChild(app.canvas);
```

### ApplicationOptions Reference

The `.init()` method of `Application` accepts a `Partial<ApplicationOptions>` object with the following configuration options:

| Option                   | Type                                | Default     | Description                                                                                                                              |
| ------------------------ | ----------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `autoStart`              | `boolean`                           | `true`      | Whether to start rendering immediately after initialization. Setting to `false` will not stop the shared ticker if it's already running. |
| `resizeTo`               | `Window \| HTMLElement`             | —           | Element to auto-resize the renderer to match.                                                                                            |
| `sharedTicker`           | `boolean`                           | `false`     | Use the shared ticker instance if `true`; otherwise, a private ticker is created.                                                        |
| `preference`             | `'webgl' \| 'webgpu'`               | `webgl`     | Preferred renderer type.                                                                                                                 |
| `useBackBuffer`          | `boolean`                           | `false`     | _(WebGL only)_ Use the back buffer when required.                                                                                        |
| `forceFallbackAdapter`   | `boolean`                           | `false`     | _(WebGPU only)_ Force usage of fallback adapter.                                                                                         |
| `powerPreference`        | `'high-performance' \| 'low-power'` | `undefined` | Hint for GPU power preference (WebGL & WebGPU).                                                                                          |
| `antialias`              | `boolean`                           | —           | Enables anti-aliasing. May impact performance.                                                                                           |
| `autoDensity`            | `boolean`                           | —           | Adjusts canvas size based on `resolution`. Applies only to `HTMLCanvasElement`.                                                          |
| `background`             | `ColorSource`                       | —           | Alias for `backgroundColor`.                                                                                                             |
| `backgroundAlpha`        | `number`                            | `1`         | Alpha transparency for background (0 = transparent, 1 = opaque).                                                                         |
| `backgroundColor`        | `ColorSource`                       | `'black'`   | Color used to clear the canvas. Accepts hex, CSS color, or array.                                                                        |
| `canvas`                 | `ICanvas`                           | —           | A custom canvas instance (optional).                                                                                                     |
| `clearBeforeRender`      | `boolean`                           | `true`      | Whether the renderer should clear the canvas each frame.                                                                                 |
| `context`                | `WebGL2RenderingContext \| null`    | `null`      | User-supplied rendering context (WebGL).                                                                                                 |
| `depth`                  | `boolean`                           | —           | Enable a depth buffer in the main view. Always `true` for WebGL.                                                                         |
| `height`                 | `number`                            | `600`       | Initial height of the renderer (in pixels).                                                                                              |
| `width`                  | `number`                            | `800`       | Initial width of the renderer (in pixels).                                                                                               |
| `hello`                  | `boolean`                           | `false`     | Log renderer info and version to the console.                                                                                            |
| `multiView`              | `boolean`                           | `false`     | Enable multi-canvas rendering.                                                                                                           |
| `preferWebGLVersion`     | `1 \| 2`                            | `2`         | Preferred WebGL version.                                                                                                                 |
| `premultipliedAlpha`     | `boolean`                           | `true`      | Assume alpha is premultiplied in color buffers.                                                                                          |
| `preserveDrawingBuffer`  | `boolean`                           | `false`     | Preserve buffer between frames. Needed for `toDataURL`.                                                                                  |
| `resolution`             | `number`                            | 1           | The resolution of the renderer.                                                                                                          |
| `skipExtensionImports`   | `boolean`                           | `false`     | Prevent automatic import of default PixiJS extensions.                                                                                   |
| `textureGCActive`        | `boolean`                           | `true`      | Enable garbage collection for GPU textures.                                                                                              |
| `textureGCCheckCountMax` | `number`                            | `600`       | Frame interval between GC runs (textures).                                                                                               |
| `textureGCMaxIdle`       | `number`                            | `3600`      | Max idle frames before destroying a texture.                                                                                             |
| `textureGCAMaxIdle`      | `number`                            | —           | (Appears undocumented; placeholder for internal GC controls.)                                                                            |

### Customizing Application Options Per Renderer Type

You can also override properties based on the renderer type by using the `WebGLOptions` or `WebGPUOptions` interfaces. For example:

```ts
import { Application } from 'pixi.js';

const app = new Application();
await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    webgl: {
        antialias: true,
    },
    webgpu: {
        antialias: false,
    },
});
document.body.appendChild(app.canvas);
```

---

## Built-In Plugins

PixiJS includes:

- ✅ **Ticker Plugin** — Updates every frame → [Guide](./ticker-plugin.md)
- ✅ **Resize Plugin** — Resizes renderer/canvas → [Guide](./resize-plugin.md)
- ➕ **Optional: Culler Plugin** - Culls objects that are out of frame → [Guide](./culler-plugin.md)

---

## Creating a Custom Application Plugin

You can create custom plugins for the `Application` class. A plugin must implement the `ApplicationPlugin` interface, which includes `init()` and `destroy()` methods. You can also specify the `extension` type, which is `ExtensionType.Application` for application plugins.

Both functions are called with `this` set as the `Application` instance e.g `this.renderer` or `this.stage` is available.

The `init()` method is called when the application is initialized and passes the options from the `application.init` call, and the `destroy()` method is called when the application is destroyed.

```ts
import type { ApplicationOptions, ApplicationPlugin, ExtensionType } from 'pixi.js';

const myPlugin: ApplicationPlugin = {
    extension: ExtensionType.Application;
    init(options: ApplicationOptions) {
        console.log('Custom plugin init:', this, options);
    },
    destroy() {
        console.log('Custom plugin destroy');
    },
};
```

Register with:

```ts
import { extensions } from 'pixi.js';
extensions.add(myPlugin);
```

### Adding Types

If you are using TypeScript, or are providing a plugin for others to use, you can extend the `ApplicationOptions` interface to include your custom plugins options.

```ts
declare global {
    namespace PixiMixins {
        interface ApplicationOptions {
            myPlugin?: import('./myPlugin').PluginOptions | null;
        }
    }
}

await app.init({
    myPlugin: {
        customOption: true, // Now TypeScript will know about this option
    },
});
```

---

## API Reference

### Properties

| Name        | Type                        | Description                                                     |
| ----------- | --------------------------- | --------------------------------------------------------------- |
| `canvas`    | `ICanvas`                   | The canvas being rendered to.                                   |
| `renderer`  | `Renderer`                  | The rendering engine (WebGL or WebGPU).                         |
| `stage`     | `Container`                 | The root container to render.                                   |
| `ticker`    | `Ticker \| undefined`       | The application's update loop handler (if using ticker plugin). |
| `resize`    | `ResizePlugin \| undefined` | Resize controller (if using resize plugin).                     |
| `destroyed` | `boolean`                   | Whether the application has been destroyed.                     |

### Methods

| Method                                             | Returns         | Description                                                           |
| -------------------------------------------------- | --------------- | --------------------------------------------------------------------- |
| `init(options: ApplicationOptions): Promise<void>` | `Promise<void>` | Asynchronously initializes the application with renderer and plugins. |
| `render()`                                         | `void`          | Manually triggers a single render pass.                               |
| `destroy(removeView?: boolean)`                    | `void`          | Cleans up all resources. Optionally removes the canvas from the DOM.  |

---
