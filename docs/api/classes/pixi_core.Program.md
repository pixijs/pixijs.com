---
id: "pixi_core.Program"
title: "Class: Program"
sidebar_label: "Program"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Program

Helper class to create a shader program.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Program**(`vertexSrc?`, `fragmentSrc?`, `name?`, `extra?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `vertexSrc?` | `string` | `undefined` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | `undefined` | The source of the fragment shader. |
| `name` | `string` | `'pixi-shader'` | Name for shader |
| `extra` | [`IProgramExtraData`](../interfaces/pixi_core.IProgramExtraData.md) | `{}` | Extra data for shader |

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:90](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L90)

## Properties

### attributeData

• **attributeData**: `Object`

Assigned when a program is first bound to the shader system.

#### Index signature

▪ [key: `string`]: [`IAttributeData`](../interfaces/pixi_core.IAttributeData.md)

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L77)

___

### extra

• **extra**: [`IProgramExtraData`](../interfaces/pixi_core.IProgramExtraData.md) = `{}`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L82)

___

### fragmentSrc

• **fragmentSrc**: `string`

Source code for the fragment shader.

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L70)

___

### glPrograms

• **glPrograms**: `Object`

#### Index signature

▪ [key: `number`]: [`GLProgram`](pixi_core.GLProgram.md)

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L73)

___

### id

• **id**: `number`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L64)

___

### nameCache

• **nameCache**: `any`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L72)

___

### syncUniforms

• **syncUniforms**: `any`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L74)

___

### uniformData

• **uniformData**: `Object`

Assigned when a program is first bound to the shader system.

#### Index signature

▪ [key: `string`]: [`IUniformData`](../interfaces/pixi_core.IUniformData.md)

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:80](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L80)

___

### vertexSrc

• **vertexSrc**: `string`

Source code for the vertex shader.

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L67)

___

### defaultFragmentPrecision

▪ `Static` **defaultFragmentPrecision**: [`PRECISION`](../enums/pixi_core.PRECISION.md)

Default specify float precision in fragment shader.
iOS is best set at highp due to https://github.com/pixijs/pixijs/issues/3742

**`Static`**

**`Default`**

PIXI.PRECISION.MEDIUM

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L60)

___

### defaultVertexPrecision

▪ `Static` **defaultVertexPrecision**: [`PRECISION`](../enums/pixi_core.PRECISION.md) = `PRECISION.HIGH`

Default specify float precision in vertex shader.

**`Static`**

**`Default`**

PIXI.PRECISION.HIGH

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L51)

## Accessors

### defaultFragmentSrc

• `Static` `get` **defaultFragmentSrc**(): `string`

The default fragment shader source.

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L150)

___

### defaultVertexSrc

• `Static` `get` **defaultVertexSrc**(): `string`

The default vertex shader source.

#### Returns

`string`

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L141)

## Methods

### from

▸ `Static` **from**(`vertexSrc?`, `fragmentSrc?`, `name?`): [`Program`](pixi_core.Program.md)

A short hand function to create a program based of a vertex and fragment shader.

This method will also check to see if there is a cached program.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vertexSrc?` | `string` | The source of the vertex shader. |
| `fragmentSrc?` | `string` | The source of the fragment shader. |
| `name?` | `string` | Name for shader |

#### Returns

[`Program`](pixi_core.Program.md)

A shiny new PixiJS shader program!

#### Defined in

[pixijs/packages/core/src/shader/Program.ts:164](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/Program.ts#L164)
