---
id: "pixi_prepare.BasePrepare"
title: "Class: BasePrepare"
sidebar_label: "BasePrepare"
custom_edit_url: null
---

[@pixi/prepare](../modules/pixi_prepare.md).BasePrepare

The prepare manager provides functionality to upload content to the GPU.

BasePrepare handles basic queuing functionality and is extended by
PIXI.Prepare and PIXI.CanvasPrepare
to provide preparation capabilities specific to their respective renderers.

**`Example`**

```ts
// Create a sprite
const sprite = PIXI.Sprite.from('something.png');

// Load object into GPU
app.renderer.prepare.upload(sprite, () => {
    // Texture(s) has been uploaded to GPU
    app.stage.addChild(sprite);
});
```

**`Abstract`**

**`Memberof`**

PIXI

## Hierarchy

- **`BasePrepare`**

  ↳ [`Prepare`](pixi_prepare.Prepare.md)

## Constructors

### constructor

• **new BasePrepare**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> | A reference to the current renderer |

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:285](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L285)

## Properties

### addHooks

• **addHooks**: `any`[]

Collection of additional hooks for finding assets.

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:256](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L256)

___

### completes

• **completes**: `any`[]

Callback to call after completed.

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:268](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L268)

___

### ticking

• **ticking**: `boolean`

If prepare is ticking (running).

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:274](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L274)

___

### uploadHooks

• **uploadHooks**: `any`[]

Collection of additional hooks for processing assets.

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L262)

___

### uploadsPerFrame

▪ `Static` **uploadsPerFrame**: `number` = `4`

The default maximum uploads per frame.

**`Static`**

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L232)

## Methods

### add

▸ **add**(`item`): [`BasePrepare`](pixi_prepare.BasePrepare.md)

Manually add an item to the uploading queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> \| `Container`<`DisplayObject`\> \| [`IDisplayObjectExtended`](../interfaces/pixi_prepare.IDisplayObjectExtended.md) | Object to add to the queue |

#### Returns

[`BasePrepare`](pixi_prepare.BasePrepare.md)

Instance of plugin for chaining.

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:454](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L454)

___

### destroy

▸ **destroy**(): `void`

Destroys the plugin, don't use after this.

#### Returns

`void`

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:479](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L479)

___

### registerFindHook

▸ **registerFindHook**(`addHook`): [`BasePrepare`](pixi_prepare.BasePrepare.md)

Adds hooks for finding items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addHook` | `IFindHook` | Function call that takes two parameters: `item:*, queue:Array` function must return `true` if it was able to add item to the queue. |

#### Returns

[`BasePrepare`](pixi_prepare.BasePrepare.md)

Instance of plugin for chaining.

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:422](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L422)

___

### registerUploadHook

▸ **registerUploadHook**(`uploadHook`): [`BasePrepare`](pixi_prepare.BasePrepare.md)

Adds hooks for uploading items.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uploadHook` | `IUploadHook` | Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and function must return `true` if it was able to handle upload of item. |

#### Returns

[`BasePrepare`](pixi_prepare.BasePrepare.md)

Instance of plugin for chaining.

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

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:324](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L324)
