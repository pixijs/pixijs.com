---
id: "pixi_core.MultisampleSystem"
title: "Class: MultisampleSystem"
sidebar_label: "MultisampleSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).MultisampleSystem

System that manages the multisample property on the WebGL renderer

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new MultisampleSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) |

#### Defined in

[pixijs/packages/core/src/framebuffer/MultisampleSystem.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/MultisampleSystem.ts#L29)

## Properties

### multisample

• `Readonly` **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

The number of msaa samples of the canvas.

#### Defined in

[pixijs/packages/core/src/framebuffer/MultisampleSystem.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/MultisampleSystem.ts#L25)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/framebuffer/MultisampleSystem.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/MultisampleSystem.ts#L77)
