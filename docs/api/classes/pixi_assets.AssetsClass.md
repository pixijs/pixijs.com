---
id: "pixi_assets.AssetsClass"
title: "Class: AssetsClass"
sidebar_label: "AssetsClass"
custom_edit_url: null
---

[@pixi/assets](../modules/pixi_assets.md).AssetsClass

A one stop shop for all Pixi resource management!
Super modern and easy to use, with enough flexibility to customize and do what you need!

**`Memberof`**

PIXI

**`Namespace`**

Assets

Only one Asset Class exists accessed via the Global Asset object.

It has four main responsibilities:
1. Allows users to map URLs to keys and resolve them according to the user's browser capabilities
2. Loads the resources and transforms them into assets that developers understand.
3. Caches the assets and provides a way to access them.
4. Allow developers to unload assets and clear the cache.

It also has a few advanced features:
1. Allows developers to provide a manifest upfront of all assets and help manage them via 'bundles'.
2. Allows users to background load assets. Shortening (or eliminating) load times and improving UX. With this feature,
in-game loading bars can be a thing of the past!

### Assets Loading

Do not be afraid to load things multiple times - under the hood, it will NEVER load anything more than once.

For example:

```js
import { Assets } from 'pixi.js';

promise1 = Assets.load('bunny.png')
promise2 = Assets.load('bunny.png')

// promise1 === promise2
```

Here both promises will be the same. Once resolved... Forever resolved! It makes for really easy resource management!

Out of the box it supports the following files:
- textures (avif, webp, png, jpg, gif)
- sprite sheets (json)
- bitmap fonts (xml, fnt, txt)
- web fonts (ttf, woff, woff2)
- json files (json)
- text files (txt)

More types can be added fairly easily by creating additional loader parsers.

### Textures
- Textures are loaded as ImageBitmap on a worker thread where possible.
Leading to much less janky load + parse times.
- By default, we will prefer to load AVIF and WebP image files if you specify them.
But if the browser doesn't support AVIF or WebP we will fall back to png and jpg.
- Textures can also be accessed via Texture.from(...) and now use this asset manager under the hood!
- Don't worry if you set preferences for textures that don't exist (for example you prefer 2x resolutions images
 but only 1x is available for that texture, the Asset manager will pick that up as a fallback automatically)

#### Sprite sheets
- It's hard to know what resolution a sprite sheet is without loading it first, to address this
there is a naming convention we have added that will let Pixi understand the image format and resolution
of the spritesheet via its file name:

`my-spritesheet{resolution}.{imageFormat}.json`

For example:

`my-spritesheet@2x.webp.json` // 2x resolution, WebP sprite sheet
`my-spritesheet@0.5x.png.json` // 0.5x resolution, png sprite sheet

This is optional! You can just load a sprite sheet as normal.
This is only useful if you have a bunch of different res / formatted spritesheets.

### Fonts
Web fonts will be loaded with all weights.
It is possible to load only specific weights by doing the following:

```js
import { Assets } from 'pixi.js';

// Load specific weights..
await Assets.load({
    data: {
        weights: ['normal'], // Only loads the weight
    },
    src: `outfit.woff2`,
});

// Load everything...
await Assets.load(`outfit.woff2`);
```

### Background Loading
Background loading will load stuff for you passively behind the scenes. To minimize jank,
it will only load one asset at a time. As soon as a developer calls `Assets.load(...)` the
background loader is paused and requested assets are loaded as a priority.
Don't worry if something is in there that's already loaded, it will just get skipped!

You still need to call `Assets.load(...)` to get an asset that has been loaded in the background.
It's just that this promise will resolve instantly if the asset
has already been loaded.

### Manifest and Bundles
- Manifest is a JSON file that contains a list of all assets and their properties.
- Bundles are a way to group assets together.

