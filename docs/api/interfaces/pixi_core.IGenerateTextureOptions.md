---
id: "pixi_core.IGenerateTextureOptions"
title: "Interface: IGenerateTextureOptions"
sidebar_label: "IGenerateTextureOptions"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IGenerateTextureOptions

## Properties

### multisample

• `Optional` **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

The number of samples of the frame buffer.

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L26)

___

### region

• `Optional` **region**: [`Rectangle`](../classes/pixi_core.Rectangle.md)

The region of the displayObject, that shall be rendered,
if no region is specified, defaults to the local bounds of the displayObject.

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L24)

___

### resolution

• `Optional` **resolution**: `number`

The resolution / device pixel ratio of the texture being generated. Optional defaults to Renderer resolution.

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L19)

___

### scaleMode

• `Optional` **scaleMode**: [`SCALE_MODES`](../enums/pixi_core.SCALE_MODES.md)

The scale mode of the texture. Optional, defaults to `PIXI.settings.SCALE_MODE`.

#### Defined in

[pixijs/packages/core/src/renderTexture/GenerateTextureSystem.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/GenerateTextureSystem.ts#L17)
