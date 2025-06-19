# Resolver

In PixiJS, asset management centers around the concept of `UnresolvedAsset` and `ResolvedAsset`. This system is designed to support multi-format assets, conditional loading, and runtime optimization based on platform capabilities (e.g., WebP support, device resolution, or performance constraints).

Rather than specifying a fixed URL, developers describe what assets _could_ be loaded — and PixiJS selects the best option dynamically.

## Resolver Lifecycle

The resolution process involves four key steps:

1. **UnresolvedAsset Creation**
   Assets defined using a string or object are internally normalized into `UnresolvedAsset` instances. These include metadata such as aliases, wildcard paths, parser hints, and custom data.

2. **Source Expansion**
   The `src` field of an `UnresolvedAsset` can be a string or array of strings. PixiJS expands any wildcard patterns (e.g. `myAsset@{1,2}x.{png,webp}`) into a list of concrete candidate URLs.

3. **Best-Match Selection**
   PixiJS evaluates all candidate URLs and uses platform-aware heuristics to pick the most suitable source. Factors include supported formats (e.g. WebP vs PNG), device pixel ratio, and custom configuration such as preferred formats.

4. **ResolvedAsset Output**
   The result is a `ResolvedAsset` containing a specific URL and all required metadata, ready to be passed to the relevant parser and loaded into memory.

## Using Unresolved Assets

An `UnresolvedAsset` is the primary structure used to define assets in PixiJS. It allows you to specify the source URL(s), alias(es), and any additional data needed for loading. They are more complex, but are also more powerful.

| Field              | Type                 | Description                                                                  |
| ------------------ | -------------------- | ---------------------------------------------------------------------------- |
| `alias`            | `string \| string[]` | One or more aliases used to reference this asset later.                      |
| `src`              | `string \| string[]` | Path or paths to one or more asset candidates. Supports wildcards.           |
| `loadParser` (opt) | `string`             | A specific parser to handle the asset (e.g. `'loadTextures'`, `'loadJson'`). |
| `data` (opt)       | `any`                | Extra data to pass into the loader. This varies by parser type.              |

## Examples

### Loading a Single Asset

```ts
import { Assets } from 'pixi.js';

await Assets.load({
  alias: 'bunny',
  src: 'images/bunny.png',
});
```

### Loading with Explicit Parser and Loader Options

```ts
await Assets.load({
  alias: 'bunny',
  src: 'images/bunny.png',
  loadParser: 'loadTextures',
  data: {
    alphaMode: 'no-premultiply-alpha',
  },
});
```

### Using Wildcards for Responsive and Format-Aware Loading

```ts
await Assets.load({
  alias: 'bunny',
  src: 'images/bunny@{0.5,1,2}x.{png,webp}',
});
```

This pattern expands internally to:

```ts
[
  'images/bunny@0.5x.png',
  'images/bunny@0.5x.webp',
  'images/bunny@1x.png',
  'images/bunny@1x.webp',
  'images/bunny@2x.png',
  'images/bunny@2x.webp',
];
```

PixiJS will select the best match depending on runtime capabilities (e.g. chooses WebP if supported, 2x if on a high-res display).

---

## Related Tools and Features

- **AssetPack**: If you're managing large asset sets, [AssetPack](https://pixijs.io/assetpack) can generate optimized manifests using glob patterns and output `UnresolvedAsset` structures automatically.
- **Asset Manifests & Bundles**: Use [manifests and bundles](./manifest.md) to predefine groups of unresolved assets and load them via `Assets.loadBundle`.
