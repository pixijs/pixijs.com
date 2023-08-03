"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[3089],{46:(e,s,i)=>{i.r(s),i.d(s,{default:()=>m});i(7294);var t=i(6010),n=i(2263),o=i(1944),r=i(5281),a=i(245),l=i(9703),d=i(197),c=i(9985),p=i(5893);function x(e){const{metadata:s}=e,{siteConfig:{title:i}}=(0,n.Z)(),{blogDescription:t,blogTitle:r,permalink:a}=s,l="/"===a?i:r;return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o.d,{title:l,description:t}),(0,p.jsx)(d.Z,{tag:"blog_posts_list"})]})}function u(e){const{metadata:s,items:i,sidebar:t}=e;return(0,p.jsxs)(a.Z,{sidebar:t,children:[(0,p.jsx)(c.Z,{items:i}),(0,p.jsx)(l.Z,{metadata:s})]})}function m(e){return(0,p.jsxs)(o.FG,{className:(0,t.Z)(r.k.wrapper.blogPages,r.k.page.blogListPage),children:[(0,p.jsx)(x,{...e}),(0,p.jsx)(u,{...e})]})}},7754:(e,s,i)=>{i.d(s,{Z:()=>h});var t=i(2949),n=i(7294),o=i(4184),r=i.n(o),a=i(2695);var l=i(2215),d=i(9604),c=i(5893);function p(e){let{code:s,onChange:i}=e;const o=(0,n.useRef)(null),r=(0,n.useCallback)((e=>{o.current=e}),[]);(0,n.useEffect)((()=>{const e=()=>{null!==o.current&&o.current.layout({})};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]);const{colorMode:a}=(0,t.I)();return(0,c.jsx)(d.ZP,{defaultLanguage:"javascript",value:s,defaultPath:"inmemory://model//src/index.ts",onChange:i,options:{lineNumbers:"off",padding:{top:24},minimap:{enabled:!1},fontSize:14,scrollBeyondLastLine:!1,scrollbar:{alwaysConsumeMouseWheel:!1}},onMount:r,theme:"dark"===a?"vs-dark":"light"})}const x=e=>{let{code:s,isPixiWebWorkerVersion:i,isPixiDevVersion:t,pixiVersion:o}=e;const r=(e=>(0,n.useMemo)((()=>({".babelrc":{code:JSON.stringify({presets:[["@babel/preset-env",{useBuiltIns:"entry",corejs:"3.29",targets:"last 2 chrome versions"}]]},null,2)},"src/styles.css":"body { margin: 0; overflow: hidden; }","src/index.js":e,"index.html":'\n<!DOCTYPE html>\n  <html>\n  <head>\n  <title>PixiJS Playground</title>\n  <meta charset="UTF-8" />\n  <link rel="stylesheet" href="src/styles.css">\n</head>\n<body>\n  <script src="src/index.js"><\/script>\n</body>\n</html>',"package.json":{code:JSON.stringify({scripts:{start:"parcel index.html --open",build:"parcel build index.html"}},null,2)}})),[e]))(s),{dependenciesKey:a,dependencies:l}=(e=>{let{isPixiWebWorkerVersion:s,isPixiDevVersion:i,pixiVersion:t}=e;return(0,n.useMemo)((()=>{const e=s?"@pixi/webworker":"pixi.js",n=e=>i?`${t}/${e}`:t,o=[e,"@pixi/graphics-extras","@pixi/math-extras"].reduce(((e,s)=>({...e,[s]:n(s)})),{});return{dependenciesKey:`${e}-${t}`,dependencies:o}}),[i,s,t])})({isPixiWebWorkerVersion:i,isPixiDevVersion:t,pixiVersion:o});return{files:r,key:`${a}-${s}`,customSetup:{entry:"index.html",dependencies:l,devDependencies:{"@babel/core":"^7.21.3","parcel-bundler":"^1.6.1"}}}},u={spWrapper:"spWrapper_XZV1",spLayout:"spLayout_lAOU",tutorial:"tutorial_bUbR",editorWrapper:"editorWrapper_YBAz",previewWrapper:"previewWrapper_AZey",showOutput:"showOutput_G2Cm",fullscreen:"fullscreen_QlZ5",example:"example_nyOC",sandpackLoadingOverlay:"sandpackLoadingOverlay_nYYO",loadingPulse:"loadingPulse_IxQv"};function m(e){let{mode:s,onCodeChanged:i}=e;const{code:t,updateCode:o}=(0,a.m4)(),{sandpack:l}=(0,a.X3)(),[d,x]=(0,n.useState)(!1),{activeFile:m,bundlerState:h}=l,v=(0,n.useCallback)((e=>{const s=e??"";o(s),i?.(s)}),[i,o]),j=(0,n.useCallback)((()=>{x((e=>!e))}),[]);return(0,c.jsxs)(a.sp,{className:r()(u[s],d&&u.showOutput),children:[(0,c.jsx)("div",{className:u.editorWrapper,children:(0,c.jsx)(p,{code:t,onChange:v},m)}),(0,c.jsxs)("div",{className:u.previewWrapper,children:[(0,c.jsx)(a.Gj,{showOpenInCodeSandbox:!0}),!h&&(0,c.jsx)("div",{className:u.sandpackLoadingOverlay})]}),(0,c.jsx)("button",{onClick:j,children:d?"Show Code":"Show Output"})]})}function h(e){let{code:s,onCodeChanged:i,isPixiWebWorkerVersion:o=!1,isPixiDevVersion:r=!1,pixiVersion:d=l.$,mode:p="example"}=e;const{colorMode:h}=(0,t.I)(),{key:v,files:j,customSetup:b}=x({code:s,isPixiDevVersion:r,isPixiWebWorkerVersion:o,pixiVersion:d});var g,f;return g="example",void 0===(f="example"===p)&&(f=!0),(0,n.useEffect)((()=>{const e=document.querySelector("main > .container");if(null!==e&&f)return e.classList.add(g),()=>{e.classList.remove(g)}}),[g,f]),(0,c.jsx)(a.oT,{template:"vanilla",theme:h,files:j,customSetup:b,options:{classes:{"sp-wrapper":u.spWrapper,"sp-layout":u.spLayout}},children:(0,c.jsx)(m,{mode:p,onCodeChanged:i})},v)}},2215:(e,s,i)=>{i.d(s,{$:()=>a,_:()=>l});var t=i(7294),n=i(1825);const o=n.map((e=>{let{versionLabel:s,version:i}=e;return{label:s,value:i}})),r=(e,s)=>i=>i[e]===s,a=n.find(r("latest",!0)).version,l=e=>{let{selectedVersionId:s,setURLState:i}=e;const a=(0,t.useCallback)((e=>i({pixiVersion:e})),[i]);return{selectedVersion:(0,t.useMemo)((()=>n.find(r("version",s))),[s]),handleVersionChanged:a,versionOptions:o}}},245:(e,s,i)=>{i.d(s,{Z:()=>a});var t=i(6010),n=i(902),o=i(6624),r=i(5893);function a(e){const{sidebar:s,toc:i,children:a,...l}=e,d=s&&s.items.length>0;return(0,r.jsx)(n.Z,{...l,children:(0,r.jsx)("div",{className:"container margin-vert--lg",children:(0,r.jsxs)("div",{className:"row",children:[(0,r.jsx)(o.Z,{sidebar:s}),(0,r.jsx)("main",{className:(0,t.Z)("col",{"col--7":d&&i,"col--9":d&&!i,"col--9 col--offset-1":!d}),itemScope:!0,itemType:"http://schema.org/Blog",children:a}),i&&(0,r.jsx)("div",{className:"col col--2",children:i})]})})})}},9972:(e,s,i)=>{i.d(s,{Z:()=>p});var t=i(6010),n=i(9460),o=i(5289),r=i(9224),a=i(9714),l=i(2046);const d="card_Yae6";var c=i(5893);function p(e){let{children:s,className:i}=e;const p=function(){const{isBlogPostPage:e}=(0,n.C)();return e?void 0:"margin-bottom--md"}();return(0,c.jsxs)(o.Z,{className:(0,t.Z)(p,i,d),children:[(0,c.jsx)(r.Z,{}),(0,c.jsx)(a.Z,{children:s}),(0,c.jsx)(l.Z,{})]})}},5889:(e,s,i)=>{i.d(s,{Z:()=>l});var t=i(2389),n=i(814),o=i(7754);const r="playgroundCodeBlock_UB3Y";var a=i(5893);function l(e){let{children:s,playground:i=!1,usesWebWorkerLibrary:l=!1,...d}=e;const c=(0,t.Z)();return i&&c?(0,a.jsx)("div",{className:r,children:(0,a.jsx)(o.Z,{code:s,isPixiWebWorkerVersion:l})}):(0,a.jsx)(n.Z,{...d,children:s})}},1825:e=>{e.exports=JSON.parse('[{"versionLabel":"dev","version":"dev","releaseNotes":"https://github.com/pixijs/pixijs/releases","build":"https://pixijs.download/dev/pixi.min.js","docs":"https://pixijs.download/release/docs","dev":true,"npm":"https://pkg.csb.dev/pixijs/pixijs/commit/bc213d9c"},{"versionLabel":"v7.3.0-rc","version":"7.3.0-rc","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v7.3.0-rc","build":"https://pixijs.download/v7.3.0-rc/pixi.min.js","docs":"https://pixijs.download/v7.3.0-rc/docs/index.html","npm":"7.3.0-rc","prerelease":true},{"versionLabel":"v7.2.x","version":"7.2.4","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v7.2.4","build":"https://pixijs.download/v7.2.4/pixi.min.js","docs":"https://pixijs.download/v7.2.4/docs/index.html","npm":"7.2.4","latest":true},{"versionLabel":"v7.1.x","version":"7.1.4","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v7.1.4","build":"https://pixijs.download/v7.1.4/pixi.min.js","docs":"https://pixijs.download/v7.1.4/docs/index.html","npm":"7.1.4"},{"versionLabel":"v7.0.x","version":"7.0.5","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v7.0.5","build":"https://pixijs.download/v7.0.5/pixi.min.js","docs":"https://pixijs.download/v7.0.5/docs/index.html","npm":"7.0.5"},{"versionLabel":"v6.x","version":"6.5.10","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v6.5.10","build":"https://pixijs.download/v6.5.10/pixi.min.js","docs":"https://pixijs.download/v6.5.10/docs/index.html","npm":"6.5.10"},{"versionLabel":"v5.x","version":"5.3.12","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v5.3.12","build":"https://pixijs.download/v5.3.12/pixi.min.js","docs":"https://pixijs.download/v5.3.12/docs/index.html","npm":"5.3.12"},{"versionLabel":"v4.x","version":"4.8.9","releaseNotes":"https://github.com/pixijs/pixijs/releases/tags/v4.8.9","build":"https://pixijs.download/v4.8.9/pixi.min.js","docs":"https://pixijs.download/v4.8.9/docs/index.html","npm":"4.8.9"}]')}}]);