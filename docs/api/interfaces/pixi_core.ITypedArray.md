---
id: "pixi_core.ITypedArray"
title: "Interface: ITypedArray"
sidebar_label: "ITypedArray"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ITypedArray

PixiJS classes use this type instead of ArrayBuffer and typed arrays
to support expressions like `geometry.buffers[0].data[0] = position.x`.

Gives access to indexing and `length` field
- @popelyshev: If data is actually ArrayBuffer and throws Exception on indexing - its user problem :)

## Hierarchy

- [`IArrayBuffer`](pixi_core.IArrayBuffer.md)

  ↳ **`ITypedArray`**

## Indexable

▪ [index: `number`]: `number`

## Properties

### BYTES\_PER\_ELEMENT

• `Readonly` **BYTES\_PER\_ELEMENT**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L30)

___

### length

• `Readonly` **length**: `number`

#### Defined in

[pixijs/packages/core/src/geometry/Buffer.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/Buffer.ts#L28)
