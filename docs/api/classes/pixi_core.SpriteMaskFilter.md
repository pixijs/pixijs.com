---
id: "pixi_core.SpriteMaskFilter"
title: "Class: SpriteMaskFilter"
sidebar_label: "SpriteMaskFilter"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).SpriteMaskFilter

This handles a Sprite acting as a mask, as opposed to a Graphic.

WebGL only.

**`Memberof`**

PIXI

## Hierarchy

- [`Filter`](pixi_core.Filter.md)

  ↳ **`SpriteMaskFilter`**

## Constructors

### constructor

• **new SpriteMaskFilter**(`sprite`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sprite` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) | The target sprite. |

#### Overrides

[Filter](pixi_core.Filter.md).[constructor](pixi_core.Filter.md#constructor)

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L44)

• **new SpriteMaskFilter**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Overrides

Filter.constructor

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L51)

## Properties

### autoFit

• **autoFit**: `boolean`

If enabled, PixiJS will fit the filter area into boundaries for better performance.
Switch it off if it does not work for specific shader.

**`Default`**

true

#### Inherited from

[Filter](pixi_core.Filter.md).[autoFit](pixi_core.Filter.md#autofit)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L222)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Inherited from

[Filter](pixi_core.Filter.md).[disposeRunner](pixi_core.Filter.md#disposerunner)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L23)

___

### enabled

• **enabled**: `boolean`

If enabled is true the filter is applied, if false it will not.

#### Inherited from

[Filter](pixi_core.Filter.md).[enabled](pixi_core.Filter.md#enabled)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:215](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L215)

___

### legacy

• `Readonly` **legacy**: `boolean`

Legacy filters use position and uvs from attributes (set by filter system)

#### Inherited from

[Filter](pixi_core.Filter.md).[legacy](pixi_core.Filter.md#legacy)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:228](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L228)

___

### maskMatrix

• **maskMatrix**: [`Matrix`](pixi_core.Matrix.md)

Mask matrix

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L39)

___

### multisample

• **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

The samples override of the filter instance.

#### Inherited from

[Filter](pixi_core.Filter.md).[multisample](pixi_core.Filter.md#multisample)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:212](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L212)

___

### padding

• **padding**: `number`

The padding of the filter. Some filters require extra space to breath such as a blur.
Increasing this will add extra width and height to the bounds of the object that the
filter is applied to.

#### Inherited from

[Filter](pixi_core.Filter.md).[padding](pixi_core.Filter.md#padding)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:209](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L209)

___

### program

• **program**: [`Program`](pixi_core.Program.md)

Program that the shader uses.

#### Inherited from

[Filter](pixi_core.Filter.md).[program](pixi_core.Filter.md#program)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L14)

___

### state

• **state**: [`State`](pixi_core.State.md)

The WebGL state the filter requires to render.

#### Inherited from

[Filter](pixi_core.Filter.md).[state](pixi_core.Filter.md#state)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:231](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L231)

___

### uniformGroup

• **uniformGroup**: [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Inherited from

[Filter](pixi_core.Filter.md).[uniformGroup](pixi_core.Filter.md#uniformgroup)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L15)

___

### SOURCE\_KEY\_MAP

▪ `Static` **SOURCE\_KEY\_MAP**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`string`\>

Used for caching shader IDs.

#### Inherited from

[Filter](pixi_core.Filter.md).[SOURCE_KEY_MAP](pixi_core.Filter.md#source_key_map)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:322](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L322)

___

### defaultMultisample

▪ `Static` **defaultMultisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) = `MSAA_QUALITY.NONE`

Default filter samples for any filter.

**`Static`**

**`Default`**

PIXI.MSAA_QUALITY.NONE

#### Inherited from

[Filter](pixi_core.Filter.md).[defaultMultisample](pixi_core.Filter.md#defaultmultisample)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L202)

___

### defaultResolution

▪ `Static` **defaultResolution**: `number` = `1`

Default filter resolution for any filter.

**`Static`**

#### Inherited from

[Filter](pixi_core.Filter.md).[defaultResolution](pixi_core.Filter.md#defaultresolution)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L194)

## Accessors

### blendMode

• `get` **blendMode**(): [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

Sets the blend mode of the filter.

**`Default`**

PIXI.BLEND_MODES.NORMAL

#### Returns

[`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md)

#### Inherited from

Filter.blendMode

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L279)

• `set` **blendMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md) |

#### Returns

`void`

#### Inherited from

Filter.blendMode

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:284](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L284)

___

### maskSprite

• `get` **maskSprite**(): [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md)

Sprite mask

#### Returns

[`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md)

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L76)

• `set` **maskSprite**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`IMaskTarget`](../interfaces/pixi_core.IMaskTarget.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L81)

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

• `get` **uniforms**(): [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

Shader uniform values, shortcut for `uniformGroup.uniforms`.

#### Returns

[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

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

Applies the filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterManager` | [`FilterSystem`](pixi_core.FilterSystem.md) | The renderer to retrieve the filter from |
| `input` | [`RenderTexture`](pixi_core.RenderTexture.md) | The input render target. |
| `output` | [`RenderTexture`](pixi_core.RenderTexture.md) | The target to output to. |
| `clearMode` | [`CLEAR_MODES`](../enums/pixi_core.CLEAR_MODES.md) | Should the output be cleared before rendering to it. |

#### Returns

`void`

#### Overrides

[Filter](pixi_core.Filter.md).[apply](pixi_core.Filter.md#apply)

#### Defined in

[pixijs/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/spriteMask/SpriteMaskFilter.ts#L98)

___

### checkUniformExists

▸ **checkUniformExists**(`name`, `group`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> |

#### Returns

`boolean`

#### Inherited from

[Filter](pixi_core.Filter.md).[checkUniformExists](pixi_core.Filter.md#checkuniformexists)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L55)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

[Filter](pixi_core.Filter.md).[destroy](pixi_core.Filter.md#destroy)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L78)

___

### from

▸ `Static` **from**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`): [`Shader`](pixi_core.Shader.md)

A short hand function to create a shader based of a vertex and fragment shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Returns

[`Shader`](pixi_core.Shader.md)

A shiny new PixiJS shader!

#### Inherited from

[Filter](pixi_core.Filter.md).[from](pixi_core.Filter.md#from)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L104)
