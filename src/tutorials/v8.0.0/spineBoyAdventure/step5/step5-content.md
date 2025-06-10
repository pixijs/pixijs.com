# Setting Up Scene

The scene is much less complicated and only involves a static `Sprite` for the sky and 3 `TilingSprite`s for the parallax layers of the platform, the mid-ground and the background.

Again, a Scene class has been set up on another file with a view container added. And since we already preloaded all the required assets, we can go straight to the action.

We will establish the scene from bottom up so we are going to anchor all element at the bottom right corner.

## Sky

Create the sky sprite, set the anchor as mentioned and use the passed in scene width and height as dimensions to fill up the whole scene.

```javascript
this.sky = Sprite.from('sky');
this.sky.anchor.set(0, 1);
this.sky.width = width;
this.sky.height = height;
```

## Parallax Layers

For the parallax layers, we begin by creating `Texture`s from the preloaded assets.

```javascript
const backgroundTexture = Texture.from('background');
const midgroundTexture = Texture.from('midground');
const platformTexture = Texture.from('platform');
```

We then calculate the ideal platform height which is 40% of the scene height but not exceeding the platform texture height. And then calculate a scale that we need to apply to the platform tiling texture to get it to the ideal height, which we also apply to other parallax layers for visual consistency.

```javascript
const maxPlatformHeight = platformTexture.height;
const platformHeight = Math.min(maxPlatformHeight, height * 0.4);
const scale = (this.scale = platformHeight / maxPlatformHeight);
```

Now we can create the `TilingSprite` objects from the defined textures and parameters.

```javascript
const baseOptions = {
  tileScale: { x: scale, y: scale },
  anchor: { x: 0, y: 1 },
  applyAnchorToTexture: true,
};

this.background = new TilingSprite({
  texture: backgroundTexture,
  width,
  height: backgroundTexture.height * scale,
  ...baseOptions,
});
this.midground = new TilingSprite({
  texture: midgroundTexture,
  width,
  height: midgroundTexture.height * scale,
  ...baseOptions,
});
this.platform = new TilingSprite({
  texture: platformTexture,
  width,
  height: platformHeight,
  ...baseOptions,
});
```

After that, we need to horizontally offset the mid-ground and background layers to be just above the platform floor. Unfortunately, the platform tiling texture also includes the lamp element so we have to manually define the true height from the bottom of the platform to the floor surface. Let's store this as a member of the class, `floorHeight`, for external uses as well.

Then to wrap up the scene class, we just need to offset the mentioned layers up a `floorHeight` amount and add all layers to the main view.

```javascript
this.floorHeight = platformHeight * 0.43;
this.background.y = this.midground.y = -this.floorHeight;
this.view.addChild(this.sky, this.background, this.midground, this.platform);
```

## Adding the Scene

Note that `index.js` has already been updated to instantiate the scene and add it to the stage before the character.

```javascript
const scene = new Scene(app.screen.width, app.screen.height);

app.stage.addChild(scene.view, spineBoy.view);
```

The scene is then placed at the bottom the screen and the character's transformation has been updated to take into account the platform floor height and the scene scaling.

```javascript
scene.view.y = app.screen.height;
spineBoy.view.x = app.screen.width / 2;
spineBoy.view.y = app.screen.height - scene.floorHeight;
spineBoy.spine.scale.set(scene.scale * 0.32);
```
