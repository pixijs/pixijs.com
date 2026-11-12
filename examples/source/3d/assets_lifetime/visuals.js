/**
 * What the frame draws to show what each way out keeps: in a bay whose castle is out, a see-through ghost while its
 * shape is still on the GPU, a wireframe of its vertex data while only the CPU copy is left, nothing once it's freed,
 * and pink for what a destroy leaked, a ghost for its geometry and a square for its map; under each bay, a tag naming
 * the call and what it kept, what it leaked, or what coming back cost
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Geometry3D, Mesh3D, PlaneGeometry, Vector3 } from '@pixi/3d';

import { createHelperMaterial } from './theme/HelperMaterial';
import { GHOST_OPACITY } from './theme/helpers';
import { LabelLayer } from './theme/LabelLayer';
import { PathHelper } from './theme/PathHelper';

import { WireframeHelper } from './theme/WireframeHelper';
import { NOTHING_LEFT } from './memory';

import { MAP_AT, MAP_SIZE, SLAB_SIZE, TILT_UP } from './scene';

/** A hair under the floor, so a ghost's bottom face hides in it on both backends rather than fighting it */
const SUNK = { x: 0, y: -0.01, z: 0 };
/** A leak's pink, a little stronger than a ghost so it stands out on the checks */
const LEAK_OPACITY = 0.35;
/** A leaked map's pink, stronger again, so it shows as its own square on a ghost whose geometry leaked with it */
const MAP_LEAK_OPACITY = 0.6;
/** The wireframe's bars, in the castle's units */
const WIRE_THICKNESS = 0.012;
/** The slab's outline on the floor, a little outside it, marking the bay while its castle is out */
const EDGE = SLAB_SIZE / 2 + 0.06;
const FOOTPRINT = [
  -EDGE,
  0.01,
  -EDGE,
  EDGE,
  0.01,
  -EDGE,
  EDGE,
  0.01,
  EDGE,
  -EDGE,
  0.01,
  EDGE,
];
/** How far under the slab's front edge each tag hangs, in px */
const TAG_DROP = 34;

/** The tag's second line while the castle is back: what coming back cost */
const BACK = {
  removeChild: 'no upload',
  unload: 're-uploaded',
  destroy: 'rebuilt',
};
/** The tag's second line while the castle is out: which copies of its shape the call kept */
const KEEPS = { gpu: 'keeps GPU+CPU', cpu: 'keeps CPU', none: 'keeps nothing' };
/** The tag's second line, in pink, after a destroy with a flag off: what it left alive */
const LEAKS = {
  geometry: 'leaks geometry',
  texture: 'leaks texture',
  all: 'leaks all',
};

/** Every text a bay's tag can show, the call over a second line, built once so the frame loop only picks one */
function tagTexts(call) {
  const line = (second) => `${call}\n${second}`;

  return {
    gpu: line(KEEPS.gpu),
    cpu: line(KEEPS.cpu),
    none: line(KEEPS.none),
    geometry: line(LEAKS.geometry),
    texture: line(LEAKS.texture),
    all: line(LEAKS.all),
    back: line(BACK[call]),
  };
}

/** What a tag says of a bay whose castle is out: what's left of the castle, or after a leak, which parts leaked */
function outState(held, leak) {
  if (!leak || (held.shape === 'none' && held.map === 'none'))
    return held.shape;
  if (held.shape === 'none') return 'texture';

  return held.map === 'none' ? 'geometry' : 'all';
}

/**
 * Every mesh of `castle` but its map as one shape in the castle's own space, for the ghosts and wireframes to draw
 *
 * The map lies a hair above the slab's top, close enough that the two fight in a see-through ghost, and the slab's
 * top already draws its square.
 */
function mergeShape(castle) {
  let vertices = 0;
  let corners = 0;

  for (const mesh of castle.meshes) {
    if (mesh === castle.mapPlane) continue;
    vertices += mesh.geometry.positions.length / 3;
    corners += mesh.geometry.indices.length;
  }

  const positions = new Float32Array(vertices * 3);
  const indices = new Uint32Array(corners);
  const point = new Vector3();
  let vertex = 0;
  let corner = 0;

  for (const mesh of castle.meshes) {
    if (mesh === castle.mapPlane) continue;
    const from = mesh.geometry.positions;

    mesh.updateLocalTransform();
    for (const index of mesh.geometry.indices)
      indices[corner++] = vertex + index;
    for (let i = 0; i < from.length; i += 3, vertex++) {
      point
        .set(from[i], from[i + 1], from[i + 2])
        .applyAffineMatrix4(mesh.localTransform);
      positions[vertex * 3] = point.x;
      positions[vertex * 3 + 1] = point.y;
      positions[vertex * 3 + 2] = point.z;
    }
  }

  return { positions, indices };
}

