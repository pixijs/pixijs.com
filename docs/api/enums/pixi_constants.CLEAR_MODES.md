---
id: "pixi_constants.CLEAR_MODES"
title: "Enumeration: CLEAR_MODES"
sidebar_label: "CLEAR_MODES"
custom_edit_url: null
---

[@pixi/constants](../modules/pixi_constants.md).CLEAR_MODES

Configure whether filter textures are cleared after binding.

Filter textures need not be cleared if the filter does not use pixel blending. [BLIT](pixi_constants.CLEAR_MODES.md#blit) will detect
this and skip clearing as an optimization.

**`Name`**

CLEAR_MODES

**`Memberof`**

PIXI

**`Static`**

**`Property`**

Do not clear the filter texture. The filter's output will blend on top of the output texture.

**`Property`**

Always clear the filter texture.

**`Property`**

Clear only if FilterSystem.forceClear is set or if the filter uses pixel blending.

**`Property`**

Alias for BLEND, same as `false` in earlier versions

**`Property`**

Alias for CLEAR, same as `true` in earlier versions

**`Property`**

Alias for BLIT

## Enumeration Members

### AUTO

• **AUTO** = ``2``

#### Defined in

[pixijs/packages/constants/src/index.ts:414](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L414)

___

### BLEND

• **BLEND** = ``0``

#### Defined in

[pixijs/packages/constants/src/index.ts:415](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L415)

___

### BLIT

• **BLIT** = ``2``

#### Defined in

[pixijs/packages/constants/src/index.ts:417](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L417)

___

### CLEAR

• **CLEAR** = ``1``

#### Defined in

[pixijs/packages/constants/src/index.ts:416](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L416)

___

### NO

• **NO** = ``0``

#### Defined in

[pixijs/packages/constants/src/index.ts:412](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L412)

___

### YES

• **YES** = ``1``

#### Defined in

[pixijs/packages/constants/src/index.ts:413](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L413)
