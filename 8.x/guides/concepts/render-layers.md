# Render Layers

The PixiJS Layer API provides a powerful way to control the **rendering order** of objects independently of their **logical parent-child relationships** in the scene graph. With RenderLayers, you can decouple how objects are transformed (via their logical parent) from how they are visually drawn on the screen.

Using RenderLayers ensures these elements are visually prioritized while maintaining logical parent-child relationships. Examples include:

- A character with a health bar: Ensure the health bar always appears on top of the world, even if the character moves behind an object.

- UI elements like score counters or notifications: Keep them visible regardless of the game world’s complexity.

- Highlighting Elements in Tutorials: Imagine a tutorial where you need to push back most game elements while highlighting a specific object. RenderLayers can split these visually. The highlighted object can be placed in a foreground layer to be rendered above a push back layer.

This guide explains the key concepts, provides practical examples, and highlights common gotchas to help you use the Layer API effectively.

---

### **Key Concepts**

1. **Independent Rendering Order**:

   - RenderLayers allow control of the draw order independently of the logical hierarchy, ensuring objects are rendered in the desired order.

2. **Logical Parenting Stays Intact**:

   - Objects maintain transformations (e.g., position, scale, rotation) from their logical parent, even when attached to RenderLayers.

3. **Explicit Object Management**:

   - Objects must be manually reassigned to a layer after being removed from the scene graph or layer, ensuring deliberate control over rendering.

4. **Dynamic Sorting**:

   - Within layers, objects can be dynamically reordered using `zIndex` and `sortChildren` for fine-grained control of rendering order.

---

### **Basic API Usage**

First lets create two items that we want to render, red guy and blue guy.

```typescript
const redGuy = new PIXI.Sprite('red guy');
redGuy.tint = 0xff0000;

const blueGuy = new PIXI.Sprite('blue guy');
blueGuy.tint = 0x0000ff;

stage.addChild(redGuy, blueGuy);
```

![alt text](render-layers/image-1.png)

Now we know that red guy will be rendered first, then blue guy. Now in this simple example you could get away with just sorting the `zIndex` of the red guy and blue guy to help reorder.

But this is a guide about render layers, so lets create one of those.

Use `renderLayer.attach` to assign an object to a layer. This overrides the object’s default render order defined by its logical parent.

```typescript
// a layer..
const layer = new RenderLayer();
stage.addChild(layer);
layer.attach(redGuy);
```

![alt text](render-layers/image-2.png)

So now our scene graph order is:

```
|- stage
    |-- redGuy
    |-- blueGuy
    |-- layer
```

And our render order is:

```
|- stage
    |-- blueGuy
    |-- layer
        |-- redGuy

```

This happens because the layer is now the last child in the stage. Since the red guy is attached to the layer, it will be rendered at the layer's position in the scene graph. However, it still logically remains in the same place in the scene hierarchy.

#### **3. Removing Objects from a Layer**

Now let's remove the red guy from the layer. To stop an object from being rendered in a layer, use `removeFromLayer`. Once removed from the layer, its still going to be in the scene graph, and will be rendered in its scene graph order.

```typescript
layer.detach(redGuy); //  Stop rendering the rect via the layer
```

![alt text](render-layers/image-1.png)

Removing an object from its logical parent (`removeChild`) automatically removes it from the layer.

```typescript
stage.removeChild(redGuy); // if the red guy was removed from the stage, it will also be removed from the layer
```

![alt text](render-layers/image-3.png)

However, if you remove the red guy from the stage and then add it back to the stage, it will not be added to the layer again.

```typescript
// add red guy to his original position
stage.addChildAt(redGuy, 0);
```

![alt text](render-layers/image-1.png)

You will need to reattach it to the layer yourself.

```typescript
layer.attach(redGuy); // re attach it to the layer again!
```

![alt text](render-layers/image-2.png)

This may seem like a pain, but it's actually a good thing. It means that you have full control over the render order of the object, and you can change it at any time. It also means you can't accidentally add an object to a container and have it automatically re-attach to a layer that may or may not still be around - it would be quite confusing and lead to some very hard to debug bugs!

#### **5. Layer Position in Scene Graph**

The layer’s position in the scene graph determines its render priority relative to other layers and objects.

```typescript
// reparent the layer to render first in the stage
stage.addChildAt(layer, 0);
```

## ![alt text](render-layers/image-1.png)

### **Complete Example**

Here’s a real-world example that shows how to use RenderLayers to set ap player ui on top of the world.

