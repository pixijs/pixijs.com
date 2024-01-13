import code1 from '!!raw-loader!./step1-code';
import completedCode1 from '!!raw-loader!./step1-completed-code';
import code2 from '!!raw-loader!./step2-code';
import completedCode2 from '!!raw-loader!./step2-completed-code';
import code3 from '!!raw-loader!./step3-code';
import completedCode3 from '!!raw-loader!./step3-completed-code';
import code4 from '!!raw-loader!./step4-code';
import completedCode4 from '!!raw-loader!./step4-completed-code';
import code5 from '!!raw-loader!./step5-code';
import completedCode5 from '!!raw-loader!./step5-completed-code';
import code6 from '!!raw-loader!./step6-code';
import type { TutorialStep } from '../..';
import content1 from './step1-content.md';
import content2 from './step2-content.md';
import content3 from './step3-content.md';
import content4 from './step4-content.md';
import content5 from './step5-content.md';
import content6 from './step6-content.md';

export const fishPondTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
        completedCode: completedCode1,
    },
    {
        header: 'Adding Background',
        Content: content2,
        code: code2,
        completedCode: completedCode2,
    },
    {
        header: 'Adding Fishes',
        Content: content3,
        code: code3,
        completedCode: completedCode3,
    },
    {
        header: 'Adding Water Overlay',
        Content: content4,
        code: code4,
        completedCode: completedCode4,
    },
    {
        header: 'Adding Displacement Effect',
        Content: content5,
        code: code5,
        completedCode: completedCode5,
    },
    {
        header: 'You did it!',
        Content: content6,
        code: code6,
    },
];
