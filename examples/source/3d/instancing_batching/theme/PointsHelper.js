/**
 * Round flat dots at many points in one draw: a mesh's vertices, beads along a path, points baked on a surface, rings
 * round traced sparks
 *
 * Each point is a camera-facing quad in one `ParticleContainer3D`, so 20 000 points cost one draw and four vertices
 * each, where spheres would cost millions of triangles. The quads draw the kit's disc or ring in flat helper colour,
 * with no fog, and stay the same world size from any side.
 */

import {
  packParticleColor,
  ParticleContainer3D,
  ParticleMaterial,
} from '@pixi/3d';

import { Helper } from './Helper';

import { helperColor, watchHelperTheme } from './helpers';
import { pointTexture } from './particles';

/** The muted look's opacity, as every helper has it */
const MUTED_OPACITY = 0.3;

/**
 * Moves each quad's corners a dot's width toward the camera, along their own rays, after the particle bit builds them
 *
 * A camera-facing quad at a point on a surface cuts through it, so the surface hides half the dot, or all of it where
 * the surface faces the camera. Moved along its own ray, each corner lands on the same pixel, so the dot keeps its
 * place and size and draws whole on any surface that faces the camera to within about 60 degrees. The rays run to the
 * camera's position, so under an orthographic camera, whose rays are parallel, a dot can shift by a small fraction of
 * its own size.
 */
const LIFT_BIT = {
  name: 'kitPointsLift',
  gpu: {
    vertex: {
      afterTransform: /* wgsl */ `
  let pointsLift = normalize(camera.uCameraPosition - worldPosition.xyz) * particleSize;
  worldPosition = vec4<f32>(worldPosition.xyz + pointsLift, 1.0);
  clipPosition = camera.uViewProjectionMatrix * worldPosition;
`,
    },
  },
  gl: {
    vertex: {
      afterTransform: /* glsl */ `
  vec3 pointsLift = normalize(uCameraPosition - worldPosition.xyz) * particleSize;
  worldPosition = vec4(worldPosition.xyz + pointsLift, 1.0);
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
`,
    },
  },
};

/** Options for {@link PointsHelper} */

/**
 * A round flat dot at points `first` to `first + count - 1` of `positions`, in one draw
 *
 * It draws the points as they are when it's built. Write `positions` in place, or change `first`, `count` or
 * `radius`, then call {@link PointsHelper#update}. Each dot stands a dot's width toward the camera, so dots on a
 * surface draw whole rather than sinking into it. `color`, `opacity`, `xray` and `muted` work like any helper's and
 * show at once; an `'ink'` one follows the theme on its own. `pass` doesn't apply: the points are particles, which
 * only draw in the main view.
 * @example
 * ```ts
 * const dots = new PointsHelper({ positions: geometry.positions, radius: 0.03, parent: mesh });
 * const beads = new PointsHelper({ positions: path, capacity: 12, color: 'accent', parent: view3d.root });
 *
 * app.ticker.add(() => {
 *   beads.first = (beads.first + 1) % 48; // a run of 12 that slides along the path
 *   beads.update();
 * });
 * ```
 */
export class PointsHelper extends Helper {
  /** The points' x, y and z, the array it was given; write it in place, then call {@link PointsHelper#update} */
  positions;
  /** The most points it draws at once */
  capacity = 0;
  /** Each dot's radius, in world units; the parent's scale doesn't change it */
  radius = 0;
  /** The points in `positions` */
  _total = 0;
  _points;
  _material;
  _first = 0;
  _count = 0;
  /** The tint every drawn point carries, packed once per paint */
  _tint = 0;
  /** The slots holding a point since the last update */
  _filled = 0;
  /** The most slots ever filled; every upload covers them, so a dropped one is never left on the GPU */
  _reach = 0;

  constructor({
    positions,
    capacity = Math.floor(positions.length / 3),
    radius = 0.04,
    hollow = false,
    ...options
  }) {
    super(options, 'ink');

    const texture = pointTexture(hollow);

    this.positions = positions;
    this.capacity = Math.max(Math.floor(capacity), 1);
    this.radius = radius;
    this._total = Math.floor(positions.length / 3);
    this._count = this.capacity;
    this._points = new ParticleContainer3D({
      texture,
      capacity: this.capacity,
      space: 'local',
      parent: this,
    });
    // The container's own material fogs normal-blend particles and takes no `fog` option, so it gets one that doesn't.
    this._material = new ParticleMaterial({
      texture,
      localSpace: true,
      fog: false,
      extraBits: [LIFT_BIT],
    });
    this._points.material.destroy();
    this._points.material = this._material;
    watchHelperTheme(this);
    this._paint();
  }

  /** The first point it draws, an index into `positions` counted in points, clamped to the points there are */
  get first() {
    return this._first;
  }
  set first(value) {
    this._first = Math.min(Math.max(Math.floor(value), 0), this._total);
  }

  /**
   * How many points it draws, from `first`, clamped to `capacity` and to the points left after `first`
   *
   * It keeps the value you set, so a run cut short at the end of `positions` grows back once `first` moves back.
   */
  get count() {
    return Math.min(this._count, this._total - this._first);
  }
  set count(value) {
    this._count = Math.min(Math.max(Math.floor(value), 0), this.capacity);
  }

  /** Always `null`: the points are particles, which only draw in the main view */
  get pass() {
    return null;
  }
  set pass(_value) {}

  /**
   * Writes the drawn points to the GPU, in one upload
   *
   * It uploads on every call, since it can't tell whether you wrote `positions`. Call it on the frames you wrote
   * them or changed `first`, `count` or `radius`, and skip it otherwise.
   */
  update() {
    const points = this._points;
    const positions = this.positions;
    const count = this.count;
    const size = this.radius * 2;
    const tint = this._tint;

    for (let i = 0, p = this._first * 3; i < count; i++, p += 3) {
      points.writePacked(
        i,
        positions[p],
        positions[p + 1],
        positions[p + 2],
        size,
        0,
        tint,
      );
    }
    // Size 0 empties a slot: its quad collapses and costs no fill rate.
    for (let i = count; i < this._filled; i++)
      points.writePacked(i, 0, 0, 0, 0, 0, 0);
    this._filled = count;
    this._reach = Math.max(this._reach, count);
    // Only the last upload before a draw reaches the GPU, so each one covers every slot that has held a point.
    if (this._reach > 0) points.markDirty(0, this._reach - 1);
    points.upload();
    points.visible = count > 0;

    return this;
  }

  /** Re-tints the points for the theme, when their colour follows it; the kit calls it as the theme moves */
  repaint() {
    if (this.muted || this.color === 'ink' || this.color === 'haze')
      this._paint();
  }

  /** Destroys its particle container and material, leaving the kit's disc and ring textures */
  destroy(options) {
    if (this.destroyed) return;
    // Destroyed with no options, so the cached texture always survives.
    this._points.destroy();
    super.destroy(options);
  }

  /** Packs the look into the points' tint, sets the depth test for `xray`, and writes the points again */
  _paint() {
    const color = this.muted ? 'ink' : this.color;
    const opacity = this.muted ? MUTED_OPACITY : this.opacity;
    const depthTest = !this.xray;

    this._tint = packParticleColor(helperColor(color), opacity);
    if (this._material.state.depthTest !== depthTest) {
      this._material.state.depthTest = depthTest;
      // WebGL and WebGPU both keep drawing with the old state until the mesh is rebuilt.
      this._points.invalidate();
    }
    this.update();
  }
}
