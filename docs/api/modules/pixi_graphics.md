---
id: "pixi_graphics"
title: "Module: @pixi/graphics"
sidebar_label: "@pixi/graphics"
sidebar_position: 0
custom_edit_url: null
---

## Enumerations

- [LINE\_CAP](../enums/pixi_graphics.LINE_CAP.md)
- [LINE\_JOIN](../enums/pixi_graphics.LINE_JOIN.md)

## Classes

- [FillStyle](../classes/pixi_graphics.FillStyle.md)
- [Graphics](../classes/pixi_graphics.Graphics.md)
- [GraphicsData](../classes/pixi_graphics.GraphicsData.md)
- [GraphicsGeometry](../classes/pixi_graphics.GraphicsGeometry.md)
- [LineStyle](../classes/pixi_graphics.LineStyle.md)

## Interfaces

- [IFillStyleOptions](../interfaces/pixi_graphics.IFillStyleOptions.md)
- [IGraphicsBatchElement](../interfaces/pixi_graphics.IGraphicsBatchElement.md)
- [IGraphicsCurvesSettings](../interfaces/pixi_graphics.IGraphicsCurvesSettings.md)
- [ILineStyleOptions](../interfaces/pixi_graphics.ILineStyleOptions.md)

## Variables

### GRAPHICS\_CURVES

• `Const` `Readonly` **GRAPHICS\_CURVES**: `Object` = `curves`

**`Static`**

**`Memberof`**

PIXI

**`Name`**

GRAPHICS_CURVES

**`Deprecated`**

since 7.1.0

**`See`**

PIXI.Graphics.curves

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adaptive` | `boolean` |
| `epsilon` | `number` |
| `maxLength` | `number` |
| `maxSegments` | `number` |
| `minSegments` | `number` |
| `_segmentsCount` | (`length`: `number`, `defaultSegments`: `number`) => `number` |

#### Defined in

[pixijs/packages/graphics/src/const.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/const.ts#L95)

___

### graphicsUtils

• `Const` **graphicsUtils**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ArcUtils` | typeof `ArcUtils` |
| `BATCH_POOL` | `BatchPart`[] |
| `BatchPart` | typeof `BatchPart` |
| `BezierUtils` | typeof `BezierUtils` |
| `DRAW_CALL_POOL` | `BatchDrawCall`[] |
| `FILL_COMMANDS` | `Record`<`SHAPES`, `IShapeBuildCommand`\> |
| `QuadraticUtils` | typeof `QuadraticUtils` |
| `buildCircle` | `IShapeBuildCommand` |
| `buildLine` |  |
| `buildPoly` | `IShapeBuildCommand` |
| `buildRectangle` | `IShapeBuildCommand` |
| `buildRoundedRectangle` | `IShapeBuildCommand` |

#### Defined in

[pixijs/packages/graphics/src/index.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/index.ts#L28)
