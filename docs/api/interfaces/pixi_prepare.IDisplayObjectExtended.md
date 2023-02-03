---
id: "pixi_prepare.IDisplayObjectExtended"
title: "Interface: IDisplayObjectExtended"
sidebar_label: "IDisplayObjectExtended"
custom_edit_url: null
---

[@pixi/prepare](../modules/pixi_prepare.md).IDisplayObjectExtended

## Hierarchy

- `DisplayObject`

  ↳ **`IDisplayObjectExtended`**

## Properties

### \_accessibleActive

• `Optional` **\_accessibleActive**: `boolean`

#### Inherited from

DisplayObject.\_accessibleActive

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L21)

___

### \_accessibleDiv

• `Optional` **\_accessibleDiv**: `IAccessibleHTMLElement`

#### Inherited from

DisplayObject.\_accessibleDiv

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L22)

___

### \_bounds

• **\_bounds**: `Bounds`

The bounds object, this is used to calculate and store the bounds of the displayObject.

#### Inherited from

DisplayObject.\_bounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L299)

___

### \_cacheAsBitmap

• **\_cacheAsBitmap**: `boolean`

#### Inherited from

DisplayObject.\_cacheAsBitmap

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L10)

___

### \_cacheAsBitmapMultisample

• **\_cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

DisplayObject.\_cacheAsBitmapMultisample

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L9)

___

### \_cacheAsBitmapResolution

• **\_cacheAsBitmapResolution**: `number`

#### Inherited from

DisplayObject.\_cacheAsBitmapResolution

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L8)

___

### \_cacheData

• **\_cacheData**: `CacheData`

#### Inherited from

DisplayObject.\_cacheData

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L11)

___

### \_localBounds

• **\_localBounds**: `Bounds`

Local bounds object, swapped with `_bounds` when using `getLocalBounds()`.

#### Inherited from

DisplayObject.\_localBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:302](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L302)

___

### \_texture

• `Optional` **\_texture**: `Texture`<`Resource`\>

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L26)

___

### \_textures

• `Optional` **\_textures**: `Texture`<`Resource`\>[]

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L25)

___

### accessible

• `Optional` **accessible**: `boolean`

#### Inherited from

DisplayObject.accessible

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L17)

___

### accessibleChildren

• `Optional` **accessibleChildren**: `boolean`

#### Inherited from

DisplayObject.accessibleChildren

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L25)

___

### accessibleHint

• `Optional` **accessibleHint**: `string`

#### Inherited from

DisplayObject.accessibleHint

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L19)

___

### accessiblePointerEvents

• `Optional` **accessiblePointerEvents**: `PointerEvents`

#### Inherited from

DisplayObject.accessiblePointerEvents

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L24)

___

### accessibleTitle

• `Optional` **accessibleTitle**: `string`

#### Inherited from

DisplayObject.accessibleTitle

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L18)

___

### accessibleType

• `Optional` **accessibleType**: `string`

#### Inherited from

DisplayObject.accessibleType

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L23)

___

### alpha

• **alpha**: `number`

The opacity of the object.

#### Inherited from

DisplayObject.alpha

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L232)

___

### cacheAsBitmap

• **cacheAsBitmap**: `boolean`

#### Inherited from

DisplayObject.cacheAsBitmap

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L5)

___

### cacheAsBitmapMultisample

• **cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

DisplayObject.cacheAsBitmapMultisample

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L7)

___

### cacheAsBitmapResolution

• **cacheAsBitmapResolution**: `number`

#### Inherited from

DisplayObject.cacheAsBitmapResolution

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L6)

___

### children

• `Optional` `Readonly` **children**: readonly `FederatedEventTarget`[]

The children of this event target.

#### Inherited from

DisplayObject.children

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:68](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L68)

___

### cullArea

• **cullArea**: `Rectangle`

If set, this shape is used for culling instead of the bounds of this object.
It can improve the culling performance of objects with many children.
The culling area is defined in local space.

#### Inherited from

DisplayObject.cullArea

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L262)

___

### cullable

• **cullable**: `boolean`

