# WebGL and WebGPU

PixiJS 3D draws with whichever GPU renderer PixiJS starts, WebGPU or WebGL2. Scenes, materials, lights and events use the same API on both.

## Choosing a renderer

Ask for WebGPU with PixiJS's `preference` option. PixiJS starts WebGPU where the browser has it and falls back to WebGL2 where it doesn't. If you leave `preference` out, PixiJS tries WebGL2 first, even in a browser that has WebGPU.

On WebGPU, PixiJS 3D needs a GPU with the `'indirect-first-instance'` feature. On a GPU without it, `app.init` throws instead of falling back to WebGL2. To fall back on those GPUs too, check for the feature before you start:

```ts
import { Application, RendererType } from 'pixi.js';

const app = new Application();
const adapter = await navigator.gpu?.requestAdapter();

await app.init({
  preference: adapter?.features.has('indirect-first-instance') ? 'webgpu' : 'webgl',
  resizeTo: window,
});

const isWebGPU = app.renderer.type === RendererType.WEBGPU;
```

`app.renderer.type` tells you which renderer started. To try a scene on WebGL2 in a browser that has WebGPU, start PixiJS with `preference: 'webgl'`.

[Installation](https://pixijs.com/3d/guides/getting-started/installation.md#how-the-backends-load) covers how each renderer's code loads, and what to import when you start PixiJS with `skipExtensionImports: true`.

## Renderer differences

These are the differences you're most likely to meet:

- **Your own shader code.** A [`ShaderBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBit.html) holds its code twice, `gpu` in WGSL for WebGPU and `gl` in GLSL for WebGL2. Write both. A bit that lacks one runs none of its code on that renderer, and you get no error. [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md#adding-your-own-shader-code) shows both.
- **Glass.** On WebGL2, [`glass`](https://3d.pixijs.download/v0.1.0/docs/materials.TransmissionOptions.html) refracts nothing in a view that draws straight onto an opaque canvas, which is what PixiJS does by default. Either PixiJS's `useBackBuffer: true` option or the view's [`composite: true`](https://3d.pixijs.download/v0.1.0/docs/scene.View3DOptions.html#composite) fixes it. [How glass draws](https://pixijs.com/3d/guides/components/materials/physical.md#how-glass-draws) covers both and says when to pick each.
- **Float textures.** Some features draw into floating-point textures. One is a cube map, six images of the surroundings, used as the view's [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment). Another is any post effect whose [`stage`](https://3d.pixijs.download/v0.1.0/docs/filters.PostEffectOptions.html#stage) is `'beforeToneMapping'`, the default for [`bloom`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html) and most other built-in effects. On WebGL2, PixiJS 3D draws into these textures only when the device has the `EXT_color_buffer_float` extension, and rendering throws on a device without it. Leave these features out on such a device. [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame) shows the check. Without the extension, a [`Hemisphere`](https://3d.pixijs.download/v0.1.0/docs/environment.Hemisphere.html) environment still lights the scene but loses its reflections, so a metal surface with no other light on it turns black.
- **Polygon offset.** A material's [`state`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#state)`.polygonOffset` won't reliably keep a mark, such as a skid mark, in front of the surface it's drawn on. WebGPU ignores it. On WebGL2, a negative offset can push a mark behind a floor seen at an angle. Leave it at 0 and lift the mark's geometry a little off the surface instead. That works on both renderers.

## How each renderer culls

Culling skips meshes outside the camera's frustum, the volume of space the camera sees, so the GPU never draws them. The view's [`cull`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#cull) mode is `'gpu'` by default. In that mode, where the test runs depends on the renderer and the browser:

- **WebGPU** tests the meshes in a compute shader, a GPU program that calculates rather than draws.
- **WebGPU in Safari, and in any browser on an iPhone or iPad,** tests them on the CPU instead. That holds for a typical scene, and even for a [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) of ten thousand trees whose [`cull`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#cull) is `'gpu'`. There, only a far larger batch culls in the compute shader.
- **WebGL2** has no compute shaders, so it tests on the CPU in `'gpu'` mode, the same as in `'cpu'` mode.
- **Blended meshes**, whose material has an [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alphamode) of `'blend'`, are tested on the CPU on both renderers.

When culling runs on the CPU, it tests every mesh every frame, even when nothing moves, so its cost grows with the number of meshes. [`CullMode`](https://3d.pixijs.download/v0.1.0/docs/scene.CullMode.html) says when to use each mode.

[Batching and culling](https://pixijs.com/3d/examples?example=instancing_batching) sets [`Camera3D.cullFrustum`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#cullfrustum) to the frustum of a scout camera that sweeps round a field of clay pieces, so you can watch culling from outside that camera. Its pane switches `cull` between `'off'`, `'cpu'` and `'gpu'` and counts the pieces that survive.

## Next steps

- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): draw calls, culling and a checklist for phones.
- [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md): the passes a view runs each frame.
