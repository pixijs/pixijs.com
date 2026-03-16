import { gsap } from 'gsap';
import { BlurFilter, Container, Sprite, Text } from 'pixi.js';
import { setup, getAssetUrl, ASSET_BASE } from './setup';

const SHAPE_ASSETS = [
  'star-purple-fill',
  'circle-blue-fill',
  'triangle-orange-fill',
  'pentagon-green-fill',
  'square-pink-fill',
  'star-blue-stroke',
  'circle-pink-stroke',
  'triangle-green-stroke',
];

const SIZE_MULTIPLIER = 3;
const RINGS = [
  { count: 6, radius: 55, size: 0.16 },
  { count: 10, radius: 110, size: 0.13 },
  { count: 14, radius: 165, size: 0.1 },
];

function createRadialPattern(cx, cy) {
  const group = new Container();
  let assetIdx = 0;

  for (const ring of RINGS) {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2;
      const sprite = Sprite.from(SHAPE_ASSETS[assetIdx % SHAPE_ASSETS.length]);
      sprite.anchor.set(0.5);
      sprite.scale.set(ring.size * SIZE_MULTIPLIER);
      sprite.position.set(
        cx + Math.cos(angle) * ring.radius,
        cy + Math.sin(angle) * ring.radius,
      );
      group.addChild(sprite);
      assetIdx++;
    }
  }

  const center = Sprite.from('ring');
  center.anchor.set(0.5);
  center.scale.set(0.22 * SIZE_MULTIPLIER);
  center.position.set(cx, cy);
  group.addChild(center);

  return group;
}

(async () => {
  const { app, width, height } = await setup([
    ...SHAPE_ASSETS.map((name) => ({ alias: name, src: getAssetUrl(name) })),
    { alias: 'ring', src: `${ASSET_BASE}/ring.png` },
  ]);

  const halfW = width / 2 - 100;
  const centerY = height / 2 + 25;

  const container = new Container();
  container.position.set(100, 0);
  app.stage.addChild(container);

  const leftShapes = createRadialPattern(halfW / 2, centerY);

  const legacyBlur = new BlurFilter({
    strength: 0,
    quality: 4,
    legacy: true,
  });
  leftShapes.filters = [legacyBlur];

  const rightShapes = createRadialPattern(halfW + halfW / 2, centerY);
  const optimizedBlur = new BlurFilter({ strength: 0, quality: 4 });
  rightShapes.filters = [optimizedBlur];

  const divider = new Container();
  const divLine = new Sprite();
  divLine.width = 2;
  divLine.height = height;
  divLine.tint = 0x334455;
  divLine.alpha = 0.5;
  divLine.position.set(halfW - 1, 0);
  divider.addChild(divLine);

  const labelY = centerY - 250;

  const leftLabel = new Text({
    text: 'Legacy',
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 28,
      fontWeight: 'bold',
      fill: 0xffffff,
      dropShadow: { color: 0x000000, alpha: 0.5, blur: 4, distance: 2 },
    },
  });
  leftLabel.anchor.set(0.5, 0.5);
  leftLabel.position.set(halfW / 2, labelY);

  const rightLabel = new Text({
    text: 'Optimized',
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 28,
      fontWeight: 'bold',
      fill: 0xffffff,
      dropShadow: { color: 0x000000, alpha: 0.5, blur: 4, distance: 2 },
    },
  });
  rightLabel.anchor.set(0.5, 0.5);
  rightLabel.position.set(halfW + halfW / 2, labelY);

  const strengthText = new Text({
    text: 'strength: 0',
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 20,
      fill: 0xffffff,
      dropShadow: { color: 0x000000, alpha: 0.5, blur: 4, distance: 2 },
    },
  });
  strengthText.anchor.set(0.5, 0.5);
  strengthText.position.set(halfW, centerY + 200);

  container.addChild(
    leftShapes,
    rightShapes,
    divider,
    leftLabel,
    rightLabel,
    strengthText,
  );

  const state = { strength: 0 };

  function syncFilters() {
    legacyBlur.strength = state.strength;
    optimizedBlur.strength = state.strength;
    strengthText.text = `strength: ${state.strength.toFixed(1)}`;
  }

  const tl = gsap.timeline({ repeat: -1 });
  tl.to(state, {
    strength: 30,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: syncFilters,
  });
  tl.to(state, {
    strength: 0,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: syncFilters,
  });
})();
