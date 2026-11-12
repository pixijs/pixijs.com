# Editor

The code editor and live preview used by `<PixiExample>`, the example galleries, the playground and the tutorials. It runs code on the import-map runtime in `src/runtime` (see `scripts/runtime.mts` for the import map), not on a bundler service.

- `Editor.tsx`: the component. A new `files` prop starts over; edits come back through `onFilesChange`. `resizable` adds the divider between code and preview (`SplitHandle.tsx`).
- `LazyEditor.tsx`, `ExampleEditor.tsx`: entry points that load the editor chunk only when they render in the browser. Import these, never `Editor.tsx` directly from a page.
- `CodeEditor.tsx`: Monaco from jsDelivr, with one model per file. Starting it is a long main-thread task, so it loads when the page is idle after the preview's first run, or straight away when the reader taps the code, asks for an error's line or formats. `CodePreview.tsx` shows the code highlighted by Prism until then, or for good if Monaco fails to load.
- `Runner/`: the preview frames, console and error card.
- `Monaco/`: themes built from the site's code colours (`src/theme/prism/pixi.ts`), GLSL, and the pixi.js and `@pixi/3d` declarations.
- `export.ts`: Open in StackBlitz and Download HTML, both with the runtime's import map.
- `styles.scss`: inlined with the editor chunk (`classes.ts`) so it stays out of the site-wide stylesheet.

The preview frames are sandboxed without `allow-same-origin`, so they have an opaque origin: `/runtime/**` and `/pixi-3d/**` load cross-origin and need `Access-Control-Allow-Origin`. GitHub Pages and the Docusaurus dev server send it; `docusaurus serve` sends it through `patches/@docusaurus+core+*.patch`. User code can't use `localStorage`, IndexedDB or cookies. Off `https://pixijs.com` (local, served and preview builds) the runner points the examples' `https://pixijs.com/assets/` URLs at the page's own origin, so they load the assets the build ships.

If Sandpack is ever brought back: it picks Babel 6.26 unless `package.json` has a `typescript` devDependency, and Babel 6 rejects `@pixi/3d`'s syntax (class fields, `??`, `?.`).
