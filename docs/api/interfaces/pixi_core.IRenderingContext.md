---
id: "pixi_core.IRenderingContext"
title: "Interface: IRenderingContext"
sidebar_label: "IRenderingContext"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IRenderingContext

Mixed WebGL1/WebGL2 Rendering Context. Either its WebGL2, either its WebGL1 with PixiJS polyfills on it

## Hierarchy

- `WebGL2RenderingContext`

  ↳ **`IRenderingContext`**

## Methods

### texImage2D

▸ **texImage2D**(`target`, `level`, `internalformat`, `width`, `height`, `border`, `format`, `type`, `pixels`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `internalformat` | `number` |
| `width` | `number` |
| `height` | `number` |
| `border` | `number` |
| `format` | `number` |
| `type` | `number` |
| `pixels` | `ArrayBufferView` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L45)

▸ **texImage2D**(`target`, `level`, `internalformat`, `format`, `type`, `source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `internalformat` | `number` |
| `format` | `number` |
| `type` | `number` |
| `source` | `OffscreenCanvas` \| `ImageBitmap` \| `HTMLCanvasElement` \| `HTMLImageElement` \| `HTMLVideoElement` \| `ImageData` \| [`ICanvas`](pixi_core.ICanvas.md) |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L47)

▸ **texImage2D**(`target`, `level`, `internalformat`, `width`, `height`, `border`, `format`, `type`, `pboOffset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `internalformat` | `number` |
| `width` | `number` |
| `height` | `number` |
| `border` | `number` |
| `format` | `number` |
| `type` | `number` |
| `pboOffset` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L49)

▸ **texImage2D**(`target`, `level`, `internalformat`, `width`, `height`, `border`, `format`, `type`, `source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `internalformat` | `number` |
| `width` | `number` |
| `height` | `number` |
| `border` | `number` |
| `format` | `number` |
| `type` | `number` |
| `source` | `OffscreenCanvas` \| `ImageBitmap` \| `HTMLCanvasElement` \| `HTMLImageElement` \| `HTMLVideoElement` \| `ImageData` \| [`ICanvas`](pixi_core.ICanvas.md) |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L51)

▸ **texImage2D**(`target`, `level`, `internalformat`, `width`, `height`, `border`, `format`, `type`, `srcData`, `srcOffset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `internalformat` | `number` |
| `width` | `number` |
| `height` | `number` |
| `border` | `number` |
| `format` | `number` |
| `type` | `number` |
| `srcData` | `ArrayBufferView` |
| `srcOffset` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L53)

___

### texSubImage2D

▸ **texSubImage2D**(`target`, `level`, `xoffset`, `yoffset`, `width`, `height`, `format`, `type`, `pixels`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `format` | `number` |
| `type` | `number` |
| `pixels` | `ArrayBufferView` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L56)

▸ **texSubImage2D**(`target`, `level`, `xoffset`, `yoffset`, `format`, `type`, `source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `format` | `number` |
| `type` | `number` |
| `source` | `OffscreenCanvas` \| `ImageBitmap` \| `HTMLCanvasElement` \| `HTMLImageElement` \| `HTMLVideoElement` \| `ImageData` \| [`ICanvas`](pixi_core.ICanvas.md) |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L58)

▸ **texSubImage2D**(`target`, `level`, `xoffset`, `yoffset`, `width`, `height`, `format`, `type`, `pboOffset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `format` | `number` |
| `type` | `number` |
| `pboOffset` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L60)

▸ **texSubImage2D**(`target`, `level`, `xoffset`, `yoffset`, `width`, `height`, `format`, `type`, `source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `format` | `number` |
| `type` | `number` |
| `source` | `OffscreenCanvas` \| `ImageBitmap` \| `HTMLCanvasElement` \| `HTMLImageElement` \| `HTMLVideoElement` \| `ImageData` \| [`ICanvas`](pixi_core.ICanvas.md) |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L62)

▸ **texSubImage2D**(`target`, `level`, `xoffset`, `yoffset`, `width`, `height`, `format`, `type`, `srcData`, `srcOffset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `format` | `number` |
| `type` | `number` |
| `srcData` | `ArrayBufferView` |
| `srcOffset` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage2D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L64)

___

### texSubImage3D

▸ **texSubImage3D**(`target`, `level`, `xoffset`, `yoffset`, `zoffset`, `width`, `height`, `depth`, `format`, `type`, `pboOffset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `zoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `depth` | `number` |
| `format` | `number` |
| `type` | `number` |
| `pboOffset` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage3D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L67)

▸ **texSubImage3D**(`target`, `level`, `xoffset`, `yoffset`, `zoffset`, `width`, `height`, `depth`, `format`, `type`, `source`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `zoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `depth` | `number` |
| `format` | `number` |
| `type` | `number` |
| `source` | `OffscreenCanvas` \| `ImageBitmap` \| `HTMLCanvasElement` \| `HTMLImageElement` \| `HTMLVideoElement` \| `ImageData` \| [`ICanvas`](pixi_core.ICanvas.md) |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage3D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:69](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L69)

▸ **texSubImage3D**(`target`, `level`, `xoffset`, `yoffset`, `zoffset`, `width`, `height`, `depth`, `format`, `type`, `srcData`, `srcOffset?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `number` |
| `level` | `number` |
| `xoffset` | `number` |
| `yoffset` | `number` |
| `zoffset` | `number` |
| `width` | `number` |
| `height` | `number` |
| `depth` | `number` |
| `format` | `number` |
| `type` | `number` |
| `srcData` | `ArrayBufferView` |
| `srcOffset?` | `number` |

#### Returns

`void`

#### Overrides

WebGL2RenderingContext.texSubImage3D

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L72)
