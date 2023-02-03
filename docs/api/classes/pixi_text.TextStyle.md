---
id: "pixi_text.TextStyle"
title: "Class: TextStyle"
sidebar_label: "TextStyle"
custom_edit_url: null
---

[@pixi/text](../modules/pixi_text.md).TextStyle

A TextStyle Object contains information to decorate a Text objects.

An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.

A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).

**`Memberof`**

PIXI

**`Example`**

```ts
import { TextStyle } from 'pixi.js';
const style = new TextStyle({
  fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
  fontSize: 36,
});
```

## Implements

- [`ITextStyle`](../interfaces/pixi_text.ITextStyle.md)

## Constructors

### constructor

• **new TextStyle**(`style?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `style?` | `Partial`<[`ITextStyle`](../interfaces/pixi_text.ITextStyle.md)\> | TextStyle properties to be set on the text. See PIXI.TextStyle.defaultStyle for the default values. |

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:306](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L306)

## Properties

### styleID

• **styleID**: `number`

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L270)

___

### defaultStyle

▪ `Static` **defaultStyle**: [`ITextStyle`](../interfaces/pixi_text.ITextStyle.md)

Default style options used for all TextStyle instances.

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:161](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L161)

## Accessors

### align

• `get` **align**(): [`TextStyleAlign`](../modules/pixi_text.md#textstylealign)

Alignment for multiline text, does not affect single line text.

**`Member`**

#### Returns

[`TextStyleAlign`](../modules/pixi_text.md#textstylealign)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[align](../interfaces/pixi_text.ITextStyle.md#align)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:341](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L341)

• `set` **align**(`align`): `void`

Alignment for multiline text, does not affect single line text

#### Parameters

| Name | Type |
| :------ | :------ |
| `align` | [`TextStyleAlign`](../modules/pixi_text.md#textstylealign) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[align](../interfaces/pixi_text.ITextStyle.md#align)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:345](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L345)

___

### breakWords

• `get` **breakWords**(): `boolean`

Indicates if lines can be wrapped within words, it needs wordWrap to be set to true.

#### Returns

`boolean`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[breakWords](../interfaces/pixi_text.ITextStyle.md#breakwords)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:355](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L355)

• `set` **breakWords**(`breakWords`): `void`

Indicates if lines can be wrapped within words, it needs wordWrap to be set to true

#### Parameters

| Name | Type |
| :------ | :------ |
| `breakWords` | `boolean` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[breakWords](../interfaces/pixi_text.ITextStyle.md#breakwords)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:359](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L359)

___

### dropShadow

• `get` **dropShadow**(): `boolean`

Set a drop shadow for the text.

#### Returns

`boolean`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadow](../interfaces/pixi_text.ITextStyle.md#dropshadow)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:369](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L369)

• `set` **dropShadow**(`dropShadow`): `void`

Set a drop shadow for the text

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadow` | `boolean` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadow](../interfaces/pixi_text.ITextStyle.md#dropshadow)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L373)

___

### dropShadowAlpha

• `get` **dropShadowAlpha**(): `number`

Set alpha for the drop shadow.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowAlpha](../interfaces/pixi_text.ITextStyle.md#dropshadowalpha)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:383](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L383)

• `set` **dropShadowAlpha**(`dropShadowAlpha`): `void`

Set alpha for the drop shadow

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadowAlpha` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowAlpha](../interfaces/pixi_text.ITextStyle.md#dropshadowalpha)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:387](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L387)

___

### dropShadowAngle

• `get` **dropShadowAngle**(): `number`

Set a angle of the drop shadow.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowAngle](../interfaces/pixi_text.ITextStyle.md#dropshadowangle)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:397](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L397)

• `set` **dropShadowAngle**(`dropShadowAngle`): `void`

Set a angle of the drop shadow

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadowAngle` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowAngle](../interfaces/pixi_text.ITextStyle.md#dropshadowangle)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:401](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L401)

___

### dropShadowBlur

• `get` **dropShadowBlur**(): `number`

Set a shadow blur radius.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowBlur](../interfaces/pixi_text.ITextStyle.md#dropshadowblur)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:411](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L411)

• `set` **dropShadowBlur**(`dropShadowBlur`): `void`

Set a shadow blur radius

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadowBlur` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowBlur](../interfaces/pixi_text.ITextStyle.md#dropshadowblur)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:415](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L415)

___

### dropShadowColor

• `get` **dropShadowColor**(): `string` \| `number`

A fill style to be used on the dropshadow e.g., 'red', '#00FF00'.

#### Returns

`string` \| `number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowColor](../interfaces/pixi_text.ITextStyle.md#dropshadowcolor)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:425](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L425)

• `set` **dropShadowColor**(`dropShadowColor`): `void`

A fill style to be used on the dropshadow e.g., 'red', '#00FF00'

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadowColor` | `string` \| `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowColor](../interfaces/pixi_text.ITextStyle.md#dropshadowcolor)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:429](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L429)

___

### dropShadowDistance

• `get` **dropShadowDistance**(): `number`

Set a distance of the drop shadow.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowDistance](../interfaces/pixi_text.ITextStyle.md#dropshadowdistance)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:440](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L440)

• `set` **dropShadowDistance**(`dropShadowDistance`): `void`

Set a distance of the drop shadow

#### Parameters

| Name | Type |
| :------ | :------ |
| `dropShadowDistance` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[dropShadowDistance](../interfaces/pixi_text.ITextStyle.md#dropshadowdistance)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:444](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L444)

___

### fill

• `get` **fill**(): [`TextStyleFill`](../modules/pixi_text.md#textstylefill)

A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.

Can be an array to create a gradient e.g., `['#000000','#FFFFFF']`
[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN)

**`Member`**

#### Returns

[`TextStyleFill`](../modules/pixi_text.md#textstylefill)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fill](../interfaces/pixi_text.ITextStyle.md#fill)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:461](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L461)

• `set` **fill**(`fill`): `void`

A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fill` | [`TextStyleFill`](../modules/pixi_text.md#textstylefill) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fill](../interfaces/pixi_text.ITextStyle.md#fill)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:465](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L465)

___

### fillGradientStops

• `get` **fillGradientStops**(): `number`[]

If fill is an array of colours to create a gradient, this array can set the stop points
(numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.

#### Returns

`number`[]

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fillGradientStops](../interfaces/pixi_text.ITextStyle.md#fillgradientstops)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:502](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L502)

• `set` **fillGradientStops**(`fillGradientStops`): `void`

If fill is an array of colours to create a gradient, this array can set
the stop points (numbers between 0 and 1) for the color, overriding the
default behaviour of evenly spacing them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fillGradientStops` | `number`[] |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fillGradientStops](../interfaces/pixi_text.ITextStyle.md#fillgradientstops)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:506](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L506)

___

### fillGradientType

• `get` **fillGradientType**(): [`TEXT_GRADIENT`](../enums/pixi_text.TEXT_GRADIENT.md)

If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.

#### Returns

[`TEXT_GRADIENT`](../enums/pixi_text.TEXT_GRADIENT.md)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fillGradientType](../interfaces/pixi_text.ITextStyle.md#fillgradienttype)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:485](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L485)

• `set` **fillGradientType**(`fillGradientType`): `void`

If fill is an array of colours to create a gradient, this can change the
type/direction of the gradient. See PIXI.TEXT_GRADIENT

#### Parameters

| Name | Type |
| :------ | :------ |
| `fillGradientType` | [`TEXT_GRADIENT`](../enums/pixi_text.TEXT_GRADIENT.md) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fillGradientType](../interfaces/pixi_text.ITextStyle.md#fillgradienttype)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:489](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L489)

___

### fontFamily

• `get` **fontFamily**(): `string` \| `string`[]

The font family, can be a single font name, or a list of names where the first
is the preferred font.

#### Returns

`string` \| `string`[]

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontFamily](../interfaces/pixi_text.ITextStyle.md#fontfamily)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:519](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L519)

• `set` **fontFamily**(`fontFamily`): `void`

The font family, can be a single font name, or a list of names where the first
is the preferred font.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fontFamily` | `string` \| `string`[] |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontFamily](../interfaces/pixi_text.ITextStyle.md#fontfamily)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:523](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L523)

___

### fontSize

• `get` **fontSize**(): `string` \| `number`

The font size
(as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')

#### Returns

`string` \| `number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontSize](../interfaces/pixi_text.ITextStyle.md#fontsize)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:536](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L536)

• `set` **fontSize**(`fontSize`): `void`

The font size (as a number it converts to px, but as a string,
equivalents are '26px','20pt','160%' or '1.6em')

#### Parameters

| Name | Type |
| :------ | :------ |
| `fontSize` | `string` \| `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontSize](../interfaces/pixi_text.ITextStyle.md#fontsize)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:540](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L540)

___

### fontStyle

• `get` **fontStyle**(): [`TextStyleFontStyle`](../modules/pixi_text.md#textstylefontstyle)

The font style.

**`Member`**

#### Returns

[`TextStyleFontStyle`](../modules/pixi_text.md#textstylefontstyle)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontStyle](../interfaces/pixi_text.ITextStyle.md#fontstyle)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:554](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L554)

• `set` **fontStyle**(`fontStyle`): `void`

The font style.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fontStyle` | [`TextStyleFontStyle`](../modules/pixi_text.md#textstylefontstyle) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontStyle](../interfaces/pixi_text.ITextStyle.md#fontstyle)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:558](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L558)

___

### fontVariant

• `get` **fontVariant**(): [`TextStyleFontVariant`](../modules/pixi_text.md#textstylefontvariant)

The font variant.

**`Member`**

#### Returns

[`TextStyleFontVariant`](../modules/pixi_text.md#textstylefontvariant)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontVariant](../interfaces/pixi_text.ITextStyle.md#fontvariant)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:572](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L572)

• `set` **fontVariant**(`fontVariant`): `void`

The font variant.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fontVariant` | [`TextStyleFontVariant`](../modules/pixi_text.md#textstylefontvariant) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontVariant](../interfaces/pixi_text.ITextStyle.md#fontvariant)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:576](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L576)

___

### fontWeight

• `get` **fontWeight**(): [`TextStyleFontWeight`](../modules/pixi_text.md#textstylefontweight)

The font weight.

**`Member`**

#### Returns

[`TextStyleFontWeight`](../modules/pixi_text.md#textstylefontweight)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontWeight](../interfaces/pixi_text.ITextStyle.md#fontweight)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:590](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L590)

• `set` **fontWeight**(`fontWeight`): `void`

The font weight.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fontWeight` | [`TextStyleFontWeight`](../modules/pixi_text.md#textstylefontweight) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[fontWeight](../interfaces/pixi_text.ITextStyle.md#fontweight)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:594](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L594)

___

### leading

• `get` **leading**(): `number`

The space between lines.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[leading](../interfaces/pixi_text.ITextStyle.md#leading)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:632](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L632)

• `set` **leading**(`leading`): `void`

The height of the line, a number that represents the vertical space that a letter uses.

#### Parameters

| Name | Type |
| :------ | :------ |
| `leading` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[leading](../interfaces/pixi_text.ITextStyle.md#leading)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:636](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L636)

___

### letterSpacing

• `get` **letterSpacing**(): `number`

The amount of spacing between letters, default is 0.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[letterSpacing](../interfaces/pixi_text.ITextStyle.md#letterspacing)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:604](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L604)

• `set` **letterSpacing**(`letterSpacing`): `void`

The amount of spacing between letters, default is 0

#### Parameters

| Name | Type |
| :------ | :------ |
| `letterSpacing` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[letterSpacing](../interfaces/pixi_text.ITextStyle.md#letterspacing)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:608](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L608)

___

### lineHeight

• `get` **lineHeight**(): `number`

The line height, a number that represents the vertical space that a letter uses.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[lineHeight](../interfaces/pixi_text.ITextStyle.md#lineheight)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:618](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L618)

• `set` **lineHeight**(`lineHeight`): `void`

The line height, a number that represents the vertical space that a letter uses

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineHeight` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[lineHeight](../interfaces/pixi_text.ITextStyle.md#lineheight)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:622](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L622)

___

### lineJoin

• `get` **lineJoin**(): [`TextStyleLineJoin`](../modules/pixi_text.md#textstylelinejoin)

The lineJoin property sets the type of corner created, it can resolve spiked text issues.
Default is 'miter' (creates a sharp corner).

**`Member`**

#### Returns

[`TextStyleLineJoin`](../modules/pixi_text.md#textstylelinejoin)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[lineJoin](../interfaces/pixi_text.ITextStyle.md#linejoin)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:651](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L651)

• `set` **lineJoin**(`lineJoin`): `void`

The lineJoin property sets the type of corner created, it can resolve
spiked text issues. Possible values "miter" (creates a sharp corner),
"round" (creates a round corner) or "bevel" (creates a squared corner).

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineJoin` | [`TextStyleLineJoin`](../modules/pixi_text.md#textstylelinejoin) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[lineJoin](../interfaces/pixi_text.ITextStyle.md#linejoin)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:655](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L655)

___

### miterLimit

• `get` **miterLimit**(): `number`

The miter limit to use when using the 'miter' lineJoin mode.

This can reduce or increase the spikiness of rendered text.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[miterLimit](../interfaces/pixi_text.ITextStyle.md#miterlimit)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:669](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L669)

• `set` **miterLimit**(`miterLimit`): `void`

The miter limit to use when using the 'miter' lineJoin mode. This can reduce
or increase the spikiness of rendered text.

#### Parameters

| Name | Type |
| :------ | :------ |
| `miterLimit` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[miterLimit](../interfaces/pixi_text.ITextStyle.md#miterlimit)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:673](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L673)

___

### padding

• `get` **padding**(): `number`

Occasionally some fonts are cropped. Adding some padding will prevent this from happening
by adding padding to all sides of the text.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[padding](../interfaces/pixi_text.ITextStyle.md#padding)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:686](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L686)

• `set` **padding**(`padding`): `void`

Occasionally some fonts are cropped. Adding some padding will prevent this from
happening by adding padding to all sides of the text.

#### Parameters

| Name | Type |
| :------ | :------ |
| `padding` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[padding](../interfaces/pixi_text.ITextStyle.md#padding)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:690](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L690)

___

### stroke

• `get` **stroke**(): `string` \| `number`

A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'

#### Returns

`string` \| `number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[stroke](../interfaces/pixi_text.ITextStyle.md#stroke)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:702](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L702)

• `set` **stroke**(`stroke`): `void`

A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'

#### Parameters

| Name | Type |
| :------ | :------ |
| `stroke` | `string` \| `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[stroke](../interfaces/pixi_text.ITextStyle.md#stroke)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:706](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L706)

___

### strokeThickness

• `get` **strokeThickness**(): `number`

A number that represents the thickness of the stroke.

**`Default`**

0

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[strokeThickness](../interfaces/pixi_text.ITextStyle.md#strokethickness)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:724](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L724)

• `set` **strokeThickness**(`strokeThickness`): `void`

A number that represents the thickness of the stroke. A value of 0 will disable stroke.

#### Parameters

| Name | Type |
| :------ | :------ |
| `strokeThickness` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[strokeThickness](../interfaces/pixi_text.ITextStyle.md#strokethickness)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:728](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L728)

___

### textBaseline

• `get` **textBaseline**(): [`TextStyleTextBaseline`](../modules/pixi_text.md#textstyletextbaseline)

The baseline of the text that is rendered.

**`Member`**

#### Returns

[`TextStyleTextBaseline`](../modules/pixi_text.md#textstyletextbaseline)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[textBaseline](../interfaces/pixi_text.ITextStyle.md#textbaseline)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:742](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L742)

• `set` **textBaseline**(`textBaseline`): `void`

The baseline of the text that is rendered.

#### Parameters

| Name | Type |
| :------ | :------ |
| `textBaseline` | [`TextStyleTextBaseline`](../modules/pixi_text.md#textstyletextbaseline) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[textBaseline](../interfaces/pixi_text.ITextStyle.md#textbaseline)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:746](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L746)

___

### trim

• `get` **trim**(): `boolean`

Trim transparent borders.

#### Returns

`boolean`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[trim](../interfaces/pixi_text.ITextStyle.md#trim)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:756](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L756)

• `set` **trim**(`trim`): `void`

Trim transparent borders

#### Parameters

| Name | Type |
| :------ | :------ |
| `trim` | `boolean` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[trim](../interfaces/pixi_text.ITextStyle.md#trim)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:760](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L760)

___

### whiteSpace

• `get` **whiteSpace**(): [`TextStyleWhiteSpace`](../modules/pixi_text.md#textstylewhitespace)

How newlines and spaces should be handled.
Default is 'pre' (preserve, preserve).

 value       | New lines     |   Spaces
 ---         | ---           |   ---
'normal'     | Collapse      |   Collapse
'pre'        | Preserve      |   Preserve
'pre-line'   | Preserve      |   Collapse

**`Member`**

#### Returns

[`TextStyleWhiteSpace`](../modules/pixi_text.md#textstylewhitespace)

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[whiteSpace](../interfaces/pixi_text.ITextStyle.md#whitespace)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:781](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L781)

• `set` **whiteSpace**(`whiteSpace`): `void`

Determines whether newlines & spaces are collapsed or preserved "normal"
(collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
collapse). It needs wordWrap to be set to true.

#### Parameters

| Name | Type |
| :------ | :------ |
| `whiteSpace` | [`TextStyleWhiteSpace`](../modules/pixi_text.md#textstylewhitespace) |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[whiteSpace](../interfaces/pixi_text.ITextStyle.md#whitespace)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:785](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L785)

___

### wordWrap

• `get` **wordWrap**(): `boolean`

Indicates if word wrap should be used.

#### Returns

`boolean`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[wordWrap](../interfaces/pixi_text.ITextStyle.md#wordwrap)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:795](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L795)

• `set` **wordWrap**(`wordWrap`): `void`

Indicates if word wrap should be used

#### Parameters

| Name | Type |
| :------ | :------ |
| `wordWrap` | `boolean` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[wordWrap](../interfaces/pixi_text.ITextStyle.md#wordwrap)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:799](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L799)

___

### wordWrapWidth

• `get` **wordWrapWidth**(): `number`

The width at which text will wrap, it needs wordWrap to be set to true.

#### Returns

`number`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[wordWrapWidth](../interfaces/pixi_text.ITextStyle.md#wordwrapwidth)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:809](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L809)

• `set` **wordWrapWidth**(`wordWrapWidth`): `void`

The width at which text will wrap, it needs wordWrap to be set to true

#### Parameters

| Name | Type |
| :------ | :------ |
| `wordWrapWidth` | `number` |

#### Returns

`void`

#### Implementation of

[ITextStyle](../interfaces/pixi_text.ITextStyle.md).[wordWrapWidth](../interfaces/pixi_text.ITextStyle.md#wordwrapwidth)

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:813](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L813)

## Methods

### clone

▸ **clone**(): [`TextStyle`](pixi_text.TextStyle.md)

Creates a new TextStyle object with the same values as this one.
Note that the only the properties of the object are cloned.

#### Returns

[`TextStyle`](pixi_text.TextStyle.md)

New cloned TextStyle object

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:321](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L321)

___

### reset

▸ **reset**(): `void`

Resets all properties to the defaults specified in TextStyle.prototype._default

#### Returns

`void`

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:331](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L331)

___

### toFontString

▸ **toFontString**(): `string`

Generates a font style string to use for `TextMetrics.measureFont()`.

#### Returns

`string`

Font style string, for passing to `TextMetrics.measureFont()`

#### Defined in

[pixijs/packages/text/src/TextStyle.ts:827](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text/src/TextStyle.ts#L827)
