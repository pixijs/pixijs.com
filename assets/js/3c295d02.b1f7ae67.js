"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[2446],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>f});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=a.createContext({}),l=function(e){var n=a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=l(e.components);return a.createElement(c.Provider,{value:n},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=l(t),d=r,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||i;return t?a.createElement(f,o(o({ref:n},p),{},{components:t})):a.createElement(f,o({ref:n},p))}));function f(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=d;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[m]="string"==typeof e?e:r,o[1]=s;for(var l=2;l<i;l++)o[l]=t[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},3567:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var a=t(7462),r=(t(7294),t(3905));const i={hide_table_of_contents:!0},o="Cache As Bitmap",s={unversionedId:"examples/basic/cache-as-bitmap",id:"examples/basic/cache-as-bitmap",title:"Cache As Bitmap",description:"",source:"@site/docs/examples/basic/cache-as-bitmap.md",sourceDirName:"examples/basic",slug:"/examples/basic/cache-as-bitmap",permalink:"/examples/basic/cache-as-bitmap",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/basic/cache-as-bitmap.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Blend Modes",permalink:"/examples/basic/blend-modes"},next:{title:"Container",permalink:"/examples/basic/container"}},c={},l=[],p={toc:l};function m(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"cache-as-bitmap"},"Cache As Bitmap"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\napp.stop();\n\n// load resources\nPIXI.Assets.load('https://beta.pixijs.com/assets/spritesheet/monsters.json')\n    .then(onAssetsLoaded);\n\n// holder to store aliens\nconst aliens = [];\nconst alienFrames = [\n    'eggHead.png',\n    'flowerTop.png',\n    'helmlok.png',\n    'skully.png',\n];\n\nlet count = 0;\n\n// create an empty container\nconst alienContainer = new PIXI.Container();\n\nalienContainer.x = 400;\nalienContainer.y = 300;\n\n// make the stage interactive\napp.stage.interactive = true;\napp.stage.addChild(alienContainer);\n\nfunction onAssetsLoaded()\n{\n    // add a bunch of aliens with textures from image paths\n    for (let i = 0; i < 100; i++)\n    {\n        const frameName = alienFrames[i % 4];\n\n        // create an alien using the frame name..\n        const alien = PIXI.Sprite.from(frameName);\n\n        alien.tint = Math.random() * 0xFFFFFF;\n\n        alien.x = Math.random() * 800 - 400;\n        alien.y = Math.random() * 600 - 300;\n        alien.anchor.x = 0.5;\n        alien.anchor.y = 0.5;\n        aliens.push(alien);\n        alienContainer.addChild(alien);\n    }\n    app.start();\n}\n\n// Combines both mouse click + touch tap\napp.stage.on('pointertap', onClick);\n\nfunction onClick()\n{\n    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;\n}\n\napp.ticker.add(() =>\n{\n    // let's rotate the aliens a little bit\n    for (let i = 0; i < 100; i++)\n    {\n        const alien = aliens[i];\n\n        alien.rotation += 0.1;\n    }\n\n    count += 0.01;\n\n    alienContainer.scale.x = Math.sin(count);\n    alienContainer.scale.y = Math.sin(count);\n    alienContainer.rotation += 0.01;\n});\n")))}m.isMDXComponent=!0}}]);