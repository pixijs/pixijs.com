/**
 * Where the side view's camera stands and how big its picture is: beside the main camera and a little above it,
 * framing every line the side view draws, in a picture that leaves the main view's pieces and its two spots whole
 */

import { Ray, Spherical, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { BASE_PIECES, PYRAMID_AT, SPOTS } from './scene';

/** The picture's size at its largest, in px, and its height on a narrow view, where it spans the bottom */
export const PICTURE = { width: 384, height: 240, narrowHeight: 180 };
/** The camera glyph's size in px, which the frame leaves room for left of the eye */
export const GLYPH_PX = 18;
/** Where the camera looks from: this far round from the main camera, and this far above level, in radians */
const AZIMUTH = (72 * Math.PI) / 180;
const ELEVATION = (16 * Math.PI) / 180;
/** The room the framed points leave at the picture's edges, in px: more at the top for tags, at the left for the glyph */
const FRAME_MARGIN = { top: 24, right: 12, bottom: 12, left: 12 + GLYPH_PX };
/** Points a side of a grid of rays across the main view: a distance along them bounds wherever the pointer aims */
const VIEW_GRID = 3;
/**
 * How far round each foot in the main view the picture stays clear, in world units, past a piece's half-width and
 * the ring's radius; the gap it leaves past that, in px; and the narrowest it gets on a view too small for all that
 */
const FOOT = { room: 0.5, gap: 8, minWidth: 160 };
/** The feet of the pieces standing from the start, which the picture leaves whole however the reader orbits or zooms */
const STANDING = [...BASE_PIECES.map(({ at }) => at), PYRAMID_AT, SPOTS.left];

const _middle = new Vector3();
const _spherical = new Spherical();
const _gridPoint = new Point();
const _gridRay = new Ray();
const _corner = new Vector3();
const _px = new Point();

/** Places the side view's camera each frame, and sizes its picture when the main view's size changes */
export function createSideCamera(options) {
  const { app, view3d, stage, orbit, inset, top, params } = options;
  // A same-scene inset always has a camera.
  const camera = inset.camera;
  // The camera, the pyramid and the two spots: the ends of the lines the view draws, with the pointer near the row.
  const framedOnFloor = [
    view3d.camera.position,
    top,
    PYRAMID_AT,
    ...Object.values(SPOTS),
  ];
  // And at a distance, where the pointer can aim: the view's grid of rays, that far along each.
  const viewGrid = Array.from(
    { length: VIEW_GRID * VIEW_GRID },
    () => new Vector3(),
  );
  const framedAtDistance = [...framedOnFloor, ...viewGrid];
  // The main view's size the picture was last fitted to.
  const fitted = { width: 0, height: 0 };

  /**
   * The widest picture that leaves `foot` whole, with room round it, left of the panel or above it, with the foot's
   * pixel pushed `spread` times as far from the middle of the view. The panel docks the same gap from the right edge
   * and the bottom one.
   */
  function widestBeside(foot, spread) {
    const { width, height, right, bottom } = app.screen;
    const edge = right - inset.picture.right + inset.padding + FOOT.gap;

    // The corner of its room nearest the picture: the right of it, and the front, nearer the camera and lower.
    _corner.set(foot.x + FOOT.room, 0, foot.z + FOOT.room);
    if (!view3d.worldToScreen(_corner, _px)) return PICTURE.width;
    _px.set(
      width / 2 + (_px.x - width / 2) * spread,
      height / 2 + (_px.y - height / 2) * spread,
    );

    return Math.max(
      right - edge - _px.x,
      ((bottom - edge - _px.y) * PICTURE.width) / PICTURE.height,
    );
  }

  /**
   * The largest picture that leaves the pieces and the ring's first spot whole. In landscape the scene stands beside
   * the picture, and in portrait above it, so each foot allows a picture as wide as the floor right of it or as tall as
   * the floor under it, whichever is bigger. It resizes the picture's render texture, so it runs on a resize, never as
   * the camera moves: zoomed fully in, the scene spreads out from the middle of the view, where the orbit target sits,
   * by about `distance / minDistance`, so the standing pieces are tested that far out. The near spot isn't, since the
   * ring leaves it once the pointer moves.
   */
  function fitPicture() {
    const spread = orbit.distance / orbit.minDistance;

    // Docked to the screen first, so widestBeside knows where the picture sits: pixi renders as soon as the window
    // resizes, so the view has its new size before the inset's next update.
    inset.update();

    let fit = widestBeside(SPOTS.near, 1);

    for (const foot of STANDING)
      fit = Math.min(fit, widestBeside(foot, spread));
    fit = Math.max(FOOT.minWidth, Math.min(PICTURE.width, Math.round(fit)));
    inset.setSize(fit, Math.round((fit * PICTURE.height) / PICTURE.width));
    fitted.width = view3d.width;
    fitted.height = view3d.height;
  }

  /** The points `distance` along the rays through the main view's grid, which change only with its camera */
  function placeViewGrid() {
    const { width, height } = app.screen;
    const last = VIEW_GRID - 1;

    for (let i = 0; i < viewGrid.length; i++) {
      _gridPoint.set(
        ((i % VIEW_GRID) / last) * width,
        (Math.floor(i / VIEW_GRID) / last) * height,
      );
      view3d.screenToRay(_gridPoint, _gridRay).at(params.distance, viewGrid[i]);
    }
  }

  return {
    update() {
      // The view takes the screen's size as it renders, so its projection is the new one a frame after a resize.
      if (view3d.width !== fitted.width || view3d.height !== fitted.height)
        fitPicture();
      // Beside the main camera and a little above, looking at the middle of the camera and its target.
      _middle
        .copyFrom(orbit.target)
        .add(view3d.camera.position)
        .multiplyScalar(0.5);
      _spherical.set(1, Math.PI / 2 - ELEVATION, orbit.azimuthAngle + AZIMUTH);
      camera.position.setFromSpherical(_spherical).add(_middle);
      camera.lookAt(_middle);
      if (params.dropOn === 'distance') placeViewGrid();
      inset.frame(
        params.dropOn === 'distance' ? framedAtDistance : framedOnFloor,
        FRAME_MARGIN,
      );
      // The floor runs on past the framed points into the fog, as in the main view, rather than stopping at a far
      // plane, and on to the picture's bottom edge, rather than stopping at a near plane fitted to the framed points.
      camera.far = Math.max(camera.far, stage.fog.far * 2);
      camera.near = Math.min(camera.near, 0.5);
    },
  };
}
