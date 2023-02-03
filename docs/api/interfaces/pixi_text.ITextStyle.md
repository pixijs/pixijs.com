---
id: "pixi_text.ITextStyle"
title: "Interface: ITextStyle"
sidebar_label: "ITextStyle"
custom_edit_url: null
---

[@pixi/text](../modules/pixi_text.md).ITextStyle

Generic interface for TextStyle options.

**`Memberof`**

PIXI

## Implemented by

- [`TextStyle`](../classes/pixi_text.TextStyle.md)

## Properties

### align

• **align**: [`TextStyleAlign`](../modules/pixi_text.md#textstylealign)

Alignment for multiline text, does not affect single line text

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L25)

___

### breakWords

• **breakWords**: `boolean`

Indicates if lines can be wrapped within words, it needs wordWrap to be set to true

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L27)

___

### dropShadow

• **dropShadow**: `boolean`

Set a drop shadow for the text

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L29)

___

### dropShadowAlpha

• **dropShadowAlpha**: `number`

Set alpha for the drop shadow

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L31)

___

### dropShadowAngle

• **dropShadowAngle**: `number`

Set a angle of the drop shadow

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L33)

___

### dropShadowBlur

• **dropShadowBlur**: `number`

Set a shadow blur radius

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L35)

___

### dropShadowColor

• **dropShadowColor**: `string` \| `number`

A fill style to be used on the dropshadow e.g., 'red', '#00FF00'

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L37)

___

### dropShadowDistance

• **dropShadowDistance**: `number`

Set a distance of the drop shadow

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L39)

___

### fill

• **fill**: [`TextStyleFill`](../modules/pixi_text.md#textstylefill)

A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L46)

___

### fillGradientStops

• **fillGradientStops**: `number`[]

If fill is an array of colours to create a gradient, this array can set
the stop points (numbers between 0 and 1) for the color, overriding the
default behaviour of evenly spacing them.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L58)

___

### fillGradientType

• **fillGradientType**: [`TEXT_GRADIENT`](../enums/pixi_text.TEXT_GRADIENT.md)

If fill is an array of colours to create a gradient, this can change the
type/direction of the gradient. See PIXI.TEXT_GRADIENT

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L52)

___

### fontFamily

• **fontFamily**: `string` \| `string`[]

The font family, can be a single font name, or a list of names where the first
is the preferred font.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:63](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L63)

___

### fontSize

• **fontSize**: `string` \| `number`

The font size (as a number it converts to px, but as a string,
equivalents are '26px','20pt','160%' or '1.6em')

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L68)

___

### fontStyle

• **fontStyle**: [`TextStyleFontStyle`](../modules/pixi_text.md#textstylefontstyle)

The font style.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L73)

___

### fontVariant

• **fontVariant**: [`TextStyleFontVariant`](../modules/pixi_text.md#textstylefontvariant)

The font variant.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L78)

___

### fontWeight

• **fontWeight**: [`TextStyleFontWeight`](../modules/pixi_text.md#textstylefontweight)

The font weight.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L83)

___

### leading

• **leading**: `number`

The height of the line, a number that represents the vertical space that a letter uses.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L85)

___

### letterSpacing

• **letterSpacing**: `number`

The amount of spacing between letters, default is 0

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:87](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L87)

___

### lineHeight

• **lineHeight**: `number`

The line height, a number that represents the vertical space that a letter uses

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L89)

___

### lineJoin

• **lineJoin**: [`TextStyleLineJoin`](../modules/pixi_text.md#textstylelinejoin)

The lineJoin property sets the type of corner created, it can resolve
spiked text issues. Possible values "miter" (creates a sharp corner),
"round" (creates a round corner) or "bevel" (creates a squared corner).

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L96)

___

### miterLimit

• **miterLimit**: `number`

The miter limit to use when using the 'miter' lineJoin mode. This can reduce
or increase the spikiness of rendered text.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L101)

___

### padding

• **padding**: `number`

Occasionally some fonts are cropped. Adding some padding will prevent this from
happening by adding padding to all sides of the text.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L106)

___

### stroke

• **stroke**: `string` \| `number`

A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:108](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L108)

___

### strokeThickness

• **strokeThickness**: `number`

A number that represents the thickness of the stroke. A value of 0 will disable stroke.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L110)

___

### textBaseline

• **textBaseline**: [`TextStyleTextBaseline`](../modules/pixi_text.md#textstyletextbaseline)

The baseline of the text that is rendered.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L115)

___

### trim

• **trim**: `boolean`

Trim transparent borders

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L117)

___

### whiteSpace

• **whiteSpace**: [`TextStyleWhiteSpace`](../modules/pixi_text.md#textstylewhitespace)

Determines whether newlines & spaces are collapsed or preserved "normal"
(collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
collapse). It needs wordWrap to be set to true.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L124)

___

### wordWrap

• **wordWrap**: `boolean`

Indicates if word wrap should be used

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L126)

___

### wordWrapWidth

• **wordWrapWidth**: `number`

The width at which text will wrap, it needs wordWrap to be set to true

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:128](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L128)
