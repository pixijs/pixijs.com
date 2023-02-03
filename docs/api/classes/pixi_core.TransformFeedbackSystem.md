---
id: "pixi_core.TransformFeedbackSystem"
title: "Class: TransformFeedbackSystem"
sidebar_label: "TransformFeedbackSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).TransformFeedbackSystem

TransformFeedbackSystem provides TransformFeedback of WebGL2
https://developer.mozilla.org/en-US/docs/Web/API/WebGLTransformFeedback

For example, you can use TransformFeedbackSystem to implement GPU Particle or
general purpose computing on GPU (aka GPGPU).

It also manages a lifetime of GLTransformFeedback object

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new TransformFeedbackSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L34)

## Properties

### CONTEXT\_UID

• **CONTEXT\_UID**: `number`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L26)

___

### gl

• **gl**: [`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md)

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L27)

## Methods

### beginTransformFeedback

▸ **beginTransformFeedback**(`drawMode`, `shader?`): `void`

Begin TransformFeedback

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `drawMode` | [`DRAW_MODES`](../enums/pixi_core.DRAW_MODES.md) | DrawMode for TransformFeedback |
| `shader?` | [`Shader`](pixi_core.Shader.md) | A Shader used by TransformFeedback. Current bound shader will be used if not provided. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L75)

___

### bind

▸ **bind**(`transformFeedback`): `void`

Bind TransformFeedback and buffers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformFeedback` | [`TransformFeedback`](pixi_core.TransformFeedback.md) | TransformFeedback to bind |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L52)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:178](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L178)

___

### disposeTransformFeedback

▸ **disposeTransformFeedback**(`tf`, `contextLost?`): `void`

Disposes TransfromFeedback

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tf` | [`TransformFeedback`](pixi_core.TransformFeedback.md) | TransformFeedback |
| `contextLost?` | `boolean` | If context was lost, we suppress delete TransformFeedback |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L131)

___

### endTransformFeedback

▸ **endTransformFeedback**(): `void`

End TransformFeedback

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L88)

___

### unbind

▸ **unbind**(): `void`

Unbind TransformFeedback

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/transformFeedback/TransformFeedbackSystem.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/transformFeedback/TransformFeedbackSystem.ts#L63)
