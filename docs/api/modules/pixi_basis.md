---
id: "pixi_basis"
title: "Module: @pixi/basis"
sidebar_label: "@pixi/basis"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [BasisParser](../classes/pixi_basis.BasisParser.md)
- [TranscoderWorker](../classes/pixi_basis.TranscoderWorker.md)

## Type Aliases

### TranscodedResourcesArray

Ƭ **TranscodedResourcesArray**: `CompressedTextureResource`[] \| `BufferResource`[] & { `basisFormat`: `BASIS_FORMATS`  }

#### Defined in

[pixijs/packages/basis/src/loader/BasisParser.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/BasisParser.ts#L14)

## Variables

### detectBasis

• `Const` **detectBasis**: `FormatDetectionParser`

#### Defined in

[pixijs/packages/basis/src/loader/detectBasis.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/detectBasis.ts#L6)

___

### loadBasis

• `Const` **loadBasis**: `LoaderParser`<`Texture`<`Resource`\> \| `Texture`<`Resource`\>[], `IBaseTextureOptions`<`any`\>\>

Load BASIS textures!

#### Defined in

[pixijs/packages/basis/src/loader/loadBasis.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/basis/src/loader/loadBasis.ts#L12)
