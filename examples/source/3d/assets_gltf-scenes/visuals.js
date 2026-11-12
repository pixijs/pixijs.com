/**
 * What the frame draws to explain a glTF file's cameras and lights: an inset, bottom right, of the scene from outside,
 * since a camera can't show where it stands itself
 *
 * A kit InsetView draws the same scene again from its own camera, which sways slowly round the stand. Each of the
 * file's cameras gets a stub of its view volume and its name, the one the view looks through in accent, and each light
 * of the model in the view gets its shape. They draw in the inset's pass only, so the main view stays exactly what the
 * file's camera sees. It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import {
  Camera3D,
  Container3D,
  DirectionalLight,
  Matrix4,
  PointLight,
  SpotLight,
  Spherical,
  Vector3,
} from '@pixi/3d';

import { FrustumHelper } from './theme/FrustumHelper';
import { InsetView } from './theme/InsetView';
import { LightHelper } from './theme/LightHelper';

/**
 * Where the inset looks from: the stand's right (+x) and 20° up, so the cameras the file put in front of the stand
 * spread out to its left, each at its own height. It sways 4° either way round the stand over 24 s, so the parallax
 * shows how high things sit; any further and the Close camera's stub crosses the ball. A narrow fov keeps the near
 * cameras from drawing much larger than the far ones.
 */
const VIEW = {
  azimuth: Math.PI / 2,
  elevation: (20 * Math.PI) / 180,
  sway: (4 * Math.PI) / 180,
  fov: 20,
};
const SWAY_SECONDS = 24;
/**
 * The picture's size in px. It shrinks to stay clear of the stand: to `share` of a short screen's height, a phone held
 * sideways, and to the room beside or below the stand, whichever is larger, though no smaller than `least`, where the
 * camera tags start to overlap. Under 600 px wide it spans the screen instead.
 */
const PICTURE = {
  width: 344,
  height: 206,
  share: 0.38,
  least: 0.66,
  narrowHeight: 188,
};
/**
 * How far right of and below the screen's centre `Wide` draws the stand's foot, with the picture's gutter, as a share
 * of the screen's shorter side: the file's cameras fit `fov` to that side, so the stand's size on screen follows it
 */
const STAND_REACH = 0.35;
/** Room round the framed points, in px, for what draws past them: the glyphs behind `Iso`'s and `Wide`'s eyes */
const MARGIN = { top: 32, right: 12, bottom: 10, left: 36 };
/**
 * Line widths in inset px. The lamp's are thinner, since its body is drawn 7 lines wide and would swamp the camera
 * glyphs beside it.
 */
const LINE_PX = 2;
const LAMP_PX = 1.2;
/** How far a camera's view volume runs, as a stub, longer for the camera the view looks through, and its glyph */
const STUB_LENGTH = 0.6;
const ACTIVE_STUB = 0.9;
const GLYPH = 0.45;
/** Half the width of an orthographic camera's box at a zoom of 1: `Iso`'s real one is 9.2 m wide and would fill the inset */
const ORTHOGRAPHIC_GLYPH = 0.35;
/** The lamp's cone as a stub too, so it ends above the toys; its pool on the plinth shows where it lands */
const LAMP_STUB = 1.8;
/** The sun's three rays: how far apart, how long, and how far short of the ring they end */
const SUN_RAYS = { rays: 3, spread: 0.5, length: 1.4, gap: 1 };
const BULB = 0.09;
/** Where each camera's name sits from its eye, by the file's camera names, in px: off the lines as the inset sways */
const TAG_PLACES = {
  Wide: { offset: { x: 0, y: 16 }, anchor: { x: 0.5, y: 0 } },
  Close: { offset: { x: 8, y: 16 }, anchor: { x: 1, y: 0 } },
  Iso: { offset: { x: -24, y: 0 }, anchor: { x: 1, y: 0.5 } },
};

const _matrix = new Matrix4();
const _scale = new Vector3();
const _spherical = new Spherical();

/** The lights a glTF file can hold: `KHR_lights_punctual` has no ambient light */

/** One model's light shapes, in a group that hides them while the model is out of the view */

