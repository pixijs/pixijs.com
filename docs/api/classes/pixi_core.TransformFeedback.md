---
id: "pixi_core.TransformFeedback"
title: "Class: TransformFeedback"
sidebar_label: "TransformFeedback"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).TransformFeedback

A TransformFeedback object wrapping GLTransformFeedback object.

For example you can use TransformFeedback object to feed-back buffer data from Shader having TransformFeedbackVaryings.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new TransformFeedback**()

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L19)

## Properties

### \_glTransformFeedbacks

• **\_glTransformFeedbacks**: `Object`

#### Index signature

▪ [key: `number`]: `WebGLTransformFeedback`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L13)

___

### buffers

• **buffers**: [`Buffer`](pixi_core.Buffer.md)[]

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L15)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L17)

## Methods

### bindBuffer

▸ **bindBuffer**(`index`, `buffer`): `void`

Bind buffer to TransformFeedback

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | index to bind |
| `buffer` | [`Buffer`](pixi_core.Buffer.md) | buffer to bind |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L31)

___

### destroy

▸ **destroy**(): `void`

Destroy WebGL resources that are connected to this TransformFeedback.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedback.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedback.ts#L37)
