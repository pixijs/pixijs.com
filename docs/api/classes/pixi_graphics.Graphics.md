---
id: "pixi_graphics.Graphics"
title: "Class: Graphics"
sidebar_label: "Graphics"
custom_edit_url: null
---

[@pixi/graphics](../modules/pixi_graphics.md).Graphics

The Graphics class is primarily used to render primitive shapes such as lines, circles and
rectangles to the display, and to color and fill them.  However, you can also use a Graphics
object to build a list of primitives to use as a mask, or as a complex hitArea.

Please note that due to legacy naming conventions, the behavior of some functions in this class
can be confusing.  Each call to `drawRect()`, `drawPolygon()`, etc. actually stores that primitive
in the Geometry class's GraphicsGeometry object for later use in rendering or hit testing - the
functions do not directly draw anything to the screen.  Similarly, the `clear()` function doesn't
change the screen, it simply resets the list of primitives, which can be useful if you want to
rebuild the contents of an existing Graphics object.

Once a GraphicsGeometry list is built, you can re-use it in other Geometry objects as
an optimization, by passing it into a new Geometry object's constructor.  Because of this
ability, it's important to call `destroy()` on Geometry objects once you are done with them, to
properly dereference each GraphicsGeometry and prevent memory leaks.

**`Memberof`**

PIXI

## Hierarchy

- `Graphics`

- `Container`

  ↳ **`Graphics`**

## Constructors

### constructor

