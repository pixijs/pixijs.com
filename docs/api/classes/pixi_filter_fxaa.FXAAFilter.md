---
id: "pixi_filter_fxaa.FXAAFilter"
title: "Class: FXAAFilter"
sidebar_label: "FXAAFilter"
custom_edit_url: null
---

[@pixi/filter-fxaa](../modules/pixi_filter_fxaa.md).FXAAFilter

Basic FXAA (Fast Approximate Anti-Aliasing) implementation based on the code on geeks3d.com
with the modification that the texture2DLod stuff was removed since it is unsupported by WebGL.

**`See`**

https://github.com/mitsuhiko/webgl-meincraft

**`Memberof`**

PIXI.filters

## Hierarchy

- `Filter`

  ↳ **`FXAAFilter`**

## Constructors

### constructor

• **new FXAAFilter**()

#### Overrides

Filter.constructor

#### Defined in

[pixijs/packages/filter-fxaa/src/FXAAFilter.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-fxaa/src/FXAAFilter.ts#L13)

## Properties

### autoFit

• **autoFit**: `boolean`

If enabled, PixiJS will fit the filter area into boundaries for better performance.
Switch it off if it does not work for specific shader.

**`Default`**

true

#### Inherited from

Filter.autoFit

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L222)

___

### disposeRunner

• **disposeRunner**: `Runner`

#### Inherited from

Filter.disposeRunner

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L23)

___

### enabled

• **enabled**: `boolean`

If enabled is true the filter is applied, if false it will not.

#### Inherited from

Filter.enabled

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:215](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L215)

___

### legacy

• `Readonly` **legacy**: `boolean`

Legacy filters use position and uvs from attributes (set by filter system)

#### Inherited from

Filter.legacy

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:228](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L228)

___

### multisample

• **multisample**: `MSAA_QUALITY`

The samples override of the filter instance.

#### Inherited from

Filter.multisample

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:212](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L212)

___

### padding

• **padding**: `number`

The padding of the filter. Some filters require extra space to breath such as a blur.
Increasing this will add extra width and height to the bounds of the object that the
filter is applied to.

#### Inherited from

Filter.padding

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:209](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L209)

___

### program

• **program**: `Program`

Program that the shader uses.

#### Inherited from

Filter.program

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L14)

___

### state

• **state**: `State`

The WebGL state the filter requires to render.

#### Inherited from

Filter.state

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:231](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L231)

___

### uniformGroup

• **uniformGroup**: `UniformGroup`<`Dict`<`any`\>\>

#### Inherited from

Filter.uniformGroup

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L15)

___

### SOURCE\_KEY\_MAP

▪ `Static` **SOURCE\_KEY\_MAP**: `Dict`<`string`\>

Used for caching shader IDs.

#### Inherited from

Filter.SOURCE\_KEY\_MAP

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:322](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L322)

___

### defaultMultisample

▪ `Static` **defaultMultisample**: `MSAA_QUALITY` = `MSAA_QUALITY.NONE`

Default filter samples for any filter.

**`Static`**

**`Default`**

PIXI.MSAA_QUALITY.NONE

#### Inherited from

Filter.defaultMultisample

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L202)

___

### defaultResolution

▪ `Static` **defaultResolution**: `number` = `1`

Default filter resolution for any filter.

**`Static`**

#### Inherited from

Filter.defaultResolution

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L194)

## Accessors

### blendMode

• `get` **blendMode**(): `BLEND_MODES`

Sets the blend mode of the filter.

**`Default`**

PIXI.BLEND_MODES.NORMAL

#### Returns

`BLEND_MODES`

#### Inherited from

Filter.blendMode

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L279)

• `set` **blendMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BLEND_MODES` |

#### Returns

`void`

#### Inherited from

Filter.blendMode

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:284](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L284)

___

### resolution

• `get` **resolution**(): `number`

The resolution of the filter. Setting this to be lower will lower the quality but
increase the performance of the filter.

#### Returns

`number`

#### Inherited from

Filter.resolution

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:293](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L293)

• `set` **resolution**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

Filter.resolution

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L298)

___

### uniforms

• `get` **uniforms**(): `Dict`<`any`\>

Shader uniform values, shortcut for `uniformGroup.uniforms`.

#### Returns

`Dict`<`any`\>

#### Inherited from

Filter.uniforms

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L92)

___

### defaultFragmentSrc

• `Static` `get` **defaultFragmentSrc**(): `string`

The default fragment shader source

#### Returns

`string`

#### Inherited from

Filter.defaultFragmentSrc

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:316](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L316)

___

### defaultVertexSrc

• `Static` `get` **defaultVertexSrc**(): `string`

The default vertex shader source

#### Returns

`string`

#### Inherited from

Filter.defaultVertexSrc

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:307](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L307)

## Methods

### apply

▸ **apply**(`filterManager`, `input`, `output`, `clearMode?`, `_currentState?`): `void`

Applies the filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterManager` | `FilterSystem` | The renderer to retrieve the filter from |
| `input` | `RenderTexture` | The input render target. |
| `output` | `RenderTexture` | The target to output to. |
| `clearMode?` | `CLEAR_MODES` | Should the output be cleared before rendering to it. |
| `_currentState?` | `FilterState` | It's current state of filter. There are some useful properties in the currentState : target, filters, sourceFrame, destinationFrame, renderTarget, resolution |

#### Returns

`void`

#### Inherited from

Filter.apply

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:265](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L265)

___

### checkUniformExists

▸ **checkUniformExists**(`name`, `group`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `group` | `UniformGroup`<`Dict`<`any`\>\> |

#### Returns

`boolean`

#### Inherited from

Filter.checkUniformExists

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L55)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

Filter.destroy

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L78)

___

### from

▸ `Static` **from**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`): `Shader`

A short hand function to create a shader based of a vertex and fragment shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | `Dict`<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Returns

`Shader`

A shiny new PixiJS shader!

#### Inherited from

Filter.from

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L104)
