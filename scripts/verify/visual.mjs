// Captures routes of a served build at several viewports in both themes and checks what a screenshot alone hides
// (spec section 14). Serve the build first (`npm run serve -- --port 3102`), then:
//
//   node scripts/verify/visual.mjs [--base URL] [--out DIR] [--only part,...] [--exact]
//     [--viewports all|package|WxH,...] [--themes light,dark] [--full] [--motion] [--no-webgl] [--perf] [--axe]
//     [--focus] [--wait MS]
//
// `--only` keeps the routes that contain any of its parts; with `--exact` its parts are the routes themselves (`/`
// is just the home), and they needn't be in the list below.
//
// Per capture: HTTP status, page and console errors (third-party hosts filtered), horizontal overflow with the
// offending elements (html's overflow-x is forced visible first), tap targets under 24 px (buttons under 44 px at
// <= 768), one h1, `data-theme` matching the forced scheme, computed fonts and no Google Fonts requests, `.clay` shapes
// clear of text in their band, the pill nav clear of the h1, at most two canvases (iframes' included), and no
// home-field chunk under reduced motion. Content of a closed `<details>` counts as hidden. `--perf` adds LCP element
// and time, CLS and gzip JS/CSS, after one warm-up load (a fresh SwiftShader browser paints its first page seconds
// late); `--axe` runs axe-core (contrast and ARIA rules fail); `--focus` tabs through the page and screenshots each
// focus ring. Screenshots and report.json go to `<out>/<w>x<h>/<theme>/`. Exits 1 when any check fails.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { SWIFTSHADER_ARGS } from '../browser.mts';

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name, fallback) => {
  const i = argv.indexOf(name);

  return i === -1 ? fallback : argv[i + 1];
};

const base = option('--base', 'http://127.0.0.1:3102').replace(/\/$/, '');
const outDir = option('--out', join(tmpdir(), 'pixijs-verify', 'visual'));
const only = option('--only')?.split(',');
const wait = Number(option('--wait', 1500));
const motion = flag('--motion');

const VIEWPORT_SETS = {
  all: '360x780,390x844,430x932,768x1024,1024x768,1280x800,1440x900,1920x1080,2560x1440',
  package: '360x780,768x1024,1024x768,1440x900,1920x1080',
};
const viewportArg = option('--viewports', 'all');
const VIEWPORTS = (VIEWPORT_SETS[viewportArg] ?? viewportArg).split(',').map((size) => {
  const [width, height] = size.split('x').map(Number);

  return { width, height };
});
const THEMES = option('--themes', 'light,dark').split(',');

const DEFAULT_ROUTES = [
  '/',
  '/2d',
  '/3d',
  '/8.x/guides/getting-started/intro',
  '/8.x/guides/components/scene-objects/text/bitmap',
  '/8.x/guides/concepts/scene-graph',
  '/3d/guides/getting-started/intro',
  '/3d/guides/components/materials/pbr',
  '/8.x/examples',
  '/8.x/examples?example=sprite_transform_rotation',
  '/3d/examples',
  '/3d/examples?example=basics_hello-cube',
  '/playground',
  '/3d/playground',
  '/7.x/playground',
  '/8.x/tutorials',
  '/8.x/tutorials/fish-pond',
  '/3d/tutorials',
  '/3d/tutorials/floating-shapes',
  '/7.x/guides/basics/scene-graph',
  '/7.x/examples/basic/container',
  '/blog',
  '/blog/pixi-v8-launches',
  '/showcase',
  '/sponsor',
  '/team',
  '/faq',
  '/branding',
  '/llms',
  '/versions',
  '/search?q=sprite',
  '/does-not-exist',
  '/styleguide',
];
const ROUTES =
  only && flag('--exact') ? only : DEFAULT_ROUTES.filter((route) => !only || only.some((part) => route.includes(part)));

const EXPECTED_404 = new Set(['/does-not-exist']);
const THIRD_PARTY = /googletagmanager|google-analytics|doubleclick|codesandbox|csbops|jsdelivr|convertkit|kit\.com/;
const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/;
const REDUCED_MOTION_FORBIDDEN = /home-field/;
const HOMES = new Set(['/', '/2d', '/3d']);
const FONT_FAMILIES = { body: 'Roboto', h1: 'Outfit', code: 'Roboto Mono' };
const slug = (route) => route.replace(/^\/+/, '').replace(/[^\w.-]+/g, '_') || 'home';

