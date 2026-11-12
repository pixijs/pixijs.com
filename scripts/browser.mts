/** Helpers the scripts that drive a browser share: a local static server and Chromium on SwiftShader */
import { build } from 'esbuild';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { LIBRARIES } from './libraries.mts';

import type { AddressInfo } from 'node:net';

const ROOT = path.resolve(import.meta.dirname, '..');

/** Chromium flags that draw WebGL on SwiftShader, so a render comes out the same on any machine */
export const SWIFTSHADER_ARGS = ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'];

const MIME: Record<string, string> = {
  '.atlas': 'text/plain',
  '.css': 'text/css',
  '.cubemap': 'application/json',
  '.fnt': 'text/plain',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.html': 'text/html',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'text/xml',
};

export const contentType = (file: string): string => MIME[path.extname(file)] ?? 'application/octet-stream';

/** A URL path prefix and the folder it serves */
export type Route = [prefix: string, dir: string];

/** The site's static folders at `/`, in the order of `staticDirectories` in docusaurus.config.ts */
export const STATIC_ROUTES: Route[] = [
  'static',
  ...Object.values(LIBRARIES).map(({ staticDir }) => staticDir),
  'static-runtime',
].map((dir) => ['/', path.join(ROOT, dir)]);

/**
 * The file a URL path names: from the first route whose prefix it starts with and whose folder has it, and the
 * folder's `index.html` for the prefix itself
 * @param routes - Routes to look in, in order
 * @param pathname - Decoded URL path
 * @returns The file, or null when no folder has it
 */
export function routeFile(routes: Route[], pathname: string): string | null {
  for (const [prefix, dir] of routes) {
    if (!pathname.startsWith(prefix)) continue;
    const file = path.join(dir, pathname.slice(prefix.length) || 'index.html');

    if (file.startsWith(dir + path.sep) && fs.statSync(file, { throwIfNoEntry: false })?.isFile()) return file;
  }

  return null;
}

/**
 * Serves files from `routes` on 127.0.0.1
 * @param routes - Routes to look in, in order
 * @param answer - Replies to a decoded URL path with a content type and body before the routes are tried, or
 * returns undefined to leave it to them
 * @param port - Port to listen on; 0 picks a free one
 */
export async function serve(
  routes: Route[],
  answer?: (pathname: string) => [type: string, body: string | Buffer] | undefined,
  port = 0,
): Promise<{ server: http.Server; origin: string }> {
  const reply = (pathname: string): [string, string | Buffer] | null => {
    const answered = answer?.(pathname);

    if (answered) return answered;
    const file = routeFile(routes, pathname);

    return file ? [contentType(file), fs.readFileSync(file)] : null;
  };
  const server = http.createServer((request, response) => {
    const found = reply(decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname));

    if (!found) {
      response.writeHead(404).end();

      return;
    }
    response.writeHead(200, { 'content-type': found[0], 'access-control-allow-origin': '*' }).end(found[1]);
  });

  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

  return { server, origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}

/**
 * Bundles `source`, runs it in a blank page in Chromium on SwiftShader and calls the function it sets on `window`
 * @param source - TypeScript, resolved from the site root, that sets `window[fn]`
 * @param fn - Name of the function, which resolves to images as `data:` URLs by name
 */
export async function renderInPage(source: string, fn: string): Promise<Record<string, string>> {
  const bundle = await build({
    stdin: { contents: source, resolveDir: ROOT, loader: 'ts' },
    bundle: true,
    format: 'iife',
    target: 'es2022',
    write: false,
    logLevel: 'error',
  });
  const browser = await chromium.launch({ args: SWIFTSHADER_ARGS });

  try {
    const page = await browser.newPage();
    const errors: string[] = [];

    page.on('pageerror', (error) => errors.push(error.message));
    await page.setContent('<!doctype html><html><body></body></html>');
    await page.addScriptTag({ content: bundle.outputFiles[0].text });
    const renders = await page.evaluate(
      (name) => (window as unknown as Record<string, () => Promise<Record<string, string>>>)[name](),
      fn,
    );

    if (errors.length) throw new Error(errors.join('\n'));

    return renders;
  } finally {
    await browser.close();
  }
}

/**
 * Writes the bytes of a `data:` URL to a file and logs its size
 * @param file - Absolute path
 * @param url - `data:` URL
 */
export function writeDataUrl(file: string, url: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${path.relative(ROOT, file)}  ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}
