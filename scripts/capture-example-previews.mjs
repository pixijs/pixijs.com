/**
 * Captures gallery preview images for examples without the playground UI.
 *
 * For each example name this bundles its source (the library's `examples.source` in scripts/libraries.mts)
 * with esbuild, against the site's installed packages, and renders it in a bare harness page (no editor
 * chrome) using headless Chrome, then writes into the library's `examples.previews` folder:
 *   <name>.webp            320x180 animated webp
 *   <name>_thumbnail.webp  600x338 static webp
 *
 * Usage:
 *   node ./scripts/capture-example-previews.mjs <example-name> [...more names]
 *   node ./scripts/capture-example-previews.mjs mesh_rope-width --duration 5
 *   node ./scripts/capture-example-previews.mjs --pkg 3d models_viewer --settle 15   wait 15 s before recording,
 *                                                             for examples that download a large model first
 *   node ./scripts/capture-example-previews.mjs --missing     every gallery example without a preview
 *   node ./scripts/capture-example-previews.mjs --dry-run     bundle every gallery example, list what
 *                                                             would be captured, and capture nothing
 *   node ./scripts/capture-example-previews.mjs --pkg 3d --missing   the same for @pixi/3d's examples
 *
 * Requests for https://pixijs.com/assets/ are answered from the site's static folders, so examples
 * capture with the synced assets, including ones the live site doesn't serve yet.
 *
 * Requirements: Google Chrome installed (or CHROME_BIN set; CHROME_ARGS adds flags), and the webp
 * tools `img2webp` + `cwebp` on PATH (brew install webp).
 * Run `npm run generate:examples` (or `generate:pixi-3d`) first so the example sources are current.
 */
import { spawn } from 'child_process';
import { build } from 'esbuild';
import * as fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';

import { contentType, routeFile, serve, STATIC_ROUTES } from './browser.mts';
import { getLibrary } from './libraries.mts';

const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const library = getLibrary(flag('--pkg'));

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE_DIR = path.join(ROOT, library.examples.source);
const PREVIEWS_DIR = path.join(ROOT, library.examples.previews);
const EXAMPLES_FILE = path.join(ROOT, library.examples.data);
const SITE_ASSETS = 'https://pixijs.com/assets/';
const VIEWPORT = { width: 1280, height: 720 };
const ANIM_SIZE = '320:180';
const ANIM_FRAMES = 32;
const THUMB_WIDTH = 600;

const CHROME_BIN = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_ARGS = process.env.CHROME_ARGS?.split(/\s+/).filter(Boolean) ?? [];

function harnessHtml(name) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
@font-face { font-family: 'Sono'; src: url('/assets/standard/sono.ttf'); }
html, body { margin: 0; height: 100%; overflow: hidden; }
</style>
</head>
<body>
<script type="module">
  await document.fonts.load("600 18px Sono").catch(() => {});
  await import('/bundles/${name}.js');
  // The example boots asynchronously; wait for its canvas, then let it draw a while
  await new Promise((resolve) => {
    const poll = () => (document.querySelector('canvas') ? resolve() : setTimeout(poll, 50));
    poll();
  });
  window.__exampleReady = true;
