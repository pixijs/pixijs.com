/**
 * The world the portal looks into, 30 under the floor: a dome, a checker floor fading into it and the logo
 *
 * It's the dark stage in miniature, built by hand, since a second ThemeStage would take over the view's lights, fog
 * and background.
 */

import {
  Container3D,
  FlatMaterial,
  Geometry3D,
  Mesh3D,
  SphereGeometry,
} from '@pixi/3d';
import { Texture } from 'pixi.js';

import { loadPixiLogo } from './theme/logo';
import { mixColor, THEMES } from './theme/palette';

/**
 * The far world's colours by day and at night: the stage's floor as it shows on screen, since a flat material shows a
 * texture as painted. The night checks are the dark stage's, from the palette; its dim lights leave them nearly as they
 * are. The day ones are read from theme-kit's shots, since the light key lifts that floor above `THEMES.light.floor`
 * and the palette holds only the colour before the light.
 */
const FAR_COLORS = {
  day: {
    check: 0xffffff,
    checkDark: 0xf2e8ff,
    haze: THEMES.light.haze,
    sky: THEMES.light.sky,
  },
  night: {
    check: THEMES.dark.floor,
    checkDark: mixColor(0, THEMES.dark.floor, THEMES.dark.check),
    haze: THEMES.dark.haze,
    sky: THEMES.dark.sky,
  },
};
/** The dome that closes the far world in, and the floor, solid out to `fade` and gone by its edge */
const DOME_RADIUS = 22;
const FLOOR = { radius: 18, fade: 7, rings: 24, segments: 64 };
/**
 * The logo floats 4.5 into the far room, a little left: on the line from the resting camera in `index.ts`, at an
 * azimuth of 0.12, through the doorway's middle (−4.5 · tan 0.12), so the first frame shows it centred in the opening
 */
const LOGO = { width: 2.2, x: -0.55, y: 1.7, z: -4.5 };

/** One of the far world's colours, `darkness` of the way from day to night */
function farColor(key, darkness) {
  return mixColor(FAR_COLORS.day[key], FAR_COLORS.night[key], darkness);
}

/** A flat disc in the xz plane whose vertex alpha fades from `FLOOR.fade` to its edge, its UVs one check a unit */
function fadingDisc() {
  const { radius, fade, rings, segments } = FLOOR;
  const count = rings * segments + 1;
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const normals = new Float32Array(count * 3);
  const colors = new Float32Array(count * 4).fill(1);
  const indices = [];

  for (let i = 0; i < count; i++) normals[i * 3 + 1] = 1;

  for (let ring = 1; ring <= rings; ring++) {
    const r = (radius * ring) / rings;
    const t = Math.min(1, Math.max(0, (r - fade) / (radius - fade)));

    for (let s = 0; s < segments; s++) {
      const vertex = (ring - 1) * segments + s + 1;
      const angle = (Math.PI * 2 * s) / segments;
      const next = (ring - 1) * segments + ((s + 1) % segments) + 1;

      positions[vertex * 3] = r * Math.cos(angle);
      positions[vertex * 3 + 2] = r * Math.sin(angle);
      // A 2 × 2 tile spans two units, so every check corner lands on a whole number, as on the stage.
      uvs[vertex * 2] = positions[vertex * 3] / 2;
      uvs[vertex * 2 + 1] = positions[vertex * 3 + 2] / 2;
      colors[vertex * 4 + 3] = 1 - t * t * (3 - 2 * t);
      // The first ring fans from the middle; each later one joins the ring inside it with two triangles a step.
      if (ring === 1) indices.push(0, next, vertex);
      else
        indices.push(
          vertex - segments,
          next - segments,
          next,
          vertex - segments,
          next,
          vertex,
        );
    }
  }

  return new Geometry3D({
    positions,
    normals,
    uvs,
    colors,
    indices: new Uint16Array(indices),
  });
}

/** A texture over a canvas of its own */
function canvasTexture(width, height, repeat) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  // A canvas made here always gives a 2D context.
  const context = canvas.getContext('2d');
  const image = context.createImageData(width, height);
  const texture = Texture.from({
    resource: canvas,
    addressMode: repeat ? 'repeat' : 'clamp-to-edge',
    autoGenerateMipmaps: true,
    maxAnisotropy: 8,
  });

  return {
    texture,
    pixels: image.data,
    paint() {
      context.putImageData(image, 0, 0);
      texture.source.update();
    },
  };
}

/** Writes `count` opaque pixels of `color` into `pixels`, from pixel `start` */
function fillPixels(pixels, color, start, count) {
  for (let i = start * 4; i < (start + count) * 4; i += 4) {
    pixels[i] = (color >> 16) & 255;
    pixels[i + 1] = (color >> 8) & 255;
    pixels[i + 2] = color & 255;
    pixels[i + 3] = 255;
  }
}

/**
 * The world the portal looks into: a dome, a checker floor fading into it and the logo
 *
 * It shares the near side's lights and fog, so the dome and floor are flat and unfogged: lit, a night floor would
 * come out grey, and the light theme's haze would wash it out. None of it casts a shadow, or the key's shadow box
 * would stretch down to it.
 */
export async function createFarWorld({ at, darkness }) {
  const checks = canvasTexture(128, 128, true);
  const sky = canvasTexture(4, 128, false);
  const floorMaterial = new FlatMaterial({
    baseColorTexture: checks.texture,
    fog: false,
    alphaMode: 'blend',
  });
  const logo = await loadPixiLogo({ width: LOGO.width, castShadow: false });
  const root = new Container3D({ y: at });
  let painted = -1;

  floorMaterial.vertexColors = true;
  logo.root.position.set(LOGO.x, LOGO.y, LOGO.z);
  root.addChild(
    new Mesh3D({
      geometry: new SphereGeometry({
        radius: DOME_RADIUS,
        widthSegments: 32,
        heightSegments: 16,
      }),
      material: new FlatMaterial({
        baseColorTexture: sky.texture,
        doubleSided: true,
        fog: false,
      }),
      castShadow: false,
    }),
    new Mesh3D({
      geometry: fadingDisc(),
      material: floorMaterial,
      castShadow: false,
    }),
    logo.root,
  );

  // Written pixel by pixel rather than with canvas fills, so a theme fade repaints every frame without making garbage.
  function setDarkness(value) {
    if (value === painted) return;
    painted = value;

    const check = farColor('check', value);
    const checkDark = farColor('checkDark', value);
    const skyTop = farColor('sky', value);
    const haze = farColor('haze', value);

    for (let row = 0; row < 128; row++) {
      // One 2 × 2 tile of the stage's floor: light then dark across the top half, swapped across the bottom.
      fillPixels(checks.pixels, row < 64 ? check : checkDark, row * 128, 64);
      fillPixels(
        checks.pixels,
        row < 64 ? checkDark : check,
        row * 128 + 64,
        64,
      );
      // The sky overhead, easing to the haze at the horizon, and the haze all the way down.
      fillPixels(
        sky.pixels,
        mixColor(skyTop, haze, Math.min(1, (row + 0.5) / 64)),
        row * 4,
        4,
      );
    }
    checks.paint();
    sky.paint();
  }

  setDarkness(darkness);

  return {
    root,
    update(time) {
      logo.root.rotation.y = 0.3 * Math.sin(0.4 * time);
      logo.root.position.y = LOGO.y + 0.05 * Math.sin(0.9 * time);
    },
    setDarkness,
  };
}
