import { useCallback, useMemo } from 'react';
import type { OptionGroup } from '@site/src/components/Select';
import type { SetURLStateType, URLSaveState } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';
import type { ExampleSourceEntry } from '@site/src/examples';
import { getExampleEntry, getExampleOptions } from '@site/src/examples';
import type { IVersion } from './usePixiVersions';
import type { SandpackState } from '@codesandbox/sandpack-react';

export const defaultExampleId = 'sprite.basic';

type UseCodeExamplesParams = {
    urlState: URLSaveState | undefined;
    selectedOptionId: string;
    setURLState: SetURLStateType;
    pixiVersion: IVersion;
};

export const useCodeExamples = ({ urlState, selectedOptionId, setURLState, pixiVersion }: UseCodeExamplesParams) =>
{
    const version = pixiVersion.version;
    const defaultExampleOptions = getExampleOptions(version);
    const hasUrlHashed = Boolean(urlState);

    const exampleEntry = useMemo<ExampleSourceEntry | undefined>(
        () => getExampleEntry(version, selectedOptionId),
        [version, selectedOptionId],
    );
    const { indexCode, extraFiles, activeFile, usesWebWorkerLibrary } = useMemo<{
        indexCode: string;
        extraFiles?: Record<string, string>;
        activeFile?: string;
        usesWebWorkerLibrary: boolean;
    }>(() =>
    {
        if (!urlState)
        {
            const { indexCode, extraFiles } = extractSource(exampleEntry?.source ?? '');

            return {
                indexCode,
                extraFiles,
                usesWebWorkerLibrary: !!exampleEntry?.usesWebWorkerLibrary,
            };
        }

        const { files, visibleFiles, activeFile } = urlState;

        if (!visibleFiles.length)
        {
            return {
                indexCode: files['/src/index.js'].code,
                activeFile,
                usesWebWorkerLibrary: false,
            };
        }

        const extraFiles = Object.entries(files)
            .filter(([key]) => (/^\/src\/(?!index\.js$|styles\.css$)/).test(key))
            .reduce((acc, [key, value]) =>
            {
                let suffix = '';

                if (activeFile === key) suffix = '*';
                if (!visibleFiles.includes(key)) suffix = '!';
                acc[key.substring(1) + suffix] = value.code;

                return acc;
            }, {} as Record<string, string>);

        return {
            indexCode: files['/src/index.js'].code,
            extraFiles,
            usesWebWorkerLibrary: false,
        };
    }, [urlState, exampleEntry]);

    const exampleOptions = useMemo<OptionGroup[]>(
        () =>
            // Slightly hacky solution if user edits code, changes the example select to
            // a custom option, so the Select still works as expected. It would probably
            // be nicer to store the last loaded example somehow and put an edited star
            // against it or something.
            // Only show custom select option when user has edited code
            (!hasUrlHashed
                ? defaultExampleOptions
                : defaultExampleOptions.concat({
                    label: 'Custom Code',
                    options: [
                        {
                            label: 'User Edited Code',
                            value: 'custom',
                        },
                    ],
                })),
        [defaultExampleOptions, hasUrlHashed],
    );

    const handleOptionSelected = useCallback(
        (nextSelectedId: string) =>
        {
            if (nextSelectedId === selectedOptionId)
            {
                return;
            }

            setURLState(
                {
                    state: undefined,
                    exampleId: nextSelectedId,
                },
                true,
                true,
            );
        },
        [selectedOptionId, setURLState],
    );

    const handleEditorCodeChanged = useCallback(
        (nextSourceCode: string | undefined, state: SandpackState) =>
        {
            if (!nextSourceCode) return;

            const { files, visibleFiles, activeFile } = state;

            // Hacky solution to get the active file's code up-to-date
            files[activeFile].code = nextSourceCode;

            // pushState only when editing code for the first time
            setURLState(
                {
                    state: { files, visibleFiles, activeFile },
                    exampleId: 'custom',
                },
                !hasUrlHashed,
            );
        },
        [hasUrlHashed, setURLState],
    );

    return {
        indexCode,
        extraFiles,
        activeFile,
        usesWebWorkerLibrary,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    };
};

export function extractSource(source: string | Record<string, string>)
{
    const isMultiFile = typeof source !== 'string';
    const indexCode = isMultiFile ? source.index : source;
    const extraFiles = isMultiFile
        ? Object.fromEntries(Object.entries(source).filter(([key]) => key !== 'index'))
        : undefined;

    return {
        indexCode,
        extraFiles,
    };
}
