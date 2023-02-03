---
id: "pixi_core.IRenderableObject"
title: "Interface: IRenderableObject"
sidebar_label: "IRenderableObject"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IRenderableObject

Interface for DisplayObject to interface with Renderer.
The minimum APIs needed to implement a renderable object.

**`Memberof`**

PIXI

## Hierarchy

- `IRenderableObject`

  ↳ **`IRenderableObject`**

  ↳↳ [`IRenderableContainer`](pixi_core.IRenderableContainer.md)

## Properties

### parent

• **parent**: [`IRenderableContainer`](pixi_core.IRenderableContainer.md)

Object must have a parent container

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L18)

___

### transform

• **transform**: [`Transform`](../classes/pixi_core.Transform.md)

Object must have a transform

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L20)

## Methods

### disableTempParent

▸ **disableTempParent**(`parent`): `void`

After method for transform updates

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | [`IRenderableContainer`](pixi_core.IRenderableContainer.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L26)

___

### enableTempParent

▸ **enableTempParent**(): [`IRenderableContainer`](pixi_core.IRenderableContainer.md)

Before method for transform updates

#### Returns

[`IRenderableContainer`](pixi_core.IRenderableContainer.md)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L22)

___

### render

▸ **render**(`renderer`): `void`

Render object directly

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`IRenderer`](pixi_core.IRenderer.md)<[`ICanvas`](pixi_core.ICanvas.md)\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L28)

___

### renderCanvas

▸ `Optional` **renderCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |

#### Returns

`void`

#### Inherited from

GlobalMixins.IRenderableObject.renderCanvas

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L43)

___

### updateTransform

▸ **updateTransform**(): `void`

Update the transforms

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L24)
