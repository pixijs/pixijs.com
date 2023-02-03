---
id: "pixi_core.AbstractMultiResource"
title: "Class: AbstractMultiResource"
sidebar_label: "AbstractMultiResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).AbstractMultiResource

Resource that can manage several resource (items) inside.
All resources need to have the same pixel size.
Parent class for CubeResource and ArrayResource

**`Memberof`**

PIXI

## Hierarchy

- [`Resource`](pixi_core.Resource.md)

  ↳ **`AbstractMultiResource`**

  ↳↳ [`ArrayResource`](pixi_core.ArrayResource.md)

  ↳↳ [`CubeResource`](pixi_core.CubeResource.md)

## Constructors

### constructor

• **new AbstractMultiResource**(`length`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `length` | `number` |  |
| `options?` | [`ISize`](../interfaces/pixi_core.ISize.md) | Options to for Resource constructor |

#### Overrides

[Resource](pixi_core.Resource.md).[constructor](pixi_core.Resource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L46)

## Properties

### baseTexture

• **baseTexture**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Bound baseTexture, there can only be one.

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L38)

___

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

### itemDirtyIds

• `Readonly` **itemDirtyIds**: `number`[]

Dirty IDs for each part.

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L29)

___

### items

• `Readonly` **items**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[]

Collection of partial baseTextures that correspond to resources.

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L23)

___

### length

• `Readonly` **length**: `number`

Number of elements in array.

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L17)

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

### addBaseTextureAt

▸ `Abstract` **addBaseTextureAt**(`baseTexture`, `index`): [`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

Set a baseTexture by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |  |
| `index` | `number` | Zero-based index of resource to set |

#### Returns

[`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

- Instance for chaining

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L118)

___

### addResourceAt

▸ **addResourceAt**(`resource`, `index`): [`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

Set a resource by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource` | [`Resource`](pixi_core.Resource.md) |  |
| `index` | `number` | Zero-based index of resource to set |

#### Returns

[`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

- Instance for chaining

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L126)

___

### bind

▸ **bind**(`baseTexture`): `void`

Set the parent base texture.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[bind](pixi_core.Resource.md#bind)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:148](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L148)

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

Destroy this BaseImageResource.

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[dispose](pixi_core.Resource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L101)

___

### load

▸ **load**(): `Promise`<[`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)\>

Load all the resources simultaneously

#### Returns

`Promise`<[`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)\>

- When load is resolved

#### Overrides

Resource.load

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

Unset the parent base texture.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[unbind](pixi_core.Resource.md#unbind)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L167)

___

### update

▸ **update**(): `void`

Has been updated trigger event.

#### Returns

`void`

#### Inherited from

[Resource](pixi_core.Resource.md).[update](pixi_core.Resource.md#update)

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

#### Inherited from

[Resource](pixi_core.Resource.md).[upload](pixi_core.Resource.md#upload)

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

#### Inherited from

[Resource](pixi_core.Resource.md).[test](pixi_core.Resource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L222)
