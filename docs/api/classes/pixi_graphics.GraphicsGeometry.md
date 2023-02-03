---
id: "pixi_graphics.GraphicsGeometry"
title: "Class: GraphicsGeometry"
sidebar_label: "GraphicsGeometry"
custom_edit_url: null
---

[@pixi/graphics](../modules/pixi_graphics.md).GraphicsGeometry

The Graphics class contains methods used to draw primitive shapes such as lines, circles and
rectangles to the display, and to color and fill them.

GraphicsGeometry is designed to not be continually updating the geometry since it's expensive
to re-tesselate using **earcut**. Consider using PIXI.Mesh for this use-case, it's much faster.

**`Memberof`**

PIXI

## Hierarchy

- `BatchGeometry`

  ↳ **`GraphicsGeometry`**

## Constructors

### constructor

• **new GraphicsGeometry**()

#### Overrides

BatchGeometry.constructor

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L113)

## Properties

### attributes

• **attributes**: `Object`

#### Index signature

▪ [key: `string`]: `Attribute`

#### Inherited from

BatchGeometry.attributes

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L47)

___

### batchDirty

• **batchDirty**: `number` = `-1`

Batches need to regenerated if the geometry is updated.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L85)

___

### batchable

• **batchable**: `boolean` = `false`

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L55)

___

### batches

• **batches**: `BatchPart`[] = `[]`

Intermediate abstract format sent to batch system.
Can be converted to drawCalls or to batchable objects.

**`Member`**

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L92)

___

### boundsPadding

• **boundsPadding**: `number` = `0`

Padding to add to the bounds.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L51)

___

### buffers

• **buffers**: `Buffer`[]

#### Inherited from

BatchGeometry.buffers

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L45)

___

### closePointEps

• **closePointEps**: `number` = `1e-4`

Minimal distance between points that are considered different. Affects line tesselation.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L48)

___

### colors

• **colors**: `number`[] = `[]`

The collection of colors

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L61)

___

### disposeRunner

• **disposeRunner**: `Runner`

#### Inherited from

BatchGeometry.disposeRunner

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L64)

___

### drawCalls

• **drawCalls**: `BatchDrawCall`[] = `[]`

List of current draw calls drived from the batches.

**`Member`**

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L82)

___

### glVertexArrayObjects

• **glVertexArrayObjects**: `Object`

A map of renderer IDs to webgl VAOs

#### Index signature

▪ [key: `number`]: { `[key: string]`: `WebGLVertexArrayObject`;  }

#### Inherited from

BatchGeometry.glVertexArrayObjects

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L63)

___

### graphicsData

• **graphicsData**: [`GraphicsData`](pixi_graphics.GraphicsData.md)[] = `[]`

The collection of drawn shapes.

**`Member`**

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L76)

___

### id

• **id**: `number`

#### Inherited from

BatchGeometry.id

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L48)

___

### indexBuffer

• **indexBuffer**: `Buffer`

#### Inherited from

BatchGeometry.indexBuffer

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L46)

___

### indices

• **indices**: `number`[] = `[]`

The indices of the vertices

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L67)

___

### indicesUint16

• **indicesUint16**: `Uint16Array` \| `Uint32Array` = `null`

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L54)

___

### instanceCount

• **instanceCount**: `number`

Number of instances in this geometry, pass it to `GeometrySystem.draw()`.

**`Default`**

1

#### Inherited from

BatchGeometry.instanceCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L57)

___

### instanced

• **instanced**: `boolean`

Whether the geometry is instanced.

#### Inherited from

BatchGeometry.instanced

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L51)

___

### points

• **points**: `number`[] = `[]`

An array of points to draw, 2 numbers per point

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L58)

___

### refCount

• **refCount**: `number`

Count of existing (not destroyed) meshes that reference this geometry.

#### Inherited from

BatchGeometry.refCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L67)

___

### textureIds

• **textureIds**: `number`[] = `[]`

Reference to the texture IDs.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L70)

___

### uvs

• **uvs**: `number`[] = `[]`

The UVs collection

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L64)

___

### uvsFloat32

• **uvsFloat32**: `Float32Array` = `null`

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L53)

___

### BATCHABLE\_SIZE

▪ `Static` **BATCHABLE\_SIZE**: `number` = `100`

The maximum number of points to consider an object "batchable", able to be batched by the renderer's batch system.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L45)

## Accessors

### bounds

• `get` **bounds**(): `Bounds`

Get the current bounds of the graphic geometry.

