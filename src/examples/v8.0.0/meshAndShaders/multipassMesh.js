import { Application, Assets, Container, Geometry, Mesh, RenderTexture, Shader } from 'pixi.js';

(async () =>
{
    const app = new Application();

    await app.init({ height: 640, resizeTo: window, preference: 'webgl' });

    document.body.appendChild(app.view);

    // Build geometry.
    const geometry = new Geometry({
        attributes: {
            aPosition: [
                0,
                0, // x, y
                200,
                0, // x, y
                200,
                200, // x, y,
                0,
                200, // x, y,
            ],
            aUV: [0, 0, 1, 0, 1, 1, 0, 1],
        },
        indexBuffer: [0, 1, 2, 0, 2, 3],
    });

    // Vertex shader. Use same shader for all passes.
    const vertexSrc = `

    precision mediump float;

    attribute vec2 aPosition;
    attribute vec2 aUV;

    uniform mat3 projectionMatrix;
    uniform mat3 worldTransformMatrix;

    uniform mat3 uTransformMatrix;
    

    varying vec2 vUvs;

    void main() {

        vUvs = aUV;
        mat3 mvp = projectionMatrix * worldTransformMatrix * uTransformMatrix;
        gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);

    }`;

    // Load a perlinnoise texture for one of the shaders.
    const perlinTexture = await Assets.load('https://pixijs.com/assets/perlin.jpg');

    // First pass, generates a grid.
    const fragmentGridSrc = `
precision mediump float;
varying vec2 vUvs;
uniform float zoom;

void main()
{
    //Generate a simple grid.
    //Offset uv so that center is 0,0 and edges are -1,1
    vec2 uv = (vUvs-vec2(0.5))*2.0;
    vec2 gUv = floor(uv*zoom);
    vec4 color1 = vec4(0.8, 0.8, 0.8, 1.0);
    vec4 color2 = vec4(0.4, 0.4, 0.4, 1.0);
    vec4 outColor = mod(gUv.x + gUv.y, 2.) < 0.5 ? color1 : color2;
    finalColor = outColor;

}`;

    const gridShader = Shader.from({
        gl: {
            vertex: vertexSrc,
            fragment: fragmentGridSrc,
        },
        resources: {
            gridUniforms: {
                zoom: { type: 'float', value: 10 },
            },
        },
    });

    // Sharing textures and meshes is possible.
    // But for simplicity each pass has its own output texture and mesh in this example.
    const gridTexture = RenderTexture.create({ width: 200, height: 200 });
    const gridQuad = new Mesh({ geometry, shader: gridShader });
    const gridContainer = new Container();

    gridContainer.addChild(gridQuad);

    // Second pass. Takes grid as input and makes it ripple.
    const fragmentRippleSrc = `
precision mediump float;
varying vec2 vUvs;
uniform float amount;
uniform float phase;
uniform sampler2D texIn;

void main()
{
    //Generate a simple grid.
    vec2 uv = vUvs;
    //Calculate distance from center
    float distance = length( uv - vec2(0.5));
    vec4 color = texture2D(texIn, uv);
    color.rgb *= sin(distance*25.0+phase) * amount+1.;
    finalColor = color;
}`;
    // const rippleUniforms = {
    //     amount: 0.5,
    //     phase: 0,
    //     texIn: gridTexture,
    // };
    const rippleShader = Shader.from({
        gl: {
            vertex: vertexSrc,
            fragment: fragmentRippleSrc,
        },
        resources: {
            rippleUniforms: {
                amount: { type: 'float', value: 0.5 },
                phase: { type: 'float', value: 0 },
            },
            texIn: gridTexture.source,
        },
    });

    const rippleTexture = RenderTexture.create({ width: 200, height: 200 });
    const rippleQuad = new Mesh({ geometry, shader: rippleShader });
    const rippleContainer = new Container();

    rippleContainer.addChild(rippleQuad);

    // Second effect. Generates a filtered noise.
    const fragmentNoiseSrc = `
precision mediump float;
varying vec2 vUvs;
uniform float limit;
uniform sampler2D noise;

void main()
{
    float color = texture2D(noise, vUvs).r;
    color = step(limit, color);
    gl_FragColor = vec4(color);
}`;

    const noiseShader = Shader.from({
        gl: {
            vertex: vertexSrc,
            fragment: fragmentNoiseSrc,
        },
        resources: {
            noiseUniforms: {
                limit: { type: 'float', value: 0.5 },
            },
            noise: perlinTexture.source,
        },
    });

    const noiseTexture = RenderTexture.create({ width: 200, height: 200 });
    const noiseQuad = new Mesh({ geometry, shader: noiseShader });
    const noiseContainer = new Container();

    noiseContainer.addChild(noiseQuad);

    // Third effect
    const fragmentWaveSrc = `
precision mediump float;
varying vec2 vUvs;
uniform float amplitude;
uniform float time;

void main()
{
    //Offset uv so that center is 0,0 and edges are -1,1
    vec2 uv = (vUvs-vec2(0.5))*2.0;

    vec3 outColor = vec3(0.);

    //Simple wavefunctions inversed and with small offsets.
    outColor += 5./length(uv.y*200. - 50.0*sin( uv.x*0.25+ time*0.25)*amplitude);
    outColor += 4./length(uv.y*300. - 100.0*sin(uv.x*0.5+time*0.5)*amplitude*1.2);
    outColor += 3./length(uv.y*400. - 150.0*sin(uv.x*0.75+time*0.75)*amplitude*1.4);
    outColor += 2./length(uv.y*500. - 200.0*sin(uv.x+time)*amplitude*1.6);

    gl_FragColor = vec4(outColor,1.0);
}`;

    const waveShader = Shader.from({
        gl: {
            vertex: vertexSrc,
            fragment: fragmentWaveSrc,
        },
        resources: {
            waveUniforms: {
                amplitude: { type: 'float', value: 0.75 },
                time: { type: 'float', value: 0 },
            },
        },
    });

    const waveTexture = RenderTexture.create({ width: 200, height: 200 });
    const waveQuad = new Mesh(geometry, waveShader);
    const waveContainer = new Container();

    waveContainer.addChild(waveQuad);

    // Final combination pass
    const fragmentCombineSrc = `
precision mediump float;
varying vec2 vUvs;

uniform sampler2D texRipple;
uniform sampler2D texNoise;
uniform sampler2D texWave;

void main()
{
    //Read color from all
    vec4 ripple = texture2D(texRipple, vUvs);
    vec4 noise = texture2D(texNoise, vUvs);
    vec4 wave = texture2D(texWave, vUvs);

    gl_FragColor = mix(ripple, wave,noise.r);
}`;

    const combineShader = Shader.from({
        gl: {
            vertex: vertexSrc,
            fragment: fragmentCombineSrc,
        },
        resources: {
            texRipple: rippleTexture.source,
            texNoise: noiseTexture.source,
            texWave: waveTexture.source,
        },
    });

    const combineQuad = new Mesh(geometry, combineShader);

    gridContainer.position.set(10, 10);
    rippleContainer.position.set(220, 10);
    noiseContainer.position.set(10, 220);
    waveContainer.position.set(10, 430);
    combineQuad.position.set(430, 220);

    // Add all phases to stage so all the phases can be seen separately.
    app.stage.addChild(gridContainer);
    app.stage.addChild(rippleContainer);
    app.stage.addChild(noiseContainer);
    app.stage.addChild(waveContainer);
    app.stage.addChild(combineQuad);

    // start the animation..
    let time = 0;

    app.ticker.add(() =>
    {
        time += 1 / 60;
        gridQuad.shader.resources.gridUniforms.uniforms.zoom = Math.sin(time) * 5 + 10;
        rippleQuad.shader.resources.rippleUniforms.phase = -time;
        waveQuad.shader.resources.waveUniforms.uniforms.time = time;
        noiseQuad.shader.resources.noiseUniforms.uniforms.limit = Math.sin(time * 0.5) * 0.35 + 0.5;

        // Render the passes to get textures.
        app.renderer.render({
            container: gridQuad,
            target: gridTexture,
        });

        app.renderer.render({
            container: rippleQuad,
            target: rippleTexture,
        });

        app.renderer.render({
            container: noiseQuad,
            target: noiseTexture,
        });

        app.renderer.render({
            container: waveQuad,
            target: waveTexture,
        });
    });
})();
