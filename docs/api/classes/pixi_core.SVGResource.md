---
id: "pixi_core.SVGResource"
title: "Class: SVGResource"
sidebar_label: "SVGResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).SVGResource

Resource type for SVG elements and graphics.

**`Memberof`**

PIXI

## Hierarchy

- [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ **`SVGResource`**

## Constructors

### constructor

• **new SVGResource**(`sourceBase64`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceBase64` | `string` | Base64 encoded SVG element or URL for SVG file. |
| `options?` | [`ISVGResourceOptions`](../interfaces/pixi_core.ISVGResourceOptions.md) | Options to use |

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[constructor](pixi_core.BaseImageResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L52)

## Properties

### \_overrideHeight

• `Readonly` **\_overrideHeight**: `number`

A height override for rasterization on load.

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L33)

___

### \_overrideWidth

• `Readonly` **\_overrideWidth**: `number`

A width override for rasterization on load.

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L30)

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

### scale

• `Readonly` **scale**: `number`

The source scale to apply when rasterizing on load.

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L27)

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

### svg

• `Readonly` **svg**: `string`

Base64 encoded SVG element or URL for SVG file.

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L24)

___

### SVG\_SIZE

▪ `Static` `Readonly` **SVG\_SIZE**: `RegExp`

Regular expression for SVG size.

**`Example`**

```ts
&lt;svg width="100" height="100"&gt;&lt;/svg&gt;
@readonly
```

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:225](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L225)

___

### SVG\_XML

▪ `Static` `Readonly` **SVG\_XML**: `RegExp`

Regular expression for SVG XML document.

**`Example`**

```ts
&lt;?xml version="1.0" encoding="utf-8" ?&gt;&lt;!-- image/svg --&gt;&lt;svg
@readonly
```

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:218](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L218)

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

Destroys this texture.

#### Returns

`void`

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[dispose](pixi_core.BaseImageResource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:190](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L190)

___

### load

▸ **load**(): `Promise`<[`SVGResource`](pixi_core.SVGResource.md)\>

#### Returns

`Promise`<[`SVGResource`](pixi_core.SVGResource.md)\>

#### Overrides

BaseImageResource.load

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L75)

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

### getSize

▸ `Static` **getSize**(`svgString?`): [`ISize`](../interfaces/pixi_core.ISize.md)

Get size from an svg string using a regular expression.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `svgString?` | `string` | a serialized svg element |

#### Returns

[`ISize`](../interfaces/pixi_core.ISize.md)

- image extension

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:175](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L175)

___

### test

▸ `Static` **test**(`source`, `extension?`): `boolean`

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |
| `extension?` | `string` | The extension of source, if set |

#### Returns

`boolean`

- If the source is a SVG source or data file

#### Overrides

[BaseImageResource](pixi_core.BaseImageResource.md).[test](pixi_core.BaseImageResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/SVGResource.ts:203](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/SVGResource.ts#L203)
