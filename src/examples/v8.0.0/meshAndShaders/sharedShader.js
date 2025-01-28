import { Application, Assets, Geometry, Mesh, Shader } from 'js';

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
            aVertexPosition: [-100, -100, 100, -100, 100, 100],
            aUvs: [0, 0, 1, 0, 1, 1],
        },
    });

    const shader = Shader.from(
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

    uniform sampler2D uSampler2;

    void main() {

        gl_FragColor = texture2D(uSampler2, vUvs);
    }

`,
        {
            uSampler2: texture,
        },
    );

    const shader2 = Shader.from(
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

    uniform sampler2D uSampler2;

    void main() {

        gl_FragColor = texture2D(uSampler2, vUvs);
        gl_FragColor.r += (abs(sin(gl_FragCoord.x * 0.06)) * 0.5) * 2.;
        gl_FragColor.g += (abs(cos(gl_FragCoord.y * 0.06)) * 0.5) * 2.;
    }

`,
        {
            uSampler2: texture,
        },
    );

    const triangle = new Mesh(geometry, shader);

    const triangle2 = new Mesh(geometry, shader2);

    triangle.position.set(400, 300);
    triangle.scale.set(2);

    triangle2.position.set(500, 400);
    triangle2.scale.set(3);

    app.stage.addChild(triangle2, triangle);

    app.ticker.add((delta) =>
    {
        triangle.rotation += 0.01;
        triangle2.rotation -= 0.005;
    });
})();
