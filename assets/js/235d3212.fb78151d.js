"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[1213],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>h});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function d(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?d(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},d=Object.keys(e);for(r=0;r<d.length;r++)t=d[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(r=0;r<d.length;r++)t=d[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},p="mdxType",l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,d=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=c(t),m=a,h=p["".concat(s,".").concat(m)]||p[m]||l[m]||d;return t?r.createElement(h,i(i({ref:n},u),{},{components:t})):r.createElement(h,i({ref:n},u))}));function h(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var d=t.length,i=new Array(d);i[0]=m;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o[p]="string"==typeof e?e:a,i[1]=o;for(var c=2;c<d;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5081:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>d,metadata:()=>o,toc:()=>c});var r=t(7462),a=(t(7294),t(3905));const d={hide_table_of_contents:!0},i="Particle Container",o={unversionedId:"examples/basic/particle-container",id:"examples/basic/particle-container",title:"Particle Container",description:"",source:"@site/docs/examples/basic/particle-container.md",sourceDirName:"examples/basic",slug:"/examples/basic/particle-container",permalink:"/examples/basic/particle-container",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/basic/particle-container.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Container",permalink:"/examples/basic/container"},next:{title:"Simple Plane",permalink:"/examples/basic/simple-plane"}},s={},c=[],u={toc:c};function p(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"particle-container"},"Particle Container"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\nconst sprites = new PIXI.ParticleContainer(10000, {\n    scale: true,\n    position: true,\n    rotation: true,\n    uvs: true,\n    alpha: true,\n});\n\napp.stage.addChild(sprites);\n\n// create an array to store all the sprites\nconst maggots = [];\n\nconst totalSprites = app.renderer instanceof PIXI.Renderer ? 10000 : 100;\n\nfor (let i = 0; i < totalSprites; i++)\n{\n    // create a new Sprite\n    const dude = PIXI.Sprite.from('https://beta.pixijs.com/assets/maggot_tiny.png');\n\n    // set the anchor point so the texture is centerd on the sprite\n    dude.anchor.set(0.5);\n\n    // different maggots, different sizes\n    dude.scale.set(0.8 + Math.random() * 0.3);\n\n    // scatter them all\n    dude.x = Math.random() * app.screen.width;\n    dude.y = Math.random() * app.screen.height;\n\n    dude.tint = Math.random() * 0x808080;\n\n    // create a random direction in radians\n    dude.direction = Math.random() * Math.PI * 2;\n\n    // this number will be used to modify the direction of the sprite over time\n    dude.turningSpeed = Math.random() - 0.8;\n\n    // create a random speed between 0 - 2, and these maggots are slooww\n    dude.speed = (2 + Math.random() * 2) * 0.2;\n\n    dude.offset = Math.random() * 100;\n\n    // finally we push the dude into the maggots array so it it can be easily accessed later\n    maggots.push(dude);\n\n    sprites.addChild(dude);\n}\n\n// create a bounding box box for the little maggots\nconst dudeBoundsPadding = 100;\nconst dudeBounds = new PIXI.Rectangle(\n    -dudeBoundsPadding,\n    -dudeBoundsPadding,\n    app.screen.width + dudeBoundsPadding * 2,\n    app.screen.height + dudeBoundsPadding * 2,\n);\n\nlet tick = 0;\n\napp.ticker.add(() =>\n{\n    // iterate through the sprites and update their position\n    for (let i = 0; i < maggots.length; i++)\n    {\n        const dude = maggots[i];\n\n        dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;\n        dude.direction += dude.turningSpeed * 0.01;\n        dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);\n        dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);\n        dude.rotation = -dude.direction + Math.PI;\n\n        // wrap the maggots\n        if (dude.x < dudeBounds.x)\n        {\n            dude.x += dudeBounds.width;\n        }\n        else if (dude.x > dudeBounds.x + dudeBounds.width)\n        {\n            dude.x -= dudeBounds.width;\n        }\n\n        if (dude.y < dudeBounds.y)\n        {\n            dude.y += dudeBounds.height;\n        }\n        else if (dude.y > dudeBounds.y + dudeBounds.height)\n        {\n            dude.y -= dudeBounds.height;\n        }\n    }\n\n    // increment the ticker\n    tick += 0.1;\n});\n")))}p.isMDXComponent=!0}}]);