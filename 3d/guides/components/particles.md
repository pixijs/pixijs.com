# Particles

A particle is a small flat card, such as a spark or a snowflake, that turns to face the camera [`by default`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#billboard). PixiJS 3D draws particles two ways:

- [`ParticleSystem3D`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html), from `@pixi/3d/extras`, emits particles and moves them on its own, as its options describe.
- [`ParticleContainer3D`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html), from `@pixi/3d`, draws particles where your code puts them. A particle system is a particle container with the behaviour built in.

Each draws all its particles in one draw call.

## A particle system

This system makes a campfire's flames:

```ts
import { ConeShape, ParticleSystem3D } from '@pixi/3d/extras';
import { Texture } from 'pixi.js';

// A soft white dot, drawn on a canvas
const canvas = document.createElement('canvas');

canvas.width = canvas.height = 128;
const context = canvas.getContext('2d')!;
const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);

gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.22, 'rgba(255,255,255,0.55)');
gradient.addColorStop(1, 'rgba(255,255,255,0)');
context.fillStyle = gradient;
context.fillRect(0, 0, 128, 128);

const dot = Texture.from(canvas);

const flames = new ParticleSystem3D({
  texture: dot,
  blendMode: 'add',
  billboard: 'cylindrical',
  capacity: 120, // emitRate times the longest life, 110 × 1, rounded up
  emitRate: 110,
  shape: new ConeShape({ angle: 12, radius: 0.22 }),
  life: [0.5, 1],
  speed: [1.5, 2.3],
  size: [0.5, 0.85],
  sizeEnd: [0.05, 0.2],
  alpha: 0.7,
  alphaEnd: 0,
  color: 0xffd98a,
  colorEnd: 0xd12b06,
  drag: 1.6,
});

flames.position.y = 0.2;
view3d.root.addChild(flames);
```

A system starts emitting as soon as you create it and updates itself every frame. Add it under [`view3d.root`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html#root) to see it. Leave out [`texture`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#texture) and each particle is a solid square of its `color`.

[Particle system](https://pixijs.com/3d/examples?example=particles_basics) changes a running system's rate, shape, gravity and drag from a panel.

A system has a fixed number of slots, one per particle. That number is its [`capacity`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#capacity). The system fills the slots in turn, so once it has used them all, a new particle takes the oldest particle's slot, even if that particle is still alive. Make the capacity big enough to hold every particle born within the longest `life`, or particles vanish early. For a steady stream, that's about `emitRate` times the longest `life`. Don't go far past it, because the GPU works on every slot each frame, live or empty, and the view draws a system even when it's off screen.

## Options

[`ParticleSystem3DOptions`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3DOptions.html) lists every option. Numbers set per particle, such as `life`, `size` and `speed`, take one value or a `[min, max]` range. Each particle picks a value from the range when it's born. `color` and `colorEnd` take one colour each.

- **Where they start.** `shape` sets where each particle starts and which way it moves. It's a [`PointShape`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.PointShape.html) by default. Use a [`ConeShape`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ConeShape.html) for flames and smoke, a [`SphereShape`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.SphereShape.html) for bursts, a [`BoxShape`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.BoxShape.html) for snow, or your own [`EmitterShape`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.EmitterShape.html). The point, cone and box send particles up, so rotate the system to aim them another way.
- **How they move.** `speed` is how fast particles leave along the shape's direction. It's 0 by default, so without `speed` or `gravity`, particles stay where they're born. A positive number for `gravity` pulls particles down, and a negative one lifts them. An `{ x, y, z }` value sets the acceleration directly, so `gravity: 9.8` is the same as `{ x: 0, y: -9.8, z: 0 }`. `drag` slows particles down.
- **How they change.** `sizeEnd`, `alphaEnd` and `colorEnd` set the value each particle reaches at the end of its life, and `spin` rotates it. Leave one out and the particle keeps its starting value. Each one you set adds work to the shader, so set only what the effect needs.
- **How they look.** `color` multiplies the texture, as a 2D tint does, so draw the sprite white and colour it here. A `blendMode` of `'add'` brightens what's behind, so overlapping flames add up to a brighter glow. A `billboard` of `'cylindrical'` keeps flames upright as the camera tilts. They get thinner the further the camera looks down, and vanish when it looks straight down. A `billboard` of `'horizontal'` lays particles flat on the ground, for rings. Pass `texture` an array of frames from one sprite sheet and each particle gets a random frame by default. Set [`frameMode`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3DOptions.html#framemode) to `'animate'` or `'overLife'` to play the frames as a flipbook. A flipbook needs the frames laid out as a grid of equal cells, left to right from the top left. With a packed atlas, a flipbook can play the wrong cells.

`size` is a diameter in world units, not pixels, and scaling the system doesn't change it. Particles are unlit. Lights don't reach them, and they don't cast or receive shadows.

[Fire and smoke](https://pixijs.com/3d/examples?example=particles_flipbook) shows the three billboard modes, the blend modes and flipbook frames on a campfire.

## Controlling a system

[`stop`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#stop) stops emitting and lets live particles finish their lives. [`play`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#play) starts emitting again. [`clear`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#clear) removes every live particle at once. You can change `emitRate` at any time, but size the capacity for the highest rate. You can change [`gravity`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#gravity) and [`drag`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#drag) too, but assign a new value. Editing `gravity.x` in place doesn't reach the particles. The system works out each particle's path from the moment that particle was born, so changing either one moves every particle already in the air, not only new ones.

[`spawn`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#spawn) emits particles right away, whether the system is playing or stopped. It can override some options for that batch, and takes `velocity` in place of `speed`. [`ParticleSpawnOverrides`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSpawnOverrides.html) lists which options. With `emitRate: 0`, a system emits only what you `spawn` and what its [`bursts`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3DOptions.html#bursts) release on a schedule. In the shooting gallery tutorial, confetti spawns where the player hits a target:

```ts
target.eventMode = 'static';
target.on('pointerdown', (e) => {
  if (e.hit3D) confetti.spawn(12, { position: e.hit3D.point, color: 0xffc93c });
});
```

`position` puts the batch at a point in the world, not at the system, so one system handles every hit.

A system updates on pixi's `Ticker.shared`, not your `app.ticker`, unless you create the app with `sharedTicker: true`. So pausing or slowing `app.ticker` doesn't pause or slow the particles. To keep a system in step with your game, create it with `autoUpdate: false` and call [`update`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#update) from your own loop. Setting `app.ticker.speed` to 0 then freezes the particles.

```ts
const smoke = new ParticleSystem3D({ ...smokeOptions, autoUpdate: false });

app.ticker.add((ticker) => smoke.update(ticker));
```

[`time`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#time) is the system's clock in seconds. Set it, forwards or backwards, to show any moment the slots still hold. Setting it doesn't emit particles. To scrub through time, turn off `autoUpdate`. Before you turn it back on, set `time` to the latest moment the system reached, or the particles born after the moment you picked show twice.

Give a system `createRandom: () => seededRandom('fireworks')` and it draws the same random values in the same order every run, so [`gotoAndPlay(0)`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#gotoandplay) replays the same burst. [`seededRandom`](https://3d.pixijs.download/v0.1.0/docs/maths.seededRandom.html) makes the generator.

[Bursts on demand](https://pixijs.com/3d/examples?example=particles_spawn) puts these calls on buttons, spawns where you tap and scrubs `time`.

## World and local space

By default a particle lives in world space. It starts wherever the system is when it's born and doesn't follow the system after that. Move a chimney and the smoke already in the air stays where it was.

With [`space: 'local'`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#space), particles move, rotate and scale with their system. Use it for effects such as a glow that follows a moving orb. Gravity then acts in the system's own space too, so in a system turned upside down it pulls particles up. Positions you write into a particle container or pass to `spawn` use the same space.

## Draw order

The particles in one system draw in slot order, not sorted by distance. With a [`blendMode`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#blendmode) of `'normal'`, a far particle drawn later covers a near one. `'add'`, `'screen'` and `'multiply'` look the same in any order. For hard-edged particles such as leaves, [`alphaMode: 'mask'`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#alphamode) cuts each one out along its texture's edge, so the nearer particle covers the farther one. When the view sorts a system against other blended meshes, it treats the system as one object at the system's position, wherever its particles have gone.

## Driving particles yourself

A [`ParticleContainer3D`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html) draws particles that something else moves, such as a physics engine or a recording. It has a fixed number of slots and no object per particle. Write each particle into its slot, then call [`upload`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#upload) once a frame:

```ts
import { packParticleColor, ParticleContainer3D } from '@pixi/3d';

const motes = new ParticleContainer3D({ texture: dot, capacity: 2000, blendMode: 'add' });
const tint = packParticleColor(0x66ff99, 1);

view3d.root.addChild(motes);

app.ticker.add(() => {
  for (let i = 0; i < count; i++) motes.writePacked(i, x[i], y[i], z[i], 0.1, 0, tint);
  motes.upload();
});
```

[`writePacked`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#writepacked) takes the tint and opacity packed into one number by [`packParticleColor`](https://3d.pixijs.download/v0.1.0/docs/scene.packParticleColor.html), so particles that share a tint pack it once. [`setParticleAt`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#setparticleat) takes them unpacked. A slot keeps drawing what you last wrote into it. So when fewer particles are left, write a size of 0 into the slots you stop using, or [`clear`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#clear) every slot first, as [Particle container](https://pixijs.com/3d/examples?example=particles_container) does when you change its count.

## Adding your own shader code

A system builds its shader from shader bits, small pieces of shader code, one for each behaviour. The [`extraBits`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3DOptions.html#extrabits) option adds your own, which run after the built-in ones. This one sways each particle from side to side:

```ts
import type { ShaderBit } from '@pixi/3d';
import { ParticleSystem3D } from '@pixi/3d/extras';

const sway = {
  name: 'sway',
  bindings: { material: { uSwayAmp: 'f32', uSwayFreq: 'f32' } },
  gpu: {
    vertex: { beforeTransform: /* wgsl */ `position.x += sin(particleAge * material.uSwayFreq) * material.uSwayAmp;` },
  },
  gl: {
    vertex: { beforeTransform: /* glsl */ `position.x += sin(particleAge * material.uSwayFreq) * material.uSwayAmp;` },
  },
} satisfies ShaderBit;

const snow = new ParticleSystem3D({ ...snowOptions, extraBits: [sway] });

snow.uniforms.uSwayAmp = 0.5;
snow.uniforms.uSwayFreq = 0.8;
```

Your shader code can read `particleAge`, in seconds, and `particleProgress`, which runs from 0 at birth to 1 at death. It can change `position`, which is in world space unless the system is local. It can also change `particleSize`, `particleRotation` and `particleColor`, which [`getParticleBit`](https://3d.pixijs.download/v0.1.0/docs/scene.getParticleBit.html) describes. Set the `material` values your bit declares through [`uniforms`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#uniforms). A vector takes an array, such as `[1, 0, 0]`. [Toon and custom materials](https://pixijs.com/3d/guides/components/materials/custom.md#adding-your-own-shader-code) shows how to write a bit.

[Custom particle behaviour](https://pixijs.com/3d/examples?example=particles_custom-bits) swirls sparks with a bit of its own.

## Cleaning up

[`destroy`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html#destroy) stops a system updating, removes it from the scene and frees what it created. It doesn't free the texture you gave it. [`ParticleContainer3D.destroy`](https://3d.pixijs.download/v0.1.0/docs/scene.ParticleContainer3D.html#destroy) lists the flags that do. Removing a system from the scene yourself doesn't stop it updating or emitting.

## Next steps

- [Post-processing](https://pixijs.com/3d/guides/components/post-processing.md#bloom): bloom, a glow around light brighter than white.
- [Interaction](https://pixijs.com/3d/guides/components/interaction.md#3d-event-fields): finding the point in the world where a click lands, to spawn particles there.
- [Choosing a node for many objects](https://pixijs.com/3d/guides/components/scene-objects.md#choosing-a-node-for-many-objects): when particles fit better than sprites or batched meshes.
