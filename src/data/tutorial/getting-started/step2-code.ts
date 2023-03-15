import * as PIXI from 'pixi.js';

const app = new PIXI.Application<HTMLCanvasElement>({
    background: '#1099bb',
    resizeTo: window,
});

document.body.appendChild(app.view);
