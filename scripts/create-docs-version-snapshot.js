const { unlinkSync, existsSync, readFileSync } = require('fs');
const shell = require('shelljs');
const { join, resolve } = require('path');

const docsDir = './docs';
const versionFile = join(docsDir, 'pixi-version.json');

console.log('Creating a version snapshot of the docs...');

try
{
    // Generate pixi-version.json if it doesn't exist
    if (!existsSync(versionFile))
    {
        console.log(
            'Aborting snapshot - Pixi version config not found on the working docs.',
            'please generate one first using \'npm run generate-pixi-version-config\'',
        );

        shell.exit(0);
    }

    // Read pixi-version.json to get the version
    const version = JSON.parse(readFileSync(versionFile, 'utf8')).version;

    // Check if a snapshot of the version already exists
    if (existsSync(join(docsDir, `versioned_docs/version-${version}`)))
    {
        console.log(
            `Aborting snapshot - Snapshot for version ${version} already exists.`,
            `Please do 'npm run overwrite-docs-version-snapshot' instead to`,
            `overwrite an existing snapshot with the current docs content.`,
        );
        shell.exit(0);
    }

    // Run docusaurus version with the version
    shell.exec(`npm run docusaurus docs:version ${version}`);

    // Then update the global version configs accordingly
    shell.exec('npm run update-global-version-configs');

    console.log(
        `** pixi version config on the working docs currently conflicts with the recent snapshot's.`,
        `Please do 'npm run generate-pixi-version-config' to resolve this accordingly **`,
    );
}
catch (error)
{
    console.error('An error occurred:', error);
    shell.exit(1);
}
