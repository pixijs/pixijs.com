---
id: "pixi_sprite_tiling.TilingSpriteRenderer"
title: "Class: TilingSpriteRenderer"
sidebar_label: "TilingSpriteRenderer"
custom_edit_url: null
---

[@pixi/sprite-tiling](../modules/pixi_sprite_tiling.md).TilingSpriteRenderer

WebGL renderer plugin for tiling sprites

**`Memberof`**

PIXI

## Hierarchy

- `ObjectRenderer`

  ↳ **`TilingSpriteRenderer`**

## Constructors

### constructor

• **new TilingSpriteRenderer**(`renderer`)

constructor for renderer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | The renderer this tiling awesomeness works for. |

#### Overrides

ObjectRenderer.constructor

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L36)

## Properties

### quad

• **quad**: `QuadUv`

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L29)

___

### shader

• **shader**: `Shader`

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L27)

___

### simpleShader

• **simpleShader**: `Shader`

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L28)

___

### state

• `Readonly` **state**: `State`

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L30)

## Methods

### contextChange

▸ **contextChange**(): `void`

Creates shaders when context is initialized.

#### Returns

`void`

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L54)

___

### destroy

▸ **destroy**(): `void`

Generic destruction method that frees all resources. This should be called by subclasses.

#### Returns

`void`

#### Inherited from

ObjectRenderer.destroy

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L29)

___

### flush

▸ **flush**(): `void`

Stub method that should be used to empty the current batch by rendering objects now.

#### Returns

`void`

#### Inherited from

ObjectRenderer.flush

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L23)

___

### render

▸ **render**(`ts`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ts` | [`TilingSprite`](pixi_sprite_tiling.TilingSprite.md) | tilingSprite to be rendered |

#### Returns

`void`

#### Overrides

ObjectRenderer.render

#### Defined in

[pixijs/packages/sprite-tiling/src/TilingSpriteRenderer.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/sprite-tiling/src/TilingSpriteRenderer.ts#L68)

___

### start

▸ **start**(): `void`

Stub method that initializes any state required before
rendering starts. It is different from the `prerender`
signal, which occurs every frame, in that it is called
whenever an object requests _this_ renderer specifically.

#### Returns

`void`

#### Inherited from

ObjectRenderer.start

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L40)

___

### stop

▸ **stop**(): `void`

Stops the renderer. It should free up any state and become dormant.

#### Returns

`void`

#### Inherited from

ObjectRenderer.stop

#### Defined in

[pixijs/packages/core/src/batch/ObjectRenderer.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/ObjectRenderer.ts#L46)
