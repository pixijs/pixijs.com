/** The pass that draws a view's background from a second camera, so an InsetView's picture has the view's sky */

import { BackgroundPass, Pass3D } from '@pixi/3d';

/**
 * Draws the view's background from `camera`, into that camera's render texture, before anything else in the frame
 *
 * Only the view's own camera draws a sky by default, so a second camera that redraws the scene lists this pass ahead
 * of its opaque MeshPass, at the same `'beforeOpaque'` stage the engine's `PortalPass` docs use for a portal's sky.
 * @example
 * ```ts
 * view3d.passes = [...view3d.passes, new InsetSkyPass(camera), new MeshPass({ name: 'opaque', camera })];
 * ```
 */
export class InsetSkyPass extends Pass3D {
  stage = 'beforeOpaque';
  _camera;

  constructor(camera) {
    super();
    this._camera = camera;
  }

  build(graph, { renderer }) {
    graph.addPass(new BackgroundPass({ renderer, camera: this._camera }));
  }
}
