// description: A toy truck an artist made in a 3D tool, loaded from a glTF file and turning slowly on a stage.
import { CylinderGeometry, DirectionalLight, Material3D, Mesh3D, Model3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

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
  shadowFilter: 'pcf-high', // soft edges on the shadows
});

app.stage.addChild(view3d);

// One sun, high up on the left. castShadow makes the truck throw a shadow on the stage
const sun = new DirectionalLight({ color: 0xfff4ea, intensity: 2.2, position: { x: -3, y: 8, z: 4 } });

sun.castShadow = true;
view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });

// A round stage. Its top is at y = 0, where the truck's wheels touch down
const floor = new Mesh3D({
  geometry: new CylinderGeometry({ radiusTop: 1.9, radiusBottom: 1.9, height: 0.2, radialSegments: 96 }),
  material: new Material3D({ baseColor: 0x5c5078, roughness: 0.9 }),
  position: { x: 0, y: -0.1, z: 0 },
  castShadow: false,
});

view3d.root.addChild(floor);

// Three lines load a model: Assets reads the glTF file, a Model3D builds it, and it goes in the scene like any shape.
// The file brings its own shapes, colours and size: the truck is 2.8 long, so it fits the stage as it is
const source = await Assets.load(
  'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-yellow.glb',
);
const truck = new Model3D({ source });

view3d.root.addChild(truck);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.1, 4.9);

// Drag to circle the truck. maxPolarAngle keeps the camera above the stage; with zoom off, the wheel scrolls the page
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  maxPolarAngle: 1.35,
});

app.ticker.add((ticker) => {
  // The turntable: a slow spin that shows the truck from every side
  truck.rotation.y += 0.3 * (ticker.deltaMS / 1000);

  // On a screen narrower than 1.3 wide to 1 tall, the camera steps back from 5.3 so the stage still fits across it
  const distance = 5.3 * Math.max(1, (1.3 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
