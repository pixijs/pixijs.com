import Example from '@site/src/components/Example/index';
import version from '@site/docs/pixi-version.json';

# Mixing PixiJS and Three.js

In many projects, developers aim to harness the strengths of both 3D and 2D graphics. Combining the advanced 3D rendering capabilities of Three.js with the speed and versatility of PixiJS for 2D can result in a powerful, seamless experience. Together, these technologies create opportunities for dynamic and visually compelling applications. Lets see how to do this.

:::info NOTE
This guide assumes PixiJS will be used as the top layer to deliver UI over a 3D scene rendered by Three.js. However, developers can render either in any order, as many times as needed. This flexibility allows for creative and dynamic applications.
:::

---

### What You’ll Learn

- Setting up PixiJS and Three.js to share a single WebGL context.
- Using `resetState` to manage renderer states.
- Avoiding common pitfalls when working with multiple renderers.

---

### Setting Up

#### Step 1: Initialize Three.js Renderer and Scene

Three.js will handle the 3D rendering the creation of the dom element and context. 

```javascript
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const threeRenderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    stencil: true // so masks work in pixijs
});

threeRenderer.setSize(WIDTH, HEIGHT);
threeRenderer.setClearColor(0xdddddd, 1);
document.body.appendChild(threeRenderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 50;
scene.add(camera);

const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x0095dd });
const cube = new THREE.Mesh(boxGeometry, basicMaterial);
cube.rotation.set(0.4, 0.2, 0);
scene.add(cube);
```
:::info NOTE
We used the dom element and context created by the three.js renderer to pass to the pixijs renderer.
This was the simplest way to ensure that the two renderers were using the same WebGL context. You could have done it the other way round
if you wanted to.
:::

#### Step 2: Initialize PixiJS Renderer and Stage

PixiJS will handle the 2D overlay.

```javascript
const pixiRenderer = new PIXI.WebGLRenderer();

await pixiRenderer.init({
    context: threeRenderer.getContext(),
    width: WIDTH,
    height: HEIGHT,
    clearBeforeRender: false, // Prevent PixiJS from clearing the Three.js render
});

const stage = new PIXI.Container();
const amazingUI = new PIXI.Graphics()
    .roundRect(20, 80, 100, 100, 5)
    .roundRect(220, 80, 100, 100, 5)
    .fill(0xffff00);

stage.addChild(amazingUI);
```

---

### Rendering Loop

To ensure smooth transitions between the renderers, reset their states before each render:

```javascript
function render() {
    // Render the Three.js scene
    threeRenderer.resetState();
    threeRenderer.render(scene, camera);

    // Render the PixiJS stage
    pixiRenderer.resetState();
    pixiRenderer.render({ container: stage });

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

```

---

### Example: Combining 3D and 2D Elements

Here’s the complete example integrating PixiJS and Three.js:

<Example id="advanced.threeAndPixi" pixiVersion={version} mode={"embedded"} />

---

### Gotchas

- **Enable Stencil Buffers:**

  - When creating the Three.js renderer, ensure `stencil` is set to `true`. This allows PixiJS masks to work correctly.

- **Keep Dimensions in Sync:**

  - Ensure both renderers use the same `width` and `height` to avoid visual mismatches—so be careful when resizing one, you need to resize the other!

- **Pass the WebGL Context:**

  - Pass the WebGL context from Three.js to PixiJS during initialization using `pixiRenderer.init({ context: threeRenderer.getContext() });`.

- **Disable Clear Before Render:**

  - Set `clearBeforeRender: false` when initializing the PixiJS renderer. This prevents PixiJS from clearing the Three.js content that was rendered before it. 
  - Alternatively you can set `clear: false` in the `pixiRenderer.render()` call. eg `pixiRenderer.render({ container: stage, clear: false });`.

- **Manage Render Order:**

  - In this example, Three.js is rendered first, followed by PixiJS for UI layers. However, this order is flexible. You can render pixi -> three -> pixi is you want, just make sure you reset the state when switching renderer.
  
- **Separate Resources:**

  - Remember that resources like textures are not shared between PixiJS and Three.js. A PixiJS texture cannot be directly used as a Three.js texture and vice versa.

---

### Conclusion

Mixing PixiJS and Three.js can be a powerful way to create dynamic and visually appealing applications. By carefully managing the rendering loop and states, you can achieve seamless transitions between 3D and 2D layers. This approach allows you to leverage the strengths of both technologies, creating applications that are both visually stunning and performant.

This technique can be used with other renderers too - as long as they have their own way of resetting their state (which the main ones do) you can mix them. Popular 3D engines like Babylon.js and PlayCanvas both support state management through their respective APIs, making them compatible with this mixing approach. This gives you the flexibility to choose the 3D engine that best suits your needs while still leveraging PixiJS's powerful 2D capabilities.




