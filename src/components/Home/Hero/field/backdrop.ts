import { Container, Mesh, MeshGeometry, Sprite, Texture } from 'pixi.js';
import {
  blobPoints,
  blobs,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  RIM_REACH,
  SHADOW_GROW,
  SHADOW_OFFSET_Y,
  SPECK_DRIFT_X,
  SPECK_DRIFT_Y,
  speckAlpha,
  specks,
} from '../poster';

import type { FieldTheme } from './clay';

/** Keep in step with the `--blob-*` colours of `hero-backdrop` in `Band/_surface.scss` */
const BLOB_COLORS: Record<FieldTheme, readonly number[]> = {
  light: [0xefecf8, 0xeceaf6, 0xe7e4f2, 0xdedaee, 0xe4e1f1, 0xe1ddef],
  dark: [0x181822, 0x191923, 0x1b1a26, 0x1f1d2b, 0x1c1c28, 0x1e1c2b],
};
const SHADOW_ALPHA: Record<FieldTheme, number> = { light: 0.05, dark: 0.1 };
const RIM_COLOR: Record<FieldTheme, number> = { light: 0xffffff, dark: 0x8c82b4 };
const RIM_ALPHA: Record<FieldTheme, number> = { light: 0.55, dark: 0.06 };

/** Dot grid: spacing, dot size, and how far it slides as the viewer looks across the field */
const GRID_SPACING = 46;
const GRID_DOT = 1.6;
const GRID_SLIDE = 12;
/** How far the nearest mass slides the same way, in design units; each one behind it slides less */
const MASS_SLIDE = 16;
const GRID_ALPHA: Record<FieldTheme, number> = { light: 0.5, dark: 0.055 };
const GRID_COLOR: Record<FieldTheme, number> = { light: 0xc8bfe4, dark: 0xffffff };

/** The ring of light a puff sends out: its texture, where the bright band sits in it, and colour */
const RIPPLE_TEXTURE = 256;
const RIPPLE_BAND = 0.82;
const RIPPLE: Record<FieldTheme, { color: number; alpha: number; blend: 'add' | 'normal' }> = {
  light: { color: 0xa78bfa, alpha: 0.35, blend: 'normal' },
  dark: { color: 0xf06695, alpha: 0.3, blend: 'add' },
};

/**
 * Shade on the surface itself, under the shapes: the hero falls darker toward its bottom edge, where the band below
 * lies over it, and in the dark theme under the top bar. Stops down the hero; keep in step with `.hm-hero-shade`
 * in `hero.scss`.
 */
const SHADE: Record<FieldTheme, { color: string; stops: readonly (readonly [at: number, alpha: number])[] }> = {
  light: {
    color: '96, 78, 160',
    stops: [
      [0.7, 0],
      [0.86, 0.06],
      [1, 0.2],
    ],
  },
  dark: {
    color: '6, 5, 10',
    stops: [
      [0, 0.3],
      [0.2, 0],
      [0.7, 0],
      [0.86, 0.2],
      [1, 0.6],
    ],
  },
};
const SHADE_TEXTURE = 256;

const SPECK_TEXTURE = 32;

/** Texels across a baked ramp. These are gradients with no detail; a strip this wide is plenty */
const RAMP_SIZE = 64;

/** Samples per curve segment when the outline is flattened. Chords land well under a pixel of sag */
const OUTLINE_SAMPLES = 16;

export interface Backdrop {
  readonly view: Container;
  setTheme(theme: FieldTheme): void;
  /** The puff's front: a ring round `x, y` (CSS pixels) of `radius`, at `strength` 0-1 */
  setRipple(x: number, y: number, radius: number, strength: number): void;
  /** `lookX`/`lookY` are where the viewer looks from, -1 to 1 either way of the middle; the layers slide apart by it */
  update(elapsed: number, width: number, height: number, lookX: number, lookY: number): void;
  /** Releases the textures and geometry; the display objects go with the stage */
  destroy(): void;
}

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return [canvas, canvas.getContext('2d')];
}

/** The dot lattice as one repeating tile, so the grid is a single draw however large the hero */
function createGridTexture(): Texture {
  const [canvas, context] = createCanvas(GRID_SPACING, GRID_SPACING);

  if (context) {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, GRID_DOT, GRID_DOT);
  }
  const texture = Texture.from(canvas);

  texture.source.style.addressMode = 'repeat';

  return texture;
}

/**
 * Lays the lattice's quad over the field, its UVs running past 1 so the tile repeats, shifted by the slide. A mesh
 * does what a TilingSprite would here, without TilingSprite's pipe and shaders in the bundle.
 */
