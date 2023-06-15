"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[5225],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>h});var a=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,s=function(e,t){if(null==e)return{};var n,a,s={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var r=a.createContext({}),p=function(e){var t=a.useContext(r),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(r.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,s=e.mdxType,i=e.originalType,r=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=s,h=u["".concat(r,".").concat(m)]||u[m]||c[m]||i;return n?a.createElement(h,o(o({ref:t},d),{},{components:n})):a.createElement(h,o({ref:t},d))}));function h(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var r in t)hasOwnProperty.call(t,r)&&(l[r]=t[r]);l.originalType=e,l[u]="string"==typeof e?e:s,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9739:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(7462),s=(n(7294),n(3905));const i={},o="PixiJS Guides",l={unversionedId:"guides/components/assets",id:"guides/components/assets",title:"PixiJS Guides",description:"The Assets package",source:"@site/docs/guides/components/assets.md",sourceDirName:"guides/components",slug:"/guides/components/assets",permalink:"/guides/components/assets",draft:!1,editUrl:"https://github.com/pixijs/pixijs.com/tree/main/docs/guides/components/assets.md",tags:[],version:"current",frontMatter:{},sidebar:"guidesSidebar",previous:{title:"Scene Graph",permalink:"/guides/basics/scene-graph"},next:{title:"Containers",permalink:"/guides/components/containers"}},r={},p=[{value:"The Assets package",id:"the-assets-package",level:2},{value:"Getting started",id:"getting-started",level:2},{value:"Making our first Assets Promise",id:"making-our-first-assets-promise",level:2},{value:"Warning about solved promises",id:"warning-about-solved-promises",level:2},{value:"Using Async/Await",id:"using-asyncawait",level:2},{value:"Loading multiple assets",id:"loading-multiple-assets",level:2},{value:"Background loading",id:"background-loading",level:2}],d={toc:p};function u(e){let{components:t,...n}=e;return(0,s.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"pixijs-guides"},"PixiJS Guides"),(0,s.kt)("h2",{id:"the-assets-package"},"The Assets package"),(0,s.kt)("p",null,"The Assets package is a modern replacement for the old ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Loader")," class. It is a promise-based resource management solution that will download, cache and parse your assets into something you can use. The downloads can be simultaneous and in the background, meaning faster startup times for your app, the cache ensures that you never download the same asset twice and the extensible parser system allows you to easily extend and customize the process to your needs."),(0,s.kt)("h2",{id:"getting-started"},"Getting started"),(0,s.kt)("p",null,"The ",(0,s.kt)("inlineCode",{parentName:"p"},"@pixi/assets")," package doesn't come bundled with PixiJS in version 6.x and must be added externally, however it will become integrated with version 7. The class that does all the heavy lifting is called ",(0,s.kt)("inlineCode",{parentName:"p"},"AssetsClass")," but you don't need to create your own instance since you will find one ready to use in ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets"),".\nThis package relies heavily on JavaScript Promises that all modern browsers support, however, if your target browser ",(0,s.kt)("a",{parentName:"p",href:"https://caniuse.com/promises"},"doesn't support promises")," you should look into ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/zloirock/core-js#ecmascript-promise"},"polyfilling them"),"."),(0,s.kt)("h2",{id:"making-our-first-assets-promise"},"Making our first Assets Promise"),(0,s.kt)("p",null,"To quickly use the ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets")," instance, you just need to call ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.load")," and pass in an asset. This will return a promise that when resolved will yield the value you seek.\nIn this example, we will load a texture and then turn it into a sprite."),(0,s.kt)("div",{class:"responsive-4-3"},(0,s.kt)("iframe",{src:"https://pixijs.io/examples/?embed=1&showcode=1#/assets/promise.js"})),(0,s.kt)("p",null,"One very important thing to keep in mind while using ",(0,s.kt)("inlineCode",{parentName:"p"},"Assets")," is that all requests are cached and if the URL is the same, the promise returned will also be the same.\nTo show it in code:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"promise1 = PIXI.Assets.load('bunny.png')\npromise2 = PIXI.Assets.load('bunny.png')\n\n//promise1 === promise2\n")),(0,s.kt)("p",null,"Out of the box, the following assets types can be loaded without the need for external plugins:"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Textures (",(0,s.kt)("inlineCode",{parentName:"li"},"avif"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"webp"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"png"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"jpg"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"gif"),")"),(0,s.kt)("li",{parentName:"ul"},"Sprite sheets (",(0,s.kt)("inlineCode",{parentName:"li"},"json"),")"),(0,s.kt)("li",{parentName:"ul"},"Bitmap fonts (",(0,s.kt)("inlineCode",{parentName:"li"},"xml"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"fnt"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"txt"),")"),(0,s.kt)("li",{parentName:"ul"},"Web fonts (",(0,s.kt)("inlineCode",{parentName:"li"},"ttf"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"woff"),", ",(0,s.kt)("inlineCode",{parentName:"li"},"woff2"),")"),(0,s.kt)("li",{parentName:"ul"},"Json files (",(0,s.kt)("inlineCode",{parentName:"li"},"json"),")"),(0,s.kt)("li",{parentName:"ul"},"Text files (",(0,s.kt)("inlineCode",{parentName:"li"},"txt"),")")),(0,s.kt)("p",null,"More types can be added fairly easily by creating additional loader parsers."),(0,s.kt)("h2",{id:"warning-about-solved-promises"},"Warning about solved promises"),(0,s.kt)("p",null,"When an asset is downloaded, it is cached as a promise inside the ",(0,s.kt)("inlineCode",{parentName:"p"},"Assets")," instance and if you try to download it again you will get a reference to the already resolved promise.\nHowever promise handlers ",(0,s.kt)("inlineCode",{parentName:"p"},".then(...)"),"/",(0,s.kt)("inlineCode",{parentName:"p"},".catch(...)"),"/",(0,s.kt)("inlineCode",{parentName:"p"},".finally(...)")," are always asynchronous, this means that even if a promise was already resolved the code below the ",(0,s.kt)("inlineCode",{parentName:"p"},".then(...)"),"/",(0,s.kt)("inlineCode",{parentName:"p"},".catch(...)"),"/",(0,s.kt)("inlineCode",{parentName:"p"},".finally(...)")," will execute before the code inside them.\nSee this example:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"console.log(1);\nalreadyResolvedPromise.then(() => console.log(2));\nconsole.log(3);\n\n// Console output:\n// 1\n// 3\n// 2\n")),(0,s.kt)("p",null,"To learn more about why this happens you will need to learn about ",(0,s.kt)("a",{parentName:"p",href:"https://javascript.info/microtask-queue"},"Microtasks"),", however, using async functions should mitigate this problem."),(0,s.kt)("h2",{id:"using-asyncawait"},"Using Async/Await"),(0,s.kt)("p",null,"There is a way to work with promises that is more intuitive and easier to read: ",(0,s.kt)("inlineCode",{parentName:"p"},"async"),"/",(0,s.kt)("inlineCode",{parentName:"p"},"await"),"."),(0,s.kt)("p",null,"To use it we first need to create a function/method and mark it as ",(0,s.kt)("inlineCode",{parentName:"p"},"async"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"async function test() {\n    // ...\n}\n")),(0,s.kt)("p",null,"This function now wraps the return value in a promise and allows us to use the ",(0,s.kt)("inlineCode",{parentName:"p"},"await")," keyword before a promise to halt the execution of the code until it is resolved and gives us the value."),(0,s.kt)("p",null,"See this example:"),(0,s.kt)("div",{class:"responsive-4-3"},(0,s.kt)("iframe",{src:"https://pixijs.io/examples/?embed=1&showcode=1#/assets/async.js"})),(0,s.kt)("p",null,"The ",(0,s.kt)("inlineCode",{parentName:"p"},"texture")," variable now is not a promise but the resolved texture that resulted after waiting for this promise to resolve."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"const texture = await PIXI.Assets.load('examples/assets/bunny.png');\n")),(0,s.kt)("p",null,"This allows us to write more readable code without falling into callback hell and to better think when our program halts and yields."),(0,s.kt)("h2",{id:"loading-multiple-assets"},"Loading multiple assets"),(0,s.kt)("p",null,"We can add assets to the cache and then load them all simultaneously by using ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.add(...)")," and then calling ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.load(...)")," with all the keys you want to have loaded.\nSee the following example:"),(0,s.kt)("div",{class:"responsive-4-3"},(0,s.kt)("iframe",{src:"https://pixijs.io/examples/?embed=1&showcode=1#/assets/multiple.js"})),(0,s.kt)("p",null,"However, if you want to take full advantage of ",(0,s.kt)("inlineCode",{parentName:"p"},"@pixi/Assets")," you should use bundles.\nBundles are just a way to group assets together and can be added manually by calling ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.addBundle(...)"),"/",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.loadBundle(...)"),"."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"  PIXI.Assets.addBundle('animals', {\n    bunny: 'bunny.png',\n    chicken: 'chicken.png',\n    thumper: 'thumper.png',\n  });\n\n const assets = await PIXI.Assets.loadBundle('animals');\n")),(0,s.kt)("p",null,"However, the best way to handle bundles is to use a manifest and call ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.init({manifest})")," with said manifest (or even better, an URL pointing to it).\nSplitting our assets into bundles that correspond to screens or stages of our app will come in handy for loading in the background while the user is using the app instead of locking them in a single monolithic loading screen."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json"},'{\n   "bundles":[\n      {\n         "name":"load-screen",\n         "assets":[\n            {\n               "name":"background",\n               "srcs":"sunset.png"\n            },\n            {\n               "name":"bar",\n               "srcs":"load-bar.{png,webp}"\n            }\n         ]\n      },\n      {\n         "name":"game-screen",\n         "assets":[\n            {\n               "name":"character",\n               "srcs":"robot.png"\n            },\n            {\n               "name":"enemy",\n               "srcs":"bad-guy.png"\n            }\n         ]\n      }\n   ]\n}\n')),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'PIXI.Assets.init({manifest: "path/manifest.json"});\n')),(0,s.kt)("p",null,"Beware that ",(0,s.kt)("strong",{parentName:"p"},"you can only call ",(0,s.kt)("inlineCode",{parentName:"strong"},"init")," once"),"."),(0,s.kt)("p",null,"Remember there is no downside in repeating URLs since they will all be cached, so if you need the same asset in two bundles you can duplicate the request without any extra cost!"),(0,s.kt)("h2",{id:"background-loading"},"Background loading"),(0,s.kt)("p",null,"The old approach to loading was to use ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Loader")," to load all your assets at the beginning of your app, but users are less patient now and want content to be instantly available so the practices are moving towards loading the bare minimum needed to show the user some content and, while they are interacting with that, we keep loading the following content in the background."),(0,s.kt)("p",null,"Luckily, ",(0,s.kt)("inlineCode",{parentName:"p"},"@pixi/assets")," has us covered with a system that allows us to load everything in the background and in case we need some assets right now, bump them to the top of the queue so we can minimize loading times."),(0,s.kt)("p",null,"To achieve this, we have the methods ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.backgroundLoad(...)")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.backgroundLoadBundle(...)")," that will passively begin to load these assets in the background. So when you finally come to loading them you will get a promise that resolves to the loaded assets immediately."),(0,s.kt)("p",null,"When you finally need the assets to show, you call the usual ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.load(...)")," or ",(0,s.kt)("inlineCode",{parentName:"p"},"PIXI.Assets.loadBundle(...)")," and you will get the corresponding promise."),(0,s.kt)("p",null,"The best way to do this is using bundles, see the following example:"),(0,s.kt)("div",{class:"responsive-4-3"},(0,s.kt)("iframe",{src:"https://pixijs.io/examples/?embed=1&showcode=1#/assets/bundle.js"})),(0,s.kt)("p",null,"We create one bundle for each screen our game will have and set them all to start downloading at the beginning of our app. If the user progresses slowly enough in our app then they should never get to see a loading screen after the first one!"))}u.isMDXComponent=!0}}]);