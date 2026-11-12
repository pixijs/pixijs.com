import type { CreateScene } from './scenes/shared';
import type { ReactNode } from 'react';

export interface StageTab {
  id: string;
  label: string;
  /** Packages the code imports, in the code card's header */
  chip: string;
  code: string;
  /** The canvas's accessible name while this tab shows */
  ariaLabel: string;
  /** First tag over the canvas, such as `SPRITE · GRAPHICS · BITMAPTEXT` */
  tag: string;
  /** Package whose dot the tag carries */
  pkg: '2d' | '3d';
  /** What to try, worded for a mouse and for touch */
  hint: { fine: string; coarse: string };
  /** Still of the tab per theme, a site path; shown while the scene loads, without JS and without WebGL */
  poster: { dark: string; light: string };
  /** Credit for an asset the scene loads, linked to the page that names its authors and licence */
  credit?: StageLink;
}

export interface StageLink {
  label: string;
  to: string;
}

export interface StageDemoProps {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  tabs: StageTab[];
  defaultTab: string;
  /** Dynamic import of the scene module, so pixi.js loads only when the demo nears the viewport */
  scene: () => Promise<{ createScene: CreateScene }>;
  /** Prefix of the tab anchors (`#tour-sprites`) the tabs fall back to without JS */
  anchor?: string;
  /** Second tag over the canvas, on every tab */
  badge?: string;
  links?: StageLink[];
}
