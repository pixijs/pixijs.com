/**
 * What the particle examples share: the kit's round spark sprite, and the disc and ring a `PointsHelper` draws
 *
 * The textures are white, for particles to tint, drawn once on a canvas and cached. The kit owns them: call
 * {@link releaseParticleTextures} in your teardown.
 */

import { Texture } from 'pixi.js';

/** Each texture's side, in pixels: a dot stays round and sharp up to about 60 px across */
const TEXTURE_SIZE = 64;
/** A ring's line, as a share of its radius */
const RING_WIDTH = 0.2;

let spark = null;
let disc = null;
let ring = null;

/**
 * The kit's particle sprite: a soft white dot, solid in the middle and clear at the edge
 *
 * The engine's default particle texture is `Texture.WHITE`, which draws squares. Tint it with the particle's colour.
 */
export function sparkTexture() {
  spark ??= drawTexture((context, half) => {
    const gradient = context.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half,
    );

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  });

  return spark;
}

/**
 * The sprite a `PointsHelper` draws: a crisp white disc filling the quad, or with `hollow` a ring round its edge
 * whose line is a fifth of the radius
 */
export function pointTexture(hollow = false) {
  // A texel short of the edge, so the canvas's soft rim stays inside the quad.
  const radius = TEXTURE_SIZE / 2 - 1;

  if (hollow) {
    ring ??= drawTexture((context, half) => {
      context.lineWidth = radius * RING_WIDTH;
      context.strokeStyle = '#ffffff';
      context.beginPath();
      context.arc(half, half, radius - context.lineWidth / 2, 0, Math.PI * 2);
      context.stroke();
    });

    return ring;
  }

  disc ??= drawTexture((context, half) => {
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(half, half, radius, 0, Math.PI * 2);
    context.fill();
  });

  return disc;
}

/** Destroys the spark, disc and ring textures; call it after `view3d.unload()` */
export function releaseParticleTextures() {
  spark?.destroy(true);
  disc?.destroy(true);
  ring?.destroy(true);
  spark = disc = ring = null;
}

/** A mipmapped white texture drawn by `draw`, so it stays smooth as a particle shrinks into the distance */
function drawTexture(draw) {
  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = TEXTURE_SIZE;
  draw(canvas.getContext('2d'), TEXTURE_SIZE / 2);

  return Texture.from({ resource: canvas, autoGenerateMipmaps: true });
}
