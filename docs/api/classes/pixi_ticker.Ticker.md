---
id: "pixi_ticker.Ticker"
title: "Class: Ticker"
sidebar_label: "Ticker"
custom_edit_url: null
---

[@pixi/ticker](../modules/pixi_ticker.md).Ticker

A Ticker class that runs an update loop that other objects listen to.

This class is composed around listeners meant for execution on the next requested animation frame.
Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Ticker**()

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:116](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L116)

## Properties

### autoStart

• **autoStart**: `boolean` = `false`

Whether or not this ticker should invoke the method
PIXI.Ticker#start automatically
when a listener is added.

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L32)

___

### deltaMS

• **deltaMS**: `number`

Scaler time elapsed in milliseconds from last frame to this frame.
This value is capped by setting PIXI.Ticker#minFPS
and is scaled with PIXI.Ticker#speed.
**Note:** The cap may be exceeded by scaling.
If the platform supports DOMHighResTimeStamp,
this value will have a precision of 1 µs.
Defaults to target frame time

**`Default`**

16.66

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L50)

___

### deltaTime

• **deltaTime**: `number` = `1`

Scalar time value from last frame to this frame.
This value is capped by setting PIXI.Ticker#minFPS
and is scaled with PIXI.Ticker#speed.
**Note:** The cap may be exceeded by scaling.

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L39)

___

### elapsedMS

• **elapsedMS**: `number`

Time elapsed in milliseconds from last frame to this frame.
Opposed to what the scalar PIXI.Ticker#deltaTime
is based, this value is neither capped nor scaled.
If the platform supports DOMHighResTimeStamp,
this value will have a precision of 1 µs.
Defaults to target frame time

**`Default`**

16.66

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L60)

___

### lastTime

• **lastTime**: `number` = `-1`

The last time PIXI.Ticker#update was invoked.
This value is also reset internally outside of invoking
update, but only when a new animation frame is requested.
If the platform supports DOMHighResTimeStamp,
this value will have a precision of 1 µs.

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L68)

___

### speed

• **speed**: `number` = `1`

Factor of current PIXI.Ticker#deltaTime.

**`Example`**

```ts
// Scales ticker.deltaTime to what would be
// the equivalent of approximately 120 FPS
ticker.speed = 2;
```

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L76)

___

### started

• **started**: `boolean` = `false`

Whether or not this ticker has been started.
`true` if PIXI.Ticker#start has been called.
`false` if PIXI.Ticker#stop has been called.
While `false`, this value may change to `true` in the
event of PIXI.Ticker#autoStart being `true`
and a listener is added.

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L85)

___

### targetFPMS

▪ `Static` **targetFPMS**: `number` = `0.06`

Target frames per millisecond.

**`Static`**

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L20)

## Accessors

### FPS

• `get` **FPS**(): `number`

The frames per second at which this ticker is running.
The default is approximately 60 in most modern browsers.
**Note:** This does not factor in the value of
PIXI.Ticker#speed, which is specific
to scaling PIXI.Ticker#deltaTime.

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:452](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L452)

___

### count

• `get` **count**(): `number`

The number of listeners on this ticker, calculated by walking through linked list

**`Member`**

#### Returns

`number`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L299)

___

### maxFPS

• `get` **maxFPS**(): `number`

Manages the minimum amount of milliseconds required to
elapse between invoking PIXI.Ticker#update.
This will effect the measured value of PIXI.Ticker#FPS.
If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
Otherwise it will be at least `minFPS`

**`Member`**

**`Default`**

0

#### Returns

`number`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:492](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L492)

• `set` **maxFPS**(`fps`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fps` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:502](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L502)

___

### minFPS

• `get` **minFPS**(): `number`

Manages the maximum amount of milliseconds allowed to
elapse between invoking PIXI.Ticker#update.
This value is used to cap PIXI.Ticker#deltaTime,
but does not effect the measured value of PIXI.Ticker#FPS.
When setting this property it is clamped to a value between
`0` and `Ticker.targetFPMS * 1000`.

**`Member`**

**`Default`**

10

#### Returns

`number`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:467](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L467)

• `set` **minFPS**(`fps`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fps` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:472](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L472)

___

### shared

• `Static` `get` **shared**(): [`Ticker`](pixi_ticker.Ticker.md)

The shared ticker instance used by PIXI.AnimatedSprite and by
PIXI.VideoResource to update animation frames / video textures.

It may also be used by PIXI.Application if created with the `sharedTicker` option property set to true.

The property PIXI.Ticker#autoStart is set to `true` for this instance.
Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.

**`Example`**

