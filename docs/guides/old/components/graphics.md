# Graphics

[Graphics](https://pixijs.download/release/docs/scene.Graphics.html) is a complex and much misunderstood tool in the PixiJS toolbox.  At first glance, it looks like a tool for drawing shapes.  And it is!  But it can also be used to generate masks.  How does that work?

In this guide, we're going to de-mystify the `Graphics` object, starting with how to think about what it does.

Check out the [graphics example code](../../examples/graphics/simple).

## Graphics Is About Building - Not Drawing

First-time users of the `Graphics` class often struggle with how it works.  Let's look at an example snippet that creates a `Graphics` object and draws a rectangle:

```javascript
// Create a Graphics object, draw a rectangle and fill it
let obj = new Graphics()
  .rect(0, 0, 200, 100)
  .fill(0xff0000);

// Add it to the stage to render
app.stage.addChild(obj);
```

That code will work - you'll end up with a red rectangle on the screen.  But it's pretty confusing when you start to think about it.  Why am I drawing a rectangle when *constructing* the object?  Isn't drawing something a one-time action?  How does the rectangle get drawn the *second* frame?  And it gets even weirder when you create a `Graphics` object with a bunch of drawThis and drawThat calls, and then you use it as a *mask*.  What???

The problem is that the function names are centered around *drawing*, which is an action that puts pixels on the screen.  But in spite of that, the `Graphics` object is really about *building*.

Let's look a bit deeper at that `rect()` call.  When you call `rect()`, PixiJS doesn't actually draw anything.  Instead, it stores the rectangle you "drew" into a list of geometry for later use.  If you then add the `Graphics` object to the scene, the renderer will come along, and ask the `Graphics` object to render itself.  At that point, your rectangle actually gets drawn - along with any other shapes, lines, etc. that you've added to the geometry list.

Once you understand what's going on, things start to make a lot more sense.  When you use a `Graphics` object as a mask, for example, the masking system uses that list of graphics primitives in the geometry list to constrain which pixels make it to the screen.  There's no drawing involved.

That's why it helps to think of the `Graphics` class not as a drawing tool, but as a geometry building tool.

## Types of Primitives

There are a lot of functions in the `Graphics` class, but as a quick orientation, here's the list of basic primitives you can add:

* Line
* Rect
* RoundRect
* Circle
* Ellipse
* Arc
* Bezier and Quadratic Curve

In addition, you have access to the following complex primitives:

* Torus
* Chamfer Rect
* Fillet Rect
* Regular Polygon
* Star
* Rounded Polygon

There is also support for svg. But due to the nature of how PixiJS renders holes (it favours performance) Some complex hole shapes may render incorrectly. But for the majority of shapes, this will do the trick!

 ```ts
  let mySvg = new Graphics().svg(`
    <svg>
      <path d="M 100 350 q 150 -300 300 0" stroke="blue" />
    </svg>
   `);
```

## The GraphicsContext

Understanding the relationship between Sprites and their shared Texture can help grasp the concept of a `GraphicsContext`. Just as multiple Sprites can utilize a single Texture, saving memory by not duplicating pixel data, a GraphicsContext can be shared across multiple Graphics objects.

This sharing of a `GraphicsContext` means that the intensive task of converting graphics instructions into GPU-ready geometry is done once, and the results are reused, much like textures. Consider the difference in efficiency between these approaches:

Creating individual circles without sharing a context:
```ts
// Create 5 circles
for (let i = 0; i < 5; i++) {
  let circle = new Graphics()
    .circle(100, 100, 50)
    .fill('red');
}
```
Versus sharing a GraphicsContext:
```ts
// Create a master Graphicscontext
let circleContext = new GraphicsContext()
  .circle(100, 100, 50)
  .fill('red')

// Create 5 duplicate objects
for (let i = 0; i < 5; i++) {
  // Initialize the duplicate using our circleContext
  let duplicate = new Graphics(circleContext);
}
```

Now, this might not be a huge deal for circles and squares, but when you are using SVGs, it becomes quite important to not have to rebuild each time and instead share a `GraphicsContext`. It's recommended for maximum performance to create your contexts upfront and reuse them, just like textures!

```ts
let circleContext = new GraphicsContext()
  .circle(100, 100, 50)
  .fill('red')

let rectangleContext = new GraphicsContext()
  .rect(0, 0, 50, 50)
  .fill('red')

let frames = [circleContext, rectangleContext];
let frameIndex = 0;

const graphics = new Graphics(frames[frameIndex]);

// animate from square to circle:

function update()
{
  // swap the context - this is a very cheap operation!
  // much cheaper than clearing it each frame.
  graphics.context = frames[frameIndex++%frames.length];
}
```

If you don't explicitly pass a `GraphicsContext` when creating a `Graphics` object, then internally, it will have its own context, accessible via `myGraphics.context`. The [GraphicsContext](https://pixijs.download/release/docs/scene.GraphicsContext.html) class manages the list of geometry primitives created by the Graphics parent object. Graphics functions are literally passed through to the internal contexts:

```ts
let circleGraphics = new Graphics()
  .circle(100, 100, 50)
  .fill('red')
```
same as:
```ts
let circleGraphics = new Graphics()

circleGraphics.context
  .circle(100, 100, 50)
  .fill('red')
```

Calling `Graphics.destroy()` will destroy the graphics. If a context was passed to it via the constructor then it will leave the destruction the that context to you. However if the context is internally created (the default), when destroyed the Graphics object will destroy its internal `GraphicsContext`.

## Graphics For Display

OK, so now that we've covered how the `Graphics` class works, let's look at how you use it.  The most obvious use of a `Graphics` object is to draw dynamically generated shapes to the screen.

Doing so is simple.  Create the object, call the various builder functions to add your custom primitives, then add the object to the scene graph.  Each frame, the renderer will come along, ask the `Graphics` object to render itself, and each primitive, with associated line and fill styles, will be drawn to the screen.

## Graphics as a Mask

You can also use a Graphics object as a complex mask.  To do so, build your object and primitives as usual.  Next create a `Container` object that will contain the masked content, and set its `mask` property to your Graphics object.  The children of the container will now be clipped to only show through inside the geometry you've created.  This technique works for both WebGL and Canvas-based rendering.

Check out the [masking example code](../../examples/masks/graphics).

## Caveats and Gotchas

The `Graphics` class is a complex beast, and so there are a number of things to be aware of when using it.

**Memory Leaks**: Call `destroy()` on any `Graphics` object you no longer need to avoid memory leaks.

**Holes**: Holes you create have to be completely contained in the shape or else it may not be able to triangulate correctly. <!--TODO: primitive shapes not working on canvas?-->

**Changing Geometry**: If you want to change the shape of a `Graphics` object, you don't need to delete and recreate it.  Instead you can use the `clear()` function to reset the contents of the geometry list, then add new primitives as desired.  Be careful of performance when doing this every frame.

**Performance**: `Graphics` objects are generally quite performant.  However, if you build highly complex geometry, you may pass the threshold that permits batching during rendering, which can negatively impact performance. It's better for batching to use many `Graphics` objects instead of a single `Graphics` with many shapes.

**Transparency**: Because the `Graphics` object renders its primitives sequentially, be careful when using blend modes or partial transparency with overlapping geometry.  Blend modes like `ADD` and `MULTIPLY` will work *on each primitive*, not on the final composite image.  Similarly, partially transparent `Graphics` objects will show primitives overlapping. To apply transparency or blend modes to a single flattened surface, consider using AlphaFilter or RenderTexture.

<!--## Baking Into Texture

TODO: Advantages vs disadvantages of pre-rendering to a texture, using render texture: https://jsfiddle.net/bigtimebuddy/6tzyv91j/-->
