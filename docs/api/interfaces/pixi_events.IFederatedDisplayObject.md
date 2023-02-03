---
id: "pixi_events.IFederatedDisplayObject"
title: "Interface: IFederatedDisplayObject"
sidebar_label: "IFederatedDisplayObject"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).IFederatedDisplayObject

## Hierarchy

- `Omit`<[`FederatedEventTarget`](pixi_events.FederatedEventTarget.md), ``"parent"`` \| ``"children"`` \| keyof `utils.EventEmitter` \| ``"cursor"``\>

  ↳ **`IFederatedDisplayObject`**

## Properties

### hitArea

• **hitArea**: [`IHitArea`](pixi_events.IHitArea.md)

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Inherited from

Omit.hitArea

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Inherited from

Omit.interactive

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Inherited from

Omit.interactiveChildren

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### onclick

• **onclick**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'click' event

#### Inherited from

Omit.onclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mousedown' event

#### Inherited from

Omit.onmousedown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseenter' event

#### Inherited from

Omit.onmouseenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseleave' event

#### Inherited from

Omit.onmouseleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseover' event

#### Inherited from

Omit.onmousemove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseout' event

#### Inherited from

Omit.onmouseout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseover' event

#### Inherited from

Omit.onmouseover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseup' event

#### Inherited from

Omit.onmouseup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'mouseupoutside' event

#### Inherited from

Omit.onmouseupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointercancel' event

#### Inherited from

Omit.onpointercancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerdown' event

#### Inherited from

Omit.onpointerdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerenter' event

#### Inherited from

Omit.onpointerenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerleave' event

#### Inherited from

Omit.onpointerleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointermove' event

#### Inherited from

Omit.onpointermove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerout' event

#### Inherited from

Omit.onpointerout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerover' event

#### Inherited from

Omit.onpointerover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointertap' event

#### Inherited from

Omit.onpointertap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerup' event

#### Inherited from

Omit.onpointerup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'pointerupoutside' event

#### Inherited from

Omit.onpointerupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightclick' event

#### Inherited from

Omit.onrightclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightdown' event

#### Inherited from

Omit.onrightdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightup' event

#### Inherited from

Omit.onrightup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'rightupoutside' event

#### Inherited from

Omit.onrightupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'tap' event

#### Inherited from

Omit.ontap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchcancel' event

#### Inherited from

Omit.ontouchcancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchend' event

#### Inherited from

Omit.ontouchend

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchendoutside' event

#### Inherited from

Omit.ontouchendoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchmove' event

#### Inherited from

Omit.ontouchmove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md)\>

Handler for 'touchstart' event

#### Inherited from

Omit.ontouchstart

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: [`FederatedEventHandler`](../modules/pixi_events.md#federatedeventhandler)<[`FederatedWheelEvent`](../classes/pixi_events.FederatedWheelEvent.md)\>

Handler for 'wheel' event

#### Inherited from

Omit.onwheel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

## Methods

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`FederatedEventMap`](../modules/pixi_events.md#federatedeventmap) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`e`: [`FederatedEventMap`](../modules/pixi_events.md#federatedeventmap)[`K`]) => `any` |
| `options?` | `AddListenerOptions` |

#### Returns

`void`

#### Overrides

Omit.addEventListener

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L156)

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `AddListenerOptions` |

#### Returns

`void`

#### Overrides

Omit.addEventListener

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:161](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L161)

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`FederatedEventMap`](../modules/pixi_events.md#federatedeventmap) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`e`: [`FederatedEventMap`](../modules/pixi_events.md#federatedeventmap)[`K`]) => `any` |
| `options?` | `RemoveListenerOptions` |

#### Returns

`void`

#### Overrides

Omit.removeEventListener

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:166](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L166)

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `RemoveListenerOptions` |

#### Returns

`void`

#### Overrides

Omit.removeEventListener

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:171](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L171)
