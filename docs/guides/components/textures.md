---
sidebar_position: 3
---

# Textures

The `Application` class is the main entry point for a PIXI application. It is a container for the rendering surface and all the other components that make up the application.

In PixiJS, textures are one of the core resources used by display objects.  A texture, broadly speaking, represents a source of pixels to be used to fill in an area on the screen.  The simplest example is a sprite - a rectangle that is completely filled with a single texture.  But things can get much more complex.

## Life-cycle of a Texture

Let's examine how textures really work, by following the path your image data travels on its way to the screen.

Here's the flow we're going to follow:  Source Image > Loader > BaseTexture > Texture

### Serving the Image

To start with, you have the image you want to display.  The first step is to make it available on your server.  This may seem obvious, but if you're coming to PixiJS from other game development systems, it's worth remembering that everything has to be loaded over the network.  If you're developing locally, please be aware that you *must* use a webserver to test, or your images won't load due to how browsers treat local file security.

### Loading the Image

To work with the image, the first step is to pull the image file from your webserver into the user's web browser.  To do this, we can use `Assets.load('myTexture.png')`.  `Assets` wraps and deals with telling the browser to fetch the image, convert it and then let you know when that has been completed.  This process is *asynchronous* - you request the load, then time passes, then a promise completes to let you know the load is completed.  We'll go into the loader in a lot more depth in a later guide.

```ts
const texture = await Assets.load('myTexture.png');

// pass a texture explicitly
const sprite = new Sprite(texture);
// as options
const sprite2 = new Sprite({texture});
// from the cache as the texture is loaded
const sprite3 = Sprite.from('myTexture.png')
```

### TextureSources Own the Data

Once the texture has loaded, the loaded `<IMG>` element contains the pixel data we need.  But to use it to render something, PixiJS has to take that raw image file and upload it to the GPU.  This brings us to the real workhorse of the texture system - the [TextureSource](https://pixijs.download/release/docs/TextureSource.html) class.  Each TextureSource manages a single pixel source - usually an image, but can also be a Canvas or Video element.  TextureSources allow PixiJS to convert the image to pixels and use those pixels in rendering.  In addition, it also contains settings that control how the texture data is rendered, such as the wrap mode (for UV coordinates outside the 0.0-1.0 range) and scale mode (used when scaling a texture).

TextureSource are automatically cached, so that calling `Texture.from()` repeatedly for the same URL returns the same TextureSource each time.  Destroying a TextureSource frees the image data associated with it.

### Textures are a View on BaseTextures

So finally, we get to the `Texture` class itself!  At this point, you may be wondering what the `Texture` object *does*.  After all, the BaseTexture manages the pixels and render settings.  And the answer is, it doesn't do very much.  Textures are light-weight views on an underlying BaseTexture.  Their main attribute is the source rectangle within the TextureSource from which to pull.

If all PixiJS drew were sprites, that would be pretty redundant.  But consider [SpriteSheets](./sprite-sheets).  A SpriteSheet is a single image that contains multiple sprite images arranged within.  In a [Spritesheet](https://pixijs.download/release/docs/assets.Spritesheet.html) object, a single TextureSource is referenced by a set of Textures, one for each source image in the original sprite sheet.  By sharing a single TextureSource, the browser only downloads one file, and our batching renderer can blaze through drawing sprites since they all share the same underlying pixel data.  The SpriteSheet's Textures pull out just the rectangle of pixels needed by each sprite.

<!--TODO: Image showing sprite sheet base texture, plus each sprite's texture-->

That is why we have both Textures and TextureSource - to allow sprite sheets, animations, button states, etc to be loaded as a single image, while only displaying the part of the master image that is needed.

## Loading Textures

We will discuss resource loading in a later guide, but one of the most common issues new users face when building a PixiJS project is how best to load their textures.

here's a quick cheat sheet of one good solution:

1. Show a loading image
2. Use [Assets](assets.md) to ensure that all textures are loaded
3. optionally update your loading image based on progress callbacks
4. On loader completion, run all objects and use `Texture.from()` to pull the loaded textures out of the texture cache
5. Prepare your textures (optional - see below)
6. Hide your loading image, start rendering your scene graph

Using this workflow ensures that your textures are pre-loaded, to prevent pop-in, and is relatively easy to code.

Regarding preparing textures: Even after you've loaded your textures, the images still need to be pushed to the GPU and decoded.  Doing this for a large number of source images can be slow and cause lag spikes when your project first loads.  To solve this, you can use the [Prepare](https://pixijs.download/release/docs/rendering.PrepareSystem.html) plugin, which allows you to pre-load textures in a final step before displaying your project.

## Unloading Textures

Once you're done with a Texture, you may wish to free up the memory (both WebGL-managed buffers and browser-based) that it uses.  To do so, you should call `destroy()` on the BaseTexture that owns the data.  Remember that Textures don't manage pixel data!

This is a particularly good idea for short-lived imagery like cut-scenes that are large and will only be used once. If a texture is destroyed that was loaded via `Assets` then the assets class will automatically remove it from the cache for you.

## Beyond Images

As we alluded to above, you can make a Texture out of more than just images:

Video: Pass an HTML5 `<VIDEO>` element to `TextureSource.from()` to allow you to display video in your project.  Since it's a texture, you can tint it, add filters, or even apply it to custom geometry.

Canvas: Similarly, you can wrap an HTML5 `<CANVAS>` element in a BaseTexture to let you use canvas's drawing methods to dynamically create a texture.

SVG: Pass in an `<SVG>` element or load a .svg URL, and PixiJS will attempt to rasterize it.  For highly network-constrained projects, this can allow for beautiful graphics with minimal network load times.

RenderTexture: A more advanced (but very powerful!) feature is to build a Texture from a [RenderTexture](https://pixijs.download/release/docs/RenderTexture.html).  This can allow for building complex geometry using a [Geometry](https://pixijs.download/release/docs/Geometry.html) object, then baking that geometry down to a simple texture.

Each of these texture sources has caveats and nuances that we can't cover in this guide, but they should give you a feeling for the power of PixiJS's texture system. <!--TODO: link to advanced textures guide-->

Check out the [render texture example code](../../examples/textures/render-texture-basic).
