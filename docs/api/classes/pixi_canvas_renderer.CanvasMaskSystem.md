---
id: "pixi_canvas_renderer.CanvasMaskSystem"
title: "Class: CanvasMaskSystem"
sidebar_label: "CanvasMaskSystem"
custom_edit_url: null
---

[@pixi/canvas-renderer](../modules/pixi_canvas_renderer.md).CanvasMaskSystem

A set of functions used to handle masking.

Sprite masking is not supported on the CanvasRenderer.

**`Memberof`**

PIXI

## Implements

- `ISystem`

## Constructors

### constructor

• **new CanvasMaskSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md) | A reference to the current renderer |

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L27)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys this canvas mask manager.

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:263](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L263)

___

### popMask

▸ **popMask**(`renderer`): `void`

Restores the current drawing context to the state it was before the mask was applied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md) | The renderer context to use. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:256](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L256)

___

### pushMask

▸ **pushMask**(`maskData`): `void`

This method adds it to the current stack of masks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | `MaskData` \| `Graphics` | the maskData that will be pushed |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L36)

___

### recursiveFindShapes

▸ **recursiveFindShapes**(`container`, `out`): `void`

Renders all PIXI.Graphics shapes in a subtree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | `Container`<`DisplayObject`\> | container to scan. |
| `out` | `Graphics`[] | where to put found shapes |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L75)

___

### renderGraphicsShape

▸ **renderGraphicsShape**(`graphics`): `void`

Renders a PIXI.Graphics shape.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `graphics` | `Graphics` | The object to render. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasMaskSystem.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasMaskSystem.ts#L97)
