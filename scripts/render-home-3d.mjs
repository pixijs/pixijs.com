/**
 * Renders the stills in the `/3d` feature tiles into `static/images/home/3d/`:
 *
 *   <name>-<theme>.webp       1600×900, transparent, so the tile's own backdrop shows through
 *   <name>-<theme>-800.webp   the same at 800×450, for small screens
 *
 * The scenes are in `scripts/home-3d-stills.ts`. They're drawn at twice the size and scaled down, which is
 * what smooths the edges of the glass.
 *
 * `node scripts/render-home-3d.mjs [--only gltf,pbr] [--themes dark,light] [--out <dir>] [--gpu]`
 *
 * Runs in Playwright's Chromium (`npx playwright install chromium`) on SwiftShader, or on the machine's GPU with
 * `--gpu`. Needs `static-pixi-3d/assets` (`npm run generate:pixi-3d`) for the sunset, and the network for the toy
 * car's model.
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { serve, SWIFTSHADER_ARGS } from './browser.mts';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'static-pixi-3d/assets');
const SIZE = { width: 1600, height: 900 };
const WIDTHS = [1600, 800];

const { values } = parseArgs({
  options: {
    only: { type: 'string', default: 'gltf,pbr' },
    themes: { type: 'string', default: 'dark,light' },
    out: { type: 'string', default: path.join(ROOT, 'static/images/home/3d') },
    gpu: { type: 'boolean', default: false },
  },
});

if (!fs.existsSync(ASSETS)) {
  console.error(`${path.relative(ROOT, ASSETS)} is missing; run npm run generate:pixi-3d`);
  process.exit(1);
}
fs.mkdirSync(values.out, { recursive: true });

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'home-3d-'));

await build({
  entryPoints: [path.join(ROOT, 'scripts/home-3d-stills.ts')],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: path.join(work, 'stills.js'),
  logLevel: 'error',
});
fs.writeFileSync(
  path.join(work, 'index.html'),
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}` +
    `#host{width:${SIZE.width}px;height:${SIZE.height}px}</style><div id="host"></div>` +
    `<script type="module" src="/stills.js"></script>`,
);

const { server, origin } = await serve([
  ['/assets/', ASSETS],
  ['/', work],
]);

const browser = await chromium.launch({
  args: values.gpu ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : SWIFTSHADER_ARGS,
});

try {
  const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 2 });
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(origin);
  await page.waitForFunction(() => 'still' in window);

  for (const name of values.only.split(',')) {
    for (const theme of values.themes.split(',')) {
      await page.evaluate(([scene, t]) => window.still(scene, t), [name, theme]);
      const png = await page.locator('#host').screenshot({ omitBackground: true });

      for (const width of WIDTHS) {
        const file = path.join(values.out, `${name}-${theme}${width === SIZE.width ? '' : `-${width}`}.webp`);

        await sharp(png).resize(width).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(file);
        console.log(`${path.basename(file)} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally {
  await browser.close();
  server.close();
  fs.rmSync(work, { recursive: true, force: true });
}