```js
import { Assets } from 'pixi.js';

// Manifest Example
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                {
                    name: 'background',
                    srcs: 'sunset.png',
                },
                {
                    name: 'bar',
                    srcs: 'load-bar.{png,webp}',
                },
            ],
        },
        {
            name: 'game-screen',
            assets: [
                {
                    name: 'character',
                    srcs: 'robot.png',
                },
                {
                    name: 'enemy',
                    srcs: 'bad-guy.png',
                },
            ],
        },
    ]
};

await Asset.init({ manifest });

// Load a bundle...
loadScreenAssets = await Assets.loadBundle('load-screen');
// Load another bundle...
gameScreenAssets = await Assets.loadBundle('game-screen');
```

**`Example`**

```ts
import { Assets } from 'pixi.js';

const bunny = await Assets.load('bunny.png');
```

## Constructors

### constructor

• **new AssetsClass**()

#### Defined in

[pixijs/packages/assets/src/Assets.ts:223](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L223)

## Properties

### cache

• **cache**: `CacheClass`

The global cache of all assets within PixiJS

#### Defined in

[pixijs/packages/assets/src/Assets.ts:214](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L214)

___

### loader

• **loader**: [`Loader`](pixi_assets.Loader.md)

The loader, loads stuff!

#### Defined in

[pixijs/packages/assets/src/Assets.ts:209](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L209)

___

### resolver

• **resolver**: [`Resolver`](pixi_assets.Resolver.md)

the resolver to map various urls

#### Defined in

[pixijs/packages/assets/src/Assets.ts:204](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L204)

## Accessors

### detections

• `get` **detections**(): [`FormatDetectionParser`](../interfaces/pixi_assets.FormatDetectionParser.md)[]

All the detection parsers currently added to the Assets class.

#### Returns

[`FormatDetectionParser`](../interfaces/pixi_assets.FormatDetectionParser.md)[]

#### Defined in

[pixijs/packages/assets/src/Assets.ts:815](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L815)

___

### preferWorkers

• `get` **preferWorkers**(): `boolean`

When set to `true`, loading and decoding images will happen with Worker thread,
if available on the browser. This is much more performant as network requests
and decoding can be expensive on the CPU. However, not all environments support
Workers, in some cases it can be helpful to disable by setting to `false`.

**`Default`**

true

#### Returns

`boolean`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:827](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L827)

• `set` **preferWorkers**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:831](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L831)

## Methods

### add

▸ **add**(`keysIn`, `assetsIn`, `data?`): `void`

Allows you to specify how to resolve any assets load requests.
There are a few ways to add things here as shown below:

**`Example`**

```ts
import { Assets } from 'pixi.js';

// Simple
Assets.add('bunnyBooBoo', 'bunny.png');
const bunny = await Assets.load('bunnyBooBoo');

// Multiple keys:
Assets.add(['burger', 'chicken'], 'bunny.png');

const bunny = await Assets.load('burger');
const bunny2 = await Assets.load('chicken');

// passing options to to the object
Assets.add(
    'bunnyBooBooSmooth',
    'bunny{png,webp}',
    { scaleMode: SCALE_MODES.NEAREST }, // Base texture options
);

// Multiple assets

// The following all do the same thing:

Assets.add('bunnyBooBoo', 'bunny{png,webp}');

Assets.add('bunnyBooBoo', [
    'bunny.png',
    'bunny.webp',
]);

Assets.add('bunnyBooBoo', [
    {
        format: 'png',
        src: 'bunny.png',
    },
    {
        format: 'webp',
        src: 'bunny.webp',
    },
]);

const bunny = await Assets.load('bunnyBooBoo'); // Will try to load WebP if available
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keysIn` | `string` \| `string`[] | the key or keys that you will reference when loading this asset |
| `assetsIn` | `string` \| (`string` \| [`ResolveAsset`](../interfaces/pixi_assets.ResolveAsset.md))[] | the asset or assets that will be chosen from when loading via the specified key |
| `data?` | `unknown` | asset-specific data that will be passed to the loaders - Useful if you want to initiate loaded objects with specific data |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:373](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L373)

___

### addBundle

▸ **addBundle**(`bundleId`, `assets`): `void`

