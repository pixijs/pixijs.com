---
id: "pixi_filter_color_matrix.ColorMatrixFilter"
title: "Class: ColorMatrixFilter"
sidebar_label: "ColorMatrixFilter"
custom_edit_url: null
---

[@pixi/filter-color-matrix](../modules/pixi_filter_color_matrix.md).ColorMatrixFilter

The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA
color and alpha values of every pixel on your displayObject to produce a result
with a new set of RGBA color and alpha values. It's pretty powerful!

**`Example`**

```ts
import { filters } from 'pixi.js';

const colorMatrix = new filters.ColorMatrixFilter();
container.filters = [colorMatrix];
colorMatrix.contrast(2);
```

**`Author`**

Clément Chenebault <clement@goodboydigital.com>

**`Memberof`**

PIXI.filters

## Hierarchy

- `Filter`

  ↳ **`ColorMatrixFilter`**

## Constructors

### constructor

• **new ColorMatrixFilter**()

#### Overrides

Filter.constructor

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L25)

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

### grayscale

• **grayscale**: (`scale`: `number`, `multiply`: `boolean`) => `void`

#### Type declaration

▸ (`scale`, `multiply`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `scale` | `number` |
| `multiply` | `boolean` |

##### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L23)

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

### alpha

• `get` **alpha**(): `number`

The opacity value to use when mixing the original and resultant colors.

When the value is 0, the original color is used without modification.
When the value is 1, the result color is used.
When in the range (0, 1) the color is interpolated between the original and result by this amount.

**`Default`**

1

#### Returns

`number`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:580](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L580)

• `set` **alpha**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:585](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L585)

___

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

### matrix

• `get` **matrix**(): [`ColorMatrix`](../modules/pixi_filter_color_matrix.md#colormatrix)

The matrix of the color matrix filter

**`Member`**

**`Default`**

[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]

#### Returns

[`ColorMatrix`](../modules/pixi_filter_color_matrix.md#colormatrix)

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:562](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L562)

• `set` **matrix**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`ColorMatrix`](../modules/pixi_filter_color_matrix.md#colormatrix) |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:567](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L567)

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

### blackAndWhite

▸ **blackAndWhite**(`multiply`): `void`

Set the black and white matrice.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:184](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L184)

___

### brightness

▸ **brightness**(`b`, `multiply`): `void`

Adjusts brightness

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `b` | `number` | value of the brigthness (0-1, where 0 is black) |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L125)

___

### browni

▸ **browni**(`multiply`): `void`

Brown delicious browni filter (thanks Dominic Szablewski)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:406](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L406)

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

### colorTone

▸ **colorTone**(`desaturation`, `toned`, `lightColor`, `darkColor`, `multiply`): `void`

We don't know exactly what it does, kind of gradient map, but funny to play with!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desaturation` | `number` | Tone values. |
| `toned` | `number` | Tone values. |
| `lightColor` | `number` | Tone values, example: `0xFFE580` |
| `darkColor` | `number` | Tone values, example: `0xFFE580` |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:444](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L444)

___

### contrast

▸ **contrast**(`amount`, `multiply`): `void`

Set the contrast matrix, increase the separation between dark and bright
Increase contrast : shadows darker and highlights brighter
Decrease contrast : bring the shadows up and the highlights down

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | value of the contrast (0-1) |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:256](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L256)

___

### desaturate

▸ **desaturate**(): `void`

Desaturate image (remove color) Call the saturate function

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:294](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L294)

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

### greyscale

▸ **greyscale**(`scale`, `multiply`): `void`

Set the matrices in grey scales

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scale` | `number` | value of the grey (0-1, where 0 is black) |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L167)

___

### hue

▸ **hue**(`rotation`, `multiply`): `void`

Set the hue property of the color

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rotation` | `number` | in degrees |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L202)

___

### kodachrome

▸ **kodachrome**(`multiply`): `void`

Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:389](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L389)

___

### lsd

▸ **lsd**(`multiply`): `void`

LSD effect

Multiply the current matrix

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:532](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L532)

___

### negative

▸ **negative**(`multiply`): `void`

Negative image (inverse of classic rgb matrix)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:304](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L304)

___

### night

▸ **night**(`intensity`, `multiply`): `void`

Night effect

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `intensity` | `number` | The intensity of the night effect. |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:475](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L475)

___

### polaroid

▸ **polaroid**(`multiply`): `void`

Polaroid filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:355](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L355)

___

### predator

▸ **predator**(`amount`, `multiply`): `void`

Predator effect

Erase the current matrix by setting a new indepent one

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `number` | how much the predator feels his future victim |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:497](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L497)

___

### reset

▸ **reset**(): `void`

Erase the current matrix by setting the default one.

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:545](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L545)

___

### saturate

▸ **saturate**(`amount?`, `multiply?`): `void`

Set the saturation matrix, increase the separation between colors
Increase saturation : increase contrast, brightness, and sharpness

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `amount` | `number` | `0` | The saturation amount (0-1) |
| `multiply?` | `boolean` | `undefined` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:278](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L278)

___

### sepia

▸ **sepia**(`multiply`): `void`

Sepia image

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:321](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L321)

___

### technicolor

▸ **technicolor**(`multiply`): `void`

Color motion picture process invented in 1916 (thanks Dominic Szablewski)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L338)

___

### tint

▸ **tint**(`color`, `multiply?`): `void`

Sets each channel on the diagonal of the color matrix.
This can be used to achieve a tinting effect on Containers similar to the tint field of some
display objects like Sprite, Text, Graphics, and Mesh.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `number` | Color of the tint. This is a hex value. |
| `multiply?` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L145)

___

### toBGR

▸ **toBGR**(`multiply`): `void`

Filter who transforms : Red -> Blue and Blue -> Red

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:372](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L372)

___

### vintage

▸ **vintage**(`multiply`): `void`

Vintage filter (thanks Dominic Szablewski)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `multiply` | `boolean` | if true, current matrix and matrix are multiplied. If false, just set the current matrix with |

#### Returns

`void`

#### Defined in

[pixijs/packages/filter-color-matrix/src/ColorMatrixFilter.ts:423](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/filter-color-matrix/src/ColorMatrixFilter.ts#L423)

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
