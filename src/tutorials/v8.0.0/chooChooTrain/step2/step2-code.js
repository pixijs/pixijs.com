import { Application } from 'pixi.js';
import { addStars } from './addStars';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Intialize the application.
  await app.init({ background: '#021f4b', resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  addStars(app);
})();
