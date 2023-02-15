# Display Objects

[DisplayObject](/api/classes/PIXI.DisplayObject.pixi_display) is the core class for anything that can be rendered by the engine.  It's the base class for sprites, text, complex graphics, containers, etc., and provides much of the common functionality for those objects.  As you're learning PixiJS, it's important to [read through the documentation for this class][DisplayObject](/api/classes/PIXI.DisplayObject.pixi_display) to understand how to move, scale, rotate and compose the visual elements of your project.

Be aware that you won't use DisplayObject directly - you'll use its functions and attributes in derived classes.

## Commonly Used Attributes

The most common attributes you'll use when laying out and animating content in PixiJS are provided by the DisplayObject class:

| Property | Description |
| --- | --- |
| **position** | X- and Y-position are given in pixels and change the position of the object relative to its parent, also available directly as `object.x` / `object.y` |
| **rotation** | Rotation is specified in radians, and turns an object clockwise (0.0 - 2 * Math.PI) |
| **angle** | Angle is an alias for rotation that is specified in degrees instead of radians (0.0 - 360.0) |
| **pivot** | Point the object rotates around, in pixels - also sets origin for child objects |
| **alpha** | Opacity from 0.0 (fully transparent) to 1.0 (fully opaque), inherited by children |
| **scale** | Scale is specified as a percent with 1.0 being 100% or actual-size, and can be set independently for the x and y axis |
| **skew** | Skew transforms the object in x and y similar to the CSS skew() function, and is specified in radians |
| **visible** | Whether the object is visible or not, as a boolean value - prevents updating and rendering object and children |
| **renderable** | Whether the object should be rendered - when `false`, object will still be updated, but won't be rendered, doesn't affect children |
