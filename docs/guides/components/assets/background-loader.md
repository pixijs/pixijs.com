---
sidebar_position: 2
---

# Background Loader

PixiJS provides a **background loader** that allows you to load assets in the background while your application is running. This is useful for loading large assets or multiple assets without blocking the main thread. This can help improve the responsiveness of your application, reduce the initial loading time, and potentially void showing multiple loading screens to the user.

## Loading Bundles

The most effective way to use the background loader is to load bundles of assets. Bundles are groups of assets that are related to each other in some way, such as all the assets for a specific screen or level in your game. By loading bundles in the background, you can ensure that the assets are available when you need them without blocking the main thread.

```ts
    const manifest = {
        bundles: [
            {
                name: 'home-screen',
                assets: [
                    { alias: 'flowerTop', src: 'https://pixijs.com/assets/flowerTop.png' },
                ],
            },
            {
                name: 'game-screen',
                assets: [
                    { alias: 'eggHead', src: 'https://pixijs.com/assets/eggHead.png' },
                ],
            },
        ],
    };

    // Initialize the asset system with a manifest
    await Assets.init({ manifest });

    // Start loading both bundles in the background
    Assets.backgroundLoadBundle(['game-screen']);

    // Load only the first screen assets immediately
    const resources = await Assets.loadBundle('home-screen');
```

## Loading Individual Assets
You can also load individual assets in the background using the `Assets.backgroundLoad()` method. This is useful for loading assets that are not part of a bundle or for loading additional assets after the initial load.

```ts
    // Load an individual asset in the background
    Assets.backgroundLoad({ alias: 'flowerTop', src: 'https://pixijs.com/assets/flowerTop.png' });

    // Load another asset in the background
    Assets.backgroundLoad({ alias: 'eggHead', src: 'https://pixijs.com/assets/eggHead.png' });
```
