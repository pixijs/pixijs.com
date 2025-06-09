---
sidebar_position: 2
description: Understanding the PixiJS render loop, including how it updates the scene graph and renders frames efficiently.
---

# Render Loop

At the core of PixiJS lies its **render loop**, a repeating cycle that updates and redraws your scene every frame. Unlike traditional web development where rendering is event-based (e.g. on user input), PixiJS uses a continuous animation loop that provides full control over real-time rendering.

This guide provides a deep dive into how PixiJS structures this loop internally, from the moment a frame begins to when it is rendered to the screen. Understanding this will help you write more performant, well-structured applications.

## Overview

Each frame, PixiJS performs the following sequence:

1. **Tickers are executed** (user logic)
2. **Scene graph is updated** (transforms and culling)
3. **Rendering occurs** (GPU draw calls)

This cycle repeats as long as your application is running and its ticker is active.

## Step 1: Running Ticker Callbacks

The render loop is driven by the `Ticker` class, which uses `requestAnimationFrame` to schedule work. Each tick:

- Measures elapsed time since the previous frame
- Caps it based on `minFPS` and `maxFPS`
- Calls every listener registered with `ticker.add()` or `app.ticker.add()`

### Example

```ts
app.ticker.add((ticker) => {
    bunny.rotation += ticker.deltaTime * 0.1;
});
```

Every callback receives the current `Ticker` instance. You can access `ticker.deltaTime` (scaled frame delta) and `ticker.elapsedMS` (unscaled delta in ms) to time animations.

## Step 2: Updating the Scene Graph

PixiJS uses a hierarchical **scene graph** to represent all visual objects. Before rendering, the graph needs to be traversed to:

- Recalculate transforms (world matrix updates)
- Apply custom logic via `onRender` handlers
- Apply culling if enabled

## Step 3: Rendering the Scene

Once the scene graph is ready, the renderer walks the display list starting at `app.stage`:

1. Applies global and local transformations
2. Batches draw calls when possible
3. Uploads geometry, textures, and uniforms
4. Issues GPU commands

All rendering is **retained mode**: objects persist across frames unless explicitly removed.

Rendering is done via either WebGL or WebGPU, depending on your environment. The renderer abstracts away the differences behind a common API.

## Full Frame Lifecycle Diagram

```plaintext
requestAnimationFrame
        │
    [Ticker._tick()]
        │
    ├─ Compute elapsed time
    ├─ Call user listeners
    │   └─ sprite.onRender
    ├─ Cull display objects (if enabled)
    ├─ Update world transforms
    └─ Render stage
            ├─ Traverse display list
            ├─ Upload data to GPU
            └─ Draw
```
