---
id: "pixi_core.GLTexture"
title: "Class: GLTexture"
sidebar_label: "GLTexture"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).GLTexture

Internal texture for WebGL context.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new GLTexture**(`texture`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `texture` | `WebGLTexture` |

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L39)

## Properties

### dirtyId

• **dirtyId**: `number`

Texture contents dirty flag.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L34)

___

### dirtyStyleId

• **dirtyStyleId**: `number`

Texture style dirty flag.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L37)

___

### height

• **height**: `number`

Height of texture that was used in texImage2D.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L16)

___

### internalFormat

• **internalFormat**: `number`

Type copied from baseTexture.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L28)

___

### mipmap

• **mipmap**: `boolean`

Whether mip levels has to be generated.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L19)

___

### samplerType

• **samplerType**: `number`

Type of sampler corresponding to this texture. See PIXI.SAMPLER_TYPES

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L31)

___

### texture

• **texture**: `WebGLTexture`

The WebGL texture.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L10)

___

### type

• **type**: `number`

Type copied from baseTexture.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L25)

___

### width

• **width**: `number`

Width of texture that was used in texImage2D.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L13)

___

### wrapMode

• **wrapMode**: `number`

WrapMode copied from baseTexture.

#### Defined in

[pixijs/packages/core/src/textures/GLTexture.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/GLTexture.ts#L22)
