import code1 from '!!raw-loader!./step1-code';
import code2 from '!!raw-loader!./step2-code';
import completedCode2 from '!!raw-loader!./step2-completed-code';
import code3 from '!!raw-loader!./step3-code';
import completedCode3 from '!!raw-loader!./step3-completed-code';
import code4 from '!!raw-loader!./step4-code';
import completedCode4 from '!!raw-loader!./step4-completed-code';
import code5 from '!!raw-loader!./step5-code';
import completedCode5 from '!!raw-loader!./step5-completed-code';
import code6 from '!!raw-loader!./step6-code';
import completedCode6 from '!!raw-loader!./step6-completed-code';
import code7 from '!!raw-loader!./step7-code';
import completedCode7 from '!!raw-loader!./step7-completed-code';
import code8 from '!!raw-loader!./step8-code';
import completedCode8 from '!!raw-loader!./step8-completed-code';
import code9 from '!!raw-loader!./step9-code';
import completedCode9 from '!!raw-loader!./step9-completed-code';
import code10 from '!!raw-loader!./step10-code';
import type { TutorialStep } from '../..';
import content1 from './step1-content.md';
import content2 from './step2-content.md';
import content3 from './step3-content.md';
import content4 from './step4-content.md';
import content5 from './step5-content.md';
import content6 from './step6-content.md';
import content7 from './step7-content.md';
import content8 from './step8-content.md';
import content9 from './step9-content.md';
import content10 from './step10-content.md';

export const chooChooTrainTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
    },
    {
        header: 'Adding Stars',
        Content: content2,
        code: code2,
        completedCode: completedCode2,
    },
    {
        header: 'Adding Moon',
        Content: content3,
        code: code3,
        completedCode: completedCode3,
    },
    {
        header: 'Adding Mountains',
        Content: content4,
        code: code4,
        completedCode: completedCode4,
    },
    {
        header: 'Adding Trees',
        Content: content5,
        code: code5,
        completedCode: completedCode5,
    },
    {
        header: 'Adding Ground',
        Content: content6,
        code: code6,
        completedCode: completedCode6,
    },
    {
        header: 'Adding Train Head',
        Content: content7,
        code: code7,
        completedCode: completedCode7,
    },
    {
        header: 'Adding Train Carriage',
        Content: content8,
        code: code8,
        completedCode: completedCode8,
    },
    {
        header: 'Adding Smokes',
        Content: content9,
        code: code9,
        completedCode: completedCode9,
    },
    {
        header: 'You did it!',
        Content: content10,
        code: code10,
    },
];
