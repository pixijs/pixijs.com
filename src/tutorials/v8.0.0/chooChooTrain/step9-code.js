import { Application, Container, Graphics } from 'pixi.js';

// Create a PixiJS application.
const app = new Application();

// Create a container to hold all the train parts.
const trainContainer = new Container();

// Asynchronous IIFE
(async () =>
{
    // Intialize the application.
    await app.init({ background: '#021f4b', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    addStars();
    addMoon();
    addMountains();
    addTrees();
    addGround();
    addTrain();
    addSmokes();
})();

function addStars()
{
    const starCount = 20;

    // Create a graphics object to hold all the stars.
    const graphics = new Graphics();

    for (let index = 0; index < starCount; index++)
    {
        // Randomize the position, radius, and rotation of each star.
        const x = (index * 0.78695 * app.screen.width) % app.screen.width;
        const y = (index * 0.9382 * app.screen.height) % app.screen.height;
        const radius = 2 + Math.random() * 3;
        const rotation = Math.random() * Math.PI * 2;

        // Draw the star onto the graphics object.
        graphics.star(x, y, 5, radius, 0, rotation).fill({ color: 0xffdf00, alpha: radius / 5 });
    }

    // Add the stars to the stage.
    app.stage.addChild(graphics);
}

function addMoon()
{
    // Parsed Moon SVG.
    const svg = `
        <svg width="111" height="126" viewBox="0 0 111 126" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.99794 104.751C44.7207 104.751 72.869 76.6028 72.869 41.8801C72.869 25.9516 66.9455
                11.4065 57.1812 0.327637C87.3034 4.98731 110.363 31.0291 110.363 62.4566C110.363 97.1793
                82.2144 125.328 47.4917 125.328C28.6975 125.328 11.8294 117.081 0.308472 104.009C3.46679
                104.498 6.70276 104.751 9.99794 104.751Z" fill="#FFDF00"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M57.4922 0.682129C75.7709 10.9731 88 29.7256 88 51.1529C88 83.6533 59.8656 110 25.16
                110C16.9934 110 9.19067 108.541 2.03273 105.887C1.44552 105.272 0.870627 104.646 0.308472
                104.008C3.46679 104.497 6.70276 104.75 9.99794 104.75C44.7207 104.75 72.869 76.6018 72.869
                41.8791C72.869 26.1203 67.0711 11.7158 57.4922 0.682129Z" fill="#DEC61A"/>
        </svg>
    `;

    // Create a moon graphics object from an SVG code.
    const graphics = new Graphics().svg(svg);

    // Position the moon.
    graphics.x = app.screen.width / 2 + 100;
    graphics.y = app.screen.height / 8;

    // Add the moon to the stage.
    app.stage.addChild(graphics);
}

function addMountains()
{
    // Create two mountain groups where one will be on the screen and the other will be off screen.
    // When the first group moves off screen, it will be moved to the right of the second group.
    const group1 = createMountainGroup();
    const group2 = createMountainGroup();

    // Position the 2nd group off the screen to the right.
    group2.x = app.screen.width;

    // Add the mountain groups to the stage.
    app.stage.addChild(group1, group2);

    // Animate the mountain groups
    app.ticker.add((time) =>
    {
        // Calculate the amount of distance to move the mountain groups per tick.
        const dx = time.deltaTime * 0.5;

        // Move the mountain groups leftwards.
        group1.x -= dx;
        group2.x -= dx;

        // Reposition the mountain groups when they move off screen.
        if (group1.x <= -app.screen.width)
        {
            group1.x += app.screen.width * 2;
        }
        if (group2.x <= -app.screen.width)
        {
            group2.x += app.screen.width * 2;
        }
    });
}

function createMountainGroup()
{
    // Create a graphics object to hold all the mountains in a group.
    const graphics = new Graphics();

    // Width of all the mountains.
    const width = app.screen.width / 2;

    // Starting point on the y-axis of all the mountains.
    // This is the bottom of the screen.
    const startY = app.screen.height;

    // Start point on the x-axis of the individual mountain.
    const startXLeft = 0;
    const startXMiddle = Number(app.screen.width) / 4;
    const startXRight = app.screen.width / 2;

    // Height of the individual mountain.
    const heightLeft = app.screen.height / 2;
    const heightMiddle = (app.screen.height * 4) / 5;
    const heightRight = (app.screen.height * 2) / 3;

    // Color of the individual mountain.
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
}

function addTrees()
{
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

    for (let index = 0; index < count; index++)
    {
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
    app.ticker.add((time) =>
    {
        // Calculate the amount of distance to move the trees per tick.
        const dx = time.deltaTime * 3;

        trees.forEach((tree) =>
        {
            // Move the trees leftwards.
            tree.x -= dx;

            // Reposition the trees when they move off screen.
            if (tree.x <= -(treeWidth / 2 + spacing))
            {
                tree.x += count * (treeWidth + spacing) + spacing * 3;
            }
        });
    });
}

function createTree(width, height)
{
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

    for (let index = 0; index < crownLevels; index++)
    {
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

function addGround()
{
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

    for (let index = 0; index < plankCount; index++)
    {
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
    app.ticker.add((time) =>
    {
        // Calculate the amount of distance to move the planks per tick.
        const dx = time.deltaTime * 6;

        planks.forEach((plank) =>
        {
            // Move the planks leftwards.
            plank.x -= dx;

            // Reposition the planks when they move off screen.
            if (plank.x <= -(plankWidth + plankGap))
            {
                plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
            }
        });
    });
}

function addTrain()
{
    const head = createTrainHead();
    const carriage = createTrainCarriage();

    // Position the carriage behind the head.
    carriage.x = -carriage.width;

    // Add the head and the carriage to the train container.
    trainContainer.addChild(head, carriage);

    // Add the train container to the stage.
    app.stage.addChild(trainContainer);

    const scale = 0.75;

    // Adjust the scaling of the train.
    trainContainer.scale.set(scale);

    // Position the train on the x-axis, taking into account the variety of screen width.
    // To keep the train as the main focus, the train is offset slightly to the left of the screen center.
    trainContainer.x = app.screen.width / 2 - head.width / 2;

    // Define animation parameters.
    let elapsed = 0;
    const shakeDistance = 3;
    const baseY = app.screen.height - 35 - 55 * scale;
    const speed = 0.5;

    // Initially position the train on the y-axis.
    trainContainer.y = baseY;

    // Animate the train - bobbing it up and down a tiny bit on the track.
    app.ticker.add((time) =>
    {
        elapsed += time.deltaTime;
        const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;

        trainContainer.y = baseY + offset;
    });
}

function createTrainHead()
{
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
    app.ticker.add((time) =>
    {
        const dr = time.deltaTime * 0.15;

        backWheel.rotation += dr * (smallWheelRadius / bigWheelRadius);
        midWheel.rotation += dr;
        frontWheel.rotation += dr;
    });

    return container;
}

function createTrainCarriage()
{
    // Create a container to hold all the train carriage parts.
    const container = new Container();

    // Define the dimensions of the carriage parts.
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

    // Define the dimensions of the wheels.
    const wheelRadius = 35;
    const wheelGap = 40;
    const centerX = (containerWidth + edgeExcess) / 2;
    const offsetX = wheelRadius + wheelGap / 2;

    // Create the wheels.
    const backWheel = createTrainWheel(wheelRadius);
    const frontWheel = createTrainWheel(wheelRadius);

    // Position the wheels.
    backWheel.x = centerX - offsetX;
    frontWheel.x = centerX + offsetX;
    frontWheel.y = backWheel.y = 25;

    // Add all the parts to the container.
    container.addChild(graphics, backWheel, frontWheel);

    // Animate the wheels.
    app.ticker.add((time) =>
    {
        const dr = time.deltaTime * 0.15;

        backWheel.rotation += dr;
        frontWheel.rotation += dr;
    });

    return container;
}

function createTrainWheel(radius)
{
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

function addSmokes()
{
    /** -- INSERT CODE HERE -- */
}
