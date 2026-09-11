import{at as bt,au as X,M as I,a4 as Q,w as Rt,a5 as R,h as M,av as J,m as Pt,T as gt,aw as kt,ax as Ut,ay as Xt,az as Ot,aA as H,x as Et,aB as Ht,aC as $t,aD as tt,aE as et,aF as qt,aG as U,_ as rt,aH as Yt,V as jt,aI as Wt,g as ot,af as $,G as Zt,$ as q,aJ as Kt,B as xt,v as _t,a as vt,d as Qt,aK as Jt,A as te,ag as ee}from"./index-50evykZy.js";import{c as re,R as oe}from"./RenderTexture-G8_TWQt5.js";var Qe=class extends bt{_dirtyQueue=[];_dirtyCount=0;constructor(){super({stride:64,initialSize:100,indexKey:"_materialIndex",copier:(t,e,r,o,s)=>{e.set(t.data._f32,s)}})}enqueueDirty(t){!this.buffer||t._storeQueued||(t._storeQueued=!0,this._dirtyQueue[this._dirtyCount++]=t)}register(t){const e=t._uploadQueue;e===this&&t._materialIndex!==-1||(e&&e!==this&&e.remove(t),t._uploadQueue=this,t._storeQueued=!1,this.allocate(t),this.enqueueDirty(t))}update(){const t=this._dirtyQueue,e=this._dirtyCount;this._dirtyCount=0;for(let r=0;r<e;r++){const o=t[r];t[r]=null,o._uploadQueue===this&&(o._storeQueued=!1,this.set(o))}super.update()}destroy(){this._dirtyQueue.length=0,this._dirtyCount=0,super.destroy()}};const Je=.1,st=new I,yt=new I;let wt=0,St=0,Ct=0,Bt=0;function se(t,e,r,o,s){s.length=r;for(let a=1;a<=r;a++){const n=a/r,i=t*Math.pow(e/t,n),u=t+(e-t)*n;s[a-1]=o*i+(1-o)*u}return s}function ae(t,e){st.getInverse(t.viewProjection),yt.multiplyMatrices(e,st)}function ne(t,e){const r=yt.elements;let o=1/0,s=-1/0,a=0,n=0;for(const i of[t,e])for(let u=-1;u<=1;u+=2)for(let c=-1;c<=1;c+=2){const l=r[0]*c+r[4]*u+r[8]*i+r[12],f=r[1]*c+r[5]*u+r[9]*i+r[13],g=r[2]*c+r[6]*u+r[10]*i+r[14],h=r[3]*c+r[7]*u+r[11]*i+r[15],m=g/h;a+=l/h,n+=f/h,m<o&&(o=m),m>s&&(s=m)}wt=o,St=s,Ct=a*.125,Bt=n*.125}function at(t,e){const r=t.projection.elements;return(r[10]*-e+r[14])/(r[11]*-e+r[15])}function Vt(t,e,r){const o=t.elements,s=1/(e-r);o[10]=s,o[14]=e*s}function O(t,e,r){const o=2*e/r;return Math.floor(t/o)*o}function ie(t,e,r,o,s,a,n,i=!0){ne(at(t,r),at(t,o));const u=t.projection.elements,c=t.mode==="orthographic"?1:o,l=c/u[5],f=c/u[0],g=(o-r)*.5,h=Math.sqrt(f*f+l*l+g*g),m=-St-h*Dt,b=-wt,d=O(Ct,h,n),p=O(Bt,h,n);s.makeOrthographic(d-h,d+h,p+h,p-h,m,b),i&&Vt(s,m,b),a.multiplyMatrices(s,e)}const nt=new X,Dt=4;function le(t,e,r,o,s,a=!0){t.applyMatrix4(e,nt);const{min:n,max:i}=nt,u=(i.x-n.x)*.5*1.1,c=(i.y-n.y)*.5*1.1,l=O((n.x+i.x)*.5,u,s),f=O((n.y+i.y)*.5,c,s),g=-i.z-Math.max(u,c)*Dt,h=-n.z;r.makeOrthographic(l-u,l+u,f+c,f-c,g,h),a&&Vt(r,g,h),o.multiplyMatrices(r,e)}const ce=(t,e,r,o,s)=>{const{center:a,radius:n}=t.boundsSphere;if(e[s]=a.x,e[s+1]=a.y,e[s+2]=a.z,e[s+3]=t.dynamic?-1:n+t._morphBoundsExpansion,t.morphTargetCount>0){const i=t._morphDeltaBase>=0;r[s+4]=i?t._morphDeltaBase:0,r[s+5]=i?t.morphTargetCount:0,r[s+6]=i&&t._geometryAtlasAllocation?.baseVertex||0}};var tr=class extends bt{constructor(t=100){super({stride:8,indexKey:"_geometryDataIndex",copier:ce,initialSize:t})}set(t){const e=t._geometryDataStore;return e!==this&&(e?.remove(t),t._geometryDataStore=this),super.set(t)}};const ue=4;var er=class{data;buffer;bufferResource;bufferVersion=0;_deltaCursor=0;_deltaCapacity;_weightCursor=0;_freeSlots=new Map;_freeDeltaBlocks=new Map;_minDirty=1/0;_maxDirty=-1/0;_retiredBuffers=[];_texture=null;_textureSource=null;constructor(t={}){this._deltaCapacity=t.deltaCapacity??4096;const e=lt(this._deltaCapacity,t.weightCapacity??1024);this.data=new Float32Array(this._deltaCapacity+e),this.buffer=this._createBuffer(),this.bufferResource=new Q({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}uploadDeltas(t){const e=t._morphStore;if(e===this)return;if(e){e.freeDeltas(t),Rt(`MorphStoreBuffer: geometry #${t.uid} was packed by another renderer and draws unmorphed here`);return}const r=t._morphTargets;if(!r||r.length===0)return;const o=t.hasMorphNormals,s=o?8:ue,a=r.length,n=r[0].positions.length/3,i=n*a*s,u=this._freeDeltaBlocks.get(i);let c;u&&u.length>0?c=u.pop():(c=this._deltaCursor,c+i>this._deltaCapacity&&this._growArena(c+i),this._deltaCursor+=i);const l=new Float64Array(a),f=this.data;for(let h=0;h<n;h++){const m=h*3;for(let b=0;b<a;b++){const d=c+(h*a+b)*s,p=r[b].positions,x=p[m],_=p[m+1],v=p[m+2];f[d]=x,f[d+1]=_,f[d+2]=v,f[d+3]=0;const S=x*x+_*_+v*v;if(S>l[b]&&(l[b]=S),o){const y=r[b].normals;f[d+4]=y[m],f[d+5]=y[m+1],f[d+6]=y[m+2],f[d+7]=0}}}let g=0;for(let h=0;h<a;h++)g+=Math.sqrt(l[h]);t._morphBoundsExpansion=g,t._morphDeltaBase=c,t._morphDeltaFloats=i,t._morphStore=this,t._morphTargets=null,this._markDirty(c,c+i-1)}freeDeltas(t){const e=t._morphDeltaBase;if(e<0)return;const r=t._morphDeltaFloats;t._morphDeltaBase=-1,t._morphDeltaFloats=0,t._morphStore=null,this.buffer&&it(this._freeDeltaBlocks,r,e)}sync(t){for(let r=0;r<t.length;r++)this.uploadDeltas(t[r].geometry);const e=this._deltaCapacity;for(let r=0;r<t.length;r++){const o=t[r],s=o.morph;s._store!==this&&(s._store?.freeSlot(s),this.allocSlot(s));const a=e+s._slot;s._weightIndex!==a&&(s._weightIndex=a,o._storeDirty=!0),this.writeWeights(s)}this.update()}allocSlot(t){let e=1;for(;e<t.weights.length;)e<<=1;const r=this._freeSlots.get(e);let o;r&&r.length>0?o=r.pop():(o=this._weightCursor,this._deltaCapacity+o+e>this.data.length&&this._growWeights(o+e),this._weightCursor+=e),t._slot=o,t._slotSize=e,t._store=this}freeSlot(t){const e=t._slot;if(e<0)return;const r=t._slotSize;t._slot=-1,t._slotSize=0,t._store=null,this.buffer&&it(this._freeSlots,r,e)}writeWeights(t){const e=t.weights,r=this.data,o=this._deltaCapacity+t._slot,s=Math.min(e.length,t._slotSize);let a=!1;for(let n=0;n<s;n++){const i=e[n];r[o+n]!==i&&(r[o+n]=i,a=!0)}a&&this._markDirty(o,o+s-1)}update(){this._minDirty>this._maxDirty||(this.buffer.update((this._maxDirty-this._minDirty+1)*4,this._minDirty*4),this._textureSource?.update(),this._minDirty=1/0,this._maxDirty=-1/0)}_freeRetired(){for(let t=0;t<this._retiredBuffers.length;t++)this._retiredBuffers[t].destroy();this._retiredBuffers.length=0}destroy(){this.buffer&&(this.bufferResource.destroy(!1),this.buffer.destroy(),this._freeRetired(),this._texture?.destroy(!0),this._texture=null,this._textureSource=null,this.data=null,this.buffer=null,this.bufferResource=null)}_createBuffer(){return new R({data:this.data,usage:M.STORAGE|M.COPY_DST|M.COPY_SRC,label:"MorphStoreBuffer",shrinkToFit:!1})}_markDirty(t,e){t<this._minDirty&&(this._minDirty=t),e>this._maxDirty&&(this._maxDirty=e)}_growArena(t){let e=this._deltaCapacity;for(;e<t;)e*=2;this._reallocate(e,this.data.length-this._deltaCapacity)}_growWeights(t){let e=this.data.length-this._deltaCapacity;for(;e<t;)e*=2;this._reallocate(this._deltaCapacity,e)}_reallocate(t,e){e=lt(t,e);const r=new Float32Array(t+e);if(r.set(this.data.subarray(0,this._deltaCursor),0),r.set(this.data.subarray(this._deltaCapacity,this._deltaCapacity+this._weightCursor),t),this.data=r,this._deltaCapacity=t,this._retiredBuffers.push(this.buffer),this.buffer=this._createBuffer(),this.bufferResource=new Q({buffer:this.buffer}),this.bufferVersion++,this._textureSource){const{width:o,height:s}=J(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==o||this._textureSource.height!==s)&&this._textureSource.resize(o,s),this._textureSource.update()}this._markDirty(0,t+this._weightCursor-1)}_initTexture(){const{width:t,height:e}=J(this.data.length);return this._textureSource=new Pt({resource:this.data,width:t,height:e,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"}),this._texture=new gt({source:this._textureSource}),this._texture}};function it(t,e,r){let o=t.get(e);o||(o=[],t.set(e,o)),o.push(r)}function lt(t,e){const r=t+e;return e+(kt(r)-r)}const de=300;function rr(t,e,r){switch(t){case"off":return"off";case"cpu":return"cpu";case"gpu":return e?"gpu":"cpu";default:return r<=de?"off":e?"gpu":"cpu"}}const L=new Float32Array(24);function or(t,e){const r=e[0],o=e[1],s=e[2],a=e[4],n=e[5],i=e[6],u=e[8],c=e[9],l=e[10],f=e[12],g=e[13],h=e[14];if(r===1&&n===1&&l===1&&o===0&&s===0&&a===0&&i===0&&u===0&&c===0&&f===0&&g===0&&h===0)return t;for(let m=0;m<6;m++){const b=m*4,d=t[b],p=t[b+1],x=t[b+2],_=r*d+o*p+s*x,v=a*d+n*p+i*x,S=u*d+c*p+l*x,y=1/Math.sqrt(_*_+v*v+S*S);L[b]=_*y,L[b+1]=v*y,L[b+2]=S*y,L[b+3]=(f*d+g*p+h*x+t[b+3])*y}return L}function sr(t,e,r,o,s){let a=!1;return r.lastAtlasBufferVersion!==t.bufferVersion&&(r.lastAtlasBufferVersion=t.bufferVersion,a=!0),r.lastMaterialStoreBufferVersion!==e.bufferVersion&&(r.lastMaterialStoreBufferVersion=e.bufferVersion,a=!0),r.lastMorphStoreBufferVersion!==o.bufferVersion&&(r.lastMorphStoreBufferVersion=o.bufferVersion,a=!0),s&&r.lastGeometryStoreBufferVersion!==s.bufferVersion&&(r.lastGeometryStoreBufferVersion=s.bufferVersion,a=!0),a}const ar={transform:"mat4x4<f32>",bonePitIndex:"u32",materialIndex:"u32",geometryDataIndex:"u32",visibility:"u32",morphWeightIndex:"u32"},nr={boundsCenter:"vec3<f32>",boundsRadius:"f32",morphDeltaBase:"u32",morphTargetCount:"u32",baseVertex:"u32",_pad:"u32"},ir={id:"u32",texSlots:"u32"},lr={rows:"mat3x4<f32>"},cr={position:"vec3<f32>",kind:"f32",color:"vec3<f32>",range:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",cascadeCount:"f32",_pad:"f32"},ur={lightSpaceMatrix:"mat4x4<f32>",shadowParams:"vec4<f32>",cascadeSplits:"vec4<f32>"},dr={position:"vec3<f32>",type:"f32",color:"vec3<f32>",range:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32"},fr={lightSpaceMatrix:"mat4x4<f32>",shadowParams:"vec4<f32>",cascadeSplits:"vec4<f32>"},hr={hard:[[0,0]],pcf:[[-1,-1],[1,-1],[-1,1],[1,1]],"pcf-high":[[-2,-2],[0,-2],[2,-2],[-2,0],[0,0],[2,0],[-2,2],[0,2],[2,2]]},ct=/\{\{(.*?)\}\}/g,ut=8;function fe(t,e){let r=t;for(let s=0;s<ut;s++){const a=r.replace(ct,(n,i)=>{const u=e[i];return u?u.join(`
`):""});if(a===r)break;r=a}const o=r.match(ct);if(o){const s=[...new Set(o)].join(", ");throw new Error(`[fillTemplateSlots] Slot markers still present after ${ut} substitution passes: ${s}. A slot's code reintroduces its own marker (directly or via another slot) — break the cycle.`)}return r}function mr(t,e){for(const o of e)o.collectData?.(t);for(const o of e)o.preCompile?.(t);const r={};for(const o of e){const s=o.injectCode?.(t);if(s)for(const[a,n]of Object.entries(s))!n||!/\S/.test(n)||(r[a]??=[],r[a].push(n))}return fe(t.templateString,r)}function he(t,e,r){const o=r;if(!o?.type)throw new Error(`[ShaderBit:${t}] overrideDefs.${e} missing 'type'.`);const s=Object.prototype.hasOwnProperty.call(o,"default"),a=o.required===!0;if(s&&a)throw new Error(`[ShaderBit:${t}] overrideDefs.${e} cannot specify both 'default' and 'required: true'.`);if(!s&&!a)throw new Error(`[ShaderBit:${t}] overrideDefs.${e} must specify either 'default' or 'required: true'.`);if(a)return{type:o.type,required:!0};if(typeof o.default!="number"||!Number.isFinite(o.default))throw new Error(`[ShaderBit:${t}] overrideDefs.${e}.default must be a finite number.`);return{type:o.type,default:o.default,required:!1}}function pr(t){const e=Object.create(null);for(const r of t)if(r.overrideDefs)for(const[o,s]of Object.entries(r.overrideDefs)){const a=he(r.name,o,s),n=e[o];if(n&&(n.type!==a.type||n.required!==a.required||!n.required&&n.default!==a.default))throw new Error(`[ShaderBit overrides] Duplicate override '${o}' has conflicting definitions.
Existing: ${JSON.stringify(n)}
New (from '${r.name}'): ${JSON.stringify(a)}`);e[o]=n??a}return e}function me(t,e){return t==="u32"?`${Math.trunc(e)}u`:t==="i32"?`${Math.trunc(e)}`:Number.isInteger(e)?`${e}.0`:`${e}`}function br(t){const e=[];for(const r of Object.keys(t).sort()){const o=t[r];if(o.required)e.push(`override ${r}: ${o.type};`);else{const s=me(o.type,o.default);e.push(`override ${r}: ${o.type} = ${s};`)}}return e.length?e.join(`
`):""}function pe(t,e){return t==="u32"?`${Math.trunc(e)}`:t==="i32"?`${Math.trunc(e)}`:Number.isInteger(e)?`${e}.0`:`${e}`}function gr(t,e){const r=[];for(const o of Object.keys(t).sort()){const s=t[o],a=e[o],n=a!==void 0;if(s.required&&!n)throw new Error(`[glslOverrides] required override '${o}' has no value supplied via descriptor.overrides.`);const i=n?a:s.default;r.push(`#define ${o} ${pe(s.type,i)}`)}return r.length?r.join(`
`):""}function xr(t,e,r){const o={};for(const s of t){const a=s[e]?.[r];if(a)for(const[n,i]of Object.entries(a))i&&(o[n]??=[],o[n].push(i))}return o}const be=/\{\{(.*?)\}\}/g;function ge(t){const e={};return(t.match(be)?.map(r=>r.replace(/[{()}]/g,""))??[]).forEach(r=>{e[r]=[]}),e}const dt=new Map;function _r(t){let e=dt.get(t);return e||(e=new Set(Object.keys(ge(t))),dt.set(t,e)),e}const vr={x:0,y:1,z:0};var yr=class{globalUniformGroup;globalBindGroup;lastMaterialStoreBufferVersion=-1;lastAtlasBufferVersion=-1;lastMorphStoreBufferVersion=-1;lastGeometryStoreBufferVersion=-1;constructor(t,e){this.globalUniformGroup=t,this.globalBindGroup=e}destroy(){this.globalBindGroup.destroy(),this.globalUniformGroup.buffer?.destroy()}};const wr={name:"doubleSidedNormal",gpu:{fragment:{material:`
  normal = select(-normal, normal, input.frontFacing);
`}},gl:{fragment:{material:`
  if (!gl_FrontFacing) {
    normal = -normal;
  }
`}}},Sr={name:"flatShading",gpu:{fragment:{material:`
  let flatNormal = normalize(cross(dpdx(input.vPosition), dpdy(input.vPosition)));
  normal = select(-flatNormal, flatNormal, dot(flatNormal, normal) >= 0.0);
`}},gl:{fragment:{material:`
  vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  normal = dot(flatNormal, normal) >= 0.0 ? flatNormal : -flatNormal;
`}}},Nt=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,Mt=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`;function xe(t){return`
  // Rows 0/1 of the view matrix are the world-space camera right/up (an
  // orthonormal view matrix's transpose is its inverse). WGSL indexes
  // m[col][row], so row 0 is m[0][0], m[1][0], m[2][0].
  let bbRight = vec3<f32>(global.uViewMatrix[0][0], global.uViewMatrix[1][0], global.uViewMatrix[2][0]);
  let bbUp    = vec3<f32>(global.uViewMatrix[0][1], global.uViewMatrix[1][1], global.uViewMatrix[2][1]);
  let bbNormal = cross(bbRight, bbUp);

  let bbScaleX = length(modelMatrix[0].xyz);
  let bbScaleY = length(modelMatrix[1].xyz);
  let bbScaleZ = length(modelMatrix[2].xyz);

  worldPosition = vec4<f32>(
    modelMatrix[3].xyz
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  clipPosition = global.uProjectionMatrix * global.uViewMatrix * worldPosition;
${t?Nt:""}`}function _e(t){return`
  vec3 bbRight = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
  vec3 bbUp    = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
  vec3 bbNormal = cross(bbRight, bbUp);

  float bbScaleX = length(modelMatrix[0].xyz);
  float bbScaleY = length(modelMatrix[1].xyz);
  float bbScaleZ = length(modelMatrix[2].xyz);

  worldPosition = vec4(
    modelMatrix[3].xyz
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
${t?Mt:""}`}function ve(t){return`
  let bbColX = modelMatrix[0].xyz;
  let bbColY = modelMatrix[1].xyz;
  let bbScaleX = length(bbColX);
  let bbScaleY = length(bbColY);
  let bbScaleZ = length(modelMatrix[2].xyz);
  let bbCentre = modelMatrix[3].xyz;

  // Spin axis = the node's up column, so a tilted node billboards around its
  // tilted axis. A zero-height quad (unloaded 0x0 texture) has no axis to spin
  // around; world up stands in and the corner offsets are zero anyway.
  var bbUp = vec3<f32>(0.0, 1.0, 0.0);
  if (bbScaleY > 1e-8) { bbUp = bbColY / bbScaleY; }

  // Direction to the camera, flattened against the spin axis.
  let bbToCam = global.uCameraPosition - bbCentre;
  let bbFlat = bbToCam - bbUp * dot(bbToCam, bbUp);
  let bbFlatLenSq = dot(bbFlat, bbFlat);

  // Camera sitting on the spin axis leaves nothing to face: the quad is edge-on
  // from there whatever we pick, so fall back to the node's own X column.
  var bbRight = vec3<f32>(1.0, 0.0, 0.0);
  if (bbFlatLenSq > 1e-8) {
    // cross(unit, perpendicular) already has length |bbFlat|.
    bbRight = cross(bbUp, bbFlat) * inverseSqrt(bbFlatLenSq);
  } else if (bbScaleX > 1e-8) {
    bbRight = bbColX / bbScaleX;
  }

  let bbNormal = cross(bbRight, bbUp);

  worldPosition = vec4<f32>(
    bbCentre
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  clipPosition = global.uProjectionMatrix * global.uViewMatrix * worldPosition;
${t?Nt:""}`}function ye(t){return`
  vec3 bbColX = modelMatrix[0].xyz;
  vec3 bbColY = modelMatrix[1].xyz;
  float bbScaleX = length(bbColX);
  float bbScaleY = length(bbColY);
  float bbScaleZ = length(modelMatrix[2].xyz);
  vec3 bbCentre = modelMatrix[3].xyz;

  vec3 bbUp = vec3(0.0, 1.0, 0.0);
  if (bbScaleY > 1e-8) { bbUp = bbColY / bbScaleY; }

  vec3 bbToCam = uCameraPosition - bbCentre;
  vec3 bbFlat = bbToCam - bbUp * dot(bbToCam, bbUp);
  float bbFlatLenSq = dot(bbFlat, bbFlat);

  vec3 bbRight = vec3(1.0, 0.0, 0.0);
  if (bbFlatLenSq > 1e-8) {
    bbRight = cross(bbUp, bbFlat) * inversesqrt(bbFlatLenSq);
  } else if (bbScaleX > 1e-8) {
    bbRight = bbColX / bbScaleX;
  }

  vec3 bbNormal = cross(bbRight, bbUp);

  worldPosition = vec4(
    bbCentre
      + bbRight * (position.x * bbScaleX)
      + bbUp * (position.y * bbScaleY)
      + bbNormal * (position.z * bbScaleZ),
    1.0
  );
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
${t?Mt:""}`}const ft=Object.create(null);function Cr(t,e){const r=`${t}:${e}`,o=ft[r];if(o)return o;if(t==="none")throw new Error("[meshBillboardBits] billboardMode 'none' has no bit — the caller must skip injection.");const s=t==="spherical",a={name:`meshBillboard${s?"Spherical":"Cylindrical"}${e?"Lit":""}`,gpu:{vertex:{afterTransform:s?xe(e):ve(e)}},gl:{vertex:{afterTransform:s?_e(e):ye(e)}}};return ft[r]=a,a}const Br={name:"normal",attributes:{aNormal:"float32x3"},gpu:{vertex:{input:"normal = input.aNormal;"}},gl:{vertex:{input:"normal = aNormal;"}}},Vr={name:"normalMapping",gpu:{header:`
fn calculateTBN(surfaceNormal: vec3<f32>, position: vec3<f32>, texCoord: vec2<f32>) -> mat3x3<f32> {
  let dp1 = dpdx(position);
  let dp2 = -dpdy(position); // WGSL window-Y is flipped vs GLSL; see file header
  let duv1 = dpdx(texCoord);
  let duv2 = -dpdy(texCoord);

  let dp2perp = cross(dp2, surfaceNormal);
  let dp1perp = cross(surfaceNormal, dp1);
  let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
  let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

  let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
  return mat3x3<f32>(tangent * invmax, bitangent * invmax, surfaceNormal);
}
`,fragment:{material:`
  // Normal mapping. material.normalScale defaults to 1 (no-op); broadcast
  // across xy and renormalised by the final normalize().
  let normalMapSample = sampleNormal(input.vUV).rgb;
  var tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal = vec3<f32>(tangentNormal.xy * material.normalScale, tangentNormal.z);
  let tbnMatrix = calculateTBN(normal, input.vPosition, input.vUV);
  normal = normalize(tbnMatrix * tangentNormal);
`}},gl:{fragment:{header:`
mat3 calculateTBN(highp vec3 surfaceNormal, highp vec3 position, highp vec2 texCoord) {
  highp vec3 dp1 = dFdx(position);
  highp vec3 dp2 = dFdy(position);
  highp vec2 duv1 = dFdx(texCoord);
  highp vec2 duv2 = dFdy(texCoord);

  highp vec3 dp2perp = cross(dp2, surfaceNormal);
  highp vec3 dp1perp = cross(surfaceNormal, dp1);
  highp vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
  highp vec3 bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

  highp float invmax = inversesqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
  return mat3(tangent * invmax, bitangent * invmax, surfaceNormal);
}
`,material:`
  {
  // Normal mapping — see WGSL counterpart for the normalScale rationale.
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = calculateTBN(normal, vPosition, vUV);
  normal = normalize(tbnMatrix * tangentNormal);
  }
`}}},Dr={name:"no-shadow",gpu:{header:`
    fn calculateShadow(
      light: Light,
      worldPos: vec3<f32>, 
      normal: vec3<f32>,
      NdotL: f32
    ) -> f32 {
      return 1.0;
    }
    `},gl:{header:`
    float calculateShadow(
      Light light,
      vec3 worldPos,
      vec3 normal,
      float NdotL
    ) {
      return 1.0;
    }
    `}},we={float32x3:"1.0",float32x4:"1.0",snorm8x4:"127.0",unorm8x4:"255.0",snorm16x4:"32767.0",unorm16x4:"65535.0"},ht=Object.create(null);function Nr(t){const e=ht[t];if(e)return e;const r=we[t];if(!r)throw new Error(`[positionBit] Unsupported aPosition format: ${t}`);const o=t==="float32x3",s=o?"aPosition":"aPosition.xyz",a=o?"input.aPosition":"input.aPosition.xyz",n=r==="1.0"?"":` * ${r}`,i={name:`position:${t}`,attributes:{aPosition:t},gpu:{vertex:{input:`position = vec4<f32>(${a}${n}, 1.0);`}},gl:{vertex:{input:`position = vec4(${s}${n}, 1.0);`}}};return ht[t]=i,i}const Mr={name:"tangentNormalMapping",attributes:{aTangent:"float32x4"},interStage:{vTangent:"vec3<f32>",vBitangent:"vec3<f32>"},gpu:{vertex:{input:`
    tangent = input.aTangent.xyz;
  `,end:`
  // Transform tangent to world space and compute bitangent.
  // Reads the worldNormal local (not output.vNormal) so this bit doesn't
  // depend on the template having published varyings yet.
  // The local carries the direction, which skinning has already transformed.
  // Handedness is a per-vertex sign, so it is read straight off the attribute
  // and never goes through a matrix.
  let worldTangent = normalize(modelMatrix3 * tangent);
  let worldBitangent = cross(worldNormal, worldTangent) * input.aTangent.w;
  output.vTangent = worldTangent;
  output.vBitangent = worldBitangent;
`},fragment:{material:`
  // Normal mapping with vertex tangents
  let normalMapSample = sampleNormal(input.vUV).rgb;
  var tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal = vec3<f32>(tangentNormal.xy * material.normalScale, tangentNormal.z);
  let tbnMatrix = mat3x3<f32>(
    normalize(input.vTangent),
    normalize(input.vBitangent),
    normal
  );
  normal = normalize(tbnMatrix * tangentNormal);
`}},gl:{vertex:{input:`
    tangent = aTangent.xyz;
  `,end:`
  // Transform tangent to world space and compute bitangent.
  // Reads the worldNormal local (not vNormal) so this bit doesn't depend on
  // the template having published varyings yet.
  vec3 worldTangent = normalize(modelMatrix3 * tangent);
  vec3 worldBitangent = cross(worldNormal, worldTangent) * aTangent.w;
  vTangent = worldTangent;
  vBitangent = worldBitangent;
`},fragment:{material:`
  // Normal mapping with vertex tangents
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = mat3(
    normalize(vTangent),
    normalize(vBitangent),
    normal
  );
  normal = normalize(tbnMatrix * tangentNormal);
`}}},mt=Object.create(null);function Tr(t){const e=mt[t];if(e)return e;const r={name:`uvs:${t}`,overrideDefs:{HAS_UVS:{type:"u32",required:!0}},attributes:{aUV:t},gpu:{vertex:{input:"uv = vec2<f32>(input.aUV);"}},gl:{vertex:{input:"uv = vec2(aUV);"}}};return mt[t]=r,r}const Ir={name:"vertexColor",attributes:{aColor:"float32x4"},interStage:{vColor:"vec4<f32>"},gpu:{vertex:{end:"output.vColor = input.aColor;"},fragment:{material:`albedo *= input.vColor.rgb;
  alpha *= input.vColor.a;`}},gl:{vertex:{end:"vColor = aColor;"},fragment:{material:`albedo *= vColor.rgb;
  alpha *= vColor.a;`}}},Ar={preCompile(t){const e=t.data.structs;e?.Material&&(e.Material=Ut(t.bits))}},Se=new Ht,Ce=new Yt,Be=new X,Ve=new jt,De=.001,Ne=.15,Me=3,Te=50,Ie=.15,E=256,Ae="Shadow: shadow.bounds and shadow.cascades are both set — cascades take precedence and the bounds box is ignored. Use bounds for a fixed region or cascades for a camera-following shadow, not both.",Fe="Shadow auto-fit box spans a large scene, so shadows may look soft. For a roaming or large scene, enable cascades: light.shadow.cascades = 3.",Ge=`Too many shadow-casting lights for the shadow budget (4 lights × 4 cascades = ${H} slots). Extra casters render without shadows.`;var Fr=class extends Xt{_renderTarget=null;_layerCount=0;_quality="medium";_frameCount=0;_shadowCount=0;_sceneCasterBounds=new X;_sceneBoundsFrame=-1;_destroyed=!1;targetVersion=0;_view3d=null;shadowMapHandle;constructor(t){super(t),this.shadowMapHandle=t.shadowMapHandle}get renderTarget(){return this._renderTarget===null&&(this._renderTarget=Ot(this._quality,Math.max(this._layerCount,1))),this._renderTarget}_growAtlas(t){t<=this._layerCount||(this._layerCount=Math.min(t,H),this._releaseTarget())}set quality(t){t!==this._quality&&(this._quality=t,this._releaseTarget())}get quality(){return this._quality}get shadowCount(){return this._shadowCount}beginFrame(t){this._view3d=t,this.quality=t.shadowQuality,this._frameCount++,this._shadowCount=0}unload(){this._releaseTarget()}_releaseTarget(){const t=this._renderTarget;t&&(this._renderTarget=null,this.targetVersion++,this._view3d&&this._bindShadowSource(this._view3d,Et.source),t.destroy())}_bindShadowSource(t,e){const r=t._gpuData[this.pipe.renderer.uid];if(!r)return;const{globalBindGroup:o}=r,s=this.pipe.globalSlots.shadowMap;o.getResource(s)!==e&&(o.setResource(e,s),t._invalidateBundleCaches())}setup(t){t.produce(this.shadowMapHandle)}condition(t){const e=t.view3d._meshBatches,r=t.lights;let o=!1;for(let s=0;s<r.length;s++)if(r[s].castShadow){o=!0;break}if(o){for(let s=0;s<e.length;s++)if((e[s].drawLists[this.bit]?.view.count??0)>0)return!0}return!1}getShadowGPUData(t){return t._gpuShadowData??={inverseLightMatrix:new I,lightProjectionMatrix:new I,targetVersion:this.targetVersion}}_cascadeCullFrustum(t){return Se.setFromProjectionMatrix(t.vp)}updateLightShadowData(t,e){if(!t.castShadow)return;const r=e.camera,o=this.getShadowGPUData(t),{inverseLightMatrix:s,lightProjectionMatrix:a}=o,n=o.targetVersion!==this.targetVersion,i=$t[this._quality],u=t._shadowRefreshRequested,c=t.shadow.update,l=t.shadow.bias??De;if(t.type==="spot"||t.shadow.cascades===void 0){const d=this._cascadeSlot(t,0,e),p=tt(et(c,0),this._frameCount,u);if(!p)if(t.type==="spot")qt(t,s,a,d.vp,this._applyZRangeFix),this._commitCascadeMatrix(d),d.normalBias=t.shadow.normalBias??Ne;else{const x=t.shadow.bounds??this._resolveAutoShadowBounds(t,e,i);x!==void 0&&!x.isEmpty()&&(s.getInverse(t.worldTransform),le(x,s,a,d.vp,i,this._applyZRangeFix),this._commitCascadeMatrix(d),d.normalBias=this._resolveNormalBias(t,a,i))}d.bias=l,d.mapSize=i,d.cascadeCount=0,d.splits=null,d.needsRender=n||!p;return}t.shadow.bounds!==void 0&&U("pixi3d-shadow-bounds-cascades",Ae),s.getInverse(t.worldTransform);const f=rt(t),g=t.shadow.lambda,h=Math.min(t.shadow.maxDistance??Te,r.far),m=this._cascadeSlot(t,0,e),b=m.splits??=[];se(r.near,h,f,g,b),ae(r,s);for(let d=0;d<f;d++){const p=d===0?m:this._cascadeSlot(t,d,e),x=tt(et(c,d),this._frameCount,u);if(!x){const _=d===0?r.near:b[d-1];ie(r,s,_,b[d],a,p.vp,i,this._applyZRangeFix),this._commitCascadeMatrix(p),p.normalBias=this._resolveNormalBias(t,a,i)}p.bias=l,p.mapSize=i,p.cascadeCount=d===0&&f>1?f:0,d>0&&(p.splits=null),p.needsRender=n||!x}}_completeShadowUpdate(t){t._gpuShadowData&&(t._gpuShadowData.targetVersion=this.targetVersion),t._shadowRefreshRequested=!1}_resolveAutoShadowBounds(t,e,r){const o=this._countSceneCasters(e),s=t._autoShadowBounds;if(o>E&&t._autoShadowBoundsFrozen)return s??void 0;const a=this._ensureSceneCasterBounds(e);if(a.isEmpty())return s??void 0;const n=s??(t._autoShadowBounds=new X);return n.copyFrom(a),o<=E?t._autoShadowBoundsFrozen=!1:s!==null&&(t._autoShadowBoundsFrozen=!0,U("pixi3d-shadow-autofit-cap",`Shadow auto-fit: ${o} shadow casters is over the auto-measure cap (${E}), so the shadow box was fitted once and frozen. If casters move or spawn outside it, set shadow.bounds, enable shadow.cascades, or call light.fitShadowBounds() after changes.`)),this._warnIfShadowBoxLarge(n,r),n}_countSceneCasters(t){let e=0;const r=t._meshBatches;for(let o=0;o<r.length;o++){const s=r[o];if(!s.renderData.worldVisible)continue;const a=s.drawLists[this.bit];a&&(e+=a.view.count)}return e}_ensureSceneCasterBounds(t){if(this._sceneBoundsFrame===this._frameCount)return this._sceneCasterBounds;this._sceneBoundsFrame=this._frameCount;const e=this._sceneCasterBounds.makeEmpty(),r=t._meshBatches;for(let o=0;o<r.length;o++){const s=r[o];if(!s.renderData.worldVisible)continue;const a=s.drawLists[this.bit];if(!a||a.view.count===0)continue;const n=o===0?null:s.renderData.worldTransform,i=a.view.items,u=a.view.indices;for(let c=0;c<a.view.count;c++){const l=i[u[c]];if(!l)continue;const f=l.boundingSphere;if(f.radius<0)continue;const g=n?f.applyMatrix4(n,Ce):f;e.union(g.getBounds(Be))}}return e}_warnIfShadowBoxLarge(t,e){if(t.isEmpty())return;const r=t.getSize(Ve);Math.max(r.x,r.y,r.z)/e>Ie&&U("pixi3d-shadow-autofit-large",Fe)}_resolveNormalBias(t,e,r){if(t.shadow.normalBias!==void 0)return t.shadow.normalBias;const o=2/(e.elements[0]*r);return Me*o}prepareShadow(t,e){const r=this._claimShadowSlots(t);if(r===0)return;this._growAtlas(this._shadowCount+r),this.updateLightShadowData(t,e);const o=this.getShadowGPUData(t).cascades;for(let s=0;s<r;s++)this._uploadSlot(o[s],this._shadowCount+s,e);this._shadowCount+=r}_claimShadowSlots(t){const e=t.castShadow&&t.type!=="point",r=rt(t);return e&&this._shadowCount+r<=H?(t._shadowDataIndex=this._shadowCount,r):(e&&U("pixi3d-shadow-budget",Ge),t._shadowDataIndex=-1,0)}destroy(){this._destroyed||(this._destroyed=!0,this._view3d=null,this._releaseTarget(),super.destroy())}};const Le=1024,ze=2048;var Re=class{uid=Wt("geometryAtlas");attributeKey;vertexStride;_vertexBuffer;_indexBuffer;_retiredBuffers=[];_retiredGeometries=[];_vertexCount=0;_indexCount=0;_deadVertexCount=0;_deadIndexCount=0;_liveAllocations=[];_vertexDirtyMin=1/0;_vertexDirtyMax=-1/0;_indexDirtyMin=1/0;_indexDirtyMax=-1/0;_bufferVersion=0;geometry;_attributeInfo;rebaseIndices;constructor(t){const{referenceGeometry:e,initialVertexCapacity:r=Le,initialIndexCapacity:o=ze,rebaseIndices:s=!1}=t;this.rebaseIndices=s,this.attributeKey=e.attributeKey;const a=e.attributes,n=Object.keys(a).sort();if(!n.some(u=>!a[u].instance))throw new Error("GeometryAtlas: reference geometry has no vertex attributes");let i=0;this._attributeInfo=[];for(const u of n){const c=a[u];if(c.instance)continue;const l=ot(c.format).stride;i=i+3&-4;const f=i;i+=l,this._attributeInfo.push({name:u,attr:{format:c.format,offset:f}})}this.vertexStride=i+3&-4,this._vertexBuffer=new R({data:new Uint8Array(r*this.vertexStride),usage:M.VERTEX|M.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._indexBuffer=new R({data:new Uint32Array(o),usage:M.INDEX|M.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this.geometry=this._buildMergedGeometry()}get vertexCount(){return this._vertexCount}add(t){const e=t._geometryAtlasAllocation;if(e&&e.atlas===this)return e;for(const p in t.attributes)if(t.attributes[p].instance)throw new Error(`GeometryAtlas: Cannot add geometry with instance attribute "${p}". The Atlas is for merging vertex data only; instance data would be lost.`);if(t.attributeKey!==this.attributeKey)throw new Error(`GeometryAtlas: attribute structure mismatch. Expected "${this.attributeKey}", got "${t.attributeKey}"`);const r=t.vertexCount,o=t.indexBuffer.data,s=o.length,a=this._vertexBuffer.data.byteLength/this.vertexStride,n=this._indexBuffer.data.length,i=this._vertexCount+r>a,u=this._indexCount+s>n;if(i||u){const p=this._vertexCount-this._deadVertexCount,x=this._indexCount-this._deadIndexCount,_=p+r<=a,v=x+s<=n;_&&v?this.defragment():((this._deadVertexCount>0||this._deadIndexCount>0)&&this.defragment(),this._ensureVertexCapacity(this._vertexCount+r),this._ensureIndexCapacity(this._indexCount+s))}const c=this._vertexCount,l=this._indexCount;this._vertexCount+=r,this._indexCount+=s;const f=this._vertexBuffer.data,g=this._indexBuffer.data,h=this.vertexStride,m=this._attributeInfo[0].name,b=t.attributes[m];if(this._isGeometryInterleaved(t)&&b.stride===h){const p=b.buffer.data,x=c*h;f.set(p,x),this._markVertexDirty(x,x+p.byteLength)}else{for(let _=0;_<r;_++){const v=(c+_)*h;for(const S of this._attributeInfo){const y=t.attributes[S.name],T=ot(S.attr.format).stride,A=y.stride??T,V=y.offset??0,B=y.buffer.data,D=_*A+V,N=v+(S.attr.offset??0),w=new Uint8Array(B.buffer,B.byteOffset+D,T);f.set(w,N)}}const p=c*h,x=(c+r)*h;this._markVertexDirty(p,x)}if(this.rebaseIndices)for(let p=0;p<s;p++)g[l+p]=o[p]+c;else g.set(o,l);this._markIndexDirty(l,l+s);const d={atlas:this,baseVertex:c,firstIndex:l,indexCount:s,vertexCount:r};return t._geometryAtlasAllocation=d,this._liveAllocations.push(d),d}remove(t){const e=t._geometryAtlasAllocation;if(!e)return;this._deadVertexCount+=e.vertexCount,this._deadIndexCount+=e.indexCount;const r=this._liveAllocations.indexOf(e);r!==-1&&this._liveAllocations.splice(r,1),t._geometryAtlasAllocation=null}update(){if(this._vertexDirtyMin<this._vertexDirtyMax){const t=this._vertexDirtyMax-this._vertexDirtyMin;this._vertexBuffer.update(t,this._vertexDirtyMin),this._vertexDirtyMin=1/0,this._vertexDirtyMax=-1/0}if(this._indexDirtyMin<this._indexDirtyMax){const t=this._indexDirtyMin*4,e=(this._indexDirtyMax-this._indexDirtyMin)*4;this._indexBuffer.update(e,t),this._indexDirtyMin=1/0,this._indexDirtyMax=-1/0}}_isGeometryInterleaved(t){const e=t.attributes[this._attributeInfo[0].name].buffer;for(let r=1;r<this._attributeInfo.length;r++)if(t.attributes[this._attributeInfo[r].name].buffer!==e)return!1;return!0}_buildMergedGeometry(){const t=new $;for(const{name:e,attr:r}of this._attributeInfo)t.addAttribute(e,{buffer:this._vertexBuffer,format:r.format,stride:this.vertexStride,offset:r.offset});return t.addIndex(this._indexBuffer),t}_markVertexDirty(t,e){t<this._vertexDirtyMin&&(this._vertexDirtyMin=t),e>this._vertexDirtyMax&&(this._vertexDirtyMax=e)}_markIndexDirty(t,e){t<this._indexDirtyMin&&(this._indexDirtyMin=t),e>this._indexDirtyMax&&(this._indexDirtyMax=e)}_retireCurrentGeometry(){this.geometry&&(this.geometry.indexBuffer=null,this._retiredGeometries.push(this.geometry))}_ensureVertexCapacity(t){const e=this._vertexBuffer.data;let r=e.byteLength/this.vertexStride;if(t<=r)return;for(;r<t;)r*=2;const o=new Uint8Array(r*this.vertexStride);o.set(e),this._retiredBuffers.push(this._vertexBuffer),this._vertexBuffer=new R({data:o,usage:M.VERTEX|M.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._markVertexDirty(0,this._vertexCount*this.vertexStride),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}_ensureIndexCapacity(t){const e=this._indexBuffer.data;let r=e.length;if(t<=r)return;for(;r<t;)r*=2;const o=new Uint32Array(r);o.set(e),this._retiredBuffers.push(this._indexBuffer),this._indexBuffer=new R({data:o,usage:M.INDEX|M.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this._markIndexDirty(0,this._indexCount),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}destroy(){if(this._vertexBuffer!==null){this.geometry&&(this.geometry.indexBuffer=null),this.geometry?.destroy(!1),this.geometry=null,this._vertexBuffer.destroy(),this._indexBuffer.destroy();for(let t=0;t<this._retiredGeometries.length;t++)this._retiredGeometries[t].destroy(!1);this._retiredGeometries.length=0;for(let t=0;t<this._retiredBuffers.length;t++)this._retiredBuffers[t].destroy();this._retiredBuffers.length=0,this._vertexBuffer=null,this._indexBuffer=null,this._liveAllocations.length=0}}defragment(){if(this._deadVertexCount===0&&this._deadIndexCount===0)return;const t=this.vertexStride,e=this._vertexBuffer.data,r=this._indexBuffer.data;let o=0,s=0;const a=this.rebaseIndices;for(const n of this._liveAllocations){const i=n.baseVertex;if(i!==o){const u=i*t,c=o*t,l=n.vertexCount*t;e.copyWithin(c,u,u+l),n.baseVertex=o}if(o+=n.vertexCount,n.firstIndex!==s&&(r.copyWithin(s,n.firstIndex,n.firstIndex+n.indexCount),n.firstIndex=s),a&&i!==n.baseVertex){const u=n.baseVertex-i;for(let c=0;c<n.indexCount;c++)r[n.firstIndex+c]+=u}s+=n.indexCount}this._markVertexDirty(0,o*t),this._markIndexDirty(0,s),this._vertexCount=o,this._indexCount=s,this._deadVertexCount=0,this._deadIndexCount=0,this._bufferVersion++}};const pt=Object.create(null);var Gr=class Tt{_atlases=Object.create(null);_rebaseIndices;_bufferVersion=0;constructor(e){this._rebaseIndices=e.rebaseIndices}static from(e){const r=e.rebaseIndices?"rebased":"geometryLocal";let o=pt[r];return o||(o=new Tt(e),pt[r]=o,Zt.register(o)),o}get bufferVersion(){return this._bufferVersion}allocate(e){const r=e.attributeKey;let o=this._atlases[r];const s=e._geometryAtlasAllocation;if(s&&s.atlas===o)return s;o||(o=new Re({referenceGeometry:e,rebaseIndices:this._rebaseIndices}),this._atlases[r]=o);const a=o._bufferVersion,n=o.add(e);return o._bufferVersion!==a&&this._bufferVersion++,n}update(){for(const e in this._atlases)this._atlases[e].update()}clear(){for(const e in this._atlases)this._atlases[e].destroy();this._atlases=Object.create(null)}};const Pe=new I,ke=new I,Ue=new I,Xe=new q,Oe=new q;function Ee(t,e,r){const{camera:o,size:s,worldTransform:a}=t,{width:n,height:i}=s,{x:u,y:c}=t.anchor,{x:l,y:f,width:g,height:h}=o.viewport,m=(l-u)*n,b=(f-c)*i,d=g*n,p=h*i,x=a,{a:_,b:v,c:S,d:y}=x,T=x.tx-r.x,A=x.ty-r.y;let V=1/0,B=1/0,D=-1/0,N=-1/0,w=_*m+S*b+T,C=v*m+y*b+A;w<V&&(V=w),w>D&&(D=w),C<B&&(B=C),C>N&&(N=C);const P=m+d;w=_*P+S*b+T,C=v*P+y*b+A,w<V&&(V=w),w>D&&(D=w),C<B&&(B=C),C>N&&(N=C);const k=b+p;w=_*P+S*k+T,C=v*P+y*k+A,w<V&&(V=w),w>D&&(D=w),C<B&&(B=C),C>N&&(N=C),w=_*m+S*k+T,C=v*m+y*k+A,w<V&&(V=w),w>D&&(D=w),C<B&&(B=C),C>N&&(N=C);const G=Xe;G.x=V,G.y=B,G.width=D-V,G.height=N-B;const F=Oe.copyFrom(G).fit(e);if(F.width<=0||F.height<=0)return;const Ft=d/p;o.view.getInverse(o.worldTransform),o.computeProjection(Ft,o.projection);const Y=Pe;Y.set(d/2,0,0,m+d/2,0,-p/2,0,b+p/2,0,0,1,0,0,0,0,1);const j=ke;j.set(_,S,0,T,v,y,0,A,0,0,1,0,0,0,0,1);const Gt=F.x,Lt=F.y,W=F.width,Z=F.height,K=Ue;K.set(2/W,0,0,-(2*Gt)/W-1,0,-2/Z,0,2*Lt/Z+1,0,0,1,0,0,0,0,1);const zt=K.multiply(j).multiply(Y);return o.projection.premultiply(zt),o.viewProjection.multiplyMatrices(o.projection,o.view),o.frustum.setFromProjectionMatrix(o.viewProjection),F}function Lr(t){const e=t.elements;e[1]=-e[1],e[5]=-e[5],e[9]=-e[9],e[13]=-e[13]}function He(t){const{camera:e}=t;if(e.view3d!==t)throw new Error("Camera3D is no longer in the View3D scene graph. Don't remove an assigned camera from its parent without reassigning view3d.camera.");if(!e.visible||e.worldVisible===0)throw new Error("Camera3D is hidden (visible=false or an ancestor is hidden). Cannot render with a hidden camera. See https://github.com/pixijs/pixi-3d/issues/95")}const $e=(()=>{const t=new Kt;return t.worldVisible=1,t})();function qe(t){const e=t._childrenToUpdate,r=t._updateTick++;for(const o in e){const s=Number(o),a=e[o],n=a.list,i=a.index;for(let u=0;u<i;u++){const c=n[u];c.view3d===t&&c._relativeSceneDepth===s&&It(c,c.parent??$e,r,!1,!1)}re(n,i),a.index=0}}function It(t,e,r,o,s){if(r===t._updateTick)return;t._updateTick=r,t.didChange=!1,o||=t._worldTransformDirty,s||=t._worldVisibleDirty,s&&(t.worldVisible=e.worldVisible*t._visible),t.worldVisible&&o&&(t._localTransformDirty&&(t.updateLocalTransform(),t._localTransformDirty=!1),I.multiplyAffine(t.worldTransform.elements,0,e.worldTransform.elements,0,t.localTransform.elements,0),t._worldTransformId++,t._storeWorldTransform()),t._worldVisibleDirty=!1,t._worldTransformDirty=t.worldVisible?!1:o;const a=t.children,n=a.length;for(let i=0;i<n;i++)It(a[i],t,r,o,s)}const z=new q;function zr(t,e){qe(t),He(t);const r=e.renderer;z.x=0,z.y=0,z.width=r.renderTarget.renderTarget.width,z.height=r.renderTarget.renderTarget.height;const o=Ee(t,z,r.globalUniforms.globalUniformData.offset)??null;if(!o)return{logicalViewport:null};t._bonePit.clear();const s=t._skinnedMeshes.items;for(let c=0;c<t._skinnedMeshes.items.length;c++){const l=s[c],f=l.skeleton;f.updateWorld();const g=t._bonePit.add(f);l._lastBonePitIndex!==g&&(l._lastBonePitIndex=g,l._storeDirty=!0)}t._bonePit.update(),e._morphStoreBuffer.sync(t._morphedMeshes.items);const a=e.geometryDataStoreBuffer,n=t.meshes.items;for(let c=0;c<n.length;c++){const l=n[c],f=l.material,g=l.renderPassMask;if(g!==l._lastRenderPass&&t._sceneBatch.setItemActive(t._meshSlots.getIndex(l),g),l.worldVisible!==l._lastWorldVisible&&(l._lastWorldVisible=l.worldVisible,l._storeDirty=!0,t._sceneBatch._visibilityDirtyId++),l._lastDescriptorDirtyId!==f._descriptorDirtyId&&(l._lastDescriptorDirtyId=f._descriptorDirtyId,l._batchDirty=!0),l._lastRenderPass===0)continue;const h=l.geometry;if(l._batchDirty||h._geometryAtlasAllocation===null&&!h.dynamic){l._batchDirty=!1,e.renderer.material3d.ensureMaterial(l,t),h.dynamic||(h._geometryAtlasAllocation=e.atlasPool.allocate(h)),a.set(h);let m=l.renderPassMask&t._dirtyHookBits;for(;m;){const b=m&-m;t.passByBit[b].onRenderableDirty(l,t._sceneBatch),m^=b}}l._storeDirty&&(l._storeDirty=!1,t._sceneBatch.storeBuffer.set(l))}t._sceneBatch.storeBuffer.update();for(let c=1;c<t._meshBatches.length;c++){const l=t._meshBatches[c];l.writeBatchWorldMatrix(l.renderData.worldTransform);const f=l._dirtyIndices,g=l._dirtyCount;for(let h=0;h<g;h++){const m=l.items[f[h]];m._batchDirty=!1;const b=m.material;e.renderer.material3d.ensureMaterial(m,t),m.geometry.dynamic||(m.geometry._geometryAtlasAllocation=e.atlasPool.allocate(m.geometry)),a.set(m.geometry),l.storeBuffer.u32Data[m._storeIndex*24+17]=b._materialIndex,l.storeBuffer.u32Data[m._storeIndex*24+18]=m.geometry._geometryDataIndex,l.storeBuffer.markDirtyRange(m._storeIndex,m._storeIndex);let d=m._lastRenderPass&t._dirtyHookBits;for(;d;){const p=d&-d;t.passByBit[p].onRenderableDirty(m,l),d^=p}}l._dirtyCount=0,l.storeBuffer.update()}const i=e.atlasPool.bufferVersion;if(t._lastAtlasBufferVersion!==i){t._lastAtlasBufferVersion=i;const c=t._morphedMeshes.items;for(let l=0;l<c.length;l++)a.set(c[l].geometry)}for(let c=0;c<t._meshBatches.length;c++){const l=t._meshBatches[c],f=l.storeBuffer.bufferVersion;l._lastStoreBufferVersion!==f&&(l._lastStoreBufferVersion=f,l.invalidateDrawCaches())}const u=t._bonePit.bufferVersion;return t._lastBonePitBufferVersion!==u&&(t._lastBonePitBufferVersion=u,t._invalidateDrawCaches()),{logicalViewport:o}}const At={name:"iblSamplingFuncs",gpu:{header:`
const PI: f32 = 3.14159265359;

// Radical inverse using Van der Corput sequence (base 2)
fn radicalInverseVdC(bits_in: u32) -> f32 {
  var bits = bits_in;
  bits = (bits << 16u) | (bits >> 16u);
  bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
  bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
  bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
  bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
  return f32(bits) * 2.3283064365386963e-10; // / 0x100000000
}

// Hammersley low-discrepancy sequence
fn hammersley(i: u32, N: u32) -> vec2<f32> {
  return vec2<f32>(f32(i) / f32(N), radicalInverseVdC(i));
}

// GGX importance sampling - generates a half vector H based on roughness
fn importanceSampleGGX(Xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
  let a = roughness * roughness;

  let phi = 2.0 * PI * Xi.x;
  let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
  let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  // Spherical to cartesian (tangent space)
  let H = vec3<f32>(
    cos(phi) * sinTheta,
    sin(phi) * sinTheta,
    cosTheta
  );

  // Tangent space to world space
  var up: vec3<f32>;
  if abs(N.z) < 0.999 {
    up = vec3<f32>(0.0, 0.0, 1.0);
  } else {
    up = vec3<f32>(1.0, 0.0, 0.0);
  }

  let tangent = normalize(cross(up, N));
  let bitangent = cross(N, tangent);

  let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
  return normalize(sampleVec);
}
`},gl:{header:`
const float PI = 3.14159265359;

// Radical inverse using Van der Corput sequence (base 2)
float radicalInverseVdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10; // / 0x100000000
}

// Hammersley low-discrepancy sequence
vec2 hammersley(uint i, uint N) {
    return vec2(float(i) / float(N), radicalInverseVdC(i));
}

// GGX importance sampling
vec3 importanceSampleGGX(vec2 Xi, vec3 N, float roughness) {
    float a = roughness * roughness;

    float phi = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta * cosTheta);

    // Spherical to cartesian
    vec3 H = vec3(
        cos(phi) * sinTheta,
        sin(phi) * sinTheta,
        cosTheta
    );

    // Tangent space to world space
    vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);

    vec3 sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
}
`}},Ye={gl:{vertex:`#version 300 es
      precision highp float;
      {{header}}
      void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
          vUv = aPosition * 0.5 + 0.5;
      }
    `,fragment:`#version 300 es
      precision highp float;
      {{header}}

      // Geometry function (Smith GGX) for a single direction
      float geometrySchlickGGX(float NdotV, float roughness) {
          float a = roughness;
          float k = (a * a) / 2.0;
          return NdotV / (NdotV * (1.0 - k) + k);
      }

      // Combined geometry function for view and light directions
      float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
          float NdotV = max(dot(N, V), 0.0);
          float NdotL = max(dot(N, L), 0.0);
          float ggx1 = geometrySchlickGGX(NdotV, roughness);
          float ggx2 = geometrySchlickGGX(NdotL, roughness);
          return ggx1 * ggx2;
      }

      vec2 integrateBRDF(float NdotV, float roughness, uint sampleCount) {
          vec3 V = vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);
          vec3 N = vec3(0.0, 0.0, 1.0);

          float A = 0.0;
          float B = 0.0;

          for(uint i = 0u; i < sampleCount; i++) {
              vec2 Xi = hammersley(i, sampleCount);
              vec3 H = importanceSampleGGX(Xi, N, roughness);
              vec3 L = normalize(2.0 * dot(V, H) * H - V);

              float NdotL = max(L.z, 0.0);
              float NdotH = max(H.z, 0.0);
              float VdotH = max(dot(V, H), 0.0);

              if(NdotL > 0.0) {
                  float G = geometrySmith(N, V, L, roughness);
                  float G_Vis = (G * VdotH) / (NdotH * NdotV);
                  float Fc = pow(1.0 - VdotH, 5.0);

                  A += (1.0 - Fc) * G_Vis;
                  B += Fc * G_Vis;
              }
          }

          return vec2(A / float(sampleCount), B / float(sampleCount));
      }

      out vec4 fragColor;

      void main() {
          float NdotV = vUv.x;
          float roughness = vUv.y;
          float clampedNdotV = max(NdotV, 0.001);
          float clampedRoughness = max(roughness, 0.01);
          
          vec2 result = integrateBRDF(clampedNdotV, clampedRoughness, uint(sampleCount));
          fragColor = vec4(result.x, result.y, 0.0, 1.0);
      }
    `}},je={gpu:`
{{header}}

// Geometry function (Smith GGX) for a single direction
fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
   let a = roughness;
   let k = (a * a) / 2.0; // For IBL, use k = a²/2 (different from direct lighting)
   
   return NdotV / (NdotV * (1.0 - k) + k);
}

// Combined geometry function for view and light directions
fn geometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
   let NdotV = max(dot(N, V), 0.0);
   let NdotL = max(dot(N, L), 0.0);
   let ggx1 = geometrySchlickGGX(NdotV, roughness);
   let ggx2 = geometrySchlickGGX(NdotL, roughness);
   
   return ggx1 * ggx2;
}

// Integrate BRDF for given NdotV and roughness
fn integrateBRDF(NdotV: f32, roughness: f32, sampleCount: u32) -> vec2<f32> {
   let V = vec3<f32>(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);
   let N = vec3<f32>(0.0, 0.0, 1.0);
   
   var A = 0.0; // Scale
   var B = 0.0; // Bias
   
   for (var i = 0u; i < sampleCount; i++) {
       let Xi = hammersley(i, sampleCount);
       let H = importanceSampleGGX(Xi, N, roughness);
       let L = normalize(2.0 * dot(V, H) * H - V);
       
       let NdotL = max(L.z, 0.0);
       let NdotH = max(H.z, 0.0);
       let VdotH = max(dot(V, H), 0.0);
       
       if NdotL > 0.0 {
           let G = geometrySmith(N, V, L, roughness);
           let G_Vis = (G * VdotH) / (NdotH * NdotV);
           let Fc = pow(1.0 - VdotH, 5.0);
           
           A += (1.0 - Fc) * G_Vis;
           B += Fc * G_Vis;
       }
   }
   
   A = A / f32(sampleCount);
   B = B / f32(sampleCount);
   
   return vec2<f32>(A, B);
}

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
  // Convert from [-1, 1] to [0, 1] for UV.
  // Negate Y because WebGPU maps clip Y=+1 to texture row 0 (top),
  // but UV v=0 also samples row 0 — without the negate, the LUT
  // would be Y-flipped (roughness 0.9 would read as 0.1).
  output.vUv = vec2<f32>(input.aPosition.x * 0.5 + 0.5, -input.aPosition.y * 0.5 + 0.5);
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
   // X = NdotV, Y = roughness
   let NdotV = input.vUv.x;
   let roughness = input.vUv.y;
   
   // Clamp NdotV to avoid division by zero
   let clampedNdotV = max(NdotV, 0.001);
   
   // Clamp roughness to avoid perfectly smooth (causes issues)
   let clampedRoughness = max(roughness, 0.01);
   
   let result = integrateBRDF(clampedNdotV, clampedRoughness, u32(local.sampleCount));
   
   return vec4<f32>(result.x, result.y, 0.0, 1.0);
}
`},We={bindGroups:["local"],gpu:je.gpu,gl:Ye.gl};function Rr(t){const{renderer:e}=t,r=t.size??256,o=t.sampleCount??1024,s={name:"brdfLut",attributes:{aPosition:"float32x2"},interStage:{vUv:"vec2<f32>"},bindings:{local:{sampleCount:"f32"}}},a=new xt({0:new _t({sampleCount:{value:o,type:"f32"}})}),n=e.material3d.compileIsolatedShader([At,s],We,{0:a}),i=oe.create({width:r,height:r,format:"rgba16float"}).source,u=new gt({source:i}),c=new $({attributes:{aPosition:new Float32Array([-1,-1,1,-1,-1,1,1,1])},topology:"triangle-strip"}),l=e.renderTarget.renderTarget?e.renderTarget.getBindState():null;return e.renderTarget.bind({target:i,clear:!0}),e.encoder.draw({geometry:c,shader:n,state:vt.default2d}),l&&e.renderTarget.bind(l),u}function Pr(t){const{renderer:e,sourceTexture:r}=t,o=t.size??256,s=t.sampleCount??1024,a=t.label??"ibl-specular",n=t.format??"rgb10a2unorm",i=t.mipLevelCount??Math.max(1,Math.floor(Math.log2(o))-3),u={bindGroups:["local"],gpu:`
     {{header}}

     // Convert cube face index and UV to 3D direction
     fn getDirection(face: i32, pos: vec2<f32>) -> vec3<f32> {
        let u = pos.x;
        let v = -pos.y;
        
        var dir = vec3<f32>(0.0);
        
        switch face {
            case 0: { dir = vec3<f32>(1.0, -v, -u); }   // +X
            case 1: { dir = vec3<f32>(-1.0, -v, u); }   // -X
            case 2: { dir = vec3<f32>(u, 1.0, v); }     // +Y
            case 3: { dir = vec3<f32>(u, -1.0, -v); }   // -Y
            case 4: { dir = vec3<f32>(u, -v, 1.0); }    // +Z
            default: { dir = vec3<f32>(-u, -v, -1.0); } // -Z
        }

        return normalize(dir);
     }

     @vertex
     fn mainVertex(input: VertexInput) -> VertexOutput {
       var output: VertexOutput;
       output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
       output.vDir = getDirection(i32(local.layer + 0.5), input.aPosition);
       return output;
     }

     @fragment
     fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
        let N = normalize(input.vDir);
        let R = N;  // Reflection vector equals normal for prefiltering
        let V = R;  // View direction equals reflection for prefiltering
        
        // Convert mip level to roughness (0 = smooth, 1 = rough)
        let maxMipLevel = f32(local.mipLevelCount) - 1.0;
        let roughness = local.mipLevel / maxMipLevel;
        
        // For mip 0 (roughness = 0), just sample the environment directly.
        // Gamma-2.2 sRGB decode so the stored cube holds linear radiance.
        if roughness < 0.01 {
            let s = textureSampleLevel(uSourceTexture, uSampler, N, 0.0).rgb;
            return vec4<f32>(pow(s, vec3<f32>(2.2)), 1.0);
        }
        
        var prefilteredColor = vec3<f32>(0.0);
        var totalWeight = 0.0;
        
        let sampleCount = u32(local.sampleCount);
        
        for (var i = 0u; i < sampleCount; i++) {
            let Xi = hammersley(i, sampleCount);
            let H = importanceSampleGGX(Xi, N, roughness);
            let L = normalize(2.0 * dot(V, H) * H - V);
            
            let NdotL = max(dot(N, L), 0.0);
            
            // Sample with mip bias to reduce aliasing at high roughness
            // For rough surfaces, sample from blurrier mips of source
            let mipBias = roughness * 4.0;
            // Gamma-2.2 sRGB decode so the GGX average runs in linear light.
            let encoded = textureSampleLevel(uSourceTexture, uSampler, L, mipBias).rgb;
            let sampleColor = pow(encoded, vec3<f32>(2.2));
            
            // Use step to avoid branching - step(0.0, NdotL) returns 1 if NdotL > 0, else 0
            let weight = NdotL * step(0.0001, NdotL);
            prefilteredColor += sampleColor * weight;
            totalWeight += weight;
        }
        
        prefilteredColor = prefilteredColor / totalWeight;
        
        return vec4<f32>(prefilteredColor, 1.0);
     }
  `,gl:{vertex:`#version 300 es
        precision highp float;
        {{header}}

        // Convert cube face index and UV to 3D direction
        // WebGL framebuffer row 0 is at the bottom (clip Y=-1), so v = pos.y
        // (unlike WebGPU where row 0 is at the top, needing v = -pos.y).
        vec3 getDirection(int face, vec2 pos) {
            float u = pos.x;
            float v = pos.y;
            
            vec3 dir = vec3(0.0);
            
            switch(face) {
                case 0: dir = vec3(1.0, -v, -u); break;   // +X
                case 1: dir = vec3(-1.0, -v, u); break;   // -X
                case 2: dir = vec3(u, 1.0, v); break;     // +Y
                case 3: dir = vec3(u, -1.0, -v); break;   // -Y
                case 4: dir = vec3(u, -v, 1.0); break;    // +Z
                default: dir = vec3(-u, -v, -1.0); break; // -Z
            }

            return normalize(dir);
        }

        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vDir = getDirection(int(layer + 0.5), aPosition);
        }
      `,fragment:`#version 300 es
        precision highp float;
        {{header}}

        out vec4 fragColor;

        void main() {
            vec3 N = normalize(vDir);
            vec3 R = N;
            vec3 V = R;
            
            float maxMipLevel = mipLevelCount - 1.0;
            float roughness = mipLevel / maxMipLevel;
            
            if (roughness < 0.01) {
                // Gamma-2.2 sRGB decode so the stored cube holds linear radiance.
                vec3 s = textureLod(uSourceTexture, N, 0.0).rgb;
                fragColor = vec4(pow(s, vec3(2.2)), 1.0);
                return;
            }
            
            vec3 prefilteredColor = vec3(0.0);
            float totalWeight = 0.0;
            
            uint sampleCountUint = uint(sampleCount);
            
            for (uint i = 0u; i < sampleCountUint; i++) {
                vec2 Xi = hammersley(i, sampleCountUint);
                vec3 H = importanceSampleGGX(Xi, N, roughness);
                vec3 L = normalize(2.0 * dot(V, H) * H - V);
                
                float NdotL = max(dot(N, L), 0.0);
                float mipBias = roughness * 4.0;

                // Gamma-2.2 sRGB decode so the GGX average runs in linear light.
                vec3 encoded = textureLod(uSourceTexture, L, mipBias).rgb;
                vec3 sampleColor = pow(encoded, vec3(2.2));
                
                float weight = NdotL * step(0.0001, NdotL);
                prefilteredColor += sampleColor * weight;
                totalWeight += weight;
            }
            
            prefilteredColor = prefilteredColor / totalWeight;
            fragColor = vec4(prefilteredColor, 1.0);
        }
      `}},c={name:"iblPrefilter",attributes:{aPosition:"float32x2"},interStage:{vDir:"vec3<f32>"},bindings:{local:{uSourceTexture:"texture_cube<f32>",uSampler:"sampler",layer:"f32",mipLevel:"f32",mipLevelCount:"f32",sampleCount:"f32"}}},l=new Qt({label:a,width:o,height:o,dimensions:"2d",viewDimension:"cube",arrayLayerCount:6,mipLevelCount:i,format:n}),f=new _t({layer:{value:0,type:"f32"},mipLevel:{value:0,type:"f32"},mipLevelCount:{value:i,type:"f32"},sampleCount:{value:s,type:"f32"}}),g=new xt({0:f,1:r.source,2:r.source.style}),h=e.material3d.compileIsolatedShader([At,c],u,{0:g}),m=new $({attributes:{aPosition:new Float32Array([-1,-1,1,-1,-1,1,1,1])},topology:"triangle-strip"}),b=new Jt({colorTextures:[l]}),d=h.resources.local,p=e.renderTarget.renderTarget?e.renderTarget.getBindState():null;for(let x=0;x<6;x++)for(let _=0;_<i;_++){d.uniforms.layer=x,d.uniforms.mipLevel=_;const v="uniformBatch"in e.renderPipes?e.renderPipes.uniformBatch.getUboResource(d):d;g.setResource(v,0),e.renderTarget.bind({target:b,clear:!0,mipLevel:_,layer:x}),e.encoder.draw({geometry:m,shader:h,state:vt.default2d})}return p&&e.renderTarget.bind(p),new te({source:l})}function kr(t){return(t.cache??(t.sort==="key"?"auto":"never"))==="auto"}function Ur(t,e,r){const o=r.x,s=r.y,a=r.z,n=t.items,i=t.renderableIndices,u=t.count;for(let c=0;c<u;c++){const l=n[i[c]],f=l._storeIndex*24,g=e[f+12]-o,h=e[f+13]-s,m=e[f+14]-a;l._sortKey=-(g*g+h*h+m*m)}t.sortForced(c=>c._sortKey)}function Xr(t,e){const r=e.x,o=e.y,s=e.z,a=t.items,n=t.renderableIndices,i=t.count;for(let u=0;u<i;u++){const c=a[n[u]],l=c.worldTransform.elements,f=l[12]-r,g=l[13]-o,h=l[14]-s;c._sortKey=-(f*f+g*g+h*h)}t.sortForced(u=>u._sortKey)}function Or(t,e,r,o){const s=e.x,a=e.y,n=e.z,i=o.elements,u=t.items,c=t.renderableIndices,l=t.count;for(let f=0;f<l;f++){const g=u[c[f]],h=g._storeIndex*24,m=r[h+12],b=r[h+13],d=r[h+14],p=i[0]*m+i[4]*b+i[8]*d+i[12],x=i[1]*m+i[5]*b+i[9]*d+i[13],_=i[2]*m+i[6]*b+i[10]*d+i[14],v=p-s,S=x-a,y=_-n;g._sortKey=-(v*v+S*S+y*y)}t.sortForced(f=>f._sortKey)}var Er=class{_managedViews;constructor(t){this._managedViews=new ee({renderer:t,type:"renderable",name:"view3d"})}track(t){this._managedViews.add(t)}destroy(){this._managedViews.destroy()}};export{Rr as A,Pr as B,Je as C,zr as D,Lr as E,sr as F,tr as G,vr as H,nr as I,ur as J,lr as K,dr as L,Qe as M,br as N,cr as O,ar as P,Ur as Q,ir as R,fr as S,yr as V,hr as a,xr as b,pr as c,mr as d,gr as e,Nr as f,_r as g,Tr as h,wr as i,Sr as j,Mr as k,Cr as l,Dr as m,Vr as n,Ar as o,Br as p,Fr as q,rr as r,Or as s,or as t,Xr as u,Ir as v,er as w,Gr as x,Er as y,kr as z};
