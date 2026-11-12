/**
 * What the frame draws to explain hit volumes: each shape's volume outlined round it, turning pink while it answers
 * the pick, and for a per-triangle volume its net: faint at rest, dark while the ray passes through the triangles'
 * bounding box, where the engine tests every one
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. Each outline reads its
 * mesh's `hitVolume` and swaps when the value changes, so nothing has to tell it. Every outline is a kit helper under
 * the mesh, in its space, and helpers never join the pick list.
 */

import { Geometry3D, Matrix4, Ray, Sphere } from '@pixi/3d';

import { BoxHelper } from './theme/BoxHelper';
import { SphereHelper } from './theme/SphereHelper';
import { WireframeHelper } from './theme/WireframeHelper';
import { CylinderHelper } from './CylinderHelper';
import { CylinderVolume } from './CylinderVolume';
import { SHAPE_NAMES } from './scene';

/** The answering shell's see-through fill: its empty corners read pinker than the clay behind them */
const ANSWER_FILL = 0.14;
/** Line widths in the shape's own units: thin enough that the torus's 1,024 triangles still read as a net */
const OUTLINE_THICKNESS = 0.02;
const NET_THICKNESS = 0.008;
/** A net at rest, faint so the step reads, and while the ray is in its bounding box and every triangle is tested */
const NET_OPACITY = 0.15;
const NET_TESTED_OPACITY = 1;

/** A volume the engine tests with one analytic shape, drawn as a shell that fills on an answer */

/** Redraws one shape's outline for its `hitVolume`, the pick's answer, and the ray it was cast along in world space */

const _ray = new Ray();
const _localRay = new Ray();
const _toLocal = new Matrix4();
const _drawn = new Sphere();

export function createVisuals({ view3d, shapes, pointer }) {
  const outlines = SHAPE_NAMES.map((name) =>
    createVolumeOutline(shapes[name], view3d.camera),
  );

  return {
    update(picked) {
      // With the transforms of the last render, as the pick in index.ts reads them.
      view3d.screenToRay(pointer, _ray, true);
      for (const update of outlines) update(picked, _ray);
    },
  };
}

/** Draws `mesh`'s hit volume; `camera` turns the sphere's and cylinder's outlines to face it */
function createVolumeOutline(mesh, camera) {
  const netLook = {
    thickness: NET_THICKNESS,
    opacity: NET_OPACITY,
    parent: mesh,
  };
  // Each made the first time its kind of volume shows, and kept for when it comes back.
  const helpers = {};
  const standIns = new Map();
  let shown;
  let shell = null;
  let wire = null;
  /** The triangles a per-triangle volume tests, whose bounding box the ray must enter first */
  let triangles = null;

  /** Shows the helper for `volume` and hides the rest */
  function show(volume) {
    let next = null;

    triangles = null;
    if (volume === null || volume === 'box') {
      next = helpers.box ??= new BoxHelper({
        thickness: OUTLINE_THICKNESS,
        parent: mesh,
      }).setBox(mesh.geometry.bounds3D);
    } else if (volume instanceof Sphere) {
      next = helpers.sphere ??= new SphereHelper({
        camera,
        thickness: OUTLINE_THICKNESS,
        parent: mesh,
      });
      // Half a line out: the kit lays the fill on the sphere itself, where it would fight a ball of that radius.
      helpers.sphere.setSphere(
        _drawn.set(volume.center, volume.radius + OUTLINE_THICKNESS / 2),
      );
    } else if (volume instanceof CylinderVolume) {
      next = helpers.cylinder ??= new CylinderHelper({
        camera,
        thickness: OUTLINE_THICKNESS,
        parent: mesh,
      });
      helpers.cylinder.set(volume.radius, volume.halfHeight);
    } else if (volume === 'geometry') {
      next = helpers.wireframe ??= new WireframeHelper({
        ...netLook,
        geometry: mesh.geometry,
      });
      triangles = mesh.geometry;
    } else if (volume instanceof Geometry3D) {
      next = standIns.get(volume) ?? null;
      if (!next) {
        // A stand-in lies inside the smooth clay, its facets chords of the curve, so its net draws over the clay.
        next = new WireframeHelper({
          ...netLook,
          geometry: volume,
          xray: true,
        });
        standIns.set(volume, next);
      }
      triangles = volume;
    }
    for (const helper of [...Object.values(helpers), ...standIns.values()])
      helper.visible = helper === next;
    shell = next instanceof WireframeHelper ? null : next;
    wire = next instanceof WireframeHelper ? next : null;
    shown = volume;
  }

  return (picked, ray) => {
    const answering = picked !== null && picked.target === mesh;

    if (mesh.hitVolume !== shown) show(mesh.hitVolume);
    if (shell) {
      if (!(shell instanceof BoxHelper)) shell.update();
      shell.color = answering ? 'accent' : 'ink';
      shell.fill = answering ? ANSWER_FILL : 0;
    }
    if (wire && triangles) {
      // The engine's rule: a per-triangle volume tests its triangles only once the ray enters their bounding box. It
      // also skips them when a nearer hit already lies in front of that box, which the net doesn't follow.
      const tested = ray
        .applyMatrix4(_toLocal.getInverse(mesh.worldTransform), _localRay)
        .intersectsBox(triangles.bounds3D);

      wire.opacity = tested ? NET_TESTED_OPACITY : NET_OPACITY;
      wire.color = answering ? 'accent' : 'ink';
    }
  };
}