export function createVisuals({ app, view3d, stage, bays, leaked, memory }) {
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  // The visuals draw their own copy of the shape, so they never keep a castle's geometry on the GPU or alive. A
  // removeChild bay's castle is always whole, so it's the one to copy.
  const { positions, indices } = mergeShape(bays[0].castle);
  const shape = new Geometry3D({ positions, indices });
  const mapSquare = new PlaneGeometry({ width: MAP_SIZE, height: MAP_SIZE });
  const ink = createHelperMaterial({ color: 'ink', opacity: GHOST_OPACITY });
  const pink = createHelperMaterial({ color: 'accent', opacity: LEAK_OPACITY });
  const mapPink = createHelperMaterial({
    color: 'accent',
    opacity: MAP_LEAK_OPACITY,
  });

  // Every face of a ghost blends, none hiding another, so the slab's top and the bottoms standing on it never fight
  // and the ghost draws the same on WebGPU and WebGL. These are the visuals' own materials rather than the kit's
  // cached `ghostMaterial()`, since a change to that one's state would change every helper sharing it.
  ink.state.depthMask = pink.state.depthMask = false;

  const leftovers = bays.map((bay) => ({
    bay,
    ghost: new Mesh3D({
      geometry: shape,
      material: ink,
      position: SUNK,
      castShadow: false,
      parent: bay.slot,
    }),
    wire: new WireframeHelper({
      positions,
      indices,
      thickness: WIRE_THICKNESS,
      parent: bay.slot,
    }),
    map: new Mesh3D({
      geometry: mapSquare,
      material: mapPink,
      position: MAP_AT,
      rotation: TILT_UP,
      parent: bay.slot,
    }),
    footprint: new PathHelper({
      closed: true,
      dash: 0.2,
      thickness: 0.02,
      parent: bay.slot,
    }).setPoints(FOOTPRINT),
    texts: tagTexts(bay.call),
    tag: labels.add({
      text: bay.call,
      at: {
        x: bay.slot.position.x,
        y: 0,
        z: (SLAB_SIZE / 2) * bay.slot.scale.z,
      },
      offset: { x: 0, y: TAG_DROP },
    }),
  }));
  const left = { shape: 'none', map: 'none' };

  /** Adds what `castle` keeps to `left`, which holds the most of each part any castle keeps */
  function add(castle) {
    const { shape, map } = memory.holding(castle);

    if (left.shape !== 'gpu' && shape !== 'none') left.shape = shape;
    if (left.map !== 'gpu' && map !== 'none') left.map = map;
  }

  /** What's left in a bay whose castle is out: what the castle keeps, or, once it's destroyed, what leaked from it */
  function leftIn(bay) {
    left.shape = left.map = 'none';
    if (bay.castle) add(bay.castle);
    else for (const castle of leaked) add(castle);

    return left;
  }

  app.stage.addChild(labels);

  return {
    update() {
      for (const {
        bay,
        ghost,
        wire,
        map,
        footprint,
        texts,
        tag,
      } of leftovers) {
        const back = bay.castle !== null && bay.castle.root.parent === bay.slot;
        const leak = bay.castle === null && leaked.length > 0;
        const held = back ? NOTHING_LEFT : leftIn(bay);
        const state = back ? 'back' : outState(held, leak);

        footprint.visible = !back;
        ghost.visible = held.shape === 'gpu';
        ghost.material = leak ? pink : ink;
        wire.visible = held.shape === 'cpu';
        wire.color = leak ? 'accent' : 'ink';
        // A map that leaked shows as a square where it lay, over the ghost when the geometry leaked with it.
        map.visible = leak && held.map !== 'none';
        tag.text = texts[state];
        tag.color = state in LEAKS ? 'accent' : null;
      }
      labels.update();
    },
  };
}
