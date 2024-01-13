# Adding Fishes

What's a pond without the fishes, right? Let's use what we learn from the previous step to add some fish sprites to the scene as well. We will also animate them afterwards to give them life.

## Create and Setup Fish Sprites

Let's encapsulate all the following setup within the `addFishes` function that has already been prepared for you. We begin by creating a container to hold all the fish sprites together and add it to the stage. This is a great practice for better separation.

```javascript
const fishContainer = new Container();

app.stage.addChild(fishContainer);
```

Then we declare some reference variables like how many fishes should there be in the pond and what are the fish types available. For the types, we refer to the 5 different fish assets we have preloaded earlier and made them into an array of aliases.

```javascript
const fishCount = 20;
const fishAssets = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];
```

Instead of creating each of the fish individually, which will be super tedious, we will use a simple `for` loop to create each of the fish until it reaches our desire count, also cycling through the fish asset aliases array. In addition to the basic setup and applying initial transforms, we also assign them with custom properties like `direction`, `speed` and `turnSpeed` which will be used during the animation. We will store the fishes in a reference array defined outside of the IIFE.

```javascript
for (let i = 0; i < fishCount; i++)
{
    const fishAsset = fishAssets[i % fishAssets.length];
    const fish = Sprite.from(fishAsset);

    fish.anchor.set(0.5);

    fish.direction = Math.random() * Math.PI * 2;
    fish.speed = 2 + Math.random() * 2;
    fish.turnSpeed = Math.random() - 0.8;

    fish.x = Math.random() * app.screen.width;
    fish.y = Math.random() * app.screen.height;
    fish.scale.set(0.8 + Math.random() * 0.3);

    this.fishContainer.addChild(fish);
    this.fishes.push(fish);
}
```

## Animate Fishes

It's time to give the fishes some movements! Another function `animateFishes` has been prepared and connected to the application's ticker which will be continuously called. It is supplied with a Ticker object which we can use to infer the amount of time passed between the calls.

We will declare a few variables to help us with the animation. We extract `deltaTime` from the Ticker object which tells us the amount of time passed since last call, in seconds. We also define an imaginary bound that is larger than the stage itself to wrap the position of the fishes when they go off the screen. We use this bound instead of the actual screen size to avoid having the fishes disappear before they actually go off the edges, since the fish sprites' anchor is in the center so, eg. when a `fish.x = 0`, half of the fish's width is still apparent on the screen.

```javascript
const delta = time.deltaTime;

const stagePadding = 100;
const boundWidth = app.screen.width + stagePadding * 2;
const boundHeight = app.screen.height + stagePadding * 2;
```

We can then simply loop through individual fishes array and update them one by one. First by updating the fish's pseudo direction which dictates the changes in its sprite position and rotation. To keep the fish within the screen bound, we use the padded bound defined earlier to check and wrap the fish as soon as it goes off the bound.

```javascript
fishes.forEach((fish) =>
{
    fish.direction += fish.turnSpeed * 0.01;
    fish.x += Math.sin(fish.direction) * fish.speed;
    fish.y += Math.cos(fish.direction) * fish.speed;
    fish.rotation = -fish.direction - Math.PI / 2;

    if (fish.x < -stagePadding)
    {
        fish.x += boundWidth;
    }
    if (fish.x > app.screen.width + stagePadding)
    {
        fish.x -= boundWidth;
    }
    if (fish.y < -stagePadding)
    {
        fish.y += boundHeight;
    }
    if (fish.y > app.screen.height + stagePadding)
    {
        fish.y -= boundHeight;
    }
});
```

They are beautiful aren't they! Next, let's add a water surface effect to make the pond feels more dynamic.