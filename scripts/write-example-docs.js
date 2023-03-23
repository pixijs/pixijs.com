#!/usr/bin/env node
const { join, resolve } = require('path');
const { mkdirSync, readFileSync, rmSync, writeFileSync } = require('fs');
const examplesOrder = require('../src/data/examples/examplesOrder.json');

const ROOT = resolve(__dirname, '..');
const EXAMPLES_MD_PATH = resolve(ROOT, 'docs', 'examples');
const EXAMPLES_JS_PATH = resolve(ROOT, 'src', 'data', 'examples');

const camelToSnake = (str) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const camelToTitle = (str) =>
{
    const result = str.replace(/([A-Z])/g, ' $1');

    return str.charAt(0).toUpperCase() + result.slice(1);
};

async function go()
{
    const directories = Object.keys(examplesOrder);

    const directoryData = directories.map((directoryKey) =>
    {
        const categoryExamples = examplesOrder[directoryKey];
        const directoryName = camelToSnake(directoryKey);
        const categoryTitle = camelToTitle(directoryKey);

        return {
            categoryTitle,
            directoryPath: join(EXAMPLES_MD_PATH, directoryName),
            examples: categoryExamples.map((exampleKey) =>
            {
                const jsFile = `${exampleKey}.js`;
                const mdFile = `${camelToSnake(exampleKey)}.md`;

                const jsPath = resolve(EXAMPLES_JS_PATH, directoryKey, jsFile);
                const mdPath = join(EXAMPLES_MD_PATH, directoryName, mdFile);

                return {
                    exampleSource: readFileSync(jsPath, 'utf8').trim(),
                    examplePath: mdPath,
                    exampleTitle: camelToTitle(exampleKey),
                };
            }),
        };
    });

    directoryData.forEach(({ categoryTitle, directoryPath, examples }, index) =>
    {
        // delete old stuff first
        rmSync(directoryPath, { recursive: true, force: true });

        // recreate directory and build everything
        mkdirSync(directoryPath);

        const categoryYml = [`label: ${categoryTitle}`, `position: ${index + 1}`].join('\n');
        const categoryYmlPath = join(directoryPath, '_category_.yml');

        writeFileSync(categoryYmlPath, categoryYml, 'utf8');

        examples.forEach(({ exampleSource, examplePath, exampleTitle }) =>
        {
            const mdContents = [
                '---',
                'hide_table_of_contents: true',
                '---',
                '',
                `# ${exampleTitle}`,
                '',
                '```js playground',
                exampleSource,
                '```',
                '',
            ].join('\n');

            writeFileSync(examplePath, mdContents, 'utf8');
        });
    });
}

go();
