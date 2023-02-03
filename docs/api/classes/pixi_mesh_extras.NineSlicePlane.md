---
id: "pixi_mesh_extras.NineSlicePlane"
title: "Class: NineSlicePlane"
sidebar_label: "NineSlicePlane"
custom_edit_url: null
---

[@pixi/mesh-extras](../modules/pixi_mesh_extras.md).NineSlicePlane

The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically

<pre>
     A                          B
   +---+----------------------+---+
 C | 1 |          2           | 3 |
   +---+----------------------+---+
   |   |                      |   |
   | 4 |          5           | 6 |
   |   |                      |   |
   +---+----------------------+---+
 D | 7 |          8           | 9 |
   +---+----------------------+---+
 When changing this objects width and/or height:
    areas 1 3 7 and 9 will remain unscaled.
    areas 2 and 8 will be stretched horizontally
    areas 4 and 6 will be stretched vertically
    area 5 will be stretched both horizontally and vertically
</pre>

**`Example`**

```ts
import { NineSlicePlane, Texture } from 'pixi.js';

const plane9 = new NineSlicePlane(Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
```

**`Memberof`**

PIXI

## Hierarchy

- `NineSlicePlane`

- [`SimplePlane`](pixi_mesh_extras.SimplePlane.md)

  ↳ **`NineSlicePlane`**

## Constructors

### constructor

