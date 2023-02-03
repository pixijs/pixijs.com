---
id: "pixi_core.Renderer"
title: "Class: Renderer"
sidebar_label: "Renderer"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Renderer

The Renderer draws the scene and all its content onto a WebGL enabled canvas.

This renderer should be used for browsers that support WebGL.

This renderer works by automatically managing WebGLBatches, so no need for Sprite Batches or Sprite Clouds.
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

| WebGL Core Systems                   | Provide an optimised, easy to use API to work with WebGL                      |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| PIXI.ContextSystem           | This manages the WebGL context and extensions.                                |
| PIXI.FramebufferSystem       | This manages framebuffers, which are used for offscreen rendering.            |
| PIXI.GeometrySystem          | This manages geometries & buffers, which are used to draw object meshes.      |
| PIXI.ShaderSystem            | This manages shaders, programs that run on the GPU to calculate 'em pixels.   |
| PIXI.StateSystem             | This manages the WebGL state variables like blend mode, depth testing, etc.   |
| PIXI.TextureSystem           | This manages textures and their resources on the GPU.                         |
| PIXI.TextureGCSystem         | This will automatically remove textures from the GPU if they are not used.    |
| PIXI.MultisampleSystem       | This manages the multisample const on the WEbGL Renderer                      |

| PixiJS High-Level Systems            | Set of specific systems designed to work with PixiJS objects                  |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| PIXI.RenderSystem            | This adds the ability to render a PIXI.DisplayObject                          |
| PIXI.GenerateTextureSystem   | This adds the ability to generate textures from any PIXI.DisplayObject        |
| PIXI.ProjectionSystem        | This manages the `projectionMatrix`, used by shaders to get NDC coordinates.  |
| PIXI.RenderTextureSystem     | This manages render-textures, which are an abstraction over framebuffers.     |
| PIXI.MaskSystem              | This manages masking operations.                                              |
| PIXI.ScissorSystem           | This handles scissor masking, and is used internally by [MaskSystem](pixi_core.MaskSystem.md)    |
| PIXI.StencilSystem           | This handles stencil masking, and is used internally by [MaskSystem](pixi_core.MaskSystem.md)    |
| PIXI.FilterSystem            | This manages the filtering pipeline for post-processing effects.              |
| PIXI.BatchSystem             | This manages object renderers that defer rendering until a flush.             |
| PIXI.Prepare                 | This manages uploading assets to the GPU.                                     |
| PIXI.Extract                 | This extracts image data from display objects.                                |

The breadth of the API surface provided by the renderer is contained within these systems.

**`Memberof`**

PIXI

## Hierarchy

- `Renderer`

- [`SystemManager`](pixi_core.SystemManager.md)<[`Renderer`](pixi_core.Renderer.md)\>

  ↳ **`Renderer`**

## Implements

- [`IRenderer`](../interfaces/pixi_core.IRenderer.md)

## Constructors

### constructor

