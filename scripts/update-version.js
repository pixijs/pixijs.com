const versions = require('../pixi-versions.json');
const v8Version = require('../docs/pixi-version.json');
const v7Version = require('../versioned_docs/version-7.x/pixi-version.json');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// async iife
(async () =>
{
    const questions = [
        {
            type: 'list',
            name: 'version',
            message: 'Select the version to update',
            choices: versions.map((v) => v.versionLabel),
        },
        {
            type: 'input',
            name: 'newVersion',
            message: 'Enter the new version number',
        },
    ];

    const answers = await inquirer.prompt(questions);
    const version = versions.find((v) => v.versionLabel === answers.version);

    if (!version)
    {
        console.log('Invalid version');

        return;
    }

    version.version = answers.newVersion;

    if (version.versionLabel === v8Version.versionLabel)
    {
        v8Version.version = answers.newVersion;
        fs.writeFileSync(path.join(process.cwd(), './docs/pixi-version.json'), JSON.stringify(v8Version, null, 2));
    }
    else if (version.versionLabel === v7Version.versionLabel)
    {
        v7Version.version = answers.newVersion;
        fs.writeFileSync(
            path.join(process.cwd(), './versioned_docs/version-7.x/pixi-version.json'),
            JSON.stringify(v7Version, null, 2),
        );
    }

    fs.writeFileSync(path.join(process.cwd(), './pixi-versions.json'), JSON.stringify(versions, null, 2));
})();
