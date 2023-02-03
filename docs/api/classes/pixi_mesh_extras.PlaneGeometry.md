---
id: "pixi_mesh_extras.PlaneGeometry"
title: "Class: PlaneGeometry"
sidebar_label: "PlaneGeometry"
custom_edit_url: null
---

[@pixi/mesh-extras](../modules/pixi_mesh_extras.md).PlaneGeometry

**`Memberof`**

PIXI

## Hierarchy

- `MeshGeometry`

  ↳ **`PlaneGeometry`**

## Constructors

### constructor

• **new PlaneGeometry**(`width?`, `height?`, `segWidth?`, `segHeight?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `width` | `number` | `100` | The width of the plane. |
| `height` | `number` | `100` | The height of the plane. |
| `segWidth` | `number` | `10` | Number of horizontal segments. |
| `segHeight` | `number` | `10` | Number of vertical segments. |

#### Overrides

MeshGeometry.constructor

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/PlaneGeometry.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/PlaneGeometry.ts#L19)

## Properties

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

### height

• **height**: `number`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/PlaneGeometry.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/PlaneGeometry.ts#L11)

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

### refCount

• **refCount**: `number`

Count of existing (not destroyed) meshes that reference this geometry.

#### Inherited from

MeshGeometry.refCount

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L67)

___

### segHeight

• **segHeight**: `number`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/PlaneGeometry.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/PlaneGeometry.ts#L9)

___

### segWidth

• **segWidth**: `number`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/PlaneGeometry.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/PlaneGeometry.ts#L8)

___

### width

• **width**: `number`

#### Defined in

[pixijs/packages/mesh-extras/src/geometry/PlaneGeometry.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/geometry/PlaneGeometry.ts#L10)

## Methods

### addAttribute

▸ **addAttribute**(`id`, `buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`): [`PlaneGeometry`](pixi_mesh_extras.PlaneGeometry.md)

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

[`PlaneGeometry`](pixi_mesh_extras.PlaneGeometry.md)

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
