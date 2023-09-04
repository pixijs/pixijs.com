# Upgrading PixiJS

PixiJS uses a lot of `peerDependencies` internally to define the relationship between packages. This has created unpredictable errors because of how `npm` resolves peers when bumping/upgrading (e.g., [#8382](https://github.com/pixijs/pixijs/issues/8382), [#8268](https://github.com/pixijs/pixijs/issues/8268), [#8144](https://github.com/pixijs/pixijs/issues/8144), [#7209](https://github.com/pixijs/pixijs/issues/7209)).

When you're _upgrading_ using `npm` please completely uninstall instead of just changing the version in your **package.json**:

```
npm uninstall pixi.js
npm install pixi.js
```

If you are using any PixiJS community plugins, please make sure to uninstall those too:

```
npm uninstall pixi.js @pixi/particle-emitter @pixi/sound
npm install pixi.js @pixi/particle-emitter @pixi/sound
```
