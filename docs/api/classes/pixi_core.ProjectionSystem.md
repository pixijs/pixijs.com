---
id: "pixi_core.ProjectionSystem"
title: "Class: ProjectionSystem"
sidebar_label: "ProjectionSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ProjectionSystem

System plugin to the renderer to manage the projection matrix.

The `projectionMatrix` is a global uniform provided to all shaders. It is used to transform points in world space to
normalized device coordinates.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new ProjectionSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L83)

## Properties

### defaultFrame

• `Readonly` **defaultFrame**: [`Rectangle`](pixi_core.Rectangle.md)

Default destination frame

This is not used internally. It is not advised to use this feature specifically unless you know what
you're doing. The `update` method will default to this frame if you do not pass the destination frame.

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L57)

___

### destinationFrame

• `Readonly` **destinationFrame**: [`Rectangle`](pixi_core.Rectangle.md)

The destination frame used to calculate the current projection matrix.

The destination frame is the rectangle in the render-target into which contents are rendered. If rendering
to the screen, the origin is on the top-left. If rendering to a framebuffer, the origin is on the
bottom-left. This "flipping" phenomenon is because of WebGL convention for (shader) texture coordinates, where
the bottom-left corner is (0,0). It allows display-objects to map their (0,0) position in local-space (top-left)
to (0,0) in texture space (bottom-left). In other words, a sprite's top-left corner actually renders the
texture's bottom-left corner. You will also notice this when using a tool like SpectorJS to view your textures
at runtime.

The destination frame's dimensions (width,height) should be equal to the source frame. This is because,
otherwise, the contents will be scaled to fill the destination frame. Similarly, the destination frame's (x,y)
coordinates are (0,0) unless you know what you're doing.

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L40)

___

### projectionMatrix

• `Readonly` **projectionMatrix**: [`Matrix`](pixi_core.Matrix.md)

Projection matrix

This matrix can be used to transform points from world space to normalized device coordinates, and is calculated
from the sourceFrame → destinationFrame mapping provided.

The renderer's `globalUniforms` keeps a reference to this, and so it is available for all shaders to use as a
uniform.

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:69](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L69)

___

### sourceFrame

• `Readonly` **sourceFrame**: [`Rectangle`](pixi_core.Rectangle.md)

The source frame used to calculate the current projection matrix.

The source frame is the rectangle in world space containing the contents to be rendered.

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L48)

___

### transform

• **transform**: [`Matrix`](pixi_core.Matrix.md)

A transform to be appended to the projection matrix.

This can be used to transform points in world-space one last time before they are outputted by the shader. You can
use to rotate the whole scene, for example. Remember to clear it once you've rendered everything.

**`Member`**

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L78)

## Methods

### calculateProjection

▸ **calculateProjection**(`_destinationFrame`, `sourceFrame`, `_resolution`, `root`): `void`

Calculates the `projectionMatrix` to map points inside `sourceFrame` to inside `destinationFrame`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_destinationFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The destination frame in the render-target. |
| `sourceFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The source frame in world space. |
| `_resolution` | `number` | The render-target's resolution, i.e. ratio of CSS to physical pixels. |
| `root` | `boolean` | Whether rendering into the screen. Otherwise, if rendering to a framebuffer, the projection is y-flipped. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L144)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:167](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L167)

___

### setTransform

▸ **setTransform**(`_matrix`): `void`

Sets the transform of the active render target to the given matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_matrix` | [`Matrix`](pixi_core.Matrix.md) | The transformation matrix |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:162](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L162)

___

### update

▸ **update**(`destinationFrame`, `sourceFrame`, `resolution`, `root`): `void`

Updates the projection-matrix based on the sourceFrame → destinationFrame mapping provided.

NOTE: It is expected you call `renderer.framebuffer.setViewport(destinationFrame)` after this. This is because
the framebuffer viewport converts shader vertex output in normalized device coordinates to window coordinates.

NOTE-2: [bind](pixi_core.RenderTextureSystem.md#bind) updates the projection-matrix when you bind a render-texture. It is expected
that you dirty the current bindings when calling this manually.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destinationFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle in the render-target to render the contents into. If rendering to the canvas, the origin is on the top-left; if rendering to a render-texture, the origin is on the bottom-left. |
| `sourceFrame` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle in world space that contains the contents being rendered. |
| `resolution` | `number` | The resolution of the render-target, which is the ratio of world-space (or CSS) pixels to physical pixels. |
| `root` | `boolean` | Whether the render-target is the screen. This is required because rendering to textures is y-flipped (i.e. upside down relative to the screen). |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/projection/ProjectionSystem.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/projection/ProjectionSystem.ts#L110)
