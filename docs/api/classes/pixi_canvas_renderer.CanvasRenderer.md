---
id: "pixi_canvas_renderer.CanvasRenderer"
title: "Class: CanvasRenderer"
sidebar_label: "CanvasRenderer"
custom_edit_url: null
---

[@pixi/canvas-renderer](../modules/pixi_canvas_renderer.md).CanvasRenderer

The CanvasRenderer draws the scene and all its content onto a 2d canvas.

This renderer should be used for browsers that support WebGL.

This renderer should be used for browsers that do not support WebGL.
Don't forget to add the view to your DOM or you will not see anything!

Renderer is composed of systems that manage specific tasks. The following systems are added by default
whenever you create a renderer:

| System                               | Description                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |

| Generic Systems                      | Systems that manage functionality that all renderer types share               |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| PIXI.ViewSystem              | This manages the main view of the renderer usually a Canvas                   |
| PIXI.PluginSystem            | This manages plugins for the renderer                                         |
| PIXI.BackgroundSystem        | This manages the main views background color and alpha                        |
| PIXI.StartupSystem           | Boots up a renderer and initiatives all the systems                           |
| PIXI.EventSystem             | This manages UI events.                                                       |
| PIXI.GenerateTextureSystem   | This adds the ability to generate textures from any PIXI.DisplayObject        |

| PixiJS High-Level Systems            | Set of specific systems designed to work with PixiJS objects                  |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| PIXI.CanvasContextSystem     | This manages the canvas `2d` contexts and their state                         |
| PIXI.CanvasMaskSystem        | This manages masking operations.                                              |
| PIXI.CanvasRenderSystem      | This adds the ability to render a PIXI.DisplayObject                          |
| PIXI.CanvasExtract           | This extracts image data from a PIXI.DisplayObject                            |
| PIXI.CanvasPrepare           | This prepares a PIXI.DisplayObject async for rendering                        |

The breadth of the API surface provided by the renderer is contained within these systems.

**`Memberof`**

PIXI

## Hierarchy

- `CanvasRenderer`

- `SystemManager`<[`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md)\>

  ↳ **`CanvasRenderer`**

## Implements

- `IRenderer`

## Constructors

### constructor

• **new CanvasRenderer**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IRendererOptions` | The optional renderer parameters |

#### Inherited from

GlobalMixins.CanvasRenderer.constructor

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:183](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L183)

## Properties

### \_plugin

• `Readonly` **\_plugin**: `PluginSystem`

plugin system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:138](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L138)

___

### \_view

• `Readonly` **\_view**: `ViewSystem`

View system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:156](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L156)

___

### background

• `Readonly` **background**: `BackgroundSystem`

background system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L126)

___

### canvasContext

• `Readonly` **canvasContext**: [`CanvasContextSystem`](pixi_canvas_renderer.CanvasContextSystem.md)

Canvas context system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:144](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L144)

___

### events

• `Readonly` **events**: `EventSystem`

#### Inherited from

GlobalMixins.CanvasRenderer.events

#### Defined in

[pixijs/packages/events/global.d.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/global.d.ts#L30)

___

### extract

• `Readonly` **extract**: `CanvasExtract`

#### Inherited from

GlobalMixins.CanvasRenderer.extract

#### Defined in

[pixijs/packages/canvas-extract/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-extract/global.d.ts#L5)

___

### mask

• `Readonly` **mask**: [`CanvasMaskSystem`](pixi_canvas_renderer.CanvasMaskSystem.md)

canvas mask system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:132](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L132)

___

### objectRenderer

• `Readonly` **objectRenderer**: [`CanvasObjectRendererSystem`](pixi_canvas_renderer.CanvasObjectRendererSystem.md)

renderer system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:162](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L162)

___

### prepare

• `Readonly` **prepare**: `CanvasPrepare`

#### Inherited from

GlobalMixins.CanvasRenderer.prepare

#### Defined in

[pixijs/packages/canvas-prepare/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-prepare/global.d.ts#L5)

___

### rendererLogId

• `Readonly` **rendererLogId**: ``"Canvas"``

When logging Pixi to the console, this is the name we will show

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L113)

___

### runners

• `Readonly` **runners**: `Object` = `{}`

a collection of runners defined by the user

#### Index signature

▪ [key: `string`]: `Runner`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L22)

___

### startup

• `Readonly` **startup**: `StartupSystem`

Startup system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:150](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L150)

___

### textureGenerator

• `Readonly` **textureGenerator**: `GenerateTextureSystem`

textureGenerator system instance

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L120)

___

### type

• `Readonly` **type**: `CANVAS`

The type of the renderer. will be PIXI.RENDERER_TYPE.CANVAS

