/**
 * A grid of lines laid on a flat patch of ground, for drawing a shadow map's texels where they land
 *
 * The patch starts as a rectangle on the ground and is cut down by straight edges, so it's always convex, and its
 * grid follows two coordinates that run linearly over the ground, one cell per unit. Its corners and grid coordinates
 * are rewritten in place, so a patch that moves allocates nothing. It keeps the scene's fog, so it fades into the haze
 * with the road it lies on.
 *
 * The lines come from a repeating texture whose every mip level draws them the same 2 texels wide. The GPU picks the
 * level where a texel is about a pixel, so a line stays about 2 px wide however big its cell is on screen, and never
 * thickens into a bar that looks like a shadow. Where the cells crowd together in the distance, the small levels fade
 * the lines to a faint tint instead of letting them shimmer.
 *
 * Each set of lines is a mesh of its own, sampling the texture along one axis only, so the GPU picks the level from
 * how fast that axis changes alone. Lines that run away from the camera then stay sharp while the ones across the
 * view melt, which one mesh could only manage with anisotropic filtering.
 */

import { Geometry3D, Material3D, Mesh3D } from '@pixi/3d';

import { CompressedSource, Matrix, Texture } from 'pixi.js';

import { flatOptions, upNormals } from './theme/helpers';
import { screenColor } from './theme/palette';

/** Corners a patch can hold: a rectangle gains at most one at each cut */
const MAX_CORNERS = 12;
/** The line texture's cell at its biggest level, in texels: a cell spans more pixels than this before its lines widen */
const CELL_TEXELS = 512;
/** A line's width in texels at every level, half on each side of the cell's edge, so about 2 px on screen */
const LINE_TEXELS = 2;
/** The most of a cell the lines cover at any level; past it, a crowded far grid fades instead of filling in */
const MOST_COVER = 1 / 10;

let lineTexture = null;

/** Options for {@link GridPatch} */

/** One patch of grid lines; cut it down with {@link GridPatch#keep}, then lay its grid with {@link GridPatch#grid} */
export class GridPatch {
  _geometry;
  /** The lines at whole values of u, then of v */
  _meshes;
  _materials;
  _rect;
  _y = 0;
  /** The corners as x, z pairs, cut from one buffer into the other */
  _corners = new Float64Array(MAX_CORNERS * 2);
  _spare = new Float64Array(MAX_CORNERS * 2);
  _count = 0;
  _color = -1;
  _opacity = -1;

  constructor({ minX, maxX, minZ, maxZ, y, parent }) {
    // Wound to face up, the way the camera sees it.
    this._rect = [minX, minZ, minX, maxZ, maxX, maxZ, maxX, minZ];
    this._y = y;
    this._geometry = new Geometry3D({
      positions: new Float32Array(MAX_CORNERS * 3),
      uvs: new Float32Array(MAX_CORNERS * 2),
      normals: upNormals(MAX_CORNERS),
      indices: fanIndices(MAX_CORNERS),
      dynamic: true,
    });
    // The texture is one row of a cell; the material's UV transform, `(a·u + b·v + tx, c·u + d·v + ty)`, reads it
    // along u for one mesh and along v for the other.
    this._materials = [
      new Matrix(1, 0, 0, 0, 0, 0.5),
      new Matrix(0, 1, 0, 0, 0, 0.5),
    ].map(
      (uvTransform) =>
        // Flat colour, its alpha the texture's lines; unlike the helpers, it keeps the fog.
        new Material3D({
          ...flatOptions(0xffffff),
          baseColorTexture: gridLines(),
          uvTransform,
          alphaMode: 'blend',
          fog: true,
        }),
    );
    this._meshes = this._materials.map(
      (material) =>
        new Mesh3D({
          geometry: this._geometry,
          material,
          castShadow: false,
          receiveShadow: false,
          parent,
        }),
    );
  }

  /** The lines' colour as it shows on screen, 0xRRGGBB */
  set color(value) {
    if (value === this._color) return;
    this._color = value;
    // The materials' emissive groups are always there: flatOptions passes them.
    for (const material of this._materials)
      material.emissive.color = screenColor(value);
  }

