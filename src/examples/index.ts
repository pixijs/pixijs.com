import type { OptionGroup } from '../components/Select';
import semver, { lte, major, minor, patch, prerelease, rcompare, valid } from 'semver';
import v7x from './v7.0.0/index';
import v8x from './v8.0.0/index';

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
    'v7.0.0': v7x,
    'v8.0.0': v8x,
};

function getBestVersion(version: string)
{
    const isPrerelease = prerelease(version);
    const versionToCompare = isPrerelease ? `${major(version)}.${minor(version)}.${patch(version)}` : version;

    // Get the keys of the versions object and filter them to find the best match
    const bestMatch = Object.keys(versions)
        .filter((name) => valid(name) && lte(name, versionToCompare))
        .sort((a, b) => rcompare(a, b))[0];

    // Return the entries and options of the best match
    return versions[bestMatch];
}

export function getExampleEntry(version: string, pathString: string): ExampleSourceEntry | undefined
{
    const bestVersion = getBestVersion(version);
    const [directory, example] = pathString.split('.');

    return bestVersion?.entries[directory]?.[example];
}

export function getExampleOptions(version: string): OptionGroup[]
{
    const bestVersion = getBestVersion(version);

    return bestVersion?.options;
}
