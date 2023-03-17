import { useCallback, useMemo, useState } from 'react';
import { getExampleOptions, getExampleSource } from '@site/src/data/examples';
import type { OptionGroup } from '@site/src/components/Select';

interface Payload
{
    code: string;
}

function writePayload(payload: Payload, pushState: boolean)
{
    const json = JSON.stringify(payload);
    const method = pushState ? 'pushState' : 'replaceState';

    history[method](null, '', `#${btoa(json)}`);
}

function clearPayload(pushState: boolean)
{
    const method = pushState ? 'pushState' : 'replaceState';

    history[method](null, '', location.pathname + location.search);
}

// eslint-disable-next-line consistent-return
function readPayload(): Payload | undefined
{
    if (location.hash !== '')
    {
        try
        {
            return JSON.parse(atob(location.hash.substring(1)));
        }
        catch
        {
            // Ignore
        }
    }
}

const defaultExampleId = 'sprite.basic';
const defaultExampleOptions = getExampleOptions();

type URLHashedCodeType = string | undefined;
type SetURLHashedCodeType = (nextCode: URLHashedCodeType, pushState: boolean) => void;

export const useURLHashedCode = (): [URLHashedCodeType, SetURLHashedCodeType] =>
{
    const payload = readPayload();
    const code = payload?.code;

    const setURLHashedCode = useCallback<SetURLHashedCodeType>((nextCode, pushState) =>
    {
        if (nextCode === undefined)
        {
            clearPayload(pushState);

            return;
        }

        writePayload({ code: nextCode }, pushState);
    }, []);

    return [code, setURLHashedCode];
};

export const useCodeExamples = () =>
{
    const [urlHashedCode, setURLHashedCode] = useURLHashedCode();
    const [selectedOptionId, setSelectedOptionId] = useState(urlHashedCode ? 'custom' : defaultExampleId);

    const hasUrlHashedCode = Boolean(urlHashedCode);

    const sourceCode = useMemo<string>(
        () => urlHashedCode ?? (getExampleSource(selectedOptionId) as string),
        [urlHashedCode, selectedOptionId],
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
        [hasUrlHashedCode],
    );

    const handleOptionSelected = useCallback(
        (nextSelectedId: string) =>
        {
            if (nextSelectedId === selectedOptionId)
            {
                return;
            }

            setURLHashedCode(undefined, true);
            setSelectedOptionId(nextSelectedId);
        },
        [selectedOptionId, setURLHashedCode],
    );

    const handleEditorCodeChanged = useCallback(
        (nextSourceCode: string | undefined) =>
        {
            // Annoyingly the Monaco Editor fires the change callback when you update the
            // value prop, rather than just internal changes, so we need to check this
            // change is actually a user editing code. Maybe we could remount the editor
            // instead, but that feels a little brute force.
            if (sourceCode === nextSourceCode)
            {
                return;
            }

            // pushState when editing code for the first time
            setURLHashedCode(nextSourceCode, !hasUrlHashedCode);
            setSelectedOptionId('custom');
        },
        [hasUrlHashedCode, sourceCode, setURLHashedCode],
    );

    return {
        sourceCode,
        selectedOptionId,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    };
};
