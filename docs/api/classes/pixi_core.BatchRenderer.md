---
id: "pixi_core.BatchRenderer"
title: "Class: BatchRenderer"
sidebar_label: "BatchRenderer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BatchRenderer

Renderer dedicated to drawing and batching sprites.

This is the default batch renderer. It buffers objects
with texture-based geometries and renders them in
batches. It uploads multiple textures to the GPU to
reduce to the number of draw calls.

**`Memberof`**

PIXI

## Hierarchy

- [`ObjectRenderer`](pixi_core.ObjectRenderer.md)

  ↳ **`BatchRenderer`**

## Constructors

### constructor

• **new BatchRenderer**(`renderer`)

This will hook onto the renderer's `contextChange`
and `prerender` signals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this works for. |

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[constructor](pixi_core.ObjectRenderer.md#constructor)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:254](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L254)

## Properties

### maxTextures

• `Readonly` **maxTextures**: `number`

Maximum number of textures that can be uploaded to
the GPU under the current context. It is initialized
properly in `this.contextChange`.

**`See`**

PIXI.BatchRenderer#contextChange

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L119)

___

### size

• **size**: `number`

The number of bufferable objects before a flush
occurs automatically.

**`Default`**

PIXI.BatchRenderer.defaultBatchSize * 4

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L110)

___

### state

• `Readonly` **state**: [`State`](pixi_core.State.md)

The WebGL state in which this renderer will work.

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L103)

___

### \_drawCallPool

▪ `Static` **\_drawCallPool**: [`BatchDrawCall`](pixi_core.BatchDrawCall.md)[] = `[]`

Pool of `BatchDrawCall` objects that `flush` used
to create "batches" of the objects being rendered.

These are never re-allocated again.
Shared between all batch renderers because it can be only one "flush" working at the moment.

**`Member`**

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:809](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L809)

___

### \_textureArrayPool

▪ `Static` **\_textureArrayPool**: [`BatchTextureArray`](pixi_core.BatchTextureArray.md)[] = `[]`

Pool of `BatchDrawCall` objects that `flush` used
to create "batches" of the objects being rendered.

These are never re-allocated again.
Shared between all batch renderers because it can be only one "flush" working at the moment.

**`Member`**

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:819](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L819)

___

### defaultBatchSize

▪ `Static` **defaultBatchSize**: `number` = `4096`

The default sprite batch size.

The default aims to balance desktop and mobile devices.

**`Static`**

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L76)

## Accessors

### MAX\_TEXTURES

• `get` **MAX_TEXTURES**(): `number`

**`See`**

PIXI.BatchRenderer#maxTextures

**`Deprecated`**

since 7.1.0

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:293](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L293)

___

### canUploadSameBuffer

• `Static` `get` **canUploadSameBuffer**(): `boolean`

Can we upload the same buffer in a single frame?

**`Static`**

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L82)

• `Static` `set` **canUploadSameBuffer**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L88)

___

### defaultFragmentTemplate

• `Static` `get` **defaultFragmentTemplate**(): `string`

The default fragment shader source

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:315](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L315)

___

### defaultMaxTextures

• `Static` `get` **defaultMaxTextures**(): `number`

The maximum textures that this device supports.

**`Static`**

**`Default`**

32

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L56)

• `Static` `set` **defaultMaxTextures**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L62)

___

### defaultVertexSrc

• `Static` `get` **defaultVertexSrc**(): `string`

The default vertex shader source

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:306](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L306)

## Methods

### bindAndClearTexArray

▸ **bindAndClearTexArray**(`texArray`): `void`

Bind textures for current rendering

#### Parameters

| Name | Type |
| :------ | :------ |
| `texArray` | [`BatchTextureArray`](pixi_core.BatchTextureArray.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:551](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L551)

___

### buildDrawCalls

▸ **buildDrawCalls**(`texArray`, `start`, `finish`): `void`

Populating drawcalls for rendering

#### Parameters

