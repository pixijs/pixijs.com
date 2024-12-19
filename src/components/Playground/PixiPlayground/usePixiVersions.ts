import { gt } from 'semver';
import versions from '@site/pixi-versions.json';

export type IVersion = {
    version: string;
    versionLabel: string;
    releaseNotes: string;
    docs: string;
    build: string;
    npm: string;
    prerelease?: boolean;
    dev?: boolean;
    latest?: boolean;
};

export const latestVersion = versions.reduce((latest, current) =>
{
    if (gt(current.version, latest.version))
    {
        return current;
    }

    return latest;
}, versions[0]).version;
