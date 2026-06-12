/**
 * Captures gallery preview images for examples without the playground UI.
 *
 * For each example name this renders the compiled file from static/examples/source
 * in a bare harness page (no editor chrome) using headless Chrome, then writes:
 *   static/examples/previews/<name>.webp            320x180 animated webp
 *   static/examples/previews/<name>_thumbnail.webp  600x338 static webp
 *
 * Usage:
 *   node ./scripts/capture-example-previews.mjs <example-name> [...more names]
 *   node ./scripts/capture-example-previews.mjs mesh_rope-width --duration 5
 *
 * Requirements: Google Chrome installed (or CHROME_BIN set), and the webp
 * tools `img2webp` + `cwebp` on PATH (brew install webp).
 * Run `npm run generate:examples` first so static/examples/source is current.
 */
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import { createServer } from 'http';
import os from 'os';
import path from 'path';

const STATIC_DIR = path.resolve(import.meta.dirname, '../static');
const PREVIEWS_DIR = path.join(STATIC_DIR, 'examples/previews');
const VIEWPORT = { width: 1280, height: 720 };
const ANIM_SIZE = '320:180';
const ANIM_FRAMES = 32;
const THUMB_WIDTH = 600;
const SETTLE_MS = 1800;

const CHROME_BIN = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
};

function harnessHtml(name) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script type="importmap">
{
  "imports": {
    "pixi.js": "https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.mjs",
    "gsap": "https://cdn.jsdelivr.net/npm/gsap@3/+esm",
    "pixi-filters": "https://cdn.jsdelivr.net/npm/pixi-filters@6/dist/pixi-filters.mjs"
  }
}
</script>
<style>
@font-face { font-family: 'Sono'; src: url('/assets/standard/sono.ttf'); }
html, body { margin: 0; height: 100%; overflow: hidden; }
</style>
</head>
<body>
<script type="module">
  await document.fonts.load("600 18px Sono").catch(() => {});
  await import('/examples/source/${name}/index.js');
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

function startServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const harnessMatch = url.pathname.match(/^\/harness\/(.+)\.html$/);

    if (harnessMatch) {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(harnessHtml(harnessMatch[1]));
      return;
    }

    const filePath = path.join(STATIC_DIR, decodeURIComponent(url.pathname));

    if (!filePath.startsWith(STATIC_DIR)) {
      res.writeHead(403).end();
      return;
    }

    // Compiled examples use extensionless relative imports (sandpack-style);
    // resolve them the way a bundler would
    const candidates = path.extname(filePath) ? [filePath] : [filePath, `${filePath}.js`];

    for (const candidate of candidates) {
      try {
        const data = await fs.readFile(candidate);

        res.writeHead(200, { 'content-type': MIME[path.extname(candidate)] ?? 'application/octet-stream' });
        res.end(data);

        return;
      } catch {
        // try next candidate
      }
    }

    res.writeHead(404).end();
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
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

async function captureExample(name, serverPort, chromePort, durationSec) {
  const sourcePath = path.join(STATIC_DIR, 'examples/source', name, 'index.js');

  await fs.access(sourcePath).catch(() => {
    throw new Error(`No compiled source at ${sourcePath} — run \`npm run generate:examples\` first`);
  });

  const url = `http://127.0.0.1:${serverPort}/harness/${name}.html`;
  const created = await fetch(`http://127.0.0.1:${chromePort}/json/new?${url}`, {
    method: 'PUT',
  }).then((response) => response.json());

  const page = await CdpPage.connect(created.webSocketDebuggerUrl);

  try {
    await page.send('Runtime.enable');
    await page.send('Page.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 1, mobile: false });
    await page.waitForReady();
    await sleep(SETTLE_MS);

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
      await run('cwebp', ['-quiet', '-resize', animWidth, animHeight, '-q', '70', jpgPath, '-o', webpPath]);

      return webpPath;
    }),
  );

  const frameDelayMs = Math.round((durationSec * 1000) / ANIM_FRAMES);

  await run('img2webp', [
    '-loop',
    '0',
    '-d',
    String(frameDelayMs),
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

const args = process.argv.slice(2);
const durationFlag = args.indexOf('--duration');
const durationSec = durationFlag === -1 ? 4.5 : parseFloat(args[durationFlag + 1]);
const names = args.filter((arg, index) => !arg.startsWith('--') && index !== durationFlag + 1);

if (names.length === 0) {
  console.error('Usage: node ./scripts/capture-example-previews.mjs <example-name> [...more] [--duration seconds]');
  process.exit(1);
}

const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'example-previews-'));
const { server, port } = await startServer();
const chrome = await launchChrome(path.join(tmpDir, 'chrome-profile'));

let failed = false;

try {
  for (const name of names) {
    process.stdout.write(`Capturing ${name}... `);
    try {
      const capture = await captureExample(name, port, chrome.port, durationSec);

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
