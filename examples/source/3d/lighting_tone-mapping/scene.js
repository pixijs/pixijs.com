/**
 * The props each half of the split builds for itself: the logo under a strong spot, and a row of glowing balls
 *
 * A mesh belongs to one view, so each view gets its own copy of both, built the same way.
 */

import { Mesh3D, SpotLight } from '@pixi/3d';

import { loadPixiLogo } from './theme/logo';

import { BRAND } from './theme/palette';
import { clayGeometry } from './theme/shapes';

/** The logo's height: clear over the row of balls in front of it, seen from the camera's height */
const LOGO_Y = 2.05;
/**
 * The spot hangs up and to the right, in front of the logo, aimed at the `JS` badge's face. Its narrow cone takes in
 * the badge and the right of the `xi`, while the `P` (22° off its axis) and the balls (26° and more) stay outside.
 */
const SPOT_POSITION = { x: 4, y: LOGO_Y + 2.15, z: 4.5 };
const SPOT_TARGET = { x: 1.6, y: LOGO_Y + 0.4, z: 0.1 };
/** The row of balls in front of the logo: its depth, the gap between centres and their height over the floor */
const ROW = { z: 1.6, spacing: 0.8, y: 0.45 };
/** The clay sphere is 0.9 across, so each ball is 0.5 wide and balls 0.8 apart leave a gap that fits their numbers */
const BALL_SCALE = 0.55;

/** Loads a logo into `parent` and hangs a spot at `intensity` over its `JS` */
export async function createSpotlitLogo(parent, intensity) {
  const logo = await loadPixiLogo({ width: 4 });

  logo.root.position.y = LOGO_Y;
  parent.addChild(logo.root);

  // No shadow, so the stage's key keeps the only shadow map. A light with no shadow shines through whatever is in its
  // way, so `range` ends the beam just past the logo, before it reaches the floor behind it.
  const spot = new SpotLight({
    color: BRAND.white,
    intensity,
    coneAngle: 14,
    penumbra: 0.5,
    range: 8,
    position: SPOT_POSITION,
    parent,
  });

  spot.lookAt(SPOT_TARGET);

  return logo;
}

/** A ball per material in a row in front of the logo, centred on x 0 */
export function createGlowRow(parent, materials) {
  const start = (-(materials.length - 1) / 2) * ROW.spacing;

  return materials.map(
    (material, i) =>
      new Mesh3D({
        geometry: clayGeometry('sphere'),
        material,
        position: { x: start + i * ROW.spacing, y: ROW.y, z: ROW.z },
        scale: BALL_SCALE,
        parent,
      }),
  );
}
