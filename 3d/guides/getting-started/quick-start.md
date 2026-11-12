# Quick start

This page builds a cube spinning on a floor one step at a time, then loads a glTF model into the scene. Install `pixi.js` and `@pixi/3d` first, as [Installation](https://pixijs.com/3d/guides/getting-started/installation.md) shows.

## Create an application

A 3D scene runs in an ordinary PixiJS application:

```ts
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  preference: 'webgpu',
  resizeTo: window,
  antialias: true,
  background: 0x1a1a2e,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
});
document.body.appendChild(app.canvas);
```

`preference: 'webgpu'` picks WebGPU where the browser has it and WebGL2 elsewhere. PixiJS 3D draws with either. If the GPU lacks a WebGPU feature that PixiJS 3D needs, `app.init` throws instead of falling back. [WebGL and WebGPU](https://pixijs.com/3d/guides/concepts/webgl-and-webgpu.md#choosing-a-renderer) shows how to check first. Capping `resolution` at 2 means a 3x phone screen draws fewer than half its pixels.

## Add a view

A [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) is a display object that draws a 3D scene, so you add it to the stage like a sprite. Everything in the scene goes under its [`root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root).

```ts
import { View3D } from '@pixi/3d';

const view3d = new View3D({
  autoResize: true,
  shadowQuality: 'high',
  environment: { skyColor: 0xc9d6ff, groundColor: 0x3a2f45, intensity: 0.6 },
});

app.stage.addChild(view3d);
```

- [`autoResize`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#autoresize) gives the view the screen's size on every render, so it follows the canvas as `resizeTo` resizes it. [View3D and 2D content](https://pixijs.com/3d/guides/concepts/view3d.md#size-and-place-a-view) covers sizing and placing views.
- [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment) is light from the surroundings. This one is a [`Hemisphere`](https://3d.pixijs.download/v0.1.0/docs/environment.Hemisphere.html), which gives surfaces facing up the sky colour, surfaces facing down the ground colour, and the sides a mix of the two. [Environment](https://pixijs.com/3d/guides/components/environment.md#a-cube-map) covers cube maps, which light the scene from an image of its surroundings.
- A [`shadowQuality`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#shadowquality) of `'high'` gives sharper shadows than the default and uses [`four times the memory`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShadowQuality.html).

## Place the camera

Every view comes with a [`Camera3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html), at [`view3d.camera`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#camera). Move it up and back:

```ts
view3d.camera.position.set(3, 3, 5);
```

+Y is up, and a camera with no rotation looks along -Z, into the screen. The [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) added below turns it to face the cube. Without a controller, aim it with [`lookAt`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#lookat), as in `view3d.camera.lookAt({ x: 0, y: 0.4, z: 0 })`.

## Add a sun

```ts
import { DirectionalLight } from '@pixi/3d';

const sun = new DirectionalLight({ color: 0xfff4e0, intensity: 3, castShadow: true });

sun.position.set(-3, 5, 2);
view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });
```

A [`DirectionalLight`](https://3d.pixijs.download/v0.1.0/docs/scene.DirectionalLight.html) shines in one direction everywhere, like the sun. It points along its local -Z axis, and `lookAt` aims it. Its position changes neither its light nor where its shadow falls. Here it only gives `lookAt` a point to aim from.

[`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#castshadow) turns on the sun's shadow, and the sun fits that shadow around the meshes that cast one. The meshes below [`cast`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) and [`receive`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#receiveshadow) shadows by default. [Lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md) and [Shadows](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md) cover the other lights and the shadow settings.

## Add a floor and a cube

```ts
import { CubeGeometry, Material3D, Mesh3D, PlaneGeometry } from '@pixi/3d';

const floor = new Mesh3D({
  geometry: new PlaneGeometry({ width: 8, height: 8 }),
  material: new Material3D({ baseColor: 0x888888, roughness: 0.85 }),
  castShadow: false,
});

floor.rotation.x = -Math.PI / 2;
view3d.root.addChild(floor);

const cube = new Mesh3D({
  geometry: new CubeGeometry({ width: 0.8, height: 0.8, depth: 0.8 }),
  material: new Material3D({ baseColor: 0xdd4444, roughness: 0.5 }),
});

cube.position.y = 0.4;
view3d.root.addChild(cube);
```

A [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) draws a geometry with a material. The geometry is its shape, and the material is how its surface looks. A [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html)'s [`roughness`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#roughness) runs from 0 for a mirror-like surface to 1 for a fully rough one.

A [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) is upright and faces +Z. Seen from behind, it draws nothing unless its material is [`doubleSided`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#doublesided). Turning it -π/2 around X lays it flat, facing up. Turning it +π/2 instead faces it down, so the floor disappears when seen from above.

The floor only receives shadows, so it turns [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) off. The sun then fits its shadow to the cube instead of the whole floor, which keeps the shadow sharp.

A [`CubeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CubeGeometry.html) is centred on its origin, so lifting the cube by half its height sets it on the floor.

## Spin the cube

Animate from the application's ticker, as in 2D:

```ts
app.ticker.add((ticker) => {
  cube.rotation.y += 0.5 * (ticker.deltaMS / 1000);
});
```

## Orbit the camera

```ts
import { OrbitCamera } from '@pixi/3d/extras';

new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.4, z: 0 },
  enableDamping: true,
  minDistance: 2,
  maxDistance: 15,
});
```

[`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html), from `@pixi/3d/extras`, moves the view's camera around a target point. Drag to orbit, and scroll or pinch to zoom. It starts from where the camera is and always turns it to face the [`target`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#target). [`enableDamping`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#enabledamping) keeps the camera turning for a moment after the pointer stops and slows it to a stop. [`minDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#mindistance) and [`maxDistance`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#maxdistance) keep it between 2 and 15 units from the target.

PixiJS listens for wheel events but doesn't block them, so a page that can scroll also scrolls as you zoom. For a full-window canvas, stop the page from scrolling, for example with `body { margin: 0; overflow: hidden; }`. In Chrome, a trackpad pinch also zooms the whole page. [Orbit camera](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md#orbit-camera) shows a canvas listener that stops the page from scrolling and zooming.

[Camera controls](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md) covers panning, the other settings and a first-person controller.

## Load a model

```ts
import { Model3D } from '@pixi/3d';
import type { Scene3DSource } from '@pixi/3d';
import { Assets } from 'pixi.js';

// Fox by PixelMannen (CC0), rigging and animation by tomkranis (CC BY 4.0), glTF conversion by
// @AsoboStudio and @scurest (CC BY 4.0)
const source = await Assets.load<Scene3DSource>(
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/Fox/glTF-Binary/Fox.glb',
);
const fox = new Model3D({ source });

fox.scale.set(0.8 / fox.height);
fox.position.x = 1.5;
view3d.root.addChild(fox);
fox.player?.play('Walk');
```

glTF is an open file format for 3D models, saved as `.gltf` or a single binary `.glb`. Importing `@pixi/3d` registers loaders for both with `Assets`. `Assets.load` returns a [`Scene3DSource`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html) that holds the file's data. A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) is a container that builds the file's meshes, lights and cameras inside itself.

A model keeps the units it was made in, and the fox's [`height`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#height) is about 80. To get the scale, divide the height you want, here the cube's 0.8, by the model's height. When the file has animations, the model's [`player`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#player) [`plays`](https://3d.pixijs.download/v0.1.0/docs/animation.AnimationPlayer.html#play) them by name. [Animation](https://pixijs.com/3d/guides/components/animation.md) shows how to list the names and blend clips.

To show one model on its own, [`View3D.from`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#from) builds a view around it with a camera and a light. [Loading models](https://pixijs.com/3d/guides/components/models.md) covers both ways.

## Next steps

- [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md): grouping nodes, the axes, and the two ways to rotate.
- [Materials](https://pixijs.com/3d/guides/components/materials.md): choosing a material and its features.
- [Loading models](https://pixijs.com/3d/guides/components/models.md): sources, models, compressed files and cleaning up.
- [Interaction](https://pixijs.com/3d/guides/components/interaction.md): clicking, hovering and dragging 3D objects.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): keeping a scene fast on phones, and [which node to use for many objects](https://pixijs.com/3d/guides/components/scene-objects.md#choosing-a-node-for-many-objects).
