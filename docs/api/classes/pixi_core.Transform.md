---
id: "pixi_core.Transform"
title: "Class: Transform"
sidebar_label: "Transform"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Transform

Transform that takes care about its versions.

**`Memberof`**

PIXI

## Hierarchy

- `Transform`

  ↳ **`Transform`**

## Constructors

### constructor

• **new Transform**()

#### Inherited from

GlobalMixins.Transform.constructor

#### Defined in

[pixijs/packages/math/src/Transform.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L73)

## Properties

### \_parentID

• **\_parentID**: `number`

The locally unique ID of the parent's world transform used to calculate the current world transformation matrix.

#### Defined in

[pixijs/packages/math/src/Transform.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L35)

___

### \_worldID

• **\_worldID**: `number`

The locally unique ID of the world transform.

#### Defined in

[pixijs/packages/math/src/Transform.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L38)

___

### localTransform

• **localTransform**: [`Matrix`](pixi_core.Matrix.md)

The local transformation matrix.

#### Defined in

[pixijs/packages/math/src/Transform.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L20)

___

### pivot

• **pivot**: [`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

The pivot point of the displayObject that it rotates around.

#### Defined in

[pixijs/packages/math/src/Transform.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L29)

___

### position

• **position**: [`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

The coordinate of the object relative to the local coordinates of the parent.

#### Defined in

[pixijs/packages/math/src/Transform.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L23)

___

### scale

• **scale**: [`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

The scale factor of the object.

#### Defined in

[pixijs/packages/math/src/Transform.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L26)

___

### skew

• **skew**: [`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

The skew amount, on the x and y axis.

#### Defined in

[pixijs/packages/math/src/Transform.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L32)

___

### worldTransform

• **worldTransform**: [`Matrix`](pixi_core.Matrix.md)

The world transformation matrix.

#### Defined in

[pixijs/packages/math/src/Transform.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L17)

___

### IDENTITY

▪ `Static` `Readonly` **IDENTITY**: [`Transform`](pixi_core.Transform.md)

A default (identity) transform.

#### Defined in

[pixijs/packages/math/src/Transform.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L14)

## Accessors

### rotation

• `get` **rotation**(): `number`

The rotation of the object in radians.

#### Returns

`number`

#### Defined in

[pixijs/packages/math/src/Transform.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L200)

• `set` **rotation**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/Transform.ts:205](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L205)

## Methods

### setFromMatrix

▸ **setFromMatrix**(`matrix`): `void`

Decomposes a matrix and sets the transforms properties based on it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](pixi_core.Matrix.md) | The matrix to decompose |

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/Transform.ts:193](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L193)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/Transform.ts:112](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L112)

___

### updateLocalTransform

▸ **updateLocalTransform**(): `void`

Updates the local transformation matrix.

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/Transform.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L124)

___

### updateTransform

▸ **updateTransform**(`parentTransform`): `void`

Updates the local and the world transformation matrices.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentTransform` | [`Transform`](pixi_core.Transform.md) | The parent transform |

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/Transform.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Transform.ts#L149)
