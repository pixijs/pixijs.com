import { evolve, isNil, unless } from 'ramda';
import { useURLStateParams } from '@site/src/hooks/useURLStateParams';

import type { DeserializeParamsType, SerializeParamsType, SetStateType } from '@site/src/hooks/useURLStateParams';

export type URLSaveState = {
    files: Record<string, { code: string }>;
    visibleFiles: string[];
    activeFile: string;
};

type URLStateParams = {
    state?: URLSaveState;
    exampleId: string;
};

function encodeState(state: URLSaveState)
{
    const json = JSON.stringify(state);

    return btoa(json);
}

function decodeState(encodedState: string)
{
    try
    {
        const state: URLSaveState = JSON.parse(atob(encodedState));

        return state;
    }
    catch
    {
        return undefined;
    }
}

const safeEncodeState = unless(isNil, encodeState);
const safeDecodeState = unless(isNil, decodeState);

const serializeParams = evolve({
    state: safeEncodeState,
}) as SerializeParamsType<URLStateParams>;

const deserializeParams = evolve({
    state: safeDecodeState,
}) as DeserializeParamsType<URLStateParams>;

export type SetURLStateType = SetStateType<URLStateParams>;

type UsePlaygroundURLStateParams = {
    defaultExampleId: string;
    defaultPixiVersion: string;
};

export const usePlaygroundURLState = ({ defaultExampleId }: UsePlaygroundURLStateParams) =>
    useURLStateParams<URLStateParams>(
        (urlState) =>
        {
            const { state, exampleId } = urlState;

            return {
                state: state ?? undefined,
                exampleId: state ? 'custom' : (exampleId ?? defaultExampleId),
            };
        },
        serializeParams,
        deserializeParams,
    );
