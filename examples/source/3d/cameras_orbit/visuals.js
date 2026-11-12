/**
 * What the frame draws to explain the orbit: the target's tag in the main view, and an inset on the right that shows
 * the camera from outside, on the sphere round the target, with its two angles, its distance, its limits and the saved
 * pose
 *
 * It reads the orbit and the camera each frame and never changes them, so `index.ts` runs the same without it. The
 * inset is a small scene of its own in a kit InsetView: a lit copy of the logo, the marks from `orbitMarks.ts` and the
 * tags from `insetTags.ts`. It docks bottom right under the pane, or beside the pane's column when an open folder
 * leaves too little room under it.
 */

import { AmbientLight, DirectionalLight, Spherical, Vector3 } from '@pixi/3d';

import { Rectangle } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { LabelLayer } from './theme/LabelLayer';
import { loadPixiLogo } from './theme/logo';

import { NARROW_BELOW } from './theme/overlay';

import { createInsetTags } from './insetTags';
import { createOrbitMarks, GLYPH_SHARE } from './orbitMarks';

/**
 * The picture's size in px, and the most of the screen's height it takes, and of a landscape screen's width at the
 * screen's edge, so the logo stays clear of it on a 4:3 screen and a phone held sideways. `minScale` is the smallest
 * the pane may push it to before it hides: smaller, the tags crowd the dome.
 */
const PICTURE = {
  width: 340,
  height: 300,
  heightShare: 0.5,
  widthShare: 0.26,
  minScale: 0.5,
};
const TITLE = 'the camera, seen from outside';
/** How far the title tag reaches left of the panel's right edge, in px: its width and the panel's 10 px corner */
const TITLE_REACH = 250;
/**
 * How far the logo and its shadow reach from the screen's middle at the opening pose, as shares of the screen's
 * height: right, below the badge that tops its right end above the middle, and down. Beside the pane the inset keeps
 * clear of them.
 */
const LOGO_REACH = { right: 0.17, down: 0.2 };
/** The px the inset keeps from the pane and the logo */
const GAP = 8;
/**
 * Kit sizes the layout needs and no kit piece reports, copied by hand: Panel's `MARGIN` to the screen's edges,
 * InsetView's `RIM` round the picture, and how far the title tag stands above the panel, InsetTitle's `TAG_HEIGHT`
 * (19) less the rim it overlaps
 */
const KIT = { margin: 24, rim: 4, titleRise: 15 };
/** How far the `target` tag floats above the target, in px: clear of the logo's top at `minDistance` */
const TARGET_LIFT = 140;
const NARROW_TARGET_LIFT = 100;
/**
 * Where the inset looks from: 45° right of the front and 26° up. The camera starts on the logo's left, where the
 * line out to it lies across the picture rather than toward the viewer.
 */
const VIEW_AZIMUTH = Math.PI / 4;
const VIEW_ELEVATION = (26 * Math.PI) / 180;
/** The px the picture leaves round the dome and the glyph */
const FRAME_MARGIN = 12;

