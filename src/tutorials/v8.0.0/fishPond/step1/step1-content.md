# Let's make a pond!

Welcome to the Fish Pond workshop!

We are going to build a virtual pond and fill them with a number of colorful fishes. In the process, we will be learning about basic manipulation of [Sprites](/8.x/guides/components/scene-objects/sprite), [TilingSprite](https://pixijs.download/release/docs/scene.TilingSprite.html) and Filter, specifically the [Displacement Filter](https://pixijs.download/release/docs/filters.DisplacementFilter.html).

Please go through the tutorial steps at your own pace and challenge yourself using the editor on the right hand side. Here PixiJS has already been included as guided under the [Getting Started](/8.x/guides/getting-started/quick-start) section. Let's start off by creation a PixiJS application, initialize it, add its canvas to the DOM, and preload the required assets ahead of the subsequent steps.

We will be using an asynchronous immediately invoked function expression ([IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)), but you are free to switch to use promises instead.

## Application Setup

Let's create the application outside of the IIFE just so that it can be referenced across other functions declared outside. The initialization and appending the application's canvas will be done from within the `setup` function which is called inside the IIFE.

```javascript
async function setup() {
  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);
}
```

## Preloading Assets

After the application setup, we will then preload all the textures required for the rest of the tutorial. Here we also provide aliases so that they can be intuitively referred to later on. This will be done inside the `preload` function which is also called inside the IIFE after the setup.

```javascript
async function preload() {
  const assets = [
    { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
    { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
    { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
    { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
    { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
    { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
    { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
    { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
  ];
  await Assets.load(assets);
}
```

At this point, you should see the preview filled with an empty light blue background.

When you are ready, proceed to the next exercise using the _Next >_ button below, or feel free to skip to any exercise using the drop-down menu on the top right hand corner of the card.
