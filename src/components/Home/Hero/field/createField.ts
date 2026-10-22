import { Container3D, DirectionalLight, Mesh3D, View3D } from '@pixi/3d';
import { Application } from 'pixi.js';
import { heightAt } from '../posterShapes';
import { createBackdrop } from './backdrop';
import {
  createBunnyGeometry,
  createBunnyMaterial,
  createClayGeometries,
  createClayMaterial,
  KEY_DIRECTION,
  lightClay,
  PALETTES,
} from './clay';
import { createBodies, KIND_SCALE, MID_DIST, reachOnScreen } from './kinds';
import { stepField } from './physics';
import { createShadows } from './shadows';
import '@pixi/3d/webgl';
import '@site/src/utils/pixi3dCompat';

import type { Geometry3D, Material3D } from '@pixi/3d';
import type { FieldTheme } from './clay';
import type { ImageTint, ShapeBody, ShapeKind, ShapeSeed, ShapeTint } from './kinds';
import type { Guard } from './physics';

export type { FieldTheme, ShapeSeed };

/** What the shapes keep clear of, in the host's pixels */
export interface FieldBounds {
  /** The copy's lines and blocks, the hero's controls and the top bar's pieces */
  rects: readonly DOMRectReadOnly[];
  /** A bar across the whole of the host's top edge, and the wave rising into its bottom edge */
  top: number;
  bottom: number;
}

export interface FieldOptions {
  theme: FieldTheme;
  /** The shapes, where the poster has them; each waits for {@link Field.intro} to take over from its image */
  seeds: readonly ShapeSeed[];
  bounds: FieldBounds;
  /** The browser took the WebGL context away: nothing more will draw, and the field is ready to be destroyed */
  onLost(): void;
}

export interface Field {
  setTheme(theme: FieldTheme): void;
  /** Runs or stops the ticker: on screen, page visible and motion not paused */
  setActive(active: boolean): void;
  /** Pointer position in the host's own pixels; far outside the host counts as no pointer */
  setPointer(x: number, y: number): void;
  /** How far the page has scrolled the host up, in pixels: near shapes ride up ahead of it and far ones lag */
  setScroll(offset: number): void;
  /** A puff rippling out from the origin, 0-1 through it, the nearest shape first; driven by a GSAP tween */
  setPuff(progress: number): void;
  /** Where the next puff starts, in the host's pixels; set it while none is running */
  setOrigin(x: number, y: number): void;
  setBounds(bounds: FieldBounds): void;
  /** Moves each shape's place in the composition, and its size, to where the poster now has it */
  setHomes(seeds: readonly ShapeSeed[]): void;
  /**
   * Each shape takes over from its poster image with a small swell, staggered outward from the origin; `onShow`
   * hears each poster slot in the frame its shape first draws, so the page can drop the image in that same frame
   */
  intro(onShow: (slot: number) => void): void;
  readonly canvas: HTMLCanvasElement;
  destroy(): void;
}

/**
 * The lens: half its height, and half its width, whichever is reached first, so a wide hero doesn't stretch the
 * shapes at its sides. About the lens the clay images are rendered through (`scripts/render-clay.mjs`), so a shape
 * out at the hero's edge looks like its image rather than leaning out of it.
 */
const HALF_HEIGHT = Math.tan((11 * Math.PI) / 180);
const HALF_WIDTH = Math.tan((13 * Math.PI) / 180);
const KEY_DISTANCE = 16;

/**
 * Device pixels the canvas may fill. Every pixel pays for the backdrop and a multisampled 3D pass, so a laptop
 * hero gets its full 2x and a hero the size of a desktop monitor gets what the same budget leaves it.
 */
const PIXEL_BUDGET = 4.4e6;
/** Frames timed once the field has settled in, the ones skipped before them, and the mean above which it drops to 1x */
const PROBE_FRAMES = 45;
const PROBE_SKIP = 30;
const SLOW_FRAME = 20;

/** Smoothing on the pointer's own velocity, which shapes inherit a share of when it passes */
const POINTER_SMOOTHING = 0.35;
/** Distance past the hero at which the pointer stops counting as being over the field */
const POINTER_MARGIN = 160;
const POINTER_AWAY = -9e3;

/** How far the nearest shape leans away from the pointer, how fast the lean follows, and its share of the page's scroll */
const LOOK = 22;
const LOOK_RATE = 3.5;
const SCROLL_SHARE = 0.14;

