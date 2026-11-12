/**
 * Racing: Kenney's Starter Kit Racing, ported to Pixi 3D from mrdoob's three.js port.
 *
 * A truck rides a crashcat physics sphere round a grid of glTF track pieces,
 * under a sun with cascaded shadows and ACES tone mapping, with particle smoke,
 * streamed skid marks and a PixiJS 2D lap timer over the view.
 *
 * Controls: WASD or arrow keys, gamepad, or touch joystick.
 */

import {
  DirectionalLight,
  Material3D,
  Mesh3D,
  PlaneGeometry,
  Vector3,
  View3D,
} from '@pixi/3d';

import { Application, Assets, Container } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model, models, texture } from './manifest';
import { GameAudio } from './Audio';
import { FollowCamera } from './Camera';
import { Controls } from './Controls';
import { DriftMarks } from './DriftMarks';
import { LapTimer } from './LapTimer';
import { SmokeTrails } from './Particles';
import { PhysicsWorld } from './Physics';
import { TouchJoystick } from './TouchJoystick';
import { buildTrack } from './Track';
import { MAX_SPEED, Vehicle } from './Vehicle';

const app = new Application();

await app.init({
  resizeTo: window,
  preference: rendererPreference,
  backgroundColor: 0xadb2ba,
  resolution: 2,
  autoDensity: true,
});

document.body.appendChild(app.canvas);

const MODEL_KEYS = Object.keys(models.racing);

const [smokeTexture, ...sourceList] = await Promise.all([
  Assets.load(texture('racing.smoke')),
  ...MODEL_KEYS.map((key) => Assets.load(model(`racing.${key}`))),
]);

const sources = Object.create(null);

MODEL_KEYS.forEach((key, i) => {
  sources[key] = sourceList[i];
});

const view3d = new View3D({
  autoResize: true,
  shadowQuality: 'high',
  toneMapping: 'aces',
  exposure: 1.0,
  // Sky/ground fill — cool overcast sky over warm grass-toned ground.
  environment: { skyColor: 0xc8d8e8, groundColor: 0x7a8a5a, intensity: 1 },
  // Distant track geometry fades into a background of the same colour.
  background: 0xadb2ba,
  fog: { type: 'linear', color: 0xadb2ba, near: 30, far: 55 },
});

app.stage.addChild(view3d);

const camera = view3d.camera;

const followCamera = new FollowCamera(camera);

// -- Lights --
//
// One directional sun. Hemisphere fill lives on `view3d.environment` above.

const sun = new DirectionalLight({
  color: 0xfff4e0,
  intensity: 2,
  castShadow: true,
  shadow: {
    bias: 0.0008,
    normalBias: 0.05,
    maxDistance: 80,
    cascades: 3,
    lambda: 0.6,
  },
});

sun.position.set(11.4, 15, -5.3);
sun.lookAt({ x: 0, y: 0, z: 0 });
view3d.root.addChild(sun);

// -- Ground plane (catches shadows) --

const ground = new Mesh3D({
  geometry: new PlaneGeometry({ width: 200, height: 200 }),
  material: new Material3D({
    baseColor: 0x6b7268,
    metallic: 0.0,
    roughness: 0.9,
  }),
  castShadow: false,
  receiveShadow: true,
});

ground.rotation.set(-Math.PI / 2, 0, 0);
ground.position.set(0, -0.13, 0);
view3d.root.addChild(ground);

// -- Track --

const track = buildTrack(view3d.root, sources);

// -- Physics --

const physics = new PhysicsWorld(new Vector3(3.5, 0.5, 5));

physics.addStaticGround([0, -0.125, 0], [50, 0.01, 50]);

for (const wall of track.walls) {
  physics.addStaticBox(wall);
}

// -- Audio --

const audio = new GameAudio();

void audio.load();

const unlockAudio = () => {
  audio.unlock();
  window.removeEventListener('keydown', unlockAudio);
  window.removeEventListener('pointerdown', unlockAudio);
};

window.addEventListener('keydown', unlockAudio);
window.addEventListener('pointerdown', unlockAudio);

// -- Vehicle --

const vehicle = new Vehicle(sources['vehicle-truck-yellow'], physics);

view3d.root.addChild(vehicle.container);

physics.listener = {
  onContactAdded(bodyA, bodyB) {
    if (bodyA !== physics.sphereBody && bodyB !== physics.sphereBody) return;

    const fx = Math.sin(vehicle.yaw);
    const fz = Math.cos(vehicle.yaw);
    const mv = vehicle.modelVelocity;
    const impactVelocity = Math.abs(mv.x * fx + mv.z * fz);

    audio.playImpact(impactVelocity);
  },
};

// -- HUD (PixiJS 2D over the 3D view) --

const hudLayer = new Container();

app.stage.addChild(hudLayer);

const lapTimer = new LapTimer(track);

hudLayer.addChild(lapTimer.container);

const joystick = new TouchJoystick(app.screen.width, app.screen.height);

hudLayer.addChild(joystick);

const controls = new Controls(joystick);

// -- FX --

const driftMarks = new DriftMarks(view3d.root);
const particles = new SmokeTrails(view3d.root, smokeTexture);

// -- Tick --

app.ticker.add(() => {
  joystick.resize(app.screen.width, app.screen.height);

  const dt = Math.min(app.ticker.deltaMS / 1000, 1 / 30);

  const input = controls.update();

  physics.step(dt);
  vehicle.update(dt, input);

  sun.position.set(vehicle.spherePos.x + 11.4, 15, vehicle.spherePos.z - 5.3);
  sun.lookAt({ x: vehicle.spherePos.x, y: 0, z: vehicle.spherePos.z });

  followCamera.update(dt, vehicle.container.position, vehicle.modelVelocity);

  driftMarks.update(dt, vehicle);
  particles.update(app.ticker, vehicle);
  audio.update(
    dt,
    vehicle.linearSpeed / MAX_SPEED,
    input.z,
    vehicle.driftIntensity,
  );

  const hasInput =
    input.touchActive || Math.abs(input.x) > 0.05 || Math.abs(input.z) > 0.05;

  lapTimer.update(dt, vehicle.container.position, hasInput);
});
