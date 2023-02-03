---
id: "pixi_core.ICanvas"
title: "Interface: ICanvas"
sidebar_label: "ICanvas"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ICanvas

Common interface for HTMLCanvasElement, OffscreenCanvas, and other custom canvas classes.

**`Memberof`**

PIXI

## Hierarchy

- `ICanvas`

- `Partial`<`EventTarget`\>

  ↳ **`ICanvas`**

## Properties

### height

• **height**: `number`

Height of the canvas.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L65)

___

### parentNode

• `Optional` `Readonly` **parentNode**: [`ICanvasParentNode`](pixi_core.ICanvasParentNode.md)

Parent node of the canvas.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L152)

___

### style

• `Optional` `Readonly` **style**: [`ICanvasStyle`](pixi_core.ICanvasStyle.md)

Style of the canvas.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:155](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L155)

___

### tintId

• `Optional` **tintId**: `number`

#### Inherited from

GlobalMixins.ICanvas.tintId

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L21)

___

### width

• **width**: `number`

Width of the canvas.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L63)

## Methods

### addEventListener

▸ `Optional` **addEventListener**(`type`, `listener`, `options?`): `void`

Adds the listener for the specified event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The type of event to listen for. |
| `listener` | `EventListenerOrEventListenerObject` | The callback to invoke when the event is fired. |
| `options?` | `boolean` \| `AddEventListenerOptions` | The options for adding event listener. |

#### Returns

`void`

#### Overrides

Partial.addEventListener

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L119)

▸ `Optional` **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`WebGLContextEventMap`](pixi_core.WebGLContextEventMap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`ICanvas`](pixi_core.ICanvas.md), `ev`: [`WebGLContextEventMap`](pixi_core.WebGLContextEventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Overrides

Partial.addEventListener

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L123)

___

### convertToBlob

▸ `Optional` **convertToBlob**(`options?`): `Promise`<`Blob`\>

Get the content of the canvas as Blob.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | The options for creating Blob. |
| `options.quality?` | `number` | The image quality to be used when creating images using file formats that support lossy compression. |
| `options.type?` | `string` | The MIME type for the image format to return. If not specify, the default value is image/png. |

#### Returns

`Promise`<`Blob`\>

The content of the canvas as Blob.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L111)

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `boolean`

Dispatches a event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | The Event object to dispatch. Its Event.target property will be set to the current EventTarget. |

#### Returns

`boolean`

Returns false if event is cancelable, and at least one of the event handlers which received event
                   called Event.preventDefault(). Otherwise true.

#### Overrides

Partial.dispatchEvent

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L149)

___

### getBoundingClientRect

▸ `Optional` **getBoundingClientRect**(): [`ICanvasRect`](pixi_core.ICanvasRect.md)

Get the position and the size of the canvas.

#### Returns

[`ICanvasRect`](pixi_core.ICanvasRect.md)

The smallest rectangle which contains the entire canvas.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:161](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L161)

___

### getContext

▸ **getContext**(`contextId`, `options?`): [`ICanvasRenderingContext2D`](pixi_core.ICanvasRenderingContext2D.md)

Get rendering context of the canvas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contextId` | ``"2d"`` | The identifier of the type of context to create. |
| `options?` | [`ICanvasRenderingContext2DSettings`](pixi_core.ICanvasRenderingContext2DSettings.md) | The options for creating context. |

#### Returns

[`ICanvasRenderingContext2D`](pixi_core.ICanvasRenderingContext2D.md)

The created context, or null if contextId is not supported.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L73)

▸ **getContext**(`contextId`, `options?`): `ImageBitmapRenderingContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | ``"bitmaprenderer"`` |
| `options?` | `ImageBitmapRenderingContextSettings` |

#### Returns

`ImageBitmapRenderingContext`

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L77)

▸ **getContext**(`contextId`, `options?`): `WebGLRenderingContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | ``"webgl"`` \| ``"experimental-webgl"`` |
| `options?` | `WebGLContextAttributes` |

#### Returns

`WebGLRenderingContext`

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L81)

▸ **getContext**(`contextId`, `options?`): `WebGL2RenderingContext`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | ``"webgl2"`` \| ``"experimental-webgl2"`` |
| `options?` | `WebGLContextAttributes` |

#### Returns

`WebGL2RenderingContext`

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L85)

▸ **getContext**(`contextId`, `options?`): [`RenderingContext`](../modules/pixi_core.md#renderingcontext)

#### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | [`ContextIds`](../modules/pixi_core.md#contextids) |
| `options?` | [`ContextSettings`](../modules/pixi_core.md#contextsettings) |

#### Returns

[`RenderingContext`](../modules/pixi_core.md#renderingcontext)

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L89)

___

### removeEventListener

▸ `Optional` **removeEventListener**(`type`, `listener`, `options?`): `void`

Removes the listener for the specified event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The type of event to listen for. |
| `listener` | `EventListenerOrEventListenerObject` | The callback to invoke when the event is fired. |
| `options?` | `boolean` \| `EventListenerOptions` | The options for removing event listener. |

#### Returns

`void`

#### Overrides

Partial.removeEventListener

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L134)

▸ `Optional` **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`WebGLContextEventMap`](pixi_core.WebGLContextEventMap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`ICanvas`](pixi_core.ICanvas.md), `ev`: [`WebGLContextEventMap`](pixi_core.WebGLContextEventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Overrides

Partial.removeEventListener

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L138)

___

### toDataURL

▸ `Optional` **toDataURL**(`type?`, `options?`): `string`

Get the content of the canvas as data URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type?` | `string` | The MIME type for the image format to return. If not specify, the default value is image/png. |
| `options?` | `any` | The options for creating data URL. |

#### Returns

`string`

The content of the canvas as data URL.

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L100)
