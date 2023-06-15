"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[5217],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>b});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),s=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(c.Provider,{value:n},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),l=s(t),m=a,b=l["".concat(c,".").concat(m)]||l[m]||d[m]||o;return t?r.createElement(b,i(i({ref:n},u),{},{components:t})):r.createElement(b,i({ref:n},u))}));function b(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var p={};for(var c in n)hasOwnProperty.call(n,c)&&(p[c]=n[c]);p.originalType=e,p[l]="string"==typeof e?e:a,i[1]=p;for(var s=2;s<o;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},154:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var r=t(7462),a=(t(7294),t(3905));const o={hide_table_of_contents:!0},i="Transparent Background",p={unversionedId:"examples/basic/transparent-background",id:"examples/basic/transparent-background",title:"Transparent Background",description:"",source:"@site/docs/examples/basic/transparent-background.md",sourceDirName:"examples/basic",slug:"/examples/basic/transparent-background",permalink:"/examples/basic/transparent-background",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/basic/transparent-background.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Tinting",permalink:"/examples/basic/tinting"},next:{title:"Animated Sprite Animation Speed",permalink:"/examples/sprite/animated-sprite-animation-speed"}},c={},s=[],u={toc:s};function l(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"transparent-background"},"Transparent Background"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ backgroundAlpha: 0, resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\n// create a new Sprite from an image path.\nconst bunny = PIXI.Sprite.from('https://beta.pixijs.com/assets/bunny.png');\n\n// center the sprite's anchor point\nbunny.anchor.set(0.5);\n\n// move the sprite to the center of the screen\nbunny.x = app.screen.width / 2;\nbunny.y = app.screen.height / 2;\n\napp.stage.addChild(bunny);\n\napp.ticker.add(() =>\n{\n    // just for fun, let's rotate mr rabbit a little\n    bunny.rotation += 0.1;\n});\n")))}l.isMDXComponent=!0}}]);