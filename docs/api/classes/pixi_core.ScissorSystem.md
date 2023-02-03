---
id: "pixi_core.ScissorSystem"
title: "Class: ScissorSystem"
sidebar_label: "ScissorSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ScissorSystem

System plugin to the renderer to manage scissor masking.

Scissor masking discards pixels outside of a rectangle called the scissor box. The scissor box is in the framebuffer
viewport's space; however, the mask's rectangle is projected from world-space to viewport space automatically
by this system.

**`Memberof`**

PIXI

## Hierarchy

- `AbstractMaskSystem`

  ↳ **`ScissorSystem`**

## Constructors

### constructor

• **new ScissorSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Overrides

AbstractMaskSystem.constructor

#### Defined in

[pixijs/packages/core/src/mask/ScissorSystem.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L32)

## Methods

### calcScissorRect

▸ **calcScissorRect**(`maskData`): `void`

evaluates _boundsTransformed, _scissorRect for MaskData

#### Parameters

| Name | Type |
| :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/ScissorSystem.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L55)

___

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

[pixijs/packages/core/src/mask/ScissorSystem.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L39)

___

### pop

▸ **pop**(`maskData?`): `void`

This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
last mask in the stack.

This can also be called when you directly modify the scissor box and want to restore PixiJS state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData?` | [`MaskData`](pixi_core.MaskData.md) | The mask data. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/ScissorSystem.ts:189](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L189)

___

### push

▸ **push**(`maskData`): `void`

Applies the Mask and adds it to the current stencil stack.

**`Author`**

alvin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | The mask data. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/ScissorSystem.ts:163](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L163)

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

___

### testScissor

▸ **testScissor**(`maskData`): `boolean`

Test, whether the object can be scissor mask with current renderer projection.
Calls "calcScissorRect()" if its true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | mask data |

#### Returns

`boolean`

whether Whether the object can be scissor mask

#### Defined in

[pixijs/packages/core/src/mask/ScissorSystem.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/ScissorSystem.ts#L101)
