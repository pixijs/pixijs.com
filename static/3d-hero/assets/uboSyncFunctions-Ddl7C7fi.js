import{w as I,g as x,e as d,u as S,f as h,h as l,i as m}from"./index-D7XEfyLx.js";const F={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},D={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function E(f,t){for(const e in f.attributes){const a=f.attributes[e],n=t[e];n?(a.format??(a.format=n.format),a.offset??(a.offset=n.offset),a.instance??(a.instance=n.instance)):I(`Attribute ${e} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}y(f)}function y(f){const{buffers:t,attributes:e}=f,a={},n={};for(const r in t){const s=t[r];a[s.uid]=0,n[s.uid]=0}for(const r in e){const s=e[r];a[s.buffer.uid]+=x(s.format).stride}for(const r in e){const s=e[r];s.stride??(s.stride=a[s.buffer.uid]),s.start??(s.start=n[s.buffer.uid]),n[s.buffer.uid]+=x(s.format).stride}}const v=[];v[d.NONE]=void 0;v[d.DISABLED]={stencilWriteMask:0,stencilReadMask:0};v[d.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};v[d.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};v[d.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};v[d.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}};class M{constructor(t){this._syncFunctionHash=Object.create(null),this._adaptor=t,this._systemCheck()}_systemCheck(){if(!S())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(t){const e=this.getUniformGroupData(t);t.buffer||(t.buffer=new h({data:new Float32Array(e.layout.size/4),usage:l.UNIFORM|l.COPY_DST}))}getUniformGroupData(t){return this._syncFunctionHash[t._signature]||this._initUniformGroup(t)}_initUniformGroup(t){const e=t._signature;let a=this._syncFunctionHash[e];if(!a){const n=Object.keys(t.uniformStructures).map(o=>t.uniformStructures[o]),r=this._adaptor.createUboElements(n),s=this._generateUboSync(r.uboElements);a=this._syncFunctionHash[e]={layout:r,syncFunction:s}}return this._syncFunctionHash[e]}_generateUboSync(t){return this._adaptor.generateUboSync(t)}syncUniformGroup(t,e,a){const n=this.getUniformGroupData(t);t.buffer||(t.buffer=new h({data:new Float32Array(n.layout.size/4),usage:l.UNIFORM|l.COPY_DST}));let r=null;return e||(e=t.buffer.data,r=t.buffer.dataInt32),a||(a=0),n.syncFunction(t.uniforms,e,r,a),!0}updateUniformGroup(t){if(t.isStatic&&!t._dirtyId)return!1;t._dirtyId=0;const e=this.syncUniformGroup(t);return t.buffer.update(),e}destroy(){this._syncFunctionHash=null}}function O(f,t,e){const a=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let n=0;for(let s=0;s<f.length;s++){const o=f[s],p=o.data.name;let b=!1,i=0;for(let u=0;u<m.length;u++)if(m[u].test(o.data)){i=o.offset/4,a.push(`name = "${p}";`,`offset += ${i-n};`,m[u].ubo),b=!0;break}if(!b)if(o.data.size>1)i=o.offset/4,a.push(e(o,i-n));else{const u=t[o.data.type];i=o.offset/4,a.push(`
                    v = uv.${p};
                    offset += ${i-n};
                    ${u};
                `)}n=i}const r=a.join(`
`);return new Function("uv","data","dataInt32","offset",r)}function c(f,t){return`
        for (let i = 0; i < ${f*t}; i++) {
            data[offset + (((i / ${f})|0) * 4) + (i % ${f})] = v[i];
        }
    `}const _={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,u32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"vec2<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":c(3,2),"mat4x2<f32>":c(4,2),"mat2x3<f32>":c(2,3),"mat4x3<f32>":c(4,3),"mat2x4<f32>":c(2,4),"mat3x4<f32>":c(3,4)},T={..._,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};export{v as G,M as U,_ as a,D as b,O as c,E as e,F as t,T as u};
