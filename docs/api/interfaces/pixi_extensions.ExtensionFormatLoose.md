---
id: "pixi_extensions.ExtensionFormatLoose"
title: "Interface: ExtensionFormatLoose"
sidebar_label: "ExtensionFormatLoose"
custom_edit_url: null
---

[@pixi/extensions](../modules/pixi_extensions.md).ExtensionFormatLoose

Format when registering an extension. Generally, the extension
should have these values as `extension` static property,
but you can override name or type by providing an object.

**`Memberof`**

PIXI

## Hierarchy

- **`ExtensionFormatLoose`**

  ↳ [`ExtensionFormat`](pixi_extensions.ExtensionFormat.md)

## Properties

### name

• `Optional` **name**: `string`

Optional. Some plugins provide an API name/property, such as Renderer plugins

#### Defined in

[pixijs/packages/extensions/src/index.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L48)

___

### priority

• `Optional` **priority**: `number`

Optional, used for sorting the plugins in a particular order

#### Defined in

[pixijs/packages/extensions/src/index.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L50)

___

### ref

• **ref**: `any`

Reference to the plugin object/class

#### Defined in

[pixijs/packages/extensions/src/index.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L52)

___

### type

• **type**: [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md) \| [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md)[]

The extension type, can be multiple types

#### Defined in

[pixijs/packages/extensions/src/index.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L46)
