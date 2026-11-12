/**
 * The props: the bays, the clay castle each one holds, with its own painted map, and the camera that frames them
 *
 * Every castle builds each geometry, material and texture it uses and shares none of them, with the kit or with
 * another castle, so a destroy flag frees only what that castle made.
 */

import {
  Box,
  ConeGeometry,
  Container3D,
  Mesh3D,
  PlaneGeometry,
} from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { CanvasSource, Texture } from 'pixi.js';

import { createClayMaterial } from './theme/clay';

import { fitPortrait } from './theme/fitPortrait';
import { BRAND, CLAY, cssColor, mixColor } from './theme/palette';
import { roundedBox, roundedCylinder } from './theme/shapes';

/** The three ways a castle leaves the scene, one bay each, left to right */
export const CALLS = ['removeChild', 'unload', 'destroy'];

/** A place on the floor, the way its castle leaves the scene, and the castle, `null` once destroyed */

/**
 * A castle and everything it built
 *
 * The castle owns every resource in these lists and nothing else uses them, which is what makes it safe to destroy
 * them all with it, and what lets a leak be freed afterwards: the lists still reach what a destroy left.
 */

/** Bay centres apart, and the castles' size in them, so all three fit side by side */
const BAY_GAP = 3.2;
const BAY_SCALE = 0.66;
/** The pane's width and its gap to the screen's right edge, in px: the strip a wide screen keeps free for it */
const PANE_ROOM = 272;
/**
 * The narrowest view, width over height, the row fits across from the landscape distance. A narrower one backs off
 * with the pane above the row; low enough that on a phone held upright the row fills the width, so the tags keep apart.
 */
const FIT_ASPECT = 1.35;
/** Px at the top of a narrower view kept free: the bays centre in the band under it, clear of the open pane */
const PANE_CLEAR = 300;
/** The slab's top, where the keep, the towers and the map stand, and its side */
const SLAB_TOP = 0.36;
export const SLAB_SIZE = 3.6;
/** The painted map's side, in world units and in pixels */
export const MAP_SIZE = 3.2;
const MAP_PIXELS = 512;
/** Facets round a tower and a roof: enough that they read as round, few enough that the wireframe stays clear */
const ROUND_SEGMENTS = 14;

/** Just above the slab, so the map never fights its top face */
export const MAP_AT = { x: 0, y: SLAB_TOP + 0.004, z: 0 };
export const TILT_UP = { x: -Math.PI / 2, y: 0, z: 0 };
const TURN_SIDEWAYS = { x: 0, y: Math.PI / 2, z: 0 };

/** A point on the slab, in world units across it, as a pixel on its map */
function toPixel(world) {
  return (world / MAP_SIZE + 0.5) * MAP_PIXELS;
}

/**
 * The castle's map: a courtyard and a path on a 2D canvas, edged in purple
 *
 * The texture is built from the canvas rather than with pixi's `Texture.from`, which would also file it in pixi's
 * global `Cache`: a reference outside the castle that stays until the texture itself is destroyed.
 */
