"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["7259"],{29526(e,t,r){r.r(t),r.d(t,{buildWgslBindingMap:()=>z,wgslOverridesPlugin:()=>ee,wgslStageSlotsPlugin:()=>ea,materialTextureAccessPlugin:()=>eu,renderForwardBatchesGpu:()=>eZ,skinningBitGpu:()=>R,getGlobalGpuData:()=>g,morphTargetBitGpu:()=>B,createTexturesPluginGpu:()=>ed,generateWgslStructAccessor:()=>O,wgslAttributesPlugin:()=>V,prefixSlotName:()=>q,GPU_VISIBILITY_MIN:()=>eW,ShadowRenderPassGpu:()=>e4,morphTargetNormalBitGpu:()=>D,wgslFragmentOutputsPlugin:()=>H,instanceAccessPlugin:()=>L,prepareForwardBatchesGpu:()=>eJ,produceCpuCompaction:()=>eq,shadowBitsGpu:()=>$,wgslHeadersPlugin:()=>J,MaterialSystemGpu:()=>ez,globalBitGpu:()=>h,emitBindingsWgsl:()=>N,LightingSystemGpu:()=>w,computeForwardBatchesGpu:()=>eY,collectBindings:()=>F,shadowGlobalBitGpu:()=>e0,compileWgslSource:()=>eo,wgslInterStagePlugin:()=>X,View3DPipeGpu:()=>tc,ComputeSystemGpu:()=>u,MipChainSystemGpu:()=>_,produceVisibilityCompaction:()=>eH,wgslBindingsPlugin:()=>U});var a=r(12385),i=r(54537);let n=`
struct DrawArgs {
  indexCount: u32,
  instanceCount: atomic<u32>,
  firstIndex: u32,
  baseVertex: u32,
  firstInstance: u32,
};
`,o=`
${n}
@group(0) @binding(0) var<storage, read_write> drawCalls: array<DrawArgs>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let k = gid.x;
  if (k >= arrayLength(&drawCalls)) { return; }
  atomicStore(&drawCalls[k].instanceCount, 0u);
}
`,s=`
${n}
struct Frustum { planes: array<vec4<f32>, 6> };

@group(0) @binding(0) var<storage, read>       srcInstances: array<u32>;
@group(0) @binding(1) var<storage, read_write> dstInstances: array<u32>;
@group(0) @binding(2) var<storage, read_write> drawCalls:    array<DrawArgs>;
@group(0) @binding(3) var<storage, read>       store:        array<u32>;
@group(0) @binding(4) var<storage, read>       geomBounds:   array<vec4<f32>>;
@group(0) @binding(5) var<uniform>             frustum:      Frustum;

