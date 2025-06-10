# Setting Up Character

We will now create a class for containing and handling our character Spine animations.

Here, a `SpineBoy`` class has been set up on a different file. Lets start off by doing the minimum to get the character Spine displayed. Inside the class, a view container has also been set up to hold any of the content from within the class.

We can use the `Spine.from(options)` method to instantiate our SpineBoy using the preloaded Character's Spine skeleton file and ATLAS file. We then store it as the `spine` member of the class for future references both internally and externally. And of course, remember to add it to the class' view container.

```javascript
this.spine = Spine.from({
  skeleton: 'spineSkeleton',
  atlas: 'spineAtlas',
});
this.view.addChild(this.spine);
```

Let's also create an instance of our SpineBoy class on our main `index.js` file and add its view to our application's stage. To keep it simple, let just keep our character in the middle of the screen and 80 pixels from the bottom of the screen, and also scale it down a little to ensure the fit.

```javascript
// Create our character
const spineBoy = new SpineBoy();

// Adjust character transformation.
spineBoy.view.x = app.screen.width / 2;
spineBoy.view.y = app.screen.height - 80;
spineBoy.spine.scale.set(0.5);

// Add character to the stage.
app.stage.addChild(spineBoy.view);
```

Now we should have our static character on the screen!
