import { CapsuleGeometry, Material3D, SphereGeometry, TorusGeometry } from '@pixi/3d';
import { Texture } from 'pixi.js';
import { BUNNY_PIXELS, DEPTH_PX, PX } from './bunny';
import { roundedCylinderGeometry } from './roundedCylinderGeometry';
import { roundedPyramidGeometry } from './roundedPyramidGeometry';
import { extrudeSprite } from './spriteExtrude';
import { superellipsoidGeometry } from './superellipsoidGeometry';
import { CAPSULE, CUBE, CYLINDER, OCTAHEDRON, PYRAMID, SPHERE, TINTS, TORUS } from './kinds';
import { CLAY, ENVIRONMENTS, LIGHT_AXIS } from './lighting';

import type { DirectionalLight, Geometry3D, Hemisphere, View3D } from '@pixi/3d';
import type { ClayKind, ImageTint } from './kinds';

export type FieldTheme = 'light' | 'dark';

interface Palette {
  /** Bright enough for the shadow catcher, which needs the environment and key to clamp it to white */
  environment: Hemisphere;
  keyIntensity: number;
  /**
   * How much of the environment the shapes take (their occlusion): a full share washes them out to
   * pastels, and turning the environment itself down would darken the catcher instead
   */
  ambient: number;
  /** The ground the field sits on: `--px-hero` */
  floorColor: number;
}

export const PALETTES: Record<FieldTheme, Palette> = {
  light: {
    environment: ENVIRONMENTS.light,
    keyIntensity: 1.3,
    ambient: 0.67,
    floorColor: 0xffffff,
  },
  dark: {
    environment: ENVIRONMENTS.dark,
    keyIntensity: 1.3,
    ambient: 0.52,
    floorColor: 0x14131c,
  },
};

/**
 * The direction the key light travels in, much nearer the camera axis than {@link LIGHT_AXIS}: shapes
 * float in front of the surface their shadows land on, and every unit of gap multiplies the light's tilt.
 */
export const KEY_DIRECTION = { x: -0.19, y: -0.1, z: -0.98 };

/** One geometry per clay kind, shared by every shape of it */
export function createClayGeometries(): Record<ClayKind, Geometry3D> {
  return {
    sphere: new SphereGeometry(SPHERE),
    cube: superellipsoidGeometry(CUBE),
    octahedron: superellipsoidGeometry(OCTAHEDRON),
    cylinder: roundedCylinderGeometry(CYLINDER),
    pyramid: roundedPyramidGeometry(PYRAMID),
    torus: new TorusGeometry(TORUS),
    capsule: new CapsuleGeometry(CAPSULE),
  };
}

/** The bunny's voxels */
export function createBunnyGeometry(): Geometry3D {
  return extrudeSprite(BUNNY_PIXELS, DEPTH_PX, PX);
}

/** Glossy clay in `tint` */
export function createClayMaterial(tint: ImageTint): Material3D {
  return new Material3D({
    baseColor: TINTS[tint],
    roughness: CLAY.roughness,
    metallic: 0,
    emissive: { color: TINTS[tint], strength: CLAY.emissive },
    clearcoat: { factor: CLAY.clearcoat, roughness: CLAY.clearcoatRoughness },
  });
}

/** How much the bunny's texture is blown up, so its pixels stay hard-edged close up */
const CRISP_SCALE = 16;

/**
 * The bunny's voxels: its sprite, alpha-masked to the silhouette, with a satin finish rather than the clay's coat, as
 * the beta launch film's bunnies have, and lit a little from within by the same sprite so its colours stay true under
 * the field's dim fill. The sprite is blown up with hard pixel edges and mipmapped, so it stays crisp at any size
 * through a linear sampler. Destroy it with `destroy(true)` to free the texture too.
 */
export function createBunnyMaterial(): Material3D {
  const { width, height, data } = BUNNY_PIXELS;
  const sprite = document.createElement('canvas');
  const crisp = document.createElement('canvas');

  sprite.width = width;
  sprite.height = height;
  sprite.getContext('2d')?.putImageData(new ImageData(Uint8ClampedArray.from(data), width, height), 0, 0);
  crisp.width = width * CRISP_SCALE;
  crisp.height = height * CRISP_SCALE;

  const context = crisp.getContext('2d');

  if (context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(sprite, 0, 0, crisp.width, crisp.height);
  }

  const texture = Texture.from({ resource: crisp, scaleMode: 'linear', autoGenerateMipmaps: true });

  return new Material3D({
    baseColorTexture: texture,
    alphaMode: 'mask',
    alphaCutoff: 0.5,
    metallic: 0,
    roughness: 0.62,
    emissive: { color: 0xffffff, strength: 0.18, texture },
  });
}

/** Lights `view` and `key` for `theme`, and sets how much of that light `materials` take */
export function lightClay(view: View3D, key: DirectionalLight, theme: FieldTheme, materials: Material3D[]): void {
  view.environment = { ...PALETTES[theme].environment, up: { ...LIGHT_AXIS } };
  key.intensity = PALETTES[theme].keyIntensity;
  for (const material of materials) material.occlusionStrength = PALETTES[theme].ambient;
}

export interface ClayAssets {
  geometries: Record<ClayKind, Geometry3D>;
  materials: Record<ImageTint, Material3D>;
  /** Lights `view` and `key` for `theme`; cheap enough to call for every render, as it only relights on a new theme */
  apply(view: View3D, key: DirectionalLight, theme: FieldTheme): void;
  destroy(): void;
}

/** One geometry per kind and one material per tint, for `scripts/render-clay.mjs` */
export function createClayAssets(): ClayAssets {
  const geometries = createClayGeometries();
  const tints = Object.keys(TINTS) as ImageTint[];
  const materials = Object.fromEntries(tints.map((tint) => [tint, createClayMaterial(tint)])) as Record<
    ImageTint,
    Material3D
  >;
  let lit: FieldTheme | undefined;

  return {
    geometries,
    materials,
    apply(view, key, theme) {
      if (lit === theme) return;
      lit = theme;
      lightClay(view, key, theme, Object.values(materials));
    },
    destroy() {
      for (const geometry of Object.values(geometries)) geometry.destroy();
      for (const material of Object.values(materials)) material.destroy();
    },
  };
}
