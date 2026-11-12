/**
 * A mesh's triangle edges, drawn as thin bars over its surface, for showing the triangles a shape is made of
 *
 * Every edge draws once, however many triangles share it, and each end stands a little off the surface along the
 * normal there, so the bars never fight the faces they outline. All of it is one {@link BarsGeometry}, drawn in one
 * call.
 */

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

/** Options for {@link WireframeHelper}: a `geometry`, or the arrays */

/**
 * How close two positions are to count as one, as a share of the shape's largest coordinate: a round shape's seam
 * repeats its first ring of vertices, and as `sin(2π)` isn't quite 0, a seam vertex can sit 1e-16 from its twin
 */
const WELD = 1e-6;
const NONE = new Float32Array(0);

/**
 * Every triangle edge of a geometry once, as thin bars lifted off the surface
 *
 * Give it a `geometry`, or `positions`, `indices` and `normals`, and add it as the mesh's child so it moves with the
 * mesh. Edges whose two ends sit at the same positions draw once, so a cube's 24 vertices give 18 edges: the 12 box
 * edges and a diagonal across each face. When the positions or normals change in place,
 * {@link WireframeHelper#update} moves the bars; new indices or a new shape need {@link WireframeHelper#rebuild}.
 * @example
 * ```ts
 * const wire = new WireframeHelper({ geometry: mesh.geometry, parent: mesh });
 *
 * wire.color = 'accent';
 * wire.rebuild(next.positions, next.indices, next.normals);
 * ```
 */
export class WireframeHelper extends Helper {
  _lift;
  _mesh;
  _thickness = 0.012;
  _bars;
  _positions = NONE;
  _indices;
  _normals;
  /** Each vertex's corner, numbering the distinct positions */
  _cornerOf = new Uint32Array(0);
  /** Each corner's first vertex, where its position is read */
  _cornerVertex = new Uint32Array(0);
  /** Each edge's two corners */
  _edges = new Uint32Array(0);
  /** Each corner's bar end, xyz: its position lifted `lift` along its vertices' normals, averaged */
  _ends = new Float32Array(0);
  _edgeCount = 0;
  _triangleCount = 0;

  constructor({
    geometry,
    positions = geometry?.positions,
    indices = geometry?.indices,
    normals = geometry?.normals,
    lift = 0.004,
    thickness = 0.012,
    ...options
  } = {}) {
    super(options, 'ink');

    this._lift = lift;
    this._thickness = thickness;
    this._findEdges(positions ?? NONE, indices, normals);
    this._bars = new BarsGeometry(Math.max(this._edgeCount, 1));
    this._mesh = this._addPart(this._bars);
    this._draw();
  }

  /** How many bars it draws, one an edge */
  get edgeCount() {
    return this._edgeCount;
  }

  /** How many triangles it read */
  get triangleCount() {
    return this._triangleCount;
  }

