import { gsap } from 'gsap';
import {
  Container,
  Graphics,
  Particle,
  ParticleContainer,
  Text,
} from 'pixi.js';
import { setup } from './setup';

const PARTICLE_COUNT = 420;
const PALETTE = [0x7fd1ff, 0xb892ff, 0xff8fd1, 0xfff0b0];
const LEFT_CENTER = { x: 355, y: 350 };
const RIGHT_CENTER = { x: 925, y: 350 };

function createLabel(text, x, y, options = {}) {
  const label = new Text({
    text,
    style: {
      fontFamily: 'Sono, monospace',
      fontSize: options.size ?? 19,
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

function createGlowTexture(app) {
  const glow = new Graphics();

  for (let radius = 26; radius > 0; radius -= 2) {
    glow.circle(0, 0, radius).fill({ color: 0xffffff, alpha: 0.07 });
  }

  const texture = app.renderer.generateTexture({ target: glow, resolution: 2 });

  glow.destroy();

  return texture;
}

function createGalaxy(texture, center) {
  const particleContainer = new ParticleContainer({
    dynamicProperties: { position: true },
  });
  const orbiters = [];

  for (let index = 0; index < PARTICLE_COUNT; index++) {
    const progress = index / PARTICLE_COUNT;
    const radius = 22 + progress * 158;
    const arm = (index % 3) * ((Math.PI * 2) / 3);
    const scale = 0.18 + Math.random() * 0.5;
    const particle = new Particle({
      texture,
      anchorX: 0.5,
      anchorY: 0.5,
      scaleX: scale,
      scaleY: scale,
      tint: PALETTE[index % PALETTE.length],
      alpha: 0.5 + Math.random() * 0.5,
    });

    particleContainer.addParticle(particle);
    orbiters.push({
      particle,
      angle: arm + radius * 0.021 + Math.random() * 0.5,
      radius,
      speed: 0.006 + (34 / radius) * 0.02,
      wobblePhase: Math.random() * Math.PI * 2,
    });
  }

  const sync = (elapsed) => {
    for (const orbiter of orbiters) {
      orbiter.angle += orbiter.speed;

      const radius =
        orbiter.radius + Math.sin(elapsed * 1.4 + orbiter.wobblePhase) * 7;

      orbiter.particle.x = center.x + Math.cos(orbiter.angle) * radius;
      orbiter.particle.y = center.y + Math.sin(orbiter.angle) * radius * 0.62;
    }

    particleContainer.update();
  };

  return { particleContainer, sync };
}

(async () => {
  const { app, width } = await setup();

  const texture = createGlowTexture(app);

  const divider = new Graphics();
  divider.rect(639, 190, 2, 320);
  divider.fill({ color: 0x334455, alpha: 0.44 });

  const leftGroup = new Container();
  const rightGroup = new Container();
  const leftGalaxy = createGalaxy(texture, LEFT_CENTER);
  const rightGalaxy = createGalaxy(texture, RIGHT_CENTER);

  leftGroup.addChild(leftGalaxy.particleContainer);
  rightGroup.addChild(rightGalaxy.particleContainer);

  const leftChip = createLabel(
    "parent.blendMode = 'normal'",
    LEFT_CENTER.x,
    156,
    {
      color: 0xffd4ea,
      fontWeight: '700',
    },
  );
  const rightChip = createLabel(
    "parent.blendMode = 'normal'",
    RIGHT_CENTER.x,
    156,
    {
      color: 0xffd4ea,
      fontWeight: '700',
    },
  );
  const caption = createLabel(
    'blend mode set on the parent — the ParticleContainer now inherits it',
    width / 2,
    552,
    {
      size: 15,
      color: 0x9fb6cf,
    },
  );

  app.stage.addChild(
    divider,
    leftGroup,
    rightGroup,
    leftChip,
    rightChip,
    caption,
  );

  const setRightMode = (mode) => {
    rightGroup.blendMode = mode;
    rightChip.text = `parent.blendMode = '${mode}'`;
    rightChip.style.fill = mode === 'add' ? 0x9dffe0 : 0xffd4ea;
  };

  const loop = gsap.timeline({ repeat: -1 });
  loop.call(() => setRightMode('add'), undefined, 1.5);
  loop.to(
    rightChip.scale,
    { x: 1.12, y: 1.12, duration: 0.16, yoyo: true, repeat: 1 },
    1.5,
  );
  loop.call(() => setRightMode('normal'), undefined, 4.5);
  loop.to(
    rightChip.scale,
    { x: 1.12, y: 1.12, duration: 0.16, yoyo: true, repeat: 1 },
    4.5,
  );
  loop.to({}, { duration: 6 });

  let elapsed = 0;

  app.ticker.add((time) => {
    elapsed += time.deltaTime / 60;
    leftGalaxy.sync(elapsed);
    rightGalaxy.sync(elapsed);
  });
})();
