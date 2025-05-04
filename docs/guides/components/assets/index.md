---
sidebar_position: -1
---

# Assets

PixiJS has the `Assets` singleton which is used to streamline resource loading. It’s modern, Promise-based, cache-aware, and highly extensible—making it the one stop shop for all PixiJS resource management!

## Key Capabilities

- **Asynchronous loading** of assets via Promises or async/await.
- **Caching** prevents redundant network requests.
- **Built-in support** for common media formats (images, video, fonts).
- **Custom parsers** and **resolvers** for flexibility.
- **Background loading, manifest-based bundles,** and **smart fallbacks**.

## Supported File Types

| Type                | Extensions                                                       | Loaders                           |
| ------------------- | ---------------------------------------------------------------- | --------------------------------- |
| Textures            | `.png`, `.jpg`, `.gif`, `.webp`, `.avif`, `.svg`                 | `loadTextures`, `loadSvg`         |
| Video Textures      | `.mp4`, `.m4v`, `.webm`, `.ogg`, `.ogv`, `.h264`, `.avi`, `.mov` | `loadVideoTextures`               |
| Sprite Sheets       | `.json`                                                          | `spritesheetAsset`                |
| Bitmap Fonts        | `.fnt`, `.xml`, `.txt`                                           | `loadBitmapFont`                  |
| Web Fonts           | `.ttf`, `.otf`, `.woff`, `.woff2`                                | `loadWebFont`                     |
| JSON                | `.json`                                                          | `loadJson`                        |
| Text                | `.txt`                                                           | `loadTxt`                         |
| Compressed Textures | `.basis`, `.dds`, `.ktx`, `.ktx2`                                | `loadBasis`, `loadDDS`, `loadKTX` |

> Need more? Add custom parsers!

## Getting started

### Loading Assets

Loading an asset with PixiJS is as simple as calling `Assets.load()` and passing in the asset’s URL. This function returns a `Promise` that resolves to the loaded resource—whether that’s a texture, font, JSON, or another supported format.

You can provide either an **absolute URL** (e.g. from a CDN):

```ts
const texture = await Assets.load('https://example.com/assets/hero.png');
```

Or a **relative path** within your project:

```ts
const texture = await Assets.load('assets/hero.png');
```

PixiJS will **_typically_** automatically determine how to load the asset based on its **file extension** and will cache the result to avoid redundant downloads.

```typescript
import { Application, Assets, Texture } from 'pixi.js';

const app = new Application();
// Application must be initialized before loading assets
await app.init({ backgroundColor: 0x1099bb });

// Load a single asset
const bunnyTexture = await Assets.load<Texture>('path/to/bunny.png');
const sprite = new Sprite(bunnyTexture);

// Load multiple assets at once
const textures = await Assets.load<Texture>(['path/to/bunny.png', 'path/to/cat.png']);
const bunnySprite = new Sprite(textures['path/to/bunny.png']);
const catSprite = new Sprite(textures['path/to/cat.png']);
```

### Repeated Loads Are Safe

`Assets` caches by URL or alias. Requests for the same resource return the **same texture**.

```ts
const p1 = await Assets.load('bunny.png');
const p2 = await Assets.load('bunny.png');
console.log(p1 === p2); // true
```

### Asset Aliases

You can also use aliases to refer to assets instead of their full URLs. This provides a more convenient way to manage assets, especially when you have long or complex URLs.

```ts
await Assets.load<Texture>({ alias: 'bunny', src: 'path/to/bunny.png' });
const bunnyTexture = Assets.get('bunny');
```

All Asset APIs support aliases, including `Assets.load()`, `Assets.get()`, and `Assets.unload()`.

There is more complex ways of defining assets and you can read about them in the [Resolver](./resolver.md) section.

### Retrieving Loaded Assets

You can also retrieve assets that have already been loaded using `Assets.get()`:

```ts
await Assets.load<Texture>('path/to/bunny.png');
const bunnyTexture = Assets.get('path/to/bunny.png');
const sprite = new Sprite(bunnyTexture);
```

This is useful for when you have preloaded your assets elsewhere in your code and want to access them later without having to pass round references from the initial load.

### Unloading Assets

To unload an asset, you can use `Assets.unload()`. This will remove the asset from the cache and free up memory. Note that if you try to access the asset after unloading it, you will need to load it again.

```ts
await Assets.load<Texture>('path/to/bunny.png');
const bunnyTexture = Assets.get('path/to/bunny.png');
const sprite = new Sprite(bunnyTexture);
// Unload the asset
await Assets.unload('path/to/bunny.png');
```

### Customizing Asset Loading

You can customize the asset loading process by providing options to the `Assets.init()` method. This allows you to set preferences for how assets are loaded, specify a base path for assets, and more.

```ts
import { Assets } from 'pixi.js';

await Assets.init({...});
```

| Option                | Type                      | Description                                                   |
| --------------------- | ------------------------- | ------------------------------------------------------------- |
| `basePath`            | `string`                  | Prefix applied to all relative asset paths (e.g. for CDNs).   |
| `defaultSearchParams` | `string`                  | A default URL parameter string to append to all assets loaded |
| `skipDetections`      | `boolean`                 | Skip environment detection parsers for assets.                |
| `manifest`            | `Manifest`                | A descriptor of named asset bundles and their contents.       |
| `preferences`         | `AssetPreferences`        | Specifies preferences for each loader                         |
| `bundleIdentifier`    | `BundleIdentifierOptions` | **Advanced** - Override how bundlesIds are generated.         |

## Advanced Usage

There are several advanced features available in the `Assets` API that can help you manage your assets more effectively.
You can read more about these features in the rest of the documentation:

