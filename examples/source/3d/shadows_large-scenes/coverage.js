/**
 * What each of the sun's shadow maps covers, worked out the way the engine's shadow pass places them
 *
 * Nothing public reports a cascade's split distances, its square in the light's view or a texel's size, so this
 * follows `computeCascadeSplits`, `computeCascadeMatrix` and `computeFixedBoxMatrix` in the engine's
 * `src/core/render-passes/shadow/csmUtils.ts`: the practical split scheme, a square round each slice's bounding sphere,
 * a fixed box padded 5% a side, and every map's centre snapped to whole texels. It drifts if the engine changes.
 */

import { Box, Matrix4 } from '@pixi/3d';

/** A value that runs linearly over the ground, `x · p.x + z · p.z + c` at a point p */

/** A shadow map's side in texels at each `view3d.shadowQuality`, as its JSDoc lists them */
const MAP_SIZE = { low: 512, medium: 1024, high: 2048, ultra: 4096 };
/** How far the cascades reach when `maxDistance` is unset, the engine's default */
const DEFAULT_REACH = 50;
/** A fixed box's map spans the box and this share of it again on each side, so an edge caster's shadow lands inside */
const BOX_PAD = 0.05;
/** The numbers a measure reads: the camera's and the sun's world matrices, then the view, the camera and the shadow */
const INPUT_COUNT = 32 + 16;

/** What one shadow map covers */

/** Every map the sun draws this frame, and how the light's and the camera's views lie over the ground */

const _splits = [0, 0, 0, 0];
const _inputs = new Float64Array(INPUT_COUNT);
const _box = new Box();
const _world = new Matrix4();
const _toLight = new Matrix4();
const _toView = new Matrix4();
const _cameraToLight = new Matrix4();

/** A coverage to measure into, for ground at height `groundY` */
export function createCoverage(groundY) {
  const maps = Array.from({ length: 4 }, () => ({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    texelX: 0,
    texelY: 0,
    near: 0,
    far: 0,
  }));
  const linear = () => ({ x: 0, z: 0, c: 0 });

  return {
    maps,
    count: 0,
    cascaded: false,
    reach: 0,
    lightX: linear(),
    lightY: linear(),
    depth: linear(),
    groundY,
    inputs: new Float64Array(INPUT_COUNT).fill(NaN),
  };
}

/**
 * Measures where `sun`'s maps lie for `view3d`'s camera now, into `out`, allocating nothing
 *
 * Returns false, and leaves `out` as it was, when nothing it reads has changed since the last call: on most frames the
 * camera, the sun and the settings all hold still.
 */
