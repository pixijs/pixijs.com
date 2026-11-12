/**
 * The heightmap that fills the terrain's arrays: a height for every vertex of a square grid, and the normals that
 * follow from the slopes between neighbouring heights
 *
 * Vertex `row * SIDE + column` sits at column `column` and row `row`, so its x, y and z are at `vertex * 3` in
 * `positions` and its normal at the same place in `normals`. Nothing here allocates, so the frame loop calls it
 * every frame.
 */

/** Cells along each side: coarse enough that each triangle reads on screen, fine enough that a ripple stays round */
export const CELLS = 16;
/** Vertices along each side, one more than the cells */
export const SIDE = CELLS + 1;
/** The patch's side in scene units */
export const SIZE = 6;
/** The distance between neighbouring vertices */
const CELL = SIZE / CELLS;

/** The ground at (x, z) and `time`: a broad hill and a hollow, low diagonal ridges, and a ripple rolling across */
function heightAt(x, z, time) {
  return (
    0.35 * Math.sin(0.9 * x + 0.4) * Math.cos(0.8 * z) +
    0.15 * Math.sin(1.7 * x - 1.3 * z) +
    0.15 * Math.sin(2.2 * x + 1.4 * z - 2 * time)
  );
}

/** Lifts every vertex to `height` times the ground under it; x and z never change, only y */
export function writeHeights(positions, time, height) {
  for (let i = 0; i < SIDE * SIDE * 3; i += 3) {
    positions[i + 1] = height * heightAt(positions[i], positions[i + 2], time);
  }
}

/** Works each normal out from the heights either side of it, which `writeHeights` just wrote */
export function writeNormals(positions, normals) {
  for (let row = 0; row < SIDE; row++) {
    // At an edge there's one neighbour, so the slope runs from it to the vertex itself.
    const back = Math.max(row - 1, 0);
    const front = Math.min(row + 1, CELLS);

    for (let column = 0; column < SIDE; column++) {
      const left = Math.max(column - 1, 0);
      const right = Math.min(column + 1, CELLS);
      // How far y climbs per unit of x and of z, so the spacing matters: raw differences would tilt it too little.
      const dx =
        (heightOf(positions, row, right) - heightOf(positions, row, left)) /
        ((right - left) * CELL);
      const dz =
        (heightOf(positions, front, column) -
          heightOf(positions, back, column)) /
        ((front - back) * CELL);
      // A surface y = h(x, z) faces (-dx, 1, -dz), scaled here to length 1.
      const length = Math.sqrt(dx * dx + 1 + dz * dz);
      const i = (row * SIDE + column) * 3;

      normals[i] = -dx / length;
      normals[i + 1] = 1 / length;
      normals[i + 2] = -dz / length;
    }
  }
}

/** Points every normal straight up, so the lights see a flat sheet whatever shape the positions make */
export function pointNormalsUp(normals) {
  for (let i = 0; i < normals.length; i += 3) {
    normals[i] = 0;
    normals[i + 1] = 1;
    normals[i + 2] = 0;
  }
}

function heightOf(positions, row, column) {
  return positions[(row * SIDE + column) * 3 + 1];
}
