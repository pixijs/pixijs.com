# Customizing Text with PixiJS TextStyle

If you're new to working with text in PixiJS, check out the [text guide](./text) for an introduction. This guide explores a key aspect of text rendering in PixiJS: how to customize it using `TextStyle`. The `TextStyle` class allows developers to fine-tune text appearance, making it useful for games, UI elements, and creative tools. This guide provides an in-depth look at various `TextStyle` properties and how they can be used to create visually appealing text.

:::info Note
The `TextStyle` properties discussed here apply to `Text` objects in PixiJS.
:::

## Creating a Basic TextStyle

To start customizing text, create a `TextStyle` object and pass it to a `Text` instance:

```ts
const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fill: 'white',
});

const text = new Text('Hello, PixiJS!', style);
```

/////assets/guides/texts/basic-text.png)

## TextStyle Properties

The `TextStyle` class provides a wide range of properties for customizing text. These include font settings, color and gradient fills, stroke styles, shadow effects, word wrapping, and alignment.

### Font Settings

The font settings control the typeface and size of the text:

```ts
const style = new TextStyle({
  fontFamily: 'Verdana', // Font family
  fontSize: 48, // Font size in pixels
  fontWeight: 'bold', // Font weight: normal, bold, or numeric (100-900)
  fontVariant: 'small-caps', // Normal or small-caps
});
```

//////assets/guides/texts/font-settings.png)

### Color and Gradient Fills

Text can be filled with solid colors, gradients, or textures:

```ts
const style = new TextStyle({
  fill: ['#ff0000', '#00ff00'], // Linear gradient from red to green
});
```

//////assets/guides/texts/gradient-text.png)

### Stroke and Outline

You can apply an outline to text using `stroke` and `strokeThickness`:

```ts
const style = new TextStyle({
  fill: 'white',
  stroke: 'black', // Outline color
  strokeThickness: 4, // Outline thickness
});
```

/////assets/guides/texts/stroke-text.png)

### Drop Shadow

Drop shadows add depth to text, making it more readable:

```ts
const style = new TextStyle({
  dropShadow: true,
  dropShadowColor: 'black',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
});
```

/////assets/guides/texts/shadow-text.png)

### Word Wrapping and Alignment

Longer text can be wrapped and aligned using `wordWrap`, `wordWrapWidth`, and `align`:

```ts
const style = new TextStyle({
  wordWrap: true,
  wordWrapWidth: 200,
  align: 'center',
});
```

/////assets/guides/texts/wrap-text.png)

### Letter Spacing and Line Height

Adjust letter and line spacing for better readability:

```ts
const style = new TextStyle({
  letterSpacing: 2,
  lineHeight: 50,
});
```

/////assets/guides/texts/spacing-text.png)

### Padding

Padding ensures space around the text to prevent clipping:

```ts
const style = new TextStyle({
  padding: 10,
});
```

/////assets/guides/texts/padding-text.png)

### Using Custom Fonts

You can load and use custom fonts in PixiJS by ensuring they are available before rendering:

```ts
const style = new TextStyle({
  fontFamily: 'CustomFont',
});
```

:::info Note
Ensure the font is loaded via CSS or JavaScript before using it in PixiJS.
:::

/////assets/guides/texts/custom-font.png)

## Combining Multiple Styles

By modifying different `TextStyle` properties, you can achieve complex and visually engaging text designs:

```ts
const style = new TextStyle({
  fontFamily: 'Comic Sans MS',
  fontSize: 40,
  fill: ['#ff0000', '#ffff00'],
  stroke: '#000000',
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: '#666666',
  dropShadowBlur: 6,
  dropShadowAngle: Math.PI / 4,
  dropShadowDistance: 8,
  wordWrap: true,
  wordWrapWidth: 250,
  align: 'right',
});
```

///assets/guides/texts/combined-style.png)

## Summary

The `TextStyle` class in PixiJS is a powerful tool for customizing text. By mastering its properties, you can create visually stunning and dynamic text elements for your games, UI components, and creative applications. Experiment with different styles to achieve the perfect look!

Happy coding!

