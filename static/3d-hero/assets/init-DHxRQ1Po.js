import{T as te,N as ke,f as Ae,q as Je,s as $e,k as H,M as me,w as N,t as Ze,R as Qe,x as et,y as tt,z as rt,A as at,H as st,I as Be,J as nt,K as ot,E as Y,L as it,O as ie,B as Oe,P as ut,Q as lt,V as ct,W as ge,X as Ve,Y as pe,Z as ze,_ as dt,$ as Ne,S as Z,a0 as pt,a1 as De,a2 as ft,a3 as ht,a4 as mt,a5 as gt,a6 as bt,D as vt,a7 as xt,a8 as Ce,a9 as Ge,aa as yt,ab as wt,ac as St,b as _t,p as Bt}from"./index-DOba0GE3.js";import{G as be,S as Dt,C as Ct,B as ve,g as Fe,e as Gt,c as Pt,a as Pe,b as Tt,t as se,L as Mt,R as Ue,d as je,V as Rt,H as It,r as xe,f as ue,h as Lt,i as Et,j as kt,k as At,l as $t,n as Ot,v as Vt,m as zt,o as Nt,p as Ft,q as Ut,s as jt,u as Wt,M as Ht,w as qt,x as Yt,y as Kt,z as Xt,A as Te,D as Jt,E as Zt,F as Qt,I as er}from"./View3DGCRegistry-BJ1rd7BC.js";import"./RenderTexture-B4iswCQS.js";const Me={atlas:null,indexCount:void 0,firstIndex:void 0,baseVertex:void 0};let fe=0;if(te.EMPTY.source.uid!==0)throw new Error("Texture.EMPTY.source.uid is not 0");if(te.WHITE.source.uid!==1)throw new Error("Texture.WHITE.source.uid is not 1");if(ke.source.uid!==2)throw new Error("NORMAL_MAP.source.uid is not 2");var tr=class{_sources=Array.from({length:10});render(e){const{renderables:t,globalBindGroup:r,instanceData:s,commandList:a,drawData:n,passBit:o,skipTextureBatching:i}=e,u=t.count;if(u===0)return;a.clear();const c=t.indices,l=t.items,f=s,p=this._sources;let h=0,b=0,v=l[c[0]],d=v._passCache[o],m=v.geometry._geometryAtlasAllocation||Me,x=d.batchKey,g=m.atlas?m.atlas.geometry:v.geometry,w=d.shader,A=d.state,_=d.topology,y=fe+=2,B=0,P=null,C=0;C=this._packTextures(v.material,p,y),f[1]=C,B=this._lastSlotCount,P=v.material;for(let S=1;S<u;S++){v=l[c[S]],d=v._passCache[o];const G=d.batchKey,D=G!==x;if(!D){const T=v.material;if(T===P){f[S*2+1]=C;continue}const M=T._textures,I=y+1;let V=0;for(let L=0;L<M.length;L++){const E=M[L].source;E.uid>2&&E._batchTick<y&&(E._batchTick=I,V++)}if(B+V<=10){C=this._commitTextures(M,p,y),f[S*2+1]=C,B=this._lastSlotCount,P=T;continue}}const k=a.next();k.geometry=g,k.shader=w,k.globalBindGroup=r,k.batchBindGroup=void 0,k.state=A,k.topology=_,a.captureGeometry(g);const $=(a.count-1)*5,O=n.ensureCapacity(a.count);if(O[$]=m.indexCount||g.indexCount||g.indexBuffer.data.length,O[$+1]=S-h,O[$+2]=m.firstIndex||0,O[$+3]=m.baseVertex||0,O[$+4]=h,h=S,m=v.geometry._geometryAtlasAllocation||Me,x=G,g=m.atlas?m.atlas.geometry:v.geometry,w=d.shader,A=d.state,_=d.topology,D){const T=v.material;if(T===P){f[S*2+1]=C;continue}const M=T._textures,I=y+1;let V=0;for(let L=0;L<M.length;L++){const E=M[L].source;E.uid>2&&E._batchTick<y&&(E._batchTick=I,V++)}if(B+V<=10){C=this._commitTextures(M,p,y),f[S*2+1]=C,B=this._lastSlotCount,P=T;continue}}if(!i){const T=a.nextBatchBindGroup(p,B),M=a.commands;for(let I=b;I<a.count;I++)M[I].batchBindGroup=T;b=a.count}y=fe+=2,B=0,P=null,C=this._packTextures(v.material,p,y),f[S*2+1]=C,B=this._lastSlotCount,P=v.material}{const S=a.next();S.geometry=g,S.shader=w,S.globalBindGroup=r,S.batchBindGroup=void 0,S.state=A,S.topology=_,a.captureGeometry(g);const G=(a.count-1)*5,D=n.ensureCapacity(a.count);D[G]=m.indexCount||g.indexCount||g.indexBuffer.data.length,D[G+1]=u-h,D[G+2]=m.firstIndex||0,D[G+3]=m.baseVertex||0,D[G+4]=h}if(!i){const S=a.nextBatchBindGroup(p,B),G=a.commands;for(let D=b;D<a.count;D++)G[D].batchBindGroup=S}a.endBuild()}_lastSlotCount=0;_packTextures(e,t,r){const s=e._textures;let a=0,n=0;for(let o=0;o<s.length;o++){const i=s[o].source,u=i.uid;let c;u<=2?c=13+u:i._batchTick===r?c=i._batchSlot:(i._batchTick=r,i._batchSlot=n,t[n]=i,c=n,n++),a|=c<<o*4}return this._lastSlotCount=n,a}_commitTextures(e,t,r){let s=0,a=this._lastSlotCount;for(let n=0;n<e.length;n++){const o=e[n].source,i=o.uid;let u;i<=2?u=13+i:o._batchTick===r?u=o._batchSlot:(o._batchTick=r,o._batchSlot=a,t[a]=o,u=a,a++),s|=u<<n*4}return this._lastSlotCount=a,s}};Ae.register({clear(){fe=0}});const R=new Je({buffer:new $e({data:new Int32Array(1),usage:H.STORAGE|H.COPY_DST|H.COPY_SRC,label:"EmptyBufferResource",shrinkToFit:!1})});function We(e){const t=e?8:4;return{name:e?"morphTargetNormal":"morphTarget",structs:{GeometryData:be},bindings:{global:{uMorphStorage:"storage<f32>",uGeometryStorage:"storage<GeometryData>"}},gpu:{vertex:{input:`
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
      `}}}}const rr=We(!1),ar=We(!0);function Q(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function sr(e){const t=e.some(([s,a])=>s!==0||a!==0),r=[];return t&&r.push("      let texel = 1.0 / sp.z;"),e.forEach(([s,a],n)=>{const o=s===0&&a===0?"uv":`uv + vec2<f32>(${Q(s)}, ${Q(a)}) * texel`;r.push(`      ${n===0?"var s = ":"s += "}textureSampleCompareLevel(uShadowMap, uShadowSampler, ${o}, idx, d);`)}),r.push(e.length===1?"      return s;":`      return s / ${Q(e.length)};`),r.join(`
`)}function le(e){return{name:`shadow:${e}`,bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uShadowData:`array<vec4<f32>, ${me*6}>`}},gpu:{header:`
    fn sampleShadowAtIndex(
      idx: i32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32,
    ) -> f32 {
      // Six vec4 per slot in the global uniforms (layout on ShadowDataList).
      let slot = idx * 6;
      let lightSpaceMatrix = mat4x4<f32>(
        global.uShadowData[slot],
        global.uShadowData[slot + 1],
        global.uShadowData[slot + 2],
        global.uShadowData[slot + 3],
      );
      let sp = global.uShadowData[slot + 4];

      // Normal offset, tapered by how obliquely the light strikes the surface.
      // Depth error across one shadow texel grows as the surface turns away from
      // the light, so a face-on surface needs almost none — and taking none is
      // what stops the offset eating short shadows.
      let biasedPos = worldPos + normal * (sp.y * (1.0 - NdotL));
      let lsp = lightSpaceMatrix * vec4<f32>(biasedPos, 1.0);
      let proj = lsp.xyz / lsp.w;

      let uv = proj.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);

      if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0)) || proj.z < 0.0 || proj.z > 1.0) {
        return 1.0;
      }

      let d = proj.z - sp.x;

${sr(Dt[e])}
    }

    // Takes the light's two shadow fields, not the Light struct. Some mobile
    // drivers misread a storage-buffer struct passed into a function by value,
    // so a light with no shadow would miss the early return below.
    fn calculateShadow(
      shadowDataIndex: f32,
      cascadeCount: f32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32
    ) -> f32 {
      let baseIndex = i32(shadowDataIndex);

      if (baseIndex == -1) {
        return 1.0;
      }

      let last = i32(cascadeCount) - 1;

      // Not cascaded: one map, sampled directly.
      if (last < 1) {
        return sampleShadowAtIndex(baseIndex, worldPos, normal, NdotL);
      }

      let viewDepth = -(camera.uViewMatrix * vec4<f32>(worldPos, 1.0)).z;
      let splits = global.uShadowData[baseIndex * 6 + 5].xyz;

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

      let band = max((splitFar - splitNear) * ${Q(Ct)}, 1e-4);
      let blend = saturate((viewDepth - splitFar + band) / band);

      if (blend <= 0.0) {
        return shadow;
      }

      let next = sampleShadowAtIndex(baseIndex + cascadeIndex + 1, worldPos, normal, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}const nr={hard:le("hard"),pcf:le("pcf"),"pcf-high":le("pcf-high")},ce={name:"skinning",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},structs:{BoneMatrix:ve},bindings:{global:{uBonePitStorage:"storage<BoneMatrix>"}},gpu:{vertex:{header:`
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
      `}}};function or(e,t,r){N(`[collectAttributes] Attribute "${e}" redefined with different format: "${r}" → "${t}". Keeping original.`)}function ir(e){const t=Object.create(null);for(const r of e)if(r.attributes)for(const[s,a]of Object.entries(r.attributes))s in t?t[s]!==a&&or(s,a,t[s]):t[s]=a;return t}const ur={float32:"f32",float32x2:"vec2<f32>",float32x3:"vec3<f32>",float32x4:"vec4<f32>",sint32:"i32",sint32x2:"vec2<i32>",sint32x3:"vec3<i32>",sint32x4:"vec4<i32>",uint32:"u32",uint32x2:"vec2<u32>",uint32x3:"vec3<u32>",uint32x4:"vec4<u32>",float16x2:"vec2<f32>",float16x4:"vec4<f32>",unorm8x2:"vec2<f32>",unorm8x4:"vec4<f32>",snorm8x2:"vec2<f32>",snorm8x4:"vec4<f32>",uint8x2:"vec2<u32>",uint8x4:"vec4<u32>",sint8x2:"vec2<i32>",sint8x4:"vec4<i32>",unorm16x2:"vec2<f32>",unorm16x4:"vec4<f32>",snorm16x2:"vec2<f32>",snorm16x4:"vec4<f32>",uint16x2:"vec2<u32>",uint16x4:"vec4<u32>",sint16x2:"vec2<i32>",sint16x4:"vec4<i32>"};function lr(e){const t=ur[e];return t||(N(`[compileAttributesWgsl] Unknown vertex format: "${e}"`),"vec4<f32>")}function cr(e){const t=Object.keys(e);if(t.length===0)return"";const r=[];r.push("struct VertexInput {");let s=0;for(const a of t){const n=lr(e[a]);r.push(`  @location(${s++}) ${a}: ${n},`)}return r.push("}"),r.join(`
`)}const dr={collectData(e){e.data.attributes=ir(e.bits)},injectCode(e){return{header:cr(e.data.attributes)}}};function pr(e){return{groupIndex:e,bindingIndex:0,resources:Object.create(null),storages:Object.create(null),bindAsUniform:!1}}function Re(e,t,r){N(`[compileBindingsWgsl] Binding "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function fr(e,t,r){N(`[compileBindingsWgsl] Bit "${e}" binding "${t}" has invalid storage type: "${r}". Expected format: storage<StructName>`)}const hr=new Set(["u32","i32","f32","f16","bool"]);function He(e){return e.charAt(0).toUpperCase()+e.slice(1)}function mr(e,t){const r=new Set(t.bindGroups),s=Object.create(null);t.bindGroups.forEach((n,o)=>{s[n]=pr(o)});const a=Object.create(null);for(const n of e)if(n.structs)for(const[o,i]of Object.entries(n.structs))o in a||(a[o]=i);for(const n of e)if(n.bindings)for(const[o,i]of Object.entries(n.bindings)){if(!i)continue;const u=He(o),c=r.has(o);for(const[l,f]of Object.entries(i)){const p=Ze(f);if(Qe.has(p)){if(c){const h=s[o].resources;l in h?h[l]!==p&&Re(l,p,h[l]):h[l]=p}}else if(et(p)){if(c){const h=tt(p);if(!h){fr(n.name,l,p);continue}const b=s[o].storages;l in b||(b[l]=h)}}else{u in a||(a[u]={});const h=a[u];h[l]&&h[l]!==p?Re(l,p,h[l]):h[l]=p,c&&(s[o].bindAsUniform=!0)}}}for(const n in s)for(const o in s[n].storages){const i=s[n].storages[o];!(i in a)&&!hr.has(i)&&(a[i]={})}return{structs:a,bindGroups:s,template:t}}function gr(e){const{bindGroups:t,template:r}=e,s=Object.create(null);for(const a of r.bindGroups){const n=t[a],o=[];let i=n.bindingIndex;n.bindAsUniform&&o.push({name:a,binding:i++,kind:"uniform",type:He(a)});for(const u in n.resources)o.push({name:u,binding:i++,kind:"resource",type:n.resources[u]});for(const u in n.storages)o.push({name:u,binding:i++,kind:"storage",type:n.storages[u]});s[a]={groupIndex:n.groupIndex,entries:o}}return s}function br(e){const{structs:t}=e,r=[];for(const a in t){const n=t[a];r.push(`struct ${a} {`);for(const[o,i]of Object.entries(n))r.push(`  ${o}: ${i},`);r.push("}")}const s=gr(e);for(const a of e.template.bindGroups){const{groupIndex:n,entries:o}=s[a];for(const i of o){const u=`@group(${n}) @binding(${i.binding})`;i.kind==="uniform"?r.push(`${u} var<uniform> ${i.name}: ${i.type};`):i.kind==="resource"?r.push(`${u} var ${i.name}: ${i.type};`):r.push(`${u} var<storage, read> ${i.name}: array<${i.type}>;`)}}return r.join(`
`)}const vr={collectData(e){e.data.bindings=mr(e.bits,e.template),e.data.structs=e.data.bindings.structs},injectCode(e){return{header:br(e.data.bindings)}}};function xr(e){return e.charAt(0).toUpperCase()+e.slice(1)}function re(e,t){return`${e}${xr(t)}`}function yr(e){const t=Fe(e);for(const r of t)if(!(r==="header"||r==="textureGetters"||r.startsWith("vertex")||r.startsWith("fragment"))){const s=re("vertex",r),a=re("fragment",r);N(`[compileShader] Template slot {{${r}}} is not prefixed with "vertex" or "fragment". Did you mean {{${s}}} or {{${a}}}?`)}}const wr={collectData(e){yr(e.templateString),e.data.headers=e.bits.map(t=>t.gpu?.header).filter(t=>!!t?.trim())},injectCode(e){return{header:e.data.headers.join(`

`)}}},Sr=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function Ie(e){return e==="i32"||e==="u32"||e.includes("<i32>")||e.includes("<u32>")}function _r(e,t,r){N(`[compileInterStageWgsl] Inter-stage variable "${e}" redefined with different type: "${r}" → "${t}". Keeping original.`)}function Br(e){const t=Object.create(null);for(const r of e)if(r.interStage)for(const[s,a]of Object.entries(r.interStage))Sr.has(s)||(s in t?t[s]!==a&&_r(s,a,t[s]):t[s]=a);return t}function Dr(e){const t=[],r=Object.keys(e);t.push("struct VertexOutput {"),t.push("  @builtin(position) position: vec4<f32>,");let s=0;for(const a of r){const n=e[a],o=Ie(n)?" @interpolate(flat)":"";t.push(`  @location(${s++})${o} ${a}: ${n},`)}t.push("}"),t.push(""),t.push("struct FragmentInput {"),t.push("  @builtin(position) position: vec4<f32>,"),t.push("  @builtin(front_facing) frontFacing: bool,"),s=0;for(const a of r){const n=e[a],o=Ie(n)?" @interpolate(flat)":"";t.push(`  @location(${s++})${o} ${a}: ${n},`)}return t.push("}"),t.join(`
`)}const Cr={collectData(e){e.data.interStage=Br(e.bits)},injectCode(e){return{header:Dr(e.data.interStage)}}},Gr={collectData(e){e.data.overrides=Pt(e.bits)},injectCode(e){return{header:Gt(e.data.overrides)}}},Pr=/\{\{(.*?)\}\}/g;function Tr(e){const t=new Set;for(const r of e)if(r)for(const s of r.matchAll(Pr))t.add(s[1]);return t}function Mr(e,t){const r=Fe(e),s=Tr(Object.values(t));for(const[a,n]of Object.entries(t))n&&/\S/.test(n)&&!r.has(a)&&!s.has(a)&&N(`[compileShader] Generated code for slot {{${a}}} but template doesn't have it. Slot names are prefixed with stage: vertex.input → {{vertexInput}}, fragment.end → {{fragmentEnd}}.`)}const Rr={collectData(e){e.data.vertexSlots=Pe(e.bits,"gpu","vertex"),e.data.fragmentSlots=Pe(e.bits,"gpu","fragment")},injectCode(e){const t={};for(const[r,s]of Object.entries(e.data.vertexSlots))t[re("vertex",r)]=s.join(`
`);for(const[r,s]of Object.entries(e.data.fragmentSlots))t[re("fragment",r)]=s.join(`
`);return Mr(e.templateString,t),t}};function Ir(e,t){const r=rt(e),s=at(r),a=Object.create(null);for(const n of t)if(n.bindings){for(const o of Object.values(n.bindings))if(o)for(const[i,u]of Object.entries(o))i in a||(a[i]=st(u))}for(const n of r.groups){const o=a[n.name];if(!o||o==="both")continue;const i=s[n.group]?.find(u=>u.binding===n.binding);i&&(i.visibility=o==="vertex"?Be.VERTEX:Be.FRAGMENT)}return s}function de(e){const{bits:t,template:r,extraPlugins:s}=e,a=[Gr,vr,dr,Cr,wr,Rr],n=s?[...s,...a]:a,o={bits:t,template:r,templateString:r.gpu,data:{}},i=Tt(o,n);return{vertex:{source:i,entryPoint:"mainVertex"},fragment:{source:i,entryPoint:"mainFragment"},structs:o.data.structs||{},gpuLayout:Ir(i,t)}}const Lr={preCompile(e){const t=e.data.structs;if(!t?.Material)return;const r=nt(t.Material);if(r.size>256)throw new Error(`[materialStoragePadding] Material struct is ${r.size} bytes, which exceeds the storage buffer stride of 256 bytes — material data would bleed into adjacent material slots. Trim or pack material fields:
${ot(r)}`);if(r.size===256)return;const s=(256-r.size)/4;t.Material._pad=s===1?"f32":`array<f32, ${s}>`}},qe=`
struct DrawArgs {
  indexCount: u32,
  instanceCount: atomic<u32>,
  firstIndex: u32,
  baseVertex: u32,
  firstInstance: u32,
};
`,Er=`
${qe}
@group(0) @binding(0) var<storage, read_write> drawCalls: array<DrawArgs>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let k = gid.x;
  if (k >= arrayLength(&drawCalls)) { return; }
  atomicStore(&drawCalls[k].instanceCount, 0u);
}
`,kr=`
${qe}
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
`;var Ar=class{static extension={type:[Y.WebGPUSystem],name:"compute3d"};_renderer;_zeroPipeline=null;_compactPipeline=null;_zeroBinds=new WeakMap;_compactBinds=new WeakMap;_jobs=[];_jobCount=0;constructor(e){this._renderer=e}renderStart(){this._jobCount=0}dispatch(e,t,r,s,a,n,o,i){if(o===0||i===0)return;let u=this._jobs[this._jobCount];if(!u){const c=new Float32Array(24);u=this._jobs[this._jobCount]={drawCalls:null,src:null,dst:null,store:null,bounds:null,params:new $e({data:c,usage:H.UNIFORM|H.COPY_DST,label:"mesh3d_cull_frustum",shrinkToFit:!1}),paramsF32:c,commandCount:0,instanceCount:0}}u.drawCalls=e,u.src=t,u.dst=r,u.store=s,u.bounds=a,u.paramsF32.set(n),u.params.update(),u.commandCount=o,u.instanceCount=i,this._jobCount++}renderEnd(){const e=this._jobCount;if(this._jobCount=0,e===0)return;const t=this._renderer.gpu.device,r=this._renderer.buffer,s=this._zeroPipeline||this._buildPipeline(t,Er,"_zeroPipeline"),a=this._compactPipeline||this._buildPipeline(t,kr,"_compactPipeline"),n=t.createCommandEncoder(),o=this._jobs,i=n.beginComputePass();i.setPipeline(s);for(let c=0;c<e;c++){const l=o[c],f=r.getGPUBuffer(l.drawCalls);i.setBindGroup(0,this._zeroBindGroup(t,s,f,l.commandCount)),i.dispatchWorkgroups(Math.ceil(l.commandCount/64))}i.end();const u=n.beginComputePass();u.setPipeline(a);for(let c=0;c<e;c++){const l=o[c];u.setBindGroup(0,this._compactBindGroup(t,a,l,r)),u.dispatchWorkgroups(Math.ceil(l.instanceCount/64))}u.end(),t.queue.submit([n.finish()]);for(let c=0;c<e;c++)o[c].drawCalls=null,o[c].src=null,o[c].dst=null,o[c].store=null,o[c].bounds=null}_zeroBindGroup(e,t,r,s){const a=this._zeroBinds.get(r);if(a&&a.commandCount===s)return a.bindGroup;const n=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r,offset:0,size:s*20}}]});return this._zeroBinds.set(r,{bindGroup:n,commandCount:s}),n}_compactBindGroup(e,t,r,s){const a=s.getGPUBuffer(r.src),n=s.getGPUBuffer(r.dst),o=s.getGPUBuffer(r.drawCalls),i=s.getGPUBuffer(r.store),u=s.getGPUBuffer(r.bounds),c=s.getGPUBuffer(r.params),l=this._compactBinds.get(o);if(l&&l.src===a&&l.dst===n&&l.drawCalls===o&&l.store===i&&l.bounds===u&&l.params===c&&l.commandCount===r.commandCount&&l.instanceCount===r.instanceCount)return l.bindGroup;const f=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:a,offset:0,size:r.instanceCount*8}},{binding:1,resource:{buffer:n,offset:0,size:r.instanceCount*8}},{binding:2,resource:{buffer:o,offset:0,size:r.commandCount*20}},{binding:3,resource:{buffer:i}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:c}}]});return this._compactBinds.set(o,{bindGroup:f,src:a,dst:n,drawCalls:o,store:i,bounds:u,params:c,commandCount:r.commandCount,instanceCount:r.instanceCount}),f}_buildPipeline(e,t,r){const s=e.createShaderModule({code:t}),a=e.createComputePipeline({layout:"auto",compute:{module:s,entryPoint:"main"}});return this[r]=a,a}destroy(){for(const e of this._jobs)e.params?.destroy();this._jobs.length=0,this._zeroPipeline=null,this._compactPipeline=null,this._zeroBinds=new WeakMap,this._compactBinds=new WeakMap,this._jobCount=0}};const $r=new Float32Array(24);function q(e,t,r,s){const a=e.gpuData.instanceBuffer.data,n=s.survivors,o=s.indirectDrawData,i=n.data,u=o.drawCalls,c=e.commandList.count,l=e.view.count,f=e.view.items,p=e.view.indices,h=t.storeBuffer.u32Data,b=t.storeBuffer.stride,v=r!==null,d=v?se(r,t.storeBuffer.data):$r,m=d[0],x=d[1],g=d[2],w=d[3],A=d[4],_=d[5],y=d[6],B=d[7],P=d[8],C=d[9],S=d[10],G=d[11],D=d[12],k=d[13],$=d[14],O=d[15],T=d[16],M=d[17],I=d[18],V=d[19],L=d[20],E=d[21],Ye=d[22],Ke=d[23];for(let F=0;F<c;F++){const ne=u[F*5+4],Xe=F+1<c?u[(F+1)*5+4]:l;let K=ne*2;for(let X=ne;X<Xe;X++){const we=X*2,Se=a[we];if(h[Se*b+19]!==0){if(v){const _e=f[p[X]].boundingSphere,z=_e.radius;if(z>=0){const oe=_e.center,U=oe.x,j=oe.y,W=oe.z;if(m*U+x*j+g*W+w<-z||A*U+_*j+y*W+B<-z||P*U+C*j+S*W+G<-z||D*U+k*j+$*W+O<-z||T*U+M*j+I*W+V<-z||L*U+E*j+Ye*W+Ke<-z)continue}}i[K]=Se,i[K+1]=a[we+1],K+=2}}u[F*5+1]=(K>>1)-ne}s.lastVisibilityDirtyId=t._visibilityDirtyId,n.upload(l),o.upload(c)}const J={name:"global",structs:{Renderable:je,RenderableInstance:Ue,BoneMatrix:ve,GeometryData:be,Light:Mt},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uFogColor:"vec3<f32>",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${me*6}>`,uSampler:"sampler",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uBrdfLutSampler:"sampler",uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uOpaqueDepthTexture:"texture_depth_2d",uOpaqueColorTexture:"texture_2d<f32>",uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}},gpu:{header:`
const LIGHT_DIRECTIONAL: f32 = 0.0;
const LIGHT_POINT: f32 = 1.0;
const LIGHT_SPOT: f32 = 2.0;
`}};function he(e,t){let r=e._gpuData[t.uid];if(!r){const s=new it({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uTime:{value:0,type:"f32"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"},uLightData:{value:e._lightDataList.data,type:"vec4<f32>",size:128},uShadowData:{value:e._shadowDataList.data,type:"vec4<f32>",size:me*6}});s.isStatic=!0,s.ubo=!1,t.ubo.ensureUniformGroup(s),s.buffer.autoGarbageCollect=!1;const a=new ie;a.addressMode="repeat";const n=new ie;n.compare="less";const o=new ie;o.addressMode="clamp-to-edge";const i=new Oe({0:s,1:a,2:ct.source,3:te.EMPTY.source,4:o,5:lt.source,6:n,7:ut,8:te.EMPTY.source,9:R,10:R,11:e._bonePit.bufferResource,12:R,13:R,14:R});r=new Rt(s,i),e._gpuData[t.uid]=r}return r}var Or=class{static extension={type:[Y.WebGPUSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){const r=e.passByBit[ge.SHADOW];r?.beginFrame(e);const{_lightDataList:s,environment:a}=e;s.reset();const n=he(e,this._renderer).globalUniformGroup.uniforms,o=n.uGlobalLightParams;if(o[0]=0,o[1]=0,o[2]=0,a!==null&&!(a instanceof Ve)){const i=a.intensity??1,u=n.uHemisphereSky,c=n.uHemisphereGround,l=n.uHemisphereUp,f=ze.shared;pe(u,0,f.setValue(a.skyColor),i),pe(c,0,f.setValue(a.groundColor),i);const p=a.up??It,h=p.x*p.x+p.y*p.y+p.z*p.z,b=h>0?1/Math.sqrt(h):0;l[0]=p.x*b,l[1]=p.y*b,l[2]=p.z*b}for(let i=0;i<t.length;i++){const u=t[i];if(u._worldVisible){if(u.type==="ambient"){const c=u,l=c.color,f=c.intensity;dt(o,0,l,f);continue}s.count>=32||(r?.prepareShadow(u,e),s.add(u))}}o[3]=s.count}};const Vr=`
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
`;var zr=class{static extension={type:[Y.WebGPUSystem],name:"mipChain3d"};_renderer;_shaderModule=null;_sampler=null;_pipelines=Object.create(null);_cache=Object.create(null);constructor(e){this._renderer=e}generate(e){if(e.mipLevelCount<=1)return;const t=this._renderer.gpu.device,r=this._renderer.encoder.commandEncoder,s=this._pipeline(t,e.format),{bindGroups:a,dstViews:n}=this._cache[e.uid]||this._buildCacheEntry(e);for(let o=0;o<n.length;o++){const i=r.beginRenderPass({colorAttachments:[{view:n[o],loadOp:"clear",storeOp:"store",clearValue:{r:0,g:0,b:0,a:0}}]});i.setPipeline(s),i.setBindGroup(0,a[o]),i.draw(3),i.end()}}_buildCacheEntry(e){const t=this._renderer.gpu.device,r=this._pipeline(t,e.format),s=this._renderer.texture.getGpuSource(e),a=[],n=[],o=r.getBindGroupLayout(0);for(let u=1;u<e.mipLevelCount;u++)n.push(s.createView({baseMipLevel:u,mipLevelCount:1,dimension:"2d"})),a.push(t.createBindGroup({layout:o,entries:[{binding:0,resource:this._sampler},{binding:1,resource:s.createView({baseMipLevel:u-1,mipLevelCount:1,dimension:"2d"})}]}));const i={bindGroups:a,dstViews:n};return this._cache[e.uid]=i,i}_pipeline(e,t){const r=this._pipelines[t];if(r)return r;this._shaderModule||=e.createShaderModule({code:Vr}),this._sampler||=e.createSampler({minFilter:"linear"});const s=e.createRenderPipeline({layout:"auto",vertex:{module:this._shaderModule,entryPoint:"vertexMain"},fragment:{module:this._shaderModule,entryPoint:"fragmentMain",targets:[{format:t}]}});return this._pipelines[t]=s,s}destroy(){this._shaderModule=null,this._sampler=null,this._pipelines=Object.create(null),this._cache=Object.create(null)}};function Nr(e){const{pipe:t,bit:r,session:s,sortBatch:a,skipTextureBatching:n=!1}=e,{view3d:o}=s,i=t.renderer.material3d.batcher,u=Ne(e.camera??o.camera).position;for(const c of o._meshBatches){if(!c.renderData._worldVisible)continue;const l=c.drawLists[r];if(!l)continue;const f=l.view;if(f.count===0||!l.isDrawStale(f.count))continue;a?a(f,c,u):f.sort();const p=l.gpuData;p.instanceBuffer.populateIds(f),i.render({renderables:f,globalBindGroup:s.globalBindGroup,instanceData:p.instanceBuffer.data,commandList:l.commandList,drawData:l.drawData,passBit:r,skipTextureBatching:n}),p.instanceBuffer.upload(f.count),l._cullProducer=xe(o.cull,!0,f.count)}}function Fr(e){const{pipe:t,bit:r,cullResults:s,session:a}=e,{view3d:n}=a,o=t.geometryDataStoreBuffer.buffer,i=(e.camera??n.camera).cullFrustum.planesData;s.removeDetached(n);for(const u of n._meshBatches){if(!u.renderData._worldVisible)continue;const c=u.drawLists[r];if(!c||c.view.count===0)continue;const l=s.ensure(u);l.sync(c);const f=c._cullProducer;if(f==="off"){l.lastVisibilityDirtyId!==u._visibilityDirtyId&&q(c,u,null,l);continue}if(f==="cpu"){q(c,u,i,l);continue}const p=se(i,u.storeBuffer.data);t.renderer.compute3d.dispatch(l.indirectDrawData.drawCallsBuffer,c.gpuData.instanceBuffer.buffer,l.survivors.buffer,u.storeBuffer.buffer,o,p,c.commandList.count,c.view.count)}}function Le(e){const{pipe:t,bit:r,cullResults:s,session:a,useBundles:n,alwaysRebuild:o,sortBatch:i,skipTextureBatching:u=!1}=e;if(!n&&!o)throw new Error("renderForwardBatchesGpu: useBundles=false requires alwaysRebuild=true (immediate replay needs per-batch bindings re-bound every frame).");const{view3d:c}=a,l=t.renderer.encoder,f=t.renderer.material3d.batcher,p=t.renderer.gc.now,h=e.camera??c.camera,b=Ne(h),v=h.cullFrustum.planesData,d=t.geometryDataStoreBuffer.buffer;n||s.removeDetached(c);let m=0;for(const x of c._meshBatches){if(!x.renderData._worldVisible)continue;const g=x.drawLists[r];if(!g)continue;const w=g.view;if(w.count===0){if(g.claimDrawEmpty(),n){const y=s.get(x);y&&(y.bundle=null,y.claimBundleRecorded(g,b.bindGroup))}continue}const A=o||g.isDrawStale(w.count),_=s.ensure(x);if(n){const y=_.bundle;(!y||_.isBundleStale(g,b.bindGroup)||!l.isBundleValid(y))&&(a.globalBindGroup.setResource(x.storeBuffer.bufferResource,9),a.globalBindGroup.setResource(_.survivors.bufferResource,10),l.beginBundle(`view3d pass ${r} batch ${x.uid}`),g.commandList.replay(l,t.renderer.buffer,_.indirectDrawData,b),_.bundle=l.endBundle(),_.claimBundleRecorded(g,b.bindGroup))}else if(A){i?i(w,x,b.position):w.sort();const y=g.gpuData;y.instanceBuffer.populateIds(w),f.render({renderables:w,globalBindGroup:a.globalBindGroup,instanceData:y.instanceBuffer.data,commandList:g.commandList,drawData:g.drawData,passBit:r,skipTextureBatching:u}),y.instanceBuffer.upload(w.count),_.sync(g),a.globalBindGroup.setResource(x.storeBuffer.bufferResource,9),a.globalBindGroup.setResource(_.survivors.bufferResource,10);const B=xe(c.cull,!0,w.count);if(g._cullProducer=B,B==="gpu"){const P=se(v,x.storeBuffer.data);t.renderer.compute3d.dispatch(_.indirectDrawData.drawCallsBuffer,y.instanceBuffer.buffer,_.survivors.buffer,x.storeBuffer.buffer,d,P,g.commandList.count,g.view.count)}else q(g,x,B==="cpu"?v:null,_)}g.claimDrawBuilt(w.count),n?(g.commandList.touch(p),ee[m++]=_.bundle):g.commandList.replay(l,t.renderer.buffer,_.indirectDrawData,b)}m>0&&(l.executeBundle(ee),ee.length=0)}const ee=[];Ae.register({clear:()=>{ee.length=0}});const Ur=[[13,"vec4<f32>(0.0)"],[14,"vec4<f32>(1.0)"],[15,"vec4<f32>(0.5, 0.5, 1.0, 1.0)"]],ae=e=>`textureSampleGrad(uBatchTexture${e}, uSampler, uv, uvDx, uvDy)`,ye=Array.from({length:10},(e,t)=>t),jr=Object.fromEntries(ye.map(e=>[`uBatchTexture${e}`,"texture_2d<f32>"])),Wr=`fn sampleBatchSlotGrad(
  slot: u32,
  uv: vec2<f32>,
  uvDx: vec2<f32>,
  uvDy: vec2<f32>,
) -> vec4<f32> {
  // Constant black, white, and flat-normal slots bypass texture selection.
  if (slot >= 13u) {
    let value = select(1.0, 0.0, slot == 13u);
    let xy = value * select(1.0, 0.5, slot == 15u);
    return vec4<f32>(xy, xy, value, value);
  }

  // Pixi-style: switch on a *flat* interpolated value (uniform per primitive).
  switch (slot) {
${ye.map(e=>`    case ${e}u: { return ${ae(e)}; }`).join(`
`)}
    default: { return ${ae(9)}; }
  }
}`,Hr=`fn sampleBatchSlotGrad(
  slot: u32,
  uv: vec2<f32>,
  uvDx: vec2<f32>,
  uvDy: vec2<f32>,
) -> vec4<f32> {
  // Every slot is fetched and the result picked without branching: see prefersSelectSampler.
  var result = ${ae(9)};
${ye.slice(0,-1).map(e=>`  result = select(result, ${ae(e)}, slot == ${e}u);`).join(`
`)}
${Ur.map(([e,t])=>`  result = select(result, ${t}, slot == ${e}u);`).join(`
`)}
  return result;
}`,qr=e=>`
//=============================================================================
// BATCH TEXTURE HELPERS
//=============================================================================
var<private> _textureSlots: u32;

fn _unpackSlot(slots: u32, shift: u32) -> u32 {
  return (slots >> shift) & 0xFu;
}

${e==="select"?Hr:Wr}

fn sampleBatchTexture(
  slots: u32,
  shift: u32,
  uv: vec2<f32>,
  uvDx: vec2<f32>,
  uvDy: vec2<f32>
) -> vec4<f32> {
  return sampleBatchSlotGrad(_unpackSlot(slots, shift), uv, uvDx, uvDy);
}
`;function Yr({adapter:e,antialias:t,userAgent:r}){return t&&e?.vendor==="apple"&&!r.includes("Firefox")}function Kr(e){const t=qr(e);return{collectData(r){r.bits.some(s=>s.name==="batchTexturesBindings")||r.bits.unshift({name:"batchTexturesBindings",bindings:{batch:jr},gpu:{header:t}})},injectCode(r){let s=0;const a=[];for(const n of r.bits)if(n.textures)for(const o of n.textures){const i=`sample${o[0].toUpperCase()}${o.slice(1)}`,u=s*4;a.push(`fn ${i}Direct(uv: vec2<f32>) -> vec4<f32> {`,`  return sampleBatchTexture(_textureSlots, ${u}u, uv, vec2<f32>(0.0), vec2<f32>(0.0));`,"}"),a.push(`fn ${i}(uv: vec2<f32>) -> vec4<f32> {`,`  return sampleBatchTexture(_textureSlots, ${u}u, uv, dpdx(uv), dpdy(uv));`,"}"),s++}return{textureGetters:a.join(`
`)}}}}const Xr=new gt({}),Jr=`


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
  var clipPosition = camera.uViewProjectionMatrix * worldPosition;

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
`,Zr={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32",vTextureSlots:"u32"}},Qr={name:"materialStorageBinding",bindings:{global:{uMaterialStorage:"storage<Material>"}}},ea={bindGroups:["global","camera","batch"],gpu:Jr};var ta=class{static extension={type:[Y.WebGPUSystem],name:"material3d"};batcher=new tr;_destroyed=!1;_renderer;_shaderCache=new Map;_materialPlugins=null;constructor(e){this._renderer=e}computeBatchKey(e,t){const r=e._passCache[t];return this._renderer.pipeline.getPipelineKey(e.geometry,r.shader.gpuProgram,r.state,r.topology,r.shader._overrides||Object.create(null))}compilePassShader(e,t){return Z.from({gpu:de({bits:[J,ue,...e],template:t})})}compileIsolatedShader(e,t,r){return Z.from({gpu:de({bits:e,template:t}),groups:r})}compileShader(e,t,r,s){const a=[];let n="";(e.includeGlobal??!0)&&(a.push(J),n+=`${J.name}|`),(e.includeCamera??!0)&&(a.push(ue),n+=`${ue.name}|`),a.push(...e.bitsGpu),n+=e.keyGpu,pt(a,e.template);const o=Lt(t.geometry.attributes.aPosition.format);De(o),a.push(o),n+=`|${o.name}`,t.morph&&(t.geometry.hasMorphNormals?(a.push(ar),n+="|morphN"):(a.push(rr),n+="|morph")),t.skeleton&&(De(ce),a.push(ce),n+=`|${ce.name}`),s&&(ft(a,t.material),ht(a,t.material));let i=this._shaderCache.get(n);if(!i){const u=de({bits:a,template:e.template,extraPlugins:r});i=Z.from({gpu:u,overrides:e.overrides}),this._shaderCache.set(n,i)}return i}ensureMaterial(e,t){const r=e.geometry,s=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(s);const a=s._passBit&ge.MATERIAL_PASS_MASK,n=s._passes[a],o=s.getPrimaryDescriptor(t),i=[J,Zr,Qr];r.attributes.aNormal&&i.push(Ut),r.attributes.aUV&&i.push(Et(r.attributes.aUV.format)),s.doubleSided&&i.push(kt),s.flatShading&&i.push(At);const u=s.textures.normal;u&&u!==ke&&r.attributes.aUV&&i.push(r.attributes.aTangent?$t:Ot),r.attributes.aColor&&e.material.vertexColors&&i.push(Vt);const c=e.material.lit;e.billboardMode!=="none"&&i.push(zt(e.billboardMode,c));const l=!!r.attributes.aTangent;for(let x=0;x<o.bitsGpu.length;x++){const g=o.bitsGpu[x];i.push(l?mt(g):g)}const f=t._fogBit;f&&s.fog&&i.push(f);const p=t._toneMappingBit;e.material.toneMapped&&p&&i.push(p),c&&i.push(e.receiveShadow&&t._hasShadows?nr[t.shadowFilter]:Nt);const h=Xr.update({bitsGpu:i,template:o.template??ea,overrides:{HAS_UVS:r.attributes.aUV?1:0,...o.overrides},includeGlobal:!1}),b=this.compileShader(h,e,this._getMaterialPlugins(),!0),v=n&&n.state||s.state,d=n&&n.topology||s.topology||r.topology,m=e._passCache[a];return m?(m.shader=b,m.state=v,m.topology=d):e._passCache[a]=new bt(b,v,d),b}_getMaterialPlugins(){if(!this._materialPlugins){const e=Yr({adapter:this._renderer.gpu.adapter.info,antialias:this._renderer.view.texture.source.antialias,userAgent:vt.get().getNavigator().userAgent});this._materialPlugins=[Ft,Lr,Kr(e?"select":"branch")]}return this._materialPlugins}destroy(){if(!this._destroyed){this._destroyed=!0;for(const e of this._shaderCache.values())e.destroy();this._shaderCache.clear(),this._materialPlugins=null}}};const ra={name:"shadowGlobal",structs:{Renderable:je,RenderableInstance:Ue,BoneMatrix:ve,GeometryData:be},bindings:{global:{uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}}},aa={bindGroups:["global","camera","local"],gpu:`

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
  let clipPosition = camera.uViewProjectionMatrix * worldPosition;

  output.position = clipPosition;

  {{vertexEnd}}

  return output;
}

@fragment
fn mainFragment(input: FragmentInput){
}
`};var sa=class extends jt{_bundleRun=[];_globalBindGroup=new Oe({0:R,1:R,2:R,3:R,4:R});constructor(e){const t=xt();t.depthTest=!0,t.depthMask=!0,t.culling=!0,t.clockwiseFrontFace=!1,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:ge.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGpu:[ra],template:aa,includeGlobal:!1},state:t}})}_applyZRangeFix=!0;prepare(e){const{view3d:t,lights:r}=e;this._bindShadowSource(t,this.renderTarget.depthStencilTexture);const s=t.cull!=="off",a=this.pipe.renderer.material3d.batcher,n=this.pipe.renderer.compute3d,o=this.pipe.geometryDataStoreBuffer.buffer;for(const i of t._meshBatches){if(!i.renderData._worldVisible)continue;const u=i.drawLists[this.bit];if(!u)continue;const c=u.gpuData,l=u.view;if(l.count===0){u.claimDrawEmpty(),u._cullProducer="off";continue}u.isDrawStale(l.count)&&(u.claimDrawBuilt(l.count),l.sort(),c.instanceBuffer.populateIds(l),a.render({renderables:l,globalBindGroup:this._globalBindGroup,instanceData:c.instanceBuffer.data,commandList:u.commandList,drawData:u.drawData,passBit:this.bit,skipTextureBatching:!0}),c.instanceBuffer.upload(l.count)),u._cullProducer=s?xe(t.cull,!0,l.count):"off"}for(let i=0;i<r.length;i++){const u=r[i],c=u._gpuShadowData;if(!c||(c.cullResults?.removeDetached(t),!Ce(u)))continue;const l=Ge(u),f=c.cascades,p=c.cullResults??=new yt;for(let h=0;h<l;h++){const b=f?.[h];if(!b||!b.needsRender)continue;const v=s?b.cameraData.frustum:null;for(const d of t._meshBatches){if(!d.renderData._worldVisible)continue;const m=d.drawLists[this.bit];if(!m||m.view.count===0)continue;if(h===0)for(let w=l;w<4;w++)p.remove(d,w);const x=p.ensure(d,h);x.sync(m);const g=m._cullProducer;if(g==="off")x.lastVisibilityDirtyId!==d._visibilityDirtyId&&q(m,d,null,x);else if(g==="cpu")q(m,d,v.planesData,x);else{const w=se(v.planesData,d.storeBuffer.data);n.dispatch(x.indirectDrawData.drawCallsBuffer,m.gpuData.instanceBuffer.buffer,x.survivors.buffer,d.storeBuffer.buffer,o,w,m.commandList.count,m.view.count)}}}}}render(e){const{view3d:t,lights:r}=e,s=this.pipe.renderer,a=s.encoder,n=s.pipeline;n.setColorMask(0);for(const o of r){if(!Ce(o))continue;const i=this.getShadowGPUData(o).cullResults;if(!i)continue;const u=Ge(o);for(let c=0;c<u;c++){const l=this._cascadeSlot(o,c);if(!l.needsRender)continue;const f=o._shadowDataIndex+c,p=l.cameraData.bindGroup;s.renderTarget.bind({target:this.renderTarget,clear:!0,layer:f}),s.ubo.updateUniformGroup(l.cameraData.uniformGroup),l.cameraData.uniformGroup.buffer.autoGarbageCollect=!1;for(const h of t._meshBatches){if(!h.renderData._worldVisible)continue;const b=h.drawLists[this.bit];if(!b||b.view.count===0)continue;const v=i.get(h,c);if(!v)continue;const d=v.bundle;if(!d||v.isBundleStale(b,p)||!a.isBundleValid(d)){const m=this._globalBindGroup;m.setResource(h.storeBuffer.bufferResource,0),m.setResource(v.survivors.bufferResource,1),m.setResource(t._bonePit.bufferResource,2),m.setResource(this.pipe._morphStoreBuffer.bufferResource,3),m.setResource(this.pipe.geometryDataStoreBuffer.bufferResource,4),a.beginBundle(`shadow cascade ${c} batch ${h.uid}`),b.commandList.replay(a,s.buffer,v.indirectDrawData,l.cameraData),v.bundle=a.endBundle(),v.claimBundleRecorded(b,p)}b.commandList.touch(s.gc.now),this._bundleRun.push(v.bundle)}this._bundleRun.length>0&&(a.executeBundle(this._bundleRun),this._bundleRun.length=0)}this._completeShadowUpdate(o)}n.setColorMask(15),e.activeTarget=null}destroy(){this._destroyed||(this._globalBindGroup.destroy(),super.destroy())}};const na=13421772,Ee=new ze;var oa=class{static extension={type:[Y.WebGPUPipes],name:"view3d"};renderer;_brdfLutTexture;_iblEnvironmentMap={};_viewport=new wt;_sortForwardByDistance=(e,t,r)=>{Wt(e,t.storeBuffer.data,r)};materialStoreBuffer=new Ht;_morphStoreBuffer=new qt;geometryDataStoreBuffer=new Yt;globalSlots={opaqueColor:8,opaqueDepth:7,shadowMap:5};atlasPool=Kt.from({rebaseIndices:!1});_managedViews;_indirectChecked=!1;_destroyed=!1;constructor(e){this.renderer=e,this._managedViews=new Xt(this.renderer)}createShadowPass(e){return new sa({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}renderForward(e,t){const r=Te(e),s=e.textures===!1;if(e.sort==="distance"){Le({pipe:this,bit:e.bit,cullResults:e.cullResults,camera:e.camera,session:t,useBundles:r,alwaysRebuild:!r,sortBatch:this._sortForwardByDistance,skipTextureBatching:s});return}Le({pipe:this,bit:e.bit,cullResults:e.cullResults,camera:e.camera,session:t,useBundles:r,alwaysRebuild:!r,skipTextureBatching:s})}prepareForward(e,t){if(!Te(e))return;const r={pipe:this,bit:e.bit,cullResults:e.cullResults,camera:e.camera,session:t,skipTextureBatching:e.textures===!1};Nr(r),Fr(r)}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.encoder.setViewport(e)}_depthClearGeometry=null;_depthClearShader=null;_depthClearState=null;clearDepth(e){this._depthClearShader||this._buildDepthClear();const{encoder:t,pipeline:r}=this.renderer;r.setColorMask(0),t.draw({geometry:this._depthClearGeometry,shader:this._depthClearShader,state:this._depthClearState}),r.setColorMask(15)}_buildDepthClear(){this._depthClearGeometry=new St({attributes:{aPosition:new Float32Array([-1,-1,3,-1,-1,3])}});const e=new _t;e.depthTest=!1,e.depthMask=!0,e.culling=!1,e.blend=!1,this._depthClearState=e,this._depthClearShader=Z.from({gpu:{vertex:{entryPoint:"mainVertex",source:`
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
              return vec4<f32>(0.0, 0.0, 0.0, 1.0);
            }
          `}}})}copyColor(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.colorTexture)return;const s=t.view3d._graph._texture(e,t);this.renderer.renderTarget.finishRenderPass();const a=t.activeViewport,n=s.frame,o=s.source.resolution;this.renderer.renderTarget.copyToTexture(r,s,{x:a.x,y:a.y},{width:a.width,height:a.height},{x:Math.round(n.x*o),y:Math.round(n.y*o)}),t.activeTarget=null}generateMips(e,t){const r=t.view3d._graph._texture(e,t).source;this.renderer.renderTarget.finishRenderPass(),t.activeTarget=null,this.renderer.mipChain3d.generate(r)}copyDepth(e,t){const r=this.renderer.renderTarget.renderTarget;if(!r.depthStencilTexture)return;const s=t.view3d._graph._texture(e,t);this.renderer.renderTarget.finishRenderPass();const a=t.activeViewport;this.renderer.renderTarget.copyDepthTexture(r,s,{x:a.x,y:a.y},{width:a.width,height:a.height},{x:0,y:0}),t.activeTarget=null}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;if(!this._indirectChecked&&(this._indirectChecked=!0,!this.renderer.gpu.device.features.has("indirect-first-instance")))throw new Error("@pixi/3d requires the WebGPU 'indirect-first-instance' feature (used by the batched indirect draw path).");e._ensureInitialized(this.renderer);const t=he(e,this.renderer);this._managedViews.track(e);const r=e.environment;if(r&&(this._brdfLutTexture||=Jt({renderer:this.renderer,size:512}),t.globalBindGroup.setResource(this._brdfLutTexture.source,3),r instanceof Ve)){const n=r.source.uid;this._iblEnvironmentMap[n]||(this._iblEnvironmentMap[n]=Zt({renderer:this.renderer,sourceTexture:r,size:256,sampleCount:1024})),t.globalBindGroup.setResource(this._iblEnvironmentMap[n].source,2)}const s=e.lights;if(e._meshSlots.count===0&&e._meshBatches.length===1)return;const a={view3d:e,lights:s,defaultTarget:this.renderer.renderTarget.renderTarget,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,renderer:this.renderer};Qt(e,this,a)&&(t.globalBindGroup.setResource(e._bonePit.bufferResource,11),t.globalBindGroup.setResource(this._morphStoreBuffer.bufferResource,12),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.bufferResource,13),t.globalBindGroup.setResource(this.materialStoreBuffer.bufferResource,14),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),this.atlasPool.update(),er(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer,this.geometryDataStoreBuffer)&&e._invalidateDrawCaches(),this.prepareView(a),e._graph.run(a))}destroy(){if(!this._destroyed){this._destroyed=!0,this._managedViews.destroy(),this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0;for(const e in this._iblEnvironmentMap)this._iblEnvironmentMap[e].destroy(!0);this._iblEnvironmentMap={},this.materialStoreBuffer.destroy(),this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearGeometry?.destroy(!0),this._depthClearGeometry=null,this._depthClearShader?.destroy(),this._depthClearShader=null,this._depthClearState=null}}prepareView(e){const{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){const{fog:t}=e,r=he(e,this.renderer).globalUniformGroup,s=r.uniforms;if(s.uTime=performance.now()/1e3,s.uExposure=e.exposure,t){Ee.setValue(t.color??na),pe(s.uFogColor,0,Ee,e.exposure);const a=s.uFogParams;a[0]=t.near||0,a[1]=t.far||99999999,a[2]=t.density||0}r.update(),this.renderer.ubo.updateUniformGroup(r)}};Bt.add(Ar,Or,zr,ta,oa);
