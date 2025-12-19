// dependencies: { "pixi.js": "latest", "pixi-filters": "latest", "tweakpane": "latest" }
// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { setup } from './helper';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1B1B1D', resizeTo: window, antialias: true });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load('http://localhost:3000/examples/assets/shapes/pink-star-emboss.png');

  // add a single container with a sprite and rotate it around its center
  const pivotContainer = new Container();
  pivotContainer.position.set(app.screen.width / 2, app.screen.height / 2);

  // add a sprite to the container
  const shape = new Sprite(texture);
  shape.scale.set(0.75);
  pivotContainer.addChild(shape);

  // set the pivot to the center of the container by default
  pivotContainer.pivot.set(pivotContainer.width / 2, pivotContainer.height / 2);

  app.ticker.add((time) => {
    // rotate the container around the pivot point
    pivotContainer.rotation -= 0.01 * time.deltaTime;
  });

  app.stage.addChild(pivotContainer);

  // Setup the demo
  await setup(app, pivotContainer);
})();
