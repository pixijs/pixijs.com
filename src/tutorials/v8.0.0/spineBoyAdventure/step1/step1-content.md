# SpineBoy Adventure

Welcome to the SpineBoy Adventure workshop!

Let's venture into the world of the PixiJS ecosystem. We are going to explore one of the official plugins; [Spine plugin (`@pixi/spine-pixi`)](https://github.com/pixijs/spine-v8) which allow us to render and manipulate Spine animations on our PixiJS.

We will be creating a mini interactive side-scroller experience using the famous SpineBoy which will be controlled by the keyboard. For the sake of simplicity, we will be focusing on just the movement around the scene.

## What is Spine

[Spine](https://esotericsoftware.com/), developed by Esoteric Software, is a 2D animation software specifically designed for games. It streamlines 2D game animation with skeletal animation, robust tools, and exportable, lightweight animations.

## Application Setup

As usual, let's begin by creating an application, initializing it, and appending its canvas to the DOM inside the IIFE.

```javascript
await app.init({ background: '#021f4b', resizeTo: window });
document.body.appendChild(app.canvas);
```

## Assets Preloading

Let's then preload all of our required assets upfront which includes:

1. Spine Assets
    - Skeleton data file.
    - Accompanying ATLAS.
2. Scene Images
    - Static sky gradient image.
    - Tiled image of the massive buildings in the distance.
    - Tiled image of the city skyline.
    - Tiled image of the platform that the character will be moving on.

```javascript
await Assets.load([
    {
        alias: 'spineSkeleton',
        src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pro.skel',
    },
    {
        alias: 'spineAtlas',
        src: 'https://raw.githubusercontent.com/pixijs/spine-v8/main/examples/assets/spineboy-pma.atlas',
    },
    {
        alias: 'sky',
        src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/sky.png',
    },
    {
        alias: 'background',
        src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/background.png',
    },
    {
        alias: 'midground',
        src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/midground.png',
    },
    {
        alias: 'platform',
        src: 'https://pixijs.com/assets/tutorials/spineboy-adventure/platform.png',
    },
]);
```

Now you are ready to dive straight into the adventure! Proceed to the next exercise using the _Next >_ button below, or feel free to skip to any exercise using the drop-down menu on the top right hand corner of the card.
