# SplitText & SplitBitmapText

The `SplitText` and `SplitBitmapText` classes let you break a string into individual lines, words, and characters—each as its own display object—unlocking rich, per-segment animations and advanced text layout effects.

These classes work just like regular `Text` or `BitmapText`, but provide fine-grained control over every part of your text.

:::warning
**Experimental:** These features are new and may evolve in future versions.
:::

---

## What Are SplitText & SplitBitmapText?

Both `SplitText` and `SplitBitmapText` extend PixiJS containers, generating nested display objects for each line, word, and character of your string.

The difference is in the underlying text rendering:

| Class             | Base Type    | Best For                      |
| ----------------- | ------------ | ----------------------------- |
| `SplitText`       | `Text`       | Richly styled text            |
| `SplitBitmapText` | `BitmapText` | High-performance dynamic text |

**Perfect for:**

- Per-character or per-word animations
- Line-based entrance or exit effects
- Interactive text elements
- Complex animated typography

---

## Basic Usage

### SplitText Example

```ts
import { SplitText } from 'pixi.js';

const text = new SplitText({
  text: 'Hello World',
  style: { fontSize: 32, fill: 0xffffff },

  // Optional: Anchor points (0-1 range)
  lineAnchor: 0.5, // Center lines
  wordAnchor: { x: 0, y: 0.5 }, // Left-center words
  charAnchor: { x: 0.5, y: 1 }, // Bottom-center characters
  autoSplit: true,
});

app.stage.addChild(text);
```

### SplitBitmapText Example

```ts
import { SplitBitmapText, BitmapFont } from 'pixi.js';

// Ensure your bitmap font is installed
BitmapFont.install({
  name: 'Game Font',
  style: { fontFamily: 'Arial', fontSize: 32 },
});

const text = new SplitBitmapText({
  text: 'High Performance',
  style: { fontFamily: 'Game Font', fontSize: 32 },
  autoSplit: true,
});

app.stage.addChild(text);
```

---

## Accessing Segments

Both classes provide convenient segment arrays:

```ts
console.log(text.lines); // Array of line containers
console.log(text.words); // Array of word containers
console.log(text.chars); // Array of character display objects
```

Each line contains its words, and each word contains its characters.

---

## Anchor Points Explained

Segment anchors control the origin for transformations like rotation or scaling.

Normalized range: `0` (start) to `1` (end)

| Anchor    | Meaning      |
| --------- | ------------ |
| `0,0`     | Top-left     |
| `0.5,0.5` | Center       |
| `1,1`     | Bottom-right |

**Example:**

```ts
const text = new SplitText({
  text: 'Animate Me',
  lineAnchor: { x: 1, y: 0 }, // Top-right lines
  wordAnchor: 0.5, // Center words
  charAnchor: { x: 0, y: 1 }, // Bottom-left characters
});
```

---

## Animation Example (with GSAP)

```ts
import { gsap } from 'gsap';

const text = new SplitBitmapText({
  text: 'Split and Animate',
  style: { fontFamily: 'Game Font', fontSize: 48 },
});

app.stage.addChild(text);

// Animate characters one by one
text.chars.forEach((char, i) => {
  gsap.from(char, {
    alpha: 0,
    delay: i * 0.05,
  });
});

// Animate words with scaling
text.words.forEach((word, i) => {
  gsap.to(word.scale, {
    x: 1.2,
    y: 1.2,
    yoyo: true,
    repeat: -1,
    delay: i * 0.2,
  });
});
```

---

## Creating from Existing Text

Convert existing text objects into segmented versions:

```ts
import { Text, SplitText, BitmapText, SplitBitmapText } from 'pixi.js';

const basicText = new Text({
  text: 'Standard Text',
  style: { fontSize: 32 },
});
const splitText = SplitText.from(basicText);

const bitmapText = new BitmapText({
  text: 'Bitmap Example',
  style: { fontFamily: 'Game Font', fontSize: 32 },
});
const splitBitmap = SplitBitmapText.from(bitmapText);
```

---

## Configuration Options

Shared options for both classes:

| Option       | Description                                         | Default    |
| ------------ | --------------------------------------------------- | ---------- |
| `text`       | String content to render and split                  | _Required_ |
| `style`      | Text style configuration (varies by text type)      | `{}`       |
| `autoSplit`  | Auto-update segments when text or style changes     | `true`     |
| `lineAnchor` | Anchor for line containers (`number` or `{x, y}`)   | `0`        |
| `wordAnchor` | Anchor for word containers (`number` or `{x, y}`)   | `0`        |
| `charAnchor` | Anchor for character objects (`number` or `{x, y}`) | `0`        |

---

## Global Defaults

Change global defaults for each class:

```ts
SplitText.defaultOptions = {
  lineAnchor: 0.5,
  wordAnchor: { x: 0, y: 0.5 },
  charAnchor: { x: 0.5, y: 1 },
};

SplitBitmapText.defaultOptions = {
  autoSplit: false,
};
```

---

## Limitations

⚠️ **Character Spacing:**
Splitting text into individual objects removes browser or font kerning. Expect slight differences in spacing compared to standard `Text`.

---

## Performance Notes

Splitting text creates additional display objects. For simple static text, a regular `Text` object is more efficient. Use `SplitText` when you need:

- Per-segment animations
- Interactive or responsive text effects
- Complex layouts

The same performance limitations outlined [here](./index.md) apply for these classes as well.

---

## API Reference

- [Text](https://pixijs.download/release/docs/scene.Text.html)
- [TextStyle](https://pixijs.download/release/docs/text.TextStyle.html)
- [BitmapFont](https://pixijs.download/release/docs/text.BitmapFont.html)
- [SplitText](https://pixijs.download/release/docs/text.SplitText.html)
- [SplitBitmapText](https://pixijs.download/release/docs/text.SplitBitmapText.html)
