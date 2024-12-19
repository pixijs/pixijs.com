"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["3682"],{28796:function(e,i,s){s.r(i),s.d(i,{default:()=>c,frontMatter:()=>a,metadata:()=>n,assets:()=>d,toc:()=>o,contentTitle:()=>p});var n=JSON.parse('{"id":"guides/migrations/upgrading","title":"Upgrading PixiJS","description":"PixiJS uses a lot of peerDependencies internally to define the relationship between packages. This has created unpredictable errors because of how npm resolves peers when bumping/upgrading (e.g., #8382, #8268, #8144, #7209).","source":"@site/versioned_docs/version-7.x/guides/migrations/upgrading.md","sourceDirName":"guides/migrations","slug":"/guides/migrations/upgrading","permalink":"/7.x/guides/migrations/upgrading","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/pixijs.com/tree/main/versioned_docs/version-7.x/guides/migrations/upgrading.md","tags":[],"version":"7.x","frontMatter":{},"sidebar":"guidesSidebar","previous":{"title":"Performance Tips","permalink":"/7.x/guides/production/performance-tips"},"next":{"title":"v7 Migration Guide","permalink":"/7.x/guides/migrations/v7"}}'),r=s("85893"),t=s("50065");let a={},p="Upgrading PixiJS",d={},o=[];function u(e){let i={a:"a",code:"code",em:"em",h1:"h1",header:"header",p:"p",pre:"pre",strong:"strong",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.header,{children:(0,r.jsx)(i.h1,{id:"upgrading-pixijs",children:"Upgrading PixiJS"})}),"\n",(0,r.jsxs)(i.p,{children:["PixiJS uses a lot of ",(0,r.jsx)(i.code,{children:"peerDependencies"})," internally to define the relationship between packages. This has created unpredictable errors because of how ",(0,r.jsx)(i.code,{children:"npm"})," resolves peers when bumping/upgrading (e.g., ",(0,r.jsx)(i.a,{href:"https://github.com/pixijs/pixijs/issues/8382",children:"#8382"}),", ",(0,r.jsx)(i.a,{href:"https://github.com/pixijs/pixijs/issues/8268",children:"#8268"}),", ",(0,r.jsx)(i.a,{href:"https://github.com/pixijs/pixijs/issues/8144",children:"#8144"}),", ",(0,r.jsx)(i.a,{href:"https://github.com/pixijs/pixijs/issues/7209",children:"#7209"}),")."]}),"\n",(0,r.jsxs)(i.p,{children:["When you're ",(0,r.jsx)(i.em,{children:"upgrading"})," using ",(0,r.jsx)(i.code,{children:"npm"})," please completely uninstall instead of just changing the version in your ",(0,r.jsx)(i.strong,{children:"package.json"}),":"]}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{children:"npm uninstall pixi.js\nnpm install pixi.js\n"})}),"\n",(0,r.jsx)(i.p,{children:"If you are using any PixiJS community plugins, please make sure to uninstall those too:"}),"\n",(0,r.jsx)(i.pre,{children:(0,r.jsx)(i.code,{children:"npm uninstall pixi.js @pixi/particle-emitter @pixi/sound\nnpm install pixi.js @pixi/particle-emitter @pixi/sound\n"})})]})}function c(e={}){let{wrapper:i}={...(0,t.a)(),...e.components};return i?(0,r.jsx)(i,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}}}]);