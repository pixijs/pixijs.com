import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

interface ExampleFile {
  name: string;
  location: string;
}

interface Example {
  name: string;
  description: string;
  dependencies: Record<string, string>;
  files: ExampleFile[];
}

async function getDependenciesFromFile(filePath: string): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const dependencyMatch = content.match(/\/\/\s*dependencies:\s*({[^}]+})/);

    if (dependencyMatch) {
      // Parse the dependencies object from the comment
      return JSON.parse(dependencyMatch[1]);
    }
  } catch (_error) {
    console.warn(`Warning: Could not read dependencies from ${filePath}`);
  }

  return {};
}

async function getDescriptionFromFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const descriptionMatch = content.match(/\/\/\s*description:\s*(.*)/);

    if (descriptionMatch) {
      // Return the description after stripping leading/trailing whitespace
      return descriptionMatch[1].trim();
    }
  } catch (_error) {
    console.warn(`Warning: Could not read description from ${filePath}`);
  }

  return '';
}

const SHARED_DIR = 'shared';

async function getSharedFiles(sourcePath: string): Promise<Map<string, string>> {
  const sharedDir = path.join(sourcePath, SHARED_DIR);
  const sharedFiles = new Map<string, string>();

  try {
    const entries = await fs.readdir(sharedDir);

    for (const entry of entries) {
      const fullPath = path.join(sharedDir, entry);
      const stat = await fs.stat(fullPath);

      if (stat.isFile()) {
        sharedFiles.set(entry, fullPath);
      }
    }
  } catch {
    // No shared directory
  }

  return sharedFiles;
}

async function resolveSharedImports(compiledDirPath: string, sharedFiles: Map<string, string>): Promise<void> {
  const sharedImportRegex = /(['"])\.\.\/(shared\/([^'"]+))\1/g;
  const entries = await fs.readdir(compiledDirPath);
  const filesToCopy = new Set<string>();

  for (const entry of entries) {
    if (!entry.endsWith('.js') && !entry.endsWith('.ts')) continue;

    const filePath = path.join(compiledDirPath, entry);
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    content = content.replace(sharedImportRegex, (match, quote, _fullPath, relativeName) => {
      const baseName = path.basename(relativeName);
      const withExt = path.extname(baseName) ? baseName : `${baseName}.js`;

      if (sharedFiles.has(withExt)) {
        filesToCopy.add(withExt);
        modified = true;
        return `${quote}./${relativeName.replace(/^.*\//, '')}${quote}`;
      }

      return match;
    });

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  // Transitively resolve imports between shared files
  const localImportRegex = /(['"])\.\/(([^'"]+))\1/g;
  const resolved = new Set<string>();
  const pending = [...filesToCopy];

  while (pending.length > 0) {
    const fileName = pending.pop()!;
    if (resolved.has(fileName)) continue;
    resolved.add(fileName);

    const sourcePath = sharedFiles.get(fileName)!;
    const content = await fs.readFile(sourcePath, 'utf-8');

    for (const match of content.matchAll(localImportRegex)) {
      const importName = match[2];
      const baseName = path.basename(importName);
      const withExt = path.extname(baseName) ? baseName : `${baseName}.js`;

      if (sharedFiles.has(withExt) && !filesToCopy.has(withExt)) {
        filesToCopy.add(withExt);
        pending.push(withExt);
      }
    }
  }

  for (const fileName of filesToCopy) {
    await fs.copyFile(sharedFiles.get(fileName)!, path.join(compiledDirPath, fileName));
  }
}

async function generateExampleConfig(basePath: string): Promise<Example[]> {
  const examples: Example[] = [];
  const entries = await fs.readdir(basePath);

  for (const entry of entries) {
    if (entry === SHARED_DIR) continue;

    const fullPath = path.join(basePath, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const files = await fs.readdir(fullPath);
      const exampleFiles: ExampleFile[] = [];

      for (const file of files) {
        exampleFiles.push({
          name: file,
          location: `${entry}/${file}`,
        });
      }

      const dependencies = fullPath.endsWith('.ts')
        ? await getDependenciesFromFile(path.join(fullPath, 'index.ts'))
        : (await getDependenciesFromFile(path.join(fullPath, 'index.js'))) || {};
      const description = fullPath.endsWith('.ts')
        ? await getDescriptionFromFile(path.join(fullPath, 'index.ts'))
        : (await getDescriptionFromFile(path.join(fullPath, 'index.js'))) || '';

      examples.push({
        name: entry,
        dependencies,
        description,
        files: exampleFiles,
      });
    } else if (stat.isFile() && (entry.endsWith('.ts') || entry.endsWith('.js'))) {
      const name = path.parse(entry).name;
      const dependencies = await getDependenciesFromFile(fullPath);
      const description = await getDescriptionFromFile(fullPath);

      examples.push({
        name,
        description,
        dependencies,
        files: [
          {
            name: 'index.js',
            location: entry,
          },
        ],
      });
    }
  }

  return examples;
}

async function compileTypeScript(filePath: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tsc = spawn('npx', [
      'tsc',
      filePath,
      '--target',
      'ES2020',
      '--module',
      'ES2020',
      '--moduleResolution',
      'node',
      '--esModuleInterop',
      '--jsx',
      'react',
      '--outDir',
      outPath,
      '--skipLibCheck',
    ]);

    tsc.stdout.on('data', (data) => console.log(`tsc: ${data}`));
    tsc.stderr.on('data', (data) => console.error(`tsc error: ${data}`));
    tsc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`TypeScript compilation failed with code ${code}`));
    });
  });
}