/** Runs in the page: layout facts a screenshot hides */
function inspect({ coarse }) {
  const vw = document.documentElement.clientWidth;
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const classes = [...el.classList]
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join('');

    return `${el.tagName.toLowerCase()}${id}${classes}`;
  };
  const collapsed = (el) => !!el.closest('details:not([open]) > :not(summary)');
  const visible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return (
      rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && Number(style.opacity) > 0 && !collapsed(el)
    );
  };
  const intersect = (a, b, slack = 2) =>
    a.left < b.right - slack && b.left < a.right - slack && a.top < b.bottom - slack && b.top < a.bottom - slack;

  const overflowing = [];

  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) continue;
    if (el.matches('[class*="skipToContent"], .monaco-aria-container')) continue;
    if (getComputedStyle(el).visibility === 'hidden' || collapsed(el)) continue;
    if (rect.right <= vw + 1 && rect.left >= -1) continue;
    let parent = el.parentElement;
    let nested = false;

    while (parent && parent !== document.body) {
      const box = parent.getBoundingClientRect();

      if (box.right > vw + 1 || box.left < -1) nested = true;
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(parent).overflowX)) {
        nested ||= box.right <= vw + 1 && box.left >= -1;
        break;
      }
      parent = parent.parentElement;
    }
    if (!nested) overflowing.push({ el: describe(el), left: Math.round(rect.left), right: Math.round(rect.right) });
  }

  const smallTargets = [...document.querySelectorAll('a, button, [role="button"], input, select, summary')]
    .filter((el) => {
      if (!visible(el)) return false;
      const rect = el.getBoundingClientRect();

      if (rect.top > innerHeight || rect.bottom < 0) return false;
      if (el.matches('a') && getComputedStyle(el).display === 'inline') return false;
      const min = coarse && el.matches('button, [role="button"], input[type="button"], input[type="submit"]') ? 44 : 24;

      return rect.width < min || rect.height < min;
    })
    .map((el) => {
      const rect = el.getBoundingClientRect();

      return `${describe(el)} ${Math.round(rect.width)}x${Math.round(rect.height)}`;
    });

  const clayOverlaps = [];
  // Text counts by its line boxes clipped to its own box, so a centred heading's empty sides don't collide with
  // shapes beside it (glyph boxes of tight display type reach past the element)
  const inkOf = (el) => {
    const box = el.getBoundingClientRect();

    if (el.matches('a, button')) return [box];
    const range = document.createRange();

    range.selectNodeContents(el);

    return [...range.getClientRects()].map((line) => ({
      left: line.left,
      right: line.right,
      top: Math.max(line.top, box.top),
      bottom: Math.min(line.bottom, box.bottom),
    }));
  };

  for (const clay of document.querySelectorAll('.clay')) {
    if (!visible(clay)) continue;
    const band = clay.closest('section, header, footer, [data-band]') ?? document.body;
    const rect = clay.getBoundingClientRect();

    for (const text of band.querySelectorAll('h1, h2, h3, p, a, button')) {
      if (text.contains(clay) || clay.contains(text) || !visible(text)) continue;
      if (inkOf(text).some((box) => intersect(rect, box))) {
        clayOverlaps.push(`${clay.dataset.shape ?? describe(clay)} over ${describe(text)}`);
      }
    }
  }

  const h1s = [...document.querySelectorAll('h1')];
  const pill = document.querySelector('[data-verify="pill-nav"]');
  const pillOverH1 = !!(pill && h1s[0] && intersect(pill.getBoundingClientRect(), h1s[0].getBoundingClientRect(), 0));
  const fontOf = (selector) => {
    const el = document.querySelector(selector);

    return el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null;
  };

  return {
    observedTheme: document.documentElement.dataset.theme,
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: vw,
    horizontalScroll: document.documentElement.scrollWidth > vw + 1,
    overflowing: overflowing.slice(0, 8),
    smallTargets: smallTargets.slice(0, 12),
    clayOverlaps: clayOverlaps.slice(0, 8),
    pillOverH1,
    h1: h1s.map((h) => h.textContent.trim().slice(0, 60)),
    canvases: document.querySelectorAll('canvas').length,
    fonts: {
      body: fontOf('body'),
      h1: fontOf('h1'),
      code: fontOf('code, pre'),
      loaded: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))],
    },
    coarse: matchMedia('(pointer: coarse)').matches,
    height: document.documentElement.scrollHeight,
  };
}