• **new Graphics**(`geometry?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `geometry` | [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md) | `null` | Geometry to use, if omitted will create a new GraphicsGeometry instance. |

#### Inherited from

GlobalMixins.Graphics.constructor

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:168](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L168)

## Properties

### \_accessibleActive

• `Optional` **\_accessibleActive**: `boolean`

#### Inherited from

Container.\_accessibleActive

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L21)

___

### \_accessibleDiv

• `Optional` **\_accessibleDiv**: `IAccessibleHTMLElement`

#### Inherited from

Container.\_accessibleDiv

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L22)

___

### \_bounds

• **\_bounds**: `Bounds`

The bounds object, this is used to calculate and store the bounds of the displayObject.

#### Inherited from

Container.\_bounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L299)

___

### \_cacheAsBitmap

• **\_cacheAsBitmap**: `boolean`

#### Inherited from

Container.\_cacheAsBitmap

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L10)

___

### \_cacheAsBitmapMultisample

• **\_cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

Container.\_cacheAsBitmapMultisample

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L9)

___

### \_cacheAsBitmapResolution

• **\_cacheAsBitmapResolution**: `number`

#### Inherited from

Container.\_cacheAsBitmapResolution

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L8)

___

### \_cacheData

• **\_cacheData**: `CacheData`

#### Inherited from

Container.\_cacheData

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L11)

___

### \_localBounds

• **\_localBounds**: `Bounds`

Local bounds object, swapped with `_bounds` when using `getLocalBounds()`.

#### Inherited from

Container.\_localBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:302](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L302)

___

### accessible

• `Optional` **accessible**: `boolean`

#### Inherited from

Container.accessible

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L17)

___

### accessibleChildren

• `Optional` **accessibleChildren**: `boolean`

#### Inherited from

Container.accessibleChildren

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L25)

___

### accessibleHint

• `Optional` **accessibleHint**: `string`

#### Inherited from

Container.accessibleHint

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L19)

___

### accessiblePointerEvents

• `Optional` **accessiblePointerEvents**: `PointerEvents`

#### Inherited from

Container.accessiblePointerEvents

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L24)

___

### accessibleTitle

• `Optional` **accessibleTitle**: `string`

#### Inherited from

Container.accessibleTitle

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L18)

___

### accessibleType

• `Optional` **accessibleType**: `string`

#### Inherited from

Container.accessibleType

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L23)

___

### alpha

• **alpha**: `number`

The opacity of the object.

#### Inherited from

Container.alpha

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L232)

___

### cacheAsBitmap

• **cacheAsBitmap**: `boolean`

#### Inherited from

Container.cacheAsBitmap

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L5)

___

### cacheAsBitmapMultisample

• **cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

Container.cacheAsBitmapMultisample

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L7)

___

### cacheAsBitmapResolution

• **cacheAsBitmapResolution**: `number`

#### Inherited from

Container.cacheAsBitmapResolution

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L6)

___

### cachedGraphicsData

• **cachedGraphicsData**: [`GraphicsData`](pixi_graphics.GraphicsData.md)[]

#### Inherited from

GlobalMixins.Graphics.cachedGraphicsData

#### Defined in

[pixijs/packages/canvas-graphics/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-graphics/global.d.ts#L7)

___

### children

• `Readonly` **children**: `DisplayObject`[]

The array of children of this container.

#### Inherited from

Container.children

#### Defined in

[pixijs/packages/display/src/Container.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L71)

___

### containerUpdateTransform

• **containerUpdateTransform**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

Container.containerUpdateTransform

#### Defined in

[pixijs/packages/display/src/Container.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L94)

___

### cullArea

• **cullArea**: `Rectangle`

If set, this shape is used for culling instead of the bounds of this object.
It can improve the culling performance of objects with many children.
The culling area is defined in local space.

#### Inherited from

Container.cullArea

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L262)

___

### cullable

• **cullable**: `boolean`

Should this object be rendered if the bounds of this object are out of frame?

Culling has no effect on whether updateTransform is called.

#### Inherited from

Container.cullable

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:255](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L255)

___

### currentPath

• `Readonly` **currentPath**: `Polygon` = `null`

Current path

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L119)

___

### cursor

• **cursor**: `string`

The cursor preferred when the mouse pointer is hovering over.

#### Inherited from

Container.cursor

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L62)

___

### displayObjectUpdateTransform

• **displayObjectUpdateTransform**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

Container.displayObjectUpdateTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:332](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L332)

___

### drawChamferRect

• `Optional` **drawChamferRect**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `width`: `number`, `height`: `number`, `chamfer`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `width`, `height`, `chamfer`): [`Graphics`](pixi_graphics.Graphics.md)

Draw Rectangle with chamfer corners. These are angled corners.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawChamferRect

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) |  |
| `x` | `number` | Upper left corner of rect |
| `y` | `number` | Upper right corner of rect |
| `width` | `number` | Width of rect |
| `height` | `number` | Height of rect |
| `chamfer` | `number` | non-zero real number, size of corner cutout |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

Returns self.

#### Inherited from

GlobalMixins.Graphics.drawChamferRect

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L13)

___

### drawFilletRect

• `Optional` **drawFilletRect**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `width`: `number`, `height`: `number`, `fillet`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `width`, `height`, `fillet`): [`Graphics`](pixi_graphics.Graphics.md)

Draw Rectangle with fillet corners. This is much like rounded rectangle
however it support negative numbers as well for the corner radius.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawFilletRect

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) |  |
| `x` | `number` | Upper left corner of rect |
| `y` | `number` | Upper right corner of rect |
| `width` | `number` | Width of rect |
| `height` | `number` | Height of rect |
| `fillet` | `number` | accept negative or positive values |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

Returns self.

#### Inherited from

GlobalMixins.Graphics.drawFilletRect

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L14)

___

### drawRegularPolygon

• `Optional` **drawRegularPolygon**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `radius`: `number`, `sides`: `number`, `rotation`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `radius`, `sides`, `rotation?`): [`Graphics`](pixi_graphics.Graphics.md)

Draw a regular polygon where all sides are the same length.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawRegularPolygon

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `radius` | `number` | `undefined` | Polygon radius |
| `sides` | `number` | `undefined` | Minimum value is 3 |
| `rotation` | `number` | `0` | Starting rotation values in radians.. |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Inherited from

GlobalMixins.Graphics.drawRegularPolygon

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L15)

___

### drawRoundedPolygon

• `Optional` **drawRoundedPolygon**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `radius`: `number`, `sides`: `number`, `corner`: `number`, `rotation`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `radius`, `sides`, `corner`, `rotation?`): [`Graphics`](pixi_graphics.Graphics.md)

Draw a regular polygon with rounded corners.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawRoundedPolygon

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `radius` | `number` | `undefined` | Polygon radius |
| `sides` | `number` | `undefined` | Minimum value is 3 |
| `corner` | `number` | `undefined` | Corner size in pixels. |
| `rotation` | `number` | `0` | Starting rotation values in radians.. |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Inherited from

GlobalMixins.Graphics.drawRoundedPolygon

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L16)

___

### drawStar

• `Optional` **drawStar**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `points`: `number`, `radius`: `number`, `innerRadius`: `number`, `rotation`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `points`, `radius`, `innerRadius`, `rotation?`): [`Graphics`](pixi_graphics.Graphics.md)

Draw a star shape with an arbitrary number of points.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawStar

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) | `undefined` |  |
| `x` | `number` | `undefined` | Center X position of the star |
| `y` | `number` | `undefined` | Center Y position of the star |
| `points` | `number` | `undefined` | The number of points of the star, must be > 1 |
| `radius` | `number` | `undefined` | The outer radius of the star |
| `innerRadius` | `number` | `undefined` | The inner radius between points, default half `radius` |
| `rotation` | `number` | `0` | The rotation of the star in radians, where 0 is vertical |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Inherited from

GlobalMixins.Graphics.drawStar

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L17)

___

### drawTorus

• `Optional` **drawTorus**: (`this`: [`Graphics`](pixi_graphics.Graphics.md), `x`: `number`, `y`: `number`, `innerRadius`: `number`, `outerRadius`: `number`, `startArc?`: `number`, `endArc?`: `number`) => [`Graphics`](pixi_graphics.Graphics.md)

#### Type declaration

▸ (`this`, `x`, `y`, `innerRadius`, `outerRadius`, `startArc?`, `endArc?`): [`Graphics`](pixi_graphics.Graphics.md)

Draw a torus shape, like a donut. Can be used for something like a circle loader.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawTorus

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | [`Graphics`](pixi_graphics.Graphics.md) | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `innerRadius` | `number` | `undefined` | Inner circle radius |
| `outerRadius` | `number` | `undefined` | Outer circle radius |
| `startArc?` | `number` | `0` | Where to begin sweep, in radians, 0.0 = to the right |
| `endArc?` | `number` | `undefined` | Where to end sweep, in radians |

##### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Inherited from

GlobalMixins.Graphics.drawTorus

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L12)

___

### filterArea

• **filterArea**: `Rectangle`

The area the filter is applied to. This is used as more of an optimization
rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.

Also works as an interaction mask.

#### Inherited from

Container.filterArea

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L270)

___

### filters

• **filters**: `Filter`[]

Sets the filters for the displayObject.
IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
To remove filters simply set this property to `'null'`.

#### Inherited from

Container.filters

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L277)

___

### hitArea

• **hitArea**: `IHitArea`

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Inherited from

Container.hitArea

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Inherited from

Container.interactive

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Inherited from

Container.interactiveChildren

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### isMask

• **isMask**: `boolean`

Does any other displayObject use this object as a mask?

#### Inherited from

Container.isMask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L283)

___

### isSprite

• **isSprite**: `boolean`

Used to fast check if a sprite is.. a sprite!

#### Inherited from

Container.isSprite

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:280](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L280)

___

### name

• **name**: `string`

#### Inherited from

Container.name

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L5)

___

### onclick

• **onclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'click' event

#### Inherited from

Container.onclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mousedown' event

#### Inherited from

Container.onmousedown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseenter' event

#### Inherited from

Container.onmouseenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseleave' event

#### Inherited from

Container.onmouseleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

Container.onmousemove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseout' event

#### Inherited from

Container.onmouseout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

Container.onmouseover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseup' event

#### Inherited from

Container.onmouseup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseupoutside' event

#### Inherited from

Container.onmouseupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointercancel' event

#### Inherited from

Container.onpointercancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerdown' event

#### Inherited from

Container.onpointerdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerenter' event

#### Inherited from

Container.onpointerenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerleave' event

#### Inherited from

Container.onpointerleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointermove' event

#### Inherited from

Container.onpointermove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerout' event

#### Inherited from

Container.onpointerout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerover' event

#### Inherited from

Container.onpointerover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointertap' event

#### Inherited from

Container.onpointertap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerup' event

#### Inherited from

Container.onpointerup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerupoutside' event

#### Inherited from

Container.onpointerupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightclick' event

#### Inherited from

Container.onrightclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightdown' event

#### Inherited from

Container.onrightdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightup' event

#### Inherited from

Container.onrightup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightupoutside' event

#### Inherited from

Container.onrightupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'tap' event

#### Inherited from

Container.ontap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchcancel' event

#### Inherited from

Container.ontouchcancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchend' event

#### Inherited from

Container.ontouchend

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchendoutside' event

#### Inherited from

Container.ontouchendoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchmove' event

#### Inherited from

Container.ontouchmove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchstart' event

#### Inherited from

Container.ontouchstart

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: `FederatedEventHandler`<`FederatedWheelEvent`\>

Handler for 'wheel' event

#### Inherited from

Container.onwheel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

___

### parent

• **parent**: `Container`<`DisplayObject`\>

#### Inherited from

Container.parent

#### Defined in

[pixijs/packages/display/src/Container.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L93)

___

### pluginName

• **pluginName**: `string` = `'batch'`

Renderer plugin for batching

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L113)

___

### renderId

• `Optional` **renderId**: `number`

#### Inherited from

Container.renderId

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L26)

___

### renderable

• **renderable**: `boolean`

Can this object be rendered, if false the object will not be drawn but the updateTransform
methods will still be called.

Only affects recursive calls from parent. You can ask for bounds manually.

#### Inherited from

Container.renderable

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L248)

___

### shader

• **shader**: `Shader` = `null`

Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
Can be shared between multiple Graphics objects.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L110)

___

### sortDirty

• **sortDirty**: `boolean`

Should children be sorted by zIndex at the next updateTransform call.

Will get automatically set to true if a new child is added, or if a child's zIndex changes.

#### Inherited from

Container.sortDirty

#### Defined in

[pixijs/packages/display/src/Container.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L92)

___

### sortableChildren

• **sortableChildren**: `boolean`

If set to true, the container will sort its children by `zIndex` value
when `updateTransform()` is called, or manually if `sortChildren()` is called.

This actually changes the order of elements in the array, so should be treated
as a basic solution that is not performant compared to other solutions,
such as [PixiJS Layers](https://github.com/pixijs/layers)

Also be aware of that this may not work nicely with the `addChildAt()` function,
as the `zIndex` sorting may cause the child to automatically sorted to another position.

**`See`**

PIXI.Container.defaultSortableChildren

#### Inherited from

Container.sortableChildren

#### Defined in

[pixijs/packages/display/src/Container.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L85)

___

### tabIndex

• `Optional` **tabIndex**: `number`

#### Inherited from

Container.tabIndex

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L20)

___

### transform

• **transform**: `Transform`

World transform and local transform of this object.
This will become read-only later, please do not assign anything there unless you know what are you doing.

#### Inherited from

Container.transform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:229](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L229)

___

### visible

• **visible**: `boolean`

The visibility of the object. If false the object will not be drawn, and
the updateTransform function will not be called.

Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.

#### Inherited from

Container.visible

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L240)

___

### worldAlpha

• `Readonly` **worldAlpha**: `number`

The multiplied alpha of the displayObject.

#### Inherited from

Container.worldAlpha

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L223)

___

### curves

▪ `Static` `Readonly` **curves**: `Object` = `curves`

Graphics curves resolution settings. If `adaptive` flag is set to `true`,
the resolution is calculated based on the curve's length to ensure better visual quality.
Adaptive draw works with `bezierCurveTo` and `quadraticCurveTo`.

**`Static`**

**`Property`**

flag indicating if the resolution should be adaptive

**`Property`**

maximal length of a single segment of the curve (if adaptive = false, ignored)

**`Property`**

minimal number of segments in the curve (if adaptive = false, ignored)

**`Property`**

maximal number of segments in the curve (if adaptive = false, ignored)

**`Property`**

precision of the curve fitting

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adaptive` | `boolean` |
| `epsilon` | `number` |
| `maxLength` | `number` |
| `maxSegments` | `number` |
| `minSegments` | `number` |
| `_segmentsCount` | (`length`: `number`, `defaultSegments`: `number`) => `number` |

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L98)

