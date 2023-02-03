---
id: "pixi_assets.LoaderParserPriority"
title: "Enumeration: LoaderParserPriority"
sidebar_label: "LoaderParserPriority"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).LoaderParserPriority

The extension priority for loader parsers.
Helpful when managing multiple parsers that share the same extension
test. The higher priority parsers will be checked first.

## Enumeration Members

### High

• **High** = ``2``

Specific texture types: svg, png, ktx, dds, basis

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L18)

___

### Low

• **Low** = ``0``

Generic parsers: txt, json, webfonts

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L14)

___

### Normal

• **Normal** = ``1``

PixiJS assets with generic extensions: spritesheets, bitmapfonts

#### Defined in

[pixijs/packages/assets/src/loader/parsers/LoaderParser.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/loader/parsers/LoaderParser.ts#L16)
