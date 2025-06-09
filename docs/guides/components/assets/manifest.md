---
sidebar_position: 1
description: Learn how to manage assets in PixiJS using Manifests and Bundles, and how to automate this process with AssetPack.
---

# Manifests & Bundles

PixiJS has a structured and scalable approach to asset management through **Manifests** and **Bundles**. This is the recommended way to manage assets in your PixiJS applications, especially for larger projects or those that require dynamic loading of assets based on context or user interaction. This guide explains what they are, how to use them, and how to generate them efficiently using [AssetPack](https://github.com/pixijs/AssetPack) — a tool designed to automate manifest and bundle creation.

---

## What Is a Manifest?

A **Manifest** is a descriptor object that defines your asset loading strategy. It lists all bundles, each of which contains grouped assets by name and alias. This structure allows for lazy-loading assets based on application context (e.g. load screen assets, level-specific content, etc.).

```js
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                { alias: 'background', src: 'sunset.png' },
                { alias: 'bar', src: 'load-bar.{png,webp}' },
            ],
        },
        {
            name: 'game-screen',
            assets: [
                { alias: 'character', src: 'robot.png' },
                { alias: 'enemy', src: 'bad-guy.png' },
            ],
        },
    ],
};
```

### Initializing With a Manifest

To initialize PixiJS asset handling with a manifest:

```js
import { Assets } from 'pixi.js';

await Assets.init({ manifest });
```

Once initialized, you can load bundles by name:

```js
const loadScreenAssets = await Assets.loadBundle('load-screen');
const gameScreenAssets = await Assets.loadBundle('game-screen');
```

It should be noted that you can still load assets directly without loading an entire bundle via their alias:

```js
await Assets.init({ manifest });
const background = await Assets.load('background');
const bar = await Assets.load('bar');
```

---

## What Is a Bundle?

A **Bundle** is a group of assets that are identified by a shared name. While bundles can be pre-defined in a manifest, they can also be dynamically registered at runtime.

### Adding a Bundle Dynamically

This approach is helpful for scenarios where you want to define bundles on the fly:

```js
import { Assets } from 'pixi.js';

Assets.addBundle('animals', [
    { alias: 'bunny', src: 'bunny.png' },
    { alias: 'chicken', src: 'chicken.png' },
    { alias: 'thumper', src: 'thumper.png' },
]);

const assets = await Assets.loadBundle('animals');

// or load a specific asset from the bundle
const bunny = await Assets.load('bunny');
```

---

## Recommended Tool: AssetPack

Managing manifests and bundles manually can be error-prone. [**AssetPack**](https://pixijs.io/assetpack) is a CLI tool that scans your assets folder and generates optimized manifests and bundles automatically.

### Key Benefits

- Organizes assets by directory or pattern
- Supports output in PixiJS manifest format
- Reduces boilerplate and risk of manual mistakes

You can integrate AssetPack into your build pipeline to generate the manifest file and load it using `Assets.init({ manifest })`.
