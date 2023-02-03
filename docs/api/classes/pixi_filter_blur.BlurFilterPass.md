---
id: "pixi_filter_blur.BlurFilterPass"
title: "Class: BlurFilterPass"
sidebar_label: "BlurFilterPass"
custom_edit_url: null
---

[@pixi/filter-blur](../modules/pixi_filter_blur.md).BlurFilterPass

The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.

**`Memberof`**

PIXI.filters

## Hierarchy

- `Filter`

  ↳ **`BlurFilterPass`**

## Constructors

### constructor

• **new BlurFilterPass**(`horizontal`, `strength?`, `quality?`, `resolution?`, `kernelSize?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `horizontal` | `boolean` | `undefined` | Do pass along the x-axis (`true`) or y-axis (`false`). |
| `strength` | `number` | `8` | The strength of the blur filter. |
| `quality` | `number` | `4` | The quality of the blur filter. |
| `resolution` | `number` | `settings.FILTER_RESOLUTION` | The resolution of the blur filter. |
| `kernelSize` | `number` | `5` | The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. |

#### Overrides

Filter.constructor

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L26)

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

### horizontal

• **horizontal**: `boolean`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L13)

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

### passes

• **passes**: `number`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L15)

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

### strength

• **strength**: `number`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L14)

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

### blur

• `get` **blur**(): `number`

Sets the strength of both the blur.

**`Default`**

16

#### Returns

`number`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L126)

• `set` **blur**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L131)

___

### quality

• `get` **quality**(): `number`

Sets the quality of the blur by modifying the number of passes. More passes means higher
quality bluring but the lower the performance.

**`Default`**

4

#### Returns

`number`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:142](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L142)

• `set` **quality**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L147)

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

▸ **apply**(`filterManager`, `input`, `output`, `clearMode`): `void`

Applies the filter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterManager` | `FilterSystem` | The manager. |
| `input` | `RenderTexture` | The input target. |
| `output` | `RenderTexture` | The output target. |
| `clearMode` | `CLEAR_MODES` | How to clear |

#### Returns

`void`

#### Overrides

Filter.apply

#### Defined in

[pixijs/packages/filter-blur/src/BlurFilterPass.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-blur/src/BlurFilterPass.ts#L56)

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
