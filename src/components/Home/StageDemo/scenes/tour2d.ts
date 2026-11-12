import { gsap } from 'gsap';
import { BlurFilter, ColorMatrixFilter, Container, FillGradient, Graphics, SplitText, Sprite } from 'pixi.js';
import 'pixi.js/filters';
import { COLORS, createHud, createStageApp, DESIGN, loadSprites, measure, seeded, STAGE_INK } from './core';

import type { Frame, SceneOptions, SpriteName, StageScene, StageTheme } from './core';
import type { Application, FederatedPointerEvent, Text, Texture } from 'pixi.js';

/**
 * The `/2d` tour (section 8.5): four small scenes in one pixi.js app, cut between with a crossfade. It imports
 * nothing from `@pixi/3d`, so its chunk stays pixi-only.
 */

type Tab = 'sprites' | 'graphics' | 'text' | 'filters';

const TABS: Tab[] = ['sprites', 'graphics', 'text', 'filters'];
const CUT_SECONDS = 0.35;
/** Scene time of the still pose: what posters, reduced motion and Pause motion show */
const STILL_TIME = 1.4;
const INK: Record<StageTheme, number> = { dark: 0xffffff, light: 0x16131f };
/** The cuts keep to the middle of the 1280×960 design, so a square card can crop the rest and show them larger */
const SAFE = { width: 1100, height: 800 };
/** Room the HUD's line takes at the bottom of the card, in CSS pixels */
const HUD_BAND = 44;

function fit(width: number, height: number): Frame {
  const unit = Math.min(width / SAFE.width, height / SAFE.height);

  return {
    ...measure(width, height),
    unit,
    x: (designX) => width / 2 + (designX - DESIGN.width / 2) * unit,
    y: (designY) => height / 2 + (designY - DESIGN.height / 2) * unit,
  };
}

/** What every cut reads from the scene; `frame`, `theme` and `motion` change over its life */
interface Stage {
  app: Application;
  textures: Record<SpriteName, Texture>;
  frame: Frame;
  theme: StageTheme;
  motion: boolean;
  /** Redraws once when the ticker is stopped */
  invalidate(): void;
}

interface Cut {
  root: Container;
  /** What the HUD reports after the renderer and frame rate */
  label(): string;
  /** Fits the cut to `stage.frame` */
  layout(): void;
  /** `frames` is the step in 60 fps frames, 0 in the still pose */
  update(time: number, frames: number): void;
  /** Plays the cut's entrance; only called with motion on */
  enter?(): void;
  /** Ends every tween at its resting value */
  rest(): void;
  retheme?(): void;
  tap?(event: FederatedPointerEvent): void;
  /** Pointer position in card pixels, or `null` once it has left */
  point?(position: { x: number; y: number } | null): void;
  destroy?(): void;
}

// ---------- Sprites: a small bunnymark ----------

