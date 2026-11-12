import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import ClayShape from '@site/src/components/ui/Clay';
import { gsap } from '@site/src/motion/gsap';
import { motionAllowed } from '@site/src/motion/pause';
import { useClayField } from '@site/src/motion/useClayField';
import { runLiveCanvas } from './liveCanvas';
import styles from './styles';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  posterBlobs,
  RIM_REACH,
  SHADOW_GROW,
  SPECK_DRIFT_X,
  SPECK_DRIFT_Y,
  speckAlpha,
  specks,
} from './poster';
import { heightAt, mirrored, POSTER_SHAPES } from './posterShapes';

import type { ClayShapeName } from '@site/src/components/ui/Clay';
import type { CSSProperties, Ref, RefObject } from 'react';
import type { Field, FieldBounds, ShapeSeed } from './field/createField';
import type { ShapeKind, ShapeTint } from './field/kinds';
import type { PosterSpot } from './posterShapes';

export interface HeroFieldHandle {
  /**
   * Puffs the shapes up and shoves them outward, one after another, from `from`, such as the word that asked for it.
   * Does nothing under reduced motion and Pause motion, or before the field has loaded.
   */
  pump(from?: Element | null): void;
}

interface HeroFieldProps {
  /** The copy block; each of its children is a block the shapes keep clear of, line by line where it's marked `data-lines` */
  guard: RefObject<HTMLElement | null>;
  /** Stands the composition the other way round from 720 px of content, so a page that shares it has its own */
  mirror?: boolean;
  ref?: Ref<HeroFieldHandle>;
  className?: string;
}

const PUFF_TIME = 1.8;
/** How long a poster image takes to give way to its live shape */
const HANDOVER = 0.16;
/** A lost WebGL context is given this long before the field starts over */
const RECOVER_AFTER = 1;

/**
 * The top bar's nav pill, which floats over the hero from 768 px, and the GitHub button beside it; below that the
 * bar runs right across the top.
 */
const NAV_PILL = 'header nav[aria-label="Main"]';
const BESIDE_PILL = 'header a[aria-label="GitHub"]';

const shows = (element: Element): boolean =>
  getComputedStyle(element).visibility !== 'hidden' && element.getBoundingClientRect().width > 0;

/** An element's layout box in the field's pixels; transforms (the scroll-out) are left out on purpose */
function layoutBox(element: HTMLElement, field: HTMLElement): DOMRectReadOnly {
  let x = 0;
  let y = 0;

  for (let node: HTMLElement | null = element; node && node !== field.offsetParent;) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return new DOMRectReadOnly(x - field.offsetLeft, y - field.offsetTop, element.offsetWidth, element.offsetHeight);
}

/**
 * A block of the copy as the boxes shapes keep clear of: one per line of its `data-lines` wrapper, so a shape can
 * stand beside a short line, or else the block's own. An inline box's fragments are the lines themselves, whatever
 * its letters are doing mid-wave, and placing them against the block takes the scroll-out back out.
 */
function lineBoxes(block: HTMLElement, field: HTMLElement): DOMRectReadOnly[] {
  const box = layoutBox(block, field);
  const lines = block.querySelector('[data-lines]')?.getClientRects();

  if (!lines?.length) return [box];
  const frame = block.getBoundingClientRect();

  return Array.from(
    lines,
    (line) => new DOMRectReadOnly(box.x + line.x - frame.x, box.y + line.y - frame.y, line.width, line.height),
  );
}

/** The copy, the Pause motion control and the top bar, and the wave rising into the field's bottom edge */
function boundsOf(copy: HTMLElement, field: HTMLElement): FieldBounds {
  const hero = field.parentElement;
  const controls = hero ? Array.from(hero.querySelectorAll<HTMLElement>(`.${styles.pause}`)) : [];
  const pill = document.querySelector(NAV_PILL);
  const floating =
    pill && shows(pill) ? [pill, ...Array.from(document.querySelectorAll(BESIDE_PILL))].filter(shows) : [];
  // The hero itself never transforms, so against it a fixed bar is where it floats with the page at the top
  const frame = (hero ?? field).getBoundingClientRect();
  const bar = floating.map((piece) => {
    const rect = piece.getBoundingClientRect();

    return new DOMRectReadOnly(rect.x - frame.x, rect.y - frame.y - window.scrollY, rect.width, rect.height);
  });

  return {
    rects: [
      ...Array.from(copy.children as HTMLCollectionOf<HTMLElement>).flatMap((block) => lineBoxes(block, field)),
      ...controls.filter((control) => control.offsetWidth > 0).map((control) => layoutBox(control, field)),
      ...bar,
    ],
    top: bar.length ? 0 : parseFloat(getComputedStyle(field).getPropertyValue('--px-topbar-h')) || 0,
    bottom: hero?.querySelector(`.${styles.wave} svg`)?.getBoundingClientRect().height ?? 0,
  };
}

