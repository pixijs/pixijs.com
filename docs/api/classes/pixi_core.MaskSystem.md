---
id: "pixi_core.MaskSystem"
title: "Class: MaskSystem"
sidebar_label: "MaskSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).MaskSystem

System plugin to the renderer to manage masks.

There are three built-in types of masking:
**Scissor Masking**: Scissor masking discards pixels that are outside of a rectangle called the scissor box. It is
 the most performant as the scissor test is inexpensive. However, it can only be used when the mask is rectangular.
**Stencil Masking**: Stencil masking discards pixels that don't overlap with the pixels rendered into the stencil
 buffer. It is the next fastest option as it does not require rendering into a separate framebuffer. However, it does
 cause the mask to be rendered **twice** for each masking operation; hence, minimize the rendering cost of your masks.
**Sprite Mask Filtering**: Sprite mask filtering discards pixels based on the red channel of the sprite-mask's
 texture. (Generally, the masking texture is grayscale). Using advanced techniques, you might be able to embed this
 type of masking in a custom shader - and hence, bypassing the masking system fully for performance wins.

The best type of masking is auto-detected when you `push` one. To use scissor masking, you must pass in a `Graphics`
object with just a rectangle drawn.

## Mask Stacks

In the scene graph, masks can be applied recursively, i.e. a mask can be applied during a masking operation. The mask
stack stores the currently applied masks in order. Each PIXI.BaseRenderTexture holds its own mask stack, i.e.
when you switch render-textures, the old masks only applied when you switch back to rendering to the old render-target.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new MaskSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L66)

## Properties

### enableScissor

• **enableScissor**: `boolean`

Flag to enable scissor masking.

**`Default`**

true

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L46)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:351](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L351)

___

### detect

▸ **detect**(`maskData`): `void`

Sets type of MaskData based on its maskObject.

#### Parameters

| Name | Type |
| :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L214)

___

### pop

▸ **pop**(`target`): `void`

Removes the last mask from the mask stack and doesn't return it.

NOTE: The batch renderer should be flushed beforehand to render the masked contents before the mask is removed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) | Display Object to pop the mask from |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L160)

___

### popColorMask

▸ **popColorMask**(`maskData`): `void`

Pops the color mask.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | The mask data |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:334](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L334)

___

### popSpriteMask

▸ **popSpriteMask**(`maskData`): `void`

Removes the last filter from the filter stack and doesn't return it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | Sprite to be used as the mask. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:295](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L295)

___

### push

▸ **push**(`target`, `maskDataOrTarget`): `void`

Enables the mask and appends it to the current mask stack.

NOTE: The batch renderer should be flushed beforehand to prevent pending renders from being masked.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) | Display Object to push the mask to |
| `maskDataOrTarget` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) \| [`MaskData`](pixi_core.MaskData.md) | The masking data. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L96)

___

### pushColorMask

▸ **pushColorMask**(`maskData`): `void`

Pushes the color mask.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | The mask data |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:314](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L314)

___

### pushSpriteMask

▸ **pushSpriteMask**(`maskData`): `void`

Applies the Mask and adds it to the current filter stack.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maskData` | [`MaskData`](pixi_core.MaskData.md) | Sprite to be used as the mask. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L240)

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

#### Defined in

[pixijs/packages/core/src/mask/MaskSystem.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskSystem.ts#L82)