  /** Each bar's width; setting it rewrites the bars in place, so a dense mesh can take thinner ones */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value === this._thickness) return;
    this._thickness = value;
    this.update();
  }

  /**
   * Outlines a new shape, or new indices: finds the edges again, which allocates, and draws them
   *
   * Each array left out is the one it already holds, so `rebuild()` alone finds the edges again after the indices
   * were rewritten in place. It keeps the arrays for {@link WireframeHelper#update} and the next rebuild.
   */
  rebuild(
    positions = this._positions,
    indices = this._indices,
    normals = this._normals,
  ) {
    this._findEdges(positions, indices, normals);
    if (this._edgeCount > this._bars.capacity) {
      // Allocation only on growth; the swap marks the mesh dirty, so its draw is recorded again.
      const old = this._bars;

      this._bars = new BarsGeometry(this._edgeCount);
      this._mesh.geometry = this._bars;
      old.destroy();
    }

    return this._draw();
  }

  /** Moves the bars to where the positions and normals are now, after they were rewritten in place */
  update() {
    const ends = this._ends;
    const edges = this._edges;
    const radius = this._thickness / 2;

    this._placeEnds();
    for (let e = 0; e < this._edgeCount; e++) {
      const a = edges[e * 2] * 3;
      const b = edges[e * 2 + 1] * 3;

      this._bars.setBar(
        e,
        ends[a],
        ends[a + 1],
        ends[a + 2],
        ends[b],
        ends[b + 1],
        ends[b + 2],
        radius,
      );
    }
    this._bars.update();

    return this;
  }

  /** Destroys its meshes and its own geometry, and lets go of the arrays it read */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
    this._positions = NONE;
    this._indices = undefined;
    this._normals = undefined;
  }

  /** Numbers the distinct positions, then keeps each triangle edge between two of them once */
  _findEdges(positions, indices, normals) {
    const vertexCount = Math.floor(positions.length / 3);
    const cornerOf = new Uint32Array(vertexCount);
    const cornerAt = new Map();
    const cornerVertex = [];
    let size = 0;

    for (let i = 0; i < vertexCount * 3; i++)
      size = Math.max(size, Math.abs(positions[i]));

    const step = WELD * (size || 1);

    for (let v = 0; v < vertexCount; v++) {
      const x = Math.round(positions[v * 3] / step);
      const y = Math.round(positions[v * 3 + 1] / step);
      const z = Math.round(positions[v * 3 + 2] / step);
      const key = `${x},${y},${z}`;
      let corner = cornerAt.get(key);

      if (corner === undefined) {
        corner = cornerVertex.length;
        cornerAt.set(key, corner);
        cornerVertex.push(v);
      }
      cornerOf[v] = corner;
    }

    const triangles = Math.floor((indices ? indices.length : vertexCount) / 3);
    const seen = new Set();
    const edges = [];

    for (let i = 0; i < triangles * 3; i++) {
      const next = i % 3 === 2 ? i - 2 : i + 1;
      const a = cornerOf[indices ? indices[i] : i];
      const b = cornerOf[indices ? indices[next] : next];
      const key =
        a < b ? a * cornerVertex.length + b : b * cornerVertex.length + a;

      if (a === b || seen.has(key)) continue;
      seen.add(key);
      edges.push(a, b);
    }

    this._positions = positions;
    this._indices = indices;
    this._normals = normals;
    this._cornerOf = cornerOf;
    this._cornerVertex = Uint32Array.from(cornerVertex);
    this._edges = Uint32Array.from(edges);
    this._ends = new Float32Array(cornerVertex.length * 3);
    this._edgeCount = edges.length / 2;
    this._triangleCount = triangles;
  }

  /** Fits the bar count to the edges, then writes them */
  _draw() {
    this._bars.count = this._edgeCount;
    this._showPart(this._mesh, this._edgeCount > 0);

    return this.update();
  }

  /** Writes each corner's bar end: its position, lifted `lift` along the normals of every vertex there, averaged */
  _placeEnds() {
    const ends = this._ends;
    const normals = this._normals ?? NONE;
    // A quantized geometry stores four values a vertex; their scale doesn't matter, since each sum is normalised.
    const stride = normals instanceof Int16Array ? 4 : 3;
    const lifted = Math.min(this._cornerOf.length, normals.length / stride);

    ends.fill(0);
    for (let v = 0; v < lifted; v++) {
      const c = this._cornerOf[v] * 3;
      const n = v * stride;

      ends[c] += normals[n];
      ends[c + 1] += normals[n + 1];
      ends[c + 2] += normals[n + 2];
    }
    for (let c = 0; c < ends.length; c += 3) {
      const length = Math.sqrt(
        ends[c] * ends[c] +
          ends[c + 1] * ends[c + 1] +
          ends[c + 2] * ends[c + 2],
      );
      const scale = length > 0 ? this._lift / length : 0;
      const p = this._cornerVertex[c / 3] * 3;

      ends[c] = this._positions[p] + ends[c] * scale;
      ends[c + 1] = this._positions[p + 1] + ends[c + 1] * scale;
      ends[c + 2] = this._positions[p + 2] + ends[c + 2] * scale;
    }
  }
}
