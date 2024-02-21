# Sprites

Sprites are the simplest and most common renderable object in PixiJS.  They represent a single image to be displayed on the screen.  Each [Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html) contains a [Texture](https://pixijs.download/release/docs/PIXI.Texture.html) to be drawn, along with all the transformation and display state required to function in the scene graph.

## Creating Sprites

To create a Sprite, all you need is a Texture (check out the Texture guide).  Load a PNG's URL using the `Assets` class, then call `PIXI.Sprite.from(url)` and you're all set. Unlike v7 you now must load your texture before using it, this is to ensure best practices.

Check out the [sprite example code](../../examples/sprite/basic).

## Using Sprites

In our [Container guide](container), we learned about the Container class and the various properties it defines.  Since Sprite objects are also containers, you can move a sprite, rotate it, and update any other display property.

## Alpha, Tint and Blend Modes

Alpha is a standard display object property.  You can use it to fade sprites into the scene by animating each sprite's alpha from 0.0 to 1.0 over a period of time.

Tinting allows you multiply the color value of every pixel by a single color.  For example, if you had a dungeon game, you might show a character's poison status by setting `obj.tint = 0x00FF00`, which would give a green tint to the character.

Blend modes change how pixel colors are added to the screen when rendering.  The three main modes are __add__, which adds each pixel's RGB channels to whatever is under your sprite (useful for glows and lighting), __multiply__ which works like `tint`, but on a per-pixel basis, and __screen__, which overlays the pixels, brightening whatever is underneath them.

## Scale vs Width & Height

One common area of confusion when working with sprites lies in scaling and dimensions.  The Container class allows you to set the x and y scale for any object.  Sprites, being Containers, also support scaling.  In addition, however, Sprites support explicit `width` and `height` attributes that can be used to achieve the same effect, but are in pixels instead of a percentage.  This works because a Sprite object owns a Texture, which has an explicit width and height.  When you set a Sprite's width, internally PixiJS converts that width into a percentage of the underlying texture's width and updates the object's x-scale.  So width and height are really just convenience methods for changing scale, based on pixel dimensions rather than percentages.

## Pivot vs Anchor

If you add a sprite to your stage and rotate it, it will by default rotate around the top-left corner of the image.  In some cases, this is what you want.  In many cases, however, what you want is for the sprite to rotate around the center of the image it contains, or around an arbitrary point.

There are two ways to achieve this: *pivots* and *anchors*

An object's __pivot__ is an offset, expressed in pixels, from the top-left corner of the Sprite.  It defaults to (0, 0).  If you have a Sprite whose texture is 100px x 50px, and want to set the pivot point to the center of the image, you'd set your pivot to (50, 25) - half the width, and half the height.  Note that pivots can be set *outside* of the image, meaning the pivot may be less than zero or greater than the width/height.  This can be useful in setting up complex animation hierarchies, for example.  Every Container has a pivot.

An __anchor__, in contrast, is only available for Sprites.  Anchors are specified in percentages, from 0.0 to 1.0, in each dimension.  To rotate around the center point of a texture using anchors, you'd set your Sprite's anchor to (0.5, 0.5) - 50% in width and height.  While less common, anchors can also be outside the standard 0.0 - 1.0 range.

The nice thing about anchors is that they are resolution and dimension agnostic.  If you set your Sprite to be anchored in the middle then later change the size of the texture, your object will still rotate correctly.  If you had instead set a pivot using pixel-based calculations, changing the texture size would require changing your pivot point.

So, generally speaking, you'll want to use anchors when working with Sprites.

One final note: unlike CSS, where setting the transform-origin of the image doesn't move it, in PixiJS setting an anchor or pivot *will* move your object on the screen.  In other words, setting an anchor or pivot affects not just the rotation origin, but also the position of the sprite relative to its parent.
