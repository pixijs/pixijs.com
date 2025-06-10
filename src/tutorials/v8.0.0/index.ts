import { chooChooTrainTutorialSteps } from './chooChooTrain';
import { fishPondTutorialSteps } from './fishPond';
import { gettingStartedTutorialSteps } from './gettingStarted';
import { spineBoyAdventureTutorialSteps } from './spineBoyAdventure';

export default {
  gettingStarted: {
    description: 'Learn the basics of how to use PixiJS.',
    thumbnail: 'thumb_getting_started.png',
    steps: gettingStartedTutorialSteps,
  },
  fishPond: {
    description: "Let's create a lively fish pond!",
    thumbnail: 'thumb_fish_pond.png',
    steps: fishPondTutorialSteps,
  },
  chooChooTrain: {
    description: 'Onboard the graphical Choo Choo Train!',
    thumbnail: 'thumb_choo_choo_train.png',
    steps: chooChooTrainTutorialSteps,
  },
  spineBoyAdventure: {
    description: 'Behold the power of interactive Spine animation!',
    thumbnail: 'thumb_spineboy_adventure.png',
    steps: spineBoyAdventureTutorialSteps,
    extraPackages: {
      '@esotericsoftware/spine-pixi-v8': '^4.2.66',
    },
  },
};
