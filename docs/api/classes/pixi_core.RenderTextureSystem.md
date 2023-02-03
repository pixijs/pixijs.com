---
id: "pixi_core.RenderTextureSystem"
title: "Class: RenderTextureSystem"
sidebar_label: "RenderTextureSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).RenderTextureSystem

System plugin to the renderer to manage render textures.

Should be added after FramebufferSystem

### Frames

The `RenderTextureSystem` holds a sourceFrame → destinationFrame projection. The following table explains the different
coordinate spaces used:

| Frame                  | Description                                                      | Coordinate System                                       |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| sourceFrame            | The rectangle inside of which display-objects are being rendered | **World Space**: The origin on the top-left             |
| destinationFrame       | The rectangle in the render-target (canvas or texture) into which contents should be rendered | If rendering to the canvas, this is in screen space and the origin is on the top-left. If rendering to a render-texture, this is in its base-texture's space with the origin on the bottom-left.  |
| viewportFrame          | The framebuffer viewport corresponding to the destination-frame  | **Window Coordinates**: The origin is always on the bottom-left. |

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)

## Constructors

### constructor

• **new RenderTextureSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`Renderer`](pixi_core.Renderer.md) | The renderer this System works for. |

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L85)

## Properties

### current

• `Readonly` **current**: [`RenderTexture`](pixi_core.RenderTexture.md)

Render texture currently bound. {@code null} if rendering to the canvas.

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L57)

___

### defaultMaskStack

• `Readonly` **defaultMaskStack**: [`MaskData`](pixi_core.MaskData.md)[]

List of masks for the PIXI.StencilSystem.

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L51)

___

### destinationFrame

• `Readonly` **destinationFrame**: [`Rectangle`](pixi_core.Rectangle.md)

The destination frame for the render-target's projection mapping.

See PIXI.Projection#destinationFrame for more details.

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L71)

___

### sourceFrame

• `Readonly` **sourceFrame**: [`Rectangle`](pixi_core.Rectangle.md)

The source frame for the render-target's projection mapping.

See PIXI.ProjectionSystem#sourceFrame for more details

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L64)

___

### viewportFrame

• `Readonly` **viewportFrame**: [`Rectangle`](pixi_core.Rectangle.md)

The viewport frame for the render-target's viewport binding. This is equal to the destination-frame
for render-textures, while it is y-flipped when rendering to the screen (i.e. its origin is always on
the bottom-left).

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L78)

## Methods

### bind

▸ **bind**(`renderTexture?`, `sourceFrame?`, `destinationFrame?`): `void`

Bind the current render texture.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `renderTexture` | [`RenderTexture`](pixi_core.RenderTexture.md) | `null` | RenderTexture to bind, by default its `null` - the screen. |
| `sourceFrame?` | [`Rectangle`](pixi_core.Rectangle.md) | `undefined` | Part of world that is mapped to the renderTexture. |
| `destinationFrame?` | [`Rectangle`](pixi_core.Rectangle.md) | `undefined` | Part of renderTexture, by default it has the same size as sourceFrame. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:102](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L102)

___

### clear

▸ **clear**(`clearColor?`, `mask?`): `void`

Erases the render texture and fills the drawing area with a colour.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clearColor?` | `number`[] | The color as rgba, default to use the renderer backgroundColor |
| `mask?` | [`BUFFER_BITS`](../enums/pixi_core.BUFFER_BITS.md) | - |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:195](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L195)

___

### destroy

▸ **destroy**(): `void`

Generic destroy methods to be overridden by the subclass

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:245](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L245)

___

### reset

▸ **reset**(): `void`

Resets render-texture state.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L240)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/renderTexture/RenderTextureSystem.ts:233](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/renderTexture/RenderTextureSystem.ts#L233)
