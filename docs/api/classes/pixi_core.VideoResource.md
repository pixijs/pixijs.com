---
id: "pixi_core.VideoResource"
title: "Class: VideoResource"
sidebar_label: "VideoResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).VideoResource

Resource type for {@code HTMLVideoElement}.

**`Memberof`**

PIXI

## Hierarchy

- [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ **`VideoResource`**

## Constructors

### constructor

• **new VideoResource**(`source?`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source?` | `string` \| `HTMLVideoElement` \| (`string` \| [`IVideoResourceOptionsElement`](../interfaces/pixi_core.IVideoResourceOptionsElement.md))[] | Video element to use. |
| `options?` | [`IVideoResourceOptions`](../interfaces/pixi_core.IVideoResourceOptions.md) | Options to use |

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[constructor](pixi_core.BaseImageResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L68)

## Properties

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

• **source**: `HTMLVideoElement`

Override the source to be the video element.

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[source](pixi_core.BaseImageResource.md#source)

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L27)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[src](pixi_core.BaseImageResource.md#src)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

___

### MIME\_TYPES

▪ `Static` `Readonly` **MIME\_TYPES**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`string`\>

Map of video MIME types that can't be directly derived from file extensions.

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:382](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L382)

___

### TYPES

▪ `Static` `Readonly` **TYPES**: `string`[]

List of common video file extensions supported by VideoResource.

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:376](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L376)

## Accessors

### autoUpdate

• `get` **autoUpdate**(): `boolean`

Should the base texture automatically update itself, set to true by default.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:319](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L319)

• `set` **autoUpdate**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:324](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L324)

___

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

### updateFPS

• `get` **updateFPS**(): `number`

How many times a second to update the texture from the video. Leave at 0 to update at every render.
A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:347](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L347)

• `set` **updateFPS**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:352](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L352)

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

Destroys this texture.

#### Returns

`void`

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[dispose](pixi_core.BaseImageResource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L298)

___

### load

▸ **load**(): `Promise`<[`VideoResource`](pixi_core.VideoResource.md)\>

Start preloading the video resource.

#### Returns

`Promise`<[`VideoResource`](pixi_core.VideoResource.md)\>

Handle the validate event

#### Overrides

BaseImageResource.load

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:164](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L164)

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

▸ **update**(`_deltaTime?`): `void`

Trigger updating of the texture.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `_deltaTime` | `number` | `0` | time delta since last tick |

#### Returns

`void`

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[update](pixi_core.BaseImageResource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L144)

___

### upload

▸ **upload**(`renderer`, `baseTexture`, `glTexture`, `source?`): `boolean`

Upload the texture to the GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | Upload to the renderer |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Reference to parent texture |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) |  |
| `source?` | [`ImageSource`](../modules/pixi_core.md#imagesource) | (optional) |

#### Returns

`boolean`

- true is success

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[upload](pixi_core.BaseImageResource.md#upload)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L71)

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

▸ `Static` **test**(`source`, `extension?`): source is HTMLVideoElement

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |
| `extension?` | `string` | The extension of source, if set |

#### Returns

source is HTMLVideoElement

`true` if video source

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[test](pixi_core.BaseImageResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/VideoResource.ts:366](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/VideoResource.ts#L366)