const STRIDE: u32 = 24u;
const GEOM_LANE: u32 = 18u;
const VIS_LANE: u32 = 19u;
const NO_BOUNDS: u32 = 0xffffffffu;

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
  let instanceCount = arrayLength(&srcInstances);
  if (i >= instanceCount) { return; }

  let id = srcInstances[i];
  if (store[id * STRIDE + VIS_LANE] == 0u) { return; }

  var lo = 0u;
  var hi = arrayLength(&drawCalls) - 1u;
  while (lo < hi) {
    let mid = (lo + hi + 1u) >> 1u;
    if (drawCalls[mid].firstInstance <= i) { lo = mid; } else { hi = mid - 1u; }
  }

  let boundsSlot = store[id * STRIDE + GEOM_LANE];
  if (boundsSlot != NO_BOUNDS) {
    let sphere = geomBounds[boundsSlot * 2u];
    if (sphere.w >= 0.0) {
      let local = loadMatrix(id * STRIDE);
      let center = local * vec4<f32>(sphere.xyz, 1.0);
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
  dstInstances[drawCalls[lo].firstInstance + slot] = id;
}
`;var u=class{static extension={type:[i.AgS.WebGPUSystem],name:"compute3d"};_renderer;_zeroPipeline=null;_compactPipeline=null;_zeroBinds=new WeakMap;_compactBinds=new WeakMap;_jobs=[];_jobCount=0;_destroyed=!1;constructor(e){this._renderer=e}renderStart(){this._jobCount=0}dispatch(e,t,r,n,o,s,u,l){if(0===u||0===l)return;let d=this._jobs[this._jobCount];if(!d){let e=new Float32Array(24);d=this._jobs[this._jobCount]={drawCalls:null,src:null,dst:null,store:null,bounds:null,params:new a.c({data:e,usage:i.Sdw.UNIFORM|i.Sdw.COPY_DST,label:"mesh3d_cull_frustum",shrinkToFit:!1}),paramsF32:e,commandCount:0,instanceCount:0}}d.drawCalls=e,d.src=t,d.dst=r,d.store=n,d.bounds=o,d.paramsF32.set(s),d.params.update(),d.commandCount=u,d.instanceCount=l,this._jobCount++}renderEnd(){let e=this._jobCount;if(this._jobCount=0,0===e)return;let t=this._renderer.gpu.device,r=this._renderer.buffer,a=this._zeroPipeline||this._buildPipeline(t,o,"_zeroPipeline"),i=this._compactPipeline||this._buildPipeline(t,s,"_compactPipeline"),n=t.createCommandEncoder(),u=this._jobs,l=n.beginComputePass();l.setPipeline(a);for(let i=0;i<e;i++){let e=u[i],n=r.getGPUBuffer(e.drawCalls);l.setBindGroup(0,this._zeroBindGroup(t,a,n,e.commandCount)),l.dispatchWorkgroups(Math.ceil(e.commandCount/64))}l.end();let d=n.beginComputePass();d.setPipeline(i);for(let a=0;a<e;a++){let e=u[a];d.setBindGroup(0,this._compactBindGroup(t,i,e,r)),d.dispatchWorkgroups(Math.ceil(e.instanceCount/64))}d.end(),t.queue.submit([n.finish()]);for(let t=0;t<e;t++)u[t].drawCalls=null,u[t].src=null,u[t].dst=null,u[t].store=null,u[t].bounds=null}_zeroBindGroup(e,t,r,a){let i=this._zeroBinds.get(r);if(i&&i.commandCount===a)return i.bindGroup;let n=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r,offset:0,size:20*a}}]});return this._zeroBinds.set(r,{bindGroup:n,commandCount:a}),n}_compactBindGroup(e,t,r,a){let i=a.getGPUBuffer(r.src),n=a.getGPUBuffer(r.dst),o=a.getGPUBuffer(r.drawCalls),s=a.getGPUBuffer(r.store),u=a.getGPUBuffer(r.bounds),l=a.getGPUBuffer(r.params),d=this._compactBinds.get(o);if(d&&d.src===i&&d.dst===n&&d.drawCalls===o&&d.store===s&&d.bounds===u&&d.params===l&&d.commandCount===r.commandCount&&d.instanceCount===r.instanceCount)return d.bindGroup;let c=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i,offset:0,size:4*r.instanceCount}},{binding:1,resource:{buffer:n,offset:0,size:4*r.instanceCount}},{binding:2,resource:{buffer:o,offset:0,size:20*r.commandCount}},{binding:3,resource:{buffer:s}},{binding:4,resource:{buffer:u}},{binding:5,resource:{buffer:l}}]});return this._compactBinds.set(o,{bindGroup:c,src:i,dst:n,drawCalls:o,store:s,bounds:u,params:l,commandCount:r.commandCount,instanceCount:r.instanceCount}),c}_buildPipeline(e,t,r){let a=e.createShaderModule({code:t}),i=e.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}});return this[r]=i,i}destroy(){if(!this._destroyed){for(let e of(this._destroyed=!0,this._jobs))e.params?.destroy();this._jobs=null,this._zeroPipeline=null,this._compactPipeline=null,this._zeroBinds=new WeakMap,this._compactBinds=new WeakMap,this._jobCount=0}}},l=r(28960);let d=new i.dZd({buffer:new a.c({data:new Int32Array(1),usage:i.Sdw.STORAGE|i.Sdw.COPY_DST|i.Sdw.COPY_SRC,label:"EmptyBufferResource",shrinkToFit:!1})});var c=r(55464),p=r(62082),f=r(74342),m=r(5774);let h={name:"global",structs:{Renderable:f.G8,RenderableInstance:f.p9,BoneMatrix:f.Rx,GeometryData:f.IN,Light:f.gT},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uFogColor:"vec3<f32>",uDisplayExposure:"f32",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${6*c.Ou}>`,uSampler:"sampler",uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uBrdfLutSampler:"sampler",uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uOpaqueDepthTexture:"texture_depth_2d",uOpaqueColorTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<u32>",uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}},gpu:{header:`
const LIGHT_DIRECTIONAL: f32 = 0.0;
const LIGHT_POINT: f32 = 1.0;
const LIGHT_SPOT: f32 = 2.0;
`}};function g(e,t){let r=e._gpuData[t.uid];if(!r){let a=(0,p.V)(e._lightDataList.data,e._shadowDataList.data);t.ubo.ensureUniformGroup(a),a.buffer.autoGarbageCollect=!1;let n=new i.nDV;n.addressMode="repeat";let o=new i.nDV;o.compare="less";let s=new i.nDV;s.addressMode="clamp-to-edge";let u=new i.TX4({global:a,uSampler:n,uEnvironmentTexture:l.pC.source,uBrdfLutTexture:i.gPd.EMPTY.source,uBrdfLutSampler:s,uShadowMap:l.G_.source,uShadowSampler:o,uOpaqueDepthTexture:l.AZ,uOpaqueColorTexture:i.gPd.EMPTY.source,uMaterialStorage:l.Nj.source,uRenderableStorage:d,uRenderableInstanceStorage:d,uBonePitStorage:e._bonePit.bufferResource,uMorphStorage:d,uGeometryStorage:d,uInstanceStorage:d});r=new m.g(a,u,{opaqueColor:{group:u,slot:"uOpaqueColorTexture"},opaqueDepth:{group:u,slot:"uOpaqueDepthTexture"},shadowMap:{group:u,slot:"uShadowMap"}}),e._gpuData[t.uid]=r}return r}var b=r(1104),v=r(711),x=r(55447),w=class{static extension={type:[i.AgS.WebGPUSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){let r=e.passByBit[b.J.SHADOW];r?.beginFrame(e);let{_lightDataList:a,environment:n}=e;a.reset();let o=g(e,this._renderer).globalUniformGroup.uniforms,s=o.uGlobalLightParams;s[0]=0,s[1]=0,s[2]=0,null===n||n instanceof i.b4q||(0,x.G)(n,o.uHemisphereSky,o.uHemisphereGround,o.uHemisphereUp);for(let i=0;i<t.length;i++){let n=t[i];if(n._worldVisible){if("ambient"===n.type){let e=n.color,t=n.intensity;(0,v.QF)(s,0,e,t);continue}a.count>=32||(r?.prepareShadow(n,e),a.add(n))}}s[3]=a.count}};let y=`
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
`;var _=class{static extension={type:[i.AgS.WebGPUSystem],name:"mipChain3d"};_renderer;_shaderModule=null;_sampler=null;_pipelines=Object.create(null);_cache=Object.create(null);constructor(e){this._renderer=e}generate(e){if(e.mipLevelCount<=1)return;let t=this._renderer.gpu.device,r=this._renderer.encoder.commandEncoder,a=this._pipeline(t,e.format),{bindGroups:i,dstViews:n}=this._cache[e.uid]||this._buildCacheEntry(e);for(let e=0;e<n.length;e++){let t=r.beginRenderPass({colorAttachments:[{view:n[e],loadOp:"clear",storeOp:"store",clearValue:{r:0,g:0,b:0,a:0}}]});t.setPipeline(a),t.setBindGroup(0,i[e]),t.draw(3),t.end()}}_buildCacheEntry(e){let t=this._renderer.gpu.device,r=this._pipeline(t,e.format),a=this._renderer.texture.getGpuSource(e),i=[],n=[],o=r.getBindGroupLayout(0);for(let r=1;r<e.mipLevelCount;r++)n.push(a.createView({baseMipLevel:r,mipLevelCount:1,dimension:"2d"})),i.push(t.createBindGroup({layout:o,entries:[{binding:0,resource:this._sampler},{binding:1,resource:a.createView({baseMipLevel:r-1,mipLevelCount:1,dimension:"2d"})}]}));let s={bindGroups:i,dstViews:n};return this._cache[e.uid]=s,s}_pipeline(e,t){let r=this._pipelines[t];if(r)return r;this._shaderModule||=e.createShaderModule({code:y}),this._sampler||=e.createSampler({minFilter:"linear"});let a=e.createRenderPipeline({layout:"auto",vertex:{module:this._shaderModule,entryPoint:"vertexMain"},fragment:{module:this._shaderModule,entryPoint:"fragmentMain",targets:[{format:t}]}});return this._pipelines[t]=a,a}destroy(){this._shaderModule=null,this._sampler=null,this._pipelines=Object.create(null),this._cache=Object.create(null)}};function S(e){let t=e?8:4;return{name:e?"morphTargetNormal":"morphTarget",structs:{GeometryData:f.IN},bindings:{global:{uMorphStorage:"storage<f32>",uGeometryStorage:"storage<GeometryData>"}},gpu:{vertex:{input:`
        if (renderable.morphWeightIndex != 0u) {
          let geometryData = uGeometryStorage[renderable.geometryDataIndex];
          let vidLocal = vid - geometryData.baseVertex;
          let morphDeltaBase = geometryData.morphDeltaBase + vidLocal * geometryData.morphTargetCount * ${t}u;
          var morphedPosition = position.xyz;${e?"\n          var morphedNormal = normal;":""}
          for (var morphIndex = 0u; morphIndex < geometryData.morphTargetCount; morphIndex = morphIndex + 1u) {
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
          position = vec4<f32>(morphedPosition, position.w);${e?"\n          normal = normalize(morphedNormal);":""}
        }
      `}}}}let B=S(!1),D=S(!0);var C=r(18356),M=r(84897);function G(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function I(e){var t;let r,a;return{name:`shadow:${e}`,bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowSampler:"sampler_comparison",uShadowData:`array<vec4<f32>, ${6*c.Ou}>`}},gpu:{header:`
    fn sampleShadowAtIndex(
      idx: i32,
      worldPos: vec3<f32>,
      normal: vec3<f32>,
      NdotL: f32,
    ) -> f32 {
      let slot = idx * 6;
      let lightSpaceMatrix = mat4x4<f32>(
        global.uShadowData[slot],
        global.uShadowData[slot + 1],
        global.uShadowData[slot + 2],
        global.uShadowData[slot + 3],
      );
      let sp = global.uShadowData[slot + 4];

      let biasedPos = worldPos + normal * (sp.y * (1.0 - NdotL));
      let lsp = lightSpaceMatrix * vec4<f32>(biasedPos, 1.0);
      let proj = lsp.xyz / lsp.w;

      let uv = proj.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);

      if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0)) || proj.z < 0.0 || proj.z > 1.0) {
        return 1.0;
      }

      let d = proj.z - sp.x;

