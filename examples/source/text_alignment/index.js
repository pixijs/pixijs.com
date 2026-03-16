import {
  CanvasTextMetrics,
  Container,
  Graphics,
  Text,
  TextStyle,
} from 'pixi.js';
import { gsap } from 'gsap';
import { setup } from './setup';

const SAMPLE_TEXT =
  'PixiJS is a fast, lightweight 2D rendering library that works across all devices, ' +
  'bringing improved text layout and new features for building interactive experiences on the web. ' +
  'This release improves alignment consistency, makes justification behavior predictable, ' +
  'and keeps wrapped paragraphs readable in responsive canvas layouts.';

const ALIGNMENTS = ['left', 'center', 'right', 'justify'];

const ACCENT_COLORS = {
  left: 0x667788,
  center: 0xbb8fce,
  right: 0xf7dc6f,
  justify: 0x4ecdc4,
};

(async () => {
  const { app, width, height } = await setup();

  const container = new Container();
  container.y = 25;
  app.stage.addChild(container);

  const boxPad = 24;
  const boxWidth = Math.min(480, width * 0.42);
  const boxX = (width - boxWidth) / 2;
  const barPadX = 8;
  const barBaseX = boxX - barPadX;
  const barBaseWidth = boxWidth + barPadX * 2;
  const cardX = boxX - boxPad - barPadX;
  const cardWidth = boxWidth + (boxPad + barPadX) * 2;
  const lineH = 28;
  const bodyOffset = 44;

  const bodyStyleOptions = {
    fontFamily: 'Sono, monospace',
    fontSize: 17,
    fill: 0xccccdd,
    wordWrap: true,
    wordWrapWidth: boxWidth,
    lineHeight: lineH,
  };

  const metricsStyle = new TextStyle({ ...bodyStyleOptions, align: 'left' });
  const lineWidths = CanvasTextMetrics.measureText(
    SAMPLE_TEXT,
    metricsStyle,
  ).lineWidths.map((lineWidth) => Math.min(lineWidth, boxWidth));

  const numLines = lineWidths.length;
  const textBlockH = numLines * lineH;
  const cardHeight = Math.max(320, bodyOffset + textBlockH + 82);

  const boxY = (height - 90 - cardHeight) / 2 + boxPad;
  const labelY = boxY + 6;
  const bodyY = boxY + bodyOffset;

  const leftGuide = new Graphics();
  leftGuide.rect(0, 0, 2, 1);
  leftGuide.fill({ color: ACCENT_COLORS.left, alpha: 1 });
  leftGuide.position.set(barBaseX - 5, bodyY);
  leftGuide.scale.y = 0;
  leftGuide.alpha = 0.12;
  container.addChild(leftGuide);

  const rightGuide = new Graphics();
  rightGuide.rect(0, 0, 2, 1);
  rightGuide.fill({ color: ACCENT_COLORS.left, alpha: 1 });
  rightGuide.position.set(barBaseX + barBaseWidth + 3, bodyY);
  rightGuide.scale.y = 0;
  rightGuide.alpha = 0.12;
  container.addChild(rightGuide);

  const cardBg = new Graphics();
  cardBg.roundRect(cardX, boxY - boxPad, cardWidth, cardHeight, 12);
  cardBg.fill({ color: 0x1a1a2e, alpha: 0.85 });
  cardBg.alpha = 0;
  container.addChild(cardBg);

  const bars = [];

  for (let i = 0; i < numLines; i++) {
    const bar = new Graphics();
    bar.roundRect(0, 0, barBaseWidth, lineH - 6, 3);
    bar.fill({ color: ACCENT_COLORS.left, alpha: 0.17 });
    bar.position.set(barBaseX, bodyY + i * lineH + 1);
    bar.scale.x = 0;
    bar.alpha = 0;
    bars.push(bar);
    container.addChild(bar);
  }

  const label = new Text({
    text: "align: 'left'",
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: 18,
      fontWeight: 'bold',
      fill: ACCENT_COLORS.left,
    },
  });
  label.position.set(boxX, labelY + 6);
  label.alpha = 0;
  container.addChild(label);

  const bodyA = new Text({
    text: SAMPLE_TEXT,
    style: { ...bodyStyleOptions, align: 'left' },
  });
  bodyA.position.set(boxX, bodyY + 4);
  bodyA.alpha = 0;

  const bodyB = new Text({
    text: SAMPLE_TEXT,
    style: { ...bodyStyleOptions, align: 'left' },
  });
  bodyB.position.set(boxX, bodyY);
  bodyB.alpha = 0;

  container.addChild(bodyA, bodyB);

  const flash = new Graphics();
  flash.rect(barBaseX - 5, bodyY, barBaseWidth + 10, textBlockH);
  flash.fill({ color: 0x4ecdc4, alpha: 0.12 });
  flash.alpha = 0;
  container.addChild(flash);

  const dotsContainer = new Container();
  const dotY = boxY + cardHeight - 35;
  const dotGap = 18;
  const dotsStartX = width / 2 - ((ALIGNMENTS.length - 1) * dotGap) / 2;

  for (let i = 0; i < ALIGNMENTS.length; i++) {
    const dot = new Graphics();
    dot.circle(0, 0, 4);
    dot.fill(0x334455);
    dot.position.set(dotsStartX + i * dotGap, dotY);
    dotsContainer.addChild(dot);
  }

  const activeDot = new Graphics();
  activeDot.circle(0, 0, 5);
  activeDot.fill(ACCENT_COLORS.left);
  activeDot.position.set(dotsStartX, dotY);
  activeDot.scale.set(0.6);
  activeDot.alpha = 0;
  dotsContainer.addChild(activeDot);

  container.addChild(dotsContainer);

  function redrawBar(bar, color) {
    bar.clear();
    bar.roundRect(0, 0, barBaseWidth, lineH - 6, 3);
    bar.fill({ color, alpha: 0.17 });
  }

  function redrawGuide(g, color) {
    g.clear();
    g.rect(0, 0, 2, 1);
    g.fill({ color, alpha: 1 });
  }

  function redrawActiveDot(color) {
    activeDot.clear();
    activeDot.circle(0, 0, 5);
    activeDot.fill(color);
  }

  function getBarTarget(align, lineIdx) {
    const naturalScale = (lineWidths[lineIdx] + barPadX * 2) / barBaseWidth;
    const scaleX =
      align === 'justify' && lineIdx < numLines - 1 ? 1 : naturalScale;

    let x = barBaseX;
    if (align === 'center') {
      x = barBaseX + (barBaseWidth * (1 - scaleX)) / 2;
    } else if (align === 'right') {
      x = barBaseX + barBaseWidth * (1 - scaleX);
    }

    return { x, scaleX };
  }

  function getBodyOffset(align) {
    let sum = 0;
    for (let i = 0; i < numLines; i++) {
      sum += getBarTarget(align, i).x - boxX;
    }
    return sum / numLines;
  }

  function setBodyAlign(target, align) {
    target.style.align = align;
  }

  function applyAlignmentVisuals(idx) {
    const align = ALIGNMENTS[idx];
    const color = ACCENT_COLORS[align];

    label.text = `align: '${align}'`;
    label.style.fill = color;

    redrawGuide(leftGuide, color);
    redrawGuide(rightGuide, color);
    redrawActiveDot(color);
    bars.forEach((bar) => redrawBar(bar, color));
  }

  applyAlignmentVisuals(0);

  bars.forEach((bar, i) => {
    const target = getBarTarget('left', i);
    bar.position.x = target.x;
    bar.scale.x = 0;
  });

  function queueAlignmentTransition(
    timeline,
    idx,
    holdBefore,
    fromAlign,
    fromBody,
    toBody,
  ) {
    timeline.to({}, { duration: holdBefore });

    const align = ALIGNMENTS[idx];
    const isJustify = align === 'justify';
    const leftOn = align === 'left' || isJustify;
    const rightOn = align === 'right' || isJustify;
    const fromOffset = getBodyOffset(fromAlign);
    const toOffset = getBodyOffset(align);
    const delta = toOffset - fromOffset;

    const stepLabel = `align-${idx}`;
    timeline.addLabel(stepLabel);

    timeline.set(toBody, { x: boxX - delta, y: bodyY, alpha: 0 }, stepLabel);

    const switchPoint = `${stepLabel}+=0.1`;
    const contentMoveDuration = isJustify ? 0.46 : 0.42;
    const contentMoveEase = 'power3.inOut';

    timeline.call(
      () => {
        setBodyAlign(toBody, align);
        applyAlignmentVisuals(idx);
      },
      [],
      switchPoint,
    );

    timeline.to(
      fromBody,
      {
        alpha: 0,
        x: boxX + delta,
        y: bodyY + 1,
        duration: contentMoveDuration,
        ease: contentMoveEase,
      },
      switchPoint,
    );
    timeline.to(
      toBody,
      {
        alpha: 1,
        x: boxX,
        y: bodyY,
        duration: contentMoveDuration,
        ease: contentMoveEase,
      },
      switchPoint,
    );

    timeline.fromTo(
      label.scale,
      { x: 0.96, y: 0.96 },
      { x: 1, y: 1, duration: 0.3, ease: 'back.out(1.7)' },
      switchPoint,
    );

    timeline.to(
      activeDot,
      {
        x: dotsStartX + idx * dotGap,
        duration: 0.36,
        ease: 'power3.inOut',
      },
      switchPoint,
    );
    timeline.fromTo(
      activeDot.scale,
      { x: 1.22, y: 1.22 },
      { x: 1, y: 1, duration: 0.36, ease: 'back.out(1.8)' },
      switchPoint,
    );

    timeline.to(
      leftGuide,
      { alpha: leftOn ? 0.66 : 0.12, duration: 0.3, ease: 'sine.out' },
      switchPoint,
    );
    timeline.to(
      rightGuide,
      { alpha: rightOn ? 0.56 : 0.12, duration: 0.3, ease: 'sine.out' },
      switchPoint,
    );

    bars.forEach((bar, i) => {
      const target = getBarTarget(align, i);
      timeline.to(
        bar,
        {
          x: target.x,
          duration: contentMoveDuration,
          ease: contentMoveEase,
        },
        switchPoint,
      );
      timeline.to(
        bar.scale,
        {
          x: target.scaleX,
          duration: contentMoveDuration,
          ease: contentMoveEase,
        },
        switchPoint,
      );
    });

    if (isJustify) {
      timeline.fromTo(
        bars,
        { alpha: 1 },
        {
          alpha: 0.84,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
          stagger: 0.015,
        },
        `${stepLabel}+=0.52`,
      );
      timeline.to(
        flash,
        { alpha: 1, duration: 0.12, ease: 'sine.out' },
        `${stepLabel}+=0.52`,
      );
      timeline.to(
        flash,
        { alpha: 0, duration: 0.24, ease: 'sine.inOut' },
        `${stepLabel}+=0.64`,
      );
    }
  }

  const introTl = gsap.timeline();

  introTl.to(cardBg, { alpha: 1, duration: 0.45, ease: 'power1.out' }, 0);
  introTl.to(
    leftGuide.scale,
    { y: textBlockH, duration: 0.55, ease: 'power2.out' },
    0.08,
  );
  introTl.to(
    rightGuide.scale,
    { y: textBlockH, duration: 0.55, ease: 'power2.out' },
    0.16,
  );

  introTl.to(
    label,
    { alpha: 1, y: labelY, duration: 0.45, ease: 'power2.out' },
    0.18,
  );
  introTl.to(
    bodyA,
    { alpha: 1, x: boxX, y: bodyY, duration: 0.45, ease: 'power2.out' },
    0.24,
  );

  bars.forEach((bar, i) => {
    const target = getBarTarget('left', i);
    introTl.to(
      bar,
      {
        alpha: 1,
        x: target.x,
        duration: 0.46,
        ease: 'power3.out',
      },
      0.24 + i * 0.035,
    );
    introTl.to(
      bar.scale,
      {
        x: target.scaleX,
        duration: 0.46,
        ease: 'power3.out',
      },
      0.24 + i * 0.035,
    );
  });

  introTl.to(activeDot, { alpha: 1, duration: 0.24, ease: 'sine.out' }, 0.35);
  introTl.to(
    activeDot.scale,
    { x: 1, y: 1, duration: 0.38, ease: 'back.out(2.1)' },
    0.35,
  );
  introTl.to(leftGuide, { alpha: 0.66, duration: 0.34, ease: 'sine.out' }, 0.5);
  introTl.to(
    rightGuide,
    { alpha: 0.12, duration: 0.34, ease: 'sine.out' },
    0.5,
  );

  const loopTl = gsap.timeline({ paused: true, repeat: -1 });
  let currentAlign = 'left';
  let currentBody = bodyA;
  let nextBody = bodyB;

  function queueStep(idx, holdBefore) {
    queueAlignmentTransition(
      loopTl,
      idx,
      holdBefore,
      currentAlign,
      currentBody,
      nextBody,
    );

    currentAlign = ALIGNMENTS[idx];
    const previousCurrent = currentBody;
    currentBody = nextBody;
    nextBody = previousCurrent;
  }

  queueStep(1, 1.0);
  queueStep(2, 1.05);
  queueStep(3, 1.05);
  queueStep(0, 1.15);
  loopTl.to({}, { duration: 0.95 });

  introTl.call(() => {
    loopTl.play(0);
  });
})();
