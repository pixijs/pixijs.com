# How a frame renders

When PixiJS renders the stage and reaches a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html), the view draws its whole 3D scene at that point. PixiJS then carries on with the 2D content after it.

## The passes in a frame

The view draws each frame in passes, and each pass draws one part of the picture. This list of passes is the view's render graph. The passes run in this order:

1. **Shadows.** Lights that cast shadows draw the shadow-casting meshes into their shadow maps, pictures of depth as seen from each light. [Shadows](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md) covers shadows and how to redraw them less often.
2. **`'beforeOpaque'` items** in [`view3d.passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes). They run before the view draws its scene, so a texture they fill, such as a second camera's render texture, shows in the scene on the same frame.
3. **Background and opaque meshes.** The view draws its [`background`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#background), if it has one, then the opaque meshes. A depth test keeps the surface nearest the camera at each pixel, so unlike 2D, child order doesn't decide which mesh ends up in front. To draw a mesh over the opaque ones, such as a marker that shows through walls, give it a `'blend'` material so it draws after them. When you create that material, set its [`state`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#state)`.depthTest` to `false`.
4. **`'afterOpaque'` items.** Glass refracts what these items draw, and transparent meshes draw over it.
5. **A copy of the picture so far.** The view takes it only on frames when a later pass reads it. Glass reads it, so a glass mesh in the scene costs a copy every frame.
6. **Glass, then transparent meshes.** Meshes whose materials have transmission draw first and refract the copy. [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md) covers glass. Then the view draws the `'blend'` meshes from back to front by their distance from the camera, not by child order, as [Materials](https://pixijs.com/3d/guides/components/materials.md#transparency) explains.
7. **`'afterTransparent'` items.** They run after every mesh in the scene and before any post effect.
8. **Post effects.** The `'beforeToneMapping'` effects run first. Then comes the view's [`tone mapping`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#tonemapping), which turns the scene's light into the colours the screen shows, and then the `'afterToneMapping'` effects.

The view skips the shadow pass while no light casts shadows. It also skips a pass that draws meshes while no mesh in the scene belongs to it, so a scene without shadows or glass pays nothing for them. Hiding a mesh or a light, or moving a mesh off-screen, doesn't skip its passes. A pass whose meshes are all hidden still runs until you remove them from the scene.

Each item in `view3d.passes` runs at the step its [`stage`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#stage) names, wherever it sits in the array. [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md) covers that list, the built-in effects and how to write your own effect.

With a `'beforeToneMapping'` effect on, the view draws its scene into a floating-point texture, so those effects see light brighter than white. The view then applies the tone mapping once, after the last of those effects, rather than in each material. Transparent meshes and glass then blend with what's behind them before the tone mapping rather than after, so they can look different once you add such an effect.

On WebGL2, rendering throws on a device without the `EXT_color_buffer_float` extension, so check for it before you add a `'beforeToneMapping'` effect such as bloom:

```ts
import { BloomEffect } from '@pixi/3d/extras';
import { RendererType } from 'pixi.js';
import type { WebGLRenderer } from 'pixi.js';

// WebGPU can always draw into a floating-point texture
const canDrawFloat =
  app.renderer.type !== RendererType.WEBGL ||
  Boolean((app.renderer as WebGLRenderer).context.extensions.colorBufferFloat);

if (canDrawFloat) view3d.passes = [new BloomEffect()];
```

## Which passes draw a mesh

A mesh's material and its own settings decide which passes draw it:

- A material whose [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.AlphaMode.html) is `'opaque'` or `'mask'` puts its meshes in the opaque pass, and one whose `alphaMode` is `'blend'` puts them in the transparent pass.
- A [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html) built with [`transmission`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#transmission) puts its meshes in the transmission pass instead. That's where glass draws.
- [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) adds the shadow pass, unless the material blends or has transmission. [Shadows](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md#which-meshes-cast-and-receive) says which meshes cast.
- A material can join extra passes by name, such as an outline pass, as [Mesh passes](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes) shows. To add a single mesh to one, call [`enablePass`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#enablepass).

When a mesh doesn't draw where you expect, its [`renderPassMask`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#renderpassmask) reports the passes that draw it as [`RenderPassBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderPassBit.html) flags. A [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) doesn't take its passes from its materials. Instead, give each object in it those flags with [`setPassesAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setpassesat), as [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md) shows.

## When shaders compile

A mesh's shader is the program the GPU runs to draw it. It's built from what the mesh needs, such as its material's features, the data its geometry carries, the bones or morph targets that bend it, and a few of the view's settings. Each combination compiles once per renderer, and every mesh that needs it shares it. So the number of shaders grows with the combinations a scene uses, not with its mesh count.

The first frame that needs a new combination compiles it, and that frame can stall, most of all on WebGL. The view settings below are built into the shaders of the materials they affect. Changing one makes new combinations, which compile on the next frame:

- [`toneMapping`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#tonemapping). With a `'beforeToneMapping'` effect on, the materials keep their shaders, and only the shader that applies it to the whole picture compiles.
- [`fog`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#fog): turning it on or off, or changing its `type`.
- [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment): switching between none, a [`Hemisphere`](https://3d.pixijs.download/v0.1.0/docs/environment.Hemisphere.html) and a cube map (`CubeTexture`). Swapping one cube map for another recompiles no material. The first frame that uses each cube map still spends time preparing it for lighting, and later frames don't repeat that work.
- Shadows: the first time a light in the view casts shadows, each mesh that [`receives them`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#receiveshadow) and has a material that reacts to light gets a shader that samples them. It keeps that shader, so turning shadows off and on later compiles nothing. From then on, [`shadowFilter`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#shadowfilter) is built in too.
- [`passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes): turning on the first `'beforeToneMapping'` effect or turning off the last, and adding an effect whose [`requiredOutputs`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#requiredoutputs) makes the view draw extra data along with the scene, such as [`MotionBlurEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.MotionBlurEffect.html), which reads each pixel's motion.

A mesh also gets a new shader in these cases:

- You change its [`billboardMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#billboardmode).
- You give it a geometry that carries different data, such as one without UVs (texture coordinates). A sphere in place of a cube carries the same data and compiles nothing.
- It joins an extra pass that draws with a shader of its own, such as an [`OutlinePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.OutlinePass.html), for the first time. So an outline that [`enablePass`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#enablepass) turns on when the pointer enters a mesh can stall that first hover.

[Materials](https://pixijs.com/3d/guides/components/materials.md#changing-a-material-that-has-rendered) covers what a change to a material needs.

Values the shaders read as data compile nothing when they change: [`exposure`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#exposure), the fog's colour and distances, a hemisphere's colours, light colours and intensities, and the number of lights. The renderer keeps every combination it has compiled, so switching a setting back and forth compiles only on the first use of each value. Choose the view's settings before the first render where you can, and change them on a loading screen or in a settings menu rather than during play.

```ts
import { View3D } from '@pixi/3d';

// Given here, they're in place when the first render compiles the scene's shaders
const view3d = new View3D({
  autoResize: true,
  environment: { skyColor: 0xc9d2ff, groundColor: 0x2a2140, intensity: 0.9 },
  fog: { type: 'linear', color: 0x14131c, near: 20, far: 34 },
});
```

## Next steps

- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): draw calls, culling and a checklist for phones.
- [Debugging](https://pixijs.com/3d/guides/components/debugging.md#recording-frames): recording a view's frames to see its passes and draws.
- [WebGL and WebGPU](https://pixijs.com/3d/guides/concepts/webgl-and-webgpu.md): where the two backends differ.
