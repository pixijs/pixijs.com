/**
 * The props the lesson stands on: the two-tone wall, where the balls, the pin and the tube stand, and the pin's slide
 *
 * None of it is render state; `index.ts` builds the meshes and the materials that carry that.
 */

import { Container3D, Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { BRAND } from './theme/palette';
import { roundedBox } from './theme/shapes';

/** One half of the wall; the two stand side by side, each wide enough that its Venn stays on it as the camera turns */
const WALL_HALF = { width: 1.7, height: 2.4, depth: 0.3 };
/** The two halves' centres along x, white then night; each holds one Venn of balls */
const HALF_X = [-2.05, -0.35];
/** Puts the wall's front face (z 0.05) close behind the balls, so turning the camera slides them across it little */
const WALL_Z = -0.1;

/** The balls' colours, in the order each Venn lists them: pink on top, sky lower left, orange lower right */
export const ORB_COLORS = [BRAND.pink, BRAND.sky, BRAND.orange];
/** Big enough that every pair of balls overlaps past the Venn's middle, small enough to leave room round it */
export const ORB_SCALE = 0.74;
/**
 * Each Venn's centre along x, a little right of its half's middle: the camera stands right of both, so the balls,
 * standing out from the wall, look that much left of where they are
 */
const VENN_X = HALF_X.map((x) => x + 0.05);
/** How far each ball sits from its Venn's centre, and the height of that centre */
const VENN_SPREAD = 0.28;
const VENN_Y = 0.95;
/**
 * Each ball's z, in `ORB_COLORS` order. The transparent pass draws far to near by each mesh's distance from the
 * camera, so these put orange first and pink last in both Venns from the default view, and `'normal'` layers both the
 * same way.
 */
const ORB_DEPTHS = [0.4, 0.3, 0];

/** The six balls, a Venn on each half of the wall, three per Venn in `ORB_COLORS` order */
export const ORB_POSITIONS = VENN_X.flatMap((centreX) =>
  ORB_DEPTHS.map((z, i) => {
    const angle = Math.PI / 2 + (i * Math.PI * 2) / 3;

    return new Vector3(
      centreX + Math.cos(angle) * VENN_SPREAD,
      VENN_Y + Math.sin(angle) * VENN_SPREAD,
      z,
    );
  }),
);

/**
 * The pin. At `position` it hides behind the middle of the wall's night half, 0.35 behind its back face, above that
 * half's Venn so no ball covers it on screen. Its slide runs along x from there to `out`, past the wall's right end
 * (0.5) and clear of the tube's arrows. `scale` makes it a tall diamond that reads as a map marker, and it turns `spin`
 * radians a second so its facets catch the key light.
 */
export const PIN = {
  position: { x: -0.35, y: 1.85, z: -0.6 },
  out: 1.2,
  scale: { x: 0.45, y: 0.7, z: 0.45 },
  spin: 0.8,
};
/** The slide's cycle in seconds: behind the wall for 2 s round every multiple of it, out in the open for 1 s between */
const PIN_CYCLE = 6;

/**
 * The open tube, right of the wall, standing just off the floor and tipped towards the camera so its inside can show.
 * `index.ts` hands the radius on to the visuals too, for the arrows out of its side.
 */
export const TUBE = {
  radius: 0.75,
  height: 1.1,
  position: { x: 2.7, y: 0.9, z: 0.2 },
  tilt: 0.5,
};

/**
 * The wall: one rounded slab worn twice, white clay on the left and night clay on the right. Adding light can only
 * brighten and multiplying only darken, so each blend mode needs a light and a dark backdrop to show what it does.
 */
export function createWall() {
  const wall = new Container3D();
  const slab = roundedBox(
    WALL_HALF.width,
    WALL_HALF.height,
    WALL_HALF.depth,
    0.06,
  );
  const tones = [clayMaterial('white'), clayMaterial(BRAND.night)];

  HALF_X.forEach((x, i) => {
    new Mesh3D({
      geometry: slab,
      material: tones[i],
      position: { x, y: WALL_HALF.height / 2, z: WALL_Z },
      parent: wall,
    });
  });

  return wall;
}

/** The pin's x `time` seconds into its slide, out from behind the wall and back once a cycle */
export function pinSlideX(time) {
  const t = time % PIN_CYCLE;
  // Behind for t < 1, out over 1 to 2.5, out until 3.5, back in over 3.5 to 5, behind again from 5.
  const out =
    t < 3.5 ? smoothstep((t - 1) / 1.5) : 1 - smoothstep((t - 3.5) / 1.5);

  return PIN.position.x + (PIN.out - PIN.position.x) * out;
}

function smoothstep(t) {
  const k = Math.min(Math.max(t, 0), 1);

  return k * k * (3 - 2 * k);
}
