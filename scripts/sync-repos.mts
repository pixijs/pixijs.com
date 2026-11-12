/**
 * Checks out the read-only reference repositories in `referenceRepos` into `.repos/`, so agents and
 * contributors can read the source of the libraries the site documents rather than their compiled output:
 * `npm run sync:repos [name...]`.
 *
 * Each repository is a depth-1 checkout of one commit. An entry that follows an npm package checks out
 * the commit its installed version was built from: the `gitHead` in the installed manifest when it has one,
 * else npm's `gitHead` for that version, else the `v<version>` tag. Running it again
 * moves each checkout to its current pin, skips the network for an npm pin that hasn't changed, and deletes
 * folders the list no longer has. In a worktree, a repository the main checkout already has at the same pin
 * is copied from there, with no network. `.repos` is gitignored and ignored by ESLint, so lint and repo-wide
 * searches skip it.
 *
 * `.repos/pixi-3d` is `@pixi/3d`'s source, from github.com/pixijs/3d. `PIXI_3D_REPO=<path>` fetches it from a
 * local checkout instead, for a version whose tag isn't pushed.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { installedPackage, type Manifest, repoPin } from './shared.mts';

/** A read-only reference repository checked out into `.repos/<name>` */
interface ReferenceRepo {
  /** Folder name under `.repos/` */
  name: string;
  /** Git URL to clone from */
  repository: string;
  /**
   * The commit to check out: a branch, a tag, a full commit sha, or `{ npm }` to follow the installed
   * version of that package
   */
  ref: string | { npm: string };
}

/** Every repository in `.repos/`; folders that aren't listed here are deleted */
const referenceRepos: ReferenceRepo[] = [
  { name: 'pixijs', repository: 'https://github.com/pixijs/pixijs.git', ref: { npm: 'pixi.js' } },
  { name: 'filters', repository: 'https://github.com/pixijs/filters.git', ref: { npm: 'pixi-filters' } },
  {
    name: 'pixi-3d',
    repository: process.env.PIXI_3D_REPO
      ? pathToFileURL(path.resolve(process.env.PIXI_3D_REPO)).href
      : 'https://github.com/pixijs/3d.git',
    ref: { npm: '@pixi/3d' },
  },
];

const FULL_SHA = /^[0-9a-f]{40}$/;

/**
 * Runs git without prompting for credentials and returns its trimmed output
 * @param args - The git arguments
 * @param cwd - Directory to run in
 */
function git(args: string[], cwd: string): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  }).trim();
}

/**
 * Runs git and returns its trimmed output, or null when it fails
 * @param args - The git arguments
 * @param cwd - Directory to run in
 */
function gitOrNull(args: string[], cwd: string): string | null {
  try {
    return git(args, cwd);
  } catch {
    return null;
  }
}

const REPO_ROOT = git(['rev-parse', '--show-toplevel'], process.cwd());
const REPOS_DIR = path.join(REPO_ROOT, '.repos');

/**
 * The commit a branch or tag points at on the remote, peeling annotated tags, or the ref itself when it's a
 * full sha. A branch wins over a tag of the same name, as with `git clone --branch`.
 * @param repository - Git URL
 * @param ref - Branch, tag or full sha
 */
function remoteSha(repository: string, ref: string): string {
  if (FULL_SHA.test(ref)) return ref;
  const rows = git(['ls-remote', repository, `refs/heads/${ref}`, `refs/tags/${ref}`, `refs/tags/${ref}^{}`], REPO_ROOT)
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(/\s+/));
  const pick = (suffix: string): string | undefined => rows.find(([, name]) => name.endsWith(suffix))?.[0];
  const sha = pick(`refs/heads/${ref}`) ?? pick('^{}') ?? rows[0]?.[0];
  if (!sha) throw new Error(`${ref} doesn't exist on ${repository}`);
  return sha;
}

/**
 * npm's `gitHead` for a published version, or an empty string when npm doesn't have one
 * @param name - Package name
 * @param version - Package version
 */
