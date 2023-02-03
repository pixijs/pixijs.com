---
id: "pixi_prepare.CountLimiter"
title: "Class: CountLimiter"
sidebar_label: "CountLimiter"
custom_edit_url: null
---

[@pixi/prepare](../modules/pixi_prepare.md).CountLimiter

CountLimiter limits the number of items handled by a PIXI.BasePrepare to a specified
number of items per frame.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new CountLimiter**(`maxItemsPerFrame`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxItemsPerFrame` | `number` | The maximum number of items that can be prepared each frame. |

#### Defined in

[pixijs/packages/prepare/src/CountLimiter.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/CountLimiter.ts#L17)

## Properties

### itemsLeft

• **itemsLeft**: `number`

The number of items that can be prepared in the current frame.

#### Defined in

[pixijs/packages/prepare/src/CountLimiter.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/CountLimiter.ts#L12)

___

### maxItemsPerFrame

• **maxItemsPerFrame**: `number`

The maximum number of items that can be prepared each frame.

#### Defined in

[pixijs/packages/prepare/src/CountLimiter.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/CountLimiter.ts#L9)

## Methods

### allowedToUpload

▸ **allowedToUpload**(): `boolean`

Checks to see if another item can be uploaded. This should only be called once per item.

#### Returns

`boolean`

If the item is allowed to be uploaded.

#### Defined in

[pixijs/packages/prepare/src/CountLimiter.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/CountLimiter.ts#L33)

___

### beginFrame

▸ **beginFrame**(): `void`

Resets any counting properties to start fresh on a new frame.

#### Returns

`void`

#### Defined in

[pixijs/packages/prepare/src/CountLimiter.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/CountLimiter.ts#L24)
