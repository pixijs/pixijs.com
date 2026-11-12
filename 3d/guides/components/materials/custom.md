# Toon and custom materials

`@pixi/3d/extras` has the two parts of a cartoon look. [`ToonMaterial`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterial.html) shades a mesh in flat bands of light, and [`OutlinePass`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.OutlinePass.html) draws ink lines around it. When no material gives you the look you want, you can add your own shader code to a material, or build a material from shader code.

## Toon shading

You give a mesh a toon material like any other material. The view draws the outline, so add an `OutlinePass` to [`view3d.passes`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#passes). Every toon mesh joins that pass by default:

```ts
import { OutlinePass, ToonMaterial } from '@pixi/3d/extras';

const view3d = new View3D({ autoResize: true, passes: [new OutlinePass({ width: 0.04, color: 0x241a33 })] });

const toon = new ToonMaterial({ baseColor: 0x38bdf8 });
const ball = new Mesh3D({
  geometry: new SphereGeometry({ radius: 0.55, widthSegments: 48, heightSegments: 32 }),
  material: toon,
});
const sun = new DirectionalLight({ intensity: 1.3 });

sun.position.set(3, 6, 4);
view3d.root.addChild(ball, sun, new AmbientLight({ color: 0xd9ccff, intensity: 1.4 }));
sun.lookAt({ x: 0, y: 0, z: 0 });
```

[Toon shading](https://pixijs.com/3d/examples?example=materials_toon) shows a toon sphere under a directional and an ambient light, beside a torus left out of the outline.

A toon mesh uses direct lights and their shadows, and an [`AmbientLight`](https://3d.pixijs.download/v0.1.0/docs/scene.AmbientLight.html) fills in its unlit side. It ignores the view's [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment), so in a view lit only by an environment it's black except for its rim light.

[`ToonMaterialOptions`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterialOptions.html) sets the number of bands, the size of the highlight, and the strength and width of the rim light. The rim light is a white glow along the edges that turn away from the camera. The material adds it on top of the lighting, whatever lights reach the mesh, so turn `rimIntensity` down in a dark scene. The material has no `bands` property, so change these four settings later through [`material.data`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#data):

```ts
toon.data.bands = 2;
toon.data.rimIntensity = 0;
```

## Outlines

`OutlinePass` draws each mesh that joins it a second time, as a shell pushed out along the mesh's normals, the directions its surface faces. It draws only the inside of the shell. The mesh hides the shell's inside except for a band around its silhouette, and that band is the outline.

A `ToonMaterial` joins the pass unless you create it with [`outline`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterialOptions.html#outline) set to `false`. Any other material joins if you set its [`passes`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#passes) option to `{ outline: true }`, or call [`enablePass('outline')`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#enablepass) on it. To outline one mesh, such as the one under the pointer, without changing a material it shares with other meshes, use [`Mesh3D.enablePass`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#enablepass):

```ts
view3d.passes = [new OutlinePass({ width: 0.06, color: 0x9effd8 })];

const stone = new Material3D({ baseColor: 0xb8a98a, roughness: 0.75 });
const mesh = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.5 }), material: stone });

view3d.root.addChild(mesh);
mesh.eventMode = 'static';
mesh.onpointerenter = () => mesh.enablePass('outline');
mesh.onpointerleave = () => mesh.disablePass('outline');
```

The first hover can stall a frame while the outline's shader compiles, as [When shaders compile](https://pixijs.com/3d/guides/concepts/rendering.md#when-shaders-compile) explains.

- [`width`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.OutlinePassOptions.html#width) is in each mesh's own units, so a model scaled down to fit gets a thinner outline.
- A shape with hard edges, such as a cube, has separate normals on each side of an edge, so its outline has gaps there.
- Keep a mesh whose geometry has no normals, such as the fox from the [Quick start](https://pixijs.com/3d/guides/getting-started/quick-start.md#load-a-model), out of the pass. If it joins, rendering throws and the app stops drawing.
- You set the pass's width and colour when you create it, and can't change them later. To give one material its own width and colour, pass a [`solidMeshDescriptor`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.solidMeshDescriptor.html) when you create the material: `passes: { outline: { shaderDescriptor: solidMeshDescriptor({ color: 0x241a33, extrude: 0.1 }) } }`.
- Setting the pass's [`enabled`](https://3d.pixijs.download/v0.1.0/docs/rendering.Pass3D.html#enabled) to `false` hides every outline.

## Adding your own shader code

A material builds its shader from small pieces of shader code called shader bits. A [`ShaderBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBit.html) is a plain object. It holds the values and textures the bit needs and the code it adds, written once in WGSL for WebGPU under `gpu` and once in GLSL for WebGL2 under `gl`. Write both, because [a bit that leaves one out](https://pixijs.com/3d/guides/concepts/webgl-and-webgpu.md#renderer-differences) runs none of its code on that renderer. The [`extraBits`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#extrabits) option adds your own bits to a material when you create it.

This bit paints a surface in bands of two colours by height, and the bands slide along over time:

```ts
import { Material3D, srgbToLinear } from '@pixi/3d';
import type { ShaderBit } from '@pixi/3d';
import { Color } from 'pixi.js';

const contourBit: ShaderBit = {
  name: 'myContour',
  bindings: {
    material: { lowColor: 'vec3<f32>', highColor: 'vec3<f32>', frequency: 'f32' },
  },
  gpu: {
    fragment: {
      material: /* wgsl */ `
  {
    let wave = sin(input.vPosition.y * material.frequency - global.uTime * 2.0);
    albedo *= mix(material.lowColor, material.highColor, step(0.0, wave));
  }
`,
    },
  },
  gl: {
    fragment: {
      material: /* glsl */ `
  {
    float wave = sin(vPosition.y * material.frequency - uTime * 2.0);
    albedo *= mix(material.lowColor, material.highColor, step(0.0, wave));
  }
`,
    },
  },
};

const ground = new Material3D({ roughness: 0.6, extraBits: [contourBit] });

ground.data.lowColor = new Color(0x2e7d32).toRgbArray().map(srgbToLinear);
ground.data.highColor = [1, 1, 1];
ground.data.frequency = 4;
```

- **[`name`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBit.html#name)** must be unique. Two different bits with the same name throw.
- **`bindings.material`** declares the bit's own values. The shader reads them as `material.<name>`, and you write them through [`material.data`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#data). If you change a vector in place, call [`update()`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#update) afterwards. The shader gets each value exactly as you write it. A lit material works in linear light, so convert a colour you picked with [`srgbToLinear`](https://3d.pixijs.download/v0.1.0/docs/materials.srgbToLinear.html), as [Colour and opacity](https://pixijs.com/3d/guides/components/materials.md#colour-and-opacity) explains.
- **`gpu` and `gl`** hold the code, keyed by stage, then by the slot in the shader it fills. Helper functions and constants go in `gpu.header` and `gl.header`. A helper there can't read `material`, so pass it the values as arguments, as [`ShaderBit.bindings`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBit.html#bindings) says.
- **`requires`** lists bits that hold functions or constants your code uses, such as [`mathConstantsBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.mathConstantsBit.html) for `PI`.

Your code runs inside the same function as the material's own code. A local variable with a name the material already uses, such as `baseColor`, makes the shader fail to compile. Wrap your code in braces, as above, so its variables stay inside that block.

The slots you'll use most:

| Slot                     | Runs                                                                                       | Reads and writes                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `vertex.beforeTransform` | before the mesh's transform                                                                | `position` and `normal`, in the mesh's own space                    |
| `fragment.material`      | before lighting                                                                            | `albedo` (the surface colour), `alpha`, and `normal` in world space |
| `fragment.end`           | after lighting, before fog and tone mapping, the step that turns light into screen colours | `finalColor` and `alpha`                                            |

When [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alphamode) is `'opaque'`, the default, the material sets `alpha` back to 1 after your code runs.

Fragment code can also read the world position and the texture coordinates: `input.vPosition` and `input.vUV` in WGSL, `vPosition` and `vUV` in GLSL. Every material's shader also has `global.uTime`, the seconds since the page loaded, and `camera.uCameraPosition`, the camera's position. In GLSL they're `uTime` and `uCameraPosition`.

Shadows and outlines don't run your vertex code. If a bit moves vertices, their shadow and outline stay where the vertices were.

A bit can also sample its own textures. For each one, [`ShaderBit.textures`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShaderBit.html#textures) names the functions the shader gets, and says how to undo the alpha that PixiJS multiplies into images by default. Set the textures with the [`textures`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#textures) option, or later through [`material.textures`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#textures). After dividing out the alpha, pass a colour image through `decodeColor` to convert it to the colour space the shader works in, as [`BaseMaterial3D.colorSpace`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#colorspace) explains.

The extras include two ready-made bits for `extraBits`. [`glossBit`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.glossBit.html) adds a sharp, wet-plastic reflection of the view's environment to a [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html) or [`PhongMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterial.html), but not to a `ToonMaterial`. [`dissolveBit`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.dissolveBit.html) cuts away any material's surface in a noise pattern as the material's `data.dissolve` goes from 0 to 1. At 0 the surface is whole, and at 1 it's gone. The bit adds a glow along the cut in the colour of `data.dissolveEdgeColor`. By default that colour is black, so the cut has no glow. Shadows and outlines draw with their own shaders, so they stay whole.

You can't change `extraBits` after you create a material. To add a bit to an existing material, such as one that came with a loaded model, [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone) it. Here, assigning [`materials`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html#materials) gives one model, `enemy`, its own copies, as [Loading models](https://pixijs.com/3d/guides/components/models.md#a-source-and-its-models) shows:

```ts
import { dissolveBit } from '@pixi/3d/extras';

enemy.materials = (material) => material.clone({ extraBits: [dissolveBit] });

for (const material of enemy.materials) {
  material.data.dissolve = 0.5;
  material.data.dissolveEdgeColor = [6, 2, 0.4];
}
```

[Materials per model](https://pixijs.com/3d/examples?example=assets_model-materials) dissolves one of three helmets this way.

## Custom lighting

`ToonMaterial` gets its shading from two bits. [`toonMaterialBit`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.toonMaterialBit.html) works out the surface colour, and [`toonLightingBit`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.toonLightingBit.html) lights it. To light a surface your own way, build a [`BaseMaterial3D`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html) from bits too, through its [`descriptor`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#descriptor) option, and make the lighting bit with [`createLightingBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.createLightingBit.html). You write the code for what one light adds, and `createLightingBit` writes the loop over the view's lights and their shadows:

```ts
import { BaseMaterial3D, createLightingBit } from '@pixi/3d';
import type { ShaderBit } from '@pixi/3d';

const myColorBit: ShaderBit = {
  name: 'myColor',
  bindings: { material: { baseColor: 'vec4<f32>' } },
  gpu: { fragment: { material: 'albedo *= material.baseColor.rgb;' } },
  gl: { fragment: { material: 'albedo *= material.baseColor.rgb;' } },
};

const myLambertLightingBit = createLightingBit({
  name: 'myLambertLighting',
  preLighting: { gpu: 'var diffuse = vec3<f32>(0.0);', gl: 'vec3 diffuse = vec3(0.0);' },
  perLight: {
    gpu: 'diffuse += light.color * nDotL * attenuation * shadow;',
    gl: 'diffuse += light.color * nDotL * attenuation * shadow;',
  },
  postLighting: { gpu: 'finalColor = albedo * diffuse;', gl: 'finalColor = albedo * diffuse;' },
});

const clay = new BaseMaterial3D({
  baseColor: 0xc96f4a,
  descriptor: { bitsGpu: [myColorBit, myLambertLightingBit], bitsGl: [myColorBit, myLambertLightingBit] },
});
```

- A `material` field named `baseColor`, declared as `vec4<f32>`, receives the material's [`baseColor`](https://3d.pixijs.download/v0.1.0/docs/materials.MaterialData.html#basecolor).
- `perLight` runs once for each light that reaches the front of the surface. `light.color` already includes the light's intensity, and [`CreateLightingBitOptions`](https://3d.pixijs.download/v0.1.0/docs/rendering.CreateLightingBitOptions.html) lists what else that code can read.
- This bit uses only direct lights and their shadows, so the material draws black under an `AmbientLight` or an environment alone.

## Next steps

- [Materials](https://pixijs.com/3d/guides/components/materials.md#whats-fixed-when-you-create-a-material): the options fixed when you create a material, `extraBits` among them.
- [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes): the other mesh passes, and how a material joins them.
- [Custom render passes](https://pixijs.com/3d/guides/components/post-processing/custom-passes.md#drawing-meshes-again): a second outline in its own colour, such as for the mesh under the pointer.
- [Lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md): the lights a toon mesh uses.
