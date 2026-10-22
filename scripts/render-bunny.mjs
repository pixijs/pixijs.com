/**
 * Builds the hero's bunny from its sprite in `src/components/Home/Hero/field/bunnySprite.ts` (the PixiJS bunny, 26 by
 * 37 px):
 *
 * 1. Traces its silhouette, for what the field collides with and the shadow it drops: the alpha mask, 16 times up,
 *    opened with a disc so every outer corner rolls into an arc, softened a touch so the inner corners round too, then
 *    followed round at half coverage and thinned to the points its curves need. The 2 px gap between the ears stays
 *    open.
 * 2. Writes it, packed, to `src/components/Home/Hero/field/bunnyOutline.ts`.
 * 3. Renders its poster images, `static/images/clay/<theme>/clay/bunny-gold.webp`, in the pose the field rests it in,
 *    through the field's own geometry, material and lights, framed as the field frames it.
 *
 * Usage: node scripts/render-bunny.mjs
 * Needs Playwright's Chromium (`npx playwright install chromium`); WebGL runs on SwiftShader.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderInPage, writeDataUrl } from './browser.mts';

const root = path.resolve(import.meta.dirname, '..');
const SPRITE_FILE = path.join(root, 'src/components/Home/Hero/field/bunnySprite.ts');
const OUTLINE_FILE = path.join(root, 'src/components/Home/Hero/field/bunnyOutline.ts');

/** Grid cells per sprite pixel, and sprite pixels of empty margin round the sprite */
const UP = 16;
const PAD = 4;
/** The disc the mask is opened with, and the blur after it, in sprite pixels */
const OPEN = 1.8;
const SOFTEN = 0.5;
/** A point is kept once the outline has run this far, or turned this much, since the last one */
const MAX_RUN = 2.2;
const MAX_TURN = (10 * Math.PI) / 180;
/** The outline is packed as int16s over this */
const OUTLINE_SCALE = 8192;

/** Squared Euclidean distance transform of one line (Felzenszwalb and Huttenlocher) */
function line(f, n) {
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  let k = 0;

  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s;

    do {
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    } while (s <= z[k] && --k >= 0);
    v[++k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) ** 2 + f[v[k]];
  }

  return d;
}

/** Distance from every cell to the nearest cell where `on` holds, in cells */
function distance(on, width, height) {
  const BIG = 1e12;
  const grid = new Float64Array(width * height);
  const column = new Float64Array(height);

  for (let i = 0; i < grid.length; i++) grid[i] = on(i) ? 0 : BIG;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) column[y] = grid[y * width + x];
    const d = line(column, height);

    for (let y = 0; y < height; y++) grid[y * width + x] = d[y];
  }
  for (let y = 0; y < height; y++) {
    const d = line(grid.subarray(y * width, (y + 1) * width), width);

    for (let x = 0; x < width; x++) grid[y * width + x] = Math.sqrt(d[x]);
  }

  return grid;
}

function blur(values, width, height, sigma) {
  const radius = Math.ceil(sigma * 3);
  const kernel = Array.from({ length: radius * 2 + 1 }, (_, i) => Math.exp(-((i - radius) ** 2) / (2 * sigma * sigma)));
  const total = kernel.reduce((a, b) => a + b);
  const pass = (from, step, count, stride, lines) => {
    const out = new Float64Array(from.length);

    for (let l = 0; l < lines; l++) {
      for (let i = 0; i < count; i++) {
        let sum = 0;

        for (let k = -radius; k <= radius; k++) {
          const j = Math.min(count - 1, Math.max(0, i + k));

          sum += from[l * stride + j * step] * kernel[k + radius];
        }
        out[l * stride + i * step] = sum / total;
      }
    }

    return out;
  };

  return pass(pass(values, 1, width, width, height), width, height, 1, width);
}

