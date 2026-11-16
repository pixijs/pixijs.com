import { Container3D, DirectionalLight, Material3D, Mesh3D, Model3D, View3D } from '@pixi/3d';
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js';
import { createBackdrop } from '../src/components/Home/Hero/field/backdrop';
import {
  createClayGeometries,
  createClayMaterial,
  KEY_DIRECTION,
  lightClay,
  PALETTES,
} from '../src/components/Home/Hero/field/clay';
import { KIND_PITCH, KIND_SCALE, MID_DIST, TINTS } from '../src/components/Home/Hero/field/kinds';
import { createShadows } from '../src/components/Home/Hero/field/shadows';
import { heightAt } from '../src/components/Home/Hero/posterShapes';

import type { Scene3DSource } from '@pixi/3d';
import type { ClayKind, ImageTint } from '../src/components/Home/Hero/field/kinds';
import type { Shadows } from '../src/components/Home/Hero/field/shadows';

/**
 * A blog post's cover, which `scripts/render-blog-covers.mjs` bundles and captures: the PixiJS logo as a model over
 * the home hero's dark backdrop, with a scatter of the hero's clay shapes round it. The page lays the headline and
 * kicker over the canvas as text.
 */

/** What one post asks for */
export interface CoverSpec {
  /** The short name under the logo; a run between asterisks is drawn in pink, as in `*3D* 101` */
  headline: string;
  /** The kind of post, small under the headline: Announcement, Tutorial, Release */
  kicker: string;
  /** Picks the shapes, their colours and how they sit. Change it to deal a different scatter */
  seed: number;
}

const WIDTH = 1200;
const HEIGHT = 630;
const ASPECT = WIDTH / HEIGHT;
/** Half the lens's height: a long lens, so a shape at the edge of the frame doesn't lean out of it */
const TAN = Math.tan((7 * Math.PI) / 180);
const KEY_DISTANCE = 16;

/** The logo the `/3d` hero shows, and its extent in its own units; keep in step with `Hero/logo/createLogo.ts` */
const LOGO_URL = '/images/home/stage/pixijs-logo.glb';
const LOGO_MODEL = { x0: -2.839, x1: 4.501, y0: -1.44, y1: 1.44 };
const LOGO_FINISH = { roughness: 0.7, emissive: 0.25, ambient: 0.3 };
/** Where the logo sits in the frame, how wide it is, and how far it turns to show its depth */
const LOGO = { x: 600, y: 212, width: 500, pitch: 0.1, yaw: -0.34, roll: 0.015 };

/**
 * Where a shape may sit: its centre and radius in pixels, and its depth from -1 (far) to 1 (near). They ring the logo
 * and headline, big ones at the corners and small ones in the gaps, and all stay inside the 16:9 a blog card crops to.
 */
const SLOTS: readonly (readonly [x: number, y: number, radius: number, depth: number])[] = [
  [104, 124, 60, 0.4],
  [262, 62, 27, -0.5],
  [1092, 112, 66, 0.6],
  [934, 58, 26, -0.6],
  [74, 356, 40, -0.2],
  [176, 538, 72, 0.8],
  [1128, 338, 38, -0.3],
  [1034, 528, 64, 0.7],
  [384, 588, 27, -0.5],
  [836, 592, 31, -0.4],
  [226, 232, 24, -0.7],
  [982, 262, 27, -0.6],
];
const KINDS: readonly ClayKind[] = ['sphere', 'cube', 'torus', 'pyramid', 'capsule', 'octahedron', 'cylinder'];
/** The logo is pink already, so most shapes take the other brand colours */
const SHAPE_TINTS: readonly ImageTint[] = ['violet', 'cyan', 'pink', 'violet', 'cyan', 'rose'];

/** Deterministic 0-1 stream, so a seed always deals the same cover */
function makeRandom(seed: number): () => number {
  let state = (seed * 2654435761) >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;

    return state / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

/** Sets `holder` at a point of the frame, `dist` from the camera, turned to face the camera from where it stands */
function place(holder: Container3D, x: number, y: number, dist: number, roll: number): void {
  const viewX = ((x / WIDTH) * 2 - 1) * TAN * ASPECT;
  const viewY = (1 - (y / HEIGHT) * 2) * TAN;
  const facePitch = Math.atan(viewY);

  holder.position.set(viewX * dist, viewY * dist, -dist);
  holder.rotation.set(facePitch, -Math.atan(viewX * Math.cos(facePitch)), roll);
}

/** World units per pixel at `dist` */
const unitsPerPixel = (dist: number): number => (TAN * dist) / (HEIGHT / 2);

/** A soft pink light on the backdrop behind the logo and headline, which lifts them off it */
function createGlow(): Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

  canvas.width = canvas.height = 256;
  gradient.addColorStop(0, 'rgba(233, 30, 99, 0.2)');
  gradient.addColorStop(0.5, 'rgba(180, 60, 200, 0.07)');
  gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const glow = new Sprite({ texture: Texture.from(canvas), anchor: 0.5 });

  glow.position.set(WIDTH / 2, 300);
  glow.setSize(1150, 640);

  return glow;
}

