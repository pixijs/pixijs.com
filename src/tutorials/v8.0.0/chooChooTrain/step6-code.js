import { Application, Container, Graphics } from 'pixi.js';

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () =>
{
    // Intialize the application.
    await app.init({ background: '#021f4b', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    addSky();
    addBackground();
    addForeground();
    addGround();
    addTrain();
    addSmokes();
})();

function addSky()
{
    const count = 20;
    const stars = new Graphics();

    for (let index = 0; index < count; index++)
    {
        const x = (index * 0.78695 * app.screen.width) % app.screen.width;
        const y = (index * 0.9382 * app.screen.height) % app.screen.height;
        const radius = 2 + Math.random() * 3;
        const rotation = Math.random() * Math.PI * 2;

        stars.star(x, y, 5, radius, 0, rotation).fill({ color: 0xffdf00, alpha: radius / 5 });
    }

    const x = app.screen.width / 2 + 170;
    const y = app.screen.height / 4;
    const radius = 50;
    const cutRadius = radius * 0.75;

    const moon = new Graphics()
        .circle(x, y, radius)
        .fill({ color: 0xffdf00 })
        .circle(x - radius + cutRadius, y, cutRadius)
        // TODO: Why doesn't cut work if it's out of fill bound?
        .cut();

    // Add the stars to the stage
    app.stage.addChild(stars, moon);
}

function addBackground()
{
    const group1 = createMountainGroup();
    const group2 = createMountainGroup();

    group2.x = app.screen.width;

    // Add the mountain to the stage
    app.stage.addChild(group1, group2);

    app.ticker.add((time) =>
    {
        const dx = time.deltaTime * 0.5;

        group1.x -= dx;
        group2.x -= dx;

        if (group1.x <= -app.screen.width)
        {
            group1.x = app.screen.width;
        }

        if (group2.x <= -app.screen.width)
        {
            group2.x = app.screen.width;
        }
    });
}

function createMountainGroup()
{
    const graphics = new Graphics();

    // Width of all the mountains
    const width = app.screen.width / 2;

    // Starting point on the y-axis of all the mountains
    const startY = app.screen.height; // Bottom of the screen

    // Start point on the x-axis of the individual mountain
    const startXLeft = 0;
    const startXMiddle = (Number(app.screen.width)) / 4;
    const startXRight = app.screen.width / 2;

    // Height of the individual mountain
    const heightLeft = app.screen.height / 2;
    const heightMiddle = (app.screen.height * 4) / 5;
    const heightRight = (app.screen.height * 2) / 3;

    // Color of the individual mountain
    const colorLeft = 0xc1c0c2;
    const colorMiddle = 0x7e818f;
    const colorRight = 0x8c919f;

    graphics
        // Middle
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

        // Left
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

        // Right
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

    // Add the mountain to the stage
    return graphics;
}

function addForeground()
{
    const treeWidth = 200;
    const y = app.screen.height - 20;
    const spacing = 15;
    const count = app.screen.width / (treeWidth + spacing) + 1;
    const trees = [];

    for (let index = 0; index < count; index++)
    {
        const treeHeight = 225 + Math.random() * 50;
        const tree = createTree(treeWidth, treeHeight);

        tree.x = index * (treeWidth + spacing);
        tree.y = y;

        app.stage.addChild(tree);
        trees.push(tree);
    }

    app.ticker.add((time) =>
    {
        const dx = time.deltaTime * 3;

        trees.forEach((tree) =>
        {
            tree.x -= dx;

            if (tree.x <= -(treeWidth / 2 + spacing))
            {
                tree.x += count * (treeWidth + spacing) + spacing * 3;
            }
        });
    });
}

function createTree(width = 200, height = 250)
{
    const trunkWidth = 30;
    const trunkHeight = height / 4;

    const crownHeight = height - trunkHeight;
    const crownLevels = 4;
    const crownLevelHeight = crownHeight / crownLevels;
    const crownWidthIncrement = width / crownLevels;

    const treeColor = 0x264d3d;
    const trunkColor = 0x563929;

    const graphics = new Graphics();

    graphics
        // Trunk
        .rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
        .fill({ color: trunkColor });

    for (let index = 0; index < crownLevels; index++)
    {
        const y = -trunkHeight - crownLevelHeight * index;
        const levelWidth = width - crownWidthIncrement * index;
        const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

        graphics
            // Crown Level
            .moveTo(-levelWidth / 2, y)
            .lineTo(0, y - crownLevelHeight - offset)
            .lineTo(levelWidth / 2, y)
            .fill({ color: treeColor });
    }

    return graphics;
}

function addGround()
{
    const width = app.screen.width;
    const groundHeight = 20;
    const groundY = app.screen.height;
    const ground = new Graphics().rect(0, groundY - groundHeight, width, groundHeight).fill({ color: 0xdddddd });

    app.stage.addChild(ground);

    const trackHeight = 15;

    const plankWidth = 50;
    const plankHeight = trackHeight / 2;
    const plankGap = 20;
    const plankCount = width / (plankWidth + plankGap) + 1;
    const plankY = groundY - groundHeight;
    const planks = [];

    for (let index = 0; index < plankCount; index++)
    {
        const plank = new Graphics().rect(0, plankY - plankHeight, plankWidth, plankHeight).fill({ color: 0x241811 });

        plank.x = index * (plankWidth + plankGap);
        app.stage.addChild(plank);
        planks.push(plank);
    }

    const railHeight = trackHeight / 2;
    const railY = plankY - plankHeight;
    const rail = new Graphics().rect(0, railY - railHeight, width, railHeight).fill({ color: 0x5c5c5c });

    app.stage.addChild(rail);

    app.ticker.add((time) =>
    {
        const dx = time.deltaTime * 6;

        planks.forEach((plank) =>
        {
            plank.x -= dx;

            if (plank.x <= -(plankWidth + plankGap))
            {
                plank.x += plankCount * (plankWidth + plankGap) + plankGap * 1.5;
            }
        });
    });
}

function addTrain()
{
    const container = new Container();
    const head = createTrainHead();
    const carriage = createTrainCarriage();
    const scale = 0.75;

    carriage.x = -carriage.width;

    container.addChild(head, carriage);
    app.stage.addChild(container);

    container.scale.set(scale);
    container.x = app.screen.width / 2 - head.width / 2;

    let elapsed = 0;
    const shakeDistance = 3;
    const baseY = app.screen.height - 35 - 55 * scale;
    const speed = 0.5;

    app.ticker.add((time) =>
    {
        elapsed += time.deltaTime;
        const offset = (Math.sin(elapsed * 0.5 * speed) * 0.5 + 0.5) * shakeDistance;

        container.y = baseY + offset;
    });
}

function createTrainHead()
{
    const container = new Container();

    const frontHeight = 100;
    const frontWidth = 140;
    const frontRadius = frontHeight / 2;

    const containerHeight = 200;
    const containerWidth = 150;
    const containerRadius = 15;

    const chimneyBaseWidth = 30;
    const chimneyTopWidth = 50;
    const chimneyHeight = 70;
    const chimneyDomeHeight = 25;
    const chimneyTopOffset = (chimneyTopWidth - chimneyBaseWidth) / 2;
    const chimneyStartX = containerWidth + frontWidth - frontRadius - chimneyBaseWidth;
    const chimneyStartY = -frontHeight;

    const roofHeight = 25;
    const roofExcess = 20;

    const doorWidth = containerWidth * 0.7;
    const doorHeight = containerHeight * 0.7;
    const doorStartX = (containerWidth - doorWidth) * 0.5;
    const doorStartY = -(containerHeight - doorHeight) * 0.5 - doorHeight;

    const windowWidth = doorWidth * 0.8;
    const windowHeight = doorHeight * 0.4;
    const offset = (doorWidth - windowWidth) / 2;

    const graphics = new Graphics()
        // Chimney
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

        // Front
        .roundRect(
            containerWidth - frontRadius - containerRadius,
            -frontHeight,
            frontWidth + frontRadius + containerRadius,
            frontHeight,
            frontRadius,
        )
        .fill({ color: 0x7f3333 })

        // Container Body
        .roundRect(0, -containerHeight, containerWidth, containerHeight, containerRadius)
        .fill({ color: 0x725f19 })

        // Roof
        .rect(-roofExcess / 2, containerRadius - containerHeight - roofHeight, containerWidth + roofExcess, roofHeight)
        .fill({ color: 0x52431c })

        // Door
        .roundRect(doorStartX, doorStartY, doorWidth, doorHeight, containerRadius)
        .stroke({ color: 0x52431c, width: 3 })

        // Window
        .roundRect(doorStartX + offset, doorStartY + offset, windowWidth, windowHeight, 10)
        .fill({ color: 0x848484 });

    const bigWheelRadius = 55;
    const smallWheelRadius = 35;
    const wheelGap = 5;
    const wheelOffsetY = 5;
    const backWheel = createTrainWheel(bigWheelRadius);
    const midWheel = createTrainWheel(smallWheelRadius);
    const frontWheel = createTrainWheel(smallWheelRadius);

    container.addChild(graphics, backWheel, midWheel, frontWheel);

    backWheel.x = bigWheelRadius;
    backWheel.y = wheelOffsetY;

    midWheel.x = backWheel.x + bigWheelRadius + smallWheelRadius + wheelGap;
    midWheel.y = backWheel.y + bigWheelRadius - smallWheelRadius;

    frontWheel.x = midWheel.x + smallWheelRadius * 2 + wheelGap;
    frontWheel.y = midWheel.y;

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
        // Body
        .roundRect(edgeExcess / 2, -containerHeight, containerWidth, containerHeight, containerRadius)
        .fill({ color: 0x725f19 })

        // Edge
        .rect(0, containerRadius - containerHeight - edgeHeight, containerWidth + edgeExcess, edgeHeight)
        .fill({ color: 0x52431c })

        // Connectors
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

    container.addChild(graphics, backWheel, frontWheel);

    backWheel.x = centerX - offsetX;
    frontWheel.x = centerX + offsetX;
    frontWheel.y = backWheel.y = 25;

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
    const fillRadius = (radius * 3) / 4;
    const strokeThickness = radius / 4;

    return (
        new Graphics()
            .circle(0, 0, fillRadius)
            .fill({ color: 0x848484 })
            // TODO: Ask 'isn't width suppose to be the thickness of the stroke?'
            .stroke({ color: 0x121212, width: strokeThickness * 2 })
            .rect(-strokeThickness / 2, -radius / 2, strokeThickness, radius)
            .rect(-radius / 2, -strokeThickness / 2, radius, strokeThickness)
            .fill({ color: 0x4f4f4f })
    );
}

function addSmokes()
{
    const groupCount = 5;
    const particleCount = 5;
    const groups = [];
    const baseX = app.screen.width / 2 + 20;
    const baseY = app.screen.height / 2 - 15;

    for (let index = 0; index < groupCount; index++)
    {
        const smokeGroup = new Graphics();

        for (let i = 0; i < particleCount; i++)
        {
            const radius = 20 + Math.random() * 20;
            const x = (Math.random() * 2 - 1) * 40;
            const y = (Math.random() * 2 - 1) * 40;

            smokeGroup.circle(x, y, radius);
        }

        smokeGroup.fill({ color: 0x848484 });

        smokeGroup.x = baseX;
        smokeGroup.y = baseY;
        smokeGroup.tick = index * (1 / groupCount);

        app.stage.addChild(smokeGroup);
        groups.push(smokeGroup);
    }

    app.ticker.add((time) =>
    {
        const dt = time.deltaTime * 0.01;

        groups.forEach((group) =>
        {
            group.tick = (group.tick + dt) % 1;
            group.x = baseX - Math.pow(group.tick, 2) * 400;
            group.y = baseY - group.tick * 200;
            group.alpha = 1 - group.tick; // TODO: Why alpha sometimes doesn't work? (try with 7 particles)
            group.scale.set(Math.pow(group.tick, 0.75));
        });
    });
}
