# Math

PixiJS 3D has its own math classes, all exported from `@pixi/3d`: [`Vector3`](https://3d.pixijs.download/v0.1.0/docs/maths.Vector3.html) for points and directions, [`Quaternion`](https://3d.pixijs.download/v0.1.0/docs/maths.Quaternion.html) for rotations, [`Matrix4`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html) for transforms, and shapes such as [`Ray`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html), [`Plane`](https://3d.pixijs.download/v0.1.0/docs/maths.Plane.html), [`Box`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html) and [`Sphere`](https://3d.pixijs.download/v0.1.0/docs/maths.Sphere.html) for hit tests and bounds. Their methods, and those of [`Vector2`](https://3d.pixijs.download/v0.1.0/docs/maths.Vector2.html) and [`Vector4`](https://3d.pixijs.download/v0.1.0/docs/maths.Vector4.html), follow the same few rules.

## In-place methods and out parameters

A method such as `add`, `normalize` or `applyMatrix4` changes the object you call it on and returns it, so calls chain. Most such methods also take an `out` object as their last argument. Pass one, and the result goes there instead. The object you called it on stays as it was:

```ts
import { Vector3 } from '@pixi/3d';

const a = new Vector3(1, 0, 0);
const b = new Vector3(0, 1, 0);
const sum = new Vector3();

a.add(b); // a is now (1, 1, 0)
a.add(b, sum); // sum is (1, 2, 0), and a is still (1, 1, 0)
```

PixiJS's 2D math extras work the other way round. There, `point.add(other)` returns a new point. Here, `enemy.position.add(step)` moves the enemy.

A method whose result is another kind of object, such as [`Ray.intersectPlane`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html#intersectplane) or [`Box.getCenter`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html#getcenter), takes an `out` too. Without one, it creates a new object on each call. A node is any object in the 3D scene. Methods of nodes and views that return a point or a ray, such as [`getGlobalPosition`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobalposition) and [`screenToRay`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoray), work the same way.

A method that reads a point takes a [`PointData3D`](https://3d.pixijs.download/v0.1.0/docs/maths.PointData3D.html), which is any object with `x`, `y` and `z`, such as a node's `position` or a plain `{ x: 0, y: 1, z: 0 }`.

## Avoiding allocations

Each object you create in a frame and then drop, whether with `new Vector3()` or from a method, is garbage. The browser collects it later, and that can make the frame rate stutter. In a ticker callback or a pointer listener, create what you need once, outside it, and pass it as `out`. Here an enemy chases the player at two units a second. Both have the same parent, so their positions are in the same space:

```ts
const toPlayer = new Vector3();

app.ticker.add((ticker) => {
  player.position.subtract(enemy.position, toPlayer).normalize(); // the direction, length 1
  enemy.position.addScaledVector(toPlayer, 2 * (ticker.deltaMS / 1000));
});
```

A node's [`position`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#position), [`rotation`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#rotation) and [`scale`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#scale) are [`ObservableVector3`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableVector3.html)s, and its [`quaternion`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#quaternion) is an [`ObservableQuaternion`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableQuaternion.html). They have the same methods as `Vector3` and `Quaternion`. To keep a copy, use `new Vector3().copyFrom(node.position)` rather than [`clone`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableVector3.html#clone). A clone is still tied to the node, so each write to it marks the node changed.

## Rotations

A [`Quaternion`](https://3d.pixijs.download/v0.1.0/docs/maths.Quaternion.html) holds a rotation as four numbers that you don't work out yourself. [`setFromAxisAngle`](https://3d.pixijs.download/v0.1.0/docs/maths.Quaternion.html#setfromaxisangle) builds a turn by an angle around an axis, given as a direction of length 1. Multiplying two quaternions combines their turns. [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md#rotation-and-quaternion) covers when a node uses its `quaternion` and when its `rotation`.

On a node, [`multiply`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableQuaternion.html#multiply) adds a turn around the node's own axes, which turn with the node, and [`premultiply`](https://3d.pixijs.download/v0.1.0/docs/maths.ObservableQuaternion.html#premultiply) adds it around the parent's axes. In a loaded model, each node's quaternion holds the rotation from the file, so multiply that quaternion to turn the node further. To lean a car's body, copy its quaternion once after loading and start each frame again from that copy, so the lean doesn't build up from frame to frame:

```ts
const body = car.getChildByLabel('body', true)!;
const rest = new Quaternion().copyFrom(body.quaternion); // the turn the file gave the body
const roll = new Quaternion();
const forward = { x: 0, y: 0, z: 1 };

app.ticker.add(() => {
  roll.setFromAxisAngle(forward, lean); // lean: an angle in radians that your code works out
  body.quaternion.copyFrom(rest).multiply(roll); // around the body's own z axis
});
```

For a turn that keeps going, such as a spinning wheel, build each frame's turn from the time the frame took and multiply it in: `spin.setFromAxisAngle(axle, speed * (ticker.deltaMS / 1000))`, then `wheel.quaternion.multiply(spin)`.

[`slerp`](https://3d.pixijs.download/v0.1.0/docs/maths.Quaternion.html#slerp) moves part of the way from one rotation toward another, the shorter way round. If you ease a car's angle toward a new heading instead, you have to keep the gap between -180° and 180°, or the car spins the long way round. A slerp needs no such check:

```ts
const up = { x: 0, y: 1, z: 0 };
const heading = new Quaternion();

app.ticker.add((ticker) => {
  heading.setFromAxisAngle(up, targetYaw);
  // close the same share of the gap each second, whatever the frame rate
  car.quaternion.slerp(heading, 1 - Math.exp(-3 * (ticker.deltaMS / 1000)));
});
```

If you turn a node with `multiply`, `slerp` or another quaternion method, set its other turns through the quaternion too, rather than through `rotation`. For example, set its starting turn with `setFromAxisAngle`.

## Matrices

Most code needs no matrix of its own. Each node keeps its [`worldTransform`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#worldtransform), the matrix that places it in the world. The view updates that matrix when it draws, so it can be out of date, such as right after you add or move the node. [`getGlobalTransform`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobaltransform) computes an up-to-date one. [Scene graph](https://pixijs.com/3d/guides/concepts/scene-graph.md#when-world-transforms-update) says when to use each. [`toGlobal`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#toglobal) and [`toLocal`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#tolocal) move points between spaces.

You build your own [`Matrix4`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html) to place each mesh in a [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html), which draws many meshes from one node. [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md#filling-the-slots) does this with [`compose`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html#compose). You also build one to move a shape between spaces, as [Shapes](#shapes) shows. Two things to know:

- In `a.multiply(b)`, `b` applies to a point first.
- [`getInverse(m)`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html#getinverse) sets the matrix you call it on to the inverse of `m`, the matrix that undoes `m`.

## Shapes

- A [`Ray`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html) starts at its `origin` and runs along its [`direction`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html#direction). The sphere tests and distances assume the direction has length 1, so call `normalize()` on it after you set it yourself. [`screenToRay`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoray) builds a ray through a point on the screen. To find the node under that point, use pointer events or [`raycast`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#raycast). [Interaction](https://pixijs.com/3d/guides/components/interaction.md#picking-without-events) covers both.
- A [`Plane`](https://3d.pixijs.download/v0.1.0/docs/maths.Plane.html) is a flat surface that goes on for ever. [View3D](https://pixijs.com/3d/guides/concepts/view3d.md#screen-to-world) uses one to find the ground under the pointer.
- A [`Box`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html) is lined up with the axes, from its `min` corner to its `max` corner. [`getLocalBounds`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getlocalbounds) returns a node's bounds as a box.
- A [`Sphere`](https://3d.pixijs.download/v0.1.0/docs/maths.Sphere.html) is a centre and a radius. A mesh's [`boundingSphere`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#boundingsphere) is one. [Meshes](https://pixijs.com/3d/guides/components/scene-objects/meshes.md#bounding-sphere) shows how to test it against the camera's [`frustum`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#frustum), the volume the camera sees.

A shape keeps the vectors you pass to its constructor, so `new Sphere(enemy.position, 2)` shares the enemy's position, and moving the sphere moves the enemy. Pass new vectors instead, such as `new Vector3().copyFrom(enemy.position)`.

Each shape is in some space. A ray from `screenToRay` and a mesh's `boundingSphere` are in world space, while `getLocalBounds` and a geometry's [`bounds3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#bounds3d) are in the node's own space. Move one into the other's space before you test them:

- `applyMatrix4` with the node's world matrix takes a shape from the node's space to world space. A box grows when the matrix turns it, since [`Box.applyMatrix4`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html#applymatrix4) fits a new box, lined up with the world axes, around the turned one. Pass a box to write into, as in `mesh.geometry.bounds3D.applyMatrix4(mesh.worldTransform, worldBounds)`. Without one, `applyMatrix4` changes the geometry's own bounds, which pointer events, `raycast` and every mesh that shares the geometry read.
- For an exact test, move the ray into the node's space instead, with `ray.applyMatrix4(inverse.getInverse(mesh.worldTransform), localRay)`. Here `inverse` is a `Matrix4` and `localRay` is a `Ray`, and you create both once. Writing into `localRay` keeps `ray` in world space for the next node. [`Ray.applyMatrix4`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html#applymatrix4) keeps the direction at length 1, so on a scaled node a distance along the moved ray isn't a world distance. To compare hits on several nodes, take each hit point back to world space with `applyMatrix4(mesh.worldTransform)`.

## Seeded random numbers

[`seededRandom`](https://3d.pixijs.download/v0.1.0/docs/maths.seededRandom.html) returns a function to call in place of `Math.random`. The same seed gives the same numbers in the same order, so a scene laid out with it comes out the same on every load. The seed is a string. Here each level scatters its trees the same way every time:

```ts
const random = seededRandom(`level-${level}`);

for (const tree of trees) {
  tree.position.set((random() - 0.5) * 200, 0, (random() - 0.5) * 200);
  tree.rotation.y = random() * Math.PI * 2;
}
```

A particle system takes a seeded random function through its [`createRandom`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3DOptions.html#createrandom) option. Pass a function that creates one, such as `() => seededRandom('stream')` in [Bursts on demand](https://pixijs.com/3d/examples?example=particles_spawn). [Particles](https://pixijs.com/3d/guides/components/particles.md#controlling-a-system) covers what a seed makes repeat.

## Next steps

- [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md): positions, rotations and the spaces nodes are in.
- [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md): from the screen to rays and points in the world, and back.
- [Interaction](https://pixijs.com/3d/guides/components/interaction.md): hit volumes and picking.
