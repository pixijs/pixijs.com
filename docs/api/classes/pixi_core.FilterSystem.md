---
id: "pixi_core.FilterSystem"
title: "Class: FilterSystem"
sidebar_label: "FilterSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).FilterSystem

System plugin to the renderer to manage filters.

## Pipeline

The FilterSystem executes the filtering pipeline by rendering the display-object into a texture, applying its
[filters]PIXI.Filter in series, and the last filter outputs into the final render-target.

The filter-frame is the rectangle in world space being filtered, and those contents are mapped into
`(0, 0, filterFrame.width, filterFrame.height)` into the filter render-texture. The filter-frame is also called
the source-frame, as it is used to bind the filter render-textures. The last filter outputs to the `filterFrame`
in the final render-target.

## Usage

PIXI.Container#renderAdvanced is an example of how to use the filter system. It is a 3 step process:

**push**: Use PIXI.FilterSystem#push to push the set of filters to be applied on a filter-target.
**render**: Render the contents to be filtered using the renderer. The filter-system will only capture the contents
     inside the bounds of the filter-target. NOTE: Using PIXI.Renderer#render is
     illegal during an existing render cycle, and it may reset the filter system.
**pop**: Use PIXI.FilterSystem#pop to pop & execute the filters you initially pushed. It will apply them
     serially and output to the bounds of the filter-target.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new FilterSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L107)

## Properties

### defaultFilterStack

• `Readonly` **defaultFilterStack**: `FilterState`[]

List of filters for the FilterSystem

**`Member`**

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L58)

___

### forceClear

• **forceClear**: `boolean`

Whether to clear output renderTexture in AUTO/BLIT mode. See PIXI.CLEAR_MODES.

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L67)

___

### renderer

• **renderer**: [`Renderer`](pixi_core.Renderer.md)

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:102](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L102)

___

### statePool

• **statePool**: `FilterState`[]

A pool for storing filter states, save us creating new ones each tick.

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L61)

___

### texturePool

• **texturePool**: [`RenderTexturePool`](pixi_core.RenderTexturePool.md)

Stores a bunch of POT textures used for filtering.

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L64)

___

### useMaxPadding

• **useMaxPadding**: `boolean`

Old padding behavior is to use the max amount instead of sum padding.
Use this flag if you need the old behavior.

**`Default`**

false

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L74)

## Methods

### applyFilter

▸ **applyFilter**(`filter`, `input`, `output`, `clearMode?`): `void`

Draws a filter using the default rendering process.

This should be called only by [apply](pixi_core.Filter.md#apply).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | [`Filter`](pixi_core.Filter.md) | The filter to draw. |
| `input` | [`RenderTexture`](pixi_core.RenderTexture.md) | The input render target. |
| `output` | [`RenderTexture`](pixi_core.RenderTexture.md) | The target to output to. |
| `clearMode?` | [`CLEAR_MODES`](../enums/pixi_core.CLEAR_MODES.md) | Should the output be cleared before rendering to it |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:441](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L441)

___

### bindAndClear

▸ **bindAndClear**(`filterTexture`, `clearMode?`): `void`

Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `filterTexture` | [`RenderTexture`](pixi_core.RenderTexture.md) | `undefined` | renderTexture to bind, should belong to filter pool or filter stack |
| `clearMode` | [`CLEAR_MODES`](../enums/pixi_core.CLEAR_MODES.md) | `CLEAR_MODES.CLEAR` | clearMode, by default its CLEAR/YES. See PIXI.CLEAR_MODES |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:375](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L375)

___

### calculateSpriteMatrix

▸ **calculateSpriteMatrix**(`outputMatrix`, `sprite`): [`Matrix`](pixi_core.Matrix.md)

Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.

Use `outputMatrix * vTextureCoord` in the shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outputMatrix` | [`Matrix`](pixi_core.Matrix.md) | The matrix to output to. |
| `sprite` | [`ISpriteMaskTarget`](../interfaces/pixi_core.ISpriteMaskTarget.md) | The sprite to map to. |

#### Returns

[`Matrix`](pixi_core.Matrix.md)

The mapped matrix.

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:483](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L483)

___

### destroy

▸ **destroy**(): `void`

Destroys this Filter System.

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:500](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L500)

___

### emptyPool

▸ **emptyPool**(): `void`

Empties the texture pool.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:559](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L559)

___

### getFilterTexture

▸ **getFilterTexture**(`input?`, `resolution?`, `multisample?`): [`RenderTexture`](pixi_core.RenderTexture.md)

Gets extra render texture to use inside current filter
To be compliant with older filters, you can use params in any order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input?` | [`RenderTexture`](pixi_core.RenderTexture.md) | renderTexture from which size and resolution will be copied |
| `resolution?` | `number` | override resolution of the renderTexture |
| `multisample?` | [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) | number of samples of the renderTexture |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:529](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L529)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[init](../interfaces/pixi_core.ISystem.md#init)

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L138)

___

### pop

▸ **pop**(): `void`

Pops off the filter and applies it.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L262)

___

### push

▸ **push**(`target`, `filters`): `void`

Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
input render-texture for the rest of the filtering pipeline.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`IFilterTarget`](../interfaces/pixi_core.IFilterTarget.md) | The target of the filter to render. |
| `filters` | [`Filter`](pixi_core.Filter.md)[] | The filters to apply. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L149)

___

### resize

▸ **resize**(): `void`

Calls `texturePool.resize()`, affects fullScreen renderTextures.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:565](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L565)

___

### returnFilterTexture

▸ **returnFilterTexture**(`renderTexture`): `void`

Frees a render texture back into the pool.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderTexture` | [`RenderTexture`](pixi_core.RenderTexture.md) | The renderTarget to free |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/FilterSystem.ts:553](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/FilterSystem.ts#L553)
