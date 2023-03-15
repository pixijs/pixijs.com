#!/usr/bin/env node
const { resolve } = require('path');
const { readdir } = require('fs').promises;

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

            return {
                directory,
                file,
                pathKey: pathParts.join('.'),
                filePath,
            };
        });

    fileData.forEach((data) => {});
}

go();