function layGrid(geometry: MeshGeometry, width: number, height: number, offsetX: number, offsetY: number): void {
  const { positions, uvs } = geometry;
  const left = -offsetX / GRID_SPACING;
  const top = -offsetY / GRID_SPACING;
  const right = left + width / GRID_SPACING;
  const bottom = top + height / GRID_SPACING;

  positions[2] = positions[4] = width;
  positions[5] = positions[7] = height;
  uvs[0] = uvs[6] = left;
  uvs[1] = uvs[3] = top;
  uvs[2] = uvs[4] = right;
  uvs[5] = uvs[7] = bottom;
  geometry.getBuffer('aPosition').update();
  geometry.getBuffer('aUV').update();
}

/**
 * The shadow's falloff, baked as a strip the skirt samples across: what a stack of rings at
 * `1-(1-A)^(1/n)` alpha each composites to, without the steps.
 */
function createShadowRamp(theme: FieldTheme): Texture {
  const [canvas, context] = createCanvas(RAMP_SIZE, 1);

  if (context) {
    const alpha = SHADOW_ALPHA[theme];

    for (let x = 0; x < RAMP_SIZE; x++) {
      context.fillStyle = `rgba(0, 0, 0, ${1 - (1 - alpha) ** (1 - x / (RAMP_SIZE - 1))})`;
      context.fillRect(x, 0, 1, 1);
    }
  }

  return Texture.from(canvas);
}

/** The light catching the top of a mass, sampled down its own bounds and tinted per theme */
function createRimRamp(): Texture {
  const [canvas, context] = createCanvas(1, RAMP_SIZE);

  if (context) {
    for (let y = 0; y < RAMP_SIZE; y++) {
      context.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - y / (RAMP_SIZE - 1) / RIM_REACH)})`;
      context.fillRect(0, y, 1, 1);
    }
  }

  return Texture.from(canvas);
}

/** {@link SHADE} as a strip the height of the hero */
function createShadeTexture(theme: FieldTheme): Texture {
  const [canvas, context] = createCanvas(1, SHADE_TEXTURE);

  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, SHADE_TEXTURE);

    for (const [at, alpha] of SHADE[theme].stops) gradient.addColorStop(at, `rgba(${SHADE[theme].color}, ${alpha})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, SHADE_TEXTURE);
  }

  return Texture.from(canvas);
}

/** A soft ring, brightest at {@link RIPPLE_BAND} of the way out, that the wave's front is a scaled copy of */
function createRippleTexture(): Texture {
  const [canvas, context] = createCanvas(RIPPLE_TEXTURE, RIPPLE_TEXTURE);

  if (context) {
    const half = RIPPLE_TEXTURE / 2;
    const gradient = context.createRadialGradient(half, half, 0, half, half, half);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(RIPPLE_BAND - 0.3, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(RIPPLE_BAND - 0.04, 'rgba(255, 255, 255, 0.55)');
    gradient.addColorStop(RIPPLE_BAND, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, RIPPLE_TEXTURE, RIPPLE_TEXTURE);
  }

  return Texture.from(canvas);
}

/** A soft disc the specks are tinted copies of */
function createSpeckTexture(): Texture {
  const [canvas, context] = createCanvas(SPECK_TEXTURE, SPECK_TEXTURE);

  if (context) {
    const half = SPECK_TEXTURE / 2;
    const gradient = context.createRadialGradient(half, half, 0, half, half, half);

    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.5, '#fff');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, SPECK_TEXTURE, SPECK_TEXTURE);
  }

  return Texture.from(canvas);
}

/**
 * A fan over the mass with a skirt around it: centre, then the outline, then the outline again pushed
 * out to {@link SHADOW_GROW}. `u` is 0 across the fan and 1 on the outer edge, so the ramp runs along the
 * skirt alone. Indices and UVs are built once; writing positions is the only per-frame work.
 */
function buildShadowGeometry(count: number): MeshGeometry {
  const positions = new Float32Array((count * 2 + 1) * 2);
  const uvs = new Float32Array((count * 2 + 1) * 2);
  const indices = new Uint32Array(count * 9);

  uvs[1] = 0.5;
  for (let i = 0; i < count; i++) {
    uvs[(1 + i) * 2 + 1] = 0.5;
    uvs[(1 + count + i) * 2] = 1;
    uvs[(1 + count + i) * 2 + 1] = 0.5;
  }

  let index = 0;

  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const inner = 1 + i;
    const innerNext = 1 + next;
    const outer = 1 + count + i;
    const outerNext = 1 + count + next;

    indices[index++] = 0;
    indices[index++] = inner;
    indices[index++] = innerNext;
    indices[index++] = inner;
    indices[index++] = outer;
    indices[index++] = innerNext;
    indices[index++] = innerNext;
    indices[index++] = outer;
    indices[index++] = outerNext;
  }

  return new MeshGeometry({ positions, uvs, indices });
}

