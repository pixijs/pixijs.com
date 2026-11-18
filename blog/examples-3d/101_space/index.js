// description: The three axes of 3D space, x, y and z, with a shape sliding along each one.
import {
  ConeGeometry,
  Container3D,
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
import { Application, Text } from 'pixi.js';

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

// The environment lights every side softly, lavender from above and plum from below. The background is a dusk sky
const view3d = new View3D({
  autoResize: true,
  environment: { skyColor: 0xe6e0ff, groundColor: 0x3a2d52, intensity: 1 },
  background: { skyColor: 0x372f50, groundColor: 0x0d0a13 },
});

app.stage.addChild(view3d);

// One sun, high up on the left, gives every shape a bright side and a shaded side
const sun = new DirectionalLight({ color: 0xfff4ea, intensity: 2.2, position: { x: -3, y: 8, z: 4 } });

view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });

const clay = (color) => new Material3D({ baseColor: color, roughness: 0.5 });
const labels = [];

// An axis is a rod with a cone on the end. It's built pointing up (+y), then turned to point along its own axis
function addAxis(name, color, rotation, tip) {
  const rod = new CylinderGeometry({ radiusTop: 0.04, radiusBottom: 0.04, height: 2.4 });
  const cone = new ConeGeometry({ radius: 0.12, height: 0.3 });
  const arrow = new Container3D({ rotation });

  arrow.addChild(new Mesh3D({ geometry: rod, material: clay(color), position: { x: 0, y: 1.2, z: 0 } }));
  arrow.addChild(new Mesh3D({ geometry: cone, material: clay(color), position: { x: 0, y: 2.55, z: 0 } }));
  view3d.root.addChild(arrow);

  // The axis's name is 2D text on the stage, moved over its tip every frame
  const label = new Text({ text: name, style: { fill: color, fontSize: 20, fontWeight: 'bold' }, anchor: 0.5 });

  app.stage.addChild(label);
  labels.push({ label, tip });
}

addAxis('x', 0xff5c6c, { x: 0, y: 0, z: -Math.PI / 2 }, { x: 3.05, y: 0, z: 0 }); // x points right
addAxis('y', 0x5ee08a, { x: 0, y: 0, z: 0 }, { x: 0, y: 3.05, z: 0 }); // y points up
addAxis('z', 0x4d9dff, { x: Math.PI / 2, y: 0, z: 0 }, { x: 0, y: 0, z: 3.05 }); // z points towards you

// The origin, where the axes meet and x, y and z are all 0, and one shape on each axis
const origin = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.09 }), material: clay(0xb79cf9) });
const ball = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.36 }), material: clay(0x38bdf8) });
const ring = new Mesh3D({ geometry: new TorusGeometry({ radius: 0.36, tube: 0.12 }), material: clay(0xf2a65a) });
const box = new Mesh3D({
  geometry: new CubeGeometry({ width: 0.55, height: 0.55, depth: 0.55 }),
  material: clay(0xe91e63),
});

view3d.root.addChild(origin, ball, ring, box);

view3d.camera.fov = 40;
view3d.camera.position.set(4.6, 3.5, 5.6);

// Drag to circle the camera round the middle. Damping eases it to a stop; with zoom off, the wheel scrolls the page
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0.6, y: 1.1, z: 0.6 },
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
});

app.ticker.add((ticker) => {
  const seconds = ticker.lastTime / 1000;

  // A position is three numbers. Each shape changes only one of them, so it slides along one axis
  ball.position.set(1.4 + Math.sin(seconds) * 0.6, 0, 0);
  ring.position.set(0, 1.4 + Math.sin(seconds + 2) * 0.6, 0);
  box.position.set(0, 0, 1.4 + Math.sin(seconds + 4) * 0.6);

  for (const { label, tip } of labels) view3d.worldToScreen(tip, label.position);

  // On a screen narrower than 1.05 wide to 1 tall, the camera steps back from 7.4 so all three axes still fit across it
  const distance = 7.4 * Math.max(1, (1.05 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
