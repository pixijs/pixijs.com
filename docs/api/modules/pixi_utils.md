---
id: "pixi_utils"
title: "Module: @pixi/utils"
sidebar_label: "@pixi/utils"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [CanvasRenderTarget](../classes/pixi_utils.CanvasRenderTarget.md)

## Interfaces

- [DecomposedDataUri](../interfaces/pixi_utils.DecomposedDataUri.md)
- [Path](../interfaces/pixi_utils.Path.md)

## Type Aliases

### ArrayFixed

Ƭ **ArrayFixed**<`T`, `L`\>: [`T`, ...T[]] & { `length`: `L`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `L` | extends `number` |

#### Defined in

[pixijs/packages/utils/src/types/index.ts:2](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/types/index.ts#L2)

___

### Dict

Ƭ **Dict**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Index signature

▪ [key: `string`]: `T`

#### Defined in

[pixijs/packages/utils/src/types/index.ts:4](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/types/index.ts#L4)

## Variables

### BaseTextureCache

• `Const` **BaseTextureCache**: `Object`

**`Todo`**

Describe property usage

**`Static`**

**`Name`**

BaseTextureCache

**`Memberof`**

PIXI.utils

#### Index signature

▪ [key: `string`]: `BaseTexture`

#### Defined in

[pixijs/packages/utils/src/media/caches.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/caches.ts#L28)

___

### DATA\_URI

• `Const` **DATA\_URI**: `RegExp`

Regexp for data URI.
Based on: [https://github.com/ragingwind/data-uri-regex](https://github.com/ragingwind/data-uri-regex)

**`Static`**

**`Memberof`**

PIXI

**`Example`**

```ts
import { DATA_URI } from 'pixi.js';

DATA_URI.test('data:image/png;base64,foobar'); // => true
```

#### Defined in

[pixijs/packages/utils/src/const.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/const.ts#L12)

___

### ProgramCache

• `Const` **ProgramCache**: `Object` = `{}`

**`Todo`**

Describe property usage

**`Static`**

**`Name`**

ProgramCache

**`Memberof`**

PIXI.utils

#### Index signature

▪ [key: `string`]: `Program`

#### Defined in

[pixijs/packages/utils/src/media/caches.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/caches.ts#L10)

___

### TextureCache

• `Const` **TextureCache**: `Object`

**`Todo`**

Describe property usage

**`Static`**

**`Name`**

TextureCache

**`Memberof`**

PIXI.utils

#### Index signature

▪ [key: `string`]: `Texture`

#### Defined in

[pixijs/packages/utils/src/media/caches.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/caches.ts#L19)

___

### isMobile

• `Const` **isMobile**: `isMobileResult`

#### Defined in

[pixijs/packages/settings/src/utils/isMobile.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/settings/src/utils/isMobile.ts#L39)

___

### path

• `Const` **path**: [`Path`](../interfaces/pixi_utils.Path.md)

#### Defined in

[pixijs/packages/utils/src/path.ts:153](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/path.ts#L153)

___

### premultiplyBlendMode

• `Const` **premultiplyBlendMode**: `number`[][]

maps premultiply flag and blendMode to adjusted blendMode

**`Memberof`**

PIXI.utils

#### Defined in

[pixijs/packages/utils/src/color/premultiply.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/premultiply.ts#L42)

___

### url

• `Const` **url**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `format` | `FormatFunction` |
| `parse` | `ParseFunction` |
| `resolve` | `ResolveFunction` |

#### Defined in

[pixijs/packages/utils/src/url.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/url.ts#L82)

## Functions

### clearTextureCache

▸ **clearTextureCache**(): `void`

Removes all textures from cache, but does not destroy them

**`Memberof`**

PIXI.utils

**`Function`**

clearTextureCache

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/caches.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/caches.ts#L54)

___

### correctBlendMode

▸ **correctBlendMode**(`blendMode`, `premultiplied`): `number`

changes blendMode according to texture format

**`Memberof`**

PIXI.utils

**`Function`**

correctBlendMode

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blendMode` | `number` | supposed blend mode |
| `premultiplied` | `boolean` | whether source is premultiplied |

#### Returns

`number`

true blend mode for this texture

#### Defined in

[pixijs/packages/utils/src/color/premultiply.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/premultiply.ts#L52)

___

### createIndicesForQuads

▸ **createIndicesForQuads**(`size`, `outBuffer?`): `Uint16Array` \| `Uint32Array`

Generic Mask Stack data structure

**`Memberof`**

PIXI.utils

**`Function`**

createIndicesForQuads

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `undefined` | Number of quads |
| `outBuffer?` | `Uint16Array` \| `Uint32Array` | `null` | Buffer for output, length has to be `6 * size` |

#### Returns

`Uint16Array` \| `Uint32Array`

- Resulting index buffer

#### Defined in

[pixijs/packages/utils/src/data/createIndicesForQuads.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/createIndicesForQuads.ts#L9)

___

### decomposeDataUri

▸ **decomposeDataUri**(`dataUri`): [`DecomposedDataUri`](../interfaces/pixi_utils.DecomposedDataUri.md)

Split a data URI into components. Returns undefined if
parameter `dataUri` is not a valid data URI.

**`Memberof`**

PIXI.utils

**`Function`**

decomposeDataUri

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataUri` | `string` | the data URI to check |

#### Returns

[`DecomposedDataUri`](../interfaces/pixi_utils.DecomposedDataUri.md)

The decomposed data uri or undefined

#### Defined in

[pixijs/packages/utils/src/network/decomposeDataUri.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/network/decomposeDataUri.ts#L54)

___

### deprecation

▸ **deprecation**(`version`, `message`, `ignoreDepth?`): `void`

Helper for warning developers about deprecated features & settings.
A stack track for warnings is given; useful for tracking-down where
deprecated methods/properties/classes are being used within the code.

**`Memberof`**

PIXI.utils

**`Function`**

deprecation

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `version` | `string` | `undefined` | The version where the feature became deprecated |
| `message` | `string` | `undefined` | Message should include what is deprecated, where, and the new solution |
| `ignoreDepth?` | `number` | `3` | The number of steps to ignore at the top of the error stack this is mostly to ignore internal deprecation calls. |

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/logging/deprecation.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/logging/deprecation.ts#L17)

___

### destroyTextureCache

▸ **destroyTextureCache**(): `void`

Destroys all texture in the cache

**`Memberof`**

PIXI.utils

**`Function`**

destroyTextureCache

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/caches.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/caches.ts#L35)

___

### getBufferType

▸ **getBufferType**(`array`): ``"Float32Array"`` \| ``"Uint32Array"`` \| ``"Int32Array"`` \| ``"Uint16Array"`` \| ``"Uint8Array"`` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `ITypedArray` |

#### Returns

``"Float32Array"`` \| ``"Uint32Array"`` \| ``"Int32Array"`` \| ``"Uint16Array"`` \| ``"Uint8Array"`` \| ``null``

#### Defined in

[pixijs/packages/utils/src/data/getBufferType.ts:3](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/getBufferType.ts#L3)

___

### getResolutionOfUrl

▸ **getResolutionOfUrl**(`url`, `defaultValue?`): `number`

get the resolution / device pixel ratio of an asset by looking for the prefix
used by spritesheets and image urls

**`Memberof`**

PIXI.utils

**`Function`**

getResolutionOfUrl

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `undefined` | the image path |
| `defaultValue?` | `number` | `1` | the defaultValue if no filename prefix is set. |

#### Returns

`number`

resolution / device pixel ratio of an asset

#### Defined in

[pixijs/packages/utils/src/network/getResolutionOfUrl.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/network/getResolutionOfUrl.ts#L12)

___

### hex2rgb

▸ **hex2rgb**(`hex`, `out?`): `number`[] \| `Float32Array`

Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).

**`Example`**

```ts
import { utils } from 'pixi.js';
utils.hex2rgb(0xffffff); // returns [1, 1, 1]
```

**`Memberof`**

PIXI.utils

**`Function`**

hex2rgb

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hex` | `number` | `undefined` | The hexadecimal number to convert |
| `out?` | `number`[] \| `Float32Array` | `[]` | If supplied, this array will be used rather than returning a new one |

#### Returns

`number`[] \| `Float32Array`

An array representing the [R, G, B] of the color where all values are floats.

#### Defined in

[pixijs/packages/utils/src/color/hex.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/hex.ts#L14)

___

### hex2string

▸ **hex2string**(`hex`): `string`

Converts a hexadecimal color number to a string.

**`Example`**

```ts
import { utils } from 'pixi.js';
utils.hex2string(0xffffff); // returns "#ffffff"
```

**`Memberof`**

PIXI.utils

**`Function`**

hex2string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | `number` | Number in hex (e.g., `0xffffff`) |

#### Returns

`string`

The string color (e.g., `"#ffffff"`).

#### Defined in

[pixijs/packages/utils/src/color/hex.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/hex.ts#L33)

___

### interleaveTypedArrays

▸ **interleaveTypedArrays**(`arrays`, `sizes`): `Float32Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrays` | `PackedArray`[] |
| `sizes` | `number`[] |

#### Returns

`Float32Array`

#### Defined in

[pixijs/packages/utils/src/data/interleaveTypedArrays.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/interleaveTypedArrays.ts#L8)

___

### isPow2

▸ **isPow2**(`v`): `boolean`

Checks if a number is a power of two.

**`Function`**

isPow2

**`Memberof`**

PIXI.utils

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | `number` | input value |

#### Returns

`boolean`

`true` if value is power of two

#### Defined in

[pixijs/packages/utils/src/data/pow2.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/pow2.ts#L30)

___

### isWebGLSupported

▸ **isWebGLSupported**(): `boolean`

Helper for checking for WebGL support.

**`Memberof`**

PIXI.utils

**`Function`**

isWebGLSupported

#### Returns

`boolean`

Is WebGL supported.

#### Defined in

[pixijs/packages/utils/src/browser/isWebGLSupported.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/browser/isWebGLSupported.ts#L11)

___

### log2

▸ **log2**(`v`): `number`

Computes ceil of log base 2

**`Function`**

log2

**`Memberof`**

PIXI.utils

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | `number` | input value |

#### Returns

`number`

logarithm base 2

#### Defined in

[pixijs/packages/utils/src/data/pow2.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/pow2.ts#L42)

___

### nextPow2

▸ **nextPow2**(`v`): `number`

Rounds to next power of two.

**`Function`**

nextPow2

**`Memberof`**

PIXI.utils

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | `number` | input value |

#### Returns

`number`

- next rounded power of two

#### Defined in

[pixijs/packages/utils/src/data/pow2.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/pow2.ts#L10)

___

### premultiplyRgba

▸ **premultiplyRgba**(`rgb`, `alpha`, `out?`, `premultiply?`): `Float32Array`

combines rgb and alpha to out array

**`Memberof`**

PIXI.utils

**`Function`**

premultiplyRgba

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rgb` | `number`[] \| `Float32Array` | input rgb |
| `alpha` | `number` | alpha param |
| `out?` | `Float32Array` | output |
| `premultiply?` | `boolean` | do premultiply it |

#### Returns

`Float32Array`

vec4 rgba

#### Defined in

[pixijs/packages/utils/src/color/premultiply.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/premultiply.ts#L67)

___

### premultiplyTint

▸ **premultiplyTint**(`tint`, `alpha`): `number`

premultiplies tint

**`Memberof`**

PIXI.utils

**`Function`**

premultiplyTint

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tint` | `number` | integer RGB |
| `alpha` | `number` | floating point alpha (0.0-1.0) |

#### Returns

`number`

tint multiplied by alpha

#### Defined in

[pixijs/packages/utils/src/color/premultiply.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/premultiply.ts#L100)

___

### premultiplyTintToRgba

▸ **premultiplyTintToRgba**(`tint`, `alpha`, `out?`, `premultiply?`): `Float32Array`

converts integer tint and float alpha to vec4 form, premultiplies by default

**`Memberof`**

PIXI.utils

**`Function`**

premultiplyTintToRgba

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tint` | `number` | input tint |
| `alpha` | `number` | alpha param |
| `out?` | `Float32Array` | output |
| `premultiply?` | `boolean` | do premultiply it |

#### Returns

`Float32Array`

vec4 rgba

#### Defined in

[pixijs/packages/utils/src/color/premultiply.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/premultiply.ts#L131)

___

### removeItems

▸ **removeItems**(`arr`, `startIdx`, `removeCount`): `void`

Remove items from a javascript array without generating garbage

**`Function`**

removeItems

**`Memberof`**

PIXI.utils

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | `any`[] | Array to remove elements from |
| `startIdx` | `number` | starting index |
| `removeCount` | `number` | how many to remove |

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/data/removeItems.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/removeItems.ts#L9)

___

### rgb2hex

▸ **rgb2hex**(`rgb`): `number`

Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.

**`Example`**

```ts
import { utils } from 'pixi.js';
utils.rgb2hex([1, 1, 1]); // returns 0xffffff, which is 16777215 as an integer
```

**`Memberof`**

PIXI.utils

**`Function`**

rgb2hex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rgb` | `number`[] \| `Float32Array` | Array of numbers where all values are normalized floats from 0.0 to 1.0. |

#### Returns

`number`

Number in hexadecimal.

#### Defined in

[pixijs/packages/utils/src/color/hex.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/hex.ts#L92)

___

### sayHello

▸ **sayHello**(): `void`

**`Static`**

**`Function`**

sayHello

**`Memberof`**

PIXI.utils

**`Deprecated`**

since 7.0.0

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/browser/hello.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/browser/hello.ts#L21)

___

### sign

▸ **sign**(`n`): ``-1`` \| ``0`` \| ``1``

Returns sign of number

**`Memberof`**

PIXI.utils

**`Function`**

sign

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n` | `number` | the number to check the sign of |

#### Returns

``-1`` \| ``0`` \| ``1``

0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive

#### Defined in

[pixijs/packages/utils/src/data/sign.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/sign.ts#L8)

___

### skipHello

▸ **skipHello**(): `void`

**`Function`**

skipHello

**`Memberof`**

PIXI.utils

**`Deprecated`**

since 7.0.0

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/browser/hello.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/browser/hello.ts#L8)

___

### string2hex

▸ **string2hex**(`string`): `number`

Converts a string to a hexadecimal color number.
It can handle:
 - hex strings starting with #: "#ffffff"
 - hex strings starting with 0x: "0xffffff"
 - hex strings without prefix: "ffffff"
 - hex strings (3 characters) with #: "#fff"
 - hex strings (3 characters) without prefix: "fff"
 - css colors: "black"

**`Example`**

```ts
import { utils } from 'pixi.js';
utils.string2hex("#ffffff"); // returns 0xffffff, which is 16777215 as an integer
```

**`Memberof`**

PIXI.utils

**`Function`**

string2hex

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `string` | `string` | The string color (e.g., `"#ffffff"`) |

#### Returns

`number`

Number in hexadecimal.

#### Defined in

[pixijs/packages/utils/src/color/hex.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/color/hex.ts#L59)

___

### trimCanvas

▸ **trimCanvas**(`canvas`): `Object`

Trim transparent borders from a canvas

**`Memberof`**

PIXI.utils

**`Function`**

trimCanvas

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | `ICanvas` | the canvas to trim |

#### Returns

`Object`

Trim data

| Name | Type |
| :------ | :------ |
| `data?` | `ImageData` |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[pixijs/packages/utils/src/media/trimCanvas.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/trimCanvas.ts#L32)

___

### uid

▸ **uid**(): `number`

Gets the next unique identifier

**`Memberof`**

PIXI.utils

**`Function`**

uid

#### Returns

`number`

The next unique identifier to use.

#### Defined in

[pixijs/packages/utils/src/data/uid.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/data/uid.ts#L9)
