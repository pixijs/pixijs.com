---
id: "pixi_prepare.TimeLimiter"
title: "Class: TimeLimiter"
sidebar_label: "TimeLimiter"
custom_edit_url: null
---

[@pixi/prepare](../modules/pixi_prepare.md).TimeLimiter

TimeLimiter limits the number of items handled by a PIXI.BasePrepare to a specified
number of milliseconds per frame.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new TimeLimiter**(`maxMilliseconds`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxMilliseconds` | `number` | The maximum milliseconds that can be spent preparing items each frame. |

#### Defined in

[pixijs/packages/prepare/src/TimeLimiter.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/TimeLimiter.ts#L18)

## Properties

### frameStart

• `Readonly` **frameStart**: `number`

The start time of the current frame.

#### Defined in

[pixijs/packages/prepare/src/TimeLimiter.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/TimeLimiter.ts#L15)

___

### maxMilliseconds

• **maxMilliseconds**: `number`

The maximum milliseconds that can be spent preparing items each frame.

#### Defined in

[pixijs/packages/prepare/src/TimeLimiter.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/TimeLimiter.ts#L9)

## Methods

### allowedToUpload

▸ **allowedToUpload**(): `boolean`

Checks to see if another item can be uploaded. This should only be called once per item.

#### Returns

`boolean`

- If the item is allowed to be uploaded.

#### Defined in

[pixijs/packages/prepare/src/TimeLimiter.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/TimeLimiter.ts#L34)

___

### beginFrame

▸ **beginFrame**(): `void`

Resets any counting properties to start fresh on a new frame.

#### Returns

`void`

#### Defined in

[pixijs/packages/prepare/src/TimeLimiter.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/TimeLimiter.ts#L25)