___

### defaultSortableChildren

▪ `Static` **defaultSortableChildren**: `boolean` = `false`

Sets the default value for the container property `sortableChildren`.
If set to true, the container will sort its children by zIndex value
when `updateTransform()` is called, or manually if `sortChildren()` is called.

This actually changes the order of elements in the array, so should be treated
as a basic solution that is not performant compared to other solutions,
such as [PixiJS Layers](https://github.com/pixijs/layers).

Also be aware of that this may not work nicely with the `addChildAt()` function,
as the `zIndex` sorting may cause the child to automatically sorted to another position.

**`Static`**

#### Defined in

[pixijs/packages/display/src/Container.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L65)

## Accessors

### angle

• `get` **angle**(): `number`

The angle of the object in degrees.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Inherited from

Container.angle

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:894](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L894)

• `set` **angle**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.angle

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:899](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L899)

___

### blendMode

• `get` **blendMode**(): `BLEND_MODES`

#### Returns

`BLEND_MODES`

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:219](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L219)

• `set` **blendMode**(`value`): `void`

The blend mode to be applied to the graphic shape. Apply a value of
`PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
primitive in the GraphicsGeometry list is rendered sequentially, modes
such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
be applied per-primitive.

**`Default`**

PIXI.BLEND_MODES.NORMAL

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BLEND_MODES` |

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L214)

