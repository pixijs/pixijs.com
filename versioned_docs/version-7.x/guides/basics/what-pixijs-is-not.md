# What PixiJS Is Not

While PixiJS can do many things, there are things it can't do, or that require additional tools to accomplish.  Newcomers to PixiJS often struggle to identify which tasks PixiJS can solve, and which require outside solutions.  If you're about to start a project, it can be helpful to know if PixiJS is a good fit for your needs.  The following list is obviously incomplete - PixiJS is also not, for example, a duck - but it includes many common tasks or features that you might expect us to support.

## PixiJS Is Not ... A Framework

PixiJS is a rendering engine, and it supports additional features such as interaction management that are commonly needed when using a render engine.  But it is not a framework like Unity or Phaser.  Frameworks are designed to do all the things you'd need to do when building a game - user settings management, music playback, object scripting, art pipeline management... the list goes on.  PixiJS is designed to do one thing really well - render graphical content.  This lets us focus on keeping up with new technology, and makes downloading PixiJS blazingly fast.

## ... A 3D Renderer

PixiJS is built for 2D.  Platformers, adventure games, interactive ads, custom data visualization... all good.  But if you want to render 3D models, you might want to check out [babylon.js](https://www.babylonjs.com) or [three.js](https://threejs.org).

## ... A Mobile App

If you're looking to build mobile games, you can do it with PixiJS, but you'll need to use a deployment system like [Apache Cordova](https://cordova.apache.org) if you want access to native bindings.  We don't provide access to the camera, location services, notifications, etc.

## ... A UI Library

Building a truly generic UI system is a huge challenge, as anyone who has worked with Unity's UI tools can attest.  We've chosen to avoid the complexity to stay true to our core focus on speed.  While you can certainly build your own UI using PixiJS's scene graph and interaction manager, we don't ship with a UI library out of the box.

## ... A Data Store

There are many techniques and technologies that you can use to store settings, scores, and other data.  Cookies, Web Storage, server-based storage... there are many solutions, each with advantages and disadvantages.  You can use any of them with PixiJS, but we don't provide tools to do so.

## ... An Audio Library

At least, not out of the box.  Again, web audio technology is a constantly evolving challenge, with constantly changing rules and requirements across many browsers.  There are a number of dedicated web audio libraries (such as [Howler.js](https://howlerjs.com) that can be used with PixiJS to play sound effects and music.  Alternatively, the [PixiJS Sound plugin](https://github.com/pixijs/pixi-sound) is designed to work well with PixiJS.

## ... A Development Environment

There are a number of tools that are useful for building 2D art and games that you might expect to be a part of PixiJS, but we're a rendering engine, not a development environment.  Packing sprite sheets, processing images, building mipmaps or Retina-ready sprites - there are great standalone tools for this type of tooling.  Where appropriate throughout the guides, we'll point you to tools that may be useful.

## So Is PixiJS Right For Me?

Only you know!  If you're looking for a tightly focused, fast and efficient rendering engine for your next web-based project, PixiJS is likely a great fit.

If you need a full game development framework, with native bindings and a rich UI library, you may want to explore other options.  

Or you may not.  It can be faster and easier to build just the subset of a full framework that your project needs than it can be to digest a monolithic API with bells and whistles you don't need.  There are hundreds of complex, rich games and visual projects that use PixiJS for rendering, with plugins or custom code to add the UI and sound effects.  There are benefits to both approaches.  Regardless, we hope you have a better feel for what PixiJS can (and cannot!) offer your project.
