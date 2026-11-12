/**
 * The props: how a model from any file takes its place on the stage, scaled to it and stood on the floor at its
 * centre, with the lights it brings hidden
 */

import { Box, Light, Sphere } from '@pixi/3d';

const bounds = new Box();
const sphere = new Sphere();

/**
 * Files come in any size, a 6 cm avocado or a 40 m building, so the model is scaled until the sphere round its
 * bounds has `radius`, and stood on the floor at the stage's centre. The floor's checks, the fog, the shadow and the
 * camera's near and far planes then suit every model as they are. Returns the height of the sphere's centre, the
 * point to frame.
 */
export function placeModel(model, radius) {
  const { center } = sphere.setFromBox(model.getLocalBounds(bounds));
  const scale = radius / sphere.radius;

  model.scale = scale;
  model.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
    -center.z * scale,
  );

  return (center.y - bounds.min.y) * scale;
}

/**
 * Hides the lights under `node`, such as the ones a file brings (glTF's `KHR_lights_punctual`): they'd stack on the
 * stage's, and a point light's range doesn't scale with the model.
 */
export function hideLights(node) {
  if (node instanceof Light) node.visible = false;
  for (const child of node.children) hideLights(child);
}