___

### destroyed

• `get` **destroyed**(): `boolean`

Readonly flag for destroyed display objects.

#### Returns

`boolean`

#### Inherited from

Container.destroyed

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:419](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L419)

___

### fill

• `get` **fill**(): [`FillStyle`](pixi_graphics.FillStyle.md)

The current fill style.

#### Returns

[`FillStyle`](pixi_graphics.FillStyle.md)

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:243](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L243)

___

### geometry

• `get` **geometry**(): [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

Includes vertex positions, face indices, normals, colors, UVs, and
custom attributes within buffers, reducing the cost of passing all
this data to the GPU. Can be shared between multiple Mesh or Graphics objects.

#### Returns

[`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L160)

___

### height

• `get` **height**(): `number`

The height of the Container, setting this will actually modify the scale to achieve the value set.

#### Returns

`number`

#### Inherited from

Container.height

#### Defined in

[pixijs/packages/display/src/Container.ts:817](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L817)

• `set` **height**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.height

#### Defined in

[pixijs/packages/display/src/Container.ts:822](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L822)

___

### line

• `get` **line**(): [`LineStyle`](pixi_graphics.LineStyle.md)

The current line style.

#### Returns

[`LineStyle`](pixi_graphics.LineStyle.md)

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:252](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L252)

___

### localTransform

• `get` **localTransform**(): `Matrix`

Current transform of the object based on local factors: position, scale, other stuff.

#### Returns

`Matrix`

#### Inherited from

Container.localTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:810](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L810)

___

### mask

• `get` **mask**(): `MaskData` \| `Container`<`DisplayObject`\>

Sets a mask for the displayObject. A mask is an object that limits the visibility of an
object to the shape of the mask applied to it. In PixiJS a regular mask must be a
PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it
utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
To remove a mask, set this property to `null`.

For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.

**`Example`**

```ts
import { Graphics, Sprite } from 'pixi.js';

const graphics = new Graphics();
graphics.beginFill(0xFF3300);
graphics.drawRect(50, 250, 100, 100);
graphics.endFill();

const sprite = new Sprite(texture);
sprite.mask = graphics;
```

**`Todo`**

At the moment, CanvasRenderer doesn't support Sprite as mask.

#### Returns

`MaskData` \| `Container`<`DisplayObject`\>

#### Inherited from

Container.mask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:968](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L968)

• `set` **mask**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `MaskData` \| `Container`<`DisplayObject`\> |

#### Returns

`void`

#### Inherited from

Container.mask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:973](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L973)

___

### pivot

• `get` **pivot**(): `ObservablePoint`<`any`\>

The center of rotation, scaling, and skewing for this display object in its local space. The `position`
is the projection of `pivot` in the parent's local space.

By default, the pivot is the origin (0, 0).

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Inherited from

Container.pivot

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:852](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L852)

• `set` **pivot**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

Container.pivot

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:857](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L857)

___

### position

• `get` **position**(): `ObservablePoint`<`any`\>

The coordinate of the object relative to the local coordinates of the parent.

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Inherited from

Container.position

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:819](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L819)

• `set` **position**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

Container.position

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:824](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L824)

___

### rotation

• `get` **rotation**(): `number`

The rotation of the object in radians.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Inherited from

Container.rotation

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:880](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L880)

• `set` **rotation**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.rotation

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:885](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L885)

___

### scale

• `get` **scale**(): `ObservablePoint`<`any`\>

The scale factors of this object along the local coordinate axes.

The default scale is (1, 1).

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Inherited from

Container.scale

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:835](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L835)

• `set` **scale**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

Container.scale

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:840](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L840)

___

### skew

• `get` **skew**(): `ObservablePoint`<`any`\>

The skew factor for the object in radians.

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Inherited from

Container.skew

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:866](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L866)

• `set` **skew**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

Container.skew

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:871](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L871)

___

### tint

• `get` **tint**(): `number`

The tint applied to each graphic shape. This is a hex value. A value of
0xFFFFFF will remove any tint effect.

**`Default`**

0xFFFFFF

#### Returns

`number`

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:229](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L229)

• `set` **tint**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:234](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L234)

___

### width

• `get` **width**(): `number`

The width of the Container, setting this will actually modify the scale to achieve the value set.

#### Returns

`number`

#### Inherited from

Container.width

#### Defined in

[pixijs/packages/display/src/Container.ts:795](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L795)

• `set` **width**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.width

#### Defined in

[pixijs/packages/display/src/Container.ts:800](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L800)

___

### worldTransform

• `get` **worldTransform**(): `Matrix`

Current transform of the object based on world (parent) factors.

#### Returns

`Matrix`

#### Inherited from

Container.worldTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:801](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L801)

___

### worldVisible

• `get` **worldVisible**(): `boolean`

Indicates if the object is globally visible.

#### Returns

`boolean`

#### Inherited from

Container.worldVisible

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:930](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L930)

___

### x

• `get` **x**(): `number`

The position of the displayObject on the x axis relative to the local coordinates of the parent.
An alias to position.x

#### Returns

`number`

#### Inherited from

Container.x

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:773](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L773)

• `set` **x**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.x

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:778](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L778)

___

### y

• `get` **y**(): `number`

The position of the displayObject on the y axis relative to the local coordinates of the parent.
An alias to position.y

#### Returns

`number`

#### Inherited from

Container.y

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:787](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L787)

• `set` **y**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.y

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:792](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L792)

___

### zIndex

• `get` **zIndex**(): `number`

The zIndex of the displayObject.

If a container has the sortableChildren property set to true, children will be automatically
sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
and thus rendered on top of other display objects within the same container.

**`See`**

PIXI.Container#sortableChildren

#### Returns

`number`

#### Inherited from

Container.zIndex

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:912](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L912)

• `set` **zIndex**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Container.zIndex

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:917](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L917)

## Methods

### \_cacheAsBitmapDestroy

▸ **_cacheAsBitmapDestroy**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `boolean` \| `IDestroyOptions` |

#### Returns

`void`

#### Inherited from

Container.\_cacheAsBitmapDestroy

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L19)

___

### \_calculateCachedBounds

▸ **_calculateCachedBounds**(): `void`

#### Returns

`void`

#### Inherited from

Container.\_calculateCachedBounds

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L14)

___

### \_destroyCachedDisplayObject

▸ **_destroyCachedDisplayObject**(): `void`

#### Returns

`void`

#### Inherited from

Container.\_destroyCachedDisplayObject

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L18)

___

### \_getCachedLocalBounds

▸ **_getCachedLocalBounds**(): `Rectangle`

#### Returns

`Rectangle`

#### Inherited from

Container.\_getCachedLocalBounds

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L15)

___

### \_initCachedDisplayObject

▸ **_initCachedDisplayObject**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Returns

`void`

#### Inherited from

Container.\_initCachedDisplayObject

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L13)

___

### \_initCachedDisplayObjectCanvas

▸ **_initCachedDisplayObjectCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> |

#### Returns

`void`

#### Inherited from

Container.\_initCachedDisplayObjectCanvas

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L17)

___

### \_renderCached

▸ **_renderCached**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Returns

`void`

#### Inherited from

Container.\_renderCached

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L12)

___

### \_renderCachedCanvas

▸ **_renderCachedCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> |

#### Returns

`void`

#### Inherited from

Container.\_renderCachedCanvas

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L16)

___

### \_renderCanvas

▸ **_renderCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |

#### Returns

`void`

#### Inherited from

GlobalMixins.Graphics.\_renderCanvas

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L10)

___

### addChild

▸ **addChild**<`U`\>(`...children`): `U`[``0``]

Adds one or more children to the container.

Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to add to the container |

#### Returns

`U`[``0``]

- The first child that was added.

#### Inherited from

Container.addChild

#### Defined in

[pixijs/packages/display/src/Container.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L140)

___

### addChildAt

▸ **addChildAt**<`U`\>(`child`, `index`): `U`

Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`<`U`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `U` | The child to add |
| `index` | `number` | The index to place the child in |

#### Returns

`U`

The child that was added.

#### Inherited from

Container.addChildAt

#### Defined in

[pixijs/packages/display/src/Container.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L188)

___

### arc

▸ **arc**(`cx`, `cy`, `radius`, `startAngle`, `endAngle`, `anticlockwise?`): [`Graphics`](pixi_graphics.Graphics.md)

The arc method creates an arc/curve (used to create circles, or parts of circles).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cx` | `number` | `undefined` | The x-coordinate of the center of the circle |
| `cy` | `number` | `undefined` | The y-coordinate of the center of the circle |
| `radius` | `number` | `undefined` | The radius of the circle |
| `startAngle` | `number` | `undefined` | The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle) |
| `endAngle` | `number` | `undefined` | The ending angle, in radians |
| `anticlockwise` | `boolean` | `false` | Specifies whether the drawing should be counter-clockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:551](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L551)

___

### arcTo

▸ **arcTo**(`x1`, `y1`, `x2`, `y2`, `radius`): [`Graphics`](pixi_graphics.Graphics.md)

The arcTo() method creates an arc/curve between two tangents on the canvas.

"borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x1` | `number` | The x-coordinate of the first tangent point of the arc |
| `y1` | `number` | The y-coordinate of the first tangent point of the arc |
| `x2` | `number` | The x-coordinate of the end of the arc |
| `y2` | `number` | The y-coordinate of the end of the arc |
| `radius` | `number` | The radius of the arc |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:520](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L520)

___

### beginFill

▸ **beginFill**(`color?`, `alpha?`): [`Graphics`](pixi_graphics.Graphics.md)

Specifies a simple one-color fill that subsequent calls to other Graphics methods
(such as lineTo() or drawCircle()) use when drawing.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `color` | `number` | `0` | the color of the fill |
| `alpha` | `number` | `1` | the alpha of the fill |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:617](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L617)

