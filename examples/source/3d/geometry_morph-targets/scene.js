/**
 * The shapes the morph targets move a unit sphere to: a rounded cube and a puffy five-pointed star
 *
 * Each shape is worked out from the sphere's own vertices, so it gives every vertex a place on the new shape and the
 * normal there, in the order of `positions`. No offsets are made here: turning a shape into a morph target is the
 * lesson, in `index.ts`.
 */

/** A shape for the sphere's vertices: where each one sits on it and the normal there, in the order of `positions` */

/**
 * The cube's half side. Its face-on outline, 1.8 across, covers about the sphere's area (1.8² ≈ π), so the morph
 * reads as a change of shape rather than of size. Its side centres sit inside the sphere and its corners outside, so
 * the offsets point both ways
 */
const CUBE_HALF = 0.9;
/** The power in `|x|ⁿ + |y|ⁿ + |z|ⁿ = 1`: high enough for flat faces, low enough for soft edges */
const CUBE_ROUNDNESS = 8;
/** The star's tip and notch radii, its depth front to back, and how far its tips and notches round off */
const STAR_OUTER = 1.3;
const STAR_INNER = 0.7;
const STAR_DEPTH = 0.5;
const STAR_ROUNDING = 0.1;
/** Half the angle between two tips */
const STAR_HALF_STEP = Math.PI / 5;
/** The angle step the star's slope is measured over */
const SLOPE_STEP = 1e-4;

/**
 * Writes vertex `i`'s place on a shape, and the normal there at any length, for the vertex whose direction from the
 * sphere's centre is d
 */

/** The rounded cube: each vertex pushed out or pulled in along its direction to `|x|⁸ + |y|⁸ + |z|⁸ = h⁸` */
export function cubeShape(sphere) {
  const n = CUBE_ROUNDNESS;
  // The gradient of |v|ⁿ along one axis, the normal's part along it.
  const slope = (v) => Math.sign(v) * Math.abs(v) ** (n - 1);

  return shapeFrom(sphere, (dx, dy, dz, out, i) => {
    const scale =
      CUBE_HALF /
      (Math.abs(dx) ** n + Math.abs(dy) ** n + Math.abs(dz) ** n) ** (1 / n);

    put(out.positions, i, dx * scale, dy * scale, dz * scale);
    put(out.normals, i, slope(dx), slope(dy), slope(dz));
  });
}

/** The star: each vertex stretched in x and y to the star's outline at its angle, and flattened in z */
export function starShape(sphere) {
  return shapeFrom(sphere, (dx, dy, dz, out, i) => {
    const angle = Math.atan2(dy, dx);
    const r = starRadius(angle);
    const slope =
      (starRadius(angle + SLOPE_STEP) - starRadius(angle - SLOPE_STEP)) /
      (2 * SLOPE_STEP);

    put(out.positions, i, dx * r, dy * r, dz * STAR_DEPTH);
    // The gradient of (ρ / r(angle))² + (z / depth)², the surface's implicit form.
    put(
      out.normals,
      i,
      dx / r + (dy * slope) / (r * r),
      dy / r - (dx * slope) / (r * r),
      dz / STAR_DEPTH,
    );
  });
}

/** The star's radius at an angle from +x: five tips, one straight up, joined by straight edges round soft corners */
function starRadius(angle) {
  const step = STAR_HALF_STEP;
  // 0 at a tip, `step` at the notch beside it.
  let b = (((angle - Math.PI / 2) % (2 * step)) + 2 * step) % (2 * step);

  if (b > step) b = 2 * step - b;

  // Eases b near a tip and a notch, so each rounds off instead of meeting in a crease.
  const rounding = STAR_ROUNDING * step;
  const soft = (x) => Math.sqrt(x * x + rounding * rounding) - rounding;

  b = (step * soft(b)) / (soft(b) + soft(step - b));

  // The straight line from the tip, STAR_OUTER out at 0, to the notch, STAR_INNER out at `step`, in polar form.
  const sin = Math.sin(step);

  return (
    (STAR_OUTER * STAR_INNER * sin) /
    ((STAR_OUTER - STAR_INNER * Math.cos(step)) * Math.sin(b) +
      STAR_INNER * sin * Math.cos(b))
  );
}

/** Runs `surface` for each vertex of a unit sphere, whose position is its direction from the centre */
function shapeFrom(sphere, surface) {
  const shape = {
    positions: new Float32Array(sphere.length),
    normals: new Float32Array(sphere.length),
  };
  const normals = shape.normals;

  for (let i = 0; i < sphere.length; i += 3) {
    surface(sphere[i], sphere[i + 1], sphere[i + 2], shape, i);

    const length = Math.hypot(normals[i], normals[i + 1], normals[i + 2]);

    put(
      normals,
      i,
      normals[i] / length,
      normals[i + 1] / length,
      normals[i + 2] / length,
    );
  }

  return shape;
}

function put(array, i, x, y, z) {
  array[i] = x;
  array[i + 1] = y;
  array[i + 2] = z;
}
