import { Application, Assets, Geometry, Mesh, Shader } from 'pixi.js';

(async () =>
{
    const texture = await Assets.load('assets/bg_scene_rotate@2x.jpg');

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
                100,
            ], // x, y,,
            aColor: [1, 0, 0, 0, 1, 0, 0, 0, 1],
            aUV: [0, 0, 1, 0, 1, 1],
        },
    });

    const shader = Shader.from({
        gl: {
            vertex: `
                in vec2 aPosition;
                in vec3 aColor;
                in vec2 aUV;
                
                out vec3 vColor;
                out vec2 vUV;
    
                uniform mat3 projectionMatrix;
                uniform mat3 worldTransformMatrix;
        
                uniform mat3 uTransformMatrix;
                
                
                void main() {
        
                    mat3 mvp = projectionMatrix * worldTransformMatrix * uTransformMatrix;
                    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
    
                    vColor = aColor;
                    vUV = aUV;
                }
            `,
            fragment: ` 
                in vec3 vColor;
                in vec2 vUV;
    
                uniform sampler2D uTexture;
              
                void main() {
                    gl_FragColor = texture2D(uTexture, vUV) * vec4(vColor, 1.0);
                }
            `,
        },
        resources: {
            uTexture: texture.source,
        },
    });

    const triangle = new Mesh({
        geometry,
        shader,
    });

    triangle.position.set(400, 300);

    app.stage.addChild(triangle);

    app.ticker.add(() =>
    {
        triangle.rotation += 0.01;
    });
})();
