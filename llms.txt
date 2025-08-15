# PixiJS Documentation for LLMs

> PixiJS is the fastest, most lightweight 2D library available for the web, working across all devices and allowing you to create rich, interactive graphics and cross-platform applications using WebGL and WebGPU.

This file contains links to documentation sections following the llmstxt.org standard.

## Table of Contents

- [Ecosystem](https://pixijs.com/8.x/guides/getting-started/ecosystem.md): Explore the PixiJS ecosystem, including libraries, tools, and community-driven projects that enhance PixiJS applications.
- [Quick Start](https://pixijs.com/8.x/guides/getting-started/quick-start.md): A step-by-step guide to quickly set up a PixiJS project and start creating graphics and animations.
- [Architecture](https://pixijs.com/8.x/guides/concepts/architecture.md): A comprehensive guide to the architecture of PixiJS, including its major components and extension system.
- [Environments](https://pixijs.com/8.x/guides/concepts/environments.md): Learn how PixiJS adapts to different environments like browsers, Web Workers, and custom execution contexts, and how to configure it for your needs.
- [Garbage Collection](https://pixijs.com/8.x/guides/concepts/garbage-collection.md): Managing GPU resources and garbage collection in PixiJS for optimal performance.
- [Performance Tips](https://pixijs.com/8.x/guides/concepts/performance-tips.md): Performance tips for optimizing PixiJS applications, covering general practices and specific techniques for maximizing rendering efficiency.
- [Render Groups](https://pixijs.com/8.x/guides/concepts/render-groups.md): Learn how to use Render Groups in PixiJS to optimize rendering performance by grouping scene elements for efficient GPU processing.
- [Render Layers](https://pixijs.com/8.x/guides/concepts/render-layers.md): Understanding PixiJS Render Layers for controlling rendering order independently of logical hierarchy.
- [Render Loop](https://pixijs.com/8.x/guides/concepts/render-loop.md): Understanding the PixiJS render loop, including how it updates the scene graph and renders frames efficiently.
- [Scene Graph](https://pixijs.com/8.x/guides/concepts/scene-graph.md): Understanding the PixiJS scene graph, its structure, and how to manage parent-child relationships, render order, and culling for optimal performance.
- [Accessibility](https://pixijs.com/8.x/guides/components/accessibility.md): Learn how to use PixiJS's built-in accessibility features to make your applications more inclusive for users with disabilities.
- [Color](https://pixijs.com/8.x/guides/components/color.md): Learn how to use the Color class in PixiJS for color manipulation, including various formats like hex, RGB, and named colors.
- [Events / Interaction](https://pixijs.com/8.x/guides/components/events.md): Learn how to use PixiJS's event system for handling user interactions, including mouse and touch events, and how to customize event behavior.
- [Filters / Blend Modes](https://pixijs.com/8.x/guides/components/filters.md): Learn how to use PixiJS filters and blend modes to apply post-processing effects and advanced compositing in your PixiJS applications.
- [Math](https://pixijs.com/8.x/guides/components/math.md): Learn how to use PixiJS math utilities for 2D transformations, geometry, and shape manipulation, including optional advanced methods.
- [Textures](https://pixijs.com/8.x/guides/components/textures.md): Learn how PixiJS handles textures, their lifecycle, creation, and types, including how to manage GPU resources effectively.
- [Ticker](https://pixijs.com/8.x/guides/components/ticker.md): Learn how to use the Ticker class in PixiJS for managing game loops, animations, and time-based updates.
- [Mixing PixiJS and Three.js](https://pixijs.com/8.x/guides/third-party/mixing-three-and-pixi.md): Learn how to combine PixiJS and Three.js to create dynamic applications that leverage both 2D and 3D graphics.
- [v8 Migration Guide](https://pixijs.com/8.x/guides/migrations/v8.md): PixiJS v8 Migration Guide - Transitioning from PixiJS v7 to v8
- [Bug Bounty Program](https://pixijs.com/8.x/bug-bounty.md): PixiJS is committed to delivering a reliable, high-performance rendering engine for the web. To support that mission, we’re launching a **Bug Bount...
- [FAQ](https://pixijs.com/8.x/faq.md): Frequently Asked Questions about PixiJS
- [Culler Plugin](https://pixijs.com/8.x/guides/components/application/culler-plugin.md): Learn how to use the CullerPlugin in PixiJS to optimize rendering by skipping offscreen objects.
- [Application](https://pixijs.com/8.x/guides/components/application.md): Learn how to create and configure a PixiJS Application, including options for WebGL/WebGPU rendering, built-in plugins, and custom application plug...
- [Resize Plugin](https://pixijs.com/8.x/guides/components/application/resize-plugin.md): Learn how to use the Resize Plugin in PixiJS to make your application responsive to window or element size changes.
- [Ticker Plugin](https://pixijs.com/8.x/guides/components/application/ticker-plugin.md): Learn how to use the TickerPlugin in PixiJS for efficient rendering and updates in your application.
- [Background Loader](https://pixijs.com/8.x/guides/components/assets/background-loader.md): Learn how to use the PixiJS background loader to load assets in the background, improving application responsiveness and reducing initial loading t...
- [Compressed Textures](https://pixijs.com/8.x/guides/components/assets/compressed-textures.md): Learn how to use compressed textures in PixiJS for efficient memory usage and GPU performance.
- [Assets](https://pixijs.com/8.x/guides/components/assets.md): Learn how to manage and load assets in PixiJS using the Assets API.
- [Manifests & Bundles](https://pixijs.com/8.x/guides/components/assets/manifest.md): Learn how to manage assets in PixiJS using Manifests and Bundles, and how to automate this process with AssetPack.
- [Resolver](https://pixijs.com/8.x/guides/components/assets/resolver.md): Learn how to use PixiJS's asset resolver for dynamic, multi-format asset loading with platform-aware optimizations.
- [SVG's](https://pixijs.com/8.x/guides/components/assets/svg.md): Learn how to render SVGs in PixiJS, including using them as textures or graphics, and understand their advantages and limitations.
- [Renderers](https://pixijs.com/8.x/guides/components/renderers.md): Learn how to use PixiJS renderers for high-performance GPU-accelerated rendering in your applications.
- [Cache As Texture](https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture.md): Learn how to use cacheAsTexture in PixiJS to optimize rendering performance by caching containers as textures. Understand its benefits, usage, and ...
- [Container](https://pixijs.com/8.x/guides/components/scene-objects/container.md): Learn how to create and manage Containers in PixiJS, including adding/removing children, sorting, and caching as textures.
- [Graphics Fill](https://pixijs.com/8.x/guides/components/scene-objects/graphics/graphics-fill.md): Learn how to use the `fill()` method in PixiJS to fill shapes with colors, textures, and gradients, enhancing your graphics and text rendering.
- [Graphics Pixel Line](https://pixijs.com/8.x/guides/components/scene-objects/graphics/graphics-pixel-line.md): Learn how to use the `pixelLine` property in PixiJS Graphics API to create crisp, pixel-perfect lines that remain consistent under scaling and tran...
- [Graphics](https://pixijs.com/8.x/guides/components/scene-objects/graphics.md): Learn how to use PixiJS Graphics to create shapes, manage graphics contexts, and optimize performance in your projects.
- [Scene Objects](https://pixijs.com/8.x/guides/components/scene-objects.md): Learn how to use scene objects in PixiJS, including containers, sprites, transforms, and more. This guide covers the basics of building your scene ...
- [Mesh](https://pixijs.com/8.x/guides/components/scene-objects/mesh.md): Learn how to create and manipulate meshes in PixiJS v8, including custom geometry, shaders, and built-in mesh types like MeshSimple, MeshRope, and ...
- [NineSlice Sprite](https://pixijs.com/8.x/guides/components/scene-objects/nine-slice-sprite.md): Learn how to use the NineSliceSprite class in PixiJS for creating scalable UI elements with preserved corners and edges.
- [Particle Container](https://pixijs.com/8.x/guides/components/scene-objects/particle-container.md): Learn how to use the ParticleContainer and Particle classes in PixiJS for high-performance particle systems.
- [Sprite](https://pixijs.com/8.x/guides/components/scene-objects/sprite.md): Learn how to create and manipulate Sprites in PixiJS, including texture updates, scaling, and transformations.
- [Bitmap Text](https://pixijs.com/8.x/guides/components/scene-objects/text/bitmap.md): Learn how to use BitmapText in PixiJS for high-performance text rendering with pre-generated texture atlases.
- [Text (Canvas)](https://pixijs.com/8.x/guides/components/scene-objects/text/canvas.md): Learn how to use the Text class in PixiJS to render styled text as display objects, including dynamic updates and font loading.
- [HTML Text](https://pixijs.com/8.x/guides/components/scene-objects/text/html.md): Learn how to use HTMLText in PixiJS to render styled HTML strings within your WebGL canvas, enabling complex typography and inline formatting.
- [Text](https://pixijs.com/8.x/guides/components/scene-objects/text.md): Learn how to use PixiJS's text rendering classes `Text`, `BitmapText`, and `HTMLText`.
- [SplitText & SplitBitmapText](https://pixijs.com/8.x/guides/components/scene-objects/text/split-text.md): The `SplitText` and `SplitBitmapText` classes let you break a string into individual lines, words, and characters—each as its own display object—un...
- [Text Style](https://pixijs.com/8.x/guides/components/scene-objects/text/style.md): Learn how to use the TextStyle class in PixiJS to style text objects, including fills, strokes, shadows, and more.
- [Tiling Sprite](https://pixijs.com/8.x/guides/components/scene-objects/tiling-sprite.md): Learn how to use the TilingSprite class in PixiJS for rendering repeating textures efficiently across a defined area.
- [Documentation for LLMs](https://pixijs.com/8.x/llms.md): PixiJS supports the [`llms.txt`](https://llmstxt.org/) convention for making documentation accessible to large language models (LLMs) and the appli...
