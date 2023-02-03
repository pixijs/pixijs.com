---
id: "pixi_core.CubeResource"
title: "Class: CubeResource"
sidebar_label: "CubeResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).CubeResource

Resource for a CubeTexture which contains six resources.

**`Memberof`**

PIXI

## Hierarchy

- [`AbstractMultiResource`](pixi_core.AbstractMultiResource.md)

  ↳ **`CubeResource`**

## Constructors

### constructor

• **new CubeResource**(`source?`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source?` | [`ArrayFixed`](../namespaces/pixi_core.utils.md#arrayfixed)<`string` \| [`Resource`](pixi_core.Resource.md), ``6``\> | Collection of URLs or resources to use as the sides of the cube. |
| `options?` | [`ICubeResourceOptions`](../interfaces/pixi_core.ICubeResourceOptions.md) | ImageResource options |

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[constructor](pixi_core.AbstractMultiResource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L45)

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

• **items**: [`ArrayFixed`](../namespaces/pixi_core.utils.md#arrayfixed)<[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>, ``6``\>

Collection of partial baseTextures that correspond to resources.

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[items](pixi_core.AbstractMultiResource.md#items)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L27)

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

___

### SIDES

▪ `Static` **SIDES**: `number` = `6`

Number of texture sides to store for CubeResources.

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:173](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L173)

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

▸ **addBaseTextureAt**(`baseTexture`, `index`, `linkBaseTexture?`): [`CubeResource`](pixi_core.CubeResource.md)

Set a baseTexture by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |  |
| `index` | `number` | Zero-based index of resource to set |
| `linkBaseTexture?` | `boolean` | - |

#### Returns

[`CubeResource`](pixi_core.CubeResource.md)

- Instance for chaining

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[addBaseTextureAt](pixi_core.AbstractMultiResource.md#addbasetextureat)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L85)

___

### addResourceAt

▸ **addResourceAt**(`resource`, `index`): [`CubeResource`](pixi_core.CubeResource.md)

Set a resource by ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource` | [`Resource`](pixi_core.Resource.md) |  |
| `index` | `number` | Zero-based index of resource to set |

#### Returns

[`CubeResource`](pixi_core.CubeResource.md)

- Instance for chaining

#### Inherited from

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[addResourceAt](pixi_core.AbstractMultiResource.md#addresourceat)

#### Defined in

[pixijs/packages/core/src/textures/resources/AbstractMultiResource.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/AbstractMultiResource.ts#L126)

___

### bind

▸ **bind**(`baseTexture`): `void`

Add binding.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | parent base texture |

#### Returns

`void`

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[bind](pixi_core.AbstractMultiResource.md#bind)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L78)

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

▸ **load**(): `Promise`<[`CubeResource`](pixi_core.CubeResource.md)\>

Load all the resources simultaneously

#### Returns

`Promise`<[`CubeResource`](pixi_core.CubeResource.md)\>

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

▸ **upload**(`renderer`, `_baseTexture`, `glTexture`): `boolean`

Upload the resource

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) |
| `_baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) |

#### Returns

`boolean`

true is success

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[upload](pixi_core.AbstractMultiResource.md#upload)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L137)

___

### test

▸ `Static` **test**(`source`): source is ArrayFixed<string \| Resource, 6\>

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is ArrayFixed<string \| Resource, 6\>

`true` if source is an array of 6 elements

#### Overrides

[AbstractMultiResource](pixi_core.AbstractMultiResource.md).[test](pixi_core.AbstractMultiResource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/CubeResource.ts:180](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/CubeResource.ts#L180)
