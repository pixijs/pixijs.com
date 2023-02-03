---
id: "pixi_core.StateSystem"
title: "Class: StateSystem"
sidebar_label: "StateSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).StateSystem

System plugin to the renderer to manage WebGL state machines.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new StateSystem**()

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L78)

## Properties

### blendMode

• `Readonly` **blendMode**: [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

Blend mode

**`Default`**

PIXI.BLEND_MODES.NONE

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L46)

___

### polygonOffset

• `Readonly` **polygonOffset**: `number`

Polygon offset

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L39)

___

### stateId

• `Readonly` **stateId**: `number`

State ID

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L33)

## Methods

### contextChange

▸ **contextChange**(`gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | [`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L103)

___

### forceState

▸ **forceState**(`state`): `void`

Sets the state, when previous state is unknown.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`State`](pixi_core.State.md) | The state to set |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:157](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L157)

___

### reset

▸ **reset**(): `void`

Resets all the logic and disables the VAOs.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:278](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L278)

___

### set

▸ **set**(`state`): `void`

Sets the current state

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`State`](pixi_core.State.md) | The state to set. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L118)

___

### setBlend

▸ **setBlend**(`value`): `void`

Sets whether to enable or disable blending.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Turn on or off WebGl blending. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:176](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L176)

___

### setBlendMode

▸ **setBlendMode**(`value`): `void`

Sets the blend mode.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | The blend mode to set to. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:234](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L234)

___

### setCullFace

▸ **setCullFace**(`value`): `void`

Sets whether to enable or disable cull face.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Turn on or off webgl cull face. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:216](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L216)

___

### setDepthMask

▸ **setDepthMask**(`value`): `void`

Sets whether to enable or disable depth mask.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Turn on or off webgl depth mask. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:207](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L207)

___

### setDepthTest

▸ **setDepthTest**(`value`): `void`

Sets whether to enable or disable depth test.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Turn on or off webgl depth testing. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:198](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L198)

___

### setFrontFace

▸ **setFrontFace**(`value`): `void`

Sets the gl front face.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | true is clockwise and false is counter-clockwise |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:225](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L225)

___

### setOffset

▸ **setOffset**(`value`): `void`

Sets whether to enable or disable polygon offset fill.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `boolean` | Turn on or off webgl polygon offset testing. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:187](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L187)

___

### setPolygonOffset

▸ **setPolygonOffset**(`value`, `scale`): `void`

Sets the polygon offset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | the polygon offset |
| `scale` | `number` | the polygon offset scale |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:271](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L271)

___

### updateCheck

▸ **updateCheck**(`func`, `value`): `void`

Checks to see which updates should be checked based on which settings have been activated.

For example, if blend is enabled then we should check the blend modes each time the state is changed
or if polygon fill is activated then we need to check if the polygon offset changes.
The idea is that we only check what we have too.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | (`system`: [`StateSystem`](pixi_core.StateSystem.md), `state`: [`State`](pixi_core.State.md)) => `void` | the checking function to add or remove |
| `value` | `boolean` | should the check function be added or removed. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/StateSystem.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/StateSystem.ts#L298)
