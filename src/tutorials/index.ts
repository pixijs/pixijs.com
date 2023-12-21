import v7x from './v7.3.2/index';
import dev from './dev/index';

export type TutorialStep = {
    header: string;
    Content: string;
    code: string;
    completedCode?: string;
};

export type TutorialEntry = {
    description: string;
    thumbnail?: string;
    steps: TutorialStep[];
};

// TODO: Use await import to dynamically load versioned content on demand instead?
const versions: Record<string, Record<string, TutorialEntry>> = {
    '7.3.2': v7x,
    dev,
};

export function getTutorialEntry(version: string, key: string)
{
    return versions[version]?.[key];
}
