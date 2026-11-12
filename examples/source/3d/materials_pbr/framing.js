/**
 * How far back the camera stands: far enough that the spheres fit across a narrow screen, and that the logo clears the
 * pane in the top-right corner
 *
 * The pane keeps its size in px while the logo scales with the view's height, so a smaller window needs the camera
 * further back. The logo clears the pane by passing left of it or under it, whichever needs less.
 */

/** The narrowest view, width over height, that shows the spheres and their axis names whole */
const FIT_ASPECT = 0.85;
/**
 * How far the logo reaches right of the orbit target on screen, and above it, in view heights at the widest of its
 * sway. Measured from the camera `index.ts` places, at 1280 × 720: measure again after moving it or the logo.
 */
const LOGO_RIGHT = 0.3;
const LOGO_TOP = 0.39;
/** Px kept between the logo and the pane */
const GAP = 12;

/** Backs the camera, the orbit's distance limits and the fog off until the spheres fit and the logo clears the pane */
export function fitBesidePane({ renderer, orbit, stage, pane }) {
  const { minDistance, maxDistance } = orbit;
  const { near, far } = stage.fog;
  let pullBack = 1;

  const refit = () => {
    const { width, height } = renderer.screen;
    const { left, bottom } = pane.element.getBoundingClientRect();
    const beside = (LOGO_RIGHT * height) / Math.max(1, left - GAP - width / 2);
    const below = (LOGO_TOP * height) / Math.max(1, height / 2 - bottom - GAP);
    const next = Math.max(
      1,
      (FIT_ASPECT * height) / width,
      Math.min(beside, below),
    );

    // The limits first, so backing off isn't clamped to the old ones.
    orbit.minDistance = minDistance * next;
    orbit.maxDistance = maxDistance * next;
    if (next !== pullBack) orbit.zoom(pullBack / next);
    stage.fog.near = near * next;
    stage.fog.far = far * next;
    pullBack = next;
  };

  refit();
  renderer.on('resize', refit);
}
