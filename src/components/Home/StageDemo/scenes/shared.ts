import { Material3D } from '@pixi/3d';
import '@pixi/3d/webgl';
import '@site/src/utils/pixi3dCompat';

import { CLAY, ENVIRONMENTS } from '../../Hero/field/lighting';
import { STAGE_INK } from './core';

import type { Hemisphere } from '@pixi/3d';
import type { StageTheme } from './core';

export * from './core';

interface Palette {
  /** Hemisphere light; light theme lifts the ground bounce, as the hero does */
  environment: Hemisphere;
  key: number;
  floor: number;
  hud: number;
  shadow: number;
}

export const PALETTES: Record<StageTheme, Palette> = {
  dark: {
    environment: ENVIRONMENTS.dark,
    key: 1.5,
    floor: 0x1c1924,
    ...STAGE_INK.dark,
  },
  light: {
    environment: ENVIRONMENTS.light,
    key: 1.3,
    floor: 0xe7e3f2,
    ...STAGE_INK.light,
  },
};

/** The glossy clay of the hero and the pre-rendered shapes (section 8.1) */
export const clay = (baseColor: number) =>
  new Material3D({
    baseColor,
    roughness: CLAY.roughness,
    clearcoat: { factor: CLAY.clearcoat, roughness: CLAY.clearcoatRoughness },
    emissive: { color: baseColor, strength: CLAY.emissive },
  });
