# Assets

## The Assets package

The Assets package is a modern replacement for the old `PIXI.Loader` class. It is a promise-based resource management solution that will download, cache and parse your assets into something you can use. The downloads can be simultaneous and in the background, meaning faster startup times for your app, the cache ensures that you never download the same asset twice and the extensible parser system allows you to easily extend and customize the process to your needs.

## Getting started

The `@pixi/assets` package doesn't come bundled with PixiJS in version 6.x and must be added externally, however it will become integrated with version 7. The class that does all the heavy lifting is called `AssetsClass` but you don't need to create your own instance since you will find one ready to use in `PIXI.Assets`.
This package relies heavily on JavaScript Promises that all modern browsers support, however, if your target browser [doesn't support promises](https://caniuse.com/promises) you should look into [polyfilling them](https://github.com/zloirock/core-js#ecmascript-promise).

## Making our first Assets Promise

To quickly use the `PIXI.Assets` instance, you just need to call `PIXI.Assets.load` and pass in an asset. This will return a promise that when resolved will yield the value you seek.
In this example, we will load a texture and then turn it into a sprite.

<div class="responsive-4-3"><iframe src="https://pixijs.io/examples/?embed=1&showcode=1#/assets/promise.js"></iframe></div>

One very important thing to keep in mind while using `Assets` is that all requests are cached and if the URL is the same, the promise returned will also be the same.
To show it in code:

```js
promise1 = PIXI.Assets.load('bunny.png');
promise2 = PIXI.Assets.load('bunny.png');

//promise1 === promise2
```

Out of the box, the following assets types can be loaded without the need for external plugins:

- Textures (`avif`, `webp`, `png`, `jpg`, `gif`)
- Sprite sheets (`json`)
- Bitmap fonts (`xml`, `fnt`, `txt`)
- Web fonts (`ttf`, `woff`, `woff2`)
- Json files (`json`)
- Text files (`txt`)

More types can be added fairly easily by creating additional loader parsers.

## Warning about solved promises

When an asset is downloaded, it is cached as a promise inside the `Assets` instance and if you try to download it again you will get a reference to the already resolved promise.
However promise handlers `.then(...)`/`.catch(...)`/`.finally(...)` are always asynchronous, this means that even if a promise was already resolved the code below the `.then(...)`/`.catch(...)`/`.finally(...)` will execute before the code inside them.
See this example:

```js
console.log(1);
alreadyResolvedPromise.then(() => console.log(2));
console.log(3);

// Console output:
// 1
// 3
// 2
```

To learn more about why this happens you will need to learn about [Microtasks](https://javascript.info/microtask-queue), however, using async functions should mitigate this problem.

## Using Async/Await

There is a way to work with promises that is more intuitive and easier to read: `async`/`await`.

To use it we first need to create a function/method and mark it as `async`.

```js
async function test() {
  // ...
}
```

This function now wraps the return value in a promise and allows us to use the `await` keyword before a promise to halt the execution of the code until it is resolved and gives us the value.

See this example:

<div class="responsive-4-3"><iframe src="https://pixijs.io/examples/?embed=1&showcode=1#/assets/async.js"></iframe></div>

The `texture` variable now is not a promise but the resolved texture that resulted after waiting for this promise to resolve.

```js
const texture = await PIXI.Assets.load('examples/assets/bunny.png');
```

This allows us to write more readable code without falling into callback hell and to better think when our program halts and yields.

## Loading multiple assets

We can add assets to the cache and then load them all simultaneously by using `PIXI.Assets.add(...)` and then calling `PIXI.Assets.load(...)` with all the keys you want to have loaded.
See the following example:

<div class="responsive-4-3"><iframe src="https://pixijs.io/examples/?embed=1&showcode=1#/assets/multiple.js"></iframe></div>

However, if you want to take full advantage of `@pixi/Assets` you should use bundles.
Bundles are just a way to group assets together and can be added manually by calling `PIXI.Assets.addBundle(...)`/`PIXI.Assets.loadBundle(...)`.

```js
PIXI.Assets.addBundle('animals', {
  bunny: 'bunny.png',
  chicken: 'chicken.png',
  thumper: 'thumper.png',
});

const assets = await PIXI.Assets.loadBundle('animals');
```

However, the best way to handle bundles is to use a manifest and call `PIXI.Assets.init({manifest})` with said manifest (or even better, an URL pointing to it).
Splitting our assets into bundles that correspond to screens or stages of our app will come in handy for loading in the background while the user is using the app instead of locking them in a single monolithic loading screen.

```json
{
  "bundles": [
    {
      "name": "load-screen",
      "assets": [
        {
          "name": "background",
          "srcs": "sunset.png"
        },
        {
          "name": "bar",
          "srcs": "load-bar.{png,webp}"
        }
      ]
    },
    {
      "name": "game-screen",
      "assets": [
        {
          "name": "character",
          "srcs": "robot.png"
        },
        {
          "name": "enemy",
          "srcs": "bad-guy.png"
        }
      ]
    }
  ]
}
```

```js
PIXI.Assets.init({ manifest: 'path/manifest.json' });
```

Beware that **you can only call `init` once**.

Remember there is no downside in repeating URLs since they will all be cached, so if you need the same asset in two bundles you can duplicate the request without any extra cost!

## Background loading

The old approach to loading was to use `PIXI.Loader` to load all your assets at the beginning of your app, but users are less patient now and want content to be instantly available so the practices are moving towards loading the bare minimum needed to show the user some content and, while they are interacting with that, we keep loading the following content in the background.

Luckily, `@pixi/assets` has us covered with a system that allows us to load everything in the background and in case we need some assets right now, bump them to the top of the queue so we can minimize loading times.

To achieve this, we have the methods `PIXI.Assets.backgroundLoad(...)` and `PIXI.Assets.backgroundLoadBundle(...)` that will passively begin to load these assets in the background. So when you finally come to loading them you will get a promise that resolves to the loaded assets immediately.

When you finally need the assets to show, you call the usual `PIXI.Assets.load(...)` or `PIXI.Assets.loadBundle(...)` and you will get the corresponding promise.

The best way to do this is using bundles, see the following example:

<div class="responsive-4-3"><iframe src="https://pixijs.io/examples/?embed=1&showcode=1#/assets/bundle.js"></iframe></div>

We create one bundle for each screen our game will have and set them all to start downloading at the beginning of our app. If the user progresses slowly enough in our app then they should never get to see a loading screen after the first one!
