"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["8514"],{89337:function(e,t,n){n.r(t),n.d(t,{default:()=>p});var r=n("85893");n("67294");var l=n("67026"),i=n("2933"),a=n("82743"),s=n("84681"),o=n("51225"),c=n("61722"),d=n("84315"),u=n("23725"),m=n("94819"),g=n("41835");function h(e){let t=(0,g.CS)(e);return(0,r.jsx)(m.Z,{children:(0,r.jsx)("script",{type:"application/ld+json",children:JSON.stringify(t)})})}function x(e){let{metadata:t}=e,{siteConfig:{title:n}}=(0,i.Z)(),{blogDescription:l,blogTitle:s,permalink:o}=t;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.d,{title:"/"===o?n:s,description:l}),(0,r.jsx)(d.Z,{tag:"blog_posts_list"})]})}function j(e){let{metadata:t,items:n,sidebar:l}=e;return(0,r.jsxs)(o.Z,{sidebar:l,children:[(0,r.jsx)(u.Z,{items:n}),(0,r.jsx)(c.Z,{metadata:t})]})}function p(e){return(0,r.jsxs)(a.FG,{className:(0,l.Z)(s.k.wrapper.blogPages,s.k.page.blogListPage),children:[(0,r.jsx)(x,{...e}),(0,r.jsx)(h,{...e}),(0,r.jsx)(j,{...e})]})}},61722:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(85893);n(67294);var l=n(96025),i=n(50790);function a(e){let{metadata:t}=e,{previousPage:n,nextPage:a}=t;return(0,r.jsxs)("nav",{className:"pagination-nav","aria-label":(0,l.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,r.jsx)(i.Z,{permalink:n,title:(0,r.jsx)(l.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),a&&(0,r.jsx)(i.Z,{permalink:a,title:(0,r.jsx)(l.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},81793:function(e,t,n){n.d(t,{Z:function(){return l}});var r=n(85893);function l(e){let{children:t,className:n}=e;return(0,r.jsx)("article",{className:n,children:t})}n(67294)},10087:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(85893);n(67294);var l=n(67026),i=n(8365),a=n(41835),s=n(36347);function o(e){let{children:t,className:n}=e,{isBlogPostPage:o}=(0,a.nO)();return(0,r.jsx)("div",{id:o?i.blogPostContainerID:void 0,className:(0,l.Z)("markdown",n),children:(0,r.jsx)(s.Z,{children:t})})}},1956:function(e,t,n){n.d(t,{Z:()=>g});var r=n("85893");n("67294");var l=n("67026"),i=n("41835"),a=n("84681"),s=n("49230"),o=n("72501"),c=n("96025"),d=n("83012");function u(){return(0,r.jsx)("b",{children:(0,r.jsx)(c.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function m(e){let{blogPostTitle:t,...n}=e;return(0,r.jsx)(d.Z,{"aria-label":(0,c.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,r.jsx)(u,{})})}function g(){let{metadata:e,isBlogPostPage:t}=(0,i.nO)(),{tags:n,title:c,editUrl:d,hasTruncateMarker:u,lastUpdatedBy:g,lastUpdatedAt:h}=e,x=!t&&u,j=n.length>0;if(!(j||x||d))return null;if(!t)return(0,r.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[j&&(0,r.jsx)("div",{className:(0,l.Z)("col",{"col--9":x}),children:(0,r.jsx)(o.Z,{tags:n})}),x&&(0,r.jsx)("div",{className:(0,l.Z)("col text--right",{"col--3":j}),children:(0,r.jsx)(m,{blogPostTitle:c,to:e.permalink})})]});{let e=!!(d||h||g);return(0,r.jsxs)("footer",{className:"docusaurus-mt-lg",children:[j&&(0,r.jsx)("div",{className:(0,l.Z)("row","margin-top--sm",a.k.blog.blogFooterEditMetaRow),children:(0,r.jsx)("div",{className:"col",children:(0,r.jsx)(o.Z,{tags:n})})}),e&&(0,r.jsx)(s.Z,{className:(0,l.Z)("margin-top--sm",a.k.blog.blogFooterEditMetaRow),editUrl:d,lastUpdatedAt:h,lastUpdatedBy:g})]})}}},18853:function(e,t,n){n.d(t,{Z:()=>v});var r=n("85893");n("67294");var l=n("67026"),i=n("83012"),a=n("41835");let s="title_f1Hy";function o(e){let{className:t}=e,{metadata:n,isBlogPostPage:o}=(0,a.nO)(),{permalink:c,title:d}=n;return(0,r.jsx)(o?"h1":"h2",{className:(0,l.Z)(s,t),children:o?d:(0,r.jsx)(i.Z,{to:c,children:d})})}var c=n("96025"),d=n("43115"),u=n("11437");let m="container_mt6G";function g(e){let{readingTime:t}=e,n=function(){let{selectMessage:e}=(0,d.c)();return t=>{let n=Math.ceil(t);return e(n,(0,c.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:n}))}}();return(0,r.jsx)(r.Fragment,{children:n(t)})}function h(e){let{date:t,formattedDate:n}=e;return(0,r.jsx)("time",{dateTime:t,children:n})}function x(){return(0,r.jsx)(r.Fragment,{children:" \xb7 "})}function j(e){let t,{className:n}=e,{metadata:i}=(0,a.nO)(),{date:s,readingTime:o}=i,c=(0,u.P)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,r.jsxs)("div",{className:(0,l.Z)(m,"margin-vert--md",n),children:[(0,r.jsx)(h,{date:s,formattedDate:(t=s,c.format(new Date(t)))}),void 0!==o&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x,{}),(0,r.jsx)(g,{readingTime:o})]})]})}var p=n("21389");let f={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function Z(e){let{className:t}=e,{metadata:{authors:n},assets:i}=(0,a.nO)();if(0===n.length)return null;let s=n.every(e=>{let{name:t}=e;return!t}),o=1===n.length;return(0,r.jsx)("div",{className:(0,l.Z)("margin-top--md margin-bottom--sm",s?f.imageOnlyAuthorRow:"row",t),children:n.map((e,t)=>(0,r.jsx)("div",{className:(0,l.Z)(!s&&(o?"col col--12":"col col--6"),s?f.imageOnlyAuthorCol:f.authorCol),children:(0,r.jsx)(p.Z,{author:{...e,imageURL:i.authorsImageUrls[t]??e.imageURL}})},t))})}function v(){return(0,r.jsxs)("header",{children:[(0,r.jsx)(o,{}),(0,r.jsx)(j,{}),(0,r.jsx)(Z,{})]})}},23725:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(85893);n(67294);var l=n(41835),i=n(89e3);function a(e){let{items:t,component:n=i.Z}=e;return(0,r.jsx)(r.Fragment,{children:t.map(e=>{let{content:t}=e;return(0,r.jsx)(l.n4,{content:t,children:(0,r.jsx)(n,{children:(0,r.jsx)(t,{})})},t.metadata.permalink)})})}},51225:function(e,t,n){n.d(t,{Z:function(){return s}});var r=n(85893),l=n(67026),i=n(69825),a=n(12577);function s(e){let{sidebar:t,toc:n,children:s,...o}=e,c=t&&t.items.length>0;return(0,r.jsx)(a.Z,{...o,children:(0,r.jsx)("div",{className:"container margin-vert--lg",children:(0,r.jsxs)("div",{className:"row",children:[(0,r.jsx)(i.Z,{sidebar:t}),(0,r.jsx)("main",{className:(0,l.Z)("col",{"col--7":c&&n,"col--9":c&&!n,"col--9 col--offset-1":!c}),itemScope:!0,itemType:"http://schema.org/Blog",children:s}),n&&(0,r.jsx)("div",{className:"col col--2",children:n})]})})})}},89e3:function(e,t,n){n.d(t,{Z:()=>u});var r=n("85893"),l=n("67026");let i="card_Yae6";var a=n("41835"),s=n("81793"),o=n("10087"),c=n("1956"),d=n("18853");function u(e){let{children:t,className:n}=e,u=function(){let{isBlogPostPage:e}=(0,a.nO)();return e?void 0:"margin-bottom--md"}();return(0,r.jsxs)(s.Z,{className:(0,l.Z)(u,n,i),children:[(0,r.jsx)(d.Z,{}),(0,r.jsx)(o.Z,{children:t}),(0,r.jsx)(c.Z,{})]})}},65033:function(e,t,n){n.d(t,{Z:()=>o});var r=n("85893");let l={playgroundCodeBlock:"playgroundCodeBlock_UB3Y"};var i=n("7227"),a=n("98625"),s=n("45056");function o(e){let{children:t,playground:n=!1,usesWebWorkerLibrary:o=!1,...c}=e,d=(0,i.Z)();return n&&d?(0,r.jsx)("div",{className:l.playgroundCodeBlock,children:(0,r.jsx)(a.Z,{code:t,isPixiWebWorkerVersion:o})}):(0,r.jsx)(s.Z,{...c,children:t})}}}]);