import{m as Ie,T as w,o as $e,p as L,w as $,q as ge,s as xe,R as Le,t as Re,v as be,M as U,V as ve,B as we,x as ke,y as Ee,E as ee,z as te,A as ye,H as J,I as Se,J as Ae,N as Te,G as Fe,S as Y,K as re,L as Oe,O as Ue,P as je,Q as Ve,W as Ne,X as ze,Y as We,Z as He,_ as Ye,$ as Ke,a0 as qe,a as Xe,a1 as Je,a2 as Ze,a3 as Qe,l as et}from"./index-D7XEfyLx.js";import{S as _e,a as tt,C as rt,e as at,c as ot,b as st,g as nt,d as ae,L as it,V as lt,H as ct,t as ut,r as Be,f as dt,h as ht,i as ft,j as pt,k as mt,n as gt,v as xt,l as bt,m as vt,o as wt,p as yt,q as St,s as Tt,u as _t,M as Bt,w as Dt,G as Gt,x as Mt,y as Pt,z as Ct,A as It,B as $t,D as Lt,E as Rt,F as kt}from"./View3DGCRegistry-unG8S5rj.js";import"./RenderTexture-BXTuJh7W.js";const Et=4;var At=class{data;_source;_texture;_capacity=0;constructor(e=256){this.ensureCapacity(e)}get texture(){return this._texture}get capacity(){return this._capacity}ensureCapacity(e){if(e<=this._capacity)return;let t=Math.max(256,this._capacity);for(;t<e;)t*=2;this._capacity=t;const r=Math.min(t,$e),a=Math.ceil(t/r);if(this.data=new Float32Array(r*a*Et),!this._source){this._source=new Ie({resource:this.data,width:r,height:a,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha",label:"InstanceIndex"}),this._texture=new w({source:this._source});return}this._source.resource=this.data,(this._source.width!==r||this._source.height!==a)&&this._source.resize(r,a)}upload(){this._source.update()}unload(){this._source?.unload()}destroy(){this._texture&&(this._texture.destroy(!0),this._texture=null,this._source=null,this.data=null)}};function De(e){const t=e?" * 2":"";return{name:e?"morphTargetNormalGl":"morphTargetGl",bindings:{global:{uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        vec4 fetchMorphTexel(int texel) {
          return texelFetch(uMorphTexture, ${L("texel")}, 0);
        }

        float fetchMorphWeight(int index) {
          return fetchMorphTexel(index >> 2)[index & 3];
        }

        // Row texel 1 of the geometry data store: (deltaBase, targetCount,
        // baseVertex, spare) as u32 bit patterns in an f32 texture.
        vec4 fetchGeometryMorphFacts(int geometryIndex) {
          int texel = geometryIndex * 2 + 1;
          return texelFetch(uGeometryTexture, ${L("texel")}, 0);
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
      `}}}}const Ft=De(!1),Ot=De(!0);function z(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function Ut(e){const t=e.some(([n,i])=>n!==0||i!==0),r=([n,i])=>n===0&&i===0?"uv":`uv + vec2(${z(n)}, ${z(i)}) * texelSize`,a=["      float currentDepth = depth - params.x;"];if(t&&a.push("      float texelSize = 1.0 / params.z;"),a.push("      float fl = float(layer);",""),e.length===1)a.push(`      return texture(uShadowMap, vec4(${r(e[0])}, fl, currentDepth));`);else{const n=e.map(i=>`        texture(uShadowMap, vec4(${r(i)}, fl, currentDepth))`).join(` +
`);a.push(`      float shadow =
${n};`,"",`      return shadow / ${z(e.length)};`)}return a.join(`
`)}function K(e){return{name:`shadowGl:${e}`,structs:{ShadowData:_e},bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowData:"array<vec4<f32>, 96>"}},gl:{header:`

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

${Ut(tt[e])}
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

      float band = max((splitFar - splitNear) * ${z(rt)}, 1e-4);
      float blend = clamp((viewDepth - splitFar + band) / band, 0.0, 1.0);

      if (blend <= 0.0) {
        return shadow;
      }

      ShadowData nd = getShadowData(idx + 1);
      float next = sampleShadowLayer(idx + 1, nd.lightSpaceMatrix, worldPos, normal, nd.shadowParams.xyz, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const jt={hard:K("hard"),pcf:K("pcf"),"pcf-high":K("pcf-high")},q={name:"skinningGl",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},bindings:{global:{uBonePitTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        // Three rows of four, not a mat4: a bone matrix is affine, so its fourth row is
        // always (0, 0, 0, 1). Twelve floats instead of sixteen is three texels instead of
        // four, and blending rows is a quarter less work than blending mat4s.
        void getBoneRows(uint jointIndex, uint bonePitIndex, out vec4 r0, out vec4 r1, out vec4 r2) {
          int baseTexel = int(bonePitIndex + jointIndex) * 3;

          r0 = texelFetch(uBonePitTexture, ${L("baseTexel")}, 0);
          r1 = texelFetch(uBonePitTexture, ${L("baseTexel + 1")}, 0);
          r2 = texelFetch(uBonePitTexture, ${L("baseTexel + 2")}, 0);
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
      `}}},Vt={float32:"float",float32x2:"vec2",float32x3:"vec3",float32x4:"vec4",sint32:"int",sint32x2:"ivec2",sint32x3:"ivec3",sint32x4:"ivec4",uint32:"uint",uint32x2:"uvec2",uint32x3:"uvec3",uint32x4:"uvec4",float16x2:"vec2",float16x4:"vec4",unorm8x2:"vec2",unorm8x4:"vec4",snorm8x2:"vec2",snorm8x4:"vec4",uint8x2:"uvec2",uint8x4:"uvec4",sint8x2:"ivec2",sint8x4:"ivec4",unorm16x2:"vec2",unorm16x4:"vec4",snorm16x2:"vec2",snorm16x4:"vec4",uint16x2:"uvec2",uint16x4:"uvec4",sint16x2:"ivec2",sint16x4:"ivec4"};function Nt(e){const t=Vt[e];return t||($(`[compileAttributesGlsl] Unknown vertex format: "${e}"`),"vec4")}function zt(e,t,r){$(`[compileAttributesGlsl] Attribute "${e}" redefined with different format: "${r}" → "${t}". Keeping original.`)}function Wt(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const s of e)if(s.attributes)for(const[o,c]of Object.entries(s.attributes))a.has(o)?a.get(o)!==c&&zt(o,c,a.get(o)):a.set(o,c);const n=[];let i=0;for(const[s,o]of a){const c=Nt(o);r?n.push(`layout(location = ${i++}) in ${c} ${s};`):n.push(`in ${c} ${s};`)}return n.join(`
`)}const Ht={collectData(e){e.stage==="vertex"&&!e.data.attributes&&(e.data.attributes=Wt(e.bits,{useLocations:e.glslOptions?.useLocations}))},injectCode(e){return e.stage==="vertex"?{header:e.data.attributes}:{}}},Z={f32:"float",i32:"int",u32:"uint",bool:"bool","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4","mat2x2<f32>":"mat2","mat3x3<f32>":"mat3","mat4x4<f32>":"mat4","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","texture_2d<f32>":"sampler2D","texture_2d_array<f32>":"sampler2DArray","texture_3d<f32>":"sampler3D","texture_cube<f32>":"samplerCube",texture_depth_2d:"sampler2DShadow",texture_depth_2d_array:"sampler2DArrayShadow",texture_depth_cube:"samplerCubeShadow",texture_depth_cube_array:"samplerCubeArrayShadow",sampler:"",sampler_comparison:""};function Yt(e){const t=e.match(/^array<(.+),\s*(\d+)>$/);return t?{baseType:t[1],size:t[2]}:null}function Kt(e){const t=Yt(e);if(t){const a=Z[t.baseType]??t.baseType;return a?{glslType:a,arraySize:t.size}:null}const r=Z[e];return r!==void 0?r||null:e}const qt=new Set(["sampler2D","sampler2DArray","sampler3D","samplerCube","sampler2DShadow","sampler2DArrayShadow","samplerCubeShadow","samplerCubeArrayShadow"]);function Xt(e){const t=Z[e];return t!==void 0&&t||e}function oe(e,t,r){$(`[compileBindingsGlsl] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Jt(e,t,r={}){const a=new Set(r.uboGroups??[]),n=new Set(t.bindGroups),i=Object.create(null);for(const l of t.bindGroups)i[l]={uniforms:Object.create(null),resources:Object.create(null),bindAsUniform:!1};const s=Object.create(null);for(const l of e)if(l.structs)for(const[u,d]of Object.entries(l.structs))u in s||(s[u]=d);for(const l of e)if(l.bindings)for(const[u,d]of Object.entries(l.bindings)){if(!d)continue;const h=u.charAt(0).toUpperCase()+u.slice(1),f=n.has(u);for(const[m,p]of Object.entries(d)){const g=ge(p);if(xe(g))continue;const x=Kt(g);if(!x)continue;const B=typeof x=="object",b=B?x.glslType:x,P=B?x.arraySize:void 0;if(qt.has(b)){if(f){const v=i[u].resources;m in v?v[m]!==b&&oe(m,b,v[m]):v[m]=b}}else{if(f){const T=i[u].uniforms;m in T||(T[m]={glslType:b,arraySize:P}),i[u].bindAsUniform=!0}h in s||(s[h]={});const v=s[h];v[m]&&v[m]!==g?oe(m,g,v[m]):v[m]=g}}}const o=[];for(const l in s){const u=l.charAt(0).toLowerCase()+l.slice(1);if(n.has(u)&&i[u]?.bindAsUniform)continue;const d=s[l];o.push(`struct ${l} {`);for(const[h,f]of Object.entries(d))o.push(`  ${Xt(f)} ${h};`);o.push("};")}const c=(l,u)=>u.arraySize?`${u.glslType} ${l}[${u.arraySize}]`:`${u.glslType} ${l}`;for(const l of t.bindGroups){const u=i[l],d=Object.keys(u.uniforms);if(d.length>0)if(a.has(l)){o.push(`layout(std140) uniform ${l} {`);for(const h of d)o.push(`  ${c(h,u.uniforms[h])};`);o.push("};")}else for(const h of d)o.push(`uniform ${c(h,u.uniforms[h])};`);for(const h in u.resources)o.push(`uniform ${u.resources[h]} ${h};`)}return{source:o.join(`
`),structs:s}}const Zt={collectData(e){e.data.bindings||(e.data.bindings=Jt(e.bits,e.template,{uboGroups:e.glslOptions?.uboGroups}),e.data.structs=e.data.bindings.structs)},injectCode(e){return{header:e.data.bindings.source}}};function Qt(e,t){const r=Object.create(null);for(const n of t.bindGroups)r[n]={hasUniforms:!1,resources:Object.create(null),storages:Object.create(null)};for(const n of e)if(n.bindings)for(const[i,s]of Object.entries(n.bindings)){const o=r[i];if(!o){$(`[generateGroupMap] Bit "${n.name}" uses bind group "${i}" which is not in template.bindGroups. Valid groups: [${t.bindGroups.join(", ")}]. Bindings for this group will be ignored.`);continue}for(const[c,l]of Object.entries(s)){const u=ge(l);Le.has(u)?o.resources[c]=!0:xe(u)?o.storages[c]=!0:o.hasUniforms=!0}}const a={};return t.bindGroups.forEach((n,i)=>{const s=r[n],o={};let c=0;s.hasUniforms&&(o[c++]=n);for(const l in s.resources)o[c++]=l;for(const l in s.storages)o[c++]=l;a[i]=o}),a}const er={collectData(e){e.data.groupMap||(e.data.groupMap=Qt(e.bits,e.template))}},tr={collectData(e){e.data.headers||(e.data.headers=e.bits.map(t=>t.gl?.header).filter(t=>!!(t&&/\S/.test(t))))},injectCode(e){return{header:e.data.headers.join(`
`)}}},rr={f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4"},ar=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function se(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function ne(e){const t=rr[e];return t||($(`[compileInterStageGlsl] Unknown inter-stage type: "${e}"`),"vec4")}function or(e,t,r){$(`[compileInterStageGlsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function sr(e,t={}){const{useLocations:r=!0}=t,a=new Map;for(const o of e)if(o.interStage)for(const[c,l]of Object.entries(o.interStage))ar.has(c)||(a.has(c)?a.get(c)!==l&&or(c,l,a.get(c)):a.set(c,l));const n=[];let i=0;for(const[o,c]of a){const l=ne(c),u=se(c)?"flat ":"";r?n.push(`layout(location = ${i++}) ${u}out ${l} ${o};`):n.push(`${u}out ${l} ${o};`)}const s=[];i=0;for(const[o,c]of a){const l=ne(c),u=se(c)?"flat ":"";r?s.push(`layout(location = ${i++}) ${u}in ${l} ${o};`):s.push(`${u}in ${l} ${o};`)}return{vertex:n.join(`
`),fragment:s.join(`
`)}}const nr={collectData(e){e.data.interStage||(e.data.interStage=sr(e.bits,{useLocations:e.glslOptions?.useLocations}))},injectCode(e){const t=e.data.interStage;return{header:e.stage==="vertex"?t.vertex:t.fragment}}},ir={collectData(e){e.data.overrides=ot(e.bits)},injectCode(e){const t=e.glslOptions?.overrides??{};return{header:at(e.data.overrides,t)}}},lr=/\{\{(.*?)\}\}/g;function cr(e){const t=new Set;for(const r of Object.values(e))for(const a of r)if(a)for(const n of a.matchAll(lr))t.add(n[1]);return t}function ur(e,t,r){const a=nt(e),n=cr(t);for(const[i,s]of Object.entries(t))s.some(o=>o&&/\S/.test(o))&&!a.has(i)&&!n.has(i)&&$(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} generated code for slot {{${i}}} but template doesn't have it.`)}const dr={injectCode(e){if(!e.stage)return{};const t=st(e.bits,"gl",e.stage),r={};for(const[n,i]of Object.entries(t))r[n]=i.join(`
`);const a={};for(const[n,i]of Object.entries(r))a[n]=[i];return ur(e.templateString,a,e.stage),r}},ie="xyzw";function hr(e,t,r){const a=`u${e}Storage`,n=Re(t),i=new Map;for(const o of n.elements){const c=Math.floor(o.offset/16),l=o.offset%16/4;i.has(c)||i.set(c,[]),i.get(c).push({name:o.name,componentStart:l,components:o.components})}const s=[];s.push("/**"),s.push(` * Auto-generated from ${e} struct bindings.`),s.push(` * Reads properties from u${e}Storage data texture and returns a`),s.push(" * populated struct — use result.fieldName to access values."),s.push(" * Do not edit manually; regenerated during shader compilation."),s.push(" */"),s.push(`${e} get${e}(uint index) {`),s.push("  int mi = int(index);"),s.push(`  int base = mi * ${r};`),s.push(`  ${e} m;`);for(const[o,c]of i){s.push(`  vec4 t${o} = texelFetch(${a}, ${L(`base + ${o}`)}, 0);`);for(const l of c)if(l.components===4)s.push(`  m.${l.name} = t${o};`);else if(l.components===3)s.push(`  m.${l.name} = t${o}.xyz;`);else if(l.components===2){const u=ie.slice(l.componentStart,l.componentStart+2);s.push(`  m.${l.name} = t${o}.${u};`)}else{const u=ie[l.componentStart];s.push(`  m.${l.name} = t${o}.${u};`)}}return s.push("  return m;"),s.push("}"),s.join(`
`)}const fr={injectCode(e){const t=e.data.structs;if(!t)return{};const r=16,a=[],n=new Set(e.template.bindGroups);for(const[i,s]of Object.entries(t)){const o=i.charAt(0).toLowerCase()+i.slice(1);if(n.has(o))continue;const c=`u${i}Storage`;let l=!1;for(const u of e.bits)if(u.bindings){for(const d of Object.values(u.bindings))if(c in d){l=!0;break}if(l)break}l&&a.push(hr(i,s,r))}return a.length===0?{}:{header:a.join(`

`)}}};function le(e,t,r){t&&/\S/.test(t)&&!e.includes("{{header}}")&&$(`[compileShader] ${r==="vertex"?"Vertex":"Fragment"} template missing {{header}} slot - bindings, attributes, and inter-stage variables will not be injected.`)}function X(e){const{bits:t,template:r,extraPlugins:a,...n}=e,i=[er,ir,Zt,fr,nr,Ht,tr,dr],s=a?[...a,...i]:i,o={bits:t,template:r,templateString:r.gl.vertex,data:{},stage:"vertex",glslOptions:n},c=ae(o,s);le(r.gl.vertex,o.data.headers.join(""),"vertex");const l={bits:t,template:r,templateString:r.gl.fragment,data:o.data,stage:"fragment",glslOptions:n},u=ae(l,s);return le(r.gl.fragment,l.data.headers.join(""),"fragment"),{vertex:c,fragment:u,structs:l.data.structs??{},groupMap:l.data.groupMap}}const N={name:"globalGl",structs:{Light:it,ShadowData:_e},bindings:{global:{uGlobalLightParams:"vec4<f32>",uCameraPosition:"vec3<f32>",uTime:"f32",uViewMatrix:"mat4x4<f32>",uProjectionMatrix:"mat4x4<f32>",uBatchWorldMatrix:"mat4x4<f32>",uFogColor:"vec3<f32>",uFogParams:"vec3<f32>",uExposure:"f32",uViewportUVScale:"vec2<f32>",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uLightData:"array<vec4<f32>, 128>",uShadowData:"array<vec4<f32>, 96>",uEnvironmentMaxMipLevel:"f32",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<f32>",uShadowMap:"texture_depth_2d_array",uBonePitTexture:"texture_2d<f32>",uOpaqueDepthTexture:"texture_2d<f32>",uOpaqueColorTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}},gl:{header:`
const float LIGHT_DIRECTIONAL = 0.0;
const float LIGHT_POINT = 1.0;
const float LIGHT_SPOT = 2.0;
`}};function W(e,t){let r=e._gpuData[t.uid];if(!r){const a=new be({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uCameraPosition:{value:new ve,type:"vec3<f32>"},uTime:{value:0,type:"f32"},uViewMatrix:{value:new U,type:"mat4x4<f32>"},uProjectionMatrix:{value:new U,type:"mat4x4<f32>"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uViewportUVScale:{value:new Float32Array([1,1]),type:"vec2<f32>"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"},uBatchWorldMatrix:{value:new U,type:"mat4x4<f32>"},uLightData:{value:new Float32Array(512),type:"vec4<f32>",size:128},uEnvironmentMaxMipLevel:{value:0,type:"f32"},uShadowData:{value:new Float32Array(384),type:"vec4<f32>",size:96}});a.isStatic=!0,a.ubo=!1;const n=new we({0:a,1:Ee.source,2:w.EMPTY.source,3:w.EMPTY.source,4:ke.source,5:w.EMPTY.source,6:w.EMPTY.source,7:w.EMPTY.source,8:w.EMPTY.source,9:w.EMPTY.source,10:w.EMPTY.source,11:w.EMPTY.source});r=new lt(a,n),e._gpuData[t.uid]=r}return r}const ce=new Se;var pr=class{static extension={type:[ee.WebGLSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[te.SHADOW];r?.beginFrame(e);const a=W(e,this._renderer).globalUniformGroup.uniforms,n=a.uGlobalLightParams;n[0]=0,n[1]=0,n[2]=0;const i=e.environment;if(i!==null&&!(i instanceof ye)){const o=i.intensity??1,c=a.uHemisphereSky,l=a.uHemisphereGround,u=a.uHemisphereUp;J(c,0,ce.setValue(i.skyColor),o),J(l,0,ce.setValue(i.groundColor),o);const d=i.up??ct,h=d.x*d.x+d.y*d.y+d.z*d.z,f=h>0?1/Math.sqrt(h):0;u[0]=d.x*f,u[1]=d.y*f,u[2]=d.z*f}e._lightDataBuffer.reset();let s=0;for(let o=0;o<t.length;o++){const c=t[o];if(c.worldVisible){if(c.type==="ambient"){Ae(n,0,c.color,c.intensity);continue}s>=32||(r?.prepareShadow(c,e),e._lightDataBuffer.add(c),s++)}}n[3]=s,a.uLightData.set(e._lightDataBuffer.data.subarray(0,s*16),0)}};const ue={atlas:null,indexCount:void 0,firstIndex:void 0};if(w.EMPTY.source.uid!==0)throw new Error("Texture.EMPTY.source.uid is not 0");if(w.WHITE.source.uid!==1)throw new Error("Texture.WHITE.source.uid is not 1");if(Te.source.uid!==2)throw new Error("NORMAL_MAP.source.uid is not 2");let Q=0;const mr=new Float32Array(24);var gr=class{_sources=Array.from({length:10});_lastSlotCount=0;build(e){const{renderables:t,list:r,globalBindGroup:a,passBit:n,skipTextureBatching:i}=e,s=t.count;if(s===0)return 0;const o=r.commandList;o.clear(),this._ensureCapacity(r,s);const c=t.indices,l=t.items,u=r.glData,d=u.indexStaging,h=this._sources;let f=0,m=0,p=l[c[0]],g=p._passCache[n],x=g.shader,B=g.batchKey,b=p.geometry,P=g.state,v=g.topology,T=b._geometryAtlasAllocation||ue,G=T.atlas?T.atlas.geometry:b,R=T.firstIndex,M=T.indexCount,y=Q+=2,S=0,k=null,F=0;{const _=this._packTextures(p.material,h,y);S=this._lastSlotCount,this._writeIndex(d,0,p,_),k=p.material,F=_}for(let _=1;_<s;_++){p=l[c[_]],g=p._passCache[n];const V=g.batchKey!==B;if(!V){const C=p.material;if(C===k){this._writeIndex(d,_,p,F);continue}const I=C._textures,E=y+1;let j=0;for(let D=0;D<I.length;D++){const A=I[D].source;A.uid>2&&A._batchTick<y&&(A._batchTick=E,j++)}if(S+j<=10){const D=this._commitTextures(I,h,y);S=this._lastSlotCount,k=C,F=D,this._writeIndex(d,_,p,D);continue}}if(this._recordCommand(o,r.drawData,a,x,P,G,R,M,f,_-f,v),f=_,x=g.shader,B=g.batchKey,b=p.geometry,P=g.state,v=g.topology,T=b._geometryAtlasAllocation||ue,G=T.atlas?T.atlas.geometry:b,R=T.firstIndex,M=T.indexCount,V){const C=p.material;if(C===k){this._writeIndex(d,_,p,F);continue}const I=C._textures,E=y+1;let j=0;for(let D=0;D<I.length;D++){const A=I[D].source;A.uid>2&&A._batchTick<y&&(A._batchTick=E,j++)}if(S+j<=10){const D=this._commitTextures(I,h,y);S=this._lastSlotCount,k=C,F=D,this._writeIndex(d,_,p,D);continue}}if(!i){const C=o.nextBatchBindGroup(h,S),I=o.commands;for(let E=m;E<o.count;E++)I[E].batchBindGroup=C;m=o.count}y=Q+=2,S=0,k=null;const O=this._packTextures(p.material,h,y);S=this._lastSlotCount,this._writeIndex(d,_,p,O),k=p.material,F=O}if(this._recordCommand(o,r.drawData,a,x,P,G,R,M,f,s-f,v),!i){const _=o.nextBatchBindGroup(h,S),V=o.commands;for(let O=m;O<o.count;O++)V[O].batchBindGroup=_}return o.endBuild(),u.usedSlots=s,r.glData.lastVisibilityDirtyId=-1,s}draw(e,t,r,a){const n=t.glData.indexTexture;if(!n)return;const i=a!==null&&t._cullProducer==="cpu";(i||t.glData.lastVisibilityDirtyId!==r._visibilityDirtyId)&&this._compact(t,r,i?a:null,n);const s=e.gl,o=e.shader,c=e.geometry,l=e.state,u=t.commandList,d=u.count,h=t.drawData.drawCalls;for(let f=0;f<d;f++){const m=f*5;if(h[m+1]===0)continue;const p=u.commands[f];p.shader.groups[0]=p.globalBindGroup,p.batchBindGroup&&(p.shader.groups[1]=p.batchBindGroup),o.bind(p.shader),c.bind(p.geometry,o._activeProgram),p.state&&l.set(p.state);const g=o._getProgramData(o._activeProgram).uniformData.uInstanceBase?.location;g!==void 0&&s.uniform1i(g,h[m+4]),c.draw(p.topology,h[m],h[m+2],h[m+1])}}_compact(e,t,r,a){const n=e.glData,i=e.commandList.count,s=e.drawData.drawCalls,o=n.usedSlots,c=e.view.items,l=e.view.indices,u=n.indexStaging,d=a.data,h=r!==null?ut(r.planesData,t.storeBuffer.data):null,f=h??mr;for(let m=0;m<i;m++){const p=s[m*5+4],g=m+1<i?s[(m+1)*5+4]:o;let x=p;for(let B=p;B<g;B++){const b=c[l[B]];if(b.worldVisible===0)continue;if(h!==null){const T=b.boundingSphere,G=T.radius;if(G>=0){const R=T.center,M=R.x,y=R.y,S=R.z;if(f[0]*M+f[1]*y+f[2]*S+f[3]<-G||f[4]*M+f[5]*y+f[6]*S+f[7]<-G||f[8]*M+f[9]*y+f[10]*S+f[11]<-G||f[12]*M+f[13]*y+f[14]*S+f[15]<-G||f[16]*M+f[17]*y+f[18]*S+f[19]<-G||f[20]*M+f[21]*y+f[22]*S+f[23]<-G)continue}}const P=x*4,v=B*4;d[P]=u[v],d[P+1]=u[v+1],d[P+2]=u[v+2],x++}s[m*5+1]=x-p}a.upload(),e.glData.lastVisibilityDirtyId=t._visibilityDirtyId}_ensureCapacity(e,t){const r=e.glData,a=r.indexTexture??=new At(Math.max(256,t));a.ensureCapacity(t),(!r.indexStaging||r.indexStaging.length<a.data.length)&&(r.indexStaging=new Float32Array(a.data.length))}_recordCommand(e,t,r,a,n,i,s,o,c,l,u){const d=e.next();d.geometry=i,d.shader=a,d.globalBindGroup=r,d.state=n,d.topology=u,e.captureGeometry(i);const h=(e.count-1)*5,f=t.ensureCapacity(e.count);f[h]=o||i.indexCount||i.indexBuffer.data.length,f[h+1]=l,f[h+2]=s||0,f[h+3]=0,f[h+4]=c}_writeIndex(e,t,r,a){const n=t*4;e[n]=r._storeIndex,e[n+1]=a&65535,e[n+2]=a>>>16&65535}_packTextures(e,t,r){const a=e._textures;let n=0,i=0;for(let s=0;s<a.length;s++){const o=a[s].source,c=o.uid;let l;c<=2?l=13+c:o._batchTick===r?l=o._batchSlot:(o._batchTick=r,o._batchSlot=i,t[i]=o,l=i,i++),n|=l<<s*4}return this._lastSlotCount=i,n}_commitTextures(e,t,r){let a=0,n=this._lastSlotCount;for(let i=0;i<e.length;i++){const s=e[i].source,o=s.uid;let c;o<=2?c=13+o:s._batchTick===r?c=s._batchSlot:(s._batchTick=r,s._batchSlot=n,t[n]=s,c=n,n++),a|=c<<i*4}return this._lastSlotCount=n,a}};Fe.register({clear(){Q=0}});function de(e){const{pipe:t,bit:r,session:a,alwaysRebuild:n,sortBatch:i,skipTextureBatching:s}=e,{view3d:o}=a,c=t.renderer.material3d.batcher,l=o._gpuData[t.renderer.uid];for(const u of o._meshBatches){if(!u.renderData.worldVisible)continue;const d=u.drawLists[r];if(!d)continue;const h=d.view;h.count!==0&&((n||d.isDrawStale(h.count))&&(d.claimDrawBuilt(h.count),d._cullProducer=Be(o.cull,!1,h.count),i?i(h,u):h.sort(),c.build({renderables:h,list:d,globalBindGroup:a.globalBindGroup,passBit:r,skipTextureBatching:s})),l.globalUniformGroup.uniforms.uBatchWorldMatrix=u.renderData.worldTransform,l.globalUniformGroup.update(),a.globalBindGroup.setResource(u.storeBuffer.texture.source,10),d.glData.indexTexture&&a.globalBindGroup.setResource(d.glData.indexTexture.texture.source,11),c.draw(t.renderer,d,u,o.cullFrustum??o.camera.frustum))}}const xr={injectCode(e){const t=e.data.structs?.Material;return!t||Object.keys(t).length===0?{}:{materialAccess:"Material material = getMaterial(vMaterialIndex);"}}},br=6,vr=["x","y","z","w"],H=e=>({texel:e>>2,component:vr[e&3]}),he=H(16),wr=H(18),fe=H(20),yr=H(17);function Ge(e){return{name:e?"instanceFetchMaterial":"instanceFetch",bindings:{global:{uMeshStoreTexture:"texture_2d<f32>",uRenderInstanceTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
      uniform int uInstanceBase;

      vec4 fetchStoreTexel(int texel) {
        return texelFetch(uMeshStoreTexture, ${L("texel")}, 0);
      }
      `,input:`
      int instanceSlot = uInstanceBase + gl_InstanceID;
      vec4 renderInstance = texelFetch(uRenderInstanceTexture, ${L("instanceSlot")}, 0);

      int storeTexel = int(renderInstance.x) * ${br};

      modelMatrix = uBatchWorldMatrix * mat4(
        fetchStoreTexel(storeTexel),
        fetchStoreTexel(storeTexel + 1),
        fetchStoreTexel(storeTexel + 2),
        fetchStoreTexel(storeTexel + 3));

      // One fetch serves three consumers: the bone pit index skinningBitGl reads,
      // the geometry row morphTargetBitGl reads, and this instance's material.
      vec4 indexLanes = fetchStoreTexel(storeTexel + ${he.texel});
      float bonePitIndex = float(floatBitsToUint(indexLanes.${he.component}));
      vec2 morphData = vec2(
        float(floatBitsToUint(fetchStoreTexel(storeTexel + ${fe.texel}).${fe.component})),
        float(int(floatBitsToUint(indexLanes.${wr.component}))));
      ${e?`vMaterialIndex = floatBitsToUint(indexLanes.${yr.component});
      // Recombined from two exact 16-bit halves — the raw u32's bit pattern can
      // be a NaN that a float texture fetch is allowed to canonicalise.
      vTextureSlots = (uint(renderInstance.z + 0.5) << 16) | uint(renderInstance.y + 0.5);`:""}
      `}}}}const Sr=Ge(!1),Tr=Ge(!0),Me=256,Pe=8,Ce=32,_r=256*Ce*Pe*Me,Br={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4},pe=new Map;let Dr=0;function Gr(e){let t=pe.get(e);return t===void 0&&(t=Dr++,pe.set(e,t)),t}function Mr(e,t,r){const a=((t.data*Ce+t._blendModeId)*Pe+Br[r])*Me+Gr(t.polygonOffset);return e*_r+a}const Pr=`
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
`,Cr={collectData(e){e.bits.some(t=>t.name==="batchTexturesBindings")||e.bits.unshift({name:"batchTexturesBindings",bindings:{batch:{uBatchTexture0:"texture_2d<f32>",uBatchTexture1:"texture_2d<f32>",uBatchTexture2:"texture_2d<f32>",uBatchTexture3:"texture_2d<f32>",uBatchTexture4:"texture_2d<f32>",uBatchTexture5:"texture_2d<f32>",uBatchTexture6:"texture_2d<f32>",uBatchTexture7:"texture_2d<f32>",uBatchTexture8:"texture_2d<f32>",uBatchTexture9:"texture_2d<f32>"}},gl:{header:Pr}})},injectCode(e){let t=0;const r=[],a=e.stage==="fragment";for(const n of e.bits)if(n.textures)for(const i of n.textures){const s=`sample${i[0].toUpperCase()}${i.slice(1)}`,o=t*4;r.push(`vec4 ${s}Direct(vec2 uv) {`,`  return sampleBatchTexture(vTextureSlots, ${o}u, uv, vec2(0.0), vec2(0.0));`,"}"),a&&r.push(`vec4 ${s}(vec2 uv) {`,`  return sampleBatchTexture(vTextureSlots, ${o}u, uv, dFdx(uv), dFdy(uv));`,"}"),t++}return{textureGetters:r.join(`
`)}}},Ir=new Ve({}),$r=`#version 300 es
precision highp float;
precision highp sampler2DArray;
precision highp sampler2DArrayShadow;

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
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

  // Stage 3 — modify worldPosition / gl_Position after the transform.
  {{afterTransform}}

  // Stage 4 — finalise locals before varying publish.
  {{end}}

  // Publish varyings once, after end-slot bits have finished mutating locals
  // (uvTransformBit -> uv, future bits may mutate worldNormal/uv/etc).
  vPosition = worldPosition.xyz;
  vNormal   = worldNormal;
  vUV       = uv;
}`,Lr=`#version 300 es
precision highp float;
precision highp sampler2DArray;
precision highp sampler2DArrayShadow;

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
}`,Rr={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32",vTextureSlots:"u32"}},kr={name:"materialStorageBindingGl",bindings:{global:{uMaterialStorage:"texture_2d<f32>"}}},Er={bindGroups:["global","batch","local"],gl:{vertex:$r,fragment:Lr}};var Ar=class{static extension={type:[ee.WebGLSystem],name:"material3d"};batcher=new gr;_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return Mr(r.shader.uid,r.state,r.topology)}compilePassShader(e,t){const r=X({bits:[N,...e],template:t,uboGroups:[],useLocations:!1});return Y.from({gl:r,groups:void 0,groupMap:r.groupMap})}compileIsolatedShader(e,t,r){const a=X({bits:e,template:t,useLocations:!1});return Y.from({gl:a,groups:r,groupMap:a.groupMap})}compileShader(e,t,r,a=!1,n={uboGroups:[],useLocations:!1}){const i=e.includeGlobal??!0,s=i?[N,...e.bitsGl]:[...e.bitsGl];let o=i?`${N.name}|${e.keyGl}`:e.keyGl;const c=dt(t.geometry.attributes.aPosition.format);re(c),s.push(c),o+=`|${c.name}`,t.morph&&(t.geometry.hasMorphNormals?(s.push(Ot),o+="|morphN"):(s.push(Ft),o+="|morph")),t.skeleton&&(re(q),s.push(q),o+=`|${q.name}`),a&&(Oe(s,t.material),Ue(s,t.material));let l=this._shaderCache.get(o);if(!l){const u=X({bits:s,template:e.template,extraPlugins:r,...n,overrides:e.overrides});l=Y.from({gl:u,groups:void 0,overrides:e.overrides,groupMap:u.groupMap}),this._shaderCache.set(o,l)}return l}ensureMaterial(e,t){const r=e.geometry,a=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(a);const n=a._passBit&te.MATERIAL_PASS_MASK,i=a._passes[n],s=a.getPrimaryDescriptor(t),o=[N,Rr,kr,Tr];r.attributes.aNormal&&o.push(yt),r.attributes.aUV&&o.push(ht(r.attributes.aUV.format)),a.doubleSided&&o.push(ft),a.flatShading&&o.push(pt);const c=a.textures.normal;c&&c!==Te&&r.attributes.aUV&&o.push(r.attributes.aTangent?mt:gt),r.attributes.aColor&&e.material.vertexColors&&o.push(xt);const l=e.material.lit;e.billboardMode!=="none"&&o.push(bt(e.billboardMode,l));const u=!!r.attributes.aTangent;for(let B=0;B<s.bitsGl.length;B++){const b=s.bitsGl[B];o.push(u?je(b):b)}const d=t._fogBit;d&&a.fog&&o.push(d);const h=t._toneMappingBit;e.material.toneMapped&&h&&o.push(h),l&&o.push(e.receiveShadow?jt[t.shadowFilter]:vt);const f=Ir.update({bitsGl:o,template:s.template??Er,overrides:{HAS_UVS:r.attributes.aUV?1:0,...s.overrides},includeGlobal:!1}),m=this.compileShader(f,e,[wt,xr,Cr],!0,{uboGroups:[],useLocations:!1}),p=i&&i.state||a.state,g=i&&i.topology||a.topology||r.topology,x=e._passCache[n];return x?(x.shader=m,x.state=p,x.topology=g):e._passCache[n]=new Ne(m,p,g),m}destroy(){if(!this._destroyed){this._destroyed=!0;for(const e of this._shaderCache.values())e.destroy();this._shaderCache.clear()}}};const Fr={name:"shadowGlobalGl",bindings:{global:{uViewProjectionMatrix:"mat4x4<f32>",uBatchWorldMatrix:"mat4x4<f32>",uBonePitTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<f32>"}}},Or={bindGroups:["global"],gl:{vertex:`#version 300 es
precision highp float;
precision highp sampler2D;

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
precision highp float;
precision highp sampler2D;
out vec4 fragColor;

{{header}}

void main() {
    fragColor = vec4(0.);
}`}};var Ur=class extends St{_shadowUniformGroup;_shadowBindGroup;constructor(e){const t=ze();t.depthTest=!0,t.culling=!0,t.clockwiseFrontFace=!0,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:te.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGl:[Fr,Sr],template:Or,includeGlobal:!1},state:t}});const r=new be({uViewProjectionMatrix:{value:new U,type:"mat4x4<f32>"},uBatchWorldMatrix:{value:new U,type:"mat4x4<f32>"}});r.isStatic=!0,r.ubo=!1,this._shadowUniformGroup=r,this._shadowBindGroup=new we({0:r,1:w.EMPTY.source,2:w.EMPTY.source,3:w.EMPTY.source,4:w.EMPTY.source,5:w.EMPTY.source})}_applyZRangeFix=!1;_cascadeSlot(e,t,r){const a=this.getShadowGPUData(e).cascades??=[];return a[t]??={vp:new U,bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}_commitCascadeMatrix(){}_uploadSlot(e,t,r){const a=W(r,this.pipe.renderer).globalUniformGroup.uniforms.uShadowData;We(e,a,t*24)}render(e){const{view3d:t,lights:r}=e;if(!r.find(l=>l.castShadow))return;this._bindShadowSource(t,this.renderTarget.depthStencilTexture),this.pipe.renderer.colorMask.setMask(0);const a=t._bonePit.texture.source,n=this.pipe.renderer.material3d.batcher,i=this._shadowBindGroup,s=this._shadowUniformGroup;i.setResource(a,1),i.setResource(this.pipe._morphStoreBuffer.texture.source,2),i.setResource(this.pipe.geometryDataStoreBuffer.texture.source,3);const o=t.cull!=="off",c=r.some(l=>l.castShadow&&l._gpuShadowData&&l._shadowDataIndex>=0);for(const l of t._meshBatches){if(!l.renderData.worldVisible)continue;const u=l.drawLists[this.bit];if(!u)continue;const d=u.view;if(d.count===0)continue;const h=u.isDrawStale(d.count);c&&h&&(u.claimDrawBuilt(d.count),d.sort(),n.build({renderables:d,list:u,globalBindGroup:i,passBit:this.bit,skipTextureBatching:!0})),u._cullProducer=o?Be(t.cull,!1,d.count):"off"}for(const l of r){if(!He(l))continue;const u=Ye(l);for(let d=0;d<u;d++){const h=this._cascadeSlot(l,d,t);if(!h.needsRender)continue;const f=o?this._cascadeCullFrustum(h):null;s.uniforms.uViewProjectionMatrix=h.vp,this.pipe.renderer.renderTarget.bind({target:this.renderTarget,clear:!0,layer:l._shadowDataIndex+d});for(const m of t._meshBatches){if(!m.renderData.worldVisible)continue;const p=m.drawLists[this.bit];!p||p.view.count===0||(s.uniforms.uBatchWorldMatrix=m.renderData.worldTransform,s.update(),i.setResource(m.storeBuffer.texture.source,4),p.glData.indexTexture&&i.setResource(p.glData.indexTexture.texture.source,5),n.draw(this.pipe.renderer,p,m,f))}}this._completeShadowUpdate(l)}this.pipe.renderer.colorMask.setMask(15),e.activeTarget=null}destroy(){this._destroyed||(this._shadowBindGroup.destroy(),super.destroy())}};const jr=13421772,me=new Se;var Vr=class{static extension={type:[ee.WebGLPipes],name:"view3d"};renderer;_brdfLutTexture;_destroyed=!1;_iblEnvironmentMap={};_physicalViewport=new Ke;_cameraPos=new ve;_sortForwardByDistance=(e,t)=>{t.isUserBatch?Tt(e,this._cameraPos,t.storeBuffer.data,t.renderData.worldTransform):_t(e,this._cameraPos)};materialStoreBuffer=new Bt;_morphStoreBuffer=new Dt;geometryDataStoreBuffer=new Gt;transientCache=new qe;globalSlots={opaqueColor:7,opaqueDepth:6,shadowMap:4};atlasPool=Mt.from({rebaseIndices:!0});_managedViews;constructor(e){this.renderer=e,this._managedViews=new Pt(e)}createShadowPass(e){return new Ur({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}prepareForward(e,t){}renderForward(e,t){const r=!Ct(e),a=e.textures===!1;if(e.sort==="distance"){t.view3d.camera.worldTransform.extractPosition(this._cameraPos),de({pipe:this,bit:e.bit,session:t,alwaysRebuild:r,sortBatch:this._sortForwardByDistance,skipTextureBatching:a});return}de({pipe:this,bit:e.bit,session:t,alwaysRebuild:r,skipTextureBatching:a})}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}_depthClearState=null;clearDepth(e){if(!this._depthClearState){const a=new Xe;a.depthMask=!0,a.depthTest=!1,a.culling=!1,a.blend=!1,this._depthClearState=a}const t=this.renderer.gl,r=e.physicalViewport;this.renderer.state.set(this._depthClearState),t.enable(t.SCISSOR_TEST),t.scissor(r.x,r.y,r.width,r.height),this.renderer.renderTarget.clear(e.defaultTarget,Je.DEPTH),t.disable(t.SCISSOR_TEST)}copyColor(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.colorTexture)return;this.renderer.backBuffer.useBackBuffer||$("[pixi-3d] A transmissive (glass) material is rendering with useBackBuffer off — refraction can't sample 2D content drawn behind the View3D (only the view's own 3D). If your glass refracts the page behind it, enable useBackBuffer in Application/renderer init.");const a=t.view3d._graph._texture(e,t),n=t.contentFrame;this.renderer.renderTarget.copyToTexture(r,a,{x:n.x,y:n.y},{width:n.width,height:n.height},{x:0,y:0})}generateMips(e,t){t.view3d._graph._texture(e,t).source.updateMipmaps()}copyDepth(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.depthStencilTexture)return;const a=t.view3d._graph._texture(e,t),n=t.contentFrame;this.renderer.renderTarget.copyDepthTexture(r,a,{x:n.x,y:n.y},{width:n.width,height:n.height},{x:0,y:0})}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;e._ensureInitialized(this.renderer);const t=W(e,this.renderer);this._managedViews.track(e),this._brdfLutTexture||=It({renderer:this.renderer,size:512}),t.globalBindGroup.setResource(this._brdfLutTexture.source,2);const r=e.environment,a=r instanceof ye?r:null;if(a){const c=a.source.uid;this._iblEnvironmentMap[c]||(this._iblEnvironmentMap[c]=$t({renderer:this.renderer,sourceTexture:a,size:256,sampleCount:1024})),t.globalBindGroup.setResource(this._iblEnvironmentMap[c].source,1),t.globalUniformGroup.uniforms.uEnvironmentMaxMipLevel=this._iblEnvironmentMap[c].source.mipLevelCount-1}const n=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const i=Lt(e,this);if(!i.logicalViewport)return;const s=i.logicalViewport;this.renderer.renderTarget.frontFaceInverted&&Rt(e.camera.projection),t.globalBindGroup.setResource(e._bonePit.texture.source,5),t.globalBindGroup.setResource(this._morphStoreBuffer.texture.source,8),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.texture.source,9),Ze(this._physicalViewport,s,this.renderer.renderTarget.renderTarget,this.renderer),this.renderer.lighting3d.update(e,n),this.updateGlobalUniforms(e),this.atlasPool.update(),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),kt(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer)&&e._invalidateDrawCaches(),t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,3);const o={view3d:e,logicalViewport:s,lights:n,defaultTarget:this.renderer.renderTarget.renderTarget,activeTarget:null,needsDepthClear:!0,physicalViewport:this._physicalViewport,contentFrame:this._physicalViewport,globalBindGroup:t.globalBindGroup,globalUniformGroup:t.globalUniformGroup,renderer:this.renderer};e._graph.resolve(o),e._graph.execute(o)}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const e in this._iblEnvironmentMap)this._iblEnvironmentMap[e].destroy(!0);this._iblEnvironmentMap={},this.transientCache.clear(),this.materialStoreBuffer.destroy(),this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearState=null}}updateGlobalUniforms(e){const{camera:t,fog:r}=e,a=W(e,this.renderer),n=a.globalUniformGroup.uniforms;t.worldTransform.extractPosition(n.uCameraPosition),n.uTime=performance.now()/1e3,n.uExposure=e.exposure,n.uViewMatrix=t.view,n.uProjectionMatrix=t.projection;const i=this._physicalViewport,s=this.renderer.renderTarget.renderTarget.colorTexture.source,o=Qe(i.width,i.height,s.pixelWidth,s.pixelHeight),c=n.uViewportUVScale;if(c[0]=i.width/o.width,c[1]=i.height/o.height,r){me.setValue(r.color??jr),J(n.uFogColor,0,me,e.exposure);const l=n.uFogParams;l[0]=r.near||0,l[1]=r.far||99999999,l[2]=r.density||0}a.globalUniformGroup.update()}};et.add(pr,Ar,Vr);
