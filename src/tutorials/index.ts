import tutorials3d from './generated-3d';
import v7 from './v7.0.0/tutorialsData.json';
import v8 from './v8.0.0/tutorialsData.json';

import type { PackageId } from '@site/src/data/packages';
import type { ComponentType } from 'react';

/**
 * A step's editor files. A string is `src/index.js`; in a map, `index` is `src/index.js`, and a `*` after a file
 * name opens that file first and a `!` keeps it out of the tabs
 */
export type StepCode = string | Record<string, string>;

export interface TutorialStep {
  /** The step's name in the step list */
  header: string;
  /** The step's text, starting with its `# heading` */
  Content: ComponentType;
  code: StepCode;
  /** The files once the step is done; "Solution" swaps them in */
  completedCode?: StepCode;
}

/**
 * A tutorial's steps. Each tutorial page imports its own (`<Tutorial content>`), so they load with that route and
 * never with the gallery or another tutorial.
 */
export interface TutorialContent {
  steps: TutorialStep[];
  /** Version ranges for packages the code imports that the runtime doesn't pin */
  extraPackages?: Record<string, string>;
}

/** A tutorial's card in the gallery */
export interface TutorialMeta {
  /** Slug of the page under the package's tutorials route */
  id: string;
  title: string;
  description: string;
  steps: number;
  thumbnail?: string;
  level?: string;
  minutes?: number;
}

const with2dThumbnails = (tutorials: Omit<TutorialMeta, 'thumbnail'>[]): TutorialMeta[] =>
  tutorials.map((tutorial) => ({ ...tutorial, thumbnail: `/images/tutorials/2d/${tutorial.id}.webp` }));

const TUTORIALS_2D: Record<string, TutorialMeta[]> = { current: with2dThumbnails(v8), '7.x': with2dThumbnails(v7) };

/** A package version's tutorials, in gallery order */
export function getTutorials(pkg: PackageId, versionName: string): TutorialMeta[] {
  return pkg === '3d' ? tutorials3d : (TUTORIALS_2D[versionName] ?? TUTORIALS_2D.current);
}
