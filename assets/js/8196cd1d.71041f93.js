"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[4894],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>f});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var m=r.createContext({}),c=function(e){var n=r.useContext(m),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(m.Provider,{value:n},e.children)},u="mdxType",l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,m=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),d=a,f=u["".concat(m,".").concat(d)]||u[d]||l[d]||o;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var s={};for(var m in n)hasOwnProperty.call(n,m)&&(s[m]=n[m]);s.originalType=e,s[u]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2819:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>m,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=t(7462),a=(t(7294),t(3905));const o={hide_table_of_contents:!0},i="Uniforms",s={unversionedId:"examples/mesh-and-shaders/uniforms",id:"examples/mesh-and-shaders/uniforms",title:"Uniforms",description:"",source:"@site/docs/examples/mesh-and-shaders/uniforms.md",sourceDirName:"examples/mesh-and-shaders",slug:"/examples/mesh-and-shaders/uniforms",permalink:"/examples/mesh-and-shaders/uniforms",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/examples/mesh-and-shaders/uniforms.md",tags:[],version:"current",frontMatter:{hide_table_of_contents:!0},sidebar:"examplesSidebar",previous:{title:"Triangle",permalink:"/examples/mesh-and-shaders/triangle"}},m={},c=[],p={toc:c};function u(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"uniforms"},"Uniforms"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"playground",playground:!0},"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\nconst geometry = new PIXI.Geometry()\n    .addAttribute('aVertexPosition', // the attribute name\n        [-100, -100, // x, y\n            100, -100, // x, y\n            100, 100,\n            -100, 100], // x, y\n        2) // the size of the attribute\n    .addAttribute('aUvs', // the attribute name\n        [0, 0, // u, v\n            1, 0, // u, v\n            1, 1,\n            0, 1], // u, v\n        2) // the size of the attribute\n    .addIndex([0, 1, 2, 0, 2, 3]);\n\nconst vertexSrc = `\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n\n    void main() {\n\n        vUvs = aUvs;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }`;\n\nconst fragmentSrc = `\n\n    precision mediump float;\n\n    varying vec2 vUvs;\n\n    uniform sampler2D uSampler2;\n    uniform float time;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );\n    }`;\n\nconst uniforms = {\n    uSampler2: PIXI.Texture.from('https://beta.pixijs.com/assets/bg_scene_rotate.jpg'),\n    time: 0,\n};\n\nconst shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);\n\nconst quad = new PIXI.Mesh(geometry, shader);\n\nquad.position.set(400, 300);\nquad.scale.set(2);\n\napp.stage.addChild(quad);\n\n// start the animation..\n// requestAnimationFrame(animate);\n\napp.ticker.add((delta) =>\n{\n    quad.rotation += 0.01;\n    quad.shader.uniforms.time += 0.1;\n});\n")))}u.isMDXComponent=!0}}]);