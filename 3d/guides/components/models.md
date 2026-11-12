# Loading models

PixiJS 3D loads glTF 2.0, an open file format for 3D models. A model comes either as a `.gltf` file, which is JSON that can point to buffer and image files beside it, or as one binary `.glb` file. Importing `@pixi/3d` registers loaders for both with PixiJS's `Assets`, so a model loads like any other asset:

```ts
import { Model3D } from '@pixi/3d';
import type { Scene3DSource } from '@pixi/3d';
import { Assets } from 'pixi.js';

const source = await Assets.load<Scene3DSource>('car.glb');
const car = new Model3D(source);

view3d.root.addChild(car);
```

Drop a `.glb` file of your own on [Model viewer](https://pixijs.com/3d/examples?example=start_model-viewer) to see it load.

## A source and its models

`Assets.load` returns a [`Scene3DSource`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html), which holds the file's geometry, materials, textures and animation clips. A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) uses the source to build the file's scene as nodes under itself. Nodes are the 3D counterpart of 2D containers. The model, not the source, is what you add to your scene.

Each model builds its own nodes and shares the source's geometry, materials and textures, the way 2D sprites share a texture. A second model loads nothing, so several copies of a prop cost one load:

```ts
const crate = await Assets.load<Scene3DSource>('crate.glb');

for (const x of [-2, 0, 2]) {
  const model = new Model3D(crate);

  model.position.x = x;
  view3d.root.addChild(model);
}
```

For thousands of copies, [Choosing a node for many objects](https://pixijs.com/3d/guides/components/scene-objects.md#choosing-a-node-for-many-objects) compares the other ways to draw them.

Because models share materials, changing one changes every model that draws it. Every model built from the source draws the source's materials until you give it materials of its own. [`source.material`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html#material) holds the file's named materials, keyed by name:

```ts
source.material['Paint'].baseColor = 0x3366ff; // tints the paint on every car that draws the source's Paint
```

To change one model alone, give it materials of its own with [`materials`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3DOptions.html#materials). [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone) copies a material with everything the file gave it, textures included, then sets the options you pass:

```ts
const redCar = new Model3D({
  source,
  materials: { Paint: source.material['Paint'].clone({ baseColor: 0xd81b3c }) },
});
```

A record replaces materials by name, as here. An array replaces them by index into [`source.materials`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html#materials), and a function runs once for each of them. Assigning [`model.materials`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#materials) switches the materials of a model that's already built, and assigning `undefined` gives it the source's materials back. Neither the option nor the assignment destroys the materials it replaces, so destroy your copies when you're done with them. [Materials per model](https://pixijs.com/3d/examples?example=assets_model-materials) dissolves one of three helmets this way.

[`Model3DOptions`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3DOptions.html) set up a model as it's built. Pass them in place of the source, with the source as `source`. `castShadow` and `receiveShadow` apply to every mesh in it, and [`autoPlay`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3DOptions.html#autoplay) starts a clip:

```ts
const water = new Model3D({ source: waterSource, castShadow: false, receiveShadow: false });
const fox = new Model3D({ source: foxSource, autoPlay: 'Walk' });
```

A model keeps the size its file was built at. glTF works in metres, but some files ignore that. The fox in [Quick start](https://pixijs.com/3d/guides/getting-started/quick-start.md#load-a-model) is about 80 units tall. [Measuring and sizing](https://pixijs.com/3d/guides/concepts/scene-graph.md#measuring-and-sizing) shows how to scale a model to the size you want.

## File contents

**Meshes and materials.** A glTF mesh is made of one or more parts, each with its own material. A mesh with one part becomes a [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html), and a mesh with several becomes a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) holding one `Mesh3D` per part. Materials load as [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html). A material the file marks unlit loads as a [`FlatMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.FlatMaterial.html), which ignores lights.

**Names.** Each node takes its name in the file as its [`label`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#label), or `node_<index>` when it has none. A mesh's own name in the file labels nothing. The parts of a mesh with several parts get no name from the file either. To find them, look up the container that holds them by the name of the node the mesh sits on. [Parents and children](https://pixijs.com/3d/guides/concepts/scene-graph.md#parents-and-children) shows how `getChildByLabel` finds a node by label, and why it can miss the bones a character's mesh bends with. To see what a file holds, [`logHierarchy`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#loghierarchy) prints the tree to the console:

```ts
car.logHierarchy();
// For Khronos's ToyCar sample, it prints:
// Model3D "Model3D"
//   Mesh3D "ToyCar"
//   Mesh3D "Fabric"
//   Mesh3D "Glass"
//   Camera3D "Camera001"
//   ...
```

**Cameras.** The file's cameras become [`Camera3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Camera3D.html) nodes where the file placed them, listed in [`model.cameras`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#cameras). [Switching cameras](https://pixijs.com/3d/guides/components/scene-objects/cameras.md#switching-cameras) shows how to draw from one.

**Lights.** The file's lights become [`DirectionalLight`](https://3d.pixijs.download/v0.1.0/docs/scene.DirectionalLight.html), [`PointLight`](https://3d.pixijs.download/v0.1.0/docs/scene.PointLight.html) and [`SpotLight`](https://3d.pixijs.download/v0.1.0/docs/scene.SpotLight.html) nodes. Like lights you make, they cast no shadows until you turn on a directional or spot light's [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#castshadow). Point lights cast none.

**Animation.** When the file has animation clips, the model's [`player`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#player) plays them. The player is `undefined` when the file has none. [Animation](https://pixijs.com/3d/guides/components/animation.md) covers playing them.

## Showing one model on its own

[`View3D.from`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#from) builds a view around a source. The view's root is a [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) built from the source, so `view3d.root` is the model:

```ts
import { View3D } from '@pixi/3d';

const view3d = View3D.from(source, { autoResize: true, environment: sky });

app.stage.addChild(view3d);
view3d.root.player?.play('Walk');
```

The view comes ready to draw the model:

- Its camera is the `camera` you pass, or else the file's first camera. A file with none gets a new camera on the model's +Z side, facing it, just far enough back to fit the whole model in view.
- When the file brings no lights, the view adds a [`DirectionalLight`](https://3d.pixijs.download/v0.1.0/docs/scene.DirectionalLight.html) as a child of the camera, so it lights whatever the camera faces. Pass `light: false` to light the scene yourself.

[`View3DFromOptions`](https://3d.pixijs.download/v0.1.0/docs/scene.View3DFromOptions.html) takes the view's options and the model's, such as `castShadow` and `autoPlay`, in one object.

To let people turn the model, aim an [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) at its centre, as [Orbit camera](https://pixijs.com/3d/guides/components/scene-objects/cameras/controls.md#orbit-camera) shows.

## Extensions

glTF extensions add features to the format. PixiJS 3D reads these:

| Extension                                                                                                                                                | What it brings                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `KHR_materials_clearcoat`, `KHR_materials_sheen`, `KHR_materials_specular`, `KHR_materials_iridescence`, `KHR_materials_anisotropy`, `KHR_materials_ior` | Material features; see [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md)                 |
| `KHR_materials_transmission`, `KHR_materials_volume`                                                                                                     | Glass; see [Transmission and volume](https://pixijs.com/3d/guides/components/materials/physical.md#transmission-and-volume) |
| `KHR_materials_emissive_strength`                                                                                                                        | A stronger glow; see [Glow](https://pixijs.com/3d/guides/components/materials/pbr.md#emissive-glow)                         |
| `KHR_materials_unlit`                                                                                                                                    | Materials that ignore lights, as [`FlatMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.FlatMaterial.html)                                              |
| `KHR_texture_transform`                                                                                                                                  | Tiled and offset textures, one transform per material                                              |
| `KHR_texture_basisu`, `EXT_texture_avif`, `EXT_texture_webp`                                                                                             | KTX2, AVIF and WebP textures                                                                       |
| `KHR_lights_punctual`                                                                                                                                    | Directional, point and spot lights                                                                 |
| `KHR_node_visibility`                                                                                                                                    | Nodes the file hides start hidden                                                                  |
| `KHR_draco_mesh_compression`, `EXT_meshopt_compression`, `KHR_meshopt_compression`, `KHR_mesh_quantization`                                              | Compressed geometry; see [Compressed models](https://pixijs.com/3d/guides/components/models/compression.md)                                     |

KTX2 textures, which the GPU can keep compressed, need PixiJS's KTX2 loader. Import it once, before you load the model:

```ts
import 'pixi.js/ktx2';
```

Without it, the [`loader`](https://3d.pixijs.download/v0.1.0/docs/assets.loadGltf.html) uses a texture's other image if it has one. A texture with only a KTX2 image fails the load, and the error names the import.

PixiJS 3D supports no other extension. You may meet these three:

- `EXT_mesh_gpu_instancing` repeats a mesh. Only the original draws, at its node.
- `KHR_materials_pbrSpecularGlossiness` is an older material model. The loader ignores it, so you lose any colours and textures kept in it.
- `KHR_animation_pointer` lets clips animate materials, lights and cameras. A file that uses it doesn't load yet, so leave it out when you export.

## Cleaning up

[`Destroying a model`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#destroy) stops its clips and takes it out of the scene, but leaves the source, which other models may share. Don't pass it flags that destroy geometry, materials or textures. [Destroying](https://pixijs.com/3d/guides/concepts/resources.md#destroying) explains why.

To free a file, destroy every model built from it, then unload the file through `Assets`, as you would a 2D texture. Unloading destroys the source's geometry, materials and textures:

```ts
car.destroy({ children: true });
await Assets.unload('car.glb');
```

For a view from `View3D.from`, [`destroy the view`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#destroy) with `children: true`, which destroys its model too. A material you gave a model is yours. Unloading the file leaves it, so destroy it once no model uses it.

A file can keep its images beside it rather than inside it. Those images load through `Assets` by URL, so unloading the file destroys them for anything else that loaded the same image, such as the other models in a kit that share one texture atlas. Unload a kit's files together, once none of its models is drawn.

To free GPU memory for a while but keep the model, take it out of the scene and call [`unload`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#unload). Adding it back uploads it again. The call unloads the source's geometry and materials, which every model built from that source shares, so take all of those models out of the scene before the next frame. [Unloading](https://pixijs.com/3d/guides/concepts/resources.md#unloading) says how much of that memory comes back.

```ts
view3d.root.removeChild(car);
car.unload();
```

## Next steps

- [Compressed models](https://pixijs.com/3d/guides/components/models/compression.md): smaller downloads with meshopt and Draco.
- [Animation](https://pixijs.com/3d/guides/components/animation.md): playing and blending the clips a model brings.
- [Environment and IBL](https://pixijs.com/3d/guides/components/environment.md): lighting a model from a picture of its surroundings.