export async function createVisuals({
  app,
  view3d,
  stage,
  orbit,
  logo,
  pane,
  requestFrame,
}) {
  const labels = new LabelLayer({ view3d, stage });
  const targetTag = labels.add({ text: 'target', leader: true });
  /**
   * The screen the inset docks in: the app's, or slid left so the inset's right edge meets the pane's column. It keeps
   * the screen's width, since Panel picks the phone layout by it.
   */
  const dock = app.screen.clone();
  const inset = new InsetView({
    app,
    stage,
    screen: dock,
    corner: 'bottom-right',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: 260 },
    mode: 'orthographic',
    title: TITLE,
    // Over the picture's right end, so the tag reaches in from the screen's edge when it's wider than a small picture.
    titleCorner: 'top-right',
    // A drag that starts over the inset still orbits the main view.
    eventMode: 'none',
  });
  // An inset with neither a view nor a texture always has a scene and a camera of its own.
  const root = inset.root;
  const camera = inset.camera;
  const copy = await loadPixiLogo({ castShadow: false });
  const sun = new DirectionalLight({
    intensity: 2.2,
    position: { x: -4, y: 12, z: 7 },
  });
  const marks = createOrbitMarks(root, view3d, orbit);
  const tags = createInsetTags({ inset, orbit, marks, logo: copy });
  const centre = logo.root.position;
  const framed = [0, 1, 2, 3, 4, 5].map(() => new Vector3());
  const spherical = new Spherical();
  /** The pane's rect in px, read when it resizes or the screen's width moves it, and the inset's with its title tag */
  const paneRect = new Rectangle();
  const titled = new Rectangle();
  let paneResized = true;
  let paneReadWidth = -1;
  let framedFor = -1;
  let pictureScale = 1;

  copy.root.position.copyFrom(centre);
  sun.lookAt(centre);
  root.addChild(copy.root, sun, new AmbientLight({ intensity: 0.9 }));
  // The panel behind the picture is already the background's colour. The engine draws a background as a cube round the
  // camera, which an orthographic lens shows at its size in the scene: a small box in the picture's middle.
  inset.view3d.background = null;
  // Its line of sight to the logo; frame() moves it along that line until the dome fits.
  camera.position
    .setFromSpherical(
      spherical.set(1, Math.PI / 2 - VIEW_ELEVATION, VIEW_AZIMUTH),
    )
    .add(centre);
  camera.lookAt(centre);
  app.stage.addChild(labels, inset);

  // The pane grows as a folder opens, and the inset makes room. The pane is read on the next frame, once it has its
  // rows, rather than every frame, and a resize asks for that frame, since render on demand draws nothing otherwise.
  new ResizeObserver(() => {
    paneResized = true;
    requestFrame();
  }).observe(pane.element);

  /** The picture's scale that keeps its top, with the title tag and a gap, below `top`, docked on the screen's bottom */
  function below(top) {
    return (
      (app.screen.height -
        top -
        GAP -
        KIT.titleRise -
        KIT.rim * 2 -
        KIT.margin) /
      PICTURE.height
    );
  }

  /**
   * Picks where the inset docks for this screen and pane, into `dock`, and returns the picture's scale, or 0 to hide
   * it. It docks bottom right under the pane: whole on a large screen, smaller on a short or a 4:3 one, and in the room
   * the pane leaves. When an open folder leaves too little room there, it docks beside the pane's column, right of the
   * logo or below it; with too little room there too it hides until the folder closes. On a phone it docks along the
   * bottom at its narrow size.
   */
  function place() {
    const { width, height } = app.screen;
    const tall = (height * PICTURE.heightShare) / PICTURE.height;
    const wide =
      width > height ? (width * PICTURE.widthShare) / PICTURE.width : 1;
    const fit = Math.min(1, tall, wide);
    const smallest = Math.min(fit, PICTURE.minScale);
    const underPane = Math.min(fit, below(paneRect.bottom));

    dock.copyFrom(app.screen);
    if (width < NARROW_BELOW) return 1;
    if (underPane >= smallest) return underPane;

    // Beside the pane, right of the logo where its title tag fits too, under the badge; else below the logo.
    const right = paneRect.left - GAP;
    const room = right - GAP - (width / 2 + LOGO_REACH.right * height);
    const rightOfLogo =
      room < TITLE_REACH
        ? 0
        : Math.min((room - KIT.rim * 2) / PICTURE.width, below(height / 2));
    const underLogo = Math.min(
      (right - KIT.margin - KIT.rim * 2) / PICTURE.width,
      below(height / 2 + LOGO_REACH.down * height),
    );
    const beside = Math.min(fit, Math.max(rightOfLogo, underLogo));

    if (beside < smallest) return 0;
    dock.x = right + KIT.margin - width;

    return beside;
  }

  /** The dome's radius the picture fits: `maxDistance`, or out to the saved pose when that lies further */
  function reachNow() {
    return Math.max(orbit.maxDistance, marks.savedPosition.distanceTo(centre));
  }

  /**
   * Sizes the picture to `scale` and fits it to the dome of `reach` round the logo, by its top and the level ring's
   * points a quarter turn either side of the line of sight, out past them by the camera's glyph, and sizes the marks to
   * the px it then has
   */
  function frame(reach, scale) {
    const radius = reach * (1 + GLYPH_SHARE);

    framedFor = reach;
    pictureScale = scale;
    inset.setSize(
      Math.round(PICTURE.width * scale),
      Math.round(PICTURE.height * scale),
    );
    for (let i = 0; i < 4; i++) {
      framed[i]
        .setFromSpherical(
          spherical.set(radius, Math.PI / 2, VIEW_AZIMUTH + (i * Math.PI) / 2),
        )
        .add(centre);
    }
    framed[4].set(centre.x, centre.y + radius, centre.z);
    framed[5].copyFrom(centre);
    inset.frame(framed, FRAME_MARGIN);
    marks.size(inset.unitsPerPixel, reach);
  }

  // `index.ts` saves the pose just before it builds the visuals, so the camera stands on it now.
  marks.saveGhost();

  return {
    showSaved: () => marks.saveGhost(),
    update() {
      if (paneResized || paneReadWidth !== app.screen.width) {
        const { left, top, width, height } =
          pane.element.getBoundingClientRect();

        paneRect.set(left, top, width, height);
        paneResized = false;
        paneReadWidth = app.screen.width;
      }

      const reach = reachNow();
      const scale = place();

      if (scale > 0 && (reach !== framedFor || scale !== pictureScale))
        frame(reach, scale);
      marks.update();

      targetTag.at.copyFrom(orbit.target);
      targetTag.offset.set(
        0,
        -(inset.narrow ? NARROW_TARGET_LIFT : TARGET_LIFT),
      );
      labels.update();
      // Docks the picture first, so the tags lay out where it now stands.
      inset.update();
      // On a phone the open pane reaches down over the inset, which hides until it folds.
      const { x, y, width, height } = inset.rect;

      titled.set(x, y - KIT.titleRise, width, height + KIT.titleRise);
      inset.visible = scale > 0 && !titled.intersects(paneRect);
      if (inset.visible) tags.update();
    },
  };
}
