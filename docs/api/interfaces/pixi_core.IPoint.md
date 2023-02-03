---
id: "pixi_core.IPoint"
title: "Interface: IPoint"
sidebar_label: "IPoint"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IPoint

## Hierarchy

- [`IPointData`](pixi_core.IPointData.md)

  ↳ **`IPoint`**

  ↳↳ [`ObservablePoint`](../classes/pixi_core.ObservablePoint.md)

  ↳↳ [`Point`](../classes/pixi_core.Point.md)

## Implemented by

- [`ObservablePoint`](../classes/pixi_core.ObservablePoint.md)
- [`Point`](../classes/pixi_core.Point.md)

## Properties

### x

• **x**: `number`

#### Inherited from

[IPointData](pixi_core.IPointData.md).[x](pixi_core.IPointData.md#x)

#### Defined in

[pixijs/packages/math/src/IPointData.ts:3](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPointData.ts#L3)

___

### y

• **y**: `number`

#### Inherited from

[IPointData](pixi_core.IPointData.md).[y](pixi_core.IPointData.md#y)

#### Defined in

[pixijs/packages/math/src/IPointData.ts:4](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPointData.ts#L4)

## Methods

### copyFrom

▸ **copyFrom**(`p`): [`IPoint`](pixi_core.IPoint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`IPointData`](pixi_core.IPointData.md) |

#### Returns

[`IPoint`](pixi_core.IPoint.md)

#### Defined in

[pixijs/packages/math/src/IPoint.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPoint.ts#L5)

___

### copyTo

▸ **copyTo**<`T`\>(`p`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPoint`](pixi_core.IPoint.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `T` |

#### Returns

`T`

#### Defined in

[pixijs/packages/math/src/IPoint.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPoint.ts#L6)

___

### equals

▸ **equals**(`p`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`IPointData`](pixi_core.IPointData.md) |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/math/src/IPoint.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPoint.ts#L7)

___

### set

▸ **set**(`x?`, `y?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x?` | `number` |
| `y?` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/math/src/IPoint.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/IPoint.ts#L8)
