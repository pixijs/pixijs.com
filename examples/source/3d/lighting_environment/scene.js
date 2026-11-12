/**
 * The props: a chrome ball and a matte grey ball under the logo, the pair a film crew shoots to record a set's light
 *
 * The chrome one shows the environment's reflections and the grey one its soft light, the two things every surface
 * takes from it in some mix.
 */

import { Material3D, Mesh3D, SphereGeometry } from '@pixi/3d';

/** Big enough to read a reflection in on a phone */
export const PROBE_RADIUS = 0.5;
/** Under the logo's two ends and a little in front, so neither hides behind it */
const PROBE_X = 1.25;
const PROBE_Y = -1.2;
const PROBE_Z = 0.4;
/** Real chrome reflects a little over half the light; a white mirror would vanish into a flat environment its colour */
const MIRROR_COLOR = 0xc8c8c8;
/** Mid-grey: it shows the soft light's shape without washing out, and stays a visible disc on the flat source */
const MATTE_COLOR = 0xb4b4b4;

export function createProbes({ parent }) {
  const ball = new SphereGeometry({
    radius: PROBE_RADIUS,
    widthSegments: 48,
    heightSegments: 24,
  });
  const mirror = new Mesh3D({
    geometry: ball,
    material: new Material3D({
      baseColor: MIRROR_COLOR,
      metallic: 1,
      roughness: 0,
    }),
    position: { x: -PROBE_X, y: PROBE_Y, z: PROBE_Z },
    parent,
  });
  // No specular, so it shows the soft light and nothing else.
  const matte = new Mesh3D({
    geometry: ball,
    material: new Material3D({
      baseColor: MATTE_COLOR,
      metallic: 0,
      roughness: 1,
      specular: { factor: 0 },
    }),
    position: { x: PROBE_X, y: PROBE_Y, z: PROBE_Z },
    parent,
  });

  return { mirror, matte };
}
