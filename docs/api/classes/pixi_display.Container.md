---
id: "pixi_display.Container"
title: "Class: Container<T>"
sidebar_label: "Container"
custom_edit_url: null
---

[@pixi/display](../modules/pixi_display.md).Container

Container is a general-purpose display object that holds children. It also adds built-in support for advanced
rendering features like masking and filtering.

It is the base class of all display objects that act as a container for other objects, including Graphics
and Sprite.

**`Example`**

```ts
import { BlurFilter, Container, Graphics, Sprite } from 'pixi.js';

const container = new Container();
const sprite = Sprite.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png');

sprite.width = 512;
sprite.height = 512;

// Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
// is rendered.
container.addChild(sprite);

// Blurs whatever is rendered by the container
container.filters = [new BlurFilter()];

// Only the contents within a circle at the center should be rendered onto the screen.
container.mask = new Graphics()
    .beginFill(0xffffff)
    .drawCircle(sprite.width / 2, sprite.height / 2, Math.min(sprite.width, sprite.height) / 2)
    .endFill();
```

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`DisplayObject`](pixi_display.DisplayObject.md) = [`DisplayObject`](pixi_display.DisplayObject.md) |

## Hierarchy

- `Container`

- [`DisplayObject`](pixi_display.DisplayObject.md)

  ↳ **`Container`**

## Constructors

### constructor

