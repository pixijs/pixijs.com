---
id: "pixi_core.RenderTexture"
title: "Class: RenderTexture"
sidebar_label: "RenderTexture"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).RenderTexture

A RenderTexture is a special texture that allows any PixiJS display object to be rendered to it.

__Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
otherwise black rectangles will be drawn instead.

__Hint-2__: The actual memory allocation will happen on first render.
You shouldn't create renderTextures each frame just to delete them after, try to reuse them.

A RenderTexture takes a snapshot of any Display Object given to its render method. For example:

**`Example`**

```ts
import { autoDetectRenderer, RenderTexture, Sprite } from 'pixi.js';

const renderer = autoDetectRenderer();
const renderTexture = RenderTexture.create({ width: 800, height: 600 });
const sprite = Sprite.from('spinObj_01.png');

sprite.position.x = 800 / 2;
sprite.position.y = 600 / 2;
sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

renderer.render(sprite, { renderTexture });

// Note that you should not create a new renderer, but reuse the same one as the rest of the application.
// The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
// you can clear the transform

sprite.setTransform();

const renderTexture = new RenderTexture.create({ width: 100, height: 100 });

renderer.render(sprite, { renderTexture });  // Renders to center of RenderTexture
```

**`Memberof`**

PIXI

## Hierarchy

- [`Texture`](pixi_core.Texture.md)

  ↳ **`RenderTexture`**

## Constructors

### constructor

