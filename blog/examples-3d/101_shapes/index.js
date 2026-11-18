// description: The nine built-in shapes in clay, each one a geometry for its shape and a material for its surface.
import {
  CapsuleGeometry,
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  DirectionalLight,
  IcosahedronGeometry,
  Material3D,
  Mesh3D,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
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

// The surface: soft clay in one colour. doubleSided draws the back of each face too, which the flat plane needs
const clay = (color) => new Material3D({ baseColor: color, roughness: 0.5, doubleSided: true });

// A mesh is a geometry, its shape, and a material, its surface
const meshes = [
  new Mesh3D({ geometry: new TorusKnotGeometry({ radius: 0.34, tube: 0.12 }), material: clay(0xe91e63) }),
  new Mesh3D({ geometry: new SphereGeometry({ radius: 0.5 }), material: clay(0x38bdf8) }),
  new Mesh3D({ geometry: new TorusGeometry({ radius: 0.38, tube: 0.15 }), material: clay(0xf2a65a) }),
  new Mesh3D({ geometry: new ConeGeometry({ radius: 0.45, height: 0.95 }), material: clay(0x8b5cf6) }),
  new Mesh3D({ geometry: new CubeGeometry({ width: 0.75, height: 0.75, depth: 0.75 }), material: clay(0xf48fb1) }),
  new Mesh3D({ geometry: new CapsuleGeometry({ radius: 0.3, height: 1 }), material: clay(0x9adcfb) }),
  new Mesh3D({ geometry: new IcosahedronGeometry({ radius: 0.52 }), material: clay(0xb79cf9) }),
  new Mesh3D({
    geometry: new CylinderGeometry({ radiusTop: 0.4, radiusBottom: 0.4, height: 0.85 }),
    material: clay(0xe91e63),
  }),
  new Mesh3D({ geometry: new PlaneGeometry({ width: 0.8, height: 0.8 }), material: clay(0x38bdf8) }),
];

// Three rows of three, 1.5 apart: i % 3 is the column and Math.floor(i / 3) the row
meshes.forEach((mesh, i) => {
  mesh.position.set(((i % 3) - 1) * 1.5, (1 - Math.floor(i / 3)) * 1.5, 0);
  mesh.rotation.set(i, i * 2, 0); // each shape starts at its own angle
  view3d.root.addChild(mesh);
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 1.5, 7);

// Drag to circle the camera round the middle. Damping eases it to a stop; with zoom off, the wheel scrolls the page
const orbit = new OrbitCamera({ view: view3d, enableDamping: true, enablePan: false, enableZoom: false });

app.ticker.add((ticker) => {
  // A slow tumble that brings every side round
  for (const mesh of meshes) {
    mesh.rotation.x += 0.3 * (ticker.deltaMS / 1000);
    mesh.rotation.y += 0.5 * (ticker.deltaMS / 1000);
  }

  // On a screen narrower than 1.1 wide to 1 tall, the camera steps back from 7.2 so the grid still fits across it
  const distance = 7.2 * Math.max(1, (1.1 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
