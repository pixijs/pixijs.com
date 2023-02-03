---
id: "pixi_core.Buffer"
title: "Class: Buffer"
sidebar_label: "Buffer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Buffer

A wrapper for data so that it can be used and uploaded by WebGL

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Buffer**(`data?`, `_static?`, `index?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data?` | [`IArrayBuffer`](../interfaces/pixi_core.IArrayBuffer.md) | `undefined` | the data to store in the buffer. |
| `_static` | `boolean` | `true` | `true` for static buffer |
| `index` | `boolean` | `false` | `true` for index buffer |

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L70)

## Properties

### \_updateID

• **\_updateID**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L63)

___

### data

• **data**: [`ITypedArray`](../interfaces/pixi_core.ITypedArray.md)

The data in the buffer, as a typed array

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L43)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L55)

___

### id

• **id**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L54)

___

### static

• **static**: `boolean`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L53)

___

### type

• **type**: [`BUFFER_TYPE`](../enums/pixi_core.BUFFER_TYPE.md)

The type of buffer this is, one of:
+ ELEMENT_ARRAY_BUFFER - used as an index buffer
+ ARRAY_BUFFER - used as an attribute buffer
+ UNIFORM_BUFFER - used as a uniform buffer (if available)

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L51)

## Accessors

### index

• `get` **index**(): `boolean`

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L126)

• `set` **index**(`value`): `void`

Flags whether this is an index buffer.

Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
the buffer of type `ARRAY_BUFFER`.

For backwards compatibility.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L121)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys the buffer.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L106)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L100)

___

### update

▸ **update**(`data?`): `void`

Flags this buffer as requiring an upload to the GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `number`[] \| [`IArrayBuffer`](../interfaces/pixi_core.IArrayBuffer.md) | the data to update in the buffer. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L89)

___

### from

▸ `Static` **from**(`data`): [`Buffer`](pixi_core.Buffer.md)

Helper function that creates a buffer based on an array or TypedArray

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `number`[] \| [`IArrayBuffer`](../interfaces/pixi_core.IArrayBuffer.md) | the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array. |

#### Returns

[`Buffer`](pixi_core.Buffer.md)

- A new Buffer based on the data provided.

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L136)
