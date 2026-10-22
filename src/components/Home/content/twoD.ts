import examples from '@site/src/data/generated/examples.json';

import type { StageDemoProps, StageTab } from '../StageDemo';
import type { Tile } from '../TileGrid';

const poster = (tab: string) => ({
  dark: `/images/home/stage/tour2d-${tab}-dark.webp`,
  light: `/images/home/stage/tour2d-${tab}-light.webp`,
});

/**
 * The tour's code, checked against pixi.js 8.22. Each tab is its scene in miniature, not its source: at most 20
 * lines of 50 characters, which is what the code card shows without scrolling. `app` is the Application the command
 * above scaffolds, and asset paths are relative.
 */
const CODE_SPRITES = `
import { Assets, Sprite } from 'pixi.js';

const texture = await Assets.load('bunny.png');

// one texture, so every bunny shares a batch
const bunnies = Array.from({ length: 300 }, () =>
  app.stage.addChild(new Sprite(texture)),
);

app.ticker.add(({ lastTime }) => {
  bunnies.forEach((bunny, i) => {
    const hop = Math.sin(lastTime / 300 + i);

    bunny.x = (i * 37) % app.screen.width;
    bunny.y = 400 - Math.abs(hop) * 300;
  });
});
`;

const CODE_GRAPHICS = `
import { FillGradient, Graphics } from 'pixi.js';

const gradient = new FillGradient({
  colorStops: [
    { offset: 0, color: 0xe91e63 },
    { offset: 1, color: 0x8b5cf6 },
  ],
});
const tile = new Graphics()
  .roundRect(0, 0, 100, 100, 26)
  .fill(gradient);
const blob = new Graphics();

app.stage.addChild(tile, blob);

// cheap to rebuild: redraw the blob every frame
app.ticker.add(({ lastTime }) => {
  const r = 60 + Math.sin(lastTime / 500) * 20;
  blob.clear().circle(200, 80, r).fill(0x38bdf8);
});
`;

const CODE_TEXT = `
import { gsap } from 'gsap';
import { SplitText } from 'pixi.js';

const title = new SplitText({
  text: 'PixiJS',
  style: { fontFamily: 'Outfit', fontSize: 120 },
  charAnchor: 0.5,
});

app.stage.addChild(title);

// every character is its own Text: tween them
gsap.to(title.chars, {
  y: -20,
  stagger: {
    each: 0.08,
    repeat: -1,
    yoyo: true,
  },
});
`;

const CODE_FILTERS = `
import {
  BlurFilter, ColorMatrixFilter,
} from 'pixi.js';

// back and front are two layers of sprites.
// Depth of field: the back one goes soft
back.filters = [new BlurFilter({ strength: 6 })];

// while the front one cycles through hues
const colors = new ColorMatrixFilter();
let degrees = 0;

front.filters = [colors];
app.ticker.add(({ deltaTime }) => {
  degrees = (degrees + deltaTime) % 360;
  colors.hue(degrees, false);
});
`;

const TABS: StageTab[] = [
  {
    id: 'sprites',
    label: 'Sprites',
    chip: 'pixi.js',
    code: CODE_SPRITES,
    ariaLabel: 'Hundreds of bunnies bounce around the card, all drawn from one texture.',
    tag: 'SPRITE · TEXTURE · TICKER',
    pkg: '2d',
    hint: { fine: 'Click to add 200 bunnies.', coarse: 'Tap to add 200 bunnies.' },
    poster: poster('sprites'),
  },
  {
    id: 'graphics',
    label: 'Graphics',
    chip: 'pixi.js',
    code: CODE_GRAPHICS,
    ariaLabel: 'A star, a gradient tile and a wobbling blob, redrawn as vector shapes on every frame.',
    tag: 'GRAPHICS · FILLGRADIENT · BEZIER',
    pkg: '2d',
    hint: { fine: 'Move the pointer to pull the blob.', coarse: 'Drag to pull the blob.' },
    poster: poster('graphics'),
  },
  {
    id: 'text',
    label: 'Text',
    chip: 'pixi.js + gsap',
    code: CODE_TEXT,
    ariaLabel: 'The word PixiJS, its letters rising and falling in a wave.',
    tag: 'SPLITTEXT · TEXT · TEXTSTYLE',
    pkg: '2d',
    hint: { fine: 'Click a letter.', coarse: 'Tap a letter.' },
    poster: poster('text'),
  },
  {
    id: 'filters',
    label: 'Filters',
    chip: 'pixi.js',
    code: CODE_FILTERS,
    ariaLabel: 'Monsters stand in two layers. The back one is blurred and the front one cycles through hues.',
    tag: 'BLURFILTER · COLORMATRIXFILTER',
    pkg: '2d',
    hint: { fine: 'Click to shift the focus.', coarse: 'Tap to shift the focus.' },
    poster: poster('filters'),
  },
];

