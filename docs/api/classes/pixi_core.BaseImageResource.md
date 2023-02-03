---
id: "pixi_core.BaseImageResource"
title: "Class: BaseImageResource"
sidebar_label: "BaseImageResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BaseImageResource

Base for all the image/canvas resources.

**`Memberof`**

PIXI

## Hierarchy

- [`Resource`](pixi_core.Resource.md)

  ↳ **`BaseImageResource`**

  ↳↳ [`CanvasResource`](pixi_core.CanvasResource.md)

  ↳↳ [`ImageBitmapResource`](pixi_core.ImageBitmapResource.md)

  ↳↳ [`ImageResource`](pixi_core.ImageResource.md)

  ↳↳ [`SVGResource`](pixi_core.SVGResource.md)

  ↳↳ [`VideoResource`](pixi_core.VideoResource.md)

## Constructors

### constructor

• **new BaseImageResource**(`source`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`ImageSource`](../modules/pixi_core.md#imagesource) |

#### Overrides

[Resource](pixi_core.Resource.md).[constructor](pixi_core.Resource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L33)

## Properties

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Inherited from

[Resource](pixi_core.Resource.md).[destroyed](pixi_core.Resource.md#destroyed)

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

[Resource](pixi_core.Resource.md).[internal](pixi_core.Resource.md#internal)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### source

• `Readonly` **source**: [`ImageSource`](../modules/pixi_core.md#imagesource)

The source element.

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L20)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

[Resource](pixi_core.Resource.md).[src](pixi_core.Resource.md#src)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Inherited from

Resource.height

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Inherited from

Resource.valid

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

#### Inherited from

Resource.width

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

[Resource](pixi_core.Resource.md).[bind](pixi_core.Resource.md#bind)

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

[Resource](pixi_core.Resource.md).[destroy](pixi_core.Resource.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Destroy this [BaseImageResource](pixi_core.BaseImageResource.md)

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[dispose](pixi_core.Resource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L136)

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

[Resource](pixi_core.Resource.md).[resize](pixi_core.Resource.md#resize)

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

[Resource](pixi_core.Resource.md).[style](pixi_core.Resource.md#style)

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

[Resource](pixi_core.Resource.md).[unbind](pixi_core.Resource.md#unbind)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L101)

___

### update

▸ **update**(): `void`

Checks if source width/height was changed, resize can cause extra baseTexture update.
Triggers one update in any case.

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[update](pixi_core.Resource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L118)

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

#### Overrides

[Resource](pixi_core.Resource.md).[upload](pixi_core.Resource.md#upload)

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

#### Defined in

[pixijs/packages/core/src/textures/resources/BaseImageResource.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BaseImageResource.ts#L51)

___

### test

▸ `Static` **test**(`_source`, `_extension?`): `boolean`

Abstract, used to auto-detect resource type.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_source` | `unknown` | The source object |
| `_extension?` | `string` | The extension of source, if set |

#### Returns

`boolean`

#### Inherited from

[Resource](pixi_core.Resource.md).[test](pixi_core.Resource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L222)
