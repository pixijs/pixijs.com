---
id: "pixi_core.ShaderSystem"
title: "Class: ShaderSystem"
sidebar_label: "ShaderSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ShaderSystem

System plugin to the renderer to manage shaders.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new ShaderSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L50)

## Properties

### destroyed

• **destroyed**: `boolean` = `false`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L42)

___

### id

• **id**: `number`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L41)

___

### program

• **program**: [`Program`](pixi_core.Program.md)

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L40)

___

### shader

• **shader**: [`Shader`](pixi_core.Shader.md)

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L39)

## Methods

### bind

▸ **bind**(`shader`, `dontSync?`): [`GLProgram`](pixi_core.GLProgram.md)

Changes the current shader to the one given in parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shader` | [`Shader`](pixi_core.Shader.md) | the new shader |
| `dontSync?` | `boolean` | false if the shader should automatically sync its uniforms. |

#### Returns

[`GLProgram`](pixi_core.GLProgram.md)

the glProgram that belongs to the shader.

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L94)

___

### createSyncGroups

▸ **createSyncGroups**(`group`): `UniformsSyncCallback`

#### Parameters

| Name | Type |
| :------ | :------ |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> |

#### Returns

`UniformsSyncCallback`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:166](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L166)

___

### destroy

▸ **destroy**(): `void`

Destroys this System and removes all its textures.

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:335](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L335)

___

### disposeShader

▸ **disposeShader**(`shader`): `void`

Disposes shader.
If disposing one equals with current shader, set current as null.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shader` | [`Shader`](pixi_core.Shader.md) | Shader object |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:326](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L326)

___

### generateProgram

▸ **generateProgram**(`shader`): [`GLProgram`](pixi_core.GLProgram.md)

Generates a glProgram version of the Shader provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shader` | [`Shader`](pixi_core.Shader.md) | The shader that the glProgram will be based on. |

#### Returns

[`GLProgram`](pixi_core.GLProgram.md)

A shiny new glProgram!

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:302](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L302)

___

### getGlProgram

▸ **getGlProgram**(): [`GLProgram`](pixi_core.GLProgram.md)

Returns the underlying GLShade rof the currently bound shader.

This can be handy for when you to have a little more control over the setting of your uniforms.

#### Returns

[`GLProgram`](pixi_core.GLProgram.md)

The glProgram for the currently bound Shader for this context

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:287](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L287)

___

### reset

▸ **reset**(): `void`

Resets ShaderSystem state, does not affect WebGL state.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:315](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L315)

___

### setUniforms

▸ **setUniforms**(`uniforms`): `void`

Uploads the uniforms values to the currently bound shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uniforms` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | the uniforms values that be applied to the current shader |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L127)

___

### syncUniformBufferGroup

▸ **syncUniformBufferGroup**(`group`, `name?`): `void`

Syncs uniform buffers

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> | the uniform buffer group to sync |
| `name?` | `string` | the name of the uniform buffer |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:185](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L185)

___

### syncUniformGroup

▸ **syncUniformGroup**(`group`, `syncData?`): `void`

Syncs uniforms on the group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> | the uniform group to sync |
| `syncData?` | `any` | this is data that is passed to the sync function and any nested sync functions |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L141)

___

### syncUniforms

▸ **syncUniforms**(`group`, `glProgram`, `syncData`): `void`

Overrideable by the @pixi/unsafe-eval package to use static syncUniforms instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> |
| `glProgram` | [`GLProgram`](pixi_core.GLProgram.md) |
| `syncData` | `any` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/ShaderSystem.ts:159](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/ShaderSystem.ts#L159)
