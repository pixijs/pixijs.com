---
id: "pixi_events.FederatedEventTarget"
title: "Interface: FederatedEventTarget"
sidebar_label: "FederatedEventTarget"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).FederatedEventTarget

Describes the shape for a [FederatedEvent](../classes/pixi_events.FederatedEvent.md)'s' `eventTarget`.

**`Memberof`**

PIXI

## Hierarchy

- `EventEmitter`

- `EventTarget`

  ↳ **`FederatedEventTarget`**

## Properties

### children

• `Optional` `Readonly` **children**: readonly [`FederatedEventTarget`](pixi_events.FederatedEventTarget.md)[]

The children of this event target.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L68)

___

### cursor

• **cursor**: `string`

The cursor preferred when the mouse pointer is hovering over.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L62)

___

### hitArea

• **hitArea**: [`IHitArea`](pixi_events.IHitArea.md)

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### onclick

• **onclick**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'click' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mousedown' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseenter' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseleave' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseover' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseout' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseover' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseup' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseupoutside' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointercancel' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerdown' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerenter' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerleave' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointermove' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerout' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerover' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointertap' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerup' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerupoutside' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightclick' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightdown' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightup' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightupoutside' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'tap' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchcancel' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchend' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchendoutside' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchmove' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchstart' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedWheelEvent`](../classes/pixi_events.FederatedWheelEvent.md)\>

Handler for 'wheel' event

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

___

### parent

• `Optional` `Readonly` **parent**: [`FederatedEventTarget`](pixi_events.FederatedEventTarget.md)

The parent of this event target.

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L65)

## Methods

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`FederatedEventTarget`](pixi_events.FederatedEventTarget.md)

Remove all listeners, or those of the specified event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`FederatedEventTarget`](pixi_events.FederatedEventTarget.md)

#### Overrides

utils.EventEmitter.removeAllListeners

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L86)
