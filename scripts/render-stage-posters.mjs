/**
 * Renders the homepages' StageDemo images into `static/images/home/stage/`:
 *
 *   sprites.webp, sprites.json    the five sprites the scenes use (bunny, eggHead, flowerTop, helmlok, skully
 *                                 from pixi.js's MIT example assets), packed so a page makes one request
 *   <prefix>-<tab>-<theme>.webp   stills of every tab of every scene in `SCENES`, 1280×960, or 640×480 when
 *                                 that comes out too heavy. They show while the scene loads, without JS and
 *                                 without WebGL, and are transparent, so the card's own backdrop shows through.
 *                                 The `/3d` hero's logo is one more, at its own size
 *
 * `node scripts/render-stage-posters.mjs [--only atlas|posters] [--scenes tour2d,tour3d,heroLogo]
 *   [--tabs sprites,text] [--themes dark,light]`
 *
 * The posters come from the live scene modules, bundled with esbuild and run in Chromium on SwiftShader with motion
 * off, which is the still pose reduced-motion visitors see. Needs `.repos/pixijs` (`npm run sync:repos`) and
 * Playwright's Chromium (`npx playwright install chromium`).
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { serve, SWIFTSHADER_ARGS } from './browser.mts';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'static/images/home/stage');
const ASSETS = path.join(ROOT, '.repos/pixijs/examples/assets');
const FONTS = path.join(ROOT, 'static/fonts');
const SCENES_DIR = path.join(ROOT, 'src/components/Home/StageDemo/scenes');
/**
 * Every scene module with posters: its tab ids and the prefix of its files. A new scene is one more row. A module
 * outside `SCENES_DIR`, or one whose factory isn't `createScene`, names them; `size` is the host in CSS pixels.
 */
const SCENES = {
  tour2d: { prefix: 'tour2d', tabs: ['sprites', 'graphics', 'text', 'filters'] },
  tour3d: { prefix: 'tour3d', tabs: ['meshes', 'texture', 'billboards', 'picking'] },
  heroLogo: {
    prefix: 'hero',
    tabs: ['logo'],
    module: path.join(ROOT, 'src/components/Home/Hero/logo/createLogo.ts'),
    create: 'createLogo',
    size: { width: 442, height: 255 },
  },
};
const SPRITES = ['helmlok', 'skully', 'eggHead', 'flowerTop', 'bunny'];
/** The bunny is 26×37 pixel art: pack it upscaled with nearest-neighbour so it stays crisp when drawn larger */
const UPSCALE = { bunny: 3 };
/** A still over the byte budget at 2× is kept at 1×: 300 pixel-art sprites don't compress */
const POSTER = { width: 640, height: 480, scale: 2, quality: 0.86, budget: 120 * 1024 };

const { values } = parseArgs({
  options: {
    only: { type: 'string' },
    scenes: { type: 'string', default: Object.keys(SCENES).join(',') },
    tabs: { type: 'string' },
    themes: { type: 'string', default: 'dark,light' },
  },
});

const run = (step) => !values.only || values.only === step;

if (!run('atlas') && !run('posters')) process.exit(0);
if (!fs.existsSync(ASSETS)) {
  console.error(`${path.relative(ROOT, ASSETS)} is missing; run npm run sync:repos`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'stage-posters-'));
const { server, origin } = await serve([
  ['/assets/', ASSETS],
  ['/fonts/', FONTS],
  ['/images/home/stage/', OUT],
  ['/', work],
]);
const browser = await chromium.launch({ args: SWIFTSHADER_ARGS });

