# Assets

The [`Assets`](https://pixijs.download/v8.23.0/docs/assets.Assets.html) singleton is how you load images, spritesheets, fonts, and other resources in PixiJS. It's Promise-based, caches results automatically, and picks the best file format for the user's device. Most PixiJS projects use `Assets.load()` as their first step after creating an `Application`.

```ts
import { Assets, Texture } from 'pixi.js';

await Assets.init({
  basePath: 'assets/',
});

// Load a single asset
const texture = await Assets.load<Texture>('bunny.png');

// Load multiple assets
const assets = await Assets.load(['bunny.png', 'spritesheet.json', 'font.ttf']);
```

## Supported file types

| Type                | Extensions                                                       | Loaders                                                               |
| ------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| Textures            | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`, `.svg`        | [`loadTextures`](https://pixijs.download/v8.23.0/docs/assets.loadTextures.html), [`loadSvg`](https://pixijs.download/v8.23.0/docs/assets.loadSvg.html)                                 |
| Video Textures      | `.mp4`, `.m4v`, `.webm`, `.ogg`, `.ogv`, `.h264`, `.avi`, `.mov` | [`loadVideoTextures`](https://pixijs.download/v8.23.0/docs/assets.loadVideoTextures.html)                                             |
| Sprite Sheets       | `.json`                                                          | [`spritesheetAsset`](https://pixijs.download/v8.23.0/docs/assets.spritesheetAsset.html)                                              |
| Bitmap Fonts        | `.fnt`, `.xml`                                                   | [`loadBitmapFont`](https://pixijs.download/v8.23.0/docs/assets.loadBitmapFont.html)                                                |
| Web Fonts           | `.ttf`, `.otf`, `.woff`, `.woff2`                                | [`loadWebFont`](https://pixijs.download/v8.23.0/docs/assets.loadWebFont.html)                                                   |
| JSON                | `.json`                                                          | [`loadJson`](https://pixijs.download/v8.23.0/docs/assets.loadJson.html)                                                      |
| Text                | `.txt`                                                           | [`loadTxt`](https://pixijs.download/v8.23.0/docs/assets.loadTxt.html)                                                       |
| Compressed Textures | `.basis`, `.dds`, `.ktx`, `.ktx2`                                | [`loadBasis`](https://pixijs.download/v8.23.0/docs/assets.loadBasis.html), [`loadDDS`](https://pixijs.download/v8.23.0/docs/assets.loadDDS.html), [`loadKTX`](https://pixijs.download/v8.23.0/docs/assets.loadKTX.html), [`loadKTX2`](https://pixijs.download/v8.23.0/docs/assets.loadKTX2.html) |

You can add custom parsers for additional formats via [`LoaderParser`](https://pixijs.download/v8.23.0/docs/assets.LoaderParser.html).

---

## Loading assets

Call `Assets.load()` with a URL or array of URLs. It returns a Promise that resolves to the loaded resource.

```ts
import { Application, Assets, Sprite, Texture } from 'pixi.js';

const app = new Application();
await app.init({ backgroundColor: 0x1099bb });

// Load a single asset
const bunnyTexture = await Assets.load<Texture>('path/to/bunny.png');
const sprite = new Sprite(bunnyTexture);

// Load multiple assets at once
const textures = await Assets.load<Texture>(['path/to/bunny.png', 'path/to/cat.png']);
const bunnySprite = new Sprite(textures['path/to/bunny.png']);
const catSprite = new Sprite(textures['path/to/cat.png']);
```

PixiJS determines how to load the asset based on its file extension and caches the result to avoid redundant downloads.

### Repeated loads are safe

`Assets` caches by URL or alias. Requests for the same resource return the same instance:

```ts
const p1 = await Assets.load('bunny.png');
const p2 = await Assets.load('bunny.png');
console.log(p1 === p2); // true
```

### Asset aliases

Use aliases to reference assets by name instead of full URLs:

```ts
await Assets.load<Texture>({ alias: 'bunny', src: 'path/to/bunny.png' });
const bunnyTexture = Assets.get('bunny');
```

All Asset APIs support aliases, including `Assets.load()`, `Assets.get()`, and `Assets.unload()`. For more complex resolution rules, see the [Resolver](https://pixijs.com/8.x/guides/components/assets/resolver.md) guide.

### Retrieving loaded assets

Retrieve previously loaded assets with `Assets.get()`:

```ts
await Assets.load<Texture>('path/to/bunny.png');
const bunnyTexture = Assets.get('path/to/bunny.png');
const sprite = new Sprite(bunnyTexture);
```

### Unloading assets

`Assets.unload()` removes an asset from the cache and frees memory:

```ts
await Assets.unload('path/to/bunny.png');
```

---

## Load options and strategies

Asset loading can fail for many reasons (network issues, corrupt files, unsupported formats). The loader provides configurable behavior through `LoadOptions`. Supply these per call or globally via `Assets.init` or `Loader.defaultOptions`.

Supported options:

- `onProgress(progress: number)`: Called as each asset completes (0.0 to 1.0)
- `onError(error: Error, asset)`: Called when an individual asset fails
- `strategy`: `'throw'` | `'skip'` | `'retry'`
- `retryCount`: Number of retry attempts when strategy is `'retry'` (default 3)
- `retryDelay`: Delay in ms between retries (default 250)

### Strategies

| Strategy | Behavior                                                                    | Error propagation         | Use when                          |
| -------- | --------------------------------------------------------------------------- | ------------------------- | --------------------------------- |
| throw    | First failure rejects the load promise                                      | Yes (immediate)           | Critical assets must all succeed  |
| skip     | Failed assets are ignored; others continue                                  | No (but onError fires)    | Optional / best-effort assets     |
| retry    | Retries each failing asset up to `retryCount`, then throws if still failing | Yes (after final attempt) | Transient network/CDN instability |

```ts
await Assets.init({
  loadOptions: {
    strategy: 'retry',
    retryCount: 4,
    retryDelay: 400,
    onError: (err, asset) => console.debug('Retrying:', asset.src),
  },
});

// Later calls inherit these unless overridden
await Assets.load('critical.json');

// Skip missing optional texture
const tex = await Assets.load('optional.png', {
  strategy: 'skip',
  onError: (err, asset) => console.warn('Skipped:', asset, err.message),
});
```

---

## Asset bundles

Group related assets into bundles for organized loading:

```ts
Assets.addBundle('loading-screen', [
  { alias: 'background', src: 'bg.png' },
  { alias: 'progress-bar', src: 'bar.png' },
]);

Assets.addBundle('game', [
  { alias: 'character', src: 'hero.png' },
  { alias: 'enemies', src: 'monsters.json' },
]);

const loadingAssets = await Assets.loadBundle('loading-screen');
const gameAssets = await Assets.loadBundle('game');
```

For manifest-based bundles, see the [Manifests & Bundles](https://pixijs.com/8.x/guides/components/assets/manifest.md) guide.

---

## Background loading

Load assets in the background while the application runs:

```ts
Assets.backgroundLoad(['level1.json', 'level2.json']);

// Later, these resolve immediately if already loaded
const level1 = await Assets.load('level1.json');
const level2 = await Assets.load('level2.json');
```

See the [Background Loading](https://pixijs.com/8.x/guides/components/assets/background-loader.md) guide for details.

---

## Configuration

Provide options to `Assets.init()` to configure the loading process:

```ts
import { Assets } from 'pixi.js';

await Assets.init({
  basePath: 'assets/',
  texturePreference: {
    format: ['webp', 'png'],
    resolution: 2,
  },
  defaultSearchParams: {
    version: '1.0.0',
  },
});
```

| Option                | Type                          | Description                                                |
| --------------------- | ----------------------------- | ---------------------------------------------------------- |
| `basePath`            | `string`                      | Prefix applied to all relative asset paths (e.g. for CDNs) |
| `defaultSearchParams` | `string \| Record<string, any>` | Default URL parameters to append to all asset requests   |
| `skipDetections`      | `boolean`                     | Skip environment detection parsers for assets              |
| `manifest`            | `AssetsManifest`              | A descriptor of named asset bundles and their contents     |
| `preferences`         | `AssetsPreferences`           | Format and resolution preferences for loading              |
| `bundleIdentifier`    | `BundleIdentifierOptions`     | Override how bundle IDs are generated                      |
| `loadOptions`         | `LoadOptions`                 | Default load strategy, retry behavior, and error handling  |

---

## Cache management

```ts
// Check if asset is cached
const isCached = Assets.cache.has('texture.png');

// Get cached asset
const texture = Assets.get('texture.png');

// Unload specific assets
await Assets.unload('texture.png');

// Reset entire cache
Assets.reset();
```

---

## Recommendations

- Call `Assets.init()` before loading any assets
- Use bundles for organized loading
- Use format fallbacks (e.g., `image.{webp,png}`)
- Use background loading for non-critical assets
- Clean up unused assets with `Assets.unload()`
- Use manifests for larger applications

---

## API reference

- [`Assets`](https://pixijs.download/v8.23.0/docs/assets.Assets.html)
- [`AssetsManifest`](https://pixijs.download/v8.23.0/docs/assets.AssetsManifest.html)
- [`LoaderParser`](https://pixijs.download/v8.23.0/docs/assets.LoaderParser.html)
- [`CacheParser`](https://pixijs.download/v8.23.0/docs/assets.CacheParser.html)
- [`BackgroundLoader`](https://pixijs.download/v8.23.0/docs/assets.BackgroundLoader.html)
- [`Texture`](https://pixijs.download/v8.23.0/docs/rendering.Texture.html)
- [`Spritesheet`](https://pixijs.download/v8.23.0/docs/assets.Spritesheet.html)
- [`loadTextures`](https://pixijs.download/v8.23.0/docs/assets.loadTextures.html)
- [`loadWebFont`](https://pixijs.download/v8.23.0/docs/assets.loadWebFont.html)
