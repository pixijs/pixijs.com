# Particle Container

ixiJS v8 introduces a high-performance particle system via the `ParticleContainer` and `Particle` classes. Designed for rendering vast numbers of lightweight visuals—like sparks, bubbles, bunnies, or explosions—this system provides raw speed by stripping away all non-essential overhead.

:::warning **Experimental API Notice**
The Particle API is stable but **experimental**. Its interface may evolve in future PixiJS versions. We welcome feedback to help guide its development.
:::

```ts
import { ParticleContainer, Particle, Texture } from 'pixi.js';

const texture = Texture.from('bunny.png');

const container = new ParticleContainer({
    dynamicProperties: {
        position: true, // default
        scale: false,
        rotation: false,
        color: false,
    },
});

for (let i = 0; i < 100000; i++) {
    const particle = new Particle({
        texture,
        x: Math.random() * 800,
        y: Math.random() * 600,
    });

    container.addParticle(particle);
}

app.stage.addChild(container);
```

## **Why Use ParticleContainer?**

- **Extreme performance**: Render hundreds of thousands or even millions of particles with high FPS.
- **Lightweight design**: Particles are more efficient than `Sprite`, lacking extra features like children, events, or filters.
- **Fine-grained control**: Optimize rendering by declaring which properties are dynamic (updated every frame) or static (set once).

### **Performance Tip: Static vs. Dynamic**

- **Dynamic properties** are uploaded to the GPU every frame.
- **Static properties** are uploaded only when `update()` is called.

Declare your needs explicitly:

```ts
const container = new ParticleContainer({
    dynamicProperties: {
        position: true,
        rotation: true,
        scale: false,
        color: false,
    },
});
```

If you later modify a static property or the particle list, you must call:

```ts
container.update();
```

## **Limitations and API Differences**

`ParticleContainer` is designed for speed and simplicity. As such, it doesn't support the full `Container` API:

### ❌ Not Available:

- `addChild()`, `removeChild()`
- `getChildAt()`, `setChildIndex()`
- `swapChildren()`, `reparentChild()`

### ✅ Use Instead:

- `addParticle(particle)`
- `removeParticle(particle)`
- `removeParticles(beginIndex, endIndex)`
- `addParticleAt(particle, index)`
- `removeParticleAt(index)`

These methods operate on the `.particleChildren` array and maintain the internal GPU buffers correctly.

## **Creating a Particle**

A `Particle` supports key display properties, and is far more efficient than `Sprite`.

### **Particle Example**

```ts
const particle = new Particle({
    texture: Texture.from('spark.png'),
    x: 200,
    y: 100,
    scaleX: 0.8,
    scaleY: 0.8,
    rotation: Math.PI / 4,
    tint: 0xff0000,
    alpha: 0.5,
});
```

You can also use the shorthand:

```ts
const particle = new Particle(Texture.from('spark.png'));
```

---

## **API Reference**

### `Particle`

| Property        | Description                              |
| --------------- | ---------------------------------------- |
| **x / y**       | Particle's position                      |
| **scaleX / Y**  | Independent scale values                 |
| **rotation**    | Rotation in radians                      |
| **anchorX / Y** | Anchor point offset (0 by default)       |
| **alpha**       | Opacity value (0 to 1)                   |
| **tint**        | Tint color in hex                        |
| **color**       | Combined tint/alpha value (internal use) |
| **texture**     | Texture to display                       |

### `ParticleContainer`

| Property / Method        | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| **particleChildren**     | Array of `Particle` instances                                          |
| **dynamicProperties**    | Object specifying which properties update each frame                   |
| **addParticle(...)**     | Adds one or more particles                                             |
| **removeParticle(...)**  | Removes one or more particles                                          |
| **removeParticles(...)** | Removes particles from index range                                     |
| **addParticleAt(p, i)**  | Adds a particle at a specific index                                    |
| **removeParticleAt(i)**  | Removes a particle at a specific index                                 |
| **update()**             | Recomputes GPU buffers for static properties or particle order changes |
| **shader**               | Optional custom shader for particle rendering                          |
| **texture**              | Optional shared texture (overridden per-particle if set individually)  |
| **position**             | Local position (`.x`, `.y`)                                            |
| **rotation**             | Rotation in radians                                                    |
| **angle**                | Rotation in degrees (alias for `rotation`)                             |
| **scale**                | `.x` and `.y` scale factors                                            |
| **pivot**                | Transform origin for scaling/rotation                                  |
| **skew**                 | Skew values in radians                                                 |
| **alpha**                | Opacity (0 to 1)                                                       |
| **visible**              | Whether the container and its subtree is rendered                      |
| **tint**                 | Tint color                                                             |
| **renderable**           | Whether the container itself is renderable (still updates children)    |
