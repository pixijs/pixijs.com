---
id: "pixi_core.ViewSystem"
title: "Class: ViewSystem"
sidebar_label: "ViewSystem"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ViewSystem

The view system manages the main canvas that is attached to the DOM.
This main role is to deal with how the holding the view reference and dealing with how it is resized.

**`Memberof`**

PIXI

## Implements

- [`ISystem`](../interfaces/pixi_core.ISystem.md)<[`ViewOptions`](../interfaces/pixi_core.ViewOptions.md), `boolean`\>

## Constructors

### constructor

• **new ViewSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`IRenderer`](../interfaces/pixi_core.IRenderer.md)<[`ICanvas`](../interfaces/pixi_core.ICanvas.md)\> |

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L73)

## Properties

### autoDensity

• **autoDensity**: `boolean`

Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.

**`Member`**

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L71)

___

### element

• **element**: [`ICanvas`](../interfaces/pixi_core.ICanvas.md)

The canvas element that everything is drawn to.

**`Member`**

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L65)

___

### resolution

• **resolution**: `number`

The resolution / device pixel ratio of the renderer.

**`Member`**

**`Default`**

PIXI.settings.RESOLUTION

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L51)

___

### screen

• **screen**: [`Rectangle`](pixi_core.Rectangle.md)

Measurements of the screen. (0, 0, screenWidth, screenHeight).

Its safe to use as filterArea or hitArea for the whole stage.

**`Member`**

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L59)

## Methods

### destroy

▸ **destroy**(`removeView?`): `void`

Destroys this System and optionally removes the canvas from the dom.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `removeView?` | `boolean` | Whether to remove the canvas from the DOM. |

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[destroy](../interfaces/pixi_core.ISystem.md#destroy)

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L129)

___

### init

▸ **init**(`options`): `void`

initiates the view system

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ViewOptions`](../interfaces/pixi_core.ViewOptions.md) | the options for the view |

#### Returns

`void`

#### Implementation of

[ISystem](../interfaces/pixi_core.ISystem.md).[init](../interfaces/pixi_core.ISystem.md#init)

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L82)

___

### resizeView

▸ **resizeView**(`desiredScreenWidth`, `desiredScreenHeight`): `void`

Resizes the screen and canvas to the specified dimensions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredScreenWidth` | `number` | The new width of the screen. |
| `desiredScreenHeight` | `number` | The new height of the screen. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/view/ViewSystem.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/view/ViewSystem.ts#L98)
