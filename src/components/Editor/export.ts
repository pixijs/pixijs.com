import { compile, type SourceFiles } from '@site/src/runtime/compile';
import { scriptJson } from '@site/src/runtime/frame';
import { importMap, type RuntimeMajor } from '@site/src/runtime/registry';

export interface ExportOptions {
  files: SourceFiles;
  entry: string;
  major: RuntimeMajor;
  dependencies?: Record<string, string>;
  /** Project title and file name */
  name: string;
}

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

/** A page that runs `script` with the same import map as the site's runner, so it works anywhere, 3D included */
function page(name: string, imports: string[], { major, dependencies }: ExportOptions, script: string) {
  const map = scriptJson({ imports: importMap(major, imports, dependencies) }, 2);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(name)}</title>
    <style>
      body { margin: 0; overflow: hidden; }
    </style>
    <script type="importmap">
${map}
    </script>
  </head>
  <body>
    ${script}
  </body>
</html>
`;
}

/** Opens the code as a static StackBlitz project: real files (`wave.frag` becomes `wave.frag.js`) and an index.html */
export async function openInStackBlitz(options: ExportOptions) {
  const [{ default: sdk }, compiled] = await Promise.all([
    import('@stackblitz/sdk'),
    compile(options.files, options.entry, { link: 'relative' }),
  ]);
  const files = Object.fromEntries(compiled.modules);

  files['index.html'] = page(
    options.name,
    compiled.imports,
    options,
    `<script type="module" src="./${compiled.entryUrl}"></script>`,
  );
  sdk.openProject(
    { title: options.name, description: 'Made with PixiJS', template: 'html', files },
    { newWindow: true, openFile: compiled.entryUrl },
  );
}

/** Saves the code as one self-contained HTML file */
export async function downloadHtml(options: ExportOptions) {
  const compiled = await compile(options.files, options.entry);
  const html = page(
    options.name,
    compiled.imports,
    options,
    `<script type="module">import ${JSON.stringify(compiled.entryUrl)};</script>`,
  );
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: `${options.name}.html` });

  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
