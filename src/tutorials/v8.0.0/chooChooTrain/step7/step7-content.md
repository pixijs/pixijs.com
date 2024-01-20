# Adding Train Head

We will start by making the head of the train first, and to do so we will be separating them into parts:

- Cabin
- Door
- Window
- Roof
- Front
- Chimney
- Wheels

Apart from the wheels, the parts will be drawn using a single Graphics instance. Let wrap all of the logic for this inside the already set-up `createTrainHead()` function that will return a Container element holding all the parts together.

## Body

The body parts includes the cabin with its overlaying door and window topped with a roof, and the protruding front with the chimney on top.

```javascript
const frontHeight = 100;
const frontWidth = 140;
const frontRadius = frontHeight / 2;

const cabinHeight = 200;
const cabinWidth = 150;
const cabinRadius = 15;

const chimneyBaseWidth = 30;
const chimneyTopWidth = 50;
const chimneyHeight = 70;
const chimneyDomeHeight = 25;
const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
const chimneyStartX = cabinWidth + frontWidth - frontRadius - chimneyBaseWidth;
const chimneyStartY = -frontHeight;

const roofHeight = 25;
const roofExcess = 20;

const doorWidth = cabinWidth * 0.7;
const doorHeight = cabinHeight * 0.7;
const doorStartX = (cabinWidth - doorWidth) * 0.5;
const doorStartY = -(cabinHeight - doorHeight) * 0.5 - doorHeight;

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
```

## Wheels

For the wheels, lets make a helper function that will instantiate individual wheel given a radius. This has been set up for you as the `createTrainWheel(radius)` function.

Inside a wheel, we can split it further into parts as:

- Wheel base
- Tyre surrounding the base
- Spokes on the base

```javascript
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
```

Then we can this helper function inside the `createTrainHead()` function to create the 3 wheels for the train head which include one larger wheel at the back and two standard sized ones in front.

```javascript
const bigWheelRadius = 55;
const smallWheelRadius = 35;
const wheelGap = 5;
const wheelOffsetY = 5;

const backWheel = createTrainWheel(bigWheelRadius);
const midWheel = createTrainWheel(smallWheelRadius);
const frontWheel = createTrainWheel(smallWheelRadius);

backWheel.x = bigWheelRadius;
backWheel.y = wheelOffsetY;
midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;
frontWheel.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
frontWheel.y = midWheel.y;
```

## Combine and Animate

Now that we have the Graphics instance of the train head's body and its wheels, let add them all onto a wrapping container and then animate the spinning of the wheels before returning the container as the result. Notice here that we make the back wheel rotate proportionally slower like it logically should as it's bigger with more circumference to cover in a revolution.

```javascript
const container = new Container();

container.addChild(graphics, backWheel, midWheel, frontWheel);

app.ticker.add((time) =>
{
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
    midWheel.rotation += dr;
    frontWheel.rotation += dr;
});

return container;
```