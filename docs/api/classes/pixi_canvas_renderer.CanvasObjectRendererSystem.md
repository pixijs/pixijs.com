---
id: "pixi_canvas_renderer.CanvasObjectRendererSystem"
title: "Class: CanvasObjectRendererSystem"
sidebar_label: "CanvasObjectRendererSystem"
custom_edit_url: null
---

[@pixi/canvas-renderer](../modules/pixi_canvas_renderer.md).CanvasObjectRendererSystem

system that provides a render function that focussing on rendering Pixi Scene Graph objects
to either the main view or to a renderTexture. Used for Canvas `2d` contexts

**`Memberof`**

PIXI

## Implements

- `ISystem`

## Constructors

### constructor

• **new CanvasObjectRendererSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md) | A reference to the current renderer |

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts#L40)

## Properties

### lastObjectRendered

• **lastObjectRendered**: `IRenderableObject`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts#L37)

___

### renderingToScreen

• **renderingToScreen**: `boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts#L36)

## Methods

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts:179](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts#L179)

___

### render

▸ **render**(`displayObject`, `options?`): `void`

Renders the object to its Canvas view.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | `IRenderableObject` | The object to be rendered. |
| `options?` | `IRendererRenderOptions` | the options to be passed to the renderer |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasObjectRendererSystem.ts#L50)
