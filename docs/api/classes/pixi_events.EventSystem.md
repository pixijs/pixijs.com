---
id: "pixi_events.EventSystem"
title: "Class: EventSystem"
sidebar_label: "EventSystem"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).EventSystem

The system for handling UI events.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new EventSystem**(`renderer`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L97)

## Properties

### autoPreventDefault

• **autoPreventDefault**: `boolean`

Should default browser actions automatically be prevented.
Does not apply to pointer events for backwards compatibility
preventDefault on pointer events stops mouse events from firing
Thus, for every pointer event, there will always be either a mouse of touch event alongside it.

**`Default`**

true

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L67)

___

### cursorStyles

• **cursorStyles**: `Record`<`string`, `string` \| `CSSStyleDeclaration` \| (`mode`: `string`) => `void`\>

Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
values, objects are handled as dictionaries of CSS values for {@code domElement},
and functions are called instead of changing the CSS.
Default CSS cursor values are provided for 'default' and 'pointer' modes.

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L75)

___

### domElement

• **domElement**: `HTMLElement` = `null`

The DOM element to which the root event listeners are bound. This is automatically set to
the renderer's PIXI.Renderer#view view.

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L81)

___

### renderer

• **renderer**: `Renderer`

The renderer managing this [EventSystem](pixi_events.EventSystem.md).

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:87](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L87)

___

### resolution

• **resolution**: `number` = `1`

The resolution used to convert between the DOM client space into world space.

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L84)

___

### rootBoundary

• `Readonly` **rootBoundary**: [`EventBoundary`](pixi_events.EventBoundary.md)

The PIXI.EventBoundary for the stage.

The PIXI.EventBoundary#rootTarget rootTarget of this root boundary is automatically set to
the last rendered object before any event processing is initiated. This means the main scene
needs to be rendered atleast once before UI events will start propagating.

The root boundary should only be changed during initialization. Otherwise, any state held by the
event boundary may be lost (like hovered & pressed DisplayObjects).

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L52)

___

### supportsPointerEvents

• `Readonly` **supportsPointerEvents**: `boolean` = `!!globalThis.PointerEvent`

Does the device support pointer events https://www.w3.org/Submission/pointer-events/

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L58)

___

### supportsTouchEvents

• `Readonly` **supportsTouchEvents**: `boolean`

Does the device support touch events https://www.w3.org/TR/touch-events/

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L55)

## Methods

### destroy

▸ **destroy**(): `void`

Destroys all event listeners and detaches the renderer.

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:142](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L142)

___

### mapPositionToPoint

▸ **mapPositionToPoint**(`point`, `x`, `y`): `void`

Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
resulting value is stored in the point. This takes into account the fact that the DOM
element could be scaled and positioned anywhere on the screen.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | `IPointData` | the point that the result will be stored in |
| `x` | `number` | the x coord of the position to map |
| `y` | `number` | the y coord of the position to map |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:479](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L479)

___

### setCursor

▸ **setCursor**(`mode`): `void`

Sets the current cursor mode, handling any callbacks or CSS style changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | `string` | cursor mode, a key from the cursorStyles dictionary |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L152)

___

### setTargetElement

▸ **setTargetElement**(`element`): `void`

Sets the PIXI.EventSystem#domElement domElement and binds event listeners.

To deregister the current DOM element without setting a new one, pass {@code null}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` | The new DOM element. |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventSystem.ts:345](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventSystem.ts#L345)
