"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["859"],{20622:function(e,t,n){n.r(t),n.d(t,{default:()=>h,frontMatter:()=>d,metadata:()=>a,assets:()=>p,toc:()=>c,contentTitle:()=>o});var a=JSON.parse('{"id":"examples/advanced/star-warp","title":"Star Warp","description":"","source":"@site/docs/examples/advanced/star-warp.mdx","sourceDirName":"examples/advanced","slug":"/examples/advanced/star-warp","permalink":"/8.x/examples/advanced/star-warp","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":2,"custom_edit_url":null,"title":"Star Warp"},"sidebar":"examplesSidebar","previous":{"title":"Scratch Card","permalink":"/8.x/examples/advanced/scratch-card"},"next":{"title":"Three.js and PixiJS","permalink":"/8.x/examples/advanced/three-and-pixi"}}'),r=n("85893"),s=n("50065"),i=n("67963");let d={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:2,custom_edit_url:null,title:"Star Warp"},o=void 0,p={},c=[];function l(e){return(0,r.jsx)(i.N,{files:{"index.js":"import { Application, Assets, Sprite } from 'pixi.js';\n\n(async () =>\n{\n    // Create a new application\n    const app = new Application();\n\n    // Initialize the application\n    await app.init({ resizeTo: window });\n\n    // Append the application canvas to the document body\n    document.body.appendChild(app.canvas);\n\n    // Load the star texture\n    const starTexture = await Assets.load('https://pixijs.com/assets/star.png');\n\n    const starAmount = 1000;\n    let cameraZ = 0;\n    const fov = 20;\n    const baseSpeed = 0.025;\n    let speed = 0;\n    let warpSpeed = 0;\n    const starStretch = 5;\n    const starBaseSize = 0.05;\n\n    // Create the stars\n    const stars = [];\n\n    for (let i = 0; i < starAmount; i++)\n    {\n        const star = {\n            sprite: new Sprite(starTexture),\n            z: 0,\n            x: 0,\n            y: 0,\n        };\n\n        star.sprite.anchor.x = 0.5;\n        star.sprite.anchor.y = 0.7;\n        randomizeStar(star, true);\n        app.stage.addChild(star.sprite);\n        stars.push(star);\n    }\n\n    function randomizeStar(star, initial)\n    {\n        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;\n\n        // Calculate star positions with radial random coordinate so no star hits the camera.\n        const deg = Math.random() * Math.PI * 2;\n        const distance = Math.random() * 50 + 1;\n\n        star.x = Math.cos(deg) * distance;\n        star.y = Math.sin(deg) * distance;\n    }\n\n    // Change flight speed every 5 seconds\n    setInterval(() =>\n    {\n        warpSpeed = warpSpeed > 0 ? 0 : 1;\n    }, 5000);\n\n    // Listen for animate update\n    app.ticker.add((time) =>\n    {\n        // Simple easing. This should be changed to proper easing function when used for real.\n        speed += (warpSpeed - speed) / 20;\n        cameraZ += time.deltaTime * 10 * (speed + baseSpeed);\n        for (let i = 0; i < starAmount; i++)\n        {\n            const star = stars[i];\n\n            if (star.z < cameraZ) randomizeStar(star);\n\n            // Map star 3d position to 2d with really simple projection\n            const z = star.z - cameraZ;\n\n            star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;\n            star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;\n\n            // Calculate star scale & rotation.\n            const dxCenter = star.sprite.x - app.renderer.screen.width / 2;\n            const dyCenter = star.sprite.y - app.renderer.screen.height / 2;\n            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);\n            const distanceScale = Math.max(0, (2000 - z) / 2000);\n\n            star.sprite.scale.x = distanceScale * starBaseSize;\n            // Star is looking towards center so that y axis is towards center.\n            // Scale the star depending on how fast we are moving, what the stretchfactor is\n            // and depending on how far away it is from the center.\n            star.sprite.scale.y\n                = distanceScale * starBaseSize\n                + (distanceScale * speed * starStretch * distanceCenter) / app.renderer.screen.width;\n            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;\n        }\n    });\n})();\n"}})}function h(e={}){let{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}}}]);