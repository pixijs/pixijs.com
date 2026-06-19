// dependencies: { "@esotericsoftware/spine-pixi-v8": "latest", "pixi.js": "latest" }
// description: A basic integration of Spine in PixiJS
// Import required classes from PixiJS and Spine
import { Application, Assets } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: '#1099bb', resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Load the assets.
  await Assets.load([
    {
      alias: 'spineSkeleton',
      src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
    },
    {
      alias: 'spineAtlas',
      src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
    },
  ]);

  // Create our character
  const spineBoy = Spine.from({
    skeleton: 'spineSkeleton',
    atlas: 'spineAtlas',
  });

  // Place on the screen
  spineBoy.x = app.screen.width / 2;
  spineBoy.y = app.screen.height - 80;
  spineBoy.scale.set(0.5);

  // Play animation
  spineBoy.state.setAnimation(0, 'walk', true);

  // Add character to the stage.
  app.stage.addChild(spineBoy);
})();
