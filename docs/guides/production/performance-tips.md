# Performance Tips

### General

- Only optimize when you need to! PixiJS can handle a fair amount of content off the bat
- Be mindful of the complexity of your scene. The more objects you add the slower things will end up
- Order can help, for example sprite / graphic / sprite / graphic is slower than sprite / sprite / graphic / graphic
- Some older mobile devices run things a little slower. Passing in the option `useContextAlpha: false` and `antialias: false` to the Renderer or Application can help with performance
- Culling is disabled by default as it's often better to do this at an application level or set objects to be `cullable = true`. If you are GPU-bound it will improve performance; if you are CPU-bound it will degrade performance

### Sprites

- Use Spritesheets where possible to minimize total textures
- Sprites can be batched with up to 16 different textures (dependent on hardware)
- This is the fastest way to render content
- On older devices use smaller low resolution textures
- Add the extention `@0.5x.png` to the 50% scale-down spritesheet so PixiJS will visually-double them automaticaly
- Draw order can be important

### Graphics

- Graphics fastest when they are not modified constantly (not including the transform, alpha or tint!)
- Graphics objects are batched when under a certain size (100 points or smaller)
- Small Graphics objects are as fast as Sprites (rectangles, triangles)
- Using 100s of graphics complex objects can be slow, in this instance use sprites (you can create a texture)

### Texture

- Textures are automatically managed by a Texture Garbage Collector
- You can also manage them yourself by using `texture.destroy()`
- If you plan to destroyed more than one at once add a random delay to their destruction to remove freezing
- Delay texture destroy if you plan to delete a lot of textures yourself

### Text

- Avoid changing it on everyframe as this can be expensive (each time it draws to a canvas and then uploads to GPU)
- Bitmap Text gives much better performance for dynamically changing text
- Text resolution matches the renderer resolution, to decreates resolution yourself by setting `resolution` property, which can consume less memory

### Masks

- Masks can be expensive if too many are used: e.g., 100s of masks will really slow things down
- Axis-aligned Rectangle masks are the fastest (as the use scissor rect)
- Graphics masks are second fastest (as they use the stencil buffer)
- Sprite masks are the third fastest (they uses filters). They are really expensive. Do not use too many in your scene!

### Filters

- Release memory: `displayObject.filters = null`
- If you know the size of them: `displayObject.filterArea = new PIXI.Rectangle(x,y,w,h)`. This can speeds things up as it means the object does not need to be measured
- Filters are expensive, using too many will start to slow things down!

### BlendModes

- Different blend modes will cause batches to break (de-optimize)
- SceenSprite / NormalSprite / SceenSprite / NormalSprite would be 4 draw calls
- SceenSprite / SceenSprite / NormalSprite / NormalSprite would be 2 draw calls

### CacheAsBitmap

- Setting to `true` turns an object into a Sprite by caching it as a Texture
- It has a one time cost when it is activated as it draws the object to a Texture
- Avoid changing this on elements frequently
- If you have a complicated item that has lots of sprites / filters AND does not move then this will speed up rendering!
- Do not need apply to sprites as they are already Textures
- Do not use if the object where its children are constantly changing as this will slow things down

### Events

- If an object has no interactive children use `interactiveChildren = false`. The event system will then be able to avoid crawling through the object
- Setting `hitArea = new PIXI.Rectangle(x,y,w,h)` as above should stop the event system from crawling through the object
