import { existsSync, readFileSync } from 'fs';
import { prompt } from 'inquirer';
import { join } from 'path';
import { exec, exit } from 'shelljs';

const docsDir = './docs';
const versionFile = join(docsDir, 'pixi-version.json');

function getGenericVersion(version) {
  return version.replace(/(\d+)(\.\d+)?(\.\d+)?(-.*)?/, '$1.x');
}

console.log('Creating a version snapshot of the docs...');

try {
  (async () => {
    // Generate pixi-version.json if it doesn't exist
    if (!existsSync(versionFile)) {
      console.log(
        'Aborting snapshot - Pixi version config not found on the working docs.',
        "please generate one first using 'npm run generate-pixi-version-config'",
      );

      exit(0);
    }

    // Read pixi-version.json to get the version
    const version = JSON.parse(readFileSync(versionFile, 'utf8')).version;

    // Grab the generic version as an option for user to choose as well
    const genericVersion = getGenericVersion(version);

    // Let the user choose between snapshotting the specific version or the generic version
    const choice = await prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Would you like to snapshot as a generic or a specific version?',
        choices: [genericVersion, version],
        default: genericVersion,
        loop: false,
      },
    ]);

    const selectedVersion = choice.selected;

    // Check if a snapshot of the version already exists
    if (existsSync(join(docsDir, `versioned_docs/version-${selectedVersion}`))) {
      console.log(
        `Aborting snapshot - Snapshot for version ${selectedVersion} already exists.`,
        `Please do 'npm run overwrite-docs-version-snapshot' instead to`,
        `overwrite an existing snapshot with the current docs content.`,
      );
      exit(0);
    }

    // Run docusaurus version with the version
    exec(`npm run docusaurus docs:version ${selectedVersion}`);

    // Then update the global version configs accordingly
    exec('npm run update-global-version-configs');

    console.log(
      `** pixi version config on the working docs currently conflicts with the recent snapshot's.`,
      `Please do 'npm run generate-pixi-version-config' to resolve this accordingly **`,
    );
  })();
} catch (error) {
  console.error('An error occurred:', error);
  exit(1);
}