This adds a bundle of assets in one go so that you can load them as a group.
For example you could add a bundle for each screen in you pixi app

**`Example`**

```ts
import { Assets } from 'pixi.js';

Assets.addBundle('animals', {
    bunny: 'bunny.png',
    chicken: 'chicken.png',
    thumper: 'thumper.png',
});

const assets = await Assets.loadBundle('animals');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleId` | `string` | the id of the bundle to add |
| `assets` | [`ResolverAssetsObject`](../modules/pixi_assets.md#resolverassetsobject) \| [`ResolverAssetsArray`](../modules/pixi_assets.md#resolverassetsarray) | a record of the asset or assets that will be chosen from when loading via the specified key |

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:460](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L460)

___

### backgroundLoad

▸ **backgroundLoad**(`urls`): `Promise`<`void`\>

Initiate a background load of some assets. It will passively begin to load these assets in the background.
So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately

An example of this might be that you would background load game assets after your inital load.
then when you got to actually load your game screen assets when a player goes to the game - the loading
would already have stared or may even be complete, saving you having to show an interim load bar.

**`Example`**

```ts
import { Assets } from 'pixi.js';

Assets.backgroundLoad('bunny.png');

// later on in your app...
await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `urls` | `string` \| `string`[] | the url / urls you want to background load |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:577](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L577)

___

### backgroundLoadBundle

▸ **backgroundLoadBundle**(`bundleIds`): `Promise`<`void`\>

Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
this can only be used if the loader has been initiated with a manifest

**`Example`**

```ts
import { Assets } from 'pixi.js';

await Assets.init({
    manifest: {
        bundles: [
            {
                name: 'load-screen',
                assets: [...],
            },
            ...
        ],
    },
});

Assets.backgroundLoadBundle('load-screen');

// Later on in your app...
await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleIds` | `string` \| `string`[] | the bundleId / bundleIds you want to background load |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:618](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L618)

___

### get

▸ **get**<`T`\>(`keys`): `T`

Instantly gets an asset already loaded from the cache. If the asset has not yet been loaded,
it will return undefined. So it's on you! When in doubt just use `Assets.load` instead.
(Remember, the loader will never load things more than once!)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `string` | The key or keys for the assets that you want to access |

#### Returns

`T`

- The assets or hash of assets requested

#### Defined in

[pixijs/packages/assets/src/Assets.ts:659](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L659)

▸ **get**<`T`\>(`keys`): `Record`<`string`, `T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |

#### Returns

`Record`<`string`, `T`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:660](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L660)

___

### init

▸ **init**(`options?`): `Promise`<`void`\>

Best practice is to call this function before any loading commences
Initiating is the best time to add any customization to the way things are loaded.

you do not need to call this for the Asset class to work, only if you want to set any initial properties

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`AssetInitOptions`](../interfaces/pixi_assets.AssetInitOptions.md) | options to initialize the Asset manager with |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:242](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L242)

___

### load

▸ **load**<`T`\>(`urls`, `onProgress?`): `Promise`<`T`\>

Loads your assets! You pass in a key or URL and it will return a promise that
resolves to the loaded asset. If multiple assets a requested, it will return a hash of assets.

Don't worry about loading things multiple times, behind the scenes assets are only ever loaded
once and the same promise reused behind the scenes so you can safely call this function multiple
times with the same key and it will always return the same asset.

**`Example`**

```ts
import { Assets } from 'pixi.js';

// Load a URL:
const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture

Assets.add('thumper', 'bunny.png');
Assets.add('chicko', 'chicken.png');

// Load multiple assets:
const textures = await Assets.load(['thumper', 'chicko']); // => {thumper: Texture, chicko: Texture}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `urls` | `string` \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\> | the urls to load |
| `onProgress?` | [`ProgressCallback`](../modules/pixi_assets.md#progresscallback) | optional function that is called when progress on asset loading is made. The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0) of the assets loaded. |

#### Returns

`Promise`<`T`\>

- the assets that were loaded, either a single asset or a hash of assets

#### Defined in

[pixijs/packages/assets/src/Assets.ts:402](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L402)

▸ **load**<`T`\>(`urls`, `onProgress?`): `Promise`<`Record`<`string`, `T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `urls` | `string`[] \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\>[] |
| `onProgress?` | [`ProgressCallback`](../modules/pixi_assets.md#progresscallback) |

#### Returns

`Promise`<`Record`<`string`, `T`\>\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:406](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L406)

