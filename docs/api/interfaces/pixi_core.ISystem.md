---
id: "pixi_core.ISystem"
title: "Interface: ISystem<INIT_OPTIONS, DESTROY_OPTIONS>"
sidebar_label: "ISystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ISystem

Interface for systems used by the PIXI.Renderer.

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `INIT_OPTIONS` | ``null`` |
| `DESTROY_OPTIONS` | ``null`` |

## Implemented by

- [`BackgroundSystem`](../classes/pixi_core.BackgroundSystem.md)
- [`BatchSystem`](../classes/pixi_core.BatchSystem.md)
- [`BufferSystem`](../classes/pixi_core.BufferSystem.md)
- [`ContextSystem`](../classes/pixi_core.ContextSystem.md)
- [`FilterSystem`](../classes/pixi_core.FilterSystem.md)
- [`FramebufferSystem`](../classes/pixi_core.FramebufferSystem.md)
- [`GenerateTextureSystem`](../classes/pixi_core.GenerateTextureSystem.md)
- [`GeometrySystem`](../classes/pixi_core.GeometrySystem.md)
- [`MaskSystem`](../classes/pixi_core.MaskSystem.md)
- [`MultisampleSystem`](../classes/pixi_core.MultisampleSystem.md)
- [`ObjectRenderer`](../classes/pixi_core.ObjectRenderer.md)
- [`ObjectRendererSystem`](../classes/pixi_core.ObjectRendererSystem.md)
- [`PluginSystem`](../classes/pixi_core.PluginSystem.md)
- [`ProjectionSystem`](../classes/pixi_core.ProjectionSystem.md)
- [`RenderTextureSystem`](../classes/pixi_core.RenderTextureSystem.md)
- [`ShaderSystem`](../classes/pixi_core.ShaderSystem.md)
- [`StartupSystem`](../classes/pixi_core.StartupSystem.md)
- [`StateSystem`](../classes/pixi_core.StateSystem.md)
- [`TextureGCSystem`](../classes/pixi_core.TextureGCSystem.md)
- [`TextureSystem`](../classes/pixi_core.TextureSystem.md)
- [`TransformFeedbackSystem`](../classes/pixi_core.TransformFeedbackSystem.md)
- [`ViewSystem`](../classes/pixi_core.ViewSystem.md)

## Methods

### destroy

▸ `Optional` **destroy**(`options?`): `void`

Generic destroy methods to be overridden by the subclass

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `DESTROY_OPTIONS` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/ISystem.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/ISystem.ts#L11)

___

### init

▸ `Optional` **init**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `INIT_OPTIONS` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/ISystem.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/ISystem.ts#L9)
