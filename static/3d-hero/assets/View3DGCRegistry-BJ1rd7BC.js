import{av as te,aw as N,ag as C,q as L,w as Ce,s as D,k as S,ax as z,ad as Be,T as re,ay as De,az as Ve,aA as Ne,aB as Te,aC as Me,M as A,Q as Ae,aD as Ie,aE as ae,aF as Ge,aG as P,aH as R,aI as Fe,aJ as V,a9 as k,aK as Le,aL as ze,g as U,ac as I,f as Pe,aM as Re,aN as ke,$ as Ue,B as oe,L as se,b as ne,a as Xe,aO as Oe,X as Ee,ai as He}from"./index-DOba0GE3.js";import{c as $e,R as qe}from"./RenderTexture-B4iswCQS.js";var Ft=class extends te{_dirtyQueue=[];_dirtyCount=0;constructor(){super({stride:64,initialSize:100,indexKey:"_materialIndex",copier:(e,t,r,a,o)=>{t.set(e.data._f32,o)}})}enqueueDirty(e){!this.buffer||e._storeQueued||(e._storeQueued=!0,this._dirtyQueue[this._dirtyCount++]=e)}register(e){const t=e._uploadQueue;t===this&&e._materialIndex!==-1||(t&&t!==this&&t.remove(e),e._uploadQueue=this,e._storeQueued=!1,this.allocate(e),this.enqueueDirty(e))}update(){const e=this._dirtyQueue,t=this._dirtyCount;this._dirtyCount=0;for(let r=0;r<t;r++){const a=e[r];e[r]=null,a._uploadQueue===this&&(a._storeQueued=!1,this.set(a))}super.update()}destroy(){this._dirtyQueue.length=0,this._dirtyCount=0,super.destroy()}};const Lt=.1,X=new C,ie=new C;let le=0,ce=0,ue=0,de=0;function Ye(e,t,r,a,o){o.length=r;for(let s=1;s<=r;s++){const n=s/r,i=e*Math.pow(t/e,n),u=e+(t-e)*n;o[s-1]=a*i+(1-a)*u}return o}function We(e,t){X.getInverse(e.viewProjection),ie.multiplyMatrices(t,X)}function je(e,t){const r=ie.elements;let a=1/0,o=-1/0,s=0,n=0;for(const i of[e,t])for(let u=-1;u<=1;u+=2)for(let c=-1;c<=1;c+=2){const l=r[0]*c+r[4]*u+r[8]*i+r[12],d=r[1]*c+r[5]*u+r[9]*i+r[13],b=r[2]*c+r[6]*u+r[10]*i+r[14],m=r[3]*c+r[7]*u+r[11]*i+r[15],f=b/m;s+=l/m,n+=d/m,f<a&&(a=f),f>o&&(o=f)}le=a,ce=o,ue=s*.125,de=n*.125}function O(e,t){const r=e.projection.elements;return(r[10]*-t+r[14])/(r[11]*-t+r[15])}function fe(e,t,r){const a=e.elements,o=1/(t-r);a[10]=o,a[14]=t*o}function T(e,t,r){const a=2*t/r;return Math.floor(e/a)*a}function Ze(e,t,r,a,o,s=!0){je(O(e,t),O(e,r));const n=e.projection.elements,i=e.mode==="orthographic"?1:r,u=i/n[5],c=i/n[0],l=(r-t)*.5,d=Math.sqrt(c*c+u*u+l*l),b=-ce-d*he,m=-le,f=T(ue,d,o),g=T(de,d,o);a.makeOrthographic(f-d,f+d,g+d,g-d,b,m),s&&fe(a,b,m)}const E=new N,he=4;function Ke(e,t,r,a,o=!0){e.applyMatrix4(t,E);const{min:s,max:n}=E,i=(n.x-s.x)*.5*1.1,u=(n.y-s.y)*.5*1.1,c=T((s.x+n.x)*.5,i,a),l=T((s.y+n.y)*.5,u,a),d=-n.z-Math.max(i,u)*he,b=-s.z;r.makeOrthographic(c-i,c+i,l+u,l-u,d,b),o&&fe(r,d,b)}const Qe=(e,t,r,a,o)=>{const{center:s,radius:n}=e.boundsSphere;if(t[o]=s.x,t[o+1]=s.y,t[o+2]=s.z,t[o+3]=e.dynamic?-1:n+e._morphBoundsExpansion,e.morphTargetCount>0){const i=e._morphDeltaBase>=0;r[o+4]=i?e._morphDeltaBase:0,r[o+5]=i?e.morphTargetCount:0,r[o+6]=i&&e._geometryAtlasAllocation?.baseVertex||0}};var zt=class extends te{constructor(e=100){super({stride:8,indexKey:"_geometryDataIndex",copier:Qe,initialSize:e})}set(e){const t=e._geometryDataStore;return t!==this&&(t?.remove(e),e._geometryDataStore=this),super.set(e)}};const Je=4;var Pt=class{data;buffer;bufferResource;bufferVersion=0;_deltaCursor=0;_deltaCapacity;_weightCursor=0;_freeSlots=new Map;_freeDeltaBlocks=new Map;_minDirty=1/0;_maxDirty=-1/0;_retiredBuffers=[];_texture=null;_textureSource=null;constructor(e={}){this._deltaCapacity=e.deltaCapacity??4096;const t=$(this._deltaCapacity,e.weightCapacity??1024);this.data=new Float32Array(this._deltaCapacity+t),this.buffer=this._createBuffer(),this.bufferResource=new L({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}uploadDeltas(e){const t=e._morphStore;if(t===this)return;if(t){t.freeDeltas(e),Ce(`MorphStoreBuffer: geometry #${e.uid} was packed by another renderer and draws unmorphed here`);return}const r=e._morphTargets;if(!r||r.length===0)return;const a=e.hasMorphNormals,o=a?8:Je,s=r.length,n=r[0].positions.length/3,i=n*s*o,u=this._freeDeltaBlocks.get(i);let c;u&&u.length>0?c=u.pop():(c=this._deltaCursor,c+i>this._deltaCapacity&&this._growArena(c+i),this._deltaCursor+=i);const l=new Float64Array(s),d=this.data;for(let m=0;m<n;m++){const f=m*3;for(let g=0;g<s;g++){const h=c+(m*s+g)*o,p=r[g].positions,_=p[f],x=p[f+1],v=p[f+2];d[h]=_,d[h+1]=x,d[h+2]=v,d[h+3]=0;const w=_*_+x*x+v*v;if(w>l[g]&&(l[g]=w),a){const y=r[g].normals;d[h+4]=y[f],d[h+5]=y[f+1],d[h+6]=y[f+2],d[h+7]=0}}}let b=0;for(let m=0;m<s;m++)b+=Math.sqrt(l[m]);e._morphBoundsExpansion=b,e._morphDeltaBase=c,e._morphDeltaFloats=i,e._morphStore=this,e._morphTargets=null,this._markDirty(c,c+i-1)}freeDeltas(e){const t=e._morphDeltaBase;if(t<0)return;const r=e._morphDeltaFloats;e._morphDeltaBase=-1,e._morphDeltaFloats=0,e._morphStore=null,this.buffer&&H(this._freeDeltaBlocks,r,t)}sync(e){for(let r=0;r<e.length;r++)this.uploadDeltas(e[r].geometry);const t=this._deltaCapacity;for(let r=0;r<e.length;r++){const a=e[r],o=a.morph;o._store!==this&&(o._store?.freeSlot(o),this.allocSlot(o));const s=t+o._slot;o._weightIndex!==s&&(o._weightIndex=s,a._storeDirty=!0),this.writeWeights(o)}this.update()}allocSlot(e){let t=1;for(;t<e.weights.length;)t<<=1;const r=this._freeSlots.get(t);let a;r&&r.length>0?a=r.pop():(a=this._weightCursor,this._deltaCapacity+a+t>this.data.length&&this._growWeights(a+t),this._weightCursor+=t),e._slot=a,e._slotSize=t,e._store=this}freeSlot(e){const t=e._slot;if(t<0)return;const r=e._slotSize;e._slot=-1,e._slotSize=0,e._store=null,this.buffer&&H(this._freeSlots,r,t)}writeWeights(e){const t=e.weights,r=this.data,a=this._deltaCapacity+e._slot,o=Math.min(t.length,e._slotSize);let s=!1;for(let n=0;n<o;n++){const i=t[n];r[a+n]!==i&&(r[a+n]=i,s=!0)}s&&this._markDirty(a,a+o-1)}update(){this._minDirty>this._maxDirty||(this.buffer.update((this._maxDirty-this._minDirty+1)*4,this._minDirty*4),this._textureSource?.update(),this._minDirty=1/0,this._maxDirty=-1/0)}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0}destroy(){this.buffer&&(this.bufferResource.destroy(!1),this.buffer.destroy(),this._freeRetired(),this._texture?.destroy(!0),this._texture=null,this._textureSource=null,this.data=null,this.buffer=null,this.bufferResource=null)}_createBuffer(){return new D({data:this.data,usage:S.STORAGE|S.COPY_DST|S.COPY_SRC,label:"MorphStoreBuffer",shrinkToFit:!1})}_markDirty(e,t){e<this._minDirty&&(this._minDirty=e),t>this._maxDirty&&(this._maxDirty=t)}_growArena(e){let t=this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(t,this.data.length-this._deltaCapacity)}_growWeights(e){let t=this.data.length-this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(this._deltaCapacity,t)}_reallocate(e,t){t=$(e,t);const r=new Float32Array(e+t);if(r.set(this.data.subarray(0,this._deltaCursor),0),r.set(this.data.subarray(this._deltaCapacity,this._deltaCapacity+this._weightCursor),e),this.data=r,this._deltaCapacity=e,this._retiredBuffers.push(this.buffer),this.buffer=this._createBuffer(),this.bufferResource=new L({buffer:this.buffer}),this.bufferVersion++,this._textureSource){const{width:a,height:o}=z(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==a||this._textureSource.height!==o)&&this._textureSource.resize(a,o),this._textureSource.update()}this._markDirty(0,e+this._weightCursor-1)}_initTexture(){const{width:e,height:t}=z(this.data.length);return this._textureSource=new Be({resource:this.data,width:e,height:t,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"}),this._texture=new re({source:this._textureSource}),this._texture}};function H(e,t,r){let a=e.get(t);a||(a=[],e.set(t,a)),a.push(r)}function $(e,t){const r=e+t;return t+(De(r)-r)}const et=300;function Rt(e,t,r){switch(e){case"off":return"off";case"cpu":return"cpu";case"gpu":return t?"gpu":"cpu";default:return r<=et?"off":t?"gpu":"cpu"}}const B=new Float32Array(24);function kt(e,t){const r=t[0],a=t[1],o=t[2],s=t[4],n=t[5],i=t[6],u=t[8],c=t[9],l=t[10],d=t[12],b=t[13],m=t[14];if(r===1&&n===1&&l===1&&a===0&&o===0&&s===0&&i===0&&u===0&&c===0&&d===0&&b===0&&m===0)return e;for(let f=0;f<6;f++){const g=f*4,h=e[g],p=e[g+1],_=e[g+2],x=r*h+a*p+o*_,v=s*h+n*p+i*_,w=u*h+c*p+l*_,y=1/Math.sqrt(x*x+v*v+w*w);B[g]=x*y,B[g+1]=v*y,B[g+2]=w*y,B[g+3]=(d*h+b*p+m*_+e[g+3])*y}return B}function Ut(e,t,r,a,o){let s=!1;return r.lastAtlasBufferVersion!==e.bufferVersion&&(r.lastAtlasBufferVersion=e.bufferVersion,s=!0),r.lastMaterialStoreBufferVersion!==t.bufferVersion&&(r.lastMaterialStoreBufferVersion=t.bufferVersion,s=!0),r.lastMorphStoreBufferVersion!==a.bufferVersion&&(r.lastMorphStoreBufferVersion=a.bufferVersion,s=!0),o&&r.lastGeometryStoreBufferVersion!==o.bufferVersion&&(r.lastGeometryStoreBufferVersion=o.bufferVersion,s=!0),s}const Xt={transform:"mat4x4<f32>",bonePitIndex:"u32",materialIndex:"u32",geometryDataIndex:"u32",visibility:"u32",morphWeightIndex:"u32"},Ot={boundsCenter:"vec3<f32>",boundsRadius:"f32",morphDeltaBase:"u32",morphTargetCount:"u32",baseVertex:"u32",_pad:"u32"},Et={id:"u32",texSlots:"u32"},Ht={rows:"mat3x4<f32>"},$t={position:"vec3<f32>",kind:"f32",color:"vec3<f32>",range:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",cascadeCount:"f32",_pad:"f32"},qt={position:"vec3<f32>",type:"f32",color:"vec3<f32>",range:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32"},Yt={lightSpaceMatrix:"mat4x4<f32>",shadowParams:"vec4<f32>",cascadeSplits:"vec4<f32>"},Wt={hard:[[0,0]],pcf:[[-1,-1],[1,-1],[-1,1],[1,1]],"pcf-high":[[-2,-2],[0,-2],[2,-2],[-2,0],[0,0],[2,0],[-2,2],[0,2],[2,2]]},q=/\{\{(.*?)\}\}/g,Y=8;function tt(e,t){let r=e;for(let o=0;o<Y;o++){const s=r.replace(q,(n,i)=>{const u=t[i];return u?u.join(`
`):""});if(s===r)break;r=s}const a=r.match(q);if(a){const o=[...new Set(a)].join(", ");throw new Error(`[fillTemplateSlots] Slot markers still present after ${Y} substitution passes: ${o}. A slot's code reintroduces its own marker (directly or via another slot) — break the cycle.`)}return r}function jt(e,t){for(const a of t)a.collectData?.(e);for(const a of t)a.preCompile?.(e);const r={};for(const a of t){const o=a.injectCode?.(e);if(o)for(const[s,n]of Object.entries(o))!n||!/\S/.test(n)||(r[s]??=[],r[s].push(n))}return tt(e.templateString,r)}function rt(e,t,r){const a=r;if(!a?.type)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} missing 'type'.`);const o=Object.prototype.hasOwnProperty.call(a,"default"),s=a.required===!0;if(o&&s)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} cannot specify both 'default' and 'required: true'.`);if(!o&&!s)throw new Error(`[ShaderBit:${e}] overrideDefs.${t} must specify either 'default' or 'required: true'.`);if(s)return{type:a.type,required:!0};if(typeof a.default!="number"||!Number.isFinite(a.default))throw new Error(`[ShaderBit:${e}] overrideDefs.${t}.default must be a finite number.`);return{type:a.type,default:a.default,required:!1}}function Zt(e){const t=Object.create(null);for(const r of e)if(r.overrideDefs)for(const[a,o]of Object.entries(r.overrideDefs)){const s=rt(r.name,a,o),n=t[a];if(n&&(n.type!==s.type||n.required!==s.required||!n.required&&n.default!==s.default))throw new Error(`[ShaderBit overrides] Duplicate override '${a}' has conflicting definitions.
Existing: ${JSON.stringify(n)}
New (from '${r.name}'): ${JSON.stringify(s)}`);t[a]=n??s}return t}function at(e,t){return e==="u32"?`${Math.trunc(t)}u`:e==="i32"?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function Kt(e){const t=[];for(const r of Object.keys(e).sort()){const a=e[r];if(a.required)t.push(`override ${r}: ${a.type};`);else{const o=at(a.type,a.default);t.push(`override ${r}: ${a.type} = ${o};`)}}return t.length?t.join(`
`):""}function ot(e,t){return e==="u32"?`${Math.trunc(t)}`:e==="i32"?`${Math.trunc(t)}`:Number.isInteger(t)?`${t}.0`:`${t}`}function Qt(e,t){const r=[];for(const a of Object.keys(e).sort()){const o=e[a],s=t[a],n=s!==void 0;if(o.required&&!n)throw new Error(`[glslOverrides] required override '${a}' has no value supplied via descriptor.overrides.`);const i=n?s:o.default;r.push(`#define ${a} ${ot(o.type,i)}`)}return r.length?r.join(`
`):""}function Jt(e,t,r){const a={};for(const o of e){const s=o[t]?.[r];if(s)for(const[n,i]of Object.entries(s))i&&(a[n]??=[],a[n].push(i))}return a}const st=/\{\{(.*?)\}\}/g;function nt(e){const t={};return(e.match(st)?.map(r=>r.replace(/[{()}]/g,""))??[]).forEach(r=>{t[r]=[]}),t}const W=new Map;function er(e){let t=W.get(e);return t||(t=new Set(Object.keys(nt(e))),W.set(e,t)),t}const tr={x:0,y:1,z:0};var rr=class{globalUniformGroup;globalBindGroup;lastMaterialStoreBufferVersion=-1;lastAtlasBufferVersion=-1;lastMorphStoreBufferVersion=-1;lastGeometryStoreBufferVersion=-1;constructor(e,t){this.globalUniformGroup=e,this.globalBindGroup=t}destroy(){this.globalBindGroup.destroy(),this.globalUniformGroup.buffer?.destroy()}};const ar={name:"camera",bindings:{camera:{uCameraPosition:"vec3<f32>",uViewMatrix:"mat4x4<f32>",uProjectionMatrix:"mat4x4<f32>",uViewProjectionMatrix:"mat4x4<f32>",uViewportUVScale:"vec2<f32>",uViewport:"vec4<f32>",uLightTiles:`array<vec4<i32>, ${Ve}>`,uLightDepthPlane:"vec4<f32>"}}},or={name:"doubleSidedNormal",gpu:{fragment:{material:`
  normal = select(-normal, normal, input.frontFacing);
`}},gl:{fragment:{material:`
  if (!gl_FrontFacing) {
    normal = -normal;
  }
`}}},sr={name:"flatShading",gpu:{fragment:{material:`
  let flatNormal = normalize(cross(dpdx(input.vPosition), dpdy(input.vPosition)));
  normal = select(-flatNormal, flatNormal, dot(flatNormal, normal) >= 0.0);
`}},gl:{fragment:{material:`
  vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  normal = dot(flatNormal, normal) >= 0.0 ? flatNormal : -flatNormal;
`}}},me=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,pe=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`;function it(e){return`
  // Rows 0/1 of the view matrix are the world-space camera right/up (an
  // orthonormal view matrix's transpose is its inverse). WGSL indexes
  // m[col][row], so row 0 is m[0][0], m[1][0], m[2][0].
  let bbRight = vec3<f32>(camera.uViewMatrix[0][0], camera.uViewMatrix[1][0], camera.uViewMatrix[2][0]);
  let bbUp    = vec3<f32>(camera.uViewMatrix[0][1], camera.uViewMatrix[1][1], camera.uViewMatrix[2][1]);
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
  clipPosition = camera.uViewProjectionMatrix * worldPosition;
${e?me:""}`}function lt(e){return`
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
  gl_Position = uViewProjectionMatrix * worldPosition;
${e?pe:""}`}function ct(e){return`
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
  let bbToCam = camera.uCameraPosition - bbCentre;
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
  clipPosition = camera.uViewProjectionMatrix * worldPosition;
${e?me:""}`}function ut(e){return`
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
  gl_Position = uViewProjectionMatrix * worldPosition;
${e?pe:""}`}const j=Object.create(null);function nr(e,t){const r=`${e}:${t}`,a=j[r];if(a)return a;if(e==="none")throw new Error("[meshBillboardBits] billboardMode 'none' has no bit — the caller must skip injection.");const o=e==="spherical",s={name:`meshBillboard${o?"Spherical":"Cylindrical"}${t?"Lit":""}`,gpu:{vertex:{afterTransform:o?it(t):ct(t)}},gl:{vertex:{afterTransform:o?lt(t):ut(t)}}};return j[r]=s,s}const ir={name:"normal",attributes:{aNormal:"float32x3"},gpu:{vertex:{input:"normal = input.aNormal;"}},gl:{vertex:{input:"normal = aNormal;"}}},lr={name:"normalMapping",gpu:{header:`
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
`}}},cr={name:"no-shadow",gpu:{header:`
    fn calculateShadow(
      shadowDataIndex: f32,
      cascadeCount: f32,
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
    `}},dt={float32x3:"1.0",float32x4:"1.0",snorm8x4:"127.0",unorm8x4:"255.0",snorm16x4:"32767.0",unorm16x4:"65535.0"},Z=Object.create(null);function ur(e){const t=Z[e];if(t)return t;const r=dt[e];if(!r)throw new Error(`[positionBit] Unsupported aPosition format: ${e}`);const a=e==="float32x3",o=a?"aPosition":"aPosition.xyz",s=a?"input.aPosition":"input.aPosition.xyz",n=r==="1.0"?"":` * ${r}`,i={name:`position:${e}`,attributes:{aPosition:e},gpu:{vertex:{input:`position = vec4<f32>(${s}${n}, 1.0);`}},gl:{vertex:{input:`position = vec4(${o}${n}, 1.0);`}}};return Z[e]=i,i}const dr={name:"tangentNormalMapping",attributes:{aTangent:"float32x4"},interStage:{vTangent:"vec3<f32>",vBitangent:"vec3<f32>"},gpu:{vertex:{input:`
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
`}}},K=Object.create(null);function fr(e){const t=K[e];if(t)return t;const r={name:`uvs:${e}`,overrideDefs:{HAS_UVS:{type:"u32",required:!0}},attributes:{aUV:e},gpu:{vertex:{input:"uv = vec2<f32>(input.aUV);"}},gl:{vertex:{input:"uv = vec2(aUV);"}}};return K[e]=r,r}const hr={name:"vertexColor",attributes:{aColor:"float32x4"},interStage:{vColor:"vec4<f32>"},gpu:{vertex:{end:"output.vColor = input.aColor;"},fragment:{material:`albedo *= input.vColor.rgb;
  alpha *= input.vColor.a;`}},gl:{vertex:{end:"vColor = aColor;"},fragment:{material:`albedo *= vColor.rgb;
  alpha *= vColor.a;`}}},mr={preCompile(e){const t=e.data.structs;t?.Material&&(t.Material=Ne(e.bits))}},Q=new C,J=new ae,ft=new Le,ht=new N,mt=new ae,pt=.001,bt=.15,gt=3,_t=50,xt=.15,M=256,vt="Shadow: shadow.bounds and shadow.cascades are both set — cascades take precedence and the bounds box is ignored. Use bounds for a fixed region or cascades for a camera-following shadow, not both.",yt="Shadow auto-fit box spans a large scene, so shadows may look soft. For a roaming or large scene, enable cascades: light.shadow.cascades = 3.",wt=`Too many shadow-casting lights for the shadow budget (4 lights × 4 cascades = ${A} slots). Extra casters render without shadows.`;var pr=class extends Te{_renderTarget=null;_layerCount=0;_quality="medium";_frameCount=0;_sceneCasterBounds=new N;_sceneBoundsFrame=-1;_destroyed=!1;targetVersion=0;_view3d=null;shadowMapHandle;constructor(e){super(e),this.shadowMapHandle=e.shadowMapHandle}get renderTarget(){return this._renderTarget===null&&(this._renderTarget=Me(this._quality,Math.max(this._layerCount,1))),this._renderTarget}_growAtlas(e){e<=this._layerCount||(this._layerCount=Math.min(e,A),this._releaseTarget())}set quality(e){e!==this._quality&&(this._quality=e,this._releaseTarget())}get quality(){return this._quality}beginFrame(e){this._view3d=e,this.quality=e.shadowQuality,this._frameCount++,e._shadowDataList.reset()}unload(){this._releaseTarget()}_releaseTarget(){const e=this._renderTarget;e&&(this._renderTarget=null,this.targetVersion++,this._view3d&&this._bindShadowSource(this._view3d,Ae.source),e.destroy())}_bindShadowSource(e,t){const r=e._gpuData[this.pipe.renderer.uid];if(!r)return;const{globalBindGroup:a}=r,o=this.pipe.globalSlots.shadowMap;a.getResource(o)!==t&&(a.setResource(t,o),e._invalidateBundleCaches())}setup(e){e.produce(this.shadowMapHandle)}condition(e){const t=e.view3d._meshBatches,r=e.lights;let a=!1;for(let o=0;o<r.length;o++)if(r[o].canCastShadow){a=!0;break}if(a){for(let o=0;o<t.length;o++)if((t[o].drawLists[this.bit]?.view.count??0)>0)return!0}return!1}getShadowGPUData(e){return e._gpuShadowData??={inverseLightMatrix:new C,lightProjectionMatrix:new C,targetVersion:this.targetVersion}}_cascadeSlot(e,t){const r=this.getShadowGPUData(e).cascades??=[];return r[t]??={cameraData:new Ie,bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}_commitCascadeCamera(e,t,r){Q.getInverse(t),Q.extractPosition(J);const a=e.cameraData;a.set(J,t,r),a.frustum.setFromProjectionMatrix(a.viewProjection)}updateLightShadowData(e,t){if(!e.canCastShadow)return;const r=t.camera,a=this.getShadowGPUData(e),{inverseLightMatrix:o,lightProjectionMatrix:s}=a,n=a.targetVersion!==this.targetVersion,i=Ge[this._quality],u=e._shadowRefreshRequested,c=e.shadow.update,l=e.shadow.bias??pt;if(e.type==="spot"||e.shadow.cascades===void 0){const h=this._cascadeSlot(e,0),p=P(R(c,0),this._frameCount,u);if(!p)if(e.type==="spot")Fe(e,o,s,this._applyZRangeFix),this._commitCascadeCamera(h,o,s),h.normalBias=e.shadow.normalBias??bt;else{const _=e.shadow.bounds??this._resolveAutoShadowBounds(e,t,i);_!==void 0&&!_.isEmpty()&&(o.getInverse(e.worldTransform),Ke(_,o,s,i,this._applyZRangeFix),this._commitCascadeCamera(h,o,s),h.normalBias=this._resolveNormalBias(e,s,i))}h.bias=l,h.mapSize=i,h.cascadeCount=0,h.splits=null,h.needsRender=n||!p;return}e.shadow.bounds!==void 0&&V("pixi3d-shadow-bounds-cascades",vt),o.getInverse(e.worldTransform);const d=k(e),b=e.shadow.lambda,m=Math.min(e.shadow.maxDistance??_t,r.far),f=this._cascadeSlot(e,0),g=f.splits??=[];Ye(r.near,m,d,b,g),We(r,o);for(let h=0;h<d;h++){const p=h===0?f:this._cascadeSlot(e,h),_=P(R(c,h),this._frameCount,u);if(!_){const x=h===0?r.near:g[h-1];Ze(r,x,g[h],s,i,this._applyZRangeFix),this._commitCascadeCamera(p,o,s),p.normalBias=this._resolveNormalBias(e,s,i)}p.bias=l,p.mapSize=i,p.cascadeCount=h===0&&d>1?d:0,h>0&&(p.splits=null),p.needsRender=n||!_}}_completeShadowUpdate(e){e._gpuShadowData&&(e._gpuShadowData.targetVersion=this.targetVersion),e._shadowRefreshRequested=!1}_resolveAutoShadowBounds(e,t,r){const a=this._countSceneCasters(t),o=e._autoShadowBounds;if(a>M&&e._autoShadowBoundsFrozen)return o??void 0;const s=this._ensureSceneCasterBounds(t);if(s.isEmpty())return o??void 0;const n=o??(e._autoShadowBounds=new N);return n.copyFrom(s),a<=M?e._autoShadowBoundsFrozen=!1:o!==null&&(e._autoShadowBoundsFrozen=!0,V("pixi3d-shadow-autofit-cap",`Shadow auto-fit: ${a} shadow casters is over the auto-measure cap (${M}), so the shadow box was fitted once and frozen. If casters move or spawn outside it, set shadow.bounds, enable shadow.cascades, or call light.fitShadowBounds() after changes.`)),this._warnIfShadowBoxLarge(n,r),n}_countSceneCasters(e){let t=0;const r=e._meshBatches;for(let a=0;a<r.length;a++){const o=r[a];if(!o.renderData._worldVisible)continue;const s=o.drawLists[this.bit];s&&(t+=s.view.count)}return t}_ensureSceneCasterBounds(e){if(this._sceneBoundsFrame===this._frameCount)return this._sceneCasterBounds;this._sceneBoundsFrame=this._frameCount;const t=this._sceneCasterBounds.makeEmpty(),r=e._meshBatches;for(let a=0;a<r.length;a++){const o=r[a];if(!o.renderData._worldVisible)continue;const s=o.drawLists[this.bit];if(!s||s.view.count===0)continue;const n=a===0?null:o.renderData.worldTransform,i=s.view.items,u=s.view.indices;for(let c=0;c<s.view.count;c++){const l=i[u[c]];if(!l)continue;const d=l.boundingSphere;if(d.radius<0)continue;const b=n?d.applyMatrix4(n,ft):d;t.union(b.getBounds(ht))}}return t}_warnIfShadowBoxLarge(e,t){if(e.isEmpty())return;const r=e.getSize(mt);Math.max(r.x,r.y,r.z)/t>xt&&V("pixi3d-shadow-autofit-large",yt)}_resolveNormalBias(e,t,r){if(e.shadow.normalBias!==void 0)return e.shadow.normalBias;const a=2/(t.elements[0]*r);return gt*a}prepareShadow(e,t){const r=t._shadowDataList,a=this._claimShadowSlots(e,r.count);if(a===0)return;this._growAtlas(r.count+a),this.updateLightShadowData(e,t);const o=this.getShadowGPUData(e).cascades;for(let s=0;s<a;s++)r.add(o[s])}_claimShadowSlots(e,t){const r=e.canCastShadow,a=k(e);return r&&t+a<=A?(e._shadowDataIndex=t,a):(r&&V("pixi3d-shadow-budget",wt),e._shadowDataIndex=-1,0)}destroy(){this._destroyed||(this._destroyed=!0,this._view3d=null,this._releaseTarget(),super.destroy())}};const St=1024,Ct=2048;var Bt=class{uid=ze("geometryAtlas");attributeKey;vertexStride;_vertexBuffer;_indexBuffer;_retiredBuffers=[];_retiredGeometries=[];_vertexCount=0;_indexCount=0;_deadVertexCount=0;_deadIndexCount=0;_liveAllocations=[];_vertexDirtyMin=1/0;_vertexDirtyMax=-1/0;_indexDirtyMin=1/0;_indexDirtyMax=-1/0;_bufferVersion=0;geometry;_attributeInfo;rebaseIndices;constructor(e){const{referenceGeometry:t,initialVertexCapacity:r=St,initialIndexCapacity:a=Ct,rebaseIndices:o=!1}=e;this.rebaseIndices=o,this.attributeKey=t.attributeKey;const s=t.attributes,n=Object.keys(s).sort();if(!n.some(u=>!s[u].instance))throw new Error("GeometryAtlas: reference geometry has no vertex attributes");let i=0;this._attributeInfo=[];for(const u of n){const c=s[u];if(c.instance)continue;const l=U(c.format).stride;i=i+3&-4;const d=i;i+=l,this._attributeInfo.push({name:u,attr:{format:c.format,offset:d}})}this.vertexStride=i+3&-4,this._vertexBuffer=new D({data:new Uint8Array(r*this.vertexStride),usage:S.VERTEX|S.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._indexBuffer=new D({data:new Uint32Array(a),usage:S.INDEX|S.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this.geometry=this._buildMergedGeometry()}get vertexCount(){return this._vertexCount}add(e){const t=e._geometryAtlasAllocation;if(t&&t.atlas===this)return t;for(const p in e.attributes)if(e.attributes[p].instance)throw new Error(`GeometryAtlas: Cannot add geometry with instance attribute "${p}". The Atlas is for merging vertex data only; instance data would be lost.`);if(e.attributeKey!==this.attributeKey)throw new Error(`GeometryAtlas: attribute structure mismatch. Expected "${this.attributeKey}", got "${e.attributeKey}"`);const r=e.vertexCount,a=e.indexBuffer.data,o=a.length,s=this._vertexBuffer.data.byteLength/this.vertexStride,n=this._indexBuffer.data.length,i=this._vertexCount+r>s,u=this._indexCount+o>n;if(i||u){const p=this._vertexCount-this._deadVertexCount,_=this._indexCount-this._deadIndexCount,x=p+r<=s,v=_+o<=n;x&&v?this.defragment():((this._deadVertexCount>0||this._deadIndexCount>0)&&this.defragment(),this._ensureVertexCapacity(this._vertexCount+r),this._ensureIndexCapacity(this._indexCount+o))}const c=this._vertexCount,l=this._indexCount;this._vertexCount+=r,this._indexCount+=o;const d=this._vertexBuffer.data,b=this._indexBuffer.data,m=this.vertexStride,f=this._attributeInfo[0].name,g=e.attributes[f];if(this._isGeometryInterleaved(e)&&g.stride===m){const p=g.buffer.data,_=c*m;d.set(p,_),this._markVertexDirty(_,_+p.byteLength)}else{for(let x=0;x<r;x++){const v=(c+x)*m;for(const w of this._attributeInfo){const y=e.attributes[w.name],G=U(w.attr.format).stride,xe=y.stride??G,ve=y.offset??0,F=y.buffer.data,ye=x*xe+ve,we=v+(w.attr.offset??0),Se=new Uint8Array(F.buffer,F.byteOffset+ye,G);d.set(Se,we)}}const p=c*m,_=(c+r)*m;this._markVertexDirty(p,_)}if(this.rebaseIndices)for(let p=0;p<o;p++)b[l+p]=a[p]+c;else b.set(a,l);this._markIndexDirty(l,l+o);const h={atlas:this,baseVertex:c,firstIndex:l,indexCount:o,vertexCount:r};return e._geometryAtlasAllocation=h,this._liveAllocations.push(h),h}remove(e){const t=e._geometryAtlasAllocation;if(!t)return;this._deadVertexCount+=t.vertexCount,this._deadIndexCount+=t.indexCount;const r=this._liveAllocations.indexOf(t);r!==-1&&this._liveAllocations.splice(r,1),e._geometryAtlasAllocation=null}update(){if(this._vertexDirtyMin<this._vertexDirtyMax){const e=this._vertexDirtyMax-this._vertexDirtyMin;this._vertexBuffer.update(e,this._vertexDirtyMin),this._vertexDirtyMin=1/0,this._vertexDirtyMax=-1/0}if(this._indexDirtyMin<this._indexDirtyMax){const e=this._indexDirtyMin*4,t=(this._indexDirtyMax-this._indexDirtyMin)*4;this._indexBuffer.update(t,e),this._indexDirtyMin=1/0,this._indexDirtyMax=-1/0}}_isGeometryInterleaved(e){const t=e.attributes[this._attributeInfo[0].name].buffer;for(let r=1;r<this._attributeInfo.length;r++)if(e.attributes[this._attributeInfo[r].name].buffer!==t)return!1;return!0}_buildMergedGeometry(){const e=new I;for(const{name:t,attr:r}of this._attributeInfo)e.addAttribute(t,{buffer:this._vertexBuffer,format:r.format,stride:this.vertexStride,offset:r.offset});return e.addIndex(this._indexBuffer),e}_markVertexDirty(e,t){e<this._vertexDirtyMin&&(this._vertexDirtyMin=e),t>this._vertexDirtyMax&&(this._vertexDirtyMax=t)}_markIndexDirty(e,t){e<this._indexDirtyMin&&(this._indexDirtyMin=e),t>this._indexDirtyMax&&(this._indexDirtyMax=t)}_retireCurrentGeometry(){this.geometry&&(this.geometry.indexBuffer=null,this._retiredGeometries.push(this.geometry))}_ensureVertexCapacity(e){const t=this._vertexBuffer.data;let r=t.byteLength/this.vertexStride;if(e<=r)return;for(;r<e;)r*=2;const a=new Uint8Array(r*this.vertexStride);a.set(t),this._retiredBuffers.push(this._vertexBuffer),this._vertexBuffer=new D({data:a,usage:S.VERTEX|S.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._markVertexDirty(0,this._vertexCount*this.vertexStride),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}_ensureIndexCapacity(e){const t=this._indexBuffer.data;let r=t.length;if(e<=r)return;for(;r<e;)r*=2;const a=new Uint32Array(r);a.set(t),this._retiredBuffers.push(this._indexBuffer),this._indexBuffer=new D({data:a,usage:S.INDEX|S.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this._markIndexDirty(0,this._indexCount),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}destroy(){if(this._vertexBuffer!==null){this.geometry&&(this.geometry.indexBuffer=null),this.geometry?.destroy(!1),this.geometry=null,this._vertexBuffer.destroy(),this._indexBuffer.destroy();for(let e=0;e<this._retiredGeometries.length;e++)this._retiredGeometries[e].destroy(!1);this._retiredGeometries.length=0;for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0,this._vertexBuffer=null,this._indexBuffer=null,this._liveAllocations.length=0}}defragment(){if(this._deadVertexCount===0&&this._deadIndexCount===0)return;const e=this.vertexStride,t=this._vertexBuffer.data,r=this._indexBuffer.data;let a=0,o=0;const s=this.rebaseIndices;for(const n of this._liveAllocations){const i=n.baseVertex;if(i!==a){const u=i*e,c=a*e,l=n.vertexCount*e;t.copyWithin(c,u,u+l),n.baseVertex=a}if(a+=n.vertexCount,n.firstIndex!==o&&(r.copyWithin(o,n.firstIndex,n.firstIndex+n.indexCount),n.firstIndex=o),s&&i!==n.baseVertex){const u=n.baseVertex-i;for(let c=0;c<n.indexCount;c++)r[n.firstIndex+c]+=u}o+=n.indexCount}this._markVertexDirty(0,a*e),this._markIndexDirty(0,o),this._vertexCount=a,this._indexCount=o,this._deadVertexCount=0,this._deadIndexCount=0,this._bufferVersion++}};const ee=Object.create(null);var br=class be{_atlases=Object.create(null);_rebaseIndices;_bufferVersion=0;constructor(t){this._rebaseIndices=t.rebaseIndices}static from(t){const r=t.rebaseIndices?"rebased":"geometryLocal";let a=ee[r];return a||(a=new be(t),ee[r]=a,Pe.register(a)),a}get bufferVersion(){return this._bufferVersion}allocate(t){const r=t.attributeKey;let a=this._atlases[r];const o=t._geometryAtlasAllocation;if(o&&o.atlas===a)return o;a||(a=new Bt({referenceGeometry:t,rebaseIndices:this._rebaseIndices}),this._atlases[r]=a);const s=a._bufferVersion,n=a.add(t);return a._bufferVersion!==s&&this._bufferVersion++,n}update(){for(const t in this._atlases)this._atlases[t].update()}clear(){for(const t in this._atlases)this._atlases[t].destroy();this._atlases=Object.create(null)}};function Dt(e){const{camera:t}=e;if(t._view3d!==e)throw new Error("Camera3D is no longer in the View3D scene graph. Don't remove an assigned camera from its parent without reassigning view3d.camera.");if(t.renderTexture)throw new Error("The View3D's own camera draws the view, not a texture. Put the render texture on a second camera and draw from it with a pass that names that camera.");if(!t.visible||t._worldVisible===0)throw new Error("Camera3D is hidden (visible=false or an ancestor is hidden). Cannot render with a hidden camera. See https://github.com/pixijs/pixi-3d/issues/95")}const Vt=(()=>{const e=new Re;return e._worldVisible=1,e})();function Nt(e){const t=e._childrenToUpdate,r=e._updateTick++;for(const a in t){const o=Number(a),s=t[a],n=s.list,i=s.index;for(let u=0;u<i;u++){const c=n[u];c._view3d===e&&c._relativeSceneDepth===o&&ge(c,c.parent??Vt,r,!1,!1)}$e(n,i),s.index=0}}function ge(e,t,r,a,o){if(r===e._updateTick)return;e._updateTick=r,e.didChange=!1,a||=e._worldTransformDirty,o||=e._worldVisibleDirty,o&&(e._worldVisible=t._worldVisible*e._visible),e._worldVisible&&a&&(e._localTransformDirty&&(e.updateLocalTransform(),e._localTransformDirty=!1),C.multiplyAffine(e.worldTransform.elements,0,t.worldTransform.elements,0,e.localTransform.elements,0),e._worldTransformId++,e._storeWorldTransform()),e._worldVisibleDirty=!1,e._worldTransformDirty=e._worldVisible?!1:a;const s=e.children,n=s.length;for(let i=0;i<n;i++)ge(s[i],e,r,a,o)}function gr(e,t,r){Nt(e),Dt(e),ke(e.camera,r);const a=Ue(e.camera).frame;if(a.width<=0||a.height<=0)return!1;e._syncShadowSampling(),e._bonePit.clear();const o=e._skinnedMeshes.items;for(let c=0;c<e._skinnedMeshes.items.length;c++){const l=o[c],d=l.skeleton;d.updateWorld();const b=e._bonePit.add(d);l._lastBonePitIndex!==b&&(l._lastBonePitIndex=b,l._storeDirty=!0)}e._bonePit.update(),t._morphStoreBuffer.sync(e._morphedMeshes.items);const s=t.geometryDataStoreBuffer,n=e.meshes.items;for(let c=0;c<n.length;c++){const l=n[c],d=l.material,b=l.renderPassMask;if(b!==l._lastRenderPass&&e._sceneBatch.setItemActive(e._meshSlots.getIndex(l),b),l._worldVisible!==l._lastWorldVisible&&(l._lastWorldVisible=l._worldVisible,l._storeDirty=!0,e._sceneBatch._visibilityDirtyId++),l._lastDescriptorDirtyId!==d._descriptorDirtyId&&(l._lastDescriptorDirtyId=d._descriptorDirtyId,l._batchDirty=!0),l._lastRenderPass===0)continue;const m=l.geometry;if(l._batchDirty||m._geometryAtlasAllocation===null&&!m.dynamic){l._batchDirty=!1,t.renderer.material3d.ensureMaterial(l,e),m.dynamic||(m._geometryAtlasAllocation=t.atlasPool.allocate(m)),s.set(m);let f=l.renderPassMask&e._dirtyHookBits;for(;f;){const g=f&-f;e.passByBit[g].onRenderableDirty(l,e._sceneBatch),f^=g}}l._storeDirty&&(l._storeDirty=!1,e._sceneBatch.storeBuffer.set(l))}e._sceneBatch.storeBuffer.update();for(let c=1;c<e._meshBatches.length;c++){const l=e._meshBatches[c];l.writeBatchWorldMatrix(l.renderData.worldTransform);const d=l._dirtyIndices,b=l._dirtyCount;for(let m=0;m<b;m++){const f=l.items[d[m]];f._batchDirty=!1;const g=f.material;t.renderer.material3d.ensureMaterial(f,e),f.geometry.dynamic||(f.geometry._geometryAtlasAllocation=t.atlasPool.allocate(f.geometry)),s.set(f.geometry),l.storeBuffer.u32Data[f._storeIndex*24+17]=g._materialIndex,l.storeBuffer.u32Data[f._storeIndex*24+18]=f.geometry._geometryDataIndex,l.storeBuffer.markDirtyRange(f._storeIndex,f._storeIndex);let h=f._lastRenderPass&e._dirtyHookBits;for(;h;){const p=h&-h;e.passByBit[p].onRenderableDirty(f,l),h^=p}}l._dirtyCount=0,l.storeBuffer.update()}const i=t.atlasPool.bufferVersion;if(e._lastAtlasBufferVersion!==i){e._lastAtlasBufferVersion=i;const c=e._morphedMeshes.items;for(let l=0;l<c.length;l++)s.set(c[l].geometry)}for(let c=0;c<e._meshBatches.length;c++){const l=e._meshBatches[c],d=l.storeBuffer.bufferVersion;l._lastStoreBufferVersion!==d&&(l._lastStoreBufferVersion=d,l.invalidateDrawCaches())}const u=e._bonePit.bufferVersion;return e._lastBonePitBufferVersion!==u&&(e._lastBonePitBufferVersion=u,e._invalidateDrawCaches()),!0}const _e={name:"iblSamplingFuncs",gpu:{header:`
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
`}},Tt={gl:{vertex:`#version 300 es
      {{header}}
      void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
          vUv = aPosition * 0.5 + 0.5;
      }
    `,fragment:`#version 300 es
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
    `}},Mt={gpu:`
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
`},At={bindGroups:["local"],gpu:Mt.gpu,gl:Tt.gl};function _r(e){const{renderer:t}=e,r=e.size??256,a=e.sampleCount??1024,o={name:"brdfLut",attributes:{aPosition:"float32x2"},interStage:{vUv:"vec2<f32>"},bindings:{local:{sampleCount:"f32"}}},s=new oe({0:new se({sampleCount:{value:a,type:"f32"}})}),n=t.material3d.compileIsolatedShader([_e,o],At,{0:s}),i=qe.create({width:r,height:r,format:"rgba16float"}).source,u=new re({source:i}),c=new I({attributes:{aPosition:new Float32Array([-1,-1,1,-1,-1,1,1,1])},topology:"triangle-strip"}),l=t.renderTarget.renderTarget?t.renderTarget.getBindState():null;return t.renderTarget.bind({target:i,clear:!0}),t.encoder.draw({geometry:c,shader:n,state:ne.default2d}),l&&t.renderTarget.bind(l),u}function xr(e){const{renderer:t,sourceTexture:r}=e,a=e.size??256,o=e.sampleCount??1024,s=e.label??"ibl-specular",n=e.format??"rgb10a2unorm",i=e.mipLevelCount??Math.max(1,Math.floor(Math.log2(a))-3),u={bindGroups:["local"],gpu:`
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
        
        // Avoid 0/0 when no sample contributes weight.
        // A NaN written here would remain in the mip for the texture's lifetime.
        prefilteredColor = prefilteredColor / max(totalWeight, 1e-4);
        
        return vec4<f32>(prefilteredColor, 1.0);
     }
  `,gl:{vertex:`#version 300 es
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
            
            // Avoid 0/0 when no sample contributes weight.
            // A NaN written here would remain in the mip for the texture's lifetime.
            prefilteredColor = prefilteredColor / max(totalWeight, 1e-4);
            fragColor = vec4(prefilteredColor, 1.0);
        }
      `}},c={name:"iblPrefilter",attributes:{aPosition:"float32x2"},interStage:{vDir:"vec3<f32>"},bindings:{local:{uSourceTexture:"texture_cube<f32>",uSampler:"sampler",layer:"f32",mipLevel:"f32",mipLevelCount:"f32",sampleCount:"f32"}}},l=new Xe({label:s,width:a,height:a,dimensions:"2d",viewDimension:"cube",arrayLayerCount:6,mipLevelCount:i,format:n}),d=new se({layer:{value:0,type:"f32"},mipLevel:{value:0,type:"f32"},mipLevelCount:{value:i,type:"f32"},sampleCount:{value:o,type:"f32"}}),b=new oe({0:d,1:r.source,2:r.source.style}),m=t.material3d.compileIsolatedShader([_e,c],u,{0:b}),f=new I({attributes:{aPosition:new Float32Array([-1,-1,1,-1,-1,1,1,1])},topology:"triangle-strip"}),g=new Oe({colorTextures:[l]}),h=m.resources.local,p=t.renderTarget.renderTarget?t.renderTarget.getBindState():null;for(let _=0;_<6;_++)for(let x=0;x<i;x++){h.uniforms.layer=_,h.uniforms.mipLevel=x;const v="uniformBatch"in t.renderPipes?t.renderPipes.uniformBatch.getUboResource(h):h;b.setResource(v,0),t.renderTarget.bind({target:g,clear:!0,mipLevel:x,layer:_}),t.encoder.draw({geometry:f,shader:m,state:ne.default2d})}return p&&t.renderTarget.bind(p),new Ee({source:l})}function vr(e){return(e.cache??(e.sort==="key"?"auto":"never"))==="auto"}function yr(e,t,r){const a=r.x,o=r.y,s=r.z,n=e.items,i=e.renderableIndices,u=e.count;for(let c=0;c<u;c++){const l=n[i[c]],d=l._storeIndex*24,b=t[d+12]-a,m=t[d+13]-o,f=t[d+14]-s;l._sortKey=-(b*b+m*m+f*f)}e.sortForced(c=>c._sortKey)}function wr(e,t){const r=t.x,a=t.y,o=t.z,s=e.items,n=e.renderableIndices,i=e.count;for(let u=0;u<i;u++){const c=s[n[u]],l=c.worldTransform.elements,d=l[12]-r,b=l[13]-a,m=l[14]-o;c._sortKey=-(d*d+b*b+m*m)}e.sortForced(u=>u._sortKey)}function Sr(e,t,r,a){const o=t.x,s=t.y,n=t.z,i=a.elements,u=e.items,c=e.renderableIndices,l=e.count;for(let d=0;d<l;d++){const b=u[c[d]],m=b._storeIndex*24,f=r[m+12],g=r[m+13],h=r[m+14],p=i[0]*f+i[4]*g+i[8]*h+i[12],_=i[1]*f+i[5]*g+i[9]*h+i[13],x=i[2]*f+i[6]*g+i[10]*h+i[14],v=p-o,w=_-s,y=x-n;b._sortKey=-(v*v+w*w+y*y)}e.sortForced(d=>d._sortKey)}var Cr=class{_managedViews;constructor(e){this._managedViews=new He({renderer:e,type:"renderable",name:"view3d"})}track(e){this._managedViews.add(e)}destroy(){this._managedViews.destroy()}};export{vr as A,Ht as B,Lt as C,_r as D,xr as E,gr as F,Ot as G,tr as H,Ut as I,Yt as J,Qt as K,$t as L,Ft as M,qt as N,Sr as O,wr as P,Et as R,Wt as S,rr as V,Jt as a,jt as b,Zt as c,Xt as d,Kt as e,ar as f,er as g,ur as h,fr as i,or as j,sr as k,dr as l,nr as m,lr as n,cr as o,mr as p,ir as q,Rt as r,pr as s,kt as t,yr as u,hr as v,Pt as w,zt as x,br as y,Cr as z};
