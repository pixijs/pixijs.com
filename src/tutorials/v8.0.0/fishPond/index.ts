import type { TutorialStep } from '../..';
import content1 from './step1/step1-content.md';
import content2 from './step2/step2-content.md';
import content3 from './step3/step3-content.md';
import content4 from './step4/step4-content.md';
import content5 from './step5/step5-content.md';
import content6 from './step6/step6-content.md';
import code1 from '!!raw-loader!./step1/step1-code';
import code1Completed from '!!raw-loader!./step1/step1-code-completed';
import code2 from '!!raw-loader!./step2/step2-code';
import code3 from '!!raw-loader!./step3/step3-code';
import code4 from '!!raw-loader!./step4/step4-code';
import code5 from '!!raw-loader!./step5/step5-code';
import code6 from '!!raw-loader!./step6/step6-code';
import addBackground from '!!raw-loader!./step2/addBackground';
import addBackgroundCompleted from '!!raw-loader!./step2/addBackground-completed';
import addFishes from '!!raw-loader!./step3/addFishes';
import addFishesCompleted from '!!raw-loader!./step3/addFishes-completed';
import addWaterOverlay from '!!raw-loader!./step4/addWaterOverlay';
import addWaterOverlayCompleted from '!!raw-loader!./step4/addWaterOverlay-completed';
import addDisplacementEffect from '!!raw-loader!./step5/addDisplacementEffect';
import addDisplacementEffectCompleted from '!!raw-loader!./step5/addDisplacementEffect-completed';

export const fishPondTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
        completedCode: code1Completed,
    },
    {
        header: 'Adding Background',
        Content: content2,
        code: {
            index: code2,
            'src/addBackground.js': addBackground,
        },
        completedCode: {
            index: code2,
            'src/addBackground.js$': addBackgroundCompleted,
        },
    },
    {
        header: 'Adding Fishes',
        Content: content3,
        code: {
            index: code3,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js': addFishes,
        },
        completedCode: {
            index: code3,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js$': addFishesCompleted,
        },
    },
    {
        header: 'Adding Water Overlay',
        Content: content4,
        code: {
            index: code4,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js*': addFishesCompleted,
            'src/addWaterOverlay.js': addWaterOverlay,
        },
        completedCode: {
            index: code4,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js*': addFishesCompleted,
            'src/addWaterOverlay.js$': addWaterOverlayCompleted,
        },
    },
    {
        header: 'Adding Displacement Effect',
        Content: content5,
        code: {
            index: code5,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js*': addFishesCompleted,
            'src/addWaterOverlay.js*': addWaterOverlayCompleted,
            'src/addDisplacementEffect.js': addDisplacementEffect,
        },
        completedCode: {
            index: code5,
            'src/addBackground.js*': addBackgroundCompleted,
            'src/addFishes.js*': addFishesCompleted,
            'src/addWaterOverlay.js*': addWaterOverlayCompleted,
            'src/addDisplacementEffect.js$': addDisplacementEffectCompleted,
        },
    },
    {
        header: 'You did it!',
        Content: content6,
        code: {
            index: code6,
            'src/addBackground.js': addBackgroundCompleted,
            'src/addFishes.js': addFishesCompleted,
            'src/addWaterOverlay.js': addWaterOverlayCompleted,
            'src/addDisplacementEffect.js': addDisplacementEffectCompleted,
        },
    },
];
