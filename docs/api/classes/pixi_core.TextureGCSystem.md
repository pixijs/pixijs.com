---
id: "pixi_core.TextureGCSystem"
title: "Class: TextureGCSystem"
sidebar_label: "TextureGCSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).TextureGCSystem

System plugin to the renderer to manage texture garbage collection on the GPU,
ensuring that it does not get clogged up with textures that are no longer being used.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new TextureGCSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L83)

## Properties

### checkCount

• `Readonly` **checkCount**: `number`

Check count

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L61)

___

### checkCountMax

• **checkCountMax**: `number`

Maximum number of item to check

**`See`**

PIXI.TextureGCSystem.defaultCheckCountMax

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L73)

___

### count

• `Readonly` **count**: `number`

Count

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L55)

___

### maxIdle

• **maxIdle**: `number`

Maximum idle time, in seconds

**`See`**

PIXI.TextureGCSystem.defaultMaxIdle

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L67)

___

### mode

• **mode**: [`GC_MODES`](../enums/pixi_core.GC_MODES.md)

Current garbage collection mode

**`See`**

PIXI.TextureGCSystem.defaultMode

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L79)

___

### defaultCheckCountMax

▪ `Static` **defaultCheckCountMax**: `number`

Default Garbage Collection maximum check count.

**`Static`**

**`Default`**

600

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L43)

___

### defaultMaxIdle

▪ `Static` **defaultMaxIdle**: `number`

Default Garbage Collection max idle.

**`Static`**

**`Default`**

3600

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L36)

___

### defaultMode

▪ `Static` **defaultMode**: [`GC_MODES`](../enums/pixi_core.GC_MODES.md) = `GC_MODES.AUTO`

Default Garbage Collection mode.

**`Static`**

**`Default`**

PIXI.GC_MODES.AUTO

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L29)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L182)

___

### run

▸ **run**(): `void`

Checks to see when the last time a texture was used
if the texture has not been used for a specified amount of time it will be removed from the GPU

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L126)

___

### unload

▸ **unload**(`displayObject`): `void`

Removes all the textures within the specified displayObject and its children from the GPU

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | [`IUnloadableTexture`](../interfaces/pixi_core.IUnloadableTexture.md) | the displayObject to remove the textures from. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureGCSystem.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureGCSystem.ts#L165)
