---
id: "pixi_constants.MASK_TYPES"
title: "Enumeration: MASK_TYPES"
sidebar_label: "MASK_TYPES"
custom_edit_url: null
---

[@pixi/constants](../modules/pixi_constants.md).MASK_TYPES

Constants for mask implementations.
We use `type` suffix because it leads to very different behaviours

**`Name`**

MASK_TYPES

**`Memberof`**

PIXI

**`Static`**

**`Property`**

Mask is ignored

**`Property`**

Scissor mask, rectangle on screen, cheap

**`Property`**

Stencil mask, 1-bit, medium, works only if renderer supports stencil

**`Property`**

Mask that uses SpriteMaskFilter, uses temporary RenderTexture

**`Property`**

Color mask (RGBA)

## Enumeration Members

### COLOR

• **COLOR** = ``4``

#### Defined in

[pixijs/packages/constants/src/index.ts:483](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L483)

___

### NONE

• **NONE** = ``0``

#### Defined in

[pixijs/packages/constants/src/index.ts:479](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L479)

___

### SCISSOR

• **SCISSOR** = ``1``

#### Defined in

[pixijs/packages/constants/src/index.ts:480](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L480)

___

### SPRITE

• **SPRITE** = ``3``

#### Defined in

[pixijs/packages/constants/src/index.ts:482](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L482)

___

### STENCIL

• **STENCIL** = ``2``

#### Defined in

[pixijs/packages/constants/src/index.ts:481](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L481)