export function createVisuals({ app, view3d, stage, models }) {
  const inset = new InsetView({
    app,
    view3d,
    stage,
    title: 'seen from outside',
    corner: 'bottom-right',
    narrow: { width: 'full', height: PICTURE.narrowHeight },
  });
  const pass = inset.pass;
  const parent = view3d.root;
  // A same-scene inset always has a camera.
  const camera = inset.camera;
  // The stand, measured once from the file: lights and cameras have no size, so a model's bounds are its stand's.
  const stand = models[0].getLocalBounds();
  const centre = stand.getCenter();
  // The Plinth stands unturned at the model's origin, so its own top is the plinth top the bulb's pool lies on.
  const plinthTop =
    models[0].getChildByLabel('Plinth', true)?.getLocalBounds().max.y ??
    stand.min.y;
  // The sun's rays come down onto the ring at the back, clear of the cameras in front.
  const rayTarget =
    models[0].getChildByLabel('Ring', true)?.getGlobalPosition() ?? centre;
  // Both scenes hold the same cameras, so one set of stubs follows whichever model is in the view.
  const fileCameras = models[0].cameras;
  // An orthographic camera's box is drawn from a stand-in that copies its pose and zoom, at a size the inset can hold.
  const glyphs = fileCameras.map(({ mode }) =>
    mode === 'orthographic'
      ? new Camera3D({ mode, orthographicSize: ORTHOGRAPHIC_GLYPH })
      : null,
  );
  const frustums = fileCameras.map(
    () => new FrustumHelper({ view: view3d, size: GLYPH, pass, parent }),
  );
  const cameraTags = fileCameras.map(({ label }, i) =>
    inset.labels.add({
      text: label ?? '',
      node: frustums[i],
      ...TAG_PLACES[label ?? ''],
    }),
  );
  const lightMarks = models.map(markLights);
  // Every camera and light of both scenes, and the rim of the stand's round footprint, so the inset holds still when
  // the scene changes. The file's cameras and lights never move, so their places are read once.
  const framed = [
    ...fileCameras.map((fileCamera) => fileCamera.getGlobalPosition()),
    ...lightMarks.flatMap(({ helpers }) => helpers.map(({ tail }) => tail)),
    { x: stand.min.x, y: stand.min.y, z: centre.z },
    { x: stand.max.x, y: stand.min.y, z: centre.z },
    { x: centre.x, y: stand.min.y, z: stand.min.z },
    { x: centre.x, y: stand.min.y, z: stand.max.z },
  ];
  let elapsed = 0;

  camera.fov = VIEW.fov;
  fitPicture(app.screen.width, app.screen.height);
  app.renderer.on('resize', fitPicture);
  app.stage.addChild(inset);

  /** Sizes the picture for the screen: full size, or what fits a short screen and the room the stand leaves */
  function fitPicture(width, height) {
    const reach = STAND_REACH * Math.min(width, height);
    const beside = (width / 2 - reach) / PICTURE.width;
    const below = (height / 2 - reach) / PICTURE.height;
    const scale = Math.min(
      1,
      (height * PICTURE.share) / PICTURE.height,
      Math.max(PICTURE.least, beside, below),
    );

    inset.setSize(
      Math.round(PICTURE.width * scale),
      Math.round(PICTURE.height * scale),
    );
  }

  /** A shape for each light the model holds, in a group that hides them while it's out of the view */
  function markLights(model) {
    const group = new Container3D({ visible: false, parent });

    return {
      group,
      helpers: model.children
        .filter(isFileLight)
        .map((light) => shapeOf(light, group)),
    };
  }

  /** The sun's rays aimed at the ring, a stub of the lamp's cone, the bulb with its footprint on the plinth */
  function shapeOf(light, group) {
    const look = { light, pass, parent: group };

    // In ink: the sun's warm white would vanish into the inset's light-theme sky.
    if (light instanceof DirectionalLight) {
      return new LightHelper({
        ...look,
        target: rayTarget,
        color: 'ink',
        ...SUN_RAYS,
      });
    }
    if (light instanceof PointLight)
      return new LightHelper({ ...look, footprint: plinthTop, bulb: BULB });

    return new LightHelper({ ...look, length: LAMP_STUB });
  }

  /** Whether the model is the one `index.ts` put in the view */
  function isInView(model) {
    return model.parent === parent;
  }

  /** Shows the light marks of the model in the view and hides the other's */
  function drawLights(shown, unitsPerPixel) {
    for (let m = 0; m < models.length; m++) {
      const { group, helpers } = lightMarks[m];

      group.visible = models[m] === shown;
      if (!group.visible) continue;
      for (let i = 0; i < helpers.length; i++) {
        const helper = helpers[i];

        helper.thickness =
          unitsPerPixel *
          (helper.light instanceof SpotLight ? LAMP_PX : LINE_PX);
        helper.update();
      }
    }
  }

  /** The stub on each camera of the model in the view; the one the view looks through is accent and longer */
  function drawCameras(model, unitsPerPixel) {
    for (let i = 0; i < frustums.length; i++) {
      const fileCamera = model.cameras[i];
      const glyph = glyphs[i];
      const frustum = frustums[i];
      const active = fileCamera === view3d.camera;

      if (glyph) {
        fileCamera
          .getGlobalTransform(_matrix)
          .decompose(glyph.position, glyph.quaternion, _scale);
        glyph.zoom = fileCamera.zoom;
      }
      frustum.camera = glyph ?? fileCamera;
      frustum.color = active ? 'accent' : 'ink';
      frustum.length = active ? ACTIVE_STUB : STUB_LENGTH;
      frustum.thickness = unitsPerPixel * LINE_PX;
      frustum.update();
      cameraTags[i].color = active ? 'accent' : null;
    }
  }

  /** Turns the inset camera to the stand from its swaying side, then backs it off until everything fits */
  function placeCamera() {
    const azimuth =
      VIEW.azimuth +
      VIEW.sway * Math.sin((elapsed / SWAY_SECONDS) * Math.PI * 2);

    camera.position
      .setFromSpherical(
        _spherical.set(1, Math.PI / 2 - VIEW.elevation, azimuth),
      )
      .add(centre);
    camera.lookAt(centre);
    inset.frame(framed, MARGIN);
  }

  return {
    update(dt) {
      const shown = models.find(isInView) ?? models[0];

      elapsed += dt;
      // Framed first, so the lines can be sized in px at the distance it settles on.
      placeCamera();
      drawLights(shown, inset.unitsPerPixel);
      drawCameras(shown, inset.unitsPerPixel);
      inset.update(dt);
    },
  };
}

function isFileLight(node) {
  return (
    node instanceof DirectionalLight ||
    node instanceof PointLight ||
    node instanceof SpotLight
  );
}
