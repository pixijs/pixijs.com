---
id: "pixi_constants.GC_MODES"
title: "Enumeration: GC_MODES"
sidebar_label: "GC_MODES"
custom_edit_url: null
---

[@pixi/constants](../modules/pixi_constants.md).GC_MODES

The gc modes that are supported by pixi.

The PIXI.settings.GC_MODE Garbage Collection mode for PixiJS textures is AUTO
If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
used for a specified period of time they will be removed from the GPU. They will of course
be uploaded again when they are required. This is a silent behind the scenes process that
should ensure that the GPU does not  get filled up.

Handy for mobile devices!
This property only affects WebGL.

**`Name`**

GC_MODES

**`Static`**

**`Memberof`**

PIXI

**`Property`**

Garbage collection will happen periodically automatically

**`Property`**

Garbage collection will need to be called manually

## Enumeration Members

### AUTO

• **AUTO** = ``0``

#### Defined in

[pixijs/packages/constants/src/index.ts:441](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L441)

___

### MANUAL

• **MANUAL** = ``1``

#### Defined in

[pixijs/packages/constants/src/index.ts:442](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/constants/src/index.ts#L442)
