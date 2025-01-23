"use strict";(self.webpackChunkpixi_docusaurus=self.webpackChunkpixi_docusaurus||[]).push([["1008"],{20410:function(e,n,t){t.r(n),t.d(n,{default:()=>u,frontMatter:()=>o,metadata:()=>r,assets:()=>c,toc:()=>h,contentTitle:()=>l});var r=JSON.parse('{"id":"examples/advanced/three-and-pixi","title":"Three.js and PixiJS","description":"<ExampleEditor files={{\\"index.js\\": IndexFile}} dependencies={","source":"@site/docs/examples/advanced/three-and-pixi.mdx","sourceDirName":"examples/advanced","slug":"/examples/advanced/three-and-pixi","permalink":"/8.x/examples/advanced/three-and-pixi","draft":false,"unlisted":false,"editUrl":null,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"hide_table_of_contents":true,"hide_edit_this_page":true,"sidebar_position":2,"custom_edit_url":null,"title":"Three.js and PixiJS"},"sidebar":"examplesSidebar","previous":{"title":"Star Warp","permalink":"/8.x/examples/advanced/star-warp"},"next":{"title":"Mouse Trail","permalink":"/8.x/examples/advanced/mouse-trail"}}'),i=t("85893"),a=t("50065"),s=t("43076"),d=t("42349");let o={hide_table_of_contents:!0,hide_edit_this_page:!0,sidebar_position:2,custom_edit_url:null,title:"Three.js and PixiJS"},l=void 0,c={},h=[];function p(e){return(0,i.jsx)(s.N,{files:{"index.js":d.Z},dependencies:{three:"latest","pixi.js":"latest"}})}function u(e={}){let{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},42349:function(e,n,t){t.d(n,{Z:function(){return r}});let r="// Import required classes from PixiJS and Three.js\nimport { Container, Graphics, Text, WebGLRenderer } from 'pixi.js';\nimport * as THREE from 'three';\n\n// Self-executing async function to set up the demo\n(async () =>\n{\n    // Initialize window dimensions\n    let WIDTH = window.innerWidth;\n    let HEIGHT = window.innerHeight;\n\n    // === THREE.JS SETUP ===\n    // Create Three.js WebGL renderer with antialiasing and stencil buffer\n    const threeRenderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });\n\n    // Configure Three.js renderer size and background color\n    threeRenderer.setSize(WIDTH, HEIGHT);\n    threeRenderer.setClearColor(0xdddddd, 1); // Light gray background\n    document.body.appendChild(threeRenderer.domElement);\n\n    // Create Three.js scene\n    const scene = new THREE.Scene();\n\n    // Set up perspective camera with 70\xb0 FOV\n    const threeCamera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);\n\n    threeCamera.position.z = 50; // Move camera back to see the scene\n    scene.add(threeCamera);\n\n    // Create a simple cube mesh\n    const boxGeometry = new THREE.BoxGeometry(30, 30, 30);\n    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x0095dd }); // Blue color\n    const cube = new THREE.Mesh(boxGeometry, basicMaterial);\n\n    scene.add(cube);\n\n    // === PIXI.JS SETUP ===\n    // Create PixiJS renderer that shares the WebGL context with Three.js\n    const pixiRenderer = new WebGLRenderer();\n\n    // Initialize PixiJS renderer with shared context\n    await pixiRenderer.init({\n        context: threeRenderer.getContext(),\n        width: WIDTH,\n        height: HEIGHT,\n        clearBeforeRender: false, // Don't clear the canvas as Three.js will handle that\n    });\n\n    // Create PixiJS scene graph\n    const stage = new Container();\n\n    // Create a yellow rounded rectangle UI element\n    const uiLayer = new Graphics().roundRect(20, 80, 300, 300, 20).fill(0xffff00);\n\n    // Add text overlay\n    const text = new Text({ text: 'Pixi and Three.js', style: { fontFamily: 'Arial', fontSize: 24, fill: 'black' } });\n\n    uiLayer.addChild(text);\n    stage.addChild(uiLayer);\n\n    // Animation loop\n    function loop()\n    {\n        // Rotate cube continuously\n        cube.rotation.x += 0.01;\n        cube.rotation.y += 0.01;\n\n        // Animate UI layer position using sine wave\n        uiLayer.y = ((Math.sin(Date.now() * 0.001) + 1) * 0.5 * WIDTH) / 2;\n\n        // Render Three.js scene\n        threeRenderer.resetState();\n        threeRenderer.render(scene, threeCamera);\n\n        // Render PixiJS scene\n        pixiRenderer.resetState();\n        pixiRenderer.render({ container: stage });\n\n        // Continue animation loop\n        requestAnimationFrame(loop);\n    }\n\n    // Start animation loop\n    requestAnimationFrame(loop);\n\n    // Handle window resizing\n    window.addEventListener('resize', () =>\n    {\n        WIDTH = window.innerWidth;\n        HEIGHT = window.innerHeight;\n\n        // Update Three.js renderer\n        threeRenderer.setSize(WIDTH, HEIGHT);\n        // Update Three.js camera aspect ratio so it renders correctly\n        threeCamera.aspect = WIDTH / HEIGHT;\n        threeCamera.updateProjectionMatrix();\n\n        // Update PixiJS renderer\n        pixiRenderer.resize(WIDTH, HEIGHT);\n    });\n})();\n"}}]);