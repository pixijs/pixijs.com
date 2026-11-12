# Resources and cleanup

Meshes, lights and cameras are nodes, the 3D counterpart of 2D containers. A mesh draws with a geometry, which holds its shape, and a material, which sets how its surface looks. The geometry, the material and the material's textures all take GPU memory. You free them in two ways, and PixiJS's garbage collector frees some for you:

- `destroy()` takes a node or resource down for good.
- `unload()` frees its GPU memory and keeps everything needed to draw it again, like `unload()` on a 2D texture's source. For most geometry, it frees the geometry's space in a shared buffer instead.

## Sharing geometry and materials

Every [`Geometry3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html) takes its own space in GPU memory the first time it draws, so build each shape once and give it to every mesh of that shape. Sharing a geometry also lets meshes draw together, as [Performance](https://pixijs.com/3d/guides/concepts/performance.md#draw-calls) explains. You can share a material the same way, and a change to it then shows on every mesh that uses it.

```ts
import { IcosahedronGeometry, Material3D, Mesh3D } from '@pixi/3d';

const rock = new IcosahedronGeometry({ radius: 0.5 });
const stone = new Material3D({ baseColor: 0x9a93ad, roughness: 0.9 });

for (const [x, z] of [
  [-3.6, -2.4],
  [3, -3.8],
  [3.8, 1.6],
]) {
  const mesh = new Mesh3D({ geometry: rock, material: stone });

  mesh.position.set(x, 0.2, z);
  view3d.root.addChild(mesh);
}
```

## Destroying

As in PixiJS 2D, `destroy()` takes a node out of its parent and detaches its children, which survive. It destroys nothing you gave it, such as a mesh's geometry and material, unless you pass [`Destroy3DOptions`](https://3d.pixijs.download/v0.1.0/docs/scene.Destroy3DOptions.html) flags. Passing `true` sets every flag, so it destroys shared resources too. Pass a flag only for resources nothing else uses.

One 2D habit doesn't carry over. On a [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#destroy), the `texture` flag destroys only the textures of a material that the same call destroys. So `mesh.destroy({ texture: true })` frees none of the textures of a material you gave it. Add `material: true` to free them, and `textureSource` to free their sources as well. A [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#destroy) works like a 2D sprite, and `texture: true` frees its texture.

```ts
// A tree whose meshes share geometry and materials with the other trees.
// This destroys its meshes and keeps the geometry and materials.
tree.destroy({ children: true });

// A view with geometry and materials that only its scene uses, and the
// orbit controller that turns its camera
orbit.destroy();
view3d.destroy({ children: true, geometry: true, material: true });
```

Keep these flags away from what you loaded with `Assets.load`. Don't use `texture` on a material whose textures you loaded, or `geometry` and `material` on a model, since a model's geometry and materials belong to its file. Free loaded files with `Assets.unload` instead, as in PixiJS 2D. [Loading models](https://pixijs.com/3d/guides/components/models.md#cleaning-up) shows how for a model.

Destroying a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#destroy) with `children` destroys the whole scene, camera included. Without it, the view empties its root, and the nodes survive for you to reuse. The view never destroys the cube map it uses as its [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment) or background. A cube map is an image of the surroundings. [Environment and IBL](https://pixijs.com/3d/guides/components/environment.md#loading-cube-maps) shows how to free one.

Camera controllers and the passes in [`passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes), which are drawing steps such as bloom, aren't part of the scene, so no flag destroys them. Destroy an [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#destroy) or [`FPSCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#destroy) yourself, as [Camera controls](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md#switching-controllers) shows, and destroy each pass you retire, as [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md#the-passes-list) says.

If you destroy a view's camera, give the view a new one before it next renders, or that render throws, as [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md#switching-cameras) explains.

## Unloading

`unload()` keeps the data on the CPU, so the next frame that draws the object uploads it again. Use it for content you'll show again later, such as a level the player has left.

Take the content out of the scene first, because hiding it isn't enough. The next frame uploads the geometry of every mesh in the scene again, even hidden or off-screen ones, so unloading content you only hid frees none of its geometry. For the same reason, unloading a geometry your content shares with a mesh that stays frees nothing, and neither does unloading a texture it shares with a mesh that's drawn.

```ts
view3d.root.removeChild(level);
level.unload();

// When the player comes back, adding it is enough
view3d.root.addChild(level);
```

Each class unloads a different part:

- [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#unload) and [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#unload) unload the geometry of every mesh under them. Materials stay, since they're usually shared, except under a [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#unload), which unloads its materials too.
- [`BaseMaterial3D`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#unload) unloads its textures, except render textures, whose pixels exist only on the GPU.
- [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#unload) unloads its buffers and the geometry of its slots, which are the meshes it draws. Their materials stay.
- [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#unload) unloads what the view keeps to draw the scene, such as its shadow textures, but not the scene's geometry or textures.

Geometry that isn't [`dynamic`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#dynamic) shares a GPU buffer with other geometry that has the same [`vertex attributes`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#attributekey), the per-vertex data such as positions and UVs. [`Unloading`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#unload) or destroying such a geometry frees its space in that buffer. The buffer never shrinks, though, so unloading even a whole level of geometry gives no GPU memory back. Removing, hiding or destroying a mesh without `geometry: true` keeps that space. So free the old level's geometry before you add the next one. New geometry with the same attributes then reuses that space before the buffer grows.

## The renderer's garbage collector

PixiJS's renderer has a garbage collector that unloads GPU resources nothing has used for longer than its `gcMaxUnusedTime` option, 60 seconds by default. [GCSystemOptions](https://pixijs.download/release/docs/rendering.GCSystemOptions.html) lists its options.

In PixiJS 3D, the collector also calls `unload` on a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) that has been out of the stage that long, and the view rebuilds on its next render. The collector never unloads a view that's still in the stage, even a hidden one; [`unload`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#unload) lists the other cases it skips. Set a view's `autoGarbageCollect` to `false` to keep it loaded while it's out of the stage.

The collector never frees a geometry's space in the shared buffer, so unload or destroy the geometry to free it.

## Next steps

- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): which meshes draw together, and keeping draw calls down.
- [Loading models](https://pixijs.com/3d/guides/components/models.md): sharing a loaded file between models, and freeing it.
- [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md): adding, removing and hiding nodes.
