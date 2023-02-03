---
id: "pixi_core.State"
title: "Class: State"
sidebar_label: "State"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).State

This is a WebGL state, and is is passed to PIXI.StateSystem.

Each mesh rendered may require WebGL to be in a different state.
For example you may want different blend mode or to enable polygon offsets

**`Memberof`**

PIXI

## Constructors

### constructor

• **new State**()

#### Defined in

[pixijs/packages/core/src/state/State.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L25)

## Properties

### \_blendMode

• **\_blendMode**: [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

#### Defined in

[pixijs/packages/core/src/state/State.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L22)

___

### \_polygonOffset

• **\_polygonOffset**: `number`

#### Defined in

[pixijs/packages/core/src/state/State.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L23)

___

### data

• **data**: `number`

#### Defined in

[pixijs/packages/core/src/state/State.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L21)

## Accessors

### blend

• `get` **blend**(): `boolean`

Activates blending of the computed fragment color values.

**`Default`**

true

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L41)

• `set` **blend**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L46)

___

### blendMode

• `get` **blendMode**(): [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
Setting this mode to anything other than NO_BLEND will automatically switch blending on.

**`Default`**

PIXI.BLEND_MODES.NORMAL

#### Returns

[`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

#### Defined in

[pixijs/packages/core/src/state/State.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L144)

• `set` **blendMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L149)

___

### clockwiseFrontFace

• `get` **clockwiseFrontFace**(): `boolean`

Specifies whether or not front or back-facing polygons can be culled.

**`Default`**

false

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L126)

• `set` **clockwiseFrontFace**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L131)

___

### culling

• `get` **culling**(): `boolean`

Activates culling of polygons.

**`Default`**

false

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L75)

• `set` **culling**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L80)

___

### depthMask

• `get` **depthMask**(): `boolean`

Enables or disables writing to the depth buffer.

**`Default`**

true

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L109)

• `set` **depthMask**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:114](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L114)

___

### depthTest

• `get` **depthTest**(): `boolean`

Activates depth comparisons and updates to the depth buffer.

**`Default`**

false

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L92)

• `set` **depthTest**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L97)

___

### offsets

• `get` **offsets**(): `boolean`

Activates adding an offset to depth values of polygon's fragments

**`Default`**

false

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/state/State.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L58)

• `set` **offsets**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L63)

___

### polygonOffset

• `get` **polygonOffset**(): `number`

The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.

**`Default`**

0

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/state/State.ts:159](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L159)

• `set` **polygonOffset**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/state/State.ts:164](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L164)

## Methods

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/state/State.ts:171](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L171)

___

### for2d

▸ `Static` **for2d**(): [`State`](pixi_core.State.md)

#### Returns

[`State`](pixi_core.State.md)

#### Defined in

[pixijs/packages/core/src/state/State.ts:183](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/state/State.ts#L183)
