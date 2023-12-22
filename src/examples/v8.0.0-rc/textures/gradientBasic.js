import { Application, Texture, Sprite, ImageSource } from 'pixi.js';

// This demo uses canvas2d gradient API
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ antialias: true, resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    function createGradTexture()
    {
        // Adjust it if somehow you need better quality for very very big images
        const quality = 256;
        const canvas = document.createElement('canvas');

        canvas.width = quality;
        canvas.height = 1;

        const ctx = canvas.getContext('2d');

        // Use canvas2d API to create gradient
        const grd = ctx.createLinearGradient(0, 0, quality, 0);

        grd.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
        grd.addColorStop(0.3, 'cyan');
        grd.addColorStop(0.7, 'red');
        grd.addColorStop(1, 'green');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, quality, 1);

        return new Texture({
            source: new ImageSource({
                resource: canvas,
                style: {
                    addressModeU: 'clamp-to-edge',
                    addressModeV: 'repeat',
                },
            }),
        });
    }

    const gradTexture = createGradTexture();

    const sprite = new Sprite(gradTexture);

    sprite.position.set(100, 100);
    sprite.rotation = Math.PI / 8;
    sprite.width = 500;
    sprite.height = 50;
    app.stage.addChild(sprite);
})();
