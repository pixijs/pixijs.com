# Text

Whether it's a high score or a diagram label, text is often the best way to convey information in your projects.  Surprisingly, drawing text to the screen with WebGL is a very complex process - there's no built in support for it at all.  One of the values PixiJS provides is in hiding this complexity to allow you to draw text in diverse styles, fonts and colors with a few lines of code.  In addition, these bits of text are just as much scene objects as sprites - you can tint text, rotate it, alpha-blend it, and otherwise treat it like any other graphical object.

Let's dig into how this works.

## There Are Two Kinds of Text

Because of the challenges of working with text in WebGL, PixiJS provides two very different solutions.  In this guide, we're going to go over both methods in some detail to help you make the right choice for your project's needs.  Selecting the wrong text type can have a large negative impact on your project's performance and appearance.

## The Text Object

In order to draw text to the screen, you use a [Text](https://pixijs.download/release/docs/PIXI.Text.html) object.  Under the hood, this class draws text to an off-screen buffer using the browser's normal text rendering, then uses that offscreen buffer as the source for drawing the text object.  Effectively what this means is that whenever you create or change text, PixiJS creates a new rasterized image of that text, and then treats it like a sprite.  This approach allows truly rich text display while keeping rendering speed high.

So when working with PIXI.Text objects, there are two sets of options - standard display object options like position, rotation, etc that work *after* the text is rasterized internally, and text style options that are used *while* rasterizing.  Because text once rendered is basically just a sprite, there's no need to review the standard options.  Instead, let's focus on how text is styled.

Check out the [text example code](/examples/text/pixi-text).

## Text Styles

There are a lot of text style options available (see [TextStyle](https://pixijs.download/release/docs/PIXI.TextStyle.html)), but they break down into 5 main groups:

**Font**: `fontFamily` to select the webfont to use, `fontSize` to specify the size of the text to draw, along with options for font weight, style and variant.

**Appearance**: Set the color with `fill` or add a `stroke` outline, including options for gradient fills.

**Drop-Shadows**: Set a drop-shadow with `dropShadow`, with a host of related options to specify offset, blur, opacity, etc.

**Layout**: Enable with `wordWrap` and `wordWrapWidth`, and then customize the `lineHeight` and `align` or `letterSpacing`

**Utilities**: Add `padding` or `trim` extra space to deal with funky font families if needed.

To interactively test out feature of Text Style, [check out this tool](https://pixijs.io/pixi-text-style/).

## Loading and Using Fonts

In order for PixiJS to build a PIXI.Text object, you'll need to make sure that the font you want to use is loaded by the browser.  Unfortunately, at the time of writing, the PIXI.Loader system does not support loading font files, so you'll need to use a 3rd party font loader to ensure that any custom web fonts you want to use are pre-loaded.  It's not enough to add an @font-face declaration in your project's CSS because browsers will happily render text using a fallback font while your custom font loads.

Any javascript library that can load a web font will work, you just want something that will delay starting your project until the font has been fully loaded by the browser.

One such library is [FontFaceObserver](https://fontfaceobserver.com).  Here's a simple example that shows how to use it to ensure the web font "Short Stack" is loaded before your app starts.  First, we need a font-face declaration in CSS:

```css
@font-face {
  font-family: Short Stack;
  src: url(short-stack.woff2) format('woff2'),
       url(short-stack.woff) format('woff');
}
```

Now that the browser knows what our font is and how to find the source files, it's time to use the library to load them:

```javascript
// Create the loader
let font = new FontFaceObserver('Short Stack', {});
// Start loading the font
font.load().then(() => {
  // Successful load, start up your PixiJS app as usual
  let app = new PIXI.Application({ width: 640, height: 360 });
  document.body.appendChild(app.view);
  // ... etc ...

}, () => {
  // Failed load, log the error or display a message to the user
  alert('Unable to load required font!');
});
```

## Caveats and Gotchas

While PixiJS does make working with text easy, there are a few things you need to watch out for.

First, changing an existing text string requires re-generating the internal render of that text, which is a slow operation that can impact performance if you change many text objects each frame.  If your project requires lots of frequently changing text on the screen at once, consider using a PIXI.BitmapText object (explained below) which uses a fixed bitmap font that doesn't require re-generation when text changes.

Second, be careful when scaling text.  Setting a text object's scale to > 1.0 will result in blurry/pixely display, because the text is not re-rendered at the higher resolution needed to look sharp - it's still the same resolution it was when generated.  To deal with this, you can render at a higher initial size and down-scale, instead.  This will use more memory, but will allow your text to always look clear and crisp.

## BitmapText

In addition to the standard PIXI.Text approach to adding text to your project, PixiJS also supports *bitmap fonts*.  Bitmap fonts are very different from TrueType or other general purpose fonts, in that they consist of a single image containing pre-rendered versions of every letter you want to use.  When drawing text with a bitmap font, PixiJS doesn't need to render the font glyphs into a temporary buffer - it can simply copy and stamp out each character of a string from the master font image.

The primary advantage of this approach is speed - changing text frequently is much cheaper and rendering each additional piece of text is much faster due to the shared source texture.

Check out the [bitmap text example code](/examples/text/bitmap-text).

## BitmapFont

- 3rd party solutions
- BitmapFont.from auto-generation

## Selecting the Right Approach

PIXI.Text
- Static text
- Small number of text objects
- High fidelity text rendering (kerning e.g.)
- Text layout (line & letter spacing)

PIXI.BitmapText
- Dynamic text
- Large number of text objects
- Lower memory

<!--## Other options

WebGL-only glyph rendering (SDF text)
DOM-based overlays ()-->
