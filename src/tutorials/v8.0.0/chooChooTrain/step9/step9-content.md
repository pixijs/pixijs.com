# Adding Smokes

For the final touch, let's create groups of smoke particles animating in from the train chimney and out off the screen.

## Create Smoke Groups

First we need to create the individual groups of circular particles of varying size and position within the cluster, each group under a single Graphics instance. For the purpose of animation, we then assign a custom `tick` property to each group which will be used to reference the percentage of the animation from the chimney to the disappearing point.

```javascript
const groupCount = 5;
const particleCount = 7;
const groups = [];
const baseX = trainContainer.x + 170;
const baseY = trainContainer.y - 120;

for (let index = 0; index < groupCount; index++) {
  const smokeGroup = new Graphics();

  for (let i = 0; i < particleCount; i++) {
    const radius = 20 + Math.random() * 20;
    const x = (Math.random() * 2 - 1) * 40;
    const y = (Math.random() * 2 - 1) * 40;

    smokeGroup.circle(x, y, radius);
  }

  smokeGroup.fill({ color: 0xc9c9c9, alpha: 0.5 });

  smokeGroup.x = baseX;
  smokeGroup.y = baseY;
  smokeGroup.tick = index * (1 / groupCount);

  groups.push(smokeGroup);
}
```

## Animate Smokes

As you can see, we previously offset the `tick` value on each group initially to distribute them out so that it illustrates the constant line of smokes coming out from the chimney. We then use the same technique of using the application's ticker for the animation, incrementing the `tick` value on all groups which is then used to calculate the position and scale of each. The value is modulated so that it goes back to the starting point when it finishes at the disappearing point, ie. the value will loop infinitely from 0 -> 1.

```javascript
app.ticker.add((time) => {
  const dt = time.deltaTime * 0.01;

  groups.forEach((group) => {
    group.tick = (group.tick + dt) % 1;
    group.x = baseX - Math.pow(group.tick, 2) * 400;
    group.y = baseY - group.tick * 200;
    group.scale.set(Math.pow(group.tick, 0.75));
  });
});
```

And that is a wrap!
