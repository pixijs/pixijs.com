"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[3608],{3169:(e,r,s)=>{s.r(r),s.d(r,{default:()=>d});s(7294);var t=s(9960),a=s(5999),i=s(833),c=s(1732),n=s(5893);function l(e){let{year:r,posts:s}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h3",{children:r}),(0,n.jsx)("ul",{children:s.map((e=>(0,n.jsx)("li",{children:(0,n.jsxs)(t.Z,{to:e.metadata.permalink,children:[e.metadata.formattedDate," - ",e.metadata.title]})},e.metadata.date)))})]})}function h(e){let{years:r}=e;return(0,n.jsx)("section",{className:"margin-vert--lg",children:(0,n.jsx)("div",{className:"container",children:(0,n.jsx)("div",{className:"row",children:r.map(((e,r)=>(0,n.jsx)("div",{className:"col col--4 margin-vert--lg",children:(0,n.jsx)(l,{...e})},r)))})})})}function d(e){let{archive:r}=e;const s=(0,a.I)({id:"theme.blog.archive.title",message:"Archive",description:"The page & hero title of the blog archive page"}),t=(0,a.I)({id:"theme.blog.archive.description",message:"Archive",description:"The page & hero description of the blog archive page"}),l=function(e){const r=e.reduceRight(((e,r)=>{const s=r.metadata.date.split("-")[0],t=e.get(s)??[];return e.set(s,[r,...t])}),new Map);return Array.from(r,(e=>{let[r,s]=e;return{year:r,posts:s}}))}(r.blogPosts);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.d,{title:s,description:t}),(0,n.jsxs)(c.Z,{children:[(0,n.jsx)("header",{className:"hero hero--primary",children:(0,n.jsxs)("div",{className:"container",children:[(0,n.jsx)("h1",{className:"hero__title",children:s}),(0,n.jsx)("p",{className:"hero__subtitle",children:t})]})}),(0,n.jsx)("main",{children:l.length>0&&(0,n.jsx)(h,{years:l})})]})]})}}}]);