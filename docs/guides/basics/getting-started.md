# Getting Started

In this section we're going to build the simplest possible PixiJS application.  In doing so, we'll walk through the basics of how to build and serve the code.

### Advanced Users

A quick note before we start: this guide is aimed at beginning PixiJS developers who have minimal
experience developing JavaScript-based applications.  If you are a coding veteran, you may find that
the level of detail here is not helpful. If that's the case, you may want to skim this guide, then
jump into [how to work with PixiJS and packers](#TODO) like webpack and npm.

### A Note About JavaScript

One final note.  The JavaScript universe is currently in transition from old-school JavaScript (ES5) to the newer ES6 flavor:

```javascript
// ES5
var x = 5;
setTimeout(function() { alert(x); }, 1000);
// ES6
const x = 5;
setTimeout(() => alert(x), 1000);
```

ES6 brings a number of major advantages in terms of clearer syntax, better variable scoping, native class support, etc.  By now, all major browsers support it.  Given this, our examples in these guides will use ES6.  This doesn't mean you can't use PixiJS with ES5 programs!  Just mentally substitute "var" for "let/const", expand the shorter function-passing syntax, and everything will run just fine.

### Components of a PixiJS Application

OK!  With those notes out of the way, let's get started.  There are only a few steps required to write a PixiJS application:

* Create an HTML file
* Serve the file with a web server
* Load the PixiJS library
* Create an [Application](https://pixijs.download/release/docs/app.Application.html)
* Add the generated view to the DOM
* Add an image to the stage
* Write an update loop

Let's walk through them together.

### The HTML File

PixiJS is a JavaScript library that runs in a web page.  So the first thing we're going to need is some HTML in a file.  In a real PixiJS application, you might want to embed your display within a complex existing page, or you might want your display area to fill the whole page.  For this demo, we'll build an empty page to start:

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <h1>Hello PixiJS</h1>
  </body>
</html>
```

Create a new folder named `pixi-test`, then copy and paste this HTML into a new file in the `pixi-test` folder named `index.html`.

### Serving the File

You will need to run a web server to develop locally with PixiJS.  Web browsers prevent loading local files (such as images and audio files) on locally loaded web pages.  If you just double-click your new HTML file, you'll get an error when you try to add a sprite to the PixiJS stage.

Running a web server sounds complex and difficult, but it turns out there are a number of simple web servers that will serve this purpose.  For this guide, we're going to be working with [Mongoose](https://mongoose.ws), but you could just as easily use [XAMPP](https://www.apachefriends.org/download.html) or the [http-server Node.js package](https://www.npmjs.com/package/http-server) to serve your files.

To start serving your page with Mongoose, go to [the Mongoose download page](https://mongoose.ws) and download the free server for your operating system.   Mongoose defaults to serving the files in the folder it's run in, so copy the downloaded executable into the folder you created in the prior step (`pixi-test`).  Double-click the executable, tell your operating system that you trust the file to run, and you'll have a running web server, serving your new folder.

Test that everything is working by opening your browser of choice and entering `http://127.0.0.1:8080` in the location bar.  (Mongoose by default serves files on port 8080.)  You should see "Hello PixiJS" and nothing else.  If you get an error at this step, it means you didn't name your file `index.html` or you mis-configured your web server.

### Loading PixiJS

OK, so we have a web page, and we're serving it.  But it's empty.  The next step is to actually load the PixiJS library.  If we were building a real application, we'd want to download a target version of PixiJS from the [Pixi Github repo](https://github.com/pixijs/pixijs) so that our version wouldn't change on us.  But for this sample application, we'll just use the CDN version of PixiJS.  Add this line to the `<head>` section of your `index.html` file:

```html
<script src="https://pixijs.download/release/pixi.js"></script>
```

This will include a *non-minified* version of the latest version of PixiJS when your page loads, ready to be used.  We use the non-minified version because we're in development.  In production, you'd want to use `pixi.min.js` instead, which is compressed for faster download and excludes assertions and deprecation warnings that can help when building your project, but take longer to download and run.

### Creating an Application

Loading the library doesn't do much good if we don't *use* it, so the next step is to start up PixiJS.  Start by replacing the line `<h1>Hello PixiJS</h1>` with a script tag like so:

```html
<script type="module">
  const app = new PIXI.Application();
  await app.init({ width: 640, height: 360 });
</script>
```

What we're doing here is adding a JavaScript code block, and in that block creating a new PIXI.Application instance. [Application](https://pixijs.download/release/docs/app.Application.html) is a helper class that simplifies working with PixiJS.  It creates the renderer, creates the stage, and starts a ticker for updating.  In production, you'll almost certainly want to do these steps yourself for added customization and control - we'll cover doing so in a later guide.  For now, the Application class is a perfect way to start playing with PixiJS without worrying about the details. The `Application` class also has a method `init` that will initialize the application with the given options. This method is asynchronous, so we use the `await` keyword to start our logic after the promise has completed. This is because PixiJS uses WebGPU or WebGL under the hood, and the former API asynchronous.

### Adding the Canvas to the DOM

When the PIXI.Application class creates the renderer, it builds a Canvas element that it will render *to*.  In order to see what we draw with PixiJS, we need to add this Canvas element to the web page's DOM.  Append the following line to your page's script block:

```javascript
  document.body.appendChild(app.canvas);
```

This takes the canvas created by the application (the Canvas element) and adds it to the body of your page.

### Creating a Sprite

So far all we've been doing is prep work.  We haven't actually told PixiJS to draw anything.  Let's fix that by adding an image to be displayed.

There are a number of ways to draw images in PixiJS, but the simplest is by using a [Sprite](https://pixijs.download/release/docs/scene.Sprite.html).  We'll get into the details of how the scene graph works in a later guide, but for now all you need to know is that PixiJS renders a hierarchy of [Containers](https://pixijs.download/release/docs/scene.Container.html).  A Sprite is a type of Container that wraps a loaded image resource to allow drawing it, scaling it, rotating it, and so forth.

Before PixiJS can render an image, it needs to be loaded.  Just like in any web page, image loading happens asynchronously.  We'll talk a lot more about resource loading in later guides.  For now, we can use a helper method on the PIXI.Sprite class to handle the image loading for us:

```javascript
  // load the PNG asynchronously
  await PIXI.Assets.load('sample.png');
  let sprite = PIXI.Sprite.from('sample.png');
```

[Download the sample PNG here](/images/sample.png), and save it into your `pixi-test` directory next to your `index.html`.

### Adding the Sprite to the Stage

Finally, we need to add our new sprite to the stage.  The stage is simply a [Container](https://pixijs.download/release/docs/scene.Container.html) that is the root of the scene graph.  Every child of the stage container will be rendered every frame.  By adding our sprite to the stage, we tell PixiJS's renderer we want to draw it.

```javascript
  app.stage.addChild(sprite);
```

### Writing an Update Loop

While you _can_ use PixiJS for static content, for most projects you'll want to add animation.  Our sample app is actually cranking away, rendering the same sprite in the same place multiple times a second.  All we have to do to make the image move is to update its attributes once per frame.  To do this, we want to hook into the application's _ticker_.  A ticker is a PixiJS object that runs one or more callbacks each frame.  Doing so is surprisingly easy.  Add the following to the end of your script block:

```javascript
  // Add a variable to count up the seconds our demo has been running
  let elapsed = 0.0;
  // Tell our application's ticker to run a new callback every frame, passing
  // in the amount of time that has passed since the last tick
  app.ticker.add((ticker) => {
    // Add the time to our total elapsed time
    elapsed += ticker.deltaTime;
    // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    // by 50 to slow the animation down a bit...
    sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
  });
```

All you need to do is to call `app.ticker.add(...)`, pass it a callback function, and then update your scene in that function.  It will get called every frame, and you can move, rotate etc. whatever you'd like to drive your project's animations.

### Putting It All Together

That's it!  The simplest PixiJS project!

Here's the whole thing in one place.  Check your file and make sure it matches if you're getting errors.

```html
<!doctype html>
<html>
  <head>
    <script src="https://pixijs.download/release/pixi.min.js"></script>
  </head>
  <body>
    <script type="module">
      // Create the application helper and add its render target to the page
      const app = new PIXI.Application();
      await app.init({ width: 640, height: 360 })
      document.body.appendChild(app.canvas);

      // Create the sprite and add it to the stage
      await PIXI.Assets.load('sample.png');
      let sprite = PIXI.Sprite.from('sample.png');
      app.stage.addChild(sprite);

      // Add a ticker callback to move the sprite back and forth
      let elapsed = 0.0;
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime;
        sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
      });
    </script>
  </body>
</html>
```

Once you have things working, the next thing to do is to read through the rest of the Basics guides to dig into how all this works in much greater depth.