${r=(t=M.u[e]).some(([e,t])=>0!==e||0!==t),a=[],r&&a.push("      let texel = 1.0 / sp.z;"),t.forEach(([e,t],r)=>{let i=0===e&&0===t?"uv":`uv + vec2<f32>(${G(e)}, ${G(t)}) * texel`;a.push(`      ${0===r?"var s = ":"s += "}textureSampleCompareLevel(uShadowMap, uShadowSampler, ${i}, idx, d);`)}),a.push(1===t.length?"      return s;":`      return s / ${G(t.length)};`),a.join("\n")}
    }

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

      if (last < 1) {
        return sampleShadowAtIndex(baseIndex, worldPos, normal, NdotL);
      }

      let viewDepth = -(camera.uViewMatrix * vec4<f32>(worldPos, 1.0)).z;
      let splits = global.uShadowData[baseIndex * 6 + 5].xyz;

      let crossed = step(splits, vec3<f32>(viewDepth));
      let cascadeIndex = i32(min(dot(crossed, vec3<f32>(1.0)), f32(last)));

      let shadow = sampleShadowAtIndex(baseIndex + cascadeIndex, worldPos, normal, NdotL);

      if (cascadeIndex == last) {
        return shadow;
      }

      let hot = vec3<f32>(f32(cascadeIndex == 0), f32(cascadeIndex == 1), f32(cascadeIndex == 2));
      let splitFar = dot(splits, hot);
      let splitNear = dot(splits, vec3<f32>(hot.y, hot.z, 0.0));

      let band = max((splitFar - splitNear) * ${G(C.M1)}, 1e-4);
      let blend = saturate((viewDepth - splitFar + band) / band);

      if (blend <= 0.0) {
        return shadow;
      }

      let next = sampleShadowAtIndex(baseIndex + cascadeIndex + 1, worldPos, normal, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}let $={hard:I("hard"),pcf:I("pcf"),"pcf-high":I("pcf-high")},R={name:"skinning",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},structs:{BoneMatrix:f.Rx},bindings:{global:{uBonePitStorage:"storage<BoneMatrix>"}},gpu:{vertex:{header:`
        fn getBoneRows(idx: u32, bonePitIndex: u32) -> mat3x4<f32> {
            return uBonePitStorage[(bonePitIndex) + idx].rows;
        }
      `,input:`
        var skinRows =
            getBoneRows(input.aJoints.x, renderable.bonePitIndex) * input.aWeights.x +
            getBoneRows(input.aJoints.y, renderable.bonePitIndex) * input.aWeights.y +
            getBoneRows(input.aJoints.z, renderable.bonePitIndex) * input.aWeights.z +
            getBoneRows(input.aJoints.w, renderable.bonePitIndex) * input.aWeights.w;

        position = vec4<f32>(dot(skinRows[0], position), dot(skinRows[1], position), dot(skinRows[2], position), position.w);
        normal = vec3<f32>(dot(skinRows[0].xyz, normal), dot(skinRows[1].xyz, normal), dot(skinRows[2].xyz, normal));
        tangent = vec3<f32>(dot(skinRows[0].xyz, tangent), dot(skinRows[1].xyz, tangent), dot(skinRows[2].xyz, tangent));
      `}}};var P=r(23101);function O(e){let t=[];for(let[r,a]of(t.push(`fn ${e.name}(index: u32) -> ${e.struct} {`),t.push(`  let base = ${e.base};`),t.push(`  var m: ${e.struct};`),(0,P.h)(e.fields,e.read)))for(let i of(t.push(`  let t${r} = ${e.load(`base + ${r}`)};`),a))t.push(`  m.${i.name} = ${function(e,t){if("mat2x2<f32>"===e.type)return`mat2x2<f32>(bitcast<vec2<f32>>(${t}.xy), bitcast<vec2<f32>>(${t}.zw))`;let r=`${t}${e.swizzle}`;return"u32"===e.scalar?r:`bitcast<${e.type}>(${r})`}(i,`t${r}`)};`);return t.push("  return m;"),t.push("}"),t.join("\n")}var T=r(92741);let L={collectData(e){if(!(0,T.D3)(e.bits))return;let t=(0,T.sU)(e.bits,"gpu",e.instanceLayout,e.template);e.bits=[...e.bits,function(e){let{layout:t,loaded:r,varyings:a}=e,i={},n=["let instance = getInstance(inst.id);"],o=["var instance: Instance;"];for(let e of a){let r=t.struct[e],a=(0,T.Jg)(e),s="vec4<u32>"===r?`instance.${e}`:`bitcast<vec4<u32>>(instance.${e})`,u="vec4<u32>"===r?`input.${a}`:`bitcast<${r}>(input.${a})`;i[a]="vec4<u32>",n.push(`output.${a} = ${s};`),o.push(`instance.${e} = ${u};`)}return{name:`instanceAccess:${t.key}`,interStage:i,bindings:{global:{uInstanceStorage:{type:"storage<vec4<u32>>",visibility:"vertex"}}},gpu:{vertex:{header:O({name:"getInstance",struct:"Instance",fields:t.struct,read:r,base:`index * ${t.stride/4}u`,load:e=>`uInstanceStorage[${e}]`}),storeAccess:n.join("\n  ")},fragment:a.length?{storeAccess:o.join("\n  ")}:void 0}}}(t)]}},j={float32:"f32",float32x2:"vec2<f32>",float32x3:"vec3<f32>",float32x4:"vec4<f32>",sint32:"i32",sint32x2:"vec2<i32>",sint32x3:"vec3<i32>",sint32x4:"vec4<i32>",uint32:"u32",uint32x2:"vec2<u32>",uint32x3:"vec3<u32>",uint32x4:"vec4<u32>",float16x2:"vec2<f32>",float16x4:"vec4<f32>",unorm8x2:"vec2<f32>",unorm8x4:"vec4<f32>",snorm8x2:"vec2<f32>",snorm8x4:"vec4<f32>",uint8x2:"vec2<u32>",uint8x4:"vec4<u32>",sint8x2:"vec2<i32>",sint8x4:"vec4<i32>",unorm16x2:"vec2<f32>",unorm16x4:"vec4<f32>",snorm16x2:"vec2<f32>",snorm16x4:"vec4<f32>",uint16x2:"vec2<u32>",uint16x4:"vec4<u32>",sint16x2:"vec2<i32>",sint16x4:"vec4<i32>"},V={collectData(e){e.data.attributes=function(e){let t=Object.create(null);for(let a of e)if(a.attributes)for(let[e,n]of Object.entries(a.attributes))if(e in t){var r;t[e]!==n&&(r=t[e],(0,i.R8M)(`[collectAttributes] Attribute "${e}" redefined with different format: "${r}" \u{2192} "${n}". Keeping original.`))}else t[e]=n;return t}(e.bits)},injectCode:e=>({header:function(e){let t=Object.keys(e);if(0===t.length)return"";let r=[];r.push("struct VertexInput {");let a=0;for(let n of t){let t=function(e){let t=j[e];return t||((0,i.R8M)(`[compileAttributesWgsl] Unknown vertex format: "${e}"`),"vec4<f32>")}(e[n]);r.push(`  @location(${a++}) ${n}: ${t},`)}return r.push("}"),r.join("\n")}(e.data.attributes)})};var E=r(67882),A=r(68246);function k(e,t,r){(0,i.R8M)(`[collectBindings] Binding "${e}" redefined with different type: "${r}" \u{2192} "${t}". Keeping original.`)}function F(e,t){let r=Object.create(null);(0,E.a)(t).forEach(({name:e},t)=>{r[e]={groupIndex:t,bindingIndex:0,resources:Object.create(null),storages:Object.create(null),uniformBuffers:Object.create(null),uniformGroups:Object.create(null)}});let a=Object.create(null);for(let t of e)if(t.structs)for(let[e,r]of Object.entries(t.structs))e in a||(a[e]=r);for(let t of e)if(t.bindings)for(let[e,s]of Object.entries(t.bindings)){if(!s)continue;let u=e in r;for(let{name:l,spec:d,uniformGroup:c}of(0,A.vu)(s,e)){var n,o;let s=(0,A.Ac)(d);if(A.Rx.has(s)){if(u){let t=r[e].resources;l in t?t[l]!==s&&k(l,s,t[l]):t[l]=s}}else if((0,A.yp)(s)){if(u){let a=(0,A.BI)(s);if(!a){n=t.name,(0,i.R8M)(`[collectBindings] Bit "${n}" binding "${l}" has invalid storage type: "${s}". Expected format: storage<StructName>`);continue}let o=r[e].storages;l in o||(o[l]=a)}}else if((0,A.NI)(s)){if(u){let n=(0,A.wE)(s);if(!n){o=t.name,(0,i.R8M)(`[collectBindings] Bit "${o}" binding "${l}" has invalid uniform buffer type: "${s}". Expected format: uniform<StructName>`);continue}let u=r[e].uniformBuffers;l in u?u[l]!==n&&k(l,n,u[l]):(u[l]=n,a[n]??={})}}else{let t=u?c:e,i=(0,A.ZH)(t);i in a||(a[i]={});let n=a[i];n[l]&&n[l]!==s?k(l,s,n[l]):n[l]=s,u&&(r[e].uniformGroups[t]=!0)}}}return{structs:a,bindGroups:r}}function z(e){let{bindGroups:t}=e,r=Object.create(null);for(let e in t){let a=t[e],i=[],n=a.bindingIndex;for(let t in a.uniformGroups[e]&&i.push({name:e,binding:n++,kind:"uniform",type:(0,A.ZH)(e)}),a.resources)i.push({name:t,binding:n++,kind:"resource",type:a.resources[t]});for(let e in a.storages)i.push({name:e,binding:n++,kind:"storage",type:a.storages[e]});for(let e in a.uniformBuffers)i.push({name:e,binding:n++,kind:"uniform",type:a.uniformBuffers[e]});for(let t in a.uniformGroups)t!==e&&i.push({name:t,binding:n++,kind:"uniform",type:(0,A.ZH)(t)});r[e]={groupIndex:a.groupIndex,entries:i}}return r}function N(e){let{structs:t,bindGroups:r}=e;for(let e in r){let{uniformBuffers:a}=r[e];for(let e in a){let r=a[e];if(0===Object.keys(t[r]??{}).length)throw Error(`[emitBindingsWgsl] Binding "${e}" is "uniform<${r}>", but no bit declares fields for a "${r}" struct.`)}}let a=[];for(let e in t){let r=t[e];for(let[t,i]of(a.push(`struct ${e} {`),Object.entries(r)))a.push(`  ${t}: ${i},`);a.push("}")}let i=z(e);for(let e in i){let{groupIndex:t,entries:r}=i[e];for(let e of r){let r=`@group(${t}) @binding(${e.binding})`;"uniform"===e.kind?a.push(`${r} var<uniform> ${e.name}: ${e.type};`):"resource"===e.kind?a.push(`${r} var ${e.name}: ${e.type};`):a.push(`${r} var<storage, read> ${e.name}: array<${e.type}>;`)}}return a.join("\n")}let U={collectData(e){e.data.bindings=F(e.bits,e.template),e.data.structs=e.data.bindings.structs},injectCode:e=>({header:N(e.data.bindings)})};var W=r(5086);let H={collectData(e){e.templateString.includes("{{fragmentWriteOutputs}}")&&(e.data.outputs=(0,W.r)(e.bits))},injectCode(e){let t=e.data.outputs;if(!t)return{};let r=e.outputLocations;return{header:function(e,t){let r=["struct Outputs {"];for(let t in e)r.push(`  ${t}: ${e[t]},`);r.push("}","","struct FragmentOutput {");for(let a=0;a<t.length;a++)e[t[a]]&&r.push(`  @location(${a}) ${t[a]}: ${e[t[a]]},`);return r.push("}"),r.join("\n")}(t,r),fragmentDeclareOutputs:"var outputs: Outputs;",fragmentWriteOutputs:`return FragmentOutput(${r.filter(e=>t[e]).map(e=>`outputs.${e}`).join(", ")});`}}};function q(e,t){return`${e}${t.charAt(0).toUpperCase()+t.slice(1)}`}var K=r(33607);let J={collectData(e){var t=e.templateString;for(let e of(0,K.m)(t))if(!("header"===e||"textureGetters"===e||e.startsWith("vertex")||e.startsWith("fragment"))){let t=q("vertex",e),r=q("fragment",e);(0,i.R8M)(`[compileShader] Template slot {{${e}}} is not prefixed with "vertex" or "fragment". Did you mean {{${t}}} or {{${r}}}?`)}e.data.headers=e.bits.map(e=>e.gpu?.header).filter(e=>!!e?.trim())},injectCode:e=>({header:e.data.headers.join("\n\n")})},Y=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function Z(e){return"i32"===e||"u32"===e||e.includes("<i32>")||e.includes("<u32>")}let X={collectData(e){e.data.interStage=function(e){let t=Object.create(null);for(let a of e)if(a.interStage){for(let[e,n]of Object.entries(a.interStage))if(!Y.has(e))if(e in t){var r;t[e]!==n&&(r=t[e],(0,i.R8M)(`[compileInterStageWgsl] Inter-stage variable "${e}" redefined with different type: "${r}" \u{2192} "${n}". Keeping original.`))}else t[e]=n}return t}(e.bits)},injectCode:e=>({header:function(e){let t=[],r=Object.keys(e);t.push("struct VertexOutput {"),t.push("  @builtin(position) position: vec4<f32>,");let a=0;for(let i of r){let r=e[i],n=Z(r)?" @interpolate(flat)":"";t.push(`  @location(${a++})${n} ${i}: ${r},`)}for(let i of(t.push("}"),t.push(""),t.push("struct FragmentInput {"),t.push("  @builtin(position) position: vec4<f32>,"),t.push("  @builtin(front_facing) frontFacing: bool,"),a=0,r)){let r=e[i],n=Z(r)?" @interpolate(flat)":"";t.push(`  @location(${a++})${n} ${i}: ${r},`)}return t.push("}"),t.join("\n")}(e.data.interStage)})};var Q=r(85922);let ee={collectData(e){e.data.overrides=(0,Q.b7)(e.bits)},injectCode:e=>({header:(0,Q.OB)(e.data.overrides)})};var et=r(62815);let er=/\{\{(.*?)\}\}/g,ea={collectData(e){e.data.vertexSlots=(0,et.Y)(e.bits,"gpu","vertex"),e.data.fragmentSlots=(0,et.Y)(e.bits,"gpu","fragment")},injectCode(e){let t={};for(let[r,a]of Object.entries(e.data.vertexSlots))t[q("vertex",r)]=a.join("\n");for(let[r,a]of Object.entries(e.data.fragmentSlots))t[q("fragment",r)]=a.join("\n");var r=e.templateString;let a=(0,K.m)(r),n=function(e){let t=new Set;for(let r of e)if(r)for(let e of r.matchAll(er))t.add(e[1]);return t}(Object.values(t));for(let[e,r]of Object.entries(t))r&&/\S/.test(r)&&!a.has(e)&&!n.has(e)&&(0,i.R8M)(`[compileShader] Generated code for slot {{${e}}} but template doesn't have it. Slot names are prefixed with stage: vertex.input \u{2192} {{vertexInput}}, fragment.end \u{2192} {{fragmentEnd}}.`);return t}};var ei=r(72763),en=r(88007);function eo(e){let{bits:t,template:r,extraPlugins:a,instanceLayout:n,outputLocations:o=W.n}=e,s=[L,ee,U,V,X,H,J,ea],u=a?[...a,...s]:s,l={bits:(0,en.U)(t),template:r,templateString:r.gpu,data:{},instanceLayout:n,outputLocations:o},d=`diagnostic(off, derivative_uniformity);
${(0,ei.R)(l,u)}`;return{vertex:{source:d,entryPoint:"mainVertex"},fragment:{source:d,entryPoint:"mainFragment"},structs:l.data.structs||{},gpuLayout:function(e,t){let r=(0,i.GIW)(e),a=(0,i.W7J)(r),n=Object.create(null);for(let e of t)if(e.bindings){for(let[t,r]of Object.entries(e.bindings))if(r)for(let{name:e,spec:a}of(0,A.vu)(r,t))e in n||(n[e]=(0,A.iP)(a))}for(let e of r.groups){let t=n[e.name];if(!t||"both"===t)continue;let r=a[e.group]?.find(t=>t.binding===e.binding);r&&(r.visibility="vertex"===t?i.qdR.VERTEX:i.qdR.FRAGMENT)}return a}(d,l.bits),bits:l.bits}}var es=r(62933);let eu={injectCode(e){let t=e.data.structs?.Material;if(!t)return{};let r="var material = getMaterial(vMaterialIndex);";return{textureGetters:O({name:"getMaterial",struct:"Material",fields:t,base:"i32(index)",load:e=>`textureLoad(uMaterialStorage, ${(0,es._C)(e)}, 0)`}),vertexStoreAccess:r,fragmentStoreAccess:r}}};var el=r(71075);function ed(e){return{collectData(t){t.bits.some(e=>e.name.startsWith("materialBindings:"))||t.bits.unshift((0,el.V)(t.bits,e))},injectCode(e){let t=0,r=[];for(let a of e.bits)if(a.textures)for(let e of a.textures){let a=`sample${e[0].toUpperCase()}${e.slice(1)}`;r.push(...function(e,t){let r=`uMaterialTexture${t}, uMaterialSampler${t}`;return[`fn ${e}Direct(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSampleGrad(${r}, uv, vec2<f32>(0.0), vec2<f32>(0.0));`,"}",`fn ${e}(uv: vec2<f32>) -> vec4<f32> {`,`  return textureSample(${r}, uv);`,"}"]}(a,t)),t++}return{textureGetters:r.join("\n")}}}}var ec=r(87160),ep=r(63116),ef=r(5068),em=r(23278),eh=r(76972),eg=r(31360),eb=r(73390),ev=r(81759);let ex={atlas:null,indexCount:void 0,firstIndex:void 0,baseVertex:void 0};var ew=class{_materialSystem;constructor(e){this._materialSystem=e}render(e){let{renderables:t,globalBindGroup:r,commandList:a,drawData:i,passBit:n,bindsMaterial:o,batch:s,view3d:u}=e,l=t.count;if(0===l)return;a.clear();let d=t.indices,c=t.items,p=this._materialSystem,f=c[d[0]],m=f._passCache[n],h=f.geometry._geometryAtlasAllocation||ex,g=m.batchKey,b=h.atlas?h.atlas.geometry:f.geometry,v=m.shader,x=(0,ev.Q)(g,m.state),w=m.topology,y=f.material,_=0,S=0,B=0,D=y,C=!1;o&&a.captureMaterialTextures(y);for(let e=1;e<l;e++){let t=(m=(f=c[d[e]])._passCache[n]).batchKey,l=f.material,M=t!==g;if(!M&&(!o||l===y))continue;let G=!M&&y._textureSetId===l._textureSetId;if(G){if(C){y=l;continue}if(a.count-B+2>16){a.count=B,_=S,C=!0,v=p.ensureMergedShader(c[d[S]],s,u),y=l;continue}}let I=a.next();I.geometry=b,I.shader=v,I.globalBindGroup=r,I.batchBindGroup=o?C?D._getMergedBindGroup():y._getBindGroup():void 0,I.state=x,I.topology=w,I.batchKey=g,I.textureSetId=o?D._textureSetId:0,I.merged=o&&C,a.captureGeometry(b);let $=(a.count-1)*5,R=i.ensureCapacity(a.count);R[$]=h.indexCount??(b.indexCount||b.indexBuffer.data.length),R[$+1]=e-_,R[$+2]=h.firstIndex||0,R[$+3]=h.baseVertex||0,R[$+4]=_,_=e;let P=l!==y;y=l,G||(M&&(h=f.geometry._geometryAtlasAllocation||ex,g=t,b=h.atlas?h.atlas.geometry:f.geometry,x=(0,ev.Q)(t,m.state),w=m.topology),v=m.shader,S=e,B=a.count,D=l,C=!1),o&&P&&(G?a.refreshMaterialBindings(l):a.captureMaterialTextures(l))}{let e=a.next();e.geometry=b,e.shader=v,e.globalBindGroup=r,e.batchBindGroup=o?C?D._getMergedBindGroup():y._getBindGroup():void 0,e.state=x,e.topology=w,e.batchKey=g,e.textureSetId=o?D._textureSetId:0,e.merged=o&&C,a.captureGeometry(b);let t=(a.count-1)*5,n=i.ensureCapacity(a.count);n[t]=h.indexCount??(b.indexCount||b.indexBuffer.data.length),n[t+1]=l-_,n[t+2]=h.firstIndex||0,n[t+3]=h.baseVertex||0,n[t+4]=_}a.endBuild()}},ey=r(18669),e_=r(85277),eS=r(62411),eB=r(70930),eD=r(12939),eC=r(52381),eM=r(57941),eG=r(35859),eI=r(79377),e$=r(54355),eR=r(89983),eP=r(54544),eO=r(30710),eT=r(85623),eL=r(32320);let ej=new ep.X({}),eV=new i.Tz_({}),eE={direct:[eL.D,ed("direct")],merged:[eL.D,eu,ed("merged")]},eA={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},outputs:{color:"vec4<f32>"},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32"}},ek={bindGroups:[{name:"global",ubo:!0},"camera","batch"],gpu:`


