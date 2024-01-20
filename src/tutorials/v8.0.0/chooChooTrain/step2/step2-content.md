# Adding Stars

Let's start with the sky! It's a little plain and boring right now, so how about adding some stars to it?

Because we will be drawing many different elements on the remaining steps, let's separate the building of each element into its own function to be called from within the main IIFE. Here, the `addStars` function has been set up for you to fill out.

Graphics API has a built-in `star(x, y, points, radius, innerRadius?, rotation?)` method for this with the ability to specify number of star points, its rotation, radius and even inner radius if you prefer it with a hollow.

Here, we will use a for-loop to create a number of 5-point stars with randomized radius, rotation and deterministically randomized positions across the whole scene. Let create 20 scattered stars with a radius size between 2 - 5 units to start under a single Graphics instance. After drawing out the individual invisible shape, we can then use the `fill(style)` method to color it in, specifying the color and the opacity calculated from the percentage of random radius to the max radius.

> _**TIPS:** The Graphics API methods (with a few exceptions) return back the Graphics instance so it can be used for chained as you will see in the future steps_

```javascript
const starCount = 20;
const graphics = new Graphics();

for (let index = 0; index < starCount; index++)
{
    const x = (index * 0.78695 * app.screen.width) % app.screen.width;
    const y = (index * 0.9382 * app.screen.height) % app.screen.height;
    const radius = 2 + Math.random() * 3;
    const rotation = Math.random() * Math.PI * 2;

    graphics.star(x, y, 5, radius, 0, rotation).fill({ color: 0xffdf00, alpha: radius / 5 });
}

app.stage.addChild(graphics);
```

Now we have a starry sky! But let's take it a little further to lighten up our sky even more on the next step.