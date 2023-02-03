---
id: "pixi_core.GLProgram"
title: "Class: GLProgram"
sidebar_label: "GLProgram"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).GLProgram

Helper class to create a WebGL Program

**`Memberof`**

PIXI

## Constructors

### constructor

• **new GLProgram**(`program`, `uniformData`)

Makes a new Pixi program.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | `WebGLProgram` | webgl program |
| `uniformData` | `Object` | uniforms |

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L51)

## Properties

### program

• **program**: `WebGLProgram`

The shader program.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L19)

___

### uniformBufferBindings

• **uniformBufferBindings**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

A hash that stores where UBOs are bound to on the program.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L34)

___

### uniformData

• **uniformData**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

Holds the uniform data which contains uniform locations
and current uniform values used for caching and preventing unneeded GPU commands.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L25)

___

### uniformDirtyGroups

• **uniformDirtyGroups**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

A place where dirty ticks are stored for groups
If a tick here does not match with the Higher level Programs tick, it means
we should re upload the data.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L44)

___

### uniformGroups

• **uniformGroups**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

UniformGroups holds the various upload functions for the shader. Each uniform group
and program have a unique upload function generated.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L31)

___

### uniformSync

• **uniformSync**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>

A hash for lazily-generated uniform uploading functions.

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L37)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys this program.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/GLProgram.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/GLProgram.ts#L61)
