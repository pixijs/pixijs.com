"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["3844"],{2315:function(e,n,i){i.r(n),i.d(n,{default:()=>h,frontMatter:()=>r,metadata:()=>t,assets:()=>o,toc:()=>d,contentTitle:()=>c});var t=JSON.parse('{"id":"guides/advanced/cache-as-texture","title":"Cache As Texture","description":"Using cacheAsTexture in PixiJS","source":"@site/docs/guides/advanced/cache-as-texture.md","sourceDirName":"guides/advanced","slug":"/guides/advanced/cache-as-texture","permalink":"/8.x/guides/advanced/cache-as-texture","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/pixijs.com/tree/main/docs/guides/advanced/cache-as-texture.md","tags":[],"version":"current","frontMatter":{},"sidebar":"guidesSidebar","previous":{"title":"Render Groups","permalink":"/8.x/guides/advanced/render-groups"},"next":{"title":"Mixing PixiJS and Three.js","permalink":"/8.x/guides/advanced/mixing-three-and-pixi"}}'),s=i("85893"),a=i("50065");let r={},c="Cache As Texture",o={},d=[{value:"Using <code>cacheAsTexture</code> in PixiJS",id:"using-cacheastexture-in-pixijs",level:3},{value:"What Is <code>cacheAsTexture</code>?",id:"what-is-cacheastexture",level:3},{value:"Basic Usage",id:"basic-usage",level:3},{value:"Advanced Usage",id:"advanced-usage",level:3},{value:"Benefits of <code>cacheAsTexture</code>",id:"benefits-of-cacheastexture",level:3},{value:"Advanced Details",id:"advanced-details",level:3},{value:"How It Works Internally",id:"how-it-works-internally",level:3},{value:"Best Practices",id:"best-practices",level:3},{value:"<strong>DO</strong>:",id:"do",level:4},{value:"<strong>DON&#39;T</strong>:",id:"dont",level:4},{value:"Gotchas",id:"gotchas",level:3}];function l(e){let n={a:"a",admonition:"admonition",code:"code",h1:"h1",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"cache-as-texture",children:"Cache As Texture"})}),"\n",(0,s.jsxs)(n.h3,{id:"using-cacheastexture-in-pixijs",children:["Using ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," in PixiJS"]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," function in PixiJS is a powerful tool for optimizing rendering in your applications. By rendering a container and its children to a texture, ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," can significantly improve performance for static or infrequently updated containers. Let's explore how to use it effectively, along with its benefits and considerations."]}),"\n",(0,s.jsx)(n.admonition,{title:"Note",type:"info",children:(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"cacheAsTexture"})," is PixiJS v8's equivalent of the previous ",(0,s.jsx)(n.code,{children:"cacheAsBitmap"})," functionality. If you're migrating from v7 or earlier, simply replace ",(0,s.jsx)(n.code,{children:"cacheAsBitmap"})," with ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," in your code."]})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsxs)(n.h3,{id:"what-is-cacheastexture",children:["What Is ",(0,s.jsx)(n.code,{children:"cacheAsTexture"}),"?"]}),"\n",(0,s.jsxs)(n.p,{children:["When you set ",(0,s.jsx)(n.code,{children:"container.cacheAsTexture()"}),", the container is rendered to a texture. Subsequent renders reuse this texture instead of rendering all the individual children of the container. This approach is particularly useful for containers with many static elements, as it reduces the rendering workload."]}),"\n",(0,s.jsx)(n.p,{children:"To update the texture after making changes to the container, call:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"container.updateCacheTexture();\n"})}),"\n",(0,s.jsx)(n.p,{children:"and to turn it off, call:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"container.cacheAsTexture(false);\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"basic-usage",children:"Basic Usage"}),"\n",(0,s.jsxs)(n.p,{children:["Here's an example that demonstrates how to use ",(0,s.jsx)(n.code,{children:"cacheAsTexture"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import * as PIXI from 'pixi.js';\n\n(async () =>\n{\n    // Create a new application\n    const app = new Application();\n\n    // Initialize the application\n    await app.init({ background: '#1099bb', resizeTo: window });\n\n    // Append the application canvas to the document body\n    document.body.appendChild(app.canvas);\n\n    // load sprite sheet..\n    await Assets.load('https://pixijs.com/assets/spritesheet/monsters.json');\n\n    // holder to store aliens\n    const aliens = [];\n    const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'];\n\n    let count = 0;\n\n    // create an empty container\n    const alienContainer = new Container();\n\n    alienContainer.x = 400;\n    alienContainer.y = 300;\n\n    app.stage.addChild(alienContainer);\n\n    // add a bunch of aliens with textures from image paths\n    for (let i = 0; i < 100; i++)\n    {\n        const frameName = alienFrames[i % 4];\n\n        // create an alien using the frame name..\n        const alien = Sprite.from(frameName);\n\n        alien.tint = Math.random() * 0xffffff;\n\n        alien.x = Math.random() * 800 - 400;\n        alien.y = Math.random() * 600 - 300;\n        alien.anchor.x = 0.5;\n        alien.anchor.y = 0.5;\n        aliens.push(alien);\n        alienContainer.addChild(alien);\n    }\n\n    // this will cache the container and its children as a single texture\n    // so instead of drawing 100 sprites, it will draw a single texture!\n    alienContainer.cacheAsTexture()\n})();\n"})}),"\n",(0,s.jsxs)(n.p,{children:["In this example, the ",(0,s.jsx)(n.code,{children:"container"})," and its children are rendered to a single texture, reducing the rendering overhead when the scene is drawn."]}),"\n",(0,s.jsxs)(n.p,{children:["Play around with the example ",(0,s.jsx)(n.a,{href:"../../examples/basic/cache-as-texture",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"advanced-usage",children:"Advanced Usage"}),"\n",(0,s.jsx)(n.p,{children:"Instead of enabling cacheAsTexture with true, you can pass a configuration object which is very similar to texture source options."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"container.cacheAsTexture({\n    resolution: 2,\n    antialias: true,\n});\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"resolution"})," is the resolution of the texture. By default this is the same as you renderer or application."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"antialias"})," is the antialias mode to use for the texture. Much like the resolution this defaults to the renderer or application antialias mode."]}),"\n"]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsxs)(n.h3,{id:"benefits-of-cacheastexture",children:["Benefits of ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Performance Boost"}),": Rendering a complex container as a single texture avoids the need to process each child element individually during each frame."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Optimized for Static Content"}),": Ideal for containers with static or rarely updated children."]}),"\n"]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"advanced-details",children:"Advanced Details"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Memory Tradeoff"}),": Each cached texture requires GPU memory. Using ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," trades rendering speed for increased memory usage."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"GPU Limitations"}),": If your container is too large (e.g., over 4096x4096 pixels), the texture may fail to cache, depending on GPU limitations."]}),"\n"]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"how-it-works-internally",children:"How It Works Internally"}),"\n",(0,s.jsxs)(n.p,{children:["Under the hood, ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," converts the container into a render group and renders it to a texture. It uses the same texture cache mechanism as filters:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"container.enableRenderGroup();\ncontainer.renderGroup.cacheAsTexture = true;\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Once the texture is cached, updating it via ",(0,s.jsx)(n.code,{children:"updateCacheTexture()"})," is efficient and incurs minimal overhead. Its as fast as rendering the container normally."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"best-practices",children:"Best Practices"}),"\n",(0,s.jsxs)(n.h4,{id:"do",children:[(0,s.jsx)(n.strong,{children:"DO"}),":"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Use for Static Content"}),": Apply ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," to containers with elements that don't change frequently, such as a UI panel with static decorations."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Leverage for Performance"}),": Use ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," to render complex containers as a single texture, reducing the overhead of processing each child element individually every frame. This is especially useful for containers that contain expensive effects eg filters."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Switch of Antialiasing"}),": setting antialiasing to false can give a small performance boost, but the texture may look a bit more pixelated around its children's edges."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Resolution"}),": Do adjust the resolution based on your situation, if something is scaled down, you can use a lower resolution.If something is scaled up, you may want to use a higher resolution. But be aware that the higher the resolution the larger the texture and memory footprint."]}),"\n"]}),"\n",(0,s.jsxs)(n.h4,{id:"dont",children:[(0,s.jsx)(n.strong,{children:"DON'T"}),":"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Apply to Very Large Containers"}),": Avoid using ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," on containers that are too large (e.g., over 4096x4096 pixels), as they may fail to cache due to GPU limitations. Instead, split them into smaller containers."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Overuse for Dynamic Content"}),": Flick ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," on / off frequently on containers, as this results in constant re-caching, negating its benefits. Its better to Cache as texture when you once, and then use ",(0,s.jsx)(n.code,{children:"updateCacheTexture"})," to update it."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Apply to Sparse Content"}),": Do not use ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," for containers with very few elements or sparse content, as the performance improvement will be negligible."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"Ignore Memory Impact"}),": Be cautious of GPU memory usage. Each cached texture consumes memory, so overusing ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," can lead to resource constraints."]}),"\n"]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h3,{id:"gotchas",children:"Gotchas"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Rendering Depends on Scene Visibility"}),": The cache updates only when the containing scene is rendered. Modifying the layout after setting ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," but before rendering your scene will be reflected in the cache."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Containers are rendered with no transform"}),": Cached items are rendered at their actual size, ignoring transforms like scaling. For instance, an item scaled down by 50%, its texture will be cached at 100% size and then scaled down by the scene."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Caching and Filters"}),": Filters may not behave as expected with ",(0,s.jsx)(n.code,{children:"cacheAsTexture"}),". To cache the filter effect, wrap the item in a parent container and apply ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," to the parent."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Reusing the texture"}),": If you want to create a new texture based on the container, its better to use ",(0,s.jsx)(n.code,{children:"const texture = renderer.generateTexture(container)"})," and share that amongst you objects!"]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["By understanding and applying ",(0,s.jsx)(n.code,{children:"cacheAsTexture"})," strategically, you can significantly enhance the rendering performance of your PixiJS projects. Happy coding!"]})]})}function h(e={}){let{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}}}]);