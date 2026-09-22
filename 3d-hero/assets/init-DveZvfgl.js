import{ad as Ee,T as w,ae as Re,af as $,M as te,w as L,t as ve,x as we,R as ke,J as Ae,L as Se,ag as ye,B as _e,Q as Oe,V as Fe,E as re,W as ae,X as Te,Y as J,Z as Be,_ as Ne,N as De,f as Ue,$ as je,S as H,a0 as ze,a1 as oe,a2 as We,a3 as Ve,a4 as He,a5 as Ye,a6 as Ke,a7 as qe,a8 as Xe,a9 as Je,ab as Ze,b as Qe,ah as se,p as et}from"./index-DOba0GE3.js";import{J as Ge,S as tt,C as rt,K as at,c as ot,a as st,g as nt,b as ne,N as it,V as lt,H as ct,t as ut,r as Me,f as Y,h as dt,i as ht,j as ft,k as pt,l as mt,n as gt,v as xt,m as bt,o as vt,p as wt,q as St,s as yt,O as _t,P as Tt,M as Bt,w as Dt,x as Gt,y as Mt,z as Pt,A as Ct,D as It,E as $t,F as Lt,I as Et}from"./View3DGCRegistry-BJ1rd7BC.js";import"./RenderTexture-B4iswCQS.js";const Rt=4;var kt=class{data;_source;_texture;_capacity=0;constructor(e=256){this.ensureCapacity(e)}get texture(){return this._texture}get capacity(){return this._capacity}ensureCapacity(e){if(e<=this._capacity)return;let t=Math.max(256,this._capacity);for(;t<e;)t*=2;this._capacity=t;const r=Math.min(t,Re),a=Math.ceil(t/r);if(this.data=new Float32Array(r*a*Rt),!this._source){this._source=new Ee({resource:this.data,width:r,height:a,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha",label:"InstanceIndex"}),this._texture=new w({source:this._source});return}this._source.resource=this.data,(this._source.width!==r||this._source.height!==a)&&this._source.resize(r,a)}upload(){this._source.update()}unload(){this._source?.unload()}destroy(){this._texture&&(this._texture.destroy(!0),this._texture=null,this._source=null,this.data=null)}};function Pe(e){const t=e?" * 2":"";return{name:e?"morphTargetNormalGl":"morphTargetGl",bindings:{global:{uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        vec4 fetchMorphTexel(int texel) {
          return texelFetch(uMorphTexture, ${$("texel")}, 0);
        }

        float fetchMorphWeight(int index) {
          return fetchMorphTexel(index >> 2)[index & 3];
        }

        // Row texel 1 of the geometry data store: (deltaBase, targetCount,
        // baseVertex, spare) as u32 bit patterns in an f32 texture.
        vec4 fetchGeometryMorphFacts(int geometryIndex) {
          int texel = geometryIndex * 2 + 1;
          return texelFetch(uGeometryTexture, ${$("texel")}, 0);
        }
      `,input:`
        if (morphData.x != 0.0) {
          vec4 morphFacts = fetchGeometryMorphFacts(int(morphData.y));
          int morphTargetCount = int(floatBitsToUint(morphFacts.y));
          int vidLocal = gl_VertexID - int(floatBitsToUint(morphFacts.z));
          int morphDeltaTexel = int(floatBitsToUint(morphFacts.x)) / 4 + vidLocal * morphTargetCount${t};
          int morphWeightIndex = int(morphData.x);
          vec3 morphedPosition = position.xyz;${e?`
          vec3 morphedNormal = normal;`:""}
          for (int morphIndex = 0; morphIndex < morphTargetCount; morphIndex++) {
            float morphWeight = fetchMorphWeight(morphWeightIndex + morphIndex);
            if (morphWeight != 0.0) {
              morphedPosition += fetchMorphTexel(morphDeltaTexel + morphIndex${t}).xyz * morphWeight;${e?`
              morphedNormal += fetchMorphTexel(morphDeltaTexel + morphIndex * 2 + 1).xyz * morphWeight;`:""}
            }
          }
          position = vec4(morphedPosition, position.w);${e?`
          normal = normalize(morphedNormal);`:""}
        }
      `}}}}const At=Pe(!1),Ot=Pe(!0);function W(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function Ft(e){const t=e.some(([i,s])=>i!==0||s!==0),r=([i,s])=>i===0&&s===0?"uv":`uv + vec2(${W(i)}, ${W(s)}) * texelSize`,a=["      float currentDepth = depth - params.x;"];if(t&&a.push("      float texelSize = 1.0 / params.z;"),a.push("      float fl = float(layer);",""),e.length===1)a.push(`      return texture(uShadowMap, vec4(${r(e[0])}, fl, currentDepth));`);else{const i=e.map(s=>`        texture(uShadowMap, vec4(${r(s)}, fl, currentDepth))`).join(` +
`);a.push(`      float shadow =
${i};`,"",`      return shadow / ${W(e.length)};`)}return a.join(`
`)}function K(e){return{name:`shadowGl:${e}`,structs:{ShadowData:Ge},bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowData:`array<vec4<f32>, ${te*6}>`}},gl:{header:`

    ShadowData getShadowData(int index) {
      int offset = index * 6;
      ShadowData sd;
      sd.lightSpaceMatrix = mat4(
        uShadowData[offset + 0],
        uShadowData[offset + 1],
        uShadowData[offset + 2],
        uShadowData[offset + 3]
      );
      sd.shadowParams = uShadowData[offset + 4];   // bias, normalBias, mapSize, cascadeCount
      sd.cascadeSplits = uShadowData[offset + 5];  // view-space split depths (cascade 0)
      return sd;
    }

    // Samples one shadow-map array layer with PCF.
    // params = (bias, normalBias, mapSize).
    float sampleShadowLayer(int layer, mat4 lightSpaceMatrix, vec3 worldPos, vec3 normal, vec3 params, float NdotL) {
      // Normal offset, tapered by how obliquely the light strikes the surface.
      // Depth error across one shadow texel grows as the surface turns away from
      // the light, so a face-on surface needs almost none -- and taking none is
      // what stops the offset eating short shadows.
      vec3 biasedPos = worldPos + normal * (params.y * (1.0 - NdotL));
      vec4 lightSpacePos = lightSpaceMatrix * vec4(biasedPos, 1.0);
      vec3 projPos = lightSpacePos.xyz / lightSpacePos.w;

      vec2 uv = projPos.xy * 0.5 + 0.5;
      float depth = projPos.z * 0.5 + 0.5;

      vec3 uvd = vec3(uv, depth);
      if (any(notEqual(clamp(uvd, 0.0, 1.0), uvd))) {
        return 1.0;
      }

${Ft(tt[e])}
    }

    float calculateShadow(
      Light light,
      vec3 worldPos,
      vec3 normal,
      float NdotL
    ) {
      int baseIndex = int(light.shadowDataIndex);

      // -1 means this light does not cast shadows
      if (baseIndex == -1) {
        return 1.0;
      }

      // cascadeCount + splits live on the light's first cascade entry.
      ShadowData base = getShadowData(baseIndex);
      int last = int(base.shadowParams.w) - 1;

      // Not cascaded: one map, sampled directly.
      if (last < 1) {
        return sampleShadowLayer(baseIndex, base.lightSpaceMatrix, worldPos, normal, base.shadowParams.xyz, NdotL);
      }

      float viewDepth = -(uViewMatrix * vec4(worldPos, 1.0)).z;
      vec3 splits = base.cascadeSplits.xyz;

      // Splits are sorted ascending, so the cascade is the number of split
      // planes viewDepth is past, clamped to the light's cascade count.
      vec3 crossed = step(splits, vec3(viewDepth));
      int cascadeIndex = int(min(dot(crossed, vec3(1.0)), float(last)));

      int idx = baseIndex + cascadeIndex;
      ShadowData sd = getShadowData(idx);
      float shadow = sampleShadowLayer(idx, sd.lightSpaceMatrix, worldPos, normal, sd.shadowParams.xyz, NdotL);

      // The outermost cascade has nothing to fade into.
      if (cascadeIndex == last) {
        return shadow;
      }

      // This cascade's own near/far split, picked without indexing the vector.
      vec3 hot = vec3(float(cascadeIndex == 0), float(cascadeIndex == 1), float(cascadeIndex == 2));
      float splitFar = dot(splits, hot);
      float splitNear = dot(splits, vec3(hot.y, hot.z, 0.0));

      float band = max((splitFar - splitNear) * ${W(rt)}, 1e-4);
      float blend = clamp((viewDepth - splitFar + band) / band, 0.0, 1.0);

      if (blend <= 0.0) {
        return shadow;
      }

      ShadowData nd = getShadowData(idx + 1);
      float next = sampleShadowLayer(idx + 1, nd.lightSpaceMatrix, worldPos, normal, nd.shadowParams.xyz, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const Nt={hard:K("hard"),pcf:K("pcf"),"pcf-high":K("pcf-high")},q={name:"skinningGl",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},bindings:{global:{uBonePitTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        // Three rows of four, not a mat4: a bone matrix is affine, so its fourth row is
        // always (0, 0, 0, 1). Twelve floats instead of sixteen is three texels instead of
        // four, and blending rows is a quarter less work than blending mat4s.
        void getBoneRows(uint jointIndex, uint bonePitIndex, out vec4 r0, out vec4 r1, out vec4 r2) {
          int baseTexel = int(bonePitIndex + jointIndex) * 3;

          r0 = texelFetch(uBonePitTexture, ${$("baseTexel")}, 0);
          r1 = texelFetch(uBonePitTexture, ${$("baseTexel + 1")}, 0);
          r2 = texelFetch(uBonePitTexture, ${$("baseTexel + 2")}, 0);
        }
      `,input:`
        vec4 skinRow0, skinRow1, skinRow2;
        vec4 b0, b1, b2;

        getBoneRows(uint(aJoints.x), uint(bonePitIndex), b0, b1, b2);
        skinRow0 = b0 * aWeights.x;
        skinRow1 = b1 * aWeights.x;
        skinRow2 = b2 * aWeights.x;

        getBoneRows(uint(aJoints.y), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.y;
        skinRow1 += b1 * aWeights.y;
        skinRow2 += b2 * aWeights.y;

        getBoneRows(uint(aJoints.z), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.z;
        skinRow1 += b1 * aWeights.z;
        skinRow2 += b2 * aWeights.z;

        getBoneRows(uint(aJoints.w), uint(bonePitIndex), b0, b1, b2);
        skinRow0 += b0 * aWeights.w;
        skinRow1 += b1 * aWeights.w;
        skinRow2 += b2 * aWeights.w;

        // Row-major affine: transforming a point is three dot products, and the w the mat4
        // form would compute is always 1. Direction vectors use the rotation part only.
        position = vec4(dot(skinRow0, position), dot(skinRow1, position), dot(skinRow2, position), position.w);
        normal = vec3(dot(skinRow0.xyz, normal), dot(skinRow1.xyz, normal), dot(skinRow2.xyz, normal));
        tangent = vec3(dot(skinRow0.xyz, tangent), dot(skinRow1.xyz, tangent), dot(skinRow2.xyz, tangent));
      `}}},Ut={float32:"float",float32x2:"vec2",float32x3:"vec3",float32x4:"vec4",sint32:"int",sint32x2:"ivec2",sint32x3:"ivec3",sint32x4:"ivec4",uint32:"uint",uint32x2:"uvec2",uint32x3:"uvec3",uint32x4:"uvec4",float16x2:"vec2",float16x4:"vec4",unorm8x2:"vec2",unorm8x4:"vec4",snorm8x2:"vec2",snorm8x4:"vec4",uint8x2:"uvec2",uint8x4:"uvec4",sint8x2:"ivec2",sint8x4:"ivec4",unorm16x2:"vec2",unorm16x4:"vec4",snorm16x2:"vec2",snorm16x4:"vec4",uint16x2:"uvec2",uint16x4:"uvec4",sint16x2:"ivec2",sint16x4:"ivec4"};function jt(e){const t=Ut[e];return t||(L(`[compileAttributesGlsl] Unknown vertex format: "${e}"`),"vec4")}function zt(e,t,r){L(`[compileAttributesGlsl] Attribute "${e}" redefined with different format: "${r}" → "${t}". Keeping original.`)}function Wt(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const n of e)if(n.attributes)for(const[o,c]of Object.entries(n.attributes))a.has(o)?a.get(o)!==c&&zt(o,c,a.get(o)):a.set(o,c);const i=[];let s=0;for(const[n,o]of a){const c=jt(o);r?i.push(`layout(location = ${s++}) in ${c} ${n};`):i.push(`in ${c} ${n};`)}return i.join(`
`)}const Vt={collectData(e){e.stage==="vertex"&&!e.data.attributes&&(e.data.attributes=Wt(e.bits,{useLocations:e.glslOptions?.useLocations}))},injectCode(e){return e.stage==="vertex"?{header:e.data.attributes}:{}}},Z={f32:"float",i32:"int",u32:"uint",bool:"bool","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4","mat2x2<f32>":"mat2","mat3x3<f32>":"mat3","mat4x4<f32>":"mat4","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","texture_2d<f32>":"sampler2D","texture_2d_array<f32>":"sampler2DArray","texture_3d<f32>":"sampler3D","texture_cube<f32>":"samplerCube",texture_depth_2d:"sampler2DShadow",texture_depth_2d_array:"sampler2DArrayShadow",texture_depth_cube:"samplerCubeShadow",texture_depth_cube_array:"samplerCubeArrayShadow",sampler:"",sampler_comparison:""};function Ht(e){const t=e.match(/^array<(.+),\s*(\d+)>$/);return t?{baseType:t[1],size:t[2]}:null}function Yt(e){const t=Ht(e);if(t){const a=Z[t.baseType]??t.baseType;return a?{glslType:a,arraySize:t.size}:null}const r=Z[e];return r!==void 0?r||null:e}const Kt=new Set(["sampler2D","sampler2DArray","sampler3D","samplerCube","sampler2DShadow","sampler2DArrayShadow","samplerCubeShadow","samplerCubeArrayShadow"]);function qt(e){const t=Z[e];return t!==void 0&&t||e}function ie(e,t,r){L(`[compileBindingsGlsl] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Xt(e,t,r={}){const a=new Set(r.uboGroups??[]),i=new Set(t.bindGroups),s=Object.create(null);for(const l of t.bindGroups)s[l]={uniforms:Object.create(null),resources:Object.create(null),bindAsUniform:!1};const n=Object.create(null);for(const l of e)if(l.structs)for(const[u,h]of Object.entries(l.structs))u in n||(n[u]=h);for(const l of e)if(l.bindings)for(const[u,h]of Object.entries(l.bindings)){if(!h)continue;const p=u.charAt(0).toUpperCase()+u.slice(1),d=i.has(u);for(const[f,m]of Object.entries(h)){const g=ve(m);if(we(g))continue;const x=Yt(g);if(!x)continue;const B=typeof x=="object",b=B?x.glslType:x,P=B?x.arraySize:void 0;if(Kt.has(b)){if(d){const v=s[u].resources;f in v?v[f]!==b&&ie(f,b,v[f]):v[f]=b}}else{if(d){const _=s[u].uniforms;f in _||(_[f]={glslType:b,arraySize:P}),s[u].bindAsUniform=!0}p in n||(n[p]={});const v=n[p];v[f]&&v[f]!==g?ie(f,g,v[f]):v[f]=g}}}const o=[];for(const l in n){const u=l.charAt(0).toLowerCase()+l.slice(1);if(i.has(u)&&s[u]?.bindAsUniform)continue;const h=n[l];o.push(`struct ${l} {`);for(const[p,d]of Object.entries(h))o.push(`  ${qt(d)} ${p};`);o.push("};")}const c=(l,u)=>u.arraySize?`${u.glslType} ${l}[${u.arraySize}]`:`${u.glslType} ${l}`;for(const l of t.bindGroups){const u=s[l],h=Object.keys(u.uniforms);if(h.length>0)if(a.has(l)){o.push(`layout(std140) uniform ${l} {`);for(const p of h)o.push(`  ${c(p,u.uniforms[p])};`);o.push("};")}else for(const p of h)o.push(`uniform ${c(p,u.uniforms[p])};`);for(const p in u.resources)o.push(`uniform ${u.resources[p]} ${p};`)}return{source:o.join(`
`),structs:n}}const Jt={collectData(e){e.data.bindings||(e.data.bindings=Xt(e.bits,e.template,{uboGroups:e.glslOptions?.uboGroups}),e.data.structs=e.data.bindings.structs)},injectCode(e){return{header:e.data.bindings.source}}};function Zt(e,t){const r=Object.create(null);for(const i of t.bindGroups)r[i]={hasUniforms:!1,resources:Object.create(null),storages:Object.create(null)};for(const i of e)if(i.bindings)for(const[s,n]of Object.entries(i.bindings)){const o=r[s];if(o)for(const[c,l]of Object.entries(n)){const u=ve(l);ke.has(u)?o.resources[c]=!0:we(u)?o.storages[c]=!0:o.hasUniforms=!0}}const a={};return t.bindGroups.forEach((i,s)=>{const n=r[i],o={};let c=0;n.hasUniforms&&(o[c++]=i);for(const l in n.resources)o[c++]=l;for(const l in n.storages)o[c++]=l;a[s]=o}),a}const Qt={collectData(e){e.data.groupMap||(e.data.groupMap=Zt(e.bits,e.template))}},er={collectData(e){e.data.headers||(e.data.headers=e.bits.map(t=>t.gl?.header).filter(t=>!!(t&&/\S/.test(t))))},injectCode(e){return{header:e.data.headers.join(`
`)}}},tr={f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4"},rr=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function le(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function ce(e){const t=tr[e];return t||(L(`[compileInterStageGlsl] Unknown inter-stage type: "${e}"`),"vec4")}function ar(e,t,r){L(`[compileInterStageGlsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function or(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const o of e)if(o.interStage)for(const[c,l]of Object.entries(o.interStage))rr.has(c)||(a.has(c)?a.get(c)!==l&&ar(c,l,a.get(c)):a.set(c,l));const i=[];let s=0;for(const[o,c]of a){const l=ce(c),u=le(c)?"flat ":"";r?i.push(`layout(location = ${s++}) ${u}out ${l} ${o};`):i.push(`${u}out ${l} ${o};`)}const n=[];s=0;for(const[o,c]of a){const l=ce(c),u=le(c)?"flat ":"";r?n.push(`layout(location = ${s++}) ${u}in ${l} ${o};`):n.push(`${u}in ${l} ${o};`)}return{vertex:i.join(`
`),fragment:n.join(`
`)}}const sr={collectData(e){e.data.interStage||(e.data.interStage=or(e.bits,{useLocations:e.glslOptions?.useLocations}))},injectCode(e){const t=e.data.interStage;return{header:e.stage==="vertex"?t.vertex:t.fragment}}},nr={collectData(e){e.data.overrides=ot(e.bits)},injectCode(e){const t=e.glslOptions?.overrides??{};return{header:at(e.data.overrides,t)}}},j="#version 300 es",ir=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp samplerCube;
precision highp sampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;`,lr={preCompile(e){const{templateString:t}=e;if(!t.includes(j)){L(`[compileShader] ${e.stage==="vertex"?"Vertex":"Fragment"} template has no '${j}' line - highp precision will not be declared.`);return}e.templateString=t.replace(j,`${j}
${ir}`)}},cr=/\{\{(.*?)\}\}/g;function ur(e){const t=new Set;for(const r of Object.values(e))for(const a of r)if(a)for(const i of a.matchAll(cr))t.add(i[1]);return t}function dr(e,t,r){const a=nt(e),i=ur(t);for(const[s,n]of Object.entries(t))n.some(o=>o&&/\S/.test(o))&&!a.has(s)&&!i.has(s)&&L(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} generated code for slot {{${s}}} but template doesn't have it.`)}const hr={injectCode(e){if(!e.stage)return{};const t=st(e.bits,"gl",e.stage),r={};for(const[i,s]of Object.entries(t))r[i]=s.join(`
`);const a={};for(const[i,s]of Object.entries(r))a[i]=[s];return dr(e.templateString,a,e.stage),r}},ue="xyzw";function fr(e,t,r){const a=`u${e}Storage`,i=Ae(t),s=new Map;for(const o of i.elements){const c=Math.floor(o.offset/16),l=o.offset%16/4;s.has(c)||s.set(c,[]),s.get(c).push({name:o.name,componentStart:l,components:o.components})}const n=[];n.push("/**"),n.push(` * Auto-generated from ${e} struct bindings.`),n.push(` * Reads properties from u${e}Storage data texture and returns a`),n.push(" * populated struct — use result.fieldName to access values."),n.push(" * Do not edit manually; regenerated during shader compilation."),n.push(" */"),n.push(`${e} get${e}(uint index) {`),n.push("  int mi = int(index);"),n.push(`  int base = mi * ${r};`),n.push(`  ${e} m;`);for(const[o,c]of s){n.push(`  vec4 t${o} = texelFetch(${a}, ${$(`base + ${o}`)}, 0);`);for(const l of c)if(l.components===4)n.push(`  m.${l.name} = t${o};`);else if(l.components===3)n.push(`  m.${l.name} = t${o}.xyz;`);else if(l.components===2){const u=ue.slice(l.componentStart,l.componentStart+2);n.push(`  m.${l.name} = t${o}.${u};`)}else{const u=ue[l.componentStart];n.push(`  m.${l.name} = t${o}.${u};`)}}return n.push("  return m;"),n.push("}"),n.join(`
`)}const pr={injectCode(e){const t=e.data.structs;if(!t)return{};const r=16,a=[],i=new Set(e.template.bindGroups);for(const[s,n]of Object.entries(t)){const o=s.charAt(0).toLowerCase()+s.slice(1);if(i.has(o))continue;const c=`u${s}Storage`;let l=!1;for(const u of e.bits)if(u.bindings){for(const h of Object.values(u.bindings))if(c in h){l=!0;break}if(l)break}l&&a.push(fr(s,n,r))}return a.length===0?{}:{header:a.join(`

`)}}};function de(e,t,r){t&&/\S/.test(t)&&!e.includes("{{header}}")&&L(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} template missing {{header}} slot - bindings, attributes, and inter-stage variables will not be injected.`)}function X(e){const{bits:t,template:r,extraPlugins:a,...i}=e,s=[lr,Qt,nr,Jt,pr,sr,Vt,er,hr],n=a?[...a,...s]:s,o={bits:t,template:r,templateString:r.gl.vertex,data:{},stage:"vertex",glslOptions:i},c=ne(o,n);de(r.gl.vertex,o.data.headers.join(""),"vertex");const l={bits:t,template:r,templateString:r.gl.fragment,data:o.data,stage:"fragment",glslOptions:i},u=ne(l,n);return de(r.gl.fragment,l.data.headers.join(""),"fragment"),{vertex:c,fragment:u,structs:l.data.structs??{},groupMap:l.data.groupMap}}const z={name:"globalGl",structs:{Light:it,ShadowData:Ge},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uBatchWorldMatrix:"mat4x4<f32>",uFogColor:"vec3<f32>",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${te*6}>`,uEnvironmentMaxMipLevel:"f32",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<f32>",uShadowMap:"texture_depth_2d_array",uBonePitTexture:"texture_2d<f32>",uOpaqueDepthTexture:"texture_2d<f32>",uOpaqueColorTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}},gl:{header:`
const float LIGHT_DIRECTIONAL = 0.0;
const float LIGHT_POINT = 1.0;
const float LIGHT_SPOT = 2.0;
`}};function Q(e,t){let r=e._gpuData[t.uid];if(!r){const a=new Se({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uTime:{value:0,type:"f32"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"},uBatchWorldMatrix:{value:new ye,type:"mat4x4<f32>"},uLightData:{value:e._lightDataList.data,type:"vec4<f32>",size:128},uEnvironmentMaxMipLevel:{value:0,type:"f32"},uShadowData:{value:e._shadowDataList.data,type:"vec4<f32>",size:te*6}});a.isStatic=!0,a.ubo=!1;const i=new _e({0:a,1:Fe.source,2:w.EMPTY.source,3:w.EMPTY.source,4:Oe.source,5:w.EMPTY.source,6:w.EMPTY.source,7:w.EMPTY.source,8:w.EMPTY.source,9:w.EMPTY.source,10:w.EMPTY.source,11:w.EMPTY.source});r=new lt(a,i),e._gpuData[t.uid]=r}return r}const he=new Be;var mr=class{static extension={type:[re.WebGLSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[ae.SHADOW];r?.beginFrame(e);const a=Q(e,this._renderer).globalUniformGroup.uniforms,i=a.uGlobalLightParams;i[0]=0,i[1]=0,i[2]=0;const s=e.environment;if(s!==null&&!(s instanceof Te)){const o=s.intensity??1,c=a.uHemisphereSky,l=a.uHemisphereGround,u=a.uHemisphereUp;J(c,0,he.setValue(s.skyColor),o),J(l,0,he.setValue(s.groundColor),o);const h=s.up??ct,p=h.x*h.x+h.y*h.y+h.z*h.z,d=p>0?1/Math.sqrt(p):0;u[0]=h.x*d,u[1]=h.y*d,u[2]=h.z*d}const n=e._lightDataList;n.reset();for(let o=0;o<t.length;o++){const c=t[o];if(c._worldVisible){if(c.type==="ambient"){Ne(i,0,c.color,c.intensity);continue}n.count>=32||(r?.prepareShadow(c,e),n.add(c))}}i[3]=n.count}};const fe={atlas:null,indexCount:void 0,firstIndex:void 0};if(w.EMPTY.source.uid!==0)throw new Error("Texture.EMPTY.source.uid is not 0");if(w.WHITE.source.uid!==1)throw new Error("Texture.WHITE.source.uid is not 1");if(De.source.uid!==2)throw new Error("NORMAL_MAP.source.uid is not 2");let ee=0;const gr=new Float32Array(24);var xr=class{_sources=Array.from({length:10});_lastSlotCount=0;build(e){const{renderables:t,list:r,globalBindGroup:a,passBit:i,skipTextureBatching:s}=e,n=t.count;if(n===0)return 0;const o=r.commandList;o.clear(),this._ensureCapacity(r,n);const c=t.indices,l=t.items,u=r.glData,h=u.indexStaging,p=this._sources;let d=0,f=0,m=l[c[0]],g=m._passCache[i],x=g.shader,B=g.batchKey,b=m.geometry,P=g.state,v=g.topology,_=b._geometryAtlasAllocation||fe,G=_.atlas?_.atlas.geometry:b,E=_.firstIndex,M=_.indexCount,S=ee+=2,y=0,R=null,O=0;{const T=this._packTextures(m.material,p,S);y=this._lastSlotCount,this._writeIndex(h,0,m,T),R=m.material,O=T}for(let T=1;T<n;T++){m=l[c[T]],g=m._passCache[i];const U=g.batchKey!==B;if(!U){const C=m.material;if(C===R){this._writeIndex(h,T,m,O);continue}const I=C._textures,k=S+1;let N=0;for(let D=0;D<I.length;D++){const A=I[D].source;A.uid>2&&A._batchTick<S&&(A._batchTick=k,N++)}if(y+N<=10){const D=this._commitTextures(I,p,S);y=this._lastSlotCount,R=C,O=D,this._writeIndex(h,T,m,D);continue}}if(this._recordCommand(o,r.drawData,a,x,P,G,E,M,d,T-d,v),d=T,x=g.shader,B=g.batchKey,b=m.geometry,P=g.state,v=g.topology,_=b._geometryAtlasAllocation||fe,G=_.atlas?_.atlas.geometry:b,E=_.firstIndex,M=_.indexCount,U){const C=m.material;if(C===R){this._writeIndex(h,T,m,O);continue}const I=C._textures,k=S+1;let N=0;for(let D=0;D<I.length;D++){const A=I[D].source;A.uid>2&&A._batchTick<S&&(A._batchTick=k,N++)}if(y+N<=10){const D=this._commitTextures(I,p,S);y=this._lastSlotCount,R=C,O=D,this._writeIndex(h,T,m,D);continue}}if(!s){const C=o.nextBatchBindGroup(p,y),I=o.commands;for(let k=f;k<o.count;k++)I[k].batchBindGroup=C;f=o.count}S=ee+=2,y=0,R=null;const F=this._packTextures(m.material,p,S);y=this._lastSlotCount,this._writeIndex(h,T,m,F),R=m.material,O=F}if(this._recordCommand(o,r.drawData,a,x,P,G,E,M,d,n-d,v),!s){const T=o.nextBatchBindGroup(p,y),U=o.commands;for(let F=f;F<o.count;F++)U[F].batchBindGroup=T}return o.endBuild(),u.usedSlots=n,r.glData.lastVisibilityDirtyId=-1,n}draw(e,t,r,a,i){const s=t.glData.indexTexture;if(!s)return;const n=a!==null&&t._cullProducer==="cpu";(n||t.glData.lastVisibilityDirtyId!==r._visibilityDirtyId)&&this._compact(t,r,n?a:null,s);const o=e.gl,c=e.shader,l=e.geometry,u=e.state,h=t.commandList,p=h.count,d=t.drawData.drawCalls;for(let f=0;f<p;f++){const m=f*5;if(d[m+1]===0)continue;const g=h.commands[f];g.shader.groups[0]=g.globalBindGroup,g.shader.groups[1]=i.bindGroup,g.batchBindGroup&&(g.shader.groups[2]=g.batchBindGroup),c.bind(g.shader),l.bind(g.geometry,c._activeProgram),g.state&&u.set(g.state);const x=c._getProgramData(c._activeProgram).uniformData.uInstanceBase?.location;x!==void 0&&o.uniform1i(x,d[m+4]),l.draw(g.topology,d[m],d[m+2],d[m+1])}}_compact(e,t,r,a){const i=e.glData,s=e.commandList.count,n=e.drawData.drawCalls,o=i.usedSlots,c=e.view.items,l=e.view.indices,u=i.indexStaging,h=a.data,p=r!==null?ut(r.planesData,t.storeBuffer.data):null,d=p??gr;for(let f=0;f<s;f++){const m=n[f*5+4],g=f+1<s?n[(f+1)*5+4]:o;let x=m;for(let B=m;B<g;B++){const b=c[l[B]];if(b._worldVisible===0)continue;if(p!==null){const _=b.boundingSphere,G=_.radius;if(G>=0){const E=_.center,M=E.x,S=E.y,y=E.z;if(d[0]*M+d[1]*S+d[2]*y+d[3]<-G||d[4]*M+d[5]*S+d[6]*y+d[7]<-G||d[8]*M+d[9]*S+d[10]*y+d[11]<-G||d[12]*M+d[13]*S+d[14]*y+d[15]<-G||d[16]*M+d[17]*S+d[18]*y+d[19]<-G||d[20]*M+d[21]*S+d[22]*y+d[23]<-G)continue}}const P=x*4,v=B*4;h[P]=u[v],h[P+1]=u[v+1],h[P+2]=u[v+2],x++}n[f*5+1]=x-m}a.upload(),e.glData.lastVisibilityDirtyId=t._visibilityDirtyId}_ensureCapacity(e,t){const r=e.glData,a=r.indexTexture??=new kt(Math.max(256,t));a.ensureCapacity(t),(!r.indexStaging||r.indexStaging.length<a.data.length)&&(r.indexStaging=new Float32Array(a.data.length))}_recordCommand(e,t,r,a,i,s,n,o,c,l,u){const h=e.next();h.geometry=s,h.shader=a,h.globalBindGroup=r,h.state=i,h.topology=u,e.captureGeometry(s);const p=(e.count-1)*5,d=t.ensureCapacity(e.count);d[p]=o||s.indexCount||s.indexBuffer.data.length,d[p+1]=l,d[p+2]=n||0,d[p+3]=0,d[p+4]=c}_writeIndex(e,t,r,a){const i=t*4;e[i]=r._storeIndex,e[i+1]=a&65535,e[i+2]=a>>>16&65535}_packTextures(e,t,r){const a=e._textures;let i=0,s=0;for(let n=0;n<a.length;n++){const o=a[n].source,c=o.uid;let l;c<=2?l=13+c:o._batchTick===r?l=o._batchSlot:(o._batchTick=r,o._batchSlot=s,t[s]=o,l=s,s++),i|=l<<n*4}return this._lastSlotCount=s,i}_commitTextures(e,t,r){let a=0,i=this._lastSlotCount;for(let s=0;s<e.length;s++){const n=e[s].source,o=n.uid;let c;o<=2?c=13+o:n._batchTick===r?c=n._batchSlot:(n._batchTick=r,n._batchSlot=i,t[i]=n,c=i,i++),a|=c<<s*4}return this._lastSlotCount=i,a}};Ue.register({clear(){ee=0}});function pe(e){const{pipe:t,bit:r,session:a,alwaysRebuild:i,sortBatch:s,skipTextureBatching:n}=e,{view3d:o}=a,c=t.renderer.material3d.batcher,l=o._gpuData[t.renderer.uid],u=e.camera??o.camera,h=je(u),p=u.cullFrustum;h.setViewport(a.activeViewport);for(const d of o._meshBatches){if(!d.renderData._worldVisible)continue;const f=d.drawLists[r];if(!f)continue;const m=f.view;m.count!==0&&((i||f.isDrawStale(m.count))&&(f.claimDrawBuilt(m.count),f._cullProducer=Me(o.cull,!1,m.count),s?s(m,d,h.position):m.sort(),c.build({renderables:m,list:f,globalBindGroup:a.globalBindGroup,passBit:r,skipTextureBatching:n})),l.globalUniformGroup.uniforms.uBatchWorldMatrix=d.renderData.worldTransform,l.globalUniformGroup.update(),a.globalBindGroup.setResource(d.storeBuffer.texture.source,10),f.glData.indexTexture&&a.globalBindGroup.setResource(f.glData.indexTexture.texture.source,11),c.draw(t.renderer,f,d,p,h))}}const br={injectCode(e){const t=e.data.structs?.Material;return!t||Object.keys(t).length===0?{}:{materialAccess:"Material material = getMaterial(vMaterialIndex);"}}},vr=6,wr=["x","y","z","w"],V=e=>({texel:e>>2,component:wr[e&3]}),me=V(16),Sr=V(18),ge=V(20),yr=V(17);function Ce(e){return{name:e?"instanceFetchMaterial":"instanceFetch",bindings:{global:{uMeshStoreTexture:"texture_2d<f32>",uRenderInstanceTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
      uniform int uInstanceBase;

      vec4 fetchStoreTexel(int texel) {
        return texelFetch(uMeshStoreTexture, ${$("texel")}, 0);
      }
      `,input:`
      int instanceSlot = uInstanceBase + gl_InstanceID;
      vec4 renderInstance = texelFetch(uRenderInstanceTexture, ${$("instanceSlot")}, 0);

      int storeTexel = int(renderInstance.x) * ${vr};

      modelMatrix = uBatchWorldMatrix * mat4(
        fetchStoreTexel(storeTexel),
        fetchStoreTexel(storeTexel + 1),
        fetchStoreTexel(storeTexel + 2),
        fetchStoreTexel(storeTexel + 3));

      // One fetch serves three consumers: the bone pit index skinningBitGl reads,
      // the geometry row morphTargetBitGl reads, and this instance's material.
      vec4 indexLanes = fetchStoreTexel(storeTexel + ${me.texel});
      float bonePitIndex = float(floatBitsToUint(indexLanes.${me.component}));
      vec2 morphData = vec2(
        float(floatBitsToUint(fetchStoreTexel(storeTexel + ${ge.texel}).${ge.component})),
        float(int(floatBitsToUint(indexLanes.${Sr.component}))));
      ${e?`vMaterialIndex = floatBitsToUint(indexLanes.${yr.component});
      // Recombined from two exact 16-bit halves — the raw u32's bit pattern can
      // be a NaN that a float texture fetch is allowed to canonicalise.
      vTextureSlots = (uint(renderInstance.z + 0.5) << 16) | uint(renderInstance.y + 0.5);`:""}
      `}}}}const _r=Ce(!1),Tr=Ce(!0),Ie=256,$e=8,Le=32,Br=256*Le*$e*Ie,Dr={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4},xe=new Map;let Gr=0;function Mr(e){let t=xe.get(e);return t===void 0&&(t=Gr++,xe.set(e,t)),t}function Pr(e,t,r){const a=((t.data*Le+t._blendModeId)*$e+Dr[r])*Ie+Mr(t.polygonOffset);return e*Br+a}const Cr=`
//=============================================================================
// BATCH TEXTURE HELPERS
//=============================================================================
uint _unpackSlot(uint slots, uint shift) {
  return (slots >> shift) & 15u;
}

vec4 sampleBatchSlotGrad(uint slot, vec2 uv, vec2 uvDx, vec2 uvDy) {
  if (slot == 0u) return textureGrad(uBatchTexture0, uv, uvDx, uvDy);
  if (slot == 1u) return textureGrad(uBatchTexture1, uv, uvDx, uvDy);
  if (slot == 2u) return textureGrad(uBatchTexture2, uv, uvDx, uvDy);
  if (slot == 3u) return textureGrad(uBatchTexture3, uv, uvDx, uvDy);
  if (slot == 4u) return textureGrad(uBatchTexture4, uv, uvDx, uvDy);
  if (slot == 5u) return textureGrad(uBatchTexture5, uv, uvDx, uvDy);
  if (slot == 6u) return textureGrad(uBatchTexture6, uv, uvDx, uvDy);
  if (slot == 7u) return textureGrad(uBatchTexture7, uv, uvDx, uvDy);
  if (slot == 8u) return textureGrad(uBatchTexture8, uv, uvDx, uvDy);
  if (slot == 9u) return textureGrad(uBatchTexture9, uv, uvDx, uvDy);

  // Reserved slots (match Mesh3DBatcher: slot = 13 + uid; uid: 0=EMPTY, 1=WHITE, 2=NORMAL)
  if (slot == 13u) return vec4(0.0);
  if (slot == 14u) return vec4(1.0);
  if (slot == 15u) return vec4(0.5, 0.5, 1.0, 1.0);

  return textureGrad(uBatchTexture9, uv, uvDx, uvDy);
}

vec4 sampleBatchTexture(uint slots, uint shift, vec2 uv, vec2 uvDx, vec2 uvDy) {
  return sampleBatchSlotGrad(_unpackSlot(slots, shift), uv, uvDx, uvDy);
}
`,Ir={collectData(e){e.bits.some(t=>t.name==="batchTexturesBindings")||e.bits.unshift({name:"batchTexturesBindings",bindings:{batch:{uBatchTexture0:"texture_2d<f32>",uBatchTexture1:"texture_2d<f32>",uBatchTexture2:"texture_2d<f32>",uBatchTexture3:"texture_2d<f32>",uBatchTexture4:"texture_2d<f32>",uBatchTexture5:"texture_2d<f32>",uBatchTexture6:"texture_2d<f32>",uBatchTexture7:"texture_2d<f32>",uBatchTexture8:"texture_2d<f32>",uBatchTexture9:"texture_2d<f32>"}},gl:{header:Cr}})},injectCode(e){let t=0;const r=[],a=e.stage==="fragment";for(const i of e.bits)if(i.textures)for(const s of i.textures){const n=`sample${s[0].toUpperCase()}${s.slice(1)}`,o=t*4;r.push(`vec4 ${n}Direct(vec2 uv) {`,`  return sampleBatchTexture(vTextureSlots, ${o}u, uv, vec2(0.0), vec2(0.0));`,"}"),a&&r.push(`vec4 ${n}(vec2 uv) {`,`  return sampleBatchTexture(vTextureSlots, ${o}u, uv, dFdx(uv), dFdy(uv));`,"}"),t++}return{textureGetters:r.join(`
`)}}},$r=new Ye({}),Lr=`#version 300 es

{{header}}
{{textureGetters}}

void main() {
  mat4 modelMatrix;
  float materialIndex;

  // Mutable locals -- bits modify these before world transform / varying publish.
  // Mirrors the WGSL template so cross-backend bits (uvsBit, uvTransformBit, ...)
  // operate on the same local names.
  vec4 position;
  // Default normal for geometries with no aNormal attribute; normalBit
  // overwrites it in the input slot when the geometry has one.
  vec3 normal = vec3(0.0, 0.0, 1.0);
  vec3 tangent = vec3(0.0);
  vec2 uv = vec2(0.0);

  // Stage 1 — attribute decode + raw input prep.
  {{input}}

  // The material struct, fetched as soon as the input slot has produced
  // vMaterialIndex. Placed ahead of beforeTransform so a bit reading material.X
  // there sees it on WebGL exactly as it does on WebGPU, where material is in
  // scope for the whole vertex function.
  {{materialAccess}}

  // Stage 2 — override values that feed the world/clip transform.
  {{beforeTransform}}

  // Standard transform. GLSL declarations are mutable so afterTransform bits
  // can reassign worldPosition / worldNormal / gl_Position directly.
  vec4 worldPosition = modelMatrix * position;
  // Directions take the rotation/scale block only — translation must not apply.
  // Built after beforeTransform so instancing bits that reassign modelMatrix are
  // picked up.
  mat3 modelMatrix3 = mat3(modelMatrix);

  // A normal transforms by the inverse-transpose — see the WGSL counterpart.
  // Tangents lie along the surface, so they use modelMatrix3 directly.
  vec3 normalScale = 1.0 / vec3(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  vec3 worldNormal = modelMatrix3 * (normal * normalScale);
  gl_Position = uViewProjectionMatrix * worldPosition;

  // Stage 3 — modify worldPosition / gl_Position after the transform.
  {{afterTransform}}

  // Stage 4 — finalise locals before varying publish.
  {{end}}

  // Publish varyings once, after end-slot bits have finished mutating locals
  // (uvTransformBit -> uv, future bits may mutate worldNormal/uv/etc).
  vPosition = worldPosition.xyz;
  vNormal   = worldNormal;
  vUV       = uv;
}`,Er=`#version 300 es

{{header}}

out vec4 fragColor;

{{textureGetters}}

//=============================================================================
// MAIN
//=============================================================================
void main() {
  vec3 normal = normalize(vNormal);
  vec3 albedo = vec3(1.0);
  vec3 finalColor;
  float alpha = 1.0;

  // Per-fragment Material struct, when the compiled schema has fields.
  // Declared here so any bit can reference material.X regardless of its
  // position in the descriptor.
  {{materialAccess}}

  {{material}}

  // Unlit default — picks up modulation from any bit that wrote into albedo.
  // Lighting bits (pbrLightingBit) overwrite finalColor in the lighting slot.
  finalColor = albedo;

  {{lighting}}

  // Linear scene-radiance exposure, applied before any tone-mapping bit's
  // curve runs. Default uExposure = 1.0 makes this a value-preserving op.
  finalColor *= uExposure;

  {{end}}

  // Premultiply for Pixi's default 'normal' blend mode — see WGSL counterpart.
  fragColor = vec4(finalColor * alpha, alpha);
}`,Rr={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32",vTextureSlots:"u32"}},kr={name:"materialStorageBindingGl",bindings:{global:{uMaterialStorage:"texture_2d<f32>"}}},Ar={bindGroups:["global","camera","batch","local"],gl:{vertex:Lr,fragment:Er}};var Or=class{static extension={type:[re.WebGLSystem],name:"material3d"};batcher=new xr;_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return Pr(r.shader.uid,r.state,r.topology)}compilePassShader(e,t){const r=X({bits:[z,Y,...e],template:t,uboGroups:[],useLocations:!1});return H.from({gl:r,groups:void 0,groupMap:r.groupMap})}compileIsolatedShader(e,t,r){const a=X({bits:e,template:t,useLocations:!1});return H.from({gl:a,groups:r,groupMap:a.groupMap})}compileShader(e,t,r,a=!1,i={uboGroups:[],useLocations:!1}){const s=[];let n="";(e.includeGlobal??!0)&&(s.push(z),n+=`${z.name}|`),(e.includeCamera??!0)&&(s.push(Y),n+=`${Y.name}|`),s.push(...e.bitsGl),n+=e.keyGl,ze(s,e.template);const o=dt(t.geometry.attributes.aPosition.format);oe(o),s.push(o),n+=`|${o.name}`,t.morph&&(t.geometry.hasMorphNormals?(s.push(Ot),n+="|morphN"):(s.push(At),n+="|morph")),t.skeleton&&(oe(q),s.push(q),n+=`|${q.name}`),a&&(We(s,t.material),Ve(s,t.material));let c=this._shaderCache.get(n);if(!c){const l=X({bits:s,template:e.template,extraPlugins:r,...i,overrides:e.overrides});c=H.from({gl:l,groups:void 0,overrides:e.overrides,groupMap:l.groupMap}),this._shaderCache.set(n,c)}return c}ensureMaterial(e,t){const r=e.geometry,a=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(a);const i=a._passBit&ae.MATERIAL_PASS_MASK,s=a._passes[i],n=a.getPrimaryDescriptor(t),o=[z,Rr,kr,Tr];r.attributes.aNormal&&o.push(St),r.attributes.aUV&&o.push(ht(r.attributes.aUV.format)),a.doubleSided&&o.push(ft),a.flatShading&&o.push(pt);const c=a.textures.normal;c&&c!==De&&r.attributes.aUV&&o.push(r.attributes.aTangent?mt:gt),r.attributes.aColor&&e.material.vertexColors&&o.push(xt);const l=e.material.lit;e.billboardMode!=="none"&&o.push(bt(e.billboardMode,l));const u=!!r.attributes.aTangent;for(let B=0;B<n.bitsGl.length;B++){const b=n.bitsGl[B];o.push(u?He(b):b)}const h=t._fogBit;h&&a.fog&&o.push(h);const p=t._toneMappingBit;e.material.toneMapped&&p&&o.push(p),l&&o.push(e.receiveShadow&&t._hasShadows?Nt[t.shadowFilter]:vt);const d=$r.update({bitsGl:o,template:n.template??Ar,overrides:{HAS_UVS:r.attributes.aUV?1:0,...n.overrides},includeGlobal:!1}),f=this.compileShader(d,e,[wt,br,Ir],!0,{uboGroups:[],useLocations:!1}),m=s&&s.state||a.state,g=s&&s.topology||a.topology||r.topology,x=e._passCache[i];return x?(x.shader=f,x.state=m,x.topology=g):e._passCache[i]=new Ke(f,m,g),f}destroy(){if(!this._destroyed){this._destroyed=!0;for(const e of this._shaderCache.values())e.destroy();this._shaderCache.clear()}}};const Fr={name:"shadowGlobalGl",bindings:{global:{uBatchWorldMatrix:"mat4x4<f32>",uBonePitTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}}},Nr={bindGroups:["global","camera"],gl:{vertex:`#version 300 es

{{header}}

void main() {
  mat4 modelMatrix;

  // Mutable locals -- skinning bit modifies these before world transform
  vec4 position;
  vec3 normal = vec3(0.0);   // dummy, required by skinning bit
  vec3 tangent = vec3(0.0);  // dummy, required by skinning bit

  {{input}}

  vec4 worldPosition = modelMatrix * position;
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{end}}
}`,fragment:`#version 300 es
out vec4 fragColor;

{{header}}

void main() {
    fragColor = vec4(0.);
}`}};var Ur=class extends yt{_shadowUniformGroup;_shadowBindGroup;constructor(e){const t=qe();t.depthTest=!0,t.culling=!0,t.clockwiseFrontFace=!0,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:ae.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGl:[Fr,_r],template:Nr,includeGlobal:!1},state:t}});const r=new Se({uBatchWorldMatrix:{value:new ye,type:"mat4x4<f32>"}});r.isStatic=!0,r.ubo=!1,this._shadowUniformGroup=r,this._shadowBindGroup=new _e({0:r,1:w.EMPTY.source,2:w.EMPTY.source,3:w.EMPTY.source,4:w.EMPTY.source,5:w.EMPTY.source})}_applyZRangeFix=!1;render(e){const{view3d:t,lights:r}=e;if(!r.find(l=>l.canCastShadow))return;this._bindShadowSource(t,this.renderTarget.depthStencilTexture),this.pipe.renderer.colorMask.setMask(0);const a=t._bonePit.texture.source,i=this.pipe.renderer.material3d.batcher,s=this._shadowBindGroup,n=this._shadowUniformGroup;s.setResource(a,1),s.setResource(this.pipe._morphStoreBuffer.texture.source,2),s.setResource(this.pipe.geometryDataStoreBuffer.texture.source,3);const o=t.cull!=="off",c=r.some(l=>l.castShadow&&l._gpuShadowData&&l._shadowDataIndex>=0);for(const l of t._meshBatches){if(!l.renderData._worldVisible)continue;const u=l.drawLists[this.bit];if(!u)continue;const h=u.view;if(h.count===0)continue;const p=u.isDrawStale(h.count);c&&p&&(u.claimDrawBuilt(h.count),h.sort(),i.build({renderables:h,list:u,globalBindGroup:s,passBit:this.bit,skipTextureBatching:!0})),u._cullProducer=o?Me(t.cull,!1,h.count):"off"}for(const l of r){if(!Xe(l))continue;const u=Je(l);for(let h=0;h<u;h++){const p=this._cascadeSlot(l,h);if(!p.needsRender)continue;const d=o?p.cameraData.frustum:null;this.pipe.renderer.renderTarget.bind({target:this.renderTarget,clear:!0,layer:l._shadowDataIndex+h});for(const f of t._meshBatches){if(!f.renderData._worldVisible)continue;const m=f.drawLists[this.bit];!m||m.view.count===0||(n.uniforms.uBatchWorldMatrix=f.renderData.worldTransform,n.update(),s.setResource(f.storeBuffer.texture.source,4),m.glData.indexTexture&&s.setResource(m.glData.indexTexture.texture.source,5),i.draw(this.pipe.renderer,m,f,d,p.cameraData))}}this._completeShadowUpdate(l)}this.pipe.renderer.colorMask.setMask(15),e.activeTarget=null}destroy(){this._destroyed||(this._shadowBindGroup.destroy(),super.destroy())}};const jr=13421772,be=new Be;var zr=class{static extension={type:[re.WebGLPipes],name:"view3d"};renderer;_brdfLutTexture;_destroyed=!1;_iblEnvironmentMap={};_viewport=new Ze;_sortForwardByDistance=(e,t,r)=>{t.isUserBatch?_t(e,r,t.storeBuffer.data,t.renderData.worldTransform):Tt(e,r)};materialStoreBuffer=new Bt;_morphStoreBuffer=new Dt;geometryDataStoreBuffer=new Gt;globalSlots={opaqueColor:7,opaqueDepth:6,shadowMap:4};atlasPool=Mt.from({rebaseIndices:!0});_managedViews;constructor(e){this.renderer=e,this._managedViews=new Pt(e)}createShadowPass(e){return new Ur({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}prepareForward(e,t){}renderForward(e,t){const r=!Ct(e),a=e.textures===!1;if(e.sort==="distance"){pe({pipe:this,bit:e.bit,camera:e.camera,session:t,alwaysRebuild:r,sortBatch:this._sortForwardByDistance,skipTextureBatching:a});return}pe({pipe:this,bit:e.bit,camera:e.camera,session:t,alwaysRebuild:r,skipTextureBatching:a})}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.gl.viewport(e.x,e.y,e.width,e.height)}_depthClearState=null;clearDepth(e){if(!this._depthClearState){const a=new Qe;a.depthMask=!0,a.depthTest=!1,a.culling=!1,a.blend=!1,this._depthClearState=a}const t=this.renderer.gl,r=e.activeViewport;this.renderer.state.set(this._depthClearState),t.enable(t.SCISSOR_TEST),t.scissor(r.x,r.y,r.width,r.height),this.renderer.renderTarget.clear(this.renderer.renderTarget.renderTarget,se.DEPTH),t.disable(t.SCISSOR_TEST)}copyColor(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.colorTexture)return;const a=t.view3d._graph._texture(e,t),i=t.activeViewport,s=a.frame,n=a.source.resolution;this.renderer.renderTarget.copyToTexture(r,a,{x:i.x,y:i.y},{width:i.width,height:i.height},{x:Math.round(s.x*n),y:Math.round(s.y*n)})}generateMips(e,t){const r=t.view3d._graph._texture(e,t).source;this.renderer.renderTarget.bind({target:t.defaultTarget,clear:se.NONE}),t.activeTarget=null,r.updateMipmaps()}copyDepth(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.depthStencilTexture)return;const a=t.view3d._graph._texture(e,t),i=t.activeViewport;this.renderer.renderTarget.copyDepthTexture(r,a,{x:i.x,y:i.y},{width:i.width,height:i.height},{x:0,y:0})}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;e._ensureInitialized(this.renderer);const t=Q(e,this.renderer);this._managedViews.track(e);const r=e.environment;if(r&&(this._brdfLutTexture||=It({renderer:this.renderer,size:512}),t.globalBindGroup.setResource(this._brdfLutTexture.source,2),r instanceof Te)){const s=r.source.uid;this._iblEnvironmentMap[s]||(this._iblEnvironmentMap[s]=$t({renderer:this.renderer,sourceTexture:r,size:256,sampleCount:1024})),t.globalBindGroup.setResource(this._iblEnvironmentMap[s].source,1),t.globalUniformGroup.uniforms.uEnvironmentMaxMipLevel=this._iblEnvironmentMap[s].source.mipLevelCount-1}const a=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const i={view3d:e,lights:a,defaultTarget:this.renderer.renderTarget.renderTarget,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,globalUniformGroup:t.globalUniformGroup,renderer:this.renderer};Lt(e,this,i)&&(t.globalBindGroup.setResource(e._bonePit.texture.source,5),t.globalBindGroup.setResource(this._morphStoreBuffer.texture.source,8),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.texture.source,9),this.atlasPool.update(),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),Et(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer)&&e._invalidateDrawCaches(),t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,3),this.prepareView(i),e._graph.run(i))}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const e in this._iblEnvironmentMap)this._iblEnvironmentMap[e].destroy(!0);this._iblEnvironmentMap={},this.materialStoreBuffer.destroy(),this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearState=null}}prepareView(e){const{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){const{fog:t}=e,r=Q(e,this.renderer),a=r.globalUniformGroup.uniforms;if(a.uTime=performance.now()/1e3,a.uExposure=e.exposure,t){be.setValue(t.color??jr),J(a.uFogColor,0,be,e.exposure);const i=a.uFogParams;i[0]=t.near||0,i[1]=t.far||99999999,i[2]=t.density||0}r.globalUniformGroup.update()}};et.add(mr,Or,zr);
