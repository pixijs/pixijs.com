# Interaction

PixiJS is primarily a rendering system, but it also includes support for interactivity.  Adding support for mouse and touch events to your project is simple and consistent.

## Enabling Interaction

Any DisplayObject-derived object (Sprite, Container, etc.) can become interactive simply by setting its `interactive` property to `true`.  Doing so will cause the object to emit interaction events that can be responded to in order to drive your project's behavior.

Check out the [interaction example code](/examples/events/click).

## Interaction is Events

To respond to clicks and taps, bind to the events fired on the object, like so:

```javascript
let sprite = PIXI.Sprite.from('/some/texture.png');
sprite.on('pointerdown', (event) => { alert('clicked!'); });
```

Check out the [DisplayObject](/api/classes/PIXI.DisplayObject.pixi_display) for the list of interaction events supported.

## Use Pointer Events

PixiJS supports three types of interaction events - mouse, touch and pointer.  Mouse events are fired by mouse movement, clicks etc.  Touch events are fired for touch-capable devices.  And pointer events are fired for _both_.

What this means is that, in many cases, you can write your project to use pointer events and it will just work when used with _either_ mouse or touch input.  Given that, the only reason to use non-pointer events is to support different modes of operation based on input type or to support multi-touch interaction.  In all other cases, prefer pointer events.

## Hit Testing

By default, PixiJS uses the bounding rectangle of an interactive object to determine if a mouse or touch event "hits" that object.  In many cases, that's fine.  But what if you have a circular button or a complex character shape, and you want to only register clicks that are within that shape?  What if you want only a small part of an object to be clickable?  

The solution is to use the `hitArea` property of your DisplayObject.  Setting a hitArea allows you to customize what counts as a hit on your object.  You can set the hitArea property to be a PIXI.Circle, PIXI.Rectangle, PIXI.RoundedRectangle, or PIXI.Polygon.  Using a Polygon in particular allows you to make complex outlines of player characters or other complex visual geometry.

Once you've set up your interaction objects, it can be useful to test what object is under a given point.  You can use `InteractionManager`'s `hitTest()` method to find the interactive object at a (global) point:

```javascript
// Find out what interactive object lies at [100, 50]
let globalPt = new PIXI.Point(100,50);
let obj = app.renderer.plugins.interaction.hitTest(globalPt);
```

Check out the [hit testing example code](/examples/events/custom-hitarea).

## Optimization

Hit testing requires walking the full object tree, which in complex projects can become an optimization bottleneck.  To mitigate this issue, PixiJS Container-derived objects have a property named `interactiveChildren`.  If you have Containers or other objects with complex child trees that you know will never be interactive, you can set this property to `false` and the hit testing algorithm will skip those children when checking for hover and click events.  As an example, if you were building a side-scrolling game, you would probably want to set `background.interactiveChildren = false` for your background layer with rocks, clouds, flowers, etc.  Doing so would speed up hit testing substantially due to the number of unclickable child objects the background layer would contain.

## Caveats

PixiJS's interaction system has been designed to look similar to the interaction events supported by the DOM in web development, but there are some important differences that can trip up users new to PixiJS.

First, events in PixiJS do not "bubble", meaning you cannot set an event trigger on a parent object and have it fire when a child object is clicked.  If you want to support bubbling, you'll need to explicitly re-trigger the parent object's event in your child object's event handling code.

Second, there is no event capture support - you can't have a single object capture all interaction events while dragging, for example.
