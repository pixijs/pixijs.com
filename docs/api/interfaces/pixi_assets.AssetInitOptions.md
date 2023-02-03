---
id: "pixi_assets.AssetInitOptions"
title: "Interface: AssetInitOptions"
sidebar_label: "AssetInitOptions"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).AssetInitOptions

Initialization options object for Asset Class.

**`Memberof`**

PIXI

## Properties

### basePath

• `Optional` **basePath**: `string`

a base path for any assets loaded

#### Defined in

[pixijs/packages/assets/src/Assets.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L25)

___

### bundleIdentifier

• `Optional` **bundleIdentifier**: `BundleIdentifierOptions`

advanced - override how bundlesIds are generated

#### Defined in

[pixijs/packages/assets/src/Assets.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L48)

___

### defaultSearchParams

• `Optional` **defaultSearchParams**: `string` \| `Record`<`string`, `any`\>

a default URL parameter string to append to all assets loaded

#### Defined in

[pixijs/packages/assets/src/Assets.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L28)

___

### manifest

• `Optional` **manifest**: `string` \| [`ResolverManifest`](../modules/pixi_assets.md#resolvermanifest)

a manifest to tell the asset loader upfront what all your assets are
this can be the manifest object itself, or a URL to the manifest.

#### Defined in

[pixijs/packages/assets/src/Assets.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L34)

___

### texturePreference

• `Optional` **texturePreference**: `Object`

optional preferences for which textures preferences you have when resolving assets
for example you might set the resolution to 0.5 if the user is on a rubbish old phone
or you might set the resolution to 2 if the user is on a retina display

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `format?` | `string` \| `string`[] | the formats you prefer, by default this will be: ['avif', 'webp', 'png', 'jpg', 'jpeg'] |
| `resolution?` | `number` \| `number`[] | the resolution order you prefer, can be an array (priority order - first is prefered) or a single resolutions |

#### Defined in

[pixijs/packages/assets/src/Assets.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L40)
