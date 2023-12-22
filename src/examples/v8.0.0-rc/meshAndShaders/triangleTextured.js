import { Application, Assets, Geometry, Shader, Texture, Mesh, Ticker } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the texture
    const texture = await Assets.load('https://pixijs.com/assets/bg_scene_rotate.jpg');

    const geometry = new Geometry({
        attributes: {
            aVertexPosition: [-100, -50, 100, -50, 0, 100],
            aColor: [1, 0, 0, 0, 1, 0, 0, 0, 1],
            aUvs: [0, 0, 1, 0, 1, 1],
        },
    });

    const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec3 aColor;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;
    varying vec3 vColor;

    void main() {

        vUvs = aUvs;
        vColor = aColor;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

    const fragmentSrc = `

    precision mediump float;

    varying vec3 vColor;
    varying vec2 vUvs;

    uniform sampler2D uSampler2;

    void main() {

        gl_FragColor = texture2D(uSampler2, vUvs) * vec4(vColor, 1.0);
    }`;

    const uniforms = { uSampler2: texture };

    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);

    const triangle = new Mesh(geometry, shader);

    triangle.position.set(400, 300);
    triangle.scale.set(2);

    app.stage.addChild(triangle);

    Ticker.shared.add(() =>
    {
        triangle.rotation += 0.01;
    });
})();
