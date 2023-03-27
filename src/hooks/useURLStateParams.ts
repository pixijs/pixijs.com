import { useMemo, useRef } from 'react';
import { useHistory } from '@docusaurus/router';

type InitialStateInit<T> = (stateFromURL: Partial<T>) => T;
type StateUpdaterType<T> = (state: T) => T;
type SetStateParamType<T> = Partial<T> | StateUpdaterType<T>;

export type SetStateType<T> = (state: SetStateParamType<T>, pushState?: boolean) => void;
export type SerializeParamsType<T> = (state: Partial<T>) => Record<string, string>;
export type DeserializeParamsType<T> = (searchParams: Record<string, string>) => Partial<T>;

function searchToStringObject(searchString: string): Record<string, string>
{
    const search = new URLSearchParams(searchString);
    const strObject = Array.from(search.entries()).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );

    return strObject;
}

export function useURLStateParams<T extends Record<string, any>>(
    initialState: T | InitialStateInit<T>,
    serializeParams: SerializeParamsType<T>,
    deserializeParams: DeserializeParamsType<T>,
): [T, SetStateType<T>]
{
    const history = useHistory();

    // deserialize state from URL
    const urlState = useMemo(
        () => deserializeParams(searchToStringObject(history.location.search)),
        [deserializeParams, history.location.search],
    );

    // setup initial state, then ignore any changes
    // TODO: can we prevent function version being called every render?
    const defaultState = useRef(typeof initialState === 'function' ? initialState(urlState) : initialState);

    // merge URL state with defaultState every time URL state changes, this way we can
    // have empty URL entries map to default state
    const state = useMemo(
        () => ({
            ...defaultState.current,
            ...urlState,
        }),
        [urlState],
    );

    // merge state change with existing state and update URL
    const setState = (s: SetStateParamType<T>, pushState = true) =>
    {
        const nextState
            = typeof s === 'function'
                ? s(state)
                : {
                    ...state,
                    ...s,
                };

        const nonDefaultState = Object.entries(nextState).reduce((acc, [key, value]) =>
        {
            if (value === defaultState.current[key])
            {
                return acc;
            }

            return {
                ...acc,
                [key]: value,
            };
        }, {});

        const searchParams = new URLSearchParams(Object.entries(serializeParams(nonDefaultState)));
        const historyOptions = {
            pathname: history.location.pathname,
            search: searchParams.toString(),
        };

        if (pushState)
        {
            history.push(historyOptions);
        }
        else
        {
            history.replace(historyOptions);
        }
    };

    return [state, setState];
}
