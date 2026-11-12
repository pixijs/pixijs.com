/**
 * The helpers that trace a mesh, a volume or a scene object: the torus's wireframe, the capsule's normals, a struck
 * triangle hopping over the icosahedron, a sphere round the floating octahedron, the spot's cone, the inset camera's
 * view volume, and the fox's skeleton
 */

import { Sphere, Vector3 } from '@pixi/3d';

import { FrustumHelper } from './theme/FrustumHelper';
import { LightHelper } from './theme/LightHelper';
import { NormalsHelper } from './theme/NormalsHelper';
import { SkeletonHelper } from './theme/SkeletonHelper';
import { SphereHelper } from './theme/SphereHelper';
import { TriangleHelper } from './theme/TriangleHelper';
import { WireframeHelper } from './theme/WireframeHelper';
import { visual } from './galleryVisual';

import { LAMP_HEIGHT } from './scene';

/** Seconds the struck triangle stays on a face, and how far through the faces each hop jumps */
const HOP = 0.7;
const HOP_STRIDE = 7;
/** How squarely a face must look at the camera to be struck: the cosine of the angle between them */
const FACING = 0.7;
/** The sphere round the floating octahedron, well clear of its corners */
const BOUNDS_RADIUS = 0.62;
const ORIGIN = { x: 0, y: 0, z: 0 };

export function createMeshVisuals({ camera, lens, scene, tags, widen }) {
  const { stations } = scene;
  const wire = new WireframeHelper({
    geometry: scene.torus.geometry,
    thickness: 0.01 * widen,
    parent: scene.torus,
  });
  const hairs = new NormalsHelper({
    geometry: scene.pill.geometry,
    length: 0.18,
    thickness: 0.012 * widen,
    parent: scene.pill,
  });
  const struck = new TriangleHelper({ parent: scene.icosahedron });
  const bounds = new SphereHelper({
    camera,
    fill: 0.1,
    thickness: 0.015 * widen,
    parent: stations.bounds,
  });
  const volume = new Sphere(new Vector3(), BOUNDS_RADIUS);
  // Down to the floor, a hair short so its rings don't fight it.
  const cone = new LightHelper({
    light: scene.lamp,
    length: LAMP_HEIGHT - 0.01,
    thickness: 0.02 * widen,
    parent: stations.lamp,
  });
  const frustum = new FrustumHelper({
    camera: lens,
    length: 1.1,
    color: 'accent',
    thickness: 0.018 * widen,
    parent: stations.lens,
  });
  const skeleton = scene.fox.skeletons[0];
  // From the hip, since the file's root joint stands at the fox's feet; the fox's bones run along +x.
  const rig = new SkeletonHelper({
    skeleton,
    space: scene.fox,
    root: skeleton.indexOf('b_Hip_01'),
    leafAxis: { x: 1, y: 0, z: 0 },
    thickness: 0.045 * widen,
    leafLength: 0.16,
    parent: stations.rig,
  });

  rig.highlight(skeleton.indexOf('b_Head_05'), 'accent');

  const corners = [new Vector3(), new Vector3(), new Vector3()];
  const edge = new Vector3();
  const facing = new Vector3();
  const toCamera = new Vector3();
  const center = new Vector3();
  let hops = -1;
  let face = 0;
  let time = 0;

  /** Lays the struck triangle on the next face after `face` that looks at the camera, a stride on */
  function hop() {
    const { indices, positions } = scene.icosahedron.geometry;
    const count = indices.length / 3;

    scene.icosahedron.toGlobal(ORIGIN, center);
    toCamera.copyFrom(camera.position).subtract(center).normalize();
    for (let k = 1; k <= count; k++) {
      const next = (face + k * HOP_STRIDE) % count;

      for (let c = 0; c < 3; c++)
        corners[c].fromArray(positions, indices[next * 3 + c] * 3);
      corners[1]
        .subtract(corners[0], facing)
        .cross(corners[2].subtract(corners[0], edge), facing);
      if (
        facing
          .transformDirection(scene.icosahedron.worldTransform)
          .dot(toCamera) > FACING
      ) {
        struck.set(corners[0], corners[1], corners[2]);
        face = next;

        return;
      }
    }
  }

  return {
    visuals: [
      visual(
        'WireframeHelper',
        'Mesh and scene',
        [wire],
        tags.add('wire', 'WireframeHelper'),
      ),
      visual(
        'NormalsHelper',
        'Mesh and scene',
        [hairs],
        tags.add('normals', 'NormalsHelper'),
      ),
      visual(
        'TriangleHelper',
        'Mesh and scene',
        [struck],
        tags.add('struck', 'TriangleHelper'),
      ),
      visual(
        'SphereHelper',
        'Mesh and scene',
        [bounds],
        tags.add('bounds', 'SphereHelper'),
      ),
      visual(
        'LightHelper',
        'Mesh and scene',
        [cone],
        tags.add('lamp', 'LightHelper'),
      ),
      visual(
        'FrustumHelper',
        'Mesh and scene',
        [frustum],
        tags.add('lens', 'FrustumHelper'),
      ),
      visual(
        'SkeletonHelper',
        'Mesh and scene',
        [rig],
        tags.add('rig', 'SkeletonHelper'),
      ),
    ],
    update(dt) {
      time += dt;
      if (Math.floor(time / HOP) !== hops) {
        hops = Math.floor(time / HOP);
        hop();
      }
      volume.center.copyFrom(scene.bubble.position);
      bounds.setSphere(volume);
      bounds.update();
      cone.update();
      frustum.update();
      rig.update();
    },
  };
}
