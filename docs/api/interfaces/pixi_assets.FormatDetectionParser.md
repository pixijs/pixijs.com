---
id: "pixi_assets.FormatDetectionParser"
title: "Interface: FormatDetectionParser"
sidebar_label: "FormatDetectionParser"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).FormatDetectionParser

Format detection is useful for detecting feature support
on the current platform.

**`Memberof`**

PIXI

## Properties

### add

• **add**: (`formats`: `string`[]) => `Promise`<`string`[]\>

#### Type declaration

▸ (`formats`): `Promise`<`string`[]\>

Add formats (file extensions) to the existing list of formats.
Return an new array with added formats, do not mutate the formats argument.

##### Parameters

| Name | Type |
| :------ | :------ |
| `formats` | `string`[] |

##### Returns

`Promise`<`string`[]\>

- Promise that resolves to the new formats array.

#### Defined in

[pixijs/packages/assets/src/detections/index.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/index.ts#L19)

___

### extension

• `Optional` **extension**: `ExtensionMetadata`

Should be ExtensionType.DetectionParser

#### Defined in

[pixijs/packages/assets/src/detections/index.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/index.ts#L11)

___

### remove

• **remove**: (`formats`: `string`[]) => `Promise`<`string`[]\>

#### Type declaration

▸ (`formats`): `Promise`<`string`[]\>

Remove formats (file extensions) from the list of supported formats.
This is used when uninstalling this DetectionParser.
Return an new array with filtered formats, do not mutate the formats argument.

##### Parameters

| Name | Type |
| :------ | :------ |
| `formats` | `string`[] |

##### Returns

`Promise`<`string`[]\>

- Promise that resolves to the new formats array.

#### Defined in

[pixijs/packages/assets/src/detections/index.ts:26](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/index.ts#L26)

___

### test

• **test**: () => `Promise`<`boolean`\>

#### Type declaration

▸ (): `Promise`<`boolean`\>

Browser/platform feature detection supported if return true

##### Returns

`Promise`<`boolean`\>

#### Defined in

[pixijs/packages/assets/src/detections/index.ts:13](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/detections/index.ts#L13)
