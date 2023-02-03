---
id: "pixi_assets.CacheParser"
title: "Interface: CacheParser<T>"
sidebar_label: "CacheParser"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).CacheParser

For every asset that is cached, it will call the parsers test function
the flow is as follows:

1. `cacheParser.test()`: Test the asset.
2. `cacheParser.getCacheableAssets()`: If the test passes call the getCacheableAssets function with the asset

Useful if you want to add more than just a raw asset to the cache
(for example a spritesheet will want to make all its sub textures easily accessible in the cache)

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Properties

### config

• `Optional` **config**: `Record`<`string`, `any`\>

A config to adjust the parser

#### Defined in

[pixijs/packages/assets/src/cache/CacheParser.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/CacheParser.ts#L18)

___

### extension

• `Optional` **extension**: `ExtensionMetadata`

#### Defined in

[pixijs/packages/assets/src/cache/CacheParser.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/CacheParser.ts#L15)

___

### getCacheableAssets

• **getCacheableAssets**: (`keys`: `string`[], `asset`: `T`) => `Record`<`string`, `any`\>

#### Type declaration

▸ (`keys`, `asset`): `Record`<`string`, `any`\>

If the test passes, this function is called to get the cacheable assets
an example may be that a spritesheet object will return all the sub textures it has so they can
be cached.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `string`[] | The keys to cache the assets under |
| `asset` | `T` | The asset to get the cacheable assets from |

##### Returns

`Record`<`string`, `any`\>

A key-value pair of cacheable assets

#### Defined in

[pixijs/packages/assets/src/cache/CacheParser.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/CacheParser.ts#L34)

___

### test

• **test**: (`asset`: `T`) => `boolean`

#### Type declaration

▸ (`asset`): `boolean`

Gets called by the cache when a dev caches an asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `T` | the asset to test |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/cache/CacheParser.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/cache/CacheParser.ts#L24)