___

### beginHole

▸ **beginHole**(): [`Graphics`](pixi_graphics.Graphics.md)

Begin adding holes to the last draw shape
IMPORTANT: holes must be fully inside a shape to work
Also weirdness ensues if holes overlap!
Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- Returns itself.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1172](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1172)

___

### beginTextureFill

▸ **beginTextureFill**(`options?`): [`Graphics`](pixi_graphics.Graphics.md)

Begin the texture fill.
Note: The wrap mode of the texture is forced to REPEAT on render.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IFillStyleOptions`](../interfaces/pixi_graphics.IFillStyleOptions.md) | Object object. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:632](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L632)

___

### bezierCurveTo

▸ **bezierCurveTo**(`cpX`, `cpY`, `cpX2`, `cpY2`, `toX`, `toY`): [`Graphics`](pixi_graphics.Graphics.md)

Calculate the points for a bezier curve and then draws it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cpX` | `number` | Control point x |
| `cpY` | `number` | Control point y |
| `cpX2` | `number` | Second Control point x |
| `cpY2` | `number` | Second Control point y |
| `toX` | `number` | Destination point x |
| `toY` | `number` | Destination point y |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:500](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L500)

___

### calculateBounds

▸ **calculateBounds**(): `void`

Recalculates the bounds of the container.

This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
is limited to its mask's bounds or filterArea, if any is applied.

#### Returns

`void`

#### Inherited from

Container.calculateBounds

#### Defined in

[pixijs/packages/display/src/Container.ts:459](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L459)

___

### clear

▸ **clear**(): [`Graphics`](pixi_graphics.Graphics.md)

Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:800](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L800)

___

### clone

▸ **clone**(): [`Graphics`](pixi_graphics.Graphics.md)

Creates a new Graphics object with the same values as this one.
Note that only the geometry of the object is cloned, not its transform (position,scale,etc)

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- A clone of the graphics object

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:199](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L199)

___

### closePath

