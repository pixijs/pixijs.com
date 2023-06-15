"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[7118],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),u=c(n),d=a,f=u["".concat(s,".").concat(d)]||u[d]||m[d]||i;return n?r.createElement(f,o(o({ref:t},l),{},{components:n})):r.createElement(f,o({ref:t},l))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p[u]="string"==typeof e?e:a,o[1]=p;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6494:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const i={hide_table_of_contents:!0},o="Basic",p={unversionedId:"examples/sprite/basic",id:"examples/sprite/basic",title:"Basic",description:"",source:"@site/docs/examples/sprite/basic.md",sourceDirName:"examples/sprite",slug:"/examples/sprite/basic",permalink:"/examples/sprite/basic",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/sprite/basic.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Animated Sprite Jet",permalink:"/examples/sprite/animated-sprite-jet"},next:{title:"Texture Swap",permalink:"/examples/sprite/texture-swap"}},s={},c=[],l={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"basic"},"Basic"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ background: '#1099bb', resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\n// create a new Sprite from an image path\nconst bunny = PIXI.Sprite.from('https://beta.pixijs.com/assets/bunny.png');\n\n// center the sprite's anchor point\nbunny.anchor.set(0.5);\n\n// move the sprite to the center of the screen\nbunny.x = app.screen.width / 2;\nbunny.y = app.screen.height / 2;\n\napp.stage.addChild(bunny);\n\n// Listen for animate update\napp.ticker.add((delta) =>\n{\n    // just for fun, let's rotate mr rabbit a little\n    // delta is 1 if running at 100% performance\n    // creates frame-independent transformation\n    bunny.rotation += 0.1 * delta;\n});\n")))}u.isMDXComponent=!0}}]);