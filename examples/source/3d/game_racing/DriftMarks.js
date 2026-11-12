import { FlatMaterial, Geometry3D, Mesh3D, Vector3 } from '@pixi/3d';

import { Buffer as PixiBuffer, BufferUsage } from 'pixi.js';

import { clamp } from './MathUtils';

const MAX_SEGMENTS = 4096;
const VERTS_PER_SEGMENT = 6;
const TOTAL_VERTS = MAX_SEGMENTS * VERTS_PER_SEGMENT;
const FLOATS_PER_POSITION = 3;
const FLOATS_PER_COLOR = 4;
const POSITION_FLOATS_PER_SEGMENT = VERTS_PER_SEGMENT * FLOATS_PER_POSITION;
const COLOR_FLOATS_PER_SEGMENT = VERTS_PER_SEGMENT * FLOATS_PER_COLOR;
const POSITION_BYTES_PER_SEGMENT = POSITION_FLOATS_PER_SEGMENT * 4;
const COLOR_BYTES_PER_SEGMENT = COLOR_FLOATS_PER_SEGMENT * 4;

const WIDTH = 0.08;
const Y_OFFSET = 0.05;
const MIN_SEGMENT_LENGTH = 0.02;
const INTENSITY_MIN = 0.5;
const INTENSITY_MAX = 2.0;
const INV_INTENSITY_RANGE = 1 / (INTENSITY_MAX - INTENSITY_MIN);

const _wheelPos = new Vector3();

/**
 * One streaming drift ribbon. Owns a {@link Geometry3D} with a fixed-size
 * positions buffer and a custom `aColor` (RGBA) attribute, plus partial
 * GPU uploads via {@link Buffer.update} per emitted segment.
 *
 * Ported from the three.js `BufferGeometry` + `vertexColors` approach in
 * the Starter-Kit-Racing reference. Unwritten segment slots stay at zero
 * (degenerate triangles) so the rasterizer skips them — no `drawCount`
 * management required.
 */
class DriftTrail {
  mesh;

  _positions;
  _colors;
  _positionsBuffer;
  _colorsBuffer;

  _prev = new Vector3();
  _segmentIndex = 0;
  _active = false;

  constructor(parent, material) {
    this._positions = new Float32Array(
      MAX_SEGMENTS * POSITION_FLOATS_PER_SEGMENT,
    );
    this._colors = new Float32Array(MAX_SEGMENTS * COLOR_FLOATS_PER_SEGMENT);

    // RGB stays at 1 for the lifetime of the trail — only alpha is per-segment.
    // Alpha starts at 0 so unwritten slots are invisible (positions are also
    // zero, so triangles are degenerate either way; this is a belt-and-braces).
    for (let i = 0; i < TOTAL_VERTS; i++) {
      const o = i * FLOATS_PER_COLOR;

      this._colors[o] = 1;
      this._colors[o + 1] = 1;
      this._colors[o + 2] = 1;
    }

    this._positionsBuffer = new PixiBuffer({
      data: this._positions,
      usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
      label: 'driftTrail-positions',
      shrinkToFit: false,
    });

    this._colorsBuffer = new PixiBuffer({
      data: this._colors,
      usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
      label: 'driftTrail-colors',
      shrinkToFit: false,
    });

    const geometry = new Geometry3D({
      attributes: {
        aPosition: {
          buffer: this._positionsBuffer,
          format: 'float32x3',
          stride: FLOATS_PER_POSITION * 4,
          offset: 0,
        },
        aColor: {
          buffer: this._colorsBuffer,
          format: 'float32x4',
          stride: FLOATS_PER_COLOR * 4,
          offset: 0,
        },
      },
      topology: 'triangle-list',
      dynamic: true,
    });

    this.mesh = new Mesh3D({
      geometry,
      material,
      castShadow: false,
      receiveShadow: false,
    });

    parent.addChild(this.mesh);
  }

  track(curr, intensity, emit) {
    if (emit && this._active) {
      const alpha = clamp(
        (intensity - INTENSITY_MIN) * INV_INTENSITY_RANGE,
        0,
        1,
      );

      this._writeSegment(this._prev, curr, alpha);
    }

    this._prev.copyFrom(curr);
    this._active = emit;
  }

