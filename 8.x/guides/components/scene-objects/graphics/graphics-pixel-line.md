import { Sandpack } from '@codesandbox/sandpack-react';
import { dracula } from '@codesandbox/sandpack-themes';

# Graphics Pixel Line

The `pixelLine` property is a neat feature of the PixiJS Graphics API that allows you to create lines that remain 1 pixel thick, regardless of scaling or zoom level. As part of the Graphics API, it gives developers all the power PixiJS provides for building and stroking shapes. This feature is especially useful for achieving crisp, pixel-perfect visuals, particularly in retro-style or grid-based games, technical drawing, or UI rendering.

In this guide, we'll dive into how this property works, its use cases, and the caveats you should be aware of when using it.

---

```ts
import { Application, Container, Graphics, Text } from 'pixi.js';

/**
 * Creates a grid pattern using Graphics lines
 * @param graphics - The Graphics object to draw on
 * @returns The Graphics object with the grid drawn
 */
function buildGrid(graphics) {
  // Draw 10 vertical lines spaced 10 pixels apart
  for (let i = 0; i < 11; i++) {
    // Move to top of each line (x = i*10, y = 0)
    graphics
      .moveTo(i * 10, 0)
      // Draw down to bottom (x = i*10, y = 100)
      .lineTo(i * 10, 100);
  }

  // Draw 10 horizontal lines spaced 10 pixels apart
  for (let i = 0; i < 11; i++) {
    // Move to start of each line (x = 0, y = i*10)
    graphics
      .moveTo(0, i * 10)
      // Draw across to end (x = 100, y = i*10)
      .lineTo(100, i * 10);
  }

  return graphics;
}

(async () => {
  // Create and initialize a new PixiJS application
  const app = new Application();

  await app.init({ antialias: true, resizeTo: window });
  document.body.appendChild(app.canvas);

  // Create two grids - one with pixel-perfect lines and one without
  const gridPixel = buildGrid(new Graphics()).stroke({
    color: 0xffffff,
    pixelLine: true,
    width: 1,
  });

  const grid = buildGrid(new Graphics()).stroke({
    color: 0xffffff,
    pixelLine: false,
  });

  // Position the grids side by side
  grid.x = -100;
  grid.y = -50;
  gridPixel.y = -50;

  // Create a container to hold both grids
  const container = new Container();

  container.addChild(grid, gridPixel);

  // Center the container on screen
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  // Animation variables
  let count = 0;

  // Add animation to scale the grids over time
  app.ticker.add(() => {
    count += 0.01;
    container.scale = 1 + (Math.sin(count) + 1) * 2;
  });

  // Add descriptive label
  const label = new Text({
    text: 'Grid Comparison: Standard Lines (Left) vs Pixel-Perfect Lines (Right)',
    style: { fill: 0xffffff },
  });

  // Position label in top-left corner
  label.position.set(20, 20);
  label.width = app.screen.width - 40;
  label.scale.y = label.scale.x;
  app.stage.addChild(label);
})();
```

## How to use `pixelLine`?

Here’s a simple example:

```ts
// Create a Graphics object and draw a pixel-perfect line
let graphics = new Graphics()
  .moveTo(0, 0)
  .lineTo(100, 100)
  .stroke({ color: 0xff0000, pixelLine: true });

// Add it to the stage
app.stage.addChild(graphics);

// Even if we scale the Graphics object, the line remains 1 pixel wide
graphics.scale.set(2);
```

In this example, no matter how you transform or zoom the `Graphics` object, the red line will always appear 1 pixel thick on the screen.

---

## Why Use `pixelLine`?

Pixel-perfect lines can be incredibly useful in a variety of scenarios. Here are some common use cases:

### 1. **Retro or Pixel Art Games**

- Pixel art games rely heavily on maintaining sharp, precise visuals. The `pixelLine` property ensures that lines do not blur or scale inconsistently with other pixel elements.
- Example: Drawing pixel-perfect grids for tile-based maps.

```ts
// Create a grid of vertical and horizontal lines
const grid = new Graphics();

// Draw 10 vertical lines spaced 10 pixels apart
// Draw vertical lines
for (let i = 0; i < 10; i++) {
  // Move to top of each line (x = i*10, y = 0)
  grid
    .moveTo(i * 10, 0)
    // Draw down to bottom (x = i*10, y = 100)
    .lineTo(i * 10, 100);
}

// Draw horizontal lines
for (let i = 0; i < 10; i++) {
  // Move to start of each line (x = 0, y = i*10)
  grid
    .moveTo(0, i * 10)
    // Draw across to end (x = 100, y = i*10)
    .lineTo(100, i * 10);
}

// Stroke all lines in white with pixel-perfect width
grid.stroke({ color: 0xffffff, pixelLine: true });
```

