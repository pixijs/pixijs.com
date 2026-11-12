# Post-processing

A post effect changes the picture a view has drawn. For example, it can add a glow around bright lights, darken creases and corners, or smooth jagged edges. The built-in effects come from `@pixi/3d/extras`. Add them to the view's [`passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes) list, the extra steps the view takes as it draws a frame:

```ts
import { View3D } from '@pixi/3d';
import { BloomEffect } from '@pixi/3d/extras';

const view3d = new View3D({
  autoResize: true,
  passes: [new BloomEffect({ threshold: 0.7, intensity: 1.8 })],
});
```

A PixiJS filter on the view gets only the picture as the screen will show it. A post effect can also read the scene's depth, the distance to the surface at each pixel, which is how ambient occlusion finds corners. It can also run before tone mapping, the step that turns the scene's light into the colours the screen shows. Before tone mapping, a lamp can still be brighter than white, so bloom can pick it out.

## The passes list

The view copies the array you give it, so pushing to that array later changes nothing. Assign a new array instead, as you would a container's `filters`:

```ts
import { SsaoEffect } from '@pixi/3d/extras';

view3d.passes = [new SsaoEffect(), ...view3d.passes];
```

Each effect runs at a [`stage`](https://3d.pixijs.download/v0.1.0/docs/filters.PostEffect.html#stage). A `'beforeToneMapping'` effect works on the scene's light, and an `'afterToneMapping'` effect works on the picture as the screen shows it. The view runs the `'beforeToneMapping'` effects, then tone mapping, then the `'afterToneMapping'` effects, and runs each group in array order. Bloom runs before tone mapping and FXAA after it, so `[new FxaaEffect(), new BloomEffect()]` still runs FXAA after bloom. [Stacking effects](https://pixijs.com/3d/examples?example=post_effect-stack) shows when order matters.

While a `'beforeToneMapping'` effect is on, the view draws its scene into a floating-point texture, which can hold light brighter than white. On WebGL2, rendering then throws on a device without the `EXT_color_buffer_float` extension. [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame) shows how to check for it.

**Turning an effect on and off.** Set its [`enabled`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#enabled) to `false` and the view stops running it. Each change rebuilds the view's render graph, its list of drawing steps, on the next render. It can also recompile the scene's shaders, as [When shaders compile](https://pixijs.com/3d/guides/concepts/rendering.md#when-shaders-compile) lists. That's fine for a settings toggle, but don't toggle it every frame.

An effect's other properties, such as [`intensity`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html#intensity) or [`tint`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.TintEffect.html#tint), are values its shader reads, so changing them every frame is cheap. An `intensity` of 0 hides an effect, but the effect still runs. Set `enabled = false` to save its cost.

**Antialiasing.** An enabled post effect makes the view draw its scene into a texture first, as [View3D](https://pixijs.com/3d/guides/concepts/view3d.md#resolution-and-composite-mode) explains. That texture keeps the canvas's `antialias` setting, with one exception. If a pass has the scene draw an extra texture the GPU can't average, the scene's edges come out jagged. [`SsaoEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.SsaoEffect.html) with [`sceneNormals: true`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.SsaoEffectOptions.html#scenenormals) on WebGL does this, and [`SceneOutput`](https://3d.pixijs.download/v0.1.0/docs/rendering.SceneOutput.html) lists the formats that cause it. For that view, or for a canvas without `antialias`, add an [`FxaaEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.FxaaEffect.html) as the last `'afterToneMapping'` effect so it smooths the finished picture. [Anti-aliasing](https://pixijs.com/3d/examples?example=post_antialiasing) shows each case.

**Cleaning up.** Replacing the list or destroying the view never destroys the effects in it, since one effect can be in several views. Call [`destroy`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#destroy) on each effect or pass you stop using.

## Built-in effects

| Effect                   | What it does                                                                     | Stage by default      |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------- |
| [`BloomEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html)      | Bright parts of the picture glow into their surroundings.                        | `'beforeToneMapping'` |
| [`SsaoEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.SsaoEffect.html)       | Ambient occlusion: darkens creases, corners and the places where objects meet.   | `'beforeToneMapping'` |
| [`TiltShiftEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.TiltShiftEffect.html)  | Keeps a band of depth sharp and blurs the rest, so the scene looks like a model. | `'beforeToneMapping'` |
| [`MotionBlurEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.MotionBlurEffect.html) | Streaks opaque meshes as the camera moves or turns.                              | `'beforeToneMapping'` |
| [`FxaaEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.FxaaEffect.html)       | Smooths jagged edges.                                                            | `'afterToneMapping'`  |
| [`TintEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.TintEffect.html)       | Multiplies the picture by a colour, as `Container.tint` does in 2D.              | `'afterToneMapping'`  |

### Bloom

By default, [`BloomEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html) works on the scene's light. So at its default [`threshold`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html#threshold), mostly the parts brighter than white glow, such as an emissive glow with a `strength` above 1, as [PBR materials](https://pixijs.com/3d/guides/components/materials/pbr.md#emissive-glow) shows. Lower the threshold to make bright but ordinary surfaces glow too. [Bloom](https://pixijs.com/3d/examples?example=post_bloom) shows which parts glow at the default threshold.

### Ambient occlusion and tilt-shift

Use both with a camera in its default perspective [`mode`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#mode), not an orthographic one, which draws far things as large as near ones.

[`SsaoEffect.radius`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.SsaoEffect.html#radius) is how far around each point the effect looks for surfaces that block light. It's in world units, so set it for the size of your scene. On a phone, create the effect with [`resolution: 1`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.SsaoEffectOptions.html#resolution). That works out the occlusion once per CSS pixel, which is a quarter as many pixels as at the examples' resolution of 2.

[`TiltShiftEffect.focalDepth`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.TiltShiftEffect.html#focaldepth) is a distance straight out from the camera, so set it to about the camera's distance from what should stay sharp. Zooming an [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) changes that distance. When the subject is at the orbit's [`target`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html#target), keep it sharp with `orbit.on('change', () => (tiltShift.focalDepth = orbit.distance))`. [`debug`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.TiltShiftEffect.html#debug) paints the sharp band and the blurred zones instead of blurring, which helps you place them.

### Motion blur

[`MotionBlurEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.MotionBlurEffect.html) blurs only by the camera's motion. Turning or moving the camera streaks opaque meshes, but not the view's background. A car driving past a still camera stays sharp. On a camera cut, such as a respawn, call the camera's [`resetHistory`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html#resethistory) so the jump doesn't smear the first frame of the new shot.

[Motion blur](https://pixijs.com/3d/examples?example=post_motion-blur) circles the camera round a ring of clay posts. The posts near its path streak, the logo at the centre of the orbit stays nearly sharp, and a top spinning beside the logo never smears.

### FXAA

[`FxaaEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.FxaaEffect.html) smooths the edges it finds in the finished picture. It can't join up a line thinner than a pixel, since the picture has already broken that line into dashes. In [Anti-aliasing](https://pixijs.com/3d/examples?example=post_antialiasing), turn the canvas's `antialias` off and FXAA on to see the smoothed edges and the dashed lines in the example's loupe.

## Mesh passes

A [`MeshPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.MeshPass.html) goes in the same `passes` list. Instead of working on the finished picture, it draws the meshes that join it a second time. An [`OutlinePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.OutlinePass.html), for example, draws them again as ink outlines. A mesh joins a pass by the pass's name. The usual way is through its material's `passes` option or [`enablePass`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#enablepass), which join every [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) that shares the material. One mesh can also join through [`its own enablePass`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#enablepass). A [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slot ignores its material's passes.

```ts
import { Material3D } from '@pixi/3d';
import { OutlinePass } from '@pixi/3d/extras';

view3d.passes = [...view3d.passes, new OutlinePass({ width: 0.04 })];

const toy = new Material3D({ baseColor: 0xe94f37, passes: { outline: true } }); // every Mesh3D with this material

crate.enablePass('outline'); // this mesh only
```

[Passes per mesh](https://pixijs.com/3d/examples?example=post_passes-per-mesh) outlines one of several meshes that share a material. It also takes a mesh out of the `'opaque'` pass so only its shadow draws. [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md#outlines) covers outlines, and [Debugging](https://pixijs.com/3d/guides/components/debugging.md#wireframes) covers [`WireframePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.WireframePass.html), which draws meshes again as lines. A `MeshPass` with a `camera` can draw the scene from a second camera, for a security monitor or a minimap, as [Second cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras/second-cameras.md#a-camera-that-draws-into-a-texture) shows.

## Writing an effect

A post effect runs a function, `effect(uv)`, once for every pixel of the picture. Subclass [`PostEffect`](https://3d.pixijs.download/v0.1.0/docs/filters.PostEffect.html) and give it that function as its `fragment`, in WGSL for WebGPU and GLSL for WebGL2. The `uv` argument runs from 0 to 1 across the view, and `sampleColor(uv)` reads the picture so far. This vignette darkens the picture toward its edges:

```ts
import { PostEffect } from '@pixi/3d';
import type { EffectFragment, PostEffectOptions } from '@pixi/3d';
import { UniformGroup } from 'pixi.js';

const vignetteFragment: EffectFragment = {
  gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let color = sampleColor(uv);
  let edge = smoothstep(0.3, 0.8, distance(uv, vec2<f32>(0.5)));
  return vec4<f32>(color.rgb * (1.0 - edge * fx.uStrength), color.a);
}
`,
  gl: /* glsl */ `
vec4 effect(vec2 uv) {
  vec4 color = sampleColor(uv);
  float edge = smoothstep(0.3, 0.8, distance(uv, vec2(0.5)));
  return vec4(color.rgb * (1.0 - edge * uStrength), color.a);
}
`,
};

class MyVignetteEffect extends PostEffect {
  protected override readonly uniforms = new UniformGroup({ uStrength: { value: 0.6, type: 'f32' } });
  protected readonly fragment = vignetteFragment;

  constructor(options: PostEffectOptions = {}) {
    super({ stage: 'afterToneMapping', ...options });
  }

  public get strength(): number {
    return this.uniforms.uniforms.uStrength as number;
  }

  public set strength(value: number) {
    this.uniforms.uniforms.uStrength = value;
  }
}

view3d.passes = [new MyVignetteEffect()];
```

- The `uniforms` are the effect's settings. The shader reads them as `fx.<name>` in WGSL and as plain `<name>` in GLSL. PixiJS uploads their values every frame, so a setter only has to write the value.
- An effect runs at `'beforeToneMapping'` unless its constructor passes another stage to `super`. The vignette darkens the picture as the screen shows it, so it passes `'afterToneMapping'`. It spreads `options` after the stage, so one instance can still pick its own stage.
- The fragment can also call helpers. `sampleDepth(uv)` and `viewPos(uv)` read the scene's depth, and `texel()` gives the size of one pixel in `uv` units. [`EffectFragment`](https://3d.pixijs.download/v0.1.0/docs/filters.EffectFragment.html) lists them all.
- Which way `uv.y` runs on screen differs between WebGL and WebGPU, so don't make an effect depend on it.

An effect that needs more than one drawing step, as bloom does, overrides [`build`](https://3d.pixijs.download/v0.1.0/docs/filters.PostEffect.html#build) instead. [Custom render passes](https://pixijs.com/3d/guides/components/post-processing/custom-passes.md#effects-in-several-steps) shows how, and [Custom effect](https://pixijs.com/3d/examples?example=post_custom-effect) runs one beside a vignette.

## Next steps

- [Custom render passes](https://pixijs.com/3d/guides/components/post-processing/custom-passes.md): effects in several steps, and mesh passes with a shader of your own.
- [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame): where each stage runs in a frame.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md#checklist-for-phones): keeping post effects few on phones.
