import { Box, CylinderGeometry, DirectionalLight, Material3D, Mesh3D, Model3D, SphereGeometry, View3D } from '@pixi/3d';
import { Application, Assets, CubeTexture, Texture } from 'pixi.js';
import { COLORS, PALETTES } from '../src/components/Home/StageDemo/scenes/shared';

import type { Scene3DSource } from '@pixi/3d';
import type { StageTheme } from '../src/components/Home/StageDemo/scenes/shared';

/**
 * The stills in the `/3d` feature tiles, which `scripts/render-home-3d.mjs` bundles and captures, lit by the stage
 * demo's key light. Transparent, so the tile's backdrop shows through.
 */

// ToyCar by Guido Odendahl and Eric Chadwick, CC0 1.0: the model the viewer example opens on
const TOY_CAR =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@edc7c9e67c639d230715049ee31f9a96a6babbbe/Models/ToyCar/glTF-Binary/ToyCar.glb';
const SUNSET = '/assets/3d/environments/venice-sunset/venice-sunset.cubemap';
const GROUND = -1;

/** A softbox, in shares of a wall: where it is, its size, colour and how soft its edge is */
type Panel = [x: number, y: number, width: number, height: number, color: string, blur?: number];

const WALLS: Record<StageTheme, [top: string, bottom: string]> = {
  dark: ['#2c2840', '#0c0b12'],
  light: ['#8f89ad', '#2a2738'],
};

/**
 * A photo studio to reflect: plain walls, a white softbox overhead and behind the camera, and a pink and a blue
 * strip light either side, so polished shapes pick up the site's colours on their rims
 */
function studio(theme: StageTheme): CubeTexture {
  const size = 512;
  const [top, bottom] = WALLS[theme];
  const wall = (fill: 'fade' | 'top' | 'bottom', ...panels: Panel[]): Texture => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const fade = context.createLinearGradient(0, 0, 0, size);

    canvas.width = canvas.height = size;
    fade.addColorStop(0, top);
    fade.addColorStop(1, bottom);
    context.fillStyle = { fade, top, bottom }[fill];
    context.fillRect(0, 0, size, size);
    for (const [x, y, width, height, color, blur = 10] of panels) {
      context.filter = `blur(${blur}px)`;
      context.fillStyle = color;
      context.fillRect(x * size, y * size, width * size, height * size);
    }

    return Texture.from(canvas);
  };

  return CubeTexture.from({
    faces: {
      right: wall('fade', [0.3, 0.1, 0.16, 0.7, '#38bdf8']),
      left: wall('fade', [0.5, 0.1, 0.18, 0.7, '#ff3d81']),
      top: wall('top', [0.14, 0.14, 0.72, 0.72, '#ffffff', 24]),
      bottom: wall('bottom'),
      front: wall('fade', [0.14, 0.06, 0.5, 0.34, '#ffffff', 14], [0.76, 0.1, 0.07, 0.6, '#c4b5fd']),
      back: wall('fade', [0.1, 0.42, 0.8, 0.08, theme === 'dark' ? '#4a4266' : '#ffffff', 30]),
    },
  });
}

interface Stage {
  environment: CubeTexture;
  /** Radius of the stage demo's floor disc; left out, there's no floor */
  floor?: number;
  /** The camera, on a sphere around a point on the y axis: its angles (polar from straight up) and distance */
  camera: { azimuth: number; polar: number; distance: number; targetY: number };
}

async function createStage(host: HTMLElement, theme: StageTheme, { environment, floor, camera }: Stage) {
  const app = new Application();

  // The render script draws at twice the size and scales down, which smooths edges that multisampling can't
  // share a frame with: glass reads what's behind it from the back buffer
  await app.init({
    resizeTo: host,
    preference: 'webgl',
    backgroundAlpha: 0,
    useBackBuffer: true,
    resolution: window.devicePixelRatio,
    autoDensity: true,
  });
  host.appendChild(app.canvas);

  const view = new View3D({
    width: app.screen.width,
    height: app.screen.height,
    toneMapping: 'aces',
    shadowQuality: 'high',
    shadowFilter: 'pcf-high',
    environment,
  });
  const key = new DirectionalLight({
    intensity: PALETTES[theme].key,
    castShadow: true,
    shadow: { bounds: Box.fromCenterSize({ x: 0, y: -0.2, z: 0 }, { x: 8, y: 4.5, z: 8 }) },
  });
  const ring = Math.sin(camera.polar) * camera.distance;

  key.position.set(-2.6, 5.2, 3.4);
  key.lookAt({ x: 0, y: -0.4, z: 0 });
  view.camera.fov = 30;
  view.camera.position.set(
    Math.sin(camera.azimuth) * ring,
    camera.targetY + Math.cos(camera.polar) * camera.distance,
    Math.cos(camera.azimuth) * ring,
  );
  view.camera.lookAt({ x: 0, y: camera.targetY, z: 0 });
  view.root.addChild(key);
  if (floor) {
    const disc = new Mesh3D({
      geometry: new CylinderGeometry({ radiusTop: floor, radiusBottom: floor, height: 0.1, radialSegments: 128 }),
      material: new Material3D({ baseColor: PALETTES[theme].floor, roughness: 0.92 }),
      castShadow: false,
      receiveShadow: true,
    });

    disc.y = GROUND - 0.05;
    view.root.addChild(disc);
  }
  app.stage.addChild(view);

  return { app, view };
}