/** The poster's shapes showing in this band, where they stand, for the field to pick up */
const seedsOf = (layer: HTMLElement): ShapeSeed[] =>
  Array.from(layer.querySelectorAll<HTMLElement>('[data-kind]'))
    .map((shape, slot) => ({ shape, slot }))
    .filter(({ shape }) => shape.offsetWidth > 0)
    .map(({ shape, slot }) => ({
      slot,
      kind: shape.dataset.kind as ShapeKind,
      tint: shape.dataset.tint as ShapeTint,
      x: layer.offsetLeft + shape.offsetLeft + shape.offsetWidth / 2,
      y: layer.offsetTop + shape.offsetTop + shape.offsetHeight / 2,
      size: shape.offsetWidth,
      depth: POSTER_SHAPES[slot].depth,
    }));

const MIRRORED_SHAPES = POSTER_SHAPES.map(mirrored);

const spot = (prefix: string, at?: PosterSpot) =>
  at && {
    [`--${prefix}x`]: `${at[0]}%`,
    [`--${prefix}y`]: typeof at[1] === 'number' ? `${at[1]}%` : at[1],
    [`--${prefix}s`]: at[2],
  };

/** A failed field leaves the poster up, and its shapes bob (`useClayField`) */
function PosterMotion({ layer }: { layer: RefObject<HTMLElement | null> }) {
  useClayField(layer, { entrance: false });

  return null;
}

/**
 * The hero's shape field (section 8.1). The server renders the poster: the backdrop's blobs and specks at their
 * first frame, and the clay shapes as images. After hydration, once the browser is idle and the hero is on screen,
 * the live WebGL field loads (`home-field` chunk) with every shape where the poster has it, and each image gives
 * way to a live shape in the same pose, which swells a little as it wakes. Save-Data and `prefers-reduced-data` keep
 * the poster and never load the chunk; reduced motion and a paused page keep it until motion is allowed. Without WebGL2
 * the chunk isn't loaded either, and the poster's clay comes alive instead. A field whose WebGL context is lost goes
 * back to its poster and starts over.
 */
