"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["8394"],{64269:function(e,d,n){n.r(d),n.d(d,{default:()=>h,frontMatter:()=>r,metadata:()=>t,assets:()=>p,toc:()=>l,contentTitle:()=>u});var t=JSON.parse('{"id":"examples/basic/blend-modes","title":"Blend Modes","description":"","source":"@site/versioned_docs/version-7.x/examples/basic/blend-modes.mdx","sourceDirName":"examples/basic","slug":"/examples/basic/blend-modes","permalink":"/7.x/examples/basic/blend-modes","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","sidebarPosition":4,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":4,"custom_edit_url":null,"title":"Blend Modes"},"sidebar":"examplesSidebar","previous":{"title":"Cache As Bitmap","permalink":"/7.x/examples/basic/cache-as-bitmap"},"next":{"title":"Particle Container","permalink":"/7.x/examples/basic/particle-container"}}'),s=n("85893"),i=n("50065"),a=n("67963"),o=n("99883");let r={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:4,custom_edit_url:null,title:"Blend Modes"},u=void 0,p={},l=[];function c(e){return(0,s.jsx)(a.N,{files:{"index.js":"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\n// create a new background sprite\nconst background = PIXI.Sprite.from('https://pixijs.com/assets/bg_rotate.jpg');\n\nbackground.width = app.screen.width;\nbackground.height = app.screen.height;\napp.stage.addChild(background);\n\n// create an array to store a reference to the dudes\nconst dudeArray = [];\n\nconst totaldudes = 20;\n\nfor (let i = 0; i < totaldudes; i++)\n{\n    // create a new Sprite that uses the image name that we just generated as its source\n    const dude = PIXI.Sprite.from('https://pixijs.com/assets/flowerTop.png');\n\n    dude.anchor.set(0.5);\n\n    // set a random scale for the dude\n    dude.scale.set(0.8 + Math.random() * 0.3);\n\n    // finally let's set the dude to be at a random position...\n    dude.x = Math.floor(Math.random() * app.screen.width);\n    dude.y = Math.floor(Math.random() * app.screen.height);\n\n    // The important bit of this example, this is how you change the default blend mode of the sprite\n    dude.blendMode = PIXI.BLEND_MODES.ADD;\n\n    // create some extra properties that will control movement\n    dude.direction = Math.random() * Math.PI * 2;\n\n    // this number will be used to modify the direction of the dude over time\n    dude.turningSpeed = Math.random() - 0.8;\n\n    // create a random speed for the dude between 0 - 2\n    dude.speed = 2 + Math.random() * 2;\n\n    // finally we push the dude into the dudeArray so it it can be easily accessed later\n    dudeArray.push(dude);\n\n    app.stage.addChild(dude);\n}\n\n// create a bounding box for the little dudes\nconst dudeBoundsPadding = 100;\n\nconst dudeBounds = new PIXI.Rectangle(\n    -dudeBoundsPadding,\n    -dudeBoundsPadding,\n    app.screen.width + dudeBoundsPadding * 2,\n    app.screen.height + dudeBoundsPadding * 2,\n);\n\napp.ticker.add(() =>\n{\n    // iterate through the dudes and update the positions\n    for (let i = 0; i < dudeArray.length; i++)\n    {\n        const dude = dudeArray[i];\n\n        dude.direction += dude.turningSpeed * 0.01;\n        dude.x += Math.sin(dude.direction) * dude.speed;\n        dude.y += Math.cos(dude.direction) * dude.speed;\n        dude.rotation = -dude.direction - Math.PI / 2;\n\n        // wrap the dudes by testing their bounds...\n        if (dude.x < dudeBounds.x)\n        {\n            dude.x += dudeBounds.width;\n        }\n        else if (dude.x > dudeBounds.x + dudeBounds.width)\n        {\n            dude.x -= dudeBounds.width;\n        }\n\n        if (dude.y < dudeBounds.y)\n        {\n            dude.y += dudeBounds.height;\n        }\n        else if (dude.y > dudeBounds.y + dudeBounds.height)\n        {\n            dude.y -= dudeBounds.height;\n        }\n    }\n});\n"},dependencies:{"pixi.js":o.npm}})}function h(e={}){let{wrapper:d}={...(0,i.a)(),...e.components};return d?(0,s.jsx)(d,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},99883:function(e){e.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);