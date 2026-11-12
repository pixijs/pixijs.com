# PBR materials

[`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html) is a physically based (PBR) material. You say what a surface is made of, mainly how metallic and how rough it is, and its shader works out how light reflects off the surface. It follows the metallic-roughness model of glTF, an open file format for 3D models.

```ts
const gold = new Material3D({ baseColor: 0xffc356, metallic: 1, roughness: 0.25 });
const rubber = new Material3D({ baseColor: 0x222222, roughness: 0.9 });
```

A `Material3D` is lit. With no lights and no environment, a solid one draws black apart from its own glow. An environment is sky colours or a cube map that light the scene from all around. A metal shows little but its reflections, so it needs an environment to reflect. [Environment and IBL](https://pixijs.com/3d/guides/components/environment.md) shows how to add one.

## Metalness and roughness

[`baseColor`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#basecolor) and `baseColorTexture` give the surface its colour. What that colour does depends on [`metallic`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html#metallic):

- At 0, the default, the surface is a non-metal such as plastic, wood or stone. It shows its base colour, with a faint, untinted reflection on top.
- At 1 it's a metal. It reflects strongly and the base colour tints the reflection, so gold is a metal with a gold base colour.

[`roughness`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html#roughness) runs from 0, a mirror finish, to 1, fully rough. Smooth surfaces show sharp reflections and small, bright highlights. Rough ones blur their reflections and spread their highlights. [Metal and roughness](https://pixijs.com/3d/examples?example=materials_pbr) shows metal spheres over non-metal ones, from a mirror finish on the left to fully rough on the right.

> [!WARNING]
> `roughness` defaults to 1, so a `Material3D` you give only a colour is fully matte. For shiny plastic or paint, lower `roughness` and leave `metallic` at 0.

A [`metallicRoughnessTexture`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#metallicroughnesstexture) varies both across the surface. Its green channel holds roughness and its blue channel holds metalness, and each multiplies the matching value. `metallic` defaults to 0, so set it to 1 or the map's metalness has no effect:

```ts
const rusty = new Material3D({
  baseColorTexture: rustColour,
  metallicRoughnessTexture: rustMetalRough,
  metallic: 1,
});
```

You can change `roughness`, `metallic`, `baseColor` and the material's other numbers and colours every frame. Each change reaches every mesh that shares the material. [Materials](https://pixijs.com/3d/guides/components/materials.md#changing-a-material-that-has-rendered) covers the few settings that work differently.

## Normal maps

A normal map is a texture that stores which way the surface faces at each point. Lighting reads it to show bumps, grooves and seams that the triangles don't have. Pass it as [`normalTexture`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#normaltexture), and set [`normalScale`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html#normalscale) to make its bumps stronger or weaker. Texture sites often offer an OpenGL and a DirectX version of a normal map. Download the OpenGL one, since that's what `normalTexture` expects. To add or swap a normal map later, assign it to `material.textures.normal`. [Materials](https://pixijs.com/3d/guides/components/materials.md#textures) covers the [`textures`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#textures) slots.

```ts
const bricks = new Material3D({
  baseColorTexture: brickColour,
  normalTexture: brickNormals,
  normalScale: 0.8,
});
```

## Ambient occlusion

An ambient occlusion map darkens creases and cavities that light from the surroundings can't reach. Pass it as [`occlusionTexture`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#occlusiontexture). The shader reads its red channel. It darkens light from the view's environment and from an [`AmbientLight`](https://3d.pixijs.download/v0.1.0/docs/scene.AmbientLight.html), never from direct lights such as the sun.

Some texture sets pack occlusion, roughness and metalness into the red, green and blue channels of one image. Pass that image as both maps:

```ts
const crate = new Material3D({
  baseColorTexture: crateColour,
  occlusionTexture: crateOrm,
  metallicRoughnessTexture: crateOrm,
  metallic: 1, // the blue channel decides where it's metal
});
```

A roughness map that comes as its own grey image works too. Pass it as `metallicRoughnessTexture` and leave `metallic` at 0, so its blue channel has no effect. A separate metalness map has no slot of its own. Copy it into the roughness image's blue channel and set `metallic` to 1.

## Emissive glow

The [`emissive`](https://3d.pixijs.download/v0.1.0/docs/materials.EmissiveOptions.html) group makes a surface glow with its own colour, for screens, lamps, lava and neon. Its `color` multiplies an optional `texture`, and `strength` multiplies both. The glow shows in the dark, but it lights nothing around it. For a lamp that lights the room, add the glowing mesh as a child of a [`PointLight`](https://3d.pixijs.download/v0.1.0/docs/scene.PointLight.html), as [Scene objects](https://pixijs.com/3d/guides/components/scene-objects.md#putting-a-scene-together) does.

```ts
const neon = new Material3D({ baseColor: 0x111111, emissive: { color: 0x66ccff, strength: 4 } });
```

[`material.emissive`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html#emissive) exists only on a material built with the group. To switch a glow on later, build the material with the group at strength 0, then raise it:

```ts
const bulb = new Material3D({ baseColor: 0x222222, emissive: { color: 0xffcc66, strength: 0 } });

bulb.emissive!.strength = 3;
```

To make a glowing version of a material built without the group, such as one that came with a loaded model, copy it with [`clone`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#clone) and pass the group, as in `material.clone({ emissive: { color: 0xffcc66, strength: 0 } })`. Assign the copy to the meshes that should glow.

With `strength` above 1, the glow can be brighter than the screen can show. The view's [`toneMapping`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#tonemapping) turns the scene's light into screen colours. Under its default, `'none'`, each colour channel clips, so a strong orange glow turns yellow. A curve such as `'aces'` fades it toward white instead, and a [`BloomEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html) spreads it into a halo. See [Tone mapping and exposure](https://pixijs.com/3d/guides/components/environment.md#tone-mapping-and-exposure) and [Bloom](https://pixijs.com/3d/guides/components/post-processing.md#bloom).

[Tone mapping](https://pixijs.com/3d/examples?example=lighting_tone-mapping) shows a row of pink balls glowing at strengths 0.5 to 8 under both curves. Past strength 1, they go flat and change hue under `'none'`, and fade toward white under `'aces'`.

## Tiling and moving textures

[`uvTransform`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#uvtransform) scales, rotates and moves the texture coordinates, or UVs, of a `Material3D`, a [`PhongMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.PhongMaterial.html) or a [`FlatMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.FlatMaterial.html). It's one matrix for all of the material's textures. Scaling the coordinates by 4 fits the texture in 4 times across. That's the opposite of a `TilingSprite`'s `tileScale`, where a bigger scale makes each tile bigger.

An image you load with `Assets.load`, such as a PNG or JPG, clamps at its edges, so past the first tile its edge pixels smear across the surface. It also has no mipmaps, the smaller copies of the image that the GPU reads for distant surfaces, so a tiled floor seen from low down shimmers in the distance. Ask for repeating and mipmaps when you load it:

```ts
import { Assets, Matrix } from 'pixi.js';

const floorTexture = await Assets.load({
  src: 'floor.jpg',
  data: { addressMode: 'repeat', autoGenerateMipmaps: true },
});
const floor = new Material3D({ baseColorTexture: floorTexture, uvTransform: new Matrix().scale(4, 4) });
```

To rotate the texture too, add `rotate` and call `translate` last, as in `new Matrix().rotate(angle).scale(sx, sy).translate(x, y)`. Called after `translate`, `rotate` and `scale` rotate and scale its offset too.

Changing a matrix in place, whether yours or the one `material.uvTransform` returns, does nothing until you assign it to `uvTransform` again. Each assignment is a small data upload, so scrolling a texture every frame is cheap. Load a texture you scroll with `addressMode: 'repeat'` too, or its edge pixels smear in as it moves:

```ts
const flow = new Matrix();

app.ticker.add((ticker) => {
  flow.tx += 0.05 * (ticker.deltaMS / 1000);
  riverMaterial.uvTransform = flow;
});
```

## Sprite-sheet frames

A `Texture` from a PixiJS `Spritesheet`, or one made with `new Texture({ source, frame })`, is one frame of a larger image. As the `baseColorTexture` of a `Material3D`, `PhongMaterial` or `FlatMaterial`, it works as it does on a 2D sprite. The material sets its UV transform from the frame, so the mesh shows only that frame. A [`ToonMaterial`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterial.html) shows the whole image instead.

```ts
import { Rectangle, Texture } from 'pixi.js';

const frame = new Texture({ source: sheet.source, frame: new Rectangle(64, 0, 64, 64) });
const tile = new Mesh3D({
  geometry: new PlaneGeometry({ flipV: true }),
  material: new FlatMaterial({ baseColorTexture: frame }), // unlit, like a 2D sprite
});

view3d.root.addChild(tile);
```

[`flipV`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometryOptions.html#flipv) shows the frame the right way up. See [Geometry](https://pixijs.com/3d/guides/components/scene-objects/meshes/geometry.md#textures-on-the-built-in-shapes). The material stores the frame, so meshes that show different frames each need their own material. To animate, assign another frame of the same image to `material.textures.baseColor`. That changes only the UV transform, which is a small data upload with no shader compile.

[UV transform](https://pixijs.com/3d/examples?example=materials_uv-transform) plays a flipbook on a screen this way, one frame of a sprite sheet after another.

When a material shows a sprite-sheet frame:

- The frame's UV transform applies to all of the material's textures. Lay out the other maps, such as a normal map, in the same frames as the base colour sheet, or they show the wrong part of their image.
- Pack sheets for 3D without trimming. A mesh can't apply a frame's trim, and the material warns when its base colour texture has one.
- Setting `uvTransform` yourself overrides the frame. Set it to `undefined` to go back to the frame's transform.

For pictures that always face the camera, use [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html), which takes sprite-sheet frames too. See [Sprite3D](https://pixijs.com/3d/guides/components/scene-objects/sprite3d.md#sprite-sheets).

## Next steps

- [Physical extensions](https://pixijs.com/3d/guides/components/materials/physical.md): clearcoat, sheen, specular, iridescence, glass and anisotropy.
- [Environment and IBL](https://pixijs.com/3d/guides/components/environment.md): image-based light and reflections.
- [Loading models](https://pixijs.com/3d/guides/components/models.md): materials that come from glTF files.
