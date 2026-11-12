# Custom render passes

A view draws each frame as a list of passes called its render graph. Each pass draws one part of the picture, such as the shadows, the opaque meshes or one step of an effect. Each item in [`view3d.passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes) is a [`Pass3D`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html). When the view builds its graph, each enabled item adds its own passes at its [`stage`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#stage), the point in the frame where they run. [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md) covers the built-in items and effects made of one shader.

## Drawing meshes again

A [`MeshPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.MeshPass.html) draws every mesh that joins it a second time, with a shader of its own. Meshes join it by its name, as [Mesh passes](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes) shows. [`OutlinePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.OutlinePass.html) is a mesh pass named `'outline'`. It draws each mesh again in one flat colour, as a shell pushed out along its normals, the directions its surface faces.

`OutlinePass` draws black ink outlines on the meshes that join `'outline'`. A white rim around the mesh under the pointer takes a second pass. A second `OutlinePass` makes the view throw, since it's also named `'outline'`. Give a `MeshPass` a name of its own instead:

```ts
import { MeshPass, stateFor3D } from '@pixi/3d';
import { OutlinePass, solidMeshDescriptor } from '@pixi/3d/extras';

// Culls the front faces instead of the back, as OutlinePass does, so the mesh hides all of the shell but a rim
const shell = stateFor3D();

shell.clockwiseFrontFace = true;

view3d.passes = [
  new OutlinePass(),
  new MeshPass({
    name: 'highlight',
    descriptor: { shaderDescriptor: solidMeshDescriptor({ color: 0xffffff, extrude: 0.06 }), state: shell },
  }),
];

mesh.eventMode = 'static';
mesh.onpointerenter = () => mesh.enablePass('highlight');
mesh.onpointerleave = () => mesh.disablePass('highlight');
```

- **A name of your own needs a shader.** It comes from the pass's `descriptor`, or from a material's entry for that name in its [`passes`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#passes) option. [`solidMeshDescriptor`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.solidMeshDescriptor.html) draws in one flat colour, which you set when you create it and can't change later. The first hover can stall while the pass's shader compiles, as [When shaders compile](https://pixijs.com/3d/guides/concepts/rendering.md#when-shaders-compile) describes.
- **Give the pass a `state` too.** Without one, the pass uses the material's state. A pushed-out shell then covers the whole mesh, and a second draw of an opaque mesh with no `extrude` lands exactly on the first. The depth test keeps only what's nearer than what's already there, so it rejects that draw. Cull the front faces of a shell, as above. For a draw with no `extrude`, turn `depthTest` off so it draws over what's already there.
- **Names are limited.** All views on the page share a limited number of name slots, and a name past the last slot joins nothing. Use a few fixed names rather than one per object. [`RenderPassBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderPassBit.html) has the details.

## Effects in several steps

