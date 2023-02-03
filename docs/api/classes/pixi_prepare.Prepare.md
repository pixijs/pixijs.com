---
id: "pixi_prepare.Prepare"
title: "Class: Prepare"
sidebar_label: "Prepare"
custom_edit_url: null
---

[@pixi/prepare](../modules/pixi_prepare.md).Prepare

The prepare plugin provides renderer-specific plugins for pre-rendering DisplayObjects. These plugins are useful for
asynchronously preparing and uploading to the GPU assets, textures, graphics waiting to be displayed.

Do not instantiate this plugin directly. It is available from the `renderer.plugins` property.
See PIXI.CanvasRenderer#plugins or PIXI.Renderer#plugins.

**`Example`**

```ts
import { Application, Graphics } from 'pixi.js';

// Create a new application
const app = new Application();
document.body.appendChild(app.view);

// Don't start rendering right away
app.stop();

// create a display object
const rect = new Graphics()
    .beginFill(0x00ff00)
    .drawRect(40, 40, 200, 200);

// Add to the stage
app.stage.addChild(rect);

// Don't start rendering until the graphic is uploaded to the GPU
app.renderer.prepare.upload(app.stage, () => {
    app.start();
});
```

**`Memberof`**

PIXI

## Hierarchy

- [`BasePrepare`](pixi_prepare.BasePrepare.md)

  ↳ **`Prepare`**

## Implements

- `ISystem`

## Constructors

### constructor

• **new Prepare**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | A reference to the current renderer |

#### Overrides

[BasePrepare](pixi_prepare.BasePrepare.md).[constructor](pixi_prepare.BasePrepare.md#constructor)

#### Defined in

[pixijs/packages/prepare/src/Prepare.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/Prepare.ts#L135)

## Properties

### addHooks

• **addHooks**: `any`[]

Collection of additional hooks for finding assets.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[addHooks](pixi_prepare.BasePrepare.md#addhooks)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:256](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L256)

___

### completes

• **completes**: `any`[]

Callback to call after completed.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[completes](pixi_prepare.BasePrepare.md#completes)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:268](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L268)

___

### ticking

• **ticking**: `boolean`

If prepare is ticking (running).

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[ticking](pixi_prepare.BasePrepare.md#ticking)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:274](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L274)

___

### uploadHooks

• **uploadHooks**: `any`[]

Collection of additional hooks for processing assets.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[uploadHooks](pixi_prepare.BasePrepare.md#uploadhooks)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L262)

___

### uploadsPerFrame

▪ `Static` **uploadsPerFrame**: `number` = `4`

The default maximum uploads per frame.

**`Static`**

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[uploadsPerFrame](pixi_prepare.BasePrepare.md#uploadsperframe)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L232)

## Methods

### add

▸ **add**(`item`): [`Prepare`](pixi_prepare.Prepare.md)

Manually add an item to the uploading queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> \| `Container`<`DisplayObject`\> \| [`IDisplayObjectExtended`](../interfaces/pixi_prepare.IDisplayObjectExtended.md) | Object to add to the queue |

#### Returns

[`Prepare`](pixi_prepare.Prepare.md)

Instance of plugin for chaining.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[add](pixi_prepare.BasePrepare.md#add)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:454](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L454)

___

### destroy

▸ **destroy**(): `void`

Destroys the plugin, don't use after this.

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[destroy](pixi_prepare.BasePrepare.md#destroy)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:479](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L479)

___

### registerFindHook

▸ **registerFindHook**(`addHook`): [`Prepare`](pixi_prepare.Prepare.md)

Adds hooks for finding items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addHook` | `IFindHook` | Function call that takes two parameters: `item:*, queue:Array` function must return `true` if it was able to add item to the queue. |

#### Returns

[`Prepare`](pixi_prepare.Prepare.md)

Instance of plugin for chaining.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[registerFindHook](pixi_prepare.BasePrepare.md#registerfindhook)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:422](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L422)

___

### registerUploadHook

▸ **registerUploadHook**(`uploadHook`): [`Prepare`](pixi_prepare.Prepare.md)

Adds hooks for uploading items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uploadHook` | `IUploadHook` | Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and function must return `true` if it was able to handle upload of item. |

#### Returns

[`Prepare`](pixi_prepare.Prepare.md)

Instance of plugin for chaining.

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[registerUploadHook](pixi_prepare.BasePrepare.md#registeruploadhook)

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
| `item?` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> \| `Container`<`DisplayObject`\> \| [`IDisplayObjectExtended`](../interfaces/pixi_prepare.IDisplayObjectExtended.md) | Container or display object to search for items to upload or the items to upload themselves, or optionally ommitted, if items have been added using PIXI.BasePrepare#add `prepare.add`. |

#### Returns

`Promise`<`void`\>

#### Inherited from

[BasePrepare](pixi_prepare.BasePrepare.md).[upload](pixi_prepare.BasePrepare.md#upload)

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:324](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L324)
