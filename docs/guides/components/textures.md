---
sidebar_position: 3
---

# Textures

Textures are one of the most essential components in the PixiJS rendering pipeline. They define the visual content used by Sprites, Meshes, and other renderable objects. This guide covers how textures are loaded, created, and used, along with the various types of data sources PixiJS supports.

## Texture Lifecycle

The texture system is built around two major classes:

- **`TextureSource`**: Represents a pixel source, such as an image, canvas, or video.
- **`Texture`**: Defines a view into a `TextureSource`, including sub-rectangles, trims, and transformations.

### Lifecycle Flow

```
Source File/Image -> TextureSource -> Texture -> Sprite (or other display object)
```

### Loading Textures

Textures can be loaded asynchronously using the `Assets` system:

```ts
const texture = await Assets.load('myTexture.png');

const sprite = new Sprite(texture);
```

### Preparing Textures

Even after you've loaded your textures, the images still need to be pushed to the GPU and decoded. Doing this for a large number of source images can be slow and cause lag spikes when your project first loads. To solve this, you can use the [Prepare](https://pixijs.download/release/docs/rendering.PrepareSystem.html) plugin, which allows you to pre-load textures in a final step before displaying your project.

## Texture vs. TextureSource

The `TextureSource` handles the raw pixel data and GPU upload. A `Texture` is a lightweight view on that source, with metadata such as trimming, frame rectangle, UV mapping, etc. Multiple `Texture` instances can share a single `TextureSource`, such as in a sprite sheet.

```ts
const sheet = await Assets.load('spritesheet.json');
const heroTexture = sheet.textures['hero.png'];
```

## Texture Creation

You can manually create textures using the constructor:

```ts
const mySource = new TextureSource({ resource: myImage });
const texture = new Texture({ source: mySource });
```

Set `dynamic: true` in the `Texture` options if you plan to modify its `frame`, `trim`, or `source` at runtime.

## Destroying Textures

Once you're done with a Texture, you may wish to free up the memory (both WebGL-managed buffers and browser-based) that it uses. To do so, you should call `Assets.unload('texture.png')`, or `texture.destroy()` if you have created the texture outside of Assets.

This is a particularly good idea for short-lived imagery like cut-scenes that are large and will only be used once. If a texture is destroyed that was loaded via `Assets` then the assets class will automatically remove it from the cache for you.

## Unload Texture from GPU

If you want to unload a texture from the GPU but keep it in memory, you can call `texture.source.unload()`. This will remove the texture from the GPU but keep the source in memory.

```ts
// Load the texture
const texture = await Assets.load('myTexture.png');

// ... Use the texture

// Unload the texture from the GPU
texture.source.unload();
```

## Texture Types

PixiJS supports multiple `TextureSource` types, depending on the kind of input data:

| Texture Type          | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| **ImageSource**       | HTMLImageElement, ImageBitmap, SVG's, VideoFrame, etc.            |
| **CanvasSource**      | HTMLCanvasElement or OffscreenCanvas                              |
| **VideoSource**       | HTMLVideoElement with optional auto-play and update FPS           |
| **BufferImageSource** | TypedArray or ArrayBuffer with explicit width, height, and format |
| **CompressedSource**  | Array of compressed mipmaps (Uint8Array\[])                       |

## Common Texture Properties

Here are some important properties of the `Texture` class:

- `frame`: Rectangle defining the visible portion within the source.
- `orig`: Original untrimmed dimensions.
- `trim`: Defines trimmed regions to exclude transparent space.
- `uvs`: UV coordinates generated from `frame` and `rotate`.
- `rotate`: GroupD8 rotation value for atlas compatibility.
- `defaultAnchor`: Default anchor when used in Sprites.
- `defaultBorders`: Used for 9-slice scaling.
- `source`: The `TextureSource` instance.

## Common TextureSource Properties

Here are some important properties of the `TextureSource` class:

- `resolution`: Affects render size relative to actual pixel size.
- `format`: Texture format (e.g., `rgba8unorm`, `bgra8unorm`, etc.)
- `alphaMode`: Controls how alpha is interpreted on upload.
- `wrapMode` / `scaleMode`: Controls how texture is sampled outside of bounds or when scaled.
- `autoGenerateMipmaps`: Whether to generate mipmaps on upload.

You can set these properties when creating a `TextureSource`:

```ts
texture.source.scaleMode = 'linear';
texture.source.wrapMode = 'repeat';
```

---

## API Reference

### Static Properties

| Property        | Type                         | Description                                                     |
| --------------- | ---------------------------- | --------------------------------------------------------------- |
| `Texture.EMPTY` | `Texture`                    | A permanently blank texture used internally.                    |
| `Texture.WHITE` | `Texture<BufferImageSource>` | A 1×1 white texture used internally for fills and placeholders. |

### Static Methods

| Method                         | Returns   | Description                                                         |
| ------------------------------ | --------- | ------------------------------------------------------------------- |
| `Texture.from(id, skipCache?)` | `Texture` | Creates a texture from a loaded asset, source, or resource options. |

---

### Instance Properties

| Property         | Type                       | Description                                                      |
| ---------------- | -------------------------- | ---------------------------------------------------------------- |
| `uid`            | `number`                   | Unique identifier for the texture.                               |
| `label`          | `string`                   | Optional label used for debugging.                               |
| `source`         | `TextureSource`            | The underlying resource for the texture. Replaces `baseTexture`. |
| `rotate`         | `number`                   | Rotation value from texture packer. Uses `groupD8` constants.    |
| `frame`          | `Rectangle`                | The rectangular area of the source to render.                    |
| `orig`           | `Rectangle`                | Original full rectangle before trimming or framing.              |
| `trim`           | `Rectangle`                | Trimmed area from original texture.                              |
| `uvs`            | `UVs`                      | Calculated UV coordinates based on frame.                        |
| `defaultAnchor`  | `{ x: number, y: number }` | Default anchor point used in Sprites.                            |
| `defaultBorders` | `TextureBorders`           | Borders used for 9-slice scaling.                                |
| `destroyed`      | `boolean`                  | Whether the texture has been destroyed.                          |
| `dynamic`        | `boolean`                  | Set `true` if modifying frame or UVs at runtime.                 |
| `noFrame`        | `boolean`                  | Whether this texture was created without a defined frame.        |
| `textureMatrix`  | `TextureMatrix`            | Lazily computed matrix for mapping texture coordinates.          |
| `width`          | `number`                   | Width of the texture in pixels.                                  |
| `height`         | `number`                   | Height of the texture in pixels.                                 |
| `isTexture`      | `true`                     | Used for type checking.                                          |

---

### Instance Methods

| Method                             | Returns | Description                                                                            |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `update()`                         | `void`  | Recalculates UVs and emits an update event. Call after modifying frame or source.      |
| `updateUvs()`                      | `void`  | Recalculates the UV mapping for the texture. Called internally during setup or update. |
| `destroy(destroySource?: boolean)` | `void`  | Disposes the texture and optionally destroys its source.                               |

---

### Events

| Event       | Payload   | Description                          |
| ----------- | --------- | ------------------------------------ |
| `'update'`  | `Texture` | Fired when UVs or dimensions change. |
| `'destroy'` | `Texture` | Fired when the texture is destroyed. |
