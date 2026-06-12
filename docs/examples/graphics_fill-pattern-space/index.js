// dependencies: { "pixi.js": "latest", "gsap": "latest", "pixi-filters": "latest" }
// description: This example demonstrates the new textureSpace option on FillPattern, comparing global tiling across shapes against local per-shape tiling with setTransform().
import { gsap } from 'gsap';
import { FillPattern, Graphics, Matrix, Text, Texture } from 'pixi.js';
import { setup, getAssetUrl } from '../shared/setup';

const LEFT_CENTER = { x: 355, y: 360 };
const RIGHT_CENTER = { x: 925, y: 360 };
const PATTERN_SCALE = 0.22;

function createLabel(text, x, y, options = {}) {
  const label = new Text({
    text,
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: options.size ?? 18,
      fontWeight: options.fontWeight ?? '600',
      fill: options.color ?? 0xffffff,
      align: 'center',
      dropShadow: { color: 0x000000, alpha: 0.45, blur: 4, distance: 2 },
    },
  });

  label.anchor.set(0.5);
  label.position.set(x, y);

  return label;
}

function drawShapes(graphics, center, pattern, accent, drift, grow) {
  const circleX = center.x - 112 + Math.cos(drift) * 24;
  const circleY = center.y - 62 + Math.sin(drift) * 16;
  const starX = center.x + 108 + Math.cos(drift + 2.1) * 24;
  const starY = center.y - 48 + Math.sin(drift + 2.1) * 16;
  const rectX = center.x - 16 + Math.cos(drift + 4.2) * 20;
  const rectY = center.y + 96 + Math.sin(drift + 4.2) * 12;
  const rectWidth = 188 * grow;
  const rectHeight = 112 * grow;

  graphics.clear();
  graphics.circle(circleX, circleY, 66 * grow).fill(pattern);
  graphics.circle(circleX, circleY, 66 * grow).stroke({ width: 3, color: accent, alpha: 0.55 });
  graphics.star(starX, starY, 5, 82 * grow, 41 * grow).fill(pattern);
  graphics.star(starX, starY, 5, 82 * grow, 41 * grow).stroke({ width: 3, color: accent, alpha: 0.55 });
  graphics.roundRect(rectX - rectWidth / 2, rectY - rectHeight / 2, rectWidth, rectHeight, 22).fill(pattern);
  graphics
    .roundRect(rectX - rectWidth / 2, rectY - rectHeight / 2, rectWidth, rectHeight, 22)
    .stroke({ width: 3, color: accent, alpha: 0.55 });
}

(async () => {
  const { app } = await setup([{ alias: 'star-pink-fill', src: getAssetUrl('star-pink-fill') }]);

  const texture = Texture.from('star-pink-fill');

  const globalPattern = new FillPattern({
    texture,
    repetition: 'repeat',
    textureSpace: 'global',
  });
  const localPattern = new FillPattern({
    texture,
    repetition: 'repeat',
    textureSpace: 'local',
  });

  const divider = new Graphics();
  divider.rect(639, 190, 2, 330);
  divider.fill({ color: 0x334455, alpha: 0.44 });

  const leftShapes = new Graphics();
  const rightShapes = new Graphics();

  const leftChip = createLabel("textureSpace: 'global'", LEFT_CENTER.x, 160, {
    size: 20,
    color: 0x8ee6ff,
    fontWeight: '700',
  });
  const rightChip = createLabel("textureSpace: 'local'", RIGHT_CENTER.x, 160, {
    size: 20,
    color: 0x9dffe0,
    fontWeight: '700',
  });
  const leftSub = createLabel('shapes glide over one shared world-space grid', LEFT_CENTER.x, 552, {
    size: 14,
    color: 0x9fb6cf,
  });
  const rightSub = createLabel('one tile per shape — setTransform() subdivides it', RIGHT_CENTER.x, 552, {
    size: 14,
    color: 0x9fb6cf,
  });

  app.stage.addChild(divider, leftShapes, rightShapes, leftChip, rightChip, leftSub, rightSub);

  const globalMatrix = new Matrix();
  const localMatrix = new Matrix();
  const subdivide = { tiles: 1 };

  const loop = gsap.timeline({ repeat: -1 });
  loop.to(subdivide, { tiles: 3, duration: 1.1, ease: 'back.inOut(1.2)', delay: 1.2 });
  loop.to(subdivide, { tiles: 1, duration: 1.1, ease: 'back.inOut(1.2)', delay: 1.4 });
  loop.to({}, { duration: 0.9 });

  let elapsed = 0;

  app.ticker.add((time) => {
    elapsed += time.deltaTime / 60;

    globalMatrix
      .identity()
      .scale(PATTERN_SCALE, PATTERN_SCALE)
      .translate(elapsed * 26, elapsed * 14);
    globalPattern.setTransform(globalMatrix);

    localMatrix.identity().scale(1 / subdivide.tiles, 1 / subdivide.tiles);
    localPattern.setTransform(localMatrix);

    const grow = 1 + Math.sin(elapsed * 1.5) * 0.1;

    drawShapes(leftShapes, LEFT_CENTER, globalPattern, 0x41d3ff, elapsed, 1);
    drawShapes(rightShapes, RIGHT_CENTER, localPattern, 0x55e6b8, elapsed, grow);
  });
})();
