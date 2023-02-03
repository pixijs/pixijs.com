---
id: "pixi_assets.LoaderParser"
title: "Interface: LoaderParser<ASSET, META_DATA>"
sidebar_label: "LoaderParser"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).LoaderParser

All functions are optional here. The flow:

for every asset,

1. `parser.test()`: Test the asset url.
2. `parser.load()`: If test passes call the load function with the url
3. `parser.testParse()`: Test to see if the asset should be parsed by the plugin
4. `parse.parse()`: If test is parsed, then run the parse function on the asset.

some plugins may only be used for parsing,
some only for loading
and some for both!

## Type parameters

| Name | Type |
| :------ | :------ |
| `ASSET` | `any` |
| `META_DATA` | `any` |

## Properties

### config

• `Optional` **config**: `Record`<`string`, `any`\>

A config to adjust the parser

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L40)

___

### extension

• `Optional` **extension**: `ExtensionMetadata`

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L37)

___

### load

• `Optional` **load**: <T\>(`url`: `string`, `loadAsset?`: [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\>, `loader?`: [`Loader`](../classes/pixi_assets.Loader.md)) => `Promise`<`T`\>

#### Type declaration

▸ <`T`\>(`url`, `loadAsset?`, `loader?`): `Promise`<`T`\>

This is the promise that loads the URL provided
resolves with a loaded asset if returned by the parser.

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to load |
| `loadAsset?` | [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\> | Any custom additional information relevant to the asset being loaded |
| `loader?` | [`Loader`](../classes/pixi_assets.Loader.md) | The loader instance |

##### Returns

`Promise`<`T`\>

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L58)

___

### parse

• `Optional` **parse**: <T\>(`asset`: `ASSET`, `loadAsset?`: [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\>, `loader?`: [`Loader`](../classes/pixi_assets.Loader.md)) => `Promise`<`T`\>

#### Type declaration

▸ <`T`\>(`asset`, `loadAsset?`, `loader?`): `Promise`<`T`\>

Gets called on the asset it testParse passes. Useful to convert a raw asset into something more useful than

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `ASSET` | The loaded asset data |
| `loadAsset?` | [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\> | Any custom additional information relevant to the asset being loaded |
| `loader?` | [`Loader`](../classes/pixi_assets.Loader.md) | The loader instance |

##### Returns

`Promise`<`T`\>

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L75)

___

### test

• `Optional` **test**: (`url`: `string`, `loadAsset?`: [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\>, `loader?`: [`Loader`](../classes/pixi_assets.Loader.md)) => `boolean`

#### Type declaration

▸ (`url`, `loadAsset?`, `loader?`): `boolean`

each URL to load will be tested here,
if the test is passed the assets are loaded using the load function below.
Good place to test for things like file extensions!

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to test |
| `loadAsset?` | [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\> | Any custom additional information relevant to the asset being loaded |
| `loader?` | [`Loader`](../classes/pixi_assets.Loader.md) | The loader instance |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L49)

___

### testParse

• `Optional` **testParse**: (`asset`: `ASSET`, `loadAsset?`: [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\>, `loader?`: [`Loader`](../classes/pixi_assets.Loader.md)) => `Promise`<`boolean`\>

#### Type declaration

▸ (`asset`, `loadAsset?`, `loader?`): `Promise`<`boolean`\>

This function is used to test if the parse function should be run on the asset
If this returns true then parse is called with the asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `ASSET` | The loaded asset data |
| `loadAsset?` | [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\> | Any custom additional information relevant to the asset being loaded |
| `loader?` | [`Loader`](../classes/pixi_assets.Loader.md) | The loader instance |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L67)

___

### unload

• `Optional` **unload**: (`asset`: `ASSET`, `loadAsset?`: [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\>, `loader?`: [`Loader`](../classes/pixi_assets.Loader.md)) => `void`

#### Type declaration

▸ (`asset`, `loadAsset?`, `loader?`): `void`

If an asset is parsed using this parser, the unload function will be called when the user requests an asset
to be unloaded. This is useful for things like sounds or textures that can be unloaded from memory

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `ASSET` | The asset to unload/destroy |
| `loadAsset?` | [`LoadAsset`](pixi_assets.LoadAsset.md)<`META_DATA`\> | Any custom additional information relevant to the asset being loaded |
| `loader?` | [`Loader`](../classes/pixi_assets.Loader.md) | The loader instance |

##### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L84)
