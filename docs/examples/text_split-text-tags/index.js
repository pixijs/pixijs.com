// dependencies: { "pixi.js": "latest", "gsap": "latest", "pixi-filters": "latest" }
// description: This example demonstrates SplitText with tagStyles, splitting styled text runs into per-character objects for animation.
import { Container, SplitText } from 'pixi.js';
import { gsap } from 'gsap';
import { setup } from '../shared/setup';

(async () => {
  const { app, width, height } = await setup();

  const container = new Container();
  app.stage.addChild(container);

  const splitText = new SplitText({
    text: '<pixi>PixiJS</pixi> now supports <tag>tagStyles</tag> in <split>SplitText</split>, enabling <color>per-character</color> animations with <tag>styled</tag> <color>runs</color>.',
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 36,
      fill: 0xccccdd,
      wordWrap: true,
      wordWrapWidth: width * 0.7,
      lineHeight: 52,
      align: 'center',
      tagStyles: {
        pixi: { fill: 0x4ecdc4, fontWeight: 'bold' },
        tag: { fill: 0xf7dc6f },
        split: { fill: 0xff9ff3, fontWeight: 'bold' },
        color: { fill: 0x54a0ff },
      },
    },
    charAnchor: 0.5,
  });

  const wrapWidth = width * 0.7;
  container.addChild(splitText);
  container.position.set((width - wrapWidth) / 2, (height - splitText.height) / 2);

  splitText.chars.forEach((char, i) => {
    char.alpha = 0;
    char.scale.set(0.5);
    gsap.to(char, {
      alpha: 1,
      duration: 0.3,
      delay: i * 0.025,
      ease: 'power2.out',
    });
    gsap.to(char.scale, {
      x: 1,
      y: 1,
      duration: 0.4,
      delay: i * 0.025,
      ease: 'back.out(1.7)',
    });
  });
})();