Should this object be rendered if the bounds of this object are out of frame?

Culling has no effect on whether updateTransform is called.

#### Inherited from

DisplayObject.cullable

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:255](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L255)

___

### cursor

• **cursor**: `string`

The cursor preferred when the mouse pointer is hovering over.

#### Inherited from

DisplayObject.cursor

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

DisplayObject.displayObjectUpdateTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:332](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L332)

___

### filterArea

• **filterArea**: `Rectangle`

The area the filter is applied to. This is used as more of an optimization
rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.

Also works as an interaction mask.

#### Inherited from

DisplayObject.filterArea

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L270)

___

### filters

• **filters**: `Filter`[]

Sets the filters for the displayObject.
IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
To remove filters simply set this property to `'null'`.

#### Inherited from

DisplayObject.filters

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L277)

___

### hitArea

• **hitArea**: `IHitArea`

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Inherited from

DisplayObject.hitArea

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Inherited from

DisplayObject.interactive

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Inherited from

DisplayObject.interactiveChildren

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### isMask

• **isMask**: `boolean`

Does any other displayObject use this object as a mask?

#### Inherited from

DisplayObject.isMask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L283)

___

### isSprite

• **isSprite**: `boolean`

Used to fast check if a sprite is.. a sprite!

#### Inherited from

DisplayObject.isSprite

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:280](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L280)

___

### name

• **name**: `string`

#### Inherited from

DisplayObject.name

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L5)

___

### onclick

• **onclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'click' event

#### Inherited from

DisplayObject.onclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mousedown' event

#### Inherited from

DisplayObject.onmousedown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseenter' event

#### Inherited from

DisplayObject.onmouseenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseleave' event

#### Inherited from

DisplayObject.onmouseleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

DisplayObject.onmousemove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseout' event

#### Inherited from

DisplayObject.onmouseout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

DisplayObject.onmouseover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseup' event

#### Inherited from

DisplayObject.onmouseup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseupoutside' event

#### Inherited from

DisplayObject.onmouseupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointercancel' event

#### Inherited from

DisplayObject.onpointercancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerdown' event

#### Inherited from

DisplayObject.onpointerdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerenter' event

#### Inherited from

DisplayObject.onpointerenter

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerleave' event

#### Inherited from

DisplayObject.onpointerleave

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointermove' event

#### Inherited from

DisplayObject.onpointermove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerout' event

#### Inherited from

DisplayObject.onpointerout

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerover' event

#### Inherited from

DisplayObject.onpointerover

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointertap' event

#### Inherited from

DisplayObject.onpointertap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerup' event

#### Inherited from

DisplayObject.onpointerup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerupoutside' event

#### Inherited from

DisplayObject.onpointerupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightclick' event

#### Inherited from

DisplayObject.onrightclick

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightdown' event

#### Inherited from

DisplayObject.onrightdown

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightup' event

#### Inherited from

DisplayObject.onrightup

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightupoutside' event

#### Inherited from

DisplayObject.onrightupoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'tap' event

#### Inherited from

DisplayObject.ontap

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchcancel' event

#### Inherited from

DisplayObject.ontouchcancel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchend' event

#### Inherited from

DisplayObject.ontouchend

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchendoutside' event

#### Inherited from

DisplayObject.ontouchendoutside

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchmove' event

#### Inherited from

DisplayObject.ontouchmove

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchstart' event

#### Inherited from

DisplayObject.ontouchstart

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: `FederatedEventHandler`<`FederatedWheelEvent`\>

Handler for 'wheel' event

#### Inherited from

DisplayObject.onwheel

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

___

### parent

• **parent**: `Container`<`DisplayObject`\>

The display object container that contains this display object.

#### Inherited from

DisplayObject.parent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:217](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L217)

___

### renderId

• `Optional` **renderId**: `number`

#### Inherited from

DisplayObject.renderId

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L26)

___

### renderable

• **renderable**: `boolean`

Can this object be rendered, if false the object will not be drawn but the updateTransform
methods will still be called.

