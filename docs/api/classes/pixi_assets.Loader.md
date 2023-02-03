---
id: "pixi_assets.Loader"
title: "Class: Loader"
sidebar_label: "Loader"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).Loader

The Loader is responsible for loading all assets, such as images, spritesheets, audio files, etc.
It does not do anything clever with URLs - it just loads stuff!
Behind the scenes all things are cached using promises. This means it's impossible to load an asset more than once.
Through the use of LoaderParsers, the loader can understand how to load any kind of file!

It is not intended that this class is created by developers - its part of the Asset class
This is the second major system of PixiJS' main Assets class

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Loader**()

## Properties

### promiseCache

• **promiseCache**: `Record`<`string`, [`PromiseAndParser`](../interfaces/pixi_assets.PromiseAndParser.md)\> = `{}`

Cache loading promises that ae currently active

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L23)

## Accessors

### parsers

• `get` **parsers**(): [`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`any`, `any`\>[]

All loader parsers registered

#### Returns

[`LoaderParser`](../interfaces/pixi_assets.LoaderParser.md)<`any`, `any`\>[]

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L210)

## Methods

### load

▸ **load**<`T`\>(`assetsToLoadIn`, `onProgress?`): `Promise`<`T`\>

Loads one or more assets using the parsers added to the Loader.

**`Example`**

```ts
// Single asset:
const asset = await Loader.load('cool.png');
console.log(asset);

// Multiple assets:
const assets = await Loader.load(['cool.png', 'cooler.png']);
console.log(assets);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetsToLoadIn` | `string` \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\> | urls that you want to load, or a single one! |
| `onProgress?` | (`progress`: `number`) => `void` | For multiple asset loading only, an optional function that is called when progress on asset loading is made. The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0) of the assets loaded. Do not use this function to detect when assets are complete and available, instead use the Promise returned by this function. |

#### Returns

`Promise`<`T`\>

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L109)

▸ **load**<`T`\>(`assetsToLoadIn`, `onProgress?`): `Promise`<`Record`<`string`, `T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `assetsToLoadIn` | `string`[] \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\>[] |
| `onProgress?` | (`progress`: `number`) => `void` |

#### Returns

`Promise`<`Record`<`string`, `T`\>\>

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L113)

___

### reset

▸ **reset**(): `void`

function used for testing

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L26)

___

### unload

▸ **unload**(`assetsToUnloadIn`): `Promise`<`void`\>

Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
The parser that created the asset, will be the one that unloads it.

**`Example`**

```ts
// Single asset:
const asset = await Loader.load('cool.png');

await Loader.unload('cool.png');

console.log(asset.destroyed); // true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetsToUnloadIn` | `string` \| `string`[] \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\> \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\>[] | urls that you want to unload, or a single one! |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/loader/Loader.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/Loader.ts#L182)
