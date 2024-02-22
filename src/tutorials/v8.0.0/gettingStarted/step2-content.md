# Creating a Sprite

So far all we've been doing is prep work. We haven't actually told PixiJS to draw anything. Let's fix that by adding an image to be displayed.

There are a number of ways to draw images in PixiJS, but the simplest is by using a [Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html). We'll get into the details of how the scene graph works in a later guide, but for now all you need to know is that PixiJS renders a hierarchy of [DisplayObjects](https://pixijs.download/release/docs/PIXI.DisplayObject.html). A Sprite is a type of DisplayObject that wraps a loaded image resource to allow drawing it, scaling it, rotating it, and so forth.

Before PixiJS can render an image, it needs to be loaded. Just like in any web page, image loading happens asynchronously. We'll talk a lot more about resource loading in later guides. For now, we can use a helper method on the PIXI.Sprite class to handle the image loading for us:

```JavaScript
// Magically load the PNG asynchronously
const bunny = PIXI.Sprite.from('https://pixijs.com/assets/bunny.png')
```

Then we need to add our new sprite to the stage. The stage is simply a [Container](https://pixijs.download/release/docs/PIXI.Container.html) that is the root of the scene graph. Every child of the stage container will be rendered every frame. By adding our sprite to the stage, we tell PixiJS's renderer we want to draw it.

```JavaScript
app.stage.addChild(bunny)
```

Now let's set the Sprite's anchor and position it so that it's bang on at the center.

```JavaScript
// center the sprite's anchor point
bunny.anchor.set(0.5)

// move the sprite to the center of the screen
bunny.x = app.screen.width / 2
bunny.y = app.screen.height / 2
```
