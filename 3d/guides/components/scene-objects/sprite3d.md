# Sprite3D

A [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html) is a flat textured card in a 3D scene. Like a 2D sprite, it takes its size from its texture and has an `anchor`, a [`tint`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#tint) and an `alpha`. By [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#billboardmode) it also turns to face the camera, which 3D calls billboarding. Use it for trees, glows, markers over characters and flat stand-ins for distant models.

## Creating a sprite

`new Sprite3D` takes one options object. It holds the sprite's own options plus the ones every [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) takes, such as `position`.

```ts
import { Sprite3D } from '@pixi/3d';
import { Assets } from 'pixi.js';

const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
const bunny = new Sprite3D({ texture, height: 1 });

bunny.position.set(0, 1, 0);
view3d.root.addChild(bunny);
```

As on a 2D sprite, `new Sprite3D(texture)` is short for `{ texture }`, and [`Sprite3D.from`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#from) takes anything `Texture.from` accepts. Move or size a new sprite before it first draws, as the snippet above does. Otherwise it draws as a 1-unit square. Unless you pass a `material`, the sprite draws with an unlit [`FlatMaterial`](https://3d.pixijs.download/v0.1.0/docs/materials.FlatMaterial.html) of its own, so lights don't change its colours.

## Size

A sprite's size is its texture's size in pixels, times [`pixelSize`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#pixelsize), times its `scale`. `pixelSize` is the number of world units per pixel. Its default of 0.01 makes a 512-pixel image 5.12 units across.

To size a sprite in world units instead, pass [`width`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#width) or `height`. The other side then follows the image's aspect ratio. Pass both to stretch the image. After you create the sprite, the [`width`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#width) and [`height`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#height) properties each set one axis by writing `scale`, as on a 2D sprite:

```ts
const tree = new Sprite3D({ texture: treeTexture, height: 4 }); // the width follows the image

tree.height = 6; // taller, and the width stays as it was
```

## Anchor

As in 2D, [`anchor`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#anchor) is the point of the image that sits on the sprite's position. Unless the texture has a `defaultAnchor`, it defaults to the centre rather than the top-left corner. An anchor of `{ x: 0.5, y: 1 }` puts the middle of the bottom edge of a `'cylindrical'` or `'none'` sprite on its position. A `'spherical'` sprite with that anchor drifts as the camera moves, as [Facing the camera](#facing-the-camera) explains.

## Facing the camera

The GPU turns a sprite to face the camera as it draws it, so your code never has to. [`billboardMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#billboardmode) picks how the sprite turns, or whether it turns at all:

- `'spherical'`, the default, keeps the card flat to the screen from every angle. Use it for glows, sparks and icons. It ignores the sprite's `rotation`, so a spark can't spin as a 2D sprite can. [Particles](https://pixijs.com/3d/guides/components/particles.md#options) can spin. An anchor away from the centre drifts as the camera moves, so keep these sprites centred.
- `'cylindrical'` turns the card about its up axis only, so it stays upright when the camera looks down on it. Use it for trees, grass and characters.
- `'none'` draws the card as you place it, facing its local +Z. Use it for signs and decals that keep their own rotation.

[Sprites in 3D](https://pixijs.com/3d/examples?example=sprites_sprite3d) shows the three modes side by side. Orbit the camera and watch which sprites turn to follow you.

A sprite that faces the camera ignores a negative `scale.x`, so it can't flip the way a 2D sprite does. Flip the image instead, with a mirrored copy of its texture:

```ts
import { Texture, groupD8 } from 'pixi.js';

const facingLeft = new Texture({ source: walk.source, frame: walk.frame, rotate: groupD8.MIRROR_HORIZONTAL });

hero.texture = facingLeft;
```

Picking is the 3D hit test behind pointer events. It tests the card before the GPU turns it, not the card you see. [Interaction](https://pixijs.com/3d/guides/components/interaction.md#hit-volumes) shows how to give a sprite a shape that's easy to click.

### Billboards on any mesh

A [`Mesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html) can face the camera too. Set its [`billboardMode`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#billboardmode) and build its geometry facing +Z. Turn its [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) off, for the reason [Shadows](#shadows) gives.

## Transparency

A sprite blends by [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#alphamode), which suits soft edges such as glows. Every frame, the view sorts blended meshes back to front by distance, not by child order, as [Materials](https://pixijs.com/3d/guides/components/materials.md#transparency) explains. For hard-edged images such as leaves, set `alphaMode: 'mask'`. A masked sprite cuts away pixels below [`alphaCutoff`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#alphacutoff) and draws the rest solid, so it skips that sort.

[`alpha`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#alpha) fades only a blended sprite. On a masked sprite, lowering `alpha` cuts more of the image away until none is left. An `'opaque'` sprite ignores it. A sprite has no `blendMode`. For glows that add light, as `'add'` does in 2D, use [particles](https://pixijs.com/3d/guides/components/particles.md#options).

## Shadows

A light draws a billboard's shadow from the card before the GPU turns it to face the camera, so the shadow can thin to a sliver. That's why a sprite casts no shadow by [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#castshadow). With `castShadow: true`, a sprite in `'none'` mode casts a shadow when it's masked or opaque and its front faces the light. A masked sprite's shadow doesn't show its holes yet, as [Shadows](https://pixijs.com/3d/guides/components/scene-objects/lights/shadows.md#which-meshes-cast-and-receive) says.

## Sharing a material

Pass a `material` and the sprite draws with it. The sprite takes its image, and so its size, from the material's base colour texture. A [`Material3D`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3D.html) makes a lit sprite that the view's [lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md) shade. Use one for a flat stand-in for a lit model.

Many sprites can share one material:

```ts
import { FlatMaterial, Sprite3D } from '@pixi/3d';

const material = new FlatMaterial({ baseColorTexture: bunnyTexture, alphaMode: 'mask' });

for (let i = 0; i < 1000; i++) {
  const bunny = new Sprite3D({ material });

  bunny.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);
  view3d.root.addChild(bunny);
}
```

These sprites draw together on both renderers, but they all look the same. Setting `texture`, `tint`, `alpha`, `alphaMode` or `alphaCutoff` on any of them, or passing one as an option, writes into the shared material, so changing one sprite changes all of them. Destroying a sprite destroys a material it made for itself. By [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#destroy), it leaves a material you passed alone.

## Sprite sheets

There's no 3D `AnimatedSprite`. To change frames, assign another [`texture`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html#texture), and the sprite resizes to fit it. Frames of one sprite sheet share its `TextureSource`, so switching between them keeps the sprite in the same draw call. This flipbook cuts four frames from one sheet and swaps them in the ticker:

```ts
import { Sprite3D } from '@pixi/3d';
import { Rectangle, Texture } from 'pixi.js';

const frames = [0, 1, 2, 3].map((i) => new Texture({ source: sheet.source, frame: new Rectangle(i * 64, 0, 64, 64) }));
const pulse = new Sprite3D({ texture: frames[0], pixelSize: 1 / 10 });

pulse.position.y = 3.5;
view3d.root.addChild(pulse);

app.ticker.add(() => {
  pulse.texture = frames[Math.floor((performance.now() / 1000) * 9) % frames.length];
});
```

Pack sprite sheets for 3D without trimming, because a `Sprite3D` doesn't draw a trimmed frame correctly. Sprites that share a material also share its frame, so animate frames only on sprites that have a material of their own.

## Draw calls

Sprites can draw together in one call only when they share a billboard mode, an alpha mode, a material class and a texture source, among other things. [Performance](https://pixijs.com/3d/guides/concepts/performance.md#draw-calls) has the full rules. Tint, alpha, size and position can all differ. So put the images of one kind of sprite on one sheet.

Blended sprites draw back to front. Each time the billboard mode or texture source changes along that order, another draw call starts. So give each blended effect one mode and one sheet.

Each sprite is a scene node. [Choosing a node for many objects](https://pixijs.com/3d/guides/components/scene-objects.md#choosing-a-node-for-many-objects) says how many sprites that suits, and when [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slots or particles do better.

## Limits

- Don't give a sprite children. A child inherits the sprite's texture size, so a child's `x = 1` is one sprite width, not one unit. Put the sprite and the objects that go with it in a [`Container3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Container3D.html) instead.
- A [`ContainerTexture`](https://3d.pixijs.download/v0.1.0/docs/rendering.ContainerTexture.html) shows upside down on a sprite. For 2D content that faces the camera, put it on a `Mesh3D` with a [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) and a `billboardMode`. For a label that keeps its size on screen, draw it in 2D over the view, as [View3D](https://pixijs.com/3d/guides/concepts/view3d.md#world-to-screen) shows.

## Next steps

- [Particles](https://pixijs.com/3d/guides/components/particles.md): cards that emit, move and fade on their own.
- [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md#billboards): more cards than sprites suit, as slots of one node.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md): what lets meshes share a draw call.
