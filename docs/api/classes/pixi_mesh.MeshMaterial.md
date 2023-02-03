---
id: "pixi_mesh.MeshMaterial"
title: "Class: MeshMaterial"
sidebar_label: "MeshMaterial"
custom_edit_url: null
---

[@pixi/mesh](../modules/pixi_mesh.md).MeshMaterial

Slightly opinionated default shader for PixiJS 2D objects.

**`Memberof`**

PIXI

## Hierarchy

- `MeshMaterial`

- `Shader`

  ↳ **`MeshMaterial`**

## Constructors

### constructor

• **new MeshMaterial**(`uSampler`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uSampler` | `Texture`<`Resource`\> | Texture that material uses to render. |
| `options?` | [`IMeshMaterialOptions`](../interfaces/pixi_mesh.IMeshMaterialOptions.md) | Additional options |

#### Inherited from

GlobalMixins.MeshMaterial.constructor

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L64)

## Properties

### \_tintRGB

• **\_tintRGB**: `number`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L44)

___

### batchable

• **batchable**: `boolean`

`true` if shader can be batch with the renderer's batch system.

**`Default`**

true

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L35)

___

### disposeRunner

• **disposeRunner**: `Runner`

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L23)

___

### pluginName

• **pluginName**: `string`

Renderer plugin for batching.

**`Default`**

'batch'

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L41)

___

### program

• **program**: `Program`

Program that the shader uses.

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L14)

___

### uniformGroup

• **uniformGroup**: `UniformGroup`<`Dict`<`any`\>\>

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L15)

___

### uvMatrix

• `Readonly` **uvMatrix**: `TextureMatrix`

TextureMatrix instance for this Mesh, used to track Texture changes.

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L29)

## Accessors

### alpha

• `get` **alpha**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L127)

• `set` **alpha**(`value`): `void`

This gets automatically set by the object using this.

**`Default`**

1

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L120)

___

### texture

• `get` **texture**(): `Texture`<`Resource`\>

Reference to the texture being rendered.

#### Returns

`Texture`<`Resource`\>

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L98)

• `set` **texture**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Texture`<`Resource`\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:102](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L102)

___

### tint

• `get` **tint**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L144)

• `set` **tint**(`value`): `void`

Multiply tint for the material.

**`Default`**

0xFFFFFF

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L136)

___

### uniforms

• `get` **uniforms**(): `Dict`<`any`\>

Shader uniform values, shortcut for `uniformGroup.uniforms`.

#### Returns

`Dict`<`any`\>

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L92)

## Methods

### \_renderCanvas

▸ **_renderCanvas**(`renderer`, `mesh`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |
| `mesh` | [`Mesh`](pixi_mesh.Mesh.md)<[`MeshMaterial`](pixi_mesh.MeshMaterial.md)\> |

#### Returns

`void`

#### Inherited from

GlobalMixins.MeshMaterial.\_renderCanvas

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L15)

___

### checkUniformExists

▸ **checkUniformExists**(`name`, `group`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `group` | `UniformGroup`<`Dict`<`any`\>\> |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L55)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L78)

___

### update

▸ **update**(): `void`

Gets called automatically by the Mesh. Intended to be overridden for custom [MeshMaterial](pixi_mesh.MeshMaterial.md) objects.

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/MeshMaterial.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/MeshMaterial.ts#L150)

___

### from

▸ `Static` **from**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`): `Shader`

A short hand function to create a shader based of a vertex and fragment shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | `Dict`<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Returns

`Shader`

A shiny new PixiJS shader!

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L104)
