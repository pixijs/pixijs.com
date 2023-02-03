---
id: "pixi_mesh.MeshBatchUvs"
title: "Class: MeshBatchUvs"
sidebar_label: "MeshBatchUvs"
custom_edit_url: null
---

[@pixi/mesh](../modules/pixi_mesh.md).MeshBatchUvs

Class controls cache for UV mapping from Texture normal space to BaseTexture normal space.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new MeshBatchUvs**(`uvBuffer`, `uvMatrix`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uvBuffer` | `Buffer` | Buffer with normalized uv's |
| `uvMatrix` | `TextureMatrix` | Material UV matrix |

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L28)

## Properties

### \_updateID

• **\_updateID**: `number`

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L22)

___

### data

• `Readonly` **data**: `Float32Array`

UV Buffer data.

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L10)

___

### uvBuffer

• **uvBuffer**: `Buffer`

Buffer with normalized UV's.

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L13)

___

### uvMatrix

• **uvMatrix**: `TextureMatrix`

Material UV matrix.

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L16)

## Methods

### update

▸ **update**(`forceUpdate?`): `void`

Updates

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `forceUpdate?` | `boolean` | force the update |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/MeshBatchUvs.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshBatchUvs.ts#L43)