  set opacity(value) {
    if (value === this._opacity) return;
    this._opacity = value;
    for (const material of this._materials) material.alpha = value;
  }

  set visible(value) {
    for (const mesh of this._meshes) mesh.visible = value;
  }

  /** Starts the patch again from the whole rectangle */
  reset() {
    this._corners.set(this._rect);
    this._count = 4;

    return this;
  }

  /** Cuts away the part of the patch where `edge` is below 0 */
  keep(edge) {
    const from = this._corners;
    const to = this._spare;
    let count = 0;

    for (let i = 0; i < this._count; i++) {
      const j = (i + 1) % this._count;
      const ax = from[i * 2];
      const az = from[i * 2 + 1];
      const bx = from[j * 2];
      const bz = from[j * 2 + 1];
      const a = edge.x * ax + edge.z * az + edge.c;
      const b = edge.x * bx + edge.z * bz + edge.c;

      if (a >= 0) {
        to[count * 2] = ax;
        to[count * 2 + 1] = az;
        count++;
      }
      if (a >= 0 !== b >= 0 && count < MAX_CORNERS) {
        const t = a / (a - b);

        to[count * 2] = ax + (bx - ax) * t;
        to[count * 2 + 1] = az + (bz - az) * t;
        count++;
      }
    }

    this._corners = to;
    this._spare = from;
    this._count = count;

    return this;
  }

  /** Lays the grid, `u` and `v` running one cell per unit, and uploads the patch; one with no area hides */
  grid(u, v) {
    const count = this._count;

    this.visible = count >= 3;
    if (count < 3) return;

    const positions = this._geometry.positions;
    // The constructor passed UVs, so the geometry has them.
    const uvs = this._geometry.uvs;

    for (let i = 0; i < MAX_CORNERS; i++) {
      // Corners past the last collapse onto it, so the fan's spare triangles draw nothing.
      const k = Math.min(i, count - 1);
      const x = this._corners[k * 2];
      const z = this._corners[k * 2 + 1];

      positions[i * 3] = x;
      positions[i * 3 + 1] = this._y;
      positions[i * 3 + 2] = z;
      uvs[i * 2] = u.x * x + u.z * z + u.c;
      uvs[i * 2 + 1] = v.x * x + v.z * z + v.c;
    }
    this._geometry.attributes.aPosition.buffer.update();
    this._geometry.attributes.aUV.buffer.update();
  }
}

/**
 * The line texture: one row of a cell, white, with a line at the cell's edge, so the material's colour shows
 *
 * Its mip levels are built here rather than averaged down, so each draws the line `LINE_TEXELS` wide. A level too
 * small to keep the lines under `MOST_COVER` of the cell draws them fainter instead.
 */
function gridLines() {
  if (lineTexture) return lineTexture;

  const levels = [];

  for (let size = CELL_TEXELS; size >= 1; size >>= 1) {
    const level = new Uint8Array(size * 4).fill(255);
    const lineTexels = Math.min(LINE_TEXELS, size);
    const alpha = Math.round(
      255 * Math.min(1, (MOST_COVER * size) / lineTexels),
    );

    for (let x = 0; x < size; x++) {
      // Half the line at each end, so with the texture repeating, the line sits on the cell's edge.
      const onLine = x < lineTexels / 2 || x >= size - lineTexels / 2;

      level[x * 4 + 3] = onLine ? alpha : 0;
    }
    levels.push(level);
  }
  lineTexture = new Texture({
    source: new CompressedSource({
      resource: levels,
      width: CELL_TEXELS,
      height: 1,
      format: 'rgba8unorm',
      addressMode: 'repeat',
      scaleMode: 'linear',
    }),
  });

  return lineTexture;
}

/** Triangles fanning out from the first corner */
function fanIndices(corners) {
  const indices = new Uint16Array((corners - 2) * 3);

  for (let i = 0; i < corners - 2; i++) indices.set([0, i + 1, i + 2], i * 3);

  return indices;
}
