import content1 from './step1/step1-content.md';
import content2 from './step2/step2-content.md';
import content3 from './step3/step3-content.md';
import content4 from './step4/step4-content.md';
import content5 from './step5/step5-content.md';
import content6 from './step6/step6-content.md';
import content7 from './step7/step7-content.md';
import content8 from './step8/step8-content.md';
import content9 from './step9/step9-content.md';
import content10 from './step10/step10-content.md';
import code1 from '!!raw-loader!./step1/step1-code';
import addStars from '!!raw-loader!./step2/addStars';
import addStarsCompleted from '!!raw-loader!./step2/addStars-completed';
import code2 from '!!raw-loader!./step2/step2-code';
import addMoon from '!!raw-loader!./step3/addMoon';
import addMoonCompleted from '!!raw-loader!./step3/addMoon-completed';
import moonSvg from '!!raw-loader!./step3/moon.svg';
import code3 from '!!raw-loader!./step3/step3-code';
import addMountains from '!!raw-loader!./step4/addMountains';
import addMountainsCompleted from '!!raw-loader!./step4/addMountains-completed';
import code4 from '!!raw-loader!./step4/step4-code';
import addTrees from '!!raw-loader!./step5/addTrees';
import addTreesCompleted from '!!raw-loader!./step5/addTrees-completed';
import code5 from '!!raw-loader!./step5/step5-code';
import addGround from '!!raw-loader!./step6/addGround';
import addGroundCompleted from '!!raw-loader!./step6/addGround-completed';
import code6 from '!!raw-loader!./step6/step6-code';
import addTrain from '!!raw-loader!./step7/addTrain';
import addTrainCompleted from '!!raw-loader!./step7/addTrain-completed';
import code7 from '!!raw-loader!./step7/step7-code';
import addTrain2 from '!!raw-loader!./step8/addTrain';
import addTrainCompleted2 from '!!raw-loader!./step8/addTrain-completed';
import code8 from '!!raw-loader!./step8/step8-code';
import addSmokes from '!!raw-loader!./step9/addSmokes';
import addSmokesCompleted from '!!raw-loader!./step9/addSmokes-completed';
import code9 from '!!raw-loader!./step9/step9-code';
import code10 from '!!raw-loader!./step10/step10-code';

import type { TutorialStep } from '../..';

export const chooChooTrainTutorialSteps: TutorialStep[] = [
    {
        header: 'Introduction',
        Content: content1,
        code: code1,
    },
    {
        header: 'Adding Stars',
        Content: content2,
        code: {
            index: code2,
            'src/addStars.js*': addStars,
        },
        completedCode: {
            index: code2,
            'src/addStars.js*': addStarsCompleted,
        },
    },
    {
        header: 'Adding Moon',
        Content: content3,
        code: {
            index: code3,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js*': addMoon,
            'src/moon.svg': moonSvg,
        },
        completedCode: {
            index: code3,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js*': addMoonCompleted,
            'src/moon.svg': moonSvg,
        },
    },
    {
        header: 'Adding Mountains',
        Content: content4,
        code: {
            index: code4,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js*': addMountains,
        },
        completedCode: {
            index: code4,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js*': addMountainsCompleted,
        },
    },
    {
        header: 'Adding Trees',
        Content: content5,
        code: {
            index: code5,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js*': addTrees,
        },
        completedCode: {
            index: code5,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js*': addTreesCompleted,
        },
    },
    {
        header: 'Adding Ground',
        Content: content6,
        code: {
            index: code6,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js*': addGround,
        },
        completedCode: {
            index: code6,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js*': addGroundCompleted,
        },
    },
    {
        header: 'Adding Train Head',
        Content: content7,
        code: {
            index: code7,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js*': addTrain,
        },
        completedCode: {
            index: code7,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js*': addTrainCompleted,
        },
    },
    {
        header: 'Adding Train Carriage',
        Content: content8,
        code: {
            index: code8,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js*': addTrain2,
        },
        completedCode: {
            index: code8,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js*': addTrainCompleted2,
        },
    },
    {
        header: 'Adding Smokes',
        Content: content9,
        code: {
            index: code9,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js!': addTrainCompleted2,
            'src/addSmokes.js*': addSmokes,
        },
        completedCode: {
            index: code9,
            'src/addStars.js!': addStarsCompleted,
            'src/addMoon.js!': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js!': addMountainsCompleted,
            'src/addTrees.js!': addTreesCompleted,
            'src/addGround.js!': addGroundCompleted,
            'src/addTrain.js!': addTrainCompleted2,
            'src/addSmokes.js*': addSmokesCompleted,
        },
    },
    {
        header: 'You did it!',
        Content: content10,
        code: {
            index: code10,
            'src/addStars.js': addStarsCompleted,
            'src/addMoon.js': addMoonCompleted,
            'src/moon.svg!': moonSvg,
            'src/addMountains.js': addMountainsCompleted,
            'src/addTrees.js': addTreesCompleted,
            'src/addGround.js': addGroundCompleted,
            'src/addTrain.js': addTrainCompleted2,
            'src/addSmokes.js': addSmokesCompleted,
        },
    },
];
