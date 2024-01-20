import { Application, Assets, Text, Filter, WRAP_MODES } from 'pixi.js';
import fragment from './shaderToyFilter.frag';
/**
 * Please note that this is not the most optimal way of doing pure shader generated rendering and should be used when the
 * scene is wanted as input texture. Check the mesh version of example for more performant version if you need only shader
 * generated content.
 **/

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    Assets.load('https://pixijs.com/assets/perlin.jpg').then(onAssetsLoaded);

    let filter = null;

    const text = new Text('PixiJS', { fill: 0xffffff, fontSize: 80 });

    text.anchor.set(0.5, 0.5);
    text.position.set(app.renderer.screen.width / 2, app.renderer.screen.height / 2);

    app.stage.addChild(text);

    let totalTime = 0;

    function onAssetsLoaded(perlin)
    {
        // Add perlin noise for filter, make sure it's wrapping and does not have mipmap.
        perlin.baseTexture.wrapMode = WRAP_MODES.REPEAT;
        perlin.baseTexture.mipmap = false;

        // Build the filter
        filter = new Filter(
            null,
            // Fragment shader, in real use this would be much cleaner when loaded from a file
            // or embedded into the application as data resource.
            fragment,
            {
                time: 0.0,
                noise: perlin,
            },
        );
        app.stage.filterArea = app.renderer.screen;
        app.stage.filters = [filter];

        // Listen for animate update.
        app.ticker.add((delta) =>
        {
            filter.uniforms.time = totalTime;
            totalTime += delta / 60;
        });
    }
})();
