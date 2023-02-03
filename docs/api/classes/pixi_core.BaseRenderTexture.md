---
id: "pixi_core.BaseRenderTexture"
title: "Class: BaseRenderTexture"
sidebar_label: "BaseRenderTexture"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BaseRenderTexture

A BaseRenderTexture is a special texture that allows any PixiJS display object to be rendered to it.

__Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
otherwise black rectangles will be drawn instead.

A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
and rotation of the given Display Objects is ignored. For example:

**`Example`**

```ts
import { autoDetectRenderer, BaseRenderTexture, RenderTexture, Sprite } from 'pixi.js';

const renderer = autoDetectRenderer();
const baseRenderTexture = new BaseRenderTexture({ width: 800, height: 600 });
const renderTexture = new RenderTexture(baseRenderTexture);
const sprite = Sprite.from('spinObj_01.png');

sprite.position.x = 800 / 2;
sprite.position.y = 600 / 2;
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

renderer.render(sprite, { renderTexture });

// The Sprite in this case will be rendered using its local transform.
// To render this sprite at 0,0 you can clear the transform
sprite.setTransform();

const baseRenderTexture = new BaseRenderTexture({ width: 100, height: 100 });
const renderTexture = new RenderTexture(baseRenderTexture);

renderer.render(sprite, { renderTexture }); // Renders to center of RenderTexture
```

**`Memberof`**

PIXI

## Hierarchy

- `BaseRenderTexture`

- [`BaseTexture`](pixi_core.BaseTexture.md)

  ↳ **`BaseRenderTexture`**

## Constructors

### constructor

• **new BaseRenderTexture**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\> |

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[constructor](pixi_core.BaseTexture.md#constructor)

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L64)

## Properties

### \_batchEnabled

• **\_batchEnabled**: `number`

