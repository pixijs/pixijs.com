/**
 * The props: the row of spheres in the logo's plastic at five `ior` values, where each sphere stands, the logo's sway,
 * and a night sky light enough to show a logo that reflects nothing
 */

import { Material3D, Mesh3D, SphereGeometry, Vector3 } from '@pixi/3d';

import { mixColor, screenColor, THEMES } from './theme/palette';

/**
 * Each sphere's `ior`, left to right: 1 reflects nothing head-on, then water, glass (the default), ruby and diamond.
 * Every sphere wears the logo's black plastic; only the number differs.
 */
export const SAMPLE_IORS = [1, 1.33, 1.5, 1.77, 2.42];
/** Big enough to show the reflected sunset as a picture, small enough that five fit across under the logo */
export const SAMPLE_RADIUS = 0.4;
/** From one sphere's centre to the next: far enough apart that neighbouring tags never touch on a phone */
const SAMPLE_GAP = 1.15;
/** The row's height, clear of the floor, and its depth, a little in front of the logo */
const ROW_Y = 0.95;
const ROW_Z = 0.4;
/** The middle sphere's index, which stands at x 0 */
const MIDDLE = (SAMPLE_IORS.length - 1) / 2;
/**
 * The logo's sway, in radians and radians a second: it slides the reflection across the bevels and side walls. It
 * turns about `rest`, the `JS` end a little away from the camera, so the walls inside those letters always face it
 * side-on: turned square to the camera, it would look straight through the letters' holes.
 */
const SWAY = {
  rest: 0.3,
  turn: 0.12,
  turnRate: 0.4,
  tilt: 0.05,
  tiltRate: 0.27,
};
/**
 * How many times brighter the dark theme's haze shows than the kit's. The kit's night is as black as the plastic, so
 * at `specular.factor` 0 the logo would vanish into it; lifted, it stands out as a black shape.
 */
const NIGHT_LIFT = 2.4;

/**
 * The row: the logo's plastic and specular group, read back from its material, at each sample's `ior`, given as a
 * constructor option
 */
export function createSampleRow({ material, specular, parent }) {
  // One geometry and the same option groups, so the five share a shader and draw back to back: one draw on WebGL, one a
  // sphere on WebGPU.
  const sphere = new SphereGeometry({
    radius: SAMPLE_RADIUS,
    widthSegments: 48,
    heightSegments: 24,
  });
  const { baseColor, metallic, roughness } = material;
  const { factor, color } = specular;
  const rowSpecular = SAMPLE_IORS.map((ior, i) => {
    const plastic = new Material3D({
      baseColor,
      metallic,
      roughness,
      ior,
      specular: { factor, color },
    });

    new Mesh3D({
      geometry: sphere,
      material: plastic,
      position: samplePosition(i, new Vector3()),
      parent,
    });

    // Built with the group, so it's there.
    return plastic.specular;
  });

  return {
    followLogo: () => {
      for (const sample of rowSpecular) {
        sample.factor = specular.factor;
        sample.color = specular.color;
      }
    },
  };
}

/** Where sphere `index` stands */
export function samplePosition(index, out) {
  return out.set((index - MIDDLE) * SAMPLE_GAP, ROW_Y, ROW_Z);
}

/** Turns the logo gently at `time` seconds, so the reflection slides across its side walls and the walls inside `JS` */
export function swayLogo(root, time) {
  root.rotation.y = SWAY.rest + Math.sin(time * SWAY.turnRate) * SWAY.turn;
  root.rotation.x = Math.sin(time * SWAY.tiltRate) * SWAY.tilt;
}

/**
 * Brightens the stage's backdrop and fog together on the dark theme, so the horizon stays seamless. The stage writes
 * both on a theme change, so `update()` runs after `stage.update` and writes only while the theme fades.
 */
export function liftNightSky(stage) {
  let darkness = -1;

  return {
    update() {
      if (stage.darkness === darkness) return;
      darkness = stage.darkness;

      // Eased in, so a fade to dark only ever darkens.
      const lift = 1 + (NIGHT_LIFT - 1) * darkness * darkness;
      const haze = mixColor(THEMES.light.haze, THEMES.dark.haze, darkness);

      // The backdrop's intensity scales light, which the screen's gamma 2.2 shows as `lift` times brighter. The fog
      // takes the haze times `lift`: a mix from black that runs past the haze to `lift` times it.
      stage.backdrop.intensity = lift ** 2.2;
      stage.fog.color = screenColor(mixColor(0, haze, lift));
    },
  };
}
