# Interaction

3D nodes, the counterpart of 2D containers, take PixiJS's own pointer events. Set a node's [`eventMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#eventmode) and listen on it as you would on a 2D container. The event names, the capture and bubble phases and `cursor` are the same.

```ts
const button = new Mesh3D({ geometry: new CubeGeometry(), material: new Material3D({ baseColor: 0x3399ff }) });
view3d.root.addChild(button);

button.eventMode = 'static';
button.cursor = 'pointer';
button.on('pointertap', () => console.log('clicked the cube'));
```

To PixiJS, a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) is one 2D object. When the pointer is over it, the view casts a ray, a line from the camera through the pointer, into the scene. It finds the closest node the ray hits and sends the event to that node through its 3D parents. Finding that node is called picking.

[Pointer events](https://pixijs.com/3d/examples?example=interaction_pointer-events) shows hover, taps and the mouse wheel on 3D shapes.

## Event modes

`eventMode` takes the same values as in 2D, and every 3D node starts as `'passive'`:

- `'static'`: the view hit-tests the node, and the node fires its listeners.
- `'dynamic'`: like `'static'`, and the view also tests again while the mouse or pen stays still, so a node that moves under the pointer gets its enter and leave events.
- `'passive'`: the node fires no listeners. Under an interactive ancestor, the view still hit-tests it and sends the hit to that ancestor. So setting a model or group to `'static'` makes every mesh in it clickable.
- `'none'`: picking skips the node and everything under it.

The renderer's `eventMode` option sets the default only for 2D containers, so 3D nodes stay `'passive'` until you set them. Each pick tests every node that takes part, so set the mode only on the nodes and groups that need it.

## Hit volumes

The view hit-tests a node against its [`hitVolume`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#hitvolume), the 3D version of `hitArea`. Left unset, a [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) uses its geometry's bounding box, the smallest box that holds all its vertices. A plain [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) has no shape of its own, so it gets events only through its children.

```ts
mesh.hitVolume = 'box'; // the bounding box, the default for a mesh
mesh.hitVolume = 'geometry'; // every triangle
mesh.hitVolume = new Sphere(new Vector3(0, 0, 0), 0.5); // a shape you choose, in the node's own space
mesh.hitVolume = new CapsuleGeometry(); // a simpler stand-in mesh, tested per triangle
```

- The bounding box is cheap, but around a round object its empty corners count as hits.
- `'geometry'` is exact, but its cost grows with the triangle count.
- A [`Box`](https://3d.pixijs.download/v0.1.0/docs/maths.Box.html) or [`Sphere`](https://3d.pixijs.download/v0.1.0/docs/maths.Sphere.html) you make can fit the object better, and is as cheap to test as the bounding box.

[Hit volumes](https://pixijs.com/3d/examples?example=interaction_hit-volumes) outlines each shape's volume and lets you switch it.

Per-triangle tests only work on ordinary triangle meshes with float positions. By default, gltfpack [quantizes](https://pixijs.com/3d/guides/components/models/compression.md#mesh-quantization) a model's positions to integers. Such a model never hits per triangle, so give it the bounding box or a stand-in. [`HitVolume3DInput`](https://3d.pixijs.download/v0.1.0/docs/events.HitVolume3DInput.html) lists the other limits.

Skinning and morph targets are the ways a model changes shape as it animates. Picking reads a mesh's vertices as stored, so neither one moves what the ray hits or the default bounding box. Give an animated character a `Box` or `Sphere` that covers it in every pose.

A [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html), like any mesh whose [`billboardMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#billboardmode) isn't `'none'`, turns to face the camera only when it's drawn. Picking still tests the unturned quad, which thins to an edge when seen from the side. Give it a `Sphere` too. A sphere set on a `Sprite3D` itself comes out squashed or stretched, so put the sphere on a group that holds the sprite instead. Set the group's `interactiveChildren` to `false` as below, and listen on the group.

Setting [`interactiveChildren`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#interactivechildren) to `false` takes everything below a node out of picking, so the view tests the node's own hit volume in place of its children's. One box on a group then covers all its meshes, with one test instead of one per mesh:

```ts
target.eventMode = 'static';
target.hitVolume = 'box'; // on a group, it fits around the children once, when you set it
target.interactiveChildren = false;
```

## 3D event fields

A pointer listener on a 3D node gets a [`Pointer3DEvent`](https://3d.pixijs.download/v0.1.0/docs/events.Pointer3DEvent.html), PixiJS's own event object with three [`Event3DFields`](https://3d.pixijs.download/v0.1.0/docs/events.Event3DFields.html) added:

- [`hit3D`](https://3d.pixijs.download/v0.1.0/docs/events.Event3DFields.html#hit3d): what the ray hit, as a [`RaycastHit3D`](https://3d.pixijs.download/v0.1.0/docs/events.RaycastHit3D.html), or `null` on a miss. Its `point` is in world space, the scene's own coordinates. A per-triangle hit also has the `normal`, the direction the surface faces, and `uv`, the texture coordinate under the pointer. Box and sphere hits report zeros for both. On a model whose texture coordinates are [quantized](https://pixijs.com/3d/guides/components/models/compression.md#mesh-quantization), stored as integers, [`uv`](https://3d.pixijs.download/v0.1.0/docs/events.RaycastHit3D.html#uv) holds the hit's place in its triangle instead, so the painting below doesn't work there.
- [`target3D`](https://3d.pixijs.download/v0.1.0/docs/events.Event3DFields.html#target3d): the 3D node the event is about. That's usually the node the ray hit or, when that node is `'passive'`, its nearest interactive ancestor. To find which mesh of a model the ray hit, set the meshes to `'static'` too and listen on the model. `target3D` is then the mesh.
- [`currentTarget3D`](https://3d.pixijs.download/v0.1.0/docs/events.Event3DFields.html#currenttarget3d): the node whose listeners are running now.

With `uv`, painting on a mesh takes a few lines. Here the mesh shows a canvas as its texture, and each move with a button or finger down draws into it:

```ts
easel.eventMode = 'static';
easel.hitVolume = 'geometry';
easel.on('pointermove', (e) => {
  if (!e.hit3D || !e.buttons) return;
  context.fillRect(e.hit3D.uv.x * canvas.width, e.hit3D.uv.y * canvas.height, 8, 8);
  texture.source.update();
});
```

[Painting on a mesh](https://pixijs.com/3d/examples?example=interaction_paint) paints a ball this way. It sends the canvas to the GPU at most once a frame rather than on every move.

PixiJS reuses event objects, so `hit3D` and its vectors change with the next event. Copy any value you keep, as in `saved.copyFrom(e.hit3D.point)`.

## Propagation

An event travels through the 3D hierarchy the same way it does through the 2D one. Capture listeners such as `pointerdowncapture` run on the way down, and plain listeners run on the way back up. As in 2D, an `on*` handler property runs in every phase that reaches the node, so a parent's `onpointerdown` runs twice per event.

[Event propagation](https://pixijs.com/3d/examples?example=interaction_event-flow) logs every node a press reaches on its way through a table, a tray and the shapes on the tray, and lets you choose which listener calls `stopPropagation()`.

`stopPropagation()` stops the event at the current node, and the view's plain `on()` listeners don't get it either. An [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) listens on the view, so stopping a press on an object keeps the drag from turning the camera, as [Dragging](#dragging) shows.

Plain `view3d.on()` listeners run after the 3D listeners and can read the 3D fields. On empty space, `target3D` is `null`. The view takes pointer events by default, so you don't need to set its `eventMode`.

## Clicks, hover and cursors

These work as in 2D:

- A press and release on the same node counts as a tap, however far the pointer moved. So a drag that orbits the camera and ends on the view taps the view. It taps the model too when it started and ended on one.
- A hovered node that you remove from the scene, or set to `'passive'` or `'none'`, gets no `pointerout` or `pointerleave`. Reset its hover look when you remove or disable it.

To act only on real clicks, ignore a tap that ends more than a few pixels from where the press began. These listeners on the view do that and select the clicked node, or nothing on empty space:

```ts
const pressedAt = new Point();

view3d.on('pointerdowncapture', (e) => pressedAt.copyFrom(e.global)); // runs even when a 3D listener stops the press
view3d.on('pointertap', (e) => {
  if (Math.hypot(e.global.x - pressedAt.x, e.global.y - pressedAt.y) > 8) return; // the user dragged the camera
  select(e.target3D); // null on empty space
});
```

Only the target's [`cursor`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#cursor) counts, so set it on the node that becomes `target3D`, even when your listener is on the view. Over empty space, and over a target without one, the view's own [`cursor`](https://3d.pixijs.download/v0.1.0/docs/events.IView3DEvents.html#cursor) shows.

A [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) takes its colour from its material, so show hover and selection there: [swap materials](https://pixijs.com/3d/guides/components/scene-objects/meshes.md#swapping-geometry-and-material), set `baseColor` on a material only that mesh uses, or [outline it](https://pixijs.com/3d/guides/components/materials/custom.md#outlines). A model's meshes share their materials with every model built from the same file, so setting `baseColor` on one of those materials changes every model. To highlight one of a model's meshes, copy its material once with [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone), such as `mesh.material.clone({ baseColor: 0xffe08a })`, and swap the mesh to the copy and back. The copy keeps the mesh's textures.

## Dragging

A drag has to keep going after the pointer leaves the object, so listen for `globalpointermove`, which fires on every move anywhere on the page. Add the listener when the drag starts, and remove it on both `pointerup` and `pointerupoutside`. The node you pressed gets `pointerupoutside` when you release anywhere else. Each finger on a touch screen is its own pointer, so compare `pointerId` to keep two drags apart.

`e.global` is still the pointer's 2D position. To slide a crate across the floor, use [`screenToWorld`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#screentoworld) to find where the pointer's ray meets the floor's [`Plane`](https://3d.pixijs.download/v0.1.0/docs/maths.Plane.html). Keep the crate's offset from the point you grabbed:

```ts
const floor = new Plane(new Vector3(0, 1, 0), 0);
const point = new Vector3();

crate.eventMode = 'static';
crate.on('pointerdown', (e) => {
  e.stopPropagation(); // an orbit camera on the view never sees this press
  if (!view3d.screenToWorld(e.global, floor, point)) return;
  const id = e.pointerId; // e is reused, so copy what the listeners below need
  const dx = crate.position.x - point.x;
  const dz = crate.position.z - point.z;

  const onMove = (move: Pointer3DEvent): void => {
    if (move.pointerId === id && view3d.screenToWorld(move.global, floor, point)) {
      crate.position.set(point.x + dx, crate.position.y, point.z + dz);
    }
  };
  const onEnd = (end: Pointer3DEvent): void => {
    if (end.pointerId !== id) return;
    crate.off('globalpointermove', onMove);
    crate.off('pointerup', onEnd);
    crate.off('pointerupoutside', onEnd);
  };

  crate.on('globalpointermove', onMove);
  crate.on('pointerup', onEnd);
  crate.on('pointerupoutside', onEnd);
});
```

[Dragging objects](https://pixijs.com/3d/examples?example=interaction_drag) drags shapes across a level plane, holding each by the point you grab.

## Picking without events

[`raycast`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#raycast) casts the same ray through any point in global coordinates and returns the closest hit, without an event. Use it where no pointer event gives you the point, such as aiming from the middle of the screen in a first-person game. Pass it a hit from [`createRaycastHit3D`](https://3d.pixijs.download/v0.1.0/docs/events.createRaycastHit3D.html) to fill, so a pick on every frame makes no garbage:

```ts
const aim = createRaycastHit3D();
const middle = { x: 0, y: 0 };

app.ticker.add(() => {
  middle.x = app.screen.width / 2;
  middle.y = app.screen.height / 2;
  crosshair.tint = view3d.raycast(middle, aim) ? 0xff4444 : 0xffffff;
});
```

On a hit, [`aim.target`](https://3d.pixijs.download/v0.1.0/docs/events.RaycastHit3D.html#target) is the node an event would go to, the same node as `target3D`. A raycast tests the same nodes that events do, so in a scene with nothing interactive it always misses.

## 2D content and the view

The view's [`containsPoint`](https://3d.pixijs.download/v0.1.0/docs/events.IView3DEvents.html#containspoint) returns `true` anywhere in its rectangle. That's why a click on empty space still reaches the view, and also why interactive 2D content behind the view never gets the pointer. There are three ways around this:

- Put the 2D content above the view in the display list. It draws on top, and a press on it never reaches the view or an `OrbitCamera` on it.
- Give the view a [`hitArea`](https://3d.pixijs.download/v0.1.0/docs/events.IView3DEvents.html#hitarea) that covers only part of it. Outside that area, events reach what's behind the view.
- Set the view's `eventMode` to `'none'` when its scene needs no pointer at all.

## Next steps

- [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md): converting between screen and world positions.
- [Camera controls](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md): the orbit and first-person controllers.
