# Cache As Texture

### Using `cacheAsTexture` in PixiJS

The `cacheAsTexture` function in PixiJS is a powerful tool for optimizing rendering in your applications. By rendering a container and its children to a texture, `cacheAsTexture` can significantly improve performance for static or infrequently updated containers. Let's explore how to use it effectively, along with its benefits and considerations.

:::info[Note]
`cacheAsTexture` is PixiJS v8's equivalent of the previous `cacheAsBitmap` functionality. If you're migrating from v7 or earlier, simply replace `cacheAsBitmap` with `cacheAsTexture` in your code.
:::

---

### What Is `cacheAsTexture`?

When you set `container.cacheAsTexture()`, the container is rendered to a texture. Subsequent renders reuse this texture instead of rendering all the individual children of the container. This approach is particularly useful for containers with many static elements, as it reduces the rendering workload.

To update the texture after making changes to the container, call:

```javascript
container.updateCacheTexture();
```

and to turn it off, call:

```javascript
container.cacheAsTexture(false);
```
---

### Basic Usage

Here's an example that demonstrates how to use `cacheAsTexture`:

```javascript
import * as PIXI from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // load sprite sheet..
    await Assets.load('https://pixijs.com/assets/spritesheet/monsters.json');

    // holder to store aliens
    const aliens = [];
    const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'];

    let count = 0;

    // create an empty container
    const alienContainer = new Container();

    alienContainer.x = 400;
    alienContainer.y = 300;

    app.stage.addChild(alienContainer);

    // add a bunch of aliens with textures from image paths
    for (let i = 0; i < 100; i++)
    {
        const frameName = alienFrames[i % 4];

        // create an alien using the frame name..
        const alien = Sprite.from(frameName);

        alien.tint = Math.random() * 0xffffff;

        alien.x = Math.random() * 800 - 400;
        alien.y = Math.random() * 600 - 300;
        alien.anchor.x = 0.5;
        alien.anchor.y = 0.5;
        aliens.push(alien);
        alienContainer.addChild(alien);
    }

    // this will cache the container and its children as a single texture
    // so instead of drawing 100 sprites, it will draw a single texture!
    alienContainer.cacheAsTexture()
})();
```

In this example, the `container` and its children are rendered to a single texture, reducing the rendering overhead when the scene is drawn.

Play around with the example [here](../../examples/basic/cache-as-texture).

### Advanced Usage

Instead of enabling cacheAsTexture with true, you can pass a configuration object which is very similar to texture source options.

```typescript
container.cacheAsTexture({
    resolution: 2,
    antialias: true,
});
```

- `resolution` is the resolution of the texture. By default this is the same as you renderer or application.
- `antialias` is the antialias mode to use for the texture. Much like the resolution this defaults to the renderer or application antialias mode.

---

### Benefits of `cacheAsTexture`

- **Performance Boost**: Rendering a complex container as a single texture avoids the need to process each child element individually during each frame.
- **Optimized for Static Content**: Ideal for containers with static or rarely updated children.

---

### Advanced Details

- **Memory Tradeoff**: Each cached texture requires GPU memory. Using `cacheAsTexture` trades rendering speed for increased memory usage.
- **GPU Limitations**: If your container is too large (e.g., over 4096x4096 pixels), the texture may fail to cache, depending on GPU limitations.


---

### How It Works Internally

Under the hood, `cacheAsTexture` converts the container into a render group and renders it to a texture. It uses the same texture cache mechanism as filters:

```javascript
container.enableRenderGroup();
container.renderGroup.cacheAsTexture = true;
```

Once the texture is cached, updating it via `updateCacheTexture()` is efficient and incurs minimal overhead. Its as fast as rendering the container normally.

---

### Best Practices

#### **DO**:
- **Use for Static Content**: Apply `cacheAsTexture` to containers with elements that don't change frequently, such as a UI panel with static decorations.
- **Leverage for Performance**: Use `cacheAsTexture` to render complex containers as a single texture, reducing the overhead of processing each child element individually every frame. This is especially useful for containers that contain expensive effects eg filters.
- **Switch of Antialiasing**: setting antialiasing to false can give a small performance boost, but the texture may look a bit more pixelated around its children's edges.
- **Resolution**: Do adjust the resolution based on your situation, if something is scaled down, you can use a lower resolution.If something is scaled up, you may want to use a higher resolution. But be aware that the higher the resolution the larger the texture and memory footprint.

#### **DON'T**:
- **Apply to Very Large Containers**: Avoid using `cacheAsTexture` on containers that are too large (e.g., over 4096x4096 pixels), as they may fail to cache due to GPU limitations. Instead, split them into smaller containers.
- **Overuse for Dynamic Content**: Flick `cacheAsTexture` on / off frequently on containers, as this results in constant re-caching, negating its benefits. Its better to Cache as texture when you once, and then use `updateCacheTexture` to update it.
- **Apply to Sparse Content**: Do not use `cacheAsTexture` for containers with very few elements or sparse content, as the performance improvement will be negligible.
- **Ignore Memory Impact**: Be cautious of GPU memory usage. Each cached texture consumes memory, so overusing `cacheAsTexture` can lead to resource constraints.

---

### Gotchas

- **Rendering Depends on Scene Visibility**: The cache updates only when the containing scene is rendered. Modifying the layout after setting `cacheAsTexture` but before rendering your scene will be reflected in the cache.

- **Containers are rendered with no transform**: Cached items are rendered at their actual size, ignoring transforms like scaling. For instance, an item scaled down by 50%, its texture will be cached at 100% size and then scaled down by the scene.

- **Caching and Filters**: Filters may not behave as expected with `cacheAsTexture`. To cache the filter effect, wrap the item in a parent container and apply `cacheAsTexture` to the parent.

- **Reusing the texture**: If you want to create a new texture based on the container, its better to use `const texture = renderer.generateTexture(container)` and share that amongst you objects!

By understanding and applying `cacheAsTexture` strategically, you can significantly enhance the rendering performance of your PixiJS projects. Happy coding!
