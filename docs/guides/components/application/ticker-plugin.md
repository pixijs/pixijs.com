---
sidebar_position: 0
---

# Ticker Plugin

The `TickerPlugin` provides a built-in update loop for your PixiJS `Application`. This loop calls `.render()` at a regular cadence—by default, once per animation frame—and integrates with PixiJS's `Ticker` system for precise control over frame-based updates.

PixiJS includes this plugin automatically when you initialize an `Application`, but you can also opt out and add it manually.

## Usage

```ts
const app = new Application();

await app.init({
    sharedTicker: false,
    autoStart: true,
});

app.ticker.add((ticker) => {
    // Custom update logic here
    bunny.rotation += 1 * ticker.deltaTime;
});
```

### Default Behavior

The `TickerPlugin` is included automatically unless disabled:

```ts
const app = new Application();

await app.init({
    autoStart: true, // Automatically starts the render loop
    sharedTicker: false, // Use a dedicated ticker
});
```

### Manual Registration

If you're managing extensions yourself:

```ts
import { extensions, TickerPlugin } from 'pixi.js';

extensions.add(TickerPlugin);
```

# Shared vs Custom Ticker

The plugin supports two modes:

| Option                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `sharedTicker: true`  | Uses `Ticker.shared`, shared across all applications.        |
| `sharedTicker: false` | Creates a private ticker instance scoped to the application. |

### Behavior Differences

- If using a **shared ticker**, other code may also be registering updates, so the order of execution can vary.
- If using a **custom ticker**, you get complete control over timing and update order.

---

## Lifecycle Control

You can manually stop and start the ticker:

```ts
app.stop(); // Stop automatic rendering
app.start(); // Resume
```

This is useful for:

- Pausing the game or animation
- Performance throttling on inactive tabs
- Managing visibility events

---

## API Reference

### Properties

| Property     | Type     | Description                                                                                   |
| ------------ | -------- | --------------------------------------------------------------------------------------------- |
| `app.ticker` | `Ticker` | The `Ticker` instance used for driving updates. May be shared or private depending on config. |

### Methods

| Method        | Returns | Description                                  |
| ------------- | ------- | -------------------------------------------- |
| `app.start()` | `void`  | Starts the render loop via `ticker.start()`. |
| `app.stop()`  | `void`  | Stops the render loop via `ticker.stop()`.   |
