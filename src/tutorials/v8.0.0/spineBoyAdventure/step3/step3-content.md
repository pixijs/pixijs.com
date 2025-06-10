# Adding Keyboard Controller

Before we proceed to work on the character animations, we will need a handler for our keyboard input.

To speed things up, a `Controller` class has been set up on another file with the key map and the controller state map define, as well as the key listeners hooked up.

As you can we, we have 3 tracked properties on each of the state keys:

- `pressed` simply tells whether the key is being pressed.
- `doubleTap` tracks if the key has been rapidly pressed after letting go.
- `timestamp` is an internal time tracker for determining whether the tap is considered as a double tap.

Please note that we have also defined **W**, **A**, **S** and **D** keys as directional input on the key map so they will behave like the arrow keys.

Let's start by updating our key-down and key-up handlers so that the controller state is updated accordingly.

## Key-Down Handler

For this, we simply need to set the `pressed` state of the corresponded key state to `true`. And so for the `doubleTap` if the difference in time from the point of the timestamp recorded for that key is less than a threshold, 300ms in this case. Since the key-down handler will be called continuously while a key is held, the `doubleTap` state should remain `true` on subsequent callback if it was already, despite the growing deference in time from the timestamp (As the timestamp only gets reset on the key-up handler).

```javascript
const key = keyMap[event.code];

if (!key) return;

const now = Date.now();

this.keys[key].pressed = true;
this.keys[key].doubleTap = this.keys[key].doubleTap || now - this.keys[key].timestamp < 300;
```

## Key-Up Handler

Similary, we reset the `pressed` state of the corresponded key state to `false` on key-up, as well as the `doubleTap` state if it was previously `true`. Otherwise, we reset the timestamp to allow subsequent key presses to validate any rapid double-tap.

```javascript
const key = keyMap[event.code];

if (!key) return;

const now = Date.now();

this.keys[key].pressed = false;

if (this.keys[key].doubleTap) this.keys[key].doubleTap = false;
else this.keys[key].timestamp = now;
```

## Using Controller

Just like for our character, we then create an instance of the controller on the main `index.js`' IIFE.

```javascript
const controller = new Controller();
```

Then we can try connecting the controller state to the character's walk animation. Let's do this for just the right key for now on an application's ticker update. Here, we temporarily store a reference to an active animation key on spot to only allow playing once per toggle since we are already specifying for them to be loops. The toggle will be between the animations with the key of `idle` and `walk`.

```javascript
let currentAnimation;

app.ticker.add((time) => {
  const rightPressed = controller.keys.right.pressed;
  const animationName = rightPressed ? 'walk' : 'idle';
  const loop = true;

  if (currentAnimation !== animationName) {
    currentAnimation = animationName;
    spineBoy.spine.state.setAnimation(0, animationName, loop);
  }
});
```

Now tap on the preview screen to make sure the canvas is focused, then try tapping away the right button. We now having a functioning controller!
