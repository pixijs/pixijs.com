---
id: "pixi_accessibility.AccessibilityManager"
title: "Class: AccessibilityManager"
sidebar_label: "AccessibilityManager"
custom_edit_url: null
---

[@pixi/accessibility](../modules/pixi_accessibility.md).AccessibilityManager

The Accessibility manager recreates the ability to tab and have content read by screen readers.
This is very important as it can possibly help people with disabilities access PixiJS content.

A DisplayObject can be made accessible just like it can be made interactive. This manager will map the
events as if the mouse was being used, minimizing the effort required to implement.

An instance of this class is automatically created by default, and can be found at `renderer.plugins.accessibility`

**`Memberof`**

PIXI

## Constructors

### constructor

• **new AccessibilityManager**(`renderer`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `renderer` | `IRenderer`<`ICanvas`\> | A reference to the current renderer |

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:86](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L86)

## Properties

### debug

• **debug**: `boolean` = `false`

Setting this to true will visually show the divs.

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L48)

___

### renderer

• **renderer**: `IRenderer`<`ICanvas`\>

The renderer this accessibility manager works for.

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:54](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L54)

## Accessors

### isActive

• `get` **isActive**(): `boolean`

Value of `true` if accessibility is currently active and accessibility layers are showing.

**`Member`**

#### Returns

`boolean`

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:131](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L131)

___

### isMobileAccessibility

• `get` **isMobileAccessibility**(): `boolean`

Value of `true` if accessibility is enabled for touch devices.

**`Member`**

#### Returns

`boolean`

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:141](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L141)

## Methods

### capHitArea

▸ **capHitArea**(`hitArea`): `void`

Adjust the hit area based on the bounds of a display object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hitArea` | `Rectangle` | Bounds of the child |

#### Returns

`void`

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:388](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L388)

___

### destroy

▸ **destroy**(): `void`

Destroys the accessibility manager

#### Returns

`void`

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:583](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L583)

___

### updateDebugHTML

▸ **updateDebugHTML**(`div`): `void`

private function that will visually add the information to the
accessability div

#### Parameters

| Name | Type |
| :------ | :------ |
| `div` | [`IAccessibleHTMLElement`](../interfaces/pixi_accessibility.IAccessibleHTMLElement.md) |

#### Returns

`void`

#### Defined in

[pixijs/packages/accessibility/src/AccessibilityManager.ts:379](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/accessibility/src/AccessibilityManager.ts#L379)
