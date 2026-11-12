# Compressed models

Three kinds of glTF extension make a model's meshes smaller. Meshopt and Draco compress the file, and [`the loader`](https://3d.pixijs.download/v0.1.0/docs/assets.loadGltf.html) decodes it as it loads. Mesh quantization stores vertex data as small integers, which the GPU reads as they are. PixiJS 3D reads all three, so a compressed file loads with the same `Assets.load` call as any other:

```ts
const source = await Assets.load<Scene3DSource>('fox-meshopt.glb');
```

| Extension                                            | What it makes smaller       | Decoder                                            |
| ---------------------------------------------------- | --------------------------- | -------------------------------------------------- |
| `EXT_meshopt_compression`, `KHR_meshopt_compression` | The download                | Comes with `@pixi/3d`                              |
| `KHR_draco_mesh_compression`                         | The download                | Fetched from Google the first time a file needs it |
| `KHR_mesh_quantization`                              | The download and GPU memory | None                                               |

Quantization works with either of the others. None of the three compresses textures, so a file that's mostly images shrinks little. For files you compress yourself, [gltfpack](#compressing-your-own-models) applies meshopt and quantization in one command, and can compress textures too.

[Compression](https://pixijs.com/3d/examples?example=assets_compression) loads a different sample model compressed each of these ways.

## meshopt

The loader imports meshopt's decoder the first time a file needs it, so there's nothing to set up. Meshopt compresses a file's animation clips as well as its meshes.

## Draco

In [Compression](https://pixijs.com/3d/examples?example=assets_compression), the walking Cesium Man and the sunglasses are Draco files. The loader fetches the Draco decoder from Google's servers. To host the decoder yourself, for example in an app that works offline, copy the two files at the URLs in [`dracoDecoderUrls`](https://3d.pixijs.download/v0.1.0/docs/assets.dracoDecoderUrls.html) to your server. Then pass their new URLs to [`setDracoDecoderPath`](https://3d.pixijs.download/v0.1.0/docs/assets.setDracoDecoderPath.html) before the first Draco file loads, since the loader reads the URLs when it first decodes a Draco mesh:

```ts
import { setDracoDecoderPath } from '@pixi/3d';

setDracoDecoderPath({
  jsUrl: '/draco/draco_wasm_wrapper.js',
  wasmUrl: '/draco/draco_decoder.wasm',
});
```

Draco meshes load without their [morph targets](https://pixijs.com/3d/guides/components/animation.md#morph-targets), the extra shapes a mesh can blend toward. For a model that has them, run gltfpack on the uncompressed original with [the morph target flags](#compressing-your-own-models), since gltfpack can't read a Draco file.

## Mesh quantization

`KHR_mesh_quantization` stores vertex data, such as positions, normals and texture coordinates, as 8- or 16-bit integers rather than 32-bit floats.

The default hit test checks a mesh's bounding box, and it works on a quantized mesh too. A [per-triangle hit test](https://pixijs.com/3d/guides/components/interaction.md#hit-volumes) finds the triangle under the pointer, but it never hits a mesh with integer positions ([`HitVolume3DInput`](https://3d.pixijs.download/v0.1.0/docs/events.HitVolume3DInput.html)). A hit's [`uv`](https://3d.pixijs.download/v0.1.0/docs/events.RaycastHit3D.html#uv) is a texture coordinate only on a mesh whose texture coordinates are floats. gltfpack can keep either as floats, as [Compressing your own models](#compressing-your-own-models) shows.

gltfpack quantizes texture coordinates by default. When it does, it adds a texture transform to each textured material, which maps the quantized coordinates back onto the texture. The loader sets that transform as the material's [`uvTransform`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#uvtransform), so a textured material you build yourself needs the same transform, or it samples the wrong part of the texture. To [give one model](https://pixijs.com/3d/guides/components/models.md#a-source-and-its-models) a material of its own, [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone) the file's material, which keeps the transform:

```ts
const blueFox = new Model3D({
  source,
  materials: (material) => material.clone({ baseColor: 0x99aaff }), // tints this fox alone
});
```

## Compressing your own models

[gltfpack](https://meshoptimizer.org/gltf/), from the meshoptimizer project, compresses a glTF or GLB file with meshopt and quantizes it in one command:

```bash
npx gltfpack -i model.glb -o model-packed.glb -cc
```

`-c` compresses with meshopt, and `-cc` compresses further. Quantization is on by default, and `-noq` turns it off. gltfpack also rearranges the file so it draws faster, and that changes what your code finds in it:

- It merges meshes and materials, and drops the nodes it doesn't need. A node is the 3D counterpart of a 2D container. These changes can remove a name your code looks up with [`getChildByLabel`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html#getchildbylabel) or [`source.material`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html#material). `-kn` keeps named nodes, and `-km` keeps named materials. gltfpack drops every mesh and texture name whatever the flags, so [`source.geometry`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html#geometry) and [`source.texture`](https://3d.pixijs.download/v0.1.0/docs/assets.Scene3DSource.html#texture) come back empty. Reach a mesh through its node and a texture through its material instead.
- With integer positions, it can move a mesh to an unnamed child of the node `-kn` keeps, so `getChildByLabel` returns a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) rather than the [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html). `-vpf` keeps positions as floats and each mesh on its named node. Per-triangle hit tests need `-vpf` too.
- `-vtf` keeps texture coordinates as floats, for a hit's `uv`.
- The loader skips morph target data stored as integers, so add `-vpf -vnf` for a model that has morph targets.

If your code looks up parts of a model by name or hit-tests it per triangle, compress it with a command like this one:

```bash
npx gltfpack -i car.glb -o car-packed.glb -cc -kn -km -vpf
```

`-tc` turns textures into KTX2, a format the GPU can keep compressed. The npm build of gltfpack can't write KTX2, so download a native build from its [releases page](https://github.com/zeux/meshoptimizer/releases). Those textures have no PNG or JPEG to fall back on, so the app needs [PixiJS's KTX2 loader](https://pixijs.com/3d/guides/components/models.md#extensions). That loader fetches the code that converts KTX2 for the GPU from jsDelivr, unless PixiJS's `setKTXTranscoderPath` points it elsewhere.

## Next steps

- [Loading models](https://pixijs.com/3d/guides/components/models.md): sources, models and what a file can bring.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md#checklist-for-phones): what else keeps a scene fast on phones.
