import * as fs from 'fs/promises';
import { createRequire } from 'module';
import * as path from 'path';

import type { LoadedContent } from '@docusaurus/plugin-content-docs';
import type { LoadContext, Plugin } from '@docusaurus/types';
import type { Item } from '../src/components/Examples/types';
import { LIBRARIES } from './libraries.mts';
import { maskCode, PIXI_EXAMPLE } from './shared.mts';

interface Page {
  file: string;
  permalink: string;
  title: string;
  /** URL path of the docs version, such as `/8.x` */
  versionPath: string;
  /** Folder the version's docs are read from */
  contentPath: string;
}

/**
 * A docs plugin instance per library, with the example data its guides' `<PixiExample>` tags resolve against and the
 * folder the examples' file `location`s are relative to. A stubbed library may have no guides.
 */
const INSTANCES = Object.values(LIBRARIES).map((library) => ({
  pluginId: library.id === '2d' ? 'default' : library.id,
  examples: library.examples.data,
  sources: library.examples.source,
  optional: !!library.stub,
}));
const FRONT_MATTER = /^---\n[\s\S]*?\n---\n/;
/** The blog plugin's loader that cuts `?truncated` posts at its marker, and a marker at the end of the front matter */
const BLOG_TRUNCATE_LOADER = createRequire(import.meta.url).resolve(
  '@docusaurus/plugin-content-blog/lib/markdownLoader.js',
);
const AFTER_FRONT_MATTER = /(?<=^---\r?\n[\s\S]*?\r?\n---\r?\n)/;
const LINK_TARGET = /\]\(([^)\s]+)\)/g;
/** A Docusaurus admonition: `:::type`, `:::type[Title]` or `:::type Title`, its body, and the closing `:::` */
const ADMONITION = /^([ \t]*):::(\w+)(?:\[([^\]\n]*)\]|[ \t]+([^\n]*))?\n([\s\S]*?)^[ \t]*:::[ \t]*$/gm;
/** GitHub alert types, which Markdown readers know, for the admonition types */
const ALERT: Record<string, string> = {
  tip: 'TIP',
  important: 'IMPORTANT',
  warning: 'WARNING',
  caution: 'CAUTION',
  danger: 'CAUTION',
};
const FENCE_LANG: Record<string, string> = {
  '.js': 'js',
  '.ts': 'ts',
  '.frag': 'glsl',
  '.vert': 'glsl',
  '.wgsl': 'wgsl',
};

/**
 * Publishes `<page>.md` beside each instance's guide pages, with examples inlined and links made absolute, for LLMs.
 * Also keeps the blog's list pages light (see `configureWebpack`).
 */
