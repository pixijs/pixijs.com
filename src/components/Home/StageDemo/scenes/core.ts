import { Application, Assets, BitmapFontManager, BitmapText, Cache } from 'pixi.js';
import 'pixi.js/events';
import { NORMAL_MAP } from '@site/node_modules/@pixi/3d/dist/core/textures/DefaultTextures.mjs';

import { hasWebGL2 } from '../webgl';

import type { Spritesheet, Texture } from 'pixi.js';

/**
 * The scene contract and the helpers that need pixi.js alone. `shared.ts` re-exports these and adds the `@pixi/3d`
 * ones, so a 2D-only scene imports from here and keeps `@pixi/3d` out of its chunk.
 */

/*
 * One 4 KB module of `@pixi/3d`, the rest of which loads only with a 3D scene: it refuses to load unless its flat
 * normal map was the first texture made after pixi's own two, and pixi numbers textures from one counter for the
 * page. The `/2d` tour makes textures without `@pixi/3d`, which then failed on `/` and `/3d` for the rest of the
 * visit. Importing the module `@pixi/3d` itself imports makes that texture here, before any scene runs; reading
 * the export keeps the bundler from dropping the import, since the package marks the module side-effect free.
 */
if (NORMAL_MAP.source.uid !== 2) {
  console.warn('StageDemo: a texture was made before the @pixi/3d defaults, so 3D scenes may not start on this visit.');
}

export type StageTheme = 'light' | 'dark';

export interface SceneOptions {
  theme: StageTheme;
  /** Tab to show first, without a transition */
  tab?: string;
  /** Off: no ticker, a still pose and a render only when something changes (reduced motion, Pause motion, posters) */
  motion?: boolean;
  /** The in-canvas HUD; posters leave it out because it reports live numbers */
  hud?: boolean;
}

/** What `StageDemo` drives; a scene module exports `createScene(host, options): Promise<StageScene>` */
export interface StageScene {
  setTab(id: string): void;
  /** On screen and the tab visible: run the ticker */
  setActive(active: boolean): void;
  setTheme(theme: StageTheme): void;
  setMotion(motion: boolean): void;
  destroy(): void;
}

export type CreateScene = (host: HTMLElement, options: SceneOptions) => Promise<StageScene>;

/** The browser can't run the live scene; `StageDemo` keeps the posters and says so */
export class NoWebGLError extends Error {
  constructor() {
    super('WebGL2 is unavailable');
    this.name = 'NoWebGLError';
  }
}

export const SPRITES_URL = '/images/home/stage/sprites.json';

export const COLORS = { pink: 0xe91e63, violet: 0x8b5cf6, sky: 0x38bdf8 } as const;

/** HUD text colour and the strength of the sprites' contact shadows */
export const STAGE_INK: Record<StageTheme, { hud: number; shadow: number }> = {
  dark: { hud: 0xaab4c6, shadow: 0.34 },
  light: { hud: 0x4b5466, shadow: 0.16 },
};

/**
 * A transparent, card-sized app: the card paints the well, glow and grid, so the canvas, the posters and the
 * no-WebGL state all sit on the same backdrop. WebGL only, which avoids the WebGPU adapter stall (section 8.3);
 * the HUD reports the renderer. Pixi's default extension imports are skipped: the scenes import what they use
 * (events here, filters in the 2D tour, the 3D WebGL backend in `shared.ts`) and nothing else is fetched.
 */
export async function createStageApp(host: HTMLElement): Promise<{ app: Application; unobserve: () => void }> {
  if (!hasWebGL2()) throw new NoWebGLError();
  const app = new Application();

  await app.init({
    resizeTo: host,
    preference: ['webgl'],
    skipExtensionImports: true,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });
  app.canvas.style.display = 'block';
  host.appendChild(app.canvas);
  const observer = new ResizeObserver(() => app.queueResize());

  observer.observe(host);

  return { app, unobserve: () => observer.disconnect() };
}

export type SpriteName = 'bunny' | 'eggHead' | 'flowerTop' | 'helmlok' | 'skully';

/** The five sprites, packed by `scripts/render-stage-posters.mjs` so the page needs one request for them */
export async function loadSprites(): Promise<Record<SpriteName, Texture>> {
  const sheet = await Assets.load<Spritesheet>(SPRITES_URL);

  return sheet.textures as Record<SpriteName, Texture>;
}

const HUD_FONT = 'StageHUD';
const HUD_SIZE = 12;

/**
 * Roboto Mono, the site's mono, rasterised at twice the size so it stays sharp on retina screens. Once per visit:
 * the font outlives the scene that made it.
 */
export async function createHud(): Promise<BitmapText> {
  if (!Cache.has(`${HUD_FONT}-bitmap`)) {
    await Promise.race([
      document.fonts?.load(`500 ${HUD_SIZE}px "Roboto Mono"`),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  }
  // A second scene can get here while the first was waiting for the font
  if (!Cache.has(`${HUD_FONT}-bitmap`)) {
    BitmapFontManager.install({
      name: HUD_FONT,
      chars: [['A', 'Z'], ['0', '9'], ' ·+—'],
      resolution: 2,
      style: {
        fontFamily: '"Roboto Mono", ui-monospace, monospace',
        fontSize: HUD_SIZE,
        fontWeight: '500',
        fill: 0xffffff,
      },
    });
  }

  return new BitmapText({ text: '', style: { fontFamily: HUD_FONT, fontSize: HUD_SIZE, letterSpacing: 1.6 } });
}

/** Layout in a 1280×960 design frame fitted inside the card, so every aspect shows the posters' composition */
export interface Frame {
  width: number;
  height: number;
  /** CSS pixels per design unit */
  unit: number;
  x: (designX: number) => number;
  y: (designY: number) => number;
  /** Camera distance multiplier that keeps the 3D content inside the frame on cards narrower than 4:3 */
  reach: number;
}

export const DESIGN = { width: 1280, height: 960 } as const;

export function measure(width: number, height: number): Frame {
  const unit = Math.min(width / DESIGN.width, height / DESIGN.height);
  const left = (width - DESIGN.width * unit) / 2;
  const top = (height - DESIGN.height * unit) / 2;

  return {
    width,
    height,
    unit,
    x: (designX) => left + designX * unit,
    y: (designY) => top + designY * unit,
    reach: Math.max(1, DESIGN.width / DESIGN.height / (width / height)),
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic 0-1 stream (mulberry32), so a still pose and the posters come out the same on every run */
export function seeded(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
