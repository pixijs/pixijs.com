"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["5026"],{41835:function(e,t,a){a.d(t,{CS:()=>f,iZ:()=>b,ci:()=>k,Ne:()=>Z,cH:()=>_,nO:()=>c,wj:()=>s,n4:()=>u});var n=a("85893"),r=a("67294"),i=a("85346"),l=a("78312");function s(){let e=(0,l.Z)(),t=e?.data?.blogMetadata;if(!t)throw Error("useBlogMetadata() can't be called on the current route because the blog metadata could not be found in route context");return t}let o=r.createContext(null);function u(e){let{children:t,content:a,isBlogPostPage:i=!1}=e,l=function(e){let{content:t,isBlogPostPage:a}=e;return(0,r.useMemo)(()=>({metadata:t.metadata,frontMatter:t.frontMatter,assets:t.assets,toc:t.toc,isBlogPostPage:a}),[t,a])}({content:a,isBlogPostPage:i});return(0,n.jsx)(o.Provider,{value:l,children:t})}function c(){let e=(0,r.useContext)(o);if(null===e)throw new i.i6("BlogPostProvider");return e}var m=a("4757"),d=a("2933");let g=e=>new Date(e).toISOString();function h(e){let t=e.map(x);return{author:1===t.length?t[0]:t}}function p(e,t,a){return e?{image:function(e){let{imageUrl:t,caption:a}=e;return{"@type":"ImageObject","@id":t,url:t,contentUrl:t,caption:a}}({imageUrl:t(e,{absolute:!0}),caption:`title image for the blog post: ${a}`})}:{}}function f(e){let{siteConfig:t}=(0,d.Z)(),{withBaseUrl:a}=(0,m.Cg)(),{metadata:{blogDescription:n,blogTitle:r,permalink:i}}=e,l=`${t.url}${i}`;return{"@context":"https://schema.org","@type":"Blog","@id":l,mainEntityOfPage:l,headline:r,description:n,blogPost:e.items.map(e=>(function(e,t,a){let{assets:n,frontMatter:r,metadata:i}=e,{date:l,title:s,description:o,lastUpdatedAt:u}=i,c=n.image??r.image,m=r.keywords??[],d=`${t.url}${i.permalink}`,f=u?g(u):void 0;return{"@type":"BlogPosting","@id":d,mainEntityOfPage:d,url:d,headline:s,name:s,description:o,datePublished:l,...f?{dateModified:f}:{},...h(i.authors),...p(c,a,s),...m?{keywords:m}:{}}})(e.content,t,a))}}function b(){let e=s(),{assets:t,metadata:a}=c(),{siteConfig:n}=(0,d.Z)(),{withBaseUrl:r}=(0,m.Cg)(),{date:i,title:l,description:o,frontMatter:u,lastUpdatedAt:f}=a,b=t.image??u.image,x=u.keywords??[],j=f?g(f):void 0,v=`${n.url}${a.permalink}`;return{"@context":"https://schema.org","@type":"BlogPosting","@id":v,mainEntityOfPage:v,url:v,headline:l,name:l,description:o,datePublished:i,...j?{dateModified:j}:{},...h(a.authors),...p(b,r,l),...x?{keywords:x}:{},isPartOf:{"@type":"Blog","@id":`${n.url}${e.blogBasePath}`,name:e.blogTitle}}}function x(e){return{"@type":"Person",...e.name?{name:e.name}:{},...e.title?{description:e.title}:{},...e.url?{url:e.url}:{},...e.email?{email:e.email}:{},...e.imageURL?{image:e.imageURL}:{}}}var j=a("16550"),v=a("83012"),N=a("38341"),C=a("79246");function _(e){let{pathname:t}=(0,j.TH)();return(0,r.useMemo)(()=>e.filter(e=>{var a,n;return a=e,n=t,(!a.unlisted||!!(0,C.Mg)(a.permalink,n))&&!0}),[e,t])}function k(e){let t=Object.entries((0,N.vM)(e,e=>`${new Date(e.date).getFullYear()}`));return t.reverse(),t}function Z(e){let{items:t,ulClassName:a,liClassName:r,linkClassName:i,linkActiveClassName:l}=e;return(0,n.jsx)("ul",{className:a,children:t.map(e=>(0,n.jsx)("li",{className:r,children:(0,n.jsx)(v.Z,{isNavLink:!0,to:e.permalink,className:i,activeClassName:l,children:e.title})},e.permalink))})}},69825:function(e,t,a){a.d(t,{Z:()=>P});var n=a("85893"),r=a("67294"),i=a("54704"),l=a("67026"),s=a("96025"),o=a("41835"),u=a("30140"),c=a("34403");function m(e){let{year:t,yearGroupHeadingClassName:a,children:r}=e;return(0,n.jsxs)("div",{role:"group",children:[(0,n.jsx)(c.Z,{as:"h3",className:a,children:t}),r]})}let d=(0,r.memo)(function(e){let{items:t,yearGroupHeadingClassName:a,ListComponent:r}=e;if(!(0,u.L)().blog.sidebar.groupByYear)return(0,n.jsx)(r,{items:t});{let e=(0,o.ci)(t);return(0,n.jsx)(n.Fragment,{children:e.map(e=>{let[t,i]=e;return(0,n.jsx)(m,{year:t,yearGroupHeadingClassName:a,children:(0,n.jsx)(r,{items:i})},t)})})}}),g="sidebar_re4s",h="sidebarItemTitle_pO2u",p="sidebarItemList_Yudw",f="sidebarItem__DBe",b="sidebarItemLink_mo7H",x="sidebarItemLinkActive_I1ZP",j="yearGroupHeading_rMGB",v=e=>{let{items:t}=e;return(0,n.jsx)(o.Ne,{items:t,ulClassName:(0,l.Z)(p,"clean-list"),liClassName:f,linkClassName:b,linkActiveClassName:x})},N=(0,r.memo)(function(e){let{sidebar:t}=e,a=(0,o.cH)(t.items);return(0,n.jsx)("aside",{className:"col col--3",children:(0,n.jsxs)("nav",{className:(0,l.Z)(g,"thin-scrollbar"),"aria-label":(0,s.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"}),children:[(0,n.jsx)("div",{className:(0,l.Z)(h,"margin-bottom--md"),children:t.title}),(0,n.jsx)(d,{items:a,ListComponent:v,yearGroupHeadingClassName:j})]})})});var C=a("11179");let _="yearGroupHeading_QT03",k=e=>{let{items:t}=e;return(0,n.jsx)(o.Ne,{items:t,ulClassName:"menu__list",liClassName:"menu__list-item",linkClassName:"menu__link",linkActiveClassName:"menu__link--active"})};function Z(e){let{sidebar:t}=e,a=(0,o.cH)(t.items);return(0,n.jsx)(d,{items:a,ListComponent:k,yearGroupHeadingClassName:_})}let y=(0,r.memo)(function(e){return(0,n.jsx)(C.Zo,{component:Z,props:e})});function P(e){let{sidebar:t}=e,a=(0,i.i)();return t?.items.length?"mobile"===a?(0,n.jsx)(y,{sidebar:t}):(0,n.jsx)(N,{sidebar:t}):null}},93867:function(e,t,a){a.r(t),a.d(t,{default:()=>f});var n=a("85893");a("67294");var r=a("67026"),i=a("96025");let l=()=>(0,i.I)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});var s=a("82743"),o=a("84681"),u=a("51225"),c=a("48627"),m=a("34403");let d="tag_Nnez";function g(e){let{letterEntry:t}=e;return(0,n.jsxs)("article",{children:[(0,n.jsx)(m.Z,{as:"h2",id:t.letter,children:t.letter}),(0,n.jsx)("ul",{className:"padding--none",children:t.tags.map(e=>(0,n.jsx)("li",{className:d,children:(0,n.jsx)(c.Z,{...e})},e.permalink))}),(0,n.jsx)("hr",{})]})}function h(e){let{tags:t}=e,a=function(e){let t={};return Object.values(e).forEach(e=>{let a=e.label[0].toUpperCase();t[a]??=[],t[a].push(e)}),Object.entries(t).sort((e,t)=>{let[a]=e,[n]=t;return a.localeCompare(n)}).map(e=>{let[t,a]=e;return{letter:t,tags:a.sort((e,t)=>e.label.localeCompare(t.label))}})}(t);return(0,n.jsx)("section",{className:"margin-vert--lg",children:a.map(e=>(0,n.jsx)(g,{letterEntry:e},e.letter))})}var p=a("84315");function f(e){let{tags:t,sidebar:a}=e,i=l();return(0,n.jsxs)(s.FG,{className:(0,r.Z)(o.k.wrapper.blogPages,o.k.page.blogTagsListPage),children:[(0,n.jsx)(s.d,{title:i}),(0,n.jsx)(p.Z,{tag:"blog_tags_list"}),(0,n.jsxs)(u.Z,{sidebar:a,children:[(0,n.jsx)(m.Z,{as:"h1",children:i}),(0,n.jsx)(h,{tags:t})]})]})}},48627:function(e,t,a){a.d(t,{Z:()=>s});var n=a("85893");a("67294");var r=a("67026"),i=a("83012");let l={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};function s(e){let{permalink:t,label:a,count:s,description:o}=e;return(0,n.jsxs)(i.Z,{href:t,title:o,className:(0,r.Z)(l.tag,s?l.tagWithCount:l.tagRegular),children:[a,s&&(0,n.jsx)("span",{children:s})]})}}}]);