• **new NineSlicePlane**(`texture`, `leftWidth?`, `topHeight?`, `rightWidth?`, `bottomHeight?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `texture` | `Texture`<`Resource`\> | `undefined` | The texture to use on the NineSlicePlane. |
| `leftWidth?` | `number` | `DEFAULT_BORDER_SIZE` | size of the left vertical bar (A) |
| `topHeight?` | `number` | `DEFAULT_BORDER_SIZE` | size of the top horizontal bar (C) |
| `rightWidth?` | `number` | `DEFAULT_BORDER_SIZE` | size of the right vertical bar (B) |
| `bottomHeight?` | `number` | `DEFAULT_BORDER_SIZE` | size of the bottom horizontal bar (D) |

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[constructor](pixi_mesh_extras.SimplePlane.md#constructor)

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L74)

## Properties

### \_accessibleActive

• `Optional` **\_accessibleActive**: `boolean`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_accessibleActive](pixi_mesh_extras.SimplePlane.md#_accessibleactive)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L21)

___

### \_accessibleDiv

• `Optional` **\_accessibleDiv**: `IAccessibleHTMLElement`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_accessibleDiv](pixi_mesh_extras.SimplePlane.md#_accessiblediv)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L22)

___

### \_bounds

• **\_bounds**: `Bounds`

The bounds object, this is used to calculate and store the bounds of the displayObject.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_bounds](pixi_mesh_extras.SimplePlane.md#_bounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L299)

___

### \_cacheAsBitmap

• **\_cacheAsBitmap**: `boolean`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cacheAsBitmap](pixi_mesh_extras.SimplePlane.md#_cacheasbitmap)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L10)

___

### \_cacheAsBitmapMultisample

• **\_cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cacheAsBitmapMultisample](pixi_mesh_extras.SimplePlane.md#_cacheasbitmapmultisample)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L9)

___

### \_cacheAsBitmapResolution

• **\_cacheAsBitmapResolution**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cacheAsBitmapResolution](pixi_mesh_extras.SimplePlane.md#_cacheasbitmapresolution)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L8)

___

### \_cacheData

• **\_cacheData**: `CacheData`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cacheData](pixi_mesh_extras.SimplePlane.md#_cachedata)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L11)

___

### \_cachedTexture

• **\_cachedTexture**: `Texture`<`Resource`\>

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cachedTexture](pixi_mesh_extras.SimplePlane.md#_cachedtexture)

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L10)

___

### \_cachedTint

• **\_cachedTint**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cachedTint](pixi_mesh_extras.SimplePlane.md#_cachedtint)

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L8)

___

### \_canvasPadding

• **\_canvasPadding**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_canvasPadding](pixi_mesh_extras.SimplePlane.md#_canvaspadding)

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L6)

___

### \_canvasUvs

• **\_canvasUvs**: `number`[]

#### Inherited from

GlobalMixins.NineSlicePlane.\_canvasUvs

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L22)

___

### \_localBounds

• **\_localBounds**: `Bounds`

Local bounds object, swapped with `_bounds` when using `getLocalBounds()`.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_localBounds](pixi_mesh_extras.SimplePlane.md#_localbounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:302](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L302)

___

### \_texture

• **\_texture**: `Texture`<`Resource`\>

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_texture](pixi_mesh_extras.SimplePlane.md#_texture)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L95)

___

### \_tintRGB

• **\_tintRGB**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_tintRGB](pixi_mesh_extras.SimplePlane.md#_tintrgb)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L94)

___

### \_tintedCanvas

• **\_tintedCanvas**: `HTMLImageElement` \| `ICanvas`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_tintedCanvas](pixi_mesh_extras.SimplePlane.md#_tintedcanvas)

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L9)

___

### accessible

• `Optional` **accessible**: `boolean`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessible](pixi_mesh_extras.SimplePlane.md#accessible)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L17)

___

### accessibleChildren

• `Optional` **accessibleChildren**: `boolean`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessibleChildren](pixi_mesh_extras.SimplePlane.md#accessiblechildren)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L25)

___

### accessibleHint

• `Optional` **accessibleHint**: `string`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessibleHint](pixi_mesh_extras.SimplePlane.md#accessiblehint)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L19)

___

### accessiblePointerEvents

• `Optional` **accessiblePointerEvents**: `PointerEvents`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessiblePointerEvents](pixi_mesh_extras.SimplePlane.md#accessiblepointerevents)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L24)

___

### accessibleTitle

• `Optional` **accessibleTitle**: `string`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessibleTitle](pixi_mesh_extras.SimplePlane.md#accessibletitle)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L18)

___

### accessibleType

• `Optional` **accessibleType**: `string`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[accessibleType](pixi_mesh_extras.SimplePlane.md#accessibletype)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L23)

___

### alpha

• **alpha**: `number`

The opacity of the object.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[alpha](pixi_mesh_extras.SimplePlane.md#alpha)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L232)

___

### autoResize

• **autoResize**: `boolean`

The geometry is automatically updated when the texture size changes.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[autoResize](pixi_mesh_extras.SimplePlane.md#autoresize)

#### Defined in

[pixijs/packages/mesh-extras/src/SimplePlane.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/SimplePlane.ts#L22)

___

### cacheAsBitmap

• **cacheAsBitmap**: `boolean`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cacheAsBitmap](pixi_mesh_extras.SimplePlane.md#cacheasbitmap)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L5)

___

### cacheAsBitmapMultisample

• **cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cacheAsBitmapMultisample](pixi_mesh_extras.SimplePlane.md#cacheasbitmapmultisample)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L7)

___

### cacheAsBitmapResolution

• **cacheAsBitmapResolution**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cacheAsBitmapResolution](pixi_mesh_extras.SimplePlane.md#cacheasbitmapresolution)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L6)

___

### canvasPadding

• **canvasPadding**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[canvasPadding](pixi_mesh_extras.SimplePlane.md#canvaspadding)

#### Defined in

[pixijs/packages/canvas-mesh/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-mesh/global.d.ts#L7)

___

### children

• `Readonly` **children**: `DisplayObject`[]

The array of children of this container.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[children](pixi_mesh_extras.SimplePlane.md#children)

#### Defined in

[pixijs/packages/display/src/Container.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L71)

___

### containerUpdateTransform

• **containerUpdateTransform**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[containerUpdateTransform](pixi_mesh_extras.SimplePlane.md#containerupdatetransform)

#### Defined in

[pixijs/packages/display/src/Container.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L94)

___

### cullArea

• **cullArea**: `Rectangle`

If set, this shape is used for culling instead of the bounds of this object.
It can improve the culling performance of objects with many children.
The culling area is defined in local space.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cullArea](pixi_mesh_extras.SimplePlane.md#cullarea)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L262)

___

### cullable

• **cullable**: `boolean`

Should this object be rendered if the bounds of this object are out of frame?

Culling has no effect on whether updateTransform is called.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cullable](pixi_mesh_extras.SimplePlane.md#cullable)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:255](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L255)

___

### cursor

• **cursor**: `string`

The cursor preferred when the mouse pointer is hovering over.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[cursor](pixi_mesh_extras.SimplePlane.md#cursor)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L62)

___

### displayObjectUpdateTransform

• **displayObjectUpdateTransform**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[displayObjectUpdateTransform](pixi_mesh_extras.SimplePlane.md#displayobjectupdatetransform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:332](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L332)

___

### drawMode

• **drawMode**: `DRAW_MODES`

The way the Mesh should be drawn, can be any of the PIXI.DRAW_MODES constants.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[drawMode](pixi_mesh_extras.SimplePlane.md#drawmode)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L53)

___

### filterArea

• **filterArea**: `Rectangle`

The area the filter is applied to. This is used as more of an optimization
rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.

Also works as an interaction mask.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[filterArea](pixi_mesh_extras.SimplePlane.md#filterarea)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L270)

___

### filters

• **filters**: `Filter`[]

Sets the filters for the displayObject.
IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
To remove filters simply set this property to `'null'`.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[filters](pixi_mesh_extras.SimplePlane.md#filters)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L277)

___

### hitArea

• **hitArea**: `IHitArea`

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[hitArea](pixi_mesh_extras.SimplePlane.md#hitarea)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[interactive](pixi_mesh_extras.SimplePlane.md#interactive)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[interactiveChildren](pixi_mesh_extras.SimplePlane.md#interactivechildren)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### isMask

• **isMask**: `boolean`

Does any other displayObject use this object as a mask?

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[isMask](pixi_mesh_extras.SimplePlane.md#ismask)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L283)

___

### isSprite

• **isSprite**: `boolean`

Used to fast check if a sprite is.. a sprite!

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[isSprite](pixi_mesh_extras.SimplePlane.md#issprite)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:280](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L280)

___

### name

• **name**: `string`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[name](pixi_mesh_extras.SimplePlane.md#name)

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L5)

___

### onclick

• **onclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'click' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onclick](pixi_mesh_extras.SimplePlane.md#onclick)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mousedown' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmousedown](pixi_mesh_extras.SimplePlane.md#onmousedown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseenter' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseenter](pixi_mesh_extras.SimplePlane.md#onmouseenter)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseleave' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseleave](pixi_mesh_extras.SimplePlane.md#onmouseleave)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmousemove](pixi_mesh_extras.SimplePlane.md#onmousemove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseout' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseout](pixi_mesh_extras.SimplePlane.md#onmouseout)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseover](pixi_mesh_extras.SimplePlane.md#onmouseover)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseup' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseup](pixi_mesh_extras.SimplePlane.md#onmouseup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseupoutside' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onmouseupoutside](pixi_mesh_extras.SimplePlane.md#onmouseupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointercancel' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointercancel](pixi_mesh_extras.SimplePlane.md#onpointercancel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerdown' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerdown](pixi_mesh_extras.SimplePlane.md#onpointerdown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerenter' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerenter](pixi_mesh_extras.SimplePlane.md#onpointerenter)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerleave' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerleave](pixi_mesh_extras.SimplePlane.md#onpointerleave)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointermove' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointermove](pixi_mesh_extras.SimplePlane.md#onpointermove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerout' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerout](pixi_mesh_extras.SimplePlane.md#onpointerout)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerover' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerover](pixi_mesh_extras.SimplePlane.md#onpointerover)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointertap' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointertap](pixi_mesh_extras.SimplePlane.md#onpointertap)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerup' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerup](pixi_mesh_extras.SimplePlane.md#onpointerup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerupoutside' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onpointerupoutside](pixi_mesh_extras.SimplePlane.md#onpointerupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightclick' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onrightclick](pixi_mesh_extras.SimplePlane.md#onrightclick)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightdown' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onrightdown](pixi_mesh_extras.SimplePlane.md#onrightdown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightup' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onrightup](pixi_mesh_extras.SimplePlane.md#onrightup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightupoutside' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onrightupoutside](pixi_mesh_extras.SimplePlane.md#onrightupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'tap' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontap](pixi_mesh_extras.SimplePlane.md#ontap)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchcancel' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontouchcancel](pixi_mesh_extras.SimplePlane.md#ontouchcancel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchend' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontouchend](pixi_mesh_extras.SimplePlane.md#ontouchend)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchendoutside' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontouchendoutside](pixi_mesh_extras.SimplePlane.md#ontouchendoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchmove' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontouchmove](pixi_mesh_extras.SimplePlane.md#ontouchmove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchstart' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[ontouchstart](pixi_mesh_extras.SimplePlane.md#ontouchstart)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: `FederatedEventHandler`<`FederatedWheelEvent`\>

Handler for 'wheel' event

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[onwheel](pixi_mesh_extras.SimplePlane.md#onwheel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

___

### parent

• **parent**: `Container`<`DisplayObject`\>

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[parent](pixi_mesh_extras.SimplePlane.md#parent)

#### Defined in

[pixijs/packages/display/src/Container.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L93)

___

### renderId

• `Optional` **renderId**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[renderId](pixi_mesh_extras.SimplePlane.md#renderid)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L26)

___

### renderable

• **renderable**: `boolean`

Can this object be rendered, if false the object will not be drawn but the updateTransform
methods will still be called.

Only affects recursive calls from parent. You can ask for bounds manually.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[renderable](pixi_mesh_extras.SimplePlane.md#renderable)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L248)

___

### shader

• **shader**: `MeshMaterial`

Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
Can be shared between multiple Mesh objects.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[shader](pixi_mesh_extras.SimplePlane.md#shader)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L44)

___

### size

• **size**: `number`

How much of the geometry to draw, by default `0` renders everything.

**`Default`**

0

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[size](pixi_mesh_extras.SimplePlane.md#size)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L65)

___

### sortDirty

• **sortDirty**: `boolean`

Should children be sorted by zIndex at the next updateTransform call.

Will get automatically set to true if a new child is added, or if a child's zIndex changes.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[sortDirty](pixi_mesh_extras.SimplePlane.md#sortdirty)

#### Defined in

[pixijs/packages/display/src/Container.ts:92](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L92)

___

### sortableChildren

• **sortableChildren**: `boolean`

If set to true, the container will sort its children by `zIndex` value
when `updateTransform()` is called, or manually if `sortChildren()` is called.

This actually changes the order of elements in the array, so should be treated
as a basic solution that is not performant compared to other solutions,
such as [PixiJS Layers](https://github.com/pixijs/layers)

Also be aware of that this may not work nicely with the `addChildAt()` function,
as the `zIndex` sorting may cause the child to automatically sorted to another position.

**`See`**

PIXI.Container.defaultSortableChildren

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[sortableChildren](pixi_mesh_extras.SimplePlane.md#sortablechildren)

#### Defined in

[pixijs/packages/display/src/Container.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L85)

___

### start

• **start**: `number`

Typically the index of the IndexBuffer where to start drawing.

**`Default`**

0

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[start](pixi_mesh_extras.SimplePlane.md#start)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L59)

___

### state

• **state**: `State`

Represents the WebGL state the Mesh required to render, excludes shader and geometry. E.g.,
blend mode, culling, depth testing, direction of rendering triangles, backface, etc.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[state](pixi_mesh_extras.SimplePlane.md#state)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L50)

___

### tabIndex

• `Optional` **tabIndex**: `number`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[tabIndex](pixi_mesh_extras.SimplePlane.md#tabindex)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L20)

___

### transform

• **transform**: `Transform`

World transform and local transform of this object.
This will become read-only later, please do not assign anything there unless you know what are you doing.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[transform](pixi_mesh_extras.SimplePlane.md#transform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:229](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L229)

___

### visible

• **visible**: `boolean`

The visibility of the object. If false the object will not be drawn, and
the updateTransform function will not be called.

Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[visible](pixi_mesh_extras.SimplePlane.md#visible)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L240)

___

### worldAlpha

• `Readonly` **worldAlpha**: `number`

The multiplied alpha of the displayObject.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[worldAlpha](pixi_mesh_extras.SimplePlane.md#worldalpha)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L223)

___

### BATCHABLE\_SIZE

▪ `Static` **BATCHABLE\_SIZE**: `number` = `100`

The maximum number of vertices to consider batchable. Generally, the complexity of the geometry.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[BATCHABLE_SIZE](pixi_mesh_extras.SimplePlane.md#batchable_size)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:485](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L485)

___

### defaultSortableChildren

▪ `Static` **defaultSortableChildren**: `boolean` = `false`

Sets the default value for the container property `sortableChildren`.
If set to true, the container will sort its children by zIndex value
when `updateTransform()` is called, or manually if `sortChildren()` is called.

This actually changes the order of elements in the array, so should be treated
as a basic solution that is not performant compared to other solutions,
such as [PixiJS Layers](https://github.com/pixijs/layers).

Also be aware of that this may not work nicely with the `addChildAt()` function,
as the `zIndex` sorting may cause the child to automatically sorted to another position.

**`Static`**

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[defaultSortableChildren](pixi_mesh_extras.SimplePlane.md#defaultsortablechildren)

#### Defined in

[pixijs/packages/display/src/Container.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L65)

## Accessors

### angle

• `get` **angle**(): `number`

The angle of the object in degrees.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:894](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L894)

• `set` **angle**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:899](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L899)

___

### blendMode

• `get` **blendMode**(): `BLEND_MODES`

#### Returns

`BLEND_MODES`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:202](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L202)

• `set` **blendMode**(`value`): `void`

The blend mode to be applied to the Mesh. Apply a value of
`PIXI.BLEND_MODES.NORMAL` to reset the blend mode.

**`Default`**

PIXI.BLEND_MODES.NORMAL;

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BLEND_MODES` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:197](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L197)

