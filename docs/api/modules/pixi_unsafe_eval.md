---
id: "pixi_unsafe_eval"
title: "Module: @pixi/unsafe-eval"
sidebar_label: "@pixi/unsafe-eval"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### install

▸ **install**(`_core`): `void`

Apply the no `new Function` patch to ShaderSystem in `@pixi/core`.
`@pixi/unsafe-eval` is self-installed since 7.1.0, so this function no longer needs to be called manually.

**`Deprecated`**

since 7.1.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `_core` | `PIXICore` |

#### Returns

`void`

#### Defined in

[pixijs/packages/unsafe-eval/src/install.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/unsafe-eval/src/install.ts#L17)
