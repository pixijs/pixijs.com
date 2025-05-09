---
sidebar_position: 6
---

# Events / Interaction

PixiJS is primarily a rendering library, but it provides a flexible and performant event system designed for both mouse and touch input. This system replaces the legacy `InteractionManager` from previous versions with a unified, DOM-like federated event model.

```ts
const sprite = new Sprite(texture);
sprite.eventMode = 'static';
sprite.on('pointerdown', () => {
    console.log('Sprite clicked!');
});
```

## Event Modes

To use the event system, set the `eventMode` of a `Container` (or its subclasses like `Sprite`) and subscribe to event listeners.

The `eventMode` property controls how an object interacts with the event system:

| Mode      | Description                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `none`    | Ignores all interaction events, including children. Optimized for non-interactive elements.                              |
| `passive` | _(default)_ Ignores self-hit testing and does not emit events, but interactive children still receive events.            |
| `auto`    | Participates in hit testing only if a parent is interactive. Does not emit events.                                       |
| `static`  | Emits events and is hit tested. Suitable for non-moving interactive elements like buttons.                               |
| `dynamic` | Same as `static`, but also receives synthetic events when the pointer is idle. Suitable for animating or moving targets. |

## Event Types

PixiJS supports a rich set of DOM-like event types across mouse, touch, and pointer input. Below is a categorized list.

### Pointer Events (Recommended for general use)

| Event Type          | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `pointerdown`       | Fired when a pointer (mouse, pen, or touch) is pressed on a display object.        |
| `pointerup`         | Fired when the pointer is released over the display object.                        |
| `pointerupoutside`  | Fired when the pointer is released outside the object that received `pointerdown`. |
| `pointermove`       | Fired when the pointer moves over the display object.                              |
| `pointerover`       | Fired when the pointer enters the boundary of the display object.                  |
| `pointerout`        | Fired when the pointer leaves the boundary of the display object.                  |
| `pointerenter`      | Fired when the pointer enters the display object (does not bubble).                |
| `pointerleave`      | Fired when the pointer leaves the display object (does not bubble).                |
| `pointercancel`     | Fired when the pointer interaction is canceled (e.g. touch lost).                  |
| `pointertap`        | Fired when a pointer performs a quick tap.                                         |
| `globalpointermove` | Fired on every pointer move, regardless of whether any display object is hit.      |

### Mouse Events (Used for mouse-specific input)

| Event Type        | Description                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `mousedown`       | Fired when a mouse button is pressed on a display object.                                   |
| `mouseup`         | Fired when a mouse button is released over the object.                                      |
| `mouseupoutside`  | Fired when a mouse button is released outside the object that received `mousedown`.         |
| `mousemove`       | Fired when the mouse moves over the display object.                                         |
| `mouseover`       | Fired when the mouse enters the display object.                                             |
| `mouseout`        | Fired when the mouse leaves the display object.                                             |
| `mouseenter`      | Fired when the mouse enters the object, does not bubble.                                    |
| `mouseleave`      | Fired when the mouse leaves the object, does not bubble.                                    |
| `click`           | Fired when a mouse click (press and release) occurs on the object.                          |
| `rightdown`       | Fired when the right mouse button is pressed on the display object.                         |
| `rightup`         | Fired when the right mouse button is released over the object.                              |
| `rightupoutside`  | Fired when the right mouse button is released outside the object that received `rightdown`. |
| `rightclick`      | Fired when a right mouse click (press and release) occurs on the object.                    |
| `globalmousemove` | Fired on every mouse move, regardless of display object hit.                                |
| `wheel`           | Fired when the mouse wheel is scrolled while over the display object.                       |

### Touch Events

| Event Type        | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| `touchstart`      | Fired when a new touch point is placed on a display object.                           |
| `touchend`        | Fired when a touch point is lifted from the display object.                           |
| `touchendoutside` | Fired when a touch point ends outside the object that received `touchstart`.          |
| `touchmove`       | Fired when a touch point moves across the display object.                             |
| `touchcancel`     | Fired when a touch interaction is canceled (e.g. device gesture).                     |
| `tap`             | Fired when a touch point taps the display object.                                     |
| `globaltouchmove` | Fired on every touch move, regardless of whether a display object is under the touch. |


### Global Events

In previous versions of PixiJS, events such as `pointermove`, `mousemove`, and `touchmove` were fired when any move event was captured by the canvas, even if the pointer was not over a display object. This behavior changed in v8 and now these events are fired only when the pointer is over a display object.

To maintain the old behavior, you can use the `globalpointermove`, `globalmousemove`, and `globaltouchmove` events. These events are fired on every pointer/touch move, regardless of whether any display object is hit.

