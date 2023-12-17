import { gettingStartedTutorialSteps } from './gettingStarted';

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

const tutorialsData: Record<string, TutorialEntry> = {
    gettingStarted: {
        description: 'Learn the basics of how to use PixiJS.',
        steps: gettingStartedTutorialSteps,
    },
};

export function getTutorialEntry(key: string)
{
    return tutorialsData[key];
}
