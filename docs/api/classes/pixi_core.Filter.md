---
id: "pixi_core.Filter"
title: "Class: Filter"
sidebar_label: "Filter"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Filter

A filter is a special shader that applies post-processing effects to an input texture and writes into an output
render-target.

[Example](http://pixijs.io/examples/#/filters/blur-filter.js) of the
PIXI.filters.BlurFilter BlurFilter.

### Usage
Filters can be applied to any DisplayObject or Container.
PixiJS' `FilterSystem` renders the container into temporary Framebuffer,
then filter renders it to the screen.
Multiple filters can be added to the `filters` array property and stacked on each other.

```js
import { Container, Filter } from 'pixi.js';
const filter = new Filter(myShaderVert, myShaderFrag, { myUniform: 0.5 });
const container = new Container();
container.filters = [filter];
```

### Previous Version Differences

In PixiJS **v3**, a filter was always applied to _whole screen_.

In PixiJS **v4**, a filter can be applied _only part of the screen_.
Developers had to create a set of uniforms to deal with coordinates.

In PixiJS **v5** combines _both approaches_.
Developers can use normal coordinates of v3 and then allow filter to use partial Framebuffers,
bringing those extra uniforms into account.

Also be aware that we have changed default vertex shader, please consult
[Wiki](https://github.com/pixijs/pixijs/wiki/v5-Creating-filters).

### Frames

The following table summarizes the coordinate spaces used in the filtering pipeline:

<table>
<thead>
  <tr>
    <th>Coordinate Space</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Texture Coordinates</td>
    <td>
        The texture (or UV) coordinates in the input base-texture's space. These are normalized into the (0,1) range along
        both axes.
    </td>
  </tr>
  <tr>
    <td>World Space</td>
    <td>
        A point in the same space as the world bounds of any display-object (i.e. in the scene graph's space).
    </td>
  </tr>
  <tr>
    <td>Physical Pixels</td>
    <td>
        This is base-texture's space with the origin on the top-left. You can calculate these by multiplying the texture
        coordinates by the dimensions of the texture.
    </td>
  </tr>
</tbody>
</table>

### Built-in Uniforms

PixiJS viewport uses screen (CSS) coordinates, `(0, 0, renderer.screen.width, renderer.screen.height)`,
and `projectionMatrix` uniform maps it to the gl viewport.

**uSampler**

The most important uniform is the input texture that container was rendered into.
_Important note: as with all Framebuffers in PixiJS, both input and output are
premultiplied by alpha._

By default, input normalized coordinates are passed to fragment shader with `vTextureCoord`.
Use it to sample the input.

```js
import { Filter } from 'pixi.js';
const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

const myFilter = new Filter(null, fragment);
```

This filter is just one uniform less than PIXI.filters.AlphaFilter AlphaFilter.

**outputFrame**

The `outputFrame` holds the rectangle where filter is applied in screen (CSS) coordinates.
It's the same as `renderer.screen` for a fullscreen filter.
Only a part of  `outputFrame.zw` size of temporary Framebuffer is used,
`(0, 0, outputFrame.width, outputFrame.height)`,

Filters uses this quad to normalized (0-1) space, its passed into `aVertexPosition` attribute.
To calculate vertex position in screen space using normalized (0-1) space:

```glsl
vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}
```

**inputSize**

Temporary framebuffer is different, it can be either the size of screen, either power-of-two.
The `inputSize.xy` are size of temporary framebuffer that holds input.
The `inputSize.zw` is inverted, it's a shortcut to evade division inside the shader.

Set `inputSize.xy = outputFrame.zw` for a fullscreen filter.

To calculate input normalized coordinate, you have to map it to filter normalized space.
Multiply by `outputFrame.zw` to get input coordinate.
Divide by `inputSize.xy` to get input normalized coordinate.

```glsl
vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw); // same as /inputSize.xy
}
```

**resolution**

The `resolution` is the ratio of screen (CSS) pixels to real pixels.

**inputPixel**

`inputPixel.xy` is the size of framebuffer in real pixels, same as `inputSize.xy * resolution`
`inputPixel.zw` is inverted `inputPixel.xy`.

It's handy for filters that use neighbour pixels, like PIXI.filters.FXAAFilter FXAAFilter.

**inputClamp**

If you try to get info from outside of used part of Framebuffer - you'll get undefined behaviour.
For displacements, coordinates has to be clamped.

The `inputClamp.xy` is left-top pixel center, you may ignore it, because we use left-top part of Framebuffer
`inputClamp.zw` is bottom-right pixel center.

```glsl
vec4 color = texture2D(uSampler, clamp(modifiedTextureCoord, inputClamp.xy, inputClamp.zw));
```

Or:

```glsl
vec4 color = texture2D(uSampler, min(modifigedTextureCoord, inputClamp.zw));
```

### Additional Information

Complete documentation on Filter usage is located in the
[Wiki](https://github.com/pixijs/pixijs/wiki/v5-Creating-filters).

Since PixiJS only had a handful of built-in filters, additional filters can be downloaded
[here](https://github.com/pixijs/pixi-filters) from the PixiJS Filters repository.

**`Memberof`**

PIXI

## Hierarchy

- [`Shader`](pixi_core.Shader.md)

  ↳ **`Filter`**

  ↳↳ [`ISpriteMaskFilter`](../interfaces/pixi_core.ISpriteMaskFilter.md)

  ↳↳ [`SpriteMaskFilter`](pixi_core.SpriteMaskFilter.md)

## Constructors

### constructor

• **new Filter**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Overrides

[Shader](pixi_core.Shader.md).[constructor](pixi_core.Shader.md#constructor)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L240)

## Properties

### autoFit

• **autoFit**: `boolean`

If enabled, PixiJS will fit the filter area into boundaries for better performance.
Switch it off if it does not work for specific shader.

**`Default`**

true

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:222](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L222)

___

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Inherited from

[Shader](pixi_core.Shader.md).[disposeRunner](pixi_core.Shader.md#disposerunner)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L23)

___

### enabled

• **enabled**: `boolean`

If enabled is true the filter is applied, if false it will not.

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:215](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L215)

___

### legacy

• `Readonly` **legacy**: `boolean`

Legacy filters use position and uvs from attributes (set by filter system)

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:228](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L228)

___

### multisample

• **multisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

The samples override of the filter instance.

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:212](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L212)

___

### padding

• **padding**: `number`

The padding of the filter. Some filters require extra space to breath such as a blur.
Increasing this will add extra width and height to the bounds of the object that the
filter is applied to.

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:209](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L209)

___

### program

• **program**: [`Program`](pixi_core.Program.md)

Program that the shader uses.

#### Inherited from

[Shader](pixi_core.Shader.md).[program](pixi_core.Shader.md#program)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L14)

___

### state

• **state**: [`State`](pixi_core.State.md)

The WebGL state the filter requires to render.

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:231](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L231)

___

### uniformGroup

• **uniformGroup**: [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Inherited from

[Shader](pixi_core.Shader.md).[uniformGroup](pixi_core.Shader.md#uniformgroup)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L15)

___

### SOURCE\_KEY\_MAP

▪ `Static` **SOURCE\_KEY\_MAP**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`string`\>

Used for caching shader IDs.

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:322](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L322)

___

### defaultMultisample

▪ `Static` **defaultMultisample**: [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md) = `MSAA_QUALITY.NONE`

Default filter samples for any filter.

**`Static`**

**`Default`**

PIXI.MSAA_QUALITY.NONE

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L202)

___

### defaultResolution

▪ `Static` **defaultResolution**: `number` = `1`

Default filter resolution for any filter.

**`Static`**

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

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:279](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L279)

• `set` **blendMode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BLEND_MODES`](../enums/pixi_core.BLEND_MODES.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:284](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L284)

___

### resolution

• `get` **resolution**(): `number`

The resolution of the filter. Setting this to be lower will lower the quality but
increase the performance of the filter.

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:293](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L293)

• `set` **resolution**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:298](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L298)

___

### uniforms

• `get` **uniforms**(): [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

Shader uniform values, shortcut for `uniformGroup.uniforms`.

#### Returns

[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

#### Inherited from

Shader.uniforms

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L92)

___

### defaultFragmentSrc

• `Static` `get` **defaultFragmentSrc**(): `string`

The default fragment shader source

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:316](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L316)

___

### defaultVertexSrc

• `Static` `get` **defaultVertexSrc**(): `string`

The default vertex shader source

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:307](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L307)

## Methods

### apply

▸ **apply**(`filterManager`, `input`, `output`, `clearMode?`, `_currentState?`): `void`

Applies the filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterManager` | [`FilterSystem`](pixi_core.FilterSystem.md) | The renderer to retrieve the filter from |
| `input` | [`RenderTexture`](pixi_core.RenderTexture.md) | The input render target. |
| `output` | [`RenderTexture`](pixi_core.RenderTexture.md) | The target to output to. |
| `clearMode?` | [`CLEAR_MODES`](../enums/pixi_core.CLEAR_MODES.md) | Should the output be cleared before rendering to it. |
| `_currentState?` | `FilterState` | It's current state of filter. There are some useful properties in the currentState : target, filters, sourceFrame, destinationFrame, renderTarget, resolution |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/filters/Filter.ts:265](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/filters/Filter.ts#L265)

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

[Shader](pixi_core.Shader.md).[checkUniformExists](pixi_core.Shader.md#checkuniformexists)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L55)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](pixi_core.Shader.md).[destroy](pixi_core.Shader.md#destroy)

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

[Shader](pixi_core.Shader.md).[from](pixi_core.Shader.md#from)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L104)
