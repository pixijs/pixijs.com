---
id: "pixi_core.ImageBitmapResource"
title: "Class: ImageBitmapResource"
sidebar_label: "ImageBitmapResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ImageBitmapResource

Resource type for ImageBitmap.

**`Memberof`**

PIXI

## Hierarchy

- [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ **`ImageBitmapResource`**

## Constructors

### constructor

• **new ImageBitmapResource**(`source`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| `ImageBitmap` | ImageBitmap or URL to use |
| `options?` | [`IImageBitmapResourceOptions`](../interfaces/pixi_core.IImageBitmapResourceOptions.md) |  |

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[constructor](pixi_core.BaseImageResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L58)

## Properties

### alphaMode

• `Readonly` **alphaMode**: [`ALPHA_MODES`](../enums/pixi_core.ALPHA_MODES.md)

Controls texture alphaMode field
Copies from options
Default is `null`, copies option from baseTexture

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L43)

___

### crossOrigin

• **crossOrigin**: `boolean`

Load image using cross origin.

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L35)

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

URL of the image source.

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L29)

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

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:163](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L163)

___

### load

▸ **load**(): `Promise`<[`ImageBitmapResource`](pixi_core.ImageBitmapResource.md)\>

#### Returns

`Promise`<[`ImageBitmapResource`](pixi_core.ImageBitmapResource.md)\>

#### Overrides

BaseImageResource.load

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L86)

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

Upload the image bitmap resource to GPU.

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

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L145)

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

▸ `Static` **test**(`source`): source is string \| ImageBitmap

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is string \| ImageBitmap

`true` if current environment support ImageBitmap, and source is string or ImageBitmap

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[test](pixi_core.BaseImageResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/ImageBitmapResource.ts:180](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ImageBitmapResource.ts#L180)
