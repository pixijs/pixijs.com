# Resize Plugin

The `ResizePlugin` provides automatic resizing functionality for PixiJS applications. When enabled, it listens to window or element resize events and resizes the application's renderer accordingly.

This is useful for:

- Making the canvas responsive to the browser window
- Maintaining aspect ratio or fitting to containers
- Handling layout changes without manual resize calls

By default, PixiJS adds this plugin when initializing an `Application`, but you can also register it manually if you're using a custom setup.

---

## Usage

```ts
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  width: 800,
  height: 600,
  resizeTo: window,
});
```

### Default Behavior

- When using `Application.init()` with no overrides, the `ResizePlugin` is installed automatically:
- When `resizeTo` is set, the renderer automatically adjusts to match the dimensions of the target (`window` or `HTMLElement`).
- Resizing is throttled using `requestAnimationFrame` to prevent performance issues during rapid resize events.
- You can trigger a resize manually with `app.resize()` or cancel a scheduled resize with `app.cancelResize()`.

### Manual Registration

If you're managing extensions manually:

```ts
import { extensions, ResizePlugin } from 'pixi.js';

extensions.add(ResizePlugin);
```

### Custom Resize Target

You can specify a custom target for resizing. This is useful if you want to resize the canvas to fit a specific element rather than the entire window.

```ts
await app.init({
  resizeTo: document.getElementById('game-container'),
});
```

---

## API Reference

- [`ResizePlugin`](https://pixijs.download/release/docs/app.ResizePlugin.html)
