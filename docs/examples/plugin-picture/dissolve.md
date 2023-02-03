---
hide_table_of_contents: true
---

# Dissolve

```js playground
import * as PIXI from 'pixi.js';

// Dissolve blending shader part
const DISSOLVE_FULL = `
    // Noise function that generates a random number between 0 and 1
    float rand = fract(sin(dot(
        vTextureCoord.xy ,vec2(12.9898,78.233))) * 43758.5453);

    if (rand < b_src.a) {
        b_res = b_src;
    }
`;

// Create a globally shared instance of the dissolve blending filter
const dissolveFilter = new PIXI.picture.BlendFilter({
    blendCode: DISSOLVE_FULL,
});

// Setup app - autoStart false since we will render only once
// to save battery life
const app = new PIXI.Application<HTMLCanvasElement>({
document.body.appendChild(app.view);
    autoStart: false,
    backgroundAlpha: 0,
});


// Load assets
app.loader
    .add('bg_plane', 'https://beta.pixijs.com/assets/bg_plane.jpg')
    .load(main);

// Setup scene and then render once
function main() {
    const left = makeBlendSubscene();
    const right = makeBlendSubscene();

    // Add dissolve filter
    left.fg.filters = [dissolveFilter];

    // Move right column
    right.container.x = app.renderer.screen.width / 2;

    // Render scence once
    app.render();
}

function makeBlendSubscene() {
    // Black background
    const bg = new PIXI.Sprite(PIXI.Texture.from('bg_plane'));

    // Translucent white layer on top
    const fg = new PIXI.Sprite(PIXI.Texture.WHITE);

    bg.width = fg.width = app.renderer.screen.width / 2;
    bg.height = fg.height = app.renderer.screen.height;
    fg.alpha = 0.3;

    const container = new PIXI.Container();

    container.addChild(bg, fg);
    app.stage.addChild(container);

    return { container, bg, fg };
}
```