/**
 * What the frame draws to explain a lighting model: which sphere wears which model, and a probe at one point on the
 * hero showing the two directions every `perLight` compares
 *
 * The probe is an accent dot on the surface, an ink arrow for its `normal`, an orange arrow for `lightDir`, the way to
 * the light, and an ink arc for the angle between them, whose cosine is `nDotL`. The pane moves the probe through
 * `probe.degrees`; the rest reads the scene and never changes it, so `index.ts` runs the same without it.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { DotHelper } from './theme/DotHelper';

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';
import { BRAND } from './theme/palette';

/** The probe's opening angle from the point on the hero that faces the light: `nDotL` is 0.34 there, inside the fade */
const PROBE_DEGREES = 70;
/** The probe's path tilts this far towards the camera, so the probe sits on the side the reader sees */
const PROBE_TILT = 35 * DEG_TO_RAD;
const NORMAL_LENGTH = 0.8;
const LIGHT_LENGTH = 1;
/** Far enough out that the arc clears the hero's outline where it meets `lightDir` */
const ANGLE_RADIUS = 0.6;
/** The arrows' width on a wide view, and on a narrow one, where the camera backs off */
const THICKNESS = { wide: 0.03, narrow: 0.06 };
/** Warm for light, and apart from the accent that marks the lesson's model */
const LIGHT_COLOR = BRAND.orange;
/** Px from a sphere's outline to the top of its label, the same at any size */
const TAG_GAP = 10;

/** Where the probe sits, which the pane sets, and what `perLight` reads there */

export function createVisuals({
  app,
  view3d,
  stage,
  hero,
  lambertSphere,
  toonSphere,
  radius,
  sun,
}) {
  const labels = new LabelLayer({ view3d, stage });
  const normalArrow = new ArrowHelper({ color: 'ink', parent: view3d.root });
  const lightArrow = new ArrowHelper({
    color: LIGHT_COLOR,
    parent: view3d.root,
  });
  // A bare arc: no wedge to tint the probed spot, and no head, since the angle between two directions has no way round.
  const angle = new AngleHelper({
    radius: ANGLE_RADIUS,
    color: 'ink',
    wedge: false,
    head: false,
    parent: view3d.root,
  });
  const dot = new DotHelper({
    color: 'accent',
    radius: 0.05,
    outline: true,
    parent: view3d.root,
  });
  const below = { anchor: { x: 0.5, y: 0 }, offset: { x: 0, y: TAG_GAP } };
  const heroTag = labels.add({
    text: 'soft shade',
    node: hero,
    color: 'accent',
    ...below,
  });
  const lambertTag = labels.add({
    text: 'Lambert',
    node: lambertSphere,
    ...below,
  });
  const toonTag = labels.add({ text: 'toon', node: toonSphere, ...below });
  const normalTag = labels.add({ text: 'normal' });
  // The normal turns left of lightDir on screen, so this tag hangs off the right of its tip and the two never meet.
  const lightTag = labels.add({
    text: 'lightDir',
    anchor: { x: 0, y: 0.5 },
    offset: { x: 4, y: -10 },
  });
  const probe = {
    degrees: PROBE_DEGREES,
    get nDotL() {
      return Math.cos(this.degrees * DEG_TO_RAD);
    },
  };
  const normal = new Vector3();
  const point = new Vector3();
  const normalTip = new Vector3();
  const lightTip = new Vector3();
  const lineOfSight = new Vector3();
  let placedDegrees = Number.NaN;
  let narrow = null;

  // A light shines along its local -z, so its +z points back at it. `getGlobalTransform` works the pose out now,
  // before the view has rendered and filled in `worldTransform`.
  const toLight = new Vector3(0, 0, 1).transformDirection(
    sun.getGlobalTransform(new Matrix4()),
  );
  // The probe moves on a great circle through the point that faces the light, over the top of the sphere and tilted
  // towards the camera's starting place. `across` is the way it leaves that point, square to `toLight`.
  const toCamera = new Vector3()
    .copyFrom(view3d.camera.position)
    .subtract(hero.position)
    .normalize();
  const overTop = toCamera.cross(toLight, new Vector3()).normalize();

  if (overTop.y < 0) overTop.multiplyScalar(-1);

  const towardsCamera = toCamera
    .addScaledVector(toLight, -toCamera.dot(toLight), new Vector3())
    .normalize();
  const across = overTop
    .multiplyScalar(Math.cos(PROBE_TILT), new Vector3())
    .addScaledVector(towardsCamera, Math.sin(PROBE_TILT));

  // The arc turns from `toLight` towards `across`, so one axis serves every probe angle.
  angle.setAxis(toLight.cross(across, new Vector3()), toLight);

  app.stage.addChild(labels);
  placeProbe();

  /** Puts the probe `probe.degrees` round from the lit point, along `across` */
  function placeProbe() {
    const radians = probe.degrees * DEG_TO_RAD;

    normal
      .copyFrom(toLight)
      .multiplyScalar(Math.cos(radians))
      .addScaledVector(across, Math.sin(radians));
    point
      .copyFrom(hero.position)
      .addScaledVector(normal, radius * hero.scale.x);
    normalTip.copyFrom(point).addScaledVector(normal, NORMAL_LENGTH);
    lightTip.copyFrom(point).addScaledVector(toLight, LIGHT_LENGTH);
    dot.position.copyFrom(point);
    normalArrow.set(point, normalTip);
    lightArrow.set(point, lightTip);
    angle.position.copyFrom(point);
    angle.radians = radians;
    normalTag.at.copyFrom(normalTip);
    lightTag.at.copyFrom(lightTip);
    placedDegrees = probe.degrees;
  }

  /** Hangs `tag` `TAG_GAP` px under `sphere`'s outline on screen */
  function hang(tag, sphere) {
    lineOfSight
      .copyFrom(view3d.camera.position)
      .subtract(sphere.position)
      .normalize();
    // Down, less its part along the line of sight, meets the outline at its lowest point from any height.
    tag.at
      .set(0, -1, 0)
      .addScaledVector(lineOfSight, lineOfSight.y)
      .normalize()
      .multiplyScalar(radius);
  }

  return {
    probe,
    update() {
      const isNarrow = app.screen.width < NARROW_BELOW;

      if (isNarrow !== narrow) {
        narrow = isNarrow;
        normalArrow.thickness = lightArrow.thickness = isNarrow
          ? THICKNESS.narrow
          : THICKNESS.wide;
        angle.thickness = (normalArrow.thickness * 2) / 3;
      }
      if (probe.degrees !== placedDegrees) placeProbe();
      hang(heroTag, hero);
      hang(lambertTag, lambertSphere);
      hang(toonTag, toonSphere);
      labels.update();
    },
  };
}
