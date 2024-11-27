# Interaction

PixiJS is primarily a rendering system, but it also includes support for interactivity. Adding support for mouse and touch events to your project is simple and consistent.

## Event Modes

Prior to v7, interaction was defined and managed by the `Interaction` package and its `InteractionManager`.
Beginning with v7, however, a new event-based system has replaced the previous `Interaction` package, and
expanded the definition of what it means for a `Container` to be interactive.

With this, we have introduced `eventMode` which allows you to control how an object responds to interaction events.
If you're familiar with the former `Interaction` system, the `eventMode` is similar to the `interactive` property, but with more options.

| eventMode | Description                                                                                                                                                                                                             |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `none`    | Ignores all interaction events, similar to CSS's `pointer-events: none`. Good optimization for non-interactive children.                                                                                                |
| `passive` | The **default** `eventMode` for all containers. Does not emit events and ignores hit-testing on itself, but *does* allow for events and hit-testing on its interactive children.                                        |
| `auto`    | Does not emit events, but is hit tested if parent is interactive. Same as `interactive = false` in v7.                                                                                                                  |
| `static`  | Emits events and is hit tested. Same as `interaction = true` in v7. Useful for objects like buttons that do not move.                                                                                                   |
| `dynamic` | Emits events and is hit tested, but will also receive mock interaction events fired from a ticker to allow for interaction when the mouse isn't moving. Useful for elements that are independently moving or animating. |

## Event Types

PixiJS supports the following event types:

| Event Type          | Description                                                                                                        |
|---------------------|--------------------------------------------------------------------------------------------------------------------|
| `pointercancel`     | Fired when a pointer device button is released outside the display object that initially registered a pointerdown. |
| `pointerdown`       | Fired when a pointer device button is pressed on the display object.                                               |
| `pointerenter`      | Fired when a pointer device enters the display object.                                                             |
| `pointerleave`      | Fired when a pointer device leaves the display object.                                                             |
| `pointermove`       | Fired when a pointer device is moved while over the display object.                                                |
| `globalpointermove` | Fired when a pointer device is moved, regardless of hit-testing the current object.                                |
| `pointerout`        | Fired when a pointer device is moved off the display object.                                                       |
| `pointerover`       | Fired when a pointer device is moved onto the display object.                                                      |
| `pointertap`        | Fired when a pointer device is tapped twice on the display object.                                                 |
| `pointerup`         | Fired when a pointer device button is released over the display object.                                            |
| `pointerupoutside`  | Fired when a pointer device button is released outside the display object that initially registered a pointerdown. |
| `mousedown `        | Fired when a mouse button is pressed on the display object.                                                        |
| `mouseenter`        | Fired when the mouse cursor enters the display object.                                                             |
| `mouseleave`        | Fired when the mouse cursor leaves the display object.                                                             |
| `mousemove `        | Fired when the mouse cursor is moved while over the display object.                                                |
| `globalmousemove`   | Fired when a mouse is moved, regardless of hit-testing the current object.                                         |
| `mouseout `         | Fired when the mouse cursor is moved off the display object.                                                       |
| `mouseover `        | Fired when the mouse cursor is moved onto the display object.                                                      |
| `mouseup `          | Fired when a mouse button is released over the display object.                                                     |
| `mouseupoutside `   | Fired when a mouse button is released outside the display object that initially registered a mousedown.            |
| `click `            | Fired when a mouse button is clicked (pressed and released) over the display object.                               |
| `touchcancel `      | Fired when a touch point is removed outside of the display object that initially registered a touchstart.          |
| `touchend `         | Fired when a touch point is removed from the display object.                                                       |
| `touchendoutside `  | Fired when a touch point is removed outside of the display object that initially registered a touchstart.          |
| `touchmove `        | Fired when a touch point is moved along the display object.                                                        |
| `globaltouchmove`   | Fired when a touch point is moved, regardless of hit-testing the current object.                                   |
| `touchstart `       | Fired when a touch point is placed on the display object.                                                          |
| `tap `              | Fired when a touch point is tapped twice on the display object.                                                    |
| `wheel `            | Fired when a mouse wheel is spun over the display object.                                                          |
| `rightclick `       | Fired when a right mouse button is clicked (pressed and released) over the display object.                         |
| `rightdown `        | Fired when a right mouse button is pressed on the display object.                                                  |
| `rightup `          | Fired when a right mouse button is released over the display object.                                               |
| `rightupoutside `   | Fired when a right mouse button is released outside the display object that initially registered a rightdown.      |


## Enabling Interaction

Any `Container`-derived object (`Sprite`, `Container`, etc.) can become interactive simply by setting its `eventMode` property to any of the eventModes listed above. Doing so will cause the object to emit interaction events that can be responded to in order to drive your project's behavior.

Check out the [click interactivity example code](../../examples/events/click).

To respond to clicks and taps, bind to the events fired on the object, like so:

```javascript
let sprite = Sprite.from('/some/texture.png');
sprite.on('pointerdown', (event) => { alert('clicked!'); });
sprite.eventMode = 'static';
```

Check out the [Container](https://pixijs.download/release/docs/scene.Container.html) for the list of interaction events supported.

### Checking if an Object is Interactive

You can check if an object is interactive by calling the `isInteractive` property. This will return true if `eventMode` is set to `static` or `dynamic`.

```javascript
if (sprite.isInteractive()) {
    // sprite is interactive
}
```

## Use Pointer Events

PixiJS supports three types of interaction events: mouse, touch, and pointer.

- Mouse events are fired by mouse movement, clicks etc.
- Touch events are fired for touch-capable devices. And,
- Pointer events are fired for _both_.

What this means is that, in many cases, you can write your project to use pointer events and it will just work when used with _either_ mouse or touch input.

Given that, the only reason to use non-pointer events is to support different modes of operation based on input type or to support multi-touch interaction. In all other cases, prefer pointer events.

## Optimization

Hit testing requires walking the full object tree, which in complex projects can become an optimization bottleneck.

To mitigate this issue, PixiJS `Container`-derived objects have a property named `interactiveChildren`. If you have `Container`s or other objects with complex child trees that you know will *never* be interactive,
you can set this property to `false`, and the hit-testing algorithm will skip those children when checking for hover and click events.

As an example, if you were building a side-scrolling game, you would probably want to set `background.interactiveChildren = false` for your background layer with rocks, clouds, flowers, etc. Doing so would substantially speed up hit-testing due to the number of unclickable child objects the background layer would contain.

The `EventSystem` can also be customised to be more performant:
```js
const app = new Application({
    eventMode: 'passive',
    eventFeatures: {
        move: true,
        /** disables the global move events which can be very expensive in large scenes */
        globalMove: false,
        click: true,
        wheel: true,
    }
});
```
