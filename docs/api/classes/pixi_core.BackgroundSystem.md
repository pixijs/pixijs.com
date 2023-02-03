---
id: "pixi_core.BackgroundSystem"
title: "Class: BackgroundSystem"
sidebar_label: "BackgroundSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BackgroundSystem

The background system manages the background color and alpha of the main view.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)<[`BackgroundOptions`](../interfaces/pixi_core.BackgroundOptions.md)\>

## Constructors

### constructor

• **new BackgroundSystem**()

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L47)

## Properties

### clearBeforeRender

• **clearBeforeRender**: `boolean`

This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
to clear the canvas every frame. Disable this by setting this to false. For example, if
your game has a canvas filling background image you often don't need this set.

**`Member`**

**`Default`**

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L41)

## Accessors

### alpha

• `get` **alpha**(): `number`

The background color alpha. Setting this to 0 will make the canvas transparent.

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L99)

• `set` **alpha**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L104)

___

### color

• `get` **color**(): `number`

The background color to fill if not transparent

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L83)

• `set` **color**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L88)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L129)

___

### init

▸ **init**(`options`): `void`

initiates the background system

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`BackgroundOptions`](../interfaces/pixi_core.BackgroundOptions.md) | the options for the background colors |

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[init](../interfaces/pixi_core.ISystem.md#init)

#### Defined in

[pixijs/packages/core/src/background/BackgroundSystem.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/background/BackgroundSystem.ts#L65)
