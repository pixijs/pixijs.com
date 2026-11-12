/**
 * The teaching helpers' shared colours, materials and geometry
 *
 * Every helper draws as light, not clay: flat colour with no shading, shadows or fog, so a reader never takes one for
 * part of the scene. Axes follow the usual convention, x red, y green and z blue. Everything else is `'ink'`, the
 * theme's soft text colour, `'accent'`, the brand's hot pink, or `'haze'`, the scene's background, for a rim that
 * parts a mark from what's behind it. The helpers themselves are classes in their own files, `Helper.ts` and the
 * `*Helper.ts` beside it; this module holds what they share, and the kit owns all of it until {@link releaseHelpers}.
 */

import {
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  Material3D,
  SphereGeometry,
} from '@pixi/3d';

import { solidMeshDescriptor } from '@pixi/3d/extras';
import { State } from 'pixi.js';

import { BRAND, mixColor, screenColor, THEMES } from './palette';

/** The axis colours, as they show on screen */
export const AXIS_COLORS = { x: 0xff5c5c, y: 0x3fd47e, z: 0x3b9bff };

/** A helper colour: an axis, the theme's ink or haze, the brand accent, or any 0xRRGGBB */

/** A ghost's opacity: enough to read the shape, little enough to see the real one through it */
export const GHOST_OPACITY = 0.22;
/** An arrow head's length, in shaft thicknesses; an angle's head too */
export const HEAD_LENGTH = 4;
/** An arrow head's width, in shaft thicknesses */
export const HEAD_WIDTH = 3;

/** The kit's shared helper geometry, by name */

/** Something the kit repaints when the theme moves: a live `HelperMaterial`, or a helper drawn in a pass */

let darkness = 0;
const materials = new Map();
const passMaterials = new Map();
const geometries = new Map();
const resources = new Map();
/** The glow controls of the cached `'ink'` and `'haze'` materials, which a darkness change re-tints */
const inkGlows = [];
const hazeGlows = [];
/** Repainted on every darkness change */
const watchers = new Set();
/** Repainted when the darkness crosses 0.5, the side a pass material's baked colour is picked for */
const sideWatchers = new Set();

/** The screen colour of a helper colour on the current theme */
export function helperColor(color) {
  return colorAt(color, darkness);
}

/**
 * The flat, unlit material every helper draws with, shared and cached per colour, opacity, x-ray and pass
 *
 * All its colour is emissive over a black base with no specular, so the lights add nothing and it shows exactly as
 * `color`. An `opacity` under 1 blends and draws both sides; it's rounded to 0.01. `xray` draws it after the opaque
 * scene with no depth test, so it shows through whatever is in front of it. A `pass` draws it in that `MeshPass`
 * only, in solid colour (an InsetView's helpers): opacity is ignored there, and an `'ink'` or `'haze'` one takes the
 * colour of the nearer theme, so a helper drawn in a pass repaints when the darkness crosses 0.5. The
 * kit owns every one: call {@link releaseHelpers} in your teardown.
 */
export function helperMaterial(color, opacity = 1, xray = false, pass = null) {
  if (pass !== null) return passMaterial(color, xray, pass);

  const alpha = Math.round(opacity * 100) / 100;
  const key = `${color}:${alpha}:${xray ? 'xray' : ''}`;
  let material = materials.get(key);

  if (!material) {
    material = new Material3D({
      ...flatOptions(helperColor(color)),
      alphaMode: alpha < 1 || xray ? 'blend' : 'opaque',
      alpha,
      doubleSided: alpha < 1,
    });
    if (xray) material.state.depthTest = false;
    materials.set(key, material);
    // flatOptions passes an emissive group, so its controls are always there.
    if (color === 'ink') inkGlows.push(material.emissive);
    else if (color === 'haze') hazeGlows.push(material.emissive);
  }

  return material;
}

/** A see-through ink copy for a mesh's earlier pose: share the mesh's geometry and give the copy this material */
export function ghostMaterial() {
  return helperMaterial('ink', GHOST_OPACITY);
}

/**
 * One of the kit's shared helper shapes, built on first use: `'shaft'`, a cylinder along +y, unit long and unit
 * radius, centred on its middle; `'head'`, a cone the same way; `'dot'`, a sphere of unit radius; `'bar'`, a unit cube
 */
export function helperGeometry(name) {
  let geometry = geometries.get(name);

  if (!geometry) {
    geometry = buildGeometry(name);
    geometries.set(name, geometry);
  }

  return geometry;
}

/**
 * A geometry, texture or anything else helper modules share, built on first use and kept by the kit until
 * {@link releaseHelpers} destroys it; pick a `key` no other module uses, such as `'dot:rim'`
 */
