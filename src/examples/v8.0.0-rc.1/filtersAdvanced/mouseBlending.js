import { Application, Assets, Container, Sprite, Rectangle, Filter, Point, GlProgram } from 'pixi.js';

/**
 * https://github.com/pixijs/pixi.js/wiki/v5-Creating-Filters
 */

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ preference: 'webgl', resizeTo: window });

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

    const vertex = `
    in vec2 aPosition;
    out vec2 vTextureCoord;

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
        
        position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
        position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

        return vec4(position, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aPosition * (uOutputFrame.zw * uInputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();
        vTextureCoord = filterTextureCoord();
    }
    `;
    const fragment = `
    precision highp float;
    in vec2 vTextureCoord;
    out vec4 finalColor;

    uniform vec2 uMouse;
    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform float uTime;

    void main() {
        vec2 screenPos = vTextureCoord * uInputSize.xy + uOutputFrame.xy;
        if (length(uMouse - screenPos) < 25.0) {
            finalColor = vec4(1.0, 1.0, 0.0, 1.0) * 0.7; //yellow circle, alpha=0.7
        } else {
            // blend with underlying image, alpha=0.5
            finalColor = vec4( sin(uTime), (uMouse.xy - uOutputFrame.xy) / uOutputFrame.zw, 1.0) * 0.5;
        }
    }
    `;

    const container = new Container();

    container.filterArea = new Rectangle(100, 100, app.screen.width - 200, app.screen.height - 200);
    app.stage.addChild(container);

    const filter = new Filter({
        glProgram: new GlProgram({ vertex, fragment }),
        resources: {
            localUniforms: {
                uMouse: { value: new Point(), type: 'vec2<f32>' },
            },
        },
    });

    container.filters = [filter];

    app.stage.hitArea = app.screen;
    app.stage.eventMode = 'static';
    app.stage.on('pointermove', (event) =>
    {
        filter.resources.localUniforms.uniforms.uMouse.copyFrom(event.global);
    });
})();
