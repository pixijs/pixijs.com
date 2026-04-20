# PixiJS Website

The official [pixijs.com](https://pixijs.com) website — home to the PixiJS documentation, guides, examples, blog, playground, and project showcase. Built with [Docusaurus 3](https://docusaurus.io/).

## Prerequisites

- [Node.js](https://nodejs.org/) **v24+** (see `.nvmrc`)
- npm (ships with Node)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (uses the dev version of PixiJS docs)
npm start
```

The site will be available at `http://localhost:3000`.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the local dev server (`PIXI_VERSION=dev`) |
| `npm run build` | Production build (runs content generation first) |
| `npm run serve` | Serve the production build locally |
| `npm run generate` | Run all content generators (examples, tutorials, sponsors, definitions) |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run types` | Type-check with TypeScript (no emit) |
| `npm run clear` | Clear the Docusaurus cache |
| `npm run update-version` | Update the tracked PixiJS version |

## Project Structure

```
├── blog/                # Blog posts (MDX/Markdown)
├── docs/                # Documentation source
│   ├── examples/        # Interactive examples
│   ├── guides/          # Guides & tutorials
│   ├── inline-examples/ # Inline code examples
│   └── playground/      # Playground page content
├── scripts/             # Build & generation scripts
├── src/
│   ├── components/      # React components
│   ├── css/             # Stylesheets (Sass)
│   ├── data/            # Static data (showcase, sponsors, etc.)
│   ├── hooks/           # React hooks
│   ├── pages/           # Custom pages
│   ├── theme/           # Docusaurus theme overrides
│   └── tutorials/       # Tutorial source files
├── static/              # Static assets (images, fonts, showcase media)
├── versioned_docs/      # Snapshotted docs for previous versions
├── docusaurus.config.ts # Docusaurus configuration
├── sidebars.js          # Sidebar navigation
└── pixi-versions.json   # Tracked PixiJS release metadata
```

## Content Generation

Several content types are generated from external sources before the site builds. The umbrella command is:

```bash
npm run generate
```

This runs the following sub-generators:

- **`generate:content`** — Converts tutorial source files into Docusaurus docs.
- **`generate:examples`** — Pulls interactive example configs for the examples section.
- **`generate:sponsors`** — Fetches sponsor data for display on the site.
- **`generate:definitions`** — Generates API definition data from PixiJS source.

Generation runs automatically before `npm start` and `npm run build` via the `prestart` / `prebuild` hooks.

## Environment Variables

The site reads configuration from a `.env` file at the project root. Notable variables:

- `PIXI_VERSION` — The PixiJS version to build docs against (defaults to `dev`).

Refer to `docusaurus.config.ts` → `customFields` for usage.

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
