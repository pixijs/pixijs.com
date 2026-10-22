/**
 * Builds a pixi-3d checkout into `vendor/pixi-3d.tgz`, the `@pixi/3d` the site installs until it's on npm:
 * `npm run vendor:pixi-3d -- <pixi-3d checkout>`.
 *
 * The tarball records the commit it was built from as `gitHead`, which npm keeps in the installed manifest,
 * so `sync-repos.mts` checks out that exact commit into `.repos/pixi-3d`. Source maps are stripped: the CDN
 * maps carry the full source of a private repository, and dropping them halves the tarball.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TARBALL = path.join(ROOT, 'vendor/pixi-3d.tgz');
const LOCK_FILE = path.join(ROOT, 'package-lock.json');
const SOURCE_MAP_COMMENT = /\n\/\/# sourceMappingURL=\S+\s*$/;

/**
 * Runs a command, streaming its stderr, and returns its trimmed stdout
 * @param command - Executable
 * @param args - Arguments
 * @param cwd - Directory to run in
 */
function run(command: string, args: string[], cwd: string): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

/**
 * Deletes source maps and the comments that point at them
 * @param dir - The unpacked package's `dist`
 */
function stripSourceMaps(dir: string): void {
  for (const file of fs.readdirSync(dir, { recursive: true, encoding: 'utf8' })) {
    const full = path.join(dir, file);

    if (file.endsWith('.map')) {
      fs.rmSync(full);
    } else if (/\.[cm]?[jt]s$/.test(file)) {
      const code = fs.readFileSync(full, 'utf8');

      if (SOURCE_MAP_COMMENT.test(code)) fs.writeFileSync(full, `${code.replace(SOURCE_MAP_COMMENT, '')}\n`);
    }
  }
}

const source = process.argv[2] && path.resolve(process.argv[2]);

if (!source) {
  console.error('Usage: npm run vendor:pixi-3d -- <pixi-3d checkout>');
  process.exit(1);
}
if (run('git', ['status', '--porcelain'], source)) {
  console.error(`${source} has uncommitted changes; vendor a clean checkout so gitHead describes the build`);
  process.exit(1);
}

const sha = run('git', ['rev-parse', 'HEAD'], source);
const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'vendor-pixi-3d-'));

try {
  run('npm', ['run', 'build'], source);

  const [packed] = JSON.parse(
    run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', staging], source),
  ) as { filename: string }[];

  run('tar', ['-xzf', packed.filename], staging);

  const pkgDir = path.join(staging, 'package');
  const manifestFile = path.join(pkgDir, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) as Record<string, unknown> & { version: string };

  manifest.gitHead = sha;
  for (const field of ['scripts', 'workspaces', 'devDependencies', 'lint-staged']) delete manifest[field];
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  stripSourceMaps(path.join(pkgDir, 'dist'));

  // npm pack writes fixed timestamps, so the same commit always produces the same tarball
  const [repacked] = JSON.parse(
    run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', staging], pkgDir),
  ) as { filename: string }[];

  fs.mkdirSync(path.dirname(TARBALL), { recursive: true });
  fs.copyFileSync(path.join(staging, repacked.filename), TARBALL);

  // npm reinstalls a `file:` tarball from its cache while the lockfile still vouches for the old integrity
  const lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8')) as { packages: Record<string, unknown> };

  delete lock.packages['node_modules/@pixi/3d'];
  fs.writeFileSync(LOCK_FILE, `${JSON.stringify(lock, null, 2)}\n`);
  execFileSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: ROOT, stdio: 'inherit' });

  console.log(`@pixi/3d ${manifest.version} at ${sha.slice(0, 7)}; run npm run generate:pixi-3d`);
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
