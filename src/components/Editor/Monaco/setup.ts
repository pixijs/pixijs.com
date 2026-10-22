import { loader, type Monaco } from '@monaco-editor/react';
import { registerGLSL } from './glsl';
import { definePixiThemes } from './theme';
import { runtimeTypes } from '@site/src/runtime/registry';

const SHADER_MODULES = ['wgsl', 'vert', 'frag', 'glsl', 'txt']
  .map((ext) => `declare module '*.${ext}' {\n  const source: string;\n  export default source;\n}`)
  .join('\n');

let ready: Promise<Monaco> | undefined;
const typesLoaded = new Map<string, Promise<void>>();

function addLib(monaco: Monaco, code: string, path: string) {
  const { typescriptDefaults, javascriptDefaults } = monaco.languages.typescript;

  typescriptDefaults.addExtraLib(code, path);
  javascriptDefaults.addExtraLib(code, path);
}

/**
 * Loads Monaco once per page (from jsDelivr, through `@monaco-editor/loader`) and sets it up for PixiJS: the
 * `pixi-light`/`pixi-dark` themes, GLSL, shader imports as strings and compiler options that resolve
 * `node_modules/@pixi/3d` the way a bundler would
 */
export function loadMonaco(): Promise<Monaco> {
  ready ??= Promise.all([loader.init(), document.fonts.ready]).then(async ([monaco]) => {
    const { typescript } = monaco.languages;
    const options = {
      target: typescript.ScriptTarget.ESNext,
      module: typescript.ModuleKind.ESNext,
      moduleResolution: typescript.ModuleResolutionKind.NodeJs,
      allowNonTsExtensions: true,
      allowJs: true,
      lib: ['esnext', 'dom'],
    };

    typescript.typescriptDefaults.setCompilerOptions(options);
    typescript.javascriptDefaults.setCompilerOptions(options);
    addLib(monaco, SHADER_MODULES, 'file:///node_modules/@types/shaders/index.d.ts');
    definePixiThemes(monaco);
    registerGLSL(monaco);
    // The JS and TS colourers load lazily; waiting for them keeps the editor from showing a frame of uncoloured code
    await Promise.all(['javascript', 'typescript'].map((language) => monaco.editor.colorize('', language, {})));

    return monaco;
  });
  ready.catch(() => (ready = undefined));

  return ready;
}

/** Whether something on the page has already started loading Monaco, so another editor needn't wait to ask */
export const monacoRequested = () => ready !== undefined;

function loadOnce(key: string, load: () => Promise<void>) {
  if (!typesLoaded.has(key)) {
    typesLoaded.set(
      key,
      load().catch((error: unknown) => {
        typesLoaded.delete(key);
        console.warn(`Editor: couldn't load types for ${key}`, error);
      }),
    );
  }
}

async function fetchOk(url: string): Promise<Response> {
  const response = await fetch(url);

  if (!response.ok) throw new Error(`${response.status} ${url}`);

  return response;
}

/**
 * Adds the declarations the code needs: pixi.js's bundled `.d.ts` for the page's version (pixi.js 8 only; 7 ships
 * none), and `@pixi/3d`'s declaration tree when `with3d` is set. HTTP caching keeps repeat visits cheap.
 * @param monaco - The loaded Monaco
 * @param pixiVersion - The pixi.js version the code runs against
 * @param with3d - Whether to add `@pixi/3d`
 */
export function loadTypes(monaco: Monaco, pixiVersion: string, with3d: boolean) {
  const pixiUrl = runtimeTypes[`pixi.js@${pixiVersion}`];

  if (pixiUrl) {
    loadOnce(pixiUrl, async () => {
      const types = await (await fetchOk(pixiUrl)).text();

      addLib(monaco, `declare module 'pixi.js' {\n${types}\n}`, 'file:///node_modules/pixi.js/index.d.ts');
    });
  }

  const url3d = runtimeTypes['@pixi/3d'];

  if (with3d && url3d) {
    loadOnce(url3d, async () => {
      const files: Record<string, string> = await (await fetchOk(url3d)).json();

      for (const [path, code] of Object.entries(files)) addLib(monaco, code, `file:///node_modules/@pixi/3d/${path}`);
    });
  }
}
