---
hide_table_of_contents: true
---

# Loading Fonts

```js playground
import * as PIXI from 'pixi.js';

const app = new PIXI.Application<HTMLCanvasElement>({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);

// Load from any font file!
PIXI.Assets.addBundle('fonts', {
    ChaChicle: 'https://v2-pixijs.com/assets/webfont-loader/ChaChicle.ttf',
    Lineal: 'https://v2-pixijs.com/assets/webfont-loader/Lineal.otf',
    'Dotrice Regular': 'https://v2-pixijs.com/assets/webfont-loader/Dotrice-Regular.woff',
    Crosterian: 'https://v2-pixijs.com/assets/webfont-loader/Crosterian.woff2',
});
PIXI.Assets.loadBundle('fonts').then(() => {
    const text1 = new PIXI.Text('ChaChicle.ttf', new PIXI.TextStyle({ fontFamily: 'ChaChicle', fontSize: 50 }));
    const text2 = new PIXI.Text('Lineal.otf', new PIXI.TextStyle({ fontFamily: 'Lineal', fontSize: 50 }));
    const text3 = new PIXI.Text('Dotrice Regular.woff', new PIXI.TextStyle({ fontFamily: 'Dotrice Regular', fontSize: 50 }));
    const text4 = new PIXI.Text('Crosterian.woff2', new PIXI.TextStyle({ fontFamily: 'Crosterian', fontSize: 50 }));

    text2.y = 150;
    text3.y = 300;
    text4.y = 450;

    app.stage.addChild(text1);
    app.stage.addChild(text2);
    app.stage.addChild(text3);
    app.stage.addChild(text4);
});
```