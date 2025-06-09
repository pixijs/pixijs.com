---
sidebar_position: -1
description: Learn how to manage and load assets in PixiJS using the Assets API.
---

# Assets

PixiJS has the `Assets` singleton which is used to streamline resource loading. It’s modern, Promise-based, cache-aware, and highly extensible—making it the one stop shop for all PixiJS resource management!

```ts
import { Assets } from 'pixi.js';

await Assets.init({ ... });

const texture = await Assets.load('path/to/hero.png');
```

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

---

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

---

## Advanced Usage

There are several advanced features available in the `Assets` API that can help you manage your assets more effectively.
You can read more about these features in the rest of the documentation:

- [Resolving Assets](./resolver.md)
- [Manifests & Bundles (Recommended)](./manifest.md)
- [Background Loading](./background-loader.md)
- [Compressed Textures](./compressed-textures.md)

---

## API Reference

- [Overview](https://pixijs.download/release/docs/assets.html)
- [Assets](https://pixijs.download/release/docs/assets.Assets.html)
