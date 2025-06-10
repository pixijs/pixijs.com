# Culler Plugin

The `CullerPlugin` automatically skips rendering for offscreen objects in your scene. It does this by using the renderer's screen bounds to determine whether containers (and optionally their children) intersect the view. If they don't, they are **culled**, reducing rendering and update overhead.

PixiJS does not enable this plugin by default. You must manually register it using the `extensions` system.

## When Should You Use It?

Culling is ideal for:

- Large scenes with many offscreen elements
- Scrollable or camera-driven environments (e.g. tilemaps, world views)
- Optimizing render performance without restructuring your scene graph

## Usage

```ts
const app = new Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
});

extensions.add(CullerPlugin);

const world = new Container();
world.cullable = true;
world.cullableChildren = true;

const sprite = new Sprite.from('path/to/image.png');
sprite.cullable = true; // Enable culling for this sprite
world.addChild(sprite);

app.stage.addChild(world);
```

### Enabling the Culler Plugin

To enable automatic culling in your application:

```ts
import { extensions, CullerPlugin } from 'pixi.js';

extensions.add(CullerPlugin);
```

This will override the default `render()` method on your `Application` instance to call `Culler.shared.cull()` before rendering:

```ts
// Internally replaces:
app.renderer.render({ container: app.stage });
// With:
Culler.shared.cull(app.stage, app.renderer.screen);
app.renderer.render({ container: app.stage });
```

### Configuring Containers for Culling

By default, containers are **not culled**. To enable culling for a container, set the following properties:

```ts
container.cullable = true; // Enables culling for this container
container.cullableChildren = true; // Enables recursive culling for children
```

### Optional: Define a Custom Cull Area

You can define a `cullArea` to override the default bounds check (which uses global bounds):

```ts
container.cullArea = new Rectangle(0, 0, 100, 100);
```

This is useful for containers with many children where bounding box calculations are expensive or inaccurate.

---

## Manual Culling with `Culler`

If you’re not using the plugin but want to manually cull before rendering:

```ts
import { Culler } from 'pixi.js';

const stage = new Container();
// Configure stage and children...

Culler.shared.cull(stage, { x: 0, y: 0, width: 800, height: 600 });
renderer.render({ container: stage });
```

---

## API Reference

- [CullerPlugin](https://pixijs.download/release/docs/app.CullerPlugin.html)
