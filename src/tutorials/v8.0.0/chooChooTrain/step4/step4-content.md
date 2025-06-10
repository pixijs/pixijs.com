# Adding Mountains

For the background let's put up some mountains, shall we? We will also animate them to the left to give an impression that the scene is moving rightwards.

## Create Mountain Groups

Since we are moving the mountains to the left, they will eventually go off the screen and at the same time leaving empty spaces to the right. To fix this, we will be looping them back to the right of the scene once they go out of the scene view. In order to make the loop seamless, we will be making 2 mountain groups where each covers the whole scene. Then we will offset one group off the screen to the right. This is so that the second group and slowly filling in the screen from the right as the first group moving off the screen to the left before looping back to be offscreen to the right of the second group and repeating the process.

Let start by filling in the logic for creating a mountain group in the `createMountainGroup()` function which will return a Graphics instance of a mountain group. We will use this to create the 2 group instances later.

Here, we are using a single Graphics instance for a group of mountains. Taking into account the screen dimension we can draw out 3 mountains with different heights and colors. In this case, we will imagine the Graphics instance as a pen and for each of the mountain we move the pen to the starting position using Graphics API's `moveTo(x, y)` method and then contour out the mountain arc using `bezierCurveTo(cx1, cy1, cx2, cy2, x, y)` method, where [`cx`, `cy`] positions are control point coordinates for the curve going from where it was to the [`x`, `y`] position. Again, we then need to fill the resulted shape with `fill(style)`.

> _**TIPS:** In this case, we do not have to connect the end point to the starting point as the Graphics' context will automatically infer a closed shape by doing so for the fill._

```javascript
const graphics = new Graphics();
const width = app.screen.width / 2;
const startY = app.screen.height;
const startXLeft = 0;
const startXMiddle = Number(app.screen.width) / 4;
const startXRight = app.screen.width / 2;
const heightLeft = app.screen.height / 2;
const heightMiddle = (app.screen.height * 4) / 5;
const heightRight = (app.screen.height * 2) / 3;
const colorLeft = 0xc1c0c2;
const colorMiddle = 0x7e818f;
const colorRight = 0x8c919f;

graphics
  // Draw the middle mountain
  .moveTo(startXMiddle, startY)
  .bezierCurveTo(
    startXMiddle + width / 2,
    startY - heightMiddle,
    startXMiddle + width / 2,
    startY - heightMiddle,
    startXMiddle + width,
    startY,
  )
  .fill({ color: colorMiddle })

  // Draw the left mountain
  .moveTo(startXLeft, startY)
  .bezierCurveTo(
    startXLeft + width / 2,
    startY - heightLeft,
    startXLeft + width / 2,
    startY - heightLeft,
    startXLeft + width,
    startY,
  )
  .fill({ color: colorLeft })

  // Draw the right mountain
  .moveTo(startXRight, startY)
  .bezierCurveTo(
    startXRight + width / 2,
    startY - heightRight,
    startXRight + width / 2,
    startY - heightRight,
    startXRight + width,
    startY,
  )
  .fill({ color: colorRight });

return graphics;
```

## Set Up Mountain Groups

With the `createMountainGroup()` helper function, we can then create 2 instances of the mountain group and offset one of them off the screen to the right.

```javascript
const group1 = createMountainGroup(app);
const group2 = createMountainGroup(app);

group2.x = app.screen.width;
app.stage.addChild(group1, group2);
```

You should now see a single group of mountains covering the whole scene.

## Animate Mountains

Using the application's ticker, we can add a callback function which will reposition the mountain groups every ticker update, creating a continuous animation. The callback function will be supplied with the Ticker object in which time-related data can be inferred like the `deltaTime` that we will be using to calculate the distance for the mountain to move consistently. Remember to reposition the groups when they moved completely off the screen.

```javascript
app.ticker.add((time) => {
  const dx = time.deltaTime * 0.5;

  group1.x -= dx;
  group2.x -= dx;

  if (group1.x <= -app.screen.width) {
    group1.x += app.screen.width * 2;
  }
  if (group2.x <= -app.screen.width) {
    group2.x += app.screen.width * 2;
  }
});
```
