---
id: "pixi_canvas_extract.CanvasExtract"
title: "Class: CanvasExtract"
sidebar_label: "CanvasExtract"
custom_edit_url: null
---

[@pixi/canvas-extract](../modules/pixi_canvas_extract.md).CanvasExtract

The extract manager provides functionality to export content from the renderers.

An instance of this class is automatically created by default, and can be found at `renderer.extract`

**`Memberof`**

PIXI

## Implements

- `ISystem`

## Constructors

### constructor

• **new CanvasExtract**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `CanvasRenderer` | A reference to the current renderer |

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L30)

## Properties

### renderer

• **renderer**: `CanvasRenderer`

A reference to the current renderer

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L25)

## Methods

### base64

▸ **base64**(`target?`, `format?`, `quality?`): `Promise`<`string`\>

Will return a base64 encoded string of this target. It works by calling
 `CanvasExtract.getCanvas` and then running toDataURL on that.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target?` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `format?` | `string` | Image format, e.g. "image/jpeg" or "image/webp". |
| `quality?` | `number` | JPEG or Webp compression from 0 to 1. Default is 0.92. |

#### Returns

`Promise`<`string`\>

A base64 encoded string of the texture.

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L61)

___

### canvas

▸ **canvas**(`target?`, `frame?`): `ICanvas`

Creates a Canvas element, renders this target to it and then returns it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target?` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `frame?` | `Rectangle` | The frame the extraction is restricted to. |

#### Returns

`ICanvas`

A Canvas element with the texture rendered on.

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L92)

___

### destroy

▸ **destroy**(): `void`

Destroys the extract

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:199](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L199)

___

### image

▸ **image**(`target?`, `format?`, `quality?`): `Promise`<`HTMLImageElement`\>

Will return a HTML Image of the target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target?` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `format?` | `string` | Image format, e.g. "image/jpeg" or "image/webp". |
| `quality?` | `number` | JPEG or Webp compression from 0 to 1. Default is 0.92. |

#### Returns

`Promise`<`HTMLImageElement`\>

HTML Image of the target

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L43)

___

### pixels

▸ **pixels**(`target?`, `frame?`): `Uint8ClampedArray`

Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
order, with integer values between 0 and 255 (included).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target?` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `frame?` | `Rectangle` | The frame the extraction is restricted to. |

#### Returns

`Uint8ClampedArray`

One-dimensional array containing the pixel data of the entire texture

#### Defined in

[pixijs/packages/canvas-extract/src/CanvasExtract.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/src/CanvasExtract.ts#L152)
