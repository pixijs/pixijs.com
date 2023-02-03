---
id: "pixi_core.MaskData"
title: "Class: MaskData"
sidebar_label: "MaskData"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).MaskData

Component for masked elements.

Holds mask mode and temporary data about current mask.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new MaskData**(`maskObject?`)

Create MaskData

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maskObject?` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) | `null` | object that describes the mask |

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L117)

## Properties

### autoDetect

• **autoDetect**: `boolean`

Whether we know the mask type beforehand

**`Default`**

true

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L34)

___

### colorMask

• **colorMask**: [`COLOR_MASK_BITS`](../enums/pixi_core.COLOR_MASK_BITS.md)

Color mask.

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L66)

___

### enabled

• **enabled**: `boolean`

If enabled is true the mask is applied, if false it will not.

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L63)

___

### isMaskData

• **isMaskData**: `boolean`

Indicator of the type (always true for [MaskData](pixi_core.MaskData.md) objects)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L46)

___

### maskObject

• **maskObject**: [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md)

Which element we use to mask

**`Member`**

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L40)

___

### multisample

• **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

Number of samples of the sprite mask filter.
If set to `null`, the sample count of the current render target is used.

**`Default`**

PIXI.settings.FILTER_MULTISAMPLE

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L60)

___

### pooled

• **pooled**: `boolean`

Whether it belongs to MaskSystem pool

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L43)

___

### resolution

• **resolution**: `number`

Resolution of the sprite mask filter.
If set to `null` or `0`, the resolution of the current render target is used.

**`Default`**

null

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L53)

___

### type

• **type**: [`MASK_TYPES`](../enums/pixi_core.MASK_TYPES.md)

Mask type

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L28)

## Accessors

### filter

• `get` **filter**(): [`ISpriteMaskFilter`](../interfaces/pixi_core.ISpriteMaskFilter.md)

The sprite mask filter.
If set to `null`, the default sprite mask filter is used.

**`Default`**

null

#### Returns

[`ISpriteMaskFilter`](../interfaces/pixi_core.ISpriteMaskFilter.md)

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:142](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L142)

• `set` **filter**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`ISpriteMaskFilter`](../interfaces/pixi_core.ISpriteMaskFilter.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L147)

## Methods

### copyCountersOrReset

▸ **copyCountersOrReset**(`maskAbove?`): `void`

Copies counters from maskData above, called from pushMask().

#### Parameters

| Name | Type |
| :------ | :------ |
| `maskAbove?` | [`MaskData`](pixi_core.MaskData.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:186](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L186)

___

### reset

▸ **reset**(): `void`

Resets the mask data after popMask().

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/mask/MaskData.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/mask/MaskData.ts#L167)
