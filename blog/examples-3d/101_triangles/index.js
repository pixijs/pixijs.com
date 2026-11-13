// description: One shape three ways: its vertices as points, its triangles as lines, and the solid surface they make.
import {
  Container3D,
  DirectionalLight,
  FlatMaterial,
  Geometry3D,
  IcosahedronGeometry,
  Material3D,
  Mesh3D,
  SphereGeometry,
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

// A ball built from 42 vertices joined into 80 triangles. The geometry holds both lists
const shape = new IcosahedronGeometry({ radius: 0.95, detail: 1 });
const { positions, indices } = shape;

// Each vertex is three numbers in positions: its x, y and z. A small pink ball marks each one
const vertices = new Container3D({ position: { x: -2.4, y: 0, z: 0 } });
const dot = new SphereGeometry({ radius: 0.055 });
const pink = new Material3D({ baseColor: 0xe91e63, roughness: 0.5 });

for (let i = 0; i < positions.length; i += 3) {
  const position = { x: positions[i], y: positions[i + 1], z: positions[i + 2] };

  vertices.addChild(new Mesh3D({ geometry: dot, material: pink, position }));
}

// Each triangle is three numbers in indices: the vertices it joins. Its three sides become lines
const sides = [];

for (let i = 0; i < indices.length; i += 3) {
  sides.push(indices[i], indices[i + 1], indices[i + 1], indices[i + 2], indices[i + 2], indices[i]);
}

// line-list joins each pair of indices with a line, instead of each three with a triangle. A flat material ignores
// light, so every line stays the same blue
const lines = new Geometry3D({ positions, indices: new Uint16Array(sides), topology: 'line-list' });
const triangles = new Mesh3D({ geometry: lines, material: new FlatMaterial({ baseColor: 0x38bdf8 }) });

// The same geometry drawn whole: the triangles filled in, with light shading the surface
const solid = new Mesh3D({ geometry: shape, material: new Material3D({ baseColor: 0x8b5cf6, roughness: 0.5 }) });

solid.position.x = 2.4;

view3d.root.addChild(vertices, triangles, solid);

// Each name is 2D text on the stage, moved under its shape every frame
const names = [`${shape.vertexCount} vertices`, `${indices.length / 3} triangles`, 'solid'];
const labels = names.map((text, i) => {
  const label = new Text({ text, style: { fill: 0xf5f2f8, fontSize: 15, fontWeight: 'bold' }, anchor: 0.5 });

  app.stage.addChild(label);

  return { label, at: { x: (i - 1) * 2.4, y: -1.3, z: 0 } };
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 0.8, 6.35);

// Drag to turn the camera round the middle. Damping eases it to a stop; with zoom off, the wheel scrolls the page.
// The azimuth limits stop it about 30° either side of the front, so the three stay side by side
const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
});

app.ticker.add((ticker) => {
  // All three turn together, so every point and line stays lined up with its twin
  for (const node of [vertices, triangles, solid]) node.rotation.y += 0.4 * (ticker.deltaMS / 1000);

  for (const { label, at } of labels) view3d.worldToScreen(at, label.position);

  // On a screen narrower than 1.8 wide to 1 tall, the camera steps back from 6.4 so all three still fit across it
  const distance = 6.4 * Math.max(1, (1.8 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