| Name | Type |
| :------ | :------ |
| `texArray` | [`BatchTextureArray`](pixi_core.BatchTextureArray.md) |
| `start` | `number` |
| `finish` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:492](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L492)

___

### buildTexturesAndDrawCalls

▸ **buildTexturesAndDrawCalls**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:427](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L427)

___

### contextChange

▸ **contextChange**(): `void`

Handles the `contextChange` signal.

It calculates `this.maxTextures` and allocating the packed-geometry object pool.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:339](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L339)

___

### destroy

▸ **destroy**(): `void`

Destroys this `BatchRenderer`. It cannot be used again.

#### Returns

`void`

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[destroy](pixi_core.ObjectRenderer.md#destroy)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:669](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L669)

___

### drawBatches

▸ **drawBatches**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:597](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L597)

___

### flush

▸ **flush**(): `void`

Renders the content _now_ and empties the current batch.

#### Returns

`void`

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[flush](pixi_core.ObjectRenderer.md#flush)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:623](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L623)

___

### getAttributeBuffer

▸ **getAttributeBuffer**(`size`): [`ViewableBuffer`](pixi_core.ViewableBuffer.md)

Fetches an attribute buffer from `this._aBuffers` that can hold atleast `size` floats.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | minimum capacity required |

#### Returns

[`ViewableBuffer`](pixi_core.ViewableBuffer.md)

- buffer than can hold atleast `size` floats

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:701](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L701)

___

### getIndexBuffer

▸ **getIndexBuffer**(`size`): `Uint16Array`

Fetches an index buffer from `this._iBuffers` that can
have at least `size` capacity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | minimum required capacity |

#### Returns

`Uint16Array`

- buffer that can fit `size` indices.

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:729](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L729)

___

### initFlushBuffers

▸ **initFlushBuffers**(): `void`

Makes sure that static and dynamic flush pooled objects have correct dimensions.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L373)

___

### onPrerender

▸ **onPrerender**(): `void`

Handles the `prerender` signal. It ensures that flushes start from the first geometry object again.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:399](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L399)

___

### packInterleavedGeometry

▸ **packInterleavedGeometry**(`element`, `attributeBuffer`, `indexBuffer`, `aIndex`, `iIndex`): `void`

Takes the four batching parameters of `element`, interleaves
and pushes them into the batching attribute/index buffers given.

It uses these properties: `vertexData` `uvs`, `textureId` and
`indicies`. It also uses the "tint" of the base-texture, if
present.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | [`IBatchableElement`](../interfaces/pixi_core.IBatchableElement.md) | element being rendered |
| `attributeBuffer` | [`ViewableBuffer`](pixi_core.ViewableBuffer.md) | attribute buffer. |
| `indexBuffer` | `Uint16Array` | index buffer |
| `aIndex` | `number` | number of floats already in the attribute buffer |
| `iIndex` | `number` | number of indices already in `indexBuffer` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:764](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L764)

___

### render

▸ **render**(`element`): `void`

Buffers the "batchable" object. It need not be rendered immediately.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | [`IBatchableElement`](../interfaces/pixi_core.IBatchableElement.md) | the element to render when using this renderer |

#### Returns

`void`

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[render](pixi_core.ObjectRenderer.md#render)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:409](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L409)

___

### setShaderGenerator

▸ **setShaderGenerator**(`options?`): `void`

Set the shader generator.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` |  |
| `options.fragment?` | `string` | Fragment shader template |
| `options.vertex?` | `string` | Vertex shader source |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:326](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L326)

___

### start

▸ **start**(): `void`

Starts a new sprite batch.

#### Returns

`void`

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[start](pixi_core.ObjectRenderer.md#start)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:647](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L647)

___

### stop

▸ **stop**(): `void`

Stops and flushes the current batch.

#### Returns

`void`

#### Overrides

[ObjectRenderer](pixi_core.ObjectRenderer.md).[stop](pixi_core.ObjectRenderer.md#stop)

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:663](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L663)

___

### updateGeometry

▸ **updateGeometry**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchRenderer.ts:563](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchRenderer.ts#L563)
