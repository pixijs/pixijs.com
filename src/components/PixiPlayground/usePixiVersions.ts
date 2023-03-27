import { useCallback, useMemo } from 'react';
import versions from '@site/pixi-versions.json';
import type { SetURLStateType } from '@site/src/components/PixiPlayground/usePlaygroundURLState';

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

type UsePixiVersionsParams = {
    selectedVersionId: string;
    setURLState: SetURLStateType;
};

export const usePixiVersions = ({ selectedVersionId, setURLState }: UsePixiVersionsParams) =>
{
    const handleVersionChanged = useCallback(
        (nextVersionId: string) =>
            setURLState({
                pixiVersion: nextVersionId,
            }),
        [setURLState],
    );

    const selectedVersion = useMemo<IVersion>(
        () => (versions as IVersion[]).find(propEq('version', selectedVersionId)) as IVersion,
        [selectedVersionId],
    );

    return {
        selectedVersion,
        handleVersionChanged,
        versionOptions,
    };
};
