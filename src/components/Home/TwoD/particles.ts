import { Particle, ParticleContainer, Texture } from 'pixi.js';
import { createStageApp, loadSprites, seeded } from '../StageDemo/scenes/core';

import type { StageTheme } from '../StageDemo/scenes/core';
import type { FederatedPointerEvent } from 'pixi.js';

/**
 * The `/2d` performance field: bunnies in a spiral galaxy, all in one `ParticleContainer`. With motion on it starts
 * small and keeps adding bunnies while the frame rate holds, so the count it reports is what this device draws at
 * full speed; a tap adds a burst more. With motion off it renders one still pose.
 */

export interface FieldStats {
  count: number;
  /** `null` while the field is still */
  fps: number | null;
}

export interface FieldOptions {
  theme: StageTheme;
  motion: boolean;
  /** A touch screen: lower caps and smaller bursts */
  coarse: boolean;
  onStats: (stats: FieldStats) => void;
}

export interface ParticleField {
  /** On screen and the page visible: run the ticker */
  setActive(active: boolean): void;
  setTheme(theme: StageTheme): void;
  setMotion(motion: boolean): void;
  destroy(): void;
}

const ARMS = 3;
/** How far an arm turns from the core to the rim, in radians */
const TWIST = 4.6;
/** Rotation bands: each turns at its own pace, which sways the arms without winding them up */
const BANDS = 16;
const SPIN = 0.09;
const SETTLE_SECONDS = 1.4;
const STILL_TIME = 6;
const LIMITS = {
  fine: { start: 6000, auto: 160_000, max: 400_000, burst: 20_000, still: 24_000 },
  coarse: { start: 3000, auto: 40_000, max: 80_000, burst: 5000, still: 12_000 },
};
/** Frame rate the field grows at, and the one it stops growing below */
const FPS = { grow: 56, stop: 48 };
const PUSH = { radius: 110, strength: 2.4, decay: 0.9 };

/**
 * On dark the bunnies add up into light, so a dense core glows and the sparse rim shows single bunnies; on light they
 * lay down like ink. Either way the field fades as it fills (`density`), so a hundred thousand reads as a galaxy.
 */
const TINTS: Record<StageTheme, { stops: number[]; alpha: number; blend: 'add' | 'normal' }> = {
  dark: { stops: [0xffc4dc, 0xff4f93, 0x8b5cf6, 0x38bdf8], alpha: 0.5, blend: 'add' },
  light: { stops: [0xe91e63, 0xc2185b, 0x7c3aed, 0x0284c7], alpha: 0.75, blend: 'normal' },
};
/** The count at which the field starts to fade, and how faint it gets */
const DENSITY = { full: 4000, floor: 0.05 };

/**
 * The bunny in greys, so a tint sets its colour instead of darkening its tan: light where it's light, with its
 * outline and eyes kept dark enough to read at a few pixels
 */
function greyBunny(texture: Texture): Texture {
  const { frame } = texture;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) return texture;
  canvas.width = frame.width;
  canvas.height = frame.height;
  context.drawImage(
    texture.source.resource as CanvasImageSource,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    0,
    0,
    frame.width,
    frame.height,
  );
  const image = context.getImageData(0, 0, frame.width, frame.height);
  const { data } = image;

  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
    const grey = 255 * Math.min(1, 0.2 + lum * 1.25);

    data[i] = data[i + 1] = data[i + 2] = grey;
  }
  context.putImageData(image, 0, 0);

  return Texture.from(canvas);
}

function mix(a: number, b: number, t: number): number {
  const channel = (shift: number) => {
    const from = (a >> shift) & 255;

    return Math.round(from + (((b >> shift) & 255) - from) * t) << shift;
  };

  return channel(16) | channel(8) | channel(0);
}

function tintAt(stops: number[], r: number): number {
  const at = Math.min(r, 0.999) * (stops.length - 1);
  const i = Math.floor(at);

  return mix(stops[i], stops[i + 1], at - i);
}

/** Two uniform randoms to one normal one (Box-Muller) */
function gauss(random: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
}

