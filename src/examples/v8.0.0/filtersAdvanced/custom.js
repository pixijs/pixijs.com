import { Application, Assets, Filter, Sprite } from 'js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the texture
    const texture = await Assets.load('https://pixijs.com/assets/bg_grass.jpg');

    // Create background image
    const background = Sprite.from(texture);

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // Stop application wait for load to finish
    app.stop();

    fetch('https://pixijs.com/assets/pixi-filters/shader.frag')
        .then((res) => res.text())
        .then(onLoaded);

    let filter;

    // Handle the load completed
    function onLoaded(data)
    {
        // Create the new filter, arguments: (vertexShader, framentSource)
        filter = new Filter(null, data, {
            customUniform: 0.0,
        });

        // === WARNING ===
        // specify uniforms in filter constructor
        // or set them BEFORE first use
        // filter.uniforms.customUniform = 0.0

        // Add the filter
        background.filters = [filter];

        // Resume application update
        app.start();
    }

    // Animate the filter
    app.ticker.add((delta) =>
    {
        filter.uniforms.customUniform += 0.04 * delta;
    });
})();
