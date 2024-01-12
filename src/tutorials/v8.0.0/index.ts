import { fishPondTutorialSteps } from './fishPond';
import { gettingStartedTutorialSteps } from './gettingStarted';

export default {
    gettingStarted: {
        description: 'Learn the basics of how to use PixiJS.',
        thumbnail: 'thumb_getting_started.png',
        steps: gettingStartedTutorialSteps,
    },
    fishPond: {
        description: 'Let\'s create a lively fish pond!',
        thumbnail: 'thumb_fish_pond.png',
        steps: fishPondTutorialSteps,
    },
};
