---
hide_table_of_contents: true
---

# Invert

```js playground
import * as PIXI from 'pixi.js';

// the plugin is here: https://github.com/gameofbombs/pixi-heaven/tree/master

const app = new PIXI.Application<HTMLCanvasElement>({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);

// create a new Sprite from an image path
const bunny = new PIXI.heaven.SpriteH(PIXI.Texture.from('https://beta.pixijs.com/assets/bunny.png'));

// Let us invert the colors!
bunny.color.setLight(0.0, 0.0, 0.0);
bunny.color.setDark(1.0, 1.0, 1.0);

// center the sprite's anchor point
bunny.anchor.set(0.5);
bunny.scale.set(3.0);

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((delta) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    bunny.rotation += 0.1 * delta;
});
```