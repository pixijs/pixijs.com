"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[5921],{3905:(n,e,t)=>{t.d(e,{Zo:()=>l,kt:()=>m});var r=t(7294);function a(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function i(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function o(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?i(Object(t),!0).forEach((function(e){a(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function s(n,e){if(null==n)return{};var t,r,a=function(n,e){if(null==n)return{};var t,r,a={},i=Object.keys(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||(a[t]=n[t]);return a}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(a[t]=n[t])}return a}var p=r.createContext({}),c=function(n){var e=r.useContext(p),t=e;return n&&(t="function"==typeof n?n(e):o(o({},e),n)),t},l=function(n){var e=c(n.components);return r.createElement(p.Provider,{value:e},n.children)},h="mdxType",g={inlineCode:"code",wrapper:function(n){var e=n.children;return r.createElement(r.Fragment,{},e)}},u=r.forwardRef((function(n,e){var t=n.components,a=n.mdxType,i=n.originalType,p=n.parentName,l=s(n,["components","mdxType","originalType","parentName"]),h=c(t),u=a,m=h["".concat(p,".").concat(u)]||h[u]||g[u]||i;return t?r.createElement(m,o(o({ref:e},l),{},{components:t})):r.createElement(m,o({ref:e},l))}));function m(n,e){var t=arguments,a=e&&e.mdxType;if("string"==typeof n||a){var i=t.length,o=new Array(i);o[0]=u;var s={};for(var p in e)hasOwnProperty.call(e,p)&&(s[p]=e[p]);s.originalType=n,s[h]="string"==typeof n?n:a,o[1]=s;for(var c=2;c<i;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8662:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>p,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=t(7462),a=(t(7294),t(3905));const i={hide_table_of_contents:!0},o="Graphics",s={unversionedId:"examples/masks/graphics",id:"examples/masks/graphics",title:"Graphics",description:"",source:"@site/docs/examples/masks/graphics.md",sourceDirName:"examples/masks",slug:"/examples/masks/graphics",permalink:"/examples/masks/graphics",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/masks/graphics.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Filter",permalink:"/examples/masks/filter"},next:{title:"Sprite",permalink:"/examples/masks/sprite"}},p={},c=[],l={toc:c};function h(n){let{components:e,...t}=n;return(0,a.kt)("wrapper",(0,r.Z)({},l,t,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"graphics"},"Graphics"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ antialias: true, resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\napp.stage.interactive = true;\n\nconst bg = PIXI.Sprite.from('https://beta.pixijs.com/assets/bg_rotate.jpg');\n\nbg.anchor.set(0.5);\n\nbg.x = app.screen.width / 2;\nbg.y = app.screen.height / 2;\n\napp.stage.addChild(bg);\n\nconst container = new PIXI.Container();\n\ncontainer.x = app.screen.width / 2;\ncontainer.y = app.screen.height / 2;\n\n// add a bunch of sprites\nconst bgFront = PIXI.Sprite.from('https://beta.pixijs.com/assets/bg_scene_rotate.jpg');\n\nbgFront.anchor.set(0.5);\n\nconst light2 = PIXI.Sprite.from('https://beta.pixijs.com/assets/light_rotate_2.png');\n\nlight2.anchor.set(0.5);\n\nconst light1 = PIXI.Sprite.from('https://beta.pixijs.com/assets/light_rotate_1.png');\n\nlight1.anchor.set(0.5);\n\nconst panda = PIXI.Sprite.from('https://beta.pixijs.com/assets/panda.png');\n\npanda.anchor.set(0.5);\n\ncontainer.addChild(bgFront, light2, light1, panda);\n\napp.stage.addChild(container);\n\n// let's create a moving shape\nconst thing = new PIXI.Graphics();\n\napp.stage.addChild(thing);\nthing.x = app.screen.width / 2;\nthing.y = app.screen.height / 2;\nthing.lineStyle(0);\n\ncontainer.mask = thing;\n\nlet count = 0;\n\napp.stage.on('pointertap', () =>\n{\n    if (!container.mask)\n    {\n        container.mask = thing;\n    }\n    else\n    {\n        container.mask = null;\n    }\n});\n\nconst help = new PIXI.Text('Click or tap to turn masking on / off.', {\n    fontFamily: 'Arial',\n    fontSize: 12,\n    fontWeight: 'bold',\n    fill: 'white',\n});\n\nhelp.y = app.screen.height - 26;\nhelp.x = 10;\napp.stage.addChild(help);\n\napp.ticker.add(() =>\n{\n    bg.rotation += 0.01;\n    bgFront.rotation -= 0.01;\n\n    light1.rotation += 0.02;\n    light2.rotation += 0.01;\n\n    panda.scale.x = 1 + Math.sin(count) * 0.04;\n    panda.scale.y = 1 + Math.cos(count) * 0.04;\n\n    count += 0.1;\n\n    thing.clear();\n\n    thing.beginFill(0x8bc5ff, 0.4);\n    thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);\n    thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);\n    thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);\n    thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);\n    thing.rotation = count * 0.1;\n});\n")))}h.isMDXComponent=!0}}]);