import {
  Box,
  Container3D,
  ContainerTexture,
  CubeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  Model3D,
  SphereGeometry,
  Sprite3D,
  TorusGeometry,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { gsap } from 'gsap';
import { Assets, Color, Container, Graphics, Sprite } from 'pixi.js';
import { superellipsoidGeometry } from '../../Hero/field/superellipsoidGeometry';
import { clay, COLORS, createHud, createStageApp, lerp, loadSprites, measure, PALETTES } from './shared';

import type { Scene3DSource } from '@pixi/3d';
import type { Frame, SceneOptions, SpriteName, StageScene, StageTheme } from './shared';

/** The `/3d` tour (section 8.6): a glTF model among meshes, a cube wearing a live 2D scene, billboards, and picking */
type Tab = 'meshes' | 'texture' | 'billboards' | 'picking';

/** Scene time of the still pose: what posters, reduced motion and Pause motion show */
const STILL_TIME = 1.9;
const GROUND = -1;
const RING = { count: 60, radius: 2.45, height: 0.4 };
const MONSTERS: SpriteName[] = ['helmlok', 'skully', 'eggHead', 'flowerTop'];
const GRID = { columns: 5, rows: 3, size: 0.6, gap: 0.98 };
/** Index of the cube the still pose shows hovered, so posters explain the tab */
const STILL_HOVER = 7;
/** The order a ghost pointer visits the cubes in while nobody is pointing, and how long it leaves them alone first */
const GHOST_PATH = [7, 3, 11, 0, 9, 13, 6, 4, 10, 2, 14, 5, 8, 1, 12];
const GHOST_AFTER = 2.5;
const GHOST_STEP = 1.1;
/**
 * The glTF sample Fox, meshopt-compressed (CC BY 4.0, credited on the tab), which faces +Z. Tapping it steps
 * through its clips; the still pose is `stillTime` into `Survey`.
 */
const FOX = {
  url: '/images/home/stage/fox.glb',
  /** Modelled in centimetres, 79 tall */
  scale: 0.014,
  x: 0,
  z: -0.35,
  turn: -0.62,
  clips: ['Survey', 'Walk', 'Run'],
  stillTime: 1.2,
  fade: 0.4,
};

/** Camera on a sphere around a point on the y axis, so every pose and the orbit share one parameterisation */
interface Pose {
  azimuth: number;
  /** From straight up, in radians */
  polar: number;
  distance: number;
  targetY: number;
  fov: number;
  /** Floor disc radius scale; 0 hides it */
  floor: number;
}

const POSES: Record<Tab, Pose> = {
  meshes: { azimuth: 0, polar: 1.284, distance: 6.57, targetY: -0.32, fov: 35, floor: 1 },
  texture: { azimuth: 0, polar: 1.36, distance: 6.2, targetY: -0.08, fov: 35, floor: 0.82 },
  billboards: { azimuth: 0.35, polar: 1.1, distance: 7.4, targetY: -0.55, fov: 38, floor: 1.42 },
  picking: { azimuth: -0.42, polar: 1.02, distance: 7.6, targetY: -0.85, fov: 38, floor: 1.46 },
};

interface ShapeSpec {
  color: number;
  geometry: () => TorusGeometry | SphereGeometry;
  rest: { x: number; y: number; z: number };
  /** A ring lies in its XZ plane, so it pitches up to face the camera */
  ring?: boolean;
}

/** Two of the same-stage demo's shapes, either side of the fox */
const SHAPES: ShapeSpec[] = [
  {
    color: COLORS.pink,
    geometry: () => new TorusGeometry({ radius: 0.42, tube: 0.18, radialSegments: 28, tubularSegments: 72 }),
    rest: { x: -1.45, y: -0.2, z: 0.3 },
    ring: true,
  },
  {
    color: COLORS.sky,
    geometry: () => new SphereGeometry({ radius: 0.44, widthSegments: 48, heightSegments: 32 }),
    rest: { x: 1.42, y: -0.36, z: 0.35 },
  },
];

/** Picking cubes are violet and sky in a checkerboard, and turn pink under the pointer */
const CUBE_TINTS = [new Color(COLORS.violet), new Color(COLORS.sky)];
const CUBE_HOT = new Color(COLORS.pink);

const isTab = (id: string | undefined): id is Tab =>
  id === 'meshes' || id === 'texture' || id === 'billboards' || id === 'picking';

/** Shortest signed angle from `from` to `to` */
const turn = (from: number, to: number) =>
  from + ((((to - from + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

export async function createScene(host: HTMLElement, options: SceneOptions): Promise<StageScene> {
  const { app, unobserve } = await createStageApp(host);
  const [textures, hud, foxSource] = await Promise.all([
    loadSprites(),
    options.hud === false ? null : createHud(),
    Assets.load<Scene3DSource>(FOX.url),
  ]);

  let theme: StageTheme = options.theme;
  let motion = options.motion ?? true;
  let tab: Tab = isTab(options.tab) ? options.tab : 'meshes';
  let time = STILL_TIME;
  let frame: Frame = measure(app.screen.width, app.screen.height);
  let timeline: gsap.core.Timeline | null = null;
  let destroyed = false;
  /** The orbit drives the camera once the billboards tab has settled */
  let orbiting = false;
  const coarse = matchMedia('(pointer: coarse)').matches;

  app.canvas.style.touchAction = 'pan-y';
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  const view = new View3D({
    toneMapping: 'aces',
    shadowQuality: 'high',
    shadowFilter: 'pcf-high',
    environment: PALETTES[theme].environment,
  });
  const key = new DirectionalLight({
    intensity: PALETTES[theme].key,
    castShadow: true,
    shadow: { bounds: Box.fromCenterSize({ x: 0, y: -0.4, z: 0 }, { x: 7.5, y: 3.5, z: 7.5 }) },
  });

  key.position.set(-2.6, 5.2, 3.4);
  key.lookAt({ x: 0, y: -0.4, z: 0 });

  const floorMaterial = new Material3D({ baseColor: PALETTES[theme].floor, roughness: 0.92 });
  const floor = new Mesh3D({
    geometry: new CylinderGeometry({ radiusTop: 2.05, radiusBottom: 2.05, height: 0.1, radialSegments: 96 }),
    material: floorMaterial,
    castShadow: false,
    receiveShadow: true,
  });
  const camera = { ...POSES[tab] };

  floor.y = GROUND - 0.05;

  // ---------- Meshes: a glTF fox between two clay shapes ----------
  const shapes = SHAPES.map((spec, i) => {
    const mesh = new Mesh3D({ geometry: spec.geometry(), material: clay(spec.color), receiveShadow: false });
    const holder = new Container3D({ children: [mesh] });
    const state = { pop: tab === 'meshes' ? 1 : 0, spin: 0, hop: 0 };

    mesh.eventMode = 'static';
    mesh.cursor = 'pointer';
    mesh.on('pointertap', () => hopShape(state));

    return { spec, mesh, holder, state, i };
  });

  const fox = new Model3D({
    source: foxSource,
    autoUpdate: false,
    receiveShadow: false,
    eventMode: 'static',
    cursor: 'pointer',
    hitVolume: 'box',
  });
  const { player } = fox;

  if (!player) throw new Error(`${FOX.url} has no animations`);
  const clips = FOX.clips.map((name) => player.getState(name));
  const foxHolder = new Container3D({ children: [fox] });
  const foxState = { pop: tab === 'meshes' ? 1 : 0, clip: 0 };

  fox.scale.set(FOX.scale);
  fox.rotation.y = FOX.turn;
  foxHolder.position.set(FOX.x, GROUND, FOX.z);
  clips[0].play();
  fox.on('pointertap', () => playClip((foxState.clip + 1) % clips.length));

  // ---------- 2D on 3D: a live ContainerTexture worn by a cube ----------
  const SCREEN = 512;
  const screen = new Container();
  const screenGrid = new Graphics().rect(0, 0, SCREEN, SCREEN).fill(0xf6f4fb);

  for (let i = 0; i <= SCREEN; i += 32) screenGrid.moveTo(i, 0).lineTo(i, SCREEN).moveTo(0, i).lineTo(SCREEN, i);
  screenGrid.stroke({ color: COLORS.violet, alpha: 0.16, width: 2 });
  screenGrid.circle(92, 92, 26).stroke({ color: COLORS.pink, width: 14 });
  screenGrid.roundRect(392, 62, 56, 56, 14).fill(COLORS.sky);
  const screenHero = new Sprite({ texture: textures.helmlok, anchor: { x: 0.5, y: 1 } });
  const screenBunnies = Array.from(
    { length: 6 },
    () => new Sprite({ texture: textures.bunny, anchor: { x: 0.5, y: 1 } }),
  );

  screenHero.scale.set(220 / textures.helmlok.height);
  screen.addChild(screenGrid, screenHero, ...screenBunnies);
  const screenTexture = new ContainerTexture({
    container: screen,
    width: SCREEN,
    height: SCREEN,
    renderer: app.renderer,
  });
  const cube = new Mesh3D({
    geometry: new CubeGeometry({ width: 1.7, height: 1.7, depth: 1.7 }),
    material: new Material3D({
      baseColorTexture: screenTexture,
      roughness: 0.42,
      clearcoat: { factor: 0.45, roughness: 0.18 },
    }),
    receiveShadow: false,
  });
  const cubeHolder = new Container3D({ children: [cube] });
  const cubeState = { pop: tab === 'texture' ? 1 : 0, spin: 0, nudge: 1 };

  cubeHolder.position.set(0, 0.06, 0);
  cube.eventMode = 'static';
  cube.cursor = 'pointer';
  cube.on('pointertap', () => {
    if (motion) {
      gsap.to(cubeState, { spin: `+=${Math.PI / 2}`, duration: 0.75, ease: 'back.out(1.6)' });
      gsap.fromTo(cubeState, { nudge: 0.94 }, { nudge: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    } else {
      cubeState.spin += Math.PI / 2;
      invalidate();
    }
  });

  // ---------- Billboards: Sprite3D bunnies in a ring, and the monsters back to back inside it ----------
  const billboard = (name: SpriteName, height: number, radius: number, angle: number, hop: number) => {
    const sprite = new Sprite3D({
      texture: textures[name],
      billboardMode: 'spherical',
      anchor: { x: 0.5, y: 1 },
      alphaMode: 'mask',
      height,
    });

    sprite.position.set(Math.cos(angle) * radius, GROUND, Math.sin(angle) * radius);

    return { sprite, angle, hop, base: sprite.scale.x, state: { pop: tab === 'billboards' ? 1 : 0 } };
  };
  const bunnies = [
    ...Array.from({ length: RING.count }, (_, i) =>
      billboard('bunny', RING.height, RING.radius, (i / RING.count) * Math.PI * 2, 0.22),
    ),
    ...MONSTERS.map((name, i) => billboard(name, 0.92, 0.5, (i / MONSTERS.length) * Math.PI * 2 + 0.4, 0.06)),
  ];
  const orbit = new OrbitCamera({
    view,
    autoUpdate: false,
    enabled: false,
    enableDamping: true,
    enableZoom: false,
    enablePan: false,
    enableRotate: !coarse,
    autoRotate: true,
    autoRotateSpeed: 1.6,
    minPolarAngle: 0.7,
    maxPolarAngle: 1.45,
  });

  orbit.on('start', () => void (view.cursor = 'grabbing'));
  orbit.on('end', () => void (view.cursor = orbiting && !coarse ? 'grab' : 'auto'));

  // ---------- Picking: a grid of clay cubes that answer pointer events ----------
  // The hero's soft-edged clay cube
  const cubeGeometry = superellipsoidGeometry({ radius: GRID.size / 2, roundness: 0.22, segments: 48 });
  const tiles = Array.from({ length: GRID.columns * GRID.rows }, (_, i) => {
    const column = i % GRID.columns;
    const row = Math.floor(i / GRID.columns);
    const base = CUBE_TINTS[(column + row) % 2];
    const material = clay(base.toNumber());
    const mesh = new Mesh3D({ geometry: cubeGeometry, material, receiveShadow: false });
    const state = { pop: tab === 'picking' ? 1 : 0, lift: 0, heat: 0, spin: 0 };
    const tile = { mesh, material, base, state, column, row };

    mesh.position.set((column - (GRID.columns - 1) / 2) * GRID.gap, 0, (row - (GRID.rows - 1) / 2) * GRID.gap);
    mesh.eventMode = 'static';
    mesh.cursor = 'pointer';
    mesh.on('pointerover', () => {
      haunt(null);
      heat(tile, 1);
    });
    mesh.on('pointerout', () => heat(tile, 0));
    mesh.on('pointertap', () => spinTile(tile));

    return tile;
  });
  const tileColor = new Color();

  view.root.addChild(
    key,
    floor,
    cubeHolder,
    foxHolder,
    ...shapes.map((shape) => shape.holder),
    ...bunnies.map((bunny) => bunny.sprite),
    ...tiles.map((tile) => tile.mesh),
  );
  app.stage.addChild(view);
  if (hud) app.stage.addChild(hud);

  // ---------- per frame ----------
  function poseCamera() {
    if (orbiting) return;
    const distance = camera.distance * frame.reach;
    const ring = Math.sin(camera.polar) * distance;

    view.camera.fov = camera.fov;
    view.camera.position.set(
      Math.sin(camera.azimuth) * ring,
      camera.targetY + Math.cos(camera.polar) * distance,
      Math.cos(camera.azimuth) * ring,
    );
    view.camera.lookAt({ x: 0, y: camera.targetY, z: 0 });
  }

  let lastSize = '';

  function update() {
    const { width, height } = app.screen;
    const size = `${width}x${height}`;

    if (size !== lastSize) {
      lastSize = size;
      frame = measure(width, height);
      view.setSize(width, height);
      app.stage.hitArea = app.screen;
    }
    poseCamera();
    floor.scale.set(camera.floor, 1, camera.floor);
    floor.visible = camera.floor > 0.01;

    const tilt = Math.atan2(Math.cos(camera.polar), Math.sin(camera.polar));

    for (const { spec, mesh, holder, state, i } of shapes) {
      holder.position.set(spec.rest.x, spec.rest.y + Math.sin(time * 1.3 + i * 2.1) * 0.09 + state.hop, spec.rest.z);
      holder.scale.set(state.pop);
      holder.visible = state.pop > 0.001;
      mesh.rotation.set(
        (spec.ring ? Math.PI / 2 - tilt : 0) + Math.sin(time * 0.7 + i) * 0.32,
        time * (0.5 + i * 0.12) + state.spin,
        Math.sin(time * 0.5 + i * 2) * 0.22,
      );
    }

    foxHolder.scale.set(foxState.pop);
    foxHolder.visible = foxState.pop > 0.001;

    cubeHolder.scale.set(cubeState.pop * cubeState.nudge);
    cubeHolder.visible = cubeState.pop > 0.001;
    cubeHolder.y = 0.06 + Math.sin(time * 1.1) * 0.06;
    cube.rotation.set(
      0.42 + Math.sin(time * 0.6) * 0.06,
      time * 0.32 + cubeState.spin - 0.55,
      Math.sin(time * 0.4) * 0.03,
    );
    if (cubeHolder.visible) {
      placeScreen();
      screenTexture.render();
    }

    // A stadium wave runs round the ring
    for (const { sprite, angle, hop, base, state } of bunnies) {
      const rise = Math.max(0, Math.sin(time * 2.4 - angle * 2)) ** 2;

      sprite.visible = state.pop > 0.001;
      sprite.scale.set(base * state.pop);
      sprite.y = GROUND + rise * hop * state.pop;
    }

    placeGhost();
    for (const { mesh, material, base, state, column, row } of tiles) {
      const wave = Math.sin(time * 1.6 - column * 0.55 - row * 0.4) * 0.05;

      mesh.visible = state.pop > 0.001;
      mesh.scale.set(state.pop * (1 + state.heat * 0.08));
      mesh.y = GROUND + GRID.size / 2 + (wave + state.lift * 0.42) * state.pop;
      mesh.rotation.set(state.heat * 0.18, state.spin + state.heat * 0.4, 0);
      tileColor.setValue([
        lerp(base.red, CUBE_HOT.red, state.heat),
        lerp(base.green, CUBE_HOT.green, state.heat),
        lerp(base.blue, CUBE_HOT.blue, state.heat),
      ]);
      material.baseColor = tileColor.toNumber();
      if (material.emissive) {
        material.emissive.color = tileColor.toNumber();
        material.emissive.strength = 0.07 + state.heat * 0.18;
      }
    }

    if (hud) placeHud();
  }

  function placeScreen() {
    screenHero.position.set(SCREEN / 2, 360 + Math.sin(time * 1.6) * 8);
    screenHero.rotation = Math.sin(time * 1.3) * 0.07;
    screenBunnies.forEach((sprite, i) => {
      const hop = Math.abs(Math.sin(time * 3.6 + i * 0.9));
      const k = 70 / textures.bunny.height;

      sprite.scale.set(k * (1 + (1 - hop) ** 8 * 0.12), k * (1 - (1 - hop) ** 8 * 0.16));
      sprite.position.set(66 + i * 76, 466 - hop * 64);
    });
  }

  // ---------- HUD ----------
  let hudAt = -1;
  const startedAt = performance.now();

  function placeHud() {
    if (!hud) return;
    const now = performance.now();

    if (now - hudAt >= 250) {
      hudAt = now;
      hud.text = hudText();
      hud.tint = PALETTES[theme].hud;
    }
    hud.position.set(20, frame.height - 18 - hud.height);
  }

  function hudText() {
    const shown = (states: { pop: number }[]) => states.filter(({ pop }) => pop > 0.5).length;
    const sprites = shown(bunnies.map(({ state }) => state));
    const meshes =
      shown([...shapes.map(({ state }) => state), foxState, cubeState, ...tiles.map(({ state }) => state)]) +
      (camera.floor > 0.5 ? 1 : 0);
    const parts = [app.renderer.name.toUpperCase()];

    if (motion && app.ticker.lastTime - startedAt > 600) parts.push(`${Math.round(app.ticker.FPS)} FPS`);
    // Short enough for a phone-width card: the billboards leave out the floor and the light
    if (sprites) parts.push(`${sprites} SPRITE3D`);
    else parts.push(`${meshes} ${meshes === 1 ? 'MESH' : 'MESHES'}`, '1 LIGHT');

    return parts.join(' · ');
  }

  // ---------- interaction ----------
  function hopShape(state: (typeof shapes)[number]['state']) {
    if (!motion) {
      state.spin += Math.PI;
      invalidate();

      return;
    }
    gsap
      .timeline()
      .to(state, { hop: 0.55, duration: 0.3, ease: 'power2.out' })
      .to(state, { hop: 0, duration: 0.75, ease: 'bounce.out' });
    gsap.to(state, { spin: `+=${Math.PI * 2}`, duration: 1.1, ease: 'power3.out' });
  }

  /** Fades from the fox's clip to the next; without motion it cuts to the next one's still pose */
  function playClip(index: number) {
    const next = clips[index];

    foxState.clip = index;
    gsap.killTweensOf(clips);
    for (const clip of clips) {
      if (clip === next) continue;
      if (motion) gsap.to(clip, { weight: 0, duration: FOX.fade, onComplete: () => void clip.stop() });
      else clip.stop();
    }
    if (!motion) {
      next.weight = 1;
      next.gotoAndStop(FOX.stillTime);
      invalidate();

      return;
    }
    if (!next.playing) {
      next.weight = 0;
      next.gotoAndPlay(0);
    }
    gsap.to(next, { weight: 1, duration: FOX.fade });
  }

  function heat(tile: (typeof tiles)[number], value: number) {
    if (tile.state.pop < 0.5) return;
    if (!motion) {
      Object.assign(tile.state, { heat: value, lift: value });
      invalidate();

      return;
    }
    gsap.to(tile.state, {
      heat: value,
      lift: value,
      duration: value ? 0.35 : 0.6,
      ease: value ? 'back.out(2.2)' : 'power3.out',
      overwrite: 'auto',
    });
  }

  function spinTile(tile: (typeof tiles)[number]) {
    if (!motion) {
      tile.state.spin += Math.PI / 2;
      invalidate();

      return;
    }
    gsap.to(tile.state, { spin: `+=${Math.PI / 2}`, duration: 0.7, ease: 'back.out(1.8)' });
  }

  // Picking explains itself while nobody is pointing: a ghost pointer hovers one cube after another, and the still
  // pose leaves it on one
  let ghost: (typeof tiles)[number] | null = null;
  let pointedAt = -Infinity;

  function haunt(tile: (typeof tiles)[number] | null) {
    if (tile === ghost) return;
    if (ghost) heat(ghost, 0);
    ghost = tile;
    if (ghost) heat(ghost, 1);
  }

  function placeGhost() {
    if (tab !== 'picking' || !motion || time - pointedAt < GHOST_AFTER) return;
    haunt(tiles[GHOST_PATH[Math.floor(time / GHOST_STEP) % GHOST_PATH.length]]);
  }

  // The ghost waits while a pointer is over the canvas; moves elsewhere on the page (global ones) don't count
  const pointed = () => void (pointedAt = time);

  app.stage.on('pointermove', pointed);
  app.stage.on('pointerdown', pointed);
  // Without a ticker, a pointer still moves the orbit and the hovered cube: draw on demand
  app.stage.on('globalpointermove', () => !motion && invalidate());
  app.stage.on('pointerdown', () => !motion && invalidate());

  // ---------- transitions ----------
  function outgoing(tl: gsap.core.Timeline, from: Tab) {
    const pop = { duration: 0.32, ease: 'back.in(1.7)' };

    if (from === 'meshes') {
      shapes.forEach(({ state }, i) => tl.to(state, { pop: 0, ...pop }, i * 0.05));
      tl.to(foxState, { pop: 0, ...pop }, 0.03);
    }
    if (from === 'texture') tl.to(cubeState, { pop: 0, ...pop }, 0);
    if (from === 'billboards') {
      bunnies.forEach(({ state, angle }) => tl.to(state, { pop: 0, ...pop, duration: 0.26 }, (angle / Math.PI) * 0.06));
    }
    if (from === 'picking') {
      tiles.forEach(({ state, column, row }) =>
        tl.to(state, { pop: 0, lift: 0, heat: 0, ...pop, duration: 0.28 }, (column + row) * 0.025),
      );
    }
  }

  function incoming(tl: gsap.core.Timeline, to: Tab, at: number) {
    const pop = { pop: 1, duration: 0.8, ease: 'back.out(1.6)' };

    if (to === 'meshes') {
      shapes.forEach(({ state }, i) => {
        if (state.pop < 0.01) tl.set(state, { spin: -Math.PI }, at);
        tl.to(state, pop, at + i * 0.16);
        tl.to(state, { spin: 0, duration: 1, ease: 'power3.out' }, at + i * 0.16);
      });
      tl.to(foxState, pop, at + 0.08);
    }
    if (to === 'texture') {
      if (cubeState.pop < 0.01) tl.set(cubeState, { spin: -Math.PI / 2 }, at);
      tl.to(cubeState, { ...pop, ease: 'back.out(2)' }, at);
      tl.to(cubeState, { spin: 0, duration: 1, ease: 'power3.out' }, at);
    }
    if (to === 'billboards') {
      bunnies.forEach(({ state, angle }) =>
        tl.to(state, { ...pop, duration: 0.6, ease: 'back.out(2.4)' }, at + (angle / (Math.PI * 2)) * 0.5),
      );
    }
    if (to === 'picking') {
      tiles.forEach(({ state, column, row }) => {
        const distance = Math.hypot(column - (GRID.columns - 1) / 2, row - (GRID.rows - 1) / 2);

        if (state.pop < 0.01) tl.set(state, { spin: -Math.PI / 2 }, at);
        tl.to(state, { ...pop, duration: 0.7, ease: 'back.out(2)' }, at + distance * 0.07);
        tl.to(state, { spin: 0, duration: 0.8, ease: 'power3.out' }, at + distance * 0.07);
      });
    }
  }

  function startOrbit() {
    orbiting = true;
    orbit.target.set(0, camera.targetY, 0);
    orbit.enabled = true;
    view.cursor = coarse ? 'auto' : 'grab';
  }

  function stopOrbit() {
    if (!orbiting) return;
    orbiting = false;
    orbit.enabled = false;
    view.cursor = 'auto';
    // Hand the orbit's pose back to the tweened camera, so the next move starts where the orbit left it
    camera.azimuth = orbit.azimuthAngle;
    camera.polar = orbit.polarAngle;
  }

  function toTab(next: Tab) {
    const previous = tab;
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    const pose = POSES[next];

    tab = next;
    ghost = null;
    stopOrbit();
    outgoing(tl, previous);
    tl.to(
      camera,
      {
        azimuth: turn(camera.azimuth, pose.azimuth),
        polar: pose.polar,
        distance: pose.distance,
        targetY: pose.targetY,
        fov: pose.fov,
        duration: 1,
        ease: 'power2.inOut',
      },
      0.05,
    );
    tl.to(camera, { floor: pose.floor, duration: 0.9, ease: 'expo.inOut' }, 0.1);
    incoming(tl, next, 0.32);
    if (next === 'billboards') tl.call(startOrbit, undefined, 1.05);

    return tl;
  }

  // ---------- lifecycle ----------
  let pending = 0;

  function invalidate() {
    if (motion || pending || destroyed) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      if (orbiting) orbit.update();
      update();
      app.render();
    });
  }

  app.ticker.add((ticker) => {
    if (motion) time += Math.min(ticker.deltaMS, 50) / 1000;
    if (motion && foxHolder.visible) player.update(ticker);
    if (orbiting) orbit.update(ticker);
    update();
  });

  function stillPose() {
    time = STILL_TIME;
    timeline?.progress(1);
    haunt(tab === 'picking' ? tiles[STILL_HOVER] : null);
    playClip(foxState.clip);
  }

  function applyMotion() {
    if (motion) {
      clips[foxState.clip].play();
      app.ticker.start();
    } else {
      app.ticker.stop();
      stillPose();
      invalidate();
    }
  }

  // Draw every mesh once while the canvas is still hidden, so no shader compiles in the middle of a transition
  const warm = [
    ...shapes.map(({ state }) => state),
    foxState,
    cubeState,
    ...bunnies.map(({ state }) => state),
    ...tiles.map(({ state }) => state),
  ];
  const pops = warm.map(({ pop }) => pop);

  warm.forEach((state) => (state.pop = 1));
  update();
  app.render();
  warm.forEach((state, i) => (state.pop = pops[i]));
  hudAt = -1;
  if (tab === 'billboards') startOrbit();
  if (!motion) stillPose();
  update();
  app.render();
  applyMotion();

  return {
    setTab(id) {
      if (!isTab(id) || id === tab) return;
      timeline?.kill();
      timeline = toTab(id);
      if (!motion) {
        timeline.progress(1);
        stillPose();
        invalidate();
      }
    },
    setActive(active) {
      if (!motion) return;
      if (active) app.ticker.start();
      else app.ticker.stop();
    },
    setTheme(next) {
      theme = next;
      view.environment = PALETTES[theme].environment;
      key.intensity = PALETTES[theme].key;
      floorMaterial.baseColor = PALETTES[theme].floor;
      hudAt = -1;
      invalidate();
    },
    setMotion(next) {
      if (next === motion) return;
      motion = next;
      applyMotion();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(pending);
      timeline?.kill();
      gsap.killTweensOf([camera, cubeState, ...warm, ...clips]);
      unobserve();
      orbit.destroy();
      // The fox shares its geometry and materials with the cached source, which the next scene reuses
      foxHolder.removeFromParent();
      foxHolder.destroy({ children: true });
      view.destroy({ children: true, geometry: true, material: true });
      screenTexture.destroy(true);
      app.destroy({ removeView: true }, { children: true });
    },
  };
}
