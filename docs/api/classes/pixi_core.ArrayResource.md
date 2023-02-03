---
id: "pixi_core.ArrayResource"
title: "Class: ArrayResource"
sidebar_label: "ArrayResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ArrayResource

A resource that contains a number of sources.

**`Memberof`**

PIXI

## Hierarchy

- [`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

  ↳ **`ArrayResource`**

## Constructors

### constructor

• **new ArrayResource**(`source`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `number` \| `any`[] | Number of items in array or the collection of image URLs to use. Can also be resources, image elements, canvas, etc. |
| `options?` | [`ISize`](../interfaces/pixi_core.ISize.md) | Options to apply to PIXI.autoDetectResource |

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[constructor](pixi_core.AbstractMultiResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/ArrayResource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ArrayResource.ts#L23)

## Properties

### baseTexture

• **baseTexture**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Bound baseTexture, there can only be one.

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[baseTexture](pixi_core.AbstractMultiResource.md#basetexture)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L38)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

If resource has been destroyed.

**`Default`**

false

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[destroyed](pixi_core.AbstractMultiResource.md#destroyed)

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

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[internal](pixi_core.AbstractMultiResource.md#internal)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L31)

___

### itemDirtyIds

• `Readonly` **itemDirtyIds**: `number`[]

Dirty IDs for each part.

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[itemDirtyIds](pixi_core.AbstractMultiResource.md#itemdirtyids)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L29)

___

### items

• `Readonly` **items**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[]

Collection of partial baseTextures that correspond to resources.

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[items](pixi_core.AbstractMultiResource.md#items)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L23)

___

### length

• `Readonly` **length**: `number`

Number of elements in array.

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[length](pixi_core.AbstractMultiResource.md#length)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L17)

___

### src

• **src**: `string`

The url of the resource

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[src](pixi_core.AbstractMultiResource.md#src)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L16)

## Accessors

### height

• `get` **height**(): `number`

The height of the resource.

#### Returns

`number`

#### Inherited from

AbstractMultiResource.height

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L165)

___

### valid

• `get` **valid**(): `boolean`

Has been validated

#### Returns

`boolean`

#### Inherited from

AbstractMultiResource.valid

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L127)

___

### width

• `get` **width**(): `number`

The width of the resource.

#### Returns

`number`

#### Inherited from

AbstractMultiResource.width

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L156)

## Methods

### addBaseTextureAt

▸ **addBaseTextureAt**(`baseTexture`, `index`): [`ArrayResource`](pixi_core.ArrayResource.md)

Set a baseTexture by ID,
ArrayResource just takes resource from it, nothing more

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |  |
| `index` | `number` | Zero-based index of resource to set |

#### Returns

[`ArrayResource`](pixi_core.ArrayResource.md)

- Instance for chaining

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[addBaseTextureAt](pixi_core.AbstractMultiResource.md#addbasetextureat)

#### Defined in

[pixijs/packages/core/src/textures/resources/ArrayResource.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ArrayResource.ts#L55)

___

### addResourceAt

▸ **addResourceAt**(`resource`, `index`): [`ArrayResource`](pixi_core.ArrayResource.md)

Set a resource by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource` | [`Resource`](pixi_core.Resource.md) |  |
| `index` | `number` | Zero-based index of resource to set |

#### Returns

[`ArrayResource`](pixi_core.ArrayResource.md)

- Instance for chaining

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[addResourceAt](pixi_core.AbstractMultiResource.md#addresourceat)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L126)

___

### bind

▸ **bind**(`baseTexture`): `void`

Add binding

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |

#### Returns

`void`

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[bind](pixi_core.AbstractMultiResource.md#bind)

#### Defined in

[pixijs/packages/core/src/textures/resources/ArrayResource.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ArrayResource.ts#L73)

___

### destroy

▸ **destroy**(): `void`

Call when destroying resource, unbind any BaseTexture object
before calling this method, as reference counts are maintained
internally.

#### Returns

`void`

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[destroy](pixi_core.AbstractMultiResource.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L202)

___

### dispose

▸ **dispose**(): `void`

Destroy this BaseImageResource.

#### Returns

`void`

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[dispose](pixi_core.AbstractMultiResource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L101)

___

### load

▸ **load**(): `Promise`<[`ArrayResource`](pixi_core.ArrayResource.md)\>

Load all the resources simultaneously

#### Returns

`Promise`<[`ArrayResource`](pixi_core.ArrayResource.md)\>

- When load is resolved

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[load](pixi_core.AbstractMultiResource.md#load)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L182)

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

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[resize](pixi_core.AbstractMultiResource.md#resize)

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

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[style](pixi_core.AbstractMultiResource.md#style)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:186](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L186)

___

### unbind

▸ **unbind**(`baseTexture`): `void`

Unset the parent base texture.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |

#### Returns

`void`

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[unbind](pixi_core.AbstractMultiResource.md#unbind)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L167)

___

### update

▸ **update**(): `void`

Has been updated trigger event.

#### Returns

`void`

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[update](pixi_core.AbstractMultiResource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L133)

___

### upload

▸ **upload**(`renderer`, `texture`, `glTexture`): `boolean`

Upload the resources to the GPU.

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) |
| `texture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) |

#### Returns

`boolean`

- whether texture was uploaded

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[upload](pixi_core.AbstractMultiResource.md#upload)

#### Defined in

[pixijs/packages/core/src/textures/resources/ArrayResource.ts:87](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/ArrayResource.ts#L87)

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

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[test](pixi_core.AbstractMultiResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L222)
