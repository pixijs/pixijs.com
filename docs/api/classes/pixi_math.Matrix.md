---
id: "pixi_math.Matrix"
title: "Class: Matrix"
sidebar_label: "Matrix"
custom_edit_url: null
---

[@pixi/math](../modules/pixi_math.md).Matrix

The PixiJS Matrix as a class makes it a lot faster.

Here is a representation of it:
```
| a | c | tx|
| b | d | ty|
| 0 | 0 | 1 |
```

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Matrix**(`a?`, `b?`, `c?`, `d?`, `tx?`, `ty?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `number` | `1` | x scale |
| `b` | `number` | `0` | y skew |
| `c` | `number` | `0` | x skew |
| `d` | `number` | `1` | y scale |
| `tx` | `number` | `0` | x translation |
| `ty` | `number` | `0` | y translation |

#### Defined in

[pixijs/packages/math/src/Matrix.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L48)

## Properties

### a

• **a**: `number`

**`Default`**

1

#### Defined in

[pixijs/packages/math/src/Matrix.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L21)

___

### array

• **array**: `Float32Array` = `null`

#### Defined in

[pixijs/packages/math/src/Matrix.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L38)

___

### b

• **b**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/Matrix.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L24)

___

### c

• **c**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/Matrix.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L27)

___

### d

• **d**: `number`

**`Default`**

1

#### Defined in

[pixijs/packages/math/src/Matrix.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L30)

___

### tx

• **tx**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/Matrix.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L33)

___

### ty

• **ty**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/Matrix.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L36)

## Accessors

### IDENTITY

• `Static` `get` **IDENTITY**(): [`Matrix`](pixi_math.Matrix.md)

A default (identity) matrix

#### Returns

[`Matrix`](pixi_math.Matrix.md)

#### Defined in

[pixijs/packages/math/src/Matrix.ts:462](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L462)

___

### TEMP\_MATRIX

• `Static` `get` **TEMP_MATRIX**(): [`Matrix`](pixi_math.Matrix.md)

A temp matrix

#### Returns

[`Matrix`](pixi_math.Matrix.md)

#### Defined in

[pixijs/packages/math/src/Matrix.ts:471](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L471)

## Methods

### append

▸ **append**(`matrix`): [`Matrix`](pixi_math.Matrix.md)

Appends the given Matrix to this Matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](pixi_math.Matrix.md) | The matrix to append. |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:247](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L247)

___

### apply

▸ **apply**<`P`\>(`pos`, `newPos?`): `P`

Get a new position with the current transformation applied.
Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends [`IPointData`](../interfaces/pixi_math.IPointData.md) = [`Point`](pixi_math.Point.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | [`IPointData`](../interfaces/pixi_math.IPointData.md) | The origin |
| `newPos?` | `P` | The point that the new position is assigned to (allowed to be same as input) |

#### Returns

`P`

The new point, transformed through this matrix

#### Defined in

[pixijs/packages/math/src/Matrix.ts:151](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L151)

___

### applyInverse

▸ **applyInverse**<`P`\>(`pos`, `newPos?`): `P`

Get a new position with the inverse of the current transformation applied.
Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends [`IPointData`](../interfaces/pixi_math.IPointData.md) = [`Point`](pixi_math.Point.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | [`IPointData`](../interfaces/pixi_math.IPointData.md) | The origin |
| `newPos?` | `P` | The point that the new position is assigned to (allowed to be same as input) |

#### Returns

`P`

The new point, inverse-transformed through this matrix

#### Defined in

[pixijs/packages/math/src/Matrix.ts:171](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L171)

___

### clone

▸ **clone**(): [`Matrix`](pixi_math.Matrix.md)

Creates a new Matrix object with the same values as this one.

#### Returns

[`Matrix`](pixi_math.Matrix.md)

A copy of this matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L403)

___

### copyFrom

▸ **copyFrom**(`matrix`): [`Matrix`](pixi_math.Matrix.md)

Changes the values of the matrix to be the same as the ones in given matrix

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](pixi_math.Matrix.md) | The matrix to copy from. |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

this

#### Defined in

[pixijs/packages/math/src/Matrix.ts:439](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L439)

___

### copyTo

▸ **copyTo**(`matrix`): [`Matrix`](pixi_math.Matrix.md)

Changes the values of the given matrix to be the same as the ones in this matrix

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](pixi_math.Matrix.md) | The matrix to copy to. |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

The matrix given in parameter with its values updated.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:422](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L422)

___

### decompose

▸ **decompose**(`transform`): [`Transform`](pixi_math.Transform.md)

Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | [`Transform`](pixi_math.Transform.md) | The transform to apply the properties to. |

#### Returns

[`Transform`](pixi_math.Transform.md)

The transform with the newly applied properties

#### Defined in

[pixijs/packages/math/src/Matrix.ts:323](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L323)

___

### fromArray

▸ **fromArray**(`array`): `void`

Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:

a = array[0]
b = array[1]
c = array[3]
d = array[4]
tx = array[2]
ty = array[5]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `number`[] | The array that the matrix will be populated from. |

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/Matrix.ts:69](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L69)

___

### identity

▸ **identity**(): [`Matrix`](pixi_math.Matrix.md)

Resets this Matrix to an identity (default) matrix.

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:387](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L387)

___

### invert

▸ **invert**(): [`Matrix`](pixi_math.Matrix.md)

Inverts this matrix

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:364](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L364)

___

### prepend

▸ **prepend**(`matrix`): [`Matrix`](pixi_math.Matrix.md)

Prepends the given Matrix to this Matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](pixi_math.Matrix.md) | The matrix to prepend |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:297](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L297)

___

### rotate

▸ **rotate**(`angle`): [`Matrix`](pixi_math.Matrix.md)

Applies a rotation transformation to the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `angle` | `number` | The angle in radians. |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L223)

___

### scale

▸ **scale**(`x`, `y`): [`Matrix`](pixi_math.Matrix.md)

Applies a scale transformation to the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The amount to scale horizontally |
| `y` | `number` | The amount to scale vertically |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:206](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L206)

___

### set

▸ **set**(`a`, `b`, `c`, `d`, `tx`, `ty`): [`Matrix`](pixi_math.Matrix.md)

Sets the matrix properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | Matrix component |
| `b` | `number` | Matrix component |
| `c` | `number` | Matrix component |
| `d` | `number` | Matrix component |
| `tx` | `number` | Matrix component |
| `ty` | `number` | Matrix component |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L89)

___

### setTransform

▸ **setTransform**(`x`, `y`, `pivotX`, `pivotY`, `scaleX`, `scaleY`, `rotation`, `skewX`, `skewY`): [`Matrix`](pixi_math.Matrix.md)

Sets the matrix based on all the available properties

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | Position on the x axis |
| `y` | `number` | Position on the y axis |
| `pivotX` | `number` | Pivot on the x axis |
| `pivotY` | `number` | Pivot on the y axis |
| `scaleX` | `number` | Scale on the x axis |
| `scaleY` | `number` | Scale on the y axis |
| `rotation` | `number` | Rotation in radians |
| `skewX` | `number` | Skew on the x axis |
| `skewY` | `number` | Skew on the y axis |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:278](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L278)

___

### toArray

▸ **toArray**(`transpose`, `out?`): `Float32Array`

Creates an array from the current Matrix object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transpose` | `boolean` | Whether we need to transpose the matrix or not |
| `out?` | `Float32Array` | - |

#### Returns

`Float32Array`

The newly created array which contains the matrix

#### Defined in

[pixijs/packages/math/src/Matrix.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L107)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/Matrix.ts:452](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L452)

___

### translate

▸ **translate**(`x`, `y`): [`Matrix`](pixi_math.Matrix.md)

Translates the matrix on the x and y.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | How much to translate x by |
| `y` | `number` | How much to translate y by |

#### Returns

[`Matrix`](pixi_math.Matrix.md)

This matrix. Good for chaining method calls.

#### Defined in

[pixijs/packages/math/src/Matrix.ts:192](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Matrix.ts#L192)
