import examples3d from '@site/src/data/generated/examples-3d.json';

import type { ClayShapeName } from '@site/src/components/ui/Clay';
import type { StageDemoProps, StageTab } from '../StageDemo';
import type { Tile } from '../TileGrid';

/** Copy and data for `/3d` (section 8.6). Code samples are checked against `@pixi/3d` 0.1.0-beta.2 and pixi.js 8.22 */

export const HERO = {
  install: 'npm install @pixi/3d',
};

export interface ParityCard {
  title: string;
  /** The class the card is about, shown as a tag */
  api: string;
  code: string;
  text: string;
}

const CARDS: ParityCard[] = [
  {
    title: 'Same stage',
    api: 'View3D',
    code: `
const view = new View3D({ autoResize: true });
app.stage.addChild(background, view, hud);`,
    text: 'A View3D is a container, so you can put it under sprites, over a background or behind a 2D filter.',
  },
  {
    title: 'Same loader',
    api: 'Model3D',
    code: `
const robot = new Model3D(
  await Assets.load<Scene3DSource>('robot.glb'),
);
view.root.addChild(robot);`,
    text: 'Assets loads glTF and GLB, including Draco and meshopt compression.',
  },
  {
    title: 'Same events',
    api: 'eventMode',
    code: `
mesh.eventMode = 'static';
mesh.cursor = 'pointer';
mesh.on('pointertap', () => spin(mesh));`,
    text: 'Ray-picked pointer events with the names, bubbling and cursors you use in 2D.',
  },
  {
    title: '2D on 3D',
    api: 'ContainerTexture',
    code: `
const face = new ContainerTexture({ container: ui });

cube.material = new Material3D({ baseColorTexture: face });
app.ticker.add(() => face.render(app.renderer));`,
    text: 'Render any 2D container onto a mesh every frame.',
  },
];

export const PARITY = { eyebrow: 'NOTHING NEW TO LEARN', title: 'The same easy-to-use API.', cards: CARDS };

/**
 * The tour's code: each tab is its scene in miniature, at most 20 lines of 50 characters, which is what the code
 * card shows without scrolling. `app` is the Application you already have; the first tab makes the `view` the
 * others add to.
 */
const CODE_MESHES = `
import { Assets } from 'pixi.js';
import {
  DirectionalLight, Model3D, View3D,
} from '@pixi/3d';

const view = new View3D({ autoResize: true });
app.stage.addChild(view);

// glTF loads through Assets, like a texture
const fox = new Model3D({
  source: await Assets.load('fox.glb'),
  scale: 0.01,
});
// and its animations play by name
fox.player?.play('Survey');

const sun = new DirectionalLight({
  castShadow: true,
});
view.root.addChild(fox, sun);
`;

const CODE_TEXTURE = `
import {
  ContainerTexture, CubeGeometry,
  Material3D, Mesh3D,
} from '@pixi/3d';

// screen is any 2D container: sprites, text, UI.
// It's drawn into a texture every frame
const face = new ContainerTexture({
  container: screen,
  renderer: app.renderer,
  autoUpdate: true,
});

// and worn by a cube
const geometry = new CubeGeometry();
const material = new Material3D({
  baseColorTexture: face,
});
const cube = new Mesh3D({ geometry, material });
view.root.addChild(cube);
`;

const CODE_BILLBOARDS = `
import { Assets } from 'pixi.js';
import { Sprite3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';

const texture = await Assets.load('bunny.png');

// textured quads that turn to face the camera
for (let i = 0; i < 60; i++) {
  const angle = (i / 60) * Math.PI * 2;
  const bunny = new Sprite3D({
    texture,
    billboardMode: 'spherical',
    height: 0.4,
  });

  bunny.x = Math.cos(angle) * 2.5;
  bunny.z = Math.sin(angle) * 2.5;
  view.root.addChild(bunny);
}
new OrbitCamera({ view, autoRotate: true });
`;

const CODE_PICKING = `
import {
  CubeGeometry, Material3D, Mesh3D,
} from '@pixi/3d';

const geometry = new CubeGeometry();
const material = new Material3D();

for (let i = 0; i < 15; i++) {
  const cube = new Mesh3D({ geometry, material });

  cube.x = (i % 5) * 1.5 - 3;
  cube.z = Math.floor(i / 5) * 1.5 - 1.5;
  // the events you use in 2D, picked with a ray
  cube.eventMode = 'static';
  cube.cursor = 'pointer';
  cube.on('pointerover', () => (cube.y = 0.4));
  cube.on('pointerout', () => (cube.y = 0));
  cube.on('pointertap', () => cube.rotation.y++);
  view.root.addChild(cube);
}
`;

const poster = (tab: string) => ({
  dark: `/images/home/stage/tour3d-${tab}-dark.webp`,
  light: `/images/home/stage/tour3d-${tab}-light.webp`,
});

const CHIP = 'pixi.js + @pixi/3d';

