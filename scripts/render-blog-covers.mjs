/**
 * Renders blog post covers into `static/images/blog/covers/<slug>.jpg`, 1600×840: the PixiJS logo as a model over the
 * home hero's backdrop, a scatter of clay shapes, and a headline. A post shows its cover on its blog card and as its
 * social card once its front matter has `image: /images/blog/covers/<slug>.jpg`.
 *
 * To give a post a cover, add it to COVERS, run this and add that `image` line. The scene is `scripts/blog-cover.ts`.
 *
 * `node scripts/render-blog-covers.mjs [--only <slug>,<slug>] [--out <dir>] [--gpu]`
 *
 * Runs in Playwright's Chromium (`npx playwright install chromium`) on SwiftShader, or on the machine's GPU with
 * `--gpu`.
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { serve, STATIC_ROUTES, SWIFTSHADER_ARGS } from './browser.mts';

/**
 * A cover per post slug: `headline` is the short name under the logo, with the run between asterisks in pink;
 * `kicker` is the kind of post; `seed` deals the shapes, so change it until the scatter suits the headline.
 */
const COVERS = {
  'pixi-3d-open-beta': { headline: '*3D* Open Beta', kicker: 'Announcement', seed: 4 },
  'pixi-3d-101': { headline: '*3D* 101', kicker: 'Tutorial', seed: 11 },
};

const ROOT = path.resolve(import.meta.dirname, '..');
const SIZE = { width: 1200, height: 630 };
const OUT_WIDTH = 1600;

const { values } = parseArgs({
  options: {
    only: { type: 'string', default: Object.keys(COVERS).join(',') },
    out: { type: 'string', default: path.join(ROOT, 'static/images/blog/covers') },
    gpu: { type: 'boolean', default: false },
  },
});

fs.mkdirSync(values.out, { recursive: true });

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-covers-'));

await build({
  entryPoints: [path.join(ROOT, 'scripts/blog-cover.ts')],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: path.join(work, 'cover.js'),
  logLevel: 'error',
});
// The text keeps to the middle 800px, which every crop of the cover shows
fs.writeFileSync(
  path.join(work, 'index.html'),
  `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;font-weight:100 900;src:url(/fonts/outfit-latin-wght.woff2) format('woff2')}
@font-face{font-family:'Roboto Mono';font-weight:100 700;src:url(/fonts/roboto-mono-latin-wght.woff2) format('woff2')}
html,body{margin:0;background:#14131c}
#host{position:relative;width:${SIZE.width}px;height:${SIZE.height}px;overflow:hidden}
#host canvas{position:absolute;inset:0}
#headline,#kicker{position:absolute;left:0;right:0;text-align:center;white-space:nowrap}
#headline{top:356px;color:#fff;font:700 116px/1 Outfit;letter-spacing:-0.035em;word-spacing:0.06em}
#headline em{color:#f0306f;font-style:normal}
#kicker{top:510px;display:flex;justify-content:center;align-items:center;gap:14px;color:#aab4c6;
font:500 22px/1 'Roboto Mono';letter-spacing:0.18em;text-transform:uppercase}
#kicker::before{content:'';width:10px;height:10px;border-radius:50%;background:#e91e63}
</style><div id="host"><div id="headline"></div><div id="kicker"></div></div>
<script type="module" src="/cover.js"></script>`,
);

const { server, origin } = await serve([['/', work], ...STATIC_ROUTES]);
const browser = await chromium.launch({
  args: values.gpu ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : SWIFTSHADER_ARGS,
});

try {
  const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 2 });
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(origin);
  await page.waitForFunction(() => 'cover' in window);

  for (const slug of values.only.split(',')) {
    if (!COVERS[slug]) throw new Error(`No cover for "${slug}" in COVERS`);
    await page.evaluate((spec) => window.cover(spec), COVERS[slug]);

    const file = path.join(values.out, `${slug}.jpg`);

    await sharp(await page.locator('#host').screenshot())
      .resize(OUT_WIDTH)
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(file);
    console.log(`${path.relative(ROOT, file)} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally {
  await browser.close();
  server.close();
  fs.rmSync(work, { recursive: true, force: true });
}
