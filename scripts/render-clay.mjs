/**
 * Renders the clay shapes into `static/images/clay/<theme>/clay/<shape>.webp`: 12 glossy shapes
 * for the dark and light themes, 384 px square on transparent. They come from the hero field's own
 * geometry, materials and lights (`src/components/Home/Hero/field`), so a pre-rendered shape is the same object
 * as a live one. The flat 2D shapes are the standard set in `static/assets/standard`.
 *
 * Usage: node scripts/render-clay.mjs [--out <dir>]
 * Needs Playwright's Chromium (`npx playwright install chromium`); WebGL runs on SwiftShader.
 */
import path from 'node:path';
import { parseArgs } from 'node:util';
import { renderInPage, writeDataUrl } from './browser.mts';

const root = path.resolve(import.meta.dirname, '..');
const { values } = parseArgs({ options: { out: { type: 'string', default: path.join(root, 'static/images/clay') } } });

const SIZE = 384;

const page = `
import { Application } from 'pixi.js';
import { Container3D, DirectionalLight, Mesh3D, View3D } from '@pixi/3d';
import { createClayAssets, KEY_DIRECTION } from './src/components/Home/Hero/field/clay';
import { CLAY_POSES, KIND_PITCH } from './src/components/Home/Hero/field/kinds';
import './src/utils/pixi3dCompat';

const SIZE = ${SIZE};
const DISTANCE = 12;
/** Largest distance from the centre to an opaque pixel, as a share of the frame */
const FILL = 0.45;

window.renderClay = async () => {
  // Each shape in the pose the hero field rests it in, so an image and its live shape are one picture
  const shapes = Object.entries(CLAY_POSES).map(([name, pose]) => [name, ...pose]);
  const app = new Application();

  await app.init({ width: SIZE, height: SIZE, backgroundAlpha: 0, antialias: true, preference: ['webgl'], preserveDrawingBuffer: true, resolution: 1 });

  const view = new View3D({ width: SIZE, height: SIZE, toneMapping: 'aces' });
  const key = new DirectionalLight();
  const holder = new Container3D();
  const assets = createClayAssets();
  const mesh = new Mesh3D({ geometry: assets.geometries.sphere, material: assets.materials.pink });
  const halfHeight = Math.tan((22 * Math.PI) / 360) * DISTANCE;
  const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });

  probe.canvas.width = SIZE;
  probe.canvas.height = SIZE;
  view.camera.fov = 22;
  holder.position.set(0, 0, -DISTANCE);
  key.position.set(-KEY_DIRECTION.x * 16, -KEY_DIRECTION.y * 16, -DISTANCE - KEY_DIRECTION.z * 16);
  key.lookAt(holder.position);
  holder.addChild(mesh);
  view.root.addChild(key, holder);
  app.stage.addChild(view);

  const pose = ([name, pitch, yaw, roll], theme, scale = 1, x = 0, y = 0) => {
    const [kind, tint] = name.split('-');

    assets.apply(view, key, theme);
    mesh.geometry = assets.geometries[kind];
    mesh.material = assets.materials[tint];
    mesh.rotation.set(KIND_PITCH[kind] + pitch, yaw, 0);
    mesh.scale.set(scale, scale, scale);
    holder.rotation.set(0, 0, roll);
    holder.position.set(x, y, -DISTANCE);
    app.render();
  };

  /** Scale and offset that centre the opaque pixels and fill {@link FILL} of the frame */
  const frame = () => {
    probe.clearRect(0, 0, SIZE, SIZE);
    probe.drawImage(app.canvas, 0, 0);

    const { data } = probe.getImageData(0, 0, SIZE, SIZE);
    let [left, top, right, bottom] = [SIZE, SIZE, 0, 0];

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 8) continue;
      const px = ((i - 3) / 4) % SIZE;
      const py = Math.floor((i - 3) / 4 / SIZE);

      left = Math.min(left, px);
      right = Math.max(right, px);
      top = Math.min(top, py);
      bottom = Math.max(bottom, py);
    }

    return { centre: [(left + right) / 2, (top + bottom) / 2], extent: Math.max(right - left, bottom - top) / 2 };
  };

  const out = {};

  for (const shape of shapes) {
    pose(shape, 'dark');
    const { centre, extent } = frame();
    const scale = (FILL * SIZE) / extent;
    const world = (2 * halfHeight) / SIZE;
    const x = (SIZE / 2 - centre[0]) * world * scale;
    const y = (centre[1] - SIZE / 2) * world * scale;

    for (const theme of ['dark', 'light']) {
      pose(shape, theme, scale, x, y);
      out[theme + '/clay/' + shape[0]] = app.canvas.toDataURL('image/webp', 0.9);
    }
  }

  return out;
};
`;

const renders = await renderInPage(page, 'renderClay');

for (const [name, url] of Object.entries(renders)) writeDataUrl(path.join(values.out, `${name}.webp`), url);
