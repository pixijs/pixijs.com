---
id: "pixi_core.UniformGroup"
title: "Class: UniformGroup<LAYOUT>"
sidebar_label: "UniformGroup"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).UniformGroup

Uniform group holds uniform map and some ID's for work

`UniformGroup` has two modes:

1: Normal mode
Normal mode will upload the uniforms with individual function calls as required

2: Uniform buffer mode
This mode will treat the uniforms as a uniform buffer. You can pass in either a buffer that you manually handle, or
or a generic object that PixiJS will automatically map to a buffer for you.
For maximum benefits, make Ubo UniformGroups static, and only update them each frame.

Rules of UBOs:
- UBOs only work with WebGL2, so make sure you have a fallback!
- Only floats are supported (including vec[2,3,4], mat[2,3,4])
- Samplers cannot be used in ubo's (a GPU limitation)
- You must ensure that the object you pass in exactly matches in the shader ubo structure.
Otherwise, weirdness will ensue!
- The name of the ubo object added to the group must match exactly the name of the ubo in the shader.

```glsl
// UBO in shader:
uniform myCoolData { // Declaring a UBO...
    mat4 uCoolMatrix;
    float uFloatyMcFloatFace;
};
```

```js
// A new Uniform Buffer Object...
const myCoolData = new UniformBufferGroup({
    uCoolMatrix: new Matrix(),
    uFloatyMcFloatFace: 23,
}}

// Build a shader...
const shader = Shader.from(srcVert, srcFrag, {
    myCoolData // Name matches the UBO name in the shader. Will be processed accordingly.
})

 ```

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `LAYOUT` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> |

## Constructors

### constructor

• **new UniformGroup**<`LAYOUT`\>(`uniforms?`, `isStatic?`, `isUbo?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `LAYOUT` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uniforms?` | [`Buffer`](pixi_core.Buffer.md) \| `LAYOUT` | Custom uniforms to use to augment the built-in ones. Or a pixi buffer. |
| `isStatic?` | `boolean` | Uniforms wont be changed after creation. |
| `isUbo?` | `boolean` | If true, will treat this uniform group as a uniform buffer object. |

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L93)

## Properties

### autoManage

• **autoManage**: `boolean`

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L86)

___

### buffer

• `Optional` **buffer**: [`Buffer`](pixi_core.Buffer.md)

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L85)

___

### group

• `Readonly` **group**: `boolean`

Its a group and not a single uniforms.

**`Default`**

true

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L65)

___

### static

• **static**: `boolean`

Flag for if uniforms wont be changed after creation.

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L81)

___

### syncUniforms

• **syncUniforms**: [`Dict`](../namespaces/pixi_core.utils.md#dict)<`UniformsSyncCallback`\>

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L72)

___

### ubo

• **ubo**: `boolean`

Flags whether this group is treated like a uniform buffer object.

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L84)

___

### uniforms

• `Readonly` **uniforms**: `LAYOUT`

Uniform values

**`Member`**

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L59)

## Methods

### add

▸ **add**(`name`, `uniforms`, `_static?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `uniforms` | [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> |
| `_static?` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L134)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L124)

___

### from

▸ `Static` **from**(`uniforms`, `_static?`, `_ubo?`): [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uniforms` | [`Buffer`](pixi_core.Buffer.md) \| [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> |
| `_static?` | `boolean` |
| `_ubo?` | `boolean` |

#### Returns

[`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L147)

___

### uboFrom

▸ `Static` **uboFrom**(`uniforms`, `_static?`): [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

A short hand function for creating a static UBO UniformGroup.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uniforms` | [`Buffer`](pixi_core.Buffer.md) \| [`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\> | the ubo item |
| `_static?` | `boolean` | should this be updated each time it is used? defaults to true here! |

#### Returns

[`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

#### Defined in

[pixijs/packages/core/src/shader/UniformGroup.ts:157](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/shader/UniformGroup.ts#L157)