___

### bottomHeight

• `get` **bottomHeight**(): `number`

The height of the bottom row.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:220](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L220)

• `set` **bottomHeight**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:225](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L225)

___

### destroyed

• `get` **destroyed**(): `boolean`

Readonly flag for destroyed display objects.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:419](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L419)

___

### geometry

• `get` **geometry**(): `Geometry`

Includes vertex positions, face indices, normals, colors, UVs, and
custom attributes within buffers, reducing the cost of passing all
this data to the GPU. Can be shared between multiple Mesh objects.

#### Returns

`Geometry`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L130)

• `set` **geometry**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Geometry` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L135)

___

### height

• `get` **height**(): `number`

The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:172](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L172)

• `set` **height**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:177](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L177)

___

### leftWidth

• `get` **leftWidth**(): `number`

The width of the left column.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:184](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L184)

• `set` **leftWidth**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:189](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L189)

___

### localTransform

• `get` **localTransform**(): `Matrix`

Current transform of the object based on local factors: position, scale, other stuff.

#### Returns

`Matrix`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:810](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L810)

___

### mask

• `get` **mask**(): `MaskData` \| `Container`<`DisplayObject`\>

Sets a mask for the displayObject. A mask is an object that limits the visibility of an
object to the shape of the mask applied to it. In PixiJS a regular mask must be a
PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it
utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
To remove a mask, set this property to `null`.

For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.

**`Example`**

```ts
import { Graphics, Sprite } from 'pixi.js';

