/**
 * What the frame draws to explain the sun's shadow maps: each map's texels as a grid on the road in its cascade's
 * colour, a line where each cascade ends, the fixed box's frame, and tags naming the cascades, maxDistance and the box
 *
 * It reads the sun, the camera and the box each frame and never changes them, so `index.ts` runs the same without it.
 * The grid, the lines, the frame and the tags move only on a frame when something they're drawn from moved.
 */

import { Box, Matrix4, Plane, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { BoxHelper } from './theme/BoxHelper';
import { helperColor } from './theme/helpers';

import { LabelLayer } from './theme/LabelLayer';
import { BRAND, CLAY } from './theme/palette';

import { createCoverage, measureCoverage } from './coverage';

import { GridPatch } from './gridPatch';
import { crossRoad, scaled, side } from './ground';
import { ROAD } from './scene';

/** One colour per cascade, nearest first; nothing else in the scene wears them */
const CASCADE_COLORS = [BRAND.sky, BRAND.purple, BRAND.orange, CLAY.paleSky];
/** A grid cell is this many shadow-map texels a side, so a far cell is still a few pixels across */
const CELL_TEXELS = 16;
/** The grid's opacity, and the fainter one past `maxDistance`, where the last cascade's map runs on */
const GRID_OPACITY = 0.55;
const OVERHANG_OPACITY = 0.28;
/** The grid lies just above the road, so it never fights it for depth */
const GRID_Y = ROAD.top + 0.003;
/** The split lines' width on screen, in px, at any distance */
const LINE_PIXELS = 3;
/** The box frame sits this far up, since its bars lie half outside the box and the bottom ones would sink */
const FRAME_LIFT = 0.1;
/**
 * The cascade tags hang their right ends this far in from the screen's right edge, or from the pane's left edge when
 * the pane covers their height, and sit at least `TAG_SPACING` apart and that far below the pane
 */
const TAG_MARGIN = 16;
const TAG_SPACING = 24;
/** The avenue's shapes and posts stand inside this: up to 1.8 m tall, 4.5 m either side of the road's middle */
const AVENUE = { top: 1.8, halfWidth: 4.5 };

const _u = { x: 0, z: 0, c: 0 };
const _v = { x: 0, z: 0, c: 0 };
const _from = new Vector3();
const _to = new Vector3();
const _frameBox = new Box();
const _camera = new Matrix4();
const _world = new Vector3();
const _screen = new Point();
const _propTops = new Plane(new Vector3(0, 1, 0), -AVENUE.top);

export function createVisuals({ app, view3d, stage, sun, street, pane }) {
  const cover = createCoverage(GRID_Y);
  const { lightX, lightY, depth } = cover;
  const road = {
    minX: -ROAD.halfWidth,
    maxX: ROAD.halfWidth,
    minZ: ROAD.far,
    maxZ: ROAD.near,
    y: GRID_Y,
  };
  // One patch per cascade, and one where the last cascade's map runs on past `maxDistance`.
  const patches = Array.from(
    { length: 5 },
    () => new GridPatch({ ...road, parent: view3d.root }),
  );
  const overhang = patches[4];

  for (const patch of patches)
    patch.opacity = patch === overhang ? OVERHANG_OPACITY : GRID_OPACITY;

  const splits = CASCADE_COLORS.map(
    (color) => new ArrowHelper({ color, head: false, parent: view3d.root }),
  );
  const frame = new BoxHelper({ thickness: 0.05, parent: view3d.root });
  const labels = new LabelLayer({ view3d, stage });
  const bandTags = CASCADE_COLORS.map((color, c) =>
    labels.add({
      text: `cascade ${c}`,
      color,
      screen: { x: 0, y: 0 },
      anchor: { x: 1, y: 0.5 },
    }),
  );
  // Hung off the road's right edge, where the ball never passes.
  const reachTag = labels.add({
    text: 'maxDistance',
    anchor: { x: 0, y: 0.5 },
    offset: { x: 8, y: 0 },
  });
  const boxTag = labels.add({ text: 'bounds' });

  app.stage.addChild(labels);

  // The tags are placed again when the coverage changes or the pane moves or resizes; only then is the pane measured.
  let tagsStale = true;
  let paneRect = new DOMRect();
  let reachOnRoad = false;
  const measurePane = () => {
    paneRect = pane.element.getBoundingClientRect();
    tagsStale = true;
  };

  new ResizeObserver(measurePane).observe(pane.element);
  app.renderer.on('resize', measurePane);

  /** Lays `map`'s texel grid on `patch`, a cell every 16 texels */
  function layGrid(patch, map) {
    patch.grid(
      scaled(_u, lightX, 1 / (CELL_TEXELS * map.texelX)),
      scaled(_v, lightY, 1 / (CELL_TEXELS * map.texelY)),
    );
  }

  /** Cuts `patch` down to `map`'s square in the light's view */
  function keepInside(patch, map) {
    return patch
      .keep(side(lightX, 1, map.minX))
      .keep(side(lightX, -1, map.maxX))
      .keep(side(lightY, 1, map.minY))
      .keep(side(lightY, -1, map.maxY));
  }

  /** A band of grid per cascade, the line where each ends, and the fainter grid past the last */
  function drawCascades() {
    const last = cover.count - 1;
    const { fov, zoom } = view3d.camera;
    // A screen pixel's width on something a metre in front of the camera.
    const pixel =
      (2 * Math.tan((fov * Math.PI) / 360)) / (zoom * view3d.height);

    for (let c = 0; c < CASCADE_COLORS.length; c++) {
      const map = cover.maps[c];
      const line = splits[c];

      patches[c].visible = line.visible = c <= last;
      if (c > last) continue;
      patches[c].color = CASCADE_COLORS[c];
      patches[c]
        .reset()
        .keep(side(depth, 1, map.near))
        .keep(side(depth, -1, map.far));
      layGrid(patches[c], map);

      line.visible = crossRoad(depth, map.far, _from, _to);
      if (c === last) reachOnRoad = line.visible;
      if (!line.visible) continue;
      line.thickness = map.far * pixel * LINE_PIXELS;
      // Resting on the road.
      _from.y = _to.y = ROAD.top + line.thickness / 2;
      line.set(_from, _to);
      if (c === last) reachTag.at.copyFrom(_to);
    }
    overhang.color = CASCADE_COLORS[last];
    layGrid(
      keepInside(
        overhang.reset().keep(side(depth, 1, cover.reach)),
        cover.maps[last],
      ),
      cover.maps[last],
    );
  }

  /** One grid over the box's map, and the frame round the box itself */
  function drawBox() {
    for (let c = 0; c < patches.length; c++) patches[c].visible = c === 0;
    for (const line of splits) line.visible = false;
    layGrid(keepInside(patches[0].reset(), cover.maps[0]), cover.maps[0]);
    _frameBox.copyFrom(street);
    _frameBox.min.y += FRAME_LIFT;
    _frameBox.max.y += FRAME_LIFT;
    frame.setBox(_frameBox);
    // Over the road, where the far face crosses it.
    boxTag.at.set(0, _frameBox.max.y, street.min.z);
  }

  /**
   * Hangs each cascade's tag down the right edge at its band's middle on screen, nearest lowest, a tag apart. Where the
   * pane covers that edge, a tag slides down its band to clear the pane, or if the band ends first, hangs just left of
   * the pane where nothing of the avenue shows; failing both, it hides until the pane folds, and the band's colour
   * still names it. The tags pinned in the scene hide while they'd show through the pane.
   */
  function placeTags() {
    const { width, height } = app.screen;

    tagsStale = false;
    // The first frame is drawn before the observer first reports, so it measures the pane itself.
    if (paneRect.width === 0) paneRect = pane.element.getBoundingClientRect();
    const underPane = paneRect.bottom + TAG_SPACING;
    const besideX = paneRect.left - TAG_MARGIN;
    // Each band starts where the one before ends; the first starts at the camera, below the screen's bottom edge.
    let near = height;
    let below = height;

    for (let c = 0; c < bandTags.length; c++) {
      const tag = bandTags[c];
      const shown = cover.cascaded && c < cover.count;
      const far = shown ? groundY(cover.maps[c].far, near) : height;

      // A slice that ends before the first ground the camera sees has no band on screen to name.
      tag.hidden = !shown || far >= height;
      if (!tag.hidden && tag.screen) {
        const lowest = Math.min(near - TAG_SPACING / 2, below - TAG_SPACING);
        const y = Math.min((near + far) / 2, below - TAG_SPACING);

        if (y >= underPane || underPane <= lowest)
          tag.screen.set(width - TAG_MARGIN, Math.max(y, underPane));
        else if (clearOfAvenue(besideX - tag.width, y + tag.height / 2))
          tag.screen.set(besideX, y);
        else tag.hidden = true;
        if (!tag.hidden) below = tag.screen.y;
      }
      near = far;
    }
    reachTag.hidden = !cover.cascaded || !reachOnRoad || onPane(reachTag);
    boxTag.hidden = cover.cascaded || onPane(boxTag);
  }

  /** The screen y where the ground straight ahead, `d` metres in front of the camera, lies; at most `lowest` */
  function groundY(d, lowest) {
    const e = view3d.camera.getGlobalTransform(_camera).elements;
    // The camera looks down its -z; walk along that, flat on the ground, until the depth is `d`.
    const flat = Math.hypot(e[8], e[10]);
    const along = (d + (GRID_Y - e[13]) * e[9]) / flat;

    _world.set(
      e[12] - (e[8] / flat) * along,
      GRID_Y,
      e[14] - (e[10] / flat) * along,
    );

    return view3d.worldToScreen(_world, _screen)
      ? Math.min(_screen.y, lowest)
      : lowest;
  }

  /**
   * Whether screen (x, y) is right of the middle and none of the avenue shows there: its ray meets the shapes' tops
   * beside the avenue, past its far end or never
   */
  function clearOfAvenue(x, y) {
    const hit = view3d.screenToWorld(_screen.set(x, y), _propTops, _world);

    return (
      x > app.screen.width / 2 &&
      (!hit || Math.abs(hit.x) > AVENUE.halfWidth || hit.z < ROAD.far)
    );
  }

  /** Whether `tag`, pinned to a point in the scene, would lie on the pane */
  function onPane(tag) {
    if (!view3d.worldToScreen(tag.at, _screen)) return false;

    const left = _screen.x + tag.offset.x - tag.anchor.x * tag.width;
    const top = _screen.y + tag.offset.y - tag.anchor.y * tag.height;

    return (
      left + tag.width > paneRect.left &&
      top < paneRect.bottom &&
      top + tag.height > paneRect.top
    );
  }

  return {
    update() {
      if (measureCoverage(sun, view3d, cover)) {
        frame.visible = !cover.cascaded;
        if (cover.cascaded) drawCascades();
        else drawBox();
        tagsStale = true;
      }
      if (tagsStale) placeTags();
      // The box's grid is ink, which follows the theme.
      if (!cover.cascaded) patches[0].color = helperColor('ink');
      labels.update();
    },
  };
}
