# Geometry

A [`Geometry3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html) holds the points a shape is built from, called vertices, and the triangles that join them. Each vertex has a position. Most also have a normal and UVs. A normal is the direction the surface faces at that vertex, and lighting needs it. UVs say which part of a texture lands there. A [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) draws a geometry with a material, as [Meshes](https://pixijs.com/3d/guides/components/scene-objects/meshes.md) covers.

## Built-in shapes

Nine classes build common shapes, normals and UVs included. Sizes are in scene units, not pixels, and +Y points up. [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md#axes-units-and-facing) explains why to treat a unit as a metre.

| Geometry                    | Shape                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html)       | A flat rectangle standing in the XY plane, facing +Z                                          |
| [`CubeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CubeGeometry.html)        | A box                                                                                         |
| [`SphereGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.SphereGeometry.html)      | A sphere built from rings, with its poles on the Y axis                                       |
| [`IcosahedronGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.IcosahedronGeometry.html) | A 20-sided solid                                                                              |
| [`CylinderGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CylinderGeometry.html)    | A cylinder along Y; different `radiusTop` and `radiusBottom` make a cone with its tip cut off |
| [`ConeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.ConeGeometry.html)        | A cone along Y, tip up                                                                        |
| [`CapsuleGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CapsuleGeometry.html)     | A cylinder with rounded ends, along Y                                                         |
| [`TorusGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.TorusGeometry.html)       | A ring lying flat in the XZ plane                                                             |
| [`TorusKnotGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.TorusKnotGeometry.html)   | A tube wound into a knot around the Y axis                                                    |

A shape is built around its origin, not from its top-left corner as a 2D `Sprite` is by default. So a mesh at y = 0 sinks halfway into a floor at y = 0. Raise it by half its height to stand it on the floor. A capsule's [`height`](https://3d.pixijs.download/v0.1.0/docs/geometry.CapsuleGeometryOptions.html#height) is its full length, rounded ends included:

```ts
import { CapsuleGeometry, Material3D, Mesh3D } from '@pixi/3d';

const pill = new Mesh3D({
  geometry: new CapsuleGeometry({ radius: 0.3, height: 1.2 }),
  material: new Material3D({ baseColor: 0x6bc4b8 }),
});

pill.position.y = 0.6; // half its height, so it stands on the floor
view3d.root.addChild(pill);
```

A plane stands upright like a wall. [Scene graph and transforms](https://pixijs.com/3d/guides/concepts/scene-graph.md#axes-units-and-facing) shows how to lay one flat as a floor. Every shape but the icosahedron takes segment counts, the number of slices it's cut into. More segments make a curved shape smoother and cost more vertices. The icosahedron's [`detail`](https://3d.pixijs.download/v0.1.0/docs/geometry.IcosahedronGeometryOptions.html#detail) splits each of its triangles instead. [Built-in shapes](https://pixijs.com/3d/examples?example=geometry_shapes) builds each shape and counts its vertices and triangles as you change its options.

## Textures on the built-in shapes

UVs place a texture on a shape. The `u` coordinate runs across the image from left to right, and `v` runs down it from 0 at the image's top row. The shapes lay them out like this:

- [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) and [`CubeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CubeGeometry.html) put `v = 0` at the bottom edge of the plane and of the cube's sides, so an image shows upside down. For the plane, set [`flipV`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometryOptions.html#flipv) when you build it. The cube has no such option, so flip `v` with its material's [`uvTransform`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#uvtransform), as the code below does.
- [`SphereGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.SphereGeometry.html), [`CylinderGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CylinderGeometry.html), [`ConeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.ConeGeometry.html) and [`CapsuleGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CapsuleGeometry.html) put `v = 0` at the top, so an image stands upright. Today, though, it runs around them mirrored, right to left. A `uvTransform` of `new Matrix(-1, 0, 0, 1, 1, 0)` flips it back.
- [`IcosahedronGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.IcosahedronGeometry.html) squeezes the whole image into a thin strip along the seam where its `u` wraps around. Use a `SphereGeometry` for a textured ball.
- [`TorusGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.TorusGeometry.html) and [`TorusKnotGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.TorusKnotGeometry.html) run `u` along the ring or the knot, and `v` around the tube.

```ts
import { Material3D } from '@pixi/3d';
import { Matrix } from 'pixi.js';

const crate = new Material3D({ baseColorTexture: logo, uvTransform: new Matrix(1, 0, 0, -1, 0, 1) }); // v becomes 1 - v
```

A `uvTransform` also repeats a texture across a surface, as a `TilingSprite` does in 2D, once the texture source's `addressMode` is `'repeat'`. [Tiling and moving textures](https://pixijs.com/3d/guides/components/materials/pbr.md#tiling-and-moving-textures) covers this. Setting a `uvTransform` replaces the mapping that a [sprite-sheet frame](https://pixijs.com/3d/guides/components/materials/pbr.md#sprite-sheet-frames) gives the material. So if the texture is a sprite-sheet frame, the flip above shows the whole sheet.

A [`ContainerTexture`](https://3d.pixijs.download/v0.1.0/docs/rendering.ContainerTexture.html), a texture that shows a 2D container, comes out the other way up from an image. It's upright on a cube and on a plane without `flipV`, and upside down on the sphere, cylinder, cone and capsule. [Rendering 2D into 3D](https://pixijs.com/3d/guides/components/container-texture.md) shows how to make one.

## Custom geometry

Pass arrays to [`Geometry3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html). [`positions`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#positions) takes three numbers per vertex, and [`indices`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#indices) takes three vertex numbers per triangle:

```ts
import { Geometry3D, Material3D, Mesh3D } from '@pixi/3d';

// A 1 by 1 floor tile: four corners, two triangles
const tile = new Geometry3D({
  positions: new Float32Array([-0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, -0.5]),
  normals: new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]), // every corner faces up
  uvs: new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), // the image's top row on the far edge
  indices: new Uint16Array([0, 1, 2, 0, 2, 3]), // counter-clockwise, seen from above
});

view3d.root.addChild(new Mesh3D({ geometry: tile, material: new Material3D({ baseColorTexture: texture }) }));
```

- **Winding.** Winding is the order of a triangle's corners. List them counter-clockwise as seen from the side that should show. Unlike a 2D mesh, a material draws only that side unless it's [`double-sided`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#doublesided), so a triangle wound the other way is invisible.
- **Normals.** Without [`normals`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#normals), every vertex shades as if it faced the mesh's +Z. Faces that share a vertex share its one normal, so they shade smoothly across their edge. For a hard edge, give each face its own copy of the edge's vertices, as `CubeGeometry` does. To shade each triangle as one flat face, turn on the material's [`flatShading`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#flatshading) instead. It needs no extra vertices.
- **Indices.** Without them, every three vertices in order make a triangle. A `Uint16Array` holds vertex numbers up to 65,535, so pass a `Uint32Array` for a bigger mesh.

### Lines

With [`topology`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#topology) set to `'line-list'`, each pair of vertices, or of indices, makes one line:

```ts
import { FlatMaterial, Geometry3D, Mesh3D } from '@pixi/3d';

const outline = new Geometry3D({
  positions: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]),
  indices: new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0]), // the square's four sides
  topology: 'line-list',
});

view3d.root.addChild(new Mesh3D({ geometry: outline, material: new FlatMaterial() }));
```

Lines are one pixel wide on both WebGL and WebGPU. For a thicker line, build a strip of triangles.

### Vertex colours

[`colors`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#colors) gives each vertex an RGBA colour. Once a material's [`vertexColors`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#vertexcolors) is on, it multiplies its base colour by them. The material reads them in linear light, the scale its lighting maths uses, not as sRGB display colours like a hex `baseColor`. So convert a colour you picked with [`srgbToLinear`](https://3d.pixijs.download/v0.1.0/docs/materials.srgbToLinear.html) first, or it comes out too light. This snippet colours a terrain by its height, with snow above y = 2 and grass below. It expects a terrain built with +Y up:

```ts
import { Geometry3D, Material3D, srgbToLinear } from '@pixi/3d';
import { Color } from 'pixi.js';

const [grass, snow] = [0x6a994e, 0xf1f5f9].map((hex) => {
  const color = new Color(hex);

  return [srgbToLinear(color.red), srgbToLinear(color.green), srgbToLinear(color.blue), 1];
});
const colors = new Float32Array(vertexCount * 4);

for (let i = 0; i < vertexCount; i++) colors.set(positions[i * 3 + 1] > 2 ? snow : grass, i * 4);

const geometry = new Geometry3D({ positions, normals, indices, colors });
const material = new Material3D({ vertexColors: true });
```

## Reading vertices back

[`geometry.normals`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#normals) and the other getters return the data as it's stored. By default, PixiJS 3D stores normals as 16-bit integers, not the floats you passed in. A model compressed with mesh quantization, which stores vertex data as small integers, can keep its positions and UVs that way too. [`getAttributeData`](https://3d.pixijs.download/v0.1.0/docs/geometry.getAttributeData.html) reads any of them back as floats:

```ts
import { getAttributeData } from '@pixi/3d';

const normals = getAttributeData(geometry, 'aNormal', 3); // three floats per vertex
```

## Changing a geometry

PixiJS 3D draws a geometry from a copy of its vertices, kept in a buffer it shares with other geometries. It makes the copy the first frame a view renders with a mesh that uses the geometry, even if that mesh is hidden or off-screen. After that, editing the geometry's arrays changes nothing on screen. Updating its buffer, as you would for a 2D mesh, doesn't help either. Only a dynamic geometry, covered below, draws from its own buffers.

For a different shape, build a new geometry, assign it to [`mesh.geometry`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#geometry), and [`destroy`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#destroy) the old one once no mesh uses it. Otherwise the old one keeps its space in the shared buffer. The renderer's garbage collector never frees that space, as [Resources and cleanup](https://pixijs.com/3d/guides/concepts/resources.md#the-renderers-garbage-collector) explains.

### Unloading geometry

For an occasional edit, such as raising the ground in a terrain editor, edit the arrays and then call [`unload`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3D.html#unload). The next frame a view renders with a [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) that uses the geometry, PixiJS 3D copies all of it in again. If a [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slot draws the geometry, also call [`invalidate`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#invalidate) for that slot.

```ts
const positions = ground.geometry.positions; // a Float32Array, three numbers per vertex

positions[vertex * 3 + 2] += 0.25; // raise one vertex; a PlaneGeometry laid flat as a floor points its own z up
ground.geometry.unload();
```

Plan for two things when you build a geometry you'll edit this way:

- **Culling bounds.** Culling skips meshes outside the camera's view. It keeps testing the bounds the geometry was built with, so a mesh can vanish while its edited shape is still on screen. Pass a [`bounds3D`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#bounds3d) box, in the geometry's own axes, big enough for every shape you'll edit it into.
- **Normals.** Moving a vertex changes the slope around it, so you need to rewrite the normals there too. Build the geometry with [`quantizeNormals`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#quantizenormals) set to `false`, so `geometry.normals` stays an editable `Float32Array` with three numbers per vertex.

### Dynamic geometry

For a shape that changes every frame, such as a trail or a rope, build the geometry with [`dynamic`](https://3d.pixijs.download/v0.1.0/docs/geometry.Geometry3DOptions.html#dynamic) set to `true`. A dynamic geometry draws from its own buffers, so updating one uploads what you wrote. PixiJS 3D never culls it, since its vertices can go anywhere.

```ts
import { FlatMaterial, Geometry3D, Mesh3D } from '@pixi/3d';

const ribbon = new Geometry3D({ positions: new Float32Array(32 * 3 * 3), dynamic: true });

// The camera sees a strip from both sides, and it has no normals to light it, so draw it unlit and double-sided
const trail = new Mesh3D({ geometry: ribbon, material: new FlatMaterial({ doubleSided: true }), castShadow: false });

view3d.root.addChild(trail);

app.ticker.add(() => {
  writeRibbon(ribbon.positions); // your code: the x, y and z of three corners per triangle
  ribbon.attributes.aPosition.buffer.update();
});
```
