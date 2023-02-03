---
id: "pixi_compressed_textures.CompressedTextureResource"
title: "Class: CompressedTextureResource"
sidebar_label: "CompressedTextureResource"
custom_edit_url: null
---

[@pixi/compressed-textures](../modules/pixi_compressed_textures.md).CompressedTextureResource

Resource for compressed texture formats, as follows: S3TC/DXTn (& their sRGB formats), ATC, ASTC, ETC 1/2, PVRTC.

Compressed textures improve performance when rendering is texture-bound. The texture data stays compressed in
graphics memory, increasing memory locality and speeding up texture fetches. These formats can also be used to store
more detail in the same amount of memory.

For most developers, container file formats are a better abstraction instead of directly handling raw texture
data. PixiJS provides native support for the following texture file formats
(via PIXI.loadBasis, PIXI.loadKTX, and PIXI.loadDDS):

**.dds** - the DirectDraw Surface file format stores DXTn (DXT-1,3,5) data. See PIXI.parseDDS
**.ktx** - the Khronos Texture Container file format supports storing all the supported WebGL compression formats.
 See PIXI.parseKTX.
**.basis** - the BASIS supercompressed file format stores texture data in an internal format that is transcoded
 to the compression format supported on the device at _runtime_. It also supports transcoding into a uncompressed
 format as a fallback; you must install the `@pixi/basis-loader`, `@pixi/basis-transcoder` packages separately to
 use these files. See PIXI.BasisParser.

The loaders for the aforementioned formats use `CompressedTextureResource` internally. It is strongly suggested that
they be used instead.

## Working directly with CompressedTextureResource

Since `CompressedTextureResource` inherits `BlobResource`, you can provide it a URL pointing to a file containing
the raw texture data (with no file headers!):

**`Example`**

import { CompressedTextureResource, INTERNAL_FORMATS } from '@pixi/compressed-textures';
import { BaseTexture, Texture, ALPHA_MODES } from 'pixi.js';

// The resource backing the texture data for your textures.
// NOTE: You can also provide a ArrayBufferView instead of a URL. This is used when loading data from a container file
//   format such as KTX, DDS, or BASIS.
const compressedResource = new CompressedTextureResource('bunny.dxt5', {
    format: INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
    width: 256,
    height: 256,
});

// You can create a base-texture to the cache, so that future `Texture`s can be created using the `Texture.from` API.
const baseTexture = new BaseTexture(compressedResource, { pmaMode: ALPHA_MODES.NPM });

// Create a Texture to add to the TextureCache
const texture = new Texture(baseTexture);

// Add baseTexture & texture to the global texture cache
BaseTexture.addToCache(baseTexture, 'bunny.dxt5');
Texture.addToCache(texture, 'bunny.dxt5');

**`Memberof`**

PIXI

## Hierarchy

- [`BlobResource`](pixi_compressed_textures.BlobResource.md)

  ↳ **`CompressedTextureResource`**

## Constructors

### constructor

• **new CompressedTextureResource**(`source`, `options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| `Uint8Array` \| `Uint32Array` | the buffer/URL holding the compressed texture data |
| `options` | `ICompressedTextureResourceOptions` |  |

#### Overrides

[BlobResource](pixi_compressed_textures.BlobResource.md).[constructor](pixi_compressed_textures.BlobResource.md#constructor)

#### Defined in

[pixijs/packages/compressed-textures/src/resources/CompressedTextureResource.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/CompressedTextureResource.ts#L105)

## Properties

### data

• **data**: `Uint8Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array`

Source array Cannot be {@code ClampedUint8Array} because it cant be uploaded to WebGL

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[data](pixi_compressed_textures.BlobResource.md#data)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L19)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[destroyed](pixi_compressed_textures.BlobResource.md#destroyed)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L23)

___

### format

• **format**: [`INTERNAL_FORMATS`](../enums/pixi_compressed_textures.INTERNAL_FORMATS.md)

The compression format

#### Defined in

[pixijs/packages/compressed-textures/src/resources/CompressedTextureResource.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/CompressedTextureResource.ts#L83)

___

### internal

• **internal**: `boolean`

`true` if resource is created by BaseTexture
useful for doing cleanup with BaseTexture destroy
and not cleaning up resources that were created
externally.

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[internal](pixi_compressed_textures.BlobResource.md#internal)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### levels

• **levels**: `number`

The number of mipmap levels stored in the resource buffer.

**`Default`**

1

#### Defined in

[pixijs/packages/compressed-textures/src/resources/CompressedTextureResource.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/CompressedTextureResource.ts#L88)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[src](pixi_compressed_textures.BlobResource.md#src)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Inherited from

BlobResource.height

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Inherited from

BlobResource.valid

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

#### Inherited from

BlobResource.width

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[bind](pixi_compressed_textures.BlobResource.md#bind)

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[destroy](pixi_compressed_textures.BlobResource.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Destroy and don't use after this.

#### Returns

`void`

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[dispose](pixi_compressed_textures.BlobResource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L93)

___

### load

▸ **load**(): `Promise`<`Resource`\>

Loads the blob

#### Returns

`Promise`<`Resource`\>

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[load](pixi_compressed_textures.BlobResource.md#load)

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[resize](pixi_compressed_textures.BlobResource.md#resize)

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[style](pixi_compressed_textures.BlobResource.md#style)

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[unbind](pixi_compressed_textures.BlobResource.md#unbind)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L101)

___

### update

▸ **update**(): `void`

Has been updated trigger event.

#### Returns

`void`

#### Inherited from

[BlobResource](pixi_compressed_textures.BlobResource.md).[update](pixi_compressed_textures.BlobResource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L133)

___

### upload

▸ **upload**(`renderer`, `_texture`, `_glTexture`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | A reference to the current renderer |
| `_texture` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | the texture |
| `_glTexture` | `GLTexture` | texture instance for this webgl context |

#### Returns

`boolean`

#### Overrides

[BlobResource](pixi_compressed_textures.BlobResource.md).[upload](pixi_compressed_textures.BlobResource.md#upload)

#### Defined in

[pixijs/packages/compressed-textures/src/resources/CompressedTextureResource.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/resources/CompressedTextureResource.ts#L137)

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

[BlobResource](pixi_compressed_textures.BlobResource.md).[test](pixi_compressed_textures.BlobResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L103)
