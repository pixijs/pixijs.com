"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["5785"],{10372:function(e,t,n){n.r(t),n.d(t,{default:()=>f,frontMatter:()=>o,metadata:()=>r,assets:()=>c,toc:()=>p,contentTitle:()=>s});var r=JSON.parse('{"id":"playground/index","title":"index","description":"","source":"@site/versioned_docs/version-7.x/playground/index.md","sourceDirName":"playground","slug":"/playground/","permalink":"/7.x/playground/","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","frontMatter":{"hide_title":true,"pagination_next":null,"pagination_prev":null,"custom_edit_url":null}}'),i=n("85893"),a=n("50065"),u=n("85612"),l=n("99883");let o={hide_title:!0,pagination_next:null,pagination_prev:null,custom_edit_url:null},s=void 0,c={},p=[];function d(e){return(0,i.jsx)(u.Z,{pixiVersion:l})}function f(e={}){let{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},85612:function(e,t,n){n.d(t,{Z:()=>F});var r,i=n("85893");let a="wrapper_GThw",u="nav_LVun",l="select_VJqz";var o=n("70144"),s=n("98625"),c=n("80289");function p(e){return null!=e&&"object"==typeof e&&!0===e["@@functional/placeholder"]}function d(e){return function t(n){return 0==arguments.length||p(n)?t:e.apply(this,arguments)}}function f(e){return function t(n,r){switch(arguments.length){case 0:return t;case 1:return p(n)?t:d(function(t){return e(n,t)});default:return p(n)&&p(r)?t:p(n)?d(function(t){return e(t,r)}):p(r)?d(function(t){return e(n,t)}):e(n,r)}}}var h=(r=function(e,t,n){return e(n)?n:t(n)},function e(t,n,i){switch(arguments.length){case 0:return e;case 1:return p(t)?e:f(function(e,n){return r(t,e,n)});case 2:return p(t)&&p(n)?e:p(t)?f(function(e,t){return r(e,n,t)}):p(n)?f(function(e,n){return r(t,e,n)}):d(function(e){return r(t,n,e)});default:return p(t)&&p(n)&&p(i)?e:p(t)&&p(n)?f(function(e,t){return r(e,t,i)}):p(t)&&p(i)?f(function(e,t){return r(e,n,t)}):p(n)&&p(i)?f(function(e,n){return r(t,e,n)}):p(t)?d(function(e){return r(e,n,i)}):p(n)?d(function(e){return r(t,e,i)}):p(i)?d(function(e){return r(t,n,e)}):r(t,n,i)}}),x=d(function(e){return null==e});let m=Array.isArray||function(e){return null!=e&&e.length>=0&&"[object Array]"===Object.prototype.toString.call(e)};var v=f(function e(t,n){if(r=n,"[object Object]"!==Object.prototype.toString.call(r)&&!m(n))return n;var r,i,a,u,l=n instanceof Array?[]:{};for(a in n)u=typeof(i=t[a]),l[a]="function"===u?i(n[a]):i&&"object"===u?e(i,n[a]):n[a];return l}),g=n("67294"),j=n("16550");let b=h(x,function(e){return btoa(JSON.stringify(e))}),y=h(x,function(e){try{return JSON.parse(atob(e))}catch{return}}),_=v({state:b}),S=v({state:y}),N=e=>{let{defaultExampleId:t}=e;return function(e,t,n){let r=(0,j.k6)(),i=(0,g.useMemo)(()=>n(Array.from(new URLSearchParams(r.location.search).entries()).reduce((e,t)=>{let[n,r]=t;return{...e,[n]:r}},{})),[n,r.location.search]),a=(0,g.useRef)("function"==typeof e?e(i):e),u=(0,g.useMemo)(()=>({...a.current,...i}),[i]);return[u,function(e){let n=!(arguments.length>1)||void 0===arguments[1]||arguments[1],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],l=new URLSearchParams(Object.entries(t(Object.entries("function"==typeof e?e(u):{...u,...e}).reduce((e,t)=>{let[n,r]=t;return r===a.current[n]?e:{...e,[n]:r}},{})))),o={pathname:location.pathname,search:l.toString()};i?n?r.push(o):r.replace(o):n?history.pushState(o,"",`${o.pathname}?${l.toString()}`):history.replaceState(o,"",`${o.pathname}?${l.toString()}`)}]}(e=>{let{state:n,exampleId:r}=e;return{state:n??void 0,exampleId:n?"custom":r??t}},_,S)};var w=n("63387"),O=n.n(w);let k="select_LFtK",A="label_iJQG",C="labelText_vfPa",V=e=>e.length>0&&Array.isArray(e[0].options),J=e=>e.map(e=>{let{value:t,label:n}=e;return(0,i.jsx)("option",{value:t,children:n},t)}),L=e=>e.map(e=>{let{label:t,options:n}=e;return(0,i.jsx)("optgroup",{label:t,children:J(n)},t)});function P(e){let{className:t,label:n,labelClassName:r,selectedId:a,options:u,onValueChange:l,...o}=e,s=(0,g.useCallback)(e=>{l(e.target.value)},[l]),c=V(u),p=(0,i.jsxs)("select",{className:O()(k,t),...o,value:a,onChange:s,children:[c&&L(u),!c&&J(u)]});return n?(0,i.jsxs)("label",{className:O()(A,r),children:[(0,i.jsx)("span",{className:C,children:n}),p]}):p}function F(e){let{pixiVersion:t}=e,[n,r]=N({defaultExampleId:c.L8,defaultPixiVersion:t.version}),{state:p,exampleId:d}=n,{indexCode:f,extraFiles:h,activeFile:x,usesWebWorkerLibrary:m,exampleOptions:v,handleOptionSelected:g,handleEditorCodeChanged:j}=(0,c.AQ)({urlState:p,selectedOptionId:d,setURLState:r,pixiVersion:t});return(0,i.jsx)("div",{className:a,children:(0,i.jsx)(o.Z,{children:()=>(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:u,children:(0,i.jsx)(P,{label:"Example:",labelClassName:l,selectedId:d,options:v,onValueChange:g})}),(0,i.jsx)(s.Z,{code:f,extraFiles:h,activeFile:x,pixiVersion:t.version,isPixiDevVersion:t.dev,isPixiWebWorkerVersion:m,onCodeChanged:j,mode:"fullscreen"})]})})})}},99883:function(e){e.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);