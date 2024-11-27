# What PixiJS Is

So what exactly *is* PixiJS?  At its heart, PixiJS is a rendering system that uses WebGL (or optionally Canvas) to display images and other 2D visual content.  It provides a full scene graph (a hierarchy of objects to render), and provides interaction support to enable handling click and touch events.  It is a natural replacement for Flash in the modern HTML5 world, but provides better performance and pixel-level effects that go beyond what Flash could achieve.  It is perfect for online games, educational content, interactive ads, data visualization... any web-based application where complex graphics are important.  And coupled with technology such as Cordova and Electron, PixiJS apps can be distributed beyond the browser as mobile and desktop applications.

<!--(TODO: add real world examples of possible projects - game, data viz, ads)-->

Here's what else you get with PixiJS:

## PixiJS Is ... Fast

One of the major features that distinguishes PixiJS from other web-based rendering solutions is *speed*.  From the ground up, the render pipeline has been built to get the most performance possible out of your users' browsers.  Automatic sprite and geometry batching, careful use of WebGL resources, a tight scene graph - no matter your application, speed is valuable, and PixiJS has it to spare.

## ... More Than Just Sprites

Drawing images on a page can be handled with HTML5 and the DOM, so why use PixiJS?  Beyond performance, the answer is that PixiJS goes well beyond simple images.  Draw trails and tracks with [SimpleRope](https://pixijs.download/v7.4.2/docs/PIXI.SimpleRope.html).  Draw polygons, lines, circles and other primitives with [Graphics](https://pixijs.download/v7.4.2/docs/PIXI.Graphics.html). [Text](https://pixijs.download/v7.4.2/docs/PIXI.Text.html) provides full text rendering support that's just as performant as sprites.  And even when drawing simple images, PixiJS natively supports spritesheets for efficient loading and ease of development.

## ... WebGL Native

WebGL is the JavaScript API for accessing users' GPUs for fast rendering and advanced effects.  PixiJS leverages WebGL to display thousands of moving sprites efficiently even on mobile devices.  But using WebGL offers more than just speed.  By using the [Filter](https://pixijs.download/v7.4.2/docs/PIXI.Filter.html) class, you can write shader programs (or use pre-built ones!) to achieve displacement maps, blurring, and other advanced visual effects that cannot be accomplished with just the DOM or Canvas APIs.

## ... Open Source

Want to understand how the engine works?  Trying to track down a bug?  Been burned by closed-source projects going dark?  With PixiJS, you get a mature project with full source code access.  We're MIT licensed for compatibility, and [hosted on GitHub](https://github.com/pixijs/pixijs) for issue tracking and ease of access.

## ... Extensible

Open source helps.  So does being based on JavaScript.  But the real reason PixiJS is easy to extend is the clean internal API that underlies every part of the system.  After years of development and 5 major releases, PixiJS is ready to make your project a success, no matter what your needs.

## ... Easy to Deploy

Flash required the player.  Unity requires an installer or app store.  PixiJS requires... a browser.  Deploying PixiJS on the web is exactly like deploying a web site.  That's all it is - JavaScript + images + audio, like you've done a hundred times.  Your users simply visit a URL, and your game or other content is ready to run.  But it doesn't stop at the web.  If you want to deploy a mobile app, wrap your PixiJS code in Cordova.  Want to deploy a standalone desktop program?  Build an Electron wrapper, and you're ready to rock.
