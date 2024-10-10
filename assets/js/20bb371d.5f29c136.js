"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([[2027],{7752:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=i(7462),n=(i(7294),i(3905));const r={title:"ParticleContainer - The New Speed Demon in PixiJS v8",description:"Introducing the new ParticleContainer in PixiJS v8\u2014faster than ever, optimized for rendering millions of particles effortlessly.",slug:"particlecontainer-v8",authors:[{name:"Mat Groves",title:"PixiJS",url:"https://github.com/GoodboyDigital",image_url:"https://github.com/GoodboyDigital.png"}],tags:["PixiJS","ParticleContainer","WebGL","Games","Performance","Optimization"],hide_table_of_contents:!0,keywords:["PixiJS","ParticleContainer","game development","web graphics","optimization","WebGL"]},o=void 0,s={permalink:"/blog/particlecontainer-v8",source:"@site/blog/2024-10-03-pixi-v8-particle-container.md",title:"ParticleContainer - The New Speed Demon in PixiJS v8",description:"Introducing the new ParticleContainer in PixiJS v8\u2014faster than ever, optimized for rendering millions of particles effortlessly.",date:"2024-10-03T00:00:00.000Z",formattedDate:"October 3, 2024",tags:[{label:"PixiJS",permalink:"/blog/tags/pixi-js"},{label:"ParticleContainer",permalink:"/blog/tags/particle-container"},{label:"WebGL",permalink:"/blog/tags/web-gl"},{label:"Games",permalink:"/blog/tags/games"},{label:"Performance",permalink:"/blog/tags/performance"},{label:"Optimization",permalink:"/blog/tags/optimization"}],readingTime:4.445,hasTruncateMarker:!0,authors:[{name:"Mat Groves",title:"PixiJS",url:"https://github.com/GoodboyDigital",image_url:"https://github.com/GoodboyDigital.png",imageURL:"https://github.com/GoodboyDigital.png"}],frontMatter:{title:"ParticleContainer - The New Speed Demon in PixiJS v8",description:"Introducing the new ParticleContainer in PixiJS v8\u2014faster than ever, optimized for rendering millions of particles effortlessly.",slug:"particlecontainer-v8",authors:[{name:"Mat Groves",title:"PixiJS",url:"https://github.com/GoodboyDigital",image_url:"https://github.com/GoodboyDigital.png",imageURL:"https://github.com/GoodboyDigital.png"}],tags:["PixiJS","ParticleContainer","WebGL","Games","Performance","Optimization"],hide_table_of_contents:!0,keywords:["PixiJS","ParticleContainer","game development","web graphics","optimization","WebGL"]},nextItem:{title:"AssetPack 1.0.0 Release!",permalink:"/blog/assetpack-1.0.0"}},l={authorsImageUrls:[void 0]},p=[{value:"\ud83d\ude80 New ParticleContainer Design",id:"-new-particlecontainer-design",level:2},{value:"Speed Secret: Static vs. Dynamic Properties",id:"speed-secret-static-vs-dynamic-properties",level:3},{value:"PixiJS v8 Particle Container Usage",id:"pixijs-v8-particle-container-usage",level:3},{value:"Reasons to Use ParticleContainer",id:"reasons-to-use-particlecontainer",level:3},{value:"Next Steps",id:"next-steps",level:3},{value:"\ud83c\udf89 Conclusion",id:"-conclusion",level:2},{value:"\ud83c\udf10 Stay Connected",id:"-stay-connected",level:2}],c={toc:p};function m(e){let{components:t,...i}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"PixiJS v8 has taken speed to the next level with the release of its new ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer"),". This new feature brings a jaw-dropping performance boost, capable of rendering 100K+ without breaking a sweat. If you\u2019ve got tons of elements to throw on the screen, you\u2019re in for a treat!"),(0,n.kt)("h2",{id:"-new-particlecontainer-design"},"\ud83d\ude80 New ParticleContainer Design"),(0,n.kt)("p",null,"The key difference in PixiJS v8 is that the ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer")," doesn\u2019t deal with sprites any more, it works with lightweight ",(0,n.kt)("strong",{parentName:"p"},"particles"),". While particles share many properties with sprites (like texture, position, anchor, scale, rotation, alpha and color), they cut out unnecessary overhead. The result is ",(0,n.kt)("strong",{parentName:"p"},"speed"),", pure and simple. "),(0,n.kt)("p",null,"How fast, you ask? Well, take a look on my machine (Macbook Pro M3):"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Sprites + Container"),": 200,000 at 60fps."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Particles + ParticleContainer"),": 1,000,000 at 60fps!")),(0,n.kt)("p",null,"Yes, that\u2019s a ",(0,n.kt)("em",{parentName:"p"},"million")," bunnies on-screen, and honestly the main bottleneck at that point wasn\u2019t even rendering but the logic behind the bouncing movement! Give this a spin and see for yourself:"),(0,n.kt)("iframe",{src:"https://goodboydigital.github.io/pixi-bunnymark/dist/?asParticles=true&count=1000&renderer=webgl",width:"700",height:"500",frameborder:"0"}),(0,n.kt)("p",null,"The key takeaway is that you can now render ",(0,n.kt)("strong",{parentName:"p"},"huge volumes of elements")," absurdly fast, making PixiJS v8 a perfect choice for high-performance games or visually intensive projects. And yes this is faster than the v7 particle container by ",(0,n.kt)("strong",{parentName:"p"},"over 3x"),"!"),(0,n.kt)("p",null,"Please checkout the ",(0,n.kt)("a",{parentName:"p",href:"../8.x/guides/migrations/v8#particlecontainer"},"migration guide")," for more information on how to migrate your code to the new particle container."),(0,n.kt)("h3",{id:"speed-secret-static-vs-dynamic-properties"},"Speed Secret: Static vs. Dynamic Properties"),(0,n.kt)("p",null,"To get the most out of this performance beast, it\u2019s essential to understand ",(0,n.kt)("strong",{parentName:"p"},"static")," vs. ",(0,n.kt)("strong",{parentName:"p"},"dynamic")," properties. PixiJS gives you full control over which properties update every frame (dynamic) and which don\u2019t need constant updates (static). Here\u2019s how they work:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Static properties"),": Once set, they stay the same unless explicitly changed. By keeping them static, you reduce computational load, meaning faster rendering. This is your responsibility to update :)"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Dynamic properties"),": These are recalculated and uploaded to the GPU every frame regardless.")),(0,n.kt)("p",null,"By default, ",(0,n.kt)("strong",{parentName:"p"},"only the position")," is dynamic, but you can configure others if needed. The fewer dynamic properties you have, the faster the rendering will be!"),(0,n.kt)("h3",{id:"pixijs-v8-particle-container-usage"},"PixiJS v8 Particle Container Usage"),(0,n.kt)("p",null,"Let\u2019s walk through a simple example of how to get started:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-javascript"},"import { ParticleContainer, Particle, Texture } from 'pixi.js';\n\n// Create a particle container with default options\nconst container = new ParticleContainer({\n    // this is the default, but we show it here for clarity\n    dynamicProperties: {\n        position: true,  // Allow dynamic position changes (default)\n        scale: false,    // Static scale for extra performance\n        rotation: false, // Static rotation\n        color: false     // Static color\n    }\n});\n\n// Add particles\nconst texture = Texture.from('path/to/bunny.png');\n\nfor (let i = 0; i < 100000; ++i) {\n    let particle = new Particle({\n        texture,\n        x: Math.random() * 800,\n        y: Math.random() * 600,\n    });\n\n    container.addParticle(particle);\n}\n\n// Add container to the Pixi stage\napp.stage.addChild(container);\n")),(0,n.kt)("p",null,"In this example, we create a ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer"),", set properties to static where possible, and generate a 100k particles. By using a shared texture (hello, sprite sheets!), we ensure that all particles share the same graphical assets, making rendering even more efficient."),(0,n.kt)("h3",{id:"reasons-to-use-particlecontainer"},"Reasons to Use ParticleContainer"),(0,n.kt)("p",null,"The ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer")," shines when you need ",(0,n.kt)("strong",{parentName:"p"},"insane numbers")," of visual elements on-screen, especially when you want them moving and interacting in real time. Whether you're building particle effects, swarms of characters, or abstract art installations, PixiJS v8 has you covered. The static vs. dynamic property system gives you granular control over performance, allowing you to fine-tune the balance between flexibility and speed."),(0,n.kt)("p",null,"This is basically the fastest we could make it by still keeping allowing for different textures (via sprite sheets) and still empowering devs to manipulate the particles via JS and not having to move the movement to the GPU (which might be faster, but is more complex and less flexible). So even though we are choosing to call them particles, they are more like something in between a traditional particle and a classic sprite."),(0,n.kt)("p",null,"This is ideal for projects where frame rate and rendering volume matter\u2014such as games, interactive apps, and high-volume data visualization. By controlling the dynamic properties of your particles, you can optimize your application\u2019s performance to fit your needs."),(0,n.kt)("h3",{id:"next-steps"},"Next Steps"),(0,n.kt)("p",null,"The new ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer")," is a game-changer, but there are still some areas for improvement! For one, there is room to optimise further the static uploading of properties (you may notice the example above is slower when adding bunnys - but then speeds up once stable). We plan to expose how the particles are batched so that developers can add / remove attributes from the batch to make it even faster or add more flexibility and customization. But for now, this is a great starting point and we hope you enjoy the new ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer"),"!"),(0,n.kt)("h2",{id:"-conclusion"},"\ud83c\udf89 Conclusion"),(0,n.kt)("p",null,"PixiJS v8\u2019s ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer")," is a game-changer when it comes to rendering at scale. Its ability to push ",(0,n.kt)("strong",{parentName:"p"},"millions")," of particles at full speed opens up a world of possibilities for game developers, animators, and creative coders. Get in, experiment with the new API, and see just how fast your visuals can fly!"),(0,n.kt)("p",null,"Ready to give it a spin? Try out the new ",(0,n.kt)("inlineCode",{parentName:"p"},"ParticleContainer")," in PixiJS v8, and push the limits of performance in your projects!"),(0,n.kt)("h2",{id:"-stay-connected"},"\ud83c\udf10 Stay Connected"),(0,n.kt)("p",null,"Follow ",(0,n.kt)("a",{parentName:"p",href:"https://twitter.com/Doormat23"},"Doormat23")," and ",(0,n.kt)("a",{parentName:"p",href:"https://twitter.com/PixiJS"},"PixiJS")," on social media for the latest updates. Join our vibrant community on ",(0,n.kt)("a",{parentName:"p",href:"https://discord.gg/nrnDP9wtyX"},"Discord")," for real-time discussions and support."))}m.isMDXComponent=!0}}]);