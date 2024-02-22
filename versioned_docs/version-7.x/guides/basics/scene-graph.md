# Scene Graph

Every frame, PixiJS is updating and then rendering the scene graph.  Let's talk about what's in the scene graph, and how it impacts how you develop your project.  If you've built games before, this should all sound very familiar, but if you're coming from HTML and the DOM, it's worth understanding before we get into specific types of objects you can render.

## The Scene Graph Is a Tree

The scene graph's root node is a container maintained by the application, and referenced with `app.stage`.  When you add a sprite or other renderable object as a child to the stage, it's added to the scene graph and will be rendered and interactable.  Most PixiJS objects can also have children, and so as you build more complex scenes, you will end up with a tree of parent-child relationships, rooted at the app's stage.

(A helpful tool for exploring your project is the [Pixi.js devtools plugin](https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon) for Chrome, which allows you to view and manipulate the scene graph in real time as it's running!)

## Parents and Children

When a parent moves, its children move as well.  When a parent is rotated, its children are rotated too.  Hide a parent, and the children will also be hidden.  If you have a game object that's made up of multiple sprites, you can collect them under a container to treat them as a single object in the world, moving and rotating as one.

<!--TODO: verify this - vaguely remember caching of e.g. transforms to prevent having to run tree each frame?-->

Each frame, PixiJS runs through the scene graph from the root down through all the children to the leaves to calculate each object's final position, rotation, visibility, transparency, etc.  If a parent's alpha is set to 0.5 (making it 50% transparent), all its children will start at 50% transparent as well.  If a child is then set to 0.5 alpha, it won't be 50% transparent, it will be 0.5 x 0.5 = 0.25 alpha, or 75% transparent.  Similarly, an object's position is relative to its parent, so if a parent is set to an x position of 50 pixels, and the child is set to an x position of 100 pixels, it will be drawn at a screen offset of 150 pixels, or 50 + 100.

Here's an example.  We'll create three sprites, each a child of the last, and animate their position, rotation, scale and alpha.  Even though each sprite's properties are set to the same values, the parent-child chain amplifies each change:

```javascript
// Create the application helper and add its render target to the page
const app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Add a container to center our sprite stack on the page
const container = new PIXI.Container();
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;
app.stage.addChild(container);

// Create the 3 sprites, each a child of the last
const sprites = [];
let parent = container;
for (let i = 0; i < 3; i++) {
  let sprite = PIXI.Sprite.from('assets/images/sample.png');
  sprite.anchor.set(0.5);
  parent.addChild(sprite);
  sprites.push(sprite);
  parent = sprite;
}

// Set all sprite's properties to the same value, animated over time
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta / 60;
  const amount = Math.sin(elapsed);
  const scale = 1.0 + 0.25 * amount;
  const alpha = 0.75 + 0.25 * amount;
  const angle = 40 * amount;
  const x = 75 * amount;
  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    sprite.scale.set(scale);
    sprite.alpha = alpha;
    sprite.angle = angle;
    sprite.x = x;
  }
});
```

The cumulative translation, rotation, scale and skew of any given node in the scene graph is stored in the object's `worldTransform` property.  Similarly, the cumulative alpha value is stored in the `worldAlpha` property.

## Render Order

So we have a tree of things to draw.  Who gets drawn first?

PixiJS renders the tree from the root down.  At each level, the current object is rendered, then each child is rendered in order of insertion.  So the second child is rendered on top of the first child, and the third over the second.

Check out this example, with two parent objects A & D, and two children B & C under A:

```javascript
// Create the application helper and add its render target to the page
const app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Label showing scene graph hierarchy
const label = new PIXI.Text('Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D', {fill: '#ffffff'});
label.position = {x: 300, y: 100};
app.stage.addChild(label);

// Helper function to create a block of color with a letter
const letters = [];
function addLetter(letter, parent, color, pos) {
  const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
  bg.width = 100;
  bg.height = 100;
  bg.tint = color;

  const text = new PIXI.Text(letter, {fill: "#ffffff"});
  text.anchor.set(0.5);
  text.position = {x: 50, y: 50};

  const container = new PIXI.Container();
  container.position = pos;
  container.visible = false;
  container.addChild(bg, text);
  parent.addChild(container);

  letters.push(container);
  return container;
}

// Define 4 letters
let a = addLetter('A', app.stage, 0xff0000, {x: 100, y: 100});
let b = addLetter('B', a,         0x00ff00, {x: 20,  y: 20});
let c = addLetter('C', a,         0x0000ff, {x: 20,  y: 40});
let d = addLetter('D', app.stage, 0xff8800, {x: 140, y: 100});

// Display them over time, in order
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta / 60.0;
  if (elapsed >= letters.length) { elapsed = 0.0; }
  for (let i = 0; i < letters.length; i ++) {
    letters[i].visible = elapsed >= i;
  }
});
```

If you'd like to re-order a child object, you can use `setChildIndex()`.  To add a child at a given point in a parent's list, use `addChildAt()`.  Finally, you can enable automatic sorting of an object's children using the `sortableChildren` option combined with setting the `zIndex` property on each child.

## Culling

If you're building a project where a large proportion of your DisplayObject's are off-screen (say, a side-scrolling game), you will want to *cull* those objects.  Culling is the process of evaluating if an object (or its children!) is on the screen, and if not, turning off rendering for it.  If you don't cull off-screen objects, the renderer will still draw them, even though none of their pixels end up on the screen.  

PixiJS doesn't provide built-in support for viewport culling, but you can find 3rd party plugins that might fit your needs.  Alternately, if you'd like to build your own culling system, simply run your objects during each tick and set `renderable` to false on any object that doesn't need to be drawn.

## Local vs Global Coordinates

If you add a sprite to the stage, by default it will show up in the top left corner of the screen.  That's the origin of the global coordinate space used by PixiJS.  If all your objects were children of the stage, that's the only coordinates you'd need to worry about.  But once you introduce containers and children, things get more complicated.  A child object at [50, 100] is 50 pixels right and 100 pixels down *from its parent*.

We call these two coordinate systems "global" and "local" coordinates.  When you use `position.set(x, y)` on an object, you're always working in local coordinates, relative to the object's parent.

The problem is, there are many times when you want to know the global position of an object.  For example, if you want to cull offscreen objects to save render time, you need to know if a given child is outside the view rectangle.

To convert from local to global coordinates, you use the `toGlobal()` function.  Here's a sample usage:

```javascript
// Get the global position of an object, relative to the top-left of the screen
let globalPos = obj.toGlobal(new PIXI.Point(0,0));
```

This snippet will set `globalPos` to be the global coordinates for the child object, relative to [0, 0] in the global coordinate system.

## Global vs Screen Coordinates

When your project is working with the host operating system or browser, there is a third coordinate system that comes into play - "screen" coordinates (aka "viewport" coordinates).  Screen coordinates represent position relative to the top-left of the canvas element that PixiJS is rendering into.  Things like the DOM and native mouse click events work in screen space.  

Now, in many cases, screen space is equivalent to world space.  This is the case if the size of the canvas is the same as the size of the render view specified when you create you PIXI.Application.  By default, this will be the case - you'll create for example an 800x600 application window and add it to your HTML page, and it will stay that size.  100 pixels in world coordinates will equal 100 pixels in screen space.  BUT!  It is common to stretch the rendered view to have it fill the screen, or to render at a lower resolution and up-scale for speed.  In that case, the screen size of the canvas element will change (e.g. via CSS), but the underlying render view will *not*, resulting in a mis-match between world coordinates and screen coordinates.

<!--TODO: best method to convert from world to screen coords?-->