/** A plain fan over the mass. `v` is written per frame; it maps the ramp onto the blob's bounds */
function buildBodyGeometry(count: number): MeshGeometry {
  const positions = new Float32Array((count + 1) * 2);
  const uvs = new Float32Array((count + 1) * 2);
  const indices = new Uint32Array(count * 3);

  for (let i = 0; i <= count; i++) uvs[i * 2] = 0.5;

  let index = 0;

  for (let i = 0; i < count; i++) {
    indices[index++] = 0;
    indices[index++] = 1 + i;
    indices[index++] = 1 + ((i + 1) % count);
  }

  return new MeshGeometry({ positions, uvs, indices });
}

/** Flattens a blob's outline into `outline`: the quadratic curves of `poster.ts`'s `outlinePath` */
function sampleOutline(outline: Float32Array, pointX: number[], pointY: number[]): void {
  const count = pointX.length;

  let slot = 0;

  for (let i = 0; i < count; i++) {
    const previous = (i + count - 1) % count;
    const next = (i + 1) % count;
    const startX = (pointX[previous] + pointX[i]) / 2;
    const startY = (pointY[previous] + pointY[i]) / 2;
    const endX = (pointX[i] + pointX[next]) / 2;
    const endY = (pointY[i] + pointY[next]) / 2;

    for (let step = 0; step < OUTLINE_SAMPLES; step++) {
      const t = step / OUTLINE_SAMPLES;
      const inverse = 1 - t;
      const a = inverse * inverse;
      const b = 2 * inverse * t;
      const c = t * t;

      outline[slot++] = a * startX + b * pointX[i] + c * endX;
      outline[slot++] = a * startY + b * pointY[i] + c * endY;
    }
  }
}

/**
 * Everything painted behind the shapes: the blob masses the field floats over, each with its own drop
 * shadow, the dot lattice that slides against the pointer, and a handful of specks.
 *
 * The masses are laid out in the poster's 1280x720 design space and scaled to cover the hero the way
 * the poster's `xMidYMid slice` SVG is, so the first frame lands exactly on the poster. A mass's shadow is
 * drawn immediately under that mass: the separation you see is the shadow falling across the one behind.
 */
