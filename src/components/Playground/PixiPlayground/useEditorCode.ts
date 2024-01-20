import { useCallback, useMemo } from 'react';
import type { OptionGroup } from '@site/src/components/Select';
import type { SetURLStateType } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';
import type { ExampleSourceEntry } from '@site/src/examples';
import { getExampleEntry, getExampleOptions } from '@site/src/examples';
import type { IVersion } from './usePixiVersions';

export const defaultExampleId = 'sprite.basic';

type UseCodeExamplesParams = {
    urlSourceCode: string | undefined;
    selectedOptionId: string;
    setURLState: SetURLStateType;
    pixiVersion: IVersion;
};

export const useCodeExamples = ({ urlSourceCode, selectedOptionId, setURLState, pixiVersion }: UseCodeExamplesParams) =>
{
    const version = pixiVersion.version;
    const defaultExampleOptions = getExampleOptions(version);
    const hasUrlHashedCode = Boolean(urlSourceCode);

    const exampleEntry = useMemo<ExampleSourceEntry | undefined>(
        () => getExampleEntry(version, selectedOptionId),
        [version, selectedOptionId],
    );
    const { source, usesWebWorkerLibrary } = useMemo<Omit<ExampleSourceEntry, 'hide'>>(
        () =>
            (urlSourceCode
                ? {
                    source: urlSourceCode,
                    usesWebWorkerLibrary: false,
                }
                : (exampleEntry as ExampleSourceEntry)),
        [urlSourceCode, exampleEntry],
    );

    const exampleOptions = useMemo<OptionGroup[]>(
        () =>
            // Slightly hacky solution if user edits code, changes the example select to
            // a custom option, so the Select still works as expected. It would probably
            // be nicer to store the last loaded example somehow and put an edited star
            // against it or something.
            // Only show custom select option when user has edited code
            (!hasUrlHashedCode
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
        [defaultExampleOptions, hasUrlHashedCode],
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
                    source: undefined,
                    exampleId: nextSelectedId,
                },
                true,
                true,
            );
        },
        [selectedOptionId, setURLState],
    );

    const handleEditorCodeChanged = useCallback(
        (nextSourceCode: string | undefined) =>
        {
            // Annoyingly the Monaco Editor fires the change callback when you update the
            // value prop, rather than just internal changes, so we need to check this
            // change is actually a user editing code. Maybe we could remount the editor
            // instead, but that feels a little brute force.
            if (source === nextSourceCode)
            {
                return;
            }

            // pushState only when editing code for the first time
            setURLState(
                {
                    source: nextSourceCode,
                    exampleId: 'custom',
                },
                !hasUrlHashedCode,
            );
        },
        [hasUrlHashedCode, setURLState, source],
    );

    return {
        source,
        usesWebWorkerLibrary,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    };
};

export const useCodeSource = (source: string | Record<string, string>) =>
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
};
