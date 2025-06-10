# Adding Trees

Let's apply the same principles we used on the mountains step and do the same thing for the trees layer.

## Create Tree

Starting off with the helper function to create a tree, `createTree(width, height)` which will instantiate a Graphics element with a tree of specified width and height drawn on. We begin with drawing the trunk using Graphics API's `rect(x, y, width, height)` method and fill it out with `fill(style)` method as usual.

```javascript
const trunkWidth = 30;
const trunkHeight = height / 4;
const trunkColor = 0x563929;
const graphics = new Graphics()
  .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
  .fill({ color: trunkColor });
```

Then for the crown, we will draw 4 stacking triangles with each triangle being thinner as we move upwards and the top triangles slightly overlapping the lower ones. Here's an example of how we can achieve that iteratively:

```javascript
const crownHeight = height - trunkHeight;
const crownLevels = 4;
const crownLevelHeight = crownHeight / crownLevels;
const crownWidthIncrement = width / crownLevels;
const crownColor = 0x264d3d;

for (let index = 0; index < crownLevels; index++) {
  const y = -trunkHeight - crownLevelHeight * index;
  const levelWidth = width - crownWidthIncrement * index;
  const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

  graphics
    .moveTo(-levelWidth / 2, y)
    .lineTo(0, y - crownLevelHeight - offset)
    .lineTo(levelWidth / 2, y)
    .fill({ color: crownColor });
}

return graphics;
```

## Set Up Trees

Now in the `addTree()` function we can instantiate as many trees as we need to cover the screen horizontally, with a few additions as offscreen buffers.

```javascript
const treeWidth = 200;
const y = app.screen.height - 20;
const spacing = 15;
const count = app.screen.width / (treeWidth + spacing) + 1;
const trees = [];

for (let index = 0; index < count; index++) {
  const treeHeight = 225 + Math.random() * 50;
  const tree = createTree(treeWidth, treeHeight);

  tree.x = index * (treeWidth + spacing);
  tree.y = y;

  app.stage.addChild(tree);
  trees.push(tree);
}
```

## Animate Trees

Then do the same animation animation setup as we did for the mountains using the application's ticker. However, we will make the rate of change (`dx`) faster than that of the mountains to simulate the trees being closer to the camera, which should make them go by faster due to the parallax effect.

```javascript
app.ticker.add((time) => {
  const dx = time.deltaTime * 3;

  trees.forEach((tree) => {
    tree.x -= dx;

    if (tree.x <= -(treeWidth / 2 + spacing)) {
      tree.x += count * (treeWidth + spacing) + spacing * 3;
    }
  });
});
```
