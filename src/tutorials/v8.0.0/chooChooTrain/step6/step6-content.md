# Adding Ground

The trees are floating in space right at this point, but that's because we left some space for the ground layer. Let's fill that up together now!

We will be making 3 layers of the ground with the bottom-most being the snow and the top two being the train track parts.

## Snow Layer

For this, we can simply draw a long rectangle strip across the screen and fill in the color of the snow.

```javascript
const width = app.screen.width;
const groundHeight = 20;
const groundY = app.screen.height;
const ground = new Graphics().rect(0, groundY - groundHeight, width, groundHeight).fill({ color: 0xdddddd });

app.stage.addChild(ground);
```

## Track's Planks

For the planks, we will be doing the same thing as we did for the trees. First by defining the dimensions of each plank and determining the amount needed to cover the width of the scene with a few additional offscreen buffers as we will be animating them as well. We will position them on top of the snow layer.

```javascript
const trackHeight = 15;
const plankWidth = 50;
const plankHeight = trackHeight / 2;
const plankGap = 20;
const plankCount = width / (plankWidth + plankGap) + 1;
const plankY = groundY - groundHeight;
const planks = [];

for (let index = 0; index < plankCount; index++) {
  const plank = new Graphics().rect(0, plankY - plankHeight, plankWidth, plankHeight).fill({ color: 0x241811 });

  plank.x = index * (plankWidth + plankGap);
  app.stage.addChild(plank);
  planks.push(plank);
}
```

Then add the animation to the planks in the similar manner to the trees animation. Again, making the rate of change (`dx`) even faster than the trees to simulate the track being closer to the camera, and hence travel faster across the screen (Parallax Effect).

```javascript
app.ticker.add((time) => {
  const dx = time.deltaTime * 6;

  planks.forEach((plank) => {
    plank.x -= dx;

    if (plank.x <= -(plankWidth + plankGap)) {
      plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
    }
  });
});
```

## Track's Rail

For the metal rail for the train's wheels to go onto, it will be another simple rectangle strip just like the ground and we will place them above the planks layer.

```javascript
const railHeight = trackHeight / 2;
const railY = plankY - plankHeight;
const rail = new Graphics().rect(0, railY - railHeight, width, railHeight).fill({ color: 0x5c5c5c });

app.stage.addChild(rail);
```

<hr />

With the layers coming together, it should sell an effect of the track being passed by. Next, we can finally move on to work on the main star of the workshop - the train!