function paintMap() {
  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = MAP_PIXELS;
  // Keeps the canvas in CPU memory, where Chrome would often move a 2D canvas to the GPU, so the CPU copy the pane
  // counts is really there. A new canvas has no other kind of context yet, so it always returns one.
  const context = canvas.getContext('2d', { willReadFrequently: true });

  context.fillStyle = cssColor(mixColor(CLAY.lilac, BRAND.white, 0.6));
  context.fillRect(0, 0, MAP_PIXELS, MAP_PIXELS);
  context.fillStyle = cssColor(CLAY.lilac);
  context.beginPath();
  context.arc(toPixel(0), toPixel(0.2), MAP_PIXELS * 0.3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = cssColor(BRAND.purple);
  context.fillRect(
    toPixel(-0.22),
    toPixel(-0.1),
    toPixel(0.22) - toPixel(-0.22),
    MAP_PIXELS,
  );
  context.strokeStyle = cssColor(BRAND.purple);
  context.lineWidth = MAP_PIXELS / 56;
  context.strokeRect(
    MAP_PIXELS * 0.03,
    MAP_PIXELS * 0.03,
    MAP_PIXELS * 0.94,
    MAP_PIXELS * 0.94,
  );

  return new Texture({
    source: new CanvasSource({ resource: canvas, autoGenerateMipmaps: true }),
  });
}

/** Builds a castle from scratch: its geometry, its clay and its painted map, each listed as it's made */
export function createCastle() {
  const castle = {
    root: new Container3D({ label: 'castle' }),
    meshes: [],
    geometries: [],
    materials: [],
    textures: [],
  };

  function geometry(made) {
    castle.geometries.push(made);

    return made;
  }
  function material(options) {
    const made = createClayMaterial(options);

    castle.materials.push(made);
    if (options.baseColorTexture)
      castle.textures.push(options.baseColorTexture);

    return made;
  }
  function mesh(shape, clay, position, rotation) {
    const made = new Mesh3D({
      geometry: shape,
      material: clay,
      position,
      rotation,
      parent: castle.root,
    });

    castle.meshes.push(made);

    return made;
  }

  const slab = geometry(roundedBox(SLAB_SIZE, SLAB_TOP, SLAB_SIZE, 0.14, 1));
  // The plane lies in its xy with +z facing out; tipped back, it faces up, and `flipV` puts the canvas's top edge at
  // the back.
  const plane = geometry(
    new PlaneGeometry({ width: MAP_SIZE, height: MAP_SIZE, flipV: true }),
  );
  const keep = geometry(roundedBox(1.0, 1.2, 1.0, 0.12, 1));
  const tower = geometry(roundedCylinder(0.28, 1.4, 0.07, ROUND_SEGMENTS, 1));
  const roof = geometry(
    new ConeGeometry({
      radius: 0.38,
      height: 0.55,
      radialSegments: ROUND_SEGMENTS,
    }),
  );
  const wall = geometry(roundedBox(2.2, 0.55, 0.22, 0.06, 1));
  const white = material({ color: 'white' });
  const purple = material({ color: 'purple' });
  const pink = material({ color: 'pink' });

  mesh(slab, material({ color: CLAY.lilac }), { x: 0, y: SLAB_TOP / 2, z: 0 });
  const mapPlane = mesh(
    plane,
    material({ color: 'white', baseColorTexture: paintMap() }),
    MAP_AT,
    TILT_UP,
  );

  // It lies on the slab, so it has nothing to shade.
  mapPlane.castShadow = false;
  mesh(keep, white, { x: 0, y: SLAB_TOP + 0.6, z: -0.55 });
  for (const x of [-1.3, 1.3]) {
    for (const z of [-1.3, 1.3]) {
      mesh(tower, purple, { x, y: SLAB_TOP + 0.7, z });
      mesh(roof, pink, { x, y: SLAB_TOP + 1.4 + 0.275, z });
    }
    mesh(wall, white, { x, y: SLAB_TOP + 0.275, z: 0 }, TURN_SIDEWAYS);
  }
  mesh(wall, white, { x: 0, y: SLAB_TOP + 0.275, z: -1.3 });

  return { ...castle, mapPlane };
}

/** Lays a bay for each call in a row under `parent`, each holding a castle of its own */
export function createBays(parent) {
  return CALLS.map((call, i) => {
    const slot = new Container3D({
      label: call,
      position: { x: (i - 1) * BAY_GAP, y: 0, z: 0 },
      scale: BAY_SCALE,
      parent,
    });
    const castle = createCastle();

    slot.addChild(castle.root);

    return { call, slot, castle };
  });
}

/** Points the camera at the row of bays, and keeps the row whole and clear of the pane on any screen */
export function frameBays(app, view3d, stage) {
  // Pinned round the bays, so the shadow map doesn't refit as castles leave and come back.
  stage.key.shadow.bounds = Box.fromCenterSize(
    { x: 0, y: 0.8, z: 0 },
    { x: 10.5, y: 2, z: 3 },
  );
  view3d.camera.fov = 40;
  view3d.camera.position.set(0, 4.32, 10.36);

  // The middle bay, so a drag turns the row round its middle castle.
  const orbit = new OrbitCamera({
    view: view3d,
    target: { x: 0, y: 0.65, z: 0 },
    enableDamping: true,
    enablePan: false,
    minDistance: 6,
    maxDistance: 16,
    maxPolarAngle: Math.PI * 0.45,
  });

  // A portrait screen is narrower than the row, so the camera and the fog back off until it fits, under the pane.
  const fit = fitPortrait({
    renderer: app.renderer,
    orbit,
    stage,
    minAspect: FIT_ASPECT,
    clearTop: PANE_CLEAR,
  });

  // The fit reads the view's size, so `layout` runs it, after the view follows the screen again and before a wide
  // screen stretches it, rather than the fit's own resize listener.
  fit.stop();

  const layout = () => {
    const { width, height } = app.screen;
    // The pane's room, or as much of it as a screen only a little wider than the row can spare.
    const room = Math.max(0, Math.min(PANE_ROOM, width - FIT_ASPECT * height));

    view3d.autoResize = true;
    view3d.position.x = -room;
    fit.refit();
    // A wide screen has the pane beside the row. The view reaches past the screen's left edge by the pane's room,
    // so its middle, where the camera looks, lands mid-way across the space left of the pane, while the orbit still
    // turns round the middle castle. The engine draws only the part on screen.
    if (room > 0) view3d.setSize(width + room, height);
  };

  layout();
  app.renderer.on('resize', layout);
  orbit.update();
}