/** The tour on `/2d` (section 8.5 item 5) */
export const TOUR_2D: StageDemoProps = {
  eyebrow: 'TAKE THE TOUR',
  title: 'See it running.',
  lede: 'Each tab runs live beside the code that draws it.',
  tabs: TABS,
  defaultTab: 'sprites',
  scene: () => import(/* webpackChunkName: "home-tour2d" */ '../StageDemo/scenes/tour2d'),
  badge: 'PIXI.JS · NO PLUGINS',
  links: [
    { label: 'Browse the examples', to: '/8.x/examples' },
    { label: 'Read the guides', to: '/8.x/guides/getting-started/intro' },
  ],
};

const listed = examples.filter((example) => !('hidden' in example && example.hidden)).length;

/** "100+": the gallery's examples, rounded down to the nearest ten */
export const EXAMPLE_COUNT = `${Math.floor(listed / 10) * 10}+`;

export interface ExampleTeaser {
  /** Example name, as in `?example=` and the preview files */
  id: string;
  title: string;
  category: string;
  blurb: string;
}

/** Six examples from the gallery, picked to cover the toolbox and to look different from each other */
export const EXAMPLES: ExampleTeaser[] = [
  {
    id: 'mesh_shader-toy',
    title: 'Shader toy',
    category: 'Mesh',
    blurb: 'A full-screen quad running a ShaderToy-style shader.',
  },
  {
    id: 'rendering_render-texture_scratch-card',
    title: 'Scratch card',
    category: 'Render texture',
    blurb: "Brush strokes drawn into a texture reveal what's underneath.",
  },
  {
    id: 'text_filters_cartoon',
    title: 'Cartoon text',
    category: 'Text',
    blurb: 'A custom filter gives a Text its outline, shadow and gradient.',
  },
  {
    id: 'graphics_mask_animation',
    title: 'Mask animation',
    category: 'Graphics',
    blurb: 'A shape redrawn every frame masks the scene.',
  },
  {
    id: 'misc_star-warp',
    title: 'Star warp',
    category: 'Sprites',
    blurb: 'A thousand sprites, projected from 3D to 2D.',
  },
  {
    id: 'rendering_render-layer',
    title: 'Render layer',
    category: 'Rendering',
    blurb: "Each fish's name tag draws on a layer above the pond's ripple filter.",
  },
];

const TILES: Tile[] = [
  {
    title: 'Meshes & shaders',
    text: '`MeshRope`, `MeshPlane`, `PerspectiveMesh` or geometry of your own, with shaders in GLSL and WGSL.',
    still: 'mesh',
  },
  {
    title: 'Sprites',
    text: '`Sprite`, `AnimatedSprite` for frame animation, `TilingSprite` for repeating patterns and `NineSliceSprite` for panels that scale.',
    icon: 'images',
  },
  {
    title: 'Graphics',
    text: 'Shapes, curves, holes, gradients and texture fills on the GPU. Import and export SVG.',
    icon: 'blend',
  },
  {
    title: 'Filters & blend modes',
    text: 'Blur, colour matrix, displacement and noise are built in, with nearly 40 more in `pixi-filters`. Blend modes include screen, overlay and luminosity.',
    still: 'filters',
  },
  {
    title: 'Text',
    text: '`Text` for rich styles, `BitmapText` for speed, `HTMLText` for markup and `SplitText` to animate each letter.',
    icon: 'type',
  },
  {
    title: 'Masks & render textures',
    text: 'Mask with a sprite, a shape or a colour channel. Render any container into a texture, or cache it as one.',
    icon: 'layers',
  },
  {
    title: 'Events & accessibility',
    text: 'Pointer events that bubble like the DOM, with hit areas and cursors. Screen reader support is built in.',
    icon: 'hand',
  },
  {
    title: 'Assets',
    text: '`Assets` loads textures, spritesheets, fonts, SVG, video and compressed textures, one by one or in bundles.',
    icon: 'download',
  },
  {
    title: 'WebGPU or WebGL',
    text: "Ask for WebGPU and PixiJS falls back to WebGL where it isn't there. An experimental Canvas renderer covers the rest.",
    icon: 'cpu',
  },
];

/** "The whole 2D toolbox": the feature bento on `/2d` */
export const TOOLBOX = { eyebrow: 'FEATURES', title: 'The whole 2D toolbox.', tiles: TILES };

export interface Stat {
  value: number;
  /** Shown after the number */
  unit?: string;
  /** Inline code is marked with backticks */
  label: string;
}

/** The performance band: Bunnymark results from the v8 launch posts, and the live field's caps */
export const PERFORMANCE = {
  eyebrow: 'PERFORMANCE',
  title: 'A million particles at 60 fps.',
  stats: [
    { value: 1_000_000, label: 'particles at 60 fps in one `ParticleContainer`' },
    { value: 200_000, label: 'sprites at 60 fps in a plain `Container`' },
    { value: 0.12, unit: 'ms', label: 'of CPU a frame for 100,000 sprites at rest' },
  ] satisfies Stat[],
};

export const CLOSING = {
  title: 'Your first sprite is a minute away.',
  lede: 'Scaffold a project, load a texture and add it to the stage.',
};
