---
id: "pixi_settings"
title: "Module: @pixi/settings"
sidebar_label: "@pixi/settings"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [IAdapter](../interfaces/pixi_settings.IAdapter.md)
- [ICanvas](../interfaces/pixi_settings.ICanvas.md)
- [ICanvasParentNode](../interfaces/pixi_settings.ICanvasParentNode.md)
- [ICanvasRect](../interfaces/pixi_settings.ICanvasRect.md)
- [ICanvasRenderingContext2D](../interfaces/pixi_settings.ICanvasRenderingContext2D.md)
- [ICanvasRenderingContext2DSettings](../interfaces/pixi_settings.ICanvasRenderingContext2DSettings.md)
- [ICanvasStyle](../interfaces/pixi_settings.ICanvasStyle.md)
- [IRenderOptions](../interfaces/pixi_settings.IRenderOptions.md)
- [WebGLContextEventMap](../interfaces/pixi_settings.WebGLContextEventMap.md)

## Type Aliases

### ContextIds

Ƭ **ContextIds**: ``"2d"`` \| ``"bitmaprenderer"`` \| ``"webgl"`` \| ``"experimental-webgl"`` \| ``"webgl2"`` \| ``"experimental-webgl2"``

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:3](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L3)

___

### ContextSettings

Ƭ **ContextSettings**: [`ICanvasRenderingContext2DSettings`](../interfaces/pixi_settings.ICanvasRenderingContext2DSettings.md) \| `ImageBitmapRenderingContextSettings` \| `WebGLContextAttributes`

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L18)

___

### PredefinedColorSpace

Ƭ **PredefinedColorSpace**: ``"srgb"`` \| ``"display-p3"``

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L5)

___

### RenderingContext

Ƭ **RenderingContext**: [`ICanvasRenderingContext2D`](../interfaces/pixi_settings.ICanvasRenderingContext2D.md) \| `ImageBitmapRenderingContext` \| `WebGLRenderingContext` \| `WebGL2RenderingContext`

#### Defined in

[pixijs/packages/settings/src/ICanvas.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/ICanvas.ts#L7)

## Variables

### BrowserAdapter

• `Const` **BrowserAdapter**: [`IAdapter`](../interfaces/pixi_settings.IAdapter.md)

#### Defined in

[pixijs/packages/settings/src/adapter.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/adapter.ts#L27)

___

### isMobile

• `Const` **isMobile**: `isMobileResult`

#### Defined in

[pixijs/packages/settings/src/utils/isMobile.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/utils/isMobile.ts#L39)

___

### settings

• `Const` **settings**: `ISettings` & `Partial`<`GlobalMixins.Settings`\>

User's customizable globals for overriding the default PIXI settings, such
as a renderer's default resolution, framerate, float precision, etc.

**`Example`**

```ts
import { settings, ENV } from 'pixi.js';

// Use the native window resolution as the default resolution
// will support high-density displays when rendering
settings.RESOLUTION = window.devicePixelRatio;

// Used for older v1 WebGL devices for backwards compatibility
settings.PREFER_ENV = ENV.WEBGL_LEGACY;
```

**`Namespace`**

PIXI.settings

#### Defined in

[pixijs/packages/settings/src/settings.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/settings.ts#L48)