---

### 2. **UI and HUD Elements**

- For UI elements such as borders, separators, or underlines, a consistent 1-pixel thickness provides a professional, clean look.
- Example: Drawing a separator line in a menu or a progress bar border.

```ts
// Create a separator line that will always be 1 pixel thick
const separator = new Graphics()
  // Start at x=0, y=50
  .moveTo(0, 50)
  // Draw a horizontal line 200 pixels to the right
  .lineTo(200, 50)
  // Stroke in green with pixel-perfect 1px width
  .stroke({ color: 0x00ff00, pixelLine: true });
```

---

### 3. **Debugging and Prototyping**

- Use pixel-perfect lines to debug layouts, collision boxes, or grids. Since the lines don’t scale, they offer a consistent reference point during development.
- Example: Displaying collision boundaries in a physics-based game.

```ts
// Create a debug box with pixel-perfect stroke
const graphicsBox = new Graphics()
  .rect(0, 0, 100, 100)
  .stroke({ color: 0xff00ff, pixelLine: true });

/**
 * Updates the debug box to match the bounds of a given object
 * @param {Container} obj - The object to draw bounds for
 */
function drawDebugBounds(obj) {
  // Get the bounds of the object
  let bounds = obj.getBounds().rectangle;

  // Position and scale the debug box to match the bounds
  // this is faster than using `moveTo` and `lineTo` each frame!
  graphicsBox.position.set(bounds.x, bounds.y);
  graphicsBox.scale.set(bounds.width / 100, bounds.height / 100);
}
```

---

## How it works

This is achieved under the hood using WebGL or WebGPU's native line rendering methods when `pixelLine` is set to `true`.

Fun fact its actually faster to draw a pixel line than a regular line. This is because of two main factors:

1. **Simpler Drawing Process**: Regular lines in PixiJS (when `pixelLine` is `false`) need extra steps to be drawn. PixiJS has to figure out the thickness of the line and create a shape that looks like a line but is actually made up of triangles.

2. **Direct Line Drawing**: When using `pixelLine`, we can tell the graphics card "just draw a line from point A to point B" and it knows exactly what to do. This is much simpler and faster than creating and filling shapes.

Think of it like drawing a line on paper - `pixelLine` is like using a pen to draw a straight line, while regular lines are like having to carefully color in a thin rectangle. The pen method is naturally faster and simpler!

## Caveats and Gotchas

While the `pixelLine` property is incredibly useful, there are some limitations and things to keep in mind:

### 1. **Its 1px thick, thats it!**

- The line is always 1px thick, there is no way to change this as its using the GPU to draw the line.

### 2. **Hardware may render differently**

- Different GPUs and graphics hardware may render the line slightly differently due to variations in how they handle line rasterization. For example, some GPUs may position the line slightly differently or apply different anti-aliasing techniques. This is an inherent limitation of GPU line rendering and is beyond PixiJS's control.

### 4. **Scaling Behavior**

- While the line thickness remains constant, other properties (e.g., position or start/end points) are still affected by scaling. This can sometimes create unexpected results if combined with other scaled objects. This is a feature not a bug :)

### Example: Box with Pixel-Perfect Stroke

Here's an example of a filled box with a pixel-perfect stroke. The box itself scales and grows, but the stroke remains 1 pixel wide:

```ts
// Create a Graphics object and draw a filled box with a pixel-perfect stroke
let box = new Graphics()
  .rect(0, 0, 100, 100)
  .fill('white')
  .stroke({ color: 0xff0000, pixelLine: true });

// Add it to the stage
app.stage.addChild(box);

// Scale the box
box.scale.set(2);
```

In this example, the blue box grows as it scales, but the red stroke remains at 1 pixel thickness, providing a crisp outline regardless of the scaling.

---

## When to Avoid Using `pixelLine`

- **You want a line that is not 1px thick:** Don't use `pixelLine`.
- **You want the line to scale:** Don't use `pixelLine`

---

## Conclusion

The `pixelLine` property is a super useful to have in the PixiJS toolbox for developers looking to create sharp, pixel-perfect lines that remain consistent under transformation. By understanding its strengths and limitations, you can incorporate it into your projects for clean, professional results in both visual and functional elements.
