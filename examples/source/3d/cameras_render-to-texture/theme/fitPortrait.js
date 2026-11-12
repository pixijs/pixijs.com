/**
 * Keeps a subject whole on a phone held upright, by backing the camera and the fog off as the view narrows
 *
 * Every example frames its subject for a landscape screen; this works out the portrait distance and follows a
 * phone turned after load, so no example carries resize code of its own. It can also keep bands at the top and
 * bottom of a narrow view free for panels, with the subject centred between them.
 */

import { OrbitCamera } from '@pixi/3d/extras';

/** A camera with no orbit: the view whose camera it is, and the point the camera looks at */

/** What {@link fitPortrait} returns: the clears to change, a refit by hand, and a stop */

/**
 * Backs the camera off on a view narrower than `minAspect`, so the subject still fits across it
 *
 * The aspect is the rect the camera's viewport fills: the whole view, or half of it in a split screen. The camera's
 * distance, an orbit's `minDistance` and `maxDistance`, and the stage's fog all scale by `minAspect / aspect`, which
 * keeps the subject as wide on screen as at `minAspect`; at `minAspect` and wider nothing changes.
 *
 * With `clearTop` or `clearBottom` on a view that fills the screen, a narrow view keeps those bands free: the fit
 * grows the view taller than the screen and shifts it (`view3d.setSize`, `view3d.position`), so the orbit target lands
 * at the middle of the band between them and the picture stays seamless. A wide view gets `autoResize` back. Give a
 * `LabelLayer` over it `bounds: app.screen`, since the view then reaches past the screen.
 *
 * It follows the renderer's resizes, so a phone turned after load refits. Call it once the camera is placed and the
 * orbit built.
 * @example
 * ```ts
 * const fit = fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: 1.2, clearTop: 200 });
 *
 * fit.clearBottom = card.rect.height + 32; // the card under the subject sized itself
 * fit.refit();
 * ```
 */
export function fitPortrait(options) {
  const { renderer, orbit, stage, minAspect, minHeight = 0 } = options;
  const { view, target } = orbit;
  const controls = orbit instanceof OrbitCamera ? orbit : null;
  const minDistance = controls?.minDistance ?? 0;
  const maxDistance = controls?.maxDistance ?? 0;
  const near = stage?.fog.near ?? 0;
  const far = stage?.fog.far ?? 0;
  const top = view.position.y;
  let pullBack = 1;
  let grown = false;

  const refit = () => {
    const { clearTop, clearBottom } = fit;
    const following = view.autoResize || grown;
    const width = following ? renderer.screen.width : view.width;
    const height = following ? renderer.screen.height : view.height;
    const { viewport } = view.camera;
    const narrow =
      (viewport.width * width) / (viewport.height * height) < minAspect;
    const shift = narrow && following && (clearTop > 0 || clearBottom > 0);
    // Taller than the screen by the clears' difference, so the view's middle lands on the band's.
    const viewHeight = shift
      ? height + Math.abs(clearTop - clearBottom)
      : height;
    const band = Math.max(1, height - clearTop - clearBottom);
    let next = 1;

    if (narrow) {
      next = Math.max(
        minAspect / ((viewport.width * width) / (viewport.height * viewHeight)),
        1,
      );
      if (shift) next = Math.max(next, (minHeight * viewHeight) / band);
    }
    if (controls) {
      // Set before the zoom, so a zoom out isn't clamped to the old limit.
      controls.minDistance = minDistance * next;
      controls.maxDistance = maxDistance * next;
      // `zoom` takes a factor towards the target, so one under 1 moves the camera out.
      if (next !== pullBack) controls.zoom(pullBack / next);
    } else if (next !== pullBack) {
      const { position } = view.camera;
      const scale = next / pullBack;

      position.set(
        target.x + (position.x - target.x) * scale,
        target.y + (position.y - target.y) * scale,
        target.z + (position.z - target.z) * scale,
      );
    }
    if (stage) {
      stage.fog.near = near * next;
      stage.fog.far = far * next;
    }
    pullBack = next;

    if (shift) {
      view.setSize(width, viewHeight);
      view.position.y = top + Math.min(0, clearTop - clearBottom);
      grown = true;
    } else if (grown) {
      view.position.y = top;
      view.autoResize = true;
      grown = false;
    }
  };
  const fit = {
    clearTop: options.clearTop ?? 0,
    clearBottom: options.clearBottom ?? 0,
    refit,
    stop: () => {
      renderer.off('resize', refit);
    },
  };

  refit();
  renderer.on('resize', refit);

  return fit;
}