export function measureCoverage(sun, view3d, out) {
  readInputs(sun, view3d, _inputs);
  if (sameInputs(_inputs, out.inputs)) return false;
  out.inputs.set(_inputs);

  const { camera } = view3d;
  const { shadow } = sun;
  const mapSize = MAP_SIZE[view3d.shadowQuality];
  const l = _toLight.getInverse(sun.getGlobalTransform(_world)).elements;
  const v = _toView.getInverse(camera.getGlobalTransform(_world)).elements;
  const y = out.groundY;

  setLinear(out.lightX, l[0], l[8], l[4] * y + l[12]);
  setLinear(out.lightY, l[1], l[9], l[5] * y + l[13]);
  // The camera looks down its -z, so depth is -z in its view.
  setLinear(out.depth, -v[2], -v[10], -(v[6] * y + v[14]));
  out.cascaded = shadow.cascades !== undefined;

  if (shadow.cascades === undefined) {
    out.count = shadow.bounds ? 1 : 0;
    if (shadow.bounds) measureBox(shadow.bounds, mapSize, out.maps[0]);

    return true;
  }

  const count = shadow.cascades;
  const near = camera.near;
  const reach = Math.min(shadow.maxDistance ?? DEFAULT_REACH, camera.far);
  // Half the view's height and width one metre in front of the camera.
  const tanY = Math.tan((camera.fov * Math.PI) / 360) / camera.zoom;
  const tanX = tanY * (view3d.width / view3d.height);
  const e = _cameraToLight.multiplyMatrices(
    _toLight,
    camera.getGlobalTransform(_world),
  ).elements;

  // The practical split scheme: a blend of even slices and slices that grow by a constant ratio.
  for (let i = 1; i <= count; i++) {
    const t = i / count;

    _splits[i - 1] =
      shadow.lambda * near * Math.pow(reach / near, t) +
      (1 - shadow.lambda) * (near + (reach - near) * t);
  }

  for (let c = 0; c < count; c++) {
    const map = out.maps[c];
    const sliceNear = c === 0 ? near : _splits[c - 1];
    const sliceFar = _splits[c];
    // The square's half-side: the radius of a sphere round the slice, set by its far end's size and its length.
    const halfW = sliceFar * tanX;
    const halfH = sliceFar * tanY;
    const halfDepth = (sliceFar - sliceNear) / 2;
    const r = Math.sqrt(halfW * halfW + halfH * halfH + halfDepth * halfDepth);
    const texel = (2 * r) / mapSize;
    // The slice's middle, on the camera's axis, in the light's view; the square centres there, snapped to a texel.
    const mid = -(sliceNear + sliceFar) / 2;
    const cx = Math.floor((e[8] * mid + e[12]) / texel) * texel;
    const cy = Math.floor((e[9] * mid + e[13]) / texel) * texel;

    map.minX = cx - r;
    map.maxX = cx + r;
    map.minY = cy - r;
    map.maxY = cy + r;
    map.texelX = map.texelY = texel;
    map.near = sliceNear;
    map.far = sliceFar;
  }

  out.count = count;
  out.reach = reach;

  return true;
}

/** Everything {@link measureCoverage} reads, into `out` */
function readInputs(sun, view3d, out) {
  const { camera } = view3d;
  const { shadow } = sun;
  const { bounds } = shadow;

  out.set(camera.getGlobalTransform(_world).elements, 0);
  out.set(sun.getGlobalTransform(_world).elements, 16);
  out[32] = view3d.width;
  out[33] = view3d.height;
  out[34] = camera.fov;
  out[35] = camera.zoom;
  out[36] = camera.near;
  out[37] = camera.far;
  out[38] = MAP_SIZE[view3d.shadowQuality];
  out[39] = shadow.cascades ?? 0;
  out[40] = shadow.maxDistance ?? DEFAULT_REACH;
  out[41] = shadow.lambda;
  // A missing box reads as one with no size at the origin.
  out[42] = bounds?.min.x ?? 0;
  out[43] = bounds?.min.y ?? 0;
  out[44] = bounds?.min.z ?? 0;
  out[45] = bounds?.max.x ?? 0;
  out[46] = bounds?.max.y ?? 0;
  out[47] = bounds?.max.z ?? 0;
}

function sameInputs(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;

  return true;
}

/** A fixed box's map: the box re-boxed along the light's axes, padded, and its centre snapped to a texel */
function measureBox(bounds, mapSize, map) {
  bounds.applyMatrix4(_toLight, _box);

  const { min, max } = _box;
  const halfX = ((max.x - min.x) / 2) * (1 + 2 * BOX_PAD);
  const halfY = ((max.y - min.y) / 2) * (1 + 2 * BOX_PAD);

  map.texelX = (2 * halfX) / mapSize;
  map.texelY = (2 * halfY) / mapSize;

  const cx = Math.floor((min.x + max.x) / 2 / map.texelX) * map.texelX;
  const cy = Math.floor((min.y + max.y) / 2 / map.texelY) * map.texelY;

  map.minX = cx - halfX;
  map.maxX = cx + halfX;
  map.minY = cy - halfY;
  map.maxY = cy + halfY;
  map.near = 0;
  map.far = Infinity;
}

function setLinear(out, x, z, c) {
  out.x = x;
  out.z = z;
  out.c = c;
}
