---
id: "pixi_core.GeometrySystem"
title: "Class: GeometrySystem"
sidebar_label: "GeometrySystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).GeometrySystem

System plugin to the renderer to manage geometry.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new GeometrySystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L61)

## Properties

### canUseUInt32ElementIndex

• `Readonly` **canUseUInt32ElementIndex**: `boolean`

`true` if support `gl.UNSIGNED_INT` in `gl.drawElements` or `gl.drawElementsInstanced`.

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L46)

___

### hasInstance

• `Readonly` **hasInstance**: `boolean`

`true` if has `ANGLE_instanced_arrays` extension.

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L40)

___

### hasVao

• `Readonly` **hasVao**: `boolean`

`true` if we has `*_vertex_array_object` extension.

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L34)

___

### managedGeometries

• `Readonly` **managedGeometries**: `Object`

Cache for all geometries by id, used in case renderer gets destroyed or for profiling.

#### Index signature

▪ [key: `number`]: [`Geometry`](pixi_core.Geometry.md)

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L55)

## Methods

### bind

▸ **bind**(`geometry?`, `shader?`): `void`

Binds geometry so that is can be drawn. Creating a Vao if required

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `geometry?` | [`Geometry`](pixi_core.Geometry.md) | Instance of geometry to bind. |
| `shader?` | [`Shader`](pixi_core.Shader.md) | Instance of shader to use vao for. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:148](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L148)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:589](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L589)

___

### disposeAll

▸ **disposeAll**(`contextLost?`): `void`

Dispose all WebGL resources of all managed geometries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contextLost?` | `boolean` | If context was lost, we suppress `gl.delete` calls |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:450](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L450)

___

### disposeGeometry

▸ **disposeGeometry**(`geometry`, `contextLost?`): `void`

Disposes geometry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `geometry` | [`Geometry`](pixi_core.Geometry.md) | Geometry with buffers. Only VAO will be disposed |
| `contextLost?` | `boolean` | If context was lost, we suppress deleteVertexArray |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:383](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L383)

___

### draw

▸ **draw**(`type`, `size?`, `start?`, `instanceCount?`): [`GeometrySystem`](pixi_core.GeometrySystem.md)

Draws the currently bound geometry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | [`DRAW_MODES`](../enums/pixi_core.DRAW_MODES.md) | The type primitive to render. |
| `size?` | `number` | The number of elements to be rendered. If not specified, all vertices after the starting vertex will be drawn. |
| `start?` | `number` | The starting vertex in the geometry to start drawing from. If not specified, drawing will start from the first vertex. |
| `instanceCount?` | `number` | The number of instances of the set of elements to execute. If not specified, all instances will be drawn. |

#### Returns

[`GeometrySystem`](pixi_core.GeometrySystem.md)

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:536](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L536)

___

### reset

▸ **reset**(): `void`

Reset and unbind any active VAO and geometry.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L194)

___

### updateBuffers

▸ **updateBuffers**(): `void`

Update buffers of the currently bound geometry.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/geometry/GeometrySystem.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/geometry/GeometrySystem.ts#L200)