Number of the texture batch, used by multi-texture renderers

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[_batchEnabled](pixi_core.BaseTexture.md#_batchenabled)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L182)

___

### \_batchLocation

• **\_batchLocation**: `number`

Location inside texture batch, used by multi-texture renderers

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[_batchLocation](pixi_core.BaseTexture.md#_batchlocation)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L188)

___

### \_canvasRenderTarget

• **\_canvasRenderTarget**: [`CanvasRenderTarget`](pixi_core.utils.CanvasRenderTarget.md)

#### Inherited from

GlobalMixins.BaseRenderTexture.\_canvasRenderTarget

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L16)

___

### alphaMode

• `Optional` **alphaMode**: [`ALPHA_MODES`](../enums/pixi_core.ALPHA_MODES.md)

How to treat premultiplied alpha, see PIXI.ALPHA_MODES.

**`Member`**

**`Default`**

PIXI.ALPHA_MODES.UNPACK

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[alphaMode](pixi_core.BaseTexture.md#alphamode)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L75)

___

### anisotropicLevel

• `Optional` **anisotropicLevel**: `number`

Anisotropic filtering level of texture

**`Member`**

**`Default`**

0

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[anisotropicLevel](pixi_core.BaseTexture.md#anisotropiclevel)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L82)

___

### cacheId

• **cacheId**: `string`

Currently default cache ID.

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[cacheId](pixi_core.BaseTexture.md#cacheid)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L145)

___

### clearColor

• **clearColor**: `number`[]

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L45)

___

### destroyed

• `Readonly` **destroyed**: `boolean`

Flag if BaseTexture has been destroyed.

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[destroyed](pixi_core.BaseTexture.md#destroyed)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L167)

___

### dirtyId

• `Readonly` **dirtyId**: `number`

Used by TextureSystem to only update texture to the GPU when needed.
Please call `update()` to increment it.

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[dirtyId](pixi_core.BaseTexture.md#dirtyid)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L133)

___

### filterStack

• **filterStack**: `any`[]

The data structure for the filters.

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L52)

___

### format

• `Optional` **format**: [`FORMATS`](../enums/pixi_core.FORMATS.md)

The pixel format of the texture

**`Default`**

PIXI.FORMATS.RGBA

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[format](pixi_core.BaseTexture.md#format)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L88)

___

### framebuffer

• **framebuffer**: [`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L46)

___

### height

• `Readonly` **height**: `number`

The height of the base texture set when the image has loaded

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[height](pixi_core.BaseTexture.md#height)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L61)

___

### isPowerOfTwo

• `Readonly` **isPowerOfTwo**: `boolean`

Whether or not the texture is a power of two, try to use power of two textures as much
as you can

**`Default`**

false

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[isPowerOfTwo](pixi_core.BaseTexture.md#ispoweroftwo)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L120)

___

### ktxKeyValueData

• **ktxKeyValueData**: `Map`<`string`, `DataView`\>

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[ktxKeyValueData](pixi_core.BaseTexture.md#ktxkeyvaluedata)

#### Defined in

[pixijs/packages/compressed-textures/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/compressed-textures/global.d.ts#L6)

___

### maskStack

• **maskStack**: [`MaskData`](pixi_core.MaskData.md)[]

The data structure for the stencil masks.

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L49)

___

### parentTextureArray

• **parentTextureArray**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Whether its a part of another texture, handled by ArrayResource or CubeResource

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[parentTextureArray](pixi_core.BaseTexture.md#parenttexturearray)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L194)

___

### resolution

• `Readonly` **resolution**: `number`

The resolution / device pixel ratio of the texture

**`Default`**

PIXI.settings.RESOLUTION

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[resolution](pixi_core.BaseTexture.md#resolution)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L68)

___

### resource

• `Readonly` **resource**: [`Resource`](pixi_core.Resource.md)

The resource used by this BaseTexture, there can only
be one resource per BaseTexture, but textures can share
resources.

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[resource](pixi_core.BaseTexture.md#resource)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:176](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L176)

___

### target

• `Optional` **target**: [`TARGETS`](../enums/pixi_core.TARGETS.md)

The target type

**`Default`**

PIXI.TARGETS.TEXTURE_2D

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[target](pixi_core.BaseTexture.md#target)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L100)

___

### textureCacheIds

• `Readonly` **textureCacheIds**: `string`[]

The collection of alternative cache ids, since some BaseTextures
can have more than one ID, short name and longer full URL

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[textureCacheIds](pixi_core.BaseTexture.md#texturecacheids)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L160)

___

### type

• `Optional` **type**: [`TYPES`](../enums/pixi_core.TYPES.md)

The type of resource data

**`Default`**

PIXI.TYPES.UNSIGNED_BYTE

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[type](pixi_core.BaseTexture.md#type)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L94)

___

### valid

• `Readonly` **valid**: `boolean`

Generally speaking means when resource is loaded.

**`Member`**

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[valid](pixi_core.BaseTexture.md#valid)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L152)

___

### width

• `Readonly` **width**: `number`

The width of the base texture set when the image has loaded

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[width](pixi_core.BaseTexture.md#width)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L55)

___

### \_globalBatch

▪ `Static` **\_globalBatch**: `number` = `0`

Global number of the texture batch, used by multi-texture renderers.

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[_globalBatch](pixi_core.BaseTexture.md#_globalbatch)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:779](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L779)

___

### defaultOptions

▪ `Static` **defaultOptions**: [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\>

Default options used when creating BaseTexture objects.

**`Static`**

**`Memberof`**

PIXI.BaseTexture

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[defaultOptions](pixi_core.BaseTexture.md#defaultoptions)

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

#### Inherited from

BaseTexture.mipmap

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:382](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L382)

• `set` **mipmap**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md) |

#### Returns

`void`

#### Inherited from

BaseTexture.mipmap

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:386](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L386)

___

### realHeight

• `get` **realHeight**(): `number`

Pixel height of the source of this texture

#### Returns

`number`

#### Inherited from

BaseTexture.realHeight

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L373)

___

### realWidth

• `get` **realWidth**(): `number`

Pixel width of the source of this texture

#### Returns

`number`

#### Inherited from

BaseTexture.realWidth

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

#### Inherited from

BaseTexture.scaleMode

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:399](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L399)

• `set` **scaleMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md) |

#### Returns

`void`

#### Inherited from

BaseTexture.scaleMode

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

#### Inherited from

BaseTexture.wrapMode

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:416](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L416)

• `set` **wrapMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`WRAP_MODES`](../enums/pixi_core.WRAP_MODES.md) |

#### Returns

`void`

#### Inherited from

BaseTexture.wrapMode

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:420](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L420)

## Methods

### castToBaseTexture

▸ **castToBaseTexture**(): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Utility function for BaseTexture|Texture cast.

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[castToBaseTexture](pixi_core.BaseTexture.md#casttobasetexture)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:630](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L630)

___

### destroy

▸ **destroy**(): `void`

Destroys this texture.

#### Returns

`void`

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[destroy](pixi_core.BaseTexture.md#destroy)

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L125)

___

### dispose

▸ **dispose**(): `void`

Frees the texture and framebuffer from WebGL memory without destroying this texture object.
This means you can still use the texture later which will upload it to GPU
memory again.

**`Fires`**

PIXI.BaseTexture#dispose

#### Returns

`void`

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[dispose](pixi_core.BaseTexture.md#dispose)

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L117)

___

### getDrawableSource

▸ `Optional` **getDrawableSource**(): `CanvasImageSource`

#### Returns

`CanvasImageSource`

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[getDrawableSource](pixi_core.BaseTexture.md#getdrawablesource)

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L5)

___

### resize

▸ **resize**(`desiredWidth`, `desiredHeight`): `void`

Resizes the BaseRenderTexture.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredWidth` | `number` | The desired width to resize to. |
| `desiredHeight` | `number` | The desired height to resize to. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/BaseRenderTexture.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/BaseRenderTexture.ts#L105)

___

### setRealSize

▸ **setRealSize**(`realWidth`, `realHeight`, `resolution?`): [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

Sets real size of baseTexture, preserves current resolution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realWidth` | `number` | Full rendered width |
| `realHeight` | `number` | Full rendered height |
| `resolution?` | `number` | Optionally set resolution |

#### Returns

[`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

- this

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[setRealSize](pixi_core.BaseTexture.md#setrealsize)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:480](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L480)

___

### setResolution

▸ **setResolution**(`resolution`): [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

Changes resolution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolution` | `number` | res |

#### Returns

[`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

- this

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[setResolution](pixi_core.BaseTexture.md#setresolution)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:505](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L505)

___

### setResource

▸ **setResource**(`resource`): [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

Sets the resource if it wasn't set. Throws error if resource already present

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource` | [`Resource`](pixi_core.Resource.md) | that is managing this BaseTexture |

#### Returns

[`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

- this

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[setResource](pixi_core.BaseTexture.md#setresource)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:533](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L533)

___

### setSize

▸ **setSize**(`desiredWidth`, `desiredHeight`, `resolution?`): [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredWidth` | `number` | Desired visual width |
| `desiredHeight` | `number` | Desired visual height |
| `resolution?` | `number` | Optionally set resolution |

#### Returns

[`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

- this

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[setSize](pixi_core.BaseTexture.md#setsize)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:466](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L466)

___

### setStyle

▸ **setStyle**(`scaleMode?`, `mipmap?`): [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

Changes style options of BaseTexture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scaleMode?` | [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md) | Pixi scalemode |
| `mipmap?` | [`MIPMAP_MODES`](../enums/pixi_core.MIPMAP_MODES.md) | enable mipmaps |

#### Returns

[`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

- this

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[setStyle](pixi_core.BaseTexture.md#setstyle)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:435](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L435)

___

### update

▸ **update**(): `void`

Invalidates the object. Texture becomes valid if width and height are greater than zero.

#### Returns

`void`

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[update](pixi_core.BaseTexture.md#update)

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

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[addToCache](pixi_core.BaseTexture.md#addtocache)

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

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[from](pixi_core.BaseTexture.md#from)

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

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[fromBuffer](pixi_core.BaseTexture.md#frombuffer)

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

#### Inherited from

[BaseTexture](pixi_core.BaseTexture.md).[removeFromCache](pixi_core.BaseTexture.md#removefromcache)

#### Defined in

[pixijs/packages/core/src/textures/BaseTexture.ts:743](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/BaseTexture.ts#L743)