[Writing an effect](https://pixijs.com/3d/guides/components/post-processing.md#writing-an-effect) shows an effect made of one function. An effect that needs several steps overrides [`build`](https://3d.pixijs.download/v0.1.0/docs/filters.PostEffect.html#build) and adds a [`FullscreenPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.FullscreenPass.html) for each step. A `FullscreenPass` draws an `effect(uv)` function once over the whole picture. It samples the textures in its `reads` and draws into its `writes`.

A blur costs less in two steps, across and then down. That's five samples per pixel in each step, ten in all, rather than twenty-five in a single step:

```ts
import { FullscreenPass, PostEffect } from '@pixi/3d';
import type { EffectFragment, EffectIO, RenderGraph } from '@pixi/3d';

// Averages five pixels in a line, `d` apart
function blurFragment(gpuStep: string, glStep: string): EffectFragment {
  const sum =
    'sampleColor(uv - 2.0 * d) + sampleColor(uv - d) + sampleColor(uv) + sampleColor(uv + d) + sampleColor(uv + 2.0 * d)';

  return {
    gpu: `fn effect(uv: vec2<f32>) -> vec4<f32> { let d = ${gpuStep}; return (${sum}) / 5.0; }`,
    gl: `vec4 effect(vec2 uv) { vec2 d = ${glStep}; return (${sum}) / 5.0; }`,
  };
}

const blurAcross = blurFragment('vec2<f32>(inputTexel().x, 0.0)', 'vec2(inputTexel().x, 0.0)');
const blurDown = blurFragment('vec2<f32>(0.0, inputTexel().y)', 'vec2(0.0, inputTexel().y)');

class MyBlurEffect extends PostEffect {
  public override build(graph: RenderGraph, io: EffectIO): void {
    const across = graph.createColor();

    graph.addPass(
      new FullscreenPass({ renderer: io.renderer, fragment: blurAcross, reads: { color: io.input }, writes: across }),
    );
    graph.addPass(
      new FullscreenPass({ renderer: io.renderer, fragment: blurDown, reads: { color: across }, writes: io.output }),
    );
  }
}

view3d.passes = [new MyBlurEffect()];
```

- `io.input` is the picture so far, and the last step draws into [`io.output`](https://3d.pixijs.download/v0.1.0/docs/filters.EffectIO.html#output).
- [`graph.createColor()`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html#createcolor) makes a texture the size of the scene for the steps in between. It lasts one frame, so it doesn't hold last frame's result.
- `inputTexel()` is the size of one pixel of the step's input in `uv` units. [`EffectFragment`](https://3d.pixijs.download/v0.1.0/docs/filters.EffectFragment.html) lists the other helpers.

## Scene outputs and textures you keep

An effect can also read a [`scene output`](https://3d.pixijs.download/v0.1.0/docs/rendering.SceneOutput.html), an extra texture that the scene draw writes beside its colour. [`normalOutput`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.normalOutput.html), for example, holds each surface's normal. An item that lists an output in its [`requiredOutputs`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#requiredoutputs) makes the scene write it, and reads it in `build` with [`RenderGraph.getSceneOutput`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html#getsceneoutput). Some formats cost the scene its antialiasing, including `normalOutput`'s format on WebGL, as [The passes list](https://pixijs.com/3d/guides/components/post-processing.md#the-passes-list) says.

Like a texture from `createColor`, an output lasts only for the frame. [`ExtractPass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.ExtractPass.html) copies one into a texture you keep, which a sprite can show:

```ts
import { ExtractPass, normalOutput } from '@pixi/3d/extras';
import { Sprite } from 'pixi.js';

const normals = new ExtractPass({ output: normalOutput });

view3d.passes = [normals];
app.stage.addChild(new Sprite(normals.texture));
```

[Scene outputs](https://pixijs.com/3d/examples?example=post_scene-outputs) defines two outputs of its own, each surface's base colour and its distance from the camera. It shows them beside `normalOutput` in three cards. Its see-through sphere is blended, so it doesn't show in any of them.

To keep a result of your own past the frame, write it into a texture you own. Add that texture to the graph with [`graph.importColor`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html#importcolor), which takes a function that returns it, such as `() => myTexture`. The graph never clears it. A `FullscreenPass` can't sample an imported texture yet, and trying throws. Show or read it outside the graph instead, the way a sprite shows `ExtractPass`'s texture.

## How a graph runs passes

To add passes other than a `MeshPass` or a `PostEffect`, subclass [`Pass3D`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html) and add them in its [`build`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#build) at one of the three [`scene stages`](https://3d.pixijs.download/v0.1.0/docs/rendering.SceneStage.html), as [A sky in the feed](https://pixijs.com/3d/guides/components/scene-objects/cameras/second-cameras.md#drawing-the-background) does. [`graph.addPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html#addpass) takes either a pass, such as a `FullscreenPass`, or a plain object with a `name`, a `setup` and a `render`. These rules hold for both:

- **A pass runs only when something needs what it writes.** Its `setup` runs once, when you add it, and uses the [`PassBuilder`](https://3d.pixijs.download/v0.1.0/docs/rendering.PassBuilder.html) to declare which textures it reads and writes. Each frame, the graph runs the pass only when a later pass that runs reads what it writes, or when the pass writes the view's own target, a texture you imported or a camera's render texture. The view's own target is usually the screen. A pass that declares nothing never runs. A pass that only reads, such as a readback to the CPU, calls [`b.sideEffect()`](https://3d.pixijs.download/v0.1.0/docs/rendering.PassBuilder.html#sideeffect) in `setup` so it runs anyway.
- **Passes run in the order you add them.** What they declare doesn't reorder them, so a pass that reads a texture sees only what earlier passes wrote.
- **A pass's [`condition`](https://3d.pixijs.download/v0.1.0/docs/rendering.GraphRenderPass.html#condition) can skip it each frame.** The graph calls `prepare` and then `render` on each pass that runs. [`GraphRenderPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.GraphRenderPass.html) says when each of these methods runs, and [`RenderGraph.getTexture`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html#gettexture) covers a pass that binds a texture itself.
- **A pass that draws no meshes takes `bit:` [`RenderPassBit.NONE`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderPassBit.html#none).** Any number of passes with that bit can share a view.
- **Make handles in `build` or `setup`, never in a constructor.** A handle from `createColor` or the `PassBuilder` stands for a texture the graph supplies each frame. It works only in the graph that made it. Each rebuild starts a new graph and calls each enabled item's `build` again. The view rebuilds after changes such as assigning `view3d.passes` or flipping a pass's [`enabled`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#enabled).
- **The graph destroys the passes that `build` added.** It does this when the view replaces the graph or the view is destroyed. You destroy the item itself, as [The passes list](https://pixijs.com/3d/guides/components/post-processing.md#the-passes-list) says, so free anything it made outside the graph in an override of [`destroy`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#destroy).

## Custom render graphs

The [`graph`](https://3d.pixijs.download/v0.1.0/docs/scene.View3DOptions.html#graph) option replaces the view's graph with one that your function builds. The view calls that function on the first render and again on each rebuild. To add passes that no stage can place, start from [`createDefaultGraph3D`](https://3d.pixijs.download/v0.1.0/docs/rendering.createDefaultGraph3D.html) and add your passes to its graph. To draw something else entirely, build a bare [`RenderGraph`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderGraph.html), which runs only the passes you add.

The graph below draws the opaque meshes in white into a texture. That makes a silhouette mask with no shadows, sky or lighting, and a sprite shows it:

```ts
import { Camera3D, ForwardRenderPass, RenderGraph, View3D } from '@pixi/3d';
import { solidMeshDescriptor } from '@pixi/3d/extras';
import { RenderTexture, Sprite } from 'pixi.js';

const mask = RenderTexture.create({ width: 384, height: 384 });
const maskCamera = new Camera3D({ renderTexture: mask });

maskCamera.position.set(0, 1.5, 7);
maskCamera.lookAt({ x: 0, y: 0.3, z: 0 });

const view3d = new View3D({
  width: 384,
  height: 384,
  graph: (renderer, options) => {
    const graph = new RenderGraph({
      globalTextureBindings: options.globalTextureBindings,
      defaultColor: (session) => session.defaultTarget.colorTexture,
      defaultDepth: (session) => session.defaultTarget.depthStencilTexture!,
    });

    graph.addPass(
      new ForwardRenderPass({
        renderer,
        name: 'opaque',
        sort: 'key',
        camera: maskCamera,
        descriptor: { shaderDescriptor: solidMeshDescriptor({ color: 0xffffff }) },
      }),
    );

    return graph;
  },
});

view3d.root.addChild(maskCamera);
app.stage.addChild(view3d, new Sprite(mask));
```

- The [`ForwardRenderPass`](https://3d.pixijs.download/v0.1.0/docs/rendering.ForwardRenderPass.html) is named `'opaque'`, so it draws the meshes whose materials put them in the opaque pass. It uses the shader in its `descriptor` rather than the materials' own shaders.
- It draws from the mask's camera, so place and move that camera. No pass here draws from `view3d.camera`, so moving it changes nothing. The mask's camera has a render texture, so the view puts nothing on screen and the sprite shows the texture instead.
- Give a pass's `descriptor` a whole [`shader descriptor`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderDescriptorOptions.html), such as the one [`solidMeshDescriptor`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.solidMeshDescriptor.html) returns, because a pass has no default [`template`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBitTemplate.html). A template is the shader source that shader bits fill in, and shader bits are small pieces of shader code. [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md#adding-your-own-shader-code) covers writing shader bits.

## Next steps

- [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md): the built-in effects and mesh passes.
- [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame): where each stage runs in a frame.
- [Debugging](https://pixijs.com/3d/guides/components/debugging.md#recording-frames): record frames to see the passes the view built, which ones it skipped, and what each read and wrote.
