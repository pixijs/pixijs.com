/**
 * Runs examples through the editor's import-map runtime (`src/runtime`) in a real browser and checks that each one
 * draws: `node scripts/verify/examples.mjs [options]`. Run `node scripts/runtime.mts` first.
 *
 * esbuild bundles a host page around `useRunner`, and a local server stands in for the site's static folders; off
 * pixijs.com the runner points `https://pixijs.com/assets/` at the page's own origin, so assets come from them too. An
 * example passes when its frame reports no uncaught error and shows at least two colours; the pointer is swept across
 * the frame before giving up, for examples that only draw while it moves. An example that hangs or crashes its frame
 * fails alone, and the sweep goes on in a fresh browser context. Failures listed in `KNOWN` are reported but don't fail
 * it.
 *
 * Sets:
 *   2d      every example in src/data/generated/examples.json
 *   v7      every 7.x example in versioned_docs/version-7.x/examples, with the pixi.js 7 import map
 *   3d      every example in src/data/generated/examples-3d.json, plus a lit cube and an orbit scene
 *   scenes  runtime features: 3D, multi-file TypeScript with shaders, add-ons, Spine, top-level await, error
 *           locations and a double-buffered rerun; the set that also has to pass in WebKit and Firefox
 *
 * Options:
 *   --pkg <set>          Set to run, repeatable; default all in Chromium, `scenes` in the other browsers
 *   --browser <name>     chromium (default), webkit or firefox
 *   --only <names>       Comma-separated example names
 *   --cold <n>           Then time each selected example n times in a fresh browser context, from navigation
 *   --port <n>           Port for the local server; default any free port
 *   --playwright <path>  Playwright module to load browsers from; default `playwright`
 *   --out <file>         Also write the results as JSON
 *   --shots <dir>        Save a screenshot of each example's frame as <dir>/<set>/<name>.png
 *   --gpu                Draw on the machine's GPU (ANGLE Metal) instead of SwiftShader, for scenes too heavy for it
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { serve, STATIC_ROUTES, SWIFTSHADER_ARGS } from '../browser.mts';
import { LIBRARIES } from '../libraries.mts';

const ROOT = process.cwd();
/** `CanvasDrawElement` is the HTML-in-Canvas API that `pixi.js/html-source` needs; it's behind this flag */
const CHROMIUM_ARGS = ['--enable-blink-features=CanvasDrawElement'];
const GPU_ARGS = ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const settle = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));

const CUBE = {
  name: '3d-cube',
  files: {
    'index.js': `import { Application } from 'pixi.js';
import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, View3D } from '@pixi/3d';

(async () => {
  const app = new Application();

  await app.init({ background: '#1a1a2e', resizeTo: window, preference: 'webgl' });
  document.body.appendChild(app.canvas);

  const view3d = new View3D({ autoResize: true });
  const sun = new DirectionalLight({ intensity: 3 });
  const cube = new Mesh3D({
    geometry: new CubeGeometry(),
    material: new Material3D({ baseColor: 0xe91e63, roughness: 0.4 }),
  });

  app.stage.addChild(view3d);
  sun.rotation.set(-Math.PI / 4, Math.PI / 6, 0);
  view3d.root.addChild(sun, cube);
  view3d.camera.position.set(0, 0, 3);
  app.ticker.add(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.013;
  });
})();
`,
  },
};

const ORBIT = {
  name: '3d-orbit',
  files: {
    'index.js': `import { Application } from 'pixi.js';
import { CubeGeometry, DirectionalLight, Material3D, Mesh3D, PlaneGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';

(async () => {
  const app = new Application();

  await app.init({ background: '#1a1a2e', resizeTo: window });
  document.body.appendChild(app.canvas);

  const view3d = new View3D({ autoResize: true });
  const sun = new DirectionalLight({ intensity: 4, castShadow: true });
  const ground = new Mesh3D({
    geometry: new PlaneGeometry({ width: 6, height: 6 }),
    material: new Material3D({ baseColor: 0x8a8aa0, roughness: 0.9 }),
  });
  const cube = new Mesh3D({
    geometry: new CubeGeometry(),
    material: new Material3D({ baseColor: 0xe91e63, roughness: 0.35 }),
  });

  app.stage.addChild(view3d);
  sun.rotation.set(-0.8, 0.5, 0);
  ground.rotation.x = -Math.PI / 2;
  cube.position.y = 0.6;
  view3d.root.addChild(sun, ground, cube);
  view3d.camera.position.set(3, 2.5, 4);
  new OrbitCamera({ view: view3d, target: { x: 0, y: 0.5, z: 0 }, enableDamping: true });
  app.ticker.add(() => (cube.rotation.y += 0.01));
})();
`,
  },
};