- [Resolving Assets](./resolver.md)
- [Manifests & Bundles (Recommended)](./manifest.md)
- [Background Loading](./background-loader.md)
- [Compressed Textures](./compressed-textures.md)

## API Reference

| Name                  | Type                              | Description                                                                 |
| --------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| `Assets.init`         | `AssetsInitOptions`               | Initializes the asset manager with the specified options.                   |
| `Assets.load`         | `ArrayOr<string/UnresolvedAsset>` | Loads an asset from the specified URL.                                      |
| `Assets.loadBundle`   | `ArrayOr<string>`                 | Loads a bundle of assets with the specified name.                           |
| `Assets.get`          | `ArrayOr<string>`                 | Retrieves a loaded asset by its URL. Returns the loaded asset.              |
| `Assets.getBundle`    | `ArrayOr<string>`                 | Retrieves a loaded bundle of assets by its name. Returns the loaded assets. |
| `Assets.unload`       | `ArrayOr<string>`                 | Unloads an asset by its URL.                                                |
| `Assets.unloadBundle` | `ArrayOr<string>`                 | Unloads a bundle of assets by its name.                                     |

<!--
A one stop shop for all Pixi resource management!
Super modern and easy to use, with enough flexibility to customize and do what you need!

Use the singleton class [Assets](#) to easily load and manage all your assets.

```typescript
import { Assets, Texture } from 'pixi.js';

const bunnyTexture = await Assets.load<Texture>('bunny.png');
const sprite = new Sprite(bunnyTexture);
````

Check out the sections below for more information on how to deal with assets.

<details id="assets-loading">

<summary>Asset Loading</summary>

Do not be afraid to load things multiple times - under the hood, it will **NEVER** load anything more than once.

_For example:_

```js
import { Assets } from 'pixi.js';

promise1 = Assets.load('bunny.png');
promise2 = Assets.load('bunny.png');

// promise1 === promise2
```

Here both promises will be the same. Once resolved... Forever resolved! It makes for really easy resource management!

Out of the box Pixi supports the following files:

- Textures (**_avif_**, **_webp_**, **_png_**, **_jpg_**, **_gif_**, **_svg_**) via [loadTextures](#), [loadSvg](#)
- Video Textures (**_mp4_**, **_m4v_**, **_webm_**, **_ogg_**, **_ogv_**, **_h264_**, **_avi_**, **_mov_**) via [loadVideoTextures](#)
- Sprite sheets (**_json_**) via [spritesheetAsset](#)
- Bitmap fonts (**_xml_**, **_fnt_**, **_txt_**) via [loadBitmapFont](#)
- Web fonts (**_ttf_**, **_woff_**, **_woff2_**) via [loadWebFont](#)
- JSON files (**_json_**) via [loadJson](#)
- Text Files (**_txt_**) via [loadTxt](#)
<br/>
More types can be added fairly easily by creating additional [LoaderParsers](#).
  </details>

<details id="textures">

<summary>Textures</summary>

- Textures are loaded as ImageBitmap on a worker thread where possible. Leading to much less janky load + parse times.
- By default, we will prefer to load AVIF and WebP image files if you specify them.
  But if the browser doesn't support AVIF or WebP we will fall back to png and jpg.
- Textures can also be accessed via `Texture.from()` (see [Texture.from](#))
  and now use this asset manager under the hood!
- Don't worry if you set preferences for textures that don't exist
  (for example you prefer 2x resolutions images but only 1x is available for that texture,
  the Assets manager will pick that up as a fallback automatically)

#### Sprite sheets

- It's hard to know what resolution a sprite sheet is without loading it first, to address this
  there is a naming convention we have added that will let Pixi understand the image format and resolution
  of the spritesheet via its file name: `my-spritesheet{resolution}.{imageFormat}.json`
  <br/>
  For example:
    - `my-spritesheet@2x.webp.json`_ // 2x resolution, WebP sprite sheet_
    - `my-spritesheet@0.5x.png.json`_ // 0.5x resolution, png sprite sheet_
- This is optional! You can just load a sprite sheet as normal.
This is only useful if you have a bunch of different res / formatted spritesheets.
  </details>

<details id="fonts">

<summary>Fonts</summary>

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

</details>

<details id="background-loading">

<summary>Background Loading</summary>

Background loading will load stuff for you passively behind the scenes. To minimize jank,
it will only load one asset at a time. As soon as a developer calls `Assets.load(...)` the
background loader is paused and requested assets are loaded as a priority.
Don't worry if something is in there that's already loaded, it will just get skipped!

You still need to call `Assets.load(...)` to get an asset that has been loaded in the background.
It's just that this promise will resolve instantly if the asset
has already been loaded.

</details>

<details id="manifests-and-bundles">

<summary>Manifest and Bundles</summary>

- [Manifest](#) is a descriptor that contains a list of all assets and their properties.
- [Bundles](#) are a way to group assets together.

```js
import { Assets } from 'pixi.js';

// Manifest Example
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                {
                    alias: 'background',
                    src: 'sunset.png',
                },
                {
                    alias: 'bar',
                    src: 'load-bar.{png,webp}',
                },
            ],
        },
        {
            name: 'game-screen',
            assets: [
                {
                    alias: 'character',
                    src: 'robot.png',
                },
                {
                    alias: 'enemy',
                    src: 'bad-guy.png',
                },
            ],
        },
    ],
};

await Assets.init({ manifest });

// Load a bundle...
loadScreenAssets = await Assets.loadBundle('load-screen');
// Load another bundle...
gameScreenAssets = await Assets.loadBundle('game-screen');
```

</details> -->
