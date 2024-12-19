"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["2424"],{26266:function(e,t,s){s.r(t),s.d(t,{default:()=>u,frontMatter:()=>i,metadata:()=>r,assets:()=>l,toc:()=>d,contentTitle:()=>n});var r=JSON.parse('{"id":"guides/components/textures","title":"Textures","description":"We\'re slowly working our way down from the high level to the low.  We\'ve talked about the scene graph, and in general about display objects that live in it.  We\'re about to get to sprites and other simple display objects.  But before we do, we need to talk about textures.","source":"@site/docs/guides/components/textures.md","sourceDirName":"guides/components","slug":"/guides/components/textures","permalink":"/8.x/guides/components/textures","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/pixijs.com/tree/main/docs/guides/components/textures.md","tags":[],"version":"current","frontMatter":{},"sidebar":"guidesSidebar","previous":{"title":"Text","permalink":"/8.x/guides/components/text"},"next":{"title":"Performance Tips","permalink":"/8.x/guides/production/performance-tips"}}'),a=s("85893"),o=s("50065");let i={},n="Textures",l={},d=[{value:"Life-cycle of a Texture",id:"life-cycle-of-a-texture",level:2},{value:"Serving the Image",id:"serving-the-image",level:3},{value:"Loading the Image",id:"loading-the-image",level:3},{value:"TextureSources Own the Data",id:"texturesources-own-the-data",level:3},{value:"Textures are a View on BaseTextures",id:"textures-are-a-view-on-basetextures",level:3},{value:"Loading Textures",id:"loading-textures",level:2},{value:"Unloading Textures",id:"unloading-textures",level:2},{value:"Beyond Images",id:"beyond-images",level:2}];function h(e){let t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.header,{children:(0,a.jsx)(t.h1,{id:"textures",children:"Textures"})}),"\n",(0,a.jsx)(t.p,{children:"We're slowly working our way down from the high level to the low.  We've talked about the scene graph, and in general about display objects that live in it.  We're about to get to sprites and other simple display objects.  But before we do, we need to talk about textures."}),"\n",(0,a.jsx)(t.p,{children:"In PixiJS, textures are one of the core resources used by display objects.  A texture, broadly speaking, represents a source of pixels to be used to fill in an area on the screen.  The simplest example is a sprite - a rectangle that is completely filled with a single texture.  But things can get much more complex."}),"\n",(0,a.jsx)(t.h2,{id:"life-cycle-of-a-texture",children:"Life-cycle of a Texture"}),"\n",(0,a.jsx)(t.p,{children:"Let's examine how textures really work, by following the path your image data travels on its way to the screen."}),"\n",(0,a.jsx)(t.p,{children:"Here's the flow we're going to follow:  Source Image > Loader > BaseTexture > Texture"}),"\n",(0,a.jsx)(t.h3,{id:"serving-the-image",children:"Serving the Image"}),"\n",(0,a.jsxs)(t.p,{children:["To start with, you have the image you want to display.  The first step is to make it available on your server.  This may seem obvious, but if you're coming to PixiJS from other game development systems, it's worth remembering that everything has to be loaded over the network.  If you're developing locally, please be aware that you ",(0,a.jsx)(t.em,{children:"must"})," use a webserver to test, or your images won't load due to how browsers treat local file security."]}),"\n",(0,a.jsx)(t.h3,{id:"loading-the-image",children:"Loading the Image"}),"\n",(0,a.jsxs)(t.p,{children:["To work with the image, the first step is to pull the image file from your webserver into the user's web browser.  To do this, we can use ",(0,a.jsx)(t.code,{children:"Assets.load('myTexture.png')"}),".  ",(0,a.jsx)(t.code,{children:"Assets"})," wraps and deals with telling the browser to fetch the image, convert it and then let you when that has been completed.  This process is ",(0,a.jsx)(t.em,{children:"asynchronous"})," - you request the load, then time passes, then a promise completes to let you know the load is completed.  We'll go into the loader in a lot more depth in a later guide."]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-ts",children:"const texture = await Assets.load('myTexture.png');\n\n// pass a texture explicitly\nconst sprite = new Sprite(texture);\n// as options\nconst sprite2 = new Sprite({texture});\n// from the cache as the texture is loaded\nconst sprite3 = Sprite.from('myTexture.png')\n"})}),"\n",(0,a.jsx)(t.h3,{id:"texturesources-own-the-data",children:"TextureSources Own the Data"}),"\n",(0,a.jsxs)(t.p,{children:["Once the texture has loaded, the loaded ",(0,a.jsx)(t.code,{children:"<IMG>"})," element contains the pixel data we need.  But to use it to render something, PixiJS has to take that raw image file and upload it to the GPU.  This brings us to the real workhorse of the texture system - the ",(0,a.jsx)(t.a,{href:"https://pixijs.download/release/docs/TextureSource.html",children:"TextureSource"})," class.  Each TextureSource manages a single pixel source - usually an image, but can also be a Canvas or Video element.  TextureSources allow PixiJS to convert the image to pixels and use those pixels in rendering.  In addition, it also contains settings that control how the texture data is rendered, such as the wrap mode (for UV coordinates outside the 0.0-1.0 range) and scale mode (used when scaling a texture)."]}),"\n",(0,a.jsxs)(t.p,{children:["TextureSource are automatically cached, so that calling ",(0,a.jsx)(t.code,{children:"Texture.from()"})," repeatedly for the same URL returns the same TextureSource each time.  Destroying a TextureSource frees the image data associated with it."]}),"\n",(0,a.jsx)(t.h3,{id:"textures-are-a-view-on-basetextures",children:"Textures are a View on BaseTextures"}),"\n",(0,a.jsxs)(t.p,{children:["So finally, we get to the ",(0,a.jsx)(t.code,{children:"Texture"})," class itself!  At this point, you may be wondering what the ",(0,a.jsx)(t.code,{children:"Texture"})," object ",(0,a.jsx)(t.em,{children:"does"}),".  After all, the BaseTexture manages the pixels and render settings.  And the answer is, it doesn't do very much.  Textures are light-weight views on an underlying BaseTexture.  Their main attribute is the source rectangle within the TextureSource from which to pull."]}),"\n",(0,a.jsxs)(t.p,{children:["If all PixiJS drew were sprites, that would be pretty redundant.  But consider ",(0,a.jsx)(t.a,{href:"./sprite-sheets",children:"SpriteSheets"}),".  A SpriteSheet is a single image that contains multiple sprite images arranged within.  In a ",(0,a.jsx)(t.a,{href:"https://pixijs.download/release/docs/assets.Spritesheet.html",children:"Spritesheet"})," object, a single TextureSource is referenced by a set of Textures, one for each source image in the original sprite sheet.  By sharing a single TextureSource, the browser only downloads one file, and our batching renderer can blaze through drawing sprites since they all share the same underlying pixel data.  The SpriteSheet's Textures pull out just the rectangle of pixels needed by each sprite."]}),"\n",(0,a.jsx)(t.p,{children:"That is why we have both Textures and TextureSource - to allow sprite sheets, animations, button states, etc to be loaded as a single image, while only displaying the part of the master image that is needed."}),"\n",(0,a.jsx)(t.h2,{id:"loading-textures",children:"Loading Textures"}),"\n",(0,a.jsx)(t.p,{children:"We will discuss resource loading in a later guide, but one of the most common issues new users face when building a PixiJS project is how best to load their textures."}),"\n",(0,a.jsx)(t.p,{children:"here's a quick cheat sheet of one good solution:"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:"Show a loading image"}),"\n",(0,a.jsxs)(t.li,{children:["Use ",(0,a.jsx)(t.a,{href:"/8.x/guides/components/assets",children:"Assets"})," to ensure that all textures are loaded"]}),"\n",(0,a.jsx)(t.li,{children:"optionally update your loading image based on progress callbacks"}),"\n",(0,a.jsxs)(t.li,{children:["On loader completion, run all objects and use ",(0,a.jsx)(t.code,{children:"Texture.from()"})," to pull the loaded textures out of the texture cache"]}),"\n",(0,a.jsx)(t.li,{children:"Prepare your textures (optional - see below)"}),"\n",(0,a.jsx)(t.li,{children:"Hide your loading image, start rendering your scene graph"}),"\n"]}),"\n",(0,a.jsx)(t.p,{children:"Using this workflow ensures that your textures are pre-loaded, to prevent pop-in, and is relatively easy to code."}),"\n",(0,a.jsxs)(t.p,{children:["Regarding preparing textures: Even after you've loaded your textures, the images still need to be pushed to the GPU and decoded.  Doing this for a large number of source images can be slow and cause lag spikes when your project first loads.  To solve this, you can use the ",(0,a.jsx)(t.a,{href:"https://pixijs.download/release/docs/rendering.PrepareSystem.html",children:"Prepare"})," plugin, which allows you to pre-load textures in a final step before displaying your project."]}),"\n",(0,a.jsx)(t.h2,{id:"unloading-textures",children:"Unloading Textures"}),"\n",(0,a.jsxs)(t.p,{children:["Once you're done with a Texture, you may wish to free up the memory (both WebGL-managed buffers and browser-based) that it uses.  To do so, you should call ",(0,a.jsx)(t.code,{children:"destroy()"})," on the BaseTexture that owns the data.  Remember that Textures don't manage pixel data!"]}),"\n",(0,a.jsxs)(t.p,{children:["This is a particularly good idea for short-lived imagery like cut-scenes that are large and will only be used once. If a texture is destroyed that was loaded via ",(0,a.jsx)(t.code,{children:"Assets"})," then the assets class will automatically remove it from the cache for you."]}),"\n",(0,a.jsx)(t.h2,{id:"beyond-images",children:"Beyond Images"}),"\n",(0,a.jsx)(t.p,{children:"As we alluded to above, you can make a Texture out of more than just images:"}),"\n",(0,a.jsxs)(t.p,{children:["Video: Pass an HTML5 ",(0,a.jsx)(t.code,{children:"<VIDEO>"})," element to ",(0,a.jsx)(t.code,{children:"TextureSource.from()"})," to allow you to display video in your project.  Since it's a texture, you can tint it, add filters, or even apply it to custom geometry."]}),"\n",(0,a.jsxs)(t.p,{children:["Canvas: Similarly, you can wrap an HTML5 ",(0,a.jsx)(t.code,{children:"<CANVAS>"})," element in a BaseTexture to let you use canvas's drawing methods to dynamically create a texture."]}),"\n",(0,a.jsxs)(t.p,{children:["SVG: Pass in an ",(0,a.jsx)(t.code,{children:"<SVG>"})," element or load a .svg URL, and PixiJS will attempt to rasterize it.  For highly network-constrained projects, this can allow for beautiful graphics with minimal network load times."]}),"\n",(0,a.jsxs)(t.p,{children:["RenderTexture: A more advanced (but very powerful!) feature is to build a Texture from a ",(0,a.jsx)(t.a,{href:"https://pixijs.download/release/docs/RenderTexture.html",children:"RenderTexture"}),".  This can allow for building complex geometry using a ",(0,a.jsx)(t.a,{href:"https://pixijs.download/release/docs/Geometry.html",children:"Geometry"})," object, then baking that geometry down to a simple texture."]}),"\n",(0,a.jsx)(t.p,{children:"Each of these texture sources has caveats and nuances that we can't cover in this guide, but they should give you a feeling for the power of PixiJS's texture system. "}),"\n",(0,a.jsxs)(t.p,{children:["Check out the ",(0,a.jsx)(t.a,{href:"../../examples/textures/render-texture-basic",children:"render texture example code"}),"."]})]})}function u(e={}){let{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}}}]);