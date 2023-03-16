#!/usr/bin/env node
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const { mkdirSync, readFileSync, writeFileSync } = require('fs');

const ROOT = resolve(__dirname, '..');
const EXAMPLES_MD_PATH = resolve(ROOT, 'docs', 'examples');
const EXAMPLES_JS_PATH = resolve(ROOT, 'src', 'data', 'examples');

const snakeToCamel = (str) =>
    str.toLowerCase().replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

async function getFiles(dir)
{
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map((dirent) =>
        {
            const res = resolve(dir, dirent.name);

            return dirent.isDirectory() ? getFiles(res) : res;
        }),
    );

    return Array.prototype.concat(...files);
}

async function go()
{
    const files = await getFiles(EXAMPLES_MD_PATH);

    const fileData = files
        .filter((file) => file.includes('.md'))
        .map((filePath) =>
        {
            const relativePath = filePath.slice(EXAMPLES_MD_PATH.length + 1).slice(0, -3);
            const pathParts = relativePath.split('/').map((part) => snakeToCamel(part));
            const [directory, file] = pathParts;
            const jsFile = `${file}.js`;

            return {
                sourcePath: filePath,
                pathKey: pathParts.join('.'),
                directory,
                variable: file,
                file: jsFile,
                destinationDirectory: [EXAMPLES_JS_PATH, directory].join('/'),
                destinationPath: [EXAMPLES_JS_PATH, directory, jsFile].join('/'),
            };
        });

    const importLines = fileData.map(
        ({ directory, file, variable }) => `import ${variable} from '!!raw-loader!./${directory}/${file};'`,
    );
    const exportLines = ['export examplesSource = {', ...fileData.map(({ variable }) => `    ${variable},`), `};`];
    const indexSource = [...importLines, '', ...exportLines, ''].join('\n');

    fileData.forEach(({ sourcePath, pathKey, destinationDirectory, destinationPath }) =>
    {
        const mdSource = readFileSync(sourcePath, 'utf8');
        const mdSourceLines = mdSource.split('\n');
        const startIndex = mdSourceLines.findIndex((line) => line.trim() === '```js playground');
        const endIndex = mdSourceLines.findIndex((line) => line.trim() === '```');

        if (startIndex === -1 || endIndex === -1)
        {
            console.log('No example', sourcePath);

            return;
        }

        const nextMdSource = [
            ...mdSourceLines.slice(0, startIndex + 1),
            `${pathKey}`,
            ...mdSourceLines.slice(endIndex),
        ].join('\n');
        const jsSource = mdSourceLines.slice(startIndex + 1, endIndex).join('\n');

        // overwrite source file with new contents
        writeFileSync(sourcePath, nextMdSource, 'utf8');

        // ensure output dir exists
        mkdirSync(destinationDirectory, { recursive: true });

        writeFileSync(destinationPath, jsSource, 'utf8');
    });

    writeFileSync(`${EXAMPLES_JS_PATH}/index.ts`, indexSource, 'utf8');
}

go();
