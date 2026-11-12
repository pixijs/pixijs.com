/**
 * The gallery's props: fifteen stations of clay, each the subject of one visual or a few, and the motion that keeps
 * them live
 *
 * A station is a Container3D that `placeStations` (`layouts.ts`) moves to its cell. What stands in it is placed in
 * its own space, so a new layout moves each station whole.
 */

import {
  Container3D,
  IcosahedronGeometry,
  Material3D,
  Mesh3D,
  Model3D,
  SpotLight,
} from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { BRAND } from './theme/palette';

import { clayGeometry } from './theme/shapes';

/** Every station, in the order the wide layout fills its grid: left to right, the back row first */
export const STATIONS = [
  'orbit',
  'lamp',
  'lens',
  'rig',
  'measure',
  'turn',
  'lean',
  'hit',
  'tap',
  'vertices',
  'wire',
  'normals',
  'struck',
  'bounds',
  'mark',
];

/** Fox.glb is modelled about 79 units tall; this stands it a little over a unit, to fit its cell */
const FOX_SCALE = 1.1 / 79;
/** The fox's turn about y, in radians: nearly side-on to the camera, so its legs and its bones read in profile */
const FOX_TURN = 1.35;
/** The spot's height over its station's floor */
export const LAMP_HEIGHT = 1.9;
/** The moon's distance from the sun, and the height it circles at */
export const ORBIT_RADIUS = 1;
export const ORBIT_HEIGHT = 0.7;
/** Seconds the moon takes to go round */
export const ORBIT_LAP = 6;
/** The marked ball's height over its station's floor, which it bobs about */
const MARK_HEIGHT = 0.7;

/** Builds every station under `root`, at the origin until `placeStations` lays them out */
export function createGallery(root, foxSource) {
  const stations = Object.fromEntries(
    STATIONS.map((name) => [
      name,
      new Container3D({ label: name, parent: root }),
    ]),
  );
  const pivot = new Container3D({
    position: { x: 0, y: ORBIT_HEIGHT, z: 0 },
    parent: stations.orbit,
  });
  const lamp = new SpotLight({
    color: BRAND.orange,
    intensity: 28,
    range: 4,
    coneAngle: 24,
    penumbra: 0.35,
  });

  // Lights face their local -z, so a quarter turn about x points it straight down.
  lamp.position.set(0, LAMP_HEIGHT, 0);
  lamp.rotation.x = -Math.PI / 2;
  stations.lamp.addChild(lamp);
  for (const material of foxSource.materials)
    if (material instanceof Material3D) material.roughness = 1;

  const capsule = clay('capsule', 'lilac', stations.lean, 0, 0.6, 0);
  const puck = clay('puck', 'white', stations.tap, 0, 0.3, 0);

  // A wide, low drum, so a tap's ring has room on its top.
  puck.scale.set(1.5, 1, 1.5);

  // It leans about its foot.
  capsule.origin.set(0, -0.5, 0);

  return {
    stations,
    cube: clay('cube', 'sky', stations.turn, 0, 0.5, 0),
    capsule,
    ball: clay('sphere', 'paleSky', stations.hit, 0, 0.6, 0, 1.15),
    puck,
    sun: clay('puck', 'orange', stations.orbit, 0, 0.23, 0, 0.75),
    pivot,
    moon: clay('sphere', 'lilac', pivot, ORBIT_RADIUS, 0, 0, 0.34),
    block: clay('cube', 'white', stations.measure, 0, 0.45, 0, 0.9),
    gem: clay('octahedron', 'purple', stations.vertices, 0, 0.65, 0, 1, 'low'),
    torus: clay('torus', 'sky', stations.wire, 0, 0.75, 0, 1.4, 'low'),
    pill: clay(
      'capsule',
      'palePink',
      stations.normals,
      0,
      0.75,
      0,
      1.15,
      'low',
    ),
    icosahedron: new Mesh3D({
      geometry: new IcosahedronGeometry({ radius: 0.6, detail: 1 }),
      material: clayMaterial('orange'),
      position: { x: 0, y: 0.7, z: 0 },
      parent: stations.struck,
    }),
    bubble: clay('octahedron', 'pink', stations.bounds, 0, 0.9, 0, 0.75),
    lamp,
    pyramid: clay('pyramid', 'paleSky', stations.lens, 0.55, 0.4, 0, 0.8),
    fox: new Model3D({
      source: foxSource,
      autoUpdate: false,
      autoPlay: 'Survey',
      scale: FOX_SCALE,
      rotation: { x: 0, y: FOX_TURN, z: 0 },
      position: { x: -0.1, y: 0, z: 0.1 },
      parent: stations.rig,
    }),
    marked: clay('sphere', 'palePink', stations.mark, 0, MARK_HEIGHT, 0, 0.8),
  };
}

/** The props' own motion at `time` seconds: turns, a lean, an orbit, a stretch and bobs, so every visual moves */
export function moveGallery(scene, time) {
  scene.cube.rotation.y = 0.8 + Math.sin(time * 0.6) * 0.6;
  scene.capsule.rotation.z = -(0.5 + Math.sin(time * 0.8) * 0.2);
  scene.pivot.rotation.y = (time / ORBIT_LAP) * Math.PI * 2;
  scene.sun.rotation.y = time * 0.4;
  scene.block.scale.x = 0.9 * (1.1 + 0.25 * Math.sin(time * 0.9));
  scene.gem.rotation.y = time * 0.35;
  scene.torus.rotation.set(
    Math.PI / 2 - 0.5 + Math.sin(time * 0.5) * 0.2,
    time * 0.3,
    0,
  );
  scene.pill.rotation.set(0.25, time * 0.4, 0);
  scene.icosahedron.rotation.set(0.3, time * 0.25, 0);
  scene.bubble.position.y = 0.9 + Math.sin(time * 1.2) * 0.1;
  scene.bubble.rotation.y = time * 0.5;
  scene.lamp.coneAngle = 24 + Math.sin(time * 0.6) * 5;
  scene.pyramid.rotation.y = time * 0.3;
  scene.marked.position.y = MARK_HEIGHT + Math.sin(time * 0.9) * 0.15;
}

/** A clay shape in `parent`'s space, scaled evenly */
function clay(shape, color, parent, x, y, z, scale = 1, detail = 'high') {
  return new Mesh3D({
    geometry: clayGeometry(shape, detail),
    material: clayMaterial(color),
    position: { x, y, z },
    scale,
    parent,
  });
}
