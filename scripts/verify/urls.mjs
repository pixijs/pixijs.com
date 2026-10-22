/**
 * Checks the URL contract: every URL in the baseline is still served by a build, as a page or as a redirect
 * whose target is itself served. Prints the misses and exits 1 when there are any.
 *
 * `node scripts/verify/urls.mjs scripts/verify/url-baseline.txt build`
 *
 * `url-baseline.txt` lists the 544 URLs the site served before the redesign. `/header`
 * isn't one of them: it was only the old hero's iframe, never a page to link to.
 */
import fs from 'node:fs';
import path from 'node:path';

const [baselineFile, buildDir] = process.argv.slice(2);

if (!baselineFile || !buildDir) {
  console.error('Usage: node scripts/verify/urls.mjs <baseline.txt> <buildDir>');
  process.exit(1);
}

const urls = fs.readFileSync(baselineFile, 'utf8').split('\n').filter(Boolean);

/** The build file that serves a URL, or undefined */
const fileFor = (url) => {
  const clean = url.split(/[?#]/)[0].replace(/\/$/, '');
  const candidates = clean === '' ? ['index.html'] : [`${clean}.html`, `${clean}/index.html`];

  return candidates.map((c) => path.join(buildDir, c)).find((f) => fs.existsSync(f));
};

/** The target of a client redirect page, or undefined for a real page */
const redirectTarget = (file) =>
  /http-equiv="refresh" content="0; url=([^"]+)"/.exec(fs.readFileSync(file, 'utf8'))?.[1];

const missing = [];
const dangling = [];
let pages = 0;
let redirects = 0;

for (const url of urls) {
  const file = fileFor(url);

  if (!file) {
    missing.push(url);
    continue;
  }
  const target = redirectTarget(file);

  if (!target) {
    pages++;
    continue;
  }
  redirects++;
  if (target.startsWith('/') && !fileFor(target)) dangling.push(`${url} -> ${target}`);
}

console.log(
  `${urls.length} URLs: ${pages} pages, ${redirects} redirects, ${missing.length} missing, ${dangling.length} dangling`,
);
for (const url of missing) console.log(`missing: ${url}`);
for (const line of dangling) console.log(`dangling: ${line}`);
process.exit(missing.length || dangling.length ? 1 : 0);
