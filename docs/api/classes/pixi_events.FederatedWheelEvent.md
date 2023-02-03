---
id: "pixi_events.FederatedWheelEvent"
title: "Class: FederatedWheelEvent"
sidebar_label: "FederatedWheelEvent"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).FederatedWheelEvent

A PIXI.FederatedEvent for wheel events.

**`Memberof`**

PIXI

## Hierarchy

- [`FederatedMouseEvent`](pixi_events.FederatedMouseEvent.md)

  ↳ **`FederatedWheelEvent`**

## Implements

- `WheelEvent`

## Constructors

### constructor

• **new FederatedWheelEvent**(`manager`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manager` | [`EventBoundary`](pixi_events.EventBoundary.md) | The event boundary which manages this event. Propagation can only occur within the boundary's jurisdiction. |

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[constructor](pixi_events.FederatedMouseEvent.md#constructor)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L115)

## Properties

### AT\_TARGET

• **AT\_TARGET**: `number` = `1`

#### Implementation of

WheelEvent.AT\_TARGET

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[AT_TARGET](pixi_events.FederatedMouseEvent.md#at_target)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:199](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L199)

___

### BUBBLING\_PHASE

• **BUBBLING\_PHASE**: `number` = `2`

#### Implementation of

WheelEvent.BUBBLING\_PHASE

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[BUBBLING_PHASE](pixi_events.FederatedMouseEvent.md#bubbling_phase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L200)

___

### CAPTURING\_PHASE

• **CAPTURING\_PHASE**: `number` = `3`

#### Implementation of

WheelEvent.CAPTURING\_PHASE

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[CAPTURING_PHASE](pixi_events.FederatedMouseEvent.md#capturing_phase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:201](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L201)

___

### DOM\_DELTA\_LINE

• **DOM\_DELTA\_LINE**: `number` = `0`

Units specified in lines.

#### Implementation of

WheelEvent.DOM\_DELTA\_LINE

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L25)

___

### DOM\_DELTA\_PAGE

• **DOM\_DELTA\_PAGE**: `number` = `1`

Units specified in pages.

#### Implementation of

WheelEvent.DOM\_DELTA\_PAGE

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L28)

___

### DOM\_DELTA\_PIXEL

• **DOM\_DELTA\_PIXEL**: `number` = `2`

Units specified in pixels.

#### Implementation of

WheelEvent.DOM\_DELTA\_PIXEL

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L31)

___

### NONE

• **NONE**: `number` = `0`

#### Implementation of

WheelEvent.NONE

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[NONE](pixi_events.FederatedMouseEvent.md#none)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L202)

___

### altKey

• **altKey**: `boolean`

Whether the "alt" key was pressed when this mouse event occurred.

#### Implementation of

WheelEvent.altKey

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[altKey](pixi_events.FederatedMouseEvent.md#altkey)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L13)

___

### bubbles

• **bubbles**: `boolean` = `true`

Flags whether this event bubbles. This will take effect only if it is set before propagation.

#### Implementation of

WheelEvent.bubbles

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[bubbles](pixi_events.FederatedMouseEvent.md#bubbles)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L15)

___

### button

• **button**: `number`

The specific button that was pressed in this mouse event.

#### Implementation of

WheelEvent.button

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[button](pixi_events.FederatedMouseEvent.md#button)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L16)

___

### buttons

• **buttons**: `number`

The button depressed when this event occurred.

#### Implementation of

WheelEvent.buttons

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[buttons](pixi_events.FederatedMouseEvent.md#buttons)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L19)

___

### cancelBubble

• **cancelBubble**: `boolean` = `true`

**`Deprecated`**

since 7.0.0

#### Implementation of

WheelEvent.cancelBubble

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[cancelBubble](pixi_events.FederatedMouseEvent.md#cancelbubble)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L18)

___

### cancelable

• `Readonly` **cancelable**: ``false``

Flags whether this event can be canceled using [preventDefault](pixi_events.FederatedEvent.md#preventdefault). This is always
false (for now).

#### Implementation of

WheelEvent.cancelable

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[cancelable](pixi_events.FederatedMouseEvent.md#cancelable)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L24)

___

### client

• **client**: `Point`

The coordinates of the mouse event relative to the canvas.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[client](pixi_events.FederatedMouseEvent.md#client)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L34)

___

### composed

• `Readonly` **composed**: ``false``

Flag added for compatibility with DOM {@code Event}. It is not used in the Federated Events
API.

**`See`**

https://dom.spec.whatwg.org/#dom-event-composed

#### Implementation of

WheelEvent.composed

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[composed](pixi_events.FederatedMouseEvent.md#composed)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L31)

___

### ctrlKey

• **ctrlKey**: `boolean`

Whether the "control" key was pressed when this mouse event occurred.

#### Implementation of

WheelEvent.ctrlKey

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[ctrlKey](pixi_events.FederatedMouseEvent.md#ctrlkey)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L22)

___

### currentTarget

• **currentTarget**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The listeners of the event target that are being notified.

#### Implementation of

WheelEvent.currentTarget

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[currentTarget](pixi_events.FederatedMouseEvent.md#currenttarget)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L34)

___

### defaultPrevented

• **defaultPrevented**: `boolean` = `false`

Flags whether the default response of the user agent was prevent through this event.

#### Implementation of

WheelEvent.defaultPrevented

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[defaultPrevented](pixi_events.FederatedMouseEvent.md#defaultprevented)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L37)

___

### deltaMode

• **deltaMode**: `number`

The units of `deltaX`, `deltaY`, and `deltaZ`. This is one of `DOM_DELTA_LINE`,
`DOM_DELTA_PAGE`, `DOM_DELTA_PIXEL`.

#### Implementation of

WheelEvent.deltaMode

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L13)

___

### deltaX

• **deltaX**: `number`

Horizontal scroll amount

#### Implementation of

WheelEvent.deltaX

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L16)

___

### deltaY

• **deltaY**: `number`

Vertical scroll amount

#### Implementation of

WheelEvent.deltaY

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L19)

___

### deltaZ

• **deltaZ**: `number`

z-axis scroll amount.

#### Implementation of

WheelEvent.deltaZ

#### Defined in

[pixijs/packages/events/src/FederatedWheelEvent.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedWheelEvent.ts#L22)

___

### detail

• **detail**: `number`

This is the number of clicks that occurs in 200ms/click of each other.

#### Implementation of

WheelEvent.detail

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[detail](pixi_events.FederatedMouseEvent.md#detail)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L55)

___

### eventPhase

• **eventPhase**: `number` = `FederatedEvent.prototype.NONE`

The propagation phase.

**`Default`**

[NONE](pixi_events.FederatedEvent.md#none)

#### Implementation of

WheelEvent.eventPhase

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[eventPhase](pixi_events.FederatedMouseEvent.md#eventphase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L43)

___

### global

• **global**: `Point`

The pointer coordinates in world space.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[global](pixi_events.FederatedMouseEvent.md#global)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L79)

___

### isTrusted

• **isTrusted**: `boolean`

Flags whether this is a user-trusted event

#### Implementation of

WheelEvent.isTrusted

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[isTrusted](pixi_events.FederatedMouseEvent.md#istrusted)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L46)

___

### layer

• **layer**: `Point`

The coordinates of the evnet relative to the nearest DOM layer. This is a non-standard property.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[layer](pixi_events.FederatedMouseEvent.md#layer)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L94)

___

### manager

• `Readonly` **manager**: [`EventBoundary`](pixi_events.EventBoundary.md)

The [EventBoundary](pixi_events.EventBoundary.md) that manages this event. Null for root events.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[manager](pixi_events.FederatedMouseEvent.md#manager)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L79)

___

### metaKey

• **metaKey**: `boolean`

Whether the "meta" key was pressed when this mouse event occurred.

#### Implementation of

WheelEvent.metaKey

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[metaKey](pixi_events.FederatedMouseEvent.md#metakey)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L25)

___

### movement

• **movement**: `Point`

The movement in this pointer relative to the last `mousemove` event.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[movement](pixi_events.FederatedMouseEvent.md#movement)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L58)

___

### nativeEvent

• **nativeEvent**: `PointerEvent` \| `MouseEvent` \| `TouchEvent`

The native event that caused the foremost original event.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[nativeEvent](pixi_events.FederatedMouseEvent.md#nativeevent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L64)

___

### offset

• **offset**: `Point`

The offset of the pointer coordinates w.r.t. target DisplayObject in world space. This is
not supported at the moment.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[offset](pixi_events.FederatedMouseEvent.md#offset)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L70)

___

### originalEvent

• **originalEvent**: [`FederatedEvent`](pixi_events.FederatedEvent.md)<`PointerEvent` \| `MouseEvent` \| `TouchEvent`\>

The original event that caused this event, if any.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[originalEvent](pixi_events.FederatedMouseEvent.md#originalevent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L67)

___

### page

• **page**: `Point`

The coordinates of the event relative to the DOM document. This is a non-standard property.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[page](pixi_events.FederatedMouseEvent.md#page)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L103)

___

### path

• **path**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The composed path of the event's propagation. The {@code target} is at the end.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[path](pixi_events.FederatedMouseEvent.md#path)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L76)

___

### propagationImmediatelyStopped

• **propagationImmediatelyStopped**: `boolean` = `false`

Flags whether propagation was immediately stopped.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[propagationImmediatelyStopped](pixi_events.FederatedMouseEvent.md#propagationimmediatelystopped)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L73)

___

### propagationStopped

• **propagationStopped**: `boolean` = `false`

Flags whether propagation was stopped.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[propagationStopped](pixi_events.FederatedMouseEvent.md#propagationstopped)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L70)

___

### relatedTarget

• **relatedTarget**: `EventTarget`

This is currently not implemented in the Federated Events API.

#### Implementation of

WheelEvent.relatedTarget

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[relatedTarget](pixi_events.FederatedMouseEvent.md#relatedtarget)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L28)

___

### returnValue

• **returnValue**: `boolean`

**`Deprecated`**

since 7.0.0

#### Implementation of

WheelEvent.returnValue

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[returnValue](pixi_events.FederatedMouseEvent.md#returnvalue)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L49)

___

### screen

• **screen**: `Point`

The pointer coordinates in the renderer's PIXI.Renderer.screen screen. This has slightly
different semantics than native PointerEvent screenX/screenY.

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[screen](pixi_events.FederatedMouseEvent.md#screen)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L91)

___

### shiftKey

• **shiftKey**: `boolean`

Whether the "shift" key was pressed when this mouse event occurred.

#### Implementation of

WheelEvent.shiftKey

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[shiftKey](pixi_events.FederatedMouseEvent.md#shiftkey)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L31)

___

### srcElement

• **srcElement**: `EventTarget`

**`Deprecated`**

since 7.0.0

#### Implementation of

WheelEvent.srcElement

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[srcElement](pixi_events.FederatedMouseEvent.md#srcelement)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L52)

___

### target

• **target**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The event target that this will be dispatched to.

#### Implementation of

WheelEvent.target

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[target](pixi_events.FederatedMouseEvent.md#target)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L55)

___

### timeStamp

• **timeStamp**: `number`

The timestamp of when the event was created.

#### Implementation of

WheelEvent.timeStamp

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[timeStamp](pixi_events.FederatedMouseEvent.md#timestamp)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L58)

___

### type

• **type**: `string`

The type of event, e.g. {@code "mouseup"}.

#### Implementation of

WheelEvent.type

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[type](pixi_events.FederatedMouseEvent.md#type)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L61)

___

### view

• **view**: `Window`

The global Window object.

#### Implementation of

WheelEvent.view

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[view](pixi_events.FederatedMouseEvent.md#view)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L85)

___

### which

• **which**: `number`

Not supported.

**`Deprecated`**

since 7.0.0

#### Implementation of

WheelEvent.which

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[which](pixi_events.FederatedMouseEvent.md#which)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L91)

## Accessors

### clientX

• `get` **clientX**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.clientX

#### Inherited from

FederatedMouseEvent.clientX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L37)

___

### clientY

• `get` **clientY**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.clientY

#### Inherited from

FederatedMouseEvent.clientY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:40](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L40)

___

### data

• `get` **data**(): `this`

Fallback for the deprecated PIXI.InteractionEvent.data.

**`Deprecated`**

since 7.0.0

#### Returns

`this`

#### Inherited from

FederatedMouseEvent.data

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L124)

___

### globalX

• `get` **globalX**(): `number`

#### Returns

`number`

#### Inherited from

FederatedMouseEvent.globalX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L82)

___

### globalY

• `get` **globalY**(): `number`

#### Returns

`number`

#### Inherited from

FederatedMouseEvent.globalY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L85)

___

### layerX

• `get` **layerX**(): `number`

#### Returns

`number`

#### Inherited from

FederatedMouseEvent.layerX

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L97)

___

### layerY

• `get` **layerY**(): `number`

#### Returns

`number`

#### Inherited from

FederatedMouseEvent.layerY

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L100)

___

### movementX

• `get` **movementX**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.movementX

#### Inherited from

FederatedMouseEvent.movementX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L61)

___

### movementY

• `get` **movementY**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.movementY

#### Inherited from

FederatedMouseEvent.movementY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L64)

___

### offsetX

• `get` **offsetX**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.offsetX

#### Inherited from

FederatedMouseEvent.offsetX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L73)

___

### offsetY

• `get` **offsetY**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.offsetY

#### Inherited from

FederatedMouseEvent.offsetY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L76)

___

### pageX

• `get` **pageX**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.pageX

#### Inherited from

FederatedMouseEvent.pageX

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L106)

___

### pageY

• `get` **pageY**(): `number`

#### Returns

`number`

#### Implementation of

WheelEvent.pageY

#### Inherited from

FederatedMouseEvent.pageY

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L109)

___

### screenX

• `get` **screenX**(): `number`

The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.

#### Returns

`number`

#### Implementation of

WheelEvent.screenX

#### Inherited from

FederatedMouseEvent.screenX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L97)

___

### screenY

• `get` **screenY**(): `number`

The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.

#### Returns

`number`

#### Implementation of

WheelEvent.screenY

#### Inherited from

FederatedMouseEvent.screenY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L103)

___

### x

• `get` **x**(): `number`

Alias for [this.clientX](pixi_events.FederatedMouseEvent.md#clientx).

#### Returns

`number`

#### Implementation of

WheelEvent.x

#### Inherited from

FederatedMouseEvent.x

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L46)

___

### y

• `get` **y**(): `number`

Alias for [this.clientY](pixi_events.FederatedMouseEvent.md#clienty).

#### Returns

`number`

#### Implementation of

WheelEvent.y

#### Inherited from

FederatedMouseEvent.y

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L52)

## Methods

### composedPath

▸ **composedPath**(): [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The propagation path for this event. Alias for [propagationPath](pixi_events.EventBoundary.md#propagationpath).

#### Returns

[`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

#### Implementation of

WheelEvent.composedPath

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[composedPath](pixi_events.FederatedMouseEvent.md#composedpath)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L130)

___

### getModifierState

▸ **getModifierState**(`key`): `boolean`

Whether the modifier key was pressed when this event natively occurred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The modifier key. |

#### Returns

`boolean`

#### Implementation of

WheelEvent.getModifierState

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[getModifierState](pixi_events.FederatedMouseEvent.md#getmodifierstate)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L109)

___

### initEvent

▸ **initEvent**(`_type`, `_bubbles?`, `_cancelable?`): `void`

Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `_type` | `string` |
| `_bubbles?` | `boolean` |
| `_cancelable?` | `boolean` |

#### Returns

`void`

#### Implementation of

WheelEvent.initEvent

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[initEvent](pixi_events.FederatedMouseEvent.md#initevent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L149)

___

### initMouseEvent

▸ **initMouseEvent**(`_typeArg`, `_canBubbleArg`, `_cancelableArg`, `_viewArg`, `_detailArg`, `_screenXArg`, `_screenYArg`, `_clientXArg`, `_clientYArg`, `_ctrlKeyArg`, `_altKeyArg`, `_shiftKeyArg`, `_metaKeyArg`, `_buttonArg`, `_relatedTargetArg`): `void`

Not supported.

**`Deprecated`**

since 7.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `_typeArg` | `string` |
| `_canBubbleArg` | `boolean` |
| `_cancelableArg` | `boolean` |
| `_viewArg` | `Window` |
| `_detailArg` | `number` |
| `_screenXArg` | `number` |
| `_screenYArg` | `number` |
| `_clientXArg` | `number` |
| `_clientYArg` | `number` |
| `_ctrlKeyArg` | `boolean` |
| `_altKeyArg` | `boolean` |
| `_shiftKeyArg` | `boolean` |
| `_metaKeyArg` | `boolean` |
| `_buttonArg` | `number` |
| `_relatedTargetArg` | `EventTarget` |

#### Returns

`void`

#### Implementation of

WheelEvent.initMouseEvent

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[initMouseEvent](pixi_events.FederatedMouseEvent.md#initmouseevent)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L134)

___

### initUIEvent

▸ **initUIEvent**(`_typeArg`, `_bubblesArg?`, `_cancelableArg?`, `_viewArg?`, `_detailArg?`): `void`

Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `_typeArg` | `string` |
| `_bubblesArg?` | `boolean` |
| `_cancelableArg?` | `boolean` |
| `_viewArg?` | `Window` |
| `_detailArg?` | `number` |

#### Returns

`void`

#### Implementation of

WheelEvent.initUIEvent

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[initUIEvent](pixi_events.FederatedMouseEvent.md#inituievent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:163](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L163)

___

### preventDefault

▸ **preventDefault**(): `void`

Prevent default behavior of PixiJS and the user agent.

#### Returns

`void`

#### Implementation of

WheelEvent.preventDefault

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[preventDefault](pixi_events.FederatedMouseEvent.md#preventdefault)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:170](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L170)

___

### stopImmediatePropagation

▸ **stopImmediatePropagation**(): `void`

Stop this event from propagating to any addition listeners, including on the
FederatedEventTarget.currentTarget currentTarget and also the following
event targets on the propagation path.

#### Returns

`void`

#### Implementation of

WheelEvent.stopImmediatePropagation

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[stopImmediatePropagation](pixi_events.FederatedMouseEvent.md#stopimmediatepropagation)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:185](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L185)

___

### stopPropagation

▸ **stopPropagation**(): `void`

Stop this event from propagating to the next [FederatedEventTarget](../interfaces/pixi_events.FederatedEventTarget.md). The rest of the listeners
on the FederatedEventTarget.currentTarget currentTarget will still be notified.

#### Returns

`void`

#### Implementation of

WheelEvent.stopPropagation

#### Inherited from

[FederatedMouseEvent](pixi_events.FederatedMouseEvent.md).[stopPropagation](pixi_events.FederatedMouseEvent.md#stoppropagation)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L194)
