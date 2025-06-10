---
sidebar_position: 5
description: Learn how to use scene objects in PixiJS, including containers, sprites, transforms, and more. This guide covers the basics of building your scene graph.
---

# Scene Objects

In PixiJS, scene objects are the building blocks of your application’s display hierarchy. They include **containers**, **sprites**, **text**, **graphics**, and other drawable entities that make up the **scene graph**—the tree-like structure that determines what gets rendered, how, and in what order.

## Containers vs. Leaf Nodes

Scene objects in PixiJS can be divided into **containers** and **leaf nodes**:

### Containers

`Container` is the **base class** for all scene objects in v8 (replacing the old `DisplayObject`).

- Can have children.
- Commonly used to group objects and apply transformations (position, scale, rotation) to the group.
- Examples: `Application.stage`, user-defined groups.

```ts
const group = new Container();
group.addChild(spriteA);
group.addChild(spriteB);
```

### Leaf Nodes

Leaf nodes are renderable objects that should not have children. In v8, **only containers should have children**.

Examples of leaf nodes include:

- `Sprite`
- `Text`
- `Graphics`
- `Mesh`
- `TilingSprite`
- `HTMLText`

Attempting to add children to a leaf node will not result in a runtime error, however, you may run into unexpected rendering behavior. Therefore, If nesting is required, wrap leaf nodes in a `Container`.

**Before v8 (invalid in v8):**

```ts
const sprite = new Sprite();
sprite.addChild(anotherSprite); // ❌ Invalid in v8
```

**v8 approach:**

```ts
const group = new Container();
group.addChild(sprite);
group.addChild(anotherSprite); // ✅ Valid
```

## Transforms

All scene objects in PixiJS have several properties that control their position, rotation, scale, and alpha. These properties are inherited by child objects, allowing you to apply transformations to groups of objects easily.

You will often use these properties to position and animate objects in your scene.

| Property     | Description                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **position** | X- and Y-position are given in pixels and change the position of the object relative to its parent, also available directly as `object.x` / `object.y`  |
| **rotation** | Rotation is specified in radians, and turns an object clockwise (0.0 - 2 \* Math.PI)                                                                    |
| **angle**    | Angle is an alias for rotation that is specified in degrees instead of radians (0.0 - 360.0)                                                            |
| **pivot**    | Point the object rotates around, in pixels - also sets origin for child objects                                                                         |
| **alpha**    | Opacity from 0.0 (fully transparent) to 1.0 (fully opaque), inherited by children                                                                       |
| **scale**    | Scale is specified as a percent with 1.0 being 100% or actual-size, and can be set independently for the x and y axis                                   |
| **skew**     | Skew transforms the object in x and y similar to the CSS skew() function, and is specified in radians                                                   |
| **anchor?**  | Anchor is a percentage-based offset for the sprite's position and rotation. This is different from the `pivot` property, which is a pixel-based offset. |

### **Anchor vs Pivot**

Some leaf nodes have an additional property called `anchor`, which is a percentage-based offset for the nodes position and rotation. This is different from the `pivot` property, which is a pixel-based offset. Understanding the difference between anchor and pivot is critical when positioning or rotating a node.

:::info
Setting either pivot or anchor visually moves the node. This differs from CSS where changing `transform-origin` does not affect the element's position.
:::

#### **Anchor**

- Available only on `Sprite`
- Defined in normalized values `(0.0 to 1.0)`
- `(0, 0)` is the top-left, `(0.5, 0.5)` is the center
- Changes both position and rotation origin

```ts
sprite.anchor.set(0.5); // center
sprite.rotation = Math.PI / 4; // Rotate 45 degrees around the center
```

#### **Pivot**

- Available on all `Container`s
- Defined in **pixels**, not normalized

```ts
const sprite = new Sprite(texture);
sprite.width = 100;
sprite.height = 100;
sprite.pivot.set(50, 50); // Center of the container
container.rotation = Math.PI / 4; // Rotate 45 degrees around the pivot
```

## Measuring Bounds

There are two types of bounds in PixiJS:

- **Local bounds** represent the object’s dimensions in its own coordinate space. Use `getLocalBounds()`.
- **Global bounds** represent the object's bounding box in world coordinates. Use `getBounds()`.

```ts
const local = container.getLocalBounds();
const global = container.getBounds();
```

If performance is critical you can also provide a custom `boundsArea` to avoid per-child measurement entirely.

### Changing size

To change the size of a container, you can use the `width` and `height` properties. This will scale the container to fit the specified dimensions:

```ts
const container = new Container();
container.width = 100;
container.height = 200;
```

Setting the `width` and `height` individually can be an expensive operation, as it requires recalculating the bounds of the container and its children. To avoid this, you can use `setSize()` to set both properties at once:

```ts
const container = new Container();
container.setSize(100, 200);
const size = container.getSize(); // { width: 100, height: 200 }
```

This method is more efficient than setting `width` and `height` separately, as it only requires one bounds calculation.

## Masking Scene Objects

PixiJS supports **masking**, allowing you to restrict the visible area of a scene object based on another object's shape.
This is useful for creating effects like cropping, revealing, or hiding parts of your scene.

### Types of Masks

- **Graphics-based masks**: Use a `Graphics` object to define the shape.
- **Sprite-based masks**: Use a `Sprite` or other renderable object.