• **new Renderer**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IRendererOptions`](../interfaces/pixi_core.IRendererOptions.md) | The optional renderer parameters. |

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[constructor](pixi_core.SystemManager.md#constructor)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:312](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L312)

## Properties

### CONTEXT\_UID

• **CONTEXT\_UID**: `number`

Unique UID assigned to the renderer's WebGL context.

#### Defined in

[pixijs/packages/core/src/Renderer.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L126)

___

### \_multisample

• `Readonly` **\_multisample**: [`MultisampleSystem`](pixi_core.MultisampleSystem.md)

_multisample system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:236](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L236)

___

### \_plugin

• `Readonly` **\_plugin**: [`PluginSystem`](pixi_core.PluginSystem.md)

plugin system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:230](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L230)

___

### \_view

• `Readonly` **\_view**: [`ViewSystem`](pixi_core.ViewSystem.md)

_view system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:254](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L254)

___

### background

• `Readonly` **background**: [`BackgroundSystem`](pixi_core.BackgroundSystem.md)

background system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L248)

___

### batch

• `Readonly` **batch**: [`BatchSystem`](pixi_core.BatchSystem.md)

Batch system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:224](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L224)

___

### buffer

• `Readonly` **buffer**: [`BufferSystem`](pixi_core.BufferSystem.md)

Buffer system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:164](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L164)

___

### context

• `Readonly` **context**: [`ContextSystem`](pixi_core.ContextSystem.md)

Context system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L140)

___

### events

• `Readonly` **events**: `EventSystem`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[events](../interfaces/pixi_core.IRenderer.md#events)

#### Inherited from

GlobalMixins.Renderer.events

#### Defined in

[pixijs/packages/events/global.d.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/global.d.ts#L25)

___

### extract

• `Readonly` **extract**: `Extract`

#### Inherited from

GlobalMixins.Renderer.extract

#### Defined in

[pixijs/packages/extract/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/extract/global.d.ts#L5)

___

### filter

• `Readonly` **filter**: [`FilterSystem`](pixi_core.FilterSystem.md)

Filter system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:212](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L212)

___

### framebuffer

• `Readonly` **framebuffer**: [`FramebufferSystem`](pixi_core.FramebufferSystem.md)

Framebuffer system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L182)

___

### geometry

• `Readonly` **geometry**: [`GeometrySystem`](pixi_core.GeometrySystem.md)

Geometry system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:176](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L176)

___

### gl

• `Readonly` **gl**: [`IRenderingContext`](../interfaces/pixi_core.IRenderingContext.md)

WebGL context, set by PIXI.ContextSystem this.context.

**`Member`**

#### Defined in

[pixijs/packages/core/src/Renderer.ts:114](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L114)

___

### globalUniforms

• **globalUniforms**: [`UniformGroup`](pixi_core.UniformGroup.md)<[`Dict`](../namespaces/pixi_core.utils.md#dict)<`any`\>\>

Global uniforms
Add any uniforms you want shared across your shaders.
the must be added before the scene is rendered for the first time
as we dynamically buildcode to handle all global var per shader

#### Defined in

[pixijs/packages/core/src/Renderer.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L123)

___

### mask

• `Readonly` **mask**: [`MaskSystem`](pixi_core.MaskSystem.md)

Mask system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L134)

___

### objectRenderer

• `Readonly` **objectRenderer**: [`ObjectRendererSystem`](pixi_core.ObjectRendererSystem.md)

_render system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:260](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L260)

___

### prepare

• `Readonly` **prepare**: `Prepare`

#### Inherited from

GlobalMixins.Renderer.prepare

#### Defined in

[pixijs/packages/prepare/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/global.d.ts#L5)

___

### projection

• `Readonly` **projection**: [`ProjectionSystem`](pixi_core.ProjectionSystem.md)

Projection system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:200](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L200)

___

### renderTexture

• `Readonly` **renderTexture**: [`RenderTextureSystem`](pixi_core.RenderTextureSystem.md)

RenderTexture system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:218](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L218)

___

### runners

• `Readonly` **runners**: `Object` = `{}`

a collection of runners defined by the user

#### Index signature

▪ [key: `string`]: [`Runner`](pixi_core.Runner.md)

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[runners](../interfaces/pixi_core.IRenderer.md#runners)

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[runners](pixi_core.SystemManager.md#runners)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L22)

___

### scissor

• `Readonly` **scissor**: [`ScissorSystem`](pixi_core.ScissorSystem.md)

Scissor system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L188)

___

### shader

• `Readonly` **shader**: [`ShaderSystem`](pixi_core.ShaderSystem.md)

Shader system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:152](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L152)

___

### startup

• `Readonly` **startup**: [`StartupSystem`](pixi_core.StartupSystem.md)

startup system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:266](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L266)

___

### state

• `Readonly` **state**: [`StateSystem`](pixi_core.StateSystem.md)

State system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:146](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L146)

___

### stencil

• `Readonly` **stencil**: [`StencilSystem`](pixi_core.StencilSystem.md)

Stencil system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:194](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L194)

___

### texture

• `Readonly` **texture**: [`TextureSystem`](pixi_core.TextureSystem.md)

Texture system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:158](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L158)

___

### textureGC

• `Readonly` **textureGC**: [`TextureGCSystem`](pixi_core.TextureGCSystem.md)

Texture garbage collector system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:206](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L206)

___

### textureGenerator

• `Readonly` **textureGenerator**: [`GenerateTextureSystem`](pixi_core.GenerateTextureSystem.md)

textureGenerator system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:242](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L242)

___

### transformFeedback

• `Readonly` **transformFeedback**: [`TransformFeedbackSystem`](pixi_core.TransformFeedbackSystem.md)

TransformFeedback system instance

#### Defined in

[pixijs/packages/core/src/Renderer.ts:170](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L170)

___

### type

• `Readonly` **type**: [`WEBGL`](../enums/pixi_core.RENDERER_TYPE.md#webgl)

The type of the renderer. will be PIXI.RENDERER_TYPE.CANVAS

**`Member`**

**`See`**

PIXI.RENDERER_TYPE

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[type](../interfaces/pixi_core.IRenderer.md#type)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L107)

## Accessors

### autoDensity

• `get` **autoDensity**(): `boolean`

Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:510](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L510)

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

[pixijs/packages/core/src/Renderer.ts:624](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L624)

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

[pixijs/packages/core/src/Renderer.ts:637](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L637)

___

### backgroundColor

• `get` **backgroundColor**(): `number`

The background color to fill if not transparent

**`Member`**

**`Deprecated`**

since 7.0.0

#### Returns

`number`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:600](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L600)

• `set` **backgroundColor**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:610](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L610)

___

### clearBeforeRender

• `get` **clearBeforeRender**(): `boolean`

This sets weather the screen is totally cleared between each frame withthe background color and alpha

**`Deprecated`**

since 7.0.0

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:554](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L554)

___

### height

• `get` **height**(): `number`

Same as view.height, actual number of pixels in the canvas by vertical.

**`Default`**

600

#### Returns

`number`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[height](../interfaces/pixi_core.IRenderer.md#height)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:493](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L493)

___

### lastObjectRendered

• `get` **lastObjectRendered**(): [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md)

the last object rendered by the renderer. Useful for other plugins like interaction managers

#### Returns

[`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md)

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[lastObjectRendered](../interfaces/pixi_core.IRenderer.md#lastobjectrendered)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:533](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L533)

___

### multisample

• `get` **multisample**(): [`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

The number of msaa samples of the canvas.

#### Returns

[`MSAA_QUALITY`](../enums/pixi_core.MSAA_QUALITY.md)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:473](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L473)

___

### plugins

• `get` **plugins**(): [`IRendererPlugins`](../interfaces/pixi_core.IRendererPlugins.md)

Collection of plugins

#### Returns

[`IRendererPlugins`](../interfaces/pixi_core.IRendererPlugins.md)

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[plugins](../interfaces/pixi_core.IRenderer.md#plugins)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:467](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L467)

___

### powerPreference

• `get` **powerPreference**(): `WebGLPowerPreference`

**`Deprecated`**

since 7.0.0

#### Returns

`WebGLPowerPreference`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:650](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L650)

___

### preserveDrawingBuffer

• `get` **preserveDrawingBuffer**(): `boolean`

readonly drawing buffer preservation
we can only know this if Pixi created the context

**`Deprecated`**

since 7.0.0

#### Returns

`boolean`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:585](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L585)

___

### rendererLogId

• `get` **rendererLogId**(): `string`

When logging Pixi to the console, this is the name we will show

#### Returns

`string`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[rendererLogId](../interfaces/pixi_core.IRenderer.md#rendererlogid)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:545](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L545)

___

### renderingToScreen

• `get` **renderingToScreen**(): `boolean`

Flag if we are rendering to the screen vs renderTexture

#### Returns

`boolean`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[renderingToScreen](../interfaces/pixi_core.IRenderer.md#renderingtoscreen)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:539](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L539)

___

### resolution

• `get` **resolution**(): `number`

The resolution / device pixel ratio of the renderer.

#### Returns

`number`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[resolution](../interfaces/pixi_core.IRenderer.md#resolution)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:499](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L499)

• `set` **resolution**(`value`): `void`

The resolution / device pixel ratio of the renderer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[resolution](../interfaces/pixi_core.IRenderer.md#resolution)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:503](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L503)

___

### screen

• `get` **screen**(): [`Rectangle`](pixi_core.Rectangle.md)

Measurements of the screen. (0, 0, screenWidth, screenHeight).

Its safe to use as filterArea or hitArea for the whole stage.

**`Member`**

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[screen](../interfaces/pixi_core.IRenderer.md#screen)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:527](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L527)

___

### useContextAlpha

• `get` **useContextAlpha**(): `boolean` \| ``"notMultiplied"``

Pass-thru setting for the canvas' context `alpha` property. This is typically
not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.

**`Deprecated`**

since 7.0.0

**`Member`**

#### Returns

`boolean` \| ``"notMultiplied"``

#### Defined in

[pixijs/packages/core/src/Renderer.ts:570](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L570)

___

### view

• `get` **view**(): [`ICanvas`](../interfaces/pixi_core.ICanvas.md)

The canvas element that everything is drawn to.

#### Returns

[`ICanvas`](../interfaces/pixi_core.ICanvas.md)

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[view](../interfaces/pixi_core.IRenderer.md#view)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:516](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L516)

___

### width

• `get` **width**(): `number`

Same as view.width, actual number of pixels in the canvas by horizontal.

**`Member`**

**`Default`**

800

#### Returns

`number`

#### Implementation of

[IRenderer](../interfaces/pixi_core.IRenderer.md).[width](../interfaces/pixi_core.IRenderer.md#width)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:484](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L484)

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

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[addRunners](pixi_core.SystemManager.md#addrunners)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L55)

___

### addSystem

▸ **addSystem**(`ClassRef`, `name`): [`Renderer`](pixi_core.Renderer.md)

Add a new system to the renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ClassRef` | `ISystemConstructor`<[`Renderer`](pixi_core.Renderer.md)\> | Class reference |
| `name` | `string` | Property name for system, if not specified will use a static `name` property on the class itself. This name will be assigned as s property on the Renderer so make sure it doesn't collide with properties on Renderer. |

#### Returns

[`Renderer`](pixi_core.Renderer.md)

Return instance of renderer

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[addSystem](pixi_core.SystemManager.md#addsystem)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L72)

___

### clear

▸ **clear**(): `void`

Clear the frame buffer.

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:444](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L444)

___

### destroy

▸ **destroy**(`removeView?`): `void`

Removes everything from the renderer (event listeners, spritebatch, etc...)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `removeView?` | `boolean` | `false` | Removes the Canvas element from the DOM. See: https://github.com/pixijs/pixijs/issues/2233 |

#### Returns

`void`

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[destroy](pixi_core.SystemManager.md#destroy)

#### Defined in

[pixijs/packages/core/src/Renderer.ts:455](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L455)

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
| `runner` | [`Runner`](pixi_core.Runner.md) | the runner to target |
| `options` | `Record`<`string`, `unknown`\> | key value options for each system |

#### Returns

`void`

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[emitWithCustomOptions](pixi_core.SystemManager.md#emitwithcustomoptions)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:126](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L126)

___

### generateTexture

▸ **generateTexture**(`displayObject`, `options?`): [`RenderTexture`](pixi_core.RenderTexture.md)

Useful function that returns a texture of the display object that can then be used to create sprites
This can be quite useful if your displayObject is complicated and needs to be reused multiple times.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md) | The displayObject the object will be generated from. |
| `options?` | [`IGenerateTextureOptions`](../interfaces/pixi_core.IGenerateTextureOptions.md) | Generate texture options. |

#### Returns

[`RenderTexture`](pixi_core.RenderTexture.md)

A texture of the graphics object.

#### Defined in

[pixijs/packages/core/src/Renderer.ts:672](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L672)

___

### render

▸ **render**(`displayObject`, `options?`): `void`

Renders the object to its WebGL view.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `displayObject` | [`IRenderableObject`](../interfaces/pixi_core.IRenderableObject.md) | The object to be rendered. |
| `options?` | [`IRendererRenderOptions`](../interfaces/pixi_core.IRendererRenderOptions.md) | Object to use for render options. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:417](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L417)

___

### reset

▸ **reset**(): [`Renderer`](pixi_core.Renderer.md)

Resets the WebGL state so you can render things however you fancy!

#### Returns

[`Renderer`](pixi_core.Renderer.md)

Returns itself.

#### Defined in

[pixijs/packages/core/src/Renderer.ts:436](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L436)

___

### resize

▸ **resize**(`desiredScreenWidth`, `desiredScreenHeight`): `void`

Resizes the WebGL view to the specified width and height.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `desiredScreenWidth` | `number` | The desired width of the screen. |
| `desiredScreenHeight` | `number` | The desired height of the screen. |

#### Returns

`void`

#### Defined in

[pixijs/packages/core/src/Renderer.ts:427](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/Renderer.ts#L427)

___

### setup

▸ **setup**(`config`): `void`

Set up a system with a collection of SystemClasses and runners.
Systems are attached dynamically to this class when added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ISystemConfig`<[`Renderer`](pixi_core.Renderer.md)\> | the config for the system manager |

#### Returns

`void`

#### Inherited from

[SystemManager](pixi_core.SystemManager.md).[setup](pixi_core.SystemManager.md#setup)

#### Defined in

[pixijs/packages/core/src/system/SystemManager.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/core/src/system/SystemManager.ts#L31)
