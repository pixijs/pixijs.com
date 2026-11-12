# Camera controls

`@pixi/3d/extras` has two controllers that move [`view3d.camera`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#camera) for you. [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) turns it around a point as the user drags, for model viewers and strategy maps. [`FPSCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html) turns it with the mouse or a finger and moves it with the keys, for walking through a scene.

A controller owns the camera's rotation, so steer the camera through the controller rather than with the camera's [`lookAt`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#lookat). The orbit camera turns the camera to face its target on every update. The first-person camera sets the rotation from its yaw and pitch. Yaw is how far it has turned left or right, and pitch is how far it has tilted up or down.

## Orbit camera

Place the camera, then give the controller the view and the point to orbit:

```ts
import { OrbitCamera } from '@pixi/3d/extras';

view3d.camera.position.set(0, 2, 6);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1, z: 0 },
  enableDamping: true,
  minDistance: 2,
  maxDistance: 12,
  maxPolarAngle: Math.PI * 0.48,
});
```

The [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) reference lists its mouse and touch gestures, and [`mouseButtons`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#mousebuttons) and [`touches`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#touches) reassign them. The controller starts from wherever the camera is, so move the camera away from the [`target`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#target) first. A new camera sits at the origin, which is also the default target, so it has no distance to turn or zoom through.

When a model file has no camera, [`View3D.from`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#from) places a new one facing the middle of the model. But the orbit camera's target still starts at the origin, so the controller turns the camera to face the origin, and the top of a tall model standing there goes off screen. Pass the model's centre as the target:

```ts
const orbit = new OrbitCamera({ view: view3d, target: view3d.root.getLocalBounds().getCenter() });
```

To drag an object without turning the camera, stop the event's propagation, as [Dragging](https://pixijs.com/3d/guides/components/interaction.md#dragging) shows. A drag that orbits the camera and ends on the model it started on still fires `pointertap` on that model. [Clicks, hover and cursors](https://pixijs.com/3d/guides/components/interaction.md#clicks-hover-and-cursors) shows how to tell a tap from a drag.

PixiJS listens for wheel events passively, so the browser still acts on them. In a page that scrolls, the wheel scrolls the page as well as zooming the camera, and in Chrome a trackpad pinch zooms the whole page. A wheel listener of your own on the canvas stops both, and the camera still zooms:

```ts
app.canvas.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
```

### Damping and auto-rotate

With [`enableDamping`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#enabledamping) on, turning and panning keep going for a moment after the pointer stops moving, then ease to a stop. Zooming still happens at once. [`autoRotate`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#autorotate) turns the camera around the target by itself, for a turntable view, and pauses while the user drags.

### Limits

[`minDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#mindistance) and [`maxDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#maxdistance) set how close to the target the camera can get and how far from it, so size them to the model. An orthographic camera draws far things as large as near ones. It zooms by changing its [`zoom`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#zoom) instead, between [`minZoom`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#minzoom) and [`maxZoom`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#maxzoom).

[`maxPolarAngle`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#maxpolarangle) limits how low the camera goes. The [`polar angle`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#polarangle) is 0 straight above the target and π/2 level with it. A little under π/2 keeps the camera above the target's height, and so above a floor the target sits on.

### Map-style controls

[`zoomToCursor`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#zoomtocursor) makes the wheel zoom toward the point under the pointer, and a pinch zoom toward the point between the fingers. With [`screenSpacePanning`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#screenspacepanning) off, a pan moves the target across the ground at the target's own height instead of across the screen. Set the left button and one finger to pan as well, and these two options make a map or strategy-game camera:

```ts
view3d.camera.position.set(0, 10, 10);

const orbit = new OrbitCamera({
  view: view3d,
  zoomToCursor: true,
  screenSpacePanning: false,
  mouseButtons: { left: 'pan', right: 'rotate' },
  touches: { one: 'pan', two: 'zoom-rotate' },
  minDistance: 4,
  maxDistance: 40,
  maxPolarAngle: Math.PI / 3,
});
```

> [!NOTE]
> For content built with Z as its up axis rather than Y, such as terrain from map data, keep [`up`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#up) at its default, +Y. Then stand the content upright in a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) with `rotation.x = -Math.PI / 2`.

### Moving the camera from code

[`rotate`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#rotate), [`pan`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#pan) and [`zoom`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#zoom) move the camera the way a gesture does. Use them for keyboard shortcuts or buttons. Damping eases a turn or a pan from these calls the same way it eases a gesture.

```ts
// Swing round and up from the starting view, and step back a little
orbit.rotate(0.7, 0.35);
orbit.zoom(0.8);
```

To jump to a new view, set the camera's `position` and the `target` together. The controller picks up both on its next update, within its limits. With damping on, a turn or pan that is still easing to a stop when you jump carries on from the new view. [Framing a model](https://pixijs.com/3d/guides/components/scene-objects/cameras.md#framing-a-model) shows how far back to put the camera.

## First-person camera

```ts
import { FPSCamera } from '@pixi/3d/extras';

const walker = new FPSCamera({
  view: view3d,
  position: { x: 0, y: 1.7, z: 9 },
  pointerLock: true,
});
```

The [First-person camera](https://pixijs.com/3d/examples?example=cameras_first-person) example walks through a clay maze and has an on-screen joystick for touch.

Dragging looks around, the WASD or arrow keys walk, and Space and Shift move the camera up and down. With [`pointerLock`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#pointerlock) on, a mouse press captures the pointer instead of starting a drag. Moving the mouse then looks around until the user presses Escape. Touch still looks by dragging. The example folds its settings pane away while the pointer is captured, using the controller's `lock` and `unlock` events.

A page in a sandboxed iframe without `allow-pointer-lock` can't capture the pointer. With `pointerLock` on, the mouse then can't look around at all. If the document fires `pointerlockerror` before any capture has worked, turn `pointerLock` off.

The camera starts facing -Z, into the screen, whatever rotation it had before, unless you pass a [`yaw`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#yaw) and [`pitch`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#pitch). Turn the camera by changing those two. Unlike a 2D rotation, a positive yaw turns it left. W walks the way the camera looks, pitch included, so walking while looking down sinks the camera through the floor. The controller has no gravity or walls. [Updating each frame](#updating-manually) shows how to hold the camera at eye height.

The controller reads keys from `window`, so typing W into a text field on the page walks too. Turn [`keyboard`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#keyboard) off while a field has focus.

### Touch joystick

To walk on a touch screen, draw a joystick as a 2D container above the view, as the example does. Because it sits above the view, it gets presses in its corner before the view does. Write the joystick's offset into [`move`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#move), which the controller adds to the keys on every update, and set it back to zero on release:

```ts
// In the joystick's globalpointermove listener, where dx and dy are the finger's offset from
// where it pressed down, kept within 60 pixels. Screen y grows downward, so pushing the joystick up (a
// negative dy) gives a positive z, which walks forward.
walker.move.set(dx / 60, 0, -dy / 60);

// In its pointerup and pointerupoutside listeners
walker.move.set(0, 0, 0);
```

## Updating manually

By default both controllers update from `Ticker.shared`, while an `Application` renders from its own `app.ticker`. To run code right after the camera moves and before the frame renders, turn [`autoUpdate`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#autoupdate) off and call [`update`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#update) from `app.ticker` yourself. It returns `true` when the camera moved. To hold the first-person camera at eye height:

```ts
walker.autoUpdate = false;

app.ticker.add((ticker) => {
  if (walker.update(ticker)) walker.camera.position.y = 1.7;
});
```

Space and Shift then do nothing. Looking down also slows the walk, since only the level part of each step is left. [`OrbitCamera's autoUpdate`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#autoupdate) works the same way. Its damping and auto-rotate move the camera only while something calls `update` every frame.

## Switching controllers

Call [`destroy`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#destroy) on one controller before you make another for the same view, since two at once both try to move the camera. Destroy a controller when you destroy its view, too. The view doesn't know about the controller, so a controller left behind keeps updating from `Ticker.shared` and holds the view in memory. A leftover [`FPSCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html) also keeps reading keys from `window`.

[`Destroying`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html#destroy) either controller leaves the camera where it is, so a new first-person camera can carry on from the orbit camera's view:

```ts
import { Vector3 } from '@pixi/3d';

orbit.destroy();

// A camera looks along its local -Z axis; turn that direction into yaw and pitch
const facing = new Vector3(0, 0, -1).applyQuaternion(view3d.camera.quaternion);
const walker = new FPSCamera({
  view: view3d,
  yaw: Math.atan2(-facing.x, -facing.z),
  pitch: Math.asin(facing.y),
});
```

## Writing your own controller

A 2D game often scrolls by moving a world container. In 3D you move the camera instead, and a controller is code that does that every frame. A camera that follows a player keeps an offset from it and eases toward that spot, so it trails a little behind quick moves:

```ts
import { Vector3 } from '@pixi/3d';

const offset = { x: 0, y: 6, z: 8 }; // fixed in the world, so the camera keeps its angle when the player turns
const focus = new Vector3();
const gap = new Vector3();

app.ticker.add((ticker) => {
  // Close the same share of the gap each second, whatever the frame rate
  const ease = 1 - Math.exp(-4 * (ticker.deltaMS / 1000));

  player.getGlobalPosition(focus);
  gap.copyFrom(focus).add(offset).subtract(view3d.camera.position);
  view3d.camera.position.addScaledVector(gap, ease);
  view3d.camera.lookAt(focus);
});
```

## Next steps

- [Cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md): field of view, orthographic cameras and framing a model.
- [Interaction](https://pixijs.com/3d/guides/components/interaction.md): pointer events on 3D objects.
- [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md): 2D controls drawn over a 3D scene.
