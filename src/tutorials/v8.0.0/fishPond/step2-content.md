# Adding a Background

Now lets fill the pond with some rocks and pebbles, shall we?

## Create and Setup Background Sprite

We already preloaded the pond background asset as the alias 'background' so we can just simply create a sprite

```JavaScript
const background = Sprite.from('background');

background.anchor.set(0.5);
```

## Fit and Position Sprite

Now we want the background sprite to fill the whole screen without any distortion so we will compare and fill the longer axis and then apply the same scale on the smaller axis for a uniform scaling.

```javascript
if (app.screen.width > app.screen.height)
{
    background.width = app.screen.width;
    background.scale.y = background.scale.x;
}
else
{
    background.height = app.screen.height;
    background.scale.x = background.scale.y;
}
```

When we manually set the width or height on a sprite, it will apply a scale on the corresponding axis depending on the width or height of the original texture. Hence, we can simply equalize the scale on both axes this way.

Then we simply position it at the center of the preview.

```javascript
background.x = app.screen.width / 2;
background.y = app.screen.height / 2;
```

We got a beautiful pond! Now let's proceed to add some fishes!


