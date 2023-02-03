---
id: "pixi_assets.AssetExtension"
title: "Interface: AssetExtension<ASSET, META_DATA>"
sidebar_label: "AssetExtension"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).AssetExtension

This developer convenience object allows developers to group
together the various asset parsers into a single object.

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `ASSET` | `any` |
| `META_DATA` | `any` |

## Properties

### cache

• `Optional` **cache**: `Partial`<[`CacheParser`](pixi_assets.CacheParser.md)<`ASSET`\>\>

#### Defined in

[pixijs/packages/assets/src/AssetExtension.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/AssetExtension.ts#L27)

___

### detection

• `Optional` **detection**: `Partial`<[`FormatDetectionParser`](pixi_assets.FormatDetectionParser.md)\>

#### Defined in

[pixijs/packages/assets/src/AssetExtension.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/AssetExtension.ts#L28)

___

### extension

• **extension**: `Asset`

#### Defined in

[pixijs/packages/assets/src/AssetExtension.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/AssetExtension.ts#L24)

___

### loader

• `Optional` **loader**: `Partial`<[`LoaderParser`](pixi_assets.LoaderParser.md)<`ASSET`, `META_DATA`\>\>

#### Defined in

[pixijs/packages/assets/src/AssetExtension.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/AssetExtension.ts#L25)

___

### resolver

• `Optional` **resolver**: `Partial`<[`ResolveURLParser`](pixi_assets.ResolveURLParser.md)\>

#### Defined in

[pixijs/packages/assets/src/AssetExtension.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/AssetExtension.ts#L26)
