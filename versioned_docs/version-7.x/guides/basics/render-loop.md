# Render Loop

Now that you understand the major parts of the system, let's look at how these parts work together to get your project onto the screen.  Unlike a web page, PixiJS is constantly updating and re-drawing itself, over and over.  You update your objects, then PixiJS renders them to the screen, then the process repeats.  We call this cycle the render loop.

The majority of any PixiJS project is contained in this update + render cycle.  You code the updates, PixiJS handles the rendering.

Let's walk through what happens each frame of the render loop.  There are three main steps.

<!--(TODO: This guide is half baked.  I need feedback from the core team about what would be helpful to put here, and clarification on what's really going on under the hood.)-->

## Running Ticker Callbacks

The first step is to calculate how much time has elapsed since the last frame, and then call the Application object's ticker callbacks with that time delta.  This allows your project's code to animate and update the sprites, etc. on the stage in preparation for rendering.

## Updating the Scene Graph

We'll talk a *lot* more about what a scene graph is and what it's made of in the next guide, but for now, all you need to know is that it contains the things you're drawing - sprites, text, etc. - and that these objects are in a tree-like hierarchy.  After you've updated your game objects by moving, rotating and so forth, PixiJS needs to calculate the new positions and state of every object in the scene, before it can start drawing.

<!--(TODO: Is this true?  My understanding was that there is a transform/state update before the render pass, but I couldn't find it in the code.)-->

## Rendering the Scene Graph

Now that our game's state has been updated, it's time to draw it to the screen.  The rendering system starts with the root of the scene graph (`app.stage`), and starts rendering each object and its children, until all objects have been drawn.  No culling or other cleverness is built into this process.  If you have lots of objects outside of the visible portion of the stage, you'll want to investigate disabling them as an optimization.

## Frame Rates

A note about frame rates.  The render loop can't be run infinitely fast - drawing things to the screen takes time.  In addition, it's not generally useful to have a frame updated more than once per screen update (commonly 60fps, but newer monitors can support 144fps and up).  Finally, PixiJS runs in the context of a web browser like Chrome or Firefox.  The browser itself has to balance the needs of various internal operations with servicing any open tabs.  All this to say, determining when to draw a frame is a complex issue.

<!--For most projects, you can use the default settings for the Ticker object, which will ... (TODO: The docs are a bit unclear on what happens if you don't set a min/max FPS - confirm)-->

In cases where you want to adjust that behavior, you can set the `minFPS` and `maxFPS` attributes on a Ticker to give PixiJS hints as to the range of tick speeds you want to support.  Just be aware that due to the complex environment, your project cannot _guarantee_ a given FPS.  Use the passed `delta` value in your ticker callbacks to scale any animations to ensure smooth playback.

## Custom Render Loops

What we've just covered is the default render loop provided out of the box by the Application helper class.  There are many other ways of creating a render loop that may be helpful for advanced users looking to solve a given problem.  <!--You can read more about that in the [Custom Render Loop guide](TODO: link here).-->  While you're prototyping and learning PixiJS, sticking with the Application's provided system is the recommended approach.