```ts
import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  RenderLayer,
  Sprite,
  TilingSprite,
} from 'pixi.js';
import { Fish } from './Fish';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ width: 630, height: 410, antialias: true });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);
  // move the canvas to the center of the screen
  app.canvas.style.position = 'absolute';
  app.canvas.style.top = `${window.innerHeight / 2 - app.canvas.height / 2}px`;
  app.canvas.style.left = `${window.innerWidth / 2 - app.canvas.width / 2}px`;

  // Load textures
  await Assets.load([
    `https://pixijs.com/assets/pond/displacement_BG.jpg`,
    `https://pixijs.com/assets/pond/overlay.png`,
    `https://pixijs.com/assets/pond/displacement_map.png`,
    `https://pixijs.com/assets/pond/displacement_fish1.png`,
    `https://pixijs.com/assets/pond/displacement_fish2.png`,
  ]);

  const background = Sprite.from(
    'https://pixijs.com/assets/pond/displacement_BG.jpg',
  );

  const pondContainer = new Container();

  pondContainer.addChild(background);

  app.stage.addChild(pondContainer);

  const displacementMap = Assets.get(
    'https://pixijs.com/assets/pond/displacement_map.png',
  );

  displacementMap.source.wrapMode = 'repeat';

  const displacementSprite = Sprite.from(displacementMap);
  const displacementFilter = new DisplacementFilter(displacementSprite, 40);

  pondContainer.addChild(displacementSprite);
  pondContainer.filters = [displacementFilter];

  const uiLayer = new RenderLayer();

  const fishes = [];

  const names = [
    'Alice',
    'Bob',
    'Caroline',
    'David',
    'Ellie',
    'Frank',
    'Gloria',
    'Henry',
    'Isabel',
    'Jack',
  ];
  const textures = [
    Assets.get('https://pixijs.com/assets/pond/displacement_fish1.png'),
    Assets.get('https://pixijs.com/assets/pond/displacement_fish2.png'),
  ];

  for (let i = 0; i < 10; i++) {
    const fish = new Fish(
      names[i % names.length],
      textures[i % textures.length],
    );

    fishes.push(fish);
    pondContainer.addChild(fish);

    fish.x = Math.random() * 630;
    fish.y = Math.random() * 410;

    uiLayer.attach(fish.ui);
  }

  const waterOverlay = TilingSprite.from(
    Assets.get('https://pixijs.com/assets/pond/overlay.png'),
  );

  waterOverlay.width = 630;
  waterOverlay.height = 410;

  pondContainer.addChild(waterOverlay);

  app.stage.addChild(uiLayer);

  // Animate the mask
  app.ticker.add(() => {
    waterOverlay.tilePosition.x += 0.5;
    waterOverlay.tilePosition.y += 0.5;

    displacementSprite.x += 0.5;
    displacementSprite.y += 0.5;

    fishes.forEach((fish) => fish.update());
  });
})();
```

```ts
import { Container, Sprite } from 'pixi.js';
import { CharacterUI } from './CharacterUI';

export class Fish extends Container {
  ui;
  _speed = 1 + Number(Math.random());
  _direction = Math.random() * Math.PI * 2;
  fishView;

  constructor(name, texture) {
    super();

    this.fishView = new Sprite(texture);

    this.fishView.anchor.set(0.5);

    this.addChild(this.fishView);

    this.ui = new CharacterUI(name, 20);
    this.ui.y = 0;
    this.addChild(this.ui);
  }

  update() {
    this._direction += 0.001;

    this.fishView.rotation = Math.PI - this._direction;
    this.x += this._speed * Math.cos(-this._direction);
    this.y += this._speed * Math.sin(-this._direction);

    // wrap around the screen
    const padding = 100;
    const width = 630;
    const height = 410;

    if (this.x > width + padding) this.x -= width + padding * 2;
    if (this.x < -padding) this.x += width + padding * 2;
    if (this.y > height + padding) this.y -= height + padding * 2;
    if (this.y < -padding) this.y += height + padding * 2;
  }
}
```

```ts
import { Container, Graphics, Text } from 'pixi.js';

export class CharacterUI extends Container {
  constructor(name, age) {
    super();

    const label = new Text({
      text: name,
      resolution: 2,
      style: { fontSize: 16, fill: 0x000000 },
      anchor: 0.5,
    });

    const padding = 10;

    const bg = new Graphics()
      .roundRect(
        -label.width / 2 - padding,
        -label.height / 2 - padding,
        label.width + padding * 2,
        label.height + padding * 2,
        20,
      )
      .fill({
        color: 0xffff00,
        alpha: 1,
      });

    this.addChild(bg, label);
  }
}
```

---

### **Gotchas and Things to Watch Out For**

1. **Manual Reassignment**:

   - When an object is re-added to a logical parent, it does not automatically reassociate with its previous layer. Always reassign the object to the layer explicitly.

2. **Nested Children**:

   - If you remove a parent container, all its children are automatically removed from layers. Be cautious with complex hierarchies.

3. **Sorting Within Layers**:

   - Objects in a layer can be sorted dynamically using their `zIndex` property. This is useful for fine-grained control of render order.

   ```javascript
   rect.zIndex = 10; // Higher values render later
   layer.sortableChildren = true; // Enable sorting
   layer.sortRenderLayerChildren(); // Apply the sorting
   ```

4. **Layer Overlap**:
   - If multiple layers overlap, their order in the scene graph determines the render priority. Ensure the layering logic aligns with your desired visual output.

---

### **Best Practices**

1. **Group Strategically**: Minimize the number of layers to optimize performance.
2. **Use for Visual Clarity**: Reserve layers for objects that need explicit control over render order.
3. **Test Dynamic Changes**: Verify that adding, removing, or reassigning objects to layers behaves as expected in your specific scene setup.

By understanding and leveraging RenderLayers effectively, you can achieve precise control over your scene's visual presentation while maintaining a clean and logical hierarchy.
