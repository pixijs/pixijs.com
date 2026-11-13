// description: A tiny solar system: a child turns with its parent, so turning the star swings the planet round it, and turning the planet swings the moon.
import { DirectionalLight, Material3D, Mesh3D, SphereGeometry, TorusGeometry, View3D } from '@pixi/3d';
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

const clay = (color) => new Material3D({ baseColor: color, roughness: 0.5 });
// A thin ring that marks a path. A torus lies flat, the way the planets go round
const ring = (radius) =>
  new Mesh3D({ geometry: new TorusGeometry({ radius, tube: 0.012, tubularSegments: 128 }), material: clay(0x5c5078) });

const star = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.7 }), material: clay(0xf2a65a) });
const planet = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.32 }), material: clay(0x38bdf8) });
const moon = new Mesh3D({ geometry: new SphereGeometry({ radius: 0.12 }), material: clay(0xb79cf9) });

// A child's position is measured from its parent: the planet sits 2.4 out from the star, the moon 0.65 from the planet
planet.position.set(2.4, 0, 0);
moon.position.set(0.65, 0, 0);

view3d.root.addChild(star);
star.addChild(planet, ring(2.4));
planet.addChild(moon, ring(0.65)); // the moon's ring is the planet's child too, so it travels with the planet

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.7, 5);

// Drag to circle the camera round the star. It aims a little below the star, since the near side of the planet's
// path looks bigger than the far side. Damping eases it to a stop; with zoom off, the wheel scrolls the page
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: -0.6, z: 0 },
  maxPolarAngle: 1.2, // stay above the paths, so they read as circles
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
});

app.ticker.add((ticker) => {
  const frameSeconds = ticker.deltaMS / 1000; // the time since the last frame

  // Only rotations change: the planet's and the moon's positions never do. Turning the star swings the planet round
  // it, and turning the planet swings the moon
  star.rotation.y += 0.4 * frameSeconds;
  planet.rotation.y += 1.2 * frameSeconds;

  // On a screen narrower than 1.25 wide to 1 tall, the camera steps back from 6.6 so the solar system still fits
  // across it
  const distance = 6.6 * Math.max(1, (1.25 * app.screen.height) / app.screen.width);

  orbit.minDistance = distance;
  orbit.maxDistance = distance;
});
