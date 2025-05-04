---
sidebar_position: 5
title: Garbage Collection
---

# Managing Garbage Collection in PixiJS

Efficient resource management is crucial for maintaining optimal performance in any PixiJS application. This guide explores how PixiJS handles garbage collection, the tools it provides, and best practices for managing GPU resources effectively.

## Explicit Resource Management with `destroy`

PixiJS objects, such as textures, meshes, and other GPU-backed data, hold references that consume memory. To explicitly release these resources, call the `destroy` method on objects you no longer need. For example:

```javascript
import { Sprite } from 'pixi.js';

const sprite = new Sprite(texture);
// Use the sprite in your application

// When no longer needed
sprite.destroy();
```

Calling `destroy` ensures that the object’s GPU resources are freed immediately, reducing the likelihood of memory leaks and improving performance.

## Managing Textures with `texture.unload`

In cases where PixiJS’s automatic texture garbage collection is insufficient, you can manually unload textures from the GPU using `texture.unload()`:

```javascript
import { Texture } from 'pixi.js';

const texture = Texture.from('image.png');

// Use the texture

// When no longer needed
texture.unload();
```

This is particularly useful for applications that dynamically load large numbers of textures and require precise memory control.

## Automatic Texture Garbage Collection with `TextureGCSystem`

PixiJS also includes the `TextureGCSystem`, a system that manages GPU texture memory. By default:

- **Removes textures unused for 3600 frames** (approximately 1 hour at 60 FPS).
- **Checks every 600 frames** for unused textures.

### Customizing `TextureGCSystem`

You can adjust the behavior of `TextureGCSystem` to suit your application:

- **`textureGCActive`**: Enable or disable garbage collection. Default: `true`.
- **`textureGCMaxIdle`**: Maximum idle frames before texture cleanup. Default: `3600` frames.
- **`textureGCCheckCountMax`**: Frequency of garbage collection checks (in frames). Default: `600` frames.

Example configuration:

```javascript
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
    textureGCActive: true,         // Enable texture garbage collection
    textureGCMaxIdle: 7200,       // 2 hours idle time
    textureGCCheckCountMax: 1200, // Check every 20 seconds at 60 FPS
})
```

## Best Practices for Garbage Collection in PixiJS

1. **Explicitly Destroy Objects:** Always call `destroy` on objects you no longer need to ensure GPU resources are promptly released.
2. **Use Pooling:** Reuse objects with a pooling system to reduce allocation and deallocation overhead.
3. **Proactively Manage Textures:** Use `texture.unload()` for manual memory management when necessary.

By following these practices and understanding PixiJS’s garbage collection mechanisms, you can create high-performance applications that efficiently utilize system resources.

