---
id: "pixi_core.IRenderableContainer"
title: "Interface: IRenderableContainer"
sidebar_label: "IRenderableContainer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IRenderableContainer

Interface for Container to interface with Renderer.

**`Memberof`**

PIXI

## Hierarchy

- [`IRenderableObject`](pixi_core.IRenderableObject.md)

  ↳ **`IRenderableContainer`**

## Properties

### parent

• **parent**: [`IRenderableContainer`](pixi_core.IRenderableContainer.md)

Object must have a parent container

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[parent](pixi_core.IRenderableObject.md#parent)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L18)

___

### transform

• **transform**: [`Transform`](../classes/pixi_core.Transform.md)

Object must have a transform

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[transform](pixi_core.IRenderableObject.md#transform)

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

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[disableTempParent](pixi_core.IRenderableObject.md#disabletempparent)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L26)

___

### enableTempParent

▸ **enableTempParent**(): [`IRenderableContainer`](pixi_core.IRenderableContainer.md)

Before method for transform updates

#### Returns

[`IRenderableContainer`](pixi_core.IRenderableContainer.md)

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[enableTempParent](pixi_core.IRenderableObject.md#enabletempparent)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L22)

___

### getLocalBounds

▸ **getLocalBounds**(`rect?`, `skipChildrenUpdate?`): [`Rectangle`](../classes/pixi_core.Rectangle.md)

Get Local bounds for container

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect?` | [`Rectangle`](../classes/pixi_core.Rectangle.md) |
| `skipChildrenUpdate?` | `boolean` |

#### Returns

[`Rectangle`](../classes/pixi_core.Rectangle.md)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L38)

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

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[render](pixi_core.IRenderableObject.md#render)

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

[IRenderableObject](pixi_core.IRenderableObject.md).[renderCanvas](pixi_core.IRenderableObject.md#rendercanvas)

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L43)

___

### updateTransform

▸ **updateTransform**(): `void`

Update the transforms

#### Returns

`void`

#### Inherited from

[IRenderableObject](pixi_core.IRenderableObject.md).[updateTransform](pixi_core.IRenderableObject.md#updatetransform)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L24)
