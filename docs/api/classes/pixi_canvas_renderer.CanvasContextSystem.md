---
id: "pixi_canvas_renderer.CanvasContextSystem"
title: "Class: CanvasContextSystem"
sidebar_label: "CanvasContextSystem"
custom_edit_url: null
---

[@pixi/canvas-renderer](../modules/pixi_canvas_renderer.md).CanvasContextSystem

System that manages the canvas `2d` contexts

**`Memberof`**

PIXI

## Implements

- `ISystem`

## Constructors

### constructor

• **new CanvasContextSystem**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | [`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md) | A reference to the current renderer |

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L67)

## Properties

### \_activeBlendMode

• **\_activeBlendMode**: `BLEND_MODES` = `null`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L59)

___

### \_projTransform

• **\_projTransform**: `Matrix` = `null`

Projection transform, passed in render() stored here

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L61)

___

### activeContext

• **activeContext**: `CrossPlatformCanvasRenderingContext2D`

The currently active canvas 2d context (could change with renderTextures)

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L51)

___

### activeResolution

• **activeResolution**: `number` = `1`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L52)

___

### blendModes

• `Readonly` **blendModes**: `string`[]

Tracks the blend modes useful for this renderer.

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L57)

___

### rootContext

• **rootContext**: `CrossPlatformCanvasRenderingContext2D`

The root canvas 2d context that everything is drawn with.

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L49)

___

### smoothProperty

• **smoothProperty**: [`SmoothingEnabledProperties`](../modules/pixi_canvas_renderer.md#smoothingenabledproperties) = `'imageSmoothingEnabled'`

The canvas property used to set the canvas smoothing property.

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L55)

## Methods

### clear

▸ **clear**(`clearColor?`, `alpha?`): `void`

Clear the canvas of renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clearColor?` | `string` | Clear the canvas with this color, except the canvas is transparent. |
| `alpha?` | `number` | Alpha to apply to the background fill color. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:157](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L157)

___

### destroy

▸ **destroy**(): `void`

#### Returns

`void`

#### Implementation of

ISystem.destroy

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:218](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L218)

___

### init

▸ **init**(): `void`

initiates the system

#### Returns

`void`

#### Implementation of

ISystem.init

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L73)

___

### invalidateBlendMode

▸ **invalidateBlendMode**(): `void`

Checks if blend mode has changed.

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:213](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L213)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L202)

___

### setBlendMode

▸ **setBlendMode**(`blendMode`, `readyForOuterBlend?`): `void`

Sets the blend mode of the renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blendMode` | `BLEND_MODES` | See PIXI.BLEND_MODES for valid values. |
| `readyForOuterBlend?` | `boolean` | Some blendModes are dangerous, they affect outer space of sprite. Pass `true` only if you are ready to use them. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:180](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L180)

___

### setContextTransform

▸ **setContextTransform**(`transform`, `roundPixels?`, `localResolution?`): `void`

Sets matrix of context.
called only from render() methods
takes care about resolution

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | `Matrix` | world matrix of current element |
| `roundPixels?` | `boolean` | whether to round (tx,ty) coords |
| `localResolution?` | `number` | If specified, used instead of `renderer.resolution` for local scaling |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasContextSystem.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasContextSystem.ts#L113)