  _writeSegment(prev, curr, alpha) {
    const dx = curr.x - prev.x;
    const dz = curr.z - prev.z;
    const len = Math.hypot(dx, dz);

    if (len < MIN_SEGMENT_LENGTH) return;

    const invLen = 1 / len;
    const dirX = dx * invLen;
    const dirZ = dz * invLen;

    // Perpendicular in the XZ plane, scaled to half-width.
    const sideX = dirZ * WIDTH;
    const sideZ = -dirX * WIDTH;

    const pLx = prev.x + sideX;
    const pLz = prev.z + sideZ;
    const pRx = prev.x - sideX;
    const pRz = prev.z - sideZ;
    const cLx = curr.x + sideX;
    const cLz = curr.z + sideZ;
    const cRx = curr.x - sideX;
    const cRz = curr.z - sideZ;

    const py = prev.y;
    const cy = curr.y;

    const segmentIndex = this._segmentIndex;
    const positions = this._positions;
    const positionOffset = segmentIndex * POSITION_FLOATS_PER_SEGMENT;

    // Two triangles, CCW from above: (pL, pR, cL) (pR, cR, cL).
    positions[positionOffset + 0] = pLx;
    positions[positionOffset + 1] = py;
    positions[positionOffset + 2] = pLz;

    positions[positionOffset + 3] = pRx;
    positions[positionOffset + 4] = py;
    positions[positionOffset + 5] = pRz;

    positions[positionOffset + 6] = cLx;
    positions[positionOffset + 7] = cy;
    positions[positionOffset + 8] = cLz;

    positions[positionOffset + 9] = pRx;
    positions[positionOffset + 10] = py;
    positions[positionOffset + 11] = pRz;

    positions[positionOffset + 12] = cRx;
    positions[positionOffset + 13] = cy;
    positions[positionOffset + 14] = cRz;

    positions[positionOffset + 15] = cLx;
    positions[positionOffset + 16] = cy;
    positions[positionOffset + 17] = cLz;

    const colors = this._colors;
    const colorOffset = segmentIndex * COLOR_FLOATS_PER_SEGMENT;

    for (let i = 0; i < VERTS_PER_SEGMENT; i++) {
      colors[colorOffset + i * FLOATS_PER_COLOR + 3] = alpha;
    }

    this._positionsBuffer.update(
      POSITION_BYTES_PER_SEGMENT,
      positionOffset * 4,
    );
    this._colorsBuffer.update(COLOR_BYTES_PER_SEGMENT, colorOffset * 4);

    this._segmentIndex = (segmentIndex + 1) % MAX_SEGMENTS;
  }
}

export class DriftMarks {
  _trails;
  _material;

  constructor(parent) {
    this._material = new FlatMaterial({
      baseColor: [0.07, 0.07, 0.07, 1],
      alphaMode: 'blend',
      doubleSided: true,
    });

    // WebGL applies the polygon offset; WebGPU ignores it, so there the
    // per-segment Y_OFFSET alone keeps the marks from fighting the road.
    this._material.state.polygonOffset = -4;

    this._trails = [
      new DriftTrail(parent, this._material),
      new DriftTrail(parent, this._material),
    ];
  }

  update(_dt, vehicle) {
    const emit =
      vehicle.driftIntensity > 0.5 && Math.abs(vehicle.linearSpeed) > 0.15;
    const intensity = vehicle.driftIntensity;
    const groundY = vehicle.container.position.y + Y_OFFSET;

    if (vehicle.wheelBL) {
      readWheelGroundPosition(
        vehicle.wheelBL.worldTransform,
        groundY,
        _wheelPos,
      );
      this._trails[0].track(_wheelPos, intensity, emit);
    }

    if (vehicle.wheelBR) {
      readWheelGroundPosition(
        vehicle.wheelBR.worldTransform,
        groundY,
        _wheelPos,
      );
      this._trails[1].track(_wheelPos, intensity, emit);
    }
  }
}

function readWheelGroundPosition(worldTransform, groundY, out) {
  worldTransform.extractPosition(out);
  out.y = groundY;
}
