---
id: "pixi_core.StencilSystem"
title: "Class: StencilSystem"
sidebar_label: "StencilSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).StencilSystem

System plugin to the renderer to manage stencils (used for masks).

**`Memberof`**

PIXI

## Hierarchy

- `AbstractMaskSystem`

  ↳ **`StencilSystem`**

## Constructors

### constructor

• **new StencilSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Overrides

AbstractMaskSystem.constructor

#### Defined in

[pixijs/packages/core/src/mask/StencilSystem.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/StencilSystem.ts#L24)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys the mask stack.

#### Returns

`void`

#### Inherited from

AbstractMaskSystem.destroy

#### Defined in

[pixijs/packages/core/src/mask/AbstractMaskSystem.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/AbstractMaskSystem.ts#L78)

___

### getStackLength

▸ **getStackLength**(): `number`

#### Returns

`number`

#### Overrides

AbstractMaskSystem.getStackLength

#### Defined in

[pixijs/packages/core/src/mask/StencilSystem.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/StencilSystem.ts#L31)

___

### pop

▸ **pop**(`maskObject`): `void`

Pops stencil mask. MaskData is already removed from stack

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskObject` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) | object of popped mask data |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/StencilSystem.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/StencilSystem.ts#L99)

___

### push

▸ **push**(`maskData`): `void`

Applies the Mask and adds it to the current stencil stack.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | The mask data |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/StencilSystem.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/StencilSystem.ts#L47)

___

### setMaskStack

▸ **setMaskStack**(`maskStack`): `void`

Changes the mask stack that is used by this System.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskStack` | [`MaskData`](pixi_core.MaskData.md)[] | The mask stack |

#### Returns

`void`

#### Inherited from

AbstractMaskSystem.setMaskStack

#### Defined in

[pixijs/packages/core/src/mask/AbstractMaskSystem.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/AbstractMaskSystem.ts#L45)
