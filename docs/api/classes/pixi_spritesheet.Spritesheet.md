---
id: "pixi_spritesheet.Spritesheet"
title: "Class: Spritesheet"
sidebar_label: "Spritesheet"
custom_edit_url: null
---

[@pixi/spritesheet](../modules/pixi_spritesheet.md).Spritesheet

Utility class for maintaining reference to a collection
of Textures on a single Spritesheet.

To access a sprite sheet from your code you may pass its JSON data file to Pixi's loader:

```js
import { Assets } from 'pixi.js';

const sheet = await Assets.load('images/spritesheet.json');
```

Alternately, you may circumvent the loader by instantiating the Spritesheet directly:

```js
import { Spritesheet } from 'pixi.js';

const sheet = new Spritesheet(texture, spritesheetData);
await sheet.parse();
console.log('Spritesheet ready to use!');
```

With the `sheet.textures` you can create Sprite objects, and `sheet.animations` can be used to create an AnimatedSprite.

Sprite sheets can be packed using tools like [https://codeandweb.com/texturepacker|TexturePacker](https://codeandweb.com/texturepacker|TexturePacker),
[https://renderhjs.net/shoebox/|Shoebox](https://renderhjs.net/shoebox/|Shoebox) or [https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js](https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js).
Default anchor points (see PIXI.Texture#defaultAnchor) and grouping of animation sprites are currently only
supported by TexturePacker.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Spritesheet**(`texture`, `data`, `resolutionFilename?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `texture` | `Texture`<`Resource`\> \| `BaseTexture`<`Resource`, `IAutoDetectOptions`\> | `undefined` | Reference to the source BaseTexture object. |
| `data` | [`ISpritesheetData`](../interfaces/pixi_spritesheet.ISpritesheetData.md) | `undefined` | Spritesheet image data. |
| `resolutionFilename` | `string` | `null` | The filename to consider when determining the resolution of the spritesheet. If not provided, the imageUrl will be used on the BaseTexture. |

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L140)

## Properties

### animations

• **animations**: `Dict`<`Texture`<`Resource`\>[]\>

A map containing the textures for each animation.
Can be used to create an PIXI.AnimatedSprite|AnimatedSprite:

**`Example`**

```ts
import { AnimatedSprite } from 'pixi.js';

new AnimatedSprite(sheet.animations['anim_name']);
```

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:98](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L98)

___

### baseTexture

• **baseTexture**: `BaseTexture`<`Resource`, `IAutoDetectOptions`\>

Reference to ths source texture.

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L78)

___

### data

• **data**: [`ISpritesheetData`](../interfaces/pixi_spritesheet.ISpritesheetData.md)

Reference to the original JSON data.

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:104](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L104)

___

### linkedSheets

• **linkedSheets**: [`Spritesheet`](pixi_spritesheet.Spritesheet.md)[] = `[]`

For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on.

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:75](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L75)

___

### resolution

• **resolution**: `number`

The resolution of the spritesheet.

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L107)

___

### textures

• **textures**: `Dict`<`Texture`<`Resource`\>\>

A map containing all textures of the sprite sheet.
Can be used to create a PIXI.Sprite|Sprite:

**`Example`**

```ts
import { Sprite } from 'pixi.js';

new Sprite(sheet.textures['image.png']);
```

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:88](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L88)

___

### BATCH\_SIZE

▪ `Static` `Readonly` **BATCH\_SIZE**: ``1000``

The maximum number of Textures to build per process.

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L72)

## Methods

### destroy

▸ **destroy**(`destroyBase?`): `void`

Destroy Spritesheet and don't use after this.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `destroyBase?` | `boolean` | `false` | Whether to destroy the base texture as well |

#### Returns

`void`

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:338](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L338)

___

### parse

▸ **parse**(): `Promise`<`Dict`<`Texture`<`Resource`\>\>\>

Parser spritesheet from loaded data. This is done asynchronously
to prevent creating too many Texture within a single process.

**`Method`**

PIXI.Spritesheet#parse

#### Returns

`Promise`<`Dict`<`Texture`<`Resource`\>\>\>

#### Defined in

[pixijs/packages/spritesheet/src/Spritesheet.ts:192](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/spritesheet/src/Spritesheet.ts#L192)
