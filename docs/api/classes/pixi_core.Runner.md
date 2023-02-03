---
id: "pixi_core.Runner"
title: "Class: Runner"
sidebar_label: "Runner"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Runner

A Runner is a highly performant and simple alternative to signals. Best used in situations
where events are dispatched to many objects at high frequency (say every frame!)

Like a signal:

```js
import { Runner } from '@pixi/runner';

const myObject = {
    loaded: new Runner('loaded'),
};

const listener = {
    loaded: function() {
        // Do something when loaded
    }
};

myObject.loaded.add(listener);

myObject.loaded.emit();
```

Or for handling calling the same function on many items:

```js
import { Runner } from '@pixi/runner';

const myGame = {
    update: new Runner('update'),
};

const gameObject = {
    update: function(time) {
        // Update my gamey state
    },
};

myGame.update.add(gameObject);

myGame.update.emit(time);
```

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Runner**(`name`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The function name that will be executed on the listeners added to this Runner. |

#### Defined in

[pixijs/packages/runner/src/Runner.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L55)

## Properties

### items

• **items**: `any`[]

#### Defined in

[pixijs/packages/runner/src/Runner.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L48)

## Accessors

### empty

• `get` **empty**(): `boolean`

`true` if there are no this Runner contains no listeners

#### Returns

`boolean`

#### Defined in

[pixijs/packages/runner/src/Runner.ts:179](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L179)

___

### name

• `get` **name**(): `string`

The name of the runner.

#### Returns

`string`

#### Defined in

[pixijs/packages/runner/src/Runner.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L188)

## Methods

### add

▸ **add**(`item`): [`Runner`](pixi_core.Runner.md)

Add a listener to the Runner

Runners do not need to have scope or functions passed to them.
All that is required is to pass the listening object and ensure that it has contains a function that has the same name
as the name provided to the Runner when it was created.

E.g. A listener passed to this Runner will require a 'complete' function.

```js
import { Runner } from '@pixi/runner';

const complete = new Runner('complete');
```

The scope used will be the object itself.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `unknown` | The object that will be listening. |

#### Returns

[`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/runner/src/Runner.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L120)

___

### contains

▸ **contains**(`item`): `boolean`

Check to see if the listener is already in the Runner

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `unknown` | The listener that you would like to check. |

#### Returns

`boolean`

#### Defined in

[pixijs/packages/runner/src/Runner.ts:153](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L153)

___

### destroy

▸ **destroy**(): `void`

Remove all references, don't use after this.

#### Returns

`void`

#### Defined in

[pixijs/packages/runner/src/Runner.ts:168](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L168)

___

### emit

▸ **emit**(`a0?`, `a1?`, `a2?`, `a3?`, `a4?`, `a5?`, `a6?`, `a7?`): [`Runner`](pixi_core.Runner.md)

Dispatch/Broadcast Runner to all listeners added to the queue.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a0?` | `unknown` |
| `a1?` | `unknown` |
| `a2?` | `unknown` |
| `a3?` | `unknown` |
| `a4?` | `unknown` |
| `a5?` | `unknown` |
| `a6?` | `unknown` |
| `a7?` | `unknown` |

#### Returns

[`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/runner/src/Runner.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L68)

___

### remove

▸ **remove**(`item`): [`Runner`](pixi_core.Runner.md)

Remove a single listener from the dispatch queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `unknown` | The listener that you would like to remove. |

#### Returns

[`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/runner/src/Runner.ts:136](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L136)

___

### removeAll

▸ **removeAll**(): [`Runner`](pixi_core.Runner.md)

Remove all listeners from the Runner

#### Returns

[`Runner`](pixi_core.Runner.md)

#### Defined in

[pixijs/packages/runner/src/Runner.ts:159](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/runner/src/Runner.ts#L159)
