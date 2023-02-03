---
id: "pixi_display.Bounds"
title: "Class: Bounds"
sidebar_label: "Bounds"
custom_edit_url: null
---

[@pixi/display](../modules/pixi_display.md).Bounds

'Builder' pattern for bounds rectangles.

This could be called an Axis-Aligned Bounding Box.
It is not an actual shape. It is a mutable thing; no 'EMPTY' or those kind of problems.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Bounds**()

#### Defined in

[pixijs/packages/display/src/Bounds.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L34)

## Properties

### maxX

• **maxX**: `number`

**`Default`**

-Infinity

#### Defined in

[pixijs/packages/display/src/Bounds.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L21)

___

### maxY

• **maxY**: `number`

**`Default`**

-Infinity

#### Defined in

[pixijs/packages/display/src/Bounds.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L24)

___

### minX

• **minX**: `number`

**`Default`**

Infinity

#### Defined in

[pixijs/packages/display/src/Bounds.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L15)

___

### minY

• **minY**: `number`

**`Default`**

Infinity

#### Defined in

[pixijs/packages/display/src/Bounds.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L18)

___

### rect

• **rect**: `Rectangle`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L26)

___

### updateID

• **updateID**: `number`

It is updated to _boundsID of corresponding object to keep bounds in sync with content.
Updated from outside, thus public modifier.

#### Defined in

[pixijs/packages/display/src/Bounds.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L32)

## Methods

### addBounds

▸ **addBounds**(`bounds`): `void`

Adds other [Bounds](pixi_display.Bounds.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bounds` | [`Bounds`](pixi_display.Bounds.md) | The Bounds to be added |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:321](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L321)

___

### addBoundsArea

▸ **addBoundsArea**(`bounds`, `area`): `void`

Adds other Bounds, masked with Rectangle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bounds` | [`Bounds`](pixi_display.Bounds.md) | TODO |
| `area` | `Rectangle` | TODO |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:375](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L375)

___

### addBoundsMask

▸ **addBoundsMask**(`bounds`, `mask`): `void`

Adds other Bounds, masked with Bounds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bounds` | [`Bounds`](pixi_display.Bounds.md) | The Bounds to be added. |
| `mask` | [`Bounds`](pixi_display.Bounds.md) | TODO |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:339](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L339)

___

### addBoundsMatrix

▸ **addBoundsMatrix**(`bounds`, `matrix`): `void`

Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bounds` | [`Bounds`](pixi_display.Bounds.md) | other bounds |
| `matrix` | `Matrix` | multiplicator |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:365](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L365)

___

### addFrame

▸ **addFrame**(`transform`, `x0`, `y0`, `x1`, `y1`): `void`

Adds sprite frame, transformed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | `Transform` | transform to apply |
| `x0` | `number` | left X of frame |
| `y0` | `number` | top Y of frame |
| `x1` | `number` | right X of frame |
| `y1` | `number` | bottom Y of frame |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:170](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L170)

___

### addFrameMatrix

▸ **addFrameMatrix**(`matrix`, `x0`, `y0`, `x1`, `y1`): `void`

Adds sprite frame, multiplied by matrix

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | `Matrix` | matrix to apply |
| `x0` | `number` | left X of frame |
| `y0` | `number` | top Y of frame |
| `x1` | `number` | right X of frame |
| `y1` | `number` | bottom Y of frame |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:183](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L183)

___

### addFramePad

▸ **addFramePad**(`x0`, `y0`, `x1`, `y1`, `padX`, `padY`): `void`

Adds padded frame. (x0, y0) should be strictly less than (x1, y1)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x0` | `number` | left X of frame |
| `y0` | `number` | top Y of frame |
| `x1` | `number` | right X of frame |
| `y1` | `number` | bottom Y of frame |
| `padX` | `number` | padding X |
| `padY` | `number` | padding Y |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:422](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L422)

___

### addPoint

▸ **addPoint**(`point`): `void`

This function should be inlined when its possible.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | `IPointData` | The point to add. |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:90](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L90)

___

### addPointMatrix

▸ **addPointMatrix**(`matrix`, `point`): `void`

Adds a point, after transformed. This should be inlined when its possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `Matrix` |
| `point` | `IPointData` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L103)

___

### addQuad

▸ **addQuad**(`vertices`): `void`

Adds a quad, not transformed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertices` | `Float32Array` | The verts to add. |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L120)

___

### addVertexData

▸ **addVertexData**(`vertexData`, `beginOffset`, `endOffset`): `void`

Adds screen vertices from array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexData` | `Float32Array` | calculated vertices |
| `beginOffset` | `number` | begin offset |
| `endOffset` | `number` | end offset, excluded |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:238](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L238)

___

### addVertices

▸ **addVertices**(`transform`, `vertices`, `beginOffset`, `endOffset`): `void`

Add an array of mesh vertices

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | `Transform` | mesh transform |
| `vertices` | `Float32Array` | mesh coordinates in array |
| `beginOffset` | `number` | begin offset |
| `endOffset` | `number` | end offset, excluded |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:269](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L269)

___

### addVerticesMatrix

▸ **addVerticesMatrix**(`matrix`, `vertices`, `beginOffset`, `endOffset`, `padX?`, `padY?`): `void`

Add an array of mesh vertices.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `matrix` | `Matrix` | `undefined` | mesh matrix |
| `vertices` | `Float32Array` | `undefined` | mesh coordinates in array |
| `beginOffset` | `number` | `undefined` | begin offset |
| `endOffset` | `number` | `undefined` | end offset, excluded |
| `padX` | `number` | `0` | x padding |
| `padY` | `number` | `padX` | y padding |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L283)

___

### clear

▸ **clear**(): `void`

Clears the bounds and resets.

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L55)

___

### getRectangle

▸ **getRectangle**(`rect?`): `Rectangle`

Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
It is not guaranteed that it will return tempRect

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rect?` | `Rectangle` | Temporary object will be used if AABB is not empty |

#### Returns

`Rectangle`

- A rectangle of the bounds

#### Defined in

[pixijs/packages/display/src/Bounds.ts:69](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L69)

___

### isEmpty

▸ **isEmpty**(): `boolean`

Checks if bounds are empty.

#### Returns

`boolean`

- True if empty.

#### Defined in

[pixijs/packages/display/src/Bounds.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L49)

___

### pad

▸ **pad**(`paddingX?`, `paddingY?`): `void`

Pads bounds object, making it grow in all directions.
If paddingY is omitted, both paddingX and paddingY will be set to paddingX.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `paddingX` | `number` | `0` | The horizontal padding amount. |
| `paddingY` | `number` | `paddingX` | The vertical padding amount. |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Bounds.ts:402](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Bounds.ts#L402)
