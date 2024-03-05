# Architecture Overview

OK, now that you've gotten a feel for how easy it is to build a PixiJS application, let's get into the specifics.  For the rest of the Basics section, we're going to work from the high level down to the details.  We'll start with an overview of how PixiJS is put together.

## The Code

Before we get into how the code is layed out, let's talk about where it lives.  PixiJS is an open source product hosted on [GitHub](https://github.com/pixijs/pixijs).  Like any GitHub repo, you can browse and download the raw source files for each PixiJS class, as well as search existing issues & bugs, and even submit your own.  PixiJS is written in a JavaScript variant called [TypeScript](https://www.typescriptlang.org), which enables type-checking in JavaScript via a pre-compile step.

## The Components

Here's a list of the major components that make up PixiJS.  Note that this list isn't exhaustive.  Additionally, don't worry too much about how each component works.  The goal here is to give you a feel for what's under the hood as we start exploring the engine.

### Major Components

| Component                                  | Description                                                                                                                                                                                            |
| ---                                        | ---                                                                                                                                                                                                    |
| **Renderer**                  | The core of the PixiJS system is the renderer, which displays the scene graph and draws it to the screen. PixiJS will automatically determine whether to provide you the WebGPU or WebGL renderer under the hood.                           |
| **Container**             | Main scene object which creates a scene graph: the tree of renderable objects to be displayed, such as sprites, graphics and text. See [Scene Graph](scene-graph) for more details.             |
| **Assets**                 | The Asset system provides tools for asynchronously loading resources such as images and audio files.                                                                                                  |
| **Ticker**                  | Tickers provide periodic callbacks based on a clock.  Your game update logic will generally be run in response to a tick once per frame.  You can have multiple tickers in use at one time.            |
| **Application**                | The Application is a simple helper that wraps a Loader, Ticker and Renderer into a single, convenient easy-to-use object. Great for getting started quickly, prototyping and building simple projects. |
| **Events**         | PixiJS supports pointer-based interaction - making objects clickable, firing hover events, etc.                                                                                           |
| **Accessibility**   | Woven through our display system is a rich set of tools for enabling keyboard and screen-reader accessibility.                                                                                         |
