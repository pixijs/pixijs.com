---
id: "pixi_extensions"
title: "Module: @pixi/extensions"
sidebar_label: "@pixi/extensions"
sidebar_position: 0
custom_edit_url: null
---

## Enumerations

- [ExtensionType](../enums/pixi_extensions.ExtensionType.md)

## Interfaces

- [ExtensionFormat](../interfaces/pixi_extensions.ExtensionFormat.md)
- [ExtensionFormatLoose](../interfaces/pixi_extensions.ExtensionFormatLoose.md)

## Type Aliases

### ExtensionHandler

Ƭ **ExtensionHandler**: (`extension`: [`ExtensionFormat`](../interfaces/pixi_extensions.ExtensionFormat.md)) => `void`

#### Type declaration

▸ (`extension`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `extension` | [`ExtensionFormat`](../interfaces/pixi_extensions.ExtensionFormat.md) |

##### Returns

`void`

#### Defined in

[pixijs/packages/extensions/src/index.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L65)

___

### ExtensionMetadata

Ƭ **ExtensionMetadata**: [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md) \| `ExtensionMetadataDetails`

#### Defined in

[pixijs/packages/extensions/src/index.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L35)

## Variables

### extensions

• `Const` **extensions**: `Object`

Global registration of all PixiJS extensions. One-stop-shop for extensibility.

**`Memberof`**

PIXI

**`Namespace`**

extensions

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | (...`extensions`: `any`[]) => { \_addHandlers: Record<ExtensionType, ExtensionHandler\>; \_removeHandlers: Record<ExtensionType, ExtensionHandler\>; ... 5 more ...; handleByList(type: ExtensionType, list: any[], defaultPriority?: number): ...; } |
| `handle` | (`type`: [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md), `onAdd`: [`ExtensionHandler`](pixi_extensions.md#extensionhandler), `onRemove`: [`ExtensionHandler`](pixi_extensions.md#extensionhandler)) => { \_addHandlers: Record<ExtensionType, ExtensionHandler\>; \_removeHandlers: Record<ExtensionType, ExtensionHandler\>; ... 5 more ...; handleByList(type: ExtensionType, list: any[], defaultPriority?: number): ...; } |
| `handleByList` | (`type`: [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md), `list`: `any`[], `defaultPriority`: `number`) => { \_addHandlers: Record<ExtensionType, ExtensionHandler\>; \_removeHandlers: Record<ExtensionType, ExtensionHandler\>; ... 5 more ...; handleByList(type: ExtensionType, list: any[], defaultPriority?: number): ...; } |
| `handleByMap` | (`type`: [`ExtensionType`](../enums/pixi_extensions.ExtensionType.md), `map`: `Record`<`string`, `any`\>) => { \_addHandlers: Record<ExtensionType, ExtensionHandler\>; \_removeHandlers: Record<ExtensionType, ExtensionHandler\>; ... 5 more ...; handleByList(type: ExtensionType, list: any[], defaultPriority?: number): ...; } |
| `remove` | (...`extensions`: `any`[]) => { \_addHandlers: Record<ExtensionType, ExtensionHandler\>; \_removeHandlers: Record<ExtensionType, ExtensionHandler\>; ... 5 more ...; handleByList(type: ExtensionType, list: any[], defaultPriority?: number): ...; } |

#### Defined in

[pixijs/packages/extensions/src/index.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extensions/src/index.ts#L120)
