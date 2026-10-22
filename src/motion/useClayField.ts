import { CLAY_SHAPES } from '@site/src/components/ui/Clay';
import { EASE, gsap, ScrollTrigger } from './gsap';
import { isMotionPaused, onMotionPause } from './pause';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

/** The flat set's tints (`static/assets/standard`), in a boop's order */
const FLAT_TINTS = ['pink', 'purple', 'blue', 'green', 'orange'];
const CONFETTI = ['#e91e63', '#f06695', '#8b5cf6', '#38bdf8'];
const SHY_RADIUS = 140;
/** Each shape drifts this many px and back every 6-8 s */
const BOB_RISE = 6;
const bobPeriod = (i: number) => 6 + (i % 5) * 0.5;
const SHY_PUSH = 24;

/** A boop moves a shape to the next tint of its kind */
function nextTint(shape: string): string {
  const [kind, tint, style] = shape.split('-');

  if (style) return `${kind}-${FLAT_TINTS[(FLAT_TINTS.indexOf(tint) + 1) % FLAT_TINTS.length]}-${style}`;
  const tints: readonly string[] = CLAY_SHAPES.filter((name) => name.startsWith(`${kind}-`));

  return tints[(tints.indexOf(shape) + 1) % tints.length] ?? shape;
}

interface ClayFieldOptions {
  /** Spring the shapes in when the band enters; off for shapes that are already on show */
  entrance?: boolean;
}

/** Each behaviour's share of one shape's transform; `renderShape` sums them into GSAP's x, y, rotation and scale */
interface ClayState {
  parallaxY: number;
  parallaxTurn: number;
  shyX: number;
  shyY: number;
  scale: number;
  turn: number;
  squashX: number;
  squashY: number;
}

/**
 * M12 for the `.clay` shapes inside one band: each springs in as it comes on screen and drifts with the scroll by its
 * `data-depth` (0.3-1.2), and they bob while on screen, shy away from a fine pointer and can be booped.
 *
 * The behaviours overlap on the same channels (three move y, three turn the shape), so each tweens its own field of a
 * plain state object and one ticker callback, running while any shape is on screen, writes the sums through GSAP's
 * transform cache. Other GSAP tweens on a `.clay` stay free to use the remaining channels, such as `rotationY`.
 */