interface Bunny {
  sprite: Sprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const BUNNIES = { start: 300, add: 200, max: 2000, maxCoarse: 600, height: 64 };
const BUNNY_TINTS = [0xffffff, 0xffc2d8, 0xd6ccff, 0xb9e6ff];
const GRAVITY = 0.75;

function spritesCut(stage: Stage): Cut {
  const root = new Container();
  const random = seeded(7);
  const max = window.matchMedia('(pointer: coarse)').matches ? BUNNIES.maxCoarse : BUNNIES.max;
  const bunnies: Bunny[] = [];
  let width = stage.frame.width;
  let height = stage.frame.height;
  let batch = 0;

  /** Moves one bunny by `frames` 60 fps frames; speeds are bunnymark's pixels per frame at a 640 px wide card */
  function step(bunny: Bunny, frames: number) {
    const speed = (width / 640) * frames;
    const ground = height - HUD_BAND;
    const half = BUNNIES.height * stage.frame.unit * 0.35;

    bunny.vy += GRAVITY * frames;
    bunny.x += bunny.vx * speed;
    bunny.y += bunny.vy * speed;
    if (bunny.x > width - half) {
      bunny.vx = -Math.abs(bunny.vx);
      bunny.x = width - half;
    } else if (bunny.x < half) {
      bunny.vx = Math.abs(bunny.vx);
      bunny.x = half;
    }
    if (bunny.y > ground) {
      bunny.vy *= -0.85;
      bunny.y = ground;
      if (random() > 0.5) bunny.vy -= random() * 6;
    } else if (bunny.y < half * 2) {
      bunny.vy = Math.abs(bunny.vy) * 0.5;
      bunny.y = half * 2;
    }
  }

  /** A burst from `at`, or bunnies already mid-bounce across the card: the opening crowd and the still pose */
  function add(count: number, at?: { x: number; y: number }) {
    const tint = BUNNY_TINTS[batch++ % BUNNY_TINTS.length];
    const scale = (BUNNIES.height * stage.frame.unit) / stage.textures.bunny.height;

    for (let i = 0; i < count && bunnies.length < max; i++) {
      const sprite = new Sprite({ texture: stage.textures.bunny, anchor: { x: 0.5, y: 1 }, tint, scale });
      const bunny = at
        ? { sprite, x: at.x, y: at.y, vx: (random() - 0.5) * 18, vy: -3 - random() * 11 }
        : { sprite, x: random() * width, y: height * 0.2, vx: random() * 10 - 5, vy: random() * 5 };

      if (!at) for (let frames = 30 + random() * 300; frames > 0; frames--) step(bunny, 1);
      sprite.position.set(bunny.x, bunny.y);
      bunnies.push(bunny);
      root.addChild(sprite);
    }
  }

  add(BUNNIES.start);

  return {
    root,
    label: () => `${bunnies.length} BUNNIES`,
    layout() {
      const { frame } = stage;
      const scale = (BUNNIES.height * frame.unit) / stage.textures.bunny.height;

      for (const bunny of bunnies) {
        bunny.x *= frame.width / width;
        bunny.y *= frame.height / height;
        bunny.sprite.scale.set(scale);
        bunny.sprite.position.set(bunny.x, bunny.y);
      }
      ({ width, height } = frame);
    },
    update(_time, frames) {
      if (!frames) return;
      for (const bunny of bunnies) {
        step(bunny, frames);
        bunny.sprite.position.set(bunny.x, bunny.y);
      }
    },
    rest() {},
    tap(event) {
      add(BUNNIES.add, stage.motion ? event.global : undefined);
      stage.invalidate();
    },
  };
}

// ---------- Graphics: vector shapes redrawn every frame ----------

const BLOB = { x: 660, y: 650, radius: 150, points: 7, reach: 110 };

function graphicsCut(stage: Stage): Cut {
  const root = new Container();
  const gradient = new FillGradient({
    type: 'linear',
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    colorStops: [
      { offset: 0, color: COLORS.pink },
      { offset: 1, color: COLORS.violet },
    ],
    textureSpace: 'local',
  });
  const star = new Graphics();
  const tile = new Graphics().roundRect(-122, -122, 244, 244, 62).fill(gradient);
  const blob = new Graphics();
  const ring = new Graphics().circle(0, 0, 66).stroke({ width: 30, color: COLORS.violet });
  const squiggle = new Graphics();
  const dots = [COLORS.sky, COLORS.violet, 0xf06695].map((color) => new Graphics().circle(0, 0, 13).fill(color));
  const parts = [blob, star, tile, ring, squiggle, ...dots];
  const pops = parts.map(() => ({ scale: 1 }));
  const pull = { x: 0, y: 0, tx: 0, ty: 0 };

  star.position.set(300, 500);
  tile.position.set(950, 400);
  ring.position.set(1085, 735);
  squiggle.position.set(170, 790);
  root.addChild(...parts);

  /** A closed curve through points on a wobbling circle, stretched toward the pointer */
  function drawBlob(time: number) {
    const points = Array.from({ length: BLOB.points }, (_, i) => {
      const angle = (i / BLOB.points) * Math.PI * 2;
      const toward = Math.cos(angle - Math.atan2(pull.y, pull.x)) * Math.hypot(pull.x, pull.y) * 0.55;
      const radius = BLOB.radius * (1 + 0.13 * Math.sin(time * 1.5 + i * 1.9)) + Math.max(0, toward);

      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    });
    const at = (i: number) => points[(i + points.length) % points.length];

    blob.clear().moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
      const next = at(i + 1);

      blob.bezierCurveTo(
        point.x + (next.x - at(i - 1).x) / 6,
        point.y + (next.y - at(i - 1).y) / 6,
        next.x - (at(i + 2).x - point.x) / 6,
        next.y - (at(i + 2).y - point.y) / 6,
        next.x,
        next.y,
      );
    });
    blob.fill(COLORS.sky);
  }

  function drawSquiggle(time: number) {
    squiggle.clear().moveTo(0, 0);
    for (let i = 0; i < 4; i++) {
      const lift = (i % 2 ? 26 : -26) * (0.7 + 0.3 * Math.sin(time * 2.2 + i));

      squiggle.bezierCurveTo(i * 64 + 20, lift, i * 64 + 44, lift, (i + 1) * 64, 0);
    }
    squiggle.stroke({ width: 15, color: COLORS.pink, cap: 'round', join: 'round' });
  }

  return {
    root,
    label: () => `${parts.length} GRAPHICS`,
    layout() {
      root.position.set(stage.frame.x(0), stage.frame.y(0));
      root.scale.set(stage.frame.unit);
    },
    update(time, frames) {
      const ease = 1 - 0.86 ** frames;

      pull.x += (pull.tx - pull.x) * ease;
      pull.y += (pull.ty - pull.y) * ease;
      star
        .clear()
        .star(0, 0, 5, 150, 66 + Math.sin(time * 1.8) * 14)
        .fill(COLORS.pink);
      star.rotation = time * 0.35;
      tile.rotation = Math.sin(time * 0.7) * 0.4 + 0.2;
      blob.position.set(BLOB.x + pull.x * 0.45, BLOB.y + pull.y * 0.45);
      drawBlob(time);
      drawSquiggle(time);
      dots.forEach((dot, i) => {
        const angle = time * (0.9 + i * 0.25) + i * 2.1;

        dot.position.set(star.x + Math.cos(angle) * (188 + i * 14), star.y + Math.sin(angle) * (188 + i * 14));
      });
      const pulse = 1 + Math.sin(time * 2) * 0.06;

      parts.forEach((part, i) => part.scale.set(pops[i].scale * (part === ring ? pulse : 1)));
    },
    enter() {
      gsap.fromTo(pops, { scale: 0 }, { scale: 1, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.05 });
    },
    rest() {
      gsap.killTweensOf(pops);
      pops.forEach((pop) => (pop.scale = 1));
      Object.assign(pull, { x: 0, y: 0, tx: 0, ty: 0 });
    },
    point(position) {
      const { frame } = stage;
      const dx = position ? (position.x - frame.x(BLOB.x)) / frame.unit : 0;
      const dy = position ? (position.y - frame.y(BLOB.y)) / frame.unit : 0;
      const reach = Math.min(1, BLOB.reach / (Math.hypot(dx, dy) || 1));

      pull.tx = dx * reach;
      pull.ty = dy * reach;
      if (!stage.motion) {
        Object.assign(pull, { x: pull.tx, y: pull.ty });
        stage.invalidate();
      }
    },
    // The tile goes before its gradient: a texture destroyed while a shape still draws with it logs a warning
    destroy() {
      root.destroy({ children: true });
      gradient.destroy();
    },
  };
}

