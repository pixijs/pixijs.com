---
id: "pixi_mesh_extras.RopeGeometry"
title: "Class: RopeGeometry"
sidebar_label: "RopeGeometry"
custom_edit_url: null
---

[@pixi/mesh-extras](../modules/pixi_mesh_extras.md).RopeGeometry

RopeGeometry allows you to draw a geometry across several points and then manipulate these points.

**`Example`**

```ts
import { Point, RopeGeometry } from 'pixi.js';

for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 50, 0));
};
const rope = new RopeGeometry(100, points);
```

**`Memberof`**

PIXI

## Hierarchy

- `MeshGeometry`

  ↳ **`RopeGeometry`**

## Constructors

### constructor

• **new RopeGeometry**(`width?`, `points`, `textureScale?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `width` | `number` | `200` | The width (i.e., thickness) of the rope. |
| `points` | `IPoint`[] | `undefined` | An array of PIXI.Point objects to construct this rope. |
| `textureScale` | `number` | `0` | By default the rope texture will be stretched to match rope length. If textureScale is positive this value will be treated as a scaling factor and the texture will preserve its aspect ratio instead. To create a tiling rope set baseTexture.wrapMode to PIXI.WRAP_MODES.REPEAT and use a power of two texture, then set textureScale=1 to keep the original texture pixel size. In order to reduce alpha channel artifacts provide a larger texture and downsample - i.e. set textureScale=0.5 to scale it down twice. |

#### Overrides

MeshGeometry.constructor

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L41)

## Properties

### \_width

• `Readonly` **\_width**: `number`

The width (i.e., thickness) of the rope.

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L28)

___

### attributes

• **attributes**: `Object`

#### Index signature

▪ [key: `string`]: `Attribute`

#### Inherited from

MeshGeometry.attributes

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L47)

___

### buffers

• **buffers**: `Buffer`[]

#### Inherited from

MeshGeometry.buffers

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L45)

___

### disposeRunner

• **disposeRunner**: `Runner`

#### Inherited from

MeshGeometry.disposeRunner

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L64)

___

### glVertexArrayObjects

• **glVertexArrayObjects**: `Object`

A map of renderer IDs to webgl VAOs

#### Index signature

▪ [key: `number`]: { `[key: string]`: `WebGLVertexArrayObject`;  }

#### Inherited from

MeshGeometry.glVertexArrayObjects

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L63)

___

### id

• **id**: `number`

#### Inherited from

MeshGeometry.id

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L48)

___

### indexBuffer

• **indexBuffer**: `Buffer`

#### Inherited from

MeshGeometry.indexBuffer

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L46)

___

### instanceCount

• **instanceCount**: `number`

Number of instances in this geometry, pass it to `GeometrySystem.draw()`.

**`Default`**

1

#### Inherited from

MeshGeometry.instanceCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L57)

___

### instanced

• **instanced**: `boolean`

Whether the geometry is instanced.

#### Inherited from

MeshGeometry.instanced

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L51)

___

### points

• **points**: `IPoint`[]

An array of points that determine the rope.

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L19)

___

### refCount

• **refCount**: `number`

Count of existing (not destroyed) meshes that reference this geometry.

#### Inherited from

MeshGeometry.refCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L67)

___

### textureScale

• `Readonly` **textureScale**: `number`

Rope texture scale, if zero then the rope texture is stretched.

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L22)

## Accessors

### width

• `get` **width**(): `number`

The width (i.e., thickness) of the rope.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L58)

## Methods

### addAttribute

▸ **addAttribute**(`id`, `buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`): [`RopeGeometry`](pixi_mesh_extras.RopeGeometry.md)

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

[`RopeGeometry`](pixi_mesh_extras.RopeGeometry.md)

- Returns self, useful for chaining.

#### Inherited from

MeshGeometry.addAttribute

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

MeshGeometry.addIndex

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:181](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L181)

___

### clone

▸ **clone**(): `Geometry`

Returns a clone of the geometry.

#### Returns

`Geometry`

- A new clone of this geometry.

#### Inherited from

MeshGeometry.clone

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L298)

___

### destroy

▸ **destroy**(): `void`

Destroys the geometry.

#### Returns

`void`

#### Inherited from

MeshGeometry.destroy

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:285](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L285)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Inherited from

MeshGeometry.dispose

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L279)

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

MeshGeometry.getAttribute

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

MeshGeometry.getBuffer

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

MeshGeometry.getIndex

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L210)

___

### getSize

▸ **getSize**(): `number`

Get the size of the geometries, in vertices.

#### Returns

`number`

#### Inherited from

MeshGeometry.getSize

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

MeshGeometry.interleave

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L220)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:213](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L213)

___

### updateVertices

▸ **updateVertices**(): `void`

refreshes vertices of Rope mesh

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/RopeGeometry.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/RopeGeometry.ts#L152)

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

MeshGeometry.merge

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L338)
