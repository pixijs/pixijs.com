---
id: "pixi_core.GenerateTextureSystem"
title: "Class: GenerateTextureSystem"
sidebar_label: "GenerateTextureSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).GenerateTextureSystem

System that manages the generation of textures from the renderer.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new GenerateTextureSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\> |

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L48)

## Properties

### renderer

• **renderer**: [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\>

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L44)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L98)

___

### generateTexture

▸ **generateTexture**(`displayObject`, `options?`): [`RenderTexture`](pixi_core.RenderTexture.md)

A Useful function that returns a texture of the display object that can then be used to create sprites
This can be quite useful if your displayObject is complicated and needs to be reused multiple times.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md) | The displayObject the object will be generated from. |
| `options?` | [`IGenerateTextureOptions`](../interfaces/pixi_core.IGenerateTextureOptions.md) | Generate texture options. |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

a shiny new texture of the display object passed in

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L62)
