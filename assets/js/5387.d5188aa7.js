"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["5387"],{61722:function(e,t,n){n.d(t,{Z:function(){return s}});var r=n(85893);n(67294);var i=n(96025),a=n(50790);function s(e){let{metadata:t}=e,{previousPage:n,nextPage:s}=t;return(0,r.jsxs)("nav",{className:"pagination-nav","aria-label":(0,i.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[n&&(0,r.jsx)(a.Z,{permalink:n,title:(0,r.jsx)(i.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),s&&(0,r.jsx)(a.Z,{permalink:s,title:(0,r.jsx)(i.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},81793:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(85893);function i(e){let{children:t,className:n}=e;return(0,r.jsx)("article",{className:n,children:t})}n(67294)},10087:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(85893);n(67294);var i=n(67026),a=n(8365),s=n(41835),l=n(36347);function o(e){let{children:t,className:n}=e,{isBlogPostPage:o}=(0,s.nO)();return(0,r.jsx)("div",{id:o?a.blogPostContainerID:void 0,className:(0,i.Z)("markdown",n),children:(0,r.jsx)(l.Z,{children:t})})}},1956:function(e,t,n){n.d(t,{Z:()=>h});var r=n("85893");n("67294");var i=n("67026"),a=n("41835"),s=n("84681"),l=n("49230"),o=n("72501"),c=n("96025"),u=n("83012");function d(){return(0,r.jsx)("b",{children:(0,r.jsx)(c.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function g(e){let{blogPostTitle:t,...n}=e;return(0,r.jsx)(u.Z,{"aria-label":(0,c.I)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...n,children:(0,r.jsx)(d,{})})}function h(){let{metadata:e,isBlogPostPage:t}=(0,a.nO)(),{tags:n,title:c,editUrl:u,hasTruncateMarker:d,lastUpdatedBy:h,lastUpdatedAt:m}=e,p=!t&&d,f=n.length>0;if(!(f||p||u))return null;if(!t)return(0,r.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[f&&(0,r.jsx)("div",{className:(0,i.Z)("col",{"col--9":p}),children:(0,r.jsx)(o.Z,{tags:n})}),p&&(0,r.jsx)("div",{className:(0,i.Z)("col text--right",{"col--3":f}),children:(0,r.jsx)(g,{blogPostTitle:c,to:e.permalink})})]});{let e=!!(u||m||h);return(0,r.jsxs)("footer",{className:"docusaurus-mt-lg",children:[f&&(0,r.jsx)("div",{className:(0,i.Z)("row","margin-top--sm",s.k.blog.blogFooterEditMetaRow),children:(0,r.jsx)("div",{className:"col",children:(0,r.jsx)(o.Z,{tags:n})})}),e&&(0,r.jsx)(l.Z,{className:(0,i.Z)("margin-top--sm",s.k.blog.blogFooterEditMetaRow),editUrl:u,lastUpdatedAt:m,lastUpdatedBy:h})]})}}},18853:function(e,t,n){n.d(t,{Z:()=>Z});var r=n("85893");n("67294");var i=n("67026"),a=n("83012"),s=n("41835");let l="title_f1Hy";function o(e){let{className:t}=e,{metadata:n,isBlogPostPage:o}=(0,s.nO)(),{permalink:c,title:u}=n;return(0,r.jsx)(o?"h1":"h2",{className:(0,i.Z)(l,t),children:o?u:(0,r.jsx)(a.Z,{to:c,children:u})})}var c=n("96025"),u=n("43115"),d=n("11437");let g="container_mt6G";function h(e){let{readingTime:t}=e,n=function(){let{selectMessage:e}=(0,u.c)();return t=>{let n=Math.ceil(t);return e(n,(0,c.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:n}))}}();return(0,r.jsx)(r.Fragment,{children:n(t)})}function m(e){let{date:t,formattedDate:n}=e;return(0,r.jsx)("time",{dateTime:t,children:n})}function p(){return(0,r.jsx)(r.Fragment,{children:" \xb7 "})}function f(e){let t,{className:n}=e,{metadata:a}=(0,s.nO)(),{date:l,readingTime:o}=a,c=(0,d.P)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,r.jsxs)("div",{className:(0,i.Z)(g,"margin-vert--md",n),children:[(0,r.jsx)(m,{date:l,formattedDate:(t=l,c.format(new Date(t)))}),void 0!==o&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(p,{}),(0,r.jsx)(h,{readingTime:o})]})]})}var x=n("21389");let j={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function b(e){let{className:t}=e,{metadata:{authors:n},assets:a}=(0,s.nO)();if(0===n.length)return null;let l=n.every(e=>{let{name:t}=e;return!t}),o=1===n.length;return(0,r.jsx)("div",{className:(0,i.Z)("margin-top--md margin-bottom--sm",l?j.imageOnlyAuthorRow:"row",t),children:n.map((e,t)=>(0,r.jsx)("div",{className:(0,i.Z)(!l&&(o?"col col--12":"col col--6"),l?j.imageOnlyAuthorCol:j.authorCol),children:(0,r.jsx)(x.Z,{author:{...e,imageURL:a.authorsImageUrls[t]??e.imageURL}})},t))})}function Z(){return(0,r.jsxs)("header",{children:[(0,r.jsx)(o,{}),(0,r.jsx)(f,{}),(0,r.jsx)(b,{})]})}},23725:function(e,t,n){n.d(t,{Z:function(){return s}});var r=n(85893);n(67294);var i=n(41835),a=n(89e3);function s(e){let{items:t,component:n=a.Z}=e;return(0,r.jsx)(r.Fragment,{children:t.map(e=>{let{content:t}=e;return(0,r.jsx)(i.n4,{content:t,children:(0,r.jsx)(n,{children:(0,r.jsx)(t,{})})},t.metadata.permalink)})})}},6374:function(e,t,n){n.r(t),n.d(t,{default:function(){return j}});var r=n(85893);n(67294);var i=n(67026),a=n(96025),s=n(82743),l=n(84681),o=n(58267),c=n(83012),u=n(51225),d=n(61722),g=n(84315),h=n(23725),m=n(15133),p=n(34403);function f(e){let{tag:t}=e,n=(0,o.Wi)(t);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.d,{title:n,description:t.description}),(0,r.jsx)(g.Z,{tag:"blog_tags_posts"})]})}function x(e){let{tag:t,items:n,sidebar:i,listMetadata:s}=e,l=(0,o.Wi)(t);return(0,r.jsxs)(u.Z,{sidebar:i,children:[t.unlisted&&(0,r.jsx)(m.Z,{}),(0,r.jsxs)("header",{className:"margin-bottom--xl",children:[(0,r.jsx)(p.Z,{as:"h1",children:l}),t.description&&(0,r.jsx)("p",{children:t.description}),(0,r.jsx)(c.Z,{href:t.allTagsPath,children:(0,r.jsx)(a.Z,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page",children:"View All Tags"})})]}),(0,r.jsx)(h.Z,{items:n}),(0,r.jsx)(d.Z,{metadata:s})]})}function j(e){return(0,r.jsxs)(s.FG,{className:(0,i.Z)(l.k.wrapper.blogPages,l.k.page.blogTagPostListPage),children:[(0,r.jsx)(f,{...e}),(0,r.jsx)(x,{...e})]})}},15133:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(85893);n(67294);var i=n(67026),a=n(30202),s=n(84681),l=n(75094);function o(e){let{className:t}=e;return(0,r.jsx)(l.Z,{type:"caution",title:(0,r.jsx)(a.cI,{}),className:(0,i.Z)(t,s.k.common.unlistedBanner),children:(0,r.jsx)(a.eU,{})})}function c(e){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(a.T$,{}),(0,r.jsx)(o,{...e})]})}},58267:function(e,t,n){n.d(t,{HV:function(){return s},Wi:function(){return a}}),n(85893),n(67294);var r=n(96025),i=n(43115);function a(e){let t=function(){let{selectMessage:e}=(0,i.c)();return t=>e(t,(0,r.I)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:t}))}();return(0,r.I)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:t(e.count),tagName:e.label})}let s=()=>(0,r.I)({id:"theme.blog.authorsList.pageTitle",message:"Authors",description:"The title of the authors page"})},30202:function(e,t,n){n.d(t,{T$:function(){return o},cI:function(){return s},eU:function(){return l},ht:function(){return c},xo:function(){return u}});var r=n(85893);n(67294);var i=n(96025),a=n(94819);function s(){return(0,r.jsx)(i.Z,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"})}function l(){return(0,r.jsx)(i.Z,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."})}function o(){return(0,r.jsx)(a.Z,{children:(0,r.jsx)("meta",{name:"robots",content:"noindex, nofollow"})})}function c(){return(0,r.jsx)(i.Z,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"})}function u(){return(0,r.jsx)(i.Z,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."})}}}]);