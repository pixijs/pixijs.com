---
id: "pixi_app.IApplicationPlugin"
title: "Interface: IApplicationPlugin"
sidebar_label: "IApplicationPlugin"
custom_edit_url: null
---

[@pixi/app](../modules/pixi_app.md).IApplicationPlugin

Any plugin that's usable for Application should contain these methods.

**`Memberof`**

PIXI

## Methods

### destroy

▸ **destroy**(): `void`

Called when destroying Application, scoped to Application instance.

#### Returns

`void`

#### Defined in

[pixijs/packages/app/src/Application.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L20)

___

### init

▸ **init**(`options`): `void`

Called when Application is constructed, scoped to Application instance.
Passes in `options` as the only argument, which are Application constructor options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`IApplicationOptions`](pixi_app.IApplicationOptions.md) | Application options. |

#### Returns

`void`

#### Defined in

[pixijs/packages/app/src/Application.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L18)
