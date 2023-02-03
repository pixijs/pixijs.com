---
id: "pixi_canvas_prepare.CanvasPrepare"
title: "Class: CanvasPrepare"
sidebar_label: "CanvasPrepare"
custom_edit_url: null
---

[@pixi/canvas-prepare](../modules/pixi_canvas_prepare.md).CanvasPrepare

The prepare manager provides functionality to upload content to the GPU.

This cannot be done directly for Canvas like in WebGL, but the effect can be achieved by drawing
textures to an offline canvas. This draw call will force the texture to be moved onto the GPU.

An instance of this class is automatically created by default, and can be found at `renderer.prepare`

**`Memberof`**

PIXI

## Hierarchy

- `BasePrepare`

  ↳ **`CanvasPrepare`**

## Implements

- `ISystem`

## Constructors

### constructor

• **new CanvasPrepare**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `CanvasRenderer` | A reference to the current renderer |

#### Overrides

BasePrepare.constructor

#### Defined in

[pixijs/packages/canvas-prepare/src/CanvasPrepare.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-prepare/src/CanvasPrepare.ts#L78)

## Properties

### addHooks

• **addHooks**: `any`[]

Collection of additional hooks for finding assets.

#### Inherited from

BasePrepare.addHooks

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:256](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L256)

___

### completes

• **completes**: `any`[]

Callback to call after completed.

#### Inherited from

BasePrepare.completes

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:268](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L268)

___

### ticking

• **ticking**: `boolean`

If prepare is ticking (running).

#### Inherited from

BasePrepare.ticking

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:274](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L274)

___

### uploadHooks

• **uploadHooks**: `any`[]

Collection of additional hooks for processing assets.

#### Inherited from

BasePrepare.uploadHooks

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L262)

___

### uploadsPerFrame

▪ `Static` **uploadsPerFrame**: `number` = `4`

The default maximum uploads per frame.

**`Static`**

#### Inherited from

BasePrepare.uploadsPerFrame

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L232)

## Methods

### add

▸ **add**(`item`): [`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Manually add an item to the uploading queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> \| `Container`<`DisplayObject`\> \| `IDisplayObjectExtended` | Object to add to the queue |

#### Returns

[`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Instance of plugin for chaining.

#### Inherited from

BasePrepare.add

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:454](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L454)

___

### destroy

▸ **destroy**(): `void`

Destroys the plugin, don't use after this

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Overrides

BasePrepare.destroy

#### Defined in

[pixijs/packages/canvas-prepare/src/CanvasPrepare.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-prepare/src/CanvasPrepare.ts#L96)

___

### registerFindHook

▸ **registerFindHook**(`addHook`): [`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Adds hooks for finding items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addHook` | `IFindHook` | Function call that takes two parameters: `item:*, queue:Array` function must return `true` if it was able to add item to the queue. |

#### Returns

[`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Instance of plugin for chaining.

#### Inherited from

BasePrepare.registerFindHook

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:422](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L422)

___

### registerUploadHook

▸ **registerUploadHook**(`uploadHook`): [`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Adds hooks for uploading items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uploadHook` | `IUploadHook` | Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and function must return `true` if it was able to handle upload of item. |

#### Returns

[`CanvasPrepare`](pixi_canvas_prepare.CanvasPrepare.md)

Instance of plugin for chaining.

#### Inherited from

BasePrepare.registerUploadHook

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:438](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L438)

___

### upload

▸ **upload**(`item?`): `Promise`<`void`\>

Upload all the textures and graphics to the GPU.

**`Method`**

PIXI.BasePrepare#upload

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item?` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> \| `Container`<`DisplayObject`\> \| `IDisplayObjectExtended` | Container or display object to search for items to upload or the items to upload themselves, or optionally ommitted, if items have been added using PIXI.BasePrepare#add `prepare.add`. |

#### Returns

`Promise`<`void`\>

#### Inherited from

BasePrepare.upload

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:324](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L324)
