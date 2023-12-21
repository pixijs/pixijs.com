const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const { compareVersions } = require('compare-versions');
const glob = require('glob');
const axios = require('axios');
const { Octokit, App } = require('octokit');

const PARAM = process.argv[2];
const ROOT = resolve(__dirname, '..');
const PATH_FROM_ROOT = PARAM ? `versioned_docs/version-${PARAM}` : 'docs';
const DOCS_PATH = resolve(ROOT, PATH_FROM_ROOT);
const OUT_NAME = 'pixi-version.json';
const OUT_PATH = resolve(DOCS_PATH, OUT_NAME);
let config;

if (existsSync(OUT_PATH))
{
    // eslint-disable-next-line global-require
    config = require(OUT_PATH);
}

// Compile out a list of all the versions of pixi.js
shell.exec('npm view pixi.js --json > scripts/pixiVersions.json');

// Github
const devBranches = ['next-v8', 'dev'];
const tokenPath = resolve(ROOT, '.ghtoken');
const auth = existsSync(tokenPath) ? readFileSync(tokenPath, 'utf8').trim() : null;
const octokit = auth ? new Octokit({ auth }) : undefined;
const owner = 'pixijs';
const repo = 'pixijs';

async function getLatestCommitSHA(branch = 'master')
{
    if (!octokit)
    {
        console.warn('No auth token found. Please add please generate and add a token to \'.ghtoken\' on root...');

        return null;
    }

    try
    {
        const result = await octokit.request(`GET /repos/${owner}/${repo}/branches/${branch}`, {
            owner,
            repo,
            branch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (result.status === 200)
        {
            return result.data.commit.sha;
        }

        return null;
    }
    catch (e)
    {
        console.error(`Error getting the branch ${branch}. Please try again...`);

        return null;
    }
}

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
const dev = '[>] dev';
const options1 = [all, dev, ...tagKeys];
const options2 = [back, ...allVersions];
const optionsDev = [back, ...devBranches];
const intro = `${config ? 'Altering' : 'Generating'} ${PATH_FROM_ROOT}/${OUT_NAME}...\n`;
const prompt = config
    ? `Config for PixiJS v${config.version} exists. Which version would you like to replace it with?`
    : 'Which PixiJS version would you want to use?';

// Add the cancel option if a config already exists
if (config) options1.unshift(cancel);

// Find all existing pixi-version.json files in the versioned docs directory
const versionFiles = glob.sync(`${ROOT}/versioned_docs/**/pixi-version.json`);

// Read and parse each pixi-version.json file
const versions = versionFiles.map((file) =>
{
    const data = readFileSync(file, 'utf8');

    return JSON.parse(data);
});

// Check if the pixi-version.json with the supplied version already exists
async function doesVersionConfigExist(version)
{
    if (!versions.length) return false;
    if (versions.find((v) => v.version === version))
    {
        // Prompt the user to select a different version if it already exists
        await inquirer.prompt([
            {
                type: 'list',
                name: 'selected',
                message: '** There is already a pixi-version.json for v${version}. Please select a different version! **',
                choices: ['Press ENTER to continue...'],
                loop: false,
            },
        ]);

        return true;
    }

    return false;
}

// async iife
(async () =>
{
    let version;
    let choice;
    let tag;
    let branch;
    let sha;

    // Prompt the user to select a version
    while (!version && !sha)
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
            shell.rm('./scripts/pixiVersions.json');
            shell.exit(0);
        }
        else if (choice.selected === dev)
        {
            choice = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selected',
                    message: 'Which dev version would you want to use?',
                    choices: optionsDev,
                    loop: false,
                },
            ]);

            if (choice.selected !== back)
            {
                branch = choice.selected;
                const result = await getLatestCommitSHA(branch);

                if (result)
                {
                    sha = result;
                }
            }
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

            if (choice.selected !== back && !(await doesVersionConfigExist(choice.selected)))
            {
                version = choice.selected;
                // eslint-disable-next-line no-loop-func
                tag = Object.entries(tags).find(([k, v]) => v === version)?.[0];
            }
        }
        else if (!(await doesVersionConfigExist(tags[choice.selected])))
        {
            tag = choice.selected;
            version = tags[tag];
        }
    }

    if (sha)
    {
        config = {
            versionLabel: branch,
            version: 'dev',
            releaseNotes: 'https://github.com/pixijs/pixijs/releases',
            build: `https://pixijs.download/${branch}/pixi.min.js`,
            docs: 'https://pixijs.download/release/docs',
            npm: `https://pkg.csb.dev/pixijs/pixijs/commit/${sha.substring(0, 8)}`,
            dev: true,
        };
    }
    else
    {
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
    }

    const json = JSON.stringify(config, null, 2);

    // Generate the version config at the specified docs path
    shell.exec(`echo '${json}' > ${OUT_PATH}`);

    // delete the compiled list of versions
    shell.rm('./scripts/pixiVersions.json');

    // Then update the global version configs accordingly
    shell.exec('npm run update-global-version-configs');

    console.log(
        `Successfully created pixi ${config.versionLabel} (v${config.version}) config`,
        `on ${PATH_FROM_ROOT}/${OUT_NAME}`,
    );

    console.log('** Please make sure to create/update versioned examples and tutorials accordingly! **');
})();
