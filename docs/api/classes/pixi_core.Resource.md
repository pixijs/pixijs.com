---
id: "pixi_core.Resource"
title: "Class: Resource"
sidebar_label: "Resource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Resource

Base resource class for textures that manages validation and uploading, depending on its type.

Uploading of a base texture to the GPU is required.

**`Memberof`**

PIXI

## Hierarchy

- **`Resource`**

  ↳ [`BaseImageResource`](pixi_core.BaseImageResource.md)

  ↳ [`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

  ↳ [`BufferResource`](pixi_core.BufferResource.md)

## Constructors

### constructor

• **new Resource**(`width?`, `height?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `width` | `number` | `0` | Width of the resource |
| `height` | `number` | `0` | Height of the resource |

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L66)

## Properties

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L23)

___

### internal

• **internal**: `boolean`

`true` if resource is created by BaseTexture
useful for doing cleanup with BaseTexture destroy
and not cleaning up resources that were created
externally.

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### src

• **src**: `string`

The url of the resource

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

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

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Clean up anything, this happens when destroying is ready.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:192](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L192)

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

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L101)

___

### update

▸ **update**(): `void`

Has been updated trigger event.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L133)

___

### upload

▸ `Abstract` **upload**(`renderer`, `baseTexture`, `glTexture`): `boolean`

Uploads the texture or returns false if it cant for some reason. Override this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | yeah, renderer! |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | the texture |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) | texture instance for this webgl context |

#### Returns

`boolean`

- true is success

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:177](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L177)

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

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L222)