**`Member`**

**`See`**

PIXI.RENDERER_TYPE

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:110](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L110)

## Accessors

### autoDensity

• `get` **autoDensity**(): `boolean`

Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:353](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L353)

___

### backgroundAlpha

• `get` **backgroundAlpha**(): `number`

The background color alpha. Setting this to 0 will make the canvas transparent.

**`Member`**

**`Deprecated`**

since 7.0.0

#### Returns

`number`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:559](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L559)

• `set` **backgroundAlpha**(`value`): `void`

**`Deprecated`**

since 7.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:572](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L572)

___

### backgroundColor

• `get` **backgroundColor**(): `number`

The background color to fill if not transparent

**`Deprecated`**

since 7.0.0

#### Returns

`number`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:532](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L532)

• `set` **backgroundColor**(`value`): `void`

**`Deprecated`**

since 7.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:545](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L545)

___

### blendModes

• `get` **blendModes**(): `string`[]

Tracks the blend modes useful for this renderer.

**`Deprecated`**

since 7.0.0 use `renderer.canvasContext.blendModes` instead

#### Returns

`string`[]

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L403)

___

### clearBeforeRender

• `get` **clearBeforeRender**(): `boolean`

This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
to clear the canvas every frame. Disable this by setting this to false. For example, if
your game has a canvas filling background image you often don't need this set.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:392](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L392)

___

### context

• `get` **context**(): `ICanvasRenderingContext2D`

The currently active canvas 2d context (could change with renderTextures)

**`Deprecated`**

since 7.0.0 Use `renderer.canvasContext.activeContext instead

#### Returns

`ICanvasRenderingContext2D`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:455](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L455)

___

### height

• `get` **height**(): `number`

Same as view.height, actual number of pixels in the canvas by vertical.

**`Member`**

**`Default`**

600

#### Returns

`number`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:336](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L336)

___

### lastObjectRendered

• `get` **lastObjectRendered**(): `IRenderableObject`

the last object rendered by the renderer. Useful for other plugins like interaction managers

#### Returns

`IRenderableObject`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:374](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L374)

___

### maskManager

• `get` **maskManager**(): [`CanvasMaskSystem`](pixi_canvas_renderer.CanvasMaskSystem.md)

system that manages canvas masks

**`Deprecated`**

since 7.0.0 use `renderer.canvasContext.mask`

#### Returns

[`CanvasMaskSystem`](pixi_canvas_renderer.CanvasMaskSystem.md)

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:417](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L417)

___

### plugins

• `get` **plugins**(): `IRendererPlugins`

Collection of plugins

#### Returns

`IRendererPlugins`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:304](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L304)

___

### preserveDrawingBuffer

• `get` **preserveDrawingBuffer**(): `boolean`

old abstract function not used by canvas renderer

**`Deprecated`**

since 7.0.0

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:586](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L586)

___

### refresh

• `get` **refresh**(): `boolean`

Boolean flag controlling canvas refresh.

**`Deprecated`**

since 7.0.0

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:428](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L428)

___

### renderingToScreen

• `get` **renderingToScreen**(): `boolean`

Flag if we are rendering to the screen vs renderTexture

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:380](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L380)

___

### resolution

• `get` **resolution**(): `number`

The resolution / device pixel ratio of the renderer.

#### Returns

`number`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:342](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L342)

• `set` **resolution**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:346](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L346)

___

### rootContext

• `get` **rootContext**(): `ICanvasRenderingContext2D`

The root canvas 2d context that everything is drawn with.

**`Deprecated`**

since 7.0.0 Use `renderer.canvasContext.rootContext instead

#### Returns

`ICanvasRenderingContext2D`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:441](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L441)

___

### screen

• `get` **screen**(): `Rectangle`

Measurements of the screen. (0, 0, screenWidth, screenHeight).
Its safe to use as filterArea or hitArea for the whole stage.

#### Returns

`Rectangle`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:368](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L368)

___

### smoothProperty

• `get` **smoothProperty**(): [`SmoothingEnabledProperties`](../modules/pixi_canvas_renderer.md#smoothingenabledproperties)

The canvas property used to set the canvas smoothing property.

**`Deprecated`**

since 7.0.0 Use `renderer.canvasContext.smoothProperty` instead.

#### Returns

[`SmoothingEnabledProperties`](../modules/pixi_canvas_renderer.md#smoothingenabledproperties)

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:469](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L469)

___

### useContextAlpha

• `get` **useContextAlpha**(): `boolean`

old abstract function not used by canvas renderer

**`Deprecated`**

since 7.0.0

#### Returns

`boolean`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:599](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L599)

___

### view

