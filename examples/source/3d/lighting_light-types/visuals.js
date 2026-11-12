/**
 * What the frame draws to explain the four lights: each light's shape where it is, and a tag naming it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Quaternion, Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';
import { NARROW_BELOW } from './theme/overlay';

/** Line width before a phone widens it */
const THICKNESS = 0.02;
/** Lines widen with the fit up to the kit's 0.045 for a phone; any wider and the lamp swells into a bar */
const MAX_WIDEN = 2.25;
/** Where the sun's rays point, `gap` short of: above the logo, so they aim at it without crossing it */
const RAYS_AIM = { x: 0, y: 3, z: 0 };
/** The bulb's radius, which widens with the lines so it stays a bulb on a phone */
const BULB_RADIUS = 0.09;
/** An off light's tag, faded so the lights still on stand out */
const OFF_ALPHA = 0.45;
const BEAM_AXIS = { x: 0, y: 0, z: 1 };

/** What marks one light: its helper (an ambient light has none) and its name tag */

export function createVisuals(options) {
  const { app, view3d, stage, sun, bulb, lamp, fill, logo, fitAspect } =
    options;
  const parent = view3d.root;
  const camera = view3d.camera.position;
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  // Under the root, not the lights: hiding a light hides its children, and an off light's helper stays in view.
  const rays = new LightHelper({
    light: sun,
    target: RAYS_AIM,
    spread: 0.8,
    length: 1.4,
    gap: 0.5,
    parent,
  });
  // The ring on the floor is where the bulb's range sphere meets it, so its light ends there.
  const glow = new LightHelper({ light: bulb, footprint: 0, parent });
  // A hair short of the floor, so its two rings lie on it: the outer one at `coneAngle`, the inner one where the
  // `penumbra` fade starts.
  const cone = new LightHelper({
    light: lamp,
    length: lamp.position.y - 0.01,
    parent,
  });
  // The logo's middle carried along the sun's beam to the floor: its shadow, where ambient is the only light.
  const beam = new Vector3(0, 0, -1).applyQuaternion(sun.quaternion);
  const shadow = new Vector3()
    .copyFrom(logo.position)
    .addScaledVector(beam, -logo.position.y / beam.y);
  // The rays lie across the sun's local y, so this carries the tag from their middle to the start of the top one.
  // Placed anywhere else, it overlaps a ray once the scene shrinks, since the tag keeps its width.
  const topRay = new Vector3(0, rays.spread, 0).applyQuaternion(sun.quaternion);
  const sunName = labels.add({ text: 'DirectionalLight' });
  const bulbName = labels.add({ text: 'PointLight' });
  const lampName = labels.add({ text: 'SpotLight' });
  const fillName = labels.add({
    text: 'AmbientLight',
    at: shadow,
    leader: true,
  });
  const marks = [
    { light: sun, helper: rays, name: sunName },
    { light: bulb, helper: glow, name: bulbName },
    { light: lamp, helper: cone, name: lampName },
    { light: fill, helper: null, name: fillName },
  ];
  const roll = new Quaternion();
  let widen = 0;
  let narrow = app.screen.width < NARROW_BELOW;

  app.stage.addChild(labels);

  /** Lines widen as `fitPortrait` backs the camera off, so they stay about 2 px wide on a phone */
  function setWidths() {
    for (const { helper } of marks)
      if (helper) helper.thickness = THICKNESS * widen;
    glow.bulb = BULB_RADIUS * widen;
  }

  /** The sun's name sits left of its top ray, where the light comes from; on a phone the names move apart */
  function placeNames() {
    sunName.anchor.set(narrow ? 0 : 1, 0.5);
    sunName.offset.set(narrow ? 0 : -10, narrow ? -14 : 0);
    // High enough that the bulb's drift never brings it onto the sphere; on a phone that would put it by the logo.
    bulbName.offset.set(0, narrow ? -24 : -34);
    lampName.anchor.set(narrow ? 0.5 : 1, 0.5);
    lampName.offset.set(narrow ? 0 : -18, narrow ? -26 : 0);
    fillName.offset.set(narrow ? -56 : -40, narrow ? 24 : 30);
  }

  /**
   * A cone is round, so its helper turns about the beam until two edge lines fall in line with the axis as the
   * camera sees it, and the other two trace the cone's outline, clear of the clay.
   */
  function turnConeToCamera() {
    const turn = Math.atan2(
      camera.x - lamp.position.x,
      camera.z - lamp.position.z,
    );

    cone.quaternion.multiply(roll.setFromAxisAngle(BEAM_AXIS, turn));
  }

  return {
    update() {
      const isNarrow = app.screen.width < NARROW_BELOW;
      const lineWiden = Math.min(
        Math.max(1, fitAspect / (app.screen.width / app.screen.height)),
        MAX_WIDEN,
      );

      if (isNarrow !== narrow || lineWiden !== widen) {
        narrow = isNarrow;
        widen = lineWiden;
        placeNames();
        setWidths();
      }
      for (const { light, helper, name } of marks) {
        name.alpha = light.visible ? 1 : OFF_ALPHA;
        if (helper) name.at.copyFrom(helper.update().tail);
      }
      sunName.at.add(topRay);
      turnConeToCamera();
      labels.update();
    },
  };
}