/** The one closed loop where `field` crosses 0.5, in grid coordinates, by marching squares */
function trace(field, width, height) {
  const at = (x, y) => field[y * width + x];
  const crossing = new Map();
  const links = new Map();
  const point = (key) => {
    if (crossing.has(key)) return;
    const [kind, x, y] = key.split(',').map(Number);
    const a = at(x, y);
    const b = kind ? at(x, y + 1) : at(x + 1, y);
    const t = (0.5 - a) / (b - a);

    crossing.set(key, kind ? [x, y + t] : [x + t, y]);
  };
  const link = (a, b) => {
    point(a);
    point(b);
    links.set(a, [...(links.get(a) ?? []), b]);
    links.set(b, [...(links.get(b) ?? []), a]);
  };

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const corners = [at(x, y), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1)].map((v) => v > 0.5);
      const edges = [`0,${x},${y}`, `1,${x + 1},${y}`, `0,${x},${y + 1}`, `1,${x},${y}`];
      const cut = edges.filter((_, i) => corners[i] !== corners[(i + 1) % 4]);

      if (cut.length === 2) link(cut[0], cut[1]);
      else if (cut.length === 4) {
        const centre = (at(x, y) + at(x + 1, y) + at(x + 1, y + 1) + at(x, y + 1)) / 4 > 0.5;

        if (centre === corners[0]) {
          link(edges[0], edges[1]);
          link(edges[2], edges[3]);
        } else {
          link(edges[3], edges[0]);
          link(edges[1], edges[2]);
        }
      }
    }
  }

  const start = links.keys().next().value;
  const loop = [start];

  for (let previous = start, current = links.get(start)[0]; current !== start;) {
    loop.push(current);
    const next = links.get(current).find((key) => key !== previous);

    previous = current;
    current = next;
  }
  if (loop.length !== crossing.size) throw new Error(`The silhouette traced as more than one loop`);

  return loop.map((key) => crossing.get(key));
}

/**
 * Thins a dense loop to the points its curves need: one every {@link MAX_RUN}, or wherever its heading has turned
 * {@link MAX_TURN} from the last point kept. The heading is taken across a few cells, which steps over the grid.
 */