{{header}}
{{textureGetters}}
{{vertexHeader}}

@vertex
fn mainVertex(input: VertexInput,
  @builtin(instance_index) ii: u32,
  @builtin(vertex_index) vid: u32
) -> VertexOutput {
  var output: VertexOutput;

  var position: vec4<f32>;
  var normal = vec3<f32>(0.0, 0.0, 1.0);
  var tangent = vec3<f32>(0.0);
  var uv = vec2<f32>(0.0);
  
  let inst = uRenderableInstanceStorage[ii];
  let renderable = uRenderableStorage[inst.id];
  let vMaterialIndex = renderable.materialIndex;
  {{vertexStoreAccess}}

  let batchWorldMatrix = uRenderableStorage[0].transform;
  var modelMatrix = batchWorldMatrix * renderable.transform;

  {{vertexInput}}

  {{vertexBeforeTransform}}

  var worldPosition = modelMatrix * position;
  let modelMatrix3 = mat3x3<f32>(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz);

  let normalScale = 1.0 / vec3<f32>(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  var worldNormal = modelMatrix3 * (normal * normalScale);
  var clipPosition = camera.uViewProjectionMatrix * worldPosition;

  {{vertexAfterTransform}}

  {{vertexEnd}}

  output.position       = clipPosition;
  output.vPosition      = worldPosition.xyz;
  output.vNormal        = worldNormal;
  output.vUV            = uv;
  output.vMaterialIndex = renderable.materialIndex;

  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> FragmentOutput {
  {{fragmentDeclareOutputs}}
  var normal = normalize(input.vNormal);
  var albedo: vec3<f32> = vec3<f32>(1.0);
  var finalColor: vec3<f32>;
  var alpha: f32 = 1.0;

  let vMaterialIndex = input.vMaterialIndex;
  {{fragmentStoreAccess}}

  {{fragmentMaterial}}

  finalColor = albedo;

  {{fragmentLighting}}

  finalColor *= inputExposure(global.uExposure, global.uDisplayExposure);

  {{fragmentEnd}}

  outputs.color = vec4<f32>(finalColor * alpha, alpha);

  {{fragmentWriteOutputs}}
}
`},eF=[[i.qdR.VERTEX,"vertex"],[i.qdR.FRAGMENT,"fragment"]];var ez=class{static extension={type:[i.AgS.WebGPUSystem],name:"material3d"};batcher=new ew(this);_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){let r=e._passCache[t];return this._renderer.pipeline.getPipelineKey(e.geometry,r.shader.gpuProgram,r.state,r.topology,r.shader._overrides??eV)}compilePassShader(e,t){let r=eo({bits:[h,eS.p,...e],template:t});return(0,ec.y)(r.bits,t),i.Mtr.from({gpu:r})}compileIsolatedShader(e,t,r){return i.Mtr.from({gpu:eo({bits:e,template:t}),groups:r})}compileShader(e,t,r,a,n,o="direct"){let s=[],u="";(e.includeGlobal??!0)&&(s.push(h),u+=`${h.name}|`),(e.includeCamera??!0)&&(s.push(eS.p),u+=`${eS.p.name}|`),s.push(...e.bitsGpu),u+=e.keyGpu;let l=(0,eR.z)(t.geometry.attributes.aPosition.format);(0,ec.U)(l),s.push(l),u+=`|${l.name}`,t._morph&&(t.geometry.hasMorphNormals?(s.push(D),u+="|morphN"):(s.push(B),u+="|morph")),t.skeleton&&((0,ec.U)(R),s.push(R),u+=`|${R.name}`),r.instanceStoreBuffer&&(0,T.D3)(s)&&(u+=`|inst:${r.instanceStoreBuffer.layout.key}`),u+=`|${o}`;let d=this._shaderCache.get(u);if(!d){let n=eo({bits:s,template:e.template,extraPlugins:a,instanceLayout:r.instanceStoreBuffer?.layout,outputLocations:e.outputLocations});(0,ec.y)(n.bits,e.template),function(e,t,r,a,i){let{maxSamplersPerShaderStage:n,maxSampledTexturesPerShaderStage:o}=r;for(let[r,s]of eF){let u=0,l=0,d=0,c=0;for(let a=0;a<e.length;a++){let i=e[a];if(i)for(let e of i)e.visibility&r&&(e.texture&&(u++,a===t&&d++),e.sampler&&(l++,a===t&&c++))}let p=l>n;if(!p&&u<=o)continue;let f=`${l} samplers`,m=`${n} (maxSamplersPerShaderStage)`,h=`${u} sampled textures`,g=`${o} (maxSampledTexturesPerShaderStage)`,[b,v,x]=p?[f,m,`Sampled textures: ${u} of ${g}`]:[h,g,`Samplers: ${l} of ${m}`],w=(0,eh.sL)(i);throw Error(`[MaterialSystemGpu] ${a.material.constructor.name}'s shader binds ${b} in the ${s} stage, but this device allows ${v}. ${x}. The engine's globals take ${l-c} samplers and ${u-d} sampled textures, and the material's ${w.length} texture slots take ${c} samplers and ${d} sampled textures: ${w.join(", ")}. Turn off a feature group or remove a texture slot.`)}}(n.gpuLayout,(0,E.a)(e.template).findIndex(e=>"batch"===e.name),this._renderer.gpu.device.limits,t,n.bits),d={shader:i.Mtr.from({gpu:n,overrides:e.overrides}),layout:(0,eh.UV)(n.bits)},this._shaderCache.set(u,d)}return n&&((0,eh.eD)(d.layout,t.material),(0,eh.zI)(d.layout,t.material)),d.shader}ensureMaterial(e,t,r){let a=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(a);let i=this.compileShader(this._materialDescriptor(e,r),e,t,eE.direct,!0),n=a._passBit&b.J.MATERIAL_PASS_MASK,o=a._passes[n],s=o&&o.state||a.state,u=o&&o.topology||a.topology||e.geometry.topology,l=e._passCache[n];return l?(l.shader=i,l.mergedShader=null,l.state=s,l.topology=u,l.lastGeometryUid=-1):e._passCache[n]=new ef.t(i,s,u),i}ensureMergedShader(e,t,r){let a=e._passCache[e.material._passBit&b.J.MATERIAL_PASS_MASK];if(a.mergedShader)return a.mergedShader;let i=this._materialDescriptor(e,r);return a.mergedShader=this.compileShader(i,e,t,eE.merged,!0,"merged"),a.mergedShader}_materialDescriptor(e,t){let r=e.geometry,a=e.material,i=a.fog?t._fogBit:null,n=t._toneMappingBit,o=!!r.attributes.aColor&&a.vertexColors,s=(0,eB.F)(a,n,!!i||o),u=a.getPrimaryDescriptor(t),d=[h,eA,s];r.attributes.aNormal&&d.push(eG.d),r.attributes.aUV&&d.push((0,eO.q)(r.attributes.aUV.format)),a.doubleSided&&d.push(eD.v),a.flatShading&&d.push(eC.j);let c=a.textures.normal;c&&c!==l.lN&&r.attributes.aUV&&d.push(r.attributes.aTangent?eP.e:eI.x),o&&d.push(eT.$);let p=e.material.lit;"none"!==e.billboardMode&&d.push((0,eM._)(e.billboardMode,p));let f=!!r.attributes.aTangent;for(let e=0;e<u.bitsGpu.length;e++){let t=u.bitsGpu[e];d.push(f?(0,eg.R5)(t):t)}"opaque"===a.alphaMode&&d.push(e_.R),i&&d.push(i),s!==eB.f&&n&&d.push(a._skipsToneCurve?ey.G:n),p&&d.push(e.receiveShadow&&t._hasShadows?$[t.shadowFilter]:e$.d,(0,eb.s)(null!==n));let m=t.passByBit[a._passBit&b.J.MATERIAL_PASS_MASK],g=(0,em.iK)(d,m,!!u.template);return ej.update({bitsGpu:d,template:u.template??ek,overrides:{HAS_UVS:+!!r.attributes.aUV,...u.overrides},outputLocations:g,includeGlobal:!1})}destroy(){if(!this._destroyed){for(let{shader:e}of(this._destroyed=!0,this._shaderCache.values()))e.destroy();this._shaderCache=null}}},eN=r(55830);let eU=new Float32Array(24),eW=4e3;function eH(e,t,r,a,i){if(i.lastVisibilityDirtyId!==r._visibilityDirtyId){if(i.lastVisibilityDirtyId=r._visibilityDirtyId,i.direct||t.view.count<4e3)return void eq(t,r,null,i);e.dispatch(i.indirectDrawData.drawCallsBuffer,t.gpuData.instanceBuffer.buffer,i.survivors.buffer,r.storeBuffer.buffer,a,eU,t.commandList.count,t.view.count)}}function eq(e,t,r,a){let i=e.gpuData.instanceBuffer.data,n=a.survivors,o=a.indirectDrawData,s=n.data,u=o.drawCalls,l=e.commandList.count,d=e.view.count,c=t.storeBuffer.visible;null!==r&&t._ensureSpheres();let p=t.storeBuffer.boundingSpheres,f=null!==r,m=f?(0,eN.YM)(r,t.storeBuffer.data):eU,h=m[0],g=m[1],b=m[2],v=m[3],x=m[4],w=m[5],y=m[6],_=m[7],S=m[8],B=m[9],D=m[10],C=m[11],M=m[12],G=m[13],I=m[14],$=m[15],R=m[16],P=m[17],O=m[18],T=m[19],L=m[20],j=m[21],V=m[22],E=m[23],A=!1;for(let e=0;e<l;e++){let t=u[5*e+4],r=e+1<l?u[(e+1)*5+4]:d,a=t;for(let e=t;e<r;e++){let t=i[e];if(0!==c[t]){if(f){let e=4*t,r=p[e+3];if(r>=0){let t=p[e],a=p[e+1],i=p[e+2];if(h*t+g*a+b*i+v<-r||x*t+w*a+y*i+_<-r||S*t+B*a+D*i+C<-r||M*t+G*a+I*i+$<-r||R*t+P*a+O*i+T<-r||L*t+j*a+V*i+E<-r)continue}}s[a++]=t}}let n=a-t;u[5*e+1]!==n&&(u[5*e+1]=n,A=!0)}A&&a.countsDirtyId++,n.upload(d),a.direct||o.upload(l)}var eK=r(68751);function eJ(e){let{pipe:t,bit:r,bindsMaterial:a,session:i,useBundles:n,sortBatch:o}=e;if(!n)return;let{view3d:s}=i,u=t.renderer.material3d.batcher,l=(0,eK.c)(e.camera??s.camera).position;for(let e of s._meshBatches){if(!e.renderData._worldVisible)continue;let t=e.drawLists[r];if(!t)continue;let n=t.view;if(0===n.count||!(o?t.isDrawStale():t.nextBuild(s._updateTick)))continue;o&&o(n,e,l);let d=t.gpuData;d.instanceBuffer.populateIds(n),u.render({renderables:n,globalBindGroup:i.globalBindGroup,commandList:t.commandList,drawData:t.drawData,passBit:r,bindsMaterial:a,batch:e,view3d:s}),d.instanceBuffer.upload(n.count)}}function eY(e){let{pipe:t,bit:r,cullResults:a,session:i,useBundles:n}=e;if(!n)return;let{view3d:o}=i,s=(0,eN._G)("forward"),u=t.geometryDataStoreBuffer.buffer,l=(e.camera??o.camera).cullFrustum.planesData;for(let e of(a.removeDetached(o),o._meshBatches)){if(!e.renderData._worldVisible)continue;let i=e.drawLists[r];if(!i||0===i.view.count)continue;i.claimDrawBuilt();let n=i.view.count<=s,o=a.ensure(e);o.sync(i,n);let d=(0,eN.b3)(e.cull,!n);if("off"===d){eH(t.renderer.compute3d,i,e,u,o);continue}if("cpu"===d){eq(i,e,l,o);continue}let c=(0,eN.YM)(l,e.storeBuffer.data);t.renderer.compute3d.dispatch(o.indirectDrawData.drawCallsBuffer,i.gpuData.instanceBuffer.buffer,o.survivors.buffer,e.storeBuffer.buffer,u,c,i.commandList.count,i.view.count)}}function eZ(e){let{pipe:t,bit:r,bindsMaterial:a,cullResults:i,session:n,useBundles:o,sortBatch:s}=e,{view3d:u}=n,l=t.renderer.encoder,d=t.renderer.material3d.batcher,c=t.renderer.gc.now,p=e.camera??u.camera,f=(0,eK.c)(p),m=p.cullFrustum.planesData,h=t.geometryDataStoreBuffer.buffer,g=(0,eN._G)("forward");o||i.removeDetached(u);let b=0;for(let e of u._meshBatches){if(!e.renderData._worldVisible)continue;let p=e.drawLists[r];if(!p)continue;let v=p.view;if(0===v.count){if(p.claimDrawEmpty(),o){let t=i.get(e);t&&(t.bundle=null,t.claimBundleRecorded(p,f.bindGroup))}continue}let x=i.ensure(e);if(o&&x.direct&&"off"!==e.cull){x.bundle=null,eX(n,e,x),p.claimDrawBuilt(),p.commandList.replayDirect(l,x.indirectDrawData,f);continue}if(o){let a=x.bundle;(!a||x.isBundleStale(p,f.bindGroup)||!l.isBundleValid(a))&&(eX(n,e,x),l.beginBundle(`view3d pass ${r} batch ${e.uid}`),x.direct?p.commandList.replayDirect(l,x.indirectDrawData,f):p.commandList.replay(l,t.renderer.buffer,x.indirectDrawData,f,0,p.commandList.bodyCount),x.bundle=l.endBundle(),x.claimBundleRecorded(p,f.bindGroup))}else{let i=!0;s?(s(v,e,f.position),i=p.isDrawStale()||p.isOrderStale()):p.nextBuild(u._updateTick,!0);let o=p.gpuData;i&&(o.instanceBuffer.populateIds(v),d.render({renderables:v,globalBindGroup:n.globalBindGroup,commandList:p.commandList,drawData:p.drawData,passBit:r,bindsMaterial:a,batch:e,view3d:u}),o.instanceBuffer.upload(v.count));let l=v.count<=g;x.sync(p,l),eX(n,e,x);let c=(0,eN.b3)(e.cull,!s&&!l);if("gpu"===c){let r=(0,eN.YM)(m,e.storeBuffer.data);t.renderer.compute3d.dispatch(x.indirectDrawData.drawCallsBuffer,o.instanceBuffer.buffer,x.survivors.buffer,e.storeBuffer.buffer,h,r,p.commandList.count,p.view.count)}else eq(p,e,"cpu"===c?m:null,x)}if(p.claimDrawBuilt(),o){let r=p.commandList;r.touch(c),eQ[b++]=x.bundle,!x.direct&&r.count>r.bodyCount&&(eX(n,e,x),r.replay(l,t.renderer.buffer,x.indirectDrawData,f,r.bodyCount))}else x.direct?p.commandList.replayDirect(l,x.indirectDrawData,f):p.commandList.replay(l,t.renderer.buffer,x.indirectDrawData,f)}b>0&&(l.executeBundle(eQ),eQ.length=0)}function eX(e,t,r){e.globalBindGroup.setResource(t.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(r.survivors.bufferResource,"uRenderableInstanceStorage"),e.globalBindGroup.setResource(t.instanceStoreBuffer?.bufferResource??d,"uInstanceStorage")}let eQ=[];i.L3G.register({clear:()=>{eQ.length=0}});let e0={name:"shadowGlobal",structs:{Renderable:f.G8,RenderableInstance:f.p9,BoneMatrix:f.Rx,GeometryData:f.IN},bindings:{global:{uRenderableStorage:{type:"storage<Renderable>",visibility:"vertex"},uRenderableInstanceStorage:{type:"storage<RenderableInstance>",visibility:"vertex"},uBonePitStorage:{type:"storage<BoneMatrix>",visibility:"vertex"},uMorphStorage:{type:"storage<f32>",visibility:"vertex"},uGeometryStorage:{type:"storage<GeometryData>",visibility:"vertex"}}}};var e2=r(62762),e3=r(86722);let e1={bindGroups:[{name:"global",ubo:!0},"camera","local"],gpu:`

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
`};var e4=class extends e3.f{_bundleRun=[];constructor(e){let t=(0,v.Or)();t.depthTest=!0,t.depthMask=!0,t.culling=!0,t.clockwiseFrontFace=!1,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:b.J.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGpu:[e0],template:e1,includeGlobal:!1},state:t}})}_applyZRangeFix=!0;prepare(e){let{view3d:t,lights:r}=e;this._bindShadowSource(t,this.renderTarget.depthStencilTexture);let a=this.pipe.renderer.material3d.batcher,i=this.pipe.renderer.compute3d,n=this.pipe.geometryDataStoreBuffer.buffer;for(let r of t._meshBatches){if(!r.renderData._worldVisible)continue;let i=r.drawLists[this.bit];if(!i)continue;let n=i.gpuData,o=i.view;if(0===o.count){i.claimDrawEmpty();continue}i.nextBuild(t._updateTick)&&(i.claimDrawBuilt(),n.instanceBuffer.populateIds(o),a.render({renderables:o,globalBindGroup:e.globalBindGroup,commandList:i.commandList,drawData:i.drawData,passBit:this.bit,bindsMaterial:!1,batch:r,view3d:t}),n.instanceBuffer.upload(o.count))}for(let e=0;e<r.length;e++){let a=r[e],o=a._gpuShadowData;if(!o||(o.cullResults?.removeDetached(t),!(0,c.ac)(a)))continue;let s=(0,c.lP)(a),u=o.cascades,l=o.cullResults??=new e2.p,d=(0,eN._G)("shadow");for(let e=0;e<s;e++){let r=u?.[e];if(!r||!r.needsRender)continue;let a=r.cameraData.frustum;for(let r of t._meshBatches){if(!r.renderData._worldVisible)continue;let t=r.drawLists[this.bit];if(!t||0===t.view.count)continue;if(0===e)for(let e=s;e<4;e++)l.remove(r,e);let o=t.view.count<=d,u=l.ensure(r,e);u.sync(t,o);let c=(0,eN.b3)(r.cull,!o);if("off"===c)eH(i,t,r,n,u);else if("cpu"===c)eq(t,r,a.planesData,u);else{let e=(0,eN.YM)(a.planesData,r.storeBuffer.data);i.dispatch(u.indirectDrawData.drawCallsBuffer,t.gpuData.instanceBuffer.buffer,u.survivors.buffer,r.storeBuffer.buffer,n,e,t.commandList.count,t.view.count)}}}}}render(e){let{view3d:t,lights:r}=e,a=this.pipe.renderer,i=a.encoder,n=a.pipeline;for(let o of(n.setColorMask(0),r)){if(!(0,c.ac)(o))continue;let r=this.getShadowGPUData(o).cullResults;if(!r)continue;let n=(0,c.lP)(o);for(let s=0;s<n;s++){let n=this._cascadeSlot(o,s);if(!n.needsRender)continue;let u=o._shadowDataIndex+s,l=n.cameraData.bindGroup;for(let o of(a.renderTarget.bind({target:this.renderTarget,clear:!0,layer:u}),a.ubo.updateUniformGroup(n.cameraData.uniformGroup),n.cameraData.uniformGroup.buffer.autoGarbageCollect=!1,t._meshBatches)){if(!o.renderData._worldVisible)continue;let t=o.drawLists[this.bit];if(!t||0===t.view.count)continue;let u=r.get(o,s);if(!u)continue;if(u.direct&&"off"!==o.cull){u.bundle=null,e.globalBindGroup.setResource(o.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(u.survivors.bufferResource,"uRenderableInstanceStorage"),t.commandList.replayDirect(i,u.indirectDrawData,n.cameraData);continue}let d=u.bundle;if(!d||u.isBundleStale(t,l)||!i.isBundleValid(d)){let{globalBindGroup:r}=e;r.setResource(o.storeBuffer.bufferResource,"uRenderableStorage"),r.setResource(u.survivors.bufferResource,"uRenderableInstanceStorage"),i.beginBundle(`shadow cascade ${s} batch ${o.uid}`),u.direct?t.commandList.replayDirect(i,u.indirectDrawData,n.cameraData):t.commandList.replay(i,a.buffer,u.indirectDrawData,n.cameraData,0,t.commandList.bodyCount),u.bundle=i.endBundle(),u.claimBundleRecorded(t,l)}let c=t.commandList;c.touch(a.gc.now),this._bundleRun.push(u.bundle),!u.direct&&c.count>c.bodyCount&&(e.globalBindGroup.setResource(o.storeBuffer.bufferResource,"uRenderableStorage"),e.globalBindGroup.setResource(u.survivors.bufferResource,"uRenderableInstanceStorage"),c.replay(i,a.buffer,u.indirectDrawData,n.cameraData,c.bodyCount))}this._bundleRun.length>0&&(i.executeBundle(this._bundleRun),this._bundleRun.length=0)}this._completeShadowUpdate(o)}n.setColorMask(15),e.activeTarget=null}},e5=r(41741),e8=r(32032),e6=r(17891),e7=r(21293),e9=r(87137),te=r(99566),tt=r(98505),tr=r(45517),ta=r(6105),ti=r(54307),tn=r(44847),to=r(89620),ts=r(58506);let tu=new i.Q1f,tl=new i.M_G,td={x:0,y:0};var tc=class{static extension={type:[i.AgS.WebGPUPipes],name:"view3d"};renderer;_brdfLutTexture;_iblEnvironmentMap=new Map;_onEnvironmentDestroy=e=>{this._iblEnvironmentMap.get(e)?.source.unload(),this._iblEnvironmentMap.delete(e)};_viewport=new i.M_G;_sortForwardByDistance=(e,t,r)=>{(0,ti.Nu)(e,t.storeBuffer.data,r)};_forwardOptions={pipe:this,bit:0,bindsMaterial:!1,cullResults:null,camera:null,session:null,useBundles:!1,sortBatch:void 0};materialStoreBuffer;_morphStoreBuffer=new e9.E;geometryDataStoreBuffer=new e6.W;atlasPool=to.e.from({rebaseIndices:!1});_managedViews;_destroyed=!1;_colorOutputDraw=null;constructor(e){this.renderer=e,this._managedViews=new tn.E(this.renderer),this.renderer.runners.contextChange.add(this)}contextChange(e){if(!e.device.features.has("indirect-first-instance"))throw Error("@pixi/3d requires the WebGPU 'indirect-first-instance' feature (used by the batched indirect draw path).");this.materialStoreBuffer??=new e7.r({alignment:this.renderer.limits.minUniformBufferOffsetAlignment,rendererType:this.renderer.type})}createShadowPass(e){return new e4({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}renderForward(e,t){eZ(this._fillForwardOptions(e,t,"distance"===e.sort)),this._releaseForwardOptions()}prepareForward(e,t){if(!(0,ta.x)(e))return;let r=this._fillForwardOptions(e,t,!1);eJ(r),eY(r),this._releaseForwardOptions()}_fillForwardOptions(e,t,r){let a=this._forwardOptions;return a.useBundles=(0,ta.x)(e),a.bit=e.bit,a.bindsMaterial=e.bindsMaterial,a.cullResults=e.cullResults,a.camera=e.camera,a.session=t,a.sortBatch=r?this._sortForwardByDistance:void 0,a}_releaseForwardOptions(){this._forwardOptions.cullResults=null,this._forwardOptions.camera=null,this._forwardOptions.session=null}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.encoder.setViewport(e)}_depthClearShader=null;_depthClearState=null;clearDepth(e){this._depthClearShader||this._buildDepthClear();let{encoder:t,pipeline:r}=this.renderer;r.setColorMask(0),t.draw({geometry:(0,e5.A)(),shader:this._depthClearShader,state:this._depthClearState}),r.setColorMask(15)}_buildDepthClear(){let e=new i.UwB;e.depthTest=!1,e.depthMask=!0,e.culling=!1,e.blend=!1,this._depthClearState=e,this._depthClearShader=i.Mtr.from({gpu:{vertex:{entryPoint:"mainVertex",source:`
            struct VertexOutput { @builtin(position) position: vec4<f32> };

            @vertex
            fn mainVertex(@location(0) aPosition: vec2<f32>) -> VertexOutput {
              var output: VertexOutput;
              output.position = vec4<f32>(aPosition, 1.0, 1.0);
              return output;
            }
          `},fragment:{entryPoint:"mainFragment",source:`
            @fragment
            fn mainFragment() -> @location(0) vec4<f32> {
              return vec4<f32>(0.0, 0.0, 0.0, 1.0);
            }
          `}}})}copyColor(e,t,r){let{target:a,viewport:i}=e;if(!a.colorTexture)return;this.renderer.renderTarget.finishRenderPass();let n=t.frame,o=t.source.resolution;td.x=Math.round(n.x*o),td.y=Math.round(n.y*o),this.renderer.renderTarget.copyToTexture(a,t,tl.copyFrom(i),tl,td),r.activeTarget=null}outputColor(e,t,r,a){e.target.colorTexture&&(this.renderer.renderTarget.finishRenderPass(),(this._colorOutputDraw??=new tr.t(this.renderer)).draw(this,e,t,a),r.activeTarget=null)}generateMips(e,t){let r=t.view3d._graph.getTexture(e,t).source;this.renderer.renderTarget.finishRenderPass(),t.activeTarget=null,this.renderer.mipChain3d.generate(r)}resolveColor(){}copyDepth(e,t,r){let{target:a,viewport:i}=e;a.depthStencilTexture&&(this.renderer.renderTarget.finishRenderPass(),td.x=0,td.y=0,this.renderer.renderTarget.copyDepthTexture(a,t,tl.copyFrom(i),tl,td),r.activeTarget=null)}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;let t=g(e,this.renderer),r=this.renderer.renderTarget.renderTarget;e._ensureInitialized(this.renderer,t,r.colorTexture.source.resolution),this._managedViews.track(e);let a=e.environment;a&&(this._brdfLutTexture||=(0,tt.N)({renderer:this.renderer}),t.globalBindGroup.setResource(this._brdfLutTexture.source,"uBrdfLutTexture"));let i=this._prefilteredEnvironment(a);t.globalBindGroup.getResource("uEnvironmentTexture")!==i&&(t.globalBindGroup.setResource(i,"uEnvironmentTexture"),e._invalidateBundleCaches());let n=e.lights;if(0===e._meshSlots.count&&1===e._meshBatches.length)return;let o={view3d:e,lights:n,defaultTarget:r,defaultFrontFaceInverted:!1,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,renderer:this.renderer};(0,ts.u)(e,this,o)&&(t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,"uMaterialStorage"),t.globalBindGroup.setResource(e._bonePit.bufferResource,"uBonePitStorage"),t.globalBindGroup.setResource(this._morphStoreBuffer.bufferResource,"uMorphStorage"),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.bufferResource,"uGeometryStorage"),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),this.atlasPool.update(),(0,te.Z)(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer,this.geometryDataStoreBuffer)&&e._invalidateDrawCaches(),this.prepareView(o),e._graph.run(o))}destroy(){if(!this._destroyed){for(let[e,t]of(this._destroyed=!0,this._managedViews.destroy(),this._colorOutputDraw?.destroy(),this._colorOutputDraw=null,this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0,this._iblEnvironmentMap))e.off("destroy",this._onEnvironmentDestroy),t.destroy(!0);this._iblEnvironmentMap=null,this.renderer.runners.contextChange.remove(this),this.materialStoreBuffer.destroy(),this.materialStoreBuffer=null,this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearShader?.destroy(),this._depthClearShader=null,this._depthClearState=null}}_prefilteredEnvironment(e){if(!(e instanceof i.b4q)||e.source.destroyed)return l.pC.source;let t=this._iblEnvironmentMap.get(e.source);return t||(t=(0,e8.f)({renderer:this.renderer,sourceTexture:e}),this._iblEnvironmentMap.set(e.source,t),e.source.once("destroy",this._onEnvironmentDestroy)),t.source}prepareView(e){let{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){let{fog:t}=e,r=g(e,this.renderer).globalUniformGroup,a=r.uniforms;if(a.uTime=performance.now()/1e3,a.uExposure=e.exposure,a.uDisplayExposure=Math.pow(e.exposure,1/2.2),t){tu.setValue(t.color??0xcccccc),(0,v.Og)(a.uFogColor,0,tu,e.exposure);let r=a.uFogParams;r[0]=t.near||0,r[1]=t.far||0x5f5e0ff,r[2]=t.density||0}r.update(),this.renderer.ubo.updateUniformGroup(r)}};i.XOh.add(u,w,_,ez,tc)}}]);