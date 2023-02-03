---
id: "pixi_ticker.UPDATE_PRIORITY"
title: "Enumeration: UPDATE_PRIORITY"
sidebar_label: "UPDATE_PRIORITY"
custom_edit_url: null
---

[@pixi/ticker](../modules/pixi_ticker.md).UPDATE_PRIORITY

Represents the update priorities used by internal PIXI classes when registered with
the PIXI.Ticker object. Higher priority items are updated first and lower
priority items, such as render, should go later.

**`Static`**

**`Name`**

UPDATE_PRIORITY

**`Memberof`**

PIXI

**`Property`**

High priority updating, PIXI.VideoBaseTexture and PIXI.AnimatedSprite

**`Property`**

Default priority for ticker events, see PIXI.Ticker#add.

**`Property`**

Low priority used for PIXI.Application rendering.

**`Property`**

Lowest priority used for PIXI.BasePrepare utility.

## Enumeration Members

### HIGH

• **HIGH** = ``25``

#### Defined in

[pixijs/packages/ticker/src/const.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/const.ts#L17)

___

### LOW

• **LOW** = ``-25``

#### Defined in

[pixijs/packages/ticker/src/const.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/const.ts#L19)

___

### NORMAL

• **NORMAL** = ``0``

#### Defined in

[pixijs/packages/ticker/src/const.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/const.ts#L18)

___

### UTILITY

• **UTILITY** = ``-50``

#### Defined in

[pixijs/packages/ticker/src/const.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/const.ts#L20)
