# PixiJS Website

The official [pixijs.com](https://pixijs.com) website — home to the PixiJS and PixiJS 3D documentation, guides, examples, blog, playground, and project showcase. Built with [Docusaurus 3](https://docusaurus.io/).

## Prerequisites

- [Node.js](https://nodejs.org/) **v24+** (see `.nvmrc`)
- npm (ships with Node)

## Getting Started

```bash
# Install dependencies
npm install

# Generate the PixiJS guides and examples, then start the dev server
npm start
```

The site will be available at `http://localhost:3000`. The first run clones pixi.js and pixi-3d into `.repos/` and downloads pixi.js's API link index, so it needs network access; later runs reuse both. pixi-3d is a private repository: without access to it the build still works, with placeholder 3D guides (see [PixiJS 3D](#pixijs-3d)).

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Generate PixiJS content and tutorials, then start the local dev server |
| `npm run build` | Production build (runs `npm run generate` first) |
| `npm run serve` | Serve the production build locally |
| `npm run generate` | Generate PixiJS content and tutorials |
| `npm run generate:pixi` | Generate the v8 guides, examples, guides sidebar and `llms.txt` from `.repos/pixijs` |
| `npm run generate:pixi-3d` | Generate the 3D guides, examples, tutorials and `/3d/llms.txt` from `.repos/pixi-3d` |
| `npm run generate:runtime` | Write the editor's import map and the files it serves into `static-runtime/` |
| `npm run generate:example-previews` | Capture gallery previews with headless Chrome; `-- --missing` captures every example without one, `-- --pkg 3d` the 3D examples |
| `npm run vendor:pixi-3d -- <checkout>` | Build a pixi-3d checkout into `vendor/pixi-3d.tgz` |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run types` | Generate PixiJS content, then type-check with TypeScript (no emit) |
| `npm run clear` | Clear the Docusaurus cache |
| `npm run sync:repos` | Check out library source into `.repos/`, for the generators and for reference |

## Project Structure

```
├── blog/                # Blog posts (MDX/Markdown)
│   └── examples/        # Site-owned examples for blog posts and the gallery
├── docs/                # 2D documentation source
│   ├── examples/        # Examples gallery page
│   ├── guides/          # Guides (concepts, components and migrations are generated)
│   └── tutorials/       # Generated tutorial pages
├── docs-3d/             # 3D documentation source, served under /3d
│   ├── examples/        # Examples gallery page
│   ├── guides/          # Generated guides
│   └── tutorials/       # Generated tutorial pages, beside the site's index.md
├── scripts/             # Build & generation scripts
│   └── verify/          # URL, visual and example checks (see Verification)
├── src/
│   ├── components/
│   │   ├── Home/        # The three homes (/, /2d, /3d): hero field, stage demo, sections
│   │   ├── Editor/      # Code editor and live preview (see its README)
│   │   ├── ui/          # Design system primitives: Button, Card, Icon sprite, Clay, ...
│   │   └── ...          # Examples, Playground, Tutorial, Blog and page components
│   ├── css/             # Tokens, Infima mapping, fonts, docs reading styles (Sass)
│   ├── data/            # packages.ts and navigation.ts (the shell's menus), static data, generated/ output
│   ├── hooks/           # React hooks
│   ├── motion/          # GSAP setup and motion hooks, for marketing pages only
│   ├── pages/           # Custom pages (/styleguide shows every token and primitive)
│   ├── runtime/         # The editor's import-map runner
│   ├── shell/           # Rail, top nav, search dialog, version menu
│   ├── theme/           # Docusaurus theme overrides (Layout, DocRoot, Footer, ...)
│   └── tutorials/       # Tutorial source files (generated-3d/ is generated)
├── static/              # Static assets (images, fonts, showcase media, example previews)
├── static-pixi/         # Generated: pixi.js example assets
├── static-pixi-3d/      # Generated: 3D example sources and assets, /3d/llms.txt, tutorial thumbnails
├── static-runtime/      # Generated: files the editor's import map loads
├── vendor/              # The vendored @pixi/3d build
├── versioned_docs/      # Snapshotted docs for previous versions
├── docusaurus.config.ts # Docusaurus configuration
└── sidebars.js          # Sidebar navigation
```

## Site Shell

Every page renders inside `src/theme/Layout`: the rail (`src/shell/Rail`), the floating top nav, the search dialog and the footer. Docs pages render their rail from `src/theme/DocRoot/Layout` instead, because only it has the doc sidebar. `<Layout app>` and front matter `app: true` (examples, playground, tutorials) give a full-bleed page with the compact 72 px rail. The shell marks app pages with `data-app-page` and the package with `data-package` on elements it renders, and CSS reads them (`html:has([data-app-page])`). Don't key layout on `<html>` classes from `HtmlClassNameProvider`: react-helmet-async rewrites the class list while hydration runs, and the page would repaint in another layout.

- **Tokens**: `src/css/tokens.scss` (`--px-*`), mapped onto Infima in `infima.scss`. Components read only the tokens.
- **Primitives**: `src/components/ui`. Icons come from the local sprite (`ui/Icon/sprite.tsx`, paths copied from lucide); add a new icon's path there.
- **Motion**: `src/motion` wraps GSAP for the marketing pages. The shell and docs use CSS transitions only, so GSAP stays out of `main.js`. Reduced motion and the "Pause motion" control (`html[data-motion='paused']`) end every CSS animation at once.
- **Budgets**: site-wide CSS ≤ 45 KB gz and `main.js` + runtime ≤ 190 KB gz. Docusaurus puts every CSS module in one site-wide file, so page-specific styles are compiled into the page's own chunk instead (`src/components/*/classes.ts`).

## Content Generation

The site documents whichever `pixi.js` version `package-lock.json` installs; there is no other version setting. `npm run generate:pixi` builds everything derived from that version, and `pretypes`, `prestart`, `prebuild` and `predeploy` run it for you:

- **`sync:repos pixijs`** moves `.repos/pixijs` to the installed version's commit.
- **`generate:docs`** converts pixi's `src/**/__docs__` guides into `docs/guides/{concepts,components,migrations}`, writes the guides sidebar to `src/data/generated/`, and writes pixi's published `llms.txt` to `static/llms.txt` with absolute links. API links point at `pixijs.download/v<version>/docs`.
- **`generate:examples`** converts pixi's `examples/` and `src/**/__docs__/examples`, plus `blog/examples`, into `static/examples/source` and `src/data/generated/examples.json`, and copies pixi's `examples/assets` into `static-pixi/assets`, which is served at `/assets` beside `static/assets`. It fails on a `<PixiExample name>` that doesn't exist, on a `https://pixijs.com/assets/` URL that neither folder has, and on a `static/assets` file that pixi also has.

All of that output is gitignored. `npm run generate` runs it, then `generate:pixi-3d` (see [PixiJS 3D](#pixijs-3d)), then **`generate:runtime`**, which writes the editor's import map to `src/data/generated/runtime.json` and the files it loads (pixi.js subpath modules and the vendored `@pixi/3d` CDN build) to `static-runtime/`, then **`generate:content`**, which converts tutorial source files into Docusaurus docs.

**`generate:sponsors`** fetches sponsor data into `src/data/sponsors.json`. It needs secrets (see below), so `generate` doesn't run it; the file is committed and refreshed daily by the "Update sponsors" workflow.

After a build, `scripts/docusaurus-plugin-markdown-pages.ts` writes a markdown copy of every v8 and 3D guide beside its page (`/8.x/guides/concepts/architecture.md`, `/3d/guides/getting-started/intro.md`), with examples inlined and links made absolute, for LLMs.

### Where to edit

- **Generated from pixi.js:** the v8 concepts, components and migrations guides, the examples gallery and the assets they share, the guides sidebar order and `llms.txt`. Edit them upstream in [pixijs/pixijs](https://github.com/pixijs/pixijs) (`src/**/__docs__/`, `examples/`, `examples/assets/`); the change reaches this site with the next synced release.
- **Generated from pixi-3d:** the 3D guides, examples, example assets, tutorials and `/3d/llms.txt`. Edit them in pixijs/pixi-3d (`src/**/__docs__/`, `examples/site/`, `tutorials/`); the change reaches this site with the next vendored build.
- **Site-owned:** `docs/guides/getting-started`, `docs/guides/third-party`, `docs-3d/examples/index.mdx`, `docs-3d/tutorials/index.md`, `blog/examples`, `static/examples/previews` (3D previews in `3d/`) and the `static/assets` that pixi doesn't have.

## PixiJS 3D

The 3D docs are a second docs instance (`docs-3d/`, served under `/3d`). `npm run generate:pixi-3d` builds their content from `.repos/pixi-3d`, and `generate`, `pretypes`, `prestart`, `prebuild` and `predeploy` run it for you:

- **`sync:repos pixi-3d`** moves `.repos/pixi-3d` to the commit the installed `@pixi/3d` was built from.
- **`pixi-docs.mts 3d`** converts pixi-3d's guides into `docs-3d/guides/` and its tutorials into `docs-3d/tutorials/` and `src/tutorials/generated-3d/`, and writes the guides sidebar and `static-pixi-3d/3d/llms.txt`. The 3D API reference isn't hosted yet, so `{@link}` tags render as code.
- **`examples.mts 3d`** converts `examples/site/` and the guides' hidden snippets into `static-pixi-3d/examples/source/3d/` and `src/data/generated/examples-3d.json`, and copies `examples/site/assets/` to `static-pixi-3d/assets/3d/`, which is served at `/assets/3d`.

Each package writes only its own folders, so running one never deletes the other's output. `scripts/libraries.mts` holds everything package-specific, including the URL of every 3D guide.

### Vendored build

Until `@pixi/3d` is on npm, the site installs `vendor/pixi-3d.tgz` (`"@pixi/3d": "file:vendor/pixi-3d.tgz"`), built from a pixi-3d commit with source maps stripped. The tarball's `package.json` records that commit as `gitHead`, which pins `.repos/pixi-3d` and names the editor's copy in `static-runtime/pixi-3d/<version>-<sha7>/`. To update it from a clean pixi-3d checkout with its dependencies installed:

```bash
npm run vendor:pixi-3d -- ../pixi-3d   # builds it, writes the tarball and updates package-lock.json
npm run generate:pixi-3d
npm run generate:example-previews -- --pkg 3d --missing
```

Then commit `vendor/pixi-3d.tgz`, `package-lock.json` and the new previews. For a commit that isn't pushed, run the generate step with `PIXI_3D_REPO=../pixi-3d` so `sync:repos` fetches it from the checkout instead of GitHub. `.github/workflows/sync-pixi-3d.yml` does all of this daily from pixi-3d's `main` (or a branch, tag or commit given to it) and opens a `sync/pixi-3d` PR when the commit changed.

When `@pixi/3d` is published, run `npm install @pixi/3d@^<version>`, delete `vendor/`, `scripts/vendor-pixi-3d.mts`, the `vendor:pixi-3d` script and `sync-pixi-3d.yml`, and let `sync-pixi.yml` bump it. `sync:repos` and `generate:runtime` switch to npm and jsDelivr on their own.

### Without access to pixi-3d

pixi-3d is private. `sync:repos` authenticates with `PIXI_3D_TOKEN` when it's set and with your own git credentials otherwise (`gh auth setup-git`). Without access it warns and leaves `.repos/pixi-3d` out, and the generators publish three placeholder getting-started guides, an empty 3D gallery and no 3D tutorials, so the build still passes. Fork PRs build this way. With `PIXI_3D_REQUIRED=1` it fails instead; deploys and the sync workflows set it. The placeholders go away when pixi-3d is public.

## Release Sync

`.github/workflows/sync-pixi.yml` keeps the site on the latest stable pixi.js. It runs when pixi's release workflow sends a `pixi-release` dispatch, daily at 06:00 UTC as a fallback, and from the Actions tab with an optional version. When the target is newer than the installed version, it:

1. installs it, regenerates, and runs types, lint and a full build;
2. captures previews for examples that don't have one;
3. opens or updates a PR from the `sync/pixi` branch with `package.json`, `package-lock.json` and the new previews, listing generator warnings in the body.

A maintainer reviews and merges it, and the merge deploys. Workflow-opened PRs don't trigger `pr.yml`, so the sync job runs the checks itself. It needs the repo setting "Allow GitHub Actions to create and approve pull requests".

To sync by hand, run `npm install pixi.js@^X.Y.Z`, `npm run generate:pixi` and `npm run generate:example-previews -- --missing`, then commit `package*.json` and the new previews.

`sync-pixi-3d.yml` does the same for the vendored `@pixi/3d`; see [Vendored build](#vendored-build).

## Reference Source

`npm run sync:repos` checks out the source of the libraries the site documents into the gitignored `.repos/` folder, for the generators and for reading while you work: `.repos/pixijs`, `.repos/filters` and `.repos/pixi-3d`, each at the commit its installed version was built from. Run it again after upgrading a package to move the checkout. `referenceRepos` in `scripts/sync-repos.mts` lists them. In a worktree, it copies from the main checkout without the network when that's at the same version.

## Environment Variables

`npm run generate:sponsors` reads `SPONSORKIT_GITHUB_TOKEN`, `SPONSORKIT_GITHUB_LOGIN`, `SPONSORKIT_OPENCOLLECTIVE_SLUG` and `SPONSORKIT_OPENCOLLECTIVE_KEY` from a `.env` file at the project root. Nothing else needs them.

`npm run sync:repos` reads three variables for pixi-3d:

- `PIXI_3D_TOKEN`: a token with read access to the contents of pixijs/pixi-3d. CI sets it from the `PIXI_3D_TOKEN` secret.
- `PIXI_3D_REQUIRED=1`: fail when pixi-3d can't be read, instead of publishing placeholder 3D guides.
- `PIXI_3D_REPO=<path>`: fetch pixi-3d from a local checkout, for commits that aren't pushed.

## Verification

Build and serve the site first (`npm run build`, then `npm run serve -- --port 3102`), and install the browser once with `npx playwright install chromium`.

- `node scripts/verify/urls.mjs scripts/verify/url-baseline.txt build` checks that every URL the site served before the redesign is still a page or a redirect to one. It must print `0 missing, 0 dangling`.
- `node scripts/verify/visual.mjs --base http://localhost:3102` screenshots every route at nine viewports in both themes and checks overflow, tap targets, one `h1`, fonts, the pill nav and clay overlaps. `--only guides,blog` narrows the routes, `--only /,/2d --exact` takes exact routes, `--viewports package` uses five sizes, and `--perf`, `--axe`, `--motion`, `--no-webgl` and `--focus` add checks. Screenshots go to a temp folder unless `--out` is given.
- `node scripts/verify/examples.mjs --pkg 2d` runs every example through the editor's runtime and checks that it draws; `--pkg v7`, `--pkg 3d` and `--pkg scenes` cover the rest.

## Versioned Documentation

Docs are versioned with Docusaurus' built-in versioning. The current (latest) docs live in `docs/`, while previous version snapshots are stored under `versioned_docs/` and `versioned_sidebars/`. Tracked versions are listed in `versions.json`.

## Linting & Formatting

- **ESLint** — flat config in `eslint.config.mjs` (TypeScript-ESLint + Prettier integration).
- **Prettier** — config in `.prettierrc` (single quotes, 120 print width, 2-space indent).
- **Husky + lint-staged** — pre-commit hooks auto-lint staged files.

## Contributing to the Showcase

We love seeing what the community creates with PixiJS! If you've built something cool and want to share it with the world, you can add your project to our showcase by following the [contribution guidelines](.github/SHOWCASE.md).

## Links

- [PixiJS GitHub](https://github.com/pixijs/pixijs)
- [PixiJS Website](https://pixijs.com)
- [Docusaurus Documentation](https://docusaurus.io/docs)
