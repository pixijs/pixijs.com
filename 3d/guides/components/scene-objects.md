# Scene objects

A 3D scene is a tree of nodes under a view's [`root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root). Every node is a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html), the 3D counterpart of a 2D `Container`. So you move, turn, scale and group every kind of node the same way, as [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md) shows.

## The node types

- [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) draws nothing. It groups nodes so they move together.
- [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) draws a shape, its [`Geometry3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html), with a material that decides how the surface looks. See [Meshes](https://pixijs.com/3d/guides/components/scene-objects/meshes.md).
- [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) turns a glTF file into nodes: meshes, lights, cameras and empty containers. glTF is the 3D model format PixiJS 3D loads. When the file has animations, the model also gets an animation [`player`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#player). See [Loading models](https://pixijs.com/3d/guides/components/models.md).
- [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html) draws a texture on a flat card. The card takes its size from the texture and, [`by default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#billboardmode), turns to face the camera. See [Sprite3D](https://pixijs.com/3d/guides/components/scene-objects/sprite3d.md).
- [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) draws many meshes from one node. Each mesh is a slot that holds a geometry, a material and a matrix that places it. A slot has no node of its own. See [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md).
- [`ParticleContainer3D`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html) draws up to a fixed number of flat cards in one draw call, at the positions your code writes. [`ParticleSystem3D`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html), from `@pixi/3d/extras`, is a particle container that emits and moves its particles on its own. See [Particles](https://pixijs.com/3d/guides/components/particles.md).
- [`Camera3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html) is the point of view the scene is drawn from. A view comes with one, at [`view3d.camera`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#camera). See [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md).
- [`AmbientLight`](https://3d.pixijs.download/v0.1.0/docs/scene.AmbientLight.html), [`DirectionalLight`](https://3d.pixijs.download/v0.1.0/docs/scene.DirectionalLight.html), [`PointLight`](https://3d.pixijs.download/v0.1.0/docs/scene.PointLight.html) and [`SpotLight`](https://3d.pixijs.download/v0.1.0/docs/scene.SpotLight.html) light the meshes whose material reacts to light, such as [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html). See [Lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md).

Light from the surroundings, such as a sky, isn't a node. It comes from the view's [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment); see [Environment](https://pixijs.com/3d/guides/components/environment.md).

## Putting a scene together

A 3D node isn't a 2D `Container`, so it can't go on `app.stage`. The [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) goes on the stage, and every 3D node goes under `view3d.root`, at any depth. A node that isn't under a view's root draws nothing and lights nothing.

2D content, such as a `Text`, can't go under the root either. Draw it onto a 3D surface with a [`ContainerTexture`](https://3d.pixijs.download/v0.1.0/docs/rendering.ContainerTexture.html) instead, as [Rendering 2D into 3D](https://pixijs.com/3d/guides/components/container-texture.md) shows. Or keep it on the stage and pin it over a 3D point with [`worldToScreen`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#worldtoscreen).

The view finds every mesh and light wherever it sits in the tree, so a light can have a mesh as a child, and a mesh can have a light. Here a point light has a glowing bulb as its child, so the bulb moves with it:

```ts
import { Material3D, Mesh3D, PointLight, SphereGeometry } from '@pixi/3d';

const color = 0xff2e7e;
const light = new PointLight({ color, intensity: 8, range: 6 });
// An emissive material glows in its own colour, whatever light reaches it
const bulb = new Mesh3D({
  geometry: new SphereGeometry({ radius: 0.09 }),
  material: new Material3D({ baseColor: 0x000000, emissive: { color, strength: 4 } }),
  castShadow: false, // a glowing bulb shouldn't cast a shadow
});

light.addChild(bulb);
view3d.root.addChild(light);

app.ticker.add(() => {
  const time = performance.now() / 1000;

  light.position.set(Math.cos(time) * 2.6, 1.2, Math.sin(time) * 2.6); // the bulb moves with the light
});
```

Hiding the light with [`visible`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#visible) turns it off and hides the bulb too.

[Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md) covers the rest, including why, unlike in 2D, the order of children doesn't decide what covers what.

## Choosing a node for many objects

| You have                                                                           | Use                                                 |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| Objects you place, click and animate one by one                                    | [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html)                                      |
| Copies of a loaded model that each animate on their own                            | Several [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html)s built from one loaded file |
| Up to a few thousand cards that face the camera and mostly stay put, such as trees | [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html)                                    |
| Thousands of copies of a mesh, such as trees, rocks, stars or bullets              | [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html)                               |
| Fire, smoke, sparks or snow that emit, move and fade on their own                  | [`ParticleSystem3D`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html)                            |
| Thousands of cards that your own code moves every frame                            | [`ParticleContainer3D`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html)                         |

For a glTF file, `Assets.load` returns a [`Scene3DSource`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html). Models built from one source share its geometry, materials and textures, as [Loading models](https://pixijs.com/3d/guides/components/models.md#a-source-and-its-models) explains. Each model has its own nodes and, when the file has animations, its own [`AnimationPlayer`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html).

Each mesh and each sprite, including the meshes inside a model, is a scene node. A mesh or sprite that moves, or sits under a node that moves, costs CPU time on every frame it moves, because the view works out its place in the world again. The view also sorts the meshes and sprites that blend with what's behind them back to front every frame, whether they move or not. A sprite that makes its own material blends by default; see [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#alphamode).

Meshes that don't move and share their draw calls cost the CPU little each frame. [Performance](https://pixijs.com/3d/guides/concepts/performance.md#draw-calls) says what lets them share. Their number still counts, because each node takes memory and time to build. Where the view [`culls`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#cull) on the CPU, as it does by default under WebGL2, it works out each frame which meshes the camera can't see and skips them. That work grows with the number of meshes.

So put scenery, such as a forest's trees and rocks, in [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slots. A few thousand meshes that never move are fine, but for tens of thousands, use slots. A batched mesh and a particle container have no node per copy, so moving a copy means writing into an array.

Unlike pixi's 2D `ParticleContainer`, a [`ParticleContainer3D`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html) has no object per particle. You write each card by its index with [`writePacked`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#writepacked), then call [`upload`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#upload) once a frame, as [Driving particles yourself](https://pixijs.com/3d/guides/components/particles.md#driving-particles-yourself) shows. You set its [`capacity`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#capacity) when you create it and can't change it later. Writing past it throws, so build a bigger container when your particles outgrow it.

## Next steps

- [Meshes](https://pixijs.com/3d/guides/components/scene-objects/meshes.md): building a mesh from a geometry and a material, and sharing and swapping them.
- [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md) and [Lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md): seeing and lighting a scene.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): draw calls, culling and a checklist for phones.
