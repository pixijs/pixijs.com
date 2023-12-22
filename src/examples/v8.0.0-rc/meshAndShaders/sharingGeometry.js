import { Application, Assets, Geometry, Texture, Mesh, Shader, Ticker } from 'js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    await Assets.load([
        'https://pixijs.com/assets/bg_scene_rotate.jpg',
        'https://pixijs.com/assets/bg_rotate.jpg',
        'https://pixijs.com/assets/bg_displacement.jpg',
    ]);

    const geometry = new Geometry({
        attributes: {
            aVertexPosition: [-100, -100, 100, -100, 100, 100],
            aUvs: [0, 0, 1, 0, 1, 1],
        },
    });

    const program = Program.from(
        `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`,

        `precision mediump float;

    varying vec2 vUvs;

    uniform sampler2D uSamplerTexture;

    void main() {

        gl_FragColor = texture2D(uSamplerTexture, vUvs);
    }

`,
    );

    const triangle = new Mesh(
        geometry,
        new Shader(program, {
            uSamplerTexture: Texture.from('https://pixijs.com/assets/bg_scene_rotate.jpg'),
        }),
    );

    const triangle2 = new Mesh(
        geometry,
        new Shader(program, {
            uSamplerTexture: Texture.from('https://pixijs.com/assets/bg_rotate.jpg'),
        }),
    );

    const triangle3 = new Mesh(
        geometry,
        new Shader(program, {
            uSamplerTexture: Texture.from('https://pixijs.com/assets/bg_displacement.jpg'),
        }),
    );

    triangle.position.set(400, 300);
    triangle.scale.set(2);

    triangle2.position.set(200, 100);

    triangle3.position.set(500, 400);
    triangle3.scale.set(3);

    app.stage.addChild(triangle3, triangle2, triangle);

    Ticker.shared.add((delta) =>
    {
        triangle.rotation += 0.01;
        triangle2.rotation -= 0.01;
        triangle3.rotation -= 0.005;
    });
})();
