---
id: "pixi_core.utils.CanvasRenderTarget"
title: "Class: CanvasRenderTarget"
sidebar_label: "CanvasRenderTarget"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).[utils](../namespaces/pixi_core.utils.md).CanvasRenderTarget

Creates a Canvas element of the given size to be used as a target for rendering to.

**`Memberof`**

PIXI.utils

## Constructors

### constructor

• **new CanvasRenderTarget**(`width`, `height`, `resolution?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | the width for the newly created canvas |
| `height` | `number` | the height for the newly created canvas |
| `resolution?` | `number` | The resolution / device pixel ratio of the canvas |

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L29)

## Properties

### canvas

• **canvas**: [`ICanvas`](../interfaces/pixi_core.ICanvas.md)

The Canvas object that belongs to this CanvasRenderTarget.

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L13)

___

### context

• **context**: [`ICanvasRenderingContext2D`](../interfaces/pixi_core.ICanvasRenderingContext2D.md)

A CanvasRenderingContext2D object representing a two-dimensional rendering context.

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L16)

___

### resolution

• **resolution**: `number`

The resolution / device pixel ratio of the canvas

**`Default`**

1

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L22)

## Accessors

### height

• `get` **height**(): `number`

The height of the canvas buffer in pixels.

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L86)

• `set` **height**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L91)

___

### width

• `get` **width**(): `number`

The width of the canvas buffer in pixels.

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L72)

• `set` **width**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L77)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys this canvas.

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L62)

___

### resize

▸ **resize**(`desiredWidth`, `desiredHeight`): `void`

Resizes the canvas to the specified width and height.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredWidth` | `number` | the desired width of the canvas |
| `desiredHeight` | `number` | the desired height of the canvas |

#### Returns

`void`

#### Defined in

[pixijs/packages/utils/src/media/CanvasRenderTarget.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/utils/src/media/CanvasRenderTarget.ts#L55)
