---
id: "pixi_core.BaseTexture"
title: "Class: BaseTexture<R, RO>"
sidebar_label: "BaseTexture"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BaseTexture

A Texture stores the information that represents an image.
All textures have a base texture, which contains information about the source.
Therefore you can have many textures all using a single BaseTexture

**`Memberof`**

PIXI

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md) = [`Resource`](pixi_core.Resource.md) | The BaseTexture's Resource type. |
| `RO` | [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions) | The options for constructing resource. |

## Hierarchy

- `BaseTexture`

- `EventEmitter`

  ↳ **`BaseTexture`**

  ↳↳ [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

## Constructors

### constructor

• **new BaseTexture**<`R`, `RO`\>(`resource?`, `options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |
| `RO` | [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions) |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `resource?` | `any` | `null` | The current resource to use, for things that aren't Resource objects, will be converted into a Resource. |
| `options` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`RO`\> | `null` | Collection of options, default options inherited from PIXI.BaseTexture.defaultOptions. |

#### Inherited from

GlobalMixins.BaseTexture.constructor

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:272](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L272)

## Properties

### \_batchEnabled

• **\_batchEnabled**: `number`

Number of the texture batch, used by multi-texture renderers

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L182)

___

### \_batchLocation

• **\_batchLocation**: `number`

Location inside texture batch, used by multi-texture renderers

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L188)

___

### alphaMode

• `Optional` **alphaMode**: [`ALPHA_MODES`](../enums/pixi_core.ALPHA_MODES.md)

How to treat premultiplied alpha, see PIXI.ALPHA_MODES.

**`Member`**

**`Default`**

PIXI.ALPHA_MODES.UNPACK

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L75)

___

### anisotropicLevel

• `Optional` **anisotropicLevel**: `number`

Anisotropic filtering level of texture

**`Member`**

**`Default`**

0

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L82)

___

### cacheId

• **cacheId**: `string`

Currently default cache ID.

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L145)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

Flag if BaseTexture has been destroyed.

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L167)

___

### dirtyId

• `Readonly` **dirtyId**: `number`

Used by TextureSystem to only update texture to the GPU when needed.
Please call `update()` to increment it.

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L133)

___

### format

• `Optional` **format**: [`FORMATS`](../enums/pixi_core.FORMATS.md)

The pixel format of the texture

**`Default`**

PIXI.FORMATS.RGBA

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L88)

___

### height

• `Readonly` **height**: `number`

The height of the base texture set when the image has loaded

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L61)

___

### isPowerOfTwo

• `Readonly` **isPowerOfTwo**: `boolean`

Whether or not the texture is a power of two, try to use power of two textures as much
as you can

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L120)

___

### ktxKeyValueData

• **ktxKeyValueData**: `Map`<`string`, `DataView`\>

#### Inherited from

GlobalMixins.BaseTexture.ktxKeyValueData

#### Defined in

[pixijs/packages/compressed-textures/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/global.d.ts#L6)

___

### parentTextureArray

• **parentTextureArray**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Whether its a part of another texture, handled by ArrayResource or CubeResource

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L194)

___

### resolution

• `Readonly` **resolution**: `number`

The resolution / device pixel ratio of the texture

**`Default`**

PIXI.settings.RESOLUTION

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L68)

___

### resource

• `Readonly` **resource**: `R`

The resource used by this BaseTexture, there can only
be one resource per BaseTexture, but textures can share
resources.

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:176](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L176)

___

### target

• `Optional` **target**: [`TARGETS`](../enums/pixi_core.TARGETS.md)

The target type

**`Default`**

PIXI.TARGETS.TEXTURE_2D

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L100)

___

### textureCacheIds

• `Readonly` **textureCacheIds**: `string`[]

The collection of alternative cache ids, since some BaseTextures
can have more than one ID, short name and longer full URL

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L160)

___

### type

• `Optional` **type**: [`TYPES`](../enums/pixi_core.TYPES.md)

The type of resource data

**`Default`**

PIXI.TYPES.UNSIGNED_BYTE

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L94)

___

### valid

• `Readonly` **valid**: `boolean`

Generally speaking means when resource is loaded.

**`Member`**

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L152)

___

### width

• `Readonly` **width**: `number`

The width of the base texture set when the image has loaded

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L55)

___

### \_globalBatch

▪ `Static` **\_globalBatch**: `number` = `0`

Global number of the texture batch, used by multi-texture renderers.

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:779](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L779)

___

### defaultOptions

▪ `Static` **defaultOptions**: [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\>

Default options used when creating BaseTexture objects.

**`Static`**

**`Memberof`**

PIXI.BaseTexture

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:206](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L206)

## Accessors

### mipmap

• `get` **mipmap**(): [`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md)

Mipmap mode of the texture, affects downscaled images

**`Default`**

PIXI.MIPMAP_MODES.POW2

#### Returns

[`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:382](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L382)

• `set` **mipmap**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:386](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L386)

___

### realHeight

• `get` **realHeight**(): `number`

Pixel height of the source of this texture

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L373)

___

### realWidth

• `get` **realWidth**(): `number`

Pixel width of the source of this texture

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:364](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L364)

___

### scaleMode

• `get` **scaleMode**(): [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md)

The scale mode to apply when scaling this texture

**`Default`**

PIXI.SCALE_MODES.LINEAR

#### Returns

[`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:399](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L399)

• `set` **scaleMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L403)

