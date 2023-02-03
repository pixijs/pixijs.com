---
id: "pixi_graphics_extras.IGraphicsExtras"
title: "Interface: IGraphicsExtras"
sidebar_label: "IGraphicsExtras"
custom_edit_url: null
---

[@pixi/graphics-extras](../modules/pixi_graphics_extras.md).IGraphicsExtras

## Properties

### drawChamferRect

• **drawChamferRect**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `width`: `number`, `height`: `number`, `chamfer`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `width`, `height`, `chamfer`): `Graphics`

Draw Rectangle with chamfer corners. These are angled corners.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawChamferRect

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `Graphics` |  |
| `x` | `number` | Upper left corner of rect |
| `y` | `number` | Upper right corner of rect |
| `width` | `number` | Width of rect |
| `height` | `number` | Height of rect |
| `chamfer` | `number` | non-zero real number, size of corner cutout |

##### Returns

`Graphics`

Returns self.

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L13)

___

### drawFilletRect

• **drawFilletRect**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `width`: `number`, `height`: `number`, `fillet`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `width`, `height`, `fillet`): `Graphics`

Draw Rectangle with fillet corners. This is much like rounded rectangle
however it support negative numbers as well for the corner radius.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawFilletRect

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `Graphics` |  |
| `x` | `number` | Upper left corner of rect |
| `y` | `number` | Upper right corner of rect |
| `width` | `number` | Width of rect |
| `height` | `number` | Height of rect |
| `fillet` | `number` | accept negative or positive values |

##### Returns

`Graphics`

Returns self.

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L14)

___

### drawRegularPolygon

• **drawRegularPolygon**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `radius`: `number`, `sides`: `number`, `rotation`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `radius`, `sides`, `rotation?`): `Graphics`

Draw a regular polygon where all sides are the same length.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawRegularPolygon

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | `Graphics` | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `radius` | `number` | `undefined` | Polygon radius |
| `sides` | `number` | `undefined` | Minimum value is 3 |
| `rotation` | `number` | `0` | Starting rotation values in radians.. |

##### Returns

`Graphics`

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L15)

___

### drawRoundedPolygon

• **drawRoundedPolygon**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `radius`: `number`, `sides`: `number`, `corner`: `number`, `rotation`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `radius`, `sides`, `corner`, `rotation?`): `Graphics`

Draw a regular polygon with rounded corners.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawRoundedPolygon

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | `Graphics` | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `radius` | `number` | `undefined` | Polygon radius |
| `sides` | `number` | `undefined` | Minimum value is 3 |
| `corner` | `number` | `undefined` | Corner size in pixels. |
| `rotation` | `number` | `0` | Starting rotation values in radians.. |

##### Returns

`Graphics`

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L16)

___

### drawStar

• **drawStar**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `points`: `number`, `radius`: `number`, `innerRadius`: `number`, `rotation`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `points`, `radius`, `innerRadius`, `rotation?`): `Graphics`

Draw a star shape with an arbitrary number of points.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawStar

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | `Graphics` | `undefined` |  |
| `x` | `number` | `undefined` | Center X position of the star |
| `y` | `number` | `undefined` | Center Y position of the star |
| `points` | `number` | `undefined` | The number of points of the star, must be > 1 |
| `radius` | `number` | `undefined` | The outer radius of the star |
| `innerRadius` | `number` | `undefined` | The inner radius between points, default half `radius` |
| `rotation` | `number` | `0` | The rotation of the star in radians, where 0 is vertical |

##### Returns

`Graphics`

- This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L17)

___

### drawTorus

• **drawTorus**: (`this`: `Graphics`, `x`: `number`, `y`: `number`, `innerRadius`: `number`, `outerRadius`: `number`, `startArc?`: `number`, `endArc?`: `number`) => `Graphics`

#### Type declaration

▸ (`this`, `x`, `y`, `innerRadius`, `outerRadius`, `startArc?`, `endArc?`): `Graphics`

Draw a torus shape, like a donut. Can be used for something like a circle loader.

_Note: Only available with **@pixi/graphics-extras**._

**`Method`**

PIXI.Graphics#drawTorus

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `this` | `Graphics` | `undefined` |  |
| `x` | `number` | `undefined` | X position |
| `y` | `number` | `undefined` | Y position |
| `innerRadius` | `number` | `undefined` | Inner circle radius |
| `outerRadius` | `number` | `undefined` | Outer circle radius |
| `startArc?` | `number` | `0` | Where to begin sweep, in radians, 0.0 = to the right |
| `endArc?` | `number` | `undefined` | Where to end sweep, in radians |

##### Returns

`Graphics`

This Graphics object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics-extras/src/index.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics-extras/src/index.ts#L12)