```ts
import { Ticker } from 'pixi.js';

const ticker = Ticker.shared;
// Set this to prevent starting this ticker when listeners are added.
// By default this is true only for the PIXI.Ticker.shared instance.
ticker.autoStart = false;

// FYI, call this to ensure the ticker is stopped. It should be stopped
// if you have not attempted to render anything yet.
ticker.stop();

// Call this when you are ready for a running shared ticker.
ticker.start();
```

**`Example`**

```ts
import { autoDetectRenderer, Container } from 'pixi.js';

// You may use the shared ticker to render...
const renderer = autoDetectRenderer();
const stage = new Container();
document.body.appendChild(renderer.view);
ticker.add((time) => renderer.render(stage));

// Or you can just update it manually.
ticker.autoStart = false;
ticker.stop();
const animate = (time) => {
    ticker.update(time);
    renderer.render(stage);
    requestAnimationFrame(animate);
};
animate(performance.now());
```

**`Member`**

**`Static`**

#### Returns

[`Ticker`](pixi_ticker.Ticker.md)

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:560](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L560)

___

### system

• `Static` `get` **system**(): [`Ticker`](pixi_ticker.Ticker.md)

The system ticker instance used by PIXI.BasePrepare for core timing
functionality that shouldn't usually need to be paused, unlike the `shared`
ticker which drives visual animations and rendering which may want to be paused.

The property PIXI.Ticker#autoStart is set to `true` for this instance.

**`Member`**

**`Static`**

#### Returns

[`Ticker`](pixi_ticker.Ticker.md)

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:582](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L582)

## Methods

### add

▸ **add**<`T`\>(`fn`, `context?`, `priority?`): [`Ticker`](pixi_ticker.Ticker.md)

Register a handler for tick events. Calls continuously unless
it is removed or the ticker is stopped.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fn` | [`TickerCallback`](../modules/pixi_ticker.md#tickercallback)<`T`\> | `undefined` | The listener function to be added for updates |
| `context?` | `T` | `undefined` | The listener context |
| `priority?` | [`UPDATE_PRIORITY`](../enums/pixi_ticker.UPDATE_PRIORITY.md) | `UPDATE_PRIORITY.NORMAL` | The priority for emitting |

#### Returns

[`Ticker`](pixi_ticker.Ticker.md)

This instance of a ticker

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:198](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L198)

___

### addOnce

▸ **addOnce**<`T`\>(`fn`, `context?`, `priority?`): [`Ticker`](pixi_ticker.Ticker.md)

Add a handler for the tick event which is only execute once.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fn` | [`TickerCallback`](../modules/pixi_ticker.md#tickercallback)<`T`\> | `undefined` | The listener function to be added for one update |
| `context?` | `T` | `undefined` | The listener context |
| `priority?` | [`UPDATE_PRIORITY`](../enums/pixi_ticker.UPDATE_PRIORITY.md) | `UPDATE_PRIORITY.NORMAL` | The priority for emitting |

#### Returns

[`Ticker`](pixi_ticker.Ticker.md)

This instance of a ticker

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:210](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L210)

___

### destroy

▸ **destroy**(): `void`

Destroy the ticker and don't use after this. Calling this method removes all references to internal events.

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L338)

___

### remove

▸ **remove**<`T`\>(`fn`, `context?`): [`Ticker`](pixi_ticker.Ticker.md)

Removes any handlers matching the function and context parameters.
If no handlers are left after removing, then it cancels the animation frame.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`TickerCallback`](../modules/pixi_ticker.md#tickercallback)<`T`\> | The listener function to be removed |
| `context?` | `T` | The listener context to be removed |

#### Returns

[`Ticker`](pixi_ticker.Ticker.md)

This instance of a ticker

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:267](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L267)

___

### start

▸ **start**(): `void`

Starts the ticker. If the ticker has listeners a new animation frame is requested at this point.

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:318](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L318)

___

### stop

▸ **stop**(): `void`

Stops the ticker. If the ticker has requested an animation frame it is canceled at this point.

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:328](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L328)

___

### update

▸ **update**(`currentTime?`): `void`

Triggers an update. An update entails setting the
current PIXI.Ticker#elapsedMS,
the current PIXI.Ticker#deltaTime,
invoking all listeners with current deltaTime,
and then finally setting PIXI.Ticker#lastTime
with the value of currentTime that was provided.
This method will be called automatically by animation
frame callbacks if the ticker instance has been started
and listeners are added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currentTime?` | `number` | the current time of execution |

#### Returns

`void`

#### Defined in

[pixijs/packages/ticker/src/Ticker.ts:368](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/src/Ticker.ts#L368)
