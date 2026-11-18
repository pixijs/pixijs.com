// description: Shapes on a round stage under a sun that slowly circles them, their shadows sweeping round the floor.
import {
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  SphereGeometry,
  TorusGeometry,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  preference: 'webgpu',
  resizeTo: window,
  antialias: true,
  resolution: Math.min(window.devicePixelRatio, 2), // sharp on phones and retina screens, at most 2x for speed
  autoDensity: true,
});
document.body.appendChild(app.canvas);
// A sideways drag turns the scene, and an up-and-down swipe still scrolls the page
app.canvas.style.touchAction = 'pan-y';

// The environment lights every side softly. It's a little dimmer than usual, since it lights the shadows too and a
// darker shadow reads better. The background is a dusk sky, and shadowFilter: 'pcf-high' gives shadows soft edges
const view3d = new View3D({
  autoResize: true,
  environment: { skyColor: 0xe6e0ff, groundColor: 0x3a2d52, intensity: 0.7 },
  background: { skyColor: 0x372f50, groundColor: 0x0d0a13 },
  shadowFilter: 'pcf-high',
});

app.stage.addChild(view3d);

// castShadow on the sun is the only switch shadows need: every mesh casts and catches them, and the floor turns
// casting off
const sun = new DirectionalLight({ color: 0xfff4ea, intensity: 2.2, castShadow: true });

view3d.root.addChild(sun);

const clay = (color) => new Material3D({ baseColor: color, roughness: 0.5 });

// A round stage. Its top is at y = 0, so a shape of height h stands on it at y = h / 2
const floor = new Mesh3D({
  geometry: new CylinderGeometry({ radiusTop: 2.6, radiusBottom: 2.6, height: 0.2, radialSegments: 96 }),
  material: new Material3D({ baseColor: 0x5c5078, roughness: 0.9 }),
  position: { x: 0, y: -0.1, z: 0 },
  castShadow: false, // the floor only catches shadows, so the sun's shadow detail goes to the shapes
});
const cone = new Mesh3D({ geometry: new ConeGeometry({ radius: 0.4, height: 1.6 }), material: clay(0xf2a65a) });
const ball = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.45 }), material: clay(0x38bdf8) });
const ring = new Mesh3D({ geometry: new TorusGeometry({ radius: 0.4, tube: 0.13 }), material: clay(0x8b5cf6) });
const box = new Mesh3D({
  geometry: new CubeGeometry({ width: 0.8, height: 0.8, depth: 0.8 }),
  material: clay(0xe91e63),
});

// A tall cone in the middle, like the pointer on a sundial, and three shapes round it
cone.position.set(0, 0.8, 0);
ball.position.set(0.75, 0.45, 1.3);
ring.position.set(0.75, 0.53, -1.3);
ring.rotation.x = Math.PI / 2; // a torus lies flat, so a quarter turn stands it up on its edge
box.position.set(-1.5, 0.4, 0);
box.rotation.y = 0.6;
view3d.root.addChild(floor, cone, ball, ring, box);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.75, 6.5);

// Drag to circle the camera round the middle. Damping eases it to a stop; with zoom off, the wheel scrolls the page
const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  maxPolarAngle: 1.35, // stay above the stage's rim
});

app.ticker.add((ticker) => {
  // The sun circles the stage, 40 degrees up, starting on the right and passing behind the shapes first, so their
  // shadows fall towards you. Only the way a sun faces matters, so it's aimed at the middle each frame
  const angle = (ticker.lastTime / 1000) * 0.4;

  sun.position.set(Math.cos(angle) * 5, 4.2, -Math.sin(angle) * 5);
  sun.lookAt({ x: 0, y: 0, z: 0 });

  // On a screen narrower than 1.1 wide to 1 tall, the camera steps back from 7.5 so the stage still fits across it
  const distance = 7.5 * Math.max(1, (1.1 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
