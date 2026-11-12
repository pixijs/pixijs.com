/**
 * The props: the square bottle the liquid fills, with its clay cork, and the fence of clay bars behind both pieces of
 * glass
 *
 * Glass shows only what's behind it, and over the pale floor and sky clear glass all but vanishes. The bars give it
 * something to bend: their straight edges break where they cross the glass, and their two colours show what the
 * liquid lets through.
 */

import {
  BatchedMesh3D,
  Container3D,
  Matrix4,
  Mesh3D,
  RenderPassBit,
} from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedBox, roundedCylinder } from './theme/shapes';

/** The bottle's width, which is also its depth, so it's how far light crosses the bottle front to back */
export const BOTTLE_WIDTH = 1.2;
/** Taller than it's wide, so it reads as a bottle rather than a block */
export const BOTTLE_HEIGHT = 1.7;
/** How round the bottle's edges are: enough to read as moulded, little enough to keep its front flat */
const BOTTLE_EDGE = 0.12;
/** Right of the logo and a little in front, so the two pieces of glass never overlap on screen */
const BOTTLE_AT = { x: 2.35, y: 0, z: 0.6 };
/** The cork, sunk a little into the liquid's top so it reads as plugging it */
export const CORK = { radius: 0.31, height: 0.42, edge: 0.1, sink: 0.09 };
/** Twelve bars behind both subjects, rounded nearly to rods; 3 tall, so they run on past the logo's top */
const BARS = {
  count: 12,
  spacing: 0.62,
  side: 0.3,
  edge: 0.12,
  height: 3,
  z: -2.2,
};

/**
 * A square bottle that's all liquid, with a cork; it returns the bottle's root, on the floor at its centre line
 *
 * It has no glass wall: glass never shows other glass behind it, so a wall would hide the liquid. It's square, not
 * round: a round bottle bends every ray towards its middle and shows one bar magnified, while a flat front passes the
 * bars through about 1:1, which shows the liquid is see-through.
 */
export function createBottle({ material, parent }) {
  const root = new Container3D({
    label: 'bottle',
    position: BOTTLE_AT,
    parent,
  });

  new Mesh3D({
    geometry: roundedBox(
      BOTTLE_WIDTH,
      BOTTLE_HEIGHT,
      BOTTLE_WIDTH,
      BOTTLE_EDGE,
    ),
    material,
    position: { x: 0, y: BOTTLE_HEIGHT / 2, z: 0 },
    parent: root,
  });
  // The liquid casts no shadow, so the cork's would land on the floor inside the bottle and read as a smudge there.
  new Mesh3D({
    geometry: roundedCylinder(CORK.radius, CORK.height, CORK.edge),
    material: clayMaterial('orange'),
    position: { x: 0, y: BOTTLE_HEIGHT + CORK.height / 2 - CORK.sink, z: 0 },
    castShadow: false,
    parent: root,
  });

  return root;
}

/**
 * The fence of bars, white and sky in turn from the left, so the bottle stands in front of a sky, a white and a sky
 *
 * They're slots of one batch, in the shadow pass too: a draw per clay colour on WebGPU, and one for the whole fence on
 * WebGL.
 */
export function createBars({ parent }) {
  const geometry = roundedBox(BARS.side, BARS.height, BARS.side, BARS.edge);
  const fence = new BatchedMesh3D({ size: BARS.count, label: 'bars', parent });
  const matrix = new Matrix4();

  for (let i = 0; i < BARS.count; i++) {
    fence.setGeometryAt(i, geometry);
    fence.setMaterialAt(i, clayMaterial(i % 2 === 0 ? 'white' : 'sky'));
    fence.setMatrixAt(
      i,
      matrix.makeTranslation(
        (i - (BARS.count - 1) / 2) * BARS.spacing,
        BARS.height / 2,
        BARS.z,
      ),
    );
    fence.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
  }
}
