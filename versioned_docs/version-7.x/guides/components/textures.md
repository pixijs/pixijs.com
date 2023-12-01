# Textures

We're slowly working our way down from the high level to the low.  We've talked about the scene graph, and in general about display objects that live in it.  We're about to get to sprites and other simple display objects.  But before we do, we need to talk about textures.

In PixiJS, textures are one of the core resources used by display objects.  A texture, broadly speaking, represents a source of pixels to be used to fill in an area on the screen.  The simplest example is a sprite - a rectangle that is completely filled with a single texture.  But things can get much more complex.

## Life-cycle of a Texture

Let's examine how textures really work, by following the path your image data travels on its way to the screen.

Here's the flow we're going to follow:  Source Image > Loader > BaseTexture > Texture

### Serving the Image

To start with, you have the image you want to display.  The first step is to make it available on your server.  This may seem obvious, but if you're coming to PixiJS from other game development systems, it's worth remembering that everything has to be loaded over the network.  If you're developing locally, please be aware that you *must* use a webserver to test, or your images won't load due to how browsers treat local file security.

### Loading the Image

To work with the image, the first step is to pull the image file from your webserver into the user's web browser.  To do this, we can use `PIXI.Texture.from()`, which works for quick demos, but in production you'll use the Loader class.  A Loader  wraps and manages using an `<IMG>` element to tell the browser to fetch the image, and then notifies you when that has been completed.  This process is *asynchronous* - you request the load, then time passes, then an event fires to let you know the load is completed.  We'll go into the loader in a lot more depth in a later guide.

### BaseTextures Own the Data

Once the Loader has done its work, the loaded `<IMG>` element contains the pixel data we need.  But to use it to render something, PixiJS has to take that raw image file and upload it to the GPU.  This brings us to the real workhorse of the texture system - the [BaseTexture](https://pixijs.download/release/docs/PIXI.BaseTexture.html) class.  Each BaseTexture manages a single pixel source - usually an image, but can also be a Canvas or Video element.  BaseTextures allow PixiJS to convert the image to pixels and use those pixels in rendering.  In addition, it also contains settings that control how the texture data is rendered, such as the wrap mode (for UV coordinates outside the 0.0-1.0 range) and scale mode (used when scaling a texture).

BaseTextures are automatically cached, so that calling `PIXI.Texture.from()` repeatedly for the same URL returns the same BaseTexture each time.  Destroying a BaseTexture frees the image data associated with it.

### Textures are a View on BaseTextures

So finally, we get to the PIXI.Texture class itself!  At this point, you may be wondering what the Texture object *does*.  After all, the BaseTexture manages the pixels and render settings.  And the answer is, it doesn't do very much.  Textures are light-weight views on an underlying BaseTexture.  Their main attribute is the source rectangle within the BaseTexture from which to pull.

If all PixiJS drew were sprites, that would be pretty redundant.  But consider [SpriteSheets](./sprite-sheets).  A SpriteSheet is a single image that contains multiple sprite images arranged within.  In a [Spritesheet](https://pixijs.download/release/docs/PIXI.Spritesheet.html) object, a single BaseTexture is referenced by a set of Textures, one for each source image in the original sprite sheet.  By sharing a single BaseTexture, the browser only downloads one file, and our batching renderer can blaze through drawing sprites since they all share the same underlying pixel data.  The SpriteSheet's Textures pull out just the rectangle of pixels needed by each sprite.

<!--TODO: Image showing sprite sheet base texture, plus each sprite's texture-->

That is why we have both Textures and BaseTextures - to allow sprite sheets, animations, button states, etc to be loaded as a single image, while only displaying the part of the master image that is needed.

## Loading Textures

We will discuss resource loading in a later guide, but one of the most common issues new users face when building a PixiJS project is how best to load their textures.  Using `PIXI.Texture.from()` as we do in our demo snippets will work, but will result in pop-in as each texture is loaded while your objects are already being rendered in the scene graph.

Instead, here's a quick cheat sheet of one good solution:

1. Show a loading image
2. Create a Loader
3. Run all texture-based objects, add their textures to the loader
4. Start the loader, and optionally update your loading image based on progress callbacks
5. On loader completion, run all objects and use `PIXI.Texture.from()` to pull the loaded textures out of the texture cache
6. Prepare your textures (optional - see below)
7. Hide your loading image, start rendering your scene graph

Using this workflow ensures that your textures are pre-loaded, to prevent pop-in, and is relatively easy to code.

Regarding preparing textures: Even after you've loaded your textures, the images still need to be pushed to the GPU and decoded.  Doing this for a large number of source images can be slow and cause lag spikes when your project first loads.  To solve this, you can use the [Prepare](https://pixijs.download/release/docs/PIXI.Prepare.html) plugin, which allows you to pre-load textures in a final step before displaying your project.

## Unloading Textures

Once you're done with a Texture, you may wish to free up the memory (both WebGL-managed buffers and browser-based) that it uses.  To do so, you should call `destroy()` on the BaseTexture that owns the data.  Remember that Textures don't manage pixel data!

This is a particularly good idea for short-lived imagery like cut-scenes that are large and will only be used once.  If you want to remove *all* textures and wipe the slate clean, you can use the `PIXI.utils.destroyTextureCache()` function.

## Beyond Images

As we alluded to above, you can make a Texture out of more than just images:

Video: Pass an HTML5 `<VIDEO>` element to `PIXI.BaseTexture.from()` to allow you to display video in your project.  Since it's a texture, you can tint it, add filters, or even apply it to custom geometry.

Canvas: Similarly, you can wrap an HTML5 `<CANVAS>` element in a BaseTexture to let you use canvas's drawing methods to dynamically create a texture.

SVG: Pass in an `<SVG>` element or load a .svg URL, and PixiJS will attempt to rasterize it.  For highly network-constrained projects, this can allow for beautiful graphics with minimal network load times.

RenderTexture: A more advanced (but very powerful!) feature is to build a Texture from a [RenderTexture](https://pixijs.download/release/docs/PIXI.RenderTexture.html).  This can allow for building complex geometry using a [Geometry](https://pixijs.download/release/docs/PIXI.Geometry.html) object, then baking that geometry down to a simple texture.

Each of these texture sources has caveats and nuances that we can't cover in this guide, but they should give you a feeling for the power of PixiJS's texture system. <!--TODO: link to advanced textures guide-->

Check out the [render texture example code](/examples/textures/render-texture-basic).
