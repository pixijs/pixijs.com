import code1 from '!!raw-loader!./step1-code';
import SpineBoy from '!!raw-loader!./SpineBoy';
import Controller from '!!raw-loader!./Controller';
import Scene from '!!raw-loader!./Scene';
import type { TutorialStep } from '../..';
import content1 from './step1-content.md';

export const spineBoyAdventureTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: {
            index: code1,
            'src/SpineBoy.js': SpineBoy,
            'src/Controller.js': Controller,
            'src/Scene.js': Scene,
        },
    },
];
