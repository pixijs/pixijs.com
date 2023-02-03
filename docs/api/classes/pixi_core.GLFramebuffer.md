---
id: "pixi_core.GLFramebuffer"
title: "Class: GLFramebuffer"
sidebar_label: "GLFramebuffer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).GLFramebuffer

Internal framebuffer for WebGL context.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new GLFramebuffer**(`framebuffer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `framebuffer` | `WebGLTexture` |

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L41)

## Properties

### blitFramebuffer

• **blitFramebuffer**: [`Framebuffer`](pixi_core.Framebuffer.md)

In case we use MSAA, this is actual framebuffer that has colorTextures[0]
The contents of that framebuffer are read when we use that renderTexture in sprites

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L27)

___

### dirtyFormat

• **dirtyFormat**: `number`

Latest known version of framebuffer format.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L33)

___

### dirtyId

• **dirtyId**: `number`

Latest known version of framebuffer.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L30)

___

### dirtySize

• **dirtySize**: `number`

Latest known version of framebuffer size.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L36)

___

### framebuffer

• **framebuffer**: `WebGLFramebuffer`

The WebGL framebuffer.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L12)

___

### mipLevel

• **mipLevel**: `number`

Store the current mipmap of the textures the framebuffer will write too.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L39)

___

### msaaBuffer

• **msaaBuffer**: `WebGLRenderbuffer`

In case MSAA, we use this Renderbuffer instead of colorTextures[0] when we write info.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L21)

___

### multisample

• **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

Detected AA samples number.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L18)

___

### stencil

• **stencil**: `WebGLRenderbuffer`

Stencil+depth , usually costs 32bits per pixel.

#### Defined in

[pixijs/packages/core/src/framebuffer/GLFramebuffer.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/GLFramebuffer.ts#L15)
