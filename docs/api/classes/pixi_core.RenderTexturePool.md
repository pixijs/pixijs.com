---
id: "pixi_core.RenderTexturePool"
title: "Class: RenderTexturePool"
sidebar_label: "RenderTexturePool"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).RenderTexturePool

Texture pool, used by FilterSystem and plugins.

Stores collection of temporary pow2 or screen-sized renderTextures

If you use custom RenderTexturePool for your filters, you can use methods
`getFilterTexture` and `returnFilterTexture` same as in

**`Memberof`**

PIXI

## Constructors

### constructor

• **new RenderTexturePool**(`textureOptions?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `textureOptions?` | [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\> | options that will be passed to BaseRenderTexture constructor |

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L37)

## Properties

### enableFullScreen

• **enableFullScreen**: `boolean`

Allow renderTextures of the same size as screen, not just pow2

Automatically sets to true after `setScreenSize`

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L28)

___

### textureOptions

• **textureOptions**: [`IBaseTextureOptions`](../interfaces/pixi_core.IBaseTextureOptions.md)<`any`\>

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L20)

___

### texturePool

• **texturePool**: `Object`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L29)

___

### SCREEN\_KEY

▪ `Static` `Readonly` **SCREEN\_KEY**: `number` = `-1`

Key that is used to store fullscreen renderTextures in a pool

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:225](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L225)

## Methods

### clear

▸ **clear**(`destroyTextures?`): `void`

Clears the pool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destroyTextures?` | `boolean` | Destroy all stored textures. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:158](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L158)

___

### createTexture

▸ **createTexture**(`realWidth`, `realHeight`, `multisample?`): [`RenderTexture`](pixi_core.RenderTexture.md)

Creates texture with params that were specified in pool constructor.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `realWidth` | `number` | `undefined` | Width of texture in pixels. |
| `realHeight` | `number` | `undefined` | Height of texture in pixels. |
| `multisample` | [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) | `MSAA_QUALITY.NONE` | Number of samples of the framebuffer. |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L53)

___

### getFilterTexture

▸ **getFilterTexture**(`input`, `resolution?`, `multisample?`): [`RenderTexture`](pixi_core.RenderTexture.md)

Gets extra texture of the same size as input renderTexture

`getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`RenderTexture`](pixi_core.RenderTexture.md) | renderTexture from which size and resolution will be copied |
| `resolution?` | `number` | override resolution of the renderTexture It overrides, it does not multiply |
| `multisample?` | [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) | number of samples of the renderTexture |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L123)

___

### getOptimalTexture

▸ **getOptimalTexture**(`minWidth`, `minHeight`, `resolution?`, `multisample?`): [`RenderTexture`](pixi_core.RenderTexture.md)

Gets a Power-of-Two render texture or fullScreen texture

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `minWidth` | `number` | `undefined` | The minimum width of the render texture. |
| `minHeight` | `number` | `undefined` | The minimum height of the render texture. |
| `resolution` | `number` | `1` | The resolution of the render texture. |
| `multisample` | [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) | `MSAA_QUALITY.NONE` | Number of samples of the render texture. |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

The new render texture.

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L73)

___

### returnFilterTexture

▸ **returnFilterTexture**(`renderTexture`): `void`

Alias for returnTexture, to be compliant with FilterSystem interface.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderTexture` | [`RenderTexture`](pixi_core.RenderTexture.md) | The renderTexture to free |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L149)

___

### returnTexture

▸ **returnTexture**(`renderTexture`): `void`

Place a render texture back into the pool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderTexture` | [`RenderTexture`](pixi_core.RenderTexture.md) | The renderTexture to free |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L137)

___

### setScreenSize

▸ **setScreenSize**(`size`): `void`

If screen size was changed, drops all screen-sized textures,
sets new screen size, sets `enableFullScreen` to true

Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | [`ISize`](../interfaces/pixi_core.ISize.md) | Initial size of screen. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTexturePool.ts:187](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTexturePool.ts#L187)