const graphics = new Graphics();
graphics.beginFill(0xFF3300);
graphics.drawRect(50, 250, 100, 100);
graphics.endFill();

const sprite = new Sprite(texture);
sprite.mask = graphics;
```

**`Todo`**

At the moment, CanvasRenderer doesn't support Sprite as mask.

#### Returns

`MaskData` \| `Container`<`DisplayObject`\>

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:968](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L968)

• `set` **mask**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `MaskData` \| `Container`<`DisplayObject`\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:973](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L973)

___

### material

• `get` **material**(): `T`

#### Returns

`T`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:187](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L187)

• `set` **material**(`value`): `void`

Alias for PIXI.Mesh#shader.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:182](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L182)

___

### pivot

• `get` **pivot**(): `ObservablePoint`<`any`\>

The center of rotation, scaling, and skewing for this display object in its local space. The `position`
is the projection of `pivot` in the parent's local space.

By default, the pivot is the origin (0, 0).

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:852](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L852)

• `set` **pivot**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:857](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L857)

___

### position

• `get` **position**(): `ObservablePoint`<`any`\>

The coordinate of the object relative to the local coordinates of the parent.

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:819](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L819)

• `set` **position**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:824](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L824)

___

### rightWidth

• `get` **rightWidth**(): `number`

The width of the right column.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:196](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L196)

• `set` **rightWidth**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:201](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L201)

___

### rotation

• `get` **rotation**(): `number`

The rotation of the object in radians.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:880](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L880)

• `set` **rotation**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:885](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L885)

___

### roundPixels

• `get` **roundPixels**(): `boolean`

#### Returns

`boolean`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L223)

• `set` **roundPixels**(`value`): `void`

If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
Advantages can include sharper image quality (like text) and faster rendering on canvas.
The main disadvantage is movement of objects may appear less smooth.
To set the global default, change PIXI.settings.ROUND_PIXELS

**`Default`**

false

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L214)

___

### scale

• `get` **scale**(): `ObservablePoint`<`any`\>

The scale factors of this object along the local coordinate axes.

The default scale is (1, 1).

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:835](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L835)

• `set` **scale**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:840](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L840)

___

### skew

• `get` **skew**(): `ObservablePoint`<`any`\>

The skew factor for the object in radians.

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:866](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L866)

• `set` **skew**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:871](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L871)

___

### texture

• `get` **texture**(): `Texture`<`Resource`\>

#### Returns

`Texture`<`Resource`\>

#### Defined in

[pixijs/packages/mesh-extras/src/SimplePlane.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/SimplePlane.ts#L86)

• `set` **texture**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Texture`<`Resource`\> |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/SimplePlane.ts:62](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/SimplePlane.ts#L62)

___

### tint

• `get` **tint**(): `number`

The multiply tint applied to the Mesh. This is a hex value. A value of
`0xFFFFFF` will remove any tint effect.

Null for non-MeshMaterial shaders

**`Default`**

0xFFFFFF

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:235](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L235)

