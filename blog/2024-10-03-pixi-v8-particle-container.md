---
title: ParticleContainer - The New Speed Demon in PixiJS v8  
description: Introducing the new ParticleContainer in PixiJS v8—faster than ever, optimized for rendering millions of particles effortlessly.  
slug: particlecontainer-v8  
authors:  
  - name: Mat Groves  
    title: PixiJS 
    url: https://github.com/GoodboyDigital  
    image_url: https://github.com/GoodboyDigital.png  
tags: [PixiJS, ParticleContainer, WebGL, Games, Performance, Optimization]  
hide_table_of_contents: true  
keywords: ['PixiJS', 'ParticleContainer', 'game development', 'web graphics', 'optimization', 'WebGL']  
---

PixiJS v8 has taken speed to the next level with the release of its new `ParticleContainer`. This new feature brings a jaw-dropping performance boost, capable of rendering 100K+ without breaking a sweat. If you’ve got tons of elements to throw on the screen, you’re in for a treat!

<!--truncate-->

## What Makes the New ParticleContainer So Special?

The key difference in PixiJS v8 is that the `ParticleContainer` doesn’t deal with sprites any more, it works with lightweight **particles**. While particles share many properties with sprites (like texture, position, anchor, scale, rotation, alpha and color), they cut out unnecessary overhead. The result is **speed**, pure and simple. 

How fast, you ask? Well, take a look on my machine (Macbook Pro M3):

- **Sprites + Container**: 200,000 at 60fps.
- **Particles + ParticleContainer**: 1,000,000 at 60fps!

Yes, that’s a _million_ bunnies on-screen, and honestly the main bottleneck at that point wasn’t even rendering but the logic behind the bouncing movement! Give this a spin and see for yourself:

<iframe src="https://goodboydigital.github.io/pixi-bunnymark/dist/?asParticles=true&count=1000&renderer=webgl" width="700" height="500" frameborder="0"></iframe>

The key takeaway is that you can now render **huge volumes of elements** absurdly fast, making PixiJS v8 a perfect choice for high-performance games or visually intensive projects. And yes this is faster than the v7 particle container by **over 3x**!

### Static vs. Dynamic Properties: The Speed Secret

To get the most out of this performance beast, it’s essential to understand **static** vs. **dynamic** properties. PixiJS gives you full control over which properties update every frame (dynamic) and which don’t need constant updates (static). Here’s how they work:

- **Static properties**: Once set, they stay the same unless explicitly changed. By keeping them static, you reduce computational load, meaning faster rendering. This is your responsibility to update :)
- **Dynamic properties**: These are recalculated and uploaded to the GPU every frame regardless.

By default, **only the position** is dynamic, but you can configure others if needed. The fewer dynamic properties you have, the faster the rendering will be!

### PixiJS v8 Particle Container Usage

Let’s walk through a simple example of how to get started:

```javascript
import { ParticleContainer, Particle, Texture } from 'pixi.js';

// Create a particle container with default options
const container = new ParticleContainer({
    // this is the default, but we show it here for clarity
    dynamicProperties: {
        position: true,  // Allow dynamic position changes (default)
        scale: false,    // Static scale for extra performance
        rotation: false, // Static rotation
        color: false     // Static color
    }
});

// Add particles
const texture = Texture.from('path/to/bunny.png');

for (let i = 0; i < 100000; ++i) {
    let particle = new Particle({
        texture,
        x: Math.random() * 800,
        y: Math.random() * 600,
    });

    container.addParticle(particle);
}

// Add container to the Pixi stage
app.stage.addChild(container);
```

In this example, we create a `ParticleContainer`, set properties to static where possible, and generate a million particles. By using a shared texture (hello, sprite sheets!), we ensure that all particles share the same graphical assets, making rendering even more efficient.

### Why Use the ParticleContainer?

The `ParticleContainer` shines when you need **insane numbers** of visual elements on-screen, especially when you want them moving and interacting in real time. Whether you're building particle effects, swarms of characters, or abstract art installations, PixiJS v8 has you covered. The static vs. dynamic property system gives you granular control over performance, allowing you to fine-tune the balance between flexibility and speed.

This is basically the fastest we could make it by still keeping allowing for different textures (via sprite sheets) and still empowering devs to manipulate the particles via JS and not having to move the movement to the GPU (which might be faster, but is more complex and less flexible). So even though we are choosing to call them particles, they are more like something in between a traditional particle and a classic sprite.

This is ideal for projects where frame rate and rendering volume matter—such as games, interactive apps, and high-volume data visualization. By controlling the dynamic properties of your particles, you can optimize your application’s performance to fit your needs.

### Next steps

The new `ParticleContainer` is a game-changer, but there are still some areas for improvement! For one, there is room to optimise further the static uploading of properties (you may notice the example above is slower when adding bunnys - but then speeds up once stable). We plan to expose how the particles are batched so that developers can add / remove attributes from the batch to make it even faster or add more flexibility and customization. But for now, this is a great starting point and we hope you enjoy the new `ParticleContainer`!

## Conclusion

PixiJS v8’s `ParticleContainer` is a game-changer when it comes to rendering at scale. Its ability to push **millions** of particles at full speed opens up a world of possibilities for game developers, animators, and creative coders. Get in, experiment with the new API, and see just how fast your visuals can fly!

Ready to give it a spin? Try out the new `ParticleContainer` in PixiJS v8, and push the limits of performance in your projects!


## 🌐 Stay Connected

Follow [Doormat23](https://twitter.com/Doormat23) and [PixiJS](https://twitter.com/PixiJS) on social media for the latest updates. Join our vibrant community on [Discord](https://discord.gg/nrnDP9wtyX) for real-time discussions and support.
