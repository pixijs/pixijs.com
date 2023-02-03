---
id: "pixi_core.QuadUv"
title: "Class: QuadUv"
sidebar_label: "QuadUv"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).QuadUv

Helper class to create a quad with uvs like in v4

**`Memberof`**

PIXI

## Hierarchy

- [`Geometry`](pixi_core.Geometry.md)

  ↳ **`QuadUv`**

## Constructors

### constructor

• **new QuadUv**()

#### Overrides

[Geometry](pixi_core.Geometry.md).[constructor](pixi_core.Geometry.md#constructor)

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L21)

## Properties

### attributes

• **attributes**: `Object`

#### Index signature

▪ [key: `string`]: [`Attribute`](pixi_core.Attribute.md)

#### Inherited from

[Geometry](pixi_core.Geometry.md).[attributes](pixi_core.Geometry.md#attributes)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L47)

___

### buffers

• **buffers**: [`Buffer`](pixi_core.Buffer.md)[]

#### Inherited from

[Geometry](pixi_core.Geometry.md).[buffers](pixi_core.Geometry.md#buffers)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L45)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Inherited from

[Geometry](pixi_core.Geometry.md).[disposeRunner](pixi_core.Geometry.md#disposerunner)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L64)

___

### glVertexArrayObjects

• **glVertexArrayObjects**: `Object`

A map of renderer IDs to webgl VAOs

#### Index signature

▪ [key: `number`]: { `[key: string]`: `WebGLVertexArrayObject`;  }

#### Inherited from

[Geometry](pixi_core.Geometry.md).[glVertexArrayObjects](pixi_core.Geometry.md#glvertexarrayobjects)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L63)

___

### id

• **id**: `number`

#### Inherited from

[Geometry](pixi_core.Geometry.md).[id](pixi_core.Geometry.md#id)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L48)

___

### indexBuffer

• **indexBuffer**: [`Buffer`](pixi_core.Buffer.md)

#### Inherited from

[Geometry](pixi_core.Geometry.md).[indexBuffer](pixi_core.Geometry.md#indexbuffer)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L46)

___

### instanceCount

• **instanceCount**: `number`

Number of instances in this geometry, pass it to `GeometrySystem.draw()`.

**`Default`**

1

#### Inherited from

[Geometry](pixi_core.Geometry.md).[instanceCount](pixi_core.Geometry.md#instancecount)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L57)

___

### instanced

• **instanced**: `boolean`

Whether the geometry is instanced.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[instanced](pixi_core.Geometry.md#instanced)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L51)

___

### refCount

• **refCount**: `number`

Count of existing (not destroyed) meshes that reference this geometry.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[refCount](pixi_core.Geometry.md#refcount)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L67)

___

### uvBuffer

• **uvBuffer**: [`Buffer`](pixi_core.Buffer.md)

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L13)

___

### uvs

• **uvs**: `Float32Array`

The Uvs of the quad.

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L19)

___

### vertexBuffer

• **vertexBuffer**: [`Buffer`](pixi_core.Buffer.md)

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L12)

___

### vertices

• **vertices**: `Float32Array`

An array of vertices.

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L16)

## Methods

### addAttribute

▸ **addAttribute**(`id`, `buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`): [`QuadUv`](pixi_core.QuadUv.md)

Adds an attribute to the geometry
Note: `stride` and `start` should be `undefined` if you dont know them, not 0!

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `string` | `undefined` | the name of the attribute (matching up to a shader) |
| `buffer` | `number`[] \| `Uint32Array` \| `Float32Array` \| [`Buffer`](pixi_core.Buffer.md) | `undefined` | the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it. |
| `size` | `number` | `0` | the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2 |
| `normalized` | `boolean` | `false` | should the data be normalized. |
| `type?` | [`TYPES`](../enums/pixi_core.TYPES.md) | `undefined` | what type of number is the attribute. Check {PIXI.TYPES} to see the ones available |
| `stride?` | `number` | `undefined` | How far apart, in bytes, the start of each value is. (used for interleaving data) |
| `start?` | `number` | `undefined` | How far into the array to start reading values (used for interleaving data) |
| `instance` | `boolean` | `false` | Instancing flag |

#### Returns

[`QuadUv`](pixi_core.QuadUv.md)

- Returns self, useful for chaining.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[addAttribute](pixi_core.Geometry.md#addattribute)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L106)

___

### addIndex

▸ **addIndex**(`buffer?`): [`Geometry`](pixi_core.Geometry.md)

Adds an index buffer to the geometry
The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer?` | `number`[] \| [`IArrayBuffer`](../interfaces/pixi_core.IArrayBuffer.md) \| [`Buffer`](pixi_core.Buffer.md) | The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it. |

#### Returns

[`Geometry`](pixi_core.Geometry.md)

- Returns self, useful for chaining.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[addIndex](pixi_core.Geometry.md#addindex)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:181](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L181)

___

### clone

▸ **clone**(): [`Geometry`](pixi_core.Geometry.md)

Returns a clone of the geometry.

#### Returns

[`Geometry`](pixi_core.Geometry.md)

- A new clone of this geometry.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[clone](pixi_core.Geometry.md#clone)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L298)

___

### destroy

▸ **destroy**(): `void`

Destroys the geometry.

#### Returns

`void`

#### Inherited from

[Geometry](pixi_core.Geometry.md).[destroy](pixi_core.Geometry.md#destroy)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:285](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L285)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Inherited from

[Geometry](pixi_core.Geometry.md).[dispose](pixi_core.Geometry.md#dispose)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L279)

___

### getAttribute

▸ **getAttribute**(`id`): [`Attribute`](pixi_core.Attribute.md)

Returns the requested attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The name of the attribute required |

#### Returns

[`Attribute`](pixi_core.Attribute.md)

- The attribute requested.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[getAttribute](pixi_core.Geometry.md#getattribute)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:159](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L159)

___

### getBuffer

▸ **getBuffer**(`id`): [`Buffer`](pixi_core.Buffer.md)

Returns the requested buffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The name of the buffer required. |

#### Returns

[`Buffer`](pixi_core.Buffer.md)

- The buffer requested.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[getBuffer](pixi_core.Geometry.md#getbuffer)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:169](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L169)

___

### getIndex

▸ **getIndex**(): [`Buffer`](pixi_core.Buffer.md)

Returns the index buffer

#### Returns

[`Buffer`](pixi_core.Buffer.md)

- The index buffer.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[getIndex](pixi_core.Geometry.md#getindex)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L210)

___

### getSize

▸ **getSize**(): `number`

Get the size of the geometries, in vertices.

#### Returns

`number`

#### Inherited from

[Geometry](pixi_core.Geometry.md).[getSize](pixi_core.Geometry.md#getsize)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:265](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L265)

___

### interleave

▸ **interleave**(): [`Geometry`](pixi_core.Geometry.md)

This function modifies the structure so that all current attributes become interleaved into a single buffer
This can be useful if your model remains static as it offers a little performance boost

#### Returns

[`Geometry`](pixi_core.Geometry.md)

- Returns self, useful for chaining.

#### Inherited from

[Geometry](pixi_core.Geometry.md).[interleave](pixi_core.Geometry.md#interleave)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L220)

___

### invalidate

▸ **invalidate**(): [`QuadUv`](pixi_core.QuadUv.md)

Legacy upload method, just marks buffers dirty.

#### Returns

[`QuadUv`](pixi_core.QuadUv.md)

- Returns itself.

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L94)

___

### map

▸ **map**(`targetTextureFrame`, `destinationFrame`): [`QuadUv`](pixi_core.QuadUv.md)

Maps two Rectangle to the quad.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `targetTextureFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The first rectangle |
| `destinationFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The second rectangle |

#### Returns

[`QuadUv`](pixi_core.QuadUv.md)

- Returns itself.

#### Defined in

[pixijs/packages/core/src/utils/QuadUv.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/utils/QuadUv.ts#L53)

___

### merge

▸ `Static` **merge**(`geometries`): [`Geometry`](pixi_core.Geometry.md)

Merges an array of geometries into a new single one.

Geometry attribute styles must match for this operation to work.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `geometries` | [`Geometry`](pixi_core.Geometry.md)[] | array of geometries to merge |

#### Returns

[`Geometry`](pixi_core.Geometry.md)

- Shiny new geometry!

#### Inherited from

[Geometry](pixi_core.Geometry.md).[merge](pixi_core.Geometry.md#merge)

#### Defined in

[pixijs/packages/core/src/geometry/Geometry.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Geometry.ts#L338)
