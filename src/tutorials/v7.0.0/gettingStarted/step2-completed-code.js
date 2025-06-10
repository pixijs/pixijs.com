import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  background: '#1099bb',
  resizeTo: window,
});

document.body.appendChild(app.view);

// create a new Sprite from an image path
const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png');

// add to stage
app.stage.addChild(bunny);

// center the sprite's anchor point
bunny.anchor.set(0.5);

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
