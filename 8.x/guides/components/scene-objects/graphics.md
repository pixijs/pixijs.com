# Graphics

[Graphics](https://pixijs.download/release/docs/scene.Graphics.html) is a powerful and flexible tool for rendering shapes such as rectangles, circles, stars, and custom polygons. It can also be used to create complex shapes by combining multiple primitives, and it supports advanced features like gradients, textures, and masks.

```ts
import { Graphics } from 'pixi.js';

const graphics = new Graphics().rect(50, 50, 100, 100).fill(0xff0000);
```

## **Available Shapes**

PixiJS v8 supports a variety of shape primitives:

### Basic Primitives

- Line
- Rectangle
- Rounded Rectangle
- Circle
- Ellipse
- Arc
- Bezier / Quadratic Curves

### Advanced Primitives

- Chamfer Rect
- Fillet Rect
- Regular Polygon
- Star
- Rounded Polygon
- Rounded Shape

```ts
const graphics = new Graphics()
  .rect(50, 50, 100, 100)
  .fill(0xff0000)
  .circle(200, 200, 50)
  .stroke(0x00ff00)
  .lineStyle(5)
  .moveTo(300, 300)
  .lineTo(400, 400);
```

### SVG Support

You can also load SVG path data, although complex hole geometries may render inaccurately due to Pixi's performance-optimized triangulation system.

```ts
let shape = new Graphics().svg(`
  
    
  
`);
```

## **GraphicsContext**

The `GraphicsContext` class is the core of PixiJS's new graphics model. It holds all the drawing commands and styles, allowing the same shape data to be reused by multiple `Graphics` instances:

```ts
const context = new GraphicsContext().circle(100, 100, 50).fill('red');

const shapeA = new Graphics(context);
const shapeB = new Graphics(context); // Shares the same geometry
```

This pattern is particularly effective when rendering repeated or animated shapes, such as frame-based SVG swaps:

```ts
let frames = [
  new GraphicsContext().circle(100, 100, 50).fill('red'),
  new GraphicsContext().rect(0, 0, 100, 100).fill('red'),
];

let graphic = new Graphics(frames[0]);

function update() {
  graphic.context = frames[1]; // Very cheap operation
}
```

:::info
If you don't explicitly pass a `GraphicsContext` when creating a `Graphics` object, then internally, it will have its own context, accessible via `myGraphics.context`.
:::

### Destroying a GraphicsContext

When you destroy a `GraphicsContext`, all `Graphics` instances that share it will also be destroyed. This is a crucial point to remember, as it can lead to unexpected behavior if you're not careful.

```ts
const context = new GraphicsContext().circle(100, 100, 50).fill('red');
const shapeA = new Graphics(context);
const shapeB = new Graphics(context); // Shares the same geometry

shapeA.destroy({ context: true }); // Destroys both shapeA and shapeB
```

## **Creating Holes**

Use `.cut()` to remove a shape from the previous one:

```ts
const g = new Graphics()
  .rect(0, 0, 100, 100)
  .fill(0x00ff00)
  .circle(50, 50, 20)
  .cut(); // Creates a hole in the green rectangle
```

Ensure the hole is fully enclosed within the shape to avoid triangulation errors.

## **Graphics Is About Building, Not Drawing**

Despite the terminology of functions like `.rect()` or `.circle()`, `Graphics` does not immediately draw anything. Instead, each method builds up a list of geometry primitives stored inside a `GraphicsContext`. These are then rendered when the object is drawn to the screen or used in another context, such as a mask.

```ts
const graphic = new Graphics().rect(0, 0, 200, 100).fill(0xff0000);

app.stage.addChild(graphic); // The rendering happens here
```

You can think of `Graphics` as a blueprint builder: it defines what to draw, but not when to draw it. This is why `Graphics` objects can be reused, cloned, masked, and transformed without incurring extra computation until they're actually rendered.

## **Performance Best Practices**

- **Do not clear and rebuild graphics every frame**. If your content is dynamic, prefer swapping prebuilt `GraphicsContext` objects instead of recreating them.
- **Use `Graphics.destroy()`** to clean up when done. Shared contexts are not auto-destroyed.
- **Use many simple `Graphics` objects** over one complex one to maintain GPU batching.
- **Avoid transparent overlap** unless you understand blend modes; overlapping semi-transparent primitives will interact per primitive, not post-composition.

## **Caveats and Gotchas**

- **Memory Leaks**: Call `.destroy()` when no longer needed.
- **SVG and Holes**: Not all SVG hole paths triangulate correctly.
- **Changing Geometry**: Use `.clear()` sparingly. Prefer swapping contexts.
- **Transparency and Blend Modes**: These apply per primitive. Use `RenderTexture` if you want to flatten effects.

---

## **API Reference**

- [Graphics](https://pixijs.download/release/docs/scene.Graphics.html)
- [GraphicsContext](https://pixijs.download/release/docs/scene.GraphicsContext.html)
- [FillStyle](https://pixijs.download/release/docs/scene.FillStyle.html)
- [StrokeStyle](https://pixijs.download/release/docs/scene.StrokeStyle.html)
