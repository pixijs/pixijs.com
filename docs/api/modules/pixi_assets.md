---
id: "pixi_assets"
title: "Module: @pixi/assets"
sidebar_label: "@pixi/assets"
sidebar_position: 0
custom_edit_url: null
---

## Enumerations

- [LoaderParserPriority](../enums/pixi_assets.LoaderParserPriority.md)

## Classes

- [AssetsClass](../classes/pixi_assets.AssetsClass.md)
- [Loader](../classes/pixi_assets.Loader.md)
- [Resolver](../classes/pixi_assets.Resolver.md)

## Interfaces

- [AssetExtension](../interfaces/pixi_assets.AssetExtension.md)
- [AssetInitOptions](../interfaces/pixi_assets.AssetInitOptions.md)
- [CacheParser](../interfaces/pixi_assets.CacheParser.md)
- [FormatDetectionParser](../interfaces/pixi_assets.FormatDetectionParser.md)
- [LoadAsset](../interfaces/pixi_assets.LoadAsset.md)
- [LoaderParser](../interfaces/pixi_assets.LoaderParser.md)
- [PreferOrder](../interfaces/pixi_assets.PreferOrder.md)
- [PromiseAndParser](../interfaces/pixi_assets.PromiseAndParser.md)
- [ResolveAsset](../interfaces/pixi_assets.ResolveAsset.md)
- [ResolveURLParser](../interfaces/pixi_assets.ResolveURLParser.md)
- [ResolverBundle](../interfaces/pixi_assets.ResolverBundle.md)

## Type Aliases

### LoadFontData

Ƭ **LoadFontData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display` | `string` |
| `family` | `string` |
| `featureSettings` | `string` |
| `stretch` | `string` |
| `style` | `string` |
| `unicodeRange` | `string` |
| `variant` | `string` |
| `weights` | `string`[] |

#### Defined in

[pixijs/packages/assets/src/loader/parsers/loadWebFont.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/loadWebFont.ts#L21)

___

### ProgressCallback

Ƭ **ProgressCallback**: (`progress`: `number`) => `void`

#### Type declaration

▸ (`progress`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progress` | `number` |

##### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L15)

___

### ResolverAssetsArray

Ƭ **ResolverAssetsArray**: { `name`: `string` \| `string`[] ; `srcs`: `string` \| [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)[]  }[]

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L27)

___

### ResolverAssetsObject

Ƭ **ResolverAssetsObject**: `Record`<`string`, `string` \| [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md)\>

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L32)

___

### ResolverManifest

Ƭ **ResolverManifest**: `Object`

The expected format of a manifest. This would normally be auto generated ar made by the developer

**`Memberof`**

