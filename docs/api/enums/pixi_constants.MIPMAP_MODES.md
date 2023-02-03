---
id: "pixi_constants.MIPMAP_MODES"
title: "Enumeration: MIPMAP_MODES"
sidebar_label: "MIPMAP_MODES"
custom_edit_url: null
---

[@pixi/constants](../modules/pixi_constants.md).MIPMAP_MODES

Mipmap filtering modes that are supported by pixi.

The PIXI.settings.MIPMAP_TEXTURES affects default texture filtering.
Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
or its `POW2` and texture dimensions are powers of 2.
Since WebGL 1 don't support mipmap for non-power-of-two textures,
`ON` option will work like `POW2` for WebGL 1.

This property only affects WebGL.

**`Name`**

MIPMAP_MODES

**`Memberof`**

PIXI

**`Static`**

**`Property`**

No mipmaps.

**`Property`**

Generate mipmaps if texture dimensions are powers of 2.

**`Property`**

Always generate mipmaps.

**`Property`**

Use mipmaps, but do not auto-generate them;
 this is used with a resource that supports buffering each level-of-detail.

## Enumeration Members

### OFF

• **OFF** = ``0``

#### Defined in

[pixijs/packages/constants/src/index.ts:360](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L360)

___

### ON

• **ON** = ``2``

#### Defined in

[pixijs/packages/constants/src/index.ts:362](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L362)

___

### ON\_MANUAL

• **ON\_MANUAL** = ``3``

#### Defined in

[pixijs/packages/constants/src/index.ts:363](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L363)

___

### POW2

• **POW2** = ``1``

#### Defined in

[pixijs/packages/constants/src/index.ts:361](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L361)