const MULTI = {
  name: 'multi',
  entry: 'src/index.ts',
  files: {
    'src/index.ts': `import { Application } from 'pixi.js';
import { BACKGROUND } from '../config.js';
import { createScene } from './scene';

(async () => {
  const app = new Application();

  await app.init({ background: BACKGROUND, resizeTo: window, preference: 'webgl' });
  document.body.appendChild(app.canvas);

  const scene = createScene(app.screen.width, app.screen.height);

  app.stage.addChild(scene.view);
  app.ticker.add((ticker) => scene.update(ticker.deltaTime));
})();
`,
    'src/scene.ts': `import { Container, Filter, GlProgram, Graphics } from 'pixi.js';
import { fragment, vertex } from './shaders';

interface Scene {
  view: Container;
  update(delta: number): void;
}

export function createScene(width: number, height: number): Scene {
  const view = new Container();
  const filter = new Filter({
    glProgram: new GlProgram({ fragment, vertex }),
    resources: { waveUniforms: { uTime: { value: 0, type: 'f32' } } },
  });

  view.addChild(new Graphics().circle(width / 2, height / 2, Math.min(width, height) / 3).fill(0xe91e63));
  view.filters = [filter];

  return {
    view,
    update: (delta: number) => {
      filter.resources.waveUniforms.uniforms.uTime += 0.04 * delta;
    },
  };
}
`,
    'src/shaders/index.ts': `export { default as fragment } from './wave.frag';
export { default as vertex } from './wave.vert';
`,
    'src/shaders/wave.frag': `in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uTime;

void main(void)
{
    vec4 color = texture2D(uTexture, vTextureCoord);

    gl_FragColor = vec4(color.rgb * (0.6 + 0.4 * sin(uTime + vTextureCoord.x * 12.0)), color.a);
}
`,
    'src/shaders/wave.vert': `in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

void main(void)
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
    gl_Position = vec4(position, 0.0, 1.0);
    vTextureCoord = aPosition * (uOutputFrame.zw * uInputSize.zw);
}
`,
    'config.js': `export const BACKGROUND = '#1a1a2e';
`,
  },
};

const LIBS = {
  name: 'libs',
  files: {
    'index.js': `import * as PIXI from 'pixi.js';
import { Application, Graphics } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

(async () => {
  const app = new Application();

  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);

  const box = new Graphics().roundRect(-60, -60, 120, 120, 16).fill(0xffffff);

  box.position.set(app.screen.width / 2, app.screen.height / 2);
  box.filters = [new DropShadowFilter({ offset: { x: 8, y: 8 } })];
  app.stage.addChild(box);
  gsap.to(box, { pixi: { rotation: 360 }, duration: 4, repeat: -1, ease: 'none' });
})();
`,
  },
};

const TLA = {
  name: 'tla',
  files: {
    'index.js': `import { Application, Graphics } from 'pixi.js';

const app = new Application();

await app.init({ background: '#222', resizeTo: window });
document.body.appendChild(app.canvas);
app.stage.addChild(new Graphics().circle(400, 250, 120).fill(0xe91e63));
`,
  },
};

const ERROR = {
  name: 'error',
  expectError: { file: 'index.js', line: 8, message: /missingThing/ },
  files: {
    'index.js': `import { Application } from 'pixi.js';

(async () => {
  const app = new Application();

  await app.init({ background: '#222', resizeTo: window });
  document.body.appendChild(app.canvas);
  app.stage.addChild(missingThing);
})();
`,
  },
};

/** Runs, then reruns with an edit: the edit must load into the other frame, swap in, and clear the old frame */
const RERUN = {
  ...TLA,
  name: 'rerun',
  rerun: { 'index.js': TLA.files['index.js'].replace('0xe91e63', '0x12b886') },
};

