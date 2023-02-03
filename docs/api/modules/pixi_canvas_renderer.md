---
id: "pixi_canvas_renderer"
title: "Module: @pixi/canvas-renderer"
sidebar_label: "@pixi/canvas-renderer"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [CanvasContextSystem](../classes/pixi_canvas_renderer.CanvasContextSystem.md)
- [CanvasMaskSystem](../classes/pixi_canvas_renderer.CanvasMaskSystem.md)
- [CanvasObjectRendererSystem](../classes/pixi_canvas_renderer.CanvasObjectRendererSystem.md)
- [CanvasRenderer](../classes/pixi_canvas_renderer.CanvasRenderer.md)

## Type Aliases

### SmoothingEnabledProperties

Ƭ **SmoothingEnabledProperties**: ``"imageSmoothingEnabled"`` \| ``"webkitImageSmoothingEnabled"`` \| ``"mozImageSmoothingEnabled"`` \| ``"oImageSmoothingEnabled"`` \| ``"msImageSmoothingEnabled"``

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L26)

## Variables

### canvasUtils

• `Const` **canvasUtils**: `Object`

Utility methods for Sprite/Texture tinting.

Tinting with the CanvasRenderer involves creating a new canvas to use as a texture,
so be aware of the performance implications.

**`Namespace`**

PIXI.canvasUtils

**`Memberof`**

PIXI

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheStepsPerColorChannel` | `number` | Number of steps which will be used as a cap when rounding colors. **`Memberof`** PIXI.canvasUtils |
| `canUseMultiply` | `boolean` | Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method. **`Memberof`** PIXI.canvasUtils |
| `canvas` | `ICanvas` | - |
| `convertTintToImage` | `boolean` | Tint cache boolean flag. **`Memberof`** PIXI.canvasUtils |
| `getTintedCanvas` | (`sprite`: { `texture`: `Texture`<`Resource`\>  }, `color`: `number`) => `HTMLImageElement` \| `ICanvas` | Basically this method just needs a sprite and a color and tints the sprite with the given color. **`Memberof`** PIXI.canvasUtils |
| `getTintedPattern` | (`texture`: `Texture`<`Resource`\>, `color`: `number`) => `CanvasPattern` | Basically this method just needs a sprite and a color and tints the sprite with the given color. **`Memberof`** PIXI.canvasUtils |
| `roundColor` | (`color`: `number`) => `number` | Rounds the specified color according to the canvasUtils.cacheStepsPerColorChannel. **`Memberof`** PIXI.canvasUtils |
| `tintMethod` | (`texture`: `Texture`<`Resource`\>, `color`: `number`, `canvas`: `ICanvas`) => `void` | The tinting method that will be used. **`Memberof`** PIXI.canvasUtils |
| `tintWithMultiply` | (`texture`: `Texture`<`Resource`\>, `color`: `number`, `canvas`: `ICanvas`) => `void` | Tint a texture using the 'multiply' operation. **`Memberof`** PIXI.canvasUtils |
| `tintWithOverlay` | (`texture`: `Texture`<`Resource`\>, `color`: `number`, `canvas`: `ICanvas`) => `void` | Tint a texture using the 'overlay' operation. **`Memberof`** PIXI.canvasUtils |
| `tintWithPerPixel` | (`texture`: `Texture`<`Resource`\>, `color`: `number`, `canvas`: `ICanvas`) => `void` | Tint a texture pixel per pixel. **`Memberof`** PIXI.canvasUtils |

#### Defined in

[pixijs/packages/canvas-renderer/src/canvasUtils.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/canvasUtils.ts#L14)