function thin(loop) {
  const count = loop.length;
  const heading = (i) => {
    const [ax, ay] = loop[(i + count - 3) % count];
    const [bx, by] = loop[(i + 3) % count];

    return Math.atan2(by - ay, bx - ax);
  };
  const kept = [loop[0]];
  let run = 0;
  let last = heading(0);

  for (let i = 1; i < count; i++) {
    const turn = Math.abs(((heading(i) - last + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);

    run += Math.hypot(loop[i][0] - loop[i - 1][0], loop[i][1] - loop[i - 1][1]);
    if (run >= MAX_RUN * UP || turn >= MAX_TURN) {
      kept.push(loop[i]);
      run = 0;
      last = heading(i);
    }
  }

  return kept;
}

/** A sprite's silhouette from its grid of rows, where `.` is a clear pixel */
function outline(rows) {
  const columns = rows[0].length;
  const width = (columns + PAD * 2) * UP;
  const height = (rows.length + PAD * 2) * UP;
  const inside = (i) => {
    const x = Math.floor((i % width) / UP) - PAD;
    const y = Math.floor(Math.floor(i / width) / UP) - PAD;

    return x >= 0 && y >= 0 && x < columns && y < rows.length && rows[y][x] !== '.';
  };
  const depth = distance((i) => !inside(i), width, height);
  const core = distance((i) => depth[i] > OPEN * UP, width, height);
  const opened = Float64Array.from(core, (d) => (d <= OPEN * UP ? 1 : 0));
  const loop = thin(trace(blur(opened, width, height, SOFTEN * UP), width, height));
  const half = rows.length / 2;
  // Cell centres to sprite pixels, then to units: the middle of the sprite at the origin, y up, its height 2
  let points = loop.flatMap(([x, y]) => [
    ((x + 0.5) / UP - PAD - columns / 2) / half,
    -((y + 0.5) / UP - PAD - half) / half,
  ]);
  let area = 0;

  for (let i = 0; i < points.length; i += 2) {
    const j = (i + 2) % points.length;

    area += points[i] * points[j + 1] - points[j] * points[i + 1];
  }
  if (area < 0) {
    const pairs = [];

    for (let i = 0; i < points.length; i += 2) pairs.unshift(points[i], points[i + 1]);
    points = pairs;
  }

  return points;
}

const pack = (array) => Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('base64');

const { BUNNY_SPRITE } = await import(pathToFileURL(SPRITE_FILE).href);
const points = outline(BUNNY_SPRITE);

fs.writeFileSync(
  OUTLINE_FILE,
  `/**
 * The bunny's silhouette, written by \`scripts/render-bunny.mjs\` from its sprite in \`bunnySprite.ts\`: points
 * counter-clockwise as x, y pairs of little-endian int16 over {@link OUTLINE_SCALE} (the sprite's height runs -1 to 1),
 * for what the field collides with and the shadow it drops. Regenerate rather than edit.
 */
export const OUTLINE_SCALE = ${OUTLINE_SCALE};
export const BUNNY_OUTLINE =
  '${pack(Int16Array.from(points, (v) => Math.round(v * OUTLINE_SCALE)))}';
`,
);
console.log(`${path.relative(root, OUTLINE_FILE)}  ${points.length / 2} outline points`);

const SIZE = 384;
const page = `
import { Application } from 'pixi.js';
import { Container3D, DirectionalLight, Mesh3D, View3D } from '@pixi/3d';
import { createBunnyGeometry, createBunnyMaterial, KEY_DIRECTION, lightClay } from './src/components/Home/Hero/field/clay';
import { HERO_POSES, posterFit } from './src/components/Home/Hero/field/kinds';
import './src/utils/pixi3dCompat';

const SIZE = ${SIZE};
const DISTANCE = 12;
const FOV = 22;

window.renderBunny = async () => {
  const app = new Application();

  await app.init({ width: SIZE, height: SIZE, backgroundAlpha: 0, antialias: true, preference: ['webgl'], preserveDrawingBuffer: true, resolution: 1 });

  const view = new View3D({ width: SIZE, height: SIZE, toneMapping: 'aces' });
  const key = new DirectionalLight();
  const holder = new Container3D();
  const geometry = createBunnyGeometry();
  const material = createBunnyMaterial();
  const mesh = new Mesh3D({ geometry, material });
  const [pitch, yaw, roll] = HERO_POSES['bunny-gold'];
  const fit = posterFit('bunny', 'gold');
  // World units per pixel where the bunny stands, and per unit of its geometry
  const world = (2 * Math.tan((FOV * Math.PI) / 360) * DISTANCE) / SIZE;
  const scale = SIZE * fit.radius * world;

  view.camera.fov = FOV;
  holder.position.set(fit.offsetX * scale, -fit.offsetY * scale, -DISTANCE);
  holder.rotation.set(0, 0, roll);
  mesh.rotation.set(pitch, yaw, 0);
  mesh.scale.set(scale, scale, scale);
  key.position.set(-KEY_DIRECTION.x * 16, -KEY_DIRECTION.y * 16, -DISTANCE - KEY_DIRECTION.z * 16);
  key.lookAt(holder.position);
  holder.addChild(mesh);
  view.root.addChild(key, holder);
  app.stage.addChild(view);

  const out = {};

  for (const theme of ['dark', 'light']) {
    lightClay(view, key, theme, [material]);
    app.render();
    out[theme] = app.canvas.toDataURL('image/webp', 0.9);
  }

  app.destroy();

  return out;
};
`;

const renders = await renderInPage(page, 'renderBunny');

for (const [theme, url] of Object.entries(renders)) {
  writeDataUrl(path.join(root, `static/images/clay/${theme}/clay/bunny-gold.webp`), url);
}
