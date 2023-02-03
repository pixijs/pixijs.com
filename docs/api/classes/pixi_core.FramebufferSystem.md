---
id: "pixi_core.FramebufferSystem"
title: "Class: FramebufferSystem"
sidebar_label: "FramebufferSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).FramebufferSystem

System plugin to the renderer to manage framebuffers.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new FramebufferSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L44)

## Properties

### current

• **current**: [`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L29)

___

### hasMRT

• **hasMRT**: `boolean`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L31)

___

### managedFramebuffers

• `Readonly` **managedFramebuffers**: [`Framebuffer`](pixi_core.Framebuffer.md)[]

A list of managed framebuffers.

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L28)

___

### renderer

• **renderer**: [`Renderer`](pixi_core.Renderer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L39)

___

### viewport

• **viewport**: [`Rectangle`](pixi_core.Rectangle.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L30)

___

### writeDepthTexture

• **writeDepthTexture**: `boolean`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L32)

## Accessors

### size

• `get` **size**(): `Object`

Get the size of the current width and height. Returns object with `width` and `height` values.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `height` | `number` |
| `width` | `number` |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:238](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L238)

## Methods

### bind

▸ **bind**(`framebuffer?`, `frame?`, `mipLevel?`): `void`

Bind a framebuffer.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `framebuffer?` | [`Framebuffer`](pixi_core.Framebuffer.md) | `undefined` |  |
| `frame?` | [`Rectangle`](pixi_core.Rectangle.md) | `undefined` | frame, default is framebuffer size |
| `mipLevel` | `number` | `0` | optional mip level to set on the framebuffer - defaults to 0 |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:112](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L112)

___

### blit

▸ **blit**(`framebuffer?`, `sourcePixels?`, `destPixels?`): `void`

Only works with WebGL2

blits framebuffer to another of the same or bigger size
after that target framebuffer is bound

Fails with WebGL warning if blits multisample framebuffer to different size

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `framebuffer?` | [`Framebuffer`](pixi_core.Framebuffer.md) | by default it blits "into itself", from renderBuffer to texture. |
| `sourcePixels?` | [`Rectangle`](pixi_core.Rectangle.md) | source rectangle in pixels |
| `destPixels?` | [`Rectangle`](pixi_core.Rectangle.md) | dest rectangle in pixels, assumed to be the same as sourcePixels |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:509](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L509)

___

### clear

▸ **clear**(`r`, `g`, `b`, `a`, `mask?`): `void`

Clear the color of the context

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `r` | `number` | Red value from 0 to 1 |
| `g` | `number` | Green value from 0 to 1 |
| `b` | `number` | Blue value from 0 to 1 |
| `a` | `number` | Alpha value from 0 to 1 |
| `mask?` | [`BUFFER_BITS`](../enums/pixi_core.BUFFER_BITS.md) | - |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:258](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L258)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:703](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L703)

___

### disposeAll

▸ **disposeAll**(`contextLost?`): `void`

Disposes all framebuffers, but not textures bound to them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contextLost?` | `boolean` | If context was lost, we suppress all delete function calls |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:639](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L639)

___

### disposeFramebuffer

▸ **disposeFramebuffer**(`framebuffer`, `contextLost?`): `void`

Disposes framebuffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `framebuffer` | [`Framebuffer`](pixi_core.Framebuffer.md) | framebuffer that has to be disposed of |
| `contextLost?` | `boolean` | If context was lost, we suppress all delete function calls |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:593](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L593)

___

### reset

▸ **reset**(): `void`

Resets framebuffer stored state, binds screen framebuffer. Should be called before renderTexture reset().

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:697](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L697)

___

### setViewport

▸ **setViewport**(`x`, `y`, `width`, `height`): `void`

Set the WebGLRenderingContext's viewport.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | X position of viewport |
| `y` | `number` | Y position of viewport |
| `width` | `number` | Width of viewport |
| `height` | `number` | Height of viewport |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/FramebufferSystem.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/FramebufferSystem.ts#L214)
