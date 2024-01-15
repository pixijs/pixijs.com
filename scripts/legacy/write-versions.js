const shell = require('shelljs');
const { compareVersions } = require('compare-versions');

// async iife
(async () =>
{
    const devCommitSha = process.argv.slice(2)[0];

    if (!devCommitSha)
    {
        console.error('Script must be run with the commit SHA for the latest merged PR to pixijs/pixijs dev!');
        process.exit(1);
    }

    shell.exec('npm view pixi.js --json > scripts/pixiVersions.json');

    const codeSandboxBaseUrl = `https://pkg.csb.dev/pixijs/pixijs/commit/${devCommitSha.substring(0, 8)}`;

    // eslint-disable-next-line global-require
    const pixiVersions = require('./pixiVersions.json');
    const tags = pixiVersions['dist-tags'];

    const v4 = tags['latest-4.x'];
    const v5 = tags['latest-5.3.x'];
    const v6 = tags['latest-6.x'];
    const latestVersion = tags.latest;
    const prerelease = tags.prerelease;
    const allV7s = pixiVersions.versions.filter((v) => v.startsWith('7'));
    const minorV7s = new Map();

    // loop through each minor version of v7 and add the largest to the array
    for (let i = 0; i < allV7s.length; i++)
    {
        const v = allV7s[i];
        const minor = v.split('.')[1];

        if (!minorV7s.has(minor))
        {
            minorV7s.set(minor, v);
        }
        // compare the two versions
        const current = minorV7s.get(minor);

        if (compareVersions(current, v) !== 1)
        {
            minorV7s.set(minor, v);
        }
    }

    // check if the prerelease version is higher than the latest v7
    const addPrelease = compareVersions(prerelease, tags.latest) > 0;

    const versions = [
        {
            versionLabel: 'v4.x',
            version: v4,
            releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${v4}`,
            build: `https://pixijs.download/v${v4}/pixi.min.js`,
            docs: `https://pixijs.download/v${v4}/docs/index.html`,
            npm: v4,
        },
        {
            versionLabel: 'v5.x',
            version: v5,
            releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${v5}`,
            build: `https://pixijs.download/v${v5}/pixi.min.js`,
            docs: `https://pixijs.download/v${v5}/docs/index.html`,
            npm: v5,
        },
        {
            versionLabel: 'v6.x',
            version: v6,
            releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${v6}`,
            build: `https://pixijs.download/v${v6}/pixi.min.js`,
            docs: `https://pixijs.download/v${v6}/docs/index.html`,
            npm: v6,
        },
    ];

    minorV7s.forEach((v) =>
    {
        if (v.includes('-')) return;

        versions.push({
            versionLabel: `v${v.split('.').slice(0, 2).join('.')}.x`,
            version: v,
            releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${v}`,
            build: `https://pixijs.download/v${v}/pixi.min.js`,
            docs: `https://pixijs.download/v${v}/docs/index.html`,
            npm: v,
        });
    });

    if (addPrelease)
    {
        versions.push({
            versionLabel: `v${prerelease}`,
            version: prerelease,
            releaseNotes: `https://github.com/pixijs/pixijs/releases/tag/v${prerelease}`,
            build: `https://pixijs.download/v${prerelease}/pixi.min.js`,
            docs: `https://pixijs.download/v${prerelease}/docs/index.html`,
            npm: prerelease,
            prerelease: true,
        });
    }

    versions.push({
        versionLabel: 'dev',
        version: 'dev',
        releaseNotes: 'https://github.com/pixijs/pixijs/releases',
        build: 'https://pixijs.download/dev/pixi.min.js',
        docs: 'https://pixijs.download/release/docs/index.html',
        dev: true,
        npm: codeSandboxBaseUrl,
    });

    const versionsWithLatest = versions.map((version) =>
    {
        const isLatest = version.version === latestVersion ? true : undefined;

        return {
            ...version,
            latest: isLatest,
        };
    });

    const json = JSON.stringify(versionsWithLatest.reverse(), null, 2);

    shell.exec(`echo '${json}' > ./pixi-versions.json`);
    // delete the file
    shell.rm('./scripts/pixiVersions.json');
})();