export function sharedHelperResource(key, create) {
  let resource = resources.get(key);

  if (!resource) {
    resource = create();
    resources.set(key, resource);
  }

  return resource;
}

/**
 * Repaints `watcher` whenever the theme moves, until {@link unwatchHelperTheme}
 *
 * With `crossing: true`, only when the darkness crosses 0.5, for a helper drawn in a pass, whose colour is baked into
 * its shader. `HelperMaterial` and `Helper` call it; an example doesn't need to.
 */
export function watchHelperTheme(watcher, crossing = false) {
  (crossing ? sideWatchers : watchers).add(watcher);
}

/** Stops repainting `watcher` on theme changes */
export function unwatchHelperTheme(watcher) {
  watchers.delete(watcher);
  sideWatchers.delete(watcher);
}

/** Moves the ink and haze helpers between the light theme (0) and the dark one (1); `ThemeStage` calls it */
export function setHelperDarkness(t) {
  if (t === darkness) return;

  const crossed = side(t) !== side(darkness);

  darkness = t;

  const ink = screenColor(helperColor('ink'));
  const haze = screenColor(helperColor('haze'));

  // A fade or a day-night cycle calls this every frame, so nothing here makes an entry array or an iterator.
  for (let i = 0; i < inkGlows.length; i++) inkGlows[i].color = ink;
  for (let i = 0; i < hazeGlows.length; i++) hazeGlows[i].color = haze;
  watchers.forEach(repaintWatcher);
  if (crossed) sideWatchers.forEach(repaintWatcher);
}

/** Destroys every cached helper material, geometry and shared resource; call it after `view3d.unload()` */
export function releaseHelpers() {
  for (const material of materials.values()) material.destroy();
  for (const material of passMaterials.values()) material.destroy();
  for (const geometry of geometries.values()) geometry.destroy();
  for (const resource of resources.values()) resource.destroy();
  materials.clear();
  passMaterials.clear();
  geometries.clear();
  resources.clear();
  inkGlows.length = 0;
  hazeGlows.length = 0;
}

/**
 * A normal buffer of `vertices` +y normals: helper shading ignores normals, but the solid shader a pass draws with
 * reads the attribute, so every geometry a helper builds carries one, filled once
 */
export function upNormals(vertices) {
  const normals = new Float32Array(vertices * 3);

  for (let i = 1; i < normals.length; i += 3) normals[i] = 1;

  return normals;
}

/** The `Material3D` options of a flat helper material that shows on screen as `color` */
export function flatOptions(color) {
  return {
    baseColor: 0x000000,
    roughness: 1,
    specular: { factor: 0 },
    emissive: { color: screenColor(color) },
    fog: false,
  };
}

function colorAt(color, t) {
  if (typeof color === 'number') return color;
  if (color === 'ink')
    return mixColor(THEMES.light.inkSoft, THEMES.dark.inkSoft, t);
  if (color === 'haze') return mixColor(THEMES.light.haze, THEMES.dark.haze, t);
  if (color === 'accent') return BRAND.hotPink;

  return AXIS_COLORS[color];
}

function repaintWatcher(watcher) {
  watcher.repaint();
}

/** 0 on the light half of a fade, 1 on the dark half */
function side(t) {
  return t < 0.5 ? 0 : 1;
}

function passMaterial(color, xray, pass) {
  const themed = color === 'ink' || color === 'haze';
  const key = `${color}:${xray ? 'xray' : ''}:${pass}${themed ? `:${side(darkness)}` : ''}`;
  let material = passMaterials.get(key);

  if (!material) {
    const screen = colorAt(color, themed ? side(darkness) : darkness);
    let state;

    if (xray) {
      state = new State();
      state.depthTest = false;
      state.depthMask = false;
      state.culling = true;
    }
    material = new Material3D({
      ...flatOptions(screen),
      passes: {
        [pass]: {
          shaderDescriptor: solidMeshDescriptor({ color: screen }),
          state,
        },
      },
    });
    material.disablePass('opaque');
    passMaterials.set(key, material);
  }

  return material;
}

function buildGeometry(name) {
  if (name === 'shaft')
    return new CylinderGeometry({
      radiusTop: 1,
      radiusBottom: 1,
      height: 1,
      radialSegments: 12,
    });
  if (name === 'head')
    return new ConeGeometry({ radius: 1, height: 1, radialSegments: 16 });
  if (name === 'dot')
    return new SphereGeometry({
      radius: 1,
      widthSegments: 16,
      heightSegments: 12,
    });

  return new CubeGeometry({ width: 1, height: 1, depth: 1 });
}
