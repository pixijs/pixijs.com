/**
 * Checks out the read-only reference repositories in `referenceRepos` into `.repos/`, so agents and
 * contributors can read the source of the libraries the site documents rather than their compiled output:
 * `npm run sync:repos [name...]`.
 *
 * Each repository is a depth-1 checkout of one commit. An entry that follows an npm package checks out
 * the commit its installed version was built from: the `gitHead` in the installed manifest (the vendored
 * `@pixi/3d` records one), else npm's `gitHead` for that version, else the `v<version>` tag. Running it again
 * moves each checkout to its current pin, skips the network for an npm pin that hasn't changed, and deletes
 * folders the list no longer has. In a worktree, a repository the main checkout already has at the same pin
 * is copied from there, with no network. `.repos` is gitignored and ignored by ESLint, so lint and repo-wide
 * searches skip it.
 *
 * pixi-3d is private. Git authenticates with `PIXI_3D_TOKEN` when it's set (CI), else with your own git
 * credentials (`gh auth setup-git`), and never prompts. Without access it warns, leaves `.repos/pixi-3d`
 * absent and the 3D docs are stubbed, unless `PIXI_3D_REQUIRED=1`. `PIXI_3D_REPO=<path>` fetches from a
 * local checkout instead of GitHub, for commits that aren't pushed.
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
  /**
   * Set for a private repository: `token` authenticates with GitHub, and a failure only warns and leaves
   * the folder absent unless `required`
   */
  private?: { token?: string; required: boolean };
}

/** Every repository in `.repos/`; folders that aren't listed here are deleted */
const referenceRepos: ReferenceRepo[] = [
  { name: 'pixijs', repository: 'https://github.com/pixijs/pixijs.git', ref: { npm: 'pixi.js' } },
  { name: 'filters', repository: 'https://github.com/pixijs/filters.git', ref: { npm: 'pixi-filters' } },
  {
    name: 'pixi-3d',
    repository: process.env.PIXI_3D_REPO
      ? pathToFileURL(path.resolve(process.env.PIXI_3D_REPO)).href
      : 'https://github.com/pixijs/pixi-3d.git',
    ref: { npm: '@pixi/3d' },
    private: { token: process.env.PIXI_3D_TOKEN, required: process.env.PIXI_3D_REQUIRED === '1' },
  },
];

const FULL_SHA = /^[0-9a-f]{40}$/;

/**
 * Runs git without prompting for credentials and returns its trimmed output
 * @param args - The git arguments
 * @param cwd - Directory to run in
 * @param env - Extra environment, such as auth config
 */
function git(args: string[], cwd: string, env: NodeJS.ProcessEnv = {}): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...env },
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

/**
 * Environment that makes git send a private entry's token to GitHub. It goes through `GIT_CONFIG_*` rather
 * than `-c`, so it never appears in the command line that a failure prints.
 * @param entry - The `referenceRepos` entry
 */
function authEnv(entry: ReferenceRepo): NodeJS.ProcessEnv {
  const token = entry.private?.token;

  if (!token) return {};

  return {
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`,
  };
}

const REPO_ROOT = git(['rev-parse', '--show-toplevel'], process.cwd());
const REPOS_DIR = path.join(REPO_ROOT, '.repos');

/**
 * The commit a branch or tag points at on the remote, peeling annotated tags, or the ref itself when it's a
 * full sha. A branch wins over a tag of the same name, as with `git clone --branch`.
 * @param repository - Git URL
 * @param ref - Branch, tag or full sha
 * @param env - Auth environment for the remote
 */
function remoteSha(repository: string, ref: string, env: NodeJS.ProcessEnv): string {
  if (FULL_SHA.test(ref)) return ref;
  const rows = git(
    ['ls-remote', repository, `refs/heads/${ref}`, `refs/tags/${ref}`, `refs/tags/${ref}^{}`],
    REPO_ROOT,
    env,
  )
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
 * @param env - Auth environment for the remote
 */
function publishedSha(name: string, installed: Manifest, repository: string, env: NodeJS.ProcessEnv): string {
  if (installed.gitHead && FULL_SHA.test(installed.gitHead)) return installed.gitHead;
  const gitHead = npmGitHead(name, installed.version);
  return FULL_SHA.test(gitHead) ? gitHead : remoteSha(repository, `v${installed.version}`, env);
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
  const env = authEnv(entry);
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
      ? publishedSha(npmPin, installed!, entry.repository, env)
      : remoteSha(entry.repository, entry.ref as string, env);

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
    git(['fetch', '--quiet', '--depth', '1', source, sha], dir, env);
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

    if (entry.private && !entry.private.required) {
      fs.rmSync(path.join(REPOS_DIR, entry.name), { recursive: true, force: true });
      console.warn(`warning: .repos/${entry.name}: skipped, ${reason} (private repository, no access?)`);
      continue;
    }
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