export default function HeroField({ guard, mirror, ref, className }: HeroFieldProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const shapes = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const field = useRef<Field | null>(null);
  const state = useRef({ puff: 0 }).current;
  const { colorMode } = useColorMode();
  const theme = useRef(colorMode);
  const [failed, setFailed] = useState(false);

  theme.current = colorMode;

  useEffect(() => {
    field.current?.setTheme(colorMode);
  }, [colorMode]);

  const [controls] = useState((): HeroFieldHandle => ({
    pump(from) {
      const box = root.current?.getBoundingClientRect();
      const rect = from?.getBoundingClientRect();

      if (!field.current || !motionAllowed()) return;
      // Only between puffs, or the shapes still swelling would jump to their new place in the order
      if (box && rect && !gsap.isTweening(state)) {
        field.current.setOrigin(rect.x + rect.width / 2 - box.x, rect.y + rect.height / 2 - box.y);
      }
      gsap.fromTo(
        state,
        { puff: 0 },
        {
          puff: 1,
          duration: PUFF_TIME,
          ease: 'none',
          onUpdate: () => field.current?.setPuff(state.puff),
          overwrite: true,
        },
      );
    },
  }));

  useImperativeHandle(ref, () => controls, [controls]);

  useEffect(() => {
    const element = root.current;
    const canvasHost = host.current;
    const copy = guard.current;
    const layer = shapes.current;
    const hero = element?.parentElement;

    if (!element || !canvasHost || !copy || !layer || !hero) return undefined;
    const images = Array.from(layer.querySelectorAll<HTMLElement>('[data-kind]'));
    const settle = () => {
      gsap.killTweensOf(state);
      state.puff = 0;
      field.current?.setPuff(0);
    };
    const run = runLiveCanvas(element, field, {
      name: 'hero field',
      load: () => import(/* webpackChunkName: "home-field" */ './field/createField'),
      create: ({ createField }, onLost) =>
        createField(canvasHost, {
          theme: theme.current,
          seeds: seedsOf(layer),
          bounds: boundsOf(copy, element),
          onLost,
        }),
      show(created) {
        created.canvas.className = styles.canvas;
        canvasHost.appendChild(created.canvas);
        // Each image fades out from the very frame its live twin wakes in its place
        created.intro((slot) => gsap.to(images[slot], { autoAlpha: 0, duration: HANDOVER, ease: 'none' }));
        created.setScroll(-hero.getBoundingClientRect().top);
      },
      // The poster comes back, the way a field with nothing to hand over from picks it up
      restore() {
        settle();
        gsap.set(images, { autoAlpha: 1 });
      },
      retryAfter: RECOVER_AFTER,
      fail: () => setFailed(true),
      motionChanged() {
        if (!motionAllowed()) settle();
        else field.current?.setBounds(boundsOf(copy, element));
      },
    });

    if (!run) return undefined;
    let box = element.getBoundingClientRect();
    const resize = new ResizeObserver(() => {
      box = element.getBoundingClientRect();
      field.current?.setBounds(boundsOf(copy, element));
      field.current?.setHomes(seedsOf(layer));
    });
    const scrolled = () => {
      box = element.getBoundingClientRect();
      field.current?.setScroll(-hero.getBoundingClientRect().top);
    };
    const point = (event: PointerEvent) => {
      if (run.onScreen) field.current?.setPointer(event.clientX - box.left, event.clientY - box.top);
    };

    resize.observe(element);
    resize.observe(copy);
    window.addEventListener('scroll', scrolled, { passive: true });
    window.addEventListener('pointermove', point, { passive: true });
    window.addEventListener('pointerdown', point, { passive: true });

    return () => {
      run.stop();
      resize.disconnect();
      window.removeEventListener('scroll', scrolled);
      window.removeEventListener('pointermove', point);
      window.removeEventListener('pointerdown', point);
      gsap.killTweensOf(state);
    };
  }, [guard, state]);

  return (
    <div ref={root} className={clsx(styles.field, className)} aria-hidden="true">
      <div className={styles.poster}>
        <svg
          className={styles.blobs}
          viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <linearGradient id={`${id}rim`} x2="0" y2="1">
              <stop offset="0" className={styles.rimStart} />
              <stop offset={RIM_REACH} className={styles.rimEnd} />
            </linearGradient>
            <radialGradient id={`${id}shade`}>
              <stop offset={1 / SHADOW_GROW} className={styles.shadeStart} />
              <stop offset="1" className={styles.shadeEnd} />
            </radialGradient>
          </defs>
          {posterBlobs.map(({ body, shadow }, index) => (
            <g key={index}>
              <path d={shadow} fill={`url(#${id}shade)`} />
              <path d={body} style={{ fill: `var(--blob-${index})` }} />
              <path d={body} fill={`url(#${id}rim)`} />
            </g>
          ))}
        </svg>
        <div className={styles.grid} />
        <div className={styles.shade} />
        {specks.map((speck, index) => (
          <span
            key={index}
            className={styles.speck}
            style={
              {
                left: `calc(${(speck.x * 100).toFixed(2)}% + ${(Math.sin(speck.phase) * SPECK_DRIFT_X).toFixed(1)}px)`,
                top: `calc(${(speck.y * 100).toFixed(2)}% + ${(Math.cos(speck.phase) * SPECK_DRIFT_Y).toFixed(1)}px)`,
                width: `${(speck.radius * 2).toFixed(1)}px`,
                opacity: speckAlpha(speck, 0).toFixed(2),
                '--speck': `#${speck.color.toString(16).padStart(6, '0')}`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div ref={host} className={styles.canvasHost} />
      <div ref={shapes} className={styles.shapes}>
        {(mirror ? MIRRORED_SHAPES : POSTER_SHAPES).map(
          ({ shape, wide, mid, compact, narrow, narrowTall, compactShort, depth }, index) => {
            const [kind, tint] = shape.split('-');

            return (
              <span
                key={index}
                className={clsx(
                  styles.posterShape,
                  !wide && styles.wideHide,
                  !mid && styles.midHide,
                  !compact && styles.compactHide,
                  !narrow && styles.narrowHide,
                  narrowTall && styles.narrowTall,
                  compactShort && styles.compactShort,
                )}
                data-kind={kind}
                data-tint={tint}
                style={
                  {
                    ...spot('', wide),
                    ...spot('m', mid),
                    ...spot('c', compact),
                    ...spot('cs', compactShort),
                    ...spot('n', narrow),
                    '--h': heightAt(depth),
                  } as CSSProperties
                }
              >
                {/* A bunny's image isn't in the `ui/Clay` set; `hero.scss` supplies it */}
                <ClayShape shape={shape as ClayShapeName} depth={0.4} className={clsx(failed && styles.posterLive)} />
              </span>
            );
          },
        )}
      </div>
      {failed && <PosterMotion layer={shapes} />}
    </div>
  );
}
