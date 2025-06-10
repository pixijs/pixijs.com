# Animating Scene

Last but not least, we need to match the `Scene` scroll according to the character movement state.

Lets begin by having an unified `positionX` property for the `Scene` class. For the getter, this will simply return the `tilePosition.x` of the platform `TilingSprite`, and similarly for the setter we set its `tilePosition.x` directly but also so set `tilePosition.x` of the mid-ground and the background `TilingSprite`s at descending fractions of the value. This is to create a parallax scrolling effect for the backdrop layers as the platform horizontal position changes.

### Getter

```javascript
return this.platform.tilePosition.x;
```

### Setter

```javascript
this.background.tilePosition.x = value * 0.1;
this.midground.tilePosition.x = value * 0.25;
this.platform.tilePosition.x = value;
```

Then on the main `index.js`, let's manipulate this `positionX` property at the end of the application's ticker callback to animate the scrolling accordingly. Here, we will use 3 different scrolling speeds for character's `walk`, `run` and `hover` state. We need to also add to or subtract from the property depending on the direction/

```javascript
let speed = 1.25;

if (spineBoy.state.hover) speed = 7.5;
else if (spineBoy.state.run) speed = 3.75;

if (spineBoy.state.walk) {
  scene.positionX -= speed * scene.scale * spineBoy.direction;
}
```

Et voilà, we have a fully interactive side-scrolling experience! Have a play around with your own adventure creation.
