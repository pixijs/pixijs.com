# Shadows

A light that casts shadows draws the meshes that cast them into a shadow map, a depth image of the scene as the light sees it. To shade a surface, the view looks the surface up in that map to see whether something sits between it and the light. [Shadows](https://pixijs.com/3d/examples?example=shadows_basics) casts the PixiJS logo's shadow onto a wall. Its controls turn casting and receiving on and off, and set the map's size, its filter and the biases.

## Turning shadows on

Set [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#castshadow) on a [`DirectionalLight`](https://3d.pixijs.download/v0.1.0/docs/scene.DirectionalLight.html) or a [`SpotLight`](https://3d.pixijs.download/v0.1.0/docs/scene.SpotLight.html), the two lights that cast shadows. A mesh you build with `new Mesh3D` casts and receives shadows by [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#defaultoptions), so the light is all a scene needs. A floor only needs to catch shadows, so turn its casting off:

```ts
import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, PlaneGeometry } from '@pixi/3d';

const sun = new DirectionalLight({ intensity: 3, castShadow: true });

sun.position.set(-3, 5, 2);
view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });

const floor = new Mesh3D({
  geometry: new PlaneGeometry({ width: 8, height: 8 }),
  material: new Material3D({ baseColor: 0x888888 }),
  castShadow: false,
});

floor.rotation.x = -Math.PI / 2;
view3d.root.addChild(floor);

const cube = new Mesh3D({
  geometry: new CubeGeometry({ width: 0.8, height: 0.8, depth: 0.8 }),
  material: new Material3D({ baseColor: 0xdd4444 }),
});

cube.position.y = 0.4; // resting on the floor
view3d.root.addChild(cube);
```

A shadow blocks only the light that casts it. The view's [environment](https://pixijs.com/3d/guides/components/environment.md) still lights the shadowed surface, so the brighter the sky, the fainter the shadow. No material draws the shadow without the surface under it, so the surface that catches a shadow always draws too.

## Which meshes cast and receive

The light draws each caster again for each shadow map it falls in, so turn a mesh's [`castShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#castshadow) off wherever no one sees its shadow, such as on floors, water and small debris. A floor that doesn't cast can lose the shadow of something floating above it, and [One box over the scene](#shadow-bounds) shows the fix.

- A mesh whose material blends (`alphaMode: 'blend'`) or has [`transmission`](https://3d.pixijs.download/v0.1.0/docs/materials.Material3DOptions.html#transmission) casts no shadow.
- [`receiveShadow`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#receiveshadow) has an effect only on a [`lit`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#lit) material, one that reacts to lights. After you change it at runtime, call [`invalidate`](https://3d.pixijs.download/v0.1.0/docs/scene.Mesh3D.html#invalidate) on the mesh.
- A [`Model3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3D.html) takes both as [`options`](https://3d.pixijs.download/v0.1.0/docs/scene.Model3DOptions.html#castshadow) and passes them to every mesh it builds.
- A [`Sprite3D`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3D.html) casts no shadow by [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#castshadow) and blends by [`default`](https://3d.pixijs.download/v0.1.0/docs/scene.Sprite3DOptions.html#alphamode). It casts only with `castShadow: true` and an `alphaMode` of `'mask'` or `'opaque'`. [Sprite3D](https://pixijs.com/3d/guides/components/scene-objects/sprite3d.md#shadows) explains why.
- A [`BatchedMesh3D`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html) slot casts only when you turn casting on with [`setPassesAt`](https://3d.pixijs.download/v0.1.0/docs/scene.BatchedMesh3D.html#setpassesat), as [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md#filling-the-slots) shows.
- A `'mask'` card's shadow doesn't show its holes yet, so turn casting off on cards such as leaves.
- A [`PlaneGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.PlaneGeometry.html) doesn't cast yet while its back faces the light, even when its material is [`doubleSided`](https://3d.pixijs.download/v0.1.0/docs/materials.BaseMaterial3D.html#doublesided). For a flat caster that the light sees from both sides, use a thin [`CubeGeometry`](https://3d.pixijs.download/v0.1.0/docs/geometry.CubeGeometry.html).

## Quality and soft edges

Two view settings apply to every shadow in the view. [`shadowQuality`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#shadowquality) sets the size of each shadow map. A bigger map gives sharper edges, and each step up takes four times the memory. [`shadowFilter`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#shadowfilter) sets how soft the edges are. [`ShadowQuality`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShadowQuality.html) and [`ShadowFilter`](https://3d.pixijs.download/v0.1.0/docs/rendering.ShadowFilter.html) list the choices.

You can change `shadowQuality` at any time, since it compiles no shaders. The first light in the view to cast a shadow compiles new shaders, and so does setting a new `shadowFilter` after that. Either can stall a frame, so choose the filter and turn shadows on at start-up, as [How a frame renders](https://pixijs.com/3d/guides/concepts/rendering.md#when-shaders-compile) explains.

```ts
import { View3D } from '@pixi/3d';

const phone = navigator.maxTouchPoints > 0;

const view3d = new View3D({
  autoResize: true,
  shadowQuality: phone ? 'medium' : 'high',
  shadowFilter: phone ? 'hard' : 'pcf',
});
```

## Directional shadows

A directional light's shadow map covers a box of the world, seen from the light. The map's pixels spread over that box, so the bigger the box, the blurrier every shadow in it.

### Shadow bounds

By default, the light fits the box around every visible shadow caster in the scene, on screen or off. That suits a scene that fits in one view, such as a room, an arena or a board. While the scene has 256 casters or fewer, hidden ones included, the light refits the box each time it redraws. With more than 256, it fits the box once and keeps it, so call [`fitShadowBounds`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#fitshadowbounds) after you move or spawn casters outside it.

The box holds the casters and nothing else, so:

- One distant caster, such as far-off scenery, stretches the box and blurs every shadow. Turn casting off on scenery like that.
- Only surfaces inside the box are sure to get a shadow. The light doesn't fit the box to a floor with `castShadow: false`, so the shadow of something floating above the floor can vanish, and a low sun's long shadows can stop short.

For a scene like that, give the light your own box with [`shadow.bounds`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#bounds), in world coordinates. Make it include the floor where the shadows land:

```ts
import { Box } from '@pixi/3d';

sun.shadow.bounds = Box.fromCenterSize({ x: 0, y: 1, z: 0 }, { x: 14, y: 2.6, z: 14 });
```

### Cascades for large worlds

For a world bigger than the screen, cascades split what the camera sees into slices by distance, each with its own shadow map. The near slices cover little ground, so the shadows closest to the camera stay sharp. The light fits the cascades to the camera each time it redraws, so the world can be any size, but the cascades must redraw whenever the camera moves.

A box doesn't follow the camera. For still scenery that fits in one box, such as a forest that an orbit camera circles, one box with [`update: 'manual'`](#redrawing-less-often) draws its map once, however the camera moves. That's the cheapest choice on a phone, though cascades keep the shadows near the camera sharper.

```ts
sun.shadow.cascades = 3;
sun.shadow.maxDistance = 80;
```

- [`cascades`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#cascades) is the number of slices, from 1 to 4. More slices keep shadows sharp further from the camera, but the farthest slice stays about as coarse whatever the count. Each slice is another map to draw, and takes another map from [the shadow budget](#shadow-map-limit).
- [`maxDistance`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#maxdistance) is how far from the camera the cascades reach, in your scene's units. Set it to the farthest distance at which shadows still matter. A shorter reach makes every cascade sharper.
- [`lambda`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#lambda) sets how that reach splits between the slices. Raise it toward 1 for more detail near the camera.

[Large scenes](https://pixijs.com/3d/examples?example=shadows_large-scenes) lights a long road with one sun and switches it between a fixed box and one to four cascades. It draws each map's texels, the pixels of a shadow map, on the road as a grid, so you can see the cascades keep them small near the camera.

## Spot light shadows

A [`SpotLight`](https://3d.pixijs.download/v0.1.0/docs/scene.SpotLight.html)'s shadow map covers its cone, so it ignores `bounds` and `cascades`. The map starts 1 world unit in front of the light, so a caster closer than that casts no shadow. Keep its [`coneAngle`](https://3d.pixijs.download/v0.1.0/docs/scene.SpotLight.html#coneangle) under 90 degrees and as narrow as the light allows. The map spreads over the whole cone, so the wider the cone, the coarser the shadow.

## Redrawing less often

By default, every shadow map redraws every frame, even while nothing in it moves. [`shadow.update`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#update) sets how often it redraws:

- A number `N` redraws every Nth frame.
- `'manual'` draws once, then again each time you call [`refreshShadows`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html#refreshshadows).
- With cascades, an array gives each cascade its own rate.

```ts
sun.shadow.update = [1, 2, 8]; // the nearest cascade every frame, the farthest every 8th

lamp.shadow.update = 'manual';
// ...later, after the furniture moves:
lamp.refreshShadows();
```

Until a light redraws, its shadow doesn't change, even when a caster moves or the light moves or turns. With cascades, the same holds when the camera moves. Changing the light's `bounds`, `cascades`, `maxDistance`, `lambda` or `normalBias` also needs a redraw, as does changing a spot light's `coneAngle` or `range`.

With `'manual'`, also call `refreshShadows` after any light changes its cascades or starts or stops casting a shadow, such as when you hide, show, add or remove it. That includes the `'manual'` light itself.

## Fixing shadow acne and floating shadows

A shadow map holds one depth per pixel, so a surface can end up shadowing itself. Two settings, [`bias`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#bias) and [`normalBias`](https://3d.pixijs.download/v0.1.0/docs/scene.LightShadow.html#normalbias), push the lookup off the surface:

- **Shadow acne** is stripes or speckles of shadow across lit surfaces. Raise `bias`, a small depth offset, or `normalBias`, which moves each point out along its normal before the lookup. A normal is the direction a surface faces.
- **Peter-panning** is a shadow that starts a little away from its caster, so the caster seems to float. Too much bias causes it, so lower what you raised.

Leave both at their defaults until you see one of these. In [Shadows](https://pixijs.com/3d/examples?example=shadows_basics), setting both to 0 shows acne, and a `bias` of 0.02 or more lifts the sphere's shadow away from the sphere.

## Shadow map limit

Shadows from all of a view's [`lights`](https://3d.pixijs.download/v0.1.0/docs/scene.Light.html) share 16 shadow maps. Each spot light and each directional light without cascades takes one, and a cascaded light takes one per cascade. Lights take maps in the order they joined the scene, and a hidden light takes none. A light that doesn't fit still lights the scene, but without its shadow, and you get a warning.

## Next steps

- [Lights](https://pixijs.com/3d/guides/components/scene-objects/lights.md): the kinds of light, and how many a view draws.
- [Performance](https://pixijs.com/3d/guides/concepts/performance.md#checklist-for-phones): the shadow settings that matter most on phones.
- [Batched meshes](https://pixijs.com/3d/guides/components/scene-objects/batched-mesh.md#shadows): shadow casters by the thousand.
