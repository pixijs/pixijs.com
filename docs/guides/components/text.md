# Text

Whether it's a high score or a diagram label, text is often the best way to convey information in your projects.  Surprisingly, drawing text to the screen with WebGL is a very complex process - there's no built in support for it at all.  One of the values PixiJS provides is in hiding this complexity to allow you to draw text in diverse styles, fonts and colors with a few lines of code.  In addition, these bits of text are just as much scene objects as sprites - you can tint text, rotate it, alpha-blend it, and otherwise treat it like any other graphical object.

Let's dig into how this works.

## There Are Three Kinds of Text

Because of the challenges of working with text in WebGL, PixiJS provides three very different solutions.  In this guide, we're going to go over both methods in some detail to help you make the right choice for your project's needs.  Selecting the wrong text type can have a large negative impact on your project's performance and appearance.

## The Text Object

In order to draw text to the screen, you use a [Text](https://pixijs.download/release/docs/scene.Text.html) object.  Under the hood, this class draws text to an off-screen buffer using the browser's normal text rendering, then uses that offscreen buffer as the source for drawing the text object.  Effectively what this means is that whenever you create or change text, PixiJS creates a new rasterized image of that text, and then treats it like a sprite.  This approach allows truly rich text display while keeping rendering speed high.

So when working with Text objects, there are two sets of options - standard display object options like position, rotation, etc that work *after* the text is rasterized internally, and text style options that are used *while* rasterizing.  Because text once rendered is basically just a sprite, there's no need to review the standard options.  Instead, let's focus on how text is styled.

Check out the [text example code](../../examples/text/pixi-text).

## Text Styles

There are a lot of text style options available (see [TextStyle](https://pixijs.download/release/docs/text.TextStyle.html)), but they break down into 5 main groups:

**Font**: `fontFamily` to select the webfont to use, `fontSize` to specify the size of the text to draw, along with options for font weight, style and variant.

**Appearance**: Set the color with `fill` or add a `stroke` outline, including options for gradient fills. For more information on the `fill` property, see the [Graphics Fill](./graphics-fill) guide.


**Drop-Shadows**: Set a drop-shadow with `dropShadow`, with a host of related options to specify offset, blur, opacity, etc.

**Layout**: Enable with `wordWrap` and `wordWrapWidth`, and then customize the `lineHeight` and `align` or `letterSpacing`

**Utilities**: Add `padding` or `trim` extra space to deal with funky font families if needed.

To interactively test out feature of Text Style, [check out this tool](https://text-style.pixijs.io/).

## Loading and Using Fonts

In order for PixiJS to build a Text object, you'll need to make sure that the font you want to use is loaded by the browser. This can be easily accomplished with our good friends `Assets`

```ts
// load the fonts
await Assets.load('short-stack.woff2');

// now they can be used!

const text = new Text({
  text:'hello',
  style:{
    fontFamily:'short-stack'
  }
})
```

## Caveats and Gotchas

While PixiJS does make working with text easy, there are a few things you need to watch out for.

First, changing an existing text string requires re-generating the internal render of that text, which is a slow operation that can impact performance if you change many text objects each frame.  If your project requires lots of frequently changing text on the screen at once, consider using a BitmapText object (explained below) which uses a fixed bitmap font that doesn't require re-generation when text changes.

Second, be careful when scaling text.  Setting a text object's scale to > 1.0 will result in blurry/pixely display, because the text is not re-rendered at the higher resolution needed to look sharp - it's still the same resolution it was when generated.  To deal with this, you can render at a higher initial size and down-scale, instead.  This will use more memory, but will allow your text to always look clear and crisp.

## BitmapText

In addition to the standard Text approach to adding text to your project, PixiJS also supports *bitmap fonts*.  Bitmap fonts are very different from TrueType or other general purpose fonts, in that they consist of a single image containing pre-rendered versions of every letter you want to use.  When drawing text with a bitmap font, PixiJS doesn't need to render the font glyphs into a temporary buffer - it can simply copy and stamp out each character of a string from the master font image.

The primary advantage of this approach is speed - changing text frequently is much cheaper and rendering each additional piece of text is much faster due to the shared source texture.

Check out the [bitmap text example code](../../examples/text/bitmap-text).

## BitmapFont

- 3rd party solutions
- BitmapFont.from auto-generation

## Selecting the Right Approach

Text
- Static text
- Small number of text objects
- High fidelity text rendering (kerning e.g.)
- Text layout (line & letter spacing)

BitmapText
- Dynamic text
- Large number of text objects
- Lower memory

HTMLText
- Static text
- Need that HTML formatting

<!--## Other options

WebGL-only glyph rendering (SDF text)
DOM-based overlays ()-->
