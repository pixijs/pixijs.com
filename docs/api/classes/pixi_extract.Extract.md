---
id: "pixi_extract.Extract"
title: "Class: Extract"
sidebar_label: "Extract"
custom_edit_url: null
---

[@pixi/extract](../modules/pixi_extract.md).Extract

This class provides renderer-specific plugins for exporting content from a renderer.
For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).

Do not instantiate these plugins directly. It is available from the `renderer.plugins` property.
See PIXI.CanvasRenderer#plugins or PIXI.Renderer#plugins.

**`Example`**

```ts
import { Application, Graphics } from 'pixi.js';

// Create a new app (will auto-add extract plugin to renderer)
const app = new Application();

// Draw a red circle
const graphics = new Graphics()
    .beginFill(0xFF0000)
    .drawCircle(0, 0, 50);

// Render the graphics as an HTMLImageElement
const image = app.renderer.plugins.image(graphics);
document.body.appendChild(image);
```

**`Memberof`**

PIXI

## Implements

- `ISystem`

## Constructors

### constructor

• **new Extract**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | A reference to the current renderer |

#### Defined in

[pixijs/packages/extract/src/Extract.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L45)

## Methods

### base64

▸ **base64**(`target`, `format?`, `quality?`): `Promise`<`string`\>

Will return a base64 encoded string of this target. It works by calling
 `Extract.getCanvas` and then running toDataURL on that.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `format?` | `string` | Image format, e.g. "image/jpeg" or "image/webp". |
| `quality?` | `number` | JPEG or Webp compression from 0 to 1. Default is 0.92. |

#### Returns

`Promise`<`string`\>

- A base64 encoded string of the texture.

#### Defined in

[pixijs/packages/extract/src/Extract.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L76)

___

### canvas

▸ **canvas**(`target`, `frame?`): `ICanvas`

Creates a Canvas element, renders this target to it and then returns it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `frame?` | `Rectangle` | The frame the extraction is restricted to. |

#### Returns

`ICanvas`

- A Canvas element with the texture rendered on.

#### Defined in

[pixijs/packages/extract/src/Extract.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L107)

___

### destroy

▸ **destroy**(): `void`

Destroys the extract.

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Defined in

[pixijs/packages/extract/src/Extract.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L277)

___

### image

▸ **image**(`target`, `format?`, `quality?`): `Promise`<`HTMLImageElement`\>

Will return a HTML Image of the target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `format?` | `string` | Image format, e.g. "image/jpeg" or "image/webp". |
| `quality?` | `number` | JPEG or Webp compression from 0 to 1. Default is 0.92. |

#### Returns

`Promise`<`HTMLImageElement`\>

- HTML Image of the target

#### Defined in

[pixijs/packages/extract/src/Extract.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L58)

___

### pixels

▸ **pixels**(`target?`, `frame?`): `Uint8Array`

Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
order, with integer values between 0 and 255 (included).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target?` | `RenderTexture` \| `DisplayObject` | A displayObject or renderTexture to convert. If left empty will use the main renderer |
| `frame?` | `Rectangle` | The frame the extraction is restricted to. |

#### Returns

`Uint8Array`

- One-dimensional array containing the pixel data of the entire texture

#### Defined in

[pixijs/packages/extract/src/Extract.ts:208](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/src/Extract.ts#L208)
