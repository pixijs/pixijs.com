/**
 * The bus: a clay bus on a loop round the town's park, the one thing that moves at rest
 *
 * It drives in and out of the sharp band, so it blurs and sharpens with its depth as it goes.
 */

import { Container3D } from '@pixi/3d';

import { BRAND } from './theme/palette';
import { roundedBox, roundedCylinder } from './theme/shapes';
import { addClay } from './scene';

/**
 * The bus, its length along z, in layers: a pink body, a dark band of windows with a pale windscreen across its front,
 * and a pink roof set in from the band, so from high up the windows ring the roof and the windscreen shows its heading
 */
const BUS = {
  width: 0.72,
  length: 1.6,
  body: 0.3,
  windows: 0.18,
  windscreen: 0.28,
  roof: 0.06,
  clearance: 0.09,
};
/** How far the band of windows sits in from the body's sides, and the roof in from the band's */
const BUS_INSET = { windows: 0.02, roof: 0.08 };
/** The wheels' radius, and the quarter turn about z that runs a wheel's axle across the bus */
const WHEEL = { radius: 0.13, turn: { x: 0, y: 0, z: Math.PI / 2 } };
/** The loop round the park: a rounded rectangle's half sizes and corner radius, and its speed in units a second */
const ROUTE = { halfX: 2.6, halfZ: 7.5, radius: 1, speed: 2.2 };

/**
 * A pink bus on a loop round the park that starts at the near-right corner, heading away; `drive(time)` puts it where
 * it is `time` seconds into its loop and allocates nothing
 */
export function createBus() {
  const root = new Container3D({ label: 'bus' });
  const { width, length, body, windows, windscreen, roof, clearance } = BUS;
  const band = {
    width: width - 2 * BUS_INSET.windows,
    length: length - 2 * BUS_INSET.windows,
    y: clearance + body,
  };
  const inset = 2 * BUS_INSET.roof;
  // Over the band's front end and just proud of it, so it shows from above and from the side.
  const glass = roundedBox(band.width + 0.02, windows + 0.01, windscreen, 0.03);
  const top = roundedBox(
    band.width - inset,
    roof,
    band.length - windscreen - inset,
    0.03,
  );
  const wheel = roundedCylinder(WHEEL.radius, 0.1, 0.03);

  addClay(root, roundedBox(width, body, length, 0.1), 'pink', {
    x: 0,
    y: clearance + body / 2,
    z: 0,
  });
  addClay(root, roundedBox(band.width, windows, band.length, 0.04), BRAND.ink, {
    x: 0,
    y: band.y + windows / 2,
    z: 0,
  });
  addClay(root, glass, 'paleSky', {
    x: 0,
    y: band.y + windows / 2,
    z: (band.length - windscreen) / 2,
  });
  addClay(root, top, 'pink', {
    x: 0,
    y: band.y + windows + roof / 2,
    z: -windscreen / 2,
  });
  // One at each corner, just proud of the sides.
  for (let i = 0; i < 4; i++) {
    const at = {
      x: (i < 2 ? -1 : 1) * (width / 2 - 0.03),
      y: WHEEL.radius,
      z: (i % 2 === 0 ? -1 : 1) * (length / 2 - 0.32),
    };

    addClay(root, wheel, BRAND.ink, at, { rotation: WHEEL.turn });
  }

  const { halfX, halfZ, radius, speed } = ROUTE;
  const straights = [2 * (halfZ - radius), 2 * (halfX - radius)];
  const corner = (Math.PI / 2) * radius;
  const lap = 2 * (straights[0] + straights[1]) + 4 * corner;

  function drive(time) {
    let along = (time * speed) % lap;
    // Where the leg it's on starts, and its heading; each corner turns a quarter left, toward (dz, −dx).
    let x = halfX;
    let z = halfZ - radius;
    let dx = 0;
    let dz = -1;

    for (let leg = 0; ; leg++) {
      const straight = straights[leg % 2];

      if (along < straight) {
        x += dx * along;
        z += dz * along;
        break;
      }
      x += dx * straight;
      z += dz * straight;
      along -= straight;

      const nx = dz;
      const nz = -dx;

      if (along < corner) {
        const turn = along / radius;
        const cos = Math.cos(turn);
        const sin = Math.sin(turn);

        x += nx * radius * (1 - cos) + dx * radius * sin;
        z += nz * radius * (1 - cos) + dz * radius * sin;
        dx = dx * cos + nx * sin;
        dz = dz * cos + nz * sin;
        break;
      }
      x += (nx + dx) * radius;
      z += (nz + dz) * radius;
      dx = nx;
      dz = nz;
      along -= corner;
    }
    root.position.set(x, 0, z);
    // rotation.y turns the bus's length, its +z, to (sin, cos) on the floor.
    root.rotation.y = Math.atan2(dx, dz);
  }

  return { root, drive };
}
