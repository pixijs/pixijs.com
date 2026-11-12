/**
 * What the frame draws to explain toon shading: three tags, on the sphere's highlight and rim glow and under the torus
 * that opts out of the ink
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. Where the highlight and
 * the rim show depends on where the camera is, so their points are worked out each frame. Each tag sits off its point
 * by a share of the sphere's radius on screen, so it keeps its place round the sphere on a phone and a desktop alike.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';

import { SPHERE_RADIUS } from './scene';

/**
 * Each tag's offset from its point, in the sphere's radius on screen. The highlight's goes mostly left, since one going
 * up would reach the logo on a phone, where `MIN_RADIUS` pushes it further than the sphere is big.
 */
const OFFSET = {
  highlight: { x: -1.2, y: -0.45 },
  rim: { x: 0.85, y: -0.5 },
  torus: { x: 0, y: 0.55 },
};
/** The smallest radius in px the offsets scale by, so round a phone's small sphere the tags still clear its edge */
const MIN_RADIUS = 80;
/** The clay torus's outer radius, its ring's 0.325 plus its tube's 0.155 */
const TORUS_RADIUS = 0.48;

export function createVisuals({ app, view3d, stage, sphere, torus, keyLight }) {
  const { camera } = view3d;
  const labels = new LabelLayer({ view3d, stage });
  const highlight = labels.add({ text: 'highlight', leader: true });
  const rim = labels.add({ text: 'rim light', leader: true });
  // The front of the torus's tube, which its lean tips down to the lower edge; on the torus's node, it rocks with it.
  const noOutline = labels.add({
    text: 'no outline',
    node: torus,
    at: { x: 0, y: 0, z: TORUS_RADIUS },
    leader: true,
  });
  const toLight = new Vector3();
  const toCamera = new Vector3();
  const right = new Vector3();
  const up = new Vector3();
  const direction = new Vector3();
  const cameraTransform = new Matrix4();

  app.stage.addChild(labels);

  /** The point on the sphere's surface in `direction` from its centre, into `out` */
  function onSphere(out) {
    out
      .copyFrom(sphere.position)
      .addScaledVector(direction.normalize(), SPHERE_RADIUS);
  }

  /** The sphere's radius on screen in px, from its distance to the camera and the screen's height */
  function sphereRadiusOnScreen() {
    const distance = camera.position.distanceTo(sphere.position);

    return (
      (SPHERE_RADIUS * app.screen.height) /
      (2 * distance * Math.tan((camera.fov * Math.PI) / 360))
    );
  }

  function place(label, offset, radius) {
    label.offset.set(offset.x * radius, offset.y * radius);
  }

  return {
    update() {
      toLight.copyFrom(keyLight.position).normalize();
      toCamera.copyFrom(camera.position).subtract(sphere.position).normalize();
      // The screen's right and up are the camera's own x and y axes, which hold even looking straight down.
      camera.getGlobalTransform(cameraTransform);
      right.setFromMatrixColumn(cameraTransform, 0).normalize();
      up.setFromMatrixColumn(cameraTransform, 1).normalize();

      // The highlight is where the surface faces halfway between the light and the camera.
      toLight.add(toCamera, direction);
      onSphere(highlight.at);
      // The rim glows most at the silhouette; this point is just inside it, at the upper right.
      direction
        .copyFrom(right)
        .add(up)
        .multiplyScalar(0.65)
        .addScaledVector(toCamera, 0.38);
      onSphere(rim.at);

      const radius = Math.max(sphereRadiusOnScreen(), MIN_RADIUS);

      place(highlight, OFFSET.highlight, radius);
      place(rim, OFFSET.rim, radius);
      place(noOutline, OFFSET.torus, radius);
      labels.update();
    },
  };
}
