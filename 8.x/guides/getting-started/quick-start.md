# Quick Start

---

## Try PixiJS Online

- To quickly get a taste of PixiJS, you can try it directly in our [PixiJS Playground](/8.x/playground).

---

## Creating a New Project

:::info[Prerequisites]

- Familiarity with the command line and a basic understanding of JavaScript.
- Install [Node.js](https://nodejs.org/en/) v20.0 or higher.
  :::

In this section, we will introduce how to scaffold a PixiJS application on your local machine. The created project will use a pre-configured build setup, allowing you to quickly get started with PixiJS development.

Make sure your current working directory is where you want to create your project. Run the following command in your terminal:

```sh
npm create pixi.js@latest
```

This command will install and execute the [PixiJS Create](https://pixijs.io/create-pixi/) CLI and begin scaffolding your project. You will be prompted to configure your project by selecting various options, including selecting a template type for setting up your project. There are two main types of templates to choose from:

#### Creation Templates (Recommended)

Creation templates are tailored for specific platforms and include additional configurations and dependencies to streamline development for a particular use case. These templates are more opinionated and are perfect for beginners or those looking for a ready-to-go setup.

#### Bundler Templates

Bundler templates are general templates designed to scaffold a PixiJS project with a specific bundler. They include the necessary configurations and dependencies but leave the project structure flexible, making them ideal for experienced developers who prefer more control.

We recommended using the Vite + PixiJS template for most projects when using bundler templates, as it provides a modern and fast setup for PixiJS applications with minimal configuration.

After selecting your desired template, the scaffolding tool will create a new project directory with the chosen configuration. Navigate to the project directory and install the dependencies:

```bash
cd
npm install
npm run dev
```

You can also add PixiJS to an existing project:

```bash
npm install pixi.js
```

## Usage

Once you've set up your project, here's a simple example to get started with PixiJS:

```ts
// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create and add a container to the stage
  const container = new Container();

  app.stage.addChild(container);

  // Load the bunny texture
  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a 5x5 grid of bunnies in the container
  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);

    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  }

  // Move the container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Center the bunny sprites in local container coordinates
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Listen for animate update
  app.ticker.add((time) => {
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    container.rotation -= 0.01 * time.deltaTime;
  });
})();
```

:::warning
If using Vite you still need to wrap your code in an async function. There is an issue when using top level await with PixiJS when building for production.

This issue is known to affect Vite \<=6.0.6. Future versions of Vite may resolve this issue.
:::