```ts
const shape = new Graphics().circle(100, 100, 50).fill(0x000000);

const maskedSprite = new Sprite(texture);
maskedSprite.mask = shape;

stage.addChild(shape);
stage.addChild(maskedSprite);
```

### Inverse Masks

To create an inverse mask, you can use the `setMask` property and set its `inverse` option to `true`. This will render everything outside the mask.

```ts
const inverseMask = new Graphics().rect(0, 0, 200, 200).fill(0x000000);
const maskedContainer = new Container();
maskedContainer.setMask({ mask: inverseMask, inverse: true });
maskedContainer.addChild(sprite);
stage.addChild(inverseMask);
stage.addChild(maskedContainer);
```

### Notes on Masking

- The mask is **not rendered**; it's used only to define the visible area. However, it must be added to the display list.
- Only one mask can be assigned per object.
- For advanced blending, use **alpha masks** or **filters** (covered in later guides).

## Filters

Another common use for Container objects is as hosts for filtered content. Filters are an advanced, WebGL/WebGPU-only feature that allows PixiJS to perform per-pixel effects like blurring and displacements. By setting a filter on a Container, the area of the screen the Container encompasses will be processed by the filter after the Container's contents have been rendered.

```ts
const container = new Container();
const sprite = new Sprite(texture);
const filter = new BlurFilter({ strength: 8, quality: 4, kernelSize: 5 });
container.filters = [filter];
container.addChild(sprite);
```

:::info
Filters should be used somewhat sparingly. They can slow performance and increase memory usage if used too often in a scene.
:::

Below are list of filters available by default in PixiJS. There is, however, a community repository with [many more filters](https://github.com/pixijs/filters).

| Filter             | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| AlphaFilter        | Similar to setting `alpha` property, but flattens the Container instead of applying to children individually. |
| BlurFilter         | Apply a blur effect                                                                                           |
| ColorMatrixFilter  | A color matrix is a flexible way to apply more complex tints or color transforms (e.g., sepia tone).          |
| DisplacementFilter | Displacement maps create visual offset pixels, for instance creating a wavy water effect.                     |
| NoiseFilter        | Create random noise (e.g., grain effect).                                                                     |

Under the hood, each Filter we offer out of the box is written in both glsl (for WebGL) and wgsl (for WebGPU). This means all filters should work on both renderers.

## Tinting

You can tint any scene object by setting the `tint` property. It modifies the color of the rendered pixels, similar to multiplying a tint color over the object.

```ts
const sprite = new Sprite(texture);
sprite.tint = 0xff0000; // Red tint
sprite.tint = 'red'; // Red tint
```

The `tint` is inherited by child objects unless they specify their own. If only part of your scene should be tinted, place it in a separate container.

A value of `0xFFFFFF` disables tinting.

```ts
const sprite = new Sprite(texture);
sprite.tint = 0x00ff00; // Green tint
sprite.tint = 0xffffff; // No tint
```

PixiJS supports a variety of color formats and you can find more information from the [Color documentation](../color.md).

## Blend Modes

Blend modes determine how colors of overlapping objects are combined. PixiJS supports a variety of blend modes, including:

- `normal`: Default blend mode.
- `add`: Adds the colors of the source and destination pixels.
- `multiply`: Multiplies the colors of the source and destination pixels.
- `screen`: Inverts the colors, multiplies them, and inverts again.

We also support may more advanced blend modes, such as `subtract`, `difference`, and `overlay`. You can find the full list of blend modes in the [Blend Modes documentation](../filters.md#advanced-blend-modes).

```ts
const sprite = new Sprite(texture);
sprite.blendMode = 'multiply'; // Multiply blend mode
```

## Interaction

PixiJS provides a powerful interaction system that allows you to handle user input events like clicks/hovers. To enable interaction on a scene object, can be as simple as setting its `interactive` property to `true`.

```ts
const sprite = new Sprite(texture);
sprite.interactive = true;
sprite.on('click', (event) => {
  console.log('Sprite clicked!', event);
});
```

We have a detailed guide on [Interaction](../events.md) that covers how to set up and manage interactions, including hit testing, pointer events, and more. We highly recommend checking it out.

## Using `onRender`

The `onRender` callback allows you to run logic every frame when a scene object is rendered. This is useful for lightweight animation and update logic:

```ts
const container = new Container();
container.onRender = () => {
  container.rotation += 0.01;
};
```

Note: In PixiJS v8, this replaces the common v7 pattern of overriding `updateTransform`, which no longer runs every frame. The `onRender` function is registered with the render group the container belongs to.

To remove the callback:

```ts
container.onRender = null;
```

---

## API Reference

- [Overview](https://pixijs.download/release/docs/scene.html)
- [Container](https://pixijs.download/release/docs/scene.Container.html)
- [ParticleContainer](https://pixijs.download/release/docs/scene.ParticleContainer.html)
- [Sprite](https://pixijs.download/release/docs/scene.Sprite.html)
- [TilingSprite](https://pixijs.download/release/docs/scene.TilingSprite.html)
- [NineSliceSprite](https://pixijs.download/release/docs/scene.NineSliceSprite.html)
- [Graphics](https://pixijs.download/release/docs/scene.Graphics.html)
- [Mesh](https://pixijs.download/release/docs/scene.Mesh.html)
- [Text](https://pixijs.download/release/docs/scene.Text.html)
- [Bitmap Text](https://pixijs.download/release/docs/scene.BitmapText.html)
- [HTMLText](https://pixijs.download/release/docs/scene.HTMLText.html)
