import content1 from './step1/step1-content.md';
import content2 from './step2/step2-content.md';
import content3 from './step3/step3-content.md';
import content4 from './step4/step4-content.md';
import content5 from './step5/step5-content.md';
import content6 from './step6/step6-content.md';
import content7 from './step7/step7-content.md';
import code1 from '!!raw-loader!./step1/step1-code';
import SpineBoy1 from '!!raw-loader!./step2/SpineBoy1';
import SpineBoy1Completed from '!!raw-loader!./step2/SpineBoy1-completed';
import code2 from '!!raw-loader!./step2/step2-code';
import code2Completed from '!!raw-loader!./step2/step2-code-completed';
import Controller from '!!raw-loader!./step3/Controller';
import ControllerCompleted from '!!raw-loader!./step3/Controller-completed';
import code3 from '!!raw-loader!./step3/step3-code';
import code3Completed from '!!raw-loader!./step3/step3-code-completed';
import SpineBoy2 from '!!raw-loader!./step4/SpineBoy2';
import SpineBoy2Completed from '!!raw-loader!./step4/SpineBoy2-completed';
import code4 from '!!raw-loader!./step4/step4-code';
import code4Completed from '!!raw-loader!./step4/step4-code-completed';
import Scene1 from '!!raw-loader!./step5/Scene1';
import Scene1Completed from '!!raw-loader!./step5/Scene1-completed';
import code5 from '!!raw-loader!./step5/step5-code';
import Scene2 from '!!raw-loader!./step6/Scene2';
import Scene2Completed from '!!raw-loader!./step6/Scene2-completed';
import code6 from '!!raw-loader!./step6/step6-code';
import code6Completed from '!!raw-loader!./step6/step6-code-completed';
import code7 from '!!raw-loader!./step7/step7-code';

import type { TutorialStep } from '../..';

export const spineBoyAdventureTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
    },
    {
        header: 'Setting Up Character',
        Content: content2,
        code: {
            index: code2,
            'src/SpineBoy.js*': SpineBoy1,
        },
        completedCode: {
            index: code2Completed,
            'src/SpineBoy.js*': SpineBoy1Completed,
        },
    },
    {
        header: 'Adding Keyboard Controller',
        Content: content3,
        code: {
            index: code3,
            'src/SpineBoy.js': SpineBoy1Completed,
            'src/Controller.js*': Controller,
        },
        completedCode: {
            index: code3Completed,
            'src/SpineBoy.js': SpineBoy1Completed,
            'src/Controller.js*': ControllerCompleted,
        },
    },
    {
        header: 'Animating Character',
        Content: content4,
        code: {
            index: code4,
            'src/SpineBoy.js*': SpineBoy2,
            'src/Controller.js': ControllerCompleted,
        },
        completedCode: {
            index: code4Completed,
            'src/SpineBoy.js*': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
        },
    },
    {
        header: 'Setting Up Scene',
        Content: content5,
        code: {
            index: code5,
            'src/SpineBoy.js': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
            'src/Scene.js*': Scene1,
        },
        completedCode: {
            index: code5,
            'src/SpineBoy.js': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
            'src/Scene.js*': Scene1Completed,
        },
    },
    {
        header: 'Animating Scene',
        Content: content6,
        code: {
            index: code6,
            'src/SpineBoy.js': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
            'src/Scene.js': Scene2,
        },
        completedCode: {
            index: code6Completed,
            'src/SpineBoy.js': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
            'src/Scene.js': Scene2Completed,
        },
    },
    {
        header: 'You did it!',
        Content: content7,
        code: {
            index: code7,
            'src/SpineBoy.js': SpineBoy2Completed,
            'src/Controller.js': ControllerCompleted,
            'src/Scene.js': Scene2Completed,
        },
    },
];
