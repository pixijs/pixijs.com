---
id: "pixi_core.CanvasResource"
title: "Class: CanvasResource"
sidebar_label: "CanvasResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).CanvasResource

Resource type for HTMLCanvasElement and OffscreenCanvas.

**`Memberof`**

PIXI

## Hierarchy

- [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ **`CanvasResource`**

## Constructors

### constructor

• **new CanvasResource**(`source`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | [`ICanvas`](../interfaces/pixi_core.ICanvas.md) | Canvas element to use |

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[constructor](pixi_core.BaseImageResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/CanvasResource.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CanvasResource.ts#L19)

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

Destroy this [BaseImageResource](pixi_core.BaseImageResource.md)

#### Returns

`void`

#### Inherited from

[BaseImageResource](pixi_core.BaseImageResource.md).[dispose](pixi_core.BaseImageResource.md#dispose)

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

▸ `Static` **test**(`source`): source is OffscreenCanvas \| HTMLCanvasElement

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is OffscreenCanvas \| HTMLCanvasElement

`true` if source is HTMLCanvasElement or OffscreenCanvas

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[test](pixi_core.BaseImageResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/CanvasResource.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CanvasResource.ts#L29)
