---
id: "pixi_core.BatchShaderGenerator"
title: "Class: BatchShaderGenerator"
sidebar_label: "BatchShaderGenerator"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).BatchShaderGenerator

Helper that generates batching multi-texture shader. Use it with your new BatchRenderer

**`Memberof`**

PIXI

## Constructors

### constructor

• **new BatchShaderGenerator**(`vertexSrc`, `fragTemplate`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc` | `string` | Vertex shader |
| `fragTemplate` | `string` | Fragment shader template |

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L25)

## Properties

### defaultGroupCache

• **defaultGroupCache**: `Object`

#### Index signature

▪ [key: `number`]: [`UniformGroup`](pixi_core.UniformGroup.md)

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L19)

___

### fragTemplate

• **fragTemplate**: `string`

Reference to the fragment shader template. Must contain "%count%" and "%forloop%".

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L16)

___

### programCache

• **programCache**: `Object`

#### Index signature

▪ [key: `number`]: [`Program`](pixi_core.Program.md)

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L18)

___

### vertexSrc

• **vertexSrc**: `string`

Reference to the vertex shader source.

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L13)

## Methods

### generateSampleSrc

▸ **generateSampleSrc**(`maxTextures`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxTextures` | `number` |

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L74)

___

### generateShader

▸ **generateShader**(`maxTextures`): [`Shader`](pixi_core.Shader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxTextures` | `number` |

#### Returns

[`Shader`](pixi_core.Shader.md)

#### Defined in

[pixijs/packages/core/src/batch/BatchShaderGenerator.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/batch/BatchShaderGenerator.ts#L44)
