import { Application, Container } from 'pixi.js';
import { addGround } from './addGround';
import { addMoon } from './addMoon';
import { addMountains } from './addMountains';
import { addSmokes } from './addSmokes';
import { addStars } from './addStars';
import { addTrain } from './addTrain';
import { addTrees } from './addTrees';

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

    addStars(app);
    addMoon(app);
    addMountains(app);
    addTrees(app);
    addGround(app);
    addTrain(app, trainContainer);
    addSmokes(app, trainContainer);
})();