/** How far a hard hit swells a shape for a moment */
const SQUASH_DEPTH = 0.35;

/**
 * A bunny the pointer lands on flattens back into its sprite, square on to the camera, and stays flat while the pointer
 * is on it and a moment after; then it pops back out, a little past its depth. Its depth at the flattest, the moment,
 * and the springs in and out.
 */
const FLAT_DEPTH = 0.05;
const FLAT_HOLD = 0.5;
const FLATTEN = { stiffness: 320, damping: 26 };
const POP = { stiffness: 160, damping: 9 };

/** The entrance spring (goodstuff's `crew.ts`), and the longest delay, for the shapes furthest out */
const APPEAR_STIFFNESS = 95;
const APPEAR_DAMPING = 9;
const APPEAR_STAGGER = 0.6;
/** The speed a shape swells at as it takes over from its poster image, at the image's own size: about 7% over */
const APPEAR_KICK = 1.2;

/**
 * The puff: the share of its progress the shapes' start times are spread over, so the nearest swells first and the
 * furthest last, each taking the rest of the run for its own; how far past the furthest shape its ring of light
 * carries before it has faded out; its swell, how much deeper than wide; and the shove it gives each shape away from
 * its origin, in px/s.
 */
const PUFF_SPREAD = 0.5;
const RIPPLE_REACH = 1.25;
const PUFF = 0.3;
const PUFF_DEPTH = 0.8;
const PUFF_SHOVE = 260;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
/** A damped wobble: 0 at both ends, a swell early on and a smaller dip after */
const wobble = (t: number): number => Math.sin(3 * Math.PI * t) * (1 - t) ** 2;

const resolutionFor = (width: number, height: number): number =>
  Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / Math.max(1, width * height))));

/**
 * Mounts the hero's floating primitives over `host` and returns the handles for everything the page
 * owns. The canvas is returned rather than appended, so the page can fade it in over its poster.
 *
 * The field is simulated in screen space: every shape is so many pixels of one kind with a velocity,
 * bouncing off the hero's edges and its neighbours at its own silhouette, pushed around by the pointer
 * and held off the copy (see {@link stepField}). Each frame that 2D state is projected onto the meshes:
 * the screen position unprojects to a world point at the shape's depth and its pixel radius becomes a
 * uniform scale, which keeps the composition identical at any viewport. Each shape is also turned to face
 * the camera from wherever it stands, so it shows the pose its clay image shows, and drops a soft shadow
 * that lengthens with its height. The near shapes lean away from the pointer and ride ahead of the scroll,
 * and the far ones lag.
 */
