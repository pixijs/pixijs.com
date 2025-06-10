import { Graphics } from 'pixi.js';
import moonSvg from './moon.svg';

export function addMoon(app) {
  // Create a moon graphics object from an SVG code.
  const graphics = new Graphics().svg(moonSvg);

  // Position the moon.
  graphics.x = app.screen.width / 2 + 100;
  graphics.y = app.screen.height / 8;

  // Add the moon to the stage.
  app.stage.addChild(graphics);
}
