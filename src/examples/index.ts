import type { OptionGroup } from '../components/Select';
import v7x from './v7.3.2/index';
import v8x from './v8.0.0-rc.1/index';

export type ExampleDataEntry = {
    name: string;
    hide?: boolean;
    usesWebWorkerLibrary?: boolean;
};
export type ExampleSourceEntry = {
    source: string;
    hide: boolean;
    usesWebWorkerLibrary: boolean;
};

// json data structure
export type ExamplesJsonType = Record<string, (ExampleDataEntry | string)[]>;
// sourcecode dictionary structure for below
export type ExamplesSourceType = Record<string, Record<string, string>>;
// normalized combination of the above
export type CategoryDataType = Record<string, ExampleSourceEntry>;
export type ExamplesDataType = Record<string, CategoryDataType>;

// TODO: Use await import to dynamically load versioned content on demand instead?
const versions: Record<string, { entries: ExamplesDataType; options: OptionGroup[] }> = {
    '7.3.2': v7x,
    '8.0.0-rc.1': v8x,
};

export function getExampleEntry(version: string, pathString: string): ExampleSourceEntry | undefined
{
    const [directory, example] = pathString.split('.');

    return versions[version]?.entries[directory]?.[example];
}

export function getExampleOptions(version: string): OptionGroup[]
{
    return versions[version]?.options;
}