• `set` **tint**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L240)

___

### topHeight

• `get` **topHeight**(): `number`

The height of the top row.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:208](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L208)

• `set` **topHeight**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:213](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L213)

___

### uvBuffer

• `get` **uvBuffer**(): `Buffer`

To change mesh uv's, change its uvBuffer data and increment its _updateID.

#### Returns

`Buffer`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:166](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L166)

___

### vertices

• `get` **vertices**(): `ITypedArray`

#### Returns

`ITypedArray`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:108](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L108)

• `set` **vertices**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `ITypedArray` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L113)

___

### verticesBuffer

• `get` **verticesBuffer**(): `Buffer`

To change mesh vertices, change its uvBuffer data and increment its _updateID.
Incrementing _updateID is optional because most of Mesh objects do it anyway.

#### Returns

`Buffer`

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:176](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L176)

___

### width

• `get` **width**(): `number`

The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane.

#### Returns

`number`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L160)

• `set` **width**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:165](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L165)

___

### worldTransform

• `get` **worldTransform**(): `Matrix`

Current transform of the object based on world (parent) factors.

#### Returns

`Matrix`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:801](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L801)

___

### worldVisible

• `get` **worldVisible**(): `boolean`

Indicates if the object is globally visible.

#### Returns

`boolean`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:930](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L930)

___

### x

• `get` **x**(): `number`

The position of the displayObject on the x axis relative to the local coordinates of the parent.
An alias to position.x

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:773](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L773)

• `set` **x**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:778](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L778)

___

### y

• `get` **y**(): `number`

The position of the displayObject on the y axis relative to the local coordinates of the parent.
An alias to position.y

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:787](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L787)

• `set` **y**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:792](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L792)

___

### zIndex

• `get` **zIndex**(): `number`

The zIndex of the displayObject.

If a container has the sortableChildren property set to true, children will be automatically
sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
and thus rendered on top of other display objects within the same container.

**`See`**

PIXI.Container#sortableChildren

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:912](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L912)

• `set` **zIndex**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:917](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L917)

## Methods

### \_cacheAsBitmapDestroy