// ---------- Text: SplitText, one Text per character ----------

const WORD = { text: 'PixiJS', accentFrom: 4, size: 330, y: 500 };

function textCut(stage: Stage): Cut {
  const root = new Container();
  const title = new SplitText({
    text: WORD.text,
    style: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: WORD.size,
      fontWeight: '700',
      fill: 0xffffff,
      letterSpacing: -6,
    },
    charAnchor: { x: 0.5, y: 0.6 },
  });
  const underline = new Graphics();
  const chars = title.chars.map((char: Text, i) => ({ char, home: char.y, lift: 0, spin: 0, squash: 0, show: 1, i }));

  title.pivot.set(title.width / 2, title.height / 2);
  title.position.set(640, WORD.y);
  underline.position.set(640, WORD.y + title.height * 0.5);
  root.addChild(underline, title);

  chars.forEach((state) => {
    state.char.eventMode = 'static';
    state.char.cursor = 'pointer';
    state.char.on('pointertap', () => {
      if (!stage.motion) {
        state.spin += Math.PI * 2;

        return;
      }
      gsap
        .timeline()
        .to(state, { lift: 120, duration: 0.32, ease: 'power2.out' })
        .to(state, { lift: 0, duration: 0.7, ease: 'bounce.out' });
      gsap.to(state, { spin: `+=${Math.PI * 2}`, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo(state, { squash: 0.3 }, { squash: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  function retheme() {
    chars.forEach(({ char, i }) => (char.tint = i < WORD.accentFrom ? INK[stage.theme] : COLORS.pink));
  }

  retheme();

  return {
    root,
    label: () => `${chars.length} CHARS`,
    layout() {
      root.position.set(stage.frame.x(0), stage.frame.y(0));
      root.scale.set(stage.frame.unit);
    },
    update(time) {
      chars.forEach(({ char, home, lift, spin, squash, show, i }) => {
        const wave = Math.sin(time * 3.2 - i * 0.7);

        char.y = home - wave * 26 - lift + (1 - show) * 150;
        char.rotation = spin + Math.cos(time * 3.2 - i * 0.7) * 0.05;
        char.scale.set((1 + squash) * show, (1 - squash) * show);
        char.alpha = Math.min(1, show * 1.4);
      });
      const half = title.width * 0.3;

      underline.clear().moveTo(-half, 0);
      for (let i = 0; i < 6; i++) {
        const x = -half + (i * half) / 3;
        const lift = (i % 2 ? 20 : -20) * (0.75 + 0.25 * Math.sin(time * 2.4 + i));

        underline.bezierCurveTo(x + half / 9, lift, x + (half * 2) / 9, lift, x + half / 3, 0);
      }
      underline.stroke({ width: 13, color: COLORS.pink, cap: 'round', join: 'round' });
    },
    enter() {
      gsap.fromTo(chars, { show: 0 }, { show: 1, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.06 });
    },
    rest() {
      gsap.killTweensOf(chars);
      chars.forEach((state) => Object.assign(state, { lift: 0, squash: 0, show: 1 }));
    },
    retheme,
  };
}

// ---------- Filters: a blurred layer behind a hue-shifted one ----------

interface Monster {
  name: SpriteName;
  x: number;
  feet: number;
  height: number;
  rate: number;
}

const BACK: Monster[] = [
  { name: 'flowerTop', x: 370, feet: 640, height: 300, rate: 2 },
  { name: 'eggHead', x: 905, feet: 640, height: 285, rate: 2.3 },
];
const FRONT: Monster[] = [
  { name: 'bunny', x: 210, feet: 860, height: 150, rate: 3.4 },
  { name: 'helmlok', x: 560, feet: 865, height: 420, rate: 1.8 },
  { name: 'skully', x: 1010, feet: 865, height: 385, rate: 2.1 },
];
const BLUR = 7;

function filtersCut(stage: Stage): Cut {
  const root = new Container();
  const state = { focus: 0 };
  const hue = new ColorMatrixFilter();
  const blurs = [new BlurFilter({ strength: BLUR }), new BlurFilter({ strength: 0 })];
  /** Whether each layer's blur is in its filter list; a blur at zero strength is left out to save its passes */
  const blurred = [false, false];

  const layers = [BACK, FRONT].map((monsters) => {
    const layer = new Container();
    const actors = monsters.map((monster) => {
      const texture = stage.textures[monster.name];
      const body = new Sprite({ texture, anchor: { x: 0.5, y: 1 } });
      const shadow = new Graphics().ellipse(0, 0, 1, 0.26).fill(0x000000);
      const actor = new Container({ children: [shadow, body], x: monster.x, y: monster.feet });

      shadow.scale.set(texture.width * (monster.height / texture.height) * 0.44);
      layer.addChild(actor);

      return { monster, body, shadow, base: monster.height / texture.height };
    });

    root.addChild(layer);

    return { layer, actors };
  });

  function applyFocus(force = false) {
    const strengths = [BLUR * (1 - state.focus), BLUR * state.focus];

    layers.forEach(({ layer }, i) => {
      const on = strengths[i] > 0.05;

      blurs[i].strength = strengths[i] * Math.max(0.6, stage.frame.unit * 2);
      if (on === blurred[i] && !force) return;
      blurred[i] = on;
      layer.filters = [...(i ? [hue] : []), ...(on ? [blurs[i]] : [])];
    });
  }

  function retheme() {
    layers.forEach(({ actors }) => actors.forEach(({ shadow }) => (shadow.alpha = STAGE_INK[stage.theme].shadow)));
  }

  retheme();
  applyFocus(true);

  return {
    root,
    label: () => `2 FILTERS · ${BACK.length + FRONT.length} SPRITES`,
    layout() {
      root.position.set(stage.frame.x(0), stage.frame.y(0));
      root.scale.set(stage.frame.unit);
    },
    update(time) {
      layers.forEach(({ actors }, depth) =>
        actors.forEach(({ monster, body, base }, i) => {
          const rise = Math.abs(Math.sin(time * monster.rate + i * 1.7 + depth));
          const squash = (1 - rise) ** 8 * 0.1;

          body.y = -rise * monster.height * (monster.name === 'bunny' ? 0.5 : 0.07);
          body.scale.set(base * (1 + squash * 0.7), base * (1 - squash));
          body.rotation = Math.sin(time * monster.rate * 0.5 + i) * 0.05;
        }),
      );
      hue.hue((time * 48) % 360, false);
      applyFocus();
    },
    rest() {
      gsap.killTweensOf(state);
      state.focus = Math.round(state.focus);
    },
    retheme,
    tap() {
      const focus = state.focus > 0.5 ? 0 : 1;

      if (stage.motion) {
        gsap.to(state, { focus, duration: 0.7, ease: 'power2.inOut' });
      } else {
        state.focus = focus;
        stage.invalidate();
      }
    },
    // The filters go before the renderer, which frees the textures they still hold
    destroy() {
      layers.forEach(({ layer }) => (layer.filters = null));
      [hue, ...blurs].forEach((filter) => filter.destroy());
    },
  };
}

// ---------- the scene ----------

const isTab = (id: string | undefined): id is Tab => TABS.includes(id as Tab);

export async function createScene(host: HTMLElement, options: SceneOptions): Promise<StageScene> {
  const { app, unobserve } = await createStageApp(host);
  const [textures, hud] = await Promise.all([
    loadSprites(),
    options.hud === false ? null : createHud(),
    Promise.race([
      document.fonts?.load(`700 ${WORD.size}px Outfit`, WORD.text),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]),
  ]);

  let tab: Tab = isTab(options.tab) ? options.tab : TABS[0];
  let time = STILL_TIME;
  let destroyed = false;
  let pending = 0;
  let lastSize = '';
  let hudAt = -1;
  let fade: gsap.core.Timeline | null = null;
  const startedAt = performance.now();

  const stage: Stage = {
    app,
    textures,
    frame: fit(app.screen.width, app.screen.height),
    theme: options.theme,
    motion: options.motion ?? true,
    invalidate() {
      if (stage.motion || pending || destroyed) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        update(0);
        app.render();
      });
    },
  };
  const cuts: Record<Tab, Cut> = {
    sprites: spritesCut(stage),
    graphics: graphicsCut(stage),
    text: textCut(stage),
    filters: filtersCut(stage),
  };
  const all = Object.values(cuts);

  app.canvas.style.touchAction = 'pan-y';
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.addChild(...all.map((each) => each.root));
  if (hud) app.stage.addChild(hud);
  app.stage.on('pointertap', (event) => cuts[tab].tap?.(event));
  app.stage.on('pointermove', (event) => cuts[tab].point?.(event.global));
  // pixi doesn't forward these: the pointer leaving the card, and a touch that turned into a page scroll
  for (const type of ['pointerleave', 'pointercancel']) {
    app.canvas.addEventListener(type, () => cuts[tab].point?.(null));
  }

  function update(frames: number) {
    const { width, height } = app.screen;
    const size = `${width}x${height}`;

    if (size !== lastSize) {
      lastSize = size;
      stage.frame = fit(width, height);
      all.forEach((each) => each.layout());
    }
    for (const each of all) if (each.root.visible) each.update(time, frames);
    if (!hud) return;
    const now = performance.now();

    if (!stage.motion || now - hudAt >= 250) {
      const parts = [app.renderer.name.toUpperCase()];

      hudAt = now;
      if (stage.motion && app.ticker.lastTime - startedAt > 600) parts.push(`${Math.round(app.ticker.FPS)} FPS`);
      hud.text = [...parts, cuts[tab].label()].join(' · ');
      hud.tint = STAGE_INK[stage.theme].hud;
    }
    hud.position.set(20, height - 18 - hud.height);
  }

  function show(next: Tab) {
    fade?.kill();
    all.forEach((each) => {
      each.root.visible = each === cuts[next];
      each.root.alpha = 1;
    });
  }

  app.ticker.add((ticker) => {
    const step = Math.min(ticker.deltaMS, 50);

    if (stage.motion) time += step / 1000;
    update(stage.motion ? step / (1000 / 60) : 0);
  });

  function applyMotion() {
    if (stage.motion) {
      app.ticker.start();

      return;
    }
    app.ticker.stop();
    time = STILL_TIME;
    all.forEach((each) => each.rest());
    show(tab);
    stage.invalidate();
  }

  // Draw every cut once while the canvas is still hidden, so no shader compiles in the middle of a cut
  all.forEach((each) => (each.root.visible = true));
  update(0);
  app.render();
  show(tab);
  update(0);
  app.render();
  applyMotion();

  return {
    setTab(id) {
      if (!isTab(id) || id === tab) return;
      const from = cuts[tab];
      const to = cuts[id];

      tab = id;
      hudAt = -1;
      if (!stage.motion) {
        show(id);
        stage.invalidate();

        return;
      }
      show(id);
      from.root.visible = true;
      fade = gsap
        .timeline({ defaults: { duration: CUT_SECONDS, ease: 'power1.inOut' } })
        .fromTo(from.root, { alpha: 1 }, { alpha: 0 }, 0)
        .fromTo(to.root, { alpha: 0 }, { alpha: 1 }, 0)
        .set(from.root, { visible: false });
      to.enter?.();
    },
    setActive(active) {
      if (!stage.motion) return;
      if (active) app.ticker.start();
      else app.ticker.stop();
    },
    setTheme(next) {
      stage.theme = next;
      all.forEach((each) => each.retheme?.());
      hudAt = -1;
      stage.invalidate();
    },
    setMotion(next) {
      if (next === stage.motion) return;
      stage.motion = next;
      applyMotion();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(pending);
      fade?.kill();
      all.forEach((each) => {
        each.rest();
        each.destroy?.();
      });
      unobserve();
      app.destroy({ removeView: true }, { children: true });
    },
  };
}
