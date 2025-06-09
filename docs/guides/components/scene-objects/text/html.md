---
sidebar_position: 2
description: Learn how to use HTMLText in PixiJS to render styled HTML strings within your WebGL canvas, enabling complex typography and inline formatting.
---

# HTML Text

`HTMLText` enables styled, formatted HTML strings to be rendered as part of the PixiJS scene graph. It uses an SVG `<foreignObject>` to embed browser-native HTML inside your WebGL canvas.

This makes it ideal for rendering complex typography, inline formatting, emojis, and layout effects that are hard to replicate using traditional canvas-rendered text.

```ts
import { HTMLText } from 'pixi.js';

const html = new HTMLText({
    text: '<strong>Hello</strong> <em>PixiJS</em>!',
    style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ff1010',
        align: 'center',
    },
});

app.stage.addChild(html);
```

## **Why Use `HTMLText`?**

- ✅ Supports inline tags like `<b>`, `<i>`, `<span>`, etc.
- ✅ Compatible with emojis, Unicode, and RTL text
- ✅ Fine-grained layout control via CSS
- ✅ Tag-based style overrides (`<warning>`, `<link>`, etc.)

## **Async Rendering Behavior**

HTML text uses SVG `<foreignObject>` to draw HTML inside the canvas. As a result:

- Rendering occurs **asynchronously**. Typically after the next frame.
- Text content is not immediately visible after instantiation.

## **Styling HTMLText**

`HTMLTextStyle` extends `TextStyle` and adds:

- **HTML-aware tag-based styles** via `tagStyles`
- **CSS override support** via `cssOverrides`

```ts
const fancy = new HTMLText({
    text: '<red>Red</red>, <blue>Blue</blue>',
    style: {
        fontFamily: 'DM Sans',
        fontSize: 32,
        fill: '#ffffff',
        tagStyles: {
            red: { fill: 'red' },
            blue: { fill: 'blue' },
        },
    },
});
```

### **CSS Overrides**

You can apply CSS styles to the text using the `cssOverrides` property. This allows you to set properties like `text-shadow`, `text-decoration`, and more.

```ts
fancy.style.addOverride('text-shadow: 2px 2px 4px rgba(0,0,0,0.5)');
```

---

## **API Reference**

- [HTMLText](https://pixijs.download/release/docs/scene.HTMLText.html)
- [HTMLTextStyle](https://pixijs.download/release/docs/text.HTMLTextStyle.html)