___

### wrapMode

• `get` **wrapMode**(): [`WRAP_MODES`](../enums/pixi_core.WRAP_MODES.md)

How the texture wraps

**`Default`**

PIXI.WRAP_MODES.CLAMP

#### Returns

[`WRAP_MODES`](../enums/pixi_core.WRAP_MODES.md)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:416](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L416)

• `set` **wrapMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`WRAP_MODES`](../enums/pixi_core.WRAP_MODES.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:420](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L420)

## Methods

### castToBaseTexture

▸ **castToBaseTexture**(): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Utility function for BaseTexture|Texture cast.

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:630](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L630)

___

### destroy

▸ **destroy**(): `void`

Destroys this base texture.
The method stops if resource doesn't want this texture to be destroyed.
Removes texture from all caches.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:587](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L587)

___

### dispose

▸ **dispose**(): `void`

Frees the texture from WebGL memory without destroying this texture object.
This means you can still use the texture later which will upload it to GPU
memory again.

**`Fires`**

PIXI.BaseTexture#dispose

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:624](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L624)

___

### getDrawableSource

▸ `Optional` **getDrawableSource**(): `CanvasImageSource`

#### Returns

`CanvasImageSource`

#### Inherited from

GlobalMixins.BaseTexture.getDrawableSource

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L5)

___

### setRealSize

▸ **setRealSize**(`realWidth`, `realHeight`, `resolution?`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

Sets real size of baseTexture, preserves current resolution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realWidth` | `number` | Full rendered width |
| `realHeight` | `number` | Full rendered height |
| `resolution?` | `number` | Optionally set resolution |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

- this

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:480](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L480)

___

### setResolution

▸ **setResolution**(`resolution`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

Changes resolution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolution` | `number` | res |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

- this

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:505](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L505)

___

### setResource

▸ **setResource**(`resource`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

Sets the resource if it wasn't set. Throws error if resource already present

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource` | `R` | that is managing this BaseTexture |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

- this

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:533](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L533)

___

### setSize

▸ **setSize**(`desiredWidth`, `desiredHeight`, `resolution?`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredWidth` | `number` | Desired visual width |
| `desiredHeight` | `number` | Desired visual height |
| `resolution?` | `number` | Optionally set resolution |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

- this

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:466](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L466)

___

### setStyle

▸ **setStyle**(`scaleMode?`, `mipmap?`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

Changes style options of BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scaleMode?` | [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md) | Pixi scalemode |
| `mipmap?` | [`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md) | enable mipmaps |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, `RO`\>

- this

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:435](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L435)

___

### update

▸ **update**(): `void`

Invalidates the object. Texture becomes valid if width and height are greater than zero.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:553](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L553)

___

### addToCache

▸ `Static` **addToCache**(`baseTexture`, `id`): `void`

Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | The BaseTexture to add to the cache. |
| `id` | `string` | The id that the BaseTexture will be stored against. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:718](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L718)

___

### from

▸ `Static` **from**<`R`, `RO`\>(`source`, `options?`, `strict?`): [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Helper function that creates a base texture based on the source you provide.
The source can be - image url, image element, canvas element. If the
source is an image url or an image element and not in the base texture
cache, it will be created and loaded.

**`Static`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |
| `RO` | [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions) |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `source` | `string` \| `string`[] \| [`ImageSource`](../modules/pixi_core.md#imagesource) | `undefined` | The source to create base texture from. |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`RO`\> | `undefined` | See PIXI.BaseTexture's constructor for options. |
| `strict?` | `boolean` | `settings.STRICT_TEXTURE_CACHE` | Enforce strict-mode, see PIXI.settings.STRICT_TEXTURE_CACHE. |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<`R`, [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

The new base texture.

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:648](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L648)

___

### fromBuffer

▸ `Static` **fromBuffer**(`buffer`, `width`, `height`, `options?`): [`BaseTexture`](pixi_core.BaseTexture.md)<[`BufferResource`](pixi_core.BufferResource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Create a new BaseTexture with a BufferResource from a Float32Array.
RGBA values are floats from 0 to 1.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | `Uint8Array` \| `Float32Array` | The optional array to use, if no data is provided, a new Float32Array is created. |
| `width` | `number` | Width of the resource |
| `height` | `number` | Height of the resource |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\> | See PIXI.BaseTexture's constructor for options. Default properties are different from the constructor's defaults. |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`BufferResource`](pixi_core.BufferResource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

- The resulting new BaseTexture

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:702](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L702)

___

### removeFromCache

▸ `Static` **removeFromCache**(`baseTexture`): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Remove a BaseTexture from the global BaseTextureCache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | `string` \| [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | id of a BaseTexture to be removed, or a BaseTexture instance itself. |

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

The BaseTexture that was removed.

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:743](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L743)
