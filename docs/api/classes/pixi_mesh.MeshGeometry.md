---
id: "pixi_mesh.MeshGeometry"
title: "Class: MeshGeometry"
sidebar_label: "MeshGeometry"
custom_edit_url: null
---

[@pixi/mesh](../modules/pixi_mesh.md).MeshGeometry

Standard 2D geometry used in PixiJS.

Geometry can be defined without passing in a style or data if required.

**`Example`**

```ts
import { Geometry } from 'pixi.js';

const geometry = new Geometry();

geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
geometry.addAttribute('uvs', [0, 0, 1, 0, 1, 1, 0, 1], 2);
geometry.addIndex([0, 1, 2, 1, 3, 2]);
```

**`Memberof`**

PIXI

## Hierarchy

- `Geometry`

  ↳ **`MeshGeometry`**

## Constructors

### constructor

• **new MeshGeometry**(`vertices?`, `uvs?`, `index?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertices?` | `IArrayBuffer` | Positional data on geometry. |
| `uvs?` | `IArrayBuffer` | Texture UVs. |
| `index?` | `IArrayBuffer` | IndexBuffer |

#### Overrides

Geometry.constructor

#### Defined in

[pixijs/packages/mesh/src/MeshGeometry.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshGeometry.ts#L36)

## Properties

### attributes

• **attributes**: `Object`

#### Index signature

▪ [key: `string`]: `Attribute`

#### Inherited from

Geometry.attributes

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L47)

___

### buffers

• **buffers**: `Buffer`[]

#### Inherited from

Geometry.buffers

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L45)

___

### disposeRunner

• **disposeRunner**: `Runner`

#### Inherited from

Geometry.disposeRunner

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L64)

___

### glVertexArrayObjects

• **glVertexArrayObjects**: `Object`

A map of renderer IDs to webgl VAOs

#### Index signature

▪ [key: `number`]: { `[key: string]`: `WebGLVertexArrayObject`;  }

#### Inherited from

Geometry.glVertexArrayObjects

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L63)

___

### id

• **id**: `number`

#### Inherited from

Geometry.id

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L48)

___

### indexBuffer

• **indexBuffer**: `Buffer`

#### Inherited from

Geometry.indexBuffer

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L46)

___

### instanceCount

• **instanceCount**: `number`

Number of instances in this geometry, pass it to `GeometrySystem.draw()`.

**`Default`**

1

#### Inherited from

Geometry.instanceCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L57)

___

### instanced

• **instanced**: `boolean`

Whether the geometry is instanced.

#### Inherited from

Geometry.instanced

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L51)

___

### refCount

• **refCount**: `number`

Count of existing (not destroyed) meshes that reference this geometry.

#### Inherited from

Geometry.refCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L67)

## Methods

### addAttribute

▸ **addAttribute**(`id`, `buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`): [`MeshGeometry`](pixi_mesh.MeshGeometry.md)

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

[`MeshGeometry`](pixi_mesh.MeshGeometry.md)

- Returns self, useful for chaining.

#### Inherited from

Geometry.addAttribute

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

Geometry.addIndex

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

Geometry.clone

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L298)

___

### destroy

▸ **destroy**(): `void`

Destroys the geometry.

#### Returns

`void`

#### Inherited from

Geometry.destroy

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:285](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L285)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Inherited from

Geometry.dispose

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

Geometry.getAttribute

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

Geometry.getBuffer

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

Geometry.getIndex

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L210)

___

### getSize

▸ **getSize**(): `number`

Get the size of the geometries, in vertices.

#### Returns

`number`

#### Inherited from

Geometry.getSize

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

Geometry.interleave

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L220)

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

Geometry.merge

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L338)
