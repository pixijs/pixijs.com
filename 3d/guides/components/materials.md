# Materials

A [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html)'s material decides how its surface looks: its colour, its textures, its opacity and how light shades it. Many meshes can share one material, such as every copy of a loaded model, and a change to it shows on all of them. [Meshes](https://pixijs.com/3d/guides/components/scene-objects/meshes.md#sharing-geometry-and-materials) shows how to change just one mesh, and [Loading models](https://pixijs.com/3d/guides/components/models.md#a-source-and-its-models) shows how to give one model materials of its own.

## Picking a material

| Material              | Lighting                                                | Suits                                                              |
| --------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html)    | Physically based: how metallic and how rough it is      | Most lit surfaces, and the lit materials of glTF model files       |
| [`PhongMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterial.html) | A soft shade, plus a highlight you size and tint by eye | Lit surfaces that needn't reflect their surroundings               |
| [`FlatMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.FlatMaterial.html)  | None                                                    | UI panels, icons, video screens, textures with lighting painted in |

```ts
const steel = new Material3D({ baseColor: 0xc8c8c8, metallic: 1, roughness: 0.3 });
const plastic = new PhongMaterial({ baseColor: 0x2f6f8b, shininess: 64 });
const screen = new FlatMaterial({ baseColorTexture: screenTexture });
```

