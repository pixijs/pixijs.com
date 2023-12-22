import { Application, Shader, Mesh, Geometry, Ticker } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const geometry = new Geometry({
        attributes: {
            aVertexPosition: [-100, -50, 100, -50, 0, 100],
            aColor: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        },
    });

    const shader = Shader.from(
        `
    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec3 aColor;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec3 vColor;

    void main() {

        vColor = aColor;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`,
        `precision mediump float;

        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }

    `,
    );

    const triangle = new Mesh(geometry, shader);

    triangle.position.set(400, 300);
    triangle.scale.set(2);

    app.stage.addChild(triangle);

    Ticker.shared.add(() =>
    {
        triangle.rotation += 0.01;
    });
})();