/** Packs the sprites into one row (they share a height band) and writes WebP plus a pixi spritesheet JSON */
async function renderAtlas() {
  const page = await browser.newPage();

  await page.goto(`${origin}/blank.html`);
  const { url, frames, size } = await page.evaluate(
    async ({ names, upscale }) => {
      const images = await Promise.all(
        names.map(
          (name) =>
            new Promise((resolve, reject) => {
              const img = new Image();

              img.onload = () => resolve({ name, img, k: upscale[name] ?? 1 });
              img.onerror = reject;
              img.src = `/assets/${name}.png`;
            }),
        ),
      );
      const pad = 2;
      const width = images.reduce((sum, { img, k }) => sum + img.width * k + pad, pad);
      const height = Math.max(...images.map(({ img, k }) => img.height * k)) + pad * 2;
      const canvas = Object.assign(document.createElement('canvas'), { width, height });
      const ctx = canvas.getContext('2d');
      const out = {};
      let x = pad;

      for (const { name, img, k } of images) {
        const w = img.width * k;
        const h = img.height * k;

        ctx.imageSmoothingEnabled = k === 1;
        ctx.drawImage(img, x, pad, w, h);
        out[name] = {
          frame: { x, y: pad, w, h },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w, h },
          sourceSize: { w, h },
        };
        x += w + pad;
      }

      return { url: canvas.toDataURL('image/webp', 0.9), frames: out, size: { w: width, h: height } };
    },
    { names: SPRITES, upscale: UPSCALE },
  );

  fs.writeFileSync(path.join(OUT, 'sprites.webp'), Buffer.from(url.split(',')[1], 'base64'));
  fs.writeFileSync(
    path.join(OUT, 'sprites.json'),
    `${JSON.stringify({ frames, meta: { image: 'sprites.webp', format: 'RGBA8888', size, scale: 1 } })}\n`,
  );
  console.log(`sprites.webp ${size.w}×${size.h}, ${fs.statSync(path.join(OUT, 'sprites.webp')).size} bytes`);
  await page.close();
}

/** Captures every requested tab of one scene, in each theme */
async function renderPosters(name) {
  const {
    prefix,
    tabs,
    module = path.join(SCENES_DIR, `${name}.ts`),
    create = 'createScene',
    size = POSTER,
  } = SCENES[name];
  const wanted = values.tabs ? tabs.filter((tab) => values.tabs.split(',').includes(tab)) : tabs;

  if (!wanted.length) return;
  await build({
    stdin: {
      contents: `import { ${create} as createScene } from ${JSON.stringify(module)};
window.pose = async (theme, tab) => {
  const host = document.getElementById('host');
  host.replaceChildren();
  window.scene?.destroy();
  window.scene = await createScene(host, { theme, tab, motion: false, hud: false });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};`,
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    target: 'es2022',
    outfile: path.join(work, 'poster.js'),
    logLevel: 'error',
  });
  fs.writeFileSync(
    path.join(work, 'index.html'),
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}` +
      `@font-face{font-family:Outfit;font-weight:100 900;src:url(/fonts/outfit-latin-wght.woff2) format("woff2")}` +
      `#host{width:${size.width}px;height:${size.height}px}</style><div id="host"></div>` +
      `<script type="module" src="/poster.js"></script>`,
  );
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: POSTER.scale,
  });
  const page = await context.newPage();
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(origin);
  await page.waitForFunction(() => 'pose' in window);

  for (const theme of values.themes.split(',')) {
    for (const tab of wanted) {
      await page.evaluate(([t, id]) => window.pose(t, id), [theme, tab]);
      let webp;

      for (const scale of ['device', 'css']) {
        const png = await page.locator('#host').screenshot({ omitBackground: true, scale });
        const url = await page.evaluate(
          async ([data, quality]) => {
            const img = new Image();

            img.src = `data:image/png;base64,${data}`;
            await img.decode();
            const canvas = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });

            canvas.getContext('2d').drawImage(img, 0, 0);

            return canvas.toDataURL('image/webp', quality);
          },
          [png.toString('base64'), POSTER.quality],
        );

        webp = Buffer.from(url.split(',')[1], 'base64');
        if (webp.length <= POSTER.budget) break;
      }
      const file = path.join(OUT, `${prefix}-${tab}-${theme}.webp`);

      fs.writeFileSync(file, webp);
      console.log(`${path.basename(file)} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
    }
  }
  await context.close();
  if (errors.length) throw new Error(`${name} errors:\n${errors.join('\n')}`);
}

try {
  fs.writeFileSync(path.join(work, 'blank.html'), '<!doctype html><meta charset="utf-8">');
  if (run('atlas')) await renderAtlas();
  if (run('posters')) {
    for (const name of values.scenes.split(',')) {
      if (!SCENES[name]) throw new Error(`Unknown scene "${name}"; known: ${Object.keys(SCENES).join(', ')}`);
      await renderPosters(name);
    }
  }
} finally {
  await browser.close();
  server.close();
  fs.rmSync(work, { recursive: true, force: true });
}
