---
sidebar_position: 5
title: Environments
description: Learn how PixiJS adapts to different environments like browsers, Web Workers, and custom execution contexts, and how to configure it for your needs.
---

# Using PixiJS in Different Environments

PixiJS is a highly adaptable library that can run in a variety of environments, including browsers, Web Workers, and custom execution contexts like Node.js. This guide explains how PixiJS handles different environments and how you can configure it to suit your application's needs.

## Running PixiJS in the Browser

For browser environments, PixiJS uses the `BrowserAdapter` by default, you should not need to configure anything

### Example:

```typescript
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  width: 800,
  height: 600,
});

document.body.appendChild(app.canvas);
```

## Running PixiJS in Web Workers

Web Workers provide a parallel execution environment, ideal for offloading rendering tasks. PixiJS supports Web Workers using the `WebWorkerAdapter`:

### Example:

```typescript
import { DOMAdapter, WebWorkerAdapter } from 'pixi.js';

// Must be set before creating anything in PixiJS
DOMAdapter.set(WebWorkerAdapter);

const app = new Application();

await app.init({
  width: 800,
  height: 600,
});

app.canvas; // OffscreenCanvas
```

## Custom Environments

For non-standard environments, you can create a custom adapter by implementing the `Adapter` interface. This allows PixiJS to function in environments like Node.js or headless testing setups.

### Example Custom Adapter:

```typescript
import { DOMAdapter } from 'pixi.js';

const CustomAdapter = {
  createCanvas: (width, height) => {
    /* custom implementation */
  },
  getCanvasRenderingContext2D: () => {
    /* custom implementation */
  },
  getWebGLRenderingContext: () => {
    /* custom implementation */
  },
  getNavigator: () => ({ userAgent: 'Custom', gpu: null }),
  getBaseUrl: () => 'custom://',
  fetch: async (url, options) => {
    /* custom fetch */
  },
  parseXML: (xml) => {
    /* custom XML parser */
  },
};

DOMAdapter.set(CustomAdapter);
```
