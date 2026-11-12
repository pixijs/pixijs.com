/**
 * What the frame draws to explain anisotropy: at the highlight, an arrow for the sphere's tangent and an arc for the
 * rotation from it, tagged `tangent` and `rotation`, and a tag on the plain twin
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. A sphere's highlight
 * peaks where its normal lies halfway between the way to the light and the way to the camera, so the arrow and arc
 * are drawn there, in the surface's tangent plane, and ride the highlight as the reader orbits. Each tag at the
 * highlight is pushed off the point it names, away from the centre; the tangent's tag and the twin's also keep clear
 * of the sphere's outline.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { Point, Rectangle } from 'pixi.js';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';

import { LabelLayer } from './theme/LabelLayer';
import { BRAND } from './theme/palette';

/** How far off the surface the arrow and arc sit, so they never sink into the sphere */
const LIFT = 0.02;
/**
 * Short, because the streak bends round the sphere while the arc stays flat in the tangent plane. The two agree at the
 * highlight's centre and part slowly, so this close the arc's head still meets the streak at every rotation.
 */
const ARC_RADIUS = 0.3;
/** Past the arc, so the angle plainly starts on the arrow */
const TANGENT_LENGTH = 0.5;
/** World up; the bitangent is the part of it along the surface, towards the north pole */
const UP = { x: 0, y: 1, z: 0 };
/** Px between a tag and the point it names, or the sphere's edge */
const TAG_GAP = 8;
/** Radians under which the arc is little more than its head, too short to name */
const MIN_NAMED_ROTATION = 0.5;
/** The strength from which the streak is plain, so the arc draws solid; under it the arc fades out with the stretch */
const SOLID_ARC_STRENGTH = 0.5;

