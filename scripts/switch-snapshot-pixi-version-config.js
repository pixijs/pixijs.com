const { unlinkSync, existsSync, readFileSync, writeFileSync, rmSync } = require('fs');
const glob = require('glob');
const shell = require('shelljs');
const { join, resolve } = require('path');
const inquirer = require('inquirer');
const { spawn } = require('child_process');
const ROOT = resolve(__dirname, '..');

// Find all pixi-version.json files in the versioned docs directory
const versionFiles = glob.sync(`${ROOT}/versioned_docs/**/pixi-version.json`);

// Exit if there isn't any version snapshot of the docs to update.
if (!versionFiles.length)
{
    console.log(`There isn\'t any version snapshot of the docs to update.`);
    shell.exit(0);
}

// Read and parse each pixi-version.json file
const versions = versionFiles.map((file) =>
{
    const data = readFileSync(file, 'utf8');

    return JSON.parse(data);
});

console.log('Switching a snapshot\'s pixi version config...');

// async iife
(async () =>
{
    const cancel = '[x] cancel';

    // Prompt the user to select a version
    const choice = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: 'Which version snapshot would you like to update its pixi version config?',
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

    // Run generate-pixi-version-config script on the selected snapshot directory
    const generatePixiVersionConfig = spawn('npm', ['run', 'generate-pixi-version-config', '--', config.version], {
        stdio: 'inherit',
    });

    // Wait for generate-pixi-version-config script to finish
    generatePixiVersionConfig.on('close', () =>
    {
        const newConfig = JSON.parse(
            readFileSync(join(ROOT, `versioned_docs/version-${config.version}`, 'pixi-version.json'), 'utf8'),
        );

        const oldVersion = config.version;
        const newVersion = newConfig.version;

        // If version has changed, update versioned docs directory and sidebar name accordingly
        if (newVersion !== oldVersion)
        {
            // Rename versioned docs directory
            shell.mv(join(ROOT, `versioned_docs/version-${oldVersion}`), join(ROOT, `versioned_docs/version-${newVersion}`));

            // Rename versioned docs sidebar
            shell.mv(
                join(ROOT, `versioned_sidebars/version-${oldVersion}-sidebars.json`),
                join(ROOT, `versioned_sidebars/version-${newVersion}-sidebars.json`),
            );

            // Update version number on versions.json
            let parsed = JSON.parse(readFileSync(join(ROOT, 'versions.json'), 'utf8'));

            parsed = parsed.map((version) =>
            {
                if (version === oldVersion)
                {
                    version = newVersion;
                }

                return version;
            });

            writeFileSync(join(ROOT, 'versions.json'), JSON.stringify(parsed, null, 2));

            console.log(
                `Successfully switched snapshot ${config.versionLabel} (v${oldVersion})`,
                `to be ${newConfig.versionLabel} v${newVersion}!`,
            );

            console.log('** Please make sure to create/update versioned examples and tutorials accordingly! **');
        }
    });
})();