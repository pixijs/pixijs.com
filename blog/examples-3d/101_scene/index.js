// description: A toy island at dusk, where a truck laps the road round a stand of pines, a pond and a cabin.
import {
  ConeGeometry,
  Container3D,
  CubeGeometry,
  CylinderGeometry,
  DirectionalLight,
  IcosahedronGeometry,
  Material3D,
  Mesh3D,
  Model3D,
  View3D,
} from '@pixi/3d';
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
  environment: { skyColor: 0xe6e0ff, groundColor: 0x3a2d52, intensity: 0.75 },
  background: { skyColor: 0x372f50, groundColor: 0x0d0a13 },
  shadowFilter: 'pcf-high', // soft edges on the shadows
});

app.stage.addChild(view3d);

// Light and shadows: one warm sun, low on the left, so every shadow falls across the island where you can see it
const sun = new DirectionalLight({ color: 0xffe2c4, intensity: 2.6, position: { x: -5, y: 5, z: 3 } });

sun.castShadow = true;
view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });

// Materials: a colour and a roughness each. flatShading gives every triangle one shade, for a chunky cut-paper look
const paper = (color, roughness = 0.8) => new Material3D({ baseColor: color, roughness, flatShading: true });
const road = paper(0x332e47, 0.9);

// Shapes: the island is a stack of discs, each a little smaller and higher than the last. They only catch shadows
const disc = (radius, height, y, material) =>
  new Mesh3D({
    geometry: new CylinderGeometry({ radiusTop: radius, radiusBottom: radius, height, radialSegments: 64 }),
    material,
    position: { x: 0, y, z: 0 },
    castShadow: false,
  });
// The pond is smooth, so it shines where the rough grass doesn't
const pond = disc(0.62, 0.04, 0.15, new Material3D({ baseColor: 0x38bdf8, roughness: 0.1 }));

pond.position.set(0.55, 0.15, 0.75);
view3d.root.addChild(
  disc(2.66, 0.36, -0.2, paper(0x5c5078)), // the base
  disc(2.54, 0.04, -0.02, road),
  disc(2.12, 0.04, -0.01, paper(0xb79cf9)), // its rim shows as the line down the middle of the road
  disc(2.08, 0.04, 0, road),
  disc(1.72, 0.14, 0.07, paper(0x58b98a)), // the grass
  pond,
);

// Transforms: a pine is a trunk with three cones as its children, so placing and scaling the trunk does the whole tree
const trunk = new CylinderGeometry({ radiusTop: 0.05, radiusBottom: 0.07, height: 0.3, radialSegments: 6 });
const cone = new ConeGeometry({ radius: 0.34, height: 0.5, radialSegments: 7 });
const pines = [
  [-0.7, -0.5, 1.5],
  [-1.15, 0.25, 1.1],
  [-0.2, -1.1, 1.2],
  [0.45, -0.75, 0.9],
  [-0.45, 0.55, 0.8],
  [1.2, -0.35, 1.1],
];

for (const [x, z, size] of pines) {
  // The grass is at y = 0.14, and the trunk's middle is half its height above that
  const pine = new Mesh3D({ geometry: trunk, material: paper(0x8a5a44), position: { x, y: 0.14 + 0.15 * size, z } });

  for (let tier = 0; tier < 3; tier++) {
    const leaves = new Mesh3D({ geometry: cone, material: paper(tier % 2 ? 0x2f9e7a : 0x27866b) });

    leaves.position.y = 0.35 + tier * 0.27;
    leaves.scale.set(1 - tier * 0.25); // each tier is smaller than the one below
    pine.addChild(leaves);
  }
  pine.scale.set(size);
  pine.rotation.y = x * 5; // a different turn for each, so no two catch the light the same way
  view3d.root.addChild(pine);
}

// A cabin: a box, a four-sided cone for a roof, a door, and a window that glows. emissive makes a surface give off
// its own light, so the window stays bright on the cabin's shaded side
const box = (width, height, depth, material, position) =>
  new Mesh3D({ geometry: new CubeGeometry({ width, height, depth }), material, position });
const cabin = box(0.55, 0.4, 0.5, paper(0xf2a65a), { x: -0.35, y: 0.34, z: 1.1 });
const roof = new Mesh3D({
  geometry: new ConeGeometry({ radius: 0.5, height: 0.35, radialSegments: 4 }),
  material: paper(0xe91e63),
  position: { x: 0, y: 0.37, z: 0 },
  rotation: { x: 0, y: Math.PI / 4, z: 0 },
});
const glow = new Material3D({ baseColor: 0xffd27a, emissive: { color: 0xffd27a, strength: 1.5 } });

cabin.rotation.y = 0.5;
cabin.addChild(
  roof,
  box(0.14, 0.26, 0.03, paper(0x5c2b4a), { x: 0.08, y: -0.06, z: 0.25 }),
  box(0.14, 0.14, 0.03, glow, { x: -0.14, y: 0.03, z: 0.25 }),
);
view3d.root.addChild(cabin);

// Two boulders by the pond. An icosahedron is already most of a rock
const rock = new IcosahedronGeometry({ radius: 0.18 });
const stone = new Material3D({ baseColor: 0x9a94b8, roughness: 0.8 });

view3d.root.addChild(
  new Mesh3D({ geometry: rock, material: stone, position: { x: 1.3, y: 0.22, z: 0.6 } }),
  new Mesh3D({ geometry: rock, material: stone, position: { x: 1.05, y: 0.18, z: 1.15 }, scale: 0.6 }),
);

// A model: the truck from the last example, shrunk to fit the road. It sits 2.33 out from `lap`, an empty container
// at the middle of the island, so turning the container drives the truck round
const source = await Assets.load(
  'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-yellow.glb',
);
const truck = new Model3D({ source });
const lap = new Container3D();

truck.scale.set(0.25);
truck.position.x = 2.33;
truck.rotation.y = Math.PI;
lap.addChild(truck);
view3d.root.addChild(lap);

// The camera: drag to circle the island. maxPolarAngle keeps it above the rim; with zoom off, the wheel scrolls the page
view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.4, 6.2);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  maxPolarAngle: 1.35,
});

app.ticker.add((ticker) => {
  lap.rotation.y += 0.6 * (ticker.deltaMS / 1000); // a lap about every ten seconds

  // On a screen narrower than 1.2 wide to 1 tall, the camera steps back from 7 so the island still fits across it
  const distance = 7 * Math.max(1, (1.2 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
