---
id: "pixi_core.ObjectRenderer"
title: "Class: ObjectRenderer"
sidebar_label: "ObjectRenderer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ObjectRenderer

Base for a common object renderer that can be used as a
system renderer plugin.

**`Memberof`**

PIXI

## Hierarchy

- **`ObjectRenderer`**

  ↳ [`BatchRenderer`](pixi_core.BatchRenderer.md)

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new ObjectRenderer**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this manager works for. |

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L17)

## Methods

### destroy

▸ **destroy**(): `void`

Generic destruction method that frees all resources. This should be called by subclasses.

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L29)

___

### flush

▸ **flush**(): `void`

Stub method that should be used to empty the current batch by rendering objects now.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L23)

___

### render

▸ **render**(`_object`): `void`

Keeps the object to render. It doesn't have to be
rendered immediately.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_object` | `any` | The object to render. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L56)

___

### start

▸ **start**(): `void`

Stub method that initializes any state required before
rendering starts. It is different from the `prerender`
signal, which occurs every frame, in that it is called
whenever an object requests _this_ renderer specifically.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L40)

___

### stop

▸ **stop**(): `void`

Stops the renderer. It should free up any state and become dormant.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L46)
