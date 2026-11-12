# Batched meshes

A [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) draws many meshes from one scene node. Each mesh is a slot: a geometry, a material and a matrix that places it, with no [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) of its own. [Choosing a node for many objects](https://pixijs.com/3d/guides/components/scene-objects.md#choosing-a-node-for-many-objects) says when to pick it over meshes, sprites or particles. A slot is rigid. It can't bend with bones or morph targets, so keep animated characters as [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html)s.

[BatchedMesh3D](https://pixijs.com/3d/examples?example=instancing_batched-mesh) draws a ring of up to 100,000 clay shapes from one batch.

## Filling the slots

You set the number of slots when you create the batch, and it can't change later. Make it enough for the most meshes you'll show at once. The renderer draws each frame in steps called [passes](https://pixijs.com/3d/guides/concepts/rendering.md#the-passes-in-a-frame), such as shadows and then solid meshes. Give each slot a geometry, a material and a matrix, and put it in the passes that draw it:

```ts
import { BatchedMesh3D, ConeGeometry, Material3D, Matrix4, Quaternion, RenderPassBit, Vector3 } from '@pixi/3d';

const COUNT = 2000;
const forest = new BatchedMesh3D({ size: COUNT });
const cone = new ConeGeometry({ radius: 0.6, height: 2, radialSegments: 8 }); // few sides, since it draws 2,000 times
const pine = new Material3D({ baseColor: 0x2f6b3a, roughness: 0.9 });

const matrix = new Matrix4();
const position = new Vector3();
const rotation = new Quaternion();
const scale = new Vector3();

for (let i = 0; i < COUNT; i++) {
  const size = 0.7 + Math.random() * 0.6;

  // A tree somewhere in a 200 x 200 square, standing on the ground, turned at random
  position.set((Math.random() - 0.5) * 200, size, (Math.random() - 0.5) * 200);
  rotation.setFromAxisAngle({ x: 0, y: 1, z: 0 }, Math.random() * Math.PI * 2);
  scale.set(size);

  forest.setGeometryAt(i, cone);
  forest.setMaterialAt(i, pine);
  forest.setMatrixAt(i, matrix.compose(position, rotation, scale));
  forest.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
}

view3d.root.addChild(forest);
```

- **A slot doesn't take its passes from its material**, as a mesh does. Give it [`RenderPassBit`](https://3d.pixijs.download/v0.1.0/docs/rendering.RenderPassBit.html) flags with [`setPassesAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setpassesat) to match the material, such as `OPAQUE` for an [`alphaMode`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#alphamode) of `'opaque'` or `'mask'` and `TRANSPARENT` for `'blend'`. A [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html) with [`transmission`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#transmission) takes `TRANSMISSION` instead. Add `SHADOW` to cast shadows. No flag puts a slot in a [mesh pass](https://pixijs.com/3d/guides/components/post-processing.md#mesh-passes), such as an outline, so a slot can't have one.
- **A slot in a pass needs a geometry and a material**, even while it's hidden. Spare slots that are in no pass can stay empty.
- **A new slot's matrix is all zeros**, so it draws nothing until you set one. The matrix places the slot relative to the `BatchedMesh3D`. [`compose`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html#compose) builds one from a position, a rotation and a scale.
- **An object made of parts**, such as a trunk and a crown, takes a slot per part, so count parts when you size the batch. A part's matrix is the object's matrix times the part's offset on the object. [`tree.multiply(offset, part)`](https://3d.pixijs.download/v0.1.0/docs/maths.Matrix4.html#multiply) writes it into `part`, and the part turns and scales with the tree.
- **Moving, turning or hiding the `BatchedMesh3D`** does the same to every slot at once. On WebGPU, though, `'blend'` slots can overlap in the wrong order once the batch or a parent moves, turns or scales. Keep a batch of them at the origin, unturned and unscaled, and place the slots with their matrices.

Slots can mix geometries and materials, and they share draw calls by the same rules as meshes. [What makes a draw call](https://pixijs.com/3d/guides/concepts/performance.md#draw-calls) lists those rules. A slot has no `tint` like a 2D sprite's, and changing a material changes every slot that uses it. To recolour one slot, give it another material with [`setMaterialAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setmaterialat), which on WebGPU costs a draw call per material. Or give it [a value of your own](#instance-data), which keeps one draw call.

## Moving slots

[`setMatrixAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setmatrixat) copies a matrix into the slot and allocates nothing, so you can call it for every slot every frame.

To move thousands of slots a frame, skip the copy and write into the batch's own array, [`matrices`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#matrices). Slot `i`'s matrix is the 16 numbers starting at `offset + i * stride`, stored column by column. Numbers 12, 13 and 14 hold its position, and numbers 0 to 2, 4 to 6 and 8 to 10 hold its rotation and scale. After writing, call [`update()`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchMatrices.html#update) once, or the GPU may never see what you wrote. This code swirls a galaxy of slots round the origin, with the inner ones faster:

```ts
app.ticker.add((ticker) => {
  time += ticker.deltaMS / 1000;

  const { data, stride, offset } = galaxy.matrices;

  for (let i = 0, o = offset; i < galaxy.size; i++, o += stride) {
    const angle = angles[i] - (time * 3) / (radii[i] + 2); // inner spheres orbit faster

    data[o + 12] = Math.cos(angle) * radii[i];
    data[o + 14] = Math.sin(angle) * radii[i];
  }

  galaxy.matrices.update();
});
```

- Set each slot's whole matrix once, with `setMatrixAt` or through `matrices`, before you write only the numbers that move.
- Write only a slot's 16 numbers. The numbers after them hold engine data.

[BatchedMesh3D](https://pixijs.com/3d/examples?example=instancing_batched-mesh) lifts slots this way, then calls `update(first, count)` for just the slots it wrote.

## Showing and hiding slots

[`setVisibleAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setvisibleat) hides or shows a slot, as `visible` does for a mesh. A hidden slot draws nothing, not even its shadow. It keeps its geometry, material, matrix and passes, so showing it again rebuilds nothing. That makes hiding and showing the way to spawn and despawn. Every slot starts visible, so hide the spares first:

```ts
const bullets = new BatchedMesh3D({ size: 200, parent: view3d.root });

for (let i = 0; i < bullets.size; i++) {
  bullets.setGeometryAt(i, bulletGeometry);
  bullets.setMaterialAt(i, bulletMaterial);
  bullets.setPassesAt(i, RenderPassBit.OPAQUE);
  bullets.setVisibleAt(i, false); // a spare until fire() uses it
}

function fire(muzzle: Matrix4): void {
  for (let i = 0; i < bullets.size; i++) {
    if (bullets.getVisibleAt(i)) continue; // in flight

    bullets.setMatrixAt(i, muzzle);
    bullets.setVisibleAt(i, true);

    return;
  }
}
```

Hidden `'blend'` slots still cost a sort every frame. [`setVisibleAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setvisibleat) says when to take a spare out of its pass with `setPassesAt(i, 0)` instead.

## Changing what a slot draws

[`setMaterialAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setmaterialat) and [`setGeometryAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setgeometryat) give a slot a new material or geometry. The slot keeps its passes, so when the new material needs other passes, such as a `'blend'` material replacing an `'opaque'` one, call [`setPassesAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setpassesat) too. When you edit a material that slots already use, changes to values such as `baseColor` show up on their own. After a texture swap, though, call [`invalidate`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#invalidate) for each slot that uses the material, or those slots keep the old texture. `invalidate` lists the other changes that need it.

```ts
leaves.textures.baseColor = autumnLeaves;

for (const i of leafSlots) trees.invalidate(i);
```

A slot's [`billboardMode`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3DSlot.html#billboardmode) and [`receiveShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3DSlot.html#receiveshadow) are in [`items`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#items), and changing either also needs `invalidate`.

## Instance data

For a value that changes per slot, such as a tint that fades every frame, declare a field with the [`instanceData`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3DOptions.html#instancedata) option. Read it as `instance.<name>` in a shader bit, a piece of shader code you add to the material with [`extraBits`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3DOptions.html#extrabits). [Adding your own shader code](https://pixijs.com/3d/guides/components/materials/custom.md#adding-your-own-shader-code) explains bits.

```ts
import { BatchedMesh3D, Material3D } from '@pixi/3d';
import type { ShaderBit } from '@pixi/3d';

const tintBit: ShaderBit = {
  name: 'slotTint',
  bindings: { instance: { tint: 'vec4<f32>' } },
  gpu: { fragment: { material: 'albedo *= instance.tint.rgb;' } },
  gl: { fragment: { material: 'albedo *= instance.tint.rgb;' } },
};

const boxes = new BatchedMesh3D({ size: 1000, instanceData: { tint: { value: [1, 1, 1, 1], type: 'vec4<f32>' } } });
const paint = new Material3D({ baseColor: 0xffffff, extraBits: [tintBit] });

// Fill the slots with paint, as the forest above does, then:
boxes.setInstanceDataAt(0, 'tint', 1, 0.2, 0.2, 1); // slot 0 turns red
```

[`setInstanceDataAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setinstancedataat) writes one slot. To change many slots a frame, write into the [`instanceData`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#instancedata) array, which works like `matrices` and has its own `update()`.

## Billboards

A slot with [`PlaneGeometry.spriteQuad`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html#spritequad) and a `billboardMode` is a card that turns to face the camera. The matrix's x and y scale set the card's width and height:

```ts
import { Matrix4, PlaneGeometry, RenderPassBit } from '@pixi/3d';

const card = new Matrix4();

grass.setGeometryAt(i, PlaneGeometry.spriteQuad);
grass.setMaterialAt(i, bladeMaterial);
// 0.4 wide and 0.8 tall, standing on the ground
grass.setMatrixAt(i, card.makeScale(0.4, 0.8, 1).setPosition({ x, y: 0.4, z }));
grass.setPassesAt(i, RenderPassBit.OPAQUE); // no SHADOW, since a light draws a card's shadow from the unturned card
grass.items[i].billboardMode = 'cylindrical'; // turns about its upright axis only, so it stays standing
grass.invalidate(i);
```

## Culling

Culling skips drawing what's outside the camera's view. A batch uses its own [`cull`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#cull) setting, not the view's [`cull`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#cull). It's `'off'` by default, so every slot in a pass draws, on screen or not. Turn it on for a large batch that spreads well beyond the view, such as scenery across a whole map:

```ts
const forest = new BatchedMesh3D({ size: 10_000, cull: 'gpu' });
```

Once culling is on, the batch tests its slots every frame, and again for each shadow map that redraws. Where the test [runs on the CPU](https://pixijs.com/3d/guides/concepts/webgl-and-webgpu.md#how-each-renderer-culls), as under WebGL2, that work grows with the slot count. On the GPU, it costs the CPU almost nothing. With the whole batch in view, the test still runs but culls nothing. So for a camera that zooms out to see all of it, culling saves work only while zoomed in. [`CullMode`](https://3d.pixijs.download/v0.1.0/docs/scene.CullMode.html) says when to use each mode.

## Shadows

A slot in the `SHADOW` pass counts as a shadow caster, even while it's hidden. A directional light's shadow box is the part of the world its shadows cover. By default, the light refits that box only while the scene has few casters, so with a large batch it fits the box once and keeps it. [One box over the scene](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md#shadow-bounds) explains this. After you move or spawn slots outside the box, call [`fitShadowBounds`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#fitshadowbounds), or set your own box with [`shadow.bounds`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#bounds).

## Cleaning up

[`destroy`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#destroy) frees the batch's own buffers. It leaves the slots' geometries and materials alone, since they're often shared, unless you pass `geometry` or `material`, or `true` to set every flag. With those flags, it destroys each geometry or material once, however many slots use it:

```ts
forest.destroy({ geometry: true, material: true });
```

Use [`unload`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#unload) for a batch you'll show again later. [Unloading](https://pixijs.com/3d/guides/concepts/resources.md#unloading) says what it frees.

## Next steps

- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): what puts meshes in one draw call, and keeping a scene fast on phones.
- [Sprite3D](https://pixijs.com/3d/guides/components/scene-objects/sprite3d.md): cards with a sprite's API, for hundreds to a few thousand cards.
- [Particles](https://pixijs.com/3d/guides/components/particles.md): effects that emit, move and fade on their own.