</script>
</body>
</html>`;
}

/** Bundles an example's entry with the site's own packages, so the capture uses the installed pixi.js */
async function bundle(example) {
  const entry = example.files.find((file) => file.name === 'index.js');

  try {
    const result = await build({
      entryPoints: [path.join(SOURCE_DIR, entry.location)],
      bundle: true,
      format: 'esm',
      write: false,
      logLevel: 'silent',
      loader: { '.frag': 'text', '.vert': 'text', '.wgsl': 'text' },
      // @pixi/3d needs the same pixi.js fallback the site's bundles import
      inject: library.id === '3d' ? [path.join(ROOT, 'src/utils/pixi3dCompat.ts')] : [],
    });

    return result.outputFiles[0].text;
  } catch (error) {
    throw new Error(error.errors?.map((message) => message.text).join('; ') ?? error.message);
  }
}

/** Serves the harness pages, the bundles and the site's static folders */
function startServer(bundles) {
  return serve(STATIC_ROUTES, (pathname) => {
    const harness = /^\/harness\/(.+)\.html$/.exec(pathname)?.[1];
    const bundle = bundles.get(/^\/bundles\/(.+)\.js$/.exec(pathname)?.[1]);

    if (harness) return ['text/html', harnessHtml(harness)];

    return bundle ? ['text/javascript', bundle] : undefined;
  });
}

async function launchChrome(userDataDir) {
  const proc = spawn(CHROME_BIN, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    ...CHROME_ARGS,
    'about:blank',
  ]);

  const portFile = path.join(userDataDir, 'DevToolsActivePort');

  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const contents = await fs.readFile(portFile, 'utf-8');
      const port = parseInt(contents.split('\n')[0], 10);

      if (port > 0) return { proc, port };
    } catch {
      // not written yet
    }
    await sleep(100);
  }

  throw new Error('Chrome did not expose a DevTools port');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpPage {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);

        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method && this.listeners.has(message.method)) {
        this.listeners.get(message.method)(message.params);
      }
    });
  }

  static async connect(wsUrl) {
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error(`Failed to connect to ${wsUrl}`)), { once: true });
    });

    return new CdpPage(ws);
  }

  send(method, params = {}) {
    const id = this.nextId++;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    this.listeners.set(method, handler);
  }

  async waitForReady(timeoutMs = 30_000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const { result } = await this.send('Runtime.evaluate', { expression: 'window.__exampleReady === true' });

      if (result.value === true) return;
      await sleep(150);
    }

    throw new Error('Example did not become ready (no canvas rendered?)');
  }
}

/**
 * Answers a paused `https://pixijs.com/assets/` request from the static folders, or lets it through to the
 * network when no folder has the file
 */
async function fulfillSiteAsset(page, { requestId, request }) {
  const file = routeFile(STATIC_ROUTES, decodeURIComponent(new URL(request.url).pathname));

  if (!file) {
    await page.send('Fetch.continueRequest', { requestId });

    return;
  }

  await page.send('Fetch.fulfillRequest', {
    requestId,
    responseCode: 200,
    responseHeaders: [
      { name: 'content-type', value: contentType(file) },
      { name: 'access-control-allow-origin', value: '*' },
    ],
    body: (await fs.readFile(file)).toString('base64'),
  });
}

