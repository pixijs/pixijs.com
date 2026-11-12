# Cameras

A [`Camera3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html) is the point of view a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) draws its scene from. Every view comes with one, at [`view3d.camera`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#camera), and it sits under [`view3d.root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root) with the rest of the scene. A camera is a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html), so you move, turn and parent it like any other node.

Moving `view3d.root`, the way you'd scroll a 2D world container, doesn't scroll the picture. The camera moves with the root, so meshes stay where they were on screen. Particles don't move with the root [`by default`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#space), so they slide out of place. Scaling the root doesn't zoom in either. Move the camera, or set its `zoom`, instead.

## Placing the camera

The camera starts at the origin, which is also where new meshes start, so move it away from them first. It looks along its own -Z axis, so with no rotation it looks into the screen. [`lookAt`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#lookat) turns it to face a point in world space, the coordinates of the scene as a whole:

```ts
view3d.camera.position.set(0, 2, 6); // up, and back toward the viewer
view3d.camera.lookAt({ x: 0, y: 0.5, z: 0 });
```

`lookAt` turns the camera once. When the camera or the point moves, call it again each frame, after the move. [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md) covers the axes, and how `lookAt` and `rotation` interact on one node. To steer the camera with the mouse, touch or keys, use a controller from [Camera controls](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md).

Add the camera under another node and it moves and turns with that node. If you remove the camera or any node above it from the view, or hide one of them, the view throws an error the next time it draws. So when a player carries the camera, put the player's model and the camera side by side in a plain `Container3D`. Then you can hide or scale the model without hiding or scaling the camera.

## Field of view

A camera starts in perspective [`mode`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#mode), where distant things look smaller. [`fov`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#fov) is the vertical field of view, the angle in degrees from the bottom to the top of what the camera sees. The picture's shape sets the horizontal field of view. A portrait phone sees less to each side than a landscape monitor, so a scene that fits the monitor loses its sides on the phone. [Framing a model](#framing-a-model) shows how to back the camera off far enough for either shape.

[`zoom`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#zoom) magnifies on top of `fov`. At a zoom of 2, the scene looks twice as large. The view reads every camera setting each time it draws, so you can change or animate them at any time.

## Near and far

A camera draws only what lies between its [`near`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#near) and [`far`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#far) distances in front of it. It doesn't draw anything closer than `near`, so a camera that comes too close to a model cuts a hole in it.

Keep `near` as large as the scene allows. The depth buffer stores how far away each pixel is, and its precision is limited. With a tiny `near`, distant surfaces that sit close together store the same depth and flicker through each other. Raising `near` fixes that. Lowering `far` barely helps.

```ts
view3d.camera.near = 0.5; // just short of the closest the camera gets to anything it shows
view3d.camera.far = 300; // just past the farthest thing it shows
```

## Orthographic cameras

Set `mode` to `'orthographic'` and nothing shrinks with distance, which suits isometric games, maps and editors. [`orthographicSize`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#orthographicsize) is half the width the camera sees, in world units. The picture's shape sets the height, so the width always fits, and a portrait phone sees more above and below.

```ts
const camera = view3d.camera;

camera.mode = 'orthographic';
camera.orthographicSize = 10; // 20 units across
camera.position.set(20, 20, 20);
camera.lookAt({ x: 0, y: 0, z: 0 }); // looks down the diagonal for an isometric view
```

Moving an orthographic camera closer doesn't make anything bigger. Shrink `orthographicSize` instead, or raise `zoom`, which magnifies here too. The camera still draws only between `near` and `far`, so keep the whole scene in front of it. With an orthographic camera, leave the view's [background](https://pixijs.com/3d/guides/components/environment.md#the-background) `null` and give the app a background colour instead.

## Switching cameras

Assign another camera to [`view3d.camera`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#camera) to draw from it. If that camera has no parent, the view adds it under `view3d.root`. If it already has a parent, it must be in this view's scene when you assign it, or the assignment throws an error.

A glTF file, the model format PixiJS 3D loads, can bring its own cameras, and [`model.cameras`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#cameras) lists them. They sit inside the model, so add the model to the view first:

```ts
import { Model3D } from '@pixi/3d';

const model = new Model3D({ source });
const ownCamera = view3d.camera;

view3d.root.addChild(model);
if (model.cameras.length > 0) view3d.camera = model.cameras[0];

// Later, switch back to the view's own camera
view3d.camera = ownCamera;
```

The previous camera stays in the scene as it was, so assigning it again switches back. A controller drives whichever camera the view has, so an [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) takes over the new camera on its next update. While the view draws from another camera, turn off the controller's [`enabled`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#enabled) so input leaves the camera alone. Also stop its updates, either by turning off [`autoUpdate`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#autoupdate) or by skipping your own `update()` calls. Undo both when you switch back.

If you destroy the view's camera, or the model it came from, assign another camera before the view next draws, or that draw throws an error.

## Framing a model

[`View3D.from`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#from) builds a view around a loaded glTF file and gives it a camera, as [Loading models](https://pixijs.com/3d/guides/components/models.md#showing-one-model-on-its-own) covers. To frame a model in a view of your own, put a [`Sphere`](https://3d.pixijs.download/v0.1.0/docs/maths.Sphere.html) around it and move the camera back until the whole sphere is in view. [`getLocalBounds`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getlocalbounds) ignores the position, rotation and scale of the model and its parents. So the snippet applies [`getGlobalTransform`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobaltransform) to move the sphere to where the model is in the world:

```ts
import { Sphere } from '@pixi/3d';

const camera = view3d.camera;
const sphere = new Sphere().setFromBox(model.getLocalBounds()).applyMatrix4(model.getGlobalTransform());
const { center, radius } = sphere;
// Half the narrower field of view, which is the horizontal one on a portrait screen and the vertical one otherwise
const aspect = app.screen.width / app.screen.height;
const halfFov = Math.atan(Math.tan((camera.fov * Math.PI) / 360) * Math.min(1, aspect));
const distance = radius / Math.sin(halfFov);

// Any direction works at that distance. This one looks down from about 30 degrees.
camera.position.set(center.x, center.y + distance * 0.5, center.z + distance * 0.87);
camera.lookAt(center);

// Models come in any size, so near and far scale with the distance
camera.near = distance / 100;
camera.far = distance * 100;
```

`app.screen` matches the view's shape when the view fills the screen. For a view of a set size, use the view's `width` and `height`. With an `OrbitCamera`, copy `center` into its [`target`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#target) instead of calling `lookAt`. Set its [`minDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#mindistance) and [`maxDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#maxdistance) from the model too, such as `radius` and `distance * 5`. The controller keeps the camera between those two distances, so limits sized for another scene pull it in or push it out.

## Next steps

- [Camera controls](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md): orbit and first-person controllers.
- [Second cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras/second-cameras.md): the scene from a second camera, drawn into a texture for a monitor or a portal.
- [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md): [`worldToScreen`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#worldtoscreen) and [`screenToRay`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoray), which convert between the screen and the scene through the view's camera.
