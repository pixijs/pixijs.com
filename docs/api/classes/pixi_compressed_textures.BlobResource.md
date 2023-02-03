---
id: "pixi_compressed_textures.BlobResource"
title: "Class: BlobResource"
sidebar_label: "BlobResource"
custom_edit_url: null
---

[@pixi/compressed-textures](../modules/pixi_compressed_textures.md).BlobResource

Resource that fetches texture data over the network and stores it in a buffer.

**`Memberof`**

PIXI

## Hierarchy

- `BufferResource`

  ↳ **`BlobResource`**

  ↳↳ [`CompressedTextureResource`](pixi_compressed_textures.CompressedTextureResource.md)

## Constructors

### constructor

• **new BlobResource**(`source`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| `Uint8Array` \| `Uint32Array` \| `Float32Array` | the URL of the texture file |
| `options` | `IBlobOptions` |  |

#### Overrides

BufferResource.constructor

#### Defined in

[pixijs/packages/compressed-textures/src/resources/BlobResource.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/BlobResource.ts#L32)

## Properties

### data

• **data**: `Uint8Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array`

Source array Cannot be {@code ClampedUint8Array} because it cant be uploaded to WebGL

#### Inherited from

BufferResource.data

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L19)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Inherited from

BufferResource.destroyed

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L23)

___

### internal

• **internal**: `boolean`

`true` if resource is created by BaseTexture
useful for doing cleanup with BaseTexture destroy
and not cleaning up resources that were created
externally.

#### Inherited from

BufferResource.internal

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

BufferResource.src

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Inherited from

BufferResource.height

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Inherited from

BufferResource.valid

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

#### Inherited from

BufferResource.width

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L156)

## Methods

### bind

▸ **bind**(`baseTexture`): `void`

Bind to a parent BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | Parent texture |

#### Returns

`void`

#### Inherited from

BufferResource.bind

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L83)

___

### destroy

▸ **destroy**(): `void`

Call when destroying resource, unbind any BaseTexture object
before calling this method, as reference counts are maintained
internally.

#### Returns

`void`

#### Inherited from

BufferResource.destroy

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Destroy and don't use after this.

#### Returns

`void`

#### Inherited from

BufferResource.dispose

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L93)

___

### load

▸ **load**(): `Promise`<`Resource`\>

Loads the blob

#### Returns

`Promise`<`Resource`\>

#### Overrides

BufferResource.load

#### Defined in

[pixijs/packages/compressed-textures/src/resources/BlobResource.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/BlobResource.ts#L82)

___

### resize

▸ **resize**(`width`, `height`): `void`

Trigger a resize event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | X dimension |
| `height` | `number` | Y dimension |

#### Returns

`void`

#### Inherited from

BufferResource.resize

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L113)

___

### style

▸ **style**(`_renderer`, `_baseTexture`, `_glTexture`): `boolean`

Set the style, optional to override

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_renderer` | `Renderer` | yeah, renderer! |
| `_baseTexture` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | the texture |
| `_glTexture` | `GLTexture` | texture instance for this webgl context |

#### Returns

`boolean`

- `true` is success

#### Inherited from

BufferResource.style

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:186](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L186)

___

### unbind

▸ **unbind**(`baseTexture`): `void`

Unbind to a parent BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | Parent texture |

#### Returns

`void`

#### Inherited from

BufferResource.unbind

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L101)

___

### update

▸ **update**(): `void`

Has been updated trigger event.

#### Returns

`void`

#### Inherited from

BufferResource.update

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L133)

___

### upload

▸ **upload**(`renderer`, `baseTexture`, `glTexture`): `boolean`

Upload the texture to the GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | Upload to the renderer |
| `baseTexture` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | Reference to parent texture |
| `glTexture` | `GLTexture` | glTexture |

#### Returns

`boolean`

- true is success

#### Inherited from

BufferResource.upload

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L48)

___

### test

▸ `Static` **test**(`source`): source is Uint8Array \| Uint32Array \| Float32Array

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is Uint8Array \| Uint32Array \| Float32Array

true if `<canvas>`

#### Inherited from

BufferResource.test

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L103)