• **new RenderTexture**(`baseRenderTexture`, `frame?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseRenderTexture` | [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md) | The base texture object that this texture uses. |
| `frame?` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle frame of the texture to show. |

#### Overrides

[Texture](pixi_core.Texture.md).[constructor](pixi_core.Texture.md#constructor)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L66)

## Properties

### \_frame

• **\_frame**: [`Rectangle`](pixi_core.Rectangle.md)

This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)

#### Inherited from

[Texture](pixi_core.Texture.md).[_frame](pixi_core.Texture.md#_frame)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L123)

___

### baseTexture

• **baseTexture**: [`BaseRenderTexture`](pixi_core.BaseRenderTexture.md)

The base texture that this texture uses.

#### Overrides

[Texture](pixi_core.Texture.md).[baseTexture](pixi_core.Texture.md#basetexture)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L46)

___

### defaultAnchor

• **defaultAnchor**: [`Point`](pixi_core.Point.md)

Anchor point that is used as default if sprite is created with this texture.
Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.

**`Default`**

#### Inherited from

[Texture](pixi_core.Texture.md).[defaultAnchor](pixi_core.Texture.md#defaultanchor)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L106)

___

### filterFrame

• `Readonly` **filterFrame**: [`Rectangle`](pixi_core.Rectangle.md)

Stores `sourceFrame` when this texture is inside current filter stack.

You can read it inside filters.

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L54)

___

### filterPoolKey

• **filterPoolKey**: `string` \| `number`

The key for pooled texture of FilterSystem.

**`See`**

PIXI.RenderTexturePool

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L60)

___

### noFrame

• **noFrame**: `boolean`

Does this Texture have any frame data assigned to it?

This mode is enabled automatically if no frame was passed inside constructor.

In this mode texture is subscribed to baseTexture events, and fires `update` on any change.

Beware, after loading or resize of baseTexture event can fired two times!
If you want more control, subscribe on baseTexture itself.

Any assignment of `frame` switches off `noFrame` mode.

**`Example`**

```ts
texture.on('update', () => {});
```

#### Inherited from

[Texture](pixi_core.Texture.md).[noFrame](pixi_core.Texture.md#noframe)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L99)

___

### orig

• **orig**: [`Rectangle`](pixi_core.Rectangle.md)

This is the area of original texture, before it was put in atlas.

#### Inherited from

[Texture](pixi_core.Texture.md).[orig](pixi_core.Texture.md#orig)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L74)

___

### patternCache

• `Optional` **patternCache**: `Object`

#### Index signature

▪ [key: `string`]: `CanvasPattern`

#### Inherited from

[Texture](pixi_core.Texture.md).[patternCache](pixi_core.Texture.md#patterncache)

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L10)

___

### textureCacheIds

• **textureCacheIds**: `string`[]

The ids under which this Texture has been added to the texture cache. This is
automatically set as long as Texture.addToCache is used, but may not be set if a
Texture is added directly to the TextureCache array.

#### Inherited from

[Texture](pixi_core.Texture.md).[textureCacheIds](pixi_core.Texture.md#texturecacheids)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L136)

___

### tintCache

• `Optional` **tintCache**: `Object`

#### Index signature

▪ [key: `string`]: `ICanvas` \| `HTMLImageElement`

#### Inherited from

[Texture](pixi_core.Texture.md).[tintCache](pixi_core.Texture.md#tintcache)

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L11)

___

### trim

• **trim**: [`Rectangle`](pixi_core.Rectangle.md)

This is the trimmed area of original texture, before it was put in atlas
Please call `updateUvs()` after you change coordinates of `trim` manually.

#### Inherited from

[Texture](pixi_core.Texture.md).[trim](pixi_core.Texture.md#trim)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L80)

___

### uvMatrix

• **uvMatrix**: [`TextureMatrix`](pixi_core.TextureMatrix.md)

Default TextureMatrix instance for this texture. By default, that object is not created because its heavy.

#### Inherited from

[Texture](pixi_core.Texture.md).[uvMatrix](pixi_core.Texture.md#uvmatrix)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L109)

___

### valid

• **valid**: `boolean`

This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.

#### Inherited from

[Texture](pixi_core.Texture.md).[valid](pixi_core.Texture.md#valid)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L83)

## Accessors

### frame

• `get` **frame**(): [`Rectangle`](pixi_core.Rectangle.md)

The frame specifies the region of the base texture that this texture uses.
Please call `updateUvs()` after you change coordinates of `frame` manually.

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Inherited from

Texture.frame

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:592](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L592)

• `set` **frame**(`frame`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `frame` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

`void`

#### Inherited from

Texture.frame

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:597](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L597)

___

### framebuffer

• `get` **framebuffer**(): [`Framebuffer`](pixi_core.Framebuffer.md)

Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.

#### Returns

[`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L82)

___

### height

• `get` **height**(): `number`

The height of the Texture in pixels.

#### Returns

`number`

#### Inherited from

Texture.height

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:658](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L658)

___

### multisample

• `get` **multisample**(): [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

Shortcut to `this.framebuffer.multisample`.

**`Default`**

PIXI.MSAA_QUALITY.NONE

#### Returns

[`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L91)

• `set` **multisample**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L96)

___

### resolution

• `get` **resolution**(): `number`

Returns resolution of baseTexture

#### Returns

`number`

#### Inherited from

Texture.resolution

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:583](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L583)

___

### rotate

• `get` **rotate**(): `number`

Indicates whether the texture is rotated inside the atlas
set to 2 to compensate for texture packer rotation
set to 6 to compensate for spine packer rotation
can be used to rotate or mirror sprites
See PIXI.groupD8 for explanation

#### Returns

`number`

#### Inherited from

Texture.rotate

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:637](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L637)

• `set` **rotate**(`rotate`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotate` | `number` |

#### Returns

`void`

#### Inherited from

Texture.rotate

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:642](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L642)

___

### width

• `get` **width**(): `number`

The width of the Texture in pixels.

#### Returns

`number`

#### Inherited from

Texture.width

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:652](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L652)

___

### EMPTY

• `Static` `get` **EMPTY**(): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

An empty texture, used often to not have to create multiple empty textures. Can not be destroyed.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

#### Inherited from

Texture.EMPTY

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:673](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L673)

___

### WHITE

• `Static` `get` **WHITE**(): [`Texture`](pixi_core.Texture.md)<[`CanvasResource`](pixi_core.CanvasResource.md)\>

A white texture of 16x16 size, used for graphics and other things Can not be destroyed.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`CanvasResource`](pixi_core.CanvasResource.md)\>

#### Inherited from

Texture.WHITE

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:686](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L686)

## Methods

### castToBaseTexture

▸ **castToBaseTexture**(): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Utility function for BaseTexture|Texture cast.

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Inherited from

[Texture](pixi_core.Texture.md).[castToBaseTexture](pixi_core.Texture.md#casttobasetexture)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:664](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L664)

___

### clone

▸ **clone**(): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

Creates a new texture object that acts the same as this one.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

- The new texture

#### Inherited from

[Texture](pixi_core.Texture.md).[clone](pixi_core.Texture.md#clone)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:300](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L300)

___

### destroy

▸ **destroy**(`destroyBase?`): `void`

Destroys this texture

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destroyBase?` | `boolean` | Whether to destroy the base texture as well |

#### Returns

`void`

#### Inherited from

[Texture](pixi_core.Texture.md).[destroy](pixi_core.Texture.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:261](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L261)

___

### resize

▸ **resize**(`desiredWidth`, `desiredHeight`, `resizeBaseTexture?`): `void`

Resizes the RenderTexture.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `desiredWidth` | `number` | `undefined` | The desired width to resize to. |
| `desiredHeight` | `number` | `undefined` | The desired height to resize to. |
| `resizeBaseTexture` | `boolean` | `true` | Should the baseTexture.width and height values be resized as well? |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L107)

___

### setResolution

▸ **setResolution**(`resolution`): `void`

Changes the resolution of baseTexture, but does not change framebuffer size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolution` | `number` | The new resolution to apply to RenderTexture |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L131)

___

### update

▸ **update**(): `void`

Updates this texture on the gpu.

Calls the TextureResource update.

If you adjusted `frame` manually, please call `updateUvs()` instead.

#### Returns

`void`

#### Inherited from

[Texture](pixi_core.Texture.md).[update](pixi_core.Texture.md#update)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L220)

___

### updateUvs

▸ **updateUvs**(): `void`

Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
Call it after changing the frame

#### Returns

`void`

#### Inherited from

[Texture](pixi_core.Texture.md).[updateUvs](pixi_core.Texture.md#updateuvs)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:324](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L324)

___

### addToCache

▸ `Static` **addToCache**(`texture`, `id`): `void`

Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture` | [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\> | The Texture to add to the cache. |
| `id` | `string` | The id that the Texture will be stored against. |

#### Returns

`void`

#### Inherited from

[Texture](pixi_core.Texture.md).[addToCache](pixi_core.Texture.md#addtocache)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:515](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L515)

___

### create

▸ `Static` **create**(`options?`): [`RenderTexture`](pixi_core.RenderTexture.md)

A short hand way of creating a render texture.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\> | Options |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

The new render texture

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexture.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexture.ts#L156)

___

### from

▸ `Static` **from**<`R`, `RO`\>(`source`, `options?`, `strict?`): [`Texture`](pixi_core.Texture.md)<`R`\>

Helper function that creates a new Texture based on the source you provide.
The source can be - frame id, image url, video url, canvas element, video element, base texture

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |
| `RO` | `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `source` | [`TextureSource`](../modules/pixi_core.md#texturesource) \| [`TextureSource`](../modules/pixi_core.md#texturesource)[] | `undefined` | Source or array of sources to create texture from |
| `options` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`RO`\> | `{}` | See PIXI.BaseTexture's constructor for options. |
| `strict?` | `boolean` | `settings.STRICT_TEXTURE_CACHE` | Enforce strict-mode, see PIXI.settings.STRICT_TEXTURE_CACHE. |

#### Returns

[`Texture`](pixi_core.Texture.md)<`R`\>

The newly created texture

#### Inherited from

[Texture](pixi_core.Texture.md).[from](pixi_core.Texture.md#from)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:346](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L346)

___

### fromBuffer

▸ `Static` **fromBuffer**(`buffer`, `width`, `height`, `options?`): [`Texture`](pixi_core.Texture.md)<[`BufferResource`](pixi_core.BufferResource.md)\>

Create a new Texture with a BufferResource from a Float32Array.
RGBA values are floats from 0 to 1.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | `Uint8Array` \| `Float32Array` | The optional array to use, if no data is provided, a new Float32Array is created. |
| `width` | `number` | Width of the resource |
| `height` | `number` | Height of the resource |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<[`ISize`](../interfaces/pixi_core.ISize.md)\> | See PIXI.BaseTexture's constructor for options. |

#### Returns

[`Texture`](pixi_core.Texture.md)<[`BufferResource`](pixi_core.BufferResource.md)\>

- The resulting new BaseTexture

#### Inherited from

[Texture](pixi_core.Texture.md).[fromBuffer](pixi_core.Texture.md#frombuffer)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:448](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L448)

___

### fromLoader

▸ `Static` **fromLoader**<`R`\>(`source`, `imageUrl`, `name?`, `options?`): `Promise`<[`Texture`](pixi_core.Texture.md)<`R`\>\>

Create a texture from a source and add to the cache.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| [`ImageSource`](../modules/pixi_core.md#imagesource) | The input source. |
| `imageUrl` | `string` | File name of texture, for cache and resolving resolution. |
| `name?` | `string` | Human readable name for the texture cache. If no name is specified, only `imageUrl` will be used as the cache ID. |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\> |  |

#### Returns

`Promise`<[`Texture`](pixi_core.Texture.md)<`R`\>\>

- Output texture

#### Inherited from

[Texture](pixi_core.Texture.md).[fromLoader](pixi_core.Texture.md#fromloader)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:463](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L463)

___

### fromURL

▸ `Static` **fromURL**<`R`, `RO`\>(`url`, `options?`): `Promise`<[`Texture`](pixi_core.Texture.md)<`R`\>\>

Useful for loading textures via URLs. Use instead of `Texture.from` because
it does a better job of handling failed URLs more effectively. This also ignores
`PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |
| `RO` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `string`[] | The remote URL or array of URLs to load. |
| `options?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`RO`\> | Optional options to include |

#### Returns

`Promise`<[`Texture`](pixi_core.Texture.md)<`R`\>\>

- A Promise that resolves to a Texture.

#### Inherited from

[Texture](pixi_core.Texture.md).[fromURL](pixi_core.Texture.md#fromurl)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:421](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L421)

___

### removeFromCache

▸ `Static` **removeFromCache**(`texture`): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

Remove a Texture from the global TextureCache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture` | `string` \| [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\> | id of a Texture to be removed, or a Texture instance itself |

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

- The Texture that was removed

#### Inherited from

[Texture](pixi_core.Texture.md).[removeFromCache](pixi_core.Texture.md#removefromcache)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:540](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L540)