export default function pluginMarkdownPages(context: LoadContext): Plugin {
  const { siteDir, siteConfig } = context;
  let pages: Page[] = [];

  return {
    name: 'docusaurus-plugin-markdown-pages',

    /**
     * The blog's list, tag and author pages load every post as a `?truncated` MDX module, though their cards only use
     * the post's metadata. The blog's truncating loader runs first, cutting at the end of the front matter, so those
     * modules carry no post text or imports. (Rspack's persistent cache doesn't see changes here; `npm run clear`.)
     */
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.mdx?$/,
              include: path.join(siteDir, 'blog'),
              resourceQuery: /truncated=true/,
              enforce: 'pre',
              use: [{ loader: BLOG_TRUNCATE_LOADER, options: { truncateMarker: AFTER_FRONT_MATTER } }],
            },
          ],
        },
      };
    },

    allContentLoaded({ allContent }) {
      const docsPlugins = allContent['docusaurus-plugin-content-docs'] ?? {};

      pages = INSTANCES.flatMap((instance) => {
        const docs = docsPlugins[instance.pluginId] as LoadedContent | undefined;
        const current = docs?.loadedVersions.find((version) => version.versionName === 'current');
        const prefix = `${current?.path ?? ''}/guides/`;
        const found = (current?.docs ?? [])
          .filter((doc) => doc.permalink.startsWith(prefix))
          .map((doc) => ({
            file: path.join(siteDir, doc.source.replace(/^@site\//, '')),
            permalink: doc.permalink.replace(/\/$/, ''),
            title: doc.title,
            versionPath: current!.path,
            contentPath: current!.contentPath,
          }));

        if (!found.length && !instance.optional) {
          throw new Error(`[markdown-pages] no docs under ${prefix} in docs instance ${instance.pluginId}`);
        }

        return found;
      });
    },

    async postBuild({ outDir }) {
      const examples = new Map<string, { example: Item; sources: string }>();

      for (const instance of INSTANCES) {
        const data = await fs.readFile(path.join(siteDir, instance.examples), 'utf8');

        for (const example of JSON.parse(data) as Item[]) {
          examples.set(`${example.pkg}:${example.name}`, { example, sources: path.join(siteDir, instance.sources) });
        }
      }
      const pagesByFile = new Map(pages.map((page) => [page.file, page]));
      const assets = new Map<string, string>();

      const exampleCode = async (name: string, pkg: string): Promise<string> => {
        const entry = examples.get(`${pkg}:${name}`);

        if (!entry) throw new Error(`<PixiExample pkg="${pkg}" name="${name}"> isn't in the example data`);

        const files = [...entry.example.files].sort(
          (a, b) => Number(b.name === 'index.js') - Number(a.name === 'index.js'),
        );
        const blocks = await Promise.all(
          files.map(async (file) => {
            const code = await fs.readFile(path.join(entry.sources, file.location), 'utf8');
            const header = files.length > 1 ? `// ${file.name}\n` : '';

            return `\`\`\`${FENCE_LANG[path.extname(file.name)] ?? ''}\n${header}${code.trim()}\n\`\`\``;
          }),
        );

        return blocks.join('\n\n');
      };

      const resolveLink = (page: Page, target: string): string => {
        if (target.startsWith('/')) return `${siteConfig.url}${target}`;
        if (!target.startsWith('./') && !target.startsWith('../')) return target;

        const [file, anchor] = target.split('#');
        const absolute = path.resolve(path.dirname(page.file), decodeURI(file));
        const linked = pagesByFile.get(absolute);

        if (linked) return `${siteConfig.url}${linked.permalink}.md${anchor ? `#${anchor}` : ''}`;

        const published = `${page.versionPath}/${path.relative(page.contentPath, absolute).split(path.sep).join('/')}`;

        assets.set(path.join(outDir, published), absolute);

        return `${siteConfig.url}${published}`;
      };

      const toMarkdown = async (page: Page): Promise<string> => {
        const source = (await fs.readFile(page.file, 'utf8')).replace(/\r\n/g, '\n').replace(FRONT_MATTER, '');
        const code = maskCode(source);
        let text = code.text.replace(LINK_TARGET, (_, target: string) => `](${resolveLink(page, target)})`);

        for (const [tag, name, pkg = '2d'] of text.matchAll(PIXI_EXAMPLE)) {
          const replacement = await exampleCode(name, pkg);

          text = text.replace(tag, () => replacement);
        }

        text = code
          .restore(text)
          .replace(ADMONITION, (_, indent: string, type: string, bracketed?: string, inline?: string, body = '') => {
            const alert = ALERT[type] ?? 'NOTE';
            const title = (bracketed ?? inline)?.trim();
            const lines = [`[!${alert}]`, ...(title && title.toUpperCase() !== alert ? [`**${title}**`, ''] : [])];

            lines.push(...body.trim().split('\n'));

            return lines.map((line) => `${indent}>${line.trim() ? ` ${line.trimEnd()}` : ''}`).join('\n');
          })
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        return `${text.startsWith('# ') ? '' : `# ${page.title}\n\n`}${text}\n`;
      };

      await Promise.all(
        pages.map(async (page) => {
          const output = path.join(outDir, `${page.permalink}.md`);

          await fs.mkdir(path.dirname(output), { recursive: true });
          await fs.writeFile(output, await toMarkdown(page));
        }),
      );
      await Promise.all(
        [...assets].map(async ([output, file]) => {
          await fs.mkdir(path.dirname(output), { recursive: true });
          await fs.copyFile(file, output);
        }),
      );

      console.log(`[markdown-pages] wrote ${pages.length} pages and ${assets.size} assets`);
    },
  };
}
