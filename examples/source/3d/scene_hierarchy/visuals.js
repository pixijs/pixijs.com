/**
 * What the frame draws to explain the tree: the orbit's axes and the planet's, the planet's offset along its orbit's
 * x, both rings, and a tag naming each level of the focal branch (`sun`, `orbit`, `planet`, `moon`)
 *
 * The helpers are children of the nodes they explain, so they turn, scale and hide with them. Each tag takes its text
 * from the node it names. It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';

import { LabelLayer } from './theme/LabelLayer';
import { PathHelper } from './theme/PathHelper';

/** Line widths at the camera's landscape distance from the sun; further off, they widen to hold their width on screen */
const RING = 0.015;
const OFFSET_LINE = 0.025;
const LINE_DISTANCE = 11.5;
/** How far a tag clears the edge of the ball it names, in px */
const GAP = 6;
/** How far the orbit's tag floats over its axes' y tip, in px: in the gap between the two rings' far arcs */
const ORBIT_LIFT = 42;
const ORIGIN = { x: 0, y: 0, z: 0 };

const _eye = new Vector3();
const _at = new Vector3();
const _planetAt = new Point();
const _moonAt = new Point();

/** A node's scale in the world, along x: its own times every ancestor's */
function worldScale(node) {
  let scale = 1;

  for (let n = node; n; n = n.parent) scale *= n.scale.x;

  return scale;
}

export function createVisuals(options) {
  const {
    app,
    view3d,
    stage,
    sun,
    orbit,
    planet,
    moon,
    outerOrbit,
    outerPlanet,
  } = options;

  const orbitAxes = new AxesHelper({
    length: 1.05,
    thickness: 0.04,
    parent: orbit,
  });
  // Its x arrow points at the moon, so the moon's turn about the planet reads as the planet's own.
  new AxesHelper({ length: 0.62, thickness: 0.03, parent: planet });
  // The orbit's x carried on to the planet: the 2.5 that planet.position.x measures, in the orbit's space.
  const offset = new ArrowHelper({
    color: 'ink',
    thickness: OFFSET_LINE,
    head: false,
    parent: orbit,
  });
  const ring = new PathHelper({ closed: true, thickness: RING, parent: orbit });
  const outerRing = new PathHelper({
    closed: true,
    thickness: RING,
    parent: outerOrbit,
  });

  offset.set(ORIGIN, planet.position);
  ring.setPoints(PathHelper.circle(planet.position.x, 72));
  outerRing.setPoints(PathHelper.circle(outerPlanet.position.x, 96));

  const labels = new LabelLayer({ view3d, stage });
  /** A tag on a node, showing the `label` the node was given */
  const nameTag = (node, options) =>
    labels.add({ text: node.label ?? '', node, ...options });
  // On the line through the planet and the moon, each past its own ball's far side, so the two turn with the planet's
  // spin and neither ever covers the other or the other's ball. Added first, so they pass under the two that stay put.
  const planetTag = nameTag(planet);
  const moonTag = nameTag(moon);
  // Hangs from its top edge, pushed past the sun's edge each update.
  const sunTag = nameTag(sun, { anchor: { x: 0.5, y: 0 } });

  // Over the y tip, on the orbit's turning axis: it holds still while the orbit turns, and hides with it.
  nameTag(orbit, {
    at: orbitAxes.tips.y,
    offset: { x: 0, y: -ORBIT_LIFT },
    leader: true,
  });

  /** A ball's radius on screen, in px, from its sphere's radius, its scale in the world and its distance to the camera */
  function screenRadius(ball) {
    const { camera } = view3d;
    const radius = (ball.geometry.bounds3D.width / 2) * worldScale(ball);
    const distance = ball
      .getGlobalPosition(_at)
      .distanceTo(camera.getGlobalPosition(_eye));

    return (
      (radius * view3d.height) /
      (2 * distance * Math.tan((camera.fov * Math.PI) / 360))
    );
  }

  /** Moves a centred tag out along the screen direction (dx, dy) until it's `GAP` px clear of its ball's edge */
  function hang(tag, ball, dx, dy) {
    const reach =
      screenRadius(ball) +
      GAP +
      (Math.abs(dx) * tag.width + Math.abs(dy) * tag.height) / 2;

    tag.offset.set(dx * reach, dy * reach);
  }

  app.stage.addChild(labels);

  return {
    update() {
      const distance = sun
        .getGlobalPosition(_at)
        .distanceTo(view3d.camera.getGlobalPosition(_eye));
      // In tenths, so a camera that only turns doesn't rewrite the lines.
      const widen = Math.max(
        1,
        Math.ceil((distance / LINE_DISTANCE) * 10) / 10,
      );

      ring.thickness = outerRing.thickness = RING * widen;
      offset.thickness = OFFSET_LINE * widen;

      sunTag.offset.y = screenRadius(sun) + GAP;
      if (
        view3d.worldToScreen(planet.getGlobalPosition(_at), _planetAt) &&
        view3d.worldToScreen(moon.getGlobalPosition(_at), _moonAt)
      ) {
        const dx = _moonAt.x - _planetAt.x;
        const dy = _moonAt.y - _planetAt.y;
        const length = Math.hypot(dx, dy) || 1;

        hang(moonTag, moon, dx / length, dy / length);
        hang(planetTag, planet, -dx / length, -dy / length);
      }
      labels.update();
    },
  };
}
