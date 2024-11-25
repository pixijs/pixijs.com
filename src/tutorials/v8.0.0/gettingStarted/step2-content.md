# Creating a Sprite

So far all we've been doing is prep work. We haven't actually told PixiJS to draw anything. Let's fix that by adding an image to be displayed.

There are a number of ways to draw images in PixiJS, but the simplest is by using a [Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html). We'll get into the details of how the scene graph works in a later guide, but for now all you need to know is that PixiJS renders a hierarchy of [Containers](https://pixijs.download/release/docs/PIXI.Container.html). A Sprite is an extension of Container that wraps a loaded image resource to allow drawing it, scaling it, rotating it, and so forth.

Before PixiJS can render an image, it needs to be loaded. Just like in any web page, image loading happens asynchronously. For now, we will simply load a single texture up on the spot with the `Assets` utility class.

```javascript
const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
```

Then we need to create and add our new bunny sprite to the stage. The stage is also simply a Container that is the root of the scene graph. Every child of the stage container will be rendered every frame. By adding our sprite to the stage, we tell PixiJS's renderer we want to draw it.

```javascript
const bunny = new Sprite(texture);

app.stage.addChild(bunny);
```

Now let's set the Sprite's anchor and position it so that it's bang on at the center.

```javascript
bunny.anchor.set(0.5);

bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
```
