# Text (Canvas)

The `Text` class in PixiJS allows you to render styled, dynamic strings as display objects in your scene. Under the hood, PixiJS rasterizes the text using the browser’s canvas text API, then converts that into a texture. This makes `Text` objects behave like sprites: they can be moved, rotated, scaled, masked, and rendered efficiently.

```ts
import { Text, TextStyle, Assets } from 'pixi.js';

// Load font before use
await Assets.load({
    src: 'my-font.woff2',
    data: {
        family: 'MyFont', // optional
    }
});

const myText = new Text({
    text: 'Hello PixiJS!',
    style: {
      fill: '#ffffff',
      fontSize: 36,
      fontFamily: 'MyFont',
    }
    anchor: 0.5
});

app.stage.addChild(myText);
```

## Text Styling

The `TextStyle` class allows you to customize the appearance of your text. You can set properties like:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `fill` (color)
- `align`
- `stroke` (outline)

See the guide on [TextStyle](./style.md) for more details.

## **Changing Text Dynamically**

You can update the text string or its style at runtime:

```ts
text.text = 'Updated!';
text.style.fontSize = 40; // Triggers re-render
```

:::warning
Changing text or style re-rasterizes the object. Avoid doing this every frame unless necessary.
:::

## Text Resolution

The `resolution` property of the `Text` class determines the pixel density of the rendered text. By default, it uses the resolution of the renderer.

However, you can set text resolution independently from the renderer for sharper text, especially on high-DPI displays.

```ts
const myText = new Text('Hello', {
  resolution: 2, // Higher resolution for sharper text
});

// change resolution
myText.resolution = 1; // Reset to default
```

## Font Loading

PixiJS supports loading custom fonts via the `Assets` API. It supports many of the common font formats:

- `woff`
- `woff2`
- `ttf`
- `otf`

It is recommended to use `woff2` for the best performance and compression.

```js
await Assets.load({
  src: 'my-font.woff2',
  data: {},
});
```

Below is a list of properties you can pass in the `data` object when loading a font:

| Property            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| **family**          | The font family name.                                   |
| **display**         | The display property of the FontFace interface.         |
| **featureSettings** | The featureSettings property of the FontFace interface. |
| **stretch**         | The stretch property of the FontFace interface.         |
| **style**           | The style property of the FontFace interface.           |
| **unicodeRange**    | The unicodeRange property of the FontFace interface.    |
| **variant**         | The variant property of the FontFace interface.         |
| **weights**         | The weights property of the FontFace interface.         |

---

## API Reference

- [Text](https://pixijs.download/release/docs/scene.Text.html)
- [TextStyle](https://pixijs.download/release/docs/text.TextStyle.html)
- [FillStyle](https://pixijs.download/release/docs/scene.FillStyle.html)
- [StrokeStyle](https://pixijs.download/release/docs/scene.StrokeStyle.html)
