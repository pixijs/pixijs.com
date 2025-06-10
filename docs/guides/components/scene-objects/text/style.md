---
sidebar_position: 3
description: Learn how to use the TextStyle class in PixiJS to style text objects, including fills, strokes, shadows, and more.
---

# Text Style

The `TextStyle` class encapsulates all visual styling properties for text. You can define colors, font families, stroke, shadows, alignment, line spacing, word wrapping, and more.

A `TextStyle` instance can be reused across multiple `Text` objects, making your code cleaner and improving memory efficiency.

```ts
import { TextStyle } from 'pixi.js';

const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 30,
  fill: '#ffffff',
  stroke: '#000000',
  strokeThickness: 3,
  dropShadow: {
    color: '#000000',
    blur: 5,
    distance: 4,
    angle: Math.PI / 4,
    alpha: 0.5,
  },
});

const label = new Text({
  text: 'Score: 1234',
  style,
});
```

## Fill and Stroke

Using fills and strokes are identical to that of the `Graphics` class. You can find more details about them in the [Graphics Fills](../graphics/graphics-fill.md) section.

```ts
// Using a number
const fill = 0xff0000;

// Using a hex string
const fill = '#ff0000';

// Using an array
const fill = [255, 0, 0];

// Using a Color object
const color = new Color();
const obj4 = color;

// Using a gradient
const fill = new FillGradient({
  type: 'linear',
  colorStops: [
    { offset: 0, color: 'yellow' },
    { offset: 1, color: 'green' },
  ],
});

// Using a pattern
const txt = await Assets.load<Texture>('https://pixijs.com/assets/bg_scene_rotate.jpg');
const fill = new FillPattern(txt, 'repeat');

// Use the fill in a TextStyle
const style = new TextStyle({
  fontSize: 48,
  fill: fill,
  stroke: {
    fill,
    width: 4,
  },
});
```

## Drop Shadow

In v8 `dropShadow` and its properties are now objects. To update a drop shadow, you can set the properties directly on the `dropShadow` object.

```ts
const style = new TextStyle({
  dropShadow: {
    color: '#000000',
    alpha: 0.5,
    angle: Math.PI / 4,
    blur: 5,
    distance: 4,
  },
});

style.dropShadow.color = '#ff0000'; // Change shadow color
```

---

## **API Reference**

- [TextStyle](https://pixijs.download/release/docs/text.TextStyle.html)
- [Text](https://pixijs.download/release/docs/scene.Text.html)
- [BitmapText](https://pixijs.download/release/docs/scene.BitmapText.html)
- [HTMLText](https://pixijs.download/release/docs/scene.HTMLText.html)
- [FillStyle](https://pixijs.download/release/docs/scene.FillStyle.html)
- [StrokeStyle](https://pixijs.download/release/docs/scene.StrokeStyle.html)
