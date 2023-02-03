---
id: "pixi_assets.ResolveURLParser"
title: "Interface: ResolveURLParser"
sidebar_label: "ResolveURLParser"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).ResolveURLParser

Format for url parser, will test a string and if it pass will then parse it, turning it into an ResolveAsset

**`Memberof`**

PIXI

## Properties

### config

• `Optional` **config**: `Record`<`string`, `any`\>

A config to adjust the parser

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L61)

___

### extension

• `Optional` **extension**: `ExtensionMetadata`

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L59)

___

### parse

• **parse**: (`value`: `string`) => [`ResolveAsset`](pixi_assets.ResolveAsset.md)

#### Type declaration

▸ (`value`): [`ResolveAsset`](pixi_assets.ResolveAsset.md)

the function that will convert the url into an object

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

##### Returns

[`ResolveAsset`](pixi_assets.ResolveAsset.md)

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L65)

___

### test

• **test**: (`url`: `string`) => `boolean`

#### Type declaration

▸ (`url`): `boolean`

the test to perform on the url to determin if it should be parsed

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

##### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/resolver/types.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/resolver/types.ts#L63)
