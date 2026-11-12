/**
 * The marks the outside view draws round the orbit: the band the limits leave open, the two angles and their zero
 * arrows, the distance and its limits, the camera's glyph, and the ghost of the saved pose
 *
 * Everything is placed from the orbit's own numbers, `target`, `polarAngle`, `azimuthAngle` and `distance`, so the
 * marks show the sphere the camera moves on the way the orbit works it out.
 */

import { Quaternion, Spherical, Vector3 } from '@pixi/3d';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { FrustumHelper } from './theme/FrustumHelper';
import { BRAND } from './theme/palette';
import { SphereBandHelper } from './SphereBandHelper';

/**
 * The camera's glyph, its view volume and the zero arrows, as shares of the dome's radius, so they scale with it. The
 * volume stops short of `minDistance` at the opening pose, so the limit's bar shows.
 */
export const GLYPH_SHARE = 0.1;
const VOLUME_SHARE = 0.15;
const AXIS_SHARE = 0.35;
/** Line widths, and half a limit bar's length, in the inset's px */
const LINE_PX = 1.5;
const ARC_PX = 2.5;
const BAR_PX = 9;
/** The steps each arc and the distance are cut into for the tags: an arc bows 3 px at most on the widest dome */
const STEPS = 8;

const UP = { x: 0, y: 1, z: 0 };
const FRONT = { x: 0, y: 0, z: 1 };
const _axis = new Vector3();
const _across = new Vector3();
const _out = new Vector3();
const _point = new Vector3();
const _end = new Vector3();
const _spherical = new Spherical();

/** The back of a camera glyph's body, `size` behind its eye: a camera looks down its -z, so its back is along +z */
function backOf(glyph, out) {
  return out
    .set(0, 0, 1)
    .applyQuaternion(glyph.quaternion)
    .multiplyScalar(glyph.size)
    .add(glyph.eye);
}

