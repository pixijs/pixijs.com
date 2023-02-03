---
id: "pixi_core.IResourcePlugin"
title: "Interface: IResourcePlugin<R, RO>"
sidebar_label: "IResourcePlugin"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IResourcePlugin

Shape of supported resource plugins

**`Memberof`**

PIXI

## Type parameters

| Name |
| :------ |
| `R` |
| `RO` |

## Constructors

### constructor

• **new IResourcePlugin**(`source`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `any` |
| `options?` | `RO` |

#### Defined in

[pixijs/packages/core/src/textures/resources/autoDetectResource.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/autoDetectResource.ts#L30)

## Methods

### test

▸ **test**(`source`, `extension`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `unknown` |
| `extension` | `string` |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/textures/resources/autoDetectResource.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/autoDetectResource.ts#L29)
