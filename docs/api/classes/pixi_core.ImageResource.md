---
id: "pixi_core.ImageResource"
title: "Class: ImageResource"
sidebar_label: "ImageResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ImageResource

Resource type for HTMLImageElement.

**`Memberof`**

PIXI

## Hierarchy

- [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ **`ImageResource`**

## Constructors

### constructor

• **new ImageResource**(`source`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| `HTMLImageElement` | image source or URL |
| `options?` | [`IImageResourceOptions`](../interfaces/pixi_core.IImageResourceOptions.md) |  |

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[constructor](pixi_core.BaseImageResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L77)

## Properties

### alphaMode

• `Readonly` **alphaMode**: [`ALPHA_MODES`](../enums/pixi_core.ALPHA_MODES.md)

Controls texture alphaMode field
Copies from options
Default is `null`, copies option from baseTexture

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L51)

___

### bitmap

• **bitmap**: `ImageBitmap`

The ImageBitmap element created for a {@code HTMLImageElement}.

**`Default`**

null

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L57)

___

### createBitmap

• **createBitmap**: `boolean`

If capable, convert the image using createImageBitmap API.

**`Default`**

PIXI.settings.CREATE_IMAGE_BITMAP

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L43)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[destroyed](pixi_core.BaseImageResource.md#destroyed)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L23)

___

### internal

• **internal**: `boolean`

`true` if resource is created by BaseTexture
useful for doing cleanup with BaseTexture destroy
and not cleaning up resources that were created
externally.

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[internal](pixi_core.BaseImageResource.md#internal)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### preserveBitmap

• **preserveBitmap**: `boolean`

If the image should be disposed after upload

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L37)

___

### source

• `Readonly` **source**: [`ImageSource`](../modules/pixi_core.md#imagesource)

The source element.

**`Member`**

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[source](pixi_core.BaseImageResource.md#source)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L20)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[src](pixi_core.BaseImageResource.md#src)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

___

### url

• **url**: `string`

URL of the image source

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L31)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Inherited from

BaseImageResource.height

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Inherited from

BaseImageResource.valid

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

#### Inherited from

BaseImageResource.width

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L156)

## Methods

### bind

▸ **bind**(`baseTexture`): `void`

Bind to a parent BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Parent texture |

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[bind](pixi_core.BaseImageResource.md#bind)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L83)

___

### destroy

▸ **destroy**(): `void`

Call when destroying resource, unbind any BaseTexture object
before calling this method, as reference counts are maintained
internally.

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[destroy](pixi_core.BaseImageResource.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Destroys this resource.

#### Returns

`void`

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[dispose](pixi_core.BaseImageResource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:297](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L297)

___

### load

▸ **load**(`createBitmap?`): `Promise`<[`ImageResource`](pixi_core.ImageResource.md)\>

Returns a promise when image will be loaded and processed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `createBitmap?` | `boolean` | whether process image into bitmap |

#### Returns

`Promise`<[`ImageResource`](pixi_core.ImageResource.md)\>

#### Overrides

BaseImageResource.load

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L124)

___

### process

▸ **process**(): `Promise`<[`ImageResource`](pixi_core.ImageResource.md)\>

Called when we need to convert image into BitmapImage.
Can be called multiple times, real promise is cached inside.

#### Returns

`Promise`<[`ImageResource`](pixi_core.ImageResource.md)\>

- Cached promise to fill that bitmap

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L188)

___

### resize

▸ **resize**(`width`, `height`): `void`

Trigger a resize event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | X dimension |
| `height` | `number` | Y dimension |

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[resize](pixi_core.BaseImageResource.md#resize)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L113)

___

### style

▸ **style**(`_renderer`, `_baseTexture`, `_glTexture`): `boolean`

Set the style, optional to override

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_renderer` | [`Renderer`](pixi_core.Renderer.md) | yeah, renderer! |
| `_baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | the texture |
| `_glTexture` | [`GLTexture`](pixi_core.GLTexture.md) | texture instance for this webgl context |

#### Returns

`boolean`

- `true` is success

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[style](pixi_core.BaseImageResource.md#style)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:186](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L186)

___

### unbind

▸ **unbind**(`baseTexture`): `void`

Unbind to a parent BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Parent texture |

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[unbind](pixi_core.BaseImageResource.md#unbind)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L101)

___

### update

▸ **update**(): `void`

Checks if source width/height was changed, resize can cause extra baseTexture update.
Triggers one update in any case.

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[update](pixi_core.BaseImageResource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L118)

___

### upload

▸ **upload**(`renderer`, `baseTexture`, `glTexture`): `boolean`

Upload the image resource to GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | Renderer to upload to |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | BaseTexture for this resource |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) | GLTexture to use |

#### Returns

`boolean`

true is success

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[upload](pixi_core.BaseImageResource.md#upload)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:238](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L238)

___

### crossOrigin

▸ `Static` **crossOrigin**(`element`, `url`, `crossorigin?`): `void`

Set cross origin based detecting the url and the crossorigin

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLImageElement` \| `HTMLVideoElement` | Element to apply crossOrigin |
| `url` | `string` | URL to check |
| `crossorigin?` | `string` \| `boolean` | Cross origin value to use |

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[crossOrigin](pixi_core.BaseImageResource.md#crossorigin)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L51)

___

### test

▸ `Static` **test**(`source`): source is string \| HTMLImageElement

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is string \| HTMLImageElement

`true` if current environment support HTMLImageElement, and source is string or HTMLImageElement

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[test](pixi_core.BaseImageResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageResource.ts:318](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageResource.ts#L318)
