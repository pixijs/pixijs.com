---
id: "pixi_text.TextMetrics"
title: "Class: TextMetrics"
sidebar_label: "TextMetrics"
custom_edit_url: null
---

[@pixi/text](../modules/pixi_text.md).TextMetrics

The TextMetrics object represents the measurement of a block of text with a specified style.

**`Example`**

```ts
import { TextMetrics, TextStyle } from 'pixi.js';

const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xff1010,
    align: 'center',
});
const textMetrics = TextMetrics.measureText('Your text', style);
```

**`Memberof`**

PIXI

## Constructors

### constructor

• **new TextMetrics**(`text`, `style`, `width`, `height`, `lines`, `lineWidths`, `lineHeight`, `maxLineWidth`, `fontProperties`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the text that was measured |
| `style` | [`TextStyle`](pixi_text.TextStyle.md) | the style that was measured |
| `width` | `number` | the measured width of the text |
| `height` | `number` | the measured height of the text |
| `lines` | `string`[] | an array of the lines of text broken by new lines and wrapping if specified in style |
| `lineWidths` | `number`[] | an array of the line widths for each line matched to `lines` |
| `lineHeight` | `number` | the measured line height for this style |
| `maxLineWidth` | `number` | the maximum line width for all measured lines |
| `fontProperties` | `IFontMetrics` | the font properties object from TextMetrics.measureFont |

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:216](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L216)

## Properties

### fontProperties

• **fontProperties**: `IFontMetrics`

The font properties object from TextMetrics.measureFont.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L101)

___

### height

• **height**: `number`

The measured height of the text.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L86)

___

### lineHeight

• **lineHeight**: `number`

The measured line height for this style.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L95)

___

### lineWidths

• **lineWidths**: `number`[]

An array of the line widths for each line matched to `lines`.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L92)

___

### lines

• **lines**: `string`[]

An array of lines of the text broken by new lines and wrapping is specified in style.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L89)

___

### maxLineWidth

• **maxLineWidth**: `number`

The maximum line width for all measured lines.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L98)

___

### style

• **style**: [`TextStyle`](pixi_text.TextStyle.md)

The style that was measured.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L80)

___

### text

• **text**: `string`

The text that was measured.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L77)

___

### width

• **width**: `number`

The measured width of the text.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L83)

___

### BASELINE\_MULTIPLIER

▪ `Static` **BASELINE\_MULTIPLIER**: `number` = `1.4`

Baseline multiplier for calculate font metrics.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L113)

___

### BASELINE\_SYMBOL

▪ `Static` **BASELINE\_SYMBOL**: `string` = `'M'`

Baseline symbol for calculate font metrics.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L110)

___

### HEIGHT\_MULTIPLIER

▪ `Static` **HEIGHT\_MULTIPLIER**: `number` = `2.0`

Height multiplier for setting height of canvas to calculate font metrics.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:116](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L116)

___

### METRICS\_STRING

▪ `Static` **METRICS\_STRING**: `string` = `'|ÉqÅ'`

String used for calculate font metrics.
These characters are all tall to help calculate the height required for text.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L107)

___

### \_experimentalLetterSpacingSupported

▪ `Static` `Optional` **\_experimentalLetterSpacingSupported**: `boolean`

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L141)

___

### experimentalLetterSpacing

▪ `Static` **experimentalLetterSpacing**: `boolean` = `false`

New rendering behavior for letter-spacing which uses Chrome's new native API. This will
lead to more accurate letter-spacing results because it does not try to manually draw
each character. However, this Chrome API is experimental and may not serve all cases yet.

**`See`**

PIXI.TextMetrics.experimentalLetterSpacingSupported

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:173](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L173)

___

### graphemeSegmenter

▪ `Static` **graphemeSegmenter**: (`s`: `string`) => `string`[]

#### Type declaration

▸ (`s`): `string`[]

