---
id: "pixi_constants.WRAP_MODES"
title: "Enumeration: WRAP_MODES"
sidebar_label: "WRAP_MODES"
custom_edit_url: null
---

[@pixi/constants](../modules/pixi_constants.md).WRAP_MODES

The wrap modes that are supported by pixi.

The wrap mode affects the default wrapping mode of future operations.
It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
If the texture is non power of two then clamp will be used regardless as WebGL can
only use REPEAT if the texture is po2.

This property only affects WebGL.

**`Name`**

WRAP_MODES

**`Memberof`**

PIXI

**`Static`**

**`Property`**

The textures uvs are clamped

**`Property`**

The texture uvs tile and repeat

**`Property`**

The texture uvs tile and repeat with mirroring

## Enumeration Members

### CLAMP

• **CLAMP** = ``33071``

#### Defined in

[pixijs/packages/constants/src/index.ts:332](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L332)

___

### MIRRORED\_REPEAT

• **MIRRORED\_REPEAT** = ``33648``

#### Defined in

[pixijs/packages/constants/src/index.ts:334](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L334)

___

### REPEAT

• **REPEAT** = ``10497``

#### Defined in

[pixijs/packages/constants/src/index.ts:333](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L333)
