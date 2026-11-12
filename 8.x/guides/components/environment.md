# Environment

Most PixiJS users run in a browser and can ignore this page. The environment system matters if you're running PixiJS in a **Web Worker** (for offscreen rendering) or a **custom environment** like Node.js (for server-side rendering or testing). Adapters abstract platform-specific APIs so the same PixiJS code works everywhere.

## Browser environment (default)

PixiJS auto-detects the browser environment and uses `BrowserAdapter` to access native APIs like `CanvasRenderingContext2D` and `WebGLRenderingContext`. No configuration is needed.

```ts
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
    width: 800,
    height: 600,
});

document.body.appendChild(app.canvas);
```

## Web Worker environment

PixiJS can run in Web Workers using `WebWorkerAdapter`, which renders to an `OffscreenCanvas`. Set the adapter before creating any PixiJS objects.

```ts
import { DOMAdapter, WebWorkerAdapter, Application } from 'pixi.js';

// Set the adapter before creating any PixiJS objects
DOMAdapter.set(WebWorkerAdapter);

const app = new Application();

await app.init({
    width: 800,
    height: 600,
});

// Returns an OffscreenCanvas
const canvas = app.canvas;

// Post the canvas back to the main thread
postMessage({ canvas }, [canvas]);
```

> [!WARNING]
> Accessibility and user interaction features are unavailable in Web Workers because they have no DOM access.

## Custom environment

You can create custom adapters for non-standard environments like Node.js or headless testing frameworks. The adapter must satisfy the full [`Adapter`](https://pixijs.download/v8.23.0/docs/environment.Adapter.html) interface:

```typescript
import { DOMAdapter } from 'pixi.js';
import type { Adapter } from 'pixi.js';

// Example: a minimal Node.js adapter using node-canvas
import { createCanvas, Image } from 'canvas';

const CustomAdapter: Adapter = {
    createCanvas: (width, height) => createCanvas(width, height),
    createImage: () => new Image(),
    getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
    getWebGLRenderingContext: () => null, // no WebGL in this environment
    getNavigator: () => ({ userAgent: 'Node.js', gpu: null }),
    getBaseUrl: () => process.cwd(),
    getFontFaceSet: () => null,
    fetch: async (url, options) => globalThis.fetch(url, options),
    parseXML: (xml) => new (require('xmldom').DOMParser)().parseFromString(xml),
};

DOMAdapter.set(CustomAdapter);
```

## Auto-detection

PixiJS auto-detects the environment at startup using extension-based detection:

1. If running inside a Web Worker (`WorkerGlobalScope` exists), `WebWorkerAdapter` is selected automatically.
2. Otherwise, `BrowserAdapter` is used as the default.

You only need to call `DOMAdapter.set()` when using a custom adapter. Browser and Web Worker environments are handled automatically.

## API reference

- [`Adapter`](https://pixijs.download/v8.23.0/docs/environment.Adapter.html) - The interface all adapters must satisfy
- [`BrowserAdapter`](https://pixijs.download/v8.23.0/docs/environment.BrowserAdapter.html) - Default browser adapter
- [`WebWorkerAdapter`](https://pixijs.download/v8.23.0/docs/environment.WebWorkerAdapter.html) - Web Worker adapter using `OffscreenCanvas`
- [`DOMAdapter`](https://pixijs.download/v8.23.0/docs/environment.DOMAdapter.html) - Getter/setter for the active adapter
- [`ICanvas`](https://pixijs.download/v8.23.0/docs/environment.ICanvas.html) - Canvas abstraction used across environments