A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
you can use other libraries such as [grapheme-splitter][https://www.npmjs.com/package/grapheme-splitter](https://www.npmjs.com/package/grapheme-splitter)
or [graphemer][https://www.npmjs.com/package/graphemer](https://www.npmjs.com/package/graphemer) to create a polyfill. Since these libraries can be
relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.

##### Parameters

| Name | Type |
| :------ | :------ |
| `s` | `string` |

##### Returns

`string`[]

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L129)

## Accessors

### experimentalLetterSpacingSupported

• `Static` `get` **experimentalLetterSpacingSupported**(): `boolean`

Checking that we can use modern canvas 2D API.

Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.

**`See`**

 - PIXI.TextMetrics.experimentalLetterSpacing
 - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
 - https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441

#### Returns

`boolean`

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:151](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L151)

## Methods

### canBreakChars

▸ `Static` **canBreakChars**(`_char`, `_nextChar`, `_token`, `_index`, `_breakWords`): `boolean`

Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.

It allows one to determine whether a pair of characters
should be broken by newlines
For example certain characters in CJK langs or numbers.
It must return a boolean.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_char` | `string` | The character |
| `_nextChar` | `string` | The next character |
| `_token` | `string` | The token/word the characters are from |
| `_index` | `number` | The index in the token of the char |
| `_breakWords` | `boolean` | The style attr break words |

#### Returns

`boolean`

whether to break word or not

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:734](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L734)

___

### canBreakWords

▸ `Static` **canBreakWords**(`_token`, `breakWords`): `boolean`

Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.

It allows one to customise which words should break
Examples are if the token is CJK or numbers.
It must return a boolean.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_token` | `string` | The token |
| `breakWords` | `boolean` | The style attr break words |

#### Returns

`boolean`

Whether to break word or not

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:715](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L715)

___

### clearMetrics

▸ `Static` **clearMetrics**(`font?`): `void`

Clear font metrics in metrics cache.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `font?` | `string` | `''` | font name. If font name not set then clear cache for all fonts. |

#### Returns

`void`

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:866](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L866)

___

### isBreakingSpace

▸ `Static` **isBreakingSpace**(`char`, `_nextChar?`): `boolean`

Determines if char is a breaking whitespace.

It allows one to determine whether char should be a breaking whitespace
For example certain characters in CJK langs or numbers.
It must return a boolean.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `char` | `string` | The character |
| `_nextChar?` | `string` | The next character |

#### Returns

`boolean`

True if whitespace, False otherwise.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:651](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L651)

___

### measureFont

▸ `Static` **measureFont**(`font`): `IFontMetrics`

Calculates the ascent, descent and fontSize of a given font-style

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `font` | `string` | String representing the style of the font |

#### Returns

`IFontMetrics`

Font properties object

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:760](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L760)

___

### measureText

▸ `Static` **measureText**(`text`, `style`, `wordWrap?`, `canvas?`): [`TextMetrics`](pixi_text.TextMetrics.md)

Measures the supplied string of text and returns a Rectangle.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `text` | `string` | `undefined` | The text to measure. |
| `style` | [`TextStyle`](pixi_text.TextStyle.md) | `undefined` | The text style to use for measuring |
| `wordWrap?` | `boolean` | `undefined` | Override for if word-wrap should be applied to the text. |
| `canvas` | `ICanvas` | `TextMetrics._canvas` | optional specification of the canvas to use for measuring. |

#### Returns

[`TextMetrics`](pixi_text.TextMetrics.md)

Measured width and height of the text.

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:238](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L238)

___

### wordWrapSplit

▸ `Static` **wordWrapSplit**(`token`): `string`[]

Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.

It is called when a token (usually a word) has to be split into separate pieces
in order to determine the point to break a word.
It must return an array of characters.

**`See`**

TextMetrics.graphemeSegmenter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | The token to split |

#### Returns

`string`[]

The characters of the token

#### Defined in

[pixijs/packages/text/src/TextMetrics.ts:750](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextMetrics.ts#L750)