PIXI

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundles` | [`ResolverBundle`](../interfaces/pixi_assets.ResolverBundle.md)[] |

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L48)

## Variables

### Assets

• `Const` **Assets**: [`AssetsClass`](../classes/pixi_assets.AssetsClass.md)

#### Defined in

[pixijs/packages/assets/src/Assets.ts:837](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L837)

___

### Cache

• `Const` **Cache**: `CacheClass`

#### Defined in

[pixijs/packages/assets/src/cache/Cache.ts:181](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/Cache.ts#L181)

___

### cacheTextureArray

• `Const` **cacheTextureArray**: [`CacheParser`](../interfaces/pixi_assets.CacheParser.md)<`Texture`[]\>

#### Defined in

[pixijs/packages/assets/src/cache/parsers/cacheTextureArray.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/parsers/cacheTextureArray.ts#L5)

___

### detectAvif

• `Const` **detectAvif**: [`FormatDetectionParser`](../interfaces/pixi_assets.FormatDetectionParser.md)

#### Defined in

[pixijs/packages/assets/src/detections/parsers/detectAvif.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/parsers/detectAvif.ts#L5)

___

### detectDefaults

• `Const` **detectDefaults**: [`FormatDetectionParser`](../interfaces/pixi_assets.FormatDetectionParser.md)

#### Defined in

[pixijs/packages/assets/src/detections/parsers/detectDefaults.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/parsers/detectDefaults.ts#L7)

___

### detectWebp

• `Const` **detectWebp**: [`FormatDetectionParser`](../interfaces/pixi_assets.FormatDetectionParser.md)

#### Defined in

[pixijs/packages/assets/src/detections/parsers/detectWebp.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/parsers/detectWebp.ts#L5)

___

### loadJson

• `Const` **loadJson**: [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`any`, `any`\>

simple loader plugin for loading json data

#### Defined in

[pixijs/packages/assets/src/loader/parsers/loadJson.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/loadJson.ts#L7)

___

### loadSVG

• `Const` **loadSVG**: [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`string` \| `Texture`<`Resource`\>, `IBaseTextureOptions`<`any`\>\>

Loads SVG's into Textures

#### Defined in

[pixijs/packages/assets/src/loader/parsers/textures/loadSVG.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/textures/loadSVG.ts#L12)

___

### loadTextures

• `Const` **loadTextures**: [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`Texture`<`Resource`\>, `IBaseTextureOptions`<`any`\>\>

Loads our textures!
this makes use of imageBitmaps where available.
We load the ImageBitmap on a different thread using the WorkerManager
We can then use the ImageBitmap as a source for a Pixi Texture

#### Defined in

[pixijs/packages/assets/src/loader/parsers/textures/loadTextures.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/textures/loadTextures.ts#L49)

___

### loadTxt

• `Const` **loadTxt**: [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`any`, `any`\>

Simple loader plugin for loading text data

#### Defined in

[pixijs/packages/assets/src/loader/parsers/loadTxt.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/loadTxt.ts#L7)

___

### loadWebFont

• `Const` **loadWebFont**: [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`FontFace` \| `FontFace`[], `any`\>

Web font loader plugin

#### Defined in

[pixijs/packages/assets/src/loader/parsers/loadWebFont.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/loadWebFont.ts#L55)

___

### resolveTextureUrl

• `Const` **resolveTextureUrl**: [`ResolveURLParser`](../interfaces/pixi_assets.ResolveURLParser.md)

#### Defined in

[pixijs/packages/assets/src/resolver/parsers/resolveTextureUrl.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/parsers/resolveTextureUrl.ts#L6)

## Functions

### checkDataUrl

▸ **checkDataUrl**(`url`, `mimes`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `mimes` | `string` \| `string`[] |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/utils/checkDataUrl.ts:1](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/utils/checkDataUrl.ts#L1)

___

### checkExtension

▸ **checkExtension**(`url`, `extension`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `extension` | `string` \| `string`[] |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/utils/checkExtension.ts:3](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/utils/checkExtension.ts#L3)

___

### convertToList

▸ **convertToList**<`T`\>(`input`, `transform?`): `T`[]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| `T` \| (`string` \| `T`)[] |
| `transform?` | (`input`: `string`) => `T` |

#### Returns

`T`[]

#### Defined in

[pixijs/packages/assets/src/utils/convertToList.ts:1](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/utils/convertToList.ts#L1)

___

### createStringVariations

▸ **createStringVariations**(`string`): `string`[]

Creates a list of all possible combinations of the given strings.

**`Example`**

```ts
const out2 = createStringVariations('name is {chicken,wolf,sheep}');
console.log(out2); // [ 'name is chicken', 'name is wolf', 'name is sheep' ]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `string` | `string` | The string to process |

#### Returns

`string`[]

#### Defined in

[pixijs/packages/assets/src/utils/createStringVariations.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/utils/createStringVariations.ts#L27)

___

### createTexture

▸ **createTexture**(`base`, `loader`, `url`): `Texture`<`Resource`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `BaseTexture`<`Resource`, `IAutoDetectOptions`\> |
| `loader` | [`Loader`](../classes/pixi_assets.Loader.md) |
| `url` | `string` |

#### Returns

`Texture`<`Resource`\>

#### Defined in

[pixijs/packages/assets/src/loader/parsers/textures/utils/createTexture.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/textures/utils/createTexture.ts#L6)

___

### getFontFamilyName

▸ **getFontFamilyName**(`url`): `string`

Return font face name from a file name
Ex.: 'fonts/tital-one.woff' turns into 'Titan One'

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | File url |

#### Returns

`string`

#### Defined in

[pixijs/packages/assets/src/loader/parsers/loadWebFont.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/loadWebFont.ts#L37)

___

### isSingleItem

▸ **isSingleItem**(`item`): `boolean`

Checks if the given value is an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `unknown` | The item to test |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/utils/isSingleItem.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/utils/isSingleItem.ts#L5)

___

### loadImageBitmap

▸ **loadImageBitmap**(`url`): `Promise`<`ImageBitmap`\>

Returns a promise that resolves an ImageBitmaps.
This function is designed to be used by a worker.
Part of WorkerManager!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The image to load an image bitmap for |

#### Returns

`Promise`<`ImageBitmap`\>

#### Defined in

[pixijs/packages/assets/src/loader/parsers/textures/loadTextures.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/textures/loadTextures.ts#L27)