▸ **closePath**(): [`Graphics`](pixi_graphics.Graphics.md)

Closes the current path.

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- Returns itself.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1136)

___

### containsPoint

▸ **containsPoint**(`point`): `boolean`

Tests if a point is inside this graphics object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | `IPointData` | the point to test |

#### Returns

`boolean`

- the result of the test

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1061](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1061)

___

### destroy

▸ **destroy**(`options?`): `void`

Destroys the Graphics object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `boolean` \| `IDestroyOptions` | Options parameter. A boolean will act as if all options have been set to that value |

#### Returns

`void`

#### Inherited from

Container.destroy

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1203](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1203)

___

### disableTempParent

▸ **disableTempParent**(`cacheParent`): `void`

Pair method for `enableTempParent`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheParent` | `Container`<`DisplayObject`\> | Actual parent of element |

#### Returns

`void`

#### Inherited from

Container.disableTempParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:764](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L764)

___

### drawCircle

▸ **drawCircle**(`x`, `y`, `radius`): [`Graphics`](pixi_graphics.Graphics.md)

Draws a circle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the center of the circle |
| `y` | `number` | The Y coordinate of the center of the circle |
| `radius` | `number` | The radius of the circle |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:714](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L714)

___

### drawEllipse

▸ **drawEllipse**(`x`, `y`, `width`, `height`): [`Graphics`](pixi_graphics.Graphics.md)

Draws an ellipse.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the center of the ellipse |
| `y` | `number` | The Y coordinate of the center of the ellipse |
| `width` | `number` | The half width of the ellipse |
| `height` | `number` | The half height of the ellipse |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:727](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L727)

___

### drawPolygon

▸ **drawPolygon**(`...path`): [`Graphics`](pixi_graphics.Graphics.md)

Draws a polygon using the given path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...path` | `number`[] \| `IPointData`[] | The path data used to construct the polygon. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:732](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L732)

▸ **drawPolygon**(`path`): [`Graphics`](pixi_graphics.Graphics.md)

Draws a polygon using the given path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `number`[] \| `Polygon` \| `IPointData`[] | The path data used to construct the polygon. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:733](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L733)

___

### drawRect

▸ **drawRect**(`x`, `y`, `width`, `height`): [`Graphics`](pixi_graphics.Graphics.md)

Draws a rectangle shape.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coord of the top-left of the rectangle |
| `y` | `number` | The Y coord of the top-left of the rectangle |
| `width` | `number` | The width of the rectangle |
| `height` | `number` | The height of the rectangle |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:688](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L688)

___

### drawRoundedRect

▸ **drawRoundedRect**(`x`, `y`, `width`, `height`, `radius`): [`Graphics`](pixi_graphics.Graphics.md)

Draw a rectangle shape with rounded/beveled corners.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coord of the top-left of the rectangle |
| `y` | `number` | The Y coord of the top-left of the rectangle |
| `width` | `number` | The width of the rectangle |
| `height` | `number` | The height of the rectangle |
| `radius` | `number` | Radius of the rectangle corners |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:702](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L702)

___

### drawShape

▸ **drawShape**(`shape`): [`Graphics`](pixi_graphics.Graphics.md)

