---
title: PixiJS Joins the Spine 4.2 Physics Revolution! 🚀
description: Elevate your animations with Spine 1.1.0 and the revolutionary physics features of Spine 4.2, now fully integrated with PixiJS v8.
slug: pixi-js-hearts-spine
authors: mat
tags: [PixiJS, Spine, WebGL, WebGPU, Animation]
hide_table_of_contents: true
keywords: ['PixiJS', 'Spine', 'webGL', 'webGPU', '2D animation', 'JavaScript graphics', 'game development']
---

We have exciting news for all animation enthusiasts and game developers! The Spine team has just smashed it out of the park with the release of [Spine 4.2](https://en.esotericsoftware.com/blog/Spine-4.2-The-physics-revolution), which includes some truly great new features. The best part for us PixiJS users? We can start leveraging these remarkable features today in both v7 and v8!

<!--truncate-->

For those unfamiliar, Spine is the standard for creating stunning 2D animations. It offers an intuitive editor and a multitude of runtimes to ensure that your animations can be utilized across various platforms. PixiJS has supported Spine for almost as long as both have existed (around 10 years)! Personally, we have been shipping games with Spine for about that long as well.

Initially, we maintained our own player. This worked well, but as Spine evolved and new releases were introduced, we had to invest considerable time and energy to modify our custom player. In the past year, the Esoteric team has been managing the v7 version of the player after PixiJS's [elementalcode](https://x.com/miltoncandelero) made the initial implementation on top of their excellent HTML5 runtime. This means that as these incredible updates are released, the PixiJS community can use them almost immediately!

Here are a few of the exciting new features:

### 🏋️‍♂️ Physics in Spine

Spine 4.2 revolutionizes animation with built-in physics, allowing bones to move naturally by simulating real-world physics. This means:
- **Automatic Secondary Motion**: Save time and enhance your animations with automated movement for hair, clothing, and more.

<iframe src="https://pixijs.io/spine-v8/examples/physics2.html" width="100%" height="500"></iframe>

- **Dynamic Movement**: Enjoy fluid and realistic physics that respond to character movements and animations.

<iframe src="https://pixijs.io/spine-v8/examples/physics.html" width="100%" height="500"></iframe>

### 📎 Attachments

You can now attach any PixiJS Container to a slot in your animation with a simple-to-use API.

  - `addSlotObject(slotName, object)`
  - `removeSlotObject(slotName)`
  - `getSlotObject(slotName)`

<iframe src="https://pixijs.io/spine-v8/examples/slot-objects.html" width="100%" height="500"></iframe>

### 🏎️ v8 Spine Player Beta

We have not forgotten about v8! Just as we engineered v8 with the goal of being the fastest WebGPU (and WebGL!) renderer available, we applied this same focus to the v8 implementation of Spine. Here are some impressive statistics:

- **50% Faster**: Enjoy significant performance improvements, making it over 50% faster than the previous v7 version.
- **50% Less Memory**: We've optimized memory usage, reducing it by over 50% compared to the current v7 version.

We are proud to say that this is one of if not *the* fastest way to render Spine animations on the web 🏆. Get ready to create smooth, high-performance animations with ease.

We plan on handing this implementation back over to the Spine team once we have dotted all the i's and crossed the t's. The last missing feature is the dark-tint property, which is not currently taken into account when rendering in v8. Other than that, all other features are present. If you are not using dark-tint, then this version will work great on v8; we are already using it in production for our games!

We included all the examples in the repo for you to play with [here](https://github.com/pixijs/spine-v8/tree/main/examples).

You can also check out the live v8 examples [here](https://pixijs.io/spine-v8/examples/)

## 📲 Stay Connected

Follow [Doormat23](https://twitter.com/Doormat23) and [PixiJS](https://bsky.app/profile/pixijs.com) on social media for the latest updates. Join our vibrant community on [Discord](https://discord.gg/nrnDP9wtyX) for real-time discussions and support.
