---
id: "pixi_core.ContextSystem"
title: "Class: ContextSystem"
sidebar_label: "ContextSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ContextSystem

System plugin to the renderer to manage the context.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)<[`ContextOptions`](../interfaces/pixi_core.ContextOptions.md)\>

## Constructors

### constructor

• **new ContextSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L89)

## Properties

### extensions

• `Readonly` **extensions**: `WebGLExtensions`

Extensions available.

**`Property`**

WebGL v1 extension

**`Property`**

WebGL v1 extension

**`Property`**

WebGL v1 extension

**`Property`**

WebGL v1 extension

**`Property`**

WebGL v1 extension

**`Property`**

WebGL v1 and v2 extension

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L84)

___

### powerPreference

• **powerPreference**: `WebGLPowerPreference`

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L60)

___

### preserveDrawingBuffer

• **preserveDrawingBuffer**: `boolean`

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L59)

___

### supports

• `Readonly` **supports**: [`ISupportDict`](../interfaces/pixi_core.ISupportDict.md)

Features supported by current context.

**`Property`**

Support for 32-bit indices buffer.

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L57)

___

### useContextAlpha

• **useContextAlpha**: `boolean` \| ``"notMultiplied"``

Pass-thru setting for the canvas' context `alpha` property. This is typically
not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.

**`Member`**

**`Deprecated`**

since 7.0.0

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L68)

___

### webGLVersion

• `Readonly` **webGLVersion**: `number`

Either 1 or 2 to reflect the WebGL version being used.

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L49)

## Accessors

### isLost

• `get` **isLost**(): `boolean`

`true` if the context is lost

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L109)

## Methods

### createContext

▸ **createContext**(`canvas`, `options`): [`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md)

Helper class to create a WebGL Context

**`See`**

https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | [`ICanvas`](../interfaces/pixi_core.ICanvas.md) | the canvas element that we will get the context from |
| `options` | `WebGLContextAttributes` | An options object that gets passed in to the canvas element containing the context attributes |

#### Returns

[`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md)

the WebGL context

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:197](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L197)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:301](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L301)

___

### init

▸ **init**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ContextOptions`](../interfaces/pixi_core.ContextOptions.md) |

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[init](../interfaces/pixi_core.ISystem.md#init)

#### Defined in

[pixijs/packages/core/src/context/ContextSystem.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/context/ContextSystem.ts#L125)
