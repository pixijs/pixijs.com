import { Container3D, DirectionalLight, Material3D, Mesh3D, Model3D, View3D } from '@pixi/3d';
import { gsap } from 'gsap';
import { Application, Assets } from 'pixi.js';
import { JELLY, JELLY_TIME } from '@site/src/motion/jelly';
import { KEY_DIRECTION, lightClay } from '../field/clay';
import { TINTS } from '../field/kinds';
import '@pixi/3d/webgl';
import '@site/src/utils/pixi3dCompat';

import type { Scene3DSource } from '@pixi/3d';
import type { FieldTheme } from '../field/clay';

/** The PixiJS logo, extruded, merged into one mesh and meshopt-compressed with `gltfpack -cc -vpf` */
const LOGO_URL = '/images/home/stage/pixijs-logo.glb';

/** The model's extent in its own units: the P's left edge to the JS badge's right, and its full height */
const MODEL = { x0: -2.839, x1: 4.501, y0: -1.44, y1: 1.44 };
const MODEL_WIDTH = MODEL.x1 - MODEL.x0;

/** The canvas around the logo in logo widths, as `.hm-hero-logoStage` has it: room for the turn, bob and squash */
const STAGE = { width: 1.3, height: 0.75 };

/** The hero field's lens, so the logo's perspective matches the shapes around it */
const HALF_FOV = Math.tan((11 * Math.PI) / 180);
/** Where the stage's height just fills the lens */
const DISTANCE = (MODEL_WIDTH * STAGE.height) / (2 * HALF_FOV);
const KEY_DISTANCE = 16;

/**
 * Matte brand pink, not the shapes' glossy clay: no coat to glare, a little self-light, and a third of the field's
 * fill, so it reads as the 2D logo's #e91e63 in either theme rather than a pastel
 */
const FINISH = { roughness: 0.7, emissive: 0.25, ambient: 0.3 };

/** The idle float: bob height in model units, and a slow wobble about each axis (radians), each at its own rate */
const FLOAT = {
  bob: 0.07,
  bobRate: 1.3,
  turn: 0.07,
  turnRate: 0.7,
  tilt: 0.04,
  tiltRate: 0.9,
  roll: 0.02,
  rollRate: 0.5,
};

interface LogoOptions {
  theme: FieldTheme;
  /** Off, it holds the still pose the poster shows */
  motion?: boolean;
  /** The browser took the WebGL context away: nothing more will draw, and the logo is ready to be destroyed */
  onLost?(): void;
}

export interface HeroLogo {
  readonly canvas: HTMLCanvasElement;
  setTheme(theme: FieldTheme): void;
  /** Runs or stops the ticker */
  setActive(active: boolean): void;
  /** Squashes and settles like a jelly */
  wobble(): void;
  /** A full turn about its upright */
  spin(): void;
  destroy(): void;
}

/**
 * The `/3d` hero's logo: the PixiJS logo as a model in matte brand pink, lit like the field's shapes, on a
 * transparent canvas it adds to `host`. It floats, squashes like the 2D logo's jelly and spins when asked. With
 * motion off it draws the still pose the poster (`hero-logo-<theme>.webp`) is rendered from.
 */
export async function createLogo(host: HTMLElement, { theme, motion = false, onLost }: LogoOptions): Promise<HeroLogo> {
  const app = new Application();
  const [source] = await Promise.all([
    Assets.load<Scene3DSource>(LOGO_URL),
    app.init({
      resizeTo: host,
      // As the field: WebGL only, since WebGPU's adapter request can stall while another tab holds a device
      preference: ['webgl'],
      skipExtensionImports: true,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    }),
  ]);

  const view = new View3D({ autoResize: true, toneMapping: 'aces' });
  const key = new DirectionalLight();
  const material = new Material3D({
    baseColor: TINTS.pink,
    roughness: FINISH.roughness,
    metallic: 0,
    emissive: { color: TINTS.pink, strength: FINISH.emissive },
  });
  const model = new Model3D({ source, castShadow: false, receiveShadow: false });
  const squash = new Container3D({ children: [model] });
  const holder = new Container3D({ children: [squash] });

  for (const mesh of meshesOf(model)) mesh.material = material;
  // The model's foot rests on the squash's origin, so a squash keeps it planted
  model.position.set(-(MODEL.x0 + MODEL.x1) / 2, -MODEL.y0, 0);
  squash.position.set(0, MODEL.y0 - (MODEL.y0 + MODEL.y1) / 2, 0);
  holder.position.set(0, 0, -DISTANCE);
  key.position.set(
    -KEY_DIRECTION.x * KEY_DISTANCE,
    -KEY_DIRECTION.y * KEY_DISTANCE,
    -DISTANCE - KEY_DIRECTION.z * KEY_DISTANCE,
  );
  key.lookAt({ x: 0, y: 0, z: -DISTANCE });
  view.camera.fov = (Math.atan(HALF_FOV) * 360) / Math.PI;
  view.root.addChild(key, holder);
  app.stage.addChild(view);

  const pose = { scaleX: 1, scaleY: 1, spin: 0 };
  let time = 0;
  let lost = false;

  const draw = () => {
    const at = motion ? time : 0;

    holder.position.y = Math.sin(at * FLOAT.bobRate) * FLOAT.bob;
    holder.rotation.set(
      Math.sin(at * FLOAT.tiltRate) * FLOAT.tilt,
      Math.sin(at * FLOAT.turnRate) * FLOAT.turn + pose.spin,
      Math.sin(at * FLOAT.rollRate) * FLOAT.roll,
    );
    squash.scale.set(pose.scaleX, pose.scaleY, pose.scaleX);
  };

  const tick = () => {
    time += Math.min(app.ticker.deltaMS, 33.4) / 1000;
    draw();
  };

  const setTheme = (next: FieldTheme) => {
    lightClay(view, key, next, []);
    material.occlusionStrength = FINISH.ambient;
    if (!app.ticker.started && !lost) app.render();
  };

  setTheme(theme);
  app.ticker.add(tick);
  app.ticker.stop();
  // Drawn once before resolving, so a canvas revealed on this promise is never blank
  draw();
  app.render();
  host.appendChild(app.canvas);

  const listening = new AbortController();

  app.canvas.addEventListener(
    'webglcontextlost',
    () => {
      lost = true;
      app.ticker.stop();
      onLost?.();
    },
    { signal: listening.signal },
  );

  return {
    canvas: app.canvas,
    setTheme,
    setActive(active) {
      if (active && motion && !lost) app.ticker.start();
      else app.ticker.stop();
    },
    wobble() {
      if (motion && !gsap.isTweening(pose)) gsap.to(pose, { keyframes: JELLY, duration: JELLY_TIME, ease: 'none' });
    },
    spin() {
      if (motion) gsap.to(pose, { spin: `+=${Math.PI * 2}`, duration: 1.2, ease: 'back.out(1.4)' });
    },
    destroy() {
      listening.abort();
      gsap.killTweensOf(pose);
      app.ticker.remove(tick);
      // The model shares its geometry with the cached source; only the matte material is the logo's own
      app.destroy({ removeView: true }, { children: true });
      material.destroy();
    },
  };
}

function* meshesOf(node: Container3D): Generator<Mesh3D> {
  if (node instanceof Mesh3D) yield node;
  for (const child of node.children) if (child instanceof Container3D) yield* meshesOf(child);
}
