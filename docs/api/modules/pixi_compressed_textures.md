---
id: "pixi_compressed_textures"
title: "Module: @pixi/compressed-textures"
sidebar_label: "@pixi/compressed-textures"
sidebar_position: 0
custom_edit_url: null
---

## Enumerations

- [INTERNAL\_FORMATS](../enums/pixi_compressed_textures.INTERNAL_FORMATS.md)

## Classes

- [BlobResource](../classes/pixi_compressed_textures.BlobResource.md)
- [CompressedTextureResource](../classes/pixi_compressed_textures.CompressedTextureResource.md)

## Type Aliases

### CompressedTextureExtensionRef

Ƭ **CompressedTextureExtensionRef**: keyof [`CompressedTextureExtensions`](pixi_compressed_textures.md#compressedtextureextensions)

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/compressedTextureExtensions.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/compressedTextureExtensions.ts#L13)

___

### CompressedTextureExtensions

Ƭ **CompressedTextureExtensions**: `Object`

Compressed texture extensions

#### Type declaration

| Name | Type |
| :------ | :------ |
| `astc` | `WEBGL_compressed_texture_astc` |
| `atc` | `any` |
| `etc` | `any` |
| `etc1` | `any` |
| `pvrtc` | `any` |
| `s3tc?` | `WEBGL_compressed_texture_s3tc` |
| `s3tc_sRGB` | `WEBGL_compressed_texture_s3tc_srgb` |

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/compressedTextureExtensions.ts:4](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/compressedTextureExtensions.ts#L4)

## Variables

### detectCompressedTextures

• `Const` **detectCompressedTextures**: `FormatDetectionParser`

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/detectCompressedTextures.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/detectCompressedTextures.ts#L23)

___

### loadDDS

• `Const` **loadDDS**: `LoaderParser`

Load our DDS textures!

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/loadDDS.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/loadDDS.ts#L9)

___

### loadKTX

• `Const` **loadKTX**: `LoaderParser`<`Texture`<`Resource`\> \| `Texture`<`Resource`\>[], `IBaseTextureOptions`<`any`\>\>

Loads KTX textures!

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/loadKTX.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/loadKTX.ts#L9)

___

### resolveCompressedTextureUrl

• `Const` **resolveCompressedTextureUrl**: `ResolveURLParser`

#### Defined in

[pixijs/packages/compressed-textures/src/loaders/resolveCompressedTextureUrl.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/loaders/resolveCompressedTextureUrl.ts#L5)

## Functions

### parseDDS

▸ **parseDDS**(`arrayBuffer`): [`CompressedTextureResource`](../classes/pixi_compressed_textures.CompressedTextureResource.md)[]

Parses the DDS file header, generates base-textures, and puts them into the texture cache.

**`See`**

https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide

**`Memberof`**

PIXI

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrayBuffer` | `ArrayBuffer` |

#### Returns

[`CompressedTextureResource`](../classes/pixi_compressed_textures.CompressedTextureResource.md)[]

#### Defined in

[pixijs/packages/compressed-textures/src/parsers/parseDDS.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/parsers/parseDDS.ts#L248)

___

### parseKTX

▸ **parseKTX**(`url`, `arrayBuffer`, `loadKeyValueData?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `arrayBuffer` | `ArrayBuffer` | `undefined` |
| `loadKeyValueData` | `boolean` | `false` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `compressed?` | [`CompressedTextureResource`](../classes/pixi_compressed_textures.CompressedTextureResource.md)[] |
| `kvData` | `Map`<`string`, `DataView`\> \| ``null`` |
| `uncompressed?` | { `format`: `FORMATS` ; `resource`: `BufferResource` ; `type`: `TYPES`  }[] |

#### Defined in

[pixijs/packages/compressed-textures/src/parsers/parseKTX.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/src/parsers/parseKTX.ts#L85)
