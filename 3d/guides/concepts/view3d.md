# View3D and 2D content

A [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) is a PixiJS display object that draws a 3D scene. You add it to the stage, then move, scale, mask and filter it like a sprite. Everything in the scene goes under [`view3d.root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root). Calling `view3d.addChild` throws.

## Size and place a view

[`autoResize`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#autoresize) gives a view the renderer's screen size on every render, so a full-screen view follows the canvas when the window resizes. Without it, a view keeps the width and height you give it, 256 by 256 by default. [`anchor`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#anchor) works as it does on a sprite. This keeps a centred view sized to the window, with a margin:

```ts
import { View3D } from '@pixi/3d';

const view3d = new View3D({ anchor: 0.5 });

app.stage.addChild(view3d);

const layout = (): void => {
  view3d.position.set(app.screen.width / 2, app.screen.height / 2);
  view3d.setSize(app.screen.width - 32, app.screen.height - 96);
};

layout();
app.renderer.on('resize', layout);
```

Three 2D habits work differently on a view:

- Setting [`width`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#width) or [`height`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#height), or calling [`setSize`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#setsize), resizes the 3D viewport, the rectangle the camera draws into. It doesn't scale the view as it would a `Sprite`. It also turns `autoResize` off, so set `autoResize` back to `true` to follow the screen again.
- The scene doesn't stretch to the view's new shape. The camera sees more or less of it instead. [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md#field-of-view) explains which way, and how to keep a scene in frame.
- A rotated view still draws into the upright rectangle around it, so its background and any mesh reaching past its edges show in the corners outside the view. Mask the view to its own rectangle to hide them.

## Several views

Each view is a separate scene, with its own root, camera, lights and environment, so a light in one view doesn't light another. A node belongs to one view at a time. Adding it under another view's root takes it out of the first, as `addChild` does in 2D.

To show the same scene from a second angle, such as on a security monitor, don't build a second view. Give a second camera a [`renderTexture`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#rendertexture), add it under `view3d.root` and tell the view to draw from it. [Second cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras/second-cameras.md) shows how.

## 2D behind and over a view

A view draws its whole scene at its place in the display list. 2D content added before the view draws behind the scene, and 2D content added after it draws over it:

```ts
app.stage.addChild(backdrop); // behind the 3D scene
app.stage.addChild(view3d);
app.stage.addChild(scoreText); // over the 3D scene
```

A view has no [`background`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#background) by default, so the 2D content behind it shows wherever no mesh covers it. A mesh whose material has an [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.AlphaMode.html) of `'blend'` blends over that content. Glass, a material with [`transmission`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#transmission), can show that content through it. [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md#how-glass-draws) says when.

Because a view draws its whole scene at once, no 2D object can go between two meshes of the same view. To put 2D content among 3D objects, draw it onto a 3D surface, as [Rendering 2D into 3D](https://pixijs.com/3d/guides/components/container-texture.md) shows.

By default a view catches the pointer anywhere in its rectangle, even over empty space, so interactive 2D content behind it never gets the pointer. [Interaction](https://pixijs.com/3d/guides/components/interaction.md#2d-content-and-the-view) shows the ways around that.

## Filters and masks

PixiJS filters work on a view, or on a 2D container that holds one. Masks clip a view as they clip a sprite. This blurs a view:

```ts
import { BlurFilter } from 'pixi.js';

view3d.filters = [new BlurFilter({ strength: 2, antialias: 'inherit', resolution: 'inherit' })];
```

[Filters](https://pixijs.com/3d/examples?example=2d3d_filters) turns a blur, a black-and-white filter, a fade and a mask with rounded corners on and off on one view.

- By default a filter draws with one sample per pixel at a `resolution` of 1. On a canvas with a `resolution` above 1, a view under the filter loses its sharpness. It also loses the canvas's `antialias` smoothing unless the view is in [composite mode](#resolution-and-composite-mode). To keep both, create every filter on the view, or on a container holding it, with `antialias: 'inherit'` and `resolution: 'inherit'`, as the blur above does.
- `view3d.alpha` and `view3d.tint` don't fade or tint a view. Give the view, or a container holding it, an `AlphaFilter` to fade it or a `ColorMatrixFilter` to tint it.
- For effects inside the 3D scene, such as bloom or ambient occlusion, add post effects. [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md) covers them.

## Resolution and composite mode

By default a view draws its scene at the resolution of its target, the thing it draws into, which is usually the canvas. Lower [`resolution`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#resolution) when a device can't keep up. The scene then draws fewer pixels and stretches them over the view. The number is absolute, like a filter's `resolution`, so derive it from the renderer's:

```ts
view3d.resolution = app.renderer.resolution * 0.67; // two thirds of the width and height
```

A resolution other than the target's puts the view in composite mode. In composite mode the view draws its scene into a texture of its own, then draws that texture onto the target. [`composite: true`](https://3d.pixijs.download/v0.1.0/docs/scene.View3DOptions.html#composite) and any enabled post effect do the same. This texture keeps the canvas's `antialias`. [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md#the-passes-list) says when it can't. 2D content behind the view still shows through, but not through [glass](https://pixijs.com/3d/guides/components/materials/physical.md#how-glass-draws).

If the resolution changes while the app runs, create the view with `composite: true`. Without it, a view with no enabled post effect rebuilds its passes, the drawing steps of its frame, each time the resolution leaves or returns to the target's.

## World to screen

[`worldToScreen`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#worldtoscreen) turns a point in the 3D world into PixiJS's global 2D coordinates, the space of `event.global`. It takes the view's anchor, position, scale and rotation into account. Use it to pin labels, health bars and markers to 3D objects, and add them after the view so they draw over it. A label added straight to an untouched `app.stage` can use the result as its position. Inside a moved, scaled or rotated container, convert the result with `label.parent.toLocal(point, undefined, label.position)`.

The point has to be in world space, the coordinates of the whole scene rather than of a node's parent. [`getGlobalPosition`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getglobalposition) gives a node's world position. This code adds 0.6 to the `y` of a drone's world position to put its label just above the drone. The offset is in world units, so it doesn't turn or scale with the drone:

```ts
import { Vector3 } from '@pixi/3d';
import { Point } from 'pixi.js';

const above = new Vector3();
const screen = new Point();

app.ticker.add(() => {
  drone.getGlobalPosition(above);
  above.y += 0.6; // just above the drone, in world units

  const point = view3d.worldToScreen(above, screen);

  label.visible = point !== null;
  if (point) label.position.copyFrom(point);
});
```

`app.ticker` draws the frame after the code you add to it, so labels you place there match what it draws. That holds even when a camera controller moves the camera from `Ticker.shared`, which it does by default. If you pin labels to a view, size the view from the renderer's `resize` event, as [Size and place a view](#size-and-place-a-view) does. With `autoResize`, a view takes the screen size only when it draws, so labels land in the wrong place on the first frame and lag a frame behind after each resize.

To pin a label to a spot on a model, such as its head, convert that spot from the model's own space with [`toGlobal`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#toglobal), which moves, turns and scales it with the model. [Screen and world](https://pixijs.com/3d/examples?example=2d3d_coordinates) pins a name tag to the top of each clay piece this way.

In perspective [`mode`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#mode), the default, `worldToScreen` returns `null` for a point at or behind the camera. Hide the label when it does. A point off to one side of the camera's view still gets a position, outside the view's rectangle. Passing your own objects to write into, as the snippet does with `above` and `screen`, stops the per-frame code from allocating.

## Screen to world

A point on the screen marks a ray, a line through the scene whose every point lands on that spot. [`screenToRay`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoray) returns that [`Ray`](https://3d.pixijs.download/v0.1.0/docs/maths.Ray.html) for a point in global coordinates, such as `event.global`. [`screenToWorld`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoworld) returns a point on the ray. Given a [`Plane`](https://3d.pixijs.download/v0.1.0/docs/maths.Plane.html), it returns where the ray meets the plane. Given a number instead, it returns the point that many units from the camera. Both methods work for a view that you move, scale or rotate on the stage.

This moves a ring to the spot on the ground under the pointer:

```ts
import { Plane, Vector3 } from '@pixi/3d';

const ground = new Plane(new Vector3(0, 1, 0), 0); // y = 0, facing up; a floor at y = h takes -h
const hit = new Vector3();

view3d.on('pointermove', (event) => {
  const point = view3d.screenToWorld(event.global, ground, hit);

  ring.visible = point !== null && Math.hypot(point.x, point.z) < 5.6; // on a round floor of radius 5.6
  if (point) ring.position.set(point.x, 0.04, point.z);
});
```

With a plane, `screenToWorld` returns `null` when the ray misses the plane, such as when the pointer is above the horizon. The plane has no edges, so check that the point lies on your ground, as the radius check does for the round floor.

With an [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) on the view, a drag that turns the camera can also end in a `pointertap`, and [Interaction](https://pixijs.com/3d/guides/components/interaction.md#clicks-hover-and-cursors) explains why. So [Screen and world](https://pixijs.com/3d/examples?example=2d3d_coordinates) drops a shape on a `pointertap` only when the tap lands within a few pixels of its `pointerdown`.

These methods never look at meshes. To find the object under the pointer, listen for pointer events on the objects, or call [`raycast`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#raycast). [Interaction](https://pixijs.com/3d/guides/components/interaction.md) covers both.

## Next steps

- [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md): positions, rotations and world space.
- [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md): placing and aiming the camera.
- [Rendering 2D into 3D](https://pixijs.com/3d/guides/components/container-texture.md): drawing PixiJS containers onto 3D surfaces.
