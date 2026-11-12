/**
 * What the frame draws to explain the terrain's arrays, one at a time as the pane's Show row picks:
 *
 * - `positions`: a dot on every vertex
 * - `indices`: every triangle edge, and one triangle filled, its corners numbered and its edges arrowed in order
 * - `normals`: a hair out of every vertex along its normal
 * - `uvs`: the dots again, and the uvs at two opposite corners of the patch
 *
 * The marks are children of the terrain and read its arrays in its own space each frame, so they ride the waves with
 * it, and keep riding them when a static geometry's clay holds still. It never changes the scene, so `index.ts` runs
 * the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';
import { NormalsHelper } from './theme/NormalsHelper';
import { THEMES } from './theme/palette';
import { PathHelper } from './theme/PathHelper';
import { PointsHelper } from './theme/PointsHelper';

import { TriangleHelper } from './theme/TriangleHelper';
import { WireframeHelper } from './theme/WireframeHelper';
import { CELLS } from './heightmap';

/** The pane's Show row: which array the marks explain */
export const SHOW_OPTIONS = {
  positions: 'positions',
  indices: 'indices',
  normals: 'normals',
  uvs: 'uvs',
};

/**
 * The marks sit on the pale terrain on both themes, so they keep the light theme's dark ink, where the kit's `'ink'`
 * turns pale on the dark theme and would vanish into the terrain
 */
const HELPER_INK = THEMES.light.inkSoft;
/** About 2 px across from the landscape camera: readable, and apart at the 0.375 between vertices */
const DOT_RADIUS = 0.035;
/** On a view taller than it's wide the camera backs off, so the dots grow to stay a few px across */
const NARROW_DOT_SCALE = 1.6;
/** How far the triangle's edges stand off the surface along the normals, in scene units: half their thickness */
const EDGE_LIFT = 0.014;
/** The gap in px between each corner of the triangle and the near side of its tag */
const CORNER_TAG_GAP = 5;

/** The cell three quarters of the way across and down the grid, nearer the camera, where its triangle reads large */
const FOCUS_CELL = Math.floor(CELLS * 0.75);
/** Where that cell's first triangle starts in `indices`: two triangles a cell, three vertex numbers a triangle */
const FOCUS_INDEX = 2 * (FOCUS_CELL * CELLS + FOCUS_CELL) * 3;

const _corners = [new Vector3(), new Vector3(), new Vector3()];
const _screen = [new Point(), new Point(), new Point()];
const _world = new Vector3();
const _normal = new Vector3();

export function createVisuals({
  app,
  view3d,
  stage,
  terrain,
  positions,
  indices,
  normals,
}) {
  const { screen } = app;
  // The portrait fit grows the view past a phone's screen, so the tags keep to the screen itself.
  const labels = new LabelLayer({ view3d, stage, bounds: screen });
  const dots = new PointsHelper({
    positions,
    radius: DOT_RADIUS,
    color: HELPER_INK,
    parent: terrain,
  });
  const wire = new WireframeHelper({
    positions,
    indices,
    normals,
    color: HELPER_INK,
    parent: terrain,
  });
  const triangle = new TriangleHelper({ opacity: 0.35, parent: terrain });
  const edges = new PathHelper({
    color: 'accent',
    thickness: 0.03,
    head: true,
    parent: terrain,
  });
  const hairs = new NormalsHelper({
    positions,
    normals,
    length: 0.3,
    color: HELPER_INK,
    parent: terrain,
  });
  const cornerTags = [0, 1, 2].map((c) =>
    labels.add({
      text: String(indices[FOCUS_INDEX + c]),
      node: terrain,
      color: 'accent',
    }),
  );
  const uvTags = [
    labels.add({ text: '0, 0', node: terrain }),
    labels.add({ text: '1, 1', node: terrain, offset: { x: 0, y: 20 } }),
  ];
  const lastPosition = positions.length - 3;
  const edgePoints = new Float32Array(18);
  let shown = null;
  let narrow = null;

  app.stage.addChild(labels);

  /** Shows one array's marks and tags, and hides the rest */
  function showMarks(show) {
    dots.visible = show === 'positions' || show === 'uvs';
    wire.visible = triangle.visible = edges.visible = show === 'indices';
    hairs.visible = show === 'normals';
    for (const tag of cornerTags) tag.hidden = show !== 'indices';
    for (const tag of uvTags) tag.hidden = show !== 'uvs';
  }

  /** Lays the triangle over its corners, arrows its edges in index order, and tags each corner from outside */
  function placeTriangle() {
    let middleX = 0;
    let middleY = 0;

    for (let c = 0; c < 3; c++) {
      const vertex = indices[FOCUS_INDEX + c] * 3;
      const corner = _corners[c];

      corner.fromArray(positions, vertex);
      cornerTags[c].at.copyFrom(corner);
      // Lifted along the normal, so the arrows lie on the surface rather than in it.
      corner.addScaledVector(_normal.fromArray(normals, vertex), EDGE_LIFT);
      // Edge c runs from corner c to the next, so each corner starts one edge and ends the one before.
      corner.toArray(edgePoints, c * 6);
      corner.toArray(edgePoints, ((c + 2) % 3) * 6 + 3);
      view3d.worldToScreen(terrain.toGlobal(corner, _world), _screen[c]);
      middleX += _screen[c].x / 3;
      middleY += _screen[c].y / 3;
    }
    triangle.set(_corners[0], _corners[1], _corners[2]);
    edges.setSegments(edgePoints, 3);
    for (let c = 0; c < 3; c++) {
      const dx = _screen[c].x - middleX;
      const dy = _screen[c].y - middleY;
      const length = Math.hypot(dx, dy) || 1;
      const tag = cornerTags[c];

      // Away from the triangle's middle, with the tag's near side toward its corner, so no tag covers the triangle.
      tag.offset.set(
        (dx / length) * CORNER_TAG_GAP,
        (dy / length) * CORNER_TAG_GAP,
      );
      tag.anchor.set(nearSide(dx / length), nearSide(dy / length));
    }
  }

  const visuals = {
    // The wireframe opens the scene: it shows the vertices and the triangles the indices join them into.
    show: 'indices',
    update() {
      const isNarrow = screen.width < screen.height;

      if (visuals.show !== shown) {
        shown = visuals.show;
        showMarks(shown);
      }
      if (isNarrow !== narrow) {
        narrow = isNarrow;
        dots.radius = DOT_RADIUS * (narrow ? NARROW_DOT_SCALE : 1);
      }
      uvTags[0].at.fromArray(positions, 0);
      uvTags[1].at.fromArray(positions, lastPosition);
      if (dots.visible) dots.update();
      if (hairs.visible) hairs.update();
      if (wire.visible) {
        wire.update();
        placeTriangle();
      }
      labels.update();
    },
  };

  return visuals;
}

/** A tag's anchor along one screen axis, for a unit direction away from the triangle: 0 is its left or top edge */
function nearSide(direction) {
  // From 45° toward an axis the anchor sits on the tag's edge, so a tag off a corner's diagonal clears it too.
  return 0.5 - 0.5 * Math.max(-1, Math.min(1, direction * Math.SQRT2));
}
