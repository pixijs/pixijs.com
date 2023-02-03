---
id: "pixi_core.TextureSystem"
title: "Class: TextureSystem"
sidebar_label: "TextureSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).TextureSystem

System plugin to the renderer to manage textures.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new TextureSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this system works for. |

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L68)

## Properties

### boundTextures

• `Readonly` **boundTextures**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[]

Bound textures.

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L30)

___

### currentLocation

• `Readonly` **currentLocation**: `number`

Current location.

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L61)

___

### emptyTextures

• **emptyTextures**: `Object`

#### Index signature

▪ [key: `number`]: [`GLTexture`](pixi_core.GLTexture.md)

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L62)

___

### managedTextures

• `Readonly` **managedTextures**: [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\>[]

List of managed textures.

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L36)

## Methods

### bind

▸ **bind**(`texture`, `location?`): `void`

Bind a texture to a specific location

If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `texture` | [`Texture`](pixi_core.Texture.md)<[`Resource`](pixi_core.Resource.md)\> \| [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | `undefined` | Texture to bind |
| `location?` | `number` | `0` | Location to bind at |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L137)

___

### contextChange

▸ **contextChange**(): `void`

Sets up the renderer context and necessary buffers.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L84)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:485](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L485)

___

### ensureSamplerType

▸ **ensureSamplerType**(`maxTextures`): `void`

Ensures that current boundTextures all have FLOAT sampler type,
see PIXI.SAMPLER_TYPES for explanation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maxTextures` | `number` | number of locations to check |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:247](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L247)

___

### initTextureType

▸ **initTextureType**(`texture`, `glTexture`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `texture` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> |
| `glTexture` | [`GLTexture`](pixi_core.GLTexture.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:292](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L292)

___

### reset

▸ **reset**(): `void`

Resets texture location and bound textures Actual `bind(null, i)` calls will be performed at next `unbind()` call

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:192](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L192)

___

### unbind

▸ **unbind**(`texture?`): `void`

Unbind a texture.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `texture?` | [`BaseTexture`](pixi_core.BaseTexture.md)<[`Resource`](pixi_core.Resource.md), [`IAutoDetectOptions`](../modules/pixi_core.md#iautodetectoptions)\> | Texture to bind |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/textures/TextureSystem.ts:208](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/textures/TextureSystem.ts#L208)
