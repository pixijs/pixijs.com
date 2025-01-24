"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["2881"],{91229:function(e,n,i){i.r(n),i.d(n,{default:()=>x,frontMatter:()=>l,metadata:()=>t,assets:()=>d,toc:()=>c,contentTitle:()=>p});var t=JSON.parse('{"id":"examples/graphics/pixel-line","title":"Pixel Line","description":"","source":"@site/docs/examples/graphics/pixel-line.mdx","sourceDirName":"examples/graphics","slug":"/examples/graphics/pixel-line","permalink":"/8.x/examples/graphics/pixel-line","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"current","sidebarPosition":8,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":8,"custom_edit_url":null,"title":"Pixel Line"},"sidebar":"examplesSidebar","previous":{"title":"Mesh From Path","permalink":"/8.x/examples/graphics/mesh-from-path"},"next":{"title":"Render Layer","permalink":"/8.x/examples/ordering/render-layer"}}'),a=i("85893"),r=i("50065"),s=i("43076"),o=i("43042");let l={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:8,custom_edit_url:null,title:"Pixel Line"},p=void 0,d={},c=[];function h(e){return(0,a.jsx)(s.N,{files:{"index.js":o.Z}})}function x(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},43042:function(e,n,i){i.d(n,{Z:function(){return t}});let t="import { Application, Container, Graphics, Text } from 'pixi.js';\n\n/**\n * Creates a grid pattern using Graphics lines\n * @param graphics - The Graphics object to draw on\n * @returns The Graphics object with the grid drawn\n */\nfunction buildGrid(graphics)\n{\n    // Draw 10 vertical lines spaced 10 pixels apart\n    for (let i = 0; i < 11; i++)\n    {\n        // Move to top of each line (x = i*10, y = 0)\n        graphics\n            .moveTo(i * 10, 0)\n            // Draw down to bottom (x = i*10, y = 100)\n            .lineTo(i * 10, 100);\n    }\n\n    // Draw 10 horizontal lines spaced 10 pixels apart\n    for (let i = 0; i < 11; i++)\n    {\n        // Move to start of each line (x = 0, y = i*10)\n        graphics\n            .moveTo(0, i * 10)\n            // Draw across to end (x = 100, y = i*10)\n            .lineTo(100, i * 10);\n    }\n\n    return graphics;\n}\n\n(async () =>\n{\n    // Create and initialize a new PixiJS application\n    const app = new Application();\n\n    await app.init({ antialias: true, resizeTo: window });\n    document.body.appendChild(app.canvas);\n\n    // Create two grids - one with pixel-perfect lines and one without\n    const gridPixel = buildGrid(new Graphics()).stroke({ color: 0xffffff, pixelLine: true, width: 1 });\n\n    const grid = buildGrid(new Graphics()).stroke({ color: 0xffffff, pixelLine: false });\n\n    // Position the grids side by side\n    grid.x = -100;\n    grid.y = -50;\n    gridPixel.y = -50;\n\n    // Create a container to hold both grids\n    const container = new Container();\n\n    container.addChild(grid, gridPixel);\n\n    // Center the container on screen\n    container.x = app.screen.width / 2;\n    container.y = app.screen.height / 2;\n    app.stage.addChild(container);\n\n    // Animation variables\n    let count = 0;\n\n    // Add animation to scale the grids over time\n    app.ticker.add(() =>\n    {\n        count += 0.01;\n        container.scale = 1 + (Math.sin(count) + 1) * 2;\n    });\n\n    // Add descriptive label\n    const label = new Text({\n        text: 'Grid Comparison: Standard Lines (Left) vs Pixel-Perfect Lines (Right)',\n        style: { fill: 0xffffff },\n    });\n\n    // Position label in top-left corner\n    label.position.set(20, 20);\n    label.width = app.screen.width - 40;\n    label.scale.y = label.scale.x;\n    app.stage.addChild(label);\n})();\n"}}]);