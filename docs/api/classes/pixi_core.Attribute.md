---
id: "pixi_core.Attribute"
title: "Class: Attribute"
sidebar_label: "Attribute"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Attribute

Holds the information for a single attribute structure required to render geometry.

This does not contain the actual data, but instead has a buffer id that maps to a PIXI.Buffer
This can include anything from positions, uvs, normals, colors etc.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Attribute**(`buffer`, `size?`, `normalized?`, `type?`, `stride?`, `start?`, `instance?`, `divisor?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `buffer` | `number` | `undefined` | the id of the buffer that this attribute will look for |
| `size` | `number` | `0` | the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2. |
| `normalized` | `boolean` | `false` | should the data be normalized. |
| `type?` | [`TYPES`](../enums/pixi_core.TYPES.md) | `TYPES.FLOAT` | what type of number is the attribute. Check PIXI.TYPES to see the ones available |
| `stride?` | `number` | `undefined` | How far apart, in bytes, the start of each value is. (used for interleaving data) |
| `start?` | `number` | `undefined` | How far into the array to start reading values (used for interleaving data) |
| `instance?` | `boolean` | `undefined` | Whether the geometry is instanced. |
| `divisor?` | `number` | `1` | Divisor to use when doing instanced rendering |

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L33)

## Properties

### buffer

• **buffer**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L14)

___

### divisor

• **divisor**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L21)

___

### instance

• **instance**: `boolean`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L20)

___

### normalized

• **normalized**: `boolean`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L16)

___

### size

• **size**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L15)

___

### start

• **start**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L19)

___

### stride

• **stride**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L18)

___

### type

• **type**: [`TYPES`](../enums/pixi_core.TYPES.md)

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L17)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys the Attribute.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L46)

___

### from

▸ `Static` **from**(`buffer`, `size?`, `normalized?`, `type?`, `stride?`): [`Attribute`](pixi_core.Attribute.md)

Helper function that creates an Attribute based on the information provided

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buffer` | `number` | the id of the buffer that this attribute will look for |
| `size?` | `number` | the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2 |
| `normalized?` | `boolean` | should the data be normalized. |
| `type?` | [`TYPES`](../enums/pixi_core.TYPES.md) | what type of number is the attribute. Check PIXI.TYPES to see the ones available |
| `stride?` | `number` | How far apart, in bytes, the start of each value is. (used for interleaving data) |

#### Returns

[`Attribute`](pixi_core.Attribute.md)

- A new PIXI.Attribute based on the information provided

#### Defined in

[pixijs/packages/core/src/geometry/Attribute.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Attribute.ts#L60)
