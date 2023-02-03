---
id: "pixi_app.Application"
title: "Class: Application<VIEW>"
sidebar_label: "Application"
custom_edit_url: null
---

[@pixi/app](../modules/pixi_app.md).Application

Convenience class to create a new PixiJS application.

This class automatically creates the renderer, ticker and root container.

**`Example`**

```ts
import { Application, Sprite } from 'pixi.js';

// Create the application
const app = new Application();

// Add the view to the DOM
document.body.appendChild(app.view);

// ex, add display objects
app.stage.addChild(Sprite.from('something.png'));
```

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `VIEW` | extends `ICanvas` = `ICanvas` |

## Hierarchy

- `Application`

  ↳ **`Application`**

## Constructors

### constructor

• **new Application**<`VIEW`\>(`options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `VIEW` | extends `ICanvas`<`VIEW`\> = `ICanvas` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IApplicationOptions`](../interfaces/pixi_app.IApplicationOptions.md) | The optional renderer parameters. |

#### Inherited from

GlobalMixins.Application.constructor

#### Defined in

[pixijs/packages/app/src/Application.ts:96](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L96)

## Properties

### cancelResize

• **cancelResize**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

GlobalMixins.Application.cancelResize

#### Defined in

[pixijs/packages/app/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/global.d.ts#L8)

___

### queueResize

• **queueResize**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

GlobalMixins.Application.queueResize

#### Defined in

[pixijs/packages/app/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/global.d.ts#L7)

___

### renderer

• **renderer**: `IRenderer`<`VIEW`\>

WebGL renderer if available, otherwise CanvasRenderer.

**`Member`**

#### Defined in

[pixijs/packages/app/src/Application.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L62)

___

### resizeTo

• **resizeTo**: `HTMLElement` \| `Window`

#### Inherited from

GlobalMixins.Application.resizeTo

#### Defined in

[pixijs/packages/app/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/global.d.ts#L5)

___

### stage

• **stage**: `Container`<`DisplayObject`\>

The root display container that's rendered.

**`Member`**

#### Defined in

[pixijs/packages/app/src/Application.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L56)

___

### ticker

• **ticker**: `Ticker`

#### Inherited from

GlobalMixins.Application.ticker

#### Defined in

[pixijs/packages/ticker/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/global.d.ts#L5)

___

### \_plugins

▪ `Static` **\_plugins**: [`IApplicationPlugin`](../interfaces/pixi_app.IApplicationPlugin.md)[] = `[]`

Collection of installed plugins.

#### Defined in

[pixijs/packages/app/src/Application.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L50)

## Accessors

### screen

• `get` **screen**(): `Rectangle`

Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.

**`Member`**

#### Returns

`Rectangle`

#### Defined in

[pixijs/packages/app/src/Application.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L133)

___

### view

• `get` **view**(): `VIEW`

Reference to the renderer's canvas element.

**`Member`**

#### Returns

`VIEW`

#### Defined in

[pixijs/packages/app/src/Application.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L123)

## Methods

### destroy

▸ **destroy**(`removeView?`, `stageOptions?`): `void`

Destroy and don't use after this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `removeView?` | `boolean` | Automatically remove canvas from DOM. |
| `stageOptions?` | `boolean` \| `IDestroyOptions` | Options parameter. A boolean will act as if all options have been set to that value |

#### Returns

`void`

#### Defined in

[pixijs/packages/app/src/Application.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L150)

___

### render

▸ **render**(): `void`

Render the current stage.

#### Returns

`void`

#### Defined in

[pixijs/packages/app/src/Application.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/src/Application.ts#L113)

___

### resize

▸ **resize**(): `void`

#### Returns

`void`

#### Inherited from

GlobalMixins.Application.resize

#### Defined in

[pixijs/packages/app/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/app/global.d.ts#L6)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Inherited from

GlobalMixins.Application.start

#### Defined in

[pixijs/packages/ticker/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/global.d.ts#L7)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Inherited from

GlobalMixins.Application.stop

#### Defined in

[pixijs/packages/ticker/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/ticker/global.d.ts#L6)
