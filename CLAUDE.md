# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official PixiJS documentation website built with Docusaurus 3.9.x. It serves guides, tutorials, examples, and a playground for the PixiJS graphics library.

## Commands

```bash
npm i                    # Install dependencies (runs patch-package postinstall)
npm start                # Start dev server (auto-runs generate first)
npm run build            # Build production site (auto-runs generate first)
npm run lint             # Run ESLint with max-warnings=0
npm run lint:fix         # Fix ESLint errors
npm run types            # TypeScript type checking
npm run generate         # Run all generation scripts
npm run update-version   # Update PixiJS version (interactive)
```

Requires Node.js 24+.

## Architecture

### Content Generation

The site uses several scripts that auto-run before `start` and `build`:

- **`generate:examples`** - Compiles TypeScript examples from `docs/examples/` to `static/examples/source/`, generates `src/data/examples.json`
- **`generate:content`** - Generates tutorial markdown files in `docs/tutorials/` from JavaScript source in `src/tutorials/`
- **`generate:sponsors`** - Fetches sponsor data from GitHub/OpenCollective into `src/data/sponsors.json` (requires env vars)
- **`generate:definitions`** - Fetches PixiJS type definitions into `src/data/pixi.js.md` for editor intellisense

### Version Management

- `pixi-versions.json` - Supported PixiJS versions (v7.x, v8.x)
- `docs/pixi-version.json` - Current documentation version
- Tutorials in `src/tutorials/` are versioned by semver (e.g., `v7.0.0/`, `v8.0.0/`)
- Docusaurus versions in `versioned_docs/` (currently only v7.x archive)

### Key Directories

- `docs/` - Source documentation (guides, examples, tutorials, playground)
- `src/components/` - React components (Editor, Examples, Playground, Tutorial, Homepage)
- `src/pages/` - Custom pages (showcase, sponsor, team, versions)
- `src/data/` - Generated JSON data files
- `src/tutorials/` - Tutorial JavaScript source with `tutorialsData.json` per version
- `src/theme/` - Docusaurus theme overrides (swizzled components)
- `scripts/` - Build and generation scripts
- `static/` - Static assets including showcase images

### Examples Format

Examples in `docs/examples/` can be single JS files or directories with multiple files:

```javascript
// dependencies: {"gsap": "^3.12.0"}
// description: Example showing animation with GSAP

import { Application } from 'pixi.js';
// ... example code
```

Dependencies and descriptions are extracted during generation.

### Tutorials

Tutorials are JavaScript-based with step-by-step code. Each tutorial directory in `src/tutorials/v8.0.0/` (e.g., `gettingStarted/`, `fishPond/`) contains code that gets rendered by the `Tutorial` component. The `tutorialsData.json` defines the tutorial order.

### Editor Components

The site has two editor implementations:
- **Monaco** - Full VS Code editor with PixiJS type definitions
- **Sandpack** - CodeSandbox-based editor for examples

Both are in `src/components/Editor/` with shared defaults in `defaults/`.

## Docusaurus Configuration

- Uses rspack bundler (via `@docusaurus/faster`)
- SCSS styling via `docusaurus-plugin-sass`
- Local search via `@easyops-cn/docusaurus-search-local`
- Client redirects for old URL structure
- Custom LLM docs generation plugin at `scripts/docusaurus-plugin-llms-txt-replace.ts`

## Contributing to Showcase

Showcase images go in `static/showcase/` (720×405px, max 200KB). Update `src/data/showcase.ts` with the entry. See `.github/SHOWCASE.md` for full guidelines.