export function createVisuals(options) {
  const { app, view3d, stage, sphere, twin, radius, anisotropy } = options;
  const parent = view3d.root;
  // Sky, not ink: the arrow runs from the bright streak onto the steel's dark half, and ink is lost on one of them on
  // each theme.
  const tangentArrow = new ArrowHelper({
    color: BRAND.sky,
    thickness: 0.025,
    parent,
  });
  // No wedge: at a half turn it would tint the very streak the arc measures.
  const arc = new AngleHelper({
    radius: ARC_RADIUS,
    thickness: 0.022,
    wedge: false,
    parent,
  });
  const labels = new LabelLayer({ view3d, stage });
  const tangentTag = labels.add({ text: 'tangent' });
  const rotationTag = labels.add({ text: 'rotation' });
  const twinTag = labels.add({ text: 'no anisotropy' });

  // World space: the highlight's centre and the sphere's frame there, and the points the tags name.
  const centre = new Vector3();
  const normal = new Vector3();
  const tangent = new Vector3();
  const bitangent = new Vector3();
  const axis = new Vector3();
  const halfway = new Vector3();
  const tangentTip = new Vector3();
  const arcMiddle = new Vector3();
  const toLight = new Vector3();
  const eye = new Vector3();
  const toEye = new Vector3();
  const sphereCentre = new Vector3();
  const twinCentre = new Vector3();
  const cameraRight = new Vector3();
  const worldPoint = new Vector3();
  const matrix = new Matrix4();
  // Screen space, in px.
  const point = new Point();
  const centreOnScreen = new Point();
  const sphereOnScreen = new Point();
  const direction = new Point();
  const tagBox = new Rectangle();
  let sphereRadiusOnScreen = 0;

  app.stage.addChild(labels);

  /** Puts `centre` and `normal` where the key light's highlight peaks, from where the light and the camera are now */
  function findHighlight() {
    // A directional light shines along its local −z, so its +z column points back at it.
    toLight
      .setFromMatrixColumn(stage.key.getGlobalTransform(matrix), 2)
      .normalize();
    sphere.getGlobalPosition(sphereCentre);
    view3d.camera.getGlobalPosition(eye);
    toEye.copyFrom(eye).subtract(sphereCentre).normalize();
    normal.copyFrom(toLight).add(toEye).normalize();
    // The way to the camera changes across the sphere, so two refinements from the point found settle it.
    for (let i = 0; i < 2; i++) {
      toEye
        .copyFrom(eye)
        .subtract(sphereCentre.addScaledVector(normal, radius, centre))
        .normalize();
      normal.copyFrom(toLight).add(toEye).normalize();
    }
    sphereCentre.addScaledVector(normal, radius + LIFT, centre);
  }

  /** Lays the arrow along the sphere's tangent at the highlight and turns the arc from it by `rotation` */
  function placeArrowAndArc() {
    const { rotation } = anisotropy;

    // The sphere's own frame there: the tangent `scene.ts` gave its vertices, running the way u grows, and the
    // bitangent the engine builds from it, towards the north pole. The stretch turns from the first towards the
    // second, as `KHR_materials_anisotropy` has it.
    tangent.set(-normal.z, 0, normal.x).normalize();
    bitangent.copyFrom(UP).addScaledVector(normal, -normal.y).normalize();
    tangentArrow.set(
      centre,
      centre.addScaledVector(tangent, TANGENT_LENGTH, tangentTip),
    );

    arc.position.copyFrom(centre);
    arc.setAxis(tangent.cross(bitangent, axis), tangent);
    arc.radians = rotation;
    // At strength 0 nothing stretches and `rotation` turns nothing, so the arc and its tag fade out.
    arc.opacity = Math.min(1, anisotropy.strength / SOLID_ARC_STRENGTH);
    rotationTag.alpha = arc.opacity;
    halfway
      .copyFrom(tangent)
      .multiplyScalar(Math.cos(rotation / 2))
      .addScaledVector(bitangent, Math.sin(rotation / 2));
    centre.addScaledVector(halfway, ARC_RADIUS, arcMiddle);
  }

  /**
   * Pins a tag to `at` and pushes it off along a screen direction until the whole tag clears the point by
   * {@link TAG_GAP}, and the sphere too when `clearSphere` is set. It leaves the tag's rect in `tagBox`.
   */
  function placeTag(label, at, dx, dy, clearSphere = false) {
    label.at.copyFrom(at);
    if (!view3d.worldToScreen(at, point)) return;

    const halfWidth = label.width / 2;
    const halfHeight = label.height / 2;
    const push = TAG_GAP + halfWidth * Math.abs(dx) + halfHeight * Math.abs(dy);

    tagBox.set(
      point.x + dx * push - halfWidth,
      point.y + dy * push - halfHeight,
      label.width,
      label.height,
    );
    // Each step moves it on by how far it still reaches in; the push runs out from the sphere, so two settle it.
    for (let step = 0; clearSphere && step < 2; step++) {
      const reach = sphereReach(tagBox);

      tagBox.x += dx * reach;
      tagBox.y += dy * reach;
    }
    label.offset.set(
      tagBox.x + halfWidth - point.x,
      tagBox.y + halfHeight - point.y,
    );
  }

  /** The tags at the highlight: each pushed off the point it names, away from the highlight's centre */
  function placeHighlightTags() {
    rotationTag.hidden = anisotropy.rotation < MIN_NAMED_ROTATION;
    if (!view3d.worldToScreen(centre, centreOnScreen)) return;
    awayFromCentre(tangentTip);
    placeTag(tangentTag, tangentTip, direction.x, direction.y, true);

    const tangentTagTop = tagBox.top;

    awayFromCentre(arcMiddle);
    placeTag(rotationTag, arcMiddle, direction.x, direction.y);
    // At a small angle the arc hugs the arrow, so its tag lifts clear of the arrow and the tangent's tag.
    rotationTag.offset.y -= Math.max(
      0,
      tagBox.bottom + TAG_GAP - tangentTagTop,
    );
  }

  /**
   * Above the twin. Where the sphere sits close enough on screen that the tag would touch it, to the twin's left, and
   * below it where the left runs off the screen.
   */
  function placeTwinTag() {
    const twinRadius = radius * twin.scale.y;

    twin.getGlobalPosition(twinCentre);
    placeTag(
      twinTag,
      twinCentre.addScaledVector(UP, twinRadius, worldPoint),
      0,
      -1,
    );
    if (sphereReach(tagBox) === 0) return;
    placeTag(
      twinTag,
      twinCentre.addScaledVector(cameraRight, -twinRadius, worldPoint),
      -1,
      0,
    );
    if (tagBox.left >= TAG_GAP) return;
    placeTag(
      twinTag,
      twinCentre.addScaledVector(UP, -twinRadius, worldPoint),
      0,
      1,
    );
  }

  /** Puts the sphere's outline on screen this frame into `sphereOnScreen` and `sphereRadiusOnScreen` */
  function findSphereOnScreen() {
    // The camera's own x, so the edge point lies across the view from the centre.
    cameraRight
      .setFromMatrixColumn(view3d.camera.getGlobalTransform(matrix), 0)
      .normalize();
    view3d.worldToScreen(sphereCentre, sphereOnScreen);
    view3d.worldToScreen(
      sphereCentre.addScaledVector(cameraRight, radius, worldPoint),
      point,
    );
    sphereRadiusOnScreen = Math.hypot(
      point.x - sphereOnScreen.x,
      point.y - sphereOnScreen.y,
    );
  }

  /** How far, in px, a rect reaches inside the sphere's outline grown by {@link TAG_GAP}; 0 when it's clear */
  function sphereReach(box) {
    const nearestX = Math.min(Math.max(sphereOnScreen.x, box.left), box.right);
    const nearestY = Math.min(Math.max(sphereOnScreen.y, box.top), box.bottom);
    const distance = Math.hypot(
      nearestX - sphereOnScreen.x,
      nearestY - sphereOnScreen.y,
    );

    return Math.max(0, sphereRadiusOnScreen + TAG_GAP - distance);
  }

  /** The unit screen direction from the highlight's centre to `to`, into `direction` */
  function awayFromCentre(to) {
    if (!view3d.worldToScreen(to, point))
      point.set(centreOnScreen.x, centreOnScreen.y - 1);

    const length =
      Math.hypot(point.x - centreOnScreen.x, point.y - centreOnScreen.y) || 1;

    direction.set(
      (point.x - centreOnScreen.x) / length,
      (point.y - centreOnScreen.y) / length,
    );
  }

  return {
    update() {
      findHighlight();
      placeArrowAndArc();
      // The sphere's outline before the tags, which keep clear of it.
      findSphereOnScreen();
      placeTwinTag();
      placeHighlightTags();
      labels.update();
    },
  };
}
