---
id: "pixi_core.BufferResource"
title: "Class: BufferResource"
sidebar_label: "BufferResource"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BufferResource

Buffer resource with data of typed array.

**`Memberof`**

PIXI

## Hierarchy

- [`Resource`](pixi_core.Resource.md)

  ↳ **`BufferResource`**

## Constructors

### constructor

• **new BufferResource**(`source`, `options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `Uint8Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array` | Source buffer |
| `options` | [`ISize`](../interfaces/pixi_core.ISize.md) | Options |

#### Overrides

[Resource](pixi_core.Resource.md).[constructor](pixi_core.Resource.md#constructor)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L27)

## Properties

### data

• **data**: `Uint8Array` \| `Uint16Array` \| `Int32Array` \| `Uint32Array` \| `Float32Array`

Source array Cannot be {@code ClampedUint8Array} because it cant be uploaded to WebGL

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L19)

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

Destroy and don't use after this.

#### Returns

`void`

#### Overrides

[Resource](pixi_core.Resource.md).[dispose](pixi_core.Resource.md#dispose)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L93)

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

Has been updated trigger event.

#### Returns

`void`

#### Inherited from

[Resource](pixi_core.Resource.md).[update](pixi_core.Resource.md#update)

#### Defined in

[pixijs/packages/core/src/textures/resources/Resource.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/Resource.ts#L133)

___

### upload

▸ **upload**(`renderer`, `baseTexture`, `glTexture`): `boolean`

Upload the texture to the GPU.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | Upload to the renderer |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Reference to parent texture |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) | glTexture |

#### Returns

`boolean`

- true is success

#### Overrides

[Resource](pixi_core.Resource.md).[upload](pixi_core.Resource.md#upload)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L48)

___

### test

▸ `Static` **test**(`source`): source is Uint8Array \| Uint32Array \| Float32Array

Used to auto-detect the type of resource.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `unknown` | The source object |

#### Returns

source is Uint8Array \| Uint32Array \| Float32Array

true if `<canvas>`

#### Overrides

[Resource](pixi_core.Resource.md).[test](pixi_core.Resource.md#test)

#### Defined in

[pixijs/packages/core/src/textures/resources/BufferResource.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/resources/BufferResource.ts#L103)
