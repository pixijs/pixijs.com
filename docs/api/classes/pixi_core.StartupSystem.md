---
id: "pixi_core.StartupSystem"
title: "Class: StartupSystem"
sidebar_label: "StartupSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).StartupSystem

A simple system responsible for initiating the renderer.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new StartupSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\> |

#### Defined in

[pixijs/packages/core/src/startup/StartupSystem.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/startup/StartupSystem.ts#L37)

## Properties

### renderer

• `Readonly` **renderer**: [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\>

#### Defined in

[pixijs/packages/core/src/startup/StartupSystem.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/startup/StartupSystem.ts#L35)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/startup/StartupSystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/startup/StartupSystem.ts#L61)

___

### run

▸ **run**(`options`): `void`

It all starts here! This initiates every system, passing in the options for any system by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`StartupOptions`](../interfaces/pixi_core.StartupOptions.md) | the config for the renderer and all its systems |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/startup/StartupSystem.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/startup/StartupSystem.ts#L46)