Only affects recursive calls from parent. You can ask for bounds manually.

#### Inherited from

DisplayObject.renderable

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L248)

___

### sortDirty

• `Abstract` **sortDirty**: `boolean`

#### Inherited from

DisplayObject.sortDirty

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L214)

___

### style

• `Optional` **style**: `TextStyle` \| `Partial`<`TextStyle`\>

#### Defined in

[pixijs/packages/prepare/src/BasePrepare.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/prepare/src/BasePrepare.ts#L27)

___

### tabIndex

• `Optional` **tabIndex**: `number`

#### Inherited from

DisplayObject.tabIndex

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L20)

___

### transform

• **transform**: `Transform`

World transform and local transform of this object.
This will become read-only later, please do not assign anything there unless you know what are you doing.

#### Inherited from

DisplayObject.transform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:229](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L229)

___

### visible

• **visible**: `boolean`

The visibility of the object. If false the object will not be drawn, and
the updateTransform function will not be called.

Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.

#### Inherited from

DisplayObject.visible

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L240)

___

### worldAlpha

• `Readonly` **worldAlpha**: `number`

The multiplied alpha of the displayObject.

#### Inherited from

DisplayObject.worldAlpha

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L223)

## Accessors

### angle

• `get` **angle**(): `number`

The angle of the object in degrees.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Inherited from

DisplayObject.angle

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:894](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L894)

• `set` **angle**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

DisplayObject.angle

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:899](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L899)

___

### destroyed

• `get` **destroyed**(): `boolean`

Readonly flag for destroyed display objects.

#### Returns

`boolean`

#### Inherited from

DisplayObject.destroyed

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:419](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L419)

___

### localTransform

• `get` **localTransform**(): `Matrix`

Current transform of the object based on local factors: position, scale, other stuff.

#### Returns

`Matrix`

#### Inherited from

DisplayObject.localTransform

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

#### Inherited from

DisplayObject.mask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:968](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L968)

• `set` **mask**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `MaskData` \| `Container`<`DisplayObject`\> |

#### Returns

`void`

#### Inherited from

DisplayObject.mask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:973](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L973)

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

#### Inherited from

DisplayObject.pivot

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:852](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L852)

• `set` **pivot**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

DisplayObject.pivot

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

#### Inherited from

DisplayObject.position

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:819](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L819)

• `set` **position**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

DisplayObject.position

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:824](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L824)

___

### rotation

• `get` **rotation**(): `number`

The rotation of the object in radians.
'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.

#### Returns

`number`

#### Inherited from

DisplayObject.rotation

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:880](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L880)

• `set` **rotation**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

DisplayObject.rotation

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:885](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L885)

___

### scale

• `get` **scale**(): `ObservablePoint`<`any`\>

The scale factors of this object along the local coordinate axes.

The default scale is (1, 1).

**`Since`**

4.0.0

#### Returns

`ObservablePoint`<`any`\>

#### Inherited from

DisplayObject.scale

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:835](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L835)

• `set` **scale**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

DisplayObject.scale

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

#### Inherited from

DisplayObject.skew

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:866](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L866)

• `set` **skew**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `IPointData` |

#### Returns

`void`

#### Inherited from

DisplayObject.skew

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:871](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L871)

___

### worldTransform

• `get` **worldTransform**(): `Matrix`

Current transform of the object based on world (parent) factors.

#### Returns

`Matrix`

#### Inherited from

DisplayObject.worldTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:801](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L801)

___

### worldVisible

• `get` **worldVisible**(): `boolean`

Indicates if the object is globally visible.

#### Returns

`boolean`

#### Inherited from

DisplayObject.worldVisible

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:930](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L930)

___

### x

• `get` **x**(): `number`

The position of the displayObject on the x axis relative to the local coordinates of the parent.
An alias to position.x

#### Returns

`number`

#### Inherited from

DisplayObject.x

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:773](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L773)

• `set` **x**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

DisplayObject.x

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:778](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L778)

___

### y

• `get` **y**(): `number`

The position of the displayObject on the y axis relative to the local coordinates of the parent.
An alias to position.y

