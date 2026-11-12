/**
 * What the frame draws to explain many lights: a bulb on each light the view shades, a hollow ring on each one it
 * ignores, and the first light's range: its footprint on the clay, and an arrow `range` long from its bulb to it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { MAX_LIGHTS, Vector3 } from '@pixi/3d';

import { ArrowHelper } from './theme/ArrowHelper';
import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';
import { PointsHelper } from './theme/PointsHelper';

import { CLAY_TOP } from './scene';

/** A bulb's radius, and every line's width, before a phone widens them */
const BULB = 0.09;
const LINE = 0.02;
/** An ignored light's ring: a touch wider than a bulb, since its line is a fifth of its radius and needs the room */
const IGNORED_RING = 0.11;
/** How far lines widen with the portrait fit (to the kit's 0.045), and bulbs, which stay smaller than a sphere */
const MAX_WIDEN = 2.25;
const MAX_BULB_WIDEN = 1.4;
/** Px between the range arrow's tip and its tag */
const TAG_GAP = 8;

export function createVisuals({ app, view3d, stage, lights, fitAspect }) {
  const parent = view3d.root;
  const first = lights[0];
  const labels = new LabelLayer({ view3d, stage });
  // The first light's footprint: the ring where its range meets the clay tops, which bounds the pixels that pay for it.
  const featuredHelper = new LightHelper({
    light: first,
    bulb: BULB,
    footprint: CLAY_TOP,
    color: 'ink',
    parent,
  });
  // The kit draws a switched-off light's helper muted, to show where it is. Here a switched-off light leaves the
  // frame, so `showBulbs` hides its helper instead.
  const helpers = [
    featuredHelper,
    ...lights
      .slice(1)
      .map((light) => new LightHelper({ light, bulb: BULB, parent })),
  ];
  const helperOf = new Map(helpers.map((helper) => [helper.light, helper]));
  // A light past the limit gives no light, so its bulb gives way to a hollow ink ring.
  const ignoredAt = new Float32Array(
    Math.max(lights.length - MAX_LIGHTS, 0) * 3,
  );
  const ignoredRings = new PointsHelper({
    positions: ignoredAt,
    radius: IGNORED_RING,
    hollow: true,
    parent,
  });
  const rangeArrow = new ArrowHelper({ color: 'ink', thickness: LINE, parent });
  const rangeTag = labels.add({
    text: 'range',
    anchor: { x: 0, y: 0.5 },
    offset: { x: TAG_GAP, y: 0 },
  });
  const ignoredTag = labels.add({ text: 'ignored' });
  const cameraRight = new Vector3();
  const rimPoint = new Vector3();
  let shownIgnored = -1;
  let widen = 0;

  app.stage.addChild(labels);

  /**
   * A bulb on each light the view shades, a ring on each one it ignores, and nothing on a light that's off. It walks
   * `view3d.lights` the way the view does: in order, past hidden and ambient lights, the first `MAX_LIGHTS` shaded.
   */
  function showBulbs() {
    let visible = 0;

    for (const helper of helpers) helper.visible = helper.light.visible;
    for (const light of view3d.lights) {
      // The light's own `visible`, which is what the view reads for a light straight under the root.
      if (!light.visible || light.type === 'ambient') continue;
      if (visible >= MAX_LIGHTS) {
        const helper = helperOf.get(light);

        if (helper) helper.visible = false;
        light.position.toArray(ignoredAt, (visible - MAX_LIGHTS) * 3);
        if (visible === MAX_LIGHTS) ignoredTag.at.copyFrom(light.position);
      }
      visible++;
    }
    for (const helper of helpers) helper.update();
    ignoredTag.hidden = visible <= MAX_LIGHTS;

    const ignored = Math.max(visible - MAX_LIGHTS, 0);

    // The rings upload while a light is ignored, and once more as the last one leaves.
    if (ignored === 0 && shownIgnored === 0) return;
    ignoredRings.count = ignored;
    ignoredRings.update();
    shownIgnored = ignored;
  }

  /**
   * The first light's arrow, `range` long: from its bulb to the footprint ring's right edge as the camera sees it, or
   * straight down when the range stops short of the clay. Hidden at range 0, which has no end.
   */
  function placeRange() {
    const { range, position } = first;
    const drop = Math.min(position.y - CLAY_TOP, range);

    cameraRight.set(1, 0, 0).applyQuaternion(view3d.camera.quaternion);
    rimPoint
      .copyFrom(position)
      .addScaledVector(cameraRight, Math.sqrt(range * range - drop * drop));
    rimPoint.y -= drop;
    rangeArrow.set(position, rimPoint);
    rangeArrow.visible = range > 0;
    rangeTag.hidden = range === 0;
    rangeTag.at.copyFrom(rimPoint);
  }

  /** Lines widen as `fitPortrait` backs the camera off, so they stay about 2 px wide on a phone */
  function setWidths() {
    const bulbWiden = Math.min(widen, MAX_BULB_WIDEN);

    featuredHelper.thickness = rangeArrow.thickness = LINE * widen;
    for (const helper of helpers) helper.bulb = BULB * bulbWiden;
    ignoredRings.radius = IGNORED_RING * bulbWiden;
    // The rings take a new radius at their next upload.
    shownIgnored = -1;
  }

  return {
    update() {
      const lineWiden = Math.min(
        Math.max(1, fitAspect / (app.screen.width / app.screen.height)),
        MAX_WIDEN,
      );

      if (lineWiden !== widen) {
        widen = lineWiden;
        setWidths();
      }
      showBulbs();
      placeRange();
      labels.update();
    },
  };
}
