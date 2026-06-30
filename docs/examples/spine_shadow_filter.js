// dependencies: { "@esotericsoftware/spine-pixi-v8": "latest", "pixi.js": "latest" }
// description: A spine in PixiJS with an advanced shadow filter
// Import required classes from PixiJS and Spine
import { Application, Assets, Filter, GlProgram } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: '#1099bb', resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Load the assets.
  await Assets.load([
    {
      alias: 'spineSkeleton',
      src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
    },
    {
      alias: 'spineAtlas',
      src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
    },
  ]);

  // Create our character
  const spineBoy = Spine.from({
    skeleton: 'spineSkeleton',
    atlas: 'spineAtlas',
  });

  // Place on the screen
  spineBoy.x = app.screen.width / 2;
  spineBoy.y = app.screen.height - 80;
  spineBoy.scale.set(0.5);

  // Play animation
  spineBoy.state.setAnimation(0, 'walk', true);

  // Create the shader for the ShadowFilter
  const vertexShader = `#version 300 es
        precision highp float;
        
        in vec2 aPosition;
        
        uniform vec4 uInputSize;
        uniform vec4 uOutputFrame;
        uniform vec4 uOutputTexture;
        
        out vec2 vTextureCoord;
        
        void main() {
          vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
          position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
          position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
          gl_Position = vec4(position, 0.0, 1.0);
          vTextureCoord = aPosition * (uOutputFrame.zw * uInputSize.zw);
        }
      `;

  const fragmentShader = `#version 300 es
        precision highp float;
        
        in vec2 vTextureCoord;
        
        uniform sampler2D uTexture;
        uniform vec4 uInputSize;
        uniform vec4 uOutputFrame;
        uniform vec2 uShadowDirection;
        uniform vec3 uShadowColor;
        uniform float uFloorY;
        uniform float uAlpha;
        
        out vec4 finalColor;
        
        void main() {
          vec2 screenCoord = vTextureCoord * uInputSize.xy + uOutputFrame.xy;
          
          // Shadow projection logic
          float paramY = (screenCoord.y - uFloorY) / uShadowDirection.y;
          vec2 shadow;
          shadow.y = paramY + uFloorY;
          shadow.x = screenCoord.x + paramY * uShadowDirection.x;
          
          vec2 bodyFilterCoord = (shadow - uOutputFrame.xy) * uInputSize.zw;
          
          vec4 originalColor = texture(uTexture, vTextureCoord);
          
          // Boundary Check: Prevents "streaking" if shadow goes outside texture bounds
          // We strictly check 0.0 to 1.0 range
          bool outside = bodyFilterCoord.x < 0.0 || bodyFilterCoord.x > 1.0 || 
                        bodyFilterCoord.y < 0.0 || bodyFilterCoord.y > 1.0;
                        
          if (outside) {
            finalColor = originalColor;
          } else {
            vec4 shadowSample = texture(uTexture, bodyFilterCoord);
            
            // Apply custom shadow color and alpha
            vec4 shadowColor = vec4(uShadowColor, shadowSample.a * uAlpha);
            
            // Composite: Shadow (backdrop) + Original (source)
            finalColor = originalColor + shadowColor * (1.0 - originalColor.a);
          }
        }
        `;

  const shadowFilter = new Filter({
    glProgram: GlProgram.from({
      vertex: vertexShader,
      fragment: fragmentShader,
    }),
    resources: {
      shadowUniforms: {
        uShadowDirection: { value: [0.4, 0.5], type: 'vec2<f32>' },
        uShadowColor: { value: [0.0, 0.0, 0.0], type: 'vec3<f32>' },
        uFloorY: { value: [0.0], type: 'f32' },
        uAlpha: { value: [0.4], type: 'f32' },
      },
    },
  });

  // Padding is the max shadow shift to the sides
  shadowFilter.padding = 200;

  // Apply the filter to the Spine object
  spineBoy.filters = [shadowFilter];

  app.ticker.add(() => {
    // Calculate global Y of the spine's origin (feet)
    shadowFilter.resources.shadowUniforms.uniforms.uFloorY = spineBoy.toGlobal({
      x: 0,
      y: 0,
    }).y;
  });

  // Add the Spine object to the stage
  app.stage.addChild(spineBoy);
})();