function npmGitHead(name: string, version: string): string {
  try {
    return execFileSync('npm', ['view', `${name}@${version}`, 'gitHead'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

/**
 * The commit an installed npm package was built from: its manifest's `gitHead`, npm's `gitHead` for that
 * version, or the `v<version>` tag
 * @param name - Package name
 * @param installed - Its installed manifest
 * @param repository - Git URL of the package's source
 */
function publishedSha(name: string, installed: Manifest, repository: string): string {
  if (installed.gitHead && FULL_SHA.test(installed.gitHead)) return installed.gitHead;
  const gitHead = npmGitHead(name, installed.version);
  return FULL_SHA.test(gitHead) ? gitHead : remoteSha(repository, `v${installed.version}`);
}

/** The main checkout's `.repos` when this checkout is a linked worktree, otherwise null */
function mainCheckoutReposDir(): string | null {
  const commonDir = gitOrNull(['rev-parse', '--path-format=absolute', '--git-common-dir'], REPO_ROOT);
  if (!commonDir) return null;
  const mainRoot = fs.realpathSync(path.dirname(commonDir));
  return mainRoot === fs.realpathSync(REPO_ROOT) ? null : path.join(mainRoot, '.repos');
}

const MAIN_REPOS_DIR = mainCheckoutReposDir();

/**
 * Moves one repository's checkout to its pinned commit, cloning it when it's missing
 * @param entry - The `referenceRepos` entry
 * @returns What happened, for the summary line
 */
function sync(entry: ReferenceRepo): string {
  const dir = path.join(REPOS_DIR, entry.name);
  const npmPin = typeof entry.ref === 'string' ? null : entry.ref.npm;
  const installed = npmPin ? installedPackage(npmPin) : null;
  const head = fs.existsSync(path.join(dir, '.git')) ? gitOrNull(['rev-parse', 'HEAD'], dir) : null;

  const pin = npmPin ? repoPin(npmPin) : (entry.ref as string);

  if (head && npmPin && gitOrNull(['config', 'repos.pin'], dir) === pin) {
    return `up to date at ${pin} (${head.slice(0, 7)})`;
  }

  const mainClone = MAIN_REPOS_DIR ? path.join(MAIN_REPOS_DIR, entry.name) : null;
  const mainHead = mainClone ? gitOrNull(['rev-parse', 'HEAD'], mainClone) : null;
  const mainHasPin = npmPin !== null && mainHead !== null && gitOrNull(['config', 'repos.pin'], mainClone!) === pin;
  const sha = mainHasPin
    ? mainHead
    : npmPin
      ? publishedSha(npmPin, installed!, entry.repository)
      : remoteSha(entry.repository, entry.ref as string);

  if (!head) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    git(['init', '--quiet'], dir);
    git(['remote', 'add', 'origin', entry.repository], dir);
  } else {
    git(['remote', 'set-url', 'origin', entry.repository], dir);
  }

  if (head !== sha) {
    const source = mainHead === sha ? pathToFileURL(mainClone!).href : 'origin';
    git(['fetch', '--quiet', '--depth', '1', source, sha], dir);
    git(['checkout', '--quiet', '--force', '--detach', 'FETCH_HEAD'], dir);
    git(['clean', '-fdxq'], dir);
  }
  git(['config', 'repos.pin', pin], dir);

  if (head === sha) return `up to date at ${pin} (${sha.slice(0, 7)})`;
  return `${head ? `moved ${head.slice(0, 7)} ->` : 'cloned'} ${pin} (${sha.slice(0, 7)})`;
}

const names = process.argv.slice(2);
const unknown = names.filter((name) => !referenceRepos.some((entry) => entry.name === name));
if (unknown.length) {
  console.error(`Not in referenceRepos (scripts/sync-repos.mts): ${unknown.join(', ')}`);
  process.exit(1);
}

fs.mkdirSync(REPOS_DIR, { recursive: true });
let failed = 0;

for (const entry of referenceRepos) {
  if (names.length && !names.includes(entry.name)) continue;
  try {
    console.log(`.repos/${entry.name}: ${sync(entry)}`);
  } catch (error) {
    const { message, stderr } = error as Error & { stderr?: string };
    const reason = (stderr?.trim() || message).split('\n')[0];

    failed++;
    console.error(`.repos/${entry.name}: failed, ${reason}`);
  }
}

if (!names.length) {
  for (const folder of fs.readdirSync(REPOS_DIR)) {
    if (folder.startsWith('.') || referenceRepos.some((entry) => entry.name === folder)) continue;
    fs.rmSync(path.join(REPOS_DIR, folder), { recursive: true, force: true });
    console.log(`.repos/${folder}: deleted, no longer listed in referenceRepos`);
  }
}

process.exitCode = failed ? 1 : 0;
