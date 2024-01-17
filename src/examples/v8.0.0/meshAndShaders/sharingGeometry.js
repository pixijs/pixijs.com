import { Application, Assets, Geometry, GlProgram, Mesh, Shader } from 'pixi.js';

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

    const glProgram = GlProgram.from({
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
                gl_FragColor = texture2D(uTexture, vUV);
            }
        `,
    });

    const triangle = new Mesh({
        geometry,
        shader: new Shader({
            glProgram,
            resources: {
                uTexture: (await Assets.load('https://pixijs.com/assets/bg_scene_rotate.jpg')).source,
            },
        }),
    });

    const triangle2 = new Mesh({
        geometry,
        shader: new Shader({
            glProgram,
            resources: {
                uTexture: (await Assets.load('https://pixijs.com/assets/bg_rotate.jpg')).source,
            },
        }),
    });

    const triangle3 = new Mesh({
        geometry,
        shader: new Shader({
            glProgram,
            resources: {
                uTexture: (await Assets.load('https://pixijs.com/assets/bg_displacement.jpg')).source,
            },
        }),
    });

    triangle.position.set(400, 300);
    triangle.scale.set(2);

    triangle2.position.set(200, 100);

    triangle3.position.set(500, 400);
    triangle3.scale.set(3);

    app.stage.addChild(triangle3, triangle2, triangle);

    app.ticker.add(() =>
    {
        triangle.rotation += 0.01;
        triangle2.rotation -= 0.01;
        triangle3.rotation -= 0.005;
    });
})();
