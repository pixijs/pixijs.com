/**
 * The props: a square field of white clay spheres for the lights to play over, the path each light flies, and a count
 * of the lights reaching the field
 *
 * White clay shows each light's colour truest, and every sphere is lit on the side that faces the lights near it, so
 * the field draws where each light is. One geometry and one material, so the view draws all 121 in one instanced draw.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry } from './theme/shapes';

/** Spheres along each side of the field, and the distance between their centres */
const FIELD_SIDE = 11;
const FIELD_SPACING = 0.8;
/** From the field's centre to its outer spheres' centres */
const FIELD_HALF = ((FIELD_SIDE - 1) * FIELD_SPACING) / 2;
/** Each sphere's radius: small enough that one light's pool spans a few of them */
const SPHERE_RADIUS = 0.25;
/** The height of every sphere's top, where `lightsPerSphere` counts the lights reaching the clay */
export const CLAY_TOP = 2 * SPHERE_RADIUS;

/** Each light circles its place on the spiral: the circle's radius, its speed and how far apart neighbours start */
const CIRCLE_RADIUS = 0.5;
const CIRCLE_SPEED = 0.9;
const CIRCLE_PHASE = 1.7;
/**
 * How far out the spiral of lights reaches, and how fast it turns, in radians a second. With the circle round each
 * place, the last lights fly over the field's outer spheres and never past them
 */
const SPIRAL_RADIUS = FIELD_HALF - CIRCLE_RADIUS;
const SPIRAL_SPIN = 0.15;
/** A steady height, so each light's reach on the clay keeps its size as it drifts */
const LIGHT_HEIGHT = 1.1;
/** The golden angle, which spreads the spiral's places evenly however many there are */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Builds the field of clay spheres, resting on the floor and centred on the origin */
export function createClayField({ parent }) {
  const geometry = clayGeometry('sphere');
  const material = clayMaterial('white');
  const scale = SPHERE_RADIUS / geometry.bounds3D.max.y;
  const spheres = [];

  for (let row = 0; row < FIELD_SIDE; row++) {
    for (let column = 0; column < FIELD_SIDE; column++) {
      spheres.push(
        new Mesh3D({
          geometry,
          material,
          position: {
            x: column * FIELD_SPACING - FIELD_HALF,
            y: SPHERE_RADIUS,
            z: row * FIELD_SPACING - FIELD_HALF,
          },
          scale,
          parent,
        }),
      );
    }
  }

  return spheres;
}

/**
 * Where light `index` of `total` flies at `time`: a place on a sunflower spiral, circled slowly
 *
 * The spiral fills from the centre out, so the first lights stay near the middle and the last ones fly at the edge.
 * It writes into `out` and returns it, so a frame loop allocates nothing.
 */
export function lightPath(index, total, time, out) {
  const radius = SPIRAL_RADIUS * Math.sqrt((index + 0.5) / total);
  const angle = index * GOLDEN_ANGLE + time * SPIRAL_SPIN;
  const circle = time * CIRCLE_SPEED + index * CIRCLE_PHASE;

  return out.set(
    Math.cos(angle) * radius + Math.cos(circle) * CIRCLE_RADIUS,
    LIGHT_HEIGHT,
    Math.sin(angle) * radius + Math.sin(circle) * CIRCLE_RADIUS,
  );
}

/**
 * How many lights reach the average sphere's top, out of the first `shaded`: the ones the view shades
 *
 * The view skips a light on every pixel outside its range before any other work, so a pixel pays only for the shaded
 * lights whose range holds it, or for all of them at `range = 0`. This measures at the sphere tops, not every pixel.
 */
export function lightsPerSphere(spheres, lights, shaded) {
  let reaching = 0;

  for (const sphere of spheres) {
    const { x, z } = sphere.position;

    for (let i = 0; i < shaded; i++) {
      const { range, position } = lights[i];
      const distanceSq =
        (position.x - x) ** 2 +
        (position.y - CLAY_TOP) ** 2 +
        (position.z - z) ** 2;

      if (range === 0 || distanceSq < range * range) reaching++;
    }
  }

  return reaching / spheres.length;
}
