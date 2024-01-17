import { Application, Assets, Geometry, Mesh, Shader } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
        resizeTo: window,
        preference: 'webgl',
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    const quadGeometry = new Geometry({
        attributes: {
            aPosition: [
                -100,
                -100, // x, y
                100,
                -100, // x, y
                100,
                100, // x, y,
                -100,
                100, // x, y,
            ],
            aUV: [0, 0, 1, 0, 1, 1, 0, 1],
        },
        indexBuffer: [0, 1, 2, 0, 2, 3],
    });

    const geometry = new Geometry({
        attributes: {
            aPosition: [
                -100,
                -100, // x, y
                100,
                -100, // x, y
                100,
                100, // x, y,
            ],
            aUV: [0, 0, 1, 0, 1, 1],
        },
    });

    const shader = Shader.from({
        gl: {
            vertex: `
                in vec2 aPosition;
                in vec2 aUV;
                
                out vec2 vUV;

                uniform mat3 projectionMatrix;
                uniform mat3 worldTransformMatrix;
        
                uniform mat3 uTransformMatrix;
                
                
                void main() {
        
                    mat3 mvp = projectionMatrix * worldTransformMatrix * uTransformMatrix;
                    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);

                    vUV = aUV;
                }
            `,
            fragment: ` 
                in vec2 vUV;

                uniform sampler2D uTexture;
            
                void main() {
                    gl_FragColor = texture2D(uTexture, vUV).bgra;
                }
            `,
        },
        resources: {
            uTexture: (await Assets.load('https://pixijs.com/assets/bg_rotate.jpg')).source,
        },
    });

    const quad = new Mesh({
        geometry: quadGeometry,
        shader,
    });

    const triangle = new Mesh({
        geometry,
        shader,
    });

    quad.position.set(400, 300);
    triangle.position.set(400, 300);
    triangle.scale.set(2);

    app.stage.addChild(quad, triangle);

    app.ticker.add(() =>
    {
        triangle.rotation += 0.01;
        quad.rotation -= 0.01;
    });
})();
