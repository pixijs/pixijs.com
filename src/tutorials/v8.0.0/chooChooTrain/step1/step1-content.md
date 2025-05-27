# Onboard the Choo Choo Train!

Welcome to the Choo Choo Train workshop!

We are going to handcraft a cute little scene of a train moving through a landscape at night. We will solely be using the [Graphics](/8.x/guides/components/scene-objects/graphics) API to draw out the whole scene. In this tutorial, we will be exploring a handful of methods it provides to draw a variety of shapes. For the full list of methods, please check out the Graphics [documentation](https://pixijs.download/release/docs/scene.Graphics.html).

Please go through the tutorial steps at your own pace and challenge yourself using the editor on the right hand side. Here PixiJS has already been included as guided under the [Getting Started](/8.x/guides/getting-started/quick-start) section. Let's start off by creation a PixiJS application, initialize it, add its canvas to the DOM, and preload the required assets ahead of the subsequent steps.

We will be using an asynchronous immediately invoked function expression ([IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)), but you are free to switch to use promises instead.

## Application Setup

Let's create the application outside of the IIFE just so that it can be referenced across other functions declared outside. We can then initialize the application and appending its canvas to the DOM inside the IIFE.

```javascript
await app.init({ background: '#021f4b', resizeTo: window });
document.body.appendChild(app.canvas);
```

At this point, you should see the preview filled with an empty light blue background.

When you are ready, proceed to the next exercise using the _Next >_ button below, or feel free to skip to any exercise using the drop-down menu on the top right hand corner of the card.
