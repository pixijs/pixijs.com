// dependencies: { "pixi.js": "latest", "gsap": "latest", "pixi-filters": "latest" }
// description: This example demonstrates the new channel option for sprite masks, comparing how the red and alpha channels of the same mask texture reveal different regions.
import { gsap } from 'gsap';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { setup, getAssetUrl } from '../shared/setup';

const SHOWCASE_ASSETS = [
  'star-purple-fill',
  'circle-blue-fill',
  'triangle-orange-fill',
  'pentagon-green-fill',
  'square-pink-fill',
  'star-blue-stroke',
  'circle-pink-stroke',
  'triangle-green-stroke',
];

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

function createShowcase(centerX, centerY) {
  const root = new Container();

  for (let index = 0; index < SHOWCASE_ASSETS.length; index++) {
    const sprite = Sprite.from(SHOWCASE_ASSETS[index]);
    const angle = (index / SHOWCASE_ASSETS.length) * Math.PI * 2;
    const radius = index % 2 === 0 ? 116 : 74;

    sprite.anchor.set(0.5);
    sprite.position.set(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    sprite.scale.set(index % 2 === 0 ? 0.72 : 0.56);
    sprite.rotation = angle * 0.35;
    root.addChild(sprite);
  }

  const centerGlow = new Graphics();
  centerGlow.circle(centerX, centerY, 58);
  centerGlow.fill({ color: 0x07131f, alpha: 0.78 });

  const title = createLabel('MASK', centerX, centerY - 8, { size: 34, fontWeight: '700' });
  const subTitle = createLabel('same mask sprite', centerX, centerY + 32, { size: 14, color: 0xa7c8de });

  root.addChildAt(centerGlow, 0);
  root.addChild(title, subTitle);

  return root;
}

(async () => {
  const { app, width } = await setup(SHOWCASE_ASSETS.map((name) => ({ alias: name, src: getAssetUrl(name) })));

  const container = new Container();
  app.stage.addChild(container);

  const centerX = width / 2;
  const leftCenterX = 355;
  const rightCenterX = 925;
  const showcaseY = 362;
  const trackWidth = 260;
  const leftStartX = leftCenterX - trackWidth / 2;
  const leftEndX = leftCenterX + trackWidth / 2;
  const rightStartX = rightCenterX - trackWidth / 2;
  const rightEndX = rightCenterX + trackWidth / 2;

  // The mask texture: a black circle (no red, full alpha) with a red star on top.
  // channel: 'red' only sees the star; channel: 'alpha' sees the whole circle.
  const maskGraphic = new Graphics();
  const maskRadius = 76;
  maskGraphic.circle(100, 100, maskRadius * 0.82).fill(0x000000);
  maskGraphic.star(100, 100, 6, maskRadius * 0.75, maskRadius * 0.38).fill(0xdd2200);

  const maskTexture = app.renderer.generateTexture({ target: maskGraphic, resolution: 2 });

  const maskPreview = new Sprite(maskTexture);
  maskPreview.anchor.set(0.5);
  maskPreview.scale.set(0.38);
  maskPreview.position.set(centerX, showcaseY);

  const previewBorder = new Graphics();
  previewBorder.circle(0, 0, maskRadius * 0.38 + 6).stroke({ width: 1, color: 0x4a5c71, alpha: 0.6 });
  previewBorder.position.copyFrom(maskPreview.position);

  const previewLabel = createLabel('mask texture', centerX, showcaseY + 52, { size: 12, color: 0xcfd9e5 });

  const leftTitle = createLabel("channel: 'red'", leftCenterX, 206, { size: 20, color: 0xffb9c8 });
  const rightTitle = createLabel("channel: 'alpha'", rightCenterX, 206, { size: 20, color: 0xb1fff8 });
  const leftSub = createLabel('red channel reveals the star', leftCenterX, 530, { size: 14, color: 0xffcbd4 });
  const rightSub = createLabel('alpha channel reveals the full circle', rightCenterX, 530, {
    size: 14,
    color: 0xc2fff9,
  });

  const leftShowcase = createShowcase(leftCenterX, showcaseY);
  const rightShowcase = createShowcase(rightCenterX, showcaseY);

  const leftMask = new Sprite(maskTexture);
  const rightMask = new Sprite(maskTexture);
  leftMask.anchor.set(0.5);
  rightMask.anchor.set(0.5);
  leftMask.renderable = false;
  rightMask.renderable = false;

  leftShowcase.setMask({ mask: leftMask, channel: 'red' });
  rightShowcase.setMask({ mask: rightMask, channel: 'alpha' });

  container.addChild(
    leftTitle,
    rightTitle,
    previewBorder,
    maskPreview,
    previewLabel,
    leftShowcase,
    rightShowcase,
    leftSub,
    rightSub,
    leftMask,
    rightMask,
  );

  const state = { progress: 0 };
  const sync = () => {
    const yOffset = Math.sin(state.progress * Math.PI * 2) * 24;

    leftMask.position.set(leftStartX + (leftEndX - leftStartX) * state.progress, showcaseY + yOffset);
    rightMask.position.set(rightStartX + (rightEndX - rightStartX) * state.progress, showcaseY + yOffset);
  };

  sync();

  const loop = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
  loop.to(state, { progress: 1, duration: 1.35, onUpdate: sync });
  loop.to(state, { progress: 0, duration: 1.35, onUpdate: sync });
  loop.to({}, { duration: 0.45 });
})();
