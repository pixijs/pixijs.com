/** Where the spheres stand: their steps of roughness and metallic, and how far apart they are */

/** The columns, left to right, and the rows, bottom to top */
export const SPHERE_ROUGHNESS = [0, 0.25, 0.5, 0.75, 1];
export const SPHERE_METALLIC = [0, 1];
/** Big enough to show a reflection, small enough that five fit across under the logo */
export const SPHERE_RADIUS = 0.3;
/** The plane the spheres stand in, a little in front of the logo */
const SPHERES_Z = 0.4;
/** From the first column to the last, and between the two rows: gaps that keep each sphere's reflection its own */
const SPHERES_WIDTH = 3.8;
const ROW_GAP = 1.1;
/** The bottom row's height: a sphere's radius plus room for the `roughness` name under it */
const BOTTOM_ROW = 0.62;

/** Where the sphere for one step of roughness and one of metallic stands */
export function spherePosition(roughness, metallic, out) {
  return out.set(
    SPHERES_WIDTH * (roughness - 0.5),
    BOTTOM_ROW + ROW_GAP * metallic,
    SPHERES_Z,
  );
}
