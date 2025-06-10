import { Graphics } from 'pixi.js';

export function addTrees(app) {
  // Width of each tree.
  const treeWidth = 200;

  // Position of the base of the trees on the y-axis.
  const y = app.screen.height - 20;

  // Spacing between each tree.
  const spacing = 15;

  // Calculate the number of trees needed to fill the screen horizontally.
  const count = app.screen.width / (treeWidth + spacing) + 1;

  // Create an array to store all the trees.
  const trees = [];

  for (let index = 0; index < count; index++) {
    // Randomize the height of each tree within a constrained range.
    const treeHeight = 225 + Math.random() * 50;

    // Create a tree instance.
    const tree = createTree(treeWidth, treeHeight);

    // Initially position the tree.
    tree.x = index * (treeWidth + spacing);
    tree.y = y;

    // Add the tree to the stage and the reference array.
    app.stage.addChild(tree);
    trees.push(tree);
  }

  // Animate the trees.
  app.ticker.add((time) => {
    // Calculate the amount of distance to move the trees per tick.
    const dx = time.deltaTime * 3;

    trees.forEach((tree) => {
      // Move the trees leftwards.
      tree.x -= dx;

      // Reposition the trees when they move off screen.
      if (tree.x <= -(treeWidth / 2 + spacing)) {
        tree.x += count * (treeWidth + spacing) + spacing * 3;
      }
    });
  });
}

function createTree(width, height) {
  // Define the dimensions of the tree trunk.
  const trunkWidth = 30;
  const trunkHeight = height / 4;

  // Define the dimensions and parameters for the tree crown layers.
  const crownHeight = height - trunkHeight;
  const crownLevels = 4;
  const crownLevelHeight = crownHeight / crownLevels;
  const crownWidthIncrement = width / crownLevels;

  // Define the colors of the parts.
  const crownColor = 0x264d3d;
  const trunkColor = 0x563929;

  const graphics = new Graphics()
    // Draw the trunk.
    .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
    .fill({ color: trunkColor });

  for (let index = 0; index < crownLevels; index++) {
    const y = -trunkHeight - crownLevelHeight * index;
    const levelWidth = width - crownWidthIncrement * index;
    const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

    // Draw a crown layer.
    graphics
      .moveTo(-levelWidth / 2, y)
      .lineTo(0, y - crownLevelHeight - offset)
      .lineTo(levelWidth / 2, y)
      .fill({ color: crownColor });
  }

  return graphics;
}
