# Scene graph and transforms

A 3D scene is a tree of [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) nodes under a view's [`root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root), and it works much like PixiJS's 2D scene graph. Each node has a position, a rotation and a scale relative to its parent, so moving a parent moves everything under it. [`Meshes`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html), models, cameras and lights are all `Container3D`s, so you move and group them the same way.

## Axes, units and facing

With the camera unrotated, +X points right, +Y points up and +Z points out of the screen toward you. In 2D, +y points down.

glTF, the 3D model format PixiJS 3D loads, measures in metres, and the engine's defaults expect metres too. By default a camera draws nothing more than 1000 units in front of it, its [`far`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#far) distance. A [`PointLight`](https://3d.pixijs.download/v0.1.0/docs/scene.PointLight.html) fades with the square of the distance. At pixel sizes, a scene gets cut off and its lamps barely light it. Treat one unit as one metre and build things at their real size.

Which way a node faces depends on what it is:

- A mesh's front is its +Z side. A [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) faces +Z, and glTF models are built facing +Z.
- A [`camera`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html) looks along its -Z axis, which points into the screen when the camera is unrotated. A directional or spot [`light`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html) shines along its -Z axis too.

[`lookAt`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#lookat) turns a node to face a point in world space, which means the scene's own coordinates rather than its parent's. It points a camera's or light's -Z axis at that point, and any other node's +Z side. This lays a floor flat and aims a sun at its middle:

```ts
import { DirectionalLight, Material3D, Mesh3D, PlaneGeometry } from '@pixi/3d';

const floor = new Mesh3D({
  geometry: new PlaneGeometry({ width: 8, height: 8 }),
  material: new Material3D({ baseColor: 0x888888, roughness: 0.85 }),
});

// The plane faces +Z. A quarter turn around X points that face up.
floor.rotation.x = -Math.PI / 2;

const sun = new DirectionalLight({ intensity: 3 });

sun.position.set(-3, 5, 2);
view3d.root.addChild(floor, sun);

// lookAt reads the world transform of the light's parents, so add the light first.
// This turns its -Z axis toward the middle of the floor.
sun.lookAt({ x: 0, y: 0, z: 0 });
```

## Position, rotation and scale

[`position`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#position), [`rotation`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#rotation) and [`scale`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#scale) are [`ObservableVector3`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableVector3.html)s. These 3D vectors tell their node when they change, so you can change one component or call any vector method on them. As in 2D, [`x`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#x), `y` and `z` are shortcuts for the position's components.

`rotation` holds three angles in radians, one around each axis. A positive angle turns counter-clockwise as you look down the axis from its + end toward the origin. Since +Z points toward you, a positive `rotation.z` turns a node counter-clockwise on screen, the opposite way to 2D's `rotation`. A positive `rotation.y` turns a node that faces you toward +X, to your right. [`angle`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#angle) is the same rotation in degrees.

When you set more than one angle, the node turns around Z first, then Y, then X, each around its parent's axes. So to lean a campfire's logs in toward the middle, lean each one around Z and then turn it around Y. A lean around X would come after the turn and tip every log the same way.

```ts
crate.position.set(0, 0.5, -2);
crate.y += 1;
crate.position = spawnPoint; // copies the values; crate and spawnPoint stay separate
crate.scale = 0.5; // one number scales all three axes

door.angle.y = 90; // the same as door.rotation.y = Math.PI / 2

// a log `angle` radians round the fire from +X
log.position.set(Math.cos(angle) * 0.3, 0.55, Math.sin(angle) * 0.3);
log.rotation.set(0, -angle, 0.4); // lean it around Z, then turn the lean toward the middle around Y
```

### Rotation and quaternion

A node also has a [`quaternion`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#quaternion), a rotation stored as four numbers. The node uses whichever of the two you set last. `lookAt`, `reparentChild`, loaded models and their animations set the quaternion. Watch for three things:

- `rotation` doesn't read back a turn made through the quaternion. A node inside a loaded model reads `0, 0, 0` however the file turned it, so `rotation.y += 0.1` on it replaces the file's rotation. To turn such a node further, change its quaternion, as [Math](https://pixijs.com/3d/guides/components/math.md#rotations) shows. The file never turns the model itself, so `model.rotation.y` works as usual.
- Setting `rotation` to values it already holds, through a component or `set`, changes nothing. `lookAt` never touches `rotation`, so a turret aimed with it stays aimed after `turret.rotation.set(0, 0, 0)`. To make the node use `rotation` again, assign a whole rotation: `turret.rotation = { x: 0, y: 0, z: 0 }`.
- Don't write `rotation` and call `lookAt` on the same node in one frame. If an earlier frame's `lookAt` already left the node facing that point, the `rotation` write wins.

## Parents and children

A plain `Container3D` draws nothing. Use one to group nodes that move together. In the floating-shapes tutorial, a container moves each shape around while the mesh inside it spins:

```ts
import { Container3D, Mesh3D } from '@pixi/3d';

const float = new Container3D();
const mesh = new Mesh3D({ geometry, material });

float.addChild(mesh);
view3d.root.addChild(float);

app.ticker.add((ticker) => {
  float.position.y = Math.sin(ticker.lastTime / 1000) * 0.25; // bob up and down
  mesh.rotation.y += 0.5 * (ticker.deltaMS / 1000); // spin in place
});
```

As with 2D's `ContainerOptions`, every node's constructor takes [`Container3DOptions`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3DOptions.html), such as `position`, `rotation` and `label`, on top of its own options. The child methods and events match a 2D `Container`'s, such as `addChild`, `removeFromParent` and the `added` event. [`Container3DEvents`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3DEvents.html) lists the events.

Unlike 2D, the order of children doesn't decide what covers what. A nearer solid surface hides a farther one.

[`getChildByLabel`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getchildbylabel) finds a node by its [`label`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#label). A loaded [`model`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) labels each node with its name in the file, as [Loading models](https://pixijs.com/3d/guides/components/models.md#file-contents) covers. That lets you find a part by name, such as a car's wheel:

```ts
const car = new Model3D({ source });
const wheel = car.getChildByLabel('wheel-front-left', true); // true searches the whole subtree
```

A skinned model, such as a character, has a mesh that bends with a skeleton. A bone becomes a node only when the file puts a mesh under it, so `getChildByLabel` doesn't find the others. Every bone is in a [`Skeleton`](https://3d.pixijs.download/v0.1.0/docs/scene.Skeleton.html) on the model, and [Animation](https://pixijs.com/3d/guides/components/animation.md#skinned-meshes) shows how to find one by name and pose it.

## Local and world space

These methods convert between a node's own space and world space:

- [`getGlobalPosition`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobalposition) returns a node's position in world space.
- [`toGlobal`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#toglobal) converts a point from the node's own space to world space.
- [`toLocal`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#tolocal) converts a point in world space, or in another node's space, into the node's own space.

In [Parents and children](https://pixijs.com/3d/examples?example=scene_hierarchy), turning an empty `orbit` node carries a planet round the sun. The planet's `position` never changes, and `getGlobalPosition` returns where the orbit has moved it:

```ts
import { Vector3 } from '@pixi/3d';

orbit.addChild(planet);
planet.position.x = 2.5; // 2.5 units out from the orbit's centre

const world = new Vector3();

app.ticker.add((ticker) => {
  orbit.rotation.y += 0.45 * (ticker.deltaMS / 1000);
  planet.getGlobalPosition(world); // writes into world, so it allocates nothing each frame
});
```

To place 2D content over a 3D node, pass its world position to [`worldToScreen`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#worldtoscreen), which [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md#world-to-screen) covers.

### Moving a node to a new parent

[`addChild`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#addchild) keeps a node's local position, rotation and scale, so a node jumps when its new parent sits somewhere else. [`reparentChild`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#reparentchild) moves it under the new parent and changes its local transform so it stays where it was in the world:

```ts
hand.reparentChild(sword); // the sword stays put, and from now on follows the hand
```

## When world transforms update

Changing a position, rotation or scale only marks the node as changed. [`worldTransform`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#worldtransform) holds what the view worked out the last time it drew, normally once a frame, so it can be out of date:

- after a change you made since the view last drew,
- while the node or one of its parents is hidden,
- for a node that isn't under a view's root.

`getGlobalPosition`, `toGlobal`, `toLocal` and [`getGlobalTransform`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobaltransform) walk up through the node's parents on each call, so their result is current even straight after a change. Reading `worldTransform` costs nothing and suits per-frame code that can use last frame's value.

## Showing and hiding

[`visible`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#visible) hides a node and everything under it. Hiding and showing a node costs less than removing it and adding it back, so use `visible` for things that come and go often. Rendering throws while the view's camera or one of its parents is hidden, so keep the camera out of groups you hide.

To take a node out for good, remove or destroy it. [Resources and cleanup](https://pixijs.com/3d/guides/concepts/resources.md#destroying) covers what that frees. The view's camera sits under `view3d.root` too, so clearing a level with `view3d.root.removeChildren()` takes the camera out, and the next render throws. Put each level in a `Container3D` of its own and clear that instead.

## Measuring and sizing

[`getLocalBounds`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getlocalbounds) measures a node and everything visible under it as a [`Box`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html). It measures in the node's own space, before the node's own position, rotation and scale apply. Each call walks the subtree, so measure once rather than every frame.

This scales a fox model to two units long and stands it on the ground at y = 0:

```ts
import { Model3D } from '@pixi/3d';

const fox = new Model3D({ source });
const bounds = fox.getLocalBounds();
const scale = 2 / bounds.getSize().z;

fox.scale.set(scale);
fox.position.y = -bounds.min.y * scale;
```

[`width`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#width), [`height`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#height) and [`depth`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#depth) give the measured size times the scale. Setting one changes the scale on that axis only, and [`setSize`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#setsize) sets all three. Both stretch a model unless the sizes you ask for keep its proportions. To keep them, work out one scale from the bounds, as above. [Size and bounds](https://pixijs.com/3d/examples?example=scene_bounds) fits three models into equal cubes, stretched with `setSize` or kept in shape with one scale.

## Next steps

- [Math](https://pixijs.com/3d/guides/components/math.md): vectors, quaternions and turning a node with a quaternion.
- [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md): placing and aiming the camera.
- [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md): from world positions to the screen and back.
- [Scene objects](https://pixijs.com/3d/guides/components/scene-objects.md): the kinds of node a scene is built from.