___

### loadBundle

▸ **loadBundle**(`bundleIds`, `onProgress?`): `Promise`<`any`\>

Bundles are a way to load multiple assets at once.
If a manifest has been provided to the init function then you can load a bundle, or bundles.
you can also add bundles via `addBundle`

**`Example`**

```ts
import { Assets } from 'pixi.js';

// Manifest Example
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                {
                    name: 'background',
                    srcs: 'sunset.png',
                },
                {
                    name: 'bar',
                    srcs: 'load-bar.{png,webp}',
                },
            ],
        },
        {
            name: 'game-screen',
            assets: [
                {
                    name: 'character',
                    srcs: 'robot.png',
                },
                {
                    name: 'enemy',
                    srcs: 'bad-guy.png',
                },
            ],
        },
    ]
};

await Asset.init({ manifest });

// Load a bundle...
loadScreenAssets = await Assets.loadBundle('load-screen');
// Load another bundle...
gameScreenAssets = await Assets.loadBundle('game-screen');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleIds` | `string` \| `string`[] | the bundle id or ids to load |
| `onProgress?` | [`ProgressCallback`](../modules/pixi_assets.md#progresscallback) | Optional function that is called when progress on asset loading is made. The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0) of the assets loaded. Do not use this function to detect when assets are complete and available, instead use the Promise returned by this function. |

#### Returns

`Promise`<`any`\>

all the bundles assets or a hash of assets for each bundle specified

#### Defined in

[pixijs/packages/assets/src/Assets.ts:517](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L517)

___

### reset

▸ **reset**(): `void`

Only intended for development purposes.
This will wipe the resolver and caches.
You will need to reinitialize the Asset

#### Returns

`void`

#### Defined in

[pixijs/packages/assets/src/Assets.ts:643](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L643)

___

### unload

▸ **unload**(`urls`): `Promise`<`void`\>

Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
this will make sure to destroy any assets and release them from memory.
Once unloaded, you will need to load the asset again.

Use this to help manage assets if you find that you have a large app and you want to free up memory.

- it's up to you as the developer to make sure that textures are not actively being used when you unload them,
Pixi won't break but you will end up with missing assets. Not a good look for the user!

**`Example`**

```ts
import { Assets } from 'pixi.js';

// Load a URL:
const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture

await Assets.unload('http://some.url.com/image.png')

// myImageTexture will be destroyed now.

// Unload multiple assets:
const textures = await Assets.unload(['thumper', 'chicko']);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `urls` | `string` \| `string`[] \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\> \| [`LoadAsset`](../interfaces/pixi_assets.LoadAsset.md)<`any`\>[] | the urls to unload |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:745](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L745)

___

### unloadBundle

▸ **unloadBundle**(`bundleIds`): `Promise`<`void`\>

Bundles are a way to manage multiple assets at once.
this will unload all files in a bundle.

once a bundle has been unloaded, you need to load it again to have access to the assets.

**`Example`**

```ts
import { Assets } from 'pixi.js';

Assets.addBundle({
    'thumper': 'http://some.url.com/thumper.png',
})

const assets = await Assets.loadBundle('thumper');

// Now to unload...

await Assets.unloadBundle('thumper');

// All assets in the assets object will now have been destroyed and purged from the cache
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bundleIds` | `string` \| `string`[] | the bundle id or ids to unload |

#### Returns

`Promise`<`void`\>

#### Defined in

[pixijs/packages/assets/src/Assets.ts:785](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/assets/src/Assets.ts#L785)
