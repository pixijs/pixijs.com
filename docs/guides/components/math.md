---
sidebar_position: 8
---

# Math

PixiJS includes a several math utilities for 2D transformations, geometry, and shape manipulation. This guide introduces the most important classes and their use cases, including optional advanced methods enabled via `math-extras`.

## Matrix

The `Matrix` class represents a 2D affine transformation matrix. It is used extensively for transformations such as scaling, translation, and rotation.

```ts
import { Matrix, Point } from 'pixi.js';

const matrix = new Matrix();
matrix.translate(10, 20).scale(2, 2);

const point = new Point(5, 5);
const result = matrix.apply(point); // result is (20, 30)
```

---

## Point and ObservablePoint

### `Point`

The Point object represents a location in a two-dimensional coordinate system, where `x` represents the position on the horizontal axis and `y` represents the position on the vertical axis. Many Pixi functions accept the `PointData` type as an alternative to `Point`, which only requires `x` and `y` properties.

```ts
import { Point } from 'pixi.js';
const point = new Point(5, 10);

point.set(20, 30); // set x and y
```

### `ObservablePoint`

Extends `Point` and triggers a callback when its values change. Used internally for reactive systems like position and scale updates.

```ts
import { Point, ObservablePoint } from 'pixi.js';

const observer = {
    _onUpdate: (point) => {
        console.log(`Point updated to: (${point.x}, ${point.y})`);
    },
};
const reactive = new ObservablePoint(observer, 1, 2);
reactive.set(3, 4); // triggers call to _onUpdate
```

---

## Shapes

PixiJS includes several 2D shapes, used for hit testing, rendering, and geometry computations.

### `Rectangle`

Axis-aligned rectangle defined by `x`, `y`, `width`, and `height`.

```ts
import { Rectangle } from 'pixi.js';

const rect = new Rectangle(10, 10, 100, 50);
rect.contains(20, 20); // true
```

### `Circle`

Defined by `x`, `y` (center) and `radius`.

```ts
import { Circle } from 'pixi.js';

const circle = new Circle(50, 50, 25);
circle.contains(50, 75); // true
```

### `Ellipse`

Similar to `Circle`, but supports different width and height (radii).

```ts
import { Ellipse } from 'pixi.js';

const ellipse = new Ellipse(0, 0, 20, 10);
ellipse.contains(5, 0); // true
```

### `Polygon`

Defined by a list of points. Used for complex shapes and hit testing.

```ts
import { Polygon } from 'pixi.js';

const polygon = new Polygon([0, 0, 100, 0, 100, 100, 0, 100]);
polygon.contains(50, 50); // true
```

### `RoundedRectangle`

Rectangle with rounded corners, defined by a radius.

```ts
import { RoundedRectangle } from 'pixi.js';

const roundRect = new RoundedRectangle(0, 0, 100, 100, 10);
roundRect.contains(10, 10); // true
```

### `Triangle`

A convenience wrapper for defining triangles with three points.

```ts
import { Triangle } from 'pixi.js';

const triangle = new Triangle(0, 0, 100, 0, 50, 100);
triangle.contains(50, 50); // true
```

---

## Optional: `math-extras`

Importing `pixi.js/math-extras` extends `Point` and `Rectangle` with additional vector and geometry utilities.

### To enable:

```ts
import 'pixi.js/math-extras';
```

### Enhanced `Point` Methods

| Method                          | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| `add(other[, out])`             | Adds another point to this one.                              |
| `subtract(other[, out])`        | Subtracts another point from this one.                       |
| `multiply(other[, out])`        | Multiplies this point with another point component-wise.     |
| `multiplyScalar(scalar[, out])` | Multiplies the point by a scalar.                            |
| `dot(other)`                    | Computes the dot product of two vectors.                     |
| `cross(other)`                  | Computes the scalar z-component of the 3D cross product.     |
| `normalize([out])`              | Returns a normalized (unit-length) vector.                   |
| `magnitude()`                   | Returns the Euclidean length.                                |
| `magnitudeSquared()`            | Returns the squared length (more efficient for comparisons). |
| `project(onto[, out])`          | Projects this point onto another vector.                     |
| `reflect(normal[, out])`        | Reflects the point across a given normal.                    |

### Enhanced `Rectangle` Methods

| Method                       | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `containsRect(other)`        | Returns true if this rectangle contains the other.    |
| `equals(other)`              | Checks if all properties are equal.                   |
| `intersection(other[, out])` | Returns a new rectangle representing the overlap.     |
| `union(other[, out])`        | Returns a rectangle that encompasses both rectangles. |
