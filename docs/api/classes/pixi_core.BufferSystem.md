---
id: "pixi_core.BufferSystem"
title: "Class: BufferSystem"
sidebar_label: "BufferSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BufferSystem

System plugin to the renderer to manage buffers.

WebGL uses Buffers as a way to store objects to the GPU.
This system makes working with them a lot easier.

Buffers are used in three main places in WebGL
- geometry information
- Uniform information (via uniform buffer objects - a WebGL 2 only feature)
- Transform feedback information. (WebGL 2 only feature)

This system will handle the binding of buffers to the GPU as well as uploading
them. With this system, you never need to work directly with GPU buffers, but instead work with
the PIXI.Buffer class.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new BufferSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L50)

## Properties

### CONTEXT\_UID

• **CONTEXT\_UID**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L36)

___

### boundBufferBases

• `Readonly` **boundBufferBases**: `Object`

Cache keeping track of the base bound buffer bases

#### Index signature

▪ [key: `number`]: [`Buffer`](pixi_core.Buffer.md)

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L43)

___

### gl

• **gl**: [`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md)

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L37)

___

### managedBuffers

• `Readonly` **managedBuffers**: `Object`

Cache for all buffers by id, used in case renderer gets destroyed or for profiling

#### Index signature

▪ [key: `number`]: [`Buffer`](pixi_core.Buffer.md)

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L40)

## Methods

### bind

▸ **bind**(`buffer`): `void`

This binds specified buffer. On first run, it will create the webGL buffers for the context too

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | the buffer to bind to the renderer |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L80)

___

### bindBufferBase

▸ **bindBufferBase**(`buffer`, `index`): `void`

Binds an uniform buffer to at the given index.

A cache is used so a buffer will not be bound again if already bound.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | the buffer to bind |
| `index` | `number` | the base index to bind it to. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L103)

___

### bindBufferRange

▸ **bindBufferRange**(`buffer`, `index?`, `offset?`): `void`

Binds a buffer whilst also binding its range.
This will make the buffer start from the offset supplied rather than 0 when it is read.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | the buffer to bind |
| `index?` | `number` | the base index to bind at, defaults to 0 |
| `offset?` | `number` | the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L124)

___

### dispose

▸ **dispose**(`buffer`, `contextLost?`): `void`

Disposes buffer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | buffer with data |
| `contextLost?` | `boolean` | If context was lost, we suppress deleteVertexArray |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:173](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L173)

___

### disposeAll

▸ **disposeAll**(`contextLost?`): `void`

dispose all WebGL resources of all managed buffers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contextLost?` | `boolean` | If context was lost, we suppress `gl.delete` calls |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:204](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L204)

___

### unbind

▸ **unbind**(`type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`BUFFER_TYPE`](../enums/pixi_core.BUFFER_TYPE.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L89)

___

### update

▸ **update**(`buffer`): `void`

Will ensure the data in the buffer is uploaded to the GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | the buffer to update |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/BufferSystem.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/BufferSystem.ts#L139)
