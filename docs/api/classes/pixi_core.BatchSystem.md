---
id: "pixi_core.BatchSystem"
title: "Class: BatchSystem"
sidebar_label: "BatchSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BatchSystem

System plugin to the renderer to manage batching.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new BatchSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L32)

## Properties

### currentRenderer

• **currentRenderer**: [`ObjectRenderer`](pixi_core.ObjectRenderer.md)

The currently active ObjectRenderer.

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L26)

___

### emptyRenderer

• `Readonly` **emptyRenderer**: [`ObjectRenderer`](pixi_core.ObjectRenderer.md)

An empty renderer.

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L23)

## Methods

### boundArray

▸ **boundArray**(`texArray`, `boundTextures`, `batchId`, `maxTextures`): `void`

Assigns batch locations to textures in array based on boundTextures state.
All textures in texArray should have `_batchEnabled = _batchId`,
and their count should be less than `maxTextures`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texArray` | [`BatchTextureArray`](pixi_core.BatchTextureArray.md) | textures to bound |
| `boundTextures` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[] | current state of bound textures |
| `batchId` | `number` | marker for _batchEnabled param of textures in texArray |
| `maxTextures` | `number` | number of texture locations to manipulate |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L100)

___

### copyBoundTextures

▸ **copyBoundTextures**(`arr`, `maxTextures`): `void`

Handy function for batch renderers: copies bound textures in first maxTextures locations to array
sets actual _batchLocation for them

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[] | arr copy destination |
| `maxTextures` | `number` | number of copied elements |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L77)

___

### flush

▸ **flush**(): `void`

This should be called if you wish to do some custom rendering
It will basically render anything that may be batched up such as sprites

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L60)

___

### reset

▸ **reset**(): `void`

Reset the system to an empty renderer

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L66)

___

### setObjectRenderer

▸ **setObjectRenderer**(`objectRenderer`): `void`

Changes the current renderer to the one given in parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectRenderer` | [`ObjectRenderer`](pixi_core.ObjectRenderer.md) | The object renderer to use. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/batch/BatchSystem.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchSystem.ts#L43)
