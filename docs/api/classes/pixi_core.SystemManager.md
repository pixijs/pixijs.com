---
id: "pixi_core.SystemManager"
title: "Class: SystemManager<R>"
sidebar_label: "SystemManager"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).SystemManager

The SystemManager is a class that provides functions for managing a set of systems
This is a base class, that is generic (no render code or knowledge at all)

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md) |

## Hierarchy

- `EventEmitter`

  ↳ **`SystemManager`**

  ↳↳ [`IRenderer`](../interfaces/pixi_core.IRenderer.md)

  ↳↳ [`Renderer`](pixi_core.Renderer.md)

## Constructors

### constructor

• **new SystemManager**<`R`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\> |

#### Inherited from

EventEmitter.constructor

## Properties

### runners

• `Readonly` **runners**: `Object` = `{}`

a collection of runners defined by the user

#### Index signature

▪ [key: `string`]: [`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L22)

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

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L55)

___

### addSystem

▸ **addSystem**(`ClassRef`, `name`): [`SystemManager`](pixi_core.SystemManager.md)<`R`\>

Add a new system to the renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ClassRef` | `ISystemConstructor`<`R`\> | Class reference |
| `name` | `string` | Property name for system, if not specified will use a static `name` property on the class itself. This name will be assigned as s property on the Renderer so make sure it doesn't collide with properties on Renderer. |

#### Returns

[`SystemManager`](pixi_core.SystemManager.md)<`R`\>

Return instance of renderer

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L72)

___

### destroy

▸ **destroy**(): `void`

destroy the all runners and systems. Its apps job to

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L141)

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
| `runner` | [`Runner`](pixi_core.Runner.md) | the runner to target |
| `options` | `Record`<`string`, `unknown`\> | key value options for each system |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L126)

___

### setup

▸ **setup**(`config`): `void`

Set up a system with a collection of SystemClasses and runners.
Systems are attached dynamically to this class when added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ISystemConfig`<`R`\> | the config for the system manager |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L31)
