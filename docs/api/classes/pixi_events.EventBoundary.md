---
id: "pixi_events.EventBoundary"
title: "Class: EventBoundary"
sidebar_label: "EventBoundary"
custom_edit_url: null
---

[@pixi/events](../modules/pixi_events.md).EventBoundary

Event boundaries are "barriers" where events coming from an upstream scene are modified before downstream propagation.

## Root event boundary

The PIXI.EventSystem#rootBoundary rootBoundary handles events coming from the &lt;canvas /&gt;.
PIXI.EventSystem handles the normalization from native [Events](https://dom.spec.whatwg.org/#event)
into PIXI.FederatedEvent FederatedEvents. The rootBoundary then does the hit-testing and event dispatch
for the upstream normalized event.

## Additional event boundaries

An additional event boundary may be desired within an application's scene graph. For example, if a portion of the scene is
is flat with many children at one level - a spatial hash maybe needed to accelerate hit testing. In this scenario, the
container can be detached from the scene and glued using a custom event boundary.

```ts
import { Container } from '@pixi/display';
import { EventBoundary } from '@pixi/events';
import { SpatialHash } from 'pixi-spatial-hash';

class HashedHitTestingEventBoundary
{
    private spatialHash: SpatialHash;

    constructor(scene: Container, spatialHash: SpatialHash)
    {
        super(scene);
        this.spatialHash = spatialHash;
    }

    hitTestRecursive(...)
    {
        // TODO: If target === this.rootTarget, then use spatial hash to get a
        // list of possible children that match the given (x,y) coordinates.
    }
}

class VastScene extends DisplayObject
{
    protected eventBoundary: EventBoundary;
    protected scene: Container;
    protected spatialHash: SpatialHash;

    constructor()
    {
        this.scene = new Container();
        this.spatialHash = new SpatialHash();
        this.eventBoundary = new HashedHitTestingEventBoundary(this.scene, this.spatialHash);

        // Populate this.scene with a ton of children, while updating this.spatialHash
    }
}
```

**`Memberof`**

PIXI

## Constructors

### constructor

• **new EventBoundary**(`rootTarget?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootTarget?` | `DisplayObject` | The holder of the event boundary. |

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:179](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L179)

## Properties

### cursor

• **cursor**: `string`

The cursor preferred by the event targets underneath this boundary.

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L139)

___

### dispatch

• **dispatch**: `EventEmitter`<`string` \| `symbol`, `any`\>

Emits events after they were dispatched into the scene graph.

This can be used for global events listening, regardless of the scene graph being used. It should
not be used by interactive libraries for normal use.

Special events that do not bubble all the way to the root target are not emitted from here,
e.g. pointerenter, pointerleave, click.

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L136)

___

### moveOnAll

• **moveOnAll**: `boolean` = `false`

This flag would emit `pointermove`, `touchmove`, and `mousemove` events on all DisplayObjects.

The `moveOnAll` semantics mirror those of earlier versions of PixiJS. This was disabled in favor of
the Pointer Event API's approach.

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L147)

___

### rootTarget

• **rootTarget**: `DisplayObject`

The root event-target residing below the event boundary.

All events are dispatched trickling down and bubbling up to this `rootTarget`.

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L125)

## Methods

### addEventMapping

▸ **addEventMapping**(`type`, `fn`): `void`

Adds an event mapping for the event `type` handled by `fn`.

Event mappings can be used to implement additional or custom events. They take an event
coming from the upstream scene (or directly from the PIXI.EventSystem) and dispatch new downstream events
generally trickling down and bubbling up to PIXI.EventBoundary.rootTarget this.rootTarget.

To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The type of upstream event to map. |
| `fn` | (`e`: [`FederatedEvent`](pixi_events.FederatedEvent.md)<`UIEvent`\>) => `void` | The mapping method. The context of this function must be bound manually, if desired. |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:216](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L216)

___

### all

▸ **all**(`e`, `type?`, `target?`): `void`

Emits the event e to all display objects. The event is propagated in the bubbling phase always.

This is used in the `pointermove` legacy mode.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | [`FederatedEvent`](pixi_events.FederatedEvent.md)<`UIEvent`\> | The emitted event. |
| `type?` | `string` | The listeners to notify. |
| `target` | [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md) |  |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:350](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L350)

___

### dispatchEvent

▸ **dispatchEvent**(`e`, `type?`): `void`

Dispatches the given event

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | [`FederatedEvent`](pixi_events.FederatedEvent.md)<`UIEvent`\> |
| `type?` | `string` |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:235](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L235)

___

### hitTest

▸ **hitTest**(`x`, `y`): `DisplayObject`

Finds the DisplayObject that is the target of a event at the given coordinates.

The passed (x,y) coordinates are in the world space above this event boundary.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Returns

`DisplayObject`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L277)

___

### mapEvent

▸ **mapEvent**(`e`): `void`

Maps the given upstream event through the event boundary and propagates it downstream.

#### Parameters

| Name | Type |
| :------ | :------ |
| `e` | [`FederatedEvent`](pixi_events.FederatedEvent.md)<`UIEvent`\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L248)

___

### propagate

▸ **propagate**(`e`, `type?`): `void`

Propagate the passed event from from [this.rootTarget](pixi_events.EventBoundary.md#roottarget) to its
target {@code e.target}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `e` | [`FederatedEvent`](pixi_events.FederatedEvent.md)<`UIEvent`\> | The event to propagate. |
| `type?` | `string` |  |

#### Returns

`void`

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L299)

___

### propagationPath

▸ **propagationPath**(`target`): [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

Finds the propagation path from PIXI.EventBoundary.rootTarget rootTarget to the passed
{@code target}. The last element in the path is {@code target}.

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md) |

#### Returns

[`FederatedEventTarget`](../interfaces/pixi_events.FederatedEventTarget.md)[]

#### Defined in

[pixijs/packages/events/src/EventBoundary.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/EventBoundary.ts#L373)
