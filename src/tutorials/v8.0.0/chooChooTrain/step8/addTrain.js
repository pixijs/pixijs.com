import { Container, Graphics } from 'pixi.js';

export function addTrain(app, container) {
  const head = createTrainHead(app);
  const carriage = createTrainCarriage(app);

  /** -- ADJUST CODE HERE -- */

  // Add the head to the train container.
  container.addChild(head);

  // Add the train container to the stage.
  app.stage.addChild(container);

  const scale = 0.75;

  // Adjust the scaling of the train.
  container.scale.set(scale);

  // Position the train, taking into account the variety of screen width.
  // To keep the train as the main focus, the train is offset slightly to the left of the screen center.
  container.x = app.screen.width / 2 - head.width / 2;
  container.y = app.screen.height - 35 - 55 * scale;
}

function createTrainHead(app) {
  // Create a container to hold all the train head parts.
  const container = new Container();

  // Define the dimensions of the head front.
  const frontHeight = 100;
  const frontWidth = 140;
  const frontRadius = frontHeight / 2;

  // Define the dimensions of the cabin.
  const cabinHeight = 200;
  const cabinWidth = 150;
  const cabinRadius = 15;

  // Define the dimensions of the chimney.
  const chimneyBaseWidth = 30;
  const chimneyTopWidth = 50;
  const chimneyHeight = 70;
  const chimneyDomeHeight = 25;
  const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
  const chimneyStartX = cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
  const chimneyStartY = -frontHeight;

  // Define the dimensions of the roof.
  const roofHeight = 25;
  const roofExcess = 20;

  // Define the dimensions of the door.
  const doorWidth = cabinWidth * 0.7;
  const doorHeight = cabinHeight * 0.7;
  const doorStartX = (cabinWidth - doorWidth) * 0.5;
  const doorStartY = -(cabinHeight - doorHeight) * 0.5 - doorHeight;

  // Define the dimensions of the window.
  const windowWidth = doorWidth * 0.8;
  const windowHeight = doorHeight * 0.4;
  const offset = (doorWidth - windowWidth) / 2;

  const graphics = new Graphics()
    // Draw the chimney
    .moveTo(chimneyStartX, chimneyStartY)
    .lineTo(chimneyStartX - chimneyTopOffset, chimneyStartY - chimneyHeight + chimneyDomeHeight)
    .quadraticCurveTo(
      chimneyStartX + chimneyBaseWidth / 2,
      chimneyStartY - chimneyHeight - chimneyDomeHeight,
      chimneyStartX + chimneyBaseWidth + chimneyTopOffset,
      chimneyStartY - chimneyHeight + chimneyDomeHeight,
    )
    .lineTo(chimneyStartX + chimneyBaseWidth, chimneyStartY)
    .fill({ color: 0x121212 })

    // Draw the head front
    .roundRect(
      cabinWidth - frontRadius - cabinRadius,
      -frontHeight,
      frontWidth + frontRadius + cabinRadius,
      frontHeight,
      frontRadius,
    )
    .fill({ color: 0x7f3333 })

    // Draw the cabin
    .roundRect(0, -cabinHeight, cabinWidth, cabinHeight, cabinRadius)
    .fill({ color: 0x725f19 })

    // Draw the roof
    .rect(-roofExcess / 2, cabinRadius - cabinHeight - roofHeight, cabinWidth + roofExcess, roofHeight)
    .fill({ color: 0x52431c })

    // Draw the door
    .roundRect(doorStartX, doorStartY, doorWidth, doorHeight, cabinRadius)
    .stroke({ color: 0x52431c, width: 3 })

    // Draw the window
    .roundRect(doorStartX + offset, doorStartY + offset, windowWidth, windowHeight, 10)
    .fill({ color: 0x848484 });

  // Define the dimensions of the wheels.
  const bigWheelRadius = 55;
  const smallWheelRadius = 35;
  const wheelGap = 5;
  const wheelOffsetY = 5;

  // Create all the wheels.
  const backWheel = createTrainWheel(bigWheelRadius);
  const midWheel = createTrainWheel(smallWheelRadius);
  const frontWheel = createTrainWheel(smallWheelRadius);

  // Position the wheels.
  backWheel.x = bigWheelRadius;
  backWheel.y = wheelOffsetY;
  midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
  midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;
  frontWheel.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
  frontWheel.y = midWheel.y;

  // Add all the parts to the container.
  container.addChild(graphics, backWheel, midWheel, frontWheel);

  // Animate the wheels - making the big wheel rotate proportionally slower than the small wheels.
  app.ticker.add((time) => {
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
    midWheel.rotation += dr;
    frontWheel.rotation += dr;
  });

  return container;
}

function createTrainCarriage(app) {
  /** -- INSERT CODE HERE -- */
}

function createTrainWheel(radius) {
  // Define the dimensions of the wheel.
  const strokeThickness = radius / 3;
  const innerRadius = radius - strokeThickness;

  return (
    new Graphics()
      .circle(0, 0, radius)
      // Draw the wheel
      .fill({ color: 0x848484 })
      // Draw the tyre
      .stroke({ color: 0x121212, width: strokeThickness, alignment: 1 })
      // Draw the spokes
      .rect(-strokeThickness / 2, -innerRadius, strokeThickness, innerRadius * 2)
      .rect(-innerRadius, -strokeThickness / 2, innerRadius * 2, strokeThickness)
      .fill({ color: 0x4f4f4f })
  );
}
