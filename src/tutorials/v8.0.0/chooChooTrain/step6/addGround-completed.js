import { Graphics } from 'pixi.js';

export function addGround(app) {
  const width = app.screen.width;

  // Create and draw the bottom ground graphic.
  const groundHeight = 20;
  const groundY = app.screen.height;
  const ground = new Graphics().rect(0, groundY - groundHeight, width, groundHeight).fill({ color: 0xdddddd });

  // Add the ground to the stage.
  app.stage.addChild(ground);

  // Define the total height of the track. Both the planks and the rail layers.
  const trackHeight = 15;

  // Define the dimensions and parameters for the planks.
  const plankWidth = 50;
  const plankHeight = trackHeight / 2;
  const plankGap = 20;
  const plankCount = width / (plankWidth + plankGap) + 1;
  const plankY = groundY - groundHeight;

  // Create an array to store all the planks.
  const planks = [];

  for (let index = 0; index < plankCount; index++) {
    // Create and draw a plank graphic.
    const plank = new Graphics().rect(0, plankY - plankHeight, plankWidth, plankHeight).fill({ color: 0x241811 });

    // Position the plank to distribute it across the screen.
    plank.x = index * (plankWidth + plankGap);

    // Add the plank to the stage and the reference array.
    app.stage.addChild(plank);
    planks.push(plank);
  }

  // Create and draw the rail strip graphic.
  const railHeight = trackHeight / 2;
  const railY = plankY - plankHeight;
  const rail = new Graphics().rect(0, railY - railHeight, width, railHeight).fill({ color: 0x5c5c5c });

  // Add the rail to the stage.
  app.stage.addChild(rail);

  // Animate just the planks to simulate the passing of the ground.
  // Since the rail and the ground are uniform strips, they do not need to be animated.
  app.ticker.add((time) => {
    // Calculate the amount of distance to move the planks per tick.
    const dx = time.deltaTime * 6;

    planks.forEach((plank) => {
      // Move the planks leftwards.
      plank.x -= dx;

      // Reposition the planks when they move off screen.
      if (plank.x <= -(plankWidth + plankGap)) {
        plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
      }
    });
  });
}
