import{T as te,N as Ie,G as Le,a4 as Xe,a5 as ke,h as H,w as F,q as Je,R as Ze,s as Qe,a6 as et,a7 as tt,a8 as rt,a9 as at,aa as we,t as st,ab as nt,E as K,v as Ee,M as re,V as Ve,ac as ie,B as Ae,ad as ot,x as it,y as ut,z as he,A as Oe,H as de,I as ze,J as ct,S as Z,K as Se,L as lt,O as dt,P as pt,Q as ft,W as ht,X as mt,Z as _e,_ as Be,ae as gt,$ as bt,a0 as xt,af as vt,a as yt,a2 as wt,a3 as St,l as _t}from"./index-DuaCFqMz.js";import{I as me,J as $e,a as Bt,C as Dt,K as ge,g as Fe,N as Tt,c as Ct,b as De,d as Gt,t as se,O as Pt,R as Ne,P as Ue,V as Mt,H as Rt,r as be,f as It,h as Lt,i as kt,j as Et,k as Vt,n as At,v as Ot,l as zt,m as $t,o as Ft,p as Nt,q as Ut,Q as jt,M as Wt,w as Ht,G as qt,x as Kt,y as Yt,z as Te,A as Xt,B as Jt,D as Zt,F as Qt,E as er}from"./View3DGCRegistry-B7zzYgMt.js";import"./RenderTexture-nNXFR8yS.js";const Ce={atlas:null,indexCount:void 0,firstIndex:void 0,baseVertex:void 0};let pe=0;if(te.EMPTY.source.uid!==0)throw new Error("Texture.EMPTY.source.uid is not 0");if(te.WHITE.source.uid!==1)throw new Error("Texture.WHITE.source.uid is not 1");if(Ie.source.uid!==2)throw new Error("NORMAL_MAP.source.uid is not 2");var tr=class{_sources=Array.from({length:10});render(e){const{renderables:t,globalBindGroup:r,instanceData:s,commandList:a,drawData:o,passBit:n,skipTextureBatching:i}=e,u=t.count;if(u===0)return;a.clear();const c=t.indices,l=t.items,b=s,f=this._sources;let h=0,m=0,g=l[c[0]],d=g._passCache[n],p=g.geometry._geometryAtlasAllocation||Ce,x=d.batchKey,w=p.atlas?p.atlas.geometry:g.geometry,v=d.shader,S=d.state,M=d.topology,B=pe+=2,C=0,R=null,D=0;D=this._packTextures(g.material,f,B),b[1]=D,C=this._lastSlotCount,R=g.material;for(let y=1;y<u;y++){g=l[c[y]],d=g._passCache[n];const T=d.batchKey,_=T!==x;if(!_){const G=g.material;if(G===R){b[y*2+1]=D;continue}const P=G._textures,I=B+1;let z=0;for(let L=0;L<P.length;L++){const k=P[L].source;k.uid>2&&k._batchTick<B&&(k._batchTick=I,z++)}if(C+z<=10){D=this._commitTextures(P,f,B),b[y*2+1]=D,C=this._lastSlotCount,R=G;continue}}const V=a.next();V.geometry=w,V.shader=v,V.globalBindGroup=r,V.batchBindGroup=void 0,V.state=S,V.topology=M,a.captureGeometry(w);const A=(a.count-1)*5,O=o.ensureCapacity(a.count);if(O[A]=p.indexCount||w.indexCount||w.indexBuffer.data.length,O[A+1]=y-h,O[A+2]=p.firstIndex||0,O[A+3]=p.baseVertex||0,O[A+4]=h,h=y,p=g.geometry._geometryAtlasAllocation||Ce,x=T,w=p.atlas?p.atlas.geometry:g.geometry,v=d.shader,S=d.state,M=d.topology,_){const G=g.material;if(G===R){b[y*2+1]=D;continue}const P=G._textures,I=B+1;let z=0;for(let L=0;L<P.length;L++){const k=P[L].source;k.uid>2&&k._batchTick<B&&(k._batchTick=I,z++)}if(C+z<=10){D=this._commitTextures(P,f,B),b[y*2+1]=D,C=this._lastSlotCount,R=G;continue}}if(!i){const G=a.nextBatchBindGroup(f,C),P=a.commands;for(let I=m;I<a.count;I++)P[I].batchBindGroup=G;m=a.count}B=pe+=2,C=0,R=null,D=this._packTextures(g.material,f,B),b[y*2+1]=D,C=this._lastSlotCount,R=g.material}{const y=a.next();y.geometry=w,y.shader=v,y.globalBindGroup=r,y.batchBindGroup=void 0,y.state=S,y.topology=M,a.captureGeometry(w);const T=(a.count-1)*5,_=o.ensureCapacity(a.count);_[T]=p.indexCount||w.indexCount||w.indexBuffer.data.length,_[T+1]=u-h,_[T+2]=p.firstIndex||0,_[T+3]=p.baseVertex||0,_[T+4]=h}if(!i){const y=a.nextBatchBindGroup(f,C),T=a.commands;for(let _=m;_<a.count;_++)T[_].batchBindGroup=y}a.endBuild()}_lastSlotCount=0;_packTextures(e,t,r){const s=e._textures;let a=0,o=0;for(let n=0;n<s.length;n++){const i=s[n].source,u=i.uid;let c;u<=2?c=13+u:i._batchTick===r?c=i._batchSlot:(i._batchTick=r,i._batchSlot=o,t[o]=i,c=o,o++),a|=c<<n*4}return this._lastSlotCount=o,a}_commitTextures(e,t,r){let s=0,a=this._lastSlotCount;for(let o=0;o<e.length;o++){const n=e[o].source,i=n.uid;let u;i<=2?u=13+i:n._batchTick===r?u=n._batchSlot:(n._batchTick=r,n._batchSlot=a,t[a]=n,u=a,a++),s|=u<<o*4}return this._lastSlotCount=a,s}};Le.register({clear(){pe=0}});const E=new Xe({buffer:new ke({data:new Int32Array(1),usage:H.STORAGE|H.COPY_DST|H.COPY_SRC,label:"EmptyBufferResource",shrinkToFit:!1})});function je(e){const t=e?8:4;return{name:e?"morphTargetNormal":"morphTarget",structs:{GeometryData:me},bindings:{global:{uMorphStorage:"storage<f32>",uGeometryStorage:"storage<GeometryData>"}},gpu:{vertex:{input:`
        if (renderable.morphWeightIndex != 0u) {
          let geometryData = uGeometryStorage[renderable.geometryDataIndex];
          let vidLocal = vid - geometryData.baseVertex;
          let morphDeltaBase = geometryData.morphDeltaBase + vidLocal * geometryData.morphTargetCount * ${t}u;
          var morphedPosition = position.xyz;${e?`
          var morphedNormal = normal;`:""}
          for (var morphIndex = 0u; morphIndex < geometryData.morphTargetCount; morphIndex = morphIndex + 1u) {
            // Parked dials are exactly 0 — skip the delta fetch. Weights are
            // per-instance, so the branch is wavefront-coherent: a scalar
            // compare at worst, most of the loop's bandwidth at best.
            let weight = uMorphStorage[renderable.morphWeightIndex + morphIndex];
            if (weight != 0.0) {
              let deltaOffset = morphDeltaBase + morphIndex * ${t}u;
              morphedPosition += vec3<f32>(
                uMorphStorage[deltaOffset],
                uMorphStorage[deltaOffset + 1u],
                uMorphStorage[deltaOffset + 2u],
              ) * weight;${e?`
              morphedNormal += vec3<f32>(
                uMorphStorage[deltaOffset + 4u],
                uMorphStorage[deltaOffset + 5u],
                uMorphStorage[deltaOffset + 6u],
              ) * weight;`:""}
            }
          }
          position = vec4<f32>(morphedPosition, position.w);${e?`
          normal = normalize(morphedNormal);`:""}
        }
      `}}}}const rr=je(!1),ar=je(!0);function Q(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function sr(e){const t=e.some(([s,a])=>s!==0||a!==0),r=[];return t&&r.push("      let texel = 1.0 / sp.z;"),e.forEach(([s,a],o)=>{const n=s===0&&a===0?"uv":`uv + vec2<f32>(${Q(s)}, ${Q(a)}) * texel`;r.push(`      ${o===0?"var s = ":"s += "}textureSampleCompareLevel(uShadowMap, uShadowSampler, ${n}, idx, d);`)}),r.push(e.length===1?"      return s;":`      return s / ${Q(e.length)};`),r.join(`
`)}function ue(e){return{name:`shadow:${e}`,structs:{ShadowData:$e},bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uShadowStorage:"storage<ShadowData>"}},gpu:{header:`
    fn sampleShadowAtIndex(
      idx: i32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32,
    ) -> f32 {
      let sd = uShadowStorage[idx];
      let sp = sd.shadowParams;

      // Normal offset, tapered by how obliquely the light strikes the surface.
      // Depth error across one shadow texel grows as the surface turns away from
      // the light, so a face-on surface needs almost none — and taking none is
      // what stops the offset eating short shadows.
      let biasedPos = worldPos + normal * (sp.y * (1.0 - NdotL));
      let lsp = sd.lightSpaceMatrix * vec4<f32>(biasedPos, 1.0);
      let proj = lsp.xyz / lsp.w;

      let uv = proj.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);

      if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0)) || proj.z < 0.0 || proj.z > 1.0) {
        return 1.0;
      }

      let d = proj.z - sp.x;

${sr(Bt[e])}
    }

    fn calculateShadow(
      light: Light,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32
    ) -> f32 {
      let baseIndex = i32(light.shadowDataIndex);

      if (baseIndex == -1) {
        return 1.0;
      }

      let last = i32(light.cascadeCount) - 1;

      // Not cascaded: one map, sampled directly.
      if (last < 1) {
        return sampleShadowAtIndex(baseIndex, worldPos, normal, NdotL);
      }

      let viewDepth = -(global.uViewMatrix * vec4<f32>(worldPos, 1.0)).z;
      let splits = uShadowStorage[baseIndex].cascadeSplits.xyz;

      // Splits are sorted ascending, so the cascade is the number of split
      // planes viewDepth is past, clamped to the light's cascade count.
      let crossed = step(splits, vec3<f32>(viewDepth));
      let cascadeIndex = i32(min(dot(crossed, vec3<f32>(1.0)), f32(last)));

      let shadow = sampleShadowAtIndex(baseIndex + cascadeIndex, worldPos, normal, NdotL);

      // The outermost cascade has nothing to fade into.
      if (cascadeIndex == last) {
        return shadow;
      }

      // This cascade's own near/far split, picked without indexing the vector.
      let hot = vec3<f32>(f32(cascadeIndex == 0), f32(cascadeIndex == 1), f32(cascadeIndex == 2));
      let splitFar = dot(splits, hot);
      let splitNear = dot(splits, vec3<f32>(hot.y, hot.z, 0.0));

      let band = max((splitFar - splitNear) * ${Q(Dt)}, 1e-4);
      let blend = saturate((viewDepth - splitFar + band) / band);

      if (blend <= 0.0) {
        return shadow;
      }

      let next = sampleShadowAtIndex(baseIndex + cascadeIndex + 1, worldPos, normal, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const nr={hard:ue("hard"),pcf:ue("pcf"),"pcf-high":ue("pcf-high")},ce={name:"skinning",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},structs:{BoneMatrix:ge},bindings:{global:{uBonePitStorage:"storage<BoneMatrix>"}},gpu:{vertex:{header:`
        // Three rows of four, not a mat4: a bone matrix is affine, so its fourth row is
        // always (0, 0, 0, 1). Twelve floats instead of sixteen, and blending rows is a
        // quarter less work than blending mat4s.
        fn getBoneRows(idx: u32, bonePitIndex: u32) -> mat3x4<f32> {
            return uBonePitStorage[(bonePitIndex) + idx].rows;
        }
      `,input:`
        var skinRows =
            getBoneRows(input.aJoints.x, renderable.bonePitIndex) * input.aWeights.x +
            getBoneRows(input.aJoints.y, renderable.bonePitIndex) * input.aWeights.y +
            getBoneRows(input.aJoints.z, renderable.bonePitIndex) * input.aWeights.z +
            getBoneRows(input.aJoints.w, renderable.bonePitIndex) * input.aWeights.w;

        // Row-major affine: a point transform is three dot products, and the w the mat4
        // form would compute is always 1. Directions use the rows' xyz, so the
        // translation column drops out.
        position = vec4<f32>(dot(skinRows[0], position), dot(skinRows[1], position), dot(skinRows[2], position), position.w);
        normal = vec3<f32>(dot(skinRows[0].xyz, normal), dot(skinRows[1].xyz, normal), dot(skinRows[2].xyz, normal));
        tangent = vec3<f32>(dot(skinRows[0].xyz, tangent), dot(skinRows[1].xyz, tangent), dot(skinRows[2].xyz, tangent));
      `}}};function or(e,t,r){F(`[collectAttributes] Attribute "${e}" redefined with different format: "${r}" → "${t}". Keeping original.`)}function ir(e){const t=Object.create(null);for(const r of e)if(r.attributes)for(const[s,a]of Object.entries(r.attributes))s in t?t[s]!==a&&or(s,a,t[s]):t[s]=a;return t}const ur={float32:"f32",float32x2:"vec2<f32>",float32x3:"vec3<f32>",float32x4:"vec4<f32>",sint32:"i32",sint32x2:"vec2<i32>",sint32x3:"vec3<i32>",sint32x4:"vec4<i32>",uint32:"u32",uint32x2:"vec2<u32>",uint32x3:"vec3<u32>",uint32x4:"vec4<u32>",float16x2:"vec2<f32>",float16x4:"vec4<f32>",unorm8x2:"vec2<f32>",unorm8x4:"vec4<f32>",snorm8x2:"vec2<f32>",snorm8x4:"vec4<f32>",uint8x2:"vec2<u32>",uint8x4:"vec4<u32>",sint8x2:"vec2<i32>",sint8x4:"vec4<i32>",unorm16x2:"vec2<f32>",unorm16x4:"vec4<f32>",snorm16x2:"vec2<f32>",snorm16x4:"vec4<f32>",uint16x2:"vec2<u32>",uint16x4:"vec4<u32>",sint16x2:"vec2<i32>",sint16x4:"vec4<i32>"};function cr(e){const t=ur[e];return t||(F(`[compileAttributesWgsl] Unknown vertex format: "${e}"`),"vec4<f32>")}function lr(e){const t=Object.keys(e);if(t.length===0)return"";const r=[];r.push("struct VertexInput {");let s=0;for(const a of t){const o=cr(e[a]);r.push(`  @location(${s++}) ${a}: ${o},`)}return r.push("}"),r.join(`
`)}const dr={collectData(e){e.data.attributes=ir(e.bits)},injectCode(e){return{header:lr(e.data.attributes)}}};function pr(e){return{groupIndex:e,bindingIndex:0,resources:Object.create(null),storages:Object.create(null),bindAsUniform:!1}}function Ge(e,t,r){F(`[compileBindingsWgsl] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function fr(e,t,r){F(`[compileBindingsWgsl] Bit "${e}" binding "${t}" has invalid storage type: "${r}". Expected format: storage<StructName>`)}const hr=new Set(["u32","i32","f32","f16","bool"]);function We(e){return e.charAt(0).toUpperCase()+e.slice(1)}function mr(e,t){const r=new Set(t.bindGroups),s=Object.create(null);t.bindGroups.forEach((o,n)=>{s[o]=pr(n)});const a=Object.create(null);for(const o of e)if(o.structs)for(const[n,i]of Object.entries(o.structs))n in a||(a[n]=i);for(const o of e)if(o.bindings)for(const[n,i]of Object.entries(o.bindings)){if(!i)continue;const u=We(n),c=r.has(n);for(const[l,b]of Object.entries(i)){const f=Je(b);if(Ze.has(f)){if(c){const h=s[n].resources;l in h?h[l]!==f&&Ge(l,f,h[l]):h[l]=f}}else if(Qe(f)){if(c){const h=et(f);if(!h){fr(o.name,l,f);continue}const m=s[n].storages;l in m||(m[l]=h)}}else{u in a||(a[u]={});const h=a[u];h[l]&&h[l]!==f?Ge(l,f,h[l]):h[l]=f,c&&(s[n].bindAsUniform=!0)}}}for(const o in s)for(const n in s[o].storages){const i=s[o].storages[n];!(i in a)&&!hr.has(i)&&(a[i]={})}return{structs:a,bindGroups:s,template:t}}function gr(e){const{bindGroups:t,template:r}=e,s=Object.create(null);for(const a of r.bindGroups){const o=t[a],n=[];let i=o.bindingIndex;o.bindAsUniform&&n.push({name:a,binding:i++,kind:"uniform",type:We(a)});for(const u in o.resources)n.push({name:u,binding:i++,kind:"resource",type:o.resources[u]});for(const u in o.storages)n.push({name:u,binding:i++,kind:"storage",type:o.storages[u]});s[a]={groupIndex:o.groupIndex,entries:n}}return s}function br(e){const{structs:t}=e,r=[];for(const a in t){const o=t[a];r.push(`struct ${a} {`);for(const[n,i]of Object.entries(o))r.push(`  ${n}: ${i},`);r.push("}")}const s=gr(e);for(const a of e.template.bindGroups){const{groupIndex:o,entries:n}=s[a];for(const i of n){const u=`@group(${o}) @binding(${i.binding})`;i.kind==="uniform"?r.push(`${u} var<uniform> ${i.name}: ${i.type};`):i.kind==="resource"?r.push(`${u} var ${i.name}: ${i.type};`):r.push(`${u} var<storage, read> ${i.name}: array<${i.type}>;`)}}return r.join(`
`)}const xr={collectData(e){e.data.bindings=mr(e.bits,e.template),e.data.structs=e.data.bindings.structs},injectCode(e){return{header:br(e.data.bindings)}}};function vr(e){return e.charAt(0).toUpperCase()+e.slice(1)}function ae(e,t){return`${e}${vr(t)}`}function yr(e){const t=Fe(e);for(const r of t)if(!(r==="header"||r==="textureGetters"||r.startsWith("vertex")||r.startsWith("fragment"))){const s=ae("vertex",r),a=ae("fragment",r);F(`[compileShader] Template slot {{${r}}} is not prefixed with "vertex" or "fragment". Did you mean {{${s}}} or {{${a}}}?`)}}const wr={collectData(e){yr(e.templateString),e.data.headers=e.bits.map(t=>t.gpu?.header).filter(t=>!!t?.trim())},injectCode(e){return{header:e.data.headers.join(`

`)}}},Sr=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function Pe(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function _r(e,t,r){F(`[compileInterStageWgsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Br(e){const t=Object.create(null);for(const r of e)if(r.interStage)for(const[s,a]of Object.entries(r.interStage))Sr.has(s)||(s in t?t[s]!==a&&_r(s,a,t[s]):t[s]=a);return t}function Dr(e){const t=[],r=Object.keys(e);t.push("struct VertexOutput {"),t.push("  @builtin(position) position: vec4<f32>,");let s=0;for(const a of r){const o=e[a],n=Pe(o)?" @interpolate(flat)":"";t.push(`  @location(${s++})${n} ${a}: ${o},`)}t.push("}"),t.push(""),t.push("struct FragmentInput {"),t.push("  @builtin(position) position: vec4<f32>,"),t.push("  @builtin(front_facing) frontFacing: bool,"),s=0;for(const a of r){const o=e[a],n=Pe(o)?" @interpolate(flat)":"";t.push(`  @location(${s++})${n} ${a}: ${o},`)}return t.push("}"),t.join(`
`)}const Tr={collectData(e){e.data.interStage=Br(e.bits)},injectCode(e){return{header:Dr(e.data.interStage)}}},Cr={collectData(e){e.data.overrides=Ct(e.bits)},injectCode(e){return{header:Tt(e.data.overrides)}}},Gr=/\{\{(.*?)\}\}/g;function Pr(e){const t=new Set;for(const r of e)if(r)for(const s of r.matchAll(Gr))t.add(s[1]);return t}function Mr(e,t){const r=Fe(e),s=Pr(Object.values(t));for(const[a,o]of Object.entries(t))o&&/\S/.test(o)&&!r.has(a)&&!s.has(a)&&F(`[compileShader] Generated code for slot {{${a}}} but template doesn't have it. Slot names are prefixed with stage: vertex.input → {{vertexInput}}, fragment.end → {{fragmentEnd}}.`)}const Rr={collectData(e){e.data.vertexSlots=De(e.bits,"gpu","vertex"),e.data.fragmentSlots=De(e.bits,"gpu","fragment")},injectCode(e){const t={};for(const[r,s]of Object.entries(e.data.vertexSlots))t[ae("vertex",r)]=s.join(`
`);for(const[r,s]of Object.entries(e.data.fragmentSlots))t[ae("fragment",r)]=s.join(`
`);return Mr(e.templateString,t),t}};function Ir(e,t){const r=tt(e),s=rt(r),a=Object.create(null);for(const o of t)if(o.bindings){for(const n of Object.values(o.bindings))if(n)for(const[i,u]of Object.entries(n))i in a||(a[i]=at(u))}for(const o of r.groups){const n=a[o.name];if(!n||n==="both")continue;const i=s[o.group]?.find(u=>u.binding===o.binding);i&&(i.visibility=n==="vertex"?we.VERTEX:we.FRAGMENT)}return s}function le(e){const{bits:t,template:r,extraPlugins:s}=e,a=[Cr,xr,dr,Tr,wr,Rr],o=s?[...s,...a]:a,n={bits:t,template:r,templateString:r.gpu,data:{}},i=Gt(n,o);return{vertex:{source:i,entryPoint:"mainVertex"},fragment:{source:i,entryPoint:"mainFragment"},structs:n.data.structs||{},gpuLayout:Ir(i,t)}}const Lr={preCompile(e){const t=e.data.structs;if(!t?.Material)return;const r=st(t.Material);if(r.size>256)throw new Error(`[materialStoragePadding] Material struct is ${r.size} bytes, which exceeds the storage buffer stride of 256 bytes — material data would bleed into adjacent material slots. Trim or pack material fields:
${nt(r)}`);if(r.size===256)return;const s=(256-r.size)/4;t.Material._pad=s===1?"f32":`array<f32, ${s}>`}},He=`
struct DrawArgs {
  indexCount: u32,
  instanceCount: atomic<u32>,
  firstIndex: u32,
  baseVertex: u32,
  firstInstance: u32,
};
`,kr=`
${He}
@group(0) @binding(0) var<storage, read_write> drawCalls: array<DrawArgs>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let k = gid.x;
  if (k >= arrayLength(&drawCalls)) { return; }
  atomicStore(&drawCalls[k].instanceCount, 0u);
}
`,Er=`
${He}
struct Frustum { planes: array<vec4<f32>, 6> };

// Instance records are [storeIndex, packedTextureSlots] — 2 u32 each.
@group(0) @binding(0) var<storage, read>       srcInstances: array<u32>;
@group(0) @binding(1) var<storage, read_write> dstInstances: array<u32>;
@group(0) @binding(2) var<storage, read_write> drawCalls:    array<DrawArgs>;
// Batch store rows (see Mesh3DDataStoreBuffer's lane constants): row 'id' = the instance's local
// matrix in lanes 0-15 (column-major mat4x4, bitcast) + the GEOM_LANE bounds slot + VIS_LANE flag.
// (Row 0 holds the batch world matrix for the vertex shader; the cull works in batch-local space
// so never reads it.)
@group(0) @binding(3) var<storage, read>       store:        array<u32>;
// Per-geometry data rows (stride 2 vec4s — see GeometryDataStoreBuffer), keyed
// by the lane-18 slot. The cull reads only the first texel: the bounding sphere
// (center.xyz, radius.w). radius < 0 = dynamic geometry — registered for its
// morph texel but never frustum-culled (streamed contents, unknowable bounds).
@group(0) @binding(4) var<storage, read>       geomBounds:   array<vec4<f32>>;
@group(0) @binding(5) var<uniform>             frustum:      Frustum;

const STRIDE: u32 = 24u;
const GEOM_LANE: u32 = 18u;
const VIS_LANE: u32 = 19u; // per-instance visibility: 0 = hidden, non-zero = visible
const NO_BOUNDS: u32 = 0xffffffffu; // geometry-lane sentinel for dynamic / unregistered geometry

// Matrix lanes are stored as f32 bit patterns in the u32-bound store. Column-major,
// the same bytes the vertex shader reads as the renderable's 'transform'.
fn loadMatrix(base: u32) -> mat4x4<f32> {
  return mat4x4<f32>(
    bitcast<f32>(store[base + 0u]),  bitcast<f32>(store[base + 1u]),  bitcast<f32>(store[base + 2u]),  bitcast<f32>(store[base + 3u]),
    bitcast<f32>(store[base + 4u]),  bitcast<f32>(store[base + 5u]),  bitcast<f32>(store[base + 6u]),  bitcast<f32>(store[base + 7u]),
    bitcast<f32>(store[base + 8u]),  bitcast<f32>(store[base + 9u]),  bitcast<f32>(store[base + 10u]), bitcast<f32>(store[base + 11u]),
    bitcast<f32>(store[base + 12u]), bitcast<f32>(store[base + 13u]), bitcast<f32>(store[base + 14u]), bitcast<f32>(store[base + 15u]),
  );
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  let instanceCount = arrayLength(&srcInstances) / 2u;
  if (i >= instanceCount) { return; }

  // Visibility first — it needs only the instance id, so a hidden instance skips the
  // command binary-search entirely (a hidden subtree is warp-coherent, the win is real).
  // Set from Container3D.worldVisible; lets a hide/show land without rebuilding the draw commands.
  let id = srcInstances[i * 2u];
  if (store[id * STRIDE + VIS_LANE] == 0u) { return; }

  // Resolve this instance's draw command: the greatest command whose
  // firstInstance <= i (instances are contiguous per command in draw order,
  // so firstInstance lanes are cumulative and ascending).
  var lo = 0u;
  var hi = arrayLength(&drawCalls) - 1u;
  while (lo < hi) {
    let mid = (lo + hi + 1u) >> 1u;
    if (drawCalls[mid].firstInstance <= i) { lo = mid; } else { hi = mid - 1u; }
  }

  // Frustum cull in the batch's local frame. The instance's own matrix 'local' (store row 'id')
  // places the geometry's bounding sphere; the frustum was transformed into this same frame on the
  // CPU (by Bᵀ), so the batch world matrix never enters here — no per-instance B x L combine. The
  // bound is loose: only false negatives (draw something off-screen), never false positives.
  // Skipped when the geometry has no registered bounds.
  let boundsSlot = store[id * STRIDE + GEOM_LANE];
  if (boundsSlot != NO_BOUNDS) {
    // Rows are two texels; the sphere is the first. radius < 0 = no bounds.
    let sphere = geomBounds[boundsSlot * 2u];
    if (sphere.w >= 0.0) {
      let local = loadMatrix(id * STRIDE);
      let center = local * vec4<f32>(sphere.xyz, 1.0);
      // Conservative radius under scale: the longest basis column.
      let sx = dot(local[0].xyz, local[0].xyz);
      let sy = dot(local[1].xyz, local[1].xyz);
      let sz = dot(local[2].xyz, local[2].xyz);
      let radius = sphere.w * sqrt(max(sx, max(sy, sz)));
      for (var p = 0u; p < 6u; p = p + 1u) {
        let plane = frustum.planes[p];
        if (dot(plane.xyz, center.xyz) + plane.w < -radius) { return; }
      }
    }
  }

  let slot = atomicAdd(&drawCalls[lo].instanceCount, 1u);
  let dst = (drawCalls[lo].firstInstance + slot) * 2u;
  dstInstances[dst] = srcInstances[i * 2u];
  dstInstances[dst + 1u] = srcInstances[i * 2u + 1u];
}
`;var Vr=class{static extension={type:[K.WebGPUSystem],name:"compute3d"};_renderer;_zeroPipeline=null;_compactPipeline=null;_zeroBinds=new WeakMap;_compactBinds=new WeakMap;_jobs=[];_jobCount=0;constructor(e){this._renderer=e}renderStart(){this._jobCount=0}dispatch(e,t,r,s,a,o,n,i){if(n===0||i===0)return;let u=this._jobs[this._jobCount];if(!u){const c=new Float32Array(24);u=this._jobs[this._jobCount]={drawCalls:null,src:null,dst:null,store:null,bounds:null,params:new ke({data:c,usage:H.UNIFORM|H.COPY_DST,label:"mesh3d_cull_frustum",shrinkToFit:!1}),paramsF32:c,commandCount:0,instanceCount:0}}u.drawCalls=e,u.src=t,u.dst=r,u.store=s,u.bounds=a,u.paramsF32.set(o),u.params.update(),u.commandCount=n,u.instanceCount=i,this._jobCount++}renderEnd(){const e=this._jobCount;if(this._jobCount=0,e===0)return;const t=this._renderer.gpu.device,r=this._renderer.buffer,s=this._zeroPipeline||this._buildPipeline(t,kr,"_zeroPipeline"),a=this._compactPipeline||this._buildPipeline(t,Er,"_compactPipeline"),o=t.createCommandEncoder(),n=this._jobs,i=o.beginComputePass();i.setPipeline(s);for(let c=0;c<e;c++){const l=n[c],b=r.getGPUBuffer(l.drawCalls);i.setBindGroup(0,this._zeroBindGroup(t,s,b,l.commandCount)),i.dispatchWorkgroups(Math.ceil(l.commandCount/64))}i.end();const u=o.beginComputePass();u.setPipeline(a);for(let c=0;c<e;c++){const l=n[c];u.setBindGroup(0,this._compactBindGroup(t,a,l,r)),u.dispatchWorkgroups(Math.ceil(l.instanceCount/64))}u.end(),t.queue.submit([o.finish()]);for(let c=0;c<e;c++)n[c].drawCalls=null,n[c].src=null,n[c].dst=null,n[c].store=null,n[c].bounds=null}_zeroBindGroup(e,t,r,s){const a=this._zeroBinds.get(r);if(a&&a.commandCount===s)return a.bindGroup;const o=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r,offset:0,size:s*20}}]});return this._zeroBinds.set(r,{bindGroup:o,commandCount:s}),o}_compactBindGroup(e,t,r,s){const a=s.getGPUBuffer(r.src),o=s.getGPUBuffer(r.dst),n=s.getGPUBuffer(r.drawCalls),i=s.getGPUBuffer(r.store),u=s.getGPUBuffer(r.bounds),c=s.getGPUBuffer(r.params),l=this._compactBinds.get(n);if(l&&l.src===a&&l.dst===o&&l.drawCalls===n&&l.store===i&&l.bounds===u&&l.params===c&&l.commandCount===r.commandCount&&l.instanceCount===r.instanceCount)return l.bindGroup;const b=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:a,offset:0,size:r.instanceCount*8}},{binding:1,resource:{buffer:o,offset:0,size:r.instanceCount*8}},{binding:2,resource:{buffer:n,offset:0,size:r.commandCount*20}},{binding:3,resource:{buffer:i}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:c}}]});return this._compactBinds.set(n,{bindGroup:b,src:a,dst:o,drawCalls:n,store:i,bounds:u,params:c,commandCount:r.commandCount,instanceCount:r.instanceCount}),b}_buildPipeline(e,t,r){const s=e.createShaderModule({code:t}),a=e.createComputePipeline({layout:"auto",compute:{module:s,entryPoint:"main"}});return this[r]=a,a}destroy(){for(const e of this._jobs)e.params?.destroy();this._jobs.length=0,this._zeroPipeline=null,this._compactPipeline=null,this._zeroBinds=new WeakMap,this._compactBinds=new WeakMap,this._jobCount=0}};const Ar=new Float32Array(24);function q(e,t,r,s){const a=e.gpuData.instanceBuffer.data,o=s.survivors,n=s.indirectDrawData,i=o.data,u=n.drawCalls,c=e.commandList.count,l=e.view.count,b=e.view.items,f=e.view.indices,h=t.storeBuffer.u32Data,m=t.storeBuffer.stride,g=r!==null,d=g?se(r,t.storeBuffer.data):Ar,p=d[0],x=d[1],w=d[2],v=d[3],S=d[4],M=d[5],B=d[6],C=d[7],R=d[8],D=d[9],y=d[10],T=d[11],_=d[12],V=d[13],A=d[14],O=d[15],G=d[16],P=d[17],I=d[18],z=d[19],L=d[20],k=d[21],qe=d[22],Ke=d[23];for(let N=0;N<c;N++){const ne=u[N*5+4],Ye=N+1<c?u[(N+1)*5+4]:l;let Y=ne*2;for(let X=ne;X<Ye;X++){const xe=X*2,ve=a[xe];if(h[ve*m+19]!==0){if(g){const ye=b[f[X]].boundingSphere,$=ye.radius;if($>=0){const oe=ye.center,U=oe.x,j=oe.y,W=oe.z;if(p*U+x*j+w*W+v<-$||S*U+M*j+B*W+C<-$||R*U+D*j+y*W+T<-$||_*U+V*j+A*W+O<-$||G*U+P*j+I*W+z<-$||L*U+k*j+qe*W+Ke<-$)continue}}i[Y]=ve,i[Y+1]=a[xe+1],Y+=2}}u[N*5+1]=(Y>>1)-ne}s.lastVisibilityDirtyId=t._visibilityDirtyId,o.upload(l),n.upload(c)}const J={name:"global",structs:{Renderable:Ue,RenderableInstance:Ne,BoneMatrix:ge,GeometryData:me,Light:Pt,ShadowData:$e},bindings:{global:{uGlobalLightParams:"vec4<f32>",uCameraPosition:"vec3<f32>",uTime:"f32",uViewMatrix:"mat4x4<f32>",uProjectionMatrix:"mat4x4<f32>",uFogColor:"vec3<f32>",uFogParams:"vec3<f32>",uExposure:"f32",uViewportUVScale:"vec2<f32>",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uSampler:"sampler",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uBrdfLutSampler:"sampler",uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uOpaqueDepthTexture:"texture_depth_2d",uOpaqueColorTexture:"texture_2d<f32>",uLightStorage:{type:"storage<Light>",visibility:"fragment"},uShadowStorage:{type:"storage<ShadowData>",visibility:"fragment"},uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}},gpu:{header:`
const LIGHT_DIRECTIONAL: f32 = 0.0;
const LIGHT_POINT: f32 = 1.0;
const LIGHT_SPOT: f32 = 2.0;
`}};function fe(e,t){let r=e._gpuData[t.uid];if(!r){const s=new Ee({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uCameraPosition:{value:new Ve,type:"vec3<f32>"},uTime:{value:0,type:"f32"},uViewMatrix:{value:new re,type:"mat4x4<f32>"},uProjectionMatrix:{value:new re,type:"mat4x4<f32>"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uViewportUVScale:{value:new Float32Array([1,1]),type:"vec2<f32>"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"}});s.isStatic=!0,s.ubo=!1,t.ubo.ensureUniformGroup(s),s.buffer.autoGarbageCollect=!1;const a=new ie;a.addressMode="repeat";const o=new ie;o.compare="less";const n=new ie;n.addressMode="clamp-to-edge";const i=new Ae({0:s,1:a,2:ut.source,3:te.EMPTY.source,4:n,5:it.source,6:o,7:ot,8:te.EMPTY.source,9:e._lightDataBuffer.bufferResource,10:e._shadowDataBuffer.bufferResource,11:E,12:E,13:e._bonePit.bufferResource,14:E,15:E,16:E});r=new Mt(s,i),e._gpuData[t.uid]=r}return r}var Or=class{static extension={type:[K.WebGPUSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[he.SHADOW];let s=0;r?.beginFrame(e);const{_lightDataBuffer:a,_shadowDataBuffer:o,environment:n}=e;a.reset(),o.reset();const i=fe(e,this._renderer).globalUniformGroup.uniforms,u=i.uGlobalLightParams;if(u[0]=0,u[1]=0,u[2]=0,n!==null&&!(n instanceof Oe)){const c=n.intensity??1,l=i.uHemisphereSky,b=i.uHemisphereGround,f=i.uHemisphereUp,h=ze.shared;de(l,0,h.setValue(n.skyColor),c),de(b,0,h.setValue(n.groundColor),c);const m=n.up??Rt,g=m.x*m.x+m.y*m.y+m.z*m.z,d=g>0?1/Math.sqrt(g):0;f[0]=m.x*d,f[1]=m.y*d,f[2]=m.z*d}for(let c=0;c<t.length;c++){const l=t[c];if(l.worldVisible){if(l.type==="ambient"){const b=l,f=b.color,h=b.intensity;ct(u,0,f,h);continue}s>=32||(r?.prepareShadow(l,e),a.add(l),s++)}}u[3]=s,s>0&&(a.update(),(r?.shadowCount??0)>0&&o.update())}};const zr=`
  var<private> pos: array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

  struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
  };

  @vertex
  fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    return output;
  }

  @group(0) @binding(0) var imgSampler: sampler;
  @group(0) @binding(1) var img: texture_2d<f32>;

  @fragment
  fn fragmentMain(@location(0) texCoord: vec2<f32>) -> @location(0) vec4<f32> {
    return textureSample(img, imgSampler, texCoord);
  }
`;var $r=class{static extension={type:[K.WebGPUSystem],name:"mipChain3d"};_renderer;_shaderModule=null;_sampler=null;_pipelines=Object.create(null);_cache=Object.create(null);constructor(e){this._renderer=e}generate(e){if(e.mipLevelCount<=1)return;const t=this._renderer.gpu.device,r=this._renderer.encoder.commandEncoder,s=this._pipeline(t,e.format),{bindGroups:a,dstViews:o}=this._cache[e.uid]||this._buildCacheEntry(e);for(let n=0;n<o.length;n++){const i=r.beginRenderPass({colorAttachments:[{view:o[n],loadOp:"clear",storeOp:"store",clearValue:{r:0,g:0,b:0,a:0}}]});i.setPipeline(s),i.setBindGroup(0,a[n]),i.draw(3),i.end()}}_buildCacheEntry(e){const t=this._renderer.gpu.device,r=this._pipeline(t,e.format),s=this._renderer.texture.getGpuSource(e),a=[],o=[],n=r.getBindGroupLayout(0);for(let u=1;u<e.mipLevelCount;u++)o.push(s.createView({baseMipLevel:u,mipLevelCount:1,dimension:"2d"})),a.push(t.createBindGroup({layout:n,entries:[{binding:0,resource:this._sampler},{binding:1,resource:s.createView({baseMipLevel:u-1,mipLevelCount:1,dimension:"2d"})}]}));const i={bindGroups:a,dstViews:o};return this._cache[e.uid]=i,i}_pipeline(e,t){const r=this._pipelines[t];if(r)return r;this._shaderModule||=e.createShaderModule({code:zr}),this._sampler||=e.createSampler({minFilter:"linear"});const s=e.createRenderPipeline({layout:"auto",vertex:{module:this._shaderModule,entryPoint:"vertexMain"},fragment:{module:this._shaderModule,entryPoint:"fragmentMain",targets:[{format:t}]}});return this._pipelines[t]=s,s}destroy(){this._shaderModule=null,this._sampler=null,this._pipelines=Object.create(null),this._cache=Object.create(null)}};function Fr(e){const{pipe:t,bit:r,session:s,sortBatch:a,skipTextureBatching:o=!1}=e,{view3d:n}=s,i=t.renderer.material3d.batcher;for(const u of n._meshBatches){if(!u.renderData.worldVisible)continue;const c=u.drawLists[r];if(!c)continue;const l=c.view;if(l.count===0||!c.isDrawStale(l.count))continue;a?a(l,u):l.sort();const b=c.gpuData;b.instanceBuffer.populateIds(l),i.render({renderables:l,globalBindGroup:s.globalBindGroup,instanceData:b.instanceBuffer.data,commandList:c.commandList,drawData:c.drawData,passBit:r,skipTextureBatching:o}),b.instanceBuffer.upload(l.count),c._cullProducer=be(n.cull,!0,l.count)}}function Nr(e){const{pipe:t,bit:r,cullResults:s,session:a}=e,{view3d:o}=a,n=t.geometryDataStoreBuffer.buffer,i=(o.cullFrustum??o.camera.frustum).planesData;s.removeDetached(o);for(const u of o._meshBatches){if(!u.renderData.worldVisible)continue;const c=u.drawLists[r];if(!c||c.view.count===0)continue;const l=s.ensure(u);l.sync(c);const b=c._cullProducer;if(b==="off"){l.lastVisibilityDirtyId!==u._visibilityDirtyId&&q(c,u,null,l);continue}if(b==="cpu"){q(c,u,i,l);continue}const f=se(i,u.storeBuffer.data);t.renderer.compute3d.dispatch(l.indirectDrawData.drawCallsBuffer,c.gpuData.instanceBuffer.buffer,l.survivors.buffer,u.storeBuffer.buffer,n,f,c.commandList.count,c.view.count)}}function Me(e){const{pipe:t,bit:r,cullResults:s,session:a,useBundles:o,alwaysRebuild:n,sortBatch:i,skipTextureBatching:u=!1}=e;if(!o&&!n)throw new Error("renderForwardBatchesGpu: useBundles=false requires alwaysRebuild=true (immediate replay needs per-batch bindings re-bound every frame).");const{view3d:c}=a,l=t.renderer.encoder,b=t.renderer.material3d.batcher,f=t.renderer.gc.now,h=(c.cullFrustum??c.camera.frustum).planesData,m=t.geometryDataStoreBuffer.buffer;o||s.removeDetached(c);let g=0;for(const d of c._meshBatches){if(!d.renderData.worldVisible)continue;const p=d.drawLists[r];if(!p)continue;const x=p.view;if(x.count===0){if(p.claimDrawEmpty(),o){const S=s.get(d);S&&(S.bundle=null,S.claimBundleRecorded(p))}continue}const w=n||p.isDrawStale(x.count),v=s.ensure(d);if(o){const S=v.bundle;(!S||v.isBundleStale(p)||!l.isBundleValid(S))&&(a.globalBindGroup.setResource(d.storeBuffer.bufferResource,11),a.globalBindGroup.setResource(v.survivors.bufferResource,12),l.beginBundle(`view3d pass ${r} batch ${d.uid}`),p.commandList.replay(l,t.renderer.buffer,v.indirectDrawData),v.bundle=l.endBundle(),v.claimBundleRecorded(p))}else if(w){i?i(x,d):x.sort();const S=p.gpuData;S.instanceBuffer.populateIds(x),b.render({renderables:x,globalBindGroup:a.globalBindGroup,instanceData:S.instanceBuffer.data,commandList:p.commandList,drawData:p.drawData,passBit:r,skipTextureBatching:u}),S.instanceBuffer.upload(x.count),v.sync(p),a.globalBindGroup.setResource(d.storeBuffer.bufferResource,11),a.globalBindGroup.setResource(v.survivors.bufferResource,12);const M=be(c.cull,!0,x.count);if(p._cullProducer=M,M==="gpu"){const B=se(h,d.storeBuffer.data);t.renderer.compute3d.dispatch(v.indirectDrawData.drawCallsBuffer,S.instanceBuffer.buffer,v.survivors.buffer,d.storeBuffer.buffer,m,B,p.commandList.count,p.view.count)}else q(p,d,M==="cpu"?h:null,v)}p.claimDrawBuilt(x.count),o?(p.commandList.touch(f),ee[g++]=v.bundle):p.commandList.replay(l,t.renderer.buffer,v.indirectDrawData)}g>0&&(l.executeBundle(ee),ee.length=0)}const ee=[];Le.register({clear:()=>{ee.length=0}});const Ur=`
//=============================================================================
// BATCH TEXTURE HELPERS
//=============================================================================
var<private> _textureSlots: u32;

fn _unpackSlot(slots: u32, shift: u32) -> u32 {
  return (slots >> shift) & 0xFu;
}

fn sampleBatchSlotGrad(
  slot: u32,
  uv: vec2<f32>,
  uvDx: vec2<f32>,
  uvDy: vec2<f32>,
) -> vec4<f32> {
  // Pixi-style: switch on a *flat* interpolated value (uniform per primitive).
  switch (slot) {
    case 0u: { return textureSampleGrad(uBatchTexture0, uSampler, uv, uvDx, uvDy); }
    case 1u: { return textureSampleGrad(uBatchTexture1, uSampler, uv, uvDx, uvDy); }
    case 2u: { return textureSampleGrad(uBatchTexture2, uSampler, uv, uvDx, uvDy); }
    case 3u: { return textureSampleGrad(uBatchTexture3, uSampler, uv, uvDx, uvDy); }
    case 4u: { return textureSampleGrad(uBatchTexture4, uSampler, uv, uvDx, uvDy); }
    case 5u: { return textureSampleGrad(uBatchTexture5, uSampler, uv, uvDx, uvDy); }
    case 6u: { return textureSampleGrad(uBatchTexture6, uSampler, uv, uvDx, uvDy); }
    case 7u: { return textureSampleGrad(uBatchTexture7, uSampler, uv, uvDx, uvDy); }
    case 8u: { return textureSampleGrad(uBatchTexture8, uSampler, uv, uvDx, uvDy); }
    case 9u: { return textureSampleGrad(uBatchTexture9, uSampler, uv, uvDx, uvDy); }
    case 13u: { return vec4<f32>(0.0); }
    case 14u: { return vec4<f32>(1.0); }
    case 15u: { return vec4<f32>(0.5, 0.5, 1.0, 1.0); }
    default: { return textureSampleGrad(uBatchTexture9, uSampler, uv, uvDx, uvDy); }
  }
}

fn sampleBatchTexture(
  slots: u32,
  shift: u32,
  uv: vec2<f32>,
  uvDx: vec2<f32>,
  uvDy: vec2<f32>
) -> vec4<f32> {
  return sampleBatchSlotGrad(_unpackSlot(slots, shift), uv, uvDx, uvDy);
}
`,jr={collectData(e){e.bits.some(t=>t.name==="batchTexturesBindings")||e.bits.unshift({name:"batchTexturesBindings",bindings:{batch:{uBatchTexture0:"texture_2d<f32>",uBatchTexture1:"texture_2d<f32>",uBatchTexture2:"texture_2d<f32>",uBatchTexture3:"texture_2d<f32>",uBatchTexture4:"texture_2d<f32>",uBatchTexture5:"texture_2d<f32>",uBatchTexture6:"texture_2d<f32>",uBatchTexture7:"texture_2d<f32>",uBatchTexture8:"texture_2d<f32>",uBatchTexture9:"texture_2d<f32>"}},gpu:{header:Ur}})},injectCode(e){let t=0;const r=[];for(const s of e.bits)if(s.textures)for(const a of s.textures){const o=`sample${a[0].toUpperCase()}${a.slice(1)}`,n=t*4;r.push(`fn ${o}Direct(uv: vec2<f32>) -> vec4<f32> {`,`  return sampleBatchTexture(_textureSlots, ${n}u, uv, vec2<f32>(0.0), vec2<f32>(0.0));`,"}"),r.push(`fn ${o}(uv: vec2<f32>) -> vec4<f32> {`,`  return sampleBatchTexture(_textureSlots, ${n}u, uv, dpdx(uv), dpdy(uv));`,"}"),t++}return{textureGetters:r.join(`
`)}}},Wr=new ft({}),Hr=`


{{header}}
{{textureGetters}}
{{vertexHeader}}

//=============================================================================
// VERTEX SHADER
//=============================================================================
@vertex
fn mainVertex(input: VertexInput,
  @builtin(instance_index) ii: u32,
  @builtin(vertex_index) vid: u32
) -> VertexOutput {
  var output: VertexOutput;

  var position: vec4<f32>;
  // Default normal for geometries with no aNormal attribute; normalBit
  // overwrites it in the input slot when the geometry has one.
  var normal = vec3<f32>(0.0, 0.0, 1.0);
  var tangent = vec3<f32>(0.0);
  var uv = vec2<f32>(0.0);
  
  let inst = uRenderableInstanceStorage[ii];
  let renderable = uRenderableStorage[inst.id];
  let textureSlots = inst.texSlots;
  let material = uMaterialStorage[renderable.materialIndex];

  // Vertex-stage texture reads (displacement bits) go through the same
  // sampleXxxDirect helpers as the fragment stage, and those read this private.
  // WebGL gets it for free — vTextureSlots is a varying written in the vertex
  // stage — so without this line the two backends silently disagree.
  _textureSlots = textureSlots;

  let batchWorldMatrix = uRenderableStorage[0].transform;
  var modelMatrix = batchWorldMatrix * renderable.transform;

  // Stage 1 — attribute decode + raw input prep.
  // positionBit, skinningBit, uvsBit, tangent decode live here.
  {{vertexInput}}

  // Stage 2 — override values that feed the world/clip transform.
  // Billboards, vertex displacement, custom skinning fallbacks.
  {{vertexBeforeTransform}}

  // Standard transform. worldPosition / worldNormal / clipPosition are vars
  // so afterTransform bits can reassign them.
  var worldPosition = modelMatrix * position;
  // Directions take the rotation/scale block only — translation must not apply.
  // Built after beforeTransform so instancing bits that reassign modelMatrix are
  // picked up.
  let modelMatrix3 = mat3x3<f32>(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz);

  // A normal transforms by the inverse-transpose, not by the matrix itself:
  // non-uniform scale has to tilt it *away* from the stretched axis, not into
  // it. Dividing by each column's squared length first is exactly that for any
  // rotation-and-scale matrix, at three dot products instead of an inverse.
  // Tangents lie along the surface, so they use modelMatrix3 directly.
  let normalScale = 1.0 / vec3<f32>(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  var worldNormal = modelMatrix3 * (normal * normalScale);
  var clipPosition = global.uProjectionMatrix * global.uViewMatrix * worldPosition;

  // Stage 3 — modify worldPosition / clipPosition after the standard transform.
  // Depth bias, projection tricks.
  {{vertexAfterTransform}}

  // Stage 4 — modify the locals the template is about to publish as varyings.
  {{vertexEnd}}

  // Publish varyings once, after end-slot bits have finished mutating locals
  // (uvTransformBit -> uv, future bits may mutate worldNormal/uv/etc).
  // NOTE: vMaterialIndex is u32, so it must be flat-interpolated in WGSL.
  output.position       = clipPosition;
  output.vPosition      = worldPosition.xyz;
  output.vNormal        = worldNormal;
  output.vUV            = uv;
  output.vMaterialIndex = renderable.materialIndex;
  output.vTextureSlots  = textureSlots;

  return output;
}

//=============================================================================
// FRAGMENT SHADER - MAIN
//=============================================================================
@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  _textureSlots = input.vTextureSlots;
  var normal = normalize(input.vNormal);
  var albedo: vec3<f32> = vec3<f32>(1.0);
  var finalColor: vec3<f32>;
  var alpha: f32 = 1.0;

  // Per-fragment Material struct. Declared here so any bit can reference
  // material.X regardless of its position in the descriptor.
  var material = uMaterialStorage[input.vMaterialIndex];

  {{fragmentMaterial}}

  // Unlit default — picks up modulation from any bit that wrote into albedo.
  // Lighting bits (pbrLightingBit) overwrite finalColor in the lighting slot.
  finalColor = albedo;

  {{fragmentLighting}}

  // Linear scene-radiance exposure, applied before any tone-mapping bit's
  // curve runs. Default uExposure = 1.0 makes this a value-preserving op.
  finalColor *= global.uExposure;

  {{fragmentEnd}}

  // Premultiply for Pixi's default 'normal' blend mode (SRC + DST*(1-α)).
  // Source textures stay non-premultiplied (matching the 2D convention) and
  // we bridge the gap here, so transparent 3D materials don't need a custom
  // blendMode. See follow-up issue for the full premul-pipeline discussion.
  return vec4<f32>(finalColor * alpha, alpha);
}
`,qr={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32",vTextureSlots:"u32"}},Kr={name:"materialStorageBinding",bindings:{global:{uMaterialStorage:"storage<Material>"}}},Yr={bindGroups:["global","batch"],gpu:Hr};var Xr=class{static extension={type:[K.WebGPUSystem],name:"material3d"};batcher=new tr;_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return this._renderer.pipeline.getPipelineKey(e.geometry,r.shader.gpuProgram,r.state,r.topology,r.shader._overrides||Object.create(null))}compilePassShader(e,t){return Z.from({gpu:le({bits:[J,...e],template:t})})}compileIsolatedShader(e,t,r){return Z.from({gpu:le({bits:e,template:t}),groups:r})}compileShader(e,t,r,s){const a=e.includeGlobal??!0,o=a?[J,...e.bitsGpu]:[...e.bitsGpu];let n=a?`${J.name}|${e.keyGpu}`:e.keyGpu;const i=It(t.geometry.attributes.aPosition.format);Se(i),o.push(i),n+=`|${i.name}`,t.morph&&(t.geometry.hasMorphNormals?(o.push(ar),n+="|morphN"):(o.push(rr),n+="|morph")),t.skeleton&&(Se(ce),o.push(ce),n+=`|${ce.name}`),s&&(lt(o,t.material),dt(o,t.material));let u=this._shaderCache.get(n);if(!u){const c=le({bits:o,template:e.template,extraPlugins:r});u=Z.from({gpu:c,overrides:e.overrides}),this._shaderCache.set(n,u)}return u}ensureMaterial(e,t){const r=e.geometry,s=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(s);const a=s._passBit&he.MATERIAL_PASS_MASK,o=s._passes[a],n=s.getPrimaryDescriptor(t),i=[J,qr,Kr];r.attributes.aNormal&&i.push(Nt),r.attributes.aUV&&i.push(Lt(r.attributes.aUV.format)),s.doubleSided&&i.push(kt),s.flatShading&&i.push(Et);const u=s.textures.normal;u&&u!==Ie&&r.attributes.aUV&&i.push(r.attributes.aTangent?Vt:At),r.attributes.aColor&&e.material.vertexColors&&i.push(Ot);const c=e.material.lit;e.billboardMode!=="none"&&i.push(zt(e.billboardMode,c));const l=!!r.attributes.aTangent;for(let x=0;x<n.bitsGpu.length;x++){const w=n.bitsGpu[x];i.push(l?pt(w):w)}const b=t._fogBit;b&&s.fog&&i.push(b);const f=t._toneMappingBit;e.material.toneMapped&&f&&i.push(f),c&&i.push(e.receiveShadow?nr[t.shadowFilter]:$t);const h=Wr.update({bitsGpu:i,template:n.template??Yr,overrides:{HAS_UVS:r.attributes.aUV?1:0,...n.overrides},includeGlobal:!1}),m=this.compileShader(h,e,[Ft,Lr,jr],!0),g=o&&o.state||s.state,d=o&&o.topology||s.topology||r.topology,p=e._passCache[a];return p?(p.shader=m,p.state=g,p.topology=d):e._passCache[a]=new ht(m,g,d),m}destroy(){if(!this._destroyed){this._destroyed=!0;for(const e of this._shaderCache.values())e.destroy();this._shaderCache.clear()}}};const Jr={name:"shadowGlobal",structs:{Renderable:Ue,RenderableInstance:Ne,BoneMatrix:ge,GeometryData:me},bindings:{global:{uViewProjectionMatrix:"mat4x4<f32>",uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}}},Zr={bindGroups:["global","local"],gpu:`

{{header}}
{{vertexHeader}}

@vertex
fn mainVertex(
  input: VertexInput,
  @builtin(instance_index) ii: u32,
  @builtin(vertex_index) vid: u32
) -> VertexOutput {
  var output: VertexOutput;

  var position: vec4<f32>;

  let renderable = uRenderableStorage[uRenderableInstanceStorage[ii].id];
  let batchWorldMatrix = uRenderableStorage[0].transform;

  // Not needed for shadow mapping, but skinningBitGpu expects them.
  // The compiler optimizes away the unused calculations. Types must track the
  // forward template's — the skinning and morph bits are shared between both.
  var normal = vec3<f32>(0.0);
  var tangent = vec3<f32>(0.0);

  {{vertexInput}}

  let worldPosition = batchWorldMatrix * renderable.transform * position;
  let clipPosition = global.uViewProjectionMatrix * worldPosition;

  output.position = clipPosition;

  {{vertexEnd}}

  return output;
}

@fragment
fn mainFragment(input: FragmentInput){
}
`};var Qr=class extends Ut{_bundleRun=[];constructor(e){const t=mt();t.depthTest=!0,t.depthMask=!0,t.culling=!0,t.clockwiseFrontFace=!1,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:he.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGpu:[Jr],template:Zr,includeGlobal:!1},state:t}})}_cascadeSlot(e,t,r){const s=this.getShadowGPUData(e),a=s.cascades??=[];if(!a[t]){const o=new re,n=new Ee({uViewProjectionMatrix:{value:o,type:"mat4x4<f32>"}});n.isStatic=!0,this.pipe.renderer.ubo.ensureUniformGroup(n),n.buffer.autoGarbageCollect=!1,a[t]={vp:new re,gpuVP:o,uniformGroup:n,bindGroup:new Ae({0:n,1:E,2:E,3:r._bonePit.bufferResource,4:E,5:E}),bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}return a[t]}_applyZRangeFix=!0;_commitCascadeMatrix(e){e.gpuVP.copyFrom(e.vp),e.uniformGroup.update()}_uploadSlot(e,t,r){r._shadowDataBuffer.add(e)}prepare(e){const{view3d:t,lights:r}=e;this._bindShadowSource(t,this.renderTarget.depthStencilTexture);const s=t.cull!=="off",a=this.pipe.renderer.material3d.batcher,o=this.pipe.renderer.compute3d,n=this.pipe.geometryDataStoreBuffer.buffer;for(const i of t._meshBatches){if(!i.renderData.worldVisible)continue;const u=i.drawLists[this.bit];if(!u)continue;const c=u.gpuData,l=u.view;if(l.count===0){u.claimDrawEmpty(),u._cullProducer="off";continue}u.isDrawStale(l.count)&&(u.claimDrawBuilt(l.count),l.sort(),c.instanceBuffer.populateIds(l),a.render({renderables:l,globalBindGroup:e.globalBindGroup,instanceData:c.instanceBuffer.data,commandList:u.commandList,drawData:u.drawData,passBit:this.bit,skipTextureBatching:!0}),c.instanceBuffer.upload(l.count)),u._cullProducer=s?be(t.cull,!0,l.count):"off"}for(let i=0;i<r.length;i++){const u=r[i],c=u._gpuShadowData;if(!c||(c.cullResults?.removeDetached(t),!_e(u)))continue;const l=Be(u),b=c.cascades,f=c.cullResults??=new gt;for(let h=0;h<l;h++){const m=b?.[h];if(!m||!m.needsRender)continue;const g=s?this._cascadeCullFrustum(m):null;for(const d of t._meshBatches){if(!d.renderData.worldVisible)continue;const p=d.drawLists[this.bit];if(!p||p.view.count===0)continue;if(h===0)for(let v=l;v<4;v++)f.remove(d,v);const x=f.ensure(d,h);x.sync(p);const w=p._cullProducer;if(w==="off")x.lastVisibilityDirtyId!==d._visibilityDirtyId&&q(p,d,null,x);else if(w==="cpu")q(p,d,g.planesData,x);else{const v=se(g.planesData,d.storeBuffer.data);o.dispatch(x.indirectDrawData.drawCallsBuffer,p.gpuData.instanceBuffer.buffer,x.survivors.buffer,d.storeBuffer.buffer,n,v,p.commandList.count,p.view.count)}}}}}render(e){const{view3d:t,lights:r}=e,s=this.pipe.renderer,a=s.encoder,o=s.pipeline;o.setColorMask(0);for(const n of r){if(!_e(n))continue;const i=this.getShadowGPUData(n).cullResults;if(!i)continue;const u=Be(n);for(let c=0;c<u;c++){const l=this._cascadeSlot(n,c,t);if(!l.needsRender)continue;const b=n._shadowDataIndex+c,f=l.bindGroup;s.renderTarget.bind({target:this.renderTarget,clear:!0,layer:b}),s.ubo.updateUniformGroup(f.resources[0]);for(const h of t._meshBatches){if(!h.renderData.worldVisible)continue;const m=h.drawLists[this.bit];if(!m||m.view.count===0)continue;const g=i.get(h,c);if(!g)continue;const d=g.bundle;if(!d||g.isBundleStale(m)||!a.isBundleValid(d)){const p=m.commandList.commands;for(let x=0;x<m.commandList.count;x++)p[x].globalBindGroup=f;f.setResource(h.storeBuffer.bufferResource,1),f.setResource(g.survivors.bufferResource,2),f.setResource(t._bonePit.bufferResource,3),f.setResource(this.pipe._morphStoreBuffer.bufferResource,4),f.setResource(this.pipe.geometryDataStoreBuffer.bufferResource,5),a.beginBundle(`shadow cascade ${c} batch ${h.uid}`),m.commandList.replay(a,s.buffer,g.indirectDrawData),g.bundle=a.endBundle(),g.claimBundleRecorded(m)}m.commandList.touch(s.gc.now),this._bundleRun.push(g.bundle)}this._bundleRun.length>0&&(a.executeBundle(this._bundleRun),this._bundleRun.length=0)}this._completeShadowUpdate(n)}o.setColorMask(15),e.activeTarget=null}};const ea=13421772,Re=new ze;var ta=class{static extension={type:[K.WebGPUPipes],name:"view3d"};renderer;_brdfLutTexture;_iblEnvironmentMap={};_physicalViewport=new bt;_cameraPos=new Ve;_sortForwardByDistance=(e,t)=>{jt(e,t.storeBuffer.data,this._cameraPos)};materialStoreBuffer=new Wt;_morphStoreBuffer=new Ht;geometryDataStoreBuffer=new qt;transientCache=new xt;globalSlots={opaqueColor:8,opaqueDepth:7,shadowMap:5};atlasPool=Kt.from({rebaseIndices:!1});_managedViews;_indirectChecked=!1;_destroyed=!1;constructor(e){this.renderer=e,this._managedViews=new Yt(this.renderer)}createShadowPass(e){return new Qr({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}renderForward(e,t){const r=Te(e),s=e.textures===!1;if(e.sort==="distance"){t.view3d.camera.worldTransform.extractPosition(this._cameraPos),Me({pipe:this,bit:e.bit,cullResults:e.cullResults,session:t,useBundles:r,alwaysRebuild:!r,sortBatch:this._sortForwardByDistance,skipTextureBatching:s});return}Me({pipe:this,bit:e.bit,cullResults:e.cullResults,session:t,useBundles:r,alwaysRebuild:!r,skipTextureBatching:s})}prepareForward(e,t){if(!Te(e))return;const r={pipe:this,bit:e.bit,cullResults:e.cullResults,session:t,skipTextureBatching:e.textures===!1};Fr(r),Nr(r)}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}_depthClearGeometry=null;_depthClearShader=null;_depthClearState=null;clearDepth(e){this._depthClearShader||this._buildDepthClear();const{encoder:t,pipeline:r}=this.renderer;r.setColorMask(0),t.draw({geometry:this._depthClearGeometry,shader:this._depthClearShader,state:this._depthClearState}),r.setColorMask(15)}_buildDepthClear(){this._depthClearGeometry=new vt({attributes:{aPosition:new Float32Array([-1,-1,3,-1,-1,3])}});const e=new yt;e.depthTest=!1,e.depthMask=!0,e.culling=!1,e.blend=!1,this._depthClearState=e,this._depthClearShader=Z.from({gpu:{vertex:{entryPoint:"mainVertex",source:`
            struct VertexOutput { @builtin(position) position: vec4<f32> };

            @vertex
            fn mainVertex(@location(0) aPosition: vec2<f32>) -> VertexOutput {
              var output: VertexOutput;
              // z = w = 1 -> NDC depth 1.0 (far plane).
              output.position = vec4<f32>(aPosition, 1.0, 1.0);
              return output;
            }
          `},fragment:{entryPoint:"mainFragment",source:`
            @fragment
            fn mainFragment() -> @location(0) vec4<f32> {
              return vec4<f32>(0.0, 0.0, 0.0, 0.0);
            }
          `}}})}copyColor(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.colorTexture)return;const s=t.view3d._graph._texture(e,t);this.renderer.renderTarget.finishRenderPass();const a=t.contentFrame;this.renderer.renderTarget.copyToTexture(r,s,{x:a.x,y:a.y},{width:a.width,height:a.height},{x:0,y:0}),t.activeTarget=null}generateMips(e,t){const r=t.view3d._graph._texture(e,t).source;this.renderer.renderTarget.finishRenderPass(),t.activeTarget=null,this.renderer.mipChain3d.generate(r)}copyDepth(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.depthStencilTexture)return;const s=t.view3d._graph._texture(e,t);this.renderer.renderTarget.finishRenderPass();const a=t.contentFrame;this.renderer.renderTarget.copyDepthTexture(r,s,{x:a.x,y:a.y},{width:a.width,height:a.height},{x:0,y:0}),t.activeTarget=null}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;if(!this._indirectChecked&&(this._indirectChecked=!0,!this.renderer.gpu.device.features.has("indirect-first-instance")))throw new Error("@pixi/3d requires the WebGPU 'indirect-first-instance' feature (used by the batched indirect draw path).");e._ensureInitialized(this.renderer);const t=fe(e,this.renderer);this._managedViews.track(e),this._brdfLutTexture||=Xt({renderer:this.renderer,size:512}),t.globalBindGroup.setResource(this._brdfLutTexture.source,3);const r=e.environment,s=r instanceof Oe?r:null;if(s){const u=s.source.uid;this._iblEnvironmentMap[u]||(this._iblEnvironmentMap[u]=Jt({renderer:this.renderer,sourceTexture:s,size:256,sampleCount:1024})),t.globalBindGroup.setResource(this._iblEnvironmentMap[u].source,2)}const a=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const o=Zt(e,this);if(!o.logicalViewport)return;const n=o.logicalViewport;t.globalBindGroup.setResource(e._bonePit.bufferResource,13),t.globalBindGroup.setResource(this._morphStoreBuffer.bufferResource,14),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.bufferResource,15),t.globalBindGroup.setResource(this.materialStoreBuffer.bufferResource,16),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),this.atlasPool.update(),Qt(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer,this.geometryDataStoreBuffer)&&e._invalidateDrawCaches(),wt(this._physicalViewport,n,this.renderer.renderTarget.renderTarget,this.renderer),this.renderer.lighting3d.update(e,a),this.updateGlobalUniforms(e);const i={view3d:e,logicalViewport:n,lights:a,defaultTarget:this.renderer.renderTarget.renderTarget,activeTarget:null,needsDepthClear:!0,physicalViewport:this._physicalViewport,contentFrame:this._physicalViewport,globalBindGroup:t.globalBindGroup,renderer:this.renderer};e._graph.resolve(i),e._graph.execute(i)}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const e in this._iblEnvironmentMap)this._iblEnvironmentMap[e].destroy(!0);this._iblEnvironmentMap={},this.transientCache.clear(),this.materialStoreBuffer.destroy(),this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearGeometry?.destroy(!0),this._depthClearGeometry=null,this._depthClearShader?.destroy(),this._depthClearShader=null,this._depthClearState=null}}updateGlobalUniforms(e){const{camera:t,fog:r}=e,s=fe(e,this.renderer).globalUniformGroup,a=s.uniforms;t.worldTransform.extractPosition(a.uCameraPosition),a.uTime=performance.now()/1e3,a.uExposure=e.exposure,a.uViewMatrix=t.view,a.uProjectionMatrix=t.projection,this.renderer.renderTarget.frontFaceInverted&&er(t.projection);const o=this._physicalViewport,n=this.renderer.renderTarget.renderTarget.colorTexture.source,i=St(o.width,o.height,n.pixelWidth,n.pixelHeight),u=a.uViewportUVScale;if(u[0]=o.width/i.width,u[1]=o.height/i.height,r){Re.setValue(r.color??ea),de(a.uFogColor,0,Re,e.exposure);const c=a.uFogParams;c[0]=r.near||0,c[1]=r.far||99999999,c[2]=r.density||0}s.update(),this.renderer.ubo.updateUniformGroup(s)}};_t.add(Vr,Or,$r,Xr,ta);
