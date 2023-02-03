---
id: "pixi_core.Framebuffer"
title: "Class: Framebuffer"
sidebar_label: "Framebuffer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Framebuffer

A framebuffer can be used to render contents off of the screen. PIXI.BaseRenderTexture uses
one internally to render into itself. You can attach a depth or stencil buffer to a framebuffer.

On WebGL 2 machines, shaders can output to multiple textures simultaneously with GLSL 300 ES.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Framebuffer**(`width`, `height`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | Width of the frame buffer |
| `height` | `number` | Height of the frame buffer |

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L54)

## Properties

### colorTextures

• **colorTextures**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[]

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L46)

___

### depth

• **depth**: `boolean`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L41)

___

### depthTexture

• **depthTexture**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L45)

___

### dirtyFormat

• **dirtyFormat**: `number`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L43)

___

### dirtyId

• **dirtyId**: `number`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L42)

___

### dirtySize

• **dirtySize**: `number`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L44)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L48)

___

### glFramebuffers

• **glFramebuffers**: `Object`

#### Index signature

▪ [key: `string`]: [`GLFramebuffer`](pixi_core.GLFramebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L47)

___

### height

• **height**: `number`

Height of framebuffer in pixels.

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L21)

___

### multisample

• **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

Desired number of samples for antialiasing. 0 means AA should not be used.

Experimental WebGL2 feature, allows to use antialiasing in individual renderTextures.
Antialiasing is the same as for main buffer with renderer `antialias: true` options.
Seriously affects GPU memory consumption and GPU performance.

**`Example`**

```ts
import { MSAA_QUALITY } from 'pixi.js';

renderTexture.framebuffer.multisample = MSAA_QUALITY.HIGH;
// ...
renderer.render(myContainer, { renderTexture });
renderer.framebuffer.blit(); // Copies data from MSAA framebuffer to texture
```

**`Default`**

PIXI.MSAA_QUALITY.NONE

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:38](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L38)

___

### stencil

• **stencil**: `boolean`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L40)

___

### width

• **width**: `number`

Width of framebuffer in pixels.

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L18)

## Accessors

### colorTexture

• `get` **colorTexture**(): [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

Reference to the colorTexture.

#### Returns

[`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L79)

## Methods

### addColorTexture

▸ **addColorTexture**(`index?`, `texture?`): [`Framebuffer`](pixi_core.Framebuffer.md)

Add texture to the colorTexture array.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `index` | `number` | `0` | Index of the array to add the texture to |
| `texture?` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | `undefined` | Texture to add to the array |

#### Returns

[`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L89)

___

### addDepthTexture

▸ **addDepthTexture**(`texture?`): [`Framebuffer`](pixi_core.Framebuffer.md)

Add a depth texture to the frame buffer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture?` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Texture to add. |

#### Returns

[`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L110)

___

### destroyDepthTexture

▸ **destroyDepthTexture**(): `void`

Destroys and removes the depth texture added to this framebuffer.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:193](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L193)

___

### dispose

▸ **dispose**(): `void`

Disposes WebGL resources that are connected to this geometry.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:187](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L187)

___

### enableDepth

▸ **enableDepth**(): [`Framebuffer`](pixi_core.Framebuffer.md)

Enable depth on the frame buffer.

#### Returns

[`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L130)

___

### enableStencil

▸ **enableStencil**(): [`Framebuffer`](pixi_core.Framebuffer.md)

Enable stencil on the frame buffer.

#### Returns

[`Framebuffer`](pixi_core.Framebuffer.md)

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L141)

___

### resize

▸ **resize**(`width`, `height`): `void`

Resize the frame buffer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | Width of the frame buffer to resize to |
| `height` | `number` | Height of the frame buffer to resize to |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/framebuffer/Framebuffer.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/framebuffer/Framebuffer.ts#L156)
