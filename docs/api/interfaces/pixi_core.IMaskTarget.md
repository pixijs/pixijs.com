---
id: "pixi_core.IMaskTarget"
title: "Interface: IMaskTarget"
sidebar_label: "IMaskTarget"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IMaskTarget

## Hierarchy

- [`IFilterTarget`](pixi_core.IFilterTarget.md)

  ↳ **`IMaskTarget`**

  ↳↳ [`ISpriteMaskTarget`](pixi_core.ISpriteMaskTarget.md)

## Properties

### filterArea

• **filterArea**: [`Rectangle`](../classes/pixi_core.Rectangle.md)

#### Inherited from

[IFilterTarget](pixi_core.IFilterTarget.md).[filterArea](pixi_core.IFilterTarget.md#filterarea)

#### Defined in

[pixijs/packages/core/src/filters/IFilterTarget.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/IFilterTarget.ts#L5)

___

### isSprite

• `Optional` **isSprite**: `boolean`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L13)

___

### renderable

• **renderable**: `boolean`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L12)

___

### worldTransform

• **worldTransform**: [`Matrix`](../classes/pixi_core.Matrix.md)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L14)

## Methods

### getBounds

▸ **getBounds**(`skipUpdate?`, `rect?`): [`Rectangle`](../classes/pixi_core.Rectangle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `skipUpdate?` | `boolean` |
| `rect?` | [`Rectangle`](../classes/pixi_core.Rectangle.md) |

#### Returns

[`Rectangle`](../classes/pixi_core.Rectangle.md)

#### Overrides

[IFilterTarget](pixi_core.IFilterTarget.md).[getBounds](pixi_core.IFilterTarget.md#getbounds)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L16)

___

### isFastRect

▸ `Optional` **isFastRect**(): `boolean`

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L15)

___

### render

▸ **render**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](../classes/pixi_core.Renderer.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L17)