▸ **_cacheAsBitmapDestroy**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `boolean` \| `IDestroyOptions` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_cacheAsBitmapDestroy](pixi_mesh_extras.SimplePlane.md#_cacheasbitmapdestroy)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L19)

___

### \_calculateCachedBounds

▸ **_calculateCachedBounds**(): `void`

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_calculateCachedBounds](pixi_mesh_extras.SimplePlane.md#_calculatecachedbounds)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L14)

___

### \_destroyCachedDisplayObject

▸ **_destroyCachedDisplayObject**(): `void`

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_destroyCachedDisplayObject](pixi_mesh_extras.SimplePlane.md#_destroycacheddisplayobject)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L18)

___

### \_getCachedLocalBounds

▸ **_getCachedLocalBounds**(): `Rectangle`

#### Returns

`Rectangle`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_getCachedLocalBounds](pixi_mesh_extras.SimplePlane.md#_getcachedlocalbounds)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L15)

___

### \_initCachedDisplayObject

▸ **_initCachedDisplayObject**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_initCachedDisplayObject](pixi_mesh_extras.SimplePlane.md#_initcacheddisplayobject)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L13)

___

### \_initCachedDisplayObjectCanvas

▸ **_initCachedDisplayObjectCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_initCachedDisplayObjectCanvas](pixi_mesh_extras.SimplePlane.md#_initcacheddisplayobjectcanvas)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L17)

___

### \_render

▸ **_render**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_render](pixi_mesh_extras.SimplePlane.md#_render)

#### Defined in

[pixijs/packages/mesh-extras/src/SimplePlane.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/SimplePlane.ts#L91)

___

### \_renderCached

▸ **_renderCached**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_renderCached](pixi_mesh_extras.SimplePlane.md#_rendercached)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L12)

___

### \_renderCachedCanvas

▸ **_renderCachedCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_renderCachedCanvas](pixi_mesh_extras.SimplePlane.md#_rendercachedcanvas)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L16)

___

### \_renderCanvas

▸ **_renderCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[_renderCanvas](pixi_mesh_extras.SimplePlane.md#_rendercanvas)

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L10)

___

### addChild

▸ **addChild**<`U`\>(`...children`): `U`[``0``]

Adds one or more children to the container.

Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to add to the container |

#### Returns

`U`[``0``]

- The first child that was added.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[addChild](pixi_mesh_extras.SimplePlane.md#addchild)

#### Defined in

[pixijs/packages/display/src/Container.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L140)

___

### addChildAt

▸ **addChildAt**<`U`\>(`child`, `index`): `U`

Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`<`U`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `U` | The child to add |
| `index` | `number` | The index to place the child in |

#### Returns

`U`

The child that was added.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[addChildAt](pixi_mesh_extras.SimplePlane.md#addchildat)

#### Defined in

[pixijs/packages/display/src/Container.ts:188](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L188)

___

### calculateBounds

▸ **calculateBounds**(): `void`

Recalculates the bounds of the container.

This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
is limited to its mask's bounds or filterArea, if any is applied.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[calculateBounds](pixi_mesh_extras.SimplePlane.md#calculatebounds)

#### Defined in

[pixijs/packages/display/src/Container.ts:459](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L459)

___

### calculateUvs

▸ **calculateUvs**(): `void`

Updates uv field based on from geometry uv's or batchUvs.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[calculateUvs](pixi_mesh_extras.SimplePlane.md#calculateuvs)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:392](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L392)

___

### calculateVertices

▸ **calculateVertices**(): `void`

Updates vertexData field based on transform and vertices.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[calculateVertices](pixi_mesh_extras.SimplePlane.md#calculatevertices)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:340](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L340)

___

### containsPoint

▸ **containsPoint**(`point`): `boolean`

Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `point` | `IPointData` | The point to test. |

#### Returns

`boolean`

- The result of the test.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[containsPoint](pixi_mesh_extras.SimplePlane.md#containspoint)

#### Defined in

[pixijs/packages/mesh/src/Mesh.ts:428](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh/src/Mesh.ts#L428)

___

### destroy

▸ **destroy**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `boolean` \| `IDestroyOptions` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[destroy](pixi_mesh_extras.SimplePlane.md#destroy)

#### Defined in

[pixijs/packages/mesh-extras/src/SimplePlane.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/SimplePlane.ts#L101)

___

### disableTempParent

▸ **disableTempParent**(`cacheParent`): `void`

Pair method for `enableTempParent`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheParent` | `Container`<`DisplayObject`\> | Actual parent of element |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[disableTempParent](pixi_mesh_extras.SimplePlane.md#disabletempparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:764](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L764)

___

### enableTempParent

▸ **enableTempParent**(): `Container`<`DisplayObject`\>

Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root.

```js
const cacheParent = elem.enableTempParent();
elem.updateTransform();
elem.disableTempParent(cacheParent);
```

#### Returns

`Container`<`DisplayObject`\>

- Current parent

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[enableTempParent](pixi_mesh_extras.SimplePlane.md#enabletempparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:751](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L751)

___

### getBounds

▸ **getBounds**(`skipUpdate?`, `rect?`): `Rectangle`

Calculates and returns the (world) bounds of the display object as a [Rectangle]PIXI.Rectangle.

This method is expensive on containers with a large subtree (like the stage). This is because the bounds
of a container depend on its children's bounds, which recursively causes all bounds in the subtree to
be recalculated. The upside, however, is that calling `getBounds` once on a container will indeed update
the bounds of all children (the whole subtree, in fact). This side effect should be exploited by using
`displayObject._bounds.getRectangle()` when traversing through all the bounds in a scene graph. Otherwise,
calling `getBounds` on each object in a subtree will cause the total cost to increase quadratically as
its height increases.

The transforms of all objects in a container's **subtree** and of all **ancestors** are updated.
The world bounds of all display objects in a container's **subtree** will also be recalculated.

The `_bounds` object stores the last calculation of the bounds. You can use to entirely skip bounds
calculation if needed.

```js
const lastCalculatedBounds = displayObject._bounds.getRectangle(optionalRect);
```

Do know that usage of `getLocalBounds` can corrupt the `_bounds` of children (the whole subtree, actually). This
is a known issue that has not been solved. See [getLocalBounds]PIXI.DisplayObject#getLocalBounds for more
details.

`getBounds` should be called with `skipUpdate` equal to `true` in a render() call. This is because the transforms
are guaranteed to be update-to-date. In fact, recalculating inside a render() call may cause corruption in certain
cases.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `skipUpdate?` | `boolean` | Setting to `true` will stop the transforms of the scene graph from being updated. This means the calculation returned MAY be out of date BUT will give you a nice performance boost. |
| `rect?` | `Rectangle` | Optional rectangle to store the result of the bounds calculation. |

#### Returns

`Rectangle`

- The minimum axis-aligned rectangle in world space that fits around this object.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getBounds](pixi_mesh_extras.SimplePlane.md#getbounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:493](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L493)

___

### getChildAt

▸ **getChildAt**(`index`): `DisplayObject`

Returns the child at the specified index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child at |

#### Returns

`DisplayObject`

- The child at the given index, if any.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getChildAt](pixi_mesh_extras.SimplePlane.md#getchildat)

#### Defined in

[pixijs/packages/display/src/Container.ts:281](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L281)

___

### getChildByName

▸ **getChildByName**<`T`\>(`name`, `deep?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `DisplayObject`<`T`\> = `DisplayObject` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `deep?` | `boolean` |

#### Returns

`T`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getChildByName](pixi_mesh_extras.SimplePlane.md#getchildbyname)

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L10)

___

### getChildIndex

▸ **getChildIndex**(`child`): `number`

Returns the index position of a child DisplayObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | The DisplayObject instance to identify |

#### Returns

`number`

- The index position of the child display object to identify

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getChildIndex](pixi_mesh_extras.SimplePlane.md#getchildindex)

#### Defined in

[pixijs/packages/display/src/Container.ts:244](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L244)

___

### getGlobalPosition

▸ **getGlobalPosition**(`point?`, `skipUpdate?`): `Point`

#### Parameters

| Name | Type |
| :------ | :------ |
| `point?` | `Point` |
| `skipUpdate?` | `boolean` |

#### Returns

`Point`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getGlobalPosition](pixi_mesh_extras.SimplePlane.md#getglobalposition)

#### Defined in

[pixijs/packages/mixin-get-global-position/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-global-position/global.d.ts#L5)

___

### getLocalBounds

▸ **getLocalBounds**(`rect?`, `skipChildrenUpdate?`): `Rectangle`

Retrieves the local bounds of the displayObject as a rectangle object.

Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `rect?` | `Rectangle` | `undefined` | Optional rectangle to store the result of the bounds calculation. |
| `skipChildrenUpdate` | `boolean` | `false` | Setting to `true` will stop re-calculation of children transforms, it was default behaviour of pixi 4.0-5.2 and caused many problems to users. |

#### Returns

`Rectangle`

- The rectangular bounding area.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[getLocalBounds](pixi_mesh_extras.SimplePlane.md#getlocalbounds)

#### Defined in

[pixijs/packages/display/src/Container.ts:515](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L515)

___

### removeChild

▸ **removeChild**<`U`\>(`...children`): `U`[``0``]

Removes one or more children from the container.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `DisplayObject`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to remove |

#### Returns

`U`[``0``]

The first child that was removed.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[removeChild](pixi_mesh_extras.SimplePlane.md#removechild)

#### Defined in

[pixijs/packages/display/src/Container.ts:296](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L296)

___

### removeChildAt

▸ **removeChildAt**(`index`): `DisplayObject`

Removes a child from the specified index position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child from |

#### Returns

`DisplayObject`

The child that was removed.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[removeChildAt](pixi_mesh_extras.SimplePlane.md#removechildat)

#### Defined in

[pixijs/packages/display/src/Container.ts:336](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L336)

___

### removeChildren

▸ **removeChildren**(`beginIndex?`, `endIndex?`): `DisplayObject`[]

Removes all children from this container that are within the begin and end indexes.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `beginIndex` | `number` | `0` | The beginning position. |
| `endIndex` | `number` | `undefined` | The ending position. Default value is size of the container. |

#### Returns

`DisplayObject`[]

- List of removed children

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[removeChildren](pixi_mesh_extras.SimplePlane.md#removechildren)

#### Defined in

[pixijs/packages/display/src/Container.ts:362](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L362)

___

### removeFromParent

▸ **removeFromParent**(): `void`

Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[removeFromParent](pixi_mesh_extras.SimplePlane.md#removefromparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:663](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L663)

___

### render

▸ **render**(`renderer`): `void`

Renders the object using the WebGL renderer.

The [_render]PIXI.Container#_render method is be overriden for rendering the contents of the
container itself. This `render` method will invoke it, and also invoke the `render` methods of all
children afterward.

If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
the bounds of this object are out of frame, this implementation will entirely skip rendering.
See PIXI.DisplayObject for choosing between `renderable` or `visible`. Generally,
setting alpha to zero is not recommended for purely skipping rendering.

When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
advised to employ **culling** to automatically skip rendering objects outside of the current screen.
See [cullable]PIXI.DisplayObject#cullable and [cullArea]PIXI.DisplayObject#cullArea.
Other culling methods might be better suited for a large number static objects; see
[@pixi-essentials/cull][https://www.npmjs.com/package/@pixi-essentials/cull](https://www.npmjs.com/package/@pixi-essentials/cull) and
[pixi-cull][https://www.npmjs.com/package/pixi-cull](https://www.npmjs.com/package/pixi-cull).

The [renderAdvanced]PIXI.Container#renderAdvanced method is internally used when when masking or
filtering is applied on a container. This does, however, break batching and can affect performance when
masking and filtering is applied extensively throughout the scene graph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | The renderer |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[render](pixi_mesh_extras.SimplePlane.md#render)

#### Defined in

[pixijs/packages/display/src/Container.ts:649](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L649)

___

### renderCanvas

▸ `Optional` **renderCanvas**(`renderer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `CanvasRenderer` |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[renderCanvas](pixi_mesh_extras.SimplePlane.md#rendercanvas)

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L5)

___

### setChildIndex

▸ **setChildIndex**(`child`, `index`): `void`

Changes the position of an existing child in the display object container

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | The child DisplayObject instance for which you want to change the index number |
| `index` | `number` | The resulting index number for the child display object |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[setChildIndex](pixi_mesh_extras.SimplePlane.md#setchildindex)

#### Defined in

[pixijs/packages/display/src/Container.ts:261](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L261)

___

### setParent

▸ **setParent**(`container`): `Container`<`DisplayObject`\>

Set the parent Container of this DisplayObject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | `Container`<`DisplayObject`\> | The Container to add this DisplayObject to. |

#### Returns

`Container`<`DisplayObject`\>

- The Container that this DisplayObject was added to.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[setParent](pixi_mesh_extras.SimplePlane.md#setparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:650](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L650)

___

### setTransform

▸ **setTransform**(`x?`, `y?`, `scaleX?`, `scaleY?`, `rotation?`, `skewX?`, `skewY?`, `pivotX?`, `pivotY?`): [`NineSlicePlane`](pixi_mesh_extras.NineSlicePlane.md)

Convenience function to set the position, scale, skew and pivot at once.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `0` | The X position |
| `y` | `number` | `0` | The Y position |
| `scaleX` | `number` | `1` | The X scale value |
| `scaleY` | `number` | `1` | The Y scale value |
| `rotation` | `number` | `0` | The rotation |
| `skewX` | `number` | `0` | The X skew value |
| `skewY` | `number` | `0` | The Y skew value |
| `pivotX` | `number` | `0` | The X pivot value |
| `pivotY` | `number` | `0` | The Y pivot value |

#### Returns

[`NineSlicePlane`](pixi_mesh_extras.NineSlicePlane.md)

- The DisplayObject instance

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[setTransform](pixi_mesh_extras.SimplePlane.md#settransform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:681](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L681)

___

### sortChildren

▸ **sortChildren**(): `void`

Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[sortChildren](pixi_mesh_extras.SimplePlane.md#sortchildren)

#### Defined in

[pixijs/packages/display/src/Container.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L403)

___

### swapChildren

▸ **swapChildren**(`child`, `child2`): `void`

Swaps the position of 2 Display Objects within this container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `DisplayObject` | First display object to swap |
| `child2` | `DisplayObject` | Second display object to swap |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[swapChildren](pixi_mesh_extras.SimplePlane.md#swapchildren)

#### Defined in

[pixijs/packages/display/src/Container.ts:224](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L224)

___

### textureUpdated

▸ **textureUpdated**(): `void`

Method used for overrides, to do something in case texture frame was changed.
Meshes based on plane can override it and change more details based on texture.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[textureUpdated](pixi_mesh_extras.SimplePlane.md#textureupdated)

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:102](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L102)

___

### toGlobal

▸ **toGlobal**<`P`\>(`position`, `point?`, `skipUpdate?`): `P`

Calculates the global position of the display object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `IPointData` = `Point` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `position` | `IPointData` | `undefined` | The world origin to calculate from. |
| `point?` | `P` | `undefined` | A Point object in which to store the value, optional (otherwise will create a new Point). |
| `skipUpdate` | `boolean` | `false` | Should we skip the update transform. |

#### Returns

`P`

- A point object representing the position of this object.

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[toGlobal](pixi_mesh_extras.SimplePlane.md#toglobal)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:581](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L581)

___

### toLocal

▸ **toLocal**<`P`\>(`position`, `from?`, `point?`, `skipUpdate?`): `P`

Calculates the local position of the display object relative to another point.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `IPointData` = `Point` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `IPointData` | The world origin to calculate from. |
| `from?` | `DisplayObject` | The DisplayObject to calculate the global position from. |
| `point?` | `P` | A Point object in which to store the value, optional (otherwise will create a new Point). |
| `skipUpdate?` | `boolean` | Should we skip the update transform |

#### Returns

`P`

- A point object representing the position of this object

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[toLocal](pixi_mesh_extras.SimplePlane.md#tolocal)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:615](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L615)

___

### updateHorizontalVertices

▸ **updateHorizontalVertices**(): `void`

Updates the horizontal vertices.

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L119)

___

### updateTransform

▸ **updateTransform**(): `void`

Updates the transform on all children of this container for rendering.

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[updateTransform](pixi_mesh_extras.SimplePlane.md#updatetransform)

#### Defined in

[pixijs/packages/display/src/Container.ts:428](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L428)

___

### updateVerticalVertices

▸ **updateVerticalVertices**(): `void`

Updates the vertical vertices.

#### Returns

`void`

#### Defined in

[pixijs/packages/mesh-extras/src/NineSlicePlane.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mesh-extras/src/NineSlicePlane.ts#L131)

___

### mixin

▸ `Static` **mixin**(`source`): `void`

Mixes all enumerable properties and methods from a source object to DisplayObject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `Dict`<`any`\> | The source of properties and methods to mix in. |

#### Returns

`void`

#### Inherited from

[SimplePlane](pixi_mesh_extras.SimplePlane.md).[mixin](pixi_mesh_extras.SimplePlane.md#mixin)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L338)