export async function createField(host: HTMLElement, options: FieldOptions): Promise<ParticleField> {
  const { app, unobserve } = await createStageApp(host);
  const bunny = greyBunny((await loadSprites()).bunny);
  const limits = options.coarse ? LIMITS.coarse : LIMITS.fine;
  const random = seeded(11);

  let theme = options.theme;
  let motion = options.motion;
  let time = STILL_TIME;
  let cap = limits.auto;
  let count = 0;
  let settled = 0;
  let pointer: { x: number; y: number } | null = null;
  let stir = 0;
  let slow = 0;
  let frames = 0;
  /** The last half second's frame rate, `null` until there is one and while the field is still */
  let fps: number | null = null;
  let windowAt = 0;
  let runningSince = 0;
  let pending = 0;
  /** The field's alpha for its count, which it eases to while moving, so a burst never steps the brightness */
  let fade = 1;

  /** Orbit in unit space, before the band's rotation and the ellipse */
  const orbitX = new Float32Array(limits.max);
  const orbitY = new Float32Array(limits.max);
  const radius = new Float32Array(limits.max);
  const band = new Uint8Array(limits.max);
  const fromX = new Float32Array(limits.max);
  const fromY = new Float32Array(limits.max);
  const born = new Float32Array(limits.max);
  const pushX = new Float32Array(limits.max);
  const pushY = new Float32Array(limits.max);
  const cos = new Float32Array(BANDS);
  const sin = new Float32Array(BANDS);

  const field = new ParticleContainer<Particle>({
    texture: bunny,
    dynamicProperties: { position: true, vertex: false, rotation: false, uvs: false, color: false },
  });

  // The renderer keeps `screen` in step with the card, so the field never measures its own bounds
  field.boundsArea = app.screen;
  app.stage.addChild(field);
  app.canvas.style.touchAction = 'pan-y';
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  const ellipse = () => {
    const { width, height } = app.screen;

    return { cx: width / 2, cy: height / 2, rx: width * 0.47, ry: height * 0.46 };
  };

  function color(particle: Particle, r: number) {
    const tint = TINTS[theme];

    particle.tint = tintAt(tint.stops, r);
    particle.alpha = tint.alpha * (1 - r * 0.6);
  }

  /** Adds `amount` bunnies, flying out from (`x`, `y`) to their places in the arms */
  function add(amount: number, x: number, y: number) {
    const total = Math.min(count + amount, limits.max);

    for (let i = count; i < total; i++) {
      const kind = random();
      const loose = kind < 0.24;
      const r = kind < 0.16 ? Math.min(Math.abs(gauss(random)) * 0.13, 1) : 0.04 + random() ** 0.8 * 0.96;
      const spread = loose ? Math.PI * 2 * random() : gauss(random) * (0.07 + r * 0.22);
      const angle = ((i % ARMS) * Math.PI * 2) / ARMS + r * TWIST + spread;
      const scale = (0.07 + random() * 0.08) * (loose ? 0.8 : 1);
      const particle = new Particle({ texture: bunny, anchorX: 0.5, anchorY: 0.5, scaleX: scale, scaleY: scale });

      color(particle, r);
      orbitX[i] = Math.cos(angle) * r;
      orbitY[i] = Math.sin(angle) * r;
      radius[i] = r;
      band[i] = Math.min(BANDS - 1, Math.floor(r * BANDS));
      fromX[i] = x + gauss(random) * 24;
      fromY[i] = y + gauss(random) * 24;
      born[i] = motion ? time + random() * 0.8 : time - SETTLE_SECONDS;
      field.particleChildren.push(particle);
    }
    count = total;
    fade = Math.max(DENSITY.floor, Math.min(1, (DENSITY.full / count) ** 0.75));
    field.update();
    options.onStats({ count, fps });
  }

  function layout() {
    const { cx, cy, rx, ry } = ellipse();

    for (let k = 0; k < BANDS; k++) {
      const r = (k + 0.5) / BANDS;
      const angle = time * SPIN + (1 - r) * 0.5 * Math.sin(time * 0.3 + r * 2);

      cos[k] = Math.cos(angle);
      sin[k] = Math.sin(angle);
    }
    const stirring = stir > 0.002;
    const { radius: reach, strength } = PUSH;
    const particles = field.particleChildren;

    for (let i = 0; i < count; i++) {
      const k = band[i];
      let x = cx + (orbitX[i] * cos[k] - orbitY[i] * sin[k]) * rx;
      let y = cy + (orbitX[i] * sin[k] + orbitY[i] * cos[k]) * ry;

      if (i >= settled) {
        const t = (time - born[i]) / SETTLE_SECONDS;

        if (t >= 1 && i === settled) settled++;
        else if (t < 1) {
          const ease = 1 - (1 - Math.max(t, 0)) ** 3;

          x = fromX[i] + (x - fromX[i]) * ease;
          y = fromY[i] + (y - fromY[i]) * ease;
        }
      }
      if (stirring) {
        if (pointer) {
          const dx = x + pushX[i] - pointer.x;
          const dy = y + pushY[i] - pointer.y;
          const d = dx * dx + dy * dy;

          if (d < reach * reach && d > 1) {
            const push = (1 - Math.sqrt(d) / reach) * strength;

            pushX[i] += dx * push * 0.1;
            pushY[i] += dy * push * 0.1;
          }
        }
        pushX[i] *= PUSH.decay;
        pushY[i] *= PUSH.decay;
        x += pushX[i];
        y += pushY[i];
      }
      particles[i].x = x;
      particles[i].y = y;
    }
    if (!stirring && stir) {
      stir = 0;
      pushX.fill(0);
      pushY.fill(0);
    }
  }

  /** Grows the field while the frame rate holds, and stops for good once it doesn't */
  function adapt(fps: number) {
    if (fps < FPS.stop) {
      slow++;
      if (slow >= 3) cap = count;
    } else slow = 0;
    if (fps >= FPS.grow && count < cap) {
      const { cx, cy } = ellipse();

      add(Math.min(cap - count, Math.max(4000, Math.round(count * 0.18))), cx, cy);
    }
  }

  function render() {
    layout();
    app.render();
  }

  function invalidate() {
    if (motion || pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      render();
    });
  }

  function retheme() {
    field.blendMode = TINTS[theme].blend;
    field.particleChildren.forEach((particle, i) => color(particle, radius[i]));
    field.update();
  }

  // The frame rate over half a second at a time: the ticker's own is the last frame's alone
  app.ticker.add((ticker) => {
    const now = performance.now();
    const step = Math.min(ticker.deltaMS, 50) / 1000;

    time += step;
    field.alpha += (fade - field.alpha) * Math.min(1, step * 3);
    stir *= PUSH.decay;
    if (pointer) stir = 1;
    frames++;
    if (now - windowAt >= 500) {
      fps = Math.round((frames * 1000) / (now - windowAt));
      frames = 0;
      windowAt = now;
      if (now - runningSince > 1200) adapt(fps);
      options.onStats({ count, fps });
    }
    layout();
  });
  app.renderer.on('resize', invalidate);
  app.stage.on('pointermove', (event: FederatedPointerEvent) => {
    if (motion) pointer = { x: event.global.x, y: event.global.y };
  });
  app.stage.on('pointertap', (event: FederatedPointerEvent) => {
    if (!motion) return;
    cap = Math.max(cap, Math.min(count + limits.burst, limits.max));
    add(limits.burst, event.global.x, event.global.y);
  });
  for (const type of ['pointerleave', 'pointercancel']) {
    app.canvas.addEventListener(type, () => (pointer = null));
  }

  function start() {
    runningSince = windowAt = performance.now();
    frames = 0;
    app.ticker.start();
  }

  function applyMotion() {
    if (motion) {
      start();

      return;
    }
    app.ticker.stop();
    pointer = null;
    time = STILL_TIME;
    if (count < limits.still) {
      const { cx, cy } = ellipse();

      add(limits.still - count, cx, cy);
    }
    settled = count;
    field.alpha = fade;
    fps = null;
    options.onStats({ count, fps });
    invalidate();
  }

  retheme();
  if (motion) {
    const { cx, cy } = ellipse();

    time = 0;
    add(limits.start, cx, cy);
  }
  render();
  applyMotion();

  return {
    setActive(active) {
      if (!motion) return;
      if (active) start();
      else app.ticker.stop();
    },
    setTheme(next) {
      theme = next;
      retheme();
      invalidate();
    },
    setMotion(next) {
      if (next === motion) return;
      motion = next;
      applyMotion();
    },
    destroy() {
      cancelAnimationFrame(pending);
      unobserve();
      app.destroy({ removeView: true }, { children: true });
      bunny.destroy(true);
    },
  };
}
