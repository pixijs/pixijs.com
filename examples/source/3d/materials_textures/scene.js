/**
 * The props: the Damaged Helmet, the five maps its file ships, and the one-texel textures a slot holds with its map
 * off
 */

import { Material3D, Mesh3D, Model3D } from '@pixi/3d';

import { BufferImageSource, Texture } from 'pixi.js';

/** The material's five map slots, in the order the cards stand and the pane lists them */
export const MAP_SLOTS = [
  'baseColor',
  'metallicRoughness',
  'normal',
  'occlusion',
  'emissive',
];

/** The helmet's size and height on the stage: about three units across, floating just clear of its shadow */
const HELMET_SCALE = 1.55;
const HELMET_HEIGHT = 1.75;
/** It faces a little to the viewer's right and sways 0.3 either way every 18 s, so the key slides across the chrome */
const HELMET_YAW = 0.3;
const SWAY = 0.3;
const SWAY_SPEED = 0.35;

/** The helmet's model, and its one mesh, whose material the lesson replaces */

/** The five maps DamagedHelmet.glb ships, read off the material the loader built from it */
export function helmetMaps(source) {
  const material = source.materials[0];

  if (!(material instanceof Material3D) || !material.textures.emissive) {
    throw new Error(
      'DamagedHelmet.glb: expected a Material3D with an emissive map',
    );
  }

  const { baseColor, metallicRoughness, normal, occlusion, emissive } =
    material.textures;

  return { baseColor, metallicRoughness, normal, occlusion, emissive };
}

/** Builds the helmet from its file, upright as the file's own node stands it */
export function createHelmet(source) {
  // Its own shadow would darken the creases too, and a reader couldn't tell that from occlusion.
  const root = new Model3D({
    source,
    castShadow: true,
    receiveShadow: false,
    scale: HELMET_SCALE,
    y: HELMET_HEIGHT,
    rotation: { x: 0, y: HELMET_YAW, z: 0 },
  });
  const mesh = root.getChildByLabel(/damagedHelmet/, true);

  if (!(mesh instanceof Mesh3D))
    throw new Error(
      'DamagedHelmet.glb: expected a mesh labelled damagedHelmet',
    );

  return { root, mesh };
}

/** Turns the helmet to its yaw at `time` seconds */
export function swayHelmet(helmet, time) {
  helmet.root.rotation.y = HELMET_YAW + Math.sin(time * SWAY_SPEED) * SWAY;
}

/** A one-texel texture of one colour */
function solidTexture(r, g, b, label) {
  // The format is explicit: a Uint8Array alone means bgra8unorm, which WebGPU reads with red and blue swapped.
  const resource = new Uint8Array([r, g, b, 255]);

  return new Texture({
    source: new BufferImageSource({
      resource,
      width: 1,
      height: 1,
      format: 'rgba8unorm',
      label,
    }),
  });
}

/** A normal map that points straight out of the surface everywhere: (0, 0, 1), stored as (0.5, 0.5, 1) */
export const FLAT_NORMAL = solidTexture(128, 128, 255, 'flat normal');
/** Black everywhere: a glow map that adds no glow */
export const BLACK = solidTexture(0, 0, 0, 'black');