export function createBackdrop(theme: FieldTheme): Backdrop {
  const view = new Container();
  const masses = new Container();
  const shadowRamps: Record<FieldTheme, Texture> = {
    light: createShadowRamp('light'),
    dark: createShadowRamp('dark'),
  };
  const rimRamp = createRimRamp();
  const gridTexture = createGridTexture();
  const speckTexture = createSpeckTexture();
  const rippleTexture = createRippleTexture();
  const shadeTextures: Record<FieldTheme, Texture> = {
    light: createShadeTexture('light'),
    dark: createShadeTexture('dark'),
  };
  const shade = new Sprite(shadeTextures[theme]);
  const ripple = new Sprite({ texture: rippleTexture, anchor: 0.5, visible: false });
  let rippleStrength = 0;
  let rippleTheme = theme;
  const grid = new Mesh({
    geometry: new MeshGeometry({
      positions: new Float32Array(8),
      uvs: new Float32Array(8),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
    }),
    texture: gridTexture,
  });

  const outlines = blobs.map((blob) => new Float32Array(blob.phases.length * OUTLINE_SAMPLES * 2));
  const shadowMeshes = blobs.map(
    (blob) =>
      new Mesh({ geometry: buildShadowGeometry(blob.phases.length * OUTLINE_SAMPLES), texture: shadowRamps[theme] }),
  );
  const bodyMeshes = blobs.map(
    (blob) => new Mesh({ geometry: buildBodyGeometry(blob.phases.length * OUTLINE_SAMPLES), texture: Texture.WHITE }),
  );
  const rimMeshes = bodyMeshes.map((body) => new Mesh({ geometry: body.geometry, texture: rimRamp }));
  const geometries = [grid, ...shadowMeshes, ...bodyMeshes].map((mesh) => mesh.geometry);

  for (let i = 0; i < blobs.length; i++) masses.addChild(shadowMeshes[i], bodyMeshes[i], rimMeshes[i]);
  view.addChild(masses, grid, shade, ripple);

  const speckSprites = specks.map((speck) => {
    const sprite = new Sprite(speckTexture);

    sprite.anchor.set(0.5);
    sprite.tint = speck.color;
    sprite.width = speck.radius * 2;
    sprite.height = speck.radius * 2;
    view.addChild(sprite);

    return sprite;
  });

  const pointX: number[] = [];
  const pointY: number[] = [];

  return {
    view,

    setTheme(next: FieldTheme) {
      for (let i = 0; i < blobs.length; i++) {
        shadowMeshes[i].texture = shadowRamps[next];
        bodyMeshes[i].tint = BLOB_COLORS[next][i];
        rimMeshes[i].tint = RIM_COLOR[next];
        rimMeshes[i].alpha = RIM_ALPHA[next];
      }
      shade.texture = shadeTextures[next];
      rippleTheme = next;
      grid.tint = GRID_COLOR[next];
      grid.alpha = GRID_ALPHA[next];
      ripple.tint = RIPPLE[next].color;
      ripple.blendMode = RIPPLE[next].blend;
      ripple.alpha = RIPPLE[next].alpha * rippleStrength;
    },

    setRipple(x: number, y: number, radius: number, strength: number) {
      rippleStrength = strength;
      ripple.visible = strength > 0;
      ripple.position.set(x, y);
      ripple.scale.set(radius / ((RIPPLE_TEXTURE / 2) * RIPPLE_BAND));
      ripple.alpha = RIPPLE[rippleTheme].alpha * strength;
    },

    update(elapsed: number, width: number, height: number, lookX: number, lookY: number) {
      const cover = Math.max(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

      masses.scale.set(cover);
      masses.position.set((width - DESIGN_WIDTH * cover) / 2, (height - DESIGN_HEIGHT * cover) / 2);
      layGrid(grid.geometry, width, height, -lookX * GRID_SLIDE, -lookY * GRID_SLIDE);
      shade.setSize(width, height);

      for (let index = 0; index < blobs.length; index++) {
        const slide = (MASS_SLIDE * (index + 1)) / blobs.length;
        const [driftX, driftY] = blobPoints(blobs[index], elapsed, pointX, pointY);
        const centerX = driftX - lookX * slide;
        const centerY = driftY - lookY * slide;
        const outline = outlines[index];

        sampleOutline(outline, pointX, pointY);
        for (let i = 0; i < outline.length; i += 2) {
          outline[i] -= lookX * slide;
          outline[i + 1] -= lookY * slide;
        }

        const rim = outline.length / 2;
        const shadowGeometry = shadowMeshes[index].geometry;
        const bodyGeometry = bodyMeshes[index].geometry;
        const shadowPositions = shadowGeometry.positions;
        const bodyPositions = bodyGeometry.positions;
        const bodyUvs = bodyGeometry.uvs;
        const shadowCenterY = centerY + SHADOW_OFFSET_Y;

        let minY = Infinity;
        let maxY = -Infinity;

        for (let i = 1; i < outline.length; i += 2) {
          if (outline[i] < minY) minY = outline[i];
          if (outline[i] > maxY) maxY = outline[i];
        }

        const span = maxY - minY || 1;

        shadowPositions[0] = centerX;
        shadowPositions[1] = shadowCenterY;
        bodyPositions[0] = centerX;
        bodyPositions[1] = centerY;
        bodyUvs[1] = (centerY - minY) / span;

        for (let i = 0; i < rim; i++) {
          const x = outline[i * 2];
          const y = outline[i * 2 + 1];
          const slot = (1 + i) * 2;

          bodyPositions[slot] = x;
          bodyPositions[slot + 1] = y;
          bodyUvs[slot + 1] = (y - minY) / span;
          shadowPositions[slot] = x;
          shadowPositions[slot + 1] = y + SHADOW_OFFSET_Y;

          const outer = (1 + rim + i) * 2;

          shadowPositions[outer] = centerX + (x - centerX) * SHADOW_GROW;
          shadowPositions[outer + 1] = shadowCenterY + (y + SHADOW_OFFSET_Y - shadowCenterY) * SHADOW_GROW;
        }

        shadowGeometry.getBuffer('aPosition').update();
        bodyGeometry.getBuffer('aPosition').update();
        bodyGeometry.getBuffer('aUV').update();
      }

      for (let i = 0; i < specks.length; i++) {
        const speck = specks[i];

        speckSprites[i].position.set(
          speck.x * width + Math.sin(elapsed * speck.rate + speck.phase) * SPECK_DRIFT_X,
          speck.y * height + Math.cos(elapsed * speck.rate * 0.8 + speck.phase) * SPECK_DRIFT_Y,
        );
        speckSprites[i].alpha = speckAlpha(speck, elapsed);
      }
    },

    destroy() {
      for (const geometry of geometries) geometry.destroy();
      gridTexture.destroy(true);
      speckTexture.destroy(true);
      rippleTexture.destroy(true);
      shadeTextures.light.destroy(true);
      shadeTextures.dark.destroy(true);
      shadowRamps.light.destroy(true);
      shadowRamps.dark.destroy(true);
      rimRamp.destroy(true);
    },
  };
}
