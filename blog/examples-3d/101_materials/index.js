// description: Eight pink spheres, smooth to rough from left to right, plastic on the bottom row and metal on the top.
import { Container3D, DirectionalLight, Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, Text } from 'pixi.js';

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

// A cube map: six photos of a sunset, one for each side of a box round the scene. Shiny surfaces reflect it
const sunset = await Assets.load('https://pixijs.com/assets/3d/venice-sunset/venice-sunset.cubemap');

// The sunset is the light all round the spheres and the picture they reflect. The background is still a dusk sky
const view3d = new View3D({
  autoResize: true,
  environment: sunset,
  background: { skyColor: 0x372f50, groundColor: 0x0d0a13 },
});

app.stage.addChild(view3d);

// One sun, high up on the left, gives every sphere a bright side and a highlight
const sun = new DirectionalLight({ color: 0xfff4ea, intensity: 2.2, position: { x: -3, y: 8, z: 4 } });

view3d.root.addChild(sun);
sun.lookAt({ x: 0, y: 0, z: 0 });

// Every sphere shares one geometry and one colour. Only two numbers in its material change
const ball = new SphereGeometry({ radius: 0.55, widthSegments: 64, heightSegments: 32 });
const grid = new Container3D();

for (let column = 0; column < 4; column++) {
  for (let row = 0; row < 2; row++) {
    const material = new Material3D({
      baseColor: 0xe91e63,
      roughness: column / 3, // left to right: from 0, a mirror, to 1, as matte as chalk
      metallic: row, // the bottom row is 0, plastic, and the top row is 1, metal
    });
    const sphere = new Mesh3D({ geometry: ball, material });

    sphere.position.set((column - 1.5) * 1.4, (row - 0.5) * 1.45, 0);
    grid.addChild(sphere);
  }
}

view3d.root.addChild(grid);

// Two names, one along each edge of the grid, in 2D text on the stage
const style = { fill: 0xf5f2f8, fontSize: 15, fontWeight: 'bold' };
const roughnessLabel = new Text({ text: 'roughness →', style, anchor: 0.5 });
const metallicLabel = new Text({ text: 'metallic →', style, anchor: 0.5, rotation: -Math.PI / 2 });

app.stage.addChild(roughnessLabel, metallicLabel);

// The metallic name hangs off the grid, to its left and a little in front, so it sways with the spheres and never
// crosses one
const metallicMark = new Container3D({ position: { x: -3.2, y: 0, z: 0.3 } });

grid.addChild(metallicMark);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 0.7, 6.6);

// Drag to turn the camera and watch the reflections slide. With zoom off, the wheel scrolls the page.
// The azimuth limits stop it about 30° either side of the front, so the grid always reads left to right
const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
});

app.ticker.add((ticker) => {
  // A slow sway, so the light and the reflections move across the spheres
  grid.rotation.y = Math.sin((ticker.lastTime / 1000) * 0.8) * 0.25;

  view3d.worldToScreen({ x: 0, y: -1.65, z: 0 }, roughnessLabel.position);
  view3d.worldToScreen(metallicMark.getGlobalPosition(), metallicLabel.position);

  // On a screen narrower than 1.55 wide to 1 tall, the camera steps back from 6.6 so the grid still fits across it
  const distance = 6.6 * Math.max(1, (1.55 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
