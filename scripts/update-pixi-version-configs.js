const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');
const { compareVersions } = require('compare-versions');
const glob = require('glob');

// Compile out a list of all the versions of pixi.js
shell.exec('npm view pixi.js --json > scripts/pixiVersions.json');

// Import the compiled list of versions
const pixiVersions = require('./pixiVersions.json');
const tags = pixiVersions['dist-tags'];
const allVersions = pixiVersions.versions;

const ROOT = resolve(__dirname, '..');

// Find all pixi-version.json files in the versioned docs directory
const versionFiles = glob.sync(`${ROOT}/versioned_docs/**/pixi-version.json`);

if (!versionFiles.length)
{
    console.log(`There isn\'t any pixi version config to update!`);
    shell.rm('./scripts/pixiVersions.json');
    shell.exit(0);
}

console.log('Updating any outdated pixi version configs...');

versionFiles.forEach((file) =>
{
    const config = JSON.parse(readFileSync(file, 'utf8'));
    const { version, versionLabel: label, prerelease } = config;

    console.log(`Checking ${config.versionLabel} (v${version}) config`);

    const isGeneric = label.includes('.x');
    let newVersion = version;

    // For generic versions, we also want to update the config to the latest version within the specified major version
    if (isGeneric)
    {
        // Get the major version number
        const majorVersion = parseInt(version.split('.')[0]);

        // Get all versions within the same major version
        const sameMajorVersions = allVersions
            .filter((v) => parseInt(v.split('.')[0]) === majorVersion)
            // Exclude meta-releases if config is not marked as pre-release
            .filter((v) => prerelease || !v.includes('-'));

        // Find the maximum version within the same major version
        newVersion = sameMajorVersions.reduce((a, b) => (compareVersions(a, b) >= 0 ? a : b));
    }

    const tag = Object.entries(tags).find(([k, v]) => v === newVersion)?.[0];

    const parts = newVersion.split('.');
    const major = parts[0];
    const minor = parts[1];
    const patch = parts[2].split('-')[0];
    const isPrelease = parts[2].includes('-rc');
    const isLatest = newVersion === tags.latest;
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
    else if (isGeneric)
    {
        versionLabel = `v${[major, 'x'].join('.')}`;
    }
    else
    {
        versionLabel = `v${newVersion}`;
    }

    const newConfig = {
        versionLabel,
        version: newVersion,
        releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${newVersion}`,
        build: `https://pixijs.download/v${newVersion}/pixi.min.js`,
        docs: `https://pixijs.download/v${newVersion}/docs/index.html`,
        npm: newVersion,
        prerelease: isPrelease,
        latest: isLatest,
    };

    // Log out the changes, if any.
    Object.entries(config).forEach(([key, value]) =>
    {
        if (newConfig[key] !== value)
        {
            console.log(`\tUpdated ${key}: ${value} -> ${newConfig[key]}`);
        }
    });

    const json = JSON.stringify(newConfig, null, 2);

    // Generate the version config at the specified docs path
    shell.exec(`echo '${json}' > ${file}`);
});

// delete the compiled list of versions
shell.rm('./scripts/pixiVersions.json');

// Then update the global version configs accordingly
shell.exec('npm run update-global-version-configs');
