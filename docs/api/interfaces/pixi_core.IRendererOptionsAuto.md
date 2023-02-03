---
id: "pixi_core.IRendererOptionsAuto"
title: "Interface: IRendererOptionsAuto"
sidebar_label: "IRendererOptionsAuto"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IRendererOptionsAuto

## Hierarchy

- [`IRendererOptions`](pixi_core.IRendererOptions.md)

  ↳ **`IRendererOptionsAuto`**

## Properties

### antialias

• `Optional` **antialias**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[antialias](pixi_core.IRendererOptions.md#antialias)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L88)

___

### autoDensity

• `Optional` **autoDensity**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[autoDensity](pixi_core.IRendererOptions.md#autodensity)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:87](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L87)

___

### background

• `Optional` **background**: `string` \| `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[background](pixi_core.IRendererOptions.md#background)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L93)

___

### backgroundAlpha

• `Optional` **backgroundAlpha**: `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[backgroundAlpha](pixi_core.IRendererOptions.md#backgroundalpha)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L94)

___

### backgroundColor

• `Optional` **backgroundColor**: `string` \| `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[backgroundColor](pixi_core.IRendererOptions.md#backgroundcolor)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L92)

___

### clearBeforeRender

• `Optional` **clearBeforeRender**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[clearBeforeRender](pixi_core.IRendererOptions.md#clearbeforerender)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L91)

___

### context

• `Optional` **context**: [`IRenderingContext`](pixi_core.IRenderingContext.md)

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[context](pixi_core.IRendererOptions.md#context)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L97)

___

### forceCanvas

• `Optional` **forceCanvas**: `boolean`

#### Overrides

[IRendererOptions](pixi_core.IRendererOptions.md).[forceCanvas](pixi_core.IRendererOptions.md#forcecanvas)

#### Defined in

[pixijs/packages/core/src/autoDetectRenderer.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/autoDetectRenderer.ts#L8)

___

### height

• `Optional` **height**: `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[height](pixi_core.IRendererOptions.md#height)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L80)

___

### hello

• `Optional` **hello**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[hello](pixi_core.IRendererOptions.md#hello)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L98)

___

### powerPreference

• `Optional` **powerPreference**: `WebGLPowerPreference`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[powerPreference](pixi_core.IRendererOptions.md#powerpreference)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L96)

___

### premultipliedAlpha

• `Optional` **premultipliedAlpha**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[premultipliedAlpha](pixi_core.IRendererOptions.md#premultipliedalpha)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L95)

___

### preserveDrawingBuffer

• `Optional` **preserveDrawingBuffer**: `boolean`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[preserveDrawingBuffer](pixi_core.IRendererOptions.md#preservedrawingbuffer)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:90](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L90)

___

### resolution

• `Optional` **resolution**: `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[resolution](pixi_core.IRendererOptions.md#resolution)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L89)

___

### useContextAlpha

• `Optional` **useContextAlpha**: `boolean` \| ``"notMultiplied"``

Use premultipliedAlpha and backgroundAlpha instead

**`Deprecated`**

since 7.0.0

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[useContextAlpha](pixi_core.IRendererOptions.md#usecontextalpha)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L86)

___

### view

• `Optional` **view**: [`ICanvas`](pixi_core.ICanvas.md)

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[view](pixi_core.IRendererOptions.md#view)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L81)

___

### width

• `Optional` **width**: `number`

#### Inherited from

[IRendererOptions](pixi_core.IRendererOptions.md).[width](pixi_core.IRendererOptions.md#width)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L79)
