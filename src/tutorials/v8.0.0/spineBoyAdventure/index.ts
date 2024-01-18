import code1 from '!!raw-loader!./step1-code';
import type { TutorialStep } from '../..';
import content1 from './step1-content.md';

export const spineBoyAdventureTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
    },
];
