---
id: "pixi_events.FederatedMouseEvent"
title: "Class: FederatedMouseEvent"
sidebar_label: "FederatedMouseEvent"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).FederatedMouseEvent

A PIXI.FederatedEvent for mouse events.

**`Memberof`**

PIXI

## Hierarchy

- [`FederatedEvent`](pixi_events.FederatedEvent.md)<`MouseEvent` \| `PointerEvent` \| `TouchEvent`\>

  ↳ **`FederatedMouseEvent`**

  ↳↳ [`FederatedPointerEvent`](pixi_events.FederatedPointerEvent.md)

  ↳↳ [`FederatedWheelEvent`](pixi_events.FederatedWheelEvent.md)

## Implements

- `MouseEvent`

## Constructors

### constructor

• **new FederatedMouseEvent**(`manager`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manager` | [`EventBoundary`](pixi_events.EventBoundary.md) | The event boundary which manages this event. Propagation can only occur within the boundary's jurisdiction. |

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[constructor](pixi_events.FederatedEvent.md#constructor)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L115)

## Properties

### AT\_TARGET

• **AT\_TARGET**: `number` = `1`

#### Implementation of

MouseEvent.AT\_TARGET

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[AT_TARGET](pixi_events.FederatedEvent.md#at_target)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:199](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L199)

___

### BUBBLING\_PHASE

• **BUBBLING\_PHASE**: `number` = `2`

#### Implementation of

MouseEvent.BUBBLING\_PHASE

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[BUBBLING_PHASE](pixi_events.FederatedEvent.md#bubbling_phase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L200)

___

### CAPTURING\_PHASE

• **CAPTURING\_PHASE**: `number` = `3`

#### Implementation of

MouseEvent.CAPTURING\_PHASE

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[CAPTURING_PHASE](pixi_events.FederatedEvent.md#capturing_phase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:201](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L201)

___

### NONE

• **NONE**: `number` = `0`

#### Implementation of

MouseEvent.NONE

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[NONE](pixi_events.FederatedEvent.md#none)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L202)

___

### altKey

• **altKey**: `boolean`

Whether the "alt" key was pressed when this mouse event occurred.

#### Implementation of

MouseEvent.altKey

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L13)

___

### bubbles

• **bubbles**: `boolean` = `true`

Flags whether this event bubbles. This will take effect only if it is set before propagation.

#### Implementation of

MouseEvent.bubbles

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[bubbles](pixi_events.FederatedEvent.md#bubbles)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L15)

___

### button

• **button**: `number`

The specific button that was pressed in this mouse event.

#### Implementation of

MouseEvent.button

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L16)

___

### buttons

• **buttons**: `number`

The button depressed when this event occurred.

#### Implementation of

MouseEvent.buttons

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L19)

___

### cancelBubble

• **cancelBubble**: `boolean` = `true`

**`Deprecated`**

since 7.0.0

#### Implementation of

MouseEvent.cancelBubble

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[cancelBubble](pixi_events.FederatedEvent.md#cancelbubble)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L18)

___

### cancelable

• `Readonly` **cancelable**: ``false``

Flags whether this event can be canceled using [preventDefault](pixi_events.FederatedEvent.md#preventdefault). This is always
false (for now).

#### Implementation of

MouseEvent.cancelable

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[cancelable](pixi_events.FederatedEvent.md#cancelable)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L24)

___

### client

• **client**: `Point`

The coordinates of the mouse event relative to the canvas.

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

MouseEvent.composed

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[composed](pixi_events.FederatedEvent.md#composed)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L31)

___

### ctrlKey

• **ctrlKey**: `boolean`

Whether the "control" key was pressed when this mouse event occurred.

#### Implementation of

MouseEvent.ctrlKey

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L22)

___

### currentTarget

• **currentTarget**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The listeners of the event target that are being notified.

#### Implementation of

MouseEvent.currentTarget

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[currentTarget](pixi_events.FederatedEvent.md#currenttarget)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L34)

___

### defaultPrevented

• **defaultPrevented**: `boolean` = `false`

Flags whether the default response of the user agent was prevent through this event.

#### Implementation of

MouseEvent.defaultPrevented

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[defaultPrevented](pixi_events.FederatedEvent.md#defaultprevented)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L37)

___

### detail

• **detail**: `number`

This is the number of clicks that occurs in 200ms/click of each other.

#### Implementation of

MouseEvent.detail

#### Overrides

[FederatedEvent](pixi_events.FederatedEvent.md).[detail](pixi_events.FederatedEvent.md#detail)

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L55)

___

### eventPhase

• **eventPhase**: `number` = `FederatedEvent.prototype.NONE`

The propagation phase.

**`Default`**

[NONE](pixi_events.FederatedEvent.md#none)

#### Implementation of

MouseEvent.eventPhase

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[eventPhase](pixi_events.FederatedEvent.md#eventphase)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L43)

___

### global

• **global**: `Point`

The pointer coordinates in world space.

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L79)

___

### isTrusted

• **isTrusted**: `boolean`

Flags whether this is a user-trusted event

#### Implementation of

MouseEvent.isTrusted

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[isTrusted](pixi_events.FederatedEvent.md#istrusted)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L46)

___

### layer

• **layer**: `Point`

The coordinates of the evnet relative to the nearest DOM layer. This is a non-standard property.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[layer](pixi_events.FederatedEvent.md#layer)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L94)

___

### manager

• `Readonly` **manager**: [`EventBoundary`](pixi_events.EventBoundary.md)

The [EventBoundary](pixi_events.EventBoundary.md) that manages this event. Null for root events.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[manager](pixi_events.FederatedEvent.md#manager)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L79)

___

### metaKey

• **metaKey**: `boolean`

Whether the "meta" key was pressed when this mouse event occurred.

#### Implementation of

MouseEvent.metaKey

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L25)

___

### movement

• **movement**: `Point`

The movement in this pointer relative to the last `mousemove` event.

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L58)

___

### nativeEvent

• **nativeEvent**: `PointerEvent` \| `MouseEvent` \| `TouchEvent`

The native event that caused the foremost original event.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[nativeEvent](pixi_events.FederatedEvent.md#nativeevent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L64)

___

### offset

• **offset**: `Point`

The offset of the pointer coordinates w.r.t. target DisplayObject in world space. This is
not supported at the moment.

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L70)

___

### originalEvent

• **originalEvent**: [`FederatedEvent`](pixi_events.FederatedEvent.md)<`PointerEvent` \| `MouseEvent` \| `TouchEvent`\>

The original event that caused this event, if any.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[originalEvent](pixi_events.FederatedEvent.md#originalevent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L67)

___

### page

• **page**: `Point`

The coordinates of the event relative to the DOM document. This is a non-standard property.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[page](pixi_events.FederatedEvent.md#page)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L103)

___

### path

• **path**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The composed path of the event's propagation. The {@code target} is at the end.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[path](pixi_events.FederatedEvent.md#path)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L76)

___

### propagationImmediatelyStopped

• **propagationImmediatelyStopped**: `boolean` = `false`

Flags whether propagation was immediately stopped.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[propagationImmediatelyStopped](pixi_events.FederatedEvent.md#propagationimmediatelystopped)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L73)

___

### propagationStopped

• **propagationStopped**: `boolean` = `false`

Flags whether propagation was stopped.

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[propagationStopped](pixi_events.FederatedEvent.md#propagationstopped)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L70)

___

### relatedTarget

• **relatedTarget**: `EventTarget`

This is currently not implemented in the Federated Events API.

#### Implementation of

MouseEvent.relatedTarget

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:28](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L28)

___

### returnValue

• **returnValue**: `boolean`

**`Deprecated`**

since 7.0.0

#### Implementation of

MouseEvent.returnValue

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[returnValue](pixi_events.FederatedEvent.md#returnvalue)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L49)

___

### screen

• **screen**: `Point`

The pointer coordinates in the renderer's PIXI.Renderer.screen screen. This has slightly
different semantics than native PointerEvent screenX/screenY.

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L91)

___

### shiftKey

• **shiftKey**: `boolean`

Whether the "shift" key was pressed when this mouse event occurred.

#### Implementation of

MouseEvent.shiftKey

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L31)

___

### srcElement

• **srcElement**: `EventTarget`

**`Deprecated`**

since 7.0.0

#### Implementation of

MouseEvent.srcElement

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[srcElement](pixi_events.FederatedEvent.md#srcelement)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L52)

___

### target

• **target**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The event target that this will be dispatched to.

#### Implementation of

MouseEvent.target

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[target](pixi_events.FederatedEvent.md#target)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L55)

___

### timeStamp

• **timeStamp**: `number`

The timestamp of when the event was created.

#### Implementation of

MouseEvent.timeStamp

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[timeStamp](pixi_events.FederatedEvent.md#timestamp)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L58)

___

### type

• **type**: `string`

The type of event, e.g. {@code "mouseup"}.

#### Implementation of

MouseEvent.type

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[type](pixi_events.FederatedEvent.md#type)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L61)

___

### view

• **view**: `Window`

The global Window object.

#### Implementation of

MouseEvent.view

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[view](pixi_events.FederatedEvent.md#view)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L85)

___

### which

• **which**: `number`

Not supported.

**`Deprecated`**

since 7.0.0

#### Implementation of

MouseEvent.which

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[which](pixi_events.FederatedEvent.md#which)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L91)

## Accessors

### clientX

• `get` **clientX**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.clientX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L37)

___

### clientY

• `get` **clientY**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.clientY

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

FederatedEvent.data

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L124)

___

### globalX

• `get` **globalX**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L82)

___

### globalY

• `get` **globalY**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L85)

___

### layerX

• `get` **layerX**(): `number`

#### Returns

`number`

#### Inherited from

FederatedEvent.layerX

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L97)

___

### layerY

• `get` **layerY**(): `number`

#### Returns

`number`

#### Inherited from

FederatedEvent.layerY

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L100)

___

### movementX

• `get` **movementX**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.movementX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L61)

___

### movementY

• `get` **movementY**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.movementY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L64)

___

### offsetX

• `get` **offsetX**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.offsetX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L73)

___

### offsetY

• `get` **offsetY**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.offsetY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L76)

___

### pageX

• `get` **pageX**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.pageX

#### Inherited from

FederatedEvent.pageX

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L106)

___

### pageY

• `get` **pageY**(): `number`

#### Returns

`number`

#### Implementation of

MouseEvent.pageY

#### Inherited from

FederatedEvent.pageY

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L109)

___

### screenX

• `get` **screenX**(): `number`

The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.

#### Returns

`number`

#### Implementation of

MouseEvent.screenX

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L97)

___

### screenY

• `get` **screenY**(): `number`

The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.

#### Returns

`number`

#### Implementation of

MouseEvent.screenY

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L103)

___

### x

• `get` **x**(): `number`

Alias for [this.clientX](pixi_events.FederatedMouseEvent.md#clientx).

#### Returns

`number`

#### Implementation of

MouseEvent.x

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L46)

___

### y

• `get` **y**(): `number`

Alias for [this.clientY](pixi_events.FederatedMouseEvent.md#clienty).

#### Returns

`number`

#### Implementation of

MouseEvent.y

#### Defined in

[pixijs/packages/events/src/FederatedMouseEvent.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedMouseEvent.ts#L52)

## Methods

### composedPath

▸ **composedPath**(): [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The propagation path for this event. Alias for [propagationPath](pixi_events.EventBoundary.md#propagationpath).

#### Returns

[`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

#### Implementation of

MouseEvent.composedPath

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[composedPath](pixi_events.FederatedEvent.md#composedpath)

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

MouseEvent.getModifierState

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

MouseEvent.initEvent

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[initEvent](pixi_events.FederatedEvent.md#initevent)

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

MouseEvent.initMouseEvent

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

MouseEvent.initUIEvent

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[initUIEvent](pixi_events.FederatedEvent.md#inituievent)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:163](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L163)

___

### preventDefault

▸ **preventDefault**(): `void`

Prevent default behavior of PixiJS and the user agent.

#### Returns

`void`

#### Implementation of

MouseEvent.preventDefault

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[preventDefault](pixi_events.FederatedEvent.md#preventdefault)

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

MouseEvent.stopImmediatePropagation

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[stopImmediatePropagation](pixi_events.FederatedEvent.md#stopimmediatepropagation)

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

MouseEvent.stopPropagation

#### Inherited from

[FederatedEvent](pixi_events.FederatedEvent.md).[stopPropagation](pixi_events.FederatedEvent.md#stoppropagation)

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L194)
