"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["3922"],{41836:function(e,n,t){t.r(n),t.d(n,{default:()=>u,frontMatter:()=>d,metadata:()=>i,assets:()=>p,toc:()=>c,contentTitle:()=>o});var i=JSON.parse('{"id":"examples/graphics/advanced","title":"Advanced","description":"","source":"@site/versioned_docs/version-7.x/examples/graphics/advanced.mdx","sourceDirName":"examples/graphics","slug":"/examples/graphics/advanced","permalink":"/7.x/examples/graphics/advanced","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","sidebarPosition":1,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":1,"custom_edit_url":null,"title":"Advanced"},"sidebar":"examplesSidebar","previous":{"title":"Simple","permalink":"/7.x/examples/graphics/simple"},"next":{"title":"Dynamic","permalink":"/7.x/examples/graphics/dynamic"}}'),a=t("85893"),r=t("50065"),s=t("67963"),l=t("99883");let d={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:1,custom_edit_url:null,title:"Advanced"},o=void 0,p={},c=[];function h(e){return(0,a.jsx)(s.N,{files:{"index.js":"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ antialias: true, resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\nconst sprite = PIXI.Sprite.from('https://pixijs.com/assets/bg_rotate.jpg');\n\n// // BEZIER CURVE ////\n// information: https://en.wikipedia.org/wiki/B\xe9zier_curve\n\nconst realPath = new PIXI.Graphics();\n\nrealPath.lineStyle(2, 0xffffff, 1);\nrealPath.moveTo(0, 0);\nrealPath.lineTo(100, 200);\nrealPath.lineTo(200, 200);\nrealPath.lineTo(240, 100);\n\nrealPath.position.x = 50;\nrealPath.position.y = 50;\n\napp.stage.addChild(realPath);\n\nconst bezier = new PIXI.Graphics();\n\nbezier.lineStyle(5, 0xaa0000, 1);\nbezier.bezierCurveTo(100, 200, 200, 200, 240, 100);\n\nbezier.position.x = 50;\nbezier.position.y = 50;\n\napp.stage.addChild(bezier);\n\n// // BEZIER CURVE 2 ////\nconst realPath2 = new PIXI.Graphics();\n\nrealPath2.lineStyle(2, 0xffffff, 1);\nrealPath2.moveTo(0, 0);\nrealPath2.lineTo(0, -100);\nrealPath2.lineTo(150, 150);\nrealPath2.lineTo(240, 100);\n\nrealPath2.position.x = 320;\nrealPath2.position.y = 150;\n\napp.stage.addChild(realPath2);\n\nconst bezier2 = new PIXI.Graphics();\n\nbezier2.lineTextureStyle({ width: 10, texture: sprite.texture });\nbezier2.bezierCurveTo(0, -100, 150, 150, 240, 100);\n\nbezier2.position.x = 320;\nbezier2.position.y = 150;\n\napp.stage.addChild(bezier2);\n\n// // ARC ////\nconst arc = new PIXI.Graphics();\n\narc.lineStyle(5, 0xaa00bb, 1);\narc.arc(600, 100, 50, Math.PI, 2 * Math.PI);\n\napp.stage.addChild(arc);\n\n// // ARC 2 ////\nconst arc2 = new PIXI.Graphics();\n\narc2.lineStyle(6, 0x3333dd, 1);\narc2.arc(650, 270, 60, 2 * Math.PI, (3 * Math.PI) / 2);\n\napp.stage.addChild(arc2);\n\n// // ARC 3 ////\nconst arc3 = new PIXI.Graphics();\n\narc3.lineTextureStyle({ width: 20, texture: sprite.texture });\narc3.arc(650, 420, 60, 2 * Math.PI, (2.5 * Math.PI) / 2);\n\napp.stage.addChild(arc3);\n\n// / Hole ////\nconst rectAndHole = new PIXI.Graphics();\n\nrectAndHole.beginFill(0x00ff00);\nrectAndHole.drawRect(350, 350, 150, 150);\nrectAndHole.beginHole();\nrectAndHole.drawCircle(375, 375, 25);\nrectAndHole.drawCircle(425, 425, 25);\nrectAndHole.drawCircle(475, 475, 25);\nrectAndHole.endHole();\nrectAndHole.endFill();\n\napp.stage.addChild(rectAndHole);\n\n// // Line Texture Style ////\nconst beatifulRect = new PIXI.Graphics();\n\nbeatifulRect.lineTextureStyle({ width: 20, texture: sprite.texture });\nbeatifulRect.beginFill(0xff0000);\nbeatifulRect.drawRect(80, 350, 150, 150);\nbeatifulRect.endFill();\n\napp.stage.addChild(beatifulRect);\n"},dependencies:{"pixi.js":l.npm}})}function u(e={}){let{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},99883:function(e){e.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);