• `get` **view**(): `ICanvas`

The canvas element that everything is drawn to.

#### Returns

`ICanvas`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:359](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L359)

___

### width

• `get` **width**(): `number`

Same as view.width, actual number of pixels in the canvas by horizontal.

**`Member`**

**`Default`**

800

#### Returns

`number`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:325](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L325)

## Methods

### addRunners

▸ **addRunners**(`...runnerIds`): `void`

Create a bunch of runners based of a collection of ids

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...runnerIds` | `string`[] | the runner ids to add |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L55)

___

### addSystem

▸ **addSystem**(`ClassRef`, `name`): [`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md)

Add a new system to the renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ClassRef` | `ISystemConstructor`<[`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md)\> | Class reference |
| `name` | `string` | Property name for system, if not specified will use a static `name` property on the class itself. This name will be assigned as s property on the Renderer so make sure it doesn't collide with properties on Renderer. |

#### Returns

[`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md)

Return instance of renderer

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L72)

___

### clear

▸ **clear**(): `void`

Clear the canvas of renderer.

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L283)

___

### destroy

▸ **destroy**(`removeView?`): `void`

Removes everything from the renderer and optionally removes the Canvas DOM element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `removeView?` | `boolean` | Removes the Canvas element from the DOM. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:292](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L292)

___

### emitWithCustomOptions

▸ **emitWithCustomOptions**(`runner`, `options`): `void`

A function that will run a runner and call the runners function but pass in different options
to each system based on there name.

E.g. If you have two systems added called `systemA` and `systemB` you could call do the following:

```js
system.emitWithCustomOptions(init, {
    systemA: {...optionsForA},
    systemB: {...optionsForB},
});
```

`init` would be called on system A passing `optionsForA` and on system B passing `optionsForB`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `runner` | `Runner` | the runner to target |
| `options` | `Record`<`string`, `unknown`\> | key value options for each system |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L126)

___

### generateTexture

▸ **generateTexture**(`displayObject`, `options?`): `RenderTexture`

Useful function that returns a texture of the display object that can then be used to create sprites
This can be quite useful if your displayObject is complicated and needs to be reused multiple times.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | `IRenderableObject` | The displayObject the object will be generated from. |
| `options?` | `IGenerateTextureOptions` | Generate texture options. |

#### Returns

`RenderTexture`

A texture of the graphics object.

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:258](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L258)

___

### invalidateBlendMode

▸ **invalidateBlendMode**(): `void`

Checks if blend mode has changed.

**`Deprecated`**

since 7.0.0 Use `renderer.canvasContext.invalidateBlendMode` instead.

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:499](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L499)

___

### render

▸ **render**(`displayObject`, `options?`): `void`

Renders the object to its WebGL view.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | `DisplayObject` | The object to be rendered. |
| `options?` | `IRendererRenderOptions` | Object to use for render options. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L277)

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:263](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L263)

___

### resize

▸ **resize**(`desiredScreenWidth`, `desiredScreenHeight`): `void`

Resizes the canvas view to the specified width and height.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredScreenWidth` | `number` | the desired width of the screen |
| `desiredScreenHeight` | `number` | the desired height of the screen |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:314](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L314)

___

### setBlendMode

▸ **setBlendMode**(`blendMode`, `readyForOuterBlend?`): `void`

Sets the blend mode of the renderer.

**`Deprecated`**

since 7.0.0 Use `renderer.canvasContext.setBlendMode` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blendMode` | `BLEND_MODES` | See PIXI.BLEND_MODES for valid values. |
| `readyForOuterBlend?` | `boolean` | Some blendModes are dangerous, they affect outer space of sprite. Pass `true` only if you are ready to use them. |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:486](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L486)

___

### setContextTransform

▸ **setContextTransform**(`transform`, `roundPixels?`, `localResolution?`): `void`

Sets matrix of context.
called only from render() methods
takes care about resolution

**`Deprecated`**

since 7.0.0 - Use `renderer.canvasContext.setContextTransform` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | `Matrix` | world matrix of current element |
| `roundPixels?` | `boolean` | whether to round (tx,ty) coords |
| `localResolution?` | `number` | If specified, used instead of `renderer.resolution` for local scaling |

#### Returns

`void`

#### Defined in

[pixijs/packages/canvas-renderer/src/CanvasRenderer.ts:518](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-renderer/src/CanvasRenderer.ts#L518)

___

### setup

▸ **setup**(`config`): `void`

Set up a system with a collection of SystemClasses and runners.
Systems are attached dynamically to this class when added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ISystemConfig`<[`CanvasRenderer`](pixi_canvas_renderer.CanvasRenderer.md)\> | the config for the system manager |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L31)