/** Canvases inside iframes (Nebulon's hero scene on /2d), which hold WebGL contexts of their own */
async function framesCanvases(page) {
  const counts = await Promise.all(
    page
      .frames()
      .filter((frame) => frame !== page.mainFrame())
      .map((frame) => frame.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)),
  );

  return counts.reduce((sum, count) => sum + count, 0);
}

function observePerf() {
  window.__verifyPerf = { lcp: null, cls: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const el = entry.element;

      window.__verifyPerf.lcp = {
        t: Math.round(entry.startTime),
        el: el ? `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}` : null,
        text: el?.textContent?.trim().slice(0, 40) ?? null,
      };
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__verifyPerf.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
}

const gzipCache = new Map();

async function gzipSize(url) {
  if (!gzipCache.has(url)) {
    const response = await fetch(url).catch(() => null);
    const body = response?.ok ? Buffer.from(await response.arrayBuffer()) : null;

    gzipCache.set(url, body ? gzipSync(body, { level: 9 }).length : 0);
  }

  return gzipCache.get(url);
}

async function measurePerf(page) {
  const { lcp, cls, resources } = await page.evaluate(() => ({
    ...window.__verifyPerf,
    resources: performance
      .getEntriesByType('resource')
      .filter((entry) => /\.(m?js|css)(\?|$)/.test(entry.name) && entry.name.startsWith(location.origin))
      .map((entry) => entry.name),
  }));
  const kb = { js: 0, css: 0, main: 0 };

  for (const url of resources) {
    const size = await gzipSize(url);

    kb[url.includes('.css') ? 'css' : 'js'] += size;
    if (/\/main\.[\w]+\.js/.test(url)) kb.main += size;
  }

  return {
    lcp,
    cls: Math.round(cls * 1000) / 1000,
    gzipKB: Object.fromEntries(Object.entries(kb).map(([k, v]) => [k, Math.round(v / 102.4) / 10])),
  };
}

let axeSource;

async function runAxe(page) {
  axeSource ??= readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(() =>
    window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }),
  );

  return result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
    count: violation.nodes.length,
  }));
}

async function captureFocus(page, dir) {
  mkdirSync(dir, { recursive: true });
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const rect = await page.evaluate(() => {
      const el = document.activeElement;

      if (!el || el === document.body) return null;
      el.scrollIntoView({ block: 'center' });
      const box = el.getBoundingClientRect();

      return { x: box.left, y: box.top, width: box.width, height: box.height };
    });

    if (!rect || rect.width === 0) continue;
    const pad = 12;
    const x = Math.max(0, rect.x - pad);
    const y = Math.max(0, rect.y - pad);

    await page.screenshot({
      path: join(dir, `${String(i).padStart(2, '0')}.png`),
      clip: { x, y, width: rect.width + pad * 2, height: rect.height + pad * 2 },
    });
  }
}

function failuresOf(record) {
  const fails = [];

  if (record.exception) fails.push(record.exception);
  if (record.status >= 400 && !EXPECTED_404.has(record.route)) fails.push(`HTTP ${record.status}`);
  // The browser logs the 404 document itself as a failed resource
  const expected = (error) => EXPECTED_404.has(record.route) && /status of 404/.test(error);
  const errors = record.errors?.filter((error) => !expected(error)) ?? [];

  if (errors.length) fails.push(`${errors.length} errors`);
  if (record.horizontalScroll) fails.push(`overflow ${record.scrollWidth}/${record.viewportWidth}`);
  if (record.observedTheme && record.observedTheme !== record.theme) fails.push(`theme ${record.observedTheme}`);
  if (record.h1 && record.h1.length !== 1) fails.push(`${record.h1.length} h1`);
  if (record.googleFonts?.length) fails.push(`${record.googleFonts.length} Google Fonts requests`);
  if (record.forbidden?.length) fails.push(`reduced motion loaded ${record.forbidden.join(', ')}`);
  if (record.clayOverlaps?.length) fails.push(`${record.clayOverlaps.length} clay overlaps`);
  if (record.pillOverH1) fails.push('pill nav over h1');
  if (HOMES.has(record.route.split('#')[0]) && record.canvases > 2) fails.push(`${record.canvases} canvases`);
  for (const [key, family] of Object.entries(FONT_FAMILIES)) {
    const actual = record.fonts?.[key];

    if (actual && actual !== family) fails.push(`${key} font ${actual}`);
  }
  const blocking = record.axe?.filter((v) => v.id === 'color-contrast' || v.id.startsWith('aria-')) ?? [];

  if (blocking.length) fails.push(`axe ${blocking.map((v) => `${v.id}×${v.count}`).join(', ')}`);

  return fails;
}

