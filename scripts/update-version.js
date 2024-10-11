const versions = require('../pixi-versions.json');
const v8Version = require('../docs/pixi-version.json');
const v7Version = require('../versioned_docs/version-7.x/pixi-version.json');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

function updateVersionDetails(versionDetails, newVersion)
{
    versionDetails.version = newVersion;
    versionDetails.releaseNotes = `https://github.com/pixijs/pixijs/releases/tag/v${newVersion}`;
    versionDetails.build = `https://pixijs.download/v${newVersion}/pixi.min.js`;
    versionDetails.docs = `https://pixijs.download/v${newVersion}/docs/index.html`;
    versionDetails.npm = newVersion;
}

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

    updateVersionDetails(version, answers.newVersion);

    if (version.versionLabel === v8Version.versionLabel)
    {
        updateVersionDetails(v8Version, answers.newVersion);
        fs.writeFileSync(path.join(process.cwd(), './docs/pixi-version.json'), JSON.stringify(v8Version, null, 2));
    }
    else if (version.versionLabel === v7Version.versionLabel)
    {
        updateVersionDetails(v7Version, answers.newVersion);
        fs.writeFileSync(
            path.join(process.cwd(), './versioned_docs/version-7.x/pixi-version.json'),
            JSON.stringify(v7Version, null, 2),
        );
    }

    fs.writeFileSync(path.join(process.cwd(), './pixi-versions.json'), JSON.stringify(versions, null, 2));
})();
