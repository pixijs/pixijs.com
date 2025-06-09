---
sidebar_position: 3
description: Learn how to use compressed textures in PixiJS for efficient memory usage and GPU performance.
---

# Compressed Textures

Compressed textures significantly reduce memory usage and GPU upload time, especially on mobile devices or lower-end hardware. PixiJS supports multiple compressed texture formats, but **you must configure the appropriate loaders** before using them.

## Supported Compressed Texture Formats

PixiJS provides built-in support for several widely-used compressed texture formats:

| Format    | File Extension | Description                                                             |
| --------- | -------------- | ----------------------------------------------------------------------- |
| **DDS**   | `.dds`         | DirectDraw Surface format, supports DXT variants (S3TC)                 |
| **KTX**   | `.ktx`         | Khronos format, supports ETC and other schemes                          |
| **KTX2**  | `.ktx2`        | Modern container supporting Basis Universal and Supercompressed formats |
| **Basis** | `.basis`       | Highly compressed format that can transcode to multiple GPU formats     |

## Registering Loaders

PixiJS does **not automatically include compressed texture support**. To use these formats, you must explicitly import the necessary loaders before loading any assets:

```ts
import 'pixi.js/dds';
import 'pixi.js/ktx';
import 'pixi.js/ktx2';
import 'pixi.js/basis';
```

:::info
You only need to import the loaders for the formats you're using. These imports must run **before** any call to `Assets.load`.
:::

## Using Compressed Textures in Assets

Once loaders are registered, you can load compressed textures just like any other asset:

```ts
import 'pixi.js/ktx2'; // Import the KTX2 loader
import { Assets } from 'pixi.js';

await Assets.load('textures/background.ktx2');
```

PixiJS will parse and upload the texture using the correct loader and GPU-compatible transcoding path based on the user's device.

---

## Integration with AssetPack

[**AssetPack**](https://pixijs.io/assetpack) supports automatic generation of compressed texture variants during the build step. You can:

- Convert `.png` or `.jpg` files into `.basis`, `.ktx2`, or `.dds` formats.
- Reference compressed files in your manifest using the same aliases or wildcard patterns.
- Use the **same manifest and loading workflow** — PixiJS will resolve and load the best available variant based on the device.

### Example

Your manifest might include:

```json
{
    "bundles": [
        {
            "name": "scene",
            "assets": [
                {
                    "alias": "bg",
                    "src": [
                      "assets/bg.ktx2",
                      "assets/bg.basis",
                      "assets/bg.png"
                    ]
                }
            ]
        }
    ]
}
```

PixiJS will try to load `bg.ktx2` or `bg.basis` first if the device supports it, falling back to `bg.png` as needed.
