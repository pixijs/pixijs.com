import llmPlugin from 'docusaurus-plugin-llms';
import * as fs from 'fs/promises';
import * as path from 'path';
import prettier from 'prettier';

import type { PluginOptions } from 'docusaurus-plugin-llms';
import type { LoadContext, Plugin } from '@docusaurus/types';

async function processFile(filePath: string): Promise<void> {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  let output = '';

  for (const line of lines) {
    if (line.includes('import { EmbeddedEditor } from') || line.includes("from '!!raw-loader")) {
      continue;
    }

    if (line.includes('embedded:@site')) {
      const match = line.match(/embedded:@site\/(.+?)(\s|$)/);

      if (match) {
        const embeddedPath = match[1];

        try {
          const embeddedContent = await fs.readFile(path.join(process.cwd(), embeddedPath), 'utf-8');

          output += `\`\`\`ts\n${embeddedContent}\n\`\`\`\n`;
        } catch (_err) {
          console.warn(`Could not read embedded file: ${embeddedPath}`);
          output += `${line}\n`;
        }
      }
    } else {
      output += `${line}\n`;
    }
  }

  const formatted = await prettier.format(output, {
    parser: 'mdx',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
  });

  await fs.writeFile(filePath, formatted);
}

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const markdownFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      markdownFiles.push(...(await findMarkdownFiles(fullPath)));
    } else if (file.name.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

export default function pluginEmbeddedCode(context: LoadContext, options: PluginOptions = {}): Plugin<void> {
  const llm = llmPlugin(context, options);

  return {
    name: 'docusaurus-plugin-llms-txt-replace',
    async postBuild(context) {
      await llm.postBuild!(context);

      try {
        // Process llms-full.txt
        const llmsPath = path.join(context.outDir, 'llms-full.txt');

        if (
          await fs
            .access(llmsPath)
            .then(() => true)
            .catch(() => false)
        ) {
          console.log('Processing llms-full.txt...');
          await processFile(llmsPath);
        }

        // Process all .md files in 8.x directory
        const docsDir = path.join(context.outDir, '8.x');

        if (
          await fs
            .access(docsDir)
            .then(() => true)
            .catch(() => false)
        ) {
          console.log('Processing markdown files in 8.x directory...');
          const markdownFiles = await findMarkdownFiles(docsDir);

          for (const file of markdownFiles) {
            await processFile(file);
          }
        }

        console.log('Embedded code processing complete!');
      } catch (error) {
        console.error('Error processing embedded code:', error);
        throw error;
      }
    },
  };
}
