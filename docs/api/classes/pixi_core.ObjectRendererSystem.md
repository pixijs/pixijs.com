---
id: "pixi_core.ObjectRendererSystem"
title: "Class: ObjectRendererSystem"
sidebar_label: "ObjectRendererSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ObjectRendererSystem

system that provides a render function that focussing on rendering Pixi Scene Graph objects
to either the main view or to a renderTexture.  Used for Canvas `WebGL` contexts

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new ObjectRendererSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) |

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L39)

## Properties

### lastObjectRendered

• `Readonly` **lastObjectRendered**: [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md)

the last object rendered by the renderer. Useful for other plugins like interaction managers

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L36)

___

### renderer

• **renderer**: [`Renderer`](pixi_core.Renderer.md)

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L23)

___

### renderingToScreen

• `Readonly` **renderingToScreen**: `boolean`

Flag if we are rendering to the screen vs renderTexture

**`Default`**

true

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L30)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L127)

___

### render

▸ **render**(`displayObject`, `options?`): `void`

Renders the object to its WebGL view.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md) | The object to be rendered. |
| `options?` | [`IRendererRenderOptions`](../interfaces/pixi_core.IRendererRenderOptions.md) | the options to be passed to the renderer |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/render/ObjectRendererSystem.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/render/ObjectRendererSystem.ts#L49)
