"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["8872"],{7283:function(e,n,t){t.r(n),t.d(n,{default:()=>f,frontMatter:()=>c,metadata:()=>s,assets:()=>p,toc:()=>l,contentTitle:()=>d});var s=JSON.parse('{"id":"examples/offscreen-canvas/basic","title":"Basic","description":"","source":"@site/versioned_docs/version-7.x/examples/offscreen-canvas/basic.mdx","sourceDirName":"examples/offscreen-canvas","slug":"/examples/offscreen-canvas/basic","permalink":"/7.x/examples/offscreen-canvas/basic","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","sidebarPosition":0,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":0,"custom_edit_url":null,"title":"Basic"},"sidebar":"examplesSidebar","previous":{"title":"Bundle","permalink":"/7.x/examples/assets/bundle"}}'),i=t("85893"),a=t("50065"),o=t("67963"),r=t("99883");let c={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:0,custom_edit_url:null,title:"Basic"},d=void 0,p={},l=[];function u(e){return(0,i.jsx)(o.N,{files:{"index.js":"import * as PIXI from 'pixi.js';\n\n// This example is the based on basic/container, but using OffscreenCanvas.\n\nconst canvas = document.createElement('canvas');\nconst view = canvas.transferControlToOffscreen();\n\nconst app = new PIXI.Application({ view, background: 0x1099bb, resizeTo: window });\n\ndocument.body.appendChild(canvas);\n\nconst container = new PIXI.Container();\n\napp.stage.addChild(container);\n\n// Create a new texture\nconst texture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');\n\n// Create a 5x5 grid of bunnies\nfor (let i = 0; i < 25; i++)\n{\n    const bunny = new PIXI.Sprite(texture);\n\n    bunny.anchor.set(0.5);\n    bunny.x = (i % 5) * 40;\n    bunny.y = Math.floor(i / 5) * 40;\n    container.addChild(bunny);\n}\n\n// Move container to the center\ncontainer.x = app.screen.width / 2;\ncontainer.y = app.screen.height / 2;\n\n// Center bunny sprite in local container coordinates\ncontainer.pivot.x = container.width / 2;\ncontainer.pivot.y = container.height / 2;\n\n// Listen for animate update\napp.ticker.add((delta) =>\n{\n    // rotate the container!\n    // use delta to create frame-independent transform\n    container.rotation -= 0.01 * delta;\n});\n"},dependencies:{"pixi.js":r.npm}})}function f(e={}){let{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},99883:function(e){e.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);