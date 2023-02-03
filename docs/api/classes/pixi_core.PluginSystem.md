---
id: "pixi_core.PluginSystem"
title: "Class: PluginSystem"
sidebar_label: "PluginSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).PluginSystem

Manages the functionality that allows users to extend pixi functionality via additional plugins.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)<[`IRendererPlugins`](../interfaces/pixi_core.IRendererPlugins.md)\>

## Constructors

### constructor

• **new PluginSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\> |

#### Defined in

[pixijs/packages/core/src/plugin/PluginSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/plugin/PluginSystem.ts#L36)

## Properties

### plugins

• `Readonly` **plugins**: [`IRendererPlugins`](../interfaces/pixi_core.IRendererPlugins.md)

Collection of plugins.

**`Member`**

#### Defined in

[pixijs/packages/core/src/plugin/PluginSystem.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/plugin/PluginSystem.ts#L33)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/plugin/PluginSystem.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/plugin/PluginSystem.ts#L93)
