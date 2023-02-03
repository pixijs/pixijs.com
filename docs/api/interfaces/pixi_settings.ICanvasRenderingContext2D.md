---
id: "pixi_settings.ICanvasRenderingContext2D"
title: "Interface: ICanvasRenderingContext2D"
sidebar_label: "ICanvasRenderingContext2D"
custom_edit_url: null
---

[@pixi/settings](../modules/pixi_settings.md).ICanvasRenderingContext2D

Common interface for CanvasRenderingContext2D, OffscreenCanvasRenderingContext2D, and other custom canvas 2D context.

**`Memberof`**

PIXI

## Hierarchy

- `CanvasState`

- `CanvasTransform`

- `CanvasCompositing`

- `CanvasImageSmoothing`

- `CanvasFillStrokeStyles`

- `CanvasShadowStyles`

- `CanvasFilters`

- `CanvasRect`

- `CanvasDrawPath`

- `CanvasText`

- `CanvasDrawImage`

- `CanvasImageData`

- `CanvasPathDrawingStyles`

- `CanvasTextDrawingStyles`

- `CanvasPath`

  ↳ **`ICanvasRenderingContext2D`**

## Properties

### letterSpacing

• `Optional` **letterSpacing**: `string`

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L31)

___

### textLetterSpacing

• `Optional` **textLetterSpacing**: `string`

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L32)

## Methods

### createPattern

▸ **createPattern**(`image`, `repetition`): `CanvasPattern`

#### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `CanvasImageSource` \| [`ICanvas`](pixi_settings.ICanvas.md) |
| `repetition` | `string` |

#### Returns

`CanvasPattern`

#### Overrides

CanvasFillStrokeStyles.createPattern

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L24)

___

### drawImage

▸ **drawImage**(`image`, `dx`, `dy`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `CanvasImageSource` \| [`ICanvas`](pixi_settings.ICanvas.md) |
| `dx` | `number` |
| `dy` | `number` |

#### Returns

`void`

#### Overrides

CanvasDrawImage.drawImage

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L26)

▸ **drawImage**(`image`, `dx`, `dy`, `dw`, `dh`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `CanvasImageSource` \| [`ICanvas`](pixi_settings.ICanvas.md) |
| `dx` | `number` |
| `dy` | `number` |
| `dw` | `number` |
| `dh` | `number` |

#### Returns

`void`

#### Overrides

CanvasDrawImage.drawImage

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L27)

▸ **drawImage**(`image`, `sx`, `sy`, `sw`, `sh`, `dx`, `dy`, `dw`, `dh`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `image` | `CanvasImageSource` \| [`ICanvas`](pixi_settings.ICanvas.md) |
| `sx` | `number` |
| `sy` | `number` |
| `sw` | `number` |
| `sh` | `number` |
| `dx` | `number` |
| `dy` | `number` |
| `dw` | `number` |
| `dh` | `number` |

#### Returns

`void`

#### Overrides

CanvasDrawImage.drawImage

#### Defined in

[pixijs/packages/settings/src/ICanvasRenderingContext2D.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvasRenderingContext2D.ts#L28)