#### Returns

`number`

#### Inherited from

DisplayObject.y

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:787](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L787)

• `set` **y**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

DisplayObject.y

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

#### Inherited from

DisplayObject.zIndex

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:912](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L912)

• `set` **zIndex**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Inherited from

DisplayObject.zIndex

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

DisplayObject.\_cacheAsBitmapDestroy

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L19)

___

### \_calculateCachedBounds

▸ **_calculateCachedBounds**(): `void`

#### Returns

`void`

#### Inherited from

DisplayObject.\_calculateCachedBounds

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L14)

___

### \_destroyCachedDisplayObject

▸ **_destroyCachedDisplayObject**(): `void`

#### Returns

`void`

#### Inherited from

DisplayObject.\_destroyCachedDisplayObject

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L18)

___

### \_getCachedLocalBounds

▸ **_getCachedLocalBounds**(): `Rectangle`

#### Returns

`Rectangle`

#### Inherited from

DisplayObject.\_getCachedLocalBounds

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

DisplayObject.\_initCachedDisplayObject

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

DisplayObject.\_initCachedDisplayObjectCanvas

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L17)

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

DisplayObject.\_renderCached

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

DisplayObject.\_renderCachedCanvas

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L16)

___

### calculateBounds

▸ `Abstract` **calculateBounds**(): `void`

Recalculates the bounds of the display object.

#### Returns

`void`

#### Inherited from

DisplayObject.calculateBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:425](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L425)

___

### destroy

▸ **destroy**(`_options?`): `void`

Base destroy method for generic display objects. This will automatically
remove the display object from its parent Container as well as remove
all current event listeners and internal references. Do not use a DisplayObject
after calling `destroy()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_options?` | `boolean` \| `IDestroyOptions` |

#### Returns

`void`

#### Inherited from

DisplayObject.destroy

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:703](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L703)

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

DisplayObject.disableTempParent

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

DisplayObject.enableTempParent

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

DisplayObject.getBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:493](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L493)

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

DisplayObject.getGlobalPosition

#### Defined in

[pixijs/packages/mixin-get-global-position/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-global-position/global.d.ts#L5)

___

### getLocalBounds

▸ **getLocalBounds**(`rect?`): `Rectangle`

Retrieves the local bounds of the displayObject as a rectangle object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rect?` | `Rectangle` | Optional rectangle to store the result of the bounds calculation. |

#### Returns

`Rectangle`

- The rectangular bounding area.

#### Inherited from

DisplayObject.getLocalBounds

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:534](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L534)

___

### removeChild

▸ `Abstract` **removeChild**(`child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `DisplayObject` |

#### Returns

`void`

#### Inherited from

DisplayObject.removeChild

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:427](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L427)

___

### removeFromParent

▸ **removeFromParent**(): `void`

Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing.

#### Returns

`void`

#### Inherited from

DisplayObject.removeFromParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:663](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L663)

___

### render

▸ `Abstract` **render**(`renderer`): `void`

Renders the object using the WebGL renderer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `Renderer` | The renderer. |

#### Returns

`void`

#### Inherited from

DisplayObject.render

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:433](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L433)

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

DisplayObject.renderCanvas

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L5)

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

DisplayObject.setParent

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:650](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L650)

___

### setTransform

▸ **setTransform**(`x?`, `y?`, `scaleX?`, `scaleY?`, `rotation?`, `skewX?`, `skewY?`, `pivotX?`, `pivotY?`): [`IDisplayObjectExtended`](pixi_prepare.IDisplayObjectExtended.md)

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

[`IDisplayObjectExtended`](pixi_prepare.IDisplayObjectExtended.md)

- The DisplayObject instance

#### Inherited from

DisplayObject.setTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:681](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L681)

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

DisplayObject.toGlobal

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

DisplayObject.toLocal

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:615](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L615)

___

### updateTransform

▸ **updateTransform**(): `void`

Updates the object transform for rendering. TODO - Optimization pass!

#### Returns

`void`

#### Inherited from

DisplayObject.updateTransform

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:450](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L450)