export function useClayField(band: RefObject<HTMLElement | null>, { entrance = true }: ClayFieldOptions = {}): void {
  useMotion(band, (root, { fine, paused, safe }) => {
    const shapes = gsap.utils.toArray<HTMLElement>('.clay', root);

    if (!shapes.length) return undefined;
    const states: ClayState[] = shapes.map(() => ({
      parallaxY: 0,
      parallaxTurn: 0,
      shyX: 0,
      shyY: 0,
      scale: 1,
      turn: 0,
      squashX: 1,
      squashY: 1,
    }));
    const setters = shapes.map((shape) => ({
      x: gsap.quickSetter(shape, 'x', 'px'),
      y: gsap.quickSetter(shape, 'y', 'px'),
      rotation: gsap.quickSetter(shape, 'rotation', 'deg'),
      scaleX: gsap.quickSetter(shape, 'scaleX'),
      scaleY: gsap.quickSetter(shape, 'scaleY'),
    }));
    // The bob is a sine on its own clock rather than a looping tween: a tween seeked to its phase during setup can
    // start seconds late if the global timeline is paused (Pause motion) at the time
    let clock = 0;
    const renderShape = (i: number) => {
      const state = states[i];
      const set = setters[i];
      const bob = BOB_RISE / 2 - (BOB_RISE / 2) * Math.cos(2 * Math.PI * (clock / bobPeriod(i) + i * 0.145));

      set.x(state.shyX);
      set.y(state.parallaxY + bob + state.shyY);
      set.rotation(state.parallaxTurn + state.turn);
      set.scaleX(state.scale * state.squashX);
      set.scaleY(state.scale * state.squashY);
    };
    const render = (_time?: number, deltaMs = 0) => {
      if (!gsap.globalTimeline.paused()) clock += deltaMs / 1000;
      states.forEach((_, i) => renderShape(i));
    };

    // The ticker runs while any shape is on screen, which a shape on a band's seam can be after the band has gone.
    // Pause motion disables the scrubs without firing their onToggle, so it stops the ticker here; resuming fires it.
    const showing = new Set<number>();
    const onScreen = (i: number, active: boolean) => {
      if (active) showing.add(i);
      else showing.delete(i);
      if (showing.size && !isMotionPaused()) gsap.ticker.add(render);
      else gsap.ticker.remove(render);
    };
    const offPause = onMotionPause((nowPaused) => {
      if (nowPaused) gsap.ticker.remove(render);
    });

    // Each shape enters, and drifts, by its own place on the screen: a shape on a seam or a corner is at rest as
    // that crosses the middle of the screen, however tall its band. One already on screen has been seen, so it stays.
    shapes.forEach((shape, i) => {
      const depth = Number(shape.dataset.depth ?? 0.6);

      if (entrance && !paused && shape.getBoundingClientRect().top >= innerHeight) {
        const intro = gsap
          .timeline({ paused: true })
          .from(states[i], { scale: 0.6, turn: -20, duration: 0.6, ease: EASE.spring }, 0)
          .from(shape, { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0);

        ScrollTrigger.create({ trigger: shape, start: 'top 92%', once: true, onEnter: () => void intro.play() });
      }
      const drift = gsap.fromTo(
        states[i],
        { parallaxY: 60 * depth, parallaxTurn: 0 },
        {
          parallaxY: -60 * depth,
          parallaxTurn: (i % 2 ? 8 : -8) * depth,
          ease: 'none',
          // Off screen too, so a shape the scroll jumps past still settles where it belongs
          onUpdate: () => renderShape(i),
          scrollTrigger: {
            trigger: shape,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onToggle: (self) => onScreen(i, self.isActive),
          },
        },
      );

      onScreen(i, !!drift.scrollTrigger?.isActive);
    });
    render();

    const stop = () => {
      offPause();
      gsap.ticker.remove(render);
      gsap.set(shapes, { clearProps: 'transform' });
    };

    if (!fine) return stop;

    let frame = 0;
    let pointer = { x: 0, y: 0 };

    const shy = safe(() => {
      frame = 0;
      if (!showing.size) return;
      shapes.forEach((shape, i) => {
        const state = states[i];
        const rect = shape.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - state.shyX - pointer.x;
        const dy = rect.top + rect.height / 2 - state.shyY - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < SHY_RADIUS) {
          const k = (SHY_PUSH * (1 - distance / SHY_RADIUS)) / (distance || 1);

          gsap.to(state, { shyX: dx * k, shyY: dy * k, duration: 0.4, overwrite: 'auto' });
        } else if (state.shyX || state.shyY) {
          gsap.to(state, { shyX: 0, shyY: 0, duration: 1, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        }
      });
    });
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      frame ||= requestAnimationFrame(shy);
    };

    const burst = (shape: HTMLElement) => {
      const layer = (shape.offsetParent as HTMLElement | null) ?? root;
      const box = layer.getBoundingClientRect();
      const rect = shape.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - box.left;
      const y = rect.top + rect.height / 2 - box.top;

      for (let i = 0; i < 10; i++) {
        const dot = document.createElement('span');

        Object.assign(dot.style, {
          position: 'absolute',
          left: '0',
          top: '0',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: CONFETTI[i % CONFETTI.length],
          pointerEvents: 'none',
        });
        layer.appendChild(dot);
        gsap.fromTo(
          dot,
          { x: x - 3, y: y - 3, scale: 1, autoAlpha: 1 },
          {
            x: x - 3 + gsap.utils.random(-80, 80),
            y: y - 3 + gsap.utils.random(-80, 80),
            scale: 0.4,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power3.out',
            onComplete: () => dot.remove(),
          },
        );
      }
    };
    const boop = safe((event: MouseEvent) => {
      const shape = (event.target as Element).closest<HTMLElement>('.clay');

      const state = shape && states[shapes.indexOf(shape)];

      if (!shape || !state) return;
      // The tint changes at the bottom of the squash, as the spin starts, where the motion hides the cut
      gsap
        .timeline()
        .to(state, { squashX: 1.25, squashY: 0.8, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
        .call(() => {
          if (shape.dataset.shape) shape.dataset.shape = nextTint(shape.dataset.shape);
        })
        .to(state, { squashX: 1, squashY: 1, turn: '+=360', duration: 0.9, ease: EASE.elastic });
      burst(shape);
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('click', boop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('click', boop);
      stop();
    };
  });
}