/** Builds the marks under `root`, the outside view's scene, for the orbit driving `view3d.camera` */
export function createOrbitMarks(root, view3d, orbit) {
  const camera = view3d.camera;
  const band = new SphereBandHelper({ parent: root });
  const up = new ArrowHelper({ color: 'y', parent: root });
  const front = new ArrowHelper({ color: 'z', parent: root });
  const polarArc = new AngleHelper({
    color: 'y',
    head: false,
    wedge: false,
    parent: root,
  });
  // The meridian on from the camera down to the target's level, where the azimuth is measured.
  const levelArc = new AngleHelper({
    color: 'ink',
    head: false,
    wedge: false,
    parent: root,
  });
  const azimuthArc = new AngleHelper({
    color: 'z',
    head: false,
    wedge: false,
    parent: root,
  });
  const segment = new ArrowHelper({ color: 'ink', head: false, parent: root });
  const track = new ArrowHelper({ color: 'ink', head: false, parent: root });
  const minBar = new ArrowHelper({ color: 'ink', head: false, parent: root });
  const maxBar = new ArrowHelper({ color: 'ink', head: false, parent: root });
  const ghost = new FrustumHelper({
    camera,
    view: view3d,
    color: 'ink',
    opacity: 0.22,
    parent: root,
  });
  const glyph = new FrustumHelper({
    camera,
    view: view3d,
    color: BRAND.purple,
    parent: root,
  });
  const saved = { position: new Vector3(), quaternion: new Quaternion() };
  const steps = () => Array.from({ length: STEPS + 1 }, () => new Vector3());
  const polarPath = steps();
  const levelPath = steps();
  const azimuthPath = steps();
  const distancePath = steps();
  const trackPath = [new Vector3(), new Vector3()];
  const upPath = [new Vector3(), new Vector3()];
  const frontPath = [new Vector3(), new Vector3()];
  const glyphBack = new Vector3();
  const ghostBack = new Vector3();
  /** The arrows' length, a share of the dome they were sized for, and half a bar's, in world units */
  let axisLength = 1;
  let barLength = 0;

  // The ghost keeps the shape it read from the camera and holds the pose it's given.
  ghost.camera = null;

  /** The point `distance` from the target along the line out through the camera, into `out` */
  function alongView(distance, out) {
    return out.copyFrom(_out).multiplyScalar(distance).add(orbit.target);
  }

  /** Lays a limit's bar across the track `distance` from the target, along the meridian */
  function placeBar(bar, distance) {
    alongView(distance, _point);
    bar.set(
      _end.copyFrom(_point).addScaledVector(_across, barLength),
      _point.addScaledVector(_across, -barLength),
    );
  }

  /** Poses the ghost on the saved pose, which also rebuilds it at its size */
  function poseGhost() {
    ghost.setPose(saved.position, saved.quaternion);
    backOf(ghost, ghostBack);
  }

  return {
    savedPosition: saved.position,
    ghostEye: ghost.eye,
    paths: {
      polar: polarPath,
      level: levelPath,
      azimuth: azimuthPath,
      distance: distancePath,
      track: trackPath,
      up: upPath,
      front: frontPath,
    },
    glyphPoints: [glyph.eye, glyphBack, ...glyph.corners],
    ghostPoints: [ghost.eye, ghostBack, ...ghost.corners],
    size(pixel, reach) {
      axisLength = reach * AXIS_SHARE;
      barLength = pixel * BAR_PX;
      up.thickness = front.thickness = segment.thickness = pixel * LINE_PX;
      polarArc.thickness = azimuthArc.thickness = pixel * ARC_PX;
      levelArc.thickness =
        track.thickness =
        minBar.thickness =
        maxBar.thickness =
          pixel;
      band.thickness = glyph.thickness = ghost.thickness = pixel;
      glyph.size = ghost.size = reach * GLYPH_SHARE;
      glyph.length = ghost.length = reach * VOLUME_SHARE;
      poseGhost();
    },
    update() {
      const { target, polarAngle: phi, azimuthAngle: theta, distance } = orbit;
      const position = camera.position;

      _out.copyFrom(position).subtract(target).normalize();

      // The band, the zero arrows and the arcs, all round the target at the camera's distance.
      band.position.copyFrom(target);
      band.radius = distance;
      band.set(
        orbit.minPolarAngle,
        orbit.maxPolarAngle,
        orbit.minAzimuthAngle,
        orbit.maxAzimuthAngle,
      );
      up.set(
        upPath[0].copyFrom(target),
        upPath[1].copyFrom(target).addScaledVector(UP, axisLength),
      );
      front.set(
        frontPath[0].copyFrom(target),
        frontPath[1].copyFrom(target).addScaledVector(FRONT, axisLength),
      );
      // The meridian's plane holds up and the camera; its axis is square to both, so a positive turn tips up toward it.
      _axis.set(Math.cos(theta), 0, -Math.sin(theta));
      polarArc.position.copyFrom(target);
      levelArc.position.copyFrom(target);
      azimuthArc.position.copyFrom(target);
      polarArc.radius = levelArc.radius = azimuthArc.radius = distance;
      polarArc.setAxis(_axis, UP).radians = phi;
      levelArc.setAxis(_axis, _out).radians = Math.PI / 2 - phi;
      azimuthArc.setAxis(UP, FRONT).radians = theta;
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;

        polarPath[i]
          .setFromSpherical(_spherical.set(distance, phi * t, theta))
          .add(target);
        levelPath[i]
          .setFromSpherical(
            _spherical.set(distance, phi + (Math.PI / 2 - phi) * t, theta),
          )
          .add(target);
        azimuthPath[i]
          .setFromSpherical(_spherical.set(distance, Math.PI / 2, theta * t))
          .add(target);
        alongView(distance * t, distancePath[i]);
      }

      // The distance runs out to the camera along a track to `maxDistance`, with a bar at each limit. The bars lie
      // along the meridian, square to the track: toward the point a quarter turn further down it.
      segment.set(target, position);
      track.set(target, alongView(orbit.maxDistance, trackPath[1]));
      trackPath[0].copyFrom(position);
      _across.setFromSpherical(_spherical.set(1, phi + Math.PI / 2, theta));
      placeBar(minBar, orbit.minDistance);
      placeBar(maxBar, orbit.maxDistance);

      glyph.update();
      backOf(glyph, glyphBack);
    },
    saveGhost() {
      saved.position.copyFrom(camera.position);
      saved.quaternion.copyFrom(camera.quaternion);
      poseGhost();
    },
  };
}