/** "glTF 2.0": the toy car on its cloth, with clearcoat paint, sheen fabric and glass, all from the file */
async function gltf(host: HTMLElement, theme: StageTheme) {
  const { app, view } = await createStage(host, theme, {
    environment: await Assets.load<CubeTexture>(SUNSET),
    camera: { azimuth: 0.6, polar: 1.24, distance: 5.6, targetY: 0.34 },
  });
  const model = new Model3D({ source: await Assets.load<Scene3DSource>(TOY_CAR) });
  const bounds = model.getLocalBounds();
  const size = bounds.getSize();
  const center = bounds.getCenter();
  const scale = 4.2 / Math.max(size.x, size.z);

  model.scale.set(scale);
  model.position.set(-center.x * scale, GROUND - bounds.min.y * scale, -center.z * scale);
  view.root.addChild(model);

  return app;
}

/** One ball of a material: its radius, and where it stands on the floor, across and toward the camera */
type Study = [radius: number, x: number, z: number, material: Material3D];

/** "PBR materials": one ball per material group, from gold to glass */
async function pbr(host: HTMLElement, theme: StageTheme) {
  const { app, view } = await createStage(host, theme, {
    environment: studio(theme),
    floor: 2.35,
    camera: { azimuth: 0, polar: 1.14, distance: 8.6, targetY: -0.62 },
  });
  const studies: Study[] = [
    // Car paint: a clear coat over a rough base
    [
      0.82,
      -0.35,
      -0.7,
      new Material3D({ baseColor: COLORS.pink, roughness: 0.5, clearcoat: { factor: 1, roughness: 0.04 } }),
    ],
    [0.6, 1.2, -0.75, new Material3D({ baseColor: 0xffc356, metallic: 1, roughness: 0.16 })],
    // A beetle's shell: a thin film over blue metal
    [
      0.5,
      -1.55,
      0.2,
      new Material3D({
        baseColor: COLORS.sky,
        metallic: 1,
        roughness: 0.2,
        iridescence: { factor: 1, ior: 1.33, thicknessMaximum: 450 },
      }),
    ],
    // Velvet
    [
      0.44,
      1.6,
      0.45,
      new Material3D({ baseColor: 0x5b34c9, roughness: 1, sheen: { color: 0xc9b6ff, roughness: 0.35 } }),
    ],
    // Brushed steel
    [
      0.34,
      -0.75,
      1.25,
      new Material3D({ baseColor: 0xdfe6ee, metallic: 1, roughness: 0.32, anisotropy: { strength: 1 } }),
    ],
    // Glass, out in front, where it bends the balls behind it
    [
      0.62,
      0.3,
      0.6,
      new Material3D({
        baseColor: 0xffffff,
        roughness: 0,
        ior: 1.5,
        transmission: { factor: 1, thickness: 0.15 },
      }),
    ],
  ];

  for (const [radius, x, z, material] of studies) {
    const mesh = new Mesh3D({
      geometry: new SphereGeometry({ radius, widthSegments: 96, heightSegments: 64 }),
      material,
      receiveShadow: false,
    });

    mesh.position.set(x, GROUND + radius, z);
    view.root.addChild(mesh);
  }

  return app;
}

const SCENES = { gltf, pbr };

declare global {
  interface Window {
    still: (name: keyof typeof SCENES, theme: StageTheme) => Promise<void>;
  }
}

let current: Application | undefined;

window.still = async (name, theme) => {
  const host = document.getElementById('host')!;

  current?.destroy(true, { children: true });
  host.replaceChildren();
  current = await SCENES[name](host, theme);
  current.render();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};
