"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["8208"],{8518:function(n,e,a){a.r(e),a.d(e,{default:()=>h,frontMatter:()=>r,metadata:()=>i,assets:()=>c,toc:()=>d,contentTitle:()=>p});var i=JSON.parse('{"id":"examples/basic/cache-as-bitmap","title":"Cache As Bitmap","description":"","source":"@site/versioned_docs/version-7.x/examples/basic/cache-as-bitmap.mdx","sourceDirName":"examples/basic","slug":"/examples/basic/cache-as-bitmap","permalink":"/7.x/examples/basic/cache-as-bitmap","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","sidebarPosition":3,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":3,"custom_edit_url":null,"title":"Cache As Bitmap"},"sidebar":"examplesSidebar","previous":{"title":"Tinting","permalink":"/7.x/examples/basic/tinting"},"next":{"title":"Blend Modes","permalink":"/7.x/examples/basic/blend-modes"}}'),t=a("85893"),s=a("50065"),o=a("67963"),l=a("99883");let r={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:3,custom_edit_url:null,title:"Cache As Bitmap"},p=void 0,c={},d=[];function m(n){return(0,t.jsx)(o.N,{files:{"index.js":"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\napp.stop();\n\n// load resources\nPIXI.Assets.load('https://pixijs.com/assets/spritesheet/monsters.json').then(onAssetsLoaded);\n\n// holder to store aliens\nconst aliens = [];\nconst alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'];\n\nlet count = 0;\n\n// create an empty container\nconst alienContainer = new PIXI.Container();\n\nalienContainer.x = 400;\nalienContainer.y = 300;\n\n// make the stage interactive\napp.stage.eventMode = 'static';\napp.stage.addChild(alienContainer);\n\nfunction onAssetsLoaded()\n{\n    // add a bunch of aliens with textures from image paths\n    for (let i = 0; i < 100; i++)\n    {\n        const frameName = alienFrames[i % 4];\n\n        // create an alien using the frame name..\n        const alien = PIXI.Sprite.from(frameName);\n\n        alien.tint = Math.random() * 0xffffff;\n\n        alien.x = Math.random() * 800 - 400;\n        alien.y = Math.random() * 600 - 300;\n        alien.anchor.x = 0.5;\n        alien.anchor.y = 0.5;\n        aliens.push(alien);\n        alienContainer.addChild(alien);\n    }\n    app.start();\n}\n\n// Combines both mouse click + touch tap\napp.stage.on('pointertap', onClick);\n\nfunction onClick()\n{\n    alienContainer.cacheAsBitmap = !alienContainer.cacheAsBitmap;\n}\n\napp.ticker.add(() =>\n{\n    // let's rotate the aliens a little bit\n    for (let i = 0; i < 100; i++)\n    {\n        const alien = aliens[i];\n\n        alien.rotation += 0.1;\n    }\n\n    count += 0.01;\n\n    alienContainer.scale.x = Math.sin(count);\n    alienContainer.scale.y = Math.sin(count);\n    alienContainer.rotation += 0.01;\n});\n"},dependencies:{"pixi.js":l.npm}})}function h(n={}){let{wrapper:e}={...(0,s.a)(),...n.components};return e?(0,t.jsx)(e,{...n,children:(0,t.jsx)(m,{...n})}):m(n)}},99883:function(n){n.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);