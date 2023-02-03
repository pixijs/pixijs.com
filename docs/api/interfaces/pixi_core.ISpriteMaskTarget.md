---
id: "pixi_core.ISpriteMaskTarget"
title: "Interface: ISpriteMaskTarget"
sidebar_label: "ISpriteMaskTarget"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ISpriteMaskTarget

## Hierarchy

- [`IMaskTarget`](pixi_core.IMaskTarget.md)

  ↳ **`ISpriteMaskTarget`**

## Properties

### \_texture

• **\_texture**: [`Texture`](../classes/pixi_core.Texture.md)<[`Resource`](../classes/pixi_core.Resource.md)\>

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L17)

___

### anchor

• **anchor**: [`Point`](../classes/pixi_core.Point.md)

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L19)

___

### filterArea

• **filterArea**: [`Rectangle`](../classes/pixi_core.Rectangle.md)

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[filterArea](pixi_core.IMaskTarget.md#filterarea)

#### Defined in

[pixijs/packages/core/src/filters/IFilterTarget.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/IFilterTarget.ts#L5)

___

### isSprite

• `Optional` **isSprite**: `boolean`

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[isSprite](pixi_core.IMaskTarget.md#issprite)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L13)

___

### renderable

• **renderable**: `boolean`

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[renderable](pixi_core.IMaskTarget.md#renderable)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L12)

___

### worldAlpha

• **worldAlpha**: `number`

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L18)

___

### worldTransform

• **worldTransform**: [`Matrix`](../classes/pixi_core.Matrix.md)

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[worldTransform](pixi_core.IMaskTarget.md#worldtransform)

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

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[getBounds](pixi_core.IMaskTarget.md#getbounds)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L16)

___

### isFastRect

▸ `Optional` **isFastRect**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[isFastRect](pixi_core.IMaskTarget.md#isfastrect)

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

#### Inherited from

[IMaskTarget](pixi_core.IMaskTarget.md).[render](pixi_core.IMaskTarget.md#render)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L17)