Draw any shape.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shape` | `IShape` | Shape to draw |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:777](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L777)

___

### enableTempParent

▸ **enableTempParent**(): `Container`<`DisplayObject`\>

Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root.

```js
const cacheParent = elem.enableTempParent();
elem.updateTransform();
elem.disableTempParent(cacheParent);
```

#### Returns

`Container`<`DisplayObject`\>

- Current parent

#### Inherited from

Container.enableTempParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:751](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L751)

___

### endFill

▸ **endFill**(): [`Graphics`](pixi_graphics.Graphics.md)

Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:671](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L671)

___

### endHole

▸ **endHole**(): [`Graphics`](pixi_graphics.Graphics.md)

End adding holes to the last draw shape.

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- Returns itself.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1184](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1184)

___

### generateCanvasTexture

▸ **generateCanvasTexture**(`scaleMode?`, `resolution?`): `Texture`

#### Parameters

| Name | Type |
| :------ | :------ |
| `scaleMode?` | `SCALE_MODES` |
| `resolution?` | `number` |

#### Returns

`Texture`

#### Inherited from

GlobalMixins.Graphics.generateCanvasTexture

#### Defined in

[pixijs/packages/canvas-graphics/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-graphics/global.d.ts#L6)

___

### getBounds

▸ **getBounds**(`skipUpdate?`, `rect?`): `Rectangle`

Calculates and returns the (world) bounds of the display object as a [Rectangle]PIXI.Rectangle.

This method is expensive on containers with a large subtree (like the stage). This is because the bounds
of a container depend on its children's bounds, which recursively causes all bounds in the subtree to
be recalculated. The upside, however, is that calling `getBounds` once on a container will indeed update
the bounds of all children (the whole subtree, in fact). This side effect should be exploited by using
`displayObject._bounds.getRectangle()` when traversing through all the bounds in a scene graph. Otherwise,
calling `getBounds` on each object in a subtree will cause the total cost to increase quadratically as
its height increases.

The transforms of all objects in a container's **subtree** and of all **ancestors** are updated.
The world bounds of all display objects in a container's **subtree** will also be recalculated.

The `_bounds` object stores the last calculation of the bounds. You can use to entirely skip bounds
calculation if needed.

```js
const lastCalculatedBounds = displayObject._bounds.getRectangle(optionalRect);
```

Do know that usage of `getLocalBounds` can corrupt the `_bounds` of children (the whole subtree, actually). This
is a known issue that has not been solved. See [getLocalBounds]PIXI.DisplayObject#getLocalBounds for more
details.

`getBounds` should be called with `skipUpdate` equal to `true` in a render() call. This is because the transforms
are guaranteed to be update-to-date. In fact, recalculating inside a render() call may cause corruption in certain
cases.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `skipUpdate?` | `boolean` | Setting to `true` will stop the transforms of the scene graph from being updated. This means the calculation returned MAY be out of date BUT will give you a nice performance boost. |
| `rect?` | `Rectangle` | Optional rectangle to store the result of the bounds calculation. |

#### Returns

`Rectangle`

- The minimum axis-aligned rectangle in world space that fits around this object.

#### Inherited from

Container.getBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:493](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L493)

___

### getChildAt

▸ **getChildAt**(`index`): `DisplayObject`

Returns the child at the specified index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child at |

#### Returns

`DisplayObject`

- The child at the given index, if any.

#### Inherited from

Container.getChildAt

#### Defined in

[pixijs/packages/display/src/Container.ts:281](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L281)

___

### getChildByName

▸ **getChildByName**<`T`\>(`name`, `deep?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `DisplayObject`<`T`\> = `DisplayObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `deep?` | `boolean` |

#### Returns

`T`

#### Inherited from

Container.getChildByName

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L10)

___

### getChildIndex

▸ **getChildIndex**(`child`): `number`

Returns the index position of a child DisplayObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | The DisplayObject instance to identify |

#### Returns

`number`

- The index position of the child display object to identify

#### Inherited from

Container.getChildIndex

#### Defined in

[pixijs/packages/display/src/Container.ts:244](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L244)

___

### getGlobalPosition

▸ **getGlobalPosition**(`point?`, `skipUpdate?`): `Point`

#### Parameters

| Name | Type |
| :------ | :------ |
| `point?` | `Point` |
| `skipUpdate?` | `boolean` |

#### Returns

`Point`

#### Inherited from

Container.getGlobalPosition

#### Defined in

[pixijs/packages/mixin-get-global-position/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-global-position/global.d.ts#L5)

___

### getLocalBounds

▸ **getLocalBounds**(`rect?`, `skipChildrenUpdate?`): `Rectangle`

Retrieves the local bounds of the displayObject as a rectangle object.

Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `rect?` | `Rectangle` | `undefined` | Optional rectangle to store the result of the bounds calculation. |
| `skipChildrenUpdate` | `boolean` | `false` | Setting to `true` will stop re-calculation of children transforms, it was default behaviour of pixi 4.0-5.2 and caused many problems to users. |

#### Returns

`Rectangle`

- The rectangular bounding area.

#### Inherited from

Container.getLocalBounds

#### Defined in

[pixijs/packages/display/src/Container.ts:515](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L515)

___

### isFastRect

▸ **isFastRect**(): `boolean`

True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
masked with gl.scissor.

#### Returns

`boolean`

- True if only 1 rect.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:819](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L819)

___

### lineStyle

▸ **lineStyle**(`width?`, `color?`, `alpha?`, `alignment?`, `native?`): [`Graphics`](pixi_graphics.Graphics.md)

Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
method or the drawCircle() method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width?` | `number` | width of the line to draw, will update the objects stored style |
| `color?` | `number` | color of the line to draw, will update the objects stored style |
| `alpha?` | `number` | alpha of the line to draw, will update the objects stored style |
| `alignment?` | `number` | alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer). WebGL only. |
| `native?` | `boolean` | If true the lines will be draw using LINES instead of TRIANGLE_STRIP |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:268](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L268)

▸ **lineStyle**(`options?`): [`Graphics`](pixi_graphics.Graphics.md)

Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
method or the drawCircle() method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ILineStyleOptions`](../interfaces/pixi_graphics.ILineStyleOptions.md) | Line style options |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:285](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L285)

___

### lineTextureStyle

▸ **lineTextureStyle**(`options?`): [`Graphics`](pixi_graphics.Graphics.md)

Like line style but support texture for line fill.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ILineStyleOptions`](../interfaces/pixi_graphics.ILineStyleOptions.md) | Collection of options for setting line style. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:316](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L316)

___

### lineTo

▸ **lineTo**(`x`, `y`): [`Graphics`](pixi_graphics.Graphics.md)

Draws a line using the current line style from the current drawing position to (x, y);
The current drawing position is then set to (x, y).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | the X coordinate to draw to |
| `y` | `number` | the Y coordinate to draw to |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:425](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L425)

___

### moveTo

▸ **moveTo**(`x`, `y`): [`Graphics`](pixi_graphics.Graphics.md)

Moves the current drawing position to x, y.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | the X coordinate to move to |
| `y` | `number` | the Y coordinate to move to |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:409](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L409)

___

### quadraticCurveTo

▸ **quadraticCurveTo**(`cpX`, `cpY`, `toX`, `toY`): [`Graphics`](pixi_graphics.Graphics.md)

