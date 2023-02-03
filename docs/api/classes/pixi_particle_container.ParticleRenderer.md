---
id: "pixi_particle_container.ParticleRenderer"
title: "Class: ParticleRenderer"
sidebar_label: "ParticleRenderer"
custom_edit_url: null
---

[@pixi/particle-container](../modules/pixi_particle_container.md).ParticleRenderer

Renderer for Particles that is designer for speed over feature set.

**`Memberof`**

PIXI

## Hierarchy

- `ObjectRenderer`

  ↳ **`ParticleRenderer`**

## Constructors

### constructor

• **new ParticleRenderer**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | The renderer this sprite batch works for. |

#### Overrides

ObjectRenderer.constructor

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L54)

## Properties

### properties

• **properties**: [`IParticleRendererProperty`](../interfaces/pixi_particle_container.IParticleRendererProperty.md)[]

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L49)

___

### shader

• **shader**: `Shader`

The default shader that is used if a sprite doesn't have a more specific one.

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:47](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L47)

___

### state

• `Readonly` **state**: `State`

The WebGL state in which this renderer will work.

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L44)

___

### tempMatrix

• **tempMatrix**: `Matrix`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L48)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys the ParticleRenderer.

#### Returns

`void`

#### Overrides

ObjectRenderer.destroy

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:446](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L446)

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

▸ **render**(`container`): `void`

Renders the particle container object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | [`ParticleContainer`](pixi_particle_container.ParticleContainer.md) | The container to render using this ParticleRenderer. |

#### Returns

`void`

#### Overrides

ObjectRenderer.render

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L117)

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

___

### uploadPosition

▸ **uploadPosition**(`children`, `startIndex`, `amount`, `array`, `stride`, `offset`): `void`

Uploads the position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | `Sprite`[] | the array of sprites to render |
| `startIndex` | `number` | the index to start from in the children array |
| `amount` | `number` | the amount of children that will have their positions uploaded |
| `array` | `number`[] | The vertices to upload. |
| `stride` | `number` | Stride to use for iteration. |
| `offset` | `number` | Offset to start at. |

#### Returns

`void`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:306](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L306)

___

### uploadRotation

▸ **uploadRotation**(`children`, `startIndex`, `amount`, `array`, `stride`, `offset`): `void`

Uploads the rotation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | `Sprite`[] | the array of sprites to render |
| `startIndex` | `number` | the index to start from in the children array |
| `amount` | `number` | the amount of children that will have their rotation uploaded |
| `array` | `number`[] | The vertices to upload. |
| `stride` | `number` | Stride to use for iteration. |
| `offset` | `number` | Offset to start at. |

#### Returns

`void`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:340](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L340)

___

### uploadTint

▸ **uploadTint**(`children`, `startIndex`, `amount`, `array`, `stride`, `offset`): `void`

Uploads the tint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | `Sprite`[] | the array of sprites to render |
| `startIndex` | `number` | the index to start from in the children array |
| `amount` | `number` | the amount of children that will have their rotation uploaded |
| `array` | `number`[] | The vertices to upload. |
| `stride` | `number` | Stride to use for iteration. |
| `offset` | `number` | Offset to start at. |

#### Returns

`void`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:421](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L421)

___

### uploadUvs

▸ **uploadUvs**(`children`, `startIndex`, `amount`, `array`, `stride`, `offset`): `void`

Uploads the UVs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | `Sprite`[] | the array of sprites to render |
| `startIndex` | `number` | the index to start from in the children array |
| `amount` | `number` | the amount of children that will have their rotation uploaded |
| `array` | `number`[] | The vertices to upload. |
| `stride` | `number` | Stride to use for iteration. |
| `offset` | `number` | Offset to start at. |

#### Returns

`void`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:367](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L367)

___

### uploadVertices

▸ **uploadVertices**(`children`, `startIndex`, `amount`, `array`, `stride`, `offset`): `void`

Uploads the vertices.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `children` | `Sprite`[] | the array of sprites to render |
| `startIndex` | `number` | the index to start from in the children array |
| `amount` | `number` | the amount of children that will have their vertices uploaded |
| `array` | `number`[] | The vertices to upload. |
| `stride` | `number` | Stride to use for iteration. |
| `offset` | `number` | Offset to start at. |

#### Returns

`void`

#### Defined in

[pixijs/packages/particle-container/src/ParticleRenderer.ts:243](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/particle-container/src/ParticleRenderer.ts#L243)
