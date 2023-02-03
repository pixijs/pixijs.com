---
hide_table_of_contents: true
---

# GSAP 2 Filters

```js playground
import * as PIXI from 'pixi.js';

// Note: In this example we have two "requestAnimationFrame", PIXI + TweenMax.
// TweeMax coordinate his animations (bunnies).

const app = new PIXI.Application<HTMLCanvasElement>({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);


const bg = PIXI.Sprite.from('https://beta.pixijs.com/assets/pixi-filters/bg_depth_blur.jpg');
bg.width = app.screen.width;
bg.height = app.screen.height;
app.stage.addChild(bg);

const littleDudes = PIXI.Sprite.from('https://beta.pixijs.com/assets/pixi-filters/depth_blur_dudes.jpg');
littleDudes.x = (app.screen.width / 2) - 315;
littleDudes.y = 200;
app.stage.addChild(littleDudes);

const littleRobot = PIXI.Sprite.from('https://beta.pixijs.com/assets/pixi-filters/depth_blur_moby.jpg');
littleRobot.x = (app.screen.width / 2) - 200;
littleRobot.y = 100;
app.stage.addChild(littleRobot);

const blurFilter1 = new PIXI.filters.BlurFilter();
blurFilter1.blur = 0.0;
littleDudes.filters = [blurFilter1];

const time = 2.0;
TweenMax.to(blurFilter1, time, { blur: 5.0, yoyo: true, repeat: -1 });
TweenMax.to(littleRobot, time, { pixi: { brightness: 2 }, yoyo: true, repeat: -1 });
```