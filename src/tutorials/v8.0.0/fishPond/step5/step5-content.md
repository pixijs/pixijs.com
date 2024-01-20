# Adding Displacement Effect

Let's be a bit extra and simulate distortion effect from the water.

PixiJS comes with a handful of filters built-in and many dozens of fancy ones on the (PixiJS Filters package)[https://github.com/pixijs/filters]. Here, we will be using the displacement filter for the distortion, which is built-in to the native PixiJS so we do not have to install any additional filter packages.

Displacement filter requires a sprite as a parameter for its options object. We will need to create a sprite from the displacement map asset and set its base texture's wrap mode to be 'repeat' so that the shader can tile and repeated it.

```javascript
const sprite = Sprite.from('displacement');

sprite.texture.baseTexture.wrapMode = 'repeat';
```

From here, we can simply create the displacement filter and add it to the stage container's filters list.

```javascript
const filter = new DisplacementFilter({
    sprite,
    scale: 50,
    width: app.screen.width,
    height: app.screen.height,
});

app.stage.filters = [filter];
```

Now you should see the post-processed pond in effect. Looks like we are looking down directly into a real pond, right?