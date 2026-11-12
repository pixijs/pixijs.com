# Debugging

`@pixi/3d/extras` has a few tools that show what a scene holds and how a view draws it. Use them while you work on a scene, and leave them out of what you ship.

[`logHierarchy`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#loghierarchy) prints a container and everything under it to the console, one line each, with its class and label. Use it to see what a loaded model holds. [Loading models](https://pixijs.com/3d/guides/components/models.md#file-contents) says how a file's names become labels, and [Parents and children](https://pixijs.com/3d/guides/concepts/scene-graph.md#parents-and-children) shows how `getChildByLabel` finds one.

If you load PixiJS 3D from the [CDN](https://pixijs.com/3d/guides/getting-started/installation.md#cdn), map `dist/pixijs-3d.mjs` and `dist/pixijs-3d-extras.mjs` while you debug. Class names then print in full, both in the console and in the overlay below.

## Wireframes

[`WireframePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.WireframePass.html) is a pass, one of the steps a view takes to draw a frame. It draws meshes a second time as lines, over their shading, so you can see how many triangles a mesh has and where they go.

Add the pass to the view, then opt meshes in by its name, `'wireframe'`, as with any [mesh pass](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes). Use a material's `passes` option, or [`enablePass`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#enablepass) to opt in one mesh at a time, as [Passes per mesh](https://pixijs.com/3d/examples?example=post_passes-per-mesh) does with outlines. A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) has no `enablePass`, so walk a loaded model with [`traverse`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#traverse) to reach its meshes:

```ts
import { Mesh3D } from '@pixi/3d';
import { WireframePass } from '@pixi/3d/extras';

view3d.passes = [...view3d.passes, new WireframePass({ color: 0x00ff88 })];

model.traverse((node) => {
  if (node instanceof Mesh3D) node.enablePass('wireframe');
});
```

[Outlines and wireframes](https://pixijs.com/3d/examples?example=post_material-passes) turns the pass on and off over a puck, a sphere and a torus.

The lines show through whatever is in front of them, including the far side of the mesh. They aren't an exact wireframe. Some edges are missing, and some lines aren't edges at all.

Leave out meshes whose geometry has no normals, the direction each vertex faces, such as the fox from the [Quick start](https://pixijs.com/3d/guides/getting-started/quick-start.md#load-a-model). Rendering throws on them, and the app stops drawing.

## Recording frames

[`GraphDebugOverlay`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugOverlay.html) is an HTML panel that records how a view draws each frame. Create it with the view and the renderer:

```ts
import { GraphDebugOverlay } from '@pixi/3d/extras';

new GraphDebugOverlay({ view: view3d, renderer: app.renderer });
```

The panel sits in the top-right corner of the page. Once the view has rendered, press Record, use your app, then press Stop. A recording also stops by itself after [`maxRecordedFrames`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugOverlayOptions.html#maxrecordedframes) frames. Recording adds CPU time to each frame, so stop it before you measure frame times.

After you press Stop, the panel fills most of the window, with a slider that steps through the recorded frames. Hide shrinks it to a button. The panel has two tabs:

- **Workload** covers each pass that draws meshes, such as the shadow, opaque or wireframe pass. It shows each pass's draws and triangles, and how its draws compare with the frame before: reused, repacked or rebuilt ([`GraphDebugDrawBuildSnapshot.status`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugDrawBuildSnapshot.html#status) lists them all). Select a pass, then a row. A pass has one row for the scene's meshes and one for each [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html). The Inspector says why the draws changed and lists them. Select a draw to see its meshes, materials, textures and geometry. ‹ Change and Change › skip to frames where a pass did extra work, such as rebuilding its draws.
- **Render Graph** lists every pass the view built, including the ones it skipped that frame, with the textures each one reads and writes. [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame) explains the passes.

The Inspector lists a draw's meshes by [`label`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#label), so give your meshes one.

Three things to look for in Workload:

- **More draws than you expect.** The row's Geo, Mat and Tex columns count the geometries, materials and textures its draws use. [What makes a draw call](https://pixijs.com/3d/guides/concepts/performance.md#draw-calls) explains which meshes can share one.
- **Draws rebuilt on frames where nothing should change.** The Inspector names the cause, such as a geometry or material change, and [`GraphDebugDrawRebuildCauseCode`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugDrawRebuildCauseCode.html) lists every cause. In the transparent pass, expect `order changed` while the camera moves. Meshes with `alphaMode: 'blend'` draw back to front, so the view sorts them again.
- **`mesh added` or `mesh removed` on every frame.** Adding or removing a mesh repacks or rebuilds the draws. Hide the mesh with [`visible`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#visible) instead, and the view reuses the draws.

Copy Frame copies the frame you're looking at to the clipboard as JSON. Copy Recording copies every recorded frame, in the shape [`GraphDebugRecording.toJSON`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugRecording.html#tojson) returns. [`destroy`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugOverlay.html#destroy) removes the panel.

## Pixel velocity

[`VelocityViewer`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.VelocityViewer.html) replaces the picture with how far each pixel's surface moved on screen since the last frame. That motion is what [`MotionBlurEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.MotionBlurEffect.html) blurs by. The hue shows the direction and the brightness shows the speed, and the class reference lists the colours. Like the blur, it sees only the camera's motion, so with the camera still the picture is black, even where objects move.

```ts
import { VelocityViewer } from '@pixi/3d/extras';

const viewer = new VelocityViewer({ scale: 0.6 });

view3d.passes = [...view3d.passes, viewer]; // it replaces the picture, so it goes last

window.addEventListener('keydown', (e) => {
  if (e.key === 'v') viewer.enabled = !viewer.enabled;
});
```

Raise [`scale`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.VelocityViewer.html#scale) to brighten slow motion. In [Motion blur](https://pixijs.com/3d/examples?example=post_motion-blur), an inset shows the orbiting scene through a `VelocityViewer`, beside the blur that follows the same motion.

## Next steps

- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): what puts meshes in one draw call, and a checklist for phones.
- [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md): the passes the overlay lists, in the order they run.
