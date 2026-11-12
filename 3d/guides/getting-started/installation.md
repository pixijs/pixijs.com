# Installation

PixiJS 3D is the `@pixi/3d` package. It runs inside a PixiJS application, so you install it next to `pixi.js`.

## npm

```bash
npm install pixi.js @pixi/3d
```

`@pixi/3d` needs `pixi.js` 8.23.0 or later.

Import the engine from `@pixi/3d`, and the optional pieces from `@pixi/3d/extras`:

```ts
import { Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';
```

`@pixi/3d/extras` holds optional pieces built on the engine, such as the [`OrbitCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.OrbitCamera.html) and [`FPSCamera`](https://3d.pixijs.download/v0.1.0/docs/extras_camera.FPSCamera.html) controllers, [`ParticleSystem3D`](https://3d.pixijs.download/v0.1.0/docs/extras_particles.ParticleSystem3D.html), [`ToonMaterial`](https://3d.pixijs.download/v0.1.0/docs/extras_materials.ToonMaterial.html), the [`BloomEffect`](https://3d.pixijs.download/v0.1.0/docs/extras_post-processing.BloomEffect.html) and other post-processing effects, and debug tools such as [`GraphDebugOverlay`](https://3d.pixijs.download/v0.1.0/docs/extras_debug.GraphDebugOverlay.html).

## How the backends load

PixiJS 3D has two backends, one for each of PixiJS's GPU renderers. One is the code that draws with WebGPU, and the other is the code that draws with WebGL2. Importing `@pixi/3d` registers neither. `app.init` loads and registers the backend for the renderer it starts. A production build from a bundler such as Vite puts each backend in a file of its own, as does the CDN build. A browser then downloads only the backend it uses.

Import `@pixi/3d` before `app.init` runs. A renderer that started earlier never gets a backend, and a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) on it draws nothing. This happens, for example, when the 3D code arrives in a lazily loaded chunk of a 2D app that's already running.

`skipExtensionImports: true` stops PixiJS importing extensions for you, and stops `app.init` loading a backend, so you import the backends yourself. Each one you import goes in your main bundle. Import every backend the page can end up with. With `preference: 'webgpu'` that's both, since PixiJS falls back to WebGL2 where WebGPU is missing. Without the renderer's backend, a [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) draws nothing.

```ts
import '@pixi/3d/webgl';
import '@pixi/3d/webgpu';
// PixiJS's events, filters, accessibility and DOM extensions are off too, so import the ones the page uses
import 'pixi.js/events';

await app.init({ preference: 'webgpu', skipExtensionImports: true });
```

## CDN

jsDelivr serves the CDN build from the `dist` folder of the npm package. Its files import `pixi.js` by name, so map `pixi.js`, `@pixi/3d` and `@pixi/3d/extras` in an import map. Then write the same code as with npm:

```html
<script type="importmap">
  {
    "imports": {
      "pixi.js": "https://cdn.jsdelivr.net/npm/pixi.js@8.23.0/dist/pixi.min.mjs",
      "@pixi/3d": "https://cdn.jsdelivr.net/npm/@pixi/3d@0.1.0/dist/pixijs-3d.min.mjs",
      "@pixi/3d/extras": "https://cdn.jsdelivr.net/npm/@pixi/3d@0.1.0/dist/pixijs-3d-extras.min.mjs"
    }
  }
</script>
<script type="module">
  import { View3D } from '@pixi/3d';
  import { OrbitCamera } from '@pixi/3d/extras';
  import { Application } from 'pixi.js';

  // the same code as with npm
</script>
```

Import `Application` and the rest of PixiJS from the mapped `pixi.js` too. Loading PixiJS with a plain `<script>` tag defines a global `PIXI`, a second copy of PixiJS that PixiJS 3D doesn't register with. A [`View3D`](https://3d.pixijs.download/v0.1.0/docs/scene.View3D.html) in an application made from it draws nothing.

Map `@pixi/3d` and `@pixi/3d/extras` to files in the same folder, both minified or both unminified. The extras file imports the engine file next to it. If `@pixi/3d` maps to any other URL, such as one for another version, the page downloads and runs a second copy of the engine.

To host the files yourself, keep every `pixijs-3d` file from `dist` together in one folder. The main file fetches the backend its renderer uses from its own folder, and the meshopt decoder for [compressed models](https://pixijs.com/3d/guides/components/models/compression.md) from there too. Draco-compressed models still fetch their decoder from Google until you [host it too](https://pixijs.com/3d/guides/components/models/compression.md#draco).

## TypeScript

`@pixi/3d` ships its type declarations. They use the same WebGPU types as `pixi.js`, so a project set up the way the [PixiJS TypeScript guide](https://pixijs.download/release/docs/core-concepts-8.html) shows already has them.

The types for `@pixi/3d/extras` come through the `exports` field of the package, so use a `moduleResolution` that reads them, such as `"bundler"`. The older `"node"` setting can't find them.

## Next steps

- [Quick start](https://pixijs.com/3d/guides/getting-started/quick-start.md): build a first scene.
- [WebGL and WebGPU](https://pixijs.com/3d/guides/concepts/webgl-and-webgpu.md): what differs between the two backends.
