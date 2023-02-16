---
hide_table_of_contents: true
---

# SimplePlane

```js playground
import * as PIXI from 'pixi.js';

const app = new PIXI.Application<HTMLCanvasElement>({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);

PIXI.Assets.load('https://beta.pixijs.com/assets/bg_grass.jpg').then((texture) => {
    const plane = new PIXI.SimplePlane(texture, 10, 10);

    plane.x = 100;
    plane.y = 100;

    app.stage.addChild(plane);

    // Get the buffer for vertice positions.
    const buffer = plane.geometry.getBuffer('aVertexPosition');

    // Listen for animate update
    let timer = 0;
    app.ticker.add(() => {
        // Randomize the vertice positions a bit to create movement.
        for (let i = 0; i < buffer.data.length; i++) {
            buffer.data[i] += Math.sin((timer / 10) + i) * 0.5;
        }
        buffer.update();
        timer++;
    });
});
```