# Adding Train Carriage

Accompanying the head, let's add a trailing carriage to complete a running train. Here we will be doing the same procedures as when we were building the head inside the new `createTrainCarriage()` function. The carriage consists of 4 parts:

- Container
- Top Edge
- Connectors
- Wheels

We can re-use the `createTrainWheel(radius)` function to create the two standard sized wheels which will be animated in the same manner as before.

```javascript
const container = new Container();

const containerHeight = 125;
const containerWidth = 200;
const containerRadius = 15;
const edgeHeight = 25;
const edgeExcess = 20;
const connectorWidth = 30;
const connectorHeight = 10;
const connectorGap = 10;
const connectorOffsetY = 20;

const graphics = new Graphics()
    // Draw the body
    .roundRect(edgeExcess / 2, -containerHeight, containerWidth, containerHeight, containerRadius)
    .fill({ color: 0x725f19 })

    // Draw the top edge
    .rect(0, containerRadius - containerHeight - edgeHeight, containerWidth + edgeExcess, edgeHeight)
    .fill({ color: 0x52431c })

    // Draw the connectors
    .rect(containerWidth + edgeExcess / 2, -connectorOffsetY - connectorHeight, connectorWidth, connectorHeight)
    .rect(
        containerWidth + edgeExcess / 2,
        -connectorOffsetY - connectorHeight * 2 - connectorGap,
        connectorWidth,
        connectorHeight,
    )
    .fill({ color: 0x121212 });

const wheelRadius = 35;
const wheelGap = 40;
const centerX = (containerWidth + edgeExcess) / 2;
const offsetX = wheelRadius + wheelGap / 2;

const backWheel = createTrainWheel(wheelRadius);
const frontWheel = createTrainWheel(wheelRadius);

backWheel.x = centerX - offsetX;
frontWheel.x = centerX + offsetX;
frontWheel.y = backWheel.y = 25;

container.addChild(graphics, backWheel, frontWheel);

app.ticker.add((time) =>
{
    const dr = time.deltaTime * 0.15;

    backWheel.rotation += dr;
    frontWheel.rotation += dr;
});

return container;
```

## Assemble Train

With the `createTrainHead()` and `createTrainCarriage()` functions completed, let's use them to create the sections, adding them to a wrapping container, offsetting the trailing carriage to be behind the train head. We can then top it up with a little bobble up and down to simulate shaking due to the travel along the track.

```javascript
const head = createTrainHead();
const carriage = createTrainCarriage();

carriage.x = -carriage.width;

trainContainer.addChild(head, carriage);
app.stage.addChild(trainContainer);

const scale = 0.75;

trainContainer.scale.set(scale);
trainContainer.x = app.screen.width / 2 - head.width / 2;

let elapsed = 0;
const shakeDistance = 3;
const baseY = app.screen.height - 35 - 55 * scale;
const speed = 0.5;

trainContainer.y = baseY;

app.ticker.add((time) =>
{
    elapsed += time.deltaTime;
    const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;

    trainContainer.y = baseY + offset;
});
```

We have now successfully crafted a evening scene of a training moving through the landscape with just the Graphics API. But what's the point of having a chimney without any smoke!