import Example from '@site/src/components/Example/index';
import version from '@site/docs/pixi-version.json';

# Understanding Garbage Collection in PixiJS

Garbage collection (GC) in PixiJS ensures GPU resources are efficiently managed by cleaning up assets no longer in use. While JavaScript developers are accustomed to automatic memory management, GPU resources need explicit cleanup to avoid resource leaks and performance degradation. PixiJS provides two systems to help manage this: `RenderableGCSystem` and `TextureGCSystem`.

These systems act as a safety net, cleaning up unused resources over time to prevent the GPU from filling up. However, developers can and should manually manage resources where possible for better control.

---

### What You’ll Learn

- How the `RenderableGCSystem` and `TextureGCSystem` work.
- Configuring the GC systems via the `init` function.
- Best practices for managing GPU resources.
- Why GC is crucial for efficient GPU usage.

---

### The Basics of Garbage Collection

#### Why is Garbage Collection Important?

The GPU does not automatically release resources when they’re no longer needed. Without explicit cleanup, textures, buffers, and other resources can accumulate, causing memory leaks and reduced performance. While PixiJS provides GC systems as a safety net, manual management (e.g., calling `destroy()` on unused assets) is the best way to ensure efficient GPU usage.

---

### PixiJS Garbage Collection Systems

#### RenderableGCSystem

The `RenderableGCSystem` handles cleanup of GPU resources for renderable objects like sprites, text, and graphics.

Key features:
- Cleans up unused renderables after a specified idle time (default: 60 seconds).
- Runs periodically based on a configurable frequency (default: every 30 seconds).
- Works independently of rendering, ensuring cleanup even during idle periods.

Configuration example:
```javascript
const renderer = new PIXI.Renderer();
renderer.use(new PIXI.RenderableGCSystem());

renderer.init({
    renderableGCActive: true,       // Enable/disable the system
    renderableGCMaxUnusedTime: 60000, // Maximum idle time before cleanup
    renderableGCFrequency: 30000,     // Frequency of GC checks
});
```

#### TextureGCSystem

The `TextureGCSystem` manages textures loaded into the GPU and cleans up those not used for a specified number of frames.

Key features:
- Cleans up textures after a specified number of idle frames (default: 60 frames).
- Runs periodically based on a configurable frame count (default: every 600 frames).
- Targets textures marked with `autoGarbageCollect: true`.

Configuration example:
```javascript
const renderer = new PIXI.Renderer();
renderer.use(new PIXI.TextureGCSystem());

renderer.init({
    textureGCActive: true,            // Enable/disable the system
    textureGCMaxIdle: 3600,          // Maximum idle frames before cleanup
    textureGCCheckCountMax: 600,     // Frames between GC checks
});
```

---

### Best Practices for GPU Resource Management

1. **Manual Cleanup**: Always call `destroy()` on unused objects (e.g., `sprite.destroy()`) to explicitly free resources.
2. **Enable GC Systems as a Safety Net**: The GC systems ensure resources are cleaned up if manual cleanup is missed.
3. **Adjust GC Frequency for Your Application**: If your application frequently creates and destroys resources, you may need to increase or decrease the GC frequency.
4. **Monitor Resource Usage**: Use tools like Chrome DevTools or WebGL Inspector to monitor GPU resource usage and detect leaks.

---

### Example: Managing GPU Resources with GC

```javascript
const renderer = new PIXI.Renderer();
renderer.use(new PIXI.RenderableGCSystem());
renderer.use(new PIXI.TextureGCSystem());

renderer.init({
    renderableGCActive: true,
    renderableGCMaxUnusedTime: 60000,  // 1 minute idle time for renderables
    renderableGCFrequency: 30000,      // Check every 30 seconds
    textureGCActive: true,
    textureGCMaxIdle: 3600,           // 1 minute idle time for textures
    textureGCCheckCountMax: 600,      // Check every 600 frames
});

// Example: Creating and destroying a sprite
const texture = PIXI.Texture.from('example.png');
const sprite = new PIXI.Sprite(texture);

renderer.render(sprite);
sprite.destroy(); // Proper cleanup to release resources
```

---

### Gotchas

- **GC is Not a Replacement for Manual Cleanup**:
  - Always call `destroy()` or equivalent methods to release resources when they are no longer needed.
- **Adjust for Performance**:
  - Overly aggressive GC settings can lead to unnecessary resource reallocation, while too lenient settings may cause memory issues.
- **Check Resource Markers**:
  - Only objects marked with `autoGarbageCollect: true` will be managed by the GC systems.

---

### Conclusion

Garbage collection in PixiJS helps manage GPU resources efficiently, acting as a safety net for unused resources. While developers should always aim to manage resources manually, the `RenderableGCSystem` and `TextureGCSystem` provide robust tools to prevent GPU overload. With proper configuration and best practices, you can ensure smooth performance and prevent resource leaks in your PixiJS applications.

For advanced use cases, these systems can also be disabled, allowing developers full control over resource management. Whether you use them as a safety net or as part of your workflow, understanding PixiJS’s GC systems is key to building performant applications.
