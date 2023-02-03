---
id: "pixi_math_extras"
title: "Module: @pixi/math-extras"
sidebar_label: "@pixi/math-extras"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### floatEqual

▸ **floatEqual**(`a`, `b`): `boolean`

The idea of a relative epsilon comparison is to find the difference between the two numbers,
and see if it is less than `Math.EPSILON`.

_Note: Only available with **@pixi/math-extras**._

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | First floating number to compare. |
| `b` | `number` | Second floating number to compare. |

#### Returns

`boolean`

Returns `true` if the difference between the values is less than `Math.EPSILON`; otherwise `false`.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L17)

▸ **floatEqual**(`a`, `b`, `epsilon`): `boolean`

The idea of a relative epsilon comparison is to find the difference between the two numbers,
and see if it is less than a given epsilon.
A good epsilon would be the N% of the largest of the two values or `Math.EPSILON`.

_Note: Only available with **@pixi/math-extras**._

**`Memberof`**

PIXI

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | First floating number to compare. |
| `b` | `number` | Second floating number to compare. |
| `epsilon` | `number` | The epsilon to compare to. The larger the epsilon, the easier for the numbers to be considered equals. |

#### Returns

`boolean`

Returns `true` if the difference between the values is less than the given epsilon;
otherwise `false`.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L32)

___

### lineIntersection

▸ **lineIntersection**(`aStart`, `aEnd`, `bStart`, `bEnd`): `Point`

Computes the point where non-coincident and non-parallel Lines intersect.
Coincident or parallel lines return a `NaN` point `{x: NaN, y: NaN}`.
The intersection point may land outside the extents of the lines.

_Note: Only available with **@pixi/math-extras**._

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aStart` | `IPointData` | First point of the first line. |
| `aEnd` | `IPointData` | Second point of the first line. |
| `bStart` | `IPointData` | First point of the second line. |
| `bEnd` | `IPointData` | Second point of the second line. |

#### Returns

`Point`

The point where the lines intersect.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:122](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L122)

▸ **lineIntersection**<`T`\>(`aStart`, `aEnd`, `bStart`, `bEnd`, `outPoint`): `T`

Computes the point where non-coincident and non-parallel Lines intersect.
Coincident or parallel lines return a `NaN` point `{x: NaN, y: NaN}`.
The intersection point may land outside the extents of the lines.

_Note: Only available with **@pixi/math-extras**._

**`Memberof`**

PIXI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `IPointData` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aStart` | `IPointData` | First point of the first line. |
| `aEnd` | `IPointData` | Second point of the first line. |
| `bStart` | `IPointData` | First point of the second line. |
| `bEnd` | `IPointData` | Second point of the second line. |
| `outPoint` | `T` | A Point-like object in which to store the value, optional (otherwise will create a new Point). |

#### Returns

`T`

The point where the lines intersect or a `NaN` Point.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L138)

___

### segmentIntersection

▸ **segmentIntersection**(`aStart`, `aEnd`, `bStart`, `bEnd`): `Point`

Computes the point where non-coincident and non-parallel segments intersect.
Coincident, parallel or non-intersecting segments return a `NaN` point `{x: NaN, y: NaN}`.
The intersection point must land inside the extents of the segments or return a `NaN` Point.

_Note: Only available with **@pixi/math-extras**._

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aStart` | `IPointData` | Starting point of the first segment. |
| `aEnd` | `IPointData` | Ending point of the first segment. |
| `bStart` | `IPointData` | Starting point of the second segment. |
| `bEnd` | `IPointData` | Ending point of the second segment. |

#### Returns

`Point`

The point where the segments intersect.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:158](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L158)

▸ **segmentIntersection**<`T`\>(`aStart`, `aEnd`, `bStart`, `bEnd`, `outPoint`): `T`

Computes the point where non-coincident and non-parallel segments intersect.
Coincident, parallel or non-intersecting segments return a `NaN` point `{x: NaN, y: NaN}`.
The intersection point must land inside the extents of the segments or return a `NaN` Point.

_Note: Only available with **@pixi/math-extras**._

**`Memberof`**

PIXI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `IPointData` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `aStart` | `IPointData` | Starting point of the first segment. |
| `aEnd` | `IPointData` | Ending point of the first segment. |
| `bStart` | `IPointData` | Starting point of the second segment. |
| `bEnd` | `IPointData` | Ending point of the second segment. |
| `outPoint` | `T` | A Point-like object in which to store the value, optional (otherwise will create a new Point). |

#### Returns

`T`

The point where the segments intersect or a `NaN` Point.

#### Defined in

[pixijs/packages/math-extras/src/index.ts:174](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/src/index.ts#L174)