async function compileDirectory(
  sourcePath: string,
  outPath: string,
  sharedFiles: Map<string, string>,
  isTopLevel = true,
): Promise<void> {
  const entries = await fs.readdir(sourcePath);

  for (const entry of entries) {
    if (isTopLevel && entry === SHARED_DIR) continue;

    const fullPath = path.join(sourcePath, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const nestedOutPath = path.join(outPath, entry);

      await fs.mkdir(nestedOutPath, { recursive: true });
      await compileDirectory(fullPath, nestedOutPath, sharedFiles, false);

      if (isTopLevel) {
        await resolveSharedImports(nestedOutPath, sharedFiles);
      }
    } else if (entry.endsWith('.ts')) {
      await compileTypeScript(fullPath, outPath);
    } else if (entry.endsWith('.js') || entry.endsWith('.vert') || entry.endsWith('.frag') || entry.endsWith('.wgsl')) {
      const targetPath = path.join(outPath, entry);

      await fs.copyFile(fullPath, targetPath);
    }
  }
}

async function formatFile(filePath: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Extract dependencies comment if it exists
    const dependencyMatch = content.match(/^\/\/\s*dependencies:\s*({[^}]+})\n/);
    let codeContent = dependencyMatch ? content.slice(dependencyMatch[0].length) : content;

    // Extract description comment if it exists
    const descriptionMatch = codeContent.match(/^\/\/\s*description:\s*(.*)\n/);

    codeContent = descriptionMatch ? codeContent.slice(descriptionMatch[0].length) : codeContent;

    // Format the code content
    const formatted = await prettier.format(codeContent, {
      filepath: filePath,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });

    // Write back with dependencies comment preserved
    await fs.writeFile(filePath, formatted, 'utf-8');
  } catch (error) {
    console.warn(`Warning: Could not format ${filePath}:`, error);
  }
}

async function formatDirectory(dirPath: string): Promise<void> {
  const entries = await fs.readdir(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await formatDirectory(fullPath);
    } else if (entry.endsWith('.js') || entry.endsWith('.ts')) {
      await formatFile(fullPath);
    }
  }
}

async function main() {
  try {
    const sourcePath = path.resolve(process.cwd(), './docs/examples');
    const compiledPath = path.resolve(process.cwd(), './static/examples/source');

    // Clean the compiled directory
    await fs.rm(compiledPath, { recursive: true, force: true });
    await fs.mkdir(compiledPath, { recursive: true });

    const sharedFiles = await getSharedFiles(sourcePath);

    console.log('Compiling TypeScript files...');
    await compileDirectory(sourcePath, compiledPath, sharedFiles);

    // Generate example config from compiled files
    console.log('Generating example configuration...');
    const examples = await generateExampleConfig(compiledPath);

    // Format compiled files
    console.log('Formatting compiled files...');
    await formatDirectory(compiledPath);

    const outputPath = path.resolve(process.cwd(), './src/data/examples.json');

    await fs.writeFile(outputPath, JSON.stringify(examples, null, 2), 'utf-8');

    console.log('Examples configuration generated successfully!');
  } catch (error) {
    console.error('Error in build process:', error);
    process.exit(1);
  }
}

main();