const TOUR_TABS: StageTab[] = [
  {
    id: 'meshes',
    label: 'Meshes',
    chip: CHIP,
    code: CODE_MESHES,
    ariaLabel: 'A low-poly fox loaded from glTF looks around between a pink torus and a blue sphere.',
    tag: 'MODEL3D · MESH3D · DIRECTIONALLIGHT',
    pkg: '3d',
    hint: { fine: 'Click the fox to change its animation.', coarse: 'Tap the fox to change its animation.' },
    poster: poster('meshes'),
    credit: {
      label: 'Fox model, CC BY 4.0',
      to: 'https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox',
    },
  },
  {
    id: 'texture',
    label: '2D on 3D',
    chip: CHIP,
    code: CODE_TEXTURE,
    ariaLabel: 'A cube turns in 3D with a live 2D scene of hopping bunnies and a monster on its faces.',
    tag: 'CONTAINERTEXTURE · MATERIAL3D',
    pkg: '3d',
    hint: { fine: 'Click the cube.', coarse: 'Tap the cube.' },
    poster: poster('texture'),
  },
  {
    id: 'billboards',
    label: 'Billboards',
    chip: CHIP,
    code: CODE_BILLBOARDS,
    ariaLabel:
      'Sixty bunny sprites stand in a ring around four monsters, and every one turns to face the camera as it circles.',
    tag: 'SPRITE3D · ORBITCAMERA',
    pkg: '3d',
    hint: { fine: 'Drag to orbit the ring.', coarse: 'Every sprite turns to face the camera.' },
    poster: poster('billboards'),
  },
  {
    id: 'picking',
    label: 'Picking',
    chip: CHIP,
    code: CODE_PICKING,
    ariaLabel: 'A grid of fifteen clay cubes; the one under the pointer rises and turns pink, and a tap spins it.',
    tag: 'EVENTMODE · POINTERTAP · CURSOR',
    pkg: '3d',
    hint: { fine: 'Hover a cube and click to spin it.', coarse: 'Tap a cube to spin it.' },
    poster: poster('picking'),
  },
];

export const TOUR: StageDemoProps = {
  eyebrow: 'TAKE THE TOUR',
  title: 'See it running.',
  lede: 'Each tab runs live beside the code that draws it.',
  tabs: TOUR_TABS,
  defaultTab: 'meshes',
  scene: () => import(/* webpackChunkName: "home-tour-3d" */ '../StageDemo/scenes/tour3d'),
  links: [
    { label: 'Browse the 3D examples', to: '/3d/examples' },
    { label: 'Read the 3D guide', to: '/3d/guides/getting-started/intro' },
  ],
};

/** The wide tiles' stills are drawn by `scripts/render-home-3d.mjs` */
const TILES: Tile[] = [
  {
    title: 'glTF 2.0',
    text: 'Skins, morph targets and animations, KHR materials and lights, Draco and meshopt compression. Load with `Assets` and play animations with `model.player`.',
    still: 'gltf',
    credit: 'ToyCar by Guido Odendahl and Eric Chadwick, CC0',
  },
  {
    title: 'Lights & shadows',
    text: 'Directional, point, spot and ambient lights, up to 32 per view, with soft PCF shadows and cascades.',
    icon: 'sun',
  },
  {
    title: 'Post-processing',
    text: 'Bloom, SSAO, FXAA, tilt-shift and outlines, from `@pixi/3d/extras`.',
    icon: 'blend',
  },
  {
    title: 'PBR materials',
    text: 'Metallic-roughness with clearcoat, sheen, iridescence, transmission, specular and anisotropy, lit by environment maps or a hemisphere.',
    still: 'pbr',
  },
  {
    title: 'Particles',
    text: 'Fire, smoke, sparks and flipbooks from one options object, with `ParticleSystem3D`.',
    icon: 'sparkles',
  },
  {
    title: 'Instancing',
    text: '`BatchedMesh3D` draws thousands of copies, culled on the GPU under WebGPU.',
    icon: 'layers',
  },
  {
    title: 'Cameras',
    text: '`OrbitCamera` and `FPSCamera`, ready to drop in.',
    icon: 'eye',
  },
  {
    title: 'Stylised',
    text: 'Toon, Phong and flat materials for when PBR is too real.',
    icon: 'wand-sparkles',
  },
  {
    title: 'Lean',
    text: 'Import `@pixi/3d` and it downloads only the backend your renderer picks.',
    icon: 'package',
  },
];

export const BENTO = { eyebrow: 'FEATURES', title: 'A full 3D engine.', tiles: TILES };

export interface GalleryItem {
  name: string;
  category: string;
  title: string;
  /** One line for the card; the examples' own descriptions run to three */
  blurb: string;
  /** Stands in for the preview until it's captured */
  shape: ClayShapeName;
}

const GALLERY_PICKS: [name: string, shape: ClayShapeName, blurb: string][] = [
  ['showcase_golden-palace', 'pyramid-pink', 'A palace made of built-in shapes, with gold that reflects the sunset.'],
  ['showcase_voxel-islands', 'cube-violet', 'Floating islands in one batched mesh, under a tilt-shift blur.'],
  ['materials_toon', 'torus-cyan', 'Banded shading, a rim light and ink outlines.'],
  ['models_viewer', 'capsule-rose', 'Drop in a .glb and orbit your own model.'],
  ['particles_campfire', 'sphere-pink', 'Flames, smoke and embers from three particle systems.'],
  ['2d-and-3d_live-texture', 'cube-pink', 'A live 2D scene, drawn onto a turning cube every frame.'],
];

const titleCase = (words: string) =>
  words
    .split('-')
    .map((word, i) => (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
    .replace(/\b2d\b/gi, '2D')
    .replace(/\b3d\b/gi, '3D');

/** The six gallery examples that exist in `examples-3d.json`; empty in stub mode, which hides the section */
export const GALLERY = {
  eyebrow: 'BUILT WITH PIXIJS 3D',
  title: 'See it move.',
  items: GALLERY_PICKS.flatMap(([name, shape, blurb]): GalleryItem[] => {
    if (!examples3d.some((item) => item.name === name)) return [];
    const [category, title] = name.split('_');

    return [{ name, category: titleCase(category), title: titleCase(title), blurb, shape }];
  }),
};

export const CLOSING = {
  title: 'Bring your stage into the third dimension.',
  lede: 'Start from the app you already have. Add a View3D and see what happens.',
};
