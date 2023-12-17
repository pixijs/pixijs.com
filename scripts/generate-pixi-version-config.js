const { resolve } = require('path');
const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const { compareVersions } = require('compare-versions');

const PARAM = process.argv[2];
const ROOT = resolve(__dirname, '..');
const PATH_FROM_ROOT = PARAM ? `website/versioned_docs/version-${PARAM}` : 'docs';
const DOCS_PATH = resolve(ROOT, PATH_FROM_ROOT);
const OUT_NAME = 'pixi-version.json';
const OUT_PATH = resolve(DOCS_PATH, OUT_NAME);
let config;

if (fs.existsSync(OUT_PATH))
{
    // eslint-disable-next-line global-require
    config = require(OUT_PATH);
}

// Compile out a list of all the versions of pixi.js
shell.exec('npm view pixi.js --json > scripts/pixiVersions.json');

// Import the compiled list of versions
const pixiVersions = require('./pixiVersions.json');
const tags = pixiVersions['dist-tags'];

// Filter out alpha and beta versions and reverse the list to be in descending order
const allVersions = pixiVersions.versions
    .slice()
    .filter((v) => !v.includes('-alpha') && !v.includes('-beta'))
    .reverse();

// Sort the tags by descending version number
const tagKeys = Object.keys(tags).sort((a, b) =>
{
    const versionA = tags[a];
    const versionB = tags[b];

    return compareVersions(versionB, versionA);
});

// Remove prerelease versions from the list if the latest version is higher
if (compareVersions(tags.prerelease, tags.latest) <= 0)
{
    tagKeys.splice(tagKeys.indexOf('prerelease'), 1);
}

// Generate the list of options for the user to choose from
const all = '[>] all versions';
const back = '[<] back';
const cancel = '[x] cancel';
const options1 = [all, ...tagKeys];
const options2 = [back, ...allVersions];
const intro = `Welcome to the PixiJS version config generator!\n----------------------------------------------\n${
    config ? 'Altering' : 'Generating'
} ${PATH_FROM_ROOT}/${OUT_NAME}...\n\n`;
const prompt = config
    ? `Config for PixiJS v${config.version} exists. Which version would you like to replace it with?`
    : 'Which PixiJS version would you want to use?';

// Add the cancel option if a config already exists
if (config) options1.unshift(cancel);

// async iife
(async () =>
{
    let version;
    let choice;
    let tag;

    // Prompt the user to select a version
    while (!version || choice === all || choice === back)
    {
        choice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selected',
                // If a config already exists, prompt the user to replace it
                message: intro + prompt,
                choices: options1,
                // If a config already exists, default to cancel instead
                default: config ? cancel : 'latest',
                loop: false,
            },
        ]);

        if (choice.selected === cancel)
        {
            shell.exit(0);
        }
        else if (choice.selected === all)
        {
            choice = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selected',
                    message: 'Which PixiJS version would you want to use?',
                    choices: options2,
                    loop: false,
                },
            ]);

            if (choice.selected !== back)
            {
                version = choice.selected;
                // eslint-disable-next-line no-loop-func
                tag = Object.entries(tags).find(([k, v]) => v === version)?.[0];
            }
        }
        else
        {
            tag = choice.selected;
            version = tags[tag];
        }
    }

    const parts = version.split('.');
    const major = parts[0];
    const minor = parts[1];
    const patch = parts[2].split('-')[0];
    const isPrelease = parts[2].includes('-rc');
    const isLatest = version === tags.latest;
    let versionLabel;

    if (isLatest)
    {
        versionLabel = `v${[major, 'x'].join('.')} (Latest)`;
    }
    else if (tag)
    {
        const extracted = tag.replace('latest-', '');

        versionLabel = extracted.match(/^\d/) ? `v${extracted}` : extracted;
    }
    else
    {
        versionLabel = `v${version}`;
    }

    config = {
        versionLabel,
        version,
        releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${version}`,
        build: `https://pixijs.download/v${version}/pixi.min.js`,
        docs: `https://pixijs.download/v${version}/docs/index.html`,
        npm: version,
        prerelease: isPrelease,
        latest: isLatest,
    };

    const json = JSON.stringify(config, null, 2);

    // Generate the version config at the specified docs path
    shell.exec(`echo '${json}' > ${OUT_PATH}`);

    // delete the compiled list of versions
    shell.rm('./scripts/pixiVersions.json');
})();
