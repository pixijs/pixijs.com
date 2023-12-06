import { evolve, isNil, unless } from 'ramda';
import type { DeserializeParamsType, SerializeParamsType, SetStateType } from '@site/src/hooks/useURLStateParams';
import { useURLStateParams } from '@site/src/hooks/useURLStateParams';

type URLStateParams = {
    source?: string;
    exampleId: string;
    pixiVersion: string;
};

interface Payload
{
    code: string;
}

function encodeSource(source: string)
{
    const json = JSON.stringify({ code: source });

    return btoa(json);
}

function decodeSource(encodedSource: string)
{
    try
    {
        const payload: Payload = JSON.parse(atob(encodedSource));

        return payload.code;
    }
    catch
    {
        return undefined;
    }
}

const safeEncodeSource = unless(isNil, encodeSource);
const safeDecodeSource = unless(isNil, decodeSource);

const serializeParams = evolve({
    source: safeEncodeSource,
}) as SerializeParamsType<URLStateParams>;

const deserializeParams = evolve({
    source: safeDecodeSource,
}) as DeserializeParamsType<URLStateParams>;

export type SetURLStateType = SetStateType<URLStateParams>;

type UsePlaygroundURLStateParams = {
    defaultExampleId: string;
    defaultPixiVersion: string;
};

export const usePlaygroundURLState = ({ defaultExampleId, defaultPixiVersion }: UsePlaygroundURLStateParams) =>
    useURLStateParams<URLStateParams>(
        (urlState) =>
        {
            const { source, exampleId, pixiVersion } = urlState;

            return {
                source: source ?? undefined,
                exampleId: source ? 'custom' : exampleId ?? defaultExampleId,
                pixiVersion: pixiVersion ?? defaultPixiVersion,
            };
        },
        serializeParams,
        deserializeParams,
    );
