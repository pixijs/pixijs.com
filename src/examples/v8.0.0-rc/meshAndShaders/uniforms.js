import { Application, Assets, Geometry, Shader, Mesh } from 'js';

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
            aVertexPosition: [-100, -100, 100, -100, 100, 100, -100, 100],
            aUvs: [0, 0, 1, 0, 1, 1, 0, 1],
            indexBuffer: [0, 1, 2, 0, 2, 3],
        },
    });

    const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

    const fragmentSrc = `

    precision mediump float;

    varying vec2 vUvs;

    uniform sampler2D uSampler2;
    uniform float time;

    void main() {

        gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );
    }`;

    const uniforms = {
        uSampler2: texture,
        time: 0,
    };

    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);

    const quad = new Mesh(geometry, shader);

    quad.position.set(400, 300);
    quad.scale.set(2);

    app.stage.addChild(quad);

    // Start the animation..
    app.ticker.add((delta) =>
    {
        quad.rotation += 0.01;
        quad.shader.uniforms.time += 0.1;
    });
})();
