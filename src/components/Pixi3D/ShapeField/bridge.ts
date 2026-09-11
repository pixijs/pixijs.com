import type { ColorMode } from '@docusaurus/theme-common';

/**
 * Messages between this page and the framed hero, both served from this origin. The frame can't
 * see the colour mode, its visibility or the pointer, so the page sends them.
 *
 * Keep in step with `src/bridge.ts` in the `pixijs-3d-hero` project.
 */
export const CHANNEL = 'pixi3d-hero';

export type HostMessage =
  | { channel: typeof CHANNEL; type: 'theme'; theme: ColorMode }
  | { channel: typeof CHANNEL; type: 'active'; active: boolean }
  /** Pointer position in the hero's own pixels, from its top left. */
  | { channel: typeof CHANNEL; type: 'pointer'; x: number; y: number };

type FrameMessage =
  | { channel: typeof CHANNEL; type: 'ready' }
  /** WebGL refused; the hero keeps its flat ground and the frame is hidden. */
  | { channel: typeof CHANNEL; type: 'failed' };

export const isFrameMessage = (data: unknown): data is FrameMessage =>
  typeof data === 'object' && data !== null && (data as { channel?: unknown }).channel === CHANNEL;
