// dependencies: { "pixi.js": "latest", "gsap": "latest", "pixi-filters": "latest" }
// description: This example demonstrates graphicsContextToSvg(), which serializes live Graphics instructions into a self-contained SVG string that can be re-imported or saved.
import { gsap } from 'gsap';
import { Container, Graphics, graphicsContextToSvg, Text } from 'pixi.js';
import { setup } from '../shared/setup';

function createLabel(text, x, y, options = {}) {
  const label = new Text({
    text,
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: options.size ?? 20,
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

function buildBadge() {
  const badge = new Graphics();

  badge.roundRect(0, 0, 180, 180, 42).fill(0xff5ea8);
  badge.roundRect(0, 0, 180, 180, 42).stroke({ width: 2, color: 0xffffff, alpha: 0.35 });
  badge.roundRect(14, 14, 152, 152, 34).stroke({ width: 4, color: 0xffffff });
  badge.roundRect(36, 46, 108, 16, 8).fill(0xffffff);
  badge.roundRect(36, 82, 108, 16, 8).fill(0x20dcff);
  badge.roundRect(36, 118, 108, 16, 8).fill(0xffffff);
  badge.circle(180, 0, 26).fill(0x20dcff);
  badge.circle(180, 0, 26).stroke({ width: 3, color: 0xffffff });

  return badge;
}

(async () => {
  const { app, width } = await setup();

  const container = new Container();
  app.stage.addChild(container);

  const leftCenterX = 360;
  const rightCenterX = 920;
  const badgeY = 320;

  // The live Graphics object we will export
  const source = buildBadge();
  const sourceWrap = new Container();
  sourceWrap.addChild(source);
  source.position.set(-90, -90);
  sourceWrap.position.set(leftCenterX, badgeY);

  // Serialize the instructions to an SVG string...
  const svgString = graphicsContextToSvg(source, 2);

  // ...and prove the round trip by parsing that string straight back in
  const reimported = new Graphics().svg(svgString);
  const reimportedWrap = new Container();
  reimportedWrap.addChild(reimported);
  reimported.position.set(-90, -90);
  reimportedWrap.position.set(rightCenterX, badgeY);

  const leftLabel = createLabel('Graphics', leftCenterX, 160, { color: 0xffb9c8 });
  const rightLabel = createLabel('re-imported SVG', rightCenterX, 160, { color: 0xb1e8ff });
  const arrow = createLabel('→', width / 2, badgeY, { size: 56, color: 0xffffff });

  const box = new Container();
  const boxWidth = 920;
  const boxHeight = 150;
  const boxBg = new Graphics();
  boxBg.roundRect(0, 0, boxWidth, boxHeight, 12).fill({ color: 0x09111a, alpha: 0.82 });
  boxBg.roundRect(0, 0, boxWidth, boxHeight, 12).stroke({ width: 2, color: 0x4fe6ff, alpha: 0.2 });

  const snippet = `${svgString.slice(0, 260).trim()} ...`;
  const boxText = new Text({
    text: snippet,
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 14,
      fill: 0xcceeff,
      lineHeight: 22,
      wordWrap: true,
      wordWrapWidth: boxWidth - 48,
      breakWords: true,
    },
  });
  boxText.position.set(24, 18);

  box.addChild(boxBg, boxText);
  box.position.set((width - boxWidth) / 2, 470);

  container.addChild(leftLabel, rightLabel, arrow, sourceWrap, reimportedWrap, box);

  // Animate both in sync to show the SVG copy is a real Graphics object
  for (const wrap of [sourceWrap, reimportedWrap]) {
    gsap.fromTo(
      wrap,
      { rotation: -0.12 },
      { rotation: 0.12, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' },
    );
    gsap.fromTo(
      wrap.scale,
      { x: 0.96, y: 0.96 },
      { x: 1.06, y: 1.06, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' },
    );
  }
})();
