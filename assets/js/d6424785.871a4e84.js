"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["9641"],{2072:function(e,t,i){i.r(t),i.d(t,{default:()=>u,frontMatter:()=>l,metadata:()=>s,assets:()=>x,toc:()=>d,contentTitle:()=>r});var s=JSON.parse('{"id":"examples/text/bitmap-text","title":"Bitmap Text","description":"","source":"@site/versioned_docs/version-7.x/examples/text/bitmap-text.mdx","sourceDirName":"examples/text","slug":"/examples/text/bitmap-text","permalink":"/7.x/examples/text/bitmap-text","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"7.x","sidebarPosition":1,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":1,"custom_edit_url":null,"title":"Bitmap Text"},"sidebar":"examplesSidebar","previous":{"title":"Pixi Text","permalink":"/7.x/examples/text/pixi-text"},"next":{"title":"From Font","permalink":"/7.x/examples/text/from-font"}}'),n=i("85893"),a=i("50065"),p=i("67963"),o=i("99883");let l={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:1,custom_edit_url:null,title:"Bitmap Text"},r=void 0,x={},d=[];function m(e){return(0,n.jsx)(p.N,{files:{"index.js":"import * as PIXI from 'pixi.js';\n\nconst app = new PIXI.Application({ background: '#1099bb', resizeTo: window });\n\ndocument.body.appendChild(app.view);\n\nPIXI.Assets.load('https://pixijs.com/assets/bitmap-font/desyrel.xml').then(() =>\n{\n    const bitmapFontText = new PIXI.BitmapText('bitmap fonts are supported!\\nWoo yay!', {\n        fontName: 'Desyrel',\n        fontSize: 55,\n        align: 'left',\n    });\n\n    bitmapFontText.x = 50;\n    bitmapFontText.y = 200;\n\n    app.stage.addChild(bitmapFontText);\n});\n"},dependencies:{"pixi.js":o.npm}})}function u(e={}){let{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(m,{...e})}):m(e)}},99883:function(e){e.exports=JSON.parse('{"versionLabel":"v7.x","version":"7.4.2","releaseNotes":"https://github.com/pixijs/pixijs/releases/tag/v7.4.2","build":"https://pixijs.download/v7.4.2/pixi.min.js","docs":"https://pixijs.download/v7.4.2/docs/index.html","npm":"7.4.2","prerelease":false,"latest":false}')}}]);