// dependencies: { "pixi.js": "latest", "gsap": "latest", "pixi-filters": "latest" }
// description: This example demonstrates the visibleChanged event on containers, showing a grid of shapes that emit events when toggled visible or hidden.
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { gsap } from 'gsap';
import { setup, getAssetUrl } from '../shared/setup';

const COLS = 8;
const ROWS = 5;
const CELL_SIZE = 70;
const GAP = 10;

const SHAPE_POOL = [
  'star-purple-fill',
  'circle-blue-fill',
  'triangle-orange-fill',
  'pentagon-green-fill',
  'square-pink-fill',
  'star-blue-fill',
  'circle-green-fill',
  'triangle-pink-fill',
  'pentagon-purple-fill',
  'square-orange-fill',
];

(async () => {
  const { app, width, height } = await setup(SHAPE_POOL.map((name) => ({ alias: name, src: getAssetUrl(name) })));

  const container = new Container();
  app.stage.addChild(container);

  const gridW = COLS * (CELL_SIZE + GAP) - GAP;
  const gridH = ROWS * (CELL_SIZE + GAP) - GAP;
  const offsetX = (width - gridW) / 2;
  const offsetY = (height - gridH) / 2 + 20;

  let eventCount = 0;
  const counterText = new Text({
    text: 'visibleChanged events: 0',
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 28,
      fontWeight: 'bold',
      fill: 0xffffff,
      dropShadow: { color: 0x000000, alpha: 0.5, blur: 4, distance: 2 },
    },
  });
  counterText.anchor.set(0, 1);
  counterText.position.set((width - counterText.width) / 2, offsetY - 40);
  container.addChild(counterText);

  const cells = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = new Container();
      cell.position.set(offsetX + col * (CELL_SIZE + GAP), offsetY + row * (CELL_SIZE + GAP));

      const glow = new Graphics();
      glow.roundRect(-4, -4, CELL_SIZE + 8, CELL_SIZE + 8, 10);
      glow.fill({ color: 0xffffff, alpha: 0.25 });
      glow.alpha = 0;

      const sprite = Sprite.from(SHAPE_POOL[(row * COLS + col) % SHAPE_POOL.length]);
      sprite.anchor.set(0.5);
      sprite.width = CELL_SIZE;
      sprite.height = CELL_SIZE;
      sprite.position.set(CELL_SIZE / 2, CELL_SIZE / 2);

      cell.addChild(glow, sprite);
      cell.visible = false;

      cell.on('visibleChanged', () => {
        eventCount++;
        counterText.text = `visibleChanged events: ${eventCount}`;

        if (cell.visible) {
          glow.alpha = 1;
          gsap.to(glow, { alpha: 0, duration: 0.4 });
          cell.scale.set(1.2);
          gsap.to(cell.scale, {
            x: 1,
            y: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          });
        }
      });

      cells.push(cell);
      container.addChild(cell);
    }
  }

  const tl = gsap.timeline();
  const maxDiag = ROWS - 1 + (COLS - 1);

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    tl.call(
      () => {
        cells[i].visible = true;
      },
      [],
      (row + col) * 0.08,
    );
  }

  tl.addLabel('hold', '+=0.8');
  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const delay = (maxDiag - (row + col)) * 0.08;
    tl.call(
      () => {
        cells[i].visible = false;
      },
      [],
      `hold+=${delay}`,
    );
  }

  tl.addLabel('reveal2', '+=0.6');
  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    tl.call(
      () => {
        cells[i].visible = true;
      },
      [],
      `reveal2+=${(row + col) * 0.06}`,
    );
  }
})();