const launchArgs = ['--use-gl=angle', ...SWIFTSHADER_ARGS];

if (flag('--no-webgl')) launchArgs.push('--disable-webgl', '--disable-3d-apis');

const browser = await chromium.launch({ args: launchArgs });

if (flag('--perf')) {
  const warmUp = await browser.newPage();

  await warmUp.goto(base + ROUTES[0], { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  await warmUp.close();
}
const results = [];
let failed = 0;

for (const viewport of VIEWPORTS) {
  const coarse = viewport.width <= 768;

  for (const theme of THEMES) {
    // A fresh context per theme and viewport: with no stored choice Docusaurus follows the emulated scheme
    const context = await browser.newContext({
      viewport,
      colorScheme: theme,
      reducedMotion: motion ? 'no-preference' : 'reduce',
      hasTouch: coarse,
    });
    const page = await context.newPage();
    let errors = [];
    let requests = [];

    if (flag('--perf')) await page.addInitScript(observePerf);
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message.slice(0, 160)}`));
    page.on('console', (message) => {
      if (message.type() === 'error' && !THIRD_PARTY.test(message.location().url ?? '')) {
        errors.push(`console: ${message.text().slice(0, 160)}`);
      }
    });
    page.on('request', (request) => requests.push(request.url()));

    for (const route of ROUTES) {
      errors = [];
      requests = [];
      const dir = join(outDir, `${viewport.width}x${viewport.height}`, theme);
      const record = { route, viewport: `${viewport.width}x${viewport.height}`, theme };

      mkdirSync(dir, { recursive: true });
      try {
        const response = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });

        record.status = response?.status();
        await page.evaluate(() => document.fonts.ready);
        if (motion) {
          await page.waitForTimeout(300);
          await page.screenshot({ path: join(dir, `${slug(route)}-300ms.png`) });
          await page.waitForTimeout(600);
          await page.screenshot({ path: join(dir, `${slug(route)}-900ms.png`) });
          await page
            .waitForFunction(() => window.__siteMotionSettled === true, null, { timeout: 8000 })
            .catch(() => (record.settled = false));
        } else {
          await page.waitForTimeout(wait);
        }
        await page.addStyleTag({ content: 'html { overflow-x: visible !important; }' });
        Object.assign(record, await page.evaluate(inspect, { coarse }));
        record.canvases += await framesCanvases(page);
        await page.screenshot({
          path: join(dir, `${slug(route)}.png`),
          fullPage: flag('--full') && record.height < 16000,
        });
        if (flag('--perf')) record.perf = await measurePerf(page);
        if (flag('--axe')) record.axe = await runAxe(page);
        if (flag('--focus')) await captureFocus(page, join(dir, `${slug(route)}-focus`));
      } catch (error) {
        record.exception = error.message.split('\n')[0];
      }
      record.errors = errors;
      record.googleFonts = requests.filter((url) => GOOGLE_FONTS.test(url));
      if (!motion) record.forbidden = requests.filter((url) => REDUCED_MOTION_FORBIDDEN.test(url));
      record.failures = failuresOf(record);
      if (record.failures.length) failed++;
      results.push(record);

      const notes = [
        ...record.failures,
        record.smallTargets?.length && `${record.smallTargets.length} small targets`,
        record.perf && `LCP ${record.perf.lcp?.t}ms ${record.perf.lcp?.el} CLS ${record.perf.cls}`,
      ].filter(Boolean);

      console.log(`${record.viewport} ${theme.padEnd(5)} ${route} ${notes.join(' · ')}`);
    }
    await context.close();
  }
}

await browser.close();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'report.json'), JSON.stringify(results, null, 2));
console.log(`\n${results.length} captures, ${failed} failing. Report: ${join(outDir, 'report.json')}`);
process.exitCode = failed ? 1 : 0;