```ts
const sprite = new Sprite(texture);
sprite.eventMode = 'static';
sprite.on('globalpointermove', (event) => {
    console.log('Pointer moved globally!', event);
});
```

## How Hit Testing Works

When an input event occurs (mouse move, click, etc.), PixiJS walks the display tree to find the top-most interactive element under the pointer:

-   If `interactiveChildren` is `false` on a `Container`, its children will be skipped.
-   If a `hitArea` is set, it overrides bounds-based hit testing.
-   If `eventMode` is `'none'`, the element and its children are skipped.

Once the top-most interactive element is found, the event is dispatched to it. If the event bubbles, it will propagate up the display tree.
If the event is not handled, it will continue to bubble up to parent containers until it reaches the root.

### Custom Hit Area

Custom hit areas can be defined using the `hitArea` property. This property can be set on any scene object, including `Sprite`, `Container`, and `Graphics`.

Using a custom hit area allows you to define a specific area for interaction, which can be different from the object's bounding box. It also can improve performance by reducing the number of objects that need to be checked for interaction.

```ts
import { Rectangle, Sprite } from 'pixi.js';

const sprite = new Sprite(texture);
sprite.hitArea = new Rectangle(0, 0, 100, 100);
sprite.eventMode = 'static';
```

## Listening to Events

PixiJS supports both `on()`/`off()` and `addEventListener()`/`removeEventListener()` and event callbacks (`onclick: ()=> {}`) for adding and removing event listeners. The `on()` method is recommended for most use cases as it provides a more consistent API across different event types used throughout PixiJS.

### Using `on()` (from EventEmitter)

```ts
const eventFn = (e) => console.log('clicked');
sprite.on('pointerdown', eventFn);
sprite.once('pointerdown', eventFn);
sprite.off('pointerdown', eventFn);
```

### Using DOM-style Events

```ts
sprite.addEventListener(
    'click',
    (event) => {
        console.log('Clicked!', event.detail);
    },
    { once: true },
);
```

### Using callbacks

```ts
sprite.onclick = (event) => {
    console.log('Clicked!', event.detail);
};
```

## Checking for Interactivity

You can check if a `Sprite` or `Container` is interactive by using the `isInteractive()` method. This method returns `true` if the object is interactive and can receive events.

```ts
if (sprite.isInteractive()) {
    // true if eventMode is static or dynamic
}
```

## Custom Cursors
PixiJS allows you to set a custom cursor for interactive objects using the `cursor` property. This property accepts a string representing the CSS cursor type.

```ts
const sprite = new Sprite(texture);
sprite.eventMode = 'static';
sprite.cursor = 'pointer'; // Set the cursor to a pointer when hovering over the sprite
```
```ts
const sprite = new Sprite(texture);
sprite.eventMode = 'static';
sprite.cursor = 'url(my-cursor.png), auto'; // Set a custom cursor image
```

### Default Custom Cursors

You can also set default values to be used for all interactive objects.
```ts
// CSS style for icons
const defaultIcon = 'url(\'https://pixijs.com/assets/bunny.png\'),auto';
const hoverIcon = 'url(\'https://pixijs.com/assets/bunny_saturated.png\'),auto';

// Add custom cursor styles
app.renderer.events.cursorStyles.default = defaultIcon;
app.renderer.events.cursorStyles.hover = hoverIcon;

const sprite = new Sprite(texture);
sprite.eventMode = 'static';
sprite.cursor = 'hover';
```

---

## API Reference

### Container Properties

| Property / Method     | Type / Signature                               | Description                                                |
| --------------------- | ---------------------------------------------- | -----------------------------------------------------------|
| `eventMode`           | `'none','passive','auto','static','dynamic'`   | Controls how an object responds to input events            |
| `interactive`         | `boolean`                                      | Alias for setting `eventMode` to `'static'` or `'passive'` |
| `interactiveChildren` | `boolean`                                      | Whether to hit test children                               |
| `hitArea`             | `IHitArea`                                     | Custom hit area                                            |
| `cursor`              | `string`                                       | CSS cursor when hovered                                    |
| `addEventListener`    | `(type, listener, options?)`                   | Adds a DOM-style event listener                            |
| `removeEventListener` | `(type, listener, options?)`                   | Removes a DOM-style event listener                         |
| `dispatchEvent`       | `(event: FederatedEvent)`                      | Dispatches a federated event                               |
| `on`                  | `(event, callback)`                            | Adds an EventEmitter-style listener                        |
| `off`                 | `(event, callback)`                            | Removes an EventEmitter-style listener                     |
| `isInteractive()`     | `(): boolean`                                  | Returns `true` if `eventMode` is `static` or `dynamic`     |
