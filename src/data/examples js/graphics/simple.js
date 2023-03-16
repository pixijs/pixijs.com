const app = new PIXI.Application({ antialias: true, resizeTo: window });

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0xde3249);
graphics.drawRect(50, 50, 100, 100);
graphics.endFill();

// Rectangle + line style 1
graphics.lineStyle(2, 0xfeeb77, 1);
graphics.beginFill(0x650a5a);
graphics.drawRect(200, 50, 100, 100);
graphics.endFill();

// Rectangle + line style 2
graphics.lineStyle(10, 0xffbd01, 1);
graphics.beginFill(0xc34288);
graphics.drawRect(350, 50, 100, 100);
graphics.endFill();

// Rectangle 2
graphics.lineStyle(2, 0xffffff, 1);
graphics.beginFill(0xaa4f08);
graphics.drawRect(530, 50, 140, 100);
graphics.endFill();

// Circle
graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.beginFill(0xde3249, 1);
graphics.drawCircle(100, 250, 50);
graphics.endFill();

// Circle + line style 1
graphics.lineStyle(2, 0xfeeb77, 1);
graphics.beginFill(0x650a5a, 1);
graphics.drawCircle(250, 250, 50);
graphics.endFill();

// Circle + line style 2
graphics.lineStyle(10, 0xffbd01, 1);
graphics.beginFill(0xc34288, 1);
graphics.drawCircle(400, 250, 50);
graphics.endFill();

// Ellipse + line style 2
graphics.lineStyle(2, 0xffffff, 1);
graphics.beginFill(0xaa4f08, 1);
graphics.drawEllipse(600, 250, 80, 50);
graphics.endFill();

// draw a shape
graphics.beginFill(0xff3300);
graphics.lineStyle(4, 0xffd900, 1);
graphics.moveTo(50, 350);
graphics.lineTo(250, 350);
graphics.lineTo(100, 400);
graphics.lineTo(50, 350);
graphics.closePath();
graphics.endFill();

// draw a rounded rectangle
graphics.lineStyle(2, 0xff00ff, 1);
graphics.beginFill(0x650a5a, 0.25);
graphics.drawRoundedRect(50, 440, 100, 100, 16);
graphics.endFill();

// draw star
graphics.lineStyle(2, 0xffffff);
graphics.beginFill(0x35cc5a, 1);
graphics.drawStar(360, 370, 5, 50);
graphics.endFill();

// draw star 2
graphics.lineStyle(2, 0xffffff);
graphics.beginFill(0xffcc5a, 1);
graphics.drawStar(280, 510, 7, 50);
graphics.endFill();

// draw star 3
graphics.lineStyle(4, 0xffffff);
graphics.beginFill(0x55335a, 1);
graphics.drawStar(470, 450, 4, 50);
graphics.endFill();

// draw polygon
const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

graphics.lineStyle(0);
graphics.beginFill(0x3500fa, 1);
graphics.drawPolygon(path);
graphics.endFill();

app.stage.addChild(graphics);
