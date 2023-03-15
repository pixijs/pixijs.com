import { gettingStartedTutorial } from './getting-started';

export interface TutorialStep
{
  title: string;
  Content: string;
  code: string;
  completedCode?: string;
}

export const tutorialData: Record<string, TutorialStep[]> = {
  gettingStarted: gettingStartedTutorial,
};