**`Material3D`** is the usual choice. It's the only one of the three that reflects the view's [`environment`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#environment), the sky and ground colours or the cube map that light the scene from all around, as [Environment and IBL](https://pixijs.com/3d/guides/components/environment.md) explains. [PBR materials](https://pixijs.com/3d/guides/components/materials/pbr.md) covers a `Material3D`'s inputs and the light it needs. [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md) covers its option groups, each of which turns on one extra feature, such as `clearcoat` for a lacquer coat or `transmission` for glass.

**`PhongMaterial`** does less work per pixel than `Material3D`. The view's environment gives it only soft light from all around, so it reflects nothing and its highlights come from direct lights alone. [`shininess`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterial.html#shininess) sets the size of the highlight and [`specularColor`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterial.html#specularcolor) sets its tint. [PBR, Phong and flat](https://pixijs.com/3d/examples?example=materials_lighting-models) puts the three materials side by side in one colour, and a slider in its pane sizes Phong's highlight.

**`FlatMaterial`** does no lighting. It shows its colour and texture without any lights, and neither shadows nor the environment change it. Its mesh still casts a shadow, so set [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) to `false` on a panel or screen that shouldn't cast one. The view's [`toneMapping`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#tonemapping), [`exposure`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#exposure) and [`fog`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#fog) still reach it, so a tone-mapping curve shifts a flat material's colours too. A curve such as `'aces'` squeezes bright light into the screen's range, as [Tone mapping and exposure](https://pixijs.com/3d/guides/components/environment.md#tone-mapping-and-exposure) explains. To keep fog off a flat material, build it with [`fog`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#fog) set to `false`.

`@pixi/3d/extras` adds [`ToonMaterial`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterial.html) for cartoon shading. [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md) covers it and how to write a material of your own.

## Colour and opacity

[`baseColor`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#basecolor) takes any PixiJS `ColorSource`, as a 2D `tint` does. It multiplies the base colour texture, so leave it white to show a texture unchanged. The material ignores the colour's own alpha. [`alpha`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alpha) sets the opacity instead, when the alpha mode allows it.

`baseColor` and the other colour options take colours as a colour picker shows them. The engine converts them to linear light, where doubling a value doubles the light. Numbers you pass to a shader yourself skip that step, so convert a picked colour with [`srgbToLinear`](https://3d.pixijs.download/v0.1.0/docs/materials.srgbToLinear.html) first. [Geometry](https://pixijs.com/3d/guides/components/scene-objects/meshes/geometry.md#vertex-colours) does this for vertex colours.

## Transparency

[`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alphamode) decides what a material does with the alpha from `alpha` and from its textures:

- **`'opaque'`**, the default for the three materials above, ignores alpha, so setting `alpha` alone does nothing. An image's transparent pixels still draw, as a solid surface rather than holes.
- **`'mask'`** throws away pixels whose alpha is below [`alphaCutoff`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alphacutoff) and draws the rest solid. Use it for hard edges such as leaves, fences, grilles and cut-out sprites.
- **`'blend'`** mixes the surface with what's behind it, in proportion to its alpha. Use it for fades, ghosts and soft edges.

```ts
const leaves = new Material3D({ baseColorTexture: leafTexture, alphaMode: 'mask', doubleSided: true });
const ghost = new Material3D({ baseColor: 0x99ccff, alpha: 0.4, alphaMode: 'blend' });
```

A masked material draws with the opaque meshes, so it hides what's behind it and needs no sorting. A masked mesh's shadow doesn't show its holes yet, so turn off `castShadow` on one whose solid shadow would look wrong.

Blended meshes draw after the opaque ones. Every frame the renderer sorts them from back to front by the distance from the camera to each mesh's origin, not by child order. It sorts each mesh as a whole, so a large blended mesh, or two that pass through each other, can draw in the wrong order where they overlap. A blended `Mesh3D` casts no shadow, as [Shadows](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md#which-meshes-cast-and-receive) explains.

[Transparency](https://pixijs.com/3d/examples?example=materials_alpha) switches two wordmark cards between the three modes, in front of a blended glass logo. With the cards on `'blend'`, walk round behind them and the draw order flips, so the logo draws over the cards.

A solid material can switch to `'blend'` for a fade and back to `'opaque'` when the fade ends. For glass and water that bend what's behind them, use [transmission](https://pixijs.com/3d/guides/components/materials/physical.md#transmission-and-volume) instead.

## Double-sided surfaces

By default a material draws only the front of each triangle, so an open surface such as a plane, a flag or a leaf card disappears when seen from behind. To draw both sides, build its material with [`doubleSided`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#doublesided) set to `true`, as the leaves above do. Lighting treats the back as if it faced the other way.

## Textures

A material reads its textures from named slots in [`material.textures`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#textures). All three materials above have a `baseColor` slot, which the `baseColorTexture` option fills. `PhongMaterial` and `Material3D` add more, such as `normal`, and [`Material3DTextures`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DTextures.html) lists a `Material3D`'s slots. Assign to a slot to swap its texture:

```ts
brickMaterial.textures.baseColor = await Assets.load('bricks-wet.png');
```

Every mesh that uses the material shows the new texture. On a [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) or a [`CubeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CubeGeometry.html) an image appears upside down until you flip it. [Geometry](https://pixijs.com/3d/guides/components/scene-objects/meshes/geometry.md#textures-on-the-built-in-shapes) shows how.

Each slot uses one of the GPU's texture inputs. Some devices allow only 16 per shader, and the engine uses a few of them itself. Most option groups take their slots whether or not you give them a texture, so leave out the groups a material doesn't use.

## What's fixed when you create a material

These options can't change once a material exists:

- On every material: `doubleSided`, [`flatShading`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#flatshading), `fog`, [`topology`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#topology), [`extraBits`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#extrabits), and the per-pass overrides in its [`passes`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#passes) option.
- On a `Material3D`: which option groups it has, such as [`clearcoat`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#clearcoat), and whether its coat has a normal map or its anisotropy has a texture.
- On a `PhongMaterial`: whether it has a [`specularTexture`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterialOptions.html#speculartexture) or an [`emissive`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterialOptions.html#emissive) group.

To change one, [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone) the material with the new value and assign the copy to the mesh's [`material`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#material). The copy keeps every other setting.

```ts
mesh.material = mesh.material.clone({ doubleSided: true });
```

A clone can add a feature, such as an option group or an extra bit, but can't take one away. An option set to `undefined` keeps the material's value, and `extraBits` adds to the bits the material already has. To drop a feature, build a new material.

## Changing a material that has rendered

A mesh picks up most changes to its material on the next frame: values such as `baseColor` and `alpha`, a texture swapped into a slot, and a switch to or from `'blend'`. A few settings take effect only after you call [`invalidate`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#invalidate) on each mesh that uses the material. One is a field of [`state`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#state), which holds the material's depth, blending and culling settings. [`BaseMaterial3D`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html) lists the rest.

```ts
// 'blend' draws the marker after the opaque walls, so it can draw over them
const marker = new Mesh3D({ geometry, material: new FlatMaterial({ baseColor: 0xffcc00, alphaMode: 'blend' }) });

view3d.root.addChild(marker);

// Later: show the marker through walls
marker.material.state.depthTest = false;
marker.invalidate();
```

A [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slot is one of the meshes a batch draws. It needs [`its own invalidate call`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#invalidate) after more kinds of change, including a texture swap. [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md#changing-what-a-slot-draws) shows which. A switch to or from `'blend'` also needs [`setPassesAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setpassesat).

## Cleaning up

[`destroy`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#destroy) frees a material for good. Other materials may share its textures, so it leaves them alone unless you pass `true`. [Resources and cleanup](https://pixijs.com/3d/guides/concepts/resources.md#destroying) says when passing `true` is safe. [`unload`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#unload) instead frees texture memory for a while, as [Unloading](https://pixijs.com/3d/guides/concepts/resources.md#unloading) explains.

## Next steps

- [PBR materials](https://pixijs.com/3d/guides/components/materials/pbr.md): metalness, roughness, the texture maps, glow and tiling.
- [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md): clear coat, sheen, glass and the other glTF extensions.
- [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md): cel shading and your own shader code.
- [Mesh passes](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes): drawing a material's meshes a second time for an effect such as an outline, with [`enablePass`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#enablepass).