Since 6.5.0, bounds of the graphics geometry are calculated based on the vertices of generated geometry.
Since shapes or strokes with full transparency (`alpha: 0`) will not generate geometry, they are not considered
when calculating bounds for the graphics geometry. See PR [#8343][https://github.com/pixijs/pixijs/pull/8343](https://github.com/pixijs/pixijs/pull/8343)
and issue [#8623][https://github.com/pixijs/pixijs/pull/8623](https://github.com/pixijs/pixijs/pull/8623).

#### Returns

`Bounds`

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L127)

## Methods

### addAttribute

▸ **addAttribute**(`id`, `buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`): [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

Adds an attribute to the geometry
Note: `stride` and `start` should be `undefined` if you dont know them, not 0!

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `string` | `undefined` | the name of the attribute (matching up to a shader) |
| `buffer` | `number`[] \| `Uint32Array` \| `Float32Array` \| `Buffer` | `undefined` | the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it. |
| `size` | `number` | `0` | the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2 |
| `normalized` | `boolean` | `false` | should the data be normalized. |
| `type?` | `TYPES` | `undefined` | what type of number is the attribute. Check {PIXI.TYPES} to see the ones available |
| `stride?` | `number` | `undefined` | How far apart, in bytes, the start of each value is. (used for interleaving data) |
| `start?` | `number` | `undefined` | How far into the array to start reading values (used for interleaving data) |
| `instance` | `boolean` | `false` | Instancing flag |

#### Returns

[`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

- Returns self, useful for chaining.

#### Inherited from

BatchGeometry.addAttribute

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L106)

___

### addIndex

▸ **addIndex**(`buffer?`): `Geometry`

Adds an index buffer to the geometry
The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer?` | `number`[] \| `IArrayBuffer` \| `Buffer` | The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it. |

#### Returns

`Geometry`

- Returns self, useful for chaining.

#### Inherited from

BatchGeometry.addIndex

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:181](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L181)

___

### clear

▸ **clear**(): [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.

#### Returns

[`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

- This GraphicsGeometry object. Good for chaining method calls

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:177](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L177)

___

### clone

▸ **clone**(): `Geometry`

Returns a clone of the geometry.

#### Returns

`Geometry`

- A new clone of this geometry.

#### Inherited from

BatchGeometry.clone

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L298)

___

### containsPoint

▸ **containsPoint**(`point`): `boolean`

Check to see if a point is contained within this geometry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | `IPointData` | Point to check if it's contained. |

#### Returns

`boolean`

`true` if the point is contained within geometry.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:272](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L272)

___

### destroy

▸ **destroy**(): `void`

Destroys the GraphicsGeometry object.

#### Returns

`void`

#### Overrides

BatchGeometry.destroy

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:238](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L238)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Inherited from

BatchGeometry.dispose

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L279)

___

### drawHole

▸ **drawHole**(`shape`, `matrix?`): [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `shape` | `IShape` | `undefined` | The shape object to draw. |
| `matrix` | `Matrix` | `null` | Transform applied to the points of the shape. |

#### Returns

[`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

- Returns geometry for chaining.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:217](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L217)

___

### drawShape

▸ **drawShape**(`shape`, `fillStyle?`, `lineStyle?`, `matrix?`): [`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `shape` | `IShape` | `undefined` | The shape object to draw. |
| `fillStyle` | [`FillStyle`](pixi_graphics.FillStyle.md) | `null` | Defines style of the fill. |
| `lineStyle` | [`LineStyle`](pixi_graphics.LineStyle.md) | `null` | Defines style of the lines. |
| `matrix` | `Matrix` | `null` | Transform applied to the points of the shape. |

#### Returns

[`GraphicsGeometry`](pixi_graphics.GraphicsGeometry.md)

- Returns geometry for chaining.

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:197](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L197)

___

### getAttribute

▸ **getAttribute**(`id`): `Attribute`

Returns the requested attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The name of the attribute required |

#### Returns

`Attribute`

- The attribute requested.

#### Inherited from

BatchGeometry.getAttribute

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:159](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L159)

___

### getBuffer

▸ **getBuffer**(`id`): `Buffer`

Returns the requested buffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The name of the buffer required. |

#### Returns

`Buffer`

- The buffer requested.

#### Inherited from

BatchGeometry.getBuffer

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:169](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L169)

___

### getIndex

▸ **getIndex**(): `Buffer`

Returns the index buffer

#### Returns

`Buffer`

- The index buffer.

#### Inherited from

BatchGeometry.getIndex

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L210)

___

### getSize

▸ **getSize**(): `number`

Get the size of the geometries, in vertices.

#### Returns

`number`

#### Inherited from

BatchGeometry.getSize

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:265](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L265)

___

### interleave

▸ **interleave**(): `Geometry`

This function modifies the structure so that all current attributes become interleaved into a single buffer
This can be useful if your model remains static as it offers a little performance boost

#### Returns

`Geometry`

- Returns self, useful for chaining.

#### Inherited from

BatchGeometry.interleave

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L220)

___

### updateBatches

▸ **updateBatches**(): `void`

Generates intermediate batch data. Either gets converted to drawCalls
or used to convert to batch objects directly by the Graphics object.

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/GraphicsGeometry.ts:330](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsGeometry.ts#L330)

___

### merge

▸ `Static` **merge**(`geometries`): `Geometry`

Merges an array of geometries into a new single one.

Geometry attribute styles must match for this operation to work.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `geometries` | `Geometry`[] | array of geometries to merge |

#### Returns

`Geometry`

- Shiny new geometry!

#### Inherited from

BatchGeometry.merge

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L338)