Calculate the points for a quadratic bezier curve and then draws it.
Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cpX` | `number` | Control point x |
| `cpY` | `number` | Control point y |
| `toX` | `number` | Destination point x |
| `toY` | `number` | Destination point y |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:474](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L474)

___

### removeChild

▸ **removeChild**<`U`\>(`...children`): `U`[``0``]

Removes one or more children from the container.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to remove |

#### Returns

`U`[``0``]

The first child that was removed.

#### Inherited from

Container.removeChild

#### Defined in

[pixijs/packages/display/src/Container.ts:296](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L296)

___

### removeChildAt

▸ **removeChildAt**(`index`): `DisplayObject`

Removes a child from the specified index position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child from |

#### Returns

`DisplayObject`

The child that was removed.

#### Inherited from

Container.removeChildAt

#### Defined in

[pixijs/packages/display/src/Container.ts:336](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L336)

___

### removeChildren

▸ **removeChildren**(`beginIndex?`, `endIndex?`): `DisplayObject`[]

Removes all children from this container that are within the begin and end indexes.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `beginIndex` | `number` | `0` | The beginning position. |
| `endIndex` | `number` | `undefined` | The ending position. Default value is size of the container. |

#### Returns

`DisplayObject`[]

- List of removed children

#### Inherited from

Container.removeChildren

#### Defined in

[pixijs/packages/display/src/Container.ts:362](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L362)

___

### removeFromParent

▸ **removeFromParent**(): `void`

Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing.

#### Returns

`void`

#### Inherited from

Container.removeFromParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:663](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L663)

___

### render

▸ **render**(`renderer`): `void`

Renders the object using the WebGL renderer.

The [_render]PIXI.Container#_render method is be overriden for rendering the contents of the
container itself. This `render` method will invoke it, and also invoke the `render` methods of all
children afterward.

If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
the bounds of this object are out of frame, this implementation will entirely skip rendering.
See PIXI.DisplayObject for choosing between `renderable` or `visible`. Generally,
setting alpha to zero is not recommended for purely skipping rendering.

When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
advised to employ **culling** to automatically skip rendering objects outside of the current screen.
See [cullable]PIXI.DisplayObject#cullable and [cullArea]PIXI.DisplayObject#cullArea.
Other culling methods might be better suited for a large number static objects; see
[@pixi-essentials/cull][https://www.npmjs.com/package/@pixi-essentials/cull](https://www.npmjs.com/package/@pixi-essentials/cull) and
[pixi-cull][https://www.npmjs.com/package/pixi-cull](https://www.npmjs.com/package/pixi-cull).

The [renderAdvanced]PIXI.Container#renderAdvanced method is internally used when when masking or
filtering is applied on a container. This does, however, break batching and can affect performance when
masking and filtering is applied extensively throughout the scene graph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | The renderer |

#### Returns

`void`

#### Inherited from

Container.render

#### Defined in

[pixijs/packages/display/src/Container.ts:649](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L649)

___

### renderCanvas

▸ `Optional` **renderCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |

#### Returns

`void`

#### Inherited from

Container.renderCanvas

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L5)

___

### setChildIndex

▸ **setChildIndex**(`child`, `index`): `void`

Changes the position of an existing child in the display object container

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | The child DisplayObject instance for which you want to change the index number |
| `index` | `number` | The resulting index number for the child display object |

#### Returns

`void`

#### Inherited from

Container.setChildIndex

#### Defined in

[pixijs/packages/display/src/Container.ts:261](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L261)

___

### setMatrix

▸ **setMatrix**(`matrix`): [`Graphics`](pixi_graphics.Graphics.md)

Apply a matrix to the positional data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | `Matrix` | Matrix to use for transform current shape. |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- Returns itself.

#### Defined in

[pixijs/packages/graphics/src/Graphics.ts:1157](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/Graphics.ts#L1157)

___

### setParent

▸ **setParent**(`container`): `Container`<`DisplayObject`\>

Set the parent Container of this DisplayObject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | `Container`<`DisplayObject`\> | The Container to add this DisplayObject to. |

#### Returns

`Container`<`DisplayObject`\>

- The Container that this DisplayObject was added to.

#### Inherited from

Container.setParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:650](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L650)

___

### setTransform

▸ **setTransform**(`x?`, `y?`, `scaleX?`, `scaleY?`, `rotation?`, `skewX?`, `skewY?`, `pivotX?`, `pivotY?`): [`Graphics`](pixi_graphics.Graphics.md)

Convenience function to set the position, scale, skew and pivot at once.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `0` | The X position |
| `y` | `number` | `0` | The Y position |
| `scaleX` | `number` | `1` | The X scale value |
| `scaleY` | `number` | `1` | The Y scale value |
| `rotation` | `number` | `0` | The rotation |
| `skewX` | `number` | `0` | The X skew value |
| `skewY` | `number` | `0` | The Y skew value |
| `pivotX` | `number` | `0` | The X pivot value |
| `pivotY` | `number` | `0` | The Y pivot value |

#### Returns

[`Graphics`](pixi_graphics.Graphics.md)

- The DisplayObject instance

#### Inherited from

Container.setTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:681](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L681)

___

### sortChildren

▸ **sortChildren**(): `void`

Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex.

#### Returns

`void`

#### Inherited from

Container.sortChildren

#### Defined in

[pixijs/packages/display/src/Container.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L403)

___

### swapChildren

▸ **swapChildren**(`child`, `child2`): `void`

Swaps the position of 2 Display Objects within this container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | First display object to swap |
| `child2` | `DisplayObject` | Second display object to swap |

#### Returns

`void`

#### Inherited from

Container.swapChildren

#### Defined in

[pixijs/packages/display/src/Container.ts:224](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L224)

___

### toGlobal

▸ **toGlobal**<`P`\>(`position`, `point?`, `skipUpdate?`): `P`

Calculates the global position of the display object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `IPointData` = `Point` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `position` | `IPointData` | `undefined` | The world origin to calculate from. |
| `point?` | `P` | `undefined` | A Point object in which to store the value, optional (otherwise will create a new Point). |
| `skipUpdate` | `boolean` | `false` | Should we skip the update transform. |

#### Returns

`P`

- A point object representing the position of this object.

#### Inherited from

Container.toGlobal

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:581](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L581)

___

### toLocal

▸ **toLocal**<`P`\>(`position`, `from?`, `point?`, `skipUpdate?`): `P`

Calculates the local position of the display object relative to another point.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `IPointData` = `Point` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `IPointData` | The world origin to calculate from. |
| `from?` | `DisplayObject` | The DisplayObject to calculate the global position from. |
| `point?` | `P` | A Point object in which to store the value, optional (otherwise will create a new Point). |
| `skipUpdate?` | `boolean` | Should we skip the update transform |

#### Returns

`P`

- A point object representing the position of this object

#### Inherited from

Container.toLocal

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:615](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L615)

___

### updateTransform

▸ **updateTransform**(): `void`

Updates the transform on all children of this container for rendering.

#### Returns

`void`

#### Inherited from

Container.updateTransform

#### Defined in

[pixijs/packages/display/src/Container.ts:428](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L428)

___

### mixin

▸ `Static` **mixin**(`source`): `void`

Mixes all enumerable properties and methods from a source object to DisplayObject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `Dict`<`any`\> | The source of properties and methods to mix in. |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L338)
