---
id: "pixi_events.FederatedEvent"
title: "Class: FederatedEvent<N>"
sidebar_label: "FederatedEvent"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).FederatedEvent

An DOM-compatible synthetic event implementation that is "forwarded" on behalf of an original
FederatedEvent or native [Event](https://dom.spec.whatwg.org/#event).

**`Memberof`**

PIXI

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `N` | extends `UIEvent` = `UIEvent` | The type of native event held. |

## Hierarchy

- **`FederatedEvent`**

  ↳ [`FederatedMouseEvent`](pixi_events.FederatedMouseEvent.md)

## Implements

- `UIEvent`

## Constructors

### constructor

• **new FederatedEvent**<`N`\>(`manager`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `N` | extends `UIEvent` = `UIEvent` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manager` | [`EventBoundary`](pixi_events.EventBoundary.md) | The event boundary which manages this event. Propagation can only occur within the boundary's jurisdiction. |

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L115)

## Properties

### AT\_TARGET

• **AT\_TARGET**: `number` = `1`

#### Implementation of

UIEvent.AT\_TARGET

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:199](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L199)

___

### BUBBLING\_PHASE

• **BUBBLING\_PHASE**: `number` = `2`

#### Implementation of

UIEvent.BUBBLING\_PHASE

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L200)

___

### CAPTURING\_PHASE

• **CAPTURING\_PHASE**: `number` = `3`

#### Implementation of

UIEvent.CAPTURING\_PHASE

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:201](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L201)

___

### NONE

• **NONE**: `number` = `0`

#### Implementation of

UIEvent.NONE

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L202)

___

### bubbles

• **bubbles**: `boolean` = `true`

Flags whether this event bubbles. This will take effect only if it is set before propagation.

#### Implementation of

UIEvent.bubbles

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L15)

___

### cancelBubble

• **cancelBubble**: `boolean` = `true`

**`Deprecated`**

since 7.0.0

#### Implementation of

UIEvent.cancelBubble

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L18)

___

### cancelable

• `Readonly` **cancelable**: ``false``

Flags whether this event can be canceled using [preventDefault](pixi_events.FederatedEvent.md#preventdefault). This is always
false (for now).

#### Implementation of

UIEvent.cancelable

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L24)

___

### composed

• `Readonly` **composed**: ``false``

Flag added for compatibility with DOM {@code Event}. It is not used in the Federated Events
API.

**`See`**

https://dom.spec.whatwg.org/#dom-event-composed

#### Implementation of

UIEvent.composed

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L31)

___

### currentTarget

• **currentTarget**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The listeners of the event target that are being notified.

#### Implementation of

UIEvent.currentTarget

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L34)

___

### defaultPrevented

• **defaultPrevented**: `boolean` = `false`

Flags whether the default response of the user agent was prevent through this event.

#### Implementation of

UIEvent.defaultPrevented

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L37)

___

### detail

• **detail**: `number`

Event-specific detail

#### Implementation of

UIEvent.detail

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L82)

___

### eventPhase

• **eventPhase**: `number` = `FederatedEvent.prototype.NONE`

The propagation phase.

**`Default`**

[NONE](pixi_events.FederatedEvent.md#none)

#### Implementation of

UIEvent.eventPhase

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:43](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L43)

___

### isTrusted

• **isTrusted**: `boolean`

Flags whether this is a user-trusted event

#### Implementation of

UIEvent.isTrusted

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L46)

___

### layer

• **layer**: `Point`

The coordinates of the evnet relative to the nearest DOM layer. This is a non-standard property.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L94)

___

### manager

• `Readonly` **manager**: [`EventBoundary`](pixi_events.EventBoundary.md)

The [EventBoundary](pixi_events.EventBoundary.md) that manages this event. Null for root events.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:79](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L79)

___

### nativeEvent

• **nativeEvent**: `N`

The native event that caused the foremost original event.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L64)

___

### originalEvent

• **originalEvent**: [`FederatedEvent`](pixi_events.FederatedEvent.md)<`N`\>

The original event that caused this event, if any.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:67](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L67)

___

### page

• **page**: `Point`

The coordinates of the event relative to the DOM document. This is a non-standard property.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L103)

___

### path

• **path**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The composed path of the event's propagation. The {@code target} is at the end.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L76)

___

### propagationImmediatelyStopped

• **propagationImmediatelyStopped**: `boolean` = `false`

Flags whether propagation was immediately stopped.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:73](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L73)

___

### propagationStopped

• **propagationStopped**: `boolean` = `false`

Flags whether propagation was stopped.

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:70](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L70)

___

### returnValue

• **returnValue**: `boolean`

**`Deprecated`**

since 7.0.0

#### Implementation of

UIEvent.returnValue

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L49)

___

### srcElement

• **srcElement**: `EventTarget`

**`Deprecated`**

since 7.0.0

#### Implementation of

UIEvent.srcElement

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:52](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L52)

___

### target

• **target**: [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)

The event target that this will be dispatched to.

#### Implementation of

UIEvent.target

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L55)

___

### timeStamp

• **timeStamp**: `number`

The timestamp of when the event was created.

#### Implementation of

UIEvent.timeStamp

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L58)

___

### type

• **type**: `string`

The type of event, e.g. {@code "mouseup"}.

#### Implementation of

UIEvent.type

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L61)

___

### view

• **view**: `Window`

The global Window object.

#### Implementation of

UIEvent.view

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L85)

___

### which

• **which**: `number`

Not supported.

**`Deprecated`**

since 7.0.0

#### Implementation of

UIEvent.which

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L91)

## Accessors

### data

• `get` **data**(): `this`

Fallback for the deprecated PIXI.InteractionEvent.data.

**`Deprecated`**

since 7.0.0

#### Returns

`this`

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:124](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L124)

___

### layerX

• `get` **layerX**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L97)

___

### layerY

• `get` **layerY**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:100](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L100)

___

### pageX

• `get` **pageX**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:106](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L106)

___

### pageY

• `get` **pageY**(): `number`

#### Returns

`number`

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L109)

## Methods

### composedPath

▸ **composedPath**(): [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

The propagation path for this event. Alias for [propagationPath](pixi_events.EventBoundary.md#propagationpath).

#### Returns

[`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

#### Implementation of

UIEvent.composedPath

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L130)

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

UIEvent.initEvent

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:149](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L149)

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

UIEvent.initUIEvent

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:163](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L163)

___

### preventDefault

▸ **preventDefault**(): `void`

Prevent default behavior of PixiJS and the user agent.

#### Returns

`void`

#### Implementation of

UIEvent.preventDefault

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

UIEvent.stopImmediatePropagation

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

UIEvent.stopPropagation

#### Defined in

[pixijs/packages/events/src/FederatedEvent.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEvent.ts#L194)
