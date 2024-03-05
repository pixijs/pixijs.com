# Writing an Update Loop

While you _can_ use PixiJS for static content, for most projects you'll want to add animation. Our sample app is actually cranking away, rendering the same sprite in the same place multiple times a second. All we have to do to make the image move is to update its attributes once per frame. To do this, we want to hook into the application's _ticker_. A ticker is a PixiJS object that runs one or more callbacks each frame. Doing so is surprisingly easy. Add the following to the end of your script block:

```javascript
app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
});
```

All you need to do is to call `app.ticker.add(...)`, pass it a callback function, and then update your scene in that function. It will get called every frame, and you can move, rotate etc. whatever you'd like to drive your project's animations.
