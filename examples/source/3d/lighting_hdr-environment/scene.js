/**
 * The props each half of the split builds for itself: the PixiJS logo in near-mirror metal over a chrome ball, both
 * facing the sun, and the logo's sway
 *
 * A mesh belongs to one view, so each view gets its own copy of both, built the same way. The materials come from
 * `index.ts` and are shared, since a material can draw in two views, each under its own view's environment.
 */

import { Mesh3D, SphereGeometry } from '@pixi/3d';

import { loadPixiLogo } from './theme/logo';

/**
 * Where the sun lies in the Venice sunset panorama, as `loadHdr` lays it out: the direction of its brightest texel,
 * 3° over the horizon
 */
const SUN_DIRECTION = { x: 0.807, y: 0.058, z: 0.587 };
/** The sun's turn round y from +z, 54°: the subject faces it, so a camera in front has the sun at its back */
export const SUN_AZIMUTH = Math.atan2(SUN_DIRECTION.x, SUN_DIRECTION.z);
/** Big enough to read the sun's glint in on a phone */
const BALL_RADIUS = 0.6;
/** The logo's height, clear over the ball */
const LOGO_Y = 0.8;
/** The ball's height under the logo's middle, and how far it stands out in front, so the logo never hides it */
const BALL = { y: -1.25, ahead: 0.4 };
/**
 * Where the sway is centred and how far the logo turns either way of it, in radians, and radians a second: one sway
 * every 12 s. A mirror's reflection turns twice as far as the mirror, so a turn of under 1.5° slides the sun's glint
 * between the first i and the right half of the x. The centre, half a degree off facing the sun, keeps the glint
 * clear of the dark notch in the x's right side, where the sun would sink out of sight for seconds at a time.
 */
const SWAY = { centre: 0.008, angle: 0.024, rate: (2 * Math.PI) / 12 };

/** Loads a logo into `parent`, skins it, and sets the chrome ball under it, both facing the sun */
export async function createSubject({ parent, logoMaterial, ballMaterial }) {
  // The model's own materials, not the kit's enamel: `setMaterial` swaps them for the metal straight away.
  const logo = await loadPixiLogo({ material: 'source' });

  logo.setMaterial(logoMaterial);
  logo.root.position.y = LOGO_Y;
  logo.root.rotation.y = swayAngle(0);
  parent.addChild(logo.root);

  const ball = new Mesh3D({
    geometry: new SphereGeometry({
      radius: BALL_RADIUS,
      widthSegments: 64,
      heightSegments: 32,
    }),
    material: ballMaterial,
    position: {
      x: Math.sin(SUN_AZIMUTH) * BALL.ahead,
      y: BALL.y,
      z: Math.cos(SUN_AZIMUTH) * BALL.ahead,
    },
    parent,
  });

  return { logo, ball };
}

/**
 * The logo's turn at `time` seconds, the same every run: it opens with the glint on the x, heading right first, so
 * the first frame shows the sun on the logo's middle
 */
export function swayAngle(time) {
  return SUN_AZIMUTH + SWAY.centre - Math.sin(time * SWAY.rate) * SWAY.angle;
}
