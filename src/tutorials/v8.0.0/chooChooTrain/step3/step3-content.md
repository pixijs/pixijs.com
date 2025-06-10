# Adding Moon

For the moon crescent, we will cheat a little bit with the included moon SVG file.

Graphics API also has a built-in `svg(svgString)` method for drawing vector graphics using SVG data. Have a go at it on the set up `addMoon` function.

```javascript
const graphics = new Graphics().svg(parsedSvg);

graphics.x = app.screen.width / 2 + 100;
graphics.y = app.screen.height / 8;
app.stage.addChild(graphics);
```

Think the sky is enough, let's us now proceed to add some landscape elements!
