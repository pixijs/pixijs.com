"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["8657"],{68751(e,t,r){r.d(t,{M:()=>c,c:()=>f});var i=r(49491),s=r(36384),a=r(21657),o=r(97416),n=r(54537);let l=new i.P,h=new n.bRX,u={x:0,y:0};function d(e,t,r,i){var s,a;let o,n,l;s=t.x,a=t.y,o=e.elements,o[0]+=s*o[3],o[4]+=s*o[7],o[8]+=s*o[11],o[12]+=s*o[15],o[1]+=a*o[3],o[5]+=a*o[7],o[9]+=a*o[11],o[13]+=a*o[15],r&&((n=e.elements)[1]=-n[1],n[5]=-n[5],n[9]=-n[9],n[13]=-n[13]),i&&((l=e.elements)[2]=.5*(l[2]+l[3]),l[6]=.5*(l[6]+l[7]),l[10]=.5*(l[10]+l[11]),l[14]=.5*(l[14]+l[15]))}var c=class{uniformGroup;bindGroup;position=new i.P;view=new s.k;projection=new s.k;viewProjection=new s.k;previousViewProjection=new s.k;viewportUvScale=new n.bRX(1,1);lightTiles=new a.G0;frustum;frame=new n.M_G;_currentSession=null;_lastViewProjection=new s.k;_hasHistory=!1;constructor(e=new o.P){this.frustum=e,this.uniformGroup=new n.k2S({uCameraPosition:{value:this.position,type:"vec3<f32>"},uViewMatrix:{value:this.view,type:"mat4x4<f32>"},uProjectionMatrix:{value:this.projection,type:"mat4x4<f32>"},uViewProjectionMatrix:{value:this.viewProjection,type:"mat4x4<f32>"},uPreviousViewProjectionMatrix:{value:this.previousViewProjection,type:"mat4x4<f32>"},uViewportUVScale:{value:this.viewportUvScale,type:"vec2<f32>"},uLightTileTransform:{value:this.lightTiles.tileTransform,type:"vec4<f32>"},uLightTiles:{value:this.lightTiles.masks,type:"vec4<i32>",size:a.Wq},uLightDepthMasks:{value:this.lightTiles.depthMasks,type:"vec4<i32>",size:a.Fm},uLightDepthPlane:{value:this.lightTiles.depthPlane,type:"vec4<f32>"}}),this.uniformGroup.isStatic=!0,this.uniformGroup.ubo=!1,this.bindGroup=new n.TX4({camera:this.uniformGroup})}set(e,t,r,i=!1,s=!1,a=u){return this.position.copyFrom(e),this.view.copyFrom(t),this.projection.copyFrom(r),d(this.projection,a,i,s),this.viewProjection.multiplyMatrices(this.projection,t),this.lightTiles.invalidate(),this.uniformGroup.update(),this}setViewportUvScale(e,t){return this.viewportUvScale.set(e,t),this.uniformGroup.update(),this}setViewport(e,t=!1){return this.lightTiles.setViewport(e,t)&&this.uniformGroup.update(),this}prepareLightTiles(e){this.lightTiles.prepare(e,this.viewProjection,this.view)&&this.uniformGroup.update()}syncFromCamera(e,t=!1,r=!1,i){e.worldTransform.extractPosition(l);let{x:s,y:a}=e.jitter,o=i&&i.width>0&&i.height>0;h.set(o?2*s/i.width:0,o?-2*a/i.height:0),this.set(l,e.view,e.projection,t,r,h);let n=this.previousViewProjection;return n.copyFrom(this._hasHistory?this._lastViewProjection:e.viewProjection),d(n,h,t,r),this._lastViewProjection.copyFrom(e.viewProjection),this._hasHistory=!0,this}destroy(){this.lightTiles.destroy(),this._currentSession=null,this.bindGroup.destroy(),this.uniformGroup.buffer?.destroy()}};function f(e){return e._cameraData??=new c(e.frustum)}},62082(e,t,r){r.d(t,{V:()=>a});var i=r(55464),s=r(54537);function a(e,t,r){return new s.k2S({uGlobalLightParams:{value:new Float32Array([0,0,0,0]),type:"vec4<f32>"},uTime:{value:0,type:"f32"},uFogColor:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uDisplayExposure:{value:1,type:"f32"},uFogParams:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uExposure:{value:1,type:"f32"},uHemisphereSky:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereGround:{value:new Float32Array([0,0,0]),type:"vec3<f32>"},uHemisphereUp:{value:new Float32Array([0,1,0]),type:"vec3<f32>"},...r,uLightData:{value:e,type:"vec4<f32>",size:128},uShadowData:{value:t,type:"vec4<f32>",size:6*i.Ou}},{isStatic:!0,ubo:!0})}},21657(e,t,r){r.d(t,{Fm:()=>s,G0:()=>n,Wq:()=>i});let i=Math.ceil(36),s=Math.ceil(8),a=new Float32Array(108);function o(e,t,r,i){for(let s=0;s<r;s++){let o=2*s/(r-1)-1,n=e[t]-o*e[3],l=e[t+4]-o*e[7],h=e[t+8]-o*e[11],u=1/Math.sqrt(n*n+l*l+h*h),d=i+4*s;a[d]=n*u,a[d+1]=l*u,a[d+2]=h*u,a[d+3]=(e[t+12]-o*e[15])*u}}var n=class{masks=new Int32Array(144).fill(-1);depthMasks=new Int32Array(32).fill(-1);depthPlane=new Float32Array(4);tileTransform=new Float32Array(4);_session=null;prepare(e,t,r){if(this._session===e)return!1;this._session=e;let i=e.view3d._lightDataList;return!function(e,t,r,i,s,n,l){let h=i.elements,u=s.elements,d=Math.hypot(u[2],u[6],u[10]),c=0,f=0,p=1/0,m=-1/0;e.fill(0),o(h,0,17,0),o(h,1,10,68);let _=Math.sqrt(h[3]*h[3]+h[7]*h[7]+h[11]*h[11]);for(let i=0;i<r;i++){let r=16*i,s=1<<i,o=Math.sqrt(t[r+7]);if(0===t[r+3]||o<=0||!Number.isFinite(o)){c|=s;continue}let n=t[r],l=t[r+1],g=t[r+2];if(h[3]*n+h[7]*l+h[11]*g+h[15]<=-o*_)continue;let x=0,y=15;for(let e=0;e<=16;e++){let t=4*e,r=a[t]*n+a[t+1]*l+a[t+2]*g+a[t+3];r>=o?x=Math.max(x,e):r<=-o&&(y=Math.min(y,e-1))}if(x>y)continue;let v=0,b=8;for(let e=0;e<=9;e++){let t=68+4*e,r=a[t]*n+a[t+1]*l+a[t+2]*g+a[t+3];r>=o?v=Math.max(v,e):r<=-o&&(b=Math.min(b,e-1))}if(v>b)continue;f|=s;let w=-(u[2]*n+u[6]*l+u[10]*g+u[14]),T=o*d;p=Math.min(p,w-T),m=Math.max(m,w+T);for(let t=v;t<=b;t++){let r=16*t;for(let t=x;t<=y;t++)e[r+t]|=s}}if(0!==c)for(let t=0;t<144;t++)e[t]|=c;if(n.fill(c),l.fill(0),0===f)return;_>0&&(p=Math.max(p,0));let g=32/Math.max(m-p,1e-6);l[0]=-u[2]*g,l[1]=-u[6]*g,l[2]=-u[10]*g,l[3]=(-u[14]-p)*g;let x=Math.hypot(l[0],l[1],l[2]);for(let e=0;e<r;e++){let r=1<<e;if((f&r)==0)continue;let i=16*e,s=t[i]*l[0],a=t[i+1]*l[1],o=t[i+2]*l[2],h=s+a+o+l[3],u=Math.sqrt(t[i+7])*x,d=(Math.abs(s)+Math.abs(a)+Math.abs(o)+Math.abs(l[3])+u)*1e-6+1e-5,c=Math.max(0,Math.min(31,Math.floor(h-u-d))),p=Math.max(0,Math.min(31,Math.floor(h+u+d)));for(let e=c;e<=p;e++)n[e]|=r}}(this.masks,i.data,i.count,t,r,this.depthMasks,this.depthPlane),!0}setViewport(e,t){let r=this.tileTransform,i=Math.fround(16/e.width),s=Math.fround((t?-9:9)/e.height),a=Math.fround(-e.x*i),o=Math.fround(9*!!t-e.y*s);return(r[0]!==i||r[1]!==s||r[2]!==a||r[3]!==o)&&(r[0]=i,r[1]=s,r[2]=a,r[3]=o,!0)}invalidate(){this._session=null}destroy(){this.invalidate()}}},44847(e,t,r){r.d(t,{E:()=>s});var i=r(54537),s=class{_managedViews;constructor(e){this._managedViews=new i.sJ4({renderer:e,type:"renderable",name:"view3d"}),i.Wny.on("evict",this._releasePooledTextures)}_releasePooledTextures=()=>{let e=this._managedViews.items;for(let t in e){let r=e[t];r&&r._releasePooledTextures()}};track(e){this._managedViews.add(e)}destroy(){i.Wny.off("evict",this._releasePooledTextures);let e=Object.values(this._managedViews.items);for(let t=0;t<e.length;t++)e[t]?.unload();this._managedViews.destroy()}}},5068(e,t,r){r.d(t,{t:()=>i});var i=class{shader;mergedShader=null;state;topology;batchKey=0;lastGeometryUid=-1;lastMaterialUid=-1;constructor(e,t,r){this.shader=e,this.state=t,this.topology=r}isStaleFor(e){return this.shader._destroyed||this.lastGeometryUid!==e.geometry.uid||this.lastMaterialUid!==e.material.uid}claimBuiltFrom(e){this.lastGeometryUid=e.geometry.uid,this.lastMaterialUid=e.material.uid}}},81759(e,t,r){r.d(t,{K:()=>h,Q:()=>l});var i=r(21078),s=r(54537);let a=new Map,o=0,n=[];function l(e,t){let r=Math.floor(e/0x100000000),a=n[r];return a||(a=n[r]=new s.UwB,(0,i.h)(a,t)),a}function h(e,t,r){let i,s=(void 0===(i=a.get(r))&&(i=o++,a.set(r,i)),i),n=e.geometry,l=n._geometryAtlasAllocation;t.batchKey=0x100000000*s+n.uid;let h=l?l.atlas.uid<<8|255&n.uid:n.uid,u=e.material;e._sortKey=0x10000000000000*("mask"===u.alphaMode)+0x1000000000000*Math.min(u._textures.length,15)+(255&s)*0x10000000000+(65535&u._textureSetId)*0x1000000+(4095&h)*4096+(4095&u.uid)}},12385(e,t,r){r.d(t,{c:()=>s});var i=r(54537),s=class extends i.hpe{constructor(e){super(e),this.autoGarbageCollect=!1}}},53443(e,t,r){r.d(t,{E:()=>n});var i=r(62933),s=r(12385),a=r(13009),o=r(54537),n=class{data;u32Data;fl64Data;_buffer=null;_bufferResource=null;_retiredBuffers=[];_retiredTextures=[];_texture=null;_textureSource=null;_indexKey;_freeList;_freeCount=0;_stride=0;_count=0;_copier;_dirty;bufferVersion=0;constructor(e){this._stride=e.stride,this._indexKey=e.indexKey;let t=e.initialSize||100,r=t*this._stride;r%4!=0&&(r+=4-r%4),r=(0,i.Lm)(r),this.data=new Float32Array(r),this.u32Data=new Uint32Array(this.data.buffer),this.fl64Data=new Float64Array(this.data.buffer),this._freeList=new Uint32Array(t),this._dirty=new a.Wo(Math.floor(r/this._stride),4*this._stride),this._copier=e.copier}get buffer(){return this._buffer??=new s.c({data:this.data,usage:o.Sdw.STORAGE|o.Sdw.COPY_DST|o.Sdw.COPY_SRC,label:"RenderDataBuffer"})}get bufferResource(){return this._bufferResource??=new o.dZd({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}_initTexture(){return this._stride%4!=0&&(0,o.R8M)(`DataStoreBuffer: Stride (${this._stride}) is not a multiple of 4. This will cause issues when sampling from a texture.`),this._textureSource=(0,i.d8)(this.data),this._texture=new o.gPd({source:this._textureSource}),this._texture}update(){let e=this._dirty;if(e.isEmpty)return;let t=this._buffer,r=this._textureSource;if(t||r){e.planRuns();let s=this._stride,o=e.runs;if(t)if(e.runsBeatSpan(8192,a.pA))for(let r=0;r<e.runCount;r++){let e=o[2*r]*s;t.update((o[2*r+1]*s-e)*4,4*e)}else{let r=e.min*s;t.update(((e.max+1)*s-r)*4,4*r)}if(r)if(e.runsBeatSpan(16384))for(let t=0;t<e.runCount;t++)(0,i.J9)(r,o[2*t]*s,o[2*t+1]*s);else(0,i.J9)(r,e.min*s,(e.max+1)*s)}e.clear()}allocate(e){let t=e[this._indexKey];return t<0&&(this._freeCount>0?t=this._freeList[--this._freeCount]:((this._count+1)*this._stride>this.data.length&&this._expand(),t=this._count++),e[this._indexKey]=t),t}set(e){if(!this.data)return -1;let t=this.allocate(e),r=this._stride;return this._copier(e,this.data,this.u32Data,this.fl64Data,t*r,r),this._dirty.mark(t),t}remove(e){let t=e[this._indexKey];if(!(t<0)&&(e[this._indexKey]=-1,this.data)){if(this._freeCount>=this._freeList.length){let e=new Uint32Array(2*this._freeList.length);e.set(this._freeList),this._freeList=e}this._freeList[this._freeCount++]=t}}get stride(){return this._stride}allocateBlock(e,t){let r=e[this._indexKey];if(r>=0)return r;let i=(this._count+t)*this._stride;i>this.data.length&&this._expand(i);let s=this._count;return e[this._indexKey]=s,this._count+=t,this._dirty.markRange(s,s+t-1),s}markDirty(e){this._dirty.mark(e)}markDirtyRange(e,t){this._dirty.markRange(e,t)}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0;for(let e=0;e<this._retiredTextures.length;e++)this._retiredTextures[e].destroy(!0);this._retiredTextures.length=0}unload(){this.data&&(this._buffer?.unload(),this._textureSource?.unload(),this._freeRetired())}destroy(){this.data&&(this._bufferResource?.destroy(!1),this._buffer?.destroy(),this._freeRetired(),this._texture?.destroy(!0),this.data=null,this.u32Data=null,this.fl64Data=null,this._buffer=null,this._bufferResource=null,this._freeList=null,this._texture=null,this._textureSource=null)}_expand(e){let t=2*this.data.length;void 0!==e&&t<e&&(t=e);let r=new Float32Array(t=(0,i.Lm)(t));r.set(this.data),this.data=r,this.u32Data=new Uint32Array(this.data.buffer),this.fl64Data=new Float64Array(this.data.buffer);let s=t/this._stride;if(this._dirty.grow(Math.floor(s)),s>this._freeList.length){let e=new Uint32Array(s);e.set(this._freeList),this._freeList=e}this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null,this._bufferResource=null),this._texture&&(this._retiredTextures.push(this._texture),this._texture=null,this._textureSource=null),this.bufferVersion++}}},13009(e,t,r){r.d(t,{Wo:()=>o,pA:()=>a,qW:()=>s});var i=r(54537);let s=8192,a=4194304*!!i.FrL.android.device;var o=class{min=1/0;max=-1/0;spanOnly=!1;runs=new Int32Array(64);runCount=0;runSlots=0;_bits;_slotBytes=0;_hasBits=!1;_collected=!1;constructor(e,t){this._bits=new Uint32Array(e+31>>>5),this._slotBytes=t}get isEmpty(){return this.min>this.max}mark(e){if(e<this.min&&(this.min=e),e>this.max&&(this.max=e),this.spanOnly)return;let t=e>>>5,r=1<<(31&e),i=this._bits[t];(i&r)==0&&(this._bits[t]=i|r,this._hasBits=!0)}markRange(e,t){e<this.min&&(this.min=e),t>this.max&&(this.max=t),this.spanOnly=!0}planRuns(){if(this.spanOnly||this.isEmpty)return;let e=this._bits,t=Math.floor(768/this._slotBytes),r=this.max>>>5,i=0,s=0,a=-1,o=-1;for(let n=this.min>>>5;n<=r;n++){let r=e[n];if(0!==r){if(e[n]=0,0xffffffff===r){let e=n<<5;o>=0&&e-o<=t||(o>=0&&(s+=o-a,i=this._pushRun(i,a,o)),a=e),o=e+32;continue}for(;0!==r;){let e=n<<5|31-Math.clz32(r&-r);r&=r-1,o>=0&&e-o<=t||(o>=0&&(s+=o-a,i=this._pushRun(i,a,o)),a=e),o=e+1}}}o>=0&&(s+=o-a,i=this._pushRun(i,a,o)),this.runCount=i,this.runSlots=s,this._collected=!0}runsBeatSpan(e,t=0){if(this.spanOnly||!this._collected)return!1;let r=this._slotBytes,i=(this.max-this.min+1)*r;return i>=t&&this.runCount*e+this.runSlots*r<i}clear(){!this._collected&&this._hasBits&&this._bits.fill(0,this.min>>>5,(this.max>>>5)+1),this.min=1/0,this.max=-1/0,this.spanOnly=!1,this.runCount=0,this.runSlots=0,this._hasBits=!1,this._collected=!1}grow(e){let t=e+31>>>5;if(t<=this._bits.length)return;let r=new Uint32Array(t);r.set(this._bits),this._bits=r}_pushRun(e,t,r){if(2*e+2>this.runs.length){let e=new Int32Array(2*this.runs.length);e.set(this.runs),this.runs=e}return this.runs[2*e]=t,this.runs[2*e+1]=r,e+1}}},45743(e,t,r){r.d(t,{e:()=>i});var i=class{drawCalls;constructor(e=128){this.drawCalls=new Uint32Array(5*e)}ensureCapacity(e){if(this.drawCalls.length<5*e){let t=new Uint32Array(5*Math.ceil(1.5*e));t.set(this.drawCalls),this.drawCalls=t}return this.drawCalls}destroy(){this.drawCalls=null}}},17891(e,t,r){r.d(t,{W:()=>a});var i=r(53443);let s=(e,t,r,i,s)=>{let{center:a,radius:o}=e.boundsSphere;if(t[s]=a.x,t[s+1]=a.y,t[s+2]=a.z,t[s+3]=e.dynamic?-1:o+e._morphBoundsExpansion,e.morphTargetCount>0){let t=e._morphDeltaBase>=0;r[s+4]=t?e._morphDeltaBase:0,r[s+5]=t?e.morphTargetCount:0,r[s+6]=t&&e._geometryAtlasAllocation?.baseVertex||0}};var a=class extends i.E{constructor(e=100){super({stride:8,indexKey:"_geometryDataIndex",copier:s,initialSize:e})}set(e){let t=e._geometryDataStore;return t!==this&&(t?.remove(e),e._geometryDataStore=this),super.set(e)}}},21293(e,t,r){r.d(t,{r:()=>l});var i=r(62933),s=r(12385),a=r(13009),o=r(54537),n=class extends o.dZd{constructor(e){super(e),this.buffer.off("change",this.onBufferChange,this)}},l=class{data;_retiredTextures=[];texture;_buffer=null;_retiredBuffers=[];_alignment=0;_texelsPerUnit=0;_end=0;_freePlaces=new Map;_dirtyQueue=[];_dirtyCount=0;_ranges=new Uint32Array(64);bufferVersion=0;_bufferCallBytes=0;constructor(e){let{alignment:t,rendererType:r}=e;if(!(t>0))throw Error(`MaterialDataStoreBuffer: renderer.limits.minUniformBufferOffsetAlignment is ${t}; the limits system fills it in after the renderer has a context`);this._alignment=function(e){let t=e,r=16;for(;r;)[t,r]=[r,t%r];return e/t*16}(t),this._texelsPerUnit=this._alignment/16,this._bufferCallBytes=r===o.W3c.WEBGPU?a.qW:1/0,this.data=new Float32Array((0,i.Lm)(4096)),this.texture=new o.gPd({source:(0,i.d8)(this.data)})}enqueueDirty(e){this.data&&!e._storeQueued&&(e._storeQueued=!0,this._dirtyQueue[this._dirtyCount++]=e)}register(e){let t=e._uploadQueue;(t!==this||-1===e._materialIndex)&&(t&&t!==this&&t.remove(e),e._uploadQueue=this,e._storeQueued=!1,this._allocate(e),this.enqueueDirty(e))}remove(e){let t=e._materialIndex;if(t<0||(e._materialIndex=-1,!this.data))return;let r=this._units(e),i=this._freePlaces.get(r);i||this._freePlaces.set(r,i=[]),i.push(t)}uniformResource(e){let t=this._buffer??=new s.c({data:this.data,usage:o.Sdw.UNIFORM|o.Sdw.COPY_DST,label:"MaterialStore"}),r=16*e._materialIndex,i=e._uniformResource;return i&&i.buffer===t&&i.offset===r?i:(i?.destroy(!1),i=e._uniformResource=new n({buffer:t,offset:r,size:this._units(e)*this._alignment}))}update(){let e=this._dirtyQueue,t=this._dirtyCount;if(0===t)return;this._dirtyCount=0;let r=this.data,s=0,o=0,n=1/0,l=-1/0;for(let i=0;i<t;i++){let t=e[i];if(e[i]=null,t._uploadQueue!==this)continue;t._storeQueued=!1;let a=t.data._f32,h=4*t._materialIndex,u=h+a.length;if(r.set(a,h),2*s+2>this._ranges.length){let e=new Uint32Array(2*this._ranges.length);e.set(this._ranges),this._ranges=e}this._ranges[2*s]=h,this._ranges[2*s+1]=u,s++,o+=u-h,h<n&&(n=h),u>l&&(l=u)}if(0===s)return;let h=this._ranges,u=(l-n)*4,d=4*o,c=this.texture.source;if(16384*s+d<u)for(let e=0;e<s;e++)(0,i.J9)(c,h[2*e],h[2*e+1]);else(0,i.J9)(c,n,l);let f=this._buffer;if(f)if(u>=a.pA&&s*this._bufferCallBytes+d<u)for(let e=0;e<s;e++){let t=h[2*e];f.update((h[2*e+1]-t)*4,4*t)}else f.update(u,4*n)}destroy(){if(this.data){this._buffer?.destroy();for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();for(let e=0;e<this._retiredTextures.length;e++)this._retiredTextures[e].destroy(!0);this.texture.destroy(!0),this.data=null,this._buffer=null,this._retiredBuffers=null,this._retiredTextures=null,this.texture=null,this._freePlaces=null,this._dirtyQueue=null,this._dirtyCount=0,this._ranges=null}}_units(e){return Math.ceil(e.data._f32.byteLength/this._alignment)}_allocate(e){if(e._materialIndex>=0)return;let t=this._units(e),r=this._freePlaces.get(t)?.pop();if(void 0===r){let e=(this._end+t)*this._alignment;e>this.data.byteLength&&this._expand(e/4),r=this._end*this._texelsPerUnit,this._end+=t}e._materialIndex=r}_expand(e){let t=2*this.data.length;t<e&&(t=e);let r=new Float32Array(t=(0,i.Lm)(t));r.set(this.data),this.data=r,this._retiredTextures.push(this.texture),this.texture=new o.gPd({source:(0,i.d8)(this.data)}),this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null),this.bufferVersion++}}},87137(e,t,r){r.d(t,{E:()=>o});var i=r(62933),s=r(12385),a=r(54537),o=class{data;_buffer=null;_bufferResource=null;bufferVersion=0;_deltaCursor=0;_deltaCapacity=0;_weightCursor=0;_freeSlots=new Map;_freeDeltaBlocks=new Map;_minDirty=1/0;_maxDirty=-1/0;_retiredBuffers=[];_texture=null;_textureSource=null;constructor(e={}){this._deltaCapacity=e.deltaCapacity??4096;let t=l(this._deltaCapacity,e.weightCapacity??1024);this.data=new Float32Array(this._deltaCapacity+t)}get buffer(){return this._buffer??=new s.c({data:this.data,usage:a.Sdw.STORAGE|a.Sdw.COPY_DST|a.Sdw.COPY_SRC,label:"MorphStoreBuffer",shrinkToFit:!1})}get bufferResource(){return this._bufferResource??=new a.dZd({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}uploadDeltas(e){let t,r=e._morphStore;if(r===this)return;if(r){r.freeDeltas(e),(0,a.R8M)(`MorphStoreBuffer: geometry #${e.uid} was packed by another renderer and draws unmorphed here`);return}let i=e._morphTargets;if(!i||0===i.length)return;let s=e.hasMorphNormals,o=s?8:4,n=i.length,l=i[0].positions.length/3,h=l*n*o,u=this._freeDeltaBlocks.get(h);u&&u.length>0?t=u.pop():((t=this._deltaCursor)+h>this._deltaCapacity&&this._growArena(t+h),this._deltaCursor+=h);let d=new Float64Array(n),c=this.data;for(let e=0;e<l;e++){let r=3*e;for(let a=0;a<n;a++){let l=t+(e*n+a)*o,h=i[a].positions,u=h[r],f=h[r+1],p=h[r+2];c[l]=u,c[l+1]=f,c[l+2]=p,c[l+3]=0;let m=u*u+f*f+p*p;if(m>d[a]&&(d[a]=m),s){let e=i[a].normals;c[l+4]=e[r],c[l+5]=e[r+1],c[l+6]=e[r+2],c[l+7]=0}}}let f=0;for(let e=0;e<n;e++)f+=Math.sqrt(d[e]);e._morphBoundsExpansion=f,e._morphDeltaBase=t,e._morphDeltaFloats=h,e._morphStore=this,e._morphTargets=null,this._markDirty(t,t+h-1)}freeDeltas(e){let t=e._morphDeltaBase;if(t<0)return;let r=e._morphDeltaFloats;e._morphDeltaBase=-1,e._morphDeltaFloats=0,e._morphStore=null,this.data&&n(this._freeDeltaBlocks,r,t)}sync(e){for(let t=0;t<e.length;t++)this.uploadDeltas(e[t].geometry);let t=this._deltaCapacity;for(let r=0;r<e.length;r++){let i=e[r],s=i._morph;s._store!==this&&(s._store?.freeSlot(s),this.allocSlot(s));let a=t+s._slot;s._weightIndex!==a&&(s._weightIndex=a,i._markStoreDirty()),this.writeWeights(s)}this.update()}allocSlot(e){let t,r=1;for(;r<e.weights.length;)r<<=1;let i=this._freeSlots.get(r);i&&i.length>0?t=i.pop():(t=this._weightCursor,this._deltaCapacity+t+r>this.data.length&&this._growWeights(t+r),this._weightCursor+=r),e._slot=t,e._slotSize=r,e._store=this}freeSlot(e){let t=e._slot;if(t<0)return;let r=e._slotSize;e._slot=-1,e._slotSize=0,e._store=null,this.data&&n(this._freeSlots,r,t)}writeWeights(e){let t=e.weights,r=this.data,i=this._deltaCapacity+e._slot,s=Math.min(t.length,e._slotSize),a=!1;for(let e=0;e<s;e++){let s=t[e];r[i+e]!==s&&(r[i+e]=s,a=!0)}a&&this._markDirty(i,i+s-1)}update(){this._minDirty>this._maxDirty||(this._buffer?.update((this._maxDirty-this._minDirty+1)*4,4*this._minDirty),this._textureSource&&(0,i.J9)(this._textureSource,this._minDirty,this._maxDirty+1),this._minDirty=1/0,this._maxDirty=-1/0)}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0}destroy(){this.data&&(this._bufferResource?.destroy(!1),this._buffer?.destroy(),this._freeRetired(),this._texture?.destroy(!0),this._texture=null,this._textureSource=null,this.data=null,this._buffer=null,this._bufferResource=null)}_markDirty(e,t){e<this._minDirty&&(this._minDirty=e),t>this._maxDirty&&(this._maxDirty=t)}_growArena(e){let t=this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(t,this.data.length-this._deltaCapacity)}_growWeights(e){let t=this.data.length-this._deltaCapacity;for(;t<e;)t*=2;this._reallocate(this._deltaCapacity,t)}_reallocate(e,t){t=l(e,t);let r=new Float32Array(e+t);if(r.set(this.data.subarray(0,this._deltaCursor),0),r.set(this.data.subarray(this._deltaCapacity,this._deltaCapacity+this._weightCursor),e),this.data=r,this._deltaCapacity=e,this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null,this._bufferResource=null),this.bufferVersion++,this._textureSource){let{width:e,height:t}=(0,i.VK)(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==e||this._textureSource.height!==t)&&this._textureSource.resize(e,t),this._textureSource.update()}}_initTexture(){let{width:e,height:t}=(0,i.VK)(this.data.length);return this._textureSource=new a.PPd({resource:this.data,width:e,height:t,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"}),this._texture=new a.gPd({source:this._textureSource}),this._texture}};function n(e,t,r){let i=e.get(t);i||(i=[],e.set(t,i)),i.push(r)}function l(e,t){let r=e+t;return t+((0,i.Lm)(r)-r)}},37821(e,t,r){r.d(t,{k:()=>a});var i=r(12385),s=r(54537),a=class{bufferResource;_buffer;data;constructor(e,t=128){this.data=new Uint32Array(t),this._buffer=new i.c({data:this.data,usage:s.Sdw.STORAGE|s.Sdw.COPY_DST|s.Sdw.COPY_SRC,label:e,shrinkToFit:!1}),this.bufferResource=new s.dZd({buffer:this._buffer})}get buffer(){return this._buffer}ensureSize(e){return this.data.length<e&&(this.data=new Uint32Array(Math.ceil(1.5*e)),this._buffer.data=this.data),this.data}populateIds(e){let t=e.count,r=this.ensureSize(t),i=e.indices,s=e.items;for(let e=0;e<t;e++)r[e]=s[i[e]]._storeIndex}upload(e,t=0){this._buffer.update((e-t)*4,4*t)}unload(){this._buffer?.unload()}destroy(){this._buffer&&(this.bufferResource.destroy(!1),this._buffer.destroy(),this._buffer=null,this.bufferResource=null,this.data=null)}}},62933(e,t,r){r.d(t,{J9:()=>u,Lm:()=>o,VK:()=>n,_C:()=>c,a1:()=>d,aB:()=>s,d8:()=>l,nb:()=>h});var i=r(54537);let s=4096,a=Math.log2(4096);function o(e){return e<=16384||e%16384==0?e:e+16384-e%16384}function n(e){let t=e/4,r=Math.min(t,s);return{width:r,height:Math.ceil(t/r)}}function l(e){let{width:t,height:r}=n(e.length);return new i.PPd({resource:new Uint32Array(e.buffer),width:t,height:r,format:"rgba32uint",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"})}function h(e,t,r){r-t>=4096&&(t&=-4096,r=r+4095&-4096),e.update(t,r)}function u(e,t,r){h(e,Math.floor(t/4),Math.ceil(r/4))}function d(e){return`ivec2((${e}) & 4095, (${e}) >> ${a})`}function c(e){return`vec2<i32>((${e}) & 4095, (${e}) >> ${a})`}},55830(e,t,r){let i;r.d(t,{YM:()=>u,_G:()=>l,b3:()=>a});var s=r(54537);function a(e,t){return"gpu"!==e||t?e:"cpu"}let o={},n={forward:5e4,shadow:2e4};function l(e){let t=o[e];return void 0!==t?t:(i??=s.FrL.apple.device||(0,s.nrF)())?n[e]:0}let h=new Float32Array(24);function u(e,t){let r=t[0],i=t[1],s=t[2],a=t[4],o=t[5],n=t[6],l=t[8],u=t[9],d=t[10],c=t[12],f=t[13],p=t[14];if(1===r&&1===o&&1===d&&0===i&&0===s&&0===a&&0===n&&0===l&&0===u&&0===c&&0===f&&0===p)return e;for(let t=0;t<6;t++){let m=4*t,_=e[m],g=e[m+1],x=e[m+2],y=r*_+i*g+s*x,v=a*_+o*g+n*x,b=l*_+u*g+d*x,w=1/Math.sqrt(y*y+v*v+b*b);h[m]=y*w,h[m+1]=v*w,h[m+2]=b*w,h[m+3]=(c*_+f*g+p*x+e[m+3])*w}return h}},99566(e,t,r){r.d(t,{Z:()=>i});function i(e,t,r,i,s){let a=!1;return r.lastAtlasBufferVersion!==e.bufferVersion&&(r.lastAtlasBufferVersion=e.bufferVersion,a=!0),r.lastMaterialStoreBufferVersion!==t.bufferVersion&&(r.lastMaterialStoreBufferVersion=t.bufferVersion,a=!0),r.lastMorphStoreBufferVersion!==i.bufferVersion&&(r.lastMorphStoreBufferVersion=i.bufferVersion,a=!0),s&&r.lastGeometryStoreBufferVersion!==s.bufferVersion&&(r.lastGeometryStoreBufferVersion=s.bufferVersion,a=!0),a}},41741(e,t,r){let i;r.d(t,{A:()=>a});var s=r(54537);function a(){return i??=new s.V23({attributes:{aPosition:new Float32Array([-1,-1,3,-1,-1,3])}})}s.L3G.register({clear:()=>{i?.destroy(!0),i=void 0}})},16783(e,t,r){r.r(t),r.d(t,{glslHeadersPlugin:()=>$,globalBitGl:()=>h,glslStageSlotsPlugin:()=>er,morphTargetBitGl:()=>g,shadowBitsGl:()=>T,mat2ColumnMember:()=>z,glslInterStagePlugin:()=>W,GL_STATE_KEY_RANGE:()=>eb,LightingSystemGl:()=>p,WGSL_TO_GLSL_BINDING_TYPE:()=>B,materialTextureAccessPluginGl:()=>ed,Mesh3DBatcherGl:()=>ev,compileGlslSource:()=>eu,WGSL_TO_GLSL_TYPE:()=>M,morphTargetNormalBitGl:()=>x,shadowGlobalBitGl:()=>tr,packGlBatchKey:()=>eS,generateGlslStructAccessor:()=>es,getGlobalGlData:()=>u,materialUniformAccessPluginGl:()=>ef,instanceAccessPluginGl:()=>eo,uniformBlockInstanceName:()=>k,View3DPipeGl:()=>ty,glslGroupMapPlugin:()=>U,glslPrecisionPlugin:()=>Q,skinningBitGl:()=>C,renderForwardBatchesGl:()=>tt,glslAttributesPlugin:()=>D,ShadowRenderPassGl:()=>ta,glslOverridesPlugin:()=>X,createTexturesPluginGl:()=>eM,MaterialSystemGl:()=>e7,glslFragmentOutputsPlugin:()=>G,glslBindingsPlugin:()=>O});var i=r(28960),s=r(55464),a=r(62082),o=r(74342),n=r(5774),l=r(54537);let h={name:"globalGl",structs:{Light:o.b1,ShadowData:o.ni},bindings:{global:{uGlobalLightParams:"vec4<f32>",uTime:"f32",uFogColor:"vec3<f32>",uDisplayExposure:"f32",uFogParams:"vec3<f32>",uExposure:"f32",uHemisphereSky:"vec3<f32>",uHemisphereGround:"vec3<f32>",uHemisphereUp:"vec3<f32>",uEnvironmentMaxMipLevel:"f32",uLightData:"array<vec4<f32>, 128>",uShadowData:`array<vec4<f32>, ${6*s.Ou}>`,uEnvironmentTexture:"texture_cube<f32>",uBrdfLutTexture:"texture_2d<f32>",uMaterialStorage:"texture_2d<u32>",uShadowMap:"texture_depth_2d_array",uBonePitTexture:"texture_2d<f32>",uOpaqueDepthTexture:"texture_2d<f32>",uOpaqueColorTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}},gl:{header:`
const float LIGHT_DIRECTIONAL = 0.0;
const float LIGHT_POINT = 1.0;
const float LIGHT_SPOT = 2.0;
`}};function u(e,t){let r=e._gpuData[t.uid];if(!r){let s=(0,a.V)(e._lightDataList.data,e._shadowDataList.data,{uEnvironmentMaxMipLevel:{value:0,type:"f32"}}),o=new l.TX4({global:s,uEnvironmentTexture:i.pC.source,uBrdfLutTexture:l.gPd.EMPTY.source,uMaterialStorage:i.Nj.source,uShadowMap:i.G_.source,uBonePitTexture:l.gPd.EMPTY.source,uOpaqueDepthTexture:l.gPd.EMPTY.source,uOpaqueColorTexture:l.gPd.EMPTY.source,uMorphTexture:l.gPd.EMPTY.source,uGeometryTexture:i.Nj.source,uMeshStoreTexture:i.Nj.source,uRenderInstanceTexture:i.Nj.source,batchTransform:t.material3d.batcher.batchTransform,uInstanceStoreTexture:i.Nj.source});r=new n.g(s,o,{opaqueColor:{group:o,slot:"uOpaqueColorTexture"},opaqueDepth:{group:o,slot:"uOpaqueDepthTexture"},shadowMap:{group:o,slot:"uShadowMap"}}),e._gpuData[t.uid]=r}return r}var d=r(1104),c=r(711),f=r(55447),p=class{static extension={type:[l.AgS.WebGLSystem],name:"lighting3d"};_renderer;constructor(e){this._renderer=e}update(e,t){let r=e.passByBit[d.J.SHADOW];r?.beginFrame(e);let i=u(e,this._renderer).globalUniformGroup.uniforms,s=i.uGlobalLightParams;s[0]=0,s[1]=0,s[2]=0;let a=e.environment;null===a||a instanceof l.b4q||(0,f.G)(a,i.uHemisphereSky,i.uHemisphereGround,i.uHemisphereUp);let o=e._lightDataList;o.reset();for(let i=0;i<t.length;i++){let a=t[i];if(a._worldVisible){if("ambient"===a.type){(0,c.QF)(s,0,a.color,a.intensity);continue}o.count>=32||(r?.prepareShadow(a,e),o.add(a))}}s[3]=o.count}},m=r(62933);function _(e){let t=e?" * 2":"";return{name:e?"morphTargetNormalGl":"morphTargetGl",bindings:{global:{uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}},gl:{vertex:{header:`
        vec4 fetchMorphTexel(int texel) {
          return texelFetch(uMorphTexture, ${(0,m.a1)("texel")}, 0);
        }

        float fetchMorphWeight(int index) {
          return fetchMorphTexel(index >> 2)[index & 3];
        }

        uvec4 fetchGeometryMorphFacts(int geometryIndex) {
          int texel = geometryIndex * 2 + 1;
          return texelFetch(uGeometryTexture, ${(0,m.a1)("texel")}, 0);
        }
      `,input:`
        if (morphData.x != 0.0) {
          uvec4 morphFacts = fetchGeometryMorphFacts(int(morphData.y));
          int morphTargetCount = int(morphFacts.y);
          int vidLocal = gl_VertexID - int(morphFacts.z);
          int morphDeltaTexel = int(morphFacts.x) / 4 + vidLocal * morphTargetCount${t};
          int morphWeightIndex = int(morphData.x);
          vec3 morphedPosition = position.xyz;${e?"\n          vec3 morphedNormal = normal;":""}
          for (int morphIndex = 0; morphIndex < morphTargetCount; morphIndex++) {
            float morphWeight = fetchMorphWeight(morphWeightIndex + morphIndex);
            if (morphWeight != 0.0) {
              morphedPosition += fetchMorphTexel(morphDeltaTexel + morphIndex${t}).xyz * morphWeight;${e?"\n              morphedNormal += fetchMorphTexel(morphDeltaTexel + morphIndex * 2 + 1).xyz * morphWeight;":""}
            }
          }
          position = vec4(morphedPosition, position.w);${e?"\n          normal = normalize(morphedNormal);":""}
        }
      `}}}}let g=_(!1),x=_(!0);var y=r(18356),v=r(84897);function b(e){return Number.isInteger(e)?`${e}.0`:`${e}`}function w(e){return{name:`shadowGl:${e}`,structs:{ShadowData:o.ni},bindings:{global:{uShadowMap:"texture_depth_2d_array",uShadowData:`array<vec4<f32>, ${6*s.Ou}>`}},gl:{header:`

    ShadowData getShadowData(int index) {
      int offset = index * 6;
      ShadowData sd;
      sd.lightSpaceMatrix = mat4(
        uShadowData[offset + 0],
        uShadowData[offset + 1],
        uShadowData[offset + 2],
        uShadowData[offset + 3]
      );
      sd.shadowParams = uShadowData[offset + 4];
      sd.cascadeSplits = uShadowData[offset + 5];
      return sd;
    }

    float sampleShadowLayer(int layer, mat4 lightSpaceMatrix, vec3 worldPos, vec3 normal, vec3 params, float NdotL) {
      vec3 biasedPos = worldPos + normal * (params.y * (1.0 - NdotL));
      vec4 lightSpacePos = lightSpaceMatrix * vec4(biasedPos, 1.0);
      vec3 projPos = lightSpacePos.xyz / lightSpacePos.w;

      vec2 uv = projPos.xy * 0.5 + 0.5;
      float depth = projPos.z * 0.5 + 0.5;

      vec3 uvd = vec3(uv, depth);
      if (any(notEqual(clamp(uvd, 0.0, 1.0), uvd))) {
        return 1.0;
      }

${function(e){let t=e.some(([e,t])=>0!==e||0!==t),r=([e,t])=>0===e&&0===t?"uv":`uv + vec2(${b(e)}, ${b(t)}) * texelSize`,i=["      float currentDepth = depth - params.x;"];if(t&&i.push("      float texelSize = 1.0 / params.z;"),i.push("      float fl = float(layer);",""),1===e.length)i.push(`      return texture(uShadowMap, vec4(${r(e[0])}, fl, currentDepth));`);else{let t=e.map(e=>`        texture(uShadowMap, vec4(${r(e)}, fl, currentDepth))`).join(" +\n");i.push(`      float shadow =
${t};`,"",`      return shadow / ${b(e.length)};`)}return i.join("\n")}(v.u[e])}
    }

    float calculateShadow(
      Light light,
      vec3 worldPos,
      vec3 normal,
      float NdotL
    ) {
      int baseIndex = int(light.shadowDataIndex);

      if (baseIndex == -1) {
        return 1.0;
      }

      ShadowData base = getShadowData(baseIndex);
      int last = int(base.shadowParams.w) - 1;

      if (last < 1) {
        return sampleShadowLayer(baseIndex, base.lightSpaceMatrix, worldPos, normal, base.shadowParams.xyz, NdotL);
      }

      float viewDepth = -(uViewMatrix * vec4(worldPos, 1.0)).z;
      vec3 splits = base.cascadeSplits.xyz;

      vec3 crossed = step(splits, vec3(viewDepth));
      int cascadeIndex = int(min(dot(crossed, vec3(1.0)), float(last)));

      int idx = baseIndex + cascadeIndex;
      ShadowData sd = getShadowData(idx);
      float shadow = sampleShadowLayer(idx, sd.lightSpaceMatrix, worldPos, normal, sd.shadowParams.xyz, NdotL);

      if (cascadeIndex == last) {
        return shadow;
      }

      vec3 hot = vec3(float(cascadeIndex == 0), float(cascadeIndex == 1), float(cascadeIndex == 2));
      float splitFar = dot(splits, hot);
      float splitNear = dot(splits, vec3(hot.y, hot.z, 0.0));

      float band = max((splitFar - splitNear) * ${b(y.M1)}, 1e-4);
      float blend = clamp((viewDepth - splitFar + band) / band, 0.0, 1.0);

      if (blend <= 0.0) {
        return shadow;
      }

      ShadowData nd = getShadowData(idx + 1);
      float next = sampleShadowLayer(idx + 1, nd.lightSpaceMatrix, worldPos, normal, nd.shadowParams.xyz, NdotL);

      return mix(shadow, next, blend);
    }
  `}}}let T={hard:w("hard"),pcf:w("pcf"),"pcf-high":w("pcf-high")},C={name:"skinningGl",attributes:{aJoints:"uint8x4",aWeights:"float32x4"},bindings:{global:{uBonePitTexture:"texture_2d<f32>"}},gl:{vertex:{header:`
        void getBoneRows(uint jointIndex, uint bonePitIndex, out vec4 r0, out vec4 r1, out vec4 r2) {
          int baseTexel = int(bonePitIndex + jointIndex) * 3;

          r0 = texelFetch(uBonePitTexture, ${(0,m.a1)("baseTexel")}, 0);
          r1 = texelFetch(uBonePitTexture, ${(0,m.a1)("baseTexel + 1")}, 0);
          r2 = texelFetch(uBonePitTexture, ${(0,m.a1)("baseTexel + 2")}, 0);
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

        position = vec4(dot(skinRow0, position), dot(skinRow1, position), dot(skinRow2, position), position.w);
        normal = vec3(dot(skinRow0.xyz, normal), dot(skinRow1.xyz, normal), dot(skinRow2.xyz, normal));
        tangent = vec3(dot(skinRow0.xyz, tangent), dot(skinRow1.xyz, tangent), dot(skinRow2.xyz, tangent));
      `}}},S={float32:"float",float32x2:"vec2",float32x3:"vec3",float32x4:"vec4",sint32:"int",sint32x2:"ivec2",sint32x3:"ivec3",sint32x4:"ivec4",uint32:"uint",uint32x2:"uvec2",uint32x3:"uvec3",uint32x4:"uvec4",float16x2:"vec2",float16x4:"vec4",unorm8x2:"vec2",unorm8x4:"vec4",snorm8x2:"vec2",snorm8x4:"vec4",uint8x2:"uvec2",uint8x4:"uvec4",sint8x2:"ivec2",sint8x4:"ivec4",unorm16x2:"vec2",unorm16x4:"vec4",snorm16x2:"vec2",snorm16x4:"vec4",uint16x2:"uvec2",uint16x4:"uvec4",sint16x2:"ivec2",sint16x4:"ivec4"},D={collectData(e){if("vertex"===e.stage){let t=e.data.glsl??={};t.attributes??=function(e,t={}){let{useLocations:r=!0}=t,i=new Map;for(let t of e)if(t.attributes)for(let[e,r]of Object.entries(t.attributes))if(i.has(e)){var s;i.get(e)!==r&&(s=i.get(e),(0,l.R8M)(`[compileAttributesGlsl] Attribute "${e}" redefined with different format: "${s}" \u{2192} "${r}". Keeping original.`))}else i.set(e,r);let a=[],o=0;for(let[e,t]of i){let i=function(e){let t=S[e];return t||((0,l.R8M)(`[compileAttributesGlsl] Unknown vertex format: "${e}"`),"vec4")}(t);r?a.push(`layout(location = ${o++}) in ${i} ${e};`):a.push(`in ${i} ${e};`)}return a.join("\n")}(e.bits,{useLocations:e.glslOptions?.useLocations})}},injectCode:e=>"vertex"===e.stage?{header:e.data.glsl.attributes}:{}},M={f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4"},B={...M,bool:"bool","mat2x2<f32>":"mat2","mat3x3<f32>":"mat3","mat4x4<f32>":"mat4","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","texture_2d<f32>":"sampler2D","texture_2d<u32>":"usampler2D","texture_2d<i32>":"isampler2D","texture_2d_array<f32>":"sampler2DArray","texture_3d<f32>":"sampler3D","texture_cube<f32>":"samplerCube",texture_depth_2d:"sampler2DShadow",texture_depth_2d_array:"sampler2DArrayShadow",texture_depth_cube:"samplerCubeShadow",texture_depth_cube_array:"samplerCubeArrayShadow",sampler:"",sampler_comparison:""};var I=r(67882),P=r(68246);function A(e){let t=e.match(/^array<(.+),\s*(\d+)>$/);return t?{baseType:t[1],size:t[2]}:null}function F(e){let t=A(e);if(t){let e=B[t.baseType]??t.baseType;return e?{glslType:e,arraySize:t.size}:null}let r=B[e];return void 0!==r?r||null:e}let R=new Set(["sampler2D","usampler2D","isampler2D","sampler2DArray","sampler3D","samplerCube","sampler2DShadow","sampler2DArrayShadow","samplerCubeShadow","samplerCubeArrayShadow"]);function k(e){return`u${(0,P.ZH)(e)}`}function z(e,t){return`${e}_${t}`}function V(e,t,r){(0,l.R8M)(`[collectBindingsGlsl] Binding "${e}" redefined with different type: "${r}" \u{2192} "${t}". Keeping original.`)}function L(e,t){return t.arraySize?`${t.glslType} ${e}[${t.arraySize}]`:`${t.glslType} ${e}`}let O={collectData(e){let t=e.data.glsl??={};void 0===t.bindingGroups&&(t.bindingGroups=function(e,t){let r=(0,I.a)(t),i=Object.create(null);for(let{name:e}of r)i[e]={uniformGroups:Object.create(null),resources:Object.create(null),uniformBuffers:Object.create(null)};let s=Object.create(null);for(let t of e)if(t.structs)for(let[e,r]of Object.entries(t.structs))e in s||(s[e]=r);for(let t of e)if(t.bindings)for(let[e,r]of Object.entries(t.bindings)){if(!r)continue;let a=(0,P.ZH)(e),o=e in i;for(let{name:n,spec:h,uniformGroup:u}of(0,P.vu)(r,e)){let r=(0,P.Ac)(h);if((0,P.yp)(r))continue;if((0,P.NI)(r)){if(!o)continue;let a=(0,P.wE)(r);if(!a){(0,l.R8M)(`[collectBindingsGlsl] Bit "${t.name}" binding "${n}" has invalid uniform buffer type: "${r}". Expected format: uniform<StructName>`);continue}let h=i[e].uniformBuffers;n in h?h[n]!==a&&V(n,a,h[n]):(h[n]=a,s[a]??={});continue}let d=F(r);if(!d)continue;let c="object"==typeof d,f=c?d.glslType:d,p=c?d.arraySize:void 0;if(R.has(f)){if(o){let t=i[e].resources;n in t?t[n]!==f&&V(n,f,t[n]):t[n]=f}}else{let t=o?u:e;if(o){let r=i[e].uniformGroups[t]??=Object.create(null);n in r||(r[n]={glslType:f,arraySize:p})}if(t!==e)continue;a in s||(s[a]={});let l=s[a];l[n]&&l[n]!==r?V(n,r,l[n]):l[n]=r}}}return{groups:r,bindGroups:i,structs:s}}(e.bits,e.template),e.data.structs=t.bindingGroups.structs)},injectCode(e){let t=e.data.glsl;return t.bindings??=function(e,t){let{groups:r,bindGroups:i}=e;for(let e in i){let{uniformBuffers:r}=i[e];for(let e in r){let i=r[e];if(0===Object.keys(t[i]??{}).length)throw Error(`[emitBindingsGlsl] Binding "${e}" is "uniform<${i}>", but no bit declares fields for a "${i}" struct.`)}}let s=[];for(let e in t){let r=e.charAt(0).toLowerCase()+e.slice(1);if(i[r]?.uniformGroups[r])continue;let a=t[e];for(let[t,r]of(s.push(`struct ${e} {`),Object.entries(a)))s.push(`  ${function(e){let t=B[e];return void 0!==t&&t||e}(r)} ${t};`);s.push("};")}for(let{name:e,ubo:a}of r){let r=i[e],o=r.uniformGroups[e];if(o&&a){for(let t in s.push(`layout(std140) uniform ${e} {`),o)s.push(`  ${L(t,o[t])};`);s.push("};")}else if(o)for(let e in o)s.push(`uniform ${L(e,o[e])};`);for(let e in r.resources)s.push(`uniform ${r.resources[e]} ${e};`);for(let e in r.uniformBuffers){let i=t[r.uniformBuffers[e]];for(let t in s.push(`layout(std140) uniform ${e} {`),i)s.push(...function(e,t,r){let i,s;if(s=(i=A(r))?i.baseType:r,/^mat[234]x2</.test(s)?!!i||"mat2x2<f32>"!==s:!(!i||s.startsWith("vec4")||s.startsWith("mat")))throw Error(`[emitBindingsGlsl] Field "${t}" of uniform block "${e}" is "${r}", which std140 lays out differently from WGSL. A buffer-backed block takes scalars, vectors, mat2x2<f32>, matrices of vec3 or vec4 columns, and arrays of 16-byte elements.`);if("mat2x2<f32>"===r)return[`  vec2 ${z(t,0)};`,`  vec2 ${z(t,1)};`];let a=F(r);return[`  ${L(t,"object"==typeof a?a:{glslType:a})};`]}(e,t,i[t]));s.push(`} ${k(e)};`)}for(let t in r.uniformGroups){if(t===e)continue;let i=r.uniformGroups[t];for(let e in i)s.push(`uniform ${L(e,i[e])};`)}}return s.join("\n")}(t.bindingGroups,e.data.structs),{header:t.bindings}}};var N=r(5086);function E(e){return`frag${e[0].toUpperCase()}${e.slice(1)}`}let G={collectData(e){e.templateString.includes("{{writeOutputs}}")&&(e.data.outputs=(0,N.r)(e.bits))},injectCode(e){let t=e.data.outputs;if(!t)return{};let r=e.outputLocations,i=[],s=[];for(let e in t)i.push(`${M[t[e]]}(0)`);for(let e=0;e<r.length;e++)t[r[e]]&&s.push(`${E(r[e])} = outputs.${r[e]};`);return{header:function(e,t){let r=["struct Outputs {"];for(let t in e)r.push(`  ${M[e[t]]} ${t};`);r.push("};","");for(let i=0;i<t.length;i++)e[t[i]]&&r.push(`layout(location = ${i}) out ${M[e[t[i]]]} ${E(t[i])};`);return r.join("\n")}(t,r),declareOutputs:`Outputs outputs = Outputs(${i.join(", ")});`,writeOutputs:s.join("\n")}}},U={collectData(e){e.data.groupMap||(e.data.groupMap=function(e,t){let r=Object.create(null),i=(0,I.a)(t);for(let{name:e}of i)r[e]={resources:Object.create(null),storages:Object.create(null),uniformBuffers:Object.create(null),uniformGroups:Object.create(null)};for(let t of e)if(t.bindings)for(let[e,i]of Object.entries(t.bindings)){let t=r[e];if(t)for(let{name:r,spec:s,uniformGroup:a}of(0,P.vu)(i,e)){let e=(0,P.Ac)(s);P.Rx.has(e)?t.resources[r]=!0:(0,P.yp)(e)?t.storages[r]=!0:(0,P.NI)(e)?t.uniformBuffers[r]=!0:t.uniformGroups[a]=!0}}let s={};return i.forEach(({name:e},t)=>{let i=r[e],a={},o=0;for(let t in i.uniformGroups[e]&&(a[o++]=e),i.resources)a[o++]=t;for(let e in i.storages)a[o++]=e;for(let e in i.uniformBuffers)a[o++]=e;for(let t in i.uniformGroups)t!==e&&(a[o++]=t);s[t]=a}),s}(e.bits,e.template))}},$={collectData(e){e.data.headers||(e.data.headers=e.bits.map(e=>e.gl?.header).filter(e=>!!(e&&/\S/.test(e))))},injectCode:e=>({header:e.data.headers.join("\n")})},q=new Set(["position","frontFacing","sampleIndex","sampleMask"]);function H(e){return"i32"===e||"u32"===e||e.includes("<i32>")||e.includes("<u32>")}function j(e){let t=M[e];return t||((0,l.R8M)(`[compileInterStageGlsl] Unknown inter-stage type: "${e}"`),"vec4")}let W={collectData(e){let t=e.data.glsl??={};t.interStage??=function(e,t={}){let{useLocations:r=!0}=t,i=new Map;for(let t of e)if(t.interStage){for(let[e,r]of Object.entries(t.interStage))if(!q.has(e))if(i.has(e)){var s;i.get(e)!==r&&(s=i.get(e),(0,l.R8M)(`[compileInterStageGlsl] Inter-stage variable "${e}" redefined with different type: "${s}" \u{2192} "${r}". Keeping original.`))}else i.set(e,r)}let a=[],o=0;for(let[e,t]of i){let i=j(t),s=H(t)?"flat ":"";r?a.push(`layout(location = ${o++}) ${s}out ${i} ${e};`):a.push(`${s}out ${i} ${e};`)}let n=[];for(let[e,t]of(o=0,i)){let i=j(t),s=H(t)?"flat ":"";r?n.push(`layout(location = ${o++}) ${s}in ${i} ${e};`):n.push(`${s}in ${i} ${e};`)}return{vertex:a.join("\n"),fragment:n.join("\n")}}(e.bits,{useLocations:e.glslOptions?.useLocations})},injectCode(e){let t=e.data.glsl.interStage;return{header:"vertex"===e.stage?t.vertex:t.fragment}}};var K=r(85922);let X={collectData(e){e.data.overrides=(0,K.b7)(e.bits)},injectCode(e){let t=e.glslOptions?.overrides??{};return{header:(0,K.x5)(e.data.overrides,t)}}},Y="#version 300 es",J=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp usampler2D;
precision highp isampler2D;
precision highp sampler3D;
precision highp samplerCube;
precision highp sampler2DArray;
precision highp sampler2DShadow;
precision highp samplerCubeShadow;
precision highp sampler2DArrayShadow;`,Q={preCompile(e){let{templateString:t}=e;t.includes(Y)?e.templateString=t.replace(Y,`${Y}
${J}`):(0,l.R8M)(`[compileShader] ${"vertex"===e.stage?"Vertex":"Fragment"} template has no '${Y}' line - highp precision will not be declared.`)}};var Z=r(62815),ee=r(33607);let et=/\{\{(.*?)\}\}/g,er={injectCode(e){if(!e.stage)return{};let t=(0,Z.Y)(e.bits,"gl",e.stage),r={};for(let[e,i]of Object.entries(t))r[e]=i.join("\n");let i={};for(let[e,t]of Object.entries(r))i[e]=[t];return!function(e,t,r){let i=(0,ee.m)(e),s=function(e){let t=new Set;for(let r of Object.values(e))for(let e of r)if(e)for(let r of e.matchAll(et))t.add(r[1]);return t}(t);for(let[e,a]of Object.entries(t))!a.some(e=>e&&/\S/.test(e))||i.has(e)||s.has(e)||(0,l.R8M)(`[compileShader] ${"vertex"===r?"Vertex":"Fragment"} generated code for slot {{${e}}} but template doesn't have it.`)}(e.templateString,i,e.stage),r}};var ei=r(23101);function es(e){let t=[];for(let[r,i]of(t.push(`${e.struct} ${e.name}(uint index) {`),t.push(`  int base = ${e.base};`),t.push(`  ${e.struct} m;`),(0,ei.h)(e.fields,e.read)))for(let s of(t.push(`  uvec4 t${r} = ${e.load(`base + ${r}`)};`),i))t.push(`  m.${s.name} = ${function(e,t){if("mat2x2<f32>"===e.type)return`mat2(uintBitsToFloat(${t}.xy), uintBitsToFloat(${t}.zw))`;let r=`${t}${e.swizzle}`;return"u32"===e.scalar?r:"i32"===e.scalar?`${"vec4<i32>"===e.type?"ivec4":"int"}(${r})`:`uintBitsToFloat(${r})`}(s,`t${r}`)};`);return t.push("  return m;"),t.push("}"),t.join("\n")}var ea=r(92741);let eo={collectData(e){if(!(0,ea.D3)(e.bits))return;let t=(0,ea.sU)(e.bits,"gl",e.instanceLayout,e.template);e.bits=[...e.bits,function(e){let{layout:t,loaded:r,varyings:i}=e,s={},a=["Instance instance = getInstance(renderInstance.x);"],o=["Instance instance;"];for(let e of i){let r=t.struct[e],i=(0,ea.Jg)(e),n="vec4<f32>"===r?`floatBitsToUint(instance.${e})`:"vec4<i32>"===r?`uvec4(instance.${e})`:`instance.${e}`,l="vec4<f32>"===r?`uintBitsToFloat(${i})`:"vec4<i32>"===r?`ivec4(${i})`:i;s[i]="vec4<u32>",a.push(`${i} = ${n};`),o.push(`instance.${e} = ${l};`)}return{name:`instanceAccess:${t.key}`,interStage:s,bindings:{global:{uInstanceStoreTexture:"texture_2d<u32>"}},gl:{vertex:{header:es({name:"getInstance",struct:"Instance",fields:t.struct,read:r,base:`int(index) * ${t.stride/4}`,load:e=>`texelFetch(uInstanceStoreTexture, ${(0,m.a1)(e)}, 0)`}),storeAccess:a.join("\n  ")},fragment:i.length?{storeAccess:o.join("\n  ")}:void 0}}}(t)]}};var en=r(72763),el=r(88007);function eh(e,t,r){t&&/\S/.test(t)&&!e.includes("{{header}}")&&(0,l.R8M)(`[compileShader] ${"vertex"===r?"Vertex":"Fragment"} template missing {{header}} slot - bindings, attributes, and inter-stage variables will not be injected.`)}function eu(e){let{bits:t,template:r,extraPlugins:i,instanceLayout:s,outputLocations:a=N.n,...o}=e,n=(0,el.U)(t),l=[eo,Q,U,X,O,W,G,D,$,er],h=i?[...i,...l]:l,u={bits:n,template:r,templateString:r.gl.vertex,data:{},stage:"vertex",glslOptions:o,instanceLayout:s,outputLocations:a},d=(0,en.R)(u,h);eh(r.gl.vertex,u.data.headers.join(""),"vertex");let c={bits:n,template:r,templateString:r.gl.fragment,data:u.data,stage:"fragment",glslOptions:o,instanceLayout:s,outputLocations:a},f=(0,en.R)(c,h);return eh(r.gl.fragment,c.data.headers.join(""),"fragment"),{vertex:d,fragment:f,structs:c.data.structs??{},groupMap:c.data.groupMap,bits:c.bits}}let ed={injectCode(e){let t=e.data.structs?.Material;return t?{textureGetters:es({name:"getMaterial",struct:"Material",fields:t,base:"int(index)",load:e=>`texelFetch(uMaterialStorage, ${(0,m.a1)(e)}, 0)`}),storeAccess:"Material material = getMaterial(vMaterialIndex);"}:{}}},ec=k("material"),ef={injectCode(e){let t=e.data.structs?.Material;return t?{textureGetters:function(e){let t=["Material getMaterial() {","  Material m;"];for(let r in e){let i="mat2x2<f32>"===e[r]?`mat2(${ec}.${z(r,0)}, ${ec}.${z(r,1)})`:`${ec}.${r}`;t.push(`  m.${r} = ${i};`)}return t.push("  return m;","}"),t.join("\n")}(t),storeAccess:"Material material = getMaterial();"}:{}}};var ep=r(36384),em=r(81759),e_=class{data;_source;_texture;_capacity=0;constructor(e=256){this.ensureCapacity(e)}get texture(){return this._texture}get capacity(){return this._capacity}ensureCapacity(e){if(e<=this._capacity)return;let t=Math.max(256,this._capacity);for(;t<e;)t*=2;this._capacity=t;let r=Math.min(t,m.aB),i=Math.ceil(t/r);if(this.data=new Uint32Array(r*i*1).fill(0xffffffff),!this._source){this._source=new l.PPd({resource:this.data,width:r,height:i,format:"r32uint",scaleMode:"nearest",alphaMode:"no-premultiply-alpha",label:"InstanceIndex"}),this._texture=new l.gPd({source:this._source});return}this._source.resource=this.data,(this._source.width!==r||this._source.height!==i)&&this._source.resize(r,i)}upload(e,t){e<t&&(0,m.nb)(this._source,e,t)}unload(){this._source?.unload()}destroy(){this._texture&&(this._texture.destroy(!0),this._texture=null,this._source=null,this.data=null)}},eg=r(55830);let ex={atlas:null,indexCount:void 0,firstIndex:void 0},ey=new Float32Array(24);var ev=class{batchTransform=new l.k2S({uBatchWorldMatrix:{value:new ep.k,type:"mat4x4<f32>"}},{isStatic:!0,ubo:!1});build(e){let{renderables:t,list:r,globalBindGroup:i,passBit:s,bindsMaterial:a}=e,o=t.count,n=r.commandList;if(0===o)return 0;n.clear(),this._ensureCapacity(r,o);let l=t.indices,h=t.items,u=r.glData,d=u.indexStaging,c=h[l[0]],f=c._passCache[s],p=f.shader,m=f.batchKey,_=c.geometry,g=(0,em.Q)(m,f.state),x=f.topology,y=c.material,v=_._geometryAtlasAllocation||ex,b=v.atlas?v.atlas.geometry:_,w=v.firstIndex,T=v.indexCount,C=0,S=y;a&&n.captureMaterialTextures(y),d[0]=c._storeIndex;for(let e=1;e<o;e++){f=(c=h[l[e]])._passCache[s],d[e]=c._storeIndex;let t=c.material,o=f.batchKey!==m;if(!o&&(!a||t===y))continue;if(!o&&y._textureSetId===t._textureSetId){y=t;continue}this._recordCommand(n,r.drawData,i,a?S._getMergedBindGroup():void 0,p,g,b,w,T,C,e-C,x,m,a?S._textureSetId:0,a),C=e;let u=t!==y;y=t,o&&(m=f.batchKey,_=c.geometry,p=f.shader,g=(0,em.Q)(m,f.state),x=f.topology,b=(v=_._geometryAtlasAllocation||ex).atlas?v.atlas.geometry:_,w=v.firstIndex,T=v.indexCount),S=t,a&&u&&n.captureMaterialTextures(t)}return this._recordCommand(n,r.drawData,i,a?S._getMergedBindGroup():void 0,p,g,b,w,T,C,o-C,x,m,a?S._textureSetId:0,a),n.endBuild(),u.lastVisibilityDirtyId=-1,o}draw(e,t,r,i,s){let a=t.glData.indexTexture;if(!a)return;let o=null!==i&&"off"!==r.cull;(o||t.glData.lastVisibilityDirtyId!==r._visibilityDirtyId)&&this._compact(t,r,o?i:null,a),this.batchTransform.uniforms.uBatchWorldMatrix=r.renderData.worldTransform,this.batchTransform.update();let n=e.gl,l=e.shader,h=e.geometry,u=e.state,d=t.commandList,c=d.count,f=t.drawData.drawCalls;for(let e=0;e<c;e++){let t=5*e;if(0===f[t+1]||0===f[t])continue;let r=d.commands[e];r.shader.groups[0]=r.globalBindGroup,r.shader.groups[1]=s.bindGroup,r.batchBindGroup&&(r.shader.groups[2]=r.batchBindGroup),l.bind(r.shader),h.bind(r.geometry,l._activeProgram),r.state&&u.set(r.state);let i=l._getProgramData(l._activeProgram).uniformData.uInstanceBase?.location;void 0!==i&&n.uniform1i(i,f[t+4]),h.draw(r.topology,f[t],f[t+2],f[t+1])}}_compact(e,t,r,i){let s=e.glData,a=e.commandList.count,o=e.drawData.drawCalls,n=e.view.count,l=t.storeBuffer.visible;null!==r&&t._ensureSpheres();let h=t.storeBuffer.boundingSpheres,u=s.indexStaging,d=i.data,c=null!==r?(0,eg.YM)(r.planesData,t.storeBuffer.data):null,f=c??ey,p=n,m=0;for(let e=0;e<a;e++){let t=o[5*e+4],r=e+1<a?o[(e+1)*5+4]:n,i=t;for(let e=t;e<r;e++){let t=u[e];if(0!==l[t]){if(null!==c){let e=4*t,r=h[e+3];if(r>=0){let t=h[e],i=h[e+1],s=h[e+2];if(f[0]*t+f[1]*i+f[2]*s+f[3]<-r||f[4]*t+f[5]*i+f[6]*s+f[7]<-r||f[8]*t+f[9]*i+f[10]*s+f[11]<-r||f[12]*t+f[13]*i+f[14]*s+f[15]<-r||f[16]*t+f[17]*i+f[18]*s+f[19]<-r||f[20]*t+f[21]*i+f[22]*s+f[23]<-r)continue}}d[i]!==t&&(d[i]=t,i<p&&(p=i),m=i+1),i++}}o[5*e+1]=i-t}i.upload(p,m),e.glData.lastVisibilityDirtyId=t._visibilityDirtyId}_ensureCapacity(e,t){let r=e.glData,i=r.indexTexture??=new e_(Math.max(256,t));i.ensureCapacity(t),(!r.indexStaging||r.indexStaging.length<i.data.length)&&(r.indexStaging=new Uint32Array(i.data.length))}_recordCommand(e,t,r,i,s,a,o,n,l,h,u,d,c,f,p){let m=e.next();m.geometry=o,m.shader=s,m.globalBindGroup=r,m.batchBindGroup=i,m.state=a,m.topology=d,m.batchKey=c,m.textureSetId=f,m.merged=p,e.captureGeometry(o);let _=(e.count-1)*5,g=t.ensureCapacity(e.count);g[_]=l??(o.indexCount||o.indexBuffer.data.length),g[_+1]=u,g[_+2]=n??0,g[_+3]=0,g[_+4]=h}};let eb=0x1000000,ew={"point-list":0,"line-list":1,"line-strip":2,"triangle-list":3,"triangle-strip":4},eT=new Map,eC=0;function eS(e,t,r){var i;let s;return e*eb+(((32*t.data+t._blendModeId)*8+ew[r])*256+(i=t.polygonOffset,void 0===(s=eT.get(i))&&(s=eC++,eT.set(i,s)),s))}var eD=r(71075);function eM(e){return{collectData(t){t.bits.some(e=>e.name.startsWith("materialBindings:"))||t.bits.unshift((0,eD.V)(t.bits,e))},injectCode(e){let t=0,r=[],i="fragment"===e.stage;for(let s of e.bits)if(s.textures)for(let e of s.textures){let s=`sample${e[0].toUpperCase()}${e.slice(1)}`;r.push(...function(e,t,r){let i=[`vec4 ${e}Direct(vec2 uv) {`,`  return textureLod(uMaterialTexture${t}, uv, 0.0);`,"}"];return r&&i.push(`vec4 ${e}(vec2 uv) {`,`  return texture(uMaterialTexture${t}, uv);`,"}"),i}(s,t,i)),t++}return{textureGetters:r.join("\n")}}}}var eB=r(87160),eI=r(63116),eP=r(5068),eA=r(23278),eF=r(76972),eR=r(31360),ek=r(73390),ez=r(18669),eV=r(85277),eL=r(62411),eO=r(70930),eN=r(12939),eE=r(52381);let eG=["x","y","z","w"],eU=e=>({texel:e>>2,component:eG[3&e]}),e$=eU(16),eq=eU(18),eH=eU(20),ej=eU(17);function eW(e){return{name:e?"instanceFetchMaterial":"instanceFetch",bindings:{global:{uMeshStoreTexture:"texture_2d<u32>",uRenderInstanceTexture:"texture_2d<u32>",batchTransform:{uBatchWorldMatrix:"mat4x4<f32>"}}},gl:{vertex:{header:`
      uniform int uInstanceBase;

      uvec4 fetchStoreTexel(int texel) {
        return texelFetch(uMeshStoreTexture, ${(0,m.a1)("texel")}, 0);
      }
      `,input:`
      int instanceSlot = uInstanceBase + gl_InstanceID;
      uvec4 renderInstance = texelFetch(uRenderInstanceTexture, ${(0,m.a1)("instanceSlot")}, 0);

      int storeTexel = int(renderInstance.x) * 6;

      modelMatrix = uBatchWorldMatrix * mat4(
        uintBitsToFloat(fetchStoreTexel(storeTexel)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 1)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 2)),
        uintBitsToFloat(fetchStoreTexel(storeTexel + 3)));

      uvec4 indexLanes = fetchStoreTexel(storeTexel + ${e$.texel});
      float bonePitIndex = float(indexLanes.${e$.component});
      vec2 morphData = vec2(
        float(fetchStoreTexel(storeTexel + ${eH.texel}).${eH.component}),
        float(int(indexLanes.${eq.component})));
      ${e?`vMaterialIndex = indexLanes.${ej.component};`:""}
      `}}}}let eK=eW(!1),eX=eW(!0);var eY=r(57941),eJ=r(35859),eQ=r(79377),eZ=r(54355),e0=r(89983),e1=r(54544),e3=r(30710),e2=r(85623),e4=r(32320);let e5=new eI.X({}),e6={direct:[e4.D,ef,eM("direct")],merged:[e4.D,ed,eM("merged")]},e8={name:"layout",overrideDefs:{HAS_UVS:{type:"u32",required:!0}},outputs:{color:"vec4<f32>"},interStage:{vNormal:"vec3<f32>",vUV:"vec2<f32>",vPosition:"vec3<f32>",vMaterialIndex:"u32"}},e9={bindGroups:[{name:"global",ubo:!0},"camera","batch"],gl:{vertex:`#version 300 es

{{header}}
{{textureGetters}}

void main() {
  mat4 modelMatrix;

  vec4 position;
  vec3 normal = vec3(0.0, 0.0, 1.0);
  vec3 tangent = vec3(0.0);
  vec2 uv = vec2(0.0);

  {{input}}

  {{storeAccess}}

  {{beforeTransform}}

  vec4 worldPosition = modelMatrix * position;
  mat3 modelMatrix3 = mat3(modelMatrix);

  vec3 normalScale = 1.0 / vec3(
    dot(modelMatrix3[0], modelMatrix3[0]),
    dot(modelMatrix3[1], modelMatrix3[1]),
    dot(modelMatrix3[2], modelMatrix3[2])
  );
  vec3 worldNormal = modelMatrix3 * (normal * normalScale);
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{afterTransform}}

  {{end}}

  vPosition = worldPosition.xyz;
  vNormal   = worldNormal;
  vUV       = uv;
}`,fragment:`#version 300 es

{{header}}

{{textureGetters}}

void main() {
  {{declareOutputs}}
  vec3 normal = normalize(vNormal);
  vec3 albedo = vec3(1.0);
  vec3 finalColor;
  float alpha = 1.0;

  {{storeAccess}}

  {{material}}

  finalColor = albedo;

  {{lighting}}

  finalColor *= inputExposure(uExposure, uDisplayExposure);

  {{end}}

  outputs.color = vec4(finalColor * alpha, alpha);

  {{writeOutputs}}
}`}};var e7=class{static extension={type:[l.AgS.WebGLSystem],name:"material3d"};batcher=new ev;_destroyed=!1;_renderer;_shaderCache=new Map;constructor(e){this._renderer=e}computeBatchKey(e,t){let r=e._passCache[t];return eS(r.shader.uid,r.state,r.topology)}compilePassShader(e,t){let r=eu({bits:[h,eL.p,...e],template:t,useLocations:!1});return(0,eB.y)(r.bits,t),l.Mtr.from({gl:r,groups:{},groupMap:r.groupMap})}compileIsolatedShader(e,t,r){let i=eu({bits:e,template:t,useLocations:!1});return l.Mtr.from({gl:i,groups:r,groupMap:i.groupMap})}compileShader(e,t,r,i,s=!1,a={useLocations:!1},o="direct"){let n=[],u="";(e.includeGlobal??!0)&&(n.push(h),u+=`${h.name}|`),(e.includeCamera??!0)&&(n.push(eL.p),u+=`${eL.p.name}|`),n.push(...e.bitsGl),u+=e.keyGl;let d=(0,e0.z)(t.geometry.attributes.aPosition.format);(0,eB.U)(d),n.push(d),u+=`|${d.name}`,t._morph&&(t.geometry.hasMorphNormals?(n.push(x),u+="|morphN"):(n.push(g),u+="|morph")),t.skeleton&&((0,eB.U)(C),n.push(C),u+=`|${C.name}`),r.instanceStoreBuffer&&(0,ea.D3)(n)&&(u+=`|inst:${r.instanceStoreBuffer.layout.key}`),u+=`|${o}`;let c=this._shaderCache.get(u);if(!c){let t=eu({bits:n,template:e.template,extraPlugins:i,instanceLayout:r.instanceStoreBuffer?.layout,...a,overrides:e.overrides,outputLocations:e.outputLocations});(0,eB.y)(t.bits,e.template),c={shader:l.Mtr.from({gl:t,groups:{},overrides:e.overrides,groupMap:t.groupMap}),layout:(0,eF.UV)(t.bits)},this._shaderCache.set(u,c)}return s&&((0,eF.eD)(c.layout,t.material),(0,eF.zI)(c.layout,t.material)),c.shader}ensureMaterial(e,t,r){let i=e.material;this._renderer.renderPipes.view3d.materialStoreBuffer.register(i);let s=this.compileShader(this._materialDescriptor(e,r),e,t,e6.merged,!0,{useLocations:!1},"merged"),a=i._passBit&d.J.MATERIAL_PASS_MASK,o=i._passes[a],n=o&&o.state||i.state,l=o&&o.topology||i.topology||e.geometry.topology,h=e._passCache[a];return h?(h.shader=s,h.state=n,h.topology=l,h.lastGeometryUid=-1):e._passCache[a]=new eP.t(s,n,l),s}_materialDescriptor(e,t){let r=e.geometry,s=e.material,a=s.fog?t._fogBit:null,o=t._toneMappingBit,n=!!r.attributes.aColor&&s.vertexColors,l=(0,eO.F)(s,o,!!a||n),u=s.getPrimaryDescriptor(t),c=[h,e8,eX,l];r.attributes.aNormal&&c.push(eJ.d),r.attributes.aUV&&c.push((0,e3.q)(r.attributes.aUV.format)),s.doubleSided&&c.push(eN.v),s.flatShading&&c.push(eE.j);let f=s.textures.normal;f&&f!==i.lN&&r.attributes.aUV&&c.push(r.attributes.aTangent?e1.e:eQ.x),n&&c.push(e2.$);let p=e.material.lit;"none"!==e.billboardMode&&c.push((0,eY._)(e.billboardMode,p));let m=!!r.attributes.aTangent;for(let e=0;e<u.bitsGl.length;e++){let t=u.bitsGl[e];c.push(m?(0,eR.R5)(t):t)}"opaque"===s.alphaMode&&c.push(eV.R),a&&c.push(a),l!==eO.f&&o&&c.push(s._skipsToneCurve?ez.G:o),p&&c.push(e.receiveShadow&&t._hasShadows?T[t.shadowFilter]:eZ.d,(0,ek.s)(null!==o));let _=t.passByBit[s._passBit&d.J.MATERIAL_PASS_MASK],g=(0,eA.iK)(c,_,!!u.template);return e5.update({bitsGl:c,template:u.template??e9,overrides:{HAS_UVS:+!!r.attributes.aUV,...u.overrides},outputLocations:g,includeGlobal:!1})}destroy(){if(!this._destroyed){for(let{shader:e}of(this._destroyed=!0,this._shaderCache.values()))e.destroy();this._shaderCache=null}}},te=r(68751);function tt(e){let{pipe:t,bit:r,bindsMaterial:s,session:a,alwaysRebuild:o,sortBatch:n}=e,{view3d:l}=a,h=t.renderer.material3d.batcher,u=e.camera??l.camera,d=(0,te.c)(u),c=u.cullFrustum;for(let e of(d.setViewport(a.activeViewport),l._meshBatches)){let u;if(!e.renderData._worldVisible)continue;let f=e.drawLists[r];if(!f)continue;let p=f.view;0!==p.count&&(n?(n(p,e,d.position),u=f.isDrawStale()||f.isOrderStale()):u=f.nextBuild(l._updateTick,o),u&&(f.claimDrawBuilt(),h.build({renderables:p,list:f,globalBindGroup:a.globalBindGroup,passBit:r,bindsMaterial:s})),a.globalBindGroup.setResource(e.storeBuffer.texture.source,"uMeshStoreTexture"),f.glData.indexTexture&&a.globalBindGroup.setResource(f.glData.indexTexture.texture.source,"uRenderInstanceTexture"),a.globalBindGroup.setResource(e.instanceStoreBuffer?.texture.source??i.Nj.source,"uInstanceStoreTexture"),h.draw(t.renderer,f,e,c,d))}}let tr={name:"shadowGlobalGl",bindings:{global:{uBonePitTexture:"texture_2d<f32>",uMorphTexture:"texture_2d<f32>",uGeometryTexture:"texture_2d<u32>"}}};var ti=r(86722);let ts={bindGroups:[{name:"global",ubo:!0},"camera"],gl:{vertex:`#version 300 es

{{header}}

void main() {
  mat4 modelMatrix;

  vec4 position;
  vec3 normal = vec3(0.0);
  vec3 tangent = vec3(0.0);

  {{input}}

  vec4 worldPosition = modelMatrix * position;
  gl_Position = uViewProjectionMatrix * worldPosition;

  {{end}}
}`,fragment:`#version 300 es
out vec4 fragColor;

{{header}}

void main() {
    fragColor = vec4(0.);
}`}};var ta=class extends ti.f{constructor(e){let t=(0,c.Or)();t.depthTest=!0,t.culling=!0,t.clockwiseFrontFace=!0,t.blend=!1,super({renderer:e.renderer,name:"shadow",description:"Renders shadow-casting scene geometry into each light shadow map.",bit:d.J.SHADOW,shadowMapHandle:e.shadowMapHandle,descriptor:{shaderDescriptor:{bitsGl:[tr,eK],template:ts,includeGlobal:!1},state:t}})}_applyZRangeFix=!1;render(e){let{view3d:t,lights:r}=e;if(!r.find(e=>e.canCastShadow))return;this._bindShadowSource(t,this.renderTarget.depthStencilTexture),this.pipe.renderer.colorMask.setMask(0);let i=this.pipe.renderer.material3d.batcher,a=e.globalBindGroup,o=r.some(e=>e.castShadow&&e._gpuShadowData&&e._shadowDataIndex>=0);for(let e of t._meshBatches){if(!e.renderData._worldVisible)continue;let r=e.drawLists[this.bit];if(!r)continue;let s=r.view;0!==s.count&&o&&r.nextBuild(t._updateTick)&&(r.claimDrawBuilt(),i.build({renderables:s,list:r,globalBindGroup:a,passBit:this.bit,bindsMaterial:!1}))}for(let e of r){if(!(0,s.ac)(e))continue;let r=(0,s.lP)(e);for(let s=0;s<r;s++){let r=this._cascadeSlot(e,s);if(!r.needsRender)continue;let o=r.cameraData.frustum;for(let n of(this.pipe.renderer.renderTarget.bind({target:this.renderTarget,clear:!0,layer:e._shadowDataIndex+s}),t._meshBatches)){if(!n.renderData._worldVisible)continue;let e=n.drawLists[this.bit];e&&0!==e.view.count&&(a.setResource(n.storeBuffer.texture.source,"uMeshStoreTexture"),e.glData.indexTexture&&a.setResource(e.glData.indexTexture.texture.source,"uRenderInstanceTexture"),i.draw(this.pipe.renderer,e,n,o,r.cameraData))}}this._completeShadowUpdate(e)}this.pipe.renderer.colorMask.setMask(15),e.activeTarget=null}},to=r(32032),tn=r(17891),tl=r(21293),th=r(87137),tu=r(99566),td=r(98505),tc=r(45517),tf=r(6105),tp=r(54307),tm=r(44847),t_=r(89620),tg=r(58506);let tx=new l.Q1f;var ty=class{static extension={type:[l.AgS.WebGLPipes],name:"view3d"};renderer;_brdfLutTexture;_destroyed=!1;_colorOutputDraw=null;_iblEnvironmentMap=new Map;_onEnvironmentDestroy=e=>{this._iblEnvironmentMap.get(e)?.source.unload(),this._iblEnvironmentMap.delete(e)};_viewport=new l.M_G;_sortForwardByDistance=(e,t,r)=>{t.isUserBatch?(0,tp.OD)(e,r,t.storeBuffer.data,t.renderData.worldTransform):(0,tp.aH)(e,r)};_forwardOptions={pipe:this,bit:0,bindsMaterial:!1,camera:null,session:null,alwaysRebuild:!0,sortBatch:void 0};materialStoreBuffer;_morphStoreBuffer=new th.E;geometryDataStoreBuffer=new tn.W;atlasPool=t_.e.from({rebaseIndices:!0});_managedViews;constructor(e){this.renderer=e,this._managedViews=new tm.E(e),e.runners.contextChange.add(this)}contextChange(){this.materialStoreBuffer??=new tl.r({alignment:this.renderer.limits.minUniformBufferOffsetAlignment,rendererType:this.renderer.type})}createShadowPass(e){return new ta({renderer:this.renderer,shadowMapHandle:e.shadowMapHandle})}prepareForward(e,t){}renderForward(e,t){let r=this._forwardOptions;r.bit=e.bit,r.bindsMaterial=e.bindsMaterial,r.camera=e.camera,r.session=t,r.alwaysRebuild=!(0,tf.x)(e),r.sortBatch="distance"===e.sort?this._sortForwardByDistance:void 0,tt(r),r.camera=null,r.session=null}renderGeometry(e,t,r){this.renderer.encoder.draw({geometry:e,shader:t,state:r})}setViewport(e){this.renderer.gl.viewport(e.x,e.y,e.width,e.height)}_depthClearState=null;clearDepth(e){if(!this._depthClearState){let e=new l.UwB;e.depthMask=!0,e.depthTest=!1,e.culling=!1,e.blend=!1,this._depthClearState=e}let t=this.renderer.gl,r=e.activeViewport;this.renderer.state.set(this._depthClearState),t.enable(t.SCISSOR_TEST),t.scissor(r.x,r.y,r.width,r.height),this.renderer.renderTarget.clear(this.renderer.renderTarget.renderTarget,l.uJ3.DEPTH),t.disable(t.SCISSOR_TEST)}copyColor(e,t,r){let{target:i,viewport:s}=e;if(!i.colorTexture)return;let a=t.frame,o=t.source.resolution;this.renderer.renderTarget.copyToTexture(i,t,{x:s.x,y:s.y},{width:s.width,height:s.height},{x:Math.round(a.x*o),y:Math.round(a.y*o)}),r.activeTarget=null}outputColor(e,t,r,i){let{target:s}=e;if(!s.colorTexture)return;let a=this.renderer.renderTarget;(this._colorOutputDraw??=new tc.t(this.renderer)).draw(this,e,t,i),a.finishRenderPass(),r.activeTarget=null}generateMips(e,t){let r=t.view3d._graph.getTexture(e,t).source;this.renderer.renderTarget.bind({target:t.defaultTarget,clear:l.uJ3.NONE}),t.activeTarget=null,r.updateMipmaps()}resolveColor(){this.renderer.renderTarget.finishRenderPass()}copyDepth(e,t,r){let{target:i,viewport:s}=e;i.depthStencilTexture&&(this.renderer.renderTarget.copyDepthTexture(i,t,{x:s.x,y:s.y},{width:s.width,height:s.height},{x:0,y:0}),r.activeTarget=null)}validateRenderable(){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}updateRenderable(){}execute(e){if(!e.isRenderable)return;let t=u(e,this.renderer),r=this.renderer.renderTarget.renderTarget;e._ensureInitialized(this.renderer,t,r.colorTexture.source.resolution),this._managedViews.track(e);let i=e.environment;i&&(this._brdfLutTexture||=(0,td.N)({renderer:this.renderer}),t.globalBindGroup.setResource(this._brdfLutTexture.source,"uBrdfLutTexture"));let s=this._prefilteredEnvironment(i);t.globalBindGroup.setResource(s,"uEnvironmentTexture"),t.globalUniformGroup.uniforms.uEnvironmentMaxMipLevel=s.mipLevelCount-1;let a=e.lights;if(0===e._meshSlots.count&&1===e._meshBatches.length)return;let o={view3d:e,lights:a,defaultTarget:r,defaultFrontFaceInverted:!1,activeTarget:null,needsDepthClear:!0,viewport:this._viewport,activeViewport:this._viewport,globalBindGroup:t.globalBindGroup,globalUniformGroup:t.globalUniformGroup,renderer:this.renderer};(0,tg.u)(e,this,o)&&(t.globalBindGroup.setResource(e._bonePit.texture.source,"uBonePitTexture"),t.globalBindGroup.setResource(this._morphStoreBuffer.texture.source,"uMorphTexture"),t.globalBindGroup.setResource(this.geometryDataStoreBuffer.texture.source,"uGeometryTexture"),this.atlasPool.update(),this.materialStoreBuffer.update(),this.geometryDataStoreBuffer.update(),(0,tu.Z)(this.atlasPool,this.materialStoreBuffer,t,this._morphStoreBuffer)&&e._invalidateDrawCaches(),t.globalBindGroup.setResource(this.materialStoreBuffer.texture.source,"uMaterialStorage"),this.prepareView(o),e._graph.run(o))}destroy(){if(!this._destroyed){for(let[e,t]of(this._destroyed=!0,this._managedViews.destroy(),this._colorOutputDraw?.destroy(),this._colorOutputDraw=null,this._brdfLutTexture?.destroy(!0),this._brdfLutTexture=void 0,this._iblEnvironmentMap))e.off("destroy",this._onEnvironmentDestroy),t.destroy(!0);this._iblEnvironmentMap=null,this.renderer.runners.contextChange.remove(this),this.materialStoreBuffer.destroy(),this.materialStoreBuffer=null,this._morphStoreBuffer.destroy(),this.geometryDataStoreBuffer.destroy(),this._depthClearState=null}}_prefilteredEnvironment(e){if(!(e instanceof l.b4q)||e.source.destroyed)return i.pC.source;let t=this._iblEnvironmentMap.get(e.source);return t||(t=(0,to.f)({renderer:this.renderer,sourceTexture:e}),this._iblEnvironmentMap.set(e.source,t),e.source.once("destroy",this._onEnvironmentDestroy)),t.source}prepareView(e){let{view3d:t,lights:r}=e;this.renderer.lighting3d.update(t,r),this._updateGlobalUniforms(t)}_updateGlobalUniforms(e){let{fog:t}=e,r=u(e,this.renderer),i=r.globalUniformGroup.uniforms;if(i.uTime=performance.now()/1e3,i.uExposure=e.exposure,i.uDisplayExposure=Math.pow(e.exposure,1/2.2),t){tx.setValue(t.color??0xcccccc),(0,c.Og)(i.uFogColor,0,tx,e.exposure);let r=i.uFogParams;r[0]=t.near||0,r[1]=t.far||0x5f5e0ff,r[2]=t.density||0}r.globalUniformGroup.update()}};l.XOh.add(p,e7,ty)},98505(e,t,r){r.d(t,{N:()=>h});var i=r(41741),s=r(16875);let a={bindGroups:["local"],gl:{vertex:`#version 300 es
      {{header}}
      void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
          vUv = aPosition * 0.5 + 0.5;
      }
    `,fragment:`#version 300 es
      {{header}}

      float geometrySchlickGGX(float NdotV, float roughness) {
          float a = roughness;
          float k = (a * a) / 2.0;
          return NdotV / (NdotV * (1.0 - k) + k);
      }

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
    `}},o={bindGroups:["local"],gpu:`
{{header}}

fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
   let a = roughness;
   let k = (a * a) / 2.0;
   
   return NdotV / (NdotV * (1.0 - k) + k);
}

fn geometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
   let NdotV = max(dot(N, V), 0.0);
   let NdotL = max(dot(N, L), 0.0);
   let ggx1 = geometrySchlickGGX(NdotV, roughness);
   let ggx2 = geometrySchlickGGX(NdotL, roughness);
   
   return ggx1 * ggx2;
}

fn integrateBRDF(NdotV: f32, roughness: f32, sampleCount: u32) -> vec2<f32> {
   let V = vec3<f32>(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);
   let N = vec3<f32>(0.0, 0.0, 1.0);
   
   var A = 0.0;
   var B = 0.0;
   
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
  output.vUv = vec2<f32>(input.aPosition.x * 0.5 + 0.5, -input.aPosition.y * 0.5 + 0.5);
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
   let NdotV = input.vUv.x;
   let roughness = input.vUv.y;
   
   let clampedNdotV = max(NdotV, 0.001);
   
   let clampedRoughness = max(roughness, 0.01);
   
   let result = integrateBRDF(clampedNdotV, clampedRoughness, u32(local.sampleCount));
   
   return vec4<f32>(result.x, result.y, 0.0, 1.0);
}
`};var n=r(54537);let l={bindGroups:["local"],gpu:o.gpu,gl:a.gl};function h(e){let{renderer:t}=e,r=e.size??256,a=e.sampleCount??1024,o={name:"brdfLut",requires:[s.j],attributes:{aPosition:"float32x2"},interStage:{vUv:"vec2<f32>"},bindings:{local:{sampleCount:"f32"}}},h=new n.TX4({local:new n.k2S({sampleCount:{value:a,type:"f32"}})}),u=t.material3d.compileIsolatedShader([o],l,{0:h}),d=n.Y7R.create({width:r,height:r,format:"rg16float"}).source,c=new n.gPd({source:d}),f=(0,i.A)(),p=t.renderTarget.renderTarget?t.renderTarget.getBindState():null;return t.renderTarget.bind({target:d,clear:!0}),t.encoder.draw({geometry:f,shader:u,state:n.UwB.default2d}),p&&t.renderTarget.bind(p),h.destroy(),u.destroy(),c}},32032(e,t,r){r.d(t,{U:()=>l,f:()=>h});var i=r(41741),s=r(73390),a=r(16875),o=r(80785),n=r(54537);let l=64512;function h(e){var t;let{renderer:r,sourceTexture:h}=e,u=e.size??Math.min(256,Math.max(128,h.source.pixelWidth)),d=e.sampleCount??1024,c=e.label??"ibl-specular";(0,o.r)(r,"View3D environment, for the cube a cubemap environment is prefiltered into");let f=(0,o.b)(r),p=e.mipLevelCount??5,m={bindGroups:["local"],gpu:`
     {{header}}

     fn getDirection(face: i32, pos: vec2<f32>) -> vec3<f32> {
        let u = pos.x;
        let v = -pos.y;
        
        var dir = vec3<f32>(0.0);
        
        switch face {
            case 0: { dir = vec3<f32>(1.0, -v, -u); }
            case 1: { dir = vec3<f32>(-1.0, -v, u); }
            case 2: { dir = vec3<f32>(u, 1.0, v); }
            case 3: { dir = vec3<f32>(u, -1.0, -v); }
            case 4: { dir = vec3<f32>(u, -v, 1.0); }
            default: { dir = vec3<f32>(-u, -v, -1.0); }
        }

        return dir;
     }

     fn sourceLod(NdotH: f32, roughness: f32, solidAnglePerTexel: f32) -> f32 {
        let a2 = roughness * roughness * roughness * roughness;
        let d = NdotH * NdotH * (a2 - 1.0) + 1.0;
        let pdf = a2 / (PI * d * d) * 0.25;
        let solidAnglePerSample = 1.0 / (local.sampleCount * pdf + 1e-4);
        return clamp(0.5 * log2(solidAnglePerSample / solidAnglePerTexel) + 1.0, 0.0, local.sourceMaxMip);
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
        let R = N;
        let V = R;
        
        let maxMipLevel = f32(local.mipLevelCount) - 1.0;
        let roughness = local.mipLevel / maxMipLevel;
        
        if roughness < 0.01 {
            let s = textureSampleLevel(uSourceTexture, uSampler, N, 0.0).rgb;
            return vec4<f32>(min(decodeToLinear(s), vec3<f32>(${l}.0)), 1.0);
        }
        
        var prefilteredColor = vec3<f32>(0.0);
        var totalWeight = 0.0;
        
        let sampleCount = u32(local.sampleCount);
        let solidAnglePerTexel = 4.0 * PI / (6.0 * local.sourceSize * local.sourceSize);
        
        for (var i = 0u; i < sampleCount; i++) {
            let Xi = hammersley(i, sampleCount);
            let H = importanceSampleGGX(Xi, N, roughness);
            let L = normalize(2.0 * dot(V, H) * H - V);
            
            let NdotL = max(dot(N, L), 0.0);
            let lod = sourceLod(dot(N, H), roughness, solidAnglePerTexel);
            let sampleColor = decodeToLinear(textureSampleLevel(uSourceTexture, uSampler, L, lod).rgb);
            
            let weight = NdotL * step(0.0001, NdotL);
            prefilteredColor += sampleColor * weight;
            totalWeight += weight;
        }
        
        prefilteredColor = prefilteredColor / max(totalWeight, 1e-4);
        
        return vec4<f32>(min(prefilteredColor, vec3<f32>(${l}.0)), 1.0);
     }
  `,gl:{vertex:`#version 300 es
        {{header}}

        vec3 getDirection(int face, vec2 pos) {
            float u = pos.x;
            float v = pos.y;
            
            vec3 dir = vec3(0.0);
            
            switch(face) {
                case 0: dir = vec3(1.0, -v, -u); break;
                case 1: dir = vec3(-1.0, -v, u); break;
                case 2: dir = vec3(u, 1.0, v); break;
                case 3: dir = vec3(u, -1.0, -v); break;
                case 4: dir = vec3(u, -v, 1.0); break;
                default: dir = vec3(-u, -v, -1.0); break;
            }

            return dir;
        }

        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vDir = getDirection(int(layer + 0.5), aPosition);
        }
      `,fragment:`#version 300 es
        {{header}}

        out vec4 fragColor;

        float sourceLod(float NdotH, float roughness, float solidAnglePerTexel) {
            float a2 = roughness * roughness * roughness * roughness;
            float d = NdotH * NdotH * (a2 - 1.0) + 1.0;
            float pdf = a2 / (PI * d * d) * 0.25;
            float solidAnglePerSample = 1.0 / (sampleCount * pdf + 1e-4);
            return clamp(0.5 * log2(solidAnglePerSample / solidAnglePerTexel) + 1.0, 0.0, sourceMaxMip);
        }

        void main() {
            vec3 N = normalize(vDir);
            vec3 R = N;
            vec3 V = R;
            
            float maxMipLevel = mipLevelCount - 1.0;
            float roughness = mipLevel / maxMipLevel;
            
            if (roughness < 0.01) {
                vec3 s = textureLod(uSourceTexture, N, 0.0).rgb;
                fragColor = vec4(min(decodeToLinear(s), vec3(${l}.0)), 1.0);
                return;
            }
            
            vec3 prefilteredColor = vec3(0.0);
            float totalWeight = 0.0;
            
            uint sampleCountUint = uint(sampleCount);
            float solidAnglePerTexel = 4.0 * PI / (6.0 * sourceSize * sourceSize);
            
            for (uint i = 0u; i < sampleCountUint; i++) {
                vec2 Xi = hammersley(i, sampleCountUint);
                vec3 H = importanceSampleGGX(Xi, N, roughness);
                vec3 L = normalize(2.0 * dot(V, H) * H - V);
                
                float NdotL = max(dot(N, L), 0.0);
                float lod = sourceLod(dot(N, H), roughness, solidAnglePerTexel);
                vec3 sampleColor = decodeToLinear(textureLod(uSourceTexture, L, lod).rgb);
                
                float weight = NdotL * step(0.0001, NdotL);
                prefilteredColor += sampleColor * weight;
                totalWeight += weight;
            }
            
            prefilteredColor = prefilteredColor / max(totalWeight, 1e-4);
            fragColor = vec4(min(prefilteredColor, vec3(${l}.0)), 1.0);
        }
      `}},_={name:"iblPrefilter",requires:[a.j,(0,s.s)(!(0,s.P)(h.source.format))],attributes:{aPosition:"float32x2"},interStage:{vDir:"vec3<f32>"},bindings:{local:{uSourceTexture:"texture_cube<f32>",uSampler:"sampler",layer:"f32",mipLevel:"f32",mipLevelCount:"f32",sampleCount:"f32",sourceSize:"f32",sourceMaxMip:"f32"}}},g=new n.v9C({label:c,width:u,height:u,viewDimension:"cube",arrayLayerCount:6,mipLevelCount:p,format:f}),x=new n.k2S({layer:{value:0,type:"f32"},mipLevel:{value:0,type:"f32"},mipLevelCount:{value:p,type:"f32"},sampleCount:{value:d,type:"f32"},sourceSize:{value:h.source.pixelWidth,type:"f32"},sourceMaxMip:{value:((t=h.source).autoGenerateMipmaps?Math.floor(Math.log2(Math.max(t.pixelWidth,t.pixelHeight)))+1:t.mipLevelCount)-1,type:"f32"}}),y=new n.TX4({local:x,uSourceTexture:h.source,uSampler:h.source.style}),v=r.material3d.compileIsolatedShader([_],m,{0:y}),b=(0,i.A)(),w=new n.O0B({colorTextures:[g]}),T=v.resources.local,C=r.renderTarget.renderTarget?r.renderTarget.getBindState():null;for(let e=0;e<6;e++)for(let t=0;t<p;t++){T.uniforms.layer=e,T.uniforms.mipLevel=t;let i="uniformBatch"in r.renderPipes?r.renderPipes.uniformBatch.getUboResource(T):T;y.setResource(i,"local"),r.renderTarget.bind({target:w,clear:!0,mipLevel:t,layer:e}),r.encoder.draw({geometry:b,shader:v,state:n.UwB.default2d})}return C&&r.renderTarget.bind(C),y.destroy(),v.destroy(),w.destroy(),new n.b4q({source:g})}},67534(e,t,r){r.d(t,{DM:()=>x,vY:()=>y});var i=r(36384),s=r(68751),a=r(98741),o=r(54537);let n=new i.k,l=new i.k,h=new i.k,u=new o.M_G,d=new o.M_G,c=new o.bRX,f=new o.M_G,p=new o.uqu,m=new o.czZ;function _(e,t,r,i){return m.clear(),m.addFrame(e.x,e.y,e.x+e.width,e.y+e.height,t),i.x=m.minX,i.y=m.minY,i.width=m.maxX-m.minX,i.height=m.maxY-m.minY,i.fit(r)}function g(e,t,r,i){e.view.getInverse(e.worldTransform),e.computeProjection(t.width/t.height,e.projection);let{x:s,y:a,width:o,height:u}=t,{a:d,b:c,c:f,d:p,tx:m,ty:_}=r,{x:g,y:x,width:y,height:v}=i;n.set(o/2,0,0,s+o/2,0,-u/2,0,a+u/2,0,0,1,0,0,0,0,1),l.set(d,f,0,m,c,p,0,_,0,0,1,0,0,0,0,1),h.set(2/y,0,0,-(2*g)/y-1,0,-2/v,0,2*x/v+1,0,0,1,0,0,0,0,1),e.projection.premultiply(h.multiply(l).multiply(n)),function(e){let t=e.clippingPlane;if(!t)return;let r=e.projection.elements,{x:i,y:s,z:a}=t.normal,o=t.constant,n=(Math.sign(i)+r[8])/r[0],l=(Math.sign(s)+r[9])/r[5],h=2/(i*n+s*l+-1*a+o*((1+r[10])/r[14]));r[2]=i*h,r[6]=s*h,r[10]=a*h+1,r[14]=o*h}(e),e.viewProjection.multiplyMatrices(e.projection,e.view),e.frustum.setFromProjectionMatrix(e.viewProjection)}function x(e,t){let r=(0,s.c)(e);if(r._currentSession===t)return;r._currentSession=t;let{view3d:i,renderer:n}=t;if(e.view3d!==i)throw Error("A render pass camera must live in the View3D it draws from. Add it to the view first, e.g. `view.root.addChild(camera)`.");let l=n.type===o.W3c.WEBGPU,h=e.renderTexture;if(h){let{frame:t,source:i}=h,a=Math.round(t.width*i.resolution),o=Math.round(t.height*i.resolution);!function(e,t,r){let{x:i,y:a,width:o,height:n}=e.viewport;f.set(i*t,a*r,o*t,n*r),p.identity(),d.set(0,0,t,r);let l=_(f,p,d,(0,s.c)(e).frame);l.width<=0||l.height<=0||g(e,f,p,l)}(e,a,o),r.setViewportUvScale(1,1),d.set(0,0,a,o)}else{var m,x,y;let o;u.x=0,u.y=0,u.width=t.defaultTarget.width,u.height=t.defaultTarget.height,m=i,x=e,y=u,function(e,t,r){let{width:i,height:s}=e,{x:a,y:o}=e.anchor,{x:n,y:l,width:h,height:u}=t.viewport;f.set((n-a)*i,(l-o)*s,h*i,u*s),p.copyFrom(e.worldTransform),p.tx-=r.x,p.ty-=r.y}(m,x,n.globalUniforms.globalUniformData.offset),(o=_(f,p,y,(0,s.c)(x).frame)).width<=0||o.height<=0||g(x,f,p,o),e===i.camera&&(0,a.q)(r.frame,t.defaultTarget,n,t.viewport),i._graph.sceneViewport(t,d),i._graph.setViewportUvScale(d.width,d.height,c),r.setViewportUvScale(c.x,c.y)}let v=e===i.camera?d:(0,a.d)(e,t,d,i._graph.resolution);l&&v&&r.setViewport(v,!0);let b=h?n.renderTarget.getRenderTarget(h):t.defaultTarget,w=n.renderTarget.isFrontFaceInverted(b,t.defaultTarget.flipY);r.syncFromCamera(e,w,l,v)}function y(e,t){let r=(0,s.c)(e);r.prepareLightTiles(t);let{renderer:i}=t;i.type===o.W3c.WEBGPU&&i.ubo.updateUniformGroup(r.uniformGroup)}},72119(e,t,r){r.d(t,{e:()=>n,m:()=>o});var i=r(59670);let s=["opaque","transmission","transparent"],a=new WeakSet;function o(e){if(a.has(e))return;let{name:t,bits:r}=e;if((0,i.d)(t,"SceneOutput"),"color"===t)throw Error("SceneOutput: 'color' is the scene colour's own output. Give the output another name.");for(let i in r){let s=r[i],a=s.outputs?.[t];if(!a)throw Error(`SceneOutput '${t}': bit '${s.name}' for the ${i} pass doesn't declare it. Add \`${t}\` to the bit's \`outputs\`.`);if("transparent"===i&&"vec4<f32>"!==a&&!e.format.includes("int"))throw Error(`SceneOutput '${t}': bit '${s.name}' for the transparent pass writes it as ${a}. A blended surface blends what it writes, and WebGPU's blend reads the alpha, so write a float output as vec4<f32>, or give the output an integer format, which never blends.`)}a.add(e)}function n(e,t){if(e===t)return!0;if(e.name!==t.name||e.format!==t.format)return!1;let r=e.clearValue,i=t.clearValue;if(r!==i&&(!r||!i||r[0]!==i[0]||r[1]!==i[1]||r[2]!==i[2]||r[3]!==i[3]))return!1;for(let r=0;r<s.length;r++){let i=s[r];if(e.bits?.[i]?.name!==t.bits?.[i]?.name)return!1}return!0}},98741(e,t,r){r.d(t,{d:()=>h,q:()=>l});var i=r(68751),s=r(54537);let a=new s.M_G,o={x:0,y:0,width:0,height:0};function n(e,t,r,i,s,a,o){let n=(e.x-r)*t+.5|0,l=(e.y-i)*t+.5|0,h=e.width*t+.5|0,u=e.height*t+.5|0;return n<0&&(h+=n,n=0),l<0&&(u+=l,l=0),n>s.width-1&&(n=s.width-1),l>s.height-1&&(l=s.height-1),h>s.width-n&&(h=s.width-n),u>s.height-l&&(u=s.height-l),h<1&&(h=1),u<1&&(u=1),a&&(l=s.height-u-l),o.x=s.x+n,o.y=s.y+l,o.width=h,o.height=u,o}function l(e,t,r,i){let a=t.colorTexture.source;o.width=a.pixelWidth,o.height=a.pixelHeight;let l=r.type===s.W3c.WEBGL&&t.isRoot;return n(e,a.resolution,0,0,o,l,i)}function h(e,t,r,o){let l=(0,i.c)(e).frame;if(l.width<=0||l.height<=0)return null;let h=null!==e.renderTexture,u=(0,i.c)(t.view3d.camera).frame;return n(l,h?1:o,h?0:u.x,h?0:u.y,r,!h&&t.renderer.type===s.W3c.WEBGL&&t.defaultTarget.isRoot,a)}},23278(e,t,r){r.d(t,{X_:()=>a,iK:()=>o,j4:()=>s});var i=r(72119);function s(e,t=[]){let r=[],a=(e,t)=>{(0,i.m)(e);let s=r.find(t=>t.name===e.name);if(!(s&&(0,i.e)(s,e))){if(s)throw Error(`${t} uses a scene output named '${e.name}', and another pass uses a different one with that name. Share one definition between them, or rename one.`);r.push(e)}};for(let t=0;t<e.length;t++){let r=e[t],i=r.enabled?r.requiredOutputs:void 0;if(i)for(let e=0;e<i.length;e++)a(i[e],r.constructor.name)}for(let e=0;e<t.length;e++)a(t[e],"createDefaultGraph3D's `sceneOutputs`");return r.sort((e,t)=>e.name<t.name?-1:+(e.name>t.name))}function a(e,t){let r=[];for(let i=0;i<e.length;i++){let s=e[i].bits?.[t];s&&r.push(s)}return r}function o(e,t,r){if(!t||r)return;let i=t.materialBits;for(let t=0;t<i.length;t++)e.push(i[t]);return t.outputLocations}},62762(e,t,r){r.d(t,{p:()=>h});var i=r(37821),s=r(12385),a=r(45743),o=r(54537),n=class extends a.e{drawCallsBuffer;constructor(e="DrawCalls",t=128){super(t),this.drawCallsBuffer=new s.c({data:this.drawCalls,usage:o.Sdw.INDIRECT|o.Sdw.STORAGE|o.Sdw.COPY_DST|o.Sdw.COPY_SRC,label:e,shrinkToFit:!1})}ensureCapacity(e){let t=this.drawCalls,r=super.ensureCapacity(e);return r!==t&&(this.drawCallsBuffer.data=r),r}upload(e){this.drawCallsBuffer.update(5*e*4)}copyCommandsFrom(e,t){this.ensureCapacity(t).set(e.drawCalls.subarray(0,5*t)),this.upload(t)}unload(){this.drawCallsBuffer?.unload()}destroy(){this.drawCallsBuffer&&(this.drawCallsBuffer.destroy(),this.drawCallsBuffer=null,super.destroy())}},l=class{survivors=new i.k("survivors");indirectDrawData=new n("survivorDrawCalls");bundle=null;direct=!1;countsDirtyId=0;lastBundleCountsDirtyId=-1;lastCommandListDirtyId=-1;lastRangesDirtyId=-1;lastBundleDirtyId=-1;lastCameraBindGroup=null;lastVisibilityDirtyId=-1;sync(e,t){this.direct!==t&&(this.direct=t,this.bundle=null,this.lastVisibilityDirtyId=-1);let r=e.commandList.dirtyId,i=e.rangesDirtyId;if(this.lastCommandListDirtyId===r&&this.lastRangesDirtyId===i)return!1;let s=this.lastCommandListDirtyId===r,a=this.indirectDrawData.drawCalls,o=this.survivors.data;return this.indirectDrawData.copyCommandsFrom(e.drawData,e.commandList.count),this.survivors.ensureSize(e.view.count),(!s||this.direct||a!==this.indirectDrawData.drawCalls||o!==this.survivors.data)&&(this.bundle=null),this.lastCommandListDirtyId=r,this.lastRangesDirtyId=i,this.lastVisibilityDirtyId=-1,!0}isBundleStale(e,t){return this.lastBundleDirtyId!==e.gpuData.bundleDirtyId||this.lastCameraBindGroup!==t||this.direct&&this.lastBundleCountsDirtyId!==this.countsDirtyId}claimBundleRecorded(e,t){this.lastBundleDirtyId=e.gpuData.bundleDirtyId,this.lastCameraBindGroup=t,this.lastBundleCountsDirtyId=this.countsDirtyId}unload(){this.bundle=null,this.lastCommandListDirtyId=-1,this.lastRangesDirtyId=-1,this.lastBundleDirtyId=-1,this.lastCameraBindGroup=null,this.lastBundleCountsDirtyId=-1,this.lastVisibilityDirtyId=-1,this.survivors.unload(),this.indirectDrawData.unload()}reset(){this.unload()}destroy(){this.bundle=null,this.survivors.destroy(),this.indirectDrawData.destroy()}},h=class{_byBatch=Object.create(null);_lastMeshBatchesDirtyId=-1;ensure(e,t=0){let r=this._byBatch[e.uid]??=[];return r[t]??=o.ZxI.get(l)}get(e,t=0){return this._byBatch[e.uid]?.[t]}remove(e,t){let r=this._byBatch[e.uid],i=r?.[t];if(r&&i)for(o.ZxI.return(i),r[t]=void 0;r.length>0&&!r[r.length-1];)r.pop()}removeDetached(e){let t=e._meshBatchesDirtyId;if(this._lastMeshBatchesDirtyId===t)return;this._lastMeshBatchesDirtyId=t;let r=e._meshBatches;for(let e in this._byBatch){let t=+e,i=!1;for(let e=0;e<r.length;e++)if(r[e].uid===t){i=!0;break}if(!i){for(let e of this._byBatch[t])e&&o.ZxI.return(e);delete this._byBatch[t]}}}unload(){for(let e in this._byBatch)for(let t of this._byBatch[e])t?.unload()}release(){for(let e in this._byBatch){for(let t of this._byBatch[e])t&&o.ZxI.return(t);delete this._byBatch[e]}this._lastMeshBatchesDirtyId=-1}}},6105(e,t,r){r.d(t,{x:()=>i});function i(e){return(e.cache??("key"===e.sort?"auto":"never"))==="auto"}},1104(e,t,r){r.d(t,{A:()=>u,J:()=>h});var i=r(14200),s=r(5086),a=r(41987),o=r(5068),n=r(81759),l=r(23278);let h={NONE:0,SHADOW:1,OPAQUE:2,TRANSPARENT:4,BACKGROUND:8,TRANSMISSION:16,BLENDED_REFRACTION:32,MATERIAL_PASS_MASK:54};var u=class{name;description;bit=0;pipe;descriptor;camera;_updatesViewKey=!0;attachedOutputs;materialBits;outputLocations;constructor(e){this.name=e.name,this.description=e.description,this.bit=i.w.getOrAllocate(e.name,e.bit),this.descriptor=e.descriptor?(0,a.R)(e.descriptor):void 0,this.camera=e.camera??null,this.attachedOutputs=e.attachedOutputs??[],this.materialBits=(0,l.X_)(this.attachedOutputs,this.name),this.outputLocations=this.attachedOutputs.length>0?["color",...this.attachedOutputs.map(e=>e.name)]:s.n,this.pipe=e.renderer.renderPipes.view3d}_writeTarget(e){e.writeColor(e.targetColor);for(let t=0;t<this.attachedOutputs.length;t++)e.writeColor(e.getSceneOutput(this.attachedOutputs[t]));e.writeDepth(e.targetDepth)}setup(e){}prepare(e){}render(e){}onRenderableDirty(e,t,r){let i=this.bit,s=t.drawLists[i],a=e.material;r||!this._updatesViewKey?s.drawDirtyId++:(s.move(e),t._editsPending=!0);let l=a._passes[i],h=this.descriptor,u=l&&l.shaderDescriptor||h&&h.shaderDescriptor;if(u){let r=e._passCache[i];if(!r||r.isStaleFor(e)){let s=this.pipe.renderer.material3d.compileShader(u,e,t),n=l&&l.state||h&&h.state||a.state,d=l&&l.topology||h&&h.topology||a.topology||e.geometry.topology;r?(r.shader=s,r.mergedShader=null,r.state=n,r.topology=d,r.claimBuiltFrom(e)):(e._passCache[i]=new o.t(s,n,d)).claimBuiltFrom(e)}}let d=e._passCache[i];d&&((0,n.K)(e,d,this.pipe.renderer.material3d.computeBatchKey(e,i)),this._updatesViewKey&&s.view.updateKey(e.uid,e._sortKey))}destroy(){}}},45517(e,t,r){r.d(t,{t:()=>u});var i=r(41741),s=r(77869),a=r(54537);let o={target:null,clear:a.uJ3.NONE},n=new a.M_G,l={name:"colorOutputDraw",attributes:{aPosition:"float32x2"},bindings:{local:{uSource:"texture_2d<f32>",uOffset:"vec2<f32>"}}},h={bindGroups:["local"],gpu:`
{{header}}

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  let fxColor = textureLoad(uSource, vec2<i32>(input.position.xy + local.uOffset), 0);
  var finalColor = fxColor.rgb;
  {{fragmentEnd}}
  return vec4<f32>(finalColor, fxColor.a);
}
`,gl:{vertex:`#version 300 es

{{header}}

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,fragment:`#version 300 es

{{header}}

out vec4 fragColor;

void main() {
  vec4 fxColor = texelFetch(uSource, ivec2(gl_FragCoord.xy + uOffset), 0);
  vec3 finalColor = fxColor.rgb;
  {{end}}
  fragColor = vec4(finalColor, fxColor.a);
}
`}};var u=class{_renderer;_uniforms=new a.k2S({uOffset:{value:new Float32Array(2),type:"vec2<f32>"}});_bindGroup;_shaders=new Map;_state;constructor(e){this._renderer=e,this._bindGroup=new a.TX4({local:this._uniforms,uSource:a.gPd.WHITE.source});let t=new a.UwB;t.blend=!1,t.depthTest=!1,t.depthMask=!1,t.culling=!1,this._state=t}draw(e,t,r,u){let d=this._renderer,{viewport:c}=t,f=r.frame,p=r.source.resolution,m=Math.round(f.x*p),_=Math.round(f.y*p),g=this._uniforms.uniforms.uOffset;g[0]=c.x-m,g[1]=c.y-_,this._uniforms.update();let x="uniformBatch"in d.renderPipes?d.renderPipes.uniformBatch.getUboResource(this._uniforms):this._uniforms;this._bindGroup.setResource(x,"local"),this._bindGroup.setResource(t.target.colorTexture,"uSource");let y=this._shaders.get(u);y||(y=d.material3d.compileIsolatedShader([l,...(0,s.w)(u)],h,{0:this._bindGroup}),this._shaders.set(u,y)),o.target=r,o.clear=r.noFrame?a.uJ3.COLOR:a.uJ3.NONE,d.renderTarget.bind(o),o.target=null,e.setViewport(n.set(m,_,c.width,c.height)),e.renderGeometry((0,i.A)(),y,this._state),this._bindGroup.setResource(a.gPd.WHITE.source,"uSource")}destroy(){for(let e of this._shaders.values())e.destroy();this._shaders=null,this._bindGroup.destroy()}}},14200(e,t,r){r.d(t,{w:()=>s});var i=r(54537);let s=new class{_bitsByName=Object.assign(Object.create(null),{shadow:1,opaque:2,transparent:4,background:8,transmission:16});_nextBit=256;getOrAllocate(e,t){let r=this._bitsByName[e];if(void 0!==r)return void 0!==t&&t!==r&&(0,i.R8M)(`[@pixi/3d] pass "${e}" already registered with bit ${r}; ignoring explicit bit ${t}.`),r;let s=t??this._nextBit;return void 0===t&&(this._nextBit<<=1),this._bitsByName[e]=s,s}get(e){return this._bitsByName[e]}nameOf(e){return Object.keys(this._bitsByName).find(t=>this._bitsByName[t]===e)}}},86722(e,t,r){r.d(t,{f:()=>y});var i=r(49491),s=r(36384),a=r(32955),o=r(1104),n=r(54027),l=r(28960),h=r(67979),u=r(68751),d=r(18356),c=r(55464);let f=new s.k,p=new i.P,m=new n.i,_=new a.a,g=new i.P,x=`Too many shadow maps for the shadow budget of ${c.Ou}: each shadow-casting light takes one, or one per cascade. Lights past the budget render without shadows.`;var y=class extends o.A{_renderTarget=null;_layerCount=0;_quality="medium";_frameCount=0;_hasCastersValue=!1;_hasCastersFrame=-1;_sceneCasterBounds=new a.a;_sceneBoundsFrame=-1;_destroyed=!1;targetVersion=0;_view3d=null;shadowMapHandle;constructor(e){super(e),this.shadowMapHandle=e.shadowMapHandle}get renderTarget(){return null===this._renderTarget&&(this._renderTarget=(0,c.yo)(this._quality,Math.max(this._layerCount,1))),this._renderTarget}_growAtlas(e){e<=this._layerCount||(this._layerCount=Math.min(e,c.Ou),this._releaseTarget())}set quality(e){e!==this._quality&&(this._quality=e,this._releaseTarget())}get quality(){return this._quality}beginFrame(e){this._view3d=e,this.quality=e.shadowQuality,this._frameCount++,e._shadowDataList.reset()}unload(){this._releaseTarget()}_releaseTarget(){let e=this._renderTarget;if(!e)return;this._renderTarget=null,this.targetVersion++,this._view3d&&this._bindShadowSource(this._view3d,l.G_.source);let t=e.depthStencilTexture;e.destroy(),t.destroy()}_bindShadowSource(e,t){let{group:r,slot:i}=e._graph.globalTextureBindings.shadowMap;r.getResource(i)!==t&&(r.setResource(t,i),e._invalidateBundleCaches())}setup(e){e.produce(this.shadowMapHandle)}condition(e){let t=e.lights;for(let r=0;r<t.length;r++)if(t[r].canCastShadow)return this._hasCasters(e.view3d);return!1}_hasCasters(e){if(this._hasCastersFrame===this._frameCount)return this._hasCastersValue;this._hasCastersFrame=this._frameCount;let t=e._meshBatches,r=!1;for(let e=0;e<t.length&&!r;e++)r=(t[e].drawLists[this.bit]?.view.count??0)>0;return this._hasCastersValue=r,r}getShadowGPUData(e){return e._gpuShadowData??={inverseLightMatrix:new s.k,lightProjectionMatrix:new s.k,targetVersion:this.targetVersion}}_cascadeSlot(e,t){let r=this.getShadowGPUData(e).cascades??=[];return r[t]??={cameraData:new u.M,bias:0,normalBias:0,mapSize:0,cascadeCount:0,splits:null,needsRender:!0}}_commitCascadeCamera(e,t,r){f.getInverse(t),f.extractPosition(p);let i=e.cameraData;i.set(p,t,r),i.frustum.setFromProjectionMatrix(i.viewProjection)}updateLightShadowData(e,t){if(!e.canCastShadow)return;let r=t.camera,i=this.getShadowGPUData(e),{inverseLightMatrix:s,lightProjectionMatrix:a}=i,o=i.targetVersion!==this.targetVersion,n=c.TT[this._quality],l=e._shadowRefreshRequested,u=e.shadow.update,f=e.shadow.bias??.001;if("spot"===e.type||void 0===e.shadow.cascades){let r=this._cascadeSlot(e,0),i=(0,c.y5)((0,c.BA)(u,0),this._frameCount,l);if(!i)if("spot"===e.type)(0,c.Ql)(e,s,a,this._applyZRangeFix),this._commitCascadeCamera(r,s,a),r.normalBias=e.shadow.normalBias??.15;else{let i=e.shadow.bounds??this._resolveAutoShadowBounds(e,t,n);void 0===i||i.isEmpty()||(s.getInverse(e.worldTransform),(0,d.qk)(i,s,a,n,this._applyZRangeFix),this._commitCascadeCamera(r,s,a),r.normalBias=this._resolveNormalBias(e,a,n))}r.bias=f,r.mapSize=n,r.cascadeCount=0,r.splits=null,r.needsRender=o||!i;return}void 0!==e.shadow.bounds&&(0,h.m)("pixijs-3d-shadow-bounds-cascades","Shadow: shadow.bounds and shadow.cascades are both set \u2014 cascades take precedence and the bounds box is ignored. Use bounds for a fixed region or cascades for a camera-following shadow, not both."),s.getInverse(e.worldTransform);let p=(0,c.lP)(e),m=e.shadow.lambda,_=Math.min(e.shadow.maxDistance??50,r.far),g=this._cascadeSlot(e,0),x=g.splits??=[];(0,d.hy)(r.near,_,p,m,x),(0,d.Iu)(r,s);for(let t=0;t<p;t++){let i=0===t?g:this._cascadeSlot(e,t),h=(0,c.y5)((0,c.BA)(u,t),this._frameCount,l);if(!h){let o=0===t?r.near:x[t-1];(0,d.Dh)(r,o,x[t],a,n,this._applyZRangeFix),this._commitCascadeCamera(i,s,a),i.normalBias=this._resolveNormalBias(e,a,n)}i.bias=f,i.mapSize=n,i.cascadeCount=0===t&&p>1?p:0,t>0&&(i.splits=null),i.needsRender=o||!h}}_completeShadowUpdate(e){e._gpuShadowData&&(e._gpuShadowData.targetVersion=this.targetVersion),e._shadowRefreshRequested=!1}_resolveAutoShadowBounds(e,t,r){let i=this._countSceneCasters(t),s=e._autoShadowBounds;if(i>256&&e._autoShadowBoundsFrozen)return s??void 0;let o=this._ensureSceneCasterBounds(t);if(o.isEmpty())return s??void 0;let n=s??(e._autoShadowBounds=new a.a);return n.copyFrom(o),i<=256?e._autoShadowBoundsFrozen=!1:(e._autoShadowBoundsFrozen=!0,(0,h.m)("pixijs-3d-shadow-autofit-cap",`Shadow auto-fit: ${i} shadow casters is over the auto-measure cap (256), so the shadow box was fitted once and frozen. If casters move or spawn outside it, set shadow.bounds, enable shadow.cascades, or call light.fitShadowBounds() after changes.`)),this._warnIfShadowBoxLarge(n,r),n}_countSceneCasters(e){let t=0,r=e._meshBatches;for(let e=0;e<r.length;e++){let i=r[e];if(!i.renderData._worldVisible)continue;let s=i.drawLists[this.bit];s&&(t+=s.view.count)}return t}_ensureSceneCasterBounds(e){if(this._sceneBoundsFrame===this._frameCount)return this._sceneCasterBounds;this._sceneBoundsFrame=this._frameCount;let t=this._sceneCasterBounds.makeEmpty(),r=e._meshBatches;for(let e=0;e<r.length;e++){let i=r[e];if(!i.renderData._worldVisible)continue;let s=i.drawLists[this.bit];if(!s||0===s.view.count)continue;let a=0===e?null:i.renderData.worldTransform,o=s.view.items,n=s.view.renderableIndices;for(let e=0;e<s.view.count;e++){let r=o[n[e]];if(0===r._worldVisible)continue;let i=r.boundingSphere;if(i.radius<0)continue;let s=a?i.applyMatrix4(a,m):i;t.union(s.getBounds(_))}}return t}_warnIfShadowBoxLarge(e,t){if(e.isEmpty())return;let r=e.getSize(g);Math.max(r.x,r.y,r.z)/t>.15&&(0,h.m)("pixijs-3d-shadow-autofit-large","Shadow auto-fit box spans a large scene, so shadows may look soft. Raise view3d.shadowQuality, set light.shadow.bounds to the area that needs shadows, or, for a scene the camera roams across, enable cascades: light.shadow.cascades = 3.")}_resolveNormalBias(e,t,r){return void 0!==e.shadow.normalBias?e.shadow.normalBias:3*(2/(t.elements[0]*r))}prepareShadow(e,t){let r=t._shadowDataList,i=this._claimShadowSlots(e,t,r.count);if(0===i)return;this._growAtlas(r.count+i),this.updateLightShadowData(e,t);let s=this.getShadowGPUData(e).cascades;for(let e=0;e<i;e++)r.add(s[e])}_claimShadowSlots(e,t,r){let i=e.canCastShadow&&this._hasCasters(t),s=(0,c.lP)(e);return i&&r+s<=c.Ou?(e._shadowDataIndex=r,s):(i&&(0,h.m)("pixijs-3d-shadow-budget",x),e._shadowDataIndex=-1,0)}destroy(){this._destroyed||(this._destroyed=!0,this._view3d=null,this._releaseTarget(),super.destroy())}}},18356(e,t,r){r.d(t,{Dh:()=>p,Iu:()=>u,M1:()=>a,hy:()=>h,qk:()=>g});var i=r(36384),s=r(32955);let a=.1,o=new i.k,n=new i.k,l=new Float64Array(4);function h(e,t,r,i,s){s.length=r;for(let a=1;a<=r;a++){let o=a/r,n=e*Math.pow(t/e,o),l=e+(t-e)*o;s[a-1]=i*n+(1-i)*l}return s}function u(e,t){o.getInverse(e.viewProjection),n.multiplyMatrices(t,o)}function d(e,t){let r=e.projection.elements;return(-(r[10]*t)+r[14])/(-(r[11]*t)+r[15])}function c(e,t,r){let i=e.elements,s=1/(t-r);i[10]=s,i[14]=t*s}function f(e,t,r){let i=2*t/r;return Math.floor(e/i)*i}function p(e,t,r,i,s,a=!0){!function(e,t){let r=n.elements,i=1/0,s=-1/0,a=0,o=0;for(let n=0;n<2;n++){let l=0===n?e:t;for(let e=-1;e<=1;e+=2)for(let t=-1;t<=1;t+=2){let n=r[0]*t+r[4]*e+r[8]*l+r[12],h=r[1]*t+r[5]*e+r[9]*l+r[13],u=r[2]*t+r[6]*e+r[10]*l+r[14],d=r[3]*t+r[7]*e+r[11]*l+r[15],c=u/d;a+=n/d,o+=h/d,c<i&&(i=c),c>s&&(s=c)}}l[0]=i,l[1]=s,l[2]=.125*a,l[3]=.125*o}(d(e,t),d(e,r));let o=e.projection.elements,h="orthographic"===e.mode?1:r,u=h/o[5],m=h/o[0],g=(r-t)*.5,x=Math.sqrt(m*m+u*u+g*g),y=-l[1]-x*_,v=-l[0],b=f(l[2],x,s),w=f(l[3],x,s);i.makeOrthographic(b-x,b+x,w+x,w-x,y,v),a&&c(i,y,v)}let m=new s.a,_=4;function g(e,t,r,i,s=!0){e.applyMatrix4(t,m);let{min:a,max:o}=m,n=(o.x-a.x)*.55,l=(o.y-a.y)*.55,h=f((a.x+o.x)*.5,n,i),u=f((a.y+o.y)*.5,l,i),d=-o.z-Math.max(n,l)*_,p=-a.z;r.makeOrthographic(h-n,h+n,u+l,u-l,d,p),s&&c(r,d,p)}},55464(e,t,r){r.d(t,{BA:()=>l,D9:()=>o,Ou:()=>h,Ql:()=>c,TT:()=>s,ac:()=>a,lP:()=>u,y5:()=>n,yo:()=>d});var i=r(54537);let s={low:512,medium:1024,high:2048,ultra:4096};function a(e){return!!(e.castShadow&&e._gpuShadowData&&e._worldVisible&&e._shadowDataIndex>=0)}function o(e){let t=e.cascades;if(t)for(let e=0;e<t.length;e++)t[e]?.cameraData.destroy();e.cullResults?.release()}function n(e,t,r){return!r&&(0===e||e>1&&t%e!=0)}function l(e,t){return"manual"===e?0:"number"==typeof e?e:e[t]??1}let h=16;function u(e){return"directional"!==e.type||void 0===e.shadow.cascades?1:Math.min(Math.max(e.shadow.cascades,1),4)}function d(e,t){let r=s[e],a=new i.v9C({width:r,height:r,format:"depth32float",scaleMode:"linear",viewDimension:"2d-array",autoGenerateMipmaps:!1,arrayLayerCount:t,compare:"less"});return new i.O0B({colorTextures:0,depthStencilTexture:a})}function c(e,t,r,s){t.getInverse(e.worldTransform);let a=e.range||1e3;if(r.makePerspective(2*e.coneAngle*i.Tde,1,1,a),s){let e=r.elements;e[10]=a/(1-a),e[14]=a/(1-a)}}},54307(e,t,r){function i(e,t,r){let i=r.x,s=r.y,a=r.z,o=e.items,n=e.renderableIndices,l=e.count;for(let e=0;e<l;e++){let r=o[n[e]],l=24*r._storeIndex,h=t[l+12]-i,u=t[l+13]-s,d=t[l+14]-a;r._sortKey=-(h*h+u*u+d*d)}e.sortForced(e=>e._sortKey)}function s(e,t){let r=t.x,i=t.y,s=t.z,a=e.items,o=e.renderableIndices,n=e.count;for(let e=0;e<n;e++){let t=a[o[e]],n=t.worldTransform.elements,l=n[12]-r,h=n[13]-i,u=n[14]-s;t._sortKey=-(l*l+h*h+u*u)}e.sortForced(e=>e._sortKey)}function a(e,t,r,i){let s=t.x,a=t.y,o=t.z,n=i.elements,l=e.items,h=e.renderableIndices,u=e.count;for(let e=0;e<u;e++){let t=l[h[e]],i=24*t._storeIndex,u=r[i+12],d=r[i+13],c=r[i+14],f=n[0]*u+n[4]*d+n[8]*c+n[12],p=n[1]*u+n[5]*d+n[9]*c+n[13],m=n[2]*u+n[6]*d+n[10]*c+n[14],_=f-s,g=p-a,x=m-o;t._sortKey=-(_*_+g*g+x*x)}e.sortForced(e=>e._sortKey)}r.d(t,{Nu:()=>i,OD:()=>a,aH:()=>s})},67882(e,t,r){r.d(t,{a:()=>i});function i(e){return e.bindGroups.map(e=>"string"==typeof e?{name:e,ubo:!1}:{name:e.name,ubo:e.ubo??!1})}},63116(e,t,r){r.d(t,{X:()=>n});var i=r(87160),s=r(5086);let a=0,o=new WeakMap;var n=class{bitsGpu;bitsGl;template;overrides;outputLocations;includeGlobal;includeCamera;keyGpu;keyGl;constructor(e){this.bitsGpu=e.bitsGpu??[],this.bitsGl=e.bitsGl??[],this.template=e.template,this.overrides=e.overrides,this.outputLocations=e.outputLocations??s.n,this.includeGlobal=e.includeGlobal,this.includeCamera=e.includeCamera,this._updateKeys()}update(e){return this.bitsGpu=e.bitsGpu??[],this.bitsGl=e.bitsGl??[],this.template=e.template,this.overrides=e.overrides,this.outputLocations=e.outputLocations??s.n,this.includeGlobal=e.includeGlobal,this.includeCamera=e.includeCamera,this._updateKeys(),this}_updateKeys(){for(let e=0;e<this.bitsGpu.length;e++)(0,i.U)(this.bitsGpu[e]);for(let e=0;e<this.bitsGl.length;e++)(0,i.U)(this.bitsGl[e]);let e=this.bitsGpu.map(e=>e.name).join("|"),t=this.bitsGl.map(e=>e.name).join("|");if(this.overrides){let r=Object.entries(this.overrides).map(([e,t])=>`${e}=${t}`).join(",");e+=`[${r}]`,t+=`[${r}]`}if(this.outputLocations!==s.n){let r=o.get(this.outputLocations);void 0===r&&(r=`|out:${this.outputLocations.join(",")}`,o.set(this.outputLocations,r)),e+=r,t+=r}if(this.template){let r=this.template._uid??=a++;e+=`|tpl:${r}`,t+=`|tpl:${r}`}this.keyGpu=e,this.keyGl=t}}},87160(e,t,r){r.d(t,{U:()=>o,y:()=>h});var i=r(67882);let s=new Map;function a(e){return e._contentSnapshot??=JSON.stringify(e,(e,t)=>e.startsWith("_")?void 0:t)}function o(e){if(e._identityChecked)return;let t=s.get(e.name);if(void 0===t||t===e||a(t)===a(e)){s.set(e.name,e),e._identityChecked=!0;return}throw Error(`[bitRegistry] Two different shader bits share the name '${e.name}'. Bit names are shader-cache identities, so this would silently serve one bit's compiled shader for the other. Rename one of them \u{2014} or, if you didn't define a second '${e.name}', two copies of a module/library are loaded.`)}let n=[{name:"global",ubo:!0},{name:"camera",ubo:!1},{name:"batch",ubo:!1}];function l(e){return e.ubo?`\`{ name: '${e.name}', ubo: true }\``:`\`'${e.name}'\``}function h(e,t){let r=(0,i.a)(t);for(let t of n){let{name:i,ubo:s}=t,a=r.find(e=>e.name===i),o=e.find(e=>e.bindings?.[i]);if(o&&!a)throw Error(`The shader bit '${o.name}' declares the '${i}' bind group, but the shader template doesn't list it. Add ${l(t)} to the template's \`bindGroups\`.`);if("camera"===i&&a&&!o)throw Error("The shader template lists a 'camera' bind group but no bit declares it. Leave `includeCamera` on (the default), or list `cameraBit` in the descriptor.");if(a&&a.ubo!==s)throw Error(`The shader template lists the '${i}' bind group ${s?"without":"with"} \`ubo: true\`. List it as ${l(t)} in \`bindGroups\`, because the engine binds '${i}' as ${s?"one uniform block":"plain uniforms"} on WebGL.`)}}},85277(e,t,r){r.d(t,{R:()=>i});let i={name:"alphaOpaque",gpu:{fragment:{end:`
  alpha = 1.0;
`}},gl:{fragment:{end:`
  alpha = 1.0;
`}}}},31360(e,t,r){r.d(t,{R5:()=>u,am:()=>o,fW:()=>n});var i=r(26751),s=r(99897);function a(e,t){let r=`anisotropy${e?":texture":""}${t?":tangent":""}`,a=e?`
  let anisoSample = sampleAnisotropy(input.vUV);
  let anisoDirRaw = anisoSample.rg * 2.0 - 1.0;
  let anisoTexStrength = anisoSample.b;
`:`
  let anisoDirRaw = vec2<f32>(1.0, 0.0);
  let anisoTexStrength = 1.0;
`,o=e?`
  vec4 anisoSample = sampleAnisotropy(vUV);
  vec2 anisoDirRaw = anisoSample.rg * 2.0 - 1.0;
  float anisoTexStrength = anisoSample.b;
`:`
  vec2 anisoDirRaw = vec2(1.0, 0.0);
  float anisoTexStrength = 1.0;
`,n=t?`
  let anisoTw = normalize(input.vAnisoTangent);
  let anisoBw = normalize(input.vAnisoBitangent);
  let anisoT = normalize(anisoDir.x * anisoTw + anisoDir.y * anisoBw);
`:`
  let anisoTBN = calculateTBN(anisoGeoN, input.vPosition, input.vUV);
  let anisoT = normalize(anisoTBN * vec3<f32>(anisoDir, 0.0));
`,l=t?`
  vec3 anisoTw = normalize(vAnisoTangent);
  vec3 anisoBw = normalize(vAnisoBitangent);
  vec3 anisoT = normalize(anisoDir.x * anisoTw + anisoDir.y * anisoBw);
`:`
  mat3 anisoTBN = calculateTBN(anisoGeoN, vPosition, vUV);
  vec3 anisoT = normalize(anisoTBN * vec3(anisoDir, 0.0));
`,h={name:r,requires:t?[s.L]:[s.L,i.j],textures:e?["anisotropy"]:[],bindings:{material:{anisotropyParams:"vec4<f32>"}},gpu:{fragment:{material:`
${a}
  let anisoRot = material.anisotropyParams.y;
  let anisoC = cos(anisoRot);
  let anisoS = sin(anisoRot);
  let anisoDir = vec2<f32>(
    anisoDirRaw.x * anisoC - anisoDirRaw.y * anisoS,
    anisoDirRaw.x * anisoS + anisoDirRaw.y * anisoC,
  );
  let anisoStrength = clamp(material.anisotropyParams.x * anisoTexStrength, 0.0, 1.0);

  let anisoGeoN = normalize(select(-input.vNormal, input.vNormal, input.frontFacing));
${n}
  let anisoB = normalize(cross(anisoGeoN, anisoT));

  let anisoBentCross = cross(cross(anisoB, viewDir), anisoB);
  let anisoBentLenSq = dot(anisoBentCross, anisoBentCross);
  var anisoBentN = normal;
  if (anisoBentLenSq > 1e-8) {
    anisoBentN = anisoBentCross * inverseSqrt(anisoBentLenSq);
  }
  let anisoBend = 1.0 - anisoStrength * (1.0 - roughness);
  let anisoBend4 = anisoBend * anisoBend * anisoBend * anisoBend;
  specularNormal = normalize(mix(anisoBentN, normal, anisoBend4));
`,lobePreLighting:`
  let anisoAlphaB = a;
  let anisoAlphaT = mix(a, 1.0, anisoStrength * anisoStrength);
  let anisoTdotV = dot(anisoT, viewDir);
  let anisoBdotV = dot(anisoB, viewDir);
`,lobePerLight:`
    {
      let anisoTdotL = dot(anisoT, lightDir);
      let anisoBdotL = dot(anisoB, lightDir);
      let anisoTdotH = dot(anisoT, halfVector);
      let anisoBdotH = dot(anisoB, halfVector);

      let anisoA2 = anisoAlphaT * anisoAlphaB;
      let anisoFv = vec3<f32>(anisoAlphaB * anisoTdotH, anisoAlphaT * anisoBdotH, anisoA2 * nDotH);
      let anisoW2 = anisoA2 / dot(anisoFv, anisoFv);
      let anisoD = anisoA2 * anisoW2 * anisoW2 * INV_PI;

      let anisoGGXV = nDotL * length(vec3<f32>(anisoAlphaT * anisoTdotV, anisoAlphaB * anisoBdotV, nDotV));
      let anisoGGXL = nDotV * length(vec3<f32>(anisoAlphaT * anisoTdotL, anisoAlphaB * anisoBdotL, nDotL));
      let anisoVis = 0.5 / max(anisoGGXV + anisoGGXL, 1e-5);

      let anisoSpec = anisoD * fresnel * anisoVis;
      directLight += (anisoSpec - specular) * radiance * nDotL * shadow;
    }
`}},gl:{fragment:{material:`
${o}
  float anisoRot = material.anisotropyParams.y;
  float anisoC = cos(anisoRot);
  float anisoS = sin(anisoRot);
  vec2 anisoDir = vec2(
    anisoDirRaw.x * anisoC - anisoDirRaw.y * anisoS,
    anisoDirRaw.x * anisoS + anisoDirRaw.y * anisoC
  );
  float anisoStrength = clamp(material.anisotropyParams.x * anisoTexStrength, 0.0, 1.0);

  vec3 anisoGeoN = normalize(gl_FrontFacing ? vNormal : -vNormal);
${l}
  vec3 anisoB = normalize(cross(anisoGeoN, anisoT));

  vec3 anisoBentCross = cross(cross(anisoB, viewDir), anisoB);
  float anisoBentLenSq = dot(anisoBentCross, anisoBentCross);
  vec3 anisoBentN = anisoBentLenSq > 1e-8 ? anisoBentCross * inversesqrt(anisoBentLenSq) : normal;
  float anisoBend = 1.0 - anisoStrength * (1.0 - roughness);
  float anisoBend4 = anisoBend * anisoBend * anisoBend * anisoBend;
  specularNormal = normalize(mix(anisoBentN, normal, anisoBend4));
`,lobePreLighting:`
  float anisoAlphaB = a;
  float anisoAlphaT = mix(a, 1.0, anisoStrength * anisoStrength);
  float anisoTdotV = dot(anisoT, viewDir);
  float anisoBdotV = dot(anisoB, viewDir);
`,lobePerLight:`
    {
      float anisoTdotL = dot(anisoT, lightDir);
      float anisoBdotL = dot(anisoB, lightDir);
      float anisoTdotH = dot(anisoT, halfVector);
      float anisoBdotH = dot(anisoB, halfVector);

      float anisoA2 = anisoAlphaT * anisoAlphaB;
      vec3 anisoFv = vec3(anisoAlphaB * anisoTdotH, anisoAlphaT * anisoBdotH, anisoA2 * nDotH);
      float anisoW2 = anisoA2 / dot(anisoFv, anisoFv);
      float anisoD = anisoA2 * anisoW2 * anisoW2 * INV_PI;

      float anisoGGXV = nDotL * length(vec3(anisoAlphaT * anisoTdotV, anisoAlphaB * anisoBdotV, nDotV));
      float anisoGGXL = nDotV * length(vec3(anisoAlphaT * anisoTdotL, anisoAlphaB * anisoBdotL, nDotL));
      float anisoVis = 0.5 / max(anisoGGXV + anisoGGXL, 1e-5);

      vec3 anisoSpec = anisoD * fresnel * anisoVis;
      directLight += (anisoSpec - specular) * radiance * nDotL * shadow;
    }
`}}};return t&&(h.attributes={aTangent:"float32x4"},h.interStage={vAnisoTangent:"vec3<f32>",vAnisoBitangent:"vec3<f32>"},h.gpu.vertex={input:"  tangent = input.aTangent.xyz;",end:`
  let anisoWorldT = normalize(modelMatrix3 * tangent);
  output.vAnisoTangent = anisoWorldT;
  output.vAnisoBitangent = cross(worldNormal, anisoWorldT) * input.aTangent.w;
`},h.gl.vertex={input:"  tangent = aTangent.xyz;",end:`
  vec3 anisoWorldT = normalize(modelMatrix3 * tangent);
  vAnisoTangent = anisoWorldT;
  vAnisoBitangent = cross(worldNormal, anisoWorldT) * aTangent.w;
`}),h}let o=a(!1,!1),n=a(!0,!1),l=a(!1,!0),h=a(!0,!0);function u(e){return e===o?l:e===n?h:e}},62411(e,t,r){r.d(t,{p:()=>s});var i=r(21657);let s={name:"camera",bindings:{camera:{uCameraPosition:"vec3<f32>",uViewMatrix:"mat4x4<f32>",uProjectionMatrix:"mat4x4<f32>",uViewProjectionMatrix:"mat4x4<f32>",uPreviousViewProjectionMatrix:"mat4x4<f32>",uViewportUVScale:"vec2<f32>",uLightTileTransform:"vec4<f32>",uLightTiles:`array<vec4<i32>, ${i.Wq}>`,uLightDepthMasks:`array<vec4<i32>, ${i.Fm}>`,uLightDepthPlane:"vec4<f32>"}}}},70930(e,t,r){r.d(t,{F:()=>l,f:()=>n});var i=r(18669);function s(e,t,r,i){return{name:e,gpu:{header:`
fn decodeColor(c: vec3<f32>) -> vec3<f32> { return ${t.replace("VEC3","vec3<f32>")}; }
fn inputTint(linearTint: vec4<f32>, displayTint: vec4<f32>) -> vec4<f32> { return ${r}Tint; }
fn inputExposure(linearExposure: f32, displayExposure: f32) -> f32 { return ${r}Exposure; }
fn decodeFrame(c: vec3<f32>) -> vec3<f32> { return ${i.replace("VEC3","vec3<f32>")}; }
`},gl:{header:`
vec3 decodeColor(vec3 c) { return ${t.replace("VEC3","vec3")}; }
vec4 inputTint(vec4 linearTint, vec4 displayTint) { return ${r}Tint; }
float inputExposure(float linearExposure, float displayExposure) { return ${r}Exposure; }
vec3 decodeFrame(vec3 c) { return ${i.replace("VEC3","vec3")}; }
`}}}let a=s("colorSpaceLinear","pow(c, VEC3(2.2))","linear","pow(c, VEC3(2.2))"),o=s("colorSpaceLinearFrames","pow(c, VEC3(2.2))","linear","c"),n=s("colorSpaceDisplay","c","display","c");function l(e,t,r){if(!t)return o;let s=e._skipsToneCurve||t===i.G;return"display"!==e.colorSpace||e.lit||!s||r?a:n}},73390(e,t,r){r.d(t,{P:()=>o,s:()=>a});let i={name:"decodeToLinearSrgb",gpu:{header:"fn decodeToLinear(c: vec3<f32>) -> vec3<f32> { return pow(c, vec3<f32>(2.2)); }"},gl:{header:"vec3 decodeToLinear(vec3 c) { return pow(c, vec3(2.2)); }"}},s={name:"decodeToLinearNone",gpu:{header:"fn decodeToLinear(c: vec3<f32>) -> vec3<f32> { return c; }"},gl:{header:"vec3 decodeToLinear(vec3 c) { return c; }"}};function a(e){return e?i:s}function o(e){return e.includes("float")||e.endsWith("-srgb")}},26751(e,t,r){r.d(t,{j:()=>i});let i={name:"derivativeTangentFrame",gpu:{header:`
fn calculateTBN(surfaceNormal: vec3<f32>, position: vec3<f32>, texCoord: vec2<f32>) -> mat3x3<f32> {
  let dp1 = dpdx(position);
  let dp2 = dpdy(position);
  let duv1 = dpdx(texCoord);
  let duv2 = dpdy(texCoord);

  let dp2perp = cross(dp2, surfaceNormal);
  let dp1perp = cross(surfaceNormal, dp1);
  let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
  let bitangent = -(dp2perp * duv1.y + dp1perp * duv2.y);

  let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
  let scale = select(invmax, -invmax, dot(dp1, dp2perp) < 0.0);
  return mat3x3<f32>(tangent * scale, bitangent * scale, surfaceNormal);
}
`},gl:{fragment:{header:`
mat3 calculateTBN(highp vec3 surfaceNormal, highp vec3 position, highp vec2 texCoord) {
  highp vec3 dp1 = dFdx(position);
  highp vec3 dp2 = dFdy(position);
  highp vec2 duv1 = dFdx(texCoord);
  highp vec2 duv2 = dFdy(texCoord);

  highp vec3 dp2perp = cross(dp2, surfaceNormal);
  highp vec3 dp1perp = cross(surfaceNormal, dp1);
  highp vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
  highp vec3 bitangent = -(dp2perp * duv1.y + dp1perp * duv2.y);

  highp float invmax = inversesqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
  highp float scale = dot(dp1, dp2perp) < 0.0 ? -invmax : invmax;
  return mat3(tangent * scale, bitangent * scale, surfaceNormal);
}
`}}}},12939(e,t,r){r.d(t,{v:()=>i});let i={name:"doubleSidedNormal",gpu:{fragment:{material:`
  normal = select(-normal, normal, input.frontFacing);
`}},gl:{fragment:{material:`
  if (!gl_FrontFacing) {
    normal = -normal;
  }
`}}}},52381(e,t,r){r.d(t,{j:()=>i});let i={name:"flatShading",gpu:{fragment:{material:`
  let flatNormal = normalize(cross(dpdx(input.vPosition), dpdy(input.vPosition)));
  normal = select(-flatNormal, flatNormal, dot(flatNormal, normal) >= 0.0);
`}},gl:{fragment:{material:`
  vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  normal = dot(flatNormal, normal) >= 0.0 ? flatNormal : -flatNormal;
`}}}},16875(e,t,r){r.d(t,{j:()=>i});let i={name:"iblSamplingFuncs",requires:[r(99897).L],gpu:{header:`
fn radicalInverseVdC(bits_in: u32) -> f32 {
  var bits = bits_in;
  bits = (bits << 16u) | (bits >> 16u);
  bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
  bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
  bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
  bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
  return f32(bits) * 2.3283064365386963e-10;
}

fn hammersley(i: u32, N: u32) -> vec2<f32> {
  return vec2<f32>(f32(i) / f32(N), radicalInverseVdC(i));
}

fn importanceSampleGGX(Xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
  let a = roughness * roughness;

  let phi = 2.0 * PI * Xi.x;
  let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
  let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  let H = vec3<f32>(
    cos(phi) * sinTheta,
    sin(phi) * sinTheta,
    cosTheta
  );

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
float radicalInverseVdC(uint bits) {
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10;
}

vec2 hammersley(uint i, uint N) {
    return vec2(float(i) / float(N), radicalInverseVdC(i));
}

vec3 importanceSampleGGX(vec2 Xi, vec3 N, float roughness) {
    float a = roughness * roughness;

    float phi = 2.0 * PI * Xi.x;
    float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
    float sinTheta = sqrt(1.0 - cosTheta * cosTheta);

    vec3 H = vec3(
        cos(phi) * sinTheta,
        sin(phi) * sinTheta,
        cosTheta
    );

    vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);

    vec3 sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
    return normalize(sampleVec);
}
`}}},71075(e,t,r){r.d(t,{V:()=>o});var i=r(39997),s=r(76972);let a=new Map;function o(e,t){let r=(0,s.sL)(e).length,o="direct"===t&&Object.keys((0,i.R)(e)).length>0,n=`${r}|${t}|${o}`,l=a.get(n);if(l)return l;let h=Object.fromEntries(Array.from({length:r},(e,t)=>t).flatMap(e=>[[`uMaterialTexture${e}`,"texture_2d<f32>"],[`uMaterialSampler${e}`,"sampler"]]));return o&&(h.material="uniform<Material>"),l={name:`materialBindings:${r}:${t}${o?":material":""}`,bindings:{batch:h}},a.set(n,l),l}},99897(e,t,r){r.d(t,{L:()=>i});let i={name:"mathConstants",gpu:{header:`
const PI: f32 = 3.14159265359;
const INV_PI: f32 = 0.31830988618;
`},gl:{header:`
const float PI = 3.14159265359;
const float INV_PI = 0.31830988618;
`}}},57941(e,t,r){r.d(t,{_:()=>o});let i=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,s=`
  worldNormal = bbRight * normal.x + bbUp * normal.y + bbNormal * normal.z;
`,a=Object.create(null);function o(e,t){let r=`${e}:${t}`,o=a[r];if(o)return o;if("none"===e)throw Error("[meshBillboardBits] billboardMode 'none' has no bit \u2014 the caller must skip injection.");let n="spherical"===e,l={name:`meshBillboard${n?"Spherical":"Cylindrical"}${t?"Lit":""}`,gpu:{vertex:{afterTransform:n?`
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
${t?i:""}`:`
  let bbColX = modelMatrix[0].xyz;
  let bbColY = modelMatrix[1].xyz;
  let bbScaleX = length(bbColX);
  let bbScaleY = length(bbColY);
  let bbScaleZ = length(modelMatrix[2].xyz);
  let bbCentre = modelMatrix[3].xyz;

  var bbUp = vec3<f32>(0.0, 1.0, 0.0);
  if (bbScaleY > 1e-8) { bbUp = bbColY / bbScaleY; }

  let bbToCam = camera.uCameraPosition - bbCentre;
  let bbFlat = bbToCam - bbUp * dot(bbToCam, bbUp);
  let bbFlatLenSq = dot(bbFlat, bbFlat);

  var bbRight = vec3<f32>(1.0, 0.0, 0.0);
  if (bbFlatLenSq > 1e-8) {
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
${t?i:""}`}},gl:{vertex:{afterTransform:n?`
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
${t?s:""}`:`
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
${t?s:""}`}}};return a[r]=l,l}},54355(e,t,r){r.d(t,{d:()=>i});let i={name:"no-shadow",gpu:{header:`
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
    `}}},35859(e,t,r){r.d(t,{d:()=>i});let i={name:"normal",attributes:{aNormal:"float32x3"},gpu:{vertex:{input:"normal = input.aNormal;"}},gl:{vertex:{input:"normal = aNormal;"}}}},79377(e,t,r){r.d(t,{x:()=>i});let i={name:"normalMapping",requires:[r(26751).j],gpu:{fragment:{material:`
  let normalMapSample = sampleNormal(input.vUV).rgb;
  var tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal = vec3<f32>(tangentNormal.xy * material.normalScale, tangentNormal.z);
  let tbnMatrix = calculateTBN(normal, input.vPosition, input.vUV);
  normal = normalize(tbnMatrix * tangentNormal);
`}},gl:{fragment:{material:`
  {
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = calculateTBN(normal, vPosition, vUV);
  normal = normalize(tbnMatrix * tangentNormal);
  }
`}}}},89983(e,t,r){r.d(t,{z:()=>a});var i=r(54537);let s=Object.create(null);function a(e){let t=s[e];if(t)return t;if((0,i.m7n)(e).size<3)throw Error(`[positionBit] aPosition needs three components, got ${e}`);let r="float32x3"===e?"aPosition":"aPosition.xyz",a={name:`position:${e}`,attributes:{aPosition:e},gpu:{vertex:{input:`position = vec4<f32>(vec3<f32>(input.${r}), 1.0);`}},gl:{vertex:{input:`position = vec4(vec3(${r}), 1.0);`}}};return s[e]=a,a}},74342(e,t,r){r.d(t,{G8:()=>i,IN:()=>s,Rx:()=>o,b1:()=>l,gT:()=>n,ni:()=>h,p9:()=>a});let i={transform:"mat4x4<f32>",bonePitIndex:"u32",materialIndex:"u32",geometryDataIndex:"u32",visibility:"u32",morphWeightIndex:"u32"},s={boundsCenter:"vec3<f32>",boundsRadius:"f32",morphDeltaBase:"u32",morphTargetCount:"u32",baseVertex:"u32",_pad:"u32"},a={id:"u32"},o={rows:"mat3x4<f32>"},n={position:"vec3<f32>",kind:"f32",color:"vec3<f32>",rangeSq:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",cascadeCount:"f32",radiusPow4:"f32"},l={position:"vec3<f32>",type:"f32",color:"vec3<f32>",rangeSq:"f32",direction:"vec3<f32>",coneCos:"f32",innerConeCos:"f32",shadowDataIndex:"f32",radiusPow4:"f32"},h={lightSpaceMatrix:"mat4x4<f32>",shadowParams:"vec4<f32>",cascadeSplits:"vec4<f32>"}},84897(e,t,r){r.d(t,{u:()=>i});let i={hard:[[0,0]],pcf:[[-1,-1],[1,-1],[-1,1],[1,1]],"pcf-high":[[-2,-2],[0,-2],[2,-2],[-2,0],[0,0],[2,0],[-2,2],[0,2],[2,2]]}},54544(e,t,r){r.d(t,{e:()=>i});let i={name:"tangentNormalMapping",attributes:{aTangent:"float32x4"},interStage:{vTangent:"vec3<f32>",vBitangent:"vec3<f32>"},gpu:{vertex:{input:`
    tangent = input.aTangent.xyz;
  `,end:`
  let worldTangent = normalize(modelMatrix3 * tangent);
  let worldBitangent = cross(worldNormal, worldTangent) * input.aTangent.w;
  output.vTangent = worldTangent;
  output.vBitangent = worldBitangent;
`},fragment:{material:`
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
  vec3 worldTangent = normalize(modelMatrix3 * tangent);
  vec3 worldBitangent = cross(worldNormal, worldTangent) * aTangent.w;
  vTangent = worldTangent;
  vBitangent = worldBitangent;
`},fragment:{material:`
  vec3 normalMapSample = sampleNormal(vUV).rgb;
  vec3 tangentNormal = normalMapSample * 2.0 - 1.0;
  tangentNormal.xy *= material.normalScale;
  mat3 tbnMatrix = mat3(
    normalize(vTangent),
    normalize(vBitangent),
    normal
  );
  normal = normalize(tbnMatrix * tangentNormal);
`}}}},18669(e,t,r){r.d(t,{G:()=>i});let i={name:"srgbEncode",gpu:{fragment:{end:`
  finalColor = pow(finalColor, vec3<f32>(1.0 / 2.2));
`}},gl:{fragment:{end:`
  finalColor = pow(finalColor, vec3(1.0 / 2.2));
`}}}},77869(e,t,r){r.d(t,{w:()=>n,X:()=>i});let i={aces:{name:"acesToneMapping",gpu:{header:`
fn acesTonemap(linearColor: vec3<f32>) -> vec3<f32> {
  let inMat = mat3x3<f32>(
    vec3<f32>(0.59719, 0.07600, 0.02840),
    vec3<f32>(0.35458, 0.90834, 0.13383),
    vec3<f32>(0.04823, 0.01566, 0.83777),
  );
  let outMat = mat3x3<f32>(
    vec3<f32>(1.60475, -0.10208, -0.00327),
    vec3<f32>(-0.53108, 1.10813, -0.07276),
    vec3<f32>(-0.07367, -0.00605, 1.07602),
  );

  var color = inMat * (linearColor * (1.0 / 0.6));

  let a = color * (color + vec3<f32>(0.0245786)) - vec3<f32>(0.000090537);
  let b = color * (0.983729 * color + vec3<f32>(0.4329510)) + vec3<f32>(0.238081);
  color = a / b;

  return clamp(outMat * color, vec3<f32>(0.0), vec3<f32>(1.0));
}
`,fragment:{end:`
  finalColor = acesTonemap(finalColor);
  finalColor = pow(finalColor, vec3<f32>(1.0 / 2.2));
`}},gl:{header:`
vec3 acesTonemap(vec3 linearColor) {
  const mat3 inMat = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outMat = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );

  vec3 color = inMat * (linearColor * (1.0 / 0.6));

  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  color = a / b;

  return clamp(outMat * color, 0.0, 1.0);
}
`,fragment:{end:`
  finalColor = acesTonemap(finalColor);
  finalColor = pow(finalColor, vec3(1.0 / 2.2));
`}}},reinhard:{name:"reinhardToneMapping",gpu:{fragment:{end:`
  finalColor = finalColor / (finalColor + vec3<f32>(1.0));

  finalColor = pow(finalColor, vec3<f32>(1.0 / 2.2));
`}},gl:{fragment:{end:`
  finalColor = finalColor / (finalColor + vec3(1.0));

  finalColor = pow(finalColor, vec3(1.0 / 2.2));
`}}},uncharted2:{name:"uncharted2ToneMapping",gpu:{header:`
fn uncharted2Curve(x: vec3<f32>) -> vec3<f32> {
  let A = 0.15;
  let B = 0.50;
  let C = 0.10;
  let D = 0.20;
  let E = 0.02;
  let F = 0.30;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

fn uncharted2Tonemap(color: vec3<f32>) -> vec3<f32> {
  let exposureBias = 2.0;
  let W = vec3<f32>(11.2);
  let curr = uncharted2Curve(color * exposureBias);
  let whiteScale = vec3<f32>(1.0) / uncharted2Curve(W);
  return curr * whiteScale;
}
`,fragment:{end:`
  finalColor = uncharted2Tonemap(finalColor);

  finalColor = pow(finalColor, vec3<f32>(1.0 / 2.2));
`}},gl:{header:`
vec3 uncharted2Curve(vec3 x) {
  float A = 0.15;
  float B = 0.50;
  float C = 0.10;
  float D = 0.20;
  float E = 0.02;
  float F = 0.30;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

vec3 uncharted2Tonemap(vec3 color) {
  float exposureBias = 2.0;
  vec3 W = vec3(11.2);
  vec3 curr = uncharted2Curve(color * exposureBias);
  vec3 whiteScale = vec3(1.0) / uncharted2Curve(W);
  return curr * whiteScale;
}
`,fragment:{end:`
  finalColor = uncharted2Tonemap(finalColor);

  finalColor = pow(finalColor, vec3(1.0 / 2.2));
`}}},none:r(18669).G,custom:null},s={name:"outputStraightColor",gpu:{fragment:{end:"finalColor = select(finalColor, finalColor / fxColor.a, fxColor.a > 0.0001);"}},gl:{fragment:{end:"finalColor = fxColor.a > 0.0001 ? finalColor / fxColor.a : finalColor;"}}},a={name:"outputPremultiplyColor",gpu:{fragment:{end:"finalColor = select(finalColor, finalColor * fxColor.a, fxColor.a > 0.0001);"}},gl:{fragment:{end:"finalColor = fxColor.a > 0.0001 ? finalColor * fxColor.a : finalColor;"}}},o={name:"outputDither",gpu:{fragment:{end:"finalColor += (fract(52.9829189 * fract(dot(input.position.xy, vec2<f32>(0.06711056, 0.00583715)))) - 0.5) / 255.0 * fxColor.a;"}},gl:{fragment:{end:"finalColor += (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0 * fxColor.a;"}}};function n(e){let t=e?i[e]:null;return t?[s,t,a,o]:[]}},30710(e,t,r){r.d(t,{q:()=>s});let i=Object.create(null);function s(e){let t=i[e];if(t)return t;let r={name:`uvs:${e}`,overrideDefs:{HAS_UVS:{type:"u32",required:!0}},attributes:{aUV:e},gpu:{vertex:{input:"uv = vec2<f32>(input.aUV);"}},gl:{vertex:{input:"uv = vec2(aUV);"}}};return i[e]=r,r}},85623(e,t,r){r.d(t,{$:()=>i});let i={name:"vertexColor",attributes:{aColor:"float32x4"},interStage:{vColor:"vec4<f32>"},gpu:{vertex:{end:"output.vColor = input.aColor;"},fragment:{material:`albedo *= input.vColor.rgb;
  alpha *= input.vColor.a;`}},gl:{vertex:{end:"vColor = aColor;"},fragment:{material:`albedo *= vColor.rgb;
  alpha *= vColor.a;`}}}},59670(e,t,r){r.d(t,{d:()=>a});let i=/^[a-z][A-Za-z0-9]*$/,s=new Set("const uniform buffer shared coherent volatile restrict readonly writeonly layout centroid flat smooth patch sample invariant precise break continue do for while switch case default if else in out inout int void bool true false float discard return vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 uint uvec2 uvec3 uvec4 mat2 mat3 mat4 mat2x2 mat2x3 mat2x4 mat3x2 mat3x3 mat3x4 mat4x2 mat4x3 mat4x4 lowp mediump highp precision sampler2D sampler2DShadow sampler2DArray sampler2DArrayShadow isampler2D isampler2DArray usampler2D usampler2DArray sampler2DMS isampler2DMS usampler2DMS sampler2DMSArray isampler2DMSArray usampler2DMSArray sampler3D isampler3D usampler3D samplerCube samplerCubeShadow isamplerCube usamplerCube samplerCubeArray samplerCubeArrayShadow isamplerCubeArray usamplerCubeArray samplerBuffer isamplerBuffer usamplerBuffer image2D iimage2D uimage2D image2DArray iimage2DArray uimage2DArray image3D iimage3D uimage3D imageCube iimageCube uimageCube imageCubeArray iimageCubeArray uimageCubeArray imageBuffer iimageBuffer uimageBuffer struct attribute varying noperspective subroutine common partition active asm class union enum typedef template this resource goto inline noinline public static extern external interface long short half fixed unsigned superp double input output hvec2 hvec3 hvec4 fvec2 fvec3 fvec4 dvec2 dvec3 dvec4 dmat2 dmat3 dmat4 dmat2x2 dmat2x3 dmat2x4 dmat3x2 dmat3x3 dmat3x4 dmat4x2 dmat4x3 dmat4x4 filter sizeof cast namespace using sampler1D sampler1DShadow sampler1DArray sampler1DArrayShadow isampler1D isampler1DArray usampler1D usampler1DArray sampler2DRect sampler2DRectShadow isampler2DRect usampler2DRect sampler3DRect image1D iimage1D uimage1D image1DArray iimage1DArray uimage1DArray image2DRect iimage2DRect uimage2DRect image2DMS iimage2DMS uimage2DMS image2DMSArray iimage2DMSArray uimage2DMSArray alias break case const continue continuing default diagnostic discard else enable false fn for if let loop override requires return struct switch true var while abstract active alignas alignof as asm async attribute auto await become cast catch class coherent common compile concept consteval constexpr constinit crate debugger decltype delete demote do enum explicit export extends extern external fallthrough filter final finally friend from fxgroup get goto groupshared highp impl implements import inline instanceof interface layout lowp macro match mediump meta mod module move mut mutable namespace new nil noexcept noinline nointerpolation noncoherent noperspective null nullptr of operator package packoffset partition pass patch pixelfragment precise precision premerge priv protected pub public readonly ref regardless register require resource restrict self set shared sizeof smooth snorm static std subroutine super target template this throw trait try type typedef typeid typename typeof union unless unorm unsafe unsized use using varying virtual volatile wgsl where with writeonly yield".split(" "));function a(e,t){if(!i.test(e))throw Error(`${t}: '${e}' can't name a fragment output. Start it with a lowercase letter and use only letters and digits, such as "velocity" or "objectId".`);if(s.has(e))throw Error(`${t}: '${e}' can't name a fragment output, because WGSL or GLSL reserves the word. Pick another name, such as one with a prefix.`)}},5086(e,t,r){r.d(t,{n:()=>s,r:()=>a});var i=r(59670);let s=Object.freeze(["color"]);function a(e){let t=Object.create(null),r=Object.create(null);for(let s of e)if(s.outputs)for(let[e,a]of Object.entries(s.outputs)){let o=t[e];if(void 0===o)(0,i.d)(e,`Bit '${s.name}'`),t[e]=a,r[e]=s.name;else if(o!==a)throw Error(`[collectFragmentOutputs] Output "${e}" is "${o}" in bit "${r[e]}" and "${a}" in bit "${s.name}". Bits that share an output must agree on its type.`)}return t}},62815(e,t,r){r.d(t,{Y:()=>i});function i(e,t,r){let i={};for(let s of e){let e=s[t]?.[r];if(e)for(let[t,r]of Object.entries(e))r&&(i[t]??=[],i[t].push(r))}return i}},33607(e,t,r){r.d(t,{m:()=>a});let i=/\{\{(.*?)\}\}/g,s=new Map;function a(e){let t=s.get(e);if(!t){let r;t=new Set(Object.keys((r={},(e.match(i)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{r[e]=[]}),r))),s.set(e,t)}return t}},92741(e,t,r){r.d(t,{D3:()=>s,Jg:()=>a,sU:()=>h});var i=r(68246);function s(e){for(let t=0;t<e.length;t++)if(e[t].bindings?.instance)return!0;return!1}function a(e){return`vInstance_${e}`}let o=/\binstance\b(?:\s*\.\s*([A-Za-z]\w*))?/g,n=/\/\/[^\n]*|\/\*[\s\S]*?\*\//g;function l(e,t,r,i,s){for(let a of e){let e=a[t]?.[r];if(e)for(let t in e){let r=e[t];if(r)for(let e of r.replace(n,"").matchAll(o))if(void 0===e[1])for(let e in i)s.add(e);else e[1]in i&&s.add(e[1])}}}function h(e,t,r,s){if(!r){let t=e.find(e=>e.bindings?.instance);throw Error(`[instanceData] Bit "${t?.name}" reads instance data, but the mesh it draws has none. Draw it as a BatchedMesh3D slot and declare the fields in the batch's instanceData option.`)}let a={};for(let t of e){let e=t.bindings?.instance;if(e)for(let{name:s,spec:o}of(0,i.vu)(e,"instance")){let e=(0,i.Ac)(o),n=r.struct[s];if(n!==e)throw Error(`[instanceData] Bit "${t.name}" reads instance.${s} as ${e}, but the batch `+(n?`declares it as ${n}.`:`has no such field. Its instanceData is: ${r.key}.`));a[s]=n}}let o=new Set;l(e,t,"fragment",a,o);let n=new Set(o);l(e,t,"vertex",a,n);let h={layout:r,loaded:n,varyings:[...o]};return function(e,t,r){let i=r.varyings.length>0,s=null;if("gpu"===t){let t=e.gpu??"";t.includes("{{vertexStoreAccess}}")?i&&!t.includes("{{fragmentStoreAccess}}")&&(s="{{fragmentStoreAccess}}"):s="{{vertexStoreAccess}}"}else e.gl?.vertex.includes("{{storeAccess}}")?i&&!e.gl.fragment.includes("{{storeAccess}}")&&(s="{{storeAccess}} in its fragment source"):s="{{storeAccess}} in its vertex source";if(s)throw Error(`[instanceData] A bit reads instance data, but the shader template has no ${s}. Add the slot where the draw's store row is in scope, or use the material's own template.`)}(s,t,h),h}},39997(e,t,r){r.d(t,{F:()=>n,R:()=>o});var i=r(54537),s=r(68246);let a=new Set(["f32","vec2<f32>","vec3<f32>","vec4<f32>","mat2x2<f32>","u32","i32"]);function o(e){let t={};for(let r of e){let e=r.bindings?.material;if(e)for(let{name:o,spec:n}of(0,s.vu)(e,"material")){let e=(0,s.Ac)(n);if(s.Rx.has(e)||(0,s.yp)(e)||(0,s.NI)(e))continue;if(!a.has(e))throw Error(`[mergeMaterialStruct] Material field "${o}" in bit "${r.name}" is "${e}". Material fields must be f32, u32, i32, a vec2, vec3 or vec4 of f32, or mat2x2<f32>.`);let l=t[o];void 0===l?t[o]=e:l!==e&&(0,i.R8M)(`[mergeMaterialStruct] Material field "${o}" redefined by bit "${r.name}" with a different type: "${l}" \u{2192} "${e}". Keeping original.`)}}return function(e){let t=Object.keys(e).map((t,r)=>{let s=i.fgH[e[t]];return{name:t,align:s?.align??0,size:s?.size??0,index:r}});t.sort((e,t)=>t.align-e.align||t.size-e.size||e.index-t.index);let r=t.filter(e=>e.align>=8),s=t.filter(e=>e.align>0&&e.align<8),a=t.filter(e=>0===e.align),o={},n=0;for(let t of r)if(o[t.name]=e[t.name],16===t.align&&12===t.size&&n<s.length){let t=s[n++];o[t.name]=e[t.name]}for(let t=n;t<s.length;t++)o[s[t].name]=e[s[t].name];for(let t of a)o[t.name]=e[t.name];return o}(t)}function n(e){return JSON.stringify(e)}},32320(e,t,r){r.d(t,{D:()=>s});var i=r(39997);let s={preCompile(e){let t=e.data.structs;t?.Material&&(t.Material=(0,i.R)(e.bits))}}},68246(e,t,r){function i(e){return"string"==typeof e?e:e.type}function s(e){return"string"==typeof e?"both":e.visibility??"both"}function*a(e,t){for(let[r,i]of Object.entries(e))if("object"==typeof i&&"string"!=typeof i.type)for(let[e,t]of Object.entries(i))yield{name:e,spec:t,uniformGroup:r};else yield{name:r,spec:i,uniformGroup:t}}function o(e){return e.charAt(0).toUpperCase()+e.slice(1)}r.d(t,{Ac:()=>i,BI:()=>h,NI:()=>u,Rx:()=>n,ZH:()=>o,iP:()=>s,vu:()=>a,wE:()=>d,yp:()=>l});let n=new Set(["texture_2d<f32>","texture_2d<u32>","texture_2d<i32>","texture_2d_array<f32>","texture_3d<f32>","texture_cube<f32>","texture_cube_array<f32>","texture_depth_2d","texture_depth_2d_array","texture_depth_cube","texture_depth_cube_array","sampler","sampler_comparison"]);function l(e){return/^storage<.*>$/.test(e)}function h(e){let t=e.match(/^storage<(\w+(?:<\w+>)?)>$/);return t?t[1]:null}function u(e){return/^uniform<.*>$/.test(e)}function d(e){let t=e.match(/^uniform<(\w+)>$/);return t?t[1]:null}},78599(e,t,r){r.d(t,{E:()=>s});var i=r(54537);function s(e){let t=[],r=0;for(var s in e){let a=e[s],o=i.fgH[a];o&&(r=Math.ceil(r/o.align)*o.align,t.push({name:s,type:a,offset:r,size:o.size,components:o.size/4}),r+=o.size)}return{elements:t,size:r}}},23101(e,t,r){r.d(t,{h:()=>s});var i=r(78599);function s(e,t){let r=(0,i.E)(e),s=new Map;for(let e of r.elements){var a;if(t&&!t.has(e.name))continue;let r=e.offset/4,i=Math.floor(r/4),o=r%4,n=4===e.components?"":`.${"xyzw".slice(o,o+e.components)}`,l=s.get(i);l||s.set(i,l=[]),l.push({name:e.name,type:e.type,scalar:(a=e.type).includes("u32")?"u32":a.includes("i32")?"i32":"f32",swizzle:n})}return s}},85922(e,t,r){function i(e){let t=Object.create(null);for(let r of e)if(r.overrideDefs)for(let[e,i]of Object.entries(r.overrideDefs)){let s=function(e,t,r){if(!r?.type)throw Error(`[ShaderBit:${e}] overrideDefs.${t} missing 'type'.`);let i=Object.prototype.hasOwnProperty.call(r,"default"),s=!0===r.required;if(i&&s)throw Error(`[ShaderBit:${e}] overrideDefs.${t} cannot specify both 'default' and 'required: true'.`);if(!i&&!s)throw Error(`[ShaderBit:${e}] overrideDefs.${t} must specify either 'default' or 'required: true'.`);if(s)return{type:r.type,required:!0};if("number"!=typeof r.default||!Number.isFinite(r.default))throw Error(`[ShaderBit:${e}] overrideDefs.${t}.default must be a finite number.`);return{type:r.type,default:r.default,required:!1}}(r.name,e,i),a=t[e];if(a&&(a.type!==s.type||a.required!==s.required||!a.required&&a.default!==s.default))throw Error(`[ShaderBit overrides] Duplicate override '${e}' has conflicting definitions.
Existing: ${JSON.stringify(a)}
New (from '${r.name}'): ${JSON.stringify(s)}`);t[e]=a??s}return t}function s(e){let t=[];for(let s of Object.keys(e).sort()){let a=e[s];if(a.required)t.push(`override ${s}: ${a.type};`);else{var r,i;let e=(r=a.type,i=a.default,"u32"===r?`${Math.trunc(i)}u`:"i32"===r?`${Math.trunc(i)}`:Number.isInteger(i)?`${i}.0`:`${i}`);t.push(`override ${s}: ${a.type} = ${e};`)}}return t.length?t.join("\n"):""}function a(e,t){let r=[];for(let s of Object.keys(e).sort()){var i;let a=e[s],o=t[s],n=void 0!==o;if(a.required&&!n)throw Error(`[glslOverrides] required override '${s}' has no value supplied via descriptor.overrides.`);let l=n?o:a.default;r.push(`#define ${s} ${(i=a.type,"u32"===i||"i32"===i?`${Math.trunc(l)}`:Number.isInteger(l)?`${l}.0`:`${l}`)}`)}return r.length?r.join("\n"):""}r.d(t,{OB:()=>s,b7:()=>i,x5:()=>a})},72763(e,t,r){r.d(t,{R:()=>s});let i=/\{\{(.*?)\}\}/g;function s(e,t){for(let r of t)r.collectData?.(e);for(let r of t)r.preCompile?.(e);let r={};for(let i of t){let t=i.injectCode?.(e);if(t)for(let[e,i]of Object.entries(t))i&&/\S/.test(i)&&(r[e]??=[],r[e].push(i))}return function(e,t){let r=e;for(let e=0;e<8;e++){let e=r.replace(i,(e,r)=>{let i=t[r];return i?i.join("\n"):""});if(e===r)break;r=e}let s=r.match(i);if(s){let e=[...new Set(s)].join(", ");throw Error(`[fillTemplateSlots] Slot markers still present after 8 substitution passes: ${e}. A slot's code reintroduces its own marker (directly or via another slot) \u{2014} break the cycle.`)}return r}(e.templateString,r)}},88007(e,t,r){r.d(t,{U:()=>i});function i(e){let t=[],r=new Set;for(let i=0;i<e.length;i++)!function e(t,r,i){if(i.has(t))return;i.add(t);let s=t.requires;if(s)for(let t=0;t<s.length;t++)e(s[t],r,i);r.push(t)}(e[i],t,r);return t}},80785(e,t,r){r.d(t,{b:()=>a,r:()=>s});var i=r(54537);function s(e,t){if(e.type===i.W3c.WEBGL&&!e.context.extensions.colorBufferFloat)throw Error(`${t}: this WebGL 2 device has no EXT_color_buffer_float, so it cannot draw into a float texture.`)}function a(e){return e.type!==i.W3c.WEBGPU||e.gpu.device.features.has("rg11b10ufloat-renderable")?"rg11b10ufloat":"rgba16float"}},55447(e,t,r){r.d(t,{G:()=>l});var i=r(711);let s={x:0,y:1,z:0};var a=r(54537);let o=new a.Q1f,n=new a.Q1f;function l(e,t,r,a){let l=e.intensity??1;(0,i.Og)(t,0,o.setValue(e.skyColor),l),(0,i.Og)(r,0,n.setValue(e.groundColor),l);let h=e.up??s,u=h.x*h.x+h.y*h.y+h.z*h.z,d=u>0?1/Math.sqrt(u):0;a[0]=h.x*d,a[1]=h.y*d,a[2]=h.z*d}},89620(e,t,r){r.d(t,{e:()=>l});var i=r(77153),s=r(12385),a=r(54537),o=class{uid=(0,a.LdT)("geometryAtlas");attributeKey;vertexStride=0;_vertexBuffer;_indexBuffer;_retiredBuffers=[];_retiredGeometries=[];_vertexCount=0;_indexCount=0;_deadVertexCount=0;_deadIndexCount=0;_liveAllocations=[];_vertexDirtyMin=1/0;_vertexDirtyMax=-1/0;_indexDirtyMin=1/0;_indexDirtyMax=-1/0;_bufferVersion=0;geometry;_attributeInfo;rebaseIndices;constructor(e){let{referenceGeometry:t,initialVertexCapacity:r=1024,initialIndexCapacity:o=2048,rebaseIndices:n=!1}=e;this.rebaseIndices=n,this.attributeKey=t.attributeKey;let l=t.attributes,h=Object.keys(l).sort();if(!h.some(e=>!l[e].instance))throw Error("GeometryAtlas: reference geometry has no vertex attributes");let u=0;for(let e of(this._attributeInfo=[],h)){let t=l[e];if(t.instance)continue;let r=t.format,s=(0,a.m7n)(r).stride,o=u=(0,i.cF)(u);u+=s,this._attributeInfo.push({name:e,format:r,offset:o,byteSize:s})}this.vertexStride=(0,i.cF)(u),this._vertexBuffer=new s.c({data:new Uint8Array(r*this.vertexStride),usage:a.Sdw.VERTEX|a.Sdw.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._indexBuffer=new s.c({data:new Uint32Array(o),usage:a.Sdw.INDEX|a.Sdw.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this.geometry=this._buildMergedGeometry()}add(e){let t=e._geometryAtlasAllocation;if(t&&t.atlas===this)return t;for(let t in e.attributes)if(e.attributes[t].instance)throw Error(`GeometryAtlas: Cannot add geometry with instance attribute "${t}". The Atlas is for merging vertex data only; instance data would be lost.`);if(e.attributeKey!==this.attributeKey)throw Error(`GeometryAtlas: attribute structure mismatch. Expected "${this.attributeKey}", got "${e.attributeKey}"`);let r=e.vertexCount,i=e.indexBuffer.data,s=i.length,a=this._vertexBuffer.data.byteLength/this.vertexStride,o=this._indexBuffer.data.length,n=this._vertexCount+r>a,l=this._indexCount+s>o;if(n||l){let e=this._vertexCount-this._deadVertexCount,t=this._indexCount-this._deadIndexCount+s<=o;e+r<=a&&t?this.defragment():((this._deadVertexCount>0||this._deadIndexCount>0)&&this.defragment(),this._ensureVertexCapacity(this._vertexCount+r),this._ensureIndexCapacity(this._indexCount+s))}let h=this._vertexCount,u=this._indexCount;this._vertexCount+=r,this._indexCount+=s;let d=this._vertexBuffer.data,c=this._indexBuffer.data,f=this.vertexStride,p=h*f,m=r*f;if(this._matchesAtlasLayout(e)){let t=e.attributes[this._attributeInfo[0].name].buffer.data;d.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}else{let t=new Uint32Array(d.buffer);for(let{name:i,offset:s,byteSize:a}of this._attributeInfo){let o=e.attributes[i],n=o.buffer.data,l=o.stride??a,h=o.offset??0;if(((n.byteOffset|h|l|a)&3)==0){let e=new Uint32Array(n.buffer,n.byteOffset,n.byteLength>>2),i=l>>2,o=f>>2,u=h>>2,d=p+s>>2;for(let s=0;s<r;s++)t[d]=e[u],a>4&&(t[d+1]=e[u+1]),a>8&&(t[d+2]=e[u+2]),a>12&&(t[d+3]=e[u+3]),u+=i,d+=o}else{let e=new Uint8Array(n.buffer,n.byteOffset,n.byteLength),t=h,i=p+s;for(let s=0;s<r;s++){for(let r=0;r<a;r++)d[i+r]=e[t+r];t+=l,i+=f}}}}if(this._markVertexDirty(p,p+m),this.rebaseIndices)for(let e=0;e<s;e++)c[u+e]=i[e]+h;else c.set(i,u);this._markIndexDirty(u,u+s);let _={atlas:this,baseVertex:h,firstIndex:u,indexCount:s,vertexCount:r};return e._geometryAtlasAllocation=_,e._atlasVacated=!1,this._liveAllocations.push(_),_}remove(e){let t=e._geometryAtlasAllocation;if(!t||(e._geometryAtlasAllocation=null,e._atlasVacated=!0,null===this._vertexBuffer))return;this._deadVertexCount+=t.vertexCount,this._deadIndexCount+=t.indexCount;let r=this._liveAllocations.indexOf(t);-1!==r&&this._liveAllocations.splice(r,1)}update(){if(this._vertexDirtyMin<this._vertexDirtyMax){let e=this._vertexDirtyMax-this._vertexDirtyMin;this._vertexBuffer.update(e,this._vertexDirtyMin),this._vertexDirtyMin=1/0,this._vertexDirtyMax=-1/0}if(this._indexDirtyMin<this._indexDirtyMax){let e=4*this._indexDirtyMin,t=(this._indexDirtyMax-this._indexDirtyMin)*4;this._indexBuffer.update(t,e),this._indexDirtyMin=1/0,this._indexDirtyMax=-1/0}}_matchesAtlasLayout(e){let t=e.attributes,r=t[this._attributeInfo[0].name].buffer;for(let e of this._attributeInfo){let i=t[e.name];if(i.buffer!==r||i.stride!==this.vertexStride||(i.offset??0)!==e.offset)return!1}return!0}_buildMergedGeometry(){let e=new a.V23;for(let{name:t,format:r,offset:i}of this._attributeInfo)e.addAttribute(t,{buffer:this._vertexBuffer,format:r,stride:this.vertexStride,offset:i});return e.addIndex(this._indexBuffer),e}_markVertexDirty(e,t){e<this._vertexDirtyMin&&(this._vertexDirtyMin=e),t>this._vertexDirtyMax&&(this._vertexDirtyMax=t)}_markIndexDirty(e,t){e<this._indexDirtyMin&&(this._indexDirtyMin=e),t>this._indexDirtyMax&&(this._indexDirtyMax=t)}_retireCurrentGeometry(){this.geometry&&(this.geometry.indexBuffer=null,this._retiredGeometries.push(this.geometry))}_ensureVertexCapacity(e){let t=this._vertexBuffer.data,r=t.byteLength/this.vertexStride;if(e<=r)return;for(;r<e;)r*=2;let i=new Uint8Array(r*this.vertexStride);i.set(t),this._retiredBuffers.push(this._vertexBuffer),this._vertexBuffer=new s.c({data:i,usage:a.Sdw.VERTEX|a.Sdw.COPY_DST,label:"GeometryAtlas-vertex",shrinkToFit:!1}),this._markVertexDirty(0,this._vertexCount*this.vertexStride),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}_ensureIndexCapacity(e){let t=this._indexBuffer.data,r=t.length;if(e<=r)return;for(;r<e;)r*=2;let i=new Uint32Array(r);i.set(t),this._retiredBuffers.push(this._indexBuffer),this._indexBuffer=new s.c({data:i,usage:a.Sdw.INDEX|a.Sdw.COPY_DST,label:"GeometryAtlas-index",shrinkToFit:!1}),this._markIndexDirty(0,this._indexCount),this._retireCurrentGeometry(),this.geometry=this._buildMergedGeometry(),this._bufferVersion++}destroy(){if(null!==this._vertexBuffer){this.geometry&&(this.geometry.indexBuffer=null),this.geometry?.destroy(!1),this.geometry=null,this._vertexBuffer.destroy(),this._indexBuffer.destroy();for(let e=0;e<this._retiredGeometries.length;e++)this._retiredGeometries[e].destroy(!1);this._retiredGeometries=null;for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers=null,this._vertexBuffer=null,this._indexBuffer=null,this._liveAllocations=null}}defragment(){if(0===this._deadVertexCount&&0===this._deadIndexCount)return;let e=this.vertexStride,t=this._vertexBuffer.data,r=this._indexBuffer.data,i=0,s=0,a=this.rebaseIndices;for(let o of this._liveAllocations){let n=o.baseVertex;if(n!==i){let r=n*e,s=i*e,a=o.vertexCount*e;t.copyWithin(s,r,r+a),o.baseVertex=i}if(i+=o.vertexCount,o.firstIndex!==s&&(r.copyWithin(s,o.firstIndex,o.firstIndex+o.indexCount),o.firstIndex=s),a&&n!==o.baseVertex){let e=o.baseVertex-n;for(let t=0;t<o.indexCount;t++)r[o.firstIndex+t]+=e}s+=o.indexCount}this._markVertexDirty(0,i*e),this._markIndexDirty(0,s),this._vertexCount=i,this._indexCount=s,this._deadVertexCount=0,this._deadIndexCount=0,this._bufferVersion++}};let n=Object.create(null);var l=class e{_atlases=Object.create(null);_rebaseIndices;_bufferVersion=0;constructor(e){this._rebaseIndices=e.rebaseIndices}static from(t){let r=t.rebaseIndices?"rebased":"geometryLocal",i=n[r];return i||(i=new e(t),n[r]=i,a.L3G.register(i)),i}get bufferVersion(){return this._bufferVersion}allocate(e){let t=e.attributeKey,r=this._atlases[t],i=e._geometryAtlasAllocation;if(i&&i.atlas===r)return i;r||(r=new o({referenceGeometry:e,rebaseIndices:this._rebaseIndices}),this._atlases[t]=r);let s=r._bufferVersion,a=r.add(e);return r._bufferVersion!==s&&this._bufferVersion++,a}update(){for(let e in this._atlases)this._atlases[e].update()}clear(){for(let e in this._atlases)this._atlases[e].destroy();this._atlases=Object.create(null)}}},77153(e,t,r){r.d(t,{I3:()=>u,Ng:()=>c,Rg:()=>h,cF:()=>f,fC:()=>d,fl:()=>l,nf:()=>n,nq:()=>o});var i=r(49491),s=r(32955),a=r(54537);function o(e){if(e)return ArrayBuffer.isView(e)?{data:e}:{data:e.buffer.data,format:e.format}}function n(e,t,r,i,s=!1){let h=o(e);if(!h)return;if(h.format)return{data:h.data,size:(0,a.m7n)(h.format).size,format:h.format};if(!i&&!(h.data instanceof Float32Array))throw Error(`[Geometry3D] ${t} got ${h.data.constructor.name} data, which could be normalized or raw integers. Pass a Float32Array, or an Attribute whose format says which.`);let u=function(e,t,r,i){if(i&&e instanceof Float32Array){let r=e.length/t,i=3===t?4:t,s=new Int16Array(r*i);for(let a=0;a<r;a++){let r=a*t,o=a*i;for(let i=0;i<t;i++){let t=e[r+i];s[o+i]=(t<-1?-1:t>1?1:t)*32767}}return{data:s,size:i,normalized:!0}}return 3!==t||e instanceof Float32Array?{data:e,size:t,normalized:r}:{data:l(e),size:4,normalized:r}}(h.data,r,"int"!==i,s);return{data:u.data,size:u.size,format:function(e,t,r){if(e instanceof Float32Array)return 1===t?"float32":2===t?"float32x2":3===t?"float32x3":"float32x4";let i=3===t?"x4":`x${t}`;if(r){if(e instanceof Int8Array)return`snorm8${i}`;if(e instanceof Uint8Array)return`unorm8${i}`;if(e instanceof Int16Array)return`snorm16${i}`;if(e instanceof Uint16Array)return`unorm16${i}`}else{if(e instanceof Int8Array)return`sint8${i}`;if(e instanceof Uint8Array)return`uint8${i}`;if(e instanceof Int16Array)return`sint16${i}`;if(e instanceof Uint16Array)return`uint16${i}`;if(e instanceof Int32Array)return`sint32${i}`;if(e instanceof Uint32Array)return`uint32${i}`}return"float32x4"}(u.data,u.size,u.normalized)}}function l(e){let t=e.constructor,r=e.length/3,i=new t(4*r);for(let t=0;t<r;t++){let r=3*t,s=4*t;i[s]=e[r],i[s+1]=e[r+1],i[s+2]=e[r+2]}return i}function h(e){let t=1/0,r=1/0,a=1/0,o=-1/0,n=-1/0,l=-1/0;for(let i=0;i<e.length;i+=3){let s=e[i],h=e[i+1],u=e[i+2];s<t&&(t=s),h<r&&(r=h),u<a&&(a=u),s>o&&(o=s),h>n&&(n=h),u>l&&(l=u)}return new s.a(new i.P(t,r,a),new i.P(o,n,l))}function u(e,t){let r,i=[],s=(e,t,r,s,a)=>{let o=n(e,t,r,s,a);o&&i.push({data:o.data,attribute:t,size:o.size,bytesPerElement:o.data.BYTES_PER_ELEMENT,format:o.format})};s(e.positions,"aPosition",3),s(e.uvs,"aUV",2),s(e.normals,"aNormal",3,"norm",e.quantizeNormals??!0),s(e.tangents,"aTangent",4,"norm",e.quantizeTangents??!0),s(e.joints,"aJoints",4,"int"),s(e.weights,"aWeights",4,"norm"),s(e.colors,"aColor",4,"norm"),s(e.colors1,"aColor1",4,"norm");let o=0,l=[];for(let e=0;e<i.length;e++){let t=i[e];o=f(o),l.push(o),o+=t.size*t.bytesPerElement}o=f(o);for(let e=0;e<i.length;e++)if("aPosition"===i[e].attribute){r=i[e];break}let h=r.data.length/r.size,u=new ArrayBuffer(o*h),d={},c=new a.hpe({data:new Uint8Array(u),label:"interleaved-mesh-buffer",shrinkToFit:t,usage:a.Sdw.VERTEX|a.Sdw.COPY_DST});for(let e=0;e<i.length;e++){let t=i[e],{data:r,attribute:s,size:a,bytesPerElement:n}=t,f=l[e],p=new r.constructor(u),m=o/n,_=f/n;if(2===a)for(let e=0;e<h;e++){let t=e*m+_,i=2*e;p[t]=r[i],p[t+1]=r[i+1]}else if(3===a)for(let e=0;e<h;e++){let t=e*m+_,i=3*e;p[t]=r[i],p[t+1]=r[i+1],p[t+2]=r[i+2]}else if(4===a)for(let e=0;e<h;e++){let t=e*m+_,i=4*e;p[t]=r[i],p[t+1]=r[i+1],p[t+2]=r[i+2],p[t+3]=r[i+3]}else for(let e=0;e<h;e++){let t=e*m+_,i=e*a;for(let e=0;e<a;e++)p[t+e]=r[i+e]}d[s]={buffer:c,format:t.format,stride:o,offset:f}}return d}function d(e){for(let t in e){let r=e[t];if(r.instance)continue;let i=r.stride;if(i)return r.buffer.data.byteLength/i}return 0}function c(e,t,r){if(!e){let r=d(t);if(0===r)return;e=r>65536?new Uint32Array(r):new Uint16Array(r);for(let t=0;t<r;t++)e[t]=t}return e instanceof Uint16Array&&e.byteLength%4!=0&&(e=new Uint32Array(e)),new a.hpe({data:e,label:"index-mesh-buffer",shrinkToFit:r,usage:a.Sdw.INDEX|a.Sdw.COPY_DST})}function f(e){return e+3&-4}},96008(e,t,r){let i,s,a,o,n,l;r.d(t,{RjU:()=>D,BBn:()=>d.B,$tH:()=>t_,azJ:()=>u.a,BBZ:()=>rZ,Gu$:()=>ed,c9X:()=>eh,rWm:()=>tw,XSb:()=>ea,Ho_:()=>eu,O3Y:()=>ec,ZRo:()=>ei,qU7:()=>en,ZyN:()=>em,sir:()=>_});var h,u=r(32955),d=r(83621),c=r(54027),f=r(8372),p=r(77153),m=r(54537),_=class e extends m.V23{static defaultOptions={topology:"triangle-list",shrinkBuffersToFit:!1,interleave:!1,quantizeNormals:!0,quantizeTangents:!0};static _empty=null;static get EMPTY(){let t;return e._empty??=((t=new e({attributes:{}})).destroy=m.tEg,t)}bounds3D;boundsSphere;get vertexCount(){return(0,p.fC)(this.attributes)}_geometryAtlasAllocation=null;_atlasVacated=!1;_meshes=new f.v("_geometryMeshIndex");_geometryDataIndex=-1;_captureTick=-1;_geometryDataStore=null;dynamic;morphTargetCount=0;_morphDeltaBase=-1;_morphDeltaFloats=0;_morphStore=null;hasMorphNormals;_morphBoundsExpansion=0;_morphTargets=null;_attributeKey=null;_destroyed=!1;get attributeKey(){if(this._attributeKey)return this._attributeKey;let e=this.attributes,t=Object.keys(e).sort(),r="";for(let i=0;i<t.length;i++){let s=t[i],a=e[s];a.instance||(r+=`${s}:${a.format}|`)}return this._attributeKey=r,r}constructor(t){let{positions:r,uvs:i,normals:s,tangents:a,joints:o,weights:n,colors:l,colors1:h}=t={...e.defaultOptions,...t},d=t.shrinkBuffersToFit,f={};if(t.attributes)f=t.attributes;else if(t.interleave)f=(0,p.I3)(t,d);else{let e=(e,t,r,i,s)=>{let a=(0,p.nf)(e,t,r,i,s);if(!a)return;let o=new m.hpe({data:a.data,label:`attribute-mesh-${t.toLowerCase().substring(1)}`,shrinkToFit:d,usage:m.Sdw.VERTEX|m.Sdw.COPY_DST});f[t]={buffer:o,format:a.format,stride:a.size*a.data.BYTES_PER_ELEMENT,offset:0}};e(r,"aPosition",3),e(i,"aUV",2),e(s,"aNormal",3,"norm",t.quantizeNormals??!0),e(a,"aTangent",4,"norm",t.quantizeTangents??!0),e(o,"aJoints",4,"int"),e(n,"aWeights",4,"norm"),e(l,"aColor",4,"norm"),e(h,"aColor1",4,"norm")}if(super({attributes:f,indexBuffer:t.indices instanceof m.hpe?t.indices:(0,p.Ng)(t.indices,f,d),indexCount:t.indexCount,topology:t.topology}),this._morphTargets=t.morphTargets??null,this.morphTargetCount=t.morphTargets?.length??0,this.hasMorphNormals=this.morphTargetCount>0&&t.morphTargets.every(e=>!!e.normals),this.dynamic=t.dynamic??!1,t.bounds3D)this.bounds3D=t.bounds3D;else if(r){let{data:e,format:t}=(0,p.nq)(r);if(t&&!t.startsWith("float32"))throw Error(`[Geometry3D] ${t} positions need bounds3D: only float positions are scanned for it.`);this.bounds3D=(0,p.Rg)(e)}else this.bounds3D=new u.a;this.boundsSphere=new c.i().setFromBox(this.bounds3D)}destroy(e){this._destroyed||(this._geometryAtlasAllocation?.atlas.remove(this),this._geometryDataStore?.remove(this),this._geometryDataStore=null,this._morphStore?.freeDeltas(this),super.unload(),this._meshes.clear(),this._destroyed=!0,super.destroy(e))}unload(){if(this._destroyed)return;let e=this._geometryAtlasAllocation;e?.atlas.remove(this);let t=this.buffers;for(let e=0;e<t.length;e++)t[e].unload();if(super.unload(),null===e&&!this.dynamic)return;let r=this._meshes.items;for(let e=0;e<r.length;e++)r[e]._markBatchDirty()}get positions(){return this.attributes.aPosition.buffer.data}set positions(e){this.attributes.aPosition.buffer.data=e}get uvs(){return this.attributes.aUV?.buffer.data}set uvs(e){this.attributes.aUV&&(this.attributes.aUV.buffer.data=e)}get normals(){return this.attributes.aNormal?.buffer.data}set normals(e){this.attributes.aNormal&&(this.attributes.aNormal.buffer.data=e)}get tangents(){return this.attributes.aTangent?.buffer.data}set tangents(e){this.attributes.aTangent&&(this.attributes.aTangent.buffer.data=e)}get indices(){return this.indexBuffer.data}set indices(e){this.indexBuffer.data=e}},g=r(38755),x=r(14200),y=r(1104),v=r(99280);function b(e){return e.geometry instanceof _}function w(e,t){if(null===t)return null;if("string"==typeof t)return"box"===t?b(e)?e.geometry.bounds3D:(0,v.i)(e,new u.a,!1):"geometry"===t?b(e)?e.geometry:((0,m.R8M)("hitVolume: 'geometry' requires a Mesh3D \u2014 plain Container3D has no geometry; ignoring hitVolume"),null):((0,m.R8M)(`hitVolume: unsupported string '${String(t)}'. Expected 'box' or 'geometry'; ignoring hitVolume`),null);return t instanceof u.a?t:t instanceof c.i?t.radius<0?((0,m.R8M)("hitVolume: Sphere has a negative radius (empty) \u2014 ignoring hitVolume. Did you omit the radius argument?"),null):t:t instanceof _||"function"==typeof t.raycast&&"number"==typeof t.boundingRadiusSq?t:((0,m.R8M)("hitVolume: expected Box, Sphere, Geometry3D, an IHitVolume3D, string shorthand, or null; ignoring hitVolume"),null)}var T=r(711),C=class{weights;_weightIndex=0;_slot=-1;_slotSize=0;_store=null;constructor(e){this.weights=e}};let S=new c.i;var D=class e extends d.B{static defaultOptions={castShadow:!0,receiveShadow:!0,billboardMode:"none"};_geometry;_material;_placeholderMask=0;_billboardMode;_worldBoundsSphere=null;_worldBoundsCacheId=-1;skeleton;receiveShadow;_morph;_enabledPassBits=0;_disabledPassBits=0;_passCache=Object.create(null);_storeIndex=-1;_lastBonePitIndex=-1;_sortKey=0;_batchDirty=!0;didRenderableUpdate=!1;_geometryMeshIndex=-1;_materialMeshIndex=-1;_lastRenderPass=0;_lastDescriptorDirtyId=-1;_lastWorldVisible=1;_skinnedMeshIndex=-1;_morphedMeshIndex=-1;_allMeshIndex=-1;constructor(t={}){let{geometry:r=_.EMPTY,material:i=T.AK.EMPTY,skeleton:s,castShadow:a,receiveShadow:o,billboardMode:n,weights:l,hitVolume:h,width:u,height:d,depth:c,parent:f,...p}={...e.defaultOptions,...(0,m.S6_)(t)};super({label:"Mesh3D",...p}),this._geometry=r,this._material=i,this._updatePlaceholderMask(),this.skeleton=s,a&&(this._enabledPassBits=y.J.SHADOW),this.receiveShadow=o,this._billboardMode=n,r.morphTargetCount>0&&(this._morph=new C(l??new Float32Array(r.morphTargetCount))),void 0!==h&&(this.hitVolume=h),void 0!==u&&(this.width=u),void 0!==d&&(this.height=d),void 0!==c&&(this.depth=c),f?.addChild(this)}get weights(){return this._morph?.weights}set weights(e){this._morph&&e&&(this._morph.weights=e)}get geometry(){return this._geometry}set geometry(e){this._geometry!==e&&(this._view3d&&(this._geometry._meshes.remove(this),e._meshes.add(this)),this._geometry=e,this._markBatchDirty(),this._markStoreDirty(),this._worldBoundsCacheId=-1,this._updatePlaceholderMask(),e.morphTargetCount!==(this._morph?.weights.length??0)&&this._replaceMorph(),"string"==typeof this._hitVolumeInput&&(this._hitVolumeResolved=w(this,this._hitVolumeInput)))}_replaceMorph(){let e=this._morph;e?._store?.freeSlot(e);let t=this._geometry.morphTargetCount,r=t>0?new C(new Float32Array(t)):void 0;this._morph=r;let i=this._view3d;i&&(e&&!r?i._morphedMeshes.remove(this):!e&&r&&i._morphedMeshes.add(this))}_getDefaultHitVolume(){return this._geometry.bounds3D}get material(){return this._material}set material(e){this._material!==e&&(this._view3d&&(this._material._meshes.remove(this),e._meshes.add(this)),this._material=e,this._markBatchDirty(),this._markStoreDirty(),this._lastDescriptorDirtyId=-1,this._updatePlaceholderMask())}_updatePlaceholderMask(){this._placeholderMask=this._geometry===_.EMPTY||this._material===T.AK.EMPTY?0:-1}_markBatchDirty(){this._batchDirty=!0,this._queueMeshUpdate()}_markStoreDirty(){this._storeDirty=!0,this._queueMeshUpdate()}_queueMeshUpdate(){!this.didRenderableUpdate&&this._view3d&&(this.didRenderableUpdate=!0,this._view3d._onRenderableUpdate(this))}get castShadow(){return(this._enabledPassBits&y.J.SHADOW)!=0}set castShadow(e){e?this._enablePassBit(y.J.SHADOW):this._disablePassBit(y.J.SHADOW)}enablePass(e){this._enablePassBit(x.w.getOrAllocate(e))}disablePass(e){let t=x.w.get(e);void 0!==t&&this._disablePassBit(t)}_enablePassBit(e){this._enabledPassBits&e||(this._enabledPassBits|=e,this._disabledPassBits&=~e,this._markBatchDirty())}_disablePassBit(e){this._disabledPassBits&e||(this._enabledPassBits&=~e,this._disabledPassBits|=e,this._queueMeshUpdate())}get billboardMode(){return this._billboardMode}set billboardMode(e){this._billboardMode!==e&&(this._billboardMode=e,this._markBatchDirty())}get renderPassMask(){let e=this._material._passBit,t=(this._enabledPassBits|e)&~this._disabledPassBits&this._placeholderMask;return e&(y.J.TRANSPARENT|y.J.TRANSMISSION)?t&~y.J.SHADOW:t}get boundingSphere(){let e=this._worldBoundsSphere||=new c.i;if(this._worldBoundsCacheId!==this._worldTransformId){this._worldBoundsCacheId=this._worldTransformId;let t=this._geometry;t.dynamic?e.makeEmpty():this._morph&&t._morphBoundsExpansion>0?(S.copyFrom(t.boundsSphere),S.radius+=t._morphBoundsExpansion,S.applyMatrix4(this.worldTransform,e)):t.boundsSphere.applyMatrix4(this.worldTransform,e)}return e}invalidate(){this._markBatchDirty()}unload(){this.destroyed||(super.unload(),this._geometry.unload(),this._markBatchDirty(),this._markStoreDirty())}_storeWorldTransform(){let e=this._storeIndex;if(e<0)return void this._markStoreDirty();let t=this._view3d._sceneBatch.storeBuffer,r=this.worldTransform;if(t.writeWorldTransform(e,r.elements64),t.writesSpheres){let i=this._geometry;t.writeBoundingSphere(e,r.elements,0,i,this._morph?i._morphBoundsExpansion:0)}}_storeWorldVisible(){if(this._worldVisible===this._lastWorldVisible)return;this._lastWorldVisible=this._worldVisible;let e=this._view3d._sceneBatch;this._storeIndex<0?this._markStoreDirty():e.storeBuffer.writeVisibility(this._storeIndex,this._worldVisible),e._visibilityDirtyId++}destroy(e){this.destroyed||(super.destroy(e),this._passCache=Object.create(null),this._storeIndex=-1,this._allMeshIndex=-1,this._geometry._meshes.remove(this),this._material._meshes.remove(this),this._skinnedMeshIndex=-1,this._morphedMeshIndex=-1,(0,g.M)(e,"geometry")&&this._destroyGeometry(),(0,g.M)(e,"material")&&this._material.destroy(e),this._geometry=null,this._material=null)}_destroyGeometry(){this._geometry.destroy(!0)}},M=r(63116),B=r(28960);let I={name:"alphaMask",bindings:{material:{alphaCutoff:"f32"}},gpu:{fragment:{material:`
  if (alpha < material.alphaCutoff) {
    discard;
  }
  alpha = 1.0;
`}},gl:{fragment:{material:`
  if (alpha < material.alphaCutoff) discard;
  alpha = 1.0;
`}}},P={name:"uvTransform",bindings:{material:{uvOffset:"vec2<f32>",uvTransformRow0:"vec4<f32>"}},gpu:{vertex:{end:`
  let m = material.uvTransformRow0;
  uv = vec2<f32>(m.x * uv.x + m.y * uv.y,
                 m.z * uv.x + m.w * uv.y) + material.uvOffset;
`}},gl:{vertex:{end:`
  vec4 m = material.uvTransformRow0;
  uv = vec2(m.x * uv.x + m.y * uv.y,
            m.z * uv.x + m.w * uv.y) + material.uvOffset;
`}}};var A=r(31360);let F={name:"emissive",textures:["emissive"],bindings:{material:{emissive:"vec3<f32>",emissiveStrength:"f32"}},gpu:{fragment:{material:`
  emissive = material.emissive * material.emissiveStrength;
  let emissiveTex = sampleEmissive(input.vUV).rgb;
  emissive *= pow(emissiveTex, vec3<f32>(2.2));
`}},gl:{fragment:{material:`
  emissive = material.emissive * material.emissiveStrength;
  vec3 emissiveTex = sampleEmissive(vUV).rgb;
  emissive *= pow(emissiveTex, vec3(2.2));
`}}};function R(e){let t=Object.entries(e),r=t.filter(([,e])=>"colour"===e.kind);class i{_material;_data;_colours=Object.create(null);_tints=Object.create(null);constructor(e){for(let[t,i]of(this._material=e,this._data=e.data,r)){let e=this._data[i.field].subarray(0,3);this._colours[t]=e,this._tints[t]=m.Q1f.shared.setValue([(0,T.T5)(e[0]),(0,T.T5)(e[1]),(0,T.T5)(e[2])]).toNumber()}}}for(let[e,r]of t){let t;switch(r.kind){case"lane":{let{field:e,lane:i}=r;t={get(){return this._data[e][i]},set(t){let r=this._data[e];r[i]!==Math.fround(t)&&(r[i]=t,this._material.update())}};break}case"scalar":{let{field:e}=r;t={get(){return this._data[e]},set(t){this._data[e]=t}};break}case"colour":t={get(){return this._tints[e]},set(t){let r=m.Q1f.shared.setValue(t);this._tints[e]=r.toNumber(),(0,T.Og)(this._colours[e],0,r),this._material.update()}};break;case"texture":{let{slot:e}=r;t={get(){return this._material.textures[e]}},r.readonly||(t.set=function(t){this._material.textures[e]=t})}}t.enumerable=!0,t.configurable=!1,Object.defineProperty(i.prototype,e,t)}return i}function k(e){let t={};for(let r of Object.keys(Object.getPrototypeOf(e)))t[r]=e[r];return t}let z=R({color:{kind:"colour",field:"emissive"},strength:{kind:"scalar",field:"emissiveStrength"},texture:{kind:"texture",slot:"emissive"}});var V=r(26751),L=r(99897);let O="normalize(select(-input.vNormal, input.vNormal, input.frontFacing))",N="normalize(gl_FrontFacing ? vNormal : -vNormal)";function E(e){let t=e?`
  let ccTangentNormal = sampleClearcoatNormal(input.vUV).rgb * 2.0 - 1.0;
  let ccScaledNormal = vec3<f32>(
    ccTangentNormal.xy * material.clearcoatParams.z,
    ccTangentNormal.z,
  );
  let ccTBN = calculateTBN(${O}, input.vPosition, input.vUV);
  let ccNormal = normalize(ccTBN * ccScaledNormal);
`:`
  let ccNormal = ${O};
`,r=e?`
  vec3 ccTangentNormal = sampleClearcoatNormal(vUV).rgb * 2.0 - 1.0;
  vec3 ccScaledNormal = vec3(ccTangentNormal.xy * material.clearcoatParams.z, ccTangentNormal.z);
  mat3 ccTBN = calculateTBN(${N}, vPosition, vUV);
  vec3 ccNormal = normalize(ccTBN * ccScaledNormal);
`:`
  vec3 ccNormal = ${N};
`;return{name:e?"clearcoat:normalMap":"clearcoat",requires:e?[L.L,V.j]:[L.L],textures:e?["clearcoat","clearcoatRoughness","clearcoatNormal"]:["clearcoat","clearcoatRoughness"],bindings:{material:{clearcoatParams:"vec4<f32>"}},gpu:{header:`const CLEARCOAT_F0: f32 = 0.04;
`,fragment:{lobePreLighting:`
  let ccFactor = material.clearcoatParams.x * sampleClearcoat(input.vUV).r;
  let ccRoughnessRaw = material.clearcoatParams.y * sampleClearcoatRoughness(input.vUV).g;
  let ccRoughnessIBL = clamp(ccRoughnessRaw, 0.0, 1.0);
  let ccRoughness = min(max(ccRoughnessIBL, 0.04) + geometricRoughness, 1.0);
${t}
  let ccA = ccRoughness * ccRoughness;
  let ccA2 = ccA * ccA;
  let ccA2InvPi = ccA2 * INV_PI;
  let ccOneMinusA = 1.0 - ccA;
  let ccNDotV = max(dot(ccNormal, viewDir), 0.0);
  let ccVisV = ccNDotV * ccOneMinusA + ccA;

  var clearcoatLight = vec3<f32>(0.0);
`,lobePerLight:`
    {
      let ccHalfVector = normalize(viewDir + lightDir);
      let ccNDotL = max(dot(ccNormal, lightDir), 0.0);
      if (ccNDotL > 0.0) {
        let ccNDotH = max(dot(ccNormal, ccHalfVector), 0.0);
        let ccDDenom = (ccNDotH * ccNDotH * (ccA2 - 1.0) + 1.0);
        let ccD = ccA2InvPi / (ccDDenom * ccDDenom);
        let ccVis = 0.5 / (ccNDotL * ccVisV + ccNDotV * (ccNDotL * ccOneMinusA + ccA));
        let ccHDotV = max(dot(ccHalfVector, viewDir), 0.0);
        let ccFc5 = exp2((-5.55473 * ccHDotV - 6.98316) * ccHDotV);
        let ccF = CLEARCOAT_F0 + (1.0 - CLEARCOAT_F0) * ccFc5;
        clearcoatLight += ccD * ccF * ccVis * light.color * attenuation * ccNDotL * shadow;
      }
    }
`,lobePostLighting:`
  let ccFcv5 = exp2((-5.55473 * ccNDotV - 6.98316) * ccNDotV);

  let ccR = reflect(-viewDir, ccNormal);
  let ccPrefiltered = sampleEnvironment(ccR, ccRoughnessIBL);
  let ccBrdf = textureSampleLevel(uBrdfLutTexture, uBrdfLutSampler, vec2<f32>(ccNDotV, ccRoughnessIBL), 0.0).rg;
  let clearcoatIBL = ccPrefiltered * (CLEARCOAT_F0 * ccBrdf.x + ccBrdf.y);

  let ccFv = CLEARCOAT_F0 + (1.0 - CLEARCOAT_F0) * ccFcv5;
  let ccAttenuation = 1.0 - ccFactor * ccFv;
  finalColor = finalColor * ccAttenuation + (clearcoatLight + clearcoatIBL) * ccFactor;
`}},gl:{fragment:{header:`
#define CLEARCOAT_F0 0.04
`,lobePreLighting:`
  float ccFactor = material.clearcoatParams.x * sampleClearcoat(vUV).r;
  float ccRoughnessRaw = material.clearcoatParams.y * sampleClearcoatRoughness(vUV).g;
  float ccRoughnessIBL = clamp(ccRoughnessRaw, 0.0, 1.0);
  float ccRoughness = min(max(ccRoughnessIBL, 0.04) + geometricRoughness, 1.0);
${r}
  float ccA = ccRoughness * ccRoughness;
  float ccA2 = ccA * ccA;
  float ccA2InvPi = ccA2 * INV_PI;
  float ccOneMinusA = 1.0 - ccA;
  float ccNDotV = max(dot(ccNormal, viewDir), 0.0);
  float ccVisV = ccNDotV * ccOneMinusA + ccA;

  vec3 clearcoatLight = vec3(0.0);
`,lobePerLight:`
    {
      vec3 ccHalfVector = normalize(viewDir + lightDir);
      float ccNDotL = max(dot(ccNormal, lightDir), 0.0);
      if (ccNDotL > 0.0) {
        float ccNDotH = max(dot(ccNormal, ccHalfVector), 0.0);
        float ccDDenom = (ccNDotH * ccNDotH * (ccA2 - 1.0) + 1.0);
        float ccD = ccA2InvPi / (ccDDenom * ccDDenom);
        float ccVis = 0.5 / (ccNDotL * ccVisV + ccNDotV * (ccNDotL * ccOneMinusA + ccA));
        float ccHDotV = max(dot(ccHalfVector, viewDir), 0.0);
        float ccFc5 = exp2((-5.55473 * ccHDotV - 6.98316) * ccHDotV);
        float ccF = CLEARCOAT_F0 + (1.0 - CLEARCOAT_F0) * ccFc5;
        clearcoatLight += ccD * ccF * ccVis * light.color * attenuation * ccNDotL * shadow;
      }
    }
`,lobePostLighting:`
  float ccFcv5 = exp2((-5.55473 * ccNDotV - 6.98316) * ccNDotV);

  vec3 ccR = reflect(-viewDir, ccNormal);
  vec3 ccPrefiltered = sampleEnvironment(ccR, ccRoughnessIBL);
  vec2 ccBrdf = texture(uBrdfLutTexture, vec2(ccNDotV, ccRoughnessIBL)).rg;
  vec3 clearcoatIBL = ccPrefiltered * (CLEARCOAT_F0 * ccBrdf.x + ccBrdf.y);

  float ccFv = CLEARCOAT_F0 + (1.0 - CLEARCOAT_F0) * ccFcv5;
  float ccAttenuation = 1.0 - ccFactor * ccFv;
  finalColor = finalColor * ccAttenuation + (clearcoatLight + clearcoatIBL) * ccFactor;
`}}}}let G=E(!1),U=E(!0),$={name:"ibl",bindings:{global:{uBrdfLutTexture:"texture_2d<f32>"}},gpu:{fragment:{lighting:`
  {
    let NdotV_ibl = max(dot(normal, viewDir), 0.0);
    let R_ibl = reflect(-viewDir, specularNormal);

    let radiance = sampleEnvironment(R_ibl, roughness);
    let irradiance = sampleEnvironment(normal, 1.0);

    let f_ab = textureSampleLevel(uBrdfLutTexture, uBrdfLutSampler, vec2<f32>(NdotV_ibl, roughness), 0.0).rg;

    let Fr = max(vec3<f32>(f90 - f90 * roughness), fresnelF0) - fresnelF0;
    let k_S = fresnelF0 + Fr * exp2((-5.55473 * NdotV_ibl - 6.98316) * NdotV_ibl);
    let FssEss = k_S * f_ab.x + f90 * f_ab.y;

    let Ems = 1.0 - (f_ab.x + f_ab.y);
    let F_avg = fresnelF0 + (f90 - fresnelF0) / 21.0;
    let Fms = FssEss * F_avg / (1.0 - F_avg * Ems + 1e-5);
    let FmsEms = Fms * Ems;

    let k_D = albedo * (1.0 - FssEss - FmsEms) * (1.0 - metallic);

    ambient += FssEss * radiance + (FmsEms + k_D) * irradiance;
  }
`}},gl:{fragment:{lighting:`
  {
    float NdotV_ibl = max(dot(normal, viewDir), 0.0);
    vec3 R_ibl = reflect(-viewDir, specularNormal);

    vec3 radiance = sampleEnvironment(R_ibl, roughness);
    vec3 irradiance = sampleEnvironment(normal, 1.0);

    vec2 f_ab = texture(uBrdfLutTexture, vec2(NdotV_ibl, roughness)).rg;

    vec3 Fr = max(vec3(f90 - f90 * roughness), fresnelF0) - fresnelF0;
    vec3 k_S = fresnelF0 + Fr * exp2((-5.55473 * NdotV_ibl - 6.98316) * NdotV_ibl);
    vec3 FssEss = k_S * f_ab.x + f90 * f_ab.y;

    float Ems = 1.0 - (f_ab.x + f_ab.y);
    vec3 F_avg = fresnelF0 + (f90 - fresnelF0) / 21.0;
    vec3 Fms = FssEss * F_avg / (1.0 - F_avg * Ems + 1e-5);
    vec3 FmsEms = Fms * Ems;

    vec3 k_D = albedo * (1.0 - FssEss - FmsEms) * (1.0 - metallic);

    ambient += FssEss * radiance + (FmsEms + k_D) * irradiance;
  }
`}}},q={name:"iridescence",requires:[L.L],textures:["iridescence"],bindings:{material:{transmissionVolume:"vec4<f32>",attenuationColorIrid:"vec4<f32>",iridescenceThickness:"f32",iridescenceThicknessMinimum:"f32"}},gpu:{header:`
const XYZ_TO_REC709 = mat3x3<f32>(
   3.2404542, -0.9692660,  0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.0415560,  1.0572252,
);

fn evalSensitivity(OPD: f32, shift: vec3<f32>) -> vec3<f32> {
  let phase = 2.0 * PI * OPD * 1e-9;
  let val = vec3<f32>(5.4856e-13, 4.4201e-13, 5.2481e-13);
  let pos = vec3<f32>(1.6810e+06, 1.7953e+06, 2.2084e+06);
  let vr  = vec3<f32>(4.3278e+09, 9.3046e+09, 6.6121e+09);
  var xyz = val * sqrt(2.0 * PI * vr) * cos(pos * phase + shift) * exp(-vr * phase * phase);
  xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09) * cos(2.2399e+06 * phase + shift.x) * exp(-4.5282e+09 * phase * phase);
  xyz /= 1.0685e-7;
  let srgb = XYZ_TO_REC709 * xyz;
  return srgb;
}

fn IorToFresnel0(transmittedIor: f32, incidentIor: f32) -> f32 {
  let r = (transmittedIor - incidentIor) / (transmittedIor + incidentIor);
  return r * r;
}

fn IorToFresnel0v(transmittedIor: vec3<f32>, incidentIor: f32) -> vec3<f32> {
  let r = (transmittedIor - vec3(incidentIor)) / (transmittedIor + vec3(incidentIor));
  return r * r;
}

fn Fresnel0ToIorV(f0: vec3<f32>) -> vec3<f32> {
  let sqrtF0 = sqrt(clamp(f0, vec3(0.0), vec3(0.9999)));
  return (vec3(1.0) + sqrtF0) / (vec3(1.0) - sqrtF0);
}

fn F_Schlick_scalar(f0: f32, f90: f32, VdotH: f32) -> f32 {
  let fc5 = exp2((-5.55473 * VdotH - 6.98316) * VdotH);
  return f0 + (f90 - f0) * fc5;
}

fn F_Schlick_v(f0: vec3<f32>, f90: f32, VdotH: f32) -> vec3<f32> {
  let fc5 = exp2((-5.55473 * VdotH - 6.98316) * VdotH);
  return f0 + (vec3(f90) - f0) * fc5;
}

fn evalIridescence(outsideIor: f32, iridescenceIor: f32, cosTheta: f32,
                    thinFilmThickness: f32, baseF0: vec3<f32>) -> vec3<f32> {
  let iridIor = mix(outsideIor, iridescenceIor, smoothstep(0.0, 0.03, thinFilmThickness));

  let sinTheta2Sq = (outsideIor * outsideIor) / (iridIor * iridIor)
                     * (1.0 - cosTheta * cosTheta);
  let cosTheta2Sq = 1.0 - sinTheta2Sq;
  if (cosTheta2Sq < 0.0) { return vec3<f32>(1.0); }
  let cosTheta2 = sqrt(cosTheta2Sq);

  let R12 = IorToFresnel0(iridIor, outsideIor);
  let R12s = F_Schlick_scalar(R12, 1.0, cosTheta);
  let T121 = 1.0 - R12s;
  var phi12: f32 = 0.0;
  if (iridIor < outsideIor) { phi12 = PI; }
  let phi21 = PI - phi12;

  let baseIor = Fresnel0ToIorV(baseF0);
  let R23 = IorToFresnel0v(baseIor, iridIor);
  let R23s = F_Schlick_v(R23, 1.0, cosTheta2);
  var phi23 = vec3<f32>(0.0);
  if (baseIor.x < iridIor) { phi23.x = PI; }
  if (baseIor.y < iridIor) { phi23.y = PI; }
  if (baseIor.z < iridIor) { phi23.z = PI; }

  let OPD = 2.0 * iridIor * thinFilmThickness * cosTheta2;
  let phi = vec3<f32>(phi21) + phi23;

  let R123 = clamp(R12s * R23s, vec3(1e-5), vec3(0.9999));
  let r123 = sqrt(R123);
  let Rs = (T121 * T121 * R23s) / (vec3(1.0) - R123);

  var I = vec3<f32>(R12s) + Rs;

  var Cm = Rs - vec3<f32>(T121);
  for (var m: i32 = 1; m <= 2; m = m + 1) {
    Cm *= r123;
    let mf = f32(m);
    let Sm = 2.0 * evalSensitivity(mf * OPD, mf * phi);
    I = I + Cm * Sm;
  }

  return max(I, vec3(0.0));
}
`,fragment:{material:`
  {
    let iridTex = sampleIridescence(input.vUV);
    let iridescenceFactor = material.transmissionVolume.w * iridTex.r;
    let iridescenceIor = material.attenuationColorIrid.w;
    let iridThickness = mix(
      material.iridescenceThicknessMinimum,
      material.iridescenceThickness,
      iridTex.g,
    );
    let iridNdotV = max(dot(normal, viewDir), 0.001);
    let iridF = evalIridescence(1.0, iridescenceIor, iridNdotV, iridThickness, fresnelF0);
    fresnelF0 = mix(fresnelF0, iridF, iridescenceFactor);
  }
`}},gl:{header:`
const mat3 XYZ_TO_REC709 = mat3(
   3.2404542, -0.9692660,  0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.0415560,  1.0572252
);

vec3 evalSensitivity(float OPD, vec3 shift) {
  float phase = 2.0 * PI * OPD * 1e-9;
  vec3 val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
  vec3 pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);
  vec3 vr  = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);
  vec3 xyz = val * sqrt(2.0 * PI * vr) * cos(pos * phase + shift) * exp(-vr * phase * phase);
  xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09) * cos(2.2399e+06 * phase + shift.x) * exp(-4.5282e+09 * phase * phase);
  xyz /= 1.0685e-7;
  vec3 srgb = XYZ_TO_REC709 * xyz;
  return srgb;
}

float IorToFresnel0(float transmittedIor, float incidentIor) {
  float r = (transmittedIor - incidentIor) / (transmittedIor + incidentIor);
  return r * r;
}

vec3 IorToFresnel0v(vec3 transmittedIor, float incidentIor) {
  vec3 r = (transmittedIor - vec3(incidentIor)) / (transmittedIor + vec3(incidentIor));
  return r * r;
}

vec3 Fresnel0ToIorV(vec3 f0) {
  vec3 sqrtF0 = sqrt(clamp(f0, 0.0, 0.9999));
  return (vec3(1.0) + sqrtF0) / (vec3(1.0) - sqrtF0);
}

float F_Schlick_scalar(float f0, float f90, float VdotH) {
  float fc5 = exp2((-5.55473 * VdotH - 6.98316) * VdotH);
  return f0 + (f90 - f0) * fc5;
}

vec3 F_Schlick_v(vec3 f0, float f90, float VdotH) {
  float fc5 = exp2((-5.55473 * VdotH - 6.98316) * VdotH);
  return f0 + (vec3(f90) - f0) * fc5;
}

vec3 evalIridescence(float outsideIor, float iridescenceIor, float cosTheta,
                      float thinFilmThickness, vec3 baseF0) {
  float iridIor = mix(outsideIor, iridescenceIor, smoothstep(0.0, 0.03, thinFilmThickness));

  float sinTheta2Sq = (outsideIor * outsideIor) / (iridIor * iridIor)
                       * (1.0 - cosTheta * cosTheta);
  float cosTheta2Sq = 1.0 - sinTheta2Sq;
  if (cosTheta2Sq < 0.0) { return vec3(1.0); }
  float cosTheta2 = sqrt(cosTheta2Sq);

  float R12 = IorToFresnel0(iridIor, outsideIor);
  float R12s = F_Schlick_scalar(R12, 1.0, cosTheta);
  float T121 = 1.0 - R12s;
  float phi12 = 0.0;
  if (iridIor < outsideIor) { phi12 = PI; }
  float phi21 = PI - phi12;

  vec3 baseIor = Fresnel0ToIorV(baseF0);
  vec3 R23 = IorToFresnel0v(baseIor, iridIor);
  vec3 R23s = F_Schlick_v(R23, 1.0, cosTheta2);
  vec3 phi23 = vec3(0.0);
  if (baseIor.x < iridIor) phi23.x = PI;
  if (baseIor.y < iridIor) phi23.y = PI;
  if (baseIor.z < iridIor) phi23.z = PI;

  float OPD = 2.0 * iridIor * thinFilmThickness * cosTheta2;
  vec3 phi = vec3(phi21) + phi23;

  vec3 R123 = clamp(R12s * R23s, 1e-5, 0.9999);
  vec3 r123 = sqrt(R123);
  vec3 Rs = (T121 * T121 * R23s) / (vec3(1.0) - R123);

  vec3 I = vec3(R12s) + Rs;

  vec3 Cm = Rs - vec3(T121);
  for (int m = 1; m <= 2; m++) {
    Cm *= r123;
    float mf = float(m);
    vec3 Sm = 2.0 * evalSensitivity(mf * OPD, mf * phi);
    I += Cm * Sm;
  }

  return max(I, vec3(0.0));
}
`,fragment:{material:`
  {
    vec4 iridTex = sampleIridescence(vUV);
    float iridescenceFactor = material.transmissionVolume.w * iridTex.r;
    float iridescenceIor = material.attenuationColorIrid.w;
    float iridThickness = mix(
      material.iridescenceThicknessMinimum,
      material.iridescenceThickness,
      iridTex.g
    );

    float iridNdotV = max(dot(normal, viewDir), 0.001);
    vec3 iridF = evalIridescence(1.0, iridescenceIor, iridNdotV, iridThickness, fresnelF0);
    fresnelF0 = mix(fresnelF0, iridF, iridescenceFactor);
  }
`}}},H=`
#ifndef PIXIJS_3D_GET_LIGHT_DEFINED
#define PIXIJS_3D_GET_LIGHT_DEFINED
Light getLight(int index) {
  int offset = index * 4;
  vec4 d0 = uLightData[offset + 0];
  vec4 d1 = uLightData[offset + 1];
  vec4 d2 = uLightData[offset + 2];
  vec4 d3 = uLightData[offset + 3];

  Light l;
  l.position = d0.xyz;
  l.type = d0.w;
  l.color = d1.xyz;
  l.rangeSq = d1.w;
  l.direction = d2.xyz;
  l.coneCos = d2.w;
  l.innerConeCos = d3.x;
  l.shadowDataIndex = d3.y;
  l.radiusPow4 = d3.w;
  return l;
}
#endif
`,j=(h={name:"pbrLighting",requires:[L.L],preLighting:{gpu:`
  directLight = vec3<f32>(0.0);

  ambient += global.uGlobalLightParams.xyz * albedo * (1.0 - metallic) * INV_PI;

  let nDotV = max(dot(normal, viewDir), 0.0);
  let a = roughness * roughness;
  let a2 = a * a;
  let a2_inv_pi = a2 * INV_PI;
  let oneMinusA = 1.0 - a;
  let visV = nDotV * oneMinusA + a;
  let albedoOverPI = albedo * INV_PI;
`,gl:`
  directLight = vec3(0.0);

  ambient += uGlobalLightParams.xyz * albedo * (1.0 - metallic) * INV_PI;

  float nDotV = max(dot(normal, viewDir), 0.0);
  float a = roughness * roughness;
  float a2 = a * a;
  float a2_inv_pi = a2 * INV_PI;
  float oneMinusA = 1.0 - a;
  float visV = nDotV * oneMinusA + a;
  vec3 albedoOverPI = albedo * INV_PI;
`},perLight:{gpu:`
    let halfVector = normalize(viewDir + lightDir);
    let hDotV = max(dot(halfVector, viewDir), 0.0);

    let nDotH = max(dot(normal, halfVector), 0.0);
    let dDenom = (nDotH * nDotH * (a2 - 1.0) + 1.0);
    let distribution = a2_inv_pi / (dDenom * dDenom);

    let vis = 0.5 / max(nDotL * visV + nDotV * (nDotL * oneMinusA + a), 1e-6);

    let fc5 = exp2((-5.55473 * hDotV - 6.98316) * hDotV);
    let fresnel = fresnelF0 + (vec3<f32>(f90) - fresnelF0) * fc5;

    let specular = distribution * fresnel * vis;
    let diffuseWeight = (vec3<f32>(1.0) - fresnel) * (1.0 - metallic);

    let radiance = light.color * attenuation;
    directLight += (diffuseWeight * albedoOverPI + specular) * radiance * nDotL * shadow;
`,gl:`
    vec3 halfVector = normalize(viewDir + lightDir);
    float hDotV = max(dot(halfVector, viewDir), 0.0);

    float nDotH = max(dot(normal, halfVector), 0.0);
    float dDenom = (nDotH * nDotH * (a2 - 1.0) + 1.0);
    float distribution = a2_inv_pi / (dDenom * dDenom);

    float vis = 0.5 / max(nDotL * visV + nDotV * (nDotL * oneMinusA + a), 1e-6);

    float fc5 = exp2((-5.55473 * hDotV - 6.98316) * hDotV);
    vec3 fresnel = fresnelF0 + (vec3(f90) - fresnelF0) * fc5;

    vec3 specular = distribution * fresnel * vis;
    vec3 diffuseWeight = (vec3(1.0) - fresnel) * (1.0 - metallic);

    vec3 radiance = light.color * attenuation;
    directLight += (diffuseWeight * albedoOverPI + specular) * radiance * nDotL * shadow;
`},postLighting:{gpu:`
  finalColor = (ambient * occlusion) + directLight + emissive;
`,gl:`
  finalColor = (ambient * occlusion) + directLight + emissive;
`}},n=`
{
${h.preLighting?.gpu??""}
{{fragmentLobePreLighting}}

  let lightTile = clamp(
    vec2<i32>(input.position.xy * camera.uLightTileTransform.xy + camera.uLightTileTransform.zw),
    vec2<i32>(0),
    vec2<i32>(15, 8)
  );
  let lightTileIndex = lightTile.y * 16 + lightTile.x;
  let lightDepthIndex = i32(clamp(
    dot(camera.uLightDepthPlane, vec4<f32>(input.vPosition, 1.0)), 0.0, 31.0
  ));
  var lightMask = u32(camera.uLightTiles[lightTileIndex >> 2][lightTileIndex & 3]) &
    u32(camera.uLightDepthMasks[lightDepthIndex >> 2][lightDepthIndex & 3]);

  for (var n: i32 = 0; n < 32; n++) {
    if (lightMask == 0u) { break; }
    let i = i32(firstTrailingBit(lightMask));
    lightMask &= lightMask - 1u;

    let lightOffset = i * 4;
    let light0 = global.uLightData[lightOffset];
    let light1 = global.uLightData[lightOffset + 1];
    let light2 = global.uLightData[lightOffset + 2];
    let light3 = global.uLightData[lightOffset + 3];
    let light = Light(light0.xyz, light0.w, light1.xyz, light1.w, light2.xyz, light2.w, light3.x, light3.y, light3.z, light3.w);

    var lightDir: vec3<f32>;
    var attenuation: f32 = 1.0;

    if (light.kind == LIGHT_DIRECTIONAL) {
      lightDir = -light.direction;
    } else {
      let toLight = light.position - input.vPosition;
      let distanceSq = dot(toLight, toLight);

      if (light.rangeSq > 0.0) {
        if (distanceSq >= light.rangeSq) { continue; }

        let distRatio = distanceSq / light.rangeSq;
        let windowFalloff = saturate(1.0 - distRatio * distRatio);
        attenuation = windowFalloff * windowFalloff * inverseSqrt(distanceSq * distanceSq + light.radiusPow4);
      } else {
        attenuation = inverseSqrt(distanceSq * distanceSq + light.radiusPow4);
      }

      lightDir = toLight * inverseSqrt(distanceSq);

      if (light.kind == LIGHT_SPOT) {
        let spotCos = dot(-lightDir, light.direction);
        let spotAtten = saturate((spotCos - light.coneCos) / max(light.innerConeCos - light.coneCos, 1e-6));
        attenuation *= spotAtten * spotAtten;
      }
    }

    if (attenuation <= 0.0) { continue; }

    let nDotL = max(dot(normal, lightDir), 0.0);
    if (nDotL <= 0.0) { continue; }

    let shadow = calculateShadow(light.shadowDataIndex, light.cascadeCount, input.vPosition, normal, nDotL);

${h.perLight.gpu??""}
{{fragmentLobePerLight}}
  }

${h.postLighting?.gpu??""}
{{fragmentLobePostLighting}}
}
`,l=`
{
${h.preLighting?.gl??""}
{{lobePreLighting}}

  ivec2 lightTile = clamp(
    ivec2(gl_FragCoord.xy * uLightTileTransform.xy + uLightTileTransform.zw),
    ivec2(0),
    ivec2(15, 8)
  );
  int lightTileIndex = lightTile.y * 16 + lightTile.x;
  int lightDepthIndex = int(clamp(
    dot(uLightDepthPlane, vec4(vPosition, 1.0)), 0.0, 31.0
  ));
  uint lightMask = uint(uLightTiles[lightTileIndex >> 2][lightTileIndex & 3]) &
    uint(uLightDepthMasks[lightDepthIndex >> 2][lightDepthIndex & 3]);

  for (int n = 0; n < 32; n++) {
    if (lightMask == 0u) break;
    uint lowestBit = lightMask & (0u - lightMask);
    int i = int(floatBitsToUint(float(lowestBit)) >> 23u) - 127;
    lightMask &= lightMask - 1u;

    Light light = getLight(i);

    vec3 lightDir;
    float attenuation = 1.0;

    if (light.type == LIGHT_DIRECTIONAL) {
      lightDir = -light.direction;
    } else {
      vec3 toLight = light.position - vPosition;
      float distanceSq = dot(toLight, toLight);

      if (light.rangeSq > 0.0) {
        if (distanceSq >= light.rangeSq) continue;

        float distRatio = distanceSq / light.rangeSq;
        float windowFalloff = clamp(1.0 - distRatio * distRatio, 0.0, 1.0);
        attenuation = windowFalloff * windowFalloff * inversesqrt(distanceSq * distanceSq + light.radiusPow4);
      } else {
        attenuation = inversesqrt(distanceSq * distanceSq + light.radiusPow4);
      }

      lightDir = toLight * inversesqrt(distanceSq);

      if (light.type == LIGHT_SPOT) {
        float spotCos = dot(-lightDir, light.direction);
        float spotAtten = clamp((spotCos - light.coneCos) / max(light.innerConeCos - light.coneCos, 1e-6), 0.0, 1.0);
        attenuation *= spotAtten * spotAtten;
      }
    }

    if (attenuation <= 0.0) continue;

    float nDotL = max(dot(normal, lightDir), 0.0);
    if (nDotL <= 0.0) continue;

    float shadow = calculateShadow(light, vPosition, normal, nDotL);

${h.perLight.gl??""}
{{lobePerLight}}
  }

${h.postLighting?.gl??""}
{{lobePostLighting}}
}
`,{name:h.name,requires:h.requires,structs:h.structs,bindings:h.bindings,textures:h.textures,gpu:{header:h.header?.gpu,fragment:{lighting:n}},gl:{header:`${H}
${h.header?.gl??""}`,fragment:{lighting:l}}}),W={name:"pbrMaterial",textures:["baseColor","metallicRoughness","occlusion","normal"],bindings:{material:{baseColor:"vec4<f32>",alphaCutoff:"f32",pbrParams:"vec4<f32>",transmissionVolume:"vec4<f32>",attenuationColorIrid:"vec4<f32>",normalScale:"f32"}},gpu:{fragment:{material:`
  var viewDir: vec3<f32>;
  var metallic: f32 = 0.0;
  var roughness: f32 = 1.0;
  var fresnelF0: vec3<f32>;
  var f90: f32 = 1.0;
  var emissive: vec3<f32> = vec3<f32>(0.0);
  var occlusion: f32 = 1.0;
  var directLight: vec3<f32> = vec3<f32>(0.0);
  var ambient: vec3<f32> = vec3<f32>(0.0);

  var baseColor = material.baseColor;
  metallic = material.pbrParams.x;
  roughness = material.pbrParams.y;
  occlusion = material.pbrParams.z;

  let ior = material.pbrParams.w;
  let iorRatio = (ior - 1.0) / (ior + 1.0);
  fresnelF0 = vec3<f32>(iorRatio * iorRatio);

  var baseTex = sampleBaseColor(input.vUV);
  let baseTexLinear = baseTex.rgb / max(baseTex.a, 0.001);
  baseTex = vec4<f32>(pow(baseTexLinear, vec3<f32>(2.2)), baseTex.a);
  baseColor *= baseTex;

  let mrTex = sampleMetallicRoughness(input.vUV);
  metallic *= mrTex.b;
  roughness *= mrTex.g;

  occlusion *= sampleOcclusion(input.vUV).r;

  let dNdx = abs(dpdx(normal));
  let dNdy = abs(dpdy(normal));
  let dN = max(dNdx, dNdy);
  let geometricRoughness = max(max(dN.x, dN.y), dN.z);
  roughness = clamp(max(roughness, 0.045) + geometricRoughness, 0.0, 1.0);

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  viewDir = normalize(camera.uCameraPosition.xyz - input.vPosition);
  fresnelF0 = mix(fresnelF0, albedo, metallic);

  var specularNormal = normal;
`}},gl:{fragment:{material:`
  vec3 viewDir;
  float metallic = 0.0;
  float roughness = 1.0;
  vec3 fresnelF0;
  float f90 = 1.0;
  vec3 emissive = vec3(0.0);
  float occlusion = 1.0;
  vec3 directLight = vec3(0.0);
  vec3 ambient = vec3(0.0);

  vec4 baseColor = material.baseColor;
  metallic = material.pbrParams.x;
  roughness = material.pbrParams.y;
  occlusion = material.pbrParams.z;

  float ior = material.pbrParams.w;
  float iorRatio = (ior - 1.0) / (ior + 1.0);
  fresnelF0 = vec3(iorRatio * iorRatio);

  vec4 baseTex = sampleBaseColor(vUV);
  vec3 baseTexLinear = baseTex.rgb / max(baseTex.a, 0.001);
  baseTex.rgb = pow(baseTexLinear, vec3(2.2));
  baseColor *= baseTex;

  vec4 mrTex = sampleMetallicRoughness(vUV);
  metallic *= mrTex.b;
  roughness *= mrTex.g;

  occlusion *= sampleOcclusion(vUV).r;

  vec3 dNdx = abs(dFdx(normal));
  vec3 dNdy = abs(dFdy(normal));
  vec3 dN = max(dNdx, dNdy);
  float geometricRoughness = max(max(dN.x, dN.y), dN.z);
  roughness = clamp(max(roughness, 0.045) + geometricRoughness, 0.0, 1.0);

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;

  viewDir = normalize(uCameraPosition.xyz - vPosition);
  fresnelF0 = mix(fresnelF0, albedo, metallic);

  vec3 specularNormal = normal;
`}}},K={name:"sheen",requires:[L.L],textures:["sheen"],bindings:{material:{sheenParams:"vec4<f32>"}},gpu:{header:`
fn charlieD(charlieScale: f32, invAlphaHalf: f32, NdotH: f32) -> f32 {
  let cos2h = NdotH * NdotH;
  let sin2h = max(1.0 - cos2h, 0.0078125);
  return charlieScale * pow(sin2h, invAlphaHalf);
}

fn ashikhminV(NdotL: f32, NdotV: f32) -> f32 {
  return 1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV) + 1e-5);
}

fn sheenE(NdotV: f32, sheenRoughness: f32) -> f32 {
  let r = sheenRoughness;
  let a = mix(21.5473, 25.3245, r);
  let b = mix(3.82987, 3.32435, r);
  let c = mix(0.19823, 0.16801, r);
  let d = mix(-1.97760, -1.27393, r);
  let e = mix(-4.32054, -4.85967, r);
  return a / (1.0 + b * pow(NdotV, c)) + d * NdotV + e;
}
`,fragment:{lobePreLighting:`
  let sheenTex = sampleSheen(input.vUV);
  let sheenTexStraight = sheenTex.rgb / max(sheenTex.a, 0.001);
  let sheenTexColor = pow(sheenTexStraight, vec3<f32>(2.2));
  let sheenColor = material.sheenParams.rgb * sheenTexColor;

  let sheenRoughnessIBL = clamp(material.sheenParams.a * sheenTex.a, 0.0, 1.0);
  let sheenRoughness = max(sheenRoughnessIBL, 0.07);
  let sheenAlpha = sheenRoughness * sheenRoughness;
  let sheenInvAlpha = 1.0 / sheenAlpha;
  let sheenInvAlphaHalf = sheenInvAlpha * 0.5;
  let sheenCharlieScale = (2.0 + sheenInvAlpha) * INV_PI * 0.5;
  let sheenMax = max(sheenColor.r, max(sheenColor.g, sheenColor.b));

  var sheenLight = vec3<f32>(0.0);
`,lobePerLight:`
    {
      let shD = charlieD(sheenCharlieScale, sheenInvAlphaHalf, nDotH);
      let shV = ashikhminV(nDotL, nDotV);
      sheenLight += sheenColor * shD * shV * nDotL * light.color * attenuation * shadow;
    }
`,lobePostLighting:`
  let shR = reflect(-viewDir, normal);
  let shPref = sampleEnvironment(shR, sheenRoughnessIBL);
  let shE = clamp(sheenE(nDotV, sheenRoughnessIBL), 0.0, 1.0);
  let sheenIBL = sheenColor * shPref * shE;
  let sheenAlbedoScale = 1.0 - sheenMax * shE;
  finalColor = finalColor * sheenAlbedoScale + sheenLight + sheenIBL;
`}},gl:{fragment:{header:`
float charlieD(float charlieScale, float invAlphaHalf, float NdotH) {
  float cos2h = NdotH * NdotH;
  float sin2h = max(1.0 - cos2h, 0.0078125);
  return charlieScale * pow(sin2h, invAlphaHalf);
}

float ashikhminV(float NdotL, float NdotV) {
  return 1.0 / (4.0 * (NdotL + NdotV - NdotL * NdotV) + 1e-5);
}

float sheenE(float NdotV, float sheenRoughness) {
  float r = sheenRoughness;
  float a = mix(21.5473, 25.3245, r);
  float b = mix(3.82987, 3.32435, r);
  float c = mix(0.19823, 0.16801, r);
  float d = mix(-1.97760, -1.27393, r);
  float e = mix(-4.32054, -4.85967, r);
  return a / (1.0 + b * pow(NdotV, c)) + d * NdotV + e;
}
`,lobePreLighting:`
  vec4 sheenTex = sampleSheen(vUV);
  vec3 sheenTexStraight = sheenTex.rgb / max(sheenTex.a, 0.001);
  vec3 sheenTexColor = pow(sheenTexStraight, vec3(2.2));
  vec3 sheenColor = material.sheenParams.rgb * sheenTexColor;

  float sheenRoughnessIBL = clamp(material.sheenParams.a * sheenTex.a, 0.0, 1.0);
  float sheenRoughness = max(sheenRoughnessIBL, 0.07);
  float sheenAlpha = sheenRoughness * sheenRoughness;
  float sheenInvAlpha = 1.0 / sheenAlpha;
  float sheenInvAlphaHalf = sheenInvAlpha * 0.5;
  float sheenCharlieScale = (2.0 + sheenInvAlpha) * INV_PI * 0.5;
  float sheenMax = max(sheenColor.r, max(sheenColor.g, sheenColor.b));

  vec3 sheenLight = vec3(0.0);
`,lobePerLight:`
    {
      float shD = charlieD(sheenCharlieScale, sheenInvAlphaHalf, nDotH);
      float shV = ashikhminV(nDotL, nDotV);
      sheenLight += sheenColor * shD * shV * nDotL * light.color * attenuation * shadow;
    }
`,lobePostLighting:`
  vec3 shR = reflect(-viewDir, normal);
  vec3 shPref = sampleEnvironment(shR, sheenRoughnessIBL);
  float shE = clamp(sheenE(nDotV, sheenRoughnessIBL), 0.0, 1.0);
  vec3 sheenIBL = sheenColor * shPref * shE;
  float sheenAlbedoScale = 1.0 - sheenMax * shE;
  finalColor = finalColor * sheenAlbedoScale + sheenLight + sheenIBL;
`}}},X={name:"specular",textures:["specular"],bindings:{material:{specularParams:"vec4<f32>"}},gpu:{fragment:{material:`
  {
    let specTex = sampleSpecular(input.vUV);
    let specTexStraight = specTex.rgb / max(specTex.a, 0.001);
    let specTexColor = pow(specTexStraight, vec3<f32>(2.2));
    let specColor = material.specularParams.rgb * specTexColor;
    let specFactor = material.specularParams.w * specTex.a;

    let ior = material.pbrParams.w;
    let iorRatio = (ior - 1.0) / (ior + 1.0);
    let iorF0 = vec3<f32>(iorRatio * iorRatio);
    let dielectricF0 = min(iorF0 * specColor, vec3<f32>(1.0)) * specFactor;

    fresnelF0 = mix(dielectricF0, albedo, metallic);
    f90 = mix(specFactor, 1.0, metallic);
  }
`}},gl:{fragment:{material:`
  {
    vec4 specTex = sampleSpecular(vUV);
    vec3 specTexStraight = specTex.rgb / max(specTex.a, 0.001);
    vec3 specTexColor = pow(specTexStraight, vec3(2.2));
    vec3 specColor = material.specularParams.rgb * specTexColor;
    float specFactor = material.specularParams.w * specTex.a;

    float ior = material.pbrParams.w;
    float iorRatio = (ior - 1.0) / (ior + 1.0);
    vec3 iorF0 = vec3(iorRatio * iorRatio);
    vec3 dielectricF0 = min(iorF0 * specColor, vec3(1.0)) * specFactor;

    fresnelF0 = mix(dielectricF0, albedo, metallic);
    f90 = mix(specFactor, 1.0, metallic);
  }
`}}},Y={name:"transmission",requires:[{name:"screenSpaceFuncs",gpu:{header:`
fn screenUVFromWorld(worldPos: vec3<f32>) -> vec2<f32> {
  let clip = camera.uViewProjectionMatrix * vec4<f32>(worldPos, 1.0);
  let ndc = clip.xy / clip.w;
  let uv = vec2<f32>(ndc.x * 0.5 + 0.5, 1.0 - (ndc.y * 0.5 + 0.5)) * camera.uViewportUVScale;
  return clamp(uv, vec2<f32>(0.0), camera.uViewportUVScale);
}

fn sampleScreenCopy(tex: texture_2d<f32>, samp: sampler, worldPos: vec3<f32>, lod: f32) -> vec4<f32> {
  let texDims = vec2<f32>(textureDimensions(tex));
  let inset = min(exp2(lod) * 0.5 / texDims, camera.uViewportUVScale * 0.5);
  let uv = clamp(screenUVFromWorld(worldPos), inset, camera.uViewportUVScale - inset);
  return textureSampleLevel(tex, samp, uv, lod);
}
`},gl:{header:`
vec2 screenUVFromWorld(vec3 worldPos) {
  vec4 clip = uViewProjectionMatrix * vec4(worldPos, 1.0);
  vec2 uv = (clip.xy / clip.w * 0.5 + 0.5) * uViewportUVScale;
  return clamp(uv, vec2(0.0), uViewportUVScale);
}

vec4 sampleScreenCopy(sampler2D tex, vec3 worldPos, float lod) {
  vec2 texDims = vec2(textureSize(tex, 0));
  vec2 inset = min(exp2(lod) * 0.5 / texDims, uViewportUVScale * 0.5);
  vec2 uv = clamp(screenUVFromWorld(worldPos), inset, uViewportUVScale - inset);
  return textureLod(tex, uv, lod);
}
`}}],textures:["transmission","thickness"],interStage:{vModelScale:"vec3<f32>"},bindings:{material:{pbrParams:"vec4<f32>",transmissionVolume:"vec4<f32>",attenuationColorIrid:"vec4<f32>"}},gpu:{vertex:{end:`
  output.vModelScale = vec3<f32>(
    length(modelMatrix[0].xyz),
    length(modelMatrix[1].xyz),
    length(modelMatrix[2].xyz)
  );
`},fragment:{material:`
  {
    let transmissionFactor = material.transmissionVolume.x;
    let thicknessFactor = material.transmissionVolume.y;
    let ior = material.pbrParams.w;

    let txFactor = transmissionFactor * sampleTransmission(input.vUV).r;
    let thickness = thicknessFactor * sampleThickness(input.vUV).g;

    let colorTexDims = vec2<f32>(textureDimensions(uOpaqueColorTexture));

    let refractedDir = refract(-viewDir, normal, 1.0 / ior);
    let transmissionRay = normalize(refractedDir) * thickness * input.vModelScale;
    let exitPoint = input.vPosition + transmissionRay;

    let txRoughness = roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
    let txLod = log2(colorTexDims.x) * txRoughness;

    var transmittedColor = sampleScreenCopy(uOpaqueColorTexture, uBrdfLutSampler, exitPoint, txLod).rgb;

    transmittedColor = decodeToLinear(transmittedColor);

    let attenuationDistance = material.transmissionVolume.z;
    if (thickness > 0.0 && attenuationDistance < 1e9) {
      let attenuationColor = material.attenuationColorIrid.rgb;
      let attCoeff = -log(max(attenuationColor, vec3(1e-6))) / attenuationDistance;
      transmittedColor *= exp(-attCoeff * length(transmissionRay));
    }

    let txIorRatio = (ior - 1.0) / (ior + 1.0);
    let txF0 = txIorRatio * txIorRatio;
    let txNdotV = max(dot(normal, viewDir), 0.0);
    let txFc5 = exp2((-5.55473 * txNdotV - 6.98316) * txNdotV);
    let txF = f90 * (txF0 + (1.0 - txF0) * txFc5);
    let effectiveTx = txFactor * (1.0 - txF);

    emissive += transmittedColor * albedo * effectiveTx;
    albedo *= (1.0 - txFactor);
  }
`}},gl:{vertex:{end:`
  vModelScale = vec3(
    length(modelMatrix[0].xyz),
    length(modelMatrix[1].xyz),
    length(modelMatrix[2].xyz)
  );
`},fragment:{material:`
  {
    float transmissionFactor = material.transmissionVolume.x;
    float thicknessFactor = material.transmissionVolume.y;
    float ior = material.pbrParams.w;

    float txFactor = transmissionFactor * sampleTransmission(vUV).r;
    float thickness = thicknessFactor * sampleThickness(vUV).g;

    vec2 colorTexDims = vec2(textureSize(uOpaqueColorTexture, 0));

    vec3 refractedDir = refract(-viewDir, normal, 1.0 / ior);
    vec3 transmissionRay = normalize(refractedDir) * thickness * vModelScale;
    vec3 exitPoint = vPosition + transmissionRay;

    float txRoughness = roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
    float txLod = log2(colorTexDims.x) * txRoughness;

    vec3 transmittedColor = sampleScreenCopy(uOpaqueColorTexture, exitPoint, txLod).rgb;

    transmittedColor = decodeToLinear(transmittedColor);

    float attenuationDistance = material.transmissionVolume.z;
    if (thickness > 0.0 && attenuationDistance < 1e9) {
      vec3 attenuationColor = material.attenuationColorIrid.rgb;
      vec3 attCoeff = -log(max(attenuationColor, vec3(1e-6))) / attenuationDistance;
      transmittedColor *= exp(-attCoeff * length(transmissionRay));
    }

    float txIorRatio = (ior - 1.0) / (ior + 1.0);
    float txF0 = txIorRatio * txIorRatio;
    float txNdotV = max(dot(normal, viewDir), 0.0);
    float txFc5 = exp2((-5.55473 * txNdotV - 6.98316) * txNdotV);
    float txF = f90 * (txF0 + (1.0 - txF0) * txFc5);
    float effectiveTx = txFactor * (1.0 - txF);

    emissive += transmittedColor * albedo * effectiveTx;
    albedo *= (1.0 - txFactor);
  }
`}}},J=R({factor:{kind:"lane",field:"specularParams",lane:3},color:{kind:"colour",field:"specularParams"},texture:{kind:"texture",slot:"specular"}}),Q=R({factor:{kind:"lane",field:"transmissionVolume",lane:3},ior:{kind:"lane",field:"attenuationColorIrid",lane:3},thicknessMinimum:{kind:"scalar",field:"iridescenceThicknessMinimum"},thicknessMaximum:{kind:"scalar",field:"iridescenceThickness"},texture:{kind:"texture",slot:"iridescence"}}),Z=R({factor:{kind:"lane",field:"transmissionVolume",lane:0},thickness:{kind:"lane",field:"transmissionVolume",lane:1},attenuationDistance:{kind:"lane",field:"transmissionVolume",lane:2},attenuationColor:{kind:"colour",field:"attenuationColorIrid"},texture:{kind:"texture",slot:"transmission"},thicknessTexture:{kind:"texture",slot:"thickness"}}),ee=R({factor:{kind:"lane",field:"clearcoatParams",lane:0},roughness:{kind:"lane",field:"clearcoatParams",lane:1},normalScale:{kind:"lane",field:"clearcoatParams",lane:2},texture:{kind:"texture",slot:"clearcoat"},roughnessTexture:{kind:"texture",slot:"clearcoatRoughness"},normalTexture:{kind:"texture",slot:"clearcoatNormal",readonly:!0}}),et=R({color:{kind:"colour",field:"sheenParams"},roughness:{kind:"lane",field:"sheenParams",lane:3},texture:{kind:"texture",slot:"sheen"}}),er=R({strength:{kind:"lane",field:"anisotropyParams",lane:0},rotation:{kind:"lane",field:"anisotropyParams",lane:1},texture:{kind:"texture",slot:"anisotropy",readonly:!0}});var ei=class extends T.AK{emissive;specular;iridescence;transmission;clearcoat;sheen;anisotropy;_featureBits=[];constructor(e={}){let{emissive:t,specular:r,iridescence:i,transmission:s,clearcoat:a,sheen:o,anisotropy:n}=e;super({...e,alphaMode:e.alphaMode??"opaque",doubleSided:e.doubleSided??!1}),s&&(this._passBit=this._passBit&~y.J.MATERIAL_PASS_MASK|y.J.TRANSMISSION);let l={baseColor:e.baseColorTexture,metallicRoughness:e.metallicRoughnessTexture,occlusion:e.occlusionTexture,normal:e.normalTexture??B.lN,...e.textures};t&&(l.emissive=t.texture,this._featureBits.push(F)),r&&(l.specular=r.colorTexture??r.texture,this._featureBits.push(X)),i&&(l.iridescence=i.texture??i.thicknessTexture,this._featureBits.push(q)),s&&(l.transmission=s.texture,l.thickness=s.thicknessTexture,this._featureBits.push(Y)),a&&(l.clearcoat=a.texture,l.clearcoatRoughness=a.roughnessTexture,a.normalTexture?(l.clearcoatNormal=a.normalTexture,this._featureBits.push(U)):this._featureBits.push(G)),o&&(l.sheen=o.texture??o.roughnessTexture,this._featureBits.push(K)),n&&(n.texture?(l.anisotropy=n.texture,this._featureBits.push(A.fW)):this._featureBits.push(A.am)),this._deriveLayoutFromBits([W,P,...this._featureBits,...this.extraBits],l);let h=this.data;h.pbrParams[0]=e.metallic??0,h.pbrParams[1]=e.roughness??1,h.pbrParams[2]=e.occlusionStrength??1,h.pbrParams[3]=e.ior??1.5,h.normalScale=e.normalScale??1,h.transmissionVolume[2]=1e10;let u=h.attenuationColorIrid;if((0,T.Og)(u,0,m.Q1f.shared.setValue(0xffffff)),u[3]=1.3,t){let e=this.emissive=new z(this);e.color=t.color??0xffffff,e.strength=t.strength??1}if(r){let e=this.specular=new J(this);e.color=r.color??0xffffff,e.factor=r.factor??1}if(i){let e=this.iridescence=new Q(this);e.factor=i.factor??1,e.ior=i.ior??1.3,e.thicknessMaximum=i.thicknessMaximum??400,e.thicknessMinimum=i.thicknessMinimum??0}if(s){let e=this.transmission=new Z(this);e.factor=s.factor??1,e.thickness=s.thickness??0,e.attenuationDistance=s.attenuationDistance??1e10,e.attenuationColor=s.attenuationColor??0xffffff}if(a){let e=this.clearcoat=new ee(this);e.factor=a.factor??1,e.roughness=a.roughness??0,e.normalScale=a.normalScale??1}if(o){let e=this.sheen=new et(this);e.color=o.color??0xffffff,e.roughness=o.roughness??0}if(n){let e=this.anisotropy=new er(this);e.strength=n.strength??1,e.rotation=n.rotation??0}}_descriptorByEnvKey=Object.create(null);getPrimaryDescriptor(e){this._variantDirty&&(this._descriptorByEnvKey=Object.create(null),this._variantDirty=!1);let t=e._envBit,r=t.name,i=this._descriptorByEnvKey[r];if(i)return i;let s=[W,t],a=[W,t];return null!==e.environment&&(s.push($),a.push($)),s.push(j),a.push(j),s.push(P),a.push(P),s.push(...this._featureBits),a.push(...this._featureBits),s.push(...this.extraBits),a.push(...this.extraBits),"mask"===this._alphaMode&&(s.push(I),a.push(I)),(i=new M.X({})).update({bitsGpu:s,bitsGl:a}),this._descriptorByEnvKey[r]=i,i}_toOptions(){let{emissive:e,specular:t,iridescence:r,transmission:i,clearcoat:s,sheen:a,anisotropy:o,textures:n}=this;return{...super._toOptions(),metallic:this.metallic,roughness:this.roughness,occlusionStrength:this.occlusionStrength,ior:this.ior,normalScale:this.normalScale,normalTexture:n.normal,metallicRoughnessTexture:n.metallicRoughness,occlusionTexture:n.occlusion,emissive:e&&k(e),specular:t&&k(t),iridescence:r&&k(r),transmission:i&&k(i),clearcoat:s&&k(s),sheen:a&&k(a),anisotropy:o&&k(o)}}get metallic(){return this.data.pbrParams[0]}set metallic(e){this.data.pbrParams[0]!==Math.fround(e)&&(this.data.pbrParams[0]=e,this.update())}get roughness(){return this.data.pbrParams[1]}set roughness(e){this.data.pbrParams[1]!==Math.fround(e)&&(this.data.pbrParams[1]=e,this.update())}get occlusionStrength(){return this.data.pbrParams[2]}set occlusionStrength(e){this.data.pbrParams[2]!==Math.fround(e)&&(this.data.pbrParams[2]=e,this.update())}get ior(){return this.data.pbrParams[3]}set ior(e){this.data.pbrParams[3]!==Math.fround(e)&&(this.data.pbrParams[3]=e,this.update())}get normalScale(){return this.data.normalScale}set normalScale(e){this.data.normalScale=e}destroy(e){this.destroyed||(super.destroy(e),this._descriptorByEnvKey=null,this._featureBits=null,this.emissive=void 0,this.specular=void 0,this.iridescence=void 0,this.transmission=void 0,this.clearcoat=void 0,this.sheen=void 0,this.anisotropy=void 0)}},es=class extends m.v9C{_container;_root;_transform=new m.uqu;_clearColor;_clearRgba=[0,0,0,1];_renderer=null;_autoUpdate=!1;_isConnectedToTicker=!1;_onTick=()=>{this.render()};_onRendererDestroy={destroy:()=>{this._renderer=null,this._configureAutoUpdate()}};constructor(e){let{container:t}=e,r=void 0===e.width||void 0===e.height?t.getLocalBounds():void 0,i=Math.max(1,Math.ceil(e.width??r.width)),s=Math.max(1,Math.ceil(e.height??r.height));void 0===e.width&&0===r.width&&(0,m.R8M)("ContainerSource: container has zero width bounds and no explicit width; defaulting to 1."),void 0===e.height&&0===r.height&&(0,m.R8M)("ContainerSource: container has zero height bounds and no explicit height; defaulting to 1."),super({width:i,height:s,resolution:e.resolution??1,antialias:e.antialias??!1}),this._root=new m.mcf,this._root.addChild(t),this._container=t,e.transform?this._transform.copyFrom(e.transform):void 0===e.width&&void 0===e.height&&this._transform.translate(-r.minX,-r.minY),this._clearColor=new m.Q1f(e.clearColor??"transparent"),e.renderer&&this._setRenderer(e.renderer),(e.firstRender??!0)&&(this._renderer?this.render():e.firstRender&&(0,m.R8M)("ContainerSource: `firstRender` was set without a `renderer`; nothing was rendered.")),e.autoUpdate&&(this.autoUpdate=!0)}get container(){return this._container}get renderer(){return this._renderer}set renderer(e){this._setRenderer(e)}get autoUpdate(){return this._autoUpdate}set autoUpdate(e){e!==this._autoUpdate&&(this._autoUpdate=e,e&&!this._renderer&&(0,m.R8M)("ContainerSource: `autoUpdate` was enabled without a `renderer`; set one to drive it."),this._configureAutoUpdate())}get transform(){return this._transform}set transform(e){this._transform.copyFrom(e)}get clearColor(){return this._clearColor}set clearColor(e){this._clearColor.setValue(e)}setContainer(e){e!==this._container&&(this._root.removeChildren(),this._root.addChild(e),this._container=e)}render(e){let t=e??this._renderer;if(!t)return void(0,m.R8M)("ContainerSource.render: no renderer passed and none retained; nothing was rendered.");this._setRenderer(t);let r=this._clearColor.toArray(this._clearRgba),i=r[3];r[0]*=i,r[1]*=i,r[2]*=i,t.render({container:this._root,target:this,clear:!0,clearColor:r,transform:this._transform,flipY:!0})}destroy(e=!1){this._autoUpdate=!1,this._setRenderer(null),this._root.removeChildren(),e&&this._container.destroy({children:!0}),this._root.destroy(),super.destroy()}_setRenderer(e){e!==this._renderer&&(this._renderer?.runners.destroy.remove(this._onRendererDestroy),this._renderer=e,e?.runners.destroy.add(this._onRendererDestroy),this._configureAutoUpdate())}_configureAutoUpdate(){let e=this._autoUpdate&&null!==this._renderer;e!==this._isConnectedToTicker&&(e?m.RvI.shared.add(this._onTick,this,m.dQl.LOW+1):m.RvI.shared.remove(this._onTick,this),this._isConnectedToTicker=e)}},ea=class extends m.gPd{constructor(e){super({source:new es(e)})}get containerSource(){return this.source}get container(){return this.containerSource.container}get renderer(){return this.containerSource.renderer}set renderer(e){this.containerSource.renderer=e}get autoUpdate(){return this.containerSource.autoUpdate}set autoUpdate(e){this.containerSource.autoUpdate=e}get transform(){return this.containerSource.transform}set transform(e){this.containerSource.transform=e}get clearColor(){return this.containerSource.clearColor}set clearColor(e){this.containerSource.clearColor=e}setContainer(e){this.containerSource.setContainer(e)}render(e){this.containerSource.render(e)}destroy(e=!1){let t="boolean"==typeof e?e:e.source??!1,r="boolean"!=typeof e&&(e.container??!1);(t||r)&&this.containerSource.destroy(r),super.destroy(!1)}};function eo(e,t){return Number.isFinite(e)?Math.max(t,Math.floor(e)):t}var en=class e extends _{static defaultOptions={..._.defaultOptions,radius:.5,height:2,radialSegments:32,heightSegments:8};constructor(t={}){let r={...e.defaultOptions,...t},{radius:i,height:s}=r,a=eo(r.radialSegments,3),o=eo(r.heightSegments,1),n=Math.max(1,Math.ceil(a/2)),l=Math.max(0,s-2*i),h=.5*l,u=1/(l+2*i),d=i*u,c=l*u,f=1/a,p=1/o,m=1/n,_=a+1,g=new Float32Array(_),x=new Float32Array(_),y=2*Math.PI*f;for(let e=0;e<_;e++){let t=e*y;g[e]=Math.sin(t),x[e]=Math.cos(t)}let v=n+(o+1)+n,b=v-1,w=v*_,T=new Float32Array(3*w),C=new Float32Array(3*w),S=new Float32Array(2*w),D=new(w>65536?Uint32Array:Uint16Array)((b-1)*a*6),M=0,B=0,I=0,P=0;for(let e=0;e<n;e++){let t=e*m,r=Math.PI/2*(1-t),s=d*t,o=Math.cos(r),n=Math.sin(r),l=o*i,u=n*i+h;for(let e=0;e<=a;e++){let t=e*f,r=x[e],i=g[e];T[M++]=l*r,T[M++]=u,T[M++]=l*i,C[B++]=o*r,C[B++]=n,C[B++]=o*i,S[I++]=t,S[I++]=s}}for(let e=0;e<=o;e++){let t=e*p,r=h-t*l,s=d+t*c;for(let e=0;e<=a;e++){let t=e*f,a=x[e],o=g[e];T[M++]=i*a,T[M++]=r,T[M++]=i*o,C[B++]=a,C[B++]=0,C[B++]=o,S[I++]=t,S[I++]=s}}for(let e=1;e<=n;e++){let t=e*m,r=Math.PI/2*t,s=d+c+d*t,o=Math.cos(r),n=Math.sin(r),l=o*i,u=-n*i-h;for(let e=0;e<=a;e++){let t=e*f,r=x[e],i=g[e];T[M++]=l*r,T[M++]=u,T[M++]=l*i,C[B++]=o*r,C[B++]=-n,C[B++]=o*i,S[I++]=t,S[I++]=s}}let A=b-1;for(let e=0;e<b;e++){let t=0===e,r=e===A;for(let i=0;i<a;i++){let s=e*_+i,a=s+1,o=s+_,n=o+1;t||(D[P++]=s,D[P++]=a,D[P++]=o),r||(D[P++]=a,D[P++]=n,D[P++]=o)}}super({...r,positions:T,normals:C,uvs:S,indices:D})}},el=r(49491),eh=class e extends _{static defaultOptions={..._.defaultOptions,width:1,height:1,depth:1,widthSegments:1,heightSegments:1,depthSegments:1};constructor(t={}){let r={...e.defaultOptions,...t},{width:i,height:s,depth:a}=r,o=eo(r.widthSegments,1),n=eo(r.heightSegments,1),l=eo(r.depthSegments,1),h=i/2,d=s/2,c=a/2,f=(o+1)*(n+1)*2+(o+1)*(l+1)*2+(l+1)*(n+1)*2,p=o*n*12+o*l*12+l*n*12,m=new Float32Array(3*f),_=new Float32Array(3*f),g=new Float32Array(2*f),x=f<=65536?new Uint16Array(p):new Uint32Array(p),y={pos:0,nrm:0,uv:0,idx:0,vert:0},v=(e,t,r,i,s,a)=>{let o=y.vert,n=s+1,l=e[0][0],h=e[0][1],u=e[0][2],d=e[1][0],c=e[1][1],f=e[1][2],p=e[2][0],v=e[2][1],b=e[2][2],w=e[3][0],T=e[3][1],C=e[3][2],S=y.pos,D=y.nrm,M=y.uv;for(let e=0;e<=a;e++){let o=e/a,n=l+(w-l)*o,x=h+(T-h)*o,y=u+(C-u)*o,B=d+(p-d)*o,I=c+(v-c)*o,P=f+(b-f)*o;for(let e=0;e<=s;e++){let a=e/s;m[S++]=n+(B-n)*a,m[S++]=x+(I-x)*a,m[S++]=y+(P-y)*a,_[D++]=t,_[D++]=r,_[D++]=i,g[M++]=a,g[M++]=o}}y.pos=S,y.nrm=D,y.uv=M,y.vert=o+n*(a+1);let B=y.idx;for(let e=0;e<a;e++){let t=o+e*n,r=t+n;for(let e=0;e<s;e++){let i=t+e,s=i+1,a=r+e,o=a+1;x[B++]=i,x[B++]=s,x[B++]=o,x[B++]=i,x[B++]=o,x[B++]=a}}y.idx=B};v([[-h,-d,c],[h,-d,c],[h,d,c],[-h,d,c]],0,0,1,o,n),v([[h,-d,-c],[-h,-d,-c],[-h,d,-c],[h,d,-c]],0,0,-1,o,n),v([[-h,d,c],[h,d,c],[h,d,-c],[-h,d,-c]],0,1,0,o,l),v([[-h,-d,-c],[h,-d,-c],[h,-d,c],[-h,-d,c]],0,-1,0,o,l),v([[h,-d,c],[h,-d,-c],[h,d,-c],[h,d,c]],1,0,0,l,n),v([[-h,-d,-c],[-h,-d,c],[-h,d,c],[-h,d,-c]],-1,0,0,l,n);let b=r.bounds3D??new u.a(new el.P(-h,-d,-c),new el.P(h,d,c));super({...r,bounds3D:b,positions:m,normals:_,uvs:g,indices:x})}},eu=class e extends _{static defaultOptions={..._.defaultOptions,radiusTop:1,radiusBottom:1,height:2,radialSegments:32,heightSegments:1,openEnded:!1};constructor(t={}){let r={...e.defaultOptions,...t},{radiusTop:i,radiusBottom:s,height:a,radialSegments:o,heightSegments:n,openEnded:l}=r,h=function(e,t,r,i,s,a){let o=eo(i,3),n=eo(s,1),l=.5*r,h=(t-e)/r,u=1/Math.sqrt(1+h*h),d=h*u,c=1/o,f=1/n,p=o+1,m=new Float32Array(p),_=new Float32Array(p),g=2*Math.PI*c;for(let e=0;e<p;e++){let t=e*g;m[e]=Math.sin(t),_[e]=Math.cos(t)}let x=0===e,y=0===t,v=!a&&!x,b=!a&&!y,w=p*(n+1)+(v?p+1:0)+(b?p+1:0),T=o*n*6-((x?3*o:0)+(y?3*o:0))+(v?3*o:0)+(b?3*o:0),C=new Float32Array(3*w),S=new Float32Array(3*w),D=new Float32Array(2*w),M=new(w>65536?Uint32Array:Uint16Array)(T),B=0,I=0,P=0,A=0;for(let i=0;i<=n;i++){let s=i*f,a=s*(t-e)+e,n=l-s*r;for(let e=0;e<=o;e++){let t=e*c,r=m[e],i=_[e];C[B++]=a*i,C[B++]=n,C[B++]=a*r,S[I++]=i*u,S[I++]=d,S[I++]=r*u,D[P++]=t,D[P++]=s}}for(let e=0;e<n;e++){let t=x&&0===e,r=y&&e===n-1;for(let i=0;i<o;i++){let s=e*p+i,a=s+1,o=s+p,n=o+1;t||(M[A++]=s,M[A++]=a,M[A++]=o),r||(M[A++]=a,M[A++]=n,M[A++]=o)}}if(v){let t=B/3;C[B++]=0,C[B++]=l,C[B++]=0,S[I++]=0,S[I++]=1,S[I++]=0,D[P++]=.5,D[P++]=.5;for(let t=0;t<=o;t++){let r=_[t],i=m[t];C[B++]=e*r,C[B++]=l,C[B++]=e*i,S[I++]=0,S[I++]=1,S[I++]=0,D[P++]=.5*r+.5,D[P++]=.5*i+.5}for(let e=0;e<o;e++)M[A++]=t,M[A++]=t+e+2,M[A++]=t+e+1}if(b){let e=B/3;C[B++]=0,C[B++]=-l,C[B++]=0,S[I++]=0,S[I++]=-1,S[I++]=0,D[P++]=.5,D[P++]=.5;for(let e=0;e<=o;e++){let r=_[e],i=m[e];C[B++]=t*r,C[B++]=-l,C[B++]=t*i,S[I++]=0,S[I++]=-1,S[I++]=0,D[P++]=.5*r+.5,D[P++]=.5*i+.5}for(let t=0;t<o;t++)M[A++]=e,M[A++]=e+t+1,M[A++]=e+t+2}return{positions:C,normals:S,uvs:D,indices:M}}(i,s,a,o,n,l);super({...r,...h})}},ed=class e extends _{static defaultOptions={..._.defaultOptions,radius:1,widthSegments:32,heightSegments:16};constructor(t={}){let r={...e.defaultOptions,...t},{radius:i}=r,s=eo(r.widthSegments,3),a=eo(r.heightSegments,2),o=(s+1)*(a+1),n=(a-1)*s*2,l=new Float32Array(3*o),h=new Float32Array(3*o),u=new Float32Array(2*o),d=o<=65536?new Uint16Array(3*n):new Uint32Array(3*n),c=new Float64Array(a+1),f=new Float64Array(a+1);for(let e=0;e<=a;e++){let t=e/a*Math.PI;c[e]=Math.sin(t),f[e]=Math.cos(t)}let p=new Float64Array(s+1),m=new Float64Array(s+1);for(let e=0;e<=s;e++){let t=e/s*Math.PI*2;p[e]=Math.sin(t),m[e]=Math.cos(t)}let _=0,g=0;for(let e=0;e<=a;e++){let t=e/a,r=c[e],o=f[e];for(let e=0;e<=s;e++){let a=e/s,n=p[e],d=r*m[e],c=r*n;l[_]=d*i,l[_+1]=o*i,l[_+2]=c*i,h[_]=d,h[_+1]=o,h[_+2]=c,_+=3,u[g]=a,u[g+1]=t,g+=2}}let x=s+1,y=0;for(let e=0;e<a;e++)for(let t=0;t<s;t++){let r=e*x+t,i=r+1,s=r+x,o=s+1;0!==e&&(d[y]=r,d[y+1]=i,d[y+2]=s,y+=3),e!==a-1&&(d[y]=i,d[y+1]=o,d[y+2]=s,y+=3)}super({...r,positions:l,normals:h,uvs:u,indices:d})}},ec=class e extends _{static defaultOptions={..._.defaultOptions,radius:1,tube:.4,radialSegments:12,tubularSegments:48,arc:2*Math.PI,thetaStart:0,thetaLength:2*Math.PI};constructor(t={}){let r={...e.defaultOptions,...t},{radius:i,tube:s,arc:a,thetaStart:o,thetaLength:n}=r,l=eo(r.radialSegments,3),h=eo(r.tubularSegments,3),u=(l+1)*(h+1),d=l*h*6,c=new Float32Array(3*u),f=new Float32Array(3*u),p=new Float32Array(2*u),m=u>65536?new Uint32Array(d):new Uint16Array(d),_=new Float64Array(h+1),g=new Float64Array(h+1);for(let e=0;e<=h;e++){let t=e/h*a;_[e]=Math.cos(t),g[e]=Math.sin(t)}let x=0,y=0,v=0;for(let e=0;e<=l;e++){let t=o+e/l*n,r=Math.cos(t),a=Math.sin(t),u=e/l,d=i+s*r,m=s*a;for(let e=0;e<=h;e++){let t=_[e],i=g[e];c[x++]=d*t,c[x++]=m,c[x++]=d*i,f[y++]=r*t,f[y++]=a,f[y++]=r*i,p[v++]=e/h,p[v++]=u}}let b=h+1,w=0;for(let e=1;e<=l;e++)for(let t=1;t<=h;t++){let r=b*e+t-1,i=b*(e-1)+t-1,s=b*(e-1)+t,a=b*e+t;m[w++]=r,m[w++]=a,m[w++]=i,m[w++]=i,m[w++]=a,m[w++]=s}super({...r,positions:c,normals:f,uvs:p,indices:m})}},ef=r(55464),ep=class extends d.B{get color(){return this._color}set color(e){this._color.setValue(e)}intensity=0;castShadow=!1;get canCastShadow(){return this.castShadow}shadow;_lookAtForwardIsPositiveZ=!1;_color;_gpuShadowData=null;_shadowDataIndex=-1;_shadowRefreshRequested=!0;_autoShadowBounds=null;_autoShadowBoundsFrozen=!1;constructor(e){let{color:t,intensity:r,castShadow:i,shadow:s,...a}=e;super(a),this._color=new m.Q1f(t),this.intensity=r??1,this.castShadow=i??!1,this.shadow={bounds:void 0,cascades:void 0,update:1,maxDistance:void 0,lambda:.5,bias:void 0,normalBias:void 0},s&&(void 0!==s.bounds&&(this.shadow.bounds=s.bounds),void 0!==s.cascades&&(this.shadow.cascades=s.cascades),void 0!==s.update&&(this.shadow.update=s.update),void 0!==s.maxDistance&&(this.shadow.maxDistance=s.maxDistance),void 0!==s.lambda&&(this.shadow.lambda=s.lambda),void 0!==s.bias&&(this.shadow.bias=s.bias),void 0!==s.normalBias&&(this.shadow.normalBias=s.normalBias))}refreshShadows(){this._shadowRefreshRequested=!0}fitShadowBounds(){this._autoShadowBoundsFrozen=!1,this._shadowRefreshRequested=!0}_releaseShadowState(){this._gpuShadowData&&((0,ef.D9)(this._gpuShadowData),this._gpuShadowData=null)}destroy(e){this.destroyed||(this._releaseShadowState(),this._shadowDataIndex=-1,this._shadowRefreshRequested=!1,this._autoShadowBounds=null,this._autoShadowBoundsFrozen=!1,super.destroy(e))}},em=class e extends ep{static defaultOptions={color:0xffffff,intensity:1,castShadow:!1};type="directional";constructor(t={}){super({label:"DirectionalLight",...e.defaultOptions,...(0,m.S6_)(t)})}},e_=r(36384),eg=r(53608),ex=class e{animation;player;time=0;animationSpeed=1;loop=!0;weight=1;onComplete=null;onLoop=null;_playing=!1;_completed=!1;_looped=!1;_trackIndices;_accumulators=[];static _scratchBuffer=new Float32Array(4);constructor(t,r){this.player=t,this.animation=r,this._trackIndices=new Int32Array(r.tracks.length);for(let t=0;t<r.tracks.length;t++)r.tracks[t].valueSize>e._scratchBuffer.length&&(e._scratchBuffer=new Float32Array(r.tracks[t].valueSize))}get playing(){return this._playing}play(){return this._playing||this.player.destroyed||(this._playing=!0,this.player._activate(this)),this}stop(){return this._playing&&(this._playing=!1,this.player._deactivate()),this}gotoAndPlay(e){return this.time=e,this.play()}gotoAndStop(e){return this.player.destroyed||(this.stop(),this.time=e,this._applyPose()),this}_update(t){if(!this._playing)return;let r=this.animation.duration,i=this.time+t*this.animationSpeed;(i>=r||i<0)&&(this.loop?r>0?((i%=r)<0&&(i+=r),this._looped=!0):i=0:(i=i<0?0:r,this._completed=!0,this.stop())),this.time=i;let s=this.weight;if(0===s)return;let a=e._scratchBuffer,o=this.animation.tracks,n=this._accumulators,l=this._trackIndices;if(0!==n.length)for(let e=0;e<o.length;e++){let t=o[e],r=n[e];if(!r)continue;let i=l[e];if(r.dirty){l[e]=t.evaluate(this.time,i,a);let o=r.weight+s;o>0&&t.blendInto(r.values,a,s/o),r.weight=o}else l[e]=t.evaluate(this.time,i,r.values),r.weight=s,r.dirty=!0}}_emitCallbacks(){this._looped&&(this._looped=!1,this.onLoop?.()),this._completed&&(this._completed=!1,this.onComplete?.())}_applyPose(){this.player._bind(this);let e=this.animation.tracks,t=this._accumulators,r=this._trackIndices;for(let i=0;i<e.length;i++){let s=t[i];r[i]=e[i].evaluate(this.time,r[i],s.values),s.binding.apply(s.values)}}},ey=r(83039),ev=r(26054),eb=class{},ew=class extends eb{_target;constructor(e){super(),this._target=e}apply(e){let t=this._target,r=e.length;for(let i=0;i<r;i++)t[i]=e[i]}},eT=class extends eb{_target;_key;constructor(e,t){super(),this._target=e,this._key=t}apply(e){this._target[this._key]=e[0]}},eC=class extends eb{_target;constructor(e){super(),this._target=e}apply(e){let t=e[0],r=e[1],i=e[2],s=e[3],a=t*t+r*r+i*i+s*s;if(0===a)return void this._target.set(0,0,0,1);let o=1/Math.sqrt(a);this._target.set(t*o,r*o,i*o,s*o)}},eS=class extends eb{_skel;_offset3;constructor(e,t){super(),this._skel=e,this._offset3=t}apply(e){let t=this._offset3,r=this._skel.localPosition;r[t]=e[0],r[t+1]=e[1],r[t+2]=e[2],this._skel.dirty=!0}},eD=class extends eb{_skel;_offset4;constructor(e,t){super(),this._skel=e,this._offset4=t}apply(e){let t=this._offset4,r=this._skel.localRotation,i=e[0],s=e[1],a=e[2],o=e[3],n=i*i+s*s+a*a+o*o,l=n>0?1/Math.sqrt(n):0;r[t]=i*l,r[t+1]=s*l,r[t+2]=a*l,r[t+3]=0===l?1:o*l,this._skel.dirty=!0}},eM=class extends eb{_skel;_offset3;constructor(e,t){super(),this._skel=e,this._offset3=t}apply(e){let t=this._offset3,r=this._skel.localScale;r[t]=e[0],r[t+1]=e[1],r[t+2]=e[2],this._skel.dirty=!0}},eB=class extends eb{_target;constructor(e){super(),this._target=e}apply(e){this._target.set(e[0],e[1],e[2])}},eI=class extends eb{apply(){}},eP=class{binding;values;weight=0;dirty=!1;constructor(e,t){this.binding=e,this.values=new Float32Array(t)}},eA=class e{static defaultOptions={autoUpdate:!0,autoPlay:!1};target;_states=[];_stateCache=new Map;_animations=new Map;_animationLabels=null;_autoUpdate;_isConnectedToTicker=!1;_updating=!1;_destroyed=!1;_accumulators={};_accumulatorList=[];_nodeMap;_onTick=e=>{this.update(e)};constructor(t){let{target:r,animations:i,nodeMap:s,autoUpdate:a,autoPlay:o}={...e.defaultOptions,...(0,m.S6_)(t)};this.target=r,this._nodeMap=s,this._autoUpdate=a,i&&this.addAnimations(i);let n=!0===o?this.animationLabels[0]:o;"string"==typeof n&&this.play(n)}get animationLabels(){return this._animationLabels??=Array.from(this._animations.keys())}addAnimations(e){Array.isArray(e)?e.forEach(e=>this._animations.set(e.label,e)):Object.entries(e).forEach(([e,t])=>this._animations.set(e,t)),this._animationLabels=null}getAnimation(e){return this._animations.get(e)}play(e){return this.getState(e).play()}stop(){let e=this._states,t=this._updating;this._updating=!0;for(let t=0;t<e.length;t++)e[t].stop();this._updating=t,t||this._removeStopped()}get playing(){let e=this._states;for(let t=0;t<e.length;t++)if(e[t].playing)return!0;return!1}getState(e){if("string"==typeof e){let t=this._animations.get(e);if(!t)throw Error(`[AnimationPlayer] Animation "${e}" is not registered.`);e=t}let t=this._stateCache.get(e);return t||(t=new ex(this,e),this._stateCache.set(e,t)),t}get autoUpdate(){return this._autoUpdate}set autoUpdate(e){e!==this._autoUpdate&&(this._autoUpdate=e,this._autoUpdate?this.playing&&this._connectTicker():this._disconnectTicker())}_activate(e){!this._destroyed&&(-1===this._states.indexOf(e)&&this._states.push(e),this._bind(e),this._autoUpdate&&this._connectTicker())}_bind(e){if(e._accumulators.length>0)return;let t=e.animation.tracks;for(let r=0;r<t.length;r++)e._accumulators[r]=this._getAccumulator(t[r])}_deactivate(){this._updating||this._removeStopped()}update(e){let t=e?e.deltaMS/1e3:1/60,r=this._states,i=r.length;this._updating=!0;for(let e=0;e<i;e++)r[e]._update(t);let s=this._accumulatorList,a=s.length;for(let e=0;e<a;e++){let t=s[e];t.dirty&&(t.binding.apply(t.values),t.dirty=!1,t.weight=0)}for(let e=0;e<i;e++)if(r[e]._emitCallbacks(),this._destroyed)return;this._updating=!1,this._removeStopped()}get destroyed(){return this._destroyed}destroy(){this._destroyed||(this._destroyed=!0,this._updating=!1,this._disconnectTicker(),this.stop(),this._stateCache.forEach(e=>{e.onComplete=null,e.onLoop=null}),this._states.length=0,this._stateCache.clear(),this._animations.clear(),this._animationLabels=null,this._accumulators={},this._accumulatorList.length=0)}_removeStopped(){let e=this._states,t=0;for(let r=0;r<e.length;r++)e[r].playing&&(e[t++]=e[r]);e.length=t,0===t&&this._disconnectTicker()}_connectTicker(){this._isConnectedToTicker||(m.RvI.shared.add(this._onTick,void 0,m.dQl.HIGH),this._isConnectedToTicker=!0)}_disconnectTicker(){this._isConnectedToTicker&&(m.RvI.shared.remove(this._onTick),this._isConnectedToTicker=!1)}_getAccumulator(e){let t,r,i=e.label;if(this._accumulators[i])return this._accumulators[i];let s=i.split("."),a=s.pop(),o=s.join("."),n=-1;if(this._nodeMap){let e=parseInt(o,10);if(!isNaN(e)){let i=this._nodeMap[e];i&&(i instanceof d.B?t=i:(r=i.skeleton,n=i.boneIndex))}}if(!t&&!r){let e=function e(t,r){if(t.label===r)return{node:t};if(t instanceof D&&t.skeleton)try{return{skeleton:t.skeleton,boneIndex:t.skeleton.indexOf(r)}}catch{}for(let i of t.children){let t=e(i,r);if(t)return t}}(this.target,o);t=e?.node,r=e?.skeleton,n=e?.boneIndex??-1}let l=new eP(function(e){var t;if(e.skeleton&&void 0!==e.boneIndex&&-1!==e.boneIndex){let t=e.boneIndex;switch(e.channel){case"position":return new eS(e.skeleton,3*t);case"quaternion":return new eD(e.skeleton,4*t);case"scale":return new eM(e.skeleton,3*t)}}let r=e.target;if(!r)return new eI;let i=e.channel,s=r[i];if(s instanceof el.P||s instanceof ev.A)return new eB(s);if(s instanceof eg.P||s instanceof ey.W)return new eC(s);if("number"==typeof s)return new eT(r,i);if(Array.isArray(t=s)||t instanceof Float32Array||t instanceof Float64Array)return new ew(s);return new eI}({target:t,channel:a,skeleton:r,boneIndex:n}),e.valueSize);return this._accumulators[i]=l,this._accumulatorList.push(l),l}},eF=class{textures=[];materials=[];geometries=[];texture={};material={};geometry={};animations={};scene={};destroyed=!1;_descriptor;_imageUrls=[];constructor(e){this._descriptor=e,e.scenes&&e.scenes.forEach(e=>{e.name&&(this.scene[e.name]=e)})}destroy(){if(!this.destroyed){for(let e of(this.destroyed=!0,this.geometries))if(e)for(let t of e)t.destroy(!0);for(let e of this.materials)e?.destroy();for(let e of this.textures)!e||e.destroyed||B.X6.has(e)||e.destroy(!0);this.geometries=null,this.materials=null,this.textures=null,this._imageUrls=null,this.geometry=null,this.material=null,this.texture=null,this.animations=null,this.scene=null}}},eR=class{stride=0;offset=0;fields;_store;_baseIndex=0;_size=0;constructor(e,t,r){let{layout:i}=e;this._store=e,this._baseIndex=t,this._size=r,this.stride=i.stride,this.offset=t*i.stride,this.fields=i.offsets}get data(){return this._store.data}get u32Data(){return this._store.u32Data}update(e=0,t=this._size-e){let r=this._size;if(!(e>=0&&t>=0&&e+t<=r))throw RangeError(`update: slots ${e} to ${e+t-1} are outside the batch (${r} slots).`);if(0===t)return;let i=this._baseIndex+e;this._store.markDirtyRange(i,i+t-1)}destroy(){this._store=null}},ek=r(53443);let ez=(e,t,r)=>{e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7]},eV=(e,t,r,i,s)=>{ez(i,s/2,e.worldTransform.elements64),e.skeleton&&(r[s+16]=e.skeleton._bonePitIndex),r[s+17]=e.material._materialIndex,r[s+18]=e.geometry._geometryDataIndex,r[s+20]=e._morph?e._morph._weightIndex:0};function eL(e,t,r,i,s,a){let o=s.boundsSphere,n=o.radius;if(s.dynamic||n<0){e[t]=0,e[t+1]=0,e[t+2]=0,e[t+3]=-1;return}let l=o.center,h=l.x,u=l.y,d=l.z,c=r[i],f=r[i+1],p=r[i+2],m=r[i+4],_=r[i+5],g=r[i+6],x=r[i+8],y=r[i+9],v=r[i+10];e[t]=c*h+m*u+x*d+r[i+12],e[t+1]=f*h+_*u+y*d+r[i+13],e[t+2]=p*h+g*u+v*d+r[i+14],e[t+3]=(n+a)*Math.sqrt(Math.max(c*c+f*f+p*p,m*m+_*_+g*g,x*x+y*y+v*v))}var eO=class extends ek.E{boundingSpheres=null;writesSpheres=!1;visible;constructor(e=100){super({stride:24,initialSize:e,indexKey:"_storeIndex",copier:eV}),this.visible=new Uint8Array(Math.floor(this.data.length/24))}enableSphereWrites(e){this.writesSpheres=e,e&&null===this.boundingSpheres&&this.data&&(this.boundingSpheres=new Float32Array(4*Math.floor(this.data.length/24)))}set(e){let t=super.set(e);if(t>=0){this._storeVisibility(t,e._worldVisible);let r=e.geometry;this.writeBoundingSphere(t,this.data,24*t,r,e._morph?r._morphBoundsExpansion:0)}return t}writeBoundingSphere(e,t,r,i,s){this.writesSpheres&&eL(this.boundingSpheres,4*e,t,r,i,s)}writeWorldTransform(e,t){ez(this.fl64Data,12*e,t),this.markDirty(e)}writeVisibility(e,t){this._storeVisibility(e,t),this.markDirty(e)}writeVisibilityRange(e,t,r){for(let i=e,s=e+t;i<s;i++)this._storeVisibility(i,r)}_storeVisibility(e,t){this.u32Data[24*e+19]=t,this.visible[e]=t}destroy(){super.destroy(),this.visible=null,this.boundingSpheres=null}_expand(e){super._expand(e);let t=new Uint8Array(Math.floor(this.data.length/24));if(t.set(this.visible),this.visible=t,null===this.boundingSpheres)return;let r=new Float32Array(4*Math.floor(this.data.length/24));r.set(this.boundingSpheres),this.boundingSpheres=r}},eN=class{stride=24;offset=0;_batch;_baseIndex=0;constructor(e,t){this._batch=e,this._baseIndex=t,this.offset=24*t}get data(){return this._batch.storeBuffer.data}update(e=0,t=this._batch.items.length-e){let r=this._batch,i=r.items;if(!(e>=0&&t>=0&&e+t<=i.length))throw RangeError(`update: slots ${e} to ${e+t-1} are outside the batch (${i.length} slots).`);if(0===t)return;let s=this._baseIndex+e;if(r.storeBuffer.markDirtyRange(s,s+t-1),r.storeBuffer.writesSpheres)for(let i=e,s=e+t;i<s;i++)r._writeSlotSphere(i)}destroy(){this._batch=null}},eE=r(78599);let eG=/^[A-Za-z][A-Za-z0-9_]*$/,eU=["vec4<f32>","vec4<u32>","vec4<i32>"],e$=()=>{};var eq=class extends ek.E{layout;constructor(e,t,r){let i=function(e){let t=Object.keys(e);if(0===t.length)throw Error("instanceData: no fields declared. Declare at least one, or leave the option out.");let r={};for(let i of t){let t=e[i];if(!eG.test(i)||i.includes("__"))throw Error(`instanceData: "${i}" is not a usable field name. Use letters, digits and single underscores, starting with a letter.`);if(!eU.includes(t.type))throw Error(`instanceData: field "${i}" is "${t.type}". Use ${eU.join(", ")}.`);if(t.value?.length!==4)throw Error(`instanceData: field "${i}" needs a value of four numbers.`);r[i]=t.type}let i=(0,eE.E)(r),s=new Uint32Array(i.size/4),a=new Float32Array(s.buffer),o={};for(let t of i.elements){let r=t.offset/4,{type:i,value:n}=e[t.name],l="vec4<f32>"===i?a:s;o[t.name]=r;for(let e=0;e<4;e++)l[r+e]=n[e]}return{struct:r,offsets:o,stride:s.length,defaults:s,key:t.map(t=>`${t}:${e[t].type}`).join(",")}}(e),s=t+r;super({stride:i.stride,initialSize:s,indexKey:"_instanceStoreIndex",copier:e$}),this.layout=i,this.allocateBlock({_instanceStoreIndex:-1},s);let{defaults:a,stride:o}=i,n=this.u32Data;for(let e=t;e<s;e++)n.set(a,e*o)}},eH=r(81759),ej=r(12385),eW=class{geometry=null;shader=null;globalBindGroup=null;batchBindGroup=void 0;state=null;topology=null;batchKey=0;textureSetId=0;merged=!1;dead=!1;leftOut=!1;captures=[]},eK=class{resource;generation=0;tailOwners=0;geometries;constructor(e,t,r){this.resource=e,this.generation=t,this.geometries=r?[r]:null}};let eX=0;function eY(e){let t=e._resourceId,r=e.style?e.style._resourceId:-1,i=void 0!==e._capturedResourceId&&(e._capturedResourceId!==t||e._capturedStyleId!==r);return e._capturedResourceId=t,e._capturedStyleId=r,i}let eJ={geometry:null,shader:null,state:null,topology:"triangle-list",size:0,instanceCount:0,start:0,baseVertex:0,firstInstance:0},eQ=0;var eZ=class{commands=[];count=0;bodyCount=0;dirtyId=0;onCaptureLost;_captures=new Map;_destroyed=!1;captureTick=++eQ;_onCaptureResourceLost=e=>{let t=this._captures.get(e)?.geometries;if(t)for(let e of t)m.V23.prototype.unload.call(e);else eY(e),eX++;this.onCaptureLost?.()};next(){let e=this.count,t=this.commands[e]??=new eW;return t.dead=!1,t.leftOut=!1,this.count=e+1,t}captureGeometry(e){if(e._captureTick===this.captureTick)return;e._captureTick=this.captureTick;let t=e.buffers;for(let r=0;r<t.length;r++)this._capture(t[r],e)}captureMaterialTextures(e){if(e._captureTick===this.captureTick)return;e._captureTick=this.captureTick;let t=e._textures;for(let e=0;e<t.length;e++)B.X6.has(t[e])||this._capture(t[e].source,null);this.refreshMaterialBindings(e)}captureTail(e,t,r){let i=e.captures,s=t.buffers;for(let e=0;e<s.length;e++){let r=this._capture(s[e],t,!0);r&&i.push(r)}if(!r)return;let a=r._textures;for(let e=0;e<a.length;e++){if(B.X6.has(a[e]))continue;let t=this._capture(a[e].source,null,!0);t&&i.push(t)}this.refreshMaterialBindings(r)}releaseTail(e){let t=e.captures,r=e.geometry,i=!1;for(let t=this.bodyCount;t<this.count&&!i;t++){let s=this.commands[t];i=s!==e&&s.geometry===r&&s.captures.length>0}let s=i||r._captureTick===this.captureTick;for(let e=0;e<t.length;e++){let i=t[e];if(--i.tailOwners>0||i.generation===this.captureTick){if(!s&&i.geometries){let e=i.geometries.indexOf(r);e>=0&&i.geometries.splice(e,1)}continue}this._unwatch(i),this._captures.delete(i.resource)}t.length=0}refreshMaterialBindings(e){e._lastTextureDirtyId!==eX&&(e._lastTextureDirtyId=eX,e._refreshTextureBindings())}_capture(e,t,r=!1){if(e instanceof ej.c)return;let i=r?-1:this.captureTick,s=this._captures.get(e);return void 0===s?(s=new eK(e,i,t),this._captures.set(e,s),e.on("change",this._onCaptureResourceLost),null===t&&this._watchTexture(e)):(!r&&s.generation!==i&&(s.generation=i,s.geometries&&(s.geometries.length=0)),t&&s.geometries&&!s.geometries.includes(t)&&s.geometries.push(t)),r&&s.tailOwners++,s}_watchTexture(e){e.on("styleChange",this._onCaptureResourceLost),eY(e)&&eX++}_unwatch(e){let t=e.resource;t.off("change",this._onCaptureResourceLost),null===e.geometries&&t.off("styleChange",this._onCaptureResourceLost)}_dropCaptures(){for(let e of this._captures.values())this._unwatch(e);this._captures.clear()}clear(){for(let e=this.bodyCount;e<this.count;e++){let t=this.commands[e].captures;for(let e=0;e<t.length;e++)t[e].tailOwners=0;t.length=0}this.captureTick=++eQ,this.count=0,this.bodyCount=0,this.dirtyId++}endBuild(){this.bodyCount=this.count;let e=this.captureTick;for(let t of this._captures.values())t.generation!==e&&(this._unwatch(t),this._captures.delete(t.resource))}touch(e){for(let t of this._captures.keys())t._gcLastUsed=e}releaseCaptures(){this.clear(),this._dropCaptures()}replayDirect(e,t,r){let i=t.drawCalls,{bindGroup:s}=r;for(let t=0;t<this.count;t++){let r=5*t,a=i[r+1];if(0===a||0===i[r])continue;let o=this.commands[t];o.shader.groups[0]=o.globalBindGroup,o.shader.groups[1]=s,o.batchBindGroup&&(o.shader.groups[2]=o.batchBindGroup),eJ.geometry=o.geometry,eJ.shader=o.shader,eJ.state=o.state,eJ.topology=o.topology,eJ.size=i[r],eJ.instanceCount=a,eJ.start=i[r+2],eJ.baseVertex=i[r+3],eJ.firstInstance=i[r+4],e.draw(eJ)}eJ.geometry=null,eJ.shader=null,eJ.state=null}replay(e,t,r,i,s=0,a=this.count){let o=t.getGPUBuffer(r.drawCallsBuffer),{bindGroup:n}=i;for(let t=s;t<a;t++){let r=this.commands[t];if(r.dead){r.leftOut=!0;continue}r.shader.groups[0]=r.globalBindGroup,r.shader.groups[1]=n,r.batchBindGroup&&(r.shader.groups[2]=r.batchBindGroup),e.drawIndirect({geometry:r.geometry,shader:r.shader,state:r.state,topology:r.topology,indirectBuffer:o,indirectOffset:20*t})}}destroy(){this._destroyed||(this._destroyed=!0,this._dropCaptures(),this.onCaptureLost=void 0,this.count=0,this.commands=null)}},e0=class{items;count=0;dirty=!0;orderDirtyId=0;indices;renderableIndices;_sortKeys;_localIndices;_uidToLocal=new Map;_sortedCount=-1;_sortedKeys;_mergeIndices;_mergeKeys;_changes=new Uint8Array(0);_hasChanges=!1;_pending=[];_pendingCount=0;_orderForced=!1;_insertionSkip=0;_insertionBackoff=0;constructor(e,t=32){this.items=e,this.renderableIndices=new Uint32Array(t),this._sortKeys=new Float64Array(t),this._localIndices=new Uint32Array(t),this.indices=new Uint32Array(t),this._sortedKeys=new Float64Array(t),this._mergeIndices=new Uint32Array(t),this._mergeKeys=new Float64Array(t)}get orderForced(){return this._orderForced}indexOf(e){let t=this._uidToLocal.get(e);return void 0===t?-1:this.renderableIndices[t]}add(e,t,r){let i=this.count++;i>=this.renderableIndices.length&&this._grow(Math.max(2*this.renderableIndices.length,256)),this.renderableIndices[i]=t,this._sortKeys[i]=r,this._uidToLocal.set(e,i),this.dirty=!0,this._sortedCount>=0&&this._markPending(e,t)}remove(e){let t=this._uidToLocal.get(e);if(void 0===t)return;let r=this.renderableIndices[t],i=--this.count;if(t!==i){let e=this.renderableIndices[i],r=this._sortKeys[i],s=this._getUidAtLocal(i);this.renderableIndices[t]=e,this._sortKeys[t]=r,this._uidToLocal.set(s,t)}this._uidToLocal.delete(e),this.dirty=!0,this._sortedCount>=0&&(this._setChange(r,1),this._changes[r]&=-3)}updateKey(e,t){let r=this._uidToLocal.get(e);if(void 0!==r&&this._sortKeys[r]!==t&&(this._sortKeys[r]=t,this.dirty=!0,this._sortedCount>=0)){let t=this.renderableIndices[r];this._setChange(t,1),this._markPending(e,t)}}sort(){let e=this.count;0===e?this._resetOrder(0):this.dirty&&((this._sortedCount<0||this._orderForced||this._pendingCount>e>>1||!this._patchOrder())&&this._sortFull(),this.orderDirtyId++,this._orderForced=!1,this.dirty=!1)}sortForced(e){let t=this.count;if(0===t){this._resetOrder(0),this.orderDirtyId++;return}let r=!1;if(this._orderForced&&this._sortedCount===t&&!this._hasChanges&&(this._insertionSkip>0?this._insertionSkip--:r=this._insertionSort(e)),!r){let r=this.items,i=this._sortKeys,s=this.renderableIndices;for(let a=0;a<t;a++)i[a]=e(r[s[a]]);this._sortFull()}this._orderForced=!0,this.dirty=!1}clear(){this.orderDirtyId++,this.count=0,this._uidToLocal.clear(),this.dirty=!0,this._resetOrder(-1),this._orderForced=!1,this._insertionSkip=0,this._insertionBackoff=0}_sortFull(){let e=this.count,t=this._sortKeys,r=this._localIndices,i=this.renderableIndices,s=this.indices,a=this._sortedKeys;for(let t=0;t<e;t++)r[t]=t;r.subarray(0,e).sort((e,r)=>t[e]-t[r]);for(let o=0;o<e;o++){let e=r[o];s[o]=i[e],a[o]=t[e]}this.orderDirtyId++,this._resetOrder(e)}_insertionSort(e){let t=this.count,r=this.items,i=this.indices,s=this._sortedKeys;for(let a=0;a<t;a++)s[a]=e(r[i[a]]);let a=32*t,o=0;for(let e=1;e<t;e++){let t=s[e];if(s[e-1]<=t)continue;let r=i[e],n=e-1;do s[n+1]=s[n],i[n+1]=i[n],n--;while(n>=0&&s[n]>t)if(s[n+1]=t,i[n+1]=r,(o+=e-1-n)>a)return this._insertionBackoff=Math.min(64,Math.max(1,2*this._insertionBackoff)),this._insertionSkip=this._insertionBackoff,!1}return this._insertionBackoff=0,o>0&&this.orderDirtyId++,!0}_patchOrder(){let e=this.count,t=this._sortKeys,r=this.renderableIndices;this._changes.length<this.items.length&&this._growChanges(this.items.length);let i=this._changes,s=this._localIndices,a=0;for(let e=0;e<this._pendingCount;e++){let t=this._uidToLocal.get(this._pending[e]);if(void 0===t)continue;let o=r[t];(2&i[o])!=0&&(i[o]&=-3,s[a++]=t)}a>1&&s.subarray(0,a).sort((e,r)=>t[e]-t[r]);let o=this.indices,n=this._sortedKeys,l=this._sortedCount,h=this._mergeIndices,u=this._mergeKeys,d=0,c=0,f=0;for(;;){for(;d<l&&(1&i[o[d]])!=0;)d++;if(d<l&&(c===a||n[d]<=t[s[c]]))h[f]=o[d],u[f++]=n[d++];else if(c<a){let e=s[c++];h[f]=r[e],u[f++]=t[e]}else break}return f===e&&(this.indices=h,this._mergeIndices=o,this._sortedKeys=u,this._mergeKeys=n,this._resetOrder(e),!0)}_markPending(e,t){this._setChange(t,2)&&(this._pending[this._pendingCount++]=e,this._pendingCount>this.renderableIndices.length&&this._resetOrder(-1))}_setChange(e,t){e>=this._changes.length&&this._growChanges(e+1);let r=this._changes,i=r[e];return(i&t)==0&&(r[e]=i|t,this._hasChanges=!0,!0)}_growChanges(e){let t=new Uint8Array(Math.max(e,2*this._changes.length,256));t.set(this._changes),this._changes=t}_resetOrder(e){this._hasChanges&&(this._changes.fill(0),this._hasChanges=!1,this._pendingCount=0),this._sortedCount=e}_getUidAtLocal(e){let t=this.renderableIndices[e];return this.items[t].uid}_grow(e){let t=this.renderableIndices,r=this._sortKeys;this.renderableIndices=new Uint32Array(e),this._sortKeys=new Float64Array(e),this._localIndices=new Uint32Array(e),this.indices=new Uint32Array(e),this._sortedKeys=new Float64Array(e),this._mergeIndices=new Uint32Array(e),this._mergeKeys=new Float64Array(e),this.renderableIndices.set(t),this._sortKeys.set(r),this._resetOrder(-1)}},e1=r(45743),e3=r(37821);let e2=new Uint32Array(0),e4=new Uint32Array(0);function e5(e,t){let r=Math.imul(e>>>0,0x9e3779b1)^Math.imul(e/0x100000000>>>0,0x85ebca6b)^Math.imul(t,0xc2b2ae35);return r^r>>>15}var e6=class{view;drawDirtyId=0;lastDrawDirtyId=-1;lastOrderDirtyId=-1;rangesDirtyId=0;bit=0;commandList=new eZ;drawData=new e1.e;gpuData;glData;_rowCommand=new Int32Array(0);_memberCounts=new Uint32Array(0);_left=new Uint8Array(0);_deadCount=0;_recordCount=0;_joining=new Uint32Array(64);_joiningCount=0;_firstEdited=1/0;_readDirtyId=-1;_alwaysRebuilt=!1;_kinds=new Int32Array(0);_kindsUsed=-1;_edited=!1;_quietFrames=0;_lastQuietTick=-1;_destroyed=!1;constructor(e){this.view=new e0(e.items,e.initialCapacity),this.bit=e.bit,this.glData={indexTexture:null,indexStaging:null,lastVisibilityDirtyId:-1},this.gpuData={instanceBuffer:new e3.k(e.label),bundleDirtyId:0},this.commandList.onCaptureLost=()=>{this.drawDirtyId++}}get records(){return this.glData.indexStaging??this.gpuData.instanceBuffer.data}isDrawStale(){return this.drawDirtyId!==this.lastDrawDirtyId||this._edited}nextBuild(e,t=!1){if(this._alwaysRebuilt=t,!t&&!this.isDrawStale()){let t=this.commandList;if(t.count===t.bodyCount||e===this._lastQuietTick||(this._lastQuietTick=e,++this._quietFrames<60))return!1;this.drawDirtyId++}return this._quietFrames=0,this._edited=!1,this.view.sort(),!0}isOrderStale(){return this.view.orderDirtyId!==this.lastOrderDirtyId}claimDrawBuilt(){this.lastDrawDirtyId=this.drawDirtyId,this.lastOrderDirtyId=this.view.orderDirtyId}claimDrawEmpty(){this.lastDrawDirtyId=this.drawDirtyId}add(e,t){let r=this._editable();this.view.add(e.uid,t,e._sortKey),r&&this._queueJoin(t),this._edited=!0}remove(e){this._editable()&&this._dropFromCommand(e._storeIndex),this.view.remove(e.uid),this._edited=!0}move(e){this._editable()&&this._dropFromCommand(e._storeIndex)&&this._queueJoin(this.view.indexOf(e.uid)),this._edited=!0}applyEdits(){this._edited&&(this._edited=!1,!(this.lastDrawDirtyId<0)&&(!this._editable()||!this._repack())&&(this._joiningCount=0,this.drawDirtyId++))}_editable(){let e=this.commandList;return this.drawDirtyId===this.lastDrawDirtyId&&0!==e.count&&!this._alwaysRebuilt&&!this.view.orderForced&&(this._readDirtyId!==e.dirtyId&&this._readBuild(),!0)}_readBuild(){let e=this.commandList,t=e.count,r=this.drawData.drawCalls,i=this.records,s=this.view.count,a=t+64;this._memberCounts.length<a&&(this._memberCounts=new Uint32Array(2*a),this._left=new Uint8Array(2*a));let o=this._memberCounts;this._left.fill(0);let n=this._rowCommand.fill(-1);for(let e=0;e<t;e++){let a=r[5*e+4],l=e+1<t?r[(e+1)*5+4]:s;o[e]=l-a;for(let t=a;t<l;t++){let r=i[t];r>=n.length&&(n=this._growRows(r+1)),n[r]=e}}this._recordCount=s,this._deadCount=0,this._joiningCount=0,this._firstEdited=1/0,this._kindsUsed=-1,this._readDirtyId=e.dirtyId}_growRows(e){let t=new Int32Array(Math.max(e,Math.min(2*this._rowCommand.length,this.view.items.length+1),256)).fill(-1);return t.set(this._rowCommand),this._rowCommand=t}_queueJoin(e){if(this._joiningCount===this._joining.length){if(this._joiningCount>=this.view.items.length){this._joiningCount=0,this.drawDirtyId++;return}let e=new Uint32Array(2*this._joining.length);e.set(this._joining),this._joining=e}this._joining[this._joiningCount++]=e}_dropFromCommand(e){let t=this._rowCommand;if(e<0||e>=t.length)return!1;let r=t[e];if(r<0)return!1;if(t[e]=-1,this._left[r]=1,r<this._firstEdited&&(this._firstEdited=r),--this._memberCounts[r]>0)return!0;let i=this.commandList;return r>=i.bodyCount?i.releaseTail(i.commands[r]):2*++this._deadCount>i.bodyCount&&this.drawDirtyId++,!0}_repack(){let e=this.view,t=e.items,r=this.bit,i=this._joining,s=this._rowCommand,a=this._firstEdited,o=0;for(let e=0;e<this._joiningCount;e++){let n=t[i[e]];if(!n||(n._lastRenderPass&r)==0)continue;let l=n._storeIndex;if(l>=s.length&&(s=this._growRows(l+1)),-1!==s[l])continue;let h=n._passCache[r];if(!h)return!1;let u=this._find(n,h);if(u<0&&(u=this._record(n,h))<0)return!1;0==this._memberCounts[u]++&&u<this.commandList.bodyCount&&this._deadCount--,s[l]=-2-u,i[o++]=l,u<a&&(a=u)}this._joiningCount=0,this._firstEdited=1/0;let n=this.commandList,l=n.bodyCount,h=this._memberCounts,u=n.count;for(;n.count>l&&0===h[n.count-1];)n.count--;let d=n.count;if(a===1/0)return!0;a>d&&(a=d);let c=e.count;e2.length<c&&(e2=new Uint32Array(Math.ceil(1.5*c))),e4.length<d&&(e4=new Uint32Array(2*d));let f=e2,p=e4,m=this.records,_=this._recordCount,g=n.commands,x=this.drawData.drawCalls,y=this._left,v=x[5*a+4],b=v,w=!1;for(let e=a;e<d;e++){let t=g[e],r=h[e],i=x[5*e+4],a=e+1<u?x[(e+1)*5+4]:_;if(x[5*e+4]=b,x[5*e+1]=r,0===y[e])for(let e=i;e<a;e++)f[b++]=m[e];else{y[e]=0;for(let e=i;e<a;e++){let t=m[e];s[t]>=0&&(f[b++]=t)}}p[e]=b,b=x[5*e+4]+r,t.leftOut&&r>0&&e<l&&(w=!0,t.leftOut=!1),t.dead=0===r}if(b!==c)return!1;for(let e=0;e<o;e++){let t=i[e],r=-2-s[t];s[t]=r,f[p[r]++]=t}let T=f.subarray(v,c),C=this.glData;if(C.indexStaging){let e=C.indexTexture;e.ensureCapacity(c),m.length<e.data.length&&(C.indexStaging=new Uint32Array(e.data.length),C.indexStaging.set(m.subarray(0,v))),C.indexStaging.set(T,v),C.lastVisibilityDirtyId=-1}else{if(c>v){let e=this.gpuData.instanceBuffer,t=e.ensureSize(c);t!==m&&t.set(m.subarray(0,v)),t.set(T,v),e.upload(c,t!==m?0:v)}w&&this.gpuData.bundleDirtyId++}return this._recordCount=c,this.rangesDirtyId++,!0}_find(e,t){this._kindsUsed<0&&this._indexKinds();let r=this._kinds,i=r.length-1,s=this.commandList.commands[0].batchBindGroup?e.material._textureSetId:0;for(let a=e5(t.batchKey,s)&i;;a=a+1&i){let i=r[a];if(0===i)return -1;if(this._fits(i-1,e,t))return i-1}}_indexKinds(){let e=this.commandList.count,t=256;for(;t<(e+64)*2;)t*=2;this._kinds.length===t?this._kinds.fill(0):this._kinds=new Int32Array(t),this._kindsUsed=0;for(let t=0;t<e;t++)this._indexKind(t)}_indexKind(e){let t=this._kinds,r=t.length-1,i=this.commandList.commands[e],s=e5(i.batchKey,i.textureSetId)&r;for(;0!==t[s];)s=s+1&r;t[s]=e+1,2*++this._kindsUsed>t.length&&(this._kindsUsed=-1)}_fits(e,t,r){let i=this.commandList,s=i.commands[e];if(r.batchKey!==s.batchKey||e>=i.bodyCount&&0===this._memberCounts[e])return!1;let a=t.geometry._geometryAtlasAllocation;if(s.geometry!==(a?a.atlas.geometry:t.geometry))return!1;if(a){let t=this.drawData.drawCalls;if(t[5*e]!==a.indexCount||t[5*e+2]!==a.firstIndex)return!1}let o=s.batchBindGroup;return!o||(s.merged?s.textureSetId===t.material._textureSetId:o===t.material._getBindGroup())}_record(e,t){let r=this.commandList,i=r.commands,s=r.bodyCount;for(;s<r.count&&this._memberCounts[s]>0;)s++;if(s===r.count){if(s-r.bodyCount==64)return -1;r.next(),this._memberCounts[s]=0,this.drawData.ensureCapacity(s+1)[5*s+4]=this._recordCount}let a=null!==this.glData.indexStaging,o=void 0!==i[0].batchBindGroup,n=e.material,l=e.geometry._geometryAtlasAllocation,h=l?l.atlas.geometry:e.geometry,u=i[s];r.captureTail(u,h,o?n:null),u.geometry=h,u.shader=t.shader,u.globalBindGroup=i[0].globalBindGroup,u.batchBindGroup=o?a?n._getMergedBindGroup():n._getBindGroup():void 0,u.state=(0,eH.Q)(t.batchKey,t.state),u.topology=t.topology,u.batchKey=t.batchKey,u.textureSetId=o?n._textureSetId:0,u.merged=o&&a,u.dead=!1,u.leftOut=!1;let d=this.drawData.drawCalls;return d[5*s]=l?l.indexCount:h.indexCount||h.indexBuffer.data.length,d[5*s+2]=l?l.firstIndex:0,d[5*s+3]=l&&!a?l.baseVertex:0,this._kindsUsed>=0&&this._indexKind(s),this._quietFrames=0,s}unload(){this._destroyed||(this.commandList.releaseCaptures(),this.drawDirtyId++,this.gpuData.bundleDirtyId++,this.gpuData.instanceBuffer.unload(),this.glData.indexTexture?.unload())}destroy(){this._destroyed||(this._destroyed=!0,this.gpuData.instanceBuffer.destroy(),this.glData.indexTexture?.destroy(),this.glData.indexTexture=null,this.glData.indexStaging=null,this.view=null,this.commandList.destroy(),this.drawData.destroy())}};let e8=new Float32Array(4);var e9=class{uid=0;_sortKey=0;_storeIndex=0;_batchDirty=!0;_lastRenderPass=0;_lastDescriptorDirtyId=-1;skeleton=void 0;_passCache={};geometry;material;receiveShadow=!0;billboardMode="none";_worldVisible=1;_batch;_boundingSphere=null;constructor(e,t,r){this.uid=e,this._storeIndex=t,this._batch=r}get boundingSphere(){let e=this._boundingSphere||=new c.i,t=this._batch.storeBuffer,r=t.boundingSpheres,i=4*this._storeIndex;if(!t.writesSpheres||null===r){let s=this.geometry;if(void 0===s)return e.makeEmpty();i=0,eL(r=e8,0,t.data,24*this._storeIndex,s,0)}return e.center.set(r[i],r[i+1],r[i+2]),e.radius=r[i+3],e}destroy(){this._batch=null}};let e7=0,te=new e_.k,tt={worldTransform:te,_worldVisible:1};var tr=class{uid=++e7;items;storeBuffer;drawLists=Object.create(null);instanceStoreBuffer=null;_batchWorldMatrixIndex=0;renderData;isUserBatch;_dirtyIndices=null;_dirtyCount=0;_editsPending=!1;destroyed=!1;_visibilityDirtyId=0;_cull="off";_lastStoreBufferVersion=0;_baseIndex=0;_matrices=null;_instanceData=null;constructor(e){if(this.renderData=e.renderData??tt,this.storeBuffer=new eO,this._batchWorldMatrixIndex=this.storeBuffer.allocateBlock({_storeIndex:-1},1),void 0!==e.items)this.items=e.items,this._baseIndex=0,this.isUserBatch=!1;else{let t=e.size;this._baseIndex=this.storeBuffer.allocateBlock({_storeIndex:-1},t);let r=[],i=new Uint32Array(t);for(let e=0;e<t;e++)r.push(new e9(e,this._baseIndex+e,this)),i[e]=e;this.storeBuffer.writeVisibilityRange(this._baseIndex,t,1),this.items=r,this._dirtyIndices=i,this._dirtyCount=t,this.isUserBatch=!0,e.instanceData&&(this.instanceStoreBuffer=new eq(e.instanceData,this._baseIndex,t))}this.writeBatchWorldMatrix(te)}writeBatchWorldMatrix(e){let t=this._batchWorldMatrixIndex,r=this.storeBuffer.fl64Data,i=e.elements64,s=12*t;r[s]=i[0],r[s+1]=i[1],r[s+2]=i[2],r[s+3]=i[3],r[s+4]=i[4],r[s+5]=i[5],r[s+6]=i[6],r[s+7]=i[7],this.storeBuffer.markDirty(t)}setMatrixAt(e,t){let r=this._baseIndex+e,i=this.storeBuffer.fl64Data,s=t.elements64,a=12*r;i[a]=s[0],i[a+1]=s[1],i[a+2]=s[2],i[a+3]=s[3],i[a+4]=s[4],i[a+5]=s[5],i[a+6]=s[6],i[a+7]=s[7],this.storeBuffer.markDirty(r),this._writeSlotSphere(e)}_writeSlotSphere(e){let t=this.storeBuffer;if(!t.writesSpheres)return;let r=this.items[e].geometry;if(void 0===r)return;let i=this._baseIndex+e;t.writeBoundingSphere(i,t.data,24*i,r,0)}get matrices(){return this._matrices??=new eN(this,this._baseIndex)}get instanceData(){if(this._instanceData)return this._instanceData;let e=this.instanceStoreBuffer;if(!e)throw Error("instanceData: this batch has no instance data. Declare the fields in the instanceData option.");return this._instanceData=new eR(e,this._baseIndex,this.items.length)}setInstanceDataAt(e,t,r,i,s,a){let o=this.instanceStoreBuffer,n=o?.layout.offsets[t];if(!o||void 0===n){let e=o?`It declares: ${Object.keys(o.layout.offsets).join(", ")}.`:"It declares none.";throw Error(`setInstanceDataAt: this batch has no instanceData field "${t}". ${e}`)}let{layout:l}=o,h=this._baseIndex+e,u=h*l.stride+n,d="vec4<f32>"===l.struct[t]?o.data:o.u32Data;d[u]=r,d[u+1]=i,d[u+2]=s,d[u+3]=a,o.markDirty(h)}setGeometryAt(e,t){let r=this.items[e];r.geometry=t,this._writeSlotSphere(e),r._batchDirty||(r._batchDirty=!0,this._dirtyIndices[this._dirtyCount++]=e)}setMaterialAt(e,t){let r=this.items[e];if(r.material=t,r._lastDescriptorDirtyId=-1,r._batchDirty||(r._batchDirty=!0,this._dirtyIndices[this._dirtyCount++]=e),-1!==t._materialIndex){let r=this._baseIndex+e;this.storeBuffer.u32Data[24*r+17]=t._materialIndex,this.storeBuffer.markDirty(r)}}invalidate(e){let t=this.items[e];!t._batchDirty&&(t._batchDirty=!0,this._dirtyIndices&&(this._dirtyIndices[this._dirtyCount++]=e))}setVisibleAt(e,t){let r=this.items[e],i=+!!t;r._worldVisible!==i&&(r._worldVisible=i,this.storeBuffer.writeVisibility(this._baseIndex+e,i),this._visibilityDirtyId++)}getVisibleAt(e){return 1===this.items[e]._worldVisible}setPassesAt(e,t){let r=this.items[e],i=r._lastRenderPass,s=t&~i,a=i&~t,o=a;for(;o;){let e=o&-o,t=this.drawLists[e];t.remove(r),0===t.view.count&&(t.drawDirtyId++,t.commandList.releaseCaptures()),o^=e}for(o=s;o;){let t=o&-o,i=this.drawLists[t];i||(i=this.drawLists[t]=new e6({items:this.items,label:`pass_${t}`,bit:t})),i.add(r,e),o^=t}r._lastRenderPass=t,s|a&&(this._editsPending=!0),s&&!r._batchDirty&&(r._batchDirty=!0,this._dirtyIndices&&(this._dirtyIndices[this._dirtyCount++]=e))}get cull(){return this._cull}set cull(e){e!==this._cull&&(this._cull=e,this._visibilityDirtyId++,this.storeBuffer.writesSpheres&&this.storeBuffer.enableSphereWrites(!1))}_ensureSpheres(){let e=this.storeBuffer;e.writesSpheres||(e.enableSphereWrites(!0),this._sweepSpheres())}_sweepSpheres(){if(this.destroyed)return;let e=this.storeBuffer,t=e.data,r=this.items;for(let i=0;i<r.length;i++){let s=r[i];if(null===s)continue;let a=s._storeIndex,o=s.geometry;a<0||void 0===o||e.writeBoundingSphere(a,t,24*a,o,s._morph?o._morphBoundsExpansion:0)}}applyEdits(){if(this._editsPending)for(let e in this._editsPending=!1,this.drawLists)this.drawLists[e].applyEdits()}invalidateDrawCaches(){for(let e in this.drawLists)this.drawLists[e].drawDirtyId++}invalidateBundleCaches(){for(let e in this.drawLists)this.drawLists[e].gpuData.bundleDirtyId++}unload(){if(!this.destroyed)for(let e in this.storeBuffer.unload(),this.instanceStoreBuffer?.unload(),this.drawLists)this.drawLists[e].unload()}destroy(){if(!this.destroyed){for(let e in this.destroyed=!0,this.storeBuffer.destroy(),this.instanceStoreBuffer?.destroy(),this.instanceStoreBuffer=null,this.drawLists)this.drawLists[e].destroy();if(this.drawLists=null,this.isUserBatch)for(let e of this.items)e.destroy();this._dirtyIndices=null,this._matrices?.destroy(),this._matrices=null,this._instanceData?.destroy(),this._instanceData=null}}},ti=class extends d.B{batch;constructor(e){let{size:t,parent:r,cull:i,instanceData:s,...a}=(0,m.S6_)(e);super({label:"BatchedMesh3D",...a}),this.batch=new tr({size:t,renderData:this,instanceData:s}),this.batch.cull=i??"off",r?.addChild(this)}get items(){return this.batch.items}get cull(){return this.batch.cull}set cull(e){this.batch.cull=e}get size(){return this.batch.items.length}setMatrixAt(e,t){this.batch.setMatrixAt(e,t)}get matrices(){return this.batch.matrices}setInstanceDataAt(e,t,r,i,s,a){this.batch.setInstanceDataAt(e,t,r,i,s,a)}get instanceData(){return this.batch.instanceData}setGeometryAt(e,t){this.batch.setGeometryAt(e,t)}setMaterialAt(e,t){this.batch.setMaterialAt(e,t)}setVisibleAt(e,t){this.batch.setVisibleAt(e,t)}getVisibleAt(e){return this.batch.getVisibleAt(e)}setPassesAt(e,t){this.batch.setPassesAt(e,t)}invalidate(e){this.batch.invalidate(e)}unload(){if(this.destroyed)return;super.unload();let e=new Set,t=this.batch.items;for(let r=0;r<t.length;r++){let i=t[r].geometry;i&&(e.has(i)||(e.add(i),i.unload()),this.batch.invalidate(r))}this.batch.unload()}destroy(e){if(this.destroyed)return;super.destroy(e);let t=(0,g.M)(e,"geometry"),r=(0,g.M)(e,"material");if(t||r){let i=new Set,s=new Set;for(let a of this.batch.items)t&&a.geometry&&!i.has(a.geometry)&&(i.add(a.geometry),a.geometry.destroy(!0)),r&&a.material&&!s.has(a.material)&&(s.add(a.material),a.material.destroy(e))}this.batch.destroy()}},ts=r(97416),ta=class e extends d.B{static defaultOptions={mode:"perspective",fov:60,zoom:1,near:.1,far:1e3,orthographicSize:5,clippingPlane:null,renderTexture:null};projection=new e_.k;view=new e_.k;viewProjection=new e_.k;frustum=new ts.P;cullFrustum=this.frustum;mode;fov=0;zoom=0;near=0;far=0;orthographicSize=0;clippingPlane;renderTexture;_cameraData=null;viewport=new m.M_G(0,0,1,1);jitter=new m.bRX;_lookAtForwardIsPositiveZ=!1;constructor(t={}){let{mode:r,fov:i,zoom:s,near:a,far:o,orthographicSize:n,clippingPlane:l,renderTexture:h,...u}={...e.defaultOptions,...(0,m.S6_)(t)};super({label:"Camera3D",...u}),this.mode=r,this.fov=i,this.zoom=s,this.near=a,this.far=o,this.orthographicSize=n,this.clippingPlane=l??null,this.renderTexture=h??null}usePerspective(t=e.defaultOptions.fov,r=e.defaultOptions.near,i=e.defaultOptions.far){this.mode="perspective",this.fov=t,this.near=r,this.far=i}useOrthographic(t=e.defaultOptions.orthographicSize,r=e.defaultOptions.near,i=e.defaultOptions.far){this.mode="orthographic",this.orthographicSize=t,this.near=r,this.far=i}resetHistory(){this._cameraData&&(this._cameraData._hasHistory=!1)}destroy(e){this.destroyed||(this._cameraData?.destroy(),this._cameraData=null,super.destroy(e))}computeProjection(e,t){if("perspective"===this.mode)t.makePerspective(2*Math.atan(this._tanHalfFovY()),e,this.near,this.far);else{let r=this.orthographicSize/this.zoom;t.makeOrthographic(-r,r,r/e,-r/e,this.near,this.far)}return t}_tanHalfFovY(){return Math.tan(this.fov*m.Tde/2)/this.zoom}},to=class e extends ep{static defaultOptions={color:0xffffff,intensity:1,range:0,radius:.1};type="point";range=0;radius=.1;constructor(t={}){let{range:r,radius:i,...s}={...e.defaultOptions,...(0,m.S6_)(t)};super({label:"PointLight",...s}),this.range=r,this.radius=i,this.castShadow&&(0,m.R8M)("PointLight does not cast shadows; `castShadow` has no effect.")}get canCastShadow(){return!1}},tn=class e extends ep{static defaultOptions={color:0xffffff,intensity:1,castShadow:!1,range:0,radius:.1,coneAngle:60,penumbra:0};type="spot";range=0;radius=.1;coneAngle=0;penumbra=0;constructor(t={}){let{range:r,radius:i,coneAngle:s,penumbra:a,...o}={...e.defaultOptions,...(0,m.S6_)(t)};super({label:"SpotLight",...o}),this.range=r,this.radius=i,this.coneAngle=s,this.penumbra=a}};let tl=new e_.k,th=0;var tu=class e{static defaultOptions={};nodeCount=0;jointCount=0;parent;joints;inverseBindMatrices;localPosition;localRotation;localScale;worldMatrix;dirty=!0;_bonePitIndex=-1;_bonePitTick=-1;_worldId=++th;_destroyed=!1;_labelToIndex;_bindShapeInverse;_nodeWorldMatrix;_containerBones=[];constructor(t){let{parent:r,joints:i,inverseBindMatrices:s,labels:a,bindShapeMatrix:o}=t={...e.defaultOptions,...(0,m.S6_)(t)};this.nodeCount=r.length,this.jointCount=i.length,this.parent=r,this.joints=i,this.inverseBindMatrices=s,this.localPosition=new Float32Array(3*this.nodeCount),this.localRotation=new Float32Array(4*this.nodeCount),this.localScale=new Float32Array(3*this.nodeCount),this._nodeWorldMatrix=new Float32Array(16*this.nodeCount),this.worldMatrix=new Float32Array(12*this.jointCount);for(let e=0;e<this.nodeCount;e++){this.localRotation[4*e+3]=1,this.localScale[3*e+0]=1,this.localScale[3*e+1]=1,this.localScale[3*e+2]=1;let t=16*e;this._nodeWorldMatrix[t+0]=1,this._nodeWorldMatrix[t+5]=1,this._nodeWorldMatrix[t+10]=1,this._nodeWorldMatrix[t+15]=1}if(a){this._labelToIndex=Object.create(null);for(let e=0;e<a.length;e++)this._labelToIndex[a[e]]=e}o&&(tl.fromArray(o).getInverse(tl,!0),this._bindShapeInverse=new Float32Array(tl.elements))}indexOf(e){let t=this._labelToIndex[e];if(void 0===t)throw Error(`Unknown bone label: ${e}`);return t}setLocalTRS(e,t,r,i,s,a,o,n,l=1,h=1,u=1){let d=3*e;this.localPosition[d+0]=t,this.localPosition[d+1]=r,this.localPosition[d+2]=i;let c=4*e;this.localRotation[c+0]=s,this.localRotation[c+1]=a,this.localRotation[c+2]=o,this.localRotation[c+3]=n;let f=3*e;this.localScale[f+0]=l,this.localScale[f+1]=h,this.localScale[f+2]=u,this.dirty=!0}updateWorld(){if(0!==this._containerBones.length&&this._syncContainerBones(),this.dirty){for(let e=0;e<this.nodeCount;e++){let t=this.parent[e];this._writeTRSToMat4(e,this._nodeWorldMatrix),t>=0?e_.k.multiplyAffine(this._nodeWorldMatrix,16*e,this._nodeWorldMatrix,16*t,this._nodeWorldMatrix,16*e):void 0!==this._bindShapeInverse&&e_.k.multiplyAffine(this._nodeWorldMatrix,16*e,this._bindShapeInverse,0,this._nodeWorldMatrix,16*e)}for(let e=0;e<this.jointCount;e++){let t=this.joints[e];e_.k.multiplyAffineTo3x4(this.worldMatrix,12*e,this._nodeWorldMatrix,16*t,this.inverseBindMatrices,16*e)}this._worldId=++th,this.dirty=!1}}bindContainerBone(e,t){this._containerBones.push({boneIndex:e,src:t})}_syncContainerBones(){let e=this._containerBones;for(let t=0;t<e.length;t++){let{boneIndex:r,src:i}=e[t];i._localTransformDirty&&(i.updateLocalTransform(),i._localTransformDirty=!1);let s=i.localTransform.elements,a=i.quaternion,o=i.scale,n=3*r,l=4*r,h=this.localPosition,u=this.localRotation,d=this.localScale;(h[n]!==s[12]||h[n+1]!==s[13]||h[n+2]!==s[14]||u[l]!==Math.fround(a.x)||u[l+1]!==Math.fround(a.y)||u[l+2]!==Math.fround(a.z)||u[l+3]!==Math.fround(a.w)||d[n]!==Math.fround(o.x)||d[n+1]!==Math.fround(o.y)||d[n+2]!==Math.fround(o.z))&&(h[n]=s[12],h[n+1]=s[13],h[n+2]=s[14],u[l]=a.x,u[l+1]=a.y,u[l+2]=a.z,u[l+3]=a.w,d[n]=o.x,d[n+1]=o.y,d[n+2]=o.z,this.dirty=!0)}}destroy(){this._destroyed||(this._destroyed=!0,this._containerBones.length=0,this._bonePitIndex=-1,this._bonePitTick=-1)}_writeTRSToMat4(e,t){let r=3*e,i=4*e,s=3*e,a=16*e,o=this.localPosition[r+0],n=this.localPosition[r+1],l=this.localPosition[r+2],h=this.localRotation[i+0],u=this.localRotation[i+1],d=this.localRotation[i+2],c=this.localRotation[i+3],f=this.localScale[s+0],p=this.localScale[s+1],m=this.localScale[s+2],_=h+h,g=u+u,x=d+d,y=h*_,v=h*g,b=h*x,w=u*g,T=u*x,C=d*x,S=c*_,D=c*g,M=c*x;t[a+0]=(1-(w+C))*f,t[a+1]=(v+M)*f,t[a+2]=(b-D)*f,t[a+3]=0,t[a+4]=(v-M)*p,t[a+5]=(1-(y+C))*p,t[a+6]=(T+S)*p,t[a+7]=0,t[a+8]=(b+D)*m,t[a+9]=(T-S)*m,t[a+10]=(1-(y+w))*m,t[a+11]=0,t[a+12]=o,t[a+13]=n,t[a+14]=l,t[a+15]=1}};let td=new e_.k,tc=new el.P,tf=new eg.P,tp=new el.P;function tm(e,t){if("function"==typeof t){let r=new Map;return e.map(e=>{let i=r.get(e);return i||r.set(e,i=t(e)),i})}return Array.isArray(t)?e.map((e,r)=>t[r]??e):e.map(e=>void 0!==e.label&&t[e.label]||e)}var t_=class e extends d.B{static defaultOptions={castShadow:!0,receiveShadow:!0,autoUpdate:!0,autoPlay:!1};source;player;skeletons=[];cameras=[];_builtMeshes=[];_materials;constructor(t){t instanceof eF&&(t={source:t});let{source:r,scene:i,castShadow:s,receiveShadow:a,autoUpdate:o,autoPlay:n,hitVolume:l,width:h,height:u,depth:c,parent:f,materials:p,..._}={...e.defaultOptions,...(0,m.S6_)(t)};super({label:"Model3D",..._}),this.source=r,p&&(this._materials=tm(r.materials,p));let g=r._descriptor,x=this.skeletons,y={nodeMap:{},detachedSkinnedNodes:new Map,castShadow:s,receiveShadow:a},{nodeMap:v,detachedSkinnedNodes:b}=y;if(g.skins&&g.skins.forEach(e=>{let t=new tu({parent:e.skeletonParent,joints:e.skeletonJoints,inverseBindMatrices:e.inverseBindMatrices,labels:e.skeletonLabels,bindShapeMatrix:e.bindShapeMatrix});if(x.push(t),e.skeletonNodes)for(let r=0;r<e.skeletonNodes.length;r++){let i=e.skeletonNodes[r],s=g.nodes?.[i];if(s){let e=s.position,i=s.rotation,a=s.scale;t.setLocalTRS(r,e?.[0]??0,e?.[1]??0,e?.[2]??0,i?.[0]??0,i?.[1]??0,i?.[2]??0,i?.[3]??1,a?.[0]??1,a?.[1]??1,a?.[2]??1)}v[i]={skeleton:t,boneIndex:r}}}),g.scenes&&g.scenes.length>0){let e=g.scenes[g.defaultScene??0];i&&(e=r.scene[i]||e),e.children&&e.children.forEach(e=>{let t=this._createNode(e,y);t.length&&this.addChild(...t)})}else if(g.nodes&&g.nodes.length>0){let e=this._createNode(0,y);e.length&&this.addChild(...e)}for(let[e,t]of b){let r=v[t];(r instanceof d.B?r:this).addChild(v[e])}if(g.skins)for(let e=0;e<g.skins.length;e++){let t=x[e],r=g.skins[e].skeletonNodes;if(r)for(let e=0;e<r.length;e++){let i=r[e];if(b.has(i))continue;let s=v[i];s instanceof d.B&&t.bindContainerBone(e,s)}}Object.keys(r.animations).length&&(this.player=new eA({target:this,animations:r.animations,nodeMap:v,autoUpdate:o,autoPlay:n})),void 0!==l&&(this.hitVolume=l),void 0!==h&&(this.width=h),void 0!==u&&(this.height=u),void 0!==c&&(this.depth=c),f?.addChild(this)}_createMesh(e,t){let r,i=this.source.geometries[e.geometry];if(!i)return new d.B;let s=e.materials||[],a=void 0!==e.skin?this.skeletons[e.skin]:void 0,o=i[0]?.morphTargetCount??0;o>0&&(r=new Float32Array(o),e.weights&&e.weights.length===o&&r.set(e.weights));let n=(e,i)=>{let o=s[i],n=new D({geometry:e,material:this.materials[o],skeleton:a,castShadow:t.castShadow,receiveShadow:t.receiveShadow,weights:r});return this._builtMeshes.push({mesh:n,index:o}),n};if(1===i.length)return n(i[0],0);let l=new d.B;return i.forEach((e,t)=>l.addChild(n(e,t))),r&&(l.weights=r),l}_createLight(e){let t=this.source._descriptor.lights?.[e.light];if(!t)return new d.B;let{type:r,color:i,intensity:s,range:a,coneAngle:o,penumbra:n}=t;return 0===r?new em({color:i,intensity:s}):1===r?new to({color:i,intensity:s,range:a}):2===r?new tn({color:i,intensity:s,range:a,coneAngle:o,penumbra:n}):new d.B}_createCamera(e){let t=this.source._descriptor.cameras?.[e.camera];if(!t)return new d.B;let{mode:r,fov:i,near:s,far:a,orthographicSize:o}=t,n=new ta({mode:1===r?"orthographic":"perspective",fov:i,near:s,far:a,orthographicSize:o});return this.cameras.push(n),n}_createNode(e,t){let r,i=this.source._descriptor,s=i.nodes?.[e];if(!s)return[];let a=s.children?.flatMap(e=>this._createNode(e,t))??[];if(s.isJoint)return a;r=void 0!==s.geometry?this._createMesh(s,t):void 0!==s.light?this._createLight(s):void 0!==s.camera?this._createCamera(s):new d.B;let o=void 0!==s.skin?i.skins?.[s.skin]:void 0,n=void 0!==o&&void 0!==s.geometry;return(n?o.bindShapeMatrix&&(td.fromArray(o.bindShapeMatrix).decompose(tc,tf,tp),r.position.copyFrom(tc),r.quaternion.copyFrom(tf),r.scale.copyFrom(tp)):(s.position&&r.position.fromArray(s.position),s.scale&&r.scale.fromArray(s.scale),s.rotation&&r.quaternion.fromArray(s.rotation)),s.label&&(r.label=s.label),!1===s.visible&&(r.visible=!1),a.length&&r.addChild(...a),t.nodeMap[e]=r,n)?(t.detachedSkinnedNodes.set(e,o.parentNode??-1),[]):[r]}get materials(){return this._materials??this.source.materials}set materials(e){this._materials=e&&tm(this.source.materials,e);let t=this.materials;for(let{mesh:e,index:r}of this._builtMeshes){let i=e.parent;for(;i&&i!==this;)i=i.parent;i&&(e.material=t[r])}}static from(t,r){return new e({...r,source:t})}unload(){super.unload();let e=new Set;for(let t of(!function e(t,r){if(t instanceof D)r.add(t.material);else if(t instanceof ti){let e=t.batch.items;for(let t=0;t<e.length;t++)e[t].material&&r.add(e[t].material)}let i=t.children;for(let t=0;t<i.length;t++){let s=i[t];s instanceof t_||e(s,r)}}(this,e),e))t.unload()}destroy(e){if(!this.destroyed){for(let e of(this.player?.destroy(),this.player=void 0,this.skeletons))e.destroy();this.skeletons=null,this.cameras=null,this._builtMeshes=null,this._materials=void 0,super.destroy(e)}}},tg=r(67979);let tx={name:"flatMaterial",textures:["baseColor"],bindings:{material:{baseColor:"vec4<f32>",displayBaseColor:"vec4<f32>",alphaCutoff:"f32"}},gpu:{fragment:{material:`
  var baseColor = inputTint(material.baseColor, material.displayBaseColor);

  let baseTex = sampleBaseColor(input.vUV);
  baseColor *= vec4<f32>(decodeColor(baseTex.rgb / max(baseTex.a, 0.001)), baseTex.a);

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;
`}},gl:{fragment:{material:`
  vec4 baseColor = inputTint(material.baseColor, material.displayBaseColor);

  vec4 baseTex = sampleBaseColor(vUV);
  baseColor *= vec4(decodeColor(baseTex.rgb / max(baseTex.a, 0.001)), baseTex.a);

  albedo *= baseColor.rgb;
  alpha *= baseColor.a;
`}}};var ty=class extends T.AK{colorSpace="display";lit=!1;constructor(e={}){super(e),this._descriptor=new M.X({});let t=[tx,P,...this.extraBits];this._deriveLayoutFromBits(t,{baseColor:e.baseColorTexture,...e.textures})}getPrimaryDescriptor(e){if(!this._variantDirty)return this._descriptor;let t=[tx,P];for(let e=0;e<this.extraBits.length;e++)t.push(this.extraBits[e]);return"mask"===this._alphaMode&&t.push(I),this._descriptor.update({bitsGpu:t,bitsGl:t}),this._variantDirty=!1,this._descriptor}},tv=class e extends _{static defaultOptions={..._.defaultOptions,width:1,height:1,widthSegments:1,heightSegments:1,flipV:!1};static _spriteQuad=null;static get spriteQuad(){let t;return e._spriteQuad??=((t=new e({flipV:!0})).destroy=m.tEg,t)}constructor(t={}){let r={...e.defaultOptions,...t},{width:i,height:s,flipV:a}=r,o=eo(r.widthSegments,1),n=eo(r.heightSegments,1),l=(o+1)*(n+1),h=o*n*2,u=new Float32Array(3*l),d=new Float32Array(3*l),c=new Float32Array(2*l),f=l>65536?new Uint32Array(3*h):new Uint16Array(3*h),p=.5*i,m=.5*s,_=1/o,g=1/n,x=0,y=0,v=0;for(let e=0;e<=n;++e){let t=e*g;for(let e=0;e<=o;++e){let r=e*_;u[x++]=r*i-p,u[x++]=t*s-m,u[x++]=0,d[y++]=0,d[y++]=0,d[y++]=1,c[v++]=r,c[v++]=a?1-t:t}}let b=o+1,w=0;for(let e=0;e<n;++e){let t=(e+0)*b,r=(e+1)*b;for(let e=0;e<o;++e){let i=t+e,s=r+e;f[w++]=i,f[w++]=i+1,f[w++]=s,f[w++]=s,f[w++]=i+1,f[w++]=s+1}}super({...r,positions:u,normals:d,uvs:c,indices:f})}};function tb(){(0,tg.m)("pixijs-3d-sprite3d-size-unloaded","[@pixi/3d] A Sprite3D was sized in world units while its texture had no dimensions (still loading?). The write was dropped \u2014 size the sprite after the texture resolves, or set `scale` directly.")}var tw=class e extends D{static defaultOptions={billboardMode:"spherical",tint:0xffffff,alpha:1,alphaMode:"blend",alphaCutoff:.5,pixelSize:.01,castShadow:!1,receiveShadow:!0};static from(t,r=!1){return new e(t instanceof m.gPd?t:m.gPd.from(t,r)??m.gPd.EMPTY)}_texture;_pixelSize=0;_anchor;_ownsMaterial;_onTextureUpdate=()=>{this.material._deriveUvFrame(),this._onUpdate()};constructor(t={}){t instanceof m.gPd&&(t={texture:t});let r=(0,m.S6_)(t),{material:i,texture:s,tint:a,alpha:o,alphaMode:n,alphaCutoff:l,pixelSize:h,anchor:u,width:d,height:c,parent:f,castShadow:p,receiveShadow:_,billboardMode:g,...x}={...e.defaultOptions,...r};if(i&&void 0===i._slotByName.baseColor)throw Error("[Sprite3D] The supplied material has no `baseColor` texture slot, so the sprite has no image to size itself from. Use a material built from a baseColor-bearing bit (FlatMaterial, Material3D, PhongMaterial, ...).");super({label:"Sprite3D",...x,geometry:tv.spriteQuad,material:i??new ty({baseColorTexture:s??m.gPd.WHITE,baseColor:a,alpha:o,alphaMode:n,alphaCutoff:l,doubleSided:!0}),castShadow:p,receiveShadow:_,billboardMode:g}),this._ownsMaterial=void 0===i,this._pixelSize=h,this._texture=this.material.textures.baseColor??m.gPd.WHITE,this._texture.dynamic&&this._texture.on("update",this._onTextureUpdate),i&&(s&&(this.texture=s),void 0!==r.tint&&(this.tint=r.tint),void 0!==r.alpha&&(this.alpha=r.alpha),void 0!==r.alphaMode&&(this.alphaMode=r.alphaMode),void 0!==r.alphaCutoff&&(this.alphaCutoff=r.alphaCutoff)),this._anchor=new m.oA$({_onUpdate:()=>this._onUpdate()},.5,.5);let y=u??this._texture.defaultAnchor;void 0!==y&&(this.anchor=y),(void 0!==d||void 0!==c)&&this._fitSize(d,c),f?.addChild(this)}_fitSize(e,t){let{width:r,height:i}=this._texture.orig;0===r||0===i?tb():(this.width=e??t*r/i,this.height=t??e*i/r)}get texture(){return this._texture}set texture(e){this._texture!==e&&(this._texture.dynamic&&this._texture.off("update",this._onTextureUpdate),this._texture=e,e.dynamic&&e.on("update",this._onTextureUpdate),this.material.textures.baseColor=e,this._onUpdate())}get anchor(){return this._anchor}set anchor(e){"number"==typeof e?this._anchor.set(e):this._anchor.copyFrom(e)}get pixelSize(){return this._pixelSize}set pixelSize(e){this._pixelSize!==e&&(this._pixelSize=e,this._onUpdate())}get tint(){return this.material.baseColor}set tint(e){this.material.baseColor=e}get alpha(){return this.material.alpha}set alpha(e){this.material.alpha=e}get alphaMode(){return this.material.alphaMode}set alphaMode(e){this.material.alphaMode!==e&&(this.material.alphaMode=e)}get alphaCutoff(){return this.material.alphaCutoff}set alphaCutoff(e){this.material.alphaCutoff=e}get width(){return Math.abs(this.scale.x)*this._texture.orig.width*this._pixelSize}set width(e){let t=this._scaleForWorldSize(e,this._texture.orig.width,this.scale.x);null!==t&&(this.scale.x=t)}get height(){return Math.abs(this.scale.y)*this._texture.orig.height*this._pixelSize}set height(e){let t=this._scaleForWorldSize(e,this._texture.orig.height,this.scale.y);null!==t&&(this.scale.y=t)}getSize(e={width:0,height:0,depth:0}){return e.width=this.width,e.height=this.height,e.depth=0,e}setSize(e,t,r){"object"==typeof e?(t=e.height??e.width,e=e.width):t??=e,this.width=e,this.height=t}_scaleForWorldSize(e,t,r){return 0===t?(tb(),null):e/(t*this._pixelSize)*(Math.sign(r)||1)}updateLocalTransform(){let e=this.quaternion;if(this.rotationDirty){this.rotationDirty=!1;let t=this.rotation._x,r=this.rotation._y,i=this.rotation._z,s=Math.cos(t/2),a=Math.cos(r/2),o=Math.cos(i/2),n=Math.sin(t/2),l=Math.sin(r/2),h=Math.sin(i/2);e._x=n*a*o+s*l*h,e._y=s*l*o-n*a*h,e._z=s*a*h+n*l*o,e._w=s*a*o-n*l*h}let t=e._x,r=e._y,i=e._z,s=e._w,a=t+t,o=r+r,n=i+i,l=t*a,h=t*o,u=t*n,d=r*o,c=r*n,f=i*n,p=s*a,m=s*o,_=s*n,g=this.localTransform.elements,x=this._pixelSize,y=this.scale._x*(this._texture.orig.width*x),v=this.scale._y*(this._texture.orig.height*x),b=this.scale._z;g[0]=(1-(d+f))*y,g[1]=(h+_)*y,g[2]=(u-m)*y,g[4]=(h-_)*v,g[5]=(1-(l+f))*v,g[6]=(c+p)*v,g[8]=(u+m)*b,g[9]=(c-p)*b,g[10]=(1-(l+d))*b;let w=.5-this._anchor._x,T=this._anchor._y-.5;g[12]=this.position._x+w*g[0]+T*g[4],g[13]=this.position._y+w*g[1]+T*g[5],g[14]=this.position._z+w*g[2]+T*g[6],null!==this._origin&&this._addOriginOffset()}_getOriginOffset(e){let t=this._origin,r=t._x,i=t._y,s=t._z,a=r*this.scale._x,o=i*this.scale._y,n=s*this.scale._z,l=this.quaternion,h=l._x,u=l._y,d=l._z,c=l._w,f=h+h,p=u+u,m=d+d,_=h*f,g=h*p,x=h*m,y=u*p,v=u*m,b=d*m,w=c*f,T=c*p,C=c*m;return e.x=r-((1-(y+b))*a+(g-C)*o+(x+T)*n),e.y=i-((g+C)*a+(1-(_+b))*o+(v-w)*n),e.z=s-((x-T)*a+(v+w)*o+(1-(_+y))*n),e}destroy(e){if(this.destroyed)return;let t=this._texture,r=this.material,i=!r.destroyed;t.dynamic&&t.off("update",this._onTextureUpdate),super.destroy(e),!(i&&r.destroyed)&&(this._ownsMaterial&&i?r.destroy(e):(0,g.M)(e,"texture")&&t.destroy((0,g.M)(e,"textureSource"))),this._texture=null}_destroyGeometry(){}},tT=r(62933),tC=class{data;_buffer=null;_bufferResource=null;_boneCount=0;_tick=0;bufferVersion=0;_texture=null;_textureSource=null;_retiredBuffers=[];_slotWorldIds=[];_addCount=0;_changed=!1;constructor(e={}){let t=e.initialBoneCapacity??256;this.data=new Float32Array((0,tT.Lm)(12*t))}get buffer(){return this._buffer??=new ej.c({data:this.data,usage:m.Sdw.STORAGE|m.Sdw.COPY_DST|m.Sdw.COPY_SRC,label:"BonePit",shrinkToFit:!1})}get bufferResource(){return this._bufferResource??=new m.dZd({buffer:this.buffer})}get texture(){return this._texture||this._initTexture()}_initTexture(){let{width:e,height:t}=(0,tT.VK)(this.data.length);return this._textureSource=new m.PPd({resource:this.data,width:e,height:t,format:"rgba32float",scaleMode:"nearest",alphaMode:"no-premultiply-alpha"}),this._texture=new m.gPd({source:this._textureSource}),this._texture}clear(){this._boneCount=0,this._addCount=0,this._tick++}add(e){if(e._bonePitTick===this._tick)return e._bonePitIndex;e._bonePitTick=this._tick;let t=this._boneCount,r=this._addCount++;return this._boneCount+=e.jointCount,e._bonePitIndex=t,(this._changed||this._slotWorldIds[r]!==e._worldId)&&(this._changed=!0,this._slotWorldIds[r]=e._worldId,this._ensureCapacity(this._boneCount),this.data.set(e.worldMatrix,12*t)),t}update(){if(this._slotWorldIds.length!==this._addCount&&(this._slotWorldIds.length=this._addCount),!this._changed||(this._changed=!1,0===this._boneCount))return;let e=12*this._boneCount;this._buffer?.update(4*e,0),this._textureSource&&(0,tT.J9)(this._textureSource,0,e)}_ensureCapacity(e){let t=12*e;if(t<=this.data.length)return;let r=this.data.length;for(;r<t;)r*=2;let i=new Float32Array(r=(0,tT.Lm)(r));if(i.set(this.data),this.data=i,this._buffer&&(this._retiredBuffers.push(this._buffer),this._buffer=null,this._bufferResource=null),this.bufferVersion++,this._textureSource){let{width:e,height:t}=(0,tT.VK)(this.data.length);this._textureSource.resource=this.data,(this._textureSource.width!==e||this._textureSource.height!==t)&&this._textureSource.resize(e,t),this._textureSource.update()}}_freeRetired(){for(let e=0;e<this._retiredBuffers.length;e++)this._retiredBuffers[e].destroy();this._retiredBuffers.length=0}unload(){this.data&&(this._buffer?.unload(),this._textureSource?.unload(),this._freeRetired())}destroy(){this.data&&(this._bufferResource?.destroy(!1),this._buffer?.destroy(),this._freeRetired(),this._texture?.destroy(!0),this.data=null,this._slotWorldIds=null,this._buffer=null,this._bufferResource=null,this._texture=null,this._textureSource=null)}};let tS=e=>e>0?e*e:0,tD=e=>{let t=e>.01?e:.01,r=t*t;return r*r},tM=(e,t,r)=>{let i=-r[8],s=-r[9],a=-r[10],o=1/Math.sqrt(i*i+s*s+a*a);e[t+8]=i*o,e[t+9]=s*o,e[t+10]=a*o};var tB=class{data=new Float32Array(512);_count=0;get count(){return this._count}reset(){this._count=0}add(e){((e,t,r)=>{let i=e.worldTransform.elements;if(t[r]=i[12],t[r+1]=i[13],t[r+2]=i[14],(0,T.Og)(t,r+4,e.color,e.intensity),"directional"===e.type)t[r+3]=0,t[r+7]=0,tM(t,r,i);else if("point"===e.type)t[r+3]=1,t[r+7]=tS(e.range),t[r+15]=tD(e.radius);else if("spot"===e.type){t[r+3]=2,t[r+7]=tS(e.range),t[r+15]=tD(e.radius),tM(t,r,i);let s=e.coneAngle*m.Tde;t[r+11]=Math.cos(s),t[r+12]=Math.cos(s*(1-e.penumbra))}t[r+13]=e._shadowDataIndex,t[r+14]=(0,ef.lP)(e)})(e,this.data,16*this._count),this._count++}},tI=r(77869);let tP={name:"envSourceCube",gpu:{header:`
fn sampleEnvironment(dir: vec3<f32>, roughness: f32) -> vec3<f32> {
  let maxMip = f32(textureNumLevels(uEnvironmentTexture) - 1u);
  return textureSampleLevel(uEnvironmentTexture, uSampler, dir, roughness * maxMip).rgb;
}
`},gl:{header:`
vec3 sampleEnvironment(vec3 dir, float roughness) {
  return textureLod(uEnvironmentTexture, dir, roughness * uEnvironmentMaxMipLevel).rgb;
}
`}},tA={name:"envSourceDefault",gpu:{header:`
fn sampleEnvironment(dir: vec3<f32>, roughness: f32) -> vec3<f32> {
  return vec3<f32>(0.0);
}
`},gl:{header:`
vec3 sampleEnvironment(vec3 dir, float roughness) {
  return vec3(0.0);
}
`}},tF={name:"envSourceHemisphere",gpu:{header:`
fn sampleEnvironment(dir: vec3<f32>, roughness: f32) -> vec3<f32> {
  let t = dot(dir, global.uHemisphereUp) * 0.5 + 0.5;
  return mix(global.uHemisphereGround, global.uHemisphereSky, t);
}
`},gl:{header:`
vec3 sampleEnvironment(vec3 dir, float roughness) {
  float t = dot(dir, uHemisphereUp) * 0.5 + 0.5;
  return mix(uHemisphereGround, uHemisphereSky, t);
}
`}},tR={name:"exp2Fog",interStage:{vFogDepth:"f32"},gpu:{vertex:{afterTransform:`
  output.vFogDepth = -(camera.uViewMatrix * worldPosition).z;
`},fragment:{end:`
  let fogD = global.uFogParams.z * input.vFogDepth;
  let fogFactor = 1.0 - exp(-fogD * fogD);
  finalColor = mix(finalColor, global.uFogColor, fogFactor);
`}},gl:{vertex:{afterTransform:`
  vFogDepth = -(uViewMatrix * worldPosition).z;
`},fragment:{end:`
  float fogD = uFogParams.z * vFogDepth;
  float fogFactor = 1.0 - exp(-fogD * fogD);
  finalColor = mix(finalColor, uFogColor, fogFactor);
`}}},tk={name:"exponentialFog",interStage:{vFogDepth:"f32"},gpu:{vertex:{afterTransform:`
  output.vFogDepth = -(camera.uViewMatrix * worldPosition).z;
`},fragment:{end:`
  let fogFactor = 1.0 - exp(-global.uFogParams.z * input.vFogDepth);
  finalColor = mix(finalColor, global.uFogColor, fogFactor);
`}},gl:{vertex:{afterTransform:`
  vFogDepth = -(uViewMatrix * worldPosition).z;
`},fragment:{end:`
  float fogFactor = 1.0 - exp(-uFogParams.z * vFogDepth);
  finalColor = mix(finalColor, uFogColor, fogFactor);
`}}},tz={name:"linearFog",interStage:{vFogDepth:"f32"},gpu:{vertex:{afterTransform:`
  output.vFogDepth = -(camera.uViewMatrix * worldPosition).z;
`},fragment:{end:`
  let fogFactor = smoothstep(global.uFogParams.x, global.uFogParams.y, input.vFogDepth);
  finalColor = mix(finalColor, global.uFogColor, fogFactor);
`}},gl:{vertex:{afterTransform:`
  vFogDepth = -(uViewMatrix * worldPosition).z;
`},fragment:{end:`
  float fogFactor = smoothstep(uFogParams.x, uFogParams.y, vFogDepth);
  finalColor = mix(finalColor, uFogColor, fogFactor);
`}}};var tV=class{data=new Float32Array(24*ef.Ou);_count=0;get count(){return this._count}reset(){this._count=0}add(e){var t,r;let i;t=this.data,r=24*this._count,t.set(e.cameraData.viewProjection.elements,r),t[r+16]=e.bias,t[r+17]=e.normalBias,t[r+18]=e.mapSize,t[r+19]=e.cascadeCount,i=e.splits,t[r+20]=i?.[0]??1e30,t[r+21]=i?.[1]??1e30,t[r+22]=i?.[2]??1e30,t[r+23]=i?.[3]??1e30,this._count++}},tL=r(87812),tO=r(60330);function tN(){return{target:null,point:new el.P,localPoint:new el.P,normal:new el.P,uv:new tO.I,distance:-1,triangleIndex:-1}}let tE={};function tG(e){let t=e._pick3D;return void 0===t&&(t=e._pick3D={token:tE,hit:tN(),hasHit:!1,target:null,currentTarget:null},Object.defineProperties(e,tU)),t}let tU={hit3D:{configurable:!0,get(){let e=tG(this);return e.token===this.nativeEvent&&e.hasHit?e.hit:null}},target3D:{configurable:!0,get(){let e=tG(this);return e.token===this.nativeEvent?e.target:null}},currentTarget3D:{configurable:!0,get(){let e=tG(this);return e.token===this.nativeEvent?e.currentTarget:null}}};Object.defineProperties(m._J7.prototype,tU);let t$=["pointerdown","pointerup","pointermove","pointerupoutside","pointerout","pointerover","pointertap","click","tap","rightclick","contextmenu","mousedown","mouseup","mousemove","mouseupoutside","rightdown","rightup","rightupoutside","touchstart","touchmove","touchend","touchendoutside"],tq=Object.create(null);for(let e of[...t$,"mouseover","mouseout","wheel"])e.endsWith("outside")||(tq[e]={onKey:"on"+e,captureKey:e+"capture"});function tH(e,t,r){let i=e._events[t];if(i)if("fn"in i)i.once&&e.removeListener(t,i.fn,void 0,!0),i.fn.call(i.context,r);else for(let s=0,a=i.length;s<a&&!r.propagationImmediatelyStopped;s++)i[s].once&&e.removeListener(t,i[s].fn,void 0,!0),i[s].fn.call(i[s].context,r)}let tj=0,tW=!1;function tK(e){if(0===e.length)return null;let t=e[0];for(let r=1;r<e.length&&e[r].parent===t;r++)t=e[r];return t}m.L3G.register({clear:()=>{tW=!1}});var tX=class{_view;_interactiveList=[];enableGlobalMoveEvents=!0;_dynamicPickCount=0;_clipVolumeCount=0;_currentPick3D=null;_hitAreaShape=null;_hitAreaProxy={contains:(e,t)=>{let r=this._hitAreaShape;return null===r||r.contains(e,t)?this._containsPoint(e,t):(this._currentPick3D=null,!1)}};_pointerRecords=new Map;_recordPool=[];_pathPool=[];_clickHistories=new Map;_clickHistoryPool=[];_movePickToken=tE;_movePick3D=null;_cursorFallback;_lastHit=tN();_raycastHit=tN();_scratchWorldRay=new tL.R;_scratchGlobal=new tO.I;_scratchLocalRay=new tL.R;_scratchNormalMatrix=new e_.k;_scratchWorldPoint=new el.P;_scratchCenter=new el.P;_scratchHit={point:new el.P,normal:new el.P,uv:new tO.I,distance:-1,triangleIndex:-1};_scratchClipRay=new tL.R;_scratchClipPoint=new el.P;constructor(e){for(let t of(this._view=e,e.eventMode="static",t$))e.on(t,e=>this._dispatch3DEvent(t,e));e.on("wheel",e=>this._forwardToPick(e,"wheel",this._currentPick3D)),e.on("globalpointermove",e=>this._dispatchGlobalMove(e))}destroy(){for(let[e,t]of this._pointerRecords)this._freePointerRecord(e,t);this._clickHistories=null,this._clickHistoryPool=null,this._recordPool=null,this._pathPool=null;let e=this._interactiveList;for(let t=0;t<e.length;t++)e[t]._pickIndex=-1;e.length=0,this._currentPick3D=null,this._hitAreaShape=null,this._movePick3D=null,this._movePickToken=tE,this._clipVolumeCount=0}get _cursor(){return this._currentPick3D?.cursor??this._cursorFallback}set _cursor(e){this._cursorFallback=e}_containsPoint(e,t){if(tW||void 0===m.C1x.defaultEventMode||(tW=!0,"passive"!==m.C1x.defaultEventMode&&(0,m.R8M)(`The renderer eventMode default ('${m.C1x.defaultEventMode}') applies only to 2D containers; 3D nodes default to 'passive'. Set eventMode per node or group.`)),!this._inViewRect(e,t))return this._currentPick3D=null,!1;let r=this._view;return r.worldTransform.apply(this._scratchGlobal.set(e,t),this._scratchGlobal),r.screenToRay(this._scratchGlobal,this._scratchWorldRay,!0),this._currentPick3D=this._pickWithWorldRay(this._scratchWorldRay,this._lastHit)?this._lastHit.target:null,!0}_inViewRect(e,t){let r=this._view,i=r.width,s=r.height,a=(e+r.anchor.x*i)/i,o=(t+r.anchor.y*s)/s;return a>=0&&a<=1&&o>=0&&o<=1}_raycast(e,t){let r=this._view,i=r.worldTransform.applyInverse(e,this._scratchGlobal);if(!this._inViewRect(i.x,i.y))return null;r.screenToRay(e,this._scratchWorldRay,!0);let s=t??this._raycastHit;return this._pickWithWorldRay(this._scratchWorldRay,s)?(t||(this._raycastHit=tN()),s):null}_addInteractive(e){-1===e._pickIndex&&(e._pickIndex=this._interactiveList.push(e)-1,"dynamic"===e._eventMode&&this._changeDynamicCount(1))}_removeInteractive(e,t="dynamic"===e._eventMode){let r=e._pickIndex;if(-1===r)return;let i=this._interactiveList,s=i.pop();s!==e&&(i[r]=s,s._pickIndex=r),e._pickIndex=-1,this._clearPickState(e),t&&this._changeDynamicCount(-1)}_changeDynamicCount(e){this._dynamicPickCount+=e;let t=this._dynamicPickCount>0?"dynamic":"static",r=this._view.eventMode;("static"===r||"dynamic"===r)&&r!==t&&(this._view.eventMode=t)}_clearPickState(e){this._currentPick3D===e&&(this._currentPick3D=null),this._movePick3D===e&&(this._movePick3D=null)}_pickWithWorldRay(e,t){let r=this._interactiveList,i=e.origin.x,s=e.origin.y,a=e.origin.z,o=this._clipVolumeCount>0?++tj:0,n=1/0,l=null,h=null,d=!1;for(let f=0;f<r.length;f++){let p=r[f],m=p._hitVolumeResolved??p._getDefaultHitVolume();if(!m||0===p._worldVisible)continue;let g=p.worldTransform.elements;this._scratchCenter.set(g[12],g[13],g[14]);let x=function(e){if(e instanceof c.i){let t=e.center,r=Math.sqrt(t.x*t.x+t.y*t.y+t.z*t.z)+Math.max(e.radius,0);return r*r}if(e instanceof u.a||e instanceof _){let{min:t,max:r}=e instanceof _?e.bounds3D:e;return Math.max(t.x*t.x,r.x*r.x)+Math.max(t.y*t.y,r.y*r.y)+Math.max(t.z*t.z,r.z*r.z)}return e.boundingRadiusSq}(m)*p._getWorldScaleSq();if(e.distanceSqToPoint(this._scratchCenter)>x||0!==o&&!this._passesClipPrefilter(p,e,o))continue;let y=this._toLocalRay(e,p._getInverseWorldTransform());if(0>function(e,t,r,i=1/0){if(t instanceof u.a){let i=e.intersectBoxT(t);return -1===i?-1:(e.at(i,r.point),r.distance=i,r.normal.set(0,0,0),r.uv.x=0,r.uv.y=0,r.triangleIndex=-1,i)}if(t instanceof c.i){let i=e.intersectSphereT(t);return -1===i?-1:(e.at(i,r.point),r.distance=i,r.normal.set(0,0,0),r.uv.x=0,r.uv.y=0,r.triangleIndex=-1,i)}return t instanceof _?function(e,t,r,i=1/0){if("triangle-list"!==t.topology)return -1;let s=t.bounds3D,a=e.intersectBoxT(s);if(-1===a||a>=i&&!s.containsPoint(e.origin))return -1;let o=t.attributes.aPosition;if(!o)return -1;let n=o.buffer.data;if(!(n instanceof Float32Array))return -1;let l=t.indexBuffer,h=l?l.data:null,u=h?h.length/3:n.length/9,d=e.origin.x,c=e.origin.y,f=e.origin.z,p=e.direction.x,m=e.direction.y,_=e.direction.z,g=i,x=-1,y=0,v=0,b=0,w=0,T=0;for(let e=0;e<u;e++){let t=h?h[3*e]:3*e,r=h?h[3*e+1]:3*e+1,i=h?h[3*e+2]:3*e+2,s=n[3*t],a=n[3*t+1],o=n[3*t+2],l=n[3*r],u=n[3*r+1],C=n[3*r+2],S=n[3*i],D=n[3*i+1],M=n[3*i+2],B=l-s,I=u-a,P=C-o,A=S-s,F=D-a,R=M-o,k=m*R-_*F,z=_*A-p*R,V=p*F-m*A,L=B*k+I*z+P*V;if(L>-1e-7&&L<1e-7)continue;let O=1/L,N=d-s,E=c-a,G=f-o,U=O*(N*k+E*z+G*V);if(U<0||U>1)continue;let $=E*P-G*I,q=G*B-N*P,H=N*I-E*B,j=O*(p*$+m*q+_*H);if(j<0||U+j>1)continue;let W=O*(A*$+F*q+R*H);!(W<1e-7)&&(W>=g||(g=W,x=e,y=U,v=j,b=I*R-P*F,w=P*A-B*R,T=B*F-I*A))}if(x<0)return -1;let C=Math.sqrt(b*b+w*w+T*T);C>0?r.normal.set(b/C,w/C,T/C):r.normal.set(0,0,0),r.point.set(d+p*g,c+m*g,f+_*g),r.distance=g,r.triangleIndex=x;let S=t.attributes.aUV?.buffer.data;if(S instanceof Float32Array&&h){let e=h[3*x],t=h[3*x+1],i=h[3*x+2],s=1-y-v;r.uv.x=S[2*e]*s+S[2*t]*y+S[2*i]*v,r.uv.y=S[2*e+1]*s+S[2*t+1]*y+S[2*i+1]*v}else if(S instanceof Float32Array){let e=3*x,t=3*x+1,i=3*x+2,s=1-y-v;r.uv.x=S[2*e]*s+S[2*t]*y+S[2*i]*v,r.uv.y=S[2*e+1]*s+S[2*t+1]*y+S[2*i+1]*v}else r.uv.x=y,r.uv.y=v;return g}(e,t,r,i):t.raycast(e,r)}(this._scratchLocalRay,m,this._scratchHit,n*y))continue;this._scratchHit.point.applyAffineMatrix4(p.worldTransform,this._scratchWorldPoint);let v=this._scratchWorldPoint.x-i,b=this._scratchWorldPoint.y-s,w=this._scratchWorldPoint.z-a,T=Math.sqrt(v*v+b*b+w*w);if(T>=n)continue;let C=this._resolvePickTarget(p,this._scratchWorldPoint);C&&(n=T,l=C,h=p,d=-1!==this._scratchHit.triangleIndex,t.point.copyFrom(this._scratchWorldPoint),t.localPoint.copyFrom(this._scratchHit.point),t.normal.copyFrom(this._scratchHit.normal),t.uv.copyFrom(this._scratchHit.uv),t.triangleIndex=this._scratchHit.triangleIndex)}return!!l&&(d?(h._getInverseWorldTransform().transpose(this._scratchNormalMatrix),t.normal.transformDirection(this._scratchNormalMatrix)):t.normal.set(0,0,0),t.target=l,t.distance=n,!0)}_toLocalRay(e,t){let r=this._scratchLocalRay;e.origin.applyAffineMatrix4(t,r.origin);let i=e.direction,s=t.elements,a=s[0]*i.x+s[4]*i.y+s[8]*i.z,o=s[1]*i.x+s[5]*i.y+s[9]*i.z,n=s[2]*i.x+s[6]*i.y+s[10]*i.z,l=Math.sqrt(a*a+o*o+n*n)||1,h=1/l;return r.direction.x=a*h,r.direction.y=o*h,r.direction.z=n*h,l}_resolvePickTarget(e,t=null){let r=null!==t&&this._clipVolumeCount>0,i=e.isInteractive()?e:null,s=e.parent;for(;s;){if(!s._interactiveChildren||"none"===s._eventMode||r&&null!==s._hitVolumeInput&&!this._clipContains(s,t))return null;null===i&&s.isInteractive()&&(i=s),s=s.parent}return i}_passesClipPrefilter(e,t,r){let i=e.parent;for(;i;){let e=null!==i._hitVolumeInput?i._hitVolumeResolved:null;if(null!==e){if(i._clipRayStamp!==r){i._clipRayStamp=r;let s=t.applyMatrix4(i._getInverseWorldTransform(),this._scratchClipRay);e instanceof u.a?i._clipRayHit=-1!==s.intersectBoxT(e):e instanceof c.i?i._clipRayHit=-1!==s.intersectSphereT(e):e instanceof _?i._clipRayHit=-1!==s.intersectBoxT(e.bounds3D):i._clipRayHit=!0}if(!i._clipRayHit)return!1}i=i.parent}return!0}_clipContains(e,t){let r=e._hitVolumeResolved;if(null===r)return!0;let i=t.applyAffineMatrix4(e._getInverseWorldTransform(),this._scratchClipPoint);return r instanceof u.a||r instanceof c.i?r.containsPoint(i):r instanceof _?r.bounds3D.containsPoint(i):void 0===r.containsPoint||r.containsPoint(i)}_dispatch3DEvent(e,t){switch(e){case"pointerout":{let e=this._pointerRecords.get(t.pointerId),r=!1;if(e){e.lastEventTime=t.timeStamp;let i=e.overPath?tK(e.overPath):null;if(e.overPath&&(this._releasePath(e.overPath),e.overPath=null),this._writeFields(t,i,null),i){let e="mouse"===t.pointerType||"pen"===t.pointerType;r=this._emit3DChain(t,"pointerout",i),e&&this._emit3DChain(t,"mouseout",i),this._emitEnterLeaveWalk(t,i,null,!1,e)}0===e.heldPressCount&&this._freePointerRecord(t.pointerId,e)}else this._writeFields(t,null,null);this._currentPick3D=null,r&&this._stopViewPropagation(t);return}case"pointerover":{let e=this._currentPick3D;if(!e)return void this._writeFields(t,null,null);let r=this._getPointerRecord(t.pointerId,t.timeStamp),i="mouse"===t.pointerType||"pen"===t.pointerType;this._writeFields(t,e,e);let s=this._emit3DChain(t,"pointerover",e);i&&this._emit3DChain(t,"mouseover",e),this._emitEnterLeaveWalk(t,e,null,!0,i),r.overPath&&this._releasePath(r.overPath),r.overPath=this._capturePath(e),s&&this._stopViewPropagation(t);return}case"pointerdown":{let r=this._currentPick3D,i=this._getPointerRecord(t.pointerId,t.timeStamp),s=t.button??0,a=i.pressPathByButton[s];a?this._releasePath(a):i.heldPressCount++,i.pressPathByButton[s]=r?this._capturePath(r):this._acquirePath(),i.clickToken=tE,this._forwardToPick(t,e,r);return}case"pointermove":{let r=this._currentPick3D;this._movePickToken=t.nativeEvent,this._movePick3D=r;let i=this._pointerRecords.get(t.pointerId);if(!i&&r&&(i=this._getPointerRecord(t.pointerId,t.timeStamp)),i){i.lastEventTime=t.timeStamp;let e=i.overPath?tK(i.overPath):null;if(e!==r){let s="mouse"===t.pointerType||"pen"===t.pointerType;e&&(this._writeFields(t,e,r),this._emit3DChain(t,"pointerout",e),s&&this._emit3DChain(t,"mouseout",e),this._isInChain(e,r)||this._emitEnterLeaveWalk(t,e,r,!1,s)),r&&(this._writeFields(t,r,r),this._emit3DChain(t,"pointerover",r),s&&this._emit3DChain(t,"mouseover",r),e&&this._isInChain(r,e)||this._emitEnterLeaveWalk(t,r,e,!0,s)),i.overPath&&this._releasePath(i.overPath),i.overPath=r?this._capturePath(r):null}}this._forwardToPick(t,e,r);return}case"pointerup":{let r=this._currentPick3D,i=r?this._capturePath(r):null,s=!1;this._writeFields(t,r,r),r&&(s=this._emit3DChain(t,e,r,i)),this._reconcileRelease(t,i,!0),i&&this._releasePath(i),s&&this._stopViewPropagation(t);return}case"pointerupoutside":this._writeFields(t,null,null),this._reconcileRelease(t,null,!1);return;case"mouseupoutside":case"rightupoutside":case"touchendoutside":return;case"click":case"rightclick":case"tap":case"pointertap":{let r=this._pointerRecords.get(t.pointerId);if(r&&r.clickToken===t.nativeEvent){let i,s=r.clickTarget3D;if(this._writeFields(t,s,this._currentPick3D),!s)return;let a=t.detail;t.detail=r.clickDetail;try{i=this._emit3DChain(t,e,s)}finally{t.detail=a}i&&this._stopViewPropagation(t);return}this._forwardToPick(t,e,this._currentPick3D);return}case"mousedown":case"rightdown":case"touchstart":case"mousemove":case"touchmove":case"mouseup":case"rightup":case"touchend":case"contextmenu":this._forwardToPick(t,e,this._currentPick3D);return}}_forwardToPick(e,t,r){this._writeFields(e,r,r),r&&this._emit3DChain(e,t,r)&&this._stopViewPropagation(e)}_reconcileRelease(e,t,r){let i=this._pointerRecords.get(e.pointerId);i&&(i.lastEventTime=e.timeStamp);let s=e.button??0,a=i?i.pressPathByButton[s]:null;if(!i||!a)return;let o=tK(a);i.pressPathByButton[s]=null,i.heldPressCount--,this._releasePath(a);let n=o;o&&(null===t||!t.includes(o))&&(n=this._emitUpOutsideWalk(e,o,t)),r?(i.clickTarget3D=n,i.clickDetail=n?this._countClick(e.pointerId,s,n):0,i.clickToken=e.nativeEvent):0===i.heldPressCount&&this._freePointerRecord(e.pointerId,i)}_emitUpOutsideWalk(e,t,r){let i=e.pointerType,s=null,a="";"touch"===i?(s="touchendoutside",a="ontouchendoutside"):("mouse"===i||"pen"===i)&&(s=2===e.button?"rightupoutside":"mouseupoutside",a=2===e.button?"onrightupoutside":"onmouseupoutside");let o=tG(e),n=e.type,l=e.target,h=e.currentTarget,u=o.target,d=o.currentTarget,c=e.path,f=e.eventPhase,p=e.propagationStopped,m=e.propagationImmediatelyStopped;e.propagationStopped=!1,e.propagationImmediatelyStopped=!1,e.eventPhase=3,e.target=t,o.target=t;let _=t;try{for(;_&&(null===r||!r.includes(_));){_.isInteractive()&&(e.currentTarget=_,o.currentTarget=_,e.type="pointerupoutside",_.onpointerupoutside?.call(_,e),tH(_,"pointerupoutside",e),s)&&(e.type=s,_[a]?.call(_,e),tH(_,s,e));_=_.parent}}finally{e.type=n,e.target=l,e.currentTarget=h,o.target=u,o.currentTarget=d,e.path=c,e.eventPhase=f,e.propagationStopped=p,e.propagationImmediatelyStopped=m}return _}_isInChain(e,t){let r=t;for(;r;){if(r===e)return!0;r=r.parent}return!1}_countClick(e,t,r){let i=performance.now(),s=this._clickHistories.get(e);s||(this._sweepClickHistories(i),s=this._clickHistoryPool.pop()??{byButton:[],lastClickTime:0},this._clickHistories.set(e,s)),s.lastClickTime=i;let a=s.byButton[t];return a||(a=s.byButton[t]={clickCount:0,target:null,timeStamp:0}),a.target===r&&i-a.timeStamp<200?a.clickCount++:a.clickCount=1,a.target=r,a.timeStamp=i,a.clickCount}_sweepClickHistories(e){for(let[t,r]of this._clickHistories)if(e-r.lastClickTime>=200){let e=r.byButton;for(let t=0;t<e.length;t++){let r=e[t];r&&(r.clickCount=0,r.target=null,r.timeStamp=0)}this._clickHistoryPool.push(r),this._clickHistories.delete(t)}}_stopViewPropagation(e){e.propagationStopped=!0,e.propagationImmediatelyStopped=!0}_getPointerRecord(e,t){let r=this._pointerRecords.get(e);return r||(this._sweepStaleRecords(t),r=this._recordPool.pop()??{pressPathByButton:[],heldPressCount:0,overPath:null,lastEventTime:0,clickTarget3D:null,clickDetail:0,clickToken:tE},this._pointerRecords.set(e,r)),r.lastEventTime=t,r}_sweepStaleRecords(e){for(let[t,r]of this._pointerRecords)e-r.lastEventTime>=6e4&&this._freePointerRecord(t,r)}_freePointerRecord(e,t){this._pointerRecords.delete(e);let r=t.pressPathByButton;for(let e=0;e<r.length;e++){let t=r[e];t&&(this._releasePath(t),r[e]=null)}t.heldPressCount=0,t.overPath&&(this._releasePath(t.overPath),t.overPath=null),t.clickTarget3D=null,t.clickDetail=0,t.clickToken=tE,this._recordPool.push(t)}_acquirePath(){return this._pathPool.pop()??[]}_releasePath(e){e.length=0,this._pathPool.push(e)}_capturePath(e){let t=this._acquirePath(),r=e;for(;r;)t.push(r),r=r.parent;return t.reverse(),t}_writeFields(e,t,r){var i,s;let a=tG(e);null!==r&&(i=this._lastHit,(s=a.hit).target=i.target,s.point.copyFrom(i.point),s.localPoint.copyFrom(i.localPoint),s.normal.copyFrom(i.normal),s.uv.copyFrom(i.uv),s.distance=i.distance,s.triangleIndex=i.triangleIndex),a.hasHit=null!==r,a.target=t,a.token=e.nativeEvent}_emit3DChain(e,t,r,i){let s=tG(e),a=e.type,o=e.target,n=e.currentTarget,l=s.currentTarget,h=e.path,u=e.eventPhase,d=e.propagationStopped,c=e.propagationImmediatelyStopped;e.propagationStopped=!1,e.propagationImmediatelyStopped=!1,e.type=t,e.target=r;let{onKey:f,captureKey:p}=tq[t],m=i??this._capturePath(r);e.path=m;let _=!1;try{e.eventPhase=1;for(let t=0,r=m.length-1;t<r;t++){let r=m[t];if(r.isInteractive()&&(e.currentTarget=r,s.currentTarget=r,r[f]?.call(r,e),tH(r,p,e),e.propagationStopped||e.propagationImmediatelyStopped)){_=!0;break}}if(!_&&r.isInteractive()&&(e.eventPhase=2,e.currentTarget=r,s.currentTarget=r,r[f]?.call(r,e),tH(r,p,e),tH(r,t,e),(e.propagationStopped||e.propagationImmediatelyStopped)&&(_=!0)),!_){e.eventPhase=3;for(let r=m.length-2;r>=0;r--){let i=m[r];if(i.isInteractive()&&(e.currentTarget=i,s.currentTarget=i,i[f]?.call(i,e),tH(i,t,e),e.propagationStopped||e.propagationImmediatelyStopped)){_=!0;break}}}}finally{null==i&&this._releasePath(m),e.type=a,e.target=o,e.currentTarget=n,s.currentTarget=l,e.path=h,e.eventPhase=u,e.propagationStopped=d,e.propagationImmediatelyStopped=c}return _}_emitEnterLeaveWalk(e,t,r,i,s){let a=i?"pointerenter":"pointerleave",o=i?"pointerentercapture":"pointerleavecapture",n=i?"onpointerenter":"onpointerleave",l=i?"mouseenter":"mouseleave",h=i?"mouseentercapture":"mouseleavecapture",u=i?"onmouseenter":"onmouseleave",d=tG(e),c=e.type,f=e.target,p=e.currentTarget,m=e.path,_=e.eventPhase,g=e.propagationStopped,x=e.propagationImmediatelyStopped,y=d.target,v=d.currentTarget;e.propagationStopped=!1,e.propagationImmediatelyStopped=!1,e.eventPhase=2;let b=t;try{for(;b&&(i?b!==r:!this._isInChain(b,r));){b.isInteractive()&&(d.target=b,d.currentTarget=b,e.target=b,e.currentTarget=b,e.type=a,b[n]?.call(b,e),tH(b,o,e),tH(b,a,e),s&&(e.type=l,b[u]?.call(b,e),tH(b,h,e),tH(b,l,e)));b=b.parent}}finally{d.target=y,d.currentTarget=v,e.type=c,e.target=f,e.currentTarget=p,e.path=m,e.eventPhase=_,e.propagationStopped=g,e.propagationImmediatelyStopped=x}}_dispatchGlobalMove(e){if(!this.enableGlobalMoveEvents)return;let t=this._interactiveList;if(0===t.length)return;let r=this._movePickToken===e.nativeEvent?this._movePick3D:null;this._writeFields(e,r,r);let i=tG(e),s=e.pointerType,a=null,o="";"touch"===s?(a="globaltouchmove",o="onglobaltouchmove"):("mouse"===s||"pen"===s)&&(a="globalmousemove",o="onglobalmousemove");let n=e.type,l=e.currentTarget,h=i.currentTarget,u=e.eventPhase,d=e.propagationStopped,c=e.propagationImmediatelyStopped;e.propagationStopped=!1,e.propagationImmediatelyStopped=!1,e.eventPhase=3;try{for(let r=0;r<t.length;r++){let s=t[r],n=s._events;(void 0!==n.globalpointermove||s.onglobalpointermove||null!==a&&(void 0!==n[a]||s[o]))&&s.isInteractive()&&0!==s._worldVisible&&this._resolvePickTarget(s)&&(e.currentTarget=s,i.currentTarget=s,e.type="globalpointermove",s.onglobalpointermove?.call(s,e),tH(s,"globalpointermove",e),a)&&(e.type=a,s[o]?.call(s,e),tH(s,a,e))}}finally{e.type=n,e.currentTarget=l,i.currentTarget=h,e.eventPhase=u,e.propagationStopped=d,e.propagationImmediatelyStopped=c}}};function tY(e){let t=!1,r=e.parent;for(;r;){let e=r._eventMode;if("none"===e||!r._interactiveChildren)return 0;("static"===e||"dynamic"===e)&&(t=!0),r=r.parent}return t?2:1}function tJ(e,t,r){let i=e.children;for(let e=0;e<i.length;e++){let s=i[e],a=s._eventMode;if("none"===a)continue;let o="static"===a||"dynamic"===a;(o||"auto"===a||r&&s._hasPickVolume())&&t._addInteractive(s),s._interactiveChildren&&tJ(s,t,r||o)}}function tQ(e,t){let r=e.children;for(let e=0;e<r.length;e++){let i=r[e];-1!==i._pickIndex&&t._removeInteractive(i),"none"!==i._eventMode&&i._interactiveChildren&&tQ(i,t)}}var tZ=r(23278),t0=r(80785),t1=r(72119),t3=r(73390),t2=r(68751),t4=r(98741),t5=r(67534);let t6={r8unorm:[1,1],r8uint:[1,1],r8sint:[1,1],rg8unorm:[2,1],rg8uint:[2,1],rg8sint:[2,1],rgba8unorm:[8,1],"rgba8unorm-srgb":[8,1],rgba8uint:[4,1],rgba8sint:[4,1],bgra8unorm:[8,1],"bgra8unorm-srgb":[8,1],r16uint:[2,2],r16sint:[2,2],r16float:[2,2],rg16uint:[4,2],rg16sint:[4,2],rg16float:[4,2],rgba16uint:[8,2],rgba16sint:[8,2],rgba16float:[8,2],r32uint:[4,4],r32sint:[4,4],r32float:[4,4],rg32uint:[8,4],rg32sint:[8,4],rg32float:[8,4],rgba32uint:[16,4],rgba32sint:[16,4],rgba32float:[16,4],rgb10a2unorm:[8,4],rg11b10ufloat:[8,4]};var t8=class{_graph;_current=null;_targetColor;_targetDepth;constructor(e){this._graph=e}get targetColor(){return this._mustBeInSetup("targetColor"),this._targetColor}get targetDepth(){return this._mustBeInSetup("targetDepth"),this._targetDepth}get defaultColor(){return this._graph.defaultColor}get defaultDepth(){return this._graph.defaultDepth}getSceneOutput(e){return this._graph.getSceneOutput(e)}writeColor(e){return this._mustBeInSetup("writeColor").accesses.push({handle:e,mode:"write_attachment"}),e}writeDepth(e){return this._mustBeInSetup("writeDepth").accesses.push({handle:e,mode:"write_attachment"}),e}produce(e){return this._mustBeInSetup("produce").accesses.push({handle:e,mode:"produce"}),e}readDepthAttachment(e){return this._mustBeInSetup("readDepthAttachment").accesses.push({handle:e,mode:"read_attachment"}),e}get globalTextureBindings(){return this._graph.globalTextureBindings}sample(e,t){let r=this._mustBeInSetup("sample");if(void 0!==t.styleSlot&&"depth"===e._kind)throw Error("PassBuilder.sample: a depth handle binds as a depth view, which has no sampler to bind beside it");return r.accesses.push({handle:e,mode:"sample",binding:t}),e}read(e){return this._mustBeInSetup("read").accesses.push({handle:e,mode:"read"}),e}sideEffect(){this._mustBeInSetup("sideEffect").hasSideEffect=!0}createColor(e={}){return this._mustBeInSetup("createColor"),this._graph.createColor(e)}createDepth(e={}){return this._mustBeInSetup("createDepth"),this._graph.createDepth(e)}_beginPass(e,t){if(this._current=e,t?.renderTexture){let e=this._graph._cameraTarget(t);this._targetColor=e.color,this._targetDepth=e.depth}else this._targetColor=this._graph.sceneColor,this._targetDepth=this._graph.sceneDepth}_endPass(){this._current=null}_mustBeInSetup(e){if(!this._current)throw Error(`PassBuilder.${e}: called outside a pass.setup()`);return this._current}},t9=class{_targets=Object.create(null);_ownedKeys=new Set;get(e){let t=this._renderTargetKey(e);return this._targets[t]||(this._targets[t]=this._createRenderTarget(e),this._ownedKeys.add(t)),this._targets[t]}addToCache(e,t){let r=this._renderTargetKey(e);this._targets[r]=t,this._ownedKeys.delete(r)}reset(){for(let e in this._releaseOwned(),this._targets)delete this._targets[e]}destroy(){this.reset()}_releaseOwned(){for(let e of this._ownedKeys)this._targets[e].destroy();this._ownedKeys.clear()}_createRenderTarget(e){let t={colorAttachments:[]};if(e.colors)for(let r=0;r<e.colors.length;r++)t.colorAttachments[r]={texture:e.colors[r].texture,storeOp:"store"};if(0===t.colorAttachments.length&&!e.depth)throw Error("RenderTargetCache: cannot build a render target with no color or depth attachment");return e.depth&&(t.depthStencilAttachment={texture:e.depth.texture,depthReadOnly:e.depthReadOnly}),new m.O0B(t)}_renderTargetKey(e){let t=[];if(e.colors)for(let r=0;r<e.colors.length;r++)t.push(e.colors[r].texture.uid);return e.depth&&t.push(`depth${e.depth.texture.uid}${e.depthReadOnly?"_ro":""}`),t.join("_")}};let t7="depth24plus-stencil8",re=new m.M_G,rt={target:null,flipY:!1,frame:null},rr={},ri=[{texture:m.gPd.EMPTY.source}],rs={texture:m.gPd.EMPTY.source},ra={target:null,viewport:new m.M_G,colorSource:null,depthSource:null};function ro(e,t,r){return r.x=Math.round(e.x*t),r.y=Math.round(e.y*t),r.width=Math.max(1,Math.round(e.width*t)),r.height=Math.max(1,Math.round(e.height*t)),r}var rn=class{_resources=[];_passes=[];_builder;_renderTargetCache=new t9;_defaultCacheKey={colors:[{texture:m.gPd.EMPTY.source}],depth:{texture:m.gPd.EMPTY.source}};_defaultCacheKeyReadOnlyDepth={colors:this._defaultCacheKey.colors,depth:this._defaultCacheKey.depth,depthReadOnly:!0};_cameraTargets=new Map;_sceneDrawTarget=null;_camerasSeen=new Set;_cameraTargetColors=new Set;sceneColor;get sceneIsLinear(){let e=this._sceneColorOptions?.format;return void 0!==e&&(0,t3.P)(e)}sceneDepth;sceneOutputs;resolution=1;_sceneOutputsByName=new Map;_clearValueById=Object.create(null);_sceneColorOptions;defaultColor;defaultDepth;_lastColorUid=-1;_lastDepthUid=-1;_lastWidth=-1;_lastHeight=-1;_activePasses=[];_acquireAt=[];_releaseAt=[];_firstUseByResId=new Int32Array(0);_lastUseByResId=new Int32Array(0);_firstWriterByResId=new Int32Array(0);_lastWriterByResId=new Int32Array(0);_lastWrittenHandleByResId=[];_depthResolveByResId=[];_depthResolvedAtByResId=new Int32Array(0);_resolveTick=0;_limitsChecked=!1;_resolveCandidates=[];_resolveStack=[];_savedBind;_bindOptions={target:null,clear:m.uJ3.NONE,frame:void 0,flipY:!1};_destroyed=!1;globalTextureBindings;constructor(e){this.globalTextureBindings=e.globalTextureBindings,this.defaultColor=this.importColor(e.defaultColor),this.defaultDepth=this.importDepth(e.defaultDepth);let t=e.sceneColor;if(this.sceneColor=t?this.createColor(t):this.defaultColor,this.sceneDepth=e.sceneDepth?this.createDepth(e.sceneDepth):this.defaultDepth,this._sceneColorOptions=t??null,this.sceneOutputs=e.sceneOutputs??[],this.sceneOutputs.length>0){if(!t)throw Error("RenderGraph: sceneOutputs need a sceneColor. The scene passes attach each output beside the scene colour, and the screen can't hold extra attachments, so give the graph a `sceneColor` and `sceneDepth`, as createDefaultGraph3D does whenever a pass requires an output.");for(let e of this.sceneOutputs){(0,t1.m)(e);let r=this.createColor({width:t.width,height:t.height,antialias:t.antialias,format:e.format,scaleMode:e.format.includes("int")?"nearest":void 0,label:e.name});this._sceneOutputsByName.set(e.name,{output:e,color:r}),e.clearValue&&(this._clearValueById[r._id]=e.clearValue)}}this._builder=new t8(this)}getSceneOutput(e){let t=this._sceneOutputsByName.get(e.name);if(!t)throw Error(`RenderGraph.getSceneOutput: this graph doesn't attach '${e.name}'. List it in the pass's \`requiredOutputs\`, so the view attaches it. A custom graph builder forwards \`options.passes\` to createDefaultGraph3D, or gives the output to its RenderGraph's \`sceneOutputs\` option.`);return t.color}hasSceneOutput(e){let t=this._sceneOutputsByName.get(e.name);return void 0!==t&&(0,t1.e)(t.output,e)}importColor(e){return this._importResource("color",e)}importDepth(e){return this._importResource("depth",e)}createColor(e={}){let t=e.format??this._sceneColorOptions?.format;return this._createTransient("color",this._describe("color",{...e,format:t}))}createDepth(e={}){return this._createTransient("depth",this._describe("depth",e))}_cameraTarget(e){if(!e.renderTexture)throw Error("RenderGraph._cameraTarget: this camera has no renderTexture.");let t=this._cameraTargets.get(e);if(t)return t;let r={width:0,height:0,format:this._cameraTargetFormat(e),label:"cameraTarget"},i={width:0,height:0,format:t7,label:"cameraTargetDepth"},s=t=>{let{frame:r,source:i}=e.renderTexture;return t.width=Math.max(1,Math.round(r.width*i.resolution)),t.height=Math.max(1,Math.round(r.height*i.resolution)),t};return t={color:this._createTransient("color",()=>(r.format=this._cameraTargetFormat(e),r.antialias=e.renderTexture.source.antialias,s(r))),depth:this._createTransient("depth",()=>(i.antialias=e.renderTexture.source.antialias,s(i))),texture:this._importResource("color",()=>e.renderTexture),draw:null},this._cameraTargetColors.add(t.color._id),this._cameraTargets.set(e,t),t}_cameraTargetFormat(e){return this.sceneIsLinear?this._sceneColorOptions.format:e.renderTexture.source.format}_drawTarget(e,t){let r=e?.renderTexture?this._cameraTarget(e):null,i=this._resources[(r?.color??this.sceneColor)._id],s=this._resources[(r?.depth??this.sceneDepth)._id],a=this._liveSource(i,t),o=this._liveSource(s,t),n=r?r.draw:this._sceneDrawTarget;if(null===n||n.colorSource!==a||n.depthSource!==o){a&&(ri[0].texture=a),o&&(rs.texture=o),rr.colors=a?ri:void 0,rr.depth=o?rs:void 0;let e=this._renderTargetCache.get(rr);ri[0].texture=m.gPd.EMPTY.source,rs.texture=m.gPd.EMPTY.source,null===n?(n={target:e,viewport:new m.M_G,colorSource:a,depthSource:o},r?r.draw=n:this._sceneDrawTarget=n):(n.target=e,n.colorSource=a,n.depthSource=o)}let l=("transient"===i.kind?i.texture:null)??("transient"===s.kind?s.texture:null);return l?ro(l.frame,l.source.resolution,n.viewport):n.viewport.copyFrom(t.viewport),n}get passes(){let e=[];for(let t=0;t<this._passes.length;t++)e.push(this._passes[t].pass);return e}setViewportUvScale(e,t,r){let i=m.Wny.getOptimalSize(e,t);r.x=e/i.width,r.y=t/i.height}sceneViewport(e,t){let r=this._sceneColorOptions;return r?(t.x=0,t.y=0,this._contentSize(r,this.resolution,e,t)):t.copyFrom(e.viewport)}_contentSize(e,t,r,i){let s=r.defaultTarget.colorTexture.source.resolution,a=e.width??r.viewport.width/s,o=e.height??r.viewport.height/s;return i.width=Math.max(1,Math.round(a*t)),i.height=Math.max(1,Math.round(o*t)),i}_describe(e,t){let r="depth"===e,i=t.scaleMode??(r?"nearest":void 0),s={width:0,height:0,format:t7,autoGenerateMipmaps:t.autoGenerateMipmaps??!1,label:t.label??(r?"depthTransient":"colorTransient")};return i&&(s.scaleMode=i),t.antialias&&(s.antialias=!0),e=>{let i="number"==typeof t.resolution?t.resolution:this.resolution;return this._contentSize(t,i,e,s),s.format=t.format??(r?t7:e.defaultTarget.colorTexture.source.format??"bgra8unorm"),s}}addPass(e){let t={accesses:[],hasSideEffect:!1};this._passes.push({pass:e,record:t,dependsOn:[],isAnchored:!1,attachments:null,colorHandles:[],depthHandle:null,sampleAccesses:[],lastSampleSourceUids:[],cachedTarget:null,candidateTick:0,neededTick:0,copyCameras:[],finishedColors:[],depthResolves:[],resolvesColor:!1}),this._builder._beginPass(t,e.camera);try{e.setup(this._builder)}finally{this._builder._endPass()}return e}compile(){this._limitsChecked=!1;for(let e=0;e<this._passes.length;e++){let t=this._passes[e];t.dependsOn.length=0,t.isAnchored=t.record.hasSideEffect,t.attachments=null,t.colorHandles.length=0,t.depthHandle=null,t.sampleAccesses.length=0,t.lastSampleSourceUids.length=0,t.cachedTarget=null}let e=Object.create(null),t=Object.create(null);for(let r=0;r<this._passes.length;r++){let i=this._passes[r],s=i.record.accesses,a=!1,o=!1;for(let r=0;r<s.length;r++){let n=s[r],l=n.handle._id;if("write_attachment"===n.mode||"produce"===n.mode){let t=e[l]??(e[l]=[]),r=t[t.length-1];r&&r!==i&&!i.dependsOn.includes(r)&&i.dependsOn.push(r),t.push(i),("imported"===this._resources[l].kind||this._cameraTargetColors.has(l))&&(i.isAnchored=!0)}else{for(let e=0;e<s.length;e++){let t=s[e];if(e!==r&&("write_attachment"===t.mode||"produce"===t.mode)&&t.handle._id===l)throw Error(`RenderGraph.compile: pass "${i.pass.name}" both writes and reads (mode=${n.mode}) the same resource (id ${l}). A texture can only be one of (writable attachment) or (sampled / read-only) within a single pass.`)}let t=e[l];if(t)for(let e=0;e<t.length;e++){let r=t[e];r===i||i.dependsOn.includes(r)||i.dependsOn.push(r)}"sample"===n.mode&&(i.sampleAccesses.push(n),i.lastSampleSourceUids.push(-1),"depth"===n.handle._kind&&"transient"===this._resources[l].kind&&this._ensureDepthResolve(n.handle))}if("write_attachment"===n.mode)a=!0,"color"===n.handle._kind?i.colorHandles.push(n.handle):i.depthHandle=n.handle;else{if("read_attachment"!==n.mode)continue;a=!0,i.depthHandle=n.handle,o=!0}"transient"===this._resources[l].kind&&(t[l]??=i)}if(!a)continue;let n={};if(i.colorHandles.length>0){let e=[];for(let t=0;t<i.colorHandles.length;t++)e.push({texture:m.gPd.EMPTY.source});n.colors=e}null!==i.depthHandle&&(n.depth={texture:m.gPd.EMPTY.source},o&&(n.depthReadOnly=!0)),i.attachments=n}let r=this.globalTextureBindings.opaqueDepth.group;for(let e=0;e<this._passes.length;e++){let i=this._passes[e];for(let e=0;e<i.sampleAccesses.length;e++){let s=i.sampleAccesses[e],a=t[s.handle._id];if(s.binding.group===r&&a)throw Error(`RenderGraph.compile: pass "${i.pass.name}" samples resource ${s.handle._id} through the view's global bind group, and pass "${a.pass.name}" attaches it. The global group stays bound while every pass draws, so a texture it holds cannot also be a render target. Sample it through a bind group the pass owns.`)}}}run(e){this.resolve(e),this.prepareCameras(e),this.execute(e)}resolve(e){this._activePasses.length=0,this._limitsChecked||this._assertAttachmentLimits(e);let t=++this._resolveTick,r=this._resolveCandidates;r.length=0;for(let i=0;i<this._passes.length;i++){let s=this._passes[i];(s.pass.condition?.(e)??!0)&&(s.candidateTick=t,r.push(s))}if(0===r.length)return;let i=this._resolveStack;i.length=0;for(let e=0;e<r.length;e++){let s=r[e];s.isAnchored&&(s.neededTick=t,i.push(s))}for(;i.length>0;){let e=i.pop().dependsOn;for(let r=0;r<e.length;r++){let s=e[r];s.candidateTick===t&&s.neededTick!==t&&(s.neededTick=t,i.push(s))}}for(let e=0;e<this._passes.length;e++){let r=this._passes[e];r.neededTick===t&&this._activePasses.push(r)}let s=this._activePasses.length;for(;this._acquireAt.length<s;)this._acquireAt.push([]),this._releaseAt.push([]);for(let e=0;e<s;e++)this._acquireAt[e].length=0,this._releaseAt[e].length=0,this._activePasses[e].copyCameras.length=0,this._activePasses[e].finishedColors.length=0,this._activePasses[e].depthResolves.length=0,this._activePasses[e].resolvesColor=!1;let a=this._resources.length;this._firstUseByResId.length<a&&(this._firstUseByResId=new Int32Array(a),this._lastUseByResId=new Int32Array(a),this._firstWriterByResId=new Int32Array(a),this._lastWriterByResId=new Int32Array(a),this._lastWrittenHandleByResId.length=a,this._depthResolvedAtByResId=new Int32Array(a));let o=this._firstUseByResId,n=this._lastUseByResId,l=this._firstWriterByResId,h=this._lastWriterByResId,u=this._lastWrittenHandleByResId,d=this._depthResolvedAtByResId;o.fill(-1,0,a),n.fill(-1,0,a),l.fill(-1,0,a),h.fill(-1,0,a),d.fill(-1,0,a);for(let t=0;t<s;t++){let r=this._activePasses[t].record.accesses;for(let i=0;i<r.length;i++){let s=r[i],a=s.handle._id,c=this._resources[a];if("transient"===c.kind&&(-1===o[a]&&(o[a]=t),n[a]=t),"write_attachment"===s.mode||"produce"===s.mode)-1===l[a]&&(l[a]=t),h[a]=t,"color"===c.type&&(u[a]=s.handle);else if("sample"===s.mode&&"depth"===s.handle._kind&&"transient"===c.kind&&-1!==h[a]&&c.describe(e).antialias){let e=h[a],r=this._depthResolveByResId[a]._id;d[a]!==e&&(d[a]=e,this._activePasses[e].depthResolves.push(s.handle),-1===o[r]&&(o[r]=e)),n[r]=t}else"sample"===s.mode&&"color"===s.handle._kind&&"transient"===c.kind&&-1!==h[a]&&!this._activePasses[h[a]].resolvesColor&&c.describe(e).antialias&&(this._activePasses[h[a]].resolvesColor=!0)}}for(let e=0;e<a;e++){let t=o[e];-1!==t&&(this._acquireAt[t].push(e),this._releaseAt[n[e]].push(e));let r=h[e];-1!==r&&"color"===this._resources[e].type&&this._activePasses[r].finishedColors.push(u[e])}let c=this._camerasSeen;c.clear();for(let e=s-1;e>=0;e--){let t=this._activePasses[e],r=t.pass.camera;if(!r?.renderTexture||c.has(r))continue;let i=this._cameraTarget(r);h[i.color._id]===e&&(c.add(r),t.copyCameras.push(r),t.finishedColors.push(i.texture))}}prepareCameras(e){(0,t5.vY)(e.view3d.camera,e);for(let t=0;t<this._activePasses.length;t++){let r=this._activePasses[t].pass.camera;r&&((0,t5.DM)(r,e),(0,t5.vY)(r,e))}}execute(e){this._maybeResetRenderTargetCache(e),this._prepareDefaultTarget(e);let t=e.renderer,r=t.renderPipes.view3d,i=this._savedBind=t.renderTarget.getBindState(this._savedBind),s=i.target,a=!!i.flipY,o=this._bindOptions,n=t.renderTarget.isFrontFaceInverted(e.defaultTarget,a),l=n!==(t.type===m.W3c.WEBGL);e.defaultFrontFaceInverted=n;for(let t=0;t<this._activePasses.length;t++)this._activePasses[t].pass.prepare?.(e);for(let i=0;i<this._activePasses.length;i++){let n=this._activePasses[i],{pass:h}=n,u=this._acquireAt[i];for(let t=0;t<u.length;t++){let r=this._resources[u[t]],i=r.describe(e),s=m.Wny.getOptimalTexture(i);i.label&&(s.source.label=i.label),r.texture=s}let{target:d,flipY:c,frame:f}=this._resolveTarget(n,i,e,l,a);if(d===e.defaultTarget)e.activeTarget!==d&&(o.target=s,o.clear=m.uJ3.NONE,o.frame=(0,t2.c)(e.view3d.camera).frame,o.flipY=a,t.renderTarget.bind(o),e.activeTarget=d,e.activeViewport=e.viewport);else if(null!==d&&d!==e.activeTarget){let r=this._resolveClear(n,i);o.target=d,o.clear=r,o.frame=f??void 0,o.flipY=c,t.renderTarget.bind(o),(r&m.uJ3.DEPTH)!=0&&null!==n.depthHandle&&n.depthHandle._id===this.sceneDepth._id&&(e.needsDepthClear=!1),e.activeTarget=d,f&&(e.activeViewport=ro(f,(d.colorTexture?.source??d.depthStencilTexture.source).resolution,re))}let p=n.sampleAccesses,_=n.lastSampleSourceUids;for(let r=0;r<p.length;r++){let i=p[r],s=i.binding,a=i.handle;"depth"===a._kind&&-1!==this._depthResolvedAtByResId[a._id]&&(a=this._depthResolveByResId[a._id]);let o=this._bindResource(a,e);s.group.setResource(o,s.slot),void 0!==s.styleSlot&&s.group.setResource(o.style,s.styleSlot);let n=o?.source?.uid??o?.uid??-1;if(n!==_[r]&&(_[r]=n,t.type===m.W3c.WEBGPU&&void 0!==h.bit)){let t=e.view3d._meshBatches;for(let e=0;e<t.length;e++){let r=t[e].drawLists[h.bit];r&&r.gpuData.bundleDirtyId++}}}let g=null!==d&&h.camera&&h.camera!==e.view3d.camera?h.camera:null,x=g&&(0,t4.d)(g,e,e.activeViewport,this.resolution);if(null===g)h.render(e);else if(x){let t=e.activeViewport;r.setViewport(x),e.activeViewport=x,h.render(e),e.activeViewport=t,r.setViewport(t)}let y=n.depthResolves;for(let t=0;t<y.length;t++)this._resolveDepth(n,y[t],d,r,e);let v=y.length>0;!v&&n.resolvesColor&&(r.resolveColor(),v=!0);let b=n.copyCameras;for(let t=0;t<b.length;t++){let i=b[t],s=i.renderTexture,a=this._drawTarget(i,e),o=s.source.format;this._cameraTargetFormat(i)===o?r.copyColor(a,s,e):(!v&&a.target.colorTexture.source.antialias&&(r.resolveColor(),v=!0),r.outputColor(a,s,e,(0,t3.P)(o)?null:e.view3d.toneMapping))}let w=n.finishedColors;for(let t=0;t<w.length;t++){let i=w[t],s=this.getTexture(i,e).source;v||!s.antialias||"transient"!==this._resources[i._id].kind||this._cameraTargetColors.has(i._id)||(r.resolveColor(),v=!0),s.autoGenerateMipmaps&&r.generateMips(i,e)}let T=this._releaseAt[i];for(let e=0;e<T.length;e++){let t=this._resources[T[e]];m.Wny.returnTexture(t.texture),t.texture=null}}t.renderTarget.bind(i),e.activeTarget=null,o.target=null,o.frame=void 0}unload(){if(!this._destroyed)for(let e=0;e<this._passes.length;e++)this._passes[e].pass.unload?.()}destroy(){if(!this._destroyed){this._destroyed=!0,this._releaseTransients();for(let e=0;e<this._passes.length;e++)this._passes[e].pass.destroy?.();this._renderTargetCache.destroy();for(let e=0;e<this._resources.length;e++){let t=this._resources[e];t.cachedTexture&&(t.cachedTexture.destroy(!1),t.cachedTexture=null),t.cachedDepthView&&(t.cachedDepthView.destroy(),t.cachedDepthView=null,t.cachedDepthViewSource=null)}this._resources=null,this._passes=null,this._activePasses=null,this._cameraTargets=null,this._cameraTargetColors=null,this._sceneDrawTarget=null}}_bindResource(e,t){let r=this.getTexture(e,t).source;if("depth"!==e._kind)return r;let i=this._resources[e._id];return i.cachedDepthViewSource!==r&&(i.cachedDepthView?.destroy(),i.cachedDepthView=new m.Xrb(r,{aspect:"depth-only"}),i.cachedDepthViewSource=r),i.cachedDepthView}getTexture(e,t){let r=this._resources[e._id];if("transient"===r.kind){if(null===r.texture)throw Error(`RenderGraph.getTexture: '${r.describe(t).label}' isn't alive here. A graph texture only exists inside the render of a pass that declared it, with b.read, b.sample or a write, so resolve it there and use it before render returns.`);return r.texture}let i=r.getter(t);if(i instanceof m.gPd)return i;let s=i.source;return r.cachedTexture&&r.cachedTexture.source===s||(r.cachedTexture?.destroy(!1),r.cachedTexture=new m.gPd({source:s})),r.cachedTexture}_assertAttachmentLimits(e){let t=e.renderer;for(let r=0;r<this._passes.length;r++){let i=this._passes[r];if(i.colorHandles.length<2)continue;let s=[];for(let t=0;t<i.colorHandles.length;t++){let r=this._resources[i.colorHandles[t]._id];s.push("transient"===r.kind?r.describe(e):r.getter(e).source)}!function(e,t,r){let i,s=1/0;if(r.type===m.W3c.WEBGPU){let e=r.gpu.device.limits;i=e.maxColorAttachments,s=e.maxColorAttachmentBytesPerSample}else{let e=r.gl;i=Math.min(e.getParameter(e.MAX_DRAW_BUFFERS),e.getParameter(e.MAX_COLOR_ATTACHMENTS))}if(t.length>i)throw Error(`RenderGraph: pass "${e}" attaches ${t.length} colour textures, over this GPU's limit of ${i}: ${t.map((e,t)=>e.label??`attachment ${t}`).join(", ")}. Each scene output adds one to the scene passes, so list fewer.`);let a=0;for(let e=0;e<t.length;e++){let r=t6[t[e].format];r&&(a=Math.ceil(a/r[1])*r[1]+r[0])}if(a>s){let r=t.map((e,t)=>{let{label:r,format:i}=e;return`${r??`attachment ${t}`} (${i}, ${t6[i]?.[0]??"?"} bytes)`});throw Error(`RenderGraph: pass "${e}" needs ${a} bytes per pixel for its colour textures, over WebGPU's limit of ${s}: ${r.join(", ")}. Give scene outputs smaller formats or list fewer. rgba8unorm counts 8 bytes, the same as rgba16float; rg16float counts 4, rg8unorm 2 and r8unorm 1.`)}}(i.pass.name,s,t)}this._limitsChecked=!0}_attachmentSource(e,t){if("imported"===e.kind)return e.getter(t).source;if(null===e.texture)throw Error("RenderGraph._resolveTarget: a transient attachment has not been allocated");return e.texture.source}_liveSource(e,t){return"transient"===e.kind&&null===e.texture?null:this._attachmentSource(e,t)}_importResource(e,t){let r=this._resources.length;return this._resources.push({kind:"imported",type:e,getter:t,cachedTexture:null,cachedDepthView:null,cachedDepthViewSource:null}),{_kind:e,_id:r}}_ensureDepthResolve(e){let t=e._id;if(this._depthResolveByResId[t])return;let r=this._resources[t],i={width:0,height:0,format:t7,scaleMode:"nearest"};this._depthResolveByResId[t]=this._createTransient("depth",e=>{let t=r.describe(e);return i.width=t.width,i.height=t.height,i.format=t.format,i.label??=`${t.label??"depthTransient"}Resolve`,i})}_resolveDepth(e,t,r,i,s){if(null===r||null===e.depthHandle||e.depthHandle._id!==t._id)throw Error(`RenderGraph: pass "${e.pass.name}" is the last writer of a multisampled depth before a pass samples it, but doesn't attach it; a multisampled depth is resolved from the target that drew it.`);let{frame:a,source:o}=this.getTexture(t,s),n=this.getTexture(this._depthResolveByResId[t._id],s);ra.target=r,ro(a,o.resolution,ra.viewport),i.copyDepth(ra,n,s),ra.target=null}_createTransient(e,t){let r=this._resources.length;return this._resources.push({kind:"transient",type:e,describe:t,texture:null,cachedTexture:null,cachedDepthView:null,cachedDepthViewSource:null}),{_kind:e,_id:r}}_resolveTarget(e,t,r,i,s){let a=e.attachments;if(null===a)return rt.target=null,rt.flipY=s,rt.frame=null,rt;let o=e.colorHandles,n=!1,l=null,h=s;if(a.colors)for(let e=0;e<o.length;e++){let t=o[e]._id,u=this._resources[t],d=this._attachmentSource(u,r);null===l&&"transient"===u.kind&&(l=u.texture.frame,h=this._cameraTargetColors.has(t)?s:i),a.colors[e].texture!==d&&(a.colors[e].texture=d,n=!0)}if(null!==e.depthHandle){let t=this._resources[e.depthHandle._id],s=this._attachmentSource(t,r);null===l&&"transient"===t.kind&&(l=t.texture.frame,h=i),a.depth.texture!==s&&(a.depth.texture=s,n=!0)}return rt.flipY=h,(n||null===e.cachedTarget)&&(e.cachedTarget=this._renderTargetCache.get(a)),rt.target=e.cachedTarget,a.colors&&rt.target!==r.defaultTarget&&this._setColorAttachments(rt.target,e,t),rt.frame=l,rt}_inputClamp(e,t,r){if("transient"!==this._resources[e._id].kind)throw Error(`RenderGraph._inputClamp: resource ${e._id} is imported, not a transient`);let{frame:i,source:s}=this.getTexture(e,t),a=.5/s.pixelWidth,o=.5/s.pixelHeight;r[0]=a,r[1]=o,r[2]=i.width/s.pixelWidth-a,r[3]=i.height/s.pixelHeight-o}_invalidatePerPassTargets(){for(let e=0;e<this._passes.length;e++)this._passes[e].cachedTarget=null;for(let e of this._cameraTargets.values())e.draw=null;this._sceneDrawTarget=null}_prepareDefaultTarget(e){e.defaultTarget.ensureDepthStencilTexture();let t=e.defaultTarget.colorTexture.source,r=e.defaultTarget.depthStencilTexture.source,i=this._defaultCacheKey;(i.colors[0].texture!==t||i.depth.texture!==r)&&(i.colors[0].texture=t,i.depth.texture=r,this._renderTargetCache.addToCache(i,e.defaultTarget),this._renderTargetCache.addToCache(this._defaultCacheKeyReadOnlyDepth,e.defaultTarget))}_setColorAttachments(e,t,r){let i=e.colorAttachments,s=i.length>1;for(let e=0;e<i.length;e++){let a=i[e],o=t.colorHandles[e]._id,n=this._clearValueById[o];if(a.clearValue!==n&&(a.clearValue=n),s){let e=this._effectiveLoadOp(o,r);a.loadOp!==e&&(a.loadOp=e)}}}_resolveClear(e,t){let r=e.record.accesses,i=!1,s=!1;for(let e=0;e<r.length;e++){let a=r[e];"write_attachment"===a.mode&&"clear"===this._effectiveLoadOp(a.handle._id,t)&&("color"===a.handle._kind?i=!0:"depth"===a.handle._kind&&(s=!0))}return i&&s?m.uJ3.ALL:i?m.uJ3.COLOR:s?m.uJ3.DEPTH:m.uJ3.NONE}_effectiveLoadOp(e,t){return this._firstWriterByResId[e]!==t?"load":"transient"===this._resources[e].kind||e===this.defaultDepth._id?"clear":"load"}_maybeResetRenderTargetCache(e){let t=e.defaultTarget.colorTexture.source,r=e.defaultTarget.depthStencilTexture?.source,i=t.uid,s=r?r.uid:-1,a=-1!==this._lastColorUid&&i!==this._lastColorUid,o=-1!==this._lastDepthUid&&s!==this._lastDepthUid,n=-1!==this._lastWidth&&(t.pixelWidth!==this._lastWidth||t.pixelHeight!==this._lastHeight);(a||o||n)&&(this._renderTargetCache.reset(),this._invalidatePerPassTargets(),this._defaultCacheKey.colors[0].texture=m.gPd.EMPTY.source,this._defaultCacheKey.depth.texture=m.gPd.EMPTY.source),this._lastColorUid=i,this._lastDepthUid=s,this._lastWidth=t.pixelWidth,this._lastHeight=t.pixelHeight}_releaseTransients(){for(let e=0;e<this._passes.length;e++){let t=this._passes[e].sampleAccesses;for(let e=0;e<t.length;e++){let r=t[e];if("transient"!==this._resources[r.handle._id].kind)continue;let i=r.binding,s="depth"===r.handle._kind?B.AZ:m.gPd.EMPTY.source;i.group.setResource(s,i.slot),void 0!==i.styleSlot&&i.group.setResource(m.gPd.EMPTY.source.style,i.styleSlot)}}}},rl=r(55447);let rh={name:"background",attributes:{aPosition:"float32x3"},interStage:{vDir:"vec3<f32>"},bindings:{background:{uCube:"texture_cube<f32>",uCubeSampler:"sampler"}}},ru={name:"backgroundGradient",attributes:{aPosition:"float32x3"},interStage:{vDir:"vec3<f32>"},bindings:{background:{uSkyColor:"vec3<f32>",uGroundColor:"vec3<f32>",uUp:"vec3<f32>"}}},rd=`#version 300 es

{{header}}

void main() {
  vDir = aPosition;

  mat4 view = uViewMatrix;
  view[3].xyz = vec3(0.0);

  vec4 clip = uProjectionMatrix * view * vec4(aPosition, 1.0);
  gl_Position = clip.xyww;
}
`,rc=`
@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  output.vDir = input.aPosition;

  var view = camera.uViewMatrix;
  view[3] = vec4<f32>(0.0, 0.0, 0.0, view[3].w);

  let clip = camera.uProjectionMatrix * view * vec4<f32>(input.aPosition, 1.0);
  output.position = vec4<f32>(clip.x, clip.y, clip.w, clip.w);

  return output;
}
`,rf={bindGroups:[{name:"global",ubo:!0},"camera","background"],gpu:`
{{header}}
${rc}
@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  let sample = textureSample(uCube, uCubeSampler, normalize(input.vDir));
  let sampleLinear = decodeToLinear(sample.rgb);
  var finalColor = sampleLinear * global.uExposure;
  {{fragmentEnd}}
  return vec4<f32>(finalColor, sample.a);
}
`,gl:{vertex:rd,fragment:`#version 300 es

{{header}}

out vec4 fragColor;

void main() {
  vec4 sampleColor = texture(uCube, normalize(vDir));
  vec3 sampleLinear = decodeToLinear(sampleColor.rgb);
  vec3 finalColor = sampleLinear * uExposure;
  {{end}}
  fragColor = vec4(finalColor, sampleColor.a);
}
`}},rp={bindGroups:[{name:"global",ubo:!0},"camera","background"],gpu:`
{{header}}
${rc}
@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  let t = dot(normalize(input.vDir), background.uUp) * 0.5 + 0.5;
  var finalColor = mix(background.uGroundColor, background.uSkyColor, t) * global.uExposure;
  {{fragmentEnd}}
  return vec4<f32>(finalColor, 1.0);
}
`,gl:{vertex:rd,fragment:`#version 300 es

{{header}}

out vec4 fragColor;

void main() {
  float t = dot(normalize(vDir), uUp) * 0.5 + 0.5;
  vec3 finalColor = mix(uGroundColor, uSkyColor, t) * uExposure;
  {{end}}
  fragColor = vec4(finalColor, 1.0);
}
`}};var rm=class extends y.A{_geometry;_state;_cubeBindGroup;_skyColor=new Float32Array(3);_groundColor=new Float32Array(3);_up=new Float32Array(3);_gradientUniforms;_gradientBindGroup;_shader=null;_cachedToneBit=null;_cachedBackgroundBit=null;_cachedDecodeBit=null;_destroyed=!1;constructor(e){let t,r,i;super({renderer:e.renderer,name:"background",description:"Draws the View3D cubemap, hemisphere or colour background behind scene geometry.",bit:y.J.BACKGROUND,camera:e.camera,attachedOutputs:e.attachedOutputs}),this._geometry=(t=[],(r=e=>{let r=[0,1,2,0,2,3];for(let i=0;i<r.length;i++){let s=e[r[i]];t.push(s[0],s[1],s[2])}})([[1,-1,-1],[1,-1,1],[1,1,1],[1,1,-1]]),r([[-1,-1,1],[-1,-1,-1],[-1,1,-1],[-1,1,1]]),r([[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]]),r([[-1,-1,1],[1,-1,1],[1,-1,-1],[-1,-1,-1]]),r([[-1,-1,1],[-1,1,1],[1,1,1],[1,-1,1]]),r([[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,-1]]),new m.V23({attributes:{aPosition:t}})),this._state=((i=new m.UwB).depthTest=!1,i.depthMask=!1,i.culling=!1,i.blend=!1,i),this._cubeBindGroup=new m.TX4({uCube:B.pC.source,uCubeSampler:B.pC.source.style}),this._gradientUniforms=new m.k2S({uSkyColor:{value:this._skyColor,type:"vec3<f32>"},uGroundColor:{value:this._groundColor,type:"vec3<f32>"},uUp:{value:this._up,type:"vec3<f32>"}}),this._gradientBindGroup=new m.TX4({background:this._gradientUniforms})}setup(e){this._writeTarget(e)}condition(e){return null!==e.view3d.background}render(e){let t,r,i,{view3d:s}=e,a=s.background;if(null===a)return;let o=null;a instanceof m.b4q?(t=rh,o=(0,t3.s)(!(0,t3.P)(a.source.format)),r=rf,this._cubeBindGroup.setResource(a.source,"uCube"),this._cubeBindGroup.setResource(a.source.style,"uCubeSampler"),i=this._cubeBindGroup):(t=ru,r=rp,"number"==typeof a?((0,T.Og)(this._skyColor,0,m.Q1f.shared.setValue(a)),this._groundColor.set(this._skyColor),this._up.fill(0)):(0,rl.G)(a,this._skyColor,this._groundColor,this._up),i=this._gradientBindGroup);let n=s._toneMappingBit;if(this._shader&&(this._cachedToneBit!==n||this._cachedBackgroundBit!==t||this._cachedDecodeBit!==o)&&(this._shader.destroy(),this._shader=null),!this._shader){let e=[t];o&&e.push(o),n&&e.push(n),this._shader=this.pipe.renderer.material3d.compilePassShader(e,r),this._cachedToneBit=n,this._cachedBackgroundBit=t,this._cachedDecodeBit=o,t===ru&&(this._cubeBindGroup.setResource(B.pC.source,"uCube"),this._cubeBindGroup.setResource(B.pC.source.style,"uCubeSampler"))}this._shader.groups[0]=e.globalBindGroup,this._shader.groups[1]=(0,t2.c)(this.camera??s.camera).bindGroup,this._shader.groups[2]=i,this.pipe.renderGeometry(this._geometry,this._shader,this._state)}unload(){this._gradientUniforms.buffer?.unload()}destroy(){this._destroyed||(this._destroyed=!0,this._shader?.destroy(),this._shader=null,this._geometry.destroy(!0),this._cubeBindGroup.destroy(),this._gradientBindGroup.destroy(),this._gradientUniforms.buffer?.destroy())}},r_=r(62762),rg=class extends y.A{_forward;cullResults=new r_.p;constructor(e){super(e),this._forward={bit:this.bit,bindsMaterial:!this.descriptor?.shaderDescriptor&&(this.bit&y.J.MATERIAL_PASS_MASK)!=0,cullResults:this.cullResults,camera:this.camera,sort:e.sort,cache:e.cache},this._updatesViewKey="key"===e.sort}setup(e){this._writeTarget(e)}condition(e){let t=e.view3d._meshBatches;for(let e=0;e<t.length;e++){let r=t[e].drawLists[this.bit];if(r&&r.view.count>0)return!0}return!1}prepare(e){this.pipe.prepareForward(this._forward,e)}render(e){this.pipe.renderForward(this._forward,e)}unload(){this.cullResults.unload()}destroy(){this.cullResults.release(),super.destroy()}},rx=class extends rg{opaqueColorHandle;opaqueDepthHandle;constructor(e){super({renderer:e.renderer,name:"blendedRefraction",description:"Draws distance-sorted refractive materials using opaque color and depth copies.",bit:y.J.BLENDED_REFRACTION,sort:"distance",camera:e.camera}),this.opaqueColorHandle=e.opaqueColorHandle,this.opaqueDepthHandle=e.opaqueDepthHandle}setup(e){e.writeColor(e.targetColor),e.readDepthAttachment(e.targetDepth),e.sample(this.opaqueColorHandle,e.globalTextureBindings.opaqueColor),e.sample(this.opaqueDepthHandle,e.globalTextureBindings.opaqueDepth)}},ry=class extends y.A{opaqueDepthHandle;constructor(e){super({renderer:e.renderer,name:"copyDepth",description:"Copies opaque depth into a texture for later screen-space sampling.",bit:y.J.NONE,camera:e.camera}),this.opaqueDepthHandle=e.opaqueDepthHandle}setup(e){e.read(e.targetDepth),e.produce(this.opaqueDepthHandle)}render(e){let t=e.view3d._graph;this.pipe.copyDepth(t._drawTarget(this.camera,e),t.getTexture(this.opaqueDepthHandle,e),e)}},rv=class extends y.A{opaqueColorHandle;_backBufferWarned=!1;constructor(e){super({renderer:e.renderer,name:"copyOpaque",description:"Copies opaque color for transmission and refraction passes to sample.",bit:y.J.NONE,camera:e.camera}),this.opaqueColorHandle=e.opaqueColorHandle}setup(e){e.read(e.targetColor),e.produce(this.opaqueColorHandle)}render(e){if(!this.camera&&!this._backBufferWarned){this._backBufferWarned=!0;let e=this.pipe.renderer;e.type!==m.W3c.WEBGL||e.backBuffer.useBackBuffer||(0,tg.m)(`pixijs-3d-copy-opaque-backbuffer-${e.uid}`,"[@pixi/3d] Glass is drawing with useBackBuffer off, so a View3D drawn straight to an opaque canvas refracts nothing. Pass useBackBuffer: true when you create the Application or renderer.")}let t=e.view3d._graph;this.pipe.copyColor(t._drawTarget(this.camera,e),t.getTexture(this.opaqueColorHandle,e),e)}},rb=class extends y.A{constructor(e){super({renderer:e.renderer,name:"depthClear",description:"Clears this View3D depth region before scene geometry renders.",bit:y.J.NONE,camera:e.camera,attachedOutputs:e.attachedOutputs})}setup(e){this._writeTarget(e)}render(e){if(!this.camera){if(!e.needsDepthClear)return;e.needsDepthClear=!1}this.pipe.clearDepth(e)}},rw=class extends rg{constructor(e){super({renderer:e.renderer,name:"opaque",description:"Draws opaque scene geometry into scene color and depth.",bit:y.J.OPAQUE,sort:"key",camera:e.camera,attachedOutputs:e.attachedOutputs})}},rT=class extends rg{opaqueColorHandle;constructor(e){super({renderer:e.renderer,name:"transmission",description:"Draws transmissive materials using the opaque scene color behind them.",bit:y.J.TRANSMISSION,sort:"key",camera:e.camera,attachedOutputs:e.attachedOutputs}),this.opaqueColorHandle=e.opaqueColorHandle}setup(e){super.setup(e),e.sample(this.opaqueColorHandle,e.globalTextureBindings.opaqueColor)}},rC=class extends rg{constructor(e){super({renderer:e.renderer,name:"transparent",description:"Draws distance-sorted transparent scene geometry after opaque and refractive content.",bit:y.J.TRANSPARENT,sort:"distance",camera:e.camera,attachedOutputs:e.attachedOutputs})}};let rS=new Set(["r8unorm","rg8unorm","rgba8unorm","rgba8unorm-srgb","bgra8unorm","rgb10a2unorm","r16float","rg16float","rgba16float","rg11b10ufloat"]);var rD=r(41741);let rM={name:"effectFxh",attributes:{aPosition:"float32x2"},interStage:{vUv:"vec2<f32>"},bindings:{fxh:{uFxClip:"vec4<f32>",uFxTexel:"vec4<f32>",uFxInputClamp:"vec4<f32>",uFxInput2Clamp:"vec4<f32>"}},gpu:{header:`
fn linearDepth(d: f32) -> f32 {
  let n = fxh.uFxClip.x;
  let f = fxh.uFxClip.y;
  let z = d * 2.0 - 1.0;
  return 2.0 * n * f / (f + n - z * (f - n));
}
fn texel() -> vec2<f32> {
  return fxh.uFxTexel.xy;
}
fn viewTexel() -> vec2<f32> {
  return fxh.uFxTexel.xy * fxh.uFxTexel.w;
}
fn fxInputUv(uv: vec2<f32>, clampRect: vec4<f32>) -> vec2<f32> {
  return clamp(uv * (clampRect.xy + clampRect.zw), clampRect.xy, clampRect.zw);
}
`},gl:{header:`
float linearDepth(float d) {
  float n = uFxClip.x;
  float f = uFxClip.y;
  float z = d * 2.0 - 1.0;
  return 2.0 * n * f / (f + n - z * (f - n));
}
vec2 texel() {
  return uFxTexel.xy;
}
vec2 viewTexel() {
  return uFxTexel.xy * uFxTexel.w;
}
vec2 fxInputUv(vec2 uv, vec4 clampRect) {
  return clamp(uv * (clampRect.xy + clampRect.zw), clampRect.xy, clampRect.zw);
}
`}},rB={name:"effectColorRead",bindings:{fx:{uTexture:"texture_2d<f32>",uTextureSampler:"sampler"}},gpu:{header:`
fn sampleColor(uv: vec2<f32>) -> vec4<f32> {
  return textureSampleLevel(uTexture, uTextureSampler, fxInputUv(uv, fxh.uFxInputClamp), 0.0);
}
fn sampleColorLod(uv: vec2<f32>, lod: f32) -> vec4<f32> {
  return textureSampleLevel(uTexture, uTextureSampler, fxInputUv(uv, fxh.uFxInputClamp), lod);
}
fn inputTexel() -> vec2<f32> {
  return 1.0 / (vec2<f32>(textureDimensions(uTexture, 0)) * (fxh.uFxInputClamp.xy + fxh.uFxInputClamp.zw));
}
`},gl:{header:`
vec4 sampleColor(vec2 uv) {
  return textureLod(uTexture, fxInputUv(uv, uFxInputClamp), 0.0);
}
vec4 sampleColorLod(vec2 uv, float lod) {
  return textureLod(uTexture, fxInputUv(uv, uFxInputClamp), lod);
}
vec2 inputTexel() {
  return 1.0 / (vec2(textureSize(uTexture, 0)) * (uFxInputClamp.xy + uFxInputClamp.zw));
}
`}},rI={name:"effectColor2Read",bindings:{fx:{uTexture2:"texture_2d<f32>",uTexture2Sampler:"sampler"}},gpu:{header:`
fn sampleColor2(uv: vec2<f32>) -> vec4<f32> {
  return textureSampleLevel(uTexture2, uTexture2Sampler, fxInputUv(uv, fxh.uFxInput2Clamp), 0.0);
}
`},gl:{header:`
vec4 sampleColor2(vec2 uv) {
  return textureLod(uTexture2, fxInputUv(uv, uFxInput2Clamp), 0.0);
}
`}},rP={name:"effectDepthRead",bindings:{fx:{uFxDepthTexture:"texture_depth_2d"}},gpu:{header:`
fn fxDepthContent() -> vec2<f32> {
  return round(camera.uViewportUVScale * vec2<f32>(textureDimensions(uFxDepthTexture, 0)));
}
fn depthTexel() -> vec2<f32> {
  return 1.0 / fxDepthContent();
}
fn sampleDepth(uv: vec2<f32>) -> f32 {
  let content = fxDepthContent();
  let coord = min(vec2<i32>(clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0)) * content), vec2<i32>(content) - 1);
  return textureLoad(uFxDepthTexture, coord, 0);
}
fn viewPos(uv: vec2<f32>) -> vec3<f32> {
  let lz = linearDepth(sampleDepth(uv));
  let ndc = uv * 2.0 - 1.0;
  return vec3<f32>(ndc.x * lz / fxh.uFxClip.z, ndc.y * lz / fxh.uFxClip.w, -lz);
}
`}},rA={name:"effectDepthRead",bindings:{fx:{uFxDepthTexture:"texture_2d<f32>"}},gl:{header:`
vec2 fxDepthContent() {
  return round(uViewportUVScale * vec2(textureSize(uFxDepthTexture, 0)));
}
vec2 depthTexel() {
  return 1.0 / fxDepthContent();
}
float sampleDepth(vec2 uv) {
  vec2 content = fxDepthContent();
  ivec2 coord = min(ivec2(clamp(uv, 0.0, 1.0) * content), ivec2(content) - 1);
  return texelFetch(uFxDepthTexture, coord, 0).r;
}
vec3 viewPos(vec2 uv) {
  float lz = linearDepth(sampleDepth(uv));
  vec2 ndc = uv * 2.0 - 1.0;
  return vec3(ndc.x * lz / uFxClip.z, ndc.y * lz / uFxClip.w, -lz);
}
`}},rF={bindGroups:[{name:"global",ubo:!0},"camera","fx","fxh"],gpu:`
{{header}}

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(input.aPosition, 0.0, 1.0);
  let uv = input.aPosition * 0.5 + 0.5;
  output.vUv = vec2<f32>(uv.x, mix(uv.y, 1.0 - uv.y, fxh.uFxTexel.z));
  return output;
}

@fragment
fn mainFragment(input: FragmentInput) -> @location(0) vec4<f32> {
  let fxColor = effect(input.vUv);
  var finalColor = fxColor.rgb;
  {{fragmentEnd}}
  return vec4<f32>(finalColor, fxColor.a);
}
`,gl:{vertex:`#version 300 es

{{header}}

void main() {
  vec2 uv = aPosition * 0.5 + 0.5;
  vUv = vec2(uv.x, mix(uv.y, 1.0 - uv.y, uFxTexel.z));
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,fragment:`#version 300 es

{{header}}

out vec4 fragColor;

void main() {
  vec4 fxColor = effect(vUv);
  vec3 finalColor = fxColor.rgb;
  {{end}}
  fragColor = vec4(finalColor, fxColor.a);
}
`}},rR={gpu:"fn effect(uv: vec2<f32>) -> vec4<f32> { return sampleColor(uv); }",gl:"vec4 effect(vec2 uv) { return sampleColor(uv); }"},rk=new WeakMap,rz=0,rV=[0,0,1,1];var rL=class extends y.A{_fragment;_uniforms;_reads;_writes;_extraBits;_isWebGL;_state;_fxBindGroup;_fxhBindGroup;_fxhUniforms;_colorBinding;_color2Binding;_depthBinding;_shader=null;_destroyed=!1;constructor(e){var t,r;let i,s;super({renderer:e.renderer,name:e.label??"fullscreen",bit:y.J.NONE}),this._fragment=e.fragment,this._uniforms=e.uniforms??null,this._reads=e.reads??{},this._writes=e.writes,this._extraBits=e.extraBits??[],this._isWebGL="gl"in e.renderer;let a=new m.UwB;a.depthTest=!1,a.depthMask=!1,a.culling=!1,a.blend=null===this._writes||void 0!==e.blendMode,null!==this._writes&&e.blendMode&&(a.blendMode=e.blendMode),this._state=a;let o=(t=this._uniforms,r=this._reads,i={},null!==t&&Object.keys(t.uniformStructures).length>0&&(i.fx=t),r.color&&(i.uTexture=m.gPd.WHITE.source,i.uTextureSampler=new m.nDV({scaleMode:"linear",addressMode:"clamp-to-edge"})),r.color2&&(i.uTexture2=m.gPd.WHITE.source,i.uTexture2Sampler=new m.nDV({scaleMode:"linear",addressMode:"clamp-to-edge"})),r.depth&&(i.uFxDepthTexture=B.AZ),{group:s=new m.TX4(i),color:r.color?{group:s,slot:"uTexture"}:null,color2:r.color2?{group:s,slot:"uTexture2"}:null,depth:r.depth?{group:s,slot:"uFxDepthTexture"}:null});this._fxBindGroup=o.group,this._colorBinding=o.color,this._color2Binding=o.color2,this._depthBinding=o.depth,this._fxhUniforms=new m.k2S({uFxClip:{value:new Float32Array(4),type:"vec4<f32>"},uFxTexel:{value:new Float32Array(4),type:"vec4<f32>"},uFxInputClamp:{value:new Float32Array(rV),type:"vec4<f32>"},uFxInput2Clamp:{value:new Float32Array(rV),type:"vec4<f32>"}}),this._fxhBindGroup=new m.TX4({fxh:this._fxhUniforms})}setup(e){this._reads.color&&e.sample(this._reads.color,this._colorBinding),this._reads.color2&&e.sample(this._reads.color2,this._color2Binding),this._reads.depth&&e.sample(this._reads.depth,this._depthBinding),this._writes?e.writeColor(this._writes):(e.writeColor(e.defaultColor),e.writeDepth(e.defaultDepth))}render(e){this._shader||this._compile(),this._updateHeaderUniforms(e),this._shader.groups[0]=e.globalBindGroup,this._shader.groups[1]=(0,t2.c)(e.view3d.camera).bindGroup,this._shader.groups[2]=this._fxBindGroup,this._shader.groups[3]=this._fxhBindGroup,this.pipe.renderGeometry((0,rD.A)(),this._shader,this._state)}_updateHeaderUniforms(e){let t=e.view3d.camera,r=(0,t2.c)(t).projection.elements,i=this._fxhUniforms.uniforms.uFxClip;i[0]=t.near,i[1]=t.far,i[2]=r[0],i[3]=this._isWebGL?r[5]:-r[5];let s=this._fxhUniforms.uniforms.uFxTexel;s[0]=1/e.activeViewport.width,s[1]=1/e.activeViewport.height;let a=e.renderer.renderTarget.isFrontFaceInverted();s[2]=!this._isWebGL^a!==e.defaultFrontFaceInverted,s[3]=e.activeViewport.width/e.viewport.width;let o=e.view3d._graph;this._reads.color&&o._inputClamp(this._reads.color,e,this._fxhUniforms.uniforms.uFxInputClamp),this._reads.color2&&o._inputClamp(this._reads.color2,e,this._fxhUniforms.uniforms.uFxInput2Clamp),this._fxhUniforms.update()}_compile(){let e=[rM];this._reads.color&&e.push(rB),this._reads.color2&&e.push(rI),this._reads.depth&&e.push(this._isWebGL?rA:rP),e.push(function(e,t){let r=rk.get(e);if(r)return r;let i=Object.create(null);if(t)for(let e in t.uniformStructures)i[e]=t.uniformStructures[e].type;return r={name:`effectFragment:${rz++}`,bindings:{fx:i},gpu:{header:e.gpu},gl:{header:e.gl}},rk.set(e,r),r}(this._fragment,this._uniforms),...this._extraBits),this._shader=this.pipe.renderer.material3d.compilePassShader(e,rF)}destroy(){this._destroyed||(this._destroyed=!0,this._shader?.destroy(),this._shader=null,this._fxBindGroup.destroy(),this._fxhBindGroup.destroy())}},rO=class extends rL{constructor(e){super({renderer:e.renderer,label:"output",fragment:rR,reads:{color:e.source},writes:e.writes??null,extraBits:(0,tI.w)(e.toneMapping)})}},rN=class{enabled;requiredOutputs;constructor(e={}){this.enabled=e.enabled??!0}destroy(){}};let rE=/\b(?:sampleDepth|viewPos|depthTexel)\s*\(/;var rG=class extends rN{stage;inputMips=!1;fragment;uniforms=null;constructor(e={}){super(e),this.stage=e.stage??"beforeToneMapping"}writeLane(e,t,r,i){e.uniforms[t][r]=i,e.update()}build(e,t){let r=this.fragment;if(!r)throw Error(`${this.constructor.name}: provide a \`fragment\` or override \`build()\`.`);let i=rE.test(r.gpu)||rE.test(r.gl);e.addPass(new rL({renderer:t.renderer,label:this.constructor.name,fragment:r,uniforms:this.uniforms,reads:{color:t.input,depth:i?e.sceneDepth:void 0},writes:t.output}))}};let rU=new u.a,r$=new c.i;function rq(e,t,r){let{center:i,radius:s}=r$.setFromBox(t.getLocalBounds(rU)),a=e._tanHalfFovY(),o=Math.atan(a),n=(s>0?s:1)/Math.sin(Math.min(Math.atan(a*r),o));e.near=n/100,e.far=100*n,e.position.set(i.x,i.y,i.z+n)}var rH=class{items=[];count=0;_freeList=new Uint32Array(1024);_freeCount=0;_uidToIndex=new Map;add(e){let t;t=this._freeCount>0?this._freeList[--this._freeCount]:this.count++,this.items[t]=e,this._uidToIndex.set(e.uid,t)}remove(e){let t=this._uidToIndex.get(e.uid);if(void 0!==t){if(this.items[t]=null,this._uidToIndex.delete(e.uid),this._freeCount>=this._freeList.length){let e=new Uint32Array(2*this._freeList.length);e.set(this._freeList),this._freeList=e}this._freeList[this._freeCount++]=t}}getIndex(e){return this._uidToIndex.get(e.uid)??-1}};let rj={linear:tz,exponential:tk,exp2:tR},rW=new m.uqu,rK=new m.bRX,rX=new e_.k,rY=new e_.k,rJ=new el.P,rQ=new tL.R;var rZ=class e extends m.lZB{static defaultOptions={width:256,height:256,anchor:0,shadowQuality:"medium",shadowFilter:"pcf",toneMapping:"none",exposure:1,autoResize:!1};allowChildren=!1;renderPipeId="view3d";batched=!1;root;events;_camera;_anchor=new m.oA$({_onUpdate:()=>this.onViewUpdate()});_width=0;_height=0;autoResize;_frameOnResize=!1;_userOnRender=null;_onRender=e=>{this.autoResize&&this._resize(e.screen.width,e.screen.height),this._userOnRender?.(e)};get onRender(){return this._userOnRender}set onRender(e){this._userOnRender=e??null}lights=[];shadowQuality;_shadowFilter="pcf";exposure=1;_background=null;_toneMapping="none";_toneMappingBit=tI.X.none;_fog=null;_fogBit=null;_environment=null;_envBit=tA;_meshSlots=new rH;meshes=new f.v("_allMeshIndex");_skinnedMeshes=new f.v("_skinnedMeshIndex");_morphedMeshes=new f.v("_morphedMeshIndex");_sceneBatch=new tr({items:this._meshSlots.items});_meshBatches=[this._sceneBatch];_meshBatchesDirtyId=0;passByBit=Object.create(null);_dirtyHookBits=0;_graph;_passesInitialized=!1;_graphGlobalData=null;_buildGraph;_composite;_compositeRequested=!1;_passes=[];_passesEnabledKey=0;_lightDataList=new tB;_shadowDataList=new tV;_hasShadows=!1;_bonePit=new tC;_lastBonePitBufferVersion=0;_lastAtlasBufferVersion=0;_childrenToUpdate=Object.create(null);_renderablesToUpdate={list:[],index:0};_updateTick=0;constructor(t={}){super({});let{root:r,camera:i,width:s,height:a,anchor:o,shadowQuality:n,shadowFilter:l,environment:h,background:u,toneMapping:c,exposure:f,fog:p,cull:_,composite:g,resolution:x,graph:y,passes:v,parent:b,autoResize:w,...T}={...e.defaultOptions,...(0,m.S6_)(t)};this.events=new tX(this),this.shadowQuality=n,this._shadowFilter=l,this.environment=h??null,this.background=u??null,this._toneMapping=c,this.exposure=f,this._composite=g??!1,this.resolution=x??"inherit",this._buildGraph=y,v&&(this._passes=v.slice()),p&&(this.fog=p),this.anchor=o,this._width=s,this._height=a,this.autoResize=w,this.root=r??new d.B,this._attach(this.root),this._sceneBatch.cull=_??"gpu",this.camera=i??new ta,Object.assign(this,T),b?.addChild(this)}static from(t,r={}){let{scene:i,castShadow:s,receiveShadow:a,autoUpdate:o,autoPlay:n,materials:l,light:h,...u}=r,d=new t_({source:t,scene:i,castShadow:s,receiveShadow:a,autoUpdate:o,autoPlay:n,materials:l}),c=u.camera??d.cameras[0],f=new e({...u,root:d,camera:c});return c||(f.autoResize?f._frameOnResize=!0:rq(f.camera,d,f.width/f.height)),!1===h||f.lights.length||f.camera.addChild(new em),f}get camera(){return this._camera}set camera(e){if(this._camera!==e&&(this._camera=e,e._view3d!==this)){if(null!==e.parent)throw Error("Camera3D is parented under a Container3D that isn't in this View3D's scene graph. Add the camera (or its ancestor) to view3d.root first.");this.root.addChild(e)}}get anchor(){return this._anchor}set anchor(e){"number"==typeof e?this._anchor.set(e):this._anchor.copyFrom(e)}get width(){return this._width}set width(e){this.setSize(e,this._height)}get height(){return this._height}set height(e){this.setSize(this._width,e)}setSize(e,t){this.autoResize=!1,"object"==typeof e&&(t=e.height??e.width,e=e.width),this._resize(e,t??e)}_resize(e,t){(e!==this._width||t!==this._height)&&(this._width=e,this._height=t,this.onViewUpdate(),this._frameOnResize&&(this._frameOnResize=!1,rq(this._camera,this.root,e/t)))}getSize(e){return(e||={}).width=this._width,e.height=this._height,e}worldToScreen(e,t,r=!1){let i=this._camera;if(i.getGlobalTransform(rY,r),rY.getInverse(rY),rJ.copyFrom(e).applyAffineMatrix4(rY),"perspective"===i.mode&&rJ.z>=0)return null;let s=this._width,a=this._height,{x:o,y:n,width:l,height:h}=i.viewport,u=l*s,d=h*a;return u>0&&d>0?(i.computeProjection(u/d,rX),rJ.applyMatrix4(rX),rK.x=(o-this._anchor.x)*s+(.5*rJ.x+.5)*u,rK.y=(n-this._anchor.y)*a+(.5-.5*rJ.y)*d,this.getGlobalTransform(rW,r).apply(rK,t)):((0,tg.m)("View3D.worldToScreen:degenerate","View3D.worldToScreen: view size or camera viewport has zero area."),null)}screenToRay(e,t=new tL.R,r=!1){let i=this._camera,s=this._width,a=this._height,{x:o,y:n,width:l,height:h}=i.viewport,u=l*s,d=h*a;if(!(u>0)||!(d>0))return(0,tg.m)("View3D.screenToRay:degenerate","View3D.screenToRay: view size or camera viewport has zero area."),t.origin.set(0),t.direction.set(0),t;this.getGlobalTransform(rW,r).applyInverse(e,rK);let c=(rK.x-(o-this._anchor.x)*s)/u*2-1,f=1-(rK.y-(n-this._anchor.y)*a)/d*2;return i.computeProjection(u/d,rX),rX.getInverse(rX),rJ.set(c,f,-1).applyMatrix4(rX),i.getGlobalTransform(rY,r),"perspective"===i.mode?(rY.extractPosition(t.origin),rJ.applyAffineMatrix4(rY),t.direction.copyFrom(rJ).subtract(t.origin).normalize()):(rJ.z=0,rJ.applyAffineMatrix4(rY,t.origin),t.direction.set(0,0,-1).transformDirection(rY)),t}screenToWorld(e,t,r,i=!1){let s=this.screenToRay(e,rQ,i);return"number"==typeof t?s.at(t,r):s.intersectPlane(t,r)}get toneMapping(){return this._toneMapping}set toneMapping(e){if(this._toneMapping!==e){if(this._toneMapping=e,this._passesInitialized&&this._graph.sceneIsLinear)return void this._teardownGraph();this._toneMappingBit=tI.X[e],this._invalidateMaterialShaders()}}get cull(){return this._sceneBatch.cull}set cull(e){this._sceneBatch.cull=e}resolution;get shadowFilter(){return this._shadowFilter}set shadowFilter(e){this._shadowFilter!==e&&(this._shadowFilter=e,this._invalidateMaterialShaders())}get fog(){return this._fog}set fog(e){if(this._fog===e)return;this._fog=e;let t=e?rj[e.type??"linear"]:null;t!==this._fogBit&&(this._fogBit=t,this._invalidateMaterialShaders())}get passes(){return this._passes}set passes(e){this._passes=e?e.slice():[],this._passesInitialized&&this._teardownGraph()}_computePassesKey(){let e=0;for(let t=0;t<this._passes.length;t++)this._passes[t].enabled&&(e|=1<<(31&t));return e}_teardownGraph(){this._graph.unload();for(let e=0;e<this.lights.length;e++)this.lights[e].refreshShadows();this._graph.destroy(),this._passesInitialized=!1,this._graphGlobalData=null,this._invalidateMaterialShaders()}get environment(){return this._environment}set environment(e){if(this._environment===e)return;this._environment=e;let t=null===e?tA:e instanceof m.b4q?tP:tF;t!==this._envBit&&(this._envBit=t,this._invalidateMaterialShaders())}get background(){return this._background}set background(e){this._background=null===e||e instanceof m.b4q||"object"==typeof e&&"skyColor"in e?e:m.Q1f.shared.setValue(e).toNumber()}_syncShadowSampling(){if(this._hasShadows)return;let e=this.lights,t=0;for(let r=0;r<e.length;r++){let i=e[r];if(i._worldVisible&&"ambient"!==i.type){if(t>=32)return;if(t++,i.canCastShadow){this._hasShadows=!0,this._invalidateMaterialShaders();return}}}}_invalidateMaterialShaders(){let e=this.meshes.items;for(let t=0;t<e.length;t++)e[t]._markBatchDirty();for(let e=1;e<this._meshBatches.length;e++){let t=this._meshBatches[e],r=t.items;for(let e=0;e<r.length;e++)r[e]._batchDirty=!0;if(t._dirtyIndices){for(let e=0;e<r.length;e++)t._dirtyIndices[e]=e;t._dirtyCount=r.length}}}_onRenderableUpdate(e){let t=this._renderablesToUpdate;t.list[t.index++]=e}updateBounds(){let e=this._bounds,t=this._width,r=this._height,{x:i,y:s}=this._anchor;e.minX=-i*t,e.maxX=e.minX+t,e.minY=-s*r,e.maxY=e.minY+r}_attach(e,t=tY(e)){e._updateTick=-1,e._view3d=this,e===this.root?e._relativeSceneDepth=0:e._relativeSceneDepth=e.parent._relativeSceneDepth+1,e.didChange=!0,this._onChildUpdate(e);let r=e._eventMode,i="none"!==r&&e._interactiveChildren&&0!==t?"static"===r||"dynamic"===r?2:t:0,s=e.children;for(let e=0;e<s.length;e++)this._attach(s[e],i);e instanceof ti?(this._meshBatches.push(e.batch),this._meshBatchesDirtyId++):e instanceof D?(this._meshSlots.add(e),this.meshes.add(e),e.skeleton&&this._skinnedMeshes.add(e),e._morph&&this._morphedMeshes.add(e),e.geometry._meshes.add(e),e.material._meshes.add(e),e._markBatchDirty()):e instanceof ep&&this.lights.push(e),0!==t&&(e._isPickCandidate()||2===t&&"none"!==r&&e._hasPickVolume())&&this.events._addInteractive(e),null!==e._hitVolumeInput&&this.events._clipVolumeCount++}_detach(e){let t=e.children;for(let e=0;e<t.length;e++)this._detach(t[e]);if(e instanceof ti){let t=this._meshBatches.indexOf(e.batch);t>0&&(this._meshBatches.splice(t,1),this._meshBatchesDirtyId++)}else if(e instanceof D){let t=this._meshSlots.getIndex(e);this._sceneBatch.setPassesAt(t,0),this._meshSlots.remove(e),this.meshes.remove(e),this._sceneBatch.storeBuffer.remove(e),e.geometry._meshes.remove(e),e.material._meshes.remove(e),e.didRenderableUpdate=!1,e._lastWorldVisible=1,e._lastBonePitIndex=-1,e.skeleton&&this._skinnedMeshes.remove(e),e._morph&&(this._morphedMeshes.remove(e),e._morph._store?.freeSlot(e._morph))}else if(e instanceof ep){let t=this.lights.indexOf(e);t>-1&&this.lights.splice(t,1),e._releaseShadowState()}-1!==e._pickIndex?this.events._removeInteractive(e):this.events._clearPickState(e),null!==e._hitVolumeInput&&this.events._clipVolumeCount--,e._view3d=null}_onChildUpdate(e){let t=this._childrenToUpdate[e._relativeSceneDepth];t||(t=this._childrenToUpdate[e._relativeSceneDepth]={index:0,list:[]}),t.list[t.index++]=e}_invalidateDrawCaches(){for(let e=0;e<this._meshBatches.length;e++)this._meshBatches[e].invalidateDrawCaches()}_invalidateBundleCaches(){for(let e=0;e<this._meshBatches.length;e++)this._meshBatches[e].invalidateBundleCaches()}_releasePooledTextures(){this._passesInitialized&&(this._graph._releaseTransients(),this._invalidateBundleCaches())}addChild(){throw Error("View3D.addChild() is not available. Use view.root.addChild() instead.")}removeChild(){throw Error("View3D.removeChild() is not available. Use view.root.removeChild() instead.")}removeChildren(e,t){throw Error("View3D.removeChildren() is not available. Use view.root.removeChildren() instead.")}removeChildAt(e){throw Error("View3D.removeChildAt() is not available. Use view.root.removeChildAt() instead.")}getChildAt(e){throw Error("View3D.getChildAt() is not available. Use view.root.getChildAt() instead.")}setChildIndex(e,t){throw Error("View3D.setChildIndex() is not available. Use view.root.setChildIndex() instead.")}getChildIndex(e){throw Error("View3D.getChildIndex() is not available. Use view.root.getChildIndex() instead.")}addChildAt(e,t){throw Error("View3D.addChildAt() is not available. Use view.root.addChildAt() instead.")}swapChildren(e,t){throw Error("View3D.swapChildren() is not available. Use view.root.swapChildren() instead.")}reparentChild(){throw Error("View3D.reparentChild() is not available. Use view.root.reparentChild() instead.")}reparentChildAt(e,t){throw Error("View3D.reparentChildAt() is not available. Use view.root.reparentChildAt() instead.")}_ensureInitialized(e,t,r){let i="inherit"===this.resolution?r:this.resolution,s=this._composite||i!==r;if(this._passesInitialized){let e=this._passes.length>0&&this._passesEnabledKey!==this._computePassesKey(),t=s!==this._compositeRequested&&!(s&&this._graph.sceneColor!==this._graph.defaultColor);(e||t)&&this._teardownGraph()}if(this._passesInitialized){if(this._graphGlobalData!==t)throw Error("View3D: a view renders with one renderer; its render graph was built for another")}else{this._graphGlobalData=t;let r={composite:s,passes:this._passes,toneMapping:this._toneMapping,globalTextureBindings:t.globalTextureBindings};for(let t in this._graph=this._buildGraph?this._buildGraph(e,r):function(e,t){let r,i,s=t.passes?.filter(e=>e.enabled)??[],a=s.filter(e=>"beforeOpaque"===e.stage),o=s.filter(e=>"afterOpaque"===e.stage),n=s.filter(e=>"afterTransparent"===e.stage),l=s.filter(e=>"beforeToneMapping"===e.stage),h=s.filter(e=>"afterToneMapping"===e.stage);var u,d,c=e,f=l,p=h;for(let e of[...f,...p])if(!(e instanceof rG))throw Error(`${e.constructor.name}: the '${e.stage}' stage is reserved for PostEffect subclasses (extend PostEffect, or use a scene stage).`);f.length>0&&(0,t0.r)(c,`View3D, for the float scene that ${f[0].constructor.name} reads`);let _=l.length>0,g=t.toneMapping,x=_&&"custom"!==g?g:void 0,y=(0,tZ.j4)(t.passes??[],t.sceneOutputs),v=l.length+h.length,b=(t.composite??!1)||v>0||y.length>0,w=[...l,...x||b&&0===v?["outputPass"]:[],...h],T=w[0],C=T instanceof rG&&T.inputMips,S=e.view.antialias&&y.every(t=>{var r,i;return r=e,("rgba8unorm"!==(i=t.format)||r.type!==m.W3c.WEBGL)&&rS.has(i)}),D=new rn({globalTextureBindings:t.globalTextureBindings,defaultColor:e=>e.defaultTarget.colorTexture,defaultDepth:e=>e.defaultTarget.depthStencilTexture,sceneColor:b?{antialias:S,autoGenerateMipmaps:C,format:_?"rgba16float":void 0,label:"sceneColor"}:void 0,sceneDepth:b?{antialias:S,label:"sceneDepth"}:void 0,sceneOutputs:y}),M=D.createColor({autoGenerateMipmaps:!0,label:"opaqueColorCopy"}),B=D.createDepth({label:"opaqueDepthCopy"}),I={renderer:e,opaqueColor:M,opaqueDepth:B},P=(u=D,d=e,i=u.importDepth(()=>r.renderTarget.depthStencilTexture),r=d.renderPipes.view3d.createShadowPass({shadowMapHandle:i}),u.addPass(r),i);for(let e of a)e.build(D,I);for(let t of(D.addPass(new rb({renderer:e,attachedOutputs:y})),D.addPass(new rm({renderer:e,attachedOutputs:y})),D.addPass(new rw({renderer:e,attachedOutputs:y})),o))t.build(D,I);for(let t of(D.addPass(new ry({renderer:e,opaqueDepthHandle:B})),D.addPass(new rv({renderer:e,opaqueColorHandle:M})),D.addPass(new rT({renderer:e,opaqueColorHandle:M,attachedOutputs:y})),D.addPass(new rx({renderer:e,opaqueColorHandle:M,opaqueDepthHandle:B})),D.addPass(new rC({renderer:e,attachedOutputs:y})),n))t.build(D,I);let A=D.sceneColor;for(let t=0;t<w.length;t++){let r=w[t],i=w[t+1],s=void 0===i?null:D.createColor({autoGenerateMipmaps:"outputPass"!==i&&i.inputMips,format:x&&t>=l.length?"rgba8unorm":void 0,label:"effectChain"});"outputPass"===r?D.addPass(new rO({renderer:e,source:A,toneMapping:x,writes:s})):r.build(D,{...I,input:A,output:s}),s&&(A=s)}return D.compile(),{graph:D,handles:{opaqueColor:M,opaqueDepth:B,shadowMap:P}}}(e,r).graph,this._graph.compile(),this._toneMappingBit=this._graph.sceneIsLinear?null:tI.X[this._toneMapping],this._passesEnabledKey=this._computePassesKey(),this._compositeRequested=s,this.passByBit)delete this.passByBit[t];for(let e of(this._dirtyHookBits=0,this._graph.passes)){if(e.bit===y.J.NONE)continue;let t=this.passByBit[e.bit];if(e.camera){if(t)continue}else if(t&&!t.camera)throw Error(`Render pass "${e.name}" is used twice in this view; give the second one a camera.`);this.passByBit[e.bit]=e,this._dirtyHookBits|=e.bit}for(let e of this._graph.passes)if(e.bit!==y.J.NONE&&e.descriptor&&this.passByBit[e.bit]!==e)throw Error(`Render pass "${e.name}" has a descriptor, but another pass owns that name. Put the descriptor there, or give this pass its own name.`);this._passesInitialized=!0}this._graph.resolution=this._graph.sceneColor===this._graph.defaultColor?r:i}unload(){if(!this.destroyed){for(let e=0;e<this._meshBatches.length;e++)this._meshBatches[e].unload();for(let e=0;e<this.lights.length;e++){let t=this.lights[e];t._gpuShadowData&&(t._releaseShadowState(),t.refreshShadows())}this._bonePit.unload(),this._passesInitialized&&this._teardownGraph(),super.unload()}}destroy(e){if(this.destroyed)return;this.unload();let t=this.root;t instanceof D&&!t.destroyed&&(t.geometry._meshes.remove(t),t.material._meshes.remove(t),t.didRenderableUpdate=!1),(0,g.M)(e,"children")?this.root.destroy(e):(this.root.removeChildren(0,this.root.children.length),this.root._view3d=null),this._passesInitialized&&this._graph&&this._graph.destroy(),this._bonePit.destroy();let r=this._morphedMeshes.items;for(let e=0;e<r.length;e++){let t=r[e]._morph;t._store?.freeSlot(t)}this._sceneBatch.destroy(),this._meshSlots.items.length=0,this._meshSlots.count=0,this.meshes=null,this._skinnedMeshes=null,this._morphedMeshes=null,this._childrenToUpdate=null,this._renderablesToUpdate=null,this.events.destroy(),this.passByBit=null,this._dirtyHookBits=0,super.destroy(e),this.lights=null,this._meshBatches=null}};let r0=["right","left","top","bottom","front","back"],r1={extension:{type:m.AgS.LoadParser,name:"loadCubemap"},name:"loadCubemap",id:"cubemap",test:e=>(0,m.WOU)(e,".cubemap"),async load(e,t,r){let i=await (await fetch(e)).json(),s=e.substring(0,e.lastIndexOf("/")+1),a=Object.fromEntries(await Promise.all(r0.map(async e=>{let t=s+i[e];return[e,await r.load({src:t,parser:"texture"})]}))),o=m.AeT.basename(e,".cubemap");return m.b4q.from({faces:a,label:o})},async unload(e,t,r){let i=e.source.faces,s=r0.map(e=>i[e]._sourceOrigin);e.destroy(!0),await r.unload(s)}};async function r3(e,t){let s=e.bufferViews;if(!s)return;let a=await (!i&&(i=(async()=>{let{MeshoptDecoder:e}=await r.e("8613").then(r.bind(r,87044));await e.ready;let t=Math.max(1,Math.min((navigator.hardwareConcurrency??4)-1,4));return e.useWorkers(t),e})()),i);await Promise.all(s.map(async e=>{let r=e.extensions?.EXT_meshopt_compression??e.extensions?.KHR_meshopt_compression;if(!r)return;let i=new Uint8Array(t[r.buffer],r.byteOffset??0,r.byteLength),s=await a.decodeGltfBufferAsync(r.count,r.byteStride,i,r.mode,r.filter??"NONE"),o=t.length;t.push(s.buffer),e.buffer=o,e.byteOffset=0,e.byteLength=r.count*r.byteStride,delete e.extensions?.EXT_meshopt_compression,delete e.extensions?.KHR_meshopt_compression}))}async function r2(e,t){if(!(e.extensionsUsed?.includes("EXT_meshopt_compression")||e.extensionsUsed?.includes("KHR_meshopt_compression")))return;await r3(e,t);let r=e.bufferViews;if(!r){t.length=0;return}let i=new Map,s=[];for(let e=0;e<r.length;e++){let a=r[e].buffer;i.has(a)||(i.set(a,s.length),s.push(t[a]))}for(let e=0;e<r.length;e++)r[e].buffer=i.get(r[e].buffer);t.length=0;for(let e=0;e<s.length;e++)t.push(s[e])}var r4=class{label;tracks;duration=0;constructor(e){this.label=e.label,this.tracks=e.tracks||[],this.duration=e.duration??this._getDuration()}_getDuration(){let e=0;for(let t=0;t<this.tracks.length;t++){let r=this.tracks[t],i=r.times[r.times.length-1];i>e&&(e=i)}return e}},r5=class{label;times;values;interpolation;valueSize=0;constructor(e){this.label=e.label,this.times=e.times instanceof Float32Array?e.times:new Float32Array(e.times),this.values=e.values instanceof Float32Array?e.values:new Float32Array(e.values),this.interpolation=e.interpolation||"LINEAR",this.valueSize=e.valueSize??1}blendInto(e,t,r){let i=this.valueSize;for(let s=0;s<i;s++)e[s]+=(t[s]-e[s])*r}evaluate(e,t,r){let i=this.times,s=this.values,a=i.length,o=this.valueSize;if(e<=i[0]){if("CUBICSPLINE"===this.interpolation)for(let e=0;e<o;e++)r[e]=s[o+e];else for(let e=0;e<o;e++)r[e]=s[e];return 0}if(e>=i[a-1]){if("CUBICSPLINE"===this.interpolation){let e=(a-1)*3*o+o;for(let t=0;t<o;t++)r[t]=s[e+t]}else{let e=(a-1)*o;for(let t=0;t<o;t++)r[t]=s[e+t]}return a-2}for(i[t]>e&&(t=function(e,t,r){let i=0,s=r;for(;s-i>1;){let r=i+s>>1;e[r]<=t?i=r:s=r}return i}(i,e,t));t<a-1&&i[t+1]<=e;)t++;let n=t+1;if("STEP"===this.interpolation){let e=t*o;for(let t=0;t<o;t++)r[t]=s[e+t];return t}let l=i[t],h=i[n]-l,u=(e-l)/h;return this.interpolate(t,n,u,h,r),t}interpolate(e,t,r,i,s){let a=this.values,o=this.valueSize;if("CUBICSPLINE"===this.interpolation){let n=3*o,l=e*n,h=t*n,u=r*r,d=u*r,c=3*u-2*d,f=d-u,p=1-c,m=f-u+r;for(let e=0;e<o;e++){let t=a[l+o+e],r=a[l+2*o+e]*i,n=a[h+e]*i,u=a[h+o+e];s[e]=p*t+m*r+c*u+f*n}}else{let i=e*o,n=t*o;for(let e=0;e<o;e++){let t=a[i+e],o=a[n+e];s[e]=t+(o-t)*r}}}},r6=class extends r5{constructor(e){super({...e,valueSize:4})}blendInto(e,t,r){let i=e[0],s=e[1],a=e[2],o=e[3],n=t[0],l=t[1],h=t[2],u=t[3];i*n+s*l+a*h+o*u<0&&(n=-n,l=-l,h=-h,u=-u),e[0]=i+(n-i)*r,e[1]=s+(l-s)*r,e[2]=a+(h-a)*r,e[3]=o+(u-o)*r}interpolate(e,t,r,i,s){if("CUBICSPLINE"===this.interpolation){super.interpolate(e,t,r,i,s);let a=s[0],o=s[1],n=s[2],l=s[3],h=1/Math.sqrt(a*a+o*o+n*n+l*l);s[0]*=h,s[1]*=h,s[2]*=h,s[3]*=h}else eg.P.slerpFlat(s,0,this.values,4*e,this.values,4*t,r)}},r8=class extends r5{constructor(e){super({...e,valueSize:3})}blendInto(e,t,r){e[0]+=(t[0]-e[0])*r,e[1]+=(t[1]-e[1])*r,e[2]+=(t[2]-e[2])*r}interpolate(e,t,r,i,s){if("CUBICSPLINE"===this.interpolation)return void super.interpolate(e,t,r,i,s);let a=this.values,o=3*e,n=3*t,l=a[o],h=a[o+1],u=a[o+2];s[0]=l+(a[n]-l)*r,s[1]=h+(a[n+1]-h)*r,s[2]=u+(a[n+2]-u)*r}};let r9={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},r7={5126:{raw:"float32",normalized:"float32"},5120:{raw:"sint8",normalized:"snorm8"},5121:{raw:"uint8",normalized:"unorm8"},5122:{raw:"sint16",normalized:"snorm16"},5123:{raw:"uint16",normalized:"unorm16"}},ie={5120:1/127,5121:1/255,5122:1/32767,5123:1/65535},it={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ir={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4},ii={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};function is(e,t,r,i=!1){let s=e.accessors[r];if(s.sparse)return function(e,t,r){let i=e.accessors[r],s=i.sparse,a=it[i.componentType],o=ii[i.type],n=i.count*o,l=new a(n);if(void 0!==i.bufferView){let r=e.bufferViews[i.bufferView],s=(r.byteOffset??0)+(i.byteOffset??0);l.set(new a(t[r.buffer],s,n))}let h=e.bufferViews[s.indices.bufferView],u=new it[s.indices.componentType](t[h.buffer],(h.byteOffset??0)+(s.indices.byteOffset??0),s.count),d=e.bufferViews[s.values.bufferView],c=new a(t[d.buffer],(d.byteOffset??0)+(s.values.byteOffset??0),s.count*o);if(3===o)for(let e=0;e<s.count;e++){let t=3*u[e],r=3*e;l[t]=c[r],l[t+1]=c[r+1],l[t+2]=c[r+2]}else for(let e=0;e<s.count;e++){let t=u[e]*o,r=e*o;for(let e=0;e<o;e++)l[t+e]=c[r+e]}return l}(e,t,r);let a=e.bufferViews[s.bufferView],o=t[a.buffer],n=s.componentType,l=it[n],h=ii[s.type],u=(a.byteOffset??0)+(s.byteOffset??0),d=ir[n],c=h*d,f=a.byteStride??c,p=s.count;if(f===c){let e=new l(o,u,p*h);return i?e.slice():e}let m=new l(o),_=u/d,g=f/d,x=new l(p*h),y=0;for(let e=0;e<p;e++){let t=_+e*g;for(let e=0;e<h;e++)x[y++]=m[t+e]}return x}let ia={translation:r8,rotation:r6,scale:r8},io={translation:"position",rotation:"quaternion",scale:"scale",weights:"weights"};function il(e,t,r){let i=is(e,t,r);if(i instanceof Float32Array)return i;let s=e.accessors[r],a=new Float32Array(i.length);if(!0===s.normalized){let e=ie[s.componentType]??1;if(5120===s.componentType||5122===s.componentType)for(let t=0;t<i.length;t++){let r=i[t]*e;a[t]=r<-1?-1:r}else for(let t=0;t<i.length;t++)a[t]=i[t]*e}else a.set(i);return a}let ih=new Set;function iu(e,t,r){if(!t)return;let i=t.texCoord??0;if(0!==i){let t=`binding:${e}:${i}`;ih.has(t)||(ih.add(t),(0,m.R8M)(`[@pixi/3d] ${e} on material "${r}" uses texCoord=${i}; multi-UV-set support is not yet implemented and the texture will sample from UV0 (may apply to other materials in this asset).`))}let s=t.extensions?.KHR_texture_transform?.texCoord;if(void 0!==s&&s!==i){let t=`transform:${e}:${s}`;ih.has(t)||(ih.add(t),(0,m.R8M)(`[@pixi/3d] KHR_texture_transform on ${e} (material "${r}") overrides texCoord (binding=${i}, transform=${s}); per-binding texCoord overrides are not supported and the binding's texCoord will be used instead.`))}}function id(e){let[t,r]=e.offset??[0,0],[i,s]=e.scale??[1,1],a=e.rotation??0,o=Math.cos(a),n=Math.sin(a);return new m.uqu(i*o,i*n,-s*n,s*o,t,r)}function ic(e){return"BLEND"===e.alphaMode?"blend":"MASK"===e.alphaMode?"mask":"opaque"}function ip(e){return[(0,T.T5)(e[0]),(0,T.T5)(e[1]),(0,T.T5)(e[2])]}let im={directional:0,point:1,spot:2},i_={POSITION:"positions",NORMAL:"normals",TEXCOORD_0:"uvs",JOINTS_0:"joints",WEIGHTS_0:"weights",TANGENT:"tangents",COLOR_0:"colors",COLOR_1:"colors1"};function ig(e,t){if(3!==t)return e;let r=e.constructor,i=e.length/3,s=new r(4*i),a=e instanceof Float32Array?1:e instanceof Uint8Array?255:65535;for(let t=0;t<i;t++){let r=3*t,i=4*t;s[i]=e[r],s[i+1]=e[r+1],s[i+2]=e[r+2],s[i+3]=a}return s}let ix=0,iy={},iv={};function ib(e){for(let t in iv)iv[t](Error(`Draco worker: ${e}`)),delete iy[t],delete iv[t];a?.terminate(),a=void 0}async function iw(e,t,r,i){let o,n,l=e.bufferViews[i.bufferView],h=t[l.buffer],u=l.byteOffset??0,d=h.slice(u,u+l.byteLength),c={},f=Object.keys(i.attributes);for(let t=0;t<f.length;t++){let s=f[t],a=r.attributes[s];if(void 0===a)continue;let o=e.accessors[a];c[s]={dracoId:i.attributes[s],componentType:o.componentType}}let p=await (!a&&((a=new Worker(s??=URL.createObjectURL(new Blob(["(function(){let e,t;async function n(e,t){let n=new URL(e,self.location.origin).href,r=new URL(t,self.location.origin).href;importScripts(n);let i=await fetch(r).then(e=>{if(!e.ok)throw Error(`Failed to fetch Draco WASM: ${e.status} ${e.statusText}`);return e.arrayBuffer()});return await self.DracoDecoderModule({wasmBinary:i})}let r={5120:{ctor:Int8Array,bytes:1,dtKey:`DT_INT8`},5121:{ctor:Uint8Array,bytes:1,dtKey:`DT_UINT8`},5122:{ctor:Int16Array,bytes:2,dtKey:`DT_INT16`},5123:{ctor:Uint16Array,bytes:2,dtKey:`DT_UINT16`},5125:{ctor:Uint32Array,bytes:4,dtKey:`DT_UINT32`},5126:{ctor:Float32Array,bytes:4,dtKey:`DT_FLOAT32`}};async function i(n,i){if(!e)throw Error(`Draco decoder not initialized`);let a=await e;t||=new a.Decoder;let o=t,s=new a.DecoderBuffer,c=new a.Mesh,l=0;try{s.Init(new Int8Array(n),n.byteLength);let e=o.DecodeBufferToMesh(s,c);if(!e.ok())throw Error(`Draco decode failed: ${e.error_msg()}`);let t=c.num_faces()*3,u=c.num_points(),d=u<=65535,f=d?2:4;l=a._malloc(t*f),d?o.GetTrianglesUInt16Array(c,t*2,l):o.GetTrianglesUInt32Array(c,t*4,l);let p=new(d?Uint16Array:Uint32Array)(a.HEAPU8.buffer,l,t).slice();a._free(l),l=0;let m={},h=[p.buffer],g=Object.keys(i);for(let e=0;e<g.length;e++){let t=g[e],{dracoId:n,componentType:s}=i[t],d=r[s];if(!d)throw Error(`Unsupported Draco componentType: ${s}`);let f=o.GetAttributeByUniqueId(c,n);if(!f)throw Error(`Draco attribute not found for uniqueId ${n}`);let p=u*f.num_components(),_=p*d.bytes;l=a._malloc(_),o.GetAttributeDataArrayForAllPoints(c,f,a[d.dtKey],_,l);let v=new d.ctor(a.HEAPU8.buffer,l,p).slice();a._free(l),l=0,m[t]=v,h.push(v.buffer)}return{indices:p,attributes:m,transferables:h}}finally{l&&a._free(l),a.destroy(c),a.destroy(s)}}async function a(t){let r=t.data;if(r.type===`init`){e=n(r.jsUrl,r.wasmUrl);return}if(r.type===`decode`)try{let{indices:e,attributes:t,transferables:n}=await i(r.bufferViewBytes,r.attributeIds);self.postMessage({id:r.id,success:!0,indices:e,attributes:t},n)}catch(e){let t=e instanceof Error?e.message:String(e);self.postMessage({id:r.id,success:!1,error:t})}}self.onmessage=a})();"],{type:"text/javascript;charset=utf-8"})))).onmessage=e=>{let{id:t,success:r,indices:i,attributes:s,error:a}=e.data;r&&i&&s?iy[t]?.({indices:i,attributes:s}):iv[t]?.(Error(a??"Draco decode failed")),delete iy[t],delete iv[t]},a.onerror=e=>ib(e.message||"uncaught error"),a.onmessageerror=()=>ib("message deserialization failed"),a.postMessage({type:"init",jsUrl:"https://www.gstatic.com/draco/versioned/decoders/1.5.7/draco_wasm_wrapper.js",wasmUrl:"https://www.gstatic.com/draco/versioned/decoders/1.5.7/draco_decoder.wasm"})),o=a,n=ix++,new Promise((e,t)=>{iy[n]=e,iv[n]=t,o.postMessage({type:"decode",id:n,bufferViewBytes:d,attributeIds:c},[d])})),m={indices:p.indices};for(let t=0;t<f.length;t++){let i=f[t];if(!p.attributes[i])continue;let s=i_[i];if(s){let t=p.attributes[i];m[s]="colors"===s||"colors1"===s?ig(t,"VEC3"===e.accessors[r.attributes[i]].type?3:4):t}else(0,tg.m)(`pixijs-3d-custom-attribute-${i}`,`[@pixi/3d] custom attribute ${i} skipped`)}return m}let iT={0:"point-list",1:"line-list",2:"line-strip",3:"line-strip",4:"triangle-list",5:"triangle-strip",6:"triangle-list"};async function iC(e,t,r){let i={},s=r.extensions?.KHR_draco_mesh_compression;if(s)Object.assign(i,await iw(e,t,r,s));else{if(void 0!==r.indices){let s=is(e,t,r.indices);i.indices=s instanceof Uint8Array?new Uint16Array(s):s}for(let s in r.attributes){let a=i_[s];if(a){let o=r.attributes[s],n=is(e,t,o),l=e.accessors?.[o];if(("colors"===a||"colors1"===a)&&l){i[a]=ig(n,"VEC3"===l.type?3:4);continue}i[a]=n}else(0,tg.m)(`pixijs-3d-custom-attribute-${s}`,`[@pixi/3d] custom attribute ${s} skipped`)}if(r.targets){let s=function(e,t,r){let i=[],s=0;for(let a=0;a<r.length;a++){let o=r[a].POSITION;if(void 0===o)return void(0,m.R8M)(`[@pixi/3d] morph target ${a} has no POSITION deltas; rendering base pose.`);let n=e.accessors?.[o];if(n&&5126!==n.componentType)return void(0,m.R8M)(`[@pixi/3d] morph target ${a} uses non-float POSITION deltas, which are not supported; rendering base pose.`);let l={positions:is(e,t,o,!0)},h=r[a].NORMAL;if(void 0!==h){let r=e.accessors?.[h];r&&5126!==r.componentType?(0,m.R8M)(`[@pixi/3d] morph target ${a} has non-float NORMAL deltas; morphing positions only.`):(l.normals=is(e,t,h,!0),s++)}i.push(l)}if(s>0&&s<i.length)for(let e of((0,m.R8M)("[@pixi/3d] morph targets mix NORMAL deltas; morphing positions only."),i))e.normals=void 0;return i.length>0?i:void 0}(e,t,r.targets);s&&(i.morphTargets=s)}}let a=r.attributes.TEXCOORD_0;void 0!==a&&e.accessors&&(i.uvs=iS(i.uvs,e.accessors[a]));let o=r.attributes.POSITION;if(void 0!==o&&e.accessors){let t=e.accessors[o];i.positions=iS(i.positions,t);let{min:r,max:s}=t;if(r&&s){let e=t.normalized?ie[t.componentType]:1;i.bounds3D=new u.a(new el.P(r[0]*e,r[1]*e,r[2]*e),new el.P(s[0]*e,s[1]*e,s[2]*e))}else if(5126!==t.componentType)throw Error(`[@pixi/3d] POSITION accessor ${o} stores integers but has no min and max, which glTF requires and the bounds come from.`)}return i.topology=iT[r.mode??4],new _(i)}function iS(e,t){return 5126!==t.componentType&&ArrayBuffer.isView(e)?{buffer:new m.hpe({data:"VEC3"===t.type?(0,p.fl)(e):e,usage:m.Sdw.VERTEX|m.Sdw.COPY_DST}),format:function(e){let t=r9[e.type];if(!t||1===t)throw Error(`[accessorToVertexFormat] Unsupported accessor type: ${e.type}`);let r=r7[e.componentType];if(!r)throw Error(`[accessorToVertexFormat] Unsupported componentType: ${e.componentType}`);let i=5126===e.componentType,s=3===t?i?"x3":"x4":`x${t}`;return`${e.normalized?r.normalized:r.raw}${s}`}(t)}:e}async function iD(e,t,r){e.meshes&&await Promise.all(e.meshes.map(async(i,s)=>{let a=await Promise.all(i.primitives.map(r=>iC(e,t,r))),o=a[0]?.morphTargetCount??0;for(let e=1;e<a.length;e++)a[e].morphTargetCount!==o&&(0,m.R8M)(`[@pixi/3d] mesh ${s} primitive ${e} has ${a[e].morphTargetCount} morph targets, expected ${o} (all primitives of a mesh must match).`);r.geometries[s]=a,i.name&&a.length>0&&(r.geometry[i.name]=a[0])}))}let iM=new e_.k,iB=new e_.k,iI=new e_.k,iP=new el.P,iA=new eg.P,iF=new el.P,iR=new el.P(1,1,1);function ik(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}let iz={wrapS:10497,wrapT:10497,magFilter:9729,minFilter:9987};function iV(e){switch(e){case 33071:return"clamp-to-edge";case 33648:return"mirror-repeat";default:return"repeat"}}async function iL(e,t=[],r=[]){let i,s={};e.nodes&&(s.nodes=e.nodes.map((t,r)=>{let i=t.children??[],s={label:t.name||`node_${r}`,children:i};if(t.matrix&&16===t.matrix.length?(s.position=new Float32Array(3),s.rotation=new Float32Array(4),s.scale=new Float32Array(3),function(e,t,r,i){let s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]),a=Math.sqrt(e[4]*e[4]+e[5]*e[5]+e[6]*e[6]),o=Math.sqrt(e[8]*e[8]+e[9]*e[9]+e[10]*e[10]);e[0]*(e[5]*e[10]-e[9]*e[6])-e[4]*(e[1]*e[10]-e[9]*e[2])+e[8]*(e[1]*e[6]-e[5]*e[2])<0&&(s=-s),t[0]=e[12],t[1]=e[13],t[2]=e[14];let n=1/s,l=1/a,h=1/o,u=e[0]*n,d=e[1]*n,c=e[2]*n,f=e[4]*l,p=e[5]*l,m=e[6]*l,_=e[8]*h,g=e[9]*h,x=e[10]*h,y=u+p+x;if(y>0){let e=.5/Math.sqrt(y+1);r[3]=.25/e,r[0]=(m-g)*e,r[1]=(_-c)*e,r[2]=(d-f)*e}else if(u>p&&u>x){let e=2*Math.sqrt(1+u-p-x);r[3]=(m-g)/e,r[0]=.25*e,r[1]=(f+d)/e,r[2]=(_+c)/e}else if(p>x){let e=2*Math.sqrt(1+p-u-x);r[3]=(_-c)/e,r[0]=(f+d)/e,r[1]=.25*e,r[2]=(g+m)/e}else{let e=2*Math.sqrt(1+x-u-p);r[3]=(d-f)/e,r[0]=(_+c)/e,r[1]=(g+m)/e,r[2]=.25*e}i[0]=s,i[1]=a,i[2]=o}(t.matrix,s.position,s.rotation,s.scale)):(t.translation&&(s.position=new Float32Array(t.translation)),t.scale&&(s.scale=new Float32Array(t.scale)),t.rotation&&(s.rotation=new Float32Array(t.rotation))),void 0!==t.camera&&(s.camera=t.camera),void 0!==t.mesh){s.geometry=t.mesh;let r=e.meshes?.[t.mesh];if(r){let i=e.materials?.length??0;s.materials=r.primitives.map(e=>e.material??i);let a=t.weights??r.weights;a&&(s.weights=a)}}return t.extensions&&(t.extensions.KHR_lights_punctual&&(s.light=t.extensions.KHR_lights_punctual.light),t.extensions.KHR_node_visibility?.visible===!1&&(s.visible=!1)),void 0!==t.skin&&(s.skin=t.skin),s})),e.scenes&&(s.scenes=e.scenes.map(e=>({children:e.nodes,name:e.name})),void 0!==e.scene&&e.scene<s.scenes.length&&(s.defaultScene=e.scene)),e.extensions?.KHR_lights_punctual?.lights&&(s.lights=e.extensions.KHR_lights_punctual.lights.map(e=>{let t=e.spot?.outerConeAngle??Math.PI/4,r=e.spot?.innerConeAngle??0;return{name:e.name,color:ip(e.color??[1,1,1]),intensity:e.intensity,type:im[e.type],range:e.range??0,coneAngle:t*m.bOd,penumbra:t>0?Math.max(0,Math.min(1,1-r/t)):0}})),function(e,t){if(!e.cameras){t.cameras=[];return}t.cameras=e.cameras.map(e=>{if("perspective"===e.type){let t=e.perspective;return{fov:t.yfov*m.bOd,near:t.znear,far:t.zfar,mode:0}}let t=e.orthographic;return{orthographicSize:t.xmag,near:t.znear,far:t.zfar,mode:1}})}(e,s);let a=new eF(s);return e.animations&&e.animations.forEach((r,i)=>{let s=[];r.channels.forEach(i=>{let a=r.samplers[i.sampler],o=function(e,t,r,i){let s=il(r,i,t.input),a=il(r,i,t.output),o=`${e.node.toString()}.${io[e.path]??e.path}`,n=t.interpolation??"LINEAR";if("weights"===e.path){let e=s.length>0?a.length/s.length:1,t="CUBICSPLINE"===n?e/3:e;return new r5({label:o,times:s,values:a,interpolation:n,valueSize:t})}return new(ia[e.path]??r8)({label:o,times:s,values:a,interpolation:n})}(i.target,a,e,t);o&&s.push(o)});let o=r.name||`anim_${i}`;a.animations[o]=new r4({label:o,tracks:s})}),function(e,t,r){var i;let s;if(!e.skins){r.skins=[];return}let a=(i=e.nodes,s=new Int32Array(i?.length||0).fill(-1),i?.forEach((e,t)=>{e.children?.forEach(e=>{s[e]=t})}),s),o=new Map,n=[],l=[],h=e.skins.map(e=>({skinRaw:e,parentNode:function(e,t){let r,i=new Set(e);for(let s of e){let e=t[s];if(i.has(e))continue;let a=[];for(let r=e;-1!==r;r=t[r])a.push(r);if(!(r=r?r.filter(e=>a.includes(e)):a).length)return -1}return r?.[0]??-1}(e.joints,a),nodes:[]})),u=t=>{if(t.nodes=function(e,t,r){let i=new Set;for(let s of e){let e=s;for(;-1!==e&&e!==t&&!i.has(e);)i.add(e),e=r[e]}let s=new Map,a=e=>{if(s.has(e))return s.get(e);let t=0,i=e;for(;-1!==i;)t++,i=r[i];return s.set(e,t),t};return Array.from(i).sort((e,t)=>a(e)-a(t))}(t.skinRaw.joints,t.parentNode,a),r.nodes)for(let i of t.nodes){if(function e(t,r,i){let s=i.get(r);if(void 0!==s)return s;i.set(r,!1);let a=t?.[r],o=a?.mesh!==void 0;if(!o&&a?.children){for(let r of a.children)if(e(t,r,i)){o=!0;break}}return i.set(r,o),o}(e.nodes,i,o))continue;let t=r.nodes[i];t&&(t.isJoint=!0)}};h.forEach(u);let d=!0;for(;d;)for(let t of(d=!1,h)){let i=function(e,t,r,i){let s=e;for(let a=e;-1!==a;a=t[a]){let e=r?.[a];(e?.mesh!==void 0&&void 0!==e.skin||i?.[a]?.isJoint)&&(s=t[a])}return s}(t.parentNode,a,e.nodes,r.nodes);i!==t.parentNode&&(t.parentNode=i,u(t),d=!0)}for(let{skinRaw:i,parentNode:s,nodes:o}of h){let h=is(e,t,i.inverseBindMatrices),u=i.joints,d=new Map;o.forEach((e,t)=>d.set(e,t));let c=o.length,f=new Int16Array(c),p=new Int32Array(c);for(let e=0;e<c;e++){let t=o[e],r=a[t];p[e]=t;let i=d.get(r);f[e]=void 0!==i?i:-1}let m=new Int16Array(u.length);for(let e=0;e<u.length;e++)m[e]=d.get(u[e]);let _=o.map(t=>e.nodes?.[t]?.name||`node_${t}`),g=n.findIndex(e=>ik(e.skeletonNodes,p)&&ik(e.inverseBindMatrices,h));if(-1!==g){l.push(g);continue}l.push(n.length),n.push({name:i.name,inverseBindMatrices:h,skeletonParent:f,skeletonNodes:p,skeletonJoints:m,skeletonLabels:_,parentNode:s,bindShapeMatrix:function(e,t,r,i,s){if(void 0===e||!i)return;iM.identity();for(let s=e;-1!==s&&s!==t;s=r[s]){let e=i[s];e&&(e.position?iP.fromArray(e.position):iP.set(0,0,0),e.rotation?iA.fromArray(e.rotation):iA.set(0,0,0,1),iM.premultiply(iB.compose(iP,iA,e.scale?iF.fromArray(e.scale):iR)))}iM.multiply(iI.fromArray(s));let a=iM.elements,o=!0;for(let e=0;e<16&&o;e++)o=1e-6>Math.abs(a[e]-(e%5==0));if(o)return;let n=iM.determinant();if(0!==n&&Number.isFinite(n))return iM.decompose(iP,iA,iF),iM.compose(iP,iA,iF),new Float32Array(iM.elements)}(u[0],s,a,r.nodes,h)})}if(r.skins=n,r.nodes)for(let e of r.nodes)void 0!==e.skin&&(e.skin=l[e.skin])}(e,t,s),e.textures&&e.textures.forEach((t,i)=>{var s,o;let n=r[t.source],l={...iz,...e.samplers?.[t.sampler]},h=n.source.style;h.addressModeU=iV(l.wrapS),h.addressModeV=iV(l.wrapT),h.magFilter=9728===l.magFilter?"nearest":"linear",h.minFilter=9728===(s=l.minFilter)||9984===s||9986===s?"nearest":"linear",n.source.autoGenerateMipmaps=!(n.source instanceof m.jF6)&&9728!==(o=l.minFilter)&&9729!==o,a.textures[i]=n,t.name&&(a.texture[t.name]=n)}),await iD(e,t,a),(i=e.materials??[]).forEach((e,t)=>{let r=function(e,t){if(e.extensions?.KHR_materials_unlit){let r,i,s,a;return r=e.name??"<unnamed>",iu("baseColorTexture",e.pbrMetallicRoughness?.baseColorTexture,r),i={alphaMode:ic(e),alphaCutoff:e.alphaCutoff,doubleSided:e.doubleSided??!1,vertexColors:!0},s=e.pbrMetallicRoughness,s?.baseColorFactor!==void 0&&(i.baseColor=ip(s.baseColorFactor),i.alpha=s.baseColorFactor[3]),s?.baseColorTexture!==void 0&&(i.baseColorTexture=t.textures[s.baseColorTexture.index]),(a=s?.baseColorTexture?.extensions?.KHR_texture_transform)&&(i.uvTransform=id(a)),new ty(i)}return function(e,t){let r,i;r=e.name??"<unnamed>",i=e.pbrMetallicRoughness,iu("baseColorTexture",i?.baseColorTexture,r),iu("metallicRoughnessTexture",i?.metallicRoughnessTexture,r),iu("normalTexture",e.normalTexture,r),iu("occlusionTexture",e.occlusionTexture,r),iu("emissiveTexture",e.emissiveTexture,r),iu("transmissionTexture",e.extensions?.KHR_materials_transmission?.transmissionTexture,r),iu("thicknessTexture",e.extensions?.KHR_materials_volume?.thicknessTexture,r),iu("clearcoatTexture",e.extensions?.KHR_materials_clearcoat?.clearcoatTexture,r),iu("clearcoatRoughnessTexture",e.extensions?.KHR_materials_clearcoat?.clearcoatRoughnessTexture,r),iu("clearcoatNormalTexture",e.extensions?.KHR_materials_clearcoat?.clearcoatNormalTexture,r),iu("sheenColorTexture",e.extensions?.KHR_materials_sheen?.sheenColorTexture,r),iu("sheenRoughnessTexture",e.extensions?.KHR_materials_sheen?.sheenRoughnessTexture,r),iu("specularTexture",e.extensions?.KHR_materials_specular?.specularTexture,r),iu("specularColorTexture",e.extensions?.KHR_materials_specular?.specularColorTexture,r),iu("anisotropyTexture",e.extensions?.KHR_materials_anisotropy?.anisotropyTexture,r);let s={alphaMode:ic(e),alphaCutoff:e.alphaCutoff,doubleSided:e.doubleSided??!1,metallic:1,roughness:1,vertexColors:!0};if(void 0!==e.normalTexture&&(s.normalTexture=t.textures[e.normalTexture.index],void 0!==e.normalTexture.scale&&(s.normalScale=e.normalTexture.scale)),e.emissiveFactor||e.emissiveTexture){let r={color:ip(e.emissiveFactor??[0,0,0]),strength:e.extensions?.KHR_materials_emissive_strength?.emissiveStrength??1};e.emissiveTexture&&(r.texture=t.textures[e.emissiveTexture.index]),s.emissive=r}if(e.occlusionTexture&&(s.occlusionTexture=t.textures[e.occlusionTexture.index],void 0!==e.occlusionTexture.strength&&(s.occlusionStrength=e.occlusionTexture.strength)),e.pbrMetallicRoughness){let r=e.pbrMetallicRoughness;void 0!==r.baseColorFactor&&(s.baseColor=ip(r.baseColorFactor),s.alpha=r.baseColorFactor[3]),void 0!==r.metallicFactor&&(s.metallic=r.metallicFactor),void 0!==r.roughnessFactor&&(s.roughness=r.roughnessFactor),void 0!==r.baseColorTexture&&(s.baseColorTexture=t.textures[r.baseColorTexture.index]),void 0!==r.metallicRoughnessTexture&&(s.metallicRoughnessTexture=t.textures[r.metallicRoughnessTexture.index])}let a=function(e){let t=e.pbrMetallicRoughness,r=e.extensions;for(let i of[t?.baseColorTexture,t?.metallicRoughnessTexture,e.normalTexture,e.occlusionTexture,e.emissiveTexture,r?.KHR_materials_transmission?.transmissionTexture,r?.KHR_materials_volume?.thicknessTexture,r?.KHR_materials_clearcoat?.clearcoatTexture,r?.KHR_materials_clearcoat?.clearcoatRoughnessTexture,r?.KHR_materials_clearcoat?.clearcoatNormalTexture,r?.KHR_materials_sheen?.sheenColorTexture,r?.KHR_materials_sheen?.sheenRoughnessTexture,r?.KHR_materials_specular?.specularTexture,r?.KHR_materials_specular?.specularColorTexture,r?.KHR_materials_iridescence?.iridescenceTexture,r?.KHR_materials_iridescence?.iridescenceThicknessTexture,r?.KHR_materials_anisotropy?.anisotropyTexture]){let e=i?.extensions?.KHR_texture_transform;if(e)return e}}(e);a&&(s.uvTransform=id(a));let o=e.extensions?.KHR_materials_transmission;if(o){let r={factor:o.transmissionFactor??0};o.transmissionTexture&&(r.texture=t.textures[o.transmissionTexture.index]);let i=e.extensions?.KHR_materials_volume;i&&(r.thickness=i.thicknessFactor??0,r.attenuationDistance=i.attenuationDistance??1/0,r.attenuationColor=ip(i.attenuationColor??[1,1,1]),i.thicknessTexture&&(r.thicknessTexture=t.textures[i.thicknessTexture.index])),s.transmission=r,((r.factor??0)>0||void 0!==r.texture)&&"opaque"!==s.alphaMode&&((0,m.R8M)(`[@pixi/3d] Material "${e.name??"<unnamed>"}" combines KHR_materials_transmission with alphaMode="${e.alphaMode??"OPAQUE"}"; the glTF spec leaves this undefined. Coercing alphaMode to OPAQUE so the transmission pass handles transparency.`),s.alphaMode="opaque")}let n=e.extensions?.KHR_materials_ior;n&&(s.ior=n.ior??1.5);let l=e.extensions?.KHR_materials_iridescence;if(l){let r={factor:l.iridescenceFactor??0,ior:l.iridescenceIor??1.3,thicknessMinimum:l.iridescenceThicknessMinimum??100,thicknessMaximum:l.iridescenceThicknessMaximum??400},i=l.iridescenceTexture?.index,a=l.iridescenceThicknessTexture?.index;void 0!==i&&(r.texture=t.textures[i]),void 0!==a&&(r.thicknessTexture=t.textures[a]),s.iridescence=r,void 0!==i&&void 0!==a&&i!==a&&(0,m.R8M)(`[@pixi/3d] KHR_materials_iridescence on material "${e.name??"<unnamed>"}" references two different textures for iridescenceTexture (R=factor) and iridescenceThicknessTexture (G=thickness); PixiJS 3D packs both into one slot (R+G). The factor texture will be used and iridescence thickness will be sampled from its G channel. Repack into a single image with factor in R and thickness in G for the intended look.`)}let h=e.extensions?.KHR_materials_clearcoat;if(h){let e={factor:h.clearcoatFactor??0,roughness:h.clearcoatRoughnessFactor??0};h.clearcoatTexture&&(e.texture=t.textures[h.clearcoatTexture.index]),h.clearcoatRoughnessTexture&&(e.roughnessTexture=t.textures[h.clearcoatRoughnessTexture.index]),h.clearcoatNormalTexture&&(e.normalTexture=t.textures[h.clearcoatNormalTexture.index],void 0!==h.clearcoatNormalTexture.scale&&(e.normalScale=h.clearcoatNormalTexture.scale)),s.clearcoat=e}let u=e.extensions?.KHR_materials_sheen;if(u){let r={color:ip(u.sheenColorFactor??[0,0,0]),roughness:u.sheenRoughnessFactor??0},i=u.sheenColorTexture?.index,a=u.sheenRoughnessTexture?.index;void 0!==i&&(r.texture=t.textures[i]),void 0!==a&&(r.roughnessTexture=t.textures[a]),s.sheen=r,void 0!==i&&void 0!==a&&i!==a&&(0,m.R8M)(`[@pixi/3d] KHR_materials_sheen on material "${e.name??"<unnamed>"}" references two different textures for sheenColor and sheenRoughness; PixiJS 3D packs both into one slot (RGB+A). The colour texture will be used and sheen roughness will be sampled from its alpha channel (usually 1.0 on an sRGB colour texture, effectively giving factor-only roughness). Repack into a single RGBA image with roughness in alpha for the intended look.`)}let d=e.extensions?.KHR_materials_specular;if(d){let r={factor:d.specularFactor??1,color:ip(d.specularColorFactor??[1,1,1])},i=d.specularColorTexture?.index,a=d.specularTexture?.index;void 0!==i&&(r.colorTexture=t.textures[i]),void 0!==a&&(r.texture=t.textures[a]),s.specular=r,void 0!==i&&void 0!==a&&i!==a&&(0,m.R8M)(`[@pixi/3d] KHR_materials_specular on material "${e.name??"<unnamed>"}" references two different textures for specularColor (RGB) and specular (A); PixiJS 3D packs both into one slot (RGB+A). The colour texture will be used and specular factor will be sampled from its alpha channel (usually 1.0 on an sRGB colour texture, effectively giving factor-only strength). Repack into a single RGBA image with factor in alpha for the intended look.`)}let c=e.extensions?.KHR_materials_anisotropy;if(c){let e={strength:c.anisotropyStrength??0,rotation:c.anisotropyRotation??0},r=c.anisotropyTexture?.index;void 0!==r&&(e.texture=t.textures[r]),s.anisotropy=e}return new ei(s)}(e,t)}(e,a);r.label=e.name,a.materials[t]=r,e.name&&(a.material[e.name]=r)}),e.meshes?.some(e=>e.primitives.some(e=>void 0===e.material))&&(a.materials[i.length]=new ei({metallic:1,roughness:1})),a}async function iO(e,t,r,i){let s=e.images??[],a=[],o=[],n=Array.from(await iE(e,i),async([n,l])=>{let h=s[n];if(h.uri){let e=h.uri.startsWith("data:")?h.uri:t+h.uri;a.push(e),o[n]=await i.load({src:e,parser:l})}else if(void 0!==h.bufferView){let t=await iG(h.bufferView,h.mimeType,e,await r);a.push(t);try{o[n]=await i.load({src:t,parser:l})}finally{URL.revokeObjectURL(t)}}}),l=(await Promise.allSettled([...n,r])).find(e=>"rejected"===e.status);if(l)throw await i.unload(a),l.reason;return{textures:o,urls:a}}m.L3G.register({clear:()=>{o=void 0}});let iN=[{name:"KHR_texture_basisu",parser:"ktx2"},{name:"EXT_texture_avif",parser:"texture"},{name:"EXT_texture_webp",parser:"texture"}];async function iE(e,t){let r=new Map,i=e.textures??[],s={KHR_texture_basisu:t.parsers.some(e=>"ktx2"===e.id),EXT_texture_avif:i.some(e=>e.extensions?.EXT_texture_avif)&&await (o??=m.Qq3.test()),EXT_texture_webp:!0};return i.forEach((e,t)=>{let i=e.extensions??{},a=iN.find(({name:e})=>s[e]&&i[e]);if(a)e.source=i[a.name].source,r.set(e.source,a.parser);else if(void 0!==e.source)r.set(e.source,"texture");else if(i.KHR_texture_basisu)throw Error(`[@pixi/3d] glTF texture ${t} has only a KHR_texture_basisu (KTX2) image, which needs pixi's KTX2 loader: import 'pixi.js/ktx2' before loading the model`);else if(i.EXT_texture_avif)throw Error(`[@pixi/3d] glTF texture ${t} has only an EXT_texture_avif image, and this browser can't decode AVIF`);else throw Error(`[@pixi/3d] glTF texture ${t} has no PNG, JPEG, WebP, AVIF or KTX2 image`)}),r}async function iG(e,t,r,i){let s=r.bufferViews[e],a=new Blob([new Uint8Array(i[s.buffer],s.byteOffset||0,s.byteLength)],{type:t||"image/png"});return URL.createObjectURL(a)}let iU={extension:{type:m.AgS.LoadParser,name:"loadGlb"},name:"loadGlb",id:"glb",test:e=>(0,m.sHU)(e,"model/gltf-binary")||(0,m.WOU)(e,".glb"),async load(e,t,r){let i=await (await fetch(e)).arrayBuffer(),s=e.substring(0,e.lastIndexOf("/")+1),{json:a,buffers:o}=function(e){let t,r=new DataView(e),i=r.getUint32(0,!0),s=r.getUint32(4,!0),a=r.getUint32(8,!0);if(0x46546c67!==i)throw Error(`Invalid GLB magic: ${i.toString(16)}`);if(s<2)throw Error(`Unsupported GLB version: ${s}`);let o=[],n=12;for(;n<a;){let i=r.getUint32(n,!0),s=r.getUint32(n+4,!0);if(n+=8,0x4e4f534a===s)t=JSON.parse(new TextDecoder().decode(new Uint8Array(e,n,i)));else if(5130562===s){let t=e.slice(n,n+i);o.push(t)}n+=i}if(!t)throw Error("GLB file contains no JSON chunk");return{json:t,buffers:o}}(i);(function(e,t){for(let r=t.length;r<e.length;r++)e[r].extensions?.EXT_meshopt_compression?.fallback!==!0&&e[r].extensions?.KHR_meshopt_compression?.fallback!==!0&&(0,m.R8M)(`[@pixi/3d] GLB buffer ${r} ("${e[r].uri??"no uri"}") lives outside the container; external GLB buffers are not loaded, so anything reading it will come back empty.`),t.push(new ArrayBuffer(0))})(a.buffers??[],o),await r2(a,o);let n=await iO(a,s,o,r),l=await iL(a,o,n.textures);return l._imageUrls.push(...n.urls),l},async unload(e,t,r){for(let t of e.materials)t.destroy();await r.unload(e._imageUrls),e.destroy()}},i$={extension:{type:m.AgS.LoadParser,name:"loadGltf"},name:"loadGltf",id:"gltf",test:e=>(0,m.sHU)(e,"model/gltf+json")||(0,m.WOU)(e,".gltf"),async load(e,t,r){let i=await (await fetch(e)).json(),s=e.substring(0,e.lastIndexOf("/")+1),a=Promise.all((i.buffers||[]).map(async e=>{if(e.uri){if(e.uri.startsWith("data:"))return await (await fetch(e.uri)).arrayBuffer();let t=s+e.uri;return await (await fetch(t)).arrayBuffer()}if(e.extensions?.EXT_meshopt_compression?.fallback===!0||e.extensions?.KHR_meshopt_compression?.fallback===!0)return new ArrayBuffer(0);throw Error("GLTF buffer has no URI")})).then(async e=>(await r2(i,e),e)),o=await iO(i,s,a,r),n=await iL(i,await a,o.textures);return n._imageUrls.push(...o.urls),n},async unload(e,t,r){for(let t of e.materials)t.destroy();await r.unload(e._imageUrls),e.destroy()}};var iq=r(32032);let iH=new Float32Array(1),ij=new Uint32Array(iH.buffer);function iW(e,t){if(!(e>0))return 0;iH[0]=Math.min(e,iq.U);let r=ij[0],i=(r>>>23&255)-112;if(i<=0)return 0;let s=23-t;return(i<<t|r>>>s&(1<<t)-1)+(r>>>s-1&1)}function iK(e,t){let r=new Uint32Array(t);for(let i=0;i<t;i++)r[i]=(iW(e[3*i],6)|iW(e[3*i+1],6)<<11|iW(e[3*i+2],5)<<22)>>>0;return r}let iX=new TextDecoder("latin1"),iY={extension:{type:m.AgS.LoadParser,name:"loadHdr"},name:"loadHdr",id:"hdr",test:e=>(0,m.WOU)(e,".hdr"),async load(e,t){var r;let i=await fetch(e);if(!i.ok)throw Error(`loadHdr: fetching ${e} failed with status ${i.status}.`);let s=function(e){let t=new Uint8Array(e),r=0,i=()=>{let e=r;for(;r<t.length&&10!==t[r];)r++;let i=iX.decode(t.subarray(e,r));return r++,i};for(let e=i();""!==e;e=i())if(e.startsWith("FORMAT=")&&"FORMAT=32-bit_rle_rgbe"!==e)throw Error(`parseRadianceHdr: unsupported pixel format "${e.slice(7)}"; only 32-bit_rle_rgbe is read.`);let s=/^-Y (\d+) \+X (\d+)$/.exec(i().trim());if(!s)throw Error('parseRadianceHdr: only the standard "-Y <height> +X <width>" orientation is read.');let a=Number(s[1]),o=Number(s[2]),n=new Float32Array(o*a*3),l=new Uint8Array(4*o),h=o>=8&&o<32768,u=new Float64Array(256);for(let e=1;e<256;e++)u[e]=2**(e-136);for(let e=0;e<a;e++){if(h&&2===t[r]&&2===t[r+1]&&(t[r+2]<<8|t[r+3])===o){r+=4;for(let e=0;e<4;e++){let i=0;for(;i<o;){if(r>=t.length)throw Error("parseRadianceHdr: the file ends inside a scanline.");let s=t[r++];if(s>128){s-=128;let a=t[r++];for(let t=0;t<s;t++)l[4*i+++e]=a}else for(let a=0;a<s;a++)l[4*i+++e]=t[r++]}}}else{if(r+4*o>t.length)throw Error("parseRadianceHdr: the file ends inside a scanline.");l.set(t.subarray(r,r+4*o)),r+=4*o}let i=e*o*3;for(let e=0;e<o;e++){let t=u[l[4*e+3]];n[i]=(l[4*e]+.5)*t,n[i+1]=(l[4*e+1]+.5)*t,n[i+2]=(l[4*e+2]+.5)*t,i+=3}}return{width:o,height:a,data:n}}(await i.arrayBuffer()),a=t?.data?.faceSize??(r=s.width,Math.min(512,Math.max(16,2**Math.floor(Math.log2(r/4)))));return function(e,t,r){let{width:i,height:s,data:a}=e,o=new Float64Array(3),n=new Float32Array(t*t*3),l=[];for(let e=0;e<6;e++){for(let r=0;r<t;r++){let l=(r+.5)/t*2-1;for(let u=0;u<t;u++){var h=(u+.5)/t*2-1;switch(e){case 0:o[0]=1,o[1]=-l,o[2]=-h;break;case 1:o[0]=-1,o[1]=-l,o[2]=h;break;case 2:o[0]=h,o[1]=1,o[2]=l;break;case 3:o[0]=h,o[1]=-1,o[2]=-l;break;case 4:o[0]=h,o[1]=-l,o[2]=1;break;default:o[0]=-h,o[1]=-l,o[2]=-1}let d=Math.sqrt(o[0]*o[0]+o[1]*o[1]+o[2]*o[2]),c=(Math.atan2(o[2],o[0])/(2*Math.PI)+.5)*i-.5,f=(.5-Math.asin(o[1]/d)/Math.PI)*s-.5,p=Math.floor(c),m=Math.max(0,Math.floor(f)),_=c-p,g=Math.min(1,Math.max(0,f-m)),x=(p%i+i)%i,y=(x+1)%i,v=Math.min(m,s-1)*i,b=Math.min(m+1,s-1)*i,w=(r*t+u)*3;for(let e=0;e<3;e++){let t=a[(v+x)*3+e]*(1-_)+a[(v+y)*3+e]*_,r=a[(b+x)*3+e]*(1-_)+a[(b+y)*3+e]*_;n[w+e]=t*(1-g)+r*g}}}let u=[iK(n,t*t)];for(let e=t;e>1;e>>=1)!function(e,t){let r=t>>1;for(let i=0;i<r;i++)for(let s=0;s<r;s++){let a=(2*i*t+2*s)*3,o=a+3*t,n=(i*r+s)*3;for(let t=0;t<3;t++)e[n+t]=.25*(e[a+t]+e[a+3+t]+e[o+t]+e[o+3+t])}}(n,e),u.push(iK(n,(e>>1)**2));l.push(new m.jF6({resource:u,format:"rg11b10ufloat",width:t,height:t,label:r}))}let[u,d,c,f,p,_]=l;return m.b4q.from({faces:{right:u,left:d,top:c,bottom:f,front:p,back:_},label:r,mipLevelCount:u.mipLevelCount})}(s,a,m.AeT.basename(e,".hdr"))},unload(e){let t=Object.values(e.source.faces);for(let r of(e.destroy(!0),t))r.destroy()}};m.XOh.add(i$,iU,r1,iY),m.XOh.mixin(d.B,{onclick:null,oncontextmenu:null,onmousedown:null,onmouseenter:null,onmouseleave:null,onmousemove:null,onglobalmousemove:null,onmouseout:null,onmouseover:null,onmouseup:null,onmouseupoutside:null,onpointercancel:null,onpointerdown:null,onpointerenter:null,onpointerleave:null,onpointermove:null,onglobalpointermove:null,onpointerout:null,onpointerover:null,onpointertap:null,onpointerup:null,onpointerupoutside:null,onrightclick:null,onrightdown:null,onrightup:null,onrightupoutside:null,ontap:null,ontouchcancel:null,ontouchend:null,ontouchendoutside:null,ontouchmove:null,onglobaltouchmove:null,ontouchstart:null,onwheel:null,_eventMode:void 0,get eventMode(){return this._eventMode??"passive"},set eventMode(value){let e=this._eventMode??"passive";if(this._eventMode=value,!this._view3d||value===e)return;let t=this._view3d.events,r="dynamic"===e,i=-1,s=!1;"none"!==value&&(this._isPickCandidate()||this._hasPickVolume())&&0!==(i=tY(this))&&(s=this._isPickCandidate()||2===i);let a=-1!==this._pickIndex;s!==a?s?t._addInteractive(this):t._removeInteractive(this,r):a&&r!==("dynamic"===value)&&t._changeDynamicCount("dynamic"===value?1:-1);let o="static"===value||"dynamic"===value,n="none"===e||!this._interactiveChildren,l="none"===value||!this._interactiveChildren;if(("static"===e||"dynamic"===e)===o&&n===l||n&&l||0===this.children.length||(-1===i&&(i=tY(this)),0===i))return;l?tQ(this,t):n?tJ(this,t,o||2===i):2!==i&&(o?function e(t,r){let i=t.children;for(let t=0;t<i.length;t++){let s=i[t],a=s._eventMode;"none"!==a&&"static"!==a&&"dynamic"!==a&&("auto"!==a&&s._hasPickVolume()&&r._addInteractive(s),s._interactiveChildren&&e(s,r))}}(this,t):function e(t,r){let i=t.children;for(let t=0;t<i.length;t++){let s=i[t],a=s._eventMode;"none"!==a&&"static"!==a&&"dynamic"!==a&&("auto"!==a&&-1!==s._pickIndex&&r._removeInteractive(s),s._interactiveChildren&&e(s,r))}}(this,t))},get interactive(){return this.isInteractive()},set interactive(value){this.eventMode=value?"static":"passive"},isInteractive(){return"static"===this._eventMode||"dynamic"===this._eventMode},_isPickCandidate(){return"static"===this._eventMode||"dynamic"===this._eventMode||"auto"===this._eventMode},_pickIndex:-1,_hasPickVolume(){return null!==this._hitVolumeInput||null!==this._getDefaultHitVolume()},_interactiveChildren:!0,get interactiveChildren(){return this._interactiveChildren},set interactiveChildren(value){let e=this._interactiveChildren;if(this._interactiveChildren=value,!this._view3d||value===e||0===this.children.length||"none"===this._eventMode)return;let t=tY(this);if(0===t)return;let r=this._view3d.events;value?tJ(this,r,this.isInteractive()||2===t):tQ(this,r)},cursor:null,_hitVolumeInput:null,_hitVolumeResolved:null,_clipRayStamp:0,_clipRayHit:!1,get hitVolume(){return this._hitVolumeInput},set hitVolume(value){let e=null!==this._hitVolumeInput;if(this._hitVolumeInput=value,this._hitVolumeResolved=w(this,value),!this._view3d||(e!==(null!==value)&&(this._view3d.events._clipVolumeCount+=null!==value?1:-1),void 0!==this._eventMode&&"passive"!==this._eventMode))return;this._hasPickVolume()&&2===tY(this)?this._view3d.events._addInteractive(this):this._view3d.events._removeInteractive(this)},_getDefaultHitVolume:()=>null,_invWorldTransform:null,_invWorldTransformId:-1,_worldScaleSq:0,_worldScaleSqId:-1,_getInverseWorldTransform(){return null===this._invWorldTransform&&(this._invWorldTransform=new e_.k,this._invWorldTransformId=-1),this._invWorldTransformId!==this._worldTransformId&&(this._invWorldTransform.getInverse(this.worldTransform),this._invWorldTransformId=this._worldTransformId),this._invWorldTransform},_getWorldScaleSq(){return this._worldScaleSqId!==this._worldTransformId&&(this._worldScaleSq=this.worldTransform.getMaxSingularValueSq(),this._worldScaleSqId=this._worldTransformId),this._worldScaleSq}}),m.XOh.mixin(rZ,{containsPoint(e){return this.events._containsPoint(e.x,e.y)},get cursor(){return this.events._cursor},set cursor(value){this.events._cursor=value},get hitArea(){return null!==this.events._hitAreaShape?this.events._hitAreaProxy:null},set hitArea(value){if(value===this.events._hitAreaProxy)return;this.events._hitAreaShape=value??null},raycast(e,t){return this.events._raycast(e,t)}});let iJ=[{extension:{type:m.AgS.WebGLLoader,name:"pixijs-3d"},load:()=>Promise.resolve().then(r.bind(r,16783))},{extension:{type:m.AgS.WebGPULoader,name:"pixijs-3d"},load:()=>r.e("7259").then(r.bind(r,29526))}];m.$Zp.push({type:"mat4x4<f32>",test:e=>e.value.elements?.length===16,uniform:`
        gl.uniformMatrix4fv(ud[name].location, false, uv[name].elements);
        `,ubo:`
        var v = uv[name].elements;
        for(var i=0;i<16;i++)
        {
            data[offset + i] = v[i];
        }
    `}),m.$Zp.push({type:"mat3x3<f32>",test:e=>e.value.elements?.length===9,uniform:`
        gl.uniformMatrix3fv(ud[name].location, false, uv[name].elements);
        `,ubo:`
        var v = uv[name].elements;
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];
    `}),m.$Zp.push({type:"vec3<f32>",test:e=>"vec3<f32>"===e.type&&1===e.size&&void 0!==e.value.x,uniform:`
        cv = ud[name].value;
        v = uv[name];

        if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.z)
        {
            cv[0] = v.x;
            cv[1] = v.y;
            cv[2] = v.z;
            gl.uniform3f(ud[name].location, v.x, v.y, v.z);
        }
        `,ubo:`
        v = uv[name];
        data[offset] = v.x;
        data[offset + 1] = v.y;
        data[offset + 2] = v.z;
    `}),m.$Zp.push({type:"vec3<f32>",test:e=>"vec3<f32>"===e.type&&void 0!==e.value.r&&void 0!==e.value.g&&void 0!==e.value.b,uniform:`
        cv = ud[name].value;
        v = uv[name];

        if(cv[0] !== v.r || cv[1] !== v.g || cv[2] !== v.b)
        {
            cv[0] = v.r;
            cv[1] = v.g;
            cv[2] = v.b;
            gl.uniform3f(ud[name].location, v.r, v.g, v.b);
        }
        `,ubo:`
        v = uv[name];
        data[offset] = v.r;
        data[offset + 1] = v.g;
        data[offset + 2] = v.b;
    `}),m.XOh.add(...iJ)},711(e,t,r){r.d(t,{T5:()=>M,Or:()=>w,Og:()=>B,AK:()=>F,QF:()=>I});var i=r(38755),s=r(14200),a=r(63116),o=r(41987),n=r(21078),l=r(1104),h=r(8372);let u=new Map,d=0;function c(e){let t=0x811c9dc5,r=0x9e3779b9;for(let i=0;i<e.length;i++){let s=e[i].source.uid;t=Math.imul(t^s,0x1000193),r=Math.imul(r+s,0x85ebca6b),r^=r>>>13}let i=(r>>>11)*0x100000000+(t>>>0),s=u.get(i);return void 0===s&&(s=d++,u.set(i,s)),s}var f=r(39997),p=r(28960),m=r(67979),_=r(78599);let g=new Map;function x(e,t){let r=g.get(t);if(r)return r;let i=(0,_.E)(e),s=16*Math.max(1,Math.ceil(i.size/16));class a{_f32;_u32;_material;_views=Object.create(null);constructor(e){this._material=e;let t=new ArrayBuffer(s);this._f32=new Float32Array(t),this._u32=new Uint32Array(t)}}let o=a.prototype;for(let e of i.elements){let t=e.offset/4,{components:r}=e;if(1===r){let r="u32"===e.type||"i32"===e.type;Object.defineProperty(o,e.name,{enumerable:!0,get(){return(r?this._u32:this._f32)[t]},set(e){let i=r?this._u32:this._f32;i[t]!==(r?e:Math.fround(e))&&(i[t]=e,this._material.update())}})}else{let i=t+r,s=e.name;Object.defineProperty(o,s,{enumerable:!0,get(){return this._views[s]??=this._f32.subarray(t,i)},set(e){(this._views[s]??=this._f32.subarray(t,i)).set(e),this._material.update()}})}}return g.set(t,a),a}let y=new Map;var v=r(76972),b=r(54537);function w(){let e=new b.UwB;return e.depthTest=!0,e.blend=!1,e.culling=!0,e}let T=0,C=new Float32Array([1,0,0,1]);function S(e){if(0!==e.rotate)return!1;if(e.noFrame)return!0;let t=e.frame;return 0===t.x&&0===t.y&&t.width===e.source.width&&t.height===e.source.height}function D(e){return Math.pow(e,2.2)}function M(e){return Math.pow(e,1/2.2)}function B(e,t,r,i=1){e[t]=D(r.red)*i,e[t+1]=D(r.green)*i,e[t+2]=D(r.blue)*i}function I(e,t,r,i){e[t]+=D(r.red)*i,e[t+1]+=D(r.green)*i,e[t+2]+=D(r.blue)*i}function P(e){return"object"==typeof e&&null!==e&&Object.getPrototypeOf(e)===Object.prototype}let A=new Set(["baseColor","displayBaseColor","alphaCutoff","uvTransformRow0","uvOffset"]);var F=class e{static _empty=null;static get EMPTY(){let t;return e._empty??=((t=new e).destroy=b.tEg,t)}uid=T++;state;destroyed=!1;topology;_textures=[];_captureTick=-1;_slotByName=Object.create(null);_bindGroup=null;_mergedBindGroup=null;_textureSetId=0;_baseColorLinear=new Float32Array([1,1,1]);_baseColorTint=0xffffff;_alpha=1;_alphaCutoff=.5;_alphaMode="opaque";_passBit=l.J.OPAQUE;_meshes=new h.v("_materialMeshIndex");_materialIndex=-1;_lastTextureDirtyId=-1;_uniformResource=null;_descriptorDirtyId=0;doubleSided;_skipsToneCurve=!1;colorSpace="linear";fog;flatShading;vertexColors=!1;lit=!0;label;_uvTransformRow0;_uvOffset;_uvTransformExplicit;_uvTransform;_initialUvTransform;_materialStructSnapshot="{}";data;textures;_uploadQueue=null;_storeQueued=!1;update(){this._uploadQueue?.enqueueDirty(this)}_variantDirty=!0;_passes={};extraBits;_descriptorOptions;_descriptor;constructor(e={}){if(void 0!==e.baseColor&&(this.baseColor=e.baseColor),this._alpha=e.alpha??1,this._alphaCutoff=e.alphaCutoff??.5,this.state=w(),this.alphaMode=e.alphaMode??"opaque",this.doubleSided=e.doubleSided??!1,this.state.culling=!this.doubleSided,this.flatShading=e.flatShading??!1,this.fog=e.fog??!0,this.label=e.label,this.vertexColors=e.vertexColors??!1,this.extraBits=e.extraBits??[],this._uvTransformExplicit=!!e.uvTransform,this._initialUvTransform=e.uvTransform,e.descriptor){let t=this._descriptorOptions=e.descriptor,r=this.extraBits;this._descriptor=new a.X(0===r.length?t:{...t,bitsGpu:[...t.bitsGpu??[],...r],bitsGl:[...t.bitsGl??[],...r]}),this._deriveLayoutFromBits(this._descriptor.bitsGpu,{baseColor:e.baseColorTexture,...e.textures});let i=(0,v.sL)(this._descriptor.bitsGl).join("|"),s=(0,v.sL)(this._descriptor.bitsGpu).join("|");if(i!==s)throw Error(`[BaseMaterial3D] descriptor.bitsGl declares textures [${i}] but bitsGpu declares [${s}]. Both backends bind from the same derived slots, so the sequences must match.`)}if(e.passes)for(let t in e.passes){let r=e.passes[t];if(!r)continue;let i=s.w.getOrAllocate(t);!0!==r&&(this._passes[i]=(0,o.R)(r)),this._passBit|=i}this.topology=e.topology,this.data??=new(x({},"{}"))(this)}_getBindGroup(){let e=this._bindGroup,t=this._textures;if(e||(e=this._bindGroup=new b.TX4,this._refreshTextureBindingsOf(e)),"{}"!==this._materialStructSnapshot){let r=this._uploadQueue;if(!r)throw Error("[BaseMaterial3D] _getBindGroup on a material no store has registered; a mesh drawing it registers it first");let i=2*t.length,s=r.uniformResource(this);e.getResource(i)!==s&&e.setResourceUnwatched(s,i)}return e}_getMergedBindGroup(){let e=this._mergedBindGroup;return e||(e=this._mergedBindGroup=new b.TX4,this._refreshTextureBindingsOf(e)),e}_deriveLayoutFromBits(e,t={}){let r=this._textures;r.length=0,this._slotByName=Object.create(null);let i=(0,f.R)(e);this._materialStructSnapshot=(0,f.F)(i),this.data=new(x(i,this._materialStructSnapshot))(this);let s=this.data.baseColor;s&&(s.set(this._baseColorLinear),s[3]=this._alpha);let a=this.data.displayBaseColor;if(a){for(let e=0;e<3;e++)a[e]=M(this._baseColorLinear[e]);a[3]=this._alpha}"number"==typeof this.data.alphaCutoff&&(this.data.alphaCutoff=this._alphaCutoff),void 0!==this.data.uvTransformRow0&&(this._uvTransformRow0=this.data.uvTransformRow0,this._uvOffset=this.data.uvOffset,this._uvTransformRow0.set(C),this._initialUvTransform&&(this.uvTransform=this._initialUvTransform,this._initialUvTransform=void 0));let o=[];for(let i of e)if(i.textures)for(let e of i.textures){if(void 0!==this._slotByName[e])throw Error(`[BaseMaterial3D] Duplicate texture '${e}' \u{2014} bit "${i.name}" redeclares a name another bit in this material already claimed.`);this._slotByName[e]=r.length,r.push(t[e]??b.gPd.WHITE),o.push(e)}this.textures=new(function(e){let t=e.join("\n"),r=y.get(t);if(r)return r;class i{_material;constructor(e){this._material=e,Object.seal(this)}}return e.forEach((e,t)=>{Object.defineProperty(i.prototype,e,{get(){return this._material._textures[t]},set(e){this._material._setTextureSlot(t,e)},enumerable:!0,configurable:!1})}),r=i,y.set(t,r),r}(o))(this),this._textureSetId=c(r),this._deriveUvFrame()}_setTextureSlot(e,t){let r=this._textures[e];r!==t&&(this._textures[e]=t,r?.source!==t.source&&(this._textureSetId=c(this._textures),this._releaseBindGroup(),this._markDescriptorDirty()),e===this._slotByName.baseColor?this._deriveUvFrame():!this._uvTransformRow0||S(t)||this._frameMatchesTransform(t)||(0,m.m)("pixijs-3d-uv-frame-secondary","[@pixi/3d] A framed texture landed in a non-baseColor slot but the material UV transform (derived from the baseColor slot, or set explicitly) doesn't match its frame. The shared transform cannot serve per-slot frames \u2014 pack secondary maps to match the baseColor frame."))}getPrimaryDescriptor(e){return this._descriptor}enablePass(e){let t=this._passBit;this._passBit|=s.w.getOrAllocate(e),this._passBit!==t&&this._markDescriptorDirty()}disablePass(e){let t=s.w.get(e);if(void 0===t||(this._passBit&t)==0)return;this._passBit&=~t;let r=this._meshes.items;for(let e=0;e<r.length;e++)r[e]._queueMeshUpdate()}_markDescriptorDirty(){this._descriptorDirtyId++;let e=this._meshes.items;for(let t=0;t<e.length;t++)e[t]._markBatchDirty()}_invalidateDescriptor(){this._variantDirty=!0,this._markDescriptorDirty()}get alphaMode(){return this._alphaMode}set alphaMode(e){if(this._alphaMode===e)return;this._alphaMode=e;let t="blend"===e;this.state.blend=t,this.state.depthMask=!t;let r=l.J.OPAQUE|l.J.TRANSPARENT;this._passBit=this._passBit&~r|(t?l.J.TRANSPARENT:l.J.OPAQUE),this.update(),this._invalidateDescriptor()}get baseColor(){return this._baseColorTint}set baseColor(e){let t=b.Q1f.shared.setValue(e);this._baseColorTint=t.toNumber(),B(this._baseColorLinear,0,t);let r=this.data?.baseColor;if(r){r.set(this._baseColorLinear);let e=this.data.displayBaseColor;e&&t.toRgbArray(e),this.update()}}get alpha(){return this._alpha}set alpha(e){if(this._alpha===e)return;this._alpha=e;let t=this.data?.baseColor;if(t){t[3]=e;let r=this.data.displayBaseColor;r&&(r[3]=e),this.update()}}get alphaCutoff(){return this._alphaCutoff}set alphaCutoff(e){this._alphaCutoff!==e&&(this._alphaCutoff=e,"number"==typeof this.data?.alphaCutoff&&(this.data.alphaCutoff=e))}get uvTransform(){return this._uvTransform}set uvTransform(e){if(!this._uvTransformRow0){e&&(0,b.R8M)("BaseMaterial3D: uvTransform is inert \u2014 this material's descriptor bits declare no uvTransform fields (include uvTransformBit to enable it).");return}if(!e){this._uvTransformExplicit=!1,this._uvTransform=void 0,this._uvTransformRow0.set(C),this._uvOffset.fill(0),this.update(),this._deriveUvFrame();return}this._uvTransformExplicit=!0,this._uvTransform??=new b.uqu,this._uvTransform.copyFrom(e),this._uvTransformRow0[0]=e.a,this._uvTransformRow0[1]=e.b,this._uvTransformRow0[2]=e.c,this._uvTransformRow0[3]=e.d,this._uvOffset[0]=e.tx,this._uvOffset[1]=e.ty,this.update()}_deriveUvFrame(){let e=this._uvTransformRow0,t=this._uvOffset;if(!e||!t)return;let r=this._slotByName.baseColor,i=void 0===r?void 0:this._textures[r],s=void 0!==i&&!S(i);if(this._uvTransformExplicit){s&&(0,m.m)("pixijs-3d-uv-frame-explicit","[@pixi/3d] A framed baseColor texture was assigned but the material has an explicit uvTransform, which wins \u2014 the frame is not applied. Clear material.uvTransform to derive from the texture frame.");return}let a=1,o=0,n=0,l=1,h=0,u=0;if(s){i.trim&&(0,m.m)("pixijs-3d-uv-frame-trimmed","[@pixi/3d] The baseColor texture is trimmed. Trims describe where a sprite quad shrank and cannot map onto arbitrary mesh UVs \u2014 the trim is ignored; only the frame applies. Pack 3D textures without trimming.");let e=i.uvs;a=Math.fround(e.x1-e.x0),o=Math.fround(e.x3-e.x0),n=Math.fround(e.y1-e.y0),l=Math.fround(e.y3-e.y0),h=Math.fround(e.x0),u=Math.fround(e.y0)}(e[0]!==a||e[1]!==o||e[2]!==n||e[3]!==l||t[0]!==h||t[1]!==u)&&(e[0]=a,e[1]=o,e[2]=n,e[3]=l,t[0]=h,t[1]=u,this.update())}_frameMatchesTransform(e){let t=this._uvTransformRow0,r=this._uvOffset,i=e.uvs;return t[0]===Math.fround(i.x1-i.x0)&&t[1]===Math.fround(i.x3-i.x0)&&t[2]===Math.fround(i.y1-i.y0)&&t[3]===Math.fround(i.y3-i.y0)&&r[0]===Math.fround(i.x0)&&r[1]===Math.fround(i.y0)}clone(t){let r=this._toOptions(),i=(0,b.S6_)(t??{});for(let[e,t]of Object.entries(i)){let i=r[e];r[e]="descriptor"!==e&&P(t)&&P(i)?{...i,...(0,b.S6_)(t)}:t}let s=this.extraBits,a=i.extraBits?.filter(e=>!s.some(t=>t.name===e.name))??[];r.extraBits=[...s,...a];let o=new this.constructor(r),l=o.data;if(this._toOptions===e.prototype._toOptions){for(let e of Object.keys(Object.getPrototypeOf(this.data)))!A.has(e)&&e in l&&(l[e]=this.data[e]);let e=i.textures??{};for(let t in this._slotByName){let r=o._slotByName[t],s="baseColor"===t?i.baseColorTexture??e.baseColor:e[t];void 0!==r&&void 0===s&&o._setTextureSlot(r,this._textures[this._slotByName[t]])}}else for(let e of s)for(let t in e.bindings?.material)l[t]=this.data[t];let h=o.state,{blend:u,depthMask:d,culling:c,blendMode:f}=h;return(0,n.h)(h,this.state),"alphaMode"in i&&(h.blend=u,h.depthMask=d),"doubleSided"in i&&(h.culling=c),"blendMode"in i&&(h.blendMode=f),o.colorSpace=this.colorSpace,o.lit=this.lit,o}_toOptions(){let e={};for(let t=this._passBit&~l.J.MATERIAL_PASS_MASK;t;t&=t-1){let r=t&-t,i=s.w.nameOf(r);i&&(e[i]=this._passes[r]??!0)}let t={};for(let e of(0,v.sL)(this.extraBits))t[e]=this._textures[this._slotByName[e]];return{label:this.label,descriptor:this._descriptorOptions,baseColor:this.baseColor,alpha:this.alpha,baseColorTexture:this._textures[this._slotByName.baseColor],textures:t,alphaMode:this.alphaMode,alphaCutoff:this.alphaCutoff,doubleSided:this.doubleSided,flatShading:this.flatShading,fog:this.fog,vertexColors:this.vertexColors,topology:this.topology,passes:e,uvTransform:this._uvTransformExplicit?this.uvTransform:void 0}}unload(){if(this.destroyed)return;this._releaseBindGroup(),this._markDescriptorDirty();let e=new Set;for(let t of this._textures){if(!t||p.X6.has(t))continue;let r=t.source;!r||e.has(r)||(e.add(r),"unknown"!==r.uploadMethodId&&r.unload())}}destroy(e){if(!this.destroyed){if(this.destroyed=!0,this._releaseBindGroup(),(0,i.M)(e,"texture")){let t=(0,i.M)(e,"textureSource")?new Set:void 0;for(let e of this._textures)if(!(!e||p.X6.has(e)))if(t){let r=e.source;e.destroy(!1),r&&!t.has(r)&&(t.add(r),r.destroy())}else e.destroy(!1)}this._uploadQueue?.remove(this),this._uploadQueue=null,this._storeQueued=!1,this._meshes.clear(),this._uniformResource?.destroy(!1),this._uniformResource=null,this.data=null,this.textures=null,this._textures=null,this._slotByName=null,this._descriptor=void 0,this._passes=null,this._uvTransformRow0=void 0,this._uvOffset=void 0,this._descriptorOptions=null}}_refreshTextureBindings(){this._bindGroup&&this._refreshTextureBindingsOf(this._bindGroup),this._mergedBindGroup&&this._refreshTextureBindingsOf(this._mergedBindGroup)}_refreshTextureBindingsOf(e){let t=this._textures;for(let r=0;r<t.length;r++){let i=t[r].source;e.setResourceUnwatched(i,2*r),i.style&&e.setResourceUnwatched(i.style,2*r+1)}!function(e){let t=e.resources,r=e._resourceKeys;for(let i=0;i<r.length;i++){let s=r[i],a=t[s];if(!a)continue;if(a.destroyed){t[s]=null,e._rekey(s,-1);continue}let o=a._resourceId;e._keyedIds[s]!==o&&e._rekey(s,o)}}(e)}_releaseBindGroup(){this._bindGroup=null,this._mergedBindGroup=null}}},41987(e,t,r){r.d(t,{R:()=>s});var i=r(63116);function s(e){return{shaderDescriptor:void 0===e.shaderDescriptor?void 0:e.shaderDescriptor instanceof i.X?e.shaderDescriptor:new i.X(e.shaderDescriptor),state:e.state,topology:e.topology}}},76972(e,t,r){r.d(t,{UV:()=>s,eD:()=>n,sL:()=>o,zI:()=>a});var i=r(39997);function s(e){return{structSnapshot:(0,i.F)((0,i.R)(e)),textureNames:o(e)}}function a(e,t){let r=e.structSnapshot;if(r!==t._materialStructSnapshot)throw Error(`[validateMaterialStruct] Compiled Material struct does not match the material's construction-time layout.
  compiled:     ${r}
  construction: ${t._materialStructSnapshot}
Material-group struct fields may only come from construction-pinned bits \u{2014} a per-mesh/per-view bit is declaring \`bindings.material\` fields, or a custom getPrimaryDescriptor diverges from its constructor.`)}function o(e){let t=[];for(let r of e)if(r.textures)for(let e of r.textures)t.push(e);return t}function n(e,t){let r=e.textureNames;for(let e=0;e<r.length;e++)if(t._slotByName[r[e]]!==e)throw Error(`[validateMaterialTextureSlots] Shader texture slots do not match the material's derived layout. Shader order: [${r.join(", ")}]; material slots: ${JSON.stringify(t._slotByName)}. Every texture-bearing bit must be part of the material's texture derivation.`);if(r.length!==t._textures.length)throw Error(`[validateMaterialTextureSlots] Material allocates ${t._textures.length} texture slot(s) but the shader declares ${r.length} ([${r.join(", ")}]). Slots and bit declarations must derive together.`)}},36384(e,t,r){r.d(t,{k:()=>a});var i=r(49491),s=r(54537),a=class e{elements;elements64;array=null;static multiplyAffineTo3x4(e,t,r,i,s,a){let o=r[i+0],n=r[i+1],l=r[i+2],h=r[i+4],u=r[i+5],d=r[i+6],c=r[i+8],f=r[i+9],p=r[i+10],m=r[i+12],_=r[i+13],g=r[i+14],x=s[a+0],y=s[a+1],v=s[a+2],b=s[a+4],w=s[a+5],T=s[a+6],C=s[a+8],S=s[a+9],D=s[a+10],M=s[a+12],B=s[a+13],I=s[a+14];e[t+0]=o*x+h*y+c*v,e[t+1]=o*b+h*w+c*T,e[t+2]=o*C+h*S+c*D,e[t+3]=o*M+h*B+c*I+m,e[t+4]=n*x+u*y+f*v,e[t+5]=n*b+u*w+f*T,e[t+6]=n*C+u*S+f*D,e[t+7]=n*M+u*B+f*I+_,e[t+8]=l*x+d*y+p*v,e[t+9]=l*b+d*w+p*T,e[t+10]=l*C+d*S+p*D,e[t+11]=l*M+d*B+p*I+g}static multiplyAffine(e,t,r,i,s,a){let o=r[i+0],n=r[i+1],l=r[i+2],h=r[i+4],u=r[i+5],d=r[i+6],c=r[i+8],f=r[i+9],p=r[i+10],m=r[i+12],_=r[i+13],g=r[i+14],x=s[a+0],y=s[a+1],v=s[a+2],b=s[a+4],w=s[a+5],T=s[a+6],C=s[a+8],S=s[a+9],D=s[a+10],M=s[a+12],B=s[a+13],I=s[a+14];e[t+0]=o*x+h*y+c*v,e[t+1]=n*x+u*y+f*v,e[t+2]=l*x+d*y+p*v,e[t+3]=0,e[t+4]=o*b+h*w+c*T,e[t+5]=n*b+u*w+f*T,e[t+6]=l*b+d*w+p*T,e[t+7]=0,e[t+8]=o*C+h*S+c*D,e[t+9]=n*C+u*S+f*D,e[t+10]=l*C+d*S+p*D,e[t+11]=0,e[t+12]=o*M+h*B+c*I+m,e[t+13]=n*M+u*B+f*I+_,e[t+14]=l*M+d*B+p*I+g,e[t+15]=1}static get shared(){return f.identity()}static get IDENTITY(){return p.identity()}constructor(e){this.elements=e||new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);let t=this.elements;this.elements64=new Float64Array(t.buffer,t.byteOffset,8)}set(e,t,r,i,s,a,o,n,l,h,u,d,c,f,p,m){let _=this.elements;return _[0]=e,_[1]=s,_[2]=l,_[3]=c,_[4]=t,_[5]=a,_[6]=h,_[7]=f,_[8]=r,_[9]=o,_[10]=u,_[11]=p,_[12]=i,_[13]=n,_[14]=d,_[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)}isIdentity(){let e=this.elements;return 1===e[0]&&0===e[1]&&0===e[2]&&0===e[3]&&0===e[4]&&1===e[5]&&0===e[6]&&0===e[7]&&0===e[8]&&0===e[9]&&1===e[10]&&0===e[11]&&0===e[12]&&0===e[13]&&0===e[14]&&1===e[15]}copyFrom(e){let t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyTo(e){let t=e.elements,r=this.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],e}equals(e){let t=this.elements,r=e.elements;return t[0]===r[0]&&t[1]===r[1]&&t[2]===r[2]&&t[3]===r[3]&&t[4]===r[4]&&t[5]===r[5]&&t[6]===r[6]&&t[7]===r[7]&&t[8]===r[8]&&t[9]===r[9]&&t[10]===r[10]&&t[11]===r[11]&&t[12]===r[12]&&t[13]===r[13]&&t[14]===r[14]&&t[15]===r[15]}clone(){return new e().copyFrom(this)}toString(){let e=this.elements;return`[@pixi/3d/math:Matrix4 [${e[0]}, ${e[4]}, ${e[8]}, ${e[12]} | ${e[1]}, ${e[5]}, ${e[9]}, ${e[13]} | ${e[2]}, ${e[6]}, ${e[10]}, ${e[14]} | ${e[3]}, ${e[7]}, ${e[11]}, ${e[15]}]]`}fromArray(e,t=0){let r=this.elements;return r[0]=e[t],r[1]=e[t+1],r[2]=e[t+2],r[3]=e[t+3],r[4]=e[t+4],r[5]=e[t+5],r[6]=e[t+6],r[7]=e[t+7],r[8]=e[t+8],r[9]=e[t+9],r[10]=e[t+10],r[11]=e[t+11],r[12]=e[t+12],r[13]=e[t+13],r[14]=e[t+14],r[15]=e[t+15],this}toArray(e,t){this.array||(this.array=new Float32Array(16));let r=t||this.array,i=this.elements;return e?(r[0]=i[0],r[1]=i[4],r[2]=i[8],r[3]=i[12],r[4]=i[1],r[5]=i[5],r[6]=i[9],r[7]=i[13],r[8]=i[2],r[9]=i[6],r[10]=i[10],r[11]=i[14],r[12]=i[3],r[13]=i[7],r[14]=i[11]):(r[0]=i[0],r[1]=i[1],r[2]=i[2],r[3]=i[3],r[4]=i[4],r[5]=i[5],r[6]=i[6],r[7]=i[7],r[8]=i[8],r[9]=i[9],r[10]=i[10],r[11]=i[11],r[12]=i[12],r[13]=i[13],r[14]=i[14]),r[15]=i[15],r}multiply(e,t=this){return o(this,e,t),t}premultiply(e,t=this){return o(e,this,t),t}multiplyMatrices(e,t,r=this){return o(e,t,r),r}multiplyScalar(e,t=this){let r=t.elements,i=this.elements;return r[0]=i[0]*e,r[4]=i[4]*e,r[8]=i[8]*e,r[12]=i[12]*e,r[1]=i[1]*e,r[5]=i[5]*e,r[9]=i[9]*e,r[13]=i[13]*e,r[2]=i[2]*e,r[6]=i[6]*e,r[10]=i[10]*e,r[14]=i[14]*e,r[3]=i[3]*e,r[7]=i[7]*e,r[11]=i[11]*e,r[15]=i[15]*e,t}append(e,t=this){return this.multiply(e,t)}prepend(e,t=this){return this.premultiply(e,t)}appendFrom(e,t,r=this){return this.multiplyMatrices(e,t,r)}determinant(){let e=this.elements,t=e[0],r=e[4],i=e[8],s=e[12],a=e[1],o=e[5],n=e[9],l=e[13],h=e[2],u=e[6],d=e[10],c=e[14];return e[3]*(s*n*u-i*l*u-s*o*d+r*l*d+i*o*c-r*n*c)+e[7]*(t*n*c-t*l*d+s*a*d-i*a*c+i*l*h-s*n*h)+e[11]*(t*l*u-t*o*c-s*a*u+r*a*c+s*o*h-r*l*h)+e[15]*(-i*o*h-t*n*u+t*o*d+i*a*u-r*a*d+r*n*h)}transpose(e=this){let t=this.elements,r=e.elements,i=t[0],s=t[1],a=t[2],o=t[3],n=t[4],l=t[5],h=t[6],u=t[7],d=t[8],c=t[9],f=t[10],p=t[11],m=t[12],_=t[13],g=t[14],x=t[15];return r[0]=i,r[1]=n,r[4]=s,r[2]=d,r[8]=a,r[5]=l,r[6]=c,r[9]=h,r[10]=f,r[3]=m,r[12]=o,r[7]=_,r[13]=u,r[11]=g,r[14]=p,r[15]=x,e}getInverse(e,t,r=this){let i=r.elements,a=e.elements,o=a[0],n=a[1],l=a[2],h=a[3],u=a[4],d=a[5],c=a[6],f=a[7],p=a[8],m=a[9],_=a[10],g=a[11],x=a[12],y=a[13],v=a[14],b=a[15],w=m*v*f-y*_*f+y*c*g-d*v*g-m*c*b+d*_*b,T=x*_*f-p*v*f-x*c*g+u*v*g+p*c*b-u*_*b,C=p*y*f-x*m*f+x*d*g-u*y*g-p*d*b+u*m*b,S=x*m*c-p*y*c-x*d*_+u*y*_+p*d*v-u*m*v,D=o*w+n*T+l*C+h*S;if(0===D){let e="Matrix4: .getInverse() can't invert matrix, determinant is 0";if(!0===t)throw Error(e);return(0,s.R8M)(e),r.identity(),r}let M=1/D;return i[0]=w*M,i[1]=(y*_*h-m*v*h-y*l*g+n*v*g+m*l*b-n*_*b)*M,i[2]=(d*v*h-y*c*h+y*l*f-n*v*f-d*l*b+n*c*b)*M,i[3]=(m*c*h-d*_*h-m*l*f+n*_*f+d*l*g-n*c*g)*M,i[4]=T*M,i[5]=(p*v*h-x*_*h+x*l*g-o*v*g-p*l*b+o*_*b)*M,i[6]=(x*c*h-u*v*h-x*l*f+o*v*f+u*l*b-o*c*b)*M,i[7]=(u*_*h-p*c*h+p*l*f-o*_*f-u*l*g+o*c*g)*M,i[8]=C*M,i[9]=(x*m*h-p*y*h-x*n*g+o*y*g+p*n*b-o*m*b)*M,i[10]=(u*y*h-x*d*h+x*n*f-o*y*f-u*n*b+o*d*b)*M,i[11]=(p*d*h-u*m*h-p*n*f+o*m*f+u*n*g-o*d*g)*M,i[12]=S*M,i[13]=(p*y*l-x*m*l+x*n*_-o*y*_-p*n*v+o*m*v)*M,i[14]=(x*d*l-u*y*l-x*n*c+o*y*c+u*n*v-o*d*v)*M,i[15]=(u*m*l-p*d*l+p*n*c-o*m*c-u*n*_+o*d*_)*M,r}compose(e,t,r,i=this){let s=i.elements,a=t.x,o=t.y,n=t.z,l=t.w,h=a+a,u=o+o,d=n+n,c=a*h,f=a*u,p=a*d,m=o*u,_=o*d,g=n*d,x=l*h,y=l*u,v=l*d,b=r.x,w=r.y,T=r.z;return s[0]=(1-(m+g))*b,s[1]=(f+v)*b,s[2]=(p-y)*b,s[3]=0,s[4]=(f-v)*w,s[5]=(1-(c+g))*w,s[6]=(_+x)*w,s[7]=0,s[8]=(p+y)*T,s[9]=(_-x)*T,s[10]=(1-(c+m))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,i}decompose(e,t,r,i=this){i!==this&&i.copyFrom(this);let s=i.elements,a=s[0],o=s[1],n=s[2],l=s[4],h=s[5],d=s[6],c=s[8],f=s[9],p=s[10],m=Math.sqrt(a*a+o*o+n*n),_=Math.sqrt(l*l+h*h+d*d),g=Math.sqrt(c*c+f*f+p*p);a*(h*p-d*f)-l*(o*p-n*f)+c*(o*d-n*h)<0&&(m=-m),e.x=s[12],e.y=s[13],e.z=s[14];let x=1/m,y=1/_,v=1/g,b=u.elements;return b[0]=a*x,b[1]=o*x,b[2]=n*x,b[4]=l*y,b[5]=h*y,b[6]=d*y,b[8]=c*v,b[9]=f*v,b[10]=p*v,t.setFromRotationMatrix(u),r.x=m,r.y=_,r.z=g,i}makeTranslation(e,t,r){return this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1)}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1)}makeShear(e,t,r){return this.set(1,t,r,0,e,1,r,0,e,t,1,0,0,0,0,1)}makeRotationX(e){let t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1)}makeRotationY(e){let t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1)}makeRotationZ(e){let t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1)}makeRotationAxis(e,t){let r=Math.cos(t),i=Math.sin(t),s=1-r,a=e.x,o=e.y,n=e.z,l=s*a,h=s*o;return this.set(l*a+r,l*o-i*n,l*n+i*o,0,l*o+i*n,h*o+r,h*n-i*a,0,l*n-i*o,h*n+i*a,s*n*n+r,0,0,0,0,1)}makeRotationFromEuler(e){let t=this.elements,r=Math.cos(e.x),i=Math.sin(e.x),s=Math.cos(e.y),a=Math.sin(e.y),o=Math.cos(e.z),n=Math.sin(e.z),l=r*o,h=r*n,u=i*o,d=i*n;return t[0]=s*o,t[4]=-s*n,t[8]=a,t[1]=h+u*a,t[5]=l-d*a,t[9]=-i*s,t[2]=d-l*a,t[6]=u+h*a,t[10]=r*s,t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(d,e,c)}makePerspective(e,t,r,i){let s=this.elements,a=1/Math.tan(e/2);if(s[0]=a/t,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=a,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[11]=-1,s[12]=0,s[13]=0,s[15]=0,void 0!==i&&i!==1/0){let e=1/(r-i);s[10]=(i+r)*e,s[14]=2*i*r*e}else s[10]=-1,s[14]=-2*r;return this}makeOrthographic(e,t,r,i,s,a){let o=this.elements,n=1/(e-t),l=1/(i-r),h=1/(s-a);return o[0]=-2*n,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=-2*l,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=2*h,o[11]=0,o[12]=(e+t)*n,o[13]=(r+i)*l,o[14]=(a+s)*h,o[15]=1,this}lookAt(e,t,r,i=this){i!==this&&i.copyFrom(this);let s=i.elements;return h.x=e.x-t.x,h.y=e.y-t.y,h.z=e.z-t.z,0===h.magnitudeSquared()&&(h.z=1),h.normalize(),n.copyFrom(r).cross(h),0===n.magnitudeSquared()&&(1===Math.abs(r.z)?h.x+=1e-4:h.z+=1e-4,h.normalize(),n.copyFrom(r).cross(h)),n.normalize(),l.copyFrom(h).cross(n),s[0]=n.x,s[4]=l.x,s[8]=h.x,s[1]=n.y,s[5]=l.y,s[9]=h.y,s[2]=n.z,s[6]=l.z,s[10]=h.z,i}setPosition(e,t=this){t!==this&&t.copyFrom(this);let r=t.elements;return r[12]=e.x,r[13]=e.y,r[14]=e.z,t}scale(e,t=this){t!==this&&t.copyFrom(this);let r=t.elements,i=e.x,s=e.y,a=e.z;return r[0]*=i,r[4]*=s,r[8]*=a,r[1]*=i,r[5]*=s,r[9]*=a,r[2]*=i,r[6]*=s,r[10]*=a,r[3]*=i,r[7]*=s,r[11]*=a,t}extractPosition(e){let t=this.elements;return e.set(t[12],t[13],t[14]),e}extractScale(e){let t=this.elements;return e.set(Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]),Math.sqrt(t[4]*t[4]+t[5]*t[5]+t[6]*t[6]),Math.sqrt(t[8]*t[8]+t[9]*t[9]+t[10]*t[10])),e}extractBasis(e,t,r,i=this){return i!==this&&i.copyFrom(this),e.setFromMatrixColumn(i,0),t.setFromMatrixColumn(i,1),r.setFromMatrixColumn(i,2),i}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1)}extractRotation(e,t=this){let r=t.elements,i=e.elements,s=1/n.setFromMatrixColumn(e,0).magnitude(),a=1/n.setFromMatrixColumn(e,1).magnitude(),o=1/n.setFromMatrixColumn(e,2).magnitude();return r[0]=i[0]*s,r[1]=i[1]*s,r[2]=i[2]*s,r[3]=0,r[4]=i[4]*a,r[5]=i[5]*a,r[6]=i[6]*a,r[7]=0,r[8]=i[8]*o,r[9]=i[9]*o,r[10]=i[10]*o,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,t}extractForward(e){let t=this.elements,r=-t[8],i=-t[9],s=-t[10],a=1/(Math.sqrt(r*r+i*i+s*s)||1);return r*=a,i*=a,s*=a,e.set(r,i,s),e}extractRight(e){let t=this.elements,r=t[0],i=t[1],s=t[2],a=1/(Math.sqrt(r*r+i*i+s*s)||1);return r*=a,i*=a,s*=a,e.set(r,i,s),e}extractUp(e){let t=this.elements,r=t[4],i=t[5],s=t[6],a=1/(Math.sqrt(r*r+i*i+s*s)||1);return r*=a,i*=a,s*=a,e.set(r,i,s),e}getMaxScaleOnAxis(){let e=this.elements;return Math.sqrt(Math.max(e[0]*e[0]+e[1]*e[1]+e[2]*e[2],e[4]*e[4]+e[5]*e[5]+e[6]*e[6],e[8]*e[8]+e[9]*e[9]+e[10]*e[10]))}getMaxSingularValueSq(){let e=this.elements,t=e[0],r=e[1],i=e[2],s=e[4],a=e[5],o=e[6],n=e[8],l=e[9],h=e[10],u=t*t+r*r+i*i,d=s*s+a*a+o*o,c=n*n+l*l+h*h,f=t*s+r*a+i*o,p=t*n+r*l+i*h,m=s*n+a*l+o*h,_=f*f+p*p+m*m;if(0===_)return Math.max(u,d,c);let g=(u+d+c)/3,x=u-g,y=d-g,v=c-g,b=Math.sqrt((x*x+y*y+v*v+2*_)/6),w=y/b,T=v/b,C=f/b,S=p/b,D=m/b,M=Math.max(-1,Math.min(1,(x/b*(w*T-D*D)-C*(C*T-D*S)+S*(C*D-w*S))/2));return Math.max(g+2*b*Math.cos(Math.acos(M)/3),0)}};function o(e,t,r){let i=e.elements,s=t.elements,a=r.elements,o=i[0],n=i[4],l=i[8],h=i[12],u=i[1],d=i[5],c=i[9],f=i[13],p=i[2],m=i[6],_=i[10],g=i[14],x=i[3],y=i[7],v=i[11],b=i[15],w=s[0],T=s[4],C=s[8],S=s[12],D=s[1],M=s[5],B=s[9],I=s[13],P=s[2],A=s[6],F=s[10],R=s[14],k=s[3],z=s[7],V=s[11],L=s[15];return a[0]=o*w+n*D+l*P+h*k,a[4]=o*T+n*M+l*A+h*z,a[8]=o*C+n*B+l*F+h*V,a[12]=o*S+n*I+l*R+h*L,a[1]=u*w+d*D+c*P+f*k,a[5]=u*T+d*M+c*A+f*z,a[9]=u*C+d*B+c*F+f*V,a[13]=u*S+d*I+c*R+f*L,a[2]=p*w+m*D+_*P+g*k,a[6]=p*T+m*M+_*A+g*z,a[10]=p*C+m*B+_*F+g*V,a[14]=p*S+m*I+_*R+g*L,a[3]=x*w+y*D+v*P+b*k,a[7]=x*T+y*M+v*A+b*z,a[11]=x*C+y*B+v*F+b*V,a[15]=x*S+y*I+v*R+b*L,r}let n=new i.P,l=new i.P,h=new i.P,u=new a,d=new i.P(0,0,0),c=new i.P(1,1,1),f=new a,p=new a},97416(e,t,r){r.d(t,{P:()=>s});var i=r(4874),s=class e{_planes;constructor(e,t,r,i,s,a){this._planes=new Float32Array(24);for(let e=0;e<24;e+=4)this._planes[e]=1;void 0!==e&&this._writePlane(0,e),void 0!==t&&this._writePlane(1,t),void 0!==r&&this._writePlane(2,r),void 0!==i&&this._writePlane(3,i),void 0!==s&&this._writePlane(4,s),void 0!==a&&this._writePlane(5,a)}get planesData(){return this._planes}set(e,t,r,i,s,a){return this._writePlane(0,e),this._writePlane(1,t),this._writePlane(2,r),this._writePlane(3,i),this._writePlane(4,s),this._writePlane(5,a),this}setFromProjectionMatrix(e){let t=e.elements,r=t[0],i=t[1],s=t[2],o=t[3],n=t[4],l=t[5],h=t[6],u=t[7],d=t[8],c=t[9],f=t[10],p=t[11],m=t[12],_=t[13],g=t[14],x=t[15],y=this._planes;return a(y,0,o-r,u-n,p-d,x-m),a(y,4,o+r,u+n,p+d,x+m),a(y,8,o+i,u+l,p+c,x+_),a(y,12,o-i,u-l,p-c,x-_),a(y,16,o-s,u-h,p-f,x-g),a(y,20,o+s,u+h,p+f,x+g),this}copyFrom(e){return this._planes.set(e._planes),this}copyTo(e){return e._planes.set(this._planes),e}clone(){return new e().copyFrom(this)}equals(e){let t=this._planes,r=e._planes;for(let e=0;e<24;e++)if(t[e]!==r[e])return!1;return!0}getPlane(e,t){t||=new i.Z;let r=4*e;return t.normal.set(this._planes[r],this._planes[r+1],this._planes[r+2]),t.constant=this._planes[r+3],t}containsPoint(e){let t=this._planes,r=e.x,i=e.y,s=e.z;for(let e=0;e<24;e+=4)if(t[e]*r+t[e+1]*i+t[e+2]*s+t[e+3]<0)return!1;return!0}intersectsBox(e){let t=this._planes,r=e.min.x,i=e.min.y,s=e.min.z,a=e.max.x,o=e.max.y,n=e.max.z;for(let e=0;e<24;e+=4){let l=t[e],h=t[e+1],u=t[e+2],d=l>0?a:r,c=h>0?o:i,f=u>0?n:s;if(l*d+h*c+u*f+t[e+3]<0)return!1}return!0}intersectsSphere(e){if(e.radius<0)return!1;let t=this._planes,r=e.center.x,i=e.center.y,s=e.center.z,a=-e.radius;for(let e=0;e<24;e+=4)if(t[e]*r+t[e+1]*i+t[e+2]*s+t[e+3]<a)return!1;return!0}toString(){return"[@pixi/3d/math:Frustum]"}_writePlane(e,t){let r=4*e;this._planes[r]=t.normal.x,this._planes[r+1]=t.normal.y,this._planes[r+2]=t.normal.z,this._planes[r+3]=t.constant}};function a(e,t,r,i,s,a){let o=1/Math.sqrt(r*r+i*i+s*s);e[t]=r*o,e[t+1]=i*o,e[t+2]=s*o,e[t+3]=a*o}},83039(e,t,r){r.d(t,{W:()=>a});var i=r(75290),s=r(53608),a=class e{_x=0;_y=0;_z=0;_w=0;_observer;get x(){return this._x}set x(e){this._x!==e&&(this._x=e,this._observer._onUpdate(this))}get y(){return this._y}set y(e){this._y!==e&&(this._y=e,this._observer._onUpdate(this))}get z(){return this._z}set z(e){this._z!==e&&(this._z=e,this._observer._onUpdate(this))}get w(){return this._w}set w(e){this._w!==e&&(this._w=e,this._observer._onUpdate(this))}constructor(e,t=0,r=0,i=0,s=1){this._x=t,this._y=r,this._z=i,this._w=s,this._observer=e}set(e,t,r,i){return(this._x!==e||this._y!==t||this._z!==r||this._w!==i)&&(this._x=e,this._y=t,this._z=r,this._w=i,this._observer._onUpdate(this)),this}copyFrom(e){return(this._x!==e.x||this._y!==e.y||this._z!==e.z||this._w!==e.w)&&(this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._observer._onUpdate(this)),this}copyTo(e){return e.x=this._x,e.y=this._y,e.z=this._z,e.w=this._w,e}clone(t){return new e(t??this._observer,this._x,this._y,this._z,this._w)}identity(){return this.set(0,0,0,1)}equals(e){return e.x===this._x&&e.y===this._y&&e.z===this._z&&e.w===this._w}setFromEuler(e,t=this){return t===this?(o.setFromEuler(e),this.set(o.x,o.y,o.z,o.w)):(o.setFromEuler(e,t),t)}setFromAxisAngle(e,t,r=this){return r===this?(o.setFromAxisAngle(e,t),this.set(o.x,o.y,o.z,o.w)):(o.setFromAxisAngle(e,t,r),r)}setFromRotationMatrix(e,t=this){return t===this?(o.setFromRotationMatrix(e),this.set(o.x,o.y,o.z,o.w)):(o.setFromRotationMatrix(e,t),t)}setFromScaledRotationMatrix(e,t=this){return t===this?(o.setFromScaledRotationMatrix(e),this.set(o.x,o.y,o.z,o.w)):(o.setFromScaledRotationMatrix(e,t),t)}setFromUnitVectors(e,t,r=this){return r===this?(o.setFromUnitVectors(e,t),this.set(o.x,o.y,o.z,o.w)):(o.setFromUnitVectors(e,t,r),r)}dot(e){return this._x*e.x+this._y*e.y+this._z*e.z+this._w*e.w}angleTo(e){return 2*Math.acos(Math.abs((0,i.q)(this.dot(e),-1,1)))}magnitude(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}magnitudeSquared(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}normalize(e=this){let t,r,i,s,a=Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w);if(0===a)t=0,r=0,i=0,s=1;else{let e=1/a;t=this._x*e,r=this._y*e,i=this._z*e,s=this._w*e}return e===this?this.set(t,r,i,s):(e.x=t,e.y=r,e.z=i,e.w=s,e)}inverse(e=this){return this.conjugate(e)}conjugate(e=this){return e===this?this.set(-this._x,-this._y,-this._z,this._w):(e.x=-this._x,e.y=-this._y,e.z=-this._z,e.w=this._w,e)}multiply(e,t=this){return t===this?((0,s.d)(this,e,o),this.set(o.x,o.y,o.z,o.w)):((0,s.d)(this,e,t),t)}premultiply(e,t=this){return t===this?((0,s.d)(e,this,o),this.set(o.x,o.y,o.z,o.w)):((0,s.d)(e,this,t),t)}slerp(e,t,r=this){return(o.set(this._x,this._y,this._z,this._w).slerp(e,t),r===this)?this.set(o.x,o.y,o.z,o.w):(r.x=o.x,r.y=o.y,r.z=o.z,r.w=o.w,r)}fromArray(e,t=0){return this.set(e[t],e[t+1],e[t+2],e[t+3])}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}toString(){return`[@pixi/3d/math:ObservableQuaternion x=${this._x} y=${this._y} z=${this._z} w=${this._w}]`}};let o=new s.P},53608(e,t,r){r.d(t,{P:()=>s,d:()=>o});var i=r(75290),s=class e{x=0;y=0;z=0;w=0;static get shared(){return l.x=0,l.y=0,l.z=0,l.w=1,l}static slerpFlat(e,t,r,i,s,a,o){let n=r[i+0],l=r[i+1],h=r[i+2],u=r[i+3],d=s[a+0],c=s[a+1],f=s[a+2],p=s[a+3];if(u!==p||n!==d||l!==c||h!==f){let e=n*d+l*c+h*f+u*p;e<0&&(d=-d,c=-c,f=-f,p=-p,e=-e);let t=1-o,r=o;if(e<.9995){let i=Math.sin(o*Math.acos(e));r=i/Math.sqrt(1-e*e),n=n*(t=Math.sqrt(1-i*i)-e*r)+d*r,l=l*t+c*r,h=h*t+f*r,u=u*t+p*r}else{let e=1/Math.sqrt((n=n*t+d*r)*n+(l=l*t+c*r)*l+(h=h*t+f*r)*h+(u=u*t+p*r)*u);n*=e,l*=e,h*=e,u*=e}}e[t]=n,e[t+1]=l,e[t+2]=h,e[t+3]=u}constructor(e=0,t=0,r=0,i=1){this.x=e,this.y=t,this.z=r,this.w=i}set(e,t,r,i){return this.x=e,this.y=t,this.z=r,this.w=i,this}copyFrom(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}copyTo(e){return e.x=this.x,e.y=this.y,e.z=this.z,e.w=this.w,e}clone(){return new e(this.x,this.y,this.z,this.w)}identity(){return this.x=0,this.y=0,this.z=0,this.w=1,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}setFromEuler(e,t=this){let r=.5*e.x,i=.5*e.y,s=.5*e.z,a=Math.cos(r),o=Math.cos(i),n=Math.cos(s),l=Math.sin(r),h=Math.sin(i),u=Math.sin(s);return t.x=l*o*n+a*h*u,t.y=a*h*n-l*o*u,t.z=a*o*u+l*h*n,t.w=a*o*n-l*h*u,t}setFromAxisAngle(e,t,r=this){let i=t/2,s=Math.sin(i);return r.x=e.x*s,r.y=e.y*s,r.z=e.z*s,r.w=Math.cos(i),r}setFromRotationMatrix(e,t=this){let r=e.elements;return a(t,r[0],r[4],r[8],r[1],r[5],r[9],r[2],r[6],r[10]),t}setFromScaledRotationMatrix(e,t=this){let r=e.elements,i=r[0],s=r[1],o=r[2],n=r[4],l=r[5],h=r[6],u=r[8],d=r[9],c=r[10],f=1/Math.sqrt(i*i+s*s+o*o),p=1/Math.sqrt(n*n+l*l+h*h),m=1/Math.sqrt(u*u+d*d+c*c);return i*=f,s*=f,o*=f,n*=p,l*=p,h*=p,a(t,i,n,u*=m,s,l,d*=m,o,h,c*=m),t}setFromUnitVectors(e,t,r=this){let i=e.x*t.x+e.y*t.y+e.z*t.z+1;return i<1e-6?(i=0,Math.abs(e.x)>Math.abs(e.z)?(r.x=-e.y,r.y=e.x,r.z=0):(r.x=0,r.y=-e.z,r.z=e.y)):(r.x=e.y*t.z-e.z*t.y,r.y=e.z*t.x-e.x*t.z,r.z=e.x*t.y-e.y*t.x),r.w=i,n(r)}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}angleTo(e){return 2*Math.acos(Math.abs((0,i.q)(this.dot(e),-1,1)))}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}normalize(e=this){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(0===t)e.x=0,e.y=0,e.z=0,e.w=1;else{let r=1/t;e.x=this.x*r,e.y=this.y*r,e.z=this.z*r,e.w=this.w*r}return e}inverse(e=this){return this.conjugate(e)}conjugate(e=this){return e.x=-this.x,e.y=-this.y,e.z=-this.z,e.w=this.w,e}multiply(e,t=this){return o(this,e,t)}premultiply(e,t=this){return o(e,this,t)}slerp(e,t,r=this){if(0===t)return r!==this&&(r.x=this.x,r.y=this.y,r.z=this.z,r.w=this.w),r;if(1===t)return r.x=e.x,r.y=e.y,r.z=e.z,r.w=e.w,r;let i=this.x,s=this.y,a=this.z,o=this.w,l=e.x,h=e.y,u=e.z,d=e.w,c=i*l+s*h+a*u+o*d;c<0&&(l=-l,h=-h,u=-u,d=-d,c=-c);let f=1-t,p=t;if(c<.9995){let e=Math.acos(c),n=Math.sin(e);return r.x=i*(f=Math.sin(f*e)/n)+l*(p=Math.sin(t*e)/n),r.y=s*f+h*p,r.z=a*f+u*p,r.w=o*f+d*p,r}return r.x=i*f+l*p,r.y=s*f+h*p,r.z=a*f+u*p,r.w=o*f+d*p,n(r)}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}toString(){return`[@pixi/3d/math:Quaternion x=${this.x} y=${this.y} z=${this.z} w=${this.w}]`}};function a(e,t,r,i,s,a,o,n,l,h){let u,d=t+a+h;d>0?(e.w=.25/(u=.5/Math.sqrt(d+1)),e.x=(l-o)*u,e.y=(i-n)*u,e.z=(s-r)*u):t>a&&t>h?(e.w=(l-o)/(u=2*Math.sqrt(1+t-a-h)),e.x=.25*u,e.y=(r+s)/u,e.z=(i+n)/u):a>h?(e.w=(i-n)/(u=2*Math.sqrt(1+a-t-h)),e.x=(r+s)/u,e.y=.25*u,e.z=(o+l)/u):(e.w=(s-r)/(u=2*Math.sqrt(1+h-t-a)),e.x=(i+n)/u,e.y=(o+l)/u,e.z=.25*u)}function o(e,t,r){let i=e.x,s=e.y,a=e.z,o=e.w,n=t.x,l=t.y,h=t.z,u=t.w;return r.x=i*u+o*n+s*h-a*l,r.y=s*u+o*l+a*n-i*h,r.z=a*u+o*h+i*l-s*n,r.w=o*u-i*n-s*l-a*h,r}function n(e){let t=Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z+e.w*e.w);if(0===t)e.x=0,e.y=0,e.z=0,e.w=1;else{let r=1/t;e.x*=r,e.y*=r,e.z*=r,e.w*=r}return e}let l=new s},32955(e,t,r){r.d(t,{a:()=>s});var i=r(49491),s=class e{min;max;type="box";constructor(e,t){this.min=void 0!==e?e:new i.P(1/0,1/0,1/0),this.max=void 0!==t?t:new i.P(-1/0,-1/0,-1/0)}static fromCenterSize(t,r){let s=("number"==typeof r?r:r.x)*.5,a=("number"==typeof r?r:r.y)*.5,o=("number"==typeof r?r:r.z)*.5;return new e(new i.P(t.x-s,t.y-a,t.z-o),new i.P(t.x+s,t.y+a,t.z+o))}set(e,t){return this.min.copyFrom(e),this.max.copyFrom(t),this}copyFrom(e){return this.min.copyFrom(e.min),this.max.copyFrom(e.max),this}copyTo(e){return e.min.copyFrom(this.min),e.max.copyFrom(this.max),e}clone(){return new e().copyFrom(this)}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}expandByPoint(e,t=this){return t!==this&&t.copyFrom(this),t.min.min(e),t.max.max(e),t}union(e,t=this){return t!==this&&t.copyFrom(this),t.min.min(e.min),t.max.max(e.max),t}getCenter(e){return(e||=new i.P,this.isEmpty())?e.set(0,0,0):(e.x=(this.min.x+this.max.x)*.5,e.y=(this.min.y+this.max.y)*.5,e.z=(this.min.z+this.max.z)*.5,e)}getSize(e){return(e||=new i.P,this.isEmpty())?e.set(0,0,0):(e.x=this.max.x-this.min.x,e.y=this.max.y-this.min.y,e.z=this.max.z-this.min.z,e)}distanceToPoint(e){return a.copyFrom(e).clamp(this.min,this.max).distanceTo(e)}clampPoint(e,t){return(t||=new i.P).copyFrom(e).clamp(this.min,this.max)}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return!(e.radius<0)&&(this.clampPoint(e.center,a),a.distanceToSquared(e.center)<=e.radius*e.radius)}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsRay(e){return e.intersectsBox(this)}applyMatrix4(e,t=this){if(t!==this&&t.copyFrom(this),t.isEmpty())return t;let r=e.elements,i=(t.min.x+t.max.x)*.5,s=(t.min.y+t.max.y)*.5,a=(t.min.z+t.max.z)*.5,o=(t.max.x-t.min.x)*.5,n=(t.max.y-t.min.y)*.5,l=(t.max.z-t.min.z)*.5,h=r[0]*i+r[4]*s+r[8]*a+r[12],u=r[1]*i+r[5]*s+r[9]*a+r[13],d=r[2]*i+r[6]*s+r[10]*a+r[14],c=Math.abs(r[0])*o+Math.abs(r[4])*n+Math.abs(r[8])*l,f=Math.abs(r[1])*o+Math.abs(r[5])*n+Math.abs(r[9])*l,p=Math.abs(r[2])*o+Math.abs(r[6])*n+Math.abs(r[10])*l;return t.min.set(h-c,u-f,d-p),t.max.set(h+c,u+f,d+p),t}getBounds(t){return(t||=new e).copyFrom(this)}get width(){return this.max.x-this.min.x}get height(){return this.max.y-this.min.y}get depth(){return this.max.z-this.min.z}toString(){return`[@pixi/3d/math:Box min=(${this.min.x}, ${this.min.y}, ${this.min.z}) max=(${this.max.x}, ${this.max.y}, ${this.max.z})]`}};let a=new i.P},4874(e,t,r){r.d(t,{Z:()=>s});var i=r(49491),s=class e{normal;constant=0;type="plane";constructor(e,t=0){this.normal=void 0!==e?e:new i.P(1,0,0),this.constant=t}set(e,t){return this.normal.copyFrom(e),this.constant=t,this}setComponents(e,t,r,i){return this.normal.set(e,t,r),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copyFrom(e),this.constant=-(t.x*this.normal.x+t.y*this.normal.y+t.z*this.normal.z),this}copyFrom(e){return this.normal.copyFrom(e.normal),this.constant=e.constant,this}copyTo(e){return e.normal.copyFrom(this.normal),e.constant=this.constant,e}clone(){return new e().copyFrom(this)}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}normalize(e=this){e!==this&&e.copyFrom(this);let t=1/e.normal.magnitude();return e.normal.multiplyScalar(t),e.constant*=t,e}distanceToPoint(e){return this.normal.x*e.x+this.normal.y*e.y+this.normal.z*e.z+this.constant}projectPoint(e,t){return(t||=new i.P).copyFrom(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}intersectsRay(e){return e.intersectsPlane(this)}applyMatrix4(e,t=this){t!==this&&t.copyFrom(this);let r=e.elements,i=r[0],s=r[1],a=r[2],o=r[4],n=r[5],l=r[6],h=r[8],u=r[9],d=r[10],c=t.normal.x,f=t.normal.y,p=t.normal.z,m=(n*d-l*u)*c+(a*u-s*d)*f+(s*l-a*n)*p,_=(l*h-o*d)*c+(i*d-a*h)*f+(a*o-i*l)*p,g=(o*u-n*h)*c+(s*h-i*u)*f+(i*n-s*o)*p,x=1/(Math.sqrt(m*m+_*_+g*g)||1),y=m*x,v=_*x,b=g*x,w=-t.constant*c,T=-t.constant*f,C=-t.constant*p,S=i*w+o*T+h*C+r[12],D=s*w+n*T+u*C+r[13],M=a*w+l*T+d*C+r[14];return t.normal.set(y,v,b),t.constant=-(S*y+D*v+M*b),t}toString(){return`[@pixi/3d/math:Plane normal=(${this.normal.x}, ${this.normal.y}, ${this.normal.z}) constant=${this.constant}]`}}},87812(e,t,r){r.d(t,{R:()=>s});var i=r(49491),s=class e{origin;direction;type="ray";constructor(e,t){this.origin=void 0!==e?e:new i.P,this.direction=void 0!==t?t:new i.P(0,0,-1)}set(e,t){return this.origin.copyFrom(e),this.direction.copyFrom(t),this}copyFrom(e){return this.origin.copyFrom(e.origin),this.direction.copyFrom(e.direction),this}copyTo(e){return e.origin.copyFrom(this.origin),e.direction.copyFrom(this.direction),e}clone(){return new e().copyFrom(this)}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}at(e,t){return(t||=new i.P).x=this.origin.x+this.direction.x*e,t.y=this.origin.y+this.direction.y*e,t.z=this.origin.z+this.direction.z*e,t}closestPointToPoint(e,t){t||=new i.P;let r=e.x-this.origin.x,s=e.y-this.origin.y,a=e.z-this.origin.z,o=r*this.direction.x+s*this.direction.y+a*this.direction.z;return o<0?t.copyFrom(this.origin):t.copyFrom(this.origin).addScaledVector(this.direction,o)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=e.x-this.origin.x,r=e.y-this.origin.y,i=e.z-this.origin.z,s=t*this.direction.x+r*this.direction.y+i*this.direction.z;if(s<0)return this.origin.distanceToSquared(e);let a=this.origin.x+this.direction.x*s,o=this.origin.y+this.direction.y*s,n=this.origin.z+this.direction.z*s,l=a-e.x,h=o-e.y,u=n-e.z;return l*l+h*h+u*u}intersectSphere(e,t){let r=this.intersectSphereT(e);return -1===r?null:this.at(r,t)}intersectSphereT(e){if(e.radius<0)return -1;let t=e.center.x-this.origin.x,r=e.center.y-this.origin.y,i=e.center.z-this.origin.z,s=t*this.direction.x+r*this.direction.y+i*this.direction.z,a=t*t+r*r+i*i-s*s,o=e.radius*e.radius;if(a>o)return -1;let n=Math.sqrt(o-a),l=s-n,h=s+n;return h<0?-1:l<0?h:l}intersectsSphere(e){return!(e.radius<0)&&this.distanceSqToPoint(e.center)<=e.radius*e.radius}intersectPlane(e,t){let r=e.normal.dot(this.direction);if(0===r)return 0===e.distanceToPoint(this.origin)?(t||=new i.P).copyFrom(this.origin):null;let s=-e.distanceToPoint(this.origin)/r;return s<0?null:this.at(s,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return 0===t||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r=this.intersectBoxT(e);return -1===r?null:this.at(r,t)}intersectsBox(e){return -1!==this.intersectBoxT(e)}applyMatrix4(e,t=this){return t!==this&&t.copyFrom(this),t.origin.applyAffineMatrix4(e),t.direction.transformDirection(e),t}intersectBoxT(e){let t,r,i,s,a,o,n=1/this.direction.x,l=1/this.direction.y,h=1/this.direction.z,u=this.origin;return(n>=0?(t=(e.min.x-u.x)*n,r=(e.max.x-u.x)*n):(t=(e.max.x-u.x)*n,r=(e.min.x-u.x)*n),l>=0?(i=(e.min.y-u.y)*l,s=(e.max.y-u.y)*l):(i=(e.max.y-u.y)*l,s=(e.min.y-u.y)*l),t>s||i>r||((i>t||Number.isNaN(t))&&(t=i),(s<r||Number.isNaN(r))&&(r=s),h>=0?(a=(e.min.z-u.z)*h,o=(e.max.z-u.z)*h):(a=(e.max.z-u.z)*h,o=(e.min.z-u.z)*h),t>o||a>r||((a>t||Number.isNaN(t))&&(t=a),(o<r||Number.isNaN(r))&&(r=o),r<0)))?-1:t>=0?t:r}toString(){return`[@pixi/3d/math:Ray origin=(${this.origin.x}, ${this.origin.y}, ${this.origin.z}) direction=(${this.direction.x}, ${this.direction.y}, ${this.direction.z})]`}}},54027(e,t,r){r.d(t,{i:()=>a});var i=r(49491),s=r(32955),a=class e{center;radius=0;type="sphere";constructor(e,t=-1){this.center=void 0!==e?e:new i.P,this.radius=t}set(e,t){return this.center.copyFrom(e),this.radius=t,this}setFromBox(e){if(e.isEmpty())return this.makeEmpty();let{min:t,max:r}=e;this.center.set((t.x+r.x)*.5,(t.y+r.y)*.5,(t.z+r.z)*.5);let i=r.x-t.x,s=r.y-t.y,a=r.z-t.z;return this.radius=.5*Math.sqrt(i*i+s*s+a*a),this}copyFrom(e){return this.center.copyFrom(e.center),this.radius=e.radius,this}copyTo(e){return e.center.copyFrom(this.center),e.radius=this.radius,e}clone(){return new e().copyFrom(this)}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}isEmpty(){return this.radius<0}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}distanceToPoint(e){return this.center.distanceTo(e)-this.radius}containsPoint(e){return this.center.distanceToSquared(e)<=this.radius*this.radius}intersectsBox(e){return e.intersectsSphere(this)}intersectsSphere(e){if(this.radius<0||e.radius<0)return!1;let t=this.radius+e.radius;return this.center.distanceToSquared(e.center)<=t*t}intersectsPlane(e){return!(this.radius<0)&&Math.abs(e.distanceToPoint(this.center))<=this.radius}intersectsRay(e){return e.intersectsSphere(this)}applyMatrix4(e,t=this){return t!==this&&t.copyFrom(this),t.isEmpty()||(t.center.applyAffineMatrix4(e),t.radius=t.radius*e.getMaxScaleOnAxis()),t}getBounds(e){return(e||=new s.a,this.isEmpty())?e.makeEmpty():(e.min.set(this.center.x-this.radius,this.center.y-this.radius,this.center.z-this.radius),e.max.set(this.center.x+this.radius,this.center.y+this.radius,this.center.z+this.radius),e)}toString(){return`[@pixi/3d/math:Sphere center=(${this.center.x}, ${this.center.y}, ${this.center.z}) radius=${this.radius}]`}}},75290(e,t,r){r.d(t,{q:()=>i});function i(e,t,r){return Math.max(t,Math.min(r,e))}},26054(e,t,r){r.d(t,{A:()=>s});var i=r(75290),s=class e{_x=0;_y=0;_z=0;_observer;get x(){return this._x}set x(e){this._x!==e&&(this._x=e,this._observer._onUpdate(this))}get y(){return this._y}set y(e){this._y!==e&&(this._y=e,this._observer._onUpdate(this))}get z(){return this._z}set z(e){this._z!==e&&(this._z=e,this._observer._onUpdate(this))}constructor(e,t=0,r=0,i=0){this._x=t,this._y=r,this._z=i,this._observer=e}set(e=0,t=e,r=e){return(this._x!==e||this._y!==t||this._z!==r)&&(this._x=e,this._y=t,this._z=r,this._observer._onUpdate(this)),this}copyFrom(e){return(this._x!==e.x||this._y!==e.y||this._z!==e.z)&&(this._x=e.x,this._y=e.y,this._z=e.z,this._observer._onUpdate(this)),this}copyTo(e){return e.set(this._x,this._y,this._z),e}equals(e){return e.x===this._x&&e.y===this._y&&e.z===this._z}clone(t){return new e(t??this._observer,this._x,this._y,this._z)}toString(){return`[@pixi/3d/math:ObservableVector3 x=${this._x} y=${this._y} z=${this._z}]`}fromArray(e,t=0){return this.set(e[t],e[t+1],e[t+2])}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e}add(e,t=this){let r=this._x+e.x,i=this._y+e.y,s=this._z+e.z;return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}subtract(e,t=this){let r=this._x-e.x,i=this._y-e.y,s=this._z-e.z;return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}multiply(e,t=this){let r=this._x*e.x,i=this._y*e.y,s=this._z*e.z;return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}multiplyScalar(e,t=this){let r=this._x*e,i=this._y*e,s=this._z*e;return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}divide(e,t=this){let r=this._x/e.x,i=this._y/e.y,s=this._z/e.z;return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}divideScalar(e,t=this){return this.multiplyScalar(1/e,t)}addScaledVector(e,t,r=this){let i=this._x+e.x*t,s=this._y+e.y*t,a=this._z+e.z*t;return r===this?this.set(i,s,a):(r.x=i,r.y=s,r.z=a,r)}negate(e=this){let t=-this._x,r=-this._y,i=-this._z;return e===this?this.set(t,r,i):(e.x=t,e.y=r,e.z=i,e)}min(e,t=this){let r=Math.min(this._x,e.x),i=Math.min(this._y,e.y),s=Math.min(this._z,e.z);return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}max(e,t=this){let r=Math.max(this._x,e.x),i=Math.max(this._y,e.y),s=Math.max(this._z,e.z);return t===this?this.set(r,i,s):(t.x=r,t.y=i,t.z=s,t)}clamp(e,t,r=this){let s=(0,i.q)(this._x,e.x,t.x),a=(0,i.q)(this._y,e.y,t.y),o=(0,i.q)(this._z,e.z,t.z);return r===this?this.set(s,a,o):(r.x=s,r.y=a,r.z=o,r)}normalize(e=this){let t=1/(Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z)||1),r=this._x*t,i=this._y*t,s=this._z*t;return e===this?this.set(r,i,s):(e.x=r,e.y=i,e.z=s,e)}setLength(e,t=this){let r=e/(Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z)||1),i=this._x*r,s=this._y*r,a=this._z*r;return t===this?this.set(i,s,a):(t.x=i,t.y=s,t.z=a,t)}magnitude(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z)}magnitudeSquared(){return this._x*this._x+this._y*this._y+this._z*this._z}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this._x-e.x,r=this._y-e.y,i=this._z-e.z;return t*t+r*r+i*i}dot(e){return this._x*e.x+this._y*e.y+this._z*e.z}angleTo(e){let t=Math.sqrt(this.magnitudeSquared()*(e.x*e.x+e.y*e.y+e.z*e.z));if(0===t)return Math.PI/2;let r=this.dot(e)/t;return Math.acos((0,i.q)(r,-1,1))}cross(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.x,o=e.y,n=e.z,l=i*n-s*o,h=s*a-r*n,u=r*o-i*a;return t===this?this.set(l,h,u):(t.x=l,t.y=h,t.z=u,t)}applyMatrix3(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.elements,o=a[0]*r+a[3]*i+a[6]*s,n=a[1]*r+a[4]*i+a[7]*s,l=a[2]*r+a[5]*i+a[8]*s;return t===this?this.set(o,n,l):(t.x=o,t.y=n,t.z=l,t)}applyMatrix4(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.elements,o=1/(a[3]*r+a[7]*i+a[11]*s+a[15]),n=(a[0]*r+a[4]*i+a[8]*s+a[12])*o,l=(a[1]*r+a[5]*i+a[9]*s+a[13])*o,h=(a[2]*r+a[6]*i+a[10]*s+a[14])*o;return t===this?this.set(n,l,h):(t.x=n,t.y=l,t.z=h,t)}applyAffineMatrix4(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.elements,o=a[0]*r+a[4]*i+a[8]*s+a[12],n=a[1]*r+a[5]*i+a[9]*s+a[13],l=a[2]*r+a[6]*i+a[10]*s+a[14];return t===this?this.set(o,n,l):(t.x=o,t.y=n,t.z=l,t)}applyQuaternion(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.x,o=e.y,n=e.z,l=e.w,h=l*r+o*s-n*i,u=l*i+n*r-a*s,d=l*s+a*i-o*r,c=-a*r-o*i-n*s,f=h*l-c*a-u*n+d*o,p=u*l-c*o-d*a+h*n,m=d*l-c*n-h*o+u*a;return t===this?this.set(f,p,m):(t.x=f,t.y=p,t.z=m,t)}transformDirection(e,t=this){let r=this._x,i=this._y,s=this._z,a=e.elements,o=a[0]*r+a[4]*i+a[8]*s,n=a[1]*r+a[5]*i+a[9]*s,l=a[2]*r+a[6]*i+a[10]*s,h=1/(Math.sqrt(o*o+n*n+l*l)||1),u=o*h,d=n*h,c=l*h;return t===this?this.set(u,d,c):(t.x=u,t.y=d,t.z=c,t)}setFromSpherical(e){let t=Math.sin(e.phi)*e.radius;return this.set(t*Math.sin(e.theta),Math.cos(e.phi)*e.radius,t*Math.cos(e.theta))}setFromCylindrical(e){return this.set(e.radius*Math.sin(e.theta),e.y,e.radius*Math.cos(e.theta))}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}}},60330(e,t,r){r.d(t,{I:()=>s});var i=r(75290),s=class e{x=0;y=0;static get shared(){return a.x=0,a.y=0,a}constructor(e=0,t=0){this.x=e,this.y=t}set(e=0,t=e){return this.x=e,this.y=t,this}copyFrom(e){return this.x=e.x,this.y=e.y,this}copyTo(e){return e.set(this.x,this.y),e}equals(e){return e.x===this.x&&e.y===this.y}clone(){return new e(this.x,this.y)}toString(){return`[@pixi/3d/math:Vector2 x=${this.x} y=${this.y}]`}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}add(e,t=this){return t.x=this.x+e.x,t.y=this.y+e.y,t}subtract(e,t=this){return t.x=this.x-e.x,t.y=this.y-e.y,t}multiply(e,t=this){return t.x=this.x*e.x,t.y=this.y*e.y,t}multiplyScalar(e,t=this){return t.x=this.x*e,t.y=this.y*e,t}divide(e,t=this){return t.x=this.x/e.x,t.y=this.y/e.y,t}divideScalar(e,t=this){return this.multiplyScalar(1/e,t)}addScaledVector(e,t,r=this){return r.x=this.x+e.x*t,r.y=this.y+e.y*t,r}negate(e=this){return e.x=-this.x,e.y=-this.y,e}min(e,t=this){return t.x=Math.min(this.x,e.x),t.y=Math.min(this.y,e.y),t}max(e,t=this){return t.x=Math.max(this.x,e.x),t.y=Math.max(this.y,e.y),t}clamp(e,t,r=this){return r.x=(0,i.q)(this.x,e.x,t.x),r.y=(0,i.q)(this.y,e.y,t.y),r}normalize(e=this){let t=1/(Math.sqrt(this.x*this.x+this.y*this.y)||1);return e.x=this.x*t,e.y=this.y*t,e}setLength(e,t=this){let r=e/(Math.sqrt(this.x*this.x+this.y*this.y)||1);return t.x=this.x*r,t.y=this.y*r,t}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}magnitudeSquared(){return this.x*this.x+this.y*this.y}distanceTo(e){let t=this.x-e.x,r=this.y-e.y;return Math.sqrt(t*t+r*r)}distanceToSquared(e){let t=this.x-e.x,r=this.y-e.y;return t*t+r*r}dot(e){return this.x*e.x+this.y*e.y}angle(){return Math.atan2(this.y,this.x)}cross(e){return this.x*e.y-this.y*e.x}applyMatrix3(e,t=this){let r=this.x,i=this.y,s=e.elements;return t.x=s[0]*r+s[3]*i+s[6],t.y=s[1]*r+s[4]*i+s[7],t}rotate(e,t=this){let r=Math.cos(e),i=Math.sin(e),s=this.x,a=this.y;return t.x=s*r-a*i,t.y=s*i+a*r,t}rotateAround(e,t,r=this){let i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,o=this.y-e.y;return r.x=a*i-o*s+e.x,r.y=a*s+o*i+e.y,r}};let a=new s},49491(e,t,r){r.d(t,{P:()=>s});var i=r(75290),s=class e{x=0;y=0;z=0;static get shared(){return a.x=0,a.y=0,a.z=0,a}constructor(e=0,t=0,r=0){this.x=e,this.y=t,this.z=r}set(e=0,t=e,r=e){return this.x=e,this.y=t,this.z=r,this}copyFrom(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}copyTo(e){return e.set(this.x,this.y,this.z),e}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}clone(){return new e(this.x,this.y,this.z)}toString(){return`[@pixi/3d/math:Vector3 x=${this.x} y=${this.y} z=${this.z}]`}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}add(e,t=this){return t.x=this.x+e.x,t.y=this.y+e.y,t.z=this.z+e.z,t}subtract(e,t=this){return t.x=this.x-e.x,t.y=this.y-e.y,t.z=this.z-e.z,t}multiply(e,t=this){return t.x=this.x*e.x,t.y=this.y*e.y,t.z=this.z*e.z,t}multiplyScalar(e,t=this){return t.x=this.x*e,t.y=this.y*e,t.z=this.z*e,t}divide(e,t=this){return t.x=this.x/e.x,t.y=this.y/e.y,t.z=this.z/e.z,t}divideScalar(e,t=this){return this.multiplyScalar(1/e,t)}addScaledVector(e,t,r=this){return r.x=this.x+e.x*t,r.y=this.y+e.y*t,r.z=this.z+e.z*t,r}negate(e=this){return e.x=-this.x,e.y=-this.y,e.z=-this.z,e}min(e,t=this){return t.x=Math.min(this.x,e.x),t.y=Math.min(this.y,e.y),t.z=Math.min(this.z,e.z),t}max(e,t=this){return t.x=Math.max(this.x,e.x),t.y=Math.max(this.y,e.y),t.z=Math.max(this.z,e.z),t}clamp(e,t,r=this){return r.x=(0,i.q)(this.x,e.x,t.x),r.y=(0,i.q)(this.y,e.y,t.y),r.z=(0,i.q)(this.z,e.z,t.z),r}normalize(e=this){let t=1/(Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)||1);return e.x=this.x*t,e.y=this.y*t,e.z=this.z*t,e}setLength(e,t=this){let r=e/(Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)||1);return t.x=this.x*r,t.y=this.y*r,t.z=this.z*r,t}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}magnitudeSquared(){return this.x*this.x+this.y*this.y+this.z*this.z}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,r=this.y-e.y,i=this.z-e.z;return t*t+r*r+i*i}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}angleTo(e){let t=Math.sqrt(this.magnitudeSquared()*(e.x*e.x+e.y*e.y+e.z*e.z));if(0===t)return Math.PI/2;let r=this.dot(e)/t;return Math.acos((0,i.q)(r,-1,1))}cross(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.x,o=e.y,n=e.z;return t.x=i*n-s*o,t.y=s*a-r*n,t.z=r*o-i*a,t}applyMatrix3(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.elements;return t.x=a[0]*r+a[3]*i+a[6]*s,t.y=a[1]*r+a[4]*i+a[7]*s,t.z=a[2]*r+a[5]*i+a[8]*s,t}applyMatrix4(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.elements,o=1/(a[3]*r+a[7]*i+a[11]*s+a[15]);return t.x=(a[0]*r+a[4]*i+a[8]*s+a[12])*o,t.y=(a[1]*r+a[5]*i+a[9]*s+a[13])*o,t.z=(a[2]*r+a[6]*i+a[10]*s+a[14])*o,t}applyAffineMatrix4(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.elements;return t.x=a[0]*r+a[4]*i+a[8]*s+a[12],t.y=a[1]*r+a[5]*i+a[9]*s+a[13],t.z=a[2]*r+a[6]*i+a[10]*s+a[14],t}applyQuaternion(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.x,o=e.y,n=e.z,l=e.w,h=l*r+o*s-n*i,u=l*i+n*r-a*s,d=l*s+a*i-o*r,c=-a*r-o*i-n*s;return t.x=h*l-c*a-u*n+d*o,t.y=u*l-c*o-d*a+h*n,t.z=d*l-c*n-h*o+u*a,t}transformDirection(e,t=this){let r=this.x,i=this.y,s=this.z,a=e.elements,o=a[0]*r+a[4]*i+a[8]*s,n=a[1]*r+a[5]*i+a[9]*s,l=a[2]*r+a[6]*i+a[10]*s,h=1/(Math.sqrt(o*o+n*n+l*l)||1);return t.x=o*h,t.y=n*h,t.z=l*h,t}setFromSpherical(e){let t=Math.sin(e.phi)*e.radius;return this.x=t*Math.sin(e.theta),this.y=Math.cos(e.phi)*e.radius,this.z=t*Math.cos(e.theta),this}setFromCylindrical(e){return this.x=e.radius*Math.sin(e.theta),this.y=e.y,this.z=e.radius*Math.cos(e.theta),this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}};let a=new s},83621(e,t,r){r.d(t,{B:()=>V});var i=r(49491),s=r(36384),a=r(53608),o=r(83039),n=r(32955),l=r(54537),h=class{_radians;constructor(e){this._radians=e}get x(){return this._radians._x*l.bOd}set x(e){this._radians.x=e*l.Tde}get y(){return this._radians._y*l.bOd}set y(e){this._radians.y=e*l.Tde}get z(){return this._radians._z*l.bOd}set z(e){this._radians.z=e*l.Tde}set(e=0,t=e,r=e){return this._radians.set(e*l.Tde,t*l.Tde,r*l.Tde),this}copyFrom(e){return this.set(e.x,e.y,e.z)}copyTo(e){return e.set(this.x,this.y,this.z)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}},u=r(26054),d=r(38755),c=r(99280);let f=new s.k,p=[];function m(e,t){let r=0,i=e.parent;for(;i;)p[r++]=i,i=i.parent;for(let e=r;p[e];e++)p[e]=null;if(0===r)return t.identity();let a=p[r-1];a._localTransformDirty&&(a.updateLocalTransform(),a._localTransformDirty=!1),t.copyFrom(a.localTransform);let o=t,n=f;for(let e=r-2;e>=0;e--){let t=p[e];t._localTransformDirty&&(t.updateLocalTransform(),t._localTransformDirty=!1),s.k.multiplyAffine(n.elements,0,o.elements,0,t.localTransform.elements,0);let r=o;o=n,n=r}return o!==t&&t.copyFrom(o),t}let _=0,g=new s.k,x=new i.P,y=new s.k,v=new a.P,b=new a.P,w={x:0,y:1,z:0},T=new i.P,C=new s.k,S=new i.P,D=new i.P,M=new s.k,B=new s.k,I=new i.P,P=new i.P,A=new a.P,F=new n.a;function R(e,t,r){let i=Math.sign(r)||1;return 0!==t?e/t*i:i}function k(e,t){return null!==e&&(e===t||t instanceof RegExp&&t.test(e))}let z={children:!0,hitVolume:!0,parent:!0,width:!0,height:!0,depth:!0};var V=class extends l.bkB{uid=_++;label=null;rotationDirty=!1;localTransform=new s.k;worldTransform=new s.k;_position=new u.A(this,0,0,0);_scale=new u.A(this,1,1,1);_rotation=new u.A(this,0,0,0);_quaternion=new o.W(this,0,0,0,1);_angle=null;_origin=null;children=[];parent=null;_view3d=null;boundsVolume=null;destroyed=!1;didChange=!1;_worldTransformDirty=!0;_worldVisibleDirty=!0;_localTransformDirty=!1;_visible=1;_worldVisible=1;_updateTick=-1;_relativeSceneDepth=0;_storeDirty=!1;_worldTransformId=0;_lookAtForwardIsPositiveZ=!0;constructor(e={}){super(),(0,l.syC)(this,e,z);let{children:t,hitVolume:r,width:i,height:s,depth:a,parent:o}=e;if(t)for(let e=0;e<t.length;e++)this.addChild(t[e]);void 0!==r&&(this.hitVolume=r),void 0!==i&&(this.width=i),void 0!==s&&(this.height=s),void 0!==a&&(this.depth=a),o?.addChild(this)}get position(){return this._position}set position(e){this._position.copyFrom(e)}get scale(){return this._scale}set scale(e){"number"==typeof e?this._scale.set(e):this._scale.copyFrom(e)}get rotation(){return this._rotation}set rotation(e){this._rotation.copyFrom(e),this.rotationDirty||this._onUpdate(this._rotation)}get angle(){return this._angle??=new h(this._rotation)}set angle(e){this._rotation.set(e.x*l.Tde,e.y*l.Tde,e.z*l.Tde),this.rotationDirty||this._onUpdate(this._rotation)}get quaternion(){return this._quaternion}set quaternion(e){this._quaternion.copyFrom(e),this.rotationDirty&&this._onUpdate(this._quaternion)}get origin(){return this._origin??=new u.A(this,0,0,0)}set origin(e){let t=this.origin;"number"==typeof e?t.set(e):t.copyFrom(e)}get x(){return this._position._x}set x(e){this._position.x=e}get y(){return this._position._y}set y(e){this._position.y=e}get z(){return this._position._z}set z(e){this._position.z=e}addChild(...e){if(e.length>1){for(let t=0;t<e.length;t++)this.addChild(e[t]);return e[0]}let t=e[0];return t.parent===this?(this.children.splice(this.children.indexOf(t),1),this.children.push(t)):(t.parent&&t.parent.removeChild(t),this.children.push(t),t._worldTransformDirty=!0,t._worldVisibleDirty=!0,t.didChange=!0,t.parent=this,this._view3d&&this._view3d._attach(t),this.emit("childAdded",t,this,this.children.length-1),t.emit("added",this)),t}removeChild(...e){if(e.length>1){for(let t=0;t<e.length;t++)this.removeChild(e[t]);return e[0]}let t=e[0],r=this.children.indexOf(t);return r>-1&&(this.children.splice(r,1),t._view3d&&t._view3d._detach(t),t.parent=null,this.emit("childRemoved",t,this,r),t.emit("removed",this)),t}removeChildren(e=0,t){let r=t??this.children.length,i=r-e,s=[];if(i>0&&i<=r){for(let t=r-1;t>=e;t--){let e=this.children[t];e&&(s.push(e),e._view3d&&e._view3d._detach(e),e.parent=null)}this.children.splice(e,i);for(let e=0;e<s.length;e++){let t=s[e];this.emit("childRemoved",t,this,e),t.emit("removed",this)}return s}if(0===i&&0===this.children.length)return s;throw RangeError("removeChildren: numeric values are outside the acceptable range.")}removeChildAt(e){let t=this.getChildAt(e);return this.removeChild(t)}getChildAt(e){if(e<0||e>=this.children.length)throw Error(`getChildAt: Index (${e}) does not exist.`);return this.children[e]}getChildIndex(e){let t=this.children.indexOf(e);if(-1===t)throw Error("getChildIndex: The supplied Container3D must be a child of the caller.");return t}setChildIndex(e,t){if(t<0||t>=this.children.length)throw Error(`setChildIndex: The index ${t} supplied is out of bounds ${this.children.length}.`);this.getChildIndex(e),this.addChildAt(e,t)}addChildAt(e,t){let{children:r}=this;if(t<0||t>r.length)throw Error(`addChildAt: The index ${t} supplied is out of bounds ${r.length}.`);let i=e.parent===this;if(e.parent)if(i){let i=r.indexOf(e);if(i===t)return e;r.splice(i,1)}else e.parent.removeChild(e);return t===r.length?r.push(e):r.splice(t,0,e),i||(e._worldTransformDirty=!0,e._worldVisibleDirty=!0,e.didChange=!0,e.parent=this,this._view3d&&this._view3d._attach(e),this.emit("childAdded",e,this,t),e.emit("added",this)),e}swapChildren(e,t){if(e===t)return;let r=this.getChildIndex(e),i=this.getChildIndex(t);this.children[r]=t,this.children[i]=e}getChildByLabel(e,t=!1){let r=this.children;for(let t=0;t<r.length;t++)if(k(r[t].label,e))return r[t];if(t)for(let t=0;t<r.length;t++){let i=r[t].getChildByLabel(e,!0);if(i)return i}return null}getChildrenByLabel(e,t=!1,r=[]){let i=this.children;for(let t=0;t<i.length;t++)k(i[t].label,e)&&r.push(i[t]);if(t)for(let t=0;t<i.length;t++)i[t].getChildrenByLabel(e,!0,r);return r}traverse(e){let t=this.children,r=t.length;e(this);for(let i=0;i<r&&i<t.length;){let s=t[i],a=t[i+1];s.traverse(e),t[i]===a?r--:i++}}removeFromParent(){this.parent?.removeChild(this)}reparentChild(...e){if(1===e.length)return this.reparentChildAt(e[0],this.children.length);for(let t=0;t<e.length;t++)this.reparentChildAt(e[t],this.children.length);return e[0]}reparentChildAt(e,t){return e.parent===this?this.setChildIndex(e,t):(m(e,M),e._localTransformDirty&&(e.updateLocalTransform(),e._localTransformDirty=!1),M.multiply(e.localTransform),e.removeFromParent(),this.addChildAt(e,t),m(this,B),this._localTransformDirty&&(this.updateLocalTransform(),this._localTransformDirty=!1),B.multiply(this.localTransform),B.getInverse(B),M.premultiply(B),M.decompose(I,A,P),e.scale.copyFrom(P),e.quaternion.copyFrom(A),null!==e._origin&&(e.updateLocalTransform(),I.subtract(e._getOriginOffset(T))),e.position.copyFrom(I)),e}replaceChild(e,t){let r=this.getChildIndex(e);this.addChildAt(t,r),t.scale.copyFrom(e.scale),t.rotation.copyFrom(e.rotation),t.quaternion.copyFrom(e.quaternion),t.rotationDirty=e.rotationDirty;let i=t.position.copyFrom(e.position);null!==e._origin&&(e.updateLocalTransform(),i.add(e._getOriginOffset(T))),null!==t._origin&&(t.updateLocalTransform(),i.subtract(t._getOriginOffset(T))),this.removeChild(e)}updateLocalTransform(){let e=this._quaternion;if(this.rotationDirty){this.rotationDirty=!1;let t=this._rotation._x,r=this._rotation._y,i=this._rotation._z,s=Math.cos(t/2),a=Math.cos(r/2),o=Math.cos(i/2),n=Math.sin(t/2),l=Math.sin(r/2),h=Math.sin(i/2);e._x=n*a*o+s*l*h,e._y=s*l*o-n*a*h,e._z=s*a*h+n*l*o,e._w=s*a*o-n*l*h}let t=e._x,r=e._y,i=e._z,s=e._w,a=t+t,o=r+r,n=i+i,l=t*a,h=t*o,u=t*n,d=r*o,c=r*n,f=i*n,p=s*a,m=s*o,_=s*n,g=this.localTransform.elements,x=this._scale._x,y=this._scale._y,v=this._scale._z;g[0]=(1-(d+f))*x,g[1]=(h+_)*x,g[2]=(u-m)*x,g[4]=(h-_)*y,g[5]=(1-(l+f))*y,g[6]=(c+p)*y,g[8]=(u+m)*v,g[9]=(c-p)*v,g[10]=(1-(l+d))*v,g[12]=this._position._x,g[13]=this._position._y,g[14]=this._position._z,null!==this._origin&&this._addOriginOffset()}_addOriginOffset(){let e=this._getOriginOffset(T),t=this.localTransform.elements;t[12]+=e.x,t[13]+=e.y,t[14]+=e.z}_getOriginOffset(e){let t=this.localTransform.elements,r=this._origin,i=r._x,s=r._y,a=r._z;return e.x=i-(t[0]*i+t[4]*s+t[8]*a),e.y=s-(t[1]*i+t[5]*s+t[9]*a),e.z=a-(t[2]*i+t[6]*s+t[10]*a),e}getLocalBounds(e=new n.a){return(0,c.i)(this,e)}get width(){return Math.abs(this._scale._x*this.getLocalBounds(F).width)}set width(e){this._scale.x=R(e,this.getLocalBounds(F).width,this._scale._x)}get height(){return Math.abs(this._scale._y*this.getLocalBounds(F).height)}set height(e){this._scale.y=R(e,this.getLocalBounds(F).height,this._scale._y)}get depth(){return Math.abs(this._scale._z*this.getLocalBounds(F).depth)}set depth(e){this._scale.z=R(e,this.getLocalBounds(F).depth,this._scale._z)}getSize(e={width:0,height:0,depth:0}){let t=this.getLocalBounds(F);return e.width=Math.abs(this._scale._x*t.width),e.height=Math.abs(this._scale._y*t.height),e.depth=Math.abs(this._scale._z*t.depth),e}setSize(e,t,r){let i;"object"==typeof e?(i=e.width,t=e.height??i,r=e.depth??i):(i=e,t??=i,r??=i);let s=this.getLocalBounds(F),a=this._scale;a.set(R(i,s.width,a._x),R(t,s.height,a._y),R(r,s.depth,a._z))}lookAt(e,t=w){m(this,g.identity()),x.copyFrom(this.position),null!==this._origin&&x.add(this._origin),x.applyAffineMatrix4(g),this._lookAtForwardIsPositiveZ?y.lookAt(e,x,t):y.lookAt(x,e,t),v.setFromRotationMatrix(y),this.parent&&(b.setFromScaledRotationMatrix(g),b.inverse(),v.premultiply(b)),this.quaternion.copyFrom(v)}getGlobalTransform(e=new s.k,t=!1){return t?e.copyFrom(this.worldTransform):(m(this,e),this._localTransformDirty&&(this.updateLocalTransform(),this._localTransformDirty=!1),e.multiply(this.localTransform))}toGlobal(e,t,r=!1){return t??=new i.P,this.getGlobalTransform(C,r),S.copyFrom(e).applyAffineMatrix4(C,t),t}toLocal(e,t,r,s=!1){return r??=new i.P,t&&(e=t.toGlobal(e,D,s)),this.getGlobalTransform(C,s),C.getInverse(C),S.copyFrom(e).applyAffineMatrix4(C,r),r}getGlobalPosition(e=new i.P,t=!1){return this.parent?this.parent.toGlobal(this.position,e,t):e.copyFrom(this.position)}logHierarchy(e=0){let t="  ".repeat(e),r=this.constructor.name,i=this.label?` "${this.label}"`:"";for(let s of(console.log(`${t}${r}${i}`),this.children))s.logHierarchy(e+1)}get visible(){return!!this._visible}set visible(e){let t=+!!e;this._visible!==t&&(this._visible=t,this._worldVisibleDirty=!0,this.didChange||(this.didChange=!0,this._view3d?._onChildUpdate(this)),this.emit("visibleChanged",e))}get worldVisible(){return this._worldVisible}get view3d(){return this._view3d}_onUpdate(e){e&&(e===this._rotation?this.rotationDirty=!0:e===this._quaternion&&(this.rotationDirty=!1)),this._localTransformDirty=!0,this._worldTransformDirty=!0,!this.didChange&&(this.didChange=!0,this._view3d&&this._view3d._onChildUpdate(this))}unload(){let e=this.children;for(let t=0;t<e.length;t++)e[t].unload()}_storeWorldTransform(){}_storeWorldVisible(){}destroy(e){if(this.destroyed)return;this.destroyed=!0;let t=(0,d.M)(e,"children"),r=t?this.children.slice():null;if(this.removeChildren(0,this.children.length),this.removeFromParent(),this.emit("destroyed",this),this.removeAllListeners(),t&&r)for(let t=0;t<r.length;t++)r[t].destroy(e);this.parent=null,this._view3d=null}}},5774(e,t,r){r.d(t,{g:()=>i});var i=class{globalUniformGroup;globalBindGroup;globalTextureBindings;lastMaterialStoreBufferVersion=-1;lastAtlasBufferVersion=-1;lastMorphStoreBufferVersion=-1;lastGeometryStoreBufferVersion=-1;_destroyed=!1;constructor(e,t,r){this.globalUniformGroup=e,this.globalBindGroup=t,this.globalTextureBindings=r}destroy(){this._destroyed||(this._destroyed=!0,this.globalBindGroup.destroy(),this.globalUniformGroup.buffer?.destroy())}}},99280(e,t,r){r.d(t,{i:()=>o});var i=r(36384);let s=new(r(32955)).a,a=[];function o(e,t,r=!0){return t.makeEmpty(),function e(t,r,s,o,l){let h=t.boundsVolume;if(h)return void n(h,r,s);let u=t.geometry;u&&n(u.bounds3D,r,s);let d=t.children;if(0===d.length)return;let c=a[o]??=new i.k;for(let t=0;t<d.length;t++){let i=d[t];(!l||i.visible)&&(i.updateLocalTransform(),s?c.copyFrom(s).multiply(i.localTransform):c.copyFrom(i.localTransform),e(i,r,c,o+1,l))}}(e,t,null,0,r),t.isEmpty()&&(t.min.set(0,0,0),t.max.set(0,0,0)),t}function n(e,t,r){t.union(r?e.applyMatrix4(r,s):e)}},58506(e,t,r){let i;r.d(t,{u:()=>u});var s=r(68751),a=r(67534),o=r(36384),n=r(83621),l=r(54537);let h=((i=new n.B)._worldVisible=1,i);function u(e,t,r){!function(e){let t=e._childrenToUpdate,r=e._updateTick++;for(let i in t){let s=Number(i),a=t[i],n=a.list,u=a.index;for(let t=0;t<u;t++){let i=n[t];i._view3d===e&&i._relativeSceneDepth===s&&function e(t,r,i,s,a){if(i===t._updateTick)return;t._updateTick=i,t.didChange=!1,s||=t._worldTransformDirty,(a||=t._worldVisibleDirty)&&(t._worldVisible=r._worldVisible*t._visible,t._storeWorldVisible()),t._worldVisible&&s&&(t._localTransformDirty&&(t.updateLocalTransform(),t._localTransformDirty=!1),o.k.multiplyAffine(t.worldTransform.elements,0,r.worldTransform.elements,0,t.localTransform.elements,0),t._worldTransformId++,t._storeWorldTransform()),t._worldVisibleDirty=!1,t._worldTransformDirty=!t._worldVisible&&s;let n=t.children,l=n.length;for(let r=0;r<l;r++)e(n[r],t,i,s,a)}(i,i.parent??h,r,!1,!1)}(0,l.a$c)(n,u),a.index=0}}(e),function(e){let{camera:t}=e;if(t._view3d!==e)throw Error("Camera3D is no longer in the View3D scene graph. Don't remove an assigned camera from its parent without reassigning view3d.camera.");if(t.renderTexture)throw Error("The View3D's own camera draws the view, not a texture. Put the render texture on a second camera and draw from it with a pass that names that camera.");if(!t.visible||0===t._worldVisible)throw Error("Camera3D is hidden (visible=false or an ancestor is hidden). Cannot render with a hidden camera.")}(e),(0,a.DM)(e.camera,r);let i=(0,s.c)(e.camera).frame;if(i.width<=0||i.height<=0)return!1;e._syncShadowSampling(),function(e){e._bonePit.clear();let t=e._skinnedMeshes.items;for(let r=0;r<e._skinnedMeshes.items.length;r++){let i=t[r],s=i.skeleton;s.updateWorld();let a=e._bonePit.add(s);i._lastBonePitIndex!==a&&(i._lastBonePitIndex=a,i._markStoreDirty())}e._bonePit.update()}(e),t._morphStoreBuffer.sync(e._morphedMeshes.items),function(e,t){let r=t.geometryDataStoreBuffer,i=e._renderablesToUpdate,s=i.list,a=i.index;for(let i=0;i<a;i++){let a=s[i];if(a.didRenderableUpdate=!1,a._view3d!==e)continue;let o=a.material,n=a.renderPassMask;n!==a._lastRenderPass&&e._sceneBatch.setPassesAt(e._meshSlots.getIndex(a),n);let l=!1;if(a._lastDescriptorDirtyId!==o._descriptorDirtyId&&(l=-1!==a._lastDescriptorDirtyId,a._lastDescriptorDirtyId=o._descriptorDirtyId,a._batchDirty=!0),0===a._lastRenderPass)continue;let h=a.geometry,u=null===h._geometryAtlasAllocation&&!h.dynamic;if(a._batchDirty||u){a._batchDirty=!1,l||=u&&h._atlasVacated,t.renderer.material3d.ensureMaterial(a,e._sceneBatch,e),h.dynamic||(h._geometryAtlasAllocation=t.atlasPool.allocate(h)),r.set(h);let i=a.renderPassMask&e._dirtyHookBits;for(;i;){let t=i&-i;e.passByBit[t].onRenderableDirty(a,e._sceneBatch,l),i^=t}}a._storeDirty&&(a._storeDirty=!1,e._sceneBatch.storeBuffer.set(a))}let o=i.index-a;for(let e=0;e<o;e++)s[e]=s[a+e];(0,l.a$c)(s,o),i.index=o,e._sceneBatch.storeBuffer.update()}(e,t),function(e,t){let r=t.geometryDataStoreBuffer;for(let i=1;i<e._meshBatches.length;i++){let s=e._meshBatches[i];s.writeBatchWorldMatrix(s.renderData.worldTransform);let a=s._dirtyIndices,o=s._dirtyCount;for(let i=0;i<o;i++){let o=s.items[a[i]];o._batchDirty=!1;let n=o._lastRenderPass;if(0===n)continue;let l=o.material,h=null===o.geometry._geometryAtlasAllocation&&!o.geometry.dynamic&&o.geometry._atlasVacated;o._lastDescriptorDirtyId!==l._descriptorDirtyId&&(h||=-1!==o._lastDescriptorDirtyId,o._lastDescriptorDirtyId=l._descriptorDirtyId),t.renderer.material3d.ensureMaterial(o,s,e),o.geometry.dynamic||(o.geometry._geometryAtlasAllocation=t.atlasPool.allocate(o.geometry)),r.set(o.geometry),s.storeBuffer.u32Data[24*o._storeIndex+17]=l._materialIndex,s.storeBuffer.u32Data[24*o._storeIndex+18]=o.geometry._geometryDataIndex,s.storeBuffer.markDirty(o._storeIndex);let u=n&e._dirtyHookBits;for(;u;){let t=u&-u;e.passByBit[t].onRenderableDirty(o,s,h),u^=t}}s._dirtyCount=0,s.storeBuffer.update(),s.instanceStoreBuffer?.update()}}(e,t),function(e,t){let r=t.geometryDataStoreBuffer,i=t.atlasPool.bufferVersion;if(e._lastAtlasBufferVersion!==i){e._lastAtlasBufferVersion=i;let t=e._morphedMeshes.items;for(let e=0;e<t.length;e++)r.set(t[e].geometry)}}(e,t),function(e){for(let t=0;t<e._meshBatches.length;t++){let r=e._meshBatches[t],i=r.storeBuffer.bufferVersion;r._lastStoreBufferVersion!==i&&(r._lastStoreBufferVersion=i,r.invalidateDrawCaches())}let t=e._bonePit.bufferVersion;e._lastBonePitBufferVersion!==t&&(e._lastBonePitBufferVersion=t,e._invalidateDrawCaches())}(e);let n=e._meshBatches;for(let e=0;e<n.length;e++)n[e].applyEdits();return!0}},38755(e,t,r){r.d(t,{M:()=>i});function i(e,t){return"boolean"==typeof e?e:e?.[t]??!1}},8372(e,t,r){r.d(t,{v:()=>i});var i=class{items=[];_indexKey;constructor(e){this._indexKey=e}add(e){e[this._indexKey]=this.items.length,this.items.push(e)}remove(e){let t=e[this._indexKey];if(t>-1){let r=this.items.length-1,i=this.items[r];this.items[t]=i,i[this._indexKey]=t,this.items.length=r,e[this._indexKey]=-1}}clear(){for(let e=0;e<this.items.length;e++)this.items[e][this._indexKey]=-1;this.items.length=0}}},21078(e,t,r){r.d(t,{h:()=>i});function i(e,t){e.blendMode=t.blendMode,e.polygonOffset=t.polygonOffset,e.data=t.data}},67979(e,t,r){r.d(t,{m:()=>a});var i=r(54537);let s=new Set;function a(e,...t){s.has(e)||(s.add(e),(0,i.R8M)(...t))}i.L3G.register({clear:()=>s.clear()})}}]);