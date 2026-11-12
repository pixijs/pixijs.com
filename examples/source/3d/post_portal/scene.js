/** The near side's prop: the clay doorway, with an opening and a frame for each shape */

import { Container3D, Geometry3D, Mesh3D, TorusGeometry } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedBox, roundedCylinder } from './theme/shapes';

const SHAPES = ['door', 'arch', 'round'];
const DOOR = { width: 2.4, height: 3.4 };
/** The arch's straight sides stop at its springline, where its half circle starts */
const ARCH = { width: 2.4, springline: 2.2 };
/** The porthole, centred halfway up the door */
const ROUND = { diameter: 2.6, centre: 1.7 };
/** The square frame's bars, and the round frames' tubes */
const BAR = { thickness: 0.32, depth: 0.4, edge: 0.08 };
const TUBE = 0.19;
/** The block the porthole's ring stands in */
const PLINTH = { width: 1.2, height: 0.3, depth: 0.6 };
/** The opening runs this far inside the frame, so no seam shows at its edge */
const OVERLAP = 0.05;

/** Points round an opening's edge, anticlockwise from the front, pushed out by `OVERLAP` */
function openingOutline(shape) {
  const points = [];

  if (shape === 'door') {
    const half = DOOR.width / 2 + OVERLAP;
    const top = DOOR.height + OVERLAP;

    points.push(-half, -OVERLAP, half, -OVERLAP, half, top, -half, top);
  } else if (shape === 'arch') {
    const radius = ARCH.width / 2 + OVERLAP;

    points.push(-radius, -OVERLAP, radius, -OVERLAP);
    for (let i = 0; i <= 24; i++) {
      const angle = (Math.PI * i) / 24;

      points.push(
        radius * Math.cos(angle),
        ARCH.springline + radius * Math.sin(angle),
      );
    }
  } else {
    const radius = ROUND.diameter / 2 + OVERLAP;

    for (let i = 0; i < 48; i++) {
      const angle = (Math.PI * 2 * i) / 48 - Math.PI / 2;

      points.push(
        radius * Math.cos(angle),
        ROUND.centre + radius * Math.sin(angle),
      );
    }
  }

  return new Float32Array(points);
}

/**
 * A flat fan through a convex outline, facing +z
 *
 * Its UVs span the outline's box with v running down, so a texture mapped by them stands upright.
 */
function fanGeometry(outline) {
  const count = outline.length / 2;
  const positions = new Float32Array((count + 1) * 3);
  const normals = new Float32Array((count + 1) * 3);
  const uvs = new Float32Array((count + 1) * 2);
  const indices = new Uint16Array(count * 3);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = outline[i * 2];
    const y = outline[i * 2 + 1];

    positions[0] += x / count;
    positions[1] += y / count;
    positions.set([x, y, 0], (i + 1) * 3);
    indices.set([0, i + 1, ((i + 1) % count) + 1], i * 3);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  for (let i = 0; i <= count; i++) {
    normals[i * 3 + 2] = 1;
    uvs[i * 2] = (positions[i * 3] - minX) / (maxX - minX);
    uvs[i * 2 + 1] = (maxY - positions[i * 3 + 1]) / (maxY - minY);
  }

  return new Geometry3D({ positions, normals, uvs, indices });
}

/** The clay frame round each opening, its threshold at the origin */
function createFrames() {
  const clay = clayMaterial('lilac');
  const bar = (geometry, x, y) =>
    new Mesh3D({ geometry, material: clay, x, y });
  const jamb = roundedBox(
    BAR.thickness,
    DOOR.height + BAR.thickness,
    BAR.depth,
    BAR.edge,
  );
  const jambX = (DOOR.width + BAR.thickness) / 2;
  const column = roundedCylinder(TUBE, ARCH.springline, 0.06);
  const columnX = ARCH.width / 2 + TUBE;
  // A torus lies flat round +y; a quarter turn about x stands it up across the opening.
  const crown = new Mesh3D({
    geometry: new TorusGeometry({
      radius: columnX,
      tube: TUBE,
      arc: Math.PI,
      radialSegments: 16,
      tubularSegments: 32,
    }),
    material: clay,
    y: ARCH.springline,
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
  });
  const ring = new Mesh3D({
    geometry: new TorusGeometry({
      radius: ROUND.diameter / 2 + TUBE,
      tube: TUBE,
      radialSegments: 16,
      tubularSegments: 64,
    }),
    material: clay,
    y: ROUND.centre,
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
  });

  return {
    door: new Container3D({
      children: [
        bar(jamb, -jambX, (DOOR.height + BAR.thickness) / 2),
        bar(jamb, jambX, (DOOR.height + BAR.thickness) / 2),
        bar(
          roundedBox(DOOR.width, BAR.thickness, BAR.depth, BAR.edge),
          0,
          DOOR.height + BAR.thickness / 2,
        ),
      ],
    }),
    arch: new Container3D({
      children: [
        bar(column, -columnX, ARCH.springline / 2),
        bar(column, columnX, ARCH.springline / 2),
        crown,
      ],
    }),
    round: new Container3D({
      children: [
        ring,
        bar(
          roundedBox(PLINTH.width, PLINTH.height, PLINTH.depth, BAR.edge),
          0,
          PLINTH.height / 2,
        ),
      ],
    }),
  };
}

export function createDoorway() {
  const frames = createFrames();
  const opening = (shape) => fanGeometry(openingOutline(shape));
  const openings = {
    door: opening('door'),
    arch: opening('arch'),
    round: opening('round'),
  };

  function showFrame(shape) {
    for (const each of SHAPES) frames[each].visible = each === shape;
  }

  showFrame('door');

  return {
    root: new Container3D({
      children: [frames.door, frames.arch, frames.round],
    }),
    openings,
    showFrame,
  };
}
