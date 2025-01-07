import content1 from './step1-content.md';
import content2 from './step2-content.md';
import content3 from './step3-content.md';
import content4 from './step4-content.md';
import code1 from '!!raw-loader!./step1-code';
import code2 from '!!raw-loader!./step2-code';
import completedCode2 from '!!raw-loader!./step2-completed-code';
import code3 from '!!raw-loader!./step3-code';
import completedCode3 from '!!raw-loader!./step3-completed-code';
import code4 from '!!raw-loader!./step4-code';

import type { TutorialStep } from '../..';

export const gettingStartedTutorialSteps: TutorialStep[] = [
    {
        header: 'Getting Started',
        Content: content1,
        code: code1,
    },
    {
        header: 'Set up something',
        Content: content2,
        code: code2,
        completedCode: completedCode2,
    },
    {
        header: 'Do something',
        Content: content3,
        code: code3,
        completedCode: completedCode3,
    },
    {
        header: 'You did it!',
        Content: content4,
        code: code4,
    },
];