async function captureExample(name, origin, chromePort, durationSec, settleSec) {
  const url = `${origin}/harness/${name}.html`;
  const created = await fetch(`http://127.0.0.1:${chromePort}/json/new?about:blank`, {
    method: 'PUT',
  }).then((response) => response.json());

  const page = await CdpPage.connect(created.webSocketDebuggerUrl);

  try {
    await page.send('Runtime.enable');
    await page.send('Page.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 1, mobile: false });
    page.on('Fetch.requestPaused', (params) =>
      fulfillSiteAsset(page, params).catch((error) => console.log(`${params.request.url}: ${error.message}`)),
    );
    await page.send('Fetch.enable', { patterns: [{ urlPattern: `${SITE_ASSETS}*` }] });
    await page.send('Page.navigate', { url });
    await page.waitForReady();
    await sleep(settleSec * 1000);

    const frames = [];

    page.on('Page.screencastFrame', (frame) => {
      frames.push(frame);
      page.send('Page.screencastFrameAck', { sessionId: frame.sessionId });
    });

    await page.send('Page.startScreencast', {
      format: 'jpeg',
      quality: 90,
      maxWidth: VIEWPORT.width,
      maxHeight: VIEWPORT.height,
    });
    await sleep(durationSec * 1000);
    await page.send('Page.stopScreencast');

    if (frames.length < ANIM_FRAMES / 2) {
      throw new Error(`Only captured ${frames.length} frames — is the example animating?`);
    }

    const thumb = await page.send('Page.captureScreenshot', { format: 'png' });

    return { frames, thumb };
  } finally {
    page.ws.close();
    await fetch(`http://127.0.0.1:${chromePort}/json/close/${created.id}`).catch(() => {});
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);
    let stderr = '';

    proc.stderr.on('data', (data) => (stderr += data));
    proc.on('error', () => reject(new Error(`${command} not found — install the webp tools (brew install webp)`)));
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${command} failed: ${stderr}`))));
  });
}

async function writeOutputs(name, { frames, thumb }, durationSec, tmpDir) {
  const frameDir = path.join(tmpDir, name);

  await fs.mkdir(frameDir, { recursive: true });

  // Sample evenly across everything the screencast delivered
  const picks = Array.from(
    { length: ANIM_FRAMES },
    (_, index) => frames[Math.floor((index * frames.length) / ANIM_FRAMES)],
  );

  const [animWidth, animHeight] = ANIM_SIZE.split(':');
  const framePaths = await Promise.all(
    picks.map(async (frame, index) => {
      const jpgPath = path.join(frameDir, `frame_${String(index).padStart(3, '0')}.jpg`);
      const webpPath = jpgPath.replace(/\.jpg$/, '.webp');

      await fs.writeFile(jpgPath, Buffer.from(frame.data, 'base64'));
      await run('cwebp', ['-quiet', '-lossless', '-resize', animWidth, animHeight, jpgPath, '-o', webpPath]);

      return webpPath;
    }),
  );

  const frameDelayMs = Math.round((durationSec * 1000) / ANIM_FRAMES);

  // img2webp is lossless unless told otherwise, which makes shaded 3D scenes megabytes
  await run('img2webp', [
    '-loop',
    '0',
    '-d',
    String(frameDelayMs),
    '-lossy',
    '-q',
    '70',
    '-m',
    '6',
    ...framePaths,
    '-o',
    path.join(PREVIEWS_DIR, `${name}.webp`),
  ]);

  const thumbPng = path.join(frameDir, 'thumb.png');

  await fs.writeFile(thumbPng, Buffer.from(thumb.data, 'base64'));
  await run('cwebp', [
    '-quiet',
    '-resize',
    String(THUMB_WIDTH),
    '0',
    '-q',
    '80',
    thumbPng,
    '-o',
    path.join(PREVIEWS_DIR, `${name}_thumbnail.webp`),
  ]);
}

const durationSec = parseFloat(flag('--duration') ?? '4.5');
const settleSec = parseFloat(flag('--settle') ?? '1.8');
const dryRun = args.includes('--dry-run');
const missing = args.includes('--missing');

if (!existsSync(EXAMPLES_FILE)) {
  console.error(`No ${library.examples.data}: generate the ${library.id} examples first`);
  process.exit(1);
}

const examples = new Map(JSON.parse(readFileSync(EXAMPLES_FILE, 'utf-8')).map((example) => [example.name, example]));
const gallery = [...examples.values()].filter((example) => !example.hidden).map((example) => example.name);
const hasPreview = (name) =>
  ['', '_thumbnail'].every((suffix) => existsSync(path.join(PREVIEWS_DIR, `${name}${suffix}.webp`)));
const names = [
  ...new Set([
    ...args.filter(
      (arg, index) => !arg.startsWith('--') && !['--duration', '--settle', '--pkg'].includes(args[index - 1]),
    ),
    ...(missing ? gallery.filter((name) => !hasPreview(name)) : []),
  ]),
];
const unknown = names.filter((name) => !examples.has(name));

if (unknown.length) {
  console.error(`Not in ${library.examples.data}: ${unknown.join(', ')}`);
  process.exit(1);
}

if (names.length === 0 && !dryRun) {
  console.log(
    missing
      ? 'Every gallery example has a preview'
      : 'Usage: node ./scripts/capture-example-previews.mjs <example-name> [...more] [--pkg 2d|3d] [--missing] [--dry-run] [--duration seconds] [--settle seconds]',
  );
  process.exit(missing ? 0 : 1);
}

const bundles = new Map();
let failed = false;

for (const name of dryRun ? [...new Set([...gallery, ...names])] : names) {
  try {
    bundles.set(name, await bundle(examples.get(name)));
  } catch (error) {
    failed = true;
    console.log(`FAILED to bundle ${name}: ${error.message}`);
  }
}

if (dryRun) {
  console.log(`Bundled ${bundles.size} examples; would capture: ${names.join(', ') || 'nothing'}`);
  process.exit(failed ? 1 : 0);
}

await fs.mkdir(PREVIEWS_DIR, { recursive: true });
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'example-previews-'));
const { server, origin } = await startServer(bundles);
const chrome = await launchChrome(path.join(tmpDir, 'chrome-profile'));

try {
  for (const name of bundles.keys()) {
    process.stdout.write(`Capturing ${name}... `);
    try {
      const capture = await captureExample(name, origin, chrome.port, durationSec, settleSec);

      await writeOutputs(name, capture, durationSec, tmpDir);
      console.log(`done (${capture.frames.length} frames)`);
    } catch (error) {
      failed = true;
      console.log(`FAILED: ${error.message}`);
    }
  }
} finally {
  const chromeExited = new Promise((resolve) => chrome.proc.on('exit', resolve));

  chrome.proc.kill();
  await chromeExited;
  server.close();
  await fs.rm(tmpDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

process.exit(failed ? 1 : 0);
