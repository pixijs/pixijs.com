import { Application, Assets, Container, Filter, Point, Rectangle, Sprite } from 'pixi.js';

/**
 * https://github.com/pixijs/pixi.js/wiki/v5-Creating-Filters
 */

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the grass texture
    const texture = await Assets.load('https://pixijs.com/assets/bg_grass.jpg');

    // Create background image
    const background = new Sprite(texture);

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // NOTE: this shader wont work on old devices where mediump precision is forced in fragment shader
    // because v5 default vertex shader uses `inputSize` in it. Same uniform in fragment and vertex shader
    // cant have different precision :(

    const shaderFrag = `
    precision highp float;

    varying vec2 vTextureCoord;

    uniform vec2 mouse;
    uniform vec4 inputSize;
    uniform vec4 outputFrame;
    uniform float time;

    void main() {
    vec2 screenPos = vTextureCoord * inputSize.xy + outputFrame.xy;
    if (length(mouse - screenPos) < 25.0) {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * 0.7; //yellow circle, alpha=0.7
    } else {
        // blend with underlying image, alpha=0.5
        gl_FragColor = vec4( sin(time), (mouse.xy - outputFrame.xy) / outputFrame.zw, 1.0) * 0.5;
    }
    }
    `;

    const container = new Container();

    container.filterArea = new Rectangle(100, 100, app.screen.width - 200, app.screen.height - 200);
    app.stage.addChild(container);
    const filter = new Filter({
        resources: {
            shader: shaderFrag,
            mouse: new Point(),
        },
    });

    container.filters = [filter];

    app.stage.hitArea = app.screen;
    app.stage.eventMode = 'static';
    app.stage.on('pointermove', (event) =>
    {
        filter.uniforms.mouse.copyFrom(event.global);
    });
})();
