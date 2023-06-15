"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[8270],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),m=c(n),u=a,f=m["".concat(p,".").concat(u)]||m[u]||d[u]||i;return n?r.createElement(f,s(s({ref:t},l),{},{components:n})):r.createElement(f,s({ref:t},l))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,s=new Array(i);s[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[m]="string"==typeof e?e:a,s[1]=o;for(var c=2;c<i;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9883:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const i={hide_table_of_contents:!0},s="Animated Sprite Animation Speed",o={unversionedId:"examples/sprite/animated-sprite-animation-speed",id:"examples/sprite/animated-sprite-animation-speed",title:"Animated Sprite Animation Speed",description:"",source:"@site/docs/examples/sprite/animated-sprite-animation-speed.md",sourceDirName:"examples/sprite",slug:"/examples/sprite/animated-sprite-animation-speed",permalink:"/examples/sprite/animated-sprite-animation-speed",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/sprite/animated-sprite-animation-speed.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Transparent Background",permalink:"/examples/basic/transparent-background"},next:{title:"Animated Sprite Explosion",permalink:"/examples/sprite/animated-sprite-explosion"}},p={},c=[],l={toc:c};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"animated-sprite-animation-speed"},"Animated Sprite Animation Speed"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ autoStart: false, resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\nPIXI.Assets.load('https://beta.pixijs.com/assets/spritesheet/0123456789.json').then((spritesheet) =>\n{\n    // create an array to store the textures\n    const textures = [];\n    let i;\n\n    for (i = 0; i < 10; i++)\n    {\n        const framekey = `0123456789 ${i}.ase`;\n        const texture = PIXI.Texture.from(framekey);\n        const time = spritesheet.data.frames[framekey].duration;\n\n        textures.push({ texture, time });\n    }\n\n    const scaling = 4;\n\n    // create a slow AnimatedSprite\n    const slow = new PIXI.AnimatedSprite(textures);\n\n    slow.anchor.set(0.5);\n    slow.scale.set(scaling);\n    slow.animationSpeed = 0.5;\n    slow.x = (app.screen.width - slow.width) / 2;\n    slow.y = app.screen.height / 2;\n    slow.play();\n    app.stage.addChild(slow);\n\n    // create a fast AnimatedSprite\n    const fast = new PIXI.AnimatedSprite(textures);\n\n    fast.anchor.set(0.5);\n    fast.scale.set(scaling);\n    fast.x = (app.screen.width + fast.width) / 2;\n    fast.y = app.screen.height / 2;\n    fast.play();\n    app.stage.addChild(fast);\n\n    // start animating\n    app.start();\n});\n")))}m.isMDXComponent=!0}}]);