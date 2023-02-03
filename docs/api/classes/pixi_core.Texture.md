---
id: "pixi_core.Texture"
title: "Class: Texture<R>"
sidebar_label: "Texture"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Texture

A texture stores the information that represents an image or part of an image.

It cannot be added to the display list directly; instead use it as the texture for a Sprite.
If no frame is provided for a texture, then the whole image is used.

You can directly create a texture from an image and then reuse it multiple times like this :

```js
import { Sprite, Texture } from 'pixi.js';

const texture = Texture.from('assets/image.png');
const sprite1 = new Sprite(texture);
const sprite2 = new Sprite(texture);
```

If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.

Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
You can check for this by checking the sprite's _textureID property.

```js
import { Sprite, Texture } from 'pixi.js';

const texture = Texture.from('assets/image.svg');
const sprite1 = new Sprite(texture);
// sprite1._textureID should not be undefined if the texture has finished processing the SVG file
```

You can use a ticker or rAF to ensure your sprites load the finished textures after processing.
See issue [#3085][https://github.com/pixijs/pixijs/issues/3085](https://github.com/pixijs/pixijs/issues/3085).

**`Memberof`**

PIXI

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md) = [`Resource`](pixi_core.Resource.md) | The BaseTexture's Resource type. |

## Hierarchy

- `Texture`

- `EventEmitter`

  ↳ **`Texture`**

  ↳↳ [`RenderTexture`](pixi_core.RenderTexture.md)

## Constructors

### constructor

• **new Texture**<`R`\>(`baseTexture`, `frame?`, `orig?`, `trim?`, `rotate?`, `anchor?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends [`Resource`](pixi_core.Resource.md)<`R`\> = [`Resource`](pixi_core.Resource.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseTexture` | [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | The base texture source to create the texture from |
| `frame?` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle frame of the texture to show |
| `orig?` | [`Rectangle`](pixi_core.Rectangle.md) | The area of original texture |
| `trim?` | [`Rectangle`](pixi_core.Rectangle.md) | Trimmed rectangle of original texture |
| `rotate?` | `number` | indicates how the texture was rotated by texture packer. See PIXI.groupD8 |
| `anchor?` | [`IPointData`](../interfaces/pixi_core.IPointData.md) | Default anchor point used for sprite placement / rotation |

#### Inherited from

GlobalMixins.Texture.constructor

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:146](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L146)

## Properties

### \_frame

• **\_frame**: [`Rectangle`](pixi_core.Rectangle.md)

This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L123)

___

### baseTexture

• **baseTexture**: [`BaseTexture`](pixi_core.BaseTexture.md)<`R`, [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

The base texture that this texture uses.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L71)

___

### defaultAnchor

• **defaultAnchor**: [`Point`](pixi_core.Point.md)

Anchor point that is used as default if sprite is created with this texture.
Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.

**`Default`**

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L106)

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

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L99)

___

### orig

• **orig**: [`Rectangle`](pixi_core.Rectangle.md)

This is the area of original texture, before it was put in atlas.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L74)

___

### patternCache

• `Optional` **patternCache**: `Object`

#### Index signature

▪ [key: `string`]: `CanvasPattern`

#### Inherited from

GlobalMixins.Texture.patternCache

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L10)

___

### textureCacheIds

• **textureCacheIds**: `string`[]

The ids under which this Texture has been added to the texture cache. This is
automatically set as long as Texture.addToCache is used, but may not be set if a
Texture is added directly to the TextureCache array.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L136)

___

### tintCache

• `Optional` **tintCache**: `Object`

#### Index signature

▪ [key: `string`]: `ICanvas` \| `HTMLImageElement`

#### Inherited from

GlobalMixins.Texture.tintCache

#### Defined in

[pixijs/packages/canvas-renderer/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/global.d.ts#L11)

___

### trim

• **trim**: [`Rectangle`](pixi_core.Rectangle.md)

This is the trimmed area of original texture, before it was put in atlas
Please call `updateUvs()` after you change coordinates of `trim` manually.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L80)

___

### uvMatrix

• **uvMatrix**: [`TextureMatrix`](pixi_core.TextureMatrix.md)

Default TextureMatrix instance for this texture. By default, that object is not created because its heavy.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L109)

___

### valid

• **valid**: `boolean`

This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L83)

## Accessors

### frame

• `get` **frame**(): [`Rectangle`](pixi_core.Rectangle.md)

The frame specifies the region of the base texture that this texture uses.
Please call `updateUvs()` after you change coordinates of `frame` manually.

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:592](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L592)

• `set` **frame**(`frame`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `frame` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:597](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L597)

___

### height

• `get` **height**(): `number`

The height of the Texture in pixels.

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:658](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L658)

___

### resolution

• `get` **resolution**(): `number`

Returns resolution of baseTexture

#### Returns

`number`

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

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:637](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L637)

• `set` **rotate**(`rotate`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotate` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:642](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L642)

___

### width

• `get` **width**(): `number`

The width of the Texture in pixels.

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:652](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L652)

___

### EMPTY

• `Static` `get` **EMPTY**(): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

An empty texture, used often to not have to create multiple empty textures. Can not be destroyed.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:673](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L673)

___

### WHITE

• `Static` `get` **WHITE**(): [`Texture`](pixi_core.Texture.md)<[`CanvasResource`](pixi_core.CanvasResource.md)\>

A white texture of 16x16 size, used for graphics and other things Can not be destroyed.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`CanvasResource`](pixi_core.CanvasResource.md)\>

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:686](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L686)

## Methods

### castToBaseTexture

▸ **castToBaseTexture**(): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Utility function for BaseTexture|Texture cast.

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:664](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L664)

___

### clone

▸ **clone**(): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

Creates a new texture object that acts the same as this one.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

- The new texture

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

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:261](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L261)

___

### update

▸ **update**(): `void`

Updates this texture on the gpu.

Calls the TextureResource update.

If you adjusted `frame` manually, please call `updateUvs()` instead.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L220)

___

### updateUvs

▸ **updateUvs**(): `void`

Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
Call it after changing the frame

#### Returns

`void`

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

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:515](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L515)

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

#### Defined in

[pixijs/packages/core/src/textures/Texture.ts:540](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/Texture.ts#L540)
