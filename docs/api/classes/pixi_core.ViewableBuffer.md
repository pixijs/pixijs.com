---
id: "pixi_core.ViewableBuffer"
title: "Class: ViewableBuffer"
sidebar_label: "ViewableBuffer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ViewableBuffer

Flexible wrapper around `ArrayBuffer` that also provides typed array views on demand.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new ViewableBuffer**(`length`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` | The size of the buffer in bytes. |

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L29)

• **new ViewableBuffer**(`arrayBuffer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arrayBuffer` | `ArrayBuffer` | The source array buffer. |

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L34)

## Properties

### float32View

• **float32View**: `Float32Array`

View on the raw binary data as a `Float32Array`.

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L18)

___

### rawBinaryData

• **rawBinaryData**: `ArrayBuffer`

Underlying `ArrayBuffer` that holds all the data and is of capacity `this.size`.

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L12)

___

### size

• **size**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L9)

___

### uint32View

• **uint32View**: `Uint32Array`

View on the raw binary data as a `Uint32Array`.

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L15)

## Accessors

### int16View

• `get` **int16View**(): `Int16Array`

View on the raw binary data as a `Int16Array`.

#### Returns

`Int16Array`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L78)

___

### int32View

• `get` **int32View**(): `Int32Array`

View on the raw binary data as a `Int32Array`.

#### Returns

`Int32Array`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L100)

___

### int8View

• `get` **int8View**(): `Int8Array`

View on the raw binary data as a `Int8Array`.

#### Returns

`Int8Array`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L56)

___

### uint16View

• `get` **uint16View**(): `Uint16Array`

View on the raw binary data as a `Uint16Array`.

#### Returns

`Uint16Array`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L89)

___

### uint8View

• `get` **uint8View**(): `Uint8Array`

View on the raw binary data as a `Uint8Array`.

#### Returns

`Uint8Array`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L67)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys all buffer references. Do not use after calling this.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:122](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L122)

___

### view

▸ **view**(`type`): [`ITypedArray`](../interfaces/pixi_core.ITypedArray.md)

Returns the view of the given type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | One of `int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, and `float32`. |

#### Returns

[`ITypedArray`](../interfaces/pixi_core.ITypedArray.md)

- typed array of given type

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:116](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L116)

___

### sizeOf

▸ `Static` **sizeOf**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/geometry/ViewableBuffer.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/ViewableBuffer.ts#L134)