export async function createField(host: HTMLElement, { theme, seeds, bounds, onLost }: FieldOptions): Promise<Field> {
  const app = new Application();

  await app.init({
    resizeTo: host,
    // WebGL only: WebGPU's adapter request has no timeout and can stall for over a minute while
    // another tab holds a device. An array, so a missing WebGL rejects instead of falling through.
    preference: ['webgl'],
    // The field needs no accessibility, DOM, events or filters, which pixi's default imports would fetch,
    // and the 3D WebGL backend comes in with the import above rather than as one more chunk after init.
    skipExtensionImports: true,
    // Opaque, painted with the hero's own floor, so nothing behind the canvas shows through it.
    backgroundAlpha: 1,
    backgroundColor: PALETTES[theme].floorColor,
    antialias: true,
    resolution: resolutionFor(host.clientWidth, host.clientHeight),
    autoDensity: true,
  });

  const geometries: Record<ShapeKind, Geometry3D> = { ...createClayGeometries(), bunny: createBunnyGeometry() };
  const view3d = new View3D({ autoResize: true, toneMapping: 'aces', environment: PALETTES[theme].environment });
  const key = new DirectionalLight();

  key.position.set(
    -KEY_DIRECTION.x * KEY_DISTANCE,
    -KEY_DIRECTION.y * KEY_DISTANCE,
    -MID_DIST - KEY_DIRECTION.z * KEY_DISTANCE,
  );
  key.lookAt({ x: 0, y: 0, z: -MID_DIST });
  view3d.root.addChild(key);

  const bodies = createBodies(seeds);
  // One material per tint, and the bunny's, which wears its sprite
  const materials = new Map<ShapeTint | 'bunny', Material3D>();
  const materialOf = ({ kind, tint }: ShapeBody): Material3D => {
    const name = kind === 'bunny' ? kind : tint;
    // Kind and tint are separate fields, so a clay kind doesn't narrow its tint to the image tints
    const material =
      materials.get(name) ?? (kind === 'bunny' ? createBunnyMaterial() : createClayMaterial(tint as ImageTint));

    materials.set(name, material);

    return material;
  };
  const holders = bodies.map((body) => {
    const holder = new Container3D({ visible: false });

    holder.addChild(new Mesh3D({ geometry: geometries[body.kind], material: materialOf(body) }));
    view3d.root.addChild(holder);

    return holder;
  });
  const puffed = bodies.map(() => false);
  const appear = bodies.map(() => ({ value: 0, velocity: 0, delay: 0 }));
  /** How flat each bunny is, 0 its full depth and 1 its sprite, and until when it stays flat */
  const flats = bodies.map(() => ({ value: 0, velocity: 0, until: -1 }));
  const bunnies = bodies.flatMap((body, index) => (body.kind === 'bunny' ? [{ body, state: flats[index] }] : []));
  let introAt = Infinity;
  let shown: ((slot: number) => void) | undefined;

  const backdrop = createBackdrop(theme);
  const shadows = createShadows(
    bodies.map((body) => body.kind),
    theme,
  );

  app.stage.addChild(backdrop.view, shadows.view, view3d);

  const pointer = { x: POINTER_AWAY, y: POINTER_AWAY, vx: 0, vy: 0 };
  /** Where the viewer is looking from, -1 to 1 either way of the middle, eased toward the pointer */
  const look = { x: 0, y: 0 };
  let scroll = 0;
  let lastSample = 0;
  const guard: Guard = { rects: [], top: 0, bottom: 0 };
  const setBounds = ({ rects, top, bottom }: FieldBounds): void => {
    guard.top = top;
    guard.bottom = bottom;
    guard.rects = rects.map((rect) => ({
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      hx: rect.width / 2,
      hy: rect.height / 2,
    }));
  };

  setBounds(bounds);

  const origin = { x: 0, y: 0, reach: 1 };
  const setOrigin = (x: number, y: number): void => {
    const reach = Math.max(...bodies.map((body) => Math.hypot(body.x - x, body.y - y)), 1);

    Object.assign(origin, { x, y, reach });
    for (const body of bodies) body.wave = Math.hypot(body.x - x, body.y - y) / reach;
  };

  let puff = 0;
  let elapsed = 0;

  setOrigin(app.screen.width / 2, app.screen.height / 2);

  /** Where a shape is drawn: its own centre, off the middle of its image, leaning from the pointer and riding the scroll */
  const drawnX = (body: ShapeBody): number => body.x + body.offsetX * body.radius - look.x * body.depth * LOOK;
  const drawnY = (body: ShapeBody): number =>
    body.y + body.offsetY * body.radius - (look.y * LOOK + scroll * SCROLL_SHARE) * body.depth;

  // What the backdrop was last drawn from, so a still frame isn't rebuilt to draw the identical image
  const drawn = { elapsed: -1, width: -1, height: -1, lookX: 0, lookY: 0 };

  const draw = (): void => {
    const { width, height } = app.screen;
    const aspect = width / height;
    const tan = Math.min(HALF_HEIGHT, HALF_WIDTH / aspect);
    const fov = (Math.atan(tan) * 360) / Math.PI;
    const puffing = puff > 0 && puff < 1;
    // The puff's ring of light reaches each shape just as it starts to swell, and fades out past the furthest
    const front = puff / PUFF_SPREAD;

    if (view3d.camera.fov !== fov) view3d.camera.fov = fov;
    backdrop.setRipple(
      origin.x,
      origin.y,
      front * origin.reach,
      puffing ? Math.sin(Math.PI * clamp01(front / RIPPLE_REACH)) : 0,
    );

    for (let index = 0; index < bodies.length; index++) {
      const body = bodies[index];
      const holder = holders[index];
      const size = appear[index].value;
      const reached = puffing && puff > body.wave * PUFF_SPREAD;
      const swell = reached ? wobble(clamp01((puff - body.wave * PUFF_SPREAD) / (1 - PUFF_SPREAD))) : 0;

      // The front shoves each shape outward as it arrives, once
      if (reached && !puffed[index]) {
        const dx = body.x - origin.x;
        const dy = body.y - origin.y;
        const away = Math.hypot(dx, dy) || 1;

        body.vx += (dx / away) * PUFF_SHOVE;
        body.vy += (dy / away) * PUFF_SHOVE;
      }
      puffed[index] = reached;

      holder.visible = size > 0.001;
      if (!holder.visible) {
        shadows.cast(index, 0, 0, 0, 0, 0, 0);
        continue;
      }

      const mesh = holder.children[0];
      const halfHeight = tan * body.dist;
      const radius = (body.radius / (1 - body.squash * SQUASH_DEPTH)) * size * (1 + swell * PUFF);
      const scale = (radius / (height / 2)) * halfHeight;
      const kind = KIND_SCALE[body.kind];
      const flat = flats[index].value;
      const x = drawnX(body);
      const y = drawnY(body);
      const viewX = ((x / width) * 2 - 1) * tan * aspect;
      const viewY = (1 - (y / height) * 2) * tan;
      const facePitch = Math.atan(viewY);

      holder.position.set(viewX * body.dist, viewY * body.dist, -body.dist);
      // Rolled in the screen plane, then turned to face the camera from where it stands
      holder.rotation.set(facePitch, -Math.atan(viewX * Math.cos(facePitch)), body.angle);
      holder.scale.set(1, 1, 1 + swell * PUFF * PUFF_DEPTH);
      mesh.scale.set(scale * kind.x, scale * kind.y, scale * kind.z * (1 - (1 - FLAT_DEPTH) * flat));
      mesh.rotation.set(body.pitch * (1 - flat), body.yaw * (1 - flat), 0);
      shadows.cast(index, x, y, radius, body.size, body.angle, heightAt(body.depth) * size);
    }

    if (
      drawn.elapsed !== elapsed ||
      drawn.width !== width ||
      drawn.height !== height ||
      drawn.lookX !== look.x ||
      drawn.lookY !== look.y
    ) {
      backdrop.update(elapsed, width, height, look.x, look.y);
      Object.assign(drawn, { elapsed, width, height, lookX: look.x, lookY: look.y });
    }
  };

  // A canvas that can't hold a frame at its resolution renders at 1x from then on
  let slow = false;
  let probe: { skip: number; frames: number; total: number } | undefined;
  const fit = (): void => {
    const next = slow ? 1 : resolutionFor(host.clientWidth, host.clientHeight);

    if (Math.abs(next - app.renderer.resolution) > 0.05) app.renderer.resolution = next;
    app.resize();
  };

  const tick = (): void => {
    const dt = Math.min(app.ticker.deltaMS, 33.4) / 1000;
    const { width, height } = app.screen;
    const over = pointer.x > POINTER_AWAY;
    const follow = 1 - Math.exp(-dt * LOOK_RATE);

    elapsed += dt;
    stepField(bodies, dt, elapsed, width, height, guard, pointer);
    // Sampled velocity decays between moves, or a shape keeps riding a flick long since finished
    pointer.vx *= Math.exp(-dt * 6);
    pointer.vy *= Math.exp(-dt * 6);
    look.x += ((over ? Math.min(1, Math.max(-1, (pointer.x / width) * 2 - 1)) : 0) - look.x) * follow;
    look.y += ((over ? Math.min(1, Math.max(-1, (pointer.y / height) * 2 - 1)) : 0) - look.y) * follow;

    for (const { body, state } of bunnies) {
      const dx = pointer.x - drawnX(body);
      const dy = pointer.y - drawnY(body);
      const distance = Math.hypot(dx, dy) || 1;

      if (distance < body.radius * reachOnScreen(body.kind, body.right, body.up, dx / distance, dy / distance)) {
        state.until = elapsed + FLAT_HOLD;
      }
      const flattening = elapsed < state.until;
      const { stiffness, damping } = flattening ? FLATTEN : POP;

      state.velocity += (stiffness * (Number(flattening) - state.value) - damping * state.velocity) * dt;
      state.value += state.velocity * dt;
    }

    appear.forEach((state, index) => {
      if (elapsed < introAt + state.delay) return;
      if (state.value === 0) {
        Object.assign(state, { value: 1, velocity: APPEAR_KICK });
        shown?.(bodies[index].slot);
      }
      state.velocity += (APPEAR_STIFFNESS * (1 - state.value) - APPEAR_DAMPING * state.velocity) * dt;
      state.value += state.velocity * dt;
    });

    if (probe && probe.skip-- <= 0) {
      probe.total += app.ticker.deltaMS;
      if (++probe.frames === PROBE_FRAMES) {
        slow = probe.total / PROBE_FRAMES > SLOW_FRAME;
        probe = undefined;
        if (slow) fit();
      }
    }

    draw();
  };

  // A stopped ticker still has to show a theme, puff or guard change, once
  let pending = 0;
  let wanted = false;
  let lost = false;

  const redraw = (): void => {
    if (app.ticker.started || pending || lost) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      draw();
      app.render();
    });
  };

  const setTheme = (next: FieldTheme): void => {
    app.renderer.background.color = PALETTES[next].floorColor;
    lightClay(view3d, key, next, [...materials.values()]);
    backdrop.setTheme(next);
    shadows.setTheme(next);
    redraw();
  };

  setTheme(theme);

  app.ticker.add(tick);
  // Drawn once before resolving, so a canvas revealed on this promise is never blank
  draw();
  app.render();

  // `resizeTo` only watches the window, but the hero's box also changes as the copy reflows
  const trackHostSize = new ResizeObserver(() => {
    fit();
    redraw();
  });

  trackHostSize.observe(host);
  // destroy() loses the context itself, after the ticker is gone
  const listening = new AbortController();

  // pixi.js throws compiling a shader while the browser holds the WebGL context, and what comes back with a
  // restored one has lost its lighting, so the field stops for good and the page starts another
  app.canvas.addEventListener(
    'webglcontextlost',
    () => {
      lost = true;
      app.ticker.stop();
      onLost();
    },
    { signal: listening.signal },
  );

  return {
    canvas: app.canvas,
    setTheme,
    setActive(active: boolean) {
      wanted = active && !lost;
      if (wanted) {
        if (!app.ticker.started && !slow) probe = { skip: PROBE_SKIP, frames: 0, total: 0 };
        app.ticker.start();

        return;
      }
      app.ticker.stop();
      probe = undefined;
      // A stopped field never finishes its entrance, so it lands every shape where it was headed
      if (introAt !== Infinity) {
        appear.forEach((state, index) => {
          if (state.value === 0) shown?.(bodies[index].slot);
          Object.assign(state, { value: 1, velocity: 0 });
        });
      }
      // and draws whatever it was last told, which the running ticker had left to its next frame
      redraw();
    },
    setPointer(x: number, y: number) {
      const { width, height } = app.screen;

      if (!width || !height) return;
      if (y < -POINTER_MARGIN || y > height + POINTER_MARGIN || x < -POINTER_MARGIN || x > width + POINTER_MARGIN) {
        Object.assign(pointer, { x: POINTER_AWAY, y: POINTER_AWAY, vx: 0, vy: 0 });
        lastSample = 0;

        return;
      }

      const now = performance.now();
      const gap = lastSample ? Math.max((now - lastSample) / 1000, 0.006) : 0;

      // Velocity counts only against a previous sample; the first move back in would read as a flick
      if (gap) {
        pointer.vx += ((x - pointer.x) / gap - pointer.vx) * POINTER_SMOOTHING;
        pointer.vy += ((y - pointer.y) / gap - pointer.vy) * POINTER_SMOOTHING;
      }
      pointer.x = x;
      pointer.y = y;
      lastSample = now;
    },
    setScroll(offset: number) {
      scroll = offset;
    },
    setPuff(progress: number) {
      puff = progress;
      redraw();
    },
    setOrigin,
    setBounds(next: FieldBounds) {
      setBounds(next);
      redraw();
    },
    setHomes(next: readonly ShapeSeed[]) {
      for (const seed of next) {
        const body = bodies.find(({ slot }) => slot === seed.slot);

        if (!body) continue;
        body.homeX = seed.x;
        body.homeY = seed.y;
        body.size = seed.size;
        body.radius = seed.size * body.perPixel;
      }
      redraw();
    },
    intro(onShow) {
      bodies.forEach((body, index) => {
        appear[index].delay = body.wave * APPEAR_STAGGER;
      });
      introAt = elapsed;
      shown = onShow;
    },
    destroy() {
      listening.abort();
      cancelAnimationFrame(pending);
      app.ticker.remove(tick);
      trackHostSize.disconnect();
      // The renderer first: its shaders are still bound to the textures the backdrop and the shadows own
      app.destroy({ removeView: true }, { children: true });
      backdrop.destroy();
      shadows.destroy();
      for (const material of materials.values()) material.destroy(true);
      for (const geometry of Object.values(geometries)) geometry.destroy();
    },
  };
}
