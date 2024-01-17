const { unlinkSync, existsSync, readFileSync, writeFileSync, rmSync } = require('fs');
const glob = require('glob');
const shell = require('shelljs');
const { join, resolve } = require('path');
const inquirer = require('inquirer');

const ROOT = resolve(__dirname, '..');

function getGenericVersion(version)
{
    return version.replace(/(\d+)(\.\d+)?(\.\d+)?(-.*)?/, '$1.x');
}

// Find all pixi-version.json files in the versioned docs directory
const versionFiles = glob.sync(`${ROOT}/versioned_docs/**/pixi-version.json`);

// Exit if there isn't any version snapshot of the docs to remove
if (!versionFiles.length)
{
    console.log(`There isn\'t any version snapshot of the docs to remove.`);
    shell.exit(0);
}

// Read and parse each pixi-version.json file
const versions = versionFiles.map((file) =>
{
    const data = readFileSync(file, 'utf8');

    return JSON.parse(data);
});

console.log('Removing a version snapshot of the docs...');

// async iife
(async () =>
{
    const cancel = '[x] cancel';

    // Prompt the user to select a version
    const choice = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: 'Which version snapshot would you like to remove?',
            choices: [cancel, ...versions.map((version) => version.versionLabel)],
            default: cancel,
            loop: false,
        },
    ]);

    if (choice.selected === cancel)
    {
        shell.exit(0);
    }

    const config = versions.find((version) => version.versionLabel === choice.selected);

    /**
     * Use the docusaurus versions config to determine if the snapshot is of a generic version,
     * so that correct directory and sidebar names can be referred to.
     */
    const snapshotVersions = JSON.parse(readFileSync(join(ROOT, 'versions.json'), 'utf8'));
    const isGenericSnapshot = !snapshotVersions.includes(config.version);
    const key = isGenericSnapshot ? getGenericVersion(config.version) : config.version;

    // 1st Confirmation
    const confirmation = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: `Are you sure you want to remove ${config.versionLabel} (v${key}) snapshot?`,
            choices: ['no', 'yes'],
            default: 'no',
            loop: false,
        },
    ]);

    if (confirmation.selected === 'no')
    {
        shell.exit(0);
    }

    // 2nd Confirmation
    const input = await inquirer.prompt([
        {
            type: 'input',
            name: 'version',
            message: `Please type version number '${key}' to remove the snapshot?`,
        },
    ]);

    if (input.version !== key)
    {
        shell.exit(0);
    }

    // Remove the selected version snapshot ----------------------------

    // Read versions.json
    const data = readFileSync(join(ROOT, 'versions.json'), 'utf8');

    // Remove the selected version
    const parsed = snapshotVersions.filter((version) => version !== key);

    // If there are no versions left, delete versions.json
    if (!parsed.length)
    {
        unlinkSync(join(ROOT, 'versions.json'));
    }
    else
    {
        // Write the updated JSON back to versions.json
        writeFileSync(join(ROOT, 'versions.json'), JSON.stringify(parsed, null, 2));
    }

    // Delete the versioned directory
    rmSync(join(ROOT, 'versioned_docs', `version-${key}`), { recursive: true, force: true });

    // Delete the versioned sidebars
    rmSync(join(ROOT, 'versioned_sidebars', `version-${key}-sidebars.json`), { recursive: true, force: true });

    console.log(`Successfully removed ${config.versionLabel} (v${key}) snapshot!`);

    // Then update the global version configs accordingly
    shell.exec('npm run update-global-version-configs');
})();
