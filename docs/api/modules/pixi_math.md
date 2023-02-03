---
id: "pixi_math"
title: "Module: @pixi/math"
sidebar_label: "@pixi/math"
sidebar_position: 0
custom_edit_url: null
---

## Enumerations

- [SHAPES](../enums/pixi_math.SHAPES.md)

## Classes

- [Circle](../classes/pixi_math.Circle.md)
- [Ellipse](../classes/pixi_math.Ellipse.md)
- [Matrix](../classes/pixi_math.Matrix.md)
- [ObservablePoint](../classes/pixi_math.ObservablePoint.md)
- [Point](../classes/pixi_math.Point.md)
- [Polygon](../classes/pixi_math.Polygon.md)
- [Rectangle](../classes/pixi_math.Rectangle.md)
- [RoundedRectangle](../classes/pixi_math.RoundedRectangle.md)
- [Transform](../classes/pixi_math.Transform.md)

## Interfaces

- [IPoint](../interfaces/pixi_math.IPoint.md)
- [IPointData](../interfaces/pixi_math.IPointData.md)
- [ISize](../interfaces/pixi_math.ISize.md)

## Type Aliases

### IShape

Ƭ **IShape**: [`Circle`](../classes/pixi_math.Circle.md) \| [`Ellipse`](../classes/pixi_math.Ellipse.md) \| [`Polygon`](../classes/pixi_math.Polygon.md) \| [`Rectangle`](../classes/pixi_math.Rectangle.md) \| [`RoundedRectangle`](../classes/pixi_math.RoundedRectangle.md)

#### Defined in

[pixijs/packages/math/src/index.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/index.ts#L31)

## Variables

### DEG\_TO\_RAD

• `Const` **DEG\_TO\_RAD**: `number`

Conversion factor for converting degrees to radians.

**`Static`**

**`Member`**

**`Memberof`**

PIXI

#### Defined in

[pixijs/packages/math/src/const.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/const.ts#L23)

___

### PI\_2

• `Const` **PI\_2**: `number`

Two Pi.

**`Static`**

**`Member`**

**`Memberof`**

PIXI

#### Defined in

[pixijs/packages/math/src/const.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/const.ts#L7)

___

### RAD\_TO\_DEG

• `Const` **RAD\_TO\_DEG**: `number`

Conversion factor for converting radians to degrees.

**`Static`**

**`Member`**

RAD_TO_DEG

**`Memberof`**

PIXI

#### Defined in

[pixijs/packages/math/src/const.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/const.ts#L15)

___

### groupD8

• `Const` **groupD8**: `Object`

Implements the dihedral group D8, which is similar to
[group D4][http://mathworld.wolfram.com/DihedralGroupD4.html](http://mathworld.wolfram.com/DihedralGroupD4.html);
D8 is the same but with diagonals, and it is used for texture
rotations.

The directions the U- and V- axes after rotation
of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
and `(vX(a), vY(a))`. These aren't necessarily unit vectors.

**Origin:**

 This is the small part of gameofbombs.com portal system. It works.

**`See`**

 - PIXI.groupD8.E
 - PIXI.groupD8.SE
 - PIXI.groupD8.S
 - PIXI.groupD8.SW
 - PIXI.groupD8.W
 - PIXI.groupD8.NW
 - PIXI.groupD8.N
 - PIXI.groupD8.NE

**`Author`**

Ivan

**`Ivanpopelyshev`**

**`Namespace`**

PIXI.groupD8

**`Memberof`**

PIXI

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `E` | `number` | \| Rotation \| Direction \| \|----------\|-----------\| \| 0° \| East \| |
| `MAIN_DIAGONAL` | `number` | Reflection about the main diagonal. |
| `MIRROR_HORIZONTAL` | `number` | Reflection about X-axis. |
| `MIRROR_VERTICAL` | `number` | Reflection about Y-axis. |
| `N` | `number` | \| Rotation \| Direction \| \|-------------\|--------------\| \| -90°/270°↻ \| North \| |
| `NE` | `number` | \| Rotation \| Direction \| \|-------------\|--------------\| \| -45°/315°↻ \| Northeast \| |
| `NW` | `number` | \| Rotation \| Direction \| \|-------------\|--------------\| \| -135°/225°↻ \| Northwest \| |
| `REVERSE_DIAGONAL` | `number` | Reflection about reverse diagonal. |
| `S` | `number` | \| Rotation \| Direction \| \|----------\|-----------\| \| 90°↻ \| South \| |
| `SE` | `number` | \| Rotation \| Direction \| \|----------\|-----------\| \| 45°↻ \| Southeast \| |
| `SW` | `number` | \| Rotation \| Direction \| \|----------\|-----------\| \| 135°↻ \| Southwest \| |
| `W` | `number` | \| Rotation \| Direction \| \|----------\|-----------\| \| 180° \| West \| |
| `add` | (`rotationSecond`: `number`, `rotationFirst`: `number`) => `number` | Composes the two D8 operations. Taking `^` as reflection: \| \| E=0 \| S=2 \| W=4 \| N=6 \| E^=8 \| S^=10 \| W^=12 \| N^=14 \| \|-------\|-----\|-----\|-----\|-----\|------\|-------\|-------\|-------\| \| E=0 \| E \| S \| W \| N \| E^ \| S^ \| W^ \| N^ \| \| S=2 \| S \| W \| N \| E \| S^ \| W^ \| N^ \| E^ \| \| W=4 \| W \| N \| E \| S \| W^ \| N^ \| E^ \| S^ \| \| N=6 \| N \| E \| S \| W \| N^ \| E^ \| S^ \| W^ \| \| E^=8 \| E^ \| N^ \| W^ \| S^ \| E \| N \| W \| S \| \| S^=10 \| S^ \| E^ \| N^ \| W^ \| S \| E \| N \| W \| \| W^=12 \| W^ \| S^ \| E^ \| N^ \| W \| S \| E \| N \| \| N^=14 \| N^ \| W^ \| S^ \| E^ \| N \| W \| S \| E \| [This is a Cayley table][https://en.wikipedia.org/wiki/Cayley_table](https://en.wikipedia.org/wiki/Cayley_table) |
| `byDirection` | (`dx`: `number`, `dy`: `number`) => `number` | Approximates the vector `V(dx,dy)` into one of the eight directions provided by `groupD8`. |
| `inv` | (`rotation`: `number`) => `number` |  |
| `isVertical` | (`rotation`: `number`) => `boolean` | Checks if the rotation angle is vertical, i.e. south or north. It doesn't work for reflections. |
| `matrixAppendRotationInv` | (`matrix`: [`Matrix`](../classes/pixi_math.Matrix.md), `rotation`: `number`, `tx`: `number`, `ty`: `number`) => `void` | Helps sprite to compensate texture packer rotation. |
| `rotate180` | (`rotation`: `number`) => `number` | Adds 180 degrees to rotation, which is a commutative operation. |
| `sub` | (`rotationSecond`: `number`, `rotationFirst`: `number`) => `number` | Reverse of `add`. |
| `uX` | (`ind`: `number`) => `number` |  |
| `uY` | (`ind`: `number`) => `number` |  |
| `vX` | (`ind`: `number`) => `number` |  |
| `vY` | (`ind`: `number`) => `number` |  |

#### Defined in

[pixijs/packages/math/src/groupD8.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/groupD8.ts#L115)
