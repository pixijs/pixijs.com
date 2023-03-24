import { useMemo, useState } from 'react';
import versions from '@site/pixi-versions.json';

export interface IVersion
{
    version: string;
    versionLabel: string;
    releaseNotes: string;
    docs: string;
    build: string;
    npm: string;
    prerelease?: boolean;
    dev?: boolean;
    latest?: boolean;
}

const versionOptions = (versions as IVersion[]).map(({ versionLabel, version }) => ({
    label: versionLabel,
    value: version,
}));

const propEq
    = (prop: string, value: any) =>
        (object: Record<string, any>): boolean =>
            object[prop] === value;

export const latestVersion = ((versions as IVersion[]).find(propEq('latest', true)) as IVersion).version;

export const usePixiVersions = () =>
{
    const [selectedVersionId, handleVersionChanged] = useState(latestVersion);

    const selectedVersion = useMemo<IVersion>(
        () => (versions as IVersion[]).find(propEq('version', selectedVersionId)) as IVersion,
        [selectedVersionId],
    );

    return {
        selectedVersion,
        selectedVersionId,
        handleVersionChanged,
        versionOptions,
    };
};