/** The Spine tutorial's final step, unmodified */
function spine() {
  const dir = 'src/tutorials/v8.0.0/spineBoyAdventure';

  return {
    name: 'spine',
    entry: 'src/index.js',
    dependencies: { '@esotericsoftware/spine-pixi-v8': '~4.3.7' },
    files: {
      'src/index.js': read(`${dir}/step7/step7-code.js`),
      'src/SpineBoy.js': read(`${dir}/step4/SpineBoy2-completed.js`),
      'src/Controller.js': read(`${dir}/step3/Controller-completed.js`),
      'src/Scene.js': read(`${dir}/step6/Scene2-completed.js`),
    },
  };
}

/** A library's gallery examples, from its generated examples file, with their sources from the published folder */
function generatedExamples({ examples: { data, source } }) {
  if (!fs.existsSync(path.join(ROOT, data))) return [];

  return JSON.parse(read(data)).map((item) => ({
    name: item.name,
    dependencies: item.dependencies,
    files: Object.fromEntries(item.files.map((file) => [file.name, read(`${source}/${file.location}`)])),
  }));
}

function v7Examples() {
  const dir = 'versioned_docs/version-7.x/examples';

  return fs
    .readdirSync(path.join(ROOT, dir), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map((file) => ({
      name: `v7/${file.replace(/\.js$/, '')}`,
      major: 7,
      files: { 'index.js': read(`${dir}/${file}`) },
    }));
}

/**
 * Examples that fail here for a reason outside the runtime, with the reason. They're reported as known instead of
 * failing the sweep, and one that passes again is flagged so its entry can go.
 */
const KNOWN = {
  performance_galaxy: "SwiftShader can't draw 150,000 stars fast enough to screenshot them; it passes with --gpu",
};
/** Known failures that only SwiftShader has: with `--gpu` these examples have to pass */
const SWIFTSHADER_ONLY = new Set(['performance_galaxy']);

const SETS = {
  '2d': () => generatedExamples(LIBRARIES['2d']),
  v7: v7Examples,
  '3d': () => [...generatedExamples(LIBRARIES['3d']), CUBE, ORBIT],
  scenes: () => [CUBE, ORBIT, MULTI, LIBS, spine(), TLA, ERROR, RERUN],
};

const HOST_PAGE = `<!doctype html>
<meta charset="utf-8">
<title>Runner sweep</title>
<style>
  body { margin: 0; background: #fff; }
  #root { position: relative; width: 800px; height: 500px; }
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  iframe[data-active='true'] { z-index: 1; }
</style>
<div id="root"></div>
<script type="module" src="/host.js"></script>
`;

const HOST_SCRIPT = `
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { FRAME_ALLOW, FRAME_SANDBOX } from './src/runtime/frame';
import { useRunner } from './src/runtime/useRunner';

function Host({ scene }) {
  const runner = useRunner(scene);

  useEffect(() => {
    Object.assign(window.result, { status: runner.status, error: runner.error, logs: runner.logs, active: runner.active });
    if (runner.status === 'ready') window.result.readyAt ??= performance.now();
  });

  return runner.frames.map((ref, index) => (
    <iframe key={index} ref={ref} sandbox={FRAME_SANDBOX} allow={FRAME_ALLOW} data-active={runner.active === index} />
  ));
}

let root;

window.runScene = (scene) => {
  window.result = { status: 'idle', logs: [], startedAt: performance.now() };
  root ??= createRoot(document.getElementById('root'));
  root.render(<Host scene={scene} />);
};
`;

const newContext = (browser) => browser.newContext({ viewport: { width: 1000, height: 700 } });

/** Distinct colours (4 bits a channel) in a screenshot of the visible frame, counted in the host page */
async function colours(page, shot) {
  const png = await page.locator("iframe[data-active='true']").screenshot({ path: shot, timeout: 15000 });

  return page.evaluate(async (base64) => {
    const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob());
    const canvas = document.createElement('canvas');

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');

    context.drawImage(bitmap, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const seen = new Set();

    for (let i = 0; i < data.length; i += 16)
      seen.add(((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4));

    return seen.size;
  }, png.toString('base64'));
}

async function waitForColours(page, ms) {
  const end = Date.now() + ms;
  let count = await colours(page);

  while (count < 2 && Date.now() < end) {
    await page.waitForTimeout(250);
    count = await colours(page);
  }

  return count;
}

async function sweepPointer(page) {
  const box = await page.locator("iframe[data-active='true']").boundingBox();

  for (let i = 0; i <= 40; i++) {
    await page.mouse.move(
      box.x + box.width * (0.1 + (0.8 * i) / 40),
      box.y + box.height * (0.5 + 0.3 * Math.sin(i / 4)),
    );
    await page.waitForTimeout(16);
  }
}

const options = (scene) => ({
  files: scene.files,
  entry: scene.entry ?? 'index.js',
  major: scene.major ?? 8,
  dependencies: scene.dependencies ?? {},
});

async function start(page, origin, scene) {
  await page.goto(`${origin}/`, { waitUntil: 'commit' });
  await page.waitForFunction(() => window.runScene);
  await page.evaluate((runnerOptions) => window.runScene(runnerOptions), options(scene));
  await page
    .waitForFunction(() => ['ready', 'error', 'unsupported'].includes(window.result.status), null, { timeout: 30000 })
    .catch(() => {});
}

function verdict(scene, result, count, swapped) {
  const { error } = result;

  if (scene.expectError) {
    const { file, line, message } = scene.expectError;
    const ok = error?.file === file && error?.line === line && message.test(error.message);

    return ok ? null : `expected an error at ${file}:${line}, got ${JSON.stringify(error)}`;
  }
  if (error) return `${error.message} (${error.file}:${error.line})`;
  if (result.status !== 'ready') return `status ${result.status}`;
  if (scene.rerun && !swapped) return "the rerun didn't swap frames and clear the old one";

  return count < 2 ? 'drew nothing' : null;
}

/**
 * Reruns the scene with its edited files
 * @returns Whether the edit swapped into the other frame and cleared the old one, and how long it took with the
 * runner's debounce
 */
async function rerun(page, scene) {
  const before = await page.evaluate(() => window.result.active);
  const started = Date.now();

  await page.evaluate((runnerOptions) => window.runScene(runnerOptions), options({ ...scene, files: scene.rerun }));
  await page
    .waitForFunction((old) => window.result.status === 'ready' && window.result.active !== old, before, {
      timeout: 15000,
    })
    .catch(() => {});

  const ms = Date.now() - started;
  // The old frame stays under the new one while it fades in, then empties
  const swapped = await page
    .waitForFunction(
      (old) => window.result.active !== old && !document.querySelectorAll('iframe')[old].srcdoc,
      before,
      { timeout: 2000 },
    )
    .then(
      () => true,
      () => false,
    );

  return { swapped, ms };
}

async function check(page, origin, scene, shot) {
  await start(page, origin, scene);
  let count = scene.expectError ? 0 : await waitForColours(page, 6000);

  if (count < 2 && !scene.expectError) {
    await sweepPointer(page);
    count = await waitForColours(page, 2000);
  }
  const { readyAt, startedAt } = await page.evaluate(() => window.result);
  const second = scene.rerun ? await rerun(page, scene) : null;

  await page.waitForTimeout(500);
  if (shot) fs.mkdirSync(path.dirname(shot), { recursive: true });
  const final = await colours(page, shot);
  const result = await page.evaluate(() => window.result);
  const failure = verdict(scene, result, Math.max(count, final), second?.swapped);

  return {
    name: scene.name,
    ok: !failure,
    failure,
    readyMs: readyAt ? Math.round(readyAt - startedAt) : null,
    rerunMs: second?.ms,
    colours: final,
    warnings: result.logs.filter((log) => log.level === 'error').map((log) => log.args.join(' ').slice(0, 200)),
  };
}

async function coldTimes(browser, origin, scene, runs) {
  const times = [];

  for (let i = 0; i < runs; i++) {
    const context = await newContext(browser);
    const page = await context.newPage();

    await start(page, origin, scene);
    times.push(Math.round(await page.evaluate(() => window.result.readyAt ?? NaN)));
    await context.close();
  }

  return times;
}

async function main() {
  const { values } = parseArgs({
    options: {
      pkg: { type: 'string', multiple: true },
      browser: { type: 'string', default: 'chromium' },
      only: { type: 'string' },
      cold: { type: 'string' },
      port: { type: 'string', default: '0' },
      playwright: { type: 'string', default: 'playwright' },
      out: { type: 'string' },
      shots: { type: 'string' },
      gpu: { type: 'boolean' },
    },
  });

  if (!fs.existsSync(path.join(ROOT, 'src/data/generated/runtime.json'))) {
    throw new Error('src/data/generated/runtime.json is missing; run node scripts/runtime.mts first');
  }
  const sets = values.pkg ?? (values.browser === 'chromium' ? Object.keys(SETS) : ['scenes']);
  const unknown = sets.filter((set) => !SETS[set]);

  if (unknown.length) throw new Error(`Unknown --pkg ${unknown.join(', ')}; use ${Object.keys(SETS).join(', ')}`);
  const only = values.only ? new Set(values.only.split(',')) : null;
  const playwright = await import(
    values.playwright.startsWith('.') || path.isAbsolute(values.playwright)
      ? pathToFileURL(path.resolve(values.playwright)).href
      : values.playwright
  );
  const { outputFiles } = await build({
    stdin: { contents: HOST_SCRIPT, loader: 'tsx', resolveDir: ROOT, sourcefile: 'host.tsx' },
    bundle: true,
    write: false,
    format: 'esm',
    target: 'es2022',
    minify: true,
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  });
  const { server, origin } = await serve(
    STATIC_ROUTES,
    (pathname) =>
      pathname === '/'
        ? ['text/html', HOST_PAGE]
        : pathname === '/host.js'
          ? ['text/javascript', outputFiles[0].text]
          : undefined,
    Number(values.port),
  );
  const args = [...CHROMIUM_ARGS, ...(values.gpu ? GPU_ARGS : SWIFTSHADER_ARGS)];
  const launch = () => playwright[values.browser].launch(values.browser === 'chromium' ? { args } : {});
  let browser = await launch();
  let context = await newContext(browser);
  let page = await context.newPage();
  const report = [];
  let failed = 0;

  /**
   * A frame too busy to screenshot or navigate can take its page, its context or the whole browser down with it, so
   * the sweep goes on in a fresh context, and in a fresh browser when the old one is gone or won't close the context
   */
  const recover = async () => {
    const closed = await Promise.race([
      context.close().then(
        () => true,
        () => true,
      ),
      settle(5000, false),
    ]);

    if (!closed || !browser.isConnected()) {
      await Promise.race([browser.close().catch(() => {}), settle(5000)]);
      browser = await launch();
    }
    context = await newContext(browser);
    page = await context.newPage();
  };

  try {
    for (const set of sets) {
      const scenes = SETS[set]().filter((scene) => !only || only.has(scene.name));
      const started = Date.now();
      const results = [];

      for (const scene of scenes) {
        const shot = values.shots && path.resolve(values.shots, set, `${scene.name}.png`);
        const result = await check(page, origin, scene, shot).catch(async (error) => {
          await recover();

          return {
            name: scene.name,
            ok: false,
            failure: error.message.split('\n')[0],
            readyMs: null,
            colours: 0,
            warnings: [],
          };
        });

        result.known = values.gpu && SWIFTSHADER_ONLY.has(scene.name) ? undefined : KNOWN[scene.name];
        results.push(result);
        console.log(
          `${result.ok ? 'ok  ' : result.known ? 'KNOWN' : 'FAIL'} ${set} ${scene.name}: ready ${result.readyMs ?? '-'} ms, ${result.colours} colours` +
            `${result.rerunMs ? `, rerun ${result.rerunMs} ms` : ''}${result.failure ? `; ${result.failure}` : ''}`,
        );
        if (result.known)
          console.log(`       ${result.ok ? 'passes now, so remove it from KNOWN' : 'known'}: ${result.known}`);
        for (const warning of result.warnings) console.log(`       console.error: ${warning}`);
        if (values.cold) {
          result.coldMs = await coldTimes(browser, origin, scene, Number(values.cold));
          const sorted = [...result.coldMs].sort((a, b) => a - b);

          console.log(`       cold ready ${result.coldMs.join(', ')} ms, median ${sorted[sorted.length >> 1]} ms`);
        }
      }
      const passed = results.filter((result) => result.ok).length;
      const known = results.filter((result) => !result.ok && result.known).length;

      failed += results.length - passed - known;
      console.log(
        `${set} (${values.browser}): ${passed}/${results.length} passed${known ? `, ${known} known` : ''} in ${Math.round((Date.now() - started) / 1000)} s\n`,
      );
      report.push({ set, browser: values.browser, results });
    }
  } finally {
    await browser.close();
    server.close();
  }
  if (values.out) fs.writeFileSync(values.out, `${JSON.stringify(report, null, 2)}\n`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
