---
id: "pixi_core.IRenderer"
title: "Interface: IRenderer<VIEW>"
sidebar_label: "IRenderer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).IRenderer

Starard Interface for a Pixi renderer.

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `VIEW` | extends [`ICanvas`](pixi_core.ICanvas.md) = [`ICanvas`](pixi_core.ICanvas.md) |

## Hierarchy

- [`SystemManager`](../classes/pixi_core.SystemManager.md)

- `IRenderer`

  ↳ **`IRenderer`**

## Implemented by

- [`Renderer`](../classes/pixi_core.Renderer.md)

## Properties

### events

• `Readonly` **events**: `EventSystem`

#### Inherited from

GlobalMixins.IRenderer.events

#### Defined in

[pixijs/packages/events/global.d.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/global.d.ts#L20)

___

### height

• `Readonly` **height**: `number`

the height of the screen

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L141)

___

### lastObjectRendered

• `Readonly` **lastObjectRendered**: [`IRenderableObject`](pixi_core.IRenderableObject.md)

the last object rendered by the renderer. Useful for other plugins like interaction managers

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:148](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L148)

___

### plugins

• `Readonly` **plugins**: [`IRendererPlugins`](pixi_core.IRendererPlugins.md)

Collection of plugins

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L150)

___

### rendererLogId

• `Readonly` **rendererLogId**: `string`

When logging Pixi to the console, this is the name we will show

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L130)

___

### renderingToScreen

• `Readonly` **renderingToScreen**: `boolean`

Flag if we are rendering to the screen vs renderTexture

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L135)

___

### resolution

• `Readonly` **resolution**: `number`

The resolution / device pixel ratio of the renderer.

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L137)

___

### runners

• `Readonly` **runners**: `Object` = `{}`

a collection of runners defined by the user

#### Index signature

▪ [key: `string`]: [`Runner`](../classes/pixi_core.Runner.md)

#### Inherited from

[SystemManager](../classes/pixi_core.SystemManager.md).[runners](../classes/pixi_core.SystemManager.md#runners)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L22)

___

### screen

• `Readonly` **screen**: [`Rectangle`](../classes/pixi_core.Rectangle.md)

Measurements of the screen. (0, 0, screenWidth, screenHeight).
Its safe to use as filterArea or hitArea for the whole stage.

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:146](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L146)

___

### type

• `Readonly` **type**: [`RENDERER_TYPE`](../enums/pixi_core.RENDERER_TYPE.md)

The type of the renderer.

**`See`**

PIXI.RENDERER_TYPE

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L127)

___

### view

• `Readonly` **view**: `VIEW`

The canvas element that everything is drawn to.

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L133)

___

### width

• `Readonly` **width**: `number`

the width of the screen

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L139)

## Methods

### addRunners

▸ **addRunners**(`...runnerIds`): `void`

Create a bunch of runners based of a collection of ids

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...runnerIds` | `string`[] | the runner ids to add |

#### Returns

`void`

#### Inherited from

[SystemManager](../classes/pixi_core.SystemManager.md).[addRunners](../classes/pixi_core.SystemManager.md#addrunners)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L55)

___

### addSystem

▸ **addSystem**(`ClassRef`, `name`): [`IRenderer`](pixi_core.IRenderer.md)<`VIEW`\>

Add a new system to the renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ClassRef` | `ISystemConstructor`<[`IRenderer`](pixi_core.IRenderer.md)<[`ICanvas`](pixi_core.ICanvas.md)\>\> | Class reference |
| `name` | `string` | Property name for system, if not specified will use a static `name` property on the class itself. This name will be assigned as s property on the Renderer so make sure it doesn't collide with properties on Renderer. |

#### Returns

[`IRenderer`](pixi_core.IRenderer.md)<`VIEW`\>

Return instance of renderer

#### Inherited from

[SystemManager](../classes/pixi_core.SystemManager.md).[addSystem](../classes/pixi_core.SystemManager.md#addsystem)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L72)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L120)

___

### destroy

▸ **destroy**(`removeView?`): `void`

destroy the all runners and systems. Its apps job to

#### Parameters

| Name | Type |
| :------ | :------ |
| `removeView?` | `boolean` |

#### Returns

`void`

#### Overrides

[SystemManager](../classes/pixi_core.SystemManager.md).[destroy](../classes/pixi_core.SystemManager.md#destroy)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L119)

___

### emitWithCustomOptions

▸ **emitWithCustomOptions**(`runner`, `options`): `void`

A function that will run a runner and call the runners function but pass in different options
to each system based on there name.

E.g. If you have two systems added called `systemA` and `systemB` you could call do the following:

```js
system.emitWithCustomOptions(init, {
    systemA: {...optionsForA},
    systemB: {...optionsForB},
});
```

`init` would be called on system A passing `optionsForA` and on system B passing `optionsForB`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `runner` | [`Runner`](../classes/pixi_core.Runner.md) | the runner to target |
| `options` | `Record`<`string`, `unknown`\> | key value options for each system |

#### Returns

`void`

#### Inherited from

[SystemManager](../classes/pixi_core.SystemManager.md).[emitWithCustomOptions](../classes/pixi_core.SystemManager.md#emitwithcustomoptions)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L126)

___

### generateTexture

▸ **generateTexture**(`displayObject`, `options?`): [`RenderTexture`](../classes/pixi_core.RenderTexture.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `displayObject` | [`IRenderableObject`](pixi_core.IRenderableObject.md) |
| `options?` | [`IGenerateTextureOptions`](pixi_core.IGenerateTextureOptions.md) |

#### Returns

[`RenderTexture`](../classes/pixi_core.RenderTexture.md)

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L118)

___

### render

▸ **render**(`displayObject`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `displayObject` | [`IRenderableObject`](pixi_core.IRenderableObject.md) |
| `options?` | [`IRendererRenderOptions`](pixi_core.IRendererRenderOptions.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L117)

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L121)

___

### resize

▸ **resize**(`width`, `height`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/IRenderer.ts:116](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/IRenderer.ts#L116)

___

### setup

▸ **setup**(`config`): `void`

Set up a system with a collection of SystemClasses and runners.
Systems are attached dynamically to this class when added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ISystemConfig`<[`IRenderer`](pixi_core.IRenderer.md)<[`ICanvas`](pixi_core.ICanvas.md)\>\> | the config for the system manager |

#### Returns

`void`

#### Inherited from

[SystemManager](../classes/pixi_core.SystemManager.md).[setup](../classes/pixi_core.SystemManager.md#setup)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L31)
