import { Application, BlurFilter, Graphics, Text } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const filter = new BlurFilter({
        quality: 3,
        strength: 5,
    });

    const text = new Text({
        text: 'Text with Baked Blur Filter',
        style: {
            fontSize: 55,
            fill: 'white',
            filters: [filter]
        },
        anchor: 0.5,
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    });

    app.stage.addChild(text);
})();
