---
id: "pixi_core.Shader"
title: "Class: Shader"
sidebar_label: "Shader"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Shader

A helper class for shaders.

**`Memberof`**

PIXI

## Hierarchy

- **`Shader`**

  ↳ [`Filter`](pixi_core.Filter.md)

## Constructors

### constructor

• **new Shader**(`program`, `uniforms?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | [`Program`](pixi_core.Program.md) | The program the shader will use. |
| `uniforms?` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L29)

## Properties

### disposeRunner

• **disposeRunner**: [`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L23)

___

### program

• **program**: [`Program`](pixi_core.Program.md)

Program that the shader uses.

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L14)

___

### uniformGroup

• **uniformGroup**: [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L15)

## Accessors

### uniforms

• `get` **uniforms**(): [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

Shader uniform values, shortcut for `uniformGroup.uniforms`.

#### Returns

[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L92)

## Methods

### checkUniformExists

▸ **checkUniformExists**(`name`, `group`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `group` | [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\> |

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

### from

▸ `Static` **from**(`vertexSrc?`, `fragmentSrc?`, `uniforms?`): [`Shader`](pixi_core.Shader.md)

A short hand function to create a shader based of a vertex and fragment shader.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `uniforms?` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | Custom uniforms to use to augment the built-in ones. |

#### Returns

[`Shader`](pixi_core.Shader.md)

A shiny new PixiJS shader!

#### Defined in

[pixijs/packages/core/src/shader/Shader.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Shader.ts#L104)
