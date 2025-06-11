// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { gsap } from 'gsap';
import { Application, Container, Graphics, Text } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window, antialias: true });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);
  document.body.style.cursor = 'none';

  // create a rectangle button with a label
  const buttonContainer = new Container();
  const button = new Graphics().roundRect(-100, -50, 200, 100, 20).fill(0xed427c).stroke({ color: 'white', width: 4 });
  const label = new Text({
    text: 'Hover me',
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
    },
  });

  label.anchor.set(0.5);
  buttonContainer.addChild(button, label);
  buttonContainer.x = app.screen.width / 2;
  buttonContainer.y = app.screen.height / 2;

  app.stage.addChild(buttonContainer);

  // create cursor graphics
  const CURSOR_PT_WIDTH = 7;
  const CURSOR_WIDTH = 30;
  let isOverTarget = false;
  let rotationTween = null;
  const exitTween = null;
  // let enterTween = null;

  function startRotation() {
    gsap.set(cursor, { angle: 0 });
    rotationTween = gsap.to(cursor, {
      angle: 180,
      duration: 1.2,
      repeat: -1,
      ease: 'linear',
    });
  }

  function stopRotation() {
    if (rotationTween) rotationTween.kill();
  }
  const cursorPt = new Graphics().circle(0, 0, CURSOR_PT_WIDTH).fill(0xffffff);

  app.stage.addChild(cursorPt);

  const cursor = new Graphics();

  function updateCursor(width, height) {
    cursor.clear(); // Clear existing graphics
    cursor.rect(0, 0, width, height).stroke(0xffffff);
  }

  // Initial cursor draw
  updateCursor(CURSOR_WIDTH, CURSOR_WIDTH);

  app.stage.addChild(cursor);

  app.stage.eventMode = 'static';
  buttonContainer.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('globalpointermove', (e) => {
    if (!isOverTarget) {
      gsap.to(cursor, {
        x: e.clientX - CURSOR_WIDTH / 2,
        y: e.clientY - CURSOR_WIDTH / 2,
        duration: 0.1,
        ease: 'expo.out',
      });
    }
    gsap.to(cursorPt, {
      x: e.clientX - CURSOR_PT_WIDTH / 2,
      y: e.clientY - CURSOR_PT_WIDTH / 2,
      duration: 0.1,
      ease: 'expo.out',
    });
  });

  buttonContainer.on('pointerover', () => {
    isOverTarget = true;
    stopRotation();

    if (exitTween) exitTween.kill();
    enterTween = gsap.to(cursor, {
      onUpdate() {
        updateCursor(cursor.width, cursor.height);
      },
      width: buttonContainer.width,
      height: buttonContainer.height,
      angle: 360,
      duration: 0.2,
      ease: 'easeOut',
    });
  });

  buttonContainer.on('pointermove', (e) => {
    const rect = buttonContainer.getBounds();

    const targetWidth = rect.width;
    const targetHeight = rect.height;
    const topLeft = buttonContainer.toGlobal({ x: 0, y: 0 });

    // center
    const cx = topLeft.x + targetWidth / 2;
    const cy = topLeft.y + targetHeight / 2;

    // distance from center
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    gsap.to(cursor, {
      x: topLeft.x + dx * 0.09,
      y: topLeft.y + dy * 0.09,
      // scale: 1.1,
      duration: 0.1,
      ease: 'power2.out',
    });
  });

  buttonContainer.on('pointerout', () => {
    // isOverTarget = false;
    // exitTween = gsap.to(cursor, {
    //     width: 30,
    //     height: 30,
    //     duration: 0.5,
    //     ease: 'elastic.out(1, .9)'
    // });
    // startRotation();
  });

  // Start the rotation animation
  startRotation();
})();
