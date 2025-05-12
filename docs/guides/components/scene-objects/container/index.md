# Container

The `Container` class is the foundation of PixiJS's scene graph system. Containers act as groups of scene objects, allowing you to build complex hierarchies, organize rendering layers, and apply transforms or effects to groups of objects.

## What Is a Container?

A `Container` is a general-purpose node that can hold other display objects, **including other containers**. It is used to structure your scene, apply transformations, and manage rendering and interaction.

Containers are **not** rendered directly. Instead, they delegate rendering to their children.

```ts
import { Container, Sprite } from 'pixi.js';

const group = new Container();
const sprite = Sprite.from('bunny.png');

group.addChild(sprite);
```

## Managing Children

PixiJS provides a robust API for adding, removing, reordering, and swapping children in a container:

```ts
const container = new Container();
const child1 = new Container();
const child2 = new Container();

container.addChild(child1, child2);
container.removeChild(child1);
container.addChildAt(child1, 0);
container.swapChildren(child1, child2);
```

You can also remove a child by index or remove all children within a range:

```ts
container.removeChildAt(0);
container.removeChildren(0, 2);
```

To keep a child’s world transform while moving it to another container, use `reparentChild` or `reparentChildAt`:

```ts
otherContainer.reparentChild(child);
```

### Events

Containers emit events when children are added or removed:

```ts
group.on('childAdded', (child, parent, index) => { ... });
group.on('childRemoved', (child, parent, index) => { ... });
```

### Finding Children

Containers support searching children by `label` using helper methods:

```ts
const child = new Container({ label: 'enemy' });
container.addChild(child);
container.getChildByLabel('enemy');
container.getChildrenByLabel(/^enemy/); // all children whose label starts with "enemy"
```

Set `deep = true` to search recursively through all descendants.

```ts
container.getChildByLabel('ui', true);
```

### Sorting Children

Use `zIndex` and `sortableChildren` to control render order within a container:

```ts
child1.zIndex = 1;
child2.zIndex = 10;
container.sortableChildren = true;
```

Call `sortChildren()` to manually re-sort if needed:

```ts
container.sortChildren();
```

:::info
Use this feature sparingly, as sorting can be expensive for large numbers of children.
:::

## Optimizing with Render Groups

Containers can be promoted to **render groups** by setting `isRenderGroup = true` or calling `enableRenderGroup()`.

Use render groups for UI layers, particle systems, or large moving subtrees.
See the [Render Groups guide](../../../concepts/render-groups.md) for more details.

```ts
const uiLayer = new Container({ isRenderGroup: true });
```

## Cache as Texture

The `cacheAsTexture` function in PixiJS is a powerful tool for optimizing rendering in your applications. By rendering a container and its children to a texture, `cacheAsTexture` can significantly improve performance for static or infrequently updated containers.

When you set `container.cacheAsTexture()`, the container is rendered to a texture. Subsequent renders reuse this texture instead of rendering all the individual children of the container. This approach is particularly useful for containers with many static elements, as it reduces the rendering workload.

:::info[Note]
`cacheAsTexture` is PixiJS v8's equivalent of the previous `cacheAsBitmap` functionality. If you're migrating from v7 or earlier, simply replace `cacheAsBitmap` with `cacheAsTexture` in your code.
:::

```ts
const container = new Container();
const sprite = Sprite.from('bunny.png');
container.addChild(sprite);

// enable cache as texture
container.cacheAsTexture();

// update the texture if the container changes
container.updateCacheTexture();

// disable cache as texture
container.cacheAsTexture(false);
```

For more advanced usage, including setting cache options and handling dynamic content, refer to the [Cache as Texture guide](./cache-as-texture.md).

---

## API Reference

### Common Properties

| Property           | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `position`         | Local position (`.x`, `.y`)                                         |
| `x`                | X position in pixels                                                |
| `y`                | Y position in pixels                                                |
| `width`            | Width in pixels                                                     |
| `height`           | Height in pixels                                                    |
| `rotation`         | Rotation in radians                                                 |
| `angle`            | Rotation in degrees (alias for `rotation`)                          |
| `scale`            | `.x` and `.y` scale factors                                         |
| `pivot`            | Transform origin for scaling/rotation                               |
| `skew`             | Skew values in radians                                              |
| `alpha`            | Opacity (0 to 1)                                                    |
| `visible`          | Whether the container and its subtree is rendered                   |
| `tint`             | Tint color                                                          |
| `renderable`       | Whether the container itself is renderable (still updates children) |
| `children`         | Array of children                                                   |
| `parent`           | Reference to parent container                                       |
| `isRenderGroup`    | Whether the container is rendered as its own group                  |
| `mask`             | Mask object (Graphics or Sprite)                                    |
| `label`            | Optional string label used for searching                            |
| `zIndex`           | Sorting value used if `sortableChildren` is true                    |
| `sortableChildren` | Whether children are sorted by `zIndex`                             |

### Common Methods

| Method                                   | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| `addChild(...children)`                  | Add one or more children                          |
| `addChildAt(child, index)`               | Add a child at a specific index                   |
| `removeChild(...children)`               | Remove one or more children                       |
| `removeChildAt(index)`                   | Remove a child by index                           |
| `removeChildren(begin, end)`             | Remove a range of children                        |
| `getChildAt(index)`                      | Get child by index                                |
| `getChildIndex(child)`                   | Get index of a child                              |
| `setChildIndex(child, index)`            | Change a child's index position                   |
| `swapChildren(child1, child2)`           | Swap two children                                 |
| `removeFromParent()`                     | Remove the container from its parent              |
| `reparentChild(child)`                   | Move child while preserving world transform       |
| `reparentChildAt(child, index)`          | Reparent at specific index                        |
| `getChildByLabel(label, deep?)`          | Find the first child with a matching label        |
| `getChildrenByLabel(label, deep?, out?)` | Find all children with a matching label           |
| `sortChildren()`                         | Sort children by zIndex                           |
| `getGlobalPosition()`                    | Get global position of container                  |
| `toGlobal(localPos)`                     | Convert a local position to global space          |
| `toLocal(globalPos, from)`               | Convert a global position to local space          |
| `getLocalBounds()`                       | Return local bounds as a `Bounds` object          |
| `getBounds()`                            | Return global bounds as a `Bounds` object         |
| `getSize()`                              | Get size as width/height in pixels                |
| `setSize(width, height)`                 | Resize container by adjusting scale               |
| `enableRenderGroup()`                    | Promote container to a render group               |
| `disableRenderGroup()`                   | Disable render group mode                         |
| `destroy(options)`                       | Destroy the container and optionally its children |