• **new Container**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`DisplayObject`](pixi_display.DisplayObject.md)<`T`\> = [`DisplayObject`](pixi_display.DisplayObject.md) |

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[constructor](pixi_display.DisplayObject.md#constructor)

#### Defined in

[pixijs/packages/display/src/Container.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L99)

## Properties

### \_accessibleActive

• `Optional` **\_accessibleActive**: `boolean`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_accessibleActive](pixi_display.DisplayObject.md#_accessibleactive)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L21)

___

### \_accessibleDiv

• `Optional` **\_accessibleDiv**: `IAccessibleHTMLElement`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_accessibleDiv](pixi_display.DisplayObject.md#_accessiblediv)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L22)

___

### \_bounds

• **\_bounds**: [`Bounds`](pixi_display.Bounds.md)

The bounds object, this is used to calculate and store the bounds of the displayObject.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_bounds](pixi_display.DisplayObject.md#_bounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:299](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L299)

___

### \_cacheAsBitmap

• **\_cacheAsBitmap**: `boolean`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_cacheAsBitmap](pixi_display.DisplayObject.md#_cacheasbitmap)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L10)

___

### \_cacheAsBitmapMultisample

• **\_cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_cacheAsBitmapMultisample](pixi_display.DisplayObject.md#_cacheasbitmapmultisample)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:9](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L9)

___

### \_cacheAsBitmapResolution

• **\_cacheAsBitmapResolution**: `number`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_cacheAsBitmapResolution](pixi_display.DisplayObject.md#_cacheasbitmapresolution)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:8](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L8)

___

### \_cacheData

• **\_cacheData**: `CacheData`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_cacheData](pixi_display.DisplayObject.md#_cachedata)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L11)

___

### \_localBounds

• **\_localBounds**: [`Bounds`](pixi_display.Bounds.md)

Local bounds object, swapped with `_bounds` when using `getLocalBounds()`.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_localBounds](pixi_display.DisplayObject.md#_localbounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:302](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L302)

___

### accessible

• `Optional` **accessible**: `boolean`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessible](pixi_display.DisplayObject.md#accessible)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L17)

___

### accessibleChildren

• `Optional` **accessibleChildren**: `boolean`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessibleChildren](pixi_display.DisplayObject.md#accessiblechildren)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L25)

___

### accessibleHint

• `Optional` **accessibleHint**: `string`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessibleHint](pixi_display.DisplayObject.md#accessiblehint)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L19)

___

### accessiblePointerEvents

• `Optional` **accessiblePointerEvents**: `PointerEvents`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessiblePointerEvents](pixi_display.DisplayObject.md#accessiblepointerevents)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L24)

___

### accessibleTitle

• `Optional` **accessibleTitle**: `string`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessibleTitle](pixi_display.DisplayObject.md#accessibletitle)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L18)

___

### accessibleType

• `Optional` **accessibleType**: `string`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[accessibleType](pixi_display.DisplayObject.md#accessibletype)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L23)

___

### alpha

• **alpha**: `number`

The opacity of the object.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[alpha](pixi_display.DisplayObject.md#alpha)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:232](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L232)

___

### cacheAsBitmap

• **cacheAsBitmap**: `boolean`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cacheAsBitmap](pixi_display.DisplayObject.md#cacheasbitmap)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L5)

___

### cacheAsBitmapMultisample

• **cacheAsBitmapMultisample**: `MSAA_QUALITY`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cacheAsBitmapMultisample](pixi_display.DisplayObject.md#cacheasbitmapmultisample)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:7](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L7)

___

### cacheAsBitmapResolution

• **cacheAsBitmapResolution**: `number`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cacheAsBitmapResolution](pixi_display.DisplayObject.md#cacheasbitmapresolution)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:6](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L6)

___

### children

• `Readonly` **children**: `T`[]

The array of children of this container.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[children](pixi_display.DisplayObject.md#children)

#### Defined in

[pixijs/packages/display/src/Container.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L71)

___

### containerUpdateTransform

• **containerUpdateTransform**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:94](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L94)

___

### cullArea

• **cullArea**: `Rectangle`

If set, this shape is used for culling instead of the bounds of this object.
It can improve the culling performance of objects with many children.
The culling area is defined in local space.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cullArea](pixi_display.DisplayObject.md#cullarea)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:262](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L262)

___

### cullable

• **cullable**: `boolean`

Should this object be rendered if the bounds of this object are out of frame?

Culling has no effect on whether updateTransform is called.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cullable](pixi_display.DisplayObject.md#cullable)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:255](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L255)

___

### cursor

• **cursor**: `string`

The cursor preferred when the mouse pointer is hovering over.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[cursor](pixi_display.DisplayObject.md#cursor)

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

[DisplayObject](pixi_display.DisplayObject.md).[displayObjectUpdateTransform](pixi_display.DisplayObject.md#displayobjectupdatetransform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:332](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L332)

___

### filterArea

• **filterArea**: `Rectangle`

The area the filter is applied to. This is used as more of an optimization
rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.

Also works as an interaction mask.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[filterArea](pixi_display.DisplayObject.md#filterarea)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:270](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L270)

___

### filters

• **filters**: `Filter`[]

Sets the filters for the displayObject.
IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
To remove filters simply set this property to `'null'`.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[filters](pixi_display.DisplayObject.md#filters)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:277](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L277)

___

### hitArea

• **hitArea**: `IHitArea`

The hit-area specifies the area for which pointer events should be captured by this event target.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[hitArea](pixi_display.DisplayObject.md#hitarea)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L77)

___

### interactive

• **interactive**: `boolean`

Whether this event target should fire UI events.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[interactive](pixi_display.DisplayObject.md#interactive)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L71)

___

### interactiveChildren

• **interactiveChildren**: `boolean`

Whether this event target has any children that need UI events. This can be used optimize event propagation.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[interactiveChildren](pixi_display.DisplayObject.md#interactivechildren)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:74](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L74)

___

### isMask

• **isMask**: `boolean`

Does any other displayObject use this object as a mask?

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[isMask](pixi_display.DisplayObject.md#ismask)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:283](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L283)

___

### isSprite

• **isSprite**: `boolean`

Used to fast check if a sprite is.. a sprite!

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[isSprite](pixi_display.DisplayObject.md#issprite)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:280](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L280)

___

### name

• **name**: `string`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[name](pixi_display.DisplayObject.md#name)

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L5)

___

### onclick

• **onclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'click' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onclick](pixi_display.DisplayObject.md#onclick)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:89](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L89)

___

### onmousedown

• **onmousedown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mousedown' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmousedown](pixi_display.DisplayObject.md#onmousedown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:91](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L91)

___

### onmouseenter

• **onmouseenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseenter' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseenter](pixi_display.DisplayObject.md#onmouseenter)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L93)

___

### onmouseleave

• **onmouseleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseleave' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseleave](pixi_display.DisplayObject.md#onmouseleave)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L95)

___

### onmousemove

• **onmousemove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmousemove](pixi_display.DisplayObject.md#onmousemove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:97](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L97)

___

### onmouseout

• **onmouseout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseout' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseout](pixi_display.DisplayObject.md#onmouseout)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L99)

___

### onmouseover

• **onmouseover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseover' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseover](pixi_display.DisplayObject.md#onmouseover)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:101](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L101)

___

### onmouseup

• **onmouseup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseup' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseup](pixi_display.DisplayObject.md#onmouseup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L103)

___

### onmouseupoutside

• **onmouseupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'mouseupoutside' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onmouseupoutside](pixi_display.DisplayObject.md#onmouseupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:105](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L105)

___

### onpointercancel

• **onpointercancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointercancel' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointercancel](pixi_display.DisplayObject.md#onpointercancel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L107)

___

### onpointerdown

• **onpointerdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerdown' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerdown](pixi_display.DisplayObject.md#onpointerdown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:109](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L109)

___

### onpointerenter

• **onpointerenter**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerenter' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerenter](pixi_display.DisplayObject.md#onpointerenter)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L111)

___

### onpointerleave

• **onpointerleave**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerleave' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerleave](pixi_display.DisplayObject.md#onpointerleave)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L113)

___

### onpointermove

• **onpointermove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointermove' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointermove](pixi_display.DisplayObject.md#onpointermove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:115](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L115)

___

### onpointerout

• **onpointerout**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerout' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerout](pixi_display.DisplayObject.md#onpointerout)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:117](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L117)

___

### onpointerover

• **onpointerover**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerover' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerover](pixi_display.DisplayObject.md#onpointerover)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:119](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L119)

___

### onpointertap

• **onpointertap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointertap' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointertap](pixi_display.DisplayObject.md#onpointertap)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:121](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L121)

___

### onpointerup

• **onpointerup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerup' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerup](pixi_display.DisplayObject.md#onpointerup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:123](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L123)

___

### onpointerupoutside

• **onpointerupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'pointerupoutside' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onpointerupoutside](pixi_display.DisplayObject.md#onpointerupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L125)

___

### onrightclick

• **onrightclick**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightclick' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onrightclick](pixi_display.DisplayObject.md#onrightclick)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:127](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L127)

___

### onrightdown

• **onrightdown**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightdown' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onrightdown](pixi_display.DisplayObject.md#onrightdown)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:129](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L129)

___

### onrightup

• **onrightup**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightup' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onrightup](pixi_display.DisplayObject.md#onrightup)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L131)

___

### onrightupoutside

• **onrightupoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'rightupoutside' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onrightupoutside](pixi_display.DisplayObject.md#onrightupoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:133](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L133)

___

### ontap

• **ontap**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'tap' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontap](pixi_display.DisplayObject.md#ontap)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L135)

___

### ontouchcancel

• **ontouchcancel**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchcancel' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontouchcancel](pixi_display.DisplayObject.md#ontouchcancel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:137](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L137)

___

### ontouchend

• **ontouchend**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchend' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontouchend](pixi_display.DisplayObject.md#ontouchend)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L139)

___

### ontouchendoutside

• **ontouchendoutside**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchendoutside' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontouchendoutside](pixi_display.DisplayObject.md#ontouchendoutside)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L141)

___

### ontouchmove

• **ontouchmove**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchmove' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontouchmove](pixi_display.DisplayObject.md#ontouchmove)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:143](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L143)

___

### ontouchstart

• **ontouchstart**: `FederatedEventHandler`<`FederatedPointerEvent`\>

Handler for 'touchstart' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[ontouchstart](pixi_display.DisplayObject.md#ontouchstart)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L145)

___

### onwheel

• **onwheel**: `FederatedEventHandler`<`FederatedWheelEvent`\>

Handler for 'wheel' event

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[onwheel](pixi_display.DisplayObject.md#onwheel)

#### Defined in

[pixijs/packages/events/src/FederatedEventTarget.ts:147](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/events/src/FederatedEventTarget.ts#L147)

___

### parent

• **parent**: [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

The display object container that contains this display object.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[parent](pixi_display.DisplayObject.md#parent)

#### Defined in

[pixijs/packages/display/src/Container.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L93)

___

### renderId

• `Optional` **renderId**: `number`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[renderId](pixi_display.DisplayObject.md#renderid)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L26)

___

### renderable

• **renderable**: `boolean`

Can this object be rendered, if false the object will not be drawn but the updateTransform
methods will still be called.

Only affects recursive calls from parent. You can ask for bounds manually.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[renderable](pixi_display.DisplayObject.md#renderable)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:248](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L248)

___

### sortDirty

• **sortDirty**: `boolean`

Should children be sorted by zIndex at the next updateTransform call.

Will get automatically set to true if a new child is added, or if a child's zIndex changes.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[sortDirty](pixi_display.DisplayObject.md#sortdirty)

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

#### Defined in

[pixijs/packages/display/src/Container.ts:85](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L85)

___

### tabIndex

• `Optional` **tabIndex**: `number`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[tabIndex](pixi_display.DisplayObject.md#tabindex)

#### Defined in

[pixijs/packages/accessibility/src/accessibleTarget.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/accessibleTarget.ts#L20)

___

### transform

• **transform**: `Transform`

World transform and local transform of this object.
This will become read-only later, please do not assign anything there unless you know what are you doing.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[transform](pixi_display.DisplayObject.md#transform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:229](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L229)

___

### visible

• **visible**: `boolean`

The visibility of the object. If false the object will not be drawn, and
the updateTransform function will not be called.

Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[visible](pixi_display.DisplayObject.md#visible)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:240](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L240)

___

### worldAlpha

• `Readonly` **worldAlpha**: `number`

The multiplied alpha of the displayObject.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[worldAlpha](pixi_display.DisplayObject.md#worldalpha)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L223)

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

#### Defined in

[pixijs/packages/display/src/Container.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L65)

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

### height

• `get` **height**(): `number`

The height of the Container, setting this will actually modify the scale to achieve the value set.

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/Container.ts:817](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L817)

• `set` **height**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:822](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L822)

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

• `get` **mask**(): `MaskData` \| [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

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

`MaskData` \| [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

#### Inherited from

DisplayObject.mask

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:968](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L968)

• `set` **mask**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `MaskData` \| [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\> |

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

### width

• `get` **width**(): `number`

The width of the Container, setting this will actually modify the scale to achieve the value set.

#### Returns

`number`

#### Defined in

[pixijs/packages/display/src/Container.ts:795](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L795)

• `set` **width**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:800](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L800)

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
| `options?` | `boolean` \| [`IDestroyOptions`](../interfaces/pixi_display.IDestroyOptions.md) |

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_cacheAsBitmapDestroy](pixi_display.DisplayObject.md#_cacheasbitmapdestroy)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L19)

___

### \_calculateCachedBounds

▸ **_calculateCachedBounds**(): `void`

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_calculateCachedBounds](pixi_display.DisplayObject.md#_calculatecachedbounds)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L14)

___

### \_destroyCachedDisplayObject

▸ **_destroyCachedDisplayObject**(): `void`

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_destroyCachedDisplayObject](pixi_display.DisplayObject.md#_destroycacheddisplayobject)

#### Defined in

[pixijs/packages/mixin-cache-as-bitmap/global.d.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-cache-as-bitmap/global.d.ts#L18)

___

### \_getCachedLocalBounds

▸ **_getCachedLocalBounds**(): `Rectangle`

#### Returns

`Rectangle`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[_getCachedLocalBounds](pixi_display.DisplayObject.md#_getcachedlocalbounds)

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

[DisplayObject](pixi_display.DisplayObject.md).[_initCachedDisplayObject](pixi_display.DisplayObject.md#_initcacheddisplayobject)

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

[DisplayObject](pixi_display.DisplayObject.md).[_initCachedDisplayObjectCanvas](pixi_display.DisplayObject.md#_initcacheddisplayobjectcanvas)

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

[DisplayObject](pixi_display.DisplayObject.md).[_renderCached](pixi_display.DisplayObject.md#_rendercached)

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

[DisplayObject](pixi_display.DisplayObject.md).[_renderCachedCanvas](pixi_display.DisplayObject.md#_rendercachedcanvas)

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

GlobalMixins.Container.\_renderCanvas

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
| `U` | extends `T`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to add to the container |

#### Returns

`U`[``0``]

- The first child that was added.

#### Defined in

[pixijs/packages/display/src/Container.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L140)

___

### addChildAt

▸ **addChildAt**<`U`\>(`child`, `index`): `U`

Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`DisplayObject`](pixi_display.DisplayObject.md)<`U`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `U` | The child to add |
| `index` | `number` | The index to place the child in |

#### Returns

`U`

The child that was added.

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

[DisplayObject](pixi_display.DisplayObject.md).[calculateBounds](pixi_display.DisplayObject.md#calculatebounds)

#### Defined in

[pixijs/packages/display/src/Container.ts:459](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L459)

___

### destroy

▸ **destroy**(`options?`): `void`

Removes all internal references and listeners as well as removes children from the display list.
Do not use a Container after calling `destroy`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `boolean` \| [`IDestroyOptions`](../interfaces/pixi_display.IDestroyOptions.md) | Options parameter. A boolean will act as if all options have been set to that value |

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[destroy](pixi_display.DisplayObject.md#destroy)

#### Defined in

[pixijs/packages/display/src/Container.ts:775](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L775)

___

### disableTempParent

▸ **disableTempParent**(`cacheParent`): `void`

Pair method for `enableTempParent`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheParent` | [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\> | Actual parent of element |

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[disableTempParent](pixi_display.DisplayObject.md#disabletempparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:764](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L764)

___

### enableTempParent

▸ **enableTempParent**(): [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root.

```js
const cacheParent = elem.enableTempParent();
elem.updateTransform();
elem.disableTempParent(cacheParent);
```

#### Returns

[`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

- Current parent

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[enableTempParent](pixi_display.DisplayObject.md#enabletempparent)

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

[DisplayObject](pixi_display.DisplayObject.md).[getBounds](pixi_display.DisplayObject.md#getbounds)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:493](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L493)

___

### getChildAt

▸ **getChildAt**(`index`): `T`

Returns the child at the specified index

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child at |

#### Returns

`T`

- The child at the given index, if any.

#### Defined in

[pixijs/packages/display/src/Container.ts:281](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L281)

___

### getChildByName

▸ **getChildByName**<`T`\>(`name`, `deep?`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`DisplayObject`](pixi_display.DisplayObject.md)<`T`\> = [`DisplayObject`](pixi_display.DisplayObject.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `deep?` | `boolean` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Container.getChildByName

#### Defined in

[pixijs/packages/mixin-get-child-by-name/global.d.ts:10](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/mixin-get-child-by-name/global.d.ts#L10)

___

### getChildIndex

▸ **getChildIndex**(`child`): `number`

Returns the index position of a child DisplayObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `T` | The DisplayObject instance to identify |

#### Returns

`number`

- The index position of the child display object to identify

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

[DisplayObject](pixi_display.DisplayObject.md).[getGlobalPosition](pixi_display.DisplayObject.md#getglobalposition)

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

[DisplayObject](pixi_display.DisplayObject.md).[getLocalBounds](pixi_display.DisplayObject.md#getlocalbounds)

#### Defined in

[pixijs/packages/display/src/Container.ts:515](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L515)

___

### removeChild

▸ **removeChild**<`U`\>(`...children`): `U`[``0``]

Removes one or more children from the container.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends `T`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...children` | `U` | The DisplayObject(s) to remove |

#### Returns

`U`[``0``]

The first child that was removed.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[removeChild](pixi_display.DisplayObject.md#removechild)

#### Defined in

[pixijs/packages/display/src/Container.ts:296](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L296)

___

### removeChildAt

▸ **removeChildAt**(`index`): `T`

Removes a child from the specified index position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The index to get the child from |

#### Returns

`T`

The child that was removed.

#### Defined in

[pixijs/packages/display/src/Container.ts:336](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L336)

___

### removeChildren

▸ **removeChildren**(`beginIndex?`, `endIndex?`): `T`[]

Removes all children from this container that are within the begin and end indexes.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `beginIndex` | `number` | `0` | The beginning position. |
| `endIndex` | `number` | `undefined` | The ending position. Default value is size of the container. |

#### Returns

`T`[]

- List of removed children

#### Defined in

[pixijs/packages/display/src/Container.ts:362](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L362)

___

### removeFromParent

▸ **removeFromParent**(): `void`

Remove the DisplayObject from its parent Container. If the DisplayObject has no parent, do nothing.

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[removeFromParent](pixi_display.DisplayObject.md#removefromparent)

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

[DisplayObject](pixi_display.DisplayObject.md).[render](pixi_display.DisplayObject.md#render)

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

[DisplayObject](pixi_display.DisplayObject.md).[renderCanvas](pixi_display.DisplayObject.md#rendercanvas)

#### Defined in

[pixijs/packages/canvas-display/global.d.ts:5](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/canvas-display/global.d.ts#L5)

___

### setChildIndex

▸ **setChildIndex**(`child`, `index`): `void`

Changes the position of an existing child in the display object container

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `T` | The child DisplayObject instance for which you want to change the index number |
| `index` | `number` | The resulting index number for the child display object |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:261](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L261)

___

### setParent

▸ **setParent**(`container`): [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

Set the parent Container of this DisplayObject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | [`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\> | The Container to add this DisplayObject to. |

#### Returns

[`Container`](pixi_display.Container.md)<[`DisplayObject`](pixi_display.DisplayObject.md)\>

- The Container that this DisplayObject was added to.

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[setParent](pixi_display.DisplayObject.md#setparent)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:650](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L650)

___

### setTransform

▸ **setTransform**(`x?`, `y?`, `scaleX?`, `scaleY?`, `rotation?`, `skewX?`, `skewY?`, `pivotX?`, `pivotY?`): [`Container`](pixi_display.Container.md)<`T`\>

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

[`Container`](pixi_display.Container.md)<`T`\>

- The DisplayObject instance

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[setTransform](pixi_display.DisplayObject.md#settransform)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:681](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L681)

___

### sortChildren

▸ **sortChildren**(): `void`

Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex.

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:403](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L403)

___

### swapChildren

▸ **swapChildren**(`child`, `child2`): `void`

Swaps the position of 2 Display Objects within this container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | `T` | First display object to swap |
| `child2` | `T` | Second display object to swap |

#### Returns

`void`

#### Defined in

[pixijs/packages/display/src/Container.ts:224](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L224)

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

[DisplayObject](pixi_display.DisplayObject.md).[toGlobal](pixi_display.DisplayObject.md#toglobal)

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
| `from?` | [`DisplayObject`](pixi_display.DisplayObject.md) | The DisplayObject to calculate the global position from. |
| `point?` | `P` | A Point object in which to store the value, optional (otherwise will create a new Point). |
| `skipUpdate?` | `boolean` | Should we skip the update transform |

#### Returns

`P`

- A point object representing the position of this object

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[toLocal](pixi_display.DisplayObject.md#tolocal)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:615](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L615)

___

### updateTransform

▸ **updateTransform**(): `void`

Updates the transform on all children of this container for rendering.

#### Returns

`void`

#### Inherited from

[DisplayObject](pixi_display.DisplayObject.md).[updateTransform](pixi_display.DisplayObject.md#updatetransform)

#### Defined in

[pixijs/packages/display/src/Container.ts:428](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/Container.ts#L428)

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

[DisplayObject](pixi_display.DisplayObject.md).[mixin](pixi_display.DisplayObject.md#mixin)

#### Defined in

[pixijs/packages/display/src/DisplayObject.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/display/src/DisplayObject.ts#L338)
