---
sidebar_position: 11
---

# Ticker

The `Ticker` class in PixiJS provides a powerful and flexible mechanism for executing callbacks on every animation frame. It's useful for managing game loops, animations, and any time-based updates.

```ts
import { Ticker } from 'pixi.js';

const ticker = new Ticker();

ticker.add((ticker) => {
    console.log(`Delta Time: ${ticker.deltaTime}`);
});

// Start the ticker
ticker.start();
```

## Adding and Removing Listeners

The `Ticker` class allows you to add multiple listeners that will be called on every frame. You can also specify a context for the callback, which is useful for maintaining the correct `this` reference.

```ts
ticker.add(myFunction, myContext);
ticker.addOnce(myFunction, myContext);
ticker.remove(myFunction, myContext);
```

## Controlling the Ticker

```ts
ticker.start(); // Begin calling listeners every frame
ticker.stop(); // Pause the ticker and cancel the animation frame
```

To automatically start the ticker when a listener is added, enable `autoStart`:

```ts
ticker.autoStart = true;
```

## Prioritizing Listeners

Listeners can be assigned a priority. Higher values run earlier.

```ts
import { UPDATE_PRIORITY } from 'pixi.js';

ticker.add(fnA, null, UPDATE_PRIORITY.HIGH); // runs before...
ticker.add(fnB, null, UPDATE_PRIORITY.NORMAL); // ...this
```

Available constants include:

- `UPDATE_PRIORITY.HIGH = 50`
- `UPDATE_PRIORITY.NORMAL = 0`
- `UPDATE_PRIORITY.LOW = -50`

## Configuring FPS

Tickers allows FPS limits to control the update rate.

### `minFPS`

Caps how _slow_ frames are allowed to be. Used to clamp `deltaTime`:

```ts
ticker.minFPS = 30; // deltaTime will never act as if below 30 FPS
```

### `maxFPS`

Limits how _fast_ the ticker runs. Useful for conserving CPU/GPU:

```ts
ticker.maxFPS = 60; // will not tick faster than 60fps
```

Set to `0` to allow unlimited framerate:

```ts
ticker.maxFPS = 0;
```

---

## API Reference Table

| Property/Method                    | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `add(fn, context?, priority?)`     | Adds a persistent listener                |
| `addOnce(fn, context?, priority?)` | Adds a one-time listener                  |
| `remove(fn, context?)`             | Removes listener(s)                       |
| `start()` / `stop()`               | Starts or stops the ticker                |
| `destroy()`                        | Cleans up the ticker                      |
| `autoStart`                        | Auto-starts ticker on listener addition   |
| `speed`                            | Scalar multiplier for `deltaTime`         |
| `deltaTime`                        | Scaled time since last frame (in frames)  |
| `deltaMS`                          | Scaled time since last frame (in ms)      |
| `elapsedMS`                        | Raw elapsed time since last frame (in ms) |
| `minFPS`                           | Minimum allowed FPS (caps `deltaTime`)    |
| `maxFPS`                           | Maximum allowed FPS (limits update rate)  |
| `count`                            | Number of active listeners                |
| `FPS`                              | Computed frames per second                |
