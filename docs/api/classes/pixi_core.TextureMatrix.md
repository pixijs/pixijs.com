---
id: "pixi_core.TextureMatrix"
title: "Class: TextureMatrix"
sidebar_label: "TextureMatrix"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).TextureMatrix

Class controls uv mapping from Texture normal space to BaseTexture normal space.

Takes `trim` and `rotate` into account. May contain clamp settings for Meshes and TilingSprite.

Can be used in Texture `uvMatrix` field, or separately, you can use different clamp settings on the same texture.
If you want to add support for texture region of certain feature or filter, that's what you're looking for.

Takes track of Texture changes through `_lastTextureID` private field.
Use `update()` method call to track it from outside.

**`See`**

 - PIXI.Texture
 - PIXI.Mesh
 - PIXI.TilingSprite

**`Memberof`**

PIXI

## Constructors

### constructor

• **new TextureMatrix**(`texture`, `clampMargin?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture` | [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\> | observed texture |
| `clampMargin?` | `number` | Changes frame clamping, 0.5 by default. Use -0.5 for extra border. |

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L79)

## Properties

### \_texture

• **\_texture**: [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L66)

___

### clampMargin

• **clampMargin**: `number`

Changes frame clamping
Works with TilingSprite and Mesh
Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas

**`Default`**

0.5

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L44)

___

### clampOffset

• **clampOffset**: `number`

Changes frame clamping
Works with TilingSprite and Mesh
Change to 1.5 if you texture has repeated right and bottom lines, that leads to smoother borders

**`Default`**

0

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L36)

___

### isSimple

• `Readonly` **isSimple**: `boolean`

If texture size is the same as baseTexture.

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L73)

___

### mapCoord

• `Readonly` **mapCoord**: [`Matrix`](pixi_core.Matrix.md)

Matrix operation that converts texture region coords to texture coords

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L28)

___

### uClampFrame

• `Readonly` **uClampFrame**: `Float32Array`

Clamp region for normalized coords, left-top pixel center in xy , bottom-right in zw.
Calculated based on clampOffset.

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L50)

___

### uClampOffset

• `Readonly` **uClampOffset**: `Float32Array`

Normalized clamp offset. Calculated based on clampOffset.

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L53)

## Accessors

### texture

• `get` **texture**(): [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

Texture property.

#### Returns

[`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\>

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L95)

• `set` **texture**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L100)

## Methods

### multiplyUvs

▸ **multiplyUvs**(`uvs`, `out?`): `Float32Array`

Multiplies uvs array to transform

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uvs` | `Float32Array` | mesh uvs |
| `out?` | `Float32Array` | output |

#### Returns

`Float32Array`

- output

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:112](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L112)

___

### update

▸ **update**(`forceUpdate?`): `boolean`

Updates matrices if texture was changed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forceUpdate?` | `boolean` | if true, matrices will be updated any case |

#### Returns

`boolean`

- Whether or not it was updated

#### Defined in

[pixijs/packages/core/src/textures/TextureMatrix.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureMatrix.ts#L138)
