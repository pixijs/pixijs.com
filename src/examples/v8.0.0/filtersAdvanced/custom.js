import { Application, Assets, Sprite, Filter, GlProgram } from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
        resizeTo: window,
        hello: true,
        preference: 'webgl',
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the texture
    const texture = await Assets.load('https://pixijs.com/assets/bg_grass.jpg');

    // Create background image
    const background = Sprite.from(texture);

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // Create the new filter, arguments: (vertexShader, framentSource)
    const filter = new Filter({
        glProgram: new GlProgram({
            fragment: `
            in vec2 vTextureCoord;
            in vec4 vColor;
            
            uniform sampler2D uTexture;
            uniform float uTime;
            
            void main(void)
            {
               vec2 uvs = vTextureCoord.xy;
            
               vec4 fg = texture2D(uTexture, vTextureCoord);
            
            
               fg.r = uvs.y + sin(uTime);
            
   
               gl_FragColor = fg;
            
            }`,
            vertex: `
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
            `,
        }),
        resources: {
            timeUniforms: {
                uTime: { value: 0.0, type: 'f32' },
            },
        },
    });

    // === WARNING ===
    // specify uniforms in filter constructor
    // or set them BEFORE first use
    // filter.uniforms.customUniform = 0.0

    // Add the filter
    background.filters = [filter];

    // Animate the filter
    app.ticker.add((ticker) =>
    {
        filter.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime;
    });
})();