async function createCover(host: HTMLElement): Promise<(spec: CoverSpec) => void> {
  const app = new Application();
  const [source] = await Promise.all([
    Assets.load<Scene3DSource>(LOGO_URL),
    app.init({
      width: WIDTH,
      height: HEIGHT,
      preference: ['webgl'],
      backgroundColor: PALETTES.dark.floorColor,
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      preserveDrawingBuffer: true,
    }),
    document.fonts.load('700 100px Outfit'),
    document.fonts.load('500 20px "Roboto Mono"'),
  ]);

  const view = new View3D({ width: WIDTH, height: HEIGHT, toneMapping: 'aces' });
  const key = new DirectionalLight();
  const geometries = createClayGeometries();
  const tints = Object.keys(TINTS) as ImageTint[];
  const materials = Object.fromEntries(tints.map((tint) => [tint, createClayMaterial(tint)])) as Record<
    ImageTint,
    Material3D
  >;
  const logoMaterial = new Material3D({
    baseColor: TINTS.pink,
    roughness: LOGO_FINISH.roughness,
    metallic: 0,
    emissive: { color: TINTS.pink, strength: LOGO_FINISH.emissive },
  });
  const model = new Model3D({ source, castShadow: false, receiveShadow: false });
  const logo = new Container3D({ children: [model] });
  const meshes = SLOTS.map(() => new Mesh3D({ geometry: geometries.sphere, material: materials.pink }));
  const holders = meshes.map((mesh) => new Container3D({ children: [mesh] }));
  const backdrop = createBackdrop('dark');
  const shadowLayer = new Container();
  let shadows: Shadows | undefined;

  const paint = (node: Container3D): void => {
    if (node instanceof Mesh3D) node.material = logoMaterial;
    for (const child of node.children) if (child instanceof Container3D) paint(child);
  };

  paint(model);
  model.position.set(-(LOGO_MODEL.x0 + LOGO_MODEL.x1) / 2, -(LOGO_MODEL.y0 + LOGO_MODEL.y1) / 2, 0);
  model.rotation.set(LOGO.pitch, LOGO.yaw, 0);
  place(logo, LOGO.x, LOGO.y, MID_DIST, LOGO.roll);
  logo.scale.set((LOGO.width / (LOGO_MODEL.x1 - LOGO_MODEL.x0)) * unitsPerPixel(MID_DIST));

  key.position.set(
    -KEY_DIRECTION.x * KEY_DISTANCE,
    -KEY_DIRECTION.y * KEY_DISTANCE,
    -MID_DIST - KEY_DIRECTION.z * KEY_DISTANCE,
  );
  key.lookAt({ x: 0, y: 0, z: -MID_DIST });
  view.camera.fov = (Math.atan(TAN) * 360) / Math.PI;
  view.root.addChild(key, logo, ...holders);
  lightClay(view, key, 'dark', Object.values(materials));
  logoMaterial.occlusionStrength = LOGO_FINISH.ambient;
  backdrop.setTheme('dark');
  app.stage.addChild(backdrop.view, createGlow(), shadowLayer, view);
  host.prepend(app.canvas);

  return ({ headline, kicker, seed }) => {
    const random = makeRandom(seed);
    const kinds = shuffled([...KINDS, ...shuffled(KINDS, random)], random);
    const shapeTints = shuffled(SHAPE_TINTS, random);
    const mirror = random() < 0.5;

    shadows?.view.destroy({ children: true });
    shadows?.destroy();
    shadows = createShadows(kinds.slice(0, SLOTS.length), 'dark');
    shadows.setTheme('dark');
    shadowLayer.addChild(shadows.view);
    // The backdrop's masses drift with time, so each seed gets its own
    backdrop.update(seed * 7.3, WIDTH, HEIGHT, 0, 0);

    SLOTS.forEach(([slotX, slotY, slotRadius, depth], index) => {
      const kind = kinds[index];
      const dist = MID_DIST - depth * 0.9;
      const x = (mirror ? WIDTH - slotX : slotX) + (random() - 0.5) * 30;
      const y = slotY + (random() - 0.5) * 30;
      const radius = slotRadius * (0.9 + random() * 0.25);
      const roll = (random() - 0.5) * 1.6;
      const scale = radius * unitsPerPixel(dist);
      const mesh = meshes[index];

      mesh.geometry = geometries[kind];
      mesh.material = materials[shapeTints[index % shapeTints.length]];
      // Turned enough to show three sides, and never end on to the camera, where a pyramid reads as a disc
      mesh.rotation.set(
        KIND_PITCH[kind] + 0.2 + random() * 0.35,
        (random() < 0.5 ? -1 : 1) * (0.25 + random() * 0.35),
        0,
      );
      mesh.scale.set(scale * KIND_SCALE[kind].x, scale * KIND_SCALE[kind].y, scale * KIND_SCALE[kind].z);
      place(holders[index], x, y, dist, roll);
      shadows?.cast(index, x, y, radius, radius * 2.2, roll, heightAt(depth));
    });

    const title = host.querySelector('#headline')!;

    // Odd runs sat between asterisks
    title.replaceChildren(
      ...headline.split('*').map((run, index) => {
        const span = document.createElement(index % 2 ? 'em' : 'span');

        span.textContent = run;

        return span;
      }),
    );
    host.querySelector('#kicker')!.textContent = kicker;
    app.render();
  };
}

declare global {
  interface Window {
    cover(spec: CoverSpec): void;
  }
}

window.cover = await createCover(document.querySelector<HTMLElement>('#host')!);
