import type { Hemisphere } from '@pixi/3d';

/**
 * How the clay is lit and finished, shared by the hero's field and the `/3d` tour so the clay reads the same in
 * both. No geometry here, so the tour's chunk takes these without the field's shapes.
 */

/**
 * Hemisphere axis: up and to the left, tipped slightly toward the camera. Every shape lights from the
 * same quarter, and because the fill is an environment rather than a lamp the bright side falls to the
 * dark side as one smooth gradient with no terminator across it.
 */
export const LIGHT_AXIS = { x: -0.52, y: 0.7, z: 0.49 };

/** The hemisphere light per theme; the light theme lifts the ground bounce */
export const ENVIRONMENTS: Record<'light' | 'dark', Hemisphere> = {
  light: { skyColor: 0xffffff, groundColor: 0x63529f, intensity: 1.35, up: LIGHT_AXIS },
  dark: { skyColor: 0xfdf7ff, groundColor: 0x1d1634, intensity: 1.25, up: LIGHT_AXIS },
};

/** Glossy clay: a satin base under a clear coat, self-lit just enough that no side goes black */
export const CLAY = { roughness: 0.55, clearcoat: 0.7, clearcoatRoughness: 0.22, emissive: 0.07 };
