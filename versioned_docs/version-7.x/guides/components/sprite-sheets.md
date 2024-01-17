# Spritesheets

Now that you understand basic sprites, it's time to talk about a better way to create them - the [Spritesheet](https://pixijs.download/release/docs/PIXI.Spritesheet.html) class.

A Spritesheet is a media format for more efficiently downloading and rendering Sprites.  While somewhat more complex to create and use, they are a key tool in optimizing your project.

## Anatomy of a Spritesheet

The basic idea of a spritesheet is to pack a series of images together into a single image, track where each source image ends up, and use that combined image as a shared BaseTexture for the resulting Sprites.

The first step is to collect the images you want to combine.  The sprite packer then collects the images, and creates a new combined image.

<!--TODO: Image showing multiple source images, combined into a single image-->

As this image is being created, the tool building it keeps track of the location of the rectangle where each source image is stored.  It then writes out a JSON file with that information.

<!--TODO: SpriteSheet json goes here-->

These two files, in combination, can be passed into a SpriteSheet constructor.  The SpriteSheet object then parses the JSON, and creates a series of Texture objects, one for each source image, setting the source rectangle for each based on the JSON data.  Each texture uses the same shared BaseTexture as its source.

## Doubly Efficient

SpriteSheets help your project in two ways.

First, by __speeding up the loading process__.  While downloading a SpriteSheet's texture requires moving the same (or even slightly more!) number of bytes, they're grouped into a single file.  This means that the user's browser can request and download far fewer files for the same number of Sprites.  The number of files *itself* is a key driver of download speed, because each request requires a round-trip to the webserver, and browsers are limited to how many files they can download simultaneously.  Converting a project from individual source images to shared sprite sheets can cut your download time in half, at no cost in quality.

Second, by __improving batch rendering__.  WebGL rendering speed scales roughly with the number of draw calls made.  Batching multiple Sprites, etc. into a single draw call is the main secret to how PixiJS can run so blazingly fast.  Maximizing batching is a complex topic, but when multiple Sprites all share a common BaseTexture, it makes it more likely that they can be batched together and rendered in a single call.

## Creating SpriteSheets

You can use a 3rd party tool to assemble your sprite sheet files.  Here are two that may fit your needs:

[ShoeBox](http://renderhjs.net/shoebox/): ShoeBox is a free, Adobe AIR-based sprite packing utility that is great for small projects or learning how SpriteSheets work.

[TexturePacker](https://www.codeandweb.com/texturepacker): TexturePacker is a more polished tool that supports advanced features and workflows. A free version is available which has all the necessary features for packing spritesheets for PixiJS. It's a good fit for larger projects and professional game development, or projects that need more complex tile mapping features.

Spritesheet data can also be created manually or programmatically, and supplied to a new AnimatedSprite. This may be an easier option if your sprites are already contained in a single image.

```javascript
// Create object to store sprite sheet data
const atlasData = {
	frames: {
		enemy1: {
			frame: { x: 0, y:0, w:32, h:32 },
			sourceSize: { w: 32, h: 32 },
			spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
		},
		enemy2: {
			frame: { x: 32, y:0, w:32, h:32 },
			sourceSize: { w: 32, h: 32 },
			spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
		},
	},
	meta: {
		image: 'images/spritesheet.png',
		format: 'RGBA8888',
		size: { w: 128, h: 32 },
		scale: 1
	},
	animations: {
		enemy: ['enemy1','enemy2'] //array of frames by name
	}
}


// Create the SpriteSheet from data and image
const spritesheet = new PIXI.Spritesheet(
	PIXI.BaseTexture.from(atlasData.meta.image),
	atlasData
);

// Generate all the Textures asynchronously
await spritesheet.parse();

// spritesheet is ready to use!
const anim = new PIXI.AnimatedSprite(spritesheet.animations.enemy);

// set the animation speed
anim.animationSpeed = 0.1666;
// play the animation on a loop
anim.play();
// add it to the stage to render
app.stage.addChild(anim);
```
