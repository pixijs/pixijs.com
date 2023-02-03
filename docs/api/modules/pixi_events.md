---
id: "pixi_events"
title: "Module: @pixi/events"
sidebar_label: "@pixi/events"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [EventBoundary](../classes/pixi_events.EventBoundary.md)
- [EventSystem](../classes/pixi_events.EventSystem.md)
- [FederatedEvent](../classes/pixi_events.FederatedEvent.md)
- [FederatedMouseEvent](../classes/pixi_events.FederatedMouseEvent.md)
- [FederatedPointerEvent](../classes/pixi_events.FederatedPointerEvent.md)
- [FederatedWheelEvent](../classes/pixi_events.FederatedWheelEvent.md)

## Interfaces

- [FederatedEventTarget](../interfaces/pixi_events.FederatedEventTarget.md)
- [IFederatedDisplayObject](../interfaces/pixi_events.IFederatedDisplayObject.md)
- [IHitArea](../interfaces/pixi_events.IHitArea.md)

## Type Aliases

### Cursor

Ƭ **Cursor**: ``"auto"`` \| ``"default"`` \| ``"none"`` \| ``"context-menu"`` \| ``"help"`` \| ``"pointer"`` \| ``"progress"`` \| ``"wait"`` \| ``"cell"`` \| ``"crosshair"`` \| ``"text"`` \| ``"vertical-text"`` \| ``"alias"`` \| ``"copy"`` \| ``"move"`` \| ``"no-drop"`` \| ``"not-allowed"`` \| ``"e-resize"`` \| ``"n-resize"`` \| ``"ne-resize"`` \| ``"nw-resize"`` \| ``"s-resize"`` \| ``"se-resize"`` \| ``"sw-resize"`` \| ``"w-resize"`` \| ``"ns-resize"`` \| ``"ew-resize"`` \| ``"nesw-resize"`` \| ``"col-resize"`` \| ``"nwse-resize"`` \| ``"row-resize"`` \| ``"all-scroll"`` \| ``"zoom-in"`` \| ``"zoom-out"`` \| ``"grab"`` \| ``"grabbing"``

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L9)

___

### FederatedEventEmitterTypes

Ƭ **FederatedEventEmitterTypes**: { [K in keyof FederatedEventMap as K \| \`${K}capture\`]: [event: FederatedEventMap[K]] }

#### Defined in

[pixijs/packages/events/src/FederatedEventMap.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventMap.ts#L36)

___

### FederatedEventHandler

Ƭ **FederatedEventHandler**<`T`\>: (`event`: `T`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |

#### Type declaration

▸ (`event`): `void`

Function type for handlers, e.g., onclick

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |

##### Returns

`void`

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L53)

___

### FederatedEventMap

Ƭ **FederatedEventMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `click` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mousedown` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseenter` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseleave` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mousemove` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseout` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseover` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseup` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `mouseupoutside` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointercancel` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerdown` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerenter` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerleave` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointermove` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerout` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerover` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointertap` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerup` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `pointerupoutside` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `rightclick` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `rightdown` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `rightup` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `rightupoutside` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `tap` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `touchcancel` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `touchend` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `touchendoutside` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `touchmove` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `touchstart` | [`FederatedPointerEvent`](../classes/pixi_events.FederatedPointerEvent.md) |
| `wheel` | [`FederatedWheelEvent`](../classes/pixi_events.FederatedWheelEvent.md) |

#### Defined in

[pixijs/packages/events/src/FederatedEventMap.ts:4](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventMap.ts#L4)

## Variables

### FederatedDisplayObject

• `Const` **FederatedDisplayObject**: [`IFederatedDisplayObject`](../interfaces/pixi_events.IFederatedDisplayObject.md)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:178](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L178)
