# Containers

The [Container](https://pixijs.download/release/docs/PIXI.Container.html) class provides a simple display object that does what its name implies - collect a set of child objects together.  But beyond grouping objects, containers have a few uses that you should be aware of.

## Containers as Groups

Almost every type of display object is also derived from Container - even Sprites!  This means that in many cases you can create a parent-child hierarchy with the objects you want to render.

However, it's a good idea _not_ to do this.  Standalone Container objects are **very** cheap to render, and having a proper hierarchy of Container objects, each containing one or more renderable objects, provides flexibility in rendering order.  It also future-proofs your code, as when you need to add an additional object to a branch of the tree, your animation logic doesn't need to change - just drop the new object into the proper Container, and your logic moves the Container with no changes to your code.

So that's the primary use for Containers - as groups of renderable objects in a hierarchy.

Check out the [container example code](../../examples/basic/container).

## Masking

Another common use for Container objects is as hosts for masked content.  "Masking" is a technique where parts of your scene graph are only visible within a given area.

Think of a pop-up window.  It has a frame made of one or more Sprites, then has a scrollable content area that hides content outside the frame.  A Container plus a mask makes that scrollable area easy to implement.  Add the Container, set its `mask` property to a Graphics object with a rect, and add the text, image, etc. content you want to display as children of that masked Container.  Any content that extends beyond the rectangular mask will simply not be drawn.  Move the contents of the Container to scroll as desired.

```javascript
// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Create window frame
let frame = new PIXI.Graphics();
frame.beginFill(0x666666);
frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 });
frame.drawRect(0, 0, 208, 208);
frame.position.set(320 - 104, 180 - 104);
app.stage.addChild(frame);

// Create a graphics object to define our mask
let mask = new PIXI.Graphics();
// Add the rectangular area to show
mask.beginFill(0xffffff);
mask.drawRect(0,0,200,200);
mask.endFill();

// Add container that will hold our masked content
let maskContainer = new PIXI.Container();
// Set the mask to use our graphics object from above
maskContainer.mask = mask;
// Add the mask as a child, so that the mask is positioned relative to its parent
maskContainer.addChild(mask);
// Offset by the window's frame width
maskContainer.position.set(4,4);
// And add the container to the window!
frame.addChild(maskContainer);

// Create contents for the masked container
let text = new PIXI.Text(
  'This text will scroll up and be masked, so you can see how masking works.  Lorem ipsum and all that.\n\n' +
  'You can put anything in the container and it will be masked!',
  {
    fontSize: 24,
    fill: 0x1010ff,
    wordWrap: true,
    wordWrapWidth: 180
  }
);
text.x = 10;
maskContainer.addChild(text);

// Add a ticker callback to scroll the text up and down
let elapsed = 0.0;
app.ticker.add((delta) => {
  // Update the text's y coordinate to scroll it
  elapsed += delta;
  text.y = 10 + -100.0 + Math.cos(elapsed/50.0) * 100.0;
});
```

There are two types of masks supported by PixiJS:

Use a [Graphics](https://pixijs.download/release/docs/PIXI.Graphics.html) object to create a mask with an arbitrary shape - powerful, but doesn't support anti-aliasing

Sprite: Use the alpha channel from a [Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html) as your mask, providing anti-aliased edging - _not_ supported on the Canvas renderer

## Filtering

Another common use for Container objects is as hosts for filtered content.  Filters are an advanced, WebGL-only feature that allows PixiJS to perform per-pixel effects like blurring and displacements.  By setting a filter on a Container, the area of the screen the Container encompasses will be processed by the filter after the Container's contents have been rendered.

Below are list of filters available by default in PixiJS. There is, however, a community repository with [many more filters](https://github.com/pixijs/filters).

| Filter                                                                                 | Description                                                                                                   |
| ---                                                                                    | ---                                                                                                           |
| AlphaFilter: `@pixi/filter-alpha`                      | Similar to setting `alpha` property, but flattens the Container instead of applying to children individually. |
| BlurFilter: `@pixi/filter-blur`                         | Apply a blur effect                                                                                           |
| ColorMatrixFilter: `@pixi/filter-color-matrix`   | A color matrix is a flexible way to apply more complex tints or color transforms (e.g., sepia tone).          |
| DisplacementFilter: `@pixi/filter-displacement` | Displacement maps create visual offset pixels, for instance creating a wavy water effect.                     |
| FXAAFilter: `@pixi/filter-fxaa`                         | Basic FXAA (Fast Approximate Anti-Aliasing) to create smoothing effect.                                       |
| NoiseFilter: `@pixi/filter-noise`                      | Create random noise (e.g., grain effect).                                                                     |

_**Important:** Filters should be use somewhat sparingly. They can slow performance and increase memory if used too often in a scene._
