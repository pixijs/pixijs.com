// description: A dim room and one small bulb that follows the pointer: each shape shows its form only where the light reaches it.
import {
  AmbientLight,
  CubeGeometry,
  CylinderGeometry,
  FlatMaterial,
  Material3D,
  Mesh3D,
  Plane,
  PointLight,
  SphereGeometry,
  TorusKnotGeometry,
  View3D,
} from '@pixi/3d';
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
// A sideways drag moves the light, and an up-and-down swipe still scrolls the page
app.canvas.style.touchAction = 'pan-y';

// The room's only other light is a faint ambient light, the same from every side, so a shape the bulb can't reach is
// one flat colour
const view3d = new View3D({
  autoResize: true,
  background: { skyColor: 0x372f50, groundColor: 0x0d0a13 },
});

app.stage.addChild(view3d);
view3d.root.addChild(new AmbientLight({ color: 0xe6e0ff, intensity: 0.25 }));

// A point light shines every way from one spot, like a bulb. It fades with distance and stops at its range
const bulb = new PointLight({ color: 0xfff4ea, intensity: 5, range: 3.2, position: { x: 0, y: 1, z: 1.6 } });

// The light itself is invisible, so a small glowing ball rides along as its child. A flat material ignores light
bulb.addChild(
  new Mesh3D({ geometry: new SphereGeometry({ radius: 0.07 }), material: new FlatMaterial({ baseColor: 0xfff4ea }) }),
);
view3d.root.addChild(bulb);

const clay = (color) => new Material3D({ baseColor: color, roughness: 0.5 });

// A round stage. Its top is at y = 0, so a shape of height h stands on it at y = h / 2
const floor = new Mesh3D({
  geometry: new CylinderGeometry({ radiusTop: 2.7, radiusBottom: 2.7, height: 0.2, radialSegments: 96 }),
  material: new Material3D({ baseColor: 0x5c5078, roughness: 0.9 }),
  position: { x: 0, y: -0.1, z: 0 },
});
const ball = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.55 }), material: clay(0x38bdf8) });
const knot = new Mesh3D({
  // More segments than the default keep the knot smooth when the light passes close
  geometry: new TorusKnotGeometry({ radius: 0.42, tube: 0.15, tubularSegments: 128, radialSegments: 16 }),
  material: clay(0xe91e63),
});
const box = new Mesh3D({
  geometry: new CubeGeometry({ width: 0.9, height: 0.9, depth: 0.9 }),
  material: clay(0xf2a65a),
});

ball.position.set(-1.7, 0.55, 0);
knot.position.set(0, 0.75, 0);
box.position.set(1.7, 0.45, 0);
view3d.root.addChild(floor, ball, knot, box);

view3d.camera.fov = 40;

// The pointer moves the bulb across an invisible sheet that faces the camera, 1.6 in front of the shapes
const sheet = new Plane().setFromNormalAndCoplanarPoint({ x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1.6 });
const goal = { x: 0, y: 1 };
let following = false;

function follow(event) {
  const point = view3d.screenToWorld(event.global, sheet);

  if (point) {
    goal.x = point.x;
    goal.y = Math.max(point.y, 0.2); // keep the bulb above the floor
    following = true;
  }
}

view3d.on('pointermove', follow);
view3d.on('pointerdown', follow);
// A mouse leaving hands the bulb back to its wander. A finger lifting fires the same event, so the bulb stays where it
// was tapped
view3d.on('pointerleave', (event) => {
  if (event.pointerType === 'mouse') following = false;
});

app.ticker.add((ticker) => {
  const seconds = ticker.lastTime / 1000;

  // With no pointer over the scene, the bulb wanders along the row on its own
  if (!following) {
    goal.x = Math.sin(seconds * 0.5) * 2;
    goal.y = 0.9 + Math.sin(seconds * 1.3) * 0.5;
  }

  // Each frame the bulb moves a tenth of the way to its goal, so it glides rather than jumps
  bulb.position.x += (goal.x - bulb.position.x) * 0.1;
  bulb.position.y += (goal.y - bulb.position.y) * 0.1;

  knot.rotation.y += 0.3 * (ticker.deltaMS / 1000);
  box.rotation.y += 0.3 * (ticker.deltaMS / 1000);

  // On a screen narrower than 1.4 wide to 1 tall, the camera steps back so the row still fits across it
  const fit = Math.max(1, (1.4 * app.screen.height) / app.screen.width);

  view3d.camera.position.set(0, 2.1 * fit, 6.2 * fit);
  view3d.camera.lookAt({ x: 0, y: 0.35, z: 0 });
